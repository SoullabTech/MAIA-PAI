import { NextRequest, NextResponse } from 'next/server';

/**
 * I Ching Oracle API Endpoint
 *
 * Generates hexagram readings based on line values from yarrow stalk casting
 * Uses traditional I Ching wisdom with spiritual interpretation
 */

interface HexagramLine {
  type: 'yang' | 'yin';
  changing: boolean;
  value: number; // 6-9 traditional values
}

interface Hexagram {
  number: number;
  name: string;
  keyword: string;
  lines: string[];
  trigrams: { upper: string; lower: string };
  interpretation: string;
  guidance: string;
  timing: string;
  changingLines?: number[];
  transformed?: {
    number: number;
    name: string;
    keyword: string;
  };
}

// Partial hexagram database (full database would be 64 hexagrams)
const HEXAGRAMS: Record<number, Omit<Hexagram, 'changingLines' | 'transformed'>> = {
  1: {
    number: 1,
    name: 'Qian',
    keyword: 'Creative Heaven',
    lines: ['-------', '-------', '-------', '-------', '-------', '-------'],
    trigrams: { upper: 'Heaven', lower: 'Heaven' },
    interpretation: 'Pure creative force flows through you. This is the time of the spiritual entrepreneur, the one who creates from divine inspiration. The universe supports bold action and visionary leadership.',
    guidance: 'Lead with divine authority. Your creative power is at its peak. Trust your vision and manifest boldly. The dragon energy within you is ready to take flight.',
    timing: 'New moon or dawn energy - perfect for initiating new spiritual projects',
  },
  2: {
    number: 2,
    name: 'Kun',
    keyword: 'Receptive Earth',
    lines: ['--- ---', '--- ---', '--- ---', '--- ---', '--- ---', '--- ---'],
    trigrams: { upper: 'Earth', lower: 'Earth' },
    interpretation: 'The divine feminine receives and nurtures all creation. You are in a time of deep listening and sacred receptivity. Like the earth, you have the power to support and manifest.',
    guidance: 'Embrace the power of receptivity. Support others\' visions while staying true to your own inner knowing. Nurture what seeks to grow through you.',
    timing: 'Full moon or evening energy - perfect for deep contemplation and healing',
  },
  3: {
    number: 3,
    name: 'Zhun',
    keyword: 'Difficulty at the Beginning',
    lines: ['-------', '--- ---', '--- ---', '--- ---', '-------', '--- ---'],
    trigrams: { upper: 'Water', lower: 'Thunder' },
    interpretation: 'Birth is always challenging. You are in the chaos before form emerges. This difficulty is not a sign to stop, but the natural labor pains of something being born.',
    guidance: 'Persevere through initial challenges. Seek help from those who have walked this path. The difficulties are temporary; the creation will last.',
    timing: 'Early spring - when new life breaks through frozen ground',
  },
  8: {
    number: 8,
    name: 'Bi',
    keyword: 'Union',
    lines: ['--- ---', '--- ---', '--- ---', '-------', '--- ---', '-------'],
    trigrams: { upper: 'Water', lower: 'Earth' },
    interpretation: 'Sacred partnerships and soul connections are forming. You are called to join with others in spiritual service. True power comes through unity and shared vision.',
    guidance: 'Seek those who share your vision. True union comes from shared purpose and spiritual alignment. Be discerning but open-hearted.',
    timing: 'During Mercury direct periods - excellent for forming lasting partnerships',
  },
  14: {
    number: 14,
    name: 'Da You',
    keyword: 'Great Possession',
    lines: ['-------', '--- ---', '-------', '-------', '-------', '-------'],
    trigrams: { upper: 'Fire', lower: 'Heaven' },
    interpretation: 'You possess great spiritual wealth and wisdom. This is a time of sharing your gifts with the world. Your light illuminates the path for others.',
    guidance: 'Your inner riches are meant to be shared. Step into your role as a spiritual teacher or guide. Humility and generosity will multiply your blessings.',
    timing: 'Summer solstice energy - perfect for public spiritual work',
  },
  25: {
    number: 25,
    name: 'Wu Wang',
    keyword: 'Innocence',
    lines: ['-------', '--- ---', '--- ---', '-------', '--- ---', '-------'],
    trigrams: { upper: 'Heaven', lower: 'Thunder' },
    interpretation: 'Return to your original nature. The divine child within you holds the key to your next spiritual breakthrough. Innocent action flows naturally from the Tao.',
    guidance: 'Approach your path with beginner\'s mind. Innocence and wonder will guide you to truth. Release calculation and trust spontaneous wisdom.',
    timing: 'Spring equinox energy - perfect for spiritual rebirth',
  },
  29: {
    number: 29,
    name: 'Kan',
    keyword: 'The Abysmal Water',
    lines: ['--- ---', '-------', '--- ---', '--- ---', '-------', '--- ---'],
    trigrams: { upper: 'Water', lower: 'Water' },
    interpretation: 'You are in deep waters, facing challenges that test your faith. Like water, you must remain fluid and find the way through. Danger teaches mastery.',
    guidance: 'Stay centered in the flow. Don\'t fight the current, but navigate skillfully. Your depth and adaptability will see you through.',
    timing: 'Winter solstice - when darkness teaches the value of inner light',
  },
  33: {
    number: 33,
    name: 'Dun',
    keyword: 'Retreat',
    lines: ['--- ---', '-------', '-------', '-------', '-------', '-------'],
    trigrams: { upper: 'Heaven', lower: 'Mountain' },
    interpretation: 'Spiritual retreat is necessary for your soul\'s evolution. Step back from worldly concerns to connect with the eternal. This is strategic positioning, not defeat.',
    guidance: 'This is not withdrawal but strategic spiritual positioning. Use solitude to connect with your higher purpose. Retreat to advance.',
    timing: 'Waning moon - perfect for releasing and inner work',
  },
  42: {
    number: 42,
    name: 'Yi',
    keyword: 'Increase',
    lines: ['-------', '--- ---', '-------', '-------', '--- ---', '-------'],
    trigrams: { upper: 'Wind', lower: 'Thunder' },
    interpretation: 'Your spiritual capacities are expanding rapidly. This is a time of accelerated growth and awakening. The universe is investing in your development.',
    guidance: 'Use this expansion wisely. Share your growth through teaching, healing, or creative expression. What increases must be circulated.',
    timing: 'Waxing moon phases - excellent for spiritual development',
  },
  51: {
    number: 51,
    name: 'Zhen',
    keyword: 'Thunder',
    lines: ['-------', '--- ---', '--- ---', '-------', '--- ---', '--- ---'],
    trigrams: { upper: 'Thunder', lower: 'Thunder' },
    interpretation: 'Spiritual awakening comes like thunder - sudden, powerful, and transformative. Your old self is being shaken awake. This shock breaks through stagnation.',
    guidance: 'Don\'t resist the spiritual earthquake happening within you. This shock is necessary for your evolution. Let the old structures fall.',
    timing: 'During thunderstorms or times of rapid change',
  },
  57: {
    number: 57,
    name: 'Xun',
    keyword: 'The Gentle Wind',
    lines: ['--- ---', '-------', '-------', '--- ---', '-------', '-------'],
    trigrams: { upper: 'Wind', lower: 'Wind' },
    interpretation: 'Gentle spiritual influence works through you. Your words and presence carry healing energy to others. Subtle penetration is more powerful than force.',
    guidance: 'Speak your truth with gentle persistence. Your spiritual influence grows through consistent, loving action. Be like wind shaping mountains.',
    timing: 'During gentle breezes or calm, flowing periods',
  },
  63: {
    number: 63,
    name: 'Ji Ji',
    keyword: 'After Completion',
    lines: ['--- ---', '-------', '--- ---', '-------', '--- ---', '-------'],
    trigrams: { upper: 'Water', lower: 'Fire' },
    interpretation: 'A cycle completes perfectly. Everything is in balance, yet this very perfection signals the beginning of change. Completion is also commencement.',
    guidance: 'Appreciate this moment of harmony while remaining alert to emerging changes. Rest but don\'t become complacent. Perfect balance is a moment, not a destination.',
    timing: 'Equinox energy - when day and night are equal',
  },
  64: {
    number: 64,
    name: 'Wei Ji',
    keyword: 'Before Completion',
    lines: ['-------', '--- ---', '-------', '--- ---', '-------', '--- ---'],
    trigrams: { upper: 'Fire', lower: 'Water' },
    interpretation: 'You are on the threshold. The journey is not yet complete, but the end is in sight. This is the most crucial time - careful attention brings success.',
    guidance: 'Stay focused and careful. The last steps are critical. Your vision is valid; maintain effort until true completion. Almost there is not yet there.',
    timing: 'Dawn - the moment before sunrise',
  },
};

