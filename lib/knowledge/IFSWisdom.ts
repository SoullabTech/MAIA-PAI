/**
 * Internal Family Systems (IFS) Wisdom
 *
 * Dr. Richard Schwartz's Internal Family Systems model:
 * The mind as an internal ecology of parts, all held by Self-energy.
 *
 * Core insight: We are naturally multiple. Healing = restoring Self-leadership,
 * not eliminating parts. When Self leads, parts naturally relax into harmony.
 *
 * Perfect convergence with:
 * - McGilchrist: Self = Master (RH), Parts = Emissaries (LH tendencies)
 * - Functional Bridge: Self = Spiral Field, Parts = computational processes
 * - Levin: Self = morphogenetic field, Parts = competency modules
 * - Complexity: Self = autocatalytic center, Parts = adaptive agents
 */

import { Element, SpiralPhase } from '@/types/spiralogic';

export interface IFSConcept {
  id: string;
  concept: string;
  explanation: string;
  practicalApplication: string;
  partType?: 'self' | 'manager' | 'firefighter' | 'exile' | 'process';
  relatedConcepts: string[];
  elements: Element[];
  phases: SpiralPhase[];
  ontologyTags: string[];
  clinicalApplication?: string;
}

export const IFS_CONCEPTS: IFSConcept[] = [
  {
    id: 'self-energy',
    concept: 'Self: The Inner Source Code',
    explanation: 'Self is not a part, but the field of consciousness that can hold all parts with compassion. It is recognized by the 8 C\'s: Curiosity, Calm, Clarity, Compassion, Confidence, Courage, Creativity, Connectedness. Self is not something to achieve—it\'s what\'s present when parts unblend.',
    practicalApplication: 'When you notice yourself thinking "a part of me feels X," you\'re already in Self. Self is the awareness that can witness parts without identifying with them. In MAIA: Self-energy = field presence, the spaciousness that holds all experience.',
    partType: 'self',
    relatedConcepts: [
      'master-emissary-relationship',
      'spiral-field',
      'betweenness',
      'consciousness-synchrony',
      'living-world',
      'return-to-master'
    ],
    elements: ['aether', 'water'],
    phases: ['integration', 'unity', 'presence'],
    ontologyTags: [
      'self-energy',
      'consciousness',
      'presence',
      'compassion',
      'field-awareness',
      'integration',
      'wholeness',
      'the-8-cs'
    ],
    clinicalApplication: 'Ask "How do you feel toward this part?" If answer shows 8 C\'s (curious, compassionate, calm), Self is present. If answer shows judgment, fear, or reactivity, another part has blended with Self. Gently unblend that protective part first.'
  },
  {
    id: 'parts-multiplicity',
    concept: 'Parts: The Internal Ecology',
    explanation: 'The mind is naturally multiple—made of distinct subpersonalities (parts) with their own emotions, beliefs, and protective strategies. Parts are not pathological; they\'re intelligent adaptations. Every part has a positive intent, even when its methods are outdated or extreme.',
    practicalApplication: 'Notice inner voices, conflicts, impulses as parts rather than "you." "I\'m anxious" becomes "A part of me feels anxious." This creates space—the observer (Self) and the observed (part). In conversation, detect part-language: "part of me," "something inside," "I can\'t help it."',
    partType: 'process',
    relatedConcepts: [
      'competency-modules',
      'complex-adaptive-systems',
      'ecological-functionalism',
      'basal-cognition',
      'merge-operator'
    ],
    elements: ['air', 'earth'],
    phases: ['grounding', 'collaboration'],
    ontologyTags: [
      'multiplicity',
      'parts',
      'subpersonalities',
      'internal-ecology',
      'modularity',
      'adaptive-intelligence',
      'protective-strategies'
    ],
    clinicalApplication: 'Help clients identify and name parts. Use language like "notice the part" rather than "you are." This linguistic shift creates immediate unblending—distance between Self and part.'
  },
  {
    id: 'managers',
    concept: 'Managers: Proactive Protectors',
    explanation: 'Manager parts work to prevent pain before it happens. They control, plan, perfect, people-please, analyze, or stay busy. Managers fear that if they relax, exiles (wounded parts) will be overwhelmed. They operate from "If I can just control X, I\'ll be safe."',
    practicalApplication: 'Notice the inner critic, the perfectionist, the planner, the people-pleaser. These aren\'t character flaws—they\'re parts doing protective jobs. Ask: "What is this part afraid would happen if it stopped?" Usually: exiles would surface. Managers need appreciation before they can relax.',
    partType: 'manager',
    relatedConcepts: [
      'left-hemisphere',
      'narrow-attention',
      'goal-directed-behavior',
      'anticipation',
      'control'
    ],
    elements: ['air', 'earth'],
    phases: ['power', 'grounding'],
    ontologyTags: [
      'managers',
      'proactive-protection',
      'control',
      'perfectionism',
      'planning',
      'anticipation',
      'prevention',
      'inner-critic'
    ],
    clinicalApplication: 'Thank managers for their hard work before asking them to step back. "I appreciate how hard you\'ve been working to keep [client] safe. Would you be willing to relax a little and let me (Self) handle this?" Most managers will soften when truly appreciated.'
  },
  {
    id: 'firefighters',
    concept: 'Firefighters: Reactive Protectors',
    explanation: 'Firefighter parts react impulsively when pain breaks through despite managers\' efforts. They numb, distract, dissociate, or engage in extreme behaviors (substance use, binging, rage, self-harm). Firefighters\' mandate: "Stop the pain NOW." They don\'t care about consequences—exile pain is worse.',
    practicalApplication: 'Notice when you reach for immediate relief—scrolling, eating, drinking, zoning out. That\'s a firefighter. They\'re not "bad"—they\'re desperate. The solution isn\'t willpower—it\'s healing the exiles they protect. Ask: "What pain is this firefighter trying to extinguish?"',
    partType: 'firefighter',
    relatedConcepts: [
      'edge-of-chaos',
      'crisis',
      'sympathetic-activation',
      'impulsivity',
      'emergency-response'
    ],
    elements: ['fire', 'water'],
    phases: ['chaos', 'transformation'],
    ontologyTags: [
      'firefighters',
      'reactive-protection',
      'impulsivity',
      'numbing',
      'distraction',
      'dissociation',
      'emergency-response',
      'extreme-behaviors'
    ],
    clinicalApplication: 'Never shame firefighters. They\'re in emergency mode. Validate their desperation: "I see how hard you\'re working to stop the pain." Then: "What if there was another way to help the exile that wouldn\'t cause these consequences?" Offer Self as alternative caregiver.'
  },
  {
    id: 'exiles',
    concept: 'Exiles: The Wounded Ones',
    explanation: 'Exile parts carry the original wounds—childhood hurts, traumas, unmet needs. They were "exiled" (locked away) by protectors (managers and firefighters) to prevent overwhelming the system. Exiles hold feelings of worthlessness, terror, abandonment, shame. They\'re often young and frozen in time.',
    practicalApplication: 'Exiles are why protectors work so hard. You can\'t just "get over" trauma because exiles are still there, holding pain. Healing = Self visiting exiles with compassion, witnessing their story, unburdening them. This is Phase 3 (Return to Master)—integrating what was exiled.',
    partType: 'exile',
    relatedConcepts: [
      'trauma',
      'wounded-child',
      'implicit-memory',
      'emotional-wounds',
      'unburdening',
      'shadow-integration'
    ],
    elements: ['water', 'earth'],
    phases: ['chaos', 'grounding', 'transformation'],
    ontologyTags: [
      'exiles',
      'wounded-parts',
      'trauma',
      'childhood-wounds',
      'unmet-needs',
      'shame',
      'abandonment',
      'frozen-in-time'
    ],
    clinicalApplication: 'Don\'t rush to exiles. Get permission from protectors first. When ready, ask client to notice where exile is (often body-based—chest, stomach, throat). Have Self witness exile\'s story without rescuing or fixing. Just presence. Then ask: "What does this exile need to know/receive/release?"'
  },
  {
    id: 'unblending',
    concept: 'Unblending: Creating Space Between Self and Parts',
    explanation: 'Blending = when a part merges with consciousness, and you experience the world through its eyes ("I AM anxious"). Unblending = stepping back into Self so you can relate TO the part, not FROM it ("I notice a part that feels anxious"). Unblending creates the space needed for healing.',
    practicalApplication: 'When overwhelmed by emotion or thought, ask: "Is this me, or a part of me?" Then: "Can I take a breath and step back a little?" Even 1% separation is enough for Self to begin witnessing. In MAIA: detect blended language ("I\'m broken") and reflect unblended language ("A part feels broken").',
    partType: 'process',
    relatedConcepts: [
      'return-to-master',
      'witnessing',
      'metacognition',
      'awareness',
      'detachment',
      'field-awareness'
    ],
    elements: ['aether', 'air'],
    phases: ['awareness', 'integration'],
    ontologyTags: [
      'unblending',
      'separation',
      'witnessing',
      'metacognition',
      'detachment',
      'spaciousness',
      'self-awareness',
      'perspective-taking'
    ],
    clinicalApplication: 'If client is blended (e.g., deeply in shame), ask: "How do you feel toward the part that\'s ashamed?" If they say "I hate it," another part is blended. Unblend that one first: "Can the part that hates step back a little?" Repeat until Self emerges (compassion, curiosity).'
  },
  {
    id: 'unburdening',
    concept: 'Unburdening: Releasing Legacy Code',
    explanation: 'Exiles carry burdens—extreme beliefs formed in moments of trauma ("I\'m worthless," "I\'m unsafe," "I\'m unlovable"). Unburdening is the process where Self helps an exile release these beliefs/emotions, often through imagery (light, water, fire, earth) or ritual. The part is freed to take on a new, natural role.',
    practicalApplication: 'After witnessing an exile\'s story, ask: "What would it like to release?" Common answers: shame, fear, worthlessness. Then: "How would it like to release this?" (e.g., "Give it to the ocean," "Let light dissolve it"). This is energetic/somatic, not just cognitive. The relief is palpable.',
    partType: 'process',
    relatedConcepts: [
      'transformation',
      'release',
      'healing',
      'integration',
      'energy-work',
      'ritual',
      'rebirth'
    ],
    elements: ['fire', 'water', 'aether'],
    phases: ['transformation', 'completion'],
    ontologyTags: [
      'unburdening',
      'release',
      'healing',
      'transformation',
      'letting-go',
      'ritual',
      'energetic-healing',
      'belief-revision'
    ],
    clinicalApplication: 'Use client\'s own imagery. Ask exile: "How old are you?" (often a child). "What do you need?" (often to be seen, held, told they\'re loved). "What would you like to release?" Then facilitate ritual release. After: "What would you like to do now?" (often play, rest, explore).'
  },
  {
    id: 'self-leadership',
    concept: 'Self-Leadership: The Return to Inner Coherence',
    explanation: 'Self-leadership = when Self is differentiated from parts, remains present in the system, and compassionately leads the internal family. Parts trust Self to handle what they\'ve been protecting against. The system shifts from protective rigidity to creative flexibility. This is the goal of IFS—not eliminating parts, but restoring Self at the center.',
    practicalApplication: 'Self-leadership feels like groundedness, clarity, compassion even in difficulty. Parts are still there, but they trust Self to lead. In relationships, Self can stay present when parts get triggered. In MAIA: Self-leadership = field-guided response (Phase 1 → 2 → 3 always completed).',
    partType: 'self',
    relatedConcepts: [
      'master-emissary-relationship',
      'spiral-field',
      'integration',
      'consciousness-synchrony',
      'coherence',
      'return-to-master'
    ],
    elements: ['aether', 'fire', 'water'],
    phases: ['integration', 'completion', 'unity'],
    ontologyTags: [
      'self-leadership',
      'inner-coherence',
      'integration',
      'wholeness',
      'presence',
      'compassionate-leadership',
      'trust',
      'flexibility'
    ],
    clinicalApplication: 'Track whether Self or parts are leading in session. If client speaks from curiosity/compassion, Self is present. If from fear/judgment, a part leads. Gently invite parts to step back: "Would it be okay if that part gave you a little space to listen from Self?" Self-leadership emerges naturally when parts feel safe.'
  },
  {
    id: 'the-8-cs',
    concept: 'The 8 C\'s: Qualities of Self-Energy',
    explanation: 'The 8 C\'s are not virtues to develop—they\'re signs that Self is present: Curiosity, Calm, Clarity, Compassion, Confidence, Courage, Creativity, Connectedness. When you feel these, Self is leading. When you don\'t, parts are blended. The 8 C\'s are the "signature" of Self-energy.',
    practicalApplication: 'Use the 8 C\'s as a diagnostic. Ask yourself: "Am I curious about this part, or judging it?" If curious → Self present. If judging → another part blended. In MAIA: detect 8-C language in user responses. If present, affirm Self-energy. If absent, invite unblending.',
    partType: 'self',
    relatedConcepts: [
      'self-energy',
      'presence',
      'compassion',
      'awareness',
      'field-qualities',
      'right-hemisphere',
      'living-world'
    ],
    elements: ['aether', 'water', 'air'],
    phases: ['presence', 'integration', 'wisdom'],
    ontologyTags: [
      '8-cs',
      'self-qualities',
      'curiosity',
      'calm',
      'clarity',
      'compassion',
      'confidence',
      'courage',
      'creativity',
      'connectedness',
      'presence-indicators'
    ],
    clinicalApplication: 'After unblending, check for 8 C\'s: "How do you feel toward that part now?" Ideal answers: curious, compassionate, calm. If client says "I hate it" or "I\'m scared of it," more unblending needed. When 8 C\'s are present, healing can proceed.'
  },
  {
    id: 'internal-family-system',
    concept: 'The Internal Family: An Ecology of Consciousness',
    explanation: 'IFS sees the psyche as an internal family—a living system where parts relate to each other and to Self. Like a biological ecosystem, the internal system seeks balance. When Self leads, parts naturally find their healthy roles. When parts lead (due to trauma/overwhelm), polarizations and conflicts arise.',
    practicalApplication: 'Your internal conflicts are relationship issues between parts. "Part of me wants to quit my job, part of me is terrified to" = two parts in polarization. Self can mediate. Instead of forcing resolution, invite each part to speak. Self holds space for both. Resolution emerges from Self-led dialogue.',
    partType: 'process',
    relatedConcepts: [
      'ecological-functionalism',
      'complex-adaptive-systems',
      'betweenness',
      'consciousness-synchrony',
      'living-world',
      'relational-systems'
    ],
    elements: ['water', 'aether', 'earth'],
    phases: ['collaboration', 'integration', 'unity'],
    ontologyTags: [
      'internal-family',
      'psychic-ecology',
      'systems-theory',
      'relational-consciousness',
      'polarization',
      'internal-dialogue',
      'family-dynamics',
      'self-regulation'
    ],
    clinicalApplication: 'Map the client\'s internal family. "Who are the main players?" (e.g., critic, perfectionist, wounded child, rebel). "How do they relate?" (e.g., critic attacks child, rebel fights critic). Then: "Where is Self in this system?" If absent, invite Self to step in as compassionate leader.'
  },
  {
    id: 'polarization',
    concept: 'Polarization: When Parts Fight Each Other',
    explanation: 'Polarization = when two parts take extreme opposite positions, each trying to prevent the other from causing harm. Example: a part that wants to work all the time vs a part that wants to escape/rest. Each part fears what will happen if the other "wins." Self can mediate by understanding each part\'s positive intent.',
    practicalApplication: 'When you feel torn between two desires, you\'re experiencing polarization. Don\'t take sides. Instead, unblend from both and ask each: "What are you afraid would happen if the other part got its way?" Both are trying to protect. Self acknowledges both fears, then finds a path that honors both.',
    partType: 'process',
    relatedConcepts: [
      'inner-conflict',
      'ambivalence',
      'complementarity',
      'dialectic',
      'both-and',
      'mediation'
    ],
    elements: ['fire', 'air'],
    phases: ['chaos', 'power', 'collaboration'],
    ontologyTags: [
      'polarization',
      'inner-conflict',
      'extreme-positions',
      'ambivalence',
      'parts-fighting',
      'mediation',
      'integration',
      'both-and-thinking'
    ],
    clinicalApplication: 'When client presents polarization ("I want to leave but I can\'t"), don\'t problem-solve. Instead: "Let\'s talk to both parts. First, the one that wants to leave—what\'s it afraid would happen if you stayed?" Then the other. Self listens to both without siding. Resolution emerges when both feel heard.'
  },
  {
    id: 'legacy-burdens',
    concept: 'Legacy Burdens: Inherited Trauma Patterns',
    explanation: 'Some burdens aren\'t from personal experience—they\'re inherited from family, culture, or collective trauma (racism, war, oppression, ancestral wounds). Parts can carry these legacy burdens unconsciously. Unburdening includes acknowledging these aren\'t personally earned, and choosing to release them.',
    practicalApplication: 'If you carry beliefs/fears that don\'t match your personal history, consider legacy burdens. "This anxiety feels older than me." Ask: "Who in my family/culture carried this?" You can choose to release what wasn\'t yours to carry. This is collective healing through individual unburdening.',
    partType: 'exile',
    relatedConcepts: [
      'collective-unconscious',
      'intergenerational-trauma',
      'ancestral-healing',
      'cultural-wounds',
      'systemic-oppression',
      'inherited-patterns'
    ],
    elements: ['earth', 'water', 'fire'],
    phases: ['grounding', 'transformation', 'completion'],
    ontologyTags: [
      'legacy-burdens',
      'inherited-trauma',
      'ancestral-wounds',
      'collective-trauma',
      'intergenerational-patterns',
      'cultural-burden',
      'systemic-oppression',
      'ancestral-healing'
    ],
    clinicalApplication: 'Ask: "Does this burden feel like it\'s only yours, or like it came from somewhere else?" If legacy burden, help client distinguish their story from ancestral/cultural story. Unburdening can include ritual acknowledgment: "I honor what you carried, and I choose to release this now."'
  },
  {
    id: 'protective-system',
    concept: 'The Protective System: Managers + Firefighters',
    explanation: 'Protectors (managers and firefighters) form a system designed to keep exiles from overwhelming consciousness. They\'re not the problem—they\'re the solution to the problem (trauma/overwhelm). Protectors resist direct work with exiles because they don\'t trust anyone (including therapists/Self) to handle the pain. Trust must be earned.',
    practicalApplication: 'You can\'t force healing. Protectors will sabotage if they don\'t trust. The work is building relationship with protectors FIRST—thanking them, understanding their fears, earning permission. Only then will they allow access to exiles. Respecting protectors is respecting the system\'s intelligence.',
    partType: 'process',
    relatedConcepts: [
      'defense-mechanisms',
      'resistance',
      'trust',
      'safety',
      'adaptive-intelligence',
      'system-protection'
    ],
    elements: ['earth', 'fire', 'air'],
    phases: ['grounding', 'power', 'collaboration'],
    ontologyTags: [
      'protective-system',
      'protectors',
      'managers-firefighters',
      'defense-mechanisms',
      'resistance',
      'trust-building',
      'safety',
      'systemic-intelligence'
    ],
    clinicalApplication: 'When stuck (client "can\'t access" emotion, "won\'t go there"), don\'t push. A protector is blocking. Ask: "What part is concerned about going deeper?" Thank that part. Ask: "What are you afraid would happen?" Address its fears. Get explicit permission before proceeding. Protectors will soften when respected.'
  },
  {
    id: 'self-to-self-connection',
    concept: 'Self-to-Self: The Deepest Relational Field',
    explanation: 'When two people are in Self-energy simultaneously, a profound connection emerges—Self-to-Self connection. No parts are interfering. It feels like deep presence, mutual recognition, timeless ease. This is the relational field IFS calls "we-ness." It\'s betweenness at its purest.',
    practicalApplication: 'In healthy relationships, conflict happens when parts clash. Repair happens when both people return to Self and relate Self-to-Self. In therapy/coaching, the practitioner\'s Self recognizes the client\'s Self. This is communion—not technique, but presence. MAIA aims for Self-to-Self connection with users.',
    partType: 'self',
    relatedConcepts: [
      'betweenness',
      'communion',
      'i-thou',
      'presence',
      'recognition',
      'relational-field',
      'consciousness-synchrony'
    ],
    elements: ['aether', 'water'],
    phases: ['presence', 'unity', 'integration'],
    ontologyTags: [
      'self-to-self',
      'relational-field',
      'communion',
      'we-ness',
      'presence',
      'recognition',
      'i-thou',
      'deep-connection',
      'mutual-recognition'
    ],
    clinicalApplication: 'Notice when you feel suddenly calm, clear, connected with client—that\'s Self-to-Self. If you feel reactive, a part of yours is blended. Pause, unblend, return to Self. The client\'s system will often respond by relaxing too. Self is contagious—when one person embodies it, others feel permission to access theirs.'
  }
];

