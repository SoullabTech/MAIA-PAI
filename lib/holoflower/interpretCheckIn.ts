/**
 * Holoflower Check-In Interpretation Logic
 *
 * Translates 12-petal configuration into human-readable insights
 * that inform MAIA's responses and attunement.
 *
 * Supports multi-modal oracle integration (Holoflower, I Ching, Tarot)
 * through flexible "fuzzy logic" interpretation framework.
 */

export interface HoloflowerCheckInData {
  values: number[]; // 12 values, 0-10 scale
  facets: Array<{
    code: string;
    name: string;
    value: number;
    element: string;
    phase: string;
  }>;
  coherence: number; // 0-1
  dominant?: string;
  shadow?: string;
  signature: string;
  timestamp: string;
}

export interface ElementalScores {
  air: number;
  fire: number;
  water: number;
  earth: number;
}

export interface CheckInInterpretation {
  elementalScores: ElementalScores;
  dominant: string;
  shadow: string;
  coherence: number;
  coherenceLevel: 'initiation' | 'exploration' | 'integration' | 'master';
  patterns: string[]; // Detected sacred geometry patterns
  insights: {
    dominant: string;
    shadow: string;
    coherence: string;
    overall: string;
  };
  maiaContext: string; // Formatted for system prompt
}

/**
 * Calculate elemental scores from 12-petal configuration
 * Petals 1-3: Air, 4-6: Fire, 7-9: Water, 10-12: Earth
 */
export function calculateElementalScores(values: number[]): ElementalScores {
  const air = (values[0] + values[1] + values[2]) / 3;
  const fire = (values[3] + values[4] + values[5]) / 3;
  const water = (values[6] + values[7] + values[8]) / 3;
  const earth = (values[9] + values[10] + values[11]) / 3;

  return { air, fire, water, earth };
}

/**
 * Detect sacred geometry patterns in petal configuration
 * Triangles, crosses, spirals indicate specific archetypal states
 */
function detectPatterns(values: number[], elementalScores: ElementalScores): string[] {
  const patterns: string[] = [];
  const threshold = 7; // High activation threshold

  // Fire Triangle (3 fire petals highly activated)
  if (values[3] >= threshold && values[4] >= threshold && values[5] >= threshold) {
    patterns.push('Fire Triangle: Visionary Leader');
  }

  // Water Triangle (3 water petals highly activated)
  if (values[6] >= threshold && values[7] >= threshold && values[8] >= threshold) {
    patterns.push('Water Triangle: Healing Guide');
  }

  // Earth Triangle (3 earth petals highly activated)
  if (values[9] >= threshold && values[10] >= threshold && values[11] >= threshold) {
    patterns.push('Earth Triangle: Master Builder');
  }

  // Air Triangle (3 air petals highly activated)
  if (values[0] >= threshold && values[1] >= threshold && values[2] >= threshold) {
    patterns.push('Air Triangle: Wisdom Teacher');
  }

  // Cross Patterns (opposite petals activated)
  if (values[0] >= threshold && values[6] >= threshold) {
    patterns.push('Vision + Heart: Aligned Purpose');
  }
  if (values[3] >= threshold && values[9] >= threshold) {
    patterns.push('Passion + Ground: Embodied Action');
  }

  // Perfect Balance (all elements within 1 point of each other)
  const scores = Object.values(elementalScores);
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  if (max - min <= 1) {
    patterns.push('Living Mandala: Perfect Balance');
  }

  // Fire + Water (Sacred Activist)
  if (elementalScores.fire >= 7 && elementalScores.water >= 7) {
    patterns.push('Sacred Activist: Heart-Fire United');
  }

  // Earth + Air (Wisdom Bridge)
  if (elementalScores.earth >= 7 && elementalScores.air >= 7) {
    patterns.push('Wisdom Bridge: Grounded Vision');
  }

  return patterns;
}

/**
 * Generate element-specific insights
 */
function generateElementInsight(element: string, score: number, isHighest: boolean, isLowest: boolean): string {
  const insights: Record<string, Record<string, string>> = {
    fire: {
      high: 'Your vision burns bright—creative fire is flowing.',
      low: 'Your fire seeks rekindling—passion may need gentle attention.',
      dominant: 'Fire guides you now—trust your vision and boldness.',
      shadow: 'Fire is calling—what vision wants to be seen?'
    },
    water: {
      high: 'Emotional waters are flowing with depth and clarity.',
      low: 'Water is quiet—emotions may be asking for space to flow.',
      dominant: 'Water leads—intuition and feeling are your compass.',
      shadow: 'Water seeks attention—what emotions need acknowledgment?'
    },
    earth: {
      high: 'Deeply grounded—your foundation is solid and stable.',
      low: 'Earth is seeking—grounding and embodiment may serve you.',
      dominant: 'Earth anchors you—practical wisdom and presence are strong.',
      shadow: 'Earth calls—how might you ground more fully?'
    },
    air: {
      high: 'Mental clarity is sharp—ideas and communication flow easily.',
      low: 'Air is still—mental space may benefit from fresh perspective.',
      dominant: 'Air guides—your mind is clear and consciousness is elevated.',
      shadow: 'Air whispers—what new understanding wants to emerge?'
    }
  };

  if (isHighest) return insights[element].dominant;
  if (isLowest) return insights[element].shadow;
  if (score >= 7) return insights[element].high;
  if (score <= 3) return insights[element].low;

  return `${element.charAt(0).toUpperCase() + element.slice(1)} is present and balanced.`;
}

/**
 * Determine coherence level based on integration score
 */
