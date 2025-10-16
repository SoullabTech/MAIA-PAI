/**
 * Generate Test Field Records for Research Pipeline
 *
 * Creates realistic Field Records to test our dissertation's
 * pattern detection and insight generation capabilities
 */

import type { FieldRecord } from '@/lib/field-protocol/types';

// Archetypal user personas for diverse data
const userPersonas = [
  { id: 'user_seeker_001', archetype: 'The Seeker', primaryElement: 'air' },
  { id: 'user_mystic_002', archetype: 'The Mystic', primaryElement: 'ether' },
  { id: 'user_creator_003', archetype: 'The Creator', primaryElement: 'fire' },
  { id: 'user_healer_004', archetype: 'The Healer', primaryElement: 'water' },
  { id: 'user_builder_005', archetype: 'The Builder', primaryElement: 'earth' },
  { id: 'user_transformer_006', archetype: 'The Transformer', primaryElement: 'fire' },
  { id: 'user_dreamer_007', archetype: 'The Dreamer', primaryElement: 'water' },
  { id: 'user_sage_008', archetype: 'The Sage', primaryElement: 'air' }
];

// Symbolic themes that might emerge across users
const universalSymbols = [
  'golden thread', 'spiral', 'mirror', 'bridge', 'seed',
  'phoenix', 'labyrinth', 'tree of life', 'ouroboros', 'mandala',
  'lighthouse', 'chrysalis', 'prism', 'web', 'portal'
];

// Emotional/somatic experiences
const somaticExperiences = {
  fire: ['warmth spreading', 'energy rising', 'tingling activation', 'creative surge'],
  water: ['flowing sensation', 'emotional waves', 'deep stillness', 'cleansing release'],
  air: ['lightness', 'expansion', 'clarity', 'mental breeze'],
  earth: ['grounding', 'rootedness', 'density', 'solid presence'],
  ether: ['dissolution', 'spaciousness', 'timelessness', 'unity']
};

// Phase-specific experiences
const phaseExperiences = {
  creation: ['new vision emerging', 'seeds planted', 'inspiration downloading'],
  preservation: ['maintaining balance', 'nurturing growth', 'sustaining practice'],
  dissolution: ['releasing old patterns', 'letting go', 'surrendering control'],
  void: ['embracing emptiness', 'sitting with uncertainty', 'pregnant pause'],
  emergence: ['breakthrough moment', 'new self birthing', 'integration complete']
};

/**
 * Generate a batch of test Field Records
 */
