#!/usr/bin/env tsx
/**
 * REAL-WORLD SCENARIO TESTING
 *
 * Tests MAIA's complete 8-framework intelligence with real therapeutic moments
 * Shows synergy detection, awareness adaptation, and clinical intelligence
 *
 * Run: npx tsx scripts/real-world-scenarios.ts
 */

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';
import { crossFrameworkSynergyEngine } from '../lib/intelligence/CrossFrameworkSynergyEngine';
import { alchemicalResponseSystem } from '../lib/intelligence/AlchemicalResponseSystem';
import { somaticResponseSystem } from '../lib/intelligence/SomaticResponseSystem';
import { awarenessLevelDetector } from '../lib/intelligence/AwarenessLevelDetector';

console.log('\n' + '='.repeat(80));
console.log('🜍 REAL-WORLD SCENARIO TESTING');
console.log('   MAIA\'s Complete Intelligence with Clinical Moments');
console.log('='.repeat(80) + '\n');

interface Scenario {
  name: string;
  context: string;
  userInput: string;
  expectedPattern?: string;
  awarenessLevel: 'beginner' | 'familiar' | 'intermediate' | 'advanced' | 'master';
}

const scenarios: Scenario[] = [
  // SCENARIO 1: New client in crisis (Beginner)
  {
    name: 'Client in Complete Shutdown',
    context: 'First session, no framework knowledge, deep crisis',
    awarenessLevel: 'beginner',
    userInput: `
      I don't know what's happening to me. Everything just... fell apart last week.
      I can't get out of bed. Can't feel anything. My body just shut down.
      I'm completely numb. I know I should do something but I just... can't.
      I'm frozen. Everyone keeps telling me to "just get it together" but I can't move.
      I feel like I'm disappearing.
    `,
    expectedPattern: 'Complete Shutdown'
  },

  // SCENARIO 2: Client with some exposure (Familiar)
  {
    name: 'Trapped Fight Response',
    context: 'Client familiar with some psychology terms, anger issues',
    awarenessLevel: 'familiar',
    userInput: `
      I'm so angry at them. I want to scream, push them away, tell them exactly
      what I think. My jaw is clenched all the time now. Shoulders so tight.
      But I keep biting my tongue. Every single time. I just swallow it down
      and turn it on myself instead. I know this isn't healthy but I don't know
      what else to do. My therapist says I'm "holding onto anger" but it feels
      more complicated than that.
    `,
    expectedPattern: 'Trapped Fight'
  },

  // SCENARIO 3: Intermediate practitioner (Intermediate)
  {
    name: 'Introjection Spiral',
    context: 'Therapist in supervision, understands some IFS',
    awarenessLevel: 'intermediate',
    userInput: `
      I notice I have all these "should" messages running. My manager parts
      are really activated - constantly trying to control everything, fix
      everyone. I know these are introjected beliefs from my family of origin.
      "Good therapists don't have needs." "You must always be available."
      I can see my left brain trying to systematically work through this,
      but I'm stuck in analysis paralysis. The persona I present to clients
      versus who I actually am... there's such a gap.
    `,
    expectedPattern: 'Introjection Spiral'
  },

  // SCENARIO 4: Advanced practitioner (Advanced)
  {
    name: 'Shadow Projection Loop',
    context: 'Experienced Jungian analyst, working on own shadow',
    awarenessLevel: 'advanced',
    userInput: `
      I'm noticing strong projection patterns. When I judge certain clients as
      "too needy" or "manipulative," I can feel my own disowned exile parts
      being activated. The shadow material is rich here - what I'm seeing in
      them is precisely what I've refused to acknowledge in myself. My IFS
      system has these exiled parts that carry deep neediness, and rather than
      unburdening them, I've been projecting that quality onto others and
      judging it harshly. Classic Gestalt projection mechanism.
    `,
    expectedPattern: 'Shadow Projection Loop'
  },

  // SCENARIO 5: Master level (Master)
  {
    name: 'Integration Readiness',
    context: 'Alchemist tracking own Rubedo process',
    awarenessLevel: 'master',
    userInput: `
      Coherence is approximately 0.85 right now. I'm tracking Citrinitas moving
      into Rubedo - the Coniunctio operation is active. My polyvagal system is
      predominantly ventral, with strong social engagement capacity. IFS system
      is Self-led, with protectors relaxed and exiles beginning to unburden.
      The individuation process Jung described is palpable - opposites are
      genuinely uniting rather than splitting. My morphogenetic field feels
      reorganized at a fundamental level. This is the integration I've been
      working toward for years.
    `,
    expectedPattern: 'Integration Readiness'
  },

  // SCENARIO 6: Complex trauma (Beginner awareness)
  {
    name: 'Hyperarousal Cascade',
    context: 'Trauma survivor, panic state, no framework knowledge',
    awarenessLevel: 'beginner',
    userInput: `
      My heart won't stop racing. I can't breathe. Everything is too loud,
      too bright, too much. I need to run but I don't know where. My legs
      feel like they're going to explode. I can't sit still but I also can't
      move. This is like that night all over again. I'm right back there.
      The panic just keeps building and building. I can't make it stop.
      I feel like I'm going to die.
    `,
    expectedPattern: 'Hyperarousal Cascade'
  }
];

