#!/usr/bin/env tsx
// scripts/backfill-field-embeddings.ts
// 🜃 Backfill Akashic Field with existing MAIA conversations
// This script embeds all existing insights from insight_history into field_vectors

import { createClient } from "@supabase/supabase-js";
import { embedToField } from "../lib/services/fieldEmbeddingService";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials");
  console.error("   NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓" : "✗");
  console.error("   SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "✓" : "✗");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Insight {
  id: string;
  content: string;
  element: string;
  source: string;
  role: string;
  created_at: string;
  metadata?: {
    archetype?: string;
    session_id?: string;
    [key: string]: any;
  };
}

async function backfillFieldEmbeddings() {
  console.log("🜃 Starting Field Embeddings Backfill");
  console.log("=====================================\n");

  try {
    // 1. Fetch all MAIA insights from insight_history
    console.log("📖 Fetching existing MAIA insights...");
    const { data: insights, error } = await supabase
      .from("insight_history")
      .select("id, content, element, source, role, created_at, metadata")
      .eq("source", "MAIA")
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch insights: ${error.message}`);
    }

    if (!insights || insights.length === 0) {
      console.log("✨ No MAIA insights found to backfill");
      return;
    }

    console.log(`✓ Found ${insights.length} MAIA insights\n`);

    // 2. Check how many are already embedded
    const { count: existingCount } = await supabase
      .from("field_vectors")
      .select("*", { count: "exact", head: true })
      .eq("metadata->>source", "MAIA");

    console.log(`📊 Current field status:`);
    console.log(`   Total MAIA insights: ${insights.length}`);
    console.log(`   Already embedded: ${existingCount || 0}`);
    console.log(`   To embed: ${insights.length - (existingCount || 0)}\n`);

    // 3. Embed each insight to the field
    let embedded = 0;
    let skipped = 0;
    let failed = 0;

    console.log("🔄 Beginning embedding process...\n");

    for (let i = 0; i < insights.length; i++) {
      const insight = insights[i] as Insight;
      const progress = `[${i + 1}/${insights.length}]`;

      // Extract archetype from metadata, default to "Unknown"
      const archetype = insight.metadata?.archetype || "Unknown";
      const sessionId = insight.metadata?.session_id;

      process.stdout.write(
        `${progress} Embedding ${insight.element} • ${archetype} (${insight.role})... `
      );

      try {
        const result = await embedToField(
          insight.content,
          insight.element,
          archetype,
          {
            source: "MAIA",
            role: insight.role,
            session_id: sessionId,
            backfilled: true,
            original_created_at: insight.created_at,
          },
          supabase // Pass server-side Supabase client
        );

        if (result.success) {
          if (result.error === "Already embedded") {
            console.log("⊙ (skipped - already in field)");
            skipped++;
          } else {
            console.log("✓");
            embedded++;
          }
        } else {
          console.log(`✗ (${result.error})`);
          failed++;
        }

        // Rate limiting: Wait 100ms between embeddings to avoid OpenAI rate limits
        if (i < insights.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (err: any) {
        console.log(`✗ (${err.message})`);
        failed++;
      }
    }

    // 4. Summary
    console.log("\n=====================================");
    console.log("✨ Backfill Complete!");
    console.log(`   Successfully embedded: ${embedded}`);
    console.log(`   Skipped (duplicates): ${skipped}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total processed: ${insights.length}`);

    // 5. Verify final count
    const { count: finalCount } = await supabase
      .from("field_vectors")
      .select("*", { count: "exact", head: true })
      .eq("metadata->>source", "MAIA");

    console.log(`\n📊 Field now contains ${finalCount || 0} MAIA embeddings`);
  } catch (error: any) {
    console.error("\n❌ Backfill failed:", error.message);
    process.exit(1);
  }
}

// Run backfill
backfillFieldEmbeddings()
  .then(() => {
    console.log("\n🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error);
    process.exit(1);
  });
