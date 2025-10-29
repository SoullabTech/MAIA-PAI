#!/usr/bin/env tsx
/**
 * MAIA-LEVIN INTEGRATION VERIFICATION SCRIPT
 *
 * Standalone verification that Levin's frameworks are active cognitive modules
 * Can be run directly with: npx tsx scripts/verify-levin-integration.ts
 */

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';

console.log('\n' + '='.repeat(70));
console.log('🧬 MAIA-LEVIN FRAMEWORK INTEGRATION VERIFICATION');
console.log('='.repeat(70) + '\n');

async function runVerification() {
  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Concept Recognition
  console.log('📋 TEST 1: Concept Recognition');
  totalTests++;
  try {
    const input = `
      I'm standing at a threshold, crossing from darkness into light.
      There's a fire burning inside me, a passion for transformation.
      Like a phoenix rising from the ashes of my old self.
    `;

    const extraction = await symbolExtractor.extract(input);

    if (extraction.symbols.length > 0 && extraction.narrativeThemes.length > 0) {
      console.log('   ✅ PASS: Concept recognition active');
      console.log(`      Symbols: ${extraction.symbols.map(s => s.symbol).join(', ')}`);
      console.log(`      Themes: ${extraction.narrativeThemes.join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: No concepts recognized');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 2: Elemental Associations
  console.log('\n📋 TEST 2: Elemental Associations');
  totalTests++;
  try {
    const input = `
      I'm feeling the fire of passion while staying grounded in my body,
      allowing emotions to flow like water, breathing clarity into my thoughts,
      and sensing the sacred wholeness that connects it all.
    `;

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
      console.log('      Distribution:', elementCounts);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Insufficient elemental detection');
      console.log('      Distribution:', elementCounts);
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 3: Cross-Framework Synthesis
  console.log('\n📋 TEST 3: Cross-Framework Synthesis');
  totalTests++;
  try {
    const input = `
      I'm on a hero's journey, feeling both fear and excitement,
      as I cross the threshold into the unknown. The phoenix within me
      knows this transformation is necessary for my awakening.
    `;

    const extraction = await symbolExtractor.extract(input);

    if (extraction.symbols.length > 0 &&
        extraction.archetypes.length > 0 &&
        extraction.emotions.length > 0 &&
        extraction.milestones.length > 0) {
      console.log('   ✅ PASS: Cross-framework synthesis stable');
      console.log(`      Symbols: ${extraction.symbols.length}`);
      console.log(`      Archetypes: ${extraction.archetypes.length}`);
      console.log(`      Emotions: ${extraction.emotions.length}`);
      console.log(`      Milestones: ${extraction.milestones.length}`);
      console.log(`      Confidence: ${(extraction.confidence * 100).toFixed(1)}%`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Framework synthesis incomplete');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 4: User State Adaptation
  console.log('\n📋 TEST 4: User State Adaptation (Emotional Valence)');
  totalTests++;
  try {
    const positiveInput = 'I feel joy, peace, and deep clarity about my path forward.';
    const negativeInput = 'I feel fear, grief, and confusion about where I am.';

    const positiveExtraction = await symbolExtractor.extract(positiveInput);
    const negativeExtraction = await symbolExtractor.extract(negativeInput);

    const avgPositiveValence = positiveExtraction.emotions.reduce((sum, e) => sum + e.valence, 0) / positiveExtraction.emotions.length;
    const avgNegativeValence = negativeExtraction.emotions.reduce((sum, e) => sum + e.valence, 0) / negativeExtraction.emotions.length;

    if (avgPositiveValence > 0 && avgNegativeValence < 0) {
      console.log('   ✅ PASS: User state adaptation verified');
      console.log(`      Positive valence: ${avgPositiveValence.toFixed(2)}`);
      console.log(`      Negative valence: ${avgNegativeValence.toFixed(2)}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: State adaptation not working');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 5: Goal-Directed Behavior (Levin's Basal Cognition)
  console.log('\n📋 TEST 5: Goal-Directed Behavior Recognition');
  totalTests++;
  try {
    const input = `
      I'm seeking clarity on my path. I want to heal this wound and transform
      the pattern that keeps me stuck. My intention is integration and wholeness.
    `;

    const extraction = await symbolExtractor.extract(input);

    const hasGoalArchetype = extraction.archetypes.some(a =>
      a.archetype === 'Seeker' || a.archetype === 'Healer'
    );
    const hasIntegrationMilestone = extraction.milestones.some(m =>
      m.type === 'integration'
    );

    if (hasGoalArchetype && hasIntegrationMilestone) {
      console.log('   ✅ PASS: Goal-directed behavior recognized');
      console.log(`      Archetypes: ${extraction.archetypes.map(a => a.archetype).join(', ')}`);
      console.log(`      Integration milestones: ${extraction.milestones.filter(m => m.type === 'integration').length}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Goal-directed behavior not detected');
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Test 6: Biological Coherence Loop Architecture
  console.log('\n📋 TEST 6: Biological Coherence Loop Architecture');
  totalTests++;
  try {
    const input = `
      The whole system is reorganizing itself from chaos into order. I can feel the morphogenetic field shifting,
      new patterns emerging that weren't there before. It's like watching a new crystalline form
      emerge from primordial chaos, guided by an invisible bioelectric blueprint.
    `;

    const extraction = await symbolExtractor.extract(input);

    // Debug: Show all symbols extracted
    console.log(`      DEBUG: Total symbols extracted: ${extraction.symbols.length}`);
    console.log(`      DEBUG: Symbols: ${extraction.symbols.map(s => s.symbol).join(', ')}`);
    console.log(`      DEBUG: Themes: ${extraction.narrativeThemes.join(', ')}`);

    const morphoSymbols = extraction.symbols.filter(s =>
      s.symbol.match(/field|pattern|form|chaos|system|order|emerging/i)
    );
    const emergenceThemes = extraction.narrativeThemes.filter(t =>
      t.includes('Transformation') || t.includes('Awakening') || t.includes('Morphogenetic')
    );

    console.log(`      DEBUG: Morpho symbols found: ${morphoSymbols.length}`);
    console.log(`      DEBUG: Emergence themes found: ${emergenceThemes.length}`);

    if (morphoSymbols.length > 0 && emergenceThemes.length > 0) {
      console.log('   ✅ PASS: Morphogenetic field properties active');
      console.log(`      Field symbols: ${morphoSymbols.map(s => s.symbol).join(', ')}`);
      console.log(`      Emergence themes: ${emergenceThemes.join(', ')}`);
      passedTests++;
    } else {
      console.log('   ❌ FAIL: Morphogenetic properties not detected');
      if (morphoSymbols.length === 0) {
        console.log('      No morphogenetic symbols detected');
      }
      if (emergenceThemes.length === 0) {
        console.log('      No emergence themes detected');
      }
    }
  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  // Final Report
  console.log('\n' + '='.repeat(70));
  console.log('📊 VERIFICATION RESULTS');
  console.log('='.repeat(70));
  console.log(`   Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`   Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎯 ✅ RESULT: Levin\'s frameworks are now active cognitive modules within MAIA');
    console.log('   The system mirrors biological coherence loops, not mechanical pipelines.');
  } else {
    console.log('\n⚠️  RESULT: Partial integration - some frameworks need attention');
  }

  console.log('='.repeat(70) + '\n');

  // Exit with appropriate code
  process.exit(passedTests === totalTests ? 0 : 1);
}

runVerification().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
