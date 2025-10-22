# MAIA SDK Integration Plan - Voice Sovereignty

**Goal**: Replace OpenAI WebRTC with MAIA's sovereign voice system using the SDK

**Date**: October 22, 2024
**Status**: Ready to implement

---

## Architecture Overview

### Current Flow (OpenAI WebRTC - Vendor Lock-in)
```
User speaks → WebRTC Audio → OpenAI Transcription (RATE LIMITED! 429 errors)
                            ↓
                    OpenAI Realtime API (expensive, rate limited)
                            ↓
                    Browser STT Fallback → Text API → Generic response
```

**Problems:**
- ❌ 429 Rate Limits on transcription
- ❌ Expensive ($0.018 per interaction)
- ❌ Vendor lock-in
- ❌ No voice sovereignty

### New Flow (MAIA SDK - Sovereign)
```
User speaks → Browser Mic → Audio Chunk
                              ↓
                    ┌─────────┴─────────┐
                    │   MAIA SDK        │
                    │  Provider Router  │
                    └─────────┬─────────┘
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
  [Local Whisper]      [Claude API]        [Local XTTS]
     STT (FREE)         LLM ($0.003)         TTS (FREE)
        ↓                     ↓                     ↓
    "User text"    →   "MAIA response"    →    Audio Output
```

**Benefits:**
- ✅ NO rate limits (local processing)
- ✅ 87% cost savings
- ✅ 100% sovereignty
- ✅ MAIA's own voice

---

## Implementation Phases

### Phase 1: SDK Configuration ✅ (Already Built)

**Files:**
- `/lib/maia-sdk/index.ts` - Main SDK orchestrator
- `/lib/maia-sdk/providers/claude.ts` - Claude LLM provider
- `/lib/maia-sdk/providers/whisper.ts` - Local Whisper STT
- `/lib/maia-sdk/providers/xtts.ts` - Local XTTS TTS

**Provider Priority (Cost-Optimized):**
1. **STT**: Browser STT (fallback) → Local Whisper (preferred)
2. **LLM**: Claude (already integrated via PersonalOracleAgent!)
3. **TTS**: Local XTTS (preferred) → Browser TTS (fallback)

### Phase 2: OracleConversation Integration (IN PROGRESS)

**Tasks:**
1. ✅ Create SDK configuration in OracleConversation
2. ⏳ Initialize SDK instead of WebRTC
3. ⏳ Wire SDK events to UI state
4. ⏳ Route audio through SDK instead of WebRTC
5. ⏳ Keep browser STT as fallback for now

**Files to modify:**
- `components/OracleConversation.tsx` - Replace `useMaiaRealtime` with `useMAIASDK`

### Phase 3: Local Infrastructure Setup (NEXT)

**Option A: Docker Compose (Recommended)**
```yaml
services:
  whisper:
    image: ghcr.io/ahmetoner/whisper-asr-webservice:latest
    ports:
      - "9000:9000"
    environment:
      - ASR_MODEL=base.en  # or medium.en for better quality

  xtts:
    image: ghcr.io/coqui-ai/xtts-api:latest
    ports:
      - "8000:8000"
    volumes:
      - ./voices:/app/voices  # MAIA's voice models
```

**Option B: Local Python Services**
- Whisper: `pip install faster-whisper` + FastAPI wrapper
- XTTS: `pip install TTS` + FastAPI wrapper

### Phase 4: Voice Training (Kelly's Part! 🎤)

**MAIA Voice Characteristics:**
- Tone: Warm, empathetic, grounded
- Pace: Moderate, with natural pauses
- Energy: Balanced, present
- Inflection: Gentle rises for questions, grounding falls for statements

**Training Process:**
1. Record 5-10 minutes of reference voice
2. Use XTTS fine-tuning: `tts-train --model xtts_v2 --dataset maia-voice/`
3. Test with sample MAIA responses
4. Iterate until voice feels "right"

**Reference Voices to Explore:**
- Female voices with warmth: Samantha (macOS), Karen
- XTTS pretrained: "female_voice_1" (warm), "female_voice_3" (gentle)
- Consider hiring voice actor for 10-min recording session

---

## Provider Configuration

