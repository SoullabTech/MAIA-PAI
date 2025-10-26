/**
 * 🜂 Sonic Coherence Feedback
 *
 * Translates field state into audible frequencies.
 * The field doesn't just compute — it SINGS.
 *
 * Core capabilities:
 * - Dynamic frequency adjustment based on coherence
 * - Harmonic layering when alignment increases
 * - Subtle dissonance when field fragments
 * - Sonic portrait of resonance state
 */

import type {
  FieldState,
  FrequencyConfig,
  HarmonicLayer,
  FrequencyModulation,
  ResonanceTrend,
  CoherenceScore,
} from './types';

// ═══════════════════════════════════════════════════════════════
// Frequency Constants (Hz)
// ═══════════════════════════════════════════════════════════════

export const BASE_FREQUENCIES = {
  // Schumann Resonance (Earth's frequency)
  SCHUMANN: 7.83,

  // Brainwave frequencies
  DELTA: 2.5,      // Deep sleep, healing
  THETA: 6.0,      // Meditation, creativity
  ALPHA: 10.0,     // Relaxed awareness
  BETA: 20.0,      // Active thinking
  GAMMA: 40.0,     // Peak cognition

  // Solfeggio frequencies
  UT: 396,         // Liberation from fear
  RE: 417,         // Undoing situations
  MI: 528,         // Transformation & miracles
  FA: 639,         // Connecting & relationships
  SOL: 741,        // Awakening intuition
  LA: 852,         // Returning to spiritual order
};

// ═══════════════════════════════════════════════════════════════
// Coherence-to-Frequency Mapping
// ═══════════════════════════════════════════════════════════════

interface CoherenceMapping {
  coherenceRange: [number, number];  // Min, max coherence
  baseFrequency: number;
  harmonics: Array<{
    frequency: number;
    amplitude: number;
    name: string;
  }>;
  modulation?: FrequencyModulation;
}

