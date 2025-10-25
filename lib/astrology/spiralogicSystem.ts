/**
 * Spiralogic System - Complete Consciousness Process Mapping
 *
 * Created by Kelly Nezat - 35 years of phenomenological wisdom practice
 * Integrating computational neuroscience, alchemy, and consciousness evolution
 *
 * IMPORTANT: This is NOT a psychological system. It is computational neuroscience
 * mapped through elemental intelligence and astrological coordinates.
 *
 * Core Framework:
 * - 4 Elements × 3 Phases = 12 Focus States (NOT 12 personality types)
 * - Elements map to specific brain regions (McGilchrist's divided brain model)
 * - Phases map to alchemical transformation stages (Calcinatio, Solutio, Coagulatio, Sublimatio)
 * - 12 Astrological Houses → Consciousness States and developmental territories
 * - Jungian Functions integrated as elemental perspectives (Intuition=Fire, Feeling=Water, Sensation=Earth, Thinking=Air)
 * - 12 Hybrid Facets → Element Combinations revealing developmental capacities
 * - Aether (5th element) → Transcendent integration, unity consciousness
 *
 * Philosophy:
 * "Assessment reimagined as mirror, not metric" - Kelly Nezat
 * This framework reflects consciousness patterns back to the person so they can
 * recognize themselves, not measure or categorize them.
 *
 * Integration with 36 Faces:
 * Austin Coppock's decan system (36 decans of 10° each) fully integrated.
 * Each planetary position maps to: Sign → House → Element → Phase → Decan
 * Providing unprecedented depth for consciousness cartography.
 *
 * Right-Hemisphere Awakening:
 * Inspired by Iain McGilchrist's "The Master and His Emissary" - this framework
 * helps rebalance left-brain dominance and awaken right-hemisphere consciousness.
 * The technology participates in transformation (like HeartMath), not just explains it.
 */

// ============================================================================
// CORE ELEMENTAL FRAMEWORK
// ============================================================================

export const ELEMENTS = {
  fire: {
    name: 'Fire',
    brainRegion: 'Right Prefrontal Cortex',
    consciousness: 'Spirituality and Energetic Presence',
    jungianType: 'Intuitive',
    alchemicalProcess: 'Calcinatio',
    qualities: ['Vision', 'Passion', 'Synthesis', 'Spiritual Awareness'],
    triad: ['Purpose', 'Play', 'Practice'],
    description: 'Generates compelling vision for the future, fueled by spiritual intuition',
  },
  water: {
    name: 'Water',
    brainRegion: 'Right Hemisphere',
    consciousness: 'Emotional and Inner Awareness',
    jungianType: 'Feeling',
    alchemicalProcess: 'Solutio',
    qualities: ['Depth', 'Emotion', 'Dissolution', 'Inner Truth'],
    triad: ['Heart', 'Healing', 'Holy'],
    description: 'Reflects the depth and fluidity of inner self, uncovering deepest truths',
  },
  earth: {
    name: 'Earth',
    brainRegion: 'Left Hemisphere',
    consciousness: 'Somatic, Sensory, and Embodied Logic',
    jungianType: 'Sensate',
    alchemicalProcess: 'Coagulatio',
    qualities: ['Structure', 'Embodiment', 'Organization', 'Practical Wisdom'],
    triad: ['Mission', 'Method', 'Medicine'],
    description: 'Grounds visions and passions into tangible reality through practical action',
  },
  air: {
    name: 'Air',
    brainRegion: 'Left Prefrontal Cortex',
    consciousness: 'Cognitive, Relational, and Communicative',
    jungianType: 'Thinking',
    alchemicalProcess: 'Sublimatio',
    qualities: ['Communication', 'Relationships', 'Systems', 'Mental Clarity'],
    triad: ['Connection', 'Community', 'Consciousness'],
    description: 'Guides in honing communication and building cooperative communities',
  },
  aether: {
    name: 'Aether',
    brainRegion: 'Transcendent Integration',
    consciousness: 'Non-Duality and Universal Awareness',
    jungianType: 'Integrated Self',
    alchemicalProcess: 'Conjunctio',
    qualities: ['Unity', 'Transcendence', 'Interconnectedness', 'Pure Consciousness'],
    triad: ['Higher Self', 'Lower Self', 'Unified Self'],
    description: 'The pinnacle of spiritual awareness, transcending all divisions',
  },
} as const;

