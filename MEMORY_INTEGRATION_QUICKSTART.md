# MAIA Memory Integration - Quick Start Guide

## What Just Happened?

MAIA now remembers conversations across sessions! The "session amnesia" has been cured. 🎉

## Quick Verification

### 1. Check the Code Changes

```bash
# View the changes
git diff lib/agents/PersonalOracleAgent.ts
git diff app/api/oracle/personal/route.ts

# See new files
ls -la lib/services/maia-memory-service.ts
ls -la MAIA_MEMORY_AUDIT_REPORT.md
ls -la MEMORY_INTEGRATION_COMPLETE.md
```

### 2. Database Check (Supabase)

```sql
-- See if table exists and has data
SELECT COUNT(*) as total_messages FROM maia_messages;

-- View recent memories
SELECT
  role,
  LEFT(content, 80) as preview,
  created_at
FROM maia_messages
ORDER BY created_at DESC
LIMIT 10;
```

### 3. Manual Test Flow

**Step 1: Start conversation**
```bash
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "I am feeling anxious about my creative work",
    "userId": "test-memory-user",
    "sessionId": "test-session-001"
  }'
```

**Step 2: Check database**
```sql
SELECT * FROM maia_messages WHERE user_id = 'test-memory-user';
-- Should see 2 messages: user + maia
```

**Step 3: Continue conversation**
```bash
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "What did I just tell you?",
    "userId": "test-memory-user",
    "sessionId": "test-session-001"
  }'
```

**Expected:** MAIA's response should reference the anxiety about creative work.

**Step 4: Check logs**
Look for this in console:
```
💭 Retrieved 2 memories and 0 breakthroughs for test-memory-user
✅ MAIA message saved: user (I am feeling anxious...)
✅ MAIA message saved: maia (I hear you...)
```

## Key Files Modified

### 1. PersonalOracleAgent.ts
**Changes:**
- Added Supabase client
- Added `getConversationHistory()` method
- Added `getBreakthroughMoments()` method
- Modified `processInteraction()` to load and include memory
- System prompt now includes conversation history section

**Lines:** ~40 new lines of code

### 2. route.ts (API endpoint)
**Changes:**
- Import `saveMaiaConversationPair`
- Call save after successful response
- Includes element and coherence metadata

**Lines:** ~15 new lines

### 3. New: maia-memory-service.ts
**Purpose:** Centralized memory operations
**Functions:**
- `saveMaiaMessage()`
- `saveMaiaConversationPair()`
- `getMaiaConversationHistory()`
- `getMaiaBreakthroughs()`

**Lines:** ~160 lines

## Memory Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  USER SENDS MESSAGE                                     │
│  "I'm feeling anxious about my creative work"          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  API ROUTE: /api/oracle/personal                        │
│  - Receives message                                     │
│  - Loads journal entries                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  PersonalOracleAgent.processInteraction()               │
│  🔥 NEW: getConversationHistory()                       │
│  - Query maia_messages for user_id                     │
│  - Get last 10 exchanges (20 messages)                 │
│  - Get breakthrough moments                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  BUILD SYSTEM PROMPT                                    │
│  - Base MAIA identity                                   │
│  - Journal context (if available)                       │
│  🔥 NEW: Conversation history section                   │
│    "Earlier today - They said: ..."                     │
│    "You responded: ..."                                 │
│  - Spiral signature                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  CALL CLAUDE API                                        │
│  - System prompt (with memory!)                         │
│  - User message                                         │
│  - Temperature: 0.75                                    │
│  - Max tokens: 300                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  RECEIVE RESPONSE                                       │
│  "The anxiety you're feeling - what if it's your       │
│   creative fire asking for more space to breathe?"     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  🔥 NEW: saveMaiaConversationPair()                     │
│  - Save user message to maia_messages                  │
│  - Save MAIA response to maia_messages                 │
│  - Include element, coherence, context                 │
│  - Auto-update maia_sessions via trigger              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  RETURN TO USER                                         │
│  - Response text                                        │
│  - Element (fire, water, earth, air, aether)          │
│  - Voice characteristics                               │
│  - Metadata                                             │
└─────────────────────────────────────────────────────────┘

