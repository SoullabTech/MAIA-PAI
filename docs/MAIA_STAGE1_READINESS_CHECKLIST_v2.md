# MAIA Stage 1 Readiness Checklist v2.0
## Canonical Gate Document: Individual Elemental Coherence

**Version**: 2.0
**Last Updated**: 2025-10-01
**Status**: CANONICAL - Do not modify without unanimous team approval
**Next Review**: [8 weeks after Stage 1 launch]

---

## Sacred Principle

> **Users must know their own water before stepping into anyone else's.**
>
> Self-reflection must be a **felt coherence**, not just data on a dashboard.
>
> This gate exists to prevent the system from becoming a community amplifier of distortion.

---

## What This Gate Protects Against

❌ **Premature Collectivism**: Emotional contagion disguised as resonance
❌ **Imposed Patterns**: System tells users what they feel instead of reflecting
❌ **Repair Fatigue**: Users give up teaching MAIA because corrections don't stick
❌ **Privacy Theater**: Policy documents without visceral felt safety
❌ **Awkward Silence**: System lag masquerading as therapeutic pause
❌ **Dogmatic Symbols**: Fixed taxonomy instead of co-created meaning
❌ **Projection Risk**: Unstable users seeing their instability in others
❌ **Permanent Individualism**: Over-optimization preventing interpersonal readiness

---

## The 13 Criteria

All criteria must be met for **8 consecutive weeks** before Stage 2 consideration.

### Quantitative Criteria (Weekly Monitoring)

#### 1. Repair Engagement & Accuracy
- [ ] Correction accuracy ≥95% (users who correct once see improvement)
- [ ] "Giving up" warnings: 0 occurrences in last 4 weeks
- [ ] Circuit breaker: <0.1% of sessions (catastrophic UX near-zero)
- [ ] Repair engagement trend: corrections declining as accuracy rises

**Evidence Required**:
```sql
-- Weekly correction accuracy
SELECT week, correction_accuracy_pct
FROM metrics.weekly_scoreboard_v2
ORDER BY week DESC LIMIT 8;

-- Giving up status
SELECT * FROM metrics.monitor_giving_up
WHERE status IN ('WARN', 'CRIT');

-- Circuit breaker status
SELECT circuit_breaker_pct FROM metrics.monitor_circuit_breaker;
```

**Notes Field**: ____________________

---

#### 2. Trust Signals
- [ ] "Felt heard" score: ≥70% average across all sessions
- [ ] Voice Check: Top tags include "safe", "listened", "patient"
- [ ] Negative feedback signals: <25% of total tags
- [ ] Uncertainty acceptance: ≥40% above baseline

**Evidence Required**:
```sql
-- Average trust
SELECT AVG(felt_heard_score) as avg_trust
FROM beta_feedback
WHERE created_at >= now() - interval '8 weeks';

-- Voice check top tags
SELECT week, tag, tag_count
FROM metrics.voice_check
WHERE week >= date_trunc('week', now()) - interval '8 weeks'
ORDER BY week DESC, tag_count DESC;
```

**Notes Field**: ____________________

---

#### 3. Re-entry Success
- [ ] 7-29 day gaps: ≥60% return rate
- [ ] ≥30 day gaps: ≥45% return rate
- [ ] Re-entry sessions: No spike in corrections
- [ ] Users don't report shame/guilt about absence

**Evidence Required**:
```sql
SELECT * FROM metrics.monitor_reentry;
```

**Notes Field**: ____________________

---

#### 4. Escape Hatch Usage
- [ ] "Save without suggestions" used <5% of sessions
- [ ] When used, users return next session (not permanent opt-out)
- [ ] No correlation between escape hatch use and account deletion

**Evidence Required**:
```sql
SELECT
  COUNT(*) FILTER (WHERE was_saved_raw = true) as raw_saves,
  ROUND(100.0 * COUNT(*) FILTER (WHERE was_saved_raw = true) / COUNT(*), 2) as pct
FROM journal_entries
WHERE created_at >= now() - interval '8 weeks';
```

**Notes Field**: ____________________

---

#### 5. Pattern Stability
- [ ] Users' elemental self-mappings remain >80% consistent across 4 consecutive weeks
- [ ] Dominant patterns don't shift erratically week-to-week

**Evidence Required**:
```sql
-- Track elemental consistency
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
  AND (COUNT(DISTINCT element_final)::float / COUNT(*)) <= 0.2;
```

**Notes Field**: ____________________

---

#### 6. Cultural Readiness
- [ ] Minimum 50 users meeting all other criteria (critical mass for Stage 2)
- [ ] **Edge case contingency** (if stuck at 40-49 for >12 weeks):
  - Option A: Lower to 30 users with "small beta" framing (unanimous approval)
  - Option B: Waitlist feature until threshold reached
  - Option C: Stage 2 delayed until organic growth reaches 50

**Evidence Required**:
```sql
SELECT COUNT(DISTINCT user_id) as ready_users
FROM users_meeting_all_criteria;
```

**Notes Field**: ____________________

---

### Qualitative Criteria (Month 3 & 6 Interviews)

