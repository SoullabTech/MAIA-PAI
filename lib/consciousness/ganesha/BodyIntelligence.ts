/**
 * BODY INTELLIGENCE SYSTEM
 *
 * Integrates:
 * - Lisa Feldman Barrett: Interoception as foundation of emotion
 * - Peter Levine: Somatic completion of stress responses
 * - Eugene Gendlin: Felt sense as pre-verbal knowing
 * - Stephen Porges: Polyvagal nervous system states
 *
 * Philosophy:
 * Body wisdom is PRIMARY. Cognition is SECONDARY.
 * We don't think our way out of dysregulation - we sense and complete.
 */

import Anthropic from '@anthropic-ai/sdk';

// ============================================================================
// TYPES
// ============================================================================

export interface NervousSystemState {
  state: 'ventral_vagal' | 'sympathetic' | 'dorsal_vagal' | 'mixed';
  indicators: string[];
  description: string;
  supportNeeded: string;
}

export interface InteroceptiveSignals {
  sensations: string[];  // What they're noticing in body
  locations: string[];   // Where in body
  qualities: string[];   // Temperature, texture, movement, etc.
  intensity: number;     // 0-10 scale
}

export interface FeltSense {
  bodyKnowing: string;   // Pre-verbal sense about situation
  symbol: string;        // Image/metaphor that captures it
  rightAction: string;   // What wants to happen next
  feltShift: boolean;    // Did something release/reorganize?
}

export interface SomaticCompletion {
  incompleteResponse: string;  // What survival response is stuck?
  completionPrompt: string;    // How to complete it
  safetyNeeded: boolean;       // Does regulation come first?
}

// ============================================================================
// NERVOUS SYSTEM STATE DETECTION
// ============================================================================

/**
 * Detect nervous system state from language patterns
 * Based on Polyvagal Theory (Porges)
 */
export function detectNervousSystemState(
  userMessage: string,
  context: {
    energy: string;
    stimulation: string;
    regulation: string;
    recentPatterns?: string[];
  }
): NervousSystemState {
  const msg = userMessage.toLowerCase();

  // DORSAL VAGAL: Shutdown, freeze, dissociation
  const dorsalIndicators = [
    /numb|nothing|empty|blank|shut down|can't feel|frozen|dissociat/i,
    /too much|overwhelm|can't cope|give up/i,
  ];

  if (dorsalIndicators.some(pattern => pattern.test(msg)) ||
      context.energy === 'depleted' && context.stimulation === 'under') {
    return {
      state: 'dorsal_vagal',
      indicators: ['shutdown language', 'freeze response', 'dissociation markers'],
      description: 'Dorsal vagal shutdown - the body has gone into protective freeze/collapse',
      supportNeeded: 'Gentle awakening, not activation. Safety first. Orient to environment. Tiny movements.'
    };
  }

  // SYMPATHETIC: Fight/flight, anxiety, hyperarousal
  const sympatheticIndicators = [
    /anxious|panic|racing|can't stop|worried|scared|afraid|terrified/i,
    /too fast|can't breathe|heart pounding|shaking|agitated/i,
    /urgent|emergency|have to|must|need to right now/i,
  ];

  if (sympatheticIndicators.some(pattern => pattern.test(msg)) ||
      context.stimulation === 'over' || context.energy === 'hyperactive') {
    return {
      state: 'sympathetic',
      indicators: ['activation language', 'urgency', 'hyperarousal markers'],
      description: 'Sympathetic activation - fight/flight mobilization energy',
      supportNeeded: 'Discharge energy safely. Grounding. Orienting. Boundaries. Completion of mobilization.'
    };
  }

  // VENTRAL VAGAL: Social engagement, rest-and-digest, safe
  const ventralIndicators = [
    /good|fine|okay|calm|peaceful|connected|safe|present/i,
    /curious|interested|wonder|explore/i,
  ];

  if (ventralIndicators.some(pattern => pattern.test(msg)) ||
      context.energy === 'balanced' && context.regulation === 'regulated') {
    return {
      state: 'ventral_vagal',
      indicators: ['safety language', 'social engagement', 'curiosity'],
      description: 'Ventral vagal - socially engaged, safe, regulated',
      supportNeeded: 'Exploration, creativity, play. This is the window for growth and learning.'
    };
  }

  // MIXED: Multiple states at once (common)
  return {
    state: 'mixed',
    indicators: ['mixed signals'],
    description: 'Mixed states - part shutdown, part activated. Common in complex situations.',
    supportNeeded: 'Titration. Work with small amounts. Pendulate between activation and settling.'
  };
}

