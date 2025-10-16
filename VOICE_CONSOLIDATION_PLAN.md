# MAIA Voice Consolidation Plan
**Date:** October 16, 2025
**Goal:** 63 files → Core functionality via WebRTC foundation

---

## What We're Actually Doing

**You're not rebuilding MAIA. You're removing old bottlenecks and activating the modern voice engine that already does what you need — just faster, cleaner, and with room to grow.**

**The Analogy:**
- Turn on the new roundabout (WebRTC) — it's already built, just not plugged in
- Cut out the old stoplight system (REST/WebSocket flow) that's causing lag
- Merge and clean up all the small files that were built to make the old system work
- Keep the good stuff (emotional tone, elemental voice, prosody)
- Remove all the redundant layers that just manage the traffic

**The Result:**
MAIA's voice will:
- Respond in real time (no 10–15 second delays)
- Keep listening while talking
- Be interruptible and natural
- Still sound and feel like her — elemental, emotionally intelligent, adaptive

**You're standing on top of the right machinery — you just haven't flipped the main breaker yet.**

---

## Executive Decision

**Use:** `MaiaRealtimeWebRTC.ts` (WebRTC-based, OpenAI recommended Dec 2024+)
**Archive:** Everything else that duplicates this functionality
**Keep & Wire:** Your unique sophistication (elemental, prosody, affect detection)
**Delete:** Any function calling `/api/oracle/personal` directly from voice layer

---

## File Triage (63 Files → 10-12 Core)

### ✅ Core System to Keep

| File | Role | Action |
|------|------|--------|
| `MaiaRealtimeWebRTC.ts` | PRIMARY transport layer | **Activate as single entry point** |
| `types.ts` | Type definitions | Keep & consolidate |
| `app/hooks/useMaiaVoice.ts` | React integration | Refactor to use WebRTC only |

### 🔀 Modules to Merge (Intelligence Layers)

| New File | Merge From | Why |
|----------|-----------|-----|
| **`ProsodyEngine.ts`** | ProsodyCurves.ts<br>PacingModulation.ts<br>EmotionalVoiceModulation.ts | All handle voice quality/timing |
| **`ElementalEngine.ts`** | ElementalVoiceOrchestrator.ts<br>elementalDetect.ts<br>ElementalPhrasebook.ts<br>ElementalMetaphors.ts | All handle elemental personality |
| **`ConversationState.ts`** | ConversationBuffer.ts<br>ConversationFlowTracker.ts<br>AffectDetector.ts | All manage conversation state (use Zustand) |
| **`VoiceBus.ts`** | *(new file)* | Lightweight event emitter for layer communication |

### 🔧 Transitional/Optional Keep

| File | Purpose | Decision |
|------|---------|----------|
| `wakeWord.ts` | Wake word detection ("Hey MAIA") | Keep if used, test with WebRTC |
| `LanguageStylizer.ts` | Style adaptation | Keep if actively used |
| `Backchanneler.ts` | Non-verbal cues | Keep if actively used |
| `symbolExtract.ts` | Symbol extraction | Keep for privacy test |
| `guardrails.ts` | Safety | Keep |

### 🗑️ Archive/Replace (55 Files)

**Transport Layer (WebRTC replaces all of these):**
- `RealtimeVoiceService.ts` - Old WebSocket implementation
- `MaiaVoiceSynthesis.ts` - Manual TTS orchestration
- `elevenlabs-voice.ts` - External TTS provider
- `sesameTTS.ts` - External TTS provider
- `maia-voice.ts` - Old coordinator
- `voice-capture.ts` - Manual mic input
- `streamTranscribe.ts` - Manual transcription
- `voice-feedback-prevention.ts` - Manual echo cancel
- `enhanced-feedback-prevention.ts` - Manual echo cancel
- `VoiceResonance.ts` - Manual resonance management
- `ios-voice-fix.ts` - Web Speech API hacks
- `maia-voice-mobile.ts` - Mobile workarounds

**Orchestration Layer (WebRTC + engines replace these):**
- `UnifiedVoiceOrchestrator.ts` - High-level coordinator
- `PersonalizedVoiceService.ts` - Personalization wrapper
- `aethericOrchestrator.ts` - Aetheric layer
- `RealtimeSpiralogicBraid.ts` - Spiralogic integration
- `ArchetypeRouter.ts` - Archetype routing
- `ArchetypalVoiceMapping.ts` - Archetype mapping
- `AnthonyElementalVoice.ts` - Duplicate elemental system

**Language Processing (Merge or archive):**
- `ConversationalEnhancer.ts` - Merge into LanguageStylizer
- `GenuineUtteranceGenerator.ts` - Merge into LanguageStylizer
- `PhenomenologicalPhrasebook.ts` - Merge into ElementalEngine
- `TTSPreprocessor.ts` - Merge into ProsodyEngine

