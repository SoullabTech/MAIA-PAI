/**
 * UNIVERSAL ARCHETYPAL FRAMEWORK
 *
 * A living system that:
 * - Honors I Ching trigrams (Tao Oracle)
 * - Recognizes traditional European archetypes (Jung, Tarot)
 * - Maps to Spiralogic process (Fire/Water/Earth/Air)
 * - Celebrates cultural multiplicity (same pattern, different guises)
 * - Stays open to emergence of new vital archetypes
 *
 * "We want to be adaptive to this, as well as the emergence of new vital archetypes."
 * - Kelly Beard
 */

import { SpiralogicElement } from '@/lib/astrology/spiralogicMapping';
import type { ArchetypalExpression } from './ArchetypalLightDarkSystem';

// ============== CORE TYPES ==============

/**
 * Universal Archetype Pattern
 * The pattern itself, independent of cultural expression
 */
export interface UniversalArchetypePattern {
  id: string;
  name: string; // Universal pattern name
  essence: string; // Core essence of the pattern
  element: SpiralogicElement; // Primary elemental association
  secondaryElement?: SpiralogicElement; // Secondary element

  // Light/Dark/Depth expression
  expression: ArchetypalExpression;

  // Cultural manifestations
  culturalForms: CulturalArchetypeForm[];

  // Related symbols
  symbols: string[];

  // Emergence markers (for new archetypes)
  emergenceDate?: Date;
  emergenceContext?: string;
}

/**
 * Cultural Archetype Form
 * How the universal pattern appears in specific cultural contexts
 */
export interface CulturalArchetypeForm {
  culture: string; // "Greek", "Yoruba", "Hindu", "Celtic", "Indigenous American", etc.
  name: string; // Name in that culture
  deity?: string; // Associated deity if applicable
  story?: string; // Key myth or story
  symbols: string[];
  practices: string[]; // How to work with this archetype in that tradition
}

/**
 * I Ching Trigram Archetype
 * Special integration with Tao Oracle system
 */
export interface IChingTrigramArchetype extends UniversalArchetypePattern {
  trigram: {
    number: number; // 1-8
    symbol: string; // "☳", "☴", etc.
    chineseElement: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
    direction: string;
    attribute: string;
  };
  hexagrams: string[]; // Associated hexagrams
  phase: string; // Fractal phase
}

// ============== I CHING TRIGRAM ARCHETYPES ==============

