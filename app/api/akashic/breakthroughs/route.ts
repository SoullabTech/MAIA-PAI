// app/api/akashic/breakthroughs/route.ts
// 🜃 Breakthrough tracking and journey mapping

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/akashic/breakthroughs?status=integrated&element=Water&userId=xxx
 *
 * Returns breakthroughs with filtering
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const element = searchParams.get("element");
    const archetype = searchParams.get("archetype");
    const userId = searchParams.get("userId");
    const minSignificance = parseFloat(searchParams.get("minSignificance") || "0");

    const supabase = createClient();

    let query = supabase
      .from("akashic_breakthroughs")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("integration_status", status);
    }

    if (element) {
      query = query.eq("element", element);
    }

    if (archetype) {
      query = query.eq("archetype", archetype);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    if (minSignificance > 0) {
      query = query.gte("significance_score", minSignificance);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Breakthroughs query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch breakthroughs", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      breakthroughs: data || [],
      count: data?.length || 0,
    });
  } catch (error: any) {
    console.error("Error in GET /api/akashic/breakthroughs:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/akashic/breakthroughs
 *
 * Create a new breakthrough
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      sessionId,
      insightId,
      title,
      description,
      element,
      archetype,
      significanceScore,
      integrationStatus,
      buildsOn,
      metadata,
    } = body;

    if (!userId || !title) {
      return NextResponse.json(
        { error: "userId and title are required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("akashic_breakthroughs")
      .insert({
        user_id: userId,
        session_id: sessionId || null,
        insight_id: insightId || null,
        title,
        description: description || null,
        element: element || null,
        archetype: archetype || null,
        significance_score: significanceScore || 0.7,
        integration_status: integrationStatus || "emerged",
        builds_on: buildsOn || [],
        leads_to: [],
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Breakthrough creation error:", error);
      return NextResponse.json(
        { error: "Failed to create breakthrough", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      breakthrough: data,
      created: true,
    });
  } catch (error: any) {
    console.error("Error in POST /api/akashic/breakthroughs:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/akashic/breakthroughs
 *
 * Update breakthrough integration status
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, integrationStatus, leadsTo } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Breakthrough id is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const updates: any = {};
    if (integrationStatus) updates.integration_status = integrationStatus;
    if (leadsTo) updates.leads_to = leadsTo;

    const { data, error } = await supabase
      .from("akashic_breakthroughs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Breakthrough update error:", error);
      return NextResponse.json(
        { error: "Failed to update breakthrough", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      breakthrough: data,
      updated: true,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/akashic/breakthroughs:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
