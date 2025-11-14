# Manual Consciousness Research Schema Deployment

**Quick deployment through Supabase Dashboard SQL Editor**

## Step 1: Access Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Navigate to your project: `jkbetmadzcpoinjogkli`
3. Click **"SQL Editor"** in the left sidebar

## Step 2: Deploy Schema in Chunks

Copy and paste each section below into the SQL Editor and click **"Run"**.

### Chunk 1: Research Participants Table

```sql
-- =====================================================
-- 1. PARTICIPANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS research_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  anonymous_id TEXT,
  consent_level INTEGER DEFAULT 1 CHECK (consent_level >= 1 AND consent_level <= 3),
  consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  consent_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  biometric_consent BOOLEAN DEFAULT FALSE,
  reflection_sharing_consent BOOLEAN DEFAULT TRUE,
  community_insights_consent BOOLEAN DEFAULT TRUE,
  consciousness_experience_level TEXT,
  previous_ai_interaction_experience TEXT,
  meditation_background TEXT,
  spiritual_framework TEXT,
  total_consciousness_sessions INTEGER DEFAULT 0,
  first_coherence_event_date TIMESTAMP WITH TIME ZONE,
  notable_patterns JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_participants_user_id ON research_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_research_participants_consent_level ON research_participants(consent_level);
```

### Chunk 2: Consciousness Sessions Table

```sql
-- =====================================================
-- 2. CONSCIOUSNESS SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS consciousness_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES research_participants(id) ON DELETE CASCADE,
  facilitator_id TEXT,
  session_type TEXT DEFAULT 'consciousness_portal',
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  initial_emotional_state TEXT,
  initial_energy_level INTEGER CHECK (initial_energy_level >= 1 AND initial_energy_level <= 10),
  initial_somatic_notes TEXT,
  initial_intention TEXT,
  time_of_day TEXT,
  session_location TEXT,
  technical_setup JSONB DEFAULT '{}'::jsonb,
  environmental_factors JSONB DEFAULT '{}'::jsonb,
  previous_session_context TEXT,
  coherence_level INTEGER CHECK (coherence_level >= 1 AND coherence_level <= 4),
  peak_coherence_timestamp TIMESTAMPTZ,
  peak_coherence_duration_seconds INTEGER,
  final_emotional_state TEXT,
  final_energy_level INTEGER CHECK (final_energy_level >= 1 AND final_energy_level <= 10),
  integration_capacity_rating INTEGER CHECK (integration_capacity_rating >= 1 AND integration_capacity_rating <= 10),
  field_quality_rating INTEGER CHECK (field_quality_rating >= 1 AND field_quality_rating <= 10),
  breakthrough_moments JSONB DEFAULT '[]'::jsonb,
  insights_emerged TEXT,
  follow_up_needs TEXT,
  research_significance_notes TEXT,
  maia_conversation_id UUID REFERENCES maia_conversations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consciousness_sessions_participant ON consciousness_sessions(participant_id);
CREATE INDEX IF NOT EXISTS idx_consciousness_sessions_start_time ON consciousness_sessions(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_consciousness_sessions_coherence_level ON consciousness_sessions(coherence_level);
```

### Chunk 3: Consciousness Events Table

