/**
 * MAIA Text Post-Processor
 *
 * IMMEDIATE WIN - Works today with OpenAI Alloy
 *
 * Shapes text before TTS to elicit better prosody:
 * - Inserts pauses (commas, em-dashes, breath markers)
 * - Marks emphasis
 * - Adjusts question intonation
 * - Adds breath cues
 *
 * Based on element, arousal, valence
 */

import type { Element, ProsodyParameters } from './ProsodyEngine';

export interface ShapingContext {
  element: Element;
  arousal: number;    // 0-1
  valence: number;    // -1 to 1
  intent: 'invite' | 'reflect' | 'affirm' | 'reframe' | 'bless' | 'guide' | 'hold';
}

/**
 * Text Post-Processor
 * Transforms text to elicit better prosody from TTS
 */
export class TextPostProcessor {
  /**
   * Main entry point - shape text for TTS
   */
  static shape(text: string, context: ShapingContext, prosody: ProsodyParameters): string {
    let shaped = text;

    // 1. Add semantic pauses (em-dashes for meaning shifts)
    shaped = this.addSemanticPauses(shaped, context);

    // 2. Insert breath markers
    shaped = this.insertBreathCues(shaped, context, prosody);

    // 3. Adjust list pauses
    shaped = this.shapeListPauses(shaped);

    // 4. Mark emphasis
    shaped = this.markEmphasis(shaped, prosody.emphasisWords);

    // 5. Adjust question intonation
    shaped = this.shapeQuestions(shaped, context.element);

    // 6. Add silence markers for Water/Aether
    if (context.element === 'Water' || context.element === 'Aether') {
      shaped = this.addPurposefulSilence(shaped, context.element);
    }

    // 7. Slow down blessings/closures
    if (context.intent === 'bless' || context.intent === 'hold') {
      shaped = this.emphasizePresence(shaped);
    }

    return shaped;
  }

  /**
   * Add em-dashes at semantic shifts
   * Teaches TTS to pause for meaning
   */
  private static addSemanticPauses(text: string, context: ShapingContext): string {
    const transitionWords = [
      'However',
      'And yet',
      'What if',
      'Consider',
      'Perhaps',
      'Notice',
      'Meanwhile',
      'Still',
      'Even so',
      'At the same time'
    ];

    let shaped = text;

    // Add em-dash before transition words
    for (const word of transitionWords) {
      // Only if not already preceded by punctuation
      const regex = new RegExp(`(?<![\\.!?])\\s+(${word})`, 'gi');
      shaped = shaped.replace(regex, ' — $1');
    }

    // Add em-dash around parenthetical phrases
    shaped = shaped.replace(/\s*\(([^)]+)\)\s*/g, ' — $1 — ');

