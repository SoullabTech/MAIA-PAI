# MAIA Production Fix - Complete Solution Plan

## Problem Summary

**Production is serving OLD code** that doesn't match the repository.

### Evidence:
1. Production returns: `"I'm tracking with you"` from `MayaIntelligenceOrchestrator`
2. Repo has: Simple proxy to `/api/maya-chat`
3. Old orchestrator file exists in `lib/oracle/core/` but is NOT imported in `apps/web`
4. `/api/oracle/personal/route.ts` was created Sept 27 (commit 0282e1ec)
5. Production is running code from BEFORE this file existed

## Root Cause

**Vercel is deploying from an old cached build** or there's a routing mismatch. The current code in the repo is correct, but Vercel hasn't rebuilt with the new changes.

## Why Empty Messages Occur

The old production code has a complex flow:
1. Frontend sends empty/whitespace messages
2. Old architecture (`orchestrateResponse` → `participateInField` → Claude API)
3. No validation layer
4. Claude rejects with 400: "messages must have non-empty content"

## Solution: Force Clean Deployment

### Option 1: Clear Vercel Cache (Recommended)
```bash
# In Vercel Dashboard:
# 1. Go to Project Settings
# 2. Redeploy → "Redeploy with Cache Cleared"
```

### Option 2: Rename Old Files (Immediate)
```bash
# Deactivate old architecture so Vercel can't import it
mv lib/oracle/core/MayaIntelligenceOrchestrator.ts \
   lib/oracle/core/MayaIntelligenceOrchestrator.ts.OLD

mv lib/oracle/FieldIntelligenceMaiaOrchestrator.ts \
   lib/oracle/FieldIntelligenceMaiaOrchestrator.ts.OLD
```

### Option 3: Add Build Verification
```typescript
// apps/web/app/api/oracle/personal/route.ts
// Add at top:
console.log('✅ NEW oracle/personal route loaded - Build date:', new Date().toISOString())
```

## Current Architecture (What SHOULD Be Running)

```
┌─────────────────────────────────────────────┐
│  Frontend: OracleConversation.tsx           │
│  → POST /api/oracle/personal                 │
│     body: { input: "user message" }         │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  API: /api/oracle/personal/route.ts         │
│  1. Validate message not empty              │
│  2. Transform: input → message               │
│  3. Proxy to /api/maya-chat                  │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  API: /api/maya-chat/route.ts               │
│  1. Validate message                        │
│  2. Load PersonalOracleAgent                │
│  3. Process with Claude (with retries)      │
│  4. Fallback to OpenAI if needed            │
│  5. Ultimate fallback: friendly response    │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  Response: Personalized MAIA message        │
└─────────────────────────────────────────────┘
```

## Old Architecture (What IS Running on Production)

```
┌─────────────────────────────────────────────┐
│  Frontend: OracleConversation.tsx           │
│  → POST /api/oracle/personal                 │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  ❌ OLD ROUTE (cached/missing file)         │
│  Uses: MayaIntelligenceOrchestrator         │
│  → orchestrateResponse()                    │
│  → participateInField()                     │
│  → Claude API (NO validation)               │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  Response: "I'm tracking with you."         │
│  OR: 400 Error (empty message)              │
└─────────────────────────────────────────────┘
```

## Testing Plan

### Step 1: Verify Local Build
```bash
cd apps/web
npm run build
npm run start

# Test:
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{"input":"test message","userId":"test"}'

# Should return NEW response, not "I'm tracking with you"
```

### Step 2: Force Vercel Redeploy
```bash
# Add trivial change to force rebuild
echo "# Build: $(date)" >> apps/web/.vercel-redeploy

git add apps/web/.vercel-redeploy
git commit -m "Force clean rebuild"
git push
```

### Step 3: Verify Production
```bash
# Wait 3-5 minutes for deployment

curl -X POST https://soullab.life/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{"input":"hello","userId":"test"}'

# Check response - should NOT be "I'm tracking with you"
```

### Step 4: Test Empty Message Handling
```bash
curl -X POST https://soullab.life/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{"input":"","userId":"test"}'

# Should return 400 with friendly message:
# "I'm here to listen. What would you like to share?"
```

## Commits Already Pushed (Waiting for Deployment)

1. **`5bedaa64`** - Empty message validation (frontend + backend)
2. **`a4efad71`** - Diagnostics dashboard + analytics
3. **`8efdd8bf`** - Analytics `/track` endpoint
4. **`fa62e25b`** - Field mapping fix
5. **`0282e1ec`** - Legacy endpoint redirect (THE KEY FIX)

## Why This Will Work

Once Vercel rebuilds from the latest commit:
1. ✅ New route file will be used
2. ✅ Empty messages caught before reaching Claude
3. ✅ Proper proxy to `/api/maya-chat`
4. ✅ PersonalOracleAgent provides real responses
5. ✅ No more "I'm tracking with you" loop
6. ✅ No more Claude 400 errors

## Immediate Action

**DO NOT push more code yet.** Instead:

1. Check Vercel deployment logs
2. Verify which commit is actually deployed
3. Clear cache and redeploy if needed
4. Test thoroughly before adding more changes