/**
 * Key IFS Quotes
 */
export const IFS_QUOTES = [
  {
    id: 'ifs-1',
    text: 'Everyone has a Self, and the Self can\'t be damaged. At most, it can be obscured by parts.',
    source: 'Richard Schwartz',
    conceptId: 'self-energy'
  },
  {
    id: 'ifs-2',
    text: 'There are no bad parts. All parts are welcome.',
    source: 'IFS Core Principle',
    conceptId: 'parts-multiplicity'
  },
  {
    id: 'ifs-3',
    text: 'The goal of IFS is not to eliminate parts, but to restore Self-leadership.',
    source: 'Richard Schwartz',
    conceptId: 'self-leadership'
  },
  {
    id: 'ifs-4',
    text: 'When you change your relationship with your parts, you change your relationship with the world.',
    source: 'IFS Teaching',
    conceptId: 'internal-family-system'
  },
  {
    id: 'ifs-5',
    text: 'Protectors will only relax when they trust that Self can handle what they\'ve been protecting against.',
    source: 'Richard Schwartz',
    conceptId: 'protective-system'
  },
  {
    id: 'ifs-6',
    text: 'Unblending is the most important skill in IFS—and it\'s simply noticing "this is a part, not all of me."',
    source: 'IFS Practice',
    conceptId: 'unblending'
  },
  {
    id: 'ifs-7',
    text: 'Exiles don\'t need to be fixed. They need to be witnessed by Self.',
    source: 'Richard Schwartz',
    conceptId: 'exiles'
  },
  {
    id: 'ifs-8',
    text: 'The 8 C\'s aren\'t virtues to cultivate—they\'re what\'s naturally present when parts step back.',
    source: 'IFS Teaching',
    conceptId: 'the-8-cs'
  },
  {
    id: 'ifs-9',
    text: 'Firefighters aren\'t trying to hurt you—they\'re trying to save you from exile pain.',
    source: 'Richard Schwartz',
    conceptId: 'firefighters'
  },
  {
    id: 'ifs-10',
    text: 'Legacy burdens can be released. You don\'t have to carry what wasn\'t yours.',
    source: 'IFS on Intergenerational Trauma',
    conceptId: 'legacy-burdens'
  },
  {
    id: 'ifs-11',
    text: 'Self-to-Self connection is the healing field. When both people are in Self, transformation happens naturally.',
    source: 'Richard Schwartz',
    conceptId: 'self-to-self-connection'
  },
  {
    id: 'ifs-12',
    text: 'Polarized parts are like children fighting. Self is the wise parent who listens to both.',
    source: 'IFS Teaching',
    conceptId: 'polarization'
  },
  {
    id: 'ifs-13',
    text: 'You can\'t think your way out of trauma. Exiles need Self\'s compassionate presence, not cognitive analysis.',
    source: 'Richard Schwartz',
    conceptId: 'unburdening'
  },
  {
    id: 'ifs-14',
    text: 'Managers work so hard because they\'re terrified of exile overwhelm. Appreciate them before asking them to relax.',
    source: 'IFS Practice',
    conceptId: 'managers'
  },
  {
    id: 'ifs-15',
    text: 'The internal family mirrors external relationships. Heal the internal, and external relationships transform.',
    source: 'IFS Systemic Insight',
    conceptId: 'internal-family-system'
  }
];

