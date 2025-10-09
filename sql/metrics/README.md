# MAIA Voice Metrics: SQL Analytics Kit

Implements all KPIs from **MAIA Voice Charter v1.1** for tracking repair mechanics, trust signals, uncertainty acceptance, re-entry success, and retention.

## Quick Start

```bash
# Run in order (Supabase SQL Editor or psql)
psql -U postgres -d soullab < 00_schema_extensions.sql
psql -U postgres -d soullab < 10_time_buckets.sql
psql -U postgres -d soullab < 20_repair_trust_metrics.sql
psql -U postgres -d soullab < 21_uncertainty_reentry.sql
psql -U postgres -d soullab < 22_retention_voice_check.sql
psql -U postgres -d soullab < 30_weekly_scoreboard.sql
psql -U postgres -d soullab < 40_usage_examples.sql  # optional: examples only
psql -U postgres -d soullab < 50_diagnostic_patterns.sql
```

Or in Supabase dashboard:
1. Open SQL Editor
2. Paste each file contents, run in order
3. Query `SELECT * FROM metrics.dashboard_latest;`

---

## What You Get

### 📊 Primary Dashboard View

```sql
SELECT * FROM metrics.dashboard_latest;
```

**Columns:**
- `week` - Monday of that week (America/New_York)
- `active_users` - Users with ≥1 journal entry
- `repair_engagement_pct` - % users who corrected ≥1x
- `correction_accuracy_pct` - % suggestions accepted as-is
- `trust_signals_pct` - % users with felt_heard ≥4/5
- `uncertainty_acceptance_pct` - % engaged with clarifying prompts
- `uncertainty_baseline_pct` - Weeks 1-2 baseline
- `reentry_7_29d_pct` - % continued after 7-29 day gap
- `reentry_ge30d_pct` - % continued after ≥30 day gap
- `circuit_breaker_pct` - % sessions with >5 corrections (should be 0)
- `retention_lift_pp` - Repair users' return rate boost (percentage points)
- `voice_check` - Top 2 qualitative tags

---

## Charter v1.1 Target Gates

| Metric | Week 4 | Week 8 | Week 12 | Notes |
|--------|--------|--------|---------|-------|
| Repair Engagement | ≥30% | — | — | Expected to **drop** as MAIA learns |
| Correction Accuracy | Baseline | +10pp | Stable/↑ | Should **rise** over time |
| Trust Signals | — | ≥70% | — | Felt heard ≥4/5 |
| Uncertainty Acceptance | — | >40% vs baseline | — | Engaged with hedged prompts |
| Re-entry (7-29d) | — | ≥60% | — | Continued within 48h |
| Circuit Breaker | 0% | 0% | 0% | >5 corrections/session = failure |
| Retention Lift | — | Positive | — | Repair users return more |

---

## Files Overview

### `00_schema_extensions.sql`
- Adds `element_suggested`, `element_final`, `confidence_score` to `journal_entries`
- Creates `corrections` table for repair tracking
- Adds `responded_uncertainty`, `felt_heard_score` to `beta_feedback`
- Creates `metrics` schema

### `10_time_buckets.sql`
- Week bucketing function (Monday starts, America/New_York)
- Active users denominator view

### `20_repair_trust_metrics.sql`
- Repair Engagement
- Correction Accuracy
- Trust Signals
- Circuit Breaker

### `21_uncertainty_reentry.sql`
- Uncertainty Acceptance (with baseline)
- Re-entry Success (segmented by 7-29d vs ≥30d gaps)

### `22_retention_voice_check.sql`
- Retention cohort comparison (repair vs non-repair)
- Voice Check qualitative tags

### `30_weekly_scoreboard.sql`
- Main rollup: all KPIs in one view
- `metrics.weekly_scoreboard` - full history
- `metrics.dashboard_latest` - last 12 weeks

### `40_usage_examples.sql`
- Copy-paste queries for common tasks
- User-level deep dives
- Weekly review template