**Prosody Detail (Overkill with OpenAI voice):**
- `ProsodyLookupTable.ts` - Pre-computed tables
- `ProsodyExtension.ts` - Extensions
- `ProsodySSMLRenderer.ts` - SSML rendering (not used)

**Utilities (WebRTC handles or redundant):**
- `VoiceCommandDetector.ts` - Command detection
- `silenceCommands.ts` - Silence detection
- `adaptive-tone-engine.ts` - Adaptive tone
- `useCollectiveListening.ts` - Collective listening
- `QuoteWhisperer.ts` - Quote system
- `micSession.ts` - Session management
- `IntegratedEmotionalResonance.ts` - Duplicate emotional system

### ❌ Deletion Criteria

**Delete any file that:**
1. Calls `/api/oracle/personal` directly from voice layer
2. Implements manual WebSocket/REST polling
3. Manages audio playback manually (WebRTC handles this)
4. Implements echo cancellation (WebRTC handles this)
5. Is a wrapper around a wrapper (orchestration bloat)

---

## Activation Flow (5 Steps)

### Step 1 — Audit Pass (2 hours)
**Goal:** Tag each of the 63 voice files with Keep/Merge/Archive

**Action:**
- Create `lib/voice/AUDIT.md` with table
- Tag each file: `Keep` | `Merge` | `Archive`
- Identify all functions calling `/api/oracle/personal` directly
- You'll see only 10-12 files actually need to survive

### Step 2 — Activate MaiaRealtimeWebRTC.ts (4 hours)
**Goal:** Make WebRTC the single entry point

**Action:**
- Refactor `app/hooks/useMaiaVoice.ts` to use only WebRTC
- Remove all imports to old transport layer (RealtimeVoiceService, MaiaVoiceSynthesis, etc.)
- Wire WebRTC events to React state
- Test basic conversation flow

**Success criteria:**
- User can speak and hear MAIA respond
- No calls to old REST/WebSocket endpoints
- < 3 second latency for simple responses

### Step 3 — Minimal Consolidation (6 hours)
**Goal:** Merge sophistication layers into engines

**Create 4 new files:**

1. **`lib/voice/VoiceBus.ts`** (new)
   ```typescript
   // Lightweight event emitter for layer communication
   import { EventEmitter } from 'events';
   export const voiceBus = new EventEmitter();
   ```

2. **`lib/voice/engines/ProsodyEngine.ts`** (merge)
   - Merge: ProsodyCurves, PacingModulation, EmotionalVoiceModulation
   - Single API: `prosodyEngine.modulate(text, emotion, element)`

3. **`lib/voice/engines/ElementalEngine.ts`** (merge)
   - Merge: ElementalVoiceOrchestrator, elementalDetect, ElementalPhrasebook, ElementalMetaphors
   - Single API: `elementalEngine.getPrompt(userText, history)`

4. **`lib/voice/state/ConversationState.ts`** (merge + Zustand)
   - Merge: ConversationBuffer, ConversationFlowTracker, AffectDetector
   - Use Zustand store: `useConversationState()`

**Move to archive:**
- All files from "Archive/Replace" list (55 files)
- Create `lib/voice/archive/legacy-{date}/`

### Step 4 — Verify Core Loop (2 hours)
**Goal:** Confirm < 300ms latency in Scribe Mode

**Tests to run:**

**A. Thread Analysis:**
```typescript
// Add to MaiaRealtimeWebRTC.ts
console.log('[VOICE] mic_start:', Date.now());
console.log('[VOICE] interim_transcript:', Date.now());
console.log('[VOICE] final_transcript:', Date.now());
console.log('[VOICE] audio_start:', Date.now());
```

**B. Concurrency Prototype:**
Create minimal test with:
- One mic worker (always listening)
- One message queue (voiceBus)
- One echo processor (just logs)

If that runs continuously without freezing → architecture holds.

**C. Interrupt Test:**
- Simulate user speech during MAIA playback
- Confirm mic thread keeps feeding queue
- MAIA stops mid-sentence, yields: "Go ahead"

**Success criteria:**
- Scribe mode: < 100ms from speech to transcript
- No blocking between layers
- User can interrupt MAIA anytime

### Step 5 — Document (1 hour)
**Goal:** Update architecture docs with WebRTC-First approach

**Action:**
- Update MAIA_VOICE_ARCHITECTURE.md with new flow
- Document 3 modes: Scribe → Active → Full
- Add migration notes for future devs

---

