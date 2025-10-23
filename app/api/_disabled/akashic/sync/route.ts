// backend
// app/api/akashic/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { AkashicBundle } from "@/types/akashic";

export const dynamic = "force-dynamic";

function hmac(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const secret = process.env.AKASHIC_SYNC_SECRET;
  if (!secret) return NextResponse.json({ error: "Missing secret" }, { status: 500 });

  const bundle = (await req.json()) as AkashicBundle;
  const { origin_node, items, signature } = bundle;

  const payload = JSON.stringify(items);
  const check = hmac(payload, secret);
  if (check !== signature) {
    await supabase.from("akashic_sync_log").insert({
      direction: "pull",
      peer: origin_node,
      bundle_count: items?.length ?? 0,
      status: "rejected",
      details: "signature mismatch",
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const rows = (items || []).map((i) => ({
    origin_node,
    agent_id: i.agent_id ?? null,
    role: i.role,
    content: i.content,
    element: i.element ?? null,
    archetype: i.archetype ?? null,
    created_at: i.created_at,
    confidence_score: i.confidence_score ?? null,
    content_hash: i.content_hash,
    signature,
  }));

  // upsert by content_hash to avoid dupes
  const { error } = await supabase
    .from("akashic_external_insights")
    .upsert(rows, { onConflict: "content_hash" });

  await supabase.from("akashic_sync_log").insert({
    direction: "pull",
    peer: origin_node,
    bundle_count: rows.length,
    status: error ? "error" : "accepted",
    details: error?.message ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // refresh counts view async
  await supabase.rpc("akashic_refresh_counts").catch(() => {});
  return NextResponse.json({ ok: true, accepted: rows.length });
}
