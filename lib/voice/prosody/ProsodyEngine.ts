/**
 * MAIA Prosody Engine
 *
 * Transforms elemental state + emotional context into voice parameters
 * that make MAIA sound genuinely present, not performed.
 *
 * Critical Move #1: Element + Emotion → Rate/Pauses/Emphasis
 */

export type Element = 'Fire' | 'Water' | 'Earth' | 'Air' | 'Aether';
export type SpeechAct = 'invite' | 'reflect' | 'affirm' | 'reframe' | 'bless' | 'guide' | 'hold';
export type EmotionalContext = {
  valence: number;  // -1 (negative) to 1 (positive)
  arousal: number;  // 0 (calm) to 1 (energized)
};

export interface ProsodyParameters {
  // Core prosody
  rate: number;           // Words per minute (60-200)
  pauseProfile: {
    clauseMs: number;     // Pause at commas/clauses
    sentenceMs: number;   // Pause at periods
    breathMs: number;     // Natural breath pause
    purposefulMs: number; // Meaningful silence (Water/Aether)
  };

  // Pitch control
  pitchRange: number;     // 0.8-1.2 (variance from baseline)
  pitchContour: 'rising' | 'falling' | 'neutral' | 'wave';

  // Energy/dynamics
  energyLevel: number;    // 0.5-1.0 (volume/intensity)
  emphasisWords: string[]; // Words to lift/emphasize

  // Breath modeling
  breathFrequency: number; // Breaths per 100 words
  breathType: 'soft' | 'normal' | 'energized';

  // Style
  styleToken: string;     // For fine-tuned TTS models
  texture: 'warm' | 'grounded' | 'clear' | 'flowing' | 'mystical';
}

/**
 * Elemental Prosody Profiles
 * Based on the natural "music" of each element
 */
const ELEMENTAL_PROFILES: Record<Element, Partial<ProsodyParameters>> = {
  Fire: {
    rate: 140,  // Faster, energized
    pauseProfile: {
      clauseMs: 150,
      sentenceMs: 300,
      breathMs: 200,
      purposefulMs: 100
    },
    pitchRange: 1.15,
    pitchContour: 'rising',
    energyLevel: 0.9,
    breathFrequency: 2.5, // More frequent, energized
    breathType: 'energized',
    styleToken: 'fire-passionate',
    texture: 'warm'
  },

  Water: {
    rate: 110,  // Slower, reflective
    pauseProfile: {
      clauseMs: 400,
      sentenceMs: 700,
      breathMs: 500,
      purposefulMs: 800  // LONG meaningful silences
    },
    pitchRange: 0.95,
    pitchContour: 'wave',  // Gentle undulation
    energyLevel: 0.65,
    breathFrequency: 1.8,
    breathType: 'soft',
    styleToken: 'water-reflective',
    texture: 'flowing'
  },

  Earth: {
    rate: 100,  // Deliberate, grounded
    pauseProfile: {
      clauseMs: 350,
      sentenceMs: 600,
      breathMs: 400,
      purposefulMs: 500
    },
    pitchRange: 0.9,  // Lower, steadier
    pitchContour: 'falling',  // Grounding downward inflection
    energyLevel: 0.75,
    breathFrequency: 2.0,
    breathType: 'normal',
    styleToken: 'earth-grounded',
    texture: 'grounded'
  },

  Air: {
    rate: 130,  // Light, flowing
    pauseProfile: {
      clauseMs: 200,
      sentenceMs: 400,
      breathMs: 250,
      purposefulMs: 200
    },
    pitchRange: 1.1,
    pitchContour: 'neutral',
    energyLevel: 0.8,
    breathFrequency: 2.2,
    breathType: 'soft',
    styleToken: 'air-clear',
    texture: 'clear'
  },

  Aether: {
    rate: 105,  // Balanced, mysterious
    pauseProfile: {
      clauseMs: 450,
      sentenceMs: 800,
      breathMs: 600,
      purposefulMs: 900  // Very long sacred pauses
    },
    pitchRange: 1.0,
    pitchContour: 'neutral',
    energyLevel: 0.7,
    breathFrequency: 1.5,  // Fewer, deeper breaths
    breathType: 'soft',
    styleToken: 'aether-mystical',
    texture: 'mystical'
  }
};

/**
 * Speech Act Modifiers
 * Adjust prosody based on conversational intent
 */
