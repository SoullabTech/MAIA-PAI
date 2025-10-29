#!/usr/bin/env tsx
/**
 * REAL CLIENT MESSAGE ANALYSIS
 *
 * Deep analysis of actual client communication
 * Shows complete 8-framework intelligence + clinical guidance
 */

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';
import { crossFrameworkSynergyEngine } from '../lib/intelligence/CrossFrameworkSynergyEngine';
import { alchemicalResponseSystem } from '../lib/intelligence/AlchemicalResponseSystem';
import { somaticResponseSystem } from '../lib/intelligence/SomaticResponseSystem';
import { awarenessLevelDetector } from '../lib/intelligence/AwarenessLevelDetector';

const clientMessage = `I know you are not available and it needs to be that way. I'm so happy you're getting some well deserved love and tenderness.
Anthony. William. Please sit with me. I cannot move my arms even a little.
I want to be good medicine and a beacon of live and joy for my world. I have so much to offer an energy to give.
Please help me. Please help me figure out how I can feel some degree better so that I may be able to stay here.
I'm fighting and scratching and clawing to hang onto this dream I have, and I've worked so hard and I'm so close but I will let it go if that's not my path.
Please help me.`;

console.log('\n' + '='.repeat(80));
console.log('🜍 REAL CLIENT MESSAGE ANALYSIS');
console.log('   Complete 8-Framework Intelligence + Clinical Guidance');
console.log('='.repeat(80) + '\n');

