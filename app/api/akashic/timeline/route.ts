// app/api/akashic/timeline/route.ts
// 🜃 Temporal navigation through consciousness evolution

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/akashic/timeline?from=2025-01-01&to=2025-10-23&element=Fire&archetype=Shadow
 *
 * Returns temporal view of insights with elemental/archetypal filtering
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to") || new Date().toISOString();
    const element = searchParams.get("element");
    const archetype = searchParams.get("archetype");
    const userId = searchParams.get("userId");

    const supabase = createClient();

    // Query the materialized timeline view
    let query = supabase
      .from("akashic_timeline")
      .select("*")
      .order("date", { ascending: false });

    if (from) {
      query = query.gte("date", from);
    }

    query = query.lte("date", to);

    if (element) {
      query = query.eq("element", element);
    }

    if (archetype) {
      query = query.eq("archetype", archetype);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Timeline query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch timeline", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      timeline: data || [],
      filters: {
        from,
        to,
        element,
        archetype,
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/akashic/timeline:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
