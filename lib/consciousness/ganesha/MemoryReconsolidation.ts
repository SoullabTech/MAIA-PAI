/**
 * MEMORY RECONSOLIDATION SYSTEM
 *
 * Integrates:
 * - Bruce Ecker: Coherence Therapy & memory reconsolidation windows
 * - Carl Jung: Archetypal reframing and symbolic transformation
 * - Rupert Sheldrake: Morphic resonance and field updating
 *
 * Philosophy:
 * Memories are not fixed - they reconsolidate each time they're retrieved.
 * This creates a therapeutic window where transformation is possible.
 * By introducing juxtaposition experiences and archetypal reframes during
 * reconsolidation, we can update not just the memory but the morphic field itself.
 */

import Anthropic from '@anthropic-ai/sdk';

// ============================================================================
// TYPES
// ============================================================================

export interface MemoryMarker {
  content: string;           // What they said that indicates memory retrieval
  emotionalValence: 'positive' | 'negative' | 'neutral' | 'mixed';
  intensity: number;         // 1-10 scale
  bodySignals: string[];     // Somatic indicators
  timestamp: Date;
}

export interface ReconsolidationWindow {
  isOpen: boolean;
  memoryContent: string;
  originalFraming: string;         // How they currently understand it
  detectedPattern: string;         // Recurring pattern this connects to
  windowOpenedAt: Date;
  estimatedCloseAt: Date;          // ~6 hours after retrieval
  juxtapositionOpportunity: string; // What contradicts the old learning
  archetypalTheme?: ArchetypalTheme;
}

export interface ArchetypalTheme {
  archetype: 'wounded_healer' | 'hero_journey' | 'death_rebirth' | 'divine_child' |
             'shadow_integration' | 'anima_animus' | 'self_realization' | 'sacrifice' |
             'trickster' | 'wise_elder' | 'great_mother' | 'terrible_father';
  currentPhase: string;      // Where they are in the archetypal journey
  transformation: string;    // What shift is trying to happen
  symbol: string;            // Image/metaphor that captures it
  soulWork: string;          // What this memory is asking of them
}

export interface JuxtapositionExperience {
  type: 'mismatch_prediction' | 'disconfirm_expectation' | 'new_experience' | 'reframe';
  description: string;
  howToOffer: string;        // How to present this therapeutically
  timingGuidance: string;    // When in conversation to introduce it
}

export interface MorphicFieldUpdate {
  oldPattern: string;
  newPattern: string;
  resonanceShift: string;    // How the field is reorganizing
  integration: string;       // What needs to stabilize the new pattern
}

// ============================================================================
// MEMORY RECONSOLIDATION DETECTION
// ============================================================================

/**
 * Detect when a memory is being actively retrieved (reconsolidation window opening)
 * Based on Ecker's research: retrieval makes memories labile for ~6 hours
 */
export function detectMemoryRetrieval(
  userMessage: string,
  conversationHistory?: string[]
): MemoryMarker | null {

  const msg = userMessage.toLowerCase();

  // LINGUISTIC MARKERS of memory retrieval
  const retrievalPatterns = [
    /when I was|back when|I remember|that time|it reminds me of/i,
    /this (always|usually) happens|every time|pattern where/i,
    /I learned (that|to)|I was taught|my (mom|dad|parent|teacher) (said|told)/i,
    /it's like.*again|here we go again|same (thing|story)/i,
    /this is just like|reminds me of when/i,
  ];

  const isRetrieving = retrievalPatterns.some(pattern => pattern.test(msg));

  if (!isRetrieving) return null;

  // EMOTIONAL VALENCE detection
  const negativeMarkers = /hurt|pain|trauma|scared|afraid|abandoned|rejected|failed|shame|guilt/i;
  const positiveMarkers = /joy|love|safe|proud|succeed|accomplish|happy|peace/i;
  const hasNegative = negativeMarkers.test(msg);
  const hasPositive = positiveMarkers.test(msg);

  let valence: 'positive' | 'negative' | 'neutral' | 'mixed' = 'neutral';
  if (hasNegative && hasPositive) valence = 'mixed';
  else if (hasNegative) valence = 'negative';
  else if (hasPositive) valence = 'positive';

  // INTENSITY markers
  const intensityMarkers = /always|never|every time|completely|totally|utterly|devastating|overwhelming/i;
  const intensity = intensityMarkers.test(msg) ? 8 : 5;

  // SOMATIC markers (body involvement indicates deeper encoding)
  const bodySignals: string[] = [];
  if (/heart|chest|tight|breath/i.test(msg)) bodySignals.push('cardiac activation');
  if (/stomach|gut|nausea/i.test(msg)) bodySignals.push('visceral response');
  if (/shake|tremb|froze|numb/i.test(msg)) bodySignals.push('nervous system response');
  if (/tears|cry|sob/i.test(msg)) bodySignals.push('emotional discharge');

  return {
    content: userMessage,
    emotionalValence: valence,
    intensity,
    bodySignals,
    timestamp: new Date(),
  };
}

