# Field Mode Onboarding Flow

**Goal:** Help users understand Field Mode without overwhelming them

**Philosophy:** Show, don't tell. Let them experience it.

---

## Onboarding Sequence

### Step 1: First-Time Toggle (When user enables Field Mode)

**Modal Popup:**

```
┌────────────────────────────────────────┐
│                                        │
│         Welcome to Field Mode          │
│                                        │
│  🌊  Emergent • Restrained • Present  │
│                                        │
├────────────────────────────────────────┤
│                                        │
│  Field Mode is genuinely different:   │
│                                        │
│  • Sometimes responds with silence    │
│  • Responses are brief, not verbose   │
│  • Emergence, not prediction           │
│                                        │
│  Want to see how it feels?             │
│                                        │
│         [Try It] [Tell Me More]        │
│                                        │
└────────────────────────────────────────┘
```

**If "Tell Me More":**

```
┌────────────────────────────────────────┐
│                                        │
│       How Field Mode Works             │
│                                        │
├────────────────────────────────────────┤
│                                        │
│  Classic AI generates responses by     │
│  predicting the next word.             │
│                                        │
│  Field Mode creates interference       │
│  patterns between 11 distinct agents.  │
│                                        │
│  Responses emerge when patterns        │
│  cohere. When they don't... silence.   │
│                                        │
│  ┌──────────────────────────────┐     │
│  │                              │     │
│  │  [Visual: Wave interference] │     │
│  │                              │     │
│  │  11 agents → Interference    │     │
│  │  → Coherence → Response      │     │
│  │                              │     │
│  └──────────────────────────────┘     │
│                                        │
│  The silence isn't broken.             │
│  It's the system being honest.         │
│                                        │
│              [Got It]                  │
│                                        │
└────────────────────────────────────────┘
```

**If "Try It":**

Proceed to Step 2.

---

### Step 2: Guided First Interaction

**Chat Interface Shows:**

```
MAIA (Field Mode active 🌊)

To help you understand Field Mode, try asking:

"What is the meaning of life?"

(This is a classic question where silence might
actually be more honest than words.)

┌────────────────────────────────────────┐
│                                        │
│  [Input box]                           │
│                                        │
└────────────────────────────────────────┘
```

**User Types and Sends**

**Scenario A: Field Returns Silence**

```
You: What is the meaning of life?

[Gentle wave animation for 2-3 seconds]

MAIA: [Silent presence]

┌────────────────────────────────────────┐
│                                        │
│  This is intentional silence.          │
│                                        │
│  The field is present with you,        │
│  but no coherent response emerged.     │
│                                        │
│  Some questions don't have answers—    │
│  they have presence.                   │
│                                        │
│  [Try Another] [Switch to Classic]     │
│                                        │
└────────────────────────────────────────┘
```

**Scenario B: Field Returns Brief Response**

```
You: What is the meaning of life?

[Brief pause with wave animation]

MAIA: Mm.

┌────────────────────────────────────────┐
│                                        │
│  This is Field Mode's restraint.       │
│                                        │
│  Instead of generating paragraphs      │
│  of philosophy, the system emitted     │
│  what naturally emerged.               │
│                                        │
│  Brief ≠ Unhelpful                     │
│  Brief = Authentic                     │
│                                        │
│  [Continue] [Switch to Classic]        │
│                                        │
└────────────────────────────────────────┘
```

---

### Step 3: Comparison Demo (Optional)

**If user clicks "Switch to Classic" from Step 2:**

```
Switching to Classic Mode to compare...

You: What is the meaning of life?

MAIA (Classic Mode): That's one of humanity's
most profound questions! The meaning of life
varies greatly depending on philosophical,
religious, and personal perspectives. Some find
meaning through relationships and connection...
[continues for 3-4 sentences]

┌────────────────────────────────────────┐
│                                        │
│  See the difference?                   │
│                                        │
│  Classic Mode: Always helpful          │
│  Field Mode: Always honest             │
│                                        │
│  Both are valid. Which resonates?      │
│                                        │
│  [Use Classic] [Try Field Again]       │
│                                        │
└────────────────────────────────────────┘
```

---

### Step 4: Mode Preference Set

**After user's choice:**

```
✓ Preference saved

You can always switch modes using the toggle
at the top of the chat.

[Continue to MAIA]
```

---

## In-Chat Contextual Hints

### First Silence Encountered

