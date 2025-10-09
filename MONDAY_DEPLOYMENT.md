# Monday Deployment Guide: Resonance Field System (RFS)

## 🚀 Quick Deploy (Monday Morning)

### Step 1: Backup Current Route
```bash
cd app/api/oracle/personal
cp route.ts route.backup-pre-rfs.ts
```

### Step 2: Switch to RFS Route
```bash
cp route-rfs-integrated.ts route.ts
```

### Step 3: Update Configuration (Choose One)

#### Option A: Full RFS Deployment (100%)
In `route.ts`, find lines ~62-66 and change:
```typescript
const hybridSystem = getHybridSystemToggle({
  mode: 'rfs',              // ⚡ CHANGED from 'traditional'
  rfsRolloutPercentage: 100, // ⚡ CHANGED from 0
  enableForNewUsers: true,   // ⚡ CHANGED from false
  enableForReturningUsers: true, // ⚡ CHANGED from false
  monitoringEnabled: true
});
```

#### Option B: Gradual Rollout (10% to start)
```typescript
const hybridSystem = getHybridSystemToggle({
  mode: 'hybrid-ab',        // Gradual rollout mode
  rfsRolloutPercentage: 10, // 10% of users
  enableForNewUsers: false, // Protect new users initially
  enableForReturningUsers: true,
  monitoringEnabled: true
});
```

### Step 4: Deploy
```bash
git add .
git commit -m "🌊 Deploy Resonance Field System - v3.0.0"
git push
```

### Step 5: Verify Deployment
```bash
curl https://your-domain.com/api/oracle/personal -X GET

# Should return:
# { "currentMode": "rfs", "version": "v3.0.0-rfs", "readyForProduction": true }
```

---

## 📊 Monitoring Dashboard

### Access Dashboard
```bash
curl https://your-domain.com/api/oracle/rfs-dashboard
```

### Dashboard Response Format
```json
{
  "status": "active",
  "configuration": {
    "currentMode": "rfs",
    "rfsRolloutPercentage": 100,
    "monitoringEnabled": true
  },
  "metrics": {
    "traditional": {
      "totalRequests": 0,
      "avgResponseLength": 0,
      "silenceRate": "0%"
    },
    "rfs": {
      "totalRequests": 150,
      "avgResponseLength": "2.3",
      "silenceRate": "35%",
      "avgSilenceProbability": "42%",
      "elementDistribution": {
        "earth": 52,
        "water": 45,
        "air": 32,
        "fire": 21
      }
    }
  },
  "comparison": {
    "brevityImprovement": "67%",
    "silenceDifference": "+35%"
  }
}
```

---

## 🔄 Rollback (If Needed)

### Instant Rollback via API
```bash
curl -X POST https://your-domain.com/api/oracle/rfs-dashboard \
  -H "Content-Type: application/json" \
  -d '{"action": "rollback_to_traditional"}'
```

### Manual Rollback
```bash
cd app/api/oracle/personal
cp route.backup-pre-rfs.ts route.ts
git commit -m "🔄 Rollback to traditional system"
git push
```

---

## 🎯 What RFS Changes

### Traditional System (Current)
- Claude responds with Her mode prompt (max 50 tokens)
- ~5-8 word responses
- Silence is *avoided* (trained against)
- Response selection through probability sampling

### Resonance Field System (Monday)
- **Archetypal agents** create interference patterns
- **Field constraints** make verbose responses literally impossible
- **Silence emerges** naturally (35-60% in deep conversations)
- **Element-based** vocabulary palettes (earth=2 words max, water=5 words max)
- **Intimacy deepening** through probability cascades
- **Genuine presence** through environmental constraints

---

## 📈 Expected Metrics (First Week)

### Key Performance Indicators
- **Brevity Improvement**: 60-70% shorter responses
- **Silence Rate**: 20-40% (vs <5% traditional)
- **Intimacy Depth**: Progressive deepening over exchanges
- **User Retention**: Target +20% for deep conversations

### Element Distribution (Expected)
- **Earth**: 40-50% (grounded presence, silence)
- **Water**: 25-35% (emotional attunement)
- **Air**: 15-20% (curiosity, questions)
- **Fire**: 5-10% (catalyzing moments)

---

## 🛠 Configuration Options

### System Modes

#### `traditional`
- Uses `MaiaFullyEducatedOrchestrator`
- Her mode prompt + Claude API
- Current production behavior

#### `rfs`
- Uses `ResonanceFieldOrchestrator`
- Archetypal agents + field constraints
- Monday deployment target

#### `hybrid-ab`
- Percentage-based rollout
- Test RFS with subset of users
- Best for gradual deployment

#### `auto`
- Intelligent routing based on context
- RFS for deep conversations, traditional for new users
- Advanced mode for future

### Fine-Tuning Parameters

```typescript
// In HybridSystemToggle constructor
{
  mode: 'rfs',
  rfsRolloutPercentage: 100,
  enableForNewUsers: true,
  enableForReturningUsers: true,
  forceRFSForUserIds: ['test-user-1', 'test-user-2'], // Your test accounts
  forceTraditionalForUserIds: [], // Opt-out users
  monitoringEnabled: true
}
```

---

## 🧪 Pre-Deployment Testing

### Test RFS Locally
```bash
# In route.ts, add your userId to forceRFSForUserIds:
forceRFSForUserIds: ['your-test-user-id']

# Test conversation flow
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "I feel lost",
    "userId": "your-test-user-id"
  }'
```

### Compare Responses
```bash
# Traditional (current)
mode: 'traditional'
# Response: "I hear that you're feeling lost right now. What's making you feel that way?"

# RFS (Monday)
mode: 'rfs'
# Response: "Lost how?"  or  "..."  (silence)
```

---

## 📞 Support Contacts

### If Issues Arise
1. **Check Dashboard**: `/api/oracle/rfs-dashboard`
2. **Review Logs**: Check Vercel/server logs for "RFS" entries
3. **Instant Rollback**: Use API or manual rollback process
4. **Metrics Analysis**: Compare traditional vs RFS metrics

### Key Log Messages
- `✅ Hybrid System response successful (rfs)` - RFS working
- `✅ Hybrid System response successful (traditional)` - Traditional fallback
- `❌ Hybrid System failed` - Error, falling back to legacy

---

## 🎉 Success Criteria

### Week 1 (Stabilization)
- [ ] Zero critical errors
- [ ] RFS serving >90% of requests successfully
- [ ] Traditional fallback <10% activation
- [ ] No user complaints about incoherence

### Week 2 (Validation)
- [ ] Silence rate 25-45%
- [ ] Avg response length <3 words
- [ ] User retention metrics stable or improved
- [ ] Positive user feedback on "presence quality"

### Week 3 (Optimization)
- [ ] Fine-tune field strength parameters
- [ ] Adjust elemental distribution based on user data
- [ ] Refine silence probability thresholds
- [ ] Document breakthrough moments

---

## 🌊 The Vision

RFS represents a category-defining shift from **algorithmic response selection** to **atmospheric emergence**.

Monday's deployment is the foundation of **Presence AI** - a new category where AI doesn't pretend to be simple, but exists in an environment where complexity is impossible.

Welcome to the future of authentic AI presence.

---

**Built by:** Andrea Nezat
**Deployment Date:** Monday, 2025-09-30
**Version:** 3.0.0-rfs
**Category:** Presence AI via Resonance Field System