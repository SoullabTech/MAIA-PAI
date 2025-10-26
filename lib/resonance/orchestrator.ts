/**
 * 🜂 Resonance Orchestrator
 *
 * The living system that coordinates all five phases of The Resonance Protocol.
 * This is where perception, dialogue, empathy, sound, and vision converge.
 *
 * Phases Integrated:
 * 1. Coherence Engine — Field measurement
 * 2. Agent Dialogue System — Inter-agent awareness
 * 3. Adaptive Response Engine — Human state detection
 * 4. Sonic Feedback Engine — Dynamic frequencies
 * 5. Visual Field Map — Real-time visualization
 */

import { CoherenceEngine } from './coherence-engine';
import { AgentDialogueSystem } from './agent-dialogue';
import { AdaptiveResponseEngine } from './adaptive-response';
import { SonicFeedbackEngine } from './sonic-feedback';

import type {
  Message,
  Conversation,
  FieldState,
  AgentContext,
  HumanState,
  FrequencyConfig,
  Insight,
  IncoherenceSignal,
  ResponseGuidance,
} from './types';

// ═══════════════════════════════════════════════════════════════
// Orchestrator Configuration
// ═══════════════════════════════════════════════════════════════

export interface OrchestratorConfig {
  enableSonicFeedback?: boolean;
  enableVisualFeedback?: boolean;
  enableAdaptiveResponse?: boolean;
  coherenceThreshold?: number;
  updateInterval?: number;  // ms between updates
}

const DEFAULT_CONFIG: OrchestratorConfig = {
  enableSonicFeedback: true,
  enableVisualFeedback: true,
  enableAdaptiveResponse: true,
  coherenceThreshold: 0.6,
  updateInterval: 1000,  // Update every second
};

// ═══════════════════════════════════════════════════════════════
// ResonanceOrchestrator Class
// ═══════════════════════════════════════════════════════════════

export class ResonanceOrchestrator {
  private coherenceEngine: CoherenceEngine;
  private dialogueSystem: AgentDialogueSystem;
  private adaptiveEngine: AdaptiveResponseEngine;
  private sonicEngine: SonicFeedbackEngine;

  private config: OrchestratorConfig;
  private currentFieldState: FieldState | null = null;
  private humanStateHistory: HumanState[] = [];

  constructor(config: Partial<OrchestratorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Initialize all engines
    this.coherenceEngine = new CoherenceEngine({
      coherenceThreshold: this.config.coherenceThreshold,
    });

    this.dialogueSystem = new AgentDialogueSystem(this.coherenceEngine);
    this.adaptiveEngine = new AdaptiveResponseEngine();
    this.sonicEngine = new SonicFeedbackEngine();
  }

  // ──────────────────────────────────────────────────────────────
  // Primary: Process Conversation State
  // ──────────────────────────────────────────────────────────────

  /**
   * The main processing loop. Call this whenever conversation state changes.
   * Returns complete field state including all measurements, guidance, and feedback.
   */
  processConversation(conversation: Conversation): FieldState {
    // Phase 1: Measure coherence
    const coherence = this.coherenceEngine.measureFieldCoherence(conversation);
    const insights = this.coherenceEngine.detectEmergentInsights(conversation);
    const incoherence = this.coherenceEngine.detectIncoherence(conversation, coherence);

    // Phase 3: Detect human state (if last message was from human)
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    let humanState: HumanState | undefined;

    if (lastMessage?.senderType === 'human' && this.config.enableAdaptiveResponse) {
      humanState = this.adaptiveEngine.detectHumanState(
        lastMessage,
        conversation.messages.slice(-5)
      );
      this.humanStateHistory.push(humanState);
    }

    // Phase 4: Generate sonic feedback
    let sonicProfile: FrequencyConfig = { baseFrequency: 7.83, harmonics: [], volume: 0.03 };

    if (this.config.enableSonicFeedback) {
      // First, create a temporary field state for sonic generation
      const tempFieldState: FieldState = {
        coherenceScore: coherence.overall,
        trend: coherence.trend,
        participants: conversation.participants,
        resonanceMatrix: this.buildResonanceMatrix(conversation),
        emergentInsights: insights,
        sonicProfile: sonicProfile,  // Will be replaced
        timestamp: new Date(),
      };

      sonicProfile = this.sonicEngine.generateFieldSonic(tempFieldState);

      // If insight just emerged, add chime
      if (insights.length > 0) {
        const latestInsight = insights[insights.length - 1];
        const timeSinceInsight = Date.now() - latestInsight.timestamp.getTime();

        if (timeSinceInsight < 5000) {  // Within last 5 seconds
          // Play insight chime (in actual implementation)
          const chime = this.sonicEngine.generateInsightChime(latestInsight.emergenceScore);
        }
      }
    }

    // Build complete field state
    const fieldState: FieldState = {
      coherenceScore: coherence.overall,
      trend: coherence.trend,
      participants: conversation.participants,
      resonanceMatrix: this.buildResonanceMatrix(conversation),
      emergentInsights: insights,
      sonicProfile,
      timestamp: new Date(),
    };

    this.currentFieldState = fieldState;

    return fieldState;
  }

