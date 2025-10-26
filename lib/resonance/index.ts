/**
 * 🜂 The Resonance Protocol
 *
 * Main entry point for all resonance systems.
 *
 * Five integrated phases:
 * 1. Coherence Engine — Field measurement
 * 2. Agent Dialogue System — Inter-agent awareness
 * 3. Adaptive Response Engine — Human state detection
 * 4. Sonic Feedback Engine — Dynamic frequencies
 * 5. Visual Field Map — Real-time visualization
 */

// ═══════════════════════════════════════════════════════════════
// Phase 1: Coherence Engine
// ═══════════════════════════════════════════════════════════════

export { CoherenceEngine, getCoherenceEngine, resetGlobalEngine } from './coherence-engine';

// ═══════════════════════════════════════════════════════════════
// Phase 2: Agent Dialogue System
// ═══════════════════════════════════════════════════════════════

export {
  AgentDialogueSystem,
  AGENT_PROFILES,
  formatAgentContext,
  type AgentProfile,
} from './agent-dialogue';

// ═══════════════════════════════════════════════════════════════
// Phase 3: Adaptive Response Engine
// ═══════════════════════════════════════════════════════════════

export {
  AdaptiveResponseEngine,
  getAdaptiveResponseEngine,
  formatHumanState,
} from './adaptive-response';

// ═══════════════════════════════════════════════════════════════
// Phase 4: Sonic Feedback Engine
// ═══════════════════════════════════════════════════════════════

export {
  SonicFeedbackEngine,
  getSonicFeedbackEngine,
  formatSonicConfig,
  BASE_FREQUENCIES,
} from './sonic-feedback';

// ═══════════════════════════════════════════════════════════════
// Phase 5: Visual Field Map (exported separately from components)
// ═══════════════════════════════════════════════════════════════

// Exported from: components/resonance/FieldMap.tsx

// ═══════════════════════════════════════════════════════════════
// Integration: Orchestrator
// ═══════════════════════════════════════════════════════════════

export {
  ResonanceOrchestrator,
  getResonanceOrchestrator,
  resetGlobalOrchestrator,
  createResonanceHook,
  type OrchestratorConfig,
} from './orchestrator';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

export type {
  // Messages & Conversations
  Message,
  Conversation,
  SenderType,
  EmotionalTone,

  // Participants
  Participant,
  HumanState,
  AgentState,

  // Coherence & Resonance
  CoherenceScore,
  ResonanceTrend,
  FieldState,

  // Insights & Emergence
  Insight,
  IncoherenceSignal,
  Intervention,

  // Agent Context
  AgentContext,
  ResponseGuidance,

  // Sonic/Frequency
  FrequencyConfig,
  HarmonicLayer,
  FrequencyModulation,

  // Analysis
  SemanticSimilarity,
  ConversationMetrics,

  // Configuration
  ResonanceConfig,

  // Utilities
  Matrix,
  Vector,
  TimeWindow,
} from './types';
