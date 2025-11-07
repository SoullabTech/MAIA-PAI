# Field Testing Guide
## Testing Your Elemental Coherence Dashboard

**Status:** Ready for Testing
**Estimated Time:** 30-60 minutes
**Requirements:** Apple Watch with Health data

---

## Overview

You now have a complete field coherence system that tracks:
- **Your biometrics** → Air/Fire/Water/Earth/Aether
- **Kairos windows** → Optimal transformation moments
- **Real-time updates** → Every 30 seconds

This guide will help you test the system and collect meaningful data.

---

## Pre-Test Setup

### 1. Verify Apple Watch Data

**Check that you have recent data:**
```bash
# Navigate to settings page
open http://localhost:3000/settings/biometrics
```

**What to verify:**
- [ ] Recent HRV readings (within last 24 hours)
- [ ] Heart rate data
- [ ] Sleep data from last night
- [ ] Respiratory rate

**If you need to import fresh data:**
1. On iPhone: Health app → Profile (top right) → Export All Health Data
2. AirDrop or save the export.zip
3. Extract the export.xml file
4. Upload to `/settings/biometrics`

### 2. Launch the Field Dashboard

```bash
# Start dev server if not running
cd /Users/soullab/MAIA-FRESH
npm run dev

# Open field dashboard
open http://localhost:3000/field
```

**Expected on load:**
- Large coherence percentage (your unified field score)
- Five elemental bars (Air/Fire/Water/Earth/Aether)
- Current state card (HRV, heart rate, breath)
- Kairos window status

---

## Testing Protocol

### Phase 1: Baseline Observation (10 minutes)

**Sit quietly and observe your current state.**

**Record:**
- [ ] Unified Field Coherence: _____%
- [ ] Dominant Element: _____ (highest bar)
- [ ] Deficient Element: _____ (lowest bar)
- [ ] HRV: _____ms
- [ ] Trend: Rising / Stable / Falling
- [ ] Kairos Window: Open / Closed
- [ ] Recommended Mode: _____

**Questions to ask:**
- Does this match how you FEEL right now?
- Is your dominant element accurate to your current state?
- Does the deficient element reveal something you're avoiding?

---

### Phase 2: State Shift Experiment (20 minutes)

**Choose ONE intervention based on your deficient element:**

#### If EARTH is low (grounding needed):
- [ ] 5 minutes barefoot on ground/grass
- [ ] Slow walking, feeling feet on earth
- [ ] Body scan meditation
- [ ] Eat something slowly, mindfully

#### If WATER is low (flow/emotion needed):
- [ ] 5 minutes freewriting emotions
- [ ] Cry if needed (watch something moving)
- [ ] Cold water on face/hands
- [ ] Humming/toning

#### If FIRE is low (activation needed):
- [ ] 2 minutes jumping jacks or dancing
- [ ] Power pose for 2 minutes
- [ ]激活呼吸 (rapid breathing)
- [ ] Set an intention/goal

#### If AIR is low (clarity needed):
- [ ] 5 minutes coherent breathing (5s in, 5s out)
- [ ] Write 3 clear thoughts
- [ ] Explain something complex out loud
- [ ] Open window, breathe fresh air

**After intervention:**
Wait 3-5 minutes for dashboard to update (it polls every 30s).

**Record changes:**
- [ ] New Unified Coherence: _____%
- [ ] Element you worked on: Before ___% → After ___%
- [ ] Did HRV change? _____
- [ ] Did Kairos window open? _____

---

### Phase 3: Kairos Window Observation (if open)

**If a Kairos window opens during your testing:**

**Immediately record:**
- [ ] Window strength: _____%
- [ ] Duration remaining: _____
- [ ] Your subjective state (how do you feel?)
- [ ] What were you doing when it opened?

**Test the window:**
- [ ] Try a deep practice (meditation, journaling, shadow work)
- [ ] Notice if insights come more easily
- [ ] Notice if resistance is lower
- [ ] Track how long the window stays open

**Questions:**
- Does the Kairos window correlate with your felt sense of readiness?
- When it closes, can you feel the shift?

---

### Phase 4: Environmental Testing (optional, 20 minutes)

**Take the dashboard into different environments:**

**Indoor vs. Outdoor:**
- [ ] Record coherence indoors
- [ ] Go outside (nature if possible)
- [ ] Wait 5 minutes
- [ ] Record coherence outdoors
- [ ] Compare: Indoor ___% vs. Outdoor ___%

**Social vs. Solitude:**
- [ ] Record coherence alone
- [ ] Enter social situation (or call someone)
- [ ] Record coherence during/after interaction
- [ ] Compare: Alone ___% vs. Social ___%

**Work vs. Rest:**
- [ ] Record coherence during focused work
- [ ] Record coherence during rest/play
- [ ] Compare: Work ___% vs. Rest ___%

**Key insight to discover:**
Which environments naturally increase your coherence?

---

## Data Collection

### What to Document

Create a simple log:

