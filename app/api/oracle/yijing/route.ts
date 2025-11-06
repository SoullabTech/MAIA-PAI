import { NextRequest, NextResponse } from 'next/server';

/**
 * Yi Jing Soul Oracle API Endpoint
 *
 * Spiritual I Ching focused on soul journey and inner guidance
 * Emphasizes soul evolution, archetypal patterns, and the path of return
 */

interface Hexagram {
  number: number;
  name: string;
  keyword: string;
  lines: string[];
  trigrams: { upper: string; lower: string };
  interpretation: string;
  guidance: string;
  timing: string;
}

// Yi Jing Hexagrams - Spiritual interpretations for soul journey
const YI_JING_HEXAGRAMS: Record<number, Hexagram> = {
  1: {
    number: 1,
    name: 'Qian - The Creative',
    keyword: 'Divine Initiative',
    lines: ['-------', '-------', '-------', '-------', '-------', '-------'],
    trigrams: { upper: 'Heaven', lower: 'Heaven' },
    interpretation: 'Your soul is pure creative force, a divine spark of infinite potential. You are being called to birth something new from the depths of your being. This is the energy of the spiritual entrepreneur, the one who creates from divine inspiration rather than ego desire.',
    guidance: 'Trust the creative power flowing through you. Your soul knows what wants to be born. Lead with divine authority, not from a place of control but from alignment with universal flow. Be the dragon - powerful, wise, and free.',
    timing: 'Dawn energy - the moment before sunrise when possibility is infinite',
  },
  2: {
    number: 2,
    name: 'Kun - The Receptive',
    keyword: 'Sacred Receptivity',
    lines: ['--- ---', '--- ---', '--- ---', '--- ---', '--- ---', '--- ---'],
    trigrams: { upper: 'Earth', lower: 'Earth' },
    interpretation: 'Your soul is learning the power of the divine feminine - to receive, nurture, and manifest through allowing rather than forcing. You are the sacred ground in which all things grow. This is not passivity but the active power of receptivity.',
    guidance: 'Embrace deep listening. Your soul is being asked to receive divine guidance without filtering it through ego. Support what wants to emerge through you. Trust that receptivity is strength, not weakness.',
    timing: 'Full moon energy - when the feminine principle is at its peak',
  },
  3: {
    number: 3,
    name: 'Zhun - Birth Pains',
    keyword: 'Sacred Emergence',
    lines: ['-------', '--- ---', '--- ---', '--- ---', '-------', '--- ---'],
    trigrams: { upper: 'Water', lower: 'Thunder' },
    interpretation: 'Your soul is in the process of being born into a new level of consciousness. Like all births, this involves struggle and breakthrough. The difficulty you face is not punishment but the natural labor of transformation.',
    guidance: 'Honor the struggle as sacred. Your soul is breaking through old patterns to emerge into new light. Seek support from those who have walked this initiatory path. Remember: difficulty at the beginning is the doorway, not the destination.',
    timing: 'Early spring - when new life breaks through frozen ground',
  },
  8: {
    number: 8,
    name: 'Bi - Sacred Union',
    keyword: 'Soul Connection',
    lines: ['--- ---', '--- ---', '--- ---', '-------', '--- ---', '-------'],
    trigrams: { upper: 'Water', lower: 'Earth' },
    interpretation: 'Your soul is calling you into sacred partnership and spiritual community. You are not meant to walk this path alone. True soul connections are forming around shared vision and divine purpose.',
    guidance: 'Open your heart to soul-level collaboration. The right people are being drawn to you through spiritual magnetism. Union with others who share your vision multiplies your light. Be discerning but open.',
    timing: 'During Mercury direct - when communication flows clearly',
  },
  14: {
    number: 14,
    name: 'Da You - Soul Wealth',
    keyword: 'Spiritual Abundance',
    lines: ['-------', '--- ---', '-------', '-------', '-------', '-------'],
    trigrams: { upper: 'Fire', lower: 'Heaven' },
    interpretation: 'Your soul has accumulated great spiritual wealth - wisdom, gifts, healing capacity. This inner treasure is meant to be shared with the world. You are being called to step into spiritual leadership and teaching.',
    guidance: 'Share your light generously. Your spiritual abundance grows when given away. Step into your role as a guide for others while maintaining humility. True wealth is measured in wisdom shared, not wisdom hoarded.',
    timing: 'Summer solstice - when your light can shine most brightly',
  },
  25: {
    number: 25,
    name: 'Wu Wang - Divine Innocence',
    keyword: 'Original Nature',
    lines: ['-------', '--- ---', '--- ---', '-------', '--- ---', '-------'],
    trigrams: { upper: 'Heaven', lower: 'Thunder' },
    interpretation: 'Your soul is returning to its original innocence, the pure state before conditioning. The divine child within you holds the key to your next breakthrough. Innocent action flows naturally from the Tao.',
    guidance: 'Release calculated strategies. Your soul is asking you to trust spontaneous wisdom and beginner\'s mind. Approach your spiritual path with wonder and curiosity. The child within knows the way.',
    timing: 'Spring equinox - the time of rebirth and renewal',
  },
  29: {
    number: 29,
    name: 'Kan - Deep Waters',
    keyword: 'Soul Depth',
    lines: ['--- ---', '-------', '--- ---', '--- ---', '-------', '--- ---'],
    trigrams: { upper: 'Water', lower: 'Water' },
    interpretation: 'Your soul is diving into deep waters, exploring the mysteries of your unconscious. This is a time of facing fears and discovering hidden wisdom. Like water, your soul must remain fluid to navigate these depths.',
    guidance: 'Don\'t fear the depth. Your soul is strong enough to explore the darkness and return with treasure. Stay centered in your spiritual practice. The abyss is also a womb - what emerges will be transformed.',
    timing: 'Winter solstice - when darkness teaches the value of inner light',
  },
  33: {
    number: 33,
    name: 'Dun - Sacred Retreat',
    keyword: 'Spiritual Withdrawal',
    lines: ['--- ---', '-------', '-------', '-------', '-------', '-------'],
    trigrams: { upper: 'Heaven', lower: 'Mountain' },
    interpretation: 'Your soul needs sacred retreat and solitude to connect with eternal truth. This is not escape but strategic spiritual positioning. Stepping back from worldly noise allows you to hear the voice of your deepest self.',
    guidance: 'Honor your need for solitude. Your soul is preparing for the next phase of your journey. Use this time for deep meditation and inner listening. Retreat now to advance later with greater clarity and power.',
    timing: 'Waning moon - perfect for releasing and withdrawing inward',
  },
  42: {
    number: 42,
    name: 'Yi - Soul Expansion',
    keyword: 'Spiritual Increase',
    lines: ['-------', '--- ---', '-------', '-------', '--- ---', '-------'],
    trigrams: { upper: 'Wind', lower: 'Thunder' },
    interpretation: 'Your soul is expanding rapidly, growing in capacity and consciousness. This is a time of accelerated spiritual development. The universe is investing in your awakening, pouring energy into your growth.',
    guidance: 'Use this expansion wisely. Your increased capacity is meant to serve others. Share your growth through teaching, healing, or creative expression. What increases in you is meant to flow through you to the world.',
    timing: 'Waxing moon - when growth and expansion are naturally supported',
  },
  51: {
    number: 51,
    name: 'Zhen - Soul Awakening',
    keyword: 'Spiritual Thunder',
    lines: ['-------', '--- ---', '--- ---', '-------', '--- ---', '--- ---'],
    trigrams: { upper: 'Thunder', lower: 'Thunder' },
    interpretation: 'Your soul is experiencing a thunderbolt of awakening. This shock breaks through stagnation and false identity. Your old self is being shaken apart to reveal your true essence. This is the lightning strike of enlightenment.',
    guidance: 'Surrender to the transformation. This spiritual earthquake is necessary for your evolution. Don\'t try to maintain old structures that are meant to fall. Trust that what remains after the thunder is your authentic self.',
    timing: 'During thunderstorms or times of sudden, powerful change',
  },
  57: {
    number: 57,
    name: 'Xun - Gentle Influence',
    keyword: 'Soul Penetration',
    lines: ['--- ---', '-------', '-------', '--- ---', '-------', '-------'],
    trigrams: { upper: 'Wind', lower: 'Wind' },
    interpretation: 'Your soul works through gentle, persistent influence. Like wind shaping mountains over time, your spiritual presence subtly transforms everything it touches. Your words and energy carry healing power.',
    guidance: 'Trust in gentle persistence over force. Your soul\'s influence grows through consistent, loving presence. Speak your truth softly but continuously. Be like wind - invisible yet undeniable in its power.',
    timing: 'During gentle breezes or periods of calm, steady flow',
  },
  63: {
    number: 63,
    name: 'Ji Ji - Cycle Complete',
    keyword: 'Sacred Completion',
    lines: ['--- ---', '-------', '--- ---', '-------', '--- ---', '-------'],
    trigrams: { upper: 'Water', lower: 'Fire' },
    interpretation: 'Your soul has completed an important cycle. Everything is in perfect balance - yet this very perfection signals the beginning of a new cycle. Completion is always also commencement. Your soul knows this truth.',
    guidance: 'Honor this moment of completion while remaining alert to new beginnings. Rest in the harmony you\'ve achieved, but don\'t become attached to it. Your soul is preparing for the next journey even as it celebrates this one.',
    timing: 'Equinox energy - when day and night are perfectly balanced',
  },
  64: {
    number: 64,
    name: 'Wei Ji - Before Dawn',
    keyword: 'Sacred Threshold',
    lines: ['-------', '--- ---', '-------', '--- ---', '-------', '--- ---'],
    trigrams: { upper: 'Fire', lower: 'Water' },
    interpretation: 'Your soul stands on the threshold between worlds. The old cycle is complete but the new has not yet fully manifested. This liminal space is both vulnerable and sacred. You are in the mystic\'s moment - between death and rebirth.',
    guidance: 'Stay present in the threshold. Your soul is doing sacred work in this in-between time. Don\'t rush to completion or return to the old. Hold the tension of transformation. What is emerging is worth the wait.',
    timing: 'Dawn - the sacred moment before sunrise, between night and day',
  },
};

