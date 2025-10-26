/**
 * 🜂 The Resonance Protocol - Type Definitions
 *
 * Core types for dynamic agent coherence and field awareness.
 */

// ═══════════════════════════════════════════════════════════════
// Message & Conversation Types
// ═══════════════════════════════════════════════════════════════

export type SenderType = 'human' | 'agent';

export type EmotionalTone =
  | 'calm'
  | 'excited'
  | 'stressed'
  | 'curious'
  | 'blocked'
  | 'joyful'
  | 'contemplative'
  | 'uncertain';

export interface Message {
  id: string;
  senderId: string;
  senderType: SenderType;
  content: string;
  timestamp: Date;
  embedding?: number[];  // Semantic vector representation
  emotionalTone?: EmotionalTone;
  metadata?: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  messages: Message[];
  participants: Participant[];
  startedAt: Date;
  lastActivity: Date;
}

// ═══════════════════════════════════════════════════════════════
// Participant Types
// ═══════════════════════════════════════════════════════════════

export interface Participant {
  id: string;
  type: SenderType;
  name: string;
  role?: string;  // For agents: "cognitive-light-cone", "bioelectric", etc.
  currentState?: HumanState | AgentState;
}

export interface HumanState {
  emotional: 'calm' | 'excited' | 'stressed' | 'curious' | 'blocked';
  cognitive: 'clear' | 'confused' | 'integrating' | 'searching';
  energy: 'high' | 'medium' | 'low';
  needsSpace: boolean;
}

export interface AgentState {
  active: boolean;
  lastResponse: Date;
  coherenceWithField: number;  // 0-1
  recentFocus: string[];  // Topics or themes
}

// ═══════════════════════════════════════════════════════════════
// Coherence & Resonance Types
// ═══════════════════════════════════════════════════════════════

export type ResonanceTrend = 'converging' | 'diverging' | 'stable' | 'oscillating';

export interface CoherenceScore {
  overall: number;  // 0-1, overall field coherence
  pairwise: Map<string, Map<string, number>>;  // Participant-to-participant alignment
  trend: ResonanceTrend;
  confidence: number;  // How certain we are about this measurement
}

export interface FieldState {
  coherenceScore: number;  // 0-1
  trend: ResonanceTrend;
  participants: Participant[];
  resonanceMatrix: number[][];  // NxN matrix of alignment scores
  emergentInsights: Insight[];
  sonicProfile: FrequencyConfig;
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════
// Insight & Emergence Types
// ═══════════════════════════════════════════════════════════════

export interface Insight {
  id: string;
  content: string;
  novelty: number;  // 0-1, how new/unexpected
  alignment: number;  // 0-1, how much it aligns with field
  emergenceScore: number;  // novelty * alignment
  contributors: string[];  // IDs of participants who contributed
  timestamp: Date;
}

export interface IncoherenceSignal {
  type: 'semantic-drift' | 'emotional-mismatch' | 'circular-dialogue' | 'fragmentation';
  severity: number;  // 0-1
  affectedParticipants: string[];
  suggestedIntervention?: Intervention;
}

export interface Intervention {
  type: 'clarifying-question' | 'reflection' | 'pause' | 'grounding';
  content: string;
  targetParticipant?: string;
}

// ═══════════════════════════════════════════════════════════════
// Agent Context Types
// ═══════════════════════════════════════════════════════════════

export interface AgentContext {
  agentId: string;
  role: string;
  recentMessages: Message[];
  otherAgentMessages: Map<string, Message[]>;  // Other agents' contributions
  humanState?: HumanState;
  fieldCoherence: number;
  fieldTrend: ResonanceTrend;
  shouldRespond: boolean;  // Should this agent respond now?
  responseGuidance?: ResponseGuidance;
}

export interface ResponseGuidance {
  suggestedTone: 'spacious' | 'precise' | 'playful' | 'grounding';
  suggestedDepth: 'surface' | 'moderate' | 'deep';
  complementOrDiverge: 'complement' | 'diverge' | 'synthesize';
  buildOnAgent?: string;  // ID of agent to build on
}

// ═══════════════════════════════════════════════════════════════
// Sonic/Frequency Types
// ═══════════════════════════════════════════════════════════════

export interface FrequencyConfig {
  baseFrequency: number;  // Hz
  harmonics: HarmonicLayer[];
  volume: number;  // 0-1
  modulation?: FrequencyModulation;
}

export interface HarmonicLayer {
  frequency: number;  // Hz
  amplitude: number;  // 0-1
  phase: number;  // 0-2π
  name: string;  // e.g., "Schumann", "Alpha", "Theta"
}

export interface FrequencyModulation {
  type: 'amplitude' | 'frequency' | 'phase';
  rate: number;  // Hz
  depth: number;  // 0-1
}

// ═══════════════════════════════════════════════════════════════
// Semantic Analysis Types
// ═══════════════════════════════════════════════════════════════

export interface SemanticSimilarity {
  score: number;  // 0-1
  method: 'cosine' | 'euclidean' | 'jaccard' | 'semantic-kernel';
  confidence: number;
}

export interface ConversationMetrics {
  averageCoherence: number;
  coherenceVariance: number;
  trendStability: number;
  insightFrequency: number;  // Insights per message
  participantBalance: number;  // How evenly distributed participation is
}

// ═══════════════════════════════════════════════════════════════
// Configuration Types
// ═══════════════════════════════════════════════════════════════

export interface ResonanceConfig {
  coherenceThreshold: number;  // Below this, trigger intervention
  insightThreshold: number;  // novelty * alignment threshold for "insight"
  trendWindowSize: number;  // How many messages to analyze for trend
  semanticAnalysisMethod: 'simple' | 'embedding' | 'llm';
  enableSonicFeedback: boolean;
  enableVisualFeedback: boolean;
}

// ═══════════════════════════════════════════════════════════════
// Utility Types
// ═══════════════════════════════════════════════════════════════

export type Matrix = number[][];

export interface Vector {
  values: number[];
  dimension: number;
}

export interface TimeWindow {
  start: Date;
  end: Date;
  duration: number;  // milliseconds
}
