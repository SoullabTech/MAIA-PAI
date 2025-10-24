# Apply Birth Chart Migration

This migration adds persistent birth chart storage to the `explorers` table in Supabase.

## Quick Start (Recommended)

### Option 1: Use Supabase Dashboard (Easiest!)

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `db/migrations/add-birth-chart-to-explorers.sql`
5. Paste into the SQL editor
6. Click **Run** ▶️

That's it! The migration will add the following columns to the `explorers` table:
- `birth_date` - Date of birth
- `birth_time` - Time of birth
- `birth_location_name` - City/place name
- `birth_latitude` - Geographic latitude
- `birth_longitude` - Geographic longitude
- `birth_timezone` - IANA timezone (e.g., "America/New_York")
- `birth_chart_data` - Complete calculated chart (JSONB)
- `birth_chart_calculated_at` - Timestamp of calculation

### Option 2: Use CLI Script

```bash
npx dotenv -e .env.local -- npx tsx scripts/apply-birth-chart-migration.ts
```

This will attempt to apply the migration programmatically using the Supabase service role key.

## Verification

After applying the migration, verify it worked:

```sql
-- Check that columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'explorers'
  AND column_name LIKE 'birth_%';
```

You should see 8 new columns returned.

## Test the Feature

1. Visit `/astrology` page
2. Enter your birth data (date, time, location)
3. The chart will be calculated AND saved to the database
4. Refresh the page - your chart should load instantly from the database!
5. Try from a different device/browser - it should still work!

## Rollback (if needed)

If you need to remove the columns:

```sql
ALTER TABLE explorers DROP COLUMN IF EXISTS birth_date;
ALTER TABLE explorers DROP COLUMN IF EXISTS birth_time;
ALTER TABLE explorers DROP COLUMN IF EXISTS birth_location_name;
ALTER TABLE explorers DROP COLUMN IF EXISTS birth_latitude;
ALTER TABLE explorers DROP COLUMN IF EXISTS birth_longitude;
ALTER TABLE explorers DROP COLUMN IF EXISTS birth_timezone;
ALTER TABLE explorers DROP COLUMN IF EXISTS birth_chart_data;
ALTER TABLE explorers DROP COLUMN IF EXISTS birth_chart_calculated_at;
```

## What This Enables

✨ **Before**: Birth charts stored only in browser localStorage
- Lost when cache cleared
- No cross-device sync
- Can't debug tester issues

✨ **After**: Birth charts persisted in Supabase database
- Permanent storage linked to explorer account
- Syncs across all devices
- Can view/debug any tester's chart
- Supports future features (transit tracking, chart comparisons, etc.)