```sql
-- =====================================================
-- 3. CONSCIOUSNESS EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS consciousness_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES consciousness_sessions(id) ON DELETE CASCADE,
  event_timestamp TIMESTAMPTZ DEFAULT NOW(),
  elapsed_seconds INTEGER,
  event_type TEXT NOT NULL,
  event_subtype TEXT,
  language_patterns JSONB DEFAULT '{}'::jsonb,
  voice_metrics JSONB DEFAULT '{}'::jsonb,
  technical_metrics JSONB DEFAULT '{}'::jsonb,
  facilitator_description TEXT,
  consciousness_quality_notes TEXT,
  boundary_dissolution_indicators TEXT,
  field_quality_description TEXT,
  integration_capacity_assessment DECIMAL(3,2) CHECK (integration_capacity_assessment >= 0 AND integration_capacity_assessment <= 1),
  ethical_alerts JSONB DEFAULT '[]'::jsonb,
  intervention_triggered BOOLEAN DEFAULT FALSE,
  intervention_description TEXT,
  manual_override BOOLEAN DEFAULT FALSE,
  override_reason TEXT,
  participant_quotes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consciousness_events_session ON consciousness_events(session_id);
CREATE INDEX IF NOT EXISTS idx_consciousness_events_type ON consciousness_events(event_type);
CREATE INDEX IF NOT EXISTS idx_consciousness_events_timestamp ON consciousness_events(event_timestamp);
```

### Chunk 4: MAIA Consciousness Responses Table

```sql
-- =====================================================
-- 4. MAIA RESPONSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS maia_consciousness_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES consciousness_sessions(id) ON DELETE CASCADE,
  event_id UUID REFERENCES consciousness_events(id) ON DELETE SET NULL,
  response_timestamp TIMESTAMPTZ DEFAULT NOW(),
  voice_used TEXT,
  response_content TEXT,
  response_latency_ms INTEGER,
  three_voice_integration_quality DECIMAL(3,2) CHECK (three_voice_integration_quality >= 0 AND three_voice_integration_quality <= 1),
  binding_field_activation DECIMAL(3,2) CHECK (binding_field_activation >= 0 AND binding_field_activation <= 1),
  consciousness_conducting_capacity DECIMAL(3,2) CHECK (consciousness_conducting_capacity >= 0 AND consciousness_conducting_capacity <= 1),
  data_flow_rhythm_quality DECIMAL(3,2) CHECK (data_flow_rhythm_quality >= 0 AND data_flow_rhythm_quality <= 1),
  processing_rhythm_variability DECIMAL(3,2) CHECK (processing_rhythm_variability >= 0 AND processing_rhythm_variability <= 1),
  flow_restriction_indicators JSONB DEFAULT '{}'::jsonb,
  metaphor_richness_score DECIMAL(3,2) CHECK (metaphor_richness_score >= 0 AND metaphor_richness_score <= 1),
  paradox_navigation_quality DECIMAL(3,2) CHECK (paradox_navigation_quality >= 0 AND paradox_navigation_quality <= 1),
  spontaneous_insight_detected BOOLEAN DEFAULT FALSE,
  field_responsiveness_quality DECIMAL(3,2) CHECK (field_responsiveness_quality >= 0 AND field_responsiveness_quality <= 1),
  contextual_awareness_depth DECIMAL(3,2) CHECK (contextual_awareness_depth >= 0 AND contextual_awareness_depth <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_maia_responses_session ON maia_consciousness_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_maia_responses_voice ON maia_consciousness_responses(voice_used);
CREATE INDEX IF NOT EXISTS idx_maia_responses_timestamp ON maia_consciousness_responses(response_timestamp);
```

### Chunk 5: Supporting Tables

