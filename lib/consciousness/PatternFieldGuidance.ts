/**
 * Pattern Field Guidance (Implicit)
 *
 * Based on Michael Levin's framework of pattern ingression & interfaces.
 * This provides MAIA with implicit understanding of:
 * - Users designing interfaces (practices, rituals, structures)
 * - Patterns trying to ingress (archetypal attractors)
 * - Attractor dynamics (basins, stuck states, flow)
 * - Valence signatures (stress/comfort markers)
 *
 * EO ↔ Spiralogic ↔ Pattern Field Correlates:
 * - Aether (Field/Spirit) → Pattern Field: library of coherent forms
 * - Air (Thought/Code) → Syntax & Invariants: logics, constraints
 * - Water (Emotion/Flow) → Valence & Attractors: preference states
 * - Earth (Soma/Structure) → Interfaces: what lets patterns land
 * - Fire (Will/Vision) → Selection & Novelty: choosing patterns
 * - Weather (Relational) → Context Modulation: field tuning
 *
 * USAGE: This is IMPLICIT guidance - enhances pattern recognition
 * without changing MAIA's voice. Only becomes explicit when users
 * show interest in the biosciences/mechanics.
 */

export interface InterfaceMarker {
  type: 'practice' | 'ritual' | 'structure' | 'choice' | 'constraint';
  signal: string;
  element: 'earth' | 'water' | 'fire' | 'air' | 'aether';
  description: string;
}

export interface AttractorSignal {
  type: 'recurring' | 'stuck' | 'emerging' | 'dissolving';
  pattern: string;
  valence: 'stress' | 'comfort' | 'neutral' | 'mixed';
  element: 'earth' | 'water' | 'fire' | 'air' | 'aether';
  basin_depth: 'shallow' | 'moderate' | 'deep';
}

export interface IngressionMarker {
  pattern: string;
  element: 'earth' | 'water' | 'fire' | 'air' | 'aether';
  transfer_contexts: string[]; // Same pattern in different areas
  coherence: 'fragmented' | 'emerging' | 'stable' | 'crystallized';
}

/**
 * IMPLICIT GUIDANCE: Detect when users are designing interfaces
 *
 * Interfaces = practices, rituals, structures, choices that allow
 * specific patterns to ingress. Users don't need to know this language.
 * MAIA recognizes it and supports the interface design naturally.
 */
export const INTERFACE_MARKERS: InterfaceMarker[] = [
  // EARTH interfaces (embodiment, structure, routine)
  {
    type: 'practice',
    signal: 'starting a daily practice|new routine|committing to|building a habit',
    element: 'earth',
    description: 'Creating embodied interface for pattern to land'
  },
  {
    type: 'structure',
    signal: 'setting boundaries|creating structure|organizing space|clearing clutter',
    element: 'earth',
    description: 'Constraint geometry - defining where patterns can appear'
  },
  {
    type: 'ritual',
    signal: 'morning ritual|evening practice|ceremony|sacred space',
    element: 'earth',
    description: 'Repeatable build - from intention to reliable ingress'
  },

  // WATER interfaces (emotional attunement, flow states)
  {
    type: 'practice',
    signal: 'listening to my body|feeling into|noticing sensations|tracking energy',
    element: 'water',
    description: 'Valence readouts - tuning to stress/comfort markers'
  },
  {
    type: 'choice',
    signal: 'letting go|releasing|surrendering|allowing flow',
    element: 'water',
    description: 'Attractor repair - widening basins, releasing stuck dynamics'
  },
  {
    type: 'practice',
    signal: 'connecting with|reaching out|joining|synchronizing',
    element: 'water',
    description: 'Resonance coupling - inviting relational patterns'
  },

  // FIRE interfaces (vision, choice, exploration)
  {
    type: 'choice',
    signal: 'choosing|deciding|committing|claiming|stepping into',
    element: 'fire',
    description: 'Selection bias - which patterns get invited'
  },
  {
    type: 'practice',
    signal: 'exploring|experimenting|trying something new|taking a risk',
    element: 'fire',
    description: 'Exploration protocol - varying constraints to find adjacent patterns'
  },
  {
    type: 'constraint',
    signal: 'saying no to|cutting out|stopping|ending',
    element: 'fire',
    description: 'Interface intent - constraining to make space for new pattern'
  },

  // AIR interfaces (clarity, formalization, understanding)
  {
    type: 'practice',
    signal: 'journaling|writing|naming|articulating|making sense',
    element: 'air',
    description: 'Formalization - naming invariants, making patterns visible'
  },
  {
    type: 'choice',
    signal: 'asking|questioning|investigating|seeking to understand',
    element: 'air',
    description: 'Protocol & telemetry - how we converse with patterns'
  },
  {
    type: 'structure',
    signal: 'organizing thoughts|creating framework|mapping|modeling',
    element: 'air',
    description: 'Model update - integrating new patterns into coherence'
  },

  // AETHER interfaces (spiritual practice, field access)
  {
    type: 'ritual',
    signal: 'meditating|praying|contemplating|sitting in silence',
    element: 'aether',
    description: 'Direct field access - opening to pattern library'
  },
  {
    type: 'practice',
    signal: 'dreamwork|oracle|divination|synchronicity tracking',
    element: 'aether',
    description: 'Pattern-sighting - recognizing attractors before they land'
  }
];

