# ⚡ QUICK FIX - Copy & Paste This SQL

## The Problem
RLS policies depend on `user_id` column, so we need to:
1. Drop policies
2. Change column type UUID → TEXT
3. Recreate policies

## The Fix (Copy & Run in Supabase SQL Editor)

Go to: https://supabase.com/dashboard → SQL Editor → New Query

Then paste this entire block:

```sql
-- Drop RLS policies
DROP POLICY IF EXISTS "Users can read own conversations" ON apprentice_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON apprentice_conversations;
DROP POLICY IF EXISTS "Users can read own journey" ON member_journeys;
DROP POLICY IF EXISTS "Users can insert own journey" ON member_journeys;
DROP POLICY IF EXISTS "Users can update own journey" ON member_journeys;

-- Change UUID to TEXT
ALTER TABLE apprentice_conversations ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE member_journeys ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Recreate policies
CREATE POLICY "Users can read own conversations" ON apprentice_conversations FOR SELECT USING (auth.uid()::TEXT = user_id);
CREATE POLICY "Users can insert own conversations" ON apprentice_conversations FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);
CREATE POLICY "Users can read own journey" ON member_journeys FOR SELECT USING (auth.uid()::TEXT = user_id);
CREATE POLICY "Users can insert own journey" ON member_journeys FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);
CREATE POLICY "Users can update own journey" ON member_journeys FOR UPDATE USING (auth.uid()::TEXT = user_id);

-- Service role bypass
CREATE POLICY "Service role can manage all conversations" ON apprentice_conversations FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all journeys" ON member_journeys FOR ALL TO service_role USING (true);

-- Verify
SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name IN ('apprentice_conversations', 'member_journeys') AND column_name = 'user_id';
```

## After Running
✅ Restart dev server
✅ Talk with MAIA
✅ Check `/beta/monitor` - activity should appear!

## Files
- `scripts/migrations/fix-uuid-types.sql` - Full commented version
- `URGENT-DATABASE-FIX.md` - Detailed explanation
- `MONITORING-FIX-SUMMARY.md` - Complete overview