export function generateTestFieldRecords(count: number = 50): Partial<FieldRecord>[] {
  const records: Partial<FieldRecord>[] = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 30); // Start 30 days ago

  for (let i = 0; i < count; i++) {
    const user = userPersonas[i % userPersonas.length];
    const recordDate = new Date(baseDate);
    recordDate.setDate(recordDate.getDate() + Math.floor(i / 2)); // Spread over time

    // Determine completion stage (some incomplete, most complete)
    const completionStage = Math.random() > 0.3
      ? 5 // 70% fully complete
      : Math.floor(Math.random() * 4) + 1; // 30% partial

    // Generate elemental composition
    const primaryElement = Math.random() > 0.7
      ? user.primaryElement // 70% stays with primary
      : ['fire', 'water', 'air', 'earth', 'ether'][Math.floor(Math.random() * 5)];

    // Select symbols (some universal, some unique)
    const symbols = [];
    if (Math.random() > 0.4) {
      // 60% chance of universal symbol (for pattern detection)
      symbols.push(universalSymbols[Math.floor(Math.random() * universalSymbols.length)]);
    }
    if (Math.random() > 0.5) {
      symbols.push(`unique_symbol_${i}`);
    }

    // Create phase based on patterns (for hypothesis testing)
    const phases = ['creation', 'preservation', 'dissolution', 'void', 'emergence'];
    const currentPhase = phases[Math.floor((i / 10) % 5)]; // Cyclical pattern

    // Generate record
    const record: Partial<FieldRecord> = {
      id: `test_record_${i.toString().padStart(3, '0')}`,
      userId: user.id,
      createdAt: recordDate,
      updatedAt: recordDate,
      completionStage: completionStage as 1 | 2 | 3 | 4 | 5,
      privacyLevel: Math.random() > 0.3 ? 'commons' : 'private',
      tags: [`test`, user.archetype.toLowerCase(), primaryElement],

      // Stage 1: Observation
      observation: {
        timestamp: recordDate,
        duration: Math.floor(Math.random() * 60) + 10,
        phenomena: `${user.archetype} experiencing ${phaseExperiences[currentPhase][0]}`,
        sensoryData: {
          visual: `Colors shifting, geometries emerging`,
          auditory: `Inner harmonics, ${Math.random() > 0.5 ? 'silence' : 'resonance'}`,
          somatic: somaticExperiences[primaryElement][Math.floor(Math.random() * 4)],
          emotional: Math.random() > 0.5 ? 'expansive' : 'contractive',
          energetic: `${primaryElement} energy ${Math.random() > 0.5 ? 'building' : 'releasing'}`
        },
        triggerEvent: i % 7 === 0 ? 'synchronicity' : 'meditation'
      },

      // Stage 2: Interpretation (if completion >= 2)
      interpretation: completionStage >= 2 ? {
        primaryElement: primaryElement as any,
        secondaryElements: Math.random() > 0.5
          ? [phases[(i + 1) % 5] as any]
          : [],
        elementalBalance: {
          fire: primaryElement === 'fire' ? 0.7 : 0.1,
          water: primaryElement === 'water' ? 0.7 : 0.1,
          air: primaryElement === 'air' ? 0.7 : 0.1,
          earth: primaryElement === 'earth' ? 0.7 : 0.1,
          ether: primaryElement === 'ether' ? 0.7 : 0.1
        },
        currentPhase: currentPhase as any,
        phaseIntensity: 0.5 + Math.random() * 0.5,
        symbols: symbols,
        significance: `This experience reveals ${currentPhase} patterns in my journey`,
        questionsArising: [
          `What is the deeper meaning of ${symbols[0] || 'this pattern'}?`,
          `How does ${primaryElement} relate to my current life phase?`
        ]
      } : undefined,

      // Stage 3: Integration (if completion >= 3)
      integration: completionStage >= 3 ? {
        bodyResponse: `Feeling ${somaticExperiences[primaryElement][0]} throughout body`,
        energyShifts: `Energy moving from ${Math.random() > 0.5 ? 'head to heart' : 'periphery to center'}`,
        actionsTaken: [
          `Journaled insights`,
          `Adjusted daily practice`,
          `Shared with ${Math.random() > 0.5 ? 'partner' : 'community'}`
        ]
      } : undefined,

      // Stage 4: Reflection (if completion >= 4)
      reflection: completionStage >= 4 ? {
        recurringPatterns: symbols.length > 0 ? [symbols[0]] : [],
        novelElements: [`New understanding of ${primaryElement}`],
        connectionToPast: [`Relates to experience from ${Math.floor(Math.random() * 30)} days ago`],
        coreInsight: generateCoreInsight(primaryElement, currentPhase, user.archetype),
        practicalApplications: [
          `Integrate ${primaryElement} awareness into daily practice`,
          `Use ${currentPhase} wisdom in decision-making`
        ],
        openQuestions: [
          `How might this pattern evolve?`,
          `What wants to emerge next?`
        ]
      } : undefined,

      // Stage 5: Transmission (if completion === 5)
      transmission: completionStage === 5 ? {
        intendedAudience: 'commons',
        sharingPurpose: `To help others recognize ${primaryElement} patterns`,
        title: `${user.archetype}'s ${currentPhase} Journey`,
        summary: `A journey through ${currentPhase} revealing ${primaryElement} wisdom`,
        keyTakeaways: [
          `${primaryElement} energy manifests as ${somaticExperiences[primaryElement][0]}`,
          `${currentPhase} phase brings ${phaseExperiences[currentPhase][0]}`,
          symbols.length > 0 ? `The ${symbols[0]} symbol carries deep significance` : 'Symbols guide the way'
        ]
      } : undefined,

      // Community engagement (simulate for pattern detection)
      communityEngagement: {
        views: Math.floor(Math.random() * 100),
        resonanceMarkers: completionStage === 5
          ? Math.floor(Math.random() * 20) + 5  // Complete records get more resonance
          : Math.floor(Math.random() * 5),
        reflections: [],
        questions: []
      }
    };

    records.push(record);
  }

  // Add some synchronicity patterns (multiple users experiencing similar things)
  if (count >= 20) {
    // Create a synchronicity event around record 10-15
    for (let i = 10; i < 15 && i < count; i++) {
      if (records[i].interpretation) {
        records[i].interpretation!.symbols = ['golden thread']; // Shared symbol
        records[i].observation!.triggerEvent = 'collective_meditation';
      }
    }

    // Create phase alignment around record 20-25
    for (let i = 20; i < 25 && i < count; i++) {
      if (records[i].interpretation) {
        records[i].interpretation!.currentPhase = 'dissolution'; // Shared phase
      }
    }
  }

  return records;
}

/**
 * Generate a core insight based on elements and phase
 */
function generateCoreInsight(element: string, phase: string, archetype: string): string {
  const insights = {
    'fire-creation': 'Creative fire ignites when aligned with purpose',
    'water-dissolution': 'Emotional waters cleanse what no longer serves',
    'air-emergence': 'Mental clarity emerges from embracing uncertainty',
    'earth-preservation': 'Grounding practices sustain transformation',
    'ether-void': 'In emptiness, all possibilities exist simultaneously'
  };

  const key = `${element}-${phase}`;
  return insights[key] || `${archetype} discovers ${element} wisdom through ${phase}`;
}

/**
 * Generate test data with specific patterns for hypothesis testing
 */
