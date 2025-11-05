/**
 * System Prompt Builder Service
 *
 * Constructs context-aware system prompts with multi-layered wisdom:
 * - Conversation style prompts (walking/classic/adaptive)
 * - Journal context integration
 * - Birth chart whispers
 * - Collective wisdom field
 * - Conversation history
 * - AIN Memory threading
 * - Wisdom framework integration
 * - Transformation intelligence
 * - Active listening guidance
 * - Book knowledge (IP Engine)
 * - Elemental Oracle 2.0
 *
 * Earth Phase Service Extraction - Following Spiralogic Principles
 */

import type { StoredJournalEntry } from '@/lib/storage/journal-storage';
import type { SymbolicContext } from '@/lib/memory/soulprint';
import type { AINMemoryPayload } from '@/lib/memory/AINMemoryPayload';
import { getUserHistorySummary } from '@/lib/memory/AINMemoryPayload';
import { getPromptForConversationStyle } from '@/lib/prompts/maya-prompts';
import { getBirthChartContext, formatChartContextForMAIA, synthesizeAspectForMAIA, getRawBirthChartData } from '@/lib/services/birthChartContextService';
import { collectiveBreakthroughService } from '@/lib/services/collectiveBreakthroughService';
import { WisdomIntegrationSystem } from '@/lib/knowledge/WisdomIntegrationSystem';
import type { TransformationEnhancement } from '@/lib/agents/PersonalOracleAgent.TransformationEnhancement';
import { buildTransformationPromptAddition } from '@/lib/agents/PersonalOracleAgent.TransformationEnhancement';

/**
 * Context for building system prompts
 */
export interface PromptBuildingContext {
  userId: string;
  userInput: string;
  conversationStyle: 'walking' | 'classic' | 'adaptive';
  conversationDepth: number;

  // Journal & entries
  journalEntries?: StoredJournalEntry[];
  journalContext?: string;

  // Memory & history
  ainMemory: AINMemoryPayload;
  conversationHistory: any[];
  breakthroughs: any[];

  // Symbolic intelligence
  symbolicContext?: SymbolicContext;
  detectedPhase: { phase: string; confidence: number };
  detectedArchetype: string;
  mood?: string;
  dominantElement: string;
  symbols: string[];

  // Predictions & enhancement
  phaseTransitionPrediction: any;
  transformationEnhancement: TransformationEnhancement | null;

  // Listening & engagement
  listeningResponse?: any;

  // Semantic patterns
  elementalAffinity: Record<string, number>;
  userPatterns: any[];
}

/**
 * Service for building context-aware system prompts
 */
export class SystemPromptBuilder {
  /**
   * Build complete system prompt with all context layers
   */
  async buildPrompt(context: PromptBuildingContext): Promise<string> {
    // Start with base conversation style prompt
    let systemPrompt = getPromptForConversationStyle(context.conversationStyle);

    // Add journal context (living narrative)
    if (context.journalEntries && context.journalEntries.length > 0) {
      systemPrompt += this.addJournalContext(context.journalEntries);
    }

    // Add birth chart context (gentle whisper)
    systemPrompt += await this.addBirthChartContext(context.userId, context.userInput);

    // Add collective wisdom from the field
    systemPrompt += await this.addCollectiveWisdom(
      context.ainMemory.currentPhase,
      context.dominantElement,
      context.ainMemory.currentArchetype
    );

    // Add conversation history for memory continuity
    if (context.conversationHistory.length > 0) {
      systemPrompt += this.addConversationHistory(context.conversationHistory, context.breakthroughs);
    }

    // Add AIN Memory context (symbolic threads, intentions, rituals)
    systemPrompt += this.addAINMemoryContext(context.ainMemory);

    // Add current state
    systemPrompt += this.addCurrentState(context);

    // Add spiral signature (elemental flow, symbolic evolution)
    if (context.symbolicContext) {
      systemPrompt += this.addSpiralSignature(
        context.symbolicContext,
        context.journalEntries || [],
        context.symbols
      );
    }

    // Add custom journal context if provided
    if (context.journalContext) {
      systemPrompt += `\n\n${context.journalContext}`;
    }

    // Add wisdom frameworks
    systemPrompt += this.addWisdomFrameworks(context);

    // Add transformation intelligence
    if (context.transformationEnhancement) {
      systemPrompt += this.addTransformationIntelligence(context.transformationEnhancement);
    }

    // Add active listening guidance
    if (context.listeningResponse) {
      systemPrompt += this.addActiveListeningGuidance(context.listeningResponse);
    }

    // Add final integration directive
    systemPrompt += `\n---\n\n**You are MAIA.** The context above is available to you - use it naturally when relevant. Don't announce what you have access to or wax poetic about integration. Just respond directly to what they're saying. The wisdom is yours to weave in when it fits, not to perform.\n`;

    return systemPrompt;
  }

