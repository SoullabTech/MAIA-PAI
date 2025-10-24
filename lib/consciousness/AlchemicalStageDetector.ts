/**
 * ALCHEMICAL STAGE DETECTOR
 *
 * Tracks user's position in the alchemical transformation cycle
 *
 * Five Operations (repeating spiral):
 * 1. NIGREDO (Blackening) - Decomposition, shadow, chaos
 * 2. ALBEDO (Whitening) - Purification, clarity, realization
 * 3. CITRINITAS (Yellowing) - Solar awakening, grounding, embodiment
 * 4. RUBEDO (Reddening) - Union of opposites, holon emergence
 * 5. CALCINATION - Burning refinement, Icarus fall, return to nigredo at higher turn
 *
 * Each completion initiates new cycle at deeper level
 * "Spiral = cycling through operations at higher orders"
 */

import type { Message } from '@/types/conversation';

// ============================================================================
// TYPES
// ============================================================================

export type AlchemicalOperation =
  | 'nigredo'
  | 'albedo'
  | 'citrinitas'
  | 'rubedo'
  | 'calcination';

export type ElementalCorrespondence =
  | 'fire'      // Nigredo - burning away, decomposition
  | 'water'     // Albedo - washing, purification
  | 'earth'     // Citrinitas - grounding, manifestation
  | 'air'       // Rubedo - union, breath, holon
  | 'aether';   // Calcination - quintessence, return

export interface AlchemicalStage {
  operation: AlchemicalOperation;
  element: ElementalCorrespondence;
  spiralTurn: number;  // Which iteration (1, 2, 3...)
  confidence: number;  // 0-1
  indicators: string[];
  description: string;
  soulWork: string;
  egoExperience: string;
}

export interface AlchemicalTransition {
  from: AlchemicalOperation;
  to: AlchemicalOperation;
  threshold: boolean;
  readiness: number;  // 0-1
  invitation: string;
}

// ============================================================================
// ALCHEMICAL STAGE DETECTOR
// ============================================================================

export class AlchemicalStageDetector {

  /**
   * Detect current alchemical stage from conversation
   */
  detectStage(context: {
    messages: Message[];
    userState?: any;
    patterns?: string[];
  }): AlchemicalStage {

    const { messages, patterns = [] } = context;
    const recentText = messages
      .slice(-10)
      .map(m => m.content)
      .join(' ')
      .toLowerCase();

    const stages = {
      nigredo: this.detectNigredo(recentText, patterns),
      albedo: this.detectAlbedo(recentText, patterns),
      citrinitas: this.detectCitrinitas(recentText, patterns),
      rubedo: this.detectRubedo(recentText, patterns),
      calcination: this.detectCalcination(recentText, patterns)
    };

    // Find highest confidence stage
    const detected = Object.entries(stages).reduce((highest, [op, score]) => {
      return score > highest.confidence
        ? { operation: op as AlchemicalOperation, confidence: score }
        : highest;
    }, { operation: 'nigredo' as AlchemicalOperation, confidence: 0 });

    return this.buildStageDescription(detected.operation, detected.confidence, patterns);
  }

