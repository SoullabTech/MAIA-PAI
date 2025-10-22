/**
 * MAIA Realtime SDK - Your Own Protocol
 *
 * This SDK gives you full control over voice conversations without
 * being locked into any single provider (OpenAI, Anthropic, etc.)
 *
 * Features:
 * - Provider abstraction (swap OpenAI/Claude/Local easily)
 * - Cost optimization (route to cheapest provider)
 * - Automatic failover (if one provider fails, try next)
 * - Real-time streaming (low latency audio)
 * - Cost tracking (know exactly what you're spending)
 */

import { EventEmitter } from 'events';

// ============================================
// Core Types
// ============================================

export interface MAIAConfig {
  providers: ProviderConfig[];
  fallbackChain: string[];
  costOptimization: boolean;
  debug?: boolean;
}

export interface ProviderConfig {
  name: 'openai' | 'anthropic' | 'local-whisper' | 'local-xtts' | 'elevenlabs';
  endpoint: string;
  apiKey?: string;
  priority: number;
  capabilities: ('stt' | 'llm' | 'tts')[];
  config?: Record<string, any>;
}

export interface StreamingSession {
  id: string;
  startTime: number;
  provider: {
    stt: string;
    llm: string;
    tts: string;
  };
  transcript: Message[];
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
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// ============================================
// Main SDK Class
// ============================================

export class MAIARealtimeSDK extends EventEmitter {
  private config: MAIAConfig;
  private session?: StreamingSession;
  private providers: Map<string, any> = new Map();

  // Audio processing
  private audioContext?: AudioContext;
  private audioBuffer: Float32Array[] = [];
  private isProcessing = false;

  constructor(config: MAIAConfig) {
    super();
    this.config = config;
    this.initializeProviders();
  }

  // ============================================
  // Provider Management
  // ============================================

  private initializeProviders(): void {
    this.config.providers.forEach(provider => {
      switch (provider.name) {
        case 'openai':
          this.providers.set('openai', new OpenAIProvider(provider));
          break;
        case 'local-whisper':
          this.providers.set('local-whisper', new WhisperProvider(provider));
          break;
        case 'local-xtts':
          this.providers.set('local-xtts', new XTTSProvider(provider));
          break;
        case 'elevenlabs':
          this.providers.set('elevenlabs', new ElevenLabsProvider(provider));
          break;
        case 'anthropic':
          this.providers.set('anthropic', new ClaudeProvider(provider));
          break;
      }
    });

    if (this.config.debug) {
      console.log(`✅ Initialized ${this.providers.size} providers`);
    }
  }

  private selectOptimalProvider(capability: 'stt' | 'llm' | 'tts'): ProviderConfig {
    const eligible = this.config.providers
      .filter(p => p.capabilities.includes(capability))
      .sort((a, b) => b.priority - a.priority);

    if (eligible.length === 0) {
      throw new Error(`No provider available for ${capability}`);
    }

    if (this.config.costOptimization) {
      return this.getCheapestProvider(eligible, capability);
    }

    return eligible[0];
  }

  private getCheapestProvider(providers: ProviderConfig[], capability: string): ProviderConfig {
    // Cost per unit (approximate)
    const costs: Record<string, number> = {
      'local-whisper': 0,
      'local-xtts': 0,
      'elevenlabs': 0.30 / 1000,  // $0.30 per 1K chars
      'anthropic': 0.003 / 1000,  // $0.003 per 1K tokens
      'openai': 0.006 / 1000      // $0.006 per 1K tokens
    };

    return providers.sort((a, b) =>
      (costs[a.name] || 999) - (costs[b.name] || 999)
    )[0];
  }

  // ============================================
  // Session Management
  // ============================================