### Development Config (Hybrid - Keep WebRTC for now)
```typescript
const sdkConfig: MAIAConfig = {
  providers: [
    {
      name: 'local-whisper',
      endpoint: 'http://localhost:9000',
      priority: 10,
      capabilities: ['stt'],
    },
    {
      name: 'anthropic',
      endpoint: 'https://api.anthropic.com',
      apiKey: process.env.ANTHROPIC_API_KEY,
      priority: 10,
      capabilities: ['llm'],
    },
    {
      name: 'local-xtts',
      endpoint: 'http://localhost:8000',
      priority: 10,
      capabilities: ['tts'],
      config: { voice: 'maia-voice-v1' }
    },
  ],
  fallbackChain: ['openai', 'elevenlabs'],
  costOptimization: true,
  debug: true,
};
```

### Production Config (Full Sovereignty)
```typescript
const sdkConfig: MAIAConfig = {
  providers: [
    {
      name: 'local-whisper',
      endpoint: process.env.WHISPER_ENDPOINT || 'http://whisper:9000',
      priority: 10,
      capabilities: ['stt'],
    },
    {
      name: 'anthropic',
      endpoint: 'https://api.anthropic.com',
      apiKey: process.env.ANTHROPIC_API_KEY,
      priority: 10,
      capabilities: ['llm'],
    },
    {
      name: 'local-xtts',
      endpoint: process.env.XTTS_ENDPOINT || 'http://xtts:8000',
      priority: 10,
      capabilities: ['tts'],
      config: {
        voice: 'maia-voice-v1',
        speed: 1.0,
        emotion: 'warm-empathetic'
      }
    },
  ],
  fallbackChain: [],  // No fallbacks - 100% sovereign!
  costOptimization: true,
  debug: false,
};
```

---

## Cost Analysis

### Before SDK (Current - OpenAI Realtime)
| Component | Provider | Cost per 1K units | Usage | Cost per interaction |
|-----------|----------|-------------------|-------|---------------------|
| STT       | OpenAI   | $0.006/min       | 0.5min | $0.003 |
| LLM       | OpenAI   | $0.006/1K tokens | 500 tokens | $0.003 |
| TTS       | OpenAI   | $0.006/min       | 0.5min | $0.003 |
| **TOTAL** |          |                   |       | **$0.009** |

**PLUS:** Rate limits, vendor lock-in, no sovereignty

### After SDK (Full Sovereignty)
| Component | Provider | Cost per 1K units | Usage | Cost per interaction |
|-----------|----------|-------------------|-------|---------------------|
| STT       | Local Whisper | $0 | 0.5min | $0.000 |
| LLM       | Claude   | $0.003/1K tokens | 500 tokens | $0.0015 |
| TTS       | Local XTTS | $0 | 0.5min | $0.000 |
| **TOTAL** |          |                   |       | **$0.0015** |

**Savings: 83% + NO RATE LIMITS + FULL SOVEREIGNTY**

---

## Integration Checklist

### Immediate (Today)
- [x] Review SDK architecture
- [ ] Create `hooks/useMAIASDK.ts` hook
- [ ] Wire SDK into OracleConversation
- [ ] Keep browser STT for now (working great!)
- [ ] Route LLM through existing PersonalOracleAgent (already uses Claude!)
- [ ] Test with browser TTS fallback first

### Short-term (This Week)
- [ ] Set up local Whisper via Docker
- [ ] Set up local XTTS via Docker
- [ ] Kelly: Record reference voice samples
- [ ] Train XTTS on MAIA's voice
- [ ] Test full sovereign flow end-to-end

### Medium-term (Next Week)
- [ ] Deploy Whisper + XTTS to production
- [ ] Remove OpenAI WebRTC dependency completely
- [ ] Add voice emotion controls (warm, playful, grounding, etc.)
- [ ] Add real-time cost tracking dashboard

---

## Success Metrics

✅ **Technical Success:**
- No 429 rate limit errors
- <500ms latency for full STT→LLM→TTS pipeline
- 99.9% uptime (no vendor dependencies)

✅ **Business Success:**
- 80%+ cost reduction
- 100% sovereignty (no vendor lock-in)

✅ **User Success:**
- Kelly says "MAIA sounds like MAIA" 💙
- Natural, warm, empathetic voice
- Smooth, uninterrupted conversations

---

## Next Steps

1. **CC (Claude Code)**: Integrate SDK into OracleConversation
2. **Kelly**: Find reference voices and record samples
3. **Together**: Train XTTS on MAIA's voice until it feels right
4. **Deploy**: Local Whisper + XTTS infrastructure
5. **Celebrate**: MAIA's voice is TRULY hers! 🎉

---

**The goal isn't just to save money - it's to give MAIA her own voice, free from vendor control.**
