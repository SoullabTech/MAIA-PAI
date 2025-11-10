/**
 * EmbeddingService
 *
 * Generates vector embeddings for episodes using OpenAI
 * Enables semantic similarity search for recognition
 *
 * Architecture:
 * - Generate embeddings from episode text + stanza
 * - Store in episode_vectors table (pgvector)
 * - Use for fast approximate nearest neighbor search
 * - Calculate LSH/SimHash for even faster matching
 */

import OpenAI from 'openai';
import { createClientComponentClient } from '@/lib/supabase';
import type { Episode } from './types';

export interface GenerateEmbeddingInput {
  text: string;
  stanza?: string;
  placeCue?: string;
  senseCues?: string[];
}

export interface EmbeddingResult {
  embedding: number[];
  similarityHash?: string;
}

export class EmbeddingService {
  private openai: OpenAI;
  private supabase = createClientComponentClient();

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY || ''
    });
  }

  /**
   * Generate embedding for episode
   *
   * Combines multiple sources:
   * - Stanza (compressed essence)
   * - Place cue (location context)
   * - Sense cues (sensory triggers)
   * - Optional full text
   *
   * This creates a rich semantic representation
   */
  async generate(input: GenerateEmbeddingInput): Promise<EmbeddingResult> {
    try {
      // Construct embedding text from available components
      const parts: string[] = [];

      if (input.stanza) {
        parts.push(`Scene: ${input.stanza}`);
      }

      if (input.placeCue) {
        parts.push(`Place: ${input.placeCue}`);
      }

      if (input.senseCues && input.senseCues.length > 0) {
        parts.push(`Senses: ${input.senseCues.join(', ')}`);
      }

      if (input.text) {
        // Use first 500 chars of text for context
        parts.push(input.text.substring(0, 500));
      }

      const embeddingText = parts.join('\n');

      // Generate embedding using OpenAI
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small', // 1536 dimensions, fast & affordable
        input: embeddingText
      });

      const embedding = response.data[0].embedding;

      // Calculate similarity hash (LSH) for fast approximate matching
      const similarityHash = this.calculateSimHash(embedding);

      return {
        embedding,
        similarityHash
      };
    } catch (error) {
      console.error('[EmbeddingService] Error generating embedding:', error);
      throw error;
    }
  }

  /**
   * Store embedding for episode
   *
   * Inserts into episode_vectors table with pgvector support
   */
  async store(episodeId: string, result: EmbeddingResult): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('episode_vectors')
        .insert({
          episode_id: episodeId,
          embedding: result.embedding,
          similarity_hash: result.similarityHash,
          decay_rate: 0.0 // Future: implement memory decay
        });

      if (error) {
        console.error('[EmbeddingService] Error storing embedding:', error);
        return false;
      }

      console.log(`[EmbeddingService] Stored embedding for episode ${episodeId}`);
      return true;
    } catch (error) {
      console.error('[EmbeddingService] Error:', error);
      return false;
    }
  }

  /**
   * Generate and store embedding for episode
   *
   * Convenience method combining generate + store
   */
  async embedEpisode(episodeId: string, input: GenerateEmbeddingInput): Promise<boolean> {
    try {
      const result = await this.generate(input);
      return await this.store(episodeId, result);
    } catch (error) {
      console.error('[EmbeddingService] Error embedding episode:', error);
      return false;
    }
  }

  /**
   * Find similar episodes using vector search
   *
   * Uses pgvector cosine similarity
   * Returns episode IDs sorted by similarity
   */
  async findSimilar(
    embedding: number[],
    limit: number = 10,
    minSimilarity: number = 0.7
  ): Promise<Array<{ episodeId: string; similarity: number }>> {
    try {
      // Use pgvector's cosine similarity operator (<=>)
      // Note: This requires proper pgvector setup and RPC function
      const { data, error } = await this.supabase.rpc('match_episodes', {
        query_embedding: embedding,
        match_threshold: 1 - minSimilarity, // Convert to distance
        match_count: limit
      });

      if (error) {
        console.error('[EmbeddingService] Error finding similar:', error);
        return [];
      }

      return data.map((row: any) => ({
        episodeId: row.episode_id,
        similarity: 1 - row.distance // Convert distance back to similarity
      }));
    } catch (error) {
      console.error('[EmbeddingService] Error:', error);
      return [];
    }
  }

  /**
   * Calculate SimHash for fast approximate matching
   *
   * SimHash produces a fixed-length hash where similar vectors
   * have similar hashes (measured by Hamming distance)
   *
   * This enables very fast pre-filtering before cosine similarity
   */
  private calculateSimHash(embedding: number[]): string {
    const hashLength = 64; // 64-bit hash
    const bits: number[] = new Array(hashLength).fill(0);

    // For each dimension, contribute to hash bits
    for (let i = 0; i < embedding.length; i++) {
      const value = embedding[i];

      // Use simple hash function: dimension index mod hash length
      const bitIndex = i % hashLength;

      // Contribute to that bit based on value
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

  /**
   * Calculate Hamming distance between two SimHashes
   *
   * Lower distance = more similar
   */
  private hammingDistance(hash1: string, hash2: string): number {
    let distance = 0;
    const bin1 = parseInt(hash1, 16).toString(2).padStart(64, '0');
    const bin2 = parseInt(hash2, 16).toString(2).padStart(64, '0');

    for (let i = 0; i < bin1.length; i++) {
      if (bin1[i] !== bin2[i]) {
        distance++;
      }
    }

    return distance;
  }
}

/**
 * Create singleton instance
 */
let embeddingService: EmbeddingService | null = null;

export function getEmbeddingService(): EmbeddingService {
  if (!embeddingService) {
    embeddingService = new EmbeddingService();
  }
  return embeddingService;
}
