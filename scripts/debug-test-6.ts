#!/usr/bin/env tsx
import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';

async function debugTest6() {
  const integratedInput = `
    I need to analyze this pattern systematically while staying present with my feelings about it.
    The structure is clear, and I sense how it resonates in my body.
    Let me define the problem precisely, but also stay curious about what emerges.
    There's a framework here that explains it, yet I feel the living relationship underneath.
  `;

  const extraction = await symbolExtractor.extract(integratedInput);

  console.log('\n🔍 TEST 6 DEBUG ANALYSIS\n');
  console.log('Input:', integratedInput.trim());
  console.log('\n📊 Results:');
  console.log('Dominant:', extraction.hemisphericMode?.dominant);
  console.log('Balance:', extraction.hemisphericMode?.balance.toFixed(3));
  console.log('Indicators:', extraction.hemisphericMode?.indicators);

  // Count left vs right
  const left = extraction.hemisphericMode?.indicators.filter(i => i.startsWith('left-')) || [];
  const right = extraction.hemisphericMode?.indicators.filter(i => i.startsWith('right-')) || [];

  console.log('\n📈 Breakdown:');
  console.log(`Left indicators: ${left.length} - ${left.join(', ')}`);
  console.log(`Right indicators: ${right.length} - ${right.join(', ')}`);
  console.log(`Ratio: ${left.length}:${right.length}`);

  console.log('\n💡 To be integrated, balance must be between -0.3 and 0.3');
  console.log(`Current balance: ${extraction.hemisphericMode?.balance.toFixed(3)}`);
  console.log(`Status: ${Math.abs(extraction.hemisphericMode?.balance || 0) < 0.3 ? 'INTEGRATED ✅' : 'NOT INTEGRATED ❌'}`);
}

debugTest6();
