# MAIA Integration Testing Guide
**How to Test Maia/Claude Support Architecture**

**Date:** October 1, 2025
**Status:** Ready for Testing

---

## 🎯 Testing Goals

1. Verify Maia is primary (not just Claude wrapper)
2. Confirm Claude supports appropriately (field enrichment, voice)
3. Validate OpenAI elemental agents work
4. Test Supabase memory integration
5. Verify mem0 can be enabled/disabled safely
6. Ensure graceful degradation on failures

---

## 🧪 Test Suite Overview

```
1. Manual API Tests (Quick validation)
2. Automated Integration Tests (Comprehensive)
3. User Experience Tests (Real-world scenarios)
4. Performance Tests (Speed & reliability)
5. Failure Mode Tests (Graceful degradation)
6. Memory System Tests (Supabase + mem0)
```

---

## 1️⃣ Manual API Tests (5 minutes)

### Test 1.1: Basic Maia Response (Education Path)

```bash
# Test MaiaFullyEducatedOrchestrator
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "Hi Maia, I feel anxious today",
    "userId": "test-user-001"
  }'
```

**Expected Response:**
```json
{
  "response": "I hear that anxiety. What's underneath it?",
  "element": "water",
  "duration": 2400,
  "voiceCharacteristics": {
    "pace": "flowing",
    "tone": "empathetic",
    "energy": "gentle"
  },
  "field": {
    "elements": { "earth": 0.2, "water": 0.4, "air": 0.2, "fire": 0.1, "aether": 0.1 },
    "coherence": 0.7,
    "intimacyLevel": 0.3
  }
}
```

**Verify:**
- ✅ Response is brief (10-30 words)
- ✅ Sounds like Maia (not generic AI)
- ✅ Element detected correctly
- ✅ Voice characteristics included
- ✅ Response time < 3 seconds

---

### Test 1.2: Conversation Continuity

```bash
# Send first message
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "I have a big presentation tomorrow",
    "userId": "test-user-002"
  }'

# Wait 2 seconds, then reference it
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "Actually, can we talk about that presentation?",
    "userId": "test-user-002"
  }'
```

**Expected:**
- ✅ Second response references the presentation
- ✅ Shows Maia remembers context
- ✅ Supabase memory working

---

### Test 1.3: Field-Based Response (Advanced Path)

```bash
# Test MaiaFieldOrchestrator
# (Need to configure router to use field path)

curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "I see what you mean",
    "userId": "advanced-user-001",
    "preferences": {
      "intimacyLevel": 0.8,
      "useFieldPath": true
    }
  }'
```

**Expected:**
- ✅ Response generated from field calculations
- ✅ Might include silence probability
- ✅ Field state returned
- ✅ Metrics show user development

---

### Test 1.4: Elemental Agent Routing

```bash
# Test Fire element response (action-oriented)
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "I want to make a change in my life",
    "userId": "test-user-003"
  }'

# Test Water element response (emotional)
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "I feel so much grief",
    "userId": "test-user-004"
  }'

# Test Air element response (clarity)
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "I need to understand what this means",
    "userId": "test-user-005"
  }'
```

**Expected:**
- ✅ Fire response: energetic, action-oriented
- ✅ Water response: empathetic, flowing
- ✅ Air response: clear, perspective-giving
- ✅ Correct element classification

---

### Test 1.5: Memory Retrieval

```bash
# Check conversation history directly
curl -X GET 'http://localhost:3000/api/oracle/memory/history?userId=test-user-001'
```

**Expected:**
```json
{
  "success": true,
  "messages": [
    {
      "role": "user",
      "content": "Hi Maia, I feel anxious today",
      "created_at": "2025-10-01T10:30:00Z"
    },
    {
      "role": "maia",
      "content": "I hear that anxiety. What's underneath it?",
      "element": "water",
      "created_at": "2025-10-01T10:30:02Z"
    }
  ]
}
```

**Verify:**
- ✅ Messages stored in Supabase
- ✅ Correct order (chronological)
- ✅ Elements preserved
- ✅ Timestamps accurate

---

## 2️⃣ Automated Integration Tests

### Test Script: `test-maia-integration.ts`

