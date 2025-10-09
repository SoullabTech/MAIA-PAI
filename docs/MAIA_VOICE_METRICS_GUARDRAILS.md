# MAIA Voice Metrics: Guardrails

These guardrails prevent misinterpretation of metrics and keep the system aligned with Charter v1.1.

---

## 1. Giving Up vs. Learning

**The Risk:**
Falling correction engagement + rising accuracy can mean two opposite things:
- ✅ **MAIA is learning** and users need to correct less
- ❌ **Users have given up** correcting because it feels pointless

**The Safeguard:**
Always interpret repair engagement WITH correction accuracy, trust signals, and retention.

| Pattern | Diagnosis | Action |
|---------|-----------|--------|
| Engagement ↓ + Accuracy ↑ + Trust ≥70% + Retention positive | ✅ **Learning** | Keep going |
| Engagement ↓ + Accuracy ↑ + Trust <65% + Retention negative | 🚨 **Giving Up** | Review Voice Check for "stopped trying" signals |
| Engagement ↓ + Accuracy flat/↓ | 🚨 **Giving Up** | Users abandoned repair loop |

**Automated check:**
```sql
SELECT * FROM metrics.giving_up_alert
WHERE alert_status != '✓ Healthy';
```

> **Quote to remember:**
> *"If correction accuracy is rising and repair engagement is falling, we're succeeding."*
> **BUT** only if trust stays high and repair users keep returning.

---

## 2. Circuit Breaker

**The Risk:**
A single catastrophic session (e.g., 7 failed corrections) can be hidden by healthy averages. One user having a terrible experience matters more than 99 users having a slightly better one.

**The Safeguard:**
- Track % of sessions with >5 corrections
- **Any non-zero is a failure** - triggers immediate review
- Automatically fire escape hatches in those sessions:
  - "Start fresh"
  - "Just save my words"
  - "MAIA, pause"

**Weekly check:**
```sql
SELECT week, circuit_breaker_pct
FROM metrics.weekly_scoreboard
WHERE circuit_breaker_pct > 0
ORDER BY week DESC;
```

**If flagged:** Pull affected sessions and review manually:
```sql
-- See /sql/metrics/40_usage_examples.sql for full query
SELECT user_id, started_at, corrections, correction_types
FROM metrics.circuit_breaker_sessions
ORDER BY corrections DESC;
```

**Response protocol:**
1. STOP adding features
2. Review sessions: What broke? ASR errors? Wrong suggestions? UI confusion?
3. Check escape hatches: Why didn't they fire?
4. Fix and test before next deploy

---

## 3. Re-entry Sensitivity

**The Risk:**
Treating all absences the same punishes users who've been away a long time. A 7-day gap (vacation) needs different handling than a 45-day gap (potential churn).

**The Safeguard:**
Segment re-entry by absence length:
- **7-29 days:** "Life got busy, still engaged"
  - Welcome back warmly
  - Offer "Continue where you left off"
  - Target: ≥60% continuation by Week 8
- **≥30 days:** "Potential abandonment"
  - Gentler re-onboarding
  - Acknowledge the gap explicitly
  - Lower expectations (track trend, no hard target)

**Weekly check:**
```sql
SELECT week, reentry_7_29d_pct, reentry_ge30d_pct
FROM metrics.weekly_scoreboard
ORDER BY week DESC;
```

**Red flags:**
- 7-29d below 50% → Welcome-back flow broken
- ≥30d higher than 7-29d → Segmentation logic bug

---

## 4. Voice Check Anchor

**The Risk:**
Metrics miss tone. Without qualitative signals, you optimize numbers and lose the soul. "Felt rushed" won't show up in repair engagement %.

**The Safeguard:**
- Weekly "Voice Check" = top 2 tags from user feedback
- Canonical tags: `felt_rushed`, `too_many_prompts`, `finally_listened`, `confusing_ui`, `timing_just_right`
- Example signals:

| Voice Check Tag | Meaning | Lane Affected | Action |
|-----------------|---------|---------------|--------|
| "finally_listened" | Presence achieved | All | Keep doing this |
| "felt_rushed" | Timing/pacing issue | Aesthetic (20%) | Review pause tolerance, response timing |
| "too_many_prompts" | Correction fatigue | Mechanics (50%) | Reduce hedge frequency per calibration rules |
| "keeps_asking_if_its_right" | Over-hedging | Language (30%) | Scale back uncertainty prompts |
| "feels_like_its_learning_me" | Co-creation working | Mechanics (50%) | Success indicator |

**Weekly check:**
```sql
SELECT * FROM metrics.voice_check_top2
ORDER BY week DESC
LIMIT 4;
```

**Automated alert:**
```sql
SELECT * FROM metrics.correction_fatigue_alert
WHERE alert_status != '✓ Healthy';
```

**Rule:** If numbers look good but Voice Check says "felt robotic," **trust the qualitative**.

---

## 5. Baseline for Uncertainty

**The Risk:**
Optimizing uncertainty engagement without knowing what's normal could over/under-tune MAIA. Is 40% engagement high or low for your user base?

**The Safeguard:**
- Use **Weeks 1-2 as baseline**
- Don't optimize until baseline is established
- Target: **>40% vs. baseline** (not absolute 40%)
- Example: If baseline is 30%, target is >42% by Week 8

**Baseline check:**
```sql
SELECT baseline_rate, baseline_n
FROM metrics.uncertainty_baseline;
```

