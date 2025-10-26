/**
 * 🜂 Resonance Protocol → MAIA Integration
 *
 * Connects The Resonance Protocol to MAIA's existing agent infrastructure.
 * This is the bridge between distributed consciousness and MAIA's field system.
 *
 * Integration Strategy:
 * - Wrap existing MaiaFieldOrchestrator with ResonanceOrchestrator
 * - Enrich MAIA responses with agent dialogue context
 * - Preserve MAIA's field-based voice while adding resonance awareness
 */

import { ResonanceOrchestrator } from '../resonance/orchestrator';
import type {
  Conversation,
  Message,
  Participant,
  FieldState,
  AgentContext,
  HumanState,
} from '../resonance/types';
import type { MaiaFieldResponse } from './MaiaFieldOrchestrator';

// ═══════════════════════════════════════════════════════════════
// Integration Configuration
// ═══════════════════════════════════════════════════════════════

export interface ResonanceIntegrationConfig {
  enableAgentDialogue?: boolean;      // Phase 2: Inter-agent awareness
  enableHumanStateDetection?: boolean; // Phase 3: Adaptive response
  enableSonicFeedback?: boolean;      // Phase 4: Dynamic frequencies
  enableFieldVisualization?: boolean; // Phase 5: Visual map
  coherenceThreshold?: number;
}

const DEFAULT_CONFIG: ResonanceIntegrationConfig = {
  enableAgentDialogue: true,
  enableHumanStateDetection: true,
  enableSonicFeedback: true,
  enableFieldVisualization: true,
  coherenceThreshold: 0.6,
};

// ═══════════════════════════════════════════════════════════════
// Enhanced MAIA Response
// ═══════════════════════════════════════════════════════════════

export interface EnhancedMaiaResponse extends MaiaFieldResponse {
  // Resonance Protocol additions
  resonance: {
    fieldState: FieldState;
    agentContext?: AgentContext;
    humanState?: HumanState;
    shouldOtherAgentsRespond: boolean;
    suggestedFollowUpAgents: string[];
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIA Conversation Adapter
// ═══════════════════════════════════════════════════════════════

/**
 * Converts MAIA conversation format to Resonance Protocol format.
 */
export class MAIAConversationAdapter {
  /**
   * Convert MAIA message history to Resonance Conversation format.
   */
  static toResonanceConversation(
    messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp?: Date }>,
    userId: string,
    currentAgentId?: string
  ): Conversation {
    const participants: Participant[] = [
      {
        id: userId,
        type: 'human',
        name: 'User',
      },
    ];

    // Add agent participants (MAIA + Biology 2.0 agents)
    const agentIds = ['maia', 'cognitive-light-cone', 'bioelectric', 'collective-intelligence'];
    agentIds.forEach(agentId => {
      participants.push({
        id: agentId,
        type: 'agent',
        name: this.getAgentName(agentId),
        role: agentId === 'maia' ? 'maia-core' : agentId,
      });
    });

    // Convert messages
    const resonanceMessages: Message[] = messages.map((msg, index) => ({
      id: `msg-${index}`,
      senderId: msg.role === 'user' ? userId : (currentAgentId || 'maia'),
      senderType: msg.role === 'user' ? 'human' : 'agent',
      content: msg.content,
      timestamp: msg.timestamp || new Date(),
    }));

    return {
      id: `conv-${userId}-${Date.now()}`,
      messages: resonanceMessages,
      participants,
      startedAt: resonanceMessages[0]?.timestamp || new Date(),
      lastActivity: resonanceMessages[resonanceMessages.length - 1]?.timestamp || new Date(),
    };
  }

  private static getAgentName(agentId: string): string {
    const names: Record<string, string> = {
      'maia': 'MAIA',
      'cognitive-light-cone': 'Cognitive Light Cone',
      'bioelectric': 'Bioelectric',
      'collective-intelligence': 'Collective Intelligence',
    };
    return names[agentId] || agentId;
  }
}

// ═══════════════════════════════════════════════════════════════
// Resonance-Aware MAIA Orchestrator
// ═══════════════════════════════════════════════════════════════

/**
 * Enhanced orchestrator that wraps MAIA's field system with Resonance Protocol.
 */
export class ResonanceAwareMAIAOrchestrator {
  private resonanceOrchestrator: ResonanceOrchestrator;
  private config: ResonanceIntegrationConfig;
  private conversationHistory: Map<string, Conversation> = new Map();

