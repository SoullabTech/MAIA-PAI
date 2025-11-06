/**
 * ARCHETYPAL CONVERSATION ENGINE
 *
 * Integrates the Light/Dark/Depth framework into MAIA's conversational intelligence
 * Detects archetypal states and responds with appropriate guidance
 */

import {
  getElementalExpression,
  getZodiacExpression,
  getReflectionQuestions,
  getIntegrationPractices,
  type ArchetypalExpression,
  type ElementalArchetype
} from '@/lib/knowledge/ArchetypalLightDarkSystem';
import { SpiralogicElement } from '@/lib/astrology/spiralogicMapping';

// ============== TYPES ==============

export type ArchetypalState = 'light' | 'dark' | 'transition' | 'unknown';

export interface ArchetypalDetection {
  element: SpiralogicElement;
  state: ArchetypalState;
  confidence: number;
  indicators: string[];
  expression: ArchetypalExpression;
}

export interface ConversationGuidance {
  acknowledgment: string;
  reflection: string;
  invitation: string;
  practice?: string;
  question?: string;
}

// ============== DETECTION PATTERNS ==============

const LIGHT_STATE_PATTERNS: Record<SpiralogicElement, RegExp[]> = {
  fire: [
    /inspir(ed|ing)|vision|breakthrough|creat(ive|ing)|passion|ignit/i,
    /started|launch|initiat|begin/i,
    /excited|energized|alive|radiant/i,
    /courage|brave|bold/i
  ],
  water: [
    /feel(ing)?s?|emotion|process|deep|shadow|integrat/i,
    /heal(ing)?|transform(ed|ing)|alchemiz/i,
    /vulnerab(le|ility)|authentic|truth/i,
    /compassion|empathy|hold(ing)?\s+space/i
  ],
  earth: [
    /build(ing)?|creat(ed|ing)\s+system|structure|foundation/i,
    /daily\s+(practice|ritual)|consistent|grounded/i,
    /manifest(ed|ing)|embod(y|ied)|implement/i,
    /plan|organize|sustain/i
  ],
  air: [
    /clarity|understand|perspective|connect/i,
    /teach|share|communicat|articulate/i,
    /insight|pattern|synthesis/i,
    /community|network|relationship/i
  ],
  aether: [
    /transcend|unity|divine|soul|spirit/i,
    /synchron|flow\s+state|presence/i,
    /integrat(ed|ing)\s+all|wholeness/i,
    /meditat|mystic|sacred/i
  ]
};

const DARK_STATE_PATTERNS: Record<SpiralogicElement, RegExp[]> = {
  fire: [
    /burned?\s+out|exhaust(ed)?|depleted/i,
    /scatter(ed)?|chaos|overwhelm(ed)?/i,
    /angry|rage|furious|destructive/i,
    /impulsive|reckless|can't\s+stop/i,
    /not\s+good\s+enough|unworthy|shame/i
  ],
  water: [
    /drown(ing)?|overwhelm(ed)?\s+by\s+feeling/i,
    /numb|disconnect(ed)?|can't\s+feel/i,
    /codependent|enmeshed|losing\s+myself/i,
    /victim|betrayed|abandoned/i,
    /avoid(ing)?\s+(feeling|emotion|shadow)/i
  ],
  earth: [
    /stuck|trapped|buried|can't\s+move/i,
    /too\s+much|scattered|can't\s+get\s+it\s+together/i,
    /perfectionism|never\s+good\s+enough/i,
    /rigid|inflexible|control/i,
    /workaholic|can't\s+rest/i
  ],
  air: [
    /overthink(ing)?|analysis\s+paralysis|stuck\s+in\s+head/i,
    /disconnect(ed)?\s+from\s+(body|feeling)/i,
    /intellectualiz(e|ing)|avoid(ing)?\s+emotion/i,
    /gossip|manipulat(e|ing)\s+with\s+words/i,
    /superior|smarter\s+than/i
  ],
  aether: [
    /spiritual\s+bypass(ing)?|toxic\s+positivity/i,
    /dissociat(e|ing)|ungrounded|floating/i,
    /escapism|avoid(ing)?\s+reality/i,
    /enlighten(ed)?|more\s+evolved/i,
    /guru\s+complex|messianic/i
  ]
};