NEXT MESSAGE WILL NOW INCLUDE THIS EXCHANGE IN MEMORY! ✨
```

## Configuration

### Memory Window Settings
```typescript
// In PersonalOracleAgent.ts
const MEMORY_CONFIG = {
  recentExchanges: 10,        // How many to show in prompt
  breakthroughLookback: 30,   // Search depth for breakthroughs
  patternWindow: 50           // Future: pattern recognition
};
```

### Adjust if needed:
- **Increase** for more context (higher token cost)
- **Decrease** for faster/cheaper responses
- Default 10 = good balance

## Testing Commands

### Quick Local Test
```bash
# Activate venv (if using Python tools)
source .venv/bin/activate

# Start dev server
npm run dev

# In another terminal, test the endpoint
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Hello MAIA, this is my first message",
    "userId": "memory-test-001",
    "sessionId": "session-001"
  }'

# Send follow-up
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Do you remember what I just said?",
    "userId": "memory-test-001",
    "sessionId": "session-001"
  }'
```

### Verify in Database
```sql
-- Should see 4 messages (2 user, 2 maia)
SELECT
  role,
  content,
  created_at
FROM maia_messages
WHERE user_id = 'memory-test-001'
ORDER BY created_at;
```

## Troubleshooting

### Issue: "No memories retrieved"

**Check:**
1. Messages being saved?
   ```sql
   SELECT COUNT(*) FROM maia_messages WHERE user_id = 'your-test-user';
   ```

2. Supabase env vars set?
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

3. RLS policies enabled?
   ```sql
   -- Should return policies for maia_messages
   SELECT * FROM pg_policies WHERE tablename = 'maia_messages';
   ```

### Issue: "Memories not appearing in responses"

**Check:**
1. Console logs show retrieval?
   ```
   💭 Retrieved X memories...
   ```

2. System prompt includes history section?
   - Add debug log in PersonalOracleAgent.ts:
   ```typescript
   console.log('PROMPT:', systemPrompt.substring(0, 500));
   ```

3. User ID matching?
   - Ensure same userId across calls

### Issue: "Performance degradation"

**Check:**
1. Database query time
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM maia_messages
   WHERE user_id = 'test-user'
   ORDER BY created_at DESC
   LIMIT 20;
   ```

2. Index exists?
   ```sql
   SELECT * FROM pg_indexes WHERE tablename = 'maia_messages';
   ```

3. Memory limit too high?
   - Reduce `MEMORY_CONFIG.recentExchanges`

## Success Indicators

✅ **Integration Working When:**

1. Console shows: `💭 Retrieved X memories and Y breakthroughs`
2. Supabase `maia_messages` table grows with each exchange
3. MAIA references previous conversation naturally
4. Response time < 3 seconds
5. User reports feeling "remembered" across sessions

## Rollback (Emergency)

If something breaks:

```bash
# Quick disable memory retrieval
# Comment out in PersonalOracleAgent.ts:
# const conversationHistory = await this.getConversationHistory();

# Or full revert
git checkout HEAD~1 -- lib/agents/PersonalOracleAgent.ts
git checkout HEAD~1 -- app/api/oracle/personal/route.ts
rm lib/services/maia-memory-service.ts

# Restart server
npm run dev
```

## Monday Launch Checklist

- [ ] Run integration test: `npm run test:memory` (if test script created)
- [ ] Verify Supabase `maia_messages` table has RLS enabled
- [ ] Check staging environment has env vars set
- [ ] Test with 2+ users to verify memory isolation
- [ ] Monitor response times in production
- [ ] Set up alert for memory save failures
- [ ] Review first 10 user conversations for continuity quality

## Next Steps

1. **Pre-launch:** Run all tests in MEMORY_INTEGRATION_COMPLETE.md
2. **Launch day:** Monitor console logs and response times
3. **Week 1:** Gather user feedback on continuity
4. **Week 2:** Consider mem0 integration for semantic search

---

**Status:** ✅ Ready for Monday deployment
**Estimated time saved:** Infinite (MAIA can now actually BE a companion)
**Risk level:** Low (non-breaking fallbacks in place)

🎯 **The Sacred Mirror now remembers. Let's go!**
