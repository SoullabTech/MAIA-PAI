# MAIA Voice Interface: Sprint Checklist

## Sprint Overview
**Duration:** 12 weeks (3 months)
**Core Principle:** Ship working increments that users can feel, not just see
**Priority Order:** Mechanics foundation → Language layer → Aesthetic polish

---

## Phase 1: Foundation (Weeks 1-4)
*Focus: Core mechanics and trust architecture*

### Week 1-2: Voice Capture & Base Repair
- [ ] Implement Whisper large-v3 with 2-3s pause tolerance
- [ ] Basic transcription UI with save functionality
- [ ] Add thumbs up/down buttons post-transcription
- [ ] Store correction events in database
- [ ] "Just save my words" escape hatch
- **Ship:** Basic voice journaling with feedback mechanism

### Week 3-4: Confidence Pipeline
- [ ] Build 3-tier confidence scoring (>80%, 50-80%, <50%)
- [ ] Route responses based on confidence levels
- [ ] Implement "Start fresh" button in UI
- [ ] Add "MAIA, pause" voice command
- [ ] Create personal lexicon table structure
- **Ship:** Confidence-aware responses with escape routes

---

## Phase 2: Personalization (Weeks 5-8)
*Focus: Learning systems and adaptive behavior*

### Week 5-6: Personal Lexicon
- [ ] Build lexicon storage with user-specific mappings
- [ ] Add recency scoring to mappings
- [ ] One-tap correction flow ("Not this time" / "Never again")
- [ ] Display "You've taught me X symbols" counter
- [ ] Implement basic symbol recall in responses
- **Ship:** MAIA remembers user-specific meanings

### Week 7-8: Adaptive Prompting
- [ ] Build correction frequency logic (50% → 25% → <70%)
- [ ] Add passive correction path (edit without prompt)
- [ ] Implement re-entry protocol (7-day / 30-day thresholds)
- [ ] Create "Welcome back" flow with continuity choice
- [ ] Add lexicon refresh prompts (4-6 week cycle)
- **Ship:** Smart prompting that adapts to user engagement

---

## Phase 3: Presence & Polish (Weeks 9-12)
*Focus: Aesthetic refinement and advanced features*

### Week 9-10: Visual & Timing
- [ ] Implement 3-state visual system (listening/thinking/complete)
- [ ] Add breathing animation for silence periods
- [ ] Build response timing middleware (natural hesitations)
- [ ] Replace spinners with organic animations
- [ ] Add "Take your time" dismissable prompt at 2+ seconds
- **Ship:** MAIA feels present, not processing

### Week 11-12: Language & Integration
- [ ] Seed humble phrasing bank (20+ variations)
- [ ] Implement uncertainty branching templates
- [ ] Add structure to all "I don't know" responses
- [ ] Build contradiction detection ("tired meant X, now means Y")
- [ ] Create low-energy mode (minimal prompts)
- **Ship:** Full voice personality with therapeutic humility

---

## Acceptance Criteria by Week

### Week 4 Checkpoint
- Users can speak, see transcription, and correct it
- MAIA responds differently based on confidence levels
- Escape hatches prevent lock-in
- Basic personal memory exists

### Week 8 Checkpoint
- MAIA remembers user-specific symbols
- Correction prompts adapt to user behavior
- Returning users get appropriate re-entry
- System feels personalized, not generic

### Week 12 Checkpoint
- Voice interface feels alive (breathing, pausing, hesitating)
- Language is humble and uncertain when appropriate
- All guardrails from Charter v1.1 are implemented
- Metrics dashboard shows key signals

---

## Critical Path Dependencies

**Backend First:**
1. Confidence scoring system (enables everything else)
2. Personal lexicon storage (enables personalization)
3. Session state management (enables re-entry logic)

**Frontend Parallel:**
1. Voice capture UI (can develop alongside backend)
2. Animation system (independent of core logic)
3. Correction flows (needs backend hooks but UI can be mocked)

---

## Risk Mitigations

**If ASR latency is too high:** Fall back to shorter pause tolerance with manual "done" button
**If confidence scoring is unstable:** Default to medium confidence (hedge) until tuned
**If correction UI is confusing:** Ship with simple thumbs only, add detailed correction in v2
**If re-entry feels invasive:** Default to "start fresh" for everyone until patterns clear

---

## Team Assignments (Suggested)

**Backend Lead:** Confidence pipeline, lexicon storage, session management
**Frontend Lead:** Voice UI, animations, correction flows
**ML Engineer:** ASR tuning, confidence scoring, Claude/Llama integration
**Design:** Breathing animations, state indicators, humble phrasing bank
**Product:** Metrics dashboard, user feedback collection, A/B test setup

---

## Success Gates

**Week 4:** 30% of users use correction at least once
**Week 8:** 70% "felt heard" rating in micro-polls
**Week 12:** Return rate 15% higher for repair-engaged users

---

## Notes
- Prioritize working features over perfect features
- Each week should ship something users can feel
- Gather feedback continuously, adjust thresholds based on data
- Keep Charter v1.1 as north star for all decisions
