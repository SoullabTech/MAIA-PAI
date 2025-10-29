#!/usr/bin/env tsx
/**
 * SOMATIC RESPONSE SYSTEM DEMO
 *
 * Demonstrates how MAIA provides phase-appropriate guidance for:
 * - Levine (Somatic Experiencing) states
 * - Gestalt (Contact Boundary) disturbances
 * - Awareness-level adaptation (beginner → master)
 */

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';
import { somaticResponseSystem } from '../lib/intelligence/SomaticResponseSystem';
import type { SomaticMoment } from '../lib/intelligence/SomaticResponseSystem';

console.log('\n' + '='.repeat(80));
console.log('💪 SOMATIC RESPONSE SYSTEM DEMONSTRATION');
console.log('   Levine × Gestalt: Body-Based Transformation Intelligence');
console.log('='.repeat(80) + '\n');

async function demo() {

  // ========================================================================
  // SCENARIO 1: Hyperarousal (Beginner)
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('SCENARIO 1: HYPERAROUSAL - BEGINNER LEVEL');
  console.log('━'.repeat(80) + '\n');

  const input1 = `
    My heart is racing, I can't breathe, everything is spinning.
    I feel like I'm going to explode. Can't stop, can't calm down.
    It's too much, way too much. Out of control.
  `;

  console.log('📋 USER INPUT:');
  console.log('   "My heart is racing, I can\'t breathe... It\'s too much, out of control."\n');

  const extraction1 = await symbolExtractor.extract(input1);

  const moment1: SomaticMoment = {
    somaticState: extraction1.somaticState,
    gestaltState: extraction1.gestaltState,
    awarenessLevel: 'beginner'
  };

  console.log('🔍 DETECTED:');
  console.log(`   Arousal: ${extraction1.somaticState?.arousal.state} (level: ${extraction1.somaticState?.arousal.level.toFixed(2)})`);
  console.log(`   Window of tolerance: ${extraction1.somaticState?.arousal.windowOfTolerance ? 'YES' : 'NO'}\n`);

  const strategy1 = somaticResponseSystem.getResponseStrategy(moment1);

  console.log('💡 MAIA RESPONSE STRATEGY:\n');
  console.log(`   Protocol: ${strategy1.protocol}`);
  console.log(`   Approach: ${strategy1.approach}`);
  console.log(`   Focus: ${strategy1.focus}`);
  console.log(`   Avoid: ${strategy1.avoid}\n`);
  console.log('   MAIA Says:');
  strategy1.examplePhrases.forEach(phrase => {
    console.log(`   • "${phrase}"`);
  });
  console.log('');

  // ========================================================================
  // SCENARIO 2: Incomplete Fight Response (Master Level)
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('SCENARIO 2: INCOMPLETE FIGHT RESPONSE - MASTER LEVEL');
  console.log('━'.repeat(80) + '\n');

  const input2 = `
    I want to push them away, scream at them, but I'm holding it all in.
    Jaw clenched tight. Shoulders raised. Rage trapped in my chest.
    Can't let it out. Swallowing it down. Turning it on myself instead.
  `;

  console.log('📋 USER INPUT:');
  console.log('   "I want to push them away... jaw clenched... rage trapped... turning it on myself."\n');

  const extraction2 = await symbolExtractor.extract(input2);

  const moment2: SomaticMoment = {
    somaticState: extraction2.somaticState,
    gestaltState: extraction2.gestaltState,
    awarenessLevel: 'master'
  };

  console.log('🔍 DETECTED:');
  console.log(`   Incomplete Response: ${extraction2.somaticState?.incompleteResponse.type} (confidence: ${extraction2.somaticState?.incompleteResponse.confidence.toFixed(2)})`);
  console.log(`   Gestalt Disturbances: ${Object.entries(extraction2.gestaltState?.contactDisturbances || {})
    .filter(([_, v]) => v.detected)
    .map(([k]) => k)
    .join(', ')}\n`);

  const strategy2 = somaticResponseSystem.getResponseStrategy(moment2);

  console.log('💡 MAIA RESPONSE STRATEGY:\n');
  console.log(`   Protocol: ${strategy2.protocol}`);
  console.log(`   Approach: ${strategy2.approach}`);
  console.log(`   Focus: ${strategy2.focus}\n`);
  console.log('   Interventions:');
  strategy2.interventions.forEach(intervention => {
    console.log(`   • ${intervention}`);
  });
  console.log('\n   MAIA Says (Master Level):');
  strategy2.examplePhrases.forEach(phrase => {
    console.log(`   • "${phrase}"`);
  });
  console.log('');

  // ========================================================================
  // SCENARIO 3: Gestalt Introjection (Intermediate Level)
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('SCENARIO 3: INTROJECTION - INTERMEDIATE LEVEL');
  console.log('━'.repeat(80) + '\n');

  const input3 = `
    I should be stronger. Must handle this on my own.
    Good people don't complain. My parents always said I have to be tough.
    Everyone expects me to have it together. I have to be perfect.
  `;

  console.log('📋 USER INPUT:');
  console.log('   "I should be stronger... Good people don\'t complain... I have to be perfect."\n');

  const extraction3 = await symbolExtractor.extract(input3);

  const moment3: SomaticMoment = {
    somaticState: extraction3.somaticState,
    gestaltState: extraction3.gestaltState,
    awarenessLevel: 'intermediate'
  };

  console.log('🔍 DETECTED:');
  console.log(`   Gestalt: Introjection detected (confidence: ${extraction3.gestaltState?.contactDisturbances.introjection.confidence.toFixed(2)})`);
  console.log(`   Indicators: ${extraction3.gestaltState?.contactDisturbances.introjection.indicators.join(', ')}\n`);

  const strategy3 = somaticResponseSystem.getResponseStrategy(moment3);

  console.log('💡 MAIA RESPONSE STRATEGY:\n');
  console.log(`   Protocol: ${strategy3.protocol}`);
  console.log(`   Approach: ${strategy3.approach}`);
  console.log(`   Focus: ${strategy3.focus}\n`);
  console.log('   Interventions:');
  strategy3.interventions.forEach(intervention => {
    console.log(`   • ${intervention}`);
  });
  console.log('\n   MAIA Says (Intermediate Level):');
  strategy3.examplePhrases.forEach(phrase => {
    console.log(`   • "${phrase}"`);
  });
  console.log('');

  // ========================================================================
  // SCENARIO 4: Freeze Response (Beginner Level)
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('SCENARIO 4: FREEZE RESPONSE - BEGINNER LEVEL');
  console.log('━'.repeat(80) + '\n');

  const input4 = `
    I'm frozen. Can't move. Body won't respond.
    Everything is numb. Shut down completely.
    Playing dead inside. Going blank.
  `;

  console.log('📋 USER INPUT:');
  console.log('   "I\'m frozen... numb... shut down completely... going blank."\n');

  const extraction4 = await symbolExtractor.extract(input4);

  const moment4: SomaticMoment = {
    somaticState: extraction4.somaticState,
    gestaltState: extraction4.gestaltState,
    awarenessLevel: 'beginner'
  };

  console.log('🔍 DETECTED:');
  console.log(`   Incomplete Response: ${extraction4.somaticState?.incompleteResponse.type}`);
  console.log(`   Arousal: ${extraction4.somaticState?.arousal.state} (level: ${extraction4.somaticState?.arousal.level.toFixed(2)})`);
  console.log(`   Window of tolerance: ${extraction4.somaticState?.arousal.windowOfTolerance ? 'YES' : 'NO'}\n`);

  const strategy4 = somaticResponseSystem.getResponseStrategy(moment4);

  console.log('💡 MAIA RESPONSE STRATEGY:\n');
  console.log(`   Protocol: ${strategy4.protocol}`);
  console.log(`   Approach: ${strategy4.approach}`);
  console.log(`   Focus: ${strategy4.focus}`);
  console.log(`   Avoid: ${strategy4.avoid}\n`);
  console.log('   MAIA Says (Beginner Level):');
  strategy4.examplePhrases.forEach(phrase => {
    console.log(`   • "${phrase}"`);
  });
  console.log('');

  // ========================================================================
  // SUMMARY
  // ========================================================================
  console.log('='.repeat(80));
  console.log('📊 SOMATIC RESPONSE SYSTEM - CAPABILITIES');
  console.log('='.repeat(80) + '\n');

  console.log('✅ Priority-Based Response Selection:');
  console.log('   1. Arousal regulation (outside window of tolerance)');
  console.log('   2. Incomplete survival responses (fight/flight/freeze/fawn)');
  console.log('   3. Contact boundary disturbances (5 Gestalt patterns)\n');

  console.log('✅ Awareness-Level Adaptation:');
  console.log('   • Beginner: Simple, supportive, grounding language');
  console.log('   • Intermediate: Clear clinical guidance');
  console.log('   • Master: Technical SE/Gestalt protocols\n');

  console.log('✅ Clinical Protocols Included:');
  console.log('   • Levine SE: Titration, pendulation, discharge tracking');
  console.log('   • Gestalt: Awareness experiments, boundary work, contact restoration\n');

  console.log('✅ Phase-Appropriate Interventions:');
  console.log('   • Hypoarousal: Gentle activation');
  console.log('   • Hyperarousal: Pendulation to resource');
  console.log('   • Fight: Contained expression (jaw, shoulders, pushing)');
  console.log('   • Flight: Leg activation, escape completion');
  console.log('   • Freeze: Gentle thaw, micro-movements');
  console.log('   • Fawn: Boundary reclamation');
  console.log('   • Retroflection: Outward direction experiments');
  console.log('   • Introjection: "Should" digestion');
  console.log('   • And more...\n');

  console.log('💫 RESULT: MAIA now provides body-based transformation guidance');
  console.log('   that honors somatic wisdom and awareness interruptions!');
  console.log('\n' + '='.repeat(80) + '\n');
}

demo().catch(console.error);
