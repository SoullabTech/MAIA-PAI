/**
 * Unified Memory Zod Schemas
 * Fire Phase - IO boundary validation
 */

import { z } from "zod";
import type { AINMemoryPayload, PatternObservation, ConversationMessage } from "./types";

export const UUIDz = z.string().uuid();

export const ConversationMessageZ = z.object({
  id: z.string(),
  userId: UUIDz,
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  createdAt: z.string().datetime(),
  tags: z.array(z.string()).optional(),
}) satisfies z.ZodType<ConversationMessage>;

export const AINMemoryPayloadZ = z.object({
  userId: UUIDz,
  lastUpdated: z.string().datetime(),
  threads: z.array(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      summary: z.string().optional(),
      lastSeenAt: z.string().datetime().optional(),
    })
  ),
  elementalProfile: z
    .object({
      fire: z.number().min(0).max(1).optional(),
      water: z.number().min(0).max(1).optional(),
      earth: z.number().min(0).max(1).optional(),
      air: z.number().min(0).max(1).optional(),
      aether: z.number().min(0).max(1).optional(),
    })
    .optional(),
}) satisfies z.ZodType<AINMemoryPayload>;

export const PatternObservationZ = z.object({
  userId: UUIDz,
  kind: z.enum(["motif", "affinity", "transition"]),
  label: z.string(),
  weight: z.number().min(0).max(1),
  observedAt: z.string().datetime(),
  metadata: z.record(z.unknown()).optional(),
}) satisfies z.ZodType<PatternObservation>;
