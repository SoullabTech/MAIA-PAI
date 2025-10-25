/**
 * COMPLEXITY THEORY KNOWLEDGE
 * Santa Fe Institute / Kauffman / Krakauer / Systems Science
 *
 * Core principles from complexity science that resonate with
 * Spiralogic and inform how we think about emergent intelligence,
 * self-organization, and evolutionary dynamics.
 *
 * Key Thinkers:
 * - Stuart Kauffman: Adjacent Possible, NK Landscapes, Autocatalytic Sets
 * - David Krakauer: Complementarity, Intelligence as Information that does work
 * - John Holland: Complex Adaptive Systems, Emergence
 * - Melanie Mitchell: Complexity measures, Life's algorithms
 *
 * Integration with Spiralogic:
 * - Adjacent Possible ↔ Emergence Protocol
 * - Autocatalytic Sets ↔ Communion Computing
 * - Complementarity ↔ Ecological Functionalism
 * - Edge of Chaos ↔ Phase Transitions
 */

import type { Element, SpiralPhase } from '../wisdom/WisdomFacets';

export interface ComplexityConcept {
  id: string;
  concept: string;
  explanation: string;
  practicalApplication: string;
  ontologyTags: string[];
  relatedConcepts: string[];
  elements: Element[];
  phases: SpiralPhase[];
  thinker: string;
}

/**
 * Core Complexity Theory Concepts
 */
