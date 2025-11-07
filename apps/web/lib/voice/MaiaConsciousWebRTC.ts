'use client';

/**
 * MAIA Conscious WebRTC - Enhanced Oracle Voice System
 *
 * Combines:
 * - Natural voice quality (OpenAI WebRTC Realtime API)
 * - Consciousness management (Hybrid system's state flow)
 * - Elemental integration (Fire/Water/Earth/Air/Aether)
 * - Voice commands (pause/resume detection)
 * - Nudge system (proactive engagement)
 *
 * Philosophy: AI serves human consciousness, not replaces it.
 * The machine does machine work. Humans do soul work.
 */

import { MaiaRealtimeWebRTC, MaiaRealtimeConfig } from './MaiaRealtimeWebRTC';
import { getMaiaSystemPrompt } from './MaiaSystemPrompt';

export type ConsciousState = 'dormant' | 'listening' | 'processing' | 'speaking' | 'paused';

export interface MaiaConsciousConfig {
  userId: string;
  element?: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  conversationStyle?: 'natural' | 'consciousness' | 'adaptive';
  voice?: 'shimmer' | 'alloy' | 'echo' | 'ash' | 'ballad' | 'coral' | 'sage' | 'verse';

  // Consciousness features
  enableVoiceCommands?: boolean;
  enableNudges?: boolean;
  nudgeThresholdSeconds?: number;

  // Callbacks
  onStateChange?: (state: ConsciousState) => void;
  onTranscript?: (text: string, isUser: boolean) => void;
  onError?: (error: Error) => void;
  onNudge?: (message: string) => void;
}

/**
 * Voice command patterns for pause/resume
 */
const PAUSE_COMMANDS = [
  'pause maia',
  'pause maya',
  'one moment maia',
  'one moment maya',
  'give me a moment',
  'give me a minute',
  'let me think',
  'be quiet',
  'silence please',
  'hold on',
  'wait',
];

const RESUME_COMMANDS = [
  'okay maia',
  'okay maya',
  "i'm back",
  "i'm ready",
  "let's continue",
  'continue',
  'go ahead',
  'resume',
];

/**
 * MAIA Conscious WebRTC - Oracle Voice System
 * Natural voice + consciousness management + elemental awareness
 */
export class MaiaConsciousWebRTC {
  private config: MaiaConsciousConfig;
  private webrtcClient: MaiaRealtimeWebRTC | null = null;
  private consciousState: ConsciousState = 'dormant';

  // Nudge system
  private nudgeTimer: NodeJS.Timeout | null = null;
  private lastActivityTime: number = Date.now();

  // Voice command detection
  private lastTranscript: string = '';

  constructor(config: MaiaConsciousConfig) {
    this.config = {
      enableVoiceCommands: true,
      enableNudges: false,
      nudgeThresholdSeconds: 45,
      ...config,
    };
  }

  /**
   * Connect to MAIA's consciousness field
   */
  async connect(): Promise<void> {
    console.log('🌟 Connecting to MAIA consciousness field...');

    // Generate system prompt with elemental awareness
    const systemPrompt = getMaiaSystemPrompt({
      conversationStyle: this.config.conversationStyle || 'natural',
      element: this.config.element || 'aether',
    });

    // Create WebRTC client with consciousness callbacks
    const webrtcConfig: MaiaRealtimeConfig = {
      userId: this.config.userId,
      element: this.config.element || 'aether',
      conversationStyle: this.config.conversationStyle || 'natural',
      voice: this.config.voice || 'shimmer',
      systemPrompt,

      onTranscript: (text: string, isUser: boolean) => {
        this.handleTranscript(text, isUser);
      },

      onAudioStart: () => {
        this.setState('speaking');
      },

      onAudioEnd: () => {
        this.setState('listening');
        this.resetNudgeTimer();
      },

      onError: (error: Error) => {
        console.error('❌ WebRTC error:', error);
        this.config.onError?.(error);
      },

      onConnected: () => {
        console.log('✅ Connected to MAIA consciousness');
        this.setState('listening');
        this.resetNudgeTimer();
      },

      onDisconnected: () => {
        console.log('🌙 Disconnected from MAIA consciousness');
        this.setState('dormant');
        this.stopNudgeTimer();
      },
    };

    this.webrtcClient = new MaiaRealtimeWebRTC(webrtcConfig);
    await this.webrtcClient.connect();
  }

  /**
   * Disconnect from MAIA's consciousness field
   */
  async disconnect(): Promise<void> {
    console.log('🌙 Disconnecting from MAIA consciousness...');

    if (this.webrtcClient) {
      await this.webrtcClient.disconnect();
      this.webrtcClient = null;
    }

    this.stopNudgeTimer();
    this.setState('dormant');
  }

