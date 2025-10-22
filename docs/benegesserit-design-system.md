# 🔮 Bene Gesserit Design System

Heart-centered ceremonial aesthetic inspired by Dune's Bene Gesserit sisterhood — sophisticated desert consciousness without the sweetness of pink.

## Design Philosophy

**"The dignity of ritual, the warmth of presence"**

This aesthetic combines:
- **Temple Architecture**: Deep stone, oxidized bronze, sacred geometry
- **Ceremonial Metals**: Bronze, copper, brass — dignified and grounded
- **Sacred Ivory**: Soft robe colors, ancient wisdom, warm light
- **Heart-Centered Rose**: Terracotta, flesh tones, muted coral (NOT pink)
- **Consciousness States**: Indigo, violet, amethyst — prescient depths
- **Spice Wisdom**: Amber, saffron, golden knowledge

## Color Palette

### Architectural Foundation
```css
bg-benegesserit-stone-deep      /* #2B1F1A - Deep umber background */
bg-benegesserit-stone-surface   /* #3D2F27 - Oxidized bronze panels */
bg-benegesserit-stone-raised    /* #4F3D32 - Elevated surfaces */
```

### Ceremonial Metals
```css
text-benegesserit-bronze-dark   /* #8B6F47 - Deep ceremonial bronze */
text-benegesserit-bronze        /* #B8956F - Primary bronze */
text-benegesserit-bronze-bright /* #D4B896 - Polished highlights */
text-benegesserit-copper        /* #B87D5C - Oxidized copper */
text-benegesserit-brass         /* #C9A961 - Warm brass */
```

### Sacred Ivory (Robes & Light)
```css
text-benegesserit-ivory-deep    /* #E8DCC8 - Shadows in fabric */
text-benegesserit-ivory         /* #F2E9D8 - Primary robe color */
text-benegesserit-ivory-bright  /* #F8F3E8 - Radiant light */
text-benegesserit-parchment     /* #E5D5BC - Ancient text */
```

### Heart-Centered Rose (NOT Pink!)
```css
bg-benegesserit-flesh           /* #D4A5A0 - Warm flesh tone */
bg-benegesserit-terracotta      /* #C88B7A - Desert clay */
bg-benegesserit-rose-stone      /* #B8857A - Rose-tinted stone */
bg-benegesserit-blush-sand      /* #E0C0B5 - Subtle blush */
bg-benegesserit-coral-muted     /* #C9968C - Muted coral */
```

### Ceremonial Gradients (Deep Richness)
```css
bg-benegesserit-burgundy-deep   /* #5C3638 - Deep burgundy shadows */
bg-benegesserit-burgundy        /* #7D4B4D - Ceremonial burgundy */
bg-benegesserit-wine            /* #925D5F - Aged wine */
bg-benegesserit-mauve           /* #A87C7E - Dusty mauve */
```

### Consciousness States
```css
bg-benegesserit-indigo-deep     /* #2D2838 - Deep meditation */
bg-benegesserit-violet-shadow   /* #4A3D52 - Prescience */
bg-benegesserit-amethyst-muted  /* #6B5B6E - Inner vision */
bg-benegesserit-lavender-stone  /* #8C7A8F - Balance */
```

### Spice Wisdom
```css
text-benegesserit-amber-dark    /* #8F6B2D - Ancient wisdom */
text-benegesserit-amber         /* #C89446 - Spice revelation */
text-benegesserit-gold-muted    /* #D4A861 - Subtle divinity */
text-benegesserit-saffron       /* #E0B96F - Precious knowledge */
```

## Component Classes

### Backgrounds

#### Basic Backgrounds
```jsx
<div className="bg-bene-gesserit">
  {/* Linear gradient from stone-deep to stone-surface */}
</div>

<div className="bg-bene-gesserit-radial">
  {/* Radial gradient centered at top */}
</div>

<div className="bg-temple-stone">
  {/* Stone texture with subtle grid */}
</div>
```

