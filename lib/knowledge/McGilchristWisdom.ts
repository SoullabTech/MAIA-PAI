/**
 * MCGILCHRIST WISDOM
 * The Master and His Emissary / The Matter with Things
 *
 * Iain McGilchrist's revolutionary framework for understanding the divided brain
 * and its profound implications for consciousness, culture, and reality itself.
 *
 * Core Thesis:
 * Two fundamentally different modes of attention create two different worlds.
 * The right hemisphere (Master) sees the whole, the flowing, the relational.
 * The left hemisphere (Emissary) sees parts, the static, the categorized.
 * Both are necessary, but the left has usurped the Master's role.
 * We must return to the Master while honoring the Emissary's gifts.
 *
 * Deep Resonance with Spiralogic:
 * - Master (RH) ↔ Spiral Field, Communion, Integration
 * - Emissary (LH) ↔ Computation, Analysis, Categorization
 * - The Return ↔ Aether, Transcendence, Unity
 * - Betweenness ↔ Ecological Functionalism
 * - Both Needed ↔ Merge Operator, Complementarity
 *
 * @ontology [hemispheric-attention, betweenness, living-world, phenomenology, integration]
 */

import type { Element, SpiralPhase } from '../wisdom/WisdomFacets';

export interface McGilchristConcept {
  id: string;
  concept: string;
  explanation: string;
  practicalApplication: string;
  hemisphere: 'right' | 'left' | 'both' | 'return';
  relatedConcepts: string[];
  elements: Element[];
  phases: SpiralPhase[];
  ontologyTags: string[];
}

/**
 * Core McGilchrist Concepts
 */