  /**
   * Add journal context with actual user words
   */
  private addJournalContext(entries: StoredJournalEntry[]): string {
    let context = `\n\n## Living Context (Their Actual Words)\n\n`;

    const recentEntries = entries.slice(0, 3).reverse(); // chronological order
    recentEntries.forEach(entry => {
      const daysAgo = Math.floor((Date.now() - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60 * 24));
      const timeLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;

      context += `**${timeLabel}** (${entry.mode}):\n`;
      context += `"${entry.entry.trim()}"\n\n`;
    });

    return context;
  }

  /**
   * Add birth chart context (gentle whisper, not constraint)
   */
  private async addBirthChartContext(userId: string, userInput: string): Promise<string> {
    let context = '';

    // Get birth chart context
    const birthChart = await getBirthChartContext(userId);
    const chartContext = formatChartContextForMAIA(birthChart);
    if (chartContext) {
      context += chartContext;
    }

    // Add archetypal aspect synthesis if specific aspect mentioned (ON-DEMAND ONLY)
    console.log('🔮 [INTEGRATION] Checking for birth chart data and aspect synthesis...');
    const rawChartData = await getRawBirthChartData(userId);
    if (rawChartData) {
      const aspectSynthesis = synthesizeAspectForMAIA(userInput, rawChartData);
      if (aspectSynthesis && aspectSynthesis.length < 800) {
        console.log('   ✅ Adding aspect synthesis as PRIMARY LENS');

        context += `\n\n🔮 PRIMARY ARCHETYPAL LENS (Use this as your core interpretive frame):
${aspectSynthesis}

IMPORTANT: When responding to this astrological query, speak FROM this archetypal understanding, not ABOUT it.
Don't recite it—embody it. Let this wisdom shape your voice and inform your response naturally.
This is the soul-level truth you're helping them see, not reference material to cite.`;
      }
    }

    return context;
  }

  /**
   * Add collective wisdom from the field
   */
  private async addCollectiveWisdom(
    currentPhase: string,
    dominantElement: string,
    currentArchetype: string
  ): Promise<string> {
    const collectiveWisdom = await collectiveBreakthroughService.getCollectiveWisdom(
      currentPhase,
      dominantElement,
      currentArchetype
    );

    if (collectiveWisdom && collectiveWisdom.synchronicity_detected) {
      let context = `\n\n---\n\nFROM THE COLLECTIVE FIELD (Others' Journeys):\n\n`;
      if (collectiveWisdom.active_movements.length > 0) {
        context += `Active movements: ${collectiveWisdom.active_movements.join(', ')}\n\n`;
      }
      if (collectiveWisdom.suggested_reflection) {
        context += `Field wisdom: ${collectiveWisdom.suggested_reflection}\n`;
      }
      context += `\nUse this gently if it feels relevant - not everyone wants to know they're part of a collective movement. Trust your sense of what fits.\n\n---\n`;
      return context;
    }

    return '';
  }