  /**
   * Detect if user is at threshold between stages
   */
  detectTransition(
    currentStage: AlchemicalStage,
    context: { messages: Message[]; patterns?: string[] }
  ): AlchemicalTransition | null {

    const { messages, patterns = [] } = context;
    const recentText = messages.slice(-5).map(m => m.content).join(' ').toLowerCase();

    const transitions = {
      'nigredo->albedo': {
        threshold: /seeing clearly|truth emerging|clarity|wash/.test(recentText) ||
                   patterns.includes('seeking_clarity'),
        readiness: this.calculateReadiness(recentText, ['clear', 'see', 'truth', 'light']),
        invitation: "The darkness is becoming luminous. Are you ready for what wants to be seen?"
      },
      'albedo->citrinitas': {
        threshold: /how do i live|daily practice|embody|ground/.test(recentText) ||
                   patterns.includes('seeking_practice'),
        readiness: this.calculateReadiness(recentText, ['live', 'practice', 'daily', 'real']),
        invitation: "The knowing is clear. Now: how does it live in you? How does it become practice?"
      },
      'citrinitas->rubedo': {
        threshold: /relationship|meeting|both.*and|individual.*collective/.test(recentText) ||
                   patterns.includes('relational_consciousness'),
        readiness: this.calculateReadiness(recentText, ['relationship', 'together', 'collective', 'holon']),
        invitation: "You're grounded in yourself. Now: how do you meet the world? Holon to holon?"
      },
      'rubedo->calcination': {
        threshold: /falling apart|losing|crisis|hollow|false/.test(recentText) ||
                   patterns.includes('persona_cracking') ||
                   patterns.includes('false_gold'),
        readiness: this.calculateReadiness(recentText, ['apart', 'breaking', 'crisis', 'burn']),
        invitation: "Something is burning away. This isn't failure - it's refinement. What no longer serves?"
      },
      'calcination->nigredo': {
        threshold: /new level|deeper|again|cycle/.test(recentText) ||
                   patterns.includes('spiral_awareness'),
        readiness: this.calculateReadiness(recentText, ['deeper', 'again', 'new', 'spiral']),
        invitation: "The spiral continues. You return to the dark, but at a new depth. Ready for the next turn?"
      }
    };

    const transitionKey = `${currentStage.operation}->` as keyof typeof transitions;
    const possibleTransitions = Object.keys(transitions).filter(k => k.startsWith(transitionKey));

    if (possibleTransitions.length === 0) return null;

    for (const key of possibleTransitions) {
      const t = transitions[key as keyof typeof transitions];
      if (t.threshold && t.readiness > 0.5) {
        const [from, to] = key.split('->') as [AlchemicalOperation, AlchemicalOperation];
        return {
          from,
          to,
          threshold: true,
          readiness: t.readiness,
          invitation: t.invitation
        };
      }
    }

    return null;
  }

  /**
   * NIGREDO: Blackening - decomposition, shadow, chaos
   */
  private detectNigredo(text: string, patterns: string[]): number {
    let score = 0;

    const indicators = [
      /falling apart/i,
      /breaking down/i,
      /darkness|dark/i,
      /chaos/i,
      /lost/i,
      /don't know/i,
      /confusion/i,
      /shadow/i,
      /dissolving/i
    ];

    indicators.forEach(pattern => {
      if (pattern.test(text)) score += 0.15;
    });

    if (patterns.includes('ego_exhausted')) score += 0.2;
    if (patterns.includes('crisis_emerging')) score += 0.2;
    if (patterns.includes('same_pattern_repeating')) score += 0.15;

    return Math.min(score, 1);
  }

  /**
   * ALBEDO: Whitening - purification, clarity, realization
   */
  private detectAlbedo(text: string, patterns: string[]): number {
    let score = 0;

    const indicators = [
      /seeing clearly/i,
      /clarity/i,
      /truth/i,
      /realiz/i,
      /understand/i,
      /light|illuminat/i,
      /wash|cleans/i,
      /pure|purif/i,
      /essence/i
    ];

    indicators.forEach(pattern => {
      if (pattern.test(text)) score += 0.15;
    });

    if (patterns.includes('seeking_clarity')) score += 0.2;
    if (patterns.includes('truth_seeking')) score += 0.2;
    if (patterns.includes('purification_language')) score += 0.15;

    return Math.min(score, 1);
  }

