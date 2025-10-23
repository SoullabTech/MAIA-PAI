// backend
// scripts/akashic-sync.ts
// Usage: ts-node scripts/akashic-sync.ts
import "dotenv/config";
import crypto from "crypto";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const NODE_ID = process.env.AKASHIC_NODE_ID!;
const SECRET  = process.env.AKASHIC_SYNC_SECRET!;
const PEERS   = (process.env.AKASHIC_PEERS || "").split(",").map(s => s.trim()).filter(Boolean);
const BATCH_LIMIT = Number(process.env.AKASHIC_SYNC_LIMIT || 200);
const LOOKBACK_HOURS = Number(process.env.AKASHIC_SYNC_LOOKBACK_HOURS || 6);

function hmac(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function hashContent(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

(async () => {
  if (!NODE_ID || !SECRET || !PEERS.length) {
    console.error("Missing AKASHIC_NODE_ID / AKASHIC_SYNC_SECRET / AKASHIC_PEERS");
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const sinceISO = new Date(Date.now() - LOOKBACK_HOURS * 3600_000).toISOString();

  // Pull recent locals from insight_history
  const { data, error } = await supabase
    .from("insight_history")
    .select("id, role, content, element, archetype, created_at, agent_id, origin_node, confidence_score, content_hash")
    .gte("created_at", sinceISO)
    .order("created_at", { ascending: true })
    .limit(BATCH_LIMIT);

  if (error) throw error;
  const items = (data ?? []).map((r) => ({
    content_hash: r.content_hash || hashContent(r.content),
    created_at: r.created_at,
    role: r.role,
    content: r.content,
    element: r.element ?? null,
    archetype: r.archetype ?? null,
    agent_id: r.agent_id ?? null,
    confidence_score: r.confidence_score ?? null,
  }));

  const payload = {
    origin_node: NODE_ID,
    sent_at: new Date().toISOString(),
    items,
    signature: hmac(JSON.stringify(items), SECRET),
  };

  for (const peer of PEERS) {
    try {
      const res = await fetch(`${peer.replace(/\/$/, "")}/api/akashic/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      console.log("PUSH →", peer, res.status, json);
    } catch (e) {
      console.log("PUSH FAIL →", peer, String(e));
    }
  }

  process.exit(0);
})();
