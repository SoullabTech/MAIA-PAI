# Reader Meta-View: "Where Am I?" Interface

**Purpose**: Give readers complete transparency into what MAIA sees, creating collaborative awareness rather than hidden profiling.

---

## Design Principle

**"You have a right to see what I see."**

The meta-view is activated when reader asks:
- "What phase is this reflecting?"
- "Where am I in the map?"
- "What are you noticing about my process?"
- "Show me where I've been and where I'm going"

---

## Interface Components

### 1. Current Location Card

```
┌─────────────────────────────────────────────┐
│ 🔥 You're in Fire 2: World-Testing          │
│                                             │
│ Based on your language and engagement:      │
│                                             │
│ Evidence I'm seeing:                        │
│ • "They won't understand" (3x)              │
│ • "Burning out from pushing"                │
│ • Completed Fire practices, skipped Water   │
│                                             │
│ This suggests:                              │
│ • You're testing your vision externally     │
│ • Feeling judgment/exposure fear            │
│ • May need grounding/rest                   │
│                                             │
│ Does this resonate? [Yes] [Not quite]       │
└─────────────────────────────────────────────┘
```

### 2. Journey Timeline

```
Your Path Through the Elements

    ┌─ Fire 1: Vision ──────────────┐
    │  Oct 1-15                     │
    │  ✓ Completed                  │
    │  Key moment: "Decided to say yes" │
    └───────────────────────────────┘
              ↓
    ┌─ Fire 2: World-Testing ───────┐
    │  Oct 16-Present               │
    │  ○ In Progress                │
    │  Working with: Judgment fear  │
    └───────────────────────────────┘
              ↓
    ┌─ Fire 3: Expression ──────────┐
    │  Not yet                      │
    │  When ready: [indicators]     │
    └───────────────────────────────┘
```

### 3. Elemental Balance Dashboard

```
Your Elemental Signature (Current)

🔥 Fire  ████████░░  0.8   High engagement
                         (May need balance)

💧 Water ███░░░░░░░  0.3   Lower engagement
                         (Possible avoidance?)

🌬️ Air   ██████░░░░  0.6   Moderate

🌍 Earth ████░░░░░░  0.4   Emerging

✨ Aether ██░░░░░░░░  0.2   Early stages

Based on your:
• Practice completions
• Section engagement
• Reflection depth
• Avoidance patterns
```

### 4. Demons & Gifts Tracker

```
What's Present Right Now

Shadows I'm noticing:
🔴 Fire 2: Judgment Fear (High confidence)
   Evidence: "They won't understand" (3x),
             "Not ready to share"

🟡 Fire 2: Burnout (Medium confidence)
   Evidence: "Exhausted", "Pushing too hard"

🟢 Water 1: Emotional Suppression (Low confidence)
   Evidence: Skipped all Water sections

Gifts Available:
✨ Vision Clarity (Fire 1 completed)
✨ Resilience (Fire 2 in progress)
✨ Authentic Power (Emerging)

[Tell me more about these]
```

### 5. Readiness Assessment

```
What You Might Need Now

Based on what I'm seeing:

Ready for:
✅ Rest/grounding practices (Earth)
✅ Judgment fear work (Fire 2 demon)
✅ Small external sharing (Fire 2 → 3)

Not yet ready for:
⏸ Full public expression (Fire 3)
⏸ Deep shadow integration (Water 2)

What would serve you most?
• [Rest and restore]
• [Face judgment fears]
• [Try small sharing]
• [Something else - tell me]
```

### 6. "What I'm Missing" Feedback

```
Am I seeing you accurately?

What I think I see:
• You're in Fire 2, working with judgment
• You need rest before next push
• Water work is being avoided

What am I missing or getting wrong?

[Text input for user to correct/clarify]

This helps me learn!
```

---

## How User Activates Meta-View

### Natural Language Triggers

Any of these phrases opens the meta-view:

- "Where am I?"
- "What phase is this?"
- "Show me my journey"
- "What are you noticing?"
- "Am I making progress?"
- "What do you see in my patterns?"
- "Give me the meta-view"

### Always-Available Button

```
┌────────────────┐
│ 🗺️ Meta-View   │
│ (See what      │
│  MAIA sees)    │
└────────────────┘
```

---

## Implementation Spec

### Data Structure

```typescript
interface MetaView {
  current_phase: {
    element: 'fire' | 'water' | 'air' | 'earth' | 'aether';
    phase_number: 1 | 2 | 3 | 4;
    phase_name: string;
    confidence: number; // 0-1
    evidence: string[]; // Actual quotes/behaviors
    since_date: Date;
  };

  journey_timeline: {
    phase: string;
    start_date: Date;
    end_date: Date | null;
    status: 'completed' | 'in_progress' | 'not_yet';
    key_moments: string[];
    breakthroughs: string[];
  }[];

  elemental_balance: {
    fire: number;
    water: number;
    air: number;
    earth: number;
    aether: number;
  };

  demons_detected: {
    demon: string;
    confidence: number;
    evidence: string[];
    supportive_action: string;
  }[];

  gifts_available: {
    gift: string;
    from_phase: string;
    how_to_access: string;
  }[];

  readiness: {
    ready_for: string[];
    not_ready_for: string[];
    next_step_suggestions: string[];
  };

  accuracy_check: {
    what_we_think: string[];
    user_corrections: string[];
    last_updated: Date;
  };
}
```

