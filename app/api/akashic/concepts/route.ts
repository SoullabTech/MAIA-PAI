// app/api/akashic/concepts/route.ts
// 🜃 Concept exploration and relationship mapping

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/akashic/concepts?category=technical&limit=50
 *
 * Returns all concepts with optional category filtering
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");

    const supabase = createClient();

    let query = supabase
      .from("akashic_concepts")
      .select("*")
      .order("mention_count", { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Concepts query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch concepts", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      concepts: data || [],
      count: data?.length || 0,
    });
  } catch (error: any) {
    console.error("Error in GET /api/akashic/concepts:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/akashic/concepts
 *
 * Create or update a concept
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, definition, relatedConcepts } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Concept name is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("akashic_concepts")
      .upsert(
        {
          name,
          category: category || null,
          definition: definition || null,
          related_concepts: relatedConcepts || [],
        },
        {
          onConflict: "name",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Concept creation error:", error);
      return NextResponse.json(
        { error: "Failed to create concept", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      concept: data,
      created: true,
    });
  } catch (error: any) {
    console.error("Error in POST /api/akashic/concepts:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
