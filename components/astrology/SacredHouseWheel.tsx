'use client';

/**
 * Sacred House Wheel - The 12 Houses as Living Mandala
 *
 * Now with integrated neuroscience-consciousness mapping.
 * Each house is a phase of consciousness, a neuronal node in the cortical map.
 *
 * Myth meeting neurobiology - cognitive cartography.
 *
 * Philosophy:
 * - The wheel breathes (30-second rotation)
 * - Houses pulse with elemental light as neural activation
 * - Planets appear as constellation points
 * - Aspects draw themselves on hover (sacred geometry revealed)
 * - Center point = Aether = Neural hub integration
 */

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getSpiralogicPhase, SPIRALOGIC_SPIRAL_ORDER } from '@/lib/astrology/neuroscienceMapping';

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
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
  const [revealedAspects, setRevealedAspects] = useState(false);
  const controls = useAnimation();

  // Static wheel - archetypal positions are sacred and fixed
  useEffect(() => {
    controls.start({
      rotate: 0,
      transition: {
        duration: 0,
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

  // Calculate planet position by HOUSE NUMBER on the Spiralogic wheel
  // This is a PROCESS map - planets appear where their house sits in the spiral
  // NOT by zodiac sign position
  const getPlanetPosition = (planet: Planet) => {
    // Find where this HOUSE NUMBER appears in the Spiralogic spiral
    const spiralIndex = spiralogicOrder.indexOf(planet.house);
    if (spiralIndex === -1) {
      console.warn(`House ${planet.house} not found in spiral order`);
      return { x: 200, y: 200 }; // Center if unknown
    }

    // Each position occupies 30° on the wheel (like hours on a clock)
    const positionStartAngle = spiralIndex * 30;

    // Position planet within the 30° segment based on its degree within sign
    const degreeWithinSign = planet.degree % 30;
    const planetAngle = positionStartAngle + degreeWithinSign - 90; // -90 to start at 12 o'clock

    const angle = planetAngle * (Math.PI / 180);
    const radius = 165; // Just outside the house ring
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
        {/* Central point - AETHER - The still center, non-dual awareness */}
        {/* Slow breathing pulse - 12s cycle (brain's resting rhythm) */}
        <motion.circle
          cx="200"
          cy="200"
          r="8"
          fill="white"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.5))'
          }}
        />
        <circle
          cx="200"
          cy="200"
          r="3"
          fill={isDayMode ? '#fef3c7' : '#fef3c7'}
          opacity="0.9"
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

            // Find planets in this house
            const planetsInHouse = planets.filter(p => p.house === house);

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
                {/* House segment - breathing with elemental rhythm */}
                <motion.path
                  d={pathData}
                  fill={color}
                  fillOpacity={hoveredHouse === house ? 0.3 : 0.1}
                  stroke={color}
                  strokeWidth="1"
                  strokeOpacity={hoveredHouse === house ? 0.6 : 0.2}
                  onMouseEnter={() => setHoveredHouse(house)}
                  onMouseLeave={() => setHoveredHouse(null)}
                  className="cursor-pointer"
                  style={{
                    filter: hoveredHouse === house
                      ? `drop-shadow(0 0 8px ${elementColor.glow})`
                      : 'none',
                  }}
                  // Subtle breathing - different timing per element
                  animate={{
                    fillOpacity: hoveredHouse === house
                      ? [0.3, 0.4, 0.3]
                      : [0.1, 0.15, 0.1],
                  }}
                  transition={{
                    duration: element === 'fire' ? 6 : element === 'water' ? 8 : element === 'earth' ? 10 : 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.5, // Stagger the breathing
                  }}
                />

                {/* House number - clearly visible coordinate */}
                <text
                  x={200 + 130 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                  y={200 + 130 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180))}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={color}
                  fillOpacity={hoveredHouse === house ? 0.9 : 0.6}
                  fontSize="14"
                  fontWeight="400"
                  fontFamily="serif"
                  className="transition-all duration-500 pointer-events-none"
                >
                  {house}
                </text>

                {/* Elemental phase label - subtle arc along inner rim */}
                <text
                  x={200 + 120 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                  y={200 + 120 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180))}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={color}
                  fillOpacity={hoveredHouse === house ? 0.8 : 0.4}
                  fontSize="8"
                  fontWeight="300"
                  fontFamily="serif"
                  className="transition-all duration-500 pointer-events-none"
                  style={{
                    letterSpacing: '0.05em'
                  }}
                >
                  {getSpiralogicPhase(house).label}
                </text>

                {/* Planets in this house - show as text labels */}
                {planetsInHouse.length > 0 && (
                  <text
                    x={200 + 115 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                    y={200 + 115 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180))}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={color}
                    fillOpacity={0.8}
                    fontSize="9"
                    fontFamily="serif"
                    className="pointer-events-none"
                  >
                    {planetsInHouse.map(p => {
                      // Abbreviate planet names
                      const abbrev = p.name === 'North Node' ? 'NN' :
                                    p.name === 'South Node' ? 'SN' :
                                    p.name.substring(0, 2);
                      return abbrev;
                    }).join(' ')}
                  </text>
                )}

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
            <g
              key={planet.name}
              onMouseEnter={() => setHoveredPlanet(planet)}
              onMouseLeave={() => setHoveredPlanet(null)}
              className="cursor-pointer"
            >
              {/* Planet glow - FIXED SIZE to prevent vibration */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="10"
                fill={color}
                fillOpacity={hoveredPlanet?.name === planet.name ? "0.6" : "0.3"}
                className="transition-opacity duration-300"
                style={{
                  filter: hoveredPlanet?.name === planet.name
                    ? `drop-shadow(0 0 8px ${color})`
                    : 'none'
                }}
              />
              {/* Planet core - FIXED SIZE */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="4"
                fill={color}
                fillOpacity={hoveredPlanet?.name === planet.name ? "1" : "0.8"}
                className="transition-opacity duration-300"
              />
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

      {/* House Overlay - Mythic Phase Description */}
      {/* Slow reveal - Lynch principle: "When you slow down things are more beautiful" */}
      {hoveredHouse !== null && (() => {
        const phase = getSpiralogicPhase(hoveredHouse);
        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} // Slow, generous timing
            className={`mt-4 p-5 rounded-lg ${
              isDayMode
                ? 'bg-stone-100/90 border border-stone-300'
                : 'bg-stone-900/90 border border-stone-700/50'
            }`}
            style={{
              backdropFilter: 'blur(8px)',
              boxShadow: isDayMode ? '0 4px 20px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.4)'
            }}
          >
            {/* Title arrives first */}
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-lg font-serif mb-3 ${isDayMode ? 'text-stone-900' : 'text-orange-200'}`}
            >
              {phase.label} {phase.emoji} · {phase.spiralogicTheme}
            </motion.h3>

            {/* Mythic line arrives second - the breath after */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`text-sm font-serif italic mb-3 leading-relaxed ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}
            >
              {phase.mythicLine}
            </motion.p>

            {/* Description arrives third - the insight */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className={`text-sm leading-relaxed ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}
            >
              {phase.description}
            </motion.p>

            {/* Invitation arrives last - gently */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className={`text-xs mt-3 italic ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}
            >
              {phase.invitation}
            </motion.p>
          </motion.div>
        );
      })()}

      {/* Planet Overlay - Archetypal Description */}
      {hoveredPlanet && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg ${
            isDayMode
              ? 'bg-stone-100 border border-stone-300'
              : 'bg-stone-900 border border-stone-700'
          }`}
        >
          <h3 className={`text-lg font-serif mb-2 ${isDayMode ? 'text-stone-900' : 'text-orange-200'}`}>
            {hoveredPlanet.name} in {hoveredPlanet.sign}
          </h3>
          <p className={`text-sm font-serif italic mb-2 ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
            House {hoveredPlanet.house} · {hoveredPlanet.degree.toFixed(1)}°
          </p>
          <p className={`text-sm ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
            {hoveredPlanet.name === 'Sun' && 'Your conscious identity, life force, and creative essence. Where you shine and express your unique being.'}
            {hoveredPlanet.name === 'Moon' && 'Your emotional nature, inner world, and instinctive responses. How you nurture and need to be nurtured.'}
            {hoveredPlanet.name === 'Mercury' && 'Your mind, communication style, and how you process information. The messenger between worlds.'}
            {hoveredPlanet.name === 'Venus' && 'Your values, aesthetic sense, and capacity for relationship. What you love and how you attract.'}
            {hoveredPlanet.name === 'Mars' && 'Your drive, desire, and assertive force. How you take action and pursue what you want.'}
            {hoveredPlanet.name === 'Jupiter' && 'Your quest for meaning, expansion, and wisdom. Where you find faith and abundance.'}
            {hoveredPlanet.name === 'Saturn' && 'Your discipline, structure, and life lessons. Where you build mastery through time and commitment.'}
            {hoveredPlanet.name === 'Uranus' && 'Your revolutionary spirit, intuition, and unique genius. Where you break free and innovate.'}
            {hoveredPlanet.name === 'Neptune' && 'Your imagination, dreams, and connection to the infinite. Where boundaries dissolve into unity.'}
            {hoveredPlanet.name === 'Pluto' && 'Your power to transform, regenerate, and touch the depths. Where you undergo soul-level metamorphosis.'}
            {hoveredPlanet.name === 'Chiron' && 'The wounded healer. Your deepest wound that becomes your greatest gift to others.'}
            {hoveredPlanet.name === 'North Node' && 'Your evolutionary direction. The soul\'s calling toward growth and future potential.'}
            {hoveredPlanet.name === 'South Node' && 'Your karmic past. Gifts and patterns carried from previous experiences.'}
          </p>
        </motion.div>
      )}

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
