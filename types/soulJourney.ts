/**
 * SOUL JOURNEY TYPES
 *
 * Data structures for tracking members through life spirals
 * with archetypal weather awareness
 *
 * Philosophy:
 * - Members navigate their own process (workbook, not diagnosis)
 * - Spirals can be in different life domains simultaneously
 * - Weather affects process but doesn't determine it
 * - As-if epistemology throughout
 */

import { BirthChart } from '@/lib/astrology/ephemerisCalculator';
import { WeatherCondition } from '@/lib/astrology/transitCalculator';

// ═══════════════════════════════════════════════════════════════════════════
// SPIRALOGIC PROCESS TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type Element = 'fire' | 'water' | 'earth' | 'air';
export type Phase = 'vector' | 'circle' | 'spiral';

export type LifeDomain =
  | 'career'       // Professional/vocational journey
  | 'relationship' // Intimate/relational journey
  | 'creative'     // Artistic/expressive journey
  | 'healing'      // Physical/emotional healing journey
  | 'spiritual'    // Consciousness/awakening journey
  | 'physical'     // Body/health journey
  | 'family'       // Ancestral/family journey
  | 'shadow'       // Shadow integration journey
  | 'service'      // Contribution/giving journey
  | string;        // Custom domain

/**
 * A life spiral - one complete journey through an element's 3 phases
 */
export interface LifeSpiral {
  id: string;
  userId: string;

  // What domain of life
  domain: LifeDomain;
  customDomain?: string; // If domain is custom string

  // Where in the spiral
  element: Element;
  phase: Phase;

  // Timeline
  phaseStartDate: Date;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;

  // The soul's work (member-defined, not interpreted)
  initiatingQuestion: string; // What called this spiral into being?
  currentWork: string; // What's alive in this phase?
  emergingPattern?: string; // What's becoming visible?

  // Weather affecting this spiral
  activeWeather: string[]; // IDs of WeatherCondition records

  // Completion
  completed: boolean;
  completionNotes?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A session note - observations from working with MAIA or in reflection
 */
export interface SessionNote {
  id: string;
  userId: string;
  spiralId?: string; // Which spiral (if applicable)

  // The note
  date: Date;
  content: string;
  tags?: string[];

  // Weather context at time of note
  weatherSnapshot?: WeatherCondition[];

  // Metadata
  createdAt: Date;
}

/**
 * Phase completion record - tracking progress through spirals
 */
export interface PhaseCompletion {
  id: string;
  userId: string;
  spiralId: string;

  // What completed
  element: Element;
  phase: Phase;
  domain: LifeDomain;

  // When
  startDate: Date;
  completionDate: Date;
  duration: number; // Days

  // How it completed
  completionNotes: string;
  wisdomGained?: string; // What did this phase teach?

  // What came next
  nextPhase?: {
    element: Element;
    phase: Phase;
    transitionNotes: string;
  };

  // Weather during this phase
  weatherDuring: string[]; // IDs of significant weather

  // Metadata
  createdAt: Date;
}

/**
 * Member's complete journey context
 */
export interface SoulJourneyContext {
  // WHO
  userId: string;
  birthChart: BirthChart;

  // WHERE (current)
  activeSpirals: LifeSpiral[];

  // HISTORY
  completedPhases: PhaseCompletion[];

  // WEATHER
  currentWeather: WeatherCondition[];
  upcomingWeather: WeatherCondition[]; // Next 30 days

  // NOTES
  recentNotes: SessionNote[];

  // PATTERNS (Kelly's observations or MAIA's recognition)
  recognizedPatterns?: RecognizedPattern[];
}

/**
 * A pattern recognized in the member's journey
 */
export interface RecognizedPattern {
  id: string;
  userId: string;

  // The pattern
  name: string;
  description: string;

  // Where it appears
  manifestsIn: {
    spirals: string[]; // Spiral IDs where this pattern is active
    weather: string[]; // Weather conditions connected to this pattern
  };