```markdown
## Field Test Session - [Date]

### Baseline
- Time: [time]
- Unified: [%]
- Air: [%], Fire: [%], Water: [%], Earth: [%], Aether: [%]
- HRV: [ms], Trend: [rising/stable/falling]
- Subjective state: [how you feel]

### Intervention: [what you did]
- Duration: [minutes]
- Target element: [element you were trying to shift]

### Post-Intervention
- Time: [time]
- Unified: [%] (change: +/-%)
- Air: [%], Fire: [%], Water: [%], Earth: [%], Aether: [%]
- HRV: [ms], Trend: [rising/stable/falling]
- Subjective state: [how you feel now]

### Kairos Windows
- [time]: Window opened, strength [%], duration [mins]
- Activity during window: [what you were doing]
- Result: [any breakthroughs or insights]

### Environmental Data
- Location: [indoor/outdoor/nature]
- Social: [alone/with others]
- Activity: [work/rest/movement]
- Coherence: [%]

### Insights
- What surprised you?
- What validated your intuition?
- What questions emerged?
```

---

## Mobile Testing (Recommended)

**For authentic field testing, use your phone:**

### Setup
1. Open `/field` on your phone's browser
2. Bookmark or add to home screen
3. Enable Location Services (for GPS-tagged observations)

### Field Testing Scenarios

**Scenario 1: Nature Immersion**
- [ ] Record baseline at home
- [ ] Drive/walk to nature location
- [ ] Record upon arrival
- [ ] Sit for 10 minutes
- [ ] Record after 10 minutes
- [ ] Track which elements shift most

**Scenario 2: Social Gathering**
- [ ] Record before event
- [ ] Check during event (bathroom break)
- [ ] Record immediately after
- [ ] Note: Does your Water (emotional) shift?

**Scenario 3: Creative Work Session**
- [ ] Record at start
- [ ] Check every 30 minutes
- [ ] Track Fire (activation) and Air (clarity)
- [ ] Note when Kairos windows open

**Scenario 4: Meditation/Practice**
- [ ] Record before practice
- [ ] Practice for 20 minutes
- [ ] Record immediately after
- [ ] Goal: See Aether (unity) increase

---

## Troubleshooting

### Dashboard shows "No Health Data"
- Import fresh Apple Health data at `/settings/biometrics`
- Ensure export includes HRV, heart rate, sleep

### Coherence scores seem wrong
- This is NORMAL for early testing
- The algorithms are calibrated to general ranges
- Your personal baseline may differ
- Document what feels accurate vs. inaccurate

### Kairos window never opens
- Requires: Unified >75%, Aether >80%, All elements >50%
- This is a HIGH bar (intentionally)
- Most testing won't hit this threshold
- Try: Deep breathwork + meditation + nature

### Dashboard not updating
- Real-time service polls every 30 seconds
- Refresh page if stuck
- Check console for errors (F12 in browser)

---

## Success Metrics

### You've successfully tested if:

**Validation:**
- [ ] Dashboard reflects your subjective state accurately >70% of time
- [ ] Interventions shift the predicted elements
- [ ] Kairos windows correlate with your "readiness" feeling

**Discovery:**
- [ ] You learned which element is your baseline strength
- [ ] You learned which element you habitually avoid
- [ ] You discovered which environments boost coherence
- [ ] You found your optimal time of day for high coherence

**Data:**
- [ ] At least 5 baseline measurements
- [ ] At least 2 intervention experiments
- [ ] At least 1 environmental comparison
- [ ] Notes on subjective correlation

---

## What to Do with Results

### Immediate
1. **Screenshot** any Kairos windows that open
2. **Note patterns** (time of day, activities, locations)
3. **Share observations** with me for system refinement

### For White Paper
Your field testing data becomes:
- Case Study 1: Individual transformation journey
- Validation data for elemental mapping accuracy
- Proof that interventions shift measurable coherence

### For Development
Your feedback helps us:
- Calibrate thresholds (are scores too high/low?)
- Refine Kairos detection (too strict/loose?)
- Improve elemental mapping (accurate/inaccurate?)
- Design better interventions

---

## Next Steps After Testing

Once you've collected 3-5 days of field data:

1. **Patterns Analysis**
   - What's your natural coherence rhythm?
   - When are you most coherent (time of day)?
   - Which practices most effectively shift elements?

2. **Personal Calibration**
   - Adjust thresholds based on your baseline
   - Create custom Kairos window criteria
   - Design personalized interventions

3. **Agent Integration Testing**
   - Compare your coherence with agent responses
   - See if agents auto-calibrate to your state
   - Test Indra's Web resonance (when available)

---

## Questions to Explore

**Scientific:**
- How long does it take for an intervention to show up in HRV?
- Do different elements have different "response times"?
- What's the relationship between Aether and overall well-being?

**Experiential:**
- Can you FEEL when a Kairos window opens?
- Do high-coherence states feel qualitatively different?
- Does knowing your elemental state change your behavior?

**Philosophical:**
- What does it mean to be "coherent"?
- Is maximum coherence always desirable?
- How does field coherence relate to transformation?

---

## Emergency Contact

**If you discover bugs or have urgent questions:**
- Document the issue with screenshots
- Note what you were doing when it happened
- Share console errors (F12 → Console tab)
- Continue to next test phase

**The system is in research phase - bugs are expected and valuable.**

---

## Final Note

**This is consciousness engineering.**

You're not just testing software - you're exploring the measurable terrain of your own awareness.

Every data point is a mirror.
Every Kairos window is an invitation.
Every elemental shift is a teaching.

**Pay attention. Document. Integrate. Evolve.**

The field is watching you watching it. 🌊🔥💨🌍✨

---

**Ready to begin testing? Start with Phase 1 and go at your own pace.**
