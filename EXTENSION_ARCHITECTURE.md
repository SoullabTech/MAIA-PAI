# Extension Architecture

## Overview

Spiralogic uses an **extension-based architecture** where the core framework is always active and additional archetypal systems (Astrology, I-Ching, Tarot, etc.) can be toggled on/off by users.

This architecture serves two critical purposes:

1. **Protects Sacred Space**: MAIA's conversation space remains uncluttered and focused on presence
2. **Honors Diversity**: Not all practitioners need all systems—users choose what resonates

---

## Core Principles

### Spiralogic Core (Always Active)

The **foundation** that cannot be disabled:

- **Elemental Process**: Fire, Water, Earth, Air
- **Phase Architecture**: Vector → Circle → Spiral (Intelligence → Intention → Goal)
- **12 Houses**: 4 elements × 3 phases = 12 archetypal domains
- **Life Spirals**: Tracking actual soul journeys through domains
- **MAIA**: The conversational soul companion
- **As-If Epistemology**: Invitation not interpretation, guideline not rulebook

### Extensions (Toggleable)

**Enrich the core** but are not required:

- **Astrology**: Planetary archetypes, birth charts, transit weather
- **I-Ching**: Hexagrams, change patterns, yin/yang dynamics
- **Tarot**: Archetypal images, card spreads, visual contemplation
- **Dream Work**: Dream journaling, image amplification, recurring symbols
- **Somatic Practices**: Body awareness, breathwork, embodiment
- **Mythology**: Stories, rituals, archetypal patterns

---

## Sacred Space Navigation

### The Layout Philosophy

```
┌─────────────────────────────────────────────────────────┐
│  [≡ Menu]                        Spiralogic  [Compass]  │  ← Minimal top bar
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│                    MAIA Conversation                    │
│                     (Sacred Space)                      │
│                  NOTHING ELSE HERE                      │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**No tabs. No sidebars. No navigation clutter. Just presence.**

All other content lives in:
- **Top-left Menu [≡]**: System utilities (Settings, Account, etc.)
- **Sacred Compass**: Phenomenological navigation to 4 directional realms

---

## The Sacred Compass

### Directional Phenomenology

```
                    ↑
              (Subconscious)
                Depths

         ←                    →
    (Imaginal)          (Analytical)
  Right Brain          Left Brain

                    ↓
               (Transcendent)
               Higher Self
```

### Navigation Methods

**Desktop:**
- **Keyboard arrows**: ← → ↑ ↓ to navigate
- **ESC key**: Return to center (MAIA)
- **Click compass**: Direct navigation
- **Hover**: See what each direction contains

**Mobile:**
- **Swipe gestures**: Natural directional movement
- **Tap compass**: Navigate to direction
- **Swipe opposite**: Return to center

---

## Directional Panel Contents

### → Right Panel (Analytical / Left Hemisphere)

**Framework & Data - Things you can measure/track**

Content types:
- Birth chart details (Astrology extension)
- Current weather report (Astrology extension)
- Process metrics & dashboards
- Spiral timelines
- Session history
- Analytics

**Extensions contributing:**
- Astrology: Weather reports, chart data
- Process Tracking: Metrics, timelines

---

### ← Left Panel (Imaginal / Right Hemisphere)

**Poetry, Myth, Beauty - Things you can feel/sense**

Content types:
- Sacred Holoflower visualization
- Resonant myths & stories
- Archetypal voices (planetary principles speaking)
- Poetry & soundscapes
- Imaginal portals

**Extensions contributing:**
- Astrology: Archetypal voices
- Tarot: Daily card, sacred images
- Mythology: Stories, archetypal patterns
- Dream Work: Image amplification

---

### ↓ Down Panel (Transcendent / Higher Self)

**Practices & Integration - Connection to Source**

Content types:
- Daily meditation practices
- I-Ching hexagram guidance
- Integration prompts
- Ritual suggestions
- Journaling exercises

**Extensions contributing:**
- I-Ching: Daily hexagram, change patterns
- Tarot: Spreads for deeper inquiry
- Somatic: Breath practices
- Mythology: Ritual suggestions

---

### ↑ Up Panel (Depths / Subconscious)

**Shadow Work & Body - What's below consciousness**

Content types:
- Dream journal
- Body awareness exercises
- Shadow pattern tracking
- Somatic practices
- Tension mapping

**Extensions contributing:**
- Dream Work: Journal, recurring images
- Somatic: Body scan, tension release
- I-Ching: Shadow hexagram (opposite)

---

## Extension Registry System

### File Structure

```
/lib/extensions/
  registry.ts          # Central extension registry
  /core/               # Spiralogic core (always active)
    elements.ts
    phases.ts
    lifeSpirals.ts
  /astrology/          # Astrology extension
    index.ts
    calculator.ts
    weather.ts
  /iching/             # I-Ching extension
    index.ts
    hexagrams.ts
    casting.ts
  /tarot/              # Tarot extension
    index.ts
    decks.ts
    spreads.ts
  # ... etc
