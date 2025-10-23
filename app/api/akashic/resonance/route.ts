// app/api/akashic/resonance/route.ts
// 🜃 Resonance Field API — Element-Archetype bucketed data for living visualization

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface ResonanceBucket {
  element: string;
  archetype: string;
  count: number;
  avgDepth: number;
  latestTimestamp: string;
}

interface ResonanceResponse {
  buckets: ResonanceBucket[];
  totalCount: number;
  timeWindow: {
    from: string;
    to: string;
  };
  dominantElement: string;
  dominantArchetype: string;
}

/**
 * GET /api/akashic/resonance?days=7&userId=xxx
 *
 * Returns bucketed resonance data for visualization
 * Each bucket = unique element-archetype combination with count
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const days = parseInt(searchParams.get("days") || "7");
    const userId = searchParams.get("userId");

    const supabase = createClient();

    // Calculate time window
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    // Query for element-archetype buckets
    let query = supabase
      .from("insight_history")
      .select("element, archetype, content, created_at")
      .gte("created_at", fromDate.toISOString())
      .lte("created_at", toDate.toISOString())
      .not("element", "is", null)
      .not("archetype", "is", null);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: insights, error } = await query;

    if (error) {
      console.error("Resonance query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch resonance", details: error.message },
        { status: 500 }
      );
    }

    if (!insights || insights.length === 0) {
      return NextResponse.json({
        buckets: [],
        totalCount: 0,
        timeWindow: {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        },
        dominantElement: "Unknown",
        dominantArchetype: "Unknown",
      });
    }

    // Bucket by element-archetype combination
    const bucketMap = new Map<string, ResonanceBucket>();

    for (const insight of insights) {
      const key = `${insight.element}::${insight.archetype}`;

      if (!bucketMap.has(key)) {
        bucketMap.set(key, {
          element: insight.element || "Unknown",
          archetype: insight.archetype || "Unknown",
          count: 0,
          avgDepth: 0,
          latestTimestamp: insight.created_at,
        });
      }

      const bucket = bucketMap.get(key)!;
      bucket.count++;
      bucket.avgDepth += insight.content?.length || 0;

      // Track latest timestamp
      if (
        new Date(insight.created_at) > new Date(bucket.latestTimestamp)
      ) {
        bucket.latestTimestamp = insight.created_at;
      }
    }

    // Calculate averages and convert to array
    const buckets: ResonanceBucket[] = Array.from(bucketMap.values()).map(
      (bucket) => ({
        ...bucket,
        avgDepth: Math.round(bucket.avgDepth / bucket.count),
      })
    );

    // Sort by count descending
    buckets.sort((a, b) => b.count - a.count);

    // Find dominant element and archetype
    const elementCounts = new Map<string, number>();
    const archetypeCounts = new Map<string, number>();

    for (const bucket of buckets) {
      elementCounts.set(
        bucket.element,
        (elementCounts.get(bucket.element) || 0) + bucket.count
      );
      archetypeCounts.set(
        bucket.archetype,
        (archetypeCounts.get(bucket.archetype) || 0) + bucket.count
      );
    }

    const dominantElement =
      Array.from(elementCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Unknown";

    const dominantArchetype =
      Array.from(archetypeCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Unknown";

    const response: ResonanceResponse = {
      buckets,
      totalCount: insights.length,
      timeWindow: {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      },
      dominantElement,
      dominantArchetype,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error in GET /api/akashic/resonance:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