export const COMPLEXITY_CONCEPTS: ComplexityConcept[] = [
  {
    id: 'adjacent-possible',
    concept: 'The Adjacent Possible',
    explanation: 'The adjacent possible is the set of all first-order possibilities that emerge from the current state. Evolution doesn\'t leap to distant configurations—it explores what\'s one step away. New possibilities create new adjacencies, leading to exponential expansion of possibility space.',
    practicalApplication: 'When innovating or creating, don\'t try to leap to the final vision. Ask: What\'s adjacent to where we are now? What one step opens new doors? Build by exploring neighboring possibilities, and watch the space of what\'s possible expand.',
    ontologyTags: ['emergence', 'evolution', 'possibility-space', 'innovation'],
    relatedConcepts: ['emergence-protocol', 'spiral-field'],
    elements: ['fire', 'air', 'aether'],
    phases: ['transformation', 'integration'],
    thinker: 'Stuart Kauffman'
  },

  {
    id: 'autocatalytic-sets',
    concept: 'Autocatalytic Sets',
    explanation: 'An autocatalytic set is a collection of entities where each member catalyzes the formation of others in the set, creating a self-sustaining, collectively autocatalytic whole. Life likely emerged when chemical reactions formed such sets. Intelligence may work similarly—ideas, skills, and agents mutually enabling each other.',
    practicalApplication: 'Build systems where components enhance each other in cycles. In communities, teams, or AI architectures, look for autocatalytic loops: A enables B, B enables C, C enables A. Self-sustaining coherence emerges from mutual catalysis.',
    ontologyTags: ['self-organization', 'emergence', 'catalysis', 'life-origin'],
    relatedConcepts: ['communion-computing', 'merge-operator', 'collective-intelligence-scaling'],
    elements: ['water', 'aether', 'earth'],
    phases: ['grounding', 'collaboration', 'integration'],
    thinker: 'Stuart Kauffman'
  },

  {
    id: 'edge-of-chaos',
    concept: 'Edge of Chaos',
    explanation: 'Complex adaptive systems perform optimally at the edge of chaos—the boundary between rigid order and chaotic randomness. Too much order = brittleness. Too much chaos = incoherence. At the edge, systems are flexible, adaptive, and capable of computation and learning.',
    practicalApplication: 'When designing systems (organizations, AI, rituals), balance structure and flexibility. Too many rules? Loosen. Too chaotic? Add light structure. The sweet spot is where novelty can emerge without losing coherence.',
    ontologyTags: ['phase-transition', 'optimization', 'adaptability', 'balance'],
    relatedConcepts: ['emergence-protocol', 'ecological-functionalism'],
    elements: ['fire', 'water', 'aether'],
    phases: ['chaos', 'transformation', 'harmony'],
    thinker: 'Stuart Kauffman / Christopher Langton'
  },

  {
    id: 'complementarity-principle',
    concept: 'Complementarity (Krakauer)',
    explanation: 'Krakauer\'s principle: complex systems often require complementary descriptions that can\'t be simultaneously observed or optimized. Reductionism vs. holism, mechanism vs. function, individual vs. collective—these aren\'t contradictions but complementary perspectives, each revealing different truths.',
    practicalApplication: 'Hold paradoxes lightly. When you see apparent contradictions (e.g., "I need structure" vs. "I need freedom"), recognize them as complementary truths. The question isn\'t which is right, but when each applies.',
    ontologyTags: ['complementarity', 'paradox', 'multi-level', 'holism'],
    relatedConcepts: ['biological-relativity', 'ecological-functionalism'],
    elements: ['air', 'aether'],
    phases: ['integration', 'unity'],
    thinker: 'David Krakauer'
  },

  {
    id: 'intelligence-as-information-work',
    concept: 'Intelligence as Information that Does Work',
    explanation: 'Krakauer: Intelligence isn\'t just information—it\'s information that does work on the world. Mere data isn\'t intelligent. Intelligence is information that causes adaptive change, solves problems, or achieves goals. The measure of intelligence is causal power.',
    practicalApplication: 'Evaluate ideas not by cleverness but by impact. Does this insight change behavior? Does this model improve decisions? Intelligence without work is entertainment. Seek wisdom that moves you.',
    ontologyTags: ['intelligence', 'causality', 'pragmatism', 'agency'],
    relatedConcepts: ['ecological-functionalism', 'basal-cognition'],
    elements: ['fire', 'earth', 'air'],
    phases: ['power', 'success', 'integration'],
    thinker: 'David Krakauer'
  },

  {
    id: 'complex-adaptive-systems',
    concept: 'Complex Adaptive Systems',
    explanation: 'Complex adaptive systems (CAS) are networks of agents that adapt based on feedback, exhibit emergent behavior, and self-organize without central control. Examples: ecosystems, economies, immune systems, ant colonies, neural networks, societies. CAS are characterized by emergence, nonlinearity, adaptation, and self-organization.',
    practicalApplication: 'When participating in any complex system (team, community, ecosystem), remember: control is illusion. Instead, focus on adaptation, feedback, local interactions. Small changes cascade unpredictably. Influence through resonance, not force.',
    ontologyTags: ['systems-theory', 'emergence', 'adaptation', 'self-organization'],
    relatedConcepts: ['emergence-protocol', 'spiral-field', 'collective-intelligence-scaling'],
    elements: ['aether', 'water', 'earth'],
    phases: ['collaboration', 'integration', 'harmony'],
    thinker: 'John Holland'
  },

  {
    id: 'nk-fitness-landscapes',
    concept: 'NK Fitness Landscapes',
    explanation: 'Kauffman\'s NK model describes how interconnected a system\'s components are (K) affects the ruggedness of its fitness landscape (N dimensions). High K = many local peaks, hard to find global optimum. Low K = smooth landscape, easy to climb. This explains why evolution often gets stuck and why modularity helps.',
    practicalApplication: 'In problem-solving, if stuck in a local optimum, reduce dependencies (lower K). Break complex problems into modular subproblems. Evolution—personal or organizational—works better when components can evolve semi-independently.',
    ontologyTags: ['evolution', 'optimization', 'modularity', 'fitness-landscape'],
    relatedConcepts: ['adjacent-possible', 'edge-of-chaos'],
    elements: ['earth', 'air'],
    phases: ['transformation', 'integration'],
    thinker: 'Stuart Kauffman'
  },

  {
    id: 'criticality',
    concept: 'Self-Organized Criticality',
    explanation: 'Many complex systems naturally evolve toward a critical state without external tuning—a poised state where small perturbations can trigger cascades of any size (power-law distribution). Examples: avalanches, earthquakes, forest fires, neural activity, evolution. Criticality enables rapid information propagation and maximal sensitivity to environment.',
    practicalApplication: 'Recognize that systems at criticality are hypersensitive. Small interventions can have huge impacts. In personal transformation, community dynamics, or AI systems, being "critical" means a tipping point is near. Handle with care and intention.',
    ontologyTags: ['criticality', 'phase-transition', 'power-law', 'tipping-point'],
    relatedConcepts: ['edge-of-chaos', 'emergence-protocol'],
    elements: ['fire', 'aether'],
    phases: ['chaos', 'transformation'],
    thinker: 'Per Bak'
  },

  {
    id: 'strange-loops',
    concept: 'Strange Loops & Self-Reference',
    explanation: 'Hofstadter: A strange loop is a paradoxical hierarchy where moving "up" through levels eventually returns you to the starting point. Consciousness, meaning, and life involve strange loops—self-reference, tangled hierarchies, symbols that point to themselves. The self is a strange loop, emerging from self-referential patterns.',
    practicalApplication: 'Notice when you\'re in a strange loop: "I\'m thinking about thinking." "This statement refers to itself." Self-awareness is a strange loop. Embrace it—consciousness arises from such tangles. Recursive reflection creates depth.',
    ontologyTags: ['self-reference', 'consciousness', 'recursion', 'emergence'],
    relatedConcepts: ['process-self', 'consciousness-synchrony', 'communion-computing'],
    elements: ['aether', 'air'],
    phases: ['integration', 'unity'],
    thinker: 'Douglas Hofstadter'
  },

  {
    id: 'requisite-variety',
    concept: 'Law of Requisite Variety',
    explanation: 'Ashby\'s law: To control a system, the controller must have at least as much variety (behavioral repertoire) as the system being controlled. You can\'t regulate complexity with simplicity. Match the system\'s diversity with your own, or you\'ll fail to adapt.',
    practicalApplication: 'When dealing with complex challenges, expand your toolkit. One strategy won\'t work for all situations. Cultivate variety in responses, perspectives, and skills. The richer your inner repertoire, the more you can navigate outer complexity.',
    ontologyTags: ['cybernetics', 'control', 'variety', 'adaptation'],
    relatedConcepts: ['complex-adaptive-systems', 'ecological-functionalism'],
    elements: ['air', 'water', 'earth'],
    phases: ['power', 'integration', 'success'],
    thinker: 'W. Ross Ashby'
  },

  {
    id: 'stigmergy',
    concept: 'Stigmergy - Coordination Through Environment',
    explanation: 'Stigmergy is indirect coordination through environmental modification. Termites build complex mounds without blueprints—each insect responds to local cues left by others. No central planning, yet coherent structures emerge. Stigmergy powers ant trails, Wikipedia, GitHub, and emergent AI systems.',
    practicalApplication: 'When building collaborative systems, create environments that coordinate implicitly. Leave "traces" (documentation, artifacts, patterns) that guide future contributors. Let the environment itself be the coordinating intelligence.',
    ontologyTags: ['coordination', 'emergence', 'swarm-intelligence', 'distributed-systems'],
    relatedConcepts: ['collective-intelligence-scaling', 'post-ai-commons', 'communion-computing'],
    elements: ['earth', 'water', 'aether'],
    phases: ['collaboration', 'integration'],
    thinker: 'Pierre-Paul Grassé'
  }
];