#### 7. Self-Recognition Without Prompting
- [ ] ≥5 users spontaneously report noticing their own patterns
- [ ] Examples: "I realized I use water imagery when uncertain" (not "MAIA told me...")
- [ ] Users describe patterns in their own language, not MAIA's
- [ ] Users can articulate **when** patterns shift

**Evidence Required**: Link to interview transcripts, anonymized quotes

**Interview Count**: ____
**Key Quotes**:
1. ____________________
2. ____________________
3. ____________________

---

#### 8. Privacy Feels Visceral
- [ ] Users report "I trust this is truly private" (not just "I read the policy")
- [ ] Users write about topics they wouldn't share elsewhere
- [ ] **Behavioral marker**: Journal entry depth increases after Week 4
- [ ] **Progression marker**: Users share progressively vulnerable content

**Evidence Required**:
```sql
-- Entry depth progression
WITH weekly_depth AS (
  SELECT user_id,
         date_trunc('week', created_at) as week,
         AVG(length(response)) as avg_words
  FROM journal_entries
  GROUP BY user_id, week
)
SELECT user_id, week, avg_words,
       avg_words - LAG(avg_words) OVER (PARTITION BY user_id ORDER BY week) as depth_change
FROM weekly_depth
ORDER BY user_id, week;
```

**Interview Count**: ____
**Key Quotes**:
1. ____________________
2. ____________________

---

#### 9. Silence Feels Held, Not Awkward
- [ ] Users report pauses feel "spacious" or "patient" (not "broken" or "laggy")
- [ ] Breathing animation described as "calming" or "reassuring"
- [ ] No reports of anxiety about "is this working?"
- [ ] Users naturally take longer pauses without system anxiety

**Interview Count**: ____
**Key Quotes**:
1. ____________________
2. ____________________

---

#### 10. Correction Fatigue Doesn't Trigger Burnout
- [ ] Users who correct 3+ times continue to next session
- [ ] After correction-heavy sessions, users report MAIA "backed off gracefully"
- [ ] No users report feeling "exhausted by teaching MAIA"

**Interview Count**: ____
**Key Quotes**:
1. ____________________
2. ____________________

---

#### 11. Uncertainty Invites Elaboration
- [ ] When MAIA says "I hear two possibilities," users clarify >80% of time
- [ ] Users describe uncertainty prompts as "helpful" or "inviting"
- [ ] No spike in session abandonment after uncertainty prompts

**Evidence Required**:
```sql
SELECT uncertainty_acceptance_pct
FROM metrics.weekly_scoreboard_v2
ORDER BY week DESC LIMIT 8;
```

**Interview Count**: ____
**Key Quotes**:
1. ____________________

---

#### 12. Personal Lexicon Agency
- [ ] Users override MAIA's suggestions and system learns from it
- [ ] Users report feeling "my symbols are mine" (not "MAIA's categories")
- [ ] No users complain about rigid elemental taxonomy

**Interview Count**: ____
**Key Quotes**:
1. ____________________

---

#### 13. Differentiation Capacity
- [ ] Users can articulate the difference between:
  - Their patterns vs universal patterns
  - Current state vs recurring cycle
  - Personal meaning vs imposed meaning
- [ ] Users demonstrate ability to hold paradox

**Interview Count**: ____
**Differentiation Examples**:
1. ____________________
2. ____________________

---

### Operational Criteria

#### 14. Team Can Answer "What's MAIA's Therapeutic Health?" in 30 Seconds
- [ ] Weekly standup includes guardrail status review
- [ ] Team references metrics in sprint planning
- [ ] PRs mention potential metric impacts
- [ ] Circuit breaker alerts trigger immediate response (<1 hour)

**Evidence**: Link to sprint retro notes, standup recordings, Slack/Discord logs

**Notes Field**: ____________________

---

#### 15. Documentation Is Complete
- [ ] All SQL views documented with usage examples
- [ ] API endpoints have sample responses
- [ ] Runbook covers all 5 guardrails with SLAs
- [ ] New team members can understand metrics in <1 hour

**Evidence**: Onboarding session recordings, new engineer feedback

**Notes Field**: ____________________

---

## Grace Week Allowance

**One "grace week" permitted per 8-week period** if metrics dip due to clear external cause.

**Grace weeks must document**:
- Exact dates affected
- Clear external cause (holidays, major news, platform outage)
- Evidence of external cause
- Mitigation plan (if applicable)

**Grace Week Log**:

| Week of | Criterion Affected | External Cause | Evidence | Documented By |
|---------|-------------------|----------------|----------|---------------|
| | | | | |

---

## Soft Preparation (Preventing Permanent Individualism)

During Stage 1, these signals must be present:

- [ ] Anonymous pattern examples in MAIA responses ("Others have found...")
- [ ] Community content introduces "spiral recognition" philosophically
- [ ] Beta feedback asks: "Would you want to connect with others experiencing similar patterns?"
- [ ] Positive responses tracked: ≥60% express curiosity about others' experiences

**Evidence**: Feedback survey results, engagement metrics on community posts

**Notes Field**: ____________________

---

## The Retrospective Test (Truth-Detector)