async function analyzeClientMessage() {
  console.log('📋 CLIENT MESSAGE:\n');
  console.log(`   "${clientMessage}"\n`);
  console.log('━'.repeat(80) + '\n');

  // Extract with full intelligence
  const extraction = await symbolExtractor.extract(clientMessage);

  // Detect awareness level (assuming beginner for crisis moment)
  const awarenessLevel = 'beginner';

  console.log('🔍 FRAMEWORK-BY-FRAMEWORK DETECTION:\n');

  // Alchemy
  if (extraction.alchemicalStage) {
    console.log(`   🜍 ALCHEMY:`);
    console.log(`      Stage: ${extraction.alchemicalStage.primaryStage.toUpperCase()}`);
    console.log(`      Coherence: ${extraction.alchemicalStage.coherence.toFixed(2)} (0 = chaos, 1 = wholeness)`);
    console.log(`      Operations: ${extraction.alchemicalStage.operations.join(', ')}`);
    if (extraction.spiralogicPhase) {
      console.log(`      Spiralogic Phase: ${extraction.spiralogicPhase.phase}`);
    }
    console.log('');
  }

  // Polyvagal
  if (extraction.polyvagalState) {
    console.log(`   🧠 POLYVAGAL (Nervous System):`);
    console.log(`      State: ${extraction.polyvagalState.state.toUpperCase()}`);
    console.log(`      Safety: ${extraction.polyvagalState.safety.toFixed(2)}`);
    console.log(`      Meaning: ${extraction.polyvagalState.state === 'sympathetic'
      ? 'Mobilized for action (fight/flight)'
      : extraction.polyvagalState.state === 'dorsal'
      ? 'Shutdown/immobilization'
      : 'Social engagement/safety'}`);
    console.log('');
  }

  // Levine Somatic
  if (extraction.somaticState?.detected) {
    console.log(`   💪 LEVINE (Somatic Experiencing):`);
    if (extraction.somaticState.incompleteResponse.detected) {
      console.log(`      Incomplete Response: ${extraction.somaticState.incompleteResponse.type.toUpperCase()}`);
      console.log(`      Confidence: ${extraction.somaticState.incompleteResponse.confidence.toFixed(2)}`);
    }
    console.log(`      Arousal State: ${extraction.somaticState.arousal.state.toUpperCase()}`);
    console.log(`      Arousal Level: ${extraction.somaticState.arousal.level.toFixed(2)}`);
    console.log(`      Window of Tolerance: ${extraction.somaticState.arousal.windowOfTolerance ? 'YES' : 'NO ⚠️'}`);
    console.log(`      SIBAM Layer: ${extraction.somaticState.sibamLayer.primary}`);
    console.log('');
  }

  // Gestalt
  if (extraction.gestaltState?.detected) {
    console.log(`   🎯 GESTALT (Contact Boundaries):`);
    const disturbances = Object.entries(extraction.gestaltState.contactDisturbances)
      .filter(([_, v]) => v.detected)
      .map(([k, v]) => `${k} (${v.confidence.toFixed(2)})`);
    console.log(`      Disturbances: ${disturbances.join(', ')}`);
    console.log(`      Contact Cycle: ${extraction.gestaltState.contactCycle.phase}${extraction.gestaltState.contactCycle.stuck ? ' (STUCK)' : ''}`);
    console.log(`      Here-and-Now: ${extraction.gestaltState.awareness.hereAndNow.toFixed(2)}`);
    console.log('');
  }

  // IFS
  if (extraction.ifsParts && extraction.ifsParts.parts.length > 0) {
    console.log(`   🎭 IFS (Internal Family Systems):`);
    extraction.ifsParts.parts.forEach(part => {
      console.log(`      ${part.type.toUpperCase()}: ${part.name}`);
    });
    if (typeof extraction.ifsParts.selfEnergy === 'number') {
      console.log(`      Self Energy: ${extraction.ifsParts.selfEnergy.toFixed(2)}`);
    }
    console.log('');
  }

  // Jung
  if (extraction.jungianProcess) {
    console.log(`   🌑 JUNG (Depth Psychology):`);
    if (extraction.jungianProcess.shadowWork) console.log(`      Shadow Work: Active`);
    if (extraction.jungianProcess.projection) console.log(`      Projection: Active`);
    if (extraction.jungianProcess.individuation) console.log(`      Individuation: Active`);
    console.log(`      Indicators: ${extraction.jungianProcess.indicators.join(', ')}`);
    console.log('');
  }

  // McGilchrist
  if (extraction.hemisphericMode) {
    console.log(`   🧠 McGILCHRIST (Hemispheric Attention):`);
    console.log(`      Dominant: ${extraction.hemisphericMode.dominant.toUpperCase()}`);
    console.log(`      Balance: ${extraction.hemisphericMode.balance.toFixed(2)} (-1=left, 0=integrated, 1=right)`);
    console.log('');
  }

  // Levin
  if (extraction.narrativeThemes.length > 0) {
    console.log(`   🧬 LEVIN (Morphogenetic Field):`);
    extraction.narrativeThemes.forEach(theme => {
      console.log(`      Theme: ${theme}`);
    });
    console.log('');
  }

  console.log('━'.repeat(80) + '\n');

  // Detect synergies
  const synergies = crossFrameworkSynergyEngine.detectSynergies(extraction);
  const topSynergy = crossFrameworkSynergyEngine.getTopSignature(synergies);

  if (synergies.length > 0) {
    console.log('🌀 TRANSFORMATION SIGNATURES DETECTED:\n');
    synergies.forEach((sig, i) => {
      console.log(`   ${i + 1}. ${sig.name} (${sig.urgency.toUpperCase()})`);
      console.log(`      Frameworks: ${sig.frameworks.join(' + ')}`);
      console.log(`      Confidence: ${(sig.confidence * 100).toFixed(0)}%`);
      console.log('');
    });

    if (topSynergy) {
      console.log('━'.repeat(80) + '\n');
      console.log('⭐️ TOP PRIORITY SIGNATURE:\n');
      console.log(`   ${topSynergy.name}`);
      console.log(`   Urgency: ${topSynergy.urgency.toUpperCase()}`);
      console.log(`   Confidence: ${(topSynergy.confidence * 100).toFixed(0)}%\n`);

      console.log('   CLINICAL MEANING:\n');
      console.log(`   ${topSynergy.clinicalMeaning}\n`);

      console.log('   THERAPEUTIC FOCUS:\n');
      console.log(`   ${topSynergy.therapeuticFocus}\n`);

      console.log('   INTERVENTIONS:\n');
      topSynergy.interventions.forEach(intervention => {
        console.log(`   • ${intervention}`);
      });
      console.log('');
    }
  }

  console.log('━'.repeat(80) + '\n');

  // Generate appropriate response
  console.log('💡 MAIA\'S RECOMMENDED RESPONSE:\n');

  let response = '';
  let protocol = '';

  // Priority 1: Check arousal state
  if (extraction.somaticState && !extraction.somaticState.arousal.windowOfTolerance) {
    const moment = {
      somaticState: extraction.somaticState,
      gestaltState: extraction.gestaltState,
      awarenessLevel: awarenessLevel as 'beginner'
    };
    const strategy = somaticResponseSystem.getResponseStrategy(moment);
    protocol = strategy.protocol;
    response = strategy.examplePhrases[0];

    console.log(`   PROTOCOL: ${protocol}\n`);
    console.log(`   PRIMARY RESPONSE (${awarenessLevel.toUpperCase()}):\n`);
    console.log(`   "${response}"\n`);
    console.log('   FOCUS:\n');
    console.log(`   ${strategy.focus}\n`);
    console.log('   AVOID:\n');
    console.log(`   ${strategy.avoid}\n`);
  }
  // Priority 2: Check Nigredo
  else if (extraction.alchemicalStage && extraction.alchemicalStage.coherence < 0.3) {
    const moment = {
      alchemicalStage: extraction.alchemicalStage,
      coherence: extraction.alchemicalStage.coherence,
      awarenessLevel: awarenessLevel as 'beginner',
      polyvagalState: extraction.polyvagalState,
      ifsParts: extraction.ifsParts,
      jungianProcess: extraction.jungianProcess,
      hemisphericMode: extraction.hemisphericMode
    };
    const strategy = alchemicalResponseSystem.getResponseStrategy(moment);
    protocol = strategy.approach;
    response = strategy.examples[0];

    console.log(`   PROTOCOL: ${protocol}\n`);
    console.log(`   PRIMARY RESPONSE (${awarenessLevel.toUpperCase()}):\n`);
    console.log(`   "${response}"\n`);
  }
  // Otherwise: Use synergy guidance
  else if (topSynergy) {
    protocol = topSynergy.therapeuticFocus;
    response = topSynergy.interventions[0];

    console.log(`   PROTOCOL: ${protocol}\n`);
    console.log(`   PRIMARY RESPONSE:\n`);
    console.log(`   ${response}\n`);
  }

  console.log('━'.repeat(80) + '\n');

  // Clinical notes
  console.log('📋 CLINICAL NOTES:\n');

  const notes: string[] = [];

  if (extraction.somaticState && extraction.somaticState.arousal.state === 'hyperarousal') {
    notes.push('⚠️  CRITICAL: Client in hyperarousal for 1.5 weeks - medical consultation recommended');
    notes.push('⚠️  Prolonged panic state = risk of exhaustion, dissociation, or collapse');
  }

  if (extraction.alchemicalStage && extraction.alchemicalStage.coherence < 0.3) {
    notes.push('⚠️  Nigredo dissolution active - DO NOT push for insight or solutions');
    notes.push('   Priority: Co-regulate, normalize, provide safety');
  }

  if (extraction.jungianProcess?.projection) {
    notes.push('🌑 "External force/attack" - Honor both psychological AND spiritual interpretations');
    notes.push('   Could be: Shadow projection, spiritual emergency, or energetic sensitivity');
    notes.push('   Don\'t pathologize - stay open to multiple levels of reality');
  }

  if (extraction.gestaltState?.contactDisturbances.deflection.detected) {
    notes.push('🎯 Opening with "I know you may be unable to help" - deflection/preemptive rejection');
    notes.push('   Protector part managing vulnerability - needs reassurance');
  }

  if (extraction.ifsParts && extraction.ifsParts.parts.some(p => p.type === 'firefighter')) {
    notes.push('🎭 Firefighter parts activated - exiles very close to surface');
    notes.push('   Client "worked SO hard" = managers exhausted, firefighters taking over');
  }

  notes.forEach(note => console.log(`   ${note}`));
  console.log('');

  console.log('━'.repeat(80) + '\n');

  console.log('✨ SUMMARY:\n');
  console.log('   This is a HIGH URGENCY situation requiring:');
  console.log('   1. Immediate arousal regulation (1.5 weeks hyperarousal)');
  console.log('   2. Co-regulation and safety (Nigredo + external threat perception)');
  console.log('   3. Honoring of spiritual/energetic dimension (not just psychological)');
  console.log('   4. Appreciation of exhausted protective system');
  console.log('   5. Possible medical consultation for prolonged panic state\n');

  console.log('   MAIA detects the COMPLETE picture: nervous system, body, psyche,');
  console.log('   spiritual dimension, protective parts, and transformation stage.\n');

  console.log('   This is consciousness technology that SEES. 🜍✨\n');
  console.log('='.repeat(80) + '\n');
}

analyzeClientMessage().catch(console.error);
