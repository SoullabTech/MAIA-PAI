/**
 * MAIARealtimeSDK - Sovereign Voice System Core
 *
 * Unified SDK for real-time voice conversations with provider abstraction.
 *
 * Architecture:
 * Browser STT (FREE) → Claude LLM ($0.003) → OpenAI TTS ($0.015/1M chars)
 * = No rate limits, good voice quality, path to full sovereignty
 */

import { EventEmitter } from 'events';

export interface ProviderConfig {
  name: string;
  endpoint: string;
  apiKey?: string;
  priority: number;
  capabilities: ('stt' | 'llm' | 'tts')[];
  config?: Record<string, any>;
}

export interface SDKConfig {
  providers: ProviderConfig[];
  fallbackChain?: string[];
  costOptimization?: boolean;
  debug?: boolean;
}

export interface SessionSummary {
  id: string;
  startTime: number;
  endTime?: number;
  provider: {
    stt: string;
    llm: string;
    tts: string;
  };
  cost: {
    stt: number;
    llm: number;
    tts: number;
    total: number;
  };
  metrics: {
    latency: number[];
    errors: number;
    failovers: number;
  };
  transcript: Array<{ role: 'user' | 'assistant'; text: string; timestamp: number }>;
}

/**
 * Main SDK class for sovereign voice conversations
 */
export class MAIARealtimeSDK extends EventEmitter {
  private config: SDKConfig;
  private session: SessionSummary | null = null;
  private providers: Map<string, ProviderConfig> = new Map();
  private browserSTT: any = null;
  private isListening: boolean = false;

  constructor(config: SDKConfig) {
    super();
    this.config = config;

    // Register providers
    config.providers.forEach(p => {
      this.providers.set(p.name, p);
    });

    if (config.debug) {
      console.log('🚀 [MAIARealtimeSDK] Initialized with providers:',
        Array.from(this.providers.keys()));
    }
  }

