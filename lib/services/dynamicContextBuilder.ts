// lib/services/dynamicContextBuilder.ts
// 🎯 Dynamic Context Builder for MAIA
// Combines Akashic Field insights + AIN memory into rich system prompts

import { getFieldContext } from "./fieldQueryService";
import { getPatternResonance, formatPatternContext, findPatternEchoes } from "./ainMemoryService";

export interface DynamicContext {
  fieldInsights: string;        // Semantically relevant past conversations
  patternContext: string;       // Dreams, journeys, symbolic threads
  patternEchoes: string;        // Connections between current input and patterns
  fullSystemPrompt: string;     // Complete prompt for MAIA
}

/**
 * Build dynamic context for MAIA's system prompt
 * Combines all sources of intelligence into coherent awareness
 *
 * @param userId - User ID for memory retrieval
 * @param currentInput - User's current message (for semantic search)
 * @param basePrompt - Base system prompt (MAIA's core identity)
 * @param options - Configuration options
 */
export async function buildDynamicContext(
  userId: string,
  currentInput: string,
  basePrompt: string,
  options?: {
    includeFieldInsights?: boolean;
    includePatternContext?: boolean;
    includePatternEchoes?: boolean;
    fieldMatchThreshold?: number;
    fieldMatchCount?: number;
  }
): Promise<DynamicContext> {
  const config = {
    includeFieldInsights: options?.includeFieldInsights ?? true,
    includePatternContext: options?.includePatternContext ?? true,
    includePatternEchoes: options?.includePatternEchoes ?? true,
    fieldMatchThreshold: options?.fieldMatchThreshold ?? 0.7,
    fieldMatchCount: options?.fieldMatchCount ?? 5,
  };

  // Retrieve all intelligence sources in parallel
  const [fieldInsights, patternResonance, patternEchoes] = await Promise.all([
    config.includeFieldInsights
      ? getFieldContext(currentInput, {
          matchThreshold: config.fieldMatchThreshold,
          matchCount: config.fieldMatchCount,
          userId,
        })
      : Promise.resolve(""),
    config.includePatternContext ? getPatternResonance(userId) : Promise.resolve(null),
    config.includePatternEchoes ? findPatternEchoes(userId, currentInput) : Promise.resolve(null),
  ]);

  // Format pattern context
  const patternContext = patternResonance ? formatPatternContext(patternResonance) : "";

  // Format pattern echoes
  let patternEchoesText = "";
  if (patternEchoes) {
    const allEchoes = [
      ...patternEchoes.dreamEchoes,
      ...patternEchoes.journeyEchoes,
      ...patternEchoes.symbolicEchoes,
    ];

    if (allEchoes.length > 0) {
      patternEchoesText = "## Pattern Echoes in Current Message:\n";
      for (const echo of allEchoes) {
        patternEchoesText += `- ${echo}\n`;
      }
      patternEchoesText += "\n";
    }
  }

  // Build full system prompt
  let fullSystemPrompt = basePrompt;

  // Add accumulated intelligence
  if (patternContext || fieldInsights || patternEchoesText) {
    fullSystemPrompt += "\n\n---\n\n";
    fullSystemPrompt += "# Accumulated Intelligence from Akashic Field\n\n";
    fullSystemPrompt +=
      "You have access to the user's journey history. Use this to inform your responses with depth and continuity:\n\n";

    if (patternContext) {
      fullSystemPrompt += patternContext;
    }

    if (fieldInsights) {
      fullSystemPrompt += fieldInsights;
      fullSystemPrompt += "\n";
    }

    if (patternEchoesText) {
      fullSystemPrompt += patternEchoesText;
    }

    fullSystemPrompt += "---\n\n";
    fullSystemPrompt +=
      "Use this accumulated wisdom to respond with awareness of their journey arc, symbolic threads, and recurring patterns. ";
    fullSystemPrompt +=
      "Reference dreams or journeys naturally when relevant, but don't force connections. ";
    fullSystemPrompt +=
      "Let the field inform your presence without overtly mentioning you have access to this information.\n";
  }

  return {
    fieldInsights,
    patternContext,
    patternEchoes: patternEchoesText,
    fullSystemPrompt,
  };
}

/**
 * Build lightweight context (when full context would be too heavy)
 * Includes only most essential patterns
 */
export async function buildLightweightContext(
  userId: string,
  basePrompt: string
): Promise<string> {
  try {
    const resonance = await getPatternResonance(userId);

    let context = basePrompt;

    // Add only essentials
    if (resonance.currentPhase || resonance.dominantArchetype || resonance.symbolicThreads.length > 0) {
      context += "\n\n# Current Context:\n";

      if (resonance.currentPhase) {
        context += `- Journey Phase: ${resonance.currentPhase}\n`;
      }

      if (resonance.dominantArchetype) {
        context += `- Dominant Archetype: ${resonance.dominantArchetype}\n`;
      }

      if (resonance.symbolicThreads.length > 0) {
        const topThreads = resonance.symbolicThreads.slice(0, 3);
        context += `- Symbolic Threads: ${topThreads.map((t) => t.motif).join(", ")}\n`;
      }
    }

    return context;
  } catch (error) {
    console.error("[buildLightweightContext] Error:", error);
    return basePrompt;
  }
}

/**
 * Refresh context mid-conversation (when user explicitly references dreams/journeys)
 * Returns updated context focusing on the specific topic
 */
export async function refreshContextForTopic(
  userId: string,
  topic: "dreams" | "journeys" | "patterns",
  basePrompt: string
): Promise<string> {
  try {
    const resonance = await getPatternResonance(userId);

    let context = basePrompt;
    context += "\n\n# Focused Context:\n\n";

    switch (topic) {
      case "dreams":
        if (resonance.dreamPatterns.length > 0) {
          context += "## Your Recent Dreams:\n";
          for (const dream of resonance.dreamPatterns.slice(0, 5)) {
            const daysAgo = Math.floor(
              (Date.now() - dream.recorded_at.getTime()) / (1000 * 60 * 60 * 24)
            );
            context += `- ${daysAgo} days ago: ${dream.emotionalTone}\n`;
            if (dream.symbols.length > 0) {
              context += `  Symbols: ${dream.symbols.join(", ")}\n`;
            }
          }
        }
        break;

      case "journeys":
        if (resonance.journeyPatterns.length > 0) {
          context += "## Your Recent Journeys:\n";
          for (const journey of resonance.journeyPatterns.slice(0, 5)) {
            const daysAgo = Math.floor(
              (Date.now() - journey.recorded_at.getTime()) / (1000 * 60 * 60 * 24)
            );
            context += `- ${daysAgo} days ago: ${journey.journeyType} (${journey.phase})\n`;
            if (journey.insights.length > 0) {
              context += `  Key insight: ${journey.insights[0]}\n`;
            }
          }
        }
        break;

      case "patterns":
        if (resonance.symbolicThreads.length > 0) {
          context += "## Your Recurring Patterns:\n";
          for (const thread of resonance.symbolicThreads) {
            context += `- "${thread.motif}" (${thread.emotionalTone}, ${thread.occurrences}x)\n`;
          }
        }
        break;
    }

    return context;
  } catch (error) {
    console.error("[refreshContextForTopic] Error:", error);
    return basePrompt;
  }
}

/**
 * Estimate token count for context (rough approximation)
 * Helps manage prompt size
 */
export function estimateContextTokens(context: DynamicContext): number {
  // Rough estimate: 1 token ≈ 4 characters
  const totalChars =
    context.fieldInsights.length +
    context.patternContext.length +
    context.patternEchoes.length;

  return Math.ceil(totalChars / 4);
}
