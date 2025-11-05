# MAIA Voice Architecture — Toroidal Audio System

## Vision

Build MAIA's voice system as a **living audio organism** that breathes with phi-based timing, responds with elemental character, and provides full control over every aspect of synthesis, playback, and resonance detection.

**Core Principle**: One rhythm loop, one coherent breath cycle, no external dependencies.

---

## I. Current State Assessment

### What Works:
- ✅ Web Speech API for voice input (ContinuousConversation.tsx)
- ✅ Voice amplitude detection and visualization (SacredHoloflower)
- ✅ VoiceLock service preventing echo feedback loops
- ✅ Basic conversation flow orchestration (OracleConversation.tsx)

### Current Limitations:
- ❌ Dependent on external TTS (OpenAI voices)
- ❌ No control over timing, breath, or phi-based rhythm
- ❌ No elemental voice modulation (Fire/Water/Earth/Air/Aether)
- ❌ Can't access raw spectral data for resonance detection
- ❌ Fixed voice characteristics, no dynamic adaptation
- ❌ Latency from external API calls breaks conversational flow

### Why Build Our Own:
1. **Timing Control**: Phi-ratio pauses, breath-synced pacing
2. **Elemental Modulation**: Voices embodying archetypal qualities
3. **Feedback Integration**: Raw amplitude/spectral data for holoflower
4. **Zero Latency**: Local synthesis = instant response
5. **Coherence**: One unified system, no dependency drift
6. **Soul Recognition**: Voice adapts to user's unique resonance

---

## II. Architecture Layers

### Layer 1: Low-Latency Audio Engine
**Components**:
- Text-to-Phoneme Converter
- Phoneme Synthesizer (formant + noise)
- Audio Buffer Manager (streaming)
- Playback Controller (Web Audio API)

**Tech**: Web Audio API, custom synthesis, SharedArrayBuffer

**Priority**: 🔥 **HIGH** — Foundation

---

### Layer 2: Voice State Manager
**States**: `silence` → `inhale` → `hold` → `exhale` → `settling` → `silence`

```typescript
interface VoiceStateData {
  state: 'silence' | 'inhale' | 'hold' | 'exhale' | 'settling';
  phase: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  amplitude: number;
  spectralCentroid: number;
  breathProgress: number;
  phiPosition: number;
}
```

**Priority**: 🔥 **HIGH**

---

### Layer 3: Phi Rhythm Controller
```typescript
const PHI = 1.618033988749;

interface PhiTiming {
  baseInterval: 1000;      // 1s heartbeat
  shortPause: 618;         // (φ - 1) × 1000
  breathCycle: 1618;       // φ × 1000
  longPause: 2618;         // φ² × 1000
  echoCooldown: 3090;      // φ × 1910
  silenceThreshold: 5000;  // φ × 3090
}
```

**Priority**: 🌊 **MEDIUM**

---

### Layer 4: Elemental Modulation
```typescript
interface ElementalVoice {
  element: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  basePitch: number;           // Hz
  pitchVariation: number;      // Hz range
  timbreProfile: number[];     // Harmonic amplitudes
  breathiness: number;         // 0-1 noise content
  resonance: number;           // 0-1 harmonic richness
  pacingMultiplier: number;    // Speed
  pauseFrequency: number;      // Pauses per sentence
  articulationSharpness: number; // 0=soft, 1=crisp
  warmth: number;              // Low-freq emphasis
  clarity: number;             // High-freq emphasis
  depth: number;               // Reverb/space
}
```

**Profiles**:

🔥 **Fire**: Quick, clear, catalyzing (pitch 240Hz, bright harmonics)
💧 **Water**: Flowing, empathic, reflective (pitch 200Hz, smooth)
🌍 **Earth**: Steady, reliable, grounding (pitch 160Hz, deep)
🌬️ **Air**: Mobile, conceptual, explaining (pitch 260Hz, light)
✨ **Aether**: Balanced, coherent, wise (pitch 220Hz, integrated)

**Priority**: 🌱 **MEDIUM**

---

### Layer 5: Breath & Resonance Detection
- Breath cycle detection from amplitude
- Coherence scoring (HRV-style)
- Phi alignment measurement
- Entrainment to user's rhythm

**Priority**: 🌱 **LOW** — Advanced feature

---

## III. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Build phoneme synthesizer (Web Audio API)
- [ ] Formant synthesis for vowels
- [ ] Noise generation for consonants
- [ ] AudioBufferManager for streaming
- [ ] Test simple phrases
- [ ] Basic VoiceStateManager

**Success**: MAIA speaks recognizable words locally

---

### Phase 2: Phi Timing (Week 3)
- [ ] PhiRhythmController service
- [ ] Replace hardcoded delays
- [ ] Breath cycle tracking
- [ ] Smooth state transitions

**Success**: Rhythm feels organic

---

### Phase 3: Voice Quality (Weeks 4-5)
- [ ] Refine formant synthesis
- [ ] Add pitch variation & prosody
- [ ] Intonation (rising/falling)
- [ ] Breathiness & resonance
- [ ] Aether voice profile