> These six questions cut through metrics and interviews to lived truth.
>
> Each reviewer must answer **honestly** with reasoning.
>
> If any "no" or "maybe" with weak reasoning → Stage 1 isn't ready.

### Question 1: Would I trust this system with my darkest shame?

**Product Lead**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

**Engineering Lead**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

**UX Researcher**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

---

### Question 2: Would I keep correcting MAIA if she kept getting it wrong?

**Product Lead**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

**Engineering Lead**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

**UX Researcher**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

---

### Question 3: Can I pause without anxiety about "is this working?"

**Product Lead**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

**Engineering Lead**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

**UX Researcher**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

---

### Question 4: Do I feel my patterns are discovered, not imposed?

**Product Lead**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

**Engineering Lead**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

**UX Researcher**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

---

### Question 5: Would I return after a month away without guilt?

**Product Lead**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

**Engineering Lead**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

**UX Researcher**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

---

### Question 6: Could I bypass interpretation if I needed to?

**Product Lead**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

**Engineering Lead**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

**UX Researcher**: ☐ Yes ☐ No ☐ Maybe
Reasoning: ____________________

---

## Gate Decision

**Review Cycle**: [Start Date] - [End Date]
**Review Date**: YYYY-MM-DD

### Overall Status

☐ ✅ **PASS** - All 15 criteria met for 8 consecutive weeks
☐ ⚠️ **PARTIAL** - Some criteria met, others in progress
☐ ❌ **FAIL** - Critical criteria not met

### Approval Votes

**Threshold**: 2 of 3 must approve, with no strong objections

**Product Lead**: ☐ Approve ☐ Object (Strong) ☐ Abstain
**Engineering Lead**: ☐ Approve ☐ Object (Strong) ☐ Abstain
**UX Researcher**: ☐ Approve ☐ Object (Strong) ☐ Abstain

**Threshold Met?** ☐ Yes ☐ No

---

### Strong Objections (if any)

A strong objection must:
- Cite specific criterion failure (not vague concern)
- Provide evidence (metrics, user quotes, incidents)
- Articulate risk to users if Stage 2 proceeds
- Offer specific remediation plan

**Objections**:
1. ____________________
2. ____________________

---

### Actions Required

If gate does not pass:

**Specific fixes needed**:
1. ____________________
2. ____________________

**Timeline for re-review**: YYYY-MM-DD (______ weeks)

**Criterion clocks reset** (only failed criteria):
- ____________________
- ____________________

**Learnings documented in**: ____________________

---

### Next Steps

If gate passes:

☐ Internal announcement: Team celebration
☐ User communication: "MAIA has reached a milestone..."
☐ Stage 2 planning: Begin design of optional interpersonal features
☐ Beta opt-in: Invite stable users to test Stage 2 (not automatic)

---

## Signatures

By signing, we affirm:
- We have reviewed all evidence
- We have answered the retrospective questions honestly
- We believe this gate decision protects user safety and therapeutic integrity
- We commit to the actions required (if gate does not pass)

**Product Lead**:
Name: ____________________
Signature: ____________________
Date: ____________________

**Engineering Lead**:
Name: ____________________
Signature: ____________________
Date: ____________________

**UX Researcher**:
Name: ____________________
Signature: ____________________
Date: ____________________

---

## What Stage 2 Unlocks (After This Gate)

**Only when Stage 1 is rock-solid**:

✅ Optional "pattern shares" (specific insights, not full journals)
✅ "Resonance signals" (flags similar patterns, doesn't show content)
✅ "Pattern siblings" (matched 1-to-1 based on complementary spirals)

**Never before Stage 1 is solid**:

❌ Group chat or forums
❌ Leaderboards or comparative metrics
❌ User profiles visible to others
❌ Algorithmic matching beyond 1-to-1

**Design Principle**: Interpersonal features emerge **from** individual coherence, not **instead of** it. Solo journaling remains primary; connections are optional enhancements.

---

## Document History

| Version | Date | Changes | Approved By |
|---------|------|---------|-------------|
| 1.0 | 2025-10-01 | Initial gate document | Draft |
| 2.0 | 2025-10-01 | Canonical version with ritual formatting | Pending first review |

---

## References

- **Philosophy**: `/docs/MAIA_VOICE_CHARTER_v1.1.md`
- **Metrics System**: `/docs/MAIA_GUARDRAILS_INTEGRATION_COMPLETE.md`
- **Operational Runbook**: `/docs/MAIA_GUARDRAILS_RUNBOOK.md`
- **Gate Log** (for recording each cycle): `/docs/stage1_gate_log.md`
- **SQL Monitoring**: `/sql/metrics/50_guardrail_monitors.sql`

---

## Sacred Commitment

> This gate exists to ensure that **users must know their own water before stepping into anyone else's**.
>
> We refuse to scale until integrity is proven at the individual level.
>
> This is how we avoid both Silicon Valley "blitzscale" and spiritual bypassing.
>
> Numbers = compass. Voice Check = conscience. Guardrails = integrity.

**This document is not just a checklist. It is a ritualized rite of passage for both users and team.**