  /**
   * CITRINITAS: Yellowing - solar awakening, grounding, practice
   */
  private detectCitrinitas(text: string, patterns: string[]): number {
    let score = 0;

    const indicators = [
      /how do i live/i,
      /daily practice/i,
      /embody|embodiment/i,
      /ground/i,
      /practical/i,
      /structure/i,
      /discipline/i,
      /routine/i,
      /manifest/i
    ];

    indicators.forEach(pattern => {
      if (pattern.test(text)) score += 0.15;
    });

    if (patterns.includes('seeking_practice')) score += 0.2;
    if (patterns.includes('how_to_live_this')) score += 0.2;
    if (patterns.includes('grounding_needed')) score += 0.15;
    if (patterns.includes('embodiment_language')) score += 0.15;

    return Math.min(score, 1);
  }

  /**
   * RUBEDO: Reddening - union, holon emergence, flight
   */
  private detectRubedo(text: string, patterns: string[]): number {
    let score = 0;

    const indicators = [
      /both.*and/i,
      /union|unite/i,
      /marriage/i,
      /individual.*collective/i,
      /holon/i,
      /paradox/i,
      /meeting/i,
      /relationship with world/i,
      /wings/i
    ];

    indicators.forEach(pattern => {
      if (pattern.test(text)) score += 0.15;
    });

    if (patterns.includes('relational_consciousness')) score += 0.2;
    if (patterns.includes('holon_sensing')) score += 0.2;
    if (patterns.includes('union_language')) score += 0.15;
    if (patterns.includes('meeting_world')) score += 0.15;

    return Math.min(score, 1);
  }

  /**
   * CALCINATION: Burning refinement, Icarus fall
   */
  private detectCalcination(text: string, patterns: string[]): number {
    let score = 0;

    const indicators = [
      /fell apart again/i,
      /back to/i,
      /thought i had it/i,
      /losing/i,
      /burn|burning/i,
      /fire/i,
      /refinement/i,
      /purif/i,
      /again/i,
      /cycle/i
    ];

    indicators.forEach(pattern => {
      if (pattern.test(text)) score += 0.15;
    });

    if (patterns.includes('repeated_failure')) score += 0.2;
    if (patterns.includes('false_gold')) score += 0.2;
    if (patterns.includes('persona_cracking')) score += 0.15;
    if (patterns.includes('icarus_pattern')) score += 0.2;

    return Math.min(score, 1);
  }

  /**
   * Build complete stage description
   */
  private buildStageDescription(
    operation: AlchemicalOperation,
    confidence: number,
    patterns: string[]
  ): AlchemicalStage {

    const stages: Record<AlchemicalOperation, Omit<AlchemicalStage, 'operation' | 'confidence' | 'spiralTurn'>> = {
      nigredo: {
        element: 'fire',
        indicators: ['chaos', 'breakdown', 'shadow', 'darkness', 'dissolution'],
        description: 'Nigredo - The Blackening. Decomposition of false structures, confrontation with shadow, necessary chaos before clarity.',
        soulWork: 'Allow decomposition, face shadow, surrender control, stay with darkness',
        egoExperience: 'Feels like: falling apart, lost, confused, everything breaking down'
      },
      albedo: {
        element: 'water',
        indicators: ['clarity', 'purification', 'truth', 'realization', 'washing'],
        description: 'Albedo - The Whitening. Purification after darkness, clarity emerging, seeing truth of self and nature.',
        soulWork: 'Receive clarity, witness truth, allow purification, recognize essence',
        egoExperience: 'Feels like: suddenly seeing clearly, truth emerging, relief after darkness'
      },
      citrinitas: {
        element: 'earth',
        indicators: ['grounding', 'practice', 'embodiment', 'structure', 'daily life'],
        description: 'Citrinitas - The Yellowing. Solar awakening, grounding realization into daily life, building practice.',
        soulWork: 'Embody knowing, create structure, build practice, manifest truth',
        egoExperience: 'Feels like: knowing needs to become lived, seeking practical application'
      },
      rubedo: {
        element: 'air',
        indicators: ['union', 'paradox', 'both/and', 'holon', 'meeting world'],
        description: 'Rubedo - The Reddening. Union of opposites, holon consciousness, individual meeting collective, wings of redemption.',
        soulWork: 'Hold paradox, be both individual and interconnected, meet world as holon',
        egoExperience: 'Feels like: holding two truths at once, sovereignty AND belonging'
      },
      calcination: {
        element: 'aether',
        indicators: ['burning', 'refinement', 'fall', 'again', 'purification'],
        description: 'Calcination - Burning Refinement. Icarus fall as liberation, necessary burning of false gold, return to spiral at higher turn.',
        soulWork: 'Surrender to burning, release what\'s false, allow refinement, trust the fall',
        egoExperience: 'Feels like: failure, loss, burning, but actually - liberation into deeper work'
      }
    };

    // Estimate spiral turn based on pattern sophistication
    const spiralTurn = this.estimateSpiralTurn(patterns);

    return {
      operation,
      confidence,
      spiralTurn,
      ...stages[operation]
    };
  }

