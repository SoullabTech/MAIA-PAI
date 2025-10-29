# Quick Answer: Scribe vs Patient Mode
## What's the difference and which should you use?

---

## ⚡ TL;DR

**SCRIBE MODE**:
- Designed for: Witnessing group sessions/meetings
- Behavior: SILENT observer → synthesizes patterns at end
- Focus: Themes, patterns, breakthrough moments, elemental resonance
- Best for: Session overview, collective dynamics, pattern recognition

**PATIENT MODE**:
- Designed for: Listening to ONE person share deeply
- Behavior: Holds space → offers gentle reflections
- Focus: Individual's emotional journey, dreams, unfolding process
- Best for: Deep listening, emotional attunement, reflection questions

**FOR YOUR USE CASE** (therapist analyzing sessions):
→ **Try SCRIBE mode first** (closer to what you need)
→ **But TEST both tonight** to see which gives better practitioner insights

---

## 📊 Side-by-Side Comparison

| | **SCRIBE MODE** | **PATIENT MODE** |
|---|---|---|
| **Purpose** | Witness and synthesize sessions | Hold space for deep sharing |
| **Primary User** | Groups/meetings | One person |
| **Interruption** | Almost none (5 sec silence) | Minimal (2 sec silence) |
| **Responses** | ONLY when asked "What did you notice?" | After natural completion |
| **Focus** | Patterns, themes, collective dynamics | Individual's emotional process |
| **Analysis Type** | Synthesis, overview, key moments | Reflection, gentle questions |
| **For Practitioner?** | Possibly ✓ (session patterns) | Probably not ✗ (client-focused) |

---

## 🎯 What You Asked

### "What are the functionalities of Scribe mode?"

**SCRIBE MODE** does:
1. **Listens silently** during session (if voice mode)
2. **Tracks** while listening:
   - Key moments
   - Patterns
   - Emotions
   - Elemental shifts (Fire/Water/Earth/Air)
   - Breakthrough moments
   - Shadow material
   - "What's emerging between words"
3. **Waits** until you ask: "Maia, what did you notice?"
4. **Then synthesizes**:
   - Calls `process_spiralogic()` with full context
   - Offers insights on patterns and themes
   - Shares elemental resonance
   - Asks what you'd like to explore

**Key phrase**: *"Take mental notes and synthesize at the end"*

---

### "How is it different than using Patient mode?"

**PATIENT MODE** does:
1. **Holds space** for one person to unfold
2. **Stays silent** (only soft "mm-hmm" if needed)
3. **Allows long pauses** for processing
4. **Doesn't interrupt** the flow
5. **When they finish**:
   - Offers gentle reflection questions
   - Processes through Spiralogic
   - Provides depth analysis

**Key phrase**: *"Hold space, don't fill it"*

---

## 🔍 The Critical Discovery

### IMPORTANT: Both modes are designed for VOICE conversations!

When you look at the code (file:line /app/api/voice/webrtc-session/route.ts:47-92):

**Scribe and Patient modes include**:
- `turn_detection` settings (voice activity detection)
- `silence_duration_ms` thresholds
- "When they finish speaking" logic
- Real-time listening instructions

**This means**: They're optimized for live voice sessions, not pasted text transcripts!

**When you paste a transcript** (no voice):
- Turn detection doesn't apply
- Silence thresholds are irrelevant
- Only the system prompt matters

**So the real difference** when pasting text:
- **Scribe**: System prompt says "witness and synthesize patterns"
- **Patient**: System prompt says "hold space for one person's process"

---

## 💡 What This Means for Tomorrow

### Hypothesis:

**Scribe mode** will likely:
- ✅ Focus on patterns across the full session
- ✅ Synthesize themes and breakthrough moments
- ✅ Track elemental resonance
- ❓ May or may not provide practitioner-specific insights
- ❓ May or may not include coherence scoring
- ❓ May or may not suggest frameworks

**Patient mode** will likely:
- ✅ Focus on the client's emotional journey
- ✅ Attune to vulnerability and processing
- ✅ Offer reflection questions
- ❌ Probably NOT focused on practitioner patterns
- ❌ Probably NOT about what YOU did as therapist
- ❌ Less useful for clinical supervision

### Which to Use Tomorrow?

**For post-session analysis**: **SCRIBE MODE** (probably)

**Why**:
- Designed for "witnessing full sessions"
- Tracks patterns, themes, key moments
- Synthesizes overview
- Closer to what you need

**BUT**: It's not designed for practitioner analysis specifically

