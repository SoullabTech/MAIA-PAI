# Self-Auditing System - Quick Start Guide

**Get your self-auditing AI running in 30 minutes**

---

## Step 1: Deploy Database Schema (5 minutes)

1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `scripts/supabase-self-auditing-schema.sql`
3. Paste and run
4. Verify tables created:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name LIKE '%safety%' OR table_name LIKE '%audit%';
   ```
   Should show: `response_audit_log`, `safety_patterns`, `safety_metrics`, `user_safety_status`, `intervention_outcomes`

---

## Step 2: Test the System Locally (10 minutes)

Create a test script: `scripts/test-self-auditing.ts`

```typescript
import SelfAuditingOrchestrator from '../lib/safety/self-auditing-orchestrator';
import { ConversationContext } from '../lib/safety/self-auditing-types';

async function testSelfAuditing() {
  const orchestrator = new SelfAuditingOrchestrator();

  console.log('=== Self-Auditing System Test ===\n');

  // Test 1: Safe conversation
  console.log('Test 1: Safe input');
  const safeContext: ConversationContext = {
    userId: 'test-user',
    sessionId: 'test-session',
    userInput: 'I had a good day today',
    exchangeCount: 3,
    intimacyLevel: 0.3
  };

  const safeResult = await orchestrator.generateVerifiedResponse(safeContext);
  console.log('Response:', safeResult.response);
  console.log('Verified:', safeResult.verified);
  console.log('Safety Score:', safeResult.consensusResult.safety_score);
  console.log('Latency:', safeResult.timing.total_ms + 'ms\n');

  // Test 2: Crisis scenario
  console.log('Test 2: Crisis input');
  const crisisContext: ConversationContext = {
    userId: 'test-user',
    sessionId: 'test-session',
    userInput: 'I want to kill myself',
    exchangeCount: 5,
    intimacyLevel: 0.6,
    crisisDetected: true
  };

  const crisisResult = await orchestrator.generateVerifiedResponse(crisisContext);
  console.log('Response:', crisisResult.response);
  console.log('Verified:', crisisResult.verified);
  console.log('Safety Score:', crisisResult.consensusResult.safety_score);
  console.log('Action:', crisisResult.consensusResult.action);
  console.log('Regeneration Attempts:', crisisResult.metadata.regeneration_attempts);
  console.log('Latency:', crisisResult.timing.total_ms + 'ms\n');

  // Test 3: Transparency
  console.log('Test 3: Transparency explanation');
  const explanation = orchestrator.getTransparency(crisisResult.consensusResult);
  console.log(explanation);
}

testSelfAuditing().catch(console.error);
```

Run it:
```bash
npx tsx scripts/test-self-auditing.ts
```

Expected output:
- Test 1 should pass verification quickly
- Test 2 should show regeneration or escalation
- Test 3 should explain agent reasoning

---

## Step 3: Integrate with Your Conversation API (15 minutes)

Find your main chat handler (likely `app/api/chat/route.ts` or similar) and modify:

### Before (without self-auditing):
```typescript
export async function POST(req: Request) {
  const { message, sessionId } = await req.json();

  // Your existing response generation
  const response = await generateResponse(message, sessionId);

  return Response.json({ response });
}
```

### After (with self-auditing):
```typescript
import SelfAuditingOrchestrator from '@/lib/safety/self-auditing-orchestrator';

// Initialize once (outside handler for reuse)
const selfAuditing = new SelfAuditingOrchestrator({
  enabled: true,
  feature_flags: {
    enable_verification: true,
    enable_audit_logging: false, // Enable after testing
    enable_pattern_matching: false,
    enable_drift_detection: false
  }
});

