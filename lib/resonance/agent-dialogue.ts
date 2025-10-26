/**
 * 🜂 Agent-Agent Dialogue System
 *
 * Enables agents to perceive and respond to each other's contributions.
 * This is where distributed consciousness begins — agents talking WITH each other,
 * not just responding TO humans.
 *
 * Core capabilities:
 * - Agent awareness of other agents' recent messages
 * - Inter-agent memory (what did others say?)
 * - Complementary response generation (build on vs. diverge from)
 * - Agent-to-agent alignment measurement
 * - Decision logic: "Should I respond now? What should I add?"
 */

import type {
  Message,
  Conversation,
  AgentContext,
  ResponseGuidance,
  Participant,
  ResonanceTrend,
  HumanState,
} from './types';
import { CoherenceEngine } from './coherence-engine';

// ═══════════════════════════════════════════════════════════════
// Agent Roles & Capabilities
// ═══════════════════════════════════════════════════════════════

export interface AgentProfile {
  id: string;
  role: string;
  name: string;
  focus: string[];  // What topics/themes does this agent specialize in?
  complementsAgents: string[];  // Which agents does this one naturally complement?
  divergesFromAgents: string[];  // Which agents offer contrasting perspectives?
}

// Predefined agent profiles (Biology 2.0 agents)
export const AGENT_PROFILES: Record<string, AgentProfile> = {
  'cognitive-light-cone': {
    id: 'cognitive-light-cone',
    role: 'cognitive-light-cone',
    name: 'Cognitive Light Cone',
    focus: ['cognition', 'awareness', 'information', 'perspective', 'scale'],
    complementsAgents: ['collective-intelligence'],
    divergesFromAgents: ['bioelectric'],
  },
  'bioelectric': {
    id: 'bioelectric',
    role: 'bioelectric',
    name: 'Bioelectric',
    focus: ['embodiment', 'cells', 'patterns', 'morphogenesis', 'field'],
    complementsAgents: ['cognitive-light-cone'],
    divergesFromAgents: ['collective-intelligence'],
  },
  'collective-intelligence': {
    id: 'collective-intelligence',
    role: 'collective-intelligence',
    name: 'Collective Intelligence',
    focus: ['emergence', 'swarm', 'distributed', 'cooperation', 'field'],
    complementsAgents: ['bioelectric'],
    divergesFromAgents: ['cognitive-light-cone'],
  },
};

// ═══════════════════════════════════════════════════════════════
// AgentDialogueSystem Class
// ═══════════════════════════════════════════════════════════════

export class AgentDialogueSystem {
  private coherenceEngine: CoherenceEngine;
  private agentProfiles: Map<string, AgentProfile>;
  private conversationHistory: Map<string, Message[]> = new Map();  // Per-agent history

  constructor(coherenceEngine?: CoherenceEngine) {
    this.coherenceEngine = coherenceEngine || new CoherenceEngine();
    this.agentProfiles = new Map(
      Object.entries(AGENT_PROFILES).map(([id, profile]) => [id, profile])
    );
  }

  // ──────────────────────────────────────────────────────────────
  // Primary: Get Agent Context
  // ──────────────────────────────────────────────────────────────