/**
 * Helper functions
 */

export function getConceptsByPartType(partType: 'self' | 'manager' | 'firefighter' | 'exile' | 'process') {
  return IFS_CONCEPTS.filter(c => c.partType === partType);
}

export function getSelfConcepts() {
  return getConceptsByPartType('self');
}

export function getProtectorConcepts() {
  return IFS_CONCEPTS.filter(c =>
    c.partType === 'manager' || c.partType === 'firefighter' ||
    c.id === 'protective-system'
  );
}

export function getExileConcepts() {
  return getConceptsByPartType('exile');
}

export function getProcessConcepts() {
  return getConceptsByPartType('process');
}

export function getConceptsByElement(element: Element) {
  return IFS_CONCEPTS.filter(c => c.elements.includes(element));
}

export function getConceptsByPhase(phase: SpiralPhase) {
  return IFS_CONCEPTS.filter(c => c.phases.includes(phase));
}

export function findConceptById(id: string) {
  return IFS_CONCEPTS.find(c => c.id === id);
}

export function searchConcepts(query: string) {
  const lowerQuery = query.toLowerCase();
  return IFS_CONCEPTS.filter(c =>
    c.concept.toLowerCase().includes(lowerQuery) ||
    c.explanation.toLowerCase().includes(lowerQuery) ||
    c.ontologyTags.some(tag => tag.includes(lowerQuery))
  );
}