export const ICHING_ARCHETYPE_PATTERNS: IChingTrigramArchetype[] = [
  {
    id: 'thunder-initiator',
    name: 'The Initiator',
    essence: 'Dynamic force of new beginnings and breakthrough energy',
    element: 'fire',
    trigram: {
      number: 1,
      symbol: '☳',
      chineseElement: 'Wood',
      direction: 'East',
      attribute: 'Arousing'
    },
    hexagrams: ['51 - Thunder', '16 - Enthusiasm', '40 - Deliverance', '32 - Duration'],
    phase: 'Initiation Phase - Seeds of new potential breaking through',
    expression: {
      whenLight: {
        qualities: ['Bold pioneer', 'Awakener of potential', 'Catalyst for change'],
        gifts: ['Breaks through stagnation', 'Initiates necessary action', 'Shocks systems awake'],
        manifestsAs: ['Sudden breakthroughs', 'Courageous first steps', 'Revolutionary ideas'],
        energyState: 'Thunder awakening the sleeping earth'
      },
      whenDark: {
        qualities: ['Reckless disruption', 'Shock without purpose', 'Chaotic initiation'],
        shadows: ['Destroying for destruction\'s sake', 'Addiction to novelty', 'Unable to sustain'],
        manifestsAs: ['Starting everything, finishing nothing', 'Traumatizing rather than awakening', 'Chaos without creation'],
        warningSign: 'Thunder that destroys rather than awakens'
      },
      goDeeper: {
        reflectionQuestions: [
          'What needs to be awakened or initiated in my life right now?',
          'Am I creating change or just creating chaos?',
          'What breakthrough is trying to happen through me?'
        ],
        integrationPractices: [
          'Morning thunder breath (explosive exhale)',
          'Begin ONE thing with full commitment',
          'Channel breakthrough energy into form'
        ],
        transformationInvitations: [
          'Initiate one project you\'ve been avoiding',
          'Be the catalyst someone else needs (with permission)',
          'Allow yourself to be shocked awake by beauty'
        ],
        healingPathway: 'From chaotic disruption to sacred initiation'
      }
    },
    culturalForms: [
      {
        culture: 'Greek',
        name: 'Prometheus',
        deity: 'Prometheus',
        story: 'Steals fire from the gods to awaken humanity',
        symbols: ['Fire', 'Lightning', 'Torch'],
        practices: ['Bringing new ideas to the world', 'Challenging authority for growth']
      },
      {
        culture: 'Hindu',
        name: 'Shiva (Destroyer aspect)',
        deity: 'Shiva',
        story: 'Destroys to create space for new creation',
        symbols: ['Trident', 'Damaru (drum)', 'Third eye'],
        practices: ['Destruction meditation', 'Breaking old patterns']
      },
      {
        culture: 'Norse',
        name: 'Thor',
        deity: 'Thor',
        story: 'Thunder god who breaks through obstacles',
        symbols: ['Mjolnir (hammer)', 'Lightning', 'Oak'],
        practices: ['Calling on thunder for breakthrough', 'Hammer strikes to break blocks']
      }
    ],
    symbols: ['Thunder', 'Lightning', 'Earthquake', 'Sudden awakening', 'Revolution']
  },

  {
    id: 'wind-influencer',
    name: 'The Influencer',
    essence: 'Subtle penetration and gradual influence through persistence',
    element: 'air',
    trigram: {
      number: 2,
      symbol: '☴',
      chineseElement: 'Wood',
      direction: 'Southeast',
      attribute: 'Gentle'
    },
    hexagrams: ['57 - Wind', '20 - Contemplation', '53 - Development', '42 - Increase'],
    phase: 'Growth Phase - Gentle cultivation and steady development',
    expression: {
      whenLight: {
        qualities: ['Gentle persuasion', 'Persistent growth', 'Subtle influence'],
        gifts: ['Penetrates gently but completely', 'Influences without force', 'Cultivates gradual change'],
        manifestsAs: ['Quiet but unstoppable growth', 'Soft power that moves mountains', 'Gentle persistence'],
        energyState: 'Wind that shapes stone over time'
      },
      whenDark: {
        qualities: ['Manipulative influence', 'Invasive penetration', 'Passive aggression'],
        shadows: ['Controlling through subtlety', 'Undermining rather than supporting', 'Invisible manipulation'],
        manifestsAs: ['Gaslighting', 'Subtle coercion', 'Eroding boundaries'],
        warningSign: 'Wind that wears away rather than nurtures'
      },
      goDeeper: {
        reflectionQuestions: [
          'Am I influencing or manipulating?',
          'Where do I need gentle persistence instead of force?',
          "What's trying to grow through me gradually?"
        ],
        integrationPractices: [
          'Breath meditation - following the natural flow',
          'Practice gentle persuasion instead of argument',
          'Tend something that grows slowly (garden, skill, relationship)'
        ],
        transformationInvitations: [
          'Choose one area to influence gently this week',
          'Notice where force has failed and try subtle approach',
          'Let go of needing immediate results'
        ],
        healingPathway: 'From manipulative control to gentle influence'
      }
    },
    culturalForms: [
      {
        culture: 'Greek',
        name: 'Hermes (messenger aspect)',
        deity: 'Hermes',
        story: 'God of communication and subtle influence',
        symbols: ['Caduceus', 'Winged sandals', 'Hermes staff'],
        practices: ['Speaking with subtle power', 'Influencing through words']
      },
      {
        culture: 'Hindu',
        name: 'Vayu',
        deity: 'Vayu',
        story: 'God of wind and life force',
        symbols: ['Wind', 'Breath', 'Prana'],
        practices: ['Pranayama (breath work)', 'Allowing influence to flow']
      },
      {
        culture: 'Celtic',
        name: 'Aeolus',
        deity: 'Aeolus',
        story: 'Keeper of the winds',
        symbols: ['Four winds', 'Bag of winds', 'Compass'],
        practices: ['Calling the winds for change', 'Gentle magic']
      }
    ],
    symbols: ['Wind', 'Breath', 'Seeds on the breeze', 'Gentle rain', 'Gradual erosion']
  },

  {
    id: 'fire-illuminator',
    name: 'The Illuminator',
    essence: 'Radiant consciousness and clarity that illuminates truth',
    element: 'fire',
    secondaryElement: 'aether',
    trigram: {
      number: 3,
      symbol: '☲',
      chineseElement: 'Fire',
      direction: 'South',
      attribute: 'Clinging'
    },
    hexagrams: ['30 - Fire', '13 - Fellowship', '14 - Great Possession', '56 - The Wanderer'],
    phase: 'Illumination Phase - Clarity emerges and consciousness expands',
    expression: {
      whenLight: {
        qualities: ['Radiant awareness', 'Truth-revealer', 'Conscious clarity'],
        gifts: ['Illuminates what was hidden', 'Brings consciousness to unconscious', 'Reveals beauty and truth'],
        manifestsAs: ['Sudden clarity', 'Insight that transforms', 'Light in darkness'],
        energyState: 'Fire that illuminates without consuming'
      },
      whenDark: {
        qualities: ['Harsh exposure', 'Burning truth', 'Blinding light'],
        shadows: ['Revealing too much too soon', 'Consciousness that denies mystery', 'Truth as weapon'],
        manifestsAs: ['Brutal honesty that wounds', 'Exposing others\' shadows uninvited', 'Light that blinds'],
        warningSign: 'Fire that burns away all mystery and shadow'
      },
      goDeeper: {
        reflectionQuestions: [
          'What truth is asking to be illuminated?',
          'Am I using clarity as weapon or as gift?',
          'What shadow am I afraid to bring to light?'
        ],
        integrationPractices: [
          'Candle gazing meditation',
          'Journaling what wants to be seen',
          'Compassionate truth-telling practice'
        ],
        transformationInvitations: [
          'Illumine one hidden truth gently',
          'Be light without demanding others leave shadow',
          'Reveal beauty, not just problems'
        ],
        healingPathway: 'From harsh exposure to gentle illumination'
      }
    },
    culturalForms: [
      {
        culture: 'Greek',
        name: 'Apollo',
        deity: 'Apollo',
        story: 'God of light, truth, and prophecy',
        symbols: ['Sun', 'Lyre', 'Laurel', 'Python'],
        practices: ['Oracle work', 'Seeking truth through divination']
      },
      {
        culture: 'Egyptian',
        name: 'Ra',
        deity: 'Ra',
        story: 'Sun god who illuminates all creation',
        symbols: ['Solar disk', 'Falcon', 'Eye of Ra'],
        practices: ['Solar meditation', 'Noon contemplation']
      },
      {
        culture: 'Hindu',
        name: 'Agni',
        deity: 'Agni',
        story: 'God of fire and divine knowledge',
        symbols: ['Sacred fire', 'Flame', 'Light'],
        practices: ['Fire ceremony (havan)', 'Bringing consciousness to action']
      }
    ],
    symbols: ['Sun', 'Flame', 'Torch', 'Revelation', 'Consciousness']
  },

  {
    id: 'earth-nurturer',
    name: 'The Nurturer',
    essence: 'Receptive power that supports and nurtures all manifestation',
    element: 'earth',
    secondaryElement: 'water',
    trigram: {
      number: 4,
      symbol: '☷',
      chineseElement: 'Earth',
      direction: 'Southwest',
      attribute: 'Receptive'
    },
    hexagrams: ['2 - Earth', '23 - Splitting Apart', '8 - Holding Together', '20 - Contemplation'],
    phase: 'Grounding Phase - Integration and practical manifestation',
    expression: {
      whenLight: {
        qualities: ['Receptive wisdom', 'Nurturing presence', 'Grounded support'],
        gifts: ['Holds space for all to grow', 'Nourishes without agenda', 'Provides stable foundation'],
        manifestsAs: ['Unconditional support', 'Fertile ground', 'Patient cultivation'],
        energyState: 'Earth that receives seeds and grows forests'
      },
      whenDark: {
        qualities: ['Smothering care', 'Demanding receptivity', 'Martyrdom'],
        shadows: ['Nurturing as control', 'Codependency', 'Self-sacrifice as identity'],
        manifestsAs: ['Can\'t let go', 'Enabling dysfunction', 'Resentful service'],
        warningSign: 'Earth that becomes swamp or quicksand'
      },
      goDeeper: {
        reflectionQuestions: [
          'Am I nurturing or enabling?',
          'What needs my patient support right now?',
          'Can I receive as well as give?'
        ],
        integrationPractices: [
          'Grounding practice (barefoot on earth)',
          'Plant tending as meditation',
          'Receiving before giving exercise'
        ],
        transformationInvitations: [
          'Nurture yourself as you nurture others',
          'Set boundaries in service',
          'Let someone else hold you'
        ],
        healingPathway: 'From codependent caretaking to sovereign nurturance'
      }
    },
    culturalForms: [
      {
        culture: 'Greek',
        name: 'Demeter/Gaia',
        deity: 'Demeter (Mother) / Gaia (Earth)',
        story: 'Goddess who nurtures all life',
        symbols: ['Wheat', 'Cornucopia', 'Earth itself'],
        practices: ['Harvest rituals', 'Gratitude for abundance']
      },
      {
        culture: 'Hindu',
        name: 'Prithvi/Bhumi',
        deity: 'Prithvi',
        story: 'Earth goddess who supports all beings',
        symbols: ['Earth', 'Cow', 'Lotus'],
        practices: ['Touching earth in meditation', 'Honoring the ground']
      },
      {
        culture: 'Yoruba',
        name: 'Onile',
        deity: 'Onile',
        story: 'Spirit of earth who owns all land',
        symbols: ['Soil', 'Clay', 'Foundation'],
        practices: ['Earth offerings', 'Grounding ceremonies']
      }
    ],
    symbols: ['Earth', 'Soil', 'Womb', 'Garden', 'Foundation']
  },

  {
    id: 'lake-communicator',
    name: 'The Communicator',
    essence: 'Joyful expression and the power of words and communication',
    element: 'air',
    secondaryElement: 'water',
    trigram: {
      number: 5,
      symbol: '☱',
      chineseElement: 'Metal',
      direction: 'West',
      attribute: 'Joyous'
    },
    hexagrams: ['58 - Lake', '10 - Treading', '61 - Inner Truth', '54 - The Marrying Maiden'],
    phase: 'Expression Phase - Joy and creative communication flows',
    expression: {
      whenLight: {
        qualities: ['Joyful expression', 'Authentic voice', 'Connecting communication'],
        gifts: ['Speaks truth with joy', 'Connects people through words', 'Expresses beauty'],
        manifestsAs: ['Inspiring speech', 'Joyful creativity', 'Words that heal'],
        energyState: 'Lake reflecting sky - clarity and delight'
      },
      whenDark: {
        qualities: ['Superficial chatter', 'Gossip', 'Manipulative words'],
        shadows: ['Using words to wound', 'Talking without substance', 'Joy without depth'],
        manifestsAs: ['Endless talking, no listening', 'Gossip as connection', 'Performance without presence'],
        warningSign: 'Lake that becomes stagnant or poisoned'
      },
      goDeeper: {
        reflectionQuestions: [
          'What wants to be expressed through me?',
          'Am I speaking truth or performing?',
          'How can I communicate with more joy and less agenda?'
        ],
        integrationPractices: [
          'Speaking from joy practice',
          'Authentic expression journaling',
          'Sacred listening before speaking'
        ],
        transformationInvitations: [
          'Express one truth you\'ve been hiding',
          'Practice joyful communication for one day',
          'Listen more than you speak this week'
        ],
        healingPathway: 'From manipulative words to joyful authentic expression'
      }
    },
    culturalForms: [
      {
        culture: 'Greek',
        name: 'Hermes (communicator)',
        deity: 'Hermes',
        story: 'Messenger of gods, god of communication',
        symbols: ['Caduceus', 'Words', 'Messages'],
        practices: ['Oracle speaking', 'Clear communication']
      },
      {
        culture: 'Yoruba',
        name: 'Eshu/Elegba',
        deity: 'Eshu',
        story: 'Divine messenger and trickster',
        symbols: ['Crossroads', 'Keys', 'Messages'],
        practices: ['Offerings at crossroads', 'Speaking truth']
      },
      {
        culture: 'Hindu',
        name: 'Saraswati (speech aspect)',
        deity: 'Saraswati',
        story: 'Goddess of speech and creative expression',
        symbols: ['Veena (instrument)', 'Book', 'Swan'],
        practices: ['Chanting', 'Poetic expression']
      }
    ],
    symbols: ['Lake', 'Mirror', 'Voice', 'Joy', 'Connection']
  },

  {
    id: 'heaven-leader',
    name: 'The Leader',
    essence: 'Creative force of leadership and divine inspiration',
    element: 'fire',
    secondaryElement: 'air',
    trigram: {
      number: 6,
      symbol: '☰',
      chineseElement: 'Metal',
      direction: 'Northwest',
      attribute: 'Creative'
    },
    hexagrams: ['1 - Heaven', '12 - Standstill', '25 - Innocence', '6 - Conflict'],
    phase: 'Mastery Phase - Leadership and creative authority emerge',
    expression: {
      whenLight: {
        qualities: ['Inspiring leadership', 'Creative authority', 'Divine inspiration'],
        gifts: ['Leads with vision and integrity', 'Inspires others to greatness', 'Channels divine creativity'],
        manifestsAs: ['Visionary leadership', 'Creative breakthroughs', 'Inspiring others'],
        energyState: 'Heaven raining inspiration on earth'
      },
      whenDark: {
        qualities: ['Tyrannical control', 'Ego inflation', 'Demanding worship'],
        shadows: ['Authority without compassion', 'Leadership as domination', 'Creative but destructive'],
        manifestsAs: ['Dictatorial behavior', 'Crushing others to rise', 'Inspiration that burns out followers'],
        warningSign: 'Heaven closed and unreachable'
      },
      goDeeper: {
        reflectionQuestions: [
          'Am I leading or controlling?',
          'What vision am I serving - ego or soul?',
          'How can I lead with both strength and compassion?'
        ],
        integrationPractices: [
          'Visionary meditation',
          'Leadership as service practice',
          'Channeling creative inspiration'
        ],
        transformationInvitations: [
          'Lead one project with pure service',
          'Inspire rather than demand',
          'Share creative authority with others'
        ],
        healingPathway: 'From tyrannical control to inspired leadership'
      }
    },
    culturalForms: [
      {
        culture: 'Greek',
        name: 'Zeus',
        deity: 'Zeus',
        story: 'King of gods, divine authority',
        symbols: ['Lightning bolt', 'Eagle', 'Throne'],
        practices: ['Invoking divine authority', 'Leadership rituals']
      },
      {
        culture: 'Egyptian',
        name: 'Horus',
        deity: 'Horus',
        story: 'Divine king, Sky god',
        symbols: ['Eye of Horus', 'Falcon', 'Crown'],
        practices: ['Kingship rites', 'Sky meditation']
      },
      {
        culture: 'Yoruba',
        name: 'Obatala',
        deity: 'Obatala',
        story: 'Creator deity, king of white cloth',
        symbols: ['White cloth', 'Snail', 'Silver'],
        practices: ['Purity rites', 'Creative leadership']
      }
    ],
    symbols: ['Heaven', 'Sky', 'Crown', 'Lightning', 'Authority']
  },

  {
    id: 'water-mystic',
    name: 'The Mystic',
    essence: 'Deep wisdom flowing through challenges and hidden depths',
    element: 'water',
    secondaryElement: 'aether',
    trigram: {
      number: 7,
      symbol: '☵',
      chineseElement: 'Water',
      direction: 'North',
      attribute: 'Abysmal'
    },
    hexagrams: ['29 - Water', '39 - Obstruction', '48 - The Well', '63 - After Completion'],
    phase: 'Depth Phase - Dive into mystery and hidden wisdom',
    expression: {
      whenLight: {
        qualities: ['Deep wisdom', 'Flowing through obstacles', 'Mystical insight'],
        gifts: ['Finds wisdom in darkness', 'Flows around obstacles', 'Accesses deep truth'],
        manifestsAs: ['Profound insight', 'Mystical experience', 'Wisdom from difficulty'],
        energyState: 'Water flowing to the deepest places'
      },
      whenDark: {
        qualities: ['Drowning in depth', 'Lost in mystery', 'Dangerous obsession'],
        shadows: ['Depth as escape', 'Mystery hoarding', 'Drowning rather than diving'],
        manifestsAs: ['Spiritual bypassing through "deep work"', 'Lost in the abyss', 'Addiction to darkness'],
        warningSign: 'Water that pulls you under'
      },
      goDeeper: {
        reflectionQuestions: [
          'What wisdom waits in my depths?',
          'Am I diving or drowning?',
          'What mystery calls me to explore?'
        ],
        integrationPractices: [
          'Deep meditation practice',
          'Shadow diving with support',
          'Mystical contemplation'
        ],
        transformationInvitations: [
          'Dive one layer deeper in your practice',
          'Seek wisdom in current difficulty',
          'Surface to share what you find'
        ],
        healingPathway: 'From drowning in depth to diving for wisdom'
      }
    },
    culturalForms: [
      {
        culture: 'Greek',
        name: 'Poseidon/Hades',
        deity: 'Poseidon (depths) / Hades (underworld)',
        story: 'Gods of the deep and hidden',
        symbols: ['Trident', 'Ocean', 'Underworld'],
        practices: ['Deep meditation', 'Underworld journey']
      },
      {
        culture: 'Hindu',
        name: 'Varuna',
        deity: 'Varuna',
        story: 'God of cosmic order and deep waters',
        symbols: ['Ocean', 'Noose', 'Makara (sea creature)'],
        practices: ['Deep yoga', 'Water meditation']
      },
      {
        culture: 'Yoruba',
        name: 'Olokun',
        deity: 'Olokun',
        story: 'Deity of the deep ocean and mysteries',
        symbols: ['Deep ocean', 'Shells', 'Pearls'],
        practices: ['Ocean offerings', 'Depth work']
      }
    ],
    symbols: ['Deep water', 'Abyss', 'Well', 'Mystery', 'Flow']
  },

  {
    id: 'mountain-contemplator',
    name: 'The Contemplator',
    essence: 'Still meditation and the power of inner contemplation',
    element: 'earth',
    secondaryElement: 'aether',
    trigram: {
      number: 8,
      symbol: '☶',
      chineseElement: 'Earth',
      direction: 'Northeast',
      attribute: 'Keeping Still'
    },
    hexagrams: ['52 - Mountain', '15 - Modesty', '62 - Small Exceeding', '31 - Influence'],
    phase: 'Contemplation Phase - Stillness reveals inner wisdom',
    expression: {
      whenLight: {
        qualities: ['Sacred stillness', 'Inner wisdom', 'Contemplative presence'],
        gifts: ['Knows through silence', 'Finds truth in stillness', 'Meditation as revelation'],
        manifestsAs: ['Deep meditation', 'Wise counsel from silence', 'Still presence that transforms'],
        energyState: 'Mountain standing in eternal stillness'
      },
      whenDark: {
        qualities: ['Frozen inaction', 'Isolation', 'Paralysis'],
        shadows: ['Stillness as avoidance', 'Meditation to escape', 'Stuck, not still'],
        manifestsAs: ['Can\'t move forward', 'Isolation as identity', 'Meditation bypass'],
        warningSign: 'Mountain that traps rather than liberates'
      },
      goDeeper: {
        reflectionQuestions: [
          'Am I still or stuck?',
          'What wisdom waits in silence?',
          'What am I avoiding through stillness?'
        ],
        integrationPractices: [
          'Silent meditation retreat',
          'Stillness practice',
          'Contemplative journaling'
        ],
        transformationInvitations: [
          'Be still for one hour without escape',
          'Listen to what silence reveals',
          'Move from stillness when ready'
        ],
        healingPathway: 'From frozen paralysis to sacred stillness'
      }
    },
    culturalForms: [
      {
        culture: 'Buddhist',
        name: 'Buddha (in meditation)',
        deity: 'Buddha',
        story: 'Enlightenment through meditation under Bodhi tree',
        symbols: ['Mountain', 'Lotus', 'Stillness'],
        practices: ['Vipassana meditation', 'Silent retreat']
      },
      {
        culture: 'Hindu',
        name: 'Shiva (Contemplative aspect)',
        deity: 'Shiva',
        story: 'Lord of meditation and yogis',
        symbols: ['Himalayas', 'Meditation posture', 'Third eye'],
        practices: ['Yogic meditation', 'Mountain contemplation']
      },
      {
        culture: 'Taoist',
        name: 'Sage of the Mountain',
        story: 'Hermit who finds wisdom in solitude',
        symbols: ['Mountain peak', 'Hermitage', 'Clouds'],
        practices: ['Solitary practice', 'Nature contemplation']
      }
    ],
    symbols: ['Mountain', 'Stillness', 'Meditation', 'Silence', 'Boundaries']
  }
];

