// Oracle Holoflower API Route - Dual-Mode Divination & Reflection System
// Orchestrates 3-prompt series: User Check-In + Oracle Reading + Merge

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

// ============================================
// Type Definitions
// ============================================

interface PetalIntensity {
  [petalId: string]: number; // 0-1 intensity values
}

interface PetalInfo {
  petal: string;
  essence: string;
  keywords: string[];
  feeling?: string;
  ritual?: string;
  shadow?: string;
  blessing?: string;
}

interface UserCheckin {
  userCheckin: PetalInfo[];
}

interface OracleReading {
  oracleReading: {
    elementalBalance: {
      fire: number;
      water: number;
      earth: number;
      air: number;
      aether: number;
    };
    spiralStage: {
      element: 'fire' | 'water' | 'earth' | 'air' | 'aether';
      stage: 1 | 2 | 3;
    };
    reflection: string;
    practice: string;
    archetype: string;
    narrativeInterpretation?: string; // Cohesive prose interpretation
  };
}

interface MergedInsight {
  mergedInsight: {
    alignment: string;
    tension: string;
    synthesis: string;
  };
}

interface SessionPayload {
  sessionId: string;
  timestamp: string;
  userCheckin?: PetalInfo[];
  oracleReading?: OracleReading['oracleReading'];
  mergedInsight?: MergedInsight['mergedInsight'];
}

// ============================================
// Petal Chart Mapping
// ============================================

// Complete Spiralogic Framework - 12 Facets across 4 Elements
// Each element has 3 phases: Cardinal (Vector/Intelligence), Fixed (Circle/Intention), Mutable (Spiral/Goal)
const PETAL_CHART: Record<string, PetalInfo> = {
  // FIRE - Spiritual, Intuitive Intelligence
  // Vision → Expression → Expansion
  Fire1: {
    petal: 'Fire1',
    essence: 'Self-Awareness', // Vision (Cardinal/Vector)
    keywords: ['Vision', 'Intuition', 'I SEE', 'I Experience', 'Spiritual awakening'],
    shadow: 'Blind spots, spiritual bypassing',
    blessing: 'Clear inner vision'
  },
  Fire2: {
    petal: 'Fire2',
    essence: 'Self-In-World', // Expression (Fixed/Circle)
    keywords: ['Expression', 'Creation', 'I CREATE', 'I Express', 'Creative power'],
    shadow: 'Blocked expression, creative stagnation',
    blessing: 'Authentic creative flow'
  },
  Fire3: {
    petal: 'Fire3',
    essence: 'Transcendent Self', // Expansion (Mutable/Spiral)
    keywords: ['Expansion', 'Integration', 'I EXPAND', 'Spiritual growth', 'Transcendence'],
    shadow: 'Spiritual inflation, disconnection',
    blessing: 'Sacred expansion'
  },

  // WATER - Emotional, Psychic Intelligence
  // Heart → Healing → Holiness
  Water1: {
    petal: 'Water1',
    essence: 'Emotional Intelligence', // Heart (Cardinal/Vector)
    keywords: ['Heart', 'Feeling', 'I FEEL', 'My Heart', 'Emotional opening'],
    shadow: 'Emotional numbness, overwhelm',
    blessing: 'Open-hearted presence'
  },
  Water2: {
    petal: 'Water2',
    essence: 'Inner Transformation', // Healing (Fixed/Circle)
    keywords: ['Healing', 'Transformation', 'I HEAL', 'My Healing', 'Emotional alchemy'],
    shadow: 'Unhealed wounds, stuck patterns',
    blessing: 'Deep healing grace'
  },
  Water3: {
    petal: 'Water3',
    essence: 'Deep Self-Awareness', // Holiness (Mutable/Spiral)
    keywords: ['Holiness', 'Surrender', 'I SURRENDER', 'My Holiness', 'Sacred depth'],
    shadow: 'Spiritual materialism, false holiness',
    blessing: 'True sacred connection'
  },

  // EARTH - Somatic, Embodied Intelligence
  // Mission → Means → Medicine
  Earth1: {
    petal: 'Earth1',
    essence: 'Purpose & Service', // Mission (Cardinal/Vector)
    keywords: ['Mission', 'Purpose', 'I SERVE', 'The Mission', 'Sacred calling'],
    shadow: 'Lost purpose, martyrdom',
    blessing: 'Clear life mission'
  },
  Earth2: {
    petal: 'Earth2',
    essence: 'Resources & Plans', // Means (Fixed/Circle)
    keywords: ['Means', 'Resources', 'I BUILD', 'The Means', 'Material manifestation'],
    shadow: 'Lack, scarcity, stagnation',
    blessing: 'Abundant resources'
  },
  Earth3: {
    petal: 'Earth3',
    essence: 'Refined Offering', // Medicine (Mutable/Spiral)
    keywords: ['Medicine', 'Embodiment', 'I EMBODY', 'The Medicine', 'Gift to world'],
    shadow: 'Unrefined gifts, holding back',
    blessing: 'Medicine fully embodied'
  },

  // AIR - Mental, Relational, Communicative Intelligence
  // Connection → Community → Consciousness
  Air1: {
    petal: 'Air1',
    essence: 'Interpersonal Relating', // Connection (Cardinal/Vector)
    keywords: ['Connection', 'Relating', 'I RELATE', 'This Connection', 'One-to-one bonding'],
    shadow: 'Isolation, co-dependence',
    blessing: 'Authentic connection'
  },
  Air2: {
    petal: 'Air2',
    essence: 'Collective Dynamics', // Community (Fixed/Circle)
    keywords: ['Community', 'Collective', 'I GATHER', 'This Community', 'Group synergy'],
    shadow: 'Group-think, exclusion',
    blessing: 'Sacred community'
  },
  Air3: {
    petal: 'Air3',
    essence: 'Elevated Communication', // Consciousness (Mutable/Spiral)
    keywords: ['Consciousness', 'Clarity', 'I KNOW', 'This Consciousness', 'Higher knowing'],
    shadow: 'Mental fog, confusion',
    blessing: 'Crystal clarity'
  },

  // Aether Center States (not petals, but center pulses)
  Aether1: {
    petal: 'Aether1',
    essence: 'Expansive Nature',
    keywords: ['Transcendence', 'Mystery', 'Exploration', 'Expression'],
    shadow: 'Lost in expansion',
    blessing: 'Sacred mystery unfolding'
  },
  Aether2: {
    petal: 'Aether2',
    essence: 'Contractive Nature',
    keywords: ['Witnessing', 'Evolution', 'Transformation', 'Depth'],
    shadow: 'Collapsed into density',
    blessing: 'Wisdom through witnessing'
  },
  Aether3: {
    petal: 'Aether3',
    essence: 'Stillness',
    keywords: ['Stillness', 'Silence', 'Sacred', 'Infinite'],
    shadow: 'Empty void',
    blessing: 'Sacred wholeness'
  }
};