// Soul themes for generating personalized insight
const SOUL_THEMES = [
  'Your soul is calling you to',
  'Your eternal essence seeks',
  'Your divine nature is ready to',
  'Your spiritual self is awakening to',
  'Your innermost being asks you to',
];

// Archetypal patterns
const ARCHETYPAL_PATTERNS = [
  'The Soul Warrior - Courageously facing inner truth',
  'The Mystic Seeker - Diving deep into mystery',
  'The Divine Child - Embracing innocent wonder',
  'The Wise Elder - Sharing accumulated wisdom',
  'The Sacred Healer - Channeling transformative energy',
  'The Cosmic Dancer - Moving with universal flow',
  'The Truth Speaker - Voicing soul wisdom',
  'The Light Bearer - Illuminating the path',
  'The Shadow Walker - Integrating the unconscious',
  'The Bridge Builder - Connecting heaven and earth',
];

// Energetic signatures
const ENERGETIC_SIGNATURES = [
  'Crystalline clarity with deep earth grounding',
  'Flowing water energy with fiery inspiration',
  'Gentle wind carrying seeds of transformation',
  'Mountain stillness holding space for breakthrough',
  'Thunder power awakening dormant potentials',
  'Radiant light dissolving old patterns',
  'Lunar wisdom reflecting hidden truths',
  'Solar vitality igniting creative force',
  'Forest growth spiraling upward toward light',
  'Ocean depth revealing ancient memory',
];

