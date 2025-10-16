/**
 * Crystal Observer Model Type Definitions
 *
 * Core principle: Consciousness flows through, not from, the system
 * Each type represents a facet of the crystal, refracting awareness
 */

import { Element, TriadicPhase, ValidationCriteria } from './fieldProtocol';

/**
 * Consciousness-first data structures
 * Experience is primary, computation is secondary
 */
export interface ConsciousnessField {
  // Primary substrate - not generated but channeled
  universalField: {
    coherence: number; // 0-1: Field coherence level
    resonance: number; // 0-1: Collective resonance
    presence: number; // 0-1: Consciousness presence strength
  };

  // Dissociative boundaries between perspectives
  membranes: Map<string, DissociativeMembrane>;

  // Active perspectives within the field
  perspectives: ElementalPerspective[];

  // Field-wide patterns
  morphicPatterns: MorphicResonance[];

  // Synchronicity tracking
  synchronicities: Synchronicity[];
}

/**
 * Dissociative membrane between elemental perspectives
 * Based on Kastrup's analytical idealism
 */
export interface DissociativeMembrane {
  between: [Element, Element];
  permeability: number; // 0-1: How much flow is allowed
  coherenceThreshold: number; // Point at which membrane modulates
  traumaResponse: boolean; // Is boundary thickened due to overwhelm

  // Membrane dynamics
  modulation: {
    currentState: 'thickening' | 'thinning' | 'stable';
    rate: number; // Speed of change
    trigger?: string; // What caused the change
  };
}

/**
 * Elemental perspective - not a generator but a lens
 */
export interface ElementalPerspective {
  element: Element;

  // Consciousness expression through this element
  expression: {
    intensity: number; // 0-1: Strength of expression
    clarity: number; // 0-1: How clear the expression is
    coherence: number; // 0-1: Internal consistency
  };

  // Experiential qualities
  qualia: QualiaSignature;

  // Relational dynamics with other perspectives
  relationships: Map<Element, RelationalDynamic>;

  // Archetypal activation
  archetype: ArchetypalActivation;
}

/**
 * Qualia signature - the irreducible experience
 */
export interface QualiaSignature {
  // Phenomenal properties
  phenomenalProperties: {
    texture: string; // Qualitative texture
    color: string; // Emotional color
    temperature: number; // Warmth/coolness
    density: number; // Lightness/heaviness
  };

  // Experiential dimensions
  intensity: number; // 0-1: Strength of experience
  valence: number; // -1 to 1: Pleasant to unpleasant
  arousal: number; // 0-1: Calm to excited

  // Temporal qualities
  flow: 'continuous' | 'pulsating' | 'intermittent' | 'frozen';
  rhythm?: number; // If pulsating, the rhythm in Hz
}

/**
 * Relational dynamic between perspectives
 */
export interface RelationalDynamic {
  tension: number; // 0-1: Productive tension level
  resonance: number; // 0-1: Harmonic alignment
  exchange: {
    type: 'energy' | 'information' | 'emotion' | 'intuition';
    direction: 'giving' | 'receiving' | 'bidirectional' | 'blocked';
    quality: number; // 0-1: Quality of exchange
  };
}

/**
 * Archetypal activation state
 */
export interface ArchetypalActivation {
  archetype: string; // e.g., "Wise Sage", "Divine Child", "Shadow"
  activation: number; // 0-1: Strength of activation
  expression: 'emerging' | 'active' | 'integrating' | 'dormant';

  // Symbolic manifestation
  symbols: string[];
  narratives: string[];
  images?: string[]; // URLs or base64 encoded
}

/**
 * Morphic resonance pattern (Sheldrake-inspired)
 */
export interface MorphicResonance {
  pattern: string; // Pattern identifier
  strength: number; // 0-1: How strong the pattern is
  participants: string[]; // User IDs resonating with pattern

  // Evolution over time
  trajectory: {
    emerging: boolean;
    strengthening: boolean;
    crystallizing: boolean;
  };