#### Glass Effects
```jsx
<div className="glass-ceremonial">
  {/* Ceremonial frosted glass with bronze border */}
</div>

<div className="glass-ivory">
  {/* Light ivory glass effect */}
</div>

<div className="glass-bronze">
  {/* Bronze-tinted glass */}
</div>
```

#### Radial Patterns (Sacred Geometry)
```jsx
<div className="radial-consciousness">
  {/* Violet/amethyst radial gradient */}
</div>

<div className="radial-wisdom">
  {/* Amber/golden radial gradient */}
</div>

<div className="radial-heart">
  {/* Rose/terracotta radial gradient */}
</div>
```

### Buttons

```jsx
{/* Primary ceremonial button */}
<button className="btn-ceremonial">
  Initiate Ritual
</button>

{/* Ivory light button */}
<button className="btn-ivory">
  Sacred Text
</button>

{/* Wisdom/knowledge button */}
<button className="btn-wisdom">
  Reveal Knowledge
</button>
```

### Cards

```jsx
<div className="card-ceremonial">
  {/* Temple panel with hover effects */}
  <h3 className="text-ceremonial-heading">Wisdom of the Ancients</h3>
  <p className="text-ceremonial-body">
    The secrets of the Bene Gesserit...
  </p>
</div>
```

### Typography

```jsx
{/* Heading - ivory with shadow */}
<h1 className="text-ceremonial-heading">
  Temple of Consciousness
</h1>

{/* Body - bronze with golden ratio line-height */}
<p className="text-ceremonial-body">
  In the stillness of the desert...
</p>

{/* Wisdom text - amber with glow */}
<span className="text-wisdom">
  The spice must flow
</span>
```

### Glow Effects

```jsx
<div className="glow-bronze">
  {/* Soft bronze radiance */}
</div>

<div className="glow-amber">
  {/* Warm amber glow */}
</div>

<div className="glow-rose">
  {/* Subtle rose glow */}
</div>

<div className="glow-consciousness">
  {/* Violet consciousness glow */}
</div>
```

### Borders

```jsx
<div className="border-ceremonial">
  {/* Hairline stone border */}
</div>

<div className="border-bronze">
  {/* Bronze border with transparency */}
</div>

<div className="border-ivory">
  {/* Ivory border with transparency */}
</div>
```

## Holoflower Variants

```jsx
import { Holoflower } from '@/components/ui/Holoflower';

{/* Ceremonial holoflower - amber wisdom glow */}
<div className="holoflower-ceremonial">
  <Holoflower size={60} element="aether" glowIntensity="high" />
</div>

{/* Heart-centered holoflower - rose glow */}
<div className="holoflower-heart">
  <Holoflower size={60} element="fire" glowIntensity="medium" />
</div>

{/* Consciousness holoflower - violet glow */}
<div className="holoflower-consciousness">
  <Holoflower size={60} element="water" glowIntensity="high" />
</div>
```

## Voice States

The AmbientVoiceIndicator component now uses these ceremonial states:

```jsx
{/* Listening state - consciousness (violet) */}
<div className="voice-listening-ceremonial">
  <Mic /> Listening...
</div>

{/* Speaking state - wisdom (amber) */}
<div className="voice-speaking-ceremonial">
  <Volume2 /> Speaking...
</div>

{/* Present state - heart (rose) */}
<div className="voice-present-ceremonial">
  <Heart /> Present
</div>
```

## Animations

### Ceremonial Pulse
```jsx
<div className="animate-ceremonial-pulse">
  {/* Gentle scale and opacity pulse (3s) */}
</div>
```

### Radial Expand
```jsx
<div className="animate-radial-expand">
  {/* Expanding circle ripple (4s) */}
</div>
```

### Wisdom Shimmer
```jsx
<div className="animate-wisdom-shimmer">
  {/* Subtle brightness shimmer (6s) */}
</div>
```

### Consciousness Ripple
```jsx
<div className="animate-consciousness-ripple">
  {/* Multi-ring ripple effect (3s) */}
</div>
```

