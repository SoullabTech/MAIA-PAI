# 🚨 URGENT: Memory Capture System Fix Required

## Issue Summary
**CRITICAL**: No memories have been recorded for the past 3 days of beta testing!

The `memory_events` table in Supabase is missing the `content` and `session_id` columns, causing all memory capture attempts to fail silently.

## Root Cause
1. ✅ Memory capture code is correctly integrated in `/app/api/oracle/personal/route.ts` (lines 121-143)
2. ✅ Simple Memory Capture service exists and is working
3. ❌ Supabase `memory_events` table schema is incomplete/cached incorrectly
4. ❌ PostgREST schema cache is out of sync with actual table

## Immediate Fix Required

### Step 1: Fix Supabase Table Schema
Go to your Supabase Dashboard → SQL Editor and run this SQL:

\`\`\`sql
-- Add missing columns to memory_events table
ALTER TABLE memory_events ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE memory_events ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE memory_events ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Ensure memory_type column exists
ALTER TABLE memory_events ADD COLUMN IF NOT EXISTS memory_type TEXT NOT NULL DEFAULT 'general';

-- Refresh PostgREST schema cache (CRITICAL)
NOTIFY pgrst, 'reload schema';

-- Verify columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'memory_events'
ORDER BY ordinal_position;
\`\`\`

### Step 2: Verify Fix
After running the SQL, execute this to verify:

\`\`\`bash
npx tsx scripts/check-actual-schema.ts
\`\`\`

You should see: ✅ Insert successful!

### Step 3: Test Memory Capture
\`\`\`bash
npx tsx scripts/test-memory-capture-now.ts
\`\`\`

Expected output: Should show memories being saved and metrics > 0

### Step 4: Check Real Memories
\`\`\`bash
npx tsx scripts/check-memory-events.ts
\`\`\`

## What Was Fixed in Code

### 1. Fixed Supabase Client Initialization
**File**: `lib/services/simple-memory-capture.ts`

Changed from:
\`\`\`typescript
const supabase = createClient(...)  // Created at module load time
\`\`\`

To:
\`\`\`typescript
function getSupabase() {  // Lazy-loaded to ensure env vars available
  if (!supabaseClient) {
    supabaseClient = createClient(...)
  }
  return supabaseClient;
}
\`\`\`

### 2. All Scripts Now Use .env.local
Updated all test/setup scripts to load `.env.local`:
- `scripts/setup-real-beta.ts`
- `scripts/check-memory-tables.ts`
- `scripts/check-memory-events.ts`

## After Fix: How Memory Capture Works

### When a User Chats with MAIA:
1. User sends message to `/app/maya/page.tsx`
2. Message goes to `/app/api/oracle/personal/route.ts`
3. PersonalOracleAgent generates response
4. **Line 135-143**: `simpleMemoryCapture.capture()` is called
5. Memory events saved to Supabase `memory_events` table:
   - Key moments (transformative conversations)
   - Emotional tags (joy, fear, peace, etc.)
   - Patterns detected (breakthrough moments, vulnerability)

### Memory Types Captured:
- `key_moment`: Important transformative moments
- `emotional_tag`: Emotional resonance detected
- `pattern`: Recurring behavioral/thought patterns

## Verification Checklist

- [ ] Run SQL in Supabase Dashboard
- [ ] Verify schema with `npx tsx scripts/check-actual-schema.ts`
- [ ] Test memory capture with `npx tsx scripts/test-memory-capture-now.ts`
- [ ] Check real memories with `npx tsx scripts/check-memory-events.ts`
- [ ] Have Kelly (or another beta tester) send a message
- [ ] Verify new memory appears in database

## Production Deployment Note

If this is deployed to Vercel:
1. Environment variables are correctly configured (verified)
2. The schema fix must be applied in Supabase Dashboard
3. No code deployment needed - memory capture is already integrated
4. Memories will start recording immediately after schema fix

## Contact
If any issues persist after applying this fix, check:
1. Supabase connection in Vercel logs
2. Memory capture error logs in API route
3. PostgREST schema cache refresh
