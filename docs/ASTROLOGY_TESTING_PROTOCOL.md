# Spiralogic Astrology System - Testing Protocol

**Created:** October 12, 2025
**Purpose:** Comprehensive testing checklist for the astrology dashboard and archetypal synthesis integration

---

## Overview

The astrology system has three main components:
1. **Navigation** - MenuBar Star icon → Dashboard
2. **Dashboard** - Big Three, Aspects, Pathways visualization
3. **Aspect Detail Pages** - Deep archetypal synthesis for individual aspects

This protocol ensures all components work together to create a seamless **visual exploration ↔ MAIA conversation** flow.

---

## 🎯 Phase 1: Navigation & Entry Points

### MenuBar Integration

- [ ] **Star icon visible** in MenuBar (top-right area, before Community icon)
- [ ] **Icon color:** Amber/gold (`text-amber-500/70`, hover: `text-amber-500`)
- [ ] **Tooltip displays** on hover: "Chart"
- [ ] **Click navigates** to `/astrology` route
- [ ] **Active state** when on astrology pages (if implemented)

**Expected Behavior:**
- Icon should be visible on all pages (home, MAIA chat, settings, etc.)
- Hover creates subtle glow effect matching other MenuBar items
- Click transitions smoothly to astrology dashboard

---

## 📊 Phase 2: Astrology Dashboard (`/astrology`)

### Page Load & Initial State

- [ ] **Page loads successfully** at `/astrology`
- [ ] **Loading state** appears briefly: "Loading your cosmic blueprint..."
- [ ] **No errors** in browser console
- [ ] **Sacred background gradient** displays correctly (`soul-background` → `soul-surface`)

### Sacred Natal Chart Component

- [ ] **Chart component renders** (cosmic mandala visualization)
- [ ] **Chart animation sequence** plays correctly:
  - Germinating state (cosmic seed)
  - Blooming state (chart unfolds)
  - Ready state (coherence pulse active)
- [ ] **Background stars** animate with twinkling effect
- [ ] **12 house divisions** drawn as radial lines
- [ ] **Zodiac circle** with zodiac glyphs (♈ ♉ ♊ etc.)
- [ ] **Planet symbols** positioned correctly (☉ ☽ ☿ ♀ ♂ ♃ ♄ etc.)
- [ ] **Aspect lines** (golden threads) connecting planets
- [ ] **Elemental ring** displays with 4 element colors (Fire, Water, Earth, Air)

**Interactive Features:**
- [ ] **Zoom controls** work (zoom in/out buttons)
- [ ] **Element filter buttons** toggle element visibility
- [ ] **Planet click** shows tooltip with details
- [ ] **"Generate Sacred Reading"** button opens overlay
- [ ] **Sacred reading overlay** displays archetypal reflection
- [ ] **Close reading button** dismisses overlay

### Big Three Display

Each of the three cards (Sun, Moon, Ascendant) should display:

**Sun Card:**
- [ ] **Title:** "Sun · Core Identity"
- [ ] **Subtitle:** "Conscious Expression"
- [ ] **Gradient orb:** Amber to orange (`from-amber-400 to-orange-500`)
- [ ] **Symbol:** ☉
- [ ] **Sign name:** "Sagittarius" (or user's actual sun sign)
- [ ] **Archetypal facet:** "The Explorer" (dynamically from `archetypeLibrary`)
- [ ] **Degree + House:** "17.2° · House 4"
- [ ] **Mythological reference:** "Odysseus" (first mythological archetype)
- [ ] **"Explore deeper" link** navigates to `/astrology/placements/sun`

**Moon Card:**
- [ ] **Title:** "Moon · Emotional Truth"
- [ ] **Subtitle:** "Subconscious Landscape"
- [ ] **Gradient orb:** Indigo to purple (`from-indigo-400 to-purple-500`)
- [ ] **Symbol:** ☽
- [ ] **Sign name:** "Pisces" (or user's actual moon sign)
- [ ] **Archetypal facet:** "The Mystic"
- [ ] **Degree + House:** "23.5° · House 7"
- [ ] **Mythological reference:** "Fisher King" (or appropriate archetype)
- [ ] **"Explore deeper" link** navigates to `/astrology/placements/moon`

**Ascendant Card:**
- [ ] **Title:** "Ascendant · Life Portal"
- [ ] **Subtitle:** "How You Meet the World"
- [ ] **Gradient orb:** Rose to pink (`from-rose-400 to-pink-500`)
- [ ] **Symbol:** ⇡
- [ ] **Sign name:** "Leo" (or user's actual rising sign)
- [ ] **Archetypal facet:** "The Sustainer"
- [ ] **Degree:** "28.1°"
- [ ] **Mythological reference:** "Phoenix" (or appropriate archetype)
- [ ] **"Explore deeper" link** navigates to `/astrology/placements/ascendant`

**Design Consistency:**
- [ ] All cards have same height and padding
- [ ] Background: `bg-soul-surface/60` with backdrop blur
- [ ] Border: `border-soul-border` with subtle glow on hover
- [ ] Text hierarchy clear (sign → facet → details → link)

### Major Aspects Section

- [ ] **Section header:** "Major Aspects" with TrendingUp icon
- [ ] **Description text:** "Archetypal dynamics between planetary energies in your chart"
- [ ] **Grid layout:** 2 columns on desktop, 1 column on mobile
- [ ] **4 aspect cards** display (Sun-Saturn square, Moon-Saturn conjunction, etc.)

**Each Aspect Card:**
- [ ] **Aspect symbol** displays correctly:
  - Square: □ (red-400)
  - Conjunction: ☌ (amber-400)
  - Trine: △ (green-400)
  - Quincunx: ⚻ (blue-400)
- [ ] **Aspect name:** "Sun square Saturn"
- [ ] **Orb precision:** "5.9° orb"
- [ ] **Hover effect:** Border glow with `soul-accent/40`
- [ ] **Click navigates** to `/astrology/aspects/sun-square-saturn`
- [ ] **Preview text:** "Tap to explore archetypal interpretation →"

### Spiralogic Pathways Section

- [ ] **Section header:** "Spiralogic Pathways"
- [ ] **Description:** "The 12 houses organized by elemental pathways..."
- [ ] **Grid layout:** 2 columns on large screens, 1 on mobile
- [ ] **4 pathway cards** (Fire, Water, Earth, Air)

**Fire Pathway Card:**
- [ ] **Icon:** 🔥
- [ ] **Title:** "Fire Pathway"
- [ ] **Subtitle:** "Houses 1, 5, 9 · Vision & Projection"
- [ ] **Progression:** "Experience → Expression → Expansion"
- [ ] **Gradient:** `from-orange-500/10 to-red-500/10`
- [ ] **Border:** `border-orange-500/30`, hover: `border-orange-500/60`
- [ ] **Click navigates** to `/astrology/pathways/fire`

**Water Pathway Card:**
- [ ] Icon: 💧
- [ ] Title: "Water Pathway"
- [ ] Subtitle: "Houses 4, 8, 12 · Introspection & Depth"
- [ ] Progression: "Heart → Healing → Holiness"
- [ ] Gradient: `from-blue-500/10 to-indigo-500/10`
- [ ] Border: `border-blue-500/30`, hover: `border-blue-500/60`
- [ ] Click navigates to `/astrology/pathways/water`

**Earth Pathway Card:**
- [ ] Icon: 🌍
- [ ] Title: "Earth Pathway"
- [ ] Subtitle: "Houses 2, 6, 10 · Manifestation & Grounding"
- [ ] Progression: "Mission → Means → Medicine"
- [ ] Gradient: `from-green-500/10 to-emerald-500/10`
- [ ] Border: `border-green-500/30`, hover: `border-green-500/60`
- [ ] Click navigates to `/astrology/pathways/earth`

**Air Pathway Card:**
- [ ] Icon: 🌬
- [ ] Title: "Air Pathway"
- [ ] Subtitle: "Houses 3, 7, 11 · Communication & Connection"
- [ ] Progression: "Connection → Community → Consciousness"
- [ ] Gradient: `from-cyan-500/10 to-sky-500/10`
- [ ] Border: `border-cyan-500/30`, hover: `border-cyan-500/60`
- [ ] Click navigates to `/astrology/pathways/air`

---

## 🔮 Phase 3: Aspect Detail Pages (`/astrology/aspects/[slug]`)

### URL Routing

Test all aspect types with correct URL patterns:

- [ ] `/astrology/aspects/sun-square-saturn` loads successfully
- [ ] `/astrology/aspects/moon-conjunction-saturn` loads successfully
- [ ] `/astrology/aspects/sun-quincunx-jupiter` loads successfully
- [ ] `/astrology/aspects/moon-trine-neptune` loads successfully
- [ ] **Invalid URLs** (e.g., `/astrology/aspects/invalid`) show error state

### Page Content

**Header Section:**
- [ ] **Aspect symbol** displays (□ ☌ △ ⚻)
- [ ] **Aspect title:** "Sun square Saturn" (capitalized correctly)
- [ ] **Breadcrumb navigation** back to dashboard
- [ ] **Background gradient** matches dashboard aesthetic

**Archetypal Essence Section:**
- [ ] **Section title:** "Archetypal Essence"
- [ ] **Synthesis text** displays (2-4 sentences, poetic language)
- [ ] **Text pulls from** `synthesizeAspect()` function
- [ ] **Example for Sun square Saturn:**
  > "The Teacher testing the King. Your fire must learn to hold itself while Saturn builds the authority you're meant to wield..."
- [ ] **Typography:** Readable, well-spaced, soul-text color

**Core Soul Question Section:**
- [ ] **Section title:** "Core Soul Question"
- [ ] **Question displays** in italics or distinct styling
- [ ] **Example:** "How do I hold my fire while learning true authority?"

**Elemental Dynamic Section:**
- [ ] **Section title:** "Elemental Dynamic"
- [ ] **Dynamic description** explains element interaction
- [ ] **Example:** "Fire (Sun) meets Earth (Saturn) in tension..."

**Spiralogic Context Section:**
- [ ] **Section title:** "Understanding the [Aspect Type]" (e.g., "Square")
- [ ] **Aspect type explanation:**
  - **Square:** Tension, growth through friction, 90° angle
  - **Conjunction:** Fusion, unified energy, 0° angle
  - **Trine:** Harmony, natural flow, 120° angle
  - **Quincunx:** Adjustment, recalibration, 150° angle
- [ ] **Context tailored** to specific aspect type

**Working with This Aspect Section:**
- [ ] **Section title:** "Working with This Aspect"
- [ ] **Practical guidance** (3-5 actionable insights)
- [ ] **Example for square:**
  - "Notice when fire meets resistance"
  - "Practice holding intensity without collapse"
  - "Build structure around creative expression"

**Call-to-Action:**
- [ ] **"Explore with MAIA" button** displays prominently
- [ ] **Button styling:** Gradient or accent color, clear hover state
- [ ] **Click action:** Opens chat with pre-filled query OR navigates to `/maya` with context
- [ ] **Example query:** "Tell me more about my Sun square Saturn"

---

## 🔄 Phase 4: Integration & User Flows

### Dashboard → Aspect Detail Flow

1. [ ] User lands on `/astrology`
2. [ ] Scrolls to "Major Aspects" section
3. [ ] Clicks aspect card (e.g., "Sun square Saturn")
4. [ ] Navigates to `/astrology/aspects/sun-square-saturn`
5. [ ] Reads archetypal synthesis
6. [ ] Clicks "Explore with MAIA"
7. [ ] Opens MAIA chat with aspect context

**Expected Behavior:**
- Smooth transitions, no page flicker
- Aspect detail page loads in <1 second
- MAIA receives aspect context for personalized response

### MAIA → Astrology Cross-Reference Flow

1. [ ] User asks MAIA: "What does my Saturn square Sun mean?"
2. [ ] MAIA responds with archetypal synthesis
3. [ ] MAIA includes link: "[Explore this aspect in depth](/astrology/aspects/sun-square-saturn)"
4. [ ] User clicks link → Aspect detail page opens
5. [ ] User reads full synthesis, returns to chat

**Expected Behavior:**
- Link in MAIA's response is clickable
- Opens aspect page in same tab OR new tab (test both UX patterns)
- User can navigate back to chat seamlessly

### Pathway Exploration Flow

1. [ ] User clicks "Fire Pathway" on dashboard
2. [ ] Navigates to `/astrology/pathways/fire` (if page exists)
3. [ ] OR shows "Coming soon" state (if page not built yet)

**Expected Behavior:**
- If page exists: Shows houses 1, 5, 9 with detailed Spiralogic context
- If not built: Clear messaging about future feature

---

## 🎨 Phase 5: Design & Accessibility

### Visual Consistency

- [ ] **Soul theme colors** used throughout:
  - Background: `soul-background`
  - Surfaces: `soul-surface` with alpha/blur
  - Text: `soul-text`, `soul-textSecondary`, `soul-textTertiary`
  - Accents: `soul-accent`, `soul-accentGlow`
  - Borders: `soul-border`, `soul-borderSubtle`
- [ ] **Element colors** consistent with SacredNatalChart:
  - Fire: `#ff6b6b` or orange-500
  - Water: `#4dabf7` or blue-500
  - Earth: `#51cf66` or green-500
  - Air: `#ffd43b` or amber-500
- [ ] **Typography** clear and readable (14px minimum for body text)
- [ ] **Spacing** consistent (padding, margins match design system)

### Responsive Design

**Mobile (< 768px):**
- [ ] Dashboard grid collapses to single column
- [ ] Sacred Natal Chart scales correctly
- [ ] Big Three cards stack vertically
- [ ] Aspect cards stack vertically
- [ ] Pathway cards stack vertically
- [ ] Text remains readable (no overflow)

**Tablet (768px - 1024px):**
- [ ] 2-column grid for Big Three (2 cards, then 1)
- [ ] 2-column grid for aspects
- [ ] 2-column grid for pathways
- [ ] Chart remains centered

**Desktop (> 1024px):**
- [ ] 3-column grid for Big Three
- [ ] 2-column grid for aspects
- [ ] 2-column grid for pathways
- [ ] Maximum width container (7xl: 80rem)

### Accessibility

- [ ] **Keyboard navigation** works:
  - Tab through all interactive elements
  - Enter/Space activates buttons and links
  - Escape closes modals (if any)
- [ ] **Screen reader compatibility:**
  - Aria labels on icon buttons
  - Alt text on images/symbols
  - Semantic HTML (h1, h2, nav, section)
- [ ] **Color contrast** meets WCAG AA standards:
  - Text on backgrounds has 4.5:1 ratio minimum
  - Interactive elements have clear focus states
- [ ] **Focus indicators** visible on all interactive elements

---

## ⚡ Phase 6: Performance & Technical

### Load Performance

- [ ] **Initial page load** < 2 seconds (measured on 3G network)
- [ ] **Time to interactive** < 3 seconds
- [ ] **No layout shift** during chart animation
- [ ] **Images/SVGs optimized** (if any static assets used)

### Data Accuracy

- [ ] **Birth chart data** matches expected values:
  - Sun: Sagittarius 17.23° in House 4
  - Moon: Pisces 23.45° in House 7
  - Ascendant: Leo 28.12°
- [ ] **Archetypal facets** match sign correctly:
  - Sagittarius → "The Explorer"
  - Pisces → "The Mystic"
  - Leo → "The Sustainer"
- [ ] **Mythological references** accurate:
  - Sagittarius → Odysseus, Centaur (Chiron)
  - Pisces → Fisher King, Neptune, Lady of the Lake
  - Leo → Phoenix, Apollo, Amaterasu

### Error Handling

- [ ] **Missing birth data** shows appropriate message
- [ ] **Invalid aspect slug** redirects to 404 or shows error state
- [ ] **Failed API calls** (if any) display user-friendly error
- [ ] **Console errors:** None present in production build

### Browser Compatibility

Test on:
- [ ] **Chrome** (latest)
- [ ] **Safari** (latest)
- [ ] **Firefox** (latest)
- [ ] **Edge** (latest)
- [ ] **Mobile Safari** (iOS)
- [ ] **Mobile Chrome** (Android)

---

## 🧪 Phase 7: Edge Cases & Stress Testing

### Unusual Data Scenarios

- [ ] **No aspects** in chart (empty aspects array) → Shows message
- [ ] **Many aspects** (20+ aspects) → Grid scrolls/paginates correctly
- [ ] **Exact degree aspects** (0.0° orb) → Displays "exact"
- [ ] **Wide orb aspects** (9.0°+ orb) → Still displays correctly

### Navigation Edge Cases

- [ ] **Direct URL access** to aspect page (bookmark or shared link)
- [ ] **Back button** from aspect page returns to dashboard
- [ ] **Browser refresh** on aspect page maintains state
- [ ] **Multiple tabs** with different aspect pages open simultaneously

### Content Edge Cases

- [ ] **Very long sign names** (if custom data) → Text truncates gracefully
- [ ] **Missing archetype data** → Fallback to generic description
- [ ] **Aspect synthesis unavailable** → Shows placeholder or generates on-the-fly

---

## 📝 Testing Checklist Summary

### Quick Smoke Test (5 minutes)
1. ✅ Click Star icon → Astrology page loads
2. ✅ Big Three display correctly
3. ✅ Click aspect → Detail page loads
4. ✅ Archetypal synthesis visible
5. ✅ No console errors

### Full Regression Test (30 minutes)
- Complete all phases above
- Test on 2+ browsers
- Test on mobile + desktop
- Verify data accuracy
- Check all links/navigation

### Pre-Deployment Test (10 minutes)
- Build production version (`npm run build`)
- Test on staging environment
- Verify analytics tracking (if implemented)
- Check performance metrics
- Final visual QA

---

## 🐛 Bug Reporting Template

When issues are found, report using this format:

**Bug Title:** [Component] - Brief description

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. Observe...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
[Attach if applicable]

**Environment:**
- Browser: Chrome 120
- Device: MacBook Pro M1
- Screen size: 1440x900
- Build: Production / Development

**Severity:**
- 🔴 Critical (blocks user flow)
- 🟡 Major (degrades experience)
- 🟢 Minor (cosmetic issue)

---

## ✅ Sign-Off Checklist

Before marking astrology system as "production-ready":

- [ ] All Phase 1-7 tests pass
- [ ] Smoke test completed on staging
- [ ] Full regression test completed
- [ ] Mobile testing completed (iOS + Android)
- [ ] Accessibility audit completed (WCAG AA)
- [ ] Performance metrics meet targets
- [ ] Team review completed
- [ ] User acceptance testing (if applicable)
- [ ] Documentation updated (this file + team paper)

---

## 📚 Related Documentation

- **Archetypal Synthesis Engine:** See previous session notes (Phase 1)
- **Spiralogic Mapping System:** `/lib/astrology/spiralogicMapping.ts`
- **Archetype Library:** `/lib/astrology/archetypeLibrary.ts`
- **Sacred Natal Chart Component:** `/components/sacred-tools/astrology/SacredNatalChart.tsx`

---

**Protocol Version:** 1.0
**Last Updated:** October 12, 2025
**Maintained By:** Development Team

🌟 *Testing ensures the sacred technology serves with precision and grace.*