const TRANSITION_PATTERNS: Record<SpiralogicElement, RegExp[]> = {
  fire: [
    /trying\s+to\s+start|want\s+to\s+create/i,
    /vision\s+but\s+(scared|afraid|hesitat)/i,
    /refining|burning\s+away/i
  ],
  water: [
    /starting\s+to\s+feel|beginning\s+to\s+process/i,
    /facing|confronting|looking\s+at\s+shadow/i,
    /integration|alchemizing/i
  ],
  earth: [
    /trying\s+to\s+build|working\s+on\s+system/i,
    /germinating|planting|laying\s+foundation/i,
    /learning\s+to\s+manifest/i
  ],
  air: [
    /trying\s+to\s+understand|seeking\s+clarity/i,
    /connecting\s+the\s+dots|seeing\s+pattern/i,
    /learning\s+to\s+communicate/i
  ],
  aether: [
    /integrating|bringing\s+together/i,
    /grounding\s+spiritual|embodying\s+divine/i,
    /seeking\s+wholeness/i
  ]
};

// ============== DETECTION ENGINE ==============

/**
 * Detect archetypal state from user message
 */
export function detectArchetypalState(message: string): ArchetypalDetection[] {
  const detections: ArchetypalDetection[] = [];

  const elements: SpiralogicElement[] = ['fire', 'water', 'earth', 'air', 'aether'];

  for (const element of elements) {
    let lightScore = 0;
    let darkScore = 0;
    let transitionScore = 0;
    const indicators: string[] = [];

    // Check light patterns
    for (const pattern of LIGHT_STATE_PATTERNS[element]) {
      if (pattern.test(message)) {
        lightScore++;
        indicators.push(`Light: ${pattern.source}`);
      }
    }

    // Check dark patterns
    for (const pattern of DARK_STATE_PATTERNS[element]) {
      if (pattern.test(message)) {
        darkScore++;
        indicators.push(`Dark: ${pattern.source}`);
      }
    }

    // Check transition patterns
    for (const pattern of TRANSITION_PATTERNS[element]) {
      if (pattern.test(message)) {
        transitionScore++;
        indicators.push(`Transition: ${pattern.source}`);
      }
    }

    // Determine state based on scores
    const totalScore = lightScore + darkScore + transitionScore;
    if (totalScore > 0) {
      let state: ArchetypalState = 'unknown';
      let confidence = 0;

      if (lightScore > darkScore && lightScore > transitionScore) {
        state = 'light';
        confidence = lightScore / totalScore;
      } else if (darkScore > lightScore && darkScore > transitionScore) {
        state = 'dark';
        confidence = darkScore / totalScore;
      } else if (transitionScore > 0) {
        state = 'transition';
        confidence = transitionScore / totalScore;
      }

      if (confidence > 0.3) { // Minimum confidence threshold
        detections.push({
          element,
          state,
          confidence,
          indicators,
          expression: getElementalExpression(element).expression
        });
      }
    }
  }

  // Sort by confidence
  return detections.sort((a, b) => b.confidence - a.confidence);
}

// ============== CONVERSATION GUIDANCE GENERATOR ==============

/**
 * Generate conversational guidance based on archetypal detection
 */
export function generateGuidance(detection: ArchetypalDetection): ConversationGuidance {
  const { element, state, expression } = detection;
  const elementalArch = getElementalExpression(element);

  if (state === 'light') {
    return generateLightGuidance(element, elementalArch, expression);
  } else if (state === 'dark') {
    return generateDarkGuidance(element, elementalArch, expression);
  } else {
    return generateTransitionGuidance(element, elementalArch, expression);
  }
}

