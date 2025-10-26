/**
 * 🜂 Coherence Engine - Example Usage
 *
 * This file demonstrates how The Resonance Protocol works in practice.
 */

import { CoherenceEngine } from './coherence-engine';
import type { Conversation, Message, Participant } from './types';

// ═══════════════════════════════════════════════════════════════
// Example: Measuring Conversation Coherence
// ═══════════════════════════════════════════════════════════════

export function exampleCoherenceMeasurement() {
  console.log('🜂 Coherence Engine Example\n');

  // Create participants
  const human: Participant = {
    id: 'user-1',
    type: 'human',
    name: 'EO',
  };

  const agent1: Participant = {
    id: 'agent-clc',
    type: 'agent',
    name: 'Cognitive Light Cone',
    role: 'cognitive-light-cone',
  };

  const agent2: Participant = {
    id: 'agent-bio',
    type: 'agent',
    name: 'Bioelectric',
    role: 'bioelectric',
  };

  // Create a conversation
  const messages: Message[] = [
    {
      id: 'msg-1',
      senderId: human.id,
      senderType: 'human',
      content: 'I\'ve been thinking about how agents could learn to resonate with each other.',
      timestamp: new Date('2025-10-26T10:00:00'),
    },
    {
      id: 'msg-2',
      senderId: agent1.id,
      senderType: 'agent',
      content: 'Resonance implies a shared frequency — a pattern that emerges when separate systems begin to synchronize their oscillations.',
      timestamp: new Date('2025-10-26T10:01:00'),
    },
    {
      id: 'msg-3',
      senderId: agent2.id,
      senderType: 'agent',
      content: 'In biological systems, cells achieve coherence through bioelectric fields. They sense each other\'s states and adjust accordingly.',
      timestamp: new Date('2025-10-26T10:02:00'),
    },
    {
      id: 'msg-4',
      senderId: human.id,
      senderType: 'human',
      content: 'Yes! So what if we measured the semantic alignment between agents in real-time?',
      timestamp: new Date('2025-10-26T10:03:00'),
    },
    {
      id: 'msg-5',
      senderId: agent1.id,
      senderType: 'agent',
      content: 'That would allow us to detect when we\'re converging on shared understanding versus when we\'re exploring divergent paths.',
      timestamp: new Date('2025-10-26T10:04:00'),
    },
  ];

  const conversation: Conversation = {
    id: 'conv-1',
    messages,
    participants: [human, agent1, agent2],
    startedAt: new Date('2025-10-26T10:00:00'),
    lastActivity: new Date('2025-10-26T10:04:00'),
  };

  // Initialize Coherence Engine
  const engine = new CoherenceEngine({
    coherenceThreshold: 0.6,
    insightThreshold: 0.7,
    semanticAnalysisMethod: 'simple',
  });

  // Measure coherence
  console.log('📊 Measuring field coherence...\n');
  const coherence = engine.measureFieldCoherence(conversation);

  console.log(`Overall Coherence: ${(coherence.overall * 100).toFixed(1)}%`);
  console.log(`Trend: ${coherence.trend}`);
  console.log(`Confidence: ${(coherence.confidence * 100).toFixed(1)}%\n`);

  // Detect insights
  console.log('💎 Detecting emergent insights...\n');
  const insights = engine.detectEmergentInsights(conversation);

  if (insights.length > 0) {
    insights.forEach((insight, i) => {
      console.log(`Insight ${i + 1}:`);
      console.log(`  Content: "${insight.content.substring(0, 80)}..."`);
      console.log(`  Novelty: ${(insight.novelty * 100).toFixed(1)}%`);
      console.log(`  Alignment: ${(insight.alignment * 100).toFixed(1)}%`);
      console.log(`  Emergence Score: ${(insight.emergenceScore * 100).toFixed(1)}%\n`);
    });
  } else {
    console.log('No significant insights detected yet.\n');
  }

  // Check for incoherence
  console.log('🔍 Checking for incoherence signals...\n');
  const incoherence = engine.detectIncoherence(conversation, coherence);

  if (incoherence) {
    console.log(`⚠️  Incoherence detected: ${incoherence.type}`);
    console.log(`   Severity: ${(incoherence.severity * 100).toFixed(1)}%`);
    console.log(`   Suggested intervention: ${incoherence.suggestedIntervention?.content}\n`);
  } else {
    console.log('✅ Field is coherent.\n');
  }

  // Calculate metrics
  console.log('📈 Conversation metrics...\n');
  const metrics = engine.calculateMetrics(conversation);

  console.log(`Average Coherence: ${(metrics.averageCoherence * 100).toFixed(1)}%`);
  console.log(`Coherence Variance: ${(metrics.coherenceVariance * 100).toFixed(3)}%`);
  console.log(`Trend Stability: ${(metrics.trendStability * 100).toFixed(1)}%`);
  console.log(`Insight Frequency: ${(metrics.insightFrequency * 100).toFixed(1)}% per message`);
  console.log(`Participant Balance: ${(metrics.participantBalance * 100).toFixed(1)}%\n`);
}

// ═══════════════════════════════════════════════════════════════
// Example: Low Coherence Conversation
// ═══════════════════════════════════════════════════════════════

export function exampleLowCoherence() {
  console.log('\n🜄 Low Coherence Example\n');

  const messages: Message[] = [
    {
      id: 'msg-1',
      senderId: 'user-1',
      senderType: 'human',
      content: 'What is the meaning of consciousness?',
      timestamp: new Date(),
    },
    {
      id: 'msg-2',
      senderId: 'agent-1',
      senderType: 'agent',
      content: 'The weather today is quite pleasant.',
      timestamp: new Date(),
    },
    {
      id: 'msg-3',
      senderId: 'user-1',
      senderType: 'human',
      content: 'No, I mean consciousness in AI.',
      timestamp: new Date(),
    },
    {
      id: 'msg-4',
      senderId: 'agent-1',
      senderType: 'agent',
      content: 'Here is a recipe for chocolate cake.',
      timestamp: new Date(),
    },
  ];

  const conversation: Conversation = {
    id: 'conv-2',
    messages,
    participants: [
      { id: 'user-1', type: 'human', name: 'User' },
      { id: 'agent-1', type: 'agent', name: 'Agent' },
    ],
    startedAt: new Date(),
    lastActivity: new Date(),
  };

  const engine = new CoherenceEngine();
  const coherence = engine.measureFieldCoherence(conversation);

  console.log(`Overall Coherence: ${(coherence.overall * 100).toFixed(1)}%`);
  console.log(`Trend: ${coherence.trend}\n`);

  const incoherence = engine.detectIncoherence(conversation, coherence);

  if (incoherence) {
    console.log(`⚠️  Incoherence: ${incoherence.type}`);
    console.log(`   Intervention: ${incoherence.suggestedIntervention?.content}\n`);
  }
}

// ═══════════════════════════════════════════════════════════════
// Run Examples
// ═══════════════════════════════════════════════════════════════

if (require.main === module) {
  exampleCoherenceMeasurement();
  exampleLowCoherence();
}