### API Endpoint

```typescript
// GET /api/reader/meta-view
export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return unauthorized();

  const metaView = await generateMetaView(user.id);

  return NextResponse.json(metaView);
}

async function generateMetaView(userId: string): Promise<MetaView> {
  // 1. Analyze all reader events
  const events = await getReaderEvents(userId);

  // 2. Detect current phase from:
  //    - Language patterns (demon keywords)
  //    - Engagement patterns (completions/skips)
  //    - Reflection responses
  const currentPhase = await detectPhase(events);

  // 3. Build journey timeline
  const timeline = await buildTimeline(events);

  // 4. Calculate elemental balance
  const balance = calculateElementalBalance(events);

  // 5. Detect active demons
  const demons = await detectDemons(events);

  // 6. Identify available gifts
  const gifts = identifyGifts(timeline);

  // 7. Assess readiness
  const readiness = assessReadiness(currentPhase, demons, balance);

  return {
    current_phase,
    journey_timeline: timeline,
    elemental_balance: balance,
    demons_detected: demons,
    gifts_available: gifts,
    readiness,
    accuracy_check: await getAccuracyChecks(userId)
  };
}
```

---

## Example Meta-View Response

**When user asks: "Where am I?"**

MAIA Response:

---

**Your Journey Map** 🗺️

**You're currently in Fire 2: World-Testing & Purification**

Here's what I'm seeing:

**The Evidence**:
From your recent interactions, I notice:
- You've used phrases like "they won't understand" three times
- You completed the Fire vision practices but skipped the Water shadow work
- Your reflections mention feeling "exhausted" and "burning out"
- You're engaging with external feedback but it's activating judgment fears

**What This Suggests**:
You're in the phase where vision meets reality. You've said yes to the call (Fire 1 ✓), and now the world is testing and refining your vision. This is purification—the calcinatio process where non-essentials burn away.

The two main patterns I'm noticing:
1. **Judgment Fear** (Fire 2 demon) - Fear of exposure, being misunderstood
2. **Burnout Risk** - Pushing too hard without rest

**Your Elemental Balance**:
- 🔥 Fire: 0.8 (very high - this is your strength AND your edge)
- 💧 Water: 0.3 (lower - possible avoidance of emotional processing?)
- 🌬️ Air: 0.6 (good engagement with clarity work)
- 🌍 Earth: 0.4 (emerging - may need more grounding)
- ✨ Aether: 0.2 (early integration phase)

**Where You've Been**:
✓ **Fire 1 (Oct 1-15)**: Vision awakening, refusal work, said yes
   - Key moment: "I'm doing this, even if I'm scared"
   - Completed: Vision clarification, shame transmutation

**What You Might Need Now**:
Based on these patterns, you might benefit from:
1. **Rest/grounding** (Earth practices) - Balance the fire intensity
2. **Judgment fear work** - Not avoiding, but facing with support
3. **Small sharing experiments** - Test the vision gently, not all at once

**What's NOT ready yet**:
- Full public launch (Fire 3) - The vision needs more refining
- Deep shadow diving (Water 2) - Would be destabilizing right now

**Am I Seeing This Right?**
This is what the patterns suggest—but you know your inner experience better than I do.

What am I getting right? What am I missing?

[Feedback input]

---

Your journey is yours. This map is here to help you see yourself more clearly, not to prescribe a path.

Want to explore any of this deeper?

---

## Ethical Guardrails

### What We DON'T Say

❌ "You must do X"
❌ "You're stuck/broken"
❌ "This is the only way"
❌ Hidden assessments

### What We DO Say

✅ "Based on patterns, I'm noticing..."
✅ "This suggests you might be..."
✅ "Does this resonate?"
✅ "What am I missing?"
✅ "This is one possible interpretation"

---

## Integration with Reading Experience

### Subtle Indicators (Always Visible)

```
┌────────────────────────────────┐
│ Reading: Fire Element Ch.2     │
│                                │
│ 🔥 Fire bias: 0.8             │
│ 📍 You're in Fire 2           │
│ [See full map]                │
└────────────────────────────────┘
```

### Reflection Check-In (After Each Section)

```
Section Complete ✓

Quick check-in:
• What came up? [text input]
• How did this land? [resonant/uncomfortable/neutral]

[See where this fits in your journey]
```

---

**Version**: 1.0
**Created**: October 25, 2025
**Principle**: Transparency breeds trust. Hiding breeds extraction.
**Purpose**: Let readers see themselves through MAIA's eyes - collaboratively
