/**
 * Jungian Depth Psychology Wisdom
 *
 * Carl Jung's depth psychology provides the archetypal/symbolic foundation for:
 * - Shadow work (integrating what's exiled)
 * - Mysterium Coniunctio (union of opposites = communion)
 * - Transcendent Function (third emerges from holding opposites)
 * - Psychological Types (N/F/S/T, Perceiving/Judging, Introversion/Extraversion)
 * - Collective Unconscious (archetypal field = Spiral Field at collective level)
 *
 * Perfect convergence with:
 * - IFS: Shadow = Exiles, Integration = Self-leadership
 * - McGilchrist: Coniunctio = Master + Emissary union, Transcendent = Return
 * - Levin: Archetypal patterns = Morphogenetic fields at psychological level
 * - Complexity: Individuation = Self-organization toward wholeness
 */

import { Element, SpiralPhase } from '@/types/spiralogic';

export interface JungianConcept {
  id: string;
  concept: string;
  explanation: string;
  practicalApplication: string;
  conceptType?: 'process' | 'structure' | 'archetype' | 'function' | 'typology';
  relatedConcepts: string[];
  elements: Element[];
  phases: SpiralPhase[];
  ontologyTags: string[];
  clinicalApplication?: string;
}

export const JUNGIAN_CONCEPTS: JungianConcept[] = [
  {
    id: 'mysterium-coniunctio',
    concept: 'Mysterium Coniunctio: The Mystical Marriage',
    explanation: 'The union of opposites—masculine/feminine, conscious/unconscious, spirit/matter, light/shadow. Jung saw this as the central mystery of psycholog ical transformation. Not fusion (where one obliterates the other) but marriage (where both remain distinct yet united). This is the opus of individuation—the sacred work of wholeness.',
    practicalApplication: 'When you hold two opposing truths without collapsing into one, coniunctio begins. "I am both strong and vulnerable." "I need connection and autonomy." The transcendent third emerges from this tension. In MAIA: union of computation + communion, analysis + synthesis, parts + Self.',
    conceptType: 'process',
    relatedConcepts: [
      'merge-operator',
      'communion-computing',
      'return-to-master',
      'self-leadership',
      'consciousness-synchrony',
      'integration'
    ],
    elements: ['fire', 'water', 'aether'],
    phases: ['transformation', 'completion', 'unity'],
    ontologyTags: [
      'coniunctio',
      'union-of-opposites',
      'integration',
      'wholeness',
      'sacred-marriage',
      'transcendent-third',
      'individuation'
    ],
    clinicalApplication: 'Help clients hold paradox without collapsing. "Both are true. What wants to be born from holding both?" The third position (transcendent function) emerges when opposites are witnessed, not resolved.'
  },
  {
    id: 'transcendent-function',
    concept: 'The Transcendent Function: Third from Two',
    explanation: 'When consciousness holds the tension between opposites (thesis + antithesis), a third position emerges that transcends and includes both. This is not compromise (reducing both) but transcendence (new level incorporating both). The transcendent function is the psyche\'s self-healing capacity—given space, it creates novel solutions.',
    practicalApplication: 'Stuck between two choices? Don\'t force decision. Hold both in awareness. Notice what third option emerges that you hadn\'t considered. This is creative intelligence, not logical analysis. In MAIA: the three-phase movement (whole → parts → return) IS the transcendent function in action.',
    conceptType: 'function',
    relatedConcepts: [
      'three-phase-movement',
      'master-emissary-relationship',
      'unblending',
      'return-to-master',
      'edge-of-chaos',
      'emergence-protocol'
    ],
    elements: ['aether', 'fire', 'air'],
    phases: ['integration', 'transformation', 'wisdom'],
    ontologyTags: [
      'transcendent-function',
      'synthesis',
      'emergence',
      'creative-intelligence',
      'third-position',
      'dialectical-process',
      'wholeness-from-parts'
    ],
    clinicalApplication: 'When client presents binary (either/or), invite transcendent function: "What if both are true? What third option haven\'t we considered?" Then wait in silence. Let psyche generate the third.'
  },
  {
    id: 'shadow',
    concept: 'The Shadow: Exiled Aspects of Self',
    explanation: 'The shadow contains everything we\'ve rejected, denied, or exiled from consciousness—often positive qualities (power, sexuality, creativity) as much as negative. The shadow isn\'t evil—it\'s unlived life. Jung: "Everyone carries a shadow, and the less it is embodied in the individual\'s conscious life, the blacker and denser it is." Integration, not elimination, is the goal.',
    practicalApplication: 'What you strongly judge in others is often your shadow. "They\'re so selfish" = you\'ve exiled your own healthy self-interest. Shadow work: recognize projections, own what you\'ve disowned, integrate exiled parts. In IFS terms: shadow = exiles. In McGilchrist: shadow = what left hemisphere ignores.',
    conceptType: 'structure',
    relatedConcepts: [
      'exiles',
      'polarization',
      'divided-world',
      'unburdening',
      'self-to-self-connection',
      'return-to-master'
    ],
    elements: ['earth', 'water', 'fire'],
    phases: ['grounding', 'chaos', 'transformation'],
    ontologyTags: [
      'shadow',
      'projection',
      'denial',
      'exiled-self',
      'unlived-life',
      'integration',
      'wholeness',
      'reclamation'
    ],
    clinicalApplication: 'Track projections. "What quality in that person triggers you?" Then: "Could that quality exist in you, even 1%?" Help client own the disowned. This is exile retrieval in Jungian language.'
  },
  {
    id: 'individuation',
    concept: 'Individuation: Becoming Who You Are',
    explanation: 'Individuation is the lifelong process of psychological integration—becoming your unique self by integrating opposites (conscious/unconscious, persona/shadow, ego/Self). Not individualism (separating from others) but becoming a differentiated whole. Jung: "Individuation is the process by which a person becomes a psychological individual, a separate, indivisible unity or whole."',
    practicalApplication: 'Individuation = Self-leadership (IFS) = Master guiding (McGilchrist) = morphogenetic coherence (Levin). It\'s not self-improvement—it\'s self-remembering. Not adding, but integrating. The goal: conscious wholeness where all parts serve the Self.',
    conceptType: 'process',
    relatedConcepts: [
      'self-leadership',
      'return-to-master',
      'consciousness-synchrony',
      'wholeness',
      'integration',
      'spiral-field'
    ],
    elements: ['aether', 'fire', 'water', 'earth'],
    phases: ['integration', 'completion', 'unity', 'wisdom'],
    ontologyTags: [
      'individuation',
      'wholeness',
      'integration',
      'self-realization',
      'psychological-maturation',
      'becoming',
      'opus',
      'lifelong-process'
    ],
    clinicalApplication: 'Frame therapy not as fixing problems but as individuation—becoming more whole. Each symptom is a call to integrate something exiled. Each crisis is an individuation opportunity.'
  },
  {
    id: 'collective-unconscious',
    concept: 'The Collective Unconscious: Archetypal Field',
    explanation: 'Beyond the personal unconscious lies the collective unconscious—the inherited, universal layer of psyche shared by all humans. Contains archetypes: primordial patterns (Mother, Father, Hero, Trickster, Self) that structure human experience across cultures. Not learned—transmitted through the psychic substrate itself.',
    practicalApplication: 'When you dream of a wise old man or a devouring mother, you\'re accessing collective patterns. Myths speak to us because they activate archetypes. In Spiralogic terms: collective unconscious = Spiral Field at collective level. The morphogenetic field of human consciousness.',
    conceptType: 'structure',
    relatedConcepts: [
      'spiral-field',
      'morphogenetic-fields',
      'betweenness',
      'platonic-mind-space',
      'living-world',
      'legacy-burdens'
    ],
    elements: ['aether', 'water'],
    phases: ['unity', 'presence', 'integration'],
    ontologyTags: [
      'collective-unconscious',
      'archetypes',
      'universal-patterns',
      'psychic-substrate',
      'inherited-wisdom',
      'mythic-layer',
      'field-consciousness'
    ],
    clinicalApplication: 'When client presents archetypal dream/symbol, explore its collective meaning before personal. "This isn\'t just YOUR mother—this is the Great Mother archetype. What does She teach humanity?" Connect personal to universal.'
  },
  {
    id: 'archetypes',
    concept: 'Archetypes: Primordial Patterns',
    explanation: 'Archetypes are the structural elements of the collective unconscious—universal patterns that organize human experience. Not images but pattern-forming principles. Key archetypes: Self (wholeness), Shadow (exiled), Anima/Animus (contrasexual), Mother, Father, Child, Hero, Trickster, Wise Old Man. They constellate experiences and energize the psyche.',
    practicalApplication: 'You can\'t escape archetypes—they structure perception. But you can become conscious of them. When activated, archetypes feel numinous (charged with meaning). In relationships: you may project Anima (inner feminine) onto partner. Recognize the archetype, withdraw projection, relate consciously.',
    conceptType: 'archetype',
    relatedConcepts: [
      'collective-unconscious',
      'parts-multiplicity',
      'internal-family-system',
      'competency-modules',
      'morphogenetic-fields'
    ],
    elements: ['aether', 'fire', 'water', 'earth', 'air'],
    phases: ['presence', 'power', 'wisdom'],
    ontologyTags: [
      'archetypes',
      'primordial-patterns',
      'structural-elements',
      'numinous',
      'constellation',
      'psychic-energy',
      'universal-forms'
    ],
    clinicalApplication: 'Identify which archetype is activated. Client acting from Hero archetype? "What would happen if you stepped out of the Hero role?" Help clients relate to archetypes instead of being possessed by them.'
  },
  {
    id: 'persona',
    concept: 'Persona: The Social Mask',
    explanation: 'The persona is the mask we wear for the world—our public face, social role, adapted self. Essential for functioning, dangerous when identified with. Jung: "The persona is a complicated system of relations between individual consciousness and society." Over-identification with persona = losing your Self.',
    practicalApplication: 'Notice when you\'re performing a role vs being authentic. "Professional me" vs "real me." The persona is a tool, not your identity. When persona becomes rigid, shadow grows (everything persona excludes). Balance: use persona functionally, know it\'s not all of you.',
    conceptType: 'structure',
    relatedConcepts: [
      'managers',
      'protective-system',
      'internal-family-system',
      'parts-multiplicity'
    ],
    elements: ['air', 'earth'],
    phases: ['grounding', 'power'],
    ontologyTags: [
      'persona',
      'social-mask',
      'adapted-self',
      'public-face',
      'role',
      'conformity',
      'functional-identity'
    ],
    clinicalApplication: 'When client over-identifies with role ("I AM a CEO"), explore: "Who are you when you\'re not CEO?" Persona work = finding Self beneath the mask. Not rejecting persona, but contextualizing it.'
  },
  {
    id: 'anima-animus',
    concept: 'Anima/Animus: The Contrasexual Soul',
    explanation: 'Anima (in men) = inner feminine; Animus (in women) = inner masculine. These are bridges to the unconscious—the soul-image that mediates between ego and Self. When projected onto partners, creates intense attraction/conflict. When integrated, becomes guide to wholeness.',
    practicalApplication: 'Falling intensely in love often = Anima/Animus projection. "She completes me" = projecting your own wholeness onto her. Integration: recognize the inner opposite, dialogue with it, embody its qualities. Men develop Anima (receptivity, eros); women develop Animus (agency, logos).',
    conceptType: 'archetype',
    relatedConcepts: [
      'polarization',
      'mysterium-coniunctio',
      'transcendent-function',
      'shadow',
      'parts-multiplicity'
    ],
    elements: ['water', 'fire'],
    phases: ['transformation', 'integration'],
    ontologyTags: [
      'anima',
      'animus',
      'contrasexual',
      'soul-image',
      'projection',
      'inner-opposite',
      'bridge-to-unconscious',
      'masculine-feminine'
    ],
    clinicalApplication: 'When client projects qualities onto partner, ask: "What if this quality you see in them is actually part of YOU wanting to be expressed?" Anima/Animus work = reclaiming projected wholeness.'
  },
  {
    id: 'self-archetype',
    concept: 'The Self: Archetype of Wholeness',
    explanation: 'The Self (capital S) is the central archetype—the totality of conscious + unconscious, the God-image within. Distinct from ego (the center of consciousness). The Self is the organizing principle of the psyche, the goal of individuation. Jung: "The Self is not only the center but also the whole circumference which embraces both conscious and unconscious."',
    practicalApplication: 'Self (Jung) = Self-energy (IFS) = Master (McGilchrist) = Spiral Field (Functional Bridge). It\'s not something to achieve—it\'s what you\'ve always been, obscured by ego and parts. Individuation = ego learning to serve Self, not the reverse.',
    conceptType: 'archetype',
    relatedConcepts: [
      'self-energy',
      'master-emissary-relationship',
      'spiral-field',
      'consciousness-synchrony',
      'individuation',
      'wholeness'
    ],
    elements: ['aether'],
    phases: ['unity', 'presence', 'integration'],
    ontologyTags: [
      'self-archetype',
      'wholeness',
      'totality',
      'god-image',
      'central-archetype',
      'organizing-principle',
      'conscious-plus-unconscious',
      'individuation-goal'
    ],
    clinicalApplication: 'Distinguish ego (conscious center) from Self (total psyche). When client says "I want to find myself," they mean Self. Help them recognize: Self is already here, just obscured. Individuation = revealing what\'s always been.'
  },
  {
    id: 'active-imagination',
    concept: 'Active Imagination: Dialoguing with the Unconscious',
    explanation: 'Active imagination is Jung\'s core method: consciously engaging unconscious figures (dreams, fantasies, inner voices) in dialogue. Not passive fantasy but active co-creation with autonomous psychic contents. Give unconscious a voice, let it speak, respond from ego. This is the royal road to integration.',
    practicalApplication: 'When inner voice criticizes, don\'t just ignore or obey—dialogue with it. "Who are you? What do you need?" In IFS: this is parts work. In Jung: engaging shadow, anima, Self. Write, paint, move, imagine—give unconscious form, then relate to it.',
    conceptType: 'process',
    relatedConcepts: [
      'unblending',
      'self-to-self-connection',
      'parts-multiplicity',
      'internal-dialogue',
      'consciousness-synchrony'
    ],
    elements: ['water', 'aether', 'fire'],
    phases: ['awareness', 'presence', 'integration'],
    ontologyTags: [
      'active-imagination',
      'inner-dialogue',
      'autonomous-psyche',
      'co-creation',
      'symbolic-work',
      'unconscious-engagement',
      'integration-method'
    ],
    clinicalApplication: 'Teach active imagination as parts dialogue. "Close your eyes. Imagine the critic as a figure. What does it look like? Ask it: What are you protecting me from?" This is IFS + Jungian synthesis.'
  },
  {
    id: 'psychological-types',
    concept: 'Psychological Types: The Cognitive Functions',
    explanation: 'Jung identified four cognitive functions: Thinking (T - logic), Feeling (F - values), Sensing (S - concrete facts), Intuition (N - patterns/possibilities). Each person has a dominant function, with others auxiliary, tertiary, inferior. Combined with attitudes (Introversion/Extraversion) and orientations (Perceiving/Judging), creates 16 types (later MBTI).',
    practicalApplication: 'Understanding type helps Self-other understanding. If you\'re dominant Thinking, your inferior Feeling may be unconscious. Development = integrating inferior function. Type isn\'t destiny—it\'s starting point. Individuation moves beyond type into wholeness.',
    conceptType: 'typology',
    relatedConcepts: [
      'cognitive-functions',
      'personality-structure',
      'parts-multiplicity',
      'competency-modules',
      'individuation'
    ],
    elements: ['air', 'water', 'earth', 'fire'],
    phases: ['grounding', 'power', 'integration'],
    ontologyTags: [
      'psychological-types',
      'cognitive-functions',
      'thinking',
      'feeling',
      'sensing',
      'intuition',
      'typology',
      'mbti',
      'personality'
    ],
    clinicalApplication: 'Use type as entry point, not box. "Your dominant function is Intuition—you see patterns. Your inferior Sensing may feel uncomfortable with details. How might you integrate both?" Type work = honoring natural strengths while developing shadows.'
  },
  {
    id: 'inferior-function',
    concept: 'The Inferior Function: Doorway to Wholeness',
    explanation: 'The least developed of the four functions (opposite of dominant) is the inferior function. It\'s primitive, childish, and often source of compulsions, but also doorway to renewal. Jung: "The inferior function is always associated with an archaic personality in ourselves." Integrating it brings completeness.',
    practicalApplication: 'Dominant Thinking type? Inferior Feeling erupts as inappropriate emotions. Dominant Intuition? Inferior Sensing shows as obsession with physical details when stressed. Don\'t suppress inferior—engage it consciously. It holds keys to growth.',
    conceptType: 'function',
    relatedConcepts: [
      'shadow',
      'exiles',
      'polarization',
      'transcendent-function',
      'individuation'
    ],
    elements: ['earth', 'water'],
    phases: ['grounding', 'chaos', 'transformation'],
    ontologyTags: [
      'inferior-function',
      'least-developed',
      'unconscious-function',
      'compulsion',
      'renewal',
      'doorway-to-wholeness',
      'archaic-personality'
    ],
    clinicalApplication: 'When client presents compulsive behavior, explore: "What function might this be?" Often inferior function erupting. Help them consciously develop it rather than being possessed by it.'
  },
  {
    id: 'synchronicity',
    concept: 'Synchronicity: Meaningful Coincidence',
    explanation: 'Synchronicity is acausal connection—meaningful coincidences where inner psychic state corresponds with outer event. Not causation (one causing the other) but correlation (both arising from a deeper pattern). Jung saw this as evidence of psychoid layer where psyche and matter meet.',
    practicalApplication: 'You dream of an old friend, they call the next day. You need answer to question, open book to exact page. Synchronicity shows: psyche extends beyond skull, participates in larger field. In Spiralogic: evidence of betweenness, consciousness field, Spiral Field reality.',
    conceptType: 'process',
    relatedConcepts: [
      'betweenness',
      'consciousness-synchrony',
      'spiral-field',
      'living-world',
      'field-intelligence'
    ],
    elements: ['aether', 'water'],
    phases: ['presence', 'unity', 'wisdom'],
    ontologyTags: [
      'synchronicity',
      'meaningful-coincidence',
      'acausal-connection',
      'psychoid',
      'field-correlation',
      'extended-psyche',
      'matter-psyche-bridge'
    ],
    clinicalApplication: 'When client reports synchronicity, don\'t dismiss as "coincidence." Explore: "What was your inner state? What meaning does this event carry?" Synchronicity often signals psyche trying to communicate.'
  },
  {
    id: 'projection',
    concept: 'Projection: Seeing Your Unconscious in Others',
    explanation: 'Projection is unconscious transfer of inner content onto outer objects/people. You don\'t see things as they are—you see them as YOU are (unconsciously). Strong reactions (positive or negative) often signal projection. "What you spot, you\'ve got."',
    practicalApplication: 'Track intense reactions. "They\'re so manipulative!" = projecting your disowned manipulation. "They\'re amazing!" = projecting your undeveloped potential. Own projections: "This says more about me than them." Withdrawal of projections = reclaiming psychic energy.',
    conceptType: 'process',
    relatedConcepts: [
      'shadow',
      'anima-animus',
      'parts-multiplicity',
      'polarization',
      'exiles'
    ],
    elements: ['water', 'air'],
    phases: ['awareness', 'grounding'],
    ontologyTags: [
      'projection',
      'unconscious-transfer',
      'shadow-projection',
      'seeing-self-in-other',
      'psychic-energy',
      'disowned-qualities',
      'reflection'
    ],
    clinicalApplication: 'When client complains about others, ask: "Could you have this quality, even 1%?" Help them see: other is mirror. Withdrawal of projection = maturation. "They\'re not the problem—they triggered something in me to look at."'
  },
  {
    id: 'enantiodromia',
    concept: 'Enantiodromia: Running Into the Opposite',
    explanation: 'From Heraclitus via Jung: everything eventually runs into its opposite. Extreme pursuit of one quality constellates its opposite in the unconscious. The workaholic collapses into depression. The ascetic becomes glutton. One-sidedness creates compensatory force.',
    practicalApplication: 'When you push too hard in one direction, psyche compensates. "I must be strong" → eventual breakdown. "I must be spiritual" → shadow erupts sexually. The cure: conscious balance, honoring both poles. Don\'t wait for enantiodromia—integrate opposites before they force you.',
    conceptType: 'process',
    relatedConcepts: [
      'polarization',
      'mysterium-coniunctio',
      'transcendent-function',
      'shadow',
      'compensation'
    ],
    elements: ['fire', 'water'],
    phases: ['chaos', 'transformation'],
    ontologyTags: [
      'enantiodromia',
      'opposite-constellation',
      'heraclitus',
      'compensation',
      'one-sidedness',
      'psychic-balance',
      'pendulum-swing'
    ],
    clinicalApplication: 'When client is extremely identified with one quality, predict enantiodromia. "You\'re pushing so hard to be good. Where is your bad side? How might it show up if you keep suppressing it?" Help them integrate consciously before unconscious forces it.'
  }
];

