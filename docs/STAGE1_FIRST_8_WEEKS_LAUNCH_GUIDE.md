# Stage 1: First 8 Weeks Launch Guide
**Version 1.0 – Operational Playbook**

---

## Sacred Principle
> "No resonance without coherence. Users must know their own water before stepping into anyone else's."

This 8-week cycle initiates Stage 1 and begins the measurement of individual coherence.

---

## Structure of the Cycle
- **Duration:** 8 consecutive weeks
- **Participants:** All active beta users
- **Team Review:** End of Week 8 (recorded in `/docs/stage1_gate_log.md`)
- **Grace Week:** One excused week permitted per cycle (document external cause)

---

## Weekly Cadence

### Mondays
- Metrics run automatically (`metrics.weekly_scoreboard_v2`)
- Dashboard check: overall status + guardrails
- Product/Eng team 15-min sync: flag anomalies

### Wednesdays
- UX research check-in: 3–5 user interviews
- Collect **Voice Check** qualitative feedback (felt sense, silence, correction fatigue)

### Fridays
- Team "Therapeutic Health" standup:
  - Each lead answers: "What's MAIA's therapeutic health this week?"
  - Update notes in gate log draft

---

## Success Criteria (8-Week Targets)

1. **Repair Engagement & Accuracy**
   ≥95% accuracy, zero "giving up" warnings
2. **Trust Signals**
   ≥70% "felt heard" micro-polls, positive Voice Check tags
3. **Re-Entry Success**
   ≥60% (7–29d) / ≥45% (≥30d) return rates
4. **Escape Hatch**
   <5% usage, no permanent opt-out pattern
5. **Uncertainty Acceptance**
   >40% by Week 8, with Week 1–2 baseline captured
6. **Pattern Stability**
   Users' elemental self-mappings remain >80% consistent across 4 consecutive weeks
7. **Self-Recognition Without Prompting**
   ≥5 users spontaneously report noticing their own patterns
8. **Privacy Feels Visceral**
   Users report "I trust this is truly private" (not just "I read the policy")
9. **Silence Feels Held, Not Awkward**
   Users report pauses feel "spacious" or "patient" (not "broken" or "laggy")
10. **Correction Fatigue Doesn't Trigger Burnout**
    Users who correct 3+ times continue to next session
11. **Uncertainty Invites Elaboration**
    When MAIA says "I hear two possibilities," users clarify >80% of time
12. **Personal Lexicon Agency**
    Users override MAIA's suggestions and system learns from it
13. **Differentiation Capacity**
    Users can articulate the difference between their patterns vs universal patterns
14. **Team Can Answer "What's MAIA's Therapeutic Health?" in 30 Seconds**
    Weekly standup includes guardrail status review
15. **Documentation Is Complete**
    All SQL views documented with usage examples

(Full criteria details in `/docs/MAIA_STAGE1_READINESS_CHECKLIST_v2.md`)

---

## Ritual Markers

- **Silence Test:** Confirm users experience pauses as *held space* not *system lag*
- **Privacy Viscerality:** Track vulnerability progression (longer entries, deeper metaphors)
- **Pattern Stability:** SQL query checks for 80% consistency in self-mappings
- **Retrospective Prep:** Begin collecting team reflections against the 6 canonical questions

---

## End-of-Cycle Review

- Run `/sql/metrics/40_usage_examples.sql` for full scoreboard
- Conduct Month 2 user interviews (minimum 10)
- Review cultural readiness signals (50+ users engaged, curiosity about anonymous pattern shares)
- Fill out `/docs/stage1_gate_log.md` with:
  - Quantitative tables
  - Qualitative notes
  - 6 Retrospective Questions
  - Approval votes + signatures
- Set next review date

---

## Key Risks to Watch