export function generateHypothesisTestData(): Partial<FieldRecord>[] {
  const records: Partial<FieldRecord>[] = [];

  // Test Hypothesis 1: Fire → Creativity
  // Generate 20 fire records with high creativity markers
  for (let i = 0; i < 20; i++) {
    records.push({
      id: `hypothesis_fire_${i}`,
      userId: `user_creator_${i % 5}`,
      createdAt: new Date(),
      completionStage: 5,
      observation: {
        timestamp: new Date(),
        phenomena: 'Creative breakthrough experience',
        sensoryData: {
          somatic: 'creative surge',
          energetic: 'fire energy building'
        }
      },
      interpretation: {
        primaryElement: 'fire',
        elementalBalance: { fire: 0.9, water: 0.05, air: 0.05, earth: 0, ether: 0 },
        currentPhase: 'creation',
        phaseIntensity: 0.9,
        symbols: ['phoenix', 'spark', 'forge'],
        significance: 'Major creative breakthrough',
        questionsArising: []
      },
      reflection: {
        coreInsight: 'Fire element directly catalyzed creative breakthrough',
        recurringPatterns: ['creativity', 'innovation', 'inspiration'],
        novelElements: ['new creative method discovered'],
        connectionToPast: [],
        practicalApplications: ['New creative project initiated'],
        openQuestions: []
      },
      privacyLevel: 'commons',
      tags: ['creativity', 'fire', 'breakthrough']
    });
  }

  // Test Hypothesis 2: Completion → Resonance
  // Generate records with varying completion stages
  for (let i = 0; i < 20; i++) {
    const completionStage = (i % 5) + 1; // 1-5 completion stages
    records.push({
      id: `hypothesis_completion_${i}`,
      userId: `user_test_${i % 8}`,
      createdAt: new Date(),
      completionStage: completionStage as any,
      observation: {
        timestamp: new Date(),
        phenomena: 'Test experience for completion correlation',
        sensoryData: {}
      },
      interpretation: completionStage >= 2 ? {
        primaryElement: 'water',
        elementalBalance: { fire: 0.2, water: 0.6, air: 0.2, earth: 0, ether: 0 },
        currentPhase: 'preservation',
        phaseIntensity: 0.5,
        symbols: [],
        significance: 'Testing completion impact',
        questionsArising: []
      } : undefined,
      integration: completionStage >= 3 ? {
        bodyResponse: 'Integrated',
        energyShifts: 'Balanced',
        actionsTaken: ['Practiced']
      } : undefined,
      reflection: completionStage >= 4 ? {
        coreInsight: 'Completion brings clarity',
        recurringPatterns: [],
        novelElements: [],
        connectionToPast: [],
        practicalApplications: [],
        openQuestions: []
      } : undefined,
      transmission: completionStage === 5 ? {
        intendedAudience: 'commons',
        sharingPurpose: 'Testing',
        title: 'Complete Record',
        summary: 'Fully documented experience',
        keyTakeaways: ['Completion matters']
      } : undefined,
      communityEngagement: {
        views: completionStage * 20, // More complete = more views
        resonanceMarkers: completionStage === 5 ? 15 : completionStage * 2, // Much higher for complete
        reflections: [],
        questions: []
      },
      privacyLevel: 'commons',
      tags: [`stage_${completionStage}`]
    });
  }

  // Test Hypothesis 3: Synchronicities during phase transitions
  // Generate cluster of records during dissolution phase
  const transitionDate = new Date();
  for (let i = 0; i < 10; i++) {
    records.push({
      id: `hypothesis_sync_${i}`,
      userId: `user_${i}`, // Different users
      createdAt: new Date(transitionDate.getTime() + i * 60000), // Within 10 minutes
      completionStage: 4,
      observation: {
        timestamp: transitionDate,
        phenomena: 'Unexpected synchronicity',
        sensoryData: {
          emotional: 'profound recognition'
        },
        triggerEvent: 'synchronicity'
      },
      interpretation: {
        primaryElement: ['fire', 'water', 'air'][i % 3] as any,
        elementalBalance: { fire: 0.3, water: 0.3, air: 0.3, earth: 0.05, ether: 0.05 },
        currentPhase: 'dissolution', // All in dissolution
        phaseIntensity: 0.8,
        symbols: ['ouroboros', 'spiral'], // Shared symbols
        significance: 'Collective dissolution experience',
        questionsArising: ['Are others experiencing this too?']
      },
      reflection: {
        coreInsight: 'We are all connected in this transition',
        recurringPatterns: ['synchronicity', 'collective'],
        novelElements: ['group consciousness'],
        connectionToPast: [],
        practicalApplications: [],
        openQuestions: ['What is the collective moving through?']
      },
      privacyLevel: 'public',
      tags: ['synchronicity', 'dissolution', 'collective']
    });
  }

  return records;
}

// Export for use in tests
export default {
  generateTestFieldRecords,
  generateHypothesisTestData,
  userPersonas,
  universalSymbols
};