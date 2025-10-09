# MAIA Memory Integration - Testing Plan
**Pre-Monday Launch**

## Testing Philosophy

We're testing that the **Sacred Mirror remembers the reflection** - that MAIA can witness a journey over time, not just moments in isolation.

---

## Test Suite Overview

1. ✅ **Database Layer** - Messages save correctly
2. ✅ **Retrieval Layer** - History loads properly
3. ✅ **Context Building** - Memory integrates into prompts
4. ✅ **Multi-User Isolation** - No memory leaks
5. ✅ **First-Time Users** - Graceful empty state
6. ✅ **Cross-Session** - Persistence across restarts
7. ✅ **Pattern Recognition** - Natural continuity in responses
8. ✅ **Performance** - Fast under load
9. ✅ **Degradation** - Fails gracefully

---

## Test 1: Database Layer - Memory Saving

### Goal
Verify messages save to `maia_messages` table with correct metadata

### Steps
```bash
# 1. Send a test conversation
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "I am feeling anxious about my creative work",
    "userId": "test-memory-001",
    "sessionId": "session-001"
  }'
```

### Verification (Supabase)
```sql
-- Check messages were saved
SELECT
  role,
  LEFT(content, 80) as preview,
  elements,
  created_at
FROM maia_messages
WHERE user_id = 'test-memory-001'
ORDER BY created_at DESC;

-- Should see 2 rows: user + maia
```

### Success Criteria
- ✅ User message saved with `role = 'user'`
- ✅ MAIA response saved with `role = 'maia'`
- ✅ `content` field populated
- ✅ `elements` JSONB has elemental data
- ✅ `session_id` matches request
- ✅ Timestamps are accurate

### Expected Issues
- ❌ Missing `session_id` field in schema → check migration
- ❌ NULL `user_id` → auth issue
- ❌ No rows → save function not called

---

## Test 2: Memory Retrieval

### Goal
Verify `getConversationHistory()` loads messages correctly

### Steps
```bash
# 1. Create conversation with 3 exchanges
for i in {1..3}; do
  curl -X POST http://localhost:3000/api/oracle/personal \
    -H "Content-Type: application/json" \
    -d "{
      \"input\": \"Test message ${i} about my journey\",
      \"userId\": \"test-memory-002\",
      \"sessionId\": \"session-002\"
    }"
  sleep 2
done
```

### Verification (Console Logs)
Look for:
```
💭 Retrieved 6 memories and 0 breakthroughs for test-memory-002
```

### Success Criteria
- ✅ Console shows "💭 Retrieved X memories"
- ✅ X = 6 (3 user + 3 maia messages)
- ✅ Messages ordered chronologically
- ✅ No duplicate messages

### Expected Issues
- ❌ Retrieved 0 memories → query failing
- ❌ Wrong user_id filter → check query logic
- ❌ Permission denied → RLS policy issue

---

## Test 3: Context Building

### Goal
Verify memory history appears in system prompt

### Steps
```typescript
// Add debug log to PersonalOracleAgent.ts (line ~540)
console.log('🔍 SYSTEM PROMPT PREVIEW:', systemPrompt.substring(0, 1000));
```

### Verification
After sending message, check console for:
```
## Our Conversation History (Remember This to Maintain Continuity)

**Earlier today** - They said:
"Test message 1..."
```

### Success Criteria
- ✅ History section appears in prompt
- ✅ Shows recent exchanges with time labels
- ✅ Includes elemental context when available
- ✅ Breakthrough section appears if breakthroughs exist

### Expected Issues
- ❌ No history section → check `if (conversationHistory.length > 0)`
- ❌ Empty content → data not mapping correctly

---

## Test 4: Multi-User Isolation

### Goal
Ensure User A never sees User B's memories

### Steps
```bash
# User A conversation
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "I love hiking in the mountains",
    "userId": "user-a",
    "sessionId": "session-a"
  }'

# User B conversation
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Tell me about my journey",
    "userId": "user-b",
    "sessionId": "session-b"
  }'
```

### Verification (Supabase)
```sql
-- User B should NOT see User A's messages
SELECT * FROM maia_messages WHERE user_id = 'user-b';
-- Should only show User B's "Tell me about my journey" exchange

-- Verify RLS is working
SELECT * FROM maia_messages WHERE user_id = 'user-a';
-- Should only be accessible if authenticated as user-a
```

