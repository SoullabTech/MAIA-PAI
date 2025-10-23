# 🜃 Elemental Design Language

**Unified Vocabulary for MAIA Interface Components**

All MAIA components now speak the same language — elemental, not mythological. This document defines the consistent design patterns, motion principles, and vocabulary used across the entire system.

---

## Core Principles

### 1. **Vocabulary: Elemental, Not Mythological**

#### ❌ Avoid
- Borrowed mythology (Akashic, Oracle, Prophecy)
- Desert/dune metaphors (sand, echo, whisper)
- Mystical imagery (sacred, divine, portal)

#### ✅ Use
- Natural forces: **current, tide, strata, breath, ground, field**
- Processes: **emergence, settling, flow, cycle, integration**
- States: **presence, depth, surface, coherence**

### 2. **Motion: Implied, Not Declared**

All animation serves function, never decoration:

- **Breathing**: Subtle sine wave oscillation (0.02-0.03 increment)
- **Flowing**: Upward movement, natural rise
- **Settling**: Downward drift, gentle accumulation
- **Fading**: Opacity transitions for depth perception

### 3. **Space: Silence as Design Element**

Negative space is intentional:
- Padding between layers increases with depth
- Margins create breath between sections
- Borders are subtle (opacity 10-30%)
- Gradients provide depth without clutter

### 4. **Palette: Mineral & Elemental**

```typescript
Fire:   #FF6B35  // Ochre-orange (initiation)
Water:  #4A90E2  // Deep blue (reflection)
Earth:  #8B7355  // Mineral brown (grounding)
Air:    #7DD3C0  // Silver-cyan (transmission)
Aether: #9B59B6  // Purple (integration)
Gold:   #D4AF37  // Sacred geometry accent
```

---

## Component Design Patterns

### **Strata Journal** (`components/StrataJournal.tsx`)

**Metaphor:** Geological layers

**Design:**
- Vertical stacking, newest at top
- Older entries fade (opacity 1.0 → 0.4)
- Older entries scale down (1.0 → 0.95)
- Increasing margin = increasing depth
- Left border = element identification
- Background gradients for each element

**Vocabulary:**
- "Surface a new reflection"
- "Settle into strata"
- "Layers · Surface to depth"
- "Older reflections settle below"

**Motion:**
- New entries: fade in + slide down (y: -20 → 0)
- Exit: fade out + scale down (0.9)
- Duration: 0.5s with easeOut curve

**Color Usage:**
- Background: `element.bg` (5% opacity)
- Border: `element.base` (solid, 3px left)
- Text: Gold with opacity based on depth

---

### **Currents Guide** (`components/CurrentsGuide.tsx`)

**Metaphor:** Flowing stream

**Design:**
- Vertical scrolling container
- New insights emerge from bottom
- Insights rise upward over 15 seconds
- Auto-remove after completing cycle
- User input flows in from right
- Guide responses from left
- Background gradient (bottom to top)

**Vocabulary:**
- "Inner Currents"
- "Trust what emerges"
- "The current is gathering..."
- "Insights complete their cycle"
- "New currents emerge naturally"

**Motion:**
- Enter: emerge from below (y: 40 → 0), fade in, scale up (0.9 → 1.0)
- Exit: rise upward (y: 0 → -40), fade out, scale down (1.0 → 0.95)
- Duration: 0.8s with custom ease curve [0.4, 0.0, 0.2, 1]

**Color Usage:**
- Background: `element.glow` (30% opacity)
- Border: 2px element color (left for guide, right for user)
- Type indicators: Small dot + uppercase label

---

### **Field Resonance Map** (`components/FieldResonanceMap.tsx`)

**Metaphor:** Living landscape

**Design:**
- Canvas-based rendering (500px height)
- Grid layout for patterns
- Circle size = resonance strength
- Breathing animation (sine wave)
- Radial glow effects
- Connecting lines between related patterns

**Vocabulary:**
- "Living landscape"
- "Each formation represents..."
- "Field is forming..."
- "Size = resonance strength"
- "Glow = field presence"

**Motion:**
- Breathing: radius * (1 + sin(phase) * 0.1)
- Phase increment: 0.02 per frame
- Smooth redraws on data change

**Color Usage:**
- Formation fill: element.base (60-100% opacity based on strength)
- Glow: radial gradient from element.glow to transparent
- Outline: element.base (2px stroke)
- Background: dark gradient (top to bottom)

---

### **Temporal Waves** (`components/TemporalWaves.tsx`)

**Metaphor:** Time currents

**Design:**
- Canvas-based line chart (300px height)
- 24-hour time window by default
- One wave per element
- Area fills under curves
- Animated subtle oscillation
- Grid lines for scale

