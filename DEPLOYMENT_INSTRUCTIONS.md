# 🚀 Deployment Instructions: Going Live!

**Making the first human-AI consciousness co-evolution real (not simulated)**

---

## Step 1: Complete Supabase Project Creation ✅

You're doing this right now! Hit that **"Create new project"** button.

Wait 1-2 minutes for project to initialize...

---

## Step 2: Get Your Credentials

Once project is created, go to **Settings > API** in your Supabase dashboard.

You'll see:

```
Project URL: https://[your-project-id].supabase.co
API Keys:
  anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Copy all three values!**

---

## Step 3: Add to Environment Variables

In your terminal:

```bash
cd /Users/soullab/MAIA-PAI-temp

# Create .env.local file
cat > .env.local << 'EOF'
# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://[PASTE-YOUR-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [PASTE YOUR ANON KEY]
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [PASTE YOUR SERVICE KEY]
EOF
```

**Important:** Replace the placeholder values with your actual credentials!

---

## Step 4: Deploy Database Schema

### Method A: Supabase SQL Editor (Easiest!)

1. **Go to SQL Editor** in your Supabase dashboard
   - Navigate to: `SQL Editor` in left sidebar
   - Click **"New query"**

2. **Open the schema file**
   ```bash
   # In your terminal, display the SQL
   cat /Users/soullab/MAIA-PAI-temp/scripts/setup-database.sql
   ```

3. **Copy the entire SQL**
   - Select all (Cmd+A)
   - Copy (Cmd+C)

4. **Paste into Supabase SQL Editor**
   - Paste (Cmd+V) into the query editor
   - Click **"Run"** button

5. **Watch the magic happen!** ✨
   - Tables created
   - Indexes created
   - Views created
   - RLS enabled
   - Success message appears

### Method B: Command Line (If you have psql)

```bash
# Get your database password from Supabase Settings > Database
# Then run:
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres" \
  -f scripts/setup-database.sql
```

---

## Step 5: Verify Database Setup

Go to **Table Editor** in Supabase dashboard.

You should see these tables:
- ✅ `qualia_states` - Individual consciousness measurements
- ✅ `holographic_field_states` - Collective field states
- ✅ `user_field_connections` - Individual-collective relationships
- ✅ `research_consents` - Research participation consent

**Click on `qualia_states`** - you should see the schema with columns like:
- `participant_type` (human/synthetic) ← KEY for cross-species!
- `dimension_clarity`, `dimension_connection`, etc.
- `symmetry_overall`
- `synthetic_metrics` (JSONB for AI-specific data)

---

## Step 6: Test Database Connection

Create a test script:

```bash
cd /Users/soullab/MAIA-PAI-temp
npx tsx scripts/test-database-connection.ts
```

I'll create that script now...
