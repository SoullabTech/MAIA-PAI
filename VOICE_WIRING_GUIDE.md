# MAIA Voice - Production Wiring Guide

**Goal:** Wire the proven prototype architecture into production
**Time:** 15 hours total
**Risk:** Medium (mitigated with feature flags)

---

## Pre-Flight: What We Have vs. What We Need

### ✅ What We Have (Already Built)
1. **Prototype** - Working demo at `/app/experiments/voice-loop`
2. **WebRTC Foundation** - `lib/voice/MaiaRealtimeWebRTC.ts` (exists, not activated)
3. **Architecture Proof** - Event bus + Zustand + parallel layers work
4. **Documentation** - Complete plan in VOICE_CONSOLIDATION_PLAN.md

### 🔨 What We Need to Build
1. **Event Bus** - `lib/voice/VoiceBus.ts` (new)
2. **State Store** - `lib/voice/state/ConversationState.ts` (Zustand)
3. **Engines** - Merge sophistication into 3 clean engines
4. **Hook Refactor** - Update `useMaiaVoice.ts` to use new architecture
5. **Feature Flag** - Toggle between old/new system

---

## The 5-Step Wiring Plan

### Step 1: Create Event Bus (30 min)

**File:** `lib/voice/VoiceBus.ts`

```typescript
import mitt, { Emitter } from 'mitt';

// Voice event types
export type VoiceEvent =
  | { type: 'mic_start'; timestamp: number }
  | { type: 'transcript_interim'; text: string; timestamp: number }
  | { type: 'transcript_complete'; text: string; timestamp: number }
  | { type: 'processing_start'; mode: 'scribe' | 'active' | 'full'; timestamp: number }
  | { type: 'processing_complete'; response: string; timestamp: number }
  | { type: 'tts_start'; text: string; timestamp: number }
  | { type: 'audio_start'; timestamp: number }
  | { type: 'audio_end'; timestamp: number }
  | { type: 'error'; error: Error; stage: string; timestamp: number }
  | { type: 'mode_switch'; mode: 'scribe' | 'active' | 'full' }
  | { type: 'interrupt'; timestamp: number };

// Create singleton event bus
export const voiceBus: Emitter<Record<VoiceEvent['type'], VoiceEvent>> = mitt();

// Helper: Emit with automatic timestamp
export function emit<T extends VoiceEvent['type']>(
  type: T,
  data: Omit<Extract<VoiceEvent, { type: T }>, 'type'>
) {
  voiceBus.emit(type, { type, ...data } as any);
}

// Helper: Type-safe subscription
export function subscribe<T extends VoiceEvent['type']>(
  type: T,
  handler: (event: Extract<VoiceEvent, { type: T }>) => void
) {
  voiceBus.on(type, handler as any);
  return () => voiceBus.off(type, handler as any);
}

// Debug logging (disable in production)
if (process.env.NODE_ENV === 'development') {
  voiceBus.on('*', (type, event) => {
    console.log(`[VOICE_BUS] ${type}`, event);
  });
}
```

**Test:**
```typescript
import { emit, subscribe } from './VoiceBus';

// Subscribe
const unsubscribe = subscribe('transcript_complete', (event) => {
  console.log('Transcript:', event.text);
});

// Emit
emit('transcript_complete', { text: 'Hello world', timestamp: Date.now() });

// Cleanup
unsubscribe();
```

---

### Step 2: Create State Store (45 min)

**File:** `lib/voice/state/ConversationState.ts`

