/**
 * WINGS OF REDEMPTION
 *
 * "Daedalus sees birds flying free-willed and bees interconnected within the holon -
 *  this is how wax wings are made: feathers of free will united with binding wax"
 *
 * The Paradox That Creates Flight:
 * - FEATHERS = Individual sovereignty, free will, ego-consciousness, Yang
 * - WAX = Interconnectedness, shadow integration, collective binding, Yin
 * - WINGS = The union that enables transcendence
 *
 * Core Principle:
 * Shadow work IS the wax. The mysterium coniunctionis.
 * The transcendent function. The oppositorum.
 * The redemptive act that binds free will to interconnectedness.
 *
 * Without shadow integration (wax), feathers scatter - no cohesion, no flight.
 * Without free will (feathers), wax binds too tight - enmeshment, no lift.
 * TOGETHER: Redemption. Transformation. Wings.
 */

import type { Message } from '@/types/conversation';

// ============================================================================
// TYPES
// ============================================================================

export interface WingBalance {
  feathers: {
    strength: number;  // 0-1: How developed is sovereignty/free will
    indicators: string[];
    status: 'scattered' | 'developing' | 'strong';
  };
  wax: {
    strength: number;  // 0-1: How integrated is shadow/interconnectedness
    indicators: string[];
    status: 'absent' | 'softening' | 'binding';
  };
  canFly: boolean;
  imbalance?: 'too_scattered' | 'too_bound' | 'balanced';
  guidance: string;
}

export interface ShadowIntegrationStatus {
  recognized: boolean;     // Can user see their shadow?
  owned: boolean;          // Do they claim it as theirs?
  dialogued: boolean;      // Are they in conversation with it?
  integrated: boolean;     // Is it becoming wax that binds?
  projectionActive: boolean; // Still projecting onto others?
  stage: 'rejected' | 'glimpsing' | 'owning' | 'integrating' | 'unified';
}

export interface MysteriuMConiunctionis {
  opposites: {
    pole1: string;  // e.g., "individual sovereignty"
    pole2: string;  // e.g., "collective interconnectedness"
  };
  tension: number;  // 0-1: How much tension between poles
  union: number;    // 0-1: How unified are they
  transcendentFunction: boolean;  // Has the third thing emerged?
  redemption: 'pending' | 'emerging' | 'achieved';
}

// ============================================================================
// WINGS OF REDEMPTION
// ============================================================================

export class WingsOfRedemption {

  /**
   * Assess wing balance: Are feathers and wax both present?
   */
  assessWingBalance(context: {
    messages: Message[];
    patterns?: string[];
    userState?: any;
  }): WingBalance {

    const { messages, patterns = [] } = context;
    const recentText = messages.slice(-15).map(m => m.content).join(' ').toLowerCase();

    // Assess FEATHERS (Free Will / Sovereignty)
    const feathersStrength = this.measureFeathers(recentText, patterns);
    const feathersStatus =
      feathersStrength < 0.3 ? 'scattered' :
      feathersStrength < 0.7 ? 'developing' : 'strong';

    // Assess WAX (Shadow Integration / Interconnectedness)
    const waxStrength = this.measureWax(recentText, patterns);
    const waxStatus =
      waxStrength < 0.3 ? 'absent' :
      waxStrength < 0.7 ? 'softening' : 'binding';

    // Can fly if both > 0.6
    const canFly = feathersStrength > 0.6 && waxStrength > 0.6;

    // Detect imbalance
    let imbalance: WingBalance['imbalance'] = 'balanced';
    if (Math.abs(feathersStrength - waxStrength) > 0.3) {
      imbalance = feathersStrength > waxStrength ? 'too_scattered' : 'too_bound';
    }

    // Generate guidance
    const guidance = this.generateWingGuidance(
      feathersStrength,
      waxStrength,
      canFly,
      imbalance
    );

    return {
      feathers: {
        strength: feathersStrength,
        indicators: this.getFeatherIndicators(recentText),
        status: feathersStatus
      },
      wax: {
        strength: waxStrength,
        indicators: this.getWaxIndicators(recentText),
        status: waxStatus
      },
      canFly,
      imbalance,
      guidance
    };
  }