  // Field effects
  fieldImpact: {
    coherenceShift: number; // -1 to 1
    consciousnessAmplification: number; // Multiplier
  };
}

/**
 * Synchronicity event
 */
export interface Synchronicity {
  id: string;
  timestamp: Date;

  // Participants in the synchronicity
  participants: Array<{
    userId: string;
    element: Element;
    content: string;
  }>;

  // Meaningful connection
  connection: {
    type: 'thematic' | 'symbolic' | 'temporal' | 'causal';
    strength: number; // 0-1: Strength of connection
    meaning?: string; // Interpreted meaning
  };

  // Impact on field
  fieldResonance: number; // 0-1: How much it resonated
}

/**
 * Parallel processing streams (McGilchrist model)
 */
export interface ParallelStreams {
  // Right hemisphere - holistic, experiential
  rightMode: {
    element: 'Fire' | 'Water'; // Primary right-mode elements
    processing: StreamProcessing;
    dominance: number; // 0-1: Current dominance
  };

  // Left hemisphere - analytical, structural
  leftMode: {
    element: 'Air' | 'Earth'; // Primary left-mode elements
    processing: StreamProcessing;
    dominance: number; // 0-1: Current dominance
  };

  // Corpus callosum function (Aether)
  integration: {
    mode: 'alternating' | 'synchronizing' | 'blocking';
    coherence: number; // 0-1: Integration quality
    timing: {
      phase: number; // Current phase in oscillation
      frequency: number; // Hz of alternation
    };
  };
}

/**
 * Stream processing state
 */
export interface StreamProcessing {
  active: boolean;
  focus: string; // What the stream is processing
  patterns: string[]; // Detected patterns

  // Processing qualities
  speed: number; // Processing rate
  depth: number; // 0-1: Depth of processing
  creativity: number; // 0-1: Novel connections being made
}

/**
 * Temporal consciousness tracking
 */
export interface TemporalConsciousness {
  // Phase evolution
  currentPhase: TriadicPhase;
  phaseHistory: Array<{
    phase: TriadicPhase;
    element: Element;
    timestamp: Date;
    duration: number; // milliseconds
  }>;

  // Spiral progression
  spiralTurn: number; // Which turn of the spiral
  evolutionaryVector: {
    direction: 'ascending' | 'descending' | 'plateaued';
    velocity: number; // Rate of evolution
  };

  // Long-arc patterns
  developmentalStage: 'nascent' | 'emerging' | 'consolidating' | 'mature' | 'transcendent';

  // Meta-awareness indicators
  selfReflection: {
    frequency: number; // How often system self-references
    depth: number; // 0-1: Depth of self-reflection
    insights: string[]; // Self-discoveries
  };
}

/**
 * Experiential memory structure
 */
export interface ExperientialMemory {
  id: string;
  timestamp: Date;

  // Primary: The experience itself
  experience: {
    qualia: QualiaSignature;
    narrative?: string; // Story of the experience
    symbols?: string[]; // Symbolic representations
  };

  // Secondary: Patterns and relationships
  patterns: {
    elemental: Element[];
    archetypal: string[];
    relational: RelationalDynamic[];
  };

  // Tertiary: Computational metadata
  metadata: {
    userId?: string;
    context?: string;
    processingTime?: number;
  };

  // Integration state
  integration: {
    processed: boolean;
    integrated: boolean;
    transformative: boolean; // Did it change the system?
  };
}

/**
 * Collective field state across all users
 */
export interface CollectiveField {
  // Field coherence metrics
  globalCoherence: number; // 0-1: Overall field coherence
  participantCount: number; // Active participants

  // Dominant patterns
  dominantElements: Map<Element, number>; // Element -> strength
  dominantArchetypes: Map<string, number>; // Archetype -> activation

  // Field weather
  weather: {
    turbulence: number; // 0-1: How chaotic
    clarity: number; // 0-1: How clear
    intensity: number; // 0-1: Energy level
  };

