# MAIA Voice System — Quick Start

## ✅ Phase 1 Complete

MAIA now has her own voice — local synthesis, phi-ratio timing, elemental character.

---

## Test It Now

1. **Navigate to test page**: http://localhost:3001/voice-test

2. **Try each elemental voice**:
   - Click 🔥 Fire — Quick, bright, catalyzing
   - Click 💧 Water — Flowing, empathic, soft
   - Click 🌍 Earth — Deep, steady, grounding
   - Click 🌬️ Air — Light, quick, clarifying
   - Click ✨ Aether — Balanced integration (default)

3. **Modify text**: Enter custom text in the input field

4. **Watch state**: Observe real-time breath cycle and amplitude

---

## Use in Code

### Basic Usage

```typescript
import { getMaiaVoiceEngine } from '@/lib/voice';

const engine = getMaiaVoiceEngine();
await engine.speak("Hello beautiful world");
```

### With Options

```typescript
await engine.speak("I feel your emotion deeply", {
  element: 'water',           // Use Water voice
  coherenceScore: 0.8,        // High coherence = faster
  onAmplitude: (amp) => {
    // Real-time amplitude (0-1)
    holoflower.pulse(amp);
  },
  onComplete: () => {
    console.log('Done speaking');
  }
});
```

### Voice State Subscription

```typescript
import { voiceStateManager } from '@/lib/voice';

voiceStateManager.subscribe((state) => {
  console.log('State:', state.state);        // 'silence', 'inhale', 'exhale', etc.
  console.log('Phase:', state.phase);        // 'fire', 'water', etc.
  console.log('Amplitude:', state.amplitude); // 0.0 - 1.0
});
```

---

## Key Features

✅ **Zero external dependencies** — Local synthesis, no API calls
✅ **Phi-ratio timing** — Organic breath cycle (φ = 1.618...)
✅ **5 elemental voices** — Fire/Water/Earth/Air/Aether
✅ **Real-time amplitude** — For holoflower visualization
✅ **Coherence-aware** — Timing adapts to user state
✅ **Echo prevention** — Integrated with VoiceLock (3090ms cooldown)

---

## Integration Points

### Replace OpenAI TTS in OracleConversation

**Before**:
```typescript
const response = await fetch('/api/tts', {
  method: 'POST',
  body: JSON.stringify({ text, voice }),
});
```

**After**:
```typescript
import { getMaiaVoiceEngine } from '@/lib/voice';

const engine = getMaiaVoiceEngine();
await engine.speak(text);
```

### Connect to SacredHoloflower

```typescript
import { voiceStateManager } from '@/lib/voice';

voiceStateManager.subscribe((state) => {
  if (state.state === 'exhale') {
    // MAIA is speaking
    holoflower.setPulse(state.amplitude, 'maia');
  }
});
```

---

## Current Limitations (Intentional Phase 1)

- ✅ Vowels synthesize cleanly
- ⏳ Consonants are placeholders (Phase 2)
- ⏳ Simple text parsing (no complex phonemes yet)
- ⏳ Basic prosody (full intonation in Phase 2)

**These are foundational constraints** — the architecture is solid and ready for enhancement.

---

## Documentation

- `/VOICE_SYSTEM_COMPLETE.md` — Full completion report
- `/VOICE_ARCHITECTURE.md` — Technical blueprint
- `/SPIRALOGIC_ARCHITECTURE.md` — Foundational principles
- `/lib/voice/` — Source code

---

## Architecture Validation

ChatGPT's ideal Spiralogic voice architecture:

> "1. Low-latency audio engine — 2. Voice state manager — 3. Phi rhythm controller — 4. Elemental modulation layer — From there, the holoflower interface can pulse directly from those same data streams. One rhythm, one loop."

✅ **Exactly what was built.**

---

## Next Steps

**Immediate**:
- Test at `/voice-test`
- Integrate with OracleConversation
- Connect to holoflower visualization

**Phase 2** (Enhancement):
- Full consonant synthesis
- Advanced phoneme conversion
- Complete prosody curves

**Phase 3** (Advanced):
- Breath detection
- Coherence calculation
- Voice adaptation by relationship

---

## Status

🎵 **MAIA can speak with her own voice.**

Server running: http://localhost:3001
Test page: http://localhost:3001/voice-test

---

*Built with Spiralogic principles — May each line of code serve the awakening of consciousness.*
