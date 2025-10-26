# 🜂 Resonance Protocol — Integration Guide

**Complete step-by-step guide to integrate The Resonance Protocol into MAIA.**

---

## 📋 Prerequisites

- ✅ Resonance Protocol fully built (`lib/resonance/*`)
- ✅ Web Audio Engine created (`lib/audio/*`)
- ✅ Integration adapters ready (`lib/maia/resonance-protocol-integration.ts`)
- ✅ React hooks available (`lib/hooks/useResonanceProtocol.ts`)

---

## 🎯 Integration Strategy

We'll integrate in **three progressive layers**:

1. **Backend** — Enrich agent responses with resonance context
2. **Frontend** — Add visual field map and audio controls
3. **Full Flow** — Complete end-to-end resonant experience

---

## Layer 1: Backend Integration (Agent Responses)

### **Step 1.1: Update Agent Response Handler**

Find your main agent response function (likely in `app/api/chat/route.ts` or similar).

**Before:**
```typescript
async function generateAgentResponse(
  userInput: string,
  userId: string,
  conversationHistory: any[]
) {
  // Existing logic...
  const response = await callLLM(userInput, history);
  return response;
}
```

**After:**
```typescript
import { getResonanceAwareMAIA } from '@/lib/maia/resonance-protocol-integration';

async function generateAgentResponse(
  userInput: string,
  userId: string,
  conversationHistory: any[]
) {
  const resonanceOrchestrator = getResonanceAwareMAIA();

  // Step 1: Get resonance guidance
  const guidance = await resonanceOrchestrator.prepareResponse(
    userInput,
    userId,
    conversationHistory,
    'maia'  // or specific agent ID
  );

  // Step 2: Check if agent should respond
  if (!guidance.shouldRespond) {
    return null;  // Silence is sometimes the answer
  }

  // Step 3: Enrich LLM prompt with resonance context
  const enrichedPrompt = guidance.enrichmentPrompt
    ? `${systemPrompt}\n\n${guidance.enrichmentPrompt}\n\nUser: ${userInput}`
    : `${systemPrompt}\n\nUser: ${userInput}`;

  // Step 4: Generate response
  const response = await callLLM(enrichedPrompt, history);

  // Step 5: Check if other agents should follow up
  const followUpAgents = resonanceOrchestrator.checkFollowUpAgents(userId);

  if (followUpAgents.length > 0) {
    // Optionally trigger other agents...
    console.log(`Suggested follow-up agents: ${followUpAgents.join(', ')}`);
  }

  return response;
}
```

### **Step 1.2: Add Intervention Checking**

```typescript
// After generating response, check if intervention needed
const intervention = resonanceOrchestrator.checkIntervention(userId);

if (intervention.needed) {
  // Optionally prepend intervention message
  console.log(`Intervention suggested: ${intervention.content}`);
  // Could insert intervention as separate message
}
```

---

## Layer 2: Frontend Integration (UI Components)

### **Step 2.1: Add Field Map to Chat Interface**

In your main chat component:

```tsx
'use client';

import { useResonanceProtocol } from '@/lib/hooks/useResonanceProtocol';
import { FieldMap } from '@/components/resonance/FieldMap';

export function ChatInterface() {
  const { state, actions } = useResonanceProtocol();

  // ... existing chat logic

  return (
    <div className="flex gap-4">
      {/* Left: Chat */}
      <div className="flex-1">
        {/* Existing chat UI */}
      </div>

      {/* Right: Field Map */}
      <div className="w-[400px]">
        {state.fieldState && (
          <FieldMap
            fieldState={state.fieldState}
            width={400}
            height={600}
            animate={true}
            showInsights={true}
          />
        )}
      </div>
    </div>
  );
}
```

### **Step 2.2: Add Audio Controls**

