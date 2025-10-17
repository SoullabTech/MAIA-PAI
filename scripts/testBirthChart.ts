/**
 * Test Birth Chart Calculation
 *
 * Tests the ephemeris calculator with your actual birth data
 */

import { calculateBirthChart } from '../lib/astrology/ephemerisCalculator';

async function testChart() {
  console.log('\n🌟 Calculating Birth Chart with Time Passages-level precision...\n');

  // Your birth data
  // December 9, 1966, 10:29 PM, Baton Rouge, Louisiana
  const birthData = {
    date: '1966-12-09',
    time: '22:29', // 10:29 PM in 24-hour format
    location: {
      lat: 30.4515,  // Baton Rouge latitude
      lng: -91.1871, // Baton Rouge longitude
      timezone: 'America/Chicago', // CST
    },
  };

  try {
    const chart = await calculateBirthChart(birthData);

    console.log('✨ YOUR BIRTH CHART ✨\n');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log(`☀️  Sun: ${chart.sun.sign} ${chart.sun.degree.toFixed(2)}° (House ${chart.sun.house})`);
    if (chart.sun.retrograde) console.log('   ⟲ Retrograde');

    console.log(`🌙 Moon: ${chart.moon.sign} ${chart.moon.degree.toFixed(2)}° (House ${chart.moon.house})`);
    if (chart.moon.retrograde) console.log('   ⟲ Retrograde');

    console.log(`☿️  Mercury: ${chart.mercury.sign} ${chart.mercury.degree.toFixed(2)}° (House ${chart.mercury.house})`);
    if (chart.mercury.retrograde) console.log('   ⟲ Retrograde');

    console.log(`♀️  Venus: ${chart.venus.sign} ${chart.venus.degree.toFixed(2)}° (House ${chart.venus.house})`);
    if (chart.venus.retrograde) console.log('   ⟲ Retrograde');

    console.log(`♂️  Mars: ${chart.mars.sign} ${chart.mars.degree.toFixed(2)}° (House ${chart.mars.house})`);
    if (chart.mars.retrograde) console.log('   ⟲ Retrograde');

    console.log(`♃  Jupiter: ${chart.jupiter.sign} ${chart.jupiter.degree.toFixed(2)}° (House ${chart.jupiter.house})`);
    if (chart.jupiter.retrograde) console.log('   ⟲ Retrograde');

    console.log(`♄  Saturn: ${chart.saturn.sign} ${chart.saturn.degree.toFixed(2)}° (House ${chart.saturn.house})`);
    if (chart.saturn.retrograde) console.log('   ⟲ Retrograde');

    console.log(`⛢  Uranus: ${chart.uranus.sign} ${chart.uranus.degree.toFixed(2)}° (House ${chart.uranus.house})`);
    if (chart.uranus.retrograde) console.log('   ⟲ Retrograde');

    console.log(`♆  Neptune: ${chart.neptune.sign} ${chart.neptune.degree.toFixed(2)}° (House ${chart.neptune.house})`);
    if (chart.neptune.retrograde) console.log('   ⟲ Retrograde');

    console.log(`♇  Pluto: ${chart.pluto.sign} ${chart.pluto.degree.toFixed(2)}° (House ${chart.pluto.house})`);
    if (chart.pluto.retrograde) console.log('   ⟲ Retrograde');

    console.log(`\n⭐ Ascendant: ${chart.ascendant.sign} ${chart.ascendant.degree.toFixed(2)}°`);
    console.log(`🏔️  Midheaven: ${chart.midheaven.sign} ${chart.midheaven.degree.toFixed(2)}°`);

    console.log('\n\n🔮 MAJOR ASPECTS:\n');
    console.log('═══════════════════════════════════════════════════════\n');

    // Group aspects by type
    const aspectsByType: Record<string, typeof chart.aspects> = {
      conjunction: [],
      opposition: [],
      trine: [],
      square: [],
      sextile: [],
      quincunx: [],
    };

    chart.aspects.forEach(aspect => {
      aspectsByType[aspect.type].push(aspect);
    });

    Object.entries(aspectsByType).forEach(([type, aspects]) => {
      if (aspects.length > 0) {
        console.log(`${type.toUpperCase()}:`);
        aspects.forEach(aspect => {
          const exactMarker = aspect.exact ? ' ⚡ EXACT' : '';
          console.log(`  ${aspect.planet1} ${type} ${aspect.planet2} (orb: ${aspect.orb.toFixed(2)}°)${exactMarker}`);
        });
        console.log('');
      }
    });

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('\n✅ Chart calculated successfully!\n');
    console.log('This is Time Passages-level precision using Astronomy Engine.');
    console.log('Compare with your known chart to verify accuracy.\n');

  } catch (error) {
    console.error('\n❌ Error calculating chart:', error);
    if (error instanceof Error) {
      console.error('Details:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

testChart();