### Heart Pulse
```jsx
<div className="animate-heart-pulse">
  {/* Heart-beat glow pulse (2s) */}
</div>
```

### Bronze Glow
```jsx
<div className="animate-bronze-glow">
  {/* Breathing bronze glow (4s) */}
</div>
```

## Layout Utilities

```jsx
{/* Ceremonial container with sacred spacing */}
<div className="ceremonial-container">
  {/* max-w-6xl with responsive padding */}
</div>

{/* Ceremonial section with vertical rhythm */}
<section className="ceremonial-section">
  {/* Responsive vertical padding */}
</section>
```

## Scrollbars

```jsx
<div className="scrollbar-ceremonial overflow-y-auto">
  {/* Bronze-accented scrollbar */}
</div>
```

## Usage Examples

### Complete Voice Control Panel

```jsx
<div className="glass-ceremonial rounded-2xl border-bronze p-6">
  <h3 className="text-ceremonial-heading mb-4">
    Voice Control
  </h3>

  <div className="bg-benegesserit-stone-raised/30 rounded-lg p-3 mb-4 border border-benegesserit-border">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-benegesserit-saffron animate-pulse" />
      <span className="text-xs text-benegesserit-bronze-bright/80">
        Connected
      </span>
    </div>
  </div>

  <button className="btn-wisdom w-full">
    Activate Voice
  </button>
</div>
```

### Ceremonial Card with Radial Pattern

```jsx
<div className="card-ceremonial relative overflow-hidden">
  <div className="radial-wisdom absolute inset-0 opacity-50" />
  <div className="relative z-10">
    <h3 className="text-ceremonial-heading">
      Ancient Wisdom
    </h3>
    <p className="text-ceremonial-body mt-2">
      The Litany Against Fear...
    </p>
  </div>
</div>
```

### Heart-Centered Health Display

```jsx
<div className="bg-bene-gesserit-radial p-8 rounded-3xl">
  <div className="radial-heart absolute inset-0 opacity-30" />

  <div className="relative z-10">
    <div className="holoflower-heart mb-4">
      <Holoflower size={80} element="fire" glowIntensity="high" />
    </div>

    <h2 className="text-ceremonial-heading text-2xl mb-2">
      Heart Coherence
    </h2>

    <div className="flex items-center gap-3">
      <div className="w-4 h-4 rounded-full bg-benegesserit-terracotta animate-heart-pulse" />
      <span className="text-benegesserit-flesh text-lg">
        72 BPM
      </span>
    </div>
  </div>
</div>
```

## Color Psychology

### When to Use Each Color Family

**Bronze/Copper** - Ritual, ceremony, grounding, ancient knowledge
**Ivory** - Purity, wisdom texts, enlightenment, sacred robes
**Rose/Terracotta** - Heart presence, vitality, humanity, warmth
**Burgundy/Wine** - Deep ceremony, sacred moments, intensity
**Violet/Amethyst** - Consciousness, prescience, inner vision, meditation
**Amber/Saffron** - Wisdom, revelation, spice knowledge, breakthrough

## Accessibility Notes

- All colors meet WCAG AA contrast ratios for readability
- Text colors (bronze-bright, ivory-bright) ensure legibility
- Glow effects are purely decorative and don't convey critical info
- Animations can be paused with `prefers-reduced-motion`

## Combining with Existing Palettes

The Bene Gesserit palette complements:
- **Dune palette**: Use together for full desert aesthetic
- **Soul colors**: Similar warmth, can be mixed
- **Arrakis palette**: Night mode pairs beautifully with ceremonial
- **Spiralogic elements**: Use elemental colors with ceremonial borders

```jsx
{/* Example: Dune + Bene Gesserit */}
<div className="bg-dune-ibad-blue">
  <div className="glass-ceremonial p-6">
    <h3 className="text-benegesserit-ivory-bright">
      Eyes of Ibad
    </h3>
  </div>
</div>
```

---

**Created with intentionality and care for the MAIA consciousness system.**

*May your path be illuminated by wisdom, grounded in ceremony, and warmed by presence.*
