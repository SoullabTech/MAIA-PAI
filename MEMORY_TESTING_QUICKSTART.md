# Memory Testing - Quick Start Guide
**Get testing in 5 minutes!**

## Option 1: Automated Tests (Fastest)

```bash
# 1. Make sure your dev server is running
npm run dev

# 2. In another terminal, run the test suite
./test/run-memory-tests.sh

# Expected output:
# ✅ Test 1: Memory Saving
# ✅ Test 2: Memory Retrieval
# ✅ Test 3: Multi-User Isolation
# ✅ Test 4: First-Time User
# ✅ Test 5: Cross-Session Continuity
# ✅ Test 6: Performance
```

**What to watch for:**
- All tests should pass ✅
- Check console logs for "💭 Retrieved X memories"
- Response time should be <3 seconds

---

## Option 2: Manual Testing (Most Thorough)

### Quick 3-Test Flow

**Test 1: Basic Memory (2 minutes)**
```bash
# Send first message
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "I am feeling anxious about my creative work",
    "userId": "your-test-user",
    "sessionId": "test-session-001"
  }'

# Send follow-up
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "How should I handle this anxiety?",
    "userId": "your-test-user",
    "sessionId": "test-session-001"
  }'

# ✅ PASS if: Second response references the anxiety you mentioned
```

**Test 2: Check Database (1 minute)**
```sql
-- In Supabase SQL Editor
SELECT
  role,
  LEFT(content, 80) as preview,
  created_at
FROM maia_messages
WHERE user_id = 'your-test-user'
ORDER BY created_at DESC;

-- ✅ PASS if: You see 4 rows (2 user + 2 maia messages)
```

**Test 3: Check Server Logs (30 seconds)**
```bash
# Look for this in your terminal where dev server is running:
💭 Retrieved 2 memories and 0 breakthroughs for your-test-user
✅ MAIA message saved: user (I am feeling anxious...)
✅ MAIA message saved: maia (response...)

# ✅ PASS if: You see memory retrieval and save confirmations
```

---

## Option 3: In-Browser Testing (Most Realistic)

### Setup
1. Open your app: `http://localhost:3000`
2. Sign in or use test credentials
3. Open browser DevTools → Network tab

### Test Flow
**Day 1 (Evening):**
1. Chat with MAIA: "I had a breakthrough about my fear of failure today"
2. Note her response
3. Close browser completely

**Day 2 (Morning):**
1. Open app again (new session!)
2. Chat with MAIA: "How should I approach my work today?"
3. **✅ PASS if:** She references yesterday's breakthrough

---

## Quick Database Verification

### Supabase Dashboard Check

1. Go to Supabase → SQL Editor
2. Paste from `test/check-database.sql`
3. Run Query #15: "Monday launch readiness check"

**Expected Output:**
```
maia_messages_exists: ✅
maia_sessions_exists: ✅
rls_enabled: ✅
user_index_exists: ✅
recent_activity: ✅
data_quality: ✅
```

---

## Critical Tests for Monday

### Must Pass:
- ✅ Memory saves to database
- ✅ Memory loads on next request
- ✅ No cross-user contamination
- ✅ First-time users don't see errors

### Should Pass:
- ✅ Cross-session continuity
- ✅ Pattern recognition
- ✅ Performance <3s

### Nice to Have:
- ✅ Breakthrough callbacks
- ✅ Natural time labels ("Yesterday", "3 days ago")

---

## Troubleshooting

### "Retrieved 0 memories"
**Problem:** Memory not loading
**Check:**
- Is Supabase connected? (check env vars)
- Did messages save? (run SQL query)
- Is user_id correct?

### "Response doesn't reference past"
**Problem:** History not in prompt
**Check:**
- Console logs show "Retrieved X memories"?
- Is `conversationHistory.length > 0`?
- Is Claude prompt including history section?

### "User A sees User B's memories"
**Problem:** RLS not working
**Fix:** Run migration to enable RLS policies
```sql
ALTER TABLE maia_messages ENABLE ROW LEVEL SECURITY;
```

### "Errors on first-time users"
**Problem:** Code doesn't handle empty history
**Check:** Look for `if (conversationHistory.length > 0)` guards

---

## Performance Benchmarks

**Acceptable:**
- Response time: <3 seconds
- Memory query: <100ms
- 10 concurrent users: No errors

**Optimal:**
- Response time: <2 seconds
- Memory query: <50ms
- 50 concurrent users: No errors

---

## Monday Launch Checklist

Before going live:

### Database
- [ ] `maia_messages` table exists
- [ ] `maia_sessions` table exists
- [ ] RLS policies enabled
- [ ] Indexes created
- [ ] No test data in production

### Code
- [ ] Memory saving works
- [ ] Memory retrieval works
- [ ] Multi-user isolation verified
- [ ] First-time users handled
- [ ] Error handling in place

### Testing
- [ ] Manual test flow completed
- [ ] Automated tests pass
- [ ] Database queries verified
- [ ] Server logs look clean
- [ ] No console errors in browser

### Monitoring
- [ ] Database dashboard ready
- [ ] Error tracking enabled
- [ ] Performance metrics baseline set
- [ ] User feedback mechanism ready

---

## Quick Commands Reference

```bash
# Run automated tests
./test/run-memory-tests.sh

# Check database (copy/paste in Supabase)
# See: test/check-database.sql

# Manual API test
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{"input": "test", "userId": "test-user", "sessionId": "test"}'

# Watch server logs
npm run dev | grep "💭\|✅"

# Check specific user's memories
# In Supabase SQL Editor:
SELECT * FROM maia_messages WHERE user_id = 'specific-user-id' ORDER BY created_at DESC;
```

---

## Success Criteria

**You're ready for Monday if:**
1. ✅ All 6 automated tests pass
2. ✅ Manual 3-test flow works
3. ✅ Database readiness check shows all ✅
4. ✅ No console errors during testing
5. ✅ Response times acceptable

**Optional but recommended:**
- In-browser test flow works end-to-end
- Multiple test users created with varied histories
- Performance test with 10+ concurrent users

---

## Next Steps After Testing

1. **If all tests pass:**
   - Document any quirks found
   - Set up monitoring dashboards
   - Prepare user feedback collection
   - Schedule Monday morning final check

2. **If tests fail:**
   - Review error logs
   - Check implementation against docs
   - Run database migrations
   - Verify environment variables
   - Retest after fixes

3. **For production:**
   - Clean up test users from database
   - Verify production env vars set
   - Test with real Supabase production instance
   - Set up alerts for memory failures

---

**Ready to test? Start with the automated suite, then do manual verification!** 🧪