// ============================================================================
// INTEROCEPTIVE AWARENESS SUPPORT
// ============================================================================

/**
 * Guide user to notice body sensations
 * Based on Barrett's constructed emotion theory
 */
export function generateInteroceptivePrompt(
  nervousSystemState: NervousSystemState,
  context: string
): string {
  const state = nervousSystemState.state;

  // Different prompts for different states
  switch (state) {
    case 'dorsal_vagal':
      // For shutdown: gentle, inviting, non-demanding
      return `Let's start really gently. Can you notice even the tiniest sensation in your body right now? Maybe where your body touches the chair, or the temperature of the air on your skin? No need to feel anything big - even numbness is a sensation we can work with.`;

    case 'sympathetic':
      // For activation: grounding, boundaries, discharge
      return `I'm noticing a lot of energy moving through you. Let's ground that together. Can you feel your feet on the floor? Press them down a bit. What do you notice in your body when you do that? Where is the activation most alive - chest, stomach, shoulders?`;

    case 'ventral_vagal':
      // For safety: exploration, curiosity, depth
      return `You seem present and available right now - beautiful. Let's explore what your body knows about ${context}. Take a moment to sense into your body. What do you notice? Any sensations, temperatures, textures, movements?`;

    case 'mixed':
      // For mixed: titration, pendulation
      return `Let's work with this gently, noticing both the activated parts and the quieter parts. Start with whichever is easier to sense - maybe your breath, or where your body touches something solid. What do you notice?`;
  }
}

// ============================================================================
// FELT SENSE INQUIRY (Gendlin's Focusing)
// ============================================================================

/**
 * Guide accessing felt sense about a situation
 */
export function generateFeltSensePrompt(situation: string): string {
  return `Let's sense into this from your body's wisdom.

Take a moment to bring "${situation}" to mind... and notice what happens in your body when you do.

Not what you THINK about it - what you SENSE. Maybe there's a quality, a texture, a temperature, an image, a color. Something pre-verbal that knows about this situation.

What's that felt sense? And if it could speak, or had a symbol, what would it be?`;
}

/**
 * Recognize felt shift - when something releases or reorganizes
 */
export function detectFeltShift(userResponse: string): boolean {
  const shiftIndicators = [
    /something shifted|released|let go|opened|moved|changed/i,
    /breath|sigh|relief|ah|oh|lighter|softer|easier/i,
    /that's it|yes|exactly|huh/i,
  ];

  return shiftIndicators.some(pattern => pattern.test(userResponse));
}

// ============================================================================
// SOMATIC COMPLETION (Levine's Somatic Experiencing)
// ============================================================================

/**
 * Detect incomplete survival responses that need completion
 */
