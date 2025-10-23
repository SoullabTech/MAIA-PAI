// backend
// app/api/akashic/field/route.ts
// 🜃 Collective Field Resonance — statistical reflection of the lattice
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { query, elementHint, archetypeHint, limit = 10, minNodeCount = 1 } = await req.json();

    if (!query || !query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const supabase = createClient();

    // 1. Embed the query
    const emb = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: query.slice(0, 8000),
    });
    const qvec = emb.data[0].embedding;

    // 2. If AKASHIC_FIELD_URL is set, query external field service
    const FIELD_URL = process.env.AKASHIC_FIELD_URL;
    if (FIELD_URL) {
      try {
        const res = await fetch(`${FIELD_URL}/api/field/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            qvec,
            elementHint,
            archetypeHint,
            limit,
            minNodeCount,
            origin: process.env.AKASHIC_NODE_ID,
          }),
        });
        const json = await res.json();
        return NextResponse.json(json);
      } catch (e) {
        console.error("Field service unreachable, falling back to local");
      }
    }

    // 3. Fallback: Query local field_vectors table
    const { data, error } = await supabase.rpc("match_field_vectors", {
      query_embedding: qvec as unknown as number[],
      match_threshold: 0.7,
      match_count: limit * 2,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4. Aggregate by element/archetype
    const buckets: Record<string, { element: string; archetype: string; count: number; nodes: Set<string> }> = {};

    for (const row of data ?? []) {
      const key = `${row.element || "Unknown"}:${row.archetype || "Unknown"}`;
      if (!buckets[key]) {
        buckets[key] = {
          element: row.element || "Unknown",
          archetype: row.archetype || "Unknown",
          count: 0,
          nodes: new Set(),
        };
      }
      buckets[key].count++;
      if (row.node_id) buckets[key].nodes.add(row.node_id);
    }

    // 5. Filter and format results
    const results = Object.values(buckets)
      .filter((r) =>
        (!elementHint || r.element === elementHint) &&
        (!archetypeHint || r.archetype === archetypeHint) &&
        r.nodes.size >= minNodeCount
      )
      .map((r) => ({
        element: r.element,
        archetype: r.archetype,
        count: r.count,
        nodeCount: r.nodes.size,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "field query error" }, { status: 500 });
  }
}
