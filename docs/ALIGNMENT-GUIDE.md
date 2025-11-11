# Alignment Intelligence for Soullab

## The Right Frame

**What Soullab Does**: Help members become more authentically themselves
**Not**: Programs, tests, graduation

**The Anti-Moloch Question**: Are we serving authentic becoming, or creating dependency?

---

## Three Simple Metrics

### 1. Authentic Becoming (`lib/alignment/authentic-becoming-metrics.ts`)

**What it measures:**
- **Autonomy**: Are members developing their own voice/authority?
- **Integration**: Are insights moving into real life?
- **Relational health**: Mirror vs crutch?
- **Depth**: Going deeper or staying surface?

**Key indicators:**
```typescript
{
  autonomy: {
    selfGeneratedInsightRate: 0.65,  // Bringing own insights vs waiting
    engagementStyle: 'collaborative', // passive | receptive | collaborative | sovereign
    decisionSovereignty: 0.71        // Making own choices vs seeking validation
  },

  relationalHealth: {
    engagementPattern: 'healthy_rhythm', // vs 'dependency' | 'avoidance' | 'crisis_driven'
    relationshipStyle: 'mirror',         // vs 'guide' | 'authority' | 'crutch'
    uncertaintyTolerance: 0.68           // Can sit with not-knowing
  },

  becomingHealth: {
    healthScore: 74,           // 0-100
    trend: 'deepening',        // deepening | stable | plateaued | concerning
    assessment: "Thriving - engaging with strong autonomy"
  }
}
```

**The RED FLAG**: If `relationalHealth.engagementPattern === 'dependency'` or `relationshipStyle === 'crutch'`

---

### 2. User Sovereignty (already in self-auditing)

When safety flags something, users see:
- **Why** it was flagged
- **Who** flagged it
- **Choice** to override

Already implemented, just needs UI.

---

### 3. Alignment Dashboard (`lib/alignment/alignment-dashboard.ts`)

**Simple weekly snapshot:**
- Are members becoming more autonomous? (trend)
- Are we creating dependency? (% showing patterns)
- Is cost pressure creeping in? (recent decisions)

**Example output:**

```
## What's Going Well
✓ Strong member autonomy - engaging with sovereignty
✓ Low dependency rate - members using MAIA as mirror
✓ Decisions driven by member outcomes, not cost

## Worth Your Attention
⚠ 18% showing dependency patterns
⚠ High session frequency (5.2/week) - possible over-reliance

## Questions to Consider
1. Are we unintentionally positioning ourselves as authority vs mirror?
2. What would help members find their own authority?

## Current Metrics

Authentic Becoming
- Member autonomy: 62%
- Trend: ↗ More sovereign
- Members showing strong autonomy

Dependency Check (The anti-Moloch metric)
- Members showing dependency: 18%
- Avg sessions/week: 5.2
- Some dependency patterns - worth monitoring
```

---

## Quick Integration

### Step 1: Calculate metrics (when you want to check)

```typescript
import { authenticBecomingTracker } from '@/lib/alignment/authentic-becoming-metrics';
import { journalStorage } from '@/lib/storage/journal-storage';

// For whole cohort
const cohortMetrics = authenticBecomingTracker.calculateCohortMetrics(
  journalStorage.entries,
  'current',
  90 // 90-day window
);

console.log('Autonomy trend:', cohortMetrics.autonomyTrend);
console.log('Dependency rate:', cohortMetrics.dependencyIndicators.percentShowingDependencyPatterns);
```

### Step 2: Get snapshot

```typescript
import { getAlignmentSnapshot, formatAlignmentReport } from '@/lib/alignment/alignment-dashboard';

const snapshot = await getAlignmentSnapshot({
  // From cohort metrics
  averageAutonomyScore: cohortMetrics.autonomyTrend.averageAutonomyScore,
  autonomyTrend: cohortMetrics.autonomyTrend.trend,
  percentShowingDependency: cohortMetrics.dependencyIndicators.percentShowingDependencyPatterns / 100,
  avgSessionsPerWeek: cohortMetrics.dependencyIndicators.averageSessionsPerWeek,

  // From safety/analytics
  safetyBlockRate: 0.08,
  userOverrideRate: 0.12,
  costPerConversation: 0.023,
  recentCostDecisions: 1
});

console.log(formatAlignmentReport(snapshot));
```

### Step 3: Review weekly/monthly

That's it. Just visibility into what's happening.

---

## What to Watch For

### 🟢 Healthy Signs
- Autonomy score >60% and increasing
- Low dependency rate (<10%)
- Engagement pattern: healthy_rhythm
- Relationship style: mirror
- Members challenging/questioning (good!)

### 🟡 Watch
- Autonomy 40-60%
- Dependency rate 10-20%
- Engagement pattern: crisis_driven
- Relationship style: guide

### 🔴 Concerning
- Autonomy <40% or decreasing
- Dependency rate >20%
- Engagement pattern: dependency
- Relationship style: crutch
- High session frequency (>5/week consistently)

---

## The Core Questions

**Schmachtenberger would ask:**

1. **Are members becoming more sovereign?**
   → Check autonomy trend

2. **Are you creating dependency?**
   → Check dependency indicators

3. **Is cost pressure overriding member welfare?**
   → Check recent cost-driven decisions

4. **Would you change course if the data showed harm?**
   → This system gives you that data

---

## Files

**Keep these:**
- `lib/alignment/authentic-becoming-metrics.ts` - Measures autonomy, not graduation
- `lib/alignment/alignment-dashboard.ts` - Simple weekly snapshot
- `lib/safety/self-auditing-orchestrator.ts` - User sovereignty already there

**Deleted (too intense):**
- ~~`lib/storage/independence-metrics.ts`~~ - Wrong frame (graduation)
- ~~`lib/business/alignment-constraints.ts`~~ - Automated blocking
- ~~`lib/alignment/misalignment-detection.ts`~~ - Automated tripwires

---

## The Difference

**Before**: "Help users graduate/become independent"
→ Wrong frame for ongoing becoming

**After**: "Help members become more authentically themselves"
→ Measure: Are they becoming more sovereign? Or more dependent?

**Anti-Moloch check**: Not "did they leave?" but "are they more themselves?"

Members might stay for years. That's fine. The question is: Are they developing their own authority, or are we becoming their authority?

---

## When to Use This

- **Weekly**: Quick check of cohort metrics
- **Monthly**: Full snapshot review
- **When considering big changes**: Check impact on autonomy
- **When something feels off**: Data to investigate

**You make all decisions. This just gives you visibility.**
