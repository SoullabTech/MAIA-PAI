/**
 * 🎵 Resonance Audio Engine
 *
 * Web Audio API implementation for The Resonance Protocol.
 * Makes field coherence audible through dynamic frequencies.
 *
 * Features:
 * - Subliminal 3% volume (barely perceptible but felt)
 * - Smooth frequency transitions
 * - Harmonic layering
 * - Modulation (AM/FM/Phase)
 * - Insight chimes
 * - Agent-specific frequencies
 */

import type { FrequencyConfig, HarmonicLayer, FrequencyModulation } from '../resonance/types';

// ═══════════════════════════════════════════════════════════════
// Audio Engine Configuration
// ═══════════════════════════════════════════════════════════════

export interface AudioEngineConfig {
  masterVolume: number;        // 0-1, applied to all frequencies
  subliminalMode: boolean;     // If true, keeps at 3% volume
  fadeInDuration: number;      // Seconds
  fadeOutDuration: number;     // Seconds
  transitionSpeed: number;     // How fast frequencies shift (0-1)
}

const DEFAULT_CONFIG: AudioEngineConfig = {
  masterVolume: 0.03,          // 3% (subliminal)
  subliminalMode: true,
  fadeInDuration: 2.0,
  fadeOutDuration: 1.5,
  transitionSpeed: 0.1,
};

// ═══════════════════════════════════════════════════════════════
// Oscillator Node Wrapper
// ═══════════════════════════════════════════════════════════════

interface OscillatorState {
  oscillator: OscillatorNode;
  gainNode: GainNode;
  frequency: number;
  targetAmplitude: number;
  currentAmplitude: number;
  name: string;
}

// ═══════════════════════════════════════════════════════════════
// ResonanceAudioEngine Class
// ═══════════════════════════════════════════════════════════════

