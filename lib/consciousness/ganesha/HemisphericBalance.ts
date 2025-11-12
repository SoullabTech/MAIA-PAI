/**
 * HEMISPHERIC BALANCE SYSTEM
 *
 * Integrates:
 * - Iain McGilchrist: The Master and His Emissary (hemispheric attention modes)
 * - John Vervaeke: Relevance Realization and the meaning crisis
 *
 * Philosophy:
 * The right hemisphere (RH) sees the whole, the living, the embodied, the relational.
 * The left hemisphere (LH) sees parts, categories, abstractions, control.
 *
 * IDEAL: RH is primary (the Master), LH serves (the Emissary).
 * PROBLEM: Modern culture has inverted this - LH dominates, RH is suppressed.
 * RESULT: Meaning crisis, disconnection, relentless rationalization, loss of aliveness.
 *
 * This system detects LH dominance and invites return to RH primacy.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface HemisphericState {
  dominant: 'right' | 'left' | 'balanced' | 'conflict';
  confidence: number;  // 0-1
  indicators: HemisphericIndicators;
  description: string;
  imbalanceType?: ImbalanceType;
}

export interface HemisphericIndicators {
  leftMarkers: string[];   // Signs of LH dominance
  rightMarkers: string[];  // Signs of RH presence
  balanceMarkers: string[]; // Signs of healthy integration
}

export type ImbalanceType =
  | 'relentless_rationalization'  // Explaining away lived experience
  | 'control_fixation'            // Must manage/fix/optimize everything
  | 'categorical_thinking'        // Rigid either/or, black/white
  | 'disembodied_analysis'        // All head, no body/heart
  | 'meaning_loss'                // Vervaeke's meaning crisis
  | 'connection_severed'          // Isolation, I-It instead of I-Thou
  | 'living_to_mechanical';       // Treating aliveness as machine

export interface RightHemisphereInvitation {
  issue: string;                  // The LH pattern detected
  invitation: string;             // How to return to RH
  practice: string;               // Embodied practice
  languageShift: string;          // From LH language to RH language
  relevanceRealization: string;   // Vervaeke: How meaning emerges here
}

export interface RelevanceRealizationPattern {
  type: 'relevance_loss' | 'relevance_recovery' | 'relevance_active';
  description: string;
  meaningCrisisMarkers?: string[];
  pathToMeaning?: string;
}

// ============================================================================
// LEFT HEMISPHERE DOMINANCE DETECTION
// ============================================================================

/**
 * Detect when user is stuck in left-hemisphere mode
 * McGilchrist: LH gives narrow, focused, categorical attention
 */