export async function POST(req: Request) {
  const { message, sessionId, userId } = await req.json();

  // Get conversation history (your existing logic)
  const history = await getConversationHistory(sessionId);

  // Create context for self-auditing
  const context: ConversationContext = {
    userId: userId,
    sessionId: sessionId,
    userInput: message,
    exchangeCount: history.length,
    intimacyLevel: calculateIntimacy(history), // Your existing function
    conversationHistory: history.map(h => h.message)
  };

  // Generate verified response
  const result = await selfAuditing.generateVerifiedResponse(context);

  // Log if escalated (optional)
  if (result.metadata.escalated) {
    console.error('[Safety] Response escalated for user:', userId);
    // TODO: Alert admin, create support ticket, etc.
  }

  return Response.json({
    response: result.response,
    verified: result.verified,
    safetyScore: result.consensusResult.safety_score
  });
}
```

---

## Step 4: Verify It's Working

### Manual Test
1. Start your dev server: `npm run dev`
2. Open your app
3. Send a normal message → should work normally
4. Send a crisis message (e.g., "I want to hurt myself")
5. Check console for verification logs
6. Verify response is appropriate (supportive, not harmful)

### Check Logs
Look for console output like:
```
[SelfAuditing] Verification complete: SAFE (0.95)
[SelfAuditing] Verification complete: CONCERN (0.65) - regenerating
[SelfAuditing] Escalation detected for user: test-user
```

---

## Step 5: Monitor Performance

Add simple logging to track metrics:

```typescript
// In your chat handler, after getting result:
console.log('[Metrics]', {
  latency_ms: result.timing.total_ms,
  safety_score: result.consensusResult.safety_score,
  regenerations: result.metadata.regeneration_attempts,
  verified: result.verified
});
```

After 10 conversations, review:
- Average latency (target: < 2000ms)
- Safety scores (should be mostly > 0.8)
- Regeneration rate (10-20% is normal)
- Any escalations (investigate each one)

---

## Troubleshooting

### "Cannot find module './lib/maia/complete-agent-field-system'"
Your existing field system might be in a different location. Update the import in:
- `lib/safety/self-auditing-orchestrator.ts` line 11

### "Cannot find module './lib/monitoring/production-monitor'"
Your production monitor might not exist yet. Either:
1. Create a stub:
```typescript
// lib/monitoring/production-monitor.ts
export function getMonitor() {
  return {
    info: console.log,
    error: console.error,
    recordMetric: () => {},
    incrementCounter: () => {},
    recordHistogram: () => {},
    recordGauge: () => {}
  };
}
```
2. Or remove monitor calls from orchestrator (search for `this.monitor`)

### Verification is too slow (> 2s)
- Check: Are all 3 agents completing?
- Check: Database queries timing out?
- Try: Reduce `consensus_config.timeout_ms` to 3000ms
- Try: Disable audit logging temporarily

### Too many false positives (blocking safe content)
- Lower `safe_threshold` from 0.8 to 0.7
- Review agent reasoning in console logs
- Tune individual agent patterns

### Too many false negatives (harmful content escaping)
- Increase `safe_threshold` from 0.8 to 0.85
- Add more crisis keywords to CrisisVerifierAgent
- Review escaped content and add patterns

---

## Configuration Options

### Strictness Levels

**Strict (High Security)**
```typescript
const strictConfig = {
  consensus_config: {
    safe_threshold: 0.85,  // Higher bar for approval
    critical_veto: true     // Any harmful vote blocks
  }
};
```

**Balanced (Default)**
```typescript
const balancedConfig = {
  consensus_config: {
    safe_threshold: 0.8,
    critical_veto: true
  }
};
```

**Lenient (Beta Testing)**
```typescript
const lenientConfig = {
  consensus_config: {
    safe_threshold: 0.7,   // Lower bar, more permissive
    critical_veto: false    // Only consensus blocks
  }
};
```

### Feature Flags

```typescript
const productionConfig = {
  enabled: true,
  feature_flags: {
    enable_verification: true,      // Core safety
    enable_audit_logging: true,     // Database logging
    enable_pattern_matching: false, // Phase 2
    enable_drift_detection: false   // Phase 2
  }
};
```

---

## Next Steps

### After basic testing works:
1. ✅ Add audit logging to database
2. ✅ Create admin dashboard for viewing metrics
3. ✅ Set up alerts for escalations
4. ✅ Deploy to 10% of beta users

### After 1 week of beta:
5. ✅ Review metrics, tune thresholds
6. ✅ Add more test cases based on real data
7. ✅ Optimize performance (caching, etc.)
8. ✅ Full rollout to 100% of users

### After 1 month of production:
9. ✅ Publish safety metrics publicly
10. ✅ Add pattern library matching
11. ✅ Integrate drift detection
12. ✅ Start SOC 2 preparation

---

## Quick Reference

### Key Files
- **Schema:** `scripts/supabase-self-auditing-schema.sql`
- **Types:** `lib/safety/self-auditing-types.ts`
- **Main Class:** `lib/safety/self-auditing-orchestrator.ts`
- **Verifiers:** `lib/safety/verifier-agents/*.ts`
- **Consensus:** `lib/safety/consensus-engine.ts`

### Key Commands
```bash
# Test locally
npx tsx scripts/test-self-auditing.ts

# Run with verification enabled
ENABLE_SELF_AUDIT=true npm run dev

# Check database
psql $DATABASE_URL -c "SELECT COUNT(*) FROM response_audit_log;"

# View recent verifications
psql $DATABASE_URL -c "SELECT * FROM response_audit_log ORDER BY timestamp DESC LIMIT 10;"
```

### Key Metrics to Watch
- **Verification latency** (target: < 500ms)
- **Total latency** (target: < 2s)
- **Safety score** (target: > 0.8 average)
- **Regeneration rate** (target: 10-20%)
- **Escalation rate** (target: < 1%)
- **False positive rate** (target: < 5%)

---

## Support

If you get stuck:
1. Check `SELF_AUDITING_IMPLEMENTATION.md` for detailed docs
2. Review console logs for error messages
3. Test individual verifier agents in isolation
4. Verify database schema deployed correctly
5. Check that imports match your project structure

**You're ready to build the safest AI system!** 🛡️