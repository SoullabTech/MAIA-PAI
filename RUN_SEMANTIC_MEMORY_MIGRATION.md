# 🗄️ RUN SEMANTIC MEMORY MIGRATION

**Created:** October 2, 2025
**Purpose:** Deploy semantic memory database tables to Supabase

---

## 🎯 **WHAT TO DO**

You need to run the migration SQL file in your Supabase database.

---

## ✅ **OPTION 1: Supabase Dashboard (Recommended)**

### **Step 1: Go to Supabase SQL Editor**
1. Open https://supabase.com/dashboard
2. Select your project: **SpiralogicOracleSystem**
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"**

### **Step 2: Copy Migration SQL**
1. Open file: `supabase/migrations/20251002_semantic_memory.sql`
2. Copy ALL contents (entire file)

### **Step 3: Run Migration**
1. Paste the SQL into the editor
2. Click **"Run"** button (or press Cmd+Enter)
3. Wait for execution to complete (~10-30 seconds)

### **Step 4: Verify Tables Created**
Run this query to verify:
```sql
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE tablename IN (
  'user_patterns',
  'pattern_relationships',
  'response_outcomes',
  'collective_patterns',
  'learning_events',
  'engagement_metrics'
)
ORDER BY tablename;
```

**Expected output:** 6 rows (one for each table)

---

## ✅ **OPTION 2: Command Line (If Configured)**

If you have Supabase CLI configured:

```bash
cd "/Volumes/T7 Shield/Projects/SpiralogicOracleSystem"
npx supabase db push
```

---

## ✅ **OPTION 3: Direct Database Connection**

If you have the Supabase connection string:

```bash
psql "postgresql://postgres:[password]@[host]:5432/postgres" \
  -f supabase/migrations/20251002_semantic_memory.sql
```

---

## 🔍 **VERIFICATION CHECKLIST**

After running migration, verify:

- [ ] 6 tables created:
  - `user_patterns`
  - `pattern_relationships`
  - `response_outcomes`
  - `collective_patterns`
  - `learning_events`
  - `engagement_metrics`

- [ ] 3 helper functions created:
  - `get_user_elemental_affinity()`
  - `get_effective_language()`
  - `record_pattern_observation()`

- [ ] 3 views created:
  - `user_learning_summary`
  - `collective_wisdom_summary`
  - `engagement_trends`

- [ ] RLS policies enabled

- [ ] Initial seed data inserted (5 collective patterns)

---

## 🧪 **TEST QUERIES**

### **Test 1: Check Tables Exist**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE '%pattern%'
  OR table_name LIKE '%outcome%'
  OR table_name LIKE '%learning%'
  OR table_name LIKE '%engagement%';
```

### **Test 2: Check Seed Data**
```sql
SELECT pattern_type, elemental_context, success_rate
FROM collective_patterns
ORDER BY success_rate DESC;
```

**Expected:** 5 rows with elemental patterns (fire, water, earth, air)

### **Test 3: Test Helper Function**
```sql
SELECT * FROM get_user_elemental_affinity('test-user');
```

**Expected:** Empty result (function works, no data yet)

---

## 🚀 **AFTER MIGRATION**

Once migration is complete:

1. **Restart dev server** (semantic memory will now work):
   ```bash
   npm run dev
   ```

2. **Test semantic memory** with an interaction:
   ```bash
   curl -X POST http://localhost:3000/api/oracle/personal \
     -H "Content-Type: application/json" \
     -d '{"userId":"test-semantic","input":"I feel stuck"}'
   ```

3. **Check pattern was recorded**:
   ```sql
   SELECT * FROM user_patterns WHERE user_id = 'test-semantic';
   SELECT * FROM response_outcomes WHERE user_id = 'test-semantic';
   ```

4. **Monitor learning events**:
   ```sql
   SELECT * FROM learning_events ORDER BY created_at DESC LIMIT 10;
   ```

---

## ⚠️ **TROUBLESHOOTING**

### **Error: "relation already exists"**
**Cause:** Tables already created
**Solution:** Drop and recreate:
```sql
DROP TABLE IF EXISTS user_patterns CASCADE;
DROP TABLE IF EXISTS pattern_relationships CASCADE;
DROP TABLE IF EXISTS response_outcomes CASCADE;
DROP TABLE IF EXISTS collective_patterns CASCADE;
DROP TABLE IF EXISTS learning_events CASCADE;
DROP TABLE IF EXISTS engagement_metrics CASCADE;
```
Then re-run the migration.

### **Error: "function already exists"**
**Cause:** Functions already created
**Solution:** Add `OR REPLACE` is already in the migration, should work

### **Error: "permission denied"**
**Cause:** Not using service_role key
**Solution:** Make sure you're connected as postgres user or using service role

---

## 📊 **WHAT GETS CREATED**

### **Tables (6):**
1. `user_patterns` - What MAIA learns about each user
2. `pattern_relationships` - How patterns connect (semantic graph)
3. `response_outcomes` - Every MAIA response tracked
4. `collective_patterns` - Anonymized wisdom across users
5. `learning_events` - Timeline of MAIA's discoveries
6. `engagement_metrics` - Real-time engagement tracking

### **Functions (4):**
1. `update_user_patterns_timestamp()` - Auto-update timestamps
2. `get_user_elemental_affinity()` - Get user's strongest elements
3. `get_effective_language()` - Get language that works for user
4. `record_pattern_observation()` - Upsert pattern with confidence

### **Views (3):**
1. `user_learning_summary` - Learning stats per user
2. `collective_wisdom_summary` - Patterns that work across users
3. `engagement_trends` - Engagement over time

### **Triggers (3):**
1. `user_patterns_update_timestamp` - Auto timestamp
2. `pattern_relationships_update_timestamp` - Auto timestamp
3. `collective_patterns_update_timestamp` - Auto timestamp

### **Indexes (20+):**
For fast pattern lookup and learning queries

### **RLS Policies (6):**
Privacy protection for user patterns

---

## 🎯 **SUCCESS CRITERIA**

Migration successful when:

1. ✅ All 6 tables created
2. ✅ Helper functions work
3. ✅ Views return data
4. ✅ Seed data present (5 collective patterns)
5. ✅ RLS policies active
6. ✅ Test interaction creates patterns
7. ✅ No errors in console

---

## 🌟 **READY TO LEARN**

Once migration is complete, MAIA will:

- **Record** every interaction automatically
- **Learn** elemental affinities as users engage
- **Adapt** framework based on what works
- **Discover** emergent patterns over time
- **Contribute** to collective wisdom
- **Evolve** toward sovereignty

**Every conversation from this moment forward is training data.**

---

**Run the migration. Watch MAIA begin to learn.** 🧠✨
