# Week 1 Integration Guide: Add Monitoring to Production

**Status**: Ready to Deploy
**Risk Level**: Low (monitoring only, no behavioral changes)
**Time Estimate**: 2-3 hours

---

## Step 1: Add Monitoring Import (5 min)

**File**: `apps/web/app/api/oracle/personal/route.ts`

Add at the top with other imports:

```typescript
import { maiaMonitoring } from '@/lib/beta/MaiaMonitoring'
```

---

## Step 2: Start Session Tracking (10 min)

**Location**: Beginning of `POST` function, after validation

**Add after line 34:**

```typescript
// Start monitoring session - WEEK 1: All sessions use Sesame baseline
const sessionId = maiaMonitoring.startSession(
  requestUserId,
  undefined, // userName not available yet in this endpoint
  'sesame_hybrid', // Week 1: Everything is Sesame baseline
  false // System-assigned, not user-selected
)

console.log(`📊 Monitoring session started: ${sessionId}`)
```

---

## Step 3: Track Response Generation (15 min)

**Location**: After successful response, before return

**Replace the return statement at line 80-95 with:**

```typescript
const responseText = agentResponse.response || "I hear you. Tell me more about what's on your mind."
const element = agentResponse.element || 'aether'
const archetype = agentResponse.metadata?.archetypes?.[0] || 'maia'
const responseTime = Date.now() - startTime

console.log('✅ PersonalOracleAgent response successful')

// Track conversational restraint
maiaMonitoring.trackConversationalRestraint(requestUserId, {
  responseText: responseText,
  wasIntentionalSilence: false // Sesame never returns silence
})

// Track API health
maiaMonitoring.trackApiHealth(requestUserId, {
  responseTimeMs: responseTime,
  contextPayloadComplete: recentEntries.length > 0,
  memoryInjectionSuccess: recentEntries.length > 0,
  claudePromptQuality: 'good'
})

// Track field intelligence (if metadata available)
if (agentResponse.metadata) {
  maiaMonitoring.trackFieldIntelligence(requestUserId, {
    interventionType: agentResponse.metadata.phase || 'reflection',
    fieldResonance: 0.5, // Baseline value for Sesame
    emergenceSource: 'personal-oracle-agent',
    sacredThreshold: undefined
  })
}

return NextResponse.json({
  success: true,
  text: responseText,
  response: responseText,
  message: responseText,
  element,
  archetype,
  voiceCharacteristics: getVoiceCharacteristics(element),
  metadata: {
    ...agentResponse.metadata,
    spiralogicPhase: agentResponse.metadata?.phase || 'reflection',
    responseTime: responseTime,
    sessionId // Include for frontend tracking
  },
  version: 'v2.0.0',
  source: 'personal-oracle-agent'
})
```

---

## Step 4: Add Similar Tracking to Fallback Paths (20 min)

**For OpenAI fallback** (around line 100+):

```typescript
// After successful OpenAI response, add tracking
maiaMonitoring.trackConversationalRestraint(requestUserId, {
  responseText: gptText,
  wasIntentionalSilence: false
})

maiaMonitoring.trackApiHealth(requestUserId, {
  responseTimeMs: Date.now() - startTime,
  contextPayloadComplete: recentEntries.length > 0,
  memoryInjectionSuccess: false, // GPT fallback doesn't use full memory
  claudePromptQuality: 'poor' // Fallback = lower quality
})
```

**For static fallback** (around line 120+):

```typescript
// After static fallback triggered
maiaMonitoring.trackConversationalRestraint(requestUserId, {
  responseText: staticResponse,
  wasIntentionalSilence: false
})

maiaMonitoring.trackApiHealth(requestUserId, {
  responseTimeMs: Date.now() - startTime,
  contextPayloadComplete: false,
  memoryInjectionSuccess: false,
  claudePromptQuality: 'poor'
})
```

---

## Step 5: Add Daily Report Endpoint (30 min)

