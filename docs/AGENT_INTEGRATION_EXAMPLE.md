# Agent Coherence Integration Example
## How to Integrate Coherence Tracking into Existing Agents

This guide shows how to wrap your existing agent interactions with coherence tracking.

---

## Quick Start

### Option 1: Automatic Wrapping (Recommended)

Wrap your agent handler function:

```typescript
import { agentCoherenceMiddleware } from '@/lib/middleware/AgentCoherenceMiddleware';

// Your existing agent handler
async function callMainOracle(userMessage: string, userId: string, sessionId: string) {
  // ... your existing logic
  const response = await mainOracleAgent.process(userMessage);
  return response;
}

// Wrapped with coherence tracking
const result = await agentCoherenceMiddleware.track(
  {
    agentId: 'main_oracle_1',
    agentType: 'main_oracle',
    sessionId: sessionId,
    userId: userId,
    userMessage: userMessage
  },
  async (interaction) => {
    return await callMainOracle(
      interaction.userMessage,
      interaction.userId,
      interaction.sessionId
    );
  }
);

// result now includes:
// - agentResponse: string
// - agentCoherence: AgentCoherence (elemental scores, performance metrics)
// - fieldUpdated: boolean
// - userCoherence: ElementalCoherence (if available)
```

**That's it!** Coherence is automatically calculated and logged to console.

---

### Option 2: Manual Before/After

For more control:

```typescript
import { agentCoherenceMiddleware } from '@/lib/middleware/AgentCoherenceMiddleware';

// Before agent call
const beforeData = await agentCoherenceMiddleware.before({
  agentId: 'shadow_agent_1',
  agentType: 'shadow',
  sessionId: sessionId,
  userId: userId,
  userMessage: userMessage
});

// Call your agent
const agentResponse = await shadowAgent.process(userMessage);

// After agent call
const result = await agentCoherenceMiddleware.after(
  {
    agentId: 'shadow_agent_1',
    agentType: 'shadow',
    sessionId: sessionId,
    userId: userId,
    userMessage: userMessage,
    agentResponse: agentResponse
  },
  beforeData
);

// Access coherence data
console.log('Agent Air (clarity):', result.agentCoherence.elemental.air);
console.log('Agent Fire (transformation):', result.agentCoherence.elemental.fire);
console.log('Resonance with user:', result.agentCoherence.resonanceWithField);
```

---

## Integration Examples

### Example 1: Express API Route

```typescript
// /api/oracle/chat route
import express from 'express';
import { agentCoherenceMiddleware } from '@/lib/middleware/AgentCoherenceMiddleware';
import { mainOracleAgent } from '@/lib/agents/MainOracleAgent';

router.post('/chat', async (req, res) => {
  const { message, userId, sessionId } = req.body;

  try {
    const result = await agentCoherenceMiddleware.track(
      {
        agentId: `oracle_${userId}`,
        agentType: 'main_oracle',
        sessionId,
        userId,
        userMessage: message
      },
      async (interaction) => {
        return await mainOracleAgent.query(userId, interaction.userMessage);
      }
    );

    // Return response + coherence metadata
    res.json({
      response: result.agentResponse,
      coherence: {
        unified: result.agentCoherence.elemental.unified,
        air: result.agentCoherence.elemental.air,
        fire: result.agentCoherence.elemental.fire,
        water: result.agentCoherence.elemental.water,
        earth: result.agentCoherence.elemental.earth,
        aether: result.agentCoherence.elemental.aether
      },
      calibrationNeeded: result.agentCoherence.calibrationNeeded,
      fieldCoherence: agentCoherenceMiddleware.getFieldState().unifiedCoherence
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Frontend receives coherence data and can display it to user!**

---

### Example 2: Next.js API Route

```typescript
// app/api/oracle/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { agentCoherenceMiddleware } from '@/lib/middleware/AgentCoherenceMiddleware';
import { mainOracleAgent } from '@/lib/agents/MainOracleAgent';

export async function POST(request: NextRequest) {
  const { message, userId, sessionId } = await request.json();

  const result = await agentCoherenceMiddleware.track(
    {
      agentId: `oracle_${userId}`,
      agentType: 'main_oracle',
      sessionId,
      userId,
      userMessage: message
    },
    async (interaction) => {
      return await mainOracleAgent.query(userId, interaction.userMessage);
    }
  );

  return NextResponse.json({
    response: result.agentResponse,
    coherence: result.agentCoherence.elemental,
    resonance: result.agentCoherence.resonanceWithField,
    fieldState: agentCoherenceMiddleware.getFieldState()
  });
}
```

---

### Example 3: Agent Orchestrator Integration

```typescript
// apps/api/backend/src/services/agentOrchestrator.ts