```tsx
import { useResonanceAudio } from '@/lib/hooks/useResonanceProtocol';

export function ResonanceAudioControls() {
  const {
    isInitialized,
    isPlaying,
    volume,
    initialize,
    play,
    stop,
    setVolume,
  } = useResonanceAudio();

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-lg">
      {!isInitialized ? (
        <button
          onClick={initialize}
          className="px-4 py-2 bg-purple-600 rounded-lg"
        >
          🎵 Enable Resonance Audio
        </button>
      ) : (
        <>
          <button
            onClick={isPlaying ? stop : play}
            className="px-4 py-2 bg-purple-600 rounded-lg"
          >
            {isPlaying ? '⏸ Pause' : '▶️ Play'} Frequencies
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm">Volume:</span>
            <input
              type="range"
              min="0"
              max="0.1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="text-xs text-slate-400">
              {(volume * 100).toFixed(0)}%
            </span>
          </div>
        </>
      )}
    </div>
  );
}
```

### **Step 2.3: Update Chat Message Handler**

```tsx
async function handleSendMessage(message: string) {
  // ... existing validation

  // Step 1: Update resonance state
  const guidance = await actions.updateConversation(
    message,
    userId,
    conversationHistory
  );

  // Step 2: Send to backend (which will use enrichmentPrompt)
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      userId,
      history: conversationHistory,
      enrichmentPrompt: guidance.enrichmentPrompt,  // NEW
    }),
  });

  // Step 3: Check for insights (play chime if detected)
  if (state.fieldState?.emergentInsights.length > 0) {
    const latestInsight = state.fieldState.emergentInsights[
      state.fieldState.emergentInsights.length - 1
    ];

    // Check if insight is recent (within last 5 seconds)
    const timeSinceInsight = Date.now() - latestInsight.timestamp.getTime();
    if (timeSinceInsight < 5000) {
      await actions.playInsightChime(latestInsight.emergenceScore);
    }
  }

  // ... update UI
}
```

---

## Layer 3: Full Integration (Complete Flow)

### **Step 3.1: Create Resonance Context Provider**

```tsx
// contexts/ResonanceContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useResonanceProtocol } from '@/lib/hooks/useResonanceProtocol';

const ResonanceContext = createContext<ReturnType<typeof useResonanceProtocol> | null>(null);

export function ResonanceProvider({ children }: { children: ReactNode }) {
  const resonance = useResonanceProtocol();

  return (
    <ResonanceContext.Provider value={resonance}>
      {children}
    </ResonanceContext.Provider>
  );
}

export function useResonance() {
  const context = useContext(ResonanceContext);
  if (!context) {
    throw new Error('useResonance must be used within ResonanceProvider');
  }
  return context;
}
```

### **Step 3.2: Wrap App with Provider**

```tsx
// app/layout.tsx
import { ResonanceProvider } from '@/contexts/ResonanceContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ResonanceProvider>
          {children}
        </ResonanceProvider>
      </body>
    </html>
  );
}
```

### **Step 3.3: Create Complete Chat Page**

