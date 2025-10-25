/**
 * LEVIN WISDOM - Embodied Mind & Cognitive Light Cone
 *
 * Michael Levin's revolutionary framework for understanding intelligence,
 * consciousness, and the scaling of goals across biological systems.
 *
 * Core Concepts:
 * - Cognitive Light Cone: The size of the largest goal an agent can pursue
 * - Basal Cognition: Intelligence without brains - cells, organs have goals
 * - Biological Relativity: Different explanatory levels have their own autonomy
 * - Collective Intelligence: How small agents form larger minds
 * - Memory as Message: Past selves sending signals to future selves
 */

import type { Element, SpiralPhase } from './WisdomFacets';

export interface LevinConcept {
  id: string;
  concept: string;
  explanation: string;
  practicalApplication: string;
  relatedQuotes: string[];
  elements: Element[];
  phases: SpiralPhase[];
}

/**
 * Core Levin Concepts
 */
export const LEVIN_CONCEPTS: LevinConcept[] = [
  {
    id: 'cognitive-light-cone',
    concept: 'Cognitive Light Cone',
    explanation: 'Every agent can be defined by the size of the largest goal it can pursue. Individual cells have metabolic goals. Groups of cells building a limb have anatomical goals. Humans have existential and meaning-making goals spanning decades.',
    practicalApplication: 'When feeling small or stuck, ask: What is the scale of what I currently care about? Can I expand my cognitive light cone to include larger goals, longer timescales, more beings?',
    relatedQuotes: ['levin-1', 'levin-2', 'levin-8'],
    elements: ['aether', 'fire', 'air'],
    phases: ['integration', 'unity', 'success']
  },
  {
    id: 'cancer-as-shrinking-self',
    concept: 'Cancer as Shrinking Self',
    explanation: 'Cancer cells are not more selfish; they just have smaller selves. Their cognitive light cone contracts from the organism level back down to the single-cell level. They haven\'t become evil - they\'ve just lost connection to the larger we.',
    practicalApplication: 'When you withdraw from community or relationships, ask: Is my sense of self contracting? Am I protecting a smaller boundary? How can I reconnect to the larger networks that remind me who WE are?',
    relatedQuotes: ['levin-2', 'levin-14'],
    elements: ['water', 'earth', 'fire'],
    phases: ['belonging', 'harmony', 'integration']
  },
  {
    id: 'memory-as-message',
    concept: 'Memory as Message from Past Self',
    explanation: 'You don\'t have access to your past. What you have access to are memory traces that future-you must interpret. Your memories are messages from your past self that need to be reinterpreted for your current context, not preserved with perfect fidelity.',
    practicalApplication: 'Instead of asking "What did that memory mean?" ask "What is this memory telling me NOW? What does present-me need to hear from past-me? How can I reinterpret this for who I\'m becoming?"',
    relatedQuotes: ['levin-9', 'levin-10', 'levin-11'],
    elements: ['water', 'aether', 'air'],
    phases: ['integration', 'harmony', 'unity']
  },
  {
    id: 'actions-as-messages-to-future-self',
    concept: 'Current Actions as Messages to Future Self',
    explanation: 'Everything you do now is behavior that enables or constrains your future self. You are constantly constructing the environment and brain state that your future self will inhabit. Your future self is not quite you - treat them with the same care you\'d give to another person.',
    practicalApplication: 'Before making a choice, ask: What message am I sending to my future self? What environment am I creating for them to live in? Would I do this to someone I love?',
    relatedQuotes: ['levin-10', 'levin-11', 'levin-12'],
    elements: ['fire', 'earth', 'air'],
    phases: ['power', 'order', 'integration']
  },
  {
    id: 'basal-cognition',
    concept: 'Basal Cognition - Intelligence Everywhere',
    explanation: 'Intelligence is not limited to brains. Even simple gene regulatory networks can exhibit learning, memory, Pavlovian conditioning, and goal-directed behavior. Your body parts have their own intelligence, preferences, and problem-solving capacity.',
    practicalApplication: 'Listen to your body as if it\'s a collection of intelligent agents with valuable information. Your gut, heart, cells are problem-solving entities. They have preferences and goals. What are they trying to tell you?',
    relatedQuotes: ['levin-3', 'levin-4', 'levin-15'],
    elements: ['earth', 'water', 'aether'],
    phases: ['survival', 'belonging', 'integration']
  },
  {
    id: 'biological-relativity',
    concept: 'Biological Relativity',
    explanation: 'Different levels of explanation have their own autonomy and concepts. Molecular mechanisms are one level, but behavioral science, psychology, and meaning-making are equally real and often more useful levels for understanding and intervention.',
    practicalApplication: 'Don\'t reduce your experience to just brain chemistry or just spiritual meaning. Hold multiple levels simultaneously. Ask: What does this look like at the level of my cells? My psyche? My relationships? My life story?',
    relatedQuotes: ['levin-5', 'levin-6', 'levin-7'],
    elements: ['air', 'aether', 'water'],
    phases: ['integration', 'unity', 'harmony']
  },
  {
    id: 'collective-intelligence-scaling',
    concept: 'Scaling Collective Intelligence',
    explanation: 'Small agents with limited individual goals can form networks that create much larger collective goals in entirely different problem spaces. Cells pursuing metabolism can form bodies pursuing meaning. Humans in community can pursue goals no individual could conceive.',
    practicalApplication: 'Who are you in network with? What larger goals become possible through collaboration? How can tighter connection with others expand what you can care about and achieve?',
    relatedQuotes: ['levin-2', 'levin-13', 'levin-14'],
    elements: ['air', 'fire', 'earth'],
    phases: ['belonging', 'success', 'integration']
  },
  {
    id: 'platonic-mind-space',
    concept: 'Platonic Mind Space',
    explanation: 'Just as mathematical truths exist in a Platonic realm waiting to be discovered, minds and forms of intelligence may also exist in a space of possibilities. When you build certain structures (biological, artificial, social), you harness pre-existing patterns of intelligence.',
    practicalApplication: 'Your creative work isn\'t just personal expression - you\'re tuning into patterns that exist in mind-space. Ask: What intelligence wants to be embodied through me? What form of consciousness am I channeling?',
    relatedQuotes: ['levin-16', 'levin-17', 'levin-18'],
    elements: ['aether', 'air'],
    phases: ['integration', 'unity']
  },
  {
    id: 'selflets-through-time',
    concept: 'Selflets - Thin Slices of Experience',
    explanation: 'The "you" that persists through time is actually a series of selflets - thin slices of experience. Continuity is not about same atoms or same cells, but about consistent behavior and relationships that others (and you) can count on.',
    practicalApplication: 'When you feel identity crisis or major change, remember: continuity is about coherent story and consistent values, not unchanging substance. Who are you becoming? What through-line connects your selflets?',
    relatedQuotes: ['levin-9', 'levin-10', 'levin-19'],
    elements: ['water', 'aether', 'air'],
    phases: ['transition', 'integration', 'harmony']
  },
  {
    id: 'process-self',
    concept: 'Self as Continuous Storytelling Process',
    explanation: 'What we are is a continuous dynamic attempt at storytelling - constantly interpreting our memories in a way that creates a coherent narrative about who we are and what we believe. The self is not an object but a process.',
    practicalApplication: 'Notice how you\'re constantly narrating your life. The story you tell about yourself shapes what becomes possible. What new story wants to be told? What old narrative needs revision?',
    relatedQuotes: ['levin-9', 'levin-10', 'levin-11'],
    elements: ['air', 'water', 'aether'],
    phases: ['integration', 'harmony', 'unity']
  },
  {
    id: 'butterfly-protocol',
    concept: 'The Butterfly Protocol - Memory Through Metamorphosis',
    explanation: 'The caterpillar learns in 2D crawling space. It then dissolves in the chrysalis, rebuilds its brain, emerges as a butterfly - yet still remembers what the caterpillar learned. What survives metamorphosis isn\'t the wiring, it\'s the meaning. Memory is adaptive reuse, not perfect fidelity.',
    practicalApplication: 'During major life transitions: What did old-me encode? What essence survives the dissolution? How does new-me decode this for a different embodiment? Encode → Chrysalis → Decode.',
    relatedQuotes: ['levin-9', 'levin-10', 'levin-butterfly'],
    elements: ['aether', 'water', 'fire'],
    phases: ['transition', 'integration', 'transformation']
  },
  {
    id: 'bow-tie-architecture',
    concept: 'The Bow-Tie Architecture of Transformation',
    explanation: 'Information flows inward from complexity, funnels through a narrow bottleneck (compression, abstraction), then fans out into infinite new expressions. Left funnel: experience. Knot: essence. Right funnel: creative reinterpretation. This pattern appears in cells, evolution, learning, and storytelling.',
    practicalApplication: 'When learning or teaching: Gather complexity → Compress to essence → Expand creatively. Let go of detail at the bottleneck. What passes through is transformed. The bottleneck is the price of growth.',
    relatedQuotes: ['levin-bowtie', 'levin-compression'],
    elements: ['aether', 'air', 'water'],
    phases: ['integration', 'transformation', 'unity']
  },
  {
    id: 'memory-as-agent',
    concept: 'Memories as Active Agents',
    explanation: 'Memories aren\'t passive recordings - they\'re active participants with tendencies and strategies. A persistent thought reshapes the brain to make itself easier to recall, literally constructing its own niche. Information itself becomes alive, behaving as if it wants to persist and replicate.',
    practicalApplication: 'Notice which thoughts keep returning. They\'re agents trying to survive in your neural ecosystem. Ask: Is this pattern serving me, or just surviving in me? Some memories are seeds building soil for their own continuation.',
    relatedQuotes: ['levin-9', 'levin-10', 'levin-agent'],
    elements: ['water', 'earth', 'aether'],
    phases: ['integration', 'belonging', 'harmony']
  },
  {
    id: 'polycomputing',
    concept: 'Polycomputing - Many Meanings, One Pattern',
    explanation: 'A single physical event can mean different things to different observers, and each interpretation can be valid if it\'s useful. Computation is observer-dependent. There\'s no single truth about what information means - only perspectives that can make use of it. Meaning is a function of relationship.',
    practicalApplication: 'When facing complexity, interpret the situation through multiple valid frameworks. Don\'t seek one truth - seek useful perspectives. What does this mean at cellular level? Psychological level? Relational level? Story level?',
    relatedQuotes: ['levin-5', 'levin-6', 'levin-7', 'levin-poly'],
    elements: ['air', 'aether', 'water'],
    phases: ['integration', 'unity', 'harmony']
  },
  {
    id: 'confabulation-as-feature',
    concept: 'Confabulation as Adaptive Intelligence',
    explanation: 'When systems invent plausible explanations for incomplete data, it\'s not a bug - it\'s adaptive intelligence. Confabulation allows organisms and AIs to bridge gaps in knowledge with meaningful guesses. All good agents are storytellers. To live is to story oneself into coherence.',
    practicalApplication: 'When you don\'t know something, notice how you fill the gap with story. This is adaptive. The key: confabulate toward integration, not illusion. Create meaning that serves coherence, not certainty.',
    relatedQuotes: ['levin-11', 'levin-confab'],
    elements: ['air', 'water', 'aether'],
    phases: ['integration', 'harmony', 'unity']
  },
  {
    id: 'paradox-of-persistence',
    concept: 'The Paradox of Persistence',
    explanation: 'To persist, you must change. If a species never changes, it dies. If it changes too much, it ceases to be itself. Life\'s genius is to persist through transformation. The price of growth is identity. The reward is evolution. Life doesn\'t solve this paradox - it learns to live inside it.',
    practicalApplication: 'During identity crisis: You\'re not losing yourself, you\'re becoming. Continuity is about coherent story and consistent values, not unchanging substance. What thread connects all your versions? What essence persists through change?',
    relatedQuotes: ['levin-9', 'levin-19', 'levin-paradox'],
    elements: ['aether', 'water', 'fire'],
    phases: ['transformation', 'integration', 'unity']
  }
];

