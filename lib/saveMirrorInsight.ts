// lib/saveMirrorInsight.ts
// 🜂 Archives Claude Mirror reflections into Supabase insight_history table with elemental + archetypal classification

import { createClient } from "@/lib/supabase";

function detectElement(content: string): string {
  const lower = content.toLowerCase();
  if (lower.match(/fire|ignite|create|transform|vision|light|emerge|birth|catalyst/)) return "Fire";
  if (lower.match(/water|feel|flow|dream|emotion|shadow|dissolve|reflect|intuition/)) return "Water";
  if (lower.match(/earth|ground|build|body|form|structure|manifest|practical|concrete/)) return "Earth";
  if (lower.match(/air|speak|mind|clarity|idea|breath|communicate|abstract|pattern/)) return "Air";
  if (lower.match(/aether|spirit|field|presence|soul|coherence|integrate|unity|wholeness/)) return "Aether";
  return "Unknown";
}

function detectArchetype(content: string, role: string): string {
  const lower = content.toLowerCase();

  // MainOracle: System-level wisdom, technical architecture, project vision
  if (lower.match(/system|architecture|oracle|framework|infrastructure|design pattern|core/)) {
    return "MainOracle";
  }

  // Shadow: Unconscious patterns, integration work, hidden dynamics, debugging deep issues
  if (lower.match(/shadow|unconscious|hidden|integrate|beneath|underlying|deeper|unaware|blocked/)) {
    return "Shadow";
  }

  // InnerGuide: Personal insight, journaling, self-reflection, emotional processing
  if (lower.match(/guide|insight|journal|reflect|feeling|process|understand|discover|aware/)) {
    return "InnerGuide";
  }

  // Dream: Symbolic interpretation, vision work, imagination, creative exploration
  if (lower.match(/dream|symbol|vision|imagine|metaphor|story|mythic|archetype/)) {
    return "Dream";
  }

  // Mentor: Teaching, knowledge transfer, explanation, learning, documentation
  if (lower.match(/teach|learn|explain|understand|how to|guide|mentor|lesson|principle/)) {
    return "Mentor";
  }

  // Relationship: Connection patterns, collaboration, communication, interpersonal dynamics
  if (lower.match(/relationship|connect|collaborate|together|between|partner|dialogue|conversation/)) {
    return "Relationship";
  }

  // Alchemist: Transformation, transmutation, refactoring, integration of opposites
  if (lower.match(/transform|alchemy|transmute|integrate|synthesize|merge|refactor|evolve/)) {
    return "Alchemist";
  }

  // Default heuristic: Assistant messages often MainOracle, user messages often InnerGuide
  return role === "assistant" ? "MainOracle" : "InnerGuide";
}

/**
 * Save a Claude Mirror insight to Supabase with elemental + archetypal classification
 * Non-blocking: Returns immediately, logs errors but doesn't throw
 */
export async function saveMirrorInsight(
  role: string,
  content: string,
  userId?: string
): Promise<void> {
  try {
    const supabase = createClient();
    const element = detectElement(content);
    const archetype = detectArchetype(content, role);

    const { error } = await supabase.from("insight_history").insert({
      user_id: userId || null,
      role,
      content,
      element,
      archetype,
      source: "ClaudeMirror",
      created_at: new Date().toISOString(),
    });

    if (error) {
      // Log but don't throw - this is non-critical
      console.warn("Mirror insight not saved (table may not exist):", error.message);
    } else {
      console.debug(`🜃 Akashic Record saved: ${element} • ${archetype}`);
    }
  } catch (err) {
    // Silently handle errors - mirror archival is optional
    console.debug("Mirror archival skipped:", err);
  }
}