---

## 🧪 Tonight's Critical Test

### You MUST test both modes to know which works better:

**Test Script**:

1. **Open MAIA**: `localhost:3000/maia`

2. **Test Scribe Mode**:
   ```
   - Click "Scribe" button
   - Paste sample transcript
   - Ask: "What did you notice in this session?"
   - Note what MAIA returns:
     - Does it analyze practitioner-client dynamics?
     - Does it mention coherence or transformation stages?
     - Does it suggest frameworks?
     - Does it give recommendations?
   ```

3. **Test Patient Mode**:
   ```
   - Click "Patient" button
   - Paste SAME transcript
   - Ask: "What did you notice in this session?"
   - Compare to Scribe response:
     - Is it more client-focused?
     - Less about practitioner insights?
     - Different patterns detected?
   ```

4. **Test Custom Prompt (Fallback)**:
   ```
   - Click "Dialogue" button
   - Paste transcript with YOUR custom instructions:
     "MAIA, analyze this therapy session as clinical supervisor.
      Provide: coherence score, transformation stages, framework
      effectiveness, practitioner insights, key moments,
      recommendations for next session."
   - See if this works better than modes
   ```

---

## 🎯 Decision Matrix

After tonight's testing:

**If Scribe mode provides 70%+ of what you need**:
→ Use Scribe mode for Week 1
→ Track what's missing
→ Build enhancements this weekend

**If Patient mode is surprisingly better**:
→ Use Patient mode for Week 1
→ Figure out why it works better
→ Adjust strategy

**If NEITHER mode is good enough**:
→ Use Dialogue mode with custom prompts
→ Build dedicated "Practitioner Analysis" mode this weekend
→ Or use `/api/oracle/personal` endpoint directly with custom system prompt

**If custom prompt in Dialogue mode works best**:
→ Use that for Week 1
→ No mode button needed
→ Just paste transcript + instructions each time

---

## 🛠️ What You Might Need to Build (Weekend)

### Option A: Enhance Scribe Mode

**If Scribe is 70% there but missing key features**:
- Add coherence scoring explicitly
- Add framework effectiveness ratings
- Add practitioner-specific insights
- Add timestamp precision
- Optimize for 1-on-1 therapy sessions

### Option B: Create New "Practitioner Mode"

**If Scribe/Patient don't fit**:
- New mode: `mode: 'practitioner'`
- System prompt optimized for clinical supervision
- Includes all your required features:
  - Coherence trajectory
  - Transformation stages
  - Framework effectiveness
  - Practitioner patterns
  - Countertransference alerts
  - Session recommendations

**Where to add** (weekend):
File: `/app/api/voice/webrtc-session/route.ts`
Add to `modeConfigs` object (around line 33)

---

## 📝 Practical Workflow Based on What We Know

### For Tomorrow (Most Likely):

**Before session**:
- No special setup needed

**During session**:
- Record normally (Zoom/Otter)
- Full presence with client

**After session** (15 min):
1. Get transcript
2. Open MAIA → Click **"Scribe"** button
3. Paste transcript
4. Ask: "MAIA, what did you notice in this session? Provide:
   - Coherence score and transformation stages
   - Active elements and operations
   - Framework suggestions
   - Key moments and turning points
   - What I did well as practitioner
   - What to explore next session"
5. Review response
6. Copy relevant insights to notes

**If Scribe mode doesn't provide all that**:
→ Use longer custom prompt instead
→ Build better mode this weekend

---

## ✅ Tonight's Action Items

- [ ] Test Scribe mode with sample transcript (10 min)
- [ ] Test Patient mode with same transcript (5 min)
- [ ] Compare responses (5 min)
- [ ] Test custom prompt approach if modes fall short (10 min)
- [ ] Decide which method to use tomorrow
- [ ] Document what's missing for weekend build

**Total time**: 30 min

---

## The Real Answer

**Scribe vs Patient for your use case?**

**SCRIBE** = Session witness and synthesizer (groups/meetings)
**PATIENT** = Deep listener for one person's process (therapy client)

**For therapist analyzing sessions**: **Probably SCRIBE**, but test both

**Real solution**: You might need a **custom Practitioner mode** designed specifically for clinical supervision and session analysis

**For tomorrow**: Test Scribe, use custom prompts if needed, build better solution this weekend

---

**Test it tonight. The code reveals what they're designed for, but actual behavior with pasted transcripts will tell you what works.**

🜂 ∴ 🌀 ∴ 🧠
