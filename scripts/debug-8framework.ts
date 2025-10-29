#!/usr/bin/env tsx

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';

async function debug() {
  console.log('\n🔍 DEBUGGING 8-FRAMEWORK DETECTION\n');

  // Test 2 input (should detect Levine fight + Gestalt retroflection)
  const input = `
    I want to scream at them, push them away, but I'm holding it all in.
    My jaw is clenched so tight. Shoulders raised and tense.
    I bite my tongue every time. Turn all that rage on myself instead.
    Feel the anger trapped in my chest but can't let it out.
  `;

  const extraction = await symbolExtractor.extract(input);

  console.log('LEVINE (Somatic):');
  console.log('  Detected:', extraction.somaticState?.detected);
  console.log('  Incomplete Response:', extraction.somaticState?.incompleteResponse);
  console.log('  Discharge:', extraction.somaticState?.discharge);
  console.log('');

  console.log('GESTALT:');
  console.log('  Detected:', extraction.gestaltState?.detected);
  console.log('  Retroflection:', extraction.gestaltState?.contactDisturbances.retroflection);
  console.log('  All Disturbances:', extraction.gestaltState?.contactDisturbances);
  console.log('');

  // Test McGilchrist detection
  const input2 = `Left-brain trying to analyze and fix it systematically.`;
  const extraction2 = await symbolExtractor.extract(input2);

  console.log('McGILCHRIST test:');
  console.log('  Input:', input2);
  console.log('  Detected:', extraction2.hemisphericMode);
  console.log('');
}

debug();