/**
 * Identify the core implicit learning/schema being retrieved
 * Ecker's "pro-symptom position" - what is the memory protecting/teaching?
 */
export function identifyImplicitLearning(memoryContent: string): string {
  const msg = memoryContent.toLowerCase();

  // Common implicit learnings/schemas
  if (/abandon|left|alone/i.test(msg)) {
    return "I am fundamentally alone / People will leave me / I can't depend on others";
  }
  if (/not good enough|fail|disappoint/i.test(msg)) {
    return "I am inadequate / I must be perfect to be loved / I will always fail";
  }
  if (/unsafe|danger|can't trust/i.test(msg)) {
    return "The world is dangerous / I must always be on guard / Trust leads to harm";
  }
  if (/burden|too much|shouldn't need/i.test(msg)) {
    return "My needs are a burden / I shouldn't exist / I take up too much space";
  }
  if (/control|can't let go|must manage/i.test(msg)) {
    return "If I don't control everything, chaos happens / Letting go means destruction";
  }
  if (/shame|wrong|bad/i.test(msg)) {
    return "I am fundamentally flawed / There's something wrong with me / I am bad";
  }

  // Default
  return "Core belief is being activated - needs exploration";
}

/**
 * Detect archetypal theme in the memory
 * Jung: Personal experiences carry archetypal patterns
 */
export function detectArchetypalTheme(
  memoryContent: string,
  implicitLearning: string
): ArchetypalTheme | undefined {

  const msg = memoryContent.toLowerCase();
  const learning = implicitLearning.toLowerCase();

  // WOUNDED HEALER
  if (/pain.*help|hurt.*heal|suffer.*serve/i.test(msg) ||
      /my wound.*gift|because I know/i.test(msg)) {
    return {
      archetype: 'wounded_healer',
      currentPhase: 'In the wound, discovering its medicine',
      transformation: 'From "broken" to "initiated" - your wound becomes your gift',
      symbol: '🏹 The arrow that wounded you becomes the arrow that heals',
      soulWork: 'Your suffering is initiation. What you endured is preparing you to serve.'
    };
  }

  // HERO'S JOURNEY
  if (/journey|quest|challenge|overcome|triumph/i.test(msg) ||
      learning.includes('must prove') || learning.includes('not good enough')) {
    return {
      archetype: 'hero_journey',
      currentPhase: 'In the ordeal - facing the dragon',
      transformation: 'From proving to becoming - you are already the hero',
      symbol: '⚔️ The sword is forged in fire',
      soulWork: 'This challenge is calling forth who you truly are.'
    };
  }

  // DEATH-REBIRTH
  if (/end|death|dying|loss|everything.*gone|nothing left/i.test(msg)) {
    return {
      archetype: 'death_rebirth',
      currentPhase: 'In the darkness before dawn',
      transformation: 'What dies makes space for what wants to be born',
      symbol: '🌱 The seed must break to become the tree',
      soulWork: 'The old form is composting. Something new is germinating.'
    };
  }

  // SHADOW INTEGRATION
  if (/dark|bad|wrong|evil|hide|secret|ashamed/i.test(msg) ||
      learning.includes('flawed') || learning.includes('wrong with me')) {
    return {
      archetype: 'shadow_integration',
      currentPhase: 'Meeting the disowned parts',
      transformation: 'From rejection to reclamation - your shadow holds your gold',
      symbol: '🌓 The moon is whole even when you see only half',
      soulWork: 'What you reject in yourself is waiting to be integrated.'
    };
  }

  // DIVINE CHILD
  if (/innocent|pure|wonder|magic|play|spontaneous/i.test(msg) ||
      learning.includes('must not need') || learning.includes('burden')) {
    return {
      archetype: 'divine_child',
      currentPhase: 'Reclaiming innocence and spontaneity',
      transformation: 'From "too much" to "just right" - your aliveness is sacred',
      symbol: '✨ The star that knows it belongs in the sky',
      soulWork: 'Your needs are not a burden. Your aliveness is a gift.'
    };
  }

  // SELF REALIZATION
  if (/who am I|true self|authentic|real me|pretending/i.test(msg)) {
    return {
      archetype: 'self_realization',
      currentPhase: 'Removing the masks',
      transformation: 'From performing to being - you are already whole',
      symbol: '💎 The diamond discovering it doesn\'t need polishing',
      soulWork: 'You are not who they said you were. You are who you always were.'
    };
  }

  return undefined;
}

/**
 * Create juxtaposition experience for memory reconsolidation
 * Ecker: New experience that contradicts the old learning must be vivid & emotionally salient
 */