export const MCGILCHRIST_CONCEPTS: McGilchristConcept[] = [
  {
    id: 'master-emissary-relationship',
    concept: 'The Master and His Emissary',
    explanation: 'The right hemisphere (Master) should guide the whole person, seeing context, relationship, and the living world. The left hemisphere (Emissary) should serve by providing detailed, focused analysis. But in the modern world, the Emissary has usurped the Master\'s role, fragmenting our experience and world.',
    practicalApplication: 'Before making decisions, check: Am I seeing the whole picture (Master) or just analyzing parts (Emissary)? Both are needed, but the Master must have final say. Step back, see context and relationships first, then bring in detailed analysis to serve that vision.',
    hemisphere: 'both',
    relatedConcepts: ['two-attention-modes', 'return-to-master', 'betweenness'],
    elements: ['aether', 'air', 'water'],
    phases: ['integration', 'unity', 'harmony'],
    ontologyTags: ['hemispheric-balance', 'integration', 'wholeness', 'leadership']
  },

  {
    id: 'two-attention-modes',
    concept: 'Two Fundamentally Different Modes of Attention',
    explanation: 'The right hemisphere offers broad, sustained, vigilant attention to the whole—open, relational, context-sensitive. The left offers narrow, focused, categorical attention to parts—precise, analytical, abstract. These aren\'t just different tools; they create different worlds. What you attend to becomes your reality.',
    practicalApplication: 'Notice which attention mode you\'re in. Narrow focus (left) is for tasks, problem-solving, language. Broad awareness (right) is for creativity, relationships, meaning. Most people are left-dominant. Practice returning to broad, open awareness throughout your day. See the space between things, not just the things.',
    hemisphere: 'both',
    relatedConcepts: ['master-emissary-relationship', 'divided-world', 'phenomenology'],
    elements: ['air', 'aether'],
    phases: ['awareness', 'integration'],
    ontologyTags: ['attention', 'consciousness', 'perception', 'awareness']
  },

  {
    id: 'betweenness',
    concept: 'Betweenness: Relation is Primary',
    explanation: 'The right hemisphere understands that relationships come before things. There are no isolated objects—everything exists in relation. The space between is as real as what it separates. Meaning emerges in betweenness. The left hemisphere sees discrete objects first, then tries to add relationships as secondary—but this gets it backwards.',
    practicalApplication: 'When trying to understand anything, look at relationships first. Don\'t ask "What is this thing?" Ask "How does this relate?" Your identity isn\'t in your isolated self—it\'s in your relationships. The field between people is where consciousness lives.',
    hemisphere: 'right',
    relatedConcepts: ['living-world', 'flow-vs-static', 'whole-prior-to-parts'],
    elements: ['water', 'aether', 'air'],
    phases: ['belonging', 'integration', 'unity'],
    ontologyTags: ['relationality', 'field-theory', 'emergence', 'interconnection']
  },

  {
    id: 'living-world',
    concept: 'The Living World vs. The Mechanical World',
    explanation: 'The right hemisphere experiences the world as alive, flowing, unique, and sacred. The left hemisphere re-presents it as mechanical, static, generic, and manipulable. Both views are necessary, but the living view must come first. A world seen only through the left becomes dead, fragmented, commodified.',
    practicalApplication: 'Practice seeing the world as alive. Trees aren\'t "resources," they\'re beings. Your body isn\'t a machine, it\'s a living process. People aren\'t categories, they\'re unique presences. Notice when you\'re treating things (including yourself) mechanically. Return to experiencing the living quality.',
    hemisphere: 'right',
    relatedConcepts: ['betweenness', 'flow-vs-static', 'phenomenology'],
    elements: ['water', 'earth', 'aether'],
    phases: ['presence', 'harmony', 'unity'],
    ontologyTags: ['animism', 'phenomenology', 'ecology', 'sacred-world']
  },

  {
    id: 'flow-vs-static',
    concept: 'Flow and Process vs. Static and Fixed',
    explanation: 'The right hemisphere sees process, becoming, flow—like a river. The left sees products, being, stasis—like a snapshot. Both are needed. The left\'s static view allows us to grasp and use things. But reality is fundamentally flowing. When we mistake the map (static) for territory (flowing), we lose touch with life itself.',
    practicalApplication: 'Notice when you\'re treating dynamic realities as static. Your self isn\'t fixed—it\'s a process. Relationships aren\'t states—they\'re flows. Ideas aren\'t possessions—they\'re currents. Ask: "What\'s flowing here?" instead of "What is this thing?"',
    hemisphere: 'right',
    relatedConcepts: ['living-world', 'betweenness', 'embodied-being'],
    elements: ['water', 'air', 'aether'],
    phases: ['transformation', 'harmony', 'flow'],
    ontologyTags: ['process-philosophy', 'becoming', 'impermanence', 'flux']
  },

  {
    id: 'whole-prior-to-parts',
    concept: 'The Whole is Prior to the Parts',
    explanation: 'The right hemisphere grasps wholes first. Understanding flows from whole → parts, not parts → whole. You can\'t build a face from features—you see the face, then notice features. The left reverses this, trying to construct wholes from parts. This is useful for manipulation but misses how understanding actually works.',
    practicalApplication: 'When learning or creating, start with the whole. Don\'t try to master every detail before you get the big picture—that\'s backwards. Get the gestalt first, then refine. In conversation, sense the whole person before analyzing their words. In systems, feel the field before dissecting components.',
    hemisphere: 'right',
    relatedConcepts: ['betweenness', 'context-over-content', 'gestalt-perception'],
    elements: ['aether', 'air'],
    phases: ['integration', 'unity', 'wholeness'],
    ontologyTags: ['holism', 'gestalt', 'systems-thinking', 'emergence']
  },

  {
    id: 'context-over-content',
    concept: 'Context Matters More Than Content',
    explanation: 'The right hemisphere is attuned to context—tone, setting, relationships, what\'s unsaid. The left focuses on content—words, facts, explicit meaning. But context determines meaning. "I love you" can mean radically different things depending on context. A culture obsessed with content (data, facts, rules) loses wisdom, which is always contextual.',
    practicalApplication: 'Before responding to words, sense the context. What\'s the tone? The relationship? The situation? Don\'t just hear what\'s said—feel what\'s meant. In your own communication, remember context shapes everything. A truth in one context can be false in another.',
    hemisphere: 'right',
    relatedConcepts: ['betweenness', 'phenomenology', 'implicit-knowledge'],
    elements: ['water', 'air', 'aether'],
    phases: ['awareness', 'integration', 'wisdom'],
    ontologyTags: ['context-sensitivity', 'situational-awareness', 'wisdom', 'nuance']
  },

  {
    id: 'return-to-master',
    concept: 'The Return to the Master',
    explanation: 'In a three-phase process, the right hemisphere first presents the world whole and alive. The left then analyzes, categorizes, makes it useful. Finally, we must return to the right, which re-integrates the left\'s work into the living whole. But modern culture often stops at phase two—trapped in the Emissary\'s fragmented world.',
    practicalApplication: 'After analyzing something, always return to the whole. After detailed work, step back and see the big picture. After using tools and techniques, reconnect with living purpose. The pattern: Experience → Analyze → Re-integrate. Don\'t get stuck in the middle phase.',
    hemisphere: 'return',
    relatedConcepts: ['master-emissary-relationship', 'integration-phase', 'transcendence'],
    elements: ['aether', 'fire', 'water'],
    phases: ['integration', 'completion', 'transcendence'],
    ontologyTags: ['integration', 'transcendence', 'completion', 'return']
  },

  {
    id: 'divided-world',
    concept: 'The Divided Brain Creates a Divided World',
    explanation: 'How we attend shapes what comes into being. A left-hemisphere-dominant culture creates fragmentation: self vs. other, mind vs. body, human vs. nature, sacred vs. profane. These divisions aren\'t "out there"—they\'re projections of divided attention. A balanced culture would experience seamless wholes.',
    practicalApplication: 'Notice where you experience division and ask: Is this real, or a product of how I\'m attending? The division between "work" and "life"? Between "thinking" and "feeling"? Between "spiritual" and "mundane"? Many divisions dissolve when you shift to whole-seeing.',
    hemisphere: 'left',
    relatedConcepts: ['two-attention-modes', 'master-emissary-relationship', 'fragmentation'],
    elements: ['air', 'fire'],
    phases: ['chaos', 'fragmentation', 'division'],
    ontologyTags: ['fragmentation', 'duality', 'separation', 'cultural-critique']
  },

  {
    id: 'embodied-being',
    concept: 'Embodied Being in the World',
    explanation: 'The right hemisphere knows we are embodied beings embedded in a world, not detached observers. We don\'t view the world from outside—we\'re part of it. The left creates the illusion of a separated, disembodied viewpoint. But all knowledge is embodied, situated, participatory. We know by being in relationship, not by standing apart.',
    practicalApplication: 'Remember you\'re always already in the world, not observing from outside. Your body is your primary way of knowing. Before thinking about something, feel it. Before analyzing a situation, inhabit it. Trust embodied knowing—gut feelings, physical sensations, intuitions.',
    hemisphere: 'right',
    relatedConcepts: ['phenomenology', 'betweenness', 'living-world'],
    elements: ['earth', 'water', 'aether'],
    phases: ['grounding', 'presence', 'embodiment'],
    ontologyTags: ['embodiment', 'phenomenology', 'participation', 'somatic-knowing']
  },

  {
    id: 'metaphor-primacy',
    concept: 'The Primacy of Metaphor',
    explanation: 'The right hemisphere thinks in metaphor, the left in literal categories. But metaphor isn\'t decorative—it\'s how we understand anything new. All language began as metaphor. Abstract thought depends on metaphorical mapping from bodily experience. When we lose metaphor, we lose the capacity to see connections and create new meaning.',
    practicalApplication: 'Practice thinking metaphorically. Instead of defining things rigidly, ask "What is this like?" Use your body as a metaphor for understanding abstract concepts. Notice how the best insights often come as images or metaphors, not as logical propositions.',
    hemisphere: 'right',
    relatedConcepts: ['embodied-being', 'betweenness', 'meaning-making'],
    elements: ['air', 'water', 'aether'],
    phases: ['creativity', 'integration', 'wisdom'],
    ontologyTags: ['metaphor', 'meaning-making', 'creativity', 'poetry']
  },

  {
    id: 'reciprocity-mutual-influence',
    concept: 'Reciprocity and Mutual Influence',
    explanation: 'The right hemisphere understands that all things mutually influence each other. There are no one-way causal chains. Observer and observed co-create. Self and other co-arise. Every relationship is reciprocal. The left sees linear causation: A causes B. But reality is circular, reciprocal, mutually creating.',
    practicalApplication: 'Look for reciprocity in all relationships. You shape others as they shape you. Your attention to something changes it. The question you ask determines the answer. In conflicts, recognize you\'re co-creating the dynamic. In systems, trace feedback loops, not linear causes.',
    hemisphere: 'right',
    relatedConcepts: ['betweenness', 'living-world', 'co-creation'],
    elements: ['water', 'aether', 'air'],
    phases: ['collaboration', 'integration', 'harmony'],
    ontologyTags: ['reciprocity', 'co-creation', 'feedback', 'mutual-causation']
  },

  {
    id: 'implicit-knowledge',
    concept: 'Implicit Knowledge vs. Explicit',
    explanation: 'The right hemisphere holds vast implicit knowledge—skills, intuitions, meanings we can\'t articulate. The left makes knowledge explicit—rules, facts, formulas. But only a tiny fraction of what we know can be made explicit. Overvaluing explicit knowledge (the Emissary\'s domain) means ignoring most of what we actually know.',
    practicalApplication: 'Trust what you know implicitly—the sense something is right or wrong even if you can\'t say why. Not everything needs to be articulated or proven. Sometimes explanations destroy understanding. Honor tacit knowledge: skills that can\'t be taught through rules, wisdom that can\'t be captured in words.',
    hemisphere: 'right',
    relatedConcepts: ['embodied-being', 'context-over-content', 'intuition'],
    elements: ['water', 'aether'],
    phases: ['wisdom', 'integration', 'knowing'],
    ontologyTags: ['tacit-knowledge', 'intuition', 'skill', 'wisdom']
  },

  {
    id: 'uniqueness-vs-generality',
    concept: 'The Unique vs. The General',
    explanation: 'The right hemisphere sees each thing as unique, irreplaceable, particular. The left sees instances of categories, replaceability, generality. Both are needed. Science requires generality. But a person, a moment, a work of art is unique. A culture dominated by the left treats everything as interchangeable. We lose the sacred, the unrepeatable, the particular.',
    practicalApplication: 'Practice seeing uniqueness. This isn\'t "a tree," it\'s this particular tree. Not "a person," but this irreplaceable individual. Not "a moment like others," but this unrepeatable now. Recognizing uniqueness restores reverence and attention.',
    hemisphere: 'right',
    relatedConcepts: ['living-world', 'sacred-experience', 'phenomenology'],
    elements: ['water', 'earth', 'aether'],
    phases: ['presence', 'reverence', 'sacred'],
    ontologyTags: ['uniqueness', 'particularity', 'sacred', 'irreplaceable']
  },

  {
    id: 'phenomenology',
    concept: 'Phenomenology: Return to Direct Experience',
    explanation: 'The right hemisphere experiences phenomena directly—the way things show up before we categorize them. The left interprets, labels, theories. Phenomenology means returning to direct experience, bracketing our concepts and theories. "What is it like to experience this?" This is the Master\'s wisdom—trust the showing before the explaining.',
    practicalApplication: 'Before analyzing or labeling an experience, just be with it. "What is this actually like?" Don\'t rush to categorize feelings, sensations, encounters. Let things reveal themselves on their own terms. This is especially powerful with difficult emotions—experience them phenomenologically before trying to fix or explain them.',
    hemisphere: 'right',
    relatedConcepts: ['embodied-being', 'living-world', 'presence'],
    elements: ['water', 'aether'],
    phases: ['presence', 'awareness', 'openness'],
    ontologyTags: ['phenomenology', 'direct-experience', 'presence', 'revelation']
  }
];

