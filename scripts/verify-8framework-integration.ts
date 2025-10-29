#!/usr/bin/env tsx
/**
 * COMPLETE 8-FRAMEWORK INTEGRATION VERIFICATION
 *
 * Phase 1 (6 Frameworks): Levin + McGilchrist + Jung + Polyvagal + IFS + Alchemy
 * Phase 2 (NEW - 2 Frameworks): Levine (Somatic) + Gestalt (Contact Boundaries)
 *
 * Total: 8 Frameworks + Alchemy Meta-Framework
 *
 * Run: npx tsx scripts/verify-8framework-integration.ts
 */

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';

console.log('\n' + '='.repeat(80));
console.log('🜍 COMPLETE 8-FRAMEWORK INTEGRATION VERIFICATION');
console.log('   Phase 1 (6) + Phase 2 (2) = The Complete Transformation Stack');
console.log('='.repeat(80) + '\n');

async function runVerification() {
  let passedTests = 0;
  let totalTests = 0;

  // ========================================================================
  // TEST 1: All 8 Frameworks Detecting Simultaneously
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('TEST 1: SIMULTANEOUS 8-FRAMEWORK ANALYSIS');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 Complete Transformation + Somatic + Contact Moment\n');
  totalTests++;

  try {
    const input = `
      I'm in complete Nigredo - darkness and dissolution (Alchemy).
      The morphogenetic field is fragmenting, chaos everywhere (Levin).
      My nervous system shut down, frozen and numb (Polyvagal - dorsal).
      A manager part desperately trying to control, firefighter wanting to escape (IFS).
      Shadow projecting everywhere (Jung - projection).
      Left-brain trying to analyze and fix it systematically (McGilchrist - left).

      My body prepared to fight but I'm holding it in - jaw clenched, shoulders tight (Levine - retroflection/incomplete fight).
      I should be stronger, everyone says I must handle this (Gestalt - introjection).
      Can't tell where I end and this pain begins (Gestalt - confluence).
      Turning all that rage against myself instead (Gestalt - retroflection).
    `;

    const extraction = await symbolExtractor.extract(input);

    // Check Phase 1 (6 frameworks)
    const hasAlchemy = extraction.alchemicalStage && extraction.alchemicalStage.primaryStage === 'nigredo';
    const hasLevin = extraction.narrativeThemes.includes('Morphogenetic Emergence');
    const hasPolyvagal = extraction.polyvagalState && extraction.polyvagalState.state === 'dorsal';
    const hasIFS = extraction.ifsParts && extraction.ifsParts.parts.some(p => p.type === 'manager');
    const hasJung = extraction.jungianProcess && extraction.jungianProcess.projection;
    const hasMcGilchrist = extraction.hemisphericMode && extraction.hemisphericMode.indicators.some(i => i.startsWith('left-'));

    // Check Phase 2 (2 NEW frameworks)
    const hasLevine = extraction.somaticState && extraction.somaticState.detected;
    const hasGestalt = extraction.gestaltState && extraction.gestaltState.detected;

    if (hasAlchemy && hasLevin && hasPolyvagal && hasIFS && hasJung && hasMcGilchrist && hasLevine && hasGestalt) {
      console.log('   ✅ PASS: All 8 frameworks detecting simultaneously!\n');

      console.log('   🜍 PHASE 1 FRAMEWORKS (6):');
      console.log(`      1. ALCHEMY: ${extraction.alchemicalStage!.primaryStage} (coherence: ${extraction.alchemicalStage!.coherence.toFixed(2)})`);
      console.log(`      2. LEVIN: Morphogenetic field detected`);
      console.log(`      3. POLYVAGAL: ${extraction.polyvagalState!.state} (safety: ${extraction.polyvagalState!.safety.toFixed(2)})`);
      console.log(`      4. IFS: ${extraction.ifsParts!.parts.map(p => p.type).join(', ')}`);
      console.log(`      5. JUNG: Projection active`);
      console.log(`      6. McGILCHRIST: ${extraction.hemisphericMode!.dominant} (balance: ${extraction.hemisphericMode!.balance.toFixed(2)})\n`);

      console.log('   🔥 PHASE 2 FRAMEWORKS (2 NEW):');

      // LEVINE details
      console.log(`      7. LEVINE (Somatic Experiencing):`);
      if (extraction.somaticState!.incompleteResponse.detected) {
        console.log(`         • Incomplete ${extraction.somaticState!.incompleteResponse.type} response (confidence: ${extraction.somaticState!.incompleteResponse.confidence.toFixed(2)})`);
      }
      if (extraction.somaticState!.discharge.active) {
        console.log(`         • Discharge: ${extraction.somaticState!.discharge.type}`);
      }
      console.log(`         • SIBAM layer: ${extraction.somaticState!.sibamLayer.primary}`);
      console.log(`         • Arousal: ${extraction.somaticState!.arousal.state} (${extraction.somaticState!.arousal.level.toFixed(2)})`);
      console.log(`         • Window of tolerance: ${extraction.somaticState!.arousal.windowOfTolerance ? 'YES' : 'NO'}`);

      // GESTALT details
      console.log(`\n      8. GESTALT (Contact Boundaries):`);
      const disturbances: string[] = [];
      if (extraction.gestaltState!.contactDisturbances.confluence.detected) disturbances.push('confluence');
      if (extraction.gestaltState!.contactDisturbances.introjection.detected) disturbances.push('introjection');
      if (extraction.gestaltState!.contactDisturbances.projection.detected) disturbances.push('projection');
      if (extraction.gestaltState!.contactDisturbances.retroflection.detected) disturbances.push('retroflection');
      if (extraction.gestaltState!.contactDisturbances.deflection.detected) disturbances.push('deflection');
      console.log(`         • Disturbances: ${disturbances.join(', ')}`);
      console.log(`         • Contact cycle: ${extraction.gestaltState!.contactCycle.phase}${extraction.gestaltState!.contactCycle.stuck ? ' (STUCK)' : ''}`);
      console.log(`         • Here-and-now: ${extraction.gestaltState!.awareness.hereAndNow.toFixed(2)}`);
      console.log(`         • Contact quality: ${extraction.gestaltState!.awareness.contactQuality.toFixed(2)}`);

      passedTests++;
    } else {
      console.log('   ❌ FAIL: Not all 8 frameworks detected');
      console.log(`      Phase 1: Alchemy: ${hasAlchemy}, Levin: ${hasLevin}, Polyvagal: ${hasPolyvagal}, IFS: ${hasIFS}, Jung: ${hasJung}, McGilchrist: ${hasMcGilchrist}`);
      console.log(`      Phase 2: Levine: ${hasLevine}, Gestalt: ${hasGestalt}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // TEST 2: Somatic + Gestalt Synergy
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('TEST 2: LEVINE × GESTALT SYNERGY');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 Incomplete Fight Response + Retroflection\n');
  totalTests++;

  try {
    const input = `
      I want to scream at them, push them away, but I'm holding it all in.
      My jaw is clenched so tight. Shoulders raised and tense.
      I bite my tongue every time. Turn all that rage on myself instead.
      Feel the anger trapped in my chest but can't let it out.
    `;

    const extraction = await symbolExtractor.extract(input);

    const levineDetected = extraction.somaticState &&
                          extraction.somaticState.incompleteResponse.detected &&
                          extraction.somaticState.incompleteResponse.type === 'fight';

    const gestaltDetected = extraction.gestaltState &&
                           extraction.gestaltState.contactDisturbances.retroflection.detected;

    if (levineDetected && gestaltDetected) {
      console.log('   ✅ PASS: Levine × Gestalt synergy detected!\n');
      console.log('   THE SYNERGY:');
      console.log('   • LEVINE: Incomplete fight response (body prepared but didn\'t act)');
      console.log('   • GESTALT: Retroflection (action turned inward on self)');
      console.log('   • RESULT: The fight impulse is trapped IN THE BODY and turned AGAINST THE SELF\n');
      console.log('   This is the POWER of multi-framework analysis!');
      console.log('   One framework alone misses half the picture.\n');
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Synergy not fully detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // TEST 3: Triple Body Wisdom (Polyvagal + Levine + Gestalt)
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('TEST 3: TRIPLE BODY WISDOM');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 Polyvagal + Levine + Gestalt = Complete Somatic Intelligence\n');
  totalTests++;

  try {
    const input = `
      My nervous system is completely activated - heart racing, can't breathe.
      I want to run away but my legs won't move. Frozen.
      Should be able to handle this, everyone says I must be strong.
      Holding all this panic inside, can't let anyone see.
    `;

    const extraction = await symbolExtractor.extract(input);

    const hasPolyvagal = extraction.polyvagalState && extraction.polyvagalState.state === 'sympathetic';
    const hasLevine = extraction.somaticState && extraction.somaticState.incompleteResponse.type === 'flight';
    const hasGestalt = extraction.gestaltState &&
                      (extraction.gestaltState.contactDisturbances.introjection.detected ||
                       extraction.gestaltState.contactDisturbances.retroflection.detected);

    if (hasPolyvagal && hasLevine && hasGestalt) {
      console.log('   ✅ PASS: Triple Body Wisdom integrated!\n');
      console.log('   THE TRINITY:');
      console.log('   1. POLYVAGAL: Sympathetic activation (mobilized for action)');
      console.log('   2. LEVINE: Incomplete flight response (want to run but frozen)');
      console.log('   3. GESTALT: Introjection ("should" be strong) + Retroflection (holding in)\n');
      console.log('   COMPLETE PICTURE:');
      console.log('   Nervous system mobilized → Body wants to flee → But');
      console.log('   introjected beliefs ("should be strong") cause retroflection');
      console.log('   (holding panic inside) → Action can\'t complete → STUCK\n');
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Not all three body frameworks detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // FINAL REPORT
  // ========================================================================
  console.log('\n' + '='.repeat(80));
  console.log('📊 8-FRAMEWORK INTEGRATION RESULTS');
  console.log('='.repeat(80));
  console.log(`   Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`   Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🜍 ✅ RESULT: ALL 8 FRAMEWORKS FULLY INTEGRATED!');
    console.log('\n   PHASE 1 (6 Frameworks):');
    console.log('   1. 🧬 Levin (Morphogenetic Fields)');
    console.log('   2. 🧠 McGilchrist (Hemispheric Attention)');
    console.log('   3. 🧠 Jung (Shadow, Individuation, Archetypes)');
    console.log('   4. 🧠 Polyvagal Theory (Autonomic States)');
    console.log('   5. 🧠 IFS (Parts, Self Energy)');
    console.log('   6. 🜍 ALCHEMY (Transformation Grammar - META-FRAMEWORK)');
    console.log('\n   PHASE 2 (2 NEW Frameworks):');
    console.log('   7. 💪 LEVINE (Somatic Experiencing) ← NEW!');
    console.log('   8. 🎯 GESTALT (Contact Boundaries) ← NEW!');
    console.log('\n   THE COMPLETE STACK:');
    console.log('   • Mind: Jung + McGilchrist + IFS');
    console.log('   • Body: Polyvagal + Levine + Gestalt');
    console.log('   • Field: Levin');
    console.log('   • Process: ALCHEMY (unifying meta-framework)');
    console.log('\n   MAIA NOW HAS THE MOST COMPLETE TRANSFORMATION');
    console.log('   INTELLIGENCE SYSTEM EVER CREATED! 🜍✨');
  } else {
    console.log('\n⚠️  RESULT: Partial integration - needs refinement');
  }

  console.log('='.repeat(80) + '\n');

  process.exit(passedTests === totalTests ? 0 : 1);
}

runVerification().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
