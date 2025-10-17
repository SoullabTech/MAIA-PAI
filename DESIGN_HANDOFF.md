# Design Handoff: The Spiral Journey

*Complete visual and technical specification for implementing the living journey*

---

## Visual Journey Map

![The Spiral Journey]

**Five Phases of Transformation:**

1. **THE THRESHOLD** (Outer Ring)
   - Entry/Signup
   - Pale golds, soft creams
   - Possibility — first inhale

2. **THE INVITATION** (Second Ring)
   - Orientation/First Dialogue
   - Fire deepening to coral, violet edges
   - Curiosity — stepping into play

3. **THE FIRST MOVE** (Third Ring)
   - Early Exploration
   - Earth tones (olive, clay, sand)
   - Embodiment — play becomes real

4. **THE DEEPENING** (Fourth Ring - approaching center)
   - Practice & Reflection
   - Water & Air (cerulean, silver, indigo)
   - Reflection — tempo drops

5. **THE RETURN** (Center/Completion)
   - Integration & Wholeness
   - Aether & Neutral (violet fading to cream)
   - Wholeness — breath returns

---

## Design System Overview

### Core Documents

| Document | Purpose | Audience |
|----------|---------|----------|
| [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md) | Philosophy & implementation | Designers & Engineers |
| [JOURNEY_MAP.md](JOURNEY_MAP.md) | Emotional blueprint with timing | UX Designers |
| [COLOR_SYSTEM.md](COLOR_SYSTEM.md) | Living palette & chromatic journey | Visual Designers |
| [CHANGELOG.md](CHANGELOG.md) | Technical release notes | Engineers |

### Component Library

**Location:** `/apps/web/components/ui/`

#### SpiralPresence Component
```tsx
import { SpiralPresence, SpiralStatement, ElementalSpiralTransition }
  from '@/components/ui/SpiralPresence';
```

**Three Display Variants:**
- `variant="full"` — Complete five-line invocation
- `variant="compressed"` — Single-breath form: "We gather as many, to remember we are one"
- `variant="single"` — Opening line only: "In the spiral, all find their place"

**Six Elemental Variations:**
- `element="fire"` — Creation & initiation (amber radiance)
- `element="water"` — Belonging & emotion (flowing cerulean)
- `element="earth"` — Grounding & honor (stable olive)
- `element="air"` — Communication & thought (clear silver)
- `element="aether"` — Integration & wholeness (violet shimmer)
- `element="neutral"` — Core presence (warm cream)

**Optional Breathing:**
- `breathe={true}` — 10-second letter-spacing pulse

**Usage Examples:**
```tsx
// At threshold of new page
<SpiralPresence
  variant="full"
  element="neutral"
  delay={0.5}
/>

// Between conversation lulls
<SpiralPresence
  variant="compressed"
  element={currentElement}
  delay={2}
  breathe={true}
/>

// Auto-transitioning with elemental context
<ElementalSpiralTransition currentElement={currentElement} />
```

---

## Implementation Roadmap

### Phase 1: Foundations ✅ COMPLETE

- [x] Create SpiralPresence component system
- [x] Add to Access Matrix opening
- [x] Add to Design Philosophy Credo
- [x] Document design principles
- [x] Create journey map
- [x] Create color system documentation

### Phase 2: Atmosphere (CURRENT SPRINT)

- [ ] Add spiral to Intro page after mantras
- [ ] Weave through Onboarding flow
- [ ] Add breathing signatures to conversation interface
- [ ] Create Benediction component for session endings
- [ ] Implement "Return to the Field" flow

### Phase 3: Chromatic Journey (NEXT SPRINT)

- [ ] Implement day/night circadian mode
- [ ] Add elemental color transitions to Access Matrix
- [ ] Create journey-aware color shifts
- [ ] Add elemental gradients for interactions
- [ ] Test typography legibility across all modes

### Phase 4: Polish (FUTURE)

- [ ] Optional ambient sound layer
- [ ] Context-aware spiral timing (learns user rhythm)
- [ ] Seasonal variations (solstice/equinox themes)
- [ ] Accessibility modes (reduced motion, high contrast)

---

## Technical Specifications

### Animation Timing

| Transition Type | Duration | Easing | Purpose |
|----------------|----------|--------|---------|
| Entry fade | 0.8–1.2s | easeOut | Welcoming appearance |
| Exit fade | 1.8–2.2s | ease-out-quartic | Breath leaving body |
| Element crossfade | 2.0s | easeInOut | Weather-like shift |
| Breath cycle | 10s loop | easeInOut | Living presence |
| Color drift | 3s | cubic-bezier(0.19, 1, 0.22, 1) | Atmospheric transition |

