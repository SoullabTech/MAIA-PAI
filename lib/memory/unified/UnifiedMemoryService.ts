/**
 * Unified Memory Service
 * Air Phase - Performance telemetry
 */

import { ConversationMemory } from "./modules/ConversationMemory";
import { ArchetypalMemory } from "./modules/ArchetypalMemory";
import { SemanticMemory } from "./modules/SemanticMemory";
import type { AINMemoryPayload, ConversationMessage, PatternObservation } from "./types";
import { timeIt } from "@/lib/observability/timer";
import { recordMemoryTiming } from "@/lib/observability/memMetrics";

// Legacy types for backwards compatibility (to be removed after coordinator update)
import type { AINMemoryPayload as LegacyAINPayload } from "@/lib/memory/AINMemoryPayload";

export class UnifiedMemoryService {
  constructor(
    private readonly conv = new ConversationMemory(),
    private readonly arch = new ArchetypalMemory(),
    private readonly sem = new SemanticMemory()
  ) {
    console.log("✅ UnifiedMemoryService initialized (Air Phase - telemetry)");
  }

  // ================================================================
  // CONVERSATION MEMORY (maia_messages table)
  // ================================================================

  getConversationHistory(userId: string, limit?: number): Promise<ConversationMessage[]> {
    return timeIt("conv.history", () => this.conv.getConversationHistory(userId, limit))
      .then(({ ms, value }) => { recordMemoryTiming("conv.history", ms, true); return value; })
      .catch(e => { recordMemoryTiming("conv.history", 0, false); return []; });
  }

  getBreakthroughMoments(userId: string, limit?: number): Promise<ConversationMessage[]> {
    return timeIt("conv.breakthroughs", () => this.conv.getBreakthroughMoments(userId, limit))
      .then(({ ms, value }) => { recordMemoryTiming("conv.breakthroughs", ms, true); return value; })
      .catch(e => { recordMemoryTiming("conv.breakthroughs", 0, false); return []; });
  }

  // ================================================================
  // ARCHETYPAL MEMORY (ain_memory table - AIN payload)
  // ================================================================

  async loadAINMemory(userId: string): Promise<AINMemoryPayload | null> {
    return timeIt("arch.loadAIN", () => this.arch.loadUserMemory(userId))
      .then(({ ms, value }) => { recordMemoryTiming("arch.loadAIN", ms, true); return value; })
      .catch(e => { recordMemoryTiming("arch.loadAIN", 0, false); return null; });
  }

  async saveAINMemory(payload: AINMemoryPayload): Promise<boolean> {
    return timeIt("arch.saveAIN", () => this.arch.saveUserMemory(payload))
      .then(({ ms, value }) => { recordMemoryTiming("arch.saveAIN", ms, true); return value; })
      .catch(e => { recordMemoryTiming("arch.saveAIN", 0, false); return false; });
  }

  async updateAfterExchange(userId: string, threadSummary: string): Promise<boolean> {
    return timeIt("arch.updateAfterExchange", () => this.arch.updateAfterExchange(userId, threadSummary))
      .then(({ ms, value }) => { recordMemoryTiming("arch.updateAfterExchange", ms, true); return value; })
      .catch(e => { recordMemoryTiming("arch.updateAfterExchange", 0, false); return false; });
  }

  // Legacy compatibility (to be removed after coordinator update)
  async ensureMemoryLoaded(userId: string, cache?: any): Promise<any> {
    if (cache) return cache;
    return timeIt("arch.ensureMemoryLoaded", async () => {
      const memory = await this.loadAINMemory(userId);
      return memory ?? { userId, lastUpdated: new Date().toISOString(), threads: [] };
    })
      .then(({ ms, value }) => { recordMemoryTiming("arch.ensureMemoryLoaded", ms, true); return value; })
      .catch(e => { recordMemoryTiming("arch.ensureMemoryLoaded", 0, false); return { userId, lastUpdated: new Date().toISOString(), threads: [] }; });
  }

  // ================================================================
  // SEMANTIC MEMORY (pattern learning & collective wisdom)
  // ================================================================

  getUserPatterns(userId: string): Promise<PatternObservation[]> {
    return timeIt("sem.patterns", () => this.sem.getUserPatterns(userId))
      .then(({ ms, value }) => { recordMemoryTiming("sem.patterns", ms, true); return value; })
      .catch(e => { recordMemoryTiming("sem.patterns", 0, false); return []; });
  }

  getElementalAffinity(userId: string): Promise<Record<string, number> | null> {
    return timeIt("sem.affinity", () => this.sem.getElementalAffinity(userId))
      .then(({ ms, value }) => { recordMemoryTiming("sem.affinity", ms, true); return value; })
      .catch(e => { recordMemoryTiming("sem.affinity", 0, false); return null; });
  }

  recordInteraction(obs: PatternObservation): Promise<boolean> {
    return timeIt("sem.record", () => this.sem.recordInteraction(obs))
      .then(({ ms, value }) => { recordMemoryTiming("sem.record", ms, true); return value; })
      .catch(e => { recordMemoryTiming("sem.record", 0, false); return false; });
  }
}

// Re-exports
export type { AINMemoryPayload, ConversationMessage, PatternObservation };