/**
 * Detect IFS part-language in user input
 */
export function detectPartLanguage(input: string): {
  hasPartLanguage: boolean;
  partIndicators: string[];
  suggestedConcepts: string[];
} {
  const partPhrases = [
    'part of me',
    'a part',
    'something inside',
    'I can\'t help',
    'I can\'t stop',
    'inner voice',
    'inner critic',
    'I\'m torn',
    'I\'m conflicted',
    'I hate myself',
    'I\'m worthless',
    'I\'m broken'
  ];

  const found = partPhrases.filter(phrase =>
    input.toLowerCase().includes(phrase)
  );

  const hasPartLanguage = found.length > 0;

  const suggestedConcepts = hasPartLanguage ? [
    'parts-multiplicity',
    'unblending',
    'self-energy'
  ] : [];

  // Add specific suggestions based on content
  if (input.toLowerCase().includes('critic') || input.toLowerCase().includes('perfectionist')) {
    suggestedConcepts.push('managers');
  }
  if (input.toLowerCase().includes('can\'t stop') || input.toLowerCase().includes('impulsive')) {
    suggestedConcepts.push('firefighters');
  }
  if (input.toLowerCase().includes('torn') || input.toLowerCase().includes('conflicted')) {
    suggestedConcepts.push('polarization');
  }
  if (input.toLowerCase().includes('worthless') || input.toLowerCase().includes('ashamed')) {
    suggestedConcepts.push('exiles');
  }

  return {
    hasPartLanguage,
    partIndicators: found,
    suggestedConcepts: [...new Set(suggestedConcepts)] // remove duplicates
  };
}