// ============================================
// Transcendent Detection
// ============================================

function detectTranscendentQualities(text: string): boolean {
  const transcendentMarkers = [
    'meditation', 'stillness', 'silence', 'witness', 'awareness',
    'consciousness', 'presence', 'being', 'non-dual', 'unity',
    'oneness', 'void', 'emptiness', 'fullness', 'infinite',
    'eternal', 'timeless', 'spacious', 'boundless', 'transcend',
    'mystery', 'sacred', 'divine', 'source', 'essence',
    'awakening', 'enlightenment', 'liberation', 'surrender',
    'dissolve', 'merge', 'expand', 'contract', 'breathe',
    'luminous', 'radiant', 'formless', 'beyond', 'absolute'
  ];
  
  const lowerText = text.toLowerCase();
  const transcendentCount = transcendentMarkers.filter(marker => 
    lowerText.includes(marker)
  ).length;
  
  // Need at least 2 markers to consider transcendent
  return transcendentCount >= 2;
}

// ============================================
// Supabase Client
// ============================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// ============================================
// Claude Prompt Functions
// ============================================

async function processUserCheckin(petalIntensities: PetalIntensity): Promise<UserCheckin> {
  const activePetals = Object.entries(petalIntensities)
    .filter(([_, intensity]) => intensity > 0.3)
    .map(([petalId, intensity]) => {
      const petalInfo = PETAL_CHART[petalId];
      if (!petalInfo) return null;
      
      return {
        ...petalInfo,
        feeling: generatePetalFeeling(petalId, intensity),
        ritual: generatePetalRitual(petalId, intensity)
      };
    })
    .filter(Boolean) as PetalInfo[];

  return { userCheckin: activePetals };
}

