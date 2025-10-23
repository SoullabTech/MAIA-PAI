// backend
// types/akashic.ts
export type AkashicContextQuery = {
  query: string;
  elementHint?: string;
  archetypeHint?: string;
  includeExternal?: boolean; // pull from akashic_external_insights
  limit?: number;            // default 5
  minScore?: number;         // 0..1 (semantic threshold)
  version?: 'v1';
};

export type AkashicContextItem = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  element?: string | null;
  archetype?: string | null;
  created_at: string;
  origin_node?: string | null;
  agent_id?: string | null;
  confidence_score?: number | null;
  source: 'local' | 'external';
  score?: number; // similarity
};

export type AkashicBundle = {
  origin_node: string;
  sent_at: string;               // ISO
  items: Array<{
    content_hash: string;
    created_at: string;
    role: string;
    content: string;
    element?: string | null;
    archetype?: string | null;
    agent_id?: string | null;
    confidence_score?: number | null;
  }>;
  signature: string;             // HMAC of JSON(items) using shared secret
};