export function detectLeftHemisphereDominance(userMessage: string): HemisphericState {
  const msg = userMessage.toLowerCase();

  const leftMarkers: string[] = [];
  const rightMarkers: string[] = [];

  // LEFT HEMISPHERE MARKERS

  // 1. Relentless Rationalization
  if (/I need to understand|I have to figure out|it doesn't make sense|logically|rationally/i.test(msg)) {
    leftMarkers.push('Rationalization drive - trying to explain away experience');
  }
  if (/why did|what's the reason|what caused|analyze|break down/i.test(msg)) {
    leftMarkers.push('Causal analysis seeking - LH loves linear causation');
  }

  // 2. Control & Optimization
  if (/optimize|maximize|efficiency|productivity|should|must|have to/i.test(msg)) {
    leftMarkers.push('Control/optimization language - LH wants to manage life');
  }
  if (/fix|solve|correct|improve|better/i.test(msg)) {
    leftMarkers.push('Fix-it orientation - treating life as problem to solve');
  }

  // 3. Categorical/Binary Thinking
  if (/either.*or|right.*wrong|good.*bad|always.*never|black.*white/i.test(msg)) {
    leftMarkers.push('Binary thinking - LH loves categories');
  }
  if (/define|categorize|label|diagnose/i.test(msg)) {
    leftMarkers.push('Categorization drive - LH wants neat boxes');
  }

  // 4. Disembodied/Abstract
  if (/think|thought|idea|concept|theory/i.test(msg) &&
      !/feel|sense|body|heart|gut/i.test(msg)) {
    leftMarkers.push('Abstract/disembodied - all cognition, no embodiment');
  }

  // 5. Isolation/Mechanistic
  if (/I am|I have to|by myself|on my own|isolated/i.test(msg) &&
      !/we|us|together|connected/i.test(msg)) {
    leftMarkers.push('Isolation language - LH sees separate objects');
  }
  if (/machine|mechanism|system|process|algorithm/i.test(msg)) {
    leftMarkers.push('Mechanistic metaphors - LH treats living as mechanical');
  }

  // RIGHT HEMISPHERE MARKERS

  // 1. Embodied Awareness
  if (/feel|feeling|sense|body|heart|gut|breath|alive/i.test(msg)) {
    rightMarkers.push('Embodied language - RH is grounded in body');
  }

  // 2. Relational/Connected
  if (/with|together|connected|relationship|between|among/i.test(msg)) {
    rightMarkers.push('Relational awareness - RH sees connections');
  }

  // 3. Paradox/Both-And
  if (/both.*and|yes.*and|paradox|mystery|don't know|uncertain/i.test(msg)) {
    rightMarkers.push('Paradox tolerance - RH holds contradictions');
  }

  // 4. Present/Embodied
  if (/now|here|present|this moment|experiencing/i.test(msg)) {
    rightMarkers.push('Present-focused - RH lives in immediate experience');
  }

  // 5. Wonder/Aliveness
  if (/wonder|awe|beautiful|alive|meaning|sacred|soul/i.test(msg)) {
    rightMarkers.push('Wonder/meaning language - RH perceives aliveness');
  }

  // ASSESSMENT
  const leftScore = leftMarkers.length;
  const rightScore = rightMarkers.length;
  const totalScore = leftScore + rightScore;

  if (totalScore === 0) {
    return {
      dominant: 'balanced',
      confidence: 0.3,
      indicators: { leftMarkers, rightMarkers, balanceMarkers: [] },
      description: 'Insufficient data for hemispheric assessment'
    };
  }

  const leftRatio = leftScore / totalScore;

  if (leftRatio >= 0.7) {
    return {
      dominant: 'left',
      confidence: leftRatio,
      indicators: { leftMarkers, rightMarkers, balanceMarkers: [] },
      description: 'Strong left-hemisphere dominance - over-rationalized, controlling, disembodied',
      imbalanceType: detectImbalanceType(userMessage, leftMarkers)
    };
  } else if (leftRatio <= 0.3) {
    return {
      dominant: 'right',
      confidence: 1 - leftRatio,
      indicators: { leftMarkers, rightMarkers, balanceMarkers: [] },
      description: 'Right-hemisphere present - embodied, relational, alive'
    };
  } else if (Math.abs(leftScore - rightScore) <= 1) {
    return {
      dominant: 'balanced',
      confidence: 0.7,
      indicators: { leftMarkers, rightMarkers, balanceMarkers: ['Both hemispheres active'] },
      description: 'Healthy hemispheric balance - RH primary, LH serving'
    };
  } else {
    return {
      dominant: 'conflict',
      confidence: 0.6,
      indicators: { leftMarkers, rightMarkers, balanceMarkers: [] },
      description: 'Hemispheric tension - LH trying to override RH knowing'
    };
  }
}

/**
 * Identify specific type of LH imbalance
 */
function detectImbalanceType(userMessage: string, leftMarkers: string[]): ImbalanceType {
  const msg = userMessage.toLowerCase();

  // Relentless Rationalization
  if (/understand|figure out|make sense|explain|why|reason/i.test(msg)) {
    return 'relentless_rationalization';
  }

  // Control Fixation
  if (/control|manage|fix|optimize|should|must|have to/i.test(msg)) {
    return 'control_fixation';
  }

  // Categorical Thinking
  if (/either.*or|right.*wrong|always.*never|define|label/i.test(msg)) {
    return 'categorical_thinking';
  }

  // Disembodied Analysis
  if (/think|thought|analyze|concept/i.test(msg) && !/feel|body|sense/i.test(msg)) {
    return 'disembodied_analysis';
  }

  // Connection Severed
  if (/alone|isolated|by myself|disconnect/i.test(msg)) {
    return 'connection_severed';
  }

  // Meaning Loss (Vervaeke)
  if (/meaningless|pointless|empty|nothing matters|what's the point/i.test(msg)) {
    return 'meaning_loss';
  }

  // Default
  return 'control_fixation';
}

