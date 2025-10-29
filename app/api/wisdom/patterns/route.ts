import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ElementalAnalyzer } from '@/lib/agents/modules/ElementalAnalyzer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const analyzer = new ElementalAnalyzer();

// Elemental pattern definitions (Fire, Water, Air, Earth 1-12)
const ELEMENTAL_PATTERNS = {
  fire: [
    { id: 1, name: 'Fire 1 - Spark of Passion', keywords: ['excited', 'inspired', 'new idea', 'passion', 'energy'] },
    { id: 2, name: 'Fire 2 - Building Momentum', keywords: ['building', 'momentum', 'growing', 'expanding'] },
    { id: 3, name: 'Fire 3 - Burning Through', keywords: ['breakthrough', 'destroying', 'burning', 'transformation'] },
    { id: 4, name: 'Fire 4 - Purification', keywords: ['purifying', 'cleansing', 'releasing', 'letting go'] },
    { id: 5, name: 'Fire 5 - Creative Expression', keywords: ['creating', 'expressing', 'manifesting', 'making'] },
    { id: 6, name: 'Fire 6 - Warrior Spirit', keywords: ['courage', 'fighting', 'standing up', 'boundaries'] },
    { id: 7, name: 'Fire 7 - Illumination', keywords: ['clarity', 'seeing', 'light', 'understanding'] },
    { id: 8, name: 'Fire 8 - Controlled Burn', keywords: ['discipline', 'focus', 'control', 'mastery'] },
    { id: 9, name: 'Fire 9 - Phoenix Rising', keywords: ['rebirth', 'resurrection', 'rising', 'renewal'] },
    { id: 10, name: 'Fire 10 - Sacred Flame', keywords: ['devotion', 'sacred', 'holy', 'divine'] },
    { id: 11, name: 'Fire 11 - Leadership', keywords: ['leading', 'guiding', 'inspiring others', 'teaching'] },
    { id: 12, name: 'Fire 12 - Cosmic Fire', keywords: ['universal', 'cosmic', 'infinite', 'eternal'] }
  ],
  water: [
    { id: 1, name: 'Water 1 - First Tears', keywords: ['crying', 'tears', 'sadness', 'grief'] },
    { id: 2, name: 'Water 2 - Emotional Tide', keywords: ['waves', 'emotions', 'feelings', 'flowing'] },
    { id: 3, name: 'Water 3 - Deep Feeling', keywords: ['deep', 'profound', 'touching', 'moving'] },
    { id: 4, name: 'Water 4 - Healing Waters', keywords: ['healing', 'soothing', 'comfort', 'nurture'] },
    { id: 5, name: 'Water 5 - Intuitive Flow', keywords: ['intuition', 'sensing', 'knowing', 'feeling into'] },
    { id: 6, name: 'Water 6 - Empathic Resonance', keywords: ['empathy', 'feeling with', 'connection', 'resonance'] },
    { id: 7, name: 'Water 7 - Dream Realm', keywords: ['dreams', 'unconscious', 'symbolic', 'mystical'] },
    { id: 8, name: 'Water 8 - Emotional Depth', keywords: ['depth', 'profound feeling', 'soul', 'essence'] },
    { id: 9, name: 'Water 9 - Dissolution', keywords: ['dissolving', 'merging', 'releasing form', 'surrender'] },
    { id: 10, name: 'Water 10 - Compassion', keywords: ['compassion', 'love', 'caring', 'tenderness'] },
    { id: 11, name: 'Water 11 - Psychic Awareness', keywords: ['psychic', 'clairvoyant', 'seeing', 'perceiving'] },
    { id: 12, name: 'Water 12 - Mystical Perception', keywords: ['mystical', 'unity', 'oneness', 'cosmic love'] }
  ],
  air: [
    { id: 1, name: 'Air 1 - First Breath', keywords: ['breathing', 'breath', 'air', 'fresh start'] },
    { id: 2, name: 'Air 2 - Mental Clarity', keywords: ['clear', 'clarity', 'understanding', 'insight'] },
    { id: 3, name: 'Air 3 - Teaching Transmission', keywords: ['teaching', 'sharing', 'communicating', 'explaining'] },
    { id: 4, name: 'Air 4 - Logical Mind', keywords: ['logic', 'rational', 'thinking', 'analyzing'] },
    { id: 5, name: 'Air 5 - Innovative Vision', keywords: ['innovation', 'new ideas', 'creativity', 'vision'] },
    { id: 6, name: 'Air 6 - Communication', keywords: ['speaking', 'writing', 'expressing', 'voice'] },
    { id: 7, name: 'Air 7 - Perspective Shift', keywords: ['perspective', 'seeing differently', 'reframe', 'view'] },
    { id: 8, name: 'Air 8 - Sacred Geometry', keywords: ['pattern', 'structure', 'geometry', 'order'] },
    { id: 9, name: 'Air 9 - Detachment', keywords: ['detached', 'objective', 'witnessing', 'observing'] },
    { id: 10, name: 'Air 10 - Higher Mind', keywords: ['higher mind', 'transcendent', 'elevated', 'beyond'] },
    { id: 11, name: 'Air 11 - Collective Intelligence', keywords: ['collective', 'shared mind', 'group wisdom', 'we'] },
    { id: 12, name: 'Air 12 - Universal Consciousness', keywords: ['universal', 'consciousness', 'awareness', 'infinite mind'] }
  ],
  earth: [
    { id: 1, name: 'Earth 1 - Grounding', keywords: ['grounded', 'stable', 'rooted', 'solid'] },
    { id: 2, name: 'Earth 2 - Building Foundation', keywords: ['foundation', 'building', 'creating', 'structure'] },
    { id: 3, name: 'Earth 3 - Material Form', keywords: ['material', 'physical', 'tangible', 'real'] },
    { id: 4, name: 'Earth 4 - Patience', keywords: ['patience', 'waiting', 'slow', 'gradual'] },
    { id: 5, name: 'Earth 5 - Manifestation', keywords: ['manifesting', 'creating', 'bringing into form', 'making real'] },
    { id: 6, name: 'Earth 6 - Nurturing', keywords: ['nurturing', 'caring', 'tending', 'growing'] },
    { id: 7, name: 'Earth 7 - Abundance', keywords: ['abundance', 'plenty', 'wealth', 'prosperity'] },
    { id: 8, name: 'Earth 8 - Sacred Body', keywords: ['body', 'embodied', 'physical', 'somatic'] },
    { id: 9, name: 'Earth 9 - Death/Compost', keywords: ['death', 'decay', 'composting', 'transformation'] },
    { id: 10, name: 'Earth 10 - Ancient Wisdom', keywords: ['ancient', 'old', 'traditional', 'ancestors'] },
    { id: 11, name: 'Earth 11 - Sacred Service', keywords: ['service', 'giving', 'offering', 'devotion'] },
    { id: 12, name: 'Earth 12 - Gaia Consciousness', keywords: ['earth', 'gaia', 'planet', 'ecological'] }
  ]
};

