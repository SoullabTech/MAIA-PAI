/**
 * Agent Coherence Middleware
 *
 * Wraps agent interactions to automatically track elemental coherence
 * Integrates with AgentCoherenceTracker and IndrasWebField
 */

import { agentCoherenceTracker, type AgentCoherence, type AgentType } from '../agents/AgentCoherenceSystem';
import { indrasWebField } from '../field/IndrasWebArchitecture';
import { elementalCoherenceCalculator } from '../biometrics/ElementalCoherenceCalculator';
import { biometricStorage } from '../biometrics/BiometricStorage';
import type { ElementalCoherence } from '../biometrics/ElementalCoherenceCalculator';

export interface AgentInteraction {
  agentId: string;
  agentType: AgentType;
  sessionId: string;
  userId: string;

  // Input
  userMessage: string;
  userCoherence?: ElementalCoherence;

  // Output (filled after agent response)
  agentResponse?: string;
  tokenCount?: number;
  responseTime?: number;

  // Feedback (filled if user provides)
  userFeedback?: {
    resonance: number; // 0-1
    transformative: boolean;
    helpful: boolean;
  };
}

export interface AgentInteractionResult extends AgentInteraction {
  agentCoherence: AgentCoherence;
  fieldUpdated: boolean;
}

export class AgentCoherenceMiddleware {

  /**
   * Wrap agent interaction to track coherence
   * Call BEFORE agent processes request
   */
  async before(interaction: AgentInteraction): Promise<{
    userCoherence: ElementalCoherence | null;
    startTime: number;
  }> {
    const startTime = Date.now();

    // Try to get user's current coherence from biometrics
    let userCoherence: ElementalCoherence | null = null;

    try {
      const healthData = await biometricStorage.getLatestHealthData();
      if (healthData && healthData.hrv.length > 0) {
        const { coherenceDetector } = await import('../biometrics/CoherenceDetector');
        coherenceDetector.loadHistory(healthData, 60);
        const coherenceState = coherenceDetector.analyzeCoherence();

        userCoherence = elementalCoherenceCalculator.calculateFromHealthData(
          healthData,
          coherenceState
        );
      }
    } catch (error) {
      console.warn('Could not load user coherence:', error);
    }

    return { userCoherence, startTime };
  }