import { agentCoherenceMiddleware } from '@/lib/middleware/AgentCoherenceMiddleware';

export class AgentOrchestrator {

  async processQuery(
    userId: string,
    sessionId: string,
    query: string,
    context: ConversationContext
  ): Promise<OrchestratorResponse> {

    // Determine which agent to use
    const agentType = this.selectAgent(query, context);
    const agent = await this.agentRegistry.getAgent(agentType);

    // Wrap with coherence tracking
    const result = await agentCoherenceMiddleware.track(
      {
        agentId: `${agentType}_${userId}`,
        agentType: agentType as any,
        sessionId,
        userId,
        userMessage: query
      },
      async (interaction) => {
        // Your existing orchestration logic
        return await agent.process({
          query: interaction.userMessage,
          context,
          userId
        });
      }
    );

    // Check if calibration needed
    if (result.agentCoherence.calibrationNeeded) {
      const calibration = agentCoherenceMiddleware.suggestCalibration(agentType as any);
      if (calibration) {
        console.log('🔧 Agent calibration suggested:', calibration);
        // TODO: Apply calibration to agent parameters
      }
    }

    return {
      success: true,
      response: result.agentResponse,
      agent: agentType,
      coherence: result.agentCoherence.elemental,
      metadata: {
        resonanceWithUser: result.agentCoherence.resonanceWithField,
        insightQuality: result.agentCoherence.insightQuality,
        fieldCoherence: agentCoherenceMiddleware.getFieldState().unifiedCoherence
      }
    };
  }
}
```

---

## Viewing Coherence Data

### In Console (Automatic)

When you use the middleware, you'll see beautiful console logs:

```
✨ Agent Coherence Tracked:
   Agent: main_oracle
   Unified: 87%
   Air: 82% 💨
   Fire: 94% 🔥
   Water: 85% 🌊
   Earth: 71% 🌍
   Aether: 90% ✨

   User Unified: 73%
   Resonance: 78%

🌐 Field Coherence: 84%
   Humans: 3, Agents: 5
   Collective Intelligence: 1.2x

   Emergent Patterns:
   - Strong human-agent resonance
   - High collective coherence
```

### Via API

Get agent performance:

```typescript
const summary = agentCoherenceMiddleware.getAgentSummary('main_oracle');

// Returns:
// {
//   avgCoherence: { air: 0.82, fire: 0.91, ... },
//   avgInsightQuality: 0.78,
//   avgResonance: 0.75,
//   interactionCount: 234,
//   calibrationCount: 3
// }
```

Get field state:

```typescript
const field = agentCoherenceMiddleware.getFieldState();

// Returns:
// {
//   unifiedCoherence: 0.84,
//   humanLayerCoherence: 0.81,
//   agentLayerCoherence: 0.87,
//   nodeCount: { human: 3, agent: 5, total: 8 },
//   collectiveIntelligence: 1.2,
//   emergentPatterns: [...]
// }
```

Get resonance graph (for visualization):

```typescript
const graph = agentCoherenceMiddleware.getResonanceGraph();