### Success Criteria
- ✅ Each user only retrieves their own messages
- ✅ MAIA's response to User B doesn't reference mountains
- ✅ Console logs show correct user_id for each query
- ✅ Supabase RLS prevents cross-user access

### Expected Issues
- ❌ User B sees User A's memories → query missing user_id filter
- ❌ RLS disabled → enable in migration

---

## Test 5: First-Time User (Empty History)

### Goal
Ensure MAIA handles new users gracefully without referencing non-existent history

### Steps
```bash
# Brand new user
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Hello MAIA, this is my first time",
    "userId": "brand-new-user",
    "sessionId": "first-session"
  }'
```

### Verification (Response)
MAIA should:
- ✅ Respond warmly without referencing past conversations
- ✅ NOT say "As we discussed before..."
- ✅ NOT say "You mentioned yesterday..."
- ✅ Treat this as a genuine first meeting

### Verification (Console)
```
💭 Retrieved 0 memories and 0 breakthroughs for brand-new-user
```

### Success Criteria
- ✅ No error when history is empty
- ✅ System prompt omits history section
- ✅ Response is appropriate for first interaction
- ✅ No awkward "last time" references

### Expected Issues
- ❌ Error on empty array → check `if (conversationHistory.length > 0)`
- ❌ Generic response → missing greeting logic

---

## Test 6: Cross-Session Continuity

### Goal
Verify memory persists after server restart or new session

### Steps
```bash
# Session 1 - Evening
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "I had a breakthrough about my fear of failure today",
    "userId": "test-persistence",
    "sessionId": "evening-session"
  }'

# RESTART SERVER (or wait and use new session)

# Session 2 - Morning (next day)
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "How should I approach my creative work today?",
    "userId": "test-persistence",
    "sessionId": "morning-session"
  }'
```

### Verification (Response)
MAIA should reference the fear of failure breakthrough from yesterday

### Success Criteria
- ✅ Morning response references yesterday's breakthrough
- ✅ Time label says "Yesterday" or "1 day ago"
- ✅ No loss of context across sessions
- ✅ Continuity feels natural

### Expected Issues
- ❌ No reference → memory not loading across sessions
- ❌ Says "Earlier today" for yesterday → time calculation wrong

---

## Test 7: Pattern Recognition

### Goal
Verify MAIA naturally weaves past context into responses

### Steps
```bash
# Create pattern across 3 days
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "I feel stuck with my writing again",
    "userId": "test-patterns",
    "sessionId": "day1"
  }'

# Wait or manipulate timestamp, then:
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Still struggling with my writing",
    "userId": "test-patterns",
    "sessionId": "day2"
  }'

curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "The writing is hard today too",
    "userId": "test-patterns",
    "sessionId": "day3"
  }'
```

### Verification (Response)
MAIA should notice the pattern: "This is the third time this week you've mentioned feeling stuck with writing..."

### Success Criteria
- ✅ Response shows pattern awareness
- ✅ Feels natural, not robotic
- ✅ Offers insight about the pattern
- ✅ Doesn't just repeat "you said that before"

### Expected Issues
- ❌ No pattern recognition → Claude needs more context
- ❌ Too mechanical → adjust prompt wording

---

## Test 8: Performance Under Load

### Goal
Ensure memory retrieval stays fast with multiple concurrent users

### Steps
```bash
# Run load test script
npm run test:memory-load

# Or manual parallel requests
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/oracle/personal \
    -H "Content-Type: application/json" \
    -d "{
      \"input\": \"Test message ${i}\",
      \"userId\": \"load-test-user-${i}\",
      \"sessionId\": \"session-${i}\"
    }" &
done
wait
```

### Verification (Console + Response Times)
Check:
- Average response time < 3 seconds
- Memory retrieval time < 100ms (look for "💭 Retrieved" timestamp)
- No timeout errors
- No database connection errors

### Success Criteria
- ✅ All requests complete successfully
- ✅ Response time acceptable (<3s)
- ✅ Memory queries stay fast (<100ms)
- ✅ No connection pool exhaustion

### Expected Issues
- ❌ Slow queries → add database indexes
- ❌ Connection errors → increase pool size
- ❌ Timeouts → adjust limits

---

## Test 9: Graceful Degradation

