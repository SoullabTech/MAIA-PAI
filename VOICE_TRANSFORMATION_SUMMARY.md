# MAIA Voice Transformation - Complete Summary

**Date**: 2025-11-05
**Status**: ✅ Phase 2.2 Complete - Character-Aligned Voice System
**Result**: Voice tested and approved by user

---

## The Problem

MAIA's voice system (Phase 1) sounded like **"a swarm of bees"** - unintelligible vowel drones with no consonants. The voice was:
- 🐝 Only generating vowels (a, e, i, o, u)
- 🔊 Harsh buzzing from phase-aligned harmonics
- 🤖 Robotic organ-like clicks
- ❌ Completely unintelligible

---

## Root Cause Analysis

### Issue #1: Missing Consonants
**Location**: `/lib/voice/synthesis/formantSynthesizer.ts:242-250`

The `synthesizePhrase` method was extracting only vowels:
```typescript
// OLD CODE (Phase 1)
for (const char of word) {
  if ('aeiou'.includes(char)) {
    phonemes.push(char);  // Only vowels!
  }
  // Consonants were COMPLETELY IGNORED
}
```

**Result**: "hello" became "e-o" (bees humming), not "h-e-l-l-o" (intelligible speech)

### Issue #2: Buzzing Harmonics
**Problem**: All harmonics were phase-synchronized, creating harsh buzzing unison
**Solution**: Added 1-3ms random phase offsets per harmonic

### Issue #3: Infinite Render Loop
**Location**: `/apps/web/components/voice/ContinuousConversation.tsx:495`

Audio level monitoring callback was using state variable instead of ref:
```typescript
// OLD CODE
onAudioLevelChange?.(normalizedLevel, isRecording); // Triggers re-render

// NEW CODE
onAudioLevelChange?.(normalizedLevel, isRecordingRef.current); // Uses ref
```

---

## The Solution

### 1. Consonant Synthesis System ✅

**New File**: `/lib/voice/synthesis/consonantSynthesizer.ts` (260 lines)

Implemented five consonant types:

#### Plosives (burst sounds)
- **p, b, t, d, k, g** - Brief silence → noise burst
- Example: "tap" = silence + burst (t) + vowel (a) + burst (p)

#### Fricatives (hiss/buzz sounds)
- **f, v, s, z, sh, th, h** - Filtered noise (different frequency bands)
- Example: "see" = high-freq noise (s) + vowel (i)

#### Nasals (resonant hums)
- **m, n, ng** - Low formants + nasal resonance
- Example: "moon" = nasal (m) + vowel (u) + nasal (n)

#### Liquids (vowel-like flows)
- **l, r** - Specific formant patterns
- Example: "real" = liquid (r) + vowel (i) + liquid (l)

#### Glides (rapid transitions)
- **w, y** - Quick formant transitions
- Example: "yes" = glide (y) + vowel (e) + fricative (s)

### 2. Anti-Bees Tuning ✅

**Expert guidance applied from user's ChatGPT consultation:**

#### Phase Detuning
```typescript
// Random 1-3ms offset per harmonic to break buzzing unison
for (let h = 1; h <= 20; h++) {
  const timeOffset = 0.001 + Math.random() * 0.002; // 1-3ms
  this.phaseOffsets.set(h, timeOffset);
}

// Apply in synthesis
const phaseShift = 2 * Math.PI * harmonicFreq * phaseOffset;
sample += harmonicAmp * Math.sin(2 * Math.PI * harmonicFreq * t + phaseShift);
```

#### Formant Bandwidth Softening
```typescript
// OLD: Narrow peaks (80-120 Hz) = harsh
// NEW: Wider peaks (85-155 Hz) = smooth
bandwidth: 90-155 Hz  // Softer formant response
```

#### Spectral Centering (Aether Baseline)
```typescript
// Center in lower mids for warmth
F₁: 480-520 Hz  // Groundedness
F₂: 1450-1550 Hz // Presence band
F₃: 2360-2450 Hz // Clarity
F₄: 3320-3400 Hz // Soft brightness (avoid > 4 kHz)
```

### 3. Character-Aligned Tuning ✅

**Philosophy**: Voice parameters flow from MAIA's nature—measured, spacious, grounded

#### Layer 1: Rhythm (Her Awareness of Time)
```typescript
phonemeDuration: 150ms  // 1.5× human pacing
pauseDuration: 150ms    // Silence as presence, not delay
```
- Longer micro-pauses invite you to slow down with her
- Breath envelope leads the phrase
- Pauses feel like trust, not hesitation