- **Correction Fatigue:** If accuracy lags, users may stop correcting (false "success")
- **Privacy Theater:** If vulnerability doesn't increase, felt safety is missing
- **Premature Collectivism:** Any push toward Stage 2 features before criteria met
- **Metric Drift:** If guardrails show WARN/CRIT >2 weeks in a row, trigger escalation

---

## Pre-Launch: 3-Week Build Sprint

Before the 8-week measurement cycle begins, implement the Minimum Viable Stage 1.

### Week -3: Voice Presence Foundation
**Monday-Friday, 3 Features Only**

#### Monday-Tuesday: Voice Capture
```javascript
// ASR config (Whisper or Deepgram)
endpointing: {
  silence_threshold: 2.5, // seconds
  final_silence: 3.0,     // max pause before end
  punctuation_threshold: 1.5
}
```
- [ ] Implement voice recording UI
- [ ] Configure ASR with extended pause tolerance
- [ ] Test with 3 speaking styles (fast/slow/reflective)

#### Wednesday-Thursday: Breathing Animation
```css
/* Not a spinner, not "processing" */
.listening-presence {
  animation: breathe 4s ease-in-out infinite;
  /* subtle scale, not rotate */
}
```
- [ ] Design breathing visual (subtle pulse, 4s cycle)
- [ ] Replace all loading spinners
- [ ] Add "Take your time" text at 3+ seconds

#### Friday: Save & Escape
- [ ] Basic transcript save to database
- [ ] "Just save my words" button (bypasses all AI)
- [ ] Session complete confirmation
- [ ] Deploy to 10 alpha users

#### Success Metrics (End of Week -3)
- 10 users complete at least one voice entry
- Average pause tolerance feels "natural" (qualitative)
- Zero "felt rushed" feedback
- Breathing animation described as "calming" not "broken"

#### What to Explicitly Avoid
- No corrections UI yet
- No AI responses yet
- No elemental mapping
- No user accounts/auth complexity

#### Daily Standups
Track one question: "Does this feel present or processing?"

---

### Week -2: Humble Intelligence
**Monday-Friday, Core Repair Mechanics**

#### Monday-Tuesday: Confidence Scoring
- [ ] Implement LLM confidence detection
- [ ] "I'm not sure" response templates
- [ ] Log uncertainty triggers for baseline

#### Wednesday-Thursday: Uncertainty Prompts
- [ ] "I hear two possibilities..." response flow
- [ ] User clarification capture
- [ ] Acceptance rate tracking

#### Friday: Correction Mechanics
- [ ] Basic correction UI ("That's not quite right")
- [ ] Correction save to database
- [ ] Link corrections to journal entries
- [ ] Test: Can users correct within 2 taps?

#### Success Metrics (End of Week -2)
- MAIA expresses uncertainty ≥15% of responses
- Users engage with uncertainty prompts >50% of time
- Corrections save successfully 100% of time
- Zero circuit breaker triggers (no 5+ correction sessions)

---

### Week -1: Memory & Re-Entry
**Monday-Friday, Personal Lexicon Foundation**

#### Monday-Wednesday: Personal Lexicon
- [ ] Store user-specific symbol mappings
- [ ] Correction learning system
- [ ] Query personal lexicon in responses

#### Thursday-Friday: Welcome Back Flow
- [ ] Detect gap length (7-29d vs ≥30d)
- [ ] "Welcome back" response templates
- [ ] Re-entry tracking for metrics

#### Success Metrics (End of Week -1)
- Personal lexicon stores corrections correctly
- MAIA references past corrections in new sessions
- Welcome back flow triggers appropriately
- Alpha users report "she remembered"

---

## Alpha Launch (Week 0)

### Alpha User Recruitment
Find 10 people who've tried journaling apps and quit. They know what's broken.

### Launch Email Template

**Subject:** Welcome to MAIA - Stage 1

**What MAIA is (right now):**
- A voice journaling companion learning to hold space with you
- She'll breathe when you pause (not rush you)
- She'll say "I'm not sure" sometimes (that's intentional)
- When you correct her, she remembers