async function processOracleReading(text: string): Promise<OracleReading> {
  // Check for transcendent qualities first
  const hasTranscendent = detectTranscendentQualities(text);
  
  const prompt = `You are the Spiralogic Oracle agent.

Input: ${text}

Process in five layers:
1. Ontological reasoning (Fire, Water, Earth, Air, Aether)
   ${hasTranscendent ? '- Pay special attention to Aether/transcendent qualities' : ''}
2. Temporal expansion (past, present, future)
3. Implicit detection (explicit, implied, emergent, shadow, resonant)
4. Spiralogic mapping (Recognition → Integration)
5. Output shaping (reflection, micro-practice, archetypal image)

Special Aether Detection:
- If the input contains transcendent, non-dual, mystical, or liminal qualities
- Consider Aether stages:
  * Aether1: Expansive expression, mystery, exploration
  * Aether2: Witnessing, contraction into wisdom
  * Aether3: Stillness, sacred in the ordinary
- Only map to Aether when truly transcendent (rare)

Then extract:
- Elemental balance (0–1 for each element)
- Spiral stage (element + stage, can include "aether" if transcendent)
- Reflection question
- Micro-practice
- Archetypal image

Respond ONLY in JSON:
{
  "oracleReading": {
    "elementalBalance": { "fire":0.xx, "water":0.xx, "earth":0.xx, "air":0.xx, "aether":0.xx },
    "spiralStage": { "element":"fire"|"water"|"earth"|"air"|"aether", "stage":1|2|3 },
    "reflection":"...",
    "practice":"...",
    "archetype":"...",
    "narrativeInterpretation":"2-3 flowing paragraphs that synthesize the reading as a cohesive story - weaving together what elements are strong, what's emerging, what the archetypes reveal, and what this means for the person's journey. Write in second person ('you'), warm and insightful."
  }
}`;

  try {
    const response = await callClaude(prompt);
    return JSON.parse(response) as OracleReading;
  } catch (error) {
    console.error('Oracle reading error:', error);
    // Return default structure
    return {
      oracleReading: {
        elementalBalance: { fire: 0.25, water: 0.25, earth: 0.25, air: 0.25, aether: 0 },
        spiralStage: { element: 'fire', stage: 1 },
        reflection: 'What seeks to emerge through you today?',
        practice: 'Take three conscious breaths and notice what arises.',
        archetype: 'The Seeker'
      }
    };
  }
}

async function processMerge(
  userCheckin: PetalInfo[], 
  oracleReading: OracleReading['oracleReading']
): Promise<MergedInsight> {
  // Handle Aether specially - it's center, not petal
  const isAether = oracleReading.spiralStage.element === 'aether';
  
  // Map oracle reading to petals (or Aether center)
  const oraclePetal = isAether 
    ? `Aether${oracleReading.spiralStage.stage}`
    : `${oracleReading.spiralStage.element.charAt(0).toUpperCase()}${oracleReading.spiralStage.element.slice(1)}${oracleReading.spiralStage.stage}`;
  
  // Find alignments
  const userPetals = userCheckin.map(p => p.petal);
  const aligned = isAether 
    ? userPetals.some(p => p.startsWith('Aether'))
    : userPetals.includes(oraclePetal);
  
  // Analyze elemental alignment
  const userElements = extractElementsFromPetals(userPetals);
  const oracleElement = oracleReading.spiralStage.element;
  
  const alignment = aligned 
    ? `Your intuition and the oracle both point to ${oraclePetal} - ${PETAL_CHART[oraclePetal]?.essence || 'transformation'}.`
    : `Your intuition explores ${userPetals.join(', ')} while the oracle suggests ${oraclePetal}.`;
    
  const tension = userElements.includes(oracleElement)
    ? 'Minimal tension - you\'re already attuned to this elemental frequency.'
    : `Creative tension between your ${userElements[0]} focus and the oracle\'s ${oracleElement} guidance.`;
    
  const synthesis = generateSynthesis(userCheckin, oracleReading);

  return {
    mergedInsight: {
      alignment,
      tension,
      synthesis
    }
  };
}

// ============================================
// Helper Functions
// ============================================

