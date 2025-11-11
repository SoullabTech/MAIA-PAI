# Claude API Request Queue System

## Overview

The request queue system prevents rate limiting by spacing out Claude API requests intelligently. This ensures MAIA can handle multiple concurrent users without hitting Anthropic's rate limits.

---

## How It Works

### **The Problem**
```
Without Queue:
User A sends message → Claude API call (instant)
User B sends message → Claude API call (instant)
User C sends message → Claude API call (instant)
→ 🔴 Rate limit exceeded! 429 errors

With Queue:
User A sends message → Claude API call (instant)
User B sends message → Wait 1.5s → Claude API call
User C sends message → Wait 1.5s → Claude API call
→ ✅ Smooth, no rate limiting
```

### **Architecture**

```typescript
User Request
    ↓
/api/between/chat
    ↓
claudeQueue.add(() => fetch(Claude API), userId)
    ↓
Queue System
    ├─ Request 1 → Process immediately
    ├─ Request 2 → Wait 1.5s → Process
    ├─ Request 3 → Wait 1.5s → Process
    └─ Request 4 → Wait 1.5s → Process
    ↓
Claude API (rate limit safe!)
```

---

## Features

### 1. **Intelligent Spacing**
- Minimum 1.5 seconds between requests
- Adaptive delay based on queue length
- Maximum 10 second delay to prevent infinite waits

### 2. **Request Tracking**
- Tracks which user made each request
- Measures wait times per request
- Calculates success rates

### 3. **Metrics & Monitoring**
- Real-time queue status
- Average wait times
- Success/failure rates
- Health indicators

### 4. **Graceful Degradation**
- Continues processing even if some requests fail
- Doesn't block the entire queue on errors
- Provides detailed error logging

---

## Usage

### **In Your Code (Already Integrated)**

The queue is automatically used in `/app/api/between/chat/route.ts`:

```typescript
import { claudeQueue } from '@/lib/api/claude-queue';

// Wrap your Claude API call
const response = await claudeQueue.add(
  () => fetch('https://api.anthropic.com/v1/messages', {
    // ... your config
  }),
  userId // Track which user made the request
);
```

### **Monitor Queue Health**

Access real-time metrics at:
```
http://localhost:3000/api/queue/metrics
```

Returns:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-07T19:45:00.000Z",
  "metrics": {
    "totalRequests": 47,
    "successful": 45,
    "failed": 2,
    "successRate": "95.7%",
    "averageWaitTime": "2345ms",
    "currentQueueLength": 3,
    "lastProcessedAt": "2025-01-07T19:44:58.000Z"
  },
  "health": {
    "isHealthy": true,
    "message": "Queue is processing normally"
  }
}
```

### **Reset Metrics (Testing)**

```bash
curl -X POST http://localhost:3000/api/queue/metrics
```

---

## Testing

### **Run Test Suite**

The test script simulates multiple concurrent users:

```bash
# Make sure your dev server is running:
npm run dev

# In another terminal:
npx tsx scripts/test-queue.ts
```

This runs 3 tests:
1. **Light Load**: 2 users, 2 messages each (4 total)
2. **Moderate Load**: 5 users, 3 messages each (15 total)
3. **Heavy Load**: 10 users, 2 messages each (20 total)

### **Expected Results**

**Light Load (2 users):**
```
📊 Test Results:
   Total requests: 4
   Successful: 4 (100.0%)
   Failed: 0

⏱️  Response Times:
   Average: 2300ms
   Min: 1500ms
   Max: 4800ms

📈 Queue Metrics:
   Status: healthy
   Success Rate: 100.0%
   Average Wait Time: 1200ms
```

**Moderate Load (5 users):**
```
📊 Test Results:
   Total requests: 15
   Successful: 15 (100.0%)
   Failed: 0

⏱️  Response Times:
   Average: 5800ms
   Min: 1500ms
   Max: 12000ms
```

**Heavy Load (10 users):**
```
📊 Test Results:
   Total requests: 20
   Successful: 20 (100.0%)
   Failed: 0

⏱️  Response Times:
   Average: 10400ms
   Min: 1500ms
   Max: 25000ms

📈 Queue Metrics:
   Status: warning
   Message: Queue is backing up (8 requests waiting)
   💡 Consider upgrading API tier or implementing additional rate limiting
