/**
 * CULTURAL ARCHETYPE MAPPER
 *
 * Recognizes that the same archetypal PATTERN appears in different cultural GUISES:
 * - Greek gods = Yoruba orishas = Hindu deities = Indigenous spirits
 * - Same energy, different cultural clothing
 * - Honors multiplicity while recognizing universality
 *
 * "Knowing these archetypes show up in different guises around the world."
 * - Kelly Beard
 */

import type {
  UniversalArchetypePattern,
  CulturalArchetypeForm
} from './UniversalArchetypalFramework';
import { ICHING_ARCHETYPE_PATTERNS } from './UniversalArchetypalFramework';

// ============== TYPES ==============

export interface CulturalMapping {
  archetypePattern: string; // ID of universal pattern
  culture: string;
  deity: string;
  story: string;
  practices: string[];
  whenToInvoke: string;
}

export interface CrossCulturalCorrespondence {
  archetypeId: string;
  patternName: string;
  correspondences: CulturalMapping[];
}

// ============== CULTURAL TRADITIONS ==============

export const CULTURAL_TRADITIONS = [
  // European & Mediterranean
  'Greek',
  'Roman',
  'Norse',
  'Viking',
  'Nordic',
  'Celtic',
  'Egyptian',
  'Sumerian',

  // Asian
  'Hindu',
  'Buddhist',
  'Taoist',
  'Shinto',

  // African
  'Yoruba',
  'Vodou',
  'Zulu',
  'Dogon',
  'San Bushman',

  // Indigenous Americas
  'Indigenous North American',
  'Lakota',
  'Navajo',
  'Hopi',
  'Mayan',
  'Aztec',
  'Inca',
  'Quechua',
  'Mapuche',
  'Amazonian',

  // Oceanic
  'Aboriginal Australian',
  'Maori',
  'Polynesian',
  'Hawaiian',

  // Shamanic Traditions
  'Siberian Shamanic',
  'Mongolian Shamanic',
  'Korean Mudang',
  'Nepali Jhankri',
  'Peruvian Curandero',
  'Brazilian Santo Daime',

  // Mystical Traditions
  'Zoroastrian',
  'Sufi',
  'Christian Mystical',
  'Jewish Kabbalistic',
  'Gnostic',
  'Hermetic'
] as const;

export type CulturalTradition = typeof CULTURAL_TRADITIONS[number];

// ============== EXTENDED CULTURAL MAPPINGS ==============

/**
 * The Initiator / Thunder across cultures
 */
export const INITIATOR_CORRESPONDENCES: CulturalMapping[] = [
  {
    archetypePattern: 'thunder-initiator',
    culture: 'Greek',
    deity: 'Prometheus / Ares',
    story: 'Prometheus steals fire; Ares brings war',
    practices: ['Fire ritual', 'Battle meditation', 'Initiation rites'],
    whenToInvoke: 'When breakthrough is needed, when starting something new'
  },
  {
    archetypePattern: 'thunder-initiator',
    culture: 'Norse',
    deity: 'Thor',
    story: 'Thunder god who breaks through with hammer',
    practices: ['Hammer blessing', 'Thunder calling', 'Obstacle breaking'],
    whenToInvoke: 'When obstacles block the path'
  },
  {
    archetypePattern: 'thunder-initiator',
    culture: 'Hindu',
    deity: 'Shiva (Destroyer)',
    story: 'Destroys to make way for new creation',
    practices: ['Rudra mantra', 'Destruction meditation', 'Clearing ritual'],
    whenToInvoke: 'When old patterns must die for new life'
  },
  {
    archetypePattern: 'thunder-initiator',
    culture: 'Yoruba',
    deity: 'Shango',
    story: 'Orisha of thunder and lightning',
    practices: ['Thunder drum', 'Lightning dance', 'Power invocation'],
    whenToInvoke: 'When power and justice are needed'
  },
  {
    archetypePattern: 'thunder-initiator',
    culture: 'Mayan',
    deity: 'Chaac',
    story: 'Rain and thunder god',
    practices: ['Rain ceremony', 'Thunder calling'],
    whenToInvoke: 'When drought (literal or metaphorical) needs breaking'
  }
];

/**
 * The Nurturer / Earth across cultures
 */