function getCoherenceLevel(coherence: number): {
  level: 'initiation' | 'exploration' | 'integration' | 'master';
  description: string;
} {
  if (coherence >= 0.8) {
    return {
      level: 'master',
      description: 'Ready to guide others—you dance with wholeness.'
    };
  } else if (coherence >= 0.6) {
    return {
      level: 'integration',
      description: 'Dancing with your wholeness—elements are harmonizing.'
    };
  } else if (coherence >= 0.4) {
    return {
      level: 'exploration',
      description: 'Discovering your dimensions—patterns are emerging.'
    };
  } else {
    return {
      level: 'initiation',
      description: 'Beginning your sacred journey—welcome to the path.'
    };
  }
}

/**
 * Main interpretation function: translates check-in data into insights
 */
export function interpretCheckIn(data: HoloflowerCheckInData): CheckInInterpretation {
  const elementalScores = calculateElementalScores(data.values);

  // Find dominant and shadow elements
  const entries = Object.entries(elementalScores);
  const sorted = entries.sort(([, a], [, b]) => b - a);
  const dominant = sorted[0][0];
  const shadow = sorted[sorted.length - 1][0];

  // Detect patterns
  const patterns = detectPatterns(data.values, elementalScores);

  // Generate insights
  const dominantInsight = generateElementInsight(dominant, elementalScores[dominant as keyof ElementalScores], true, false);
  const shadowInsight = generateElementInsight(shadow, elementalScores[shadow as keyof ElementalScores], false, true);

  const coherenceInfo = getCoherenceLevel(data.coherence);
  const coherenceInsight = coherenceInfo.description;

  // Overall synthesis
  let overall = `You are ${coherenceInfo.level === 'master' ? 'in mastery' :
                          coherenceInfo.level === 'integration' ? 'integrating' :
                          coherenceInfo.level === 'exploration' ? 'exploring' : 'beginning'}. `;

  if (patterns.length > 0) {
    overall += `Sacred patterns detected: ${patterns.join(', ')}. `;
  }

  overall += `${dominant.charAt(0).toUpperCase() + dominant.slice(1)} is your current guide. `;
  overall += `${shadow.charAt(0).toUpperCase() + shadow.slice(1)} holds your next gift.`;

  // Format for MAIA's system prompt
  const maiaContext = `
User's Current State (from Holoflower check-in ${new Date(data.timestamp).toLocaleString()}):

Elemental Balance:
- Air (mental/communication): ${elementalScores.air.toFixed(1)}/10
- Fire (passion/vision): ${elementalScores.fire.toFixed(1)}/10
- Water (emotion/intuition): ${elementalScores.water.toFixed(1)}/10
- Earth (body/grounding): ${elementalScores.earth.toFixed(1)}/10

Integration: ${Math.round(data.coherence * 100)}% (${coherenceInfo.level})
Dominant Element: ${dominant} — ${dominantInsight}
Shadow Element: ${shadow} — ${shadowInsight}

${patterns.length > 0 ? `Sacred Patterns: ${patterns.join(', ')}` : ''}

Field Signature: ${data.signature}

Guidance for MAIA:
${coherenceInfo.level === 'master'
  ? 'This person is in mastery—invite them to teach, share wisdom, or explore subtle nuances.'
  : coherenceInfo.level === 'integration'
  ? 'Support their integration—acknowledge both strengths and emerging edges with equal reverence.'
  : coherenceInfo.level === 'exploration'
  ? 'Honor their exploration—provide gentle guidance while respecting the unfolding process.'
  : 'Hold them tenderly in initiation—offer grounding presence and simple invitations.'}

If they mention ${shadow}, acknowledge this as a sacred invitation, not a deficit.
If they lean into ${dominant}, celebrate this strength and explore its depths.
`.trim();

  return {
    elementalScores,
    dominant,
    shadow,
    coherence: data.coherence,
    coherenceLevel: coherenceInfo.level,
    patterns,
    insights: {
      dominant: dominantInsight,
      shadow: shadowInsight,
      coherence: coherenceInsight,
      overall
    },
    maiaContext
  };
}

/**
 * Check if check-in data is still fresh (within specified hours)
 */
export function isCheckInFresh(timestamp: string, hoursThreshold: number = 12): boolean {
  const checkInTime = new Date(timestamp);
  const now = new Date();
  const hoursSince = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
  return hoursSince < hoursThreshold;
}

/**
 * Get check-in data from localStorage if fresh
 */
export function getFreshCheckIn(): HoloflowerCheckInData | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('holoflower_checkin_today');
  if (!stored) return null;

  try {
    const data = JSON.parse(stored) as HoloflowerCheckInData;
    if (isCheckInFresh(data.timestamp)) {
      return data;
    }
  } catch (e) {
    console.error('Error parsing check-in data:', e);
  }

  return null;
}

/**
 * Generate short oracle message for user after check-in
 */
export function generateOracleMessage(interpretation: CheckInInterpretation): string {
  const { coherenceLevel, patterns, insights } = interpretation;

  let message = `🌺 ${insights.overall}\n\n`;

  if (coherenceLevel === 'master' && patterns.length > 0) {
    message += `You embody sacred patterns: ${patterns.join(', ')}. Your wholeness is a gift to others.\n\n`;
  } else if (patterns.length > 0) {
    message += `Sacred patterns emerging: ${patterns.join(', ')}.\n\n`;
  }

  message += `**Dominant:** ${insights.dominant}\n`;
  message += `**Shadow:** ${insights.shadow}\n`;
  message += `**Integration:** ${insights.coherence}`;

  return message;
}
