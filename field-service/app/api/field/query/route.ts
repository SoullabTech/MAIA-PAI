// field-service/app/api/field/query/route.ts
// 🜃 Field Resonance Aggregator — Query endpoint
// Receives vector queries from nodes and returns statistical resonance patterns

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  calculateFieldResonanceIndex,
  type Vector,
  type FieldState,
} from "../../../../lib/resonance";

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

    // Get field state (frequencies and trust scores)
    const { data: fieldStateData, error: stateError } = await supabase.rpc("get_field_state");

    const fieldState: FieldState = {
      elementFrequencies: fieldStateData?.elementFrequencies || {},
      archetypeFrequencies: fieldStateData?.archetypeFrequencies || {},
      nodeTrustScores: fieldStateData?.nodeTrustScores || {},
      totalVectors: fieldStateData?.totalVectors || 0
    };

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

    // Convert Supabase results to Vector format
    const vectors: Vector[] = (data ?? []).map((row: any) => ({
      id: row.id,
      embedding: [], // Don't need full embedding for calculation, similarity already computed
      element: row.element || "Unknown",
      archetype: row.archetype || "Unknown",
      nodeId: row.node_id,
      timestamp: new Date(row.created_at),
      similarity: row.similarity
    }));

    // Calculate Field Resonance Index
    const resonanceResult = calculateFieldResonanceIndex(
      qvec,
      vectors,
      fieldState,
      limit
    );

    // Filter by element/archetype hints if provided
    let patterns = resonanceResult.topPatterns;
    if (elementHint || archetypeHint) {
      patterns = patterns.filter(p =>
        (!elementHint || p.element === elementHint) &&
        (!archetypeHint || p.archetype === archetypeHint)
      );
    }

    // Log query for analytics (optional)
    if (process.env.LOG_FIELD_QUERIES === "true") {
      console.log({
        timestamp: new Date().toISOString(),
        origin,
        queryText: queryText?.slice(0, 50),
        FRI: resonanceResult.FRI,
        interpretation: resonanceResult.interpretation,
        patternsCount: patterns.length
      });
    }

    return NextResponse.json({
      resonance: {
        FRI: resonanceResult.FRI,
        interpretation: resonanceResult.interpretation,
        components: resonanceResult.components
      },
      patterns,
      metadata: {
        ...resonanceResult.metadata,
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