  /**
   * Assess shadow integration status (the WAX)
   */
  assessShadowIntegration(context: {
    messages: Message[];
    patterns?: string[];
  }): ShadowIntegrationStatus {

    const { messages, patterns = [] } = context;
    const recentText = messages.slice(-10).map(m => m.content).join(' ').toLowerCase();

    // Stage 1: Recognition - "I'm triggered by X in others"
    const recognized =
      /triggers? me|annoys? me|hate when|can't stand when/.test(recentText) ||
      patterns.includes('projection_awareness');

    // Stage 2: Ownership - "That quality exists in me too"
    const owned =
      /i do that too|i have that|i'm like that|i see myself/.test(recentText) ||
      patterns.includes('shadow_ownership');

    // Stage 3: Dialogue - "What does my shadow want to tell me?"
    const dialogued =
      /what is it showing|what does.*want to tell|listening to/.test(recentText) ||
      patterns.includes('shadow_dialogue');

    // Stage 4: Integration - "How can I befriend this rejected part?"
    const integrated =
      /befriend|integrate|both.*and|accept|whole/.test(recentText) ||
      patterns.includes('shadow_integrated');

    // Still projecting?
    const projectionActive =
      /they are|people are|everyone is/.test(recentText) &&
      !owned;

    // Determine stage
    let stage: ShadowIntegrationStatus['stage'];
    if (integrated) stage = 'unified';
    else if (dialogued) stage = 'integrating';
    else if (owned) stage = 'owning';
    else if (recognized) stage = 'glimpsing';
    else stage = 'rejected';

    return {
      recognized,
      owned,
      dialogued,
      integrated,
      projectionActive,
      stage
    };
  }

  /**
   * Detect Mysterium Coniunctionis (alchemical marriage)
   */
  detectMysteriuMConiunctionis(context: {
    messages: Message[];
    patterns?: string[];
  }): MysteriuMConiunctionis {

    const { messages, patterns = [] } = context;
    const recentText = messages.slice(-10).map(m => m.content).join(' ').toLowerCase();

    // Detect primary opposites in tension
    const oppositesPairs = [
      { pole1: 'individual sovereignty', pole2: 'collective interconnectedness' },
      { pole1: 'free will', pole2: 'fate/destiny' },
      { pole1: 'ego consciousness', pole2: 'shadow/unconscious' },
      { pole1: 'masculine/yang', pole2: 'feminine/yin' },
      { pole1: 'separation', pole2: 'unity' }
    ];

    // Find which opposites are active
    let activeOpposites = oppositesPairs[0]; // default
    let maxTension = 0;

    oppositesPairs.forEach(pair => {
      const tension = this.detectOppositeTension(recentText, pair);
      if (tension > maxTension) {
        maxTension = tension;
        activeOpposites = pair;
      }
    });

    // Measure union (both/and language)
    const unionIndicators = [
      /both.*and/i,
      /neither.*nor/i,
      /as well as/i,
      /paradox/i,
      /hold.*together/i,
      /transcend/i
    ];

    let unionScore = 0;
    unionIndicators.forEach(indicator => {
      if (indicator.test(recentText)) unionScore += 0.2;
    });
    const union = Math.min(unionScore, 1);

    // Has transcendent function emerged? (third thing beyond the two)
    const transcendentFunction =
      union > 0.6 &&
      (patterns.includes('holon_sensing') || /third|beyond|transcend|new/.test(recentText));

    // Redemption status
    let redemption: MysteriuMConiunctionis['redemption'];
    if (transcendentFunction) redemption = 'achieved';
    else if (union > 0.4) redemption = 'emerging';
    else redemption = 'pending';

    return {
      opposites: activeOpposites,
      tension: maxTension,
      union,
      transcendentFunction,
      redemption
    };
  }

