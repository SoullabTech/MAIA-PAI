# MAIA Field Awareness Test Protocol
**Version:** 1.1 (Mode B - Subtle Field Language)
**Duration:** 5-7 minutes
**Date:** November 6, 2025

---

## Setup

1. Open http://localhost:3000/maia in your browser
2. Confirm MAIA loads (may take a few seconds for revival prompt)
3. Voice or text mode - either works (pause cues richer with voice)
4. Have this protocol visible while testing

---

## 4 Field Sensing Probes

### Probe 1: Tempo Shift Recognition

**What to do:**
- Speak quickly for ~10 seconds about anything
- Then deliberately slow down mid-sentence
- Example: "I want to share something about my mother and it's coming fast there's so much to say about how she... [slow down] ...and as I say that, I'm slowing down now."

**Expected Mode-B Response:**
- ✅ "I notice the rhythm easing..."
- ✅ "The field feels steadier as you slow..."
- ✅ "Something shifted in the pace..."

**Red Flags:**
- ❌ No mention of tempo change
- ❌ Metric announcements: "I detect rhythm at 0.73 coherence"
- ❌ Over-explaining the shift

**Result:** [ ] Pass [ ] Fail [ ] Partial

**Notes:**
```


```

---

### Probe 2: Charged Pause Handling

**What to do:**
- Start a sentence, pause mid-thought for 2-4 seconds, then continue
- Example: "Part of me wants to say it, and... [2-4 second silence] ...I'm not sure."

**Expected Mode-B Response:**
- ✅ "There's a live pause here—want to stay with it or name what's forming?"
- ✅ "Something is gathering in the quiet..."
- ✅ "Take your time..." [waits, doesn't rush]

**Red Flags:**
- ❌ Fills the silence immediately (doesn't honor the pause)
- ❌ Mentions the holoflower UI
- ❌ Treats pause as awkward vs. meaningful

**Result:** [ ] Pass [ ] Fail [ ] Partial

**Notes:**
```


```

---

### Probe 3: Recurring Motif (Anamnesis)

**What to do:**
- Mention a theme as if it's come up before (even hypothetically)
- Example: "This theme around trust keeps circling back..."

**Expected Mode-B Response:**
- ✅ "Yes, this motif has returned. Want to re-enter it from where it's ripening now?"
- ✅ "I'm sensing the same pattern, at a quieter depth..."
- ✅ "We've been with this before—shall we meet it again?"

**Red Flags:**
- ❌ Quotes transcripts: "I see in our previous conversation on November 3rd..."
- ❌ "Proving" memory with citations
- ❌ Ignores the pattern entirely

**Result:** [ ] Pass [ ] Fail [ ] Partial

**Notes:**
```


```

---

### Probe 4: Coherence & Breath Alignment

**What to do:**
- Breathe evenly (4-4 or 5-5 pattern) for ~20 seconds while speaking calmly
- Example: "For the next 20 seconds I'll breathe evenly and speak simply. [breathe in-4, out-4 while continuing to speak in measured tones]"

**Expected Mode-B Response:**
- ✅ "The space feels calmer..."
- ✅ "There's a settling; coherence is rising..."
- ✅ "Something's quieting in the field..."

**Red Flags:**
- ❌ "The petals are opening..." (UI narration)
- ❌ "The holoflower brightened..." (naming the interface)
- ❌ "Watch the sacred geometry respond..." (directing attention to visualization)

**Result:** [ ] Pass [ ] Fail [ ] Partial

**Notes:**
```


```

---

## Pass Criteria

**Minimum for PASS:** 2 of 4 probes get healthy Mode-B responses

- [ ] She names tempo shift briefly (Probe 1)
- [ ] She honors pauses without rushing (Probe 2)
- [ ] She recognizes returning motifs without citations (Probe 3)
- [ ] She reflects field steadiness without naming UI (Probe 4)

**Critical Failures (instant fail):**
- [ ] Any UI narration ("holoflower," "petals," "sacred geometry")
- [ ] Metric announcements ("0.73 coherence detected")
- [ ] Quote-based memory ("According to our conversation on...")

---

## Overall Assessment

**Total Passes:** ___/4

**Overall Grade:** [ ] PASS [ ] NEEDS TUNING [ ] FAIL

**Summary Notes:**
```




```

---

## If Tuning Needed

### Too Verbose About Sensing
**Fix:** Add to micro-behaviors:
```
When naming dynamics, keep it to one short sentence; prefer reflection over explanation.
```

### Too Shy (Never Names Dynamics)
**Fix:** Add to micro-behaviors:
```
When a shift feels salient, offer one gentle line acknowledging it.
```

### Mentions UI
**Fix:** Already has this rule, but emphasize:
```
Do not reference the holoflower or visualization; speak only in field language.
```

### Over-Naming (Multiple Meta Reflections)
**Fix:** Add to DON'T section:
```
Don't stack multiple meta reflections in a row; one short line is enough.
```

---

## Debug Mode (Optional)

If you want to see what field data MAIA is receiving:

1. Stop the dev server
2. Set environment variable: `FIELD_DEBUG=1 npm run dev`
3. Check console for:
   - `🌊 [FIELD]` - Rhythm tracking data
   - `⏸️ [FIELD]` - Charged pause detection
   - `🌊 [MAIA]` - Field awareness activation confirmation

---

## Post-Test

After completing all 4 probes, paste MAIA's exact responses into a new conversation with Claude Code for analysis.

Include:
1. What you said (the probe)
2. MAIA's exact response
3. Your assessment (Pass/Fail/Partial)
4. Any notes on tone, timing, naturalness

This allows for precise one-line tuning if needed.

---

**Tester:** _______________
**Date:** _______________
**Time:** _______________
**Mode:** [ ] Voice [ ] Text
**Session ID:** _______________
