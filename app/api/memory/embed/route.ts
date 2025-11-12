/**
 * POST /api/memory/embed
 *
 * Server-side API route for generating embeddings
 * Keeps OpenAI API key secure on server
 *
 * Air serving Fire: Embeddings enable recognition without dominating
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client server-side only
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

interface EmbedRequest {
  text: string;
  stanza?: string;
  placeCue?: string;
  senseCues?: string[];
}

interface EmbedResponse {
  embedding: number[];
  similarityHash: string;
}

/**
 * Calculate SimHash for fast approximate matching
 *
 * SimHash produces a fixed-length hash where similar vectors
 * have similar hashes (measured by Hamming distance)
 */
function calculateSimHash(embedding: number[]): string {
  const hashLength = 64; // 64-bit hash
  const bits: number[] = new Array(hashLength).fill(0);

  // For each dimension, contribute to hash bits
  for (let i = 0; i < embedding.length; i++) {
    const value = embedding[i];
    const bitIndex = i % hashLength;

    if (value > 0) {
      bits[bitIndex] += value;
    } else {
      bits[bitIndex] -= Math.abs(value);
    }
  }

  // Convert to binary hash
  const hash = bits.map(b => (b > 0 ? '1' : '0')).join('');

  // Convert to hex for storage
  const hexHash = parseInt(hash, 2).toString(16).padStart(16, '0');

  return hexHash;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: EmbedRequest = await request.json();
    const { text, stanza, placeCue, senseCues } = body;

    // Validate input
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Construct embedding text from available components
    const parts: string[] = [];

    if (stanza) {
      parts.push(`Scene: ${stanza}`);
    }

    if (placeCue) {
      parts.push(`Place: ${placeCue}`);
    }

    if (senseCues && senseCues.length > 0) {
      parts.push(`Senses: ${senseCues.join(', ')}`);
    }

    // Use first 500 chars of text for context
    parts.push(text.substring(0, 500));

    const embeddingText = parts.join('\n');

    // Generate embedding using OpenAI
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small', // 1536 dimensions, fast & affordable
      input: embeddingText
    });

    const embedding = response.data[0].embedding;

    // Calculate similarity hash (LSH) for fast approximate matching
    const similarityHash = calculateSimHash(embedding);

    const result: EmbedResponse = {
      embedding,
      similarityHash
    };

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[API /memory/embed] Error:', error);

    // Don't leak sensitive error details to client
    return NextResponse.json(
      { error: 'Failed to generate embedding' },
      { status: 500 }
    );
  }
}
