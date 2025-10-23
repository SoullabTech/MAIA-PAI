/**
 * Field Service Query Client
 *
 * Connects local MAIA to the distributed Akashic Field
 * Generates embeddings and queries field.soullab.life for resonance
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface FieldQueryOptions {
  queryText: string;
  elementHint?: string;
  archetypeHint?: string;
  limit?: number;
}

export interface FieldResonanceResult {
  resonance: {
    FRI: number;
    interpretation: 'background_echo' | 'thematic_resonance' | 'archetypal_activation' | 'collective_synchrony';
    components: {
      similarity: number;
      temporal: number;
      trust: number;
      elemental: number;
      archetypal: number;
    };
  };
  patterns: Array<{
    element: string;
    archetype: string;
    count: number;
    avgSimilarity: number;
    avgResonance: number;
    nodeCount: number;
  }>;
  metadata: {
    queriedVectors: number;
    topK: number;
    fieldHealth: number;
    timestamp: string;
  };
}

/**
 * Generate embedding for query text using OpenAI
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });

  return response.data[0].embedding;
}

/**
 * Query the field service for resonance patterns
 */
export async function queryFieldService(
  options: FieldQueryOptions
): Promise<FieldResonanceResult | null> {
  try {
    const fieldUrl = process.env.NEXT_PUBLIC_AKASHIC_FIELD_URL || process.env.AKASHIC_FIELD_URL;

    // If no field URL configured, return null (local-only mode)
    if (!fieldUrl) {
      console.log('Field service not configured - running in local-only mode');
      return null;
    }

    // Generate embedding from query text
    const embedding = await generateEmbedding(options.queryText);

    // Query the field service
    const response = await fetch(`${fieldUrl}/api/field/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Node-ID': process.env.AKASHIC_NODE_ID || 'local-maia-node',
        'Authorization': `Bearer ${process.env.AKASHIC_FIELD_KEY || ''}`,
      },
      body: JSON.stringify({
        qvec: embedding,
        elementHint: options.elementHint,
        archetypeHint: options.archetypeHint,
        limit: options.limit || 10,
        queryText: options.queryText,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Field query failed:', error);
      return null;
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error querying field service:', error);
    return null;
  }
}

/**
 * Client-side field query (for use in React components)
 * Routes through /api/akashic/field proxy to handle API keys securely
 */
export async function queryFieldClient(
  options: FieldQueryOptions
): Promise<FieldResonanceResult | null> {
  try {
    const response = await fetch('/api/akashic/field', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Field query failed:', error);
      return null;
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error querying field:', error);
    return null;
  }
}