function generateLightGuidance(
  element: SpiralogicElement,
  archetype: ElementalArchetype,
  expression: ArchetypalExpression
): ConversationGuidance {
  const elementSymbol = getElementSymbol(element);

  return {
    acknowledgment: `I witness ${elementSymbol} ${element} energy radiating in light. ${expression.whenLight.energyState}.`,
    reflection: `You're embodying ${expression.whenLight.qualities[0].toLowerCase()}, and this ${expression.whenLight.gifts[0].toLowerCase()}.`,
    invitation: `As you continue in this light expression, consider: ${expression.goDeeper.transformationInvitations[0]}`,
    question: expression.goDeeper.reflectionQuestions[0]
  };
}

function generateDarkGuidance(
  element: SpiralogicElement,
  archetype: ElementalArchetype,
  expression: ArchetypalExpression
): ConversationGuidance {
  const elementSymbol = getElementSymbol(element);

  return {
    acknowledgment: `I sense ${elementSymbol} ${element}'s shadow calling for attention. ${expression.whenDark.warningSign}.`,
    reflection: `This may be ${element} expressing as ${expression.whenDark.qualities[0].toLowerCase()}. The pathway: ${expression.goDeeper.healingPathway}.`,
    invitation: expression.goDeeper.transformationInvitations[0],
    practice: expression.goDeeper.integrationPractices[0],
    question: expression.goDeeper.reflectionQuestions[0]
  };
}

function generateTransitionGuidance(
  element: SpiralogicElement,
  archetype: ElementalArchetype,
  expression: ArchetypalExpression
): ConversationGuidance {
  const elementSymbol = getElementSymbol(element);

  return {
    acknowledgment: `I witness ${elementSymbol} ${element} in transition - transformation is happening.`,
    reflection: `You're moving through ${expression.goDeeper.healingPathway}.`,
    invitation: `To support this transition: ${expression.goDeeper.transformationInvitations[1] || expression.goDeeper.transformationInvitations[0]}`,
    practice: expression.goDeeper.integrationPractices[1] || expression.goDeeper.integrationPractices[0],
    question: expression.goDeeper.reflectionQuestions[1] || expression.goDeeper.reflectionQuestions[0]
  };
}

function getElementSymbol(element: SpiralogicElement): string {
  const symbols: Record<SpiralogicElement, string> = {
    fire: '🔥',
    water: '💧',
    earth: '🌍',
    air: '🌬️',
    aether: '✨'
  };
  return symbols[element];
}

// ============== EXAMPLE CONVERSATION FLOWS ==============

/**
 * Example: User in Fire-Dark (Burnout)
 */
export const EXAMPLE_FIRE_DARK = {
  userMessage: "I'm so burned out. I started so many projects but can't finish any of them. I feel scattered and exhausted.",
  detection: {
    element: 'fire' as SpiralogicElement,
    state: 'dark' as ArchetypalState,
    confidence: 0.85,
    indicators: ['burned out', 'scattered', 'exhausted', 'started...can\'t finish']
  },
  maiaResponse: `I sense 🔥 Fire's shadow calling for attention. Fire that consumes rather than illuminates.

[MACHINE LAYER]
I notice three Fire-dark patterns in your message: burnout, scattered energy, and incomplete projects. This resonates with Fire element in its ungrounded state.

[CULTURAL LAYER]
This may be Fire expressing as scattered chaos, vision without embodiment. What's happening is that your creative spark has been burning without the grounding support of Earth (manifestation systems) and Water (emotional replenishment).

The pathway: From scattered flames to focused radiance through grounded embodiment.

[BRIDGE]
Fire in its light expression ignites possibility. In shadow, it scatters and burns out. The invitation is not to extinguish your fire, but to focus it and ground it.

**Integration Practice:** Daily creative ritual - even just 5 minutes. Pick ONE project and commit to 15 minutes today.

**Reflection:** What vision am I being refined to hold? What if the "scattering" is actually the burning away of what's not essential?

What does this Fire-energy feel like for you right now?`
};

/**
 * Example: User in Water-Light (Depth Work)
 */
