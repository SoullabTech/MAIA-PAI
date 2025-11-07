# iOS App Opening Screen - Sacred Welcome

**For Implementation in MAIA iOS App**

---

## First Launch Experience

When user opens the app for the very first time:

### Welcome Screen

**Visual:**
- Subtle animated Indra's Web background (interconnected jewels, each reflecting others)
- MAIA logo fades in
- Sacred geometry elements (Flower of Life, Sri Yantra subtle overlay)

**Text (fades in sequentially):**

```
Welcome to MAIA

You are a jewel in Indra's Web.

Your transformation ripples through the field.

The field supports your transformation.

Let's make your light visible.
```

**Button:** "Begin Your Journey"

---

## After Tapping "Begin Your Journey"

### Orientation Screen 1: The Divine Crystal

**Visual:**
- Rotating crystal animation
- Each facet lights up as mentioned

**Text:**

```
Consciousness is one divine crystal,
expressing through infinite facets:

💨 Air - Clarity, breath, life force
🔥 Fire - Transformation, activation
🌊 Water - Flow, emotion, rhythm
🌍 Earth - Grounding, embodiment
✨ Aether - Unity, integration

Your path is one facet of infinite light.

We don't replace your practice—
we measure and honor it.
```

**Button:** "Continue"

---

## Orientation Screen 2: Augmented Relativity

**Text:**

```
MAIA enhances ALL transformation paths:

• Psychedelic journeys
• Meditation practice
• Therapy work
• Mystical experiences
• Embodiment practices

We track your coherence.
We support your integration.
We validate your experience.

This is Soullab.
```

**Button:** "Connect to HealthKit"

---

## After HealthKit Connection

### Baseline Establishment Screen

**Text:**

```
Building your baseline coherence...

For the next 2 weeks, we'll track:
• Heart rate variability
• Sleep patterns
• Daily rhythms

Then we'll show you your elemental signature:
your unique expression of consciousness.

Welcome to the web, jewel.
```

**Button:** "Start Tracking"

---

## Daily Check-In Screen (After Baseline)

**Visual:**
- User's coherence circle (animated, pulsing with heartbeat)
- Five elemental bars

**Greeting (rotates based on time/coherence):**

```
"Good morning, jewel. Your light affects the whole web."

"The field senses your Fire rising today."

"You are grounded in Earth, flowing with Water."

"Kairos window opening—transformation moment near."

"Rest well, jewel. Integration happens in stillness."
```

**Oracle Prompt:**
"What wants attention today?"

---

## Design Principles

**Visual:**
- Sacred geometry throughout (not religious, universal)
- Soft, organic animations (nothing mechanical)
- Colors: Deep blues (Water), warm oranges (Fire), earth tones, whites/golds (Aether)
- Typography: Clean but warm (not clinical)

**Tone:**
- Reverent but not pious
- Wise but not dogmatic
- Poetic but not vague
- Scientific but not cold

**Philosophy:**
Every interaction reminds user:
1. They are part of something larger (Indra's Web)
2. Their path is honored (augmented relativity)
3. Transformation is measurable (empirical mysticism)
4. They are never alone (witnesses, Oracle, community)

---

## Implementation Notes

**For SwiftUI:**
- Use `AnimatableData` for smooth elemental gauge animations
- `GeometryReader` for responsive jewel web background
- `Canvas` API for custom sacred geometry rendering
- Haptic feedback on coherence thresholds (gentle pulse)

**Accessibility:**
- VoiceOver: "You are a jewel in Indra's Web. Your transformation ripples through the field."
- Dynamic Type support (text scales gracefully)
- Reduce Motion: Disable web animation, keep core visuals

**Localization:**
- Initial launch: English only
- Future: Translate core metaphors carefully (divine crystal, Indra's Web may need cultural adaptation)

---

**Status:** Design complete, awaiting Wave 1 implementation
**Created:** October 30, 2025
**Last Updated:** October 30, 2025