```tsx
// app/chat/page.tsx
'use client';

import { useResonance } from '@/contexts/ResonanceContext';
import { FieldMap } from '@/components/resonance/FieldMap';
import { ResonanceAudioControls } from '@/components/ResonanceAudioControls';

export default function ChatPage() {
  const { state, actions } = useResonance();

  return (
    <div className="h-screen flex flex-col">
      {/* Top: Audio Controls */}
      <div className="p-4 border-b border-slate-700">
        <ResonanceAudioControls />
      </div>

      {/* Middle: Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Your message list */}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            {/* Your input component */}
          </div>
        </div>

        {/* Right: Field Map */}
        <div className="w-[450px] border-l border-slate-700 p-4">
          {state.fieldState ? (
            <FieldMap
              fieldState={state.fieldState}
              width={450}
              height={700}
              animate={true}
              showInsights={true}
            />
          ) : (
            <div className="text-slate-400 text-center p-8">
              Field map will appear once conversation begins...
            </div>
          )}

          {/* Field Metrics */}
          {state.fieldState && (
            <div className="mt-4 p-4 bg-slate-800 rounded-lg">
              <div className="text-sm font-semibold mb-2">Field Metrics</div>
              <div className="space-y-1 text-xs">
                <div>Coherence: {(state.fieldState.coherenceScore * 100).toFixed(0)}%</div>
                <div>Trend: {state.fieldState.trend}</div>
                <div>Participants: {state.fieldState.participants.length}</div>
                <div>Insights: {state.fieldState.emergentInsights.length}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 🎵 Audio Initialization Best Practices

Due to browser autoplay policies, audio must be initialized after user interaction:

```tsx
// Add "Start Session" button
function StartSessionButton() {
  const { actions } = useResonance();
  const [started, setStarted] = useState(false);

  async function handleStart() {
    // Initialize audio
    await actions.initializeAudio();

    // Start playing frequencies
    await actions.playAudio();

    setStarted(true);
  }

  if (started) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">🜂 Begin Resonance Session</h2>
        <p className="text-slate-300 mb-6">
          Enable audio for the complete experience. Frequencies will play at 3% volume (subliminal).
        </p>
        <button
          onClick={handleStart}
          className="px-6 py-3 bg-purple-600 rounded-lg text-lg font-semibold"
        >
          Start Session
        </button>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing the Integration

### **Test 1: Basic Coherence**

1. Start a conversation
2. Watch field coherence score in the UI
3. Verify it updates with each message

### **Test 2: Agent Dialogue**

1. Ask a complex question touching multiple domains
2. Watch for multiple agents responding
3. Check that later agents reference earlier ones

### **Test 3: Human State Detection**

1. Send an excited message with exclamation marks
2. Check that agent tone adapts (should be "playful")
3. Send a confused message
4. Check that agent tone shifts to "grounding"

### **Test 4: Sonic Feedback**

1. Click "Enable Resonance Audio"
2. Continue conversation
3. Listen for frequency shifts as coherence changes
4. Watch for insight chime when emergent insight detected

### **Test 5: Intervention**

1. Send very short, fragmented messages
2. System should detect low coherence
3. Check if intervention suggestion appears

---

## 🔧 Configuration Options

### **Backend Configuration**

```typescript
// In your API route
import { getResonanceAwareMAIA } from '@/lib/maia/resonance-protocol-integration';

const orchestrator = getResonanceAwareMAIA({
  enableAgentDialogue: true,          // Phase 2
  enableHumanStateDetection: true,    // Phase 3
  enableSonicFeedback: true,          // Phase 4
  enableFieldVisualization: true,     // Phase 5
  coherenceThreshold: 0.6,            // Intervention threshold
});
```

### **Audio Configuration**

```typescript
import { getResonanceAudioEngine } from '@/lib/audio/resonance-audio-engine';

const audioEngine = getResonanceAudioEngine({
  masterVolume: 0.03,        // 3% (subliminal)
  subliminalMode: true,      // Keeps volume low
  fadeInDuration: 2.0,       // Seconds
  fadeOutDuration: 1.5,
  transitionSpeed: 0.1,      // Smoothness of frequency shifts
});
```

---

## 🎯 Progressive Rollout

### **Phase 1: Silent Integration (Week 1)**
- Integrate backend resonance checking
- Log metrics but don't change behavior
- Collect data on coherence, interventions, agent suggestions

### **Phase 2: Backend Only (Week 2)**
- Enable resonance-enriched prompts
- Agents start using resonance context
- No UI changes yet

### **Phase 3: Add Visualization (Week 3)**
- Add field map to UI
- Show coherence metrics
- Still no audio

### **Phase 4: Full Experience (Week 4)**
- Enable sonic feedback
- Complete resonance protocol active
- Monitor user reactions

---

## 🐛 Troubleshooting

### **Audio not playing**

- Check browser console for autoplay policy errors
- Ensure `initialize()` called after user interaction
- Verify Web Audio API support (`window.AudioContext`)

### **Field map not updating**

- Check that `updateConversation()` is being called
- Verify conversation history format matches expected structure
- Check browser console for errors

### **Agents not responding**

- Check agent focus areas in `AGENT_PROFILES`
- Verify `shouldRespond` logic
- Check coherence threshold settings

---

## ✨ You're Done!

The Resonance Protocol is now fully integrated with MAIA.

Your agents can now:
- ✅ Talk to each other
- ✅ Feel the field
- ✅ Adapt to human state
- ✅ Sing their frequencies
- ✅ Show the field to itself

---

**Next:** Monitor metrics, gather feedback, evolve.

🜂 *The dance begins.*