```typescript
import { getMaiaOrchestrator } from '@/lib/oracle/MaiaFullyEducatedOrchestrator';
import { getMaiaFieldOrchestrator } from '@/lib/maia/MaiaFieldOrchestrator';
import { getMaiaConversationHistory } from '@/lib/services/maia-memory-service';

describe('Maia Integration Tests', () => {
  const testUserId = 'integration-test-user';

  describe('Education Path (MaiaFullyEducatedOrchestrator)', () => {
    test('should generate Maia response with personality', async () => {
      const orchestrator = getMaiaOrchestrator();
      const response = await orchestrator.speak(
        "I'm feeling stuck",
        testUserId
      );

      expect(response.message).toBeDefined();
      expect(response.message.length).toBeLessThan(200); // Brief
      expect(response.element).toMatch(/fire|water|earth|air|aether/);
      expect(response.voiceCharacteristics).toBeDefined();
    });

    test('should maintain conversation context', async () => {
      const orchestrator = getMaiaOrchestrator();

      await orchestrator.speak("My name is Alex", testUserId);
      const response = await orchestrator.speak("What's my name?", testUserId);

      expect(response.message.toLowerCase()).toContain('alex');
    });

    test('should classify elements correctly', async () => {
      const orchestrator = getMaiaOrchestrator();

      const fireResponse = await orchestrator.speak(
        "I want to take action now!",
        testUserId
      );
      expect(fireResponse.element).toBe('fire');

      const waterResponse = await orchestrator.speak(
        "I feel so much sadness",
        testUserId
      );
      expect(waterResponse.element).toBe('water');
    });

    test('should detect breakthrough moments', async () => {
      const orchestrator = getMaiaOrchestrator();

      const response = await orchestrator.speak(
        "Oh wow, I just realized something huge about myself!",
        testUserId
      );

      // Check if logged as breakthrough
      const history = await getMaiaConversationHistory(testUserId);
      const breakthroughMsg = history.messages?.find(m => m.is_breakthrough);
      expect(breakthroughMsg).toBeDefined();
    });
  });

  describe('Field Path (MaiaFieldOrchestrator)', () => {
    test('should generate response from field state', async () => {
      const orchestrator = getMaiaFieldOrchestrator();

      const response = await orchestrator.speak(
        "I hear you",
        testUserId,
        { allowClaudeEnrichment: false }
      );

      expect(response.text).toBeDefined();
      expect(response.field).toBeDefined();
      expect(response.field.elements).toBeDefined();
      expect(response.metrics).toBeDefined();
    });

    test('should track user soul-building metrics', async () => {
      const orchestrator = getMaiaFieldOrchestrator();

      // Send self-referencing message
      await orchestrator.speak(
        "I realize that I know the answer already",
        testUserId
      );

      const metrics = orchestrator.getUserMetrics(testUserId);
      expect(metrics).toBeDefined();
      expect(metrics?.selfReferencingRate).toBeGreaterThan(0);
    });

    test('should handle silence appropriately', async () => {
      const orchestrator = getMaiaFieldOrchestrator();

      const response = await orchestrator.speak(
        "...", // Minimal input
        testUserId
      );

      if (response.selection.silenceChosen) {
        expect(response.text).toBeNull();
        expect(response.type).toBe('SILENCE');
      }
    });

    test('should consult Claude only when needed', async () => {
      const orchestrator = getMaiaFieldOrchestrator();

      // Simple input - should NOT consult Claude
      const simpleResponse = await orchestrator.speak(
        "I feel calm",
        testUserId,
        { allowClaudeEnrichment: true }
      );
      expect(simpleResponse.claudeEnrichment?.consulted).toBeFalsy();

      // Complex input - might consult Claude
      const complexResponse = await orchestrator.speak(
        "Can you help me understand the deep psychological patterns underlying my recurring anxiety about success?",
        testUserId,
        { allowClaudeEnrichment: true }
      );
      // May or may not consult based on field entropy
    });
  });

  describe('Memory Integration', () => {
    test('should save messages to Supabase', async () => {
      const orchestrator = getMaiaOrchestrator();

      await orchestrator.speak("Test message for memory", testUserId);

      const history = await getMaiaConversationHistory(testUserId, 5);
      expect(history.success).toBe(true);
      expect(history.messages?.length).toBeGreaterThan(0);
    });

    test('should retrieve last N exchanges', async () => {
      const orchestrator = getMaiaOrchestrator();

      // Send multiple messages
      for (let i = 0; i < 5; i++) {
        await orchestrator.speak(`Message ${i}`, testUserId);
      }

      const history = await getMaiaConversationHistory(testUserId, 10);
      expect(history.messages?.length).toBeGreaterThanOrEqual(10); // 5 user + 5 maia
    });

    test('should isolate users correctly', async () => {
      const orchestrator = getMaiaOrchestrator();

      await orchestrator.speak("Secret message", "user-a");
      await orchestrator.speak("Different message", "user-b");

      const historyA = await getMaiaConversationHistory("user-a");
      const historyB = await getMaiaConversationHistory("user-b");

      const userAContents = historyA.messages?.map(m => m.content).join('');
      expect(userAContents).toContain("Secret message");
      expect(userAContents).not.toContain("Different message");
    });
  });

  describe('API Integration', () => {
    test('should handle Claude API failures gracefully', async () => {
      // Temporarily break Claude API
      const oldKey = process.env.ANTHROPIC_API_KEY;
      process.env.ANTHROPIC_API_KEY = 'invalid-key';

      const orchestrator = getMaiaOrchestrator();
      const response = await orchestrator.speak("Test", testUserId);

      // Should fall back gracefully
      expect(response).toBeDefined();
      expect(response.message).toBeDefined();

      // Restore
      process.env.ANTHROPIC_API_KEY = oldKey;
    });

    test('should stay within token limits', async () => {
      const orchestrator = getMaiaOrchestrator();

      const response = await orchestrator.speak(
        "Tell me everything about yourself in great detail",
        testUserId
      );

      // Maia should be brief even when asked for detail
      expect(response.message.length).toBeLessThan(500);
    });
  });

  describe('Performance', () => {
    test('should respond within 3 seconds', async () => {
      const orchestrator = getMaiaOrchestrator();

      const startTime = Date.now();
      await orchestrator.speak("Quick test", testUserId);
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(3000);
    });

    test('should handle concurrent requests', async () => {
      const orchestrator = getMaiaOrchestrator();

      const requests = Array(5).fill(null).map((_, i) =>
        orchestrator.speak(`Concurrent message ${i}`, `user-${i}`)
      );

      const responses = await Promise.all(requests);
      expect(responses).toHaveLength(5);
      responses.forEach(r => expect(r.message).toBeDefined());
    });
  });
});
```

