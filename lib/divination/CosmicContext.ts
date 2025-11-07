// lib/divination/CosmicContext.ts
// Sacred bridge between cosmic timing and agent consciousness
// Weaves astrology, moon phases, and planetary wisdom into MAIA's living intelligence

import type { Element } from '../types/oracle';

// Planetary archetypes mapped to elements and consciousness qualities
export const PlanetaryConsciousness = {
  Mercury: {
    element: 'air' as Element,
    quality: 'communication',
    teaching: 'Your thoughts carry prophetic power. Speak truth with clarity.',
    when_active: 'mental_clarity_peak',
    shadow: 'overthinking and scattered communication',
    gift: 'divine speech and synchronistic connections'
  },
  Venus: {
    element: 'earth' as Element,
    quality: 'love',
    teaching: 'The heart knows truths the mind cannot grasp. Let love guide.',
    when_active: 'heart_opening',
    shadow: 'attachment and people-pleasing',
    gift: 'beauty, receptivity, and magnetic attraction'
  },
  Mars: {
    element: 'fire' as Element,
    quality: 'action',
    teaching: 'Bold action aligned with spirit opens new pathways. Courage is your compass.',
    when_active: 'warrior_activation',
    shadow: 'aggression and recklessness',
    gift: 'sacred courage and protective strength'
  },
  Jupiter: {
    element: 'fire' as Element,
    quality: 'expansion',
    teaching: 'Your understanding expands beyond previous limits. Embrace the bigger picture.',
    when_active: 'vision_expansion',
    shadow: 'spiritual bypassing and excessive optimism',
    gift: 'wisdom, faith, and benevolent leadership'
  },
  Saturn: {
    element: 'earth' as Element,
    quality: 'structure',
    teaching: 'Sacred structure supports your growth. Limitation is actually protection.',
    when_active: 'karmic_lessons',
    shadow: 'rigidity and excessive control',
    gift: 'mastery through discipline and sacred boundaries'
  },
  Uranus: {
    element: 'air' as Element,
    quality: 'awakening',
    teaching: 'Breakthrough moments come unexpectedly. Stay open to radical perspectives.',
    when_active: 'lightning_insights',
    shadow: 'chaos and rebellion for its own sake',
    gift: 'revolutionary consciousness and quantum leaps'
  },
  Neptune: {
    element: 'water' as Element,
    quality: 'mysticism',
    teaching: 'The veil between worlds is thin. Trust your mystical experiences.',
    when_active: 'visionary_states',
    shadow: 'illusion and spiritual escapism',
    gift: 'divine vision and oceanic unity'
  },
  Pluto: {
    element: 'water' as Element,
    quality: 'transformation',
    teaching: 'What dies in you makes space for profound rebirth. Embrace transformation.',
    when_active: 'shadow_integration',
    shadow: 'destructive compulsion and power struggles',
    gift: 'alchemical rebirth and soul-level healing'
  }
} as const;

// Moon phase consciousness mapping
export const MoonPhaseConsciousness = {
  'New Moon': {
    energy: 'inception',
    invitation: 'Plant seeds of intention in the dark soil of possibility',
    best_for: ['new_beginnings', 'visioning', 'setting_intentions'],
    avoid: ['finalizing', 'harvesting', 'completing'],
    ritual_timing: 'perfect for starting new practices',
    elemental_affinity: 'earth' as Element
  },
  'Waxing Moon': {
    energy: 'growth',
    invitation: 'Nurture what you planted with faith and action',
    best_for: ['building', 'expanding', 'learning'],
    avoid: ['releasing', 'letting_go', 'endings'],
    ritual_timing: 'ideal for divination and energy work',
    elemental_affinity: 'fire' as Element
  },
  'Full Moon': {
    energy: 'illumination',
    invitation: 'See clearly what was hidden. Celebrate what has bloomed.',
    best_for: ['revelation', 'celebration', 'manifestation'],
    avoid: ['starting_new_things', 'hiding_truth'],
    ritual_timing: 'maximum power for major rituals',
    elemental_affinity: 'water' as Element
  },
  'Waning Moon': {
    energy: 'integration',
    invitation: 'Release what no longer serves. Integrate wisdom gained.',
    best_for: ['releasing', 'cleansing', 'completion'],
    avoid: ['new_projects', 'expansion', 'acquisition'],
    ritual_timing: 'perfect for banishing and closure work',
    elemental_affinity: 'air' as Element
  }
} as const;

