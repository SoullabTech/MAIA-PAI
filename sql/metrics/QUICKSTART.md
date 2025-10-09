# MAIA Voice Metrics: Quick Start

Get the full Charter v1.1 metrics dashboard running in 10 minutes.

---

## Installation (One-Time Setup)

### 1. Run SQL Files in Order

In Supabase SQL Editor or `psql`:

```bash
# Option A: Supabase SQL Editor
# Copy-paste each file contents and run in order

# Option B: Command line
psql -U postgres -d soullab -f sql/metrics/00_schema_extensions.sql
psql -U postgres -d soullab -f sql/metrics/10_time_buckets.sql
psql -U postgres -d soullab -f sql/metrics/20_repair_trust_metrics.sql
psql -U postgres -d soullab -f sql/metrics/21_uncertainty_reentry.sql
psql -U postgres -d soullab -f sql/metrics/22_retention_voice_check.sql
psql -U postgres -d soullab -f sql/metrics/30_weekly_scoreboard.sql
psql -U postgres -d soullab -f sql/metrics/40_usage_examples.sql
psql -U postgres -d soullab -f sql/metrics/50_diagnostic_alerts.sql
```

**Run order matters.** Each file builds on the previous.

### 2. Verify Installation

```sql
-- Should return structure (probably empty data initially)
SELECT * FROM metrics.dashboard_latest;

-- Check schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'metrics';
```

---

## Daily Operations

### Monday Morning Standup (5 minutes)

**1. Top-line metrics:**
```sql
SELECT * FROM metrics.dashboard_latest LIMIT 1;
```

**2. Any alerts?**
```sql
SELECT * FROM metrics.alert_dashboard
WHERE week >= current_date - INTERVAL '4 weeks';
```

**3. Voice Check:**
```sql
SELECT * FROM metrics.voice_check_top2
ORDER BY week DESC LIMIT 1;
```

**That's it.** If alerts are empty and Voice Check is positive, keep going. If alerts fire, see Guardrails doc.

---

## What Each Metric Means

| Metric | Target | What It Means | Healthy Looks Like |
|--------|--------|---------------|-------------------|
| **Repair Engagement %** | ≥30% Week 4 | % users who corrected ≥1x | Rising Weeks 1-4, then falling as MAIA learns |
| **Correction Accuracy %** | Baseline +10pp by Week 8 | % suggestions accepted | Rising over time |
| **Trust Signals %** | ≥70% Week 8 | % felt heard ≥4/5 | Steady/rising, low variance |
| **Uncertainty Acceptance %** | >40% vs baseline Week 8 | % engaged with hedged prompts | Rising vs. Weeks 1-2 |
| **Re-entry 7-29d %** | ≥60% Week 8 | % continued within 48h | Rising, stable |
| **Re-entry ≥30d %** | Track trend | Long absence continuation | Lower than 7-29d |
| **Circuit Breaker %** | 0% always | % sessions >5 corrections | Always zero |
| **Retention Lift (pp)** | Positive Week 8 | Repair users return more | Positive, stable |
| **Voice Check** | Qualitative | Top feedback tags | Positive tags rising |

---

## Alerts Cheat Sheet

| Alert | Meaning | First Action |
|-------|---------|--------------|
| 🚨 **Giving Up Pattern** | Accuracy up but users stopped teaching | Check Voice Check for "stopped trying" |
| 🚨 **Correction Fatigue** | Too many prompts | Reduce hedge frequency (Charter v1.1 calibration) |
| 🚨 **Aesthetic Breakdown** | Mechanics work, trust doesn't | Review timing/pauses/UI (Aesthetic lane 20%) |
| 🚨 **Re-entry Failure** | Welcome-back flow broken | Fix re-engagement prompts |
| 🚨 **Circuit Breaker** | >5 corrections/session | STOP SHIP. Review escape hatches |

---

## Weekly Review Template

Copy this into your standup notes:

```markdown
## MAIA Voice Metrics - Week of [DATE]

### Top-Line
- Active users: [X] (±Y% vs last week)
- Repair engagement: [X%] (target: ≥30% by Wk4)
- Correction accuracy: [X%] (target: baseline +10pp by Wk8)
- Trust signals: [X%] (target: ≥70% by Wk8)

### Alerts
[None | List with severity]

### Voice Check
[Top 2 tags from this week]

### Circuit Breaker
[X%] (🚨 if >0)

### Decision
[Keep going | Review X area | Fix Y before next deploy]
```

---

## Common Queries

### Show me the last 4 weeks
```sql
SELECT * FROM metrics.weekly_scoreboard
WHERE week >= current_date - INTERVAL '4 weeks'
ORDER BY week DESC;
```

