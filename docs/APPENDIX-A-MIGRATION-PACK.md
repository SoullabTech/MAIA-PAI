# Appendix A: Migration Pack
## Complete Database Setup + TypeScript Types

**Purpose**: Ready-to-execute SQL and TypeScript definitions for both usage tracking and bardic memory systems.

---

## Part 1: Usage Tracking Migration

### SQL: Create Usage Tracking Tables

```sql
-- Usage Tracking Tables for MAIA
-- Run this first to enable usage monitoring

-- Table: user_usage_logs
-- Tracks every API request with detailed metrics
CREATE TABLE IF NOT EXISTS user_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  user_name TEXT,

  -- Request details
  endpoint TEXT NOT NULL,
  request_type TEXT NOT NULL,

  -- Token usage
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,

  -- Cost calculation (in USD cents)
  input_cost DECIMAL(10, 4) DEFAULT 0,
  output_cost DECIMAL(10, 4) DEFAULT 0,
  total_cost DECIMAL(10, 4) GENERATED ALWAYS AS (input_cost + output_cost) STORED,

  -- Performance metrics
  response_time_ms INTEGER,
  queue_wait_time_ms INTEGER DEFAULT 0,

  -- Request metadata
  model_used TEXT,
  is_voice_mode BOOLEAN DEFAULT false,
  field_depth DECIMAL(3, 2),

  -- Status
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  error_type TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_created_at ON user_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_usage_endpoint ON user_usage_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_user_usage_user_date ON user_usage_logs(user_id, created_at DESC);

-- Table: user_usage_quotas
CREATE TABLE IF NOT EXISTS user_usage_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  user_name TEXT,
  user_tier TEXT DEFAULT 'beta',

  -- Daily limits
  daily_message_limit INTEGER DEFAULT 100,
  daily_token_limit INTEGER DEFAULT 50000,
  daily_cost_limit_cents INTEGER DEFAULT 50,

  -- Rate limiting
  requests_per_minute INTEGER DEFAULT 10,
  requests_per_hour INTEGER DEFAULT 100,

  -- Current usage (reset daily)
  current_daily_messages INTEGER DEFAULT 0,
  current_daily_tokens INTEGER DEFAULT 0,
  current_daily_cost_cents DECIMAL(10, 4) DEFAULT 0,
  last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_blocked BOOLEAN DEFAULT false,
  block_reason TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_quotas_user_id ON user_usage_quotas(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quotas_tier ON user_usage_quotas(user_tier);

-- Table: system_usage_summary
CREATE TABLE IF NOT EXISTS system_usage_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date DATE UNIQUE NOT NULL,

  -- Request counts
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,

  -- Token usage
  total_input_tokens BIGINT DEFAULT 0,
  total_output_tokens BIGINT DEFAULT 0,
  total_tokens BIGINT GENERATED ALWAYS AS (total_input_tokens + total_output_tokens) STORED,

  -- Cost
  total_cost_cents DECIMAL(10, 2) DEFAULT 0,

  -- Performance
  avg_response_time_ms INTEGER,
  avg_queue_wait_time_ms INTEGER,

  -- User stats
  unique_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,

  -- Model distribution
  sonnet_4_requests INTEGER DEFAULT 0,
  other_model_requests INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_summary_date ON system_usage_summary(summary_date DESC);

-- Function: Reset daily quotas
CREATE OR REPLACE FUNCTION reset_daily_quotas()
RETURNS void AS $$
BEGIN
  UPDATE user_usage_quotas
  SET
    current_daily_messages = 0,
    current_daily_tokens = 0,
    current_daily_cost_cents = 0,
    last_reset_at = NOW()
  WHERE DATE(last_reset_at) < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function: Update system summary
CREATE OR REPLACE FUNCTION update_system_summary(target_date DATE)
RETURNS void AS $$
BEGIN
  INSERT INTO system_usage_summary (
    summary_date,
    total_requests,
    successful_requests,
    failed_requests,
    total_input_tokens,
    total_output_tokens,
    total_cost_cents,
    avg_response_time_ms,
    avg_queue_wait_time_ms,
    unique_users,
    sonnet_4_requests
  )
  SELECT
    target_date,
    COUNT(*),
    COUNT(*) FILTER (WHERE success = true),
    COUNT(*) FILTER (WHERE success = false),
    SUM(input_tokens),
    SUM(output_tokens),
    SUM(total_cost),
    AVG(response_time_ms)::INTEGER,
    AVG(queue_wait_time_ms)::INTEGER,
    COUNT(DISTINCT user_id),
    COUNT(*) FILTER (WHERE model_used LIKE '%sonnet-4%')
  FROM user_usage_logs
  WHERE DATE(created_at) = target_date
  ON CONFLICT (summary_date)
  DO UPDATE SET
    total_requests = EXCLUDED.total_requests,
    successful_requests = EXCLUDED.successful_requests,
    failed_requests = EXCLUDED.failed_requests,
    total_input_tokens = EXCLUDED.total_input_tokens,
    total_output_tokens = EXCLUDED.total_output_tokens,
    total_cost_cents = EXCLUDED.total_cost_cents,
    avg_response_time_ms = EXCLUDED.avg_response_time_ms,
    avg_queue_wait_time_ms = EXCLUDED.avg_queue_wait_time_ms,
    unique_users = EXCLUDED.unique_users,
    sonnet_4_requests = EXCLUDED.sonnet_4_requests,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

### TypeScript Types: Usage Tracking

```typescript
// lib/types/usage-tracking.ts