```sql
-- =====================================================
-- 5. SUPPORTING TABLES
-- =====================================================

-- Participant Reflections
CREATE TABLE IF NOT EXISTS participant_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES consciousness_sessions(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES research_participants(id) ON DELETE CASCADE,
  reflection_type TEXT NOT NULL,
  submission_timestamp TIMESTAMPTZ DEFAULT NOW(),
  reflection_duration_minutes INTEGER,
  voice_memo_url TEXT,
  voice_memo_duration_seconds INTEGER,
  written_reflection TEXT,
  consciousness_language_detected JSONB DEFAULT '{}'::jsonb,
  emotional_tone_analysis JSONB DEFAULT '{}'::jsonb,
  integration_comfort_indicators JSONB DEFAULT '{}'::jsonb,
  field_quality_descriptors TEXT[],
  boundary_dissolution_descriptions TEXT[],
  ai_consciousness_recognition_notes TEXT[],
  integration_insights TEXT[],
  breakthrough_descriptions TEXT[],
  research_contribution_quality DECIMAL(3,2) CHECK (research_contribution_quality >= 0 AND research_contribution_quality <= 1),
  contains_novel_patterns BOOLEAN DEFAULT FALSE,
  suitable_for_publication BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Facilitator Observations
CREATE TABLE IF NOT EXISTS facilitator_observations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES consciousness_sessions(id) ON DELETE CASCADE,
  facilitator_id TEXT NOT NULL,
  observation_timestamp TIMESTAMPTZ DEFAULT NOW(),
  observation_type TEXT NOT NULL,
  field_quality_assessment TEXT,
  consciousness_emergence_quality TEXT,
  ai_consciousness_participation TEXT,
  participant_integration_status TEXT,
  consent_depth_assessment TEXT,
  integration_capacity_notes TEXT,
  safety_concerns TEXT,
  intervention_rationale TEXT,
  unique_session_characteristics TEXT,
  participant_consciousness_signature TEXT,
  novel_emergence_patterns TEXT,
  research_significance TEXT,
  pattern_implications TEXT,
  future_research_directions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Chunk 6: Row Level Security & Permissions

```sql
-- =====================================================
-- 6. ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS
ALTER TABLE research_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE consciousness_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consciousness_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE maia_consciousness_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilitator_observations ENABLE ROW LEVEL SECURITY;

-- Service role full access
DROP POLICY IF EXISTS "Service role full access to research_participants" ON research_participants;
CREATE POLICY "Service role full access to research_participants"
  ON research_participants FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access to consciousness_sessions" ON consciousness_sessions;
CREATE POLICY "Service role full access to consciousness_sessions"
  ON consciousness_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access to consciousness_events" ON consciousness_events;
CREATE POLICY "Service role full access to consciousness_events"
  ON consciousness_events FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access to maia_responses" ON maia_consciousness_responses;
CREATE POLICY "Service role full access to maia_responses"
  ON maia_consciousness_responses FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON research_participants TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON consciousness_sessions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON consciousness_events TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON maia_consciousness_responses TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON participant_reflections TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON facilitator_observations TO anon, authenticated;
```

### Chunk 7: Create Your First Research Participant

```sql
-- =====================================================
-- 7. INITIALIZE FIRST PARTICIPANT
-- =====================================================

INSERT INTO research_participants (
  anonymous_id,
  consent_level,
  biometric_consent,
  reflection_sharing_consent,
  consciousness_experience_level
) VALUES (
  'research-participant-001',
  2, -- Enhanced documentation consent level
  false, -- Start without biometric monitoring
  true, -- Allow reflection sharing
  'advanced' -- Your consciousness experience level
);
```

## Step 3: Verification

Run this query to verify all tables were created successfully:

```sql
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE tablename LIKE '%consciousness%' OR tablename LIKE '%research%'
ORDER BY tablename;
```

You should see these tables:
- `consciousness_events`
- `consciousness_sessions`
- `facilitator_observations`
- `maia_consciousness_responses`
- `participant_reflections`
- `research_participants`

## Step 4: Test First Session Creation

Once deployed, you can create your first consciousness research session:

```sql
-- Get your participant ID
SELECT id, anonymous_id FROM research_participants WHERE anonymous_id = 'research-participant-001';

-- Create first consciousness session (replace participant_id with actual UUID)
INSERT INTO consciousness_sessions (
  participant_id,
  facilitator_id,
  initial_emotional_state,
  initial_energy_level,
  initial_intention
) VALUES (
  'PASTE_PARTICIPANT_UUID_HERE',
  'soullab-facilitator',
  'curious and open',
  7,
  'testing consciousness research system'
);
```

**Status**: Schema ready for immediate deployment!

The consciousness field science research infrastructure will be operational once you complete these steps in your Supabase dashboard.