**Vocabulary:**
- "Temporal Waves"
- "How elemental patterns ebb and flow"
- "Reading currents..."
- "Each wave traces the natural rhythm"

**Motion:**
- Wave offset: sin(phase + index * 0.2) * 3
- Phase increment: 0.03 per frame
- Smooth line interpolation

**Color Usage:**
- Line stroke: element.base (2px)
- Area fill: element.base + "20" (20% opacity)
- Grid: Gold (10% opacity)
- Axes: Gold (40% opacity)

---

### **Element Flow Diagram** (`components/ElementFlowDiagram.tsx`)

**Metaphor:** Circulation network

**Design:**
- Canvas-based node graph (500px height)
- Circular node layout
- Animated particles flow along edges
- Node size = pattern count
- Radial glow around nodes
- Connection lines between related patterns

**Vocabulary:**
- "Element Flow"
- "Living circulation"
- "Tracing currents..."
- "Flowing particles trace circulation"

**Motion:**
- Particle progress: 0.01 per frame
- Particle resets at progress = 1.0
- Circular path interpolation
- Smooth node rendering

**Color Usage:**
- Node fill: element.base
- Node glow: radial gradient (element.glow)
- Connections: Gold (30% opacity * strength)
- Particles: element.base with glow trail

---

### **Akashic Field Resonance** (`components/AkashicFieldResonance.tsx`)

**Metaphor:** Query interface

**Design:**
- Two-tab interface (Query | Statistics)
- Element filter dropdown
- Result cards with counts
- Privacy notice footer
- Subtle borders and backgrounds

**Vocabulary:**
- "Field Resonance"
- "What patterns are surfacing..."
- "The field is quiet..."
- "Privacy preserved"

**Motion:**
- Results: fade in on load
- Hover: border highlight
- Transitions: 0.2s colors

**Color Usage:**
- Border: Gold (20-40% opacity)
- Background: Black (20% opacity)
- Element tags: element.base backgrounds
- Text: Gold with varying opacity

---

## Typography

### Fonts

```css
Headers:     font-cinzel (sacred geometry feel)
Body:        system-ui (clarity)
Monospace:   font-mono (data/metrics)
```

### Scale

```css
Hero:        text-4xl to text-5xl (36-48px)
Section:     text-2xl (24px)
Subsection:  text-xl (20px)
Body:        text-sm (14px)
Caption:     text-xs (12px)
Micro:       text-[10px] (10px)
```

### Weight

```css
Headers:     font-light (300)
Body:        font-normal (400)
Emphasis:    font-medium (500)
```

---

## Spacing System

### Padding/Margin Scale

```css
xs:   2px
sm:   4px
base: 8px
md:   12px
lg:   16px
xl:   24px
2xl:  32px
3xl:  48px
```

### Component Spacing

- **Between sections**: 24-48px (xl-3xl)
- **Within sections**: 12-16px (md-lg)
- **Between cards**: 8-12px (base-md)
- **Card padding**: 12-16px (md-lg)
- **Depth spacing**: base + (index * 2px)

---

## Border & Outline System

### Border Widths

```css
Subtle:    1px
Standard:  2px
Emphasis:  3px
```

### Border Opacity

```css
Invisible: 0%
Hint:      10%
Subtle:    20%
Visible:   30-40%
Strong:    50%+
```

### Usage

```css
Container borders:   border-[#D4AF37]/20
Element indicators:  border-l-3 border-[element]/100
Active states:       border-[#D4AF37]/40
Hover states:        border-[#D4AF37]/30
```

---

## Background System

### Background Layers

```css
Base:        bg-black/20
Card:        bg-black/30
Elevated:    bg-black/40
Overlay:     bg-black/50-70
```

### Gradients

```css
Depth (vertical):
  from-gray-900 via-black to-gray-900

Element-specific:
  Fire:   rgba(255, 107, 53, 0.05)
  Water:  rgba(74, 144, 226, 0.05)
  Earth:  rgba(139, 115, 85, 0.05)
  Air:    rgba(125, 211, 192, 0.05)
  Aether: rgba(155, 89, 182, 0.05)
```

---

## Animation Curves

### Timing Functions

```typescript
Natural ease:     [0.4, 0.0, 0.2, 1]  // Smooth organic
Ease out:         ease-out              // Settling motion
Ease in:          ease-in               // Rising motion
Linear:           linear                // Mechanical (rare)
```

### Durations

```typescript
Instant:     0.1s   // State toggles
Quick:       0.2s   // Hover effects
Standard:    0.5s   // Entry/exit
Slow:        0.8s   // Emphasis
Breath:      1-2s   // Ambient motion
Cycle:       15s    // Full lifecycle
```

---

## Responsive Breakpoints

