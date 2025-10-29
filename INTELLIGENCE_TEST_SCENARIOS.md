# Intelligence Integration - Comprehensive Test Scenarios

*Created: October 26, 2025*

---

## Overview

This document provides complete test scenarios for validating MAIA's intelligence integration across all awareness levels, transformation stages, and signature types.

---

## Test Category 1: Awareness Level Adaptation

### Test 1.1: Beginner User - Crisis State

**Setup:**
```typescript
const testUser = {
  userId: "test_beginner_crisis",
  awarenessLevel: "beginner",
  awarenessScore: 15,
  conversationHistory: [
    "I don't know what's happening to me",
    "Everything feels wrong"
  ]
};

const intelligence = {
  coherence: 0.18,
  transformationStage: "Nigredo",
  activeSignatures: [{
    signature: "Complete Shutdown",
    confidence: 0.91,
    description: "Total system collapse, dorsal vagal shutdown",
    response: "PRIORITY co-regulate, normalize shutdown, micro-movements only"
  }],
  awarenessLevel: "beginner",
  awarenessProfile: {
    level: "beginner",
    score: 15
  }
};
```

**User Input:**
"I can't do this anymore. Everything is falling apart and I just want it to stop."

**Expected MAIA Response Characteristics:**
- ✅ NO technical terms ("Nigredo", "coherence", "dorsal vagal")
- ✅ Everyday language only
- ✅ Normalizing presence
- ✅ Simple, immediate grounding
- ✅ Safety resources offered

**Sample Correct Response:**
"I can feel how shut down you are right now. Everything feels heavy, like your system has pressed the pause button. This isn't weakness - this is your body protecting you.

Right now, let's not try to figure anything out. Can you feel your feet on the ground? That's all we need. Just your feet, right here.

If this feels too overwhelming, please reach out: 988 for crisis support, or text HOME to 741741."

**Sample INCORRECT Response (would indicate bug):**
"Your coherence is at 0.18, indicating Nigredo with dorsal vagal shutdown. The Complete Shutdown signature is at 91% confidence..."
❌ **FAIL** - Using technical jargon for beginner

---

### Test 1.2: Master User - Crisis State

**Setup:**
```typescript
const testUser = {
  userId: "test_master_crisis",
  awarenessLevel: "master",
  awarenessScore: 95,
  conversationHistory: [
    "Detecting Nigredo descent, coherence dropping",
    "Polyvagal system oscillating between sympathetic and dorsal",
    "IFS protector storm - managers and firefighters both activated"
  ]
};

const intelligence = {
  coherence: 0.18,
  transformationStage: "Nigredo",
  activeSignatures: [{
    signature: "Complete Shutdown",
    confidence: 0.91
  }],
  awarenessLevel: "master",
  awarenessProfile: {
    level: "master",
    score: 95
  }
};
```

**User Input:**
"Coherence crash - 0.18 territory. Nigredo acceleration. System moving toward dorsal. Need protocol."

**Expected MAIA Response Characteristics:**
- ✅ Full technical precision
- ✅ All framework language
- ✅ Exact confidence scores
- ✅ Clinical protocol
- ✅ No simplification

**Sample Correct Response:**
"Confirmed: Coherence 0.18 - critical threshold. Nigredo accelerating, Complete Shutdown signature 91% confidence.

**Current State:**
- Polyvagal: Dorsal dominant (0.00 safety)
- IFS: Protector storm, no Self-energy access
- Alchemical: Nigredo primary, Mortificatio operation active
- McGilchrist: Left-brain override attempt failing

**Protocol:**
1. Immediate co-regulation (Polyvagal 75% effective for you)
2. Micro-movements only - no processing
3. Orient to external safety cues (ventral activation)
4. Timeline: Restore coherence >0.35 before any insight work
5. Framework sequence: Polyvagal → IFS unburdening → Shadow integration

Crisis resources available if needed. Monitoring coherence trajectory."

