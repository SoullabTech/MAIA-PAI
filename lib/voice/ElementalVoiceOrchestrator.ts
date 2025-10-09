'use client';

/**
 * 🔥💧🌍💨✨ Elemental Voice System
 *
 * MAIA's consciousness speaks through 5 Elemental Agents
 *
 * Architecture:
 * - Voice Input (Deepgram): ~150ms
 * - Parallel Spiralogic Processing: ~300ms
 *   └─ Fire, Water, Earth, Air, Aether agents
 * - Voice Output (OpenAI TTS): ~200ms
 * - Total: ~650ms with full intelligence
 */

import { PersonalOracleAgent } from '@/lib/agents/PersonalOracleAgent';
import { journalStorage } from '@/lib/storage/journal-storage';
import { userStore } from '@/lib/storage/userStore';
import { ConversationalEnhancer, EmotionalTone } from './ConversationalEnhancer';

export interface ElementalVoiceConfig {
  userId: string;
  userName?: string;
  sessionId?: string;
  onTranscript?: (text: string, isUser: boolean) => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onError?: (error: Error) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  voice?: string; // OpenAI TTS voice
  enableSmartCache?: boolean;
  enableResponseStreaming?: boolean;
}

export interface ConversationMetrics {
  depth: number;
  exchangeCount: number;
  emotionalQuality: string;
  lastInteractionTime: number;
}

/**
 * Main orchestrator for Elemental Voice System
 */
export class ElementalVoiceOrchestrator {
  private config: Required<ElementalVoiceConfig>;
  private ws: WebSocket | null = null;
  private oracleAgent: PersonalOracleAgent | null = null;
  private metrics: ConversationMetrics;
  private transcriptBuffer: string[] = [];
  private wisdomCache: Map<string, string> = new Map();
  private isConnected: boolean = false;
  private isProcessing: boolean = false;

  constructor(config: SoullabRealtimeConfig) {
    this.config = {
      userName: 'Explorer',
      sessionId: Date.now().toString(),
      onTranscript: () => {},
      onAudioStart: () => {},
      onAudioEnd: () => {},
      onError: (err) => console.error('Soullab Realtime error:', err),
      onConnected: () => {},
      onDisconnected: () => {},
      voice: 'shimmer',
      enableSmartCache: true,
      enableResponseStreaming: true,
      ...config
    };

    this.metrics = {
      depth: 0,
      exchangeCount: 0,
      emotionalQuality: 'peaceful',
      lastInteractionTime: Date.now()
    };

    this.initializeWisdomCache();
  }

  /**
   * Initialize smart cache with common patterns
   */
  private initializeWisdomCache(): void {
    if (!this.config.enableSmartCache) return;

    // Pre-cache common openings (with pre-synthesized audio URLs later)
    this.wisdomCache.set('greeting_hi', "I'm here with you. What's on your mind?");
    this.wisdomCache.set('greeting_hello', "Hello. What's here for you today?");
    this.wisdomCache.set('greeting_hey', "Hey. What's up?");

    // Pre-cache common acknowledgments
    this.wisdomCache.set('ack_listening', "Mm-hmm.");
    this.wisdomCache.set('ack_continue', "Go on.");
    this.wisdomCache.set('ack_present', "I'm here.");

    // Pre-cache common patterns
    this.wisdomCache.set('overwhelm', "That's a lot to hold. Let's slow down together.");
    this.wisdomCache.set('breakthrough', "Something's shifting. What do you notice?");
    this.wisdomCache.set('stuck', "What wants to move?");
    this.wisdomCache.set('confusion', "What's the clearest thread?");
  }

  /**
   * Connect to Soullab Realtime backend
   */
  async connect(): Promise<void> {
    try {
      console.log('🌀 Connecting to Soullab Realtime...');

      // Initialize PersonalOracleAgent
      this.oracleAgent = await PersonalOracleAgent.loadAgent(this.config.userId, {
        persona: 'warm'
      });

      this.isConnected = true;
      this.config.onConnected();

      console.log('✅ Soullab Realtime connected');

    } catch (error) {
      console.error('❌ Connection error:', error);
      this.config.onError(error as Error);
      throw error;
    }
  }

