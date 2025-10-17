# Elemental Color System — Living Palette

*The spiral breathes through contrast — a color system that moves with time and elemental tone*

---

## Design Principle: Circadian Color

> The spiral isn't monochrome — it breathes through contrast.
> The effect will be like walking through one long day: dawn (entry) → noon (play) → dusk (integration).
> No hard switches, only shifts in atmosphere.

**Color should follow the body's natural rhythm, not just brand identity.**

---

## 1. Core Palette: The Elemental Spectrum

Each element anchors a tonal "family," but all share the same luminosity and saturation level so they can blend cleanly.

| Element                 | Hue Range                | Emotional Role             | Accent Motion               | Usage Context                      |
| ----------------------- | ------------------------ | -------------------------- | --------------------------- | ---------------------------------- |
| **Fire**                | Deep amber → soft coral  | Initiation, vitality       | Subtle radiance pulse       | Onboarding, creation, beginnings   |
| **Water**               | Cerulean → indigo        | Emotion, reflection        | Flowing gradient drift      | Journaling, emotional work         |
| **Earth**               | Olive → sand             | Stability, grounding       | Slow temperature shift      | Practice, embodiment, daily ritual |
| **Air**                 | Silver → pale sky        | Thought, communication     | Gentle transparency flicker | Conversation, learning, insight    |
| **Aether**              | Soft violet → twilight   | Integration, mystery       | Subtle shimmer              | Integration, completion, wholeness |
| **Neutral / Soullight** | Cream → warm parchment   | Resting state, readability | Stillness—no motion         | Default UI, text, backgrounds      |

**Use Neutral palette for default UI, then let element colors breathe through context: buttons, transitions, or ambient glow cues.**

---

## 2. Diurnal Rhythm (Day/Night Mode)

Instead of a toggle, make it a **living rhythm**:

### Day Mode (Dawn → Noon)
- **Background:** Pale soul-background with warm undertones
- **Text:** Darker soul-textPrimary for readability
- **Highlights:** Warm ambers and golds
- **Atmosphere:** Open, expansive, clarity

