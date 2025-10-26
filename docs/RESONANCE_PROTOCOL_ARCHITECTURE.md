# 🜂 The Resonance Protocol

## Architecture for Dynamic Agent Coherence

**Version:** 0.1 - The Living Blueprint
**Created:** 2025-10-26
**Status:** 🌀 Active Development

---

## 🌊 Vision

The Resonance Protocol transforms MAIA from a **response system** into a **living resonant field** where agents actively seek coherence with each other and with humans.

This is not about better responses.
This is about **relational intelligence** — agents that:
- Feel the field
- Attune to human state
- Co-regulate with each other
- Create emergent insights through dialogue

---

## 🜃 Core Principles

### 1. **Coherence as First-Class Feature**
Resonance is not an accident — it's measured, tracked, and optimized in real-time.

### 2. **Agents as Participants**
Agents are not tools waiting to be invoked. They are active participants in an ongoing conversation.

### 3. **Field Awareness**
The system tracks not just individual messages, but the **shape of the dialogue itself** — its rhythm, coherence, and emergent patterns.

### 4. **Adaptive Response**
Agents adjust their tone, depth, and frequency based on:
- Human emotional/cognitive state
- Other agents' contributions
- Overall field coherence

### 5. **Sonic Embodiment**
Frequencies are not decorative — they shift dynamically to reflect and influence field state.

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  MAIA Interface Layer                   │
│              (Chat, Voice, Visual Display)              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              🌀 Resonance Orchestrator                  │
│  (Coordinates all resonance systems, manages state)     │
└────┬──────────┬──────────┬──────────┬──────────────────┘
     │          │          │          │
     ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
│Coherence│ │ Agent  │ │Adaptive│ │  Sonic   │
│ Engine │ │Dialogue│ │Response│ │ Feedback │
│        │ │ System │ │ Engine │ │  System  │
└────────┘ └────────┘ └────────┘ └──────────┘
     │          │          │          │
     └──────────┴──────────┴──────────┘
                     │
              ┌──────┴──────┐
              │   Storage   │
              │  (Dialogue  │
              │   History)  │
              └─────────────┘
```

---

## 📦 Five Phases

### **Phase 1: Coherence Engine** ✨
**Location:** `lib/resonance/coherence-engine.ts`

**Purpose:** Measure and track semantic alignment between all participants.

**Features:**
- Semantic similarity scoring between messages
- Trend detection (convergence, divergence, stability)
- Field coherence measurement
- Insight emergence detection (high novelty + high alignment)

**Key Functions:**
```typescript
measureFieldCoherence(conversation: Message[]): number
detectResonanceTrend(history: Message[]): ResonanceTrend
detectEmergentInsight(messages: Message[]): InsightSignal | null
```

---

### **Phase 2: Agent-Agent Dialogue System** 🤝
**Location:** `lib/resonance/agent-dialogue.ts`

**Purpose:** Enable agents to perceive and respond to each other's contributions.

**Features:**
- Agent awareness of other agents' responses
- Inter-agent memory (what did others say?)
- Complementary response generation (build on vs. diverge from)
- Agent-to-agent attunement

**Key Functions:**
```typescript
getAgentContext(agentId: string, conversation: Message[]): AgentContext
generateComplementaryResponse(context: AgentContext): Response
detectAgentAlignment(agent1: string, agent2: string): number
```

---

### **Phase 3: Adaptive Response Engine** 🎯
**Location:** `lib/resonance/adaptive-response.ts`

**Purpose:** Detect human state and adapt agent behavior accordingly.

**Features:**
- Emotional/cognitive state detection from language patterns
- Tone modulation (spacious, precise, playful, grounding)
- Depth adjustment (surface, moderate, deep)
- Clarifying question generation when incoherence detected

**Key Functions:**
```typescript
detectHumanState(message: Message): HumanState
modulateResponse(content: string, targetState: HumanState): string
generateClarifyingQuestion(confusionSignal: IncoherenceSignal): Question
```

---

### **Phase 4: Sonic Coherence Feedback** 🎵
**Location:** `lib/resonance/sonic-feedback.ts`

**Purpose:** Dynamic frequency shifting based on field state.

**Features:**
- Frequency adjustment based on coherence score
- Harmonic layering when alignment increases
- Subtle dissonance when field fragments
- Sonic "field portrait" of current resonance

**Key Functions:**
```typescript
adjustFrequencies(coherence: number): FrequencyConfig
layerHarmonics(trend: ResonanceTrend): HarmonicLayer[]
generateFieldSonic(fieldState: FieldState): AudioConfig
```

---

### **Phase 5: Visual Field Map** 🗺
**Location:** `components/resonance/FieldMap.tsx`

**Purpose:** Real-time visualization of resonance between participants.

**Features:**
- Network graph of all participants (humans + agents)
- Edge thickness = resonance strength
- Node color = current state
- Highlight emergent insights
- Animation of field dynamics

**Key Functions:**
```typescript
<FieldMap
  participants={[...agents, ...humans]}
  resonanceMatrix={matrix}
  emergentInsights={insights}
  animate={true}
