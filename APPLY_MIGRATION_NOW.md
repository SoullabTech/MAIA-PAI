# 🌟 Apply Birth Chart Migration - Step by Step

## Quick 3-Step Process

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your MAIA-PAI project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy the SQL
Copy everything below (click the copy button):

```sql
-- Add Birth Chart fields to explorers table
-- This enables persistent astrology data for all beta testers

-- Birth data (what the user entered)
ALTER TABLE explorers ADD COLUMN IF NOT EXISTS birth_date TEXT;
ALTER TABLE explorers ADD COLUMN IF NOT EXISTS birth_time TEXT;
ALTER TABLE explorers ADD COLUMN IF NOT EXISTS birth_location_name TEXT;
ALTER TABLE explorers ADD COLUMN IF NOT EXISTS birth_latitude FLOAT;
ALTER TABLE explorers ADD COLUMN IF NOT EXISTS birth_longitude FLOAT;
ALTER TABLE explorers ADD COLUMN IF NOT EXISTS birth_timezone TEXT;

-- Calculated chart data (the computed astrology)
-- Using JSONB for flexible storage of complex chart data
ALTER TABLE explorers ADD COLUMN IF NOT EXISTS birth_chart_data JSONB;

-- Metadata
ALTER TABLE explorers ADD COLUMN IF NOT EXISTS birth_chart_calculated_at TIMESTAMP;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_explorers_birth_date ON explorers(birth_date);
CREATE INDEX IF NOT EXISTS idx_explorers_birth_chart_calculated ON explorers(birth_chart_calculated_at);

-- Add comment for documentation
COMMENT ON COLUMN explorers.birth_chart_data IS 'Complete calculated birth chart including planets, houses, aspects, elemental balance - stored as JSONB for flexibility';
```

### Step 3: Run It
1. Paste the SQL into the query editor
2. Click **Run** (or press Cmd/Ctrl + Enter)
3. You should see "Success. No rows returned" ✅

That's it! The migration is complete.

## Verification

Run this query to verify the columns were added:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'explorers'
  AND column_name LIKE 'birth_%'
ORDER BY column_name;
```

You should see 8 rows returned:
- birth_chart_calculated_at (timestamp)
- birth_chart_data (jsonb)
- birth_date (text)
- birth_latitude (double precision)
- birth_location_name (text)
- birth_longitude (double precision)
- birth_time (text)
- birth_timezone (text)

## What Happens Next?

✨ **Magic activated!** Now when beta testers:

1. Visit `/astrology` and enter their birth data
2. The chart calculates AND saves to the database
3. On refresh/new device → chart loads instantly from database
4. Their Archetypal Field Map shows their actual astrological information
5. Mission dots appear in the correct houses based on their natal chart

## Test It

Try with Jamie Cordero (or any beta tester):

1. Have them visit: `https://[your-domain]/astrology`
2. Enter birth data
3. Chart appears + saves to database
4. Refresh page → Loads instantly!
5. Try on phone → Same chart!

Check the database:
```sql
SELECT
  explorer_name,
  email,
  birth_location_name,
  birth_chart_calculated_at,
  birth_chart_data IS NOT NULL as has_chart
FROM explorers
WHERE birth_chart_data IS NOT NULL;
```

---

**Status**: Ready to run!
**Time**: ~30 seconds
**Risk**: Zero (migration is non-destructive and uses IF NOT EXISTS)
