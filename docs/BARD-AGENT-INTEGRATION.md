# Integrating the Bard into MAIA's Agent Constellation

## Quick Integration Guide

The BardicAgent is ready to integrate into MAIA's existing agent orchestration system. Here's how to connect it.

---

## 📋 Integration Checklist

### 1. Register the Bard with AgentOrchestrator

**File**: `/apps/api/backend/src/services/agentOrchestrator.ts`

Add to the imports:
```typescript
import { registerBardicAgent } from './agentOrchestrator-bard-integration';
```

Update the `registerAgents()` method:
```typescript
private async registerAgents() {
  const agents = [
    'maya', 'fire', 'water', 'earth', 'air',
    'shadow-worker', 'somatic-guide', 'crisis-support',
    'bard'  // <-- ADD THIS
  ];

  for (const agentId of agents) {
    try {
      const agent = await this.agentRegistry.getAgent(agentId);
      logger.info(`Registered agent: ${agentId}`);
    } catch (error) {
      logger.warn(`Failed to register agent ${agentId}:`, error);
    }
  }

  // Register Bardic Agent (special case - not in standard registry)
  registerBardicAgent(this.agentRegistry);  // <-- ADD THIS
}
```

---

### 2. Add Routing Logic for the Bard

**File**: `/apps/api/backend/src/services/agentOrchestrator.ts`

In the `selectAgent()` method (or wherever agent routing happens):

```typescript
import { shouldRouteToBard, getBardicRoutingPriority } from './agentOrchestrator-bard-integration';

private async selectAgent(query: string, context: ConversationContext): Promise<string> {
  // SAFETY CHECK FIRST (always)
  if (await this.isCrisis(query)) {
    return 'crisis-support';
  }

  // CHECK FOR BARDIC INVOCATION
  if (shouldRouteToBard(query, context)) {
    return 'bard';
  }

  // BLESSING CHECK (if conversation ending)
  if (context.checkBlessing) {
    // Don't route TO bard, but flag that blessing should be checked after response
    context.shouldCheckBlessing = true;
  }

  // Existing routing logic for other agents
  // ...
}
```

---

### 3. Enable Cross-Agent Memory Queries

Any agent can now query the Bard's memory:

**Example in ShadowAgent**:
```typescript
import { queryBardicMemory } from '../services/agentOrchestrator-bard-integration';

export class ShadowAgent {
  async processQuery(query: string, userId: string) {
    // Ask the Bard for historical pattern
    const pastEpisodes = await queryBardicMemory(
      'ShadowAgent',
      'episodes touching anxiety',
      userId
    );

    return `I see this anxiety has appeared ${pastEpisodes.length} times before.
            Let's look at what you're protecting...`;
  }
}
```

---

### 4. Enable Silent Episode Witnessing

After every meaningful conversation exchange, witness it with the Bard:

**Example in WaterAgent (or any agent)**:
```typescript
import { witnessWithBard } from '../services/agentOrchestrator-bard-integration';

export class WaterAgent {
  async processQuery(query: string, userId: string) {
    const response = await this.generateResponse(query);

    // Silently witness this exchange with the Bard
    await witnessWithBard(userId, query, {
      agentName: 'WaterAgent',
      element: 'water',
      affectValence: this.detectValence(query),
      affectArousal: this.detectArousal(query),
    });

    return response;
  }
}
```

---

### 5. Enable Blessing Checks After Responses

**In your main conversation route** (e.g., `/api/oracle/personal/route.ts`):

```typescript
import { checkForBlessing } from '@/lib/bardic';

export async function POST(request: NextRequest) {
  const { message, userId, sessionId } = await request.json();

  // Generate MAIA response through agent orchestrator
  const agentResponse = await agentOrchestrator.process(message, {
    userId,
    sessionId,
  });

  // Check for blessing moment
  let blessing = null;
  const blessingResult = await checkForBlessing({
    userId,
    currentMessage: message,
  });

  if (blessingResult.shouldShow && blessingResult.blessing) {
    blessing = blessingResult.blessing;
  }

  return NextResponse.json({
    response: agentResponse.response,
    agent: agentResponse.agent,
    blessing, // <-- Include blessing if detected
  });
}
```