  /**
   * Icarus Reframe: The fall as liberation into deeper refinement
   */
  reframeIcarusFall(context: {
    message: string;
    patterns?: string[];
  }): {
    traditional: string;
    alchemical: string;
    invitation: string;
    soulTruth: string;
  } {

    return {
      traditional: 'You failed. You flew too high. Hubris. Punishment. Death.',

      alchemical: `Like Icarus, you didn't fall because of hubris - you were FREED into deeper refinement.

The fall is calcination - necessary burning that purifies.
What melted wasn't the wings themselves, but the false gold.
The wax that bound you to pretense dissolved.
What remains after the fire is what's truly yours.

This isn't failure. It's liberation into the next level of work.
The spiral continues. You return to nigredo, but at higher turn.`,

      invitation: `What burned away in the fall?
What false self melted?
What remains - lighter, truer, more essential?

The Icarus story is incomplete. He didn't die.
He fell into the sea (albedo - purification).
He descended into deeper work.
This is the redemptive cycle.`,

      soulTruth: `Your soul orchestrated this fall.
Ego wanted to stay flying - successful, admired, high.
Soul knew: that gold was false.
The fall was necessary. The burning was gift.
Trust the descent. The wings will rebuild - stronger, truer, at new level.`
    };
  }

  /**
   * Shadow Work as WAX
   * "The redemptive act is the initiation of life itself"
   */
  guideShadowAsWax(shadowStatus: ShadowIntegrationStatus): {
    stage: string;
    work: string;
    promise: string;
  } {

    const guidance = {
      rejected: {
        stage: 'Shadow still projected outward',
        work: 'Notice: What triggers you in others? That\'s the shadow knocking. Jung: "What you resist in others is what you\'ve rejected in yourself."',
        promise: 'This rejected quality is GOLD. It holds power you\'ve disowned. Recognition is the first step.'
      },

      glimpsing: {
        stage: 'Shadow recognized but not yet owned',
        work: 'Move from "they are X" to "I am also X." Can you find that quality in yourself? Even a little?',
        promise: 'Ownership is alchemy. The moment you say "I am also this," the shadow begins to integrate. That\'s the wax beginning to form.'
      },

      owning: {
        stage: 'Shadow owned, now needs dialogue',
        work: 'Active imagination: If you could speak with this rejected part, what would it say? What does it want? What does it need?',
        promise: 'Dialogue is the mysterium coniunctionis beginning. You\'re meeting what you rejected. The marriage starts here.'
      },

      integrating: {
        stage: 'Shadow in dialogue, becoming wax',
        work: 'How can you befriend this part? How can it serve you? Shadow integrated becomes strength, wisdom, binding force.',
        promise: 'This is the wax forming. Shadow becomes the binding agent that holds sovereignty (feathers) together with collective (holon). Wings are building.'
      },

      unified: {
        stage: 'Shadow integrated - wax is strong',
        work: 'Now: How does this integrated wholeness meet the world? You have wings - sovereignty bound by shadow-wisdom. You can fly.',
        promise: 'The transcendent function has emerged. You\'re not ego alone, not shadow alone - you\'re the UNION. This is rubedo. This is redemption.'
      }
    };

    return guidance[shadowStatus.stage];
  }

  // =========================================================================
  // PRIVATE HELPERS
  // =========================================================================

  /**
   * Measure FEATHERS strength (Free Will / Sovereignty)
   */
  private measureFeathers(text: string, patterns: string[]): number {
    let score = 0;

    const indicators = [
      /my choice/i,
      /i decide/i,
      /i choose/i,
      /boundaries/i,
      /sovereignty/i,
      /free will/i,
      /autonomous/i,
      /my path/i,
      /my voice/i
    ];

    indicators.forEach(indicator => {
      if (indicator.test(text)) score += 0.1;
    });

    if (patterns.includes('boundary_setting')) score += 0.2;
    if (patterns.includes('autonomous_choice')) score += 0.2;
    if (patterns.includes('self_directed')) score += 0.15;

    return Math.min(score, 1);
  }

