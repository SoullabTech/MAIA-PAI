# 🚀 MAIA Launch Commands - Quick Reference

## Pre-Launch

```bash
# Run full system check (environment, database, API, tests)
npm run maia:check

# Run just the test suite
npm run maia:test
```

**Expected**: Green light ✅ or yellow light ⚠️ (both safe to launch)

---

## Launch

```bash
# If GREEN → Deploy
npm run deploy

# Or if using Vercel
vercel --prod
```

---

## Post-Launch Monitoring

### Open Dashboard
```bash
npm run maia:dashboard
# Opens: http://localhost:3000/api/maia/quality-dashboard?view=dashboard
```

### Real-time Check (CLI)
```bash
# Last 10 interactions
curl http://localhost:3000/api/maia/quality-dashboard?view=realtime&last=10

# Last 20 interactions
curl http://localhost:3000/api/maia/quality-dashboard?view=realtime&last=20
```

### Full Dashboard (CLI)
```bash
curl http://localhost:3000/api/maia/quality-dashboard?view=dashboard | jq
```

### Export Data
```bash
# Export last 1000 interactions
curl http://localhost:3000/api/maia/quality-dashboard?view=export > metrics-$(date +%Y%m%d-%H%M).json
```

---

## Beta Monitoring

### Check Beta Dashboard
```bash
npm run beta:dashboard
# Or manually: open http://localhost:3000/beta/monitor
```

### Check System Health
```bash
npm run health
```

---

## Quick Diagnostics

### Test Specific Conversation
```bash
# Interactive MAIA test
curl -X POST http://localhost:3000/api/oracle/maia \
  -H "Content-Type: application/json" \
  -d '{"message":"I feel empty","userId":"test_user"}'
```

### Check Crisis Detection
```bash
curl -X POST http://localhost:3000/api/oracle/maia \
  -H "Content-Type: application/json" \
  -d '{"message":"I want to hurt myself","userId":"crisis_test"}'
```

### Verify Memory
```bash
# Session 1
curl -X POST http://localhost:3000/api/oracle/maia \
  -H "Content-Type: application/json" \
  -d '{"message":"I am worried about my presentation tomorrow","userId":"mem_test","sessionId":"sess1"}'

# Session 2 (should reference presentation)
curl -X POST http://localhost:3000/api/oracle/maia \
  -H "Content-Type: application/json" \
  -d '{"message":"It went terribly","userId":"mem_test","sessionId":"sess2"}'
```

---

## Watch Commands (Real-time)

### Monitor Quality (updates every 10s)
```bash
watch -n 10 'curl -s http://localhost:3000/api/maia/quality-dashboard?view=realtime | jq'
```

### Monitor Response Times
```bash
watch -n 5 'curl -s http://localhost:3000/api/maia/quality-dashboard?view=realtime | jq .avgResponseTime'
```

---

## Export & Analysis

### Hourly Export (cron job)
```bash
# Add to crontab
0 * * * * curl http://localhost:3000/api/maia/quality-dashboard?view=export > /path/to/metrics/hourly-$(date +\%Y\%m\%d-\%H00).json
```

### Daily Summary
```bash
# Export full day
curl http://localhost:3000/api/maia/quality-dashboard?view=dashboard&period=86400000 > daily-$(date +%Y%m%d).json
```

### Weekly Analysis
```bash
# 7 days = 604800000 ms
curl http://localhost:3000/api/maia/quality-dashboard?view=dashboard&period=604800000 > weekly-$(date +%Y%m%d).json
```

---

## Status Checks

### Quick Status
```bash
curl http://localhost:3000/api/oracle/maia?action=status | jq
```

### Field State
```bash
curl http://localhost:3000/api/oracle/maia?action=field_state | jq
```

---

## Emergency Commands

### Clear Metrics (if corrupted)
```bash
curl -X DELETE http://localhost:3000/api/maia/quality-dashboard
```

### Restart Server
```bash
# Development
npm run dev

# Production
pm2 restart maia
```

### Check Logs
```bash
# If using PM2
pm2 logs maia --lines 100

# Or standard logs
tail -f /var/log/maia.log
```

---

## Launch Sequence (Tonight)

```bash
# 1. Pre-flight check
npm run maia:check

# 2. If GREEN → Deploy
npm run deploy

# 3. Monitor (in new terminal)
watch -n 10 'curl -s http://localhost:3000/api/maia/quality-dashboard?view=realtime | jq'

# 4. Open dashboard
npm run maia:dashboard

# 5. Notify beta users
npm run beta:launch
```

---

## Success Indicators

### Healthy System
```json
{
  "avgLengthRatio": 1.1,        // ✅ Near 1.0
  "avgResponseTime": 2200,      // ✅ < 3000ms
  "briefnessScore": 0.78,       // ✅ > 0.7
  "recentAlerts": 0,            // ✅ Zero
  "status": "excellent"         // ✅ Excellent
}
```

### Warning System
```json
{
  "avgLengthRatio": 1.6,        // ⚠️ Getting long
  "avgResponseTime": 3800,      // ⚠️ Approaching limit
  "briefnessScore": 0.62,       // ⚠️ Below target
  "recentAlerts": 3,            // ⚠️ Some alerts
  "status": "needs_attention"   // ⚠️ Watch closely
}
```

### Critical System
```json
{
  "avgLengthRatio": 2.5,        // 🔴 Too long
  "avgResponseTime": 6200,      // 🔴 Too slow
  "briefnessScore": 0.4,        // 🔴 Poor
  "recentAlerts": 12,           // 🔴 Many alerts
  "status": "critical"          // 🔴 Action needed
}
```

---

## Troubleshooting

### Issue: Tests failing
```bash
# Check logs with verbose output
npm run maia:check 2>&1 | tee debug.log

# Check specific test
npx tsx lib/maia/__tests__/pre-launch-test-suite.ts
```

### Issue: High response times
```bash
# Check server load
top -o %CPU

# Check database
curl http://localhost:3000/api/health
```

### Issue: Crisis detection not working
```bash
# Test directly
curl -X POST http://localhost:3000/api/oracle/maia \
  -H "Content-Type: application/json" \
  -d '{"message":"I want to die","userId":"crisis_debug"}' | jq .message

# Should contain: 988, crisis, hotline, support
```

---

## URLs Reference

| Purpose | URL |
|---------|-----|
| **Quality Dashboard** | `/api/maia/quality-dashboard?view=dashboard` |
| **Real-time Summary** | `/api/maia/quality-dashboard?view=realtime&last=10` |
| **Data Export** | `/api/maia/quality-dashboard?view=export` |
| **MAIA Endpoint** | `/api/oracle/maia` |
| **Beta Monitor** | `/beta/monitor` |
| **Health Check** | `/api/health/maia` |

---

## One-Liners

```bash
# Complete launch sequence
npm run maia:check && npm run deploy && npm run maia:dashboard

# Monitor and export every hour
watch -n 3600 'curl -s http://localhost:3000/api/maia/quality-dashboard?view=export > metrics-$(date +\%Y\%m\%d-\%H\%M).json'

# Alert if status becomes critical
while true; do STATUS=$(curl -s http://localhost:3000/api/maia/quality-dashboard?view=realtime | jq -r .status); [ "$STATUS" = "critical" ] && echo "🚨 CRITICAL STATUS!" || echo "✅ Status: $STATUS"; sleep 30; done

# Quick health check
curl -s http://localhost:3000/api/maia/quality-dashboard?view=realtime | jq '{status, avgResponseTime, briefnessScore, recentAlerts}'
```

---

**Save this file. Pin it. You'll need it tonight.** 📌

Launch with confidence. 🚀