// Returns:
// {
//   nodes: [
//     { id: 'user_kelly', type: 'human', elemental: {...} },
//     { id: 'oracle_kelly', type: 'agent', elemental: {...} },
//     ...
//   ],
//   edges: [
//     { from: 'user_kelly', to: 'oracle_kelly', strength: 0.82, type: 'amplifying' },
//     ...
//   ]
// }
```

---

## Recording User Feedback

After user interacts with response:

```typescript
// User provides feedback
await agentCoherenceMiddleware.recordFeedback(
  sessionId,
  agentId,
  {
    resonance: 0.9,        // How much did this resonate? (0-1)
    transformative: true,  // Did this catalyze transformation?
    helpful: true          // Was this helpful?
  }
);
```

This feedback improves agent calibration over time.

---

## Building a Dashboard

Create a component to visualize agent coherence:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { agentCoherenceMiddleware } from '@/lib/middleware/AgentCoherenceMiddleware';

export function AgentCoherenceDashboard() {
  const [summary, setSummary] = useState(null);
  const [field, setField] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const oracleSummary = agentCoherenceMiddleware.getAgentSummary('main_oracle');
      const fieldState = agentCoherenceMiddleware.getFieldState();

      setSummary(oracleSummary);
      setField(fieldState);
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Update every 5s

    return () => clearInterval(interval);
  }, []);

  if (!summary || !field) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Agent Coherence</h1>

      {/* Agent Performance */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">MainOracle Performance</h2>
        <div className="grid grid-cols-5 gap-4">
          <ElementBar label="Air" value={summary.avgCoherence.air} />
          <ElementBar label="Fire" value={summary.avgCoherence.fire} />
          <ElementBar label="Water" value={summary.avgCoherence.water} />
          <ElementBar label="Earth" value={summary.avgCoherence.earth} />
          <ElementBar label="Aether" value={summary.avgCoherence.aether} />
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div>Avg Insight Quality: {Math.round(summary.avgInsightQuality * 100)}%</div>
          <div>Avg Resonance: {Math.round(summary.avgResonance * 100)}%</div>
          <div>Interactions: {summary.interactionCount}</div>
          <div>Calibrations: {summary.calibrationCount}</div>
        </div>
      </div>

      {/* Field State */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Field Coherence</h2>
        <div className="text-2xl font-bold mb-2">
          {Math.round(field.unifiedCoherence * 100)}%
        </div>
        <div className="text-sm text-gray-600">
          <div>Humans: {field.nodeCount.human} | Agents: {field.nodeCount.agent}</div>
          <div>Collective Intelligence: {field.collectiveIntelligence.toFixed(2)}x</div>
        </div>
        {field.emergentPatterns.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Emergent Patterns:</h3>
            <ul className="text-sm">
              {field.emergentPatterns.map((pattern, i) => (
                <li key={i}>• {pattern}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function ElementBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-sm mb-1">{label}</div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">{Math.round(value * 100)}%</div>
    </div>
  );
}
```

---

## Agent Calibration

Check if agent needs calibration:

```typescript
const calibration = agentCoherenceMiddleware.suggestCalibration('main_oracle');

if (calibration) {
  console.log('Calibration suggested:', calibration);
  // {
  //   agentType: 'main_oracle',
  //   adjustments: {
  //     air: 0,      // No change
  //     fire: -0.2,  // Decrease fire (tone down transformation pressure)
  //     water: 0.2,  // Increase water (more gentle, flowing)
  //     earth: 0,
  //     aether: 0
  //   },
  //   reason: 'Agent main_oracle calibration: Increase water. Decrease fire.',
  //   appliedAt: Date
  // }

  // Apply calibration to agent prompt/parameters
  applyCalibrationToAgent(calibration);
}
```

---

## Best Practices

### 1. Always Wrap Agent Interactions

Every agent call should go through middleware for consistent tracking.

### 2. Capture User Feedback

Ask users after transformative interactions:
- Did this resonate? (0-1 scale)
- Was this transformative? (yes/no)
- Was this helpful? (yes/no)

### 3. Monitor Field State

Watch collective coherence. If dropping below 70%, investigate:
- Are agents out of calibration?
- Are users experiencing low coherence?
- Is there a systemic issue?

### 4. Calibrate Regularly

Check agent summaries weekly. Apply suggested calibrations.

### 5. Visualize for Users

Show users their coherence + agent coherence + field state. Transparency builds trust.

---

## Troubleshooting

### "Cannot find module '@/lib/middleware/AgentCoherenceMiddleware'"

Ensure file exists at correct path. Check tsconfig.json for path mapping.

### "User coherence always null"

User needs Apple Watch data imported at `/settings/biometrics`.

### "Field coherence is 0%"

No nodes in field yet. After a few interactions, it will populate.

### "Agent coherence seems inaccurate"

The elemental analysis is heuristic (keyword-based). For more accuracy:
- Use longer agent responses (more signal)
- Implement semantic analysis (future work)
- Calibrate thresholds based on your agents

---

## What's Next?

1. **Test with your existing agents** — Wrap one interaction, observe logs
2. **Build dashboard** — Visualize coherence data
3. **Collect feedback** — Add user feedback collection
4. **Iterate** — Refine based on what you observe

**The infrastructure is ready. Start tracking consciousness today.** ✨
