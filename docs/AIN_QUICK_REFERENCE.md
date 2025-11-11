# AIN Field State - Quick Reference for Analytics Integration

## The Big Picture

```
                    FIELD STATE METRICS
                    (AIN Orchestrator)
                            ↑
                     ┌──────┴──────┐
                     ↓             ↓
            AFFERENT STREAMS    BIOMETRIC DATA
            (per session)       (HRV from Apple Health)
                     │                     │
                     └──────┬──────────────┘
                            ↓
                   ANALYTICS PAGE
                   (visualizations)
```

## The 5 Core Metrics to Add (All Safe & Non-Judgmental)

| Metric | Range | Current Name | Safe Label | Visual |
|--------|-------|--------------|-----------|--------|
| **coherence** | 0-1 | — | Pattern Consistency | Trend line |
| **consciousnessLevel** | 0-1 | — | Engagement Depth | Histogram |
| **evolutionVelocity** | 0-1 | — | Transformation Rate | Sparkline |
| **integrationDepth** | 0-1 | — | Embodiment Progress | Progress bar |
| **fieldContribution** | 0-1 | — | Collective Value | Ring metric |

## Where Field State Comes From

### AINClient calculates field state from:
- Last 20 journal entries (AfferentStreams)
- Consciousness levels → variance → coherence
- Evolution velocity → rate of change
- Integration depth → how grounded

### AfferentStream tracks per entry:
```
consciousnessLevel   (symbols + archetypes + depth)
evolutionVelocity    (transformation score)
integrationDepth     (wordcount + grounding)
elementalResonance   (fire/water/earth/air/aether)
shadowWorkEngagement (which shadow themes explored)
fieldContribution    (how much benefits collective)
```

### Optional: Biometric Coherence
- From Apple Health HRV data
- Maps to coherence state (low/medium/high/peak)
- Suggests presence mode (dialogue/patient/scribe)

## Integration Checklist

- [ ] Import `ainClient` from `/lib/ain/AINClient`
- [ ] Call `getFieldState()` in Analytics component
- [ ] Call `getUserStreams(userId)` for detailed metrics
- [ ] Add opt-in toggles to Analytics settings
- [ ] Use neutral language ("Pattern", not "Score")
- [ ] Show trends > absolute values
- [ ] Add context (why this matters)

## Safe Metrics for Analytics

```
✅ coherence              → "Pattern Consistency"
✅ consciousness          → "Engagement Depth"
✅ evolution              → "Transformation Rate"
✅ integrationDepth       → "Embodiment Progress"
✅ fieldContribution      → "Collective Value"
✅ elementalResonance     → "Elemental Balance"
✅ shadowWorkEngagement   → "Shadow Exploration"

⚠️ breakthroughPotential  → Only if both metrics high
⚠️ biometricCoherence     → Only if data available

❌ healing               → Too deficit-oriented
❌ integrationNeed       → Implies lacking
❌ authenticity          → Too evaluative
```

## File Locations

| File | Purpose |
|------|---------|
| `/apps/web/lib/ain/AINClient.ts` | Main interface - `getFieldState()` |
| `/apps/web/lib/ain/AfferentStreamGenerator.ts` | Calculates per-session metrics |
| `/lib/biometrics/CoherenceDetector.ts` | HRV → coherence state |
| `/lib/community/field-state-calculator.ts` | Collective field metrics |
| `/apps/web/components/maia/Analytics.tsx` | Current Analytics page |

## Code Snippets

### Get current field state
```ts
const fieldState = await ainClient.getFieldState();
const coherence = Math.round(fieldState.coherence * 100);
const evolution = Math.round(fieldState.evolution * 100);
```

### Get historical metrics
```ts
const streams = ainClient.getUserStreams(userId, 20);
const avgConsciousness = streams.reduce((s, x) => s + x.consciousnessLevel, 0) / streams.length;
const elementalBalance = streams[0]?.elementalResonance;
```

### Get HRV-based coherence
```ts
const { coherenceLevel, coherenceTrend } = useBiometricCoherence();
const status = getCoherenceStatus(coherenceLevel); // "High", "Optimal", etc
```

## Presentation Tips

❌ Bad: "Your coherence is 74%"
✅ Good: "Pattern Consistency: 74% (stable)"

❌ Bad: "You need more integration"
✅ Good: "Transformation Rate: High (integration time recommended)"

❌ Bad: "Authenticity Score: 68%"
✅ Good: "Elemental Balance: Fire 35%, Water 28%, Earth 22%, Air 10%, Aether 5%"

---

**Remember**: These metrics observe consciousness patterns, they don't judge the person.
All are opt-in. Neutral language. Trend-focused.