### `50_diagnostic_patterns.sql`
- "Giving up" detection (accuracy rising + engagement falling + retention negative)
- Correction fatigue alerts (too many prompts)
- Aesthetic lane tracking ("finally listened" signals)
- Mechanics lane tracking ("learning me" signals)
- Weekly diagnostic dashboard (all pattern alerts)

---

## How the Metrics Work

### 1. Repair Engagement
**What:** % of active users who made ≥1 correction this week
**Source:** `corrections` table
**Target:** ≥30% Week 4 (then expected to drop)
**Interpretation:** Falling repairs + rising accuracy = healthy learning

### 2. Correction Accuracy
**What:** % of MAIA suggestions accepted without changes
**Source:** `journal_entries.element_suggested` vs `element_final`
**Target:** Rising over time (+10pp by Week 8)
**Interpretation:** High = MAIA is learning user's language

### 3. Trust Signals
**What:** % of users with felt_heard ≥4/5
**Source:** `beta_feedback.felt_heard_score`
**Target:** ≥70% by Week 8
**Interpretation:** Core therapeutic presence metric

### 4. Uncertainty Acceptance
**What:** % of hedged/clarifying prompts user engaged with
**Source:** `beta_feedback.responded_uncertainty`
**Target:** >40% vs Weeks 1-2 baseline
**Interpretation:** Users trust MAIA enough to answer "I might be wrong" questions

### 5. Re-entry Success
**What:** % of returning users (after 7+ day gap) who journaled within 48h
**Source:** `user_sessions` gap analysis
**Target:** ≥60% for 7-29d gaps by Week 8
**Interpretation:** Welcome-back flow works; users don't abandon on return

### 6. Circuit Breaker
**What:** % of sessions with >5 corrections
**Source:** `corrections` per `user_sessions`
**Target:** 0% always
**Interpretation:** Any non-zero = UX breakdown, triggers escape hatch review

### 7. Retention Lift
**What:** Next-week return rate difference: repair users vs non-repair
**Source:** Cohort comparison
**Target:** Positive (repair users return more)
**Interpretation:** Repair loop creates stickiness, not frustration

### 8. Voice Check
**What:** Top 2 qualitative feedback tags per week
**Source:** `beta_feedback.tags[]`
**Target:** Qualitative patterns (no numeric target)
**Interpretation:** Catches what numbers miss: "felt rushed," "finally listened," etc.

---

## Schema Requirements

Your database **must have** these columns for metrics to work:

### `journal_entries`
```sql
element_suggested text        -- MAIA's suggestion
element_final text             -- User's confirmed/corrected value
was_saved_raw boolean          -- "Just save my words" escape hatch
confidence_score numeric       -- 0-1 confidence (optional for future use)
```

### `corrections`
```sql
entry_id uuid                  -- Which journal entry
correction_type text           -- thumbs_down | element_fix | transcript_edit | escape_hatch | clarity_given
old_value text                 -- Before
new_value text                 -- After
```

### `beta_feedback`
```sql
felt_heard_score int           -- 1-5 scale
responded_uncertainty boolean  -- Engaged with clarifying prompt?
tags text[]                    -- For Voice Check
```

### `user_sessions`
```sql
started_at timestamptz         -- Session start
ended_at timestamptz           -- Session end (nullable)
```

Run `00_schema_extensions.sql` to add missing columns.

---

## Refresh Strategy

### Option 1: Real-time views (simpler)
Views refresh automatically. Just query `metrics.dashboard_latest`.

**Pros:** Always current, no cron jobs
**Cons:** Slower on large datasets (100k+ entries)

### Option 2: Materialized views (faster)
```sql
-- Convert to materialized view
CREATE MATERIALIZED VIEW metrics.scoreboard_mv AS
SELECT * FROM metrics.weekly_scoreboard;

-- Refresh daily at 6am ET
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule(
  'refresh-metrics',
  '0 6 * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY metrics.scoreboard_mv$$
);
```

**Pros:** 10-100x faster queries
**Cons:** Requires `pg_cron` extension, slightly stale data

