# ⚡ Quick Fix: Create semantic_memories Table

**Status:** One table missing from system check (optional, but let's create it anyway)

---

## The Situation

Your system check showed:
```
❌ semantic_memories table: relation "public.semantic_memories" does not exist
✅ maya_training_corpus table: Accessible
✅ maya_training_metrics table: Accessible
```

**Good news:** PersonalOracleAgent doesn't actually need this table. It's for optional enhanced memory (mem0).

**But:** Let's create it anyway so the system check passes 100%.

---

## Quick Fix (2 minutes)

### Option 1: Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project
   - Click **SQL Editor** in left sidebar

2. **Run This SQL:**

```sql
-- Create semantic_memories table (simple version)
CREATE TABLE IF NOT EXISTS public.semantic_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  memory_type TEXT DEFAULT 'episodic',
  importance FLOAT DEFAULT 0.5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  access_count INTEGER DEFAULT 0
);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_semantic_memories_user_id
  ON public.semantic_memories(user_id);

-- Create index for memory type filtering
CREATE INDEX IF NOT EXISTS idx_semantic_memories_type
  ON public.semantic_memories(memory_type);

-- Enable Row Level Security
ALTER TABLE public.semantic_memories ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own memories
CREATE POLICY IF NOT EXISTS "Users can view own memories"
  ON public.semantic_memories
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Create policy: Users can insert their own memories
CREATE POLICY IF NOT EXISTS "Users can insert own memories"
  ON public.semantic_memories
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Grant access
GRANT SELECT, INSERT, UPDATE ON public.semantic_memories TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.semantic_memories TO anon;
```

3. **Click RUN** (green button)

4. **Verify:**
```bash
npm run maia:check
```

You should now see:
```
✅ semantic_memories table: Accessible
```

---

### Option 2: Command Line (If you prefer)

```bash
# From project root
cd /Volumes/T7\ Shield/Projects/SpiralogicOracleSystem

# Copy SQL file to clipboard (Mac)
cat scripts/create-semantic-memories-simple.sql | pbcopy

# Then paste in Supabase Dashboard SQL Editor
```

---

## After Creation

Run the check again:
```bash
npm run maia:check
```

**Expected output:**
```
✅ Supabase URL: Configured
✅ Supabase Anon Key: Configured
✅ OpenAI API Key: Configured
✅ semantic_memories table: Accessible
✅ maya_training_corpus table: Accessible
✅ maya_training_metrics table: Accessible
✅ MAIA API endpoint: Responding

Total Checks: 7
✅ Passed: 7
⚠️  Warnings: 0
❌ Failed: 0

✅ SYSTEM READY FOR LAUNCH
```

---

## Why This Table Exists

**semantic_memories** is for optional enhanced memory features:
- Semantic clustering of conversation themes
- Long-term memory consolidation
- Future integration with mem0 or similar

**Current system (PersonalOracleAgent) uses:**
- `memory_events` table (which you already have)
- `maya_training_corpus` (for apprentice training)
- `maya_training_metrics` (for progress tracking)

**So this is optional, but good to have for future features.**

---

## Once Done

You'll be 100% ready for tomorrow's activation! ✅

**Next step:** Get some sleep. Tomorrow at 7:00 AM, follow TOMORROW_ACTIVATION_PLAN.md 🚀
