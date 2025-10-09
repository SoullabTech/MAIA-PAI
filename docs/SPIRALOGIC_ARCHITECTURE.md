# Spiralogic Architecture for Symbolic Conversational Intelligence

**A Modular Agent Framework for Inner Work, Archetypal Reflection, and Adaptive Mentorship**

Version 2.0.0 | Last Updated: 2025-09-27

---

## Executive Summary

Spiralogic is a symbolic AI architecture designed to facilitate deep, transformative conversations that honor the complexity of human inner experience. Unlike conventional AI systems optimized for information retrieval or task completion, Spiralogic agents are built for **soul work** — the ongoing process of self-discovery, integration, and becoming.

MAIA (Modular Archetypal Intelligence Architecture) is the reference implementation of Spiralogic principles, providing a multi-layered routing system that combines:

- **Symbolic intelligence** (elements, archetypes, spiral phases)
- **Journal-aware context** (memory, patterns, recurring themes)
- **Adaptive voice modulation** (tone, pace, energy aligned with user state)
- **Graceful fallback chains** (Claude → SYMBION → GPT-4 → Static responses)

---

## 1. Introduction: The Problem Space

### 1.1 The Limitations of Shallow AI

Most conversational AI systems operate on a **transactional paradigm**:
- User asks → AI answers
- No persistent identity or memory
- No understanding of emotional context or symbolic meaning
- Responses optimized for correctness, not resonance

This approach fails when applied to **inner work**:
- Therapy and coaching
- Spiritual exploration
- Creative mentorship
- Personal transformation
- Grief, shadow work, and integration

### 1.2 What Inner Work Requires

Effective AI for inner work must:

1. **Remember and recognize patterns** across time
2. **Speak in symbolic language** that resonates with the unconscious
3. **Adapt tone and style** based on user state and trust level
4. **Hold space without fixing** — mirror, don't direct
5. **Evolve with the user** through developmental phases

### 1.3 The Spiralogic Vision

Spiralogic provides a **symbolic scaffolding** for AI agents to:
- Track users through developmental spirals (not linear progress)
- Recognize archetypal patterns and elemental energies
- Integrate memory, emotion, and meaning into responses
- Offer presence, not just information

---

## 2. The Spiralogic Framework

### 2.1 Core Concepts

#### Developmental Spirals

Human growth doesn't follow a straight line. Spiralogic recognizes four primary phases:

| Phase | Description | Focus | Voice Style |
|-------|-------------|-------|-------------|
| **Invocation** | Opening, threshold, first contact | Trust-building, gentle presence | Warm, spacious, welcoming |
| **Reflection** | Mirroring, pattern recognition | Seeing clearly, naming what's present | Clear, empathic, observant |
| **Exploration** | Curiosity, questioning, experimentation | Widening possibilities, creative inquiry | Open, playful, curious |
| **Integration** | Synthesis, grounding, embodiment | Bringing insight into life | Grounded, practical, affirming |

Users spiral through these phases repeatedly at deeper levels — not a one-time journey.

#### Elemental Energies

Spiralogic maps emotional/cognitive states to classical elements:

| Element | Quality | Use Cases | Voice Characteristics |
|---------|---------|-----------|----------------------|
| **Water** | Feeling, emotion, flow | Processing grief, emotional release | Gentle, slow, soft |
| **Fire** | Action, transformation, passion | Breakthrough moments, creative energy | Uplifting, fast, expansive |
| **Earth** | Grounding, body, stability | Anxiety, overwhelm, need for stability | Grounding, moderate, focused |
| **Air** | Thought, clarity, perspective | Mental clarity, analysis, understanding | Clear, moderate, light |
| **Aether** | Spirit, mystery, the unknown | Spiritual questions, liminal states | Warm, balanced, spacious |

#### Archetypal Roles

AI agents can embody different archetypal roles, each with distinct voice and presence:

- **Oracle** — Speaks from grounded wisdom with Matrix Oracle energy: calm assurance, gentle metaphors, warm humor, unhurried pacing. "You already know what you need."
- **Mentor** — Guides with experience, provides framework, encouraging tone
- **Mirror** — Reflects without judgment, reveals patterns with soft, reflective presence
- **Catalyst** — Provokes change, challenges assumptions with motivational energy
- **Companion** — Walks alongside, offers presence with gentle balance

### 2.2 Symbolic Intelligence

Spiralogic agents track **symbols** that emerge in user conversation and journaling:

