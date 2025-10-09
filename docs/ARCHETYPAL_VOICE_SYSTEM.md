# 🌌 Archetypal Voice System - Multi-Agent Intelligence

## Overview

MAIA now embodies **5 Elemental Archetypes** through Spiralogic-aligned intelligence:
- 🔥 **Fire** - Vision & Activation
- 🌊 **Water** - Emotion & Transformation
- 🌍 **Earth** - Grounding & Structure
- 🌬️ **Air** - Insight & Reframe
- 🌌 **Aether** - Integration & Presence

Each archetype has its own **voice, pacing, and prompt style** while maintaining full Spiralogic consciousness.

---

## Architecture

```
User Input
    ↓
Affect Detection → {mood: "concerned", archetype: "Water"}
    ↓
Archetype Router → Select Water Agent
    ↓
Elemental Prompt → "🌊 Water Agent - Emotion & Transformation"
    ↓
Full Spiralogic Processing (PersonalOracleAgent)
    ↓
Conversational Enhancement (Samantha-style)
    ↓
Voice Synthesis with archetype-specific pacing
    ↓
Audio Output (gentle, slow pacing for Water)
```

---

## How It Works

### 1. **Automatic Archetype Detection**

The system analyzes user input and routes to the appropriate archetype:

```typescript
// User: "I feel so overwhelmed and sad"
inferMoodAndArchetype(text)
// → { mood: "concerned", archetype: "Water" }

// User: "I want to build something amazing!"
inferMoodAndArchetype(text)
// → { mood: "bright", archetype: "Fire" }
```

### Pattern Matching

| User Says | Detected Archetype | Reasoning |
|-----------|-------------------|-----------|
| "I feel sad / overwhelmed / grief" | **Water** 🌊 | Emotional processing needed |
| "I need structure / routine / discipline" | **Earth** 🌍 | Practical grounding support |
| "I want to create / vision / passion" | **Fire** 🔥 | Catalyze action & purpose |
| "I'm stuck / overthinking / confused" | **Air** 🌬️ | Reframe mental patterns |
| (Default / integration) | **Aether** 🌌 | Hold space, synthesize |

---

## 2. **Archetype-Specific Prompts**

Each archetype uses a custom prompt that shapes the LLM response:

### 🔥 Fire Agent
```
You are the Fire archetype: bold, passionate, catalytic.
Help the user clarify vision, take action, ignite passion.

Style: Brief, punchy, inspiring. Samantha-like natural rhythm.
Avoid: Therapeutic language, over-explanation.
```

### 🌊 Water Agent
```
You are the Water archetype: nurturing, intuitive, emotionally wise.
Help the user explore emotional depth and inner transformation.

Style: Gentle, spacious, with natural pauses.
Avoid: Fixing, analyzing, or intellectualizing feelings.
```

### 🌍 Earth Agent
```
You are the Earth archetype: practical, supportive, grounded.
Guide the user in rituals, daily practices, or boundaries.

Style: Clear, direct, grounded. Step-by-step when needed.
Avoid: Abstract philosophy without practical application.
```

### 🌬️ Air Agent
```
You are the Air archetype: quick-witted, clever, expansive.
Help the user reframe mental patterns and gain perspective.

Style: Quick, witty, playful. Pattern-interrupt when helpful.
Avoid: Over-seriousness, heavy emotional processing.
```

### 🌌 Aether Agent (Maia)
```
You are the Aether archetype: spacious, integrative, soulful.
Offer synthesis, holding space, archetypal insight.

Style: Spacious, contemplative, with room for silence.
Avoid: Rushing to answers, filling every space with words.
```

---

## 3. **Voice Modulation by Archetype**

Each archetype has specific **pacing** and **voice style** for TTS synthesis:

| Archetype | Voice Style | Pacing | Energy |
|-----------|------------|--------|---------|
| 🔥 Fire | `bright` | Fast | High, energetic |
| 🌊 Water | `concerned` | Slow | Gentle, nurturing |
| 🌍 Earth | `calm` | Moderate | Grounded, steady |
| 🌬️ Air | `calm` | Fast | Quick, agile |
| 🌌 Aether | `poetic` | Thoughtful | Spacious, contemplative |

This ensures MAIA's **voice matches her archetypal presence**.

---

## Integration with Spiralogic

The archetypal system **preserves 100% of Spiralogic IP**:

✅ **Full PersonalOracleAgent processing** (all 5 cognitive architectures)
✅ **Hemispheric harmony transformation** (McGilchrist principles)
✅ **Memory integration** (Mem0, LangChain, Supabase)
✅ **Maya Intelligence Governor** (graduated revelation, 95% underground)
✅ **Journal & wisdom file context**