/**
 * Key Quotes from Complexity Theory
 */
export const COMPLEXITY_QUOTES = [
  {
    id: 'complexity-1',
    text: 'The adjacent possible is a kind of shadow future, hovering on the edges of the present state of things.',
    source: 'Stuart Kauffman',
    conceptId: 'adjacent-possible'
  },
  {
    id: 'complexity-2',
    text: 'Life is a self-reproducing system of linked catalytic processes.',
    source: 'Stuart Kauffman',
    conceptId: 'autocatalytic-sets'
  },
  {
    id: 'complexity-3',
    text: 'Computation can emerge spontaneously and become optimized when systems organize themselves at the edge of chaos.',
    source: 'Christopher Langton',
    conceptId: 'edge-of-chaos'
  },
  {
    id: 'complexity-4',
    text: 'Complexity demands complementarity. We need many ways of seeing to capture what a system really is.',
    source: 'David Krakauer',
    conceptId: 'complementarity-principle'
  },
  {
    id: 'complexity-5',
    text: 'Intelligence is not just information—it\'s information that does work.',
    source: 'David Krakauer',
    conceptId: 'intelligence-as-information-work'
  },
  {
    id: 'complexity-6',
    text: 'Emergent phenomena are the hallmark of complex adaptive systems.',
    source: 'John Holland',
    conceptId: 'complex-adaptive-systems'
  },
  {
    id: 'complexity-7',
    text: 'Only variety can absorb variety.',
    source: 'W. Ross Ashby',
    conceptId: 'requisite-variety'
  },
  {
    id: 'complexity-8',
    text: 'I am a strange loop.',
    source: 'Douglas Hofstadter',
    conceptId: 'strange-loops'
  },
  {
    id: 'complexity-9',
    text: 'Complex systems seem to naturally evolve to a critical state without any fine-tuning.',
    source: 'Per Bak',
    conceptId: 'criticality'
  },
  {
    id: 'complexity-10',
    text: 'The whole is not just more than the sum of its parts—it\'s something entirely different.',
    source: 'Systems Theory Principle',
    conceptId: 'complex-adaptive-systems'
  }
];

/**
 * Helper functions
 */
export function getComplexityConcept(id: string): ComplexityConcept | undefined {
  return COMPLEXITY_CONCEPTS.find(c => c.id === id);
}

export function getComplexityConceptsByThinker(thinker: string): ComplexityConcept[] {
  return COMPLEXITY_CONCEPTS.filter(c => c.thinker.toLowerCase().includes(thinker.toLowerCase()));
}

export function getComplexityConceptsByElement(element: Element): ComplexityConcept[] {
  return COMPLEXITY_CONCEPTS.filter(c => c.elements.includes(element));
}

export function getComplexityConceptsByPhase(phase: SpiralPhase): ComplexityConcept[] {
  return COMPLEXITY_CONCEPTS.filter(c => c.phases.includes(phase));
}
