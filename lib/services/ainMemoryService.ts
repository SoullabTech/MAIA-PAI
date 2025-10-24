// lib/services/ainMemoryService.ts
// 🧠 AIN Memory Retrieval Service
// Retrieve user's archetypal patterns, symbolic threads, and journey cycles

import { createClient } from "@/lib/supabase";
import type { AINMemoryPayload, SymbolicThread } from "@/lib/memory/AINMemoryPayload";

export interface DreamPattern {
  id: string;
  userId: string;
  dreamContent: string;
  symbols: string[];        // Recurring symbols (water, crossroads, etc)
  archetypes: string[];     // Which archetypes appeared
  emotionalTone: string;    // Overall feeling of dream
  recorded_at: Date;
  connections?: string[];   // Links to daily experiences
}

export interface JourneyPattern {
  id: string;
  userId: string;
  journeyType: string;      // "shamanic", "meditation", "breathwork", etc
  phase: string;            // Spiralogic phase during journey
  insights: string[];       // Key realizations
  symbols: string[];        // Symbols encountered
  embodiedSensations: string[]; // Somatic experiences
  recorded_at: Date;
}

export interface PatternResonance {
  dreamPatterns: DreamPattern[];
  journeyPatterns: JourneyPattern[];
  symbolicThreads: SymbolicThread[];
  currentPhase: string;
  dominantArchetype: string | null;
  recentIntentions: string[];
}

/**
 * Get user's dream patterns from memories
 * Dreams are stored as memories with memoryType: 'dream'
 */
export async function getUserDreamPatterns(
  userId: string,
  limit: number = 10
): Promise<DreamPattern[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("memories")
      .select("id, user_id, content, metadata, created_at")
      .eq("user_id", userId)
      .eq("memory_type", "dream")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.error("[getUserDreamPatterns] Error:", error);
      return [];
    }

    return data.map((dream) => ({
      id: dream.id,
      userId: dream.user_id,
      dreamContent: dream.content,
      symbols: dream.metadata?.symbols || [],
      archetypes: dream.metadata?.archetypes || [],
      emotionalTone: dream.metadata?.emotionalTone || "neutral",
      recorded_at: new Date(dream.created_at),
      connections: dream.metadata?.connections || [],
    }));
  } catch (error) {
    console.error("[getUserDreamPatterns] Error:", error);
    return [];
  }
}

/**
 * Get user's journey patterns from memories
 * Journeys stored as memories with memoryType: 'journey'
 */
export async function getUserJourneyPatterns(
  userId: string,
  limit: number = 10
): Promise<JourneyPattern[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("memories")
      .select("id, user_id, content, metadata, created_at")
      .eq("user_id", userId)
      .eq("memory_type", "journey")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.error("[getUserJourneyPatterns] Error:", error);
      return [];
    }

    return data.map((journey) => ({
      id: journey.id,
      userId: journey.user_id,
      journeyType: journey.metadata?.journeyType || "unknown",
      phase: journey.metadata?.phase || "Unknown",
      insights: journey.metadata?.insights || [],
      symbols: journey.metadata?.symbols || [],
      embodiedSensations: journey.metadata?.embodiedSensations || [],
      recorded_at: new Date(journey.created_at),
    }));
  } catch (error) {
    console.error("[getUserJourneyPatterns] Error:", error);
    return [];
  }
}

/**
 * Get user's symbolic threads from AIN memory
 * These are recurring motifs across conversations, dreams, and journeys
 */
export async function getUserSymbolicThreads(
  userId: string,
  limit: number = 5
): Promise<SymbolicThread[]> {
  try {
    const supabase = createClient();

    // Get from AIN memory payload stored in memories table
    const { data, error } = await supabase
      .from("memories")
      .select("metadata")
      .eq("user_id", userId)
      .eq("memory_type", "ain_payload")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return [];
    }

    const ainPayload = data[0].metadata as AINMemoryPayload;
    return ainPayload.symbolicThreads
      .sort((a, b) => b.lastInvoked.getTime() - a.lastInvoked.getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("[getUserSymbolicThreads] Error:", error);
    return [];
  }
}

/**
 * Get user's current phase and dominant archetype
 */
export async function getUserCurrentState(userId: string): Promise<{
  currentPhase: string;
  dominantArchetype: string | null;
  phaseHistory: Array<{ phase: string; timestamp: Date }>;
}> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("memories")
      .select("metadata")
      .eq("user_id", userId)
      .eq("memory_type", "ain_payload")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return {
        currentPhase: "Aether",
        dominantArchetype: null,
        phaseHistory: [],
      };
    }

    const ainPayload = data[0].metadata as AINMemoryPayload;
    return {
      currentPhase: ainPayload.currentPhase,
      dominantArchetype: ainPayload.dominantArchetype,
      phaseHistory: ainPayload.spiralogicCycle.phaseHistory.slice(-5),
    };
  } catch (error) {
    console.error("[getUserCurrentState] Error:", error);
    return {
      currentPhase: "Aether",
      dominantArchetype: null,
      phaseHistory: [],
    };
  }
}

/**
 * Get user's active intentions
 */
export async function getUserIntentions(userId: string): Promise<string[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("memories")
      .select("metadata")
      .eq("user_id", userId)
      .eq("memory_type", "ain_payload")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return [];
    }

    const ainPayload = data[0].metadata as AINMemoryPayload;
    return ainPayload.userIntentions
      .filter((i) => i.alive)
      .map((i) => i.intention);
  } catch (error) {
    console.error("[getUserIntentions] Error:", error);
    return [];
  }
}