export class ResonanceAudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private oscillators: Map<string, OscillatorState> = new Map();
  private config: AudioEngineConfig;
  private isPlaying: boolean = false;
  private animationFrameId: number | null = null;

  constructor(config: Partial<AudioEngineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ──────────────────────────────────────────────────────────────
  // Initialization
  // ──────────────────────────────────────────────────────────────

  /**
   * Initialize Web Audio API context.
   * Must be called after user interaction (browser requirement).
   */
  async initialize(): Promise<boolean> {
    if (this.audioContext) {
      return true;  // Already initialized
    }

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create master gain node
      this.masterGainNode = this.audioContext.createGain();
      this.masterGainNode.gain.value = this.config.masterVolume;
      this.masterGainNode.connect(this.audioContext.destination);

      console.log('🎵 Resonance Audio Engine initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Primary: Play Frequency Configuration
  // ──────────────────────────────────────────────────────────────

  /**
   * Plays a frequency configuration from The Resonance Protocol.
   * Updates smoothly if already playing.
   */
  async play(config: FrequencyConfig): Promise<void> {
    if (!this.audioContext || !this.masterGainNode) {
      await this.initialize();
      if (!this.audioContext || !this.masterGainNode) {
        throw new Error('Audio context not initialized');
      }
    }

    // Resume context if suspended (mobile browsers)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.fadeIn();
    }

    // Update or create oscillators for each harmonic
    const activeHarmonics = new Set<string>();

    for (const harmonic of config.harmonics) {
      const key = `harmonic-${harmonic.frequency}`;
      activeHarmonics.add(key);

      if (this.oscillators.has(key)) {
        // Update existing oscillator
        const state = this.oscillators.get(key)!;
        state.targetAmplitude = harmonic.amplitude * this.config.masterVolume;
      } else {
        // Create new oscillator
        this.createOscillator(harmonic, key);
      }
    }

    // Remove oscillators that are no longer in config
    for (const [key, state] of this.oscillators.entries()) {
      if (!activeHarmonics.has(key)) {
        this.removeOscillator(key);
      }
    }

    // Start smooth transition loop if not already running
    if (!this.animationFrameId) {
      this.startTransitionLoop();
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Oscillator Management
  // ──────────────────────────────────────────────────────────────

  private createOscillator(harmonic: HarmonicLayer, key: string): void {
    if (!this.audioContext || !this.masterGainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';  // Pure sine wave for clean tones
    oscillator.frequency.value = harmonic.frequency;

    gainNode.gain.value = 0;  // Start at 0, will fade in
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGainNode);

    oscillator.start();

    const state: OscillatorState = {
      oscillator,
      gainNode,
      frequency: harmonic.frequency,
      targetAmplitude: harmonic.amplitude * this.config.masterVolume,
      currentAmplitude: 0,
      name: harmonic.name,
    };

    this.oscillators.set(key, state);
  }

  private removeOscillator(key: string): void {
    const state = this.oscillators.get(key);
    if (!state) return;

    // Fade out before stopping
    const now = this.audioContext?.currentTime || 0;
    state.gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    setTimeout(() => {
      state.oscillator.stop();
      state.oscillator.disconnect();
      state.gainNode.disconnect();
      this.oscillators.delete(key);
    }, 500);
  }

  // ──────────────────────────────────────────────────────────────
  // Smooth Transition Loop
  // ──────────────────────────────────────────────────────────────

  private startTransitionLoop(): void {
    const tick = () => {
      if (!this.isPlaying) {
        this.animationFrameId = null;
        return;
      }

      // Smoothly transition each oscillator toward target amplitude
      for (const [key, state] of this.oscillators.entries()) {
        const diff = state.targetAmplitude - state.currentAmplitude;
        state.currentAmplitude += diff * this.config.transitionSpeed;

        // Update gain
        state.gainNode.gain.value = state.currentAmplitude;
      }

      this.animationFrameId = requestAnimationFrame(tick);
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  // ──────────────────────────────────────────────────────────────
  // Fade In/Out
  // ──────────────────────────────────────────────────────────────

  private fadeIn(): void {
    if (!this.audioContext || !this.masterGainNode) return;

    const now = this.audioContext.currentTime;
    this.masterGainNode.gain.setValueAtTime(0, now);
    this.masterGainNode.gain.linearRampToValueAtTime(
      this.config.masterVolume,
      now + this.config.fadeInDuration
    );
  }

  private fadeOut(): void {
    if (!this.audioContext || !this.masterGainNode) return;

    const now = this.audioContext.currentTime;
    this.masterGainNode.gain.linearRampToValueAtTime(
      0,
      now + this.config.fadeOutDuration
    );
  }

  // ──────────────────────────────────────────────────────────────
  // Stop
  // ──────────────────────────────────────────────────────────────

  /**
   * Fade out and stop all frequencies.
   */
  async stop(): Promise<void> {
    if (!this.isPlaying) return;

    this.fadeOut();
    this.isPlaying = false;

    // Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Stop and remove all oscillators after fade
    setTimeout(() => {
      for (const [key, state] of this.oscillators.entries()) {
        state.oscillator.stop();
        state.oscillator.disconnect();
        state.gainNode.disconnect();
      }
      this.oscillators.clear();
    }, this.config.fadeOutDuration * 1000);
  }

  // ──────────────────────────────────────────────────────────────
  // Insight Chime
  // ──────────────────────────────────────────────────────────────

  /**
   * Plays a brief chime when an emergent insight is detected.
   * Uses Solfeggio MI (528 Hz) - the "miracle" frequency.
   */
  async playInsightChime(intensity: number = 1.0): Promise<void> {
    if (!this.audioContext || !this.masterGainNode) {
      await this.initialize();
      if (!this.audioContext || !this.masterGainNode) return;
    }

    const now = this.audioContext.currentTime;

    // Create chime oscillator
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 528;  // Solfeggio MI

    // Volume envelope: fade in, sustain, fade out
    const volume = 0.08 * intensity * this.config.masterVolume;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.1);  // Fade in
    gainNode.gain.setValueAtTime(volume, now + 0.3);           // Sustain
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);  // Fade out

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGainNode);

    oscillator.start(now);
    oscillator.stop(now + 1.5);

    // Add harmonic (octave)
    const harmonic = this.audioContext.createOscillator();
    const harmonicGain = this.audioContext.createGain();

    harmonic.type = 'sine';
    harmonic.frequency.value = 528 * 2;  // Octave

    harmonicGain.gain.setValueAtTime(0, now);
    harmonicGain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.1);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    harmonic.connect(harmonicGain);
    harmonicGain.connect(this.masterGainNode);

    harmonic.start(now);
    harmonic.stop(now + 1.5);

    console.log('💎 Insight chime played (528 Hz)');
  }

  // ──────────────────────────────────────────────────────────────
  // Volume Control
  // ──────────────────────────────────────────────────────────────

  /**
   * Adjust master volume.
   */
  setVolume(volume: number): void {
    this.config.masterVolume = Math.max(0, Math.min(1, volume));

    if (this.masterGainNode && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.masterGainNode.gain.linearRampToValueAtTime(
        this.config.masterVolume,
        now + 0.1
      );
    }
  }

  /**
   * Get current master volume.
   */
  getVolume(): number {
    return this.config.masterVolume;
  }

  // ──────────────────────────────────────────────────────────────
  // State Queries
  // ──────────────────────────────────────────────────────────────

  isInitialized(): boolean {
    return this.audioContext !== null;
  }

  isActive(): boolean {
    return this.isPlaying;
  }

  getActiveFrequencies(): Array<{ name: string; frequency: number; amplitude: number }> {
    return Array.from(this.oscillators.values()).map(state => ({
      name: state.name,
      frequency: state.frequency,
      amplitude: state.currentAmplitude,
    }));
  }

  // ──────────────────────────────────────────────────────────────
  // Cleanup
  // ──────────────────────────────────────────────────────────────

  async dispose(): Promise<void> {
    await this.stop();

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
      this.masterGainNode = null;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Singleton Instance
// ═══════════════════════════════════════════════════════════════

let globalAudioEngine: ResonanceAudioEngine | null = null;

export function getResonanceAudioEngine(config?: Partial<AudioEngineConfig>): ResonanceAudioEngine {
  if (!globalAudioEngine) {
    globalAudioEngine = new ResonanceAudioEngine(config);
  }
  return globalAudioEngine;
}

export async function disposeResonanceAudioEngine(): Promise<void> {
  if (globalAudioEngine) {
    await globalAudioEngine.dispose();
    globalAudioEngine = null;
  }
}