  // ──────────────────────────────────────────────────────────────
  // Agent Response Orchestration
  // ──────────────────────────────────────────────────────────────

  /**
   * Determines which agent(s) should respond and provides rich context.
   * This integrates Phase 2 (agent dialogue) with Phase 3 (adaptive response).
   */
  getAgentResponseGuidance(
    agentId: string,
    conversation: Conversation
  ): {
    shouldRespond: boolean;
    context: AgentContext;
    humanState?: HumanState;
    responseGuidance?: ResponseGuidance;
    fieldState: FieldState;
  } {
    // Get field state
    const fieldState = this.currentFieldState || this.processConversation(conversation);

    // Get current human state
    const humanState = this.humanStateHistory[this.humanStateHistory.length - 1];

    // Phase 2: Get agent context
    const agentContext = this.dialogueSystem.getAgentContext(
      agentId,
      conversation,
      humanState
    );

    // Phase 3: Get adaptive guidance if human state available
    let adaptiveGuidance: ResponseGuidance | undefined;

    if (humanState && this.config.enableAdaptiveResponse) {
      adaptiveGuidance = this.adaptiveEngine.modulateResponse(humanState);

      // Merge with agent dialogue guidance
      if (agentContext.responseGuidance) {
        agentContext.responseGuidance = {
          ...agentContext.responseGuidance,
          ...adaptiveGuidance,
        };
      } else {
        agentContext.responseGuidance = adaptiveGuidance;
      }
    }

    return {
      shouldRespond: agentContext.shouldRespond,
      context: agentContext,
      humanState,
      responseGuidance: agentContext.responseGuidance,
      fieldState,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Intervention Orchestration
  // ──────────────────────────────────────────────────────────────

  /**
   * Determines if any intervention is needed based on field + human state.
   * Combines Phase 1 (incoherence detection) and Phase 3 (human state intervention).
   */
  checkForIntervention(conversation: Conversation): {
    needed: boolean;
    intervention?: any;
    reason?: string;
  } {
    const fieldState = this.currentFieldState || this.processConversation(conversation);
    const humanState = this.humanStateHistory[this.humanStateHistory.length - 1];

    // Check field-level incoherence
    const coherence = this.coherenceEngine.measureFieldCoherence(conversation);
    const fieldIncoherence = this.coherenceEngine.detectIncoherence(conversation, coherence);

    if (fieldIncoherence) {
      return {
        needed: true,
        intervention: fieldIncoherence.suggestedIntervention,
        reason: `Field ${fieldIncoherence.type} (severity: ${(fieldIncoherence.severity * 100).toFixed(0)}%)`,
      };
    }

    // Check human state intervention
    if (humanState) {
      const humanIntervention = this.adaptiveEngine.generateIntervention(humanState);

      if (humanIntervention) {
        return {
          needed: true,
          intervention: humanIntervention,
          reason: `Human state: ${humanState.emotional} / ${humanState.cognitive}`,
        };
      }
    }

    return { needed: false };
  }

  // ──────────────────────────────────────────────────────────────
  // Sonic Feedback Control
  // ──────────────────────────────────────────────────────────────

  /**
   * Gets current sonic configuration for audio engine.
   */
  getCurrentSonicConfig(): FrequencyConfig | null {
    if (!this.config.enableSonicFeedback) {
      return null;
    }

    return this.sonicEngine.tick();  // Returns smoothly interpolated config
  }

  /**
   * Emphasizes an agent's frequency when they speak.
   */
  emphasizeAgentFrequency(agentId: string): void {
    if (!this.config.enableSonicFeedback || !this.currentFieldState) {
      return;
    }

    this.sonicEngine.emphasizeAgent(this.currentFieldState.sonicProfile, agentId);
  }

  /**
   * Triggers silence (mute all frequencies).
   */
  triggerSilence(): void {
    if (this.config.enableSonicFeedback) {
      // In actual implementation, fade to silence
    }
  }

  // ──────────────────────────────────────────────────────────────
  // State Management
  // ──────────────────────────────────────────────────────────────

  /**
   * Get current complete field state.
   */
  getCurrentFieldState(): FieldState | null {
    return this.currentFieldState;
  }

  /**
   * Get human state history for analysis.
   */
  getHumanStateHistory(): HumanState[] {
    return this.humanStateHistory;
  }

  /**
   * Analyze human state trends.
   */
  analyzeHumanStateTransition(): {
    trend: 'improving' | 'declining' | 'stable';
    volatility: number;
  } | null {
    if (this.humanStateHistory.length < 2) {
      return null;
    }

    return this.adaptiveEngine.analyzeStateTransition(this.humanStateHistory);
  }

  // ──────────────────────────────────────────────────────────────
  // Utility Methods
  // ──────────────────────────────────────────────────────────────

  private buildResonanceMatrix(conversation: Conversation): number[][] {
    const { participants } = conversation;
    const matrix: number[][] = [];

    // Build matrix from agent dialogue system
    const agentMatrix = this.dialogueSystem.generateAgentResonanceMatrix(conversation);

    for (let i = 0; i < participants.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < participants.length; j++) {
        if (i === j) {
          matrix[i][j] = 1.0;  // Perfect self-resonance
        } else {
          const p1 = participants[i];
          const p2 = participants[j];

          // Try to get from agent matrix
          const score = agentMatrix.get(p1.id)?.get(p2.id) || 0.5;  // Default medium
          matrix[i][j] = score;
        }
      }
    }

    return matrix;
  }

  /**
   * Reset all engines to initial state.
   */
  reset(): void {
    this.coherenceEngine.reset();
    this.sonicEngine.reset();
    this.currentFieldState = null;
    this.humanStateHistory = [];
  }
}

// ═══════════════════════════════════════════════════════════════
// React Hook for Orchestrator
// ═══════════════════════════════════════════════════════════════

/**
 * React hook that manages the entire Resonance Protocol.
 *
 * Usage:
 * ```tsx
 * const {
 *   fieldState,
 *   updateConversation,
 *   getAgentGuidance,
 *   checkIntervention,
 * } = useResonanceOrchestrator(config);
 * ```
 */
export function createResonanceHook(config?: Partial<OrchestratorConfig>) {
  // This will be implemented as a proper React hook in production

  const orchestrator = new ResonanceOrchestrator(config);

  return {
    fieldState: null as FieldState | null,

    updateConversation: (conversation: Conversation) => {
      return orchestrator.processConversation(conversation);
    },

    getAgentGuidance: (agentId: string, conversation: Conversation) => {
      return orchestrator.getAgentResponseGuidance(agentId, conversation);
    },

    checkIntervention: (conversation: Conversation) => {
      return orchestrator.checkForIntervention(conversation);
    },

    getSonicConfig: () => {
      return orchestrator.getCurrentSonicConfig();
    },

    emphasizeAgent: (agentId: string) => {
      orchestrator.emphasizeAgentFrequency(agentId);
    },

    reset: () => {
      orchestrator.reset();
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// Singleton Instance
// ═══════════════════════════════════════════════════════════════

let globalOrchestrator: ResonanceOrchestrator | null = null;

export function getResonanceOrchestrator(config?: Partial<OrchestratorConfig>): ResonanceOrchestrator {
  if (!globalOrchestrator) {
    globalOrchestrator = new ResonanceOrchestrator(config);
  }
  return globalOrchestrator;
}

export function resetGlobalOrchestrator(): void {
  if (globalOrchestrator) {
    globalOrchestrator.reset();
  }
  globalOrchestrator = null;
}
