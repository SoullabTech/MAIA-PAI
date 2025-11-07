/**
 * Archetypal Memory Sub-Service
 * Fire Phase - Typed with Zod validation
 */

import { getSharedSupabase } from "@/lib/db/sharedSupabaseClient";
import type { AINMemoryPayload } from "../types";
import { AINMemoryPayloadZ } from "../schemas";

export class ArchetypalMemory {
  constructor(private readonly supabase = getSharedSupabase()) {}

  async loadUserMemory(userId: string): Promise<AINMemoryPayload | null> {
    const { data, error } = await this.supabase
      .from("ain_memory")
      .select("payload,last_updated,user_id")
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;

    const candidate = {
      userId: data.user_id,
      lastUpdated: data.last_updated ?? new Date().toISOString(),
      ...data.payload,
    };

    const parsed = AINMemoryPayloadZ.safeParse(candidate);
    return parsed.success ? parsed.data : null;
  }

  async saveUserMemory(payload: AINMemoryPayload): Promise<boolean> {
    const parsed = AINMemoryPayloadZ.safeParse(payload);
    if (!parsed.success) return false;

    const { error } = await this.supabase
      .from("ain_memory")
      .upsert(
        {
          user_id: payload.userId,
          last_updated: payload.lastUpdated,
          payload: {
            threads: payload.threads,
            elementalProfile: payload.elementalProfile ?? undefined,
          },
        },
        { onConflict: "user_id" }
      );

    return !error;
  }

  async updateAfterExchange(userId: string, threadSummary: string): Promise<boolean> {
    const current = await this.loadUserMemory(userId);
    const next: AINMemoryPayload = {
      userId: userId as any, // Brand cast
      lastUpdated: new Date().toISOString(),
      threads: [
        ...(current?.threads ?? []).slice(0, 99),
        {
          id: `t-${Date.now()}`,
          summary: threadSummary,
          lastSeenAt: new Date().toISOString(),
        },
      ],
      elementalProfile: current?.elementalProfile,
    };
    return this.saveUserMemory(next);
  }
}