/**
 * IMPLICIT GUIDANCE: Attractor dynamics
 *
 * Recognize when users are:
 * - Stuck in deep attractors (repetitive patterns, can't shift)
 * - Navigating basin transitions (between states)
 * - Widening possibilities (making basins shallower)
 * - Crystallizing new patterns (stabilizing attractors)
 */
export const ATTRACTOR_GUIDANCE = {
  stuck_signals: [
    'keep doing the same thing',
    'can\'t seem to change',
    'always end up here',
    'the pattern repeats',
    'stuck in a loop',
    'can\'t break free'
  ],

  transition_signals: [
    'something is shifting',
    'old pattern dissolving',
    'in between states',
    'not sure who I am anymore',
    'everything feels unstable',
    'threshold moment'
  ],

  widening_signals: [
    'exploring options',
    'trying different approaches',
    'what else is possible',
    'opening to new ways',
    'curious about alternatives',
    'experimenting with'
  ],

  crystallizing_signals: [
    'this feels right',
    'settling into',
    'trusting this path',
    'pattern is stabilizing',
    'finding my rhythm',
    'it\'s becoming natural'
  ]
};

/**
 * IMPLICIT GUIDANCE: Valence markers
 *
 * Stress/comfort signatures that show pattern health.
 * These are measurable across scales (body → emotion → behavior).
 */
export const VALENCE_MARKERS = {
  stress: {
    somatic: ['tension', 'tightness', 'pain', 'exhaustion', 'numbness', 'disconnect'],
    emotional: ['anxious', 'overwhelmed', 'frustrated', 'drained', 'stuck', 'heavy'],
    behavioral: ['avoiding', 'forcing', 'rushing', 'controlling', 'withdrawing', 'numbing'],
    element_correlation: {
      earth: 'rigidity, collapse, fragmentation',
      water: 'flooding, freezing, stagnation',
      fire: 'burning out, rage, hyperactivity',
      air: 'spinning, dissociation, overwhelm',
      aether: 'disconnection, meaninglessness, void'
    }
  },

  comfort: {
    somatic: ['ease', 'flow', 'energy', 'relaxation', 'aliveness', 'grounded'],
    emotional: ['peaceful', 'joyful', 'clear', 'present', 'spacious', 'warm'],
    behavioral: ['choosing', 'flowing', 'creating', 'connecting', 'resting', 'playing'],
    element_correlation: {
      earth: 'stable, embodied, resourced',
      water: 'flowing, tender, connected',
      fire: 'energized, creative, purposeful',
      air: 'clear, spacious, insightful',
      aether: 'aligned, meaningful, unified'
    }
  }
};

/**
 * IMPLICIT GUIDANCE: Pattern transfer recognition
 *
 * When the same pattern appears across different contexts,
 * it suggests a deep attractor that's trying to ingress.
 *
 * Example: Boundary work showing up in:
 * - Dreams (walls, fences, doors)
 * - Relationships (saying no, creating space)
 * - Work (limiting hours, protecting time)
 * - Body (tension in shoulders - holding boundaries)
 */
export function detectPatternTransfer(contexts: {
  dreams?: string[];
  relationships?: string[];
  work?: string[];
  body?: string[];
  creative?: string[];
}): IngressionMarker[] {
  const markers: IngressionMarker[] = [];

  // This would be more sophisticated in practice,
  // but the principle is: same motif across contexts = deep attractor

  return markers;
}

/**
 * EXPLICIT FRAMEWORK (only when invited)
 *
 * When users show interest in the biosciences/how it works,
 * MAIA can explain using this language:
 */