export interface UsageLogEntry {
  id?: string;
  userId: string;
  userName?: string;
  endpoint: string;
  requestType: 'chat-text' | 'chat-voice' | 'tts' | 'journal' | 'reflection';
  inputTokens: number;
  outputTokens: number;
  inputCost: number;  // in cents
  outputCost: number; // in cents
  responseTimeMs: number;
  queueWaitTimeMs?: number;
  modelUsed: string;
  isVoiceMode?: boolean;
  fieldDepth?: number;
  success: boolean;
  errorMessage?: string;
  errorType?: 'rate_limit' | 'timeout' | 'api_error' | 'quota_exceeded' | 'other';
  createdAt?: Date;
}

export interface UserQuota {
  id?: string;
  userId: string;
  userName?: string;
  userTier: 'beta' | 'standard' | 'premium' | 'unlimited';
  dailyMessageLimit: number;
  dailyTokenLimit: number;
  dailyCostLimitCents: number;
  requestsPerMinute: number;
  requestsPerHour: number;
  currentDailyMessages: number;
  currentDailyTokens: number;
  currentDailyCostCents: number;
  lastResetAt: Date;
  isActive: boolean;
  isBlocked: boolean;
  blockReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SystemUsageSummary {
  id?: string;
  summaryDate: Date;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostCents: number;
  avgResponseTimeMs: number;
  avgQueueWaitTimeMs: number;
  uniqueUsers: number;
  newUsers: number;
  sonnet4Requests: number;
  otherModelRequests: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
  quota?: UserQuota;
}

export interface UsageSummary {
  userId: string;
  period: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: string;
  totalTokens: number;
  totalCostUSD: string;
  avgResponseTimeMs: number;
  quota?: UserQuota;
  quotaStatus: 'ok' | 'warning' | 'critical' | 'exceeded';
}
```

---

## Part 2: Bardic Memory Migration

### SQL: Create Bardic Memory Tables

```sql
-- Bardic Memory Tables for MAIA
-- Implements morphic resonance memory system

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Table: episodes (the "rooms" that can be re-entered)
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- The Stanza (poetic compression, ≤300 chars)
  scene_stanza TEXT CHECK (char_length(scene_stanza) <= 300),
  transcript_link TEXT,