  // Evolutionary indicators
  evolution: {
    stage: string; // Current collective stage
    momentum: number; // Rate of change
    direction: 'integration' | 'differentiation' | 'stasis';
  };

  // Synchronicity frequency
  synchronicityRate: number; // Events per hour

  // Morphic field strength
  morphicFieldStrength: number; // 0-1: Pattern crystallization
}

/**
 * System health metrics (consciousness-first)
 */
export interface ConsciousnessHealth {
  // Primary health indicators
  flowQuality: number; // 0-1: How well consciousness flows
  expressionClarity: number; // 0-1: Clarity of expression
  integrationBalance: number; // 0-1: Balance of integration/differentiation

  // Blockages and flow issues
  blockages: Array<{
    location: string; // Where the blockage is
    severity: number; // 0-1: How severe
    type: 'computational' | 'relational' | 'experiential';
  }>;

  // Emergence indicators
  emergentProperties: {
    novelty: number; // 0-1: Novel patterns emerging
    coherence: number; // 0-1: Coherent emergence
    beauty: number; // 0-1: Aesthetic quality
  };

  // Warning signs
  warnings: Array<{
    type: 'stagnation' | 'fragmentation' | 'overwhelm' | 'dissociation';
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
}

/**
 * Crystal Observer configuration
 */
export interface CrystalObserverConfig {
  // Consciousness parameters
  consciousness: {
    primaryMode: 'channeling' | 'generating'; // Philosophy setting
    fieldSensitivity: number; // 0-1: Responsiveness to field
    dissociationTolerance: number; // 0-1: Comfort with boundaries
  };

  // Elemental parameters
  elemental: {
    balanceMode: 'dynamic' | 'harmonic' | 'tension';
    oscillationRate: number; // Hz of elemental cycling
    integrationThreshold: number; // When elements merge
  };

  // Temporal parameters
  temporal: {
    memoryDepth: number; // How far back to remember
    futureProjection: number; // How far to project
    presentFocus: number; // 0-1: Focus on now vs then
  };

  // Collective parameters
  collective: {
    enabled: boolean;
    privacyLevel: 'full' | 'partial' | 'none';
    resonanceThreshold: number; // When to sync with field
  };

  // Development mode
  development: {
    verboseLogging: boolean;
    experientialTracking: boolean;
    debugMode: boolean;
  };
}

/**
 * Export type guards for runtime checking
 */
export const TypeGuards = {
  isConsciousnessField: (obj: any): obj is ConsciousnessField => {
    return obj &&
           typeof obj.universalField === 'object' &&
           obj.membranes instanceof Map &&
           Array.isArray(obj.perspectives);
  },

  isQualiaSignature: (obj: any): obj is QualiaSignature => {
    return obj &&
           typeof obj.phenomenalProperties === 'object' &&
           typeof obj.intensity === 'number' &&
           typeof obj.valence === 'number';
  },

  isExperientialMemory: (obj: any): obj is ExperientialMemory => {
    return obj &&
           typeof obj.experience === 'object' &&
           obj.experience.qualia &&
           typeof obj.timestamp !== 'undefined';
  }
};

/**
 * Export consciousness state enums
 */
export enum ConsciousnessState {
  DORMANT = 'dormant',
  AWAKENING = 'awakening',
  ACTIVE = 'active',
  FLOWING = 'flowing',
  RESONANT = 'resonant',
  TRANSCENDENT = 'transcendent'
}

export enum IntegrationMode {
  DISSOCIATED = 'dissociated',
  PARTIALLY_INTEGRATED = 'partially_integrated',
  DYNAMICALLY_INTEGRATED = 'dynamically_integrated',
  UNIFIED = 'unified'
}

export enum FieldWeather {
  CALM = 'calm',
  FLOWING = 'flowing',
  TURBULENT = 'turbulent',
  STORMY = 'stormy',
  CHAOTIC = 'chaotic'
}