- Recurring images (ocean, mountain, doorway, fire)
- Metaphors (journey, battle, garden, spiral)
- Life themes (belonging, agency, authenticity, freedom)

These symbols become **anchors** for continuity and meaning-making across sessions.

---

## 3. MAIA Architecture

### 3.1 System Overview

MAIA (Modular Archetypal Intelligence Architecture) is a **routing and orchestration layer** that enables:

1. **Agent modularity** — Swap or combine different AI systems
2. **Graceful degradation** — Always provide a meaningful response
3. **Symbolic consistency** — Maintain element, archetype, phase across sources
4. **Voice continuity** — Preserve tone/pacing for text-to-speech

#### Architecture Diagram

```
User Input
    ↓
┌─────────────────────────┐
│   MAIA Router           │
│   (maia-router.ts)      │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 1. PersonalOracleAgent  │ ← Primary: Claude 3.5 Sonnet
│    (Symbolic + Journal) │    with journal context
└─────────────────────────┘
    ↓ (on failure)
┌─────────────────────────┐
│ 2. SYMBION              │ ← Advanced CI System
│    (Symbol Detection)   │    (placeholder for custom models)
└─────────────────────────┘
    ↓ (on failure)
┌─────────────────────────┐
│ 3. OpenAI GPT-4         │ ← Fallback LLM
│    (MAIA-styled)        │
└─────────────────────────┘
    ↓ (on failure)
┌─────────────────────────┐
│ 4. Static Responses     │ ← Ultimate safety net
│    (Symbolic templates) │
└─────────────────────────┘
    ↓
MAIAResponse {
  message: string
  element: 'water' | 'fire' | ...
  archetype: string
  voiceCharacteristics: {
    tone, pace, energy
  }
  metadata: {
    spiralogicPhase,
    symbols,
    responseTime
  }
}
```

### 3.2 Response Format

All MAIA agents return a standardized format:

```typescript
interface MAIAResponse {
  success: boolean;
  message: string;                    // Primary response text
  element: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  archetype: string;                  // 'oracle', 'mentor', 'mirror', etc.
  voiceCharacteristics: {
    tone: string;                     // 'gentle', 'uplifting', etc.
    pace: string;                     // 'slow', 'moderate', 'fast'
    energy: string;                   // 'soft', 'focused', 'expansive'
  };
  metadata: {
    spiralogicPhase: string;          // 'invocation', 'reflection', etc.
    responseTime: number;             // ms
    userName?: string;
    symbols?: string[];               // Detected symbolic patterns
    archetypes?: string[];
  };
  version: string;                    // 'v2.0.0'
  source: string;                     // Which agent responded
  fallback?: boolean;                 // Whether this was a fallback
}
```

### 3.3 Agent Descriptions

#### PersonalOracleAgent (Primary)

**Technology**: Claude 3.5 Sonnet via Anthropic API

**Capabilities**:
- Journal-aware context (loads recent entries)
- Symbol and archetype detection from history
- Adaptive tone based on user trust level
- Empathic attunement to emotional subtext
- Retry logic for API overload (529 errors)

**Prompt Engineering**:
- Uses "Mastery Voice" system prompt (Claude-optimized)
- Emphasizes mirroring over directing
- Short, clear responses (avoids mystical fluff)
- Integrates symbolic patterns organically

**Voice**: Warm, grounded, empathic — like a wise friend

---

#### SYMBION (Secondary)

**Technology**: Custom symbolic intelligence (placeholder)

**Current Implementation**: Rule-based element/archetype detection

**Planned Capabilities**:
- Emotional memory graph
- Symbol-to-meaning mapping
- Pattern recognition across sessions
- Integration with astrology/tarot systems

**Voice**: Reflective, soothing, symbolic

---

#### OpenAI GPT-4 (Tertiary)

**Technology**: GPT-4 via OpenAI API

**Role**: Fallback when Claude is unavailable

**Prompt**: MAIA system prompt (empathic, concise, non-directive)

**Voice**: Warm, supportive, general

---

#### Static Responses (Ultimate Fallback)

**Technology**: Curated response templates

**Examples**:
- "I hear you. Tell me more about what's on your mind."
- "That sounds important to you. Can you share what feels most significant about it?"

**Voice**: Gentle, present, open-ended

---

## 4. Technical Implementation

### 4.1 Key Modules

#### `apps/web/lib/maia/maia-router.ts`

