// app/api/akashic/query/route.ts
// 🜃 Akashic Records Query API — Natural language + semantic search across all wisdom

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface QueryFilters {
  elements?: string[];
  archetypes?: string[];
  dateRange?: [string, string];
  sessionIds?: string[];
  minRelevance?: number;
  userId?: string;
}

interface AkashicQueryResult {
  id: string;
  type: "insight" | "session";
  content: string;
  element: string;
  archetype: string;
  relevance: number;
  timestamp: string;
  metadata: Record<string, any>;
  context?: string;
}

interface QueryResponse {
  results: AkashicQueryResult[];
  totalCount: number;
  query: string;
  mode: "semantic" | "keyword" | "hybrid";
  executionTime: number;
}

/**
 * POST /api/akashic/query
 *
 * Natural language query interface for Akashic Records
 *
 * Body:
 * {
 *   query: string,
 *   filters?: {
 *     elements?: string[],
 *     archetypes?: string[],
 *     dateRange?: [Date, Date],
 *     sessionIds?: string[],
 *     minRelevance?: number
 *   },
 *   mode?: 'semantic' | 'keyword' | 'hybrid',
 *   limit?: number
 * }
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const {
      query,
      filters = {},
      mode = "hybrid",
      limit = 20,
    } = body as {
      query: string;
      filters?: QueryFilters;
      mode?: "semantic" | "keyword" | "hybrid";
      limit?: number;
    };

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query cannot be empty" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    let results: AkashicQueryResult[] = [];

    // === SEMANTIC SEARCH ===
    if (mode === "semantic" || mode === "hybrid") {
      try {
        // Generate embedding for query
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: query,
        });

        const queryEmbedding = embeddingResponse.data[0].embedding;

        // Build semantic search query
        let semanticQuery = supabase
          .rpc("match_akashic_insights", {
            query_embedding: queryEmbedding,
            match_threshold: filters.minRelevance || 0.7,
            match_count: limit,
          });

        // Apply filters
        if (filters.elements && filters.elements.length > 0) {
          semanticQuery = semanticQuery.in("element", filters.elements);
        }

        if (filters.archetypes && filters.archetypes.length > 0) {
          semanticQuery = semanticQuery.in("archetype", filters.archetypes);
        }

        if (filters.dateRange) {
          semanticQuery = semanticQuery
            .gte("created_at", filters.dateRange[0])
            .lte("created_at", filters.dateRange[1]);
        }

        if (filters.userId) {
          semanticQuery = semanticQuery.eq("user_id", filters.userId);
        }

        const { data: semanticResults, error: semanticError } = await semanticQuery;

        if (semanticError) {
          console.error("Semantic search error:", semanticError);
          // Fall back to keyword search
        } else if (semanticResults) {
          results = semanticResults.map((r: any) => ({
            id: r.id,
            type: "insight",
            content: r.content,
            element: r.element,
            archetype: r.archetype,
            relevance: r.similarity,
            timestamp: r.created_at,
            metadata: r.metadata || {},
            context: extractContext(r.content, query),
          }));
        }
      } catch (embeddingError) {
        console.error("Embedding generation failed:", embeddingError);
        // Fall back to keyword search
      }
    }

    // === KEYWORD SEARCH (fallback or hybrid mode) ===
    if (
      (mode === "keyword" || mode === "hybrid") &&
      results.length < limit
    ) {
      let keywordQuery = supabase
        .from("insight_history")
        .select("*")
        .textSearch("content", query, {
          type: "websearch",
          config: "english",
        })
        .limit(limit - results.length);

      // Apply filters
      if (filters.elements && filters.elements.length > 0) {
        keywordQuery = keywordQuery.in("element", filters.elements);
      }

      if (filters.archetypes && filters.archetypes.length > 0) {
        keywordQuery = keywordQuery.in("archetype", filters.archetypes);
      }

      if (filters.dateRange) {
        keywordQuery = keywordQuery
          .gte("created_at", filters.dateRange[0])
          .lte("created_at", filters.dateRange[1]);
      }

      if (filters.userId) {
        keywordQuery = keywordQuery.eq("user_id", filters.userId);
      }

      const { data: keywordResults, error: keywordError } = await keywordQuery;

      if (keywordError) {
        console.error("Keyword search error:", keywordError);
      } else if (keywordResults) {
        const keywordMapped = keywordResults.map((r: any) => ({
          id: r.id,
          type: "insight" as const,
          content: r.content,
          element: r.element,
          archetype: r.archetype,
          relevance: calculateKeywordRelevance(r.content, query),
          timestamp: r.created_at,
          metadata: r.metadata || {},
          context: extractContext(r.content, query),
        }));

        // Merge with semantic results, removing duplicates
        const existingIds = new Set(results.map((r) => r.id));
        const newResults = keywordMapped.filter((r) => !existingIds.has(r.id));
        results = [...results, ...newResults];
      }
    }

    // Sort by relevance and limit
    results = results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);

    const executionTime = Date.now() - startTime;

    const response: QueryResponse = {
      results,
      totalCount: results.length,
      query,
      mode,
      executionTime,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error in POST /api/akashic/query:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Extract relevant context around query matches
 */
function extractContext(content: string, query: string): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/);

  // Find first occurrence of any query word
  let startIndex = -1;
  for (const word of queryWords) {
    const index = lowerContent.indexOf(word);
    if (index !== -1 && (startIndex === -1 || index < startIndex)) {
      startIndex = index;
    }
  }

  if (startIndex === -1) {
    // No match found, return beginning
    return content.substring(0, 200) + (content.length > 200 ? "..." : "");
  }

  // Extract context window around match
  const contextStart = Math.max(0, startIndex - 50);
  const contextEnd = Math.min(content.length, startIndex + 150);
  let context = content.substring(contextStart, contextEnd);

  if (contextStart > 0) context = "..." + context;
  if (contextEnd < content.length) context = context + "...";

  return context;
}

/**
 * Calculate relevance score for keyword matches
 */
function calculateKeywordRelevance(content: string, query: string): number {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/);

  let matchCount = 0;
  let exactMatch = false;

  // Check for exact phrase match
  if (lowerContent.includes(lowerQuery)) {
    exactMatch = true;
    matchCount += 10;
  }

  // Count word matches
  for (const word of queryWords) {
    if (word.length < 3) continue; // Skip short words
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = lowerContent.match(regex);
    if (matches) {
      matchCount += matches.length;
    }
  }

  // Normalize to 0-1 scale
  let relevance = Math.min(matchCount / (queryWords.length * 2), 1);
  if (exactMatch) relevance = Math.max(relevance, 0.9);

  return Math.round(relevance * 100) / 100;
}