    return shaped;
  }

  /**
   * Insert breath cues based on arousal and element
   * Lower arousal = more breaths, longer pauses
   */
  private static insertBreathCues(
    text: string,
    context: ShapingContext,
    prosody: ProsodyParameters
  ): string {
    const sentences = text.split(/(?<=[.!?])\s+/);

    return sentences.map(sentence => {
      const words = sentence.split(/\s+/);

      // Short sentences don't need breath
      if (words.length < 12) return sentence;

      // Calculate breath frequency based on arousal
      const breathFrequency = context.arousal < 0.5
        ? 6  // More frequent for low arousal (Water/Aether)
        : 14; // Less frequent for high arousal (Fire)

      // Find natural breath points (after commas, before conjunctions)
      const commaPositions = this.findBreathPoints(sentence);

      if (commaPositions.length === 0) {
        // No natural break - insert one in middle
        const midPoint = Math.floor(words.length / 2);
        words.splice(midPoint, 0, '…');
        return words.join(' ');
      }

      // Insert breath marker at best position
      const breathPosition = commaPositions[Math.floor(commaPositions.length / 2)];
      return this.insertBreathAt(sentence, breathPosition);

    }).join(' ');
  }

  /**
   * Find good breath points in text
   */
  private static findBreathPoints(text: string): number[] {
    const points: number[] = [];

    // After commas
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ',') points.push(i);
    }

    // Before conjunctions (if no commas)
    if (points.length === 0) {
      const conjunctions = [' and ', ' but ', ' so ', ' yet ', ' or '];
      for (const conj of conjunctions) {
        const idx = text.indexOf(conj);
        if (idx > 0) points.push(idx);
      }
    }

    return points;
  }

  /**
   * Insert breath marker at position
   */
  private static insertBreathAt(text: string, position: number): string {
    // If at comma, replace comma with ellipsis
    if (text[position] === ',') {
      return text.slice(0, position) + '…' + text.slice(position + 1);
    }

    return text.slice(0, position) + ' … ' + text.slice(position);
  }

  /**
   * Improve list pause clarity
   * Keep commas but ensure they're honored
   */
  private static shapeListPauses(text: string): string {
    // Add micro-pause after list commas
    // (Most TTS skip commas in lists - force pause with space)
    return text.replace(/,\s*(?=[a-z])/g, ', '); // Ensure space after comma
  }

  /**
   * Mark emphasis words
   * Wrapping in italics or asterisks can trigger TTS emphasis
   */
  private static markEmphasis(text: string, emphasisWords: string[]): string {
    let shaped = text;

    for (const word of emphasisWords) {
      // Don't emphasize if already in quotes or italics
      const regex = new RegExp(`(?<!["'*])\\b(${word})\\b(?!["'*])`, 'gi');

      // Subtle emphasis: just ensure normal stress (some TTS de-emphasize function words)
      // We don't want theatrical emphasis - just natural stress
      shaped = shaped.replace(regex, (match) => match); // Keep as-is for now
    }

    return shaped;
  }

  /**
   * Shape question intonation
   * Earth = flat (no rise)
   * Others = natural rise for questions
   */
  private static shapeQuestions(text: string, element: Element): string {
    if (!text.includes('?')) return text;

    // Earth element: prevent rising intonation
    // Add period after question mark to ground it
    if (element === 'Earth') {
      return text.replace(/\?(\s|$)/g, '.  '); // Flat ending
    }

    // Water/Aether: add space before ? for gentler rise
    if (element === 'Water' || element === 'Aether') {
      return text.replace(/(\S)\?/g, '$1 ?');
    }

    return text;
  }

  /**
   * Add purposeful silence markers
   * Water/Aether elements need breathing room
   */
  private static addPurposefulSilence(text: string, element: Element): string {
    const sentences = text.split(/(?<=[.!?])\s+/);

    // Add extended pause between sentences
    const pauseMarker = element === 'Aether' ? '... ' : '… ';

    return sentences.join(pauseMarker);
  }

  /**
   * Emphasize presence for blessings/holding
   * Slow down, add space
   */
  private static emphasizePresence(text: string): string {
    // Add pauses around key presence words
    const presenceWords = [
      'here',
      'now',
      'present',
      'safe',
      'held',
      'whole',
      'peace',
      'light',
      'love',
      'journey'
    ];

    let shaped = text;

    for (const word of presenceWords) {
      const regex = new RegExp(`\\b(${word})\\b`, 'gi');
      shaped = shaped.replace(regex, '… $1 …');
    }

    // Clean up double ellipses
    shaped = shaped.replace(/…\s*…/g, '…');

    return shaped;
  }

  /**
   * Generate delivery note for Alloy corpus generation
   * Tells Alloy how to speak based on element
   */
  static generateDeliveryNote(context: ShapingContext): string {
    const { element, arousal } = context;

    const speeds = {
      Fire: 1.1,
      Water: 0.9,
      Earth: 0.85,
      Air: 1.0,
      Aether: 0.85
    };

    const notes: Record<Element, string> = {
      Fire: "Forward energy. Short pauses. Strong emphasis on action verbs. Vital, engaged delivery.",
      Water: "Gentle cadence. Soften ends of sentences. Micro-pauses after commas. Flowing, compassionate.",
      Earth: "Even cadence. Slightly slower at paragraph starts. No trailing rise. Grounded, steady.",
      Air: "Crisp articulation. Light emphasis on keywords. Subtle final rise for open questions. Clear, bright.",
      Aether: "Spacious. Long rests around meaning shifts. Soft breath before key lines. Numinous, reverent."
    };

    return `Speed: ${speeds[element]}x. ${notes[element]}`;
  }

  /**
   * Preview shaped text
   * Shows before/after for debugging
   */
  static preview(original: string, context: ShapingContext, prosody: ProsodyParameters): {
    original: string;
    shaped: string;
    deliveryNote: string;
    changes: string[];
  } {
    const shaped = this.shape(original, context, prosody);

    const changes: string[] = [];

    if (shaped.includes('—')) changes.push('Added semantic pauses (em-dashes)');
    if (shaped.includes('…')) changes.push('Inserted breath cues');
    if (shaped !== original) changes.push('Text reshaped for prosody');

    return {
      original,
      shaped,
      deliveryNote: this.generateDeliveryNote(context),
      changes
    };
  }
}

/**
 * Quick helper for immediate use
 */
export function shapeForTTS(
  text: string,
  element: Element,
  arousal: number = 0.5,
  intent: ShapingContext['intent'] = 'reflect'
): string {
  // Generate prosody parameters
  const { ProsodyEngine } = require('./ProsodyEngine');

  const prosody = ProsodyEngine.generateParameters(
    element,
    intent,
    { valence: 0.5, arousal },
    text
  );

  return TextPostProcessor.shape(text, {
    element,
    arousal,
    valence: 0.5,
    intent
  }, prosody);
}