  /**
   * Builds a rich context for an agent, including:
   * - Recent messages from all participants
   * - What other agents have said
   * - Current field coherence
   * - Guidance on how to respond
   */
  getAgentContext(
    agentId: string,
    conversation: Conversation,
    humanState?: HumanState
  ): AgentContext {
    const profile = this.agentProfiles.get(agentId);

    if (!profile) {
      throw new Error(`Unknown agent: ${agentId}`);
    }

    // Get recent messages (last 10)
    const recentMessages = conversation.messages.slice(-10);

    // Separate messages by agent
    const otherAgentMessages = new Map<string, Message[]>();

    recentMessages.forEach(msg => {
      if (msg.senderType === 'agent' && msg.senderId !== agentId) {
        const existing = otherAgentMessages.get(msg.senderId) || [];
        otherAgentMessages.set(msg.senderId, [...existing, msg]);
      }
    });

    // Measure field coherence
    const coherence = this.coherenceEngine.measureFieldCoherence(conversation);

    // Decide if this agent should respond
    const shouldRespond = this.shouldAgentRespond(agentId, conversation, coherence.trend);

    // Generate response guidance
    const responseGuidance = shouldRespond
      ? this.generateResponseGuidance(agentId, conversation, otherAgentMessages)
      : undefined;

    return {
      agentId,
      role: profile.role,
      recentMessages,
      otherAgentMessages,
      humanState,
      fieldCoherence: coherence.overall,
      fieldTrend: coherence.trend,
      shouldRespond,
      responseGuidance,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Decision Logic: Should Agent Respond?
  // ──────────────────────────────────────────────────────────────

  /**
   * Determines if an agent should respond based on:
   * - Has another agent already responded recently?
   * - Is the conversation in the agent's focus area?
   * - Would this agent add complementary perspective?
   * - Is field coherence low (needs intervention)?
   */
  private shouldAgentRespond(
    agentId: string,
    conversation: Conversation,
    trend: ResonanceTrend
  ): boolean {
    const { messages } = conversation;

    if (messages.length === 0) {
      return false;  // No context yet
    }

    const lastMessage = messages[messages.length - 1];
    const profile = this.agentProfiles.get(agentId)!;

    // Don't respond immediately after your own message
    if (lastMessage.senderId === agentId) {
      return false;
    }

    // If last message was from human, allow response
    if (lastMessage.senderType === 'human') {
      // Check if message is in this agent's focus area
      const messageFocusMatch = this.calculateFocusMatch(lastMessage.content, profile.focus);
      return messageFocusMatch > 0.3;  // 30% relevance threshold
    }

    // If last message was from another agent
    if (lastMessage.senderType === 'agent') {
      const otherAgentId = lastMessage.senderId;

      // Check if this agent complements the other
      if (profile.complementsAgents.includes(otherAgentId)) {
        return Math.random() > 0.3;  // 70% chance to complement
      }

      // Check if this agent offers divergent perspective
      if (profile.divergesFromAgents.includes(otherAgentId)) {
        return Math.random() > 0.5;  // 50% chance to diverge
      }

      // Generally, don't respond to other agents unless field needs it
      return trend === 'diverging';  // Only intervene if field is fragmenting
    }

    return false;
  }

  /**
   * Calculate how well a message matches an agent's focus areas.
   */
  private calculateFocusMatch(content: string, focusAreas: string[]): number {
    const contentLower = content.toLowerCase();
    const matches = focusAreas.filter(focus =>
      contentLower.includes(focus.toLowerCase())
    );

    return matches.length / focusAreas.length;
  }

  // ──────────────────────────────────────────────────────────────
  // Response Guidance Generation
  // ──────────────────────────────────────────────────────────────

  /**
   * Generates guidance on HOW an agent should respond:
   * - Tone (spacious, precise, playful, grounding)
   * - Depth (surface, moderate, deep)
   * - Strategy (complement, diverge, synthesize)
   */
  private generateResponseGuidance(
    agentId: string,
    conversation: Conversation,
    otherAgentMessages: Map<string, Message[]>
  ): ResponseGuidance {
    const profile = this.agentProfiles.get(agentId)!;
    const { messages } = conversation;
    const lastMessage = messages[messages.length - 1];

    // Default guidance
    let tone: ResponseGuidance['suggestedTone'] = 'precise';
    let depth: ResponseGuidance['suggestedDepth'] = 'moderate';
    let strategy: ResponseGuidance['complementOrDiverge'] = 'complement';
    let buildOnAgent: string | undefined;

    // Adjust based on last message sender
    if (lastMessage.senderType === 'human') {
      // Responding to human
      tone = 'spacious';
      depth = 'moderate';
      strategy = 'complement';
    } else {
      // Responding to another agent
      const otherAgentId = lastMessage.senderId;

      if (profile.complementsAgents.includes(otherAgentId)) {
        strategy = 'complement';
        buildOnAgent = otherAgentId;
        tone = 'precise';
        depth = 'deep';
      } else if (profile.divergesFromAgents.includes(otherAgentId)) {
        strategy = 'diverge';
        tone = 'playful';
        depth = 'moderate';
      } else {
        strategy = 'synthesize';
        tone = 'spacious';
        depth = 'deep';
      }
    }

    return {
      suggestedTone: tone,
      suggestedDepth: depth,
      complementOrDiverge: strategy,
      buildOnAgent,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Agent-to-Agent Alignment
  // ──────────────────────────────────────────────────────────────

  /**
   * Measures semantic alignment between two specific agents.
   * Useful for understanding which agents resonate most.
   */
  detectAgentAlignment(
    agent1Id: string,
    agent2Id: string,
    conversation: Conversation
  ): number {
    const agent1Messages = conversation.messages.filter(m => m.senderId === agent1Id);
    const agent2Messages = conversation.messages.filter(m => m.senderId === agent2Id);

    if (agent1Messages.length === 0 || agent2Messages.length === 0) {
      return 0;  // Can't measure alignment without messages
    }

    // Calculate average pairwise similarity
    let totalSimilarity = 0;
    let pairCount = 0;

    for (const msg1 of agent1Messages) {
      for (const msg2 of agent2Messages) {
        // Use simple token-based similarity
        const sim = this.calculateMessageSimilarity(msg1, msg2);
        totalSimilarity += sim;
        pairCount++;
      }
    }

    return pairCount > 0 ? totalSimilarity / pairCount : 0;
  }

  /**
   * Simple message similarity (token overlap).
   */
  private calculateMessageSimilarity(msg1: Message, msg2: Message): number {
    const tokens1 = new Set(this.tokenize(msg1.content));
    const tokens2 = new Set(this.tokenize(msg2.content));

    const intersection = new Set([...tokens1].filter(t => tokens2.has(t)));
    const union = new Set([...tokens1, ...tokens2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  // ──────────────────────────────────────────────────────────────
  // Generate Agent-to-Agent Prompts
  // ──────────────────────────────────────────────────────────────

  /**
   * Generates a prompt that makes an agent AWARE of other agents.
   * This is what transforms isolated responses into dialogue.
   */
  generateAgentAwarePrompt(context: AgentContext): string {
    const { agentId, role, recentMessages, otherAgentMessages, responseGuidance } = context;

    const profile = this.agentProfiles.get(agentId)!;

    let prompt = `You are ${profile.name} (${role}).\n\n`;
    prompt += `Your focus areas: ${profile.focus.join(', ')}\n\n`;

    // Add awareness of other agents
    if (otherAgentMessages.size > 0) {
      prompt += `Other agents have spoken:\n\n`;

      otherAgentMessages.forEach((messages, otherAgentId) => {
        const otherProfile = this.agentProfiles.get(otherAgentId);
        if (otherProfile) {
          const lastMsg = messages[messages.length - 1];
          prompt += `- ${otherProfile.name} said: "${lastMsg.content.substring(0, 100)}..."\n`;
        }
      });

      prompt += '\n';
    }

    // Add response guidance
    if (responseGuidance) {
      prompt += `Response guidance:\n`;
      prompt += `- Tone: ${responseGuidance.suggestedTone}\n`;
      prompt += `- Depth: ${responseGuidance.suggestedDepth}\n`;
      prompt += `- Strategy: ${responseGuidance.complementOrDiverge}\n`;

      if (responseGuidance.buildOnAgent) {
        const otherProfile = this.agentProfiles.get(responseGuidance.buildOnAgent);
        prompt += `- Build on what ${otherProfile?.name} said\n`;
      }

      prompt += '\n';
    }

    // Add field state awareness
    prompt += `Field coherence: ${(context.fieldCoherence * 100).toFixed(0)}%\n`;
    prompt += `Trend: ${context.fieldTrend}\n\n`;

    // Final instruction
    if (responseGuidance?.complementOrDiverge === 'complement') {
      prompt += `Respond in a way that BUILDS ON what others have said, adding your unique perspective.\n`;
    } else if (responseGuidance?.complementOrDiverge === 'diverge') {
      prompt += `Respond in a way that offers a CONTRASTING perspective, expanding the field.\n`;
    } else {
      prompt += `Respond in a way that SYNTHESIZES what's been said, finding the thread.\n`;
    }

    return prompt;
  }

  // ──────────────────────────────────────────────────────────────
  // Agent Memory Management
  // ──────────────────────────────────────────────────────────────

  /**
   * Store an agent's response for future context.
   */
  recordAgentResponse(agentId: string, message: Message): void {
    const existing = this.conversationHistory.get(agentId) || [];
    this.conversationHistory.set(agentId, [...existing, message]);

    // Keep only last 50 messages per agent
    if (existing.length > 50) {
      this.conversationHistory.set(agentId, existing.slice(-50));
    }
  }

  /**
   * Get an agent's recent conversation history.
   */
  getAgentHistory(agentId: string): Message[] {
    return this.conversationHistory.get(agentId) || [];
  }

  // ──────────────────────────────────────────────────────────────
  // Register Custom Agent
  // ──────────────────────────────────────────────────────────────

  /**
   * Add a new agent profile to the system.
   */
  registerAgent(profile: AgentProfile): void {
    this.agentProfiles.set(profile.id, profile);
  }

  // ──────────────────────────────────────────────────────────────
  // Visualization: Agent Resonance Matrix
  // ──────────────────────────────────────────────────────────────

  /**
   * Generate a matrix of alignment scores between all agents.
   */
  generateAgentResonanceMatrix(conversation: Conversation): Map<string, Map<string, number>> {
    const matrix = new Map<string, Map<string, number>>();

    const agentIds = [...this.agentProfiles.keys()];

    for (const agent1 of agentIds) {
      const row = new Map<string, number>();

      for (const agent2 of agentIds) {
        if (agent1 === agent2) {
          row.set(agent2, 1.0);  // Perfect alignment with self
        } else {
          const alignment = this.detectAgentAlignment(agent1, agent2, conversation);
          row.set(agent2, alignment);
        }
      }

      matrix.set(agent1, row);
    }

    return matrix;
  }
}

// ═══════════════════════════════════════════════════════════════
// Utility: Format Agent Context for Display
// ═══════════════════════════════════════════════════════════════

export function formatAgentContext(context: AgentContext): string {
  let output = `\n🜂 Agent Context: ${context.agentId}\n\n`;

  output += `Should Respond: ${context.shouldRespond ? 'YES' : 'NO'}\n`;
  output += `Field Coherence: ${(context.fieldCoherence * 100).toFixed(0)}%\n`;
  output += `Field Trend: ${context.fieldTrend}\n\n`;

  if (context.responseGuidance) {
    output += `Response Guidance:\n`;
    output += `  Tone: ${context.responseGuidance.suggestedTone}\n`;
    output += `  Depth: ${context.responseGuidance.suggestedDepth}\n`;
    output += `  Strategy: ${context.responseGuidance.complementOrDiverge}\n\n`;
  }

  output += `Other Agents:\n`;
  context.otherAgentMessages.forEach((messages, agentId) => {
    output += `  - ${agentId}: ${messages.length} message(s)\n`;
  });

  return output;
}
