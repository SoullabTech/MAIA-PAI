# MAIA Voice Interface: Metrics Dashboard

## Core Success Gates
Quant + Qual, aligned to Charter v1.1. Percentages guide; the *Voice Check* keeps us honest.

---

## Weekly Tracking Table

| Week | Repair Engagement % | **Correction Accuracy %** | Trust Signals % | Uncertainty Acceptance % | Re-Entry 7–29d % | Re-Entry ≥30d % | **Circuit Breaker (sessions >5 fixes)** | **Voice Check (Qual)** | Notes |
|------|---------------------|---------------------------|-----------------|--------------------------|------------------|-----------------|-----------------------------------------|------------------------|-------|
| 1    |                     | (baseline)                |                 | (baseline)               |                  |                 |                                         |                        |       |
| 2    |                     | (baseline)                |                 | (baseline)               |                  |                 |                                         |                        |       |
| 3    |                     |                           |                 |                          |                  |                 |                                         |                        |       |
| 4    | ≥30% target         | ↑ vs Wk1–2                |                 |                          |                  |                 | 0% target                               |                        |       |
| 8    | context only        | ≥Wk1–2 +10pp              | ≥70% target     | >40% target (vs baseline)| ≥60% target      | track trend     | 0% target                               |                        |       |
| 12   | context only        | stable/↑                  |                 |                          |                  |                 | 0% target                               |                        |       |

### Definitions (human terms)

- **Repair Engagement %** — % of active users who corrected at least once this week. Expect this to **drop** over time as MAIA learns.
- **Correction Accuracy %** — Of entries where MAIA suggested a label, % the user accepted without change (or confirmed). Falling repairs with **rising accuracy** = healthy.
- **Trust Signals %** — % of "felt heard" ≥4/5 in micro-polls.
- **Uncertainty Acceptance %** — % of hedged prompts the user engaged with. Compare to Weeks 1–2 **baseline** before optimizing.
- **Re-Entry 7–29d / ≥30d %** — % of re-entry events that led to journaling within 48h, segmented by absence length.
- **Circuit Breaker** — % of sessions with **>5 corrections**. Any non-zero here is a red flag; triggers a "pause/escape hatch" review.
- **Voice Check (Qual)** — One-line pattern each week from tagged feedback, e.g., "felt rushed," "finally listened," "too many prompts."

### Voice Check capture

Tag micro-feedback with 3–5 canonical labels: `felt_rushed`, `too_many_prompts`, `finally_listened`, `confusing_ui`, `timing_just_right`. Summarize top 2 each week.

---

## Metric Details

### 1. Repair Engagement (Target: ≥30% Week 4)

**What it measures:** % of active users who gave at least one correction (thumbs down, element fix, transcript edit, escape hatch) this week.

**Why it matters:** Shows co-creation is happening. Users feel safe enough to correct MAIA.

**Expected trajectory:**
- **Weeks 1-4:** Rise to ~30-40% (users learning the repair UI)
- **Weeks 5-8:** Plateau or slight decline (MAIA learning individual preferences)
- **Weeks 9-12:** Drop to ~15-25% (MAIA mostly accurate now)

**Healthy pattern:** Falling repair engagement + rising correction accuracy.

**Red flags:**
- Stays >40% past Week 8 → MAIA not learning
- Drops below 15% by Week 4 → Users not engaging with repair UI

---

### 2. Correction Accuracy (Target: Baseline +10pp by Week 8)

**What it measures:** Of entries where MAIA suggested a symbol/element label, what % did the user accept as-is?

**Why it matters:** Direct measure of MAIA's learning. High accuracy = understanding user's personal language.

**Expected trajectory:**
- **Weeks 1-2:** Establish baseline (~40-60% typical)
- **Week 8:** +10 percentage points above baseline
- **Week 12:** Stable or rising

**Healthy pattern:** Rising accuracy while repair engagement falls.