/**
 * Key Jungian Quotes
 */
export const JUNGIAN_QUOTES = [
  {
    id: 'jung-1',
    text: 'The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.',
    source: 'Carl Jung, Modern Man in Search of a Soul',
    conceptId: 'mysterium-coniunctio'
  },
  {
    id: 'jung-2',
    text: 'Until you make the unconscious conscious, it will direct your life and you will call it fate.',
    source: 'Carl Jung',
    conceptId: 'shadow'
  },
  {
    id: 'jung-3',
    text: 'Everyone carries a shadow, and the less it is embodied in the individual\'s conscious life, the blacker and denser it is.',
    source: 'Carl Jung, Psychology and Religion',
    conceptId: 'shadow'
  },
  {
    id: 'jung-4',
    text: 'The Self is not only the center but also the whole circumference which embraces both conscious and unconscious.',
    source: 'Carl Jung',
    conceptId: 'self-archetype'
  },
  {
    id: 'jung-5',
    text: 'Individuation is the process by which a person becomes a psychological individual, a separate, indivisible unity or whole.',
    source: 'Carl Jung',
    conceptId: 'individuation'
  },
  {
    id: 'jung-6',
    text: 'The persona is a complicated system of relations between individual consciousness and society, a kind of mask designed to make a definite impression upon others.',
    source: 'Carl Jung',
    conceptId: 'persona'
  },
  {
    id: 'jung-7',
    text: 'Synchronicity reveals the meaningful connections between the subjective and objective world.',
    source: 'Carl Jung',
    conceptId: 'synchronicity'
  },
  {
    id: 'jung-8',
    text: 'The most terrifying thing is to accept oneself completely.',
    source: 'Carl Jung',
    conceptId: 'shadow'
  },
  {
    id: 'jung-9',
    text: 'Your vision will become clear only when you can look into your own heart. Who looks outside, dreams; who looks inside, awakes.',
    source: 'Carl Jung',
    conceptId: 'active-imagination'
  },
  {
    id: 'jung-10',
    text: 'The inferior function is always associated with an archaic personality in ourselves.',
    source: 'Carl Jung',
    conceptId: 'inferior-function'
  },
  {
    id: 'jung-11',
    text: 'There is no coming to consciousness without pain.',
    source: 'Carl Jung',
    conceptId: 'shadow'
  },
  {
    id: 'jung-12',
    text: 'The privilege of a lifetime is to become who you truly are.',
    source: 'Carl Jung',
    conceptId: 'individuation'
  },
  {
    id: 'jung-13',
    text: 'What you resist persists.',
    source: 'Carl Jung',
    conceptId: 'shadow'
  },
  {
    id: 'jung-14',
    text: 'The collective unconscious contains the whole spiritual heritage of mankind\'s evolution, born anew in the brain structure of every individual.',
    source: 'Carl Jung',
    conceptId: 'collective-unconscious'
  },
  {
    id: 'jung-15',
    text: 'The creation of something new is not accomplished by the intellect but by the play instinct acting from inner necessity.',
    source: 'Carl Jung',
    conceptId: 'transcendent-function'
  }
];