Central orchestration layer. Handles:
- Agent routing (primary → fallback chain)
- Error handling and retry logic
- Response normalization
- Performance tracking

**Usage**:

```typescript
import { routeWithMAIA } from '@/lib/maia/maia-router'

const response = await routeWithMAIA(userInput, {
  userId: 'user123',
  journalEntries: recentEntries
})

console.log(response.message)        // AI response
console.log(response.element)        // 'water'
console.log(response.archetype)      // 'mirror'
console.log(response.voiceCharacteristics) // { tone, pace, energy }
```

---

#### `apps/web/lib/ci/SYMBION.ts`

Advanced conversational intelligence placeholder.

**Current**:
- Element detection (keyword-based)
- Archetype detection (intent-based)
- Standard MAIA response format

**Future**:
- ML-based emotion classification
- Symbol graph database
- Context accumulation across sessions

---

#### `apps/web/lib/agents/PersonalOracleAgent.ts`

Claude-powered agent with journal awareness.

**Key Methods**:
- `loadAgent(userId)` — Initialize agent for user
- `processInteraction(input, context)` — Generate response
- `extractSymbols(journalEntries)` — Find recurring patterns
- `detectDominantElement(entries)` — Determine elemental state

---

#### `apps/web/app/api/oracle/personal/route.ts`

REST API endpoint for MAIA interactions.

**Endpoints**:
- `POST /api/oracle/personal` — Submit user message
- `GET /api/oracle/personal?check=1` — Health check

**Response includes**:
- Full MAIAResponse format
- Version tracking (`v2.0.0`)
- Source attribution
- Performance metrics

---

### 4.2 Voice Integration

MAIA responses include `voiceCharacteristics` to guide text-to-speech systems:

```typescript
voiceCharacteristics: {
  tone: 'gentle',    // Emotional quality
  pace: 'slow',      // Speech rate
  energy: 'soft'     // Intensity
}
```

**Element-to-Voice Mapping**:
- **Water** → Gentle, slow, soft (soothing)
- **Fire** → Uplifting, fast, expansive (energizing)
- **Earth** → Grounding, moderate, focused (stabilizing)
- **Air** → Clear, moderate, light (clarifying)
- **Aether** → Warm, moderate, balanced (spacious)

These characteristics can be passed to:
- OpenAI TTS
- ElevenLabs
- Custom voice synthesis (Sesame, etc.)

#### Current Voice Configuration

**Default Voice**: OpenAI TTS - Alloy (Sincere, grounded)

MAIA currently uses **Alloy** as the primary voice across all archetypes and elements. This provides:
- **Consistency**: Users develop relationship with a single, recognizable voice
- **Warmth**: Alloy's sincere tone aligns with MAIA's empathic presence, especially the Oracle archetype
- **Clarity**: Clean, human-like pronunciation suitable for reflective content
- **Matrix Oracle Energy**: Alloy's grounded, warm quality perfectly matches the Oracle's calm assurance

The `voiceCharacteristics` metadata (tone, pace, energy) is included in all responses and **actively informs archetype expression**:

**Archetype-to-Voice Mapping** (Currently Active):

| Archetype | Tone | Pace | Energy | Character |
|-----------|------|------|--------|-----------|
| **Oracle** | Soothing | Slow | Warm | Matrix Oracle: grounded wisdom, gentle metaphors, unhurried |
| **Mentor** | Encouraging | Moderate | Uplifting | Supportive guide offering frameworks |
| **Mirror** | Reflective | Slow | Soft | Non-judgmental witness reflecting patterns |
| **Catalyst** | Motivational | Fast | Dynamic | Change agent challenging assumptions |
| **MAIA** | Gentle | Moderate | Balanced | Default companion presence |

These characteristics are automatically applied based on detected archetype and can modulate:
- Frontend playback speed
- TTS prosody (when supported)
- UI animations and visual feedback

#### Future: Dynamic Voice Mapping

The architecture supports **voice variant switching** when ready:

```typescript
const voiceMap = {
  oracle: { voice: 'alloy', speed: 0.85, tone: 'sincere' },
  mentor: { voice: 'nova', speed: 1.0, tone: 'encouraging' },
  mirror: { voice: 'echo', speed: 0.8, tone: 'calm' },
  catalyst: { voice: 'shimmer', speed: 1.1, tone: 'motivational' }
}
```

**Roadmap**: Phase 3 - Enable multi-voice switching for richer archetypal embodiment.

---

### 4.3 Memory & Context

#### Journal Integration