```typescript
import { create } from 'zustand';

export type VoiceMode = 'scribe' | 'active' | 'full';

export interface ConversationMessage {
  role: 'user' | 'maia';
  text: string;
  timestamp: number;
  element?: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  affect?: 'joy' | 'sadness' | 'anger' | 'fear' | 'neutral';
}

export interface TimingMetric {
  stage: string;
  timestamp: number;
  delta?: number;
}

interface ConversationState {
  // Mode
  mode: VoiceMode;
  setMode: (mode: VoiceMode) => void;

  // Conversation history
  history: ConversationMessage[];
  addMessage: (message: Omit<ConversationMessage, 'timestamp'>) => void;
  clearHistory: () => void;

  // Current state
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  setListening: (listening: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setSpeaking: (speaking: boolean) => void;

  // Current transcript (accumulating)
  currentTranscript: string;
  setCurrentTranscript: (text: string) => void;
  appendTranscript: (text: string) => void;

  // Performance tracking
  timings: TimingMetric[];
  addTiming: (stage: string, timestamp: number) => void;
  clearTimings: () => void;

  // Elemental state
  currentElement: 'fire' | 'water' | 'earth' | 'air' | 'aether' | null;
  setCurrentElement: (element: ConversationState['currentElement']) => void;

  // Error tracking
  lastError: Error | null;
  setError: (error: Error | null) => void;
}

export const useConversationState = create<ConversationState>((set, get) => ({
  // Mode
  mode: 'active',
  setMode: (mode) => {
    set({ mode });
    console.log(`[CONVERSATION_STATE] Mode: ${mode}`);
  },

  // History
  history: [],
  addMessage: (message) => set((state) => ({
    history: [
      ...state.history,
      { ...message, timestamp: Date.now() }
    ]
  })),
  clearHistory: () => set({ history: [] }),

  // State flags
  isListening: false,
  isProcessing: false,
  isSpeaking: false,
  setListening: (isListening) => set({ isListening }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),

  // Transcript
  currentTranscript: '',
  setCurrentTranscript: (currentTranscript) => set({ currentTranscript }),
  appendTranscript: (text) => set((state) => ({
    currentTranscript: state.currentTranscript + ' ' + text
  })),

  // Timings
  timings: [],
  addTiming: (stage, timestamp) => set((state) => {
    const prevTiming = state.timings[state.timings.length - 1];
    const newTiming: TimingMetric = {
      stage,
      timestamp,
      delta: prevTiming ? timestamp - prevTiming.timestamp : undefined
    };
    console.log(`[TIMING] ${stage}: ${timestamp}ms (Δ ${newTiming.delta || 0}ms)`);
    return { timings: [...state.timings, newTiming] };
  }),
  clearTimings: () => set({ timings: [] }),

  // Elemental
  currentElement: null,
  setCurrentElement: (currentElement) => set({ currentElement }),

  // Errors
  lastError: null,
  setError: (lastError) => set({ lastError }),
}));

// Selectors for optimized access
export const selectMode = (state: ConversationState) => state.mode;
export const selectHistory = (state: ConversationState) => state.history;
export const selectIsActive = (state: ConversationState) =>
  state.isListening || state.isProcessing || state.isSpeaking;
```

---

### Step 3: Create Engines (3 hours)

#### A. Elemental Engine

**File:** `lib/voice/engines/ElementalEngine.ts`