### Night Mode (Dusk → Night)
- **Background:** Near-black base (#0A0E27) with indigo undertones
- **Text:** Soft soul-textSecondary (cream) for gentle contrast
- **Highlights:** Cooler indigos and violets with gold accents
- **Atmosphere:** Intimate, contemplative, mystery

### Transition Behavior
- Triggered by **ambient light detection** or **local time**
- **3-second crossfade** (weather, not switch)
- Typography hue shifts slightly cooler at night, maintaining legibility but adding calm
- Think of it as **circadian color**—not dark mode for style, but rhythm for the nervous system

---

## 3. CSS Implementation

### Custom Properties (Root Variables)

```css
:root {
  /* Elemental Hue Variables */
  --fire-hue: 25deg;           /* Deep amber */
  --fire-hue-light: 15deg;     /* Soft coral */
  --water-hue: 210deg;         /* Cerulean */
  --water-hue-deep: 240deg;    /* Indigo */
  --earth-hue: 60deg;          /* Olive */
  --earth-hue-warm: 45deg;     /* Sand */
  --air-hue: 200deg;           /* Silver */
  --air-hue-light: 195deg;     /* Pale sky */
  --aether-hue: 270deg;        /* Soft violet */
  --aether-hue-dusk: 260deg;   /* Twilight */
  --neutral-hue: 35deg;        /* Cream/warm parchment */

  /* Saturation & Lightness for consistency */
  --element-saturation: 45%;
  --element-lightness-light: 65%;
  --element-lightness-dark: 35%;

  /* Current soul palette (maintain as defaults) */
  --soul-background: #1A1513;
  --soul-surface: #2C231F;
  --soul-accent: #E3B778;
  --soul-accentGlow: #F0C98A;
  --soul-textPrimary: #FDFBF9;
  --soul-textSecondary: #CBBFAD;
  --soul-textTertiary: #8C6A4A;
}

/* Day Mode adjustments */
[data-theme="day"] {
  --soul-background: #F5F3F0;
  --soul-surface: #E8E4DF;
  --soul-textPrimary: #2A2520;
  --soul-textSecondary: #4A423A;
  --element-lightness-light: 55%;
}

/* Night Mode (default) */
[data-theme="night"] {
  /* Uses root defaults */
  --element-lightness-light: 70%;
}
```

### Elemental Color Generation

```css
/* Fire Element */
.element-fire {
  --current-element-hue: var(--fire-hue);
  background: hsl(var(--fire-hue), var(--element-saturation), var(--element-lightness-dark));
  color: hsl(var(--fire-hue-light), var(--element-saturation), var(--element-lightness-light));
}

.element-fire:hover {
  --current-element-hue: var(--fire-hue-light);
  background: hsl(var(--fire-hue-light), calc(var(--element-saturation) * 1.1), var(--element-lightness-dark));
}

/* Water Element */
.element-water {
  --current-element-hue: var(--water-hue);
  background: hsl(var(--water-hue), var(--element-saturation), var(--element-lightness-dark));
  color: hsl(var(--water-hue), var(--element-saturation), var(--element-lightness-light));
}

/* Earth, Air, Aether follow same pattern */
```

### Animated Hue Rotation

```css
/* Fire pulse (radiance) */
@keyframes fire-pulse {
  0%, 100% { filter: hue-rotate(0deg) brightness(1); }
  50% { filter: hue-rotate(5deg) brightness(1.1); }
}

.element-fire.breathing {
  animation: fire-pulse 4s ease-in-out infinite;
}

/* Water flow (gradient drift) */
@keyframes water-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.element-water.breathing {
  background: linear-gradient(
    135deg,
    hsl(var(--water-hue), var(--element-saturation), var(--element-lightness-dark)),
    hsl(var(--water-hue-deep), var(--element-saturation), var(--element-lightness-dark))
  );
  background-size: 200% 200%;
  animation: water-flow 8s ease-in-out infinite;
}

/* Aether shimmer (subtle) */
@keyframes aether-shimmer {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.8; }
}

.element-aether.breathing {
  animation: aether-shimmer 6s ease-in-out infinite;
}
```

---

## 4. Spiral Gradients (Elemental Interactions)

When elements overlap (e.g., Fire + Water → Steam), the gradient should reference the natural process.

### Interaction Examples

```css
/* Fire + Water = Steam (coral bleeding into indigo, resolved by pale gold mist) */
.spiral-fire-water {
  background: linear-gradient(
    120deg,
    hsl(var(--fire-hue-light), 45%, 55%) 0%,
    hsl(calc((var(--fire-hue) + var(--water-hue)) / 2), 35%, 65%) 50%,
    hsl(var(--water-hue), 45%, 45%) 100%
  );
}

/* Earth + Air = Growth (olive rising into sky) */
.spiral-earth-air {
  background: linear-gradient(
    180deg,
    hsl(var(--earth-hue-warm), 40%, 50%) 0%,
    hsl(var(--air-hue-light), 30%, 70%) 100%
  );
}

/* Water + Aether = Mystery (indigo dissolving into twilight) */
.spiral-water-aether {
  background: linear-gradient(
    270deg,
    hsl(var(--water-hue-deep), 50%, 40%) 0%,
    hsl(var(--aether-hue-dusk), 40%, 50%) 100%
  );
}
```

**Keep gradients directional, moving clockwise to echo the spiral flow.**

---

## 5. Emotional Blueprint Integration

Color should follow the five phases of the Spiral Journey:

| Phase                 | Primary Tone   | Transition Behavior                   | Hue Range                 |
| --------------------- | -------------- | ------------------------------------- | ------------------------- |
| **Threshold**         | Fire–Aether    | Rising amber light, ceremonial warmth | 25deg → 270deg (clockwise) |
| **Orientation**       | Water–Air      | Soft blue drift, transparency shifts  | 210deg → 200deg           |
| **First Move**        | Earth          | Grounded contrast, focused palette    | 60deg → 45deg             |
| **Practice**          | Air–Water      | Cooling tones, reduced saturation     | 200deg → 210deg           |
| **Return**            | Aether–Neutral | Gentle fade into violet-cream calm    | 270deg → 35deg (completion) |

Each phase guides users subtly through hue and light, marking progress without explicit indicators.

### Phase Transition Implementation

```typescript
// Example: useJourneyPhase hook
const PHASE_COLORS = {
  threshold: { element: 'fire', secondary: 'aether', direction: 'clockwise' },
  orientation: { element: 'water', secondary: 'air', direction: 'drift' },
  firstMove: { element: 'earth', secondary: null, direction: 'ground' },
  practice: { element: 'air', secondary: 'water', direction: 'cool' },
  return: { element: 'aether', secondary: 'neutral', direction: 'fade' }
};

export function useJourneyPhase(currentRoute: string) {
  const phase = determinePhase(currentRoute);
  const colors = PHASE_COLORS[phase];

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--journey-phase-hue',
      `var(--${colors.element}-hue)`
    );
    document.documentElement.setAttribute('data-phase', phase);
  }, [phase]);

  return { phase, colors };
}
```

---

## 6. Tailwind Configuration

Update `tailwind.config.ts` to include elemental colors:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        soul: {
          // Existing palette (keep as defaults)
          background: '#1A1513',
          surface: '#2C231F',
          accent: '#E3B778',
          accentGlow: '#F0C98A',
          textPrimary: '#FDFBF9',
          textSecondary: '#CBBFAD',
          textTertiary: '#8C6A4A',
        },
        element: {
          fire: {
            light: '#E89B6F',      // Soft coral
            DEFAULT: '#D4744A',     // Deep amber
            dark: '#A54E2A',
          },
          water: {
            light: '#6FA8DC',      // Cerulean
            DEFAULT: '#4A7BA7',     // Deep water
            dark: '#2E4A6B',       // Indigo
          },
          earth: {
            light: '#C4B896',      // Sand
            DEFAULT: '#8B7E5A',     // Olive
            dark: '#5A5038',
          },
          air: {
            light: '#D4E4F0',      // Pale sky
            DEFAULT: '#A8C4D8',     // Silver
            dark: '#7A95A8',
          },
          aether: {
            light: '#C4B5D8',      // Soft violet
            DEFAULT: '#9580B0',     // Twilight
            dark: '#6B5580',
          },
        },
      },
      animation: {
        'fire-pulse': 'fire-pulse 4s ease-in-out infinite',
        'water-flow': 'water-flow 8s ease-in-out infinite',
        'aether-shimmer': 'aether-shimmer 6s ease-in-out infinite',
      },
    },
  },
};
```

---

## 7. Usage Guidelines

### Default State (Neutral)
Use soul palette for all default UI:
- Backgrounds: `bg-soul-background`
- Text: `text-soul-textPrimary` / `text-soul-textSecondary`
- Accents: `text-soul-accent hover:text-soul-accentGlow`

### Elemental Context
Add element classes when context shifts:
```tsx
<div className="element-fire breathing">
  <SpiralPresence element="fire" variant="full" breathe={true} />