### Goal
Ensure conversation continues even if memory fails

### Steps
```typescript
// Temporarily break memory retrieval
// In PersonalOracleAgent.ts, modify getConversationHistory():
private async getConversationHistory(limit: number = 10): Promise<any[]> {
  throw new Error('Simulated memory failure');
}
```

### Verification (Response)
- ✅ Request still completes (no 500 error)
- ✅ MAIA responds without memory context
- ✅ Console shows warning about memory failure
- ✅ User experience degraded but not broken

### Success Criteria
- ✅ No errors thrown to user
- ✅ Response generated without history
- ✅ Warning logged for debugging
- ✅ Conversation can continue

### Expected Issues
- ❌ 500 error → missing try/catch
- ❌ Empty response → error not handled

---

## Automated Test Script

Create: `test/memory-integration-suite.ts`

```typescript
import { test, expect } from '@jest/globals';
import { PersonalOracleAgent } from '@/lib/agents/PersonalOracleAgent';

describe('MAIA Memory Integration', () => {
  test('saves messages to database', async () => {
    // Test 1 logic
  });

  test('retrieves conversation history', async () => {
    // Test 2 logic
  });

  test('isolates users', async () => {
    // Test 4 logic
  });

  test('handles empty history', async () => {
    // Test 5 logic
  });

  test('maintains cross-session continuity', async () => {
    // Test 6 logic
  });

  test('recognizes patterns', async () => {
    // Test 7 logic
  });

  test('degrades gracefully', async () => {
    // Test 9 logic
  });
});
```

---

## Manual Testing Checklist

### Pre-Monday QA

- [ ] Database saving works
- [ ] Memory retrieval works
- [ ] Context appears in prompts
- [ ] Multi-user isolation verified
- [ ] First-time users handled gracefully
- [ ] Cross-session continuity works
- [ ] Pattern recognition feels natural
- [ ] Performance acceptable (<3s, <100ms)
- [ ] Degrades gracefully on failure
- [ ] Console logs helpful for debugging
- [ ] No sensitive data leaked
- [ ] RLS policies enforced

### Beta User Simulation

Test as if you're a real beta user:

**Day 1:**
- [ ] Sign up / authenticate
- [ ] Have initial conversation
- [ ] Verify warmth and presence

**Day 2:**
- [ ] Return for second session
- [ ] Verify MAIA remembers yesterday
- [ ] Check time labels accurate

**Day 3:**
- [ ] Third session
- [ ] Verify pattern recognition
- [ ] Check breakthrough callbacks if relevant

### Edge Cases

- [ ] Very long messages (>1000 chars)
- [ ] Special characters / emojis
- [ ] Rapid successive messages
- [ ] Empty input handling
- [ ] Missing session ID
- [ ] Invalid user ID
- [ ] Database connection lost mid-request
- [ ] Claude API timeout

---

## Success Metrics

### Functional
- ✅ 100% of messages save correctly
- ✅ 100% of retrieval requests succeed
- ✅ 0% cross-user memory leaks
- ✅ 100% graceful degradation

### Performance
- ✅ <3s average response time
- ✅ <100ms memory query time
- ✅ Handles 10 concurrent users

### Experience
- ✅ Continuity feels natural
- ✅ Pattern recognition meaningful
- ✅ No awkward first-time-user bugs
- ✅ Breakthrough callbacks appropriate

---

## Monday Launch Go/No-Go Criteria

**GO if:**
- ✅ All critical tests pass
- ✅ Multi-user isolation verified
- ✅ Performance acceptable
- ✅ Graceful degradation works
- ✅ No data leaks

**NO-GO if:**
- ❌ Cross-user memory leaks
- ❌ Frequent memory failures
- ❌ Response time >5s consistently
- ❌ Data corruption risk
- ❌ RLS not enforced

---

## Post-Launch Monitoring

### Week 1 Metrics
- Memory save success rate
- Memory retrieval speed
- Pattern recognition frequency
- User-reported continuity issues
- Cross-session usage patterns

### Alerts to Set
- Memory save failure rate >5%
- Query time >200ms
- RLS violations
- Unexpected empty histories

---

Ready to run the tests? I can:
1. Set up the automated test suite
2. Walk through manual testing step-by-step
3. Create monitoring dashboard queries

Which would you like to start with?
