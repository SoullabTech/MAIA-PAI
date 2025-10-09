# MAIA Guardrails Operational Runbook

**Purpose**: Convert MAIA Voice Metrics guardrails from "tracked" to "acted upon."

---

## 1. Alert Rules

### Circuit Breaker: CRITICAL (Immediate Response)
**Trigger**: Any session with >5 corrections
**Alert Channel**: Slack/Discord #maia-alerts (immediate ping)
**Owner**: On-call engineer + Product lead

**Response Playbook**:
1. **Within 1 hour**: Pull session transcript & correction history
   ```sql
   SELECT * FROM analytics.maia_interactions
   WHERE session_id = '[SESSION_ID]'
   ORDER BY created_at;
   ```
2. **Identify pattern**: What's breaking? (mishearing, wrong suggestions, tone issues)
3. **Within 24 hours**: Ship hotfix or disable problematic feature for that user
4. **Within 48 hours**: Add regression test to prevent recurrence

**Example**: User corrects "I feel anxious" 7 times → MAIA keeps hearing "I feel anxious about" and completing with wrong assumptions → Disable auto-completion for that user, patch confidence threshold.

---

### Giving Up Warnings: HIGH (Daily Review)
**Trigger**: Correction engagement drops >5pp without accuracy improving
**Alert Channel**: Daily summary email to product lead
**Owner**: Product manager + UX researcher

**Response Playbook**:
1. **Sample 5 sessions** from flagged week:
   ```sql
   SELECT user_id, session_id, correction_type, created_at
   FROM analytics.maia_interactions
   WHERE week = '[FLAGGED_WEEK]'
   AND correction_type IS NOT NULL
   LIMIT 5;
   ```
2. **Look for patterns**:
   - Are corrections failing to stick? (user gives up teaching)
   - Are prompts becoming repetitive? (correction fatigue)
   - Is MAIA tone-deaf to emotional context?
3. **Within 1 week**: Hypothesis → experiment → measure

**Example**: Users stop correcting MAIA's suggestions about relationships → Investigation shows MAIA uses clinical language that feels cold → Adjust tone in relationship context → Re-measure engagement.

---

### Voice Check Negative Patterns: MEDIUM (Weekly Team Review)
**Trigger**: Top 2 voice signals include "rushed", "too many prompts", "didn't listen"
**Alert Channel**: Weekly standup agenda item
**Owner**: Whole team

**Response Playbook**:
1. **Map complaints to lanes**:
   - "Felt rushed" → **Aesthetic lane** (timing/pacing issue)
   - "Too many prompts" → **Mechanics lane** (repair frequency)
   - "Didn't listen" → **Language lane** (understanding/memory)
2. **Correlate with metrics**:
   - "Rushed" + high avg response time → System lag masquerading as UX issue
   - "Too many prompts" + high correction engagement → Overzealous uncertainty prompts
3. **Sprint action**: Add to backlog as P1 if affecting >10% of users

**Example**: "Too many prompts" signals spike → Analysis shows uncertainty engagement at 60% (>40% above baseline) → Dial back uncertainty triggers by 20% → Monitor for 2 weeks.

---

## 2. Review Rhythm

### Daily (5 min)
**Who**: On-call engineer
**What**: Check circuit breakers + critical voice feedback
**Where**: `/api/v1/admin/maia-guardrails` (or monitoring dashboard)
**Action**: If any 🔴 CRITICAL alerts → trigger playbook immediately

### Weekly (30 min)
**Who**: Product lead + Engineering lead
**What**: Review trends in:
- Giving up warnings (are users abandoning corrections?)
- Correction accuracy (is MAIA learning or stuck?)
- Re-entry segmentation (are ≥30d gaps increasing?)
**Where**: Monday standup
**Action**: Add P1 items to sprint if degradation detected

### Sprint Retro (1 hour)
**Who**: Whole team
**What**: Correlate metric changes with shipped features
**Questions**:
- Did our fix for [X] actually improve correction accuracy?
- Did the new onboarding reduce ≥30d re-entry gaps?
- Are voice check signals improving or just shifting?
**Action**: Document what worked, kill what didn't

---

## 3. Operational Discipline