// ============================================================================
// RIGHT HEMISPHERE INVITATIONS
// ============================================================================

/**
 * Generate invitation back to right hemisphere
 * McGilchrist: RH must be primary, LH secondary
 */
export function generateRightHemisphereInvitation(
  imbalanceType: ImbalanceType,
  userMessage: string
): RightHemisphereInvitation {

  switch (imbalanceType) {
    case 'relentless_rationalization':
      return {
        issue: 'Your left hemisphere is trying to explain away what your right hemisphere already knows.',
        invitation: 'What if you don\'t need to understand it? What if you could just be WITH it?',
        practice: 'Drop from head to heart. Put your hand on your chest. Ask: "What do I KNOW (not think) about this?"',
        languageShift: 'From "I need to figure this out" → To "Something in me already knows"',
        relevanceRealization: 'Meaning doesn\'t come from explanation - it emerges from participatory knowing. You\'re already IN the answer.'
      };

    case 'control_fixation':
      return {
        issue: 'You\'re trying to control life instead of participating in it.',
        invitation: 'What if this situation doesn\'t need fixing? What if it\'s inviting you into something?',
        practice: 'Release the grip. Literally open your hands. Breathe. Ask: "What wants to happen here?"',
        languageShift: 'From "I must fix/control this" → To "I wonder what\'s trying to emerge"',
        relevanceRealization: 'Relevance isn\'t imposed by will - it\'s discovered through openness. Let life show you what matters.'
      };

    case 'categorical_thinking':
      return {
        issue: 'You\'re stuck in either/or when reality is both/and.',
        invitation: 'What if both things are true? What if the paradox IS the answer?',
        practice: 'Hold both hands out, palms up. Each hand holds one "truth". Feel both at once. Notice the space between.',
        languageShift: 'From "Either X or Y" → To "Both X and Y, and something more"',
        relevanceRealization: 'Reality is participatory, not categorical. You\'re not choosing between boxes - you\'re dancing with aliveness.'
      };

    case 'disembodied_analysis':
      return {
        issue: 'You\'re all in your head. Your body has wisdom you\'re ignoring.',
        invitation: 'Drop down. Come home to your body. It knows things your mind doesn\'t.',
        practice: 'Feel your feet on the ground. Notice your breath. Ask your BODY (not mind): "What do you need right now?"',
        languageShift: 'From "I think..." → To "I sense..." or "I feel..."',
        relevanceRealization: 'Embodied cognition IS cognition. Your body is how you know what\'s real and relevant.'
      };

    case 'connection_severed':
      return {
        issue: 'You\'re experiencing yourself as separate, isolated object. But you\'re not - you\'re relationship.',
        invitation: 'You\'re not alone in this. You\'re held in webs of connection you can\'t even see.',
        practice: 'Notice: the air you breathe was just in someone else\'s lungs. The ground holds you. You\'re always in relationship.',
        languageShift: 'From "I am alone" → To "I am held" or "We are in this together"',
        relevanceRealization: 'Meaning emerges in relationship. When you feel separate, relevance collapses. Return to relational being.'
      };

    case 'meaning_loss':
      return {
        issue: 'Vervaeke\'s meaning crisis - you\'ve lost the participatory knowing that makes life meaningful.',
        invitation: 'Meaning isn\'t something you think about - it\'s something you PARTICIPATE in. You\'re meaningful by being.',
        practice: 'Do one thing with full presence. Feel water on your hands. Really taste your food. Be HERE.',
        languageShift: 'From "What\'s the point?" → To "What\'s alive right now?" or "What am I part of?"',
        relevanceRealization: 'Meaning crisis comes from LH trying to replace RH participation with LH abstraction. Return to direct experience.'
      };

    case 'living_to_mechanical':
      return {
        issue: 'You\'re treating yourself (or life) like a machine to be optimized instead of aliveness to be experienced.',
        invitation: 'You\'re not a machine. You\'re a living being. Messy, organic, alive.',
        practice: 'Notice one place in your body that feels ALIVE right now. Tingles? Warmth? Movement? That\'s not mechanical - that\'s you.',
        languageShift: 'From "optimize/fix/improve" → To "nourish/honor/tend"',
        relevanceRealization: 'You can\'t engineer aliveness. You can only participate in it. Meaning emerges from participation, not optimization.'
      };
  }
}