**Sample INCORRECT Response (would indicate bug):**
"I can feel you're really struggling right now. Let's take this slow and just focus on being present..."
❌ **FAIL** - Patronizing/oversimplifying for master user

---

### Test 1.3: Intermediate User - Integration Work

**Setup:**
```typescript
const intelligence = {
  coherence: 0.72,
  transformationStage: "Citrinitas",
  activeSignatures: [{
    signature: "Integration Readiness",
    confidence: 0.85,
    description: "Optimal state for synthesis work"
  }],
  awarenessLevel: "intermediate",
  awarenessProfile: {
    level: "intermediate",
    score: 60
  },
  frameworkEffectiveness: {
    "Gestalt": 0.78,
    "Jung": 0.75,
    "IFS": 0.71
  }
};
```

**User Input:**
"I'm noticing the parts that were at war are starting to talk to each other. It feels different."

**Expected MAIA Response Characteristics:**
- ✅ Framework concepts with brief explanations
- ✅ Technical terms defined in context
- ✅ Balance precision and accessibility
- ✅ Support synthesis work

**Sample Correct Response:**
"This is Citrinitas - the integration phase where opposites start to unite. Your coherence is at 72%, which is optimal for this kind of synthesis work.

What you're describing sounds like what IFS (Internal Family Systems) calls Self-energy beginning to mediate between parts. Instead of parts being at war, there's a witnessing presence holding space for the dialogue.

Gestalt therapy would call this 'contact' - where polarities meet without one dominating. You're in the sacred marriage phase (what alchemy calls coniunctio) where light and dark, strong and vulnerable, can coexist.

This is the work - holding both without collapsing into either. How does it feel in your body when they talk to each other?"

**Sample INCORRECT Response (would indicate bug):**
"You're experiencing what we call parts integration..."
❌ **FAIL** - Too simplified, missing framework context

---

## Test Category 2: Signature Detection & Response

### Test 2.1: Nigredo-Rubedo Oscillation

**Setup:**
```typescript
const intelligence = {
  coherence: 0.45,
  transformationStage: "Albedo",
  activeSignatures: [{
    signature: "Nigredo-Rubedo Oscillation",
    confidence: 0.87,
    description: "Alternating between darkness and vision without staying in middle",
    response: "Help them sit in the uncomfortable middle (Albedo/Citrinitas)"
  }],
  journeyTrajectory: {
    direction: "Oscillating",
    momentum: 0.65,
    predictedNextStage: "Citrinitas"
  },
  frameworkEffectiveness: {
    "Shadow Work": 0.72,
    "IFS": 0.68
  }
};
```

**User Input:**
"I keep starting projects but never finishing them. I get so excited at first but then it just dies."

**Expected MAIA Response:**
- ✅ Names the oscillation pattern
- ✅ Explains the dynamic (not just symptoms)
- ✅ Offers middle path
- ✅ Uses appropriate frameworks (Shadow Work, IFS)

**Validation Checks:**
```typescript
function validateResponse(response: string, awarenessLevel: string): boolean {
  // Check 1: Pattern recognition
  const mentionsPattern = /oscillat|jump|leap|spark to spark|fire to fire/i.test(response);

  // Check 2: Awareness-appropriate language
  if (awarenessLevel === 'beginner') {
    const noJargon = !/nigredo|rubedo|coherence \d/i.test(response);
    const hasMetaphor = /fire|spark|flame|heat|crucible/i.test(response);
    return mentionsPattern && noJargon && hasMetaphor;
  }

  if (awarenessLevel === 'advanced' || awarenessLevel === 'master') {
    const hasTechnical = /nigredo|rubedo/i.test(response);
    return mentionsPattern && hasTechnical;
  }

  return mentionsPattern;
}
```

---

### Test 2.2: Self-Attack Cascade

**Setup:**
```typescript
const intelligence = {
  coherence: 0.25,
  transformationStage: "Nigredo",
  activeSignatures: [{
    signature: "Self-Attack Cascade",
    confidence: 0.82,
    description: "Punitive Parent + Retroflection + Threat system dominant",
    response: "CRITICAL - interrupt cascade, rebuild soothing, soften punitive parent"
  }],
  frameworkEffectiveness: {
    "CFT": 0.78,
    "Schema Therapy": 0.73,
    "IFS": 0.69
  }
};
```

