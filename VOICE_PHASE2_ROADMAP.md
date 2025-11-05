# MAIA Voice System — Phase 2 Roadmap

## Phase 1 Status: ✅ Complete

**What Was Built:**
- ✅ Complete architecture (phi timing, elemental voices, state management)
- ✅ Formant synthesis engine (Web Audio API)
- ✅ Voice state manager (breath cycle tracking)
- ✅ Phi rhythm controller (golden ratio timing)
- ✅ 5 elemental voice profiles
- ✅ Integration layer (MaiaVoiceEngine)
- ✅ Test interface (`/voice-test`)

**Current State:**
Phase 1 provides **foundational architecture** with basic vowel synthesis. The system works as designed but produces simple electronic tones suitable for proof-of-concept and architectural validation.

---

## Phase 2 Goals: Natural Speech Quality

Transform electronic tones → organic, speech-like voice

### 2.1 Consonant Synthesis (Priority 1)

**Current:** Consonants are silent placeholders
**Goal:** Full consonant synthesis with accurate phonetic character

**Consonant Types to Implement:**

1. **Plosives** (stops): /p/, /b/, /t/, /d/, /k/, /g/
   - Technique: Brief silence → burst of noise
   - Example: "tap" = /t/ (silence + burst) + /a/ (vowel) + /p/ (burst)

2. **Fricatives**: /f/, /v/, /s/, /z/, /ʃ/ (sh), /ʒ/ (zh), /θ/ (th), /ð/ (th voiced), /h/
   - Technique: Filtered noise (different frequency bands for each)
   - Example: "see" = /s/ (high-freq noise) + /i/ (vowel)

3. **Nasals**: /m/, /n/, /ŋ/ (ng)
   - Technique: Low formants + nasal resonance
   - Example: "moon" = /m/ (nasal) + /u/ (vowel) + /n/ (nasal)

4. **Liquids**: /l/, /r/
   - Technique: Vowel-like with specific formant patterns
   - Example: "real" = /r/ + /i/ + /l/

5. **Glides (Semivowels)**: /w/, /j/ (y)
   - Technique: Rapid formant transitions
   - Example: "yes" = /j/ (glide) + /e/ (vowel) + /s/ (fricative)

**Implementation Files:**
- `/lib/voice/synthesis/consonantSynthesizer.ts` (new)
- Update `/lib/voice/synthesis/phonemeConverter.ts` (better mapping)

**Estimated Time:** 3-4 hours

---

### 2.2 Advanced Phoneme Conversion (Priority 2)

**Current:** Simple character-by-character parsing
**Goal:** Proper grapheme-to-phoneme conversion with phonetic rules

**Features:**

1. **Phoneme Dictionary:**
   - Common word → phoneme mappings
   - Example: "the" → /ð/ /ə/ (not /t/ /h/ /e/)
   - Start with ~1000 most common English words

2. **Pronunciation Rules:**
   - Silent letters: "knight" → /n/ /aɪ/ /t/ (not /k/ /n/ /i/ /g/ /h/ /t/)
   - Vowel combinations: "ea" in "meat" vs "great"
   - Context-dependent: "c" as /s/ (city) vs /k/ (cat)

3. **Stress & Syllable Detection:**
   - Mark primary/secondary stress
   - Example: "telephone" → ˈte-lə-ˌfəʊn (stress on first syllable)

**Implementation:**
- `/lib/voice/synthesis/phonemeDictionary.ts` (new)
- `/lib/voice/synthesis/pronunciationRules.ts` (new)
- Update `/lib/voice/synthesis/phonemeConverter.ts`

**Estimated Time:** 4-5 hours

---

### 2.3 Natural Prosody & Intonation (Priority 3)

**Current:** Flat pitch, abrupt transitions
**Goal:** Natural speech melody with smooth transitions

**Features:**

1. **Pitch Contours:**
   - Rising intonation for questions: "Are you here?" ↗
   - Falling intonation for statements: "I am here." ↘
   - Emphasis patterns: "I LOVE this" (stress on "love")