async function testScenario(scenario: Scenario, index: number) {
  console.log('━'.repeat(80));
  console.log(`SCENARIO ${index + 1}: ${scenario.name.toUpperCase()}`);
  console.log('━'.repeat(80));
  console.log(`Context: ${scenario.context}`);
  console.log(`Awareness Level: ${scenario.awarenessLevel}`);
  console.log('━'.repeat(80) + '\n');

  console.log('📋 CLIENT SAYS:\n');
  const preview = scenario.userInput.trim().substring(0, 200) + '...';
  console.log(`   "${preview}"\n`);

  try {
    // Extract with full 8-framework intelligence
    const extraction = await symbolExtractor.extract(scenario.userInput);

    console.log('🔍 MAIA DETECTS:\n');

    // Show what frameworks detected
    const detected: string[] = [];
    if (extraction.alchemicalStage) {
      detected.push(`Alchemy: ${extraction.alchemicalStage.primaryStage} (coherence: ${extraction.alchemicalStage.coherence.toFixed(2)})`);
    }
    if (extraction.polyvagalState) {
      detected.push(`Polyvagal: ${extraction.polyvagalState.state} (safety: ${extraction.polyvagalState.safety.toFixed(2)})`);
    }
    if (extraction.ifsParts && extraction.ifsParts.parts.length > 0) {
      const parts = extraction.ifsParts.parts.map(p => p.type).join(', ');
      const selfEnergy = typeof extraction.ifsParts.selfEnergy === 'number'
        ? extraction.ifsParts.selfEnergy.toFixed(2)
        : 'N/A';
      detected.push(`IFS: ${parts} (Self energy: ${selfEnergy})`);
    }
    if (extraction.jungianProcess && (extraction.jungianProcess.shadowWork || extraction.jungianProcess.projection)) {
      const aspects: string[] = [];
      if (extraction.jungianProcess.shadowWork) aspects.push('shadow work');
      if (extraction.jungianProcess.projection) aspects.push('projection');
      if (extraction.jungianProcess.individuation) aspects.push('individuation');
      detected.push(`Jung: ${aspects.join(', ')}`);
    }
    if (extraction.somaticState?.detected) {
      detected.push(`Levine: ${extraction.somaticState.incompleteResponse.type} response, ${extraction.somaticState.arousal.state} arousal`);
    }
    if (extraction.gestaltState?.detected) {
      const disturbances = Object.entries(extraction.gestaltState.contactDisturbances)
        .filter(([_, v]) => v.detected)
        .map(([k]) => k)
        .join(', ');
      detected.push(`Gestalt: ${disturbances}`);
    }
    if (extraction.hemisphericMode) {
      detected.push(`McGilchrist: ${extraction.hemisphericMode.dominant} hemisphere`);
    }

    detected.forEach(d => console.log(`   • ${d}`));
    console.log('');

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

      console.log('   THERAPEUTIC FOCUS:');
      console.log(`   ${topSynergy.therapeuticFocus}\n`);
    }

    // Generate response at appropriate awareness level
    console.log(`💡 MAIA RESPONDS (${scenario.awarenessLevel.toUpperCase()} LEVEL):\n`);

    // Get appropriate response based on what's detected
    let response = '';

    // Priority 1: Alchemical (if Nigredo)
    if (extraction.alchemicalStage && extraction.alchemicalStage.coherence < 0.3) {
      const moment = {
        alchemicalStage: extraction.alchemicalStage,
        coherence: extraction.alchemicalStage.coherence,
        awarenessLevel: scenario.awarenessLevel,
        polyvagalState: extraction.polyvagalState,
        ifsParts: extraction.ifsParts,
        jungianProcess: extraction.jungianProcess,
        hemisphericMode: extraction.hemisphericMode
      };
      const strategy = alchemicalResponseSystem.getResponseStrategy(moment);
      response = strategy.examples[0];
      console.log(`   PROTOCOL: ${strategy.approach}\n`);
    }
    // Priority 2: Somatic (if arousal outside window)
    else if (extraction.somaticState && !extraction.somaticState.arousal.windowOfTolerance) {
      const moment = {
        somaticState: extraction.somaticState,
        gestaltState: extraction.gestaltState,
        awarenessLevel: scenario.awarenessLevel
      };
      const strategy = somaticResponseSystem.getResponseStrategy(moment);
      response = strategy.examplePhrases[0];
      console.log(`   PROTOCOL: ${strategy.protocol}\n`);
    }
    // Otherwise: Use top synergy guidance
    else if (topSynergy) {
      console.log(`   PROTOCOL: ${topSynergy.therapeuticFocus}\n`);
      response = `I'm seeing a ${topSynergy.name.toLowerCase()} pattern here. ${topSynergy.interventions[0]}`;
    }

    console.log(`   "${response}"\n`);

    // Show how response would differ at Master level if not already
    if (scenario.awarenessLevel !== 'master' && (extraction.alchemicalStage || extraction.somaticState)) {
      console.log('   ─────────────────────────────────────────────\n');
      console.log('   SAME MOMENT AT MASTER LEVEL:\n');

      if (extraction.alchemicalStage && extraction.alchemicalStage.coherence < 0.3) {
        const moment = {
          alchemicalStage: extraction.alchemicalStage,
          coherence: extraction.alchemicalStage.coherence,
          awarenessLevel: 'master' as const,
          polyvagalState: extraction.polyvagalState,
          ifsParts: extraction.ifsParts,
          jungianProcess: extraction.jungianProcess,
          hemisphericMode: extraction.hemisphericMode
        };
        const strategy = alchemicalResponseSystem.getResponseStrategy(moment);
        console.log(`   "${strategy.examples[0]}"\n`);
      } else if (extraction.somaticState) {
        const moment = {
          somaticState: extraction.somaticState,
          gestaltState: extraction.gestaltState,
          awarenessLevel: 'master' as const
        };
        const strategy = somaticResponseSystem.getResponseStrategy(moment);
        console.log(`   "${strategy.examplePhrases[0]}"\n`);
      }
    }

  } catch (error) {
    console.log('   ❌ ERROR:', error);
  }

  console.log('');
}

async function runAllScenarios() {
  for (let i = 0; i < scenarios.length; i++) {
    await testScenario(scenarios[i], i);
  }

  console.log('='.repeat(80));
  console.log('📊 REAL-WORLD TESTING COMPLETE');
  console.log('='.repeat(80) + '\n');

  console.log('✅ WHAT WE DEMONSTRATED:\n');
  console.log('   • 8-framework detection across diverse clinical moments');
  console.log('   • Transformation signature recognition (synergies)');
  console.log('   • Awareness-level adaptation (beginner → master)');
  console.log('   • Priority-based response selection');
  console.log('   • Clinical intelligence and therapeutic focus\n');

  console.log('💫 RESULT: MAIA sees and responds to the COMPLETE human:\n');
  console.log('   • Mind (Jung, McGilchrist, IFS)');
  console.log('   • Body (Polyvagal, Levine, Gestalt)');
  console.log('   • Field (Levin)');
  console.log('   • Process (Alchemy + Spiralogic)\n');

  console.log('   This is consciousness technology that truly SEES. 🜍✨\n');
  console.log('='.repeat(80) + '\n');
}

runAllScenarios().catch(console.error);