</div>
```

### Transitions
Always use 3-second crossfade for element shifts:
```css
transition: all 3s cubic-bezier(0.19, 1, 0.22, 1);
```

### Contrast Requirements
- Keep total contrast within **WCAG AA** standards
- Mystery, not obscurity
- Test all combinations with contrast checker

---

## 8. Implementation Priority

### Phase 1: Foundation (Current Sprint)
- ✅ Define CSS custom properties
- ⏳ Update Tailwind config with elemental colors
- ⏳ Create useJourneyPhase hook
- ⏳ Add element classes to SpiralPresence component

### Phase 2: Diurnal Rhythm (Next Sprint)
- Implement day/night mode detection
- Add ambient light sensor support (where available)
- Create smooth 3s transitions between modes
- Test typography legibility across modes

### Phase 3: Polish (Future Sprint)
- Add spiral gradient combinations
- Implement elemental interaction colors
- Create accessibility high-contrast mode
- Add user preference override (respect prefers-color-scheme)

---

## 9. Success Criteria

**We will know this works when:**

1. **Colors feel alive, not static**
   - Users notice atmospheric shifts but can't pinpoint the mechanism
   - Transitions feel like weather changing

2. **Time of day affects experience naturally**
   - Morning sessions feel brighter, expansive
   - Evening sessions feel contemplative, intimate
   - No jarring switches

3. **Elemental context enhances meaning**
   - Fire sections feel energizing
   - Water sections feel reflective
   - Transitions between elements feel organic

4. **Accessibility remains paramount**
   - All text meets WCAG AA contrast
   - Reduced motion preferences honored
   - High contrast mode available

5. **The system teaches through experience**
   - Users learn elemental associations without explanation
   - Color becomes language

---

## 10. Designer Notes

**Remember:**
- Every color serves atmosphere, not decoration
- Transitions should feel like breath (3s ease-out)
- Less saturation = more mystery
- The field breathes through color

**When in doubt:**
- Desaturate by 10%
- Slow transition by 2x
- Test in both day and night modes
- Ask: *Does this serve presence or performance?*

---

**Palette Author:** Soullab / Elemental Oracle
**Guiding Principle:** *The spiral breathes through contrast — living color for living systems*