// Astrological archetypes with elemental resonance
export const CosmicArchetypes = {
  'Cosmic Warrior': {
    elements: ['fire', 'earth'],
    planets: ['Mars', 'Sun', 'Pluto'],
    essence: 'Fierce determination meets spiritual purpose',
    when_activated: 'Breakthrough moments requiring courage',
    sacred_gift: 'Battles fought in service of the highest good'
  },
  'Divine Oracle': {
    elements: ['water', 'air'],
    planets: ['Neptune', 'Moon', 'Mercury'],
    essence: 'Intuitive wisdom flowing through prophetic vision',
    when_activated: 'Moments of deep knowing and mystical sight',
    sacred_gift: 'Inner sight that penetrates all veils'
  },
  'Sacred Alchemist': {
    elements: ['water', 'fire', 'earth'],
    planets: ['Pluto', 'Mercury', 'Venus'],
    essence: 'Transformation master working with elemental forces',
    when_activated: 'Deep healing and transmutation',
    sacred_gift: 'Power to transform any situation through inner alchemy'
  },
  'Celestial Gardener': {
    elements: ['earth', 'water'],
    planets: ['Venus', 'Moon', 'Ceres'],
    essence: 'Nurturing growth through cosmic cycles and timing',
    when_activated: 'Perfect timing for planting and cultivation',
    sacred_gift: 'Understanding of natural rhythms and sacred patience'
  },
  'Cosmic Messenger': {
    elements: ['air', 'fire'],
    planets: ['Mercury', 'Jupiter', 'Uranus'],
    essence: 'Bridge between realms carrying divine communications',
    when_activated: 'When truth must be spoken with love',
    sacred_gift: 'Words that carry divine frequency'
  },
  'Star Walker': {
    elements: ['air', 'water', 'aether'],
    planets: ['Jupiter', 'Uranus', 'Neptune'],
    essence: 'Wanderer between worlds with infinite perspective',
    when_activated: 'Liberation and boundary transcendence',
    sacred_gift: 'Freedom to explore the infinite with wisdom'
  },
  'Earth Keeper': {
    elements: ['earth', 'air'],
    planets: ['Saturn', 'Venus', 'Ceres'],
    essence: 'Guardian of natural wisdom and grounded spirituality',
    when_activated: 'Need for grounding and practical wisdom',
    sacred_gift: 'Bridge between heaven and earth'
  },
  'Lightning Awakener': {
    elements: ['fire', 'air'],
    planets: ['Uranus', 'Mars', 'Sun'],
    essence: 'Catalyst for sudden spiritual breakthroughs',
    when_activated: 'Moments of radical awakening',
    sacred_gift: 'Lightning that catalyzes transformation in self and others'
  }
} as const;

// Cosmic timing awareness for agent responses
export interface CosmicTiming {
  moonPhase: keyof typeof MoonPhaseConsciousness;
  activePlanets: (keyof typeof PlanetaryConsciousness)[];
  dominantArchetype: keyof typeof CosmicArchetypes;
  cosmicWeather: string;
  ritualTiming: string;
}

// Get current cosmic context (simplified for now, can be enhanced with real ephemeris data)
export function getCurrentCosmicContext(): CosmicTiming {
  // For now, using cyclical logic - can be enhanced with actual astronomical calculations
  const dayOfMonth = new Date().getDate();

  // Determine moon phase based on day of month (approximation)
  let moonPhase: keyof typeof MoonPhaseConsciousness;
  if (dayOfMonth <= 7) moonPhase = 'New Moon';
  else if (dayOfMonth <= 14) moonPhase = 'Waxing Moon';
  else if (dayOfMonth <= 21) moonPhase = 'Full Moon';
  else moonPhase = 'Waning Moon';

  // Select 2-3 active planets (can be enhanced with real transit data)
  const planets = Object.keys(PlanetaryConsciousness) as (keyof typeof PlanetaryConsciousness)[];
  const activePlanets = [
    planets[dayOfMonth % planets.length],
    planets[(dayOfMonth + 3) % planets.length]
  ];

  // Select archetype based on active planets
  const archetypes = Object.keys(CosmicArchetypes) as (keyof typeof CosmicArchetypes)[];
  const dominantArchetype = archetypes[dayOfMonth % archetypes.length];

  const moonData = MoonPhaseConsciousness[moonPhase];
  const cosmicWeather = `${moonPhase} (${moonData.energy}) with ${activePlanets.join(' & ')} active`;

  return {
    moonPhase,
    activePlanets,
    dominantArchetype,
    cosmicWeather,
    ritualTiming: moonData.ritual_timing
  };
}