/**
 * Get complete pattern resonance for user
 * Combines dreams, journeys, symbolic threads, and current state
 */
export async function getPatternResonance(userId: string): Promise<PatternResonance> {
  const [dreamPatterns, journeyPatterns, symbolicThreads, currentState, intentions] =
    await Promise.all([
      getUserDreamPatterns(userId, 5),
      getUserJourneyPatterns(userId, 5),
      getUserSymbolicThreads(userId, 5),
      getUserCurrentState(userId),
      getUserIntentions(userId),
    ]);

  return {
    dreamPatterns,
    journeyPatterns,
    symbolicThreads,
    currentPhase: currentState.currentPhase,
    dominantArchetype: currentState.dominantArchetype,
    recentIntentions: intentions,
  };
}

/**
 * Format pattern resonance as context for MAIA's prompt
 * This creates rich, interconnected awareness
 */
export function formatPatternContext(resonance: PatternResonance): string {
  let context = "";

  // Current State
  if (resonance.currentPhase || resonance.dominantArchetype) {
    context += "## Current Journey State:\n";
    context += `- Phase: ${resonance.currentPhase}\n`;
    if (resonance.dominantArchetype) {
      context += `- Dominant Archetype: ${resonance.dominantArchetype}\n`;
    }
    context += "\n";
  }

  // Symbolic Threads
  if (resonance.symbolicThreads.length > 0) {
    context += "## Recurring Symbolic Threads:\n";
    for (const thread of resonance.symbolicThreads) {
      context += `- "${thread.motif}" (${thread.emotionalTone}, appears ${thread.occurrences}x)\n`;
      context += `  Archetype: ${thread.archetypalResonance}\n`;
    }
    context += "\n";
  }

  // Dream Patterns
  if (resonance.dreamPatterns.length > 0) {
    context += "## Recent Dream Patterns:\n";
    for (const dream of resonance.dreamPatterns.slice(0, 3)) {
      const daysAgo = Math.floor(
        (Date.now() - dream.recorded_at.getTime()) / (1000 * 60 * 60 * 24)
      );
      context += `- ${daysAgo} days ago: ${dream.emotionalTone} tone\n`;
      if (dream.symbols.length > 0) {
        context += `  Symbols: ${dream.symbols.join(", ")}\n`;
      }
      if (dream.archetypes.length > 0) {
        context += `  Archetypes: ${dream.archetypes.join(", ")}\n`;
      }
    }
    context += "\n";
  }

  // Journey Patterns
  if (resonance.journeyPatterns.length > 0) {
    context += "## Recent Journey Work:\n";
    for (const journey of resonance.journeyPatterns.slice(0, 3)) {
      const daysAgo = Math.floor(
        (Date.now() - journey.recorded_at.getTime()) / (1000 * 60 * 60 * 24)
      );
      context += `- ${daysAgo} days ago: ${journey.journeyType} (${journey.phase} phase)\n`;
      if (journey.symbols.length > 0) {
        context += `  Symbols: ${journey.symbols.join(", ")}\n`;
      }
      if (journey.insights.length > 0) {
        context += `  Insights: ${journey.insights[0]}\n`;
      }
    }
    context += "\n";
  }

  // Active Intentions
  if (resonance.recentIntentions.length > 0) {
    context += "## Active Intentions:\n";
    for (const intention of resonance.recentIntentions) {
      context += `- ${intention}\n`;
    }
    context += "\n";
  }

  return context;
}

/**
 * Find connections between current input and user's patterns
 * Returns relevant pattern echoes
 */
export async function findPatternEchoes(
  userId: string,
  currentInput: string
): Promise<{
  dreamEchoes: string[];
  journeyEchoes: string[];
  symbolicEchoes: string[];
}> {
  const resonance = await getPatternResonance(userId);
  const lowerInput = currentInput.toLowerCase();

  // Find dream echoes
  const dreamEchoes: string[] = [];
  for (const dream of resonance.dreamPatterns) {
    for (const symbol of dream.symbols) {
      if (lowerInput.includes(symbol.toLowerCase())) {
        dreamEchoes.push(
          `"${symbol}" appeared in your ${dream.emotionalTone} dream ${Math.floor((Date.now() - dream.recorded_at.getTime()) / (1000 * 60 * 60 * 24))} days ago`
        );
      }
    }
  }

  // Find journey echoes
  const journeyEchoes: string[] = [];
  for (const journey of resonance.journeyPatterns) {
    for (const symbol of journey.symbols) {
      if (lowerInput.includes(symbol.toLowerCase())) {
        journeyEchoes.push(
          `"${symbol}" emerged in your ${journey.journeyType} journey during ${journey.phase} phase`
        );
      }
    }
  }

  // Find symbolic thread echoes
  const symbolicEchoes: string[] = [];
  for (const thread of resonance.symbolicThreads) {
    if (lowerInput.includes(thread.motif.toLowerCase())) {
      symbolicEchoes.push(
        `"${thread.motif}" is a recurring thread (${thread.occurrences}x, ${thread.emotionalTone})`
      );
    }
  }

  return {
    dreamEchoes: dreamEchoes.slice(0, 2),
    journeyEchoes: journeyEchoes.slice(0, 2),
    symbolicEchoes: symbolicEchoes.slice(0, 2),
  };
}