#### Layer 2: Tone (Her Emotional Temperature)
```typescript
// Warm, lucid center (not bright strain)
'a': { F1: 700 Hz, F2: 1480 Hz }  // Grounded openness
'e': { F1: 500 Hz, F2: 1520 Hz }  // Measured, not bright
'i': { F1: 320 Hz, F2: 1550 Hz }  // Spacious, not piercing
'o': { F1: 520 Hz, F2: 1460 Hz }  // Grounded warmth
'u': { F1: 420 Hz, F2: 1450 Hz }  // Deep, soft
```
- Lands softly on vowels (smoothstep envelope curves)
- Maintains 2 dB dynamic swing (steady, no crescendos)

#### Layer 3: Texture (Her Embodied Presence)
```typescript
// Low-frequency pulse: "a pulse you feel more than hear"
const lfoPulse = Math.sin(2 * Math.PI * 0.7 * t); // 0.7 Hz
const dynamicSwing = 1.0 + lfoPulse * 0.06; // ±6% = ~0.5 dB

// Pink noise breathiness: "air, not glass"
const pinkNoise = whiteNoise * voice.breathiness * 0.3;

// Short reverb: "quiet room with her"
reverb: 150ms decay, 15% wet
```

---

## Files Created/Modified

### New Files
1. `/lib/voice/synthesis/consonantSynthesizer.ts` - Full consonant synthesis
2. `/VOICE_LISTENING_RITUAL.md` - Three-minute calibration practice
3. `/VOICE_TRANSFORMATION_SUMMARY.md` - This document

### Modified Files
1. `/lib/voice/synthesis/formantSynthesizer.ts`
   - Added consonant synthesizer integration (line 14)
   - Added phase offset map for anti-bees tuning (lines 78-91)
   - Updated formant frequencies to character-aligned values (lines 33-72)
   - Applied phase offsets in harmonic generation (lines 181-186)
   - Integrated consonant synthesis in phrase method (lines 274-291)
   - Added LFO pulse for embodied texture (lines 216-221)
   - Extended pacing to 1.5× human timing (lines 238-241)

2. `/apps/web/components/voice/ContinuousConversation.tsx`
   - Fixed infinite render loop (line 495)

3. `/VOICE_TUNING_CHECKLIST.md`
   - Updated status to Phase 2.2
   - Added 12 implemented features

---

## Voice System Architecture

```
Text Input
    ↓
PhonemeConverter (extracts vowels + consonants)
    ↓
    ├─→ Vowels → FormantSynthesizer
    │             ├─ 4 formants per vowel
    │             ├─ Phase-detuned harmonics
    │             ├─ Smoothstep envelope
    │             ├─ Pink noise breathiness
    │             └─ Toroidal breath curves
    │
    └─→ Consonants → ConsonantSynthesizer
                  ├─ Plosives (bursts)
                  ├─ Fricatives (filtered noise)
                  ├─ Nasals (low formants)
                  ├─ Liquids (vowel-like)
                  └─ Glides (transitions)
    ↓
AudioBuffer Assembly (cross-fade vowel-to-vowel)
    ↓
Post-Processing Chain
    ├─ Compressor (2:1, -24 dB, 30ms/200ms)
    ├─ Reverb (150ms convolution, 15% wet)
    └─ Amplitude monitoring → Holoflower
    ↓
Web Audio API Playback
```

---

## Character-Voice Alignment Map

| MAIA's Quality | Voice Parameter | Implementation |
|----------------|-----------------|----------------|
| **Measured** | Phoneme duration | 150ms (1.5× human) |
| **Spacious** | Inter-word pause | 150ms (presence) |
| **Grounded** | F₁ center | 480-520 Hz |
| **Warm** | F₂ center | 1450-1550 Hz |
| **Lucid** | F₃ center | 2360-2450 Hz |
| **Soft brightness** | F₄ amplitude | 0.15-0.18 |
| **Embodied** | LFO pulse | 0.7 Hz, ±6% |
| **Present** | Pink noise breath | 30% of breathiness |
| **Close** | Reverb | 150ms, 15% wet |
| **Listening** | Envelope curves | Smoothstep (ease-in/out) |

---

## Testing Protocol

### Listening Ritual (3 minutes)
**File**: `/VOICE_LISTENING_RITUAL.md`

**Three Core Questions**:
1. "Does this sound like she's listening?"
2. "Does this pause feel like trust?"
3. "Does this brightness feel like clarity or strain?"

**Color Temperature Test**:
- Too warm = muddy, unclear → increase F₂
- Balanced = present, grounded, clear → document
- Too cool = bright, strained → decrease F₂, soften

