// backend
// app/api/field/query/route.ts
// Central field service - query collective patterns
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { qvec, elementHint, archetypeHint, limit = 10, minNodeCount = 1 } = await req.json();

  if (!qvec || !Array.isArray(qvec)) {
    return NextResponse.json({ error: "Invalid query vector" }, { status: 400 });
  }

  const supabase = createClient();

  // Search similar embeddings across all nodes
  const { data, error } = await supabase.rpc("match_field_vectors", {
    query_embedding: qvec as unknown as number[],
    match_threshold: 0.7,
    match_count: limit * 3, // Get more to allow filtering
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Aggregate by element/archetype, track unique nodes
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

  // Filter and format results
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
}
