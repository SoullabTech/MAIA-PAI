-- Collective Breakthrough Intelligence
-- Anonymized breakthrough patterns that feed the Aether field

CREATE TABLE IF NOT EXISTS collective_breakthroughs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_id TEXT NOT NULL UNIQUE, -- Hashed user_id (one-way, can't reverse)

  -- Catalyst (what sparked the breakthrough)
  catalyst JSONB NOT NULL, -- { type, archetype_from, archetype_to, elemental_phase_from, elemental_phase_to, practice_offered }

  -- Pattern signature (semantic, not content)
  signature JSONB NOT NULL, -- { transformation_type, emotional_shift, body_involvement, duration_to_breakthrough }

  -- Outcome
  outcome JSONB, -- { integration_level, follow_through, resonance_strength }

  -- Field conditions when breakthrough occurred
  field_conditions JSONB NOT NULL, -- { spiralogic_phase, dominant_element, moon_phase, collective_phase }

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for pattern matching
CREATE INDEX idx_collective_breakthroughs_created_at ON collective_breakthroughs(created_at DESC);
CREATE INDEX idx_collective_breakthroughs_phase ON collective_breakthroughs USING GIN((field_conditions->'spiralogic_phase'));
CREATE INDEX idx_collective_breakthroughs_element ON collective_breakthroughs USING GIN((field_conditions->'dominant_element'));
CREATE INDEX idx_collective_breakthroughs_catalyst_type ON collective_breakthroughs USING GIN((catalyst->'type'));
CREATE INDEX idx_collective_breakthroughs_archetype_from ON collective_breakthroughs USING GIN((catalyst->'archetype_from'));
CREATE INDEX idx_collective_breakthroughs_archetype_to ON collective_breakthroughs USING GIN((catalyst->'archetype_to'));

-- RLS policies (read-only for authenticated users, write via service)
ALTER TABLE collective_breakthroughs ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read anonymized patterns
CREATE POLICY "Authenticated users can read collective breakthroughs"
  ON collective_breakthroughs
  FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert (ensures proper anonymization)
CREATE POLICY "Service role can insert breakthrough patterns"
  ON collective_breakthroughs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_collective_breakthroughs_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_collective_breakthroughs_timestamp
  BEFORE UPDATE ON collective_breakthroughs
  FOR EACH ROW
  EXECUTE FUNCTION update_collective_breakthroughs_timestamp();

COMMENT ON TABLE collective_breakthroughs IS 'Anonymized breakthrough patterns from all users, feeding collective wisdom to the Aether field. Privacy-preserving: pattern_id is hashed, no personal content stored.';
