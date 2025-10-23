// backend
// app/api/field/ingest/route.ts
// Central field service - receive anonymized vectors from nodes
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { node_id, element, archetype, embedding, hash } = body;

  // Validate required fields
  if (!node_id || !embedding || !hash) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!Array.isArray(embedding) || embedding.length !== 3072) {
    return NextResponse.json({ error: "Invalid embedding dimension" }, { status: 400 });
  }

  const supabase = createClient();

  // Upsert by hash to prevent duplicates
  const { error } = await supabase
    .from("field_vectors")
    .upsert(
      {
        id: hash,
        node_id,
        element: element || null,
        archetype: archetype || null,
        embedding,
        created_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Async refresh stats (don't wait)
  supabase.rpc("refresh_field_stats").catch(() => {});

  return NextResponse.json({ ok: true });
}
