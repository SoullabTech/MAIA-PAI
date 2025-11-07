/**
 * Archetypal Memory Sub-Service
 *
 * Water Phase - Memory Unification
 * Handles AIN Memory (Archetypal Intelligence Network) from ain_memory table
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AINMemoryPayload } from '@/lib/memory/AINMemoryPayload';
import { createEmptyMemoryPayload, updateMemoryAfterExchange as updateAINPayload } from '@/lib/memory/AINMemoryPayload';

/**
 * Exchange data for memory updates
 */
export interface ExchangeData {
  userMessage: string;
  mayaResponse: string;
  element: string;
  phase: string;
  motifs: string[];
  themes: string[];
  emotionalTone: string;
  safetyAction?: string;
}

export class ArchetypalMemory {
  constructor(
    private supabase: SupabaseClient,
    private deps?: { now?: () => number }
  ) {}

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
        } else if (error.code !== 'PGRST116') { // not found is OK
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
   * Update AIN Memory after an exchange
   */
  async updateAfterExchange(
    userId: string,
    memory: AINMemoryPayload,
    exchange: ExchangeData
  ): Promise<AINMemoryPayload> {
    // Map ExchangeData to the format expected by updateAINPayload
    const exchangeForUpdate = {
      newArchetype: memory.currentArchetype, // Keep current if not specified
      newPhase: exchange.phase,
      userInput: exchange.userMessage,
      maiaResponse: exchange.mayaResponse,
      symbolicMotifs: exchange.motifs,
      emotionalTone: exchange.emotionalTone,
    };

    const updatedMemory = updateAINPayload(memory, exchangeForUpdate);
    await this.saveUserMemory(userId, updatedMemory);
    return updatedMemory;
  }
}
