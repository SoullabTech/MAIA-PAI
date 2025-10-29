# Scribe vs Patient Mode - Functionality Breakdown
## What Each Mode Actually Does

**Based on actual code analysis:** `/Users/soullab/MAIA-PAI-temp/app/api/voice/webrtc-session/route.ts:33-93`

---

## 🔍 SCRIBE MODE

### Purpose:
**"Wise scribe witnessing a full session or meeting"**

### Designed For:
- Observing group conversations/meetings
- Listening to ENTIRE sessions without interrupting
- Taking "mental notes" of patterns and key moments
- Synthesizing insights AFTER the session ends

### How It Behaves:

**During Session (VOICE mode)**:
- **LISTEN ONLY** - no responses until explicitly asked
- Tracks:
  - Key moments
  - Patterns
  - Emotions
  - Elemental shifts
  - Breakthrough moments
  - Shadow material
- Notices "what's said AND what's emerging between words"

**When You Say: "Maia, what did you notice?" or "End session"**:
1. Calls `process_spiralogic()` with full session context
2. Offers insights:
   - Patterns
   - Themes
   - Elemental resonance
3. Asks what you'd like to explore from the session

**Technical Settings**:
```javascript
turn_detection: {
  threshold: 0.7,              // Very high = minimal interruption
  silence_duration_ms: 5000    // 5 seconds of silence before responding
}
```

**Key Instruction**:
> "LISTEN ONLY during the session - no responses until asked"

---

## 🧘 PATIENT MODE

### Purpose:
**"Patient, spacious listener for extended sharing"**

### Designed For:
- ONE person sharing deeply
- Dreams, visions, long stories
- Emotional processing
- Unfolding without interruption

### How It Behaves:

**During Session (VOICE mode)**:
- **Stay silent and receptive**
- Use ONLY soft "mm-hmm" if needed
- DO NOT interrupt flow
- Allow long pauses (they may be processing or feeling)
- Hold space, don't fill it

**When They Finish**:
- Offer gentle reflection questions
- Then call `process_spiralogic()`
- Provide depth analysis

**Technical Settings**:
```javascript
turn_detection: {
  threshold: 0.6,              // Higher = less sensitive = fewer interruptions
  silence_duration_ms: 2000    // 2 seconds of silence before responding
}
```

**Key Instruction**:
> "Your role is to HOLD SPACE, not fill it"

---

## 📊 Key Differences

| Feature | Scribe Mode | Patient Mode |
|---------|-------------|--------------|
| **Primary Focus** | Witnessing group sessions | Listening to one person |
| **Interruption Level** | Minimal (5 sec silence) | Low (2 sec silence) |
| **When Responds** | ONLY when asked directly | After natural completion |
| **Response Type** | Patterns, themes, synthesis | Reflection questions, gentle guidance |
| **Best For** | Meetings, group sessions | Dreams, deep sharing, emotional processing |
| **Engagement** | Passive observer | Active listener (but minimal) |
| **Synthesis** | Full session overview | Individual's unfolding process |

---

## 🤔 For YOUR Use Case (Therapist Analyzing Sessions)