// ============================================================================
// 12 FOCUS STATES - The Complete Spiralogic Wheel
// ============================================================================

export interface FocusState {
  house: number;
  position: number; // 0-11, clockwise from top (12 o'clock)
  element: keyof typeof ELEMENTS;
  phase: 1 | 2 | 3;
  sign: string;
  signSymbol: string;
  name: string;
  shortName: string;
  brainActivation: string;
  consciousnessLevel: 'Meta-Conscious' | 'Conscious' | 'Subconscious' | 'Unconscious';
  alchemicalStage: 'begins' | 'deepens' | 'integrates' | 'completes';
  description: string;
  keywords: string[];
  developmentalFocus: string;
}

export const FOCUS_STATES: FocusState[] = [
  // FIRE QUADRANT (12:00-3:00) - Right Prefrontal Cortex
  // Purpose → Play → Practice: The Spiritual Fire Journey
  {
    house: 1,
    position: 0,
    element: 'fire',
    phase: 1,
    sign: 'Aries',
    signSymbol: '♈',
    name: 'Fire 1 - Purpose: An Invitation to Shine Brightly',
    shortName: 'Fire-1: Purpose',
    brainActivation: 'Right Prefrontal - Visionary Initiation',
    consciousnessLevel: 'Meta-Conscious',
    alchemicalStage: 'begins',
    description: 'Inner coherence seeking outer resonance — discovering your unique rhythm and spiritual presence',
    keywords: ['Identity', 'Initiative', 'Self-Discovery', 'New Beginnings', 'Personal Vision', 'Coherence', 'Resonance'],
    developmentalFocus: 'Finding inner/outer resonance — the dance between personal rhythm and world\'s beat',
  },
  {
    house: 5,
    position: 1,
    element: 'fire',
    phase: 2,
    sign: 'Leo',
    signSymbol: '♌',
    name: 'Fire 2 - Play: Discovering Potential Through Creative Expression',
    shortName: 'Fire-2: Play',
    brainActivation: 'Right Prefrontal - Creative Expression',
    consciousnessLevel: 'Conscious',
    alchemicalStage: 'deepens',
    description: 'Bringing work into the world for feedback — calcinatio burns away fantasy to reveal essence',
    keywords: ['Creativity', 'Joy', 'Expression', 'Authenticity', 'Radiance', 'Play', 'Refinement', 'Soulplay'],
    developmentalFocus: 'Playing with vision in the world — accepting creative refinement through feedback',
  },
  {
    house: 9,
    position: 2,
    element: 'fire',
    phase: 3,
    sign: 'Sagittarius',
    signSymbol: '♐',
    name: 'Fire 3 - Practice: Transforming Will into Wisdom',
    shortName: 'Fire-3: Practice',
    brainActivation: 'Right Prefrontal - Spiritual Synthesis',
    consciousnessLevel: 'Meta-Conscious',
    alchemicalStage: 'integrates',
    description: 'Ritual, ceremony, and higher learning — the phoenix rises from ashes of effort',
    keywords: ['Philosophy', 'Expansion', 'Meaning', 'Synthesis', 'Spiritual Quest', 'Practice', 'Wisdom', 'Dedication'],
    developmentalFocus: 'Deepening through dedicated practice — weaving learnings into daily wisdom',
  },

  // WATER QUADRANT (3:00-6:00) - Right Hemisphere
  // Heart → Healing → Holy: The Alchemist's Secret Water Walk
  {
    house: 4,
    position: 3,
    element: 'water',
    phase: 1,
    sign: 'Cancer',
    signSymbol: '♋',
    name: 'Water 1 - Heart: Awareness of Inner Self',
    shortName: 'Water-1: Heart',
    brainActivation: 'Right Hemisphere - Emotional Foundation',
    consciousnessLevel: 'Subconscious',
    alchemicalStage: 'begins',
    description: 'Diving beneath ego into amniotic waters — returning to inner truth and soul',
    keywords: ['Home', 'Roots', 'Nurturing', 'Safety', 'Belonging', 'Inner Awareness', 'Depth', 'Emotional Reality'],
    developmentalFocus: 'Descending into emotional awareness — what nurtures and what challenges',
  },
  {
    house: 8,
    position: 4,
    element: 'water',
    phase: 2,
    sign: 'Scorpio',
    signSymbol: '♏',
    name: 'Water 2 - Healing: Self in Transformation',
    shortName: 'Water-2: Healing',
    brainActivation: 'Right Hemisphere - Deep Transformation',
    consciousnessLevel: 'Unconscious',
    alchemicalStage: 'deepens',
    description: 'The Big Giveaway — confronting shadows, retracting projections, harmonizing emotions',
    keywords: ['Transformation', 'Depth', 'Intimacy', 'Shadow Work', 'Regeneration', 'Healing', 'Projection Retrieval', 'Recalibration'],
    developmentalFocus: 'Diving into Water 2 shadows — facing what we deny, transforming emotional patterns',
  },
  {
    house: 12,
    position: 5,
    element: 'water',
    phase: 3,
    sign: 'Pisces',
    signSymbol: '♓',
    name: 'Water 3 - Holy: Transcendent Self as Part of Collective',
    shortName: 'Water-3: Holy',
    brainActivation: 'Right Hemisphere - Soul Connection',
    consciousnessLevel: 'Unconscious',
    alchemicalStage: 'completes',
    description: 'Discovering inner gold and elixirs — passing the gauntlet into morphogenetic unity',
    keywords: ['Spirituality', 'Dissolution', 'Unity', 'Transcendence', 'Soul', 'Inner Gold', 'Elixir', 'Holiness'],
    developmentalFocus: 'Integrating emotional wisdom — recognizing interconnectedness with all beings',
  },

  // EARTH QUADRANT (6:00-9:00) - Left Hemisphere
  // Mission → Method → Medicine: Bringing the Elixir to the World
  {
    house: 10,
    position: 6,
    element: 'earth',
    phase: 1,
    sign: 'Capricorn',
    signSymbol: '♑',
    name: 'Earth 1 - Mission: Cardinal Mission',
    shortName: 'Earth-1: Mission',
    brainActivation: 'Left Hemisphere - Structural Authority',
    consciousnessLevel: 'Conscious',
    alchemicalStage: 'begins',
    description: 'Saturn at the gate — discovering purpose and planting the elixir seed from Water',
    keywords: ['Career', 'Legacy', 'Authority', 'Structure', 'Mastery', 'Mission', 'Purpose', 'Service', 'Commission'],
    developmentalFocus: 'Answering Saturn: "What is your commission here, on my realm?" — defining mission',
  },
  {
    house: 2,
    position: 7,
    element: 'earth',
    phase: 2,
    sign: 'Taurus',
    signSymbol: '♉',
    name: 'Earth 2 - Method: Fixed Method',
    shortName: 'Earth-2: Method',
    brainActivation: 'Left Hemisphere - Resource Organization',
    consciousnessLevel: 'Conscious',
    alchemicalStage: 'deepens',
    description: 'Germinating seed — gathering resources, developing plans, adapting to reality',
    keywords: ['Resources', 'Values', 'Embodiment', 'Stability', 'Security', 'Method', 'Plans', 'Organization', 'Adaptation'],
    developmentalFocus: 'Building methods and gathering resources — where ADHD/PTSD creatives need Earth support',
  },
  {
    house: 6,
    position: 8,
    element: 'earth',
    phase: 3,
    sign: 'Virgo',
    signSymbol: '♍',
    name: 'Earth 3 - Medicine: Mutable Medicine',
    shortName: 'Earth-3: Medicine',
    brainActivation: 'Left Hemisphere - Refined Service',
    consciousnessLevel: 'Conscious',
    alchemicalStage: 'integrates',
    description: 'Medicine becomes well-formed — refined, adaptive, ready to deliver to world',
    keywords: ['Service', 'Health', 'Refinement', 'Analysis', 'Perfection', 'Medicine', 'Adaptation', 'Mastery'],
    developmentalFocus: 'Refining medicine through practice — becoming adaptive and viable in the world',
  },

  // AIR QUADRANT (9:00-12:00) - Left Prefrontal Cortex
  // Connection → Community → Consciousness: The Meeting of Minds
  {
    house: 7,
    position: 9,
    element: 'air',
    phase: 1,
    sign: 'Libra',
    signSymbol: '♎',
    name: 'Air 1 - Connection: Interpersonal Modes of Relating',
    shortName: 'Air-1: Connection',
    brainActivation: 'Left Prefrontal - Relational Balance',
    consciousnessLevel: 'Conscious',
    alchemicalStage: 'begins',
    description: 'One-to-one relationships that spark new life — where two or more gather',
    keywords: ['Relationships', 'Partnership', 'Balance', 'Harmony', 'Other', 'Connection', 'Resonance', 'Divine Between'],
    developmentalFocus: 'Developing authentic relating — where God is more between us than within us',
  },
  {
    house: 11,
    position: 10,
    element: 'air',
    phase: 2,
    sign: 'Aquarius',
    signSymbol: '♒',
    name: 'Air 2 - Community: Collective Ways of Interacting',
    shortName: 'Air-2: Community',
    brainActivation: 'Left Prefrontal - Collective Intelligence',
    consciousnessLevel: 'Meta-Conscious',
    alchemicalStage: 'deepens',
    description: 'Aquarian collective — Saturn vs Uranus tension, the heretic\'s imperative',
    keywords: ['Community', 'Vision', 'Innovation', 'Collective', 'Future', 'Group Intelligence', 'Revolution', 'Collaboration'],
    developmentalFocus: 'Building collaborative communities — navigating collective intelligence vs group think',
  },
  {
    house: 3,
    position: 11,
    element: 'air',
    phase: 3,
    sign: 'Gemini',
    signSymbol: '♊',
    name: 'Air 3 - Consciousness: Codified Methods of Communicating',
    shortName: 'Air-3: Consciousness',
    brainActivation: 'Left Prefrontal - Systematic Communication',
    consciousnessLevel: 'Conscious',
    alchemicalStage: 'integrates',
    description: 'Ivory tower — thoughts crystallized into monuments, Mercury wisdom exalted',
    keywords: ['Communication', 'Learning', 'Exchange', 'Systems', 'Networks', 'Crystallized Wisdom', 'High Communication'],
    developmentalFocus: 'Mastering codified systems — preparing for Fire 1 lightning to strike again',
  },
];