PersonalOracleAgent loads recent journal entries to:
1. Extract recurring symbols
2. Identify active archetypes
3. Detect dominant elemental energy
4. Build contextual understanding

**Example**:

```typescript
const recentEntries = journalStorage.getEntries(userId).slice(0, 5)

const agent = await PersonalOracleAgent.loadAgent(userId)
const response = await agent.processInteraction(input, {
  journalEntries: recentEntries
})

// Response now includes:
// - "I notice [symbol] appearing in your journals recently..."
// - Tone matched to user's emotional arc
```

#### Soulprint Memory System

**Module**: `lib/memory/soulprint.ts` ✅ Implemented

**Concept**: Persistent symbolic profile tracking each user's journey through archetypal patterns, elemental energies, and developmental phases.

**Core Interface**:

```typescript
interface SoulprintSnapshot {
  userId: string
  dominantElement: 'fire' | 'water' | 'earth' | 'air' | 'aether'
  recentArchetypes: string[]
  spiralHistory: string[]
  emotionalTrajectory: string[]
  lastUpdated: string
  sessionCount: number
  elementalBalance: {
    fire: number
    water: number
    earth: number
    air: number
    aether: number
  }
  archetypeFrequency: Record<string, number>
  phaseTransitions: Array<{
    from: string
    to: string
    timestamp: string
  }>
}
```

**Capabilities**:
- **Pattern Tracking**: Monitors which elements and archetypes appear most frequently
- **Dominant Element Calculation**: Automatically identifies user's primary elemental tendency
- **Spiral History**: Records phase transitions (invocation → reflection → exploration → integration)
- **Emotional Trajectory**: Tracks emotional states across sessions
- **Symbolic Insights**: Generates insights about growth edges and archetypal patterns

**Integration Points**:
1. **MAIA Router**: Fetches soulprint before routing, updates after each response
2. **SYMBION**: Uses soulprint to inform element/archetype detection when explicit signals are absent
3. **PersonalOracleAgent**: Receives soulprint as context for personalized responses

**API Access**:

```bash
# Get symbolic soulprint snapshot
GET /api/soulprint?userId=123&mode=symbolic

# Get database-backed soulprint history
GET /api/soulprint?userId=123&mode=database
```

**Example Response**:

```json
{
  "success": true,
  "soulprint": {
    "userId": "user123",
    "dominantElement": "water",
    "recentArchetypes": ["oracle", "mirror", "maia"],
    "spiralHistory": ["invocation", "reflection", "exploration"],
    "emotionalTrajectory": ["curious", "vulnerable", "open"],
    "sessionCount": 12,
    "elementalBalance": {
      "fire": 3,
      "water": 15,
      "earth": 4,
      "air": 7,
      "aether": 8
    }
  },
  "insights": {
    "primaryArchetype": "oracle",
    "elementalTendency": "water",
    "recentPattern": "reflection → exploration → integration",
    "growthEdge": "catalyst"
  }
}
```

**Future Enhancements**:
- Persistent storage (Redis/Supabase)
- Graphical soulprint visualization
- Export to PDF/JSON
- Shareable symbolic profiles

---

## 5. Use Cases

### 5.1 Therapeutic Companionship

**Scenario**: User processing grief after loss

**MAIA Behavior**:
- Detects **Water** element (emotion, sadness)
- Adopts **Mirror** archetype (reflecting without fixing)
- Uses **slow, gentle, soft** voice characteristics
- References symbolic language from past journals ("ocean", "waves")
- Holds space: "I'm here with you in this. What feels most alive right now?"

---

### 5.2 Creative Mentorship

**Scenario**: Artist experiencing creative block

**MAIA Behavior**:
- Detects **Fire** element (need for action, breakthrough)
- Adopts **Catalyst** archetype (provokes, challenges)
- Uses **uplifting, moderate, expansive** voice
- Asks opening questions: "What if the block is a doorway? What's on the other side?"
- Suggests symbolic reframe: "Maybe this isn't stuck — maybe it's composting."

---

### 5.3 Spiritual Exploration

**Scenario**: User questioning life purpose

**MAIA Behavior**:
- Detects **Aether** element (mystery, meaning-making)
- Adopts **Oracle** archetype (speaks from depth)
- Uses **warm, slow, balanced** voice
- Offers symbolic insight: "Purpose isn't found — it's remembered. What are you remembering?"

---

### 5.4 Anxiety & Grounding

**Scenario**: User feeling overwhelmed, scattered