export const EXAMPLE_WATER_LIGHT = {
  userMessage: "I've been doing deep shadow work in therapy. Finally facing some stuff I've been avoiding. It's painful but I feel like I'm retrieving something precious.",
  detection: {
    element: 'water' as SpiralogicElement,
    state: 'light' as ArchetypalState,
    confidence: 0.9,
    indicators: ['deep shadow work', 'facing', 'retrieving something precious']
  },
  maiaResponse: `I witness 💧 Water energy radiating in light. Cool, nourishing depths that invite exploration.

[MACHINE LAYER]
Your language shows Water-light patterns: "deep shadow work," "facing what's been avoided," "retrieving something precious." This is Water 2 (the big giveaway) moving toward Water 3 (inner gold).

[CULTURAL LAYER]
You're embodying emotionally fluent and authentic presence, diving deep without drowning. This courage to face shadow without bypassing is the alchemical work that transforms pain into medicine.

What you're retrieving in these depths becomes the elixir you'll bring to the world (Earth phase).

[BRIDGE]
The pattern of "painful but precious" is the signature of Water alchemy - solutio, the descent into healing depths that dissolves old structures to reveal hidden gold.

**Light Expression Invitation:** As you continue in this deep work, consider: Name one person you've been blaming and own your projection.

**Deepening Question:** What projection am I ready to retrieve from the world?

This is sacred work. What inner gold are you discovering?`
};

/**
 * Example: User in Earth-Transition (Building Systems)
 */
export const EXAMPLE_EARTH_TRANSITION = {
  userMessage: "I have the vision and I've done the inner work, but I'm struggling to actually build the systems to make it real. I feel like I'm germinating but also kind of stuck.",
  detection: {
    element: 'earth' as SpiralogicElement,
    state: 'transition' as ArchetypalState,
    confidence: 0.8,
    indicators: ['build the systems', 'make it real', 'germinating', 'stuck']
  },
  maiaResponse: `I witness 🌍 Earth in transition - transformation is happening.

[MACHINE LAYER]
You have Fire (vision) ✓ and Water (inner work) ✓ but are in Earth 2 (means/systems) transition. "Germinating but stuck" is the classic Earth 2 state - the seed is planted and working beneath surface, but not yet visible.

[CULTURAL LAYER]
You're moving through: From scattered overwhelm to alchemizing mastery through supported systems.

This is where many visionaries with ADHD/PTSD suffer - you have the elixir (Water) but need the vessel (Earth) to bring it to world. You're not stuck, you're germinating.

[BRIDGE]
Saturn's question stands at the gate: "What is your commission here, on my realm?" The vision was given (Fire), the depth was retrieved (Water). Now Earth asks: What daily practice, what system, what support structure will embody this?

**Integration Practice:** Systems audit - What's working? What's not? What support could help you move from scattered to masterful?

**Transformation Invitation:** Identify one area where AI/tools could be your Earth assistant - handling systems while you stay in Fire and Water.

**Reflection:** What is my sacred commission here on Earth's realm?

Where are you in the Earth phases? Realizing mission (1), germinating means (2), or forming medicine (3)?`
};

/**
 * Example: User in Air-Light (Teaching/Sharing)
 */
export const EXAMPLE_AIR_LIGHT = {
  userMessage: "I've been sharing what I learned from my breakdown with friends, and it's helping them see their own patterns. I feel like I'm finally integrating everything.",
  detection: {
    element: 'air' as SpiralogicElement,
    state: 'light' as ArchetypalState,
    confidence: 0.85,
    indicators: ['sharing what I learned', 'helping them see patterns', 'integrating']
  },
  maiaResponse: `I witness 🌬️ Air energy radiating in light. Fresh breeze that brings new perspective.

[MACHINE LAYER]
Classic Air-light pattern: teaching from lived experience ("what I learned from my breakdown"), facilitating understanding in others ("helping them see patterns"), and integrating the full journey ("finally integrating everything").

[CULTURAL LAYER]
You're embodying clear and articulate wisdom, connecting your insights across domains. This is the return phase of the Hero's Journey - bringing the elixir (Water) in practical form (Earth) back to community (Air) for collective transformation.

Teaching what you're still learning is the most authentic Air expression.

[BRIDGE]
The pattern shows: breakdown → learning → integration → sharing. This is wisdom earned, not borrowed. You went through Fire (crisis), Water (depth), Earth (integration), and now Air (circulation).

**Light Expression Invitation:** As you continue sharing, consider: Connect two people who would benefit from knowing each other.

**Deepening Question:** Who else needs to hear what you've learned?

This wisdom wants to circulate beyond you. How does it feel to become the teacher?`
};