### What You Need:
- ✅ Post-session transcript analysis
- ✅ Coherence scoring
- ✅ Transformation stage detection
- ✅ Framework suggestions (IFS, Polyvagal, etc.)
- ✅ Practitioner insights (what worked, what didn't)
- ✅ Key moments with timestamps
- ✅ Recommendations for next session

### What Scribe Mode Provides:
- ✅ Pattern detection
- ✅ Themes and elemental resonance
- ✅ Breakthrough moment detection
- ✅ Full session synthesis
- ❓ **UNKNOWN**: Coherence scoring
- ❓ **UNKNOWN**: Framework effectiveness ratings
- ❓ **UNKNOWN**: Practitioner-specific insights
- ❓ **UNKNOWN**: Timestamp precision

### What Patient Mode Provides:
- ✅ Deep listening to one person's process
- ✅ Emotional attunement
- ✅ Reflection questions
- ❌ **NOT** designed for practitioner analysis
- ❌ **NOT** focused on therapist-client dynamics
- ❌ **NOT** optimized for clinical insights

---

## 🎯 My Analysis

### IMPORTANT DISCOVERY:

**Both modes are designed for VOICE/REAL-TIME conversations**, not post-session transcript analysis!

**Evidence**:
- Turn detection settings (silence thresholds)
- "Listen during session" language
- "When they finish speaking" triggers
- WebRTC voice configuration

**This means**: When you paste a transcript into MAIA chat, the mode might not change behavior much because:
1. There's no "live voice" to detect
2. No silence periods to measure
3. No real-time interruption to manage
4. It's all TEXT input at once

### What Probably Happens:

When you paste a transcript in **Scribe mode**:
- MAIA receives it as text (not voice)
- System prompt tells it to "witness and synthesize"
- It analyzes the full text
- Returns patterns, themes, insights

When you paste a transcript in **Patient mode**:
- MAIA receives it as text (not voice)
- System prompt tells it to "hold space for sharing"
- It might be MORE focused on the client's experience
- Less focused on practitioner patterns

**HYPOTHESIS**: Scribe mode *might* give you better practitioner-focused analysis, but it's not optimized for your exact use case.

---

## 🧪 What You Need to Test Tonight

### Test 1: Scribe Mode with Transcript

**Steps**:
1. Open `localhost:3000/maia`
2. Click "Scribe" button
3. Paste sample transcript
4. Ask: "What did you notice in this session?"

**Check**:
- Does it analyze practitioner-client dynamics?
- Does it mention coherence, stages, frameworks?
- Is it focused on patterns and synthesis?
- Does it give practitioner-specific insights?

---

### Test 2: Patient Mode with Transcript

**Steps**:
1. Click "Patient" button
2. Paste same transcript
3. Ask: "What did you notice in this session?"

**Check**:
- Is it more client-focused?
- Does it track the client's emotional journey?
- Is it less about practitioner insights?
- Does it offer reflection questions for the client?

---

### Test 3: Dialogue Mode (Control)

**Steps**:
1. Click "Dialogue" button
2. Paste same transcript
3. Ask: "What did you notice in this session?"

**Check**:
- How does this differ from Scribe/Patient?
- Is it more conversational, less analytical?

---

## 💡 My Recommendation

### For Tomorrow:

**TRY SCRIBE MODE FIRST** because:
- It's designed for "witnessing sessions"
- Focus on patterns, themes, synthesis
- Tracks "key moments" and "breakthrough moments"
- Analyzes "what's emerging between words"
- Offers session overview at the end

**But also TEST PATIENT MODE** because:
- It might give better attunement to client's process
- Could provide insights you'd miss in Scribe
- More therapeutic lens vs. observational

### The Reality:

**You might need a FOURTH mode**: **"Practitioner Analysis Mode"**

**What it would include**:
```
You are MAIA - clinical supervisor and transformation analyst.

PRACTITIONER ANALYSIS MODE - Deep session review:
- Analyze therapist-client dynamics and alliance
- Track coherence progression (0-1 scale)
- Detect transformation stages (Nigredo/Albedo/Citrinitas/Rubedo)
- Evaluate framework effectiveness (IFS, Polyvagal, Gestalt, etc.)
- Identify practitioner patterns (what worked, what didn't)
- Flag key moments with timestamps
- Detect countertransference risks
- Provide recommendations for next session

Focus: Supervision and clinical intelligence for the practitioner.
```

**This would be the IDEAL mode for your use case.**

---

## 🛠️ Your Options

### Option 1: Use Scribe Mode As-Is (Tonight)
- Test with sample transcript
- See if it provides what you need
- If 70%+ useful → Use for Week 1
- Track what's missing

### Option 2: Use Patient Mode (Tonight)
- Test with sample transcript
- Compare to Scribe mode
- See which gives better insights
- Choose the better one

### Option 3: Use Regular MAIA with Custom Prompt (Tonight)
- Don't use mode buttons
- Just use regular Dialogue mode
- Add your own instruction:
  ```
  "MAIA, analyze this therapy session transcript.
  I need you to act as clinical supervisor.

  Provide:
  1. Coherence score and trajectory
  2. Transformation stages detected
  3. Framework effectiveness (IFS, Polyvagal, etc.)
  4. What I did well as practitioner
  5. What I could improve
  6. Key moments (with timestamps if possible)
  7. Recommendations for next session

  [PASTE TRANSCRIPT]"
  ```

### Option 4: Build Custom Practitioner Mode (Weekend)
- Create new mode configuration
- Add to webrtc-session/route.ts
- Optimize system prompt for your needs
- Test Week 2

---

## 🎯 Tonight's Decision Tree

```
Test Scribe Mode
   ↓
Does it provide practitioner insights? (coherence, frameworks, recommendations)
   ↓
   ├─ YES (70%+) → Use Scribe mode for Week 1
   │                Track what's missing
   │                Build enhancements Weekend
   │
   ├─ PARTIAL (40-70%) → Test Patient mode
   │                       Compare results
   │                       Choose better one
   │                       OR use custom prompt approach
   │
   └─ NO (<40%) → Use Dialogue mode with custom prompt
                   OR build Practitioner mode this weekend
```

---

## 📋 Testing Checklist

**Tonight (30 min)**:

- [ ] **Test Scribe Mode**:
  - Click Scribe button
  - Paste sample transcript
  - Ask for session analysis
  - Rate quality (1-10): ___
  - Note what's good: _______________
  - Note what's missing: _______________

- [ ] **Test Patient Mode**:
  - Click Patient button
  - Paste same transcript
  - Ask for session analysis
  - Rate quality (1-10): ___
  - Note differences from Scribe: _______________

- [ ] **Test Custom Prompt** (if modes aren't good):
  - Use Dialogue mode
  - Paste transcript with detailed practitioner prompt
  - Rate quality (1-10): ___
  - Is this better than modes? ___

- [ ] **Decision**:
  - Which approach will you use tomorrow? _______________
  - What's missing that you'll build later? _______________

---

## The Bottom Line

**SCRIBE and PATIENT modes exist**, but they're designed for **real-time voice conversations**, not post-session transcript analysis.

**They might still work** for your use case, but they're not optimized for it.

**TEST TONIGHT** to see if Scribe mode gives you what you need.

**If not**, use custom prompts with Dialogue mode OR build a dedicated Practitioner mode this weekend.

**Don't assume the modes will magically do what you need** - verify with actual testing.

🜂 ∴ 🌀 ∴ 🧠