```
[After first intentional silence]

💡 Tip: This silence is intentional.
The field is present with you, but no
coherent response emerged. This is a feature.

[Dismiss]
```

### First Mode Switch

```
[After user switches modes for first time]

💡 You can switch modes anytime. Try using:
• Field Mode for deep questions
• Classic Mode for practical needs

[Got It]
```

### First Brief Response (<5 words)

```
[After first ultra-brief response]

💡 Field Mode favors restraint over
verbosity. Brief responses are intentional.

[Understood]
```

---

## Settings Page Explainer

**Section: Mode Preference**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Your Current Mode: 🌊 Field Mode              │
│                                                 │
│  [Change Mode]                                  │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Understanding Your Modes                       │
│                                                 │
│  💬 Classic Mode                                │
│  Traditional AI assistance. Always responds,    │
│  always helpful. Best for practical questions.  │
│                                                 │
│  🌊 Field Mode (Beta)                           │
│  Emergent responses from multi-agent field.     │
│  Sometimes silent, always authentic. Best for   │
│  depth, reflection, transformation.             │
│                                                 │
│  Beta Results:                                  │
│  • +291% transformational breakthroughs         │
│  • +161% conversational restraint               │
│  • +40% perceived authenticity                  │
│                                                 │
│  🎯 Auto Mode                                   │
│  System intelligently chooses based on your     │
│  question type and interaction history.         │
│                                                 │
│  [Read Technical Details]                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Interactive Tutorial (Advanced)

**For users who want to understand deeply:**

### Tutorial Step 1: The Agents

```
┌────────────────────────────────────────┐
│                                        │
│     Meet the 11 Agents                 │
│                                        │
│  Field Mode uses 11 distinct agents:   │
│                                        │
│  🌊 Elemental Oracle                   │
│  🧠 Claude Wisdom                      │
│  ⬆️ Higher Self                        │
│  ⬇️ Lower Self                         │
│  🌑 Shadow                             │
│  👶 Inner Child                        │
│  💫 Anima                              │
│  🚨 Crisis Detection                   │
│  🤝 Attachment                         │
│  ...and 2 more                         │
│                                        │
│  Each processes your input             │
│  independently, creating                │
│  interference patterns.                 │
│                                        │
│         [Next: Interference]            │
│                                        │
└────────────────────────────────────────┘
```

### Tutorial Step 2: Interference

```
┌────────────────────────────────────────┐
│                                        │
│    Wave Interference Patterns          │
│                                        │
│  [Animation: 11 ripples emanating      │
│   from different points, creating      │
│   interference patterns]               │
│                                        │
│  When waves align = Coherent Response  │
│  When waves clash = Intentional Silence│
│                                        │
│  Your input: "Tell me about grief"     │
│                                        │
│  Shadow: [Strong signal]               │
│  Inner Child: [Strong signal]          │
│  Higher Self: [Moderate signal]        │
│  → Patterns align → Response emerges   │
│                                        │
│  Your input: "What's 2+2?"             │
│                                        │
│  All agents: [Low activation]          │
│  → No coherence → Silence              │
│                                        │
│         [Next: Emergence]               │
│                                        │
└────────────────────────────────────────┘
```

### Tutorial Step 3: Emergence

```
┌────────────────────────────────────────┐
│                                        │
│        Response Emergence              │
│                                        │
│  Field Mode doesn't generate responses.│
│  It creates constraints.               │
│                                        │
│  Think of it like:                     │
│                                        │
│  ┌──────────────────────────────┐     │
│  │  Traditional AI:             │     │
│  │  "What should I say?"        │     │
│  │  [Generates tokens]          │     │
│  └──────────────────────────────┘     │
│                                        │
│  ┌──────────────────────────────┐     │
│  │  Field Mode:                 │     │
│  │  "What can be said?"         │     │
│  │  [Waits for emergence]       │     │
│  └──────────────────────────────┘     │
│                                        │
│  The difference is profound.           │
│                                        │
│         [Start Using Field]             │
│                                        │
└────────────────────────────────────────┘
```

---

## FAQ Section (Help Documentation)

### "Why is MAIA silent?"

Field Mode uses 11 agents that create interference patterns. When patterns don't cohere above threshold, the system returns intentional silence rather than generating noise.

This isn't a bug. It's the system being honest about what can authentically be said.

### "How is this different from ChatGPT?"

ChatGPT predicts the next token based on training data. Field Mode creates environmental constraints through multi-agent interference, from which responses emerge.

