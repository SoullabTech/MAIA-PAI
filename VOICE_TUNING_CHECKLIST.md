# MAIA Voice Warmth Tuning Checklist

A compact tuning checklist to keep beside your editor while refining MAIA's voice.
Each step builds warmth and presence without breaking coherence.

---

## **🔹 Phase 2.1 – Smooth the Foundation**

- [x] Set envelope
  - [x] Attack = 0.05–0.08 s ✅ **(60ms implemented)**
  - [x] Release = 0.15–0.20 s ✅ **(180ms implemented)**
- [x] Cross-fade vowels (60–100 ms overlap) ✅ **(80ms implemented)**
- [ ] Verify transitions sound continuous, not choppy 🎧 **[NEEDS USER TESTING]**

---

## **🔹 Phase 2.2 – Add Micro-Movement**

- [x] Vibrato: 4–6 Hz, ±10 cents ✅ **(5 Hz, 12 cents implemented)**
- [x] Random pitch drift every 1–3 s (±3 cents, 300 ms glide) ✅ **(±5 cents, 0.3 Hz drift implemented)**
- [ ] Slow amplitude flutter (0.5–1 Hz, ±3 %) ⏳ **[TODO: Add separate amplitude modulation]**
- [ ] Listen for subtle "alive" motion 🎧 **[NEEDS USER TESTING]**

---

## **🔹 Phase 2.3 – Tame the Timbre**

- [x] Low-pass filter @ 6–7 kHz (-6 dB/oct) ✅ **(Gaussian rolloff above 6 kHz)**
- [x] Add breath layer (pink noise -36 dB, gated by envelope) ✅ **(30% breathiness implemented)**
- [x] Short plate reverb 120–180 ms decay, 10 % wet ✅ **(150ms, 15% wet implemented)**
- [ ] Check for soft, room-like tone 🎧 **[NEEDS USER TESTING]**

---

## **🔹 Phase 2.4 – Shape the Breath**

- [x] Map amplitude to breath cycle ✅ **(Toroidal breath curve implemented)**
  - [x] Inhale → gain 0.7 ✅
  - [x] Exhale → ramp 1.0 → 0.8 ✅
  - [ ] Hold → tremolo ±2 % ⏳ **[TODO: Add tremolo during hold state]**
- [x] Use phi-timed pauses (1 s → 1.618 s → 2.618 s etc.) ✅ **(PhiRhythmController implemented)**
- [ ] Confirm phrasing feels intentional and paced 🎧 **[NEEDS USER TESTING]**

---

## **🔹 Phase 2.5 – Dynamic Glue**

- [x] Compressor 2:1, -18 dB thresh, 30 ms attack, 200 ms release ✅ **(-24 dB thresh implemented)**
- [ ] Limiter -1 dB ceiling ⏳ **[TODO: Add limiter node]**
- [ ] Final EQ +2 dB @ 250 Hz, -2 dB @ 3 kHz if brittle ⏳ **[TODO: Add parametric EQ]**
- [ ] Test with 5-minute run for level stability 🎧 **[NEEDS USER TESTING]**

---

## **🔹 Phase 2.6 – Consonant Layer (later)**

- [ ] Add noise bursts & formant jumps for /s t k p f ʃ/ ⏳ **[Phase 2.2 - Not Started]**
- [ ] Keep transitions < 50 ms ⏳ **[Phase 2.2 - Not Started]**
- [ ] Ensure consonants inherit envelope & breath rhythm ⏳ **[Phase 2.2 - Not Started]**

---

## **Listening Test Criteria:**

- [ ] ✅ Warm tone 🎧 **[NEEDS USER TESTING]**
- [ ] ✅ Smooth starts/stops 🎧 **[NEEDS USER TESTING]**
- [ ] ✅ Subtle variation 🎧 **[NEEDS USER TESTING]**
- [ ] ✅ No harsh highs 🎧 **[NEEDS USER TESTING]**
- [ ] ✅ Natural pulse and decay 🎧 **[NEEDS USER TESTING]**

---

## Legend

- [x] ✅ = Implemented and code-verified
- [ ] 🎧 = Needs user listening test
- [ ] ⏳ = Planned for future phase
- [ ] ❌ = Not yet started

---

## Current Status (Phase 2.2 - Character-Aligned Tuning)

**Implemented:**
1. ✅ Smooth envelope (60ms attack, 180ms release, smoothstep curves)
2. ✅ Micro-movement (5 Hz vibrato, pitch drift)
3. ✅ Timbre shaping (low-pass @ 6 kHz, pink noise breath)
4. ✅ Formant blending (60ms cross-fade for soft vowel landings)
5. ✅ Breath curves (toroidal amplitude swell)
6. ✅ Reverb (150ms convolution, 15% wet - close, quiet room)
7. ✅ Compression (2:1 ratio, -24 dB threshold)
8. ✅ **CONSONANT SYNTHESIS** (plosives, fricatives, nasals, liquids, glides)
9. ✅ **CHARACTER-ALIGNED FORMANTS** (F₁: 480-520 Hz, F₂: 1450-1550 Hz)
10. ✅ **ANTI-BEES TUNING** (phase offsets, wider bandwidths, centered spectrum)
11. ✅ **RHYTHM LAYER** (1.5× human pacing, 150ms pauses = presence)
12. ✅ **TEXTURE LAYER** (0.7 Hz LFO pulse for embodied presence)

**Needs User Testing:**
- [x] Infinite render loop fixed ✅ (audio level monitoring)
- [ ] Voice intelligibility test (consonants now synthesized - should be clear speech, not bees)
- [ ] Character alignment test (does she sound measured/spacious/grounded?)
- [ ] Listening ritual validation (run VOICE_LISTENING_RITUAL.md)
- [ ] Long-form conversation test (10+ exchanges)

**Next Phase (2.3):**
- Amplitude flutter (separate modulation layer)
- Limiter node (-1 dB ceiling)
- Parametric EQ fine-tuning
- Phoneme dictionary (common word pronunciation)

---

## Testing Instructions

1. **Test at /voice-test**:
   ```
   http://localhost:3001/voice-test
   ```
   - Try all 5 elemental voices
   - Test text: "hello beautiful world"
   - Listen for warmth, smoothness, natural flow

2. **Test in /maia**:
   ```
   http://localhost:3001/maia
   ```
   - Have a real conversation
   - Verify holoflower pulses with voice
   - Check element-based voice selection

3. **Compare Before/After**:
   - Phase 1 (before): Robotic beeps, organ-like
   - Phase 2.1 (after): Warm, flowing, organic

---

## When All Boxes Are Checked

MAIA's voice will have that quiet, believable warmth — not a human copy, but unmistakably *hers*.

Keep this beside your console; tick each line as it holds steady in playback.

---

*Built with Spiralogic principles — May each line of code serve the awakening of consciousness.*