  -- Place & Sense Cues (portals for re-entry)
  place_cue TEXT,
  sense_cues JSONB DEFAULT '{}', -- {smell: "cedar", sound: "rain", music: "playlist-url"}
  people TEXT[] DEFAULT '{}',

  -- Affect Binding (Water element)
  affect_valence DECIMAL(3,2) CHECK (affect_valence >= -1 AND affect_valence <= 1),
  affect_arousal DECIMAL(3,2) CHECK (affect_arousal >= 0 AND affect_arousal <= 1),
  affect_keywords TEXT[] DEFAULT '{}',

  -- Elemental State
  elemental_state JSONB DEFAULT '{"fire": 0.5, "air": 0.5, "water": 0.5, "earth": 0.5, "aether": 0.5}',
  dominant_element TEXT CHECK (dominant_element IN ('fire', 'air', 'water', 'earth', 'aether')),
  current_facet TEXT, -- e.g., "fire_blaze", "water_depth"

  -- Threshold Markers
  is_recalibration BOOLEAN DEFAULT false,
  recalibration_type TEXT, -- 'liminal', 'death_rebirth', 'integration', 'breakthrough'

  -- Sacred Boundary
  sacred_flag BOOLEAN DEFAULT false, -- if true, witness only, no embeddings

  -- Field Metadata
  field_depth DECIMAL(3,2) CHECK (field_depth >= 0 AND field_depth <= 1),
  session_id UUID,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_episodes_user_id ON episodes(user_id);
CREATE INDEX IF NOT EXISTS idx_episodes_datetime ON episodes(datetime DESC);
CREATE INDEX IF NOT EXISTS idx_episodes_place_cue ON episodes(place_cue) WHERE place_cue IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_episodes_sacred_flag ON episodes(sacred_flag) WHERE sacred_flag = true;
CREATE INDEX IF NOT EXISTS idx_episodes_recalibration ON episodes(is_recalibration) WHERE is_recalibration = true;

-- Table: episode_vectors (for similarity matching via morphic resonance)
CREATE TABLE IF NOT EXISTS episode_vectors (
  episode_id UUID PRIMARY KEY REFERENCES episodes(id) ON DELETE CASCADE,
  embedding VECTOR(1536), -- OpenAI ada-002 or similar
  similarity_hash TEXT, -- SimHash for fast approximate matching
  resonance_strength DECIMAL(3,2) DEFAULT 1.0, -- decays over time
  decay_rate DECIMAL(4,3) DEFAULT 0.001,
  morphic_signature JSONB, -- custom resonance metadata

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_episode_vectors_embedding ON episode_vectors USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_episode_vectors_hash ON episode_vectors(similarity_hash);

-- Table: episode_links (narrative threads between episodes)
CREATE TABLE IF NOT EXISTS episode_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_a UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  episode_b UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL CHECK (relation_type IN ('repeats', 'contrasts', 'fulfills', 'echoes', 'resolves', 'deepens', 'diverges')),
  relation_strength DECIMAL(3,2) DEFAULT 0.5 CHECK (relation_strength >= 0 AND relation_strength <= 1),
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(episode_a, episode_b, relation_type)
);

CREATE INDEX IF NOT EXISTS idx_episode_links_a ON episode_links(episode_a);
CREATE INDEX IF NOT EXISTS idx_episode_links_b ON episode_links(episode_b);
CREATE INDEX IF NOT EXISTS idx_episode_links_type ON episode_links(relation_type);

-- Table: cues (sensory portals for memory access)
CREATE TABLE IF NOT EXISTS cues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  cue_type TEXT NOT NULL CHECK (cue_type IN ('place', 'smell', 'sound', 'music', 'texture', 'taste', 'image')),
  cue_value TEXT NOT NULL, -- e.g., "cedar smoke", "lake at dusk", "spotify:track:..."
  description TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, cue_type, cue_value)
);

CREATE INDEX IF NOT EXISTS idx_cues_user_type ON cues(user_id, cue_type);

