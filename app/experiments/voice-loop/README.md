# MAIA Voice Loop - Concurrency Prototype

**Purpose:** Verify parallel voice architecture before modifying production code

**Location:** `/app/experiments/voice-loop`

**Visit:** http://localhost:3000/experiments/voice-loop

---

## What This Proves

This prototype demonstrates that MAIA's voice system can achieve:

1. **True Parallelism** - Input, processing, and output layers run simultaneously without blocking
2. **Mode Switching** - Seamless switching between Scribe/Active/Full modes without restarting
3. **Interruptibility** - User can interrupt MAIA mid-sentence
4. **Low Latency** - Visible performance metrics for every stage
5. **State Management** - Zustand store eliminates React hooks violations
6. **Event-Driven Architecture** - Mitt event bus for non-blocking message passing

---

## Architecture Components

### Input Layer
- **Web Speech API** (continuous recognition)
- Always listening (even during playback)
- Emits `transcript_complete` events to bus

### Event Bus
- **Mitt** - Lightweight event emitter
- Non-blocking message passing between layers
- Events: `transcript_complete`, `response_ready`, `mode_switch`, `timing`

### State Layer
- **Zustand** - Global state outside React
- No hooks violations
- Manages: mode, transcript, responses, timing metrics

### Processing Layer
- Mode-dependent response generation:
  - **Scribe:** No response (transcription only)
  - **Active:** Lightweight acknowledgment ("I'm listening")
  - **Full:** Complete response with context
- Subscribes to `transcript_complete`
- Emits `response_ready`

### Output Layer
- **Speech Synthesis API** (interruptible)
- Cancels previous speech when interrupted
- Tracks timing: TTS_START → AUDIO_PLAYBACK_START → AUDIO_PLAYBACK_END

---

## Performance Metrics

The prototype logs timestamps at every transition:

1. **MIC_START** - Microphone begins listening
2. **TRANSCRIPT_COMPLETE** - Final transcript received
3. **PROCESSING_START** - Response generation begins
4. **PROCESSING_END** - Response ready
5. **TTS_START** - Text-to-speech synthesis begins
6. **AUDIO_PLAYBACK_START** - Audio playback begins
7. **AUDIO_PLAYBACK_END** - Audio playback completes

**Delta (Δ)** times between stages show where latency occurs:
- **Green** (< 100ms) - Excellent
- **Yellow** (100-500ms) - Acceptable
- **Red** (> 500ms) - Needs optimization

---

## How to Test

### Test 1: Basic Concurrency
1. Visit http://localhost:3000/experiments/voice-loop
2. Click "Start" and allow microphone access
3. Speak a few words
4. Observe MAIA responds while still listening
5. **Success:** Transcript continues accumulating during playback

### Test 2: Mode Switching
1. Start in "Scribe" mode
2. Speak a sentence (no response)
3. Switch to "Active" mid-session
4. Speak again (acknowledgment response)
5. Switch to "Full"
6. Speak again (complete response)
7. **Success:** Mode switches instantly without restarting mic

### Test 3: Interruption
1. Set mode to "Full"
2. Ask a question that generates a long response
3. Interrupt MAIA mid-sentence by speaking
4. **Success:** MAIA stops, your new speech is recognized

### Test 4: Latency Benchmarking
1. Speak short phrases
2. Check Performance Metrics panel
3. Look for stages with high Δ times
4. **Target:** < 100ms for Scribe, < 2s for Active, < 8s for Full

---

## What This Replaces

This architecture demonstrates how to replace:

**Old (Blocking):**
```
User speaks → [WAIT] → Transcript complete → [WAIT] → API call → [WAIT] → TTS → [WAIT] → Playback → [WAIT] → Resume mic
Total: 10-15 seconds
```

**New (Parallel):**
```
Input Layer:  User speaks → Continuous transcription → Always listening
                              ↓ (event)
Processing:                   Mode-dependent response
                              ↓ (event)
Output Layer:                 Interruptible playback

Total: < 3 seconds (often < 1 second)
```

---

## Next Steps (Production Migration)

### Step 1: Validate This Prototype
- [ ] Test in Chrome (primary)
- [ ] Test in Safari (iOS compatibility)
- [ ] Test in Firefox
- [ ] Measure latency across modes
- [ ] Confirm no blocking between layers

### Step 2: Enhance with Real MAIA Processing
Replace stubbed processing layer with:
```typescript
bus.on("transcript_complete", async ({ text, timestamp }) => {
  const processingStart = Date.now();
  addTiming("PROCESSING_START", processingStart);

  const { mode } = useVoiceStore.getState();

  let reply = "";
  if (mode === "scribe") {
    reply = ""; // no response
  } else if (mode === "active") {
    // Lightweight: use local model or cached responses
    reply = await generateLightweightResponse(text);
  } else if (mode === "full") {
    // Full: call MAIA's real oracle endpoint
    reply = await fetch('/api/oracle/personal', {
      method: 'POST',
      body: JSON.stringify({ message: text })
    }).then(r => r.json()).then(d => d.response);
  }

  const processingEnd = Date.now();
  addTiming("PROCESSING_END", processingEnd);

  if (reply) bus.emit("response_ready", { text: reply, timestamp: processingEnd });
});
```

### Step 3: Add Sophistication Layers
Wire in MAIA's unique intelligence:
```typescript
import { elementalEngine } from '@/lib/voice/engines/ElementalEngine';
import { prosodyEngine } from '@/lib/voice/engines/ProsodyEngine';
import { useConversationState } from '@/lib/voice/state/ConversationState';

bus.on("transcript_complete", async ({ text }) => {
  // Detect elemental state
  const element = elementalEngine.detect(text);

  // Get conversation context
  const history = useConversationState.getState().history;

  // Generate response with elemental personality
  const prompt = elementalEngine.getPrompt(text, history, element);

  // Call MAIA with enriched prompt
  const response = await callMaia(prompt);

  // Apply prosody before TTS
  const styledResponse = prosodyEngine.modulate(response, element);

  bus.emit("response_ready", { text: styledResponse });
});
```

### Step 4: Replace Production Hook
Update `app/hooks/useMaiaVoice.ts` to use this architecture:
- Remove old blocking flow
- Use event bus pattern
- Use Zustand for state
- Enable mode switching

### Step 5: Feature Flag & A/B Test
- Deploy behind feature flag
- Test with 5-10 beta users first
- Measure: latency, interruption success, mode switch smoothness
- Roll out to all beta testers

---

## Success Criteria

**Before production migration, this prototype must show:**

✅ **Concurrency:** Mic keeps listening during playback
✅ **Low Latency:** < 300ms for Scribe mode
✅ **Interruptibility:** User can interrupt anytime
✅ **Mode Switching:** Instant mode changes without restart
✅ **No Blocking:** All layers run in parallel
✅ **No Crashes:** No React hooks violations (#425, #422)

**If all criteria pass → architecture is sound → proceed with production activation**

---

## Technical Notes

### Why Mitt Instead of EventEmitter?
- Smaller bundle size (200 bytes)
- TypeScript-first
- Browser-compatible
- Simple API

### Why Zustand Instead of Context?
- No re-renders on every state change
- Can be accessed outside React components
- No hooks violations
- Simpler than Redux

### Why Web Speech API Instead of WebRTC?
- Prototype uses Web Speech for simplicity
- Production will use `MaiaRealtimeWebRTC.ts` (same architecture, better quality)
- Event bus pattern works with both

---

**Created:** October 16, 2025
**Status:** Ready for testing
**Next:** Validate prototype → Show Kelly → Get go/no-go for production migration