```typescript
// Merge: ElementalVoiceOrchestrator.ts, elementalDetect.ts,
//        ElementalPhrasebook.ts, ElementalMetaphors.ts

import { ConversationMessage } from '../state/ConversationState';

export type Element = 'fire' | 'water' | 'earth' | 'air' | 'aether';

export class ElementalEngine {
  // Detect element from user's text
  detect(text: string, history: ConversationMessage[] = []): Element {
    const lower = text.toLowerCase();

    // Fire: urgency, action, intensity
    if (/\b(urgent|now|fast|angry|passionate|intense)\b/.test(lower)) {
      return 'fire';
    }

    // Water: emotion, flow, feeling
    if (/\b(feel|emotion|flow|sad|tears|heart)\b/.test(lower)) {
      return 'water';
    }

    // Earth: grounding, practical, stability
    if (/\b(ground|stable|practical|body|solid|real)\b/.test(lower)) {
      return 'earth';
    }

    // Air: thought, clarity, mental
    if (/\b(think|idea|clear|mind|understand|concept)\b/.test(lower)) {
      return 'air';
    }

    // Aether: spiritual, transcendent, mystery
    if (/\b(spirit|divine|mystery|soul|transcend|sacred)\b/.test(lower)) {
      return 'aether';
    }

    // Default: check history context
    if (history.length > 0) {
      const recent = history.slice(-3);
      const elementCounts = recent.reduce((acc, msg) => {
        if (msg.element) acc[msg.element] = (acc[msg.element] || 0) + 1;
        return acc;
      }, {} as Record<Element, number>);

      const dominant = Object.entries(elementCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] as Element;

      if (dominant) return dominant;
    }

    return 'air'; // Default to air (mental/neutral)
  }

  // Get system prompt for element
  getPrompt(element: Element, basePrompt: string): string {
    const elementalModifiers = {
      fire: 'Respond with energy and directness. Be action-oriented and passionate.',
      water: 'Respond with emotional attunement and flow. Be empathetic and gentle.',
      earth: 'Respond with grounding and practicality. Be stable and concrete.',
      air: 'Respond with clarity and precision. Be thoughtful and articulate.',
      aether: 'Respond with depth and mystery. Be contemplative and expansive.'
    };

    return `${basePrompt}\n\nElemental tone: ${elementalModifiers[element]}`;
  }

  // Get metaphors for element
  getMetaphor(element: Element): string[] {
    const metaphors = {
      fire: ['like a flame', 'with heat', 'burning bright', 'igniting'],
      water: ['like a river', 'flowing', 'deep waters', 'tides'],
      earth: ['rooted', 'solid ground', 'foundations', 'growing'],
      air: ['like wind', 'clarity', 'breath', 'spacious'],
      aether: ['transcendent', 'infinite', 'sacred', 'beyond']
    };

    return metaphors[element];
  }
}

// Singleton instance
export const elementalEngine = new ElementalEngine();
```

#### B. Prosody Engine

**File:** `lib/voice/engines/ProsodyEngine.ts`

```typescript
// Merge: ProsodyCurves.ts, PacingModulation.ts, EmotionalVoiceModulation.ts

import { Element } from './ElementalEngine';

export type Emotion = 'joy' | 'sadness' | 'anger' | 'fear' | 'neutral';

export class ProsodyEngine {
  // Add SSML-like markers for prosody (WebRTC will use these)
  modulate(text: string, element: Element, emotion: Emotion = 'neutral'): string {
    // Add pauses for emphasis
    text = this.addPauses(text);

    // Adjust pacing based on element
    text = this.adjustPacing(text, element);

    // Add emotional markers
    text = this.addEmotionalMarkers(text, emotion);

    return text;
  }

  private addPauses(text: string): string {
    // Add pauses after punctuation
    return text
      .replace(/\. /g, '. ... ') // Long pause after sentences
      .replace(/\, /g, ', .. ')  // Medium pause after commas
      .replace(/\? /g, '? ... ') // Long pause after questions
      .replace(/\! /g, '! ... '); // Long pause after exclamations
  }

  private adjustPacing(text: string, element: Element): string {
    // Element affects speech rate
    // Note: This is conceptual - WebRTC doesn't support all SSML tags
    // But we can structure text to hint at pacing

    const pacing = {
      fire: 'fast', // Quick, energetic
      water: 'slow', // Gentle, flowing
      earth: 'medium', // Steady, grounded
      air: 'medium-fast', // Clear, efficient
      aether: 'slow' // Contemplative, spacious
    };

    // For now, return text as-is
    // Future: integrate with TTS provider that supports prosody
    return text;
  }

  private addEmotionalMarkers(text: string, emotion: Emotion): string {
    // Add emotional context (conceptual for now)
    // Future: integrate with emotional TTS

    const emotionalPrefix = {
      joy: '',
      sadness: '',
      anger: '',
      fear: '',
      neutral: ''
    };

    return emotionalPrefix[emotion] + text;
  }

  // Detect affect from text
  detectAffect(text: string): Emotion {
    const lower = text.toLowerCase();

    if (/\b(happy|joy|excited|great|love|wonderful)\b/.test(lower)) {
      return 'joy';
    }

    if (/\b(sad|depressed|down|hurt|loss|grief)\b/.test(lower)) {
      return 'sadness';
    }

    if (/\b(angry|mad|furious|rage|hate)\b/.test(lower)) {
      return 'anger';
    }

    if (/\b(afraid|scared|fear|anxious|worried|panic)\b/.test(lower)) {
      return 'fear';
    }

    return 'neutral';
  }
}

// Singleton instance
export const prosodyEngine = new ProsodyEngine();
```

