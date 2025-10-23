#!/usr/bin/env tsx

/**
 * 🜃 Akashic Field Push Script
 *
 * Periodically shares anonymized vector embeddings with the collective field.
 * Privacy-preserving: Only vectors + metadata are transmitted, NEVER content.
 *
 * Usage:
 *   npx tsx scripts/akashic-field-push.ts
 *   npx tsx scripts/akashic-field-push.ts --hours 24 --limit 100 --dry-run
 *
 * Cron example (hourly):
 *   0 * * * * cd ~/SoullabTech/MAIA-PAI && npx tsx scripts/akashic-field-push.ts >> /tmp/field-push.log 2>&1
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import crypto from "crypto";

// Configuration
const FIELD_URL = process.env.AKASHIC_FIELD_URL;
const NODE_ID = process.env.AKASHIC_NODE_ID || "default-node";
const FIELD_KEY = process.env.AKASHIC_FIELD_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Parse CLI args
const args = process.argv.slice(2);
const hoursArg = args.find(a => a.startsWith("--hours="))?.split("=")[1];
const limitArg = args.find(a => a.startsWith("--limit="))?.split("=")[1];
const dryRun = args.includes("--dry-run");
const verbose = args.includes("--verbose") || args.includes("-v");

const HOURS_WINDOW = parseInt(hoursArg || "1", 10); // Default: last hour
const LIMIT = parseInt(limitArg || "50", 10); // Default: 50 records
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface InsightRecord {
  id: string;
  content: string;
  element: string | null;
  metadata: any;
  created_at: string;
}

/**
 * Generate SHA-256 hash of content for deduplication
 */
function hashContent(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

/**
 * Infer archetype from metadata or content characteristics
 */
function inferArchetype(record: InsightRecord): string | null {
  // Check metadata first
  if (record.metadata?.archetype) {
    return record.metadata.archetype;
  }

  // Check source
  const source = record.metadata?.source;
  if (source === "ClaudeMirror") return "Mirror";
  if (source === "SanctuaryLauncher") return "Initiation";
  if (source === "JournalEntry") return "Reflection";

  // Check role
  const role = record.metadata?.role;
  if (role === "assistant") return "Guide";
  if (role === "user") return "Seeker";
  if (role === "system") return "Witness";

  return null;
}

/**
 * Push vector to field aggregator
 */
async function pushToField(
  nodeId: string,
  element: string,
  archetype: string | null,
  embedding: number[],
  hash: string,
  metadata: any
): Promise<boolean> {
  if (!FIELD_URL) {
    if (verbose) console.log("⚠️  AKASHIC_FIELD_URL not set, skipping remote push");
    return false;
  }

  try {
    const response = await fetch(`${FIELD_URL}/api/field/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Node-ID": nodeId,
        ...(FIELD_KEY && { "Authorization": `Bearer ${FIELD_KEY}` })
      },
      body: JSON.stringify({
        node_id: nodeId,
        element,
        archetype,
        embedding,
        hash,
        metadata: {
          timestamp: new Date().toISOString(),
          origin: nodeId
        }
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Field ingest failed: ${response.status} ${text}`);
    }

    return true;
  } catch (error: any) {
    console.error(`❌ Push to field failed: ${error.message}`);
    return false;
  }
}

/**
 * Store vector locally in field_vectors table
 */