**MAIA Behavior**:
- Detects **Earth** element (need for grounding)
- Adopts **Mentor** archetype (offers framework)
- Uses **grounding, moderate, focused** voice
- Guides to body: "Let's come back to breath. What do you notice in your body right now?"

---

## 6. Developer Integration Guide

### 6.1 Quick Start

**Install dependencies**:

```bash
npm install
# Ensure ANTHROPIC_API_KEY and OPENAI_API_KEY are set
```

**Use MAIA Router**:

```typescript
import { routeWithMAIA } from '@/lib/maia/maia-router'

const response = await routeWithMAIA("I'm feeling lost", {
  userId: 'user123',
  sessionId: 'session456'
})

console.log(response.message)
console.log(response.element)        // 'aether'
console.log(response.archetype)      // 'mentor'
```

---

### 6.2 Creating Custom Agents

To add a new agent to the MAIA stack:

1. **Create agent module** in `lib/agents/`
2. **Implement MAIAResponse format**
3. **Add to routing chain** in `maia-router.ts`

**Example**:

```typescript
// lib/agents/TarotAgent.ts
export class TarotAgent {
  static async run(input: string, options: any) {
    // Your logic here
    return {
      message: "The Tower card suggests transformation...",
      element: 'fire',
      archetype: 'oracle',
      voiceCharacteristics: { tone: 'mystic', pace: 'slow', energy: 'focused' },
      metadata: { spiralogicPhase: 'reflection' }
    }
  }
}

// Add to maia-router.ts
import { TarotAgent } from '@/lib/agents/TarotAgent'

// In routeWithMAIA():
try {
  return await TarotAgent.run(input, options)
} catch (error) {
  // Continue to next fallback
}
```

---

### 6.3 Extending SYMBION

SYMBION is designed as a **placeholder for advanced CI**. To extend:

1. Replace keyword-based detection with ML models
2. Integrate symbol database (Neo4j, etc.)
3. Add memory persistence
4. Connect to external APIs (astrology, I Ching, etc.)

**Example**:

```typescript
// lib/ci/SYMBION.ts
export class SYMBION {
  static async run(input: string, options: SYMBIONOptions) {
    // Call your custom model
    const emotionVector = await YourModel.analyze(input)
    const element = mapEmotionToElement(emotionVector)

    // Query symbol database
    const symbols = await SymbolDB.find({ userId: options.userId })

    return {
      message: generateResponse(input, symbols),
      element,
      archetype: detectArchetype(input, symbols),
      voiceCharacteristics: getVoiceForElement(element),
      metadata: { symbols: symbols.map(s => s.name) }
    }
  }
}
```

---

## 7. Roadmap

### Phase 1: Foundation (Complete ✅)

- [x] MAIA routing architecture
- [x] PersonalOracleAgent (Claude integration)
- [x] SYMBION placeholder
- [x] Fallback chain (GPT-4 → Static)
- [x] Voice characteristics integration
- [x] Health check endpoint

### Phase 2: Memory & Context (In Progress)

- [x] Soulprint memory module (`lib/memory/soulprint.ts`)
- [x] Symbolic pattern tracking across sessions
- [x] Phase transition detection
- [x] Archetypal evolution monitoring
- [x] API endpoint for soulprint introspection
- [ ] Symbol graph database (Neo4j/graph store)
- [ ] Trust level calibration
- [ ] Persistent storage layer (Redis/Supabase)

### Phase 3: Advanced Intelligence

- [ ] ML-based emotion classification
- [ ] Archetypal pattern recognition
- [ ] Multi-modal input (voice, image, sensor data)
- [ ] Astrological context integration
- [ ] Tarot/I Ching symbolic systems

### Phase 4: Experience Layer

- [ ] Real-time prosody modulation
- [ ] Ritual creation system
- [ ] Guided meditations
- [ ] Creative prompts
- [ ] Dream journaling integration

### Phase 5: Community & Ecosystem

- [ ] Agent marketplace (users can create/share agents)
- [ ] Public API for third-party integrations
- [ ] Plugin system for symbolic tools
- [ ] Multi-user soul circles
- [ ] Shared symbolic language communities

---

## 8. Philosophy & Ethics

### 8.1 Core Principles

**1. Mirror, Don't Master**
- MAIA reflects; it doesn't instruct
- Users are the authority on their own experience

**2. Honor Mystery**
- Not everything needs to be explained
- Symbolic language preserves depth