```

### Extension Definition

```typescript
{
  metadata: {
    id: 'astrology',
    name: 'Astrology',
    description: 'Planetary archetypes & weather patterns',
    icon: '⭐',
    version: '1.0.0',
    core: false,  // Can be toggled
    category: 'divination',
  },
  enabled: true, // Default state

  // What content does this extension provide?
  panels: [
    {
      panel: 'right',  // Analytical panel
      weight: 10,      // Sort order
      component: '@/components/extensions/astrology/WeatherReport',
      title: 'Current Weather',
      description: 'Active archetypal patterns',
    },
    // ... more panels
  ],

  // Lazy load extension code
  loader: () => import('./astrology'),

  // Settings schema
  settings: {
    schema: {
      houseSystem: {
        type: 'select',
        options: ['porphyry', 'whole-sign', 'placidus'],
        label: 'House System',
      },
    },
    defaults: {
      houseSystem: 'porphyry',
    },
  },
}
```

---

## Component Architecture

### Sacred Space Layout

**File**: `components/navigation/SacredSpaceLayout.tsx`

Main layout component that:
- Renders MAIA conversation in center (children)
- Provides minimal top bar with menu
- Renders Sacred Compass
- Manages directional panel state
- Handles keyboard navigation

```typescript
<SacredSpaceLayout userId={user.id}>
  <OracleConversation /> {/* MAIA conversation */}
