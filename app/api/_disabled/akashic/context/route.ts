// backend
// app/api/akashic/context/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { AkashicContextQuery, AkashicContextItem } from "@/types/akashic";

export const dynamic = "force-dynamic";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const body = (await req.json()) as AkashicContextQuery;

  const {
    query,
    elementHint,
    archetypeHint,
    includeExternal = true,
    limit = 5,
    minScore = 0.72,
  } = body || {};

  if (!query || !query.trim()) {
    return NextResponse.json({ items: [] satisfies AkashicContextItem[] });
  }

  // 1) Embed query
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: query.slice(0, 8000),
  });
  const qvec = emb.data[0].embedding;

  // 2) Local semantic
  const local = await supabase.rpc("match_akashic_insights", {
    query_embedding: qvec as unknown as number[],
    match_threshold: minScore,
    match_count: limit,
  });

  if (local.error) {
    return NextResponse.json({ error: local.error.message }, { status: 500 });
  }

  // 3) Optional external textual fallback (simple LIKE + hints)
  let external: { data: any[] } = { data: [] };
  if (includeExternal) {
    const { data } = await supabase
      .from("akashic_external_insights")
      .select("*")
      .ilike("content", `%${query.slice(0, 80)}%`)
      .limit(limit);
    external.data = data ?? [];
  }

  // 4) Merge + map
  const items: AkashicContextItem[] = [
    ...(local.data ?? []).map((r: any) => ({
      id: r.id,
      role: r.role,
      content: r.content,
      element: r.element,
      archetype: r.archetype,
      created_at: r.created_at,
      origin_node: r.origin_node ?? null,
      agent_id: r.agent_id ?? null,
      confidence_score: r.confidence_score ?? null,
      source: "local" as const,
      score: r.similarity ?? undefined,
    })),
    ...external.data.map((r: any) => ({
      id: r.id,
      role: r.role,
      content: r.content,
      element: r.element,
      archetype: r.archetype,
      created_at: r.created_at,
      origin_node: r.origin_node,
      agent_id: r.agent_id,
      confidence_score: r.confidence_score,
      source: "external" as const,
    })),
  ]
    .filter((x) =>
      elementHint ? (x.element?.toLowerCase() === elementHint.toLowerCase()) : true
    )
    .filter((x) =>
      archetypeHint ? (x.archetype?.toLowerCase() === archetypeHint.toLowerCase()) : true
    )
    .slice(0, limit);

  return NextResponse.json({ items });
}