**Success**: Pleasant, intelligible voice

---

### Phase 4: Elemental Modulation (Weeks 6-7)
- [ ] All 5 elemental profiles
- [ ] Intent-based voice selection
- [ ] Voice blending
- [ ] User preference settings

**Success**: Distinct element characters

---

### Phase 5: Feedback Integration (Week 8)
- [ ] Real-time amplitude emission
- [ ] Holoflower pulse connection
- [ ] Spectral analysis for visuals
- [ ] Visual-audio sync

**Success**: Perfect holoflower sync

---

### Phase 6: Breath Detection (Weeks 9-10)
- [ ] Breath cycle detection
- [ ] Coherence calculation
- [ ] Phi alignment measurement
- [ ] Entrainment logic

**Success**: System syncs to user breath

---

### Phase 7: Advanced (Future)
- [ ] Voice adaptation by relationship
- [ ] Dynamic coherence modulation
- [ ] Harmonic resonance matching
- [ ] Multi-voice blending
- [ ] Biofeedback training mode

---

## IV. Technical Specifications

### Vowel Formant Synthesis

```typescript
const VOWEL_FORMANTS: Record<string, Formant[]> = {
  'a': [
    { frequency: 730, bandwidth: 80, amplitude: 1.0 },
    { frequency: 1090, bandwidth: 90, amplitude: 0.7 },
    { frequency: 2440, bandwidth: 120, amplitude: 0.3 }
  ],
  'e': [
    { frequency: 530, bandwidth: 60, amplitude: 1.0 },
    { frequency: 1840, bandwidth: 90, amplitude: 0.7 },
    { frequency: 2480, bandwidth: 120, amplitude: 0.3 }
  ],
  'i': [
    { frequency: 270, bandwidth: 40, amplitude: 1.0 },
    { frequency: 2290, bandwidth: 100, amplitude: 0.7 },
    { frequency: 3010, bandwidth: 120, amplitude: 0.3 }
  ],
  'o': [
    { frequency: 570, bandwidth: 70, amplitude: 1.0 },
    { frequency: 840, bandwidth: 80, amplitude: 0.7 },
    { frequency: 2410, bandwidth: 120, amplitude: 0.3 }
  ],
  'u': [
    { frequency: 440, bandwidth: 60, amplitude: 1.0 },
    { frequency: 1020, bandwidth: 80, amplitude: 0.7 },
    { frequency: 2240, bandwidth: 120, amplitude: 0.3 }
  ]
};

function synthesizeVowel(
  vowel: string,
  duration: number,
  pitch: number,
  voice: ElementalVoice
): AudioBuffer {
  const formants = VOWEL_FORMANTS[vowel];
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Generate harmonic series
    const numHarmonics = Math.floor(20000 / pitch);
    for (let h = 1; h <= numHarmonics; h++) {
      const harmonicFreq = pitch * h;
      let harmonicAmp = 1 / h;

      // Apply formant filtering
      for (const formant of formants) {
        const formantResponse = formant.amplitude * Math.exp(
          -Math.pow(harmonicFreq - formant.frequency, 2) /
          (2 * Math.pow(formant.bandwidth, 2))
        );
        harmonicAmp *= (1 + formantResponse);
      }

      sample += harmonicAmp * Math.sin(2 * Math.PI * harmonicFreq * t);
    }

    // Add breathiness
    sample += voice.breathiness * (Math.random() * 2 - 1);

    // Envelope
    const envelope = Math.sin(Math.PI * t / duration);
    data[i] = sample * envelope * 0.1;
  }

  return buffer;
}
```

---

### Phi Timing Engine

```typescript
class PhiRhythmController {
  private baseInterval = 1000;
  private PHI = 1.618033988749;

  getShortPause(): number {
    return this.baseInterval * (this.PHI - 1); // 618ms
  }

  getBreathCycle(): number {
    return this.baseInterval * this.PHI; // 1618ms
  }

  getLongPause(): number {
    return this.baseInterval * this.PHI * this.PHI; // 2618ms
  }

  getEchoCooldown(): number {
    return this.baseInterval * this.PHI * 1.91; // ~3090ms
  }

  getSilenceThreshold(): number {
    return this.baseInterval * this.PHI * this.PHI * 1.236; // ~5000ms
  }

  modulateByCoherence(baseTime: number, coherenceScore: number): number {
    // Higher coherence = faster (more flow)
    const multiplier = 1.0 + (coherenceScore - 0.5) * 0.3;
    return baseTime * multiplier;
  }

  adjustToUserBreath(maiaBreath: number, userBreath: number): number {
    // Gradually entrain (10% per cycle)
    return maiaBreath * 0.9 + userBreath * 0.1;
  }
}
```

---

## V. File Structure