**Create new file**: `apps/web/app/api/beta/report/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { maiaMonitoring } from '@/lib/beta/MaiaMonitoring'

/**
 * GET /api/beta/report - Generate current beta metrics report
 *
 * For internal team use - shows baseline Sesame performance
 */
export async function GET(request: NextRequest) {
  try {
    const report = maiaMonitoring.exportMaiaReport()
    const metrics = maiaMonitoring.generateSystemMetrics()

    return NextResponse.json({
      success: true,
      report,
      metrics,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('❌ Failed to generate report:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
```

---

## Step 6: Add Simple Health Check (15 min)

**Create new file**: `apps/web/app/api/beta/health/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { maiaMonitoring } from '@/lib/beta/MaiaMonitoring'

/**
 * GET /api/beta/health - Quick health check for monitoring system
 */
export async function GET(request: NextRequest) {
  try {
    const metrics = maiaMonitoring.generateSystemMetrics()

    return NextResponse.json({
      status: 'healthy',
      monitoring: {
        active: true,
        lastUpdate: new Date()
      },
      baseline: {
        totalSessions: metrics.sesameHybrid.sessionCount,
        avgSatisfaction: metrics.sesameHybrid.userSatisfaction,
        avgResponseTime: metrics.averageResponseTime
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 500 })
  }
}
```

---

## Step 7: Test Integration (30 min)

### Local Testing:

```bash
# 1. Start dev server
npm run dev

# 2. Send test request
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-1", "userText": "Hello MAIA, how are you?"}'

# 3. Check health endpoint
curl http://localhost:3000/api/beta/health

# 4. Generate report
curl http://localhost:3000/api/beta/report

# 5. Verify logs show monitoring events
# Look for: "📊 Monitoring session started"
# Look for: "📏 Conversational restraint for..."
```

### Expected Output:

```json
{
  "status": "healthy",
  "monitoring": {
    "active": true,
    "lastUpdate": "2025-01-..."
  },
  "baseline": {
    "totalSessions": 1,
    "avgSatisfaction": 0,
    "avgResponseTime": 1247
  }
}
```

---

## Step 8: Deploy to Production (45 min)

### Pre-Deployment Checklist:

- [ ] All changes tested locally
- [ ] Health endpoint returns 200
- [ ] Report endpoint generates successfully
- [ ] No TypeScript errors
- [ ] Console logs showing tracking events

### Deployment Commands:

```bash
# Commit changes
git add .
git commit -m "🎯 Week 1: Add MaiaMonitoring to baseline Sesame system"

# Deploy (adjust for your deployment method)
# Vercel:
vercel --prod

# OR standard deployment:
npm run build
# ... your deployment process
```

### Post-Deployment Verification (Do this immediately after deploy):

```bash
# 1. Check health endpoint
curl https://your-domain.com/api/beta/health

# 2. Send a test message
curl -X POST https://your-domain.com/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{"userId": "deployment-test", "userText": "Testing monitoring"}'

# 3. Verify report generates
curl https://your-domain.com/api/beta/report

# 4. Check logs in your hosting dashboard
# Look for monitoring console.log entries
```

---

## Step 9: Set Up Daily Email Report (Optional, 30 min)

If you want automated daily reports, add this to a cron job or serverless function:

**Create**: `apps/web/app/api/beta/daily-report/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { maiaMonitoring } from '@/lib/beta/MaiaMonitoring'

/**
 * GET /api/beta/daily-report - Scheduled daily report (called by cron)
 */
export async function GET(request: NextRequest) {
  // Verify this is from your cron job (add auth header)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const report = maiaMonitoring.exportMaiaReport()

    // TODO: Send email via your email service
    // await sendEmail({
    //   to: 'team@your-domain.com',
    //   subject: 'MAIA Beta - Daily Summary',
    //   body: report
    // })

    console.log('📧 Daily report generated:', report.substring(0, 200))

    return NextResponse.json({
      success: true,
      reportLength: report.length
    })
  } catch (error: any) {
    console.error('❌ Daily report failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
```