const SPEECH_ACT_MODIFIERS: Record<SpeechAct, Partial<ProsodyParameters>> = {
  invite: {
    pitchContour: 'rising',
    pauseProfile: { clauseMs: 200, sentenceMs: 400, breathMs: 300, purposefulMs: 500 },
    emphasisWords: ['would', 'could', 'might', 'perhaps', 'consider']
  },

  reflect: {
    pitchContour: 'neutral',
    rate: 95,  // Slower for reflection
    pauseProfile: { clauseMs: 500, sentenceMs: 900, breathMs: 600, purposefulMs: 1000 },
    emphasisWords: ['notice', 'sense', 'feel', 'seem', 'wonder']
  },

  affirm: {
    pitchContour: 'falling',  // Grounding affirmation
    energyLevel: 0.85,
    pauseProfile: { clauseMs: 250, sentenceMs: 500, breathMs: 350, purposefulMs: 400 },
    emphasisWords: ['yes', 'absolutely', 'indeed', 'exactly', 'true']
  },

  reframe: {
    pitchContour: 'wave',
    pauseProfile: { clauseMs: 350, sentenceMs: 700, breathMs: 450, purposefulMs: 600 },
    emphasisWords: ['also', 'another', 'perspective', 'way', 'view']
  },

  bless: {
    pitchContour: 'falling',  // Gentle closing
    rate: 90,  // Very slow for blessing
    energyLevel: 0.7,
    pauseProfile: { clauseMs: 600, sentenceMs: 1200, breathMs: 800, purposefulMs: 1500 },
    emphasisWords: ['journey', 'peace', 'light', 'love', 'whole']
  },

  guide: {
    pitchContour: 'neutral',
    pauseProfile: { clauseMs: 300, sentenceMs: 600, breathMs: 400, purposefulMs: 500 },
    emphasisWords: ['can', 'will', 'try', 'explore', 'step']
  },

  hold: {
    pitchContour: 'neutral',
    rate: 80,  // Very slow for holding space
    energyLevel: 0.6,
    pauseProfile: { clauseMs: 800, sentenceMs: 1500, breathMs: 1000, purposefulMs: 2000 },
    emphasisWords: ['here', 'with', 'present', 'safe', 'held']
  }
};

/**
 * Main Prosody Engine
 * Combines element, speech act, and emotional context into voice parameters
 */
export class ProsodyEngine {
  /**
   * Generate prosody parameters for a given context
   */
  static generateParameters(
    element: Element,
    speechAct: SpeechAct,
    emotionalContext: EmotionalContext,
    text: string
  ): ProsodyParameters {
    // Start with elemental base
    const base = { ...ELEMENTAL_PROFILES[element] } as ProsodyParameters;

    // Apply speech act modifiers
    const actMod = SPEECH_ACT_MODIFIERS[speechAct];
    Object.assign(base, actMod);

    // Adjust for emotional context
    this.adjustForEmotion(base, emotionalContext);

    // Extract emphasis words from text
    base.emphasisWords = this.extractEmphasisWords(text, actMod.emphasisWords || []);

    return base;
  }

  /**
   * Adjust prosody based on emotional valence and arousal
   */
  private static adjustForEmotion(
    params: ProsodyParameters,
    emotion: EmotionalContext
  ): void {
    // High arousal = faster, more energy
    if (emotion.arousal > 0.6) {
      params.rate = Math.min(params.rate * 1.15, 180);
      params.energyLevel = Math.min(params.energyLevel * 1.1, 1.0);
      params.breathType = 'energized';
    }

    // Low arousal = slower, softer
    if (emotion.arousal < 0.3) {
      params.rate = Math.max(params.rate * 0.85, 80);
      params.energyLevel = Math.max(params.energyLevel * 0.9, 0.5);
      params.breathType = 'soft';
    }

    // Negative valence = lower pitch, more pauses
    if (emotion.valence < -0.3) {
      params.pitchRange = Math.max(params.pitchRange * 0.9, 0.8);
      params.pauseProfile.purposefulMs = Math.floor(params.pauseProfile.purposefulMs * 1.3);
    }

    // Positive valence = higher pitch variance, lighter
    if (emotion.valence > 0.3) {
      params.pitchRange = Math.min(params.pitchRange * 1.1, 1.2);
      params.pitchContour = 'rising';
    }
  }

  /**
   * Extract words to emphasize from text
   */
  private static extractEmphasisWords(
    text: string,
    keywordPatterns: string[]
  ): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const emphasized: string[] = [];

    for (const word of words) {
      for (const pattern of keywordPatterns) {
        if (word.includes(pattern)) {
          emphasized.push(word);
        }
      }
    }

    return emphasized;
  }

  /**
   * Shape text with prosody markers for TTS
   * Adds commas, ellipses, emphasis markers
   */
  static shapeText(text: string, params: ProsodyParameters): string {
    let shaped = text;

    // Add clause breaks based on pause profile
    if (params.pauseProfile.clauseMs > 400) {
      // Add commas at natural breaks for longer pauses
      shaped = this.addClauseBreaks(shaped);
    }

    // Add purposeful silence markers for Water/Aether
    if (params.pauseProfile.purposefulMs > 700) {
      shaped = shaped.replace(/\.\s+/g, '... ');  // Ellipses for longer pauses
    }

    // Mark emphasized words
    for (const word of params.emphasisWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      shaped = shaped.replace(regex, `*${word}*`);
    }

    // Add breath markers
    shaped = this.addBreathMarkers(shaped, params.breathFrequency);

    return shaped;
  }

  /**
   * Add natural clause breaks (commas)
   */
  private static addClauseBreaks(text: string): string {
    // Add commas before common conjunctions if missing
    return text
      .replace(/\s+(and|but|or|yet|so)\s+/g, ', $1 ')
      .replace(/\s+(if|when|while|though|although)\s+/g, ', $1 ');
  }

  /**
   * Add breath markers based on frequency
   */
  private static addBreathMarkers(text: string, frequency: number): string {
    const sentences = text.split(/\.\s+/);
    const wordsPerBreath = Math.floor(100 / frequency);

    return sentences.map(sentence => {
      const words = sentence.split(/\s+/);
      if (words.length < wordsPerBreath) return sentence;

      // Insert breath marker every N words
      const chunks: string[] = [];
      for (let i = 0; i < words.length; i += wordsPerBreath) {
        chunks.push(words.slice(i, i + wordsPerBreath).join(' '));
      }

      return chunks.join(' [breath] ');
    }).join('. ');
  }
}
