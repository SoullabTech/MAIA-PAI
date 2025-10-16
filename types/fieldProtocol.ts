/**
 * Spiralogic Field Protocol Types
 * Framework for documenting lived experiences, revelations, and insights
 * within consciousness exploration
 */

// Elemental framework types
export type Element = 'Fire' | 'Water' | 'Air' | 'Earth' | 'Void';
export type TriadicPhase = 'Creation' | 'Sustenance' | 'Dissolution';

// Five-stage observation cycle
export type ObservationStage =
  | 'Observation'
  | 'Interpretation'
  | 'Integration'
  | 'Reflection'
  | 'Transmission';

// Validation criteria
export enum ValidationCriteria {
  TEMPORAL_REPETITION = 'temporal_repetition',
  PSYCHOLOGICAL_TRANSFORMATION = 'psychological_transformation',
  ARCHETYPAL_ALIGNMENT = 'archetypal_alignment',
  SYMBOLIC_TRANSLATION = 'symbolic_translation'
}

// Field Record structure
export interface FieldRecord {
  id: string;
  // Temporal and spatial coordinates
  timestamp: Date;
  location: {
    physical?: string;
    energetic?: string;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
  };

  // Elemental context
  elementalContext: {
    dominant: Element[];
    triadicPhase: TriadicPhase;
    resonance: number; // 0-1 scale
  };

  // Core observation data
  phenomenon: {
    description: string;
    objectiveMarkers?: string[];
    duration?: number; // in minutes
  };

  // Symbolic and archetypal data
  symbolic: {
    imagery?: string[];
    archetypes?: string[];
    planetaryResonance?: string[];
    mythicMotifs?: string[];
  };

  // Physiological and emotional data
  somatic: {
    sensations?: string[];
    emotionalTone?: string;
    autonomicMarkers?: {
      heartRate?: number;
      breathingPattern?: string;
      temperature?: string;
    };
  };

  // Cognitive and linguistic reflection
  cognitive: {
    insights: string[];
    verbalExpressions?: string[];
    questions?: string[];
    patterns?: string[];
  };

  // Application and integration
  application: {
    actions?: string[];
    behavioralChanges?: string[];
    perceptualShifts?: string[];
    creativeOutputs?: string[];
  };

  // Validation data
  validation: {
    selfValidation?: boolean;
    peerValidation?: {
      validatorId?: string;
      notes?: string;
      timestamp?: Date;
    }[];
    criteria: ValidationCriteria[];
    coherenceScore?: number; // 0-1 scale
    synchronicities?: string[];
  };

  // Direct member engagement
  engagement?: {
    reflections?: {
      memberId: string;
      memberName?: string;
      content: string;
      timestamp: Date;
      elementalResonance?: Element[];
      insightAmplification?: string;
    }[];
    questions?: {
      memberId: string;
      memberName?: string;
      question: string;
      timestamp: Date;
      answered?: boolean;
      response?: string;
      responseTimestamp?: Date;
    }[];
    resonanceMarkers?: {
      memberId: string;
      type: 'resonance' | 'amplification' | 'clarification' | 'integration';
      timestamp: Date;
    }[];
    collectiveThreads?: {
      threadId: string;
      title: string;
      participants: string[];
      lastActivity: Date;
    }[];
  };

  // Meta information
  meta: {
    practitionerId: string;
    visibility: 'private' | 'commons' | 'public';
    tags?: string[];
    linkedRecords?: string[]; // IDs of related records
    revisionHistory?: {
      timestamp: Date;
      changes: string;
    }[];
  };

  // Current stage in the observation cycle
  currentStage: ObservationStage;
  stageCompletions: {
    [key in ObservationStage]?: {
      completed: boolean;
      timestamp?: Date;
      notes?: string;
    };
  };
}

// Practitioner profile
export interface Practitioner {
  id: string;
  name?: string;
  anonymousId?: string;
  joinedDate: Date;

  experience: {
    totalRecords: number;
    validatedRecords: number;
    elementalAffinities: {
      [key in Element]?: number;
    };
  };

  ethics: {
    integrityScore: number;
    transparencyScore: number;
    coherenceScore: number;
  };
}

// Commons sharing structure
export interface CommonsEntry {
  recordId: string;
  sharedDate: Date;
  practitionerId: string;

  engagement: {
    views: number;
    validations: number;
    crossReferences: number;
    derivatives: string[]; // IDs of records that build upon this
  };

  resonance: {
    elementalAlignment: number;
    archetypeMatch: number;
    temporalCoherence: number;
  };
}

// Field Protocol session
export interface FieldSession {
  id: string;
  practitionerId: string;
  startTime: Date;
  endTime?: Date;

  records: FieldRecord[];

  environment: {
    setting?: string;
    participants?: number;
    modality?: 'solo' | 'dyad' | 'group' | 'collective';
    tools?: string[];
  };

  intention?: string;
  outcome?: string;
}

// Validation result
export interface ValidationResult {
  recordId: string;
  timestamp: Date;

  criteriaResults: {
    [key in ValidationCriteria]?: {
      passed: boolean;
      evidence?: string;
      confidence: number;
    };
  };

  overallValid: boolean;
  coherenceScore: number;
  recommendations?: string[];
}

// Export utility types
export type RecordFilter = {
  elements?: Element[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  practitioner?: string;
  validationStatus?: 'validated' | 'pending' | 'invalidated';
  tags?: string[];
};

export type RecordSort = {
  field: 'timestamp' | 'coherenceScore' | 'validations';
  direction: 'asc' | 'desc';
};