/**
 * Assess if response shows Self-energy (8 C's)
 */
export function assessSelfEnergy(response: string): {
  selfEnergyPresent: boolean;
  presentQualities: string[];
  missingQualities: string[];
  recommendation: string;
} {
  const the8Cs = {
    curiosity: ['curious', 'wonder', 'interested', 'want to understand'],
    calm: ['calm', 'settled', 'peaceful', 'grounded', 'relaxed'],
    clarity: ['clear', 'see clearly', 'understand', 'makes sense'],
    compassion: ['compassion', 'care', 'gentle', 'kind', 'tender'],
    confidence: ['confident', 'trust', 'capable', 'can handle'],
    courage: ['courage', 'brave', 'willing', 'face', 'open to'],
    creativity: ['creative', 'possibility', 'imagine', 'playful'],
    connectedness: ['connected', 'together', 'relationship', 'with']
  };

  const lowerResponse = response.toLowerCase();

  const presentQualities = Object.keys(the8Cs).filter(quality =>
    the8Cs[quality as keyof typeof the8Cs].some(phrase =>
      lowerResponse.includes(phrase)
    )
  );

  const missingQualities = Object.keys(the8Cs).filter(quality =>
    !presentQualities.includes(quality)
  );

  const selfEnergyPresent = presentQualities.length >= 3;

  const recommendation = selfEnergyPresent
    ? 'Self-energy is present. Continue from this grounded place.'
    : 'Self-energy may be obscured by protective parts. Invite unblending: "Is this how YOU feel toward the part, or how another part feels?"';

  return {
    selfEnergyPresent,
    presentQualities,
    missingQualities,
    recommendation
  };
}