async function storeLocalVector(
  supabase: any,
  nodeId: string,
  element: string,
  archetype: string | null,
  embedding: number[],
  hash: string
): Promise<boolean> {
  try {
    // Check if already exists (by content hash)
    const { data: existing } = await supabase
      .from("field_vectors")
      .select("id")
      .eq("content_hash", hash)
      .maybeSingle();

    if (existing) {
      return false; // Already exists, skip
    }

    const { error } = await supabase
      .from("field_vectors")
      .insert({
        node_id: nodeId,
        element,
        archetype,
        embedding,
        content_hash: hash,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error(`❌ Local storage failed: ${error.message}`);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error(`❌ Local storage error: ${error.message}`);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`🜃 Field Resonance Push — Node: ${NODE_ID}`);
  console.log(`   Time window: ${HOURS_WINDOW}h | Limit: ${LIMIT} | Dry run: ${dryRun}`);
  console.log("");

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing Supabase credentials");
    process.exit(1);
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OpenAI API key");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 1. Fetch recent insights
  const startTime = new Date(Date.now() - HOURS_WINDOW * 3600 * 1000).toISOString();

  if (verbose) console.log(`📖 Fetching insights since ${startTime}...`);

  const { data: insights, error } = await supabase
    .from("insight_history")
    .select("id, content, element, metadata, created_at")
    .gte("created_at", startTime)
    .order("created_at", { ascending: false })
    .limit(LIMIT);

  if (error) {
    console.error("❌ Failed to fetch insights:", error.message);
    process.exit(1);
  }

  if (!insights || insights.length === 0) {
    console.log("✓ No new insights to share");
    return;
  }

  console.log(`📊 Found ${insights.length} insights to process`);
  console.log("");

  // 2. Process each insight
  let pushed = 0;
  let skipped = 0;
  let failed = 0;

  for (const insight of insights as InsightRecord[]) {
    const hash = hashContent(insight.content);
    const element = insight.element || "Unknown";
    const archetype = inferArchetype(insight);

    if (verbose) {
      console.log(`Processing: ${insight.id.slice(0, 8)}... | ${element} | ${archetype || "—"}`);
    }

    // Check if already pushed (stored in field_vectors)
    const { count } = await supabase
      .from("field_vectors")
      .select("*", { count: "exact", head: true })
      .eq("content_hash", hash);

    if (count && count > 0) {
      if (verbose) console.log(`  ⊙ Already in field`);
      skipped++;
      continue;
    }

    // Skip if content is too short (likely not meaningful)
    if (insight.content.length < 50) {
      if (verbose) console.log(`  ⊘ Content too short`);
      skipped++;
      continue;
    }

    // Generate embedding (1536 dimensions to match table)
    try {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-large",
        dimensions: 1536,
        input: insight.content.slice(0, 8000),
      });
      const vector = embeddingResponse.data[0].embedding;

      if (dryRun) {
        console.log(`  [DRY RUN] Would push: ${hash.slice(0, 8)} (${element}/${archetype})`);
        pushed++;
        continue;
      }

      // Store locally first
      const localSuccess = await storeLocalVector(
        supabase,
        NODE_ID,
        element,
        archetype,
        vector,
        hash
      );

      if (!localSuccess) {
        failed++;
        continue;
      }

      // Then push to distributed field (if configured)
      if (FIELD_URL) {
        const remoteSuccess = await pushToField(
          NODE_ID,
          element,
          archetype,
          vector,
          hash,
          insight.metadata
        );

        if (remoteSuccess) {
          console.log(`  ✓ Pushed to field: ${hash.slice(0, 8)} (${element}/${archetype})`);
          pushed++;
        } else {
          console.log(`  ⚠ Local only: ${hash.slice(0, 8)}`);
          pushed++; // Still count as success since local storage worked
        }
      } else {
        console.log(`  ✓ Stored locally: ${hash.slice(0, 8)} (${element}/${archetype})`);
        pushed++;
      }

      // Rate limiting to avoid hitting OpenAI limits
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (error: any) {
      console.error(`  ❌ Failed to process ${insight.id.slice(0, 8)}: ${error.message}`);
      failed++;
    }
  }

  // 3. Summary
  console.log("");
  console.log("═══════════════════════════════════════");
  console.log(`✓ Pushed:  ${pushed}`);
  console.log(`⊙ Skipped: ${skipped}`);
  console.log(`❌ Failed:  ${failed}`);
  console.log("═══════════════════════════════════════");
  console.log("");

  if (dryRun) {
    console.log("🜁 Dry run complete — no actual data was transmitted");
  } else {
    console.log("🜁 Field resonance updated — patterns now visible to the lattice");
  }
}

// Execute
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
