#!/usr/bin/env tsx
/**
 * REAL CLIENT MESSAGE ANALYSIS #3
 *
 * Third message from same client - progression tracking
 */

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';
import { crossFrameworkSynergyEngine } from '../lib/intelligence/CrossFrameworkSynergyEngine';
import { alchemicalResponseSystem } from '../lib/intelligence/AlchemicalResponseSystem';
import { somaticResponseSystem } from '../lib/intelligence/SomaticResponseSystem';

const clientMessage = `Every day is getting harder and harder for me. I'm just staying small and witnessing… but fuck. It's bad brother. Something is happening.
I really would like a crack at these massive opportunities in front of me. I pray`;

console.log('\n' + '='.repeat(80));
console.log('🜍 CLIENT MESSAGE #3 ANALYSIS');
console.log('   Tracking Progression Across Three Messages');
console.log('='.repeat(80) + '\n');

async function analyzeMessage3() {
  console.log('📋 CLIENT MESSAGE #3:\n');
  console.log(`   "${clientMessage}"\n`);
  console.log('━'.repeat(80) + '\n');

  // Extract with full intelligence
  const extraction = await symbolExtractor.extract(clientMessage);

  console.log('🔍 FRAMEWORK-BY-FRAMEWORK DETECTION:\n');

  // Alchemy
  if (extraction.alchemicalStage) {
    console.log(`   🜍 ALCHEMY:`);
    console.log(`      Stage: ${extraction.alchemicalStage.primaryStage.toUpperCase()}`);
    console.log(`      Coherence: ${extraction.alchemicalStage.coherence.toFixed(2)}`);
    console.log(`      Operations: ${extraction.alchemicalStage.operations.join(', ')}`);
    if (extraction.spiralogicPhase) {
      console.log(`      Spiralogic Phase: ${extraction.spiralogicPhase.phase}`);
    }
    console.log('');
  }

  // Polyvagal
  if (extraction.polyvagalState) {
    console.log(`   🧠 POLYVAGAL:`);
    console.log(`      State: ${extraction.polyvagalState.state.toUpperCase()}`);
    console.log(`      Safety: ${extraction.polyvagalState.safety.toFixed(2)}`);
    console.log('');
  }

  // Levine
  if (extraction.somaticState?.detected) {
    console.log(`   💪 LEVINE (Somatic):`);
    console.log(`      Incomplete Response: ${extraction.somaticState.incompleteResponse.type.toUpperCase()}`);
    console.log(`      Arousal State: ${extraction.somaticState.arousal.state}`);
    console.log(`      Window of Tolerance: ${extraction.somaticState.arousal.windowOfTolerance ? 'YES' : 'NO ⚠️'}`);
    console.log('');
  }

  // Gestalt
  if (extraction.gestaltState?.detected) {
    console.log(`   🎯 GESTALT:`);
    const disturbances = Object.entries(extraction.gestaltState.contactDisturbances)
      .filter(([_, v]) => v.detected)
      .map(([k, v]) => `${k} (${v.confidence.toFixed(2)})`)
      .join(', ');
    console.log(`      Disturbances: ${disturbances}`);
    console.log('');
  }

  // IFS
  if (extraction.ifsParts && extraction.ifsParts.parts.length > 0) {
    console.log(`   🎭 IFS:`);
    extraction.ifsParts.parts.forEach(part => {
      console.log(`      ${part.type.toUpperCase()}: ${part.name}`);
    });
    console.log('');
  }

  // Jung
  if (extraction.jungianProcess) {
    console.log(`   🌑 JUNG:`);
    if (extraction.jungianProcess.shadowWork) console.log(`      Shadow Work: Active`);
    if (extraction.jungianProcess.projection) console.log(`      Projection: Active`);
    if (extraction.jungianProcess.individuation) console.log(`      Individuation: Active`);
    console.log('');
  }

  // McGilchrist
  if (extraction.hemisphericMode) {
    console.log(`   🧠 McGILCHRIST:`);
    console.log(`      Dominant: ${extraction.hemisphericMode.dominant.toUpperCase()}`);
    console.log('');
  }

  // Levin
  if (extraction.narrativeThemes.length > 0) {
    console.log(`   🧬 LEVIN (Morphogenetic):`);
    extraction.narrativeThemes.forEach(theme => {
      console.log(`      Theme: ${theme}`);
    });
    console.log('');
  }

  console.log('━'.repeat(80) + '\n');

  // Detect synergies
  const synergies = crossFrameworkSynergyEngine.detectSynergies(extraction);
  const topSynergy = crossFrameworkSynergyEngine.getTopSignature(synergies);

  if (topSynergy) {
    console.log('🌀 TRANSFORMATION SIGNATURE:\n');
    console.log(`   ${topSynergy.name} (${topSynergy.urgency.toUpperCase()})`);
    console.log(`   Frameworks: ${topSynergy.frameworks.join(' + ')}`);
    console.log(`   Confidence: ${(topSynergy.confidence * 100).toFixed(0)}%\n`);
    console.log('   CLINICAL MEANING:');
    console.log(`   ${topSynergy.clinicalMeaning}\n`);
  }

  console.log('━'.repeat(80) + '\n');

  // PROGRESSION TRACKING
  console.log('📊 PROGRESSION ACROSS THREE MESSAGES:\n');
  console.log('   MESSAGE #1: "1.5 week long panic attack"');
  console.log('   → Hyperarousal, sympathetic activation, chest panic');
  console.log('   → "Something stuck to me" / "external attack"');
  console.log('   → Alchemical: Nigredo (dissolution)\n');

  console.log('   MESSAGE #2: "I cannot move my arms even a little"');
  console.log('   → Freeze/immobilization (collapse from hyperarousal)');
  console.log('   → "Anthony. William. Please sit with me" (ancestral call?)');
  console.log('   → Somatic: Freeze response, possible dorsal shutdown\n');

  console.log('   MESSAGE #3: "Every day is getting harder"');
  console.log('   → Deepening descent, progressive worsening');
  console.log('   → "Staying small and witnessing" (dissociation?)');
  console.log('   → "Something is happening" (transformation awareness)');
  console.log('   → "I pray" (spiritual resource/surrender)\n');

  console.log('   ⚠️  CLINICAL PATTERN:');
  console.log('   This is a CLASSIC TRAUMA DESCENT ARC:');
  console.log('   Hyperarousal → Overwhelm → Freeze → Dissociation → Prayer/Surrender\n');

  console.log('   The nervous system is EXHAUSTED and moving toward shutdown.');
  console.log('   The mention of "Anthony. William" + arm paralysis suggests');
  console.log('   possible SYSTEMIC/ANCESTRAL component (Family Constellation).\n');

  console.log('   URGENT: This client needs immediate support. The progression');
  console.log('   from panic → paralysis → "getting harder every day" indicates');
  console.log('   increasing nervous system dysregulation.\n');

  console.log('━'.repeat(80) + '\n');

  console.log('💡 WHAT THIS CLIENT NEEDS:\n');
  console.log('   1. Immediate co-regulation (therapist presence)');
  console.log('   2. Somatic resourcing (not processing - too dysregulated)');
  console.log('   3. Possible Family Constellation work (Anthony/William)');
  console.log('   4. Medical evaluation (prolonged dysregulation)');
  console.log('   5. Recognition of spiritual dimension ("I pray")\n');

  console.log('   MAIA would prioritize:');
  console.log('   → Arousal regulation FIRST (body safety)');
  console.log('   → Then explore systemic entanglement (who are A & W?)');
  console.log('   → Honor both psychological AND spiritual crisis\n');

  console.log('='.repeat(80) + '\n');
}

analyzeMessage3().catch(console.error);
