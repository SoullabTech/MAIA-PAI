#!/usr/bin/env tsx
/**
 * AWARENESS-LEVEL ADAPTATION DEMONSTRATION
 *
 * Shows how MAIA adapts her language from Beginner to Master
 * Same transformation moment, 5 different languages
 *
 * Run: npx tsx scripts/demo-awareness-adaptation.ts
 */

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';
import { awarenessLevelDetector } from '../lib/intelligence/AwarenessLevelDetector';
import { alchemicalResponseSystem } from '../lib/intelligence/AlchemicalResponseSystem';
import type { TransformationMoment } from '../lib/intelligence/AlchemicalResponseSystem';

console.log('\n' + '='.repeat(80));
console.log('🜍 AWARENESS-LEVEL ADAPTATION DEMONSTRATION');
console.log('   Same Transformation, Five Different Languages');
console.log('='.repeat(80) + '\n');

async function runDemo() {

  // ========================================================================
  // THE TRANSFORMATION MOMENT (Nigredo - dissolution phase)
  // ========================================================================
  const userInput = `Everything is falling apart. Complete darkness and chaos.
I'm numb and frozen. A part of me is desperately trying to control this.
I'm projecting my shadow everywhere.`;

  console.log('📋 USER INPUT (Transformation Moment):\n');
  console.log(`"${userInput}"\n`);
  console.log('━'.repeat(80) + '\n');

  // Extract the transformation moment
  const extraction = await symbolExtractor.extract(userInput);

  if (!extraction.alchemicalStage) {
    console.log('❌ No alchemical stage detected');
    return;
  }

  console.log('🔍 DETECTED TRANSFORMATION STATE:\n');
  console.log(`   Stage: ${extraction.alchemicalStage.primaryStage}`);
  console.log(`   Coherence: ${extraction.alchemicalStage.coherence.toFixed(2)}`);
  console.log(`   Transformation: ${extraction.alchemicalStage.transformation}`);
  console.log(`   Operations: ${extraction.alchemicalStage.operations.join(', ') || 'none'}`);
  console.log(`   Polyvagal: ${extraction.polyvagalState?.state || 'unknown'}`);
  console.log(`   IFS: ${extraction.ifsParts?.parts.map(p => p.type).join(', ') || 'none'}\n`);
  console.log('━'.repeat(80) + '\n');

  // ========================================================================
  // DEMONSTRATION: Five Awareness Levels
  // ========================================================================

  const awarenessLevels: Array<{
    level: 'beginner' | 'familiar' | 'intermediate' | 'advanced' | 'master';
    conversationHistory: string[];
    description: string;
  }> = [
    {
      level: 'beginner',
      conversationHistory: ['I feel overwhelmed and lost'],
      description: 'Never heard of alchemy or frameworks - needs everyday language'
    },
    {
      level: 'familiar',
      conversationHistory: ['I think I\'m going through some shadow work', 'Feeling the darkness'],
      description: 'Knows some concepts - can handle light framework language'
    },
    {
      level: 'intermediate',
      conversationHistory: [
        'I\'m in a Nigredo phase',
        'The dissolution is intense',
        'Shadow material surfacing'
      ],
      description: 'Understands frameworks - wants technical terms with explanations'
    },
    {
      level: 'advanced',
      conversationHistory: [
        'Nigredo at low coherence',
        'Solutio operation active',
        'Polyvagal dorsal state',
        'Manager parts trying to control'
      ],
      description: 'Deep framework knowledge - speaks the language fluently'
    },
    {
      level: 'master',
      conversationHistory: [
        'Coherence 0.20, Nigredo primary stage',
        'Solutio + Mortificatio operations',
        'Polyvagal dorsal, IFS parts-led',
        'McGilchrist left-brain control failing',
        'Spiralogic spiral descent active'
      ],
      description: 'Spiralogic alchemist - wants complete technical precision'
    }
  ];

  for (const { level, conversationHistory, description } of awarenessLevels) {
    console.log(`📊 AWARENESS LEVEL: ${level.toUpperCase()}`);
    console.log(`   ${description}\n`);

    // Detect awareness (simulated with conversation history)
    const awarenessProfile = awarenessLevelDetector.detect(conversationHistory);
    console.log(`   Detected Score: ${awarenessProfile.score}/100`);
    console.log(`   Detected Level: ${awarenessProfile.level}\n`);

    // Create transformation moment with awareness level
    const moment: TransformationMoment = {
      alchemicalStage: extraction.alchemicalStage,
      coherence: extraction.alchemicalStage.coherence,
      polyvagalState: extraction.polyvagalState,
      ifsParts: extraction.ifsParts,
      hemisphericMode: extraction.hemisphericMode,
      jungianProcess: extraction.jungianProcess,
      awarenessLevel: level // Force to demonstrate each level
    };

    // Generate adapted guidance
    const strategy = alchemicalResponseSystem.getResponseStrategy(moment);
    const userGuidance = alchemicalResponseSystem.generateUserGuidance(moment);

    console.log(`   🜍 MAIA'S RESPONSE (${level}):\n`);
    console.log(`   Stage: ${strategy.stage}`);
    console.log(`   Approach: ${strategy.approach}\n`);
    console.log(`   Example Response:`);
    console.log(`   ${strategy.examples[0]}\n`);
    console.log(`   User Guidance:\n`);
    const guidanceLines = userGuidance.split('\n');
    guidanceLines.forEach(line => console.log(`   ${line}`));
    console.log('\n' + '━'.repeat(80) + '\n');
  }

  // ========================================================================
  // COMPARISON TABLE
  // ========================================================================
  console.log('📊 COMPARISON: How MAIA Speaks at Each Level\n');
  console.log('┌─────────────────┬──────────────────────────────────────────────────────┐');
  console.log('│ AWARENESS LEVEL │ LANGUAGE STYLE                                       │');
  console.log('├─────────────────┼──────────────────────────────────────────────────────┤');
  console.log('│ Beginner        │ "You\'re going through a breaking-down phase..."     │');
  console.log('│                 │ No jargon, everyday metaphors                        │');
  console.log('├─────────────────┼──────────────────────────────────────────────────────┤');
  console.log('│ Familiar        │ "Nigredo (the dark night) - dissolution..."         │');
  console.log('│                 │ Framework terms with context                         │');
  console.log('├─────────────────┼──────────────────────────────────────────────────────┤');
  console.log('│ Intermediate    │ "Nigredo (coherence 0.20) - the necessary..."       │');
  console.log('│                 │ Technical terms with brief explanations              │');
  console.log('├─────────────────┼──────────────────────────────────────────────────────┤');
  console.log('│ Advanced        │ "Nigredo 0.20, Solutio operation, Polyvagal..."     │');
  console.log('│                 │ Full framework language, cross-framework analysis    │');
  console.log('├─────────────────┼──────────────────────────────────────────────────────┤');
  console.log('│ Master          │ "Coherence 0.200, Nigredo primary, Operations..."   │');
  console.log('│                 │ Complete technical precision, all frameworks         │');
  console.log('└─────────────────┴──────────────────────────────────────────────────────┘\n');

  // ========================================================================
  // THE WISDOM
  // ========================================================================
  console.log('💡 THE WISDOM:\n');
  console.log('   The SAME transformation moment...');
  console.log('   The SAME alchemical wisdom...');
  console.log('   The SAME response protocol (CO-REGULATE in Nigredo)...\n');
  console.log('   ...but FIVE DIFFERENT LANGUAGES\n');
  console.log('   MAIA meets each user exactly where they are.');
  console.log('   From "breaking down" to "Coherence 0.200, Solutio operation active."\n');
  console.log('   Same truth. Different doorways. 🜍✨\n');

  console.log('='.repeat(80) + '\n');
}

runDemo().catch(error => {
  console.error('❌ Demo failed:', error);
  process.exit(1);
});