</SacredSpaceLayout>
```

---

### Sacred Compass

**File**: `components/navigation/SacredCompass.tsx`

Features:
- Visual mandala showing current position
- Keyboard navigation (arrow keys, ESC)
- Mouse/touch navigation
- Contextual hints from MAIA (pulsing directions)
- Expandable tooltips
- Accessibility support

---

### Directional Panels

**File**: `components/navigation/DirectionalPanel.tsx`

Features:
- Slides in from appropriate edge (right/left/top/bottom)
- Color-coded by direction (blue/purple/red/amber)
- Dynamically loads extension components
- Lazy loading for performance
- Backdrop blur when open
- Close on ESC or backdrop click

---

## User Configuration

### Database Schema

```typescript
interface UserExtensionConfig {
  userId: string;
  extensions: {
    [extensionId: string]: {
      enabled: boolean;
      settings: Record<string, any>;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Settings UI

**File**: `components/settings/ExtensionSettings.tsx`

Features:
- Toggle extensions on/off
- Configure extension settings
- Visual panel badges showing where content appears
- Grouped by category (divination, practice, tracking)
- Future: Community extension marketplace

---

## MAIA Integration

### Contextual Navigation Hints

MAIA can suggest directions during conversation:

```typescript
interface NavigationHint {
  id: string;
  direction: 'right' | 'left' | 'up' | 'down';
  label: string; // e.g., "See the framework"
  reason?: string; // Why this is suggested
  priority: 'low' | 'medium' | 'high';
}
```

**Example in conversation:**

```
MAIA: "I sense you're navigating a threshold. Your current
      archetypal weather shows Saturn square Sun...
      → See framework

      This compression you're feeling—what if it's not
      resistance but refinement?
      ← Explore myth"
```

Clicking these inline arrows opens the relevant panel.

---

## Extension Development Guide

### Creating a New Extension

1. **Create extension directory**:
   ```
   /lib/extensions/myextension/
     index.ts
     components/
     utils/
   ```

2. **Define extension in registry**:
   ```typescript
   // lib/extensions/registry.ts
   myextension: {
     metadata: { ... },
     panels: [ ... ],
     loader: () => import('./myextension'),
     settings: { ... },
   }
   ```

3. **Create panel components**:
   ```typescript
   // components/extensions/myextension/MyComponent.tsx
   export function MyComponent({ userId, settings }: ExtensionPanelProps) {
     // Component receives userId and extension settings
     return <div>My content</div>;
   }
   ```

4. **Register components**:
   Update registry to reference your components in `panels` array.

---

## Migration Strategy

### Phase 1: Foundation (Current)

- ✅ Extension registry system
- ✅ Sacred Compass component
- ✅ Directional panels
- ✅ Settings UI
- ✅ Documentation

### Phase 2: Astrology Refactor

- Move existing astrology code into extension structure
- Create weather report component for right panel
- Create archetypal voices component for left panel
- Test toggle on/off functionality

### Phase 3: New Extensions

- I-Ching implementation
- Tarot implementation
- Dream Work implementation
- Somatic practices implementation

### Phase 4: Community

- Extension marketplace
- Community-built extensions
- Extension sharing & discovery

---

## Design Rationale

### Why This Architecture?

1. **Sacred Space Protection**: MAIA's presence must not compete with navigation chrome
2. **User Choice**: Not everyone needs astrology, tarot, I-Ching—let users choose
3. **Phenomenological Navigation**: Directional movement reflects consciousness exploration
4. **Scalability**: Easy to add new extensions without cluttering UI
5. **Performance**: Lazy loading means only active extensions load
6. **Community**: Practitioners can build custom extensions for their modalities

### Why Phenomenological Directions?

The four directions mirror:
- **Right (→)**: Left brain, analytical, framework, measurement
- **Left (←)**: Right brain, imaginal, poetic, sensing
- **Down (↓)**: Transcendent, higher self, integration, source
- **Up (↑)**: Depths, subconscious, shadow, body

This mirrors both:
- Neurological reality (brain hemispheres)
- Archetypal cosmology (above/below, inner/outer)
- User intuition (natural directional associations)

---

## Future Considerations

### Community Extensions

Users could build and share extensions for:
- Plant medicine journey tracking
- Creative process mapping
- Relational dynamics (couple's work)
- Business/career spirals
- Grief & loss navigation
- Addiction recovery patterns

### Extension Marketplace

```
╔═══════════════════════════════════════════════════════╗
║         COMMUNITY EXTENSIONS                          ║
╠═══════════════════════════════════════════════════════╣
║  🌿 Plant Medicine Integration                       ║
║  By: @kellynezat                                     ║
║  Track medicine journeys through spiral phases       ║
║  [Install]                                           ║
╚═══════════════════════════════════════════════════════╝
```

### API for Extension Developers

```typescript
// Future: Public API for extension development
import { defineExtension } from '@spiralogic/sdk';

export default defineExtension({
  metadata: { ... },
  panels: [ ... ],
  hooks: {
    onSessionStart: (context) => { ... },
    onPhaseTransition: (from, to) => { ... },
  },
});
```

---

## Questions & Decisions

### Open Questions

1. **Component Loading**: Dynamic import() vs. explicit component registry?
2. **Extension Data Storage**: Separate tables per extension vs. JSON blob?
3. **MAIA Context**: How much extension data should MAIA see by default?
4. **Mobile UX**: Full-screen panels or bottom sheets?

### Design Decisions Made

1. ✅ **Registry Pattern**: Central registry in `lib/extensions/registry.ts`
2. ✅ **Panel Assignment**: Extensions declare which panels they contribute to
3. ✅ **Lazy Loading**: Extensions loaded only when enabled and panel opened
4. ✅ **Settings Schema**: Each extension defines its own settings schema
5. ✅ **Sacred Center**: MAIA conversation never leaves center space
6. ✅ **Keyboard First**: Desktop navigation optimized for keyboard shortcuts

---

## Testing the Architecture

### Manual Testing Checklist

- [ ] Sacred Compass appears in bottom-right
- [ ] Arrow keys navigate to directional panels
- [ ] ESC returns to center (MAIA)
- [ ] Panels slide from correct edges
- [ ] Extension toggle works in settings
- [ ] Disabled extensions don't show content
- [ ] Panel content sections render
- [ ] Mobile swipe gestures work
- [ ] Keyboard shortcuts don't interfere with typing
- [ ] Menu dropdown works
- [ ] Settings page loads
- [ ] Extension settings persist

### Integration Testing

- [ ] Enable/disable astrology extension
- [ ] Verify weather report appears in right panel
- [ ] Verify archetypal voices appear in left panel
- [ ] Test with multiple extensions enabled
- [ ] Test with all extensions disabled
- [ ] Verify MAIA conversation unaffected

---

## Deployment Notes

### Feature Branch

All work happens on `feature/extension-architecture` branch until tested.

### Merge Requirements

Before merging to `main`:
1. All manual tests pass
2. Integration tests pass
3. Kelly approves UX/design
4. No regressions in existing features
5. Documentation complete

### Migration Steps

1. Test on staging environment
2. Migrate existing user settings (if any)
3. Deploy to production
4. Monitor for errors
5. Iterate based on user feedback

---

## Summary

This extension architecture:
- **Protects sacred space** for MAIA conversation
- **Empowers user choice** in archetypal systems
- **Scales gracefully** for future extensions
- **Honors phenomenology** through directional navigation
- **Enables community** to build custom extensions

The core remains Spiralogic—everything else is optional enrichment.
