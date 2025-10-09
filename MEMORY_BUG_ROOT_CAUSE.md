# 🎯 MEMORY BUG ROOT CAUSE IDENTIFIED

## Problem
MAIA says "I don't have access to any previous conversations" despite memory integration being fully implemented.

## Root Cause
**The `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` is corrupted.**

### Evidence

**File**: `.env.local` line 5
**Current (CORRUPTED)**:
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=npx tsx scripts/send-passcodes.tsSUPABASE_URL=https://jkbetmadzcpoinjogkli.supabase.co
```

**Should be**:
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (valid JWT token)
```

**Database Test Results**:
```
❌ Read failed: Invalid API key
❌ Insert failed: Invalid API key
❌ Read back failed: Invalid API key
❌ Debug user query failed: Invalid API key
```

## Impact

1. **Memory Saving**: Fails silently (wrapped in `.catch()` at line 121-131 of `app/api/oracle/personal/route.ts`)
2. **Memory Retrieval**: Returns empty array (error handling at line 404-407 and 411-413 of `lib/agents/PersonalOracleAgent.ts`)
3. **MAIA Response**: Has no memory context, correctly states she doesn't have access to previous conversations
4. **Automated Tests**: Passed because they test code logic, not actual database operations

## How the Corruption Happened

Looking at line 5, it appears that:
- The anon key got deleted or overwritten
- A command `npx tsx scripts/send-passcodes.ts` was pasted in its place
- Then `SUPABASE_URL=...` got appended (creating a malformed line)

This suggests an accidental paste/edit during a terminal command operation.

## Fix Required

### Step 1: Get the correct Supabase anon key
1. Go to Supabase Dashboard: https://app.supabase.com/project/jkbetmadzcpoinjogkli
2. Go to Settings → API
3. Copy the "anon public" key (starts with `eyJ`)

### Step 2: Fix `.env.local`
Replace line 5 with:
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (paste the actual key here)
```

### Step 3: Restart dev server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Test memory integration
```bash
# Send first message
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{"input":"I am worried about my presentation tomorrow","userId":"test-fixed-user","sessionId":"fixed-001"}'

# Send follow-up (should remember the presentation!)
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{"input":"Do you remember what I was worried about?","userId":"test-fixed-user","sessionId":"fixed-002"}'
```

## Expected Result After Fix

MAIA should respond to the second message with something like:
> "Yes - you mentioned being worried about your presentation tomorrow. What specifically about the presentation is weighing on you?"

Instead of:
> "I don't have access to any previous conversations."

## Verification Steps

After fixing the API key:

1. **Database Connection Test**:
   ```bash
   node test-direct-db.js
   ```
   Should show: `✅ Read successful`, `✅ Insert successful`

2. **Real Conversation Flow**:
   Run the curl commands above - second message should reference the presentation

3. **Database Check** (in Supabase SQL Editor):
   ```sql
   SELECT role, content, created_at
   FROM maia_messages
   WHERE user_id = 'test-fixed-user'
   ORDER BY created_at DESC;
   ```
   Should show both user messages and MAIA responses

4. **Server Logs**:
   Should see:
   ```
   💭 Retrieved 4 memories and 0 breakthroughs for test-fixed-user
   🔍 DEBUG - Memory retrieval details:
     1. [user] I am worried about my presentation tomorrow
     2. [maia] (MAIA's response...)
   🔍 DEBUG - System prompt includes conversation history: true
   ✅ MAIA message saved: user (I am worried...)
   ✅ MAIA message saved: maia (response...)
   ```

## Why This Wasn't Caught Earlier

1. **Silent Failures**: Error handling returns empty arrays instead of throwing errors
2. **No Environment Validation**: No startup check to verify Supabase connection works
3. **Test Coverage**: Automated tests mocked database calls instead of testing real connection

## Recommendations

### Immediate
1. **Fix the API key** (see Step 1-2 above)
2. **Add startup validation** to check Supabase connection on server start

### For Monday Launch
1. **Environment Check Script**: Run before deployment to verify all API keys are valid
2. **Enhanced Error Logging**: Log database errors more prominently (not just to console)
3. **Health Check Endpoint**: Add `/api/health/database` to verify Supabase connection

### Code Improvements
```typescript
// Add to server startup or create /api/health/database
async function validateSupabaseConnection() {
  const { error } = await supabase.from('maia_messages').select('id').limit(1);
  if (error) {
    console.error('🚨 CRITICAL: Supabase connection failed:', error.message);
    console.error('Check NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
    throw new Error('Supabase connection invalid - memory system disabled');
  }
  console.log('✅ Supabase connection validated');
}
```

## Files Involved

**Corrupted**:
- `.env.local` (line 5)

**Working Correctly** (no code issues):
- `lib/agents/PersonalOracleAgent.ts` (memory retrieval logic)
- `lib/services/maia-memory-service.ts` (memory saving logic)
- `app/api/oracle/personal/route.ts` (API integration)

**Debug Tools Created**:
- `test-direct-db.js` (database connection test)
- Debug logging added to PersonalOracleAgent.ts

## Status

- ✅ **Root cause identified**: Corrupted API key
- ✅ **Fix identified**: Replace with correct anon key from Supabase dashboard
- ⏳ **Waiting**: User to apply fix
- ⏳ **Testing**: After fix, run verification steps above

---

**Next Action**: Get the correct `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase Dashboard and update `.env.local` line 5.
