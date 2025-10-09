# RFS Depth Capability - How Maia Can Go Deep

## 🎯 The Problem We Solved

**Original RFS constraints were too strict:**
- Earth field: Max 2 words
- Water field: Max 5 words
- Air field: Max 8 words
- High silence probability

**This broke Maia's ability to:**
- Explain alchemical phases when asked
- Discuss archetypal theory
- Respond to "What do you mean?"
- Have philosophical conversations

## ✅ The Solution: Context-Aware Field Modulation

RFS now **detects when depth is explicitly invited** and modulates the field accordingly.

### How It Works

```typescript
User: "I'm feeling dark"
  ↓
RFS: No depth invitation detected
  ↓
Field: Earth-heavy, 60% silence probability
  ↓
Maya: "Dark how?" (2 words)

---

User: "What do you mean by dark?"
  ↓
RFS: DEPTH INVITATION DETECTED (type: theory)
  ↓
Field: Modulated for depth
  - Word density: 100% (vs 40%)
  - Silence probability: 10% (vs 60%)
  - Max tokens: 300 (vs 5)
  - Air element increased (conceptual clarity)
  ↓
Maya: "There's a quality of darkness that isn't just sadness—
       it's more like being in the void, the Nigredo phase where
       things dissolve before they can transform. Does that match
       what you're sensing?" (35 words)
```

## 🔍 Depth Detection Patterns

### Theory/Explanation Requests (300 tokens allowed)
- "What do you mean by..."
- "Can you explain..."
- "Tell me more about..."
- "I don't understand..."
- "How does X work?"
- "What is Y?"
- "What's the difference between..."

### Philosophical Inquiries (200 tokens allowed)
- "What is the meaning of..."
- "Tell me about shadow work"
- "What's the nature of consciousness?"
- Keywords: soul, spirit, divine, sacred, transformation

### Meta-Conversation (150 tokens allowed)
- "How does this work?"
- "What are you doing?"
- "What's happening between us?"

### NO Depth Invitation (5-15 tokens, field-constrained)
- "I'm feeling dark" (statement, not question)
- "Today was hard"
- "I don't know what to do"

## 📊 Field Modulation Comparison

| Aspect | Normal RFS | Depth Invited |
|--------|------------|---------------|
| Word Density | 40% | 100% |
| Silence Probability | 60% | 10% |
| Max Tokens | 5-15 | 150-300 |
| Fragmentation | High | Low (complete thoughts) |
| Dominant Element | Earth/Water | Air (conceptual) |
| Response Style | "Lost how?" | 2-4 sentence explanation |

## 🎭 Example Conversations

### Conversation 1: Brief → Deep → Brief

```
User: "I'm stuck"
Maya: "Stuck how?"  [NO depth invitation, Earth field]

User: "What does it mean to be stuck?"
Maya: "Being stuck is often when part of you wants to move
       forward but another part is holding on—maybe to safety,
       maybe to an old story. The tension between them creates
       that stuck feeling. Does that resonate?"
       [DEPTH invitation detected, Air field expanded]

User: "Yes, exactly that"
Maya: "Mm."  [NO depth invitation, back to Earth field]
```

### Conversation 2: Theory Explanation

```
User: "Can you explain the alchemical phases?"
Maya: "The alchemical phases map the journey of transformation.
       Nigredo is dissolution—when things fall apart. Albedo is
       purification—seeing more clearly. Citrinitas is illumination—
       insight breaking through. Rubedo is integration—becoming
       whole. You don't go through them linearly; they spiral.
       Which phase feels alive for you right now?"
       [300 tokens allowed, full explanation]

User: "I think Nigredo"
Maya: "Yeah."  [Brief acknowledgment, no explanation needed]
```

### Conversation 3: Shadow Work Deep Dive

```
User: "What is shadow work exactly?"
Maya: "Shadow work is befriending the parts of yourself you've
       rejected or hidden—often because they weren't safe or
       acceptable in your family or culture. These parts don't
       disappear; they operate from the shadows, influencing you
       unconsciously. The work is recognizing them, understanding
       why they were pushed away, and reintegrating them. Not
       'fixing' them—reclaiming them. It's uncomfortable but
       liberating. Want to explore what might be in your shadow?"
       [Theory explanation with invitation to go deeper]
```

