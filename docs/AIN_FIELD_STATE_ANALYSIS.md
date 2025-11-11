# AIN Client & Field State Data Analysis
## Complete Understanding for Analytics Integration

---

## Overview

The AIN (Adaptive Intelligence Network) client provides sophisticated field state metrics that track consciousness, coherence, and collective field dynamics. These metrics can be integrated into the Analytics page as opt-in, non-judgmental measurements.

---

## 1. FIELD STATE METRICS (Core AIN Interface)

### Location
`/Users/soullab/MAIA-FRESH/apps/web/lib/ain/AINClient.ts`

### FieldState Interface
```typescript
export interface FieldState {
  coherence: number;              // 0-1: Overall field coherence
  complexity: number;             // 0-1: Unique users and engagement
  resonance: number;              // 0-1: Consciousness × Coherence
  evolution: number;              // 0-1: Rate of change (velocity)
  healing: number;                // 0-1: Integration + Shadow work + Coherence
  breakthroughPotential: number;  // 0-1: Evolution × Coherence
  integrationNeed: number;        // 0-1: How much integration support needed
  timestamp: Date;                // When measured
}
```

### Key Characteristics
- **Coherence**: Measures stability of consciousness level across recent entries (lower variance = higher coherence)
- **Complexity**: Based on unique users and their average consciousness level
- **Resonance**: The "harmonic alignment" - how consciousness maps to coherence
- **Evolution**: Average evolution velocity from recent streams
- **Healing**: Composite of shadow work engagement, integration depth, and coherence
- **Breakthrough Potential**: Likelihood of significant shift (high evolution + high coherence)
- **Integration Need**: Flags when rapid evolution outpaces integration (emotional processing needed)

### Calculation Method
```typescript
// Example from AINClient
const consciousnessVariance = this.calculateVariance(
  recentStreams.map(s => s.consciousnessLevel)
);
const coherence = Math.max(0, 1 - Math.sqrt(consciousnessVariance));
```

---

## 2. AFFERENT STREAM DATA (Individual Session Metrics)

### Location
`/Users/soullab/MAIA-FRESH/apps/web/lib/ain/AfferentStreamGenerator.ts`

### AfferentStream Interface
```typescript
export interface AfferentStream {
  // Session identification
  userId: string;
  timestamp: Date;
  sessionId: string;

  // Consciousness metrics (0-1)
  consciousnessLevel: number;      // Awareness depth in session
  evolutionVelocity: number;        // Rate of transformation
  integrationDepth: number;         // How grounded/embodied
  authenticityLevel: number;        // Genuineness of expression

  // Elemental composition
  elementalResonance: {
    fire: number;    // Creative/passionate energy
    water: number;   // Emotional/flow states
    earth: number;   // Grounding/stability
    air: number;     // Mental/communication
    aether: number;  // Spiritual/transcendent
  };

  // Archetypal activation
  archetypeActivation: Record<string, number>;  // Active archetypes this session
  shadowWorkEngagement: string[];                // Shadow themes engaged with

  // Journey tracking
  spiralPhase: string;              // Which phase: exploration/revelation/processing/integration/activation
  worldviewFlexibility: number;     // 0-1: How open to new perspectives
  challengeAcceptance: number;      // 0-1: Willingness to face edges
  mayaResonance: number;            // 0-1: Connection to system
  fieldContribution: number;        // 0-1: How much this session contributes to collective
}
```

### Calculation Details
- **Consciousness Level**: Increases with symbols (0.05 each), archetypes (0.08 each), shadow modes (+0.15), entry depth (0.2 max)
- **Evolution Velocity**: Directly from transformation score (how much shift the user reports)
- **Integration Depth**: Based on word count, previous consciousness trends, and closing language
- **Authenticity**: Increases with vulnerable emotions (grief, fear, shame), shadow modes, and depth
- **Elemental Resonance**: Calculated from mode (e.g., shadow = high fire/water) + symbol mapping
- **Field Contribution**: (consciousness × 0.3) + (integration × 0.2) + (substantiality bonus)

---

## 3. BIOMETRIC COHERENCE (HRV-Based)

### Location
`/Users/soullab/MAIA-FRESH/lib/biometrics/CoherenceDetector.ts`

### CoherenceState Interface
```typescript
export interface CoherenceState {
  level: 'low' | 'medium' | 'high' | 'peak';
  score: number;                    // 0-100 normalized
  trend: 'rising' | 'stable' | 'falling';
  suggestedPresenceState: PresenceState;  // dialogue/patient/scribe
  confidence: number;               // 0-1 (certainty of assessment)
}
```

### HRV Mapping
```
< 25ms    → Low (stressed, fatigued)
25-45ms   → Medium (normal daily)
45-65ms   → High (relaxed, recovered)
> 65ms    → Peak (meditative, athletic recovery)
```

