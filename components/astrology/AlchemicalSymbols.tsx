/**
 * Alchemical Elemental Symbols
 *
 * Hemisphere-based alchemy symbols for the four classical elements:
 *
 * RIGHT HEMISPHERE (No line - retrograde/receptive):
 * - Fire: △ (simple upward triangle) - Calcinatio
 * - Water: ▽ (simple downward triangle) - Solutio
 *
 * LEFT HEMISPHERE (With line - direct/active):
 * - Air: △— (upward triangle with horizontal line)
 * - Earth: ▽— (downward triangle with horizontal line)
 */

interface AlchemicalSymbolProps {
  element: 'fire' | 'water' | 'earth' | 'air';
  size?: number;
  color?: string;
  opacity?: number;
}

export function AlchemicalSymbol({
  element,
  size = 24,
  color = '#B8860B',
  opacity = 0.7
}: AlchemicalSymbolProps) {
  const halfSize = size / 2;
  const strokeWidth = size / 12;

  switch (element) {
    case 'fire':
      // Simple upward triangle △ (RIGHT HEMISPHERE - no line)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C8A572" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
          <path
            d="M 50 15 L 85 85 L 15 85 Z"
            fill="none"
            stroke="url(#fireGradient)"
            strokeWidth={strokeWidth}
            strokeLinejoin="miter"
            opacity={opacity}
          />
        </svg>
      );

    case 'water':
      // Simple downward triangle ▽ (RIGHT HEMISPHERE - no line)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C8A572" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
          <path
            d="M 50 85 L 15 15 L 85 15 Z"
            fill="none"
            stroke="url(#waterGradient)"
            strokeWidth={strokeWidth}
            strokeLinejoin="miter"
            opacity={opacity}
          />
        </svg>
      );

    case 'earth':
      // Downward triangle with horizontal line ▽— (LEFT HEMISPHERE - with line)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="earthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C8A572" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
          {/* Inverted triangle */}
          <path
            d="M 50 85 L 15 15 L 85 15 Z"
            fill="none"
            stroke="url(#earthGradient)"
            strokeWidth={strokeWidth}
            strokeLinejoin="miter"
            opacity={opacity}
          />
          {/* Horizontal line through middle */}
          <line
            x1="25"
            y1="50"
            x2="75"
            y2="50"
            stroke="url(#earthGradient)"
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        </svg>
      );

    case 'air':
      // Upward triangle with horizontal line △— (LEFT HEMISPHERE - with line)
      return (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="airGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C8A572" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
          {/* Upward triangle */}
          <path
            d="M 50 15 L 85 85 L 15 85 Z"
            fill="none"
            stroke="url(#airGradient)"
            strokeWidth={strokeWidth}
            strokeLinejoin="miter"
            opacity={opacity}
          />
          {/* Horizontal line through middle */}
          <line
            x1="25"
            y1="50"
            x2="75"
            y2="50"
            stroke="url(#airGradient)"
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        </svg>
      );
  }
}

// Export mapping for easy reference
export const alchemicalElementMapping = {
  fire: {
    houses: [1, 5, 9],
    symbol: '△',
    hemisphere: 'Right Hemisphere',
    alchemicalOperation: 'Calcinatio',
    meaning: 'Active, ascending, transformative energy (no line - retrograde/receptive)',
    process: 'Experience → Expression → Expansion',
  },
  water: {
    houses: [4, 8, 12],
    symbol: '▽',
    hemisphere: 'Right Hemisphere',
    alchemicalOperation: 'Solutio',
    meaning: 'Receptive, descending, purifying energy (no line - retrograde/receptive)',
    process: 'Heart → Healing → Holiness',
  },
  earth: {
    houses: [10, 2, 6],
    symbol: '▽—',
    hemisphere: 'Left Hemisphere',
    alchemicalOperation: 'Coagulatio',
    meaning: 'Grounding, crystallizing, manifesting energy (with line - direct/active)',
    process: 'Mission → Means → Medicine',
  },
  air: {
    houses: [7, 11, 3],
    symbol: '△—',
    hemisphere: 'Left Hemisphere',
    alchemicalOperation: 'Sublimatio',
    meaning: 'Communicative, connecting, circulating energy (with line - direct/active)',
    process: 'Connection → Community → Consciousness',
  },
} as const;