```

---

## Performance Characteristics

### **Capacity Estimates**

| Concurrent Users | Queue Delay | User Experience | Status |
|------------------|-------------|-----------------|--------|
| 1-2 | 0-3s | Instant | ✅ Excellent |
| 3-5 | 3-8s | Good | ✅ Good |
| 6-10 | 8-15s | Acceptable | ⚠️ Warning |
| 10-20 | 15-30s | Slow | 🔴 Poor |
| 20+ | 30s+ | Very slow | 🔴 Upgrade needed |

### **Recommendations by User Count**

**1-5 Users (Current Setup)**
```
✅ Request queue (already implemented)
✅ Exponential backoff retry
✅ Monitoring endpoint
Status: Good for beta testing
```

**5-15 Users**
```
⚠️ Monitor queue metrics regularly
⚠️ Consider Anthropic Tier 1 (100k tokens/min)
⚠️ Implement usage quotas per user
Status: Manageable with monitoring
```

**15-50 Users**
```
🔴 Upgrade to Anthropic Tier 2 (400k tokens/min)
🔴 Implement response caching
🔴 Add hybrid model strategy (Haiku for simple tasks)
Status: Requires infrastructure upgrades
```

**50+ Users (Production)**
```
🔴 Anthropic Enterprise tier
🔴 Multiple API keys with load balancing
🔴 Dedicated Redis queue
🔴 Edge caching for static content
Status: Full production infrastructure needed
```

---

## Console Logging

The queue system provides detailed logging:

```bash
# When requests are added:
📥 [QUEUE] Request added for user_123 (queue: 3)

# When processing starts:
🔄 [QUEUE] Starting to process 3 requests

# When each request is processed:
⚡ [QUEUE] Processing request for user_123 (waited 2400ms)
✅ [QUEUE] Request completed for user_123

# Between requests:
⏱️  [QUEUE] Waiting 1500ms before next request (queue: 2)

# When all complete:
✨ [QUEUE] All requests processed

# Periodic status:
📊 [QUEUE METRICS] {
  total: 47,
  successful: 45,
  failed: 2,
  successRate: '95.7%',
  avgWaitTime: '2345ms',
  currentQueue: 0,
  healthy: '✅'
}
```

---

## Configuration

### **Adjust Queue Timing**

Edit `/lib/api/claude-queue.ts`:

```typescript
class ClaudeRequestQueue {
  private minDelay = 1500;  // Minimum delay between requests (ms)
  private maxDelay = 10000; // Maximum delay (ms)

  // Adaptive delay calculation:
  const adaptiveDelay = Math.min(
    this.minDelay + (this.queue.length * 200), // +200ms per queued request
    this.maxDelay
  );
}
```

**Tuning Guide:**
- **Faster response** → Lower `minDelay` (e.g., 1000ms) - More risk of rate limits
- **Safer limits** → Higher `minDelay` (e.g., 2000ms) - Slower but more stable
- **Handle bursts** → Lower adaptive multiplier (e.g., 100ms) - Faster queue drain

---

## Troubleshooting

### **Queue is Backing Up**

```json
{
  "status": "warning",
  "metrics": { "currentQueueLength": 12 },
  "health": { "message": "Queue is backing up" }
}
```

**Solutions:**
1. Reduce request frequency
2. Upgrade Anthropic API tier
3. Implement user rate limiting
4. Add response caching

### **High Failure Rate**

```json
{
  "metrics": {
    "successRate": "72.3%",
    "failed": 15
  }
}
```

**Solutions:**
1. Check Claude API key validity
2. Verify network connectivity
3. Review error logs for patterns
4. Increase retry attempts

### **Very Long Wait Times**

```json
{
  "metrics": { "averageWaitTime": "45000ms" }
}
```

**Solutions:**
1. Too many concurrent users
2. Upgrade API tier immediately
3. Implement request prioritization
4. Add response caching

---

## Next Steps for Scaling

### **Phase 1: Monitoring (Now)**
- ✅ Queue system implemented
- ✅ Metrics endpoint available
- ✅ Test script created
- **Action**: Monitor during beta testing

### **Phase 2: Optimization (5-10 Users)**
- ⏳ Add response caching for common queries
- ⏳ Implement per-user rate limits
- ⏳ Upgrade to Anthropic Tier 1
- **Action**: Implement when queue backs up regularly

### **Phase 3: Production (50+ Users)**
- ⏳ Multiple API keys with load balancing
- ⏳ Hybrid model strategy (Haiku + Sonnet 4)
- ⏳ Dedicated Redis queue
- ⏳ Anthropic Enterprise contract
- **Action**: Plan 2-3 months before launch

---

## Files Created

```
/lib/api/claude-queue.ts              - Core queue implementation
/app/api/queue/metrics/route.ts       - Monitoring endpoint
/app/api/between/chat/route.ts        - Updated with queue integration
/scripts/test-queue.ts                - Test script
/QUEUE-SYSTEM.md                      - This documentation
```

---

## Support

If you experience issues:

1. Check queue metrics: `curl http://localhost:3000/api/queue/metrics`
2. Review console logs for queue activity
3. Run test script to diagnose: `npx tsx scripts/test-queue.ts`
4. Verify Anthropic API key has sufficient quota

---

**Queue system is live! 🚀 MAIA is now ready for multiple concurrent users.**
