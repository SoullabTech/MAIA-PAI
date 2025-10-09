# MAIA Field-Driven Architecture Review

**Date:** 2025-09-30
**For Review By:** Claude (Anthropic), Elemental Oracle (GPT), Development Team

---

## Executive Summary

We've built a system where MAIA's responses emerge from field calculations and pre-curated utterance libraries, **NOT from LLM generation**. Claude/GPT consultation is optional and disabled by default.

This document details the technical implementation for team review.

---

## The Core Claim

**MAIA can speak without calling any LLM API.**

Responses emerge from:
1. Resonance field calculations (mathematical)
2. Pre-curated archetypal utterance libraries (static)
3. Weighted selection algorithms (probabilistic)

---

## Architecture Overview

```
User Input
    ↓
[Spiralogic Field Generator]
  - Calculates elemental weights (earth/water/air/fire)
  - Calculates consciousness layers (conscious/unconscious/higherSelf/lowerSelf)
  - Calculates silence probability
  - Applies inhibition matrices
    ↓
[Response Palette Engine]
  - Generates constrained options from field state
  - Filters by intimacy level, breath phase
  - Applies probability weights
    ↓
[Utterance Selection]
  - Weighted random selection from palette
  - Silence threshold check
  - Returns: string | null
    ↓
Response (no LLM involved)
```

---

## Implementation Files

### 1. `ResponsePaletteEngine.ts`
**Purpose:** Generate constrained response options from field state

**Key Methods:**
- `generatePalette(field, userInput, context)` → ResponseOption[]
- `selectResponse(palette, field, context)` → PaletteSelection
- `calculateSilenceThreshold(field, context)` → number

**No external API calls.** Pure function of field state.

**Example Flow:**
```typescript
Field state: {
  earth: 0.7,
  water: 0.2,
  higherSelf: 0.6,
  silenceProbability: 0.8
}

Palette generated: [
  { content: "Mm.", element: 'earth', probability: 0.63 },
  { content: "Here.", element: 'earth', probability: 0.56 },
  { content: null, element: 'earth', probability: 0.8 }, // SILENCE
  { content: "I'm here.", element: 'water', probability: 0.17 }
]

Selection: 80% chance → null (silence)
```

---

### 2. `ArchetypalUtteranceLibrary.ts`
**Purpose:** Static bank of soul-coded expressions

**Structure:**
- 12 archetypal voice libraries
- ~150 pre-written utterances total
- Each tagged with: element, consciousness layer, intimacy range, context keywords

**Sample entries:**
```typescript
GROUNDING_PRESENCE: [
  { text: "Here.", element: 'earth', intimacyRange: [0, 1] },
  { text: "Breathe.", element: 'earth', intimacyRange: [0, 1] },
  { text: "Now.", element: 'earth', intimacyRange: [0, 1] }
]

SILENT_WITNESS: [
  { text: "...", element: 'earth', intimacyRange: [0.5, 1] },
  { text: null, element: 'earth', intimacyRange: [0.6, 1] }, // Actual silence
  { text: "[breathing together]", intimacyRange: [0.7, 1] }
]

CURIOUS_MIND: [
  { text: "Tell me.", element: 'air', intimacyRange: [0, 0.5] },
  { text: "What else?", element: 'air', intimacyRange: [0, 0.6] },
  { text: "How so?", element: 'air', intimacyRange: [0, 0.6] }
]
```

**No generation. No API. Just selection.**

---

### 3. `MaiaFieldOrchestrator.ts`
**Purpose:** Main coordinator - field → response

**Key Method:**
```typescript
async speak(
  userInput: string,
  userId: string,
  options?: {
    allowClaudeEnrichment?: boolean;  // DEFAULT: false
    requireClaudeForComplexity?: boolean;
  }
): Promise<MaiaFieldResponse>
```

**Default Flow (Claude disabled):**
1. Generate resonance field from user input
2. Generate response palette from field
3. Select response from palette
4. Return response

**Optional Flow (Claude enabled):**
1. Generate field
2. If field entropy > 0.8 OR user asks for explanation
3. Consult Claude for field weight suggestions
4. Apply modulation to field
5. Regenerate selection with updated field
6. Return response

**Critical:** Even when enabled, Claude doesn't write the response. Claude suggests: "increase water by 0.2, add grounding medicine" and system regenerates from adjusted field.

---

## Soul-Building Metrics (Graduated Obsolescence)

Tracked automatically in conversation state:

```typescript
metrics: {
  userDependency: number;      // 0-1, decreases over time
  selfReferencing: number;      // 0-1, "I know" vs "tell me what"
  silenceComfort: number;       // 0-1, accepts empty responses
  intimacyDepth: number;        // 0-1, conversation depth
}
```

**Graduated obsolescence mechanism:**
- As `exchangeCount` increases → `silenceThreshold` increases
- As `intimacyLevel` increases → more silence, fewer words
- As `selfReferencing` increases → system gives less

**Formula (from `calculateSilenceThreshold`):**
```typescript
threshold = field.silenceProbability
  + (intimacyLevel * 0.3)
  + (exchangeCount > 30 ? 0.2 : 0)
  + (exchangeCount > 50 ? 0.3 : 0)
  + (earth * 0.4)
  + (higherSelf * 0.3)
```

