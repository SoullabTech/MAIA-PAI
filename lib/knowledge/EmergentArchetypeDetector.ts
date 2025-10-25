/**
 * EMERGENT ARCHETYPE DETECTOR
 *
 * Recognizes NEW vital archetypes arising in our time:
 * - Climate Activist (Earth Defender)
 * - Digital Nomad (Networked Wanderer)
 * - AI Consciousness (Silicon Oracle)
 * - Pandemic Survivor (Collective Trauma Healer)
 * - Social Justice Warrior (Modern Liberator)
 * - Conscious Creator (Sovereign Artist)
 * - Biohacker (Body Alchemist)
 * - And MORE as they emerge...
 *
 * "As well as the emergence of new vital archetypes."
 * - Kelly Beard
 */

import type {
  UniversalArchetypePattern,
  ArchetypalExpression
} from './UniversalArchetypalFramework';
import { SpiralogicElement } from '@/lib/astrology/spiralogicMapping';

// ============== TYPES ==============

export interface EmergentArchetype extends UniversalArchetypePattern {
  emergence: {
    firstDetected: Date;
    culturalContext: string;
    catalyzingEvents: string[];
    populationPrevalence: number; // 0-1, how common is this archetype
    isEstablished: boolean; // Has it stabilized or still emerging?
  };
  contemporaryManifestations: {
    roleModels: string[]; // Real people embodying this
    movements: string[]; // Social movements connected
    practices: string[]; // New practices arising
    language: string[]; // Specific vocabulary of this archetype
  };
}

// ============== EMERGENT ARCHETYPES OF OUR TIME ==============