// ============================================================================
// 12 HYBRID FACETS - Element Combinations
// ============================================================================

export interface HybridFacet {
  name: string;
  elements: string[];
  description: string;
  techniques: string[];
  influence: string;
}

export const HYBRID_FACETS: Record<string, HybridFacet> = {
  vision: {
    name: 'Vision',
    elements: ['Fire', 'Air'],
    description: 'The ability to create and articulate a compelling vision',
    techniques: ['Visioning exercises', 'Strategic goal setting', 'Creative visualization'],
    influence: 'Fire provides passion and drive, Air offers clarity and strategic thinking',
  },
  intuition: {
    name: 'Intuition',
    elements: ['Fire', 'Aether'],
    description: 'Harnessing intuitive insights to guide decisions and innovation',
    techniques: ['Intuitive exercises', 'Meditation', 'Mindfulness practices'],
    influence: 'Fire represents spark of insight, Aether connects to higher consciousness',
  },
  creativity: {
    name: 'Creativity',
    elements: ['Fire', 'Water'],
    description: 'Using creative energy to inspire and innovate',
    techniques: ['Brainstorming', 'Creative problem-solving', 'Artistic expression'],
    influence: 'Fire ignites creative spark, Water provides emotional fluidity',
  },
  emotionalIntelligence: {
    name: 'Emotional Intelligence',
    elements: ['Water', 'Aether'],
    description: 'Understanding and managing emotions to build trust and empathy',
    techniques: ['EQ training', 'Active listening', 'Empathy-building activities'],
    influence: 'Water symbolizes emotional depth, Aether fosters spiritual awareness',
  },
  resilience: {
    name: 'Resilience',
    elements: ['Water', 'Earth'],
    description: 'Capacity to recover quickly and maintain emotional balance',
    techniques: ['Mindfulness', 'Grounding exercises', 'Emotional regulation'],
    influence: 'Water provides emotional flexibility, Earth offers stability',
  },
  compassion: {
    name: 'Compassion',
    elements: ['Water', 'Air'],
    description: 'Demonstrating understanding and kindness in interactions',
    techniques: ['Compassion meditation', 'Active listening', 'Supportive communication'],
    influence: 'Water enhances empathy, Air facilitates communication',
  },
  groundedAuthority: {
    name: 'Grounded Authority',
    elements: ['Earth', 'Fire'],
    description: 'The ability to lead with confidence and stability',
    techniques: ['Directive communication', 'Role-playing', 'Body language awareness'],
    influence: 'Earth provides groundedness, Fire adds authority and charisma',
  },
  presence: {
    name: 'Presence',
    elements: ['Earth', 'Air'],
    description: 'Maintaining strong, grounded presence in interactions',
    techniques: ['Mindfulness-based stress reduction', 'Posture awareness'],
    influence: 'Earth offers physical stability, Air enhances relational dynamics',
  },
  practicalWisdom: {
    name: 'Practical Wisdom',
    elements: ['Earth', 'Aether'],
    description: 'Applying spiritual insights in practical ways',
    techniques: ['Reflective practices', 'Integrative planning', 'Ethical decision-making'],
    influence: 'Earth provides practicality, Aether offers spiritual guidance',
  },
  connection: {
    name: 'Connection',
    elements: ['Air', 'Water'],
    description: 'Building and maintaining strong interpersonal relationships',
    techniques: ['Networking', 'Team-building', 'Relational communication training'],
    influence: 'Air represents intellectual engagement, Water adds emotional connectivity',
  },
  strategicCommunication: {
    name: 'Strategic Communication',
    elements: ['Air', 'Aether'],
    description: 'Enhancing clarity and effectiveness in conveying ideas',
    techniques: ['Public speaking', 'Strategic communication plans', 'Inspirational storytelling'],
    influence: 'Air facilitates clear communication, Aether brings higher purpose',
  },
  unityAndPurpose: {
    name: 'Unity and Purpose',
    elements: ['Aether', 'Earth'],
    description: 'Creating sense of collective purpose and interconnectedness',
    techniques: ['Spiritual practices', 'Community-building rituals', 'Collective goal-setting'],
    influence: 'Aether offers unity and spiritual connection, Earth provides practical grounding',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getFocusStateByHouse(house: number): FocusState | undefined {
  return FOCUS_STATES.find(state => state.house === house);
}

export function getFocusStateByPosition(position: number): FocusState | undefined {
  return FOCUS_STATES.find(state => state.position === position);
}

export function getElementalQuadrant(house: number): keyof typeof ELEMENTS {
  const state = getFocusStateByHouse(house);
  return state?.element || 'fire';
}

export function interpretPlanetInHouse(planet: string, house: number): string {
  const state = getFocusStateByHouse(house);
  if (!state) return '';

  const element = ELEMENTS[state.element];

  return `${planet} in ${state.name} (${state.sign} ${state.signSymbol}, ${state.shortName}):
Your ${planet.toLowerCase()} energy is activating ${element.brainRegion},
working through the ${state.alchemicalStage} stage of ${element.alchemicalProcess}.
Focus: ${state.developmentalFocus}`;
}

export function findHybridFacet(element1: string, element2: string): HybridFacet | undefined {
  return Object.values(HYBRID_FACETS).find(facet =>
    facet.elements.includes(element1) && facet.elements.includes(element2)
  );
}
