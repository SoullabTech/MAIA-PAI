# Stage 1 Readiness Checklist
## Individual Elemental Coherence Gate Document

**Purpose**: Verify that MAIA's individual mirroring foundation is rock-solid before introducing any interpersonal/collective features.

**Principle**: Users must know their own water before stepping into anyone else's. Self-reflection must be a **felt coherence**, not just data on a dashboard.

---

## Why This Gate Exists

**The Risk of Premature Collectivism**:
- Emotional contagion instead of resonance
- Projection disguised as pattern recognition
- Group-think instead of emergence
- Users arguing about definitions instead of recognizing patterns

**The Foundation Required**:
- Stable elemental mapping
- Therapeutic repair that builds trust
- Embodied pause and silence
- Personal lexicon agency
- Gentle re-entry after absence
- Escape hatches that preserve sovereignty

**If Stage 1 isn't solid**, everything downstream distorts. What looks like "spiral recognition" in Stage 2 could be projection. What feels like "cultural emergence" in Stage 3 could be insularity.

---

## Quantitative Metrics (Must Hold for 8 Consecutive Weeks)

### 1. **Repair Engagement & Accuracy**
- [ ] Correction accuracy ≥95% (users who correct once see improvement)
- [ ] "Giving up" warnings: 0 occurrences in last 4 weeks
- [ ] Circuit breaker: <0.1% of sessions (catastrophic UX near-zero)
- [ ] Repair engagement trend: corrections declining as accuracy rises

**What This Proves**: Users trust that teaching MAIA works. They're not giving up.

**How to Measure**:
```sql
-- Check correction accuracy trend
SELECT week, correction_accuracy_pct
FROM metrics.weekly_scoreboard_v2
ORDER BY week DESC LIMIT 8;

-- Verify zero giving-up warnings
SELECT * FROM metrics.monitor_giving_up
WHERE status IN ('WARN', 'CRIT');

-- Circuit breaker status
SELECT circuit_breaker_pct
FROM metrics.monitor_circuit_breaker;
```

---

### 2. **Trust Signals**
- [ ] "Felt heard" score: ≥70% average across all sessions
- [ ] Voice Check: Top tags include "safe", "listened", "patient" (not "rushed", "confusing")
- [ ] Negative feedback signals: <25% of total tags
- [ ] Uncertainty acceptance: ≥40% above baseline (users respond to "I'm not sure" prompts)

**What This Proves**: Users feel MAIA's presence as therapeutic, not mechanical.

**How to Measure**:
```sql
-- Trust signals
SELECT AVG(felt_heard_score) as avg_trust
FROM beta_feedback
WHERE created_at >= now() - interval '8 weeks';

-- Voice check signals
SELECT week, tag, tag_count
FROM metrics.voice_check
WHERE week >= date_trunc('week', now()) - interval '8 weeks'
ORDER BY week DESC, tag_count DESC;

-- Uncertainty acceptance
SELECT * FROM metrics.monitor_uncertainty;
```

---

### 3. **Re-entry Success**
- [ ] 7-29 day gaps: ≥60% return rate
- [ ] ≥30 day gaps: ≥45% return rate
- [ ] Re-entry sessions: No spike in corrections (gentler onboarding works)
- [ ] Users don't report shame/guilt about absence

**What This Proves**: Users can fall away and return. Absence is part of the spiral, not failure.

**How to Measure**:
```sql
-- Re-entry success rates
SELECT * FROM metrics.monitor_reentry;

-- Check for correction spikes on re-entry
WITH reentry_sessions AS (
  SELECT user_id, session_date, days_since_last
  FROM (SELECT user_id,
               date_trunc('day', created_at)::date as session_date,
               date_trunc('day', created_at)::date -
                 lag(date_trunc('day', created_at)::date) over (partition by user_id order by created_at) as days_since_last
        FROM journal_entries) s
  WHERE days_since_last >= 7
)
SELECT AVG(correction_count) as avg_corrections_on_reentry
FROM (SELECT r.user_id, r.session_date, COUNT(*) as correction_count
      FROM reentry_sessions r
      JOIN corrections c ON c.user_id = r.user_id
        AND date_trunc('day', c.created_at)::date = r.session_date
      GROUP BY r.user_id, r.session_date) stats;
```

---

