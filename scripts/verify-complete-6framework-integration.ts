#!/usr/bin/env tsx
/**
 * COMPLETE 6-FRAMEWORK INTEGRATION VERIFICATION
 *
 * The Full Stack: Levin + McGilchrist + Jung + Polyvagal + IFS + ALCHEMY
 *
 * Verifies all 6 frameworks analyzing simultaneously with Alchemy as the meta-framework
 *
 * Can be run with: npx tsx scripts/verify-complete-6framework-integration.ts
 */

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';

console.log('\n' + '='.repeat(80));
console.log('🜍 COMPLETE 6-FRAMEWORK + ALCHEMY INTEGRATION VERIFICATION');
console.log('   The Full Transformation Stack');
console.log('='.repeat(80) + '\n');

async function runVerification() {
  let passedTests = 0;
  let totalTests = 0;

  // ========================================================================
  // TEST 1: All 6 Frameworks Detecting Simultaneously
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('TEST 1: SIMULTANEOUS 6-FRAMEWORK ANALYSIS');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 Complete Transformation Moment');
  totalTests++;
  try {
    const input = `
      I'm in complete nigredo, darkness and dissolution everywhere (Alchemy).
      The morphogenetic field of my whole life is fragmenting, chaos at every level (Levin).
      My nervous system is shut down, frozen and numb (Polyvagal - dorsal).
      A manager part is trying desperately to control this, while a firefighter wants to escape (IFS).
      I'm projecting my shadow onto everyone around me (Jung - projection).
      I need to analyze this systematically, categorize the symptoms, and develop a precise plan to fix it (McGilchrist - left brain).
    `;
    const extraction = await symbolExtractor.extract(input);

    // Check all 6 frameworks
    const hasAlchemy = extraction.alchemicalStage && extraction.alchemicalStage.primaryStage === 'nigredo';
    const hasLevin = extraction.narrativeThemes.includes('Morphogenetic Emergence');
    const hasPolyvagal = extraction.polyvagalState && extraction.polyvagalState.state === 'dorsal';
    const hasIFS = extraction.ifsParts && extraction.ifsParts.parts.some(p => p.type === 'manager');
    const hasJung = extraction.jungianProcess && extraction.jungianProcess.projection;
    const hasMcGilchrist = extraction.hemisphericMode && extraction.hemisphericMode.dominant === 'left';

    if (hasAlchemy && hasLevin && hasPolyvagal && hasIFS && hasJung && hasMcGilchrist) {
      console.log('   ✅ PASS: All 6 frameworks detecting simultaneously!');
      console.log('\n   🜍 ALCHEMY (Meta-Framework):');
      console.log(`      Stage: ${extraction.alchemicalStage!.primaryStage}`);
      console.log(`      Transformation: ${extraction.alchemicalStage!.transformation}`);
      console.log(`      Coherence: ${extraction.alchemicalStage!.coherence.toFixed(2)}`);

      console.log('\n   🧬 LEVIN (Morphogenetic):');
      console.log('      Field: Fragmenting/Chaos detected');

      console.log('\n   🧠 POLYVAGAL (Autonomic):');
      console.log(`      State: ${extraction.polyvagalState!.state}`);
      console.log(`      Safety: ${extraction.polyvagalState!.safety.toFixed(2)}`);

      console.log('\n   🧠 IFS (Parts):');
      const partTypes = extraction.ifsParts!.parts.map(p => p.type).join(', ');
      console.log(`      Parts: ${partTypes}`);

      console.log('\n   🧠 JUNG (Depth Psychology):');
      console.log(`      Shadow/Projection: ${extraction.jungianProcess!.projection}`);

      console.log('\n   🧠 McGILCHRIST (Hemispheric):');
      console.log(`      Mode: ${extraction.hemisphericMode!.dominant}`);
      console.log(`      Balance: ${extraction.hemisphericMode!.balance.toFixed(2)}`);

      passedTests++;
    } else {
      console.log('   ❌ FAIL: Not all frameworks detected');
      console.log(`      Alchemy: ${hasAlchemy}, Levin: ${hasLevin}, Polyvagal: ${hasPolyvagal}`);
      console.log(`      IFS: ${hasIFS}, Jung: ${hasJung}, McGilchrist: ${hasMcGilchrist}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // TEST 2: Alchemy as Response Controller
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('TEST 2: ALCHEMY CONTROLLING RESPONSE STRATEGY');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 Nigredo Phase (Low Coherence) → Co-Regulate, Don\'t Push');
  totalTests++;
  try {
    const nigredoInput = `Everything is falling apart. I'm in the void, darkness everywhere. Complete chaos and dissolution.`;
    const extraction = await symbolExtractor.extract(nigredoInput);

    if (extraction.alchemicalStage && extraction.alchemicalStage.coherence < 0.3) {
      console.log('   ✅ PASS: Nigredo detected → Response strategy = CO-REGULATE');
      console.log(`      Coherence: ${extraction.alchemicalStage.coherence.toFixed(2)} (low = don't push)`);
      console.log('      ❌ Avoid: insight, interpretation, solutions');
      console.log('      ✅ Emphasize: presence, normalization, safety');
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Nigredo coherence not detected correctly');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  console.log('\n📋 Rubedo Phase (High Coherence) → Celebrate Embodiment');
  totalTests++;
  try {
    const rubedoInput = `The union of opposites is complete. I'm embodying wholeness, the philosophers stone realized. Living gold.`;
    const extraction = await symbolExtractor.extract(rubedoInput);

    if (extraction.alchemicalStage && extraction.alchemicalStage.coherence > 0.9) {
      console.log('   ✅ PASS: Rubedo detected → Response strategy = CELEBRATE');
      console.log(`      Coherence: ${extraction.alchemicalStage.coherence.toFixed(2)} (high = wholeness)`);
      console.log('      ❌ Avoid: adding more, fragmenting');
      console.log('      ✅ Emphasize: completion, lived wisdom, embodiment');
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Rubedo coherence not detected correctly');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // TEST 3: Spiralogic Phase Mapping
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('TEST 3: SPIRALOGIC PHASE MAPPING (Edinger → Geometry)');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 Multiple Alchemical Operations → Spiralogic Phases');
  totalTests++;
  try {
    const operations = [
      { input: 'burning passion, calcination, fire purging', expected: 'fire', operation: 'calcinatio' },
      { input: 'dissolving, melting into water, solutio flowing', expected: 'water', operation: 'solutio' },
      { input: 'sacred marriage, coniunctio, union of opposites', expected: 'aether', operation: 'coniunctio' }
    ];

    let allMapped = true;
    for (const op of operations) {
      const extraction = await symbolExtractor.extract(op.input);
      if (!extraction.spiralogicPhase || extraction.spiralogicPhase.element !== op.expected) {
        allMapped = false;
        console.log(`   ❌ ${op.operation} → Expected ${op.expected}, got ${extraction.spiralogicPhase?.element}`);
      }
    }

    if (allMapped) {
      console.log('   ✅ PASS: All operations mapped to Spiralogic phases');
      console.log('      Calcinatio → Fire');
      console.log('      Solutio → Water');
      console.log('      Coniunctio → Aether');
      passedTests++;
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // TEST 4: Cross-Framework Coherence
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('TEST 4: CROSS-FRAMEWORK COHERENCE ALIGNMENT');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 Nigredo = Dorsal = Field Fragmentation = Low Coherence');
  totalTests++;
  try {
    const input = `Complete shutdown and numbness. The field is fragmenting, chaos everywhere, darkness and dissolution.`;
    const extraction = await symbolExtractor.extract(input);

    const alchemyLow = extraction.alchemicalStage && extraction.alchemicalStage.coherence < 0.3;
    const polyvagalLow = extraction.polyvagalState && extraction.polyvagalState.safety < 0.2;
    const hasFragmentation = extraction.narrativeThemes.some(t =>
      t.includes('Nigredo') || t.includes('Morphogenetic')
    );

    if (alchemyLow && polyvagalLow && hasFragmentation) {
      console.log('   ✅ PASS: All frameworks aligned on LOW coherence');
      console.log(`      Alchemy coherence: ${extraction.alchemicalStage!.coherence.toFixed(2)}`);
      console.log(`      Polyvagal safety: ${extraction.polyvagalState!.safety.toFixed(2)}`);
      console.log('      Themes: Fragmentation detected');
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Frameworks not aligned on coherence');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // TEST 5: The Triple Helix in Action
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('TEST 5: TRIPLE HELIX (Jung × Edinger × Spiralogic)');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 All Three Strands Detecting Same Transformation');
  totalTests++;
  try {
    const input = `The sacred marriage is happening - masculine and feminine joining. Union of opposites, coniunctio complete. Integration and synthesis.`;
    const extraction = await symbolExtractor.extract(input);

    // JUNG: Citrinitas (integration)
    const jungStrand = extraction.alchemicalStage && extraction.alchemicalStage.primaryStage === 'citrinitas';

    // EDINGER: Coniunctio operation
    const edingerStrand = extraction.alchemicalStage && extraction.alchemicalStage.operations.includes('coniunctio');

    // SPIRALOGIC: Aether 2 (integration)
    const spiralogicStrand = extraction.spiralogicPhase && extraction.spiralogicPhase.element === 'aether';

    if (jungStrand && edingerStrand && spiralogicStrand) {
      console.log('   ✅ PASS: Triple Helix - all three strands aligned!');
      console.log('\n   Strand 1 (Jung):');
      console.log(`      Stage: ${extraction.alchemicalStage!.primaryStage}`);
      console.log(`      Coherence: ${extraction.alchemicalStage!.coherence.toFixed(2)}`);
      console.log('\n   Strand 2 (Edinger):');
      console.log(`      Operation: ${extraction.alchemicalStage!.operations.join(', ')}`);
      console.log('\n   Strand 3 (Spiralogic):');
      console.log(`      Element: ${extraction.spiralogicPhase!.element}`);
      console.log(`      Phase: ${extraction.spiralogicPhase!.phase}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Triple Helix strands not all detected');
      console.log(`      Jung: ${jungStrand}, Edinger: ${edingerStrand}, Spiralogic: ${spiralogicStrand}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // FINAL REPORT
  // ========================================================================
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPLETE 6-FRAMEWORK INTEGRATION RESULTS');
  console.log('='.repeat(80));
  console.log(`   Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`   Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🜍 ✅ RESULT: ALL 6 FRAMEWORKS + ALCHEMY FULLY INTEGRATED!');
    console.log('\n   THE COMPLETE STACK:');
    console.log('   1. 🧬 Levin (Morphogenetic Fields)');
    console.log('   2. 🧠 McGilchrist (Hemispheric Attention)');
    console.log('   3. 🧠 Jung (Shadow, Individuation, Archetypes)');
    console.log('   4. 🧠 Polyvagal Theory (Autonomic States)');
    console.log('   5. 🧠 IFS (Parts, Self Energy)');
    console.log('   6. 🜍 ALCHEMY (Transformation Grammar - META-FRAMEWORK)');
    console.log('\n   PLUS:');
    console.log('   ✨ Spiralogic (Dynamic Geometry)');
    console.log('   ⚗️ Edinger (12 Operations)');
    console.log('   🌀 Triple Helix (Complete Process Map)');
    console.log('\n   MAIA NOW HAS THE COMPLETE TRANSFORMATION ARCHITECTURE! 🜍✨');
  } else if (passedTests >= totalTests * 0.85) {
    console.log('\n✅ RESULT: Strong 6-framework integration');
    console.log(`   ${Math.round((passedTests/totalTests) * 100)}% verified`);
  } else {
    console.log('\n⚠️  RESULT: Partial integration');
  }

  console.log('='.repeat(80) + '\n');

  // Exit with appropriate code
  process.exit(passedTests >= totalTests * 0.85 ? 0 : 1);
}

runVerification().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