export const NURTURER_CORRESPONDENCES: CulturalMapping[] = [
  {
    archetypePattern: 'earth-nurturer',
    culture: 'Greek',
    deity: 'Demeter / Gaia',
    story: 'Mother goddess who nourishes all life',
    practices: ['Harvest ritual', 'Earth offerings', 'Abundance ceremony'],
    whenToInvoke: 'When nurturing is needed, for harvest and abundance'
  },
  {
    archetypePattern: 'earth-nurturer',
    culture: 'Hindu',
    deity: 'Prithvi / Bhumi Devi',
    story: 'Earth goddess who supports all beings',
    practices: ['Bhumi puja', 'Earth touching meditation', 'Grounding practice'],
    whenToInvoke: 'For grounding, for support, for fertile beginnings'
  },
  {
    archetypePattern: 'earth-nurturer',
    culture: 'Yoruba',
    deity: 'Onile / Ala',
    story: 'Earth mother who owns the land',
    practices: ['Earth libations', 'Soil offerings', 'Land blessings'],
    whenToInvoke: 'Before building, planting, or creating'
  },
  {
    archetypePattern: 'earth-nurturer',
    culture: 'Indigenous American',
    deity: 'Corn Mother / Earth Mother',
    story: 'She who feeds all her children',
    practices: ['Corn ceremony', 'Earth honoring', 'Gratitude ritual'],
    whenToInvoke: 'For gratitude, for sustenance, for mothering'
  },
  {
    archetypePattern: 'earth-nurturer',
    culture: 'Egyptian',
    deity: 'Isis (mothering aspect)',
    story: 'Great mother who nurtures and protects',
    practices: ['Isis invocation', 'Throne meditation', 'Protection magic'],
    whenToInvoke: 'For protection and nurturing of new life'
  }
];

/**
 * The Mystic / Water across cultures
 */
export const MYSTIC_CORRESPONDENCES: CulturalMapping[] = [
  {
    archetypePattern: 'water-mystic',
    culture: 'Greek',
    deity: 'Poseidon / Hades',
    story: 'Gods of the deep ocean and underworld',
    practices: ['Deep meditation', 'Underworld journey', 'Mystery initiation'],
    whenToInvoke: 'For deep wisdom, for mysteries, for hidden truth'
  },
  {
    archetypePattern: 'water-mystic',
    culture: 'Hindu',
    deity: 'Varuna',
    story: 'God of cosmic law and ocean depths',
    practices: ['Varuna puja', 'Deep yoga', 'Cosmic order meditation'],
    whenToInvoke: 'For understanding cosmic order, for depth work'
  },
  {
    archetypePattern: 'water-mystic',
    culture: 'Yoruba',
    deity: 'Olokun',
    story: 'Deity of ocean depths and wealth',
    practices: ['Ocean offerings', 'Deep trance', 'Mystery revelation'],
    whenToInvoke: 'For hidden wealth (inner or outer), for depth'
  },
  {
    archetypePattern: 'water-mystic',
    culture: 'Celtic',
    deity: 'Manannan Mac Lir',
    story: 'God of the sea and otherworld',
    practices: ['Sea journey', 'Mist walking', 'Otherworld travel'],
    whenToInvoke: 'For otherworld wisdom, for sea magic'
  },
  {
    archetypePattern: 'water-mystic',
    culture: 'Polynesian',
    deity: 'Tangaroa',
    story: 'God of ocean and all its creatures',
    practices: ['Ocean blessing', 'Wave meditation', 'Deep diving'],
    whenToInvoke: 'For ocean wisdom, for navigating depths'
  }
];

// ============== MAPPER FUNCTIONS ==============

/**
 * Find archetype by cultural deity name
 */
export function findArchetypeByDeity(
  deityName: string,
  culture?: string
): UniversalArchetypePattern | null {
  for (const archetype of ICHING_ARCHETYPE_PATTERNS) {
    const match = archetype.culturalForms.find(form => {
      const nameMatch = form.deity?.toLowerCase().includes(deityName.toLowerCase()) ||
                       form.name.toLowerCase().includes(deityName.toLowerCase());
      const cultureMatch = !culture || form.culture.toLowerCase() === culture.toLowerCase();
      return nameMatch && cultureMatch;
    });

    if (match) return archetype;
  }

  return null;
}

/**
 * Get all cultural forms of same pattern
 */
export function getCulturalVariations(archetypeId: string): CulturalArchetypeForm[] {
  const archetype = ICHING_ARCHETYPE_PATTERNS.find(a => a.id === archetypeId);
  return archetype?.culturalForms || [];
}

/**
 * Recognize pattern across cultures
 */
