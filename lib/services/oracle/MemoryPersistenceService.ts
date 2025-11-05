/**
 * Memory Persistence Service
 *
 * Handles all memory operations for PersonalOracleAgent:
 * - AIN Memory (Archetypal Intelligence Network - symbolic threading)
 * - Conversation History (maia_messages table)
 * - Breakthrough Moments (significant transformations)
 *
 * Earth Phase Service Extraction - Following Spiralogic Principles
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { AINMemoryPayload } from '@/lib/memory/AINMemoryPayload';
import { createEmptyMemoryPayload, updateMemoryAfterExchange } from '@/lib/memory/AINMemoryPayload';

// Default memory configuration
const MEMORY_CONFIG = {
  recentExchanges: 10,        // Default context window
  breakthroughLookback: 30,   // Search deeper for significant moments
  patternWindow: 50           // For long-term pattern recognition
};

/**
 * Exchange data for memory updates
 */
export interface ExchangeData {
  newArchetype: string;
  newPhase: string;
  userInput: string;
  maiaResponse: string;
  symbolicMotifs: string[];
  emotionalTone: string;
}

/**
 * Service for persisting and retrieving user memory
 */
export class MemoryPersistenceService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Load user's AIN Memory from Supabase
   */
  async loadUserMemory(userId: string): Promise<AINMemoryPayload> {
    try {
      const { data, error } = await this.supabase
        .from('ain_memory')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // Check if table doesn't exist or other error
        if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('⚠️ ain_memory table does not exist yet. Using in-memory state.');
        } else {
          console.warn('⚠️ Could not load AIN memory:', error.message);
        }
        // Return new memory without saving (non-blocking)
        return createEmptyMemoryPayload(userId, 'User');
      }

      if (!data) {
        // No existing memory - create new (but don't save yet to avoid errors)
        console.log('🆕 Creating new AIN memory for user:', userId.substring(0, 8) + '...');
        return createEmptyMemoryPayload(userId, 'User');
      }

      // Parse stored memory (stored as JSONB)
      console.log('✅ Loaded existing AIN memory for user:', userId.substring(0, 8) + '...');
      return data.memory_data as AINMemoryPayload;
    } catch (err: any) {
      console.error('❌ Error loading AIN memory:', err?.message || err);
      return createEmptyMemoryPayload(userId, 'User');
    }
  }

  /**
   * Save user's AIN Memory to Supabase
   */
  async saveUserMemory(userId: string, memory: AINMemoryPayload): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('ain_memory')
        .upsert({
          user_id: userId,
          memory_data: memory,
          updated_at: new Date().toISOString()
        });

      if (error) {
        // Check if table doesn't exist - gracefully degrade
        if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.warn('⚠️ ain_memory table does not exist yet. Memory will not persist.');
        } else {
          console.error('❌ Error saving AIN memory:', error.message);
        }
      } else {
        console.log('✅ AIN memory saved successfully');
      }
    } catch (err: any) {
      console.error('❌ Error saving AIN memory:', err?.message || err);
    }
  }

  /**
   * Ensure AIN Memory is loaded (lazy load with caching)
   */
  async ensureMemoryLoaded(userId: string, cache?: AINMemoryPayload | null): Promise<AINMemoryPayload> {
    if (!cache) {
      return await this.loadUserMemory(userId);
    }
    return cache;
  }

  /**
   * Retrieve conversation history from maia_messages table
   * This gives MAIA memory continuity across sessions
   */
  async getConversationHistory(userId: string, limit: number = MEMORY_CONFIG.recentExchanges): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('maia_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit * 2); // x2 because we have user + maia messages

      if (error) {
        console.warn('⚠️ Could not retrieve conversation history:', error.message);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('❌ Error retrieving conversation history:', err);
      return [];
    }
  }

  /**
   * Find breakthrough moments for explicit callbacks
   */
  async getBreakthroughMoments(userId: string, limit: number = 5): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('maia_messages')
        .select('*')
        .eq('user_id', userId)
        .eq('is_breakthrough', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return [];
      return data || [];
    } catch (err) {
      console.error('❌ Error retrieving breakthroughs:', err);
      return [];
    }
  }

  /**
   * Update AIN Memory after an exchange
   */
  async updateMemoryAfterExchange(
    userId: string,
    memory: AINMemoryPayload,
    exchange: ExchangeData
  ): Promise<AINMemoryPayload> {
    const updatedMemory = updateMemoryAfterExchange(memory, exchange);
    await this.saveUserMemory(userId, updatedMemory);
    return updatedMemory;
  }
}

/**
 * Create service instance with environment-configured Supabase
 */
export function createMemoryPersistenceService(): MemoryPersistenceService {
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseKey
  );

  return new MemoryPersistenceService(supabase);
}
