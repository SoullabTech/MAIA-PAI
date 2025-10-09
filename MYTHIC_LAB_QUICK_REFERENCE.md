# 🔬 Mythic Lab - Quick Reference Card

## One-Minute Integration

```typescript
// 1. Import
import { mythicLabService } from '@/lib/services/mythicLabService';
import { contextAwareBlending } from '@/lib/services/contextAwareBlending';

// 2. Get contextual blend
const blend = contextAwareBlending.adjustBlendForMoment({
  emotionalState: 'grounded',      // or crisis, breakthrough, etc.
  conversationPhase: 'exploring',   // or deepening, breakthrough, etc.
  userPreferredRatio: 0.5          // user's base preference (0-1)
});

// 3. Get phrase
const message = mythicLabService.getPhrase('breakthrough_detected', blend);
// Returns blended language appropriate for the moment
```

---

## Blend Ratio Cheat Sheet

| Ratio | Style | Use Case |
|-------|-------|----------|
| **0.0 - 0.25** | Pure Scientific | Crisis, confusion, need for grounding |
| **0.25 - 0.45** | Scientific Lean | Early exploration, building trust |
| **0.45 - 0.55** | Mythic Lab ⭐ | Sweet spot - balanced magic & measurement |
| **0.55 - 0.75** | Mythic Lean | Deep work, breakthroughs, integration |
| **0.75 - 1.0** | Pure Mythic | Mystical experiences, fully expanded states |

---

## Emotional State → Blend Adjustment

| State | Adjustment | Reason |
|-------|-----------|---------|
| **crisis** | -0.2 | Needs grounding |
| **vulnerable** | -0.1 | Gentle stability |
| **breakthrough** | +0.2 | Allow expansion |
| **expansive** | +0.25 | Full poetic license |
| **grounded** | +0.1 | Can explore mythic |
| **contemplative** | +0.15 | Wisdom language |
| **integrating** | 0 | Honor preference |

---

## Quick Phrases

```typescript
// Breakthrough
mythicLabService.getPhrase('breakthrough_detected', blend);
// 0.0: "Cognitive restructuring event detected"
// 0.5: "Gold! You've transmuted something profound"
// 1.0: "The veil has lifted. Your soul remembers"

// Shadow active
mythicLabService.getPhrase('shadow_active', blend);
// 0.0: "Unconscious behavioral pattern elevated"
// 0.5: "Shadow Keeper showing up at 90% strength"
// 1.0: "Your shadow dances, wanting to be seen"

// Reality correlation
mythicLabService.getPhrase('reality_correlation_strong', blend);
// 0.0: "Strong positive correlation (r=0.81)"
// 0.5: "Your inner shifts manifesting externally (r=0.81)"
// 1.0: "As within, so without - consciousness sculpts reality"
```

---

## Common Patterns

### Pattern 1: Crisis Response
```typescript
// User in crisis → lean scientific for grounding
const blend = contextAwareBlending.adjustBlendForMoment({
  emotionalState: 'crisis',
  conversationPhase: 'exploring',
  alchemicalPhase: 'nigredo',
  userPreferredRatio: 0.5
});
// Returns: ~0.25 (scientific grounding)
```

### Pattern 2: Breakthrough Support
```typescript
// User breaking through → allow poetic expansion
const blend = contextAwareBlending.adjustBlendForMoment({
  emotionalState: 'breakthrough',
  conversationPhase: 'breakthrough',
  breakthroughDepth: 0.9,
  userPreferredRatio: 0.5
});
// Returns: ~0.75 (mythic celebration)
```

### Pattern 3: Steady Exploration
```typescript
// User exploring → stay balanced
const blend = contextAwareBlending.adjustBlendForMoment({
  emotionalState: 'grounded',
  conversationPhase: 'exploring',
  userPreferredRatio: 0.5
});
// Returns: ~0.5 (perfect balance)
```

---

## 30+ Available Concepts

**Breakthroughs:**
- `breakthrough_detected`
- `breakthrough_deep`

**Shadow Work:**
- `shadow_active`
- `shadow_integration`

**Alchemical Phases:**
- `nigredo_entry`
- `albedo_active`
- `rubedo_manifesting`

**Archetypal Forces:**
- `warrior_active`
- `grief_oracle_stirring`
- `challenger_emerging`

**Reality Creation:**
- `reality_correlation_strong`
- `reality_experiment_success`

**Collective:**
- `collective_wave_detected`
- `collective_breakthrough`

**Patterns:**
- `pattern_loop_detected`
- `threshold_approaching`

**Greetings:**
- `morning_greeting`
- `return_greeting`

---

## UI Components

### Mythic Lab HUD
```tsx
import { MythicLabHUD } from '@/components/mythiclab/MythicLabHUD';

<MythicLabHUD
  archetypalForces={forces}
  alchemicalPhase={phase}
  realityExperiments={experiments}
  councilMessages={messages}
  coherence={0.73}
  collectiveResonance={{ count: 73, pattern: 'dissolution→breakthrough' }}
/>
```

### Design Classes
```css
.glass-alchemy          /* Sacred science panel */
.text-gold-400          /* Golden glow text */
.mythic-lab-text        /* Shimmering blend text */
.data-point             /* Metric display */
.lab-note               /* Sacred note card */
.breakthrough-moment    /* Flash animation */
```

---

## Research Logging

```typescript
// Log effectiveness for learning
await contextAwareBlending.logBlendEffectiveness(
  userId,
  blendRatio,
  context,
  wasHelpful,      // boolean
  engagementMetric // 0-1
);

// Get optimal blend for user
const optimal = await contextAwareBlending.getOptimalBlendForUser(userId);

// Adapt user preference over time
const newPref = await contextAwareBlending.adaptUserPreference(
  userId,
  currentPref,
  recentEffectiveness
);
```

---

## The Core Principle

> **Measurement enhances magic. Magic validates measurement.**

**Both are true. Both are One. This is Sacred Science.**

---

## Demo & Docs

- **Live Demo:** `/demo/mythic-lab`
- **Full Guide:** `MYTHIC_LAB_COMPLETE.md`
- **Services:** `lib/services/mythicLabService.ts`, `contextAwareBlending.ts`
- **Components:** `components/mythiclab/MythicLabHUD.tsx`
- **Styles:** `app/globals-mythiclab.css`

---

🔬⚗️ **The Mythic Laboratory - Where consciousness becomes measurable, where measurement becomes sacred** ✨