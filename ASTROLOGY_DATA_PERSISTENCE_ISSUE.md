# Astrology Data Persistence Issue - Diagnosis & Solution

## Issue Summary

Beta testers are unable to see their astrology information persisting across sessions/devices. The Archetypal Field Map (birth chart visualization) is not displaying their actual astrological data.

## Root Cause Analysis

### Current Implementation
The astrology system currently stores birth chart data **only in localStorage**, not in the database:

1. **Data Entry**: Birth data form (`components/astrology/BirthDataForm.tsx`) collects:
   - Birth date
   - Birth time
   - Birth location (with lat/lng)

2. **Calculation**: API route `/api/astrology/birth-chart` calculates the chart using real ephemeris

3. **Storage**: Data is saved ONLY to browser localStorage:
   ```typescript
   // From app/astrology/page.tsx lines 243-265
   localStorage.setItem('birthChartData', JSON.stringify(data));

   // Also saved to beta_user object in localStorage
   const userData = JSON.parse(localStorage.getItem('beta_user'));
   userData.birthData = { ...data };
   localStorage.setItem('beta_user', JSON.stringify(userData));
   ```

4. **Retrieval**: On page load, data is ONLY read from localStorage, never from database

### The Problem

Looking at `/app/api/astrology/birth-chart/route.ts` lines 78-79:

```typescript
// Store birth chart in database (Supabase)
// TODO: Implement database storage with user association
```

And lines 114-116 (GET handler):
```typescript
// Fetch stored birth chart from database (Supabase)
// TODO: Implement database fetch from user_profiles or birth_charts table
// For now, users must POST their birth data to calculate
```

**The database integration was never completed!**

### Impact

- ❌ Birth chart data disappears if browser cache is cleared
- ❌ Data doesn't sync across devices
- ❌ Data is lost if user switches browsers
- ❌ No way to retrieve a tester's chart for debugging
- ✅ Only works for single-session, single-device usage

## Database Schema

The schema DOES have a BirthChart model (`prisma/schema.prisma` lines 318-364):

```prisma
model BirthChart {
  id            String   @id @default(cuid())
  userId        String   @unique

  // Birth data
  birthDate     String
  birthTime     String
  locationName  String
  latitude      Float
  longitude     Float
  timezone      String

  // Calculated chart data (JSON)
  planets       Json
  ascendant     Json
  midheaven     Json
  houseCusps    Float[]
  aspects       Json
  elementalBalance Json?
  spiralogicEmphasis Json?

  // Relations
  user          User     @relation(fields: [userId], references: [id])
}
```

But this table is connected to the Prisma `User` model, while beta testers use the Supabase `explorers` table.

## Solution Plan

### Option 1: Quick Fix - Use Supabase Directly (Recommended)

Add birth chart storage to the existing `explorers` table in Supabase:

1. **Add columns to `explorers` table** (or create new `explorer_birth_charts` table):
   ```sql
   ALTER TABLE explorers ADD COLUMN birth_date TEXT;
   ALTER TABLE explorers ADD COLUMN birth_time TEXT;
   ALTER TABLE explorers ADD COLUMN birth_location TEXT;
   ALTER TABLE explorers ADD COLUMN birth_latitude FLOAT;
   ALTER TABLE explorers ADD COLUMN birth_longitude FLOAT;
   ALTER TABLE explorers ADD COLUMN birth_timezone TEXT;
   ALTER TABLE explorers ADD COLUMN birth_chart_data JSONB;
   ```

2. **Update `/api/astrology/birth-chart` POST handler** to save to Supabase:
   ```typescript
   // After calculating chart
   const explorerId = body.explorerId; // Pass from frontend

   await supabase
     .from('explorers')
     .update({
       birth_date: date,
       birth_time: time,
       birth_location: location.name,
       birth_latitude: location.lat,
       birth_longitude: location.lng,
       birth_timezone: location.timezone,
       birth_chart_data: chartData
     })
     .eq('explorer_id', explorerId);
   ```

3. **Update `/api/astrology/birth-chart` GET handler** to fetch from Supabase:
   ```typescript
   const { data: explorer } = await supabase
     .from('explorers')
     .select('birth_chart_data, birth_date, birth_time, birth_location')
     .eq('explorer_id', explorerId)
     .single();

   if (explorer?.birth_chart_data) {
     return NextResponse.json({
       success: true,
       data: explorer.birth_chart_data
     });
   }
   ```

4. **Update `app/astrology/page.tsx`** to:
   - Fetch from API on load instead of localStorage
   - Save explorer_id with birth chart calculation
   - Keep localStorage as cache/fallback

### Option 2: Full Migration to Prisma (More Work)

Migrate beta testing system from Supabase to Prisma database, then use existing BirthChart model.

## Implementation Priority

### Phase 1: Database Storage (Critical)
- [ ] Create Supabase table or add columns to `explorers`
- [ ] Update POST `/api/astrology/birth-chart` to save to database
- [ ] Test with existing beta tester

### Phase 2: Database Retrieval (Critical)
- [ ] Update GET `/api/astrology/birth-chart` to fetch from database
- [ ] Update `app/astrology/page.tsx` to load from API
- [ ] Add loading states and error handling

### Phase 3: Migration Script (Important)
- [ ] Create script to migrate existing localStorage data to database
- [ ] Send email to beta testers to re-enter birth data if needed

### Phase 4: Enhancement (Nice to Have)
- [ ] Add "Edit Birth Data" button
- [ ] Add birth chart validation
- [ ] Add export/import functionality

## Files Requiring Changes

1. `/app/api/astrology/birth-chart/route.ts` - Add database save/fetch
2. `/app/astrology/page.tsx` - Load from API instead of localStorage
3. Supabase migration - Add birth chart columns/table
4. `/lib/types/astrology.ts` - Type definitions for stored data

## Testing Checklist

- [ ] New user enters birth data → saves to database
- [ ] User refreshes page → data loads from database
- [ ] User switches devices → data appears on new device
- [ ] User clears cache → data still loads from database
- [ ] Existing tester data migration works correctly

## Notes

The current system works perfectly for **your** chart because you have demo missions hardcoded in `app/astrology/page.tsx` (lines 78-162, KELLY_MISSIONS). Beta testers don't have this hardcoded data, so they rely entirely on localStorage, which is ephemeral.

The Archetypal Field Map visualization itself works fine - it's just missing the persistent data source.