**Red flags:**
- Accuracy flat or falling → Repair data not feeding back into model
- Accuracy >90% too soon → MAIA playing it safe, not learning edge cases

---

### 3. Trust Signals (Target: ≥70% by Week 8)

**What it measures:** % of users rating "felt heard" ≥4/5 on post-session micro-polls.

**Why it matters:** Core therapeutic presence metric. Without this, nothing else matters.

**Expected trajectory:**
- **Weeks 1-2:** Wide variance (50-80%)
- **Week 4:** Stabilize around 65-75%
- **Week 8:** ≥70% consistently

**Healthy pattern:** Steady or rising, with low week-to-week variance.

**Red flags:**
- Below 60% anytime → Voice/language/aesthetic issues
- High variance (±15% week-to-week) → Inconsistent experience

---

### 4. Uncertainty Acceptance (Target: >40% vs baseline by Week 8)

**What it measures:** When MAIA hedges ("I might be missing something…" or "Two threads here, which feels truer?"), what % of users engage vs. ignore?

**Why it matters:** Tests if humble language builds trust. Users who answer hedged prompts trust MAIA's honesty.

**Expected trajectory:**
- **Weeks 1-2:** Establish baseline (~25-35% typical)
- **Week 8:** >40% vs. baseline (e.g., if baseline was 30%, target is >42%)

**Healthy pattern:** Rising engagement with clarifying questions.

**Red flags:**
- Below baseline → Hedging feels like weakness/incompetence
- Above 80% → Too many hedged prompts (user fatigue)

---

### 5. Re-Entry Success (Target: ≥60% for 7-29d by Week 8)

**What it measures:** After a 7+ day absence, % of users who journal within 48h of their next session start.

**Why it matters:** Tests welcome-back flow. Can MAIA re-engage users after a gap without overwhelming them?

**Segments:**
- **7-29 days:** "Short" absence (vacation, busy week)
- **≥30 days:** "Long" absence (life event, potential churn)

**Expected trajectory:**
- **7-29d segment:** 50-60% Weeks 1-4 → ≥60% by Week 8
- **≥30d segment:** Track trend (no hard target; expected to be lower)

**Red flags:**
- 7-29d below 50% → Welcome-back flow broken
- ≥30d above 7-29d → Something weird with segmentation logic

---

### 6. Circuit Breaker (Target: 0% always)

**What it measures:** % of sessions with >5 corrections.

**Why it matters:** **Any non-zero is a failure.** >5 corrections = MAIA fundamentally isn't getting the user. Escape hatches should kick in before this.

**Expected trajectory:** 0% every week.

**Red flags:**
- Any non-zero → **Stop ship.** Review those sessions manually. Why didn't escape hatches fire?

---

### 7. Retention Effect (Target: Positive lift by Week 8)

**What it measures:** Next-week return rate for users who engaged in repair vs. those who didn't.

**Why it matters:** Tests if repair loop creates stickiness or frustration.

**Calculation:**
```
Lift (pp) = Return rate (repair users) - Return rate (non-repair users)
```

**Expected trajectory:**
- **Weeks 1-4:** May be neutral or slightly negative (users still learning UI)
- **Week 8:** Positive lift (repair users return 5-15pp more)
- **Week 12:** Sustained positive lift

**Red flags:**
- Negative lift past Week 6 → Repair is frustrating, not engaging
- No lift by Week 12 → Repair not creating meaningful co-creation

---

### 8. Voice Check (Qualitative)

**What it measures:** Top 2 feedback tags per week from open-ended comments.

**Why it matters:** Catches what numbers miss. "Felt rushed" or "Finally something that listens" are critical signals percentages won't show.

**How to capture:**
- Add 5 canonical tags to feedback form: `felt_rushed`, `too_many_prompts`, `finally_listened`, `confusing_ui`, `timing_just_right`
- Users can select multiple
- Track top 2 per week in dashboard

**Healthy pattern:** Positive tags rise, negative tags fall.

