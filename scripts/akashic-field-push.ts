// backend
// scripts/akashic-field-push.ts
// Push anonymized vectors to collective field index
// Usage: npx tsx scripts/akashic-field-push.ts

import "dotenv/config";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import crypto from "crypto";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const FIELD_URL = process.env.AKASHIC_FIELD_URL!;
const NODE_ID = process.env.AKASHIC_NODE_ID!;
const LOOKBACK_HOURS = Number(process.env.AKASHIC_FIELD_PUSH_LOOKBACK || 1);
const BATCH_LIMIT = Number(process.env.AKASHIC_FIELD_PUSH_LIMIT || 50);

function hashText(t: string) {
  return crypto.createHash("sha256").update(t).digest("hex");
}

(async () => {
  if (!FIELD_URL || !NODE_ID) {
    console.error("Missing AKASHIC_FIELD_URL or AKASHIC_NODE_ID");
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const sinceISO = new Date(Date.now() - LOOKBACK_HOURS * 3600_000).toISOString();

  console.log(`[Field Push] Fetching insights since ${sinceISO}...`);

  // Fetch recent insights
  const { data, error } = await supabase
    .from("insight_history")
    .select("id, content, element, archetype, created_at")
    .gte("created_at", sinceISO)
    .order("created_at", { ascending: true })
    .limit(BATCH_LIMIT);

  if (error) {
    console.error("[Field Push] Error fetching insights:", error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("[Field Push] No new insights to push");
    process.exit(0);
  }

  console.log(`[Field Push] Found ${data.length} insights to push`);

  let pushed = 0;
  let failed = 0;

  for (const r of data) {
    try {
      // Generate embedding (anonymized - only vector, no content)
      const emb = await openai.embeddings.create({
        model: "text-embedding-3-large",
        input: r.content.slice(0, 8000),
      });
      const vector = emb.data[0].embedding;
      const hash = hashText(r.content);

      // Push to field service
      const res = await fetch(`${FIELD_URL}/api/field/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node_id: NODE_ID,
          element: r.element,
          archetype: r.archetype,
          embedding: vector,
          hash,
        }),
      });

      if (res.ok) {
        pushed++;
        console.log(`[Field Push] ✓ Pushed ${r.element || "Unknown"}/${r.archetype || "Unknown"} (${hash.slice(0, 8)}...)`);
      } else {
        failed++;
        const errorText = await res.text();
        console.error(`[Field Push] ✗ Failed to push: ${errorText}`);
      }
    } catch (e) {
      failed++;
      console.error(`[Field Push] ✗ Error processing insight ${r.id}:`, String(e));
    }
  }

  console.log(`\n[Field Push] Complete: ${pushed} pushed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
