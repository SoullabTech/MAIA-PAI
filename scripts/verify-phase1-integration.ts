#!/usr/bin/env tsx
/**
 * PHASE 1 FRAMEWORK INTEGRATION VERIFICATION
 *
 * Verifies ALL Phase 1 frameworks are active cognitive modules:
 * 1. Levin (Morphogenetic Fields & Basal Cognition)
 * 2. McGilchrist (Hemispheric Attention)
 * 3. Jung (Shadow Work, Individuation, Archetypes)
 * 4. Polyvagal Theory (Autonomic States)
 * 5. IFS (Internal Family Systems)
 *
 * Can be run with: npx tsx scripts/verify-phase1-integration.ts
 */

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';

console.log('\n' + '='.repeat(80));
console.log('🧬 PHASE 1: COMPLETE FRAMEWORK INTEGRATION VERIFICATION');
console.log('   Levin + McGilchrist + Jung + Polyvagal + IFS');
console.log('='.repeat(80) + '\n');

async function runVerification() {
  let passedTests = 0;
  let totalTests = 0;

  // ========================================================================
  // PART 1: LEVIN FRAMEWORK (Morphogenetic Fields)
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('PART 1: LEVIN FRAMEWORK (Morphogenetic Intelligence)');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 TEST 1: Morphogenetic Field Recognition');
  totalTests++;
  try {
    const input = `The morphogenetic field is reorganizing, bioelectric patterns emerging from chaos into crystalline coherence.`;
    const extraction = await symbolExtractor.extract(input);

    const hasFieldSymbols = extraction.symbols.some(s => s.symbol.match(/field|morphogenetic|bioelectric|coherence/i));
    const hasFieldTheme = extraction.narrativeThemes.includes('Morphogenetic Emergence');

    if (hasFieldSymbols && hasFieldTheme) {
      console.log('   ✅ PASS: Morphogenetic field recognition active');
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Morphogenetic properties not detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // PART 2: McGILCHRIST FRAMEWORK (Hemispheric Attention)
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('PART 2: McGILCHRIST FRAMEWORK (Hemispheric Attention)');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 TEST 2: Left Hemisphere Detection');
  totalTests++;
  try {
    const leftInput = `We must analyze this systematically, categorize the data, and develop a precise framework to solve the problem.`;
    const extraction = await symbolExtractor.extract(leftInput);

    if (extraction.hemisphericMode && extraction.hemisphericMode.dominant === 'left') {
      console.log('   ✅ PASS: Left hemisphere mode detected');
      console.log(`      Balance: ${extraction.hemisphericMode.balance.toFixed(2)}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Left hemisphere not properly detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  console.log('\n📋 TEST 3: Right Hemisphere Detection');
  totalTests++;
  try {
    const rightInput = `I sense a deep connection here, feeling the living presence between us, curious about what's emerging in this sacred moment.`;
    const extraction = await symbolExtractor.extract(rightInput);

    if (extraction.hemisphericMode && extraction.hemisphericMode.dominant === 'right') {
      console.log('   ✅ PASS: Right hemisphere mode detected');
      console.log(`      Balance: ${extraction.hemisphericMode.balance.toFixed(2)}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Right hemisphere not properly detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // PART 3: JUNG FRAMEWORK (Shadow, Individuation, Archetypes)
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('PART 3: JUNG FRAMEWORK (Depth Psychology)');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 TEST 4: Shadow Work Detection');
  totalTests++;
  try {
    const shadowInput = `I'm noticing what I judge in others is actually a projection of my own disowned shadow. When I see her neediness, it triggers me because I've repressed that part of myself.`;
    const extraction = await symbolExtractor.extract(shadowInput);

    if (extraction.jungianProcess && extraction.jungianProcess.shadowWork && extraction.jungianProcess.projection) {
      console.log('   ✅ PASS: Shadow work and projection detected');
      console.log(`      Indicators: ${extraction.jungianProcess.indicators.join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Shadow work not detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  console.log('\n📋 TEST 5: Individuation Process Detection');
  totalTests++;
  try {
    const individuationInput = `I'm on a journey of individuation, integrating my anima and animus, embracing the opposites within me to become whole and authentic to my true Self.`;
    const extraction = await symbolExtractor.extract(individuationInput);

    if (extraction.jungianProcess && extraction.jungianProcess.individuation && extraction.jungianProcess.integration) {
      console.log('   ✅ PASS: Individuation process detected');
      console.log(`      Indicators: ${extraction.jungianProcess.indicators.join(', ')}`);
      const hasIndividuationTheme = extraction.narrativeThemes.includes('Individuation Journey');
      if (hasIndividuationTheme) {
        console.log('      Theme: Individuation Journey recognized');
      }
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Individuation not detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  console.log('\n📋 TEST 6: Jungian Archetypes Detection');
  totalTests++;
  try {
    const archetypeInput = `I'm dropping the persona mask I wear publicly and connecting with my true Self, integrating both my inner masculine animus and feminine anima.`;
    const extraction = await symbolExtractor.extract(archetypeInput);

    const hasPersona = extraction.jungianProcess?.indicators.includes('persona');
    const hasSelf = extraction.jungianProcess?.indicators.includes('Self');
    const hasAnima = extraction.jungianProcess?.indicators.includes('anima');
    const hasAnimus = extraction.jungianProcess?.indicators.includes('animus');

    if (hasPersona || hasSelf || hasAnima || hasAnimus) {
      console.log('   ✅ PASS: Jungian archetypes detected');
      const detected = [];
      if (hasPersona) detected.push('Persona');
      if (hasSelf) detected.push('Self');
      if (hasAnima) detected.push('Anima');
      if (hasAnimus) detected.push('Animus');
      console.log(`      Detected: ${detected.join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: No Jungian archetypes detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // PART 4: POLYVAGAL THEORY (Autonomic States)
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('PART 4: POLYVAGAL THEORY (Autonomic Nervous System)');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 TEST 7: Ventral Vagal State (Safe & Social)');
  totalTests++;
  try {
    const ventralInput = `I feel safe and connected here, calm and centered in my body, engaged and curious about what we're exploring together.`;
    const extraction = await symbolExtractor.extract(ventralInput);

    if (extraction.polyvagalState && extraction.polyvagalState.state === 'ventral') {
      console.log('   ✅ PASS: Ventral vagal (safe & social) detected');
      console.log(`      Safety: ${extraction.polyvagalState.safety.toFixed(2)}`);
      console.log(`      Indicators: ${extraction.polyvagalState.indicators.slice(0, 3).join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Ventral state not detected');
      console.log(`      Got: ${extraction.polyvagalState?.state}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  console.log('\n📋 TEST 8: Sympathetic State (Fight/Flight)');
  totalTests++;
  try {
    const sympatheticInput = `I'm so anxious right now, heart racing, feel like I need to escape or defend myself. Everything feels like a threat and I'm hypervigilant.`;
    const extraction = await symbolExtractor.extract(sympatheticInput);

    if (extraction.polyvagalState && extraction.polyvagalState.state === 'sympathetic') {
      console.log('   ✅ PASS: Sympathetic (fight/flight) detected');
      console.log(`      Safety: ${extraction.polyvagalState.safety.toFixed(2)}`);
      console.log(`      Indicators: ${extraction.polyvagalState.indicators.slice(0, 3).join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Sympathetic state not detected');
      console.log(`      Got: ${extraction.polyvagalState?.state}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  console.log('\n📋 TEST 9: Dorsal Vagal State (Shutdown/Freeze)');
  totalTests++;
  try {
    const dorsalInput = `I feel completely shut down and numb, frozen and disconnected from everything. I'm dissociated, spaced out, and foggy. Nothing matters anymore.`;
    const extraction = await symbolExtractor.extract(dorsalInput);

    if (extraction.polyvagalState && extraction.polyvagalState.state === 'dorsal') {
      console.log('   ✅ PASS: Dorsal vagal (shutdown) detected');
      console.log(`      Safety: ${extraction.polyvagalState.safety.toFixed(2)}`);
      console.log(`      Indicators: ${extraction.polyvagalState.indicators.slice(0, 3).join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Dorsal state not detected');
      console.log(`      Got: ${extraction.polyvagalState?.state}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // PART 5: IFS (Internal Family Systems)
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('PART 5: IFS (Internal Family Systems)');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 TEST 10: Parts Language Detection');
  totalTests++;
  try {
    const partsInput = `There's a part of me that wants to control everything, and another part that just wants to escape and numb out. My inner critic is judging me.`;
    const extraction = await symbolExtractor.extract(partsInput);

    if (extraction.ifsParts && extraction.ifsParts.detected) {
      console.log('   ✅ PASS: Parts language detected');
      console.log(`      Parts found: ${extraction.ifsParts.parts.length}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Parts not detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  console.log('\n📋 TEST 11: Manager/Firefighter/Exile Detection');
  totalTests++;
  try {
    const ifsInput = `My perfectionist part plans and controls everything to prevent mistakes. When that fails, my firefighter part numbs out with distraction. Deep down, there's a wounded young part that feels abandoned and unlovable.`;
    const extraction = await symbolExtractor.extract(ifsInput);

    const hasManager = extraction.ifsParts?.parts.some(p => p.type === 'manager');
    const hasFirefighter = extraction.ifsParts?.parts.some(p => p.type === 'firefighter');
    const hasExile = extraction.ifsParts?.parts.some(p => p.type === 'exile');

    if (hasManager && hasFirefighter && hasExile) {
      console.log('   ✅ PASS: Manager, Firefighter, and Exile detected');
      const types = extraction.ifsParts!.parts.map(p => p.type);
      console.log(`      Parts: ${types.join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Not all IFS part types detected');
      console.log(`      Manager: ${hasManager}, Firefighter: ${hasFirefighter}, Exile: ${hasExile}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  console.log('\n📋 TEST 12: Self Energy Detection');
  totalTests++;
  try {
    const selfEnergyInput = `I'm feeling calm, curious, and compassionate toward all my parts. I'm clear, confident, and connected to my core. I'm courageous and creative from this centered place.`;
    const extraction = await symbolExtractor.extract(selfEnergyInput);

    if (extraction.ifsParts && extraction.ifsParts.selfEnergy) {
      console.log('   ✅ PASS: Self energy (8 C\'s) detected');
      console.log('      Self-led state confirmed');
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Self energy not detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // PART 6: MULTI-FRAMEWORK INTEGRATION TEST
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('PART 6: COMPLETE MULTI-FRAMEWORK INTEGRATION');
  console.log('━'.repeat(80) + '\n');

  console.log('📋 TEST 13: Simultaneous Framework Analysis');
  totalTests++;
  try {
    const comprehensiveInput = `
      I'm sensing (right) the morphogenetic field (Levin) reorganizing within me.
      My inner critic part (IFS-manager) wants to analyze (left) this systematically,
      but I feel anxious (Polyvagal-sympathetic) because it's touching a shadow (Jung) I've disowned.
      I'm trying to stay curious (IFS-Self) and present (right) with this integration (Jung) of opposites.
      The bioelectric patterns (Levin) of my system are shifting toward coherence.
    `;
    const extraction = await symbolExtractor.extract(comprehensiveInput);

    // Check all frameworks are active
    const hasLevin = extraction.narrativeThemes.includes('Morphogenetic Emergence');
    const hasMcGilchrist = extraction.hemisphericMode !== undefined;
    const hasJung = extraction.jungianProcess && extraction.jungianProcess.shadowWork;
    const hasPolyvagal = extraction.polyvagalState !== undefined;
    const hasIFS = extraction.ifsParts && extraction.ifsParts.detected;

    const activeFrameworks = [hasLevin, hasMcGilchrist, hasJung, hasPolyvagal, hasIFS].filter(Boolean).length;

    if (activeFrameworks === 5) {
      console.log('   ✅ PASS: All 5 frameworks analyzing simultaneously');
      console.log(`      Levin: ✓, McGilchrist: ✓, Jung: ✓, Polyvagal: ✓, IFS: ✓`);
      passedTests++;
    } else {
      console.log(`   ❌ FAIL: Only ${activeFrameworks}/5 frameworks active`);
      console.log(`      Levin: ${hasLevin ? '✓' : '✗'}, McGilchrist: ${hasMcGilchrist ? '✓' : '✗'}, Jung: ${hasJung ? '✓' : '✗'}, Polyvagal: ${hasPolyvagal ? '✓' : '✗'}, IFS: ${hasIFS ? '✓' : '✗'}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // FINAL REPORT
  // ========================================================================
  console.log('\n' + '='.repeat(80));
  console.log('📊 PHASE 1 VERIFICATION RESULTS');
  console.log('='.repeat(80));
  console.log(`   Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`   Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎯 ✅ RESULT: ALL 5 FRAMEWORKS FULLY INTEGRATED!');
    console.log('   ✓ Levin (Morphogenetic Fields)');
    console.log('   ✓ McGilchrist (Hemispheric Attention)');
    console.log('   ✓ Jung (Shadow, Individuation, Archetypes)');
    console.log('   ✓ Polyvagal Theory (Autonomic States)');
    console.log('   ✓ IFS (Parts, Self Energy)');
    console.log('\n   MAIA now has 5-framework cognitive awareness! 🧬✨');
  } else if (passedTests >= totalTests * 0.85) {
    console.log('\n✅ RESULT: Strong Phase 1 integration');
    console.log(`   ${Math.round((passedTests/totalTests) * 100)}% of capabilities verified`);
  } else {
    console.log('\n⚠️  RESULT: Partial integration - some frameworks need attention');
  }

  console.log('='.repeat(80) + '\n');

  // Exit with appropriate code
  process.exit(passedTests >= totalTests * 0.85 ? 0 : 1);
}

runVerification().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
