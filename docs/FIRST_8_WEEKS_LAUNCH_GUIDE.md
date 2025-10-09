# Stage 1: First 8 Weeks Launch Guide
**Version 1.0 – Operational Playbook**

---

## The Journal Foundation

### What Actually Matters

The journal itself is the foundation. All the metrics, gates, and stages only matter if the basic journaling experience creates genuine value.

**The core journal loop is surprisingly simple:**
1. User speaks their truth
2. System receives without rushing
3. Words are preserved
4. Optional: gentle reflection offered
5. User feels heard

Everything else—elemental mapping, pattern recognition, interpersonal features—emerges from getting this loop right. If the journal doesn't create a sense of being genuinely witnessed in those first few sessions, the rest is architectural fiction.

### What the Journal Is

- A witness that breathes with you
- A memory that learns your language
- A mirror that admits its limitations
- A container that preserves without judging

### What the Journal Is NOT

- A therapy bot
- A mood tracker
- A productivity tool
- A social network in waiting

### Week 1 Success Criteria

- Can someone speak naturally without system anxiety?
- Does saving feel secure and complete?
- Is retrieval simple and reliable?
- Does returning feel welcoming, not surveilled?

**Keep the journal itself simple and bulletproof.** Let complexity emerge from user need, not architectural ambition.

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

(…full 13 criteria in `/docs/STAGE_1_READINESS_CHECKLIST.md`)

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

## Next Milestone

At Week 8 review, if **all 13 criteria met for 8 weeks**, Stage 2 (pattern sharing & resonance) becomes eligible to unlock. Otherwise, reset cycle with criterion-specific resets.

---

## Pre-Launch: The 3-Week Build Sprint

Before inviting users, ship the **Minimum Viable Stage 1**. Nothing fancy. Just these three core experiences working reliably.

### Week -3: Presence Foundation

**Ship These**:
- [ ] Voice capture with 2-3 second pause tolerance
- [ ] Breathing animation (not spinner, not "processing...")
- [ ] Basic transcription save to journal_entries table
- [ ] "Just save my words" escape hatch (was_saved_raw flag)

**Test Internally**:
- Record a journal entry with long pauses
- Does the breathing animation feel alive or mechanical?
- Can you feel the difference between "system thinking" and "held space"?
- Does the escape hatch feel accessible or hidden?

**Don't Build Yet**:
- Elemental mapping
- Pattern visualization
- Social features
- Analytics beyond basic saves

---

### Week -2: Humble Intelligence

**Ship These**:
- [ ] Confidence scoring (even crude: <0.5 = uncertain, 0.5-0.8 = hedge, >0.8 = assert)
- [ ] One uncertainty response template: "I hear two threads here - [X] and [Y]. Which feels closer?"
- [ ] Thumbs up/down buttons
- [ ] Corrections table storing correction_type, old_value, new_value

**Test Internally**:
- Journal something ambiguous
- Does MAIA hedge appropriately?
- Does the uncertainty prompt feel inviting or frustrating?
- Can you correct her smoothly?

**Don't Build Yet**:
- Complex uncertainty routing
- Multiple correction types
- Correction analytics beyond simple count

---

### Week -1: Memory & Re-entry

**Ship These**:
- [ ] Personal lexicon (one user_id → element_mapping stored)
- [ ] "Still learning your language" reminder after correction
- [ ] Re-entry detection (days_since_last_session calculation)
- [ ] Basic "Welcome back" flow (different copy for 7-29d vs ≥30d)

**Test Internally**:
- Correct MAIA on a symbol ("For me, water means...")
- Return 8 days later
- Does she remember your correction?
- Does the welcome back feel gentle or guilt-inducing?

**Don't Build Yet**:
- Sophisticated lexicon visualization
- Pattern stability tracking
- Differentiation capacity tests

---

## Launch Day: Alpha Cohort (10-20 Users)

### User Selection Criteria

**Invite users who**:
- Have journaling practice already (not cold start)
- Understand beta mindset ("this will be rough")
- Can articulate felt experience (not just "it's fine")
- Represent diversity (therapists, artists, engineers, parents)

**Do Not Invite**:
- Users who need polished UX (not ready)
- Users expecting social features (Stage 1 is solo)
- Users who can't give weekly feedback (need their voice)

### Launch Email Template

```markdown
Subject: Welcome to MAIA - Stage 1

You're among the first 20 people experiencing MAIA.

**What MAIA is (right now)**:
- A voice journaling companion learning to hold space with you
- Still rough, still learning, but genuinely present
- She'll breathe when you pause (not rush you)
- She'll say "I'm not sure" sometimes (that's intentional)
- When you correct her, she remembers

**What MAIA isn't (yet)**:
- Polished or feature-complete
- Connected to other users (that's Stage 2)
- Always accurate (she's learning your language)

**What we need from you**:
- Weekly 5-minute check-ins (quick survey)
- Honesty when something feels off
- Patience as we build this together

**Your first journal prompt**:
"What brought you here today?"

Just speak. MAIA will listen.

[Launch MAIA]
```

---

## Week 1-8: The Core Loop

### Daily Operations (10 min)

**Morning Check**:
- Circuit breaker alerts? (any sessions with >5 corrections?)
- Voice capture failures? (transcription errors)
- Crash reports? (system breakage)

**Do NOT**:
- Optimize prematurely
- Add features
- React to single-user feedback

### Weekly Metrics Review (30 min)