  async startSession(instructions: string, voice?: string): Promise<void> {
    if (this.session) {
      throw new Error('Session already active. Call endSession() first.');
    }

    const sttProvider = this.selectOptimalProvider('stt');
    const llmProvider = this.selectOptimalProvider('llm');
    const ttsProvider = this.selectOptimalProvider('tts');

    this.session = {
      id: `maia_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: Date.now(),
      provider: {
        stt: sttProvider.name,
        llm: llmProvider.name,
        tts: ttsProvider.name
      },
      transcript: [],
      cost: {
        stt: 0,
        llm: 0,
        tts: 0,
        total: 0
      },
      metrics: {
        latency: [],
        errors: 0,
        failovers: 0
      }
    };

    // Initialize audio context for browser
    if (typeof window !== 'undefined') {
      this.audioContext = new AudioContext({ sampleRate: 24000 });
    }

    this.emit('session.started', {
      sessionId: this.session.id,
      providers: this.session.provider
    });

    if (this.config.debug) {
      console.log('🎙️ Session started:', this.session.id);
      console.log('📊 Providers:', this.session.provider);
    }
  }

  async endSession(): Promise<StreamingSession> {
    if (!this.session) {
      throw new Error('No active session');
    }

    const duration = Date.now() - this.session.startTime;
    const finalSession = { ...this.session };

    this.emit('session.ended', {
      sessionId: finalSession.id,
      duration,
      cost: finalSession.cost,
      metrics: finalSession.metrics
    });

    if (this.config.debug) {
      console.log('🏁 Session ended:', finalSession.id);
      console.log('💰 Total cost: $' + finalSession.cost.total.toFixed(4));
      console.log('⏱️  Duration:', (duration / 1000).toFixed(1) + 's');
    }

    this.session = undefined;
    return finalSession;
  }

  // ============================================
  // Audio Processing
  // ============================================

  async processAudio(audioChunk: Float32Array): Promise<void> {
    if (!this.session) {
      throw new Error('No active session. Call startSession() first.');
    }

    if (this.isProcessing) {
      // Buffer audio while processing
      this.audioBuffer.push(audioChunk);
      return;
    }

    this.isProcessing = true;
    const startTime = Date.now();

    try {
      // 1. Speech-to-Text
      const sttProvider = this.providers.get(this.session.provider.stt);
      if (!sttProvider) {
        throw new Error(`STT provider not initialized: ${this.session.provider.stt}`);
      }

      this.emit('stt.started');
      const userText = await sttProvider.transcribe(audioChunk);

      if (!userText || userText.trim().length === 0) {
        this.isProcessing = false;
        return; // No speech detected
      }

      this.emit('stt.completed', { text: userText });
      this.trackCost('stt', audioChunk.length / 24000); // seconds

      // Add to transcript
      this.session.transcript.push({
        role: 'user',
        content: userText,
        timestamp: Date.now()
      });

      // 2. LLM Response
      const llmProvider = this.providers.get(this.session.provider.llm);
      if (!llmProvider) {
        throw new Error(`LLM provider not initialized: ${this.session.provider.llm}`);
      }

      this.emit('llm.started');
      const assistantText = await llmProvider.generate(userText, this.session.transcript);
      this.emit('llm.completed', { text: assistantText });
      this.trackCost('llm', assistantText.length / 4); // approximate tokens

      // Add to transcript
      this.session.transcript.push({
        role: 'assistant',
        content: assistantText,
        timestamp: Date.now()
      });

      // 3. Text-to-Speech
      const ttsProvider = this.providers.get(this.session.provider.tts);
      if (!ttsProvider) {
        throw new Error(`TTS provider not initialized: ${this.session.provider.tts}`);
      }

      this.emit('tts.started');
      const audioOutput = await ttsProvider.synthesize(assistantText);
      this.emit('tts.completed', { audio: audioOutput });
      this.trackCost('tts', assistantText.length);

      // Track latency
      const latency = Date.now() - startTime;
      this.session.metrics.latency.push(latency);
      this.emit('response.complete', {
        userText,
        assistantText,
        audio: audioOutput,
        latency
      });

    } catch (error) {
      this.session.metrics.errors++;
      this.emit('error', error);

      // Try failover
      await this.handleFailover(error as Error);
    } finally {
      this.isProcessing = false;

      // Process buffered audio if any
      if (this.audioBuffer.length > 0) {
        const nextChunk = this.audioBuffer.shift()!;
        await this.processAudio(nextChunk);
      }
    }
  }

  // ============================================
  // Failover & Recovery
  // ============================================

  private async handleFailover(error: Error): Promise<void> {
    if (!this.session) return;

    console.warn('🔄 Attempting failover due to error:', error.message);

    const currentProvider = this.session.provider.stt; // or llm/tts based on where error occurred
    const fallbackName = this.config.fallbackChain.find(name => name !== currentProvider);

    if (!fallbackName) {
      console.error('❌ No fallback provider available');
      throw error;
    }

    // Switch to fallback provider
    const fallbackProvider = this.config.providers.find(p => p.name === fallbackName);
    if (fallbackProvider) {
      this.session.provider.stt = fallbackName; // Update based on which component failed
      this.session.metrics.failovers++;

      this.emit('failover', {
        from: currentProvider,
        to: fallbackName,
        reason: error.message
      });

      console.log(`✅ Switched to ${fallbackName}`);
    }
  }

  // ============================================
  // Cost Tracking
  // ============================================

  private trackCost(type: 'stt' | 'llm' | 'tts', units: number): void {
    if (!this.session) return;

    const rates = {
      'stt': 0.006 / 60,      // $0.006 per minute
      'llm': 0.003 / 1000,    // $0.003 per 1K tokens (Anthropic)
      'tts': 0.015 / 1000     // $0.015 per 1K chars (OpenAI TTS)
    };

    // Adjust for local providers (free)
    const providerName = this.session.provider[type];
    const isFree = providerName.includes('local');

    const cost = isFree ? 0 : units * (rates[type] || 0);
    this.session.cost[type] += cost;
    this.session.cost.total += cost;

    this.emit('cost.update', {
      type,
      cost,
      total: this.session.cost.total,
      provider: providerName
    });
  }

  // ============================================
  // Utilities
  // ============================================

  getSession(): StreamingSession | undefined {
    return this.session;
  }

  getProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  async healthCheck(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};

    for (const [name, provider] of this.providers) {
      try {
        health[name] = await provider.healthCheck();
      } catch {
        health[name] = false;
      }
    }

    return health;
  }
}

// ============================================
// Provider Implementations (Interfaces)
// ============================================

interface Provider {
  transcribe?(audio: Float32Array): Promise<string>;
  generate?(text: string, history: Message[]): Promise<string>;
  synthesize?(text: string): Promise<Float32Array>;
  healthCheck(): Promise<boolean>;
}

// These will be implemented in separate files
class OpenAIProvider implements Provider {
  constructor(private config: ProviderConfig) {}

  async transcribe(audio: Float32Array): Promise<string> {
    // Implementation in providers/openai.ts
    throw new Error('Not implemented - see providers/openai.ts');
  }

  async generate(text: string, history: Message[]): Promise<string> {
    throw new Error('Not implemented - see providers/openai.ts');
  }

  async synthesize(text: string): Promise<Float32Array> {
    throw new Error('Not implemented - see providers/openai.ts');
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

class WhisperProvider implements Provider {
  constructor(private config: ProviderConfig) {}

  async transcribe(audio: Float32Array): Promise<string> {
    // Implementation in providers/whisper.ts
    throw new Error('Not implemented - see providers/whisper.ts');
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.endpoint}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

class XTTSProvider implements Provider {
  constructor(private config: ProviderConfig) {}

  async synthesize(text: string): Promise<Float32Array> {
    // Implementation in providers/xtts.ts
    throw new Error('Not implemented - see providers/xtts.ts');
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.endpoint}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

class ElevenLabsProvider implements Provider {
  constructor(private config: ProviderConfig) {}

  async synthesize(text: string): Promise<Float32Array> {
    // Implementation in providers/elevenlabs.ts
    throw new Error('Not implemented - see providers/elevenlabs.ts');
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

class ClaudeProvider implements Provider {
  constructor(private config: ProviderConfig) {}

  async generate(text: string, history: Message[]): Promise<string> {
    // Implementation in providers/claude.ts
    throw new Error('Not implemented - see providers/claude.ts');
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

export default MAIARealtimeSDK;