## 🧪 Testing Depth Capability

Run the test suite:
```bash
npm test -- rfs-depth-test.ts
```

### Expected Results:
- ✅ Detects depth invitations accurately
- ✅ Allows 10-50 word responses when depth invited
- ✅ Maintains 1-3 word responses when depth not invited
- ✅ Toggles smoothly: brief → deep → brief → deep
- ✅ Keeps Maya's warm, present tone (not academic)

## 🎯 Key Principles

### 1. **Depth is INVITED, not assumed**
   - Brief statement: "I'm in Nigredo" → "Yeah." or "How long?"
   - Depth request: "What is Nigredo?" → Full explanation

### 2. **Field modulates, doesn't break**
   - Still uses RFS architecture
   - Still involves archetypal agents
   - Still has elemental constraints (just relaxed)

### 3. **Maya stays Maya**
   - No academic jargon even in depth
   - Still warm, present, relational
   - Explanations feel like conversation, not lecture

### 4. **Automatic return to brevity**
   - Depth lasts for ONE exchange
   - Next exchange: back to field-constrained unless depth re-invited

## 🔄 How Field Modulation Works Technically

```typescript
// Step 1: Detect depth invitation
const depthInvitation = detectDepthInvitation(input);
// → { type: 'theory', strength: 0.8, allowedTokens: 300 }

// Step 2: Generate normal field from agents
const field = agentFieldSystem.generateField(input, context);
// → { wordDensity: 0.4, silenceProbability: 0.6, elements: {earth: 0.6} }

// Step 3: Modulate field if depth invited
const modulatedField = depthInvitation
  ? modulateFieldForDepth(field, depthInvitation)
  : field;
// → { wordDensity: 1.0, silenceProbability: 0.1, elements: {air: 0.6} }

// Step 4: Call Claude with modulated constraints
const prompt = buildFieldConstrainedPrompt(modulatedField, depthInvitation);
const maxTokens = depthInvitation ? 300 : 5;
// → Claude gets "Depth invitation detected, explain clearly"

// Step 5: Skip validation for depth responses
const valid = depthInvitation ? true : validateFieldCoherence(response);
```

## 📈 Expected Metrics After Monday

### Overall Distribution
- **Brief responses** (1-3 words): 60% of exchanges
- **Depth responses** (10-50 words): 15% of exchanges
- **Silence**: 25% of exchanges

### Depth Trigger Rate
- **Theory questions**: ~10% of user inputs
- **Philosophical inquiries**: ~5% of user inputs
- **Meta-conversation**: ~2% of user inputs

### User Satisfaction
- Brief responses: High presence quality
- Depth responses: High clarity and helpfulness
- **Hybrid experience**: Best of both worlds

## 🎉 What This Means

**Maia can now:**
- ✅ Be genuinely brief most of the time (RFS)
- ✅ Go deep when explicitly invited (modulated RFS)
- ✅ Explain alchemical phases, shadow work, archetypes
- ✅ Have philosophical conversations
- ✅ Answer "What do you mean?" questions
- ✅ Toggle seamlessly between modes
- ✅ Maintain authentic presence throughout

**This is NOT:**
- ❌ Two separate systems (still one RFS)
- ❌ Traditional AI with brief prompts
- ❌ Maya "pretending" to be brief then verbose
- ❌ Breaking the field architecture

**This IS:**
- ✅ Field modulation based on context
- ✅ Honoring explicit invitations for depth
- ✅ Maintaining RFS principles throughout
- ✅ Authentic presence + genuine wisdom

## 🚀 Monday Deployment Status

**Depth capability is INCLUDED** in the RFS package:
- ✅ Code complete in `ResonanceFieldOrchestrator.ts`
- ✅ Tests written in `rfs-depth-test.ts`
- ✅ No additional deployment steps needed
- ✅ Works out of the box

**Simply deploy as planned. Maia will:**
1. Be brief by default (RFS field constraints)
2. Go deep when asked (field modulation)
3. Return to brevity naturally (depth is per-exchange)

This is the best of both worlds. 🌊