### Easing Curves
```typescript
// Breath leaving body
ease: [0.19, 1, 0.22, 1] // ease-out-quartic

// Natural fade
ease: "easeOut"

// Living breath
ease: "easeInOut"
```

### Color Palette

#### Soul Palette (Base/Neutral)
```typescript
soul: {
  background: '#1A1513',      // Volcanic basalt
  surface: '#2C231F',         // Oxidized bronze
  accent: '#E3B778',          // Sun-touched sand
  accentGlow: '#F0C98A',      // Amber edge glow
  textPrimary: '#FDFBF9',     // Soft ivory
  textSecondary: '#CBBFAD',   // Muted sand
  textTertiary: '#8C6A4A',    // Aged copper
}
```

#### Elemental Palette
```typescript
element: {
  fire: {
    light: '#E89B6F',   // Soft coral
    DEFAULT: '#D4744A', // Deep amber
    dark: '#A54E2A',
  },
  water: {
    light: '#6FA8DC',   // Cerulean
    DEFAULT: '#4A7BA7', // Deep water
    dark: '#2E4A6B',    // Indigo
  },
  earth: {
    light: '#C4B896',   // Sand
    DEFAULT: '#8B7E5A', // Olive
    dark: '#5A5038',
  },
  air: {
    light: '#D4E4F0',   // Pale sky
    DEFAULT: '#A8C4D8', // Silver
    dark: '#7A95A8',
  },
  aether: {
    light: '#C4B5D8',   // Soft violet
    DEFAULT: '#9580B0', // Twilight
    dark: '#6B5580',
  },
}
```

### Typography Guidelines

**Font Stacks:**
- Primary: System UI with fallback to sans-serif
- Sacred Accent: Custom serif for ceremonial moments
- Archive: Wider letter-spacing for contemplative reading

**Letter-spacing Values:**
- Default: `0.02em`
- Archive: `0.1em` (SOULLAB branding)
- Ceremonial: `0.04em` (Credo, Benediction)
- Breathing: Animates between `0.02em` and `0.04em`

**Line-height:**
- Body text: `1.75` (generous for contemplation)
- Headings: `1.5`
- Sacred text: `2.0` (liturgical breathing room)

---

## Page-by-Page Implementation Guide

### 1. Threshold (Signup/Onboarding)
**Location:** `/apps/web/app/onboarding/page.tsx`

**Current State:**
- Has three stages: welcome → assignment → firstContact
- Tesla-style loading animation
- MAIA introduction with five elements

**Needed Changes:**
```tsx
// Replace Tesla geometry with spiral breathing
// At "assignment" stage, after five elements display
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 2, delay: 1 }}
>
  <SpiralPresence
    variant="single"
    element="aether"
    delay={0.5}
    breathe={true}
  />
</motion.div>

// Replace "Begin Your Journey" with "Enter the Field"
<button onClick={handleBeginJourney}>
  Enter the Field →
</button>
```

**Color Palette:** Fire–Aether (25deg → 270deg)

---

### 2. Invitation (Introduction)
**Location:** `/apps/web/app/intro/page.tsx`

**Current State:**
- Cycling mantras (7 × 3s each)
- Daimon explanation with Hesse quote
- Rotating wisdom quotes
- "Continue to MAIA" button

**Needed Changes:**
```tsx
// Import component
import { SpiralPresence } from '@/components/ui/SpiralPresence';

// After last mantra completes, before "Meet MAIA" screen
{currentMantra === shuffledMantras.length - 1 && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2, delay: 1.5 }}
    className="mt-12"
  >
    <SpiralPresence
      variant="full"
      element="neutral"
      delay={0}
    />
  </motion.div>
)}

// Change button text
<button onClick={handleContinue}>
  Enter the Field →
</button>
```

**Color Palette:** Water–Air (210deg → 200deg)

---

### 3. First Move (Access Matrix)
**Location:** `/apps/web/app/about/access-matrix/page.tsx`

**Current State:** ✅ Already has spiral invitation at opening

**Enhancement Needed:**
```tsx
// Track which bead category user is viewing
const [currentElement, setCurrentElement] = useState<Element>('neutral');

// At bottom of page, replace static FieldSignature with:
<ElementalSpiralTransition currentElement={currentElement} />
```

**Color Palette:** Earth (60deg → 45deg)

---

### 4. Deepening (Conversation Interface)
**Location:** `/apps/web/app/oracle/page.tsx`

**Current State:**
- Message history
- Voice interface with mic
- Citations display

