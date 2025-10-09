# 🌍 Onboarding Persistence Fix - Earth Element Grounding

## The Problem

Beta testers were complaining that:
- Their preferences weren't being saved/remembered
- They had to re-enter their name and metrics every time
- The onboarding loop kept repeating

**Root cause:** The app was only checking localStorage for user credentials but NOT loading user data and preferences from Supabase when users returned.

---

## The Solution

### Updated: `useUserAuth` Hook (`lib/hooks/useUserAuth.ts`)

**Added:**
- `UserPreferences` interface
- `preferences` state variable
- Loading preferences from Supabase `user_preferences` table
- Returning preferences in hook result

**What it does now:**
1. ✅ Checks localStorage for user ID
2. ✅ Loads user data from Supabase `users` table
3. ✅ Loads oracle agent config from Supabase
4. ✅ **NEW: Loads user preferences from Supabase**
5. ✅ Syncs everything to localStorage for faster subsequent loads
6. ✅ Returns complete user data including preferences

---

### Updated: `/maya` Page (`app/maya/page.tsx`)

**Before:**
- Only checked localStorage/sessionStorage
- Did NOT load from Supabase
- Did NOT check onboarding status
- Did NOT load preferences

**After:**
- Uses `useUserAuth` hook
- Loads ALL user data from Supabase first
- Checks `isOnboarded` status
- Loads preferences including voice settings
- Redirects appropriately if not authenticated/onboarded
- Shows proper loading states

---

## User Flow (Fixed)

### First Visit
```
User → /beta-signup → enters access code
     → /beta-entry → completes onboarding
     → Saves to Supabase (users, oracle_agents, user_preferences)
     → Saves to localStorage
     → /maya → starts conversation
```

### Return Visit (THIS IS NOW FIXED)
```
User → / → checks localStorage for explorerId
     → /maya → useUserAuth hook fires
     → Loads from Supabase:
          - User data (name, onboarding status)
          - Oracle agent config
          - User preferences ✨ NEW
     → If onboarded: Show Maia interface
     → If not onboarded: Redirect to /beta-entry
```

---

## What Gets Saved and Loaded

### Saved During Onboarding

**`users` table:**
- `id` (explorerId)
- `sacred_name` (their name)
- `email`
- `beta_onboarded_at` ⭐ (marks them as onboarded)
- `user_intention`

**`oracle_agents` table:**
- `user_id`
- `name` (Maia)
- `archetype` (sacred_guide)
- `personality_config` (includes greeting style, comm preference, focus areas)

**`user_preferences` table:**
- `user_id`
- `tone` (0-100 scale)
- `style` (prose/poetic/auto)
- `theme` (dark)
- `voice_enabled` ⭐
- `voice_speed`
- `show_thinking`
- `auto_play_voice` ⭐

### Loaded on Return

**useUserAuth hook now loads:**
- ✅ User data (id, name, email, onboarding status)
- ✅ Oracle agent config (personality preferences)
- ✅ **User preferences (voice settings, theme, etc)** ⭐ NEW

---

## Testing Checklist

### Test Case 1: New User
- [ ] Go to site
- [ ] Complete signup with access code
- [ ] Complete onboarding (name, preferences)
- [ ] Land on /maya
- [ ] Should NOT see onboarding again

### Test Case 2: Returning User (Same Device)
- [ ] Close browser completely
- [ ] Reopen and go to site
- [ ] Should auto-redirect to /maya
- [ ] Should NOT see onboarding
- [ ] Should show correct name in greeting
- [ ] Voice preferences should be remembered

### Test Case 3: Returning User (Different Device)
- [ ] Log in on new device
- [ ] Enter same access code used before
- [ ] Should load data from Supabase
- [ ] Should skip onboarding (already completed)
- [ ] Should remember name and preferences

### Test Case 4: Clear localStorage But Supabase Has Data
- [ ] Clear browser localStorage
- [ ] Go to site
- [ ] Enter access code
- [ ] Should load all data from Supabase
- [ ] Should NOT require re-onboarding

---

## Console Logs to Watch For

### Successful Load
```
🔍 Found user ID in storage: user_xxx
✅ User data loaded from Supabase: user_xxx ExplorerName
✅ User preferences loaded: { tone: 70, voice_enabled: true, ... }
✅ User ready for Maia: ExplorerName
📊 Preferences loaded: { tone: 70, style: 'auto', ... }
```

### No User Data (Need Signup)
```
❌ No user ID found in storage
```

### User Not Onboarded (Need Onboarding)
```
⚠️ User not onboarded, redirecting to entry
```

---

## Files Changed

1. **`lib/hooks/useUserAuth.ts`**
   - Added `UserPreferences` interface
   - Added `preferences` state
   - Added Supabase query to load preferences
   - Return preferences in hook result

2. **`app/maya/page.tsx`**
   - Now uses `useUserAuth` hook
   - Checks `isOnboarded` status
   - Uses loaded `preferences` for voice settings
   - Proper loading and error states

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│           ONBOARDING (First Time)               │
└─────────────────────────────────────────────────┘
                       ↓
         ┌─────────────────────────┐
         │   Supabase Save         │
         ├─────────────────────────┤
         │ • users table           │
         │ • oracle_agents table   │
         │ • user_preferences ✨   │
         └─────────────────────────┘
                       ↓
         ┌─────────────────────────┐
         │  localStorage Sync      │
         ├─────────────────────────┤
         │ • explorerId            │
         │ • explorerName          │
         │ • betaOnboardingComplete│
         └─────────────────────────┘

┌─────────────────────────────────────────────────┐
│           RETURN VISIT (Now Fixed!)             │
└─────────────────────────────────────────────────┘
                       ↓
         ┌─────────────────────────┐
         │  useUserAuth Hook       │
         └─────────────────────────┘
                       ↓
         ┌─────────────────────────┐
         │  Check localStorage     │
         │  for explorerId         │
         └─────────────────────────┘
                       ↓
         ┌─────────────────────────┐
         │  Load from Supabase:    │
         ├─────────────────────────┤
         │  ✅ User data           │
         │  ✅ Oracle agent        │
         │  ✅ Preferences ✨      │
         └─────────────────────────┘
                       ↓
         ┌─────────────────────────┐
         │  Check beta_onboarded_at│
         └─────────────────────────┘
                       ↓
         ┌─────────────────────────┐
         │  If onboarded:          │
         │  → Show /maya interface │
         │                         │
         │  If not onboarded:      │
         │  → Redirect to /beta-entry
         └─────────────────────────┘
```

---

## The Earth Element Fix

This was a **grounding problem** - the everyday practical loop wasn't working smoothly.

**Earth element is about:**
- Practical functionality
- Smooth daily experience
- Things "just working"
- Reliability and stability

**The fix ensures:**
- ✅ Users sign in once and go straight to Maia
- ✅ Preferences are remembered and loaded
- ✅ No repetitive onboarding
- ✅ Smooth, frictionless daily experience

---

## Monday Readiness

This fix is critical for Monday launch:
- Users won't get frustrated re-entering data
- Cross-device sync works (Supabase persistence)
- Professional, polished experience
- Users can focus on connection with Maia, not fighting the interface

---

🌍 **Earth element grounded. The everyday loop is smooth.**