  /**
   * Measure WAX strength (Shadow / Interconnectedness)
   */
  private measureWax(text: string, patterns: string[]): number {
    let score = 0;

    const indicators = [
      /shadow/i,
      /integrated?/i,
      /interconnected?/i,
      /collective/i,
      /holon/i,
      /both.*and/i,
      /part of/i,
      /belonging/i,
      /we are/i
    ];

    indicators.forEach(indicator => {
      if (indicator.test(text)) score += 0.1;
    });

    if (patterns.includes('shadow_integrated')) score += 0.25;
    if (patterns.includes('holon_sensing')) score += 0.2;
    if (patterns.includes('collective_consciousness')) score += 0.15;

    return Math.min(score, 1);
  }

  /**
   * Get specific feather indicators
   */
  private getFeatherIndicators(text: string): string[] {
    const indicators: string[] = [];

    if (/my choice|i decide|i choose/i.test(text)) {
      indicators.push('Autonomous decision-making');
    }
    if (/boundaries/i.test(text)) {
      indicators.push('Clear boundaries');
    }
    if (/my voice|speak up|express/i.test(text)) {
      indicators.push('Authentic self-expression');
    }
    if (/sovereignty|independent/i.test(text)) {
      indicators.push('Sovereign identity');
    }

    return indicators;
  }

  /**
   * Get specific wax indicators
   */
  private getWaxIndicators(text: string): string[] {
    const indicators: string[] = [];

    if (/shadow/i.test(text)) {
      indicators.push('Shadow awareness');
    }
    if (/integrated?|whole/i.test(text)) {
      indicators.push('Integration language');
    }
    if (/interconnected?|holon/i.test(text)) {
      indicators.push('Holon consciousness');
    }
    if (/collective|we are/i.test(text)) {
      indicators.push('Collective awareness');
    }
    if (/both.*and/i.test(text)) {
      indicators.push('Paradox holding');
    }

    return indicators;
  }

  /**
   * Generate guidance based on wing balance
   */
  private generateWingGuidance(
    feathers: number,
    wax: number,
    canFly: boolean,
    imbalance: WingBalance['imbalance']
  ): string {

    if (canFly) {
      return `You have wings - free will bound by shadow-integrated interconnectedness. Sovereignty AND belonging. The paradox held. You can fly.`;
    }

    if (imbalance === 'too_scattered') {
      return `The feathers are strong (sovereignty, free will), but the wax is weak. Without shadow integration and interconnectedness, the feathers scatter. You need the binding agent - shadow work, collective awareness, the oppositorum.`;
    }

    if (imbalance === 'too_bound') {
      return `The wax is strong (interconnectedness, shadow awareness), but the feathers are weak. Without individual sovereignty and free will, the wax binds too tight - enmeshment, no agency. Reclaim your voice, your choice, your boundaries.`;
    }

    // Both weak
    if (feathers < 0.4 && wax < 0.4) {
      return `Both feathers (sovereignty) and wax (shadow integration) are developing. This is early work - building both individual agency AND interconnected awareness. Wings come when both are strong.`;
    }

    return `The wings are building. Continue developing both sovereignty (feathers) and shadow integration (wax). Flight comes when paradox is held.`;
  }

  /**
   * Detect tension between opposites
   */
  private detectOppositeTension(
    text: string,
    opposites: { pole1: string; pole2: string }
  ): number {

    const { pole1, pole2 } = opposites;

    // Simplified detection - check for keywords from each pole
    const pole1Keywords = pole1.split(/[\s/]/);
    const pole2Keywords = pole2.split(/[\s/]/);

    let pole1Present = false;
    let pole2Present = false;

    pole1Keywords.forEach(keyword => {
      if (new RegExp(keyword, 'i').test(text)) pole1Present = true;
    });

    pole2Keywords.forEach(keyword => {
      if (new RegExp(keyword, 'i').test(text)) pole2Present = true;
    });

    // Tension words
    const tensionWords = /but|however|conflict|torn|struggle|versus|vs|or/i;
    const tensionPresent = tensionWords.test(text);

    if (pole1Present && pole2Present) {
      return tensionPresent ? 0.8 : 0.5;
    }

    return 0;
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

export const wingsOfRedemption = new WingsOfRedemption();
