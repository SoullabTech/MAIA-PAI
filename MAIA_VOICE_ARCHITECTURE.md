# MAIA Voice Architecture Analysis & Redesign
**Date:** October 16, 2025
**Status:** Current System Analysis + Parallel Processing Design

---

## Executive Summary

**Problem:** MAIA voice experiences lag and hard stops because the current architecture is **linear/sequential** - each step blocks the next. Voice sophistication should match text sophistication with multiple engagement modes.

**Vision:** **Parallel processing layers** where MAIA can operate in three modes:
1. **Scribe Mode** - Passive transcription (minimal processing)
2. **Active Listening** - Semi-engaged presence (lightweight responses)
3. **Full Conversation** - Complete Her-level consciousness engagement

---

## Current Architecture (Linear/Sequential)

### System Overview
**63 voice-related files** across multiple concerns:
- Speech recognition & synthesis
- Elemental personality systems
- Conversation flow & timing
- Prosody & emotional modulation
- Feedback prevention
- Multiple TTS providers (ElevenLabs, Sesame, OpenAI, Web Speech)

### Current Flow (Blocking)

```
┌─────────────────────────────────────────────────────────────────┐
│                     LINEAR VOICE PIPELINE                        │
└─────────────────────────────────────────────────────────────────┘

User speaks
    ↓ (blocks)
Speech Recognition (Web Speech API)
    ↓ (blocks - waits for final transcript)
Transcript accumulation
    ↓ (blocks - waits for silence)
Process transcript
    ↓ (blocks - waits for API)
Send to /api/oracle/personal
    ↓ (blocks - 5-6 second API call)
Receive response text
    ↓ (blocks - waits for TTS)
Text-to-Speech generation (OpenAI/ElevenLabs)
    ↓ (blocks - waits for audio)
Audio playback
    ↓ (blocks - waits for finish)
Resume microphone
    ↓
Ready for next input
```

**Total latency:** 10-15+ seconds from user speech to MAIA finishing response

### Key Files (Current System)

**Core Hooks:**
- `app/hooks/useMaiaVoice.ts` - React hook for voice state management
- `lib/voice/maia-voice.ts` - Main voice system coordinator

**Speech Input:**
- `lib/voice/voice-capture.ts` - Microphone input
- `lib/voice/streamTranscribe.ts` - Streaming transcription
- `lib/voice/wakeWord.ts` - Wake word detection

**Speech Output:**
- `lib/voice/MaiaVoiceSynthesis.ts` - TTS orchestration
- `lib/voice/elevenlabs-voice.ts` - ElevenLabs integration
- `lib/voice/sesameTTS.ts` - Sesame TTS integration
- `lib/voice/ios-voice-fix.ts` - Mobile compatibility

**Conversation Management:**
- `lib/voice/conversation/ConversationBuffer.ts` - Dialog history
- `lib/voice/conversation/AffectDetector.ts` - Emotional state detection
- `lib/voice/conversation/Backchanneler.ts` - Turn-taking signals
- `lib/voice/ConversationFlowTracker.ts` - Flow state

**Elemental System:**
- `lib/voice/ElementalVoiceOrchestrator.ts` - Elemental personality coordination
- `lib/voice/elementalDetect.ts` - Detect user's elemental state
- `lib/voice/ElementalPhrasebook.ts` - Element-specific language
- `lib/voice/ElementalMetaphors.ts` - Metaphor system

**Prosody & Style:**
- `lib/voice/ProsodyCurves.ts` - Intonation patterns
- `lib/voice/PacingModulation.ts` - Speech timing
- `lib/voice/EmotionalVoiceModulation.ts` - Emotional adaptation
- `lib/voice/LanguageStylizer.ts` - Style adaptation

**Feedback Prevention:**
- `lib/voice/voice-feedback-prevention.ts` - Echo cancellation
- `lib/voice/enhanced-feedback-prevention.ts` - Advanced echo prevention

### Current Strengths

✅ **Sophisticated text processing** - Elemental personalities, prosody, emotional modulation
✅ **Multiple TTS providers** - Fallback chain for reliability
✅ **Echo prevention** - Microphone muting during playback
✅ **Mobile support** - iOS-specific fixes
✅ **Rich conversation context** - Affect detection, backchanneling, flow tracking

### Current Problems