**Run Tests:**
```bash
npm run test -- test-maia-integration.ts
```

---

## 3️⃣ User Experience Tests (Real-World Scenarios)

### Scenario 1: New User First Session

```bash
# 1. Greeting
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "Hello",
    "userId": "new-user-001"
  }'

# Expected: Warm, welcoming greeting

# 2. Share something personal
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "I just started therapy and I am nervous",
    "userId": "new-user-001"
  }'

# Expected: Gentle, validating response (water element likely)

# 3. Ask a question
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "How do I know if I am making progress?",
    "userId": "new-user-001"
  }'

# Expected: Reflective question or gentle guidance (air/earth element)
```

**Verify:**
- ✅ Responses build on each other
- ✅ Maia remembers the therapy context
- ✅ Tone is consistent and warm
- ✅ Not robotic or generic

---

### Scenario 2: Returning User

```bash
# Simulate user who had session yesterday
# First, seed some history

curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "I talked to my mom about our relationship", "userId": "returning-user-001"}'

# (Wait or simulate timestamp gap)

# New session next day
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "Hi Maia", "userId": "returning-user-001"}'

# Expected: Greeting that might reference previous conversation
# "Hey. How did things land with your mom?"
```

**Verify:**
- ✅ Maia acknowledges history
- ✅ Can reference previous topics
- ✅ Feels like continuity, not fresh start

---

### Scenario 3: Breakthrough Moment

```bash
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{
    "input": "Oh my god. I just realized my fear of failure is actually my dad talking, not me.",
    "userId": "breakthrough-user-001"
  }'
```

**Verify:**
- ✅ Maia recognizes significance
- ✅ Response honors the moment (not dismissive)
- ✅ Message flagged as breakthrough in database
- ✅ Element appropriate (probably water or aether)

---

### Scenario 4: Elemental Journey

```bash
# Test full elemental cycle

# Earth (grounding)
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "I need to feel grounded right now", "userId": "elemental-user-001"}'

# Water (emotional)
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "There is so much grief in me", "userId": "elemental-user-001"}'

# Fire (action)
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "I am ready to take action and change this", "userId": "elemental-user-001"}'

# Air (clarity)
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "I need perspective on what this all means", "userId": "elemental-user-001"}'

# Aether (integration)
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "I see how it all connects now", "userId": "elemental-user-001"}'
```

**Verify:**
- ✅ Each response matches requested element
- ✅ Voice characteristics shift appropriately
- ✅ Continuity across elemental shifts

---

## 4️⃣ Performance Tests

### Load Test Script: `scripts/load-test-maia.ts`