function generatePetalFeeling(petalId: string, intensity: number): string {
  const feelings: Record<string, string[]> = {
    // Fire - Spiritual, Intuitive Intelligence
    Fire1: ['inner vision awakening', 'seeing with soul eyes', 'spiritual clarity emerging'],
    Fire2: ['creative expression flowing', 'authentic self emerging', 'bringing vision into form'],
    Fire3: ['consciousness expanding', 'spiritual integration', 'transcendent awareness'],

    // Water - Emotional, Psychic Intelligence
    Water1: ['heart opening gently', 'feeling deeply', 'emotional truth rising'],
    Water2: ['healing waters flowing', 'patterns transforming', 'emotional alchemy happening'],
    Water3: ['surrendering to holiness', 'sacred depth touching', 'divine presence felt'],

    // Earth - Somatic, Embodied Intelligence
    Earth1: ['life purpose calling', 'mission becoming clear', 'sacred service emerging'],
    Earth2: ['resources gathering', 'foundation building', 'manifestation happening'],
    Earth3: ['medicine fully embodied', 'gift refined and ready', 'offering complete'],

    // Air - Mental, Relational, Communicative Intelligence
    Air1: ['authentic connection forming', 'relating soul-to-soul', 'true meeting happening'],
    Air2: ['community gathering', 'collective synergy building', 'sacred circle forming'],
    Air3: ['consciousness clarifying', 'higher knowing emerging', 'truth crystallizing'],

    Aether: ['void and fullness', 'mystery present', 'all and nothing']
  };

  const petalFeelings = feelings[petalId] || ['energy moving', 'presence felt', 'essence touched'];
  const index = Math.floor(intensity * (petalFeelings.length - 1));
  return petalFeelings[index];
}

function generatePetalRitual(petalId: string, intensity: number): string {
  const rituals: Record<string, string> = {
    // Fire - Spiritual, Intuitive Intelligence
    Fire1: 'Close your eyes and ask: "What does my soul see?" Trust the first image that comes.',
    Fire2: 'Create something with your hands that expresses your inner truth.',
    Fire3: 'Stand with arms wide and feel yourself expanding beyond your edges.',

    // Water - Emotional, Psychic Intelligence
    Water1: 'Place your hand on your heart and ask: "What do I truly feel right now?"',
    Water2: 'Write a letter to a wound that\'s ready to heal. Burn it or bury it with gratitude.',
    Water3: 'Sit in silence and surrender one thing you\'ve been trying to control.',

    // Earth - Somatic, Embodied Intelligence
    Earth1: 'Complete this sentence: "I am here to serve by..."',
    Earth2: 'List 3 resources you already have that support your mission.',
    Earth3: 'Embody your medicine: move, speak, or create as if your gift is fully expressed.',

    // Air - Mental, Relational, Communicative Intelligence
    Air1: 'Reach out to someone for authentic connection. Be vulnerable.',
    Air2: 'Gather with others (even digitally) and share what\'s alive in you.',
    Air3: 'Speak one truth you\'ve been holding back. Say it aloud to yourself first.',

    Aether: 'Sit in silence for 13 breaths. Notice what\'s beyond thought.'
  };

  return rituals[petalId] || 'Follow your intuition for a simple ritual';
}

function extractElementsFromPetals(petals: string[]): string[] {
  const elements = new Set<string>();
  petals.forEach(petal => {
    const element = petal.replace(/[0-9]/g, '').toLowerCase();
    if (['fire', 'water', 'earth', 'air'].includes(element)) {
      elements.add(element);
    }
  });
  return Array.from(elements);
}

function generateSynthesis(
  userCheckin: PetalInfo[], 
  oracleReading: OracleReading['oracleReading']
): string {
  const userEssences = userCheckin.map(p => p.essence).join(' + ');
  const oracleArchetype = oracleReading.archetype;
  
  return `Today you embody ${userEssences} while ${oracleArchetype} guides your journey. ${oracleReading.practice}`;
}

async function callClaude(prompt: string): Promise<string> {
  // This would call your actual Claude API
  // For now, returning a mock response structure
  const mockResponse = {
    oracleReading: {
      elementalBalance: { 
        fire: Math.random() * 0.5 + 0.2,
        water: Math.random() * 0.5 + 0.2,
        earth: Math.random() * 0.5 + 0.2,
        air: Math.random() * 0.5 + 0.2,
        aether: Math.random() * 0.3
      },
      spiralStage: { 
        element: ['fire', 'water', 'earth', 'air'][Math.floor(Math.random() * 4)] as any,
        stage: (Math.floor(Math.random() * 3) + 1) as any
      },
      reflection: 'What pattern seeks recognition in your experience today?',
      practice: 'Spend 5 minutes observing without judgment.',
      archetype: ['The Seeker', 'The Guardian', 'The Creator', 'The Sage'][Math.floor(Math.random() * 4)]
    }
  };
  
  return JSON.stringify(mockResponse);
}

