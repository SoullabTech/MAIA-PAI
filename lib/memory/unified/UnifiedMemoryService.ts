/**
 * Unified Memory Service
 * Fire Phase - Strong typing with backwards compatibility
 */

import { ConversationMemory } from "./modules/ConversationMemory";
import { ArchetypalMemory } from "./modules/ArchetypalMemory";
import { SemanticMemory } from "./modules/SemanticMemory";
import type { AINMemoryPayload, ConversationMessage, PatternObservation } from "./types";

// Legacy types for backwards compatibility (to be removed after coordinator update)
import type { AINMemoryPayload as LegacyAINPayload } from "@/lib/memory/AINMemoryPayload";

export class UnifiedMemoryService {
  constructor(
    private readonly conv = new ConversationMemory(),
    private readonly arch = new ArchetypalMemory(),
    private readonly sem = new SemanticMemory()
  ) {
    console.log("✅ UnifiedMemoryService initialized (Fire Phase - typed)");
  }

  // ================================================================
  // CONVERSATION MEMORY (maia_messages table)
  // ================================================================

  getConversationHistory(userId: string, limit?: number): Promise<ConversationMessage[]> {
    return this.conv.getConversationHistory(userId, limit);
  }

  getBreakthroughMoments(userId: string, limit?: number): Promise<ConversationMessage[]> {
    return this.conv.getBreakthroughMoments(userId, limit);
  }

  // ================================================================
  // ARCHETYPAL MEMORY (ain_memory table - AIN payload)
  // ================================================================

  async loadAINMemory(userId: string): Promise<AINMemoryPayload | null> {
    return this.arch.loadUserMemory(userId);
  }

  async saveAINMemory(payload: AINMemoryPayload): Promise<boolean> {
    return this.arch.saveUserMemory(payload);
  }

  async updateAfterExchange(userId: string, threadSummary: string): Promise<boolean> {
    return this.arch.updateAfterExchange(userId, threadSummary);
  }

  // Legacy compatibility (to be removed after coordinator update)
  async ensureMemoryLoaded(userId: string, cache?: any): Promise<any> {
    if (cache) return cache;
    const memory = await this.loadAINMemory(userId);
    // Return legacy format for now
    return memory ?? { userId, lastUpdated: new Date().toISOString(), threads: [] };
  }

  // ================================================================
  // SEMANTIC MEMORY (pattern learning & collective wisdom)
  // ================================================================

  getUserPatterns(userId: string): Promise<PatternObservation[]> {
    return this.sem.getUserPatterns(userId);
  }

  getElementalAffinity(userId: string): Promise<Record<string, number> | null> {
    return this.sem.getElementalAffinity(userId);
  }

  recordInteraction(obs: PatternObservation): Promise<boolean> {
    return this.sem.recordInteraction(obs);
  }
}

// Re-exports
export type { AINMemoryPayload, ConversationMessage, PatternObservation };