### Which users triggered circuit breaker?
```sql
-- See /sql/metrics/40_usage_examples.sql for full query
SELECT user_id, started_at, corrections
FROM metrics.circuit_breaker_sessions
ORDER BY corrections DESC;
```

### Voice Check deep dive
```sql
SELECT week, tag, tag_count
FROM metrics.voice_check
WHERE week >= current_date - INTERVAL '4 weeks'
ORDER BY week DESC, tag_count DESC;
```

### Repair vs non-repair user comparison
```sql
-- See /sql/metrics/40_usage_examples.sql: "Repair vs non-repair user profiles"
```

---

## Data Collection Points

For metrics to populate, your app needs to track:

### 1. Journal Entries
```typescript
// When user saves entry
await supabase.from('journal_entries').insert({
  user_id,
  prompt,
  response,
  element_suggested: maiasSuggestion,    // What MAIA suggested
  element_final: userConfirmedValue,     // What user kept/changed
  confidence_score: 0.85,                // Model confidence [0-1]
  was_saved_raw: false                   // "Just save my words" escape?
});
```

### 2. Corrections
```typescript
// When user gives thumbs down or edits
await supabase.from('corrections').insert({
  entry_id,
  user_id,
  correction_type: 'thumbs_down' | 'element_fix' | 'transcript_edit' | 'escape_hatch',
  old_value: maiasSuggestion,
  new_value: userCorrection
});
```

### 3. Feedback
```typescript
// Post-session micro-poll (1-2 questions max)
await supabase.from('beta_feedback').insert({
  user_id,
  felt_heard_score: 4,                   // 1-5 scale
  responded_uncertainty: true,           // Did they answer clarifying question?
  tags: ['finally_listened', 'timing_just_right']  // Voice Check tags
});
```

### 4. Sessions
```typescript
// On session start
const session = await supabase.from('user_sessions').insert({
  user_id,
  started_at: new Date()
}).select().single();

// On session end
await supabase.from('user_sessions')
  .update({ ended_at: new Date() })
  .eq('id', session.id);
```

---

## Troubleshooting

### "No data in dashboard"
```sql
-- Check if base tables have data
SELECT count(*) FROM journal_entries;
SELECT count(*) FROM corrections;
SELECT count(*) FROM beta_feedback;
SELECT count(*) FROM user_sessions;
```

### "Percentages look wrong"
```sql
-- Verify denominators
SELECT * FROM metrics.denominators ORDER BY week DESC LIMIT 4;

-- Check individual metrics
SELECT * FROM metrics.repair_engagement ORDER BY week DESC LIMIT 4;
```

### "Circuit breaker not working"
The query is expensive (session-correction JOIN). If slow, you can materialize it:
```sql
-- Run nightly via pg_cron
REFRESH MATERIALIZED VIEW CONCURRENTLY metrics.circuit_breaker_cache;
```

### "user_id type mismatch"
Some tables have `uuid`, others `text`. SQL handles both via `COALESCE(user_id::uuid, auth.uid())`. If errors persist:
```sql
-- Standardize to UUID
ALTER TABLE user_sessions ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
```

---

## File Reference

| File | Purpose | Run Order |
|------|---------|-----------|
| `00_schema_extensions.sql` | Add missing columns, create corrections table | 1 |
| `10_time_buckets.sql` | Week bucketing, denominators | 2 |
| `20_repair_trust_metrics.sql` | Repair, accuracy, trust, circuit breaker | 3 |
| `21_uncertainty_reentry.sql` | Uncertainty + re-entry segments | 4 |
| `22_retention_voice_check.sql` | Retention cohorts + Voice Check | 5 |
| `30_weekly_scoreboard.sql` | Master rollup view | 6 |
| `40_usage_examples.sql` | Copy-paste queries | 7 |
| `50_diagnostic_alerts.sql` | Automated alerts | 8 |

---

## Next Steps

1. ✅ Run SQL files 00-50
2. ✅ Add data collection points to app (see above)
3. ✅ Test with sample data
4. ✅ Run Monday standup query
5. ✅ Review `/docs/MAIA_VOICE_METRICS_GUARDRAILS.md` for interpretation

---

**Questions?**
- **Charter v1.1:** `/docs/MAIA_VOICE_CHARTER_v1.1.md`
- **Full Metrics Spec:** `/docs/MAIA_VOICE_METRICS.md`
- **Guardrails:** `/docs/MAIA_VOICE_METRICS_GUARDRAILS.md`
- **SQL Details:** `/sql/metrics/README.md`

**Built for:** MAIA Voice Interface
**Updated:** 2025-10-01
