/**
 * Unified Memory Types
 * Fire Phase - Strong typing, no unknown
 */

export type UUID = string & { readonly __brand: "uuid" };

export interface AINMemoryPayload {
  userId: UUID;
  lastUpdated: string; // ISO date
  threads: Array<{
    id: string;
    title?: string;
    summary?: string;
    lastSeenAt?: string; // ISO
  }>;
  elementalProfile?: {
    fire?: number;
    water?: number;
    earth?: number;
    air?: number;
    aether?: number;
  };
}

export interface PatternObservation {
  userId: UUID;
  kind: "motif" | "affinity" | "transition";
  label: string;
  weight: number; // 0..1
  observedAt: string; // ISO
  metadata?: Record<string, unknown>;
}

export interface ConversationMessage {
  id: string;
  userId: UUID;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string; // ISO
  tags?: string[];
}
