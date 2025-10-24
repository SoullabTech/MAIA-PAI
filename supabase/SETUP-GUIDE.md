# Supabase Setup Guide for Genesis

## Quick Setup (Choose One)

### Option A: Use Existing Supabase Project

If you already have a Supabase project for MAIA-PAI:

1. **Go to your Supabase dashboard:** https://app.supabase.com
2. **Select your project**
3. **Go to SQL Editor**
4. **Copy and paste the entire contents of** `migrations/20251024_genesis_tables.sql`
5. **Click "Run"**
6. **Verify tables were created** - Check the Table Editor

### Option B: Create New Supabase Project

1. **Go to** https://app.supabase.com
2. **Click "New Project"**
3. **Name it:** `genesis-soullab` (or whatever you prefer)
4. **Choose region** closest to your users
5. **Set strong database password** (save it!)
6. **Wait for project to be created** (~2 minutes)
7. **Follow steps from Option A** to run the migration

---

## Get Your Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy these values:

```bash
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Anon Key (safe for client-side)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (KEEP SECRET - server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Add to Environment Variables

1. **Create `.env.local` in the project root if it doesn't exist**

2. **Add these lines:**

```bash
# Supabase Configuration for Genesis
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Genesis Configuration
GENESIS_ADMIN_EMAIL=genesis@soullab.ai
```

3. **Restart your development server**

---

## Run the Migration

### Method 1: Supabase Dashboard (Easiest)

1. Open **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy entire contents of `supabase/migrations/20251024_genesis_tables.sql`
4. Paste and click **Run**
5. Check for success message

### Method 2: Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Initialize Supabase in your project
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

## Verify Tables Were Created

Go to **Table Editor** in Supabase dashboard and check for:

- ✅ `genesis_nodes`
- ✅ `genesis_profiles`
- ✅ `genesis_covenants`
- ✅ `genesis_onboarding`
- ✅ `genesis_events`

Each table should have the correct columns and policies.

---

## Test the Setup

Run this query in SQL Editor to verify everything works:

```sql
-- Test query
SELECT
  tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE 'genesis_%'
ORDER BY tablename;
```

You should see 5 tables returned.

---

## Enable Row Level Security (Already Done)

The migration automatically:
- ✅ Enables RLS on all tables
- ✅ Creates policies for public read access
- ✅ Creates policies for service role full access

---

## Next Steps

Once Supabase is set up:

1. **Update API routes** - Uncomment Supabase code in `app/api/genesis/route.ts`
2. **Install Supabase client** - `npm install @supabase/supabase-js` (if not already installed)
3. **Test endpoints** - Try creating a covenant signature
4. **Monitor logs** - Check Supabase dashboard logs

---

## Troubleshooting

### "relation already exists" error

If you see this error, it means tables were already created. You can either:

1. **Drop existing tables** (if starting fresh):
```sql
DROP TABLE IF EXISTS genesis_events CASCADE;
DROP TABLE IF EXISTS genesis_onboarding CASCADE;
DROP TABLE IF EXISTS genesis_covenants CASCADE;
DROP TABLE IF EXISTS genesis_profiles CASCADE;
DROP TABLE IF EXISTS genesis_nodes CASCADE;
```

2. **Or skip the migration** if tables are already correct

### RLS policies blocking access

If you get permission errors:

1. Check that you're using the **service role key** in your API routes
2. Verify RLS policies are correct in **Authentication** → **Policies**
3. Service role should bypass RLS automatically

### Connection errors

1. Verify `.env.local` has correct credentials
2. Check Supabase project status (should be "Active")
3. Restart your dev server after adding env vars

---

## Security Notes

⚠️ **IMPORTANT:**

- **NEVER** commit `.env.local` to git
- **NEVER** expose service role key in client-side code
- **ALWAYS** use anon key for client-side operations
- **ALWAYS** use service role key for server-side operations

The migration includes RLS policies to ensure:
- Public can only read active, public nodes
- Service role (your API) can do everything
- Regular users cannot modify data directly

---

## What Each Table Does

### `genesis_nodes`
Core node configuration - name, tradition, tier, status, domain

### `genesis_profiles`
Personal information - story, practice, location, elemental balance

### `genesis_covenants`
Covenant signatures - who signed, when, version, blockchain hash

### `genesis_onboarding`
Tracks onboarding progress - which step, form data, completion status

### `genesis_events`
Audit log - all significant events in a node's lifecycle

---

## Ready to Connect API

Once Supabase is set up and env vars are configured:

1. Open `app/api/genesis/route.ts`
2. Uncomment all the Supabase code (look for `// TODO:` comments)
3. Import Supabase client:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```
4. Test the endpoints!

---

## Support

Questions? Check:
- Supabase Docs: https://supabase.com/docs
- Genesis Deployment Guide: `public/genesis-soullab-life/DEPLOYMENT-GUIDE.md`
- Email: genesis@soullab.ai

---

**Your Genesis database is ready to power the movement!** 🜂
