# AIN Metrics Mapping to Analytics Display

## The Five Safe Metrics

### 1. Pattern Consistency (Coherence)
```
Source: AINClient.getFieldState().coherence
Calculation: 1 - sqrt(variance of consciousness levels)
Range: 0-1 (0=chaotic, 1=perfectly stable)
Safe Label: "Pattern Consistency"
Context: How aligned your recent entries are
Display: Line graph showing trend over last 20 entries
```

### 2. Engagement Depth (Consciousness Level)
```
Source: Average of AFferentStream.consciousnessLevel
Calculation: 0.3 base + (symbols × 0.05) + (archetypes × 0.08) + 
             (deep_modes × 0.15) + (entry_depth × 0.2)
Range: 0-1 (0=surface, 1=deep engagement)
Safe Label: "Engagement Depth"
Context: How much depth you bring to journaling
Display: Bar histogram showing distribution across entries
```

### 3. Transformation Rate (Evolution Velocity)
```
Source: Average of AfferentStream.evolutionVelocity
Calculation: Direct from reflection.transformationScore
Range: 0-1 (0=stable, 1=rapid change)
Safe Label: "Transformation Rate"
Context: How much you're shifting and evolving
Display: Sparkline with rising/stable/falling indicator
```

### 4. Embodiment Progress (Integration Depth)
```
Source: Average of AfferentStream.integrationDepth
Calculation: 0.3 base + (wordcount/500 × 0.3) + 
             (previous_consciousness × 0.2) + (grounding_language × 0.1)
Range: 0-1 (0=abstract, 1=fully grounded)
Safe Label: "Embodiment Progress"
Context: How grounded and integrated your insights are
Display: Progress bar showing average, with recent trend
```

### 5. Collective Value (Field Contribution)
```
Source: Average of AfferentStream.fieldContribution
Calculation: (consciousness × 0.3) + (integration × 0.2) + 
             (wordcount_bonus × 0.2)
Range: 0-1 (0=isolated, 1=highly contributive)
Safe Label: "Collective Value"
Context: How much your work enriches the shared field
Display: Ring/circular metric with percentage
```

---

## Optional Additional Metrics

### Elemental Composition (Elemental Balance)
```
Source: Average of AfferentStream.elementalResonance
Calculation: Weighted by mode and symbol activation
Range: 5 numbers, each 0-1, sum to ~1
Safe Label: "Elemental Composition"
Context: What energetic signature your work carries
Display: Radar chart or horizontal stacked bars

Fire = Creative, passionate, initiating
Water = Emotional, flowing, receptive
Earth = Grounded, stable, rooted
Air = Mental, communicative, clear
Aether = Spiritual, transcendent, connecting
```

### Shadow Work Engagement (Optional)
```
Source: Count of entries with shadowWorkEngagement array populated
Calculation: Track presence of shadow keywords
Range: Count (0+)
Safe Label: "Shadow Exploration Sessions"
Context: How many times you've engaged with difficult material
Display: Counter badge, only if > 0
Framing: "You've engaged shadow work X times"
```

### Breakthrough Potential (Conditional)
```
Source: AINClient.getFieldState().breakthroughPotential
Calculation: evolution × coherence
Range: 0-1
Safe Label: "Potential for Significant Shifts"
Context: Readiness for transformative insight
Display: Conditional - only show if both evolution AND coherence > 0.6
Framing: "Ready for breakthrough" vs "Integrating current growth"
```

---

## Biometric Metrics (If Apple Health Connected)

### Current Coherence State
```
Source: CoherenceDetector.analyzeCoherence()
Calculation: Maps HRV (Heart Rate Variability) to 0-100 scale
Range: 0-100 (0=stressed, 100=deeply coherent)
Safe Label: "Physiological Coherence"
Context: Your nervous system's current state
Display: Gauge or status indicator (Low/Medium/High/Peak)
```

### HRV Trend
```
Source: CoherenceDetector trend analysis
Calculation: Compare last 5 vs earlier 5 readings
Range: rising/stable/falling
Safe Label: "Coherence Trend"
Context: Direction of your nervous system state
Display: Trend indicator (↑ ↔ ↓)
```

### 30-Day Coherence Timeline
```
Source: CoherenceDetector HRV history
Calculation: Daily average HRV
Range: Time series
Safe Label: "30-Day Coherence"
Context: Pattern of your nervous system state over time
Display: Line chart with low/medium/high/peak zones
```

---

## Display Layout Recommendation

