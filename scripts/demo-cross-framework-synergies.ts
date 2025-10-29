#!/usr/bin/env tsx
/**
 * CROSS-FRAMEWORK SYNERGY DETECTION DEMO
 *
 * Demonstrates how MAIA detects transformation signatures
 * when 3+ frameworks align
 */

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';
import { crossFrameworkSynergyEngine } from '../lib/intelligence/CrossFrameworkSynergyEngine';

console.log('\n' + '='.repeat(80));
console.log('🌀 CROSS-FRAMEWORK SYNERGY DETECTION');
console.log('   Transformation Signatures: When 3+ Frameworks Align');
console.log('='.repeat(80) + '\n');

async function demo() {

  // ========================================================================
  // SCENARIO 1: Complete Shutdown Pattern
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('SCENARIO 1: COMPLETE SHUTDOWN PATTERN');
  console.log('━'.repeat(80) + '\n');

  const input1 = `
    Everything is falling apart (Nigredo). I'm completely frozen, numb, shut down.
    Can't move, can't feel. My body won't respond. I'm in total darkness.
    And I'm turning all this pain on myself. Blaming myself for not being able to handle it.
  `;

  console.log('📋 USER INPUT:');
  console.log('   "Everything falling apart... frozen, numb, shut down... turning pain on myself..."\n');

  const extraction1 = await symbolExtractor.extract(input1);
  const synergies1 = crossFrameworkSynergyEngine.detectSynergies(extraction1);

  console.log(`🔍 DETECTED ${synergies1.length} SYNERGIES:\n`);

  synergies1.forEach((sig, i) => {
    console.log(`   ${i + 1}. ${sig.name} (${sig.urgency.toUpperCase()})`);
    console.log(`      Frameworks: ${sig.frameworks.join(' + ')}`);
    console.log(`      Confidence: ${(sig.confidence * 100).toFixed(0)}%`);
    console.log(`      Meaning: ${sig.clinicalMeaning.substring(0, 100)}...`);
    console.log('');
  });

  const topSig1 = crossFrameworkSynergyEngine.getTopSignature(synergies1);
  if (topSig1) {
    console.log('💡 TOP PRIORITY SIGNATURE:\n');
    console.log(`   ${topSig1.name} (${topSig1.urgency})`);
    console.log(`   ${topSig1.description}\n`);
    console.log('   CLINICAL MEANING:');
    console.log(`   ${topSig1.clinicalMeaning}\n`);
    console.log('   THERAPEUTIC FOCUS:');
    console.log(`   ${topSig1.therapeuticFocus}\n`);
    console.log('   INTERVENTIONS:');
    topSig1.interventions.forEach(intervention => {
      console.log(`   • ${intervention}`);
    });
    console.log('');
  }

  // ========================================================================
  // SCENARIO 2: Trapped Fight Pattern
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('SCENARIO 2: TRAPPED FIGHT RESPONSE');
  console.log('━'.repeat(80) + '\n');

  const input2 = `
    I want to scream at them, push them away so badly. My jaw is clenched,
    shoulders raised and tight. But I'm holding it all in. Turning the rage
    on myself instead. My heart is racing but I can't let it out. I'm trying
    to analyze and fix this logically but the anger keeps building.
  `;

  console.log('📋 USER INPUT:');
  console.log('   "Want to scream... jaw clenched... turning rage on myself... trying to analyze..."\n');

  const extraction2 = await symbolExtractor.extract(input2);
  const synergies2 = crossFrameworkSynergyEngine.detectSynergies(extraction2);

  const topSig2 = crossFrameworkSynergyEngine.getTopSignature(synergies2);
  if (topSig2) {
    console.log('💡 SYNERGY DETECTED:\n');
    console.log(`   ${topSig2.name}`);
    console.log(`   Frameworks: ${topSig2.frameworks.join(' + ')}`);
    console.log(`   Urgency: ${topSig2.urgency.toUpperCase()}\n`);
    console.log('   THE PATTERN:');
    console.log(`   ${topSig2.clinicalMeaning}\n`);
    console.log('   WHAT TO DO:');
    topSig2.interventions.forEach(intervention => {
      console.log(`   • ${intervention}`);
    });
    console.log('');
  }

  // ========================================================================
  // SCENARIO 3: Trapped Flight Pattern
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('SCENARIO 3: TRAPPED FLIGHT RESPONSE');
  console.log('━'.repeat(80) + '\n');

  const input3 = `
    I want to run away, escape from all of this. My legs feel restless,
    need to move. Heart racing. But I should be able to handle this.
    I'm supposed to stay and work through it. Everyone expects me to be strong.
    I have to deal with it. But my body just wants to flee.
  `;

  console.log('📋 USER INPUT:');
  console.log('   "Want to run... legs restless... but I should handle this... supposed to be strong..."\n');

  const extraction3 = await symbolExtractor.extract(input3);
  const synergies3 = crossFrameworkSynergyEngine.detectSynergies(extraction3);

  const topSig3 = crossFrameworkSynergyEngine.getTopSignature(synergies3);
  if (topSig3) {
    console.log('💡 SYNERGY DETECTED:\n');
    console.log(`   ${topSig3.name}`);
    console.log(`   ${topSig3.description}\n`);
    console.log('   WHY THIS MATTERS:');
    console.log(`   ${topSig3.clinicalMeaning}\n`);
    console.log('   FOCUS: ' + topSig3.therapeuticFocus + '\n');
  }

  // ========================================================================
  // SCENARIO 4: Integration Readiness
  // ========================================================================
  console.log('━'.repeat(80));
  console.log('SCENARIO 4: INTEGRATION READINESS');
  console.log('━'.repeat(80) + '\n');

  const input4 = `
    I feel this deep integration happening. The opposites that seemed so separate
    are coming together. I'm in my body, present, connected. There's a wholeness
    emerging. I can see my shadow and my light, and they're both part of me.
    This feels like real individuation. I'm becoming who I truly am.
  `;

  console.log('📋 USER INPUT:');
  console.log('   "Deep integration... opposites coming together... wholeness emerging... individuation..."\n');

  const extraction4 = await symbolExtractor.extract(input4);
  const synergies4 = crossFrameworkSynergyEngine.detectSynergies(extraction4);

  const topSig4 = crossFrameworkSynergyEngine.getTopSignature(synergies4);
  if (topSig4) {
    console.log('💡 SYNERGY DETECTED:\n');
    console.log(`   ${topSig4.name}`);
    console.log(`   Frameworks: ${topSig4.frameworks.join(' + ')}`);
    console.log(`   Confidence: ${(topSig4.confidence * 100).toFixed(0)}%`);
    console.log(`   Urgency: ${topSig4.urgency}\n`);
    console.log('   THIS IS SPECIAL:');
    console.log(`   ${topSig4.clinicalMeaning}\n`);
    console.log('   SUPPORT THIS:');
    topSig4.interventions.forEach(intervention => {
      console.log(`   • ${intervention}`);
    });
    console.log('');
  }

  // ========================================================================
  // SUMMARY
  // ========================================================================
  console.log('='.repeat(80));
  console.log('📊 CROSS-FRAMEWORK SYNERGY ENGINE - CAPABILITIES');
  console.log('='.repeat(80) + '\n');

  console.log('✅ 10 Transformation Signatures Detected:');
  console.log('   1. Complete Shutdown (Nigredo + Dorsal + Freeze + Retroflection)');
  console.log('   2. Trapped Fight (Fight + Retroflection + Sympathetic + Left)');
  console.log('   3. Trapped Flight (Flight + Introjection + Sympathetic)');
  console.log('   4. Introjection Spiral (Introjection + Managers + Left + Persona)');
  console.log('   5. Shadow Projection Loop (Shadow + Projection + Exiles)');
  console.log('   6. Protector Storm (Managers + Firefighters + Sympathetic/Nigredo)');
  console.log('   7. Integration Readiness (Citrinitas/Rubedo + Ventral + Self + Individuation)');
  console.log('   8. Morphogenetic Breakthrough (Field Emergence + Rubedo + High Coherence)');
  console.log('   9. Triple Body Freeze (Dorsal + Freeze + Confluence)');
  console.log('   10. Hyperarousal Cascade (Sympathetic + Fight/Flight + Right/Nigredo)\n');

  console.log('✅ Priority-Based Selection:');
  console.log('   • Critical urgency (shutdown, freeze patterns)');
  console.log('   • High urgency (trapped responses, protector storms)');
  console.log('   • Moderate urgency (introjection, projection patterns)');
  console.log('   • Low urgency (integration, breakthrough states)\n');

  console.log('✅ Clinical Intelligence:');
  console.log('   • Explains WHAT the pattern means');
  console.log('   • Provides therapeutic FOCUS');
  console.log('   • Offers specific INTERVENTIONS');
  console.log('   • Honors multi-framework complexity\n');

  console.log('💫 RESULT: MAIA now sees transformation PATTERNS, not just states!');
  console.log('\n' + '='.repeat(80) + '\n');
}

demo().catch(console.error);
