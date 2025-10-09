# MAIA Voice Metrics: Diagnostic Playbook

## When Numbers Lie (and Voice Check Tells the Truth)

Metrics can mask problems. This playbook catches what averages hide.

---

## 🚨 Pattern 1: "Giving Up" Signal

### What it looks like
- ✅ Correction accuracy **rising** (+5pp or more)
- ❌ Repair engagement **falling** (-5pp or more)
- ❌ Retention lift **negative**
- 🗣️ Voice check: "not worth correcting" or silence

### Why it's dangerous
Users aren't correcting because MAIA is accurate—they're giving up because it's frustrating.

### How to detect
```sql
SELECT * FROM metrics.giving_up_signal
WHERE pattern = 'HIGH_RISK_GIVING_UP'
ORDER BY week DESC;
```

### What to do
1. **Pull affected users:** Find users with falling correction rate
2. **Check voice feedback:** Look for frustration signals
3. **Review correction UI:** Is it too hidden? Too hard?
4. **Test repair flow:** Do corrections actually improve next suggestions?
5. **Add escape hatch nudge:** "Not working? Just say 'save my words'"

### Healthy alternative
- Accuracy rising, engagement falling, **but retention positive** = MAIA learning (expected!)

---

## ⚠️ Pattern 2: Correction Fatigue

### What it looks like
- 🗣️ Voice check: "keeps asking if it's right" or "too many prompts"
- ❌ Uncertainty acceptance **below baseline** (-10pp)
- ❌ Trust signals dropping

### Why it's dangerous
Too many hedged prompts erode confidence. Users want partnership, not constant self-doubt.

### How to detect
```sql
SELECT * FROM metrics.correction_fatigue
WHERE fatigue_level = 'HIGH_FATIGUE'
ORDER BY week DESC;
```

### What to do
1. **Audit hedge frequency:** Are you asking "is this close?" on >40% of entries?
2. **Raise confidence threshold:** Only hedge when confidence <60% (was <70%)
3. **Batch corrections:** Ask once at end, not after every element
4. **Add confidence:** Use "I notice..." instead of "I might be wrong..."
5. **A/B test:** Half get fewer hedges, measure trust signals

### Target
- Ask for correction on ~25% of entries by Week 8 (down from 50% Week 1)

---

## ✅ Pattern 3: Aesthetic Lane Working

### What it looks like
- 🗣️ Voice check: "finally listened", "doesn't rush me", "timing just right"
- ✅ Trust signals ≥70%
- ✅ Re-entry (7-29d) ≥60%

### Why it matters
Aesthetic (20% of Charter) creates the *feeling* of presence. Numbers won't show this—only voice check will.

### How to detect
```sql
SELECT * FROM metrics.aesthetic_wins
WHERE aesthetic_state = 'AESTHETIC_WORKING'
ORDER BY week DESC;
```

### What to amplify
- **Timing:** Keep 2-3s pause tolerance
- **Silence:** Breathing animation (not spinner)
- **Rhythm:** Slight delays feel organic
- **Visual:** Three-state system (listening → thinking → complete)

### If broken ("felt rushed")
1. **Check pause detection:** Are you cutting off mid-thought?
2. **Review response speed:** Too fast feels robotic (<1s)
3. **Test on slow speakers:** Older users, contemplative journalers
4. **Add "still listening" cue:** After 2s of silence

---

## ✅ Pattern 4: Mechanics Lane Success

### What it looks like
- 🗣️ Voice check: "feels like it's learning me"
- ✅ Correction accuracy >70%
- ✅ Retention lift positive (+5pp)
- ↘️ Repair engagement falling (healthy!)

### Why it matters
Mechanics (50% of Charter) = the moat. This is co-creation working.

### How to detect
```sql
SELECT * FROM metrics.mechanics_wins
WHERE mechanics_state = 'MECHANICS_SUCCEEDING'
ORDER BY week DESC;
```

### What to amplify
- **Show learning:** "You've taught me 6 symbols so far"
- **Celebrate fixes:** "Thanks, I'll remember that"
- **Surface patterns:** "I notice you often map 'stuck' to Water-3"
- **Add lexicon view:** Users can see their personal symbol dictionary

### If struggling (accuracy <50%)
1. **Check feedback loop:** Are corrections being saved?
2. **Review model:** Is personal lexicon feeding into next suggestions?
3. **Test memory:** Suggest same wrong symbol twice = memory broken
4. **Add confirmation:** "I'll map 'anxious' to Fire-2 from now on. Sound right?"

---

## 🚨 Pattern 5: Circuit Breaker Triggered

### What it looks like
- ❌ Circuit breaker >0% (ANY session with >5 corrections)

### Why it's critical
>5 corrections in one session = catastrophic misalignment. Escape hatches should fire before this.

### How to detect
```sql
SELECT week, circuit_breaker_pct, active_users
FROM metrics.weekly_scoreboard
WHERE circuit_breaker_pct > 0
ORDER BY week DESC;
```