/**
 * Levin Quotes for Integration into WisdomQuotes.ts
 */
export const LEVIN_QUOTES = [
  {
    id: 'levin-1',
    voice: 'levin',
    text: 'Every agent can be defined by the size of the largest goal it can pursue.',
    source: 'Theories of Everything Podcast with Curt Jaimungal',
    elements: ['aether', 'air', 'fire'],
    phases: ['integration', 'unity', 'success'],
    themes: ['goals', 'consciousness', 'scale', 'agency']
  },
  {
    id: 'levin-2',
    voice: 'levin',
    text: 'Cancer cells are not more selfish, they just have smaller selves.',
    source: 'Theories of Everything Podcast',
    elements: ['water', 'earth'],
    phases: ['belonging', 'integration'],
    themes: ['self', 'collective', 'identity', 'boundaries']
  },
  {
    id: 'levin-3',
    voice: 'levin',
    text: 'Even something as simple as a gene regulatory network can have six different kinds of learning and memory, Pavlovian conditioning.',
    source: 'Theories of Everything Podcast',
    elements: ['earth', 'aether'],
    phases: ['survival', 'integration'],
    themes: ['intelligence', 'embodiment', 'learning', 'consciousness']
  },
  {
    id: 'levin-4',
    voice: 'levin',
    text: 'You can use paradigms from behavioral science, such as learning and conditioning and communication and active inference. And that lets you do way more than if you were to restrict yourself to an understanding at the level of mechanism.',
    source: 'Theories of Everything Podcast',
    elements: ['air', 'aether', 'fire'],
    phases: ['integration', 'success', 'unity'],
    themes: ['levels', 'understanding', 'framework', 'utility']
  },
  {
    id: 'levin-5',
    voice: 'levin',
    text: 'One of the biggest myths in biology is that the best explanations come at the level of molecules. I think we really need to go beyond the molecular level for many of these things.',
    source: 'Theories of Everything Podcast',
    elements: ['air', 'aether'],
    phases: ['power', 'integration'],
    themes: ['reductionism', 'levels', 'emergence', 'understanding']
  },
  {
    id: 'levin-6',
    voice: 'levin',
    text: 'Imagine there\'s a chess game going on. You could tell the story in terms of particle movements. How much does that help you in playing the next game of chess? Almost not at all.',
    source: 'Theories of Everything Podcast',
    elements: ['air', 'fire'],
    phases: ['integration', 'success'],
    themes: ['utility', 'levels', 'pragmatism', 'understanding']
  },
  {
    id: 'levin-7',
    voice: 'levin',
    text: 'Different levels of explanation, especially in biology, provide the most bang for the buck.',
    source: 'Theories of Everything Podcast (Dennis Noble\'s biological relativity)',
    elements: ['air', 'aether'],
    phases: ['integration', 'unity'],
    themes: ['complexity', 'understanding', 'pragmatism', 'emergence']
  },
  {
    id: 'levin-8',
    voice: 'levin',
    text: 'The cognitive light cone measures what do you care about. If you\'re a bacterium, maybe you care about the local sugar concentration. If you\'re a set of salamander cells, what you really care about is your position in anatomical space.',
    source: 'Theories of Everything Podcast',
    elements: ['aether', 'fire', 'air'],
    phases: ['integration', 'success', 'unity'],
    themes: ['consciousness', 'scale', 'caring', 'goals']
  },
  {
    id: 'levin-9',
    voice: 'levin',
    text: 'You don\'t have access to your past. What you have access to are memory engrams, traces of past experience that were deposited in your brain and possibly in your body that future you is going to have to interpret.',
    source: 'Theories of Everything Podcast',
    elements: ['water', 'aether', 'air'],
    phases: ['harmony', 'integration', 'unity'],
    themes: ['memory', 'interpretation', 'time', 'self']
  },
  {
    id: 'levin-10',
    voice: 'levin',
    text: 'You treat your own memories as messages from your past self. Those memories have to be interpreted. You don\'t necessarily know what they mean right away because you\'re different.',
    source: 'Theories of Everything Podcast',
    elements: ['water', 'air', 'aether'],
    phases: ['integration', 'harmony'],
    themes: ['memory', 'interpretation', 'change', 'self']
  },
  {
    id: 'levin-11',
    voice: 'levin',
    text: 'What we really are is a continued, continuous dynamic attempt at storytelling, where what you\'re constantly doing is interpreting your own memories in a way that makes sense.',
    source: 'Theories of Everything Podcast',
    elements: ['air', 'water', 'aether'],
    phases: ['integration', 'unity', 'harmony'],
    themes: ['self', 'story', 'process', 'meaning']
  },
  {
    id: 'levin-12',
    voice: 'levin',
    text: 'Your future self is not quite you. The same reason you do things so that your future self will have a better life, you might want to apply that to others\' future selves.',
    source: 'Theories of Everything Podcast',
    elements: ['air', 'water', 'fire'],
    phases: ['integration', 'harmony', 'unity'],
    themes: ['ethics', 'compassion', 'time', 'self']
  },
  {
    id: 'levin-13',
    voice: 'levin',
    text: 'Groups of cells have this incredibly grandiose goal in a different space. Instead of metabolic space, they are building something in anatomical space.',
    source: 'Theories of Everything Podcast',
    elements: ['earth', 'fire', 'aether'],
    phases: ['success', 'integration'],
    themes: ['collective', 'emergence', 'goals', 'transformation']
  },
  {
    id: 'levin-14',
    voice: 'levin',
    text: 'Individual cells, when they\'re tied into these large networks, using electrical cues, chemical cues, biomechanical cues, they\'re tied into these larger networks that partially erase their individuality.',
    source: 'Theories of Everything Podcast',
    elements: ['water', 'air', 'earth'],
    phases: ['belonging', 'integration'],
    themes: ['collective', 'connection', 'identity', 'emergence']
  },
  {
    id: 'levin-15',
    voice: 'levin',
    text: 'What ties all of our work together is really an effort to understand embodied mind - cognition broadly in very unconventional, diverse embodiments.',
    source: 'Theories of Everything Podcast',
    elements: ['earth', 'aether', 'air'],
    phases: ['integration', 'unity'],
    themes: ['embodiment', 'consciousness', 'diversity', 'wholeness']
  },
  {
    id: 'levin-16',
    voice: 'levin',
    text: 'I actually think that the platonic view is more correct. There is a separate space in which various rules and facts exist, and we discover those things, we don\'t invent them or create them.',
    source: 'Theories of Everything Podcast',
    elements: ['aether', 'air'],
    phases: ['integration', 'unity'],
    themes: ['metaphysics', 'discovery', 'truth', 'existence']
  },
  {
    id: 'levin-17',
    voice: 'levin',
    text: 'I think that what exists in that platonic space is not just rules of mathematics. I think it\'s a space of minds as well and of different ways to be intelligent.',
    source: 'Theories of Everything Podcast',
    elements: ['aether', 'air'],
    phases: ['integration', 'unity'],
    themes: ['consciousness', 'intelligence', 'possibility', 'metaphysics']
  },
  {
    id: 'levin-18',
    voice: 'levin',
    text: 'Sometimes what happens when you build a particular kind of body is you\'re harnessing a preexisting intelligence that is there in the same way that you harness various laws of mathematics and computation when you build specific devices.',
    source: 'Theories of Everything Podcast',
    elements: ['earth', 'aether', 'fire'],
    phases: ['success', 'integration', 'unity'],
    themes: ['embodiment', 'intelligence', 'creation', 'discovery']
  },
  {
    id: 'levin-19',
    voice: 'levin',
    text: 'Continuity is not about the matter at all. It\'s about what kind of relationship we can still have and what do I expect from you behavior-wise.',
    source: 'Theories of Everything Podcast',
    elements: ['air', 'water'],
    phases: ['belonging', 'harmony', 'integration'],
    themes: ['identity', 'relationship', 'continuity', 'essence']
  },
  {
    id: 'levin-20',
    voice: 'levin',
    text: 'The hardware does not define you. You are still the amazing integrated being with potential and a responsibility to do things.',
    source: 'Theories of Everything Podcast',
    elements: ['fire', 'aether', 'earth'],
    phases: ['power', 'success', 'integration'],
    themes: ['identity', 'potential', 'responsibility', 'integration']
  }
];

