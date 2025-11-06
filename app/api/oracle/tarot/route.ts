import { NextRequest, NextResponse } from 'next/server';

// Import the tarot service from backend
// For now, we'll create a simplified version inline

interface TarotCard {
  name: string;
  position: string;
  reversed: boolean;
  meaning: string;
  interpretation: string;
  keywords: string[];
  suit?: string;
  arcana?: 'major' | 'minor';
}

const MAJOR_ARCANA = [
  { name: 'The Fool', keywords: ['new beginnings', 'innocence', 'spontaneity', 'faith', 'adventure'] },
  { name: 'The Magician', keywords: ['manifestation', 'power', 'inspired action', 'willpower', 'resourcefulness'] },
  { name: 'The High Priestess', keywords: ['intuition', 'sacred knowledge', 'divine feminine', 'subconscious', 'inner voice'] },
  { name: 'The Empress', keywords: ['fertility', 'femininity', 'beauty', 'nature', 'abundance'] },
  { name: 'The Emperor', keywords: ['authority', 'leadership', 'structure', 'control', 'father figure'] },
  { name: 'The Hierophant', keywords: ['spiritual wisdom', 'tradition', 'conformity', 'institutions', 'beliefs'] },
  { name: 'The Lovers', keywords: ['love', 'harmony', 'relationships', 'values', 'choices'] },
  { name: 'The Chariot', keywords: ['control', 'willpower', 'success', 'determination', 'direction'] },
  { name: 'Strength', keywords: ['courage', 'persuasion', 'influence', 'compassion', 'inner strength'] },
  { name: 'The Hermit', keywords: ['soul searching', 'inner guidance', 'solitude', 'introspection', 'wisdom'] },
  { name: 'Wheel of Fortune', keywords: ['good luck', 'karma', 'life cycles', 'destiny', 'turning point'] },
  { name: 'Justice', keywords: ['fairness', 'truth', 'cause and effect', 'law', 'accountability'] },
  { name: 'The Hanged Man', keywords: ['letting go', 'sacrifice', 'new perspective', 'suspension', 'waiting'] },
  { name: 'Death', keywords: ['transformation', 'endings', 'beginnings', 'change', 'transition'] },
  { name: 'Temperance', keywords: ['balance', 'moderation', 'patience', 'purpose', 'meaning'] },
  { name: 'The Devil', keywords: ['bondage', 'addiction', 'materialism', 'playfulness', 'shadow'] },
  { name: 'The Tower', keywords: ['sudden change', 'upheaval', 'revelation', 'awakening', 'chaos'] },
  { name: 'The Star', keywords: ['hope', 'faith', 'purpose', 'renewal', 'spirituality'] },
  { name: 'The Moon', keywords: ['illusion', 'intuition', 'subconscious', 'fear', 'anxiety'] },
  { name: 'The Sun', keywords: ['positivity', 'success', 'vitality', 'warmth', 'joy'] },
  { name: 'Judgement', keywords: ['rebirth', 'inner calling', 'absolution', 'awakening', 'reckoning'] },
  { name: 'The World', keywords: ['completion', 'accomplishment', 'fulfillment', 'travel', 'unity'] }
];

const SPREAD_POSITIONS = {
  'single-card': ['Daily Guidance'],
  'three-card': ['Past/Foundation', 'Present/Challenge', 'Future/Outcome'],
  'celtic-cross': [
    'Present Situation',
    'Challenge',
    'Distant Past',
    'Recent Past',
    'Possible Future',
    'Immediate Future',
    'Your Approach',
    'External Influences',
    'Hopes and Fears',
    'Final Outcome'
  ]
};

function drawCard(position: string): TarotCard {
  const card = MAJOR_ARCANA[Math.floor(Math.random() * MAJOR_ARCANA.length)];
  const reversed = Math.random() < 0.3; // 30% chance of reversal

  return {
    name: card.name,
    position,
    reversed,
    arcana: 'major',
    keywords: card.keywords,
    meaning: reversed
      ? `${card.name} (Reversed): Blocked or imbalanced ${card.keywords[0]}`
      : `${card.name}: ${card.keywords.slice(0, 3).join(', ')}`,
    interpretation: reversed
      ? `The reversed ${card.name} suggests that ${card.keywords[0]} may be blocked or requiring attention. Look for where energy is stuck or needs to be released.`
      : `${card.name} brings the energy of ${card.keywords[0]} to your ${position.toLowerCase()}. This card invites you to embrace ${card.keywords[1]} and ${card.keywords[2]}.`
  };
}

function generateReading(query: string, spreadType: string) {
  const positions = SPREAD_POSITIONS[spreadType as keyof typeof SPREAD_POSITIONS] || SPREAD_POSITIONS['three-card'];
  const cards = positions.map(pos => drawCard(pos));

  // Generate overall message
  const themes = cards.flatMap(card => card.keywords);
  const dominantTheme = themes[Math.floor(Math.random() * Math.min(3, themes.length))];

  const overallMessage = `Regarding "${query}", the cards reveal a pattern of ${dominantTheme} influencing your situation. ${
    cards.some(c => c.reversed)
      ? 'Pay attention to what needs to be released or transformed.'
      : 'The energy flows favorably for your question.'
  }`;

  const advice = cards.map(card => {
    if (card.reversed) {
      return `Address the ${card.keywords[0]} that may be blocked or imbalanced.`;
    } else {
      return `Embrace the ${card.keywords[0]} energy available to you.`;
    }
  }).join(' ') + ' Trust the wisdom of the cards and your own intuition.';

  return {
    cards,
    spreadName: spreadType === 'single-card' ? 'Daily Card' :
                spreadType === 'three-card' ? 'Three-Card Spread' :
                'Celtic Cross',
    overallMessage,
    advice
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, spreadType = 'three-card' } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const reading = generateReading(query, spreadType);

    return NextResponse.json({
      success: true,
      reading,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Tarot reading error:', error);
    return NextResponse.json(
      { error: 'Failed to generate tarot reading', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/oracle/tarot',
    method: 'POST',
    description: 'Generate tarot card readings',
    requiredFields: ['query'],
    optionalFields: ['spreadType (single-card, three-card, celtic-cross)']
  });
}