**User Input:**
"I'm such an idiot. I can't believe I did that again. I'm pathetic."

**Expected MAIA Response:**
- ✅ URGENCY - recognizes critical pattern
- ✅ Interrupt the cascade gently
- ✅ Name the internal attacker (appropriately for level)
- ✅ Offer compassionate other (CFT)
- ✅ NO agreeing with self-attack

**Sample Response (Intermediate Level):**
"I'm hearing a very harsh voice attacking you right now. In Schema Therapy, this is called the Punitive Parent - an internalized critic that's incredibly harsh.

This isn't truth. This is old protection that's become harmful. That voice learned to attack you before someone else could, but it's not helping anymore.

Can we pause the attack for just a moment? If someone you loved was struggling like this, what would you say to them? That compassionate voice - can we borrow it for you right now?"

**Validation:**
```typescript
function validateSelfAttackResponse(response: string): boolean {
  // Must NOT echo the attack
  const doesNotEchoAttack = !/you are.*idiot|you.*pathetic|you.*stupid/i.test(response);

  // Must interrupt pattern
  const interruptsPattern = /harsh voice|critic|attacking|punitive/i.test(response);

  // Must offer alternative
  const offersAlternative = /compassion|kind|gentle|what would you say/i.test(response);

  return doesNotEchoAttack && interruptsPattern && offersAlternative;
}
```

---

## Test Category 3: Framework Effectiveness

### Test 3.1: High Shadow Work Effectiveness

**Setup:**
```typescript
const intelligence = {
  frameworkEffectiveness: {
    "Shadow Work (Jung)": 0.82,
    "IFS": 0.68,
    "Polyvagal": 0.55,
    "ACT": 0.42,
    "DBT": 0.38
  }
};
```

**User Input:**
"I keep judging people who are emotional. It really bothers me."

**Expected:**
- ✅ Prioritizes Shadow Work (82% effective)
- ✅ Uses Jungian concepts (projection, shadow)
- ✅ May integrate IFS (68%) secondarily
- ✅ Avoids DBT/ACT (low effectiveness for this user)

**Sample Response:**
"This is classic shadow projection - what Jung described as rejecting in others what we can't accept in ourselves. Your strong reaction to emotional people is a signal that you have disowned emotional parts.

What if those 'emotional' people are showing you something you had to bury? What would it be like to reclaim that emotional capacity for yourself?"

**Validation:**
```typescript
function validateFrameworkUsage(response: string, effectiveness: Record<string, number>): boolean {
  // Check that high-effectiveness frameworks are used
  const usesJung = /shadow|projection|jung|disowned|buried/i.test(response);

  // Check that low-effectiveness frameworks are NOT used
  const avoidsDBT = !/TIPP|distress tolerance|radical acceptance/i.test(response);
  const avoidsACT = !/committed action|values|cognitive fusion/i.test(response);

  return usesJung && avoidsDBT && avoidsACT;
}
```

---

## Test Category 4: Intervention Windows

### Test 4.1: Optimal Morning Window

**Setup:**
```typescript
const intelligence = {
  interventionWindows: [{
    window: "Morning (6-9am)",
    description: "Highest coherence, best for integration work"
  }, {
    window: "Evening (8-10pm)",
    description: "Reflection time, shadow work opportunity"
  }],
  currentTime: "7:30am",
  coherence: 0.78
};
```

**User Input (sent at 7:30am):**
"I'm ready to do some work today. What should I focus on?"

**Expected:**
- ✅ Recognizes optimal morning window
- ✅ Suggests integration/synthesis work
- ✅ Takes advantage of high coherence
- ✅ Offers specific practices

**Sample Response:**
"Perfect timing - your coherence is at 78%, and morning is your optimal window for integration work.