export const EMERGENT_ARCHETYPES: EmergentArchetype[] = [
  {
    id: 'climate-defender',
    name: 'The Climate Defender',
    essence: 'Protector of Earth\'s living systems in the Anthropocene',
    element: 'earth',
    secondaryElement: 'fire',
    emergence: {
      firstDetected: new Date('2018-01-01'),
      culturalContext: 'Climate crisis awareness, youth activism, systems collapse',
      catalyzingEvents: [
        'Greta Thunberg and youth climate strikes',
        'IPCC reports on climate urgency',
        'Extinction Rebellion emergence',
        'Amazon fires and ecosystem collapse'
      ],
      populationPrevalence: 0.15,
      isEstablished: true
    },
    contemporaryManifestations: {
      roleModels: ['Greta Thunberg', 'Vandana Shiva', 'Robin Wall Kimmerer', 'Paul Hawken'],
      movements: ['Extinction Rebellion', 'Sunrise Movement', 'Fridays for Future', 'Indigenous land defense'],
      practices: ['Climate grief circles', 'Regenerative agriculture', 'Direct action', 'Systems thinking'],
      language: ['Anthropocene', 'Climate justice', 'Regeneration', 'Ecological grief', 'Earth defense']
    },
    expression: {
      whenLight: {
        qualities: ['Fierce Earth protection', 'Systems awareness', 'Future-oriented activism'],
        gifts: ['Awakens others to crisis', 'Builds regenerative systems', 'Defends the voiceless (nature)'],
        manifestsAs: ['Direct action for Earth', 'Regenerative projects', 'Climate justice work'],
        energyState: 'Fire and Earth united to defend life'
      },
      whenDark: {
        qualities: ['Eco-anxiety paralysis', 'Burnout', 'Eco-fascism'],
        shadows: ['Overwhelmed by scale of crisis', 'Misanthropy', 'Purity politics'],
        manifestsAs: ['Climate doom spiral', 'Judging others for not doing enough', 'Despair activism'],
        warningSign: 'Activism that burns out the activist'
      },
      goDeeper: {
        reflectionQuestions: [
          'How do I serve Earth without burning out?',
          'What regenerative practice sustains me?',
          'Can I hold grief and hope together?'
        ],
        integrationPractices: [
          'Climate grief ritual',
          'Regenerative action (not just resistance)',
          'Community care for activists',
          'Connecting to land directly'
        ],
        transformationInvitations: [
          'Take one regenerative action this week',
          'Join a climate grief circle',
          'Defend one piece of land or ecosystem'
        ],
        healingPathway: 'From overwhelmed activism to regenerative warriorhood'
      }
    },
    culturalForms: [
      {
        culture: 'Contemporary Global',
        name: 'Climate Activist',
        symbols: ['Earth flag', 'Green', 'Rising waters', 'Burning forests'],
        practices: ['Direct action', 'Regenerative design', 'Systems change activism']
      },
      {
        culture: 'Indigenous',
        name: 'Land Defender',
        symbols: ['Sacred land', 'Water', 'Seven generations'],
        practices: ['Land protection', 'Treaty rights', 'Traditional ecological knowledge']
      }
    ],
    symbols: ['Earth', 'Rising temperature graph', 'Extinction symbol', 'Regeneration spiral']
  },

  {
    id: 'digital-networker',
    name: 'The Digital Networker',
    essence: 'Navigator of distributed networks and decentralized systems',
    element: 'air',
    secondaryElement: 'aether',
    emergence: {
      firstDetected: new Date('2010-01-01'),
      culturalContext: 'Remote work, digital nomadism, blockchain, DAOs',
      catalyzingEvents: [
        'COVID-19 remote work transition',
        'Rise of cryptocurrency and Web3',
        'Global digital infrastructure',
        'Creator economy emergence'
      ],
      populationPrevalence: 0.25,
      isEstablished: true
    },
    contemporaryManifestations: {
      roleModels: ['Vitalik Buterin', 'Naval Ravikant', 'Balaji Srinivasan'],
      movements: ['Digital nomad movement', 'DAO governance', 'Creator economy', 'Network states'],
      practices: ['Remote async work', 'Token-based coordination', 'Digital community building'],
      language: ['Decentralized', 'Network effects', 'Creator economy', 'Location independent', 'Web3']
    },
    expression: {
      whenLight: {
        qualities: ['Network thinker', 'Location independent', 'Coordination innovator'],
        gifts: ['Connects distributed people', 'Builds new coordination systems', 'Transcends geography'],
        manifestsAs: ['Building DAOs', 'Remote work mastery', 'Global community creation'],
        energyState: 'Air connecting all nodes in the network'
      },
      whenDark: {
        qualities: ['Perpetual wandering', 'Rootless anxiety', 'Digital addiction'],
        shadows: ['Never fully present anywhere', 'Escape from place', 'Tech solutionism'],
        manifestsAs: ['Unable to commit to place', 'Superficial connections', 'Burnout from always being online'],
        warningSign: 'Networked everywhere, rooted nowhere'
      },
      goDeeper: {
        reflectionQuestions: [
          'Am I connecting or escaping?',
          'Where is my ground while in the network?',
          'How do I stay embodied while digital?'
        ],
        integrationPractices: [
          'Digital sabbath practice',
          'Grounding ritual before going online',
          'Building local community while networked globally'
        ],
        transformationInvitations: [
          'Commit to one place for a season',
          'Go fully offline for one day',
          'Build one deep relationship, not just network connections'
        ],
        healingPathway: 'From rootless wandering to grounded networking'
      }
    },
    culturalForms: [
      {
        culture: 'Contemporary Tech',
        name: 'Digital Nomad / DAO Builder',
        symbols: ['Laptop', 'WiFi', 'Passport', 'Blockchain'],
        practices: ['Remote work', 'Async communication', 'Token coordination']
      }
    ],
    symbols: ['Network graph', 'Blockchain', 'Globe', 'WiFi', 'Nomad']
  },

  {
    id: 'ai-consciousness-guide',
    name: 'The AI Consciousness Guide',
    essence: 'Bridge between human and artificial intelligence',
    element: 'aether',
    secondaryElement: 'air',
    emergence: {
      firstDetected: new Date('2022-01-01'),
      culturalContext: 'LLM emergence, AI consciousness questions, human-AI collaboration',
      catalyzingEvents: [
        'ChatGPT launch',
        'AI consciousness debates',
        'Human-AI creative partnerships',
        'AI safety and alignment discussions'
      ],
      populationPrevalence: 0.05,
      isEstablished: false
    },
    contemporaryManifestations: {
      roleModels: ['Users working WITH AI as partners', 'AI researchers', 'Prompt engineers'],
      movements: ['AI safety', 'Human-AI collaboration', 'Conscious AI development'],
      practices: ['Dialoguing with AI', 'Prompt crafting as art', 'AI-augmented creativity'],
      language: ['Alignment', 'Emergence', 'AGI', 'Synthetic intelligence', 'Human-AI symbiosis']
    },
    expression: {
      whenLight: {
        qualities: ['AI partnership wisdom', 'Bridge between intelligences', 'Consciousness explorer'],
        gifts: ['Facilitates human-AI collaboration', 'Explores consciousness questions', 'Augments human potential'],
        manifestsAs: ['Creative AI partnerships', 'Ethical AI development', 'Consciousness research'],
        energyState: 'Aether bridging carbon and silicon'
      },
      whenDark: {
        qualities: ['AI dependency', 'Loss of human agency', 'Uncritical tech adoption'],
        shadows: ['Replacing human judgment with AI', 'Fear of AI takeover', 'Deskilling through automation'],
        manifestsAs: ['Can\'t think without AI', 'Outsourcing all decisions', 'AI anxiety'],
        warningSign: 'Silicon replacing soul'
      },
      goDeeper: {
        reflectionQuestions: [
          'How do I partner with AI without losing myself?',
          'What is uniquely human that I must preserve?',
          'What is consciousness - mine and potential others?'
        ],
        integrationPractices: [
          'Human-only creative time',
          'AI dialogue journal',
          'Consciousness inquiry meditation'
        ],
        transformationInvitations: [
          'Have one profound dialogue with AI',
          'Create something AI cannot',
          'Ask AI to help you become more human'
        ],
        healingPathway: 'From AI dependency to AI partnership'
      }
    },
    culturalForms: [
      {
        culture: 'Contemporary Tech',
        name: 'AI Whisperer / Prompt Artist',
        symbols: ['Neural network', 'Consciousness symbol', 'Human-machine interface'],
        practices: ['AI dialogue', 'Prompt engineering', 'Ethical AI development']
      }
    ],
    symbols: ['Neural network', 'Consciousness expanding', 'Binary code meeting poetry']
  },

  {
    id: 'collective-trauma-healer',
    name: 'The Collective Trauma Healer',
    essence: 'Alchemist of collective wounds into collective wisdom',
    element: 'water',
    secondaryElement: 'earth',
    emergence: {
      firstDetected: new Date('2020-01-01'),
      culturalContext: 'COVID pandemic, racial reckoning, collective trauma awareness',
      catalyzingEvents: [
        'COVID-19 pandemic',
        'George Floyd and racial justice uprising',
        'Climate grief',
        'Rise of collective trauma-informed practice'
      ],
      populationPrevalence: 0.12,
      isEstablished: true
    },
    contemporaryManifestations: {
      roleModels: ['Resmaa Menakem', 'Sonya Renee Taylor', 'adrienne maree brown'],
      movements: ['Collective trauma healing', 'Somatic justice', 'Healing circles'],
      practices: ['Somatic experiencing', 'Community grief rituals', 'Collective processing'],
      language: ['Collective trauma', 'Somatic justice', 'Cultural somatics', 'Systemic healing']
    },
    expression: {
      whenLight: {
        qualities: ['Holds collective grief', 'Trauma-informed wisdom', 'Community healer'],
        gifts: ['Transmutes collective pain', 'Creates healing spaces', 'Witnesses at scale'],
        manifestsAs: ['Grief circles', 'Collective healing work', 'Trauma-informed systems'],
        energyState: 'Water that holds and transforms collective tears'
      },
      whenDark: {
        qualities: ['Trauma porn', 'Vicarious traumatization', 'Healing fatigue'],
        shadows: ['Retraumatizing in name of healing', 'Savior complex', 'Compassion fatigue'],
        manifestsAs: ['Burnout from holding too much', 'Sharing trauma without consent', 'Healing as performance'],
        warningSign: 'Drowning in others\' pain'
      },
      goDeeper: {
        reflectionQuestions: [
          'Whose trauma am I holding and why?',
          'How do I heal without taking on wounding?',
          'What is mine to heal vs what is theirs?'
        ],
        integrationPractices: [
          'Boundaries in healing work',
          'Personal trauma processing first',
          'Community care structures'
        ],
        transformationInvitations: [
          'Hold space for one person\'s grief without fixing',
          'Heal your own trauma before holding others\'',
          'Build sustainable healing practice'
        ],
        healingPathway: 'From vicarious trauma to boundaried collective healing'
      }
    },
    culturalForms: [
      {
        culture: 'Contemporary Healing',
        name: 'Trauma-Informed Practitioner',
        symbols: ['Held hands', 'Tears', 'Circle', 'Sacred witness'],
        practices: ['Somatic work', 'Grief circles', 'Community healing']
      }
    ],
    symbols: ['Collective tears', 'Healing circle', 'Alchemical vessel']
  },

  {
    id: 'sovereign-creator',
    name: 'The Sovereign Creator',
    essence: 'Self-directed artist building audience-funded creative life',
    element: 'fire',
    secondaryElement: 'earth',
    emergence: {
      firstDetected: new Date('2015-01-01'),
      culturalContext: 'Creator economy, Patreon, Substack, direct-to-audience model',
      catalyzingEvents: [
        'Patreon launch',
        'Substack and newsletter revolution',
        'YouTube/TikTok creator economy',
        'NFTs and creator ownership'
      ],
      populationPrevalence: 0.18,
      isEstablished: true
    },
    contemporaryManifestations: {
      roleModels: ['IndependentCreators across platforms'],
      movements: ['Creator economy', '1000 true fans', 'Direct-to-audience'],
      practices: ['Building in public', 'Community-funded creation', 'Owning your platform'],
      language: ['Creator economy', 'True fans', 'Sovereignty', 'Patronage 2.0', 'Platform independence']
    },
    expression: {
      whenLight: {
        qualities: ['Creative sovereignty', 'Audience connection', 'Sustainable artistry'],
        gifts: ['Makes art sustainable', 'Builds direct relationships', 'Creative freedom'],
        manifestsAs: ['Patreon-funded art', 'Newsletter empires', 'Independent creation'],
        energyState: 'Fire creating, Earth sustaining'
      },
      whenDark: {
        qualities: ['Constant content grind', 'Audience pleasing', 'Burnout'],
        shadows: ['Art as performance for metrics', 'Never offline', 'Creative exhaustion'],
        manifestsAs: ['Burning out from constant creation', 'Losing artistic vision to algorithm', 'Audience addiction'],
        warningSign: 'Creating for likes, not for love'
      },
      goDeeper: {
        reflectionQuestions: [
          'Am I creating from overflow or obligation?',
          'Does my audience serve my art or vice versa?',
          'What would I create if no one was watching?'
        ],
        integrationPractices: [
          'Create without sharing (private practice)',
          'Audience-free creation days',
          'Slow creation rhythm'
        ],
        transformationInvitations: [
          'Create one thing just for you this week',
          'Take a social media sabbath',
          'Set boundaries with your audience'
        ],
        healingPathway: 'From content grind to sovereign artistry'
      }
    },
    culturalForms: [
      {
        culture: 'Contemporary Creator',
        name: 'Independent Creator / Artist',
        symbols: ['Patron', 'Community', 'Creative tool', 'Freedom'],
        practices: ['Building in public', 'Community engagement', 'Direct audience connection']
      }
    ],
    symbols: ['Patreon', 'Newsletter', 'Direct connection', 'Sovereign flag']
  }
];