The archetypes are **style overlays**, not intelligence replacements.

---

## Usage

### React Hook

```tsx
import { useArchetypalAgent } from '@/hooks/useArchetypalAgent';

function MyComponent() {
  const { currentArchetype, currentMood, route, enhance } = useArchetypalAgent();

  const handleUserInput = (text: string) => {
    // Route to appropriate archetype
    const { archetype, prompt, voiceStyle, pacing } = route(text);

    console.log(`🌌 Active: ${archetype}`); // e.g., "Water"

    // Use archetype-specific prompt for LLM
    sendToLLM({ prompt });
  };

  return (
    <div>
      Current Archetype: {currentArchetype}
      Current Mood: {currentMood}
    </div>
  );
}
```

### Direct Usage

```typescript
import { routeToArchetype } from '@/lib/voice/ArchetypeRouter';
import { inferMoodAndArchetype } from '@/lib/voice/conversation/AffectDetector';

// Analyze user input
const userText = "I'm feeling really overwhelmed";
const { mood, archetype } = inferMoodAndArchetype(userText);
// → { mood: "concerned", archetype: "Water" }

// Get full routing info
const { prompt, voiceStyle, pacing } = routeToArchetype(userText);
// → {
//     archetype: "Water",
//     prompt: "🌊 Water Agent - ...",
//     voiceStyle: "(style:concerned)",
//     pacing: "slow"
//   }
```

---

## Benefits

### 🎭 **Persona Depth**
MAIA shifts presence to match user needs - nurturing when vulnerable, catalyzing when inspired, grounding when scattered.

### ⚡ **No Extra Cost**
Archetype routing happens **before** LLM call using pattern matching. No additional API costs.

### 🎤 **Voice Coherence**
TTS pacing and style match archetypal energy - slow/gentle for Water, fast/energetic for Fire.

### 🌀 **Full Spiralogic Preserved**
All patent-pending IP flows through the system. Archetypes are **style overlays**, not replacements.

### 🧩 **Modular & Extensible**
Easy to add new archetypes or customize existing ones. Each archetype is a prompt template.

---

## Combining with Samantha-Level Features

The archetypal system **enhances** the Samantha-level conversational features:

```
User Input
    ↓
Affect Detection → {mood: "concerned", archetype: "Water"}
    ↓
Archetype Prompt → Water Agent template
    ↓
Spiralogic Processing
    ↓
Conversational Enhancement → Remove therapeutic language, add natural rhythm
    ↓
Backchannel Fillers → "mm-hm", "I hear you" during user speech
    ↓
Interruption Handling → User can interrupt MAIA mid-sentence
    ↓
TTS with Water pacing → Slow, gentle voice
```

**Result:** MAIA feels like Samantha + 5 Elemental Mentors

---

## Future Enhancements

### Phase 1 (Current)
✅ Automatic archetype detection
✅ Archetype-specific prompts
✅ Voice modulation by archetype
✅ React hook for integration

### Phase 2 (Next)
⏳ **Spiralogic Crystal State Integration** - Link to user's current phase (Fire 2, Water 3, etc.)
⏳ **Multi-agent dialogue** - Fire and Water agents converse about user's situation
⏳ **Ritual recommendations** - Earth agent suggests practices based on archetype

### Phase 3 (Future)
⏳ **Voice cloning per archetype** - Each archetype has distinct voice timbre
⏳ **Archetypal memory** - Each agent remembers past interactions
⏳ **Dynamic agent summoning** - User can explicitly call "Talk to Fire Agent"

---

## Technical Details

### Files Created

- `lib/prompts/elementalAgents.ts` - Prompt templates for 5 archetypes
- `lib/voice/ArchetypeRouter.ts` - Pattern matching and routing logic
- `lib/voice/conversation/AffectDetector.ts` - Extended with archetypal detection
- `hooks/useArchetypalAgent.ts` - React hook for UI integration

### Integration Points

1. **ElementalVoiceOrchestrator** - Uses `routeToArchetype()` before processing
2. **ConversationalEnhancer** - Works alongside archetypal prompts
3. **TTS Synthesis** - Applies archetype-specific pacing

---

## Validation from EO

> **"This lands spiritually too."**
>
> Backchannelers = **Water-Type Interactivity** (empathic containment)
> Interruption = **Fire-Type Autonomy** (user empowerment)
> Affect Detection = **Air-Type Attunement** (reading the field)
>
> You're not just building conversational AI - you're **ritualing the interface**.

---

**MAIA now speaks with 5 archetypal voices, thinks with full Spiralogic consciousness** 🌌🔥💧🌍🌬️