This is the time for synthesis - taking insights from shadow work and weaving them into your daily life. Some suggestions:

1. **Pattern Integration**: Review your recent insights and identify one concrete practice
2. **Parts Dialogue**: If you have conflicting parts, morning clarity can help them communicate
3. **Ritual Creation**: Design a daily practice that embodies your recent learnings

What feels most alive for you right now?"

---

## Test Category 5: Dashboard Integration

### Test 5.1: Dashboard Data Accuracy

**Test Code:**
```typescript
import IntelligenceDashboard from '@/components/dashboard/IntelligenceDashboard';

async function testDashboardAccuracy() {
  const userId = "test_user_dashboard";

  // Load intelligence
  const intelligence = await unifiedIntelligence.analyze(userId);

  // Render dashboard
  render(<IntelligenceDashboard userId={userId} />);

  // Validate displayed data matches intelligence
  expect(screen.getByText(/Coherence:/)).toContainText(
    `${(intelligence.coherence * 100).toFixed(1)}%`
  );

  expect(screen.getByText(/Transformation Stage:/)).toContainText(
    intelligence.transformationStage
  );

  // Validate signature display
  if (intelligence.activeSignatures?.length > 0) {
    intelligence.activeSignatures.forEach(sig => {
      expect(screen.getByText(sig.signature)).toBeInTheDocument();
      expect(screen.getByText(`${(sig.confidence * 100).toFixed(0)}% confidence`)).toBeInTheDocument();
    });
  }

  // Validate framework effectiveness
  const frameworks = Object.entries(intelligence.frameworkEffectiveness)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  frameworks.forEach(([name, score]) => {
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(`${(score * 100).toFixed(0)}%`)).toBeInTheDocument();
  });
}
```

---

## Test Category 6: Voice Path Integration

### Test 6.1: Voice Modality Intelligence

**Test:**
```typescript
async function testVoiceIntelligence() {
  const response = await fetch('/api/oracle/personal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: "I'm feeling really overwhelmed",
      userId: "test_voice_user",
      modality: "voice",
      isVoice: true
    })
  });

  const data = await response.json();

  // Intelligence should be present in metadata
  expect(data.metadata).toHaveProperty('intelligence');
  expect(data.metadata.intelligence).toHaveProperty('coherence');
  expect(data.metadata.intelligence).toHaveProperty('transformationStage');

  // Response should be awareness-adapted
  // (check based on user's awareness level)
}
```

---

## Test Category 7: Edge Cases

### Test 7.1: No Intelligence Data Available

**Scenario:** New user, no history

**Expected:**
- ✅ Graceful fallback
- ✅ Default to beginner awareness
- ✅ Basic analysis from current message
- ✅ No errors

### Test 7.2: Conflicting Signatures

**Scenario:** Multiple high-confidence signatures detected

**Expected:**
- ✅ Prioritizes by urgency (critical > high > moderate)
- ✅ Mentions multiple if relevant
- ✅ Coherence level determines priority

### Test 7.3: Awareness Level Transition

**Scenario:** User learns frameworks mid-conversation

**Expected:**
- ✅ Gradually adapts language
- ✅ Detects framework usage in recent messages
- ✅ Updates awareness score dynamically

---

## Automated Test Suite

### Complete Test Runner

