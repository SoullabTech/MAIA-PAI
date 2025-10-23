// field-service/app/api/field/query/route.ts
// 🜃 Field Resonance Aggregator — Query endpoint
// Receives vector queries from nodes and returns statistical resonance patterns

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * POST /api/field/query
 * Query the collective field for resonance patterns
 *
 * Auth: Requires valid node credentials via X-Node-ID header
 * and Authorization header with field key
 */
export async function POST(req: NextRequest) {
  try {
    // Validate request
    const nodeId = req.headers.get("X-Node-ID");
    const authHeader = req.headers.get("Authorization");

    if (!nodeId || !authHeader) {
      return NextResponse.json(
        { error: "Missing node credentials" },
        { status: 401 }
      );
    }

    // Verify field key (simple bearer token - enhance with JWT if needed)
    const fieldKey = process.env.AKASHIC_FIELD_KEY;
    if (fieldKey && !authHeader.includes(fieldKey)) {
      return NextResponse.json(
        { error: "Invalid field key" },
        { status: 403 }
      );
    }

    const {
      qvec,
      elementHint,
      archetypeHint,
      limit = 10,
      origin,
      queryText
    } = await req.json();

    if (!qvec || !Array.isArray(qvec)) {
      return NextResponse.json(
        { error: "Invalid query vector" },
        { status: 400 }
      );
    }

    // Connect to field database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Search similar embeddings using the match function
    const { data, error } = await supabase.rpc("match_field_vectors", {
      query_embedding: qvec as any,
      match_threshold: 0.7,
      match_count: limit * 2, // Get extra for filtering
    });

    if (error) {
      console.error("Field vector match error:", error);
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
      totalSimilarity: number;
      nodes: Set<string>;
      latestResonance: Date;
    }> = {};

    for (const row of data ?? []) {
      const key = `${row.element || "Unknown"}:${row.archetype || "Unknown"}`;

      if (!buckets[key]) {
        buckets[key] = {
          element: row.element || "Unknown",
          archetype: row.archetype || "Unknown",
          count: 0,
          totalSimilarity: 0,
          nodes: new Set(),
          latestResonance: new Date(row.created_at)
        };
      }

      buckets[key].count++;
      buckets[key].totalSimilarity += row.similarity;
      buckets[key].nodes.add(row.node_id);

      const rowDate = new Date(row.created_at);
      if (rowDate > buckets[key].latestResonance) {
        buckets[key].latestResonance = rowDate;
      }
    }

    // Calculate aggregated results
    const results = Object.values(buckets)
      .map(bucket => ({
        element: bucket.element,
        archetype: bucket.archetype,
        count: bucket.count,
        avgSimilarity: bucket.totalSimilarity / bucket.count,
        nodeCount: bucket.nodes.size,
        latestResonance: bucket.latestResonance.toISOString()
      }))
      .filter(r =>
        (!elementHint || r.element === elementHint) &&
        (!archetypeHint || r.archetype === archetypeHint)
      )
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    // Log query for analytics (optional)
    if (process.env.LOG_FIELD_QUERIES === "true") {
      console.log({
        timestamp: new Date().toISOString(),
        origin,
        queryText: queryText?.slice(0, 50),
        resultsCount: results.length,
        totalMatches: data?.length ?? 0
      });
    }

    return NextResponse.json({
      results,
      metadata: {
        totalMatches: data?.length ?? 0,
        aggregatedPatterns: results.length,
        queryOrigin: origin,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("Field query error:", error);
    return NextResponse.json(
      { error: error?.message ?? "field query error" },
      { status: 500 }
    );
  }
}