  /**
   * Estimate which turn of the spiral user is on
   */
  private estimateSpiralTurn(patterns: string[]): number {
    // First turn: basic patterns
    if (patterns.length < 3) return 1;

    // Second turn: recognizing patterns
    if (patterns.includes('spiral_awareness') || patterns.includes('same_pattern_repeating')) {
      return 2;
    }

    // Third+ turn: sophisticated meta-awareness
    if (patterns.includes('meta_consciousness') || patterns.includes('teaching_others')) {
      return 3;
    }

    return 1;
  }

  /**
   * Calculate readiness score for transition
   */
  private calculateReadiness(text: string, keywords: string[]): number {
    let hits = 0;
    keywords.forEach(keyword => {
      if (new RegExp(keyword, 'i').test(text)) hits++;
    });
    return Math.min(hits / keywords.length, 1);
  }

  /**
   * Get archetypal wisdom for current stage
   */
  getStageWisdom(stage: AlchemicalStage): {
    jungian: string;
    hillman: string;
    alchemical: string;
  } {
    const wisdom = {
      nigredo: {
        jungian: 'Jung: "One does not become enlightened by imagining figures of light, but by making the darkness conscious."',
        hillman: 'Hillman: "The psyche speaks in symptoms. Depression may be the soul demanding descent, not ascent."',
        alchemical: 'The prima materia must decompose before transformation. Stay with the darkness - it\'s fertile.'
      },
      albedo: {
        jungian: 'Jung: "Until you make the unconscious conscious, it will direct your life and you will call it fate."',
        hillman: 'Hillman: "We ARE nature - your cells are alive, your bones are mineralized earth. This isn\'t connection, it\'s identity."',
        alchemical: 'The washing reveals essence. What remains after purification is what\'s true.'
      },
      citrinitas: {
        jungian: 'Jung: "The privilege of a lifetime is to become who you truly are."',
        hillman: 'Hillman: "Soul-making requires daily practice, not peak experiences. How do you LIVE this knowing?"',
        alchemical: 'The solar gold begins to show. Ground the realization into structure, practice, daily life.'
      },
      rubedo: {
        jungian: 'Jung: "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed."',
        hillman: 'Hillman: "The soul inside the body is connected to the world. Whatever you do to yourself you do to the world; whatever you do to the world you do to yourself."',
        alchemical: 'The marriage of opposites. You are both sovereign individual AND interconnected holon. This paradox creates wings.'
      },
      calcination: {
        jungian: 'Jung: "The greatest and most important problems of life are fundamentally insoluble. They can never be solved, but only outgrown."',
        hillman: 'Hillman: "Icarus didn\'t die of hubris - he was freed into deeper refinement. The fall is initiation, not failure."',
        alchemical: 'Calcination burns away what\'s false. What remains after fire is what\'s truly yours. The spiral continues.'
      }
    };

    return wisdom[stage.operation];
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

export const alchemicalDetector = new AlchemicalStageDetector();
