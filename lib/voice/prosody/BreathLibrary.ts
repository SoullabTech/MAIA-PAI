/**
 * MAIA Breath & Silence Library
 *
 * Critical Move #2: Natural breathing and purposeful silence
 * "Soul lives in the rests"
 *
 * Provides breath samples and silence profiles that make MAIA
 * sound genuinely present, not robotic.
 */

export type BreathType = 'soft' | 'normal' | 'energized';
export type SilenceType = 'clause' | 'sentence' | 'purposeful' | 'sacred';

export interface BreathSample {
  type: BreathType;
  duration: number;  // milliseconds
  audioPath?: string; // Path to actual breath audio file
  description: string;
}

export interface SilenceProfile {
  type: SilenceType;
  duration: number;  // milliseconds
  context: string;   // When to use this silence
}

/**
 * Breath Sample Library
 * In production, these would be actual audio files
 * For now, we define the specifications
 */
export const BREATH_SAMPLES: Record<BreathType, BreathSample[]> = {
  soft: [
    {
      type: 'soft',
      duration: 300,
      audioPath: 'breath_library/soft_300ms.wav',
      description: 'Gentle inhale for Water/Aether, reflective moments'
    },
    {
      type: 'soft',
      duration: 500,
      audioPath: 'breath_library/soft_500ms.wav',
      description: 'Deeper soft breath for transitions, holding space'
    },
    {
      type: 'soft',
      duration: 800,
      audioPath: 'breath_library/soft_800ms.wav',
      description: 'Sacred pause breath before blessing/closure'
    }
  ],

  normal: [
    {
      type: 'normal',
      duration: 250,
      audioPath: 'breath_library/normal_250ms.wav',
      description: 'Standard conversational breath'
    },
    {
      type: 'normal',
      duration: 400,
      audioPath: 'breath_library/normal_400ms.wav',
      description: 'Slightly deeper for longer sentences'
    }
  ],

  energized: [
    {
      type: 'energized',
      duration: 200,
      audioPath: 'breath_library/energized_200ms.wav',
      description: 'Quick breath for Fire element, passionate delivery'
    },
    {
      type: 'energized',
      duration: 350,
      audioPath: 'breath_library/energized_350ms.wav',
      description: 'More pronounced energized breath'
    }
  ]
};

/**
 * Silence Profiles
 * Different types of meaningful silence
 */
export const SILENCE_PROFILES: Record<SilenceType, SilenceProfile> = {
  clause: {
    type: 'clause',
    duration: 250,
    context: 'Natural pause at commas, between clauses'
  },

  sentence: {
    type: 'sentence',
    duration: 500,
    context: 'End of sentence, before next thought'
  },

  purposeful: {
    type: 'purposeful',
    duration: 800,
    context: 'Meaningful pause for Water element, letting words land'
  },

  sacred: {
    type: 'sacred',
    duration: 1500,
    context: 'Aether element, ritual moments, deep transitions'
  }
};

/**
 * Breath Library Manager
 */
export class BreathLibrary {
  /**
   * Get appropriate breath sample for context
   */
  static getBreath(type: BreathType, arousal: number): BreathSample {
    const samples = BREATH_SAMPLES[type];

    // Higher arousal = shorter breath
    if (arousal > 0.7) {
      return samples[0]; // Shortest
    }

    // Lower arousal = longer, deeper breath
    if (arousal < 0.3) {
      return samples[samples.length - 1]; // Longest
    }

    // Medium arousal = middle breath
    return samples[Math.floor(samples.length / 2)];
  }

  /**
   * Get silence duration for context
   */
  static getSilence(type: SilenceType): number {
    return SILENCE_PROFILES[type].duration;
  }

  /**
   * Insert breaths into text at natural points
   * Returns text with [breath:type:duration] markers
   */
  static insertBreaths(
    text: string,
    breathType: BreathType,
    frequency: number,  // Breaths per 100 words
    arousal: number = 0.5
  ): string {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const wordsPerBreath = Math.floor(100 / frequency);

    return sentences.map(sentence => {
      const words = sentence.split(/\s+/);

      // Don't add breath for very short sentences
      if (words.length < wordsPerBreath / 2) {
        return sentence;
      }

      // Insert breath at natural clause boundaries
      const breath = this.getBreath(breathType, arousal);
      const breathMarker = `[breath:${breath.type}:${breath.duration}]`;

      // Find natural insertion points (after commas, conjunctions)
      let marked = sentence;

      // After commas (but not too frequently)
      const commaPositions = this.findCommaPositions(sentence);
      if (commaPositions.length > 0) {
        const insertAt = commaPositions[Math.floor(commaPositions.length / 2)];
        marked = this.insertAt(marked, insertAt, breathMarker);
      }

      return marked;
    }).join(' ');
  }