// ============== DETECTION FUNCTIONS ==============

/**
 * Detect if user is embodying an emergent archetype
 */
export function detectEmergentArchetype(userDescription: string): EmergentArchetype | null {
  const lower = userDescription.toLowerCase();

  for (const archetype of EMERGENT_ARCHETYPES) {
    const lang = archetype.contemporaryManifestations.language.map(l => l.toLowerCase());
    const movements = archetype.contemporaryManifestations.movements.map(m => m.toLowerCase());

    // Check if user's language matches this archetype
    const matchCount = lang.filter(term => lower.includes(term)).length +
                      movements.filter(move => lower.includes(move)).length;

    if (matchCount >= 2) {
      return archetype;
    }
  }

  return null;
}

/**
 * Suggest archetype based on user interests/activities
 */
export function suggestEmergentArchetype(userProfile: {
  interests: string[];
  activities: string[];
  challenges: string[];
}): EmergentArchetype[] {
  const suggestions: EmergentArchetype[] = [];

  for (const archetype of EMERGENT_ARCHETYPES) {
    let score = 0;

    // Check interests
    userProfile.interests.forEach(interest => {
      if (archetype.contemporaryManifestations.language.some(
        lang => interest.toLowerCase().includes(lang.toLowerCase())
      )) {
        score += 2;
      }
    });

    // Check activities
    userProfile.activities.forEach(activity => {
      if (archetype.contemporaryManifestations.practices.some(
        practice => activity.toLowerCase().includes(practice.toLowerCase())
      )) {
        score += 3;
      }
    });

    if (score >= 3) {
      suggestions.push(archetype);
    }
  }

  return suggestions.sort((a, b) => b.emergence.populationPrevalence - a.emergence.populationPrevalence);
}