### Coherence Scoring
- **HRV Ranges**: Maps raw HRV to 0-100 scale
- **Stability Bonus**: Adds up to 5 points for low variance (consistent HRV)
- **Trend Detection**: Compares recent half vs. older half of readings
- **Confidence Building**: More data = higher confidence (max at 10+ readings)

### Presence State Mapping
- **Dialogue**: Low coherence OR falling trend → gentle, grounding conversation
- **Patient**: Medium coherence + rising → depth work, safe edge exploration
- **Scribe**: High/peak coherence + stable → witnessing, subtle presence

---

## 4. COLLECTIVE FIELD STATE (Community Level)

### Location
`/Users/soullab/MAIA-FRESH/lib/community/field-state-calculator.ts`

### Community Field Metrics
```typescript
// Stored in community_field_state table
{
  channel_id: string;
  earth_energy: number;     // 0-1: Grounding
  water_energy: number;     // 0-1: Emotional flow
  air_energy: number;       // 0-1: Mental dialogue
  fire_energy: number;      // 0-1: Creative activation
  active_users_count: number;
  messages_per_hour: number;
  avg_message_length: number;
  intensity_level: number;  // 0-1: Message volume/frequency
  depth_level: number;      // 0-1: Message length (500+ chars = deep)
  coherence_level: number;  // 0-1: Reply ratio (3+ replies per thread = coherent)
  calculated_at: Date;
}
```

### Calculation Rules
- **Intensity**: `min(1, messages_per_hour / 10)` - maxes at 10+ msgs/hr
- **Depth**: `min(1, avg_message_length / 500)` - maxes at 500+ char average
- **Coherence**: `min(1, reply_count / (thread_count * 3))` - 3+ replies/thread = high coherence
- **Elemental**: Aggregates from session_elements of shared posts, normalized to sum = 1

---

## 5. DEEP COHERENCE ANALYSIS (Stub Implementation)

### Location
`/Users/soullab/MAIA-FRESH/apps/api/backend/src/ain/analyzers/DeepCoherenceAnalyzer.ts`

### CoherenceAnalysisResult
```typescript
{
  score: number;                    // 0-1: Overall coherence
  dimensions: { [key: string]: number };  // Coherence per dimension
  interferences: string[];          // What's blocking coherence
}
```

**Note**: Currently a placeholder - ready for deeper analysis implementation.

---

## 6. CURRENT ANALYTICS PAGE

### Location
`/Users/soullab/MAIA-FRESH/apps/web/components/maia/Analytics.tsx`

### Current Metrics (Non-Judgmental)
- Total entries
- Total words
- Voice entries vs text
- Average words per entry
- Top symbols (with frequencies)
- Top archetypes
- Emotional landscape (tone distribution)
- Mode breakdown (with percentages)

**All current metrics are neutral and descriptive**, not evaluative.

---

## 7. INTEGRATION RECOMMENDATIONS

### Which Metrics Are Safe for Analytics Page

**✅ EXCELLENT FIT** (Directly add these):
1. **Coherence Score** (0-100) - Shows "alignment of patterns"
   - Safe framing: "Pattern consistency over time"
   - Visual: Trend line showing rise/fall/stable
   
2. **Consciousness Level** (0-100) - Shows "depth engagement"
   - Safe framing: "Engagement depth in entries"
   - Visual: Histogram showing distribution
   
3. **Evolution Velocity** (0-100) - Shows "transformation rate"
   - Safe framing: "Rate of change across entries"
   - Visual: Sparkline or trend indicator
   
4. **Integration Depth** (0-100) - Shows "embodiment progress"
   - Safe framing: "How grounded are your insights"
   - Visual: Progress bar
   
5. **Field Contribution** (0-100) - Shows "collective value"
   - Safe framing: "How much your work contributes to the field"
   - Visual: Ring/circular metric

**✅ CONDITIONAL** (Good with context):
6. **Shadow Work Engagement** (count) - Shows "shadow exploration"
   - Safe framing: "Number of shadow work sessions engaged"
   - Only show if they've done shadow work
   
7. **Elemental Resonance** (5 numbers, 0-1 each) - Shows "elemental balance"
   - Safe framing: "Average elemental composition of your work"
   - Visual: Radar chart or horizontal bar breakdown

8. **Breakthrough Potential** (0-100) - Shows "readiness for insight"
   - Safe framing: "Potential for significant shifts"
   - Only present if high evolution + coherence both active

**❌ AVOID** (Too judgmental without context):
- Healing score (implies they need fixing)
- Integration need (implies deficit)
- Authenticity level (implies some are "fake")

---

## 8. RECOMMENDED OPT-IN STRUCTURE

### Analytics Settings Section
```
[Settings] → [Analytics Preferences]

□ Show Coherence Metrics
  └─ Displays pattern consistency and trend data
  
□ Show Consciousness Metrics  
  └─ Displays engagement depth measurements
  
□ Show Evolution Velocity
  └─ Displays rate of transformation
  
□ Show Elemental Resonance
  └─ Displays fire/water/earth/air/aether composition
  
□ Show Field Contribution
  └─ Displays impact on collective field
```