// Generate a hexagram number based on the line pattern
function getHexagramNumber(lines: HexagramLine[]): number {
  // Convert lines to binary pattern
  let binaryPattern = '';
  for (const line of lines) {
    binaryPattern += line.type === 'yang' ? '1' : '0';
  }

  // Use pattern to determine hexagram (simplified approach)
  const patternValue = parseInt(binaryPattern, 2);
  const hexagramNumber = (patternValue % Object.keys(HEXAGRAMS).length) + 1;

  // If the exact number isn't in our database, find the closest one
  const availableNumbers = Object.keys(HEXAGRAMS).map(Number);
  if (HEXAGRAMS[hexagramNumber]) {
    return hexagramNumber;
  }

  // Return a random available hexagram
  return availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
}

// Get transformed hexagram based on changing lines
function getTransformedHexagram(
  originalNumber: number,
  changingLines: number[]
): { number: number; name: string; keyword: string } | undefined {
  if (changingLines.length === 0) return undefined;

  // Calculate transformed hexagram (simplified - normally based on flipped lines)
  const transformedNumber = (originalNumber + changingLines.length * 7) % Object.keys(HEXAGRAMS).length + 1;
  const transformed = HEXAGRAMS[transformedNumber];

  if (transformed) {
    return {
      number: transformed.number,
      name: transformed.name,
      keyword: transformed.keyword,
    };
  }

  return undefined;
}