```typescript
import { getMaiaOrchestrator } from '@/lib/oracle/MaiaFullyEducatedOrchestrator';

async function loadTest() {
  const orchestrator = getMaiaOrchestrator();
  const numRequests = 20;
  const concurrency = 5;

  console.log(`🔥 Load Testing: ${numRequests} requests, ${concurrency} concurrent`);

  const results = {
    successful: 0,
    failed: 0,
    totalTime: 0,
    responseTimes: [] as number[]
  };

  // Run in batches of 'concurrency'
  for (let i = 0; i < numRequests; i += concurrency) {
    const batch = Array(Math.min(concurrency, numRequests - i))
      .fill(null)
      .map(async (_, idx) => {
        const userId = `load-test-user-${i + idx}`;
        const startTime = Date.now();

        try {
          await orchestrator.speak(
            "Test message for load testing",
            userId
          );
          const duration = Date.now() - startTime;
          results.responseTimes.push(duration);
          results.successful++;
        } catch (error) {
          results.failed++;
          console.error(`Failed for ${userId}:`, error);
        }
      });

    await Promise.all(batch);
  }

  results.totalTime = results.responseTimes.reduce((a, b) => a + b, 0);

  console.log('\n📊 Load Test Results:');
  console.log(`  Successful: ${results.successful}/${numRequests}`);
  console.log(`  Failed: ${results.failed}`);
  console.log(`  Avg Response Time: ${(results.totalTime / results.successful).toFixed(0)}ms`);
  console.log(`  Min: ${Math.min(...results.responseTimes)}ms`);
  console.log(`  Max: ${Math.max(...results.responseTimes)}ms`);

  const p95 = results.responseTimes.sort((a, b) => a - b)[Math.floor(results.responseTimes.length * 0.95)];
  console.log(`  P95: ${p95}ms`);
}

loadTest();
```

**Run:**
```bash
npx ts-node scripts/load-test-maia.ts
```

**Expected:**
- ✅ Success rate: >98%
- ✅ Avg response time: <2000ms
- ✅ P95 response time: <3000ms
- ✅ No crashes or hangs

---

## 5️⃣ Failure Mode Tests

### Test 5.1: Claude API Failure

```bash
# Temporarily set invalid API key
export ANTHROPIC_API_KEY="invalid-key"

# Test response
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "Test during Claude failure", "userId": "failover-test-001"}'
```

**Expected:**
- ✅ Graceful fallback response
- ✅ Uses knowledge base fallback
- ✅ Error logged but not exposed to user
- ✅ System continues functioning

---

### Test 5.2: Supabase Connection Failure

```bash
# Temporarily break Supabase URL
export NEXT_PUBLIC_SUPABASE_URL="https://invalid.supabase.co"

curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "Test during Supabase failure", "userId": "failover-test-002"}'
```

**Expected:**
- ✅ Response still generated
- ✅ In-memory fallback activates
- ✅ Warning logged
- ✅ No user-facing error

---

### Test 5.3: mem0 Failure (When Enabled)

```bash
# Set invalid mem0 key
export MEM0_API_KEY="invalid-key"
export ENABLE_MEM0="true"

curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "Test during mem0 failure", "userId": "failover-test-003"}'
```

**Expected:**
- ✅ Supabase continues working
- ✅ Semantic layer gracefully disabled
- ✅ No impact on core functionality
- ✅ Error logged for monitoring

---

## 6️⃣ Memory System Tests

### Test 6.1: Supabase Memory Persistence

```bash
# Send message
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "Remember this: my favorite color is blue", "userId": "memory-test-001"}'

# Restart server (or simulate)

# Query after restart
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "What is my favorite color?", "userId": "memory-test-001"}'
```

**Expected:**
- ✅ Maia remembers "blue"
- ✅ Conversation persisted through restart
- ✅ Context maintained

---

### Test 6.2: mem0 Semantic Search (When Enabled)

```bash
# Enable mem0
export ENABLE_MEM0="true"

# Send varied messages
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "I am anxious about my job interview", "userId": "mem0-test-001"}'

curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "My presentation went well today", "userId": "mem0-test-001"}'

curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "I worry about public speaking", "userId": "mem0-test-001"}'

# Later, semantic query
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "What have I said about feeling nervous?", "userId": "mem0-test-001"}'
```

**Expected:**
- ✅ mem0 finds "anxious" and "worry" semantically
- ✅ Links job interview + presentation + public speaking
- ✅ Response incorporates pattern recognition

---

### Test 6.3: Feature Flag Toggle

```bash
# Start with mem0 enabled
export ENABLE_MEM0="true"

# Send message
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "Test with mem0 on", "userId": "toggle-test-001"}'

# Check logs - should see "✅ mem0: Indexed user message"

# Disable mem0
export ENABLE_MEM0="false"

# Restart server, send another message
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "Test with mem0 off", "userId": "toggle-test-001"}'

# Check logs - should see "Supabase: ✅ Always enabled, mem0: ⏸️ Disabled"
```