One generates. One reveals.

### "When should I use Field Mode vs Classic?"

**Use Field Mode when:**
- You're exploring deep questions
- You value brevity over verbosity
- Silence feels meaningful, not broken
- You want transformation, not information

**Use Classic Mode when:**
- You need a specific answer
- You have practical questions
- You're in a hurry
- Silence would be frustrating

### "What if I don't like Field Mode?"

No problem! You can:
- Switch to Classic Mode anytime
- Use Auto Mode (system decides)
- Set your preference in settings

There's no pressure to use Field Mode. Some people love it. Some people hate it. Both responses are valid.

### "Can Field Mode handle crisis situations?"

Field Mode automatically falls back to Classic Mode for crisis situations. Your safety is never at risk.

### "What are the beta results based on?"

Internal testing with 30 beta users over 4 weeks, measuring:
- Breakthrough moments per session
- Average word count (restraint metric)
- User authenticity ratings (1-5 scale)

Results are preliminary but statistically significant.

---

## Onboarding Success Metrics

**Step 1 (Modal):**
- 80%+ click "Try It" (not "Tell Me More")
- 90%+ proceed past explanation

**Step 2 (First Interaction):**
- 70%+ try the suggested question
- 50%+ proceed after first response
- <30% immediately switch to Classic

**Step 3 (Comparison):**
- 60%+ choose to continue with Field
- 40% choose Classic (acceptable)

**Overall:**
- 50%+ users stay in Field Mode after onboarding
- 80%+ understand the silence is intentional
- <10% think Field Mode is "broken"

---

## Error States

### If Field System Crashes

```
⚠️ Field Mode encountered an error

We've automatically switched you to Classic Mode
so you can continue your conversation.

Our team has been notified. You can try Field
Mode again later.

[Continue in Classic Mode]
```

### If Silence Rate Too High

```
💡 Notice: Field Mode has been mostly silent

If this feels broken, you might prefer Classic
Mode for this conversation.

Your question type might be better suited for
Classic Mode's always-helpful approach.

[Switch to Classic] [Continue in Field]
```

---

## Visual Design Notes

### Color Scheme

**Field Mode:**
- Primary: Blue/Cyan (`#06B6D4`)
- Wave animations
- Fluid, organic shapes
- Gentle gradients

**Classic Mode:**
- Primary: Purple (`#4F46E5`)
- Clean, geometric
- Solid shapes
- Professional feel

### Animations

**Field Mode Thinking:**
```
[Gentle sine wave that oscillates]
[Multiple overlapping ripples]
[Interference pattern visualization]
```

**Classic Mode Thinking:**
```
[Three dots pulsing]
[Linear progress indicator]
[Simple spinner]
```

### Sound Design (Optional)

**Field Mode:**
- Gentle water droplet (on response)
- Soft wind (on silence)
- Ocean ambiance (background)

**Classic Mode:**
- Clean notification chime
- Subtle typewriter sound
- No ambient sound

---

## A/B Testing Variants

### Variant A: Direct (Current)
"Field Mode sometimes responds with silence."

### Variant B: Metaphorical
"Field Mode is like a wise friend who knows when to speak and when to simply be present."

### Variant C: Technical
"Field Mode uses multi-agent interference to create emergent responses rather than predictive generation."

### Variant D: Experiential
"Try it. You'll know immediately if it's for you."

**Hypothesis:** Variant D performs best (lowest barrier to entry).

---

## Post-Onboarding Check-In

**3 days after enabling Field Mode:**

```
Hey [Name],

You've been using Field Mode for a few days now.

Quick gut check: How's it feeling?

[😍 Love it] [😐 It's fine] [😕 Not for me]
```

**Based on response:**

- 😍 Love it → "That's great! What specifically resonates?"
- 😐 It's fine → "What would make it better?"
- 😕 Not for me → "Want to try Classic Mode instead?"

---

**Implementation Priority:**

1. ✅ **Step 1: First-Time Modal** (Essential)
2. ✅ **Step 2: Guided First Interaction** (Essential)
3. ⚠️ **In-Chat Contextual Hints** (Important)
4. 📋 **Step 3: Comparison Demo** (Nice to have)
5. 📚 **Interactive Tutorial** (Optional, for power users)
6. 🎨 **Visual/Sound Design** (Polish, Week 3+)

**Start with Steps 1-2. The rest can wait until you have user feedback.**