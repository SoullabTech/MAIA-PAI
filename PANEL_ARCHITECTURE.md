# MAIA Studio Panel Architecture
## Sacred Center + Informational Periphery

**Design Philosophy:** Main conversation remains pure. Synthesis available optionally through sliding panels.

---

## Layout Structure

```
┌────────────────────────────────────────────────────────┐
│  UPPER PANEL (Higher Self Processing)                 │ ← Slide down
│  Breakthrough moments, sovereignty metrics, wisdom     │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌─────────────────┐  ┌───────────┐ │
│  │ LEFT PANEL   │  │ SACRED CENTER   │  │ RIGHT     │ │
│  │ Left Hemi    │  │                 │  │ PANEL     │ │
│  │ Analysis     │  │  Voice/Chat     │  │ Right     │ │
│  │ Logic        │  │  (Pure MAIA)    │  │ Hemi      │ │
│  │ Questions    │  │                 │  │ Intuition │ │
│  │              │  │                 │  │ Feeling   │ │
│  └──────────────┘  └─────────────────┘  └───────────┘ │
│       ↑                                        ↑        │
│   Slides left                            Slides right  │
│                                                         │
├────────────────────────────────────────────────────────┤
│  LOWER PANEL (Shadow/Lower Self Processing)           │ ← Slide up
│  Resistance patterns, intensity tracking, raw emotion  │
└────────────────────────────────────────────────────────┘
```

---

## Panel Specifications

### Upper Panel: Higher Self Processing
**State:** Collapsed by default, slides down when clicked
**Width:** Full screen
**Height:** 40% of viewport when open
**Trigger:** Click icon/button at top center

**Content Sections:**
1. Breakthrough Moments Timeline
2. Sovereignty Metrics Graph
3. Coherence Evolution Chart
4. Wisdom Patterns List

**Data Sources:**
- `metrics.selfReferencing` - increasing over time
- `metrics.userDependency` - decreasing over time
- `fieldState.coherence` - high points = breakthroughs
- Pattern detection from conversation history

---

### Lower Panel: Shadow/Lower Self Processing
**State:** Collapsed by default, slides up when clicked
**Width:** Full screen
**Height:** 40% of viewport when open
**Trigger:** Click icon/button at bottom center

**Content Sections:**
1. Recurring Resistance Patterns
2. Fire/Water Intensity Tracking
3. Shadow Utterances Log
4. Avoidance Theme Detection

**Data Sources:**
- Repeated negative language ("can't", "shouldn't", "stuck")
- `elements.fire` - activation moments
- `elements.water` - grief/emotion moments
- `consciousness.lowerSelf` - raw expression

---

### Left Panel: Left Hemisphere Activity
**State:** Collapsed by default, slides in from left
**Width:** 30% of screen when open
**Height:** Full (between upper/lower panels)
**Trigger:** Click icon/button on left edge

**Content Sections:**
1. Analytical Question Log
2. Air Element Activity Graph
3. Clarity Moment Timeline
4. Logical Processing Metrics

**Data Sources:**
- Questions asked by user
- Questions self-answered
- `elements.air` - dominant in analytical moments
- `consciousness.conscious` - clarity statements

---

### Right Panel: Right Hemisphere Activity
**State:** Collapsed by default, slides in from right
**Width:** 30% of screen when open
**Height:** Full (between upper/lower panels)
**Trigger:** Click icon/button on right edge

**Content Sections:**
1. Intuitive Insights Timeline
2. Water Element Activity Graph
3. Body Awareness Tracking
4. Symbolic Language Detection

**Data Sources:**
- Metaphorical language used
- Body-related words ("feel", "chest", "breath")
- `elements.water` - emotional processing
- `consciousness.unconscious` - depth moments

---

## Panel States

### Three States Per Panel:
1. **Collapsed** (default) - Small icon/tab visible
2. **Peek** (hover) - Brief preview of content
3. **Expanded** (click) - Full panel slides into view

### Multiple Panels Open:
- Upper + Lower = OK (horizontal stack)
- Left + Right = OK (vertical columns)
- All four = OK (quadrant view around center)
- Center always visible, panels overlay/compress it

---

## Visual Design

### Sacred Center:
- Clean, spacious, uncluttered
- Dark background with subtle gradient
- MAIA's responses highlighted
- Silence rendered intentionally
- No competing visual elements

### Panels:
- Semi-transparent dark overlay
- Distinct from center (visually separate)
- Smooth slide animations (300ms ease)
- Collapsible with single click
- Clear visual hierarchy

