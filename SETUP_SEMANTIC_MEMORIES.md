# Setup semantic_memories Table

The `semantic_memories` table is required for MAIA's memory system.

## Quick Setup

### Option 1: Automated Script (Try First)
```bash
npm run maia:setup-db
```

If this works, you're done! ✅

### Option 2: Manual Setup (Recommended if script fails)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Navigate to **SQL Editor**

2. **Run the SQL**
   - Copy the contents of `scripts/create-semantic-memories-simple.sql`
   - Paste into SQL Editor
   - Click **Run**

3. **Verify**
   ```bash
   npm run maia:check
   ```

   You should now see:
   ```
   ✅ semantic_memories table: Accessible
   ```

## What Gets Created

The table structure:
```sql
CREATE TABLE semantic_memories (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  memory_type TEXT DEFAULT 'episodic',
  importance FLOAT DEFAULT 0.5,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  accessed_at TIMESTAMPTZ,
  access_count INTEGER
);
```

## Files Reference

| File | Purpose |
|------|---------|
| `scripts/create-semantic-memories-simple.sql` | Simple SQL (no dependencies) |
| `scripts/create-semantic-memories-table.sql` | Full version with vector support |
| `scripts/setup-semantic-memories.ts` | Automated setup script |

## Troubleshooting

### "exec_sql function does not exist"
This is normal. Use **Option 2** (manual setup) instead.

### "permission denied"
Make sure you're using the service role key or run via Supabase Dashboard.

### Table already exists
That's fine! The script is idempotent.

## After Setup

Once the table is created, run:
```bash
npm run maia:check
```

You should see all green:
```
✅ Supabase URL: Configured
✅ Supabase Anon Key: Configured
✅ OpenAI API Key: Configured
✅ semantic_memories table: Accessible
✅ maya_training_corpus table: Accessible
✅ maya_training_metrics table: Accessible
✅ MAIA API endpoint: Responding
```

Then you're ready to launch! 🚀