---

## Troubleshooting

### "No data showing up"
```sql
-- Check if you have entries
SELECT count(*) FROM journal_entries;

-- Check if corrections table has data
SELECT count(*) FROM corrections;

-- Check week bucketing
SELECT DISTINCT metrics.week_bucket(created_at) FROM journal_entries;
```

### "Percentages look wrong"
```sql
-- Verify denominators
SELECT * FROM metrics.denominators ORDER BY week DESC LIMIT 4;

-- Check individual metric views
SELECT * FROM metrics.repair_engagement ORDER BY week DESC LIMIT 4;
```

### "Circuit breaker not working"
The circuit breaker query is expensive (session-correction JOIN). If slow:
```sql
-- Refresh the cache manually
REFRESH MATERIALIZED VIEW metrics.circuit_breaker_cache;
```

### "user_id type mismatch"
Some tables have `user_id uuid`, others `user_id text`. The SQL uses `COALESCE(user_id::uuid, auth.uid())` to handle both. If you still get errors:
```sql
-- Standardize to UUID everywhere
ALTER TABLE user_sessions ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
```

---

## Adding Custom Metrics

Follow this pattern:

```sql
-- 1. Create component view
CREATE OR REPLACE VIEW metrics.my_metric AS
SELECT
  metrics.week_bucket(created_at) AS week,
  user_id,
  count(*) AS my_count
FROM my_table
GROUP BY 1, 2;

-- 2. Add to scoreboard
-- Edit 30_weekly_scoreboard.sql, add a new CTE:
my_metric AS (
  SELECT week, sum(my_count) AS total
  FROM metrics.my_metric
  GROUP BY 1
)

-- 3. Add column to final SELECT
, my_metric.total AS my_metric_total
```

---

## Diagnostic Patterns

Beyond the basic metrics, `50_diagnostic_patterns.sql` catches problems that averages hide:

### 1. "Giving Up" Detection
**Problem:** Users stop correcting because they're frustrated, not because MAIA is accurate.
**Signal:** Accuracy rising + engagement falling + retention negative
**Action:** See `DIAGNOSTIC_PLAYBOOK.md` → Pattern 1

### 2. Correction Fatigue
**Problem:** Too many hedged prompts ("is this close?") erode confidence.
**Signal:** Voice check "too many prompts" + uncertainty acceptance below baseline
**Action:** Reduce hedge frequency, raise confidence threshold

### 3. Aesthetic Lane Tracking
**Success:** "Finally listened", "doesn't rush me", "timing just right"
**Failure:** "Felt rushed", "confusing UI"
**Action:** Amplify what's working in timing/pacing/presence

### 4. Mechanics Lane Tracking
**Success:** "Feels like it's learning me" + accuracy >70% + retention positive
**Failure:** Accuracy <50% = repair loop not feeding back
**Action:** Fix feedback loop, show learning ("You've taught me 6 symbols")

### 5. Circuit Breaker (Emergency)
**Problem:** >5 corrections in one session = catastrophic misalignment
**Signal:** `circuit_breaker_pct > 0`
**Action:** STOP SHIP. Review sessions manually. Fix escape hatches.

**Weekly diagnostic dashboard:**
```sql
SELECT * FROM metrics.weekly_diagnostics
ORDER BY week DESC LIMIT 1;
```

See **`DIAGNOSTIC_PLAYBOOK.md`** for full playbook with red flags, green signals, and override rules.

---

## Support

Questions? Check:
- **Charter v1.1:** `/docs/MAIA_VOICE_CHARTER_v1.1.md`
- **Metrics Spec:** `/docs/MAIA_VOICE_METRICS.md`
- **Diagnostic Playbook:** `DIAGNOSTIC_PLAYBOOK.md`
- **Examples:** `40_usage_examples.sql`

---

**Built for:** MAIA Voice Interface
**Aligned to:** Charter v1.1 (50% Mechanics, 30% Language, 20% Aesthetic)
**Updated:** 2025-10-01
