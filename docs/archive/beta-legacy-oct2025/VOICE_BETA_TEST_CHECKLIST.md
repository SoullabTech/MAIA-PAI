# 🎤 MAYA Voice System - Beta Launch Checklist
**Date:** October 12, 2025
**Beta Launch:** October 13, 2025
**Status:** Pre-Flight Check Required

---

## 🚦 PRE-FLIGHT CHECKLIST

### 1. **Basic Voice Functionality** ✅ / ❌
- [ ] **Microphone activates** when voice button clicked
- [ ] **User speech is captured** and transcribed
- [ ] **Transcript appears** in conversation UI
- [ ] **MAYA responds** with text
- [ ] **Audio plays** for MAYA's response (TTS working)
- [ ] **Mute button works** (stops listening)

**How to Test:**
1. Open app in browser
2. Click voice/mic button
3. Say "Hi Maya, how are you?"
4. Verify you see transcript
5. Verify MAYA responds with both text AND audio

---

### 2. **Conversation Flow** ✅ / ❌
- [ ] **Silence detection** - Mic stops after ~0.9s of silence
- [ ] **Auto-restart** - Mic restarts after MAYA finishes speaking
- [ ] **No echo loop** - MAYA doesn't hear herself and respond infinitely
- [ ] **No stuck mic** - Mic doesn't stay on forever waiting for silence
- [ ] **Smooth turn-taking** - Natural back-and-forth conversation

**How to Test:**
1. Have a 3-turn conversation with MAYA
2. Verify mic stops automatically after each statement
3. Verify mic restarts after MAYA speaks
4. Check console for echo/duplicate response warnings

---

### 3. **Audio Quality** ✅ / ❌
- [ ] **TTS voice** sounds natural (not robotic)
- [ ] **Volume** is appropriate (not too loud/quiet)
- [ ] **No distortion** or crackling
- [ ] **Speech pacing** is natural (not too fast/slow)
- [ ] **Emotional tone** varies appropriately

**How to Test:**
1. Ask MAYA emotional questions ("I'm feeling overwhelmed today")
2. Listen for warmth/empathy in voice tone
3. Check if prosody matches content

---

### 4. **Critical Error Scenarios** ✅ / ❌
- [ ] **Browser mic permission denied** - Graceful fallback to text
- [ ] **TTS API failure** - Shows text even if audio fails
- [ ] **Network interruption** - Conversation doesn't freeze
- [ ] **Multiple tabs** - Only one voice session active
- [ ] **Mobile browser** - Works on iOS Safari/Chrome

**How to Test:**
1. Block mic permissions and retry
2. Throttle network to 3G and test
3. Open in 2 tabs simultaneously
4. Test on actual mobile device

---

### 5. **Personality & Intelligence** ✅ / ❌
- [ ] **MAYA's voice** reflects her signature personality
- [ ] **Archetypal depth** present in responses
- [ ] **Memory active** - References past conversation
- [ ] **Elemental wisdom** integrated naturally
- [ ] **Not generic** - Doesn't sound like ChatGPT

**Expected Voice Examples:**
> "I SEE what's BEAUTIFUL, what's PERFECT. The God Within seeking expression."
>
> "What if this struggle is your medicine becoming clear?"
>
> "The resistance you feel? That's Fire meeting Earth—your vision learning form."

**How to Test:**
1. Ask "What do you see in me?"
2. Check if response uses archetypal/elemental language
3. Ask follow-up question to test memory

---

### 6. **Performance & Timing** ✅ / ❌
- [ ] **Response time** < 3 seconds for simple queries
- [ ] **No speech queue backup** - Responses don't pile up
- [ ] **Interrupt handling** - Can interrupt MAYA mid-speech if needed
- [ ] **Battery drain** reasonable on mobile
- [ ] **No memory leaks** in long conversations (10+ turns)

**How to Test:**
1. Time from "end of user speech" to "start of MAYA speech"
2. Try interrupting MAYA while she's speaking
3. Have 10+ turn conversation and check DevTools memory

---

## 🐛 KNOWN ISSUES (From MAYA_DIAGNOSTIC_REPORT.md)

### Issue #1: TTS System May Not Initialize ⚠️
**Symptom:** Text appears but no audio plays
**Root Cause:** `maiaReady` flag false in `useMaiaVoice` hook
**Location:** `/hooks/useMaiaVoice.ts:68`