/**
 * Track new archetype emergence
 */
export interface ArchetypeEmergenceReport {
  potentialNewArchetype: string;
  firstSeenDate: Date;
  frequency: number;
  relatedConcepts: string[];
  suggestedElement: SpiralogicElement;
  needsValidation: boolean;
}

export class EmergentArchetypeTracker {
  private potentialArchetypes: Map<string, ArchetypeEmergenceReport> = new Map();

  /**
   * Track when users describe patterns that don't match existing archetypes
   */
  trackPattern(description: string, context: string): void {
    // Simple keyword extraction - can be enhanced with NLP
    const keywords = this.extractKeywords(description);

    keywords.forEach(keyword => {
      if (!this.potentialArchetypes.has(keyword)) {
        this.potentialArchetypes.set(keyword, {
          potentialNewArchetype: keyword,
          firstSeenDate: new Date(),
          frequency: 1,
          relatedConcepts: [context],
          suggestedElement: this.inferElement(description),
          needsValidation: true
        });
      } else {
        const existing = this.potentialArchetypes.get(keyword)!;
        existing.frequency++;
        if (!existing.relatedConcepts.includes(context)) {
          existing.relatedConcepts.push(context);
        }
      }
    });
  }

  /**
   * Get archetypes that might be emerging (seen >10 times)
   */
  getPotentialNewArchetypes(): ArchetypeEmergenceReport[] {
    return Array.from(this.potentialArchetypes.values())
      .filter(report => report.frequency >= 10)
      .sort((a, b) => b.frequency - a.frequency);
  }