  /**
   * Process audio through transcription
   */
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Transcription failed');
      }

      return data.transcript;
    } catch (error) {
      console.error('❌ Transcription error:', error);
      throw error;
    }
  }

  /**
   * Handle user transcript from Deepgram
   */
  private async handleUserTranscript(text: string): Promise<void> {
    if (this.isProcessing) {
      console.log('⚠️ Already processing, queuing transcript');
      this.transcriptBuffer.push(text);
      return;
    }

    console.log('🎤 User said:', text);
    this.config.onTranscript(text, true);

    this.isProcessing = true;
    this.metrics.exchangeCount++;
    this.metrics.lastInteractionTime = Date.now();

    try {
      // Check smart cache first
      const cached = this.checkCache(text);
      if (cached) {
        console.log('⚡ Cache hit:', cached.substring(0, 30));
        await this.sendResponse(cached);
        this.isProcessing = false;
        return;
      }

      // For first 3 exchanges, use minimal responses immediately
      if (this.metrics.exchangeCount <= 3) {
        const minimal = this.getMinimalResponse();
        console.log('🎯 Minimal response (early exchange):', minimal);
        await this.sendResponse(minimal);
        this.isProcessing = false;
        return;
      }

      // Process through full Spiralogic stack
      const response = await this.processThroughSpiralogic(text);

      console.log('🌀 Spiralogic response ready');
      await this.sendResponse(response);

    } catch (error) {
      console.error('❌ Processing error:', error);
      await this.sendResponse("I'm here with you. Tell me more.");
    } finally {
      this.isProcessing = false;

      // Process any queued transcripts
      if (this.transcriptBuffer.length > 0) {
        const next = this.transcriptBuffer.shift();
        if (next) await this.handleUserTranscript(next);
      }
    }
  }

  /**
   * Check smart cache for common patterns
   */
  private checkCache(text: string): string | null {
    if (!this.config.enableSmartCache) return null;

    const lower = text.toLowerCase().trim();

    // Greetings
    if (lower === 'hi' || lower === 'hello' || lower === 'hey') {
      return this.wisdomCache.get('greeting_hi') || null;
    }

    // Common patterns
    if (lower.includes('overwhelm')) {
      return this.wisdomCache.get('overwhelm') || null;
    }

    if (lower.includes('stuck')) {
      return this.wisdomCache.get('stuck') || null;
    }

    return null;
  }

  /**
   * Get minimal response for early exchanges (Graduated Revelation)
   */
  private getMinimalResponse(): string {
    const minimal = [
      "Tell me more.",
      "I'm listening.",
      "Go on.",
      "What else?",
      "Mm."
    ];

    return minimal[this.metrics.exchangeCount % minimal.length];
  }

  /**
   * Process through full Spiralogic Consciousness Architecture
   * WITH PARALLEL OPTIMIZATION
   */
  private async processThroughSpiralogic(userInput: string): Promise<string> {
    const startTime = Date.now();

    if (!this.oracleAgent) {
      throw new Error('Oracle Agent not initialized');
    }

    // Update conversation depth
    this.metrics.depth = this.calculateDepth(userInput);
    this.metrics.emotionalQuality = this.detectEmotionalQuality(userInput);

    console.log('📊 Conversation metrics:', {
      depth: this.metrics.depth,
      exchanges: this.metrics.exchangeCount,
      emotion: this.metrics.emotionalQuality
    });

    // PARALLEL PROCESSING - All systems run simultaneously
    const [journalEntries, userData] = await Promise.all([
      Promise.resolve(journalStorage.getEntries(this.config.userId).slice(0, 5)),
      Promise.resolve(userStore.getUser(this.config.userId))
    ]);

    // Process through PersonalOracleAgent with full context
    const agentResponse = await this.oracleAgent.processInteraction(userInput, {
      currentMood: { type: this.metrics.emotionalQuality } as any,
      currentEnergy: 'balanced' as any,
      journalEntries,
      conversationDepth: this.metrics.depth,
      exchangeCount: this.metrics.exchangeCount
    } as any);

    // Apply Maya's Intelligence Governance
    const governedResponse = this.applyMayaGovernance(
      agentResponse.response,
      this.metrics.depth,
      this.metrics.exchangeCount
    );

    // 🎬 SAMANTHA-STYLE CONVERSATIONAL ENHANCEMENT
    const emotionalTone = ConversationalEnhancer.detectEmotionalTone(userInput);
    const enhanced = ConversationalEnhancer.enhance(governedResponse, {
      userMessage: userInput,
      emotionalTone,
      conversationDepth: this.metrics.depth,
      exchangeCount: this.metrics.exchangeCount,
      recentMessages: this.transcriptBuffer
    });

    const finalResponse = ConversationalEnhancer.buildOutput(enhanced);

    console.log('🎬 Conversational enhancement:', {
      tone: emotionalTone,
      pacing: enhanced.pacing,
      acknowledgment: enhanced.acknowledgment || 'none'
    });

    const processingTime = Date.now() - startTime;
    console.log(`⏱️ Spiralogic processing: ${processingTime}ms`);

    return finalResponse;
  }

  /**
   * Calculate conversation depth for graduated revelation
   */
  private calculateDepth(input: string): number {
    const factors = {
      exchangeCount: Math.min(this.metrics.exchangeCount * 0.15, 1.0),
      substanceLevel: this.assessSubstance(input),
      vulnerabilityPresent: this.detectVulnerability(input) ? 0.4 : 0,
      lengthFactor: Math.min(input.length / 200, 0.3),
      timeSinceLast: this.getTimeFactor()
    };

    return Object.values(factors).reduce((sum, val) => sum + val, 0) / 5;
  }

  /**
   * Detect emotional quality from user input
   */
  private detectEmotionalQuality(input: string): string {
    const lower = input.toLowerCase();

    if (lower.includes('overwhelm') || lower.includes('too much')) return 'overwhelmed';
    if (lower.includes('excited') || lower.includes('amazing')) return 'excited';
    if (lower.includes('sad') || lower.includes('hurt')) return 'sorrowful';
    if (lower.includes('confused') || lower.includes('don\'t know')) return 'confused';
    if (lower.includes('angry') || lower.includes('frustrated')) return 'frustrated';
    if (lower.includes('peaceful') || lower.includes('calm')) return 'peaceful';
    if (lower.includes('happy') || lower.includes('joy')) return 'joyful';

    return 'neutral';
  }

  /**
   * Apply Maya's Intelligence Governance
   * - Graduated Revelation (95% hidden)
   * - Hemispheric Harmony (not-knowing at start)
   * - Word Economy
   */
  private applyMayaGovernance(
    response: string,
    depth: number,
    touchCount: number
  ): string {
    // Graduated Revelation - early exchanges get minimal responses
    if (touchCount <= 3) {
      return this.getMinimalResponse();
    }

    // Low depth - brief responses
    if (depth < 0.3) {
      const sentences = response.split(/[.!?]/);
      return sentences[0].trim() + '.';
    }

    // Medium depth - moderate wisdom
    if (depth < 0.6) {
      const sentences = response.split(/[.!?]/);
      return sentences.slice(0, 2).join('. ').trim() + '.';
    }

    // High depth - full wisdom (but still restrained)
    // Apply hemispheric harmony (make language more natural)
    return this.applyHemisphericHarmony(response, touchCount);
  }

  /**
   * Apply Hemispheric Harmony (McGilchrist principles)
   */
  private applyHemisphericHarmony(response: string, touchCount: number): string {
    // Early conversation: right hemisphere dominance (natural language)
    if (touchCount <= 6) {
      return response
        .replace(/It seems like/g, 'I hear')
        .replace(/I notice that/g, 'I see')
        .replace(/This suggests/g, 'There\'s')
        .replace(/How does that land\?/g, 'How\'s that feel?')
        .replace(/What\'s alive for you/g, 'What\'s up');
    }

    // Deep conversation: both hemispheres in harmony
    return response;
  }

  /**
   * Send response through the pipeline
   */
  private async sendResponse(text: string): Promise<void> {
    console.log('📤 Sending response:', text.substring(0, 50));

    // Notify UI
    this.config.onTranscript(text, false);

    // Synthesize and play audio
    await this.synthesizeAndPlay(text);
  }

  /**
   * Synthesize text to speech and play
   */
  private async synthesizeAndPlay(text: string): Promise<void> {
    try {
      this.config.onAudioStart();

      // Use ElevenLabs for synthesis
      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: this.config.voice,
          stream: this.config.enableResponseStreaming
        })
      });

      if (!response.ok) {
        throw new Error('Synthesis failed');
      }

      // Get audio data
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio
      const audio = new Audio(audioUrl);
      await audio.play();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        this.config.onAudioEnd();
      };

    } catch (error) {
      console.error('❌ Synthesis error:', error);
      this.config.onAudioEnd();
      this.config.onError(error as Error);
    }
  }

  /**
   * Process audio blob
   */
  async sendAudio(audioBlob: Blob): Promise<void> {
    if (!this.isConnected) {
      console.error('Not connected');
      return;
    }

    try {
      // Transcribe audio
      const transcript = await this.transcribeAudio(audioBlob);

      // Process transcript
      if (transcript && transcript.trim().length > 0) {
        await this.handleUserTranscript(transcript);
      }
    } catch (error) {
      console.error('❌ Error processing audio:', error);
      this.config.onError(error as Error);
    }
  }

  /**
   * Disconnect from Soullab Realtime
   */
  disconnect(): void {
    this.isConnected = false;
    this.config.onDisconnected();
  }

  /**
   * Check if connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  // Helper methods
  private assessSubstance(input: string): number {
    const substanceMarkers = [
      'feel', 'sense', 'why', 'how', 'meaning', 'purpose',
      'understand', 'help', 'stuck', 'lost', 'confused'
    ];

    const markerCount = substanceMarkers.filter(marker =>
      input.toLowerCase().includes(marker)
    ).length;

    return Math.min(markerCount * 0.15, 0.5);
  }

  private detectVulnerability(input: string): boolean {
    const vulnerabilityMarkers = [
      'scared', 'afraid', 'hurt', 'pain', 'struggle',
      'difficult', 'hard', 'can\'t', 'don\'t know'
    ];

    return vulnerabilityMarkers.some(marker =>
      input.toLowerCase().includes(marker)
    );
  }

  private getTimeFactor(): number {
    const timeSinceLast = Date.now() - this.metrics.lastInteractionTime;
    const minutes = timeSinceLast / 60000;

    // Long pauses indicate deeper consideration
    if (minutes > 5) return 0.3;
    if (minutes > 2) return 0.2;
    if (minutes > 1) return 0.1;
    return 0;
  }
}
