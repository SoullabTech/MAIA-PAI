-- 🧠 AIN Memory Table
-- Stores persistent symbolic memory for each user
-- Evolves across sessions tracking: symbolic threads, emotional themes, rituals, phase progression

CREATE TABLE IF NOT EXISTS ain_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one memory record per user
  CONSTRAINT unique_user_memory UNIQUE (user_id)
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_ain_memory_user_id ON ain_memory(user_id);

-- Index on updated_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_ain_memory_updated_at ON ain_memory(updated_at);

-- RLS Policies
ALTER TABLE ain_memory ENABLE ROW LEVEL SECURITY;

-- Users can only read their own memory
CREATE POLICY "Users can read their own AIN memory"
  ON ain_memory
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own memory
CREATE POLICY "Users can insert their own AIN memory"
  ON ain_memory
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own memory
CREATE POLICY "Users can update their own AIN memory"
  ON ain_memory
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role can do everything (for PersonalOracleAgent)
CREATE POLICY "Service role has full access to AIN memory"
  ON ain_memory
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ain_memory_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER ain_memory_updated_at
  BEFORE UPDATE ON ain_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_ain_memory_timestamp();

-- Add comment for documentation
COMMENT ON TABLE ain_memory IS 'Persistent symbolic memory for MAIA - tracks symbolic threads, emotional themes, rituals, and Spiralogic phase progression across sessions';
COMMENT ON COLUMN ain_memory.memory_data IS 'JSONB payload containing AINMemoryPayload structure: symbolic threads, archetypes, phases, rituals, conversational preferences, etc.';
