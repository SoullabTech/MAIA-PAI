// lib/saveMaiaInsight.ts
// 🎙️ Archives MAIA voice conversations into Supabase insight_history table with elemental + archetypal classification
// Part of Option A: Dual Save - MAIA conversations go to BOTH memories AND insight_history (Akashic Records)
// 🜃 TRIPLE SAVE: Also embeds to field_vectors for semantic search across the Akashic Field

import { createClient } from "@/lib/supabase";
import { embedToField } from "@/lib/services/fieldEmbeddingService";

/**
 * Detect elemental resonance in MAIA conversation text
 * Uses simple regex patterns for reliable classification
 */
function detectElement(content: string): string {
  const lower = content.toLowerCase();

  // Fire: Transformation, creation, vision, breakthrough, action
  if (lower.match(/fire|ignite|create|transform|vision|light|emerge|birth|catalyst|breakthrough|action|passion|urgent|now/)) {
    return "Fire";
  }

  // Water: Emotion, flow, feeling, intuition, depth, reflection
  if (lower.match(/water|feel|flow|dream|emotion|shadow|dissolve|reflect|intuition|grief|tears|deep|nurture/)) {
    return "Water";
  }

  // Earth: Grounding, body, practical, structure, stability, manifestation
  if (lower.match(/earth|ground|build|body|form|structure|manifest|practical|concrete|stable|foundation|anchor/)) {
    return "Earth";
  }

  // Air: Thought, clarity, communication, perspective, understanding
  if (lower.match(/air|speak|mind|clarity|idea|breath|communicate|abstract|pattern|understand|think|perspective/)) {
    return "Air";
  }

  // Aether: Spirit, integration, wholeness, presence, consciousness
  if (lower.match(/aether|spirit|field|presence|soul|coherence|integrate|unity|wholeness|sacred|mystery|witness/)) {
    return "Aether";
  }

  // Default to Air for conversational exchanges (communication element)
  return "Air";
}

/**
 * Detect archetypal mode in MAIA conversation
 * MAIA operates in multiple archetypal modes based on conversation context
 */
function detectMaiaArchetype(content: string, role: string, conversationMode?: string): string {
  const lower = content.toLowerCase();

  // MainOracle: System wisdom, comprehensive guidance, oracle mode responses
  if (role === "assistant" && (
    lower.match(/oracle|wisdom|guide|path|destiny|purpose|soul|calling|mission/) ||
    conversationMode === "oracle"
  )) {
    return "MainOracle";
  }

  // InnerGuide: Personal reflection, journaling, emotional processing, therapeutic mode
  if (
    lower.match(/feel|emotion|process|reflect|understand|insight|aware|discover|heal|growth/) ||
    conversationMode === "patient" ||
    conversationMode === "therapeutic"
  ) {
    return "InnerGuide";
  }

  // Dream: Imagination, vision work, creative exploration, symbolic interpretation
  if (lower.match(/dream|vision|imagine|symbol|metaphor|story|creative|possibility|future/)) {
    return "Dream";
  }

  // Mentor: Teaching, explanation, knowledge sharing, guidance
  if (lower.match(/teach|learn|explain|how to|understand|practice|principle|method|technique/)) {
    return "Mentor";
  }

  // Relationship: Connection patterns, dialogue, interpersonal dynamics
  if (lower.match(/relationship|connect|together|conversation|dialogue|communication|between|bond/)) {
    return "Relationship";
  }

  // Alchemist: Transformation, integration, transmutation, growth
  if (lower.match(/transform|alchemy|transmute|integrate|synthesize|evolve|change|shift|breakthrough/)) {
    return "Alchemist";
  }

  // Shadow: Processing difficult emotions, integration work, unconscious patterns
  if (lower.match(/shadow|pain|grief|anger|fear|resist|block|avoid|deny|unconscious|hidden/)) {
    return "Shadow";
  }

  // Default heuristic:
  // - MAIA (assistant) → MainOracle (she is the oracle)
  // - User → InnerGuide (they are seeking inner guidance)
  return role === "assistant" ? "MainOracle" : "InnerGuide";
}

/**
 * Save a MAIA conversation exchange to Akashic Records (insight_history)
 * Non-blocking: Returns immediately, logs errors but doesn't throw
 *
 * @param role - "user" or "assistant" (MAIA)
 * @param content - The conversation text
 * @param userId - User ID (optional)
 * @param conversationMode - MAIA's mode: "dialogue" | "patient" | "scribe" | "oracle"
 * @param sessionId - Session ID for grouping related insights
 */
export async function saveMaiaToAkashic(
  role: string,
  content: string,
  userId?: string,
  conversationMode?: string,
  sessionId?: string
): Promise<void> {
  try {
    const supabase = createClient();
    const element = detectElement(content);
    const archetype = detectMaiaArchetype(content, role, conversationMode);

    const { error } = await supabase.from("insight_history").insert({
      user_id: userId || null,
      role,
      content,
      element,
      source: "MAIA", // Distinguishes MAIA from ClaudeMirror
      created_at: new Date().toISOString(),
      metadata: {
        archetype,
        session_id: sessionId || null,
        conversation_mode: conversationMode || null,
      },
    });

    if (error) {
      // Log but don't throw - this is non-critical
      console.warn("[saveMaiaToAkashic] Insight not saved (table may not exist):", error.message);
    } else {
      console.debug(`🎙️ MAIA Akashic Record saved: ${element} • ${archetype} • ${role}`);

      // 🜃 TRIPLE SAVE: Also embed to field_vectors for semantic search
      // Non-blocking - runs in background
      embedToField(content, element, archetype, {
        source: "MAIA",
        role,
        conversation_mode: conversationMode,
        session_id: sessionId,
      }).catch((err) => {
        console.debug("[saveMaiaToAkashic] Field embedding skipped:", err);
      });
    }
  } catch (err) {
    // Silently handle errors - Akashic archival is optional
    console.debug("[saveMaiaToAkashic] Archival skipped:", err);
  }
}

/**
 * Save MAIA conversation exchange with automatic role detection
 * Convenience wrapper for common use case
 */
export async function saveMaiaConversation(
  userMessage: string,
  maiaResponse: string,
  userId?: string,
  conversationMode?: string,
  sessionId?: string
): Promise<void> {
  // Save both user and MAIA messages to Akashic Records
  await Promise.all([
    saveMaiaToAkashic("user", userMessage, userId, conversationMode, sessionId),
    saveMaiaToAkashic("assistant", maiaResponse, userId, conversationMode, sessionId),
  ]);
}
