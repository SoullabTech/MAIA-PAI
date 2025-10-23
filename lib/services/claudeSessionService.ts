// lib/services/claudeSessionService.ts
// 🜂 Claude Session Persistence Service

import { createClient } from "@/lib/supabase";
import { ClaudeSession } from "@/hooks/useClaudeMirror";

export interface PersistedClaudeSession {
  id: string;
  user_id: string;
  session_id: string;
  messages: any[];
  metadata: Record<string, any>;
  message_count: number;
  first_message_at?: string;
  last_message_at?: string;
  avg_coherence?: number;
  elemental_balance?: {
    fire: number;
    water: number;
    earth: number;
    air: number;
    aether: number;
  };
  created_at: string;
  updated_at: string;
}

export class ClaudeSessionService {
  private supabase = createClient();

  /**
   * Save or update a Claude Code session
   */
  async saveSession(
    userId: string,
    session: ClaudeSession
  ): Promise<PersistedClaudeSession | null> {
    try {
      const sessionId = session.sessionId || this.generateSessionId();

      // Compute timestamps
      const timestamps = this.computeTimestamps(session.messages);

      // Compute coherence metrics
      const coherence = this.computeCoherence(session.messages);
      const elementalBalance = this.computeElementalBalance(session.messages);

      const { data, error } = await this.supabase
        .from("claude_sessions")
        .upsert(
          {
            user_id: userId,
            session_id: sessionId,
            messages: session.messages,
            metadata: session.metadata || {},
            first_message_at: timestamps.first,
            last_message_at: timestamps.last,
            avg_coherence: coherence,
            elemental_balance: elementalBalance,
          },
          {
            onConflict: "user_id,session_id",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Failed to save Claude session:", error);
      return null;
    }
  }

  /**
   * Get all sessions for a user
   */
  async getSessions(userId: string): Promise<PersistedClaudeSession[]> {
    try {
      const { data, error } = await this.supabase
        .from("claude_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Failed to fetch Claude sessions:", error);
      return [];
    }
  }

  /**
   * Get a specific session
   */
  async getSession(
    userId: string,
    sessionId: string
  ): Promise<PersistedClaudeSession | null> {
    try {
      const { data, error } = await this.supabase
        .from("claude_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("session_id", sessionId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Failed to fetch Claude session:", error);
      return null;
    }
  }

  /**
   * Delete a session
   */
  async deleteSession(userId: string, sessionId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("claude_sessions")
        .delete()
        .eq("user_id", userId)
        .eq("session_id", sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Failed to delete Claude session:", error);
      return false;
    }
  }

  /**
   * Get session analytics for a user
   */
  async getAnalytics(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from("claude_session_analytics")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      return null;
    }
  }

  // === Private Helper Methods ===

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private computeTimestamps(messages: any[]) {
    if (!messages || messages.length === 0) {
      return { first: null, last: null };
    }

    const timestamps = messages
      .map((m) => m.timestamp)
      .filter(Boolean)
      .sort();

    return {
      first: timestamps[0] || null,
      last: timestamps[timestamps.length - 1] || null,
    };
  }

  /**
   * Compute average coherence from message sentiment
   * Simple heuristic: longer, balanced conversations = higher coherence
   */
  private computeCoherence(messages: any[]): number {
    if (!messages || messages.length === 0) return 0;

    // Base coherence from message count (more messages = more coherent dialogue)
    const lengthScore = Math.min(messages.length / 10, 1);

    // Balance score (alternating user/assistant messages)
    const balanceScore = this.computeBalanceScore(messages);

    // Average length score (neither too short nor too long)
    const avgLengthScore = this.computeAvgLengthScore(messages);

    // Weighted average
    return Math.round((lengthScore * 0.3 + balanceScore * 0.5 + avgLengthScore * 0.2) * 100) / 100;
  }

  private computeBalanceScore(messages: any[]): number {
    if (messages.length < 2) return 0;

    let alternations = 0;
    for (let i = 1; i < messages.length; i++) {
      if (messages[i].role !== messages[i - 1].role) {
        alternations++;
      }
    }

    return alternations / (messages.length - 1);
  }

  private computeAvgLengthScore(messages: any[]): number {
    const avgLength =
      messages.reduce((sum, m) => sum + (m.content?.length || 0), 0) /
      messages.length;

    // Ideal range: 100-500 characters
    if (avgLength < 50) return 0.3;
    if (avgLength > 1000) return 0.5;
    return 1.0;
  }

  /**
   * Compute elemental balance from conversation patterns
   */
  private computeElementalBalance(messages: any[]) {
    const userMessages = messages.filter((m) => m.role === "user").length;
    const assistantMessages = messages.filter((m) => m.role === "assistant").length;
    const systemMessages = messages.filter((m) => m.role === "system").length;
    const total = messages.length || 1;

    // Fire: User initiation energy
    const fire = userMessages / total;

    // Water: Assistant reflection energy
    const water = assistantMessages / total;

    // Air: System transmission energy
    const air = systemMessages / total;

    // Earth: Grounding (balance between all)
    const earth = 1 - Math.abs(fire - water);

    // Aether: Integration (overall coherence)
    const aether = this.computeCoherence(messages);

    return {
      fire: Math.round(fire * 100) / 100,
      water: Math.round(water * 100) / 100,
      air: Math.round(air * 100) / 100,
      earth: Math.round(earth * 100) / 100,
      aether: Math.round(aether * 100) / 100,
    };
  }
}

// Export singleton instance
export const claudeSessionService = new ClaudeSessionService();