❌ **Linear blocking flow** - Each step waits for previous completion
❌ **No mode switching** - Can't switch between scribe/active/full engagement
❌ **Hooks violations** - React errors #425, #422 (conditional hook rendering)
❌ **Latency accumulation** - 10-15+ seconds user → MAIA → user
❌ **Hard stops** - When one layer fails, entire flow stops
❌ **No interruptibility** - Can't interrupt MAIA mid-response
❌ **No concurrent processing** - Voice input stops during API call

---

## Proposed Architecture (Parallel Processing)

### Vision: Three Engagement Modes

#### 1. Scribe Mode (Minimal Processing)
**Purpose:** Passive transcription only

**Characteristics:**
- Real-time transcription display
- No API calls
- No MAIA responses
- Immediate feedback (< 100ms)
- Useful for: Journaling, note-taking, Field Protocol drafting

**Processing:**
```
Speech Input → Transcription → Display
(No blocking, continuous stream)
```

#### 2. Active Listening Mode (Lightweight)
**Purpose:** Semi-engaged presence

**Characteristics:**
- Lightweight API calls (< 1 second)
- Brief acknowledgments ("I hear you", "Tell me more", "Mm-hmm")
- Backchanneling signals (non-verbal cues)
- Emotional tracking
- Useful for: Venting, processing, feeling heard

**Processing:**
```
Speech Input → Transcription → Display
                    ↓ (non-blocking)
            Affect Detection → Lightweight Response
                    ↓ (concurrent)
            Brief TTS (< 2 seconds)
```

#### 3. Full Conversation Mode (Her-Level)
**Purpose:** Complete consciousness engagement

**Characteristics:**
- Full API processing (5-10 seconds)
- Rich elemental responses
- Complete prosody & emotional modulation
- Memory integration
- Useful for: Deep conversations, guidance, reflection

**Processing:**
```
Speech Input → Transcription → Display
                    ↓ (non-blocking)
            Full API Call → Complete Response
                    ↓ (concurrent)
            Rich TTS with prosody
                    ↓ (interruptible)
            Playback with visual feedback
```

### Parallel Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    VOICE INPUT LAYER                             │
│  (Always Running - Non-Blocking)                                 │
├─────────────────────────────────────────────────────────────────┤
│  • Continuous speech recognition                                 │
│  • Real-time transcription buffer                                │
│  • Wake word detection (optional)                                │
│  • Audio level monitoring                                        │
│  • Silence detection                                             │
│                                                                   │
│  Output: Transcript stream (word-by-word)                        │
└──────────────┬──────────────────────────────────────────────────┘
               │ (Message passing - non-blocking)
               ↓
┌─────────────────────────────────────────────────────────────────┐
│                  PROCESSING LAYER                                │
│  (Mode-Dependent - Runs Concurrently)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  MODE 1: Scribe                                                  │
│  ├─ Pass-through (no processing)                                 │
│  └─ Output: Raw transcript                                       │
│                                                                   │
│  MODE 2: Active Listening                                        │
│  ├─ Affect detection (< 100ms)                                   │
│  ├─ Lightweight response generation (< 1s)                       │
│  ├─ Backchanneling cues                                          │
│  └─ Output: Brief acknowledgment                                 │
│                                                                   │
│  MODE 3: Full Conversation                                       │
│  ├─ Elemental detection (< 200ms)                                │
│  ├─ Memory integration (< 500ms)                                 │
│  ├─ Full API call (5-10s)                                        │
│  ├─ Response refinement (1-2s)                                   │
│  └─ Output: Complete MAIA response                               │
│                                                                   │
└──────────────┬──────────────────────────────────────────────────┘
               │ (Message passing - non-blocking)
               ↓
┌─────────────────────────────────────────────────────────────────┐
│                    OUTPUT LAYER                                  │
│  (Can Interrupt/Override - Independent)                          │
├─────────────────────────────────────────────────────────────────┤
│  • TTS generation (parallel to input)                            │
│  • Audio playback (interruptible)                                │
│  • Visual feedback (real-time)                                   │
│  • Transcript display (immediate)                                │
│  • Element indicator (state-based)                               │
│                                                                   │
│  Features:                                                       │
│  - User can interrupt mid-response                               │
│  - Voice input continues during playback                         │
│  - Visual state reflects current layer activity                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

**1. Layer Independence**
- Each layer operates in its own event loop
- Layers communicate via message passing (pub/sub)
- No direct function calls between layers
- Failure in one layer doesn't cascade