// ============================================
// Main Route Handlers
// ============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mode,           // 'checkin' | 'reading' | 'full'
      petalIntensities,  // For check-in mode
      journalText,       // For reading mode
      userId,
      sessionId = uuidv4()
    } = body;

    const timestamp = new Date().toISOString();
    let payload: SessionPayload = {
      sessionId,
      timestamp
    };

    // Process based on mode
    if (mode === 'checkin' && petalIntensities) {
      // User intuitive check-in only
      const checkinResult = await processUserCheckin(petalIntensities);
      payload.userCheckin = checkinResult.userCheckin;
    } 
    else if (mode === 'reading' && journalText) {
      // Oracle reading only
      const readingResult = await processOracleReading(journalText);
      payload.oracleReading = readingResult.oracleReading;
    }
    else if (mode === 'full' && petalIntensities && journalText) {
      // Full 3-step process
      const checkinResult = await processUserCheckin(petalIntensities);
      const readingResult = await processOracleReading(journalText);
      const mergeResult = await processMerge(
        checkinResult.userCheckin,
        readingResult.oracleReading
      );
      
      payload.userCheckin = checkinResult.userCheckin;
      payload.oracleReading = readingResult.oracleReading;
      payload.mergedInsight = mergeResult.mergedInsight;
    }
    else {
      return NextResponse.json(
        { error: 'Invalid mode or missing required data' },
        { status: 400 }
      );
    }

    // Persist to database if authenticated
    if (userId) {
      await persistHoloflowerSession(userId, payload);
    }

    return NextResponse.json(payload);
    
  } catch (error) {
    console.error('Holoflower oracle error:', error);
    return NextResponse.json(
      { error: 'Failed to process holoflower oracle' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    );
  }

  try {
    const { data: sessions, error } = await supabase
      .from('holoflower_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Analyze patterns across sessions
    const patterns = analyzeHoloflowerPatterns(sessions || []);

    return NextResponse.json({
      sessions: sessions || [],
      patterns
    });
    
  } catch (error) {
    console.error('Failed to fetch holoflower sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

// ============================================
// Database Functions
// ============================================

async function persistHoloflowerSession(userId: string, payload: SessionPayload) {
  try {
    const { error } = await supabase
      .from('holoflower_sessions')
      .insert({
        user_id: userId,
        session_id: payload.sessionId,
        timestamp: payload.timestamp,
        user_checkin: payload.userCheckin || null,
        oracle_reading: payload.oracleReading || null,
        merged_insight: payload.mergedInsight || null,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Failed to persist holoflower session:', error);
    }
  } catch (error) {
    console.error('Database error:', error);
  }
}

function analyzeHoloflowerPatterns(sessions: any[]): {
  dominantPetals: string[];
  elementalJourney: string;
  evolutionPhase: string;
  nextGuidance: string;
} {
  if (!sessions || sessions.length === 0) {
    return {
      dominantPetals: [],
      elementalJourney: 'Beginning',
      evolutionPhase: 'Seed',
      nextGuidance: 'Begin with a single petal that calls to you.'
    };
  }

  // Count petal frequencies
  const petalCounts: Record<string, number> = {};
  
  sessions.forEach(session => {
    if (session.user_checkin) {
      session.user_checkin.forEach((petal: PetalInfo) => {
        petalCounts[petal.petal] = (petalCounts[petal.petal] || 0) + 1;
      });
    }
  });

  // Get top 3 petals
  const dominantPetals = Object.entries(petalCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([petal]) => petal);

  // Determine elemental journey
  const elements = extractElementsFromPetals(dominantPetals);
  const elementalJourney = elements.length > 2 
    ? 'Weaving all elements'
    : elements.join(' → ');

  // Evolution phase based on stage distribution
  const stages = dominantPetals.map(p => parseInt(p.slice(-1)) || 0);
  const avgStage = stages.reduce((a, b) => a + b, 0) / stages.length;
  
  const evolutionPhase = avgStage < 1.5 ? 'Recognition' 
    : avgStage < 2.5 ? 'Exploration'
    : 'Integration';

  // Generate guidance
  const nextGuidance = generateGuidance(dominantPetals, evolutionPhase);

  return {
    dominantPetals,
    elementalJourney,
    evolutionPhase,
    nextGuidance
  };
}

function generateGuidance(petals: string[], phase: string): string {
  const guidanceMap: Record<string, string> = {
    Recognition: 'Notice where these energies appear in your daily life.',
    Exploration: 'Experiment with combining these forces in new ways.',
    Integration: 'You are ready to embody these gifts fully.'
  };
  
  return guidanceMap[phase] || 'Trust your intuition as you continue exploring.';
}