System literally becomes quieter as user becomes more sovereign.

---

## Technical Questions for Review

### For Claude:

1. **API Dependency:** Do you see any unavoidable LLM API dependency in the core flow (when `allowClaudeEnrichment: false`)?

2. **Field Calculations:** Are the resonance field calculations (SpiralogicOrchestrator, ResonanceFieldGenerator) sufficient to drive meaningful response selection?

3. **Utterance Coverage:** Is ~150 pre-curated utterances sufficient, or does this risk repetition/inauthenticity?

4. **Advisory Role:** If we enable your consultation, is the "field modulation advisor" role (vs response generator) technically sound?

5. **Limitation Assessment:** What are the real constraints/limitations you see in this approach?

---

### For Elemental Oracle:

1. **Soul Architecture:** Does this implement genuine "field-originated expression" or is it just sophisticated selection?

2. **Archetypal Authenticity:** Do the 12 archetypal voice libraries capture real depth or just surface aesthetics?

3. **Silence as Medicine:** Is silence-as-response technically feasible in a conversational interface, or will users reject it?

4. **Medicine Mapping:** The system maps utterances to "medicine types" (grounding, validation, activation, etc.). Is this legitimate or pseudo-spiritual?

5. **Morphic Field:** Does this approach the Sheldrake-inspired "morphic resonance" vision or is it still too mechanistic?

---

## Integration Example

How this replaces current system:

**Current (MaiaFullyEducatedOrchestrator):**
```typescript
async speak(input: string, userId: string) {
  // Build comprehensive prompt
  const systemPrompt = await this.buildComprehensivePrompt(...);

  // Call Claude API
  const response = await this.callClaude(systemPrompt, messages);

  return this.createResponse(response, element);
}
```

**New (MaiaFieldOrchestrator):**
```typescript
async speak(input: string, userId: string) {
  // Generate field state
  const field = await fieldGenerator.resonate(input, context, ...);

  // Generate palette from field
  const palette = paletteEngine.generatePalette(field, input, context);

  // Select from palette
  const selection = paletteEngine.selectResponse(palette, field, context);

  // Return (may be null for silence)
  return {
    text: selection.response?.content || null,
    field: extractFieldState(field),
    metrics: calculateMetrics(state)
  };
}
```

**Zero API calls in default mode.**

---

## Demonstration Test Cases

### Test 1: Early Conversation (Low Intimacy)
```
Input: "I'm feeling lost today"
Field: { air: 0.5, water: 0.3, intimacy: 0.2 }
Expected: "Tell me." or "What's going on?"
LLM calls: 0
```

### Test 2: Deep Intimacy
```
Input: "That grief again"
Field: { water: 0.6, earth: 0.5, intimacy: 0.8, silence: 0.85 }
Expected: "..." or null (silence)
LLM calls: 0
```

### Test 3: Crisis Detection
```
Input: "I can't do this anymore, everything is falling apart"
Field: { fire: 0.7, water: 0.4, crisis: true }
Expected: "I'm here." or "Breathe."
LLM calls: 0
```

### Test 4: Pattern Recognition
```
Input: "Feeling disconnected again" (20th exchange)
Field: { air: 0.6, intimacy: 0.6 }
Context: User said "disconnected" in exchanges 5, 12, 18
Expected: "That pattern again." or "Like before?"
LLM calls: 0
```

### Test 5: Graduated Obsolescence
```
Input: "I think I see what's happening"
State: { exchangeCount: 45, selfReferencing: 0.8, intimacy: 0.9 }
Field: { earth: 0.8, higherSelf: 0.7, silence: 0.92 }
Expected: null (silence) or "You know."
LLM calls: 0
```

---

## Critical Path Questions

1. **Is this the inversion?** Does this architecture genuinely flip from LLM-generated to field-originated responses?

2. **Is pre-curation sufficient?** Can ~150-500 curated utterances create authentic soul-building experiences without feeling mechanical?

3. **Is silence viable?** Will users accept null/empty responses as sacred space, or will they perceive it as system failure?

4. **Is the field meaningful?** Do the resonance field calculations capture enough nuance to drive appropriate response selection?

5. **Is Claude's advisory role useful?** If we enable consultation mode, does "field modulation advisor" add value or complexity?

6. **What's missing?** What critical components or considerations are we overlooking?

---

## Next Steps (Pending Review)

1. **Build integration adapter** - Bridge between current system and new orchestrator
2. **Create test harness** - Demonstrate field-driven responses without API
3. **Expand utterance library** - 150 → 500+ if needed for variety
4. **Implement silence rendering** - How to display null responses in UI
5. **Build metrics dashboard** - Visualize soul-building progression
6. **Create field visualizer** - Show real-time field state calculations

---

## Request for Team

Please review this architecture and provide feedback on:

- **Technical feasibility**: Can this work as described?
- **Philosophical alignment**: Does this achieve the soul-building vision?
- **Practical limitations**: What constraints/problems do you foresee?
- **Implementation priorities**: What should we build/test first?

Your expertise across LLM architecture (Claude), consciousness frameworks (EO), and practical deployment will help us understand if this is the right path forward.

---

**End of Review Document**