const COHERENCE_MAPPINGS: CoherenceMapping[] = [
  // Low coherence (0-0.3): Fragmented, needs grounding
  {
    coherenceRange: [0, 0.3],
    baseFrequency: BASE_FREQUENCIES.DELTA,
    harmonics: [
      { frequency: BASE_FREQUENCIES.SCHUMANN, amplitude: 0.5, name: 'Schumann (grounding)' },
      { frequency: BASE_FREQUENCIES.THETA, amplitude: 0.3, name: 'Theta (calming)' },
    ],
    modulation: {
      type: 'amplitude',
      rate: 0.2,  // Slow pulse
      depth: 0.3,
    },
  },

  // Medium-low coherence (0.3-0.5): Searching, integrating
  {
    coherenceRange: [0.3, 0.5],
    baseFrequency: BASE_FREQUENCIES.THETA,
    harmonics: [
      { frequency: BASE_FREQUENCIES.SCHUMANN, amplitude: 0.6, name: 'Schumann' },
      { frequency: BASE_FREQUENCIES.ALPHA, amplitude: 0.4, name: 'Alpha (opening)' },
    ],
  },

  // Medium coherence (0.5-0.7): Stable, clear
  {
    coherenceRange: [0.5, 0.7],
    baseFrequency: BASE_FREQUENCIES.ALPHA,
    harmonics: [
      { frequency: BASE_FREQUENCIES.SCHUMANN, amplitude: 0.7, name: 'Schumann' },
      { frequency: BASE_FREQUENCIES.THETA, amplitude: 0.3, name: 'Theta' },
      { frequency: BASE_FREQUENCIES.BETA, amplitude: 0.2, name: 'Beta (alertness)' },
    ],
  },

  // High coherence (0.7-0.85): Converging, insightful
  {
    coherenceRange: [0.7, 0.85],
    baseFrequency: BASE_FREQUENCIES.ALPHA,
    harmonics: [
      { frequency: BASE_FREQUENCIES.SCHUMANN, amplitude: 0.8, name: 'Schumann' },
      { frequency: BASE_FREQUENCIES.BETA, amplitude: 0.5, name: 'Beta' },
      { frequency: BASE_FREQUENCIES.GAMMA, amplitude: 0.3, name: 'Gamma (insight)' },
    ],
  },

  // Very high coherence (0.85-1.0): Peak resonance
  {
    coherenceRange: [0.85, 1.0],
    baseFrequency: BASE_FREQUENCIES.ALPHA,
    harmonics: [
      { frequency: BASE_FREQUENCIES.SCHUMANN, amplitude: 1.0, name: 'Schumann' },
      { frequency: BASE_FREQUENCIES.GAMMA, amplitude: 0.7, name: 'Gamma' },
      { frequency: BASE_FREQUENCIES.MI, amplitude: 0.4, name: 'Solfeggio MI (transformation)' },
    ],
    modulation: {
      type: 'frequency',
      rate: 0.5,  // Gentle shimmer
      depth: 0.1,
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// SonicFeedbackEngine Class
// ═══════════════════════════════════════════════════════════════

export class SonicFeedbackEngine {
  private currentConfig: FrequencyConfig | null = null;
  private targetConfig: FrequencyConfig | null = null;
  private transitionSpeed: number = 0.1;  // How fast frequencies transition

  constructor(transitionSpeed: number = 0.1) {
    this.transitionSpeed = transitionSpeed;
  }

  // ──────────────────────────────────────────────────────────────
  // Primary: Generate Sonic Portrait
  // ──────────────────────────────────────────────────────────────

  /**
   * Generates a complete sonic portrait of the current field state.
   * Returns frequency configuration that can be passed to audio engine.
   */
  generateFieldSonic(fieldState: FieldState): FrequencyConfig {
    const { coherenceScore, trend } = fieldState;

    // Get base config from coherence mapping
    let config = this.getCoherenceConfig(coherenceScore);

    // Adjust based on trend
    config = this.adjustForTrend(config, trend);

    // Store as target (for smooth transitions)
    this.targetConfig = config;

    // If no current config, set it immediately
    if (!this.currentConfig) {
      this.currentConfig = config;
    }

    return this.currentConfig;
  }

  // ──────────────────────────────────────────────────────────────
  // Coherence-Based Configuration
  // ──────────────────────────────────────────────────────────────

  private getCoherenceConfig(coherence: number): FrequencyConfig {
    // Find matching mapping
    const mapping = COHERENCE_MAPPINGS.find(
      m => coherence >= m.coherenceRange[0] && coherence <= m.coherenceRange[1]
    ) || COHERENCE_MAPPINGS[2];  // Default to medium

    // Convert to FrequencyConfig
    const harmonics: HarmonicLayer[] = mapping.harmonics.map(h => ({
      frequency: h.frequency,
      amplitude: h.amplitude * 0.03,  // 3% volume (subliminal)
      phase: 0,
      name: h.name,
    }));

    return {
      baseFrequency: mapping.baseFrequency,
      harmonics,
      volume: 0.03,  // 3% base volume
      modulation: mapping.modulation,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Trend-Based Adjustments
  // ──────────────────────────────────────────────────────────────

  private adjustForTrend(config: FrequencyConfig, trend: ResonanceTrend): FrequencyConfig {
    const adjusted = { ...config };

    switch (trend) {
      case 'converging':
        // Add shimmer (rising harmonics)
        adjusted.modulation = {
          type: 'frequency',
          rate: 0.3,
          depth: 0.15,
        };
        // Boost amplitude slightly
        adjusted.volume = Math.min(0.05, adjusted.volume * 1.2);
        break;

      case 'diverging':
        // Add subtle dissonance (amplitude modulation)
        adjusted.modulation = {
          type: 'amplitude',
          rate: 0.5,
          depth: 0.25,
        };
        // Slightly lower volume
        adjusted.volume = adjusted.volume * 0.8;
        break;

      case 'oscillating':
        // Add wave-like modulation
        adjusted.modulation = {
          type: 'phase',
          rate: 0.4,
          depth: 0.3,
        };
        break;

      case 'stable':
        // Clean, steady frequencies (minimal modulation)
        adjusted.modulation = undefined;
        break;
    }

    return adjusted;
  }

  // ──────────────────────────────────────────────────────────────
  // Smooth Transitions
  // ──────────────────────────────────────────────────────────────

  /**
   * Updates current config toward target config smoothly.
   * Call this in animation frame for smooth transitions.
   */
  tick(): FrequencyConfig | null {
    if (!this.currentConfig || !this.targetConfig) {
      return this.currentConfig;
    }

    // Interpolate base frequency
    this.currentConfig.baseFrequency = this.lerp(
      this.currentConfig.baseFrequency,
      this.targetConfig.baseFrequency,
      this.transitionSpeed
    );

    // Interpolate volume
    this.currentConfig.volume = this.lerp(
      this.currentConfig.volume,
      this.targetConfig.volume,
      this.transitionSpeed
    );

    // Interpolate harmonics
    for (let i = 0; i < this.currentConfig.harmonics.length; i++) {
      const current = this.currentConfig.harmonics[i];
      const target = this.targetConfig.harmonics[i];

      if (target) {
        current.amplitude = this.lerp(
          current.amplitude,
          target.amplitude,
          this.transitionSpeed
        );
      }
    }

    return this.currentConfig;
  }

  private lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  // ──────────────────────────────────────────────────────────────
  // Insight Sonification
  // ──────────────────────────────────────────────────────────────

  /**
   * Generates a special sonic "chime" when an insight emerges.
   * This is a brief, beautiful sound that marks moments of collective intelligence.
   */
  generateInsightChime(emergenceScore: number): FrequencyConfig {
    // Use Solfeggio MI (528 Hz) - the "miracle" frequency
    const intensity = emergenceScore;

    return {
      baseFrequency: BASE_FREQUENCIES.MI,
      harmonics: [
        {
          frequency: BASE_FREQUENCIES.MI,
          amplitude: 0.1 * intensity,
          phase: 0,
          name: 'Insight chime',
        },
        {
          frequency: BASE_FREQUENCIES.MI * 2,  // Octave
          amplitude: 0.05 * intensity,
          phase: 0,
          name: 'Harmonic',
        },
      ],
      volume: 0.08 * intensity,  // Slightly louder for insights
      modulation: {
        type: 'amplitude',
        rate: 2.0,  // Fast fade
        depth: 1.0,  // Full fade out
      },
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Agent-Specific Frequencies
  // ──────────────────────────────────────────────────────────────

  /**
   * Each agent can have its own sonic signature.
   * When an agent speaks, its frequency can become more prominent.
   */
  private readonly AGENT_FREQUENCIES: Record<string, number> = {
    'cognitive-light-cone': BASE_FREQUENCIES.GAMMA,     // High frequency (fast thinking)
    'bioelectric': BASE_FREQUENCIES.SCHUMANN,           // Earth frequency (embodied)
    'collective-intelligence': BASE_FREQUENCIES.ALPHA,  // Medium frequency (integration)
  };

  /**
   * Emphasizes an agent's frequency when they contribute.
   */
  emphasizeAgent(config: FrequencyConfig, agentId: string): FrequencyConfig {
    const agentFreq = this.AGENT_FREQUENCIES[agentId];

    if (!agentFreq) {
      return config;
    }

    // Find or add the agent's harmonic
    let harmonic = config.harmonics.find(h => h.frequency === agentFreq);

    if (!harmonic) {
      harmonic = {
        frequency: agentFreq,
        amplitude: 0.02,
        phase: 0,
        name: `Agent: ${agentId}`,
      };
      config.harmonics.push(harmonic);
    }

    // Boost amplitude temporarily
    harmonic.amplitude = Math.min(0.05, harmonic.amplitude * 1.5);

    return config;
  }

  // ──────────────────────────────────────────────────────────────
  // Silence
  // ──────────────────────────────────────────────────────────────

  /**
   * Returns a "silent" configuration (all frequencies muted).
   * Used when field needs intentional quiet.
   */
  generateSilence(): FrequencyConfig {
    return {
      baseFrequency: BASE_FREQUENCIES.SCHUMANN,
      harmonics: [],
      volume: 0,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Reset
  // ──────────────────────────────────────────────────────────────

  reset(): void {
    this.currentConfig = null;
    this.targetConfig = null;
  }
}

// ═══════════════════════════════════════════════════════════════
// Utility: Format Sonic Config for Display
// ═══════════════════════════════════════════════════════════════

export function formatSonicConfig(config: FrequencyConfig): string {
  let output = '\n🎵 Sonic Configuration\n\n';
  output += `Base Frequency: ${config.baseFrequency.toFixed(2)} Hz\n`;
  output += `Volume: ${(config.volume * 100).toFixed(1)}%\n\n`;

  output += 'Harmonics:\n';
  config.harmonics.forEach(h => {
    output += `  - ${h.name}: ${h.frequency.toFixed(2)} Hz @ ${(h.amplitude * 100).toFixed(1)}%\n`;
  });

  if (config.modulation) {
    output += `\nModulation: ${config.modulation.type} (${config.modulation.rate} Hz)\n`;
  }

  return output;
}

// ═══════════════════════════════════════════════════════════════
// React Hook (for integration with MAIA UI)
// ═══════════════════════════════════════════════════════════════

/**
 * React hook for real-time sonic feedback.
 * Usage:
 *
 * const { config, updateField } = useResonantSonic();
 *
 * useEffect(() => {
 *   updateField(currentFieldState);
 * }, [fieldState]);
 */
export function createResonantSonicHook() {
  // This will be implemented as a proper React hook when integrated
  // For now, this is the interface design

  return {
    config: null as FrequencyConfig | null,
    updateField: (fieldState: FieldState) => {
      // Implementation in React context
    },
    playInsightChime: (emergenceScore: number) => {
      // Implementation in audio engine
    },
    emphasizeAgent: (agentId: string) => {
      // Implementation in audio engine
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// Singleton Instance
// ═══════════════════════════════════════════════════════════════

let globalEngine: SonicFeedbackEngine | null = null;

export function getSonicFeedbackEngine(): SonicFeedbackEngine {
  if (!globalEngine) {
    globalEngine = new SonicFeedbackEngine();
  }
  return globalEngine;
}

// ═══════════════════════════════════════════════════════════════
// Audio Engine Integration (Future)
// ═══════════════════════════════════════════════════════════════

/**
 * This interface defines how the SonicFeedbackEngine integrates
 * with Web Audio API or other audio systems.
 *
 * Implementation notes:
 * - Use Web Audio API OscillatorNode for pure tones
 * - Use GainNode for amplitude control
 * - Use BiquadFilterNode for frequency modulation
 * - Apply 3% volume for subliminal effect
 */
export interface IAudioEngine {
  playConfig(config: FrequencyConfig): void;
  stop(): void;
  setVolume(volume: number): void;
}
