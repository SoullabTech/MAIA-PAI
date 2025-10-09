# MAIA Voice Metrics SQL Scripts

**Purpose**: SQL views and monitors for tracking therapeutic presence in MAIA Voice interactions.

---

## Run Order

Execute scripts in this exact order (or use the all-in-one bundle if provided):

### 1. Prerequisites
Ensure these tables exist in your database:
- `auth.users` (Supabase auth schema)
- `public.journal_entries` (user journal entries)
- `public.corrections` (user correction events)
- `public.beta_feedback` (qualitative feedback + uncertainty responses)
- `public.user_sessions` (session tracking)

### 2. Metrics Foundation (run once)
```bash
psql $DATABASE_URL < sql/metrics/10_weekly_scoreboard_v2.sql
psql $DATABASE_URL < sql/metrics/20_baseline_views.sql
psql $DATABASE_URL < sql/metrics/30_voice_check.sql
```

**What these do**:
- `10_weekly_scoreboard_v2.sql`: Core metrics rollup (engagement, accuracy, re-entry, uncertainty, circuit breaker)
- `20_baseline_views.sql`: Establishes uncertainty acceptance baseline from Weeks 1-2
- `30_voice_check.sql`: Qualitative feedback tag aggregation

### 3. Guardrail Monitors (production monitoring)
```bash
psql $DATABASE_URL < sql/metrics/50_guardrail_monitors.sql
```

**What this does**:
- Creates 5 guardrail monitors (Giving Up, Circuit Breaker, Re-entry, Uncertainty, Voice Check)
- Creates `metrics.thresholds` table for tunable alert thresholds
- Creates `metrics.monitor_payload` view (single-query endpoint for API)

### 4. Test Harness (optional, for validation)
```bash
psql $DATABASE_URL < sql/metrics/99_seed_test_harness.sql
```

**What this does**:
- Seeds realistic test data across 6 weeks
- Triggers each guardrail at least once (including circuit breaker)
- Logs all inserted IDs to `metrics.seed_log` for easy cleanup

---

## Validation Queries

After running the scripts, verify everything works:

### Check Weekly Scoreboard
```sql
select * from metrics.weekly_scoreboard_v2 order by week desc limit 8;
```

**Expected**: Rows for recent weeks showing repair_engagement_pct, correction_accuracy_pct, uncertainty_acceptance_pct, etc.

### Check Guardrail Payload (API endpoint)
```sql
select * from metrics.monitor_payload;
```

**Expected**: Single row with:
- `overall_status`: 'OK' | 'WARN' | 'CRIT'
- `giving_up`: JSON blob with week, status, metrics
- `circuit_breaker`: JSON blob with week, status, circuit_breaker_pct
- `reentry`: JSON blob with week, status, reentry_7_29d_pct, reentry_ge30d_pct
- `uncertainty`: JSON blob with week, status, acceptance vs baseline
- `voicecheck`: JSON blob with week, status, negative_share_pct

### Check Individual Monitors
```sql
-- Giving Up detector
select * from metrics.monitor_giving_up;

-- Circuit breaker
select * from metrics.monitor_circuit_breaker;

-- Re-entry success
select * from metrics.monitor_reentry;

-- Uncertainty acceptance
select * from metrics.monitor_uncertainty;

-- Voice Check qualitative
select * from metrics.monitor_voicecheck;
```

### Check Voice Check Tags
```sql
with ranked as (
  select week, tag, tag_count,
         row_number() over (partition by week order by tag_count desc) as rn
  from metrics.voice_check
)
select week,
       string_agg(tag || ':' || tag_count, ', ' order by rn) as top_voice_signals
from ranked
where rn <= 2
group by week
order by week desc;
```

---

## Common Pitfalls

### 1. "relation auth.users does not exist"
**Problem**: Your database doesn't have Supabase auth schema.

**Fix**: Either:
- Set up Supabase auth first
- Or manually create test users:
  ```sql
  create schema if not exists auth;
  create table if not exists auth.users (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now()
  );
  insert into auth.users(id) values
    ('00000000-0000-0000-0000-000000000001'),
    ('00000000-0000-0000-0000-000000000002');
  ```

### 2. "No rows returned from metrics.monitor_payload"
**Problem**: No data in source tables (journal_entries, corrections, beta_feedback).

**Fix**: Run the test harness:
```bash
psql $DATABASE_URL < sql/metrics/99_seed_test_harness.sql
```

### 3. "Test harness auto-picks only one user"
**Problem**: You have fewer than 2 users in `auth.users`.

**Fix**: Edit `99_seed_test_harness.sql` and uncomment this block:
```sql
create temp table seed_users(user_a uuid, user_b uuid);
insert into seed_users(user_a, user_b)
values ('YOUR-USER-ID-1', 'YOUR-USER-ID-2');
```

### 4. "Thresholds seem wrong / too sensitive"
**Problem**: Default thresholds might not match your data distribution.

**Fix**: Tune thresholds without redeploying code:
```sql
-- View current thresholds
select * from metrics.thresholds order by key;

-- Update a threshold
update metrics.thresholds
set value = 1.0
where key = 'circuit_breaker_crit_pct';
```

**Common tuning targets**:
- `circuit_breaker_crit_pct`: Default 0.5% (critical if ≥0.5% of sessions have >5 corrections)
- `voicecheck_neg_warn_pct`: Default 25% (warn if ≥25% of feedback tags are negative)
- `giving_up_min_drop_pp`: Default 5pp (warn if engagement drops ≥5 percentage points)