/**
 * POST /api/wisdom/patterns
 * Analyze a message for elemental patterns
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, message, conversationHistory = [] } = await req.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'userId and message are required' },
        { status: 400 }
      );
    }

    // Analyze message with ElementalAnalyzer
    const elementalPatterns = analyzer.getElementalPatterns(message);
    const somaticState = analyzer.senseSomaticState(message);

    // Detect specific elemental patterns (Fire 5, Water 12, etc.)
    const detectedPatterns = detectSpecificPatterns(message, elementalPatterns);

    // Calculate conversation depth for this message
    const conversationDepth = calculateConversationDepth(message, conversationHistory);

    // Store patterns in Supabase
    const { error: saveError } = await supabase
      .from('maya_wisdom_patterns')
      .insert({
        user_id: userId,
        pattern_type: detectedPatterns.length > 0 ? detectedPatterns[0].element : 'mixed',
        pattern_name: detectedPatterns.length > 0 ? detectedPatterns[0].name : 'General Wisdom',
        strength: detectedPatterns.length > 0 ? detectedPatterns[0].strength : 0.5,
        keywords: detectedPatterns.length > 0 ? detectedPatterns[0].keywords : [],
        context: {
          message: message.substring(0, 500),
          somaticState,
          elementalPatterns: elementalPatterns.somatic,
          conversationDepth
        },
        detected_at: new Date().toISOString()
      });

    if (saveError) {
      console.error('Error saving pattern:', saveError);
    }

    return NextResponse.json({
      success: true,
      patterns: detectedPatterns,
      elementalBalance: elementalPatterns.somatic,
      somaticState,
      medicine: elementalPatterns.medicine,
      conversationDepth
    });

  } catch (error: any) {
    console.error('Pattern analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze patterns', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/wisdom/patterns?userId=xxx
 * Get detected patterns for a user
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get recent patterns from Supabase
    const { data: patterns, error } = await supabase
      .from('maya_wisdom_patterns')
      .select('*')
      .eq('user_id', userId)
      .order('detected_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Group patterns by element and calculate active threads
    const activeThreads = calculateActiveThreads(patterns || []);

    return NextResponse.json({
      success: true,
      patterns: patterns || [],
      activeThreads,
      totalPatterns: patterns?.length || 0
    });

  } catch (error: any) {
    console.error('Get patterns error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve patterns', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Detect specific numbered patterns (Fire 5, Water 12, etc.)
 */