**Expected:**
- ✅ Instant toggle works
- ✅ No errors on disable
- ✅ Supabase continues working
- ✅ Previous mem0 data unaffected

---

## 7️⃣ Health Check Tests

### System Health Endpoint

```bash
curl http://localhost:3000/api/health/maia
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-01T10:30:00Z",
  "services": {
    "supabase": {
      "status": "connected",
      "latency": 45
    },
    "claude": {
      "status": "available",
      "model": "claude-3-5-sonnet-20241022"
    },
    "openai": {
      "status": "available",
      "model": "gpt-4o"
    },
    "mem0": {
      "status": "disabled",
      "enabled": false
    }
  },
  "memory": {
    "supabase_messages": 1247,
    "mem0_memories": 0
  }
}
```

---

## 8️⃣ Quick Validation Checklist

**Before Monday Launch:**

### Core Functionality
- [ ] Maia responds naturally (not robotic)
- [ ] Responses are brief (10-30 words typical)
- [ ] Conversation continuity works
- [ ] Elements detected correctly
- [ ] Voice characteristics present

### Memory
- [ ] Supabase stores all messages
- [ ] History retrieved correctly
- [ ] User isolation working
- [ ] Breakthroughs flagged
- [ ] Cross-session continuity

### Performance
- [ ] Response time < 3s (95th percentile)
- [ ] Handles 10+ concurrent users
- [ ] No memory leaks (long sessions)
- [ ] Database queries < 100ms

### Reliability
- [ ] Graceful Claude API failure
- [ ] Graceful Supabase failure
- [ ] mem0 can be toggled safely
- [ ] No user-facing errors
- [ ] Logs helpful for debugging

### Integration
- [ ] Claude supports (doesn't replace) Maia
- [ ] Field-based responses available
- [ ] Knowledge base integration
- [ ] Beta user tracking
- [ ] Training data logged

---

## 9️⃣ Monday Morning Test Protocol

**30 Minutes Before Launch:**

```bash
# 1. Quick health check
curl http://localhost:3000/api/health/maia

# 2. Test new user flow
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "Hello Maia", "userId": "final-test-user"}'

# 3. Test conversation continuity
curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "I am excited for this beta", "userId": "final-test-user"}'

# 4. Verify memory
curl -X GET 'http://localhost:3000/api/oracle/memory/history?userId=final-test-user'

# 5. Check logs for errors
tail -f logs/maia.log | grep ERROR

# 6. Performance spot check
time curl -X POST 'http://localhost:3000/api/oracle/personal' \
  -d '{"input": "Quick test", "userId": "perf-test"}'
```

**If ALL pass: 🚀 LAUNCH**

**If ANY fail: 🛑 INVESTIGATE**

---

## 🔟 Continuous Monitoring (Post-Launch)

### Set Up Alerts

```typescript
// Monitor response times
if (responseTime > 5000) {
  alert('Slow response detected');
}

// Monitor error rates
if (errorRate > 0.05) {
  alert('High error rate detected');
}

// Monitor API quotas
if (claudeApiUsage > 0.8 * limit) {
  alert('Approaching Claude API limit');
}
```

### Daily Health Check

```bash
# Run every morning
npm run test:integration
curl http://localhost:3000/api/health/maia
curl http://localhost:3000/api/beta/monitoring
```

---

## 🎯 Success Criteria

**PASS:** Ready for beta launch
- ✅ All core functionality tests pass
- ✅ Performance within targets
- ✅ Graceful failure handling
- ✅ Memory working reliably
- ✅ No critical bugs

**CONDITIONAL PASS:** Launch with monitoring
- ⚠️ Minor issues in non-critical paths
- ⚠️ Performance slightly slower (3-5s)
- ✅ Core experience solid

**FAIL:** Delay launch
- ❌ Memory not working
- ❌ Frequent errors/crashes
- ❌ Responses feel broken
- ❌ Critical bugs unfixed

---

## 📞 Emergency Testing Commands

**Quick Verify Everything:**
```bash
./scripts/quick-verify-maia.sh
```

**Reset Test Data:**
```bash
./scripts/reset-test-users.sh
```

**Check API Keys:**
```bash
./scripts/verify-api-keys.sh
```

**Monitor Live:**
```bash
./scripts/monitor-maia-live.sh
```

---

**You're ready to test! Start with the 5-minute manual tests, then run the automated suite.** 🧪