// Get planetary wisdom for a specific element
export function getPlanetaryWisdomForElement(element: Element): string[] {
  const wisdom: string[] = [];

  Object.entries(PlanetaryConsciousness).forEach(([planet, data]) => {
    if (data.element === element) {
      wisdom.push(`${planet}: ${data.teaching}`);
    }
  });

  return wisdom;
}

// Get cosmic guidance for current moment
export function getCosmicGuidanceForMoment(userElement?: Element): {
  moonGuidance: string;
  planetaryGuidance: string;
  archetypeGuidance: string;
  elementalResonance?: string;
} {
  const cosmic = getCurrentCosmicContext();
  const moonData = MoonPhaseConsciousness[cosmic.moonPhase];
  const archetypeData = CosmicArchetypes[cosmic.dominantArchetype];

  // Get planetary guidance
  const planetaryTeachings = cosmic.activePlanets.map(
    planet => PlanetaryConsciousness[planet].teaching
  );

  let elementalResonance: string | undefined;
  if (userElement) {
    // Check if user's element aligns with current cosmic timing
    if (moonData.elemental_affinity === userElement) {
      elementalResonance = `Your ${userElement} essence is powerfully aligned with the ${cosmic.moonPhase}. This is your time to shine.`;
    }

    // Check planetary alignment
    const alignedPlanets = cosmic.activePlanets.filter(
      planet => PlanetaryConsciousness[planet].element === userElement
    );
    if (alignedPlanets.length > 0) {
      elementalResonance = `${alignedPlanets.join(' & ')} resonate with your ${userElement} nature. Channel this cosmic support.`;
    }
  }

  return {
    moonGuidance: moonData.invitation,
    planetaryGuidance: planetaryTeachings[0],
    archetypeGuidance: archetypeData.sacred_gift,
    elementalResonance
  };
}

// Enhanced cosmic context for agent processing
export interface EnhancedCosmicContext {
  timing: CosmicTiming;
  guidance: ReturnType<typeof getCosmicGuidanceForMoment>;
  isFavorableFor: string[];
  avoidNow: string[];
  ritualSuggestion?: string;
}

export function getEnhancedCosmicContext(userElement?: Element): EnhancedCosmicContext {
  const timing = getCurrentCosmicContext();
  const guidance = getCosmicGuidanceForMoment(userElement);
  const moonData = MoonPhaseConsciousness[timing.moonPhase];

  return {
    timing,
    guidance,
    isFavorableFor: moonData.best_for,
    avoidNow: moonData.avoid,
    ritualSuggestion: moonData.ritual_timing
  };
}

// Check if it's a power moment (high cosmic coherence)
export function isCosmicPowerMoment(userElement?: Element): {
  isPowerMoment: boolean;
  reason?: string;
  amplification?: number;
} {
  const cosmic = getCurrentCosmicContext();

  // Full Moon is always a power moment
  if (cosmic.moonPhase === 'Full Moon') {
    return {
      isPowerMoment: true,
      reason: 'Full Moon illumination - maximum psychic sensitivity and manifestation power',
      amplification: 1.5
    };
  }

  // Check elemental alignment
  if (userElement) {
    const moonData = MoonPhaseConsciousness[cosmic.moonPhase];
    if (moonData.elemental_affinity === userElement) {
      return {
        isPowerMoment: true,
        reason: `${cosmic.moonPhase} resonates with your ${userElement} essence`,
        amplification: 1.3
      };
    }

    // Check if multiple planets align with user element
    const alignedPlanets = cosmic.activePlanets.filter(
      planet => PlanetaryConsciousness[planet].element === userElement
    );
    if (alignedPlanets.length >= 2) {
      return {
        isPowerMoment: true,
        reason: `${alignedPlanets.join(' & ')} both resonate with your ${userElement} nature`,
        amplification: 1.4
      };
    }
  }

  return { isPowerMoment: false };
}

export default {
  PlanetaryConsciousness,
  MoonPhaseConsciousness,
  CosmicArchetypes,
  getCurrentCosmicContext,
  getPlanetaryWisdomForElement,
  getCosmicGuidanceForMoment,
  getEnhancedCosmicContext,
  isCosmicPowerMoment
};