### 5. "Baseline uncertainty is NULL"
**Problem**: You don't have data from the first 2 weeks yet.

**Expected**: `metrics.uncertainty_baseline` calculates average from Weeks 1-2. If you're in Week 1, baseline won't exist yet.

**Workaround**: Either:
- Wait until Week 2 data exists
- Or manually seed baseline:
  ```sql
  -- Check if baseline view is empty
  select * from metrics.uncertainty_baseline;

  -- If empty, the monitor will fall back to absolute threshold (10pp)
  -- No action needed unless you want to override
  ```

---

## Cleanup (Test Data)

After validating with the test harness, remove seed data:

1. Find your seed run_id:
   ```sql
   select run_id, created_at, user_a, user_b
   from metrics.seed_log
   order by created_at desc
   limit 1;
   ```

2. Uncomment and run the CLEANUP block in `99_seed_test_harness.sql`, or manually:
   ```sql
   begin;
     -- Replace with your actual run_id
     \set run_id 'YOUR-RUN-ID-HERE'

     delete from public.corrections
     where metadata ? 'seed_run'
       and metadata->>'seed_run' = :'run_id';

     delete from public.beta_feedback bf
     using metrics.seed_log sl
     where sl.run_id = :'run_id'::uuid
       and bf.id = sl.feedback_id;

     delete from public.journal_entries e
     using metrics.seed_log sl
     where sl.run_id = :'run_id'::uuid
       and e.user_id in (sl.user_a, sl.user_b)
       and e.created_at >= (now() - interval '40 days');

     delete from public.user_sessions s
     using metrics.seed_log sl
     where sl.run_id = :'run_id'::uuid
       and s.user_id in (sl.user_a, sl.user_b)
       and s.started_at >= (now() - interval '40 days');

     delete from metrics.seed_log where run_id = :'run_id'::uuid;
   commit;
   ```

---

## Updating Monitors

If you change logic in the guardrail monitors:

1. Edit `/sql/metrics/50_guardrail_monitors.sql`
2. Re-run the script (views will be recreated):
   ```bash
   psql $DATABASE_URL < sql/metrics/50_guardrail_monitors.sql
   ```
3. Verify with validation queries above
4. No restart needed (views are live)

---

## Integration with API

The API endpoint `/api/v1/admin/maia-guardrails` queries:
```sql
SELECT * FROM metrics.monitor_payload;
```

This returns a single row with:
- `overall_status`: 'OK' | 'WARN' | 'CRIT'
- 5 JSON blobs (giving_up, circuit_breaker, reentry, uncertainty, voicecheck)

See `/docs/MAIA_GUARDRAILS_API_SAMPLE.md` for sample responses.

---

## Monitoring Dashboard

The frontend dashboard at `/deploy/monitoring_dashboard.html` fetches this endpoint every 5 minutes and displays:
- Overall status card
- Giving Up warnings card
- Circuit Breaker card
- Voice Check card
- Recent Alerts ticker (always visible, top 5 alerts)

---

## Weekly Operations

**Monday standup routine**:
1. Check `metrics.monitor_payload` for overall_status
2. If any WARN or CRIT statuses, drill into specific monitors:
   ```sql
   select * from metrics.monitor_giving_up;
   select * from metrics.monitor_circuit_breaker;
   select * from metrics.monitor_voicecheck;
   ```
3. Follow response playbooks in `/docs/MAIA_GUARDRAILS_RUNBOOK.md`

---

## Schema Reference

### Core Metrics Tables (your existing schema)
- `public.journal_entries`: User journal entries with MAIA suggestions
- `public.corrections`: User correction events (repair signals)
- `public.beta_feedback`: Qualitative feedback + uncertainty responses
- `public.user_sessions`: Session tracking for re-entry detection

### Metrics Views (created by these scripts)
- `metrics.weekly_scoreboard_v2`: Weekly rollup of all core metrics
- `metrics.uncertainty_baseline`: Weeks 1-2 baseline for uncertainty acceptance
- `metrics.voice_check`: Weekly tag aggregation from beta_feedback
- `metrics.monitor_giving_up`: Giving Up detector (streak logic)
- `metrics.monitor_circuit_breaker`: Circuit breaker detector
- `metrics.monitor_reentry`: Re-entry success tracker
- `metrics.monitor_uncertainty`: Uncertainty acceptance vs baseline
- `metrics.monitor_voicecheck`: Voice check qualitative detector
- `metrics.monitor_overview`: Overall status rollup
- `metrics.monitor_payload`: **Single-query endpoint for API**

### Configuration Tables
- `metrics.thresholds`: Tunable alert thresholds (editable without code changes)
- `metrics.seed_log`: Test harness tracking (for cleanup)

---

## Help & Support

- **API Documentation**: `/docs/MAIA_GUARDRAILS_API_SAMPLE.md`
- **Operational Runbook**: `/docs/MAIA_GUARDRAILS_RUNBOOK.md`
- **Integration Guide**: `/docs/MAIA_GUARDRAILS_INTEGRATION_COMPLETE.md`
- **Philosophical Foundation**: `/docs/MAIA_VOICE_METRICS_GUARDRAILS.md`

---

## North Star

These metrics exist to protect therapeutic presence, not maximize usage.

- Numbers = compass
- Voice Check = conscience
- Guardrails = integrity
