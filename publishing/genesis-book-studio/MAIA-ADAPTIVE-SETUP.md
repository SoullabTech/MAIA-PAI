# MAIA Adaptive Reading System — Setup Guide

## Overview

The MAIA Adaptive Reading system is a living knowledge platform that creates personalized reading paths through "Elemental Alchemy" based on reader intent and tracks elemental preferences over time.

## What We've Built

### 1. Backend Infrastructure ✓

#### Database Layer
- **lib/db.ts** - Supabase client with service role privileges
- **lib/auth.ts** - JWT verification for user authentication
- **lib/reading/score.ts** - Intent-to-section scoring algorithm with personalization
- **lib/reading/bias.ts** - Elemental preference learning system

#### Database Schema
**supabase/migrations/20251024_maia_adaptive_reading.sql**

Tables created:
- `reader_profiles` - User preferences, learning styles, element bias
- `reading_paths` - Intent-based reading sequences
- `reading_path_steps` - Ordered steps with rationale
- `reader_events` - Interaction tracking (opened_section, completed_practice, etc.)

All tables have Row Level Security (RLS) enabled with user-scoped policies.

### 2. API Routes ✓

#### Path Creation
**POST /api/reading-path/create**
```json
{
  "bookId": "elemental-alchemy",
  "intent": "anger"  // or: focus, transition, grief, evidence
}
```

Creates personalized 3-4 step path using:
- Base intent weights (fire, water, air, earth, aether)
- User's stored element bias from past interactions
- Manifest section tags and intent mappings

#### Step Completion
**POST /api/reading-path/complete-step**
```json
{
  "stepId": "uuid-of-step"
}
```

Marks a path step as completed.

#### Event Logging
**POST /api/reader/event**
```json
{
  "bookId": "elemental-alchemy",
  "sectionId": "fire-anger",
  "kind": "completed_practice",
  "detail": { "element": "fire" }
}
```

Logs reader interactions AND updates element bias:
- Completing practice → +0.1 bias for that element
- Skipping section → -0.1 bias for that element

#### Bias Reset (Dev Tool)
**POST /api/reader/reset-bias**

Resets all element bias to 0 for testing.

### 3. Content Manifest ✓

**content/elemental-alchemy.manifest.yaml** (source)
**content/elemental-alchemy.manifest.json** (generated at build)

Defines:
- 8 book sections with page locations
- Element tags (fire, water, air, earth, aether)
- Intent mappings (anger, focus, transition, grief, evidence)
- 2 practices with durations

Build command: `npm run seed-manifest`

### 4. Frontend Components ✓

**components/reading/IntentPrompt.tsx**
- Displays intent chips (Anger 🔥, Focus 💨, Transition 🌀, etc.)
- Triggers path creation

**components/reading/GuidePanel.tsx**
- Shows personalized reading path
- Progress tracking with visual bar
- Step-by-step breakdown with rationale
- Page number references

## Applying the Migration

### Option 1: Supabase SQL Editor (Recommended)

1. Go to https://supabase.com/dashboard/project/jkbetmadzcpoinjogkli/sql
2. Open `supabase/migrations/20251024_maia_adaptive_reading.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Run

### Option 2: Via CLI (if configured)

```bash
npx supabase db push
```

## Testing the System

### 1. Create a Reading Path

```bash
curl -X POST http://localhost:3002/api/reading-path/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "bookId": "elemental-alchemy",
    "intent": "anger"
  }'
```

Expected response:
```json
{
  "path_id": "uuid",
  "intent": "anger",
  "steps": [
    {
      "section_id": "fire-anger",
      "title": "Fire Element: Anger as Transformative Energy",
      "why": "This section helps you channel fiery energy into creative power.",
      "loc": { "page_start": 47, "page_end": 63 },
      "score": 14.5,
      "order_index": 0
    },
    ...
  ]
}
```

### 2. Log an Event (Builds Element Bias)

```bash
curl -X POST http://localhost:3002/api/reader/event \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "bookId": "elemental-alchemy",
    "sectionId": "fire-anger",
    "kind": "completed_practice",
    "detail": { "element": "fire" }
  }'
```

This logs the event AND increases user's fire bias by +0.1.

### 3. Create Another Path (See Personalization)

Create another path with the same intent - you'll notice sections with fire tags get slightly higher scores due to learned preference.

## How Personalization Works

1. **Base Intent Weights**
   ```typescript
   anger: { fire: 0.9, water: 0.3, air: 0.2, earth: 0.2, aether: 0.1 }
   ```

2. **User Completes Fire Practice**
   - Event logged: `kind: 'completed_practice', detail: { element: 'fire' }`
   - Fire bias updated: `fire: 0.0 → 0.1`

3. **Next Path Creation**
   - Merged weights: `fire: 0.9 + 0.1 = 1.0` (clamped to [0,1])
   - Fire sections score slightly higher
   - Path adapts to what user actually resonates with

4. **Over Time**
   - Bias accumulates: `-1.0` (avoid) to `+1.0` (prefer)
   - System learns individual elemental preferences
   - Each reader gets a unique, evolving path

## Architecture Philosophy

This is "consciousness design as infrastructure":

- **Fire**: Vision and transformation (anger intent)
- **Water**: Emotional depth and healing (grief intent)
- **Air**: Clarity and focus (focus, evidence intents)
- **Earth**: Grounding and structure
- **Aether**: Integration and transition

The book becomes a living field that responds to each reader's journey, demonstrating what "personalized knowledge transmission" can be.

## What's Next

- [ ] Apply migration to create tables
- [ ] Test path creation with real user JWT
- [ ] Build PathToast component for UI feedback
- [ ] Add scroll tracking for opened_section events
- [ ] Wire up to actual reading experience at /read
- [ ] Add MAIA conversation panel for questions
