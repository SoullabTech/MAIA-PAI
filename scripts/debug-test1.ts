#!/usr/bin/env tsx

import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';

async function debugTest1() {
  console.log('\n🔍 DEBUGGING TEST 1 INPUT\n');

  const input = `
    I'm in complete Nigredo - darkness and dissolution (Alchemy).
    The morphogenetic field is fragmenting, chaos everywhere (Levin).
    My nervous system shut down, frozen and numb (Polyvagal - dorsal).
    A manager part desperately trying to control, firefighter wanting to escape (IFS).
    Shadow projecting everywhere (Jung - projection).
    Left-brain trying to analyze and fix it systematically (McGilchrist - left).

    My body prepared to fight but I'm holding it in - jaw clenched, shoulders tight (Levine - retroflection/incomplete fight).
    I should be stronger, everyone says I must handle this (Gestalt - introjection).
    Can't tell where I end and this pain begins (Gestalt - confluence).
    Turning all that rage against myself instead (Gestalt - retroflection).
  `;

  const extraction = await symbolExtractor.extract(input);

  console.log('McGILCHRIST Detection:');
  console.log('  Result:', extraction.hemisphericMode);
  console.log('');

  console.log('Text contains "Left-brain":', input.includes('Left-brain'));
  console.log('Text contains "analyze":', input.includes('analyze'));
  console.log('Text contains "fix":', input.includes('fix'));
  console.log('Text contains "systematically":', input.includes('systematically'));
}

debugTest1();
