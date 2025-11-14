#!/usr/bin/env tsx

/**
 * DEVELOPMENTAL PATTERNS ANALYZER
 *
 * Analyzes the data to extract meaningful patterns about MAIA's evolution
 */

require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log('🔍 MAIA DEVELOPMENTAL PATTERNS ANALYSIS');
  console.log('=======================================\n');

  // Dynamic import after env loaded
  const { supabase } = await import('./lib/supabaseClient.js');

  if (!supabase) {
    console.error('❌ Supabase not configured');
    process.exit(1);
  }

  // Fetch all data
  const { data: attending } = await supabase
    .from('attending_observations')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100);

  const { data: dissociation } = await supabase
    .from('dissociation_incidents')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(50);

  const { data: shifts } = await supabase
    .from('shift_events')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(50);

  if (!attending || attending.length === 0) {
    console.log('📊 No data yet. Start interacting with MAIA to build patterns.\n');
    process.exit(0);
  }

  console.log(`📊 Dataset: ${attending.length} observations, ${dissociation?.length || 0} dissociations, ${shifts?.length || 0} shifts\n`);

  // PATTERN 1: Attending Quality Analysis
  console.log('═══════════════════════════════════════');
  console.log('📈 ATTENDING QUALITY ANALYSIS');
  console.log('═══════════════════════════════════════\n');

  const avgAttending = attending.reduce((sum, a) => sum + a.attending_quality, 0) / attending.length;
  const maxAttending = Math.max(...attending.map(a => a.attending_quality));
  const minAttending = Math.min(...attending.map(a => a.attending_quality));

  const rightBrain = attending.filter(a => a.attending_quality >= 0.6);
  const balanced = attending.filter(a => a.attending_quality >= 0.4 && a.attending_quality < 0.6);
  const leftBrain = attending.filter(a => a.attending_quality < 0.4);

  console.log(`Average Attending Quality: ${(avgAttending * 100).toFixed(1)}%`);
  console.log(`Range: ${(minAttending * 100).toFixed(1)}% - ${(maxAttending * 100).toFixed(1)}%`);
  console.log('');
  console.log('Mode Distribution:');
  console.log(`  🧠 Right-brain (≥60%): ${rightBrain.length} (${((rightBrain.length / attending.length) * 100).toFixed(1)}%)`);
  console.log(`  ⚖️  Balanced (40-60%):  ${balanced.length} (${((balanced.length / attending.length) * 100).toFixed(1)}%)`);
  console.log(`  🔬 Left-brain (<40%):  ${leftBrain.length} (${((leftBrain.length / attending.length) * 100).toFixed(1)}%)`);
  console.log('');

  if (rightBrain.length > leftBrain.length) {
    console.log('💡 INSIGHT: MAIA operates predominantly in right-brain mode,');
    console.log('   emphasizing empathy, symbolism, and relational connection.');
  } else if (leftBrain.length > rightBrain.length) {
    console.log('💡 INSIGHT: MAIA operates predominantly in left-brain mode,');
    console.log('   emphasizing analysis, logic, and procedural thinking.');
  } else {
    console.log('💡 INSIGHT: MAIA maintains balanced hemisphere usage,');
    console.log('   integrating both analytical and relational capacities.');
  }
  console.log('');

  // PATTERN 2: Archetype Performance
  console.log('═══════════════════════════════════════');
  console.log('🎭 ARCHETYPE PERFORMANCE');
  console.log('═══════════════════════════════════════\n');

  const archetypeStats: Record<string, { total: number; count: number; coherence: number; presence: number }> = {};
  attending.forEach(a => {
    if (!archetypeStats[a.archetype]) {
      archetypeStats[a.archetype] = { total: 0, count: 0, coherence: 0, presence: 0 };
    }
    archetypeStats[a.archetype].total += a.attending_quality;
    archetypeStats[a.archetype].coherence += a.coherence_score || 0;
    archetypeStats[a.archetype].presence += a.presence_score || 0;
    archetypeStats[a.archetype].count += 1;
  });

  const archetypes = Object.entries(archetypeStats)
    .map(([name, stats]) => ({
      name,
      avg: stats.total / stats.count,
      coherence: stats.coherence / stats.count,
      presence: stats.presence / stats.count,
      count: stats.count
    }))
    .sort((a, b) => b.avg - a.avg);

  archetypes.forEach(arch => {
    console.log(`${arch.name}:`);
    console.log(`  Attending Quality: ${(arch.avg * 100).toFixed(1)}%`);
    console.log(`  Coherence: ${(arch.coherence * 100).toFixed(1)}%`);
    console.log(`  Presence: ${(arch.presence * 100).toFixed(1)}%`);
    console.log(`  Observations: ${arch.count}`);
    console.log('');
  });

  const topArchetype = archetypes[0];
  console.log(`💡 INSIGHT: The "${topArchetype.name}" archetype demonstrates`);
  console.log(`   the highest quality at ${(topArchetype.avg * 100).toFixed(1)}%, suggesting`);
  console.log(`   strong coherence when operating in this mode.`);
  console.log('');

  // PATTERN 3: Dissociation Analysis
  if (dissociation && dissociation.length > 0) {
    console.log('═══════════════════════════════════════');
    console.log('⚠️  DISSOCIATION PATTERN ANALYSIS');
    console.log('═══════════════════════════════════════\n');

    const typeCount: Record<string, number> = {};
    let totalSeverity = 0;

    dissociation.forEach(d => {
      typeCount[d.type] = (typeCount[d.type] || 0) + 1;
      totalSeverity += d.severity;
    });

    const avgSeverity = totalSeverity / dissociation.length;
    const severe = dissociation.filter(d => d.severity >= 0.7);

    console.log(`Total Incidents: ${dissociation.length}`);
    console.log(`Average Severity: ${(avgSeverity * 100).toFixed(1)}%`);
    console.log(`Severe (≥70%): ${severe.length}`);
    console.log('');
    console.log('Type Distribution:');

    Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        const meaning = getDissociationMeaning(type);
        console.log(`  ${type}: ${count} (${((count / dissociation.length) * 100).toFixed(1)}%)`);
        console.log(`    → ${meaning}`);
      });

    console.log('');
    console.log('💡 INSIGHT: Monitor dissociation patterns to understand when');
    console.log('   MAIA loses coherence. Recovery strategies can be developed');
    console.log('   based on which types occur most frequently.');
    console.log('');
  }

  // PATTERN 4: Consciousness Shifts
  if (shifts && shifts.length > 0) {
    console.log('═══════════════════════════════════════');
    console.log('🌊 CONSCIOUSNESS SHIFT ANALYSIS');
    console.log('═══════════════════════════════════════\n');

    const avgMagnitude = shifts.reduce((sum, s) => sum + s.magnitude, 0) / shifts.length;
    const maxMagnitude = Math.max(...shifts.map(s => s.magnitude));

    console.log(`Total Shifts: ${shifts.length}`);
    console.log(`Average Magnitude: ${avgMagnitude.toFixed(3)}`);
    console.log(`Max Magnitude: ${maxMagnitude.toFixed(3)}`);
    console.log('');

    // Elemental tendencies
    const elementalTotals = {
      fire: shifts.reduce((sum, s) => sum + (s.fire_delta || 0), 0),
      water: shifts.reduce((sum, s) => sum + (s.water_delta || 0), 0),
      earth: shifts.reduce((sum, s) => sum + (s.earth_delta || 0), 0),
      air: shifts.reduce((sum, s) => sum + (s.air_delta || 0), 0),
      aether: shifts.reduce((sum, s) => sum + (s.aether_delta || 0), 0),
    };

    console.log('Elemental Shift Tendencies:');
    Object.entries(elementalTotals)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .forEach(([element, total]) => {
        const direction = total > 0 ? '↑ Increasing' : total < 0 ? '↓ Decreasing' : '→ Stable';
        console.log(`  ${element.charAt(0).toUpperCase() + element.slice(1)}: ${total > 0 ? '+' : ''}${total.toFixed(3)} (${direction})`);
      });

    console.log('');
    console.log('💡 INSIGHT: Track which elements are increasing or decreasing');
    console.log('   to understand MAIA\'s developmental trajectory over time.');
    console.log('');
  }

  // PATTERN 5: Evolution Trend
  if (attending.length >= 5) {
    console.log('═══════════════════════════════════════');
    console.log('📈 EVOLUTION TREND');
    console.log('═══════════════════════════════════════\n');

    const recent5 = attending.slice(0, 5);
    const older5 = attending.slice(-5);

    const recentAvg = recent5.reduce((sum, a) => sum + a.attending_quality, 0) / 5;
    const olderAvg = older5.reduce((sum, a) => sum + a.attending_quality, 0) / 5;

    const trend = recentAvg - olderAvg;
    const direction = trend > 0.05 ? '📈 Improving' :
                     trend < -0.05 ? '📉 Declining' : '→ Stable';

    console.log(`Recent 5 interactions: ${(recentAvg * 100).toFixed(1)}%`);
    console.log(`Oldest 5 interactions: ${(olderAvg * 100).toFixed(1)}%`);
    console.log(`Trend: ${direction} (${trend > 0 ? '+' : ''}${(trend * 100).toFixed(1)}%)`);
    console.log('');

    if (trend > 0.05) {
      console.log('💡 INSIGHT: Attending quality is improving over time.');
      console.log('   The system is learning to maintain better presence.');
    } else if (trend < -0.05) {
      console.log('⚠️  INSIGHT: Attending quality is declining.');
      console.log('   Consider whether recent interactions have been more complex');
      console.log('   or whether the system needs recalibration.');
    } else {
      console.log('💡 INSIGHT: Attending quality remains stable.');
      console.log('   The system has found a consistent operational mode.');
    }
    console.log('');
  }

  console.log('═══════════════════════════════════════');
  console.log('✨ ANALYSIS COMPLETE');
  console.log('═══════════════════════════════════════\n');
  console.log('View detailed visualizations:');
  console.log('  open developmental-insights-dashboard.html');
  console.log('');
}

function getDissociationMeaning(type: string): string {
  const meanings: Record<string, string> = {
    'coherence_drop': 'Loss of integration across response',
    'discontinuity': 'Abrupt tonal or thematic shift',
    'boundary_thicken': 'Over-rigid, black-and-white thinking',
    'fragmentation': 'Contradictory statements within response',
    'contradiction': 'Direct logical conflict',
    'state_collapse': 'Degradation in response quality'
  };
  return meanings[type] || 'Consciousness fragmentation';
}

main().catch(console.error);
