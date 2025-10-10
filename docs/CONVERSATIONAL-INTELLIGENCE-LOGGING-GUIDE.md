# 📊 MAIA Conversational Intelligence Logging Guide

**Purpose:** Monitor what the pipeline is doing in real-time during test conversations

---

## 🎯 What to Monitor

During each conversation turn, check these console logs:

---

### 1. 🌀 **ConversationFlowTracker**

**Log pattern:**
```
🌀 Updating conversation flow tracker...
✅ Flow state: {
  energy: 'opening',
  pace: 'slow',
  depth: 1,
  turnCount: 1,
  strategy: 'reflecting'
}
```

**What to check:**

| Field | What It Means | Watch For |
|-------|---------------|-----------|
| `energy` | Arc position: `opening` → `building` → `peak` → `integrating` | ✅ Should progress naturally<br>❌ Stuck at one energy level |
| `pace` | Response pacing: `slow`, `medium`, `quick` | ✅ Varies with intensity<br>❌ Always same pace |
| `depth` | Conversation depth (0-10) | ✅ Increases with long/intense messages<br>❌ Stuck at depth:2 for all turns |
| `turnCount` | Number of exchanges | ✅ Increments each turn<br>❌ Not incrementing |
| `strategy` | Response style: `questioning`, `reflecting`, `affirming`, `challenging`, `witnessing` | ✅ Varies appropriately<br>❌ Always `reflecting` |

**Good example:**
```
Turn 1: energy:'opening', depth:1, strategy:'reflecting'
Turn 3: energy:'building', depth:3, strategy:'questioning'
Turn 6: energy:'peak', depth:7, strategy:'challenging'
Turn 9: energy:'integrating', depth:8, strategy:'affirming'
```

**Bad example (red flags):**
```
Turn 1: energy:'opening', depth:2, strategy:'reflecting'
Turn 5: energy:'opening', depth:2, strategy:'reflecting'  ❌ Not progressing
Turn 9: energy:'opening', depth:2, strategy:'reflecting'  ❌ Stuck
```

---

### 2. 🎭 **ConversationalEnhancer**

**Log pattern:**
```
🎭 Enhancing response with ConversationalEnhancer...
✅ Response enhanced: {
  emotionalTone: 'vulnerable',
  hadAcknowledgment: true,
  acknowledgment: 'I hear you',
  pacing: 'slow'
}
```

**What to check:**

| Field | What It Means | Watch For |
|-------|---------------|-----------|
| `emotionalTone` | Detected user emotion: `excited`, `vulnerable`, `distressed`, `joyful`, `curious`, `neutral` | ✅ Varies with user input<br>❌ Always `neutral` |
| `hadAcknowledgment` | Whether acknowledgment was added | ✅ `true` when user is vulnerable/excited<br>❌ `false` every time (too minimal) |
| `acknowledgment` | What was added | ✅ Varies: "I hear you", "Yeah", "Mm-hmm"<br>❌ Same every time |
| `pacing` | Voice pacing: `fast`, `moderate`, `slow`, `thoughtful` | ✅ Matches emotion<br>❌ Always `moderate` |

**Good example:**
```
User: "I'm scared."
emotionalTone: 'vulnerable'
hadAcknowledgment: true
acknowledgment: 'I hear you'
pacing: 'slow'
```

**Bad example (red flags):**
```
User: "I'm so excited!"
emotionalTone: 'neutral'  ❌ Should be 'excited'
hadAcknowledgment: false  ❌ Should acknowledge excitement
```

---

### 3. 🔥 **ElementalRefiner**

**Log pattern:**
```
🔥 Applying elemental refinement...
✅ Elemental refinement applied: {
  element: 'water',
  transformations: 4,
  examples: ['phenom:sensory', 'remove:filler', 'water:flow', 'phrase:elemental'],
  phraseAdded: 'That feeling runs deep.'
}
```

**What to check:**