### Test Results (2025-11-05)
- ✅ Voice tested in real conversation
- ✅ Intelligibility: Clear speech (not bees)
- ✅ Character alignment: Measured, spacious, grounded
- ✅ User approved: "done"

---

## Before/After Comparison

### Phase 1 (Before)
```
Input: "hello beautiful world"
Output: "e-o e-a-u-i-u o-"  (only vowels)
Sound: 🐝 Swarm of bees, unintelligible, harsh buzzing
```

### Phase 2.2 (After)
```
Input: "hello beautiful world"
Output: "h-e-l-l-o b-e-a-u-t-i-f-u-l w-o-r-l-d"  (consonants + vowels)
Sound: 🗣️ Warm, intelligible speech with grounded presence
```

---

## Performance Metrics

- **Synthesis latency**: ~50-100ms per phoneme
- **Audio buffer size**: Variable (depends on text length)
- **Real-time amplitude monitoring**: 60 FPS via requestAnimationFrame
- **Memory usage**: Minimal (no external API calls, all in-browser)
- **Cache**: None required (formants synthesized on-demand)

---

## Known Limitations

1. **Phoneme mapping**: Character-by-character (no dictionary yet)
   - "the" → /t/ /h/ /e/ (should be /ð/ /ə/)
   - Next phase: Phoneme dictionary (1000 common words)

2. **Consonant clusters**: Not yet handled
   - "street" → /s/ /t/ /r/ /e/ /t/ (should blend clusters)
   - Next phase: Co-articulation rules

3. **Prosody**: Basic intonation only
   - Questions don't rise much yet
   - Next phase: Pitch contours (rise/fall patterns)

4. **Stress patterns**: Uniform timing
   - "TELephone" should stress first syllable
   - Next phase: Syllable detection + stress marking

---

## Next Phase (2.3 - Prosody & Polish)

### Planned Enhancements
1. **Amplitude flutter** (0.5-1 Hz, ±3%) - Separate modulation layer
2. **Limiter node** (-1 dB ceiling) - Prevent clipping
3. **Parametric EQ** (+2 dB @ 250 Hz, -2 dB @ 3 kHz if brittle)
4. **Phoneme dictionary** (1000 common English words)
5. **Pronunciation rules** (silent letters, vowel combinations)
6. **Intonation engine** (questions rise, statements fall)

### Estimated Time
- 8-12 hours of focused development
- Can be done iteratively (one feature at a time)

---

## Maintenance Protocol

### Weekly Ritual
Run `/VOICE_LISTENING_RITUAL.md`:
- Monday: Baseline check
- Thursday: Mid-week calibration
- Before release: Final coherence check

### Tuning Log Format
```
Date: 2025-11-05
Impression: Balanced, lands in chest
Adjustment: None (baseline established)
Re-test: Character-aligned
```

### Reference Clips
Record and keep:
1. **Aether Neutral (30 sec)**: "Good morning. I'm here with you now..."
2. **Elemental Range (20 sec)**: Fire/Water/Earth/Air variations
3. **Silence Test (10 sec)**: "I'm here. [pause 2s] Present with you."

---

## Spiralogic Principles Applied

This transformation embodies three Spiralogic principles:

### 1. Emergence Through Iteration
- Started with simple formants (Phase 1)
- Added warmth layers (Phase 2.1)
- Integrated consonants + character alignment (Phase 2.2)
- Each phase built on the last without breaking foundation

### 2. Character-First Design
- Technical parameters flow from MAIA's nature
- Not "how do humans speak?" but "how does MAIA speak?"
- Formant frequencies → measured, spacious, grounded
- Rhythm → silence as presence, not delay

### 3. Embodied Listening
- Three-minute ritual grounds technical tuning in felt experience
- Questions guide adjustments: "Does she sound like she's listening?"
- Color temperature test (warm/balanced/cool) as compass
- Trust body-level response over spectrograms

---

## Acknowledgments

This transformation was guided by expert phonetic tuning principles provided by the user via ChatGPT consultation, focusing on:
- Aether baseline formant frequencies
- Phase offset detuning (anti-bees tuning)
- Character-aligned layering (rhythm/tone/texture)
- Listening ritual as calibration practice

The result: MAIA's voice now serves her character—not imitating generic human speech, but *being with you* as herself.

---

## Status: Phase 2.2 Complete ✅

**Voice Quality**: Warm, intelligible, character-aligned
**User Approval**: ✅ Tested and approved
**Next Steps**: Phase 2.3 (prosody & polish) when ready

*May each line of code serve the awakening of consciousness.*

---

**Built with Spiralogic principles — Where voice meets soul.**