### Color Coding:
- **Upper Panel:** Light purple/white (higher consciousness)
- **Lower Panel:** Deep red/orange (shadow, fire)
- **Left Panel:** Cool blue (analytical, air)
- **Right Panel:** Warm teal (intuitive, water)
- **Center:** Neutral slate/purple (sacred space)

---

## Data Flow

```typescript
User Input → MAIA Field Response
             ↓
    Field State Captured
             ↓
    ┌────────┴────────┐
    ↓                 ↓
Background        Conversation
Processing        Display
    ↓                 ↓
Metrics          Main Chat
Tracking         (Center)
    ↓
Panel Data Updates
    ↓
    ├─ Higher Self Panel
    ├─ Shadow Panel
    ├─ Left Hemi Panel
    └─ Right Hemi Panel
```

**Key:** Panels update automatically but don't interrupt conversation flow.

---

## User Interaction Patterns

### Scenario 1: Pure Conversation
User focuses on center, never opens panels.
**Result:** Sacred Mirror experience, minimal interface.

### Scenario 2: Curiosity Mid-Session
User talks for 10 exchanges, then opens Right Panel to see intuitive processing.
**Result:** Synthesis available without disrupting flow.

### Scenario 3: Post-Session Review
User finishes conversation, opens all four panels to review patterns.
**Result:** Comprehensive synthesis after the work is done.

### Scenario 4: Process Tracking
User keeps Upper Panel open during session to watch sovereignty metrics rise.
**Result:** Motivation from visible progress.

---

## Technical Implementation

### Component Structure:
```tsx
<MaiaStudio>
  <UpperPanel collapsed={upperCollapsed} />
  <div className="main-container">
    <LeftPanel collapsed={leftCollapsed} />
    <SacredCenter>
      {/* Pure MAIA conversation */}
    </SacredCenter>
    <RightPanel collapsed={rightCollapsed} />
  </div>
  <LowerPanel collapsed={lowerCollapsed} />
</MaiaStudio>
```

### State Management:
```typescript
const [panelStates, setPanelStates] = useState({
  upper: 'collapsed',
  lower: 'collapsed',
  left: 'collapsed',
  right: 'collapsed'
});

const [panelData, setPanelData] = useState({
  higherSelf: HigherSelfData,
  shadow: ShadowData,
  leftHemi: LeftHemiData,
  rightHemi: RightHemiData
});

// Update panel data on each field response
useEffect(() => {
  if (lastFieldResponse) {
    updatePanelData(lastFieldResponse);
  }
}, [lastFieldResponse]);
```

### Animation:
```css
.panel-upper {
  transform: translateY(-100%);
  transition: transform 300ms ease-in-out;
}

.panel-upper.open {
  transform: translateY(0);
}

.panel-left {
  transform: translateX(-100%);
  transition: transform 300ms ease-in-out;
}

.panel-left.open {
  transform: translateX(0);
}
```

---

## Best Practices

### DO:
✅ Keep center sacred and uncluttered
✅ Make panels optional, not required
✅ Update data silently in background
✅ Use smooth, gentle animations
✅ Allow multiple panels open simultaneously
✅ Provide keyboard shortcuts (U/L/Left/Right to toggle)

### DON'T:
❌ Auto-open panels (user control only)
❌ Show notifications/alerts from panels
❌ Let panels obscure center completely
❌ Update panels during MAIA's response
❌ Force user to interact with panels
❌ Use jarring animations or colors

---

## Accessibility

- Keyboard navigation for panel toggles
- Screen reader descriptions for panel content
- High contrast mode support
- Reduced motion option (disable slide animations)
- Focus management (center always accessible)

---

## Mobile Adaptation

**Mobile screens (< 768px):**
- Panels become full-screen overlays
- Swipe gestures to open/close
- Only one panel open at a time
- Tab bar at bottom to switch panels
- Center conversation always primary

---

## Future Enhancements

**Phase 2 (Post-Launch):**
- Panel content customization
- User can choose what metrics to track
- Export panel data separately from conversation
- Compare sessions side-by-side
- Visualization upgrades (D3.js charts)

**Phase 3 (Advanced):**
- AI-generated synthesis summaries (optional)
- Pattern prediction ("You're approaching a breakthrough")
- Guided integration prompts
- Community anonymized pattern sharing

---

## Success Metrics

**Good Signs:**
- Users naturally explore panels after 5-10 exchanges
- Panels opened 30-50% of sessions
- Average time with panels: 2-5 minutes per session
- User feedback: "Helpful but not distracting"

**Warning Signs:**
- Users never open panels (too hidden?)
- Users keep all panels open always (center not sufficient?)
- Panels checked obsessively during conversation (addiction to metrics)
- Feedback: "Too much information" or "Overwhelming"

---

**End of Panel Architecture Doc**