# Bardic Memory Migration Guide

## 🔥 Fire-Air Time-Intelligence Schema

The Bardic Memory system treats memory as **re-entry** (not retrieval) and future as **teleology** (not prediction).

## Running the Migration

### Option 1: Supabase Dashboard (Recommended)

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/jkbetmadzcpoinjogkli/sql)
2. Create a new query
3. Copy and paste the contents of `20251107_bardic_memory_schema.sql`
4. Click **"Run"**
5. Verify tables created successfully

### Option 2: Supabase CLI

```bash
# First, login to Supabase
supabase login

# Link the project
supabase link --project-ref jkbetmadzcpoinjogkli

# Run migrations
supabase db push
```

### Option 3: psql (if you have the connection string)

```bash
# Get your database connection string from:
# https://supabase.com/dashboard/project/jkbetmadzcpoinjogkli/settings/database

# Then run:
psql "YOUR_CONNECTION_STRING" -f supabase/migrations/20251107_bardic_memory_schema.sql
```

## What Gets Created

### Core Tables

- **episodes** - Lived scenes with affect, place, and elemental signatures
- **episode_vectors** - Embeddings for similarity search (requires pgvector extension)
- **episode_links** - Graph of resonance (echoes, contrasts, fulfills, co-occurs)

### Cue System

- **cues** - Sensory triggers (place, scent, music, ritual, threshold)
- **episode_cues** - Many-to-many associations with potency scores

### Teleology (Future-Pull)

- **teloi** - What wants to become
- **telos_alignment_log** - Tracking convergence/divergence over time

### Embodiment

- **microacts** - Tiny embodied practices
- **microact_logs** - Practice tracking with affect shifts

### Field Support

- **field_edges** - Graph-level continuity support for drift-tolerant traversal

## Verification

After running the migration, verify with:

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE '%episode%' OR table_name LIKE '%telo%' OR table_name LIKE '%cue%';

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('episodes', 'teloi', 'cues', 'microacts');
```

## Architecture Principles

1. **Recognition precedes recall** - Fast pattern matching before full artifact loading
2. **Sacred episodes are held, not handled** - No embeddings, no linking, minimal handling
3. **Affect-gated re-entry** - Capacity checks based on arousal levels (titration)
4. **Cue-based reconstitution** - Sensory triggers as portals, not just metadata
5. **Polyvalent futures** - Multiple teloi can coexist, fade, or crystallize
6. **Fire-Air balance** - Detect when projection outruns continuity (or vice versa)

## Next Steps

After migration, the Bardic Memory API will be available at:

- `POST /api/memory/recognize` - Recognize familiar scenes
- `POST /api/memory/reenter` - Request ritual re-entry
- `POST /api/memory/recall` - Load full artifacts
- `POST /api/memory/episodes` - Create new episode
- `POST /api/telos/extract` - Extract teloi from text
- `GET /api/telos/balance` - Check Fire-Air balance
- `POST /api/cues` - Create cues
- `POST /api/cues/associate` - Associate cues with episodes

## Documentation

See the full design paper: `/docs/papers/bardic-memory-teleology.md` (if you have it)

Or refer to the inline documentation in:
- `/lib/memory/bardic/types.ts` - Type definitions
- `/lib/memory/bardic/RecognitionService.ts` - Recognition logic
- `/lib/memory/bardic/ReentryService.ts` - Safety gates
- `/lib/memory/bardic/TeleologyService.ts` - Future-pull tracking