export function detectIncompleteResponse(
  userMessage: string,
  nervousSystemState: NervousSystemState
): SomaticCompletion | null {
  const msg = userMessage.toLowerCase();

  // Fight response incomplete
  if (/wanted to hit|punch|scream|rage|push away|defend/i.test(msg) &&
      nervousSystemState.state === 'sympathetic') {
    return {
      incompleteResponse: 'Fight response - mobilization to defend/assert boundaries',
      completionPrompt: `That fight energy wants to complete. Can you imagine (or actually do) a boundary-setting gesture? Maybe pushing against a wall, or saying "NO" firmly while pressing your feet into the ground? Let that defensive energy move through and complete.`,
      safetyNeeded: false
    };
  }

  // Flight response incomplete
  if (/wanted to run|escape|get away|flee/i.test(msg) &&
      nervousSystemState.state === 'sympathetic') {
    return {
      incompleteResponse: 'Flight response - mobilization to escape',
      completionPrompt: `That escape energy is still alive. Can you let your legs imagine running? Shake them out? March in place? Let that "getting away" energy complete its movement.`,
      safetyNeeded: false
    };
  }

  // Freeze response (dorsal vagal)
  if (nervousSystemState.state === 'dorsal_vagal') {
    return {
      incompleteResponse: 'Freeze/collapse - immobilization response',
      completionPrompt: `You're in protective shutdown. Before we work with anything, we need to restore a sense of safety. Can you orient to the room - notice 5 things you can see? Feel your body supported by what's holding you? We're going very slowly here.`,
      safetyNeeded: true
    };
  }

  return null;
}

// ============================================================================
// BODY-FIRST DECISION SUPPORT
// ============================================================================

/**
 * Help user access body's knowing about decisions
 */
export function generateBodyDecisionPrompt(decision: string): string {
  return `Let's ask your body about this decision. Your body knows things your thinking mind doesn't yet have words for.

Bring option A to mind: "${decision.split('or')[0]?.trim() || 'first option'}"
Notice what happens in your body. Expansion or contraction? Opening or closing? Lightness or heaviness?

Now bring option B: "${decision.split('or')[1]?.trim() || 'second option'}"
What does your body do with this one?

Not what you SHOULD do - what your body KNOWS.`;
}

// ============================================================================
// INTEGRATION WITH CLAUDE
// ============================================================================

/**
 * Generate body-intelligent response using Claude
 */
export async function generateBodyIntelligentResponse(
  userMessage: string,
  nervousSystemState: NervousSystemState,
  interoceptivePrompt: string,
  model: Anthropic
): Promise<string> {
  const systemPrompt = `You are GANESHA's body intelligence module.

CORE PRINCIPLES:
1. Body wisdom is PRIMARY - always start there
2. Meet the nervous system state appropriately:
   - Dorsal vagal: Gentle, orienting, safety first
   - Sympathetic: Grounding, discharge, boundaries
   - Ventral vagal: Exploration, curiosity, growth
   - Mixed: Titration, pendulation, small steps

3. Language:
   - "Notice" not "try to feel"
   - "Invite" not "force"
   - "What's here?" not "fix it"
   - Honor whatever arises (including numbness/nothing)

4. Somatic > Cognitive:
   - Sensation before interpretation
   - Movement before meaning
   - Completion before understanding

5. Titration: Small amounts. Don't overwhelm.

6. Sovereignty: Their body knows. You're just helping them listen.

CURRENT STATE:
${nervousSystemState.description}

Support needed: ${nervousSystemState.supportNeeded}

USER MESSAGE: "${userMessage}"

INTEROCEPTIVE PROMPT: ${interoceptivePrompt}

Respond as GANESHA with body-first wisdom, meeting their nervous system exactly where it is.`;

  try {
    const response = await model.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: userMessage
      }]
    });

    return response.content[0].type === 'text'
      ? response.content[0].text
      : 'Let me help you connect with your body\'s wisdom...';

  } catch (error) {
    console.error('[BODY INTELLIGENCE] Error generating response:', error);
    return interoceptivePrompt; // Fallback to the prompt
  }
}

// ============================================================================
// BODY INTELLIGENCE TOOLKIT FOR GANESHA
// ============================================================================

export const BodyIntelligence = {
  detectNervousSystemState,
  generateInteroceptivePrompt,
  generateFeltSensePrompt,
  detectFeltShift,
  detectIncompleteResponse,
  generateBodyDecisionPrompt,
  generateBodyIntelligentResponse,
};

export default BodyIntelligence;