  /**
   * Insert purposeful silence markers
   */
  static insertPurposefulSilence(
    text: string,
    silenceType: SilenceType,
    locations: 'sentences' | 'paragraphs' | 'transitions' = 'sentences'
  ): string {
    const silence = SILENCE_PROFILES[silenceType];
    const marker = `[silence:${silence.duration}]`;

    if (locations === 'sentences') {
      // Add silence at end of sentences
      return text.replace(/([.!?])\s+/g, `$1 ${marker} `);
    }

    if (locations === 'paragraphs') {
      // Add silence at paragraph breaks
      return text.replace(/\n\n/g, `\n${marker}\n`);
    }

    if (locations === 'transitions') {
      // Add silence at transitional phrases
      const transitions = [
        'And yet',
        'However',
        'What if',
        'Consider',
        'Perhaps',
        'Notice'
      ];

      let marked = text;
      for (const transition of transitions) {
        const regex = new RegExp(`\\b${transition}\\b`, 'gi');
        marked = marked.replace(regex, `${marker} ${transition}`);
      }

      return marked;
    }

    return text;
  }

  /**
   * Create cadence memory for session
   * Tracks recent speaking density to adjust future pauses
   */
  static createCadenceMemory() {
    const recentTurns: number[] = [];
    const maxMemory = 5;

    return {
      recordTurn(wordCount: number, duration: number) {
        const density = wordCount / (duration / 1000); // Words per second
        recentTurns.push(density);

        if (recentTurns.length > maxMemory) {
          recentTurns.shift();
        }
      },

      shouldSlowDown(): boolean {
        if (recentTurns.length < 3) return false;

        const avgDensity = recentTurns.reduce((a, b) => a + b, 0) / recentTurns.length;

        // If last 3 turns were dense (>2.5 words/sec), recommend slowing
        return avgDensity > 2.5;
      },

      getSpeedAdjustment(): number {
        if (!this.shouldSlowDown()) return 1.0;

        // Recommend 10-15% slowdown
        return 0.85;
      },

      getPauseMultiplier(): number {
        if (!this.shouldSlowDown()) return 1.0;

        // Recommend 30% wider pauses
        return 1.3;
      }
    };
  }

  // Helper methods

  private static findCommaPositions(text: string): number[] {
    const positions: number[] = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ',') {
        positions.push(i);
      }
    }
    return positions;
  }

  private static insertAt(text: string, position: number, insert: string): string {
    return text.slice(0, position + 1) + ' ' + insert + text.slice(position + 1);
  }

  /**
   * Generate breath audio file specifications
   * For audio engineer to record
   */
  static generateRecordingSpecs(): string {
    return `
# MAIA Breath Library Recording Specifications

## Recording Requirements
- Sample Rate: 44.1kHz or 48kHz
- Bit Depth: 24-bit
- Format: WAV (uncompressed)
- Room: Very quiet (<30dB ambient)
- Distance: 6-8 inches from mic
- Mic Type: Condenser (warm character)

## Breath Samples to Record

### Soft Breaths (Water/Aether)
1. soft_300ms.wav - Gentle inhale, barely audible, 300ms
   - Style: Peaceful, reflective
   - Use: Water reflections, gentle transitions

2. soft_500ms.wav - Deeper soft breath, 500ms
   - Style: Holding space, compassionate
   - Use: Before affirmations, holding pauses

3. soft_800ms.wav - Sacred pause breath, 800ms
   - Style: Reverent, mystical
   - Use: Aether moments, blessings, ritual closures

### Normal Breaths (Air/Earth)
1. normal_250ms.wav - Conversational breath, 250ms
   - Style: Natural, neutral
   - Use: Standard between-sentence pauses

2. normal_400ms.wav - Slightly deeper, 400ms
   - Style: Grounded, present
   - Use: Earth element, longer thought transitions

### Energized Breaths (Fire)
1. energized_200ms.wav - Quick inhale, 200ms
   - Style: Passionate, engaged
   - Use: Fire element, excited delivery

2. energized_350ms.wav - More pronounced, 350ms
   - Style: Vital, alive
   - Use: High-arousal Fire moments

## Processing Chain
1. Gentle high-pass filter (60Hz) to remove rumble
2. Very light compression (1.5:1 ratio)
3. De-click/de-pop
4. Normalize to -18dBFS
5. Fade in (5ms), fade out (20ms)
6. Export mono

## Alternative: Synthesize from Room Tone
If recording is not available, create from room tone:
1. Record 30 seconds of silent room tone
2. Use spectral shaping to create subtle airflow
3. Apply gentle amplitude envelope
4. Layer with very quiet pink noise (-40dB)
    `.trim();
  }
}

/**
 * Export helper to generate breath sample files
 */
export function generateBreathSampleManifest() {
  const manifest: Array<{
    filename: string;
    type: BreathType;
    duration: number;
    description: string;
  }> = [];

  for (const [type, samples] of Object.entries(BREATH_SAMPLES)) {
    for (const sample of samples) {
      manifest.push({
        filename: sample.audioPath || '',
        type: sample.type,
        duration: sample.duration,
        description: sample.description
      });
    }
  }

  return manifest;
}