## New Simplified Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  MAIA REALTIME WEBRTC                            │
│  (Foundation - Handles All Real-Time Communication)              │
├─────────────────────────────────────────────────────────────────┤
│  • WebRTC peer connection (audio streaming)                      │
│  • Data channel (events, transcripts, controls)                  │
│  • Ephemeral token auth                                          │
│  • Built-in echo cancellation                                    │
│  • Semantic VAD (voice activity detection)                       │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────────────────┐
│           INTELLIGENCE LAYERS (Your Sophistication)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📊 Elemental Detection                                          │
│  ├─ Analyze user transcript                                      │
│  ├─ Detect Fire/Water/Earth/Air/Aether state                    │
│  └─ Modify system prompt dynamically                             │
│                                                                   │
│  💬 Conversation Intelligence                                    │
│  ├─ Track dialog history                                         │
│  ├─ Detect affect/emotion                                        │
│  ├─ Add backchanneling ("mm-hmm")                                │
│  └─ Manage turn-taking                                           │
│                                                                   │
│  ✍️ Language Sophistication                                      │
│  ├─ Style responses                                              │
│  ├─ Add phenomenological language                                │
│  ├─ Generate genuine utterances                                  │
│  └─ Enhance conversational flow                                  │
│                                                                   │
│  🎭 Emotional Resonance                                          │
│  ├─ Modulate emotional tone                                      │
│  ├─ Track conversation flow state                                │
│  └─ Integrate emotional intelligence                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key principle:**
WebRTC handles **all transport** (audio, transcription, response).
Your layers provide **intelligence** (what to say, how to say it).

---

## Final Architecture (After Consolidation)

```
lib/voice/
├── MaiaRealtimeWebRTC.ts          ← PRIMARY transport (WebRTC)
├── VoiceBus.ts                     ← Event emitter for layer communication
├── types.ts                        ← Consolidated type definitions
├── engines/
│   ├── ProsodyEngine.ts           ← Voice quality/timing (merged)
│   └── ElementalEngine.ts         ← Elemental personality (merged)
├── state/
│   └── ConversationState.ts       ← Conversation state (Zustand)
└── utils/
    ├── wakeWord.ts                ← Optional: wake word detection
    ├── LanguageStylizer.ts        ← Optional: style adaptation
    ├── Backchanneler.ts           ← Optional: non-verbal cues
    └── guardrails.ts              ← Safety

app/hooks/
└── useMaiaVoice.ts                ← Refactored to use WebRTC only

lib/voice/archive/legacy-oct2025/  ← 55 archived files
```

**Total:** 10-12 active files (down from 63)

---

## Timeline & Effort

| Step | Time | Outcome |
|------|------|---------|
| 1. Audit Pass | 2 hours | Tagged file list |
| 2. Activate WebRTC | 4 hours | Basic voice working |
| 3. Minimal Consolidation | 6 hours | Engines merged |
| 4. Verify Core Loop | 2 hours | < 300ms latency confirmed |
| 5. Document | 1 hour | Updated architecture docs |
| **Total** | **15 hours** | **Clean, parallel voice system** |

---

## Pre-Flight Verification (Do This First!)

**Before touching production code, run these 3 lightweight tests:**

### Test 1: Thread Analysis (15 min)
Add timestamp logging to current system:
```typescript
console.log('[VOICE] mic_start:', Date.now());
console.log('[VOICE] interim_transcript:', Date.now());
console.log('[VOICE] final_transcript:', Date.now());
console.log('[VOICE] api_send:', Date.now());
console.log('[VOICE] audio_play:', Date.now());
```
**Goal:** Living latency map showing which layers choke

### Test 2: Concurrency Prototype (30 min)
Create minimal browser demo (`/app/experiments/voice-loop`):
- Input layer: Web Speech API (continuous listening)
- Processing layer: Lightweight echo ("I heard X words")
- Output layer: Speech synthesis (interruptible)

**Goal:** Prove mic + queue + speaker can all run simultaneously

### Test 3: Interrupt Test (15 min)
In prototype:
- Start MAIA speaking a long response
- User interrupts mid-sentence
- Confirm mic never stopped listening
- MAIA yields: "Go ahead"

**Goal:** Confirm true parallelism (not just fast sequential)

**If all 3 pass → architecture is sound, proceed with activation**

---

## Risk Assessment

**Low Risk:**
- Step 1 (Audit) - Read-only analysis
- Step 4 (Verify) - Prototyping in experiments folder
- Step 5 (Document) - Documentation only

**Medium Risk:**
- Step 3 (Consolidation) - File moves, but to archive (reversible)

**High Risk:**
- Step 2 (Activate WebRTC) - Changes production code
  - **Mitigation:** Build in parallel first, feature flag, A/B test with beta testers

**Recommended approach:**
- Do Steps 1, 4, 5 first (verification + docs)
- Show Kelly the working prototype
- Get go/no-go for Steps 2-3 (production changes)

---

**End of Consolidation Plan**
**Next: Create concurrency prototype to verify architecture**