### Default: Show all (users can disable)

### Presentation Format

**Non-Judgmental Phrasing**:
```
"Pattern Consistency: 74%"   ← Neutral
"Insight Readiness: 82%"     ← Empowering
"Elemental Balance"          ← Descriptive

NOT:
"You are 74% coherent"       ← Judgmental
"Your healing is 45%"        ← Deficit language
"Authenticity Score: 68%"    ← Evaluative
```

---

## 9. DATA FLOW DIAGRAM

```
User Creates Journal Entry
    ↓
AfferentStreamGenerator analyzes:
  - Consciousness level
  - Evolution velocity
  - Integration depth
  - Authenticity
  - Elemental resonance
  - Shadow work engagement
    ↓
AINClient.getFieldState():
  - Aggregates last 20 streams
  - Calculates coherence, complexity, resonance, healing
  - Determines breakthrough potential, integration need
    ↓
CoherenceDetector (if HRV data):
  - Maps HRV to coherence state
  - Suggests presence state
    ↓
FieldStateCalculator (community):
  - Aggregates channel-wide metrics
  - Calculates elemental balance, intensity, depth
    ↓
Analytics Page renders:
  - Current metrics (entries, words, symbols, archetypes)
  - + Optional: Coherence, consciousness, evolution, etc.
  - All opt-in, neutral language
```

---

## 10. CODE EXAMPLES FOR INTEGRATION

### Getting Field State in Analytics
```typescript
import { ainClient } from '@/lib/ain/AINClient';

const fieldState = await ainClient.getFieldState();

const coherencePercent = Math.round(fieldState.coherence * 100);
const evolutionPercent = Math.round(fieldState.evolution * 100);
const breakthroughPercent = Math.round(fieldState.breakthroughPotential * 100);
```

### Getting User's Afferent Streams
```typescript
import { ainClient } from '@/lib/ain/AINClient';

const streams = ainClient.getUserStreams(userId, 20);

const avgConsciousness = streams.reduce((sum, s) => sum + s.consciousnessLevel, 0) / streams.length;
const avgEvolution = streams.reduce((sum, s) => sum + s.evolutionVelocity, 0) / streams.length;
const avgIntegration = streams.reduce((sum, s) => sum + s.integrationDepth, 0) / streams.length;

const elementalTotal = streams.reduce((sum, s) => sum + s.fieldContribution, 0) / streams.length;
```

### Getting Biometric Coherence
```typescript
import { useBiometricCoherence, getCoherenceStatus, getCoherenceColor } from '@/hooks/useBiometricCoherence';

const { coherenceLevel, coherenceTrend, readinessScore } = useBiometricCoherence();

const status = getCoherenceStatus(coherenceLevel);  // "Optimal", "High", "Balanced", etc.
const color = getCoherenceColor(coherenceLevel);    // CSS color
```

---

## 11. KEY PRINCIPLES FOR INTEGRATION

1. **Opt-In Always**: Let users choose what metrics to see
2. **Neutral Language**: "Consistency", "Engagement", "Rate" not "Good", "Better", "Successful"
3. **Contextual Display**: Only show metrics where there's data
4. **Trend Over Absolute**: Focus on direction (rising/stable/falling) not final scores
5. **Collective Not Individual**: Position field metrics as "system state" not "your score"
6. **Non-Therapeutic**: These are observational metrics, not diagnostic
7. **Empowering Not Prescriptive**: Show what is, not what should be

---

## 12. EXAMPLE ANALYTICS DASHBOARD ADDITIONS

### New Section: "Field Metrics" (Optional)

```
[Analytics]

Journey Overview (existing)
├─ Total Entries
├─ Total Words
├─ Voice Entries
└─ Avg Words Per Entry

Symbolic Journey (existing)
├─ Top Symbols
├─ Top Archetypes
└─ Emotional Landscape

[NEW] Field Metrics (opt-in)
├─ Pattern Consistency (coherence trend chart)
├─ Engagement Depth (consciousness histogram)
├─ Transformation Rate (evolution sparkline)
├─ Elemental Composition (radar chart)
└─ Field Contribution (ring metric)
```

### Optional: Biometric Integration

```
[NEW] Coherence Tracking (if Apple Health connected)
├─ Current Coherence State (low/medium/high/peak)
├─ HRV Trend (rising/stable/falling)
├─ 30-Day Coherence Trend (line chart)
└─ Readiness for Presence State (suggested dialogue/patient/scribe)
```

---

## Summary

The AIN system provides **rich, non-judgmental measurement** of consciousness, coherence, and field state. These metrics can be seamlessly integrated into the Analytics page as **opt-in features** with **neutral language** that emphasizes observation over evaluation. The framework is already in place; integration requires:

1. Adding UI toggles for metric preferences
2. Querying `ainClient.getFieldState()` and user streams
3. Rendering with non-evaluative language
4. Providing context (trend > absolute value)

All metrics are designed to be **informative without being directive** or **judgmental**.