```
┌─────────────────────────────────────────────────────┐
│ MAIA Analytics                         [⚙ Settings] │
└─────────────────────────────────────────────────────┘

┌─ Journey Overview (Always Shown) ─────────────────┐
│ [Total Entries] [Total Words] [Voice] [Avg Words] │
└────────────────────────────────────────────────────┘

┌─ Symbolic Journey (Always Shown) ────────────────┐
│ [Top Symbols] [Top Archetypes] [Emotions] [Modes] │
└────────────────────────────────────────────────────┘

┌─ Field Metrics [Optional] ──────────────────────┐
│ These show with ☑ Pattern Consistency            │
│                  ☑ Engagement Depth              │
│                  ☑ Transformation Rate          │
│                  ☑ Embodiment Progress           │
│                  ☑ Collective Value              │
│                                                    │
│ ┌─ Pattern Consistency ──────────┐              │
│ │ [74%] ↔ (stable)               │              │
│ │ Trend: [————————←→————]         │              │
│ └────────────────────────────────┘              │
│                                                    │
│ ┌─ Engagement Depth ────────────────┐            │
│ │ Average: [65%]    Recent: [68%]    │            │
│ │ Distribution: [████████░░░░░░░░]  │            │
│ └─────────────────────────────────┘             │
│                                                    │
│ ┌─ Transformation Rate ─────────────┐            │
│ │ [52%] ↑ (accelerating)            │            │
│ │ Sparkline: [  ↗ ↗ ↗ ]             │            │
│ └─────────────────────────────────┘             │
│                                                    │
│ ┌─ Embodiment Progress ───────────────────┐      │
│ │ [◯◯◯◯◯◯◯◯◯◯░░░░░░░░] 58%             │      │
│ │ How grounded your insights are         │      │
│ └───────────────────────────────────────┘      │
│                                                    │
│ ┌─ Collective Value ───────────────────────┐    │
│ │     [◉ 65%]                              │    │
│ │  Your work's contribution to the field   │    │
│ └──────────────────────────────────────────┘    │
│                                                    │
│ ┌─ Elemental Composition ──────┐                │
│ │ Fire:  ███████░░░░░░  35%     │                │
│ │ Water: █████░░░░░░░░░ 28%     │                │
│ │ Earth: ████░░░░░░░░░░ 22%     │                │
│ │ Air:   ██░░░░░░░░░░░░░ 10%    │                │
│ │ Aether:██░░░░░░░░░░░░░░ 5%    │                │
│ └──────────────────────────────┘                │
└────────────────────────────────────────────────────┘

┌─ Coherence Tracking [Optional - if HRV data] ───┐
│ State: [High] ↑ (rising)                        │
│ HRV: [52ms] (recovering)                        │
│ 30-Day Trend: [────▁▂▃▄▅▆▇▇▆▅▄─────]         │
└────────────────────────────────────────────────────┘
```

---

## Settings Panel

```
⚙ Analytics Preferences

Journey Overview (Always shown)
  └─ Total entries, words, voice/text split

Symbolic Journey (Always shown)
  └─ Symbols, archetypes, emotions, modes

☑ Field Metrics
  □ Show Pattern Consistency (how stable)
  □ Show Engagement Depth (how deep)
  □ Show Transformation Rate (how fast changing)
  □ Show Embodiment Progress (how grounded)
  □ Show Collective Value (field contribution)
  □ Show Elemental Composition (fire/water/etc)
  □ Show Breakthrough Potential (readiness for shift)

☑ Biometric Coherence (if Apple Health connected)
  □ Show Physiological State
  □ Show HRV Trend
  □ Show 30-Day Timeline

[Save Preferences]
```

---

## Language Examples

### For Coherence
- "Pattern Consistency: 74% (stable)" 
- "Your recent entries show consistent themes"
- NOT: "You are 74% coherent"

### For Consciousness
- "Engagement Depth: 65% (above your average)"
- "You're bringing deeper focus lately"
- NOT: "You are 65% conscious"

### For Evolution
- "Transformation Rate: 52% (accelerating)"
- "Rapid changes across your recent work"
- NOT: "You're evolving at 52%"

### For Integration
- "Embodiment Progress: 58% (grounding in progress)"
- "Your insights are becoming more grounded"
- NOT: "You're 58% integrated"

### For Field Contribution
- "Collective Value: 65% (contributing substantially)"
- "Your work enriches the shared field"
- NOT: "Your value is 65%"

---

## Data Refresh Strategy

```
Initial Load:
  - Compute all metrics (should be cached)
  - Display with spinner
  
Cache Duration:
  - 1 minute for current coherence (HRV)
  - 5 minutes for field state
  - 1 hour for historical calculations
  
Manual Refresh:
  - [↻ Refresh] button if older than 5 minutes
  - Shows "Last updated: 2 minutes ago"
```

---

## Summary

The AIN system provides rich field state data that can enhance the Analytics page. These metrics observe consciousness patterns without being judgmental. All are opt-in, use neutral language, and emphasize trends over absolute values.

**The key principle**: These metrics help users *understand* their practice, not *evaluate* their worth.