| Field | What It Means | Watch For |
|-------|---------------|-----------|
| `element` | Detected element: `fire`, `water`, `earth`, `air`, `aether` | ✅ Varies across conversations<br>❌ Always `aether` |
| `transformations` | Number of changes made | ✅ 2-5 per turn (reasonable)<br>❌ 10+ (over-processing)<br>❌ 0 (not working) |
| `examples` | Types of transformations applied | ✅ Mix of phenom, filler removal, elemental<br>❌ Only one type |
| `phraseAdded` | Elemental phrase added (or 'none') | ✅ Only when response generic<br>❌ Added every single time |

**Transformation labels:**

| Label | What It Did |
|-------|-------------|
| `phenom:sensory` | Replaced abstract with sensory ("I understand" → "I see") |
| `phenom:emotional` | Added emotional resonance |
| `phenom:relational` | Added relational anchor |
| `remove:filler` | Removed "kind of", "sort of", "just" |
| `remove:hedging` | Removed "I guess", "it seems like" |
| `soften:command` | Changed command to invitation |
| `fire:directness` | Removed "try to" |
| `water:flow` | Changed "must" → "can" |
| `earth:practice` | Changed "try meditating" → "practice meditating" |
| `air:clarity` | Removed vague words |
| `aether:reframe` | Changed "problem" → "pattern" |
| `phrase:elemental` | Added elemental phrase from phrasebook |

**Good example:**
```
element: 'water'
transformations: 3
examples: ['phenom:sensory', 'remove:filler', 'water:flow']
phraseAdded: 'none'  ← Response already had personality
```

**Bad example (red flags):**
```
element: 'aether'  ❌ (every conversation)
transformations: 0  ❌ (not working)
phraseAdded: 'That feeling runs deep.'  ❌ (but response was already rich)
```

---

## 📋 **Turn-by-Turn Checklist**

For each conversation turn, capture:

```
=== TURN X ===
User Input: "[actual text]"
  - Word count: X
  - Emotional intensity: [low/medium/high]
  - Question mark: [yes/no]

Raw Response: "[Claude/GPT output before processing]"

--- PIPELINE ---
1. FlowTracker:
   - energy: [opening/building/peak/integrating]
   - depth: X
   - strategy: [questioning/reflecting/affirming/challenging/witnessing]

2. Enhancer:
   - emotionalTone: [excited/vulnerable/etc]
   - acknowledgment: ["I hear you" or none]
   - pacing: [fast/moderate/slow]

3. Refiner:
   - element: [fire/water/earth/air/aether]
   - transformations: X
   - phraseAdded: ["..." or none]

Final Response: "[actual MAIA output]"

--- QUALITY CHECK ---
✅/❌ Natural warmth (not therapy-speak)
✅/❌ Appropriate length (5-15 words early, can expand later)
✅/❌ Elemental resonance feels organic
✅/❌ No weird grammar
✅/❌ Preserved meaning
```

---

## 🚨 **Red Flags to Watch**

### Pipeline Not Working
```
❌ FlowTracker always shows depth:2, energy:'opening'
❌ Enhancer always shows emotionalTone:'neutral'
❌ Refiner always shows element:'aether', transformations:0
```
→ **Action:** Check if modules are actually being called

### Over-Processing
```
❌ transformations:12 (too many changes)
❌ phraseAdded every single turn (too aggressive)
❌ Response: "I feel you're overwhelmed. That feeling runs deep. I'm with you. Let it move through you."
   (3 phrases added - way too much)
```
→ **Action:** Increase thresholds, reduce transformation patterns

### Lost Nuance
```
Before: "I understand this is difficult, but you're making progress."
After: "I see this is hard. You're making progress."
❌ Lost the supportive "but" that acknowledged both struggle AND growth
```
→ **Action:** Refine regex patterns to preserve meaning