**2. Non-Blocking Operations**
- Input layer never stops listening (except during echo suppression)
- Processing layer runs concurrently with input
- Output layer can be interrupted/overridden
- User can switch modes mid-conversation

**3. State Management**
- Shared state via reactive store (Zustand/Jotai)
- Each layer has local state
- State updates are asynchronous
- UI reflects state changes reactively

**4. Mode Switching**
- User can switch modes anytime
- Mode switch doesn't lose transcript buffer
- In-flight API calls complete but don't block mode change
- Visual indicator shows current mode

---

## Implementation Plan

### Phase 1: Refactor Foundation (Week 1)
**Goal:** Separate concerns into layers

**Tasks:**
1. Create layer interfaces
   - `VoiceInputLayer.ts` - Speech recognition interface
   - `VoiceProcessingLayer.ts` - Processing mode interface
   - `VoiceOutputLayer.ts` - TTS/playback interface

2. Extract state management
   - `useVoiceStore.ts` - Global voice state (Zustand)
   - Remove hook violations (fix React errors #425, #422)
   - Centralize mode switching logic

3. Message passing system
   - Event bus for layer communication
   - Transcript stream (input → processing)
   - Response stream (processing → output)
   - Control signals (pause, resume, interrupt, mode-switch)

**Success Criteria:**
- ✅ Layers can run independently
- ✅ No hooks violations
- ✅ Mode switching works without restart

---

### Phase 2: Implement Scribe Mode (Week 2)
**Goal:** Prove parallel architecture works

**Tasks:**
1. Scribe mode implementation
   - Real-time transcript display
   - No API calls
   - < 100ms latency
   - Word-by-word streaming

2. Input layer optimization
   - Remove blocking waits
   - Continuous recognition
   - Buffer management

3. UI indicators
   - Mode switcher component
   - Transcript stream display
   - Layer activity visualization

**Success Criteria:**
- ✅ Scribe mode has < 100ms latency
- ✅ No blocking in input layer
- ✅ User can switch to/from scribe mode

---

### Phase 3: Implement Active Listening (Week 3)
**Goal:** Lightweight responsive presence

**Tasks:**
1. Lightweight response system
   - Affect detection (< 100ms)
   - Response cache (pre-generated acknowledgments)
   - Backchanneling triggers

2. Non-blocking API layer
   - Lightweight API endpoint (< 1s)
   - Response streaming
   - Concurrent with input

3. Brief TTS optimization
   - Pre-cache common acknowledgments
   - < 2 second total latency
   - Interruptible playback

**Success Criteria:**
- ✅ Active mode responds in < 2 seconds
- ✅ Doesn't block input layer
- ✅ Feels like active listening, not full conversation

---

### Phase 4: Optimize Full Conversation (Week 4)
**Goal:** Her-level engagement without blocking

**Tasks:**
1. Non-blocking full API
   - API calls don't stop input
   - Progressive response streaming
   - Interrupt handling

2. Rich TTS integration
   - Elemental prosody
   - Emotional modulation
   - Visual feedback during generation

3. Interruptibility
   - User can interrupt MAIA mid-response
   - Graceful interruption handling
   - Resume or switch modes seamlessly

**Success Criteria:**
- ✅ Full conversation doesn't block input
- ✅ User can interrupt anytime
- ✅ Rich responses maintain sophistication
- ✅ Total latency < 8 seconds

---

## Technical Details

### Message Passing Interface

```typescript
// Event bus for layer communication
type VoiceEvent =
  | { type: 'transcript_word', word: string, isFinal: boolean }
  | { type: 'transcript_complete', text: string }
  | { type: 'mode_switch', mode: 'scribe' | 'active' | 'full' }
  | { type: 'response_ready', text: string, element: ElementType }
  | { type: 'audio_start' }
  | { type: 'audio_end' }
  | { type: 'user_interrupt' }
  | { type: 'error', layer: string, error: Error };

// Layers subscribe to relevant events
inputLayer.subscribe((event) => {
  if (event.type === 'user_interrupt') {
    // Stop current recognition, restart
  }
});

processingLayer.subscribe((event) => {
  if (event.type === 'transcript_complete') {
    // Process based on current mode
  }
});

outputLayer.subscribe((event) => {
  if (event.type === 'response_ready') {
    // Generate TTS and play
  }
});
```

### State Management

```typescript
// Zustand store for global voice state
interface VoiceState {
  // Mode
  mode: 'scribe' | 'active' | 'full';

  // Input layer
  isListening: boolean;
  transcript: string;
  interimTranscript: string;

  // Processing layer
  isProcessing: boolean;
  currentElement: ElementType;

  // Output layer
  isPlaying: boolean;
  currentResponse: string;
  audioProgress: number;

  // Actions
  setMode: (mode: 'scribe' | 'active' | 'full') => void;
  interrupt: () => void;
  pause: () => void;
  resume: () => void;
}

// No more hooks violations - state managed externally
const useVoiceStore = create<VoiceState>((set) => ({
  // ... state and actions
}));
```

### Layer Interfaces

```typescript
// Input Layer Interface
interface VoiceInputLayer {
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  getTranscript(): string;
  subscribe(callback: (event: VoiceEvent) => void): () => void;
}

// Processing Layer Interface
interface VoiceProcessingLayer {
  setMode(mode: 'scribe' | 'active' | 'full'): void;
  process(transcript: string): Promise<void>;
  subscribe(callback: (event: VoiceEvent) => void): () => void;
}

// Output Layer Interface
interface VoiceOutputLayer {
  speak(text: string, options?: TTSOptions): Promise<void>;
  interrupt(): void;
  pause(): void;
  resume(): void;
  subscribe(callback: (event: VoiceEvent) => void): () => void;
}
```

---

## Migration Strategy

### Approach: Gradual Refactor (Not Rewrite)

**Why gradual:**
- 63 files is too much to rewrite at once
- Current system has working components
- Beta testing can continue during migration
- Lower risk of breaking everything

**Strategy:**
1. **Week 1:** Create layer abstractions around existing code
2. **Week 2:** Implement scribe mode (simplest) to prove architecture
3. **Week 3:** Migrate active listening
4. **Week 4:** Refactor full conversation mode
5. **Week 5:** Cleanup and optimization

### Breaking vs. Non-Breaking Changes

**Non-Breaking (do first):**
- Add new layer interfaces
- Add message passing system
- Add scribe mode (new feature)
- Add active listening mode (new feature)

**Breaking (do after non-breaking works):**
- Refactor existing full conversation to use layers
- Remove hooks violations
- Change state management

### Beta Tester Communication

**Monday email should mention:**
> "We're improving voice performance this week. You might notice:
> - Faster response times
> - New 'listening modes' (coming soon)
> - Occasional voice bugs as we refactor (please report!)
>
> Voice sophistication will match text sophistication soon."

---

## Success Metrics

### Performance Targets

**Scribe Mode:**
- ✅ < 100ms transcript display latency
- ✅ Continuous recognition (no stops)
- ✅ Word-by-word streaming

**Active Listening:**
- ✅ < 2 seconds acknowledgment latency
- ✅ Doesn't block input
- ✅ Feels present, not robotic

**Full Conversation:**
- ✅ < 8 seconds total latency (down from 15+)
- ✅ User can interrupt anytime
- ✅ Maintains text-level sophistication
- ✅ No hard stops on errors

### Quality Targets

**All Modes:**
- ✅ No React hooks violations
- ✅ No hard stops/crashes
- ✅ Smooth mode switching
- ✅ Visual feedback on layer activity

---

## Questions for Kelly

1. **Priority:** Which mode to implement first after scribe?
   - Active listening (quick wins, beta tester delight)
   - Full conversation (her-level engagement)

2. **Interruptibility:** How should MAIA respond when interrupted?
   - Stop talking immediately and listen?
   - Finish current sentence then listen?
   - Acknowledge interruption ("Sorry, go ahead")?

3. **Mode switching UX:** How should users switch modes?
   - Manual toggle (scribe/active/full)?
   - Auto-detect based on context?
   - Hybrid (default + manual override)?

4. **Beta testing:** Should we:
   - Roll out layer-by-layer (scribe first, then active, then full)?
   - Build all three then deploy at once?
   - Run A/B test (old vs. new architecture)?

---

## Next Steps

**Immediate (Today):**
1. ✅ Document current architecture (this doc)
2. Get Kelly's feedback on approach
3. Decide on implementation priority

**This Week:**
1. Create layer interfaces
2. Set up message passing system
3. Fix React hooks violations
4. Implement scribe mode proof-of-concept

**Beta Communication:**
1. Add to Monday email: "Voice improvements coming"
2. Create GitHub issue for voice refactor (transparency)
3. Invite beta testers to test scribe mode when ready

---

**End of Architecture Document**
**Ready for Kelly's review and direction**