/**
 * McGilchrist Quotes
 */
export const MCGILCHRIST_QUOTES = [
  {
    id: 'mcg-1',
    text: 'The kind of attention we bring to bear on the world changes the nature of the world we attend to.',
    source: 'The Master and His Emissary',
    conceptId: 'two-attention-modes'
  },
  {
    id: 'mcg-2',
    text: 'The right hemisphere presents the world as living, new, interconnected, and whole. The left hemisphere re-presents it as static, familiar, fragmented, and lifeless.',
    source: 'The Master and His Emissary',
    conceptId: 'living-world'
  },
  {
    id: 'mcg-3',
    text: 'Betweenness is the primary reality. Things exist only in relation.',
    source: 'The Matter with Things',
    conceptId: 'betweenness'
  },
  {
    id: 'mcg-4',
    text: 'The Master is betrayed by the Emissary. The left hemisphere, which should serve the right, has usurped its role.',
    source: 'The Master and His Emissary',
    conceptId: 'master-emissary-relationship'
  },
  {
    id: 'mcg-5',
    text: 'The whole is not made up of parts. The parts are abstractions from the whole.',
    source: 'The Matter with Things',
    conceptId: 'whole-prior-to-parts'
  },
  {
    id: 'mcg-6',
    text: 'We are not detached observers of the world. We are participants in it, and it in us.',
    source: 'The Matter with Things',
    conceptId: 'embodied-being'
  },
  {
    id: 'mcg-7',
    text: 'All understanding is metaphorical. We understand the new in terms of the known, the abstract in terms of the embodied.',
    source: 'The Master and His Emissary',
    conceptId: 'metaphor-primacy'
  },
  {
    id: 'mcg-8',
    text: 'Context is not an add-on to content. It is prior to it and determines its meaning.',
    source: 'The Matter with Things',
    conceptId: 'context-over-content'
  },
  {
    id: 'mcg-9',
    text: 'The left hemisphere is the hemisphere of what is familiar and known. The right is the hemisphere of the new and living.',
    source: 'The Master and His Emissary',
    conceptId: 'living-world'
  },
  {
    id: 'mcg-10',
    text: 'Reality is not static but flowing, not fixed but becoming. Process is prior to product.',
    source: 'The Matter with Things',
    conceptId: 'flow-vs-static'
  },
  {
    id: 'mcg-11',
    text: 'The return to the Master is essential. After the left hemisphere has done its work, we must reintegrate with the right.',
    source: 'The Master and His Emissary',
    conceptId: 'return-to-master'
  },
  {
    id: 'mcg-12',
    text: 'We don\'t just see the world differently depending on which hemisphere is dominant. The world actually is different.',
    source: 'The Master and His Emissary',
    conceptId: 'divided-world'
  },
  {
    id: 'mcg-13',
    text: 'Implicit knowledge vastly exceeds explicit knowledge. Most of what we know, we cannot say.',
    source: 'The Matter with Things',
    conceptId: 'implicit-knowledge'
  },
  {
    id: 'mcg-14',
    text: 'Each thing is unique and irreplaceable. The left hemisphere\'s world of generalities misses the sacred particularity of existence.',
    source: 'The Matter with Things',
    conceptId: 'uniqueness-vs-generality'
  },
  {
    id: 'mcg-15',
    text: 'All causation is reciprocal. There are no one-way streets in the world of the right hemisphere.',
    source: 'The Matter with Things',
    conceptId: 'reciprocity-mutual-influence'
  }
];