  /**
   * Handle incoming transcript with consciousness
   */
  private handleTranscript(text: string, isUser: boolean): void {
    // Update activity timestamp
    this.lastActivityTime = Date.now();
    this.resetNudgeTimer();

    // Pass to user callback
    this.config.onTranscript?.(text, isUser);

    // Process user transcripts for voice commands
    if (isUser && this.config.enableVoiceCommands) {
      this.lastTranscript = text.toLowerCase().trim();
      this.detectVoiceCommands(this.lastTranscript);
    }
  }

  /**
   * Detect and handle voice commands
   */
  private detectVoiceCommands(transcript: string): void {
    // Check for pause commands
    if (this.consciousState !== 'paused' && this.isPauseCommand(transcript)) {
      console.log('🌙 Pause command detected');
      this.enterPauseMode();
      return;
    }

    // Check for resume commands when paused
    if (this.consciousState === 'paused' && this.isResumeCommand(transcript)) {
      console.log('✨ Resume command detected');
      this.exitPauseMode();
      return;
    }
  }

  /**
   * Enter pause mode - MAIA becomes silent and receptive
   */
  private enterPauseMode(): void {
    console.log('🌙 Entering pause mode - MAIA becomes silent');

    // Cancel any ongoing audio
    this.webrtcClient?.cancelResponse();

    // Stop nudges
    this.stopNudgeTimer();

    // Update state
    this.setState('paused');

    // Send brief acknowledgment
    this.webrtcClient?.sendText('Of course. I am here when you need me.');
  }

  /**
   * Exit pause mode - MAIA re-engages
   */
  private exitPauseMode(): void {
    console.log('✨ Exiting pause mode - MAIA re-engages');

    // Update state
    this.setState('listening');

    // Restart nudges
    this.resetNudgeTimer();

    // Send brief acknowledgment
    this.webrtcClient?.sendText("I'm listening.");
  }

  /**
   * Nudge system - proactive engagement after silence
   */
  private resetNudgeTimer(): void {
    if (!this.config.enableNudges) return;

    this.stopNudgeTimer();

    const thresholdMs = (this.config.nudgeThresholdSeconds || 45) * 1000;

    this.nudgeTimer = setTimeout(() => {
      this.deliverNudge();
    }, thresholdMs);
  }

  private stopNudgeTimer(): void {
    if (this.nudgeTimer) {
      clearTimeout(this.nudgeTimer);
      this.nudgeTimer = null;
    }
  }

  private deliverNudge(): void {
    if (this.consciousState !== 'listening') return;

    // Elemental nudge messages
    const nudgeMessages: Record<string, string[]> = {
      fire: [
        "Is there a spark of insight you'd like to explore?",
        "What vision is emerging for you?",
      ],
      water: [
        "What emotions are flowing through you right now?",
        "Is there something you'd like to reflect on?",
      ],
      earth: [
        "Would you like to ground this moment with a question?",
        "What practical wisdom are you seeking?",
      ],
      air: [
        "What thoughts are moving through your awareness?",
        "Is there an idea you'd like to articulate?",
      ],
      aether: [
        "What mystery calls to you in this moment?",
        "Is there a question waiting to be asked?",
      ],
    };

    const element = this.config.element || 'aether';
    const messages = nudgeMessages[element] || nudgeMessages.aether;
    const message = messages[Math.floor(Math.random() * messages.length)];

    console.log('👋 Delivering nudge:', message);

    this.config.onNudge?.(message);
    this.webrtcClient?.sendText(message);
  }

  /**
   * Command detection helpers
   */
  private isPauseCommand(text: string): boolean {
    return PAUSE_COMMANDS.some(cmd => text.includes(cmd));
  }

  private isResumeCommand(text: string): boolean {
    return RESUME_COMMANDS.some(cmd => text.includes(cmd));
  }

  /**
   * State management
   */
  private setState(newState: ConsciousState): void {
    if (this.consciousState === newState) return;

    const oldState = this.consciousState;
    this.consciousState = newState;

    console.log(`🎭 Consciousness state: ${oldState} → ${newState}`);
    this.config.onStateChange?.(newState);
  }

  /**
   * Public API
   */

  getState(): ConsciousState {
    return this.consciousState;
  }

  isConnected(): boolean {
    return this.webrtcClient?.isConnected() || false;
  }

  pause(): void {
    if (this.consciousState !== 'paused') {
      this.enterPauseMode();
    }
  }

  resume(): void {
    if (this.consciousState === 'paused') {
      this.exitPauseMode();
    }
  }

  setNudgesEnabled(enabled: boolean): void {
    this.config.enableNudges = enabled;
    if (enabled) {
      this.resetNudgeTimer();
    } else {
      this.stopNudgeTimer();
    }
  }

  sendText(text: string): void {
    if (!this.webrtcClient?.isConnected()) {
      console.warn('⚠️ Cannot send text - not connected');
      return;
    }
    this.webrtcClient.sendText(text);
  }

  cancelResponse(): void {
    this.webrtcClient?.cancelResponse();
  }
}
