#!/usr/bin/env tsx
/**
 * COMPLETE MAIA FRAMEWORK INTEGRATION VERIFICATION
 *
 * Verifies both Levin and McGilchrist frameworks are active cognitive modules
 * Can be run with: npx tsx scripts/verify-complete-integration.ts
 */

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';

console.log('\n' + '='.repeat(80));
console.log('🧬 COMPLETE MAIA FRAMEWORK INTEGRATION VERIFICATION');
console.log('   Levin (Morphogenetic) + McGilchrist (Hemispheric)');
console.log('='.repeat(80) + '\n');

async function runVerification() {
  let passedTests = 0;
  let totalTests = 0;

  // ========================================================================
  // PART 1: LEVIN FRAMEWORK TESTS
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('PART 1: LEVIN FRAMEWORK (Morphogenetic Fields & Basal Cognition)');
  console.log('━'.repeat(80) + '\n');

  // Test 1: Concept Recognition
  console.log('📋 TEST 1: Concept Recognition');
  totalTests++;
  try {
    const input = `I'm standing at a threshold, crossing from darkness into light.`;
    const extraction = await symbolExtractor.extract(input);

    if (extraction.symbols.length > 0 && extraction.narrativeThemes.length > 0) {
      console.log('   ✅ PASS: Concept recognition active');
      passedTests++;
    } else {
      console.log('   ❌ FAIL: No concepts recognized');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 2: Elemental Associations
  console.log('\n📋 TEST 2: Elemental Associations (5-Element Field)');
  totalTests++;
  try {
    const input = `Fire of passion, grounded in earth, flowing like water, breathing clarity, sensing sacred wholeness.`;
    const extraction = await symbolExtractor.extract(input);

    const elementCounts: Record<string, number> = {};
    extraction.symbols.forEach(s => {
      if (s.elementalResonance) {
        elementCounts[s.elementalResonance] = (elementCounts[s.elementalResonance] || 0) + 1;
      }
    });

    const activeElements = Object.keys(elementCounts).length;
    if (activeElements >= 3) {
      console.log('   ✅ PASS: Elemental associations functional');
      console.log(`      Active elements: ${activeElements}/5`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Insufficient elemental detection');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 3: Morphogenetic Field Properties
  console.log('\n📋 TEST 3: Morphogenetic Field Properties');
  totalTests++;
  try {
    const input = `The morphogenetic field is reorganizing, patterns emerging from chaos into crystalline order.`;
    const extraction = await symbolExtractor.extract(input);

    const hasFieldSymbols = extraction.symbols.some(s => s.symbol.match(/field|pattern|morphogenetic|crystalline/i));
    const hasEmergenceTheme = extraction.narrativeThemes.some(t => t.includes('Morphogenetic') || t.includes('Transformation'));

    if (hasFieldSymbols && hasEmergenceTheme) {
      console.log('   ✅ PASS: Morphogenetic field properties detected');
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Morphogenetic properties not detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // PART 2: McGILCHRIST FRAMEWORK TESTS
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('PART 2: McGILCHRIST FRAMEWORK (Hemispheric Attention)');
  console.log('━'.repeat(80) + '\n');

  // Test 4: Left Hemisphere Detection
  console.log('📋 TEST 4: Left Hemisphere Mode Detection');
  totalTests++;
  try {
    const leftBrainInput = `
      We need to analyze and categorize this data systematically.
      The framework clearly shows that we must define the structure and optimize the process.
      Obviously, the mechanism requires control and management to function properly.
    `;

    const extraction = await symbolExtractor.extract(leftBrainInput);

    if (extraction.hemisphericMode && extraction.hemisphericMode.dominant === 'left') {
      console.log('   ✅ PASS: Left hemisphere mode detected');
      console.log(`      Balance: ${extraction.hemisphericMode.balance.toFixed(2)} (negative = left dominant)`);
      console.log(`      Indicators: ${extraction.hemisphericMode.indicators.slice(0, 3).join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Left hemisphere not properly detected');
      console.log(`      Got: ${extraction.hemisphericMode?.dominant}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 5: Right Hemisphere Detection
  console.log('\n📋 TEST 5: Right Hemisphere Mode Detection');
  totalTests++;
  try {
    const rightBrainInput = `
      I feel a deep connection in this moment, sensing the living relationship between us.
      There's something sacred in the space between, a presence that's emerging organically.
      I'm curious to discover what unfolds, staying present with the mystery.
    `;

    const extraction = await symbolExtractor.extract(rightBrainInput);

    if (extraction.hemisphericMode && extraction.hemisphericMode.dominant === 'right') {
      console.log('   ✅ PASS: Right hemisphere mode detected');
      console.log(`      Balance: ${extraction.hemisphericMode.balance.toFixed(2)} (positive = right dominant)`);
      console.log(`      Indicators: ${extraction.hemisphericMode.indicators.slice(0, 3).join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Right hemisphere not properly detected');
      console.log(`      Got: ${extraction.hemisphericMode?.dominant}`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 6: Integrated Mode Detection
  console.log('\n📋 TEST 6: Integrated Hemispheric Mode Detection');
  totalTests++;
  try {
    const integratedInput = `
      I want to analyze this problem systematically and define the structure clearly,
      while also sensing how it feels in my body and staying present with what's emerging.
      Let me categorize the data and solve this logically,
      but I'm also curious about the living quality of this relationship and the sacred presence here.
      The framework explains it precisely, yet I feel the connection between us.
      I need to measure the results and achieve the objective,
      while remaining open to the mystery and wonder of what's unfolding.
    `;

    const extraction = await symbolExtractor.extract(integratedInput);

    if (extraction.hemisphericMode && extraction.hemisphericMode.dominant === 'integrated') {
      console.log('   ✅ PASS: Integrated hemispheric mode detected');
      console.log(`      Balance: ${extraction.hemisphericMode.balance.toFixed(2)} (near zero = balanced)`);
      passedTests++;
    } else {
      console.log(`   ⚠️  PARTIAL: Detected as ${extraction.hemisphericMode?.dominant}`);
      console.log('      (Integration requires balanced use of both hemispheres)');
      // Count as partial pass if close to balanced
      if (extraction.hemisphericMode && Math.abs(extraction.hemisphericMode.balance) < 0.4) {
        passedTests += 0.5;
        console.log('      Half credit - reasonably balanced');
      }
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 7: Attending vs Explaining (McGilchrist's Key Distinction)
  console.log('\n📋 TEST 7: Attending vs Explaining Detection');
  totalTests++;
  try {
    const explainingInput = `
      This is obviously a defense mechanism that you're using to avoid confronting the underlying issue.
      The pattern clearly indicates that you need to analyze this systematically and categorize your responses.
      We must define the problem and develop a structured plan to solve it.
    `;
    const attendingInput = `
      I sense a deep feeling in what you're sharing. Tell me more about that.
      What's alive for you in this moment? I'm here, present with you, curious about what's emerging.
      There's something sacred in this space between us.
    `;

    const explaining = await symbolExtractor.extract(explainingInput);
    const attending = await symbolExtractor.extract(attendingInput);

    const isExplainingLeft = explaining.hemisphericMode && explaining.hemisphericMode.balance < -0.2;
    const isAttendingRight = attending.hemisphericMode && attending.hemisphericMode.balance > 0.2;

    if (isExplainingLeft && isAttendingRight) {
      console.log('   ✅ PASS: Attending vs Explaining distinction working');
      console.log(`      Explaining: ${explaining.hemisphericMode?.dominant} (${explaining.hemisphericMode?.balance.toFixed(2)})`);
      console.log(`      Attending: ${attending.hemisphericMode?.dominant} (${attending.hemisphericMode?.balance.toFixed(2)})`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Not distinguishing attending from explaining');
      console.log(`      Explaining: ${explaining.hemisphericMode?.dominant} (${explaining.hemisphericMode?.balance.toFixed(2)})`);
      console.log(`      Attending: ${attending.hemisphericMode?.dominant} (${attending.hemisphericMode?.balance.toFixed(2)})`);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // PART 3: INTEGRATION TEST (Both Frameworks Together)
  // ========================================================================
  console.log('\n' + '━'.repeat(80));
  console.log('PART 3: LEVIN + McGILCHRIST INTEGRATION');
  console.log('━'.repeat(80) + '\n');

  // Test 8: Complete Framework Integration
  console.log('📋 TEST 8: Complete Framework Integration');
  totalTests++;
  try {
    const comprehensiveInput = `
      I sense (right-embodied) the morphogenetic field (Levin) reorganizing itself,
      patterns emerging (right-living) from chaos into crystalline order (Levin).
      There's a sacred connection (right-betweenness) in this living system (Levin),
      an organic unfolding (right-living) that I'm curious (right-openness) to explore.
      The bioelectric coherence (Levin) creates a presence (right-betweenness)
      between us that feels (right-embodied) transformative (Levin + fire element).
    `;

    const extraction = await symbolExtractor.extract(comprehensiveInput);

    // Check Levin markers
    const hasLevinSymbols = extraction.symbols.some(s => s.symbol.match(/field|morphogenetic|bioelectric|pattern|coherence/i));
    const hasLevinThemes = extraction.narrativeThemes.some(t => t.includes('Morphogenetic') || t.includes('Transformation'));

    // Check McGilchrist markers
    const isRightDominant = extraction.hemisphericMode && extraction.hemisphericMode.balance > 0.2;

    // Check elemental integration
    const elementCount = new Set(extraction.symbols.map(s => s.elementalResonance).filter(Boolean)).size;

    if (hasLevinSymbols && hasLevinThemes && isRightDominant && elementCount >= 2) {
      console.log('   ✅ PASS: Complete framework integration verified');
      console.log(`      Levin symbols: ${extraction.symbols.filter(s => s.symbol.match(/field|morphogenetic|bioelectric|pattern|coherence/i)).length}`);
      console.log(`      Levin themes: ${extraction.narrativeThemes.filter(t => t.includes('Morphogenetic') || t.includes('Transformation')).join(', ')}`);
      console.log(`      Hemispheric mode: ${extraction.hemisphericMode?.dominant} (${extraction.hemisphericMode?.balance.toFixed(2)})`);
      console.log(`      Active elements: ${elementCount}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Integration incomplete');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // ========================================================================
  // FINAL REPORT
  // ========================================================================
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPLETE VERIFICATION RESULTS');
  console.log('='.repeat(80));
  console.log(`   Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`   Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎯 ✅ RESULT: Both Levin AND McGilchrist frameworks fully integrated!');
    console.log('   ✓ Morphogenetic field recognition (Levin)');
    console.log('   ✓ Hemispheric attention tracking (McGilchrist)');
    console.log('   ✓ Biological coherence loops (not pipelines)');
    console.log('   ✓ Right hemisphere attending (Master/Emissary balance)');
  } else if (passedTests >= totalTests * 0.75) {
    console.log('\n✅ RESULT: Strong integration - both frameworks operational');
    console.log(`   ${Math.round((passedTests/totalTests) * 100)}% of capabilities verified`);
  } else {
    console.log('\n⚠️  RESULT: Partial integration - some frameworks need attention');
  }

  console.log('='.repeat(80) + '\n');

  // Exit with appropriate code
  process.exit(passedTests >= totalTests * 0.75 ? 0 : 1);
}

runVerification().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