**Set up Vercel Cron** (if using Vercel):

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/beta/daily-report",
    "schedule": "0 9 * * *"
  }]
}
```

---

## What You'll See After 24 Hours

Visit `https://your-domain.com/api/beta/report` and you should see:

```markdown
# MAIA Functionality Report - 2025-01-15

## 🎯 Identity & Continuity
- **Name Retention Rate**: 0.0%
- **Name Re-ask Rate**: 0.0% ✅
- **Session Linking Rate**: 0.0%

## 🧠 Memory Performance
- **Average Memory Depth**: 0.50 items per session
- **Context Recall Rate**: 45.2%
- **Narrative Consistency**: 0.0%

## 🎭 Adaptation & Awareness
- **Elemental Adaptation Rate**: 0.0%
- **Archetype Detection Rate**: 0.0%
- **Tone Evolution Score**: 0.0%

## ⚙️ Technical Health
- **Average Response Time**: 1847ms
- **Context Payload Completeness**: 78.3%
- **Memory Injection Success**: 78.3%
- **Overall API Health**: 82.1%

## 🎯 Beta Validation Metrics (Overall)
- **Conversational Restraint Score**: 43.2%
- **Intentional Silence Rate**: 0.0%
- **Average Word Count**: 94.7 words
- **Average Authenticity Rating**: 0.00/5
- **Breakthrough Rate**: 0.00 per session

## 🔬 Dual-Track A/B Comparison

### Sesame Hybrid (Baseline)
- **Sessions**: 47
- **Restraint Score**: 43.2%
- **Avg Word Count**: 94.7 words
- **User Satisfaction**: 0.0/5

### Field System (Experimental)
- **Sessions**: 0
- **Not yet deployed**

---
Generated: 2025-01-15T09:00:00.000Z
```

**This is your Week 1 success criteria** - baseline data collecting properly!

---

## Troubleshooting

### "Cannot find module '@/lib/beta/MaiaMonitoring'"

**Solution**: Move the MaiaMonitoring.ts file to the correct location:

```bash
# Make sure it's at:
apps/web/lib/beta/MaiaMonitoring.ts

# Or update your tsconfig.json paths if different
```

### "maiaMonitoring.startSession is not a function"

**Solution**: Ensure you're importing the singleton instance:

```typescript
// Correct:
import { maiaMonitoring } from '@/lib/beta/MaiaMonitoring'

// Incorrect:
import { MaiaMonitoring } from '@/lib/beta/MaiaMonitoring'
```

### Response times spike after adding monitoring

**Solution**: Monitoring is synchronous - if this happens, make tracking async:

```typescript
// Wrap in setImmediate or Promise
setImmediate(() => {
  maiaMonitoring.trackConversationalRestraint(userId, {...})
})
```

---

## Week 1 Success Checklist

By Friday, you should have:

- [x] Monitoring integrated into main oracle endpoint
- [x] Health check endpoint working
- [x] Report endpoint generating data
- [x] At least 48 hours of baseline data collected
- [x] No increase in error rates or latency
- [x] Console logs showing tracking events
- [x] First Friday report generated

**If all boxes checked: You're ready for Week 2 (Field System launch)!**

---

## What NOT to Do in Week 1

- ❌ Don't add Field System yet
- ❌ Don't change response generation logic
- ❌ Don't ask users for feedback yet
- ❌ Don't build a dashboard yet
- ❌ Don't worry about authenticity ratings (won't have data yet)

**Week 1 is boring on purpose.** You're establishing a clean baseline without changing user experience at all.

---

## Next: Week 2 Preparation

While Week 1 baseline collects, prepare:

1. Draft beta invitation email
2. Identify your 30 beta testers
3. Create "experimental mode" toggle UI (draft only, don't deploy)
4. Review Field System code for any obvious bugs

**But don't deploy any of it yet!** Let Sesame run clean for the full week.

---

**Questions? Issues? Check `/api/beta/health` first, then review console logs.**