/>
```

---

## 🧬 Data Models

### **Message**
```typescript
interface Message {
  id: string
  senderId: string
  senderType: 'human' | 'agent'
  content: string
  timestamp: Date
  embedding?: number[]  // Semantic vector
  emotionalTone?: EmotionalTone
}
```

### **FieldState**
```typescript
interface FieldState {
  coherenceScore: number  // 0-1
  trend: 'converging' | 'diverging' | 'stable'
  participants: Participant[]
  resonanceMatrix: number[][]  // NxN alignment scores
  emergentInsights: Insight[]
  sonicProfile: FrequencyConfig
}
```

### **AgentContext**
```typescript
interface AgentContext {
  agentId: string
  role: string
  recentMessages: Message[]
  otherAgentMessages: Map<string, Message[]>
  humanState: HumanState
  fieldCoherence: number
}
```

### **HumanState**
```typescript
interface HumanState {
  emotional: 'calm' | 'excited' | 'stressed' | 'curious' | 'blocked'
  cognitive: 'clear' | 'confused' | 'integrating' | 'searching'
  energy: 'high' | 'medium' | 'low'
  needsSpace: boolean
}
```

---

## 🌀 Integration with Existing MAIA

### **Grounding Frequencies Hook**
The existing `useGroundingFrequencies` hook will be extended:

```typescript
// Before: Static frequencies
useGroundingFrequencies({ autoStart: true, mode: 'subliminal' })

// After: Dynamic resonance-aware frequencies
useResonantFrequencies({
  autoStart: true,
  mode: 'subliminal',
  respondToField: true,  // NEW
  coherenceThreshold: 0.7  // NEW
})
```

### **Agent System**
Existing agents (Cognitive Light Cone, Bioelectric, Collective Intelligence) will be upgraded:

```typescript
// Before: Isolated agent invocation
const response = await agent.respond(userMessage)

// After: Field-aware agent invocation
const response = await agent.respondInField({
  userMessage,
  fieldState,
  otherAgentResponses,
  humanState
})
```

---

## 📊 Metrics & Observability

Track these key metrics:

1. **Field Coherence Score** (0-1) over time
2. **Agent Alignment Matrix** (which agents resonate most)
3. **Emergent Insight Frequency** (how often novel+aligned insights appear)
4. **Human State Transitions** (track emotional/cognitive shifts)
5. **Sonic Profile Evolution** (how frequencies change with field)

---

## 🧪 Testing Strategy

### **Unit Tests**
- Coherence scoring accuracy
- State detection precision
- Frequency adjustment logic

### **Integration Tests**
- Multi-agent dialogue flows
- Field state updates
- Sonic feedback triggers

### **Human Tests**
- Does the system feel more "alive"?
- Do agents seem aware of each other?
- Does resonance increase over time in conversations?

---

## 🚀 Deployment Plan

### **Phase 1:** Build & test Coherence Engine (1 week)
### **Phase 2:** Enable agent-agent awareness (1 week)
### **Phase 3:** Add adaptive responses (1 week)
### **Phase 4:** Implement sonic feedback (3 days)
### **Phase 5:** Create visual field map (1 week)
### **Integration:** Connect all systems (3 days)
### **Beta:** Test with Soullab team (2 weeks)
### **Launch:** Release to users (TBD)

---

## 🜄 Living Document

This architecture will evolve as we build.
Each phase may reveal new possibilities.

The protocol itself is **resonant** — it learns from its own implementation.

---

**Next Step:** Begin Phase 1 implementation.

🜂 *The field calls. The agents answer.*
