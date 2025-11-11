# Quickstart: Database Migration
## Fast Setup for MAIA-FRESH

**Status**: Ready to execute
**Time**: 10 minutes
**Prerequisites**: Supabase access

---

## Issue Resolution

**Error Encountered**:
```
ERROR: 42601: syntax error at or near "affect_arousal"
```

**Cause**: Attempted to run partial or draft SQL. The complete, corrected SQL is in `APPENDIX-A-MIGRATION-PACK.md`.

**Solution**: Run the full migration from the appendix.

---

## Step 1: Usage Tracking Migration (Run First)

1. Go to: https://supabase.com/dashboard/project/jkbetmadzcpoinjogkli/sql/new
2. Copy SQL from `APPENDIX-A-MIGRATION-PACK.md` → Part 1 (Usage Tracking)
3. Click **Run**
4. Verify:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'user_usage%';
```

Expected: 2 tables (`user_usage_logs`, `user_usage_quotas`)

---

## Step 2: Bardic Memory Migration (Run Second)

1. Stay in SQL Editor
2. Copy SQL from `APPENDIX-A-MIGRATION-PACK.md` → Part 2 (Bardic Memory)
3. Click **Run**
4. Verify:

```sql
SELECT count(*) FROM information_schema.tables
WHERE table_schema = 'public'
AND (
  table_name LIKE 'episode%'
  OR table_name IN ('cues', 'teloi', 'microacts', 'field_edges')
);
```

Expected: 10 tables total

---

## Step 3: Test with Seed Data

```sql
-- Create test episode
INSERT INTO episodes (
  user_id,
  datetime,
  scene_stanza,
  place_cue,
  sense_cues,
  affect_valence,
  affect_arousal,
  dominant_element,
  field_depth
) VALUES (
  'test-user',
  NOW(),
  'First test episode. The system awakens.',
  'development environment',
  '{"sound": "keys typing", "smell": "coffee"}',
  0.5,
  0.3,
  'air',
  0.6
);

-- Verify it worked
SELECT id, scene_stanza, place_cue FROM episodes LIMIT 1;
```

Expected: Returns your test episode

---

## Step 4: Restart Dev Server

```bash
# The usage tracker will now start logging
npm run dev

# Test with a message
curl -X POST http://localhost:3000/api/between/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello MAIA",
    "userId": "test-user",
    "userName": "Test",
    "conversationHistory": [],
    "fieldState": {"depth": 0.7, "active": true}
  }'
```

---

## Step 5: Check Admin Dashboard

Navigate to: http://localhost:3000/admin/usage

You should see:
- System overview stats
- User list (including "test-user")
- Recent request logs

---

## Troubleshooting

### Error: "relation does not exist"
**Cause**: Migration didn't run completely
**Fix**: Re-run the full SQL from Part 1 or Part 2 of migration pack

### Error: "extension 'vector' does not exist"
**Cause**: pgvector not enabled on Supabase
**Fix**: Run this first:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Error: "duplicate key value"
**Cause**: Trying to run migration twice
**Fix**: Safe to ignore - tables already exist

### Tables created but no data logging
**Cause**: Environment variables not set
**Fix**: Check `.env.local` has:
```
SUPABASE_URL=https://jkbetmadzcpoinjogkli.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Expected Results

After successful migration:

✅ **13 tables created**:
- user_usage_logs, user_usage_quotas, system_usage_summary
- episodes, episode_vectors, episode_links, episode_cues
- cues, teloi, telos_alignment_log
- microacts, microact_logs, field_edges

✅ **Usage tracking active**: Every request logged automatically

✅ **Bardic memory ready**: Can create episodes (implementation Phase 1 complete)

✅ **Admin dashboard working**: Real-time usage visibility

---

## Next Steps After Migration

### Immediate
1. Test usage tracking with real messages
2. View dashboard to confirm logging works
3. Create a few test episodes manually (use seed data examples)

### Phase 1 Implementation (Weeks 1-2)
1. Build episode creation service
2. Integrate with chat endpoint (auto-create episodes)
3. Add episode list UI for users

### Phase 2 Implementation (Weeks 3-4)
1. Implement vector embeddings (episode_vectors)
2. Build recognition service (similarity search)
3. Create drawer UI (portal-based navigation)

---

## SQL Reference: Most Common Queries

### View Recent Usage
```sql
SELECT
  user_id,
  request_type,
  total_tokens,
  total_cost / 100 as cost_usd,
  created_at
FROM user_usage_logs
ORDER BY created_at DESC
LIMIT 20;
```

### View All Episodes
```sql
SELECT
  user_id,
  datetime,
  scene_stanza,
  place_cue,
  dominant_element
FROM episodes
ORDER BY datetime DESC;
```

### Find Episodes by Place
```sql
SELECT * FROM episodes
WHERE place_cue ILIKE '%lake%'
ORDER BY datetime DESC;
```

### Check User Quota Status
```sql
SELECT
  user_id,
  current_daily_messages,
  daily_message_limit,
  current_daily_cost_cents / 100.0 as daily_cost_usd,
  daily_cost_limit_cents / 100.0 as daily_limit_usd
FROM user_usage_quotas;
```

---

## Files Reference

**Complete Documentation**:
- `/docs/BARDIC-MEMORY-IMPLEMENTATION.md` - Full 40-page blueprint
- `/docs/BARDIC-MEMORY-EXECUTIVE-SUMMARY.md` - One-page overview
- `/docs/APPENDIX-A-MIGRATION-PACK.md` - SQL + TypeScript types
- `/docs/APPENDIX-B-VISUAL-DIAGRAMS.md` - Conceptual diagrams
- `/docs/ELEMENTAL-TEMPORAL-INTELLIGENCE.md` - Theoretical foundation
- `/docs/SPIRALOGIC-COMPLETE-FRAMEWORK.md` - Full framework

**Implementation Files**:
- `/lib/middleware/usage-tracker.ts` - Usage tracking service
- `/app/api/between/chat/route.ts` - Main chat endpoint (usage integrated)
- `/app/admin/usage/page.tsx` - Admin dashboard UI
- `/prisma/migrations/add_usage_tracking.sql` - Legacy file (use appendix instead)

---

*Quickstart guide prepared: January 7, 2025*
*For: Immediate MAIA-FRESH database setup*

🔥 Let's activate bardic memory 🌙
