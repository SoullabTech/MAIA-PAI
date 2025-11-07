/**
 * Semantic Memory Sub-Service
 * Fire Phase - Typed with Zod validation
 */

import { getSharedSupabase } from "@/lib/db/sharedSupabaseClient";
import type { PatternObservation } from "../types";
import { PatternObservationZ } from "../schemas";

export class SemanticMemory {
  constructor(private readonly supabase = getSharedSupabase()) {}

  async getUserPatterns(userId: string): Promise<PatternObservation[]> {
    const { data, error } = await this.supabase
      .from("semantic_observations")
      .select("user_id,kind,label,weight,observed_at,metadata")
      .eq("user_id", userId)
      .order("observed_at", { ascending: false })
      .limit(50);

    if (error || !data) return [];

    return data
      .map((row) =>
        PatternObservationZ.safeParse({
          userId: row.user_id,
          kind: row.kind,
          label: row.label,
          weight: row.weight,
          observedAt: row.observed_at,
          metadata: row.metadata ?? undefined,
        })
      )
      .filter((r) => r.success)
      .map((r) => r.data);
  }

  async getElementalAffinity(userId: string): Promise<Record<string, number> | null> {
    const { data, error } = await this.supabase
      .from("learned_patterns")
      .select("affinity")
      .eq("user_id", userId)
      .single();

    if (error || !data || !data.affinity) return null;
    return data.affinity as Record<string, number>;
  }

  async recordInteraction(obs: PatternObservation): Promise<boolean> {
    const parsed = PatternObservationZ.safeParse(obs);
    if (!parsed.success) return false;

    const { error } = await this.supabase.from("semantic_observations").insert({
      user_id: obs.userId,
      kind: obs.kind,
      label: obs.label,
      weight: obs.weight,
      observed_at: obs.observedAt,
      metadata: obs.metadata ?? null,
    });

    return !error;
  }
}
