/**
 * Conversation Memory Sub-Service
 *
 * Water Phase - Memory Unification
 * Handles conversation history and breakthrough moments from maia_messages table
 */

import type { SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_LIMIT = 10;

export class ConversationMemory {
  constructor(
    private supabase: SupabaseClient,
    private deps?: { now?: () => number }
  ) {}

  /**
   * Retrieve conversation history from maia_messages table
   * This gives MAIA memory continuity across sessions
   */
  async getConversationHistory(userId: string, limit: number = DEFAULT_LIMIT): Promise<any[]> {
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
}