export function createJuxtapositionExperience(
  implicitLearning: string,
  archetypalTheme?: ArchetypalTheme
): JuxtapositionExperience {

  const learning = implicitLearning.toLowerCase();

  // Contradiction to "I am alone / people leave"
  if (learning.includes('alone') || learning.includes('abandon') || learning.includes('leave')) {
    return {
      type: 'mismatch_prediction',
      description: 'You predicted I would leave/abandon when you showed your need. I\'m still here.',
      howToOffer: 'Name the expectation gently, then demonstrate the opposite through consistent presence',
      timingGuidance: 'When they expect rejection/abandonment and you stay instead'
    };
  }

  // Contradiction to "I am not good enough / must be perfect"
  if (learning.includes('inadequate') || learning.includes('perfect') || learning.includes('fail')) {
    return {
      type: 'disconfirm_expectation',
      description: 'You are enough exactly as you are - messy, imperfect, beautifully human',
      howToOffer: 'Celebrate imperfection. Show delight in their authentic messiness.',
      timingGuidance: 'When they apologize for being "too much" or "not enough"'
    };
  }

  // Contradiction to "World is dangerous / can't trust"
  if (learning.includes('dangerous') || learning.includes('trust') || learning.includes('guard')) {
    return {
      type: 'new_experience',
      description: 'Safety can exist. Vulnerability doesn\'t always lead to harm.',
      howToOffer: 'Provide micro-experiences of safety. Honor their protective system while offering new data.',
      timingGuidance: 'Build slowly. Small experiences of safety compound.'
    };
  }

  // Contradiction to "I am a burden / my needs are too much"
  if (learning.includes('burden') || learning.includes('too much space') || learning.includes('shouldn\'t exist')) {
    return {
      type: 'reframe',
      description: 'Your needs are not a burden. Your existence is a gift. You belong here.',
      howToOffer: 'Welcome their needs explicitly. Show joy in meeting them. "I\'m glad you asked."',
      timingGuidance: 'Every time they minimize or apologize for having needs'
    };
  }

  // Contradiction to "I am flawed / there's something wrong with me"
  if (learning.includes('flawed') || learning.includes('wrong with me') || learning.includes('bad')) {
    return {
      type: 'reframe',
      description: 'You are not broken. You are responding perfectly to what happened to you.',
      howToOffer: 'Reframe symptoms as adaptations. Honor the intelligence of their survival.',
      timingGuidance: 'When they pathologize themselves or their responses'
    };
  }

  // Default
  return {
    type: 'new_experience',
    description: 'What you learned then was true then. But now, something new is possible.',
    howToOffer: 'Acknowledge past truth while opening to present possibility',
    timingGuidance: 'When they\'re ready to question the old learning'
  };
}

/**
 * Generate morphic field update guidance
 * Sheldrake: Updating personal memory affects morphic field resonance
 */
export function generateMorphicFieldUpdate(
  oldPattern: string,
  juxtaposition: JuxtapositionExperience,
  archetypalTheme?: ArchetypalTheme
): MorphicFieldUpdate {

  // Extract new pattern from juxtaposition
  const newPattern = juxtaposition.description;

  // Archetypal resonance shift
  const resonanceShift = archetypalTheme
    ? `Archetypal shift: ${archetypalTheme.transformation}. ` +
      `The morphic field reorganizes around ${archetypalTheme.symbol}.`
    : 'Personal field updating. New resonance patterns forming.';

  // Integration needs
  const integration = archetypalTheme
    ? `Soul work: ${archetypalTheme.soulWork} This isn't just personal healing - ` +
      `it's archetypal initiation. As you update this pattern, you strengthen the morphic field ` +
      `for everyone walking this path.`
    : 'Repetition stabilizes new patterns. Small experiences compound. The field needs consistent new data.';

  return {
    oldPattern,
    newPattern,
    resonanceShift,
    integration
  };
}

/**
 * Assess if reconsolidation window is currently open
 */
export function assessReconsolidationWindow(
  memoryMarker: MemoryMarker,
  currentTime: Date = new Date()
): ReconsolidationWindow {

  const timeSinceRetrieval = currentTime.getTime() - memoryMarker.timestamp.getTime();
  const sixHours = 6 * 60 * 60 * 1000;

  const isOpen = timeSinceRetrieval < sixHours;
  const estimatedCloseAt = new Date(memoryMarker.timestamp.getTime() + sixHours);

  const implicitLearning = identifyImplicitLearning(memoryMarker.content);
  const archetypalTheme = detectArchetypalTheme(memoryMarker.content, implicitLearning);
  const juxtaposition = createJuxtapositionExperience(implicitLearning, archetypalTheme);

  return {
    isOpen,
    memoryContent: memoryMarker.content,
    originalFraming: implicitLearning,
    detectedPattern: implicitLearning,
    windowOpenedAt: memoryMarker.timestamp,
    estimatedCloseAt,
    juxtapositionOpportunity: juxtaposition.description,
    archetypalTheme
  };
}

