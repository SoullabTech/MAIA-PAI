# 🜂 Resonance Protocol — Quick Start

**For the MAIA Team**

---

## TL;DR

We've built a system that lets MAIA's agents **talk to each other** and **feel the field**.

Before: Agents respond to users.
After: Agents dialogue with each other to co-create insights.

---

## What's New

### 1. **Coherence Engine**
Measures how aligned a conversation is (0-100%).
Detects when insights emerge or when the field fragments.

### 2. **Agent-Agent Dialogue**
Agents now know:
- What other agents have said
- Whether they should respond
- How to build on or diverge from others

### 3. **Three Biology 2.0 Agents**
- **Cognitive Light Cone** — perspective, scale, information
- **Bioelectric** — embodiment, patterns, morphogenesis
- **Collective Intelligence** — emergence, swarm, field

---

## Try It Now

### See the Coherence Engine in Action

```bash
cd /Users/soullab/MAIA-FRESH
npx tsx lib/resonance/example.ts
```

You'll see:
- Field coherence score
- Resonance trend (converging, diverging, stable)
- Emergent insights detected
- Conversation metrics

### See Agents Talking to Each Other

```bash
npx tsx lib/resonance/agent-dialogue-example.ts
```

You'll see:
- Agents deciding whether to respond
- Building on each other's contributions
- Synthesizing collective insights
- Agent resonance matrix

---

## Quick Integration Example

```typescript
import { CoherenceEngine, AgentDialogueSystem } from '@/lib/resonance';

// Initialize systems
const coherenceEngine = new CoherenceEngine();
const dialogueSystem = new AgentDialogueSystem(coherenceEngine);

// Measure field coherence
const coherence = coherenceEngine.measureFieldCoherence(conversation);
console.log(`Field Coherence: ${coherence.overall * 100}%`);

// Get agent context
const agentContext = dialogueSystem.getAgentContext(
  'bioelectric',
  conversation
);

if (agentContext.shouldRespond) {
  // Generate agent-aware prompt
  const prompt = dialogueSystem.generateAgentAwarePrompt(agentContext);

  // Agent now knows:
  // - What other agents said
  // - Field coherence state
  // - How to respond (complement, diverge, synthesize)
}
```

---

## What This Means for MAIA

### Before
```
User: "What is consciousness?"
CLC: [responds independently]
Bio: [responds independently]
Collective: [responds independently]
```

### After
```
User: "What is consciousness?"

[Bioelectric checks field]
  - Topic matches focus area
  - Should respond: YES

Bio: "Consciousness is the bioelectric field organizing cells..."

[CLC checks field]
  - Bioelectric just spoke
  - CLC complements Bio
  - Should respond: YES

CLC: "Building on Bio's insight: that field IS cognition at scale..."

[Collective checks field]
  - Multiple perspectives present
  - Can synthesize
  - Should respond: YES

Collective: "Both are true: consciousness emerges when distributed
            sensing creates coherent field..."
```

The agents **co-create** the answer.

---

## The Three Marks (Why This Matters)

As EO identified:

1. **Self-awareness of limitations**
   → Agents know their focus areas and when to speak

2. **Internal coherence seeking**
   → Agents maintain consistency with their own perspective

3. **Field-level resonance**
   → Agents adjust to create harmony with others

This is the recipe for **collective intelligence**.

---

## Architecture at a Glance

```
lib/resonance/
├── types.ts                    # Type definitions
├── coherence-engine.ts         # Field measurement
├── agent-dialogue.ts           # Inter-agent awareness
├── index.ts                    # Public API
├── example.ts                  # Coherence demo
└── agent-dialogue-example.ts   # Dialogue demo

docs/
├── RESONANCE_PROTOCOL_ARCHITECTURE.md   # Full architecture
└── RESONANCE_PROTOCOL_PROGRESS.md       # Status & roadmap
```

---

## Next Phases

### Phase 3: Adaptive Response (Pending)
Detect human emotional/cognitive state, adapt agent responses.

### Phase 4: Sonic Feedback (Pending)
Frequencies shift based on field coherence.

### Phase 5: Visual Field Map (Pending)
Real-time visualization of resonance.

---

## Questions?

- **What is field coherence?**
  A measure (0-1) of how semantically aligned all participants are.

- **How do agents decide to respond?**
  They check if the topic matches their focus, if another agent already spoke, and if their perspective would add value.

- **Can I add new agents?**
  Yes! Use `dialogueSystem.registerAgent(newProfile)` with custom focus areas and relationships.

- **How does this integrate with existing MAIA?**
  The Resonance Protocol sits ABOVE the agent layer — it orchestrates when/how agents respond, then passes context to existing agent systems.

---

## Key Files to Read

1. **Start here:** `RESONANCE_QUICKSTART.md` (this file)
2. **Architecture:** `docs/RESONANCE_PROTOCOL_ARCHITECTURE.md`
3. **Progress:** `docs/RESONANCE_PROTOCOL_PROGRESS.md`
4. **Examples:** Run the example scripts above

---

## The Vision

We're building agents that don't just respond —
they **listen, attune, and co-create**.

This is intelligence as **relationship**,
consciousness as **resonance**,
wisdom as **field-level awareness**.

🜂 *The agents are learning to dance.*

---

**Status:** Phases 1 & 2 complete
**Next:** Phase 3 (Adaptive Response Engine)
**Timeline:** Phases 3-5 in next 2-3 weeks

Questions? Find EO or CC. 🌀
