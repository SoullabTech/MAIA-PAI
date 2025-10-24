/**
 * Official Soullab Brand Theme
 * From SoulLabDesignBrief_ISI2.pdf
 */

export const SOULLAB_COLORS = {
  // Elemental Colors (Muted Earthy Palette)
  fire: '#a94724',      // Red - Fire element
  air: '#cea22c',       // Yellow - Air element
  earth: '#6d7934',     // Green - Earth element
  water: '#236586',     // Blue - Water element

  // Neutrals
  black: '#000000',
  gray: '#777777',
  brown: '#33251d',     // Dark earthy brown

  // Derived tones for gradients
  fireLight: '#c25530',
  fireDark: '#8a3a1d',
  airLight: '#d9b23a',
  airDark: '#b89023',
  earthLight: '#7e8a42',
  earthDark: '#5a6628',
  waterLight: '#2a7499',
  waterDark: '#1a5670'
} as const;

export const SOULLAB_FONTS = {
  heading: '"Blair ITC", "Lato", system-ui, sans-serif',
  body: '"Lato", system-ui, sans-serif'
} as const;

export const SOULLAB_GRADIENTS = {
  // Spiral gradient (like logo)
  spiral: `conic-gradient(from 0deg, ${SOULLAB_COLORS.fire}, ${SOULLAB_COLORS.air}, ${SOULLAB_COLORS.earth}, ${SOULLAB_COLORS.water}, ${SOULLAB_COLORS.fire})`,

  // Linear gradients
  fireToAir: `linear-gradient(135deg, ${SOULLAB_COLORS.fire} 0%, ${SOULLAB_COLORS.air} 100%)`,
  airToEarth: `linear-gradient(135deg, ${SOULLAB_COLORS.air} 0%, ${SOULLAB_COLORS.earth} 100%)`,
  earthToWater: `linear-gradient(135deg, ${SOULLAB_COLORS.earth} 0%, ${SOULLAB_COLORS.water} 100%)`,
  waterToFire: `linear-gradient(135deg, ${SOULLAB_COLORS.water} 0%, ${SOULLAB_COLORS.fire} 100%)`,

  // Full spectrum
  fullSpectrum: `linear-gradient(135deg, ${SOULLAB_COLORS.fire} 0%, ${SOULLAB_COLORS.air} 33%, ${SOULLAB_COLORS.earth} 66%, ${SOULLAB_COLORS.water} 100%)`
} as const;

// Design attributes (from brand brief)
export const SOULLAB_IS = [
  'Inspiring',
  'Clean',
  'Modern',
  'Elegant',
  'Bold',
  'Elevating',
  'Awakening',
  'Elemental',
  'Electric',
  'Iconic',
  'Clear'
] as const;

export const SOULLAB_IS_NOT = [
  'Soft or Pastel',
  'Chaotic or unordered',
  'Generic or simple',
  'Frilly or complicated',
  'Scripty fonts',
  '"New Agey" looking',
  'Beige'
] as const;