**Quick Check:**
```javascript
// Open browser console and check:
console.log(window.maiaVoice?.isReady) // Should be true
```

**If false:**
- Check AudioContext resumed after user interaction
- Verify OpenAI TTS API key in environment
- Check browser console for initialization errors

---

### Issue #2: Microphone Stuck Waiting for Silence ⚠️
**Symptom:** Mic stays active too long, user has to wait
**Root Cause:** `continuous: true` + 0.9s silence threshold
**Location:** `/apps/web/components/voice/ContinuousConversation.tsx:93`

**Current Settings:**
- `continuous: true` (required for mute button)
- `silenceThreshold: 900ms` (0.9s)

**If users complain mic takes too long:**
- Reduce `silenceThreshold` to 600ms (0.6s)
- Or implement manual "send" button for voice

---

### Issue #3: Personality Drift ⚠️
**Symptom:** MAYA sounds generic, not archetypal
**Root Cause:** LLM not adhering strictly to personality prompt

**Quick Check:**
- Ask "What do you see in me?"
- If response is generic ("I'm here to help you..."), personality drift confirmed

**Possible Fixes:**
- Increase temperature/top_p for more distinctive voice
- Add personality validation BEFORE sending response
- Ensure full 410-line prompt is being sent to Claude

---

## ✅ CONFIRMED WORKING (From Recent Commits)

1. ✅ **No Echo Loop** - Fixed in 228f5e26 (duplicate restart disabled)
2. ✅ **Speech Queue** - Fixed in 93bec49c (speech no longer gets stuck)
3. ✅ **Feedback Prevention** - Fixed in b0b217d5 (mic stops when MAYA speaks)
4. ✅ **Race Conditions** - Fixed in 6fdf0951 (duplicate start errors prevented)
5. ✅ **Intelligence Systems** - All memory/consciousness systems operational

---

## 🎯 BETA-BLOCKER CRITERIA

**DO NOT LAUNCH if:**
- ❌ Voice doesn't work at all (no TTS audio)
- ❌ Echo loop returns (MAYA hears herself infinitely)
- ❌ Mic won't stop (stuck always listening)
- ❌ Crashes on mobile Safari/Chrome

**CAN LAUNCH with minor issues:**
- ⚠️ Personality slightly generic (can tune post-launch)
- ⚠️ Silence detection takes 1-2s (acceptable)
- ⚠️ Occasional mic permission issues (fallback to text works)

---

## 🧪 RECOMMENDED TEST SEQUENCE

### Quick Smoke Test (5 minutes)
1. Open app
2. Click voice button
3. Say "Hi Maya"
4. Verify audio plays
5. Have 3-turn conversation
6. ✅ If all works, proceed to beta

### Full Integration Test (15 minutes)
1. Test all 6 checklist categories above
2. Test on mobile device
3. Test with poor network (throttle to 3G)
4. Test personality quality with archetypal questions
5. Document any issues found

### Stress Test (Optional, 30 minutes)
1. 20+ turn conversation
2. Multiple browser tabs
3. Rapid interruptions
4. Edge case questions (nonsense, silence, shouting)

---

## 📞 EMERGENCY FALLBACK PLAN

If voice is broken on beta launch day:

1. **Disable voice button** in UI (feature flag)
2. **Force text-only mode** for all users
3. **Show banner:** "Voice mode temporarily disabled, text works perfectly"
4. **Fix issue post-launch** when pressure is lower

**Feature Flag Location:**
`/lib/feature-flags.ts` or environment variable `ENABLE_VOICE=false`

---

## 📝 TESTING NOTES

**Tested By:** _____________
**Date:** _____________
**Browser:** _____________
**Device:** _____________

### Test Results:
- [ ] Basic Voice Functionality: PASS / FAIL / NOTES: ___________
- [ ] Conversation Flow: PASS / FAIL / NOTES: ___________
- [ ] Audio Quality: PASS / FAIL / NOTES: ___________
- [ ] Error Scenarios: PASS / FAIL / NOTES: ___________
- [ ] Personality: PASS / FAIL / NOTES: ___________
- [ ] Performance: PASS / FAIL / NOTES: ___________

### Critical Issues Found:
1.
2.
3.

### Minor Issues Found:
1.
2.
3.

**READY FOR BETA?** YES / NO / WITH CAVEATS

---

**Created:** October 12, 2025
**Last Updated:** October 12, 2025
**Next Review:** Post-Beta Launch