export function recognizePatternAcrossCultures(description: string): {
  pattern: string;
  culturalMatches: CulturalMapping[];
  confidence: number;
} | null {
  // Simple pattern matching - can be enhanced
  const lowerDesc = description.toLowerCase();

  // Thunder/Initiator patterns
  if (/thunder|lightning|break|initiat|shock|awaken|revolution/i.test(description)) {
    return {
      pattern: 'thunder-initiator',
      culturalMatches: INITIATOR_CORRESPONDENCES,
      confidence: 0.8
    };
  }

  // Earth/Nurturer patterns
  if (/earth|mother|nurture|support|ground|fertile|harvest/i.test(description)) {
    return {
      pattern: 'earth-nurturer',
      culturalMatches: NURTURER_CORRESPONDENCES,
      confidence: 0.8
    };
  }

  // Water/Mystic patterns
  if (/deep|ocean|mystery|mystic|hidden|depth|abyss|flow/i.test(description)) {
    return {
      pattern: 'water-mystic',
      culturalMatches: MYSTIC_CORRESPONDENCES,
      confidence: 0.8
    };
  }

  return null;
}

/**
 * Get culturally appropriate practice
 */
export function getPracticeForCulture(
  archetypeId: string,
  preferredCulture: CulturalTradition
): string[] {
  const archetype = ICHING_ARCHETYPE_PATTERNS.find(a => a.id === archetypeId);
  if (!archetype) return [];

  const culturalForm = archetype.culturalForms.find(
    form => form.culture === preferredCulture
  );

  return culturalForm?.practices || archetype.culturalForms[0]?.practices || [];
}

/**
 * Suggest cultural correspondences for user's background
 */
export function suggestCulturalLens(
  userPreferences: {
    culturalBackground?: string[];
    spiritualInterests?: string[];
  }
): CulturalTradition[] {
  const suggestions: CulturalTradition[] = [];

  // Start with user's stated background
  if (userPreferences.culturalBackground) {
    userPreferences.culturalBackground.forEach(bg => {
      const match = CULTURAL_TRADITIONS.find(
        t => t.toLowerCase().includes(bg.toLowerCase())
      );
      if (match) suggestions.push(match);
    });
  }

  // Add interests
  if (userPreferences.spiritualInterests) {
    userPreferences.spiritualInterests.forEach(interest => {
      const match = CULTURAL_TRADITIONS.find(
        t => t.toLowerCase().includes(interest.toLowerCase())
      );
      if (match && !suggestions.includes(match)) suggestions.push(match);
    });
  }

  // Default to a few accessible traditions if nothing specified
  if (suggestions.length === 0) {
    suggestions.push('Greek', 'Taoist', 'Indigenous American');
  }

  return suggestions;
}

/**
 * Generate cross-cultural insight
 */
export function generateCrossCulturalInsight(archetypeId: string): string {
  const archetype = ICHING_ARCHETYPE_PATTERNS.find(a => a.id === archetypeId);
  if (!archetype) return '';

  const forms = archetype.culturalForms;
  if (forms.length < 2) return '';

  const cultures = forms.map(f => f.culture).join(', ');
  const deities = forms.map(f => f.deity || f.name).slice(0, 3).join(', ');

  return `The ${archetype.name} pattern appears across cultures as ${deities} (${cultures}). Though clothed in different myths and symbols, each expresses the same universal pattern: ${archetype.essence}.`;
}

// ============== WORLDVIEW PLURALISM ==============

/**
 * Honor user's worldview while showing universal patterns
 */
export interface WorldviewContext {
  tradition: CulturalTradition;
  isOpenToOthers: boolean;
  preferredLanguage: 'mythological' | 'psychological' | 'spiritual' | 'scientific';
}

export function formatArchetypeForWorldview(
  archetype: UniversalArchetypePattern,
  context: WorldviewContext
): string {
  const culturalForm = archetype.culturalForms.find(
    f => f.culture === context.tradition
  ) || archetype.culturalForms[0];

  let response = '';

  if (context.preferredLanguage === 'mythological') {
    response = `In ${culturalForm.culture} tradition, this is the energy of ${culturalForm.deity}: ${culturalForm.story}.`;
  } else if (context.preferredLanguage === 'psychological') {
    response = `This is ${archetype.name}, the pattern of ${archetype.essence}.`;
  } else if (context.preferredLanguage === 'spiritual') {
    response = `The spiritual essence here is ${archetype.name}: ${archetype.essence}.`;
  } else {
    response = `Pattern: ${archetype.name}. Core dynamic: ${archetype.essence}.`;
  }

  if (context.isOpenToOthers) {
    response += `\n\n${generateCrossCulturalInsight(archetype.id)}`;
  }

  return response;
}
