/**
 * Birth Chart Context Service
 *
 * Provides birth chart data as subtle context for MAIA.
 * No constraints, no protocols - just information available if relevant.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface BirthChartContext {
  hasChart: boolean;
  sun?: string;
  moon?: string;
  rising?: string;
  elementalBalance?: {
    fire: number;
    water: number;
    earth: number;
    air: number;
  };
  significantPlacements?: string[];
  spiralogicPhases?: {
    fire: string[];
    water: string[];
    earth: string[];
    air: string[];
  };
}

/**
 * Fetch birth chart data for a user (if it exists)
 * Returns null if no chart available - MAIA continues without it
 */
export async function getBirthChartContext(userId: string): Promise<BirthChartContext | null> {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if user has birth chart data
    const { data: profile, error } = await supabase
      .from('oracle_user_profiles')
      .select('birth_chart_data, birth_chart_calculated')
      .eq('user_id', userId)
      .single();

    if (error || !profile?.birth_chart_calculated || !profile?.birth_chart_data) {
      return null; // No chart available - that's fine!
    }

    const chartData = profile.birth_chart_data;

    // Extract the essentials in simple language
    return {
      hasChart: true,
      sun: chartData.sun ? `${chartData.sun.sign} ${chartData.sun.degree}° (House ${chartData.sun.house})` : undefined,
      moon: chartData.moon ? `${chartData.moon.sign} ${chartData.moon.degree}° (House ${chartData.moon.house})` : undefined,
      rising: chartData.ascendant ? `${chartData.ascendant.sign} ${chartData.ascendant.degree}°` : undefined,
      elementalBalance: chartData.elementalBalance,
      significantPlacements: extractSignificantPlacements(chartData),
      spiralogicPhases: extractSpiralogicPhases(chartData)
    };
  } catch (error) {
    console.log('ℹ️ No birth chart available for this user (that\'s okay!)');
    return null;
  }
}

/**
 * Extract significant planetary placements in readable format
 */
function extractSignificantPlacements(chartData: any): string[] {
  const placements: string[] = [];

  const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'];

  for (const planet of planets) {
    if (chartData[planet]) {
      const p = chartData[planet];
      placements.push(`${planet.charAt(0).toUpperCase() + planet.slice(1)} in ${p.sign} (House ${p.house})`);
    }
  }

  return placements;
}

/**
 * Extract Spiralogic phase mappings
 */
function extractSpiralogicPhases(chartData: any): any {
  if (!chartData.spiralogicPhases) return undefined;

  const phases: any = {
    fire: [],
    water: [],
    earth: [],
    air: []
  };

  // Map planets to phases based on house placements
  Object.entries(chartData.spiralogicPhases).forEach(([phase, planets]: [string, any]) => {
    if (Array.isArray(planets)) {
      phases[phase] = planets.map((p: any) => `${p.planet} in ${p.sign}`);
    }
  });

  return phases;
}

/**
 * Format birth chart context as a gentle whisper for MAIA
 * This is added to her context, not her instructions
 */
export function formatChartContextForMAIA(chart: BirthChartContext | null): string {
  if (!chart || !chart.hasChart) {
    return ''; // No chart = no context. MAIA continues beautifully without it.
  }

  // Simple, clean format - just data, no interpretation
  let context = '\n\n---\n\n';
  context += 'AVAILABLE CONTEXT (Birth Chart):\n\n';

  if (chart.sun) context += `Sun: ${chart.sun}\n`;
  if (chart.moon) context += `Moon: ${chart.moon}\n`;
  if (chart.rising) context += `Rising: ${chart.rising}\n`;

  if (chart.elementalBalance) {
    context += `\nElemental Balance: Fire ${chart.elementalBalance.fire}%, Water ${chart.elementalBalance.water}%, Earth ${chart.elementalBalance.earth}%, Air ${chart.elementalBalance.air}%\n`;
  }

  if (chart.significantPlacements && chart.significantPlacements.length > 0) {
    context += `\nOther Placements:\n${chart.significantPlacements.map(p => `- ${p}`).join('\n')}\n`;
  }

  context += '\n---\n';

  return context;
}