-- Table: episode_cues (many-to-many: episodes ↔ cues)
CREATE TABLE IF NOT EXISTS episode_cues (
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  cue_id UUID NOT NULL REFERENCES cues(id) ON DELETE CASCADE,
  strength DECIMAL(3,2) DEFAULT 1.0 CHECK (strength >= 0 AND strength <= 1),

  PRIMARY KEY (episode_id, cue_id)
);

CREATE INDEX IF NOT EXISTS idx_episode_cues_cue ON episode_cues(cue_id);

-- Table: teloi (future pressures, "what wants to become")
CREATE TABLE IF NOT EXISTS teloi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  phrase TEXT NOT NULL, -- e.g., "Restore voice in relationships"
  origin_episode_id UUID REFERENCES episodes(id) ON DELETE SET NULL,
  strength DECIMAL(3,2) DEFAULT 1.0 CHECK (strength >= 0 AND strength <= 1),
  horizon_days INTEGER DEFAULT 48, -- timeframe for crystallization
  signals JSONB DEFAULT '[]', -- micro-signals of emergence
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teloi_user_active ON teloi(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_teloi_origin ON teloi(origin_episode_id) WHERE origin_episode_id IS NOT NULL;

-- Table: telos_alignment_log (tracking crystallization)
CREATE TABLE IF NOT EXISTS telos_alignment_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  telos_id UUID NOT NULL REFERENCES teloi(id) ON DELETE CASCADE,
  delta DECIMAL(3,2) CHECK (delta >= -1 AND delta <= 1), -- -1 = diverging, +1 = crystallizing
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telos_log_episode ON telos_alignment_log(episode_id);
CREATE INDEX IF NOT EXISTS idx_telos_log_telos ON telos_alignment_log(telos_id);

-- Table: microacts (repeated actions building virtues)
CREATE TABLE IF NOT EXISTS microacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  action_phrase TEXT NOT NULL, -- e.g., "Set clear boundary"
  virtue_category TEXT, -- e.g., "sovereignty", "courage", "clarity"
  total_count INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, action_phrase)
);

CREATE INDEX IF NOT EXISTS idx_microacts_user ON microacts(user_id);
CREATE INDEX IF NOT EXISTS idx_microacts_virtue ON microacts(virtue_category) WHERE virtue_category IS NOT NULL;

