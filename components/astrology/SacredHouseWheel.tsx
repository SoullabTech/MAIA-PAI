'use client';

/**
 * Sacred House Wheel - The 12 Houses as Living Mandala
 *
 * Slow rotation, not spin. Each house glows with its ruling element.
 * Aspect patterns appear as sacred geometry on hover - discovered, not displayed.
 *
 * Philosophy:
 * - The wheel breathes (30-second rotation)
 * - Houses pulse with elemental light
 * - Planets appear as constellation points
 * - Aspects draw themselves on hover (sacred geometry revealed)
 */

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Planet {
  name: string;
  sign: string;
  house: number;
  degree: number;
}

interface Aspect {
  planet1: string;
  planet2: string;
  type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
  orb: number;
}

interface SacredHouseWheelProps {
  planets?: Planet[];
  aspects?: Aspect[];
  isDayMode?: boolean;
  showAspects?: boolean;
  className?: string;
}

// Spiralogic Spiral Order - Clockwise from 12 o'clock like a clock face
// Fire quadrant (12:00-3:00) → Water (3:00-6:00) → Earth (6:00-9:00) → Air (9:00-12:00)
// Each position = 30° segment (one "hour" on clock). Process map for consciousness.
const spiralogicOrder = [
  1,   // Pos 0 (12-1:00): H1 Aries ♈ Fire-1 | Identity/Self-Awareness/Initiative | Calcinatio begins
  5,   // Pos 1 (1-2:00): H5 Leo ♌ Fire-2 | Creativity/Joy/Expression | Calcinatio deepens
  9,   // Pos 2 (2-3:00): H9 Sagittarius ♐ Fire-3 | Philosophy/Expansion/Synthesis | Calcinatio integrates
  4,   // Pos 3 (3-4:00): H4 Cancer ♋ Water-1 | Home/Roots/Foundation | Solutio begins
  8,   // Pos 4 (4-5:00): H8 Scorpio ♏ Water-2 | Transformation/Intimacy/Depth | Solutio deepens
  12,  // Pos 5 (5-6:00): H12 Pisces ♓ Water-3 | Spirituality/Dissolution/Unity | Solutio completes
  10,  // Pos 6 (6-7:00): H10 Capricorn ♑ Earth-1 | Career/Legacy/Structure | Coagulatio begins
  2,   // Pos 7 (7-8:00): H2 Taurus ♉ Earth-2 | Resources/Values/Embodiment | Coagulatio deepens
  6,   // Pos 8 (8-9:00): H6 Virgo ♍ Earth-3 | Service/Health/Refinement | Coagulatio integrates
  7,   // Pos 9 (9-10:00): H7 Libra ♎ Air-1 | Relationships/Other/Balance | Sublimatio begins
  11,  // Pos 10 (10-11:00): H11 Aquarius ♒ Air-2 | Community/Vision/Innovation | Sublimatio deepens
  3,   // Pos 11 (11-12:00): H3 Gemini ♊ Air-3 | Communication/Learning/Connection | Sublimatio returns
];

// House-element mapping (Spiralogic system)
const houseElements = {
  1: 'fire',    // Identity
  2: 'earth',   // Resources
  3: 'air',     // Communication
  4: 'water',   // Home
  5: 'fire',    // Creativity
  6: 'earth',   // Service
  7: 'air',     // Partnership
  8: 'water',   // Transformation
  9: 'fire',    // Expansion
  10: 'earth',  // Career
  11: 'air',    // Community
  12: 'water',  // Transcendence
};

// Elemental colors
const elementalColors = {
  fire: { day: '#C85450', night: '#F5A362', glow: 'rgba(200, 84, 80, 0.4)' },
  water: { day: '#6B9BD1', night: '#8BADD6', glow: 'rgba(107, 155, 209, 0.4)' },
  earth: { day: '#7A9A65', night: '#A8C69F', glow: 'rgba(122, 154, 101, 0.4)' },
  air: { day: '#D4B896', night: '#E8D4BF', glow: 'rgba(212, 184, 150, 0.4)' },
};

// Aspect geometry (angles in degrees)
const aspectAngles = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180,
};