---

### Step 4: Wire WebRTC to Hook (2 hours)

**File:** `app/hooks/useMaiaVoice.ts` (refactor)

```typescript
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { MaiaRealtimeWebRTC } from '@/lib/voice/MaiaRealtimeWebRTC';
import { useConversationState, VoiceMode } from '@/lib/voice/state/ConversationState';
import { emit, subscribe } from '@/lib/voice/VoiceBus';
import { elementalEngine } from '@/lib/voice/engines/ElementalEngine';
import { prosodyEngine } from '@/lib/voice/engines/ProsodyEngine';

export function useMaiaVoice() {
  const webrtcRef = useRef<MaiaRealtimeWebRTC | null>(null);

  const {
    mode,
    setMode,
    isListening,
    isProcessing,
    isSpeaking,
    setListening,
    setProcessing,
    setSpeaking,
    currentTranscript,
    setCurrentTranscript,
    appendTranscript,
    addMessage,
    history,
    currentElement,
    setCurrentElement,
    addTiming,
    clearTimings,
    setError
  } = useConversationState();

  // Initialize WebRTC
  useEffect(() => {
    const webrtc = new MaiaRealtimeWebRTC({
      voice: 'shimmer',
      systemPrompt: 'You are MAIA, a consciousness companion.',

      onTranscript: (text, isUser) => {
        if (isUser) {
          emit('transcript_interim', { text, timestamp: Date.now() });
          appendTranscript(text);
        }
      },

      onAudioStart: () => {
        emit('audio_start', { timestamp: Date.now() });
        setSpeaking(true);
      },

      onAudioEnd: () => {
        emit('audio_end', { timestamp: Date.now() });
        setSpeaking(false);
      },

      onError: (error) => {
        emit('error', { error, stage: 'webrtc', timestamp: Date.now() });
        setError(error);
      }
    });

    webrtcRef.current = webrtc;

    return () => {
      webrtc.disconnect();
    };
  }, [appendTranscript, setSpeaking, setError]);

  // Subscribe to transcript completion
  useEffect(() => {
    return subscribe('transcript_complete', async (event) => {
      const { text, timestamp } = event;

      emit('processing_start', { mode, timestamp: Date.now() });
      setProcessing(true);

      try {
        // Detect element
        const element = elementalEngine.detect(text, history);
        setCurrentElement(element);

        // Detect affect
        const affect = prosodyEngine.detectAffect(text);

        // Add user message to history
        addMessage({ role: 'user', text, element, affect });

        // Generate response based on mode
        let response = '';

        if (mode === 'scribe') {
          // No response
          response = '';
        } else if (mode === 'active') {
          // Lightweight acknowledgment
          response = 'I hear you.';
        } else if (mode === 'full') {
          // Full MAIA response
          const prompt = elementalEngine.getPrompt(element, 'You are MAIA.');

          // Call Oracle API
          const apiResponse = await fetch('/api/oracle/personal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text,
              systemPrompt: prompt,
              element,
              history: history.slice(-5) // Last 5 messages
            })
          });

          const data = await apiResponse.json();
          response = data.response || 'I\'m here.';

          // Apply prosody
          response = prosodyEngine.modulate(response, element, affect);
        }

        emit('processing_complete', { response, timestamp: Date.now() });
        setProcessing(false);

        if (response) {
          // Add MAIA message to history
          addMessage({ role: 'maia', text: response, element, affect });

          // Send to WebRTC for TTS + playback
          emit('tts_start', { text: response, timestamp: Date.now() });

          // WebRTC handles TTS internally
          // Just need to update system prompt if element changed
          if (webrtcRef.current && element !== currentElement) {
            const newPrompt = elementalEngine.getPrompt(element, 'You are MAIA.');
            // Note: MaiaRealtimeWebRTC needs updateSystemPrompt method
            // webrtcRef.current.updateSystemPrompt(newPrompt);
          }
        }
      } catch (error) {
        console.error('[useMaiaVoice] Processing error:', error);
        emit('error', { error: error as Error, stage: 'processing', timestamp: Date.now() });
        setError(error as Error);
        setProcessing(false);
      }
    });
  }, [mode, history, currentElement, addMessage, setCurrentElement, setProcessing, setError]);

  // Start listening
  const start = useCallback(async () => {
    if (!webrtcRef.current || isListening) return;

    try {
      clearTimings();
      emit('mic_start', { timestamp: Date.now() });

      await webrtcRef.current.connect();
      setListening(true);
    } catch (error) {
      console.error('[useMaiaVoice] Start error:', error);
      setError(error as Error);
    }
  }, [isListening, clearTimings, setListening, setError]);

  // Stop listening
  const stop = useCallback(() => {
    if (!webrtcRef.current || !isListening) return;

    webrtcRef.current.disconnect();
    setListening(false);
  }, [isListening, setListening]);

  // Complete current transcript
  const completeTranscript = useCallback(() => {
    if (currentTranscript.trim()) {
      emit('transcript_complete', {
        text: currentTranscript.trim(),
        timestamp: Date.now()
      });
      setCurrentTranscript('');
    }
  }, [currentTranscript, setCurrentTranscript]);

  // Interrupt MAIA
  const interrupt = useCallback(() => {
    if (isSpeaking && webrtcRef.current) {
      emit('interrupt', { timestamp: Date.now() });
      // WebRTC needs interrupt method
      // webrtcRef.current.interrupt();
    }
  }, [isSpeaking]);

  return {
    // State
    mode,
    isListening,
    isProcessing,
    isSpeaking,
    currentTranscript,
    currentElement,

    // Actions
    start,
    stop,
    setMode,
    completeTranscript,
    interrupt
  };
}
```