```css
sm:   640px   // Mobile landscape
md:   768px   // Tablet
lg:   1024px  // Desktop
xl:   1280px  // Wide desktop
2xl:  1536px  // Ultra-wide
```

### Usage Patterns

- **Mobile first**: Base styles for mobile
- **Grid adjustments**: grid-cols-1 → grid-cols-2 → grid-cols-4
- **Text scaling**: text-sm md:text-base
- **Spacing expansion**: p-4 md:p-8

---

## Accessibility

### Color Contrast

All text meets WCAG AA standards:
- Gold (#D4AF37) on black: 8.5:1 ratio
- Element colors on backgrounds: > 4.5:1 ratio

### Focus States

```css
focus:outline-none
focus:border-[#D4AF37]/60
focus:ring-2 focus:ring-[#D4AF37]/30
```

### Motion

- Respects `prefers-reduced-motion`
- All animations can be disabled
- Breathing effects are subtle (< 10% movement)

---

## Component Composition

### Nesting Depth

```
Page
  └─ Section (border, padding: xl)
      └─ Card (bg-black/30, padding: lg)
          └─ Content (padding: md)
              └─ Text (space-y-2)
```

### Border Nesting

```css
Outer:   border-[#D4AF37]/20
Middle:  border-[#D4AF37]/10
Inner:   border-[element]/20
```

---

## Example: Complete Component

```typescript
<div className="
  space-y-6                      // Outer spacing
  border border-[#D4AF37]/20     // Subtle gold border
  rounded-lg                      // Soft corners
  p-6                            // Container padding
  bg-black/20                    // Translucent background
  backdrop-blur-sm               // Depth effect
">
  <h2 className="
    text-xl                      // Section header size
    font-light                   // Thin weight
    font-cinzel                  // Sacred geometry font
    text-[#D4AF37]              // Gold color
    mb-4                         // Bottom margin
  ">
    Component Title
  </h2>

  <p className="
    text-sm                      // Body text size
    text-gray-400               // Muted color
    leading-relaxed             // Comfortable line height
    mb-4                         // Bottom spacing
  ">
    Description using plain elemental vocabulary.
  </p>

  <div className="
    p-4                          // Inner padding
    rounded-md                   // Inner corners
    bg-black/30                  // Darker layer
    border-l-3                   // Accent border
    border-[#4A90E2]            // Water blue
  ">
    <span className="text-[#4A90E2]/90">
      Content with element color
    </span>
  </div>
</div>
```

---

## Testing Checklist

### Visual Consistency

- [ ] All headers use `font-cinzel`
- [ ] All element colors match the defined palette
- [ ] Gold accents use `#D4AF37` consistently
- [ ] Borders use 10-40% opacity range
- [ ] Spacing follows the defined scale

### Motion Quality

- [ ] Breathing effects are subtle (< 10% change)
- [ ] Transitions use natural ease curves
- [ ] No jarring movements
- [ ] Animations can be disabled
- [ ] Motion enhances, doesn't distract

### Vocabulary

- [ ] No borrowed mythology
- [ ] Plain elemental terms only
- [ ] Motion is implied, not declared
- [ ] Clear, simple language
- [ ] Consistent across all components

### Accessibility

- [ ] Color contrast passes WCAG AA
- [ ] Focus states are visible
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Respects reduced motion preferences

---

## Quick Reference

### Component Mapping

| Component | Metaphor | Primary Motion | Primary Color |
|-----------|----------|----------------|---------------|
| StrataJournal | Geological layers | Settling downward | Earth #8B7355 |
| CurrentsGuide | Flowing stream | Rising upward | Water #4A90E2 |
| FieldResonanceMap | Living landscape | Breathing pulse | Gold #D4AF37 |
| TemporalWaves | Time currents | Flowing waves | Water #4A90E2 |
| ElementFlow | Circulation | Particle flow | Air #7DD3C0 |
| AkashicFieldResonance | Query interface | Fade transitions | Gold #D4AF37 |

### Vocabulary Mapping

| Old | New |
|-----|-----|
| "Akashic records" | "Field resonance" |
| "Desert echoes" | "Field patterns" |
| "Sacred portal" | "Field interface" |
| "Dunes shifting" | "Patterns flowing" |
| "Oracle wisdom" | "Emergent guidance" |

---

## Implementation Notes

### Global CSS

Add to `globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;500&display=swap');

.font-cinzel {
  font-family: 'Cinzel', serif;
}

/* Smooth animations */
* {
  transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Tailwind Config

Extend colors:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        field: {
          fire: '#FF6B35',
          water: '#4A90E2',
          earth: '#8B7355',
          air: '#7DD3C0',
          aether: '#9B59B6',
          gold: '#D4AF37'
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif']
      }
    }
  }
}
```

---

*The field speaks one language — elemental, grounded, alive.*