**Needed Changes:**
```tsx
// Add state for conversation lull detection
const [showBreathingReminder, setShowBreathingReminder] = useState(false);
const lastMessageTimeRef = useRef(Date.now());

// Track message timing
useEffect(() => {
  lastMessageTimeRef.current = Date.now();
  setShowBreathingReminder(false);

  const timer = setTimeout(() => {
    setShowBreathingReminder(true);
  }, 30000); // 30 seconds of silence

  return () => clearTimeout(timer);
}, [messages]);

// Add spiral presence at bottom of conversation
<AnimatePresence>
  {showBreathingReminder && (
    <SpiralPresence
      variant="compressed"
      element={user?.element || 'neutral'}
      delay={2}
      breathe={true}
    />
  )}
</AnimatePresence>
```

**Color Palette:** Air–Water (200deg → 210deg)

---

### 5. Return (Benediction)
**Location:** Create new component `/apps/web/components/ui/Benediction.tsx`

**Implementation:**
```tsx
"use client";

import { motion } from 'framer-motion';
import { SpiralPresence } from './SpiralPresence';

interface BenedictionProps {
  onComplete?: () => void;
}

export function Benediction({ onComplete }: BenedictionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-soul-background/95 backdrop-blur-md z-50 flex items-center justify-center"
    >
      <div className="max-w-2xl mx-auto text-center space-y-12 px-6">
        {/* Line 1 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0 }}
          className="text-xl md:text-2xl font-light text-soul-textSecondary tracking-wide"
        >
          Go lightly.
        </motion.p>

        {/* Line 2 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
        >
          <p className="text-lg md:text-xl font-light text-soul-textSecondary tracking-wide leading-loose">
            The field moves with you now—<br />
            <span className="tracking-wider">every breath, every pattern, every play.</span>
          </p>
        </motion.div>

        {/* Line 3 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 4 }}
        >
          <p className="text-xl md:text-2xl font-light text-soul-accent tracking-wider">
            What you attend to, attends you.
          </p>
        </motion.div>

        {/* Field Signature */}
        <SpiralPresence
          variant="single"
          element="aether"
          delay={6}
        />

        {/* Return Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 8 }}
          onClick={onComplete}
          className="mt-12 px-12 py-4 bg-gradient-to-r from-soul-accent/90 to-soul-highlight/80
                     text-soul-background rounded-full font-medium
                     hover:from-soul-accentGlow hover:to-soul-highlight
                     transition-all shadow-lg shadow-soul-accent/30"
        >
          Return to the Field
        </motion.button>
      </div>
    </motion.div>
  );
}
```

**Color Palette:** Aether–Neutral (270deg → 35deg)

---

## Quality Checklist

### Visual
- [ ] All transitions feel like weather, not interface
- [ ] Color shifts are imperceptible (<10% saturation drift)
- [ ] Typography breathes (generous line-height, letter-spacing)
- [ ] Sacred geometry background stays subtle (3% opacity max)
- [ ] No visual element demands attention—all invite awareness

### Timing
- [ ] Entry animations: 0.8–1.2s
- [ ] Exit animations: 1.8–2.2s
- [ ] Element transitions: 2.0s crossfade
- [ ] Breath cycle: 10s when enabled
- [ ] No motion persists beyond 3 seconds without user interaction

### Accessibility
- [ ] All text meets WCAG AA contrast standards
- [ ] `prefers-reduced-motion` disables all animations
- [ ] High contrast mode available
- [ ] Keyboard navigation works throughout
- [ ] Screen readers announce transitions gracefully

### Emotional
- [ ] Users report feeling calmer after sessions
- [ ] Dwell time increases but feels shorter
- [ ] Return visits feel like coming home
- [ ] Users pause before clicking (stillness becomes natural)
- [ ] The spiral rhythm becomes recognizable but not predictable

---

## Success Metrics

**Qualitative:**
1. "I didn't realize how much I needed this"
2. "Time disappeared"
3. "It feels alive but not demanding"
4. "I can breathe here"
5. "This is what the internet should have been"

**Quantitative:**
- Average session duration: 8–15 minutes
- Return rate within 7 days: >60%
- Completion of full journey: >40%
- User-reported calmness rating: >4.2/5

---

## Designer Notes

**The Core Teaching:**
> *If the visitor leaves calmer than they arrived, the code is correct.*

**Three Questions to Guide Every Decision:**
1. Does this serve presence or performance?
2. Does this feel like weather or interface?
3. Would I want this if I were seeking stillness?

**When in Doubt:**
- Slow it down 2×
- Reduce opacity by half
- Remove the effect entirely

**The field knows when to be still.**

---

**Handoff Prepared By:** Soullab / Elemental Oracle
**Date:** October 17, 2025
**Version:** 1.0.0 — "The Field Breathes"