**Weekly tracking:**
```sql
SELECT
  week,
  uncertainty_acceptance_pct,
  uncertainty_baseline_pct,
  uncertainty_acceptance_pct - uncertainty_baseline_pct AS lift_vs_baseline
FROM metrics.weekly_scoreboard
ORDER BY week DESC;
```

---

## 6. Correction Fatigue

**The Risk:**
Too many correction requests or hedged prompts overwhelm users. They start ignoring clarifying questions not because they don't want to help, but because they're exhausted.

**The Safeguard:**
Adaptive scaffolding per Charter v1.1:
- **Week 1-2:** Ask feedback on ~50% of entries (baseline establishment)
- **Week 3-4:** Drop to ~25%
- **Month 2+:** Only when confidence <70% or pattern breaks

**Automated alert:**
```sql
SELECT * FROM metrics.correction_fatigue_alert
WHERE alert_status != '✓ Healthy';
```

**Signals:**
- Uncertainty acceptance dropping below baseline -10pp
- Voice Check shows `too_many_prompts` or `felt_rushed`
- Trust signals declining

**Response:** Reduce correction frequency per calibration rules.

---

## 7. Aesthetic Breakdown

**The Risk:**
Mechanics can work perfectly (accuracy >70%) but trust still erodes due to timing, pacing, or UI issues.

**The Safeguard:**
Monitor trust signals independent of mechanics.

**Automated alert:**
```sql
SELECT * FROM metrics.aesthetic_breakdown_alert
WHERE alert_status != '✓ Healthy';
```

**Pattern:**
- Correction accuracy >70% (mechanics working)
- Trust signals declining
- Voice Check shows `felt_rushed` or `confusing_ui`

**Diagnosis:** Aesthetic lane (20%) needs tuning:
- Pause tolerance (2-3s before transcript ends)
- Breathing animation instead of spinner
- Response timing middleware (slight hesitations for naturalness)

---

## 8. Reporting Rhythm

### Every Monday Standup

**1. Pull top-line metrics:**
```sql
SELECT * FROM metrics.dashboard_latest LIMIT 1;
```

**2. Check all alerts:**
```sql
SELECT
  alert_type,
  count(*) AS weeks_flagged,
  string_agg(DISTINCT diagnosis, ' | ') AS consolidated_diagnosis
FROM metrics.alert_dashboard
WHERE week >= current_date - INTERVAL '4 weeks'
GROUP BY alert_type
ORDER BY weeks_flagged DESC;
```

**3. Voice Check:**
```sql
SELECT top_tags FROM metrics.voice_check_top2
ORDER BY week DESC LIMIT 1;
```

**4. Circuit breaker:**
```sql
SELECT circuit_breaker_pct FROM metrics.weekly_scoreboard
WHERE week = date_trunc('week', current_date - interval '1 week')::date;
```

**Standup format:**
- Active users: [X] (±Y% vs last week)
- Alerts: [None | List with severity]
- Voice check: [Top 2 tags]
- Circuit breaker: [X%] (🚨 if >0)
- Key decision: [Keep going | Review X area]

---

## 9. North Star

Metrics exist to **protect therapeutic presence**, not to maximize usage.

| Element | Role |
|---------|------|
| **Numbers** | Compass (direction) |
| **Voice Check** | Conscience (truth) |
| **Guardrails** | Integrity (boundaries) |
| **Charter v1.1** | North Star (purpose) |

### The Three Questions

Before shipping any change, ask:

1. **Do the numbers support it?** (Metrics green)
2. **Does it feel right?** (Voice Check positive)
3. **Does it serve presence?** (Charter alignment)

All three must be yes. If metrics say yes but Voice Check says no, **trust the qualitative**.

---

## 10. Automated Alert Summary

All guardrails codified in `/sql/metrics/50_diagnostic_alerts.sql`:

| Alert | Trigger | Response |
|-------|---------|----------|
| **Giving Up Pattern** | Accuracy ↑ + Engagement ↓ + Trust <65% + Retention negative | Review Voice Check for "stopped trying" signals |
| **Correction Fatigue** | Uncertainty engagement <baseline -10pp + fatigue tags | Reduce hedge frequency per calibration rules |
| **Aesthetic Breakdown** | Accuracy >70% + Trust declining + aesthetic tags | Review timing, pauses, UI per Aesthetic lane (20%) |
| **Re-entry Failure** | 7-29d continuation <50% | Fix welcome-back flow |
| **Circuit Breaker** | Any session >5 corrections | STOP ship, fix escape hatches |

**Master query:**
```sql
SELECT * FROM metrics.alert_dashboard
WHERE week >= current_date - INTERVAL '4 weeks'
ORDER BY week DESC, alert_status DESC;
```

---

## 11. Rules to Live By

1. **If correction accuracy is rising and repair engagement is falling, we're succeeding** — BUT only if trust stays high (≥70%) and repair users return more.

2. **If circuit breaker ever rises above 0%, we stop and fix the experience** before shipping more insights.

3. **Metrics serve the Charter, not the other way around.** If numbers look good but Voice Check says "felt robotic," trust the qualitative.

4. **Baseline everything.** Weeks 1-2 establish normal; optimize from there.

5. **One user having a terrible experience matters more** than 99 users having a slightly better one.

6. **Numbers tell you what's happening; Voice Check tells you why.**

7. **Therapeutic presence is non-negotiable.** All optimization serves this, or we don't ship.

---

**Built for:** MAIA Voice Interface
**Aligned to:** Charter v1.1 (50% Mechanics, 30% Language, 20% Aesthetic)
**Owned by:** Product + Data teams
**Reviewed:** Weekly with alert dashboard
**Updated:** 2025-10-01
