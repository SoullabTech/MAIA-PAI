# MAIA + Intelligence Engine Integration Plan

## Executive Summary

MAIA currently operates with rich personality and wisdom frameworks, but **does NOT use** the sophisticated intelligence systems built today (coherence calculation, signature detection, journey tracking, predictive intelligence, personalized recommendations).

This document outlines the exact integration points to connect MAIA to the UnifiedIntelligenceEngine.

---

## Current MAIA Architecture

### 3-Layer System:

```
1. API Route Layer (app/api/oracle/personal/route.ts)
   ↓
2. Consciousness Layer (lib/consciousness/MAIAUnifiedConsciousness.ts)
   ↓
3. Agent Layer (lib/agents/PersonalOracleAgent.ts)
   ↓
4. LLM Backend (Claude 3.5 Sonnet or GPT-4)
```

### Current Data Flow:

```typescript
// route.ts:118-196
1. Load user from userStore
2. Fetch recent journal entries (last 5)
3. Call maiaConsciousness.process() with:
   - content
   - basic context (userId, sessionId, userName)
   - conversationHistory from journal
4. Get response with element
5. Fetch soulprint for voice tone
6. Return response
```

### What MAIA Currently Uses:
- ✅ User data (userStore)
- ✅ Recent journal entries (last 5)
- ✅ Soulprint (for voice tone)
- ✅ Conversation history
- ✅ Wisdom frameworks (Spiralogic, Elemental Alchemy, etc.)
- ✅ Intellectual Property Engine (Kelly's book)
- ✅ Elemental Oracle 2.0 bridge

### What MAIA Does NOT Use:
- ❌ UnifiedIntelligenceEngine (coherence, signatures, predictions)
- ❌ UserJourneyTracker (spiral progression analysis)
- ❌ ElementalBalanceEngine (sophisticated elemental analysis)
- ❌ FrameworkResonanceLearning (personalized effectiveness data)
- ❌ SignaturePredictionEngine (predictive intelligence)
- ❌ ConversationIntelligenceEngine (pattern detection)

---

## Integration Plan

### Integration Point #1: API Route Layer

**File**: `app/api/oracle/personal/route.ts`

**Location**: After loading user data, before calling consciousness

**Current Code** (lines 155-196):
```typescript
const storedUser = userStore.getUser(requestUserId);
const finalUserName = storedUser?.name || userName;
const recentEntries = journalStorage.getEntries(requestUserId).slice(0, 5);

// Immediately calls consciousness
const consciousnessResponse = await maiaConsciousness!.process({
  content: userInput,
  context: {
    userId: requestUserId,
    sessionId: sessionId || requestUserId,
    userName: userName,
    preferences: preferences
  },
  // ... rest
});
```

**New Code** (INTEGRATION):
```typescript
const storedUser = userStore.getUser(requestUserId);
const finalUserName = storedUser?.name || userName;
const recentEntries = journalStorage.getEntries(requestUserId).slice(0, 5);

// 🧠 NEW: Get complete intelligence analysis
import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';

const intelligence = await unifiedIntelligence.analyze(requestUserId);

console.log('🧠 Intelligence Analysis:', {
  coherence: Math.round(intelligence.coherence.current * 100) + '%',
  signatures: intelligence.signatures.activeSignatures.length,
  journeyStage: intelligence.journey.currentStage,
  topFramework: intelligence.personalization.topFrameworks[0]?.framework
});

// Enhanced consciousness call with intelligence
const consciousnessResponse = await maiaConsciousness!.process({
  content: userInput,
  context: {
    userId: requestUserId,
    sessionId: sessionId || requestUserId,
    userName: userName,
    preferences: preferences,
    // 🧠 NEW: Pass intelligence data
    intelligence: {
      coherence: intelligence.coherence.current,
      coherenceTrend: intelligence.coherence.trend,
      primarySignature: intelligence.signatures.primarySignature,
      journeyStage: intelligence.journey.currentStage,
      spiralDirection: intelligence.journey.spiralDirection,
      predictedOutcome: intelligence.predictions.likelyOutcome,
      interventionWindow: intelligence.predictions.interventionWindow,
      topFrameworks: intelligence.personalization.topFrameworks,
      optimalEntry: intelligence.personalization.optimalEntryPoint
    }
  },
  modality: modality as 'voice' | 'text',
  conversationHistory: recentEntries.map((entry: any) => ({
    role: 'user',
    content: entry.content || ''
  }))
});
```

**Benefits**:
- MAIA consciousness receives complete intelligence before processing
- Can use coherence to inform response depth/tone
- Can reference detected signatures in response
- Can align with predicted trajectory
- Can recommend personalized frameworks

---

### Integration Point #2: PersonalOracleAgent

**File**: `lib/agents/PersonalOracleAgent.ts`

**Location**: In `processInteraction()` method, before building system prompt

**Current Code** (lines 701-850):
```typescript
async processInteraction(input: string, context?: {
  currentMood?: any;
  currentEnergy?: any;
  journalEntries?: StoredJournalEntry[];
  journalContext?: string;
  symbolicContext?: SymbolicContext;
}): Promise<{ response: string; element?: string; metadata?: any }> {

  const journalEntries = context?.journalEntries || [];

  // Safety check
  // Load conversation history
  // Load wisdom frameworks

  // Build system prompt
  // Call Claude/GPT
}
```

**New Code** (INTEGRATION):
```typescript
async processInteraction(input: string, context?: {
  currentMood?: any;
  currentEnergy?: any;
  journalEntries?: StoredJournalEntry[];
  journalContext?: string;
  symbolicContext?: SymbolicContext;
  intelligence?: any; // 🧠 NEW: Intelligence from route
}): Promise<{ response: string; element?: string; metadata?: any }> {

  const journalEntries = context?.journalEntries || [];

  // Safety check...
  // Load conversation history...

  // 🧠 NEW: Get intelligence if not provided
  let intelligence = context?.intelligence;
  if (!intelligence) {
    const { unifiedIntelligence } = await import('@/lib/intelligence/UnifiedIntelligenceEngine');
    const analysis = await unifiedIntelligence.analyze(this.userId);
    intelligence = {
      coherence: analysis.coherence.current,
      coherenceTrend: analysis.coherence.trend,
      primarySignature: analysis.signatures.primarySignature,
      journeyStage: analysis.journey.currentStage,
      spiralDirection: analysis.journey.spiralDirection,
      predictedOutcome: analysis.predictions.likelyOutcome,
      topFrameworks: analysis.personalization.topFrameworks
    };
  }

  // 🧠 NEW: Build intelligence context for prompt
  let intelligenceContext = '';

  if (intelligence.primarySignature) {
    intelligenceContext += `\n## Active Transformation Signature\n`;
    intelligenceContext += `**${intelligence.primarySignature.name}**\n`;
    intelligenceContext += `Confidence: ${Math.round(intelligence.primarySignature.confidence * 100)}%\n`;
    intelligenceContext += `Urgency: ${intelligence.primarySignature.urgency}\n`;
    intelligenceContext += `Frameworks Aligned: ${intelligence.primarySignature.frameworkCount}\n\n`;
  }

  intelligenceContext += `## Journey Intelligence\n`;
  intelligenceContext += `Current Coherence: ${Math.round(intelligence.coherence * 100)}% (${intelligence.coherenceTrend})\n`;
  intelligenceContext += `Journey Stage: ${intelligence.journeyStage}\n`;
  intelligenceContext += `Spiral Direction: ${intelligence.spiralDirection}\n\n`;

  if (intelligence.predictedOutcome) {
    intelligenceContext += `## Predictive Intelligence\n`;
    intelligenceContext += `Likely Outcome: ${intelligence.predictedOutcome}\n`;
    intelligenceContext += `Intervention Window: ${intelligence.interventionWindow}\n\n`;
  }

  if (intelligence.topFrameworks?.length > 0) {
    intelligenceContext += `## Personalized Framework Effectiveness\n`;
    intelligence.topFrameworks.slice(0, 3).forEach((fw: any, i: number) => {
      intelligenceContext += `${i + 1}. ${fw.framework}: ${Math.round(fw.effectiveness * 100)}% effective\n`;
    });
    intelligenceContext += `\nOptimal Entry Point: ${intelligence.optimalEntry}\n\n`;
  }

  // Build system prompt WITH intelligence
  let systemPrompt = PersonalOracleAgent.MAIA_SYSTEM_PROMPT;

  // Add intelligence context
  systemPrompt += `\n---\n${intelligenceContext}---\n`;

  // Add existing context (journal, wisdom, etc.)
  // ...

  // Call Claude/GPT with enriched prompt
}
```

**Benefits**:
- MAIA's responses informed by deep intelligence
- Can reference detected signatures naturally
- Can align guidance with predicted trajectory
- Can recommend frameworks proven effective for this user
- Coherence level informs response depth/tone

---

### Integration Point #3: Consciousness Layer (Optional Enhancement)

**File**: `lib/consciousness/MAIAUnifiedConsciousness.ts`

**Enhancement**: Use intelligence in voice fast path

**Current Code** (lines 317-377):
```typescript
private async processVoiceFastPath(
  input: ConsciousnessInput,
  startTime: number
): Promise<ConsciousnessResponse> {

  const agent = new PersonalOracleAgent(context.userId, {
    conversationStyle: context.preferences?.conversationStyle || 'classic'
  });

  const agentResponse = await agent.processInteraction(content);

  return {
    message: agentResponse.response,
    element: (agentResponse.metadata?.element || 'aether') as Element,
    // ...
  };
}
```

**New Code**:
```typescript
private async processVoiceFastPath(
  input: ConsciousnessInput,
  startTime: number
): Promise<ConsciousnessResponse> {

  const { content, context } = input;

  // 🧠 NEW: Pass intelligence to agent if available
  const agent = new PersonalOracleAgent(context.userId, {
    conversationStyle: context.preferences?.conversationStyle || 'classic'
  });

  const agentResponse = await agent.processInteraction(content, {
    intelligence: context.intelligence // Pass through from route
  });

  return {
    message: agentResponse.response,
    element: (agentResponse.metadata?.element || 'aether') as Element,
    // ...
  };
}
```

---

## Implementation Checklist

### Phase 1: Core Integration
- [ ] Update `app/api/oracle/personal/route.ts`:
  - [ ] Import UnifiedIntelligenceEngine
  - [ ] Call `unifiedIntelligence.analyze(userId)` after loading user data
  - [ ] Pass intelligence to consciousness context
  - [ ] Test with sample user

- [ ] Update `lib/agents/PersonalOracleAgent.ts`:
  - [ ] Add `intelligence?` to processInteraction context parameter
  - [ ] Build intelligenceContext string from intelligence data
  - [ ] Inject intelligenceContext into system prompt
  - [ ] Test response quality with intelligence

### Phase 2: Voice Path Enhancement
- [ ] Update `lib/consciousness/MAIAUnifiedConsciousness.ts`:
  - [ ] Pass intelligence through to agent in voice fast path
  - [ ] Test voice responses use intelligence

### Phase 3: Testing & Validation
- [ ] Test coherence affects response depth
- [ ] Test signatures are referenced in responses
- [ ] Test framework recommendations are personalized
- [ ] Test predictions inform guidance
- [ ] Test journey stage affects tone

### Phase 4: Monitoring Integration
- [ ] Add intelligence data to MAIA response metadata
- [ ] Log intelligence usage in console
- [ ] Track how intelligence affects response quality
- [ ] Monitor coherence correlation with user satisfaction

---

## Example Enhanced MAIA Response

### Without Intelligence:
```
User: "I keep starting projects but never finishing them."