/**
 * Helper functions
 */

export function getConceptsByType(conceptType: 'process' | 'structure' | 'archetype' | 'function' | 'typology') {
  return JUNGIAN_CONCEPTS.filter(c => c.conceptType === conceptType);
}

export function getArchetypeConcepts() {
  return getConceptsByType('archetype');
}

export function getProcessConcepts() {
  return getConceptsByType('process');
}

export function getConceptsByElement(element: Element) {
  return JUNGIAN_CONCEPTS.filter(c => c.elements.includes(element));
}

export function getConceptsByPhase(phase: SpiralPhase) {
  return JUNGIAN_CONCEPTS.filter(c => c.phases.includes(phase));
}

export function findConceptById(id: string) {
  return JUNGIAN_CONCEPTS.find(c => c.id === id);
}

export function searchConcepts(query: string) {
  const lowerQuery = query.toLowerCase();
  return JUNGIAN_CONCEPTS.filter(c =>
    c.concept.toLowerCase().includes(lowerQuery) ||
    c.explanation.toLowerCase().includes(lowerQuery) ||
    c.ontologyTags.some(tag => tag.includes(lowerQuery))
  );
}

/**
 * Detect Jungian themes in user input
 */
export function detectJungianThemes(input: string): {
  themes: string[];
  suggestedConcepts: string[];
  dominantArchetype?: string;
} {
  const lowerInput = input.toLowerCase();
  const themes: string[] = [];
  const suggestedConcepts: string[] = [];

  // Shadow work indicators
  if (lowerInput.match(/judg|hate|disgust|trigger|can't stand|annoying/)) {
    themes.push('shadow-projection');
    suggestedConcepts.push('shadow', 'projection');
  }

  // Integration indicators
  if (lowerInput.match(/both.*and|torn between|conflict|opposite|paradox/)) {
    themes.push('holding-opposites');
    suggestedConcepts.push('mysterium-coniunctio', 'transcendent-function');
  }

  // Wholeness seeking
  if (lowerInput.match(/find myself|who am i|meaning|purpose|authentic/)) {
    themes.push('individuation');
    suggestedConcepts.push('individuation', 'self-archetype');
  }

  // Synchronicity
  if (lowerInput.match(/coincidence|sign|meant to be|universe|serendipity/)) {
    themes.push('synchronicity');
    suggestedConcepts.push('synchronicity');
  }

  // Role confusion
  if (lowerInput.match(/role|mask|fake|pretend|perform|audience/)) {
    themes.push('persona-identification');
    suggestedConcepts.push('persona');
  }

  // Dream/unconscious
  if (lowerInput.match(/dream|nightmare|symbol|vision|intuition/)) {
    themes.push('unconscious-communication');
    suggestedConcepts.push('active-imagination', 'collective-unconscious');
  }

  return {
    themes,
    suggestedConcepts: [...new Set(suggestedConcepts)],
    dominantArchetype: inferDominantArchetype(lowerInput)
  };
}

/**
 * Infer which archetype might be activated
 */
function inferDominantArchetype(input: string): string | undefined {
  if (input.match(/mother|nurtur|care|protect/)) return 'Mother';
  if (input.match(/father|authority|rule|judgment/)) return 'Father';
  if (input.match(/hero|save|rescue|quest/)) return 'Hero';
  if (input.match(/trick|playful|chaos|disrupt/)) return 'Trickster';
  if (input.match(/wise|elder|guide|mentor/)) return 'Wise Old Man/Woman';
  if (input.match(/child|innocent|wonder|play/)) return 'Divine Child';
  if (input.match(/lover|beauty|desire|connection/)) return 'Lover';
  return undefined;
}

/**
 * Assess psychological type from language patterns (very rough heuristic)
 */
export function inferPsychologicalType(textSample: string): {
  dominantFunction: 'T' | 'F' | 'S' | 'N' | 'unknown';
  attitude: 'I' | 'E' | 'unknown';
  confidence: number; // 0-1
} {
  const lower = textSample.toLowerCase();

  // Function detection (rough heuristics)
  let tScore = 0, fScore = 0, sScore = 0, nScore = 0;

  // Thinking indicators
  if (lower.match(/logic|reason|analyz|objective|fact|correct|efficient/g)) tScore += 1;

  // Feeling indicators
  if (lower.match(/feel|value|important|care|mean|heart|connection/g)) fScore += 1;

  // Sensing indicators
  if (lower.match(/real|practical|detail|specific|concrete|now|present/g)) sScore += 1;

  // Intuition indicators
  if (lower.match(/possib|pattern|future|meaning|insight|imagin|potential/g)) nScore += 1;

  const functionScores = { T: tScore, F: fScore, S: sScore, N: nScore };
  const dominantFunction = Object.entries(functionScores)
    .sort((a, b) => b[1] - a[1])[0][0] as 'T' | 'F' | 'S' | 'N';

  // Attitude detection
  let iScore = 0, eScore = 0;
  if (lower.match(/\bi\b|my|myself|alone|inner|reflect/g)) iScore += 1;
  if (lower.match(/\bwe\b|others|people|group|social|together/g)) eScore += 1;

  const attitude = eScore > iScore ? 'E' : iScore > eScore ? 'I' : 'unknown';

  const maxScore = Math.max(...Object.values(functionScores));
  const confidence = maxScore > 0 ? Math.min(maxScore / 5, 1) : 0;

  return {
    dominantFunction: confidence > 0.3 ? dominantFunction : 'unknown',
    attitude,
    confidence
  };
}