  /**
   * Wrap agent interaction to track coherence
   * Call AFTER agent processes request
   */
  async after(
    interaction: AgentInteraction,
    beforeData: { userCoherence: ElementalCoherence | null; startTime: number }
  ): Promise<AgentInteractionResult> {

    if (!interaction.agentResponse) {
      throw new Error('Agent response is required for coherence tracking');
    }

    const responseTime = Date.now() - beforeData.startTime;
    const tokenCount = this.estimateTokenCount(interaction.agentResponse);

    // Calculate agent coherence
    const agentCoherence = agentCoherenceTracker.calculateCoherence({
      agentId: interaction.agentId,
      agentType: interaction.agentType,
      sessionId: interaction.sessionId,
      responseText: interaction.agentResponse,
      userFeedback: interaction.userFeedback,
      userCoherence: beforeData.userCoherence || undefined,
      tokenCount,
      responseTime
    });

    // Record coherence
    agentCoherenceTracker.recordCoherence(agentCoherence);

    // Update Indra's Web field
    let fieldUpdated = false;
    try {
      // Add agent as node in field
      indrasWebField.updateNode({
        id: interaction.agentId,
        type: 'agent',
        agentType: interaction.agentType,
        elemental: agentCoherence.elemental,
        timestamp: new Date(),
        sessionId: interaction.sessionId
      });

      // Add user as node if coherence available
      if (beforeData.userCoherence) {
        indrasWebField.updateNode({
          id: interaction.userId,
          type: 'human',
          elemental: beforeData.userCoherence,
          timestamp: new Date(),
          sessionId: interaction.sessionId
        });
      }

      fieldUpdated = true;
    } catch (error) {
      console.error('Failed to update Indra\'s Web field:', error);
    }

    // Log coherence with emoji feedback
    console.log(`\n✨ Agent Coherence Tracked:`);
    console.log(`   Agent: ${interaction.agentType}`);
    console.log(`   Unified: ${Math.round(agentCoherence.elemental.unified * 100)}%`);
    console.log(`   Air: ${Math.round(agentCoherence.elemental.air * 100)}% 💨`);
    console.log(`   Fire: ${Math.round(agentCoherence.elemental.fire * 100)}% 🔥`);
    console.log(`   Water: ${Math.round(agentCoherence.elemental.water * 100)}% 🌊`);
    console.log(`   Earth: ${Math.round(agentCoherence.elemental.earth * 100)}% 🌍`);
    console.log(`   Aether: ${Math.round(agentCoherence.elemental.aether * 100)}% ✨`);

    if (beforeData.userCoherence) {
      console.log(`\n   User Unified: ${Math.round(beforeData.userCoherence.unified * 100)}%`);
      console.log(`   Resonance: ${Math.round(agentCoherence.resonanceWithField * 100)}%`);
    }

    if (agentCoherence.calibrationNeeded) {
      console.log(`\n   ⚠️  Agent may need calibration`);
    }

    // Calculate field coherence
    const fieldCoherence = indrasWebField.calculateFieldCoherence();
    console.log(`\n🌐 Field Coherence: ${Math.round(fieldCoherence.unifiedCoherence * 100)}%`);
    console.log(`   Humans: ${fieldCoherence.nodeCount.human}, Agents: ${fieldCoherence.nodeCount.agent}`);
    console.log(`   Collective Intelligence: ${fieldCoherence.collectiveIntelligence.toFixed(2)}x`);

    if (fieldCoherence.emergentPatterns.length > 0) {
      console.log(`\n   Emergent Patterns:`);
      fieldCoherence.emergentPatterns.forEach(pattern => {
        console.log(`   - ${pattern}`);
      });
    }

    return {
      ...interaction,
      agentResponse: interaction.agentResponse,
      tokenCount,
      responseTime,
      agentCoherence,
      fieldUpdated
    };
  }

  /**
   * Convenience method: wrap entire interaction
   */
  async track(
    interaction: AgentInteraction,
    agentHandler: (interaction: AgentInteraction) => Promise<string>
  ): Promise<AgentInteractionResult> {

    // Before: Get user coherence
    const beforeData = await this.before(interaction);

    // Execute agent
    const agentResponse = await agentHandler(interaction);
    interaction.agentResponse = agentResponse;

    // After: Track coherence
    return await this.after(interaction, beforeData);
  }

  /**
   * Record user feedback after interaction
   */
  async recordFeedback(
    sessionId: string,
    agentId: string,
    feedback: {
      resonance: number;
      transformative: boolean;
      helpful: boolean;
    }
  ): Promise<void> {

    // This would update the coherence record with feedback
    // For now, just log it
    console.log(`\n💫 User Feedback Received:`);
    console.log(`   Session: ${sessionId}`);
    console.log(`   Agent: ${agentId}`);
    console.log(`   Resonance: ${Math.round(feedback.resonance * 100)}%`);
    console.log(`   Transformative: ${feedback.transformative ? '✓' : '✗'}`);
    console.log(`   Helpful: ${feedback.helpful ? '✓' : '✗'}`);

    // TODO: Update stored coherence record with this feedback
  }

  /**
   * Get agent performance summary
   */
  getAgentSummary(agentType: AgentType) {
    return agentCoherenceTracker.getAgentSummary(agentType);
  }

  /**
   * Suggest calibration for agent
   */
  suggestCalibration(agentType: AgentType) {
    return agentCoherenceTracker.suggestCalibration(agentType);
  }

  /**
   * Get current field state
   */
  getFieldState() {
    return indrasWebField.calculateFieldCoherence();
  }

  /**
   * Get resonance graph (for visualization)
   */
  getResonanceGraph() {
    return indrasWebField.getResonanceGraph();
  }

  /**
   * Get cascade history
   */
  getCascadeHistory(limit: number = 20) {
    return indrasWebField.getCascadeHistory(limit);
  }

  /**
   * Estimate token count from text
   */
  private estimateTokenCount(text: string): number {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}

// Singleton export
export const agentCoherenceMiddleware = new AgentCoherenceMiddleware();
