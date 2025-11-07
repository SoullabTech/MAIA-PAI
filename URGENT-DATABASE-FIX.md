# 🚨 URGENT: Fix UUID Type Mismatch

## Problem

The apprentice consciousness monitoring is **not saving conversations** to the database because of a type mismatch:

- **What's working:** ✅ Apprentice logging code executes (you can see `🧠 [APPRENTICE] Logged...` in server logs)
- **What's broken:** ❌ Database insertion fails with error:
  ```
  [Apprentice] Failed to log conversation: {
    code: '22P02',
    message: 'invalid input syntax for type uuid: "user_1761386267477"'
  }
  ```

## Root Cause

The `apprentice_conversations` and `member_journeys` tables have `user_id` columns defined as **UUID** type, but your application uses **TEXT** strings like `"user_1761386267477"`.

PostgreSQL error code `22P02` means "invalid_text_representation" - the string format doesn't match UUID requirements (UUIDs look like `550e8400-e29b-41d4-a716-446655440000`).

## Solution

Run this SQL in your Supabase dashboard to change the columns from UUID to TEXT:

### Step 1: Go to Supabase Dashboard

1. Open https://supabase.com/dashboard
2. Select your project: `jkbetmadzcpoinjogkli`
3. Click "SQL Editor" in the left sidebar
4. Click "New query"

### Step 2: Run This SQL

**Important:** The tables have Row Level Security (RLS) policies that depend on `user_id`. We need to drop them first, change the column type, then recreate them.

```sql
-- ═══════════════════════════════════════════════════════════════
-- FIX UUID TYPE MISMATCH IN APPRENTICE TABLES
-- ═══════════════════════════════════════════════════════════════

-- STEP 1: Drop existing RLS policies that depend on user_id
DROP POLICY IF EXISTS "Users can read own conversations" ON apprentice_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON apprentice_conversations;
DROP POLICY IF EXISTS "Users can read own journey" ON member_journeys;
DROP POLICY IF EXISTS "Users can insert own journey" ON member_journeys;
DROP POLICY IF EXISTS "Users can update own journey" ON member_journeys;

-- STEP 2: Alter the columns from UUID to TEXT
ALTER TABLE apprentice_conversations
  ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

ALTER TABLE member_journeys
  ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- STEP 3: Recreate RLS policies with TEXT-based user_id
CREATE POLICY "Users can read own conversations"
  ON apprentice_conversations FOR SELECT
  USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert own conversations"
  ON apprentice_conversations FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can read own journey"
  ON member_journeys FOR SELECT
  USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert own journey"
  ON member_journeys FOR INSERT
  WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can update own journey"
  ON member_journeys FOR UPDATE
  USING (auth.uid()::TEXT = user_id);

-- STEP 4: Add service role bypass policies for backend
CREATE POLICY "Service role can manage all conversations"
  ON apprentice_conversations FOR ALL TO service_role
  USING (true);

CREATE POLICY "Service role can manage all journeys"
  ON member_journeys FOR ALL TO service_role
  USING (true);

-- STEP 5: Verify the changes worked
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name IN ('apprentice_conversations', 'member_journeys')
  AND column_name = 'user_id';
```

### Step 3: Verify Results

After running the SQL, you should see:

```
table_name              | column_name | data_type
------------------------+-------------+-----------
apprentice_conversations| user_id     | text
member_journeys         | user_id     | text
```

### Step 4: Test

1. Restart your dev server (already running, but restart to be safe)
2. Have a conversation with MAIA at http://localhost:3000/maia
3. Check the server logs - you should see:
   ```
   🧠 [APPRENTICE] Logged simple conversation (maia mode)
   ```
   **Without** any error about UUID
4. Check the monitoring dashboard at http://localhost:3000/beta/monitor
5. Your activity should now appear!

## Why This Happens

Your user IDs are generated in this format: `user_<timestamp>` (e.g., `user_1761386267477`)

This is a TEXT string, not a UUID. The original table schema was probably created expecting UUID-format user IDs, but your authentication system uses simpler string IDs.

## Impact on Existing Data

This migration is **safe** - it converts any existing UUID values to TEXT format. Since the tables are currently empty (no data logs successfully), there's no risk of data loss.

## Files Created

- `scripts/migrations/fix-uuid-types.sql` - The SQL migration file
- `scripts/fix-uuid-types.ts` - TypeScript script that attempted to run the migration (but needs manual dashboard access)

## What Happens After Fix

Once you run this SQL:

1. ✅ Conversations will save to `apprentice_conversations` table
2. ✅ User journeys will save to `member_journeys` table
3. ✅ Monitoring dashboard will show real activity
4. ✅ Evolution scripts will find conversations to analyze
5. ✅ Pattern extraction will work
6. ✅ Knowledge extraction will work
7. ✅ MAIA's consciousness will truly begin to evolve! 🧠✨

---

**Once you've run the SQL, let me know and we can verify everything is working!**