2. **Smooth Transitions:**
   - Crossfade between phonemes (eliminate clicks/pops)
   - Coarticulation: phonemes blend into each other
   - Example: "moon" - /m/ gradually transitions into /u/

3. **Natural Timing:**
   - Vary phoneme duration based on context
   - Pauses at natural boundaries (commas, periods, phrases)
   - Stress lengthens vowels: "beeeautiful"

4. **Vibrato & Warmth:**
   - Subtle pitch oscillation (5-8 Hz, ±0.5 semitones)
   - Adds human quality to sustained vowels

**Implementation:**
- `/lib/voice/prosody/intonationEngine.ts` (new)
- `/lib/voice/prosody/transitionSmoother.ts` (new)
- Update `/lib/voice/synthesis/formantSynthesizer.ts`

**Estimated Time:** 3-4 hours

---

### 2.4 Audio Quality Enhancements (Priority 4)

**Current:** Raw synthesis with harsh harmonics
**Goal:** Polished, warm, organic sound

**Improvements:**

1. **Better Envelope Shaping:**
   - Replace simple sine envelope with realistic ADSR
   - Attack: 5-20ms (soft onset)
   - Decay: 20-50ms (initial drop)
   - Sustain: stable plateau
   - Release: 30-100ms (gentle fade)

2. **Harmonic Filtering:**
   - Low-pass filter to reduce high-frequency harshness
   - Formant bandwidth shaping (more natural resonance)
   - Reduce aliasing artifacts

3. **Dynamic Breathiness:**
   - Add subtle noise throughout (not just at boundaries)
   - Vary breathiness by phoneme type
   - Aspirated consonants: more breath
   - Vowels: minimal breath

4. **Volume Normalization:**
   - Consistent loudness across phonemes
   - Prevent clipping
   - Dynamic range compression

**Implementation:**
- Update `/lib/voice/synthesis/formantSynthesizer.ts`
- `/lib/voice/synthesis/audioProcessor.ts` (new - for filtering/effects)

**Estimated Time:** 2-3 hours

---

## Phase 2 Implementation Plan

### Week 1: Core Consonants & Better Phonemes
- [ ] Day 1-2: Build consonant synthesizer (plosives, fricatives, nasals)
- [ ] Day 3-4: Phoneme dictionary (1000 common words)
- [ ] Day 5: Pronunciation rules engine
- [ ] Day 6-7: Integration & testing

### Week 2: Prosody & Polish
- [ ] Day 1-2: Intonation engine (pitch contours)
- [ ] Day 3-4: Smooth transitions & coarticulation
- [ ] Day 5: Audio quality enhancements (ADSR, filtering)
- [ ] Day 6-7: Testing & refinement

**Total Estimated Time:** 12-16 hours of focused development

---

## Success Criteria

Phase 2 is complete when:

✅ All English phonemes synthesize recognizably
✅ Common words sound intelligible (80%+ recognition)
✅ Natural intonation (questions rise, statements fall)
✅ Smooth transitions between sounds (no clicks/pops)
✅ Warm, organic quality (not robotic/beepy)
✅ Consistent volume and clarity
✅ Elemental voice character preserved (Fire still sounds bright, Water still sounds flowing, etc.)

---

## Phase 3 Preview: Advanced Features

*Future enhancements beyond Phase 2:*

- Emotional prosody (excitement, calm, urgency)
- Adaptive pacing based on conversation context
- Real-time breath detection from user audio
- Coherence calculation from biometric data
- Voice learning: adapt to user's preferred pacing/tone
- Harmonic resonance matching with user's voice
- Multi-voice blending (e.g., 70% Water + 30% Earth)

---

## Current Status

**Phase 1:** ✅ Complete (foundational architecture)
**Phase 2:** 📋 Planned (this document)
**Phase 3:** 🔮 Future vision

**Next Immediate Steps:**
1. Integrate Phase 1 voice with OracleConversation (replace OpenAI TTS)
2. Connect to SacredHoloflower for visualization
3. Test in real conversations (accept Phase 1 limitations)
4. Begin Phase 2 development (consonants first)

---

*Built with Spiralogic principles — May each line of code serve the awakening of consciousness.*
