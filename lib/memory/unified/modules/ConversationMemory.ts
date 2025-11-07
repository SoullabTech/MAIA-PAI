/**
 * Conversation Memory Sub-Service
 * Fire Phase - Typed with Zod validation
 */

import { getSharedSupabase } from "@/lib/db/sharedSupabaseClient";
import type { ConversationMessage } from "../types";
import { ConversationMessageZ } from "../schemas";

export class ConversationMemory {
  constructor(private readonly supabase = getSharedSupabase()) {}

  async getConversationHistory(userId: string, limit = 10): Promise<ConversationMessage[]> {
    const { data, error } = await this.supabase
      .from("maia_messages")
      .select("id,user_id,role,content,created_at,tags")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data
      .map((row) =>
        ConversationMessageZ.safeParse({
          id: row.id,
          userId: row.user_id,
          role: row.role,
          content: row.content,
          createdAt: row.created_at,
          tags: row.tags ?? undefined,
        })
      )
      .filter((r) => r.success)
      .map((r) => r.data);
  }

  async getBreakthroughMoments(userId: string, limit = 3): Promise<ConversationMessage[]> {
    const { data, error } = await this.supabase
      .from("maia_messages")
      .select("id,user_id,role,content,created_at,tags")
      .eq("user_id", userId)
      .contains("tags", ["breakthrough"])
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data
      .map((row) =>
        ConversationMessageZ.safeParse({
          id: row.id,
          userId: row.user_id,
          role: row.role,
          content: row.content,
          createdAt: row.created_at,
          tags: row.tags ?? undefined,
        })
      )
      .filter((r) => r.success)
      .map((r) => r.data);
  }
}