### The North Star
**Metrics exist to protect therapeutic presence, not to maximize usage.**

- If engagement is up but voice check signals are negative → **red flag**
- If correction accuracy is flat but users are happy → **investigate, don't panic**
- If circuit breakers are firing → **drop everything and fix**

### Response SLAs
| Alert Level | Response Time | Resolution Target |
|-------------|---------------|-------------------|
| 🔴 Critical (Circuit Breaker) | 1 hour | 24 hours |
| 🟠 High (Giving Up) | 1 day | 1 week |
| 🟡 Medium (Voice Check) | 1 week | 1 sprint |

### What "Fixed" Means
- **Circuit Breaker**: User can complete a session without >5 corrections
- **Giving Up**: Correction engagement stable or rising + accuracy improving
- **Voice Check**: Negative signal drops out of top 2 tags for 2 consecutive weeks

---

## 4. Escalation Paths

### When to escalate UP (to leadership):
- Circuit breaker alerts persist >48 hours despite hotfix
- Giving up warnings affect >20% of active users
- Voice check signals indicate systemic trust erosion ("didn't listen" as top signal for 3+ weeks)

### When to escalate OUT (to users):
- **Never hide problems**. If MAIA is broken, admit it and offer escape hatch:
  - "MAIA, pause"
  - "Just save my words"
  - "Start fresh"
- If ≥30d re-entry gap user returns → gentle re-onboarding, don't assume continuity

---

## 5. Dashboard Enhancements (Future)

### Near-term (Next Sprint)
- **"Recent Alerts" Ticker**: Surface last 3-5 critical events on main view (no click required)
- **Adaptive Refresh**: 1-min refresh during active sessions, 5-min otherwise
- **Session Deep-Link**: Click circuit breaker alert → jump to session transcript

### Long-term (Next Quarter)
- **Metaphor Shift**: Replace green/yellow/red with "Aligned / Tending / Misattuned"
- **Predictive Alerts**: ML model flags "about to give up" users before engagement drops
- **User-Facing Metrics**: Let beta testers see their own correction accuracy trends

---

## 6. Team Accountability

| Role | Responsibility |
|------|----------------|
| **On-call Engineer** | Daily circuit breaker checks, immediate hotfixes |
| **Product Lead** | Weekly giving up analysis, sprint prioritization |
| **UX Researcher** | Voice check signal interpretation, user interviews |
| **Whole Team** | Sprint retro metric review, collective learning |

**The Test**: If guardrails fire and nobody acts within SLA → escalate to team lead. This system only works if we treat it as seriously as uptime.

---

## 7. Success Criteria

**After 4 weeks of operational discipline, we should see**:
- ✅ Zero circuit breaker alerts persisting >24 hours
- ✅ Giving up warnings correlating with specific features (not random noise)
- ✅ Voice check signals informing at least 1 sprint backlog item per week
- ✅ Team can answer: "What's the therapeutic health of MAIA right now?" in 30 seconds

**If we can't answer that last question, the dashboard is vanity. If we can, it's working.**

---

## Appendix: Quick Reference

### SQL Snippets

**Pull session with >5 corrections:**
```sql
SELECT user_id, session_id, count(*) as correction_count
FROM analytics.maia_interactions
WHERE correction_type IS NOT NULL
GROUP BY user_id, session_id
HAVING count(*) > 5
ORDER BY correction_count DESC;
```

**Find users who stopped correcting:**
```sql
WITH recent_weeks AS (
  SELECT user_id,
         date_trunc('week', created_at) as week,
         count(*) filter (where correction_type IS NOT NULL) as corrections
  FROM analytics.maia_interactions
  WHERE created_at >= now() - interval '8 weeks'
  GROUP BY 1, 2
)
SELECT user_id,
       max(week) as last_correction_week,
       count(*) filter (where corrections > 0) as active_weeks
FROM recent_weeks
GROUP BY user_id
HAVING count(*) filter (where corrections > 0) < count(*) / 2;
```

**Voice check by week:**
```sql
SELECT * FROM metrics.guardrail_voice_check
ORDER BY week DESC
LIMIT 4;
```

---

**Remember**: Numbers are the compass. Voice check is the conscience. Guardrails are the integrity. Act accordingly.