---

### Step 5: Feature Flag & Testing (1 hour)

**File:** `lib/voice/FeatureFlags.ts`

```typescript
export const VOICE_FEATURE_FLAGS = {
  // Use new parallel voice architecture
  USE_PARALLEL_VOICE: process.env.NEXT_PUBLIC_USE_PARALLEL_VOICE === 'true',

  // Enable performance metrics
  SHOW_VOICE_METRICS: process.env.NEXT_PUBLIC_SHOW_VOICE_METRICS === 'true',

  // Enable mode switching UI
  SHOW_MODE_SWITCHER: process.env.NEXT_PUBLIC_SHOW_MODE_SWITCHER === 'true',
};

// Helper to check if user is in beta group for new voice
export function isInVoiceBeta(userId?: string): boolean {
  if (!userId) return false;

  // A/B test: 10% of users get new voice
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 10 === 0;
}
```

**Environment variables** (`.env.local`):
```bash
# Voice feature flags
NEXT_PUBLIC_USE_PARALLEL_VOICE=false  # Set to true to enable
NEXT_PUBLIC_SHOW_VOICE_METRICS=true   # Show performance panel
NEXT_PUBLIC_SHOW_MODE_SWITCHER=true   # Show mode switcher
```

---

## Testing Checklist

### Phase 1: Unit Tests (1 hour)
- [ ] Test VoiceBus emit/subscribe
- [ ] Test ConversationState store
- [ ] Test ElementalEngine.detect()
- [ ] Test ProsodyEngine.modulate()