**Red flags:**
- `felt_rushed` or `too_many_prompts` in top 2 for 3+ consecutive weeks → Pacing/volume issues
- No `finally_listened` by Week 8 → Language/mechanics not landing

---

## Implementation Notes

### Data Collection Points

1. **After each journal entry:**
   - Log `element_suggested`, `element_final`, `confidence_score` in `journal_entries`
   - If user corrects: insert row in `corrections` table

2. **Post-session micro-poll** (1-2 questions max):
   - "How heard did you feel? (1-5)" → `felt_heard_score`
   - Optional: "Pick what resonated: [tags]" → `tags[]`

3. **When MAIA hedges:**
   - Log in `beta_feedback.responded_uncertainty`:
     - `true` if user answered the clarifying question
     - `false` if user ignored it / changed subject

4. **Session tracking:**
   - `user_sessions.started_at` for gap analysis
   - `user_sessions.ended_at` (or infer from last activity)

### SQL Queries

All metrics auto-computed via:
```sql
SELECT * FROM metrics.dashboard_latest;
```

See `/sql/metrics/README.md` for setup and `/sql/metrics/40_usage_examples.sql` for individual KPI queries.

---

## Circuit Breaker Protocol

**If `circuit_breaker_pct > 0` any week:**

1. **STOP adding new features.** Fix the experience first.

2. **Pull affected sessions:**
   ```sql
   -- See 40_usage_examples.sql for full query
   SELECT user_id, started_at, corrections, correction_types
   FROM metrics.circuit_breaker_sessions
   ORDER BY corrections DESC;
   ```

3. **Review manually:** What went wrong? ASR errors? Wrong element suggestions? Confusing UI?

4. **Check escape hatches:** Why didn't "Just save my words" or "MAIA, pause" fire?

5. **Fix and test** before next deploy.

---

## Weekly Review Template

**Every Monday, pull these 4 queries:**

1. **Top-line:**
   ```sql
   SELECT * FROM metrics.dashboard_latest LIMIT 1;
   ```

2. **Week-over-week change:**
   ```sql
   -- See 40_usage_examples.sql: "Weekly Review Template"
   ```

3. **Voice Check:**
   ```sql
   SELECT top_tags FROM metrics.voice_check_top2
   ORDER BY week DESC LIMIT 1;
   ```

4. **Circuit breaker:**
   ```sql
   SELECT circuit_breaker_pct FROM metrics.weekly_scoreboard
   WHERE week = date_trunc('week', current_date - interval '1 week')::date;
   ```

**Standup format:**
- Active users: [X] (±Y% vs last week)
- Repair engagement: [X%] (target: ≥30% by Wk4)
- Trust signals: [X%] (target: ≥70% by Wk8)
- Voice check: [Top 2 tags]
- Circuit breaker: [X%] (🚨 if >0)

---

## Rules to Live By

1. **If correction accuracy is rising and repair engagement is falling, we're succeeding.**
2. **If circuit breaker ever rises above 0%, we stop and fix the experience before shipping more insights.**
3. **Metrics serve the Charter, not the other way around.** If numbers look good but Voice Check says "felt robotic," trust the qualitative.
4. **Baseline everything.** Weeks 1-2 establish normal; optimize from there.

---

## Future Enhancements (Post-Week 12)

- **Personal lexicon tracking:** "You've taught me 6 symbols" counter
- **Confidence calibration:** Track `confidence_score` distribution vs. actual accuracy
- **Repair type breakdown:** Which correction types (thumbs down vs. element fix vs. escape hatch) correlate with retention?
- **Qualitative NLP:** Auto-tag open feedback for Voice Check (vs. manual canonical tags)

---

**Built for:** MAIA Voice Interface
**Aligned to:** Charter v1.1 (50% Mechanics, 30% Language, 20% Aesthetic)
**Owned by:** Product + Data teams
**Reviewed:** Weekly
**Updated:** 2025-10-01
