// field-service/app/api/field/ingest/route.ts
// 🜃 Field Aggregator — Ingest endpoint
// Receives anonymized vectors from nodes and stores in collective field

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/**
 * POST /api/field/ingest
 * Ingest anonymized vectors into the collective field
 *
 * Body:
 *   - node_id: string (origin node identifier)
 *   - element: string (elemental classification)
 *   - archetype?: string (archetypal classification)
 *   - embedding: number[] (vector embedding - NO CONTENT)
 *   - hash?: string (content hash for deduplication)
 *   - metadata?: object (statistical metadata only)
 *
 * Privacy: NO content is ever transmitted or stored, only vectors + tags
 */
export async function POST(req: NextRequest) {
  try {
    // Validate node credentials
    const nodeId = req.headers.get("X-Node-ID");
    const authHeader = req.headers.get("Authorization");

    if (!nodeId) {
      return NextResponse.json(
        { error: "Missing node ID" },
        { status: 401 }
      );
    }

    // Verify field key
    const fieldKey = process.env.AKASHIC_FIELD_KEY;
    if (fieldKey && authHeader && !authHeader.includes(fieldKey)) {
      return NextResponse.json(
        { error: "Invalid field key" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { node_id, element, archetype, embedding, hash, metadata } = body;

    // Validate required fields
    if (!node_id || !element || !embedding) {
      return NextResponse.json(
        { error: "Missing required fields (node_id, element, embedding)" },
        { status: 400 }
      );
    }

    // Validate embedding is a valid vector
    if (!Array.isArray(embedding) || embedding.length !== 1536) {
      return NextResponse.json(
        { error: "Invalid embedding: must be array of 1536 numbers" },
        { status: 400 }
      );
    }

    // Validate element
    const validElements = ["Fire", "Water", "Earth", "Air", "Aether", "Unknown"];
    if (!validElements.includes(element)) {
      return NextResponse.json(
        { error: `Invalid element. Must be one of: ${validElements.join(", ")}` },
        { status: 400 }
      );
    }

    // Generate content hash if not provided
    const contentHash = hash || crypto
      .createHash("sha256")
      .update(`${node_id}-${element}-${Date.now()}`)
      .digest("hex");

    // Connect to field database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insert or update vector (upsert prevents duplicates)
    const { data, error } = await supabase
      .from("field_vectors")
      .upsert({
        id: contentHash, // Use hash as ID for deduplication
        node_id,
        element,
        archetype: archetype || null,
        embedding,
        content_hash: contentHash,
        created_at: new Date().toISOString(),
        metadata: {
          ...metadata,
          ingested_at: new Date().toISOString(),
          origin_node: nodeId // From header, for verification
        }
      }, {
        onConflict: "content_hash",
        ignoreDuplicates: true
      })
      .select();

    if (error) {
      console.error("Field vector ingest error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Log successful ingest (optional)
    if (process.env.LOG_FIELD_INGESTS === "true") {
      console.log({
        timestamp: new Date().toISOString(),
        node_id,
        element,
        archetype,
        hash: contentHash.slice(0, 8),
        isNew: data && data.length > 0
      });
    }

    return NextResponse.json({
      success: true,
      hash: contentHash,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Field ingest error:", error);
    return NextResponse.json(
      { error: error?.message ?? "ingest error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/field/ingest
 * Get field ingestion statistics
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get basic stats
    const { count, error: countError } = await supabase
      .from("field_vectors")
      .select("*", { count: "exact", head: true });

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Get activity views
    const { data: recentActivity } = await supabase
      .from("field_activity_recent")
      .select("*");

    const { data: elementalDist } = await supabase
      .from("field_elemental_distribution")
      .select("*");

    return NextResponse.json({
      totalVectors: count,
      recentActivity: recentActivity || [],
      elementalDistribution: elementalDist || [],
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "stats error" },
      { status: 500 }
    );
  }
}
