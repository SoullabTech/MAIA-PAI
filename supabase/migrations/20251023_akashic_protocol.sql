-- backend
-- supabase/migrations/20251023_akashic_protocol.sql
-- Akashic Recollection Protocol: schema, provenance, federation scaffolding

-- 1) Namespace
CREATE SCHEMA IF NOT EXISTS akashic;

-- 2) Local alias views (non-breaking): map existing tables into schema
--    Assumes you already created: insight_history, embeddings, concepts, breakthroughs, timeline
DROP VIEW IF EXISTS akashic.insights;
CREATE VIEW akashic.insights AS
  SELECT
    ih.id,
    ih.user_id,
    ih.session_id,
    ih.role,
    ih.content,
    ih.element,
    ih.archetype,
    ih.source,
    ih.created_at,
    -- provenance (nullable until backfilled)
    ih.agent_id,
    ih.origin_node,
    ih.confidence_score,
    ih.content_hash
  FROM insight_history ih;

DROP VIEW IF EXISTS akashic.embeddings;
CREATE VIEW akashic.embeddings AS
  SELECT
    e.id, e.insight_id, e.content, e.role, e.element, e.archetype, e.embedding, e.created_at
  FROM embeddings e;

-- 3) Add provenance columns to base table if missing
ALTER TABLE insight_history
  ADD COLUMN IF NOT EXISTS agent_id TEXT,
  ADD COLUMN IF NOT EXISTS origin_node TEXT,
  ADD COLUMN IF NOT EXISTS confidence_score REAL,
  ADD COLUMN IF NOT EXISTS content_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_insight_history_hash ON insight_history (content_hash);
CREATE INDEX IF NOT EXISTS idx_insight_history_origin ON insight_history (origin_node);

-- 4) External (read-only) store for federated whispers
CREATE TABLE IF NOT EXISTS akashic_external_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_node TEXT NOT NULL,
  agent_id TEXT,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  element TEXT,
  archetype TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  content_hash TEXT UNIQUE NOT NULL,
  confidence_score REAL,
  signature TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS akashic_sync_log (
  id BIGSERIAL PRIMARY KEY,
  direction TEXT NOT NULL CHECK (direction IN ('push','pull')),
  peer TEXT NOT NULL,
  bundle_count INT NOT NULL,
  status TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5) Helpful materialized view for counts by (element, archetype)
CREATE MATERIALIZED VIEW IF NOT EXISTS akashic_counts AS
SELECT element, archetype, COUNT(*)::INT AS count
FROM (
  SELECT element, archetype FROM insight_history
  UNION ALL
  SELECT element, archetype FROM akashic_external_insights
) t
GROUP BY element, archetype;

CREATE INDEX IF NOT EXISTS idx_ak_counts_ea ON akashic_counts (element, archetype);

-- 6) RLS (restrict direct writes to external table except service_role)
ALTER TABLE akashic_external_insights ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ext_ro_select ON akashic_external_insights;
CREATE POLICY ext_ro_select ON akashic_external_insights
  FOR SELECT USING (true);

DROP POLICY IF EXISTS ext_insert_service ON akashic_external_insights;
CREATE POLICY ext_insert_service ON akashic_external_insights
  FOR INSERT TO authenticated
  WITH CHECK (false); -- block authenticated

-- service_role can still insert (server only).

-- 7) Refresh helper
CREATE OR REPLACE FUNCTION akashic_refresh_counts()
RETURNS void LANGUAGE sql AS $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY akashic_counts;
$$;
