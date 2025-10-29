#!/usr/bin/env tsx
import { symbolExtractor } from '../lib/intelligence/SymbolExtractionEngine';

async function debugTest5() {
  const individuationInput = `I'm on a journey of individuation, integrating my anima and animus, embracing the opposites within me to become whole and authentic to my true Self.`;

  const extraction = await symbolExtractor.extract(individuationInput);

  console.log('\n🔍 TEST 5 DEBUG ANALYSIS\n');
  console.log('Input:', individuationInput);
  console.log('\n📊 Jungian Process:');
  console.log('Shadow Work:', extraction.jungianProcess?.shadowWork);
  console.log('Individuation:', extraction.jungianProcess?.individuation);
  console.log('Projection:', extraction.jungianProcess?.projection);
  console.log('Integration:', extraction.jungianProcess?.integration);
  console.log('Indicators:', extraction.jungianProcess?.indicators);

  console.log('\n📖 Narrative Themes:', extraction.narrativeThemes);

  console.log('\n💡 Test expects both individuation AND integration to be true');
  console.log(`individuation: ${extraction.jungianProcess?.individuation}`);
  console.log(`integration: ${extraction.jungianProcess?.integration}`);
}

debugTest5();