  /**
   * Start a new conversation session
   */
  async startSession(instructions: string, voice?: string): Promise<void> {
    if (this.session) {
      throw new Error('Session already active');
    }

    const sttProvider = this.selectProvider('stt');
    const llmProvider = this.selectProvider('llm');
    const ttsProvider = this.selectProvider('tts');

    this.session = {
      id: `maia_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: Date.now(),
      provider: {
        stt: sttProvider.name,
        llm: llmProvider.name,
        tts: ttsProvider.name
      },
      cost: { stt: 0, llm: 0, tts: 0, total: 0 },
      metrics: { latency: [], errors: 0, failovers: 0 },
      transcript: []
    };

    if (this.config.debug) {
      console.log('🎙️ [MAIARealtimeSDK] Session started:', this.session.id);
      console.log('📊 [MAIARealtimeSDK] Using providers:', this.session.provider);
    }

    this.emit('session.started', {
      sessionId: this.session.id,
      providers: this.session.provider
    });
  }

  /**
   * Process audio from microphone
   */
  async processAudio(audioChunk: Float32Array): Promise<void> {
    if (!this.session) {
      throw new Error('No active session');
    }

    // Note: Browser STT is handled externally via Web Speech API
    // This method exists for compatibility with future local Whisper integration
    const startTime = Date.now();

    // Emit audio received event
    this.emit('audio.received', { size: audioChunk.length });

    // Track latency
    const latency = Date.now() - startTime;
    this.session.metrics.latency.push(latency);
  }

  /**
   * Process text from STT (called by browser STT or local Whisper)
   */
  async processText(userText: string): Promise<string> {
    if (!this.session) {
      throw new Error('No active session');
    }

    const startTime = Date.now();

    // Add to transcript
    this.session.transcript.push({
      role: 'user',
      text: userText,
      timestamp: Date.now()
    });

    // Emit STT completion
    this.emit('stt.completed', { text: userText });

    // Get LLM response via API (which uses Claude!)
    try {
      if (this.config.debug) {
        console.log('📤 [MAIARealtimeSDK] Sending to API:', {
          endpoint: '/api/oracle/personal',
          message: userText.substring(0, 50) + '...',
          sessionId: this.session.id
        });
      }

      const response = await fetch('/api/oracle/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: userText,  // Use 'input' which is the primary field
          userId: 'current-user',
          sessionId: this.session.id,
          modality: 'voice',  // CRITICAL: Tell API this is voice mode for fast path
          preferences: { isVoice: true }  // Alternative field check
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [MAIARealtimeSDK] API error:', response.status, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (this.config.debug) {
        console.log('📥 [MAIARealtimeSDK] API response:', {
          hasData: !!data,
          keys: Object.keys(data),
          fullResponse: data
        });
      }

      // Try multiple possible response fields
      const assistantText = data.text || data.response || data.message || data.data?.message || data.data?.response;

      // Add to transcript
      this.session.transcript.push({
        role: 'assistant',
        text: assistantText,
        timestamp: Date.now()
      });

      // Track cost (Claude: $0.003 per 1K tokens, ~750 chars)
      const estimatedTokens = Math.ceil(assistantText.length / 4);
      const llmCost = (estimatedTokens / 1000) * 0.003;
      this.session.cost.llm += llmCost;
      this.session.cost.total += llmCost;

      // Emit cost update
      this.emit('cost.update', {
        cost: llmCost,
        total: this.session.cost.total,
        breakdown: this.session.cost
      });

      // Emit LLM completion
      this.emit('llm.completed', { text: assistantText });

      // Track latency
      const latency = Date.now() - startTime;
      this.session.metrics.latency.push(latency);

      return assistantText;

    } catch (error) {
      this.session.metrics.errors++;
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Synthesize speech from text
   */
  async synthesize(text: string): Promise<void> {
    if (!this.session) {
      throw new Error('No active session');
    }

    const ttsProvider = this.selectProvider('tts');

    try {
      this.emit('tts.started', { text });

      if (ttsProvider.name === 'openai-tts') {
        try {
          // Use OpenAI TTS API
          const response = await fetch('/api/voice/openai-tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text,
              voice: ttsProvider.config?.voice || 'shimmer',
              model: 'tts-1'
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ OpenAI TTS failed:', response.status, errorData);
            throw new Error(`OpenAI TTS error: ${response.status}`);
          }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // Play audio
        const audio = new Audio(audioUrl);

        await new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            resolve();
          };
          audio.onerror = reject;
          audio.play().catch(reject);
        });

        // Track cost (OpenAI TTS: $0.015 per 1M characters)
        const ttsCost = (text.length / 1000000) * 0.015;
        this.session.cost.tts += ttsCost;
        this.session.cost.total += ttsCost;

        this.emit('cost.update', {
          cost: ttsCost,
          total: this.session.cost.total,
          breakdown: this.session.cost
        });

        } catch (openaiError) {
          // Fallback to browser TTS if OpenAI fails
          console.warn('⚠️ OpenAI TTS failed, falling back to browser TTS:', openaiError);
          this.emit('tts.fallback', { provider: 'browser-tts', reason: String(openaiError) });

          await new Promise<void>((resolve, reject) => {
            if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
              reject(new Error('Browser TTS not available'));
              return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            utterance.onend = () => resolve();
            utterance.onerror = reject;

            window.speechSynthesis.speak(utterance);
          });
        }

      } else if (ttsProvider.name === 'browser-tts') {
        // Use browser speech synthesis
        await new Promise<void>((resolve, reject) => {
          if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            reject(new Error('Browser TTS not available'));
            return;
          }

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
          utterance.onend = () => resolve();
          utterance.onerror = reject;

          window.speechSynthesis.speak(utterance);
        });

        // Browser TTS is free
        this.session.cost.tts += 0;
      }

      this.emit('tts.completed', { text });

    } catch (error) {
      this.session.metrics.errors++;
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * End current session
   */
  async endSession(): Promise<SessionSummary> {
    if (!this.session) {
      throw new Error('No active session');
    }

    this.session.endTime = Date.now();
    const summary = { ...this.session };

    if (this.config.debug) {
      console.log('📊 [MAIARealtimeSDK] Session summary:', {
        duration: ((this.session.endTime - this.session.startTime) / 1000).toFixed(1) + 's',
        messages: this.session.transcript.length,
        cost: '$' + this.session.cost.total.toFixed(4),
        avgLatency: (this.session.metrics.latency.reduce((a, b) => a + b, 0) / this.session.metrics.latency.length).toFixed(0) + 'ms'
      });
    }

    this.emit('session.ended', summary);
    this.session = null;

    return summary;
  }

  /**
   * Select optimal provider for capability
   */
  private selectProvider(capability: 'stt' | 'llm' | 'tts'): ProviderConfig {
    const eligible = Array.from(this.providers.values())
      .filter(p => p.capabilities.includes(capability))
      .sort((a, b) => b.priority - a.priority);

    if (eligible.length === 0) {
      throw new Error(`No provider available for ${capability}`);
    }

    return eligible[0];
  }

  /**
   * Get current session info
   */
  getSession(): SessionSummary | null {
    return this.session ? { ...this.session } : null;
  }
}

export default MAIARealtimeSDK;
