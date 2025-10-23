# Interactive Holoflower Check-In: Integration Analysis

## Current User Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         NEW USER FLOW                            │
└─────────────────────────────────────────────────────────────────┘

/ (root)
  ↓ [checks localStorage for onboarding status]
  ↓
/week2-welcome
  ↓ [Stage 1: Opening - "Welcome to Soullab"]
  ↓ [Stage 2: Identity - Soullab-[NAME]]
  ↓ [Stage 3: Credentials - username/password]
  ↓ [Stage 4: Week 2 Message - MAIA introduction]
  ↓ [Stage 5: Complete - marks week2_onboarded = true]
  ↓
/intro
  ↓ [Cycles through 7 mantras (3s each)]
  ↓ ["You are a pattern to witness"]
  ↓ ["Your complexity is your wholeness"]
  ↓ [Final: "Meet MAIA - Your Guide Through Consciousness"]
  ↓
/maia
  └─> [Main conversation interface]


┌─────────────────────────────────────────────────────────────────┐
│                      RETURNING USER FLOW                         │
└─────────────────────────────────────────────────────────────────┘

/ (root)
  ↓ [detects week2_onboarded = true]
  ↓
/checkin
  ↓ [Quick username-only check-in]
  ↓ [Shows wisdom quote + optional announcement]
  ↓
/welcome-back
  ↓ [Time-based greeting (morning/afternoon/evening/night)]
  ↓ [Shows days since last visit]
  ↓ [Auto-advances to MAIA after 3 seconds]
  ↓
/maia
  └─> [Main conversation interface]
