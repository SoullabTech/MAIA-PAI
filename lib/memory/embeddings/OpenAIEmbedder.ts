/**
 * OpenAI Embedding Service
 * Generates vector embeddings for semantic search
 *
 * OpenAI client removed from browser-side code for security
 * Now uses secure server-side API endpoint
 */

import type { EmbeddingService } from '../core/MemoryCore';

export class OpenAIEmbedder implements EmbeddingService {
  private model: string = 'text-embedding-3-small';
  private cache: Map<string, number[]> = new Map();

  constructor() {
    // No direct OpenAI client instantiation - uses secure server-side API
  }
  
  async embed(text: string): Promise<number[]> {
    // Check cache first
    const cacheKey = this.getCacheKey(text);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Use secure server-side embeddings API instead of direct OpenAI client
      const response = await fetch('/api/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model: this.model
        }),
      });

      if (!response.ok) {
        throw new Error(`Embeddings API error: ${response.status}`);
      }

      const data = await response.json();
      const embedding = data.embedding;

      // Cache the result
      this.cache.set(cacheKey, embedding);

      // Limit cache size
      if (this.cache.size > 1000) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Return zero vector as fallback
      return new Array(1536).fill(0);
    }
  }
  
  async embedBatch(texts: string[]): Promise<number[][]> {
    try {
      // For batch processing, call individual embeds to reuse our secure API
      // This is less efficient but maintains security
      const embeddings: number[][] = [];

      for (const text of texts) {
        const embedding = await this.embed(text);
        embeddings.push(embedding);
      }

      return embeddings;
    } catch (error) {
      console.error('Error generating batch embeddings:', error);
      // Return zero vectors as fallback
      return texts.map(() => new Array(1536).fill(0));
    }
  }
  
  private getCacheKey(text: string): string {
    // Simple hash for cache key
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `${this.model}_${hash}_${text.slice(0, 50)}`;
  }
  
  // Clear cache
  clearCache() {
    this.cache.clear();
  }
  
  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }
}