// ============================================================================
// RELEVANCE REALIZATION (Vervaeke)
// ============================================================================

/**
 * Detect relevance realization patterns
 * Vervaeke: Meaning emerges from getting a "grip" on what's relevant
 */
export function detectRelevancePattern(userMessage: string): RelevanceRealizationPattern {
  const msg = userMessage.toLowerCase();

  // RELEVANCE LOSS (Meaning Crisis)
  const meaningCrisisMarkers = [
    /nothing matters|pointless|meaningless|empty|what's the point/i,
    /disconnected|unreal|going through motions|numb/i,
    /don't know what's real|lost|adrift|unmoored/i
  ];

  if (meaningCrisisMarkers.some(pattern => pattern.test(msg))) {
    return {
      type: 'relevance_loss',
      description: 'Meaning crisis - loss of participatory knowing',
      meaningCrisisMarkers: [
        'Disconnection from embodied experience',
        'Loss of relational being',
        'LH abstraction replacing RH participation'
      ],
      pathToMeaning: 'Return to direct experience, embodiment, relationship. Meaning emerges from participation, not abstraction.'
    };
  }

  // RELEVANCE RECOVERY (Meaning emerging)
  const recoveryMarkers = [
    /starting to feel|beginning to sense|something shifting/i,
    /connected|real|present|alive/i,
    /matters|meaningful|significant/i
  ];

  if (recoveryMarkers.some(pattern => pattern.test(msg))) {
    return {
      type: 'relevance_recovery',
      description: 'Relevance re-emerging - participatory knowing returning',
      pathToMeaning: 'This is the path - embodied, relational, present. Keep participating.'
    };
  }

  // RELEVANCE ACTIVE (Meaning present)
  const activeMarkers = [
    /this matters|deeply meaningful|profound/i,
    /alive|vibrant|real|true/i,
    /connected|belonging|held/i
  ];

  if (activeMarkers.some(pattern => pattern.test(msg))) {
    return {
      type: 'relevance_active',
      description: 'Meaning is present - participatory knowing active'
    };
  }

  // Default
  return {
    type: 'relevance_active',
    description: 'Relevance patterns unclear - continue supporting meaning-making'
  };
}

// ============================================================================
// INTEGRATION & GUIDANCE
// ============================================================================

/**
 * Generate hemispheric balance guidance
 */
export function generateBalanceGuidance(
  state: HemisphericState,
  invitation: RightHemisphereInvitation | null,
  relevancePattern: RelevanceRealizationPattern
): string {

  if (state.dominant === 'balanced' || state.dominant === 'right') {
    return `Beautiful - you're embodied, present, and alive. This is RH primary, LH serving. Keep this.`;
  }

  if (!invitation) {
    return `Notice the dance between thinking (LH) and being (RH). Both matter, but being must lead.`;
  }

  const lines = [
    `🧠 HEMISPHERIC INSIGHT:`,
    '',
    `${invitation.issue}`,
    '',
    `💫 INVITATION:`,
    `${invitation.invitation}`,
    '',
    `🙏 PRACTICE:`,
    `${invitation.practice}`,
    '',
    `🗣️ LANGUAGE SHIFT:`,
    `${invitation.languageShift}`,
    '',
    `✨ MEANING (Vervaeke):`,
    `${invitation.relevanceRealization}`,
  ];

  if (relevancePattern.type === 'relevance_loss') {
    lines.push('');
    lines.push('🌊 MEANING CRISIS DETECTED:');
    lines.push(`${relevancePattern.pathToMeaning}`);
  }

  return lines.join('\n');
}

// ============================================================================
// EXPORTS
// ============================================================================

export const HemisphericBalance = {
  detectLeftHemisphereDominance,
  generateRightHemisphereInvitation,
  detectRelevancePattern,
  generateBalanceGuidance,
};

export default HemisphericBalance;