MAIA: "I hear the frustration. What's drawing your attention toward new
beginnings? And what happens when you meet the middle?"
```

### With Intelligence:
```
User: "I keep starting projects but never finishing them."

[Intelligence detects: Nigredo-Rubedo Oscillation signature at 87% confidence]
[Coherence: 45% (descending trend)]
[Top Framework: Shadow Work (72% effective)]

MAIA: "I notice something - you're oscillating between the dark crucible
and the alchemical gold. Fire ignites the vision (your Rubedo), but the
moment it asks you to sit in the uncomfortable middle (Nigredo), you
leap to the next spark.

This isn't scattered energy - it's a PATTERN. Your soul is trying to
teach you something about staying with the heat.

What if the medicine isn't finishing faster, but learning to be with
the mess in the middle?"
```

**Difference**:
- First response is generic active listening
- Second response uses signature detection, references alchemical framework (proven 72% effective for this user), speaks to the underlying pattern with precision

---

## Success Metrics

### Quantitative:
- Coherence correlation with response satisfaction
- Signature detection accuracy in responses
- Framework recommendation adoption rate
- Predicted outcome alignment with actual outcomes

### Qualitative:
- MAIA responses feel more "knowing"
- Users report feeling "truly seen"
- Guidance feels personalized, not generic
- MAIA references specific patterns accurately

---

## Technical Notes

### TypeScript Interface Updates Needed

**Add to** `lib/consciousness/MAIAUnifiedConsciousness.ts`:
```typescript
export interface UserContext {
  userId: string;
  sessionId: string;
  userName?: string;
  journeyStage?: string;
  archetypes?: string[];
  preferences?: any;
  intelligence?: {  // 🧠 NEW
    coherence: number;
    coherenceTrend: 'ascending' | 'descending' | 'stable' | 'oscillating';
    primarySignature?: {
      name: string;
      confidence: number;
      urgency: string;
      frameworkCount: number;
    };
    journeyStage: string;
    spiralDirection: string;
    predictedOutcome?: string;
    interventionWindow?: string;
    topFrameworks: Array<{
      framework: string;
      effectiveness: number;
    }>;
    optimalEntry?: string;
  };
}
```

### Performance Considerations

- Intelligence analysis adds ~200-500ms to request time
- Cache intelligence results for same session (TTL: 5 minutes)
- Use intelligence from context if already analyzed
- Voice fast path can skip detailed intelligence (use cached if available)

### Error Handling

```typescript
try {
  const intelligence = await unifiedIntelligence.analyze(userId);
  // Use intelligence
} catch (error) {
  console.warn('Intelligence analysis failed, continuing without:', error);
  // MAIA still works without intelligence (graceful degradation)
}
```

---

## Next Steps

1. ✅ **Map MAIA integration** ← CURRENT
2. ⏳ **Implement Phase 1** (Core Integration)
3. ⏳ **Test MAIA responses** with intelligence
4. ⏳ **Verify quality improvement** before/after
5. ⏳ **Document MAIA's complete functionality**
6. ⏳ **Create pre-deployment checklist**

---

**Integration Author**: Claude Code Assistant
**Date**: 2025-10-26
**Status**: Ready for Implementation