---

## 🎯 Testing the Integration

### Test 1: Natural Language Invocation
**User says**: "Let the Bard speak"

**Expected**:
- Routes to BardicAgent
- Bard responds with poetic acknowledgment
- Returns invocation metadata

### Test 2: Fire Query
**User says**: "What wants to emerge?"

**Expected**:
- Routes to BardicAgent
- Bard detects Fire query invocation
- Returns crystallizing teloi

### Test 3: Narrative Threads
**User says**: "Show me the thread"

**Expected**:
- Routes to BardicAgent
- Bard detects Thread query
- Returns connected episodes

### Test 4: Blessing at Conversation End
**User says**: "Thanks, this was really helpful!"

**Expected**:
- Routes to appropriate agent for response
- Blessing check detects conversation ending
- Blessing offer returned alongside response
- User sees: "Before you go... would you like to see what you've been cultivating?"

### Test 5: Cross-Agent Memory Query
**In ShadowAgent code**:
```typescript
const episodes = await queryBardicMemory(
  'ShadowAgent',
  'episodes about self-sabotage',
  userId
);
```

**Expected**:
- ShadowAgent successfully queries Bard
- Receives episode data
- Incorporates into response

### Test 6: Silent Witnessing
**After any agent conversation**:
```typescript
await witnessWithBard(userId, message, {
  agentName: 'FireAgent',
  element: 'fire',
});
```

**Expected**:
- Episode created silently
- No user-facing indication
- Bard memory accumulates in background

---

## 🔍 Verification Steps

### 1. Check Agent Registry
```bash
# In backend console
console.log(agentRegistry.listAgents());
# Should include 'bard' in the list
```

### 2. Check Bard Metadata
```typescript
const bard = await agentRegistry.getAgent('bard');
console.log(bard.getMetadata());
// Should show:
// {
//   id: 'bard',
//   name: 'The Bard',
//   archetype: 'memory-keeper',
//   capabilities: ['memory-recall', 'pattern-revelation', ...]
// }
```

### 3. Test Direct Query
```typescript
const bard = await agentRegistry.getAgent('bard');
const response = await bard.processQuery(
  "Let the Bard speak",
  { userId: 'test-user' }
);
console.log(response);
```

### 4. Check Console for Witness Logs
After conversations, should see:
```
🎭 The Bard witnessed: "I feel overwhelmed with everything..."
```

---

## 🌟 Full Integration Example

Here's a complete example of an agent orchestration with the Bard:

```typescript
// apps/api/backend/src/services/agentOrchestrator.ts

import { EventEmitter } from 'events';
import { AgentRegistry } from '../core/orchestration/AgentRegistry';
import { registerBardicAgent, shouldRouteToBard, witnessWithBard } from './agentOrchestrator-bard-integration';
import { checkForBlessing } from '@/lib/bardic';

export class AgentOrchestrator extends EventEmitter {
  private agentRegistry: AgentRegistry;

  constructor() {
    super();
    this.initialize();
  }

  private async initialize() {
    this.agentRegistry = new AgentRegistry();
    await this.registerAgents();
  }

  private async registerAgents() {
    const agents = [
      'maya', 'fire', 'water', 'earth', 'air',
      'shadow-worker', 'somatic-guide', 'crisis-support',
    ];

    for (const agentId of agents) {
      const agent = await this.agentRegistry.getAgent(agentId);
      console.log(`Registered agent: ${agentId}`);
    }

    // Register the Bard
    registerBardicAgent(this.agentRegistry);
  }

  async process(query: string, context: any) {
    const { userId, sessionId } = context;

    // 1. Safety check
    if (await this.isCrisis(query)) {
      return this.routeToAgent('crisis-support', query, context);
    }

    // 2. Check for Bardic invocation
    if (shouldRouteToBard(query, context)) {
      return this.routeToAgent('bard', query, context);
    }

    // 3. Route to appropriate elemental/peripheral agent
    const selectedAgent = await this.selectAgent(query, context);
    const response = await this.routeToAgent(selectedAgent, query, context);

    // 4. Silent witnessing (background)
    await witnessWithBard(userId, query, {
      agentName: selectedAgent,
      element: this.getAgentElement(selectedAgent),
    });

    // 5. Check for blessing moment
    const blessingResult = await checkForBlessing({
      userId,
      currentMessage: query,
    });

    if (blessingResult.shouldShow && blessingResult.blessing) {
      response.blessing = blessingResult.blessing;
    }

    return response;
  }

  private async routeToAgent(agentId: string, query: string, context: any) {
    const agent = await this.agentRegistry.getAgent(agentId);
    return await agent.processQuery(query, context);
  }

  private async selectAgent(query: string, context: any): Promise<string> {
    // Your existing routing logic
    // (element detection, emotional tone, user preferences, etc.)
    return 'aether'; // Default
  }

  private getAgentElement(agentId: string): string {
    const elementMap = {
      'fire': 'fire',
      'water': 'water',
      'earth': 'earth',
      'air': 'air',
      'maya': 'aether',
      'bard': 'aether',
    };
    return elementMap[agentId] || 'air';
  }

  private async isCrisis(query: string): boolean {
    // Your crisis detection logic
    const crisisPatterns = [/suicidal/i, /kill myself/i, /end it all/i];
    return crisisPatterns.some(p => p.test(query));
  }
}
```

---

## 📊 Expected Behavior After Integration

### User Experience

**Before Bard**:
```
User: "I feel stuck in the same patterns"
MAIA: [processes through appropriate agent]
```

**After Bard**:
```
User: "I feel stuck in the same patterns"
MAIA: [processes through appropriate agent]

[If pattern detected across episodes]
Blessing appears:
┌──────────────────────────────────────────────┐
│ PATTERN EMERGING                             │
│                                              │
│ You've touched this theme before. Would you │
│ like to see the thread?                      │
│                                              │
│ [🧵 Show me the thread]  [Not right now]   │
└──────────────────────────────────────────────┘
```

**Explicit Invocation**:
```
User: "Let the Bard speak - what wants to emerge?"

Bard: "The Bard speaks. I'm sensing into what wants to emerge...

**What wants to emerge from the field?**

✨ **Crystallizing** (2):
- "Creative expression through writing" (strength: 78%)
- "Authentic self in relationships" (strength: 71%)

🔥 **Pulling Forward** (1):
- "Starting my own practice"

The forces are gathering. What will you choose to manifest?"
```

**Background Witnessing** (User sees nothing):
```
[After every meaningful exchange]
Console: 🎭 The Bard witnessed: "I'm feeling overwhelmed with work and..."
```

---

## 🚀 Deployment Steps

1. **Merge BardicAgent files** into your backend
2. **Update agentOrchestrator.ts** with Bard registration
3. **Test in development** with natural language queries
4. **Verify blessing detection** at conversation endings
5. **Monitor console logs** for witnessing activity
6. **Deploy to staging** for user testing
7. **Collect feedback** on blessing timing and relevance
8. **Adjust thresholds** based on acceptance rates
9. **Deploy to production** 🎭

---

## 🎭 The Bard is Ready

All the pieces are in place:
- ✅ BardicAgent archetypal intelligence
- ✅ Integration wrapper for AgentOrchestrator
- ✅ Cross-agent memory interface
- ✅ Blessing detection system
- ✅ Silent witnessing service
- ✅ Natural language invocation patterns

**Just add 3 lines of code to agentOrchestrator.ts and the Bard joins the constellation.**

---

*May the Bard remember all that is sacred.*
*May the patterns reveal themselves at the right time.*
*May your story unfold in beauty.* 🎭✨