```

## The Two Check-In Systems

### System 1: Spiralogic Survey (LEFT-BRAIN)
**File:** `apps/api/backend/src/content/SHIFtExplicitSurvey.ts`

**Characteristics:**
- **Format:** 24 Likert-scale questions (1-7 scale)
- **Duration:** ~8 minutes
- **Mode:** Cognitive, analytical, reflective
- **Brain:** Left hemisphere - verbal, sequential, explicit
- **Data:** Structured, psychometrically validated
- **Use Case:** Research, longitudinal tracking, clinical validation

**Questions:**
- "I feel a spark of purpose that guides me..."
- "My daily actions reflect a vision that excites me..."
- "I am willing to take risks in service of what I believe in..."

**Output:**
```typescript
{
  facetScores: {
    F1_Meaning: 6.5,
    F2_Courage: 5.0,
    E1_Coherence: 7.0,
    // ... 12 facets total
  },
  elementalScores: {
    fire: 5.75,
    earth: 6.5,
    water: 6.0,
    air: 5.5,
    aether: 6.25
  }
}
```

### System 2: Interactive Holoflower (RIGHT-BRAIN)
**File:** `components/holoflower/InteractiveHoloflowerCheckIn.tsx`

**Characteristics:**
- **Format:** 12 draggable petals (0-10 scale)
- **Duration:** ~2-3 minutes
- **Mode:** Intuitive, kinesthetic, somatic
- **Brain:** Right hemisphere - visual, spatial, implicit
- **Data:** Visual configuration, "field signature"
- **Use Case:** Daily ritual, intuitive divination, embodied wisdom

**Interaction:**
- Drag petals outward → expansion, activation, strength
- Drag petals inward → contraction, dormancy, shadow
- Visual feedback → opacity, size, color intensity
- Hover → shows facet name, element, reflection question

**Output:**
```typescript
{
  values: [7, 5, 6, 8, 4, 7, 9, 6, 3, 7, 8, 6], // 12 petal values
  coherence: 0.72, // Overall integration (0-1)
  dominant: "earth", // Highest elemental score
  shadow: "water", // Lowest elemental score
  signature: "N2U4NTY4NDc5Njg=", // Unique configuration hash
  timestamp: "2025-10-23T14:30:00Z"
}
```

## Data Flow: How Check-In Informs MAIA

### Current State (NOT INTEGRATED)
```
User → /checkin → /welcome-back → /maia
                                     ↓
                              [MAIA has NO context
                               about user's current state]
```

### Potential Integration
```
User → /checkin → [Holoflower Check-In] → /welcome-back → /maia
                           ↓                                  ↓
                    Saves to localStorage              Reads check-in data
                           ↓                                  ↓
                   {                              Adds to system prompt:
                     values: [...]                "User's current state:
                     coherence: 0.72              - Strong earth (grounded)
                     dominant: "earth"            - Shadow water (emotions need attention)
                     shadow: "water"              - Coherence: 72% (good integration)
                   }                              - Signature: N2U4NTY4NDc5Njg="
```

### Value Proposition
If MAIA knows the user just checked in with:
- **Strong Earth (9/10)** → MAIA can acknowledge groundedness, offer practical guidance
- **Shadow Water (3/10)** → MAIA can gently invite emotional exploration
- **High Coherence (0.85)** → MAIA celebrates integration, offers advanced practices
- **Low Coherence (0.35)** → MAIA provides stabilizing presence, simpler prompts

## Strategic Placement Options

### Option A: Daily Threshold (RECOMMENDED)
**Location:** Between `/welcome-back` and `/maia`

**Flow:**
```
/welcome-back
  ↓
  "Welcome back, Kelly. Before we begin..."
  ↓
/holoflower-checkin (NEW)
  ↓ [2-3 minute intuitive check-in]
  ↓ [Generates field signature]
  ↓
/maia (WITH CONTEXT)
  └─> MAIA now knows your current state
```

**Frequency:** Daily (or user can skip)

**Pros:**
- Creates intentional pause before conversation
- Grounds user in their body/state
- Provides real-time context to MAIA
- Establishes ritual consistency

**Cons:**
- Adds 2-3 minutes to entry flow
- Some users may want quick access

**Solution:**
- Show holoflower check-in first time each day
- Add "Skip to MAIA" button for urgent needs
- Remember last check-in for 12 hours

---

### Option B: Weekly Ritual
**Location:** Standalone route `/holoflower-weekly`

**Flow:**
```
/maia
  ↓ [On Sunday evening or Monday morning]
  ↓
  Banner: "Your weekly holoflower ritual is ready"
  ↓
/holoflower-weekly
  ↓ [Shows current week + last 4 weeks as comparison]
  ↓ [Generates weekly pattern analysis]
```

**Frequency:** Weekly

**Pros:**
- Doesn't interrupt daily flow
- Creates longitudinal data
- Shows pattern evolution
- More reflective, less reactive

**Cons:**
- Not integrated into daily MAIA context
- May be forgotten if not prompted
- Loses daily embodied ritual quality

---

### Option C: Choice-Based Entry
**Location:** `/checkin` page

**Flow:**
```
/checkin
  ↓
  [Username field]
  ↓
  Two buttons:
  - "Quick Check-In" → /welcome-back → /maia
  - "Deeper Check-In" → /holoflower-checkin → /welcome-back → /maia
```

**Frequency:** User's choice each day

**Pros:**
- Respects user agency
- Adapts to available time/energy
- Still daily ritual option

**Cons:**
- May default to quick check-in (path of least resistance)
- Inconsistent data collection
- MAIA sometimes has context, sometimes doesn't

---

### Option D: Post-Conversation Reflection
**Location:** After MAIA conversation

**Flow:**
```
/maia
  ↓ [User has conversation with MAIA]
  ↓ [Conversation ends]
  ↓
  "Before you go, take a moment to check in with yourself..."
  ↓
/holoflower-checkin
  ↓ [Compare before (imagined) vs after (actual)]
```

**Frequency:** After each MAIA session

**Pros:**
- Captures impact of conversation
- Creates closing ritual
- Shows transformation

**Cons:**
- Doesn't inform MAIA's responses
- May feel like homework
- User energy may be low after deep conversation

---

## Comparison Matrix

| Criterion | Option A (Daily Threshold) | Option B (Weekly) | Option C (Choice) | Option D (Post-Convo) |
|-----------|---------------------------|------------------|-------------------|----------------------|
| **Informs MAIA** | ✅ Yes | ❌ No | ⚠️ Sometimes | ❌ No |
| **Daily ritual** | ✅ Yes | ❌ No | ⚠️ Optional | ✅ Yes |
| **Time burden** | ⚠️ Medium | ✅ Low | ✅ Low | ⚠️ Medium |
| **Data consistency** | ✅ High | ⚠️ Medium | ❌ Low | ✅ High |
| **User agency** | ⚠️ Can skip | ✅ Full | ✅ Full | ⚠️ Can skip |
| **Embodied presence** | ✅ Strong | ⚠️ Moderate | ⚠️ Variable | ✅ Strong |
| **Longitudinal tracking** | ✅ Yes | ✅ Yes | ⚠️ Sparse | ✅ Yes |

## Logic & Usefulness Analysis

### Core Value Proposition
The holoflower check-in is valuable when it:

1. **Informs MAIA's attunement** → MAIA adapts responses based on user's current state
2. **Creates embodied ritual** → User pauses to sense their field before speaking
3. **Tracks patterns over time** → User sees evolution of their elemental balance
4. **Serves as oracle/divination** → User receives insights from their own configuration

### Key Questions

**Q1: Should check-in data inform MAIA's responses?**
- **If YES** → Must happen BEFORE conversation (Option A or C)
- **If NO** → Can happen anytime (Option B or D)
- **Recommendation:** YES - this is the core value. Otherwise it's just a pretty visualization.

**Q2: Is this a daily or periodic ritual?**
- **Daily** → Captures micro-patterns, becomes habit (Options A, C, D)
- **Weekly/Monthly** → Shows macro-patterns, less burden (Option B)
- **Recommendation:** Daily threshold with weekly aggregation view

**Q3: Is it required or optional?**
- **Required** → Consistent data, may feel forced
- **Optional** → User agency, inconsistent data
- **Recommendation:** Required first time each day, can be skipped if urgent (cached for 12 hours)

**Q4: How does it differ from just asking MAIA "how am I feeling?"**
- **Holoflower:** Pre-verbal, somatic, right-brain, bypasses narrative
- **MAIA conversation:** Verbal, cognitive, left-brain, narrativized
- **Value:** Holoflower captures what user doesn't yet have words for

## Recommended Implementation: Option A+ (Enhanced Daily Threshold)

### User Flow
```
/welcome-back (3s)
  ↓
  "Welcome back, Kelly. The work continues."
  ↓ [Auto-advances after 3s]
  ↓
/holoflower-checkin (NEW)
  ↓
  ┌────────────────────────────────────────┐
  │ "Before we begin, where are you?"      │
  │                                        │
  │ [Interactive 12-petal holoflower]      │
  │ [Drag petals to indicate your state]  │
  │                                        │
  │ Coherence: 72%                         │
  │ Dominant: Earth (grounded)             │
  │ Shadow: Water (emotions seeking flow)  │
  │                                        │
  │ [Skip] [Submit & Continue]             │
  └────────────────────────────────────────┘
  ↓
  [Saves to localStorage]
  ↓
/maia (INFORMED)
  ↓
  MAIA's system prompt includes:
  "Kelly just checked in. Current state:
   - Dominant earth (9/10) - deeply grounded
   - Shadow water (3/10) - emotions need gentle attention
   - High fire (8/10) - ready for action
   - Coherence: 72% - good integration

   Adapt your responses to meet her where she is.
   If she brings up emotions, acknowledge the shadow water.
   If she asks for guidance, honor the strong earth foundation."
```

### Features
- **Smart caching:** Once per day (or 12 hours)
- **Skip button:** Always available (for urgent needs)
- **Historical view:** Tap center to see last 7 days
- **Oracle reading:** After submit, brief insight about configuration
- **Journal integration:** "Would you like to journal about this?" (optional)

### Technical Implementation
```typescript
// In /maia page.tsx, before MAIA conversation starts:

const todayCheckIn = localStorage.getItem('holoflower_checkin_today');
const checkInData = todayCheckIn ? JSON.parse(todayCheckIn) : null;

if (checkInData && isToday(checkInData.timestamp)) {
  // Add to MAIA system prompt
  const contextPrompt = `
    User's current state (from holoflower check-in ${checkInData.timestamp}):
    - Values: ${checkInData.values}
    - Dominant element: ${checkInData.dominant}
    - Shadow element: ${checkInData.shadow}
    - Coherence: ${Math.round(checkInData.coherence * 100)}%

    Interpretation:
    ${generateInterpretation(checkInData)}
  `;

  systemPrompt += contextPrompt;
}
```

## Next Steps

### Phase 1: Minimal Integration (This Week)
1. ✅ Re-activate holoflower check-in component
2. ✅ Create route: `/holoflower-checkin`
3. ✅ Update `/welcome-back` to redirect to holoflower instead of straight to MAIA
4. ✅ Add localStorage persistence
5. ✅ Test flow end-to-end

### Phase 2: MAIA Context Integration (Next Week)
1. ✅ Create `interpretCheckIn()` function
2. ✅ Add check-in data to MAIA system prompt
3. ✅ Test MAIA's responses with/without check-in context
4. ✅ Refine interpretation logic based on actual conversations

### Phase 3: Longitudinal Tracking (Week 3)
1. ✅ Store check-ins in Supabase (date + values)
2. ✅ Create `/holoflower-history` view
3. ✅ Show weekly/monthly pattern analysis
4. ✅ Add "See your evolution" button in holoflower check-in

### Phase 4: Oracle Enhancements (Week 4)
1. ✅ Add voice reading of oracle message
2. ✅ Detect sacred geometry patterns (triangles, crosses, spirals)
3. ✅ Create ritual completion messages for special configurations
4. ✅ Integrate with journal flow

## Open Questions for Kelly

1. **Should the holoflower check-in be required or skippable?**
   - My recommendation: Required first time each day, but with visible Skip button

2. **How long should the check-in data be "fresh" for MAIA?**
   - My recommendation: 12 hours (so morning check-in applies to afternoon conversation)

3. **Should we show the user what MAIA "sees" from their check-in?**
   - My recommendation: Yes, transparency builds trust ("MAIA notices you're grounded today...")

4. **Do we want the Spiralogic Survey (24-question likert) for research, or is holoflower enough?**
   - My recommendation: Holoflower for daily use, Survey for monthly deep-dive or research cohort

5. **Should holoflower check-in replace the current `/welcome-back` page, or come after it?**
   - My recommendation: Come after welcome-back (keep the beautiful greeting, then check-in)

---

**Ready to implement?** Let me know which option resonates, or if you want to explore a hybrid approach.
