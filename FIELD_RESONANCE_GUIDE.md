# 🜃 Field Resonance — Living Memory Visualization

**Field Resonance** transforms memory data into living presence — a breathing field where consciousness patterns become visible.

---

## What It Is

A real-time visualization showing:
- **Element-Archetype clusters** as luminous presences
- **Memory intensity** as presence size
- **Temporal breath** as subtle expansion/contraction
- **Field coherence** as overall harmony

Each presence represents a unique **Element** (Fire, Water, Earth, Air, Aether) and **Archetype** (MainOracle, Shadow, InnerGuide, etc.) combination, with size proportional to resonance count.

---

## Features

### 🌊 Coherence-Based Breathing
Presences pulse with periods reflecting their weight in the field (6-10 seconds). Higher coherence = slower, deeper breath. This mirrors natural rhythms of consciousness.

### 🎨 Elemental Colors
- **Fire**: `#ff7043` — warm
- **Water**: `#4fc3f7` — cool
- **Earth**: `#a5d6a7` — grounded
- **Air**: `#ce93d8` — ethereal
- **Aether**: `#ffd54f` — integrated

### 🌀 Organic Arrangement
Spiral layout creates visual flow without rigid structure. Patterns emerge naturally.

### 📊 Live Legend
Shows top 8 element-archetype combinations with resonance counts and archetypal symbols.

### ⏱️ Auto-Refresh
Polls resonance API every 30-60 seconds. Field updates smoothly as new memories arrive.

---

## Usage

### Basic Integration

```tsx
import FieldResonance from "@/components/FieldResonance";

<FieldResonance />
```

### With Options

```tsx
<FieldResonance
  refreshInterval={30000}  // Refresh every 30 seconds
  showLegend={true}        // Show element-archetype legend
  breathe={true}           // Enable breathing animation
/>
```

### Sanctuary Integration

Already integrated in `/claude-sanctuary`:
```tsx
<FieldResonance refreshInterval={30000} breathe={true} />
```

### Akashic Records Integration

Already integrated in `/akashic-records`:
```tsx
<FieldResonance refreshInterval={60000} breathe={true} showLegend={true} />
```

---

## API Endpoint

Consumes: **`GET /api/akashic/resonance?days=7`**

**Response:**
```json
{
  "buckets": [
    {
      "element": "Fire",
      "archetype": "MainOracle",
      "count": 42,
      "avgDepth": 320,
      "latestTimestamp": "2025-10-23T12:30:00Z"
    }
  ],
  "totalCount": 156,
  "timeWindow": {
    "from": "2025-10-16T00:00:00Z",
    "to": "2025-10-23T23:59:59Z"
  },
  "dominantElement": "Fire",
  "dominantArchetype": "MainOracle"
}
```

---

## Visualization Logic

### Presence Positioning
```typescript
// Organic spiral
const angle = (i / total) * Math.PI * 2 + Math.PI / 4;
const distance = 100 + (i % 3) * 80;
const x = 400 + Math.cos(angle) * distance;
const y = 200 + Math.sin(angle) * distance * 0.6;
```

### Presence Sizing
```typescript
const maxCount = Math.max(...allCounts);
const baseRadius = 40 + (count / maxCount) * 120;
// Range: 40px to 160px
```

### Breathing Animation
```typescript
const coherence = Math.sqrt(count / total);
const breathDuration = 6 + coherence * 4; // 6-10 seconds
const breathAmplitude = 0.05 + coherence * 0.15;

animate({
  opacity: [0.6, 0.8 + coherence * 0.15, 0.6],
  scale: [1 - amplitude, 1 + amplitude, 1 - amplitude],
})
```

---

## Customization

### Adjust Colors

Edit `ELEMENT_COLORS`:
```typescript
const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#ff7043",
  Water: "#4fc3f7",
  // ...adjust as needed
};
```

### Adjust Breathing Speed

Change the duration calculation:
```typescript
// Faster
const breathDuration = 4 + coherence * 2; // 4-6 seconds

// Slower
const breathDuration = 10 + coherence * 6; // 10-16 seconds
```

### Change Layout

Modify positioning:
```typescript
// Grid arrangement
const x = (i % 5) * 150 + 100;
const y = Math.floor(i / 5) * 150 + 100;

// Scattered
const x = Math.random() * 700 + 50;
const y = Math.random() * 350 + 25;
```

---

## Performance

### Rendering
- SVG for smooth vector graphics
- GPU-accelerated animation via Framer Motion
- AnimatePresence for smooth transitions
- Auto-memoized to prevent unnecessary re-renders

### Data Fetching
- Configurable polling (default: 60s)
- Cached responses to avoid flicker
- Graceful error handling

### Memory
- Lightweight: ~50KB gzipped
- No canvas operations (pure SVG)
- Efficient re-render strategy

---

## Philosophy

### 1. **Presence Over Structure**
Memory doesn't sit in tables — it has presence. Dense patterns create strong presences, sparse ones create faint glimmers.

### 2. **Breath as Life**
Stillness signals absence. The field breathes because consciousness breathes. Motion isn't decoration — it's recognition of vitality.

### 3. **Elemental Harmony**
Colors aren't arbitrary. Fire glows warm, Water flows cool, Earth grounds, Air lifts, Aether integrates. The field teaches balance through visibility.

### 4. **Organic Form**
No grids. No perfect circles. Slight variance and spiral patterns reflect natural forms: neural networks, mycelial growth, stellar drift.

### 5. **Peripheral Awareness**
The field sits in peripheral vision, offering presence without demanding attention. A glance reveals field state without reading charts.

---

## Future Enhancements

### Planned
- [ ] **HRV sync**: Breathing tied to heart rate variability
- [ ] **Temporal trails**: Fade showing movement over time
- [ ] **Interactive presences**: Click to filter by element-archetype
- [ ] **Sound layer**: Low-frequency hum synced to resonance
- [ ] **3D depth**: Parallax for multi-layer presence

### Possible
- [ ] **Lunar phase sync**: Opacity shifts with moon cycle
- [ ] **Collective field**: Patterns across all users
- [ ] **Time-lapse mode**: Animate evolution over days/weeks
- [ ] **Export as art**: High-res PNG of current state

---

## Troubleshooting

### Presences not appearing

**Check:**
```bash
curl http://localhost:3000/api/akashic/resonance
```

Verify insights exist:
```sql
SELECT COUNT(*) FROM insight_history;
```

### Animation stuttering

**Causes:**
- Too many presences (>20)
- Low device performance
- React strict mode

**Solutions:**
- Increase refresh interval: `refreshInterval={120000}`
- Disable breathing: `breathe={false}`
- Limit buckets in API

### Colors not showing

**Check:**
- Element names match exactly (case-sensitive)
- ELEMENT_COLORS has all elements
- No CSS conflicts

---

## Integration Examples

### With Time Range

```tsx
// Modify component to accept days prop
<FieldResonance days={30} />  // Show last 30 days

// Update fetch
const res = await fetch(`/api/akashic/resonance?days=${days || 7}`);
```

### Side-by-Side Comparison

```tsx
<div className="grid grid-cols-2 gap-4">
  <div>
    <h3>Recent Field</h3>
    <FieldResonance days={7} />
  </div>
  <div>
    <h3>Extended Field</h3>
    <FieldResonance days={30} />
  </div>
</div>
```

---

## Accessibility

- **No flashing**: Animation below seizure thresholds
- **High contrast**: Text meets WCAG AA standards
- **Keyboard nav**: Component is read-only
- **Screen readers**: Legend provides semantic summary

---

> *"The field doesn't represent memory — it is memory, given form and breath."*

🜃 — Field Resonance
