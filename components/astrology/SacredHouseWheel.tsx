'use client';

/**
 * Sacred House Wheel - Soul-Centric Field Instrument
 *
 * A living cross-section of consciousness in motion.
 * Houses are FIXED stations (not spinning gears) - stable consciousness states.
 * Motion = field currents, not mechanical rotation.
 *
 * Soul-Centric Design Principles:
 * - Nothing orbits the center; all movement passes THROUGH it
 * - Rotation = mechanistic time | Flow = living process | Stillness = witness consciousness
 * - The wheel doesn't move FOR you; it thinks WITH you
 *
 * Neuroscience Integration:
 * 🔥 FIRE (Right PFC) - Vision & Projection: Experience → Expression → Expansion
 * 💧 WATER (Right Hemisphere) - Deep Introspection: Heart → Healing → Holiness
 * 🌍 EARTH (Left Hemisphere) - Grounded Creativity: Mission → Means → Medicine
 * 💨 AIR (Left PFC) - Communication: Connection → Community → Consciousness
 * ✨ AETHER (Center) - The Unmoved Witness (absolute stillness)
 *
 * Field Dynamics:
 * - Outer rim: Subtle elemental current (Fire→Water→Earth→Air gradient sweep)
 * - Inner field: Slow logarithmic spiral pulse (12-15s breathing cycle)
 * - House resonance: Element-specific tempos on hover
 * - Aspects: Field currents converging through Aether center (not around it)
 * - All motion: Easing like breath (sine-in-out), meditative, seamless loops
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { getSpiralogicHouseData } from '@/lib/astrology/spiralogicHouseMapping';
import { getZodiacArchetype } from '@/lib/astrology/archetypeLibrary';
import { getPlanetaryArchetype } from '@/lib/astrology/spiralogicMapping';
import { AlchemicalSymbol } from './AlchemicalSymbols';

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

// Spiralogic Spiral Order - Clockwise from top
// Fire (1-3) → Water (4-6) → Earth (7-9) → Air (10-12)
// Houses maintain their traditional numbers but flow in elemental spiral
const spiralogicOrder = [
  1,   // Fire 1 - Identity/Self
  5,   // Fire 2 - Creativity/Joy
  9,   // Fire 3 - Philosophy/Expansion
  4,   // Water 1 - Home/Roots
  8,   // Water 2 - Transformation/Intimacy
  12,  // Water 3 - Spirituality/Dissolution
  10,  // Earth 1 - Career/Legacy
  2,   // Earth 2 - Resources/Values
  6,   // Earth 3 - Service/Health
  7,   // Air 1 - Relationships/Other
  11,  // Air 2 - Community/Vision
  3,   // Air 3 - Communication/Learning
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

// Neuroscience Integration: Brain-Consciousness-Element Mapping
const houseStates = {
  // FIRE - Right Prefrontal Cortex (Vision & Projection)
  1: { symbol: '🔥', phase: 'Experience', brain: 'Right PFC' },      // Aries - Identity
  5: { symbol: '🔥', phase: 'Expression', brain: 'Right PFC' },      // Leo - Creativity
  9: { symbol: '🔥', phase: 'Expansion', brain: 'Right PFC' },       // Sagittarius - Philosophy

  // WATER - Right Hemisphere (Deep Introspection)
  4: { symbol: '💧', phase: 'Heart', brain: 'Right Hemisphere' },    // Cancer - Home
  8: { symbol: '💧', phase: 'Healing', brain: 'Right Hemisphere' },  // Scorpio - Transformation
  12: { symbol: '💧', phase: 'Holiness', brain: 'Right Hemisphere' }, // Pisces - Transcendence

  // EARTH - Left Hemisphere (Grounded Creativity)
  10: { symbol: '🌍', phase: 'Mission', brain: 'Left Hemisphere' },  // Capricorn - Career
  2: { symbol: '🌍', phase: 'Means', brain: 'Left Hemisphere' },     // Taurus - Resources
  6: { symbol: '🌍', phase: 'Medicine', brain: 'Left Hemisphere' },  // Virgo - Service

  // AIR - Left Prefrontal Cortex (Communication)
  7: { symbol: '💨', phase: 'Connection', brain: 'Left PFC' },       // Libra - Partnership
  11: { symbol: '💨', phase: 'Community', brain: 'Left PFC' },       // Aquarius - Vision
  3: { symbol: '💨', phase: 'Consciousness', brain: 'Left PFC' },    // Gemini - Communication
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
  const [showSacredGeometry, setShowSacredGeometry] = useState(true); // Fremen alchemist mode

  // Wheel is fixed - no rotation (consciousness states are stable)

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

  // FIELD DYNAMICS 4: Draw aspect as field current through Aether center
  // All currents converge on the unmoved witness (nothing orbits, everything passes through)
  const drawAspectLine = (planet1: Planet, planet2: Planet, aspect: Aspect) => {
    const pos1 = getPlanetPosition(planet1);
    const pos2 = getPlanetPosition(planet2);
    const center = { x: 200, y: 200 }; // Aether node

    // Create Bezier path through center
    const controlX = center.x + (Math.random() - 0.5) * 10; // Slight variation
    const controlY = center.y + (Math.random() - 0.5) * 10;

    const pathData = `M ${pos1.x},${pos1.y} Q ${controlX},${controlY} ${center.x},${center.y} T ${pos2.x},${pos2.y}`;

    return (
      <motion.path
        key={`${planet1.name}-${planet2.name}`}
        d={pathData}
        fill="none"
        stroke={aspectColors[aspect.type]}
        strokeWidth={aspect.orb < 2 ? 2 : 1}
        strokeOpacity={aspect.orb < 2 ? 0.6 : 0.3}
        strokeDasharray={aspect.type === 'square' ? '4,4' : aspect.type === 'opposition' ? '8,4' : '0'}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
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
        {/* Central point - AETHER (Transcendent Self) */}
        <g>
          <text
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="20"
            opacity="0.8"
            style={{ userSelect: 'none' }}
          >
            ✨
          </text>
        </g>

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

        {/* FIELD DYNAMICS 1: Outer Rim Elemental Current */}
        {/* Subtle aurora-like gradient sweep showing Fire→Water→Earth→Air flow */}
        <defs>
          <linearGradient id="elementalCurrent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={elementalColors.fire.night} stopOpacity="0.15" />
            <stop offset="25%" stopColor={elementalColors.water.night} stopOpacity="0.15" />
            <stop offset="50%" stopColor={elementalColors.earth.night} stopOpacity="0.15" />
            <stop offset="75%" stopColor={elementalColors.air.night} stopOpacity="0.15" />
            <stop offset="100%" stopColor={elementalColors.fire.night} stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke="url(#elementalCurrent)"
          strokeWidth="3"
          strokeDasharray="10 5"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -1000 }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
          opacity="0.4"
        />

        {/* FIELD DYNAMICS 2: Spiral Swirling from Aether Center */}
        {/* Golden ratio logarithmic spiral emanating from center */}
        <motion.path
          d={(() => {
            // Generate logarithmic spiral path (golden ratio)
            const points: string[] = [];
            const a = 1; // Starting radius
            const b = 0.306; // Growth rate (golden ratio spiral)
            const center = { x: 200, y: 200 };

            for (let theta = 0; theta < 6 * Math.PI; theta += 0.15) {
              const r = a * Math.exp(b * theta);
              const x = center.x + r * Math.cos(theta);
              const y = center.y + r * Math.sin(theta);
              points.push(theta === 0 ? `M ${x},${y}` : `L ${x},${y}`);
            }

            return points.join(' ');
          })()}
          fill="none"
          stroke={isDayMode ? '#9B8FAA' : '#8B5CF6'}
          strokeWidth="1.5"
          opacity="0.3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0, 0.4, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Secondary counter-rotating spiral */}
        <motion.path
          d={(() => {
            const points: string[] = [];
            const a = 1;
            const b = 0.306;
            const center = { x: 200, y: 200 };

            for (let theta = 0; theta < 6 * Math.PI; theta += 0.15) {
              const r = a * Math.exp(b * theta);
              // Negative theta for counter-rotation
              const x = center.x + r * Math.cos(-theta);
              const y = center.y + r * Math.sin(-theta);
              points.push(theta === 0 ? `M ${x},${y}` : `L ${x},${y}`);
            }

            return points.join(' ');
          })()}
          fill="none"
          stroke={isDayMode ? '#C85450' : '#F5A362'}
          strokeWidth="1"
          opacity="0.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* SACRED GEOMETRY LAYER - Fremen Alchemist's Cosmology */}
        {showSacredGeometry && (
          <g opacity="0.25">
            {/* DODECAHEDRON - The Soul's Geometry (5th element, Aether) */}
            {/* 2D projection of dodecahedron embracing the holoflower */}
            <g>
              {/* Outer pentagon */}
              <motion.polygon
                points={[...Array(5)].map((_, i) => {
                  const angle = (i * 72 - 90) * (Math.PI / 180);
                  const x = 200 + 45 * Math.cos(angle);
                  const y = 200 + 45 * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{ duration: 2, ease: 'easeOut' }}
                style={{ transformOrigin: '200px 200px' }}
              />

              {/* Inner pentagon (rotated) */}
              <motion.polygon
                points={[...Array(5)].map((_, i) => {
                  const angle = (i * 72 - 90 + 36) * (Math.PI / 180); // 36° rotation
                  const x = 200 + 30 * Math.cos(angle);
                  const y = 200 + 30 * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.4 }}
                transition={{ duration: 2, delay: 0.2, ease: 'easeOut' }}
                style={{ transformOrigin: '200px 200px' }}
              />

              {/* Connecting lines showing 3D depth */}
              {[...Array(5)].map((_, i) => {
                const angle1 = (i * 72 - 90) * (Math.PI / 180);
                const angle2 = (i * 72 - 90 + 36) * (Math.PI / 180);
                const x1 = 200 + 45 * Math.cos(angle1);
                const y1 = 200 + 45 * Math.sin(angle1);
                const x2 = 200 + 30 * Math.cos(angle2);
                const y2 = 200 + 30 * Math.sin(angle2);
                return (
                  <motion.line
                    key={`dodeca-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#D4AF37"
                    strokeWidth="0.8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1.5, delay: 0.4 + i * 0.1 }}
                  />
                );
              })}

              {/* Center star (pentagram showing quintessence) */}
              <motion.path
                d={(() => {
                  const points = [...Array(5)].map((_, i) => {
                    const angle = (i * 144 - 90) * (Math.PI / 180); // 144° for pentagram
                    const x = 200 + 20 * Math.cos(angle);
                    const y = 200 + 20 * Math.sin(angle);
                    return `${x},${y}`;
                  });
                  return `M ${points[0]} L ${points[1]} L ${points[2]} L ${points[3]} L ${points[4]} Z`;
                })()}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.1, 1],
                  opacity: [0, 0.6, 0.45]
                }}
                transition={{ duration: 2, delay: 0.8 }}
                style={{ transformOrigin: '200px 200px' }}
              />
            </g>

            {/* Seed of Life - 7 circles at center (source pattern) */}
            <circle cx="200" cy="200" r="15" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            {[...Array(6)].map((_, i) => {
              const angle = (i * 60) * (Math.PI / 180);
              const x = 200 + 15 * Math.cos(angle);
              const y = 200 + 15 * Math.sin(angle);
              return (
                <circle key={`seed-${i}`} cx={x} cy={y} r="15" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
              );
            })}

            {/* Nested Polygons - Harmonic Divisions */}
            {/* Dodecagon (12) - outer */}
            <motion.polygon
              points={[...Array(12)].map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = 200 + 155 * Math.cos(angle);
                const y = 200 + 155 * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1"
              strokeDasharray="4,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 2 }}
            />

            {/* Hexagon (6) - mid */}
            <motion.polygon
              points={[...Array(6)].map((_, i) => {
                const angle = (i * 60 - 90) * (Math.PI / 180);
                const x = 200 + 130 * Math.cos(angle);
                const y = 200 + 130 * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1"
              strokeDasharray="3,3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ duration: 2, delay: 0.3 }}
            />

            {/* Square (4) - inner */}
            <motion.polygon
              points={[...Array(4)].map((_, i) => {
                const angle = (i * 90 - 45) * (Math.PI / 180);
                const x = 200 + 90 * Math.cos(angle);
                const y = 200 + 90 * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1"
              strokeDasharray="2,2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 2, delay: 0.6 }}
            />

            {/* Upward Triangle (3) - core */}
            <motion.polygon
              points="200,140 230,180 170,180"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ duration: 2, delay: 0.9 }}
            />

            {/* Metatron's Cube - Connecting all 12 house centers */}
            {spiralogicOrder.map((house1, i) => {
              const pos1 = getHousePosition(house1);
              return spiralogicOrder.slice(i + 1).map((house2, j) => {
                const pos2 = getHousePosition(house2);
                return (
                  <line
                    key={`metatron-${house1}-${house2}`}
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    stroke="#D4AF37"
                    strokeWidth="0.3"
                    opacity="0.15"
                  />
                );
              });
            })}

            {/* Elemental Trigrams - Perfect triangles connecting same-element houses */}
            {/* Fire Triangle (Houses 1, 5, 9) */}
            <motion.polygon
              points={[1, 5, 9].map(h => {
                const pos = getHousePosition(h);
                return `${pos.x},${pos.y}`;
              }).join(' ')}
              fill="none"
              stroke={elementalColors.fire.night}
              strokeWidth="1.5"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 3, delay: 1 }}
            />

            {/* Water Triangle (Houses 4, 8, 12) */}
            <motion.polygon
              points={[4, 8, 12].map(h => {
                const pos = getHousePosition(h);
                return `${pos.x},${pos.y}`;
              }).join(' ')}
              fill="none"
              stroke={elementalColors.water.night}
              strokeWidth="1.5"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 3, delay: 1.3 }}
            />

            {/* Earth Triangle (Houses 10, 2, 6) */}
            <motion.polygon
              points={[10, 2, 6].map(h => {
                const pos = getHousePosition(h);
                return `${pos.x},${pos.y}`;
              }).join(' ')}
              fill="none"
              stroke={elementalColors.earth.night}
              strokeWidth="1.5"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 3, delay: 1.6 }}
            />

            {/* Air Triangle (Houses 7, 11, 3) */}
            <motion.polygon
              points={[7, 11, 3].map(h => {
                const pos = getHousePosition(h);
                return `${pos.x},${pos.y}`;
              }).join(' ')}
              fill="none"
              stroke={elementalColors.air.night}
              strokeWidth="1.5"
              strokeDasharray="5,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 3, delay: 1.9 }}
            />
          </g>
        )}

        {/* 12 House segments - Spiralogic spiral order, clockwise */}
        <g>
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
                  fillOpacity={hoveredHouse === house ? 0.6 : 0.35}
                  stroke={color}
                  strokeWidth="2"
                  strokeOpacity={hoveredHouse === house ? 0.9 : 0.5}
                  onMouseEnter={() => setHoveredHouse(house)}
                  onMouseLeave={() => setHoveredHouse(null)}
                  className="cursor-pointer transition-all duration-500"
                  style={{
                    filter: hoveredHouse === house
                      ? `drop-shadow(0 0 8px ${elementColor.glow})`
                      : 'none',
                  }}
                />

                {/* Alchemical elemental symbol at inner radius */}
                <foreignObject
                  x={200 + 85 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180)) - 12}
                  y={200 + 85 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180)) - 12}
                  width="24"
                  height="24"
                  className="pointer-events-none"
                >
                  <AlchemicalSymbol
                    element={element}
                    size={24}
                    color={color}
                    opacity={hoveredHouse === house ? 1.0 : 0.6}
                  />
                </foreignObject>

                {/* Consciousness phase/state */}
                <text
                  x={200 + 170 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                  y={200 + 170 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180)) + 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={color}
                  fillOpacity={hoveredHouse === house ? 1.0 : 0.8}
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="system-ui"
                  className="transition-all duration-500 pointer-events-none uppercase tracking-wide"
                >
                  {houseStates[house as keyof typeof houseStates].phase}
                </text>

                {/* House number at lower radius (smaller) */}
                <text
                  x={200 + 110 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                  y={200 + 110 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180))}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={color}
                  fillOpacity={hoveredHouse === house ? 0.9 : 0.6}
                  fontSize="10"
                  fontWeight="400"
                  fontFamily="serif"
                  className="transition-all duration-500 pointer-events-none"
                >
                  {house}
                </text>

                {/* FIELD DYNAMICS 3: House Resonance Cues (Element-Specific Tempos) */}
                {hoveredHouse === house && (
                  <>
                    {/* Fire: Fast flicker (kinetic) */}
                    {element === 'fire' && (
                      <motion.circle
                        cx={200 + 130 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                        cy={200 + 130 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180))}
                        r="25"
                        fill={color}
                        fillOpacity="0.15"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                          scale: [0.8, 1.3, 0.8],
                          opacity: [0, 0.3, 0]
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    )}

                    {/* Water: Slow undulation (wave) */}
                    {element === 'water' && (
                      <>
                        <motion.circle
                          cx={200 + 130 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                          cy={200 + 130 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180))}
                          r="25"
                          fill={color}
                          fillOpacity="0.08"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{
                            scale: [0.9, 1.5, 0.9],
                            opacity: [0, 0.25, 0]
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                        />
                        <motion.circle
                          cx={200 + 130 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                          cy={200 + 130 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180))}
                          r="20"
                          fill={color}
                          fillOpacity="0.1"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{
                            scale: [0.8, 1.3, 0.8],
                            opacity: [0, 0.2, 0]
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.8
                          }}
                        />
                      </>
                    )}

                    {/* Earth: Grounded glow (steady) */}
                    {element === 'earth' && (
                      <motion.circle
                        cx={200 + 130 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                        cy={200 + 130 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180))}
                        r="22"
                        fill={color}
                        fillOpacity="0.12"
                        initial={{ scale: 1, opacity: 0.1 }}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.1, 0.25, 0.1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    )}

                    {/* Air: Interference pattern (oscillation) */}
                    {element === 'air' && (
                      <>
                        <motion.circle
                          cx={200 + 130 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                          cy={200 + 130 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180))}
                          r="20"
                          fill={color}
                          fillOpacity="0.1"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{
                            scale: [0.9, 1.2, 0.9],
                            opacity: [0, 0.2, 0]
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                        />
                        <motion.circle
                          cx={200 + 130 * Math.cos((i * 30 + 15 - 90) * (Math.PI / 180))}
                          cy={200 + 130 * Math.sin((i * 30 + 15 - 90) * (Math.PI / 180))}
                          r="25"
                          fill={color}
                          fillOpacity="0.08"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{
                            scale: [0.8, 1.3, 0.8],
                            opacity: [0, 0.15, 0]
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.6
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </g>
            );
          })}
        </g>

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
          const isHovered = hoveredPlanet?.name === planet.name;

          return (
            <g
              key={planet.name}
              onMouseEnter={() => setHoveredPlanet(planet)}
              onMouseLeave={() => setHoveredPlanet(null)}
              className="cursor-pointer"
            >
              {/* Planet glow */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 12 : 8}
                fill={color}
                fillOpacity={isHovered ? 0.5 : 0.3}
                initial={{ scale: 0.8 }}
                animate={{ scale: isHovered ? [1, 1.2, 1] : [0.8, 1, 0.8] }}
                transition={{ duration: isHovered ? 1 : 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  filter: isHovered ? `drop-shadow(0 0 8px ${color})` : 'none',
                }}
              />
              {/* Planet point */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 4 : 3}
                fill={color}
                stroke={isHovered ? '#ffffff' : 'none'}
                strokeWidth={isHovered ? 1 : 0}
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

      {/* House Insight Overlay - Elegant futuristic minimal design */}
      <AnimatePresence>
        {hoveredHouse !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-x-0 top-full mt-6 mx-auto max-w-2xl z-50"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className={`backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden ${
                isDayMode
                  ? 'bg-white/80 border-stone-200/60'
                  : 'bg-black/60 border-stone-700/40'
              }`}
              style={{
                boxShadow: isDayMode
                  ? '0 20px 60px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)'
                  : '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.15)',
              }}
            >
              {(() => {
                const element = houseElements[hoveredHouse as keyof typeof houseElements] as keyof typeof elementalColors;
                const elementColor = elementalColors[element];
                const color = isDayMode ? elementColor.day : elementColor.night;
                const spiralogicData = getSpiralogicHouseData(hoveredHouse);
                const planetsInHouse = planets.filter(p => p.house === hoveredHouse);
                const houseState = houseStates[hoveredHouse as keyof typeof houseStates];

                return (
                  <>
                    {/* Header with gradient */}
                    <div
                      className="px-6 py-4 border-b"
                      style={{
                        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                        borderColor: isDayMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                            style={{
                              background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                              boxShadow: `0 0 20px ${elementColor.glow}`,
                            }}
                          >
                            {houseState.symbol}
                          </div>
                          <div>
                            <h3 className={`text-lg font-semibold ${isDayMode ? 'text-stone-900' : 'text-stone-100'}`}>
                              House {hoveredHouse} · {houseState.phase}
                            </h3>
                            <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                              {element.toUpperCase()} · {spiralogicData?.phaseLabel}
                            </p>
                          </div>
                        </div>
                        <div className={`text-xs uppercase tracking-wider font-medium ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                          {houseState.brain}
                        </div>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="p-6 grid grid-cols-2 gap-6">
                      {/* Left Column - Spiralogic Framework */}
                      <div className="space-y-4">
                        <div>
                          <h4 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}>
                            Spiralogic Process
                          </h4>
                          <div className="space-y-2">
                            <div className={`flex items-center gap-2 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                              <span className="text-xs opacity-60">Element</span>
                              <div className="flex-1 border-b border-dotted opacity-20"></div>
                              <span className="text-sm font-medium" style={{ color }}>{element.toUpperCase()}</span>
                            </div>
                            <div className={`flex items-center gap-2 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                              <span className="text-xs opacity-60">Phase</span>
                              <div className="flex-1 border-b border-dotted opacity-20"></div>
                              <span className="text-sm font-medium">{spiralogicData?.phase.toUpperCase()}</span>
                            </div>
                            <div className={`flex items-center gap-2 ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                              <span className="text-xs opacity-60">Facet</span>
                              <div className="flex-1 border-b border-dotted opacity-20"></div>
                              <span className="text-sm font-medium">{spiralogicData?.facet}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}>
                            Consciousness State
                          </h4>
                          <p className={`text-sm leading-relaxed ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                            {spiralogicData?.lesson}
                          </p>
                        </div>
                      </div>

                      {/* Right Column - Planets & Activation */}
                      <div className="space-y-4">
                        <div>
                          <h4 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}>
                            Neural Activation
                          </h4>
                          {planetsInHouse.length > 0 ? (
                            <div className="space-y-2">
                              {planetsInHouse.map((planet, idx) => (
                                <div
                                  key={idx}
                                  className={`px-3 py-2 rounded-lg ${isDayMode ? 'bg-stone-100/60' : 'bg-stone-800/40'}`}
                                >
                                  <div className={`text-sm font-medium ${isDayMode ? 'text-stone-900' : 'text-stone-100'}`}>
                                    {planet.name} in {planet.sign}
                                  </div>
                                  <div className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                                    {planet.degree.toFixed(1)}°
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className={`text-sm italic ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}>
                              No planets currently activating this pathway
                            </p>
                          )}
                        </div>

                        {planetsInHouse.length > 0 && (
                          <div>
                            <h4 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}>
                              Integration Pathway
                            </h4>
                            <p className={`text-xs leading-relaxed ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                              {planetsInHouse.length === 1
                                ? `Single planetary activation - focused development through ${planetsInHouse[0].name} energy`
                                : `Stellium activation - ${planetsInHouse.length} archetypal forces converging in complex dialog`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer - Process Flow Indicator */}
                    <div
                      className={`px-6 py-3 border-t text-center ${isDayMode ? 'bg-stone-50/50' : 'bg-stone-900/30'}`}
                      style={{
                        borderColor: isDayMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                        <span className="opacity-60">Elemental Flow:</span>{' '}
                        <span className="font-medium">
                          {element === 'fire' && 'Experience → Expression → Expansion'}
                          {element === 'water' && 'Heart → Healing → Holiness'}
                          {element === 'earth' && 'Mission → Means → Medicine'}
                          {element === 'air' && 'Connection → Community → Consciousness'}
                        </span>
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* Planetary Insight Overlay - Shows planet/sign/archetype/aspects */}
        {hoveredPlanet !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-x-0 top-full mt-6 mx-auto max-w-2xl z-50"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className={`backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden ${
                isDayMode
                  ? 'bg-white/80 border-stone-200/60'
                  : 'bg-black/60 border-stone-700/40'
              }`}
              style={{
                boxShadow: isDayMode
                  ? '0 20px 60px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)'
                  : '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.15)',
              }}
            >
              {(() => {
                const element = houseElements[hoveredPlanet.house as keyof typeof houseElements] as keyof typeof elementalColors;
                const elementColor = elementalColors[element];
                const color = isDayMode ? elementColor.day : elementColor.night;
                const spiralogicData = getSpiralogicHouseData(hoveredPlanet.house);
                const planetArchetype = getPlanetaryArchetype(hoveredPlanet.name);
                const zodiacArchetype = getZodiacArchetype(hoveredPlanet.sign);
                const planetAspects = aspects.filter(
                  a => a.planet1 === hoveredPlanet.name || a.planet2 === hoveredPlanet.name
                );

                return (
                  <>
                    {/* Header with gradient */}
                    <div
                      className="px-6 py-4 border-b"
                      style={{
                        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                        borderColor: isDayMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                            style={{
                              background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                              boxShadow: `0 0 20px ${elementColor.glow}`,
                            }}
                          >
                            {hoveredPlanet.name === 'Sun' && '☉'}
                            {hoveredPlanet.name === 'Moon' && '☽'}
                            {hoveredPlanet.name === 'Mercury' && '☿'}
                            {hoveredPlanet.name === 'Venus' && '♀'}
                            {hoveredPlanet.name === 'Mars' && '♂'}
                            {hoveredPlanet.name === 'Jupiter' && '♃'}
                            {hoveredPlanet.name === 'Saturn' && '♄'}
                            {hoveredPlanet.name === 'Uranus' && '♅'}
                            {hoveredPlanet.name === 'Neptune' && '♆'}
                            {hoveredPlanet.name === 'Pluto' && '♇'}
                            {hoveredPlanet.name === 'Chiron' && '⚷'}
                            {(hoveredPlanet.name === 'North Node' || hoveredPlanet.name === 'South Node') && '☊'}
                          </div>
                          <div>
                            <h3 className={`text-lg font-semibold ${isDayMode ? 'text-stone-900' : 'text-stone-100'}`}>
                              {hoveredPlanet.name} in {hoveredPlanet.sign}
                            </h3>
                            <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                              {hoveredPlanet.degree.toFixed(1)}° · House {hoveredPlanet.house}
                            </p>
                          </div>
                        </div>
                        <div className={`text-xs uppercase tracking-wider font-medium ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                          {element.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="p-6 grid grid-cols-2 gap-6">
                      {/* Left Column - Planetary Archetype */}
                      <div className="space-y-4">
                        <div>
                          <h4 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}>
                            Planetary Archetype
                          </h4>
                          <p className={`text-sm font-medium mb-2 ${isDayMode ? 'text-stone-900' : 'text-stone-100'}`}>
                            {planetArchetype?.archetype || 'The Guide'}
                          </p>
                          <p className={`text-xs leading-relaxed ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                            {planetArchetype?.description || 'Inner wisdom and guidance'}
                          </p>
                        </div>

                        <div>
                          <h4 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}>
                            Sign Expression
                          </h4>
                          <p className={`text-xs leading-relaxed ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                            {zodiacArchetype?.description || `${hoveredPlanet.name} expresses through ${hoveredPlanet.sign} energy`}
                          </p>
                        </div>
                      </div>

                      {/* Right Column - House Placement & Aspects */}
                      <div className="space-y-4">
                        <div>
                          <h4 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}>
                            House Activation
                          </h4>
                          <p className={`text-sm font-medium mb-1 ${isDayMode ? 'text-stone-900' : 'text-stone-100'}`}>
                            {spiralogicData?.label}
                          </p>
                          <p className={`text-xs leading-relaxed ${isDayMode ? 'text-stone-700' : 'text-stone-300'}`}>
                            {spiralogicData?.lesson}
                          </p>
                        </div>

                        {planetAspects.length > 0 && (
                          <div>
                            <h4 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}>
                              Aspects ({planetAspects.length})
                            </h4>
                            <div className="space-y-1">
                              {planetAspects.slice(0, 3).map((aspect, idx) => {
                                const otherPlanet = aspect.planet1 === hoveredPlanet.name ? aspect.planet2 : aspect.planet1;
                                return (
                                  <div
                                    key={idx}
                                    className={`px-2 py-1 rounded text-xs ${isDayMode ? 'bg-stone-100/60' : 'bg-stone-800/40'}`}
                                  >
                                    <span className={isDayMode ? 'text-stone-900' : 'text-stone-100'}>
                                      {aspect.type}
                                    </span>
                                    {' '}
                                    <span className={isDayMode ? 'text-stone-600' : 'text-stone-400'}>
                                      with {otherPlanet} ({aspect.orb.toFixed(1)}°)
                                    </span>
                                  </div>
                                );
                              })}
                              {planetAspects.length > 3 && (
                                <p className={`text-xs italic ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}>
                                  +{planetAspects.length - 3} more aspects
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {planetAspects.length === 0 && (
                          <div>
                            <h4 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}>
                              Aspects
                            </h4>
                            <p className={`text-xs italic ${isDayMode ? 'text-stone-500' : 'text-stone-500'}`}>
                              No major aspects detected
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer - Elemental Integration */}
                    <div
                      className={`px-6 py-3 border-t text-center ${isDayMode ? 'bg-stone-50/50' : 'bg-stone-900/30'}`}
                      style={{
                        borderColor: isDayMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <p className={`text-xs ${isDayMode ? 'text-stone-600' : 'text-stone-400'}`}>
                        <span className="opacity-60">Current Transits:</span>{' '}
                        <span className="font-medium italic">
                          Live transit data coming soon
                        </span>
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