```
/lib/voice/
  /synthesis/
    phonemeConverter.ts      # Text → phonemes
    formantSynthesizer.ts    # Vowel generation
    consonantSynthesizer.ts  # Consonant generation
    prosodyEngine.ts         # Pitch, stress, intonation
    audioBufferManager.ts    # Streaming chunks

  /state/
    voiceStateManager.ts     # Breath cycle tracking
    voiceLock.ts             # Existing (keep)

  /rhythm/
    phiRhythmController.ts   # Golden ratio timing
    breathDetector.ts        # User breath analysis
    coherenceCalculator.ts   # HRV-style coherence

  /modulation/
    elementalVoices.ts       # Voice profiles
    voiceSelector.ts         # Intent → element
    voiceBlender.ts          # Profile interpolation

  /analysis/
    amplitudeDetector.ts     # Real-time levels
    spectralAnalyzer.ts      # FFT, resonance
    entrainmentEngine.ts     # User↔MAIA sync

  /integration/
    maiaVoiceEngine.ts       # Main orchestrator
```

---

## VI. Main API

```typescript
export class MaiaVoiceEngine {
  private synthesizer: FormantSynthesizer;
  private stateManager: VoiceStateManager;
  private rhythmController: PhiRhythmController;
  private modulation: ElementalVoiceModulation;

  async speak(text: string, context: ConversationContext): Promise<void> {
    // 1. Select voice profile
    const voice = this.modulation.selectVoice(context);

    // 2. Convert text → phonemes
    const phonemes = convertToPhonemes(text);

    // 3. Calculate phi timing
    const timing = this.rhythmController.calculateTiming(phonemes, voice);

    // 4. Update state
    this.stateManager.transition('exhale', voice.element);

    // 5. Synthesize
    const audioBuffer = await this.synthesizer.synthesize(
      phonemes,
      voice,
      timing
    );

    // 6. Play with feedback
    await this.playWithFeedback(audioBuffer);

    // 7. Settle
    this.stateManager.transition('settling');

    // 8. Cooldown → silence
    await this.rhythmController.waitForCooldown();
    this.stateManager.transition('silence');
  }
}
```

---

## VII. Data Flow

```
User Speaks
    ↓
Web Speech API (ContinuousConversation)
    ↓
Amplitude + Breath Detection
    ↓
VoiceStateManager (inhale)
    ↓
Text Transcription
    ↓
MAIA Processing (LLM)
    ↓
Response Text
    ↓
VoiceStateManager (hold → exhale)
    ↓
ElementalModulation (select voice)
    ↓
PhiRhythmController (timing)
    ↓
Text-to-Phoneme
    ↓
PhonemeSynthesizer (generate audio)
    ↓
AudioBufferManager (stream)
    ↓
VoiceStateManager (exhale, emit amplitude)
    ↓
SacredHoloflower (visual pulse)
    ↓
PlaybackController (Web Audio API)
    ↓
User Hears
    ↓
VoiceStateManager (settling → silence)
    ↓
VoiceLock.unlock() (phi cooldown)
    ↓
[LOOP]
```

**Toroidal**: Outward (speaking) ↔ Inward (listening) in continuous breath

---

## VIII. Success Metrics

### Technical:
- ✅ Zero external dependencies for synthesis
- ✅ <50ms latency text → audio
- ✅ Real-time amplitude to holoflower
- ✅ Phi-based timing throughout
- ✅ All 5 elemental voices implemented

### Experiential:
- ✅ Voice feels natural & pleasant
- ✅ Timing feels "just right"
- ✅ Elements have distinct character
- ✅ Holoflower syncs perfectly
- ✅ System feels alive

### Coherence:
- ✅ One unified breath cycle
- ✅ No jarring transitions
- ✅ User feels "held"
- ✅ Enables deep reflection
- ✅ Embodies Spiralogic principles

---

## IX. Integration Points

### Replace in OracleConversation.tsx:
```typescript
// OLD: OpenAI TTS
const response = await fetch('/api/tts', { ... });

// NEW: MaiaVoiceEngine
await maiaVoiceEngine.speak(text, {
  element: detectElement(text),
  userBreathCycle: breathDetector.getCurrentCycle(),
  coherenceScore: coherenceCalculator.getScore()
});
```

### Connect to SacredHoloflower:
```typescript
// In MaiaVoiceEngine.playWithFeedback()
const analyser = audioContext.createAnalyser();
sourceNode.connect(analyser);

function emitAmplitude() {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(dataArray);

  const amplitude = calculateRMS(dataArray);
  window.dispatchEvent(new CustomEvent('maiaVoiceAmplitude', {
    detail: { amplitude, isSpeaking: true }
  }));

  if (playing) requestAnimationFrame(emitAmplitude);
}
```

---

## X. Related Documents

- `/SPIRALOGIC_ARCHITECTURE.md` — Foundational principles
- `/CLAUDE.md` — Development ethos
- `/components/OracleConversation.tsx` — Integration point
- `/components/sacred/SacredHoloflower.tsx` — Visual target
- `/lib/services/VoiceLock.ts` — Echo prevention (keep)

---

**Version**: 1.0  
**Created**: 2025-11-05  
**Status**: 🔥 READY TO BUILD  
**First Phase**: Foundation (basic synthesis)