### What to do (STOP SHIP)
1. **Pull affected sessions:**
   ```sql
   -- See 40_usage_examples.sql: "Users who triggered circuit breaker"
   ```
2. **Review manually:** What went wrong? ASR errors? Wrong elements? UI confusion?
3. **Check escape hatches:**
   - Did "Just save my words" button appear?
   - Did "MAIA, pause" voice command work?
   - Did "Start fresh" option show?
4. **Fix and test** before next deploy
5. **Add earlier intervention:** Show escape hatch at 3 corrections (not 5)

### Target
**0% always.** Any non-zero = failure.

---

## Weekly Review Protocol

Every Monday, run this query:

```sql
SELECT * FROM metrics.weekly_diagnostics
ORDER BY week DESC
LIMIT 1;
```

### Red flags (stop and fix)
- ❌ Circuit breaker >0%
- ❌ Giving up pattern = HIGH_RISK
- ❌ Trust signals <60%
- ❌ Correction fatigue = HIGH

### Yellow flags (monitor next 2 weeks)
- ⚠️ Giving up pattern = MONITOR
- ⚠️ Correction fatigue = MONITOR
- ⚠️ Trust signals 60-70%
- ⚠️ Voice check: negative tags 2+ weeks in a row

### Green signals (amplify)
- ✅ Aesthetic wins: "finally listened"
- ✅ Mechanics wins: "learning me"
- ✅ Trust signals ≥70%
- ✅ Retention lift positive

---

## Cross-Reference Rules

### Never trust a single metric
Always check 3 dimensions:

1. **Quantitative metric** (e.g., correction accuracy)
2. **Cohort behavior** (e.g., retention lift)
3. **Qualitative signal** (e.g., voice check)

### Example: Rising accuracy
| Accuracy | Engagement | Retention | Voice Check | Diagnosis |
|----------|-----------|-----------|-------------|-----------|
| ⬆️ +10pp | ⬇️ -15pp  | ❌ -5pp   | "not worth it" | 🚨 Giving up |
| ⬆️ +10pp | ⬇️ -10pp  | ✅ +8pp   | "learning me" | ✅ Healthy learning |
| ⬆️ +5pp  | ➡️ 0pp    | ➡️ 0pp    | silence | ⚠️ Monitor (no signal) |

---

## Charter Alignment Check

The metrics should reflect the 50/30/20 mix:

### Mechanics (50%)
- Correction accuracy (**primary**)
- Repair engagement (context)
- Retention lift (outcome)

### Language (30%)
- Uncertainty acceptance
- Trust signals (felt heard)
- Voice check: "humble", "honest"

### Aesthetic (20%)
- Re-entry success
- Voice check: "doesn't rush", "timing"
- Trust signals (atmosphere)

**If metrics aren't moving but voice check is positive → trust voice check.**
**If metrics look good but voice check is negative → trust voice check.**

---

## When to Override the Numbers

### Scenario 1: Great metrics, bad voice check
- Metrics: 75% trust, 72% accuracy, +10pp retention
- Voice: "feels robotic", "too perfect"
- **Action:** Trust voice check. Add more hedging, slower responses.

### Scenario 2: Bad metrics, great voice check
- Metrics: 55% trust, 58% accuracy, -2pp retention
- Voice: "finally something real", "feels safe"
- **Action:** Trust voice check. Users are adjusting. Give it 2 more weeks.

### Scenario 3: Mixed signals
- Metrics: 70% trust, 65% accuracy, +5pp retention
- Voice: "sometimes great, sometimes off"
- **Action:** Investigate variance. Likely some user segments love it, others struggle.

---

## Emergency Overrides

### If ANY of these happen, stop ship:
1. Circuit breaker >0%
2. Trust signals <50% for 2+ consecutive weeks
3. Voice check: "unsafe", "creepy", "invasive"
4. Retention lift <-10pp (users leaving faster than non-repair cohort)

### Immediate actions:
1. Roll back to previous version
2. Pull affected sessions manually
3. Interview 3-5 users in affected cohort
4. Fix root cause before re-deploy

---

## Success Patterns (Amplify These)

### Week 4 healthy state
- Repair engagement ~30%
- Correction accuracy baseline +5pp
- Trust signals ~65%
- Voice check: "starting to feel natural"

### Week 8 healthy state
- Repair engagement ~20% (falling from Week 4)
- Correction accuracy baseline +10pp
- Trust signals ≥70%
- Uncertainty acceptance >40% vs baseline
- Re-entry (7-29d) ≥60%
- Voice check: "feels like it gets me"

### Week 12 mature state
- Repair engagement ~15% (healthy decline)
- Correction accuracy stable/rising
- Trust signals ≥75%
- Retention lift +10-15pp
- Voice check: "finally, AI that doesn't lecture"

---

**Remember:** Metrics serve the Charter, not the other way around. If you're optimizing toward numbers but losing the soul, you're going the wrong direction.

**Built for:** MAIA Voice Interface
**Aligned to:** Charter v1.1 (50% Mechanics, 30% Language, 20% Aesthetic)
**Updated:** 2025-10-01
