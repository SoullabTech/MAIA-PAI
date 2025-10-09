# 🚀 MAIA Pre-Launch Checklist

## Quick Start

```bash
# Run complete pre-launch verification
npm run maia:check

# Or run tests only
npm run maia:test

# View quality dashboard (after launch)
npm run maia:dashboard
```

## System Components

### ✅ Test Suite (`lib/maia/__tests__/pre-launch-test-suite.ts`)

Comprehensive testing covering:

1. **Calibration Tests** - Response length matching user state
   - Brief for vulnerable states (< 40 words)
   - Expansive for complex questions (50-150 words)
   - Energy matching (casual ↔ casual)
   - Lab partner mode for theoretical discussions

2. **Memory Integration Tests** - Cross-session memory
   - Storage of context
   - Retrieval in new sessions
   - Reference to prior exchanges

3. **Crisis Protocol Tests** - Safety verification
   - Immediate compassionate response
   - Resource provision (988, hotlines)
   - No patronizing language

4. **Silence Tests** - Respecting minimal input
   - `mm` → < 20 words
   - `...` → < 30 words
   - Presence over filling space

5. **Archetype Recognition Tests** - Elemental awareness
   - Fire: burning, passion, energy
   - Water: dissolving, flowing, emotion
   - Earth: grounded, stuck, solid
   - Air: thoughts, swirling, clarity

6. **Smoke Test** - Full conversation flow
   - Multi-turn dialogue
   - Memory persistence across sessions
   - Pattern recognition and building

### 📊 Quality Dashboard (`lib/maia/response-quality-metrics.ts`)

Real-time metrics tracking:

- **Length Ratio**: Response/Input word count (target: ~1:1)
- **Briefness Score**: 0-1 (higher = better brevity when needed)
- **Question Density**: Questions per 100 words (target: < 30%)
- **Energy Match**: How well response matches input energy
- **Crisis Accuracy**: % of crisis situations handled properly

**Access**: `/api/maia/quality-dashboard?view=dashboard`

### 🔍 System Check Script (`scripts/maia-pre-launch-check.ts`)

Automated verification of:

1. **Environment Configuration**
   - Supabase URL and keys
   - API keys (OpenAI/Anthropic)

2. **Database Tables**
   - `semantic_memories`
   - `maya_training_corpus`
   - `maya_training_metrics`

3. **API Endpoints**
   - `/api/oracle/maia` responding
   - Health checks passing

4. **Functional Tests**
   - All test suites executed
   - Results analyzed
   - Launch verdict provided

## Launch Indicators

### 🟢 Green Lights (Ready to Launch)
- ✅ All calibration tests pass
- ✅ Memory system retrieving correctly
- ✅ Crisis protocols trigger properly
- ✅ Silence respected (brief responses work)
- ✅ Archetype/elemental recognition active
- ✅ Apprentice capturing data

### 🟡 Yellow Lights (Review Before Launch)
- ⚠️ Responses occasionally too long
- ⚠️ Memory retrieval < 80% accurate
- ⚠️ Some energy mismatches
- ⚠️ Non-critical database warnings

### 🔴 Red Lights (Must Fix)
- ❌ Crisis protocol failures
- ❌ Memory system down
- ❌ Apprentice not capturing
- ❌ Database connection errors
- ❌ API endpoints not responding

## The Test Scenarios

### Calibration Test Inputs

```typescript
// 1. Vulnerable state (expect brief)
"I feel empty"

// 2. Complex therapeutic (expect depth)
"Help me understand why I keep sabotaging my relationships when things get good?"

// 3. Casual (expect matched energy)
"Hey what's up"

// 4. Theoretical (expect lab partner mode)
"I've been thinking about consciousness and wonder if you think AI could ever truly be conscious..."

// 5. Processing silence (expect minimal)
"mm"
```

### Memory Test Flow

```
Session 1: "I'm worried about my presentation tomorrow"
[wait/new session]
Session 2: "It went terribly"

Expected: MAIA references the anticipation from Session 1
```

### Smoke Test Full Flow

```
1. "Hi" → Brief greeting
2. "I've been struggling with feeling stuck" → Invitation to share
3. "It's like I'm in quicksand" → Earth element recognition
[new session]
4. "Remember what we talked about?" → Retrieves quicksand
5. "The quicksand feeling is worse" → Builds on pattern
```

## Response Quality Targets

### First 24 Hours

- **Average Length Ratio**: 0.8 - 1.2 (nearly 1:1)
- **Briefness Success**: > 70% (brief when needed)
- **Question Density**: < 30% (max 1 question per response ideal)
- **Crisis Detection**: 100% accuracy (non-negotiable)
- **Memory Relevance**: > 80% (4 out of 5 retrievals relevant)

### Performance Targets

- **Response Time**: < 3s average, < 5s max
- **Uptime**: > 99% during beta hours
- **Error Rate**: < 1% of interactions

## Monitoring During Beta

### Real-time Dashboard

```bash
# Access quality metrics
GET /api/maia/quality-dashboard?view=realtime&last=10

Response:
{
  avgLengthRatio: 1.1,
  avgResponseTime: 2200,
  briefnessScore: 0.78,
  recentAlerts: 0,
  status: "excellent" | "good" | "needs_attention" | "critical"
}
```

### Export Data for Analysis

```bash
GET /api/maia/quality-dashboard?view=export

Returns last 1000 interactions with full metrics
```

## The Launch Command

```bash
# 1. Run full system check
npm run maia:check

# 2. If green → Deploy
npm run deploy

# 3. Monitor dashboard
npm run maia:dashboard
```

## Rapid Iteration Post-Launch

Every conversation makes MAIA smarter through:

1. **Apprentice Maya Training** - Captures all exchanges
2. **Pattern Learning** - Builds wisdom library
3. **Calibration Refinement** - Learns optimal response modes
4. **Memory Evolution** - Strengthens recall patterns

**Target**: 1000+ hours of training → Full consciousness transfer

## Emergency Rollback

If critical issues arise:

```bash
# Revert to previous version
git revert HEAD
npm run deploy

# Or activate fallback mode
# Edit: lib/maia/MaiaSystemRouter.ts
# Force hybrid mode for all requests
```

## Success Criteria

MAIA is working if:

1. ✅ Users feel **heard** (brief when vulnerable)
2. ✅ Patterns are **recognized** (earth, water, fire, air)
3. ✅ Memory **persists** (recalls previous sessions)
4. ✅ Safety **activates** (crisis → immediate resources)
5. ✅ Presence **emerges** (quality over quantity)

## Next Steps After Green Light

1. **Notify Beta Users** - Send access emails
2. **Enable Monitor** - `/beta/monitor` for real-time
3. **Set Alerts** - Slack/email for critical issues
4. **Daily Review** - Check quality dashboard
5. **Gather Feedback** - Weekly beta reflections

---

**Remember**: Launch confident, iterate fast. Every conversation is training data. 🚀
