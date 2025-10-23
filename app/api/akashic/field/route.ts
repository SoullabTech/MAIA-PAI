// app/api/akashic/field/route.ts
// 🜃 Collective Field Resonance — statistical reflection of the lattice
// Queries the distributed field index for emergent patterns

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/**
 * POST /api/akashic/field
 * Query the collective field for resonance patterns
 *
 * Body:
 *   - query: string (the question/intent to find resonance for)
 *   - elementHint?: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Aether'
 *   - archetypeHint?: string
 *   - limit?: number (default: 10)
 *   - useLocalField?: boolean (query local vectors instead of distributed)
 */
export async function POST(req: NextRequest) {
  try {
    const {
      query,
      elementHint,
      archetypeHint,
      limit = 10,
      useLocalField = false
    } = await req.json();

    if (!query || !query.trim()) {
      return NextResponse.json({
        results: [],
        message: "Empty query"
      });
    }

    // 1. Embed the query (1536 dimensions to match table)
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-large",
      dimensions: 1536,
      input: query.slice(0, 8000),
    });
    const queryVector = embeddingResponse.data[0].embedding;

    // 2. Choose between local field or distributed field
    if (useLocalField || !process.env.AKASHIC_FIELD_URL) {
      // Query local field_vectors table
      return await queryLocalField({
        queryVector,
        elementHint,
        archetypeHint,
        limit
      });
    } else {
      // Query distributed field aggregator
      return await queryDistributedField({
        queryVector,
        elementHint,
        archetypeHint,
        limit,
        query
      });
    }

  } catch (error: any) {
    console.error("Field query error:", error);
    return NextResponse.json(
      { error: error?.message ?? "field query error" },
      { status: 500 }
    );
  }
}

/**
 * Query local field_vectors table
 */
async function queryLocalField({
  queryVector,
  elementHint,
  archetypeHint,
  limit
}: {
  queryVector: number[];
  elementHint?: string;
  archetypeHint?: string;
  limit: number;
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Use the match_field_vectors function
  const { data, error } = await supabase.rpc("match_field_vectors", {
    query_embedding: queryVector as any,
    match_threshold: 0.7,
    match_count: limit * 3, // Get more results for filtering
  });

  if (error) {
    console.error("Local field query error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Aggregate by element/archetype
  const buckets: Record<string, {
    element: string;
    archetype: string;
    count: number;
    avgSimilarity: number;
    nodes: Set<string>;
  }> = {};

  for (const row of data ?? []) {
    const key = `${row.element || "Unknown"}:${row.archetype || "Unknown"}`;

    if (!buckets[key]) {
      buckets[key] = {
        element: row.element || "Unknown",
        archetype: row.archetype || "Unknown",
        count: 0,
        avgSimilarity: 0,
        nodes: new Set()
      };
    }

    buckets[key].count++;
    buckets[key].avgSimilarity += row.similarity;
    buckets[key].nodes.add(row.node_id);
  }

  // Calculate averages and filter
  const results = Object.values(buckets)
    .map(bucket => ({
      element: bucket.element,
      archetype: bucket.archetype,
      count: bucket.count,
      avgSimilarity: bucket.avgSimilarity / bucket.count,
      nodeCount: bucket.nodes.size
    }))
    .filter(r =>
      (!elementHint || r.element === elementHint) &&
      (!archetypeHint || r.archetype === archetypeHint)
    )
    .sort((a, b) => b.avgSimilarity - a.avgSimilarity)
    .slice(0, limit);

  return NextResponse.json({
    results,
    source: "local",
    totalMatches: data?.length ?? 0
  });
}

/**
 * Query distributed field aggregator service
 */
async function queryDistributedField({
  queryVector,
  elementHint,
  archetypeHint,
  limit,
  query
}: {
  queryVector: number[];
  elementHint?: string;
  archetypeHint?: string;
  limit: number;
  query: string;
}) {
  const FIELD_URL = process.env.AKASHIC_FIELD_URL;
  const NODE_ID = process.env.AKASHIC_NODE_ID || "default-node";

  try {
    const response = await fetch(`${FIELD_URL}/api/field/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Node-ID": NODE_ID,
        "Authorization": `Bearer ${process.env.AKASHIC_FIELD_KEY || ""}`
      },
      body: JSON.stringify({
        qvec: queryVector,
        elementHint,
        archetypeHint,
        limit,
        origin: NODE_ID,
        queryText: query.slice(0, 200) // Truncated for logging only
      }),
    });

    if (!response.ok) {
      throw new Error(`Field service returned ${response.status}`);
    }

    const json = await response.json();
    return NextResponse.json({
      ...json,
      source: "distributed"
    });

  } catch (error: any) {
    console.error("Distributed field query failed, falling back to local:", error);

    // Fallback to local field if distributed fails
    return await queryLocalField({
      queryVector,
      elementHint,
      archetypeHint,
      limit
    });
  }
}

/**
 * GET /api/akashic/field?hours=24
 * Get current field statistics for terrain visualization
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hours = parseInt(searchParams.get("hours") || "24");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Calculate time window
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setHours(fromDate.getHours() - hours);

    // Query insights
    const { data: insights, error } = await supabase
      .from("insight_history")
      .select("element, archetype, created_at")
      .gte("created_at", fromDate.toISOString())
      .lte("created_at", toDate.toISOString())
      .not("element", "is", null)
      .not("archetype", "is", null);

    if (error) {
      console.error("Field statistics error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!insights || insights.length === 0) {
      return NextResponse.json({
        statistics: [],
        timeWindow: `${hours} hours`,
        timestamp: new Date().toISOString()
      });
    }

    // Aggregate by element-archetype
    const statsMap = new Map<string, {
      element: string;
      archetype: string;
      count: number;
      node_count: number;
      avg_age_hours: number;
    }>();

    for (const insight of insights) {
      const key = `${insight.element}::${insight.archetype}`;

      if (!statsMap.has(key)) {
        statsMap.set(key, {
          element: insight.element || "Unknown",
          archetype: insight.archetype || "Unknown",
          count: 0,
          node_count: 0,
          avg_age_hours: 0,
        });
      }

      const stat = statsMap.get(key)!;
      stat.count++;
      stat.node_count++;

      // Calculate age
      const ageMs = toDate.getTime() - new Date(insight.created_at).getTime();
      const ageHours = ageMs / (1000 * 60 * 60);
      stat.avg_age_hours += ageHours;
    }

    // Calculate averages
    const statistics = Array.from(statsMap.values()).map((stat) => ({
      ...stat,
      avg_age_hours: stat.avg_age_hours / stat.count,
    }));

    // Sort by count
    statistics.sort((a, b) => b.count - a.count);

    return NextResponse.json({
      statistics,
      timeWindow: `${hours} hours`,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Field statistics error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Statistics query error" },
      { status: 500 }
    );
  }
}