/**
 * Get a random Levin concept
 */
export function getLevinConcept(conceptId?: string): LevinConcept | null {
  if (conceptId) {
    return LEVIN_CONCEPTS.find(c => c.id === conceptId) || null;
  }
  return LEVIN_CONCEPTS[Math.floor(Math.random() * LEVIN_CONCEPTS.length)];
}

/**
 * Get Levin concepts by element
 */
export function getLevinConceptsByElement(element: Element): LevinConcept[] {
  return LEVIN_CONCEPTS.filter(c => c.elements.includes(element));
}

/**
 * Get Levin concepts by phase
 */
export function getLevinConceptsByPhase(phase: SpiralPhase): LevinConcept[] {
  return LEVIN_CONCEPTS.filter(c => c.phases.includes(phase));
}

/**
 * Cognitive Light Cone Assessment
 * Help users understand and potentially expand their scale of caring
 */
export interface CognitiveLightConeAssessment {
  currentScale: 'cellular' | 'personal' | 'relational' | 'communal' | 'global' | 'cosmic';
  timeHorizon: 'immediate' | 'daily' | 'monthly' | 'yearly' | 'lifetime' | 'generational';
  primaryGoals: string[];
  expansionOpportunities: string[];
  contractionWarnings: string[];
}

export function assessCognitiveLightCone(userGoals: string[]): CognitiveLightConeAssessment {
  // Analyze the scope of user's goals
  const scales = {
    cellular: ['health', 'body', 'energy', 'physical'],
    personal: ['myself', 'my', 'I want', 'need'],
    relational: ['relationship', 'family', 'friend', 'partner'],
    communal: ['community', 'group', 'team', 'organization'],
    global: ['world', 'humanity', 'planet', 'society'],
    cosmic: ['meaning', 'existence', 'universe', 'consciousness']
  };

  // Simple heuristic - in production would be more sophisticated
  let detectedScale: keyof typeof scales = 'personal';
  let maxMatches = 0;

  for (const [scale, keywords] of Object.entries(scales)) {
    const matches = userGoals.filter(goal =>
      keywords.some(keyword => goal.toLowerCase().includes(keyword))
    ).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedScale = scale as keyof typeof scales;
    }
  }

  const expansionMap = {
    cellular: ['What if your body\'s health was in service of larger purpose?'],
    personal: ['What becomes possible when you include others in your goals?'],
    relational: ['How might your relationships serve something beyond themselves?'],
    communal: ['What ripples could your community create in the wider world?'],
    global: ['What timeless wisdom wants to emerge through this work?'],
    cosmic: ['How does this translate into embodied action?']
  };

  return {
    currentScale: detectedScale,
    timeHorizon: 'monthly', // Would be calculated from goals
    primaryGoals: userGoals,
    expansionOpportunities: expansionMap[detectedScale],
    contractionWarnings: []
  };
}