```sql
-- Week baseline snapshot
SELECT
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as total_entries,
  AVG(length(response)) as avg_entry_length,
  COUNT(*) FILTER (WHERE was_saved_raw = true) as escape_hatch_uses,
  COUNT(DISTINCT user_id) FILTER (WHERE correction_count > 0) as users_who_corrected
FROM journal_entries je
LEFT JOIN (
  SELECT entry_id, COUNT(*) as correction_count
  FROM corrections
  GROUP BY entry_id
) c ON c.entry_id = je.id
WHERE je.created_at >= date_trunc('week', now());
```

### Weekly User Check-in Survey

1. How many times did you journal this week?
2. Did MAIA's pauses feel spacious or awkward?
3. Did you correct her? If so, how did it feel?
4. On a scale of 1-5, did you feel heard?
5. One thing that felt good? One thing that felt off?

---

## Week 5-6: Qualitative Interviews

**Select 5 users with different usage patterns**

**20-minute conversations (not surveys)**

**Ask the Stage 1 gate questions**:
- "Have you noticed any patterns in your journaling?"
- "Does it feel safe to write here? Why or why not?"
- "When MAIA pauses, what happens for you?"
- "Can you teach MAIA your own language, or does she impose hers?"

**Document**:
- Anonymized quotes (with permission)
- Surprising insights ("I didn't expect...")
- Edge cases (users who aren't engaging)

---

## Week 7-8: Gate Preparation

### Expand to Beta Cohort (50 Users Total)

**Why Now**:
- Alpha cohort has 6+ weeks of data
- Core features are stable (not crashing)
- You understand baseline patterns

### Team Retrospective (1 hour)

**Facilitate with these prompts**:
1. Read the 6 retrospective questions aloud
2. Each team member answers honestly (round-robin, no discussion yet)
3. Discuss discrepancies (where do we disagree?)
4. Review metrics together (do numbers match felt experience?)
5. Decide: Is Stage 1 ready for first gate review?

**Document**:
- Each person's answers to 6 questions
- Areas of agreement vs tension
- Surprises ("I thought X, but data shows Y")

### Prepare Gate Evidence

**Quantitative**:
- Correction accuracy trend
- Circuit breaker incidents (should be <0.1%)
- Trust signals (felt heard scores)
- Re-entry rates (7-29d and ≥30d)

**Qualitative**:
- Self-recognition quotes ("I noticed I...")
- Privacy viscerality quotes ("I trust...")
- Silence experience quotes ("The pauses feel...")
- Lexicon agency quotes ("I can teach her...")

**Operational**:
- Sprint retro notes (did team reference metrics?)
- Standup logs (did circuit breakers trigger response?)
- Onboarding recordings (can new engineers understand system?)

---

## Week 9: First Gate Review

### Gate Review Meeting (2 hours)

**Agenda**:
1. **Quantitative Review** (30 min)
   - Walk through all criteria with evidence
   - Discuss grace weeks (were any external events?)
   - Identify failing criteria

2. **Qualitative Review** (30 min)
   - Share interview highlights
   - Discuss behavioral markers (privacy progression, pattern stability)
   - Note surprising themes

3. **Retrospective Test** (30 min)
   - Each person reads their answers to 6 questions
   - Discuss discrepancies
   - Any "no" or "maybe" requires deep examination

4. **Gate Decision** (30 min)
   - Vote: Approve / Object / Abstain
   - Document strong objections (with evidence)
   - Set next review date (8 weeks or sooner if FAIL)

### Possible Outcomes

**✅ PASS (unlikely on first review)**:
- All criteria met for 8 weeks
- All retrospective questions answered "yes" with strong reasoning
- 2/3 approval, no strong objections
- Stage 2 planning begins (but no features ship yet)

**⚠️ PARTIAL (most likely)**:
- Most criteria met, 2-3 need work
- Retrospective questions mostly "yes" with some "maybe"
- Specific fixes identified
- Re-review in 4 weeks for those criteria

**❌ FAIL (if major issues)**:
- Multiple criteria failing
- Circuit breaker incidents >0.5%
- Privacy concerns surfaced
- Any retrospective question answered "no" by 2+ people
- Major fixes needed, reset 8-week clock

### Log Decision

Fill out `/docs/stage1_gate_log.md` template with:
- Evidence links for all criteria
- Anonymized interview quotes
- Team retrospective answers
- Vote results and signatures
- Actions required (if not passing)

---

## The Most Important Thing

**Start the clock.**

Real users. Real presence. Real metrics.

The journal loop—speak, breathe, save—must feel trustworthy before anything else matters.

If those three actions don't create a sense of being genuinely witnessed, you have nothing.

---

## References

- **Gate Criteria**: `/docs/STAGE_1_READINESS_CHECKLIST.md`
- **Metrics System**: `/docs/MAIA_GUARDRAILS_INTEGRATION_COMPLETE.md`
- **Operational Runbook**: `/docs/MAIA_GUARDRAILS_RUNBOOK.md`
- **Gate Log Template**: `/docs/stage1_gate_log.md`

---

## Next Action

**Monday Sprint Planning**:
1. Review this guide with full team (30 min)
2. Assign Week -3 sprint tasks (presence foundation)
3. Set internal deadline for alpha launch (Week 0)
4. Draft alpha user invite list (10-20 names)

**The clock starts when the first user journals.**

Until then, it's all preparation.