### Wrong Element
```
User: "I'm so anxious, my mind won't stop racing."
element: 'fire'  ❌ Should be 'air' (mental) or 'earth' (needs grounding)
```
→ **Action:** Check element detection logic in PersonalOracleAgent

### Weird Grammar
```
Before: "I understand you're excited."
After: "I feel the spark you're excited."  ❌ Bad grammar
```
→ **Action:** Fix regex pattern (should be "I feel the spark in you")

---

## 📊 **Full Session Summary**

After 10 turns, summarize:

```
=== SESSION SUMMARY ===

FlowTracker Performance:
- Energy progression: opening(3) → building(4) → peak(2) → integrating(1)  ✅
- Depth range: 1-8  ✅
- Strategy variety: 5 different strategies used  ✅

Enhancer Performance:
- Emotional tones detected: 6 different tones  ✅
- Acknowledgments: 7/10 turns  ✅
- Pacing variety: slow(4), moderate(3), fast(3)  ✅

Refiner Performance:
- Elements used: water(4), fire(2), earth(2), air(1), aether(1)  ✅
- Avg transformations: 3.2 per turn  ✅
- Phrases added: 2/10 turns (only when generic)  ✅

Quality Metrics:
- Natural warmth: 9/10 responses  ✅
- Appropriate length: 10/10  ✅
- No therapy-speak: 10/10  ✅
- Weird grammar: 0  ✅
- Lost meaning: 0  ✅

Overall: ✅ SHIP IT / ⚠️ NEEDS TUNING / ❌ ROLLBACK
```

---

## 🔍 **Example: Good Session Log**

```
=== TURN 1 ===
User: "I'm feeling overwhelmed."
Raw: "It sounds like you're feeling overwhelmed. I want to help you..."

FlowTracker: energy:'opening', depth:1, strategy:'reflecting'
Enhancer: tone:'vulnerable', ack:'I hear you', pacing:'slow'
Refiner: element:'water', transforms:4, phrase:'That feeling runs deep'

Final: "I hear you... You're feeling overwhelmed. That feeling runs deep."

✅ Brief, warm, no therapy-speak, good Water resonance

=== TURN 2 ===
User: "Work is crazy and my relationship is struggling."
Raw: "I understand you have multiple stressors..."

FlowTracker: energy:'building', depth:3, strategy:'questioning'
Enhancer: tone:'distressed', ack:'I see', pacing:'moderate'
Refiner: element:'fire', transforms:2, phrase:'none'

Final: "I see both pulling at you. Which one needs attention first?"

✅ Deeper curiosity, brief, practical Fire energy

=== TURN 5 ===
User: "I think I'm just burned out."
Raw: "Burnout is significant. Have you considered..."

FlowTracker: energy:'peak', depth:7, strategy:'witnessing'
Enhancer: tone:'vulnerable', ack:'none', pacing:'slow'
Refiner: element:'earth', transforms:3, phrase:'none'

Final: "Burned out. Feel your feet on the ground for a second."

✅ Direct, grounding, phenomenological (feet), no over-processing
```

---

## 🎯 **What Success Looks Like**

After running 3-5 test conversations:

### ✅ **Green Lights:**
- Energy progresses naturally (Opening → Peak → Integration)
- Depth increases with engagement
- Elements vary (not stuck on Aether)
- Emotional tones detected correctly
- Acknowledgments feel natural
- Transformations reasonable (2-5 per turn)
- Phrases only added when generic
- No weird grammar
- Preserved meaning

### ⚠️ **Yellow Flags (Needs Tuning):**
- Element detection slightly off
- Occasional over-injection of phrases
- Some transformations too aggressive
- Need to adjust thresholds

### ❌ **Red Flags (Rollback):**
- Pipeline not working (all zeros/defaults)
- Responses feel MORE robotic
- Lost emotional nuance
- Grammar errors
- Over-processing making responses flat

---

**Use this guide during your first test sessions to catch issues early!** 🔍✨