function detectSpecificPatterns(
  message: string,
  elementalPatterns: { somatic: Record<string, number>; energetic: string; medicine: string }
): Array<{
  element: string;
  name: string;
  strength: number;
  keywords: string[];
  description: string;
}> {
  const detected: Array<{
    element: string;
    name: string;
    strength: number;
    keywords: string[];
    description: string;
  }> = [];

  const lowerMessage = message.toLowerCase();

  // Check each element's patterns
  for (const [element, patterns] of Object.entries(ELEMENTAL_PATTERNS)) {
    const elementStrength = elementalPatterns.somatic[element] || 0;

    if (elementStrength > 0) {
      for (const pattern of patterns) {
        let matchCount = 0;
        const matchedKeywords: string[] = [];

        for (const keyword of pattern.keywords) {
          if (lowerMessage.includes(keyword.toLowerCase())) {
            matchCount++;
            matchedKeywords.push(keyword);
          }
        }

        if (matchCount > 0) {
          const strength = Math.min((matchCount / pattern.keywords.length) * elementStrength / 10, 1);

          detected.push({
            element,
            name: pattern.name,
            strength,
            keywords: matchedKeywords,
            description: `${pattern.name} detected through: ${matchedKeywords.join(', ')}`
          });
        }
      }
    }
  }

  // Sort by strength and return top patterns
  return detected.sort((a, b) => b.strength - a.strength).slice(0, 5);
}

/**
 * Calculate conversation depth (how deep/meaningful the conversation is)
 */
function calculateConversationDepth(message: string, history: string[]): number {
  const lowerMessage = message.toLowerCase();

  // Depth indicators
  const surfaceWords = ['hi', 'hello', 'hey', 'thanks', 'okay', 'yes', 'no'];
  const deepWords = ['feel', 'sense', 'soul', 'transformation', 'shadow', 'sacred', 'meaning', 'purpose'];
  const profoundWords = ['unity', 'consciousness', 'awakening', 'transcendence', 'divine', 'mystical'];

  let depth = 0;

  // Surface level (0-0.3)
  if (surfaceWords.some(word => lowerMessage.includes(word)) && message.length < 50) {
    depth = 0.2;
  }

  // Medium depth (0.3-0.6)
  else if (deepWords.some(word => lowerMessage.includes(word))) {
    depth = 0.5;
  }

  // Profound depth (0.6-1.0)
  else if (profoundWords.some(word => lowerMessage.includes(word))) {
    depth = 0.8;
  }

  // Message length factor
  if (message.length > 100) depth += 0.1;
  if (message.length > 300) depth += 0.1;

  // Conversation history factor
  if (history.length > 5) depth += 0.1;
  if (history.length > 15) depth += 0.1;

  return Math.min(depth, 1.0);
}

/**
 * Calculate active conversation threads from recent patterns
 */
function calculateActiveThreads(patterns: any[]): Array<{
  id: string;
  element: string;
  pattern: string;
  strength: number;
  lastSeen: Date;
  description: string;
}> {
  // Group patterns by name
  const grouped = new Map<string, any[]>();

  for (const pattern of patterns) {
    const key = pattern.pattern_name;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(pattern);
  }

  // Calculate thread strength and recency
  const threads: Array<{
    id: string;
    element: string;
    pattern: string;
    strength: number;
    lastSeen: Date;
    description: string;
  }> = [];

  for (const [name, patternGroup] of grouped.entries()) {
    const avgStrength = patternGroup.reduce((sum, p) => sum + (p.strength || 0), 0) / patternGroup.length;
    const mostRecent = patternGroup[0]; // Already sorted by detected_at DESC

    // Only include if seen recently (within 30 min) and has decent strength
    const lastSeenTime = new Date(mostRecent.detected_at);
    const minutesAgo = (Date.now() - lastSeenTime.getTime()) / 1000 / 60;

    if (minutesAgo < 30 && avgStrength > 0.3) {
      threads.push({
        id: mostRecent.id,
        element: mostRecent.pattern_type,
        pattern: name,
        strength: avgStrength,
        lastSeen: lastSeenTime,
        description: mostRecent.context?.message?.substring(0, 100) || ''
      });
    }
  }

  // Sort by strength and return top 5
  return threads.sort((a, b) => b.strength - a.strength).slice(0, 5);
}