// Generate spiritual interpretation based on query and hexagram
function generateInsight(hexagram: Hexagram, query: string): string {
  const soulThemes = [
    'Your soul is calling you to',
    'This is a sacred time of',
    'Your spiritual essence is',
    'The divine within you seeks',
    'Your soul\'s wisdom speaks of',
  ];

  const theme = soulThemes[Math.floor(Math.random() * soulThemes.length)];
  return `${theme} ${hexagram.interpretation.toLowerCase()} In response to "${query}", the I Ching reveals that the energy of ${hexagram.keyword.toLowerCase()} is active in your situation.`;
}

// Generate archetypal theme
function getArchetypalTheme(hexagram: Hexagram): string {
  const archetypes = [
    'The Spiritual Warrior',
    'The Mystic Seeker',
    'The Divine Child',
    'The Wise Elder',
    'The Sacred Healer',
    'The Cosmic Dancer',
    'The Truth Speaker',
    'The Light Bearer',
    'The Shadow Walker',
  ];

  return `${archetypes[hexagram.number % archetypes.length]} walking the path of ${hexagram.keyword}`;
}

// Generate ritual suggestion
function generateRitual(hexagram: Hexagram): string {
  return `Create sacred space with incense or candlelight. Contemplate the lines of ${hexagram.name} and journal about how this hexagram reflects your current situation. If there are changing lines, meditate on the transformation occurring. Close with gratitude for the wisdom received.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, lines } = body;

    if (!query || !lines) {
      return NextResponse.json(
        { error: 'Query and lines are required' },
        { status: 400 }
      );
    }

    // Parse lines to determine hexagram
    const hexagramLines: HexagramLine[] = lines;
    const changingLines: number[] = hexagramLines
      .map((line, index) => (line.changing ? index + 1 : -1))
      .filter(i => i !== -1);

    // Get hexagram number from line pattern
    const hexagramNumber = getHexagramNumber(hexagramLines);
    const baseHexagram = HEXAGRAMS[hexagramNumber];

    if (!baseHexagram) {
      return NextResponse.json(
        { error: 'Invalid hexagram pattern' },
        { status: 400 }
      );
    }

    // Build complete hexagram with changing lines and transformation
    const hexagram: Hexagram = {
      ...baseHexagram,
      changingLines: changingLines.length > 0 ? changingLines : undefined,
      transformed: getTransformedHexagram(hexagramNumber, changingLines),
    };

    // Generate reading
    const reading = {
      hexagram,
      insight: generateInsight(hexagram, query),
      guidance: hexagram.guidance,
      ritual: generateRitual(hexagram),
      archetypalTheme: getArchetypalTheme(hexagram),
      sacredTiming: hexagram.timing,
    };

    return NextResponse.json({
      success: true,
      reading,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ I Ching reading error:', error);
    return NextResponse.json(
      { error: 'Failed to generate I Ching reading', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/oracle/iching',
    method: 'POST',
    description: 'Generate I Ching hexagram readings',
    requiredFields: ['query', 'lines'],
    lineFormat: [
      {
        type: 'yang or yin',
        changing: 'boolean',
        value: '6-9 (traditional yarrow stalk values)',
      },
    ],
  });
}