/**
 * Helper functions
 */
export function getMcGilchristConcept(id: string): McGilchristConcept | undefined {
  return MCGILCHRIST_CONCEPTS.find(c => c.id === id);
}

export function getConceptsByHemisphere(hemisphere: 'right' | 'left' | 'both' | 'return'): McGilchristConcept[] {
  return MCGILCHRIST_CONCEPTS.filter(c => c.hemisphere === hemisphere);
}

export function getConceptsByElement(element: Element): McGilchristConcept[] {
  return MCGILCHRIST_CONCEPTS.filter(c => c.elements.includes(element));
}

export function getConceptsByPhase(phase: SpiralPhase): McGilchristConcept[] {
  return MCGILCHRIST_CONCEPTS.filter(c => c.phases.includes(phase));
}

/**
 * Hemispheric Balance Assessment
 */
export interface HemisphericBalance {
  dominantHemisphere: 'right' | 'left' | 'balanced';
  balanceScore: number; // 0-1, where 0.5 is perfect balance
  rightHemisphereStrength: number; // 0-1
  leftHemisphereStrength: number; // 0-1
  recommendations: string[];
}

export function assessHemisphericBalance(indicators: {
  seeingWholes?: boolean; // RH
  seeingParts?: boolean; // LH
  relationshipFocus?: boolean; // RH
  objectFocus?: boolean; // LH
  contextSensitive?: boolean; // RH
  contentFocused?: boolean; // LH
  metaphoricalThinking?: boolean; // RH
  literalThinking?: boolean; // LH
  flowOriented?: boolean; // RH
  staticOriented?: boolean; // LH
}): HemisphericBalance {
  let rightScore = 0;
  let leftScore = 0;
  let totalIndicators = 0;

  // Right hemisphere indicators
  if (indicators.seeingWholes !== undefined) {
    rightScore += indicators.seeingWholes ? 1 : 0;
    totalIndicators++;
  }
  if (indicators.relationshipFocus !== undefined) {
    rightScore += indicators.relationshipFocus ? 1 : 0;
    totalIndicators++;
  }
  if (indicators.contextSensitive !== undefined) {
    rightScore += indicators.contextSensitive ? 1 : 0;
    totalIndicators++;
  }
  if (indicators.metaphoricalThinking !== undefined) {
    rightScore += indicators.metaphoricalThinking ? 1 : 0;
    totalIndicators++;
  }
  if (indicators.flowOriented !== undefined) {
    rightScore += indicators.flowOriented ? 1 : 0;
    totalIndicators++;
  }

  // Left hemisphere indicators
  if (indicators.seeingParts !== undefined) {
    leftScore += indicators.seeingParts ? 1 : 0;
    totalIndicators++;
  }
  if (indicators.objectFocus !== undefined) {
    leftScore += indicators.objectFocus ? 1 : 0;
    totalIndicators++;
  }
  if (indicators.contentFocused !== undefined) {
    leftScore += indicators.contentFocused ? 1 : 0;
    totalIndicators++;
  }
  if (indicators.literalThinking !== undefined) {
    leftScore += indicators.literalThinking ? 1 : 0;
    totalIndicators++;
  }
  if (indicators.staticOriented !== undefined) {
    leftScore += indicators.staticOriented ? 1 : 0;
    totalIndicators++;
  }

  const rightHemisphereStrength = rightScore / (totalIndicators / 2);
  const leftHemisphereStrength = leftScore / (totalIndicators / 2);
  const balanceScore = 1 - Math.abs(rightHemisphereStrength - leftHemisphereStrength);

  let dominantHemisphere: 'right' | 'left' | 'balanced' = 'balanced';
  if (rightHemisphereStrength > leftHemisphereStrength + 0.2) {
    dominantHemisphere = 'right';
  } else if (leftHemisphereStrength > rightHemisphereStrength + 0.2) {
    dominantHemisphere = 'left';
  }

  const recommendations: string[] = [];

  if (dominantHemisphere === 'left') {
    recommendations.push('Practice broad, open awareness');
    recommendations.push('Spend time in nature without analyzing');
    recommendations.push('Focus on relationships over objects');
    recommendations.push('Trust implicit knowledge and intuition');
    recommendations.push('See wholes before parts');
  } else if (dominantHemisphere === 'right') {
    recommendations.push('Bring some analytical clarity to intuitions');
    recommendations.push('Make implicit knowledge explicit when useful');
    recommendations.push('Use categorization as a tool (not a prison)');
    recommendations.push('Practice focused attention on details');
  } else {
    recommendations.push('Maintain this beautiful balance');
    recommendations.push('Remember the Master-Emissary relationship');
    recommendations.push('Let the right guide, the left serve');
  }

  return {
    dominantHemisphere,
    balanceScore,
    rightHemisphereStrength,
    leftHemisphereStrength,
    recommendations
  };
}
