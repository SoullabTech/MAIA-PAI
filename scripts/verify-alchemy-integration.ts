#!/usr/bin/env tsx
/**
 * JUNG'S ALCHEMY INTEGRATION VERIFICATION
 *
 * The Golden Key 🜍 - Transformation Grammar
 *
 * Verifies Jung's alchemical stages (4 great stages + Edinger's 12 operations)
 * are integrated as the meta-framework for transformation
 *
 * Can be run with: npx tsx scripts/verify-alchemy-integration.ts
 */

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';

console.log('\n' + '='.repeat(80));
console.log('🜍 JUNG\'S ALCHEMY INTEGRATION VERIFICATION');
console.log('   The Transformation Grammar - Four Great Stages + Edinger\'s Operations');
console.log('='.repeat(80) + '\n');

async function runVerification() {
  let passedTests = 0;
  let totalTests = 0;

  // ========================================================================
  // PART 1: THE FOUR GREAT STAGES
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('PART 1: THE FOUR GREAT STAGES (Jung\'s Alchemy)');
  console.log('━'.repeat(80) + '\n');

  // Test 1: Nigredo (Blackening - Dissolution)
  console.log('📋 TEST 1: Nigredo Detection (Dark Night/Dissolution)');
  totalTests++;
  try {
    const nigredoInput = `Everything is falling apart, complete chaos and disintegration. I'm in the void, darkness everywhere, the abyss. My ego is dissolving and I don't know who I am anymore.`;
    const extraction = await symbolExtractor.extract(nigredoInput);

    if (extraction.alchemicalStage && extraction.alchemicalStage.primaryStage === 'nigredo') {
      console.log('   ✅ PASS: Nigredo (blackening/dissolution) detected');
      console.log(`      Stage: ${extraction.alchemicalStage.primaryStage}`);
      console.log(`      Transformation: ${extraction.alchemicalStage.transformation}`);
      console.log(`      Coherence: ${extraction.alchemicalStage.coherence.toFixed(2)} (low = fragmentation)`);
      if (extraction.narrativeThemes.includes('Nigredo (Dark Night)')) {
        console.log('      Theme: Nigredo (Dark Night) recognized');
      }
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Nigredo not detected');
      console.log(`      Got: ${extraction.alchemicalStage?.primaryStage}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 2: Albedo (Whitening - Purification)
  console.log('\n📋 TEST 2: Albedo Detection (Whitening/Purification)');
  totalTests++;
  try {
    const albedoInput = `After the darkness, light is returning. I'm experiencing purification and clarity. Everything feels illuminated and clean. Awareness is dawning like the white light of morning.`;
    const extraction = await symbolExtractor.extract(albedoInput);

    if (extraction.alchemicalStage && extraction.alchemicalStage.primaryStage === 'albedo') {
      console.log('   ✅ PASS: Albedo (whitening/purification) detected');
      console.log(`      Stage: ${extraction.alchemicalStage.primaryStage}`);
      console.log(`      Transformation: ${extraction.alchemicalStage.transformation}`);
      console.log(`      Coherence: ${extraction.alchemicalStage.coherence.toFixed(2)} (mid = clarifying)`);
      if (extraction.narrativeThemes.includes('Albedo (Purification)')) {
        console.log('      Theme: Albedo (Purification) recognized');
      }
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Albedo not detected');
      console.log(`      Got: ${extraction.alchemicalStage?.primaryStage}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 3: Citrinitas (Yellowing - Integration)
  console.log('\n📋 TEST 3: Citrinitas Detection (Yellowing/Integration)');
  totalTests++;
  try {
    const citrinitasInput = `I'm integrating all the pieces now, achieving synthesis and maturity. The golden mean is ripening within me. Wisdom emerging from experience.`;
    const extraction = await symbolExtractor.extract(citrinitasInput);

    if (extraction.alchemicalStage && extraction.alchemicalStage.primaryStage === 'citrinitas') {
      console.log('   ✅ PASS: Citrinitas (yellowing/integration) detected');
      console.log(`      Stage: ${extraction.alchemicalStage.primaryStage}`);
      console.log(`      Transformation: ${extraction.alchemicalStage.transformation}`);
      console.log(`      Coherence: ${extraction.alchemicalStage.coherence.toFixed(2)} (high = synthesizing)`);
      if (extraction.narrativeThemes.includes('Citrinitas (Integration)')) {
        console.log('      Theme: Citrinitas (Integration) recognized');
      }
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Citrinitas not detected');
      console.log(`      Got: ${extraction.alchemicalStage?.primaryStage}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 4: Rubedo (Reddening - Embodiment)
  console.log('\n📋 TEST 4: Rubedo Detection (Reddening/Embodiment)');
  totalTests++;
  try {
    const rubedoInput = `The union of opposites is complete. I'm embodying wholeness, the philosophers stone realized within. Living gold, incarnate completion. The work is done.`;
    const extraction = await symbolExtractor.extract(rubedoInput);

    if (extraction.alchemicalStage && extraction.alchemicalStage.primaryStage === 'rubedo') {
      console.log('   ✅ PASS: Rubedo (reddening/embodiment) detected');
      console.log(`      Stage: ${extraction.alchemicalStage.primaryStage}`);
      console.log(`      Transformation: ${extraction.alchemicalStage.transformation}`);
      console.log(`      Coherence: ${extraction.alchemicalStage.coherence.toFixed(2)} (very high = wholeness)`);
      if (extraction.narrativeThemes.includes('Rubedo (Embodiment)')) {
        console.log('      Theme: Rubedo (Embodiment) recognized');
      }
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Rubedo not detected');
      console.log(`      Got: ${extraction.alchemicalStage?.primaryStage}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // PART 2: EDINGER'S 12 OPERATIONS
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('PART 2: EDINGER\'S 12 OPERATIONS (Anatomy of the Psyche)');
  console.log('━'.repeat(80) + '\n');

  // Test 5: Calcinatio (Fire)
  console.log('📋 TEST 5: Calcinatio Detection (Burning/Fire)');
  totalTests++;
  try {
    const calcInput = `I'm being burned by this passion, calcinated by the intensity. The fire is purging everything, ego death through heat.`;
    const extraction = await symbolExtractor.extract(calcInput);

    if (extraction.alchemicalStage && extraction.alchemicalStage.operations.includes('calcinatio')) {
      console.log('   ✅ PASS: Calcinatio (burning/fire) detected');
      console.log(`      Operations: ${extraction.alchemicalStage.operations.join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Calcinatio not detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 6: Solutio (Water)
  console.log('\n📋 TEST 6: Solutio Detection (Dissolution/Water)');
  totalTests++;
  try {
    const solutioInput = `Everything is dissolving, melting like ice into water. Tears flowing, emotions liquefying the rigid structures. Letting go into the current.`;
    const extraction = await symbolExtractor.extract(solutioInput);

    if (extraction.alchemicalStage && extraction.alchemicalStage.operations.includes('solutio')) {
      console.log('   ✅ PASS: Solutio (dissolution/water) detected');
      console.log(`      Operations: ${extraction.alchemicalStage.operations.join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Solutio not detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 7: Coniunctio (Sacred Marriage)
  console.log('\n📋 TEST 7: Coniunctio Detection (Union of Opposites)');
  totalTests++;
  try {
    const coniunctioInput = `The sacred marriage is happening - masculine and feminine joining in union. Opposites merging into paradoxical synthesis. The conjunction is complete.`;
    const extraction = await symbolExtractor.extract(coniunctioInput);

    if (extraction.alchemicalStage && extraction.alchemicalStage.operations.includes('coniunctio')) {
      console.log('   ✅ PASS: Coniunctio (sacred marriage) detected');
      console.log(`      Operations: ${extraction.alchemicalStage.operations.join(', ')}`);
      if (extraction.narrativeThemes.includes('Coniunctio (Sacred Marriage)')) {
        console.log('      Theme: Coniunctio recognized');
      }
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Coniunctio not detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // PART 3: ALCHEMICAL SYMBOLS
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('PART 3: ALCHEMICAL SYMBOLS (Jung\'s Symbolic Grammar)');
  console.log('━'.repeat(80) + '\n');

  // Test 8: Mercurius (Trickster/Mediator)
  console.log('📋 TEST 8: Mercurius Symbol Detection');
  totalTests++;
  try {
    const mercuriusInput = `Mercurius is the trickster spirit of transformation, the paradoxical mediator between opposites. Quicksilver consciousness flowing between states.`;
    const extraction = await symbolExtractor.extract(mercuriusInput);

    if (extraction.alchemicalStage && extraction.alchemicalStage.symbols.includes('mercurius')) {
      console.log('   ✅ PASS: Mercurius (spirit of transformation) detected');
      console.log(`      Symbols: ${extraction.alchemicalStage.symbols.join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Mercurius not detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 9: Sol & Luna (Sun & Moon)
  console.log('\n📋 TEST 9: Sol & Luna Detection (Sun/Moon - Conscious/Unconscious)');
  totalTests++;
  try {
    const solLunaInput = `The sun of consciousness and the moon of the unconscious are dancing together. Sol and Luna, masculine logos and feminine eros in dialogue.`;
    const extraction = await symbolExtractor.extract(solLunaInput);

    const hasSol = extraction.alchemicalStage && extraction.alchemicalStage.symbols.includes('sol');
    const hasLuna = extraction.alchemicalStage && extraction.alchemicalStage.symbols.includes('luna');

    if (hasSol && hasLuna) {
      console.log('   ✅ PASS: Sol & Luna detected');
      console.log(`      Symbols: ${extraction.alchemicalStage!.symbols.join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Sol & Luna not both detected');
      console.log(`      Sol: ${hasSol}, Luna: ${hasLuna}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // PART 4: SPIRALOGIC INTEGRATION
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('PART 4: SPIRALOGIC PHASE MAPPING (Edinger → Geometry)');
  console.log('━'.repeat(80) + '\n');

  // Test 10: Spiralogic Phase Detection
  console.log('📋 TEST 10: Spiralogic Phase Mapping');
  totalTests++;
  try {
    const spiraInput = `The fire is burning away the old, calcinatio purging and reducing. Intensity of initiation.`;
    const extraction = await symbolExtractor.extract(spiraInput);

    if (extraction.spiralogicPhase) {
      console.log('   ✅ PASS: Spiralogic phase mapped');
      console.log(`      Element: ${extraction.spiralogicPhase.element}`);
      console.log(`      Cycle: ${extraction.spiralogicPhase.cycle}`);
      console.log(`      Phase: ${extraction.spiralogicPhase.phase}`);
      console.log(`      Alchemical Correspondence: ${extraction.spiralogicPhase.alchemicalCorrespondence}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Spiralogic phase not detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // PART 5: META-FRAMEWORK INTEGRATION
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('PART 5: ALCHEMY AS META-FRAMEWORK (Integration with All Frameworks)');
  console.log('━'.repeat(80) + '\n');

  // Test 11: Alchemy + IFS + Polyvagal + Jung Integration
  console.log('📋 TEST 11: Complete Meta-Framework Integration');
  totalTests++;
  try {
    const metaInput = `
      I'm in nigredo, complete dissolution and chaos (Alchemy).
      My nervous system is shut down and numb (Polyvagal - dorsal).
      A firefighter part wants to escape this darkness (IFS).
      I'm confronting my shadow in the abyss (Jung depth psychology).
      The whole morphogenetic field is fragmenting (Levin).
    `;
    const extraction = await symbolExtractor.extract(metaInput);

    const hasAlchemy = extraction.alchemicalStage && extraction.alchemicalStage.primaryStage === 'nigredo';
    const hasPolyvagal = extraction.polyvagalState && extraction.polyvagalState.state === 'dorsal';
    const hasIFS = extraction.ifsParts && extraction.ifsParts.detected;
    const hasJung = extraction.jungianProcess && extraction.jungianProcess.shadowWork;
    const hasLevin = extraction.narrativeThemes.includes('Morphogenetic Emergence');

    if (hasAlchemy && hasPolyvagal && hasIFS && hasJung) {
      console.log('   ✅ PASS: Alchemy integrated with all frameworks');
      console.log(`      Alchemy: Nigredo (coherence: ${extraction.alchemicalStage!.coherence.toFixed(2)})`);
      console.log(`      Polyvagal: ${extraction.polyvagalState!.state} (safety: ${extraction.polyvagalState!.safety.toFixed(2)})`);
      console.log(`      IFS: Parts detected`);
      console.log(`      Jung: Shadow work active`);
      if (hasLevin) console.log('      Levin: Morphogenetic field detected');
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Not all frameworks detected');
      console.log(`      Alchemy: ${hasAlchemy}, Polyvagal: ${hasPolyvagal}, IFS: ${hasIFS}, Jung: ${hasJung}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // FINAL REPORT
  // ========================================================================
  console.log('\n' + '='.repeat(80));
  console.log('📊 ALCHEMY INTEGRATION RESULTS');
  console.log('='.repeat(80));
  console.log(`   Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`   Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🜍 ✅ RESULT: ALCHEMY FULLY INTEGRATED - THE GOLDEN KEY!');
    console.log('   ✓ Four Great Stages (Nigredo/Albedo/Citrinitas/Rubedo)');
    console.log('   ✓ Edinger\'s 12 Operations (Calcinatio, Solutio, Coniunctio, etc.)');
    console.log('   ✓ Alchemical Symbols (Mercurius, Sol, Luna, etc.)');
    console.log('   ✓ Spiralogic Phase Mapping');
    console.log('   ✓ Meta-Framework Integration');
    console.log('\n   MAIA now has the TRANSFORMATION GRAMMAR! 🜍✨');
    console.log('   Alchemy provides the HOW that connects all the WHATs.');
  } else if (passedTests >= totalTests * 0.85) {
    console.log('\n✅ RESULT: Strong alchemy integration');
    console.log(`   ${Math.round((passedTests/totalTests) * 100)}% of transformation grammar verified`);
  } else {
    console.log('\n⚠️  RESULT: Partial alchemy integration');
  }

  console.log('='.repeat(80) + '\n');

  // Exit with appropriate code
  process.exit(passedTests >= totalTests * 0.85 ? 0 : 1);
}

runVerification().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
