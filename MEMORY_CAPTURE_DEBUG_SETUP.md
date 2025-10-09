# 🔍 Memory Capture Debug Setup Complete

## Changes Made

### 1. **Added Memory Capture to PersonalOracleAgent** (`lib/agents/PersonalOracleAgent.ts`)

**Location**: Line 638-657 (after Claude response generation)

```typescript
// 🔥 NEW: Capture this conversation turn for memory
console.log('[DEBUG] Attempting memory capture', { userId: this.userId, inputLength: trimmedInput.length });

try {
  const { liveMemoryCapture } = await import('@/lib/services/live-memory-capture');
  await liveMemoryCapture.captureConversationTurn({
    userId: this.userId,
    sessionId: `session_${Date.now()}`,
    userInput: trimmedInput,
    mayaResponse: responseText,
    archetype: archetypes[0] || 'sage',
    emotionalTone: this.detectEmotionalTone(trimmedInput),
    engagementLevel: this.assessEngagementLevel(trimmedInput, responseText),
    transformationOccurred: this.detectTransformation(trimmedInput, responseText),
    sacredMoment: this.detectSacredMoment(trimmedInput, responseText)
  });
  console.log('[DEBUG] Memory capture complete', { userId: this.userId });
} catch (memoryError: any) {
  console.error('[DEBUG] Memory capture failed:', memoryError.message);
}
```

**What it captures:**
- ✅ User ID (passed from route)
- ✅ User input text
- ✅ MAIA's response
- ✅ Detected archetype (from journal analysis)
- ✅ Emotional tone (joy, sadness, fear, anger, peace, curiosity)
- ✅ Engagement level (deep, engaged, neutral, disengaged, closed)
- ✅ Transformation moments (breakthroughs, insights)
- ✅ Sacred moments (profound realizations)

### 2. **Added Helper Methods to PersonalOracleAgent** (Lines 795-885)

- `detectEmotionalTone()` - Identifies emotional state from text
- `assessEngagementLevel()` - Measures conversation depth
- `detectTransformation()` - Spots breakthrough moments
- `detectSacredMoment()` - Identifies profound exchanges

### 3. **Added Debug Logging to Route** (`apps/web/app/api/oracle/personal/route.ts`)

**Line 36**: Shows userId resolution
```typescript
console.log('[DEBUG] Resolved userId:', requestUserId)
```

This will show whether `userId` is coming from the request body or defaulting to 'beta-user'.

### 4. **Enhanced LiveMemoryCapture Logging** (`lib/services/live-memory-capture.ts`)

**Lines 160-176**: Added detailed database write logging
```typescript
console.log('[DEBUG] Writing to DB', {
  table: 'memory_events',
  userId: turn.userId,
  count: memories.length,
  firstMemory: memories[0]
});

const { data, error } = await supabase
  .from('memory_events')
  .insert(memories)
  .select();

console.log('[DEBUG] DB write result', {
  success: !error,
  error: error?.message,
  insertedCount: data?.length
});
```

### 5. **Created Test Script** (`scripts/test-memory-flow.ts`)

Run with: `npx tsx scripts/test-memory-flow.ts`

Simulates a real conversation and shows you exactly what to look for in the logs.

---

## How to Debug the Flow

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Run Test Script (in another terminal)
```bash
npx tsx scripts/test-memory-flow.ts
```

### Step 3: Watch Server Console for Debug Logs

You should see this sequence:

```
[DEBUG] Resolved userId: beta-tester-2
📨 /api/oracle/personal: { userId: 'beta-tester-2', ... }
🔮 Attempting PersonalOracleAgent (primary MAIA path)...
[DEBUG] Attempting memory capture { userId: 'beta-tester-2', inputLength: 65 }
[Memory Capture] Processing turn for user beta-tes...
[DEBUG] Writing to DB {
  table: 'memory_events',
  userId: 'beta-tester-2',
  count: 2,
  firstMemory: { user_id: 'beta-tester-2', ... }
}
[DEBUG] DB write result {
  success: true,
  insertedCount: 2
}
[DEBUG] Memory capture complete { userId: 'beta-tester-2' }
✅ PersonalOracleAgent response successful
```

### Step 4: Check Database
```bash
npx tsx scripts/check-memory-events.ts
```

---

## Common Issues & Solutions

### Issue: userId shows 'beta-user' instead of 'beta-tester-2'

**Problem**: Frontend not sending userId in request body

**Solution**: Check frontend code (e.g., `apps/web/app/maya/page.tsx`) and ensure it's sending:
```typescript
{
  userId: 'beta-tester-2',
  userText: '...'
}
```

### Issue: "[DEBUG] Memory capture failed"

**Problem**: LiveMemoryCapture import or execution failed

**Check**:
1. File exists: `lib/services/live-memory-capture.ts`
2. Supabase env vars set: `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. Error message for specifics

### Issue: "DB write result { success: false }"

**Problem**: Supabase table schema issue

**Check**:
1. Table `memory_events` exists
2. Columns match (see URGENT_MEMORY_FIX_REQUIRED.md)
3. RLS policies allow inserts

---

## What Gets Captured

### When a User Sends a Message:

1. **Route receives request** → Shows `[DEBUG] Resolved userId`
2. **PersonalOracleAgent processes** → Shows `[DEBUG] Attempting memory capture`
3. **LiveMemoryCapture analyzes** → Detects emotions, engagement, patterns
4. **Database insert** → Shows `[DEBUG] Writing to DB` and `[DEBUG] DB write result`

### Memory Types Created:

- **key_moment** - Transformative conversations (significance_score: 0.8-1.0)
- **emotional_tag** - Emotional resonance detected (significance_score: 0.5)
- **pattern_recognition** - Recurring themes (significance_score: 0.6)

---

## Testing with Real Beta Users

### Test Flow:
```bash
# 1. Beta user (e.g., Kelly) sends message via /maya
# 2. Watch server logs for debug output
# 3. Verify memory capture worked
npx tsx scripts/check-memory-events.ts
```

### Expected Output:
```
Found 3 memories for beta-tester-2:
  - [key_moment] "Interaction pattern: 65 chars, 12 words" (fear, 0.8)
  - [emotional_tag] "fear" (fear, 0.5)
  - [pattern_recognition] "Vulnerability opens depth" (fear, 0.6)
```

---

## Next Steps

1. ✅ Memory capture is now integrated
2. ✅ Debug logging is in place
3. ⏳ Run test script to verify flow
4. ⏳ Check if real conversations capture memories
5. ⏳ Verify userId is passed correctly from frontend

**If you see all [DEBUG] logs showing the right userId and DB writes succeeding, memory capture is working!** 🎉