// Aspect colors for sacred geometry
const aspectColors = {
  conjunction: '#F59E0B',  // Amber - union
  sextile: '#10B981',      // Green - harmony
  square: '#EF4444',       // Red - tension
  trine: '#3B82F6',        // Blue - flow
  opposition: '#8B5CF6',   // Purple - polarity
};

export function SacredHouseWheel({
  planets = [],
  aspects = [],
  isDayMode = true,
  showAspects = false,
  className = '',
}: SacredHouseWheelProps) {
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [revealedAspects, setRevealedAspects] = useState(false);
  const controls = useAnimation();

  // Slow eternal rotation (30 seconds per full cycle)
  useEffect(() => {
    controls.start({
      rotate: 360,
      transition: {
        duration: 30,
        repeat: Infinity,
        ease: 'linear',
      },
    });
  }, [controls]);

  // Calculate position on wheel for a given house (1-12)
  // Uses Spiralogic spiral order for positioning
  const getHousePosition = (house: number) => {
    // Find position in spiral order
    const spiralIndex = spiralogicOrder.indexOf(house);
    // Start at top (12 o'clock) and go clockwise
    const angle = (spiralIndex * 30 - 90) * (Math.PI / 180);
    const radius = 140;
    return {
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle),
    };
  };

  // Calculate planet position (more precise, based on degree within house)
  // Uses Spiralogic spiral order for positioning
  const getPlanetPosition = (planet: Planet) => {
    // Find house position in spiral order
    const spiralIndex = spiralogicOrder.indexOf(planet.house);
    const houseStartAngle = spiralIndex * 30;
    const planetAngle = (houseStartAngle + (planet.degree % 30)) - 90;
    const angle = planetAngle * (Math.PI / 180);
    const radius = 120;
    return {
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle),
    };
  };

  // Draw aspect line between two planets
  const drawAspectLine = (planet1: Planet, planet2: Planet, aspect: Aspect) => {
    const pos1 = getPlanetPosition(planet1);
    const pos2 = getPlanetPosition(planet2);

    return (
      <motion.line
        key={`${planet1.name}-${planet2.name}`}
        x1={pos1.x}
        y1={pos1.y}
        x2={pos2.x}
        y2={pos2.y}
        stroke={aspectColors[aspect.type]}
        strokeWidth={aspect.orb < 2 ? 2 : 1}
        strokeOpacity={aspect.orb < 2 ? 0.8 : 0.5}
        strokeDasharray={aspect.type === 'square' ? '4,4' : aspect.type === 'opposition' ? '8,4' : '0'}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    );
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        className="w-full h-full"
        onMouseEnter={() => setRevealedAspects(true)}
        onMouseLeave={() => setRevealedAspects(false)}
      >
        {/* Central point - the self */}
        <circle
          cx="200"
          cy="200"
          r="4"
          fill={isDayMode ? '#78716c' : '#d6d3d1'}
          opacity="0.6"
        />

        {/* Outer wheel circle */}
        <circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke={isDayMode ? '#e7e5e4' : '#292524'}
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Inner wheel circle */}
        <circle
          cx="200"
          cy="200"
          r="100"
          fill="none"
          stroke={isDayMode ? '#e7e5e4' : '#292524'}
          strokeWidth="1"
          opacity="0.2"
        />

        {/* 12 House segments - Spiralogic spiral order, clockwise */}
        <motion.g animate={controls}>
          {spiralogicOrder.map((house, i) => {
            const element = houseElements[house as keyof typeof houseElements] as keyof typeof elementalColors;
            const elementColor = elementalColors[element];
            const color = isDayMode ? elementColor.day : elementColor.night;
            // Position i determines visual placement (0-11), house number stays as label
            const startAngle = (i * 30 - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);

            // Arc path for house segment
            const innerRadius = 100;
            const outerRadius = 160;
            const largeArcFlag = 0;

            const x1 = 200 + innerRadius * Math.cos(startAngle);
            const y1 = 200 + innerRadius * Math.sin(startAngle);
            const x2 = 200 + outerRadius * Math.cos(startAngle);
            const y2 = 200 + outerRadius * Math.sin(startAngle);
            const x3 = 200 + outerRadius * Math.cos(endAngle);
            const y3 = 200 + outerRadius * Math.sin(endAngle);
            const x4 = 200 + innerRadius * Math.cos(endAngle);
            const y4 = 200 + innerRadius * Math.sin(endAngle);

            const pathData = `
              M ${x1} ${y1}
              L ${x2} ${y2}
              A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
              L ${x4} ${y4}
              A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}
              Z
            `;

            return (
              <g key={house}>
                {/* House segment */}
                <path
                  d={pathData}
                  fill={color}
                  fillOpacity={hoveredHouse === house ? 0.3 : 0.1}
                  stroke={color}
                  strokeWidth="1"
                  strokeOpacity={hoveredHouse === house ? 0.6 : 0.2}
                  onMouseEnter={() => setHoveredHouse(house)}
                  onMouseLeave={() => setHoveredHouse(null)}
                  className="cursor-pointer transition-all duration-500"
                  style={{
                    filter: hoveredHouse === house
                      ? `drop-shadow(0 0 8px ${elementColor.glow})`
                      : 'none',
                  }}
                />

                {/* House number */}
                <text
                  x={200 + 130 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                  y={200 + 130 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180))}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={color}
                  fillOpacity={hoveredHouse === house ? 0.9 : 0.5}
                  fontSize="12"
                  fontFamily="serif"
                  className="transition-all duration-500 pointer-events-none"
                >
                  {house}
                </text>

                {/* Elemental glow pulse */}
                {hoveredHouse === house && (
                  <motion.circle
                    cx={200 + 130 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                    cy={200 + 130 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180))}
                    r="20"
                    fill={color}
                    fillOpacity="0.1"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </g>
            );
          })}
        </motion.g>

        {/* Aspect lines - sacred geometry revealed on hover */}
        {revealedAspects && aspects.length > 0 && (
          <g opacity="0.6">
            {aspects.map((aspect) => {
              const planet1 = planets.find(p => p.name === aspect.planet1);
              const planet2 = planets.find(p => p.name === aspect.planet2);
              if (planet1 && planet2) {
                return drawAspectLine(planet1, planet2, aspect);
              }
              return null;
            })}
          </g>
        )}

        {/* Planets as constellation points - static (not rotating) */}
        {planets.map((planet) => {
          const pos = getPlanetPosition(planet);
          const element = houseElements[planet.house as keyof typeof houseElements] as keyof typeof elementalColors;
          const color = elementalColors[element][isDayMode ? 'day' : 'night'];

          return (
            <g key={planet.name}>
              {/* Planet glow */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="8"
                fill={color}
                fillOpacity="0.3"
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Planet point */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="3"
                fill={color}
                className="cursor-pointer"
              />
              {/* Planet name on hover */}
              <title>{planet.name} in {planet.sign} (House {planet.house})</title>
            </g>
          );
        })}

        {/* Horizon line (Ascendant-Descendant) */}
        <line
          x1="40"
          y1="200"
          x2="360"
          y2="200"
          stroke={isDayMode ? '#a8a29e' : '#57534e'}
          strokeWidth="1"
          strokeOpacity="0.3"
          strokeDasharray="4,4"
        />

        {/* Meridian line (MC-IC) */}
        <line
          x1="200"
          y1="40"
          x2="200"
          y2="360"
          stroke={isDayMode ? '#a8a29e' : '#57534e'}
          strokeWidth="1"
          strokeOpacity="0.3"
          strokeDasharray="4,4"
        />
      </svg>

      {/* Legend - appears on aspect reveal */}
      {revealedAspects && aspects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-xs text-center space-y-1"
        >
          <p className={`${isDayMode ? 'text-stone-600' : 'text-stone-400'} font-serif italic`}>
            Sacred geometry revealed
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {Object.entries(aspectColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1">
                <div
                  className="w-3 h-0.5"
                  style={{ background: color }}
                />
                <span className={isDayMode ? 'text-stone-600' : 'text-stone-400'}>
                  {type}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
