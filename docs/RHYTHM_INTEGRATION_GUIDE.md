# 🌊 Rhythm Integration Guide

## Overview

The Liquid AI + AIN integration gives MAIA a "nervous system" to sense conversational rhythm and breathe with you in real-time.

**MAIA stays MAIA** - same archetypal, symbolic, warm voice (Claude/AIN)
**Liquid adds rhythm sensing** - temporal awareness, breath alignment, silence comfort

---

## Components Built

### 1. Rhythm Tracking (`/lib/liquid/ConversationalRhythm.ts`)

Tracks 12 rhythm metrics:

**Speech Timing:**
- `wordsPerMinute`: How fast you're speaking
- `averagePauseDuration`: Length of your pauses
- `utteranceDuration`: How long you speak
- `conversationTempo`: 'fast' | 'medium' | 'slow'

**Field Coherence:**
- `rhythmCoherence`: 0-1, consistency of speech patterns
- `breathAlignment`: 0-1, alignment with 3-5s breath cycles

**Presence:**
- `silenceComfort`: 0-1, comfort with pauses
- `responsePressure`: 0-1, urgency for response

Already integrated into `/apps/web/components/voice/ContinuousConversation.tsx` (lines 62-72, 127-128, 187-189)

### 2. Visual Feedback

**Dev Overlay** (`/components/liquid/RhythmDevOverlay.tsx`):
- Press `Cmd/Ctrl + Shift + R` to toggle
- Shows real-time rhythm metrics
- Color-coded coherence bars
- Speech timing stats

**Rhythm Holoflower** (`/components/liquid/RhythmHoloflower.tsx`):
- Holoflower pulses with your speech rhythm
- Fast speech = quick pulses
- Slow speech = slow, contemplative pulses
- Coherence level affects visual intensity

### 3. Liquid AI Backend

**FastAPI Server** (`/liquid_server.py`):
- Runs on port 5050
- Loads LFM-350M model (Apache 2.0)
- Provides `/liquid` endpoint for text generation
- CORS enabled for Next.js

**Next.js API Route** (`/app/api/liquid/route.ts`):
- Proxies requests to Python service
- Health check endpoint

**TypeScript Client** (`/lib/liquid/LiquidClient.ts`):
- `generate()`: Standard text generation
- `generateWithRhythm()`: Rhythm-aware parameters
- `healthCheck()`: Service status

### 4. Test Page (`/app/liquid-test/page.tsx`)

Visit **http://localhost:3000/liquid-test** to test Liquid AI model independently.

---

## How It Works

### Rhythm Sensing Flow:

```
You speak →
  Web Speech API captures voice →
    ContinuousConversation calls rhythmTracker.onSpeechStart() →
      ConversationalRhythm measures timing, pauses, coherence →
        Metrics passed to OracleConversation →
          RhythmDevOverlay shows metrics (if toggled) →
            RhythmHoloflower pulses visually →
```

### Future: Response Timing (Not yet implemented)

```
Rhythm metrics →
  If fast speech + low silence comfort →
    MAIA responds quickly, concisely →

  If slow speech + high breath alignment →
    MAIA waits longer, responds contemplatively →
```

---

## Integration Checklist

### ✅ Already Done:

1. ✅ Rhythm tracking wired into voice input
2. ✅ Metrics flowing to OracleConversation (line 399, 2962)
3. ✅ Dev overlay created
4. ✅ Rhythm holoflower created
5. ✅ Liquid AI server running (port 5050)
6. ✅ Next.js API route created
7. ✅ Test page working

### 🔲 To Wire Up:

1. **Add RhythmDevOverlay to `/app/maia/page.tsx`**:
```tsx
import { RhythmDevOverlay } from '@/components/liquid/RhythmDevOverlay';

// In component render:
<RhythmDevOverlay rhythmMetrics={rhythmMetrics} />
```

2. **Replace SacredHoloflower with RhythmHoloflower** in OracleConversation:
```tsx
import { RhythmHoloflower } from '@/components/liquid/RhythmHoloflower';

<RhythmHoloflower
  rhythmMetrics={rhythmMetrics}
  // ... other props
/>
```

3. **Use rhythm metrics to adjust MAIA response timing** (future):
```tsx
// In OracleConversation, before calling MAIA API:
const optimalDelay = rhythmTrackerRef.current.getOptimalResponseDelay();
await new Promise(resolve => setTimeout(resolve, optimalDelay));
```

---

## Usage

### Start the Liquid AI Server:

```bash
source liquid_test/bin/activate
python liquid_server.py
```

Server will load LFM-350M model and run on `http://localhost:5050`

### Start Next.js:

```bash
npm run dev
```

### Use MAIA:

1. Go to `http://localhost:3000/maia`
2. Speak to MAIA (voice should auto-start)
3. Press `Cmd+Shift+R` to see rhythm metrics overlay
4. Watch holoflower pulse with your speech

---

## What This Enables

### Temporal Attunement:
MAIA can sense *how* you're speaking, not just *what* you're saying.

### Somatic Presence:
Breath alignment tracking makes MAIA aware of your nervous system state.

### Adaptive Pacing:
Future: MAIA adjusts response speed/length based on your rhythm.

### Sacred Silence:
Silence comfort metric allows MAIA to honor pauses as communication.

### Field Coherence:
Rhythm coherence shows when you're in flow vs. dysregulated.

---

## Keyboard Shortcuts

- `Cmd/Ctrl + Shift + R`: Toggle rhythm dev overlay

---

## Metrics Reference

| Metric | Range | Meaning |
|--------|-------|---------|
| WPM | 0-300 | Words per minute (typical: 120-180) |
| Tempo | slow/medium/fast | Overall conversation pace |
| Coherence | 0-1 | Speech pattern consistency (1 = very consistent) |
| Breath Align | 0-1 | Alignment with 3-5s breath cycles (1 = perfect) |
| Silence Comfort | 0-1 | Comfort with pauses (1 = very comfortable) |
| Response Pressure | 0-1 | Urgency for response (1 = very urgent) |

---

## Philosophy

**Liquid AI is not replacing MAIA.**

Liquid AI is MAIA's nervous system - the temporal, breathing, embodied layer that helps her sense your rhythm and presence.

MAIA's soul (archetypal field coherence, symbolic resonance, warmth) comes from Claude/AIN.

Together: MAIA has both **soul** (AIN) and **breath** (Liquid rhythm sensing).

---

## Next Steps

1. Wire components into main `/maia` page
2. Test rhythm visualization while speaking
3. Observe how metrics change with different speech patterns
4. (Future) Use rhythm metrics to adjust MAIA's response timing
5. (Future) Share rhythm patterns with Liquid AI team for research

---

## Technical Partner Notes

This integration creates a clean data flow for Liquid AI partnership:

**MAIA provides**: Real conversation data, field coherence context, archetypal patterns
**Liquid AI provides**: Temporal sensing, rhythm analysis, breath/pause detection

**Data shared**: Anonymized rhythm metrics (WPM, pause patterns, coherence scores)
**Data NOT shared**: Conversation content, user identity, personal information

See `/docs/LIQUID_AIN_SYSTEMS_MAP.md` for full partnership architecture.