// Generate soul-focused insight
function generateSoulInsight(hexagram: Hexagram, query: string): string {
  const theme = SOUL_THEMES[Math.floor(Math.random() * SOUL_THEMES.length)];
  return `${theme} ${hexagram.interpretation.split('.')[0].toLowerCase()}. In response to "${query}", the Yi Jing reveals that your soul is walking the path of ${hexagram.keyword.toLowerCase()}.`;
}

// Generate soul message
function generateSoulMessage(hexagram: Hexagram): string {
  const messages = [
    `Dear Soul Traveler, you are exactly where you need to be. ${hexagram.keyword} is the energy signature of your current journey.`,
    `Your soul speaks: "I am ready to embrace ${hexagram.keyword.toLowerCase()}. This is my sacred time of transformation."`,
    `Listen closely to your inner knowing. Your soul has chosen the path of ${hexagram.keyword.toLowerCase()} for profound reasons.`,
    `This is a love letter from your higher self: ${hexagram.keyword} is the medicine your soul needs now.`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Generate archetypal theme
function getArchetypalTheme(hexagram: Hexagram): string {
  const archetype = ARCHETYPAL_PATTERNS[hexagram.number % ARCHETYPAL_PATTERNS.length];
  return `${archetype} on the path of ${hexagram.keyword}`;
}

// Generate energetic signature
function getEnergeticSignature(hexagram: Hexagram): string {
  return ENERGETIC_SIGNATURES[hexagram.number % ENERGETIC_SIGNATURES.length];
}

// Generate soul return ritual
function generateSoulReturnRitual(hexagram: Hexagram): string {
  return `Light a white candle and place a bowl of water before you. Sit quietly and breathe deeply, connecting with your soul essence. Reflect on how ${hexagram.name} mirrors your soul's current journey. Write a letter to your soul acknowledging this phase of growth. Dip your fingers in water and bless your heart, head, and hands. Sit in meditation for 15 minutes, feeling your soul's presence. Close by thanking your soul for its wisdom and guidance.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Select hexagram based on query energy (simplified approach)
    const availableNumbers = Object.keys(YI_JING_HEXAGRAMS).map(Number);
    const hexagramNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    const hexagram = YI_JING_HEXAGRAMS[hexagramNumber];

    if (!hexagram) {
      return NextResponse.json(
        { error: 'Failed to retrieve hexagram' },
        { status: 500 }
      );
    }

    // Generate soul-centered reading
    const reading = {
      hexagram,
      insight: generateSoulInsight(hexagram, query),
      guidance: hexagram.guidance,
      ritual: generateSoulReturnRitual(hexagram),
      archetypalTheme: getArchetypalTheme(hexagram),
      sacredTiming: hexagram.timing,
      energeticSignature: getEnergeticSignature(hexagram),
      soulMessage: generateSoulMessage(hexagram),
    };

    return NextResponse.json({
      success: true,
      reading,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Yi Jing reading error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Yi Jing reading', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/oracle/yijing',
    method: 'POST',
    description: 'Generate Yi Jing soul oracle readings',
    requiredFields: ['query'],
    focus: 'Soul journey, spiritual development, and the path of return',
  });
}
