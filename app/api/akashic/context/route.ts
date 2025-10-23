// app/api/akashic/context/route.ts
// 🜃 Context Inheritance — Retrieve relevant past wisdom for new sessions

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ContextItem {
  id: string;
  content: string;
  element: string;
  archetype: string;
  timestamp: string;
  relevance: number;
  keyPoints: string[];
}

interface ContextResponse {
  context: ContextItem[];
  summary: string;
  totalInsights: number;
}

/**
 * GET /api/akashic/context?topic=authentication&lastN=5&userId=xxx
 *
 * Retrieves relevant context from past sessions for inheritance
 * Can be called at the start of a new Claude session to inject historical wisdom
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const topic = searchParams.get("topic");
    const lastN = parseInt(searchParams.get("lastN") || "5");
    const userId = searchParams.get("userId");
    const minRelevance = parseFloat(searchParams.get("minRelevance") || "0.7");

    if (!topic) {
      return NextResponse.json(
        { error: "Topic parameter is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Generate embedding for topic
    let contextItems: ContextItem[] = [];

    try {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: topic,
      });

      const queryEmbedding = embeddingResponse.data[0].embedding;

      // Query for semantic matches
      let query = supabase.rpc("match_akashic_insights", {
        query_embedding: queryEmbedding,
        match_threshold: minRelevance,
        match_count: lastN * 2, // Get more to ensure we have enough after filtering
      });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Context retrieval error:", error);
      } else if (data) {
        contextItems = data.slice(0, lastN).map((item: any) => ({
          id: item.id,
          content: item.content,
          element: item.element,
          archetype: item.archetype,
          timestamp: item.created_at,
          relevance: item.similarity,
          keyPoints: extractKeyPoints(item.content),
        }));
      }
    } catch (embeddingError) {
      console.error("Embedding generation failed:", embeddingError);
      // Fall back to keyword search
      let fallbackQuery = supabase
        .from("insight_history")
        .select("*")
        .textSearch("content", topic, {
          type: "websearch",
          config: "english",
        })
        .order("created_at", { ascending: false })
        .limit(lastN);

      if (userId) {
        fallbackQuery = fallbackQuery.eq("user_id", userId);
      }

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;

      if (!fallbackError && fallbackData) {
        contextItems = fallbackData.map((item: any) => ({
          id: item.id,
          content: item.content,
          element: item.element,
          archetype: item.archetype,
          timestamp: item.created_at,
          relevance: 0.5, // Default relevance for keyword match
          keyPoints: extractKeyPoints(item.content),
        }));
      }
    }

    // Generate summary of context
    const summary = generateContextSummary(contextItems, topic);

    const response: ContextResponse = {
      context: contextItems,
      summary,
      totalInsights: contextItems.length,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error in GET /api/akashic/context:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Extract key points from content (simplified heuristic)
 */
function extractKeyPoints(content: string): string[] {
  // Split into sentences
  const sentences = content
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  // Take first 2-3 sentences as key points
  return sentences.slice(0, 3);
}

/**
 * Generate a summary of the retrieved context
 */
function generateContextSummary(
  contextItems: ContextItem[],
  topic: string
): string {
  if (contextItems.length === 0) {
    return `No prior context found for "${topic}".`;
  }

  const elements = [...new Set(contextItems.map((c) => c.element))].filter(
    (e) => e && e !== "Unknown"
  );
  const archetypes = [...new Set(contextItems.map((c) => c.archetype))].filter(
    (a) => a && a !== "Unknown"
  );

  const avgRelevance =
    contextItems.reduce((sum, c) => sum + c.relevance, 0) /
    contextItems.length;

  const oldestDate = new Date(
    Math.min(...contextItems.map((c) => new Date(c.timestamp).getTime()))
  );
  const newestDate = new Date(
    Math.max(...contextItems.map((c) => new Date(c.timestamp).getTime()))
  );

  const dateRange =
    oldestDate.toLocaleDateString() === newestDate.toLocaleDateString()
      ? oldestDate.toLocaleDateString()
      : `${oldestDate.toLocaleDateString()} - ${newestDate.toLocaleDateString()}`;

  return `Found ${contextItems.length} relevant insights about "${topic}" from ${dateRange}. Primary elements: ${elements.join(", ")}. Archetypes involved: ${archetypes.join(", ")}. Average relevance: ${(avgRelevance * 100).toFixed(0)}%.`;
}