// ============== CORE UNIVERSAL ARCHETYPES ==============

/**
 * 12+ Universal Archetypes that resonate with Spiralogic
 * Recognizable across cultures in different guises
 */
export const UNIVERSAL_ARCHETYPES: UniversalArchetypePattern[] = [
  // ... I Ching archetypes are included above ...
  // Additional universal archetypes can be added here

  // The traditional 12 will be mapped separately to allow
  // cultural variation while maintaining pattern recognition
];

// ============== UTILITY FUNCTIONS ==============

/**
 * Get I Ching archetype by trigram number
 */
export function getIChingArchetype(trigramNumber: number): IChingTrigramArchetype | undefined {
  return ICHING_ARCHETYPE_PATTERNS.find(a => a.trigram.number === trigramNumber);
}

/**
 * Get all archetypes for a specific element
 */
export function getArchetypesForElement(element: SpiralogicElement): UniversalArchetypePattern[] {
  return ICHING_ARCHETYPE_PATTERNS.filter(a => a.element === element);
}

/**
 * Find archetype by cultural form
 */
export function findArchetypeByCulturalName(
  culture: string,
  name: string
): UniversalArchetypePattern | undefined {
  return ICHING_ARCHETYPE_PATTERNS.find(archetype =>
    archetype.culturalForms.some(form =>
      form.culture.toLowerCase() === culture.toLowerCase() &&
      form.name.toLowerCase().includes(name.toLowerCase())
    )
  );
}

/**
 * Get all cultural forms of an archetype
 */
export function getCulturalVariations(archetypeId: string): CulturalArchetypeForm[] {
  const archetype = ICHING_ARCHETYPE_PATTERNS.find(a => a.id === archetypeId);
  return archetype?.culturalForms || [];
}

/**
 * Map element to I Ching element
 */
export function mapSpiralogicToIChing(spiralogicElement: SpiralogicElement): string {
  const mapping: Record<SpiralogicElement, string> = {
    fire: 'Fire',
    water: 'Water',
    earth: 'Earth',
    air: 'Metal', // Air maps to Metal in I Ching
    aether: 'Spirit' // Aether transcends the five elements
  };
  return mapping[spiralogicElement];
}