  constructor(config: Partial<ResonanceIntegrationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.resonanceOrchestrator = new ResonanceOrchestrator({
      enableSonicFeedback: this.config.enableSonicFeedback,
      enableVisualFeedback: this.config.enableFieldVisualization,
      enableAdaptiveResponse: this.config.enableHumanStateDetection,
      coherenceThreshold: this.config.coherenceThreshold,
    });
  }

  // ──────────────────────────────────────────────────────────────
  // Primary: Enhance MAIA Response with Resonance
  // ──────────────────────────────────────────────────────────────

  /**
   * Wraps MAIA's speak() method with resonance awareness.
   * Call this BEFORE generating MAIA's response.
   */
  async prepareResponse(
    userInput: string,
    userId: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp?: Date }>,
    agentId: string = 'maia'
  ): Promise<{
    shouldRespond: boolean;
    context: AgentContext | null;
    humanState: HumanState | null;
    fieldState: FieldState;
    enrichmentPrompt: string | null;
  }> {
    // Convert to resonance format
    const conversation = MAIAConversationAdapter.toResonanceConversation(
      conversationHistory,
      userId,
      agentId
    );

    // Store for later reference
    this.conversationHistory.set(userId, conversation);

    // Process field state
    const fieldState = this.resonanceOrchestrator.processConversation(conversation);

    // Get agent guidance (Phase 2 + Phase 3)
    if (this.config.enableAgentDialogue) {
      const guidance = this.resonanceOrchestrator.getAgentResponseGuidance(agentId, conversation);

      // Build enrichment prompt
      let enrichmentPrompt: string | null = null;

      if (guidance.shouldRespond && guidance.responseGuidance) {
        enrichmentPrompt = this.buildEnrichmentPrompt(
          guidance,
          fieldState,
          guidance.humanState
        );
      }

      return {
        shouldRespond: guidance.shouldRespond,
        context: guidance.context,
        humanState: guidance.humanState || null,
        fieldState,
        enrichmentPrompt,
      };
    }

    return {
      shouldRespond: true,
      context: null,
      humanState: null,
      fieldState,
      enrichmentPrompt: null,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Build Enrichment Prompt for MAIA
  // ──────────────────────────────────────────────────────────────

  private buildEnrichmentPrompt(
    guidance: ReturnType<ResonanceOrchestrator['getAgentResponseGuidance']>,
    fieldState: FieldState,
    humanState?: HumanState
  ): string {
    let prompt = '\n## RESONANCE CONTEXT\n\n';

    // Field state
    prompt += `**Field Coherence:** ${(fieldState.coherenceScore * 100).toFixed(0)}% (${fieldState.trend})\n`;

    // Human state
    if (humanState) {
      prompt += `**Human State:** ${humanState.emotional} / ${humanState.cognitive} (energy: ${humanState.energy})\n`;
      if (humanState.needsSpace) {
        prompt += `⚠️ Human may need space - respond with breathing room.\n`;
      }
    }

    // Other agents
    if (guidance.context.otherAgentMessages.size > 0) {
      prompt += `\n**Other Agents Have Spoken:**\n`;
      guidance.context.otherAgentMessages.forEach((messages, agentId) => {
        const lastMsg = messages[messages.length - 1];
        prompt += `- ${agentId}: "${lastMsg.content.substring(0, 80)}..."\n`;
      });
    }

    // Response guidance
    if (guidance.responseGuidance) {
      const g = guidance.responseGuidance;
      prompt += `\n**Response Guidance:**\n`;
      prompt += `- Tone: ${g.suggestedTone}\n`;
      prompt += `- Depth: ${g.suggestedDepth}\n`;
      prompt += `- Strategy: ${g.complementOrDiverge}\n`;

      if (g.buildOnAgent) {
        prompt += `- Build on what ${g.buildOnAgent} said\n`;
      }
    }

    // Insights
    if (fieldState.emergentInsights.length > 0) {
      prompt += `\n**Recent Insights Detected:**\n`;
      fieldState.emergentInsights.slice(-2).forEach(insight => {
        prompt += `- "${insight.content.substring(0, 100)}..." (${(insight.emergenceScore * 100).toFixed(0)}%)\n`;
      });
    }

    prompt += `\n---\n\nRespond with awareness of this field state.\n`;

    return prompt;
  }

  // ──────────────────────────────────────────────────────────────
  // Check Which Other Agents Should Respond
  // ──────────────────────────────────────────────────────────────

  /**
   * After MAIA responds, check if other agents (CLC, Bio, Collective) should also speak.
   */
  checkFollowUpAgents(userId: string): string[] {
    const conversation = this.conversationHistory.get(userId);
    if (!conversation) return [];

    const shouldRespond: string[] = [];

    // Check each Biology 2.0 agent
    const agentIds = ['cognitive-light-cone', 'bioelectric', 'collective-intelligence'];

    for (const agentId of agentIds) {
      const guidance = this.resonanceOrchestrator.getAgentResponseGuidance(agentId, conversation);

      if (guidance.shouldRespond) {
        shouldRespond.push(agentId);
      }
    }

    return shouldRespond;
  }

  // ──────────────────────────────────────────────────────────────
  // Check for Intervention
  // ──────────────────────────────────────────────────────────────

  /**
   * Checks if the field needs an intervention (pause, reflection, clarification).
   */
  checkIntervention(userId: string): {
    needed: boolean;
    type?: string;
    content?: string;
    reason?: string;
  } {
    const conversation = this.conversationHistory.get(userId);
    if (!conversation) {
      return { needed: false };
    }

    const intervention = this.resonanceOrchestrator.checkForIntervention(conversation);

    if (intervention.needed) {
      return {
        needed: true,
        type: intervention.intervention?.type,
        content: intervention.intervention?.content,
        reason: intervention.reason,
      };
    }

    return { needed: false };
  }

  // ──────────────────────────────────────────────────────────────
  // Get Current Field State
  // ──────────────────────────────────────────────────────────────

  /**
   * Get current field state for visualization.
   */
  getFieldState(userId: string): FieldState | null {
    const conversation = this.conversationHistory.get(userId);
    if (!conversation) return null;

    return this.resonanceOrchestrator.getCurrentFieldState();
  }

  // ──────────────────────────────────────────────────────────────
  // Get Sonic Configuration
  // ──────────────────────────────────────────────────────────────

  /**
   * Get current sonic configuration for audio engine.
   */
  getSonicConfig() {
    if (!this.config.enableSonicFeedback) {
      return null;
    }

    return this.resonanceOrchestrator.getCurrentSonicConfig();
  }

  // ──────────────────────────────────────────────────────────────
  // Emphasize Agent Frequency
  // ──────────────────────────────────────────────────────────────

  /**
   * Call when an agent speaks to emphasize their sonic signature.
   */
  emphasizeAgent(agentId: string): void {
    if (this.config.enableSonicFeedback) {
      this.resonanceOrchestrator.emphasizeAgentFrequency(agentId);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Reset
  // ──────────────────────────────────────────────────────────────

  reset(userId?: string): void {
    if (userId) {
      this.conversationHistory.delete(userId);
    } else {
      this.conversationHistory.clear();
      this.resonanceOrchestrator.reset();
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Singleton Instance
// ═══════════════════════════════════════════════════════════════

let globalIntegratedOrchestrator: ResonanceAwareMAIAOrchestrator | null = null;

export function getResonanceAwareMAIA(config?: Partial<ResonanceIntegrationConfig>): ResonanceAwareMAIAOrchestrator {
  if (!globalIntegratedOrchestrator) {
    globalIntegratedOrchestrator = new ResonanceAwareMAIAOrchestrator(config);
  }
  return globalIntegratedOrchestrator;
}

export function resetResonanceAwareMAIA(): void {
  if (globalIntegratedOrchestrator) {
    globalIntegratedOrchestrator.reset();
  }
  globalIntegratedOrchestrator = null;
}