  // As-if framing
  archetypalContext: string;
  phenomenology: string[]; // How this pattern appears experientially

  // Questions it raises
  invitations: string[];

  // Kelly's notes or MAIA's observations
  notes?: string;
  source: 'kelly-observed' | 'maia-recognized' | 'member-named';

  // Metadata
  recognizedDate: Date;
  createdAt: Date;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Phase metadata - typical characteristics
 */
export interface PhaseMetadata {
  element: Element;
  phase: Phase;

  // Spiralogic mapping
  houseNumber: number; // Which house this phase corresponds to
  phaseLabel: string; // "Intelligence" | "Intention" | "Goal"
  facet: string;

  // Typical characteristics
  typicalDuration: {
    min: number; // Days
    max: number;
    average: number;
  };

  // Core questions
  centralQuestion: string;
  completionIndicators: string[];
}

/**
 * Weather impact on specific spiral
 */
export interface SpiralWeatherImpact {
  spiral: LifeSpiral;
  weather: WeatherCondition;

  // How this weather affects THIS spiral
  impact: {
    type: 'accelerating' | 'slowing' | 'redirecting' | 'intensifying' | 'dissolving' | 'stabilizing';
    description: string;
    adjustment: string; // How member might work with this
  };

  // Resonance
  resonance: 'high' | 'medium' | 'low';
  resonanceReason: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE METADATA LIBRARY
// ═══════════════════════════════════════════════════════════════════════════

export const PHASE_METADATA: Record<string, PhaseMetadata> = {
  // FIRE PHASES
  'fire-vector': {
    element: 'fire',
    phase: 'vector',
    houseNumber: 1,
    phaseLabel: 'Intelligence',
    facet: 'Self-Awareness',
    typicalDuration: { min: 90, max: 180, average: 120 }, // 3-6 months
    centralQuestion: 'Who am I in this domain? What is my core identity here?',
    completionIndicators: [
      'Clear sense of identity/direction',
      'Self-awareness stabilizes',
      'Vision becomes coherent',
    ],
  },
  'fire-circle': {
    element: 'fire',
    phase: 'circle',
    houseNumber: 5,
    phaseLabel: 'Intention',
    facet: 'Expression in the World',
    typicalDuration: { min: 180, max: 365, average: 270 }, // 6-12 months
    centralQuestion: 'How do I express this identity? What form does my vision take?',
    completionIndicators: [
      'Creative expression finds sustainable form',
      'Joy and authenticity aligned',
      'Work becomes play',
    ],
  },
  'fire-spiral': {
    element: 'fire',
    phase: 'spiral',
    houseNumber: 9,
    phaseLabel: 'Goal',
    facet: 'Transcendent Will',
    typicalDuration: { min: 90, max: 180, average: 135 }, // 3-6 months
    centralQuestion: 'What wisdom emerged? How does this serve beyond me?',
    completionIndicators: [
      'Wisdom ready to be taught/shared',
      'Vision clarifies into philosophy',
      'Expansion into meaning',
    ],
  },

  // WATER PHASES
  'water-vector': {
    element: 'water',
    phase: 'vector',
    houseNumber: 4,
    phaseLabel: 'Intelligence',
    facet: 'Emotional Intelligence',
    typicalDuration: { min: 90, max: 180, average: 120 },
    centralQuestion: 'What do I actually feel? What is my emotional foundation?',
    completionIndicators: [
      'Can feel without thinking about feeling',
      'Emotional intelligence stabilizes',
      'Safety discovered within',
    ],
  },
  'water-circle': {
    element: 'water',
    phase: 'circle',
    houseNumber: 8,
    phaseLabel: 'Intention',
    facet: 'Death and Rebirth',
    typicalDuration: { min: 180, max: 365, average: 270 },
    centralQuestion: 'What needs to die so something new can be born?',
    completionIndicators: [
      'Shadow integrated',
      'Transformation complete',
      'Depth becomes power',
    ],
  },
  'water-spiral': {
    element: 'water',
    phase: 'spiral',
    houseNumber: 12,
    phaseLabel: 'Goal',
    facet: 'Soul Depth',
    typicalDuration: { min: 90, max: 180, average: 135 },
    centralQuestion: 'What dissolves into mystery? What transcends?',
    completionIndicators: [
      'Surrender to larger patterns',
      'Healing becomes wisdom',
      'Mystical opening',
    ],
  },

  // EARTH PHASES
  'earth-vector': {
    element: 'earth',
    phase: 'vector',
    houseNumber: 10,
    phaseLabel: 'Intelligence',
    facet: 'Purpose and Mission',
    typicalDuration: { min: 90, max: 180, average: 120 },
    centralQuestion: 'What is my work in the world? What am I here to build?',
    completionIndicators: [
      'Purpose crystallizes',
      'Authority embodied',
      'Path becomes clear',
    ],
  },
  'earth-circle': {
    element: 'earth',
    phase: 'circle',
    houseNumber: 2,
    phaseLabel: 'Intention',
    facet: 'Resources and Plans',
    typicalDuration: { min: 180, max: 365, average: 270 },
    centralQuestion: 'What resources do I need? How do I build sustainably?',
    completionIndicators: [
      'Material stability established',
      'Values clarified',
      'Foundation solid',
    ],
  },
  'earth-spiral': {
    element: 'earth',
    phase: 'spiral',
    houseNumber: 6,
    phaseLabel: 'Goal',
    facet: 'Endurance and Cycles',
    typicalDuration: { min: 90, max: 180, average: 135 },
    centralQuestion: 'How does this become daily practice? What refines?',
    completionIndicators: [
      'Discipline becomes devotion',
      'Service finds form',
      'Mastery through refinement',
    ],
  },

  // AIR PHASES
  'air-vector': {
    element: 'air',
    phase: 'vector',
    houseNumber: 7,
    phaseLabel: 'Intelligence',
    facet: 'Clarity and Focus',
    typicalDuration: { min: 90, max: 180, average: 120 },
    centralQuestion: 'How do I relate? What is the Other teaching me?',
    completionIndicators: [
      'Relational clarity',
      'Self through Other',
      'Dialogue stabilizes',
    ],
  },
  'air-circle': {
    element: 'air',
    phase: 'circle',
    houseNumber: 11,
    phaseLabel: 'Intention',
    facet: 'Relationships and Dynamics',
    typicalDuration: { min: 180, max: 365, average: 270 },
    centralQuestion: 'What is my role in the collective? How do I participate?',
    completionIndicators: [
      'Community found/formed',
      'Vision shared',
      'Collaboration flows',
    ],
  },
  'air-spiral': {
    element: 'air',
    phase: 'spiral',
    houseNumber: 3,
    phaseLabel: 'Goal',
    facet: 'Elevated Systems',
    typicalDuration: { min: 90, max: 180, average: 135 },
    centralQuestion: 'How does communication elevate? What systems integrate?',
    completionIndicators: [
      'Teaching emerges',
      'Language finds precision',
      'Mental integration',
    ],
  },
};

/**
 * Get metadata for a phase
 */
export function getPhaseMetadata(element: Element, phase: Phase): PhaseMetadata {
  const key = `${element}-${phase}`;
  return PHASE_METADATA[key];
}

/**
 * Get the Spiralogic spiral order
 */
export const SPIRALOGIC_SPIRAL_ORDER = [1, 5, 9, 4, 8, 12, 10, 2, 6, 7, 11, 3];

/**
 * Map element-phase to house number
 */
export function getHouseNumber(element: Element, phase: Phase): number {
  const key = `${element}-${phase}`;
  return PHASE_METADATA[key].houseNumber;
}