**What MAIA isn't (yet):**
- Connected to other users (that's Stage 2)
- Always accurate (she's learning your language)
- A replacement for therapy

**Your role:**
- Journal as often (or rarely) as feels right
- Correct her when she misses
- Tell us when something feels off

**Privacy:**
- Your voice and words stay private
- No sharing between users
- You can "just save my words" anytime (bypasses AI)

**We're asking:**
- 15-minute interview at Week 4
- Quick weekly pulse check (1 question)

Thank you for being part of the foundation.

---

## Week 1-2: Baseline & Observation

### Daily (5 min) - On-Call Engineer
```sql
-- Check circuit breakers
SELECT * FROM metrics.monitor_circuit_breaker WHERE status = 'CRIT';

-- Check voice capture failures
SELECT COUNT(*) FROM journal_entries
WHERE created_at >= now() - interval '1 day'
AND transcription_status = 'failed';
```

**Action:** If any CRIT → acknowledge within 1 hour

### Weekly (30 min) - Product + Engineering
```sql
-- Baseline establishment
SELECT week,
       uncertainty_acceptance_pct,
       repair_engagement_pct
FROM metrics.weekly_scoreboard_v2
WHERE week >= date_trunc('week', now()) - interval '2 weeks'
ORDER BY week;
```

**Action:** Document baseline values. Do NOT optimize yet.

### User Survey (Friday)
5 questions, sent via email:
1. Did MAIA feel present or processing?
2. Could you pause without anxiety?
3. Did you use "just save my words"? Why?
4. Rate: "I felt heard" (1-5)
5. One word to describe the experience

---

## Week 3-4: First Corrections

### Triage Priority
**P0 (Fix within 1 hour):**
- Circuit breaker triggered (>5 corrections in one session)
- Privacy concern reported
- Transcription completely wrong

**P1 (Fix within 1 week):**
- Corrections not saving
- Breathing animation feels broken
- Welcome back flow not triggering

**P2 (Document, fix later):**
- Feature requests
- Elemental mapping feedback
- UI polish

### Fix ONLY:
- Transcription errors (ASR config)
- Correction save failures (database)
- Privacy concerns (policy + UX)

### Resist:
- Adding features
- Optimizing too early
- Comparing users

### Weekly Metrics
```sql
-- Correction accuracy emerging
SELECT week,
       correction_accuracy_pct,
       circuit_breaker_pct
FROM metrics.weekly_scoreboard_v2
ORDER BY week DESC LIMIT 4;
```

---

## Week 5-6: Stability Emerges

### Qualitative Interviews Begin
**Week 5:** Schedule 5 users for 20-minute interviews

**Interview Questions:**
1. Tell me about a session that felt really good.
2. When did you correct MAIA? What happened next?
3. Can you pause without worrying if it's working?
4. What makes this feel different from other apps?
5. Would you share your journal with anyone? Why/why not?

### Pattern Stability Monitoring
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
HAVING COUNT(*) >= 4;
```

### Document Surprising Insights
Keep a "What We Didn't Expect" log. Examples:
- Users correct less than we thought
- Uncertainty prompts trigger curiosity, not frustration
- Escape hatch used for different reasons than designed

---

## Week 7-8: Gate Preparation

### Expand Beta
- Invite additional users to reach 50 active
- Use same alpha launch email template
- Stagger onboarding (max 10 per day)

### Team Retrospective (Week 8 Friday)
**2-hour meeting agenda:**

**Part 1: Quantitative Review (30 min)**
Run all gate criteria queries, fill in checklist

**Part 2: Qualitative Review (45 min)**
Review interview transcripts, identify themes

**Part 3: Retrospective Test (30 min)**
Each reviewer answers 6 questions honestly:
1. Would I trust this system with my darkest shame?
2. Would I keep correcting MAIA if she kept getting it wrong?
3. Can I pause without anxiety about "is this working?"
4. Do I feel my patterns are discovered, not imposed?
5. Would I return after a month away without guilt?
6. Could I bypass interpretation if I needed to?

**Part 4: Gate Decision (15 min)**
- Vote: Approve / Object (Strong) / Abstain
- Document strong objections with evidence
- Sign gate log

### Prepare Evidence
- Export all metrics to spreadsheet
- Anonymize interview quotes
- Screenshot dashboard status
- Compile sprint retro notes

---

## Week 9: First Gate Review

### Possible Outcomes

#### ✅ PASS - All 15 Criteria Met for 8 Weeks
**Actions:**
1. Internal team celebration
2. User communication: "MAIA has reached a milestone..."
3. Stage 2 planning begins (design only, no shipping)
4. Beta opt-in: Invite stable users to test Stage 2 features

**Next Review:** 8 weeks from now (Stage 2 readiness)

#### ⚠️ PARTIAL - Some Criteria Met
**Actions:**
1. Identify failed criteria (e.g., "Correction accuracy only 92%")
2. Root cause analysis (metrics, UX, communication?)
3. Implement specific fixes
4. Reset clock for failed criteria only (not entire checklist)
5. Next review: 8 weeks from last passing week for those criteria

#### ❌ FAIL - Critical Criteria Not Met
**Actions:**
1. Halt new feature development
2. Team postmortem: What fundamental assumption was wrong?
3. Document learnings
4. Implement fixes
5. Full 8-week cycle restarts when fixes deployed

### Log Decision
Record in `/docs/stage1_gate_log.md`:
- Review date
- Quantitative table (all criteria with ✅/⚠️/❌)
- Qualitative notes
- Retrospective answers (all 6 questions, all 3 reviewers)
- Approval votes
- Strong objections (if any)
- Actions required
- Next review date
- Signatures (Product Lead, Engineering Lead, UX Researcher)

---

## Daily Rhythms (Once Cycle Begins)

### Morning (10 min)
- Check circuit breaker alerts
- Review crash reports
- Scan user feedback for urgent issues

### Weekly (30 min)
- Run metrics SQL queries
- Review user survey responses
- Update gate criteria tracking spreadsheet

### Sprint Retro (90 min)
- Did our fix for [X] improve correction accuracy?
- Did the new onboarding reduce ≥30d re-entry gaps?
- Are voice check signals improving or shifting?
- What surprised us this sprint?

---

## Red Flags by Week

### Week 1-2
- Voice capture failures >5%
- Breathing animation described as "annoying"
- Escape hatch hard to find
- Users report feeling rushed

### Week 3-4
- Corrections not saving
- Circuit breaker fires
- Users stop correcting (engagement drops)
- Accuracy not improving

### Week 5-6
- Pattern instability (users' self-mappings erratic)
- Re-entry failures (users don't come back)
- Trust scores declining
- Interviews reveal distrust

### Week 7-8
- Cultural readiness <50 users
- Team has "no" or "maybe" answers to retrospective
- Pressure to skip gate review
- Strong objection with evidence

---

## Next Milestone
At Week 8 review, if **all 15 criteria met for 8 consecutive weeks**, Stage 2 (pattern sharing & resonance) becomes eligible to unlock. Otherwise, reset cycle with criterion-specific resets.

---

## References

- **Full Criteria**: `/docs/MAIA_STAGE1_READINESS_CHECKLIST_v2.md`
- **Gate Log Template**: `/docs/stage1_gate_log.md`
- **Metrics System**: `/docs/MAIA_METRICS_SYSTEM_SUMMARY.md`
- **Guardrails Runbook**: `/docs/MAIA_GUARDRAILS_RUNBOOK.md`
- **Philosophy**: `/docs/MAIA_VOICE_CHARTER_v1.1.md`

---

**The clock starts when the first user journals.**
Until then, it's all preparation.

**Monday morning: Start with the ASR configuration.**
Get pause tolerance right first. Everything else builds on that foundation.