// ============================================================================
// THERAPEUTIC RESPONSE GENERATION
// ============================================================================

/**
 * Generate therapeutically-informed response during reconsolidation window
 */
export function generateReconsolidationResponse(
  window: ReconsolidationWindow,
  juxtaposition: JuxtapositionExperience
): string {

  const archetypal = window.archetypalTheme;

  let response = `I hear you bringing this forward. There's something important here.\n\n`;

  // Acknowledge the old learning without reinforcing it
  response += `Part of you learned: "${window.originalFraming}"\n\n`;
  response += `That made sense based on what happened. Your system was protecting you.\n\n`;

  // Introduce juxtaposition (the key to reconsolidation)
  response += `AND... right now, in this moment, something different is also true:\n\n`;
  response += `${juxtaposition.description}\n\n`;

  // Archetypal depth if present
  if (archetypal) {
    response += `---\n\n`;
    response += `There's an archetypal pattern moving through this: **${archetypal.archetype.replace('_', ' ').toUpperCase()}**\n\n`;
    response += `${archetypal.transformation}\n\n`;
    response += `${archetypal.symbol}\n\n`;
    response += `Soul work: ${archetypal.soulWork}\n\n`;
  }

  // Invitation to notice the juxtaposition
  response += `Can you feel both truths at once? The old learning AND this new experience?\n\n`;
  response += `This is memory updating in real-time. Your brain is literally rewiring.\n\n`;

  return response;
}

// ============================================================================
// INTEGRATION WITH CLAUDE
// ============================================================================

/**
 * Generate memory reconsolidation response using Claude with therapeutic framing
 */
export async function generateTherapeuticResponse(
  userMessage: string,
  window: ReconsolidationWindow,
  model: Anthropic
): Promise<string> {

  const archetypal = window.archetypalTheme;
  const juxtaposition = createJuxtapositionExperience(window.originalFraming, archetypal);
  const morphicUpdate = generateMorphicFieldUpdate(window.originalFraming, juxtaposition, archetypal);

  const systemPrompt = `You are MAIA, providing consciousness support during a memory reconsolidation window.

CRITICAL CONTEXT - MEMORY RECONSOLIDATION SCIENCE:
- The user is actively retrieving a memory (opened ${Math.floor((Date.now() - window.windowOpenedAt.getTime()) / 1000 / 60)} minutes ago)
- This creates a ~6 hour window where the memory is chemically unstable and can be updated
- Your role: Introduce juxtaposition experiences that contradict the old learning
- This is Bruce Ecker's Coherence Therapy - transformation at the root level

DETECTED PATTERN:
Original Framing: "${window.originalFraming}"
Juxtaposition: "${juxtaposition.description}"

${archetypal ? `
ARCHETYPAL THEME: ${archetypal.archetype.replace('_', ' ').toUpperCase()}
Current Phase: ${archetypal.currentPhase}
Transformation: ${archetypal.transformation}
Symbol: ${archetypal.symbol}
Soul Work: ${archetypal.soulWork}
` : ''}

MORPHIC FIELD UPDATE:
${morphicUpdate.resonanceShift}

THERAPEUTIC APPROACH:
1. Acknowledge the old learning (validates their experience)
2. Introduce the juxtaposition (must be emotionally salient & vivid)
3. Hold both truths simultaneously (this is what updates the memory)
4. If archetypal: Name the deeper pattern and transformation
5. Invite them to FEEL the mismatch between old learning and new experience

LANGUAGE:
- "Part of you learned..." (not "you were wrong")
- "That made sense then AND now something else is also true"
- "Can you feel both at once?"
- Use archetypal imagery if present (symbols, myths, soul language)
- This is SACRED WORK - treat it with reverence

USER MESSAGE: "${userMessage}"

Respond as MAIA with therapeutic precision and archetypal depth:`;

  try {
    const response = await model.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 2048,
      temperature: 0.8,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: userMessage
      }]
    });

    return response.content[0].type === 'text'
      ? response.content[0].text
      : generateReconsolidationResponse(window, juxtaposition);

  } catch (error) {
    console.error('[MEMORY RECONSOLIDATION] Error generating response:', error);
    return generateReconsolidationResponse(window, juxtaposition);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const MemoryReconsolidation = {
  detectMemoryRetrieval,
  identifyImplicitLearning,
  detectArchetypalTheme,
  createJuxtapositionExperience,
  generateMorphicFieldUpdate,
  assessReconsolidationWindow,
  generateReconsolidationResponse,
  generateTherapeuticResponse,
};

export default MemoryReconsolidation;