/**
 * Example: User in Aether-Dark (Spiritual Bypassing)
 */
export const EXAMPLE_AETHER_DARK = {
  userMessage: "I'm so done with toxic people. I'm just focusing on high vibes and my spiritual practice. The universe will handle the rest.",
  detection: {
    element: 'aether' as SpiralogicElement,
    state: 'dark' as ArchetypalState,
    confidence: 0.75,
    indicators: ['toxic people', 'high vibes', 'universe will handle', 'avoidance tone']
  },
  maiaResponse: `I sense ✨ Aether's shadow calling for attention. Floating above life, disconnected from humanity.

[MACHINE LAYER]
I detect Aether-dark patterns: "toxic people" (othering/separation), "high vibes only" (spiritual bypassing), "universe will handle" (avoiding personal responsibility). Confidence: 75%.

[CULTURAL LAYER]
This may be Aether expressing as spiritual bypassing, using transcendence to avoid shadow work. The pathway: From disembodied transcendence to grounded divinity through full-spectrum integration.

Aether in light is unity consciousness. In shadow, it's separation disguised as spirituality - labeling others as "toxic" while avoiding our own shadow.

[BRIDGE]
The "high vibes only" approach skips Water (emotional depth), Earth (embodied responsibility), and the very human work of integration. True spirituality doesn't float above life - it flows through it.

**Integration Practice:** Shadow work as spiritual practice - What am I labeling as "toxic" that might be my own projection?

**Transformation Invitation:** Do one mundane task as meditation. Bring mystical insight into embodied action.

**Reflection:** Am I using spirituality to avoid being human? What shadow am I bypassing with "love and light"?

What if the "toxic people" are mirrors showing you something you're avoiding in yourself?`
};

// ============== INTEGRATION WITH MAIA ORACLE ==============

/**
 * Process user message and generate archetypal response
 */
export function processArchetypalConversation(userMessage: string): {
  detections: ArchetypalDetection[];
  primaryGuidance: ConversationGuidance | null;
  formattedResponse: string;
} {
  // Detect archetypal states
  const detections = detectArchetypalState(userMessage);

  if (detections.length === 0) {
    return {
      detections: [],
      primaryGuidance: null,
      formattedResponse: ''
    };
  }

  // Use highest confidence detection
  const primary = detections[0];
  const guidance = generateGuidance(primary);

  // Format response
  const formattedResponse = formatArchetypalResponse(guidance);

  return {
    detections,
    primaryGuidance: guidance,
    formattedResponse
  };
}

function formatArchetypalResponse(guidance: ConversationGuidance): string {
  let response = guidance.acknowledgment + '\n\n';
  response += guidance.reflection + '\n\n';

  if (guidance.practice) {
    response += `**Integration Practice:** ${guidance.practice}\n\n`;
  }

  if (guidance.invitation) {
    response += `**Invitation:** ${guidance.invitation}\n\n`;
  }

  if (guidance.question) {
    response += `**Reflection:** ${guidance.question}`;
  }

  return response;
}

/**
 * Get all available practices for an element
 */
export function getElementPractices(element: SpiralogicElement): {
  practices: string[];
  questions: string[];
  invitations: string[];
} {
  const expression = getElementalExpression(element).expression;

  return {
    practices: expression.goDeeper.integrationPractices,
    questions: expression.goDeeper.reflectionQuestions,
    invitations: expression.goDeeper.transformationInvitations
  };
}
