// lib/services/fieldQueryService.ts
// 🜃 Akashic Field Query Service
// Retrieve semantically relevant insights from the field to inform MAIA's responses

import { createClient } from "@/lib/supabase";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface FieldInsight {
  element: string;
  archetype: string;
  similarity: number;
  metadata: {
    source?: string;
    role?: string;
    session_id?: string;
    conversation_mode?: string;
    embedded_at?: string;
    content_length?: number;
    [key: string]: any;
  };
  created_at: string;
}

/**
 * Query the Akashic Field for semantically similar insights
 *
 * @param query - The user's current message or question
 * @param options - Query configuration
 * @returns Array of relevant insights from the field
 */
export async function queryAkashicField(
  query: string,
  options?: {
    matchThreshold?: number;  // Similarity threshold (0-1), default 0.7
    matchCount?: number;      // Max results to return, default 5
    filterElement?: string;   // Filter by element
    filterArchetype?: string; // Filter by archetype
    userId?: string;          // Filter by user (for privacy)
  }
): Promise<FieldInsight[]> {
  try {
    // Don't query on empty input
    if (!query || query.trim().length < 3) {
      return [];
    }

    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query.slice(0, 8000),
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Query field_vectors using match_field_vectors function
    const supabase = createClient();
    const { data, error } = await supabase.rpc("match_field_vectors", {
      query_embedding: queryEmbedding,
      match_threshold: options?.matchThreshold || 0.7,
      match_count: options?.matchCount || 5,
    });

    if (error) {
      console.error("[queryAkashicField] Error querying field:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.debug("[queryAkashicField] No matches found");
      return [];
    }

    // Apply additional filters if specified
    let filteredData = data;

    if (options?.filterElement) {
      filteredData = filteredData.filter((d: any) => d.element === options.filterElement);
    }

    if (options?.filterArchetype) {
      filteredData = filteredData.filter((d: any) => d.archetype === options.filterArchetype);
    }

    console.log(`🜃 Found ${filteredData.length} relevant insights from field`);

    return filteredData.map((insight: any) => ({
      element: insight.element,
      archetype: insight.archetype,
      similarity: insight.similarity,
      metadata: insight.metadata || {},
      created_at: insight.created_at,
    }));
  } catch (error: any) {
    console.error("[queryAkashicField] Error:", error);
    return [];
  }
}

/**
 * Query field and format results as context for MAIA's prompt
 *
 * @param query - The user's current message
 * @param options - Query configuration
 * @returns Formatted context string for system prompt
 */
export async function getFieldContext(
  query: string,
  options?: {
    matchThreshold?: number;
    matchCount?: number;
    filterElement?: string;
    filterArchetype?: string;
    userId?: string;
  }
): Promise<string> {
  const insights = await queryAkashicField(query, options);

  if (insights.length === 0) {
    return "";
  }

  // Format insights into readable context
  let context = "## Relevant Insights from Akashic Field:\n\n";

  for (const insight of insights) {
    context += `- ${insight.element} • ${insight.archetype} `;
    context += `(similarity: ${(insight.similarity * 100).toFixed(0)}%)\n`;

    // Add metadata context if available
    if (insight.metadata.conversation_mode) {
      context += `  Mode: ${insight.metadata.conversation_mode}\n`;
    }
    if (insight.metadata.session_id) {
      context += `  Session: ${insight.metadata.session_id}\n`;
    }
  }

  return context;
}

/**
 * Get field summary - overall patterns and themes
 * Useful for understanding the user's journey at a glance
 */
export async function getFieldSummary(userId?: string): Promise<{
  totalInsights: number;
  elementDistribution: Record<string, number>;
  archetypeDistribution: Record<string, number>;
  recentActivity: Date | null;
}> {
  try {
    const supabase = createClient();

    // Get counts by element
    const { data: elementData } = await supabase
      .from("field_vectors")
      .select("element, metadata")
      .eq("metadata->>source", "MAIA");

    if (!elementData) {
      return {
        totalInsights: 0,
        elementDistribution: {},
        archetypeDistribution: {},
        recentActivity: null,
      };
    }

    const elementDist: Record<string, number> = {};
    const archetypeDist: Record<string, number> = {};
    let recentActivity: Date | null = null;

    for (const row of elementData) {
      // Count elements
      elementDist[row.element] = (elementDist[row.element] || 0) + 1;

      // Count archetypes from metadata
      const archetype = row.metadata?.archetype;
      if (archetype) {
        archetypeDist[archetype] = (archetypeDist[archetype] || 0) + 1;
      }

      // Track most recent activity
      const embeddedAt = row.metadata?.embedded_at;
      if (embeddedAt) {
        const date = new Date(embeddedAt);
        if (!recentActivity || date > recentActivity) {
          recentActivity = date;
        }
      }
    }

    return {
      totalInsights: elementData.length,
      elementDistribution: elementDist,
      archetypeDistribution: archetypeDist,
      recentActivity,
    };
  } catch (error) {
    console.error("[getFieldSummary] Error:", error);
    return {
      totalInsights: 0,
      elementDistribution: {},
      archetypeDistribution: {},
      recentActivity: null,
    };
  }
}
