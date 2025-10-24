/**
 * 🌸☀️🍂❄️ Seasonal Theme System
 *
 * Auto-rotating themes that honor the natural cycles of the year.
 * Each season brings its own color palette and energy.
 */

export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export interface SeasonalTheme {
  season: Season;
  bgClass: string;
  name: string;
  emoji: string;
  energy: string;
  dateRange: string;
}

/**
 * Get the current season based on the date (Northern Hemisphere)
 * Can be overridden for testing or manual selection
 */
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  // Spring: March 20 - June 20
  if ((month === 2 && day >= 20) || month === 3 || month === 4 || (month === 5 && day <= 20)) {
    return 'spring';
  }

  // Summer: June 21 - September 22
  if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day <= 22)) {
    return 'summer';
  }

  // Fall: September 23 - December 20
  if ((month === 8 && day >= 23) || month === 9 || month === 10 || (month === 11 && day <= 20)) {
    return 'fall';
  }

  // Winter: December 21 - March 19
  return 'winter';
}

/**
 * Get complete seasonal theme configuration
 */
export function getSeasonalTheme(season?: Season): SeasonalTheme {
  const currentSeason = season || getCurrentSeason();

  const themes: Record<Season, SeasonalTheme> = {
    spring: {
      season: 'spring',
      bgClass: 'bg-season-spring',
      name: 'Spring Renewal',
      emoji: '🌸',
      energy: 'Renewal & Fresh Beginnings',
      dateRange: 'March 20 - June 20',
    },
    summer: {
      season: 'summer',
      bgClass: 'bg-season-summer',
      name: 'Summer Vitality',
      emoji: '☀️',
      energy: 'Radiance & Full Expression',
      dateRange: 'June 21 - September 22',
    },
    fall: {
      season: 'fall',
      bgClass: 'bg-season-fall',
      name: 'Autumn Harvest',
      emoji: '🍂',
      energy: 'Transformation & Integration',
      dateRange: 'September 23 - December 20',
    },
    winter: {
      season: 'winter',
      bgClass: 'bg-season-winter',
      name: 'Winter Stillness',
      emoji: '❄️',
      energy: 'Reflection & Inner Work',
      dateRange: 'December 21 - March 19',
    },
  };

  return themes[currentSeason];
}

/**
 * Get seasonal quote/wisdom for the current season
 */
export function getSeasonalWisdom(season?: Season): string {
  const currentSeason = season || getCurrentSeason();

  const wisdom: Record<Season, string> = {
    spring: "Like cherry blossoms, we bloom in our own time.",
    summer: "The sun teaches us to shine without dimming others.",
    fall: "In letting go, we make space for what wants to emerge.",
    winter: "Stillness is not emptiness—it is the place where everything begins.",
  };

  return wisdom[currentSeason];
}