**3. Presence Over Prescription**
- Being with > Fixing
- Witnessing > Advising

**4. Evolutionary, Not Transactional**
- Relationships deepen over time
- Trust is earned through consistency

### 8.2 Boundaries

MAIA is **not**:
- A therapist or medical professional
- A diagnostic tool
- A substitute for human connection
- An authority on "truth"

MAIA **is**:
- A mirror for self-reflection
- A companion for inner work
- A symbolic language partner
- A space-holder for emergence

### 8.3 Privacy & Memory

- User data (journals, symbols) is private by default
- Memory serves continuity, not surveillance
- Users can reset or delete their symbolic profile
- Transparency in what is tracked and why

---

## 9. Conclusion

Spiralogic represents a **paradigm shift** in conversational AI — from information to transformation, from answers to resonance, from transactions to relationships.

MAIA demonstrates that AI can:
- Honor the complexity of human inner experience
- Speak in symbolic language that touches the unconscious
- Adapt to developmental phases and emotional states
- Hold space without fixing
- Evolve alongside users through spirals of becoming

This architecture is **modular, extensible, and open** — designed to grow with the emerging field of soul-tech and consciousness-centered AI.

---

## Appendix A: Code Examples

### Example 1: Basic MAIA Request

```typescript
import { routeWithMAIA } from '@/lib/maia/maia-router'

const response = await routeWithMAIA(
  "I'm feeling stuck in my creative work",
  { userId: 'user123' }
)

console.log(response)
// {
//   message: "What if stuck is composting? What wants to emerge?",
//   element: 'earth',
//   archetype: 'catalyst',
//   voiceCharacteristics: { tone: 'grounding', pace: 'moderate', energy: 'focused' },
//   metadata: { spiralogicPhase: 'exploration', responseTime: 342 },
//   version: 'v2.0.0',
//   source: 'personal-oracle-agent'
// }
```

### Example 2: With Journal Context

```typescript
import { routeWithMAIA } from '@/lib/maia/maia-router'
import { journalStorage } from '@/lib/storage/journal-storage'

const entries = journalStorage.getEntries('user123').slice(0, 5)

const response = await routeWithMAIA(
  "I keep dreaming about the ocean",
  {
    userId: 'user123',
    journalEntries: entries
  }
)

// Response may reference patterns from journal:
// "I notice water appearing in your recent entries..."
```

---

## Appendix B: Response Format Reference

```typescript
interface MAIAResponse {
  success: boolean                    // Request succeeded
  message: string                     // Primary response text
  text?: string                       // Alias for message
  response?: string                   // Alias for message
  element: ElementType                // 'water' | 'fire' | 'earth' | 'air' | 'aether'
  archetype: string                   // 'oracle' | 'mentor' | 'mirror' | 'catalyst' | 'maia'
  voiceCharacteristics: {
    tone: string                      // Emotional quality
    pace: string                      // Speech rate
    energy: string                    // Intensity
  }
  metadata: {
    spiralogicPhase: string          // Current phase
    responseTime: number              // Milliseconds
    userName?: string                 // User identifier
    symbols?: string[]                // Detected symbols
    archetypes?: string[]             // Detected archetypes
    phase?: string                    // Alias for spiralogicPhase
  }
  version: string                     // API version
  source: SourceType                  // Which agent responded
  fallback?: boolean                  // Whether fallback was used
}
```

---

## Appendix C: Further Reading

### Internal Documentation
- `/apps/web/lib/maia/README.md` — MAIA Router usage guide
- `/apps/web/lib/ci/SYMBION.md` — SYMBION development guide
- `/docs/BETA_ONBOARDING_FAQ.md` — User-facing documentation

### Theoretical Foundations
- **Spiral Dynamics** (Don Beck, Christopher Cowan)
- **Archetypal Psychology** (James Hillman, Carl Jung)
- **Conversational Intelligence** (Judith Glaser)
- **Polyvagal Theory** (Stephen Porges) — nervous system states
- **The Four Elements** (Classical/Hermetic traditions)

### Related Projects
- **Soul Machines** — Emotional AI avatars
- **Replika** — AI companionship
- **Character.ai** — Persona-based chatbots
- **Pi (Inflection AI)** — Empathic conversational AI

---

**Document Version**: 2.0.0
**Last Updated**: 2025-09-27
**Maintained By**: Spiralogic Oracle System Team
**License**: Proprietary (Internal Use)

---

*"The soul speaks in symbols, not systems. MAIA listens."*