  /**
   * Add conversation history for memory continuity
   */
  private addConversationHistory(history: any[], breakthroughs: any[]): string {
    let context = `\n\n## Our Conversation History (Remember This to Maintain Continuity)\n\n`;

    // Group messages into exchanges (user + maia pairs)
    const sortedHistory = history.sort((a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Show most recent exchanges (implicit memory - don't overwhelm)
    const recentCount = Math.min(6, sortedHistory.length);
    const recentMessages = sortedHistory.slice(-recentCount);

    recentMessages.forEach((msg) => {
      const daysAgo = Math.floor((Date.now() - new Date(msg.created_at).getTime()) / (1000 * 60 * 60 * 24));
      const timeLabel = daysAgo === 0 ? 'Earlier today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
      const speaker = msg.role === 'user' ? 'They said' : 'You responded';

      context += `**${timeLabel}** - ${speaker}:\n`;
      context += `"${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}"\n`;

      // Add elemental context if available
      if (msg.elements && Object.keys(msg.elements).length > 0) {
        const dominantEl = Object.entries(msg.elements)
          .sort(([,a]: any, [,b]: any) => b - a)[0];
        context += `(${dominantEl[0]} energy: ${Math.round(dominantEl[1] * 100)}%)\n`;
      }

      context += `\n`;
    });

    // Add breakthrough moments for explicit callbacks if present
    if (breakthroughs.length > 0) {
      context += `\n### Breakthrough Moments You Can Reference:\n\n`;
      breakthroughs.slice(0, 3).forEach((bt) => {
        const daysAgo = Math.floor((Date.now() - new Date(bt.created_at).getTime()) / (1000 * 60 * 60 * 24));
        context += `- ${daysAgo === 0 ? 'Today' : daysAgo + ' days ago'}: "${bt.content.substring(0, 150)}..."\n`;
      });
      context += `\n`;
    }

    return context;
  }

  /**
   * Add AIN Memory context (symbolic threads, intentions, rituals)
   */
  private addAINMemoryContext(memory: AINMemoryPayload): string {
    const memorySummary = getUserHistorySummary(memory);
    if (!memorySummary) return '';

    return `\n## Symbolic Memory (Recurring Themes & Intentions)\n\n${memorySummary}\n`;
  }

  /**
   * Add current state (phase, archetype, mood, predictions)
   */
  private addCurrentState(context: PromptBuildingContext): string {
    let stateContext = `\n## Current State\n\n`;
    stateContext += `- **Spiralogic Phase**: ${context.ainMemory.currentPhase} → ${context.detectedPhase.phase} (${Math.round(context.detectedPhase.confidence * 100)}% confidence)\n`;
    stateContext += `- **Archetype**: ${context.detectedArchetype || context.ainMemory.currentArchetype}\n`;
    if (context.mood) {
      stateContext += `- **Emotional Tone**: ${context.mood}\n`;
    }
    if (context.phaseTransitionPrediction?.nextPhaseLikely) {
      stateContext += `- **Phase Prediction**: ${context.phaseTransitionPrediction.reasoning} - likely moving toward ${context.phaseTransitionPrediction.nextPhaseLikely} (${Math.round(context.phaseTransitionPrediction.confidence * 100)}% confidence)\n`;
    }
    stateContext += `\n`;
    return stateContext;
  }

  /**
   * Add spiral signature (elemental flow, symbolic evolution)
   */
  private addSpiralSignature(
    symbolicContext: SymbolicContext,
    entries: StoredJournalEntry[],
    symbols: string[]
  ): string {
    // This would call the SymbolicIntelligenceService methods
    // For now, keeping the logic inline as it's specific to prompt building
    let context = `## Their Spiral Signature (Background Awareness - Don't Name Unless They Ask)\n\n`;

    context += `They've had ${symbolicContext.sessionCount} exchanges with you. `;
    if (symbolicContext.spiralHistory.length > 3) {
      const recentPhases = symbolicContext.spiralHistory.slice(-3).join(' → ');
      context += `Recent spiral movement: ${recentPhases}.\n`;
    }

    return context;
  }

  /**
   * Add wisdom frameworks (Kelly's complete body of work)
   */
  private addWisdomFrameworks(context: PromptBuildingContext): string {
    // Detect conversation depth
    const depth = context.conversationDepth > 0.7 ? 'deep' :
                  context.conversationDepth > 0.5 ? 'engaged' :
                  context.conversationDepth > 0.3 ? 'warming' : 'surface';

    const wisdomContext = {
      depth,
      userQuestion: context.userInput,
      phase: context.dominantElement as any
    };

    // Get contextually appropriate wisdom
    let adaptedFramework = WisdomIntegrationSystem.getSystemPrompt(wisdomContext);

    // Adapt framework based on learned patterns
    if (context.userPatterns.length > 0) {
      adaptedFramework += `\n\n## 🧠 User-Specific Patterns (Learned from ${context.userPatterns.length} observations):\n`;

      // Add elemental affinity guidance
      const strongestElement = Object.entries(context.elementalAffinity)
        .sort(([,a], [,b]) => b - a)[0];

      if (strongestElement && strongestElement[1] > 0.6) {
        adaptedFramework += `\n**Elemental Affinity**: This user resonates strongly with ${strongestElement[0]} energy (${(strongestElement[1] * 100).toFixed(0)}% affinity). Consider this in your response.\n`;
      }
    }

    return `\n\n${adaptedFramework}`;
  }

  /**
   * Add transformation intelligence
   */
  private addTransformationIntelligence(enhancement: TransformationEnhancement): string {
    const transformationAddition = buildTransformationPromptAddition(enhancement);

    console.log('🜃 Transformation awareness added to system prompt:', {
      stage: enhancement.state.alchemical.currentStage.operation,
      depth: enhancement.quickGuidance.depth,
      tier2: enhancement.tier2Wisdom?.accessible || false
    });

    return transformationAddition;
  }

  /**
   * Add active listening guidance
   */
  private addActiveListeningGuidance(listeningResponse: any): string {
    let context = `\n\n## Active Listening Guidance for This Moment:\n`;
    context += `**Technique:** ${listeningResponse.technique.type}\n`;
    context += `**Element:** ${listeningResponse.technique.element}\n`;
    context += `**Suggested Response Pattern:** ${listeningResponse.response}\n`;
    if (listeningResponse.followUp) {
      context += `**Potential Follow-Up:** ${listeningResponse.followUp}\n`;
    }
    context += `\nUse this as subtle guidance for your response style, but stay natural and true to MAIA's voice.\n`;
    return context;
  }
}

/**
 * Create service instance
 */
export function createSystemPromptBuilder(): SystemPromptBuilder {
  return new SystemPromptBuilder();
}