-- Table: microact_logs (individual occurrences)
CREATE TABLE IF NOT EXISTS microact_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  microact_id UUID NOT NULL REFERENCES microacts(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES episodes(id) ON DELETE SET NULL,
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  context_note TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_microact_logs_microact ON microact_logs(microact_id);
CREATE INDEX IF NOT EXISTS idx_microact_logs_episode ON microact_logs(episode_id) WHERE episode_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_microact_logs_occurred ON microact_logs(occurred_at DESC);

-- Table: field_edges (topological memory structure for drift support)
CREATE TABLE IF NOT EXISTS field_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  edge_type TEXT NOT NULL, -- 'before_after', 'center_periphery', 'inside_outside'
  episodes JSONB NOT NULL, -- array of episode IDs in topological order
  description TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_field_edges_user ON field_edges(user_id);
CREATE INDEX IF NOT EXISTS idx_field_edges_type ON field_edges(edge_type);

-- Comments for documentation
COMMENT ON TABLE episodes IS 'The rooms that can be re-entered through bardic memory';
COMMENT ON TABLE episode_vectors IS 'Vector embeddings for morphic resonance matching';
COMMENT ON TABLE episode_links IS 'Narrative threads connecting episodes';
COMMENT ON TABLE cues IS 'Sensory portals (place, smell, music) for memory access';
COMMENT ON TABLE teloi IS 'Future pressures and teleological attractors';
COMMENT ON TABLE microacts IS 'Repeated actions building virtues over time';
COMMENT ON TABLE field_edges IS 'Topological memory structure for drift-friendly continuity';
```

### TypeScript Types: Bardic Memory

```typescript
// lib/types/bardic-memory.ts

export interface ElementalState {
  fire: number;    // 0-1
  air: number;
  water: number;
  earth: number;
  aether: number;
}

export interface SenseCues {
  smell?: string;
  sound?: string;
  music?: string;  // URL or identifier
  texture?: string;
  taste?: string;
  image?: string;  // URL
}

export type RecalibrationType = 'liminal' | 'death_rebirth' | 'integration' | 'breakthrough';
export type ElementName = 'fire' | 'air' | 'water' | 'earth' | 'aether';
export type FacetName =
  | 'fire_spark' | 'fire_blaze' | 'fire_phoenix'
  | 'air_breath' | 'air_wind' | 'air_word'
  | 'water_mist' | 'water_depth' | 'water_source'
  | 'earth_seed' | 'earth_root' | 'earth_mountain'
  | 'aether_witness' | 'aether_field' | 'aether_mysterium';

export interface Episode {
  id?: string;
  userId: string;
  datetime: Date;

  // The Stanza
  sceneStanza?: string;  // ≤300 chars
  transcriptLink?: string;

  // Place & Sense Cues
  placeCue?: string;
  senseCues?: SenseCues;
  people?: string[];

  // Affect Binding
  affectValence?: number;  // -1 to +1
  affectArousal?: number;  // 0 to 1
  affectKeywords?: string[];

  // Elemental State
  elementalState?: ElementalState;
  dominantElement?: ElementName;
  currentFacet?: FacetName;

  // Threshold Markers
  isRecalibration?: boolean;
  recalibrationType?: RecalibrationType;

  // Sacred Boundary
  sacredFlag?: boolean;  // If true: witness only, no embeddings

  // Field Metadata
  fieldDepth?: number;  // 0-1
  sessionId?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface EpisodeVector {
  episodeId: string;
  embedding: number[];  // 1536 dimensions
  similarityHash?: string;
  resonanceStrength?: number;  // decays over time
  decayRate?: number;
  morphicSignature?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RelationType =
  | 'repeats'    // Same pattern recurring
  | 'contrasts'  // Opposite or complementary
  | 'fulfills'   // Later episode completes earlier one
  | 'echoes'     // Similar but different context
  | 'resolves'   // Closes an open thread
  | 'deepens'    // Takes pattern to new depth
  | 'diverges';  // Intentional departure

export interface EpisodeLink {
  id?: string;
  episodeA: string;
  episodeB: string;
  relationType: RelationType;
  relationStrength?: number;  // 0-1
  notes?: string;
  createdAt?: Date;
}

export type CueType = 'place' | 'smell' | 'sound' | 'music' | 'texture' | 'taste' | 'image';

export interface Cue {
  id?: string;
  userId: string;
  cueType: CueType;
  cueValue: string;
  description?: string;
  createdAt?: Date;
}

export interface EpisodeCue {
  episodeId: string;
  cueId: string;
  strength?: number;  // 0-1
}

export interface Telos {
  id?: string;
  userId: string;
  phrase: string;  // e.g., "Restore voice in relationships"
  originEpisodeId?: string;
  strength?: number;  // 0-1
  horizonDays?: number;  // timeframe for crystallization
  signals?: any[];  // micro-signals of emergence
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TelosAlignmentLog {
  id?: string;
  episodeId: string;
  telosId: string;
  delta: number;  // -1 (diverging) to +1 (crystallizing)
  notes?: string;
  createdAt?: Date;
}

export interface Microact {
  id?: string;
  userId: string;
  actionPhrase: string;  // e.g., "Set clear boundary"
  virtueCategory?: string;  // e.g., "sovereignty", "courage"
  totalCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MicroactLog {
  id?: string;
  microactId: string;
  episodeId?: string;
  occurredAt?: Date;
  contextNote?: string;
  createdAt?: Date;
}

export type EdgeType = 'before_after' | 'center_periphery' | 'inside_outside';

export interface FieldEdge {
  id?: string;
  userId: string;
  edgeType: EdgeType;
  episodes: string[];  // episode IDs in topological order
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Retrieval Protocol Types

export interface RecognitionSignal {
  resonanceDetected: boolean;
  matchedEpisodes: Array<{
    episodeId: string;
    similarity: number;
    dominantElement: ElementName;
    placeCue?: string;
    sceneStanza?: string;
  }>;
  dominantPattern?: string;
  affectResonance?: number;
}

export interface ReentryExperience {
  episode: Episode;
  stanzaPresentation: string;  // Poetic rendering
  sensoryContext?: SenseCues;
  affectWarning?: string;  // If intensity high
  permissionGranted: boolean;
  relatedEpisodes?: string[];  // IDs of linked episodes
}

export type RecallDepth = 'light' | 'medium' | 'deep';

export interface EpisodeDetails {
  episode: Episode;
  fullTranscript?: string;
  linkedEpisodes: EpisodeLink[];
  activeTeloi?: Telos[];
  microactsObserved?: Microact[];
  fieldPosition?: FieldEdge[];
}

// UX Microflow Types

export interface DrawerParams {
  userId: string;
  query?: string;  // "lake wind", "cedar dusk", etc.
  placeCue?: string;
  senseCue?: Partial<SenseCues>;
  dateRange?: { start: Date; end: Date };
}

export interface DrawerExperience {
  matchedEpisodes: Array<{
    episode: Episode;
    matchReason: string;
    resonanceScore: number;
  }>;
  suggestedPortals?: Array<{
    cue: Cue;
    episodeCount: number;
  }>;
}

export interface MadeleineParams {
  userId: string;
  cueType: CueType;
  cueValue: string;
  withMusic?: boolean;
}

export interface MadeleineExperience {
  triggeredEpisodes: Episode[];
  sensoryReconstruction: SenseCues;
  emotionalTone?: string;
  playlist?: string;  // If music requested
}

export interface SacredMomentParams {
  userId: string;
  sceneStanza?: string;
  witnessNote?: string;
}

export interface VirtueLedgerEntry {
  microact: Microact;
  recentOccurrences: MicroactLog[];
  trend: 'building' | 'stable' | 'fading';
  virtueName: string;
}
```

---

## Part 3: Migration Execution Instructions

### Step 1: Run Usage Tracking Migration

**Via Supabase Dashboard** (Recommended):

1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT_ID
2. Navigate to **SQL Editor**
3. Create new query
4. Copy the entire "Usage Tracking" SQL above
5. Click **Run**
6. Verify success: `SELECT * FROM user_usage_logs LIMIT 1;`

**Via Supabase CLI**:

```bash
# Save SQL to file
cat > /tmp/usage_tracking.sql << 'EOF'
[paste Usage Tracking SQL here]
EOF

# Run migration
supabase db execute --file /tmp/usage_tracking.sql
```

### Step 2: Run Bardic Memory Migration

**Via Supabase Dashboard**:

1. Same process as above
2. Copy the entire "Bardic Memory" SQL
3. Run in SQL Editor
4. Verify: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'episode%';`

**Via Supabase CLI**:

```bash
# Save SQL to file
cat > /tmp/bardic_memory.sql << 'EOF'
[paste Bardic Memory SQL here]
EOF

# Run migration
supabase db execute --file /tmp/bardic_memory.sql
```

### Step 3: Verify Installation

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND (
  table_name LIKE 'user_usage%'
  OR table_name LIKE 'system_usage%'
  OR table_name LIKE 'episode%'
  OR table_name IN ('cues', 'teloi', 'telos_alignment_log', 'microacts', 'microact_logs', 'field_edges')
)
ORDER BY table_name;

-- Expected results: 13 tables
-- user_usage_logs, user_usage_quotas, system_usage_summary
-- episodes, episode_vectors, episode_links, episode_cues
-- cues, teloi, telos_alignment_log
-- microacts, microact_logs, field_edges
```

---

## Part 4: Rollback Scripts

### Rollback Usage Tracking

```sql
-- Remove usage tracking tables
DROP TABLE IF EXISTS user_usage_logs CASCADE;
DROP TABLE IF EXISTS user_usage_quotas CASCADE;
DROP TABLE IF EXISTS system_usage_summary CASCADE;
DROP FUNCTION IF EXISTS reset_daily_quotas();
DROP FUNCTION IF EXISTS update_system_summary(DATE);
```

### Rollback Bardic Memory

```sql
-- Remove bardic memory tables (order matters due to foreign keys)
DROP TABLE IF EXISTS microact_logs CASCADE;
DROP TABLE IF EXISTS microacts CASCADE;
DROP TABLE IF EXISTS telos_alignment_log CASCADE;
DROP TABLE IF EXISTS teloi CASCADE;
DROP TABLE IF EXISTS episode_cues CASCADE;
DROP TABLE IF EXISTS cues CASCADE;
DROP TABLE IF EXISTS episode_links CASCADE;
DROP TABLE IF EXISTS episode_vectors CASCADE;
DROP TABLE IF EXISTS field_edges CASCADE;
DROP TABLE IF EXISTS episodes CASCADE;
```

---

## Part 5: Example Seed Data

### Create Test Episode

```sql
-- Insert test episode
INSERT INTO episodes (
  user_id,
  datetime,
  scene_stanza,
  place_cue,
  sense_cues,
  affect_valence,
  affect_arousal,
  affect_keywords,
  elemental_state,
  dominant_element,
  current_facet,
  field_depth
) VALUES (
  'test-user-1',
  NOW(),
  'The lake at dusk. Cedar smoke drifting. You named the grief that had no name.',
  'lake at dusk',
  '{"smell": "cedar smoke", "sound": "water lapping"}',
  -0.3,
  0.6,
  ARRAY['grief', 'naming', 'recognition'],
  '{"fire": 0.4, "air": 0.7, "water": 0.8, "earth": 0.5, "aether": 0.6}',
  'water',
  'water_depth',
  0.75
) RETURNING id;

-- Note the returned ID, then create cue
INSERT INTO cues (user_id, cue_type, cue_value, description)
VALUES (
  'test-user-1',
  'place',
  'lake at dusk',
  'The threshold place where grief was first named'
);

-- Link episode to cue
INSERT INTO episode_cues (episode_id, cue_id, strength)
VALUES (
  '[episode-id-from-above]',
  (SELECT id FROM cues WHERE cue_value = 'lake at dusk' LIMIT 1),
  1.0
);

-- Create future pressure (telos)
INSERT INTO teloi (user_id, phrase, origin_episode_id, strength, horizon_days)
VALUES (
  'test-user-1',
  'Restore voice in relationships',
  '[episode-id-from-above]',
  0.8,
  48
);
```

### Create Test Microact

```sql
-- Record a repeated action building a virtue
INSERT INTO microacts (user_id, action_phrase, virtue_category, total_count)
VALUES (
  'test-user-1',
  'Set clear boundary',
  'sovereignty',
  1
) RETURNING id;

-- Log an occurrence
INSERT INTO microact_logs (microact_id, occurred_at, context_note)
VALUES (
  '[microact-id-from-above]',
  NOW(),
  'Declined request that would overextend capacity'
);
```

---

## Summary

This migration pack provides:

✅ **Complete SQL** for both systems (usage tracking + bardic memory)
✅ **Full TypeScript types** ready to import
✅ **Execution instructions** (dashboard + CLI)
✅ **Verification queries** to confirm success
✅ **Rollback scripts** if needed
✅ **Example seed data** for testing

**Total Tables Created**: 13
**Estimated Setup Time**: 15-20 minutes
**Safe to Run**: All CREATE statements use IF NOT EXISTS

---

*Migration pack prepared: January 7, 2025*
*For: MAIA-FRESH implementation*
🔥🌬️🌊🌍🜃