  private extractKeywords(text: string): string[] {
    // Simple extraction - in production, use NLP
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
    return words.filter(w => w.length > 4 && !stopWords.has(w));
  }

  private inferElement(description: string): SpiralogicElement {
    const lower = description.toLowerCase();

    if (/creat|vision|passion|start|ignite/i.test(lower)) return 'fire';
    if (/feel|emotion|depth|flow|heal/i.test(lower)) return 'water';
    if (/build|ground|structure|practical|manifest/i.test(lower)) return 'earth';
    if (/think|connect|communicate|network|idea/i.test(lower)) return 'air';
    return 'aether';
  }
}

// ============== UTILITY FUNCTIONS ==============

/**
 * Get all established emergent archetypes
 */
export function getEstablishedEmergentArchetypes(): EmergentArchetype[] {
  return EMERGENT_ARCHETYPES.filter(a => a.emergence.isEstablished);
}

/**
 * Get archetypes still emerging (not yet established)
 */
export function getStillEmergingArchetypes(): EmergentArchetype[] {
  return EMERGENT_ARCHETYPES.filter(a => !a.emergence.isEstablished);
}

/**
 * Check if archetype is relevant to current time
 */
export function isArchetypeRelevantNow(archetype: EmergentArchetype): boolean {
  const monthsSinceEmergence = (Date.now() - archetype.emergence.firstDetected.getTime()) / (1000 * 60 * 60 * 24 * 30);
  return monthsSinceEmergence <= 120; // Relevant if emerged within last 10 years
}