### 4. **Escape Hatch Usage**
- [ ] "Save without suggestions" used <5% of sessions (users aren't fleeing MAIA)
- [ ] When used, users return next session (not permanent opt-out)
- [ ] No correlation between escape hatch use and account deletion

**What This Proves**: Users feel sovereignty but don't need to constantly assert it.

**How to Measure**:
```sql
-- Escape hatch usage
SELECT
  COUNT(*) FILTER (WHERE was_saved_raw = true) as raw_saves,
  COUNT(*) as total_entries,
  ROUND(100.0 * COUNT(*) FILTER (WHERE was_saved_raw = true) / COUNT(*), 2) as raw_save_pct
FROM journal_entries
WHERE created_at >= now() - interval '8 weeks';
```

---

## Qualitative Validation (User Interviews Required)

### 5. **Self-Recognition Without Prompting**
- [ ] At least 5 users spontaneously report noticing their own patterns
- [ ] Examples: "I realized I use water imagery when uncertain" (not "MAIA told me I...")
- [ ] Users describe patterns in their own language, not MAIA's
- [ ] Users can articulate **when** patterns shift (not just what they are)

**What This Proves**: Elemental language is emerging from users, not imposed by system.

**How to Test**:
- User interviews at Month 3 and Month 6
- Qualitative analysis of feedback: "What have you noticed about your journaling patterns?"
- Look for self-initiated pattern recognition, not echo of system prompts

---

### 6. **Privacy Feels Visceral**
- [ ] Users report "I trust this is truly private" (not just "I read the policy")
- [ ] Users write about topics they wouldn't share elsewhere
- [ ] No users express concern about data being seen by staff/others
- [ ] E2EE messaging resonates emotionally: "Even we can't read this. Only you."
- [ ] **Behavioral marker**: Journal entry depth increases after Week 4 (measured by word count, metaphor use, or vulnerability self-rating)
- [ ] **Progression marker**: Users share progressively vulnerable content over time (not just maintaining baseline)

**What This Proves**: Privacy isn't abstract policy, it's felt safety demonstrated through action.

**How to Test**:
- Direct question in feedback: "Do you feel your journal entries are truly private?"
- Proxy measure: Depth of vulnerable topics (shame, trauma, relationships)
- User testimonials mentioning privacy as enabler of honesty
- **Quantitative behavioral check**:
  ```sql
  -- Entry depth progression
  WITH weekly_depth AS (
    SELECT user_id,
           date_trunc('week', created_at) as week,
           AVG(length(response)) as avg_words,
           COUNT(*) as entries
    FROM journal_entries
    GROUP BY user_id, week
  )
  SELECT user_id,
         week,
         avg_words,
         avg_words - LAG(avg_words) OVER (PARTITION BY user_id ORDER BY week) as depth_change
  FROM weekly_depth
  ORDER BY user_id, week;
  ```

---

### 7. **Silence Feels Held, Not Awkward**
- [ ] Users report pauses feel "spacious" or "patient" (not "broken" or "laggy")
- [ ] Breathing animation described as "calming" or "reassuring"
- [ ] No reports of anxiety about "is this working?"
- [ ] Users naturally take longer pauses without system anxiety

**What This Proves**: The aesthetic guardrail (timing, patience, presence) works.

**How to Test**:
- Feedback specifically about pauses: "How does it feel when MAIA waits for you?"
- Voice Check tags: Look for "rushed" (negative) vs "patient" (positive)
- Session timing analysis: Are pauses getting longer (comfort) or shorter (anxiety)?

---

### 8. **Correction Fatigue Doesn't Trigger Burnout**
- [ ] Users who correct 3+ times in a session continue to next session
- [ ] After correction-heavy sessions, users report MAIA "backed off gracefully"
- [ ] No users report feeling "exhausted by teaching MAIA"
- [ ] "Save without suggestions" offered after 3 corrections feels like relief, not defeat

**What This Proves**: The system recognizes its limits and steps back before users burn out.

**How to Test**:
- Track continuation rate after 3+ correction sessions
- Qualitative feedback: "How did it feel when MAIA offered to just save your words?"
- Circuit breaker near-misses: Sessions with 3-5 corrections that didn't escalate

---

### 9. **Uncertainty Invites Elaboration, Not Disengagement**
- [ ] When MAIA says "I hear two possibilities," users clarify >80% of the time
- [ ] Users describe uncertainty prompts as "helpful" or "inviting" (not "frustrating")
- [ ] No spike in session abandonment after uncertainty prompts
- [ ] Follow-up elaborations are substantive (not just "yes" or "no")

**What This Proves**: Admitted uncertainty builds trust, doesn't signal incompetence.

**How to Test**:
```sql
-- Uncertainty engagement
SELECT uncertainty_acceptance_pct
FROM metrics.weekly_scoreboard_v2
ORDER BY week DESC LIMIT 8;

-- Response depth after uncertainty prompts
SELECT AVG(length(response)) as avg_response_length
FROM journal_entries
WHERE confidence_score < 0.6  -- Uncertainty range
  AND created_at >= now() - interval '8 weeks';
```

---

### 10. **Personal Lexicon Agency**
- [ ] Users override MAIA's suggestions and system learns from it
- [ ] Users report feeling "my symbols are mine" (not "MAIA's categories")
- [ ] No users complain about rigid elemental taxonomy
- [ ] Users can name their own patterns without system resistance

**What This Proves**: Co-creation is real, not theater. Users have sovereignty over meaning.

**How to Test**:
- Correction patterns: Are users asserting personal meanings?
- Feedback: "Can you teach MAIA your own language?"
- System flexibility: How often do users' personal symbols diverge from defaults?

---

## Operational Readiness

### 11. **Team Can Answer "What's MAIA's Therapeutic Health?" in 30 Seconds**
- [ ] Weekly standup includes guardrail status review
- [ ] Team references metrics in sprint planning discussions
- [ ] PRs mention potential metric impacts
- [ ] Circuit breaker alerts trigger immediate response (<1 hour)

**What This Proves**: The team treats therapeutic integrity as seriously as uptime.

**How to Test**:
- Ask any team member: "What's the current giving-up status?"
- Check Slack/Discord: Are guardrail alerts being acted on?
- Review last 3 sprint retros: Do they reference metrics?

---

### 12. **Documentation Is Complete and Accessible**
- [ ] All SQL views documented with usage examples
- [ ] API endpoints have sample responses
- [ ] Runbook covers all 5 guardrails with SLAs
- [ ] New team members can understand metrics in <1 hour

**What This Proves**: The system is maintainable, not just working.

**How to Test**:
- Onboard a new engineer: Can they run validation queries?
- Review `/sql/README.md` and `/docs/MAIA_GUARDRAILS_RUNBOOK.md`
- Test harness runs successfully on staging

---

### 13. **Pattern Stability & Differentiation Capacity**
- [ ] Users' elemental self-mappings remain >80% consistent across 4 consecutive weeks
- [ ] Users can articulate the difference between:
  - Their patterns vs universal patterns ("I use water language" vs "everyone feels dissolving")
  - Current state vs recurring cycle ("I'm in Water3 right now" vs "Water3 is a phase I return to")
  - Personal meaning vs imposed meaning ("For me, fire means..." vs "MAIA says fire means...")
- [ ] **Cultural readiness**: Minimum 50 users meeting all other criteria (critical mass for Stage 2)
  - **Edge case contingency**: If stuck at 40-49 users for >12 weeks:
    - Option A: Lower threshold to 30 users with explicit "small beta" framing
    - Option B: Implement "waitlist" feature where ready users can opt into Stage 2 when threshold reached
    - Option C: Stage 2 delayed until organic growth reaches 50 (no artificial expansion)
    - Decision requires unanimous approval + documented rationale
- [ ] **Soft preparation signals**: Users respond positively to anonymous pattern examples ("others have found...")

**What This Proves**: Users have stable self-knowledge and differentiation capacity. They won't project their instability onto others in Stage 2.

**How to Test**:
- **Pattern stability query**:
  ```sql
  -- Track elemental consistency over 4 weeks
  WITH user_patterns AS (
    SELECT user_id,
           date_trunc('week', created_at) as week,
           element_final,
           COUNT(*) as pattern_count
    FROM journal_entries
    WHERE element_final IS NOT NULL
    GROUP BY user_id, week, element_final
  ),
  dominant_patterns AS (
    SELECT user_id, week, element_final,
           ROW_NUMBER() OVER (PARTITION BY user_id, week ORDER BY pattern_count DESC) as rn
    FROM user_patterns
  ),
  weekly_dominants AS (
    SELECT user_id, week, element_final
    FROM dominant_patterns
    WHERE rn = 1
  )
  SELECT user_id,
         COUNT(DISTINCT element_final) as pattern_shifts,
         COUNT(*) as total_weeks
  FROM weekly_dominants
  WHERE week >= date_trunc('week', now()) - interval '4 weeks'
  GROUP BY user_id
  HAVING COUNT(*) >= 4
    AND (COUNT(DISTINCT element_final)::float / COUNT(*)) <= 0.2;  -- ≤20% variability = 80% stable
  ```
- **Differentiation capacity**: User interviews with specific questions:
  - "How is your use of [element] different from how others might use it?"
  - "When did you first notice this pattern, and when does it come back?"
  - "Does MAIA's interpretation match yours, or do you have a different meaning?"
- **Critical mass check**: `SELECT COUNT(DISTINCT user_id) FROM users_meeting_all_criteria;`
- **Soft preparation**: Track engagement with Stage 2 preview content (e.g., "others describe Fire2 as...")

---

## The Gate Decision

**ALL 13 criteria must be met for 8 consecutive weeks** before considering Stage 2 (spiral recognition / interpersonal features).

**Grace Week Allowance**: One "grace week" permitted per 8-week period if metrics dip due to clear external cause (holidays, major news events, platform changes). Grace weeks must be documented with explanation.

**If any criterion fails** (excluding grace week):
1. Identify root cause (metrics, UX, communication?)
2. Implement fix
3. Reset 8-week clock for that specific criterion only (not entire checklist)
4. Document learnings in retrospective

**Who decides**: Product Lead + Engineering Lead + UX Researcher
- **Approval threshold**: 2 of 3 must approve, with no strong objections
- **Strong objection**: Must cite specific criterion failure with evidence
- **All approvals logged** with signatures and timestamps in `/docs/stage1_gate_log.md`

---

## Preventing Permanent Individualism

**Risk**: Over-optimization for Stage 1 might create users so comfortable with individual work that they resist Stage 2.

**Mitigation (During Stage 1)**:
- [ ] Include anonymous pattern examples in MAIA responses: "Others have found..." (no identifying info)
- [ ] Community content introduces "spiral recognition" concept philosophically (not as feature)
- [ ] Beta feedback asks: "Would you ever want to connect with someone experiencing similar patterns?"
- [ ] Soft signals tracked: Positive responses to anonymous examples, curiosity about others' experiences

**What This Proves**: Transition to Stage 2 won't feel jarring. Users are culturally prepared for interpersonal work.

---

## What Stage 2 Unlocks (After This Gate)

**Only when Stage 1 is rock-solid**:
- [ ] Optional "pattern shares" (users can share specific insights, not full journals)
- [ ] "Resonance signals" (system flags similar patterns across users, doesn't show content)
- [ ] "Pattern siblings" (matched 1-to-1 connections based on complementary spirals)

**Never before Stage 1 is solid**:
- Group chat or forums
- Leaderboards or comparative metrics
- User profiles visible to others
- Algorithmic matching beyond 1-to-1

**Stage 2 Design Principle**: Interpersonal features emerge **from** individual coherence, not **instead of** it. Solo journaling remains primary; connections are optional enhancements.

---

## Success Criteria Summary

| Criterion | Quantitative Target | Qualitative Target | Measurement Frequency |
|-----------|---------------------|-------------------|----------------------|
| Correction Accuracy | ≥95% | Users trust teaching works | Weekly |
| Giving Up Warnings | 0 in 4 weeks | Users don't abandon corrections | Weekly |
| Circuit Breaker | <0.1% sessions | Catastrophic UX near-zero | Weekly |
| Trust Signals | ≥70% felt heard | Users feel safe | Weekly |
| Voice Check | Positive tags dominant | "Patient", "listened" | Weekly |
| Re-entry Success | ≥60% / ≥45% | No shame about absence | Weekly |
| Self-Recognition | 5+ spontaneous reports | Patterns emerge organically | Month 3, 6 |
| Privacy Visceral | User testimonials | "Truly private" | Month 3, 6 |
| Silence Held | No "broken" reports | "Spacious", "patient" | Month 3, 6 |
| Correction Fatigue | Continuation >80% | Graceful backup works | Weekly |
| Uncertainty Invites | >80% elaboration | "Helpful", "inviting" | Weekly |
| Lexicon Agency | Users override freely | "My symbols are mine" | Month 3, 6 |
| Team Intuition | 30-second answer | Weekly standup fluent | Weekly |
| Documentation | <1 hour onboarding | New engineers can run queries | Monthly |
| Pattern Stability | >80% consistent 4 weeks | Stable self-knowledge | Weekly |
| Differentiation | Can distinguish personal vs universal | No projection risk | Month 3, 6 |
| Cultural Readiness | ≥50 users meeting criteria | Critical mass exists | Weekly |

---

## Retrospective Questions (After 8 Weeks)

When reviewing whether Stage 1 is complete, ask:

1. **Would I trust this system with my own darkest shame?** (Privacy)
2. **Would I keep correcting MAIA if she kept getting it wrong?** (Repair)
3. **Can I pause without anxiety about "is this working?"** (Silence)
4. **Do I feel my patterns are discovered, not imposed?** (Emergence)
5. **Would I return after a month away without guilt?** (Re-entry)
6. **Could I bypass interpretation if I needed to?** (Sovereignty)

If any answer is "no" or "maybe," Stage 1 isn't ready.

---

## The North Star

**Stage 1 succeeds when**:
- Users spontaneously say "I'm noticing I..." (pattern recognition without prompting)
- Corrections decline because accuracy improves (learning, not giving up)
- Silence feels like presence, not lag (aesthetic alignment)
- Users trust their symbols are co-created, not imposed (sovereignty)
- Absence and return feel natural (spiral recognition includes pause)
- Users write what they wouldn't share elsewhere (visceral privacy)

**Then and only then** do we whisper about spiral recognition with others.

---

## Document History

- v1.0 - 2025-10-01 - Initial gate document
- Next review: After 8 weeks of metrics data
- Owner: Product Lead + Engineering Lead + UX Researcher