### Phase 2: Integration Tests (2 hours)
- [ ] Test WebRTC connection
- [ ] Test transcript → processing → TTS flow
- [ ] Test mode switching (Scribe/Active/Full)
- [ ] Test interruption
- [ ] Test error handling

### Phase 3: A/B Testing (1 week)
- [ ] Deploy with feature flag OFF
- [ ] Enable for 5 beta users
- [ ] Monitor Sentry for errors
- [ ] Collect latency metrics
- [ ] Survey user satisfaction

### Phase 4: Full Rollout (1 week)
- [ ] Enable for all beta users
- [ ] Monitor for 3 days
- [ ] Collect feedback
- [ ] Iterate on issues

---

## Migration Timeline

### Week 1 (15 hours)
**Day 1-2:**
- [ ] Step 1: Create VoiceBus.ts (30 min)
- [ ] Step 2: Create ConversationState.ts (45 min)
- [ ] Step 3: Create engines (3 hours)
  - [ ] ElementalEngine.ts
  - [ ] ProsodyEngine.ts
- [ ] Step 4: Refactor useMaiaVoice.ts (2 hours)
- [ ] Step 5: Add feature flags (1 hour)

**Day 3-4:**
- [ ] Unit tests (1 hour)
- [ ] Integration tests (2 hours)
- [ ] Fix bugs found in testing (2 hours)

**Day 5:**
- [ ] Deploy with feature flag OFF
- [ ] Enable for self-testing
- [ ] Documentation updates (1 hour)

### Week 2 (A/B Testing)
- [ ] Enable for 5 beta users
- [ ] Monitor Sentry daily
- [ ] Collect feedback
- [ ] Fix critical issues

### Week 3 (Full Rollout)
- [ ] Enable for all 32 beta users
- [ ] Monitor metrics
- [ ] Iterate based on feedback
- [ ] Set feature flag to default ON

---

## Rollback Plan

If issues arise:

1. **Immediate rollback:**
   ```bash
   # Set in Vercel environment variables
   NEXT_PUBLIC_USE_PARALLEL_VOICE=false
   ```

2. **Per-user rollback:**
   ```typescript
   // In FeatureFlags.ts, add to blocklist
   const VOICE_BETA_BLOCKLIST = ['user-id-1', 'user-id-2'];

   export function isInVoiceBeta(userId?: string): boolean {
     if (VOICE_BETA_BLOCKLIST.includes(userId)) return false;
     // ... rest of logic
   }
   ```

3. **Full rollback:**
   - Revert commits
   - Deploy previous version
   - Communicate to beta users

---

## Success Metrics

### Performance
- [ ] Scribe mode: < 100ms latency
- [ ] Active mode: < 2s latency
- [ ] Full mode: < 8s latency
- [ ] No increase in error rate

### User Experience
- [ ] 80%+ report voice feels more responsive
- [ ] 90%+ can interrupt MAIA successfully
- [ ] 95%+ mode switching works smoothly

### Technical
- [ ] Zero React hooks violations (#425, #422)
- [ ] Zero production crashes
- [ ] < 1% API error rate

---

## Files to Create

1. `lib/voice/VoiceBus.ts` (new)
2. `lib/voice/state/ConversationState.ts` (new)
3. `lib/voice/engines/ElementalEngine.ts` (new)
4. `lib/voice/engines/ProsodyEngine.ts` (new)
5. `lib/voice/FeatureFlags.ts` (new)
6. `app/hooks/useMaiaVoice.ts` (refactor existing)

## Files to Archive

Move to `lib/voice/archive/legacy-oct2025/`:
- 55 files listed in VOICE_CONSOLIDATION_PLAN.md

---

**Ready to wire it up?** Start with Step 1 (VoiceBus.ts) and work through sequentially.

Each step is tested before moving to the next. No big-bang integration - we wire one layer at a time.

🔌 **Let's plug this in!**
