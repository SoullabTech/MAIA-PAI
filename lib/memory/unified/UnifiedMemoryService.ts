/**
 * Unified Memory Service
 *
 * Water Phase - Memory Unification
 * Single facade coordinating three specialized memory sub-services:
 * - ConversationMemory: maia_messages table (chat history, breakthroughs)
 * - ArchetypalMemory: ain_memory table (AIN payload, symbolic threading)
 * - SemanticMemory: pattern learning and collective wisdom
 *
 * This replaces MemoryPersistenceService + SemanticMemoryService
 * Following Earth Phase pattern: pure orchestration, clear boundaries
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AINMemoryPayload } from '@/lib/memory/AINMemoryPayload';

import { getSharedSupabase } from '@/lib/db/sharedSupabaseClient';
import { ConversationMemory } from './modules/ConversationMemory';
import { ArchetypalMemory, type ExchangeData } from './modules/ArchetypalMemory';
import { SemanticMemory, type PatternObservation, type LearnedPattern } from './modules/SemanticMemory';

// ================================================================
// UNIFIED MEMORY SERVICE
// ================================================================

export class UnifiedMemoryService {
  private supabase: SupabaseClient;
  private conversation: ConversationMemory;
  private archetypal: ArchetypalMemory;
  private semantic: SemanticMemory;

  constructor(deps?: { now?: () => number }) {
    // Single shared Supabase client (singleton)
    this.supabase = getSharedSupabase();

    // Initialize three specialized sub-services
    this.conversation = new ConversationMemory(this.supabase, deps);
    this.archetypal = new ArchetypalMemory(this.supabase, deps);
    this.semantic = new SemanticMemory(this.supabase, deps);

    console.log('✅ UnifiedMemoryService initialized (Water Phase)');
  }

  // ================================================================
  // CONVERSATION MEMORY (maia_messages table)
  // ================================================================

  /**
   * Retrieve recent conversation history
   */
  async getConversationHistory(userId: string, limit: number = 10): Promise<any[]> {
    return this.conversation.getConversationHistory(userId, limit);
  }

  /**
   * Find breakthrough moments for explicit callbacks
   */
  async getBreakthroughMoments(userId: string, limit: number = 5): Promise<any[]> {
    return this.conversation.getBreakthroughMoments(userId, limit);
  }

  // ================================================================
  // ARCHETYPAL MEMORY (ain_memory table - AIN payload)
  // ================================================================

  /**
   * Load user's AIN Memory (Archetypal Intelligence Network)
   */
  async loadUserMemory(userId: string): Promise<AINMemoryPayload> {
    return this.archetypal.loadUserMemory(userId);
  }

  /**
   * Save user's AIN Memory
   */
  async saveUserMemory(userId: string, memory: AINMemoryPayload): Promise<void> {
    return this.archetypal.saveUserMemory(userId, memory);
  }

  /**
   * Ensure AIN Memory is loaded (lazy load with caching)
   */
  async ensureMemoryLoaded(userId: string, cache?: AINMemoryPayload | null): Promise<AINMemoryPayload> {
    return this.archetypal.ensureMemoryLoaded(userId, cache);
  }

  /**
   * Update AIN Memory after an exchange
   */
  async updateMemoryAfterExchange(
    userId: string,
    memory: AINMemoryPayload,
    exchange: ExchangeData
  ): Promise<AINMemoryPayload> {
    return this.archetypal.updateAfterExchange(userId, memory, exchange);
  }

  // ================================================================
  // SEMANTIC MEMORY (pattern learning & collective wisdom)
  // ================================================================

  /**
   * Get learned patterns for a user
   */
  async getUserPatterns(userId: string): Promise<LearnedPattern[]> {
    return this.semantic.getUserPatterns(userId);
  }

  /**
   * Get user's elemental affinities
   */
  async getElementalAffinity(userId: string): Promise<Record<string, number>> {
    return this.semantic.getElementalAffinity(userId);
  }

  /**
   * Record an interaction for pattern learning
   */
  async recordInteraction(observation: PatternObservation): Promise<void> {
    return this.semantic.recordInteraction(observation);
  }
}

// ================================================================
// RE-EXPORTS (for convenience)
// ================================================================

export type { ExchangeData, PatternObservation, LearnedPattern };