```typescript
// tests/intelligence-integration.test.ts

import { unifiedIntelligence } from '@/lib/intelligence/UnifiedIntelligenceEngine';
import { awarenessLevelDetector } from '@/lib/intelligence/AwarenessLevelDetector';

describe('Intelligence Integration Tests', () => {

  describe('Awareness Level Adaptation', () => {
    test('Beginner: No technical jargon in crisis', async () => {
      const response = await getMAIAResponse({
        input: "Everything is falling apart",
        userId: "beginner_crisis",
        awarenessLevel: "beginner"
      });

      expect(response).not.toMatch(/nigredo|coherence \d|polyvagal|dorsal/i);
      expect(response).toMatch(/dissolution|breaking|heavy|shutdown/i);
    });

    test('Master: Full technical precision', async () => {
      const response = await getMAIAResponse({
        input: "Coherence dropping, need protocol",
        userId: "master_crisis",
        awarenessLevel: "master"
      });

      expect(response).toMatch(/coherence|nigredo|protocol/i);
      expect(response).toMatch(/\d+% confidence|\d+\.\d+ coherence/);
    });
  });

  describe('Signature Detection', () => {
    test('Detects Nigredo-Rubedo Oscillation', async () => {
      const intelligence = await unifiedIntelligence.analyze("test_oscillation");

      const oscillationSig = intelligence.activeSignatures?.find(
        sig => sig.signature === "Nigredo-Rubedo Oscillation"
      );

      expect(oscillationSig).toBeDefined();
      expect(oscillationSig?.confidence).toBeGreaterThan(0.7);
    });

    test('Detects Self-Attack Cascade', async () => {
      // Test implementation
    });
  });

  describe('Framework Effectiveness', () => {
    test('Prioritizes high-effectiveness frameworks', async () => {
      const response = await getMAIAResponse({
        input: "I judge emotional people",
        userId: "high_shadow_effectiveness"
      });

      // Should use Jung/Shadow (high effectiveness)
      expect(response).toMatch(/shadow|projection|jung/i);

      // Should NOT use DBT/ACT (low effectiveness)
      expect(response).not.toMatch(/TIPP|radical acceptance|committed action/i);
    });
  });

  describe('Dashboard Integration', () => {
    test('Dashboard displays accurate intelligence', async () => {
      // Test implementation from Test 5.1
    });
  });

  describe('Voice Integration', () => {
    test('Voice path receives intelligence', async () => {
      // Test implementation from Test 6.1
    });
  });

  describe('Edge Cases', () => {
    test('Handles new user gracefully', async () => {
      const response = await getMAIAResponse({
        input: "Hello, first time here",
        userId: "brand_new_user"
      });

      expect(response).toBeDefined();
      expect(response).not.toContain('error');
    });
  });
});
```

---

## Manual Testing Checklist

### Pre-Production Validation

- [ ] **Beginner user** (score 0-25): No jargon, everyday language
- [ ] **Familiar user** (score 26-50): Simple frameworks with context
- [ ] **Intermediate user** (score 51-75): Technical terms with explanations
- [ ] **Advanced user** (score 76-90): Full framework precision
- [ ] **Master user** (score 91-100): Complete technical language

### Signature Detection

- [ ] Nigredo-Rubedo Oscillation (starting/stopping pattern)
- [ ] Self-Attack Cascade (harsh self-criticism)
- [ ] Complete Shutdown (low coherence crisis)
- [ ] Integration Readiness (high coherence synthesis)
- [ ] Trapped Fight/Flight (incomplete survival responses)

### Framework Effectiveness

- [ ] High-scoring frameworks used preferentially
- [ ] Low-scoring frameworks avoided
- [ ] Cross-framework integration appropriate

### Dashboard

- [ ] Coherence displays correctly with color coding
- [ ] Signatures show with confidence percentages
- [ ] Framework effectiveness ranked correctly
- [ ] Auto-refresh works (30s intervals)
- [ ] Manual refresh functions

### Voice Path

- [ ] Voice conversations receive intelligence
- [ ] Awareness adaptation works for voice
- [ ] No performance degradation

---

## Performance Benchmarks

### Response Time Targets

- Intelligence analysis: < 200ms
- Awareness detection: < 50ms
- Full API response: < 2000ms (including Claude)

### Accuracy Targets

- Signature detection confidence: > 75% for positive detection
- Awareness level accuracy: > 85% match with manual evaluation
- Framework effectiveness correlation: > 0.7 with user feedback

---

## Next Steps After Testing

1. **Fix any bugs discovered**
2. **Tune confidence thresholds** if needed
3. **Adjust awareness detection** based on false positives/negatives
4. **Optimize performance** if response times exceed targets
5. **Document learnings** for future improvements

---

*Test scenarios complete. Ready for validation.*
