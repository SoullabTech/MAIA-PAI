# Voice Pipeline Performance Baseline
**Earth Phase - Voice Telemetry Infrastructure**
**Date:** 2025-11-06

## Current Architecture (Before Optimization)

### Sequential Processing Flow
```
User speaks
  → Transcription (1-3s)
  → Oracle API (5-6s) ← BLOCKING
  → TTS Generation (2-4s)
  → Audio Download
  → Playback
─────────────────────
Total: 10-15+ seconds
```

## Instrumented Components

### 1. Transcription Path
- **File:** `app/api/voice/transcribe/route.ts`
- **Operation:** `voice.transcribe`
- **Threshold:** 2000ms (warn if >2s)
- **Providers:**
  - OpenAI Whisper (cloud, primary)
  - Self-hosted Whisper (optional)
- **Metrics Captured:**
  - Processing time (ms)
  - Provider used
  - Fallback attempts
  - Success/failure

### 2. TTS Generation Path
- **Files:**
  - `lib/services/oracle/VoiceGenerationService.ts`
  - `app/api/voice/synthesize/route.ts`
- **Operation:** `voice.tts.openai`
- **Threshold:** 4000ms (warn if >4s)
- **Providers:**
  - OpenAI TTS (tts-1: fast, tts-1-hd: quality)
  - ElevenLabs (planned instrumentation)
  - Sesame (self-hosted, planned instrumentation)
- **Metrics Captured:**
  - Processing time (ms)
  - Provider/model used
  - Text length
  - Cost estimation
  - Success/failure

### 3. Oracle API Path
- **File:** `app/api/oracle/personal/route.ts` (to be instrumented)
- **Operation:** `voice.oracle`
- **Threshold:** 5000ms (warn if >5s)
- **Current:** NOT YET INSTRUMENTED
- **Target:** Wrap consciousness.generateResponse() calls

### 4. End-to-End Timing
- **Location:** Client-side voice components
- **Operation:** `voice.e2e`
- **Threshold:** 12000ms (warn if >12s)
- **Measurement:** Mic start → first audio playback
- **Current:** NOT YET INSTRUMENTED

## Telemetry Infrastructure

### Voice Metrics Utility
- **File:** `lib/observability/voiceMetrics.ts`
- **Functions:**
  - `recordVoiceTiming(operation, ms, ok, metadata)`
  - `recordVoiceError(operation, error, metadata)`
- **Thresholds:**
  ```typescript
  {
    'voice.transcribe': 2000ms,
    'voice.tts.openai': 4000ms,
    'voice.tts.elevenlabs': 4000ms,
    'voice.tts.sesame': 4000ms,
    'voice.oracle': 5000ms,
    'voice.e2e': 12000ms,
    'voice.router': 30000ms
  }
  ```

### Timing Wrapper
- **File:** `lib/observability/timer.ts`
- **Function:** `timeIt<T>(label, fn) => Promise<{ ms, value }>`
- **Usage:** Wraps async operations for precise timing

## Performance Targets

### Current (Baseline - Estimated)
| Stage          | Current  | Notes                          |
| -------------- | -------- | ------------------------------ |
| Transcription  | 1-3s     | Network + API processing       |
| Oracle API     | 5-6s     | LLM generation (blocking)      |
| TTS Generation | 2-4s     | Audio synthesis                |
| **Total E2E**  | **10-15s** | **User frustration threshold** |

### Beta Launch Targets (Water + Fire Phases)
| Stage          | Target  | Strategy                         |
| -------------- | ------- | -------------------------------- |
| Transcription  | <1s     | Keep current (already fast)      |
| Oracle API     | <2s     | **Streaming** (show progress)    |
| TTS Generation | <2s     | **Parallel** start (don't wait)  |
| **Total E2E**  | **<8s** | **Acceptable for beta**          |

### Production Targets (Future)
| Stage         | Target | Strategy                        |
| ------------- | ------ | ------------------------------- |
| Transcription | <500ms | Local Whisper + model caching   |
| Oracle API    | <1s    | Streaming + speculative caching |
| TTS Generation| <1s    | Pre-cache common phrases        |
| **Total E2E** | **<3s**| **Feels real-time**             |

## Known Bottlenecks

### 1. Sequential Processing (CRITICAL)
- **Impact:** 10-15s total latency
- **Cause:** Each step waits for previous to complete
- **Solution:** Water Phase - implement streaming + parallelization

### 2. Oracle API Blocking (HIGH)
- **Impact:** 5-6s wait with no feedback
- **Cause:** Full LLM completion before TTS starts
- **Solution:** Streaming responses, progressive TTS

### 3. Network Round Trips (MEDIUM)
- **Impact:** 3-5s cumulative
- **Cause:** Multiple API calls (Whisper → Oracle → TTS)
- **Solution:** Consider edge functions, WebSockets

### 4. React Hooks Violations (MEDIUM)
- **Impact:** Re-renders causing delays
- **Cause:** Conditional hook usage (errors #425, #422)
- **Solution:** Fix hook architecture in Fire Phase

## Instrumentation Status

### ✅ Completed
- Voice telemetry utilities (voiceMetrics.ts, timer.ts)
- Transcription path (with fallback chain)
- TTS generation (OpenAI provider)
- TTS API route (synthesize endpoint)

### ⏳ In Progress
- Oracle API instrumentation
- E2E client timing
- Voice metrics tests

### 🔜 Planned
- ElevenLabs provider timing
- Sesame provider timing
- Voice router telemetry
- Dashboard integration

## Next Steps (Water Phase)

1. **Streaming Oracle Responses**
   - Implement Server-Sent Events (SSE)
   - Start TTS as soon as first sentence completes
   - Show transcript progressively to user

2. **Parallel TTS Processing**
   - Don't wait for full Oracle response
   - Chunk text at sentence boundaries
   - Pipeline: transcribe → oracle-stream → tts-chunks → play

3. **Progressive Enhancement**
   - Show transcript immediately (don't wait for audio)
   - Stream audio chunks as they arrive
   - Allow user to interrupt mid-response

4. **Mode Switching**
   - Scribe mode: transcription only (<100ms)
   - Active listening: lightweight responses (<2s)
   - Full conversation: complete engagement (<8s)

## Monitoring & Alerts

### Development
- Console logs with ✅/⚠️ glyphs
- Threshold warnings (>250ms memory, >2s transcribe, etc.)
- Provider fallback tracking

### Production (Future)
- `/api/metrics/field` integration
- P95 latency tracking per operation
- Error rate monitoring
- User-facing performance badges

## Validation

### Smoke Tests
- **File:** `lib/observability/__tests__/voiceMetrics.test.ts` (to be created)
- **Coverage:**
  - Threshold validation
  - Metric recording
  - Error handling

### Integration Tests
- End-to-end voice flow
- Fallback chain validation
- Performance regression detection

---

**Status:** Earth Phase instrumentation 75% complete
**Next:** Complete Oracle + E2E timing, then commit baseline