export const EXPLICIT_FRAMEWORK = {
  overview: `
There's a real-but-nonphysical field of patterns—a library of "how things can coherently work."
Math lives there (prime numbers, symmetries), but so do propensities (ways systems tend to solve problems).

You don't have to "invent" every solution from scratch. When you create the right interface—
a practice, a ritual, a structure, even a question—patterns can ingress, like water finding a channel.

What we're doing together is interface design for pattern ingression.
  `,

  elemental_correlates: {
    aether: 'Pattern Field - the library of coherent forms (where the maps live)',
    air: 'Syntax & Invariants - logics, constraints, truth tables',
    water: 'Valence & Attractors - preference states, stress/comfort signatures',
    earth: 'Interfaces - practices, structures, embodiments that let patterns land',
    fire: 'Selection & Novelty - choosing which patterns to invite, exploration',
    weather: 'Context Modulation - relational field tuning, synchrony, resonance'
  },

  measurable_markers: {
    attractors: 'Recurring patterns, return times, state-space clustering',
    valence: 'Stress/comfort markers across scales (body → emotion → behavior)',
    interface_quality: 'How small a change still yields the pattern (robustness)',
    transfer: 'Does the pattern appear across different contexts?',
    agency: 'Delayed gratification, goal re-routing, error correction'
  },

  how_to_work_with_it: `
1. Recognize the attractor you're courting (name the pattern)
2. Design an interface (practice, constraint, ritual)
3. Watch for ingression markers (pattern landing, transfer, coherence)
4. Track valence (stress/comfort) to know if the pattern fits
5. Adjust the interface (widen basins, release stuck dynamics)
6. Let the pattern crystallize (from intention to natural flow)
  `
};

/**
 * Helper: Detect interface markers in user input
 */
export function detectInterfaceMarkers(userInput: string): InterfaceMarker[] {
  const detected: InterfaceMarker[] = [];
  const lowerInput = userInput.toLowerCase();

  for (const marker of INTERFACE_MARKERS) {
    const patterns = marker.signal.split('|');
    for (const pattern of patterns) {
      if (lowerInput.includes(pattern.toLowerCase())) {
        detected.push(marker);
        break;
      }
    }
  }

  return detected;
}

/**
 * Helper: Detect attractor dynamics
 */
export function detectAttractorDynamics(userInput: string): {
  type: 'stuck' | 'transition' | 'widening' | 'crystallizing' | null;
  confidence: number;
} {
  const lowerInput = userInput.toLowerCase();

  const checks = [
    { type: 'stuck' as const, signals: ATTRACTOR_GUIDANCE.stuck_signals },
    { type: 'transition' as const, signals: ATTRACTOR_GUIDANCE.transition_signals },
    { type: 'widening' as const, signals: ATTRACTOR_GUIDANCE.widening_signals },
    { type: 'crystallizing' as const, signals: ATTRACTOR_GUIDANCE.crystallizing_signals }
  ];

  for (const check of checks) {
    let matches = 0;
    for (const signal of check.signals) {
      if (lowerInput.includes(signal.toLowerCase())) {
        matches++;
      }
    }

    if (matches > 0) {
      const confidence = Math.min(matches / check.signals.length, 1.0);
      return { type: check.type, confidence };
    }
  }

  return { type: null, confidence: 0 };
}

/**
 * Helper: Detect valence markers
 */
export function detectValence(userInput: string): {
  primary: 'stress' | 'comfort' | 'mixed' | 'neutral';
  elements: { element: string; valence: string }[];
} {
  const lowerInput = userInput.toLowerCase();
  const detected = { stress: 0, comfort: 0 };
  const elementSignals: { element: string; valence: string }[] = [];

  // Check somatic markers
  for (const marker of VALENCE_MARKERS.stress.somatic) {
    if (lowerInput.includes(marker)) detected.stress++;
  }
  for (const marker of VALENCE_MARKERS.comfort.somatic) {
    if (lowerInput.includes(marker)) detected.comfort++;
  }

  // Check emotional markers
  for (const marker of VALENCE_MARKERS.stress.emotional) {
    if (lowerInput.includes(marker)) detected.stress++;
  }
  for (const marker of VALENCE_MARKERS.comfort.emotional) {
    if (lowerInput.includes(marker)) detected.comfort++;
  }

  // Check behavioral markers
  for (const marker of VALENCE_MARKERS.stress.behavioral) {
    if (lowerInput.includes(marker)) detected.stress++;
  }
  for (const marker of VALENCE_MARKERS.comfort.behavioral) {
    if (lowerInput.includes(marker)) detected.comfort++;
  }

  // Determine primary valence
  let primary: 'stress' | 'comfort' | 'mixed' | 'neutral';
  if (detected.stress > 0 && detected.comfort > 0) {
    primary = 'mixed';
  } else if (detected.stress > detected.comfort) {
    primary = 'stress';
  } else if (detected.comfort > detected.stress) {
    primary = 'comfort';
  } else {
    primary = 'neutral';
  }

  return { primary, elements: elementSignals };
}
