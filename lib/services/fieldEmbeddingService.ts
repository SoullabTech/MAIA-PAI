// lib/services/fieldEmbeddingService.ts
// 🜃 Akashic Field Embedding Service
// Automatically embeds MAIA conversations into the distributed field for semantic search

import { createClient } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import crypto from "crypto";

// Lazy-load OpenAI client to prevent client-side instantiation
// This ensures the client is only created when actually used (server-side)
let _openaiClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!_openaiClient) {
    _openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }
  return _openaiClient;
}

// Node identifier for this MAIA instance
const NODE_ID = process.env.NEXT_PUBLIC_NODE_ID || "maia-primary";

/**
 * Generate SHA-256 hash for content deduplication
 * This prevents the same insight from being embedded multiple times
 */
function generateContentHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Embed and save MAIA conversation to Akashic Field
 *
 * This enables semantic search across all MAIA conversations
 * Privacy-preserving: Only embeddings are stored, not original content
 *
 * @param content - The conversation text to embed
 * @param element - Elemental classification (Fire, Water, Earth, Air, Aether)
 * @param archetype - Archetypal classification (MainOracle, InnerGuide, etc.)
 * @param metadata - Optional metadata for analytics
 * @param supabaseClient - Optional Supabase client (for server-side scripts)
 */
export async function embedToField(
  content: string,
  element: string,
  archetype: string,
  metadata?: Record<string, any>,
  supabaseClient?: SupabaseClient
): Promise<{ success: boolean; error?: string }> {
  try {
    // Don't embed empty content
    if (!content || content.trim().length < 10) {
      console.debug("[embedToField] Content too short, skipping");
      return { success: false, error: "Content too short" };
    }

    // Generate content hash for deduplication
    const contentHash = generateContentHash(content);

    // Check if this content is already in the field
    const supabase = supabaseClient || createClient();
    const { data: existing } = await supabase
      .from("field_vectors")
      .select("id")
      .eq("content_hash", contentHash)
      .single();

    if (existing) {
      console.debug("[embedToField] Content already in field, skipping");
      return { success: true, error: "Already embedded" };
    }

    // Generate embedding using OpenAI ada-002 (1536 dimensions)
    const openai = getOpenAIClient();
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: content.slice(0, 8000), // Max 8000 chars for ada-002
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Save to field_vectors
    const { error } = await supabase.from("field_vectors").insert({
      node_id: NODE_ID,
      element,
      archetype,
      embedding,
      content_hash: contentHash,
      metadata: {
        ...metadata,
        embedded_at: new Date().toISOString(),
        content_length: content.length,
      },
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[embedToField] Failed to save to field:", error);
      return { success: false, error: error.message };
    }

    console.log(`✨ Field embedding saved: ${element} • ${archetype}`);
    return { success: true };
  } catch (error: any) {
    console.error("[embedToField] Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Embed MAIA conversation exchange (both user and assistant)
 * Convenience wrapper for dual embedding
 */
export async function embedConversationToField(
  userMessage: string,
  maiaResponse: string,
  userElement: string,
  userArchetype: string,
  maiaElement: string,
  maiaArchetype: string,
  metadata?: Record<string, any>
): Promise<void> {
  // Embed both messages in parallel (non-blocking)
  await Promise.all([
    embedToField(userMessage, userElement, userArchetype, {
      ...metadata,
      role: "user",
    }),
    embedToField(maiaResponse, maiaElement, maiaArchetype, {
      ...metadata,
      role: "assistant",
    }),
  ]);
}
