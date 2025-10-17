'use client';

/**
 * The Gameboard of Becoming - Access Matrix as Living Play
 *
 * Fire → Air: Creative insight becoming thought
 *
 * Philosophy:
 * - Palette: Coral drifting to cream (warmth cooling into clarity)
 * - Spiral-beads with faint orbits (0.8-1s flicks, cubic-bezier)
 * - Motion: Each bead pulses individually (no grid lock-step)
 * - Sound layer: Soft percussion reacting to play (optional)
 * - Intensity scales with user activity (alive, not animated)
 *
 * Choreography:
 * - Hover feels like possibility awakening
 * - Click feels like choice crystallizing
 * - After play, ripple travels outward (insight spreads)
 * - MAIA whispers: "Every move changes the field. Notice what listens back."
 */

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Flame, Wind, Sparkles, Circle } from 'lucide-react';
import { getCircadianPalette, isDayMode } from '@/lib/utils/circadianRhythm';

interface MatrixBead {
  id: string;
  position: { x: number; y: number };
  element: 'fire' | 'air' | 'fire-air'; // Hybrid for transition beads
  label: string;
  activated: boolean;
  pulseDelay: number; // Each bead has its own rhythm
}

interface GameboardOfBecomingProps {
  beads?: MatrixBead[];
  onBeadActivate?: (beadId: string) => void;
  className?: string;
}

// Fire→Air color transition (coral to cream)
const fireAirGradient = {
  day: {
    fire: '#C85450',      // Coral
    transition: '#E6A071', // Peachy transition
    air: '#F5E6D3',       // Warm cream
    glow: 'rgba(200, 84, 80, 0.3)',
  },
  night: {
    fire: '#F5A362',      // Warm glow
    transition: '#D9A885', // Golden transition
    air: '#E8D4BF',       // Soft cream
    glow: 'rgba(245, 163, 98, 0.4)',
  },
};

// Cubic-bezier for thought-flick motion
const thoughtFlick = [0.34, 1.56, 0.64, 1]; // Bouncy, alive

export function GameboardOfBecoming({
  beads = [],
  onBeadActivate,
  className = '',
}: GameboardOfBecomingProps) {
  const [hoveredBead, setHoveredBead] = useState<string | null>(null);
  const [lastActivated, setLastActivated] = useState<string | null>(null);
  const [rippleOrigin, setRippleOrigin] = useState<{ x: number; y: number } | null>(null);
  const [activityLevel, setActivityLevel] = useState(0); // 0-1, scales intensity
  const rippleControls = useAnimation();
  const palette = getCircadianPalette();
  const isDay = isDayMode();
  const colors = fireAirGradient[isDay ? 'day' : 'night'];

  // Generate default beads if none provided (5x5 grid)
  const defaultBeads: MatrixBead[] = beads.length > 0 ? beads :
    Array.from({ length: 25 }, (_, i) => {
      const row = Math.floor(i / 5);
      const col = i % 5;
      // Determine element based on position (fire top-left, air bottom-right)
      const fireWeight = (4 - col + 4 - row) / 8;
      const element = fireWeight > 0.6 ? 'fire' : fireWeight > 0.4 ? 'fire-air' : 'air';

      return {
        id: `bead-${i}`,
        position: { x: col * 80 + 40, y: row * 80 + 40 },
        element,
        label: `Path ${i + 1}`,
        activated: false,
        pulseDelay: Math.random() * 3, // Staggered breathing
      };
    });

  // Track activity level based on recent interactions
  useEffect(() => {
    if (lastActivated) {
      setActivityLevel(Math.min(1, activityLevel + 0.1));

      // Decay over time (activity settles)
      const timeout = setTimeout(() => {
        setActivityLevel(Math.max(0, activityLevel - 0.05));
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [lastActivated]);

  // Handle bead activation - ripple spreads insight
  const handleBeadClick = (bead: MatrixBead) => {
    setLastActivated(bead.id);
    setRippleOrigin(bead.position);
    onBeadActivate?.(bead.id);

    // Ripple animation (insight spreading)
    rippleControls.start({
      scale: [1, 3, 5],
      opacity: [0.4, 0.2, 0],
      transition: { duration: 1.5, ease: 'easeOut' },
    });

    setTimeout(() => setRippleOrigin(null), 1500);
  };

  // Get bead color based on element and state
  const getBeadColor = (bead: MatrixBead, isHovered: boolean) => {
    const elementColors = {
      fire: colors.fire,
      air: colors.air,
      'fire-air': colors.transition,
    };

    const baseColor = elementColors[bead.element];
    return isHovered ? baseColor : baseColor + 'CC'; // Slightly transparent when not hovered
  };

  return (
    <div className={`relative ${className}`}>
      {/* Fire→Air gradient background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: isDay
            ? `linear-gradient(135deg, ${colors.fire} 0%, ${colors.transition} 50%, ${colors.air} 100%)`
            : `linear-gradient(135deg, ${colors.fire} 0%, ${colors.transition} 50%, ${colors.air} 100%)`,
        }}
      />

      {/* Header - Fire → Air */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 relative z-10"
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${colors.fire}, ${colors.air})`,
              boxShadow: `0 0 20px ${colors.glow}`,
            }}
          >
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-serif ${isDay ? 'text-stone-800' : 'text-stone-200'}`}>
              The Gameboard of Becoming
            </h2>
            <p className={`text-xs ${isDay ? 'text-stone-600' : 'text-stone-400'} font-serif italic`}>
              Every move changes the field
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4" style={{ color: colors.air }} />
          <span className={`text-xs ${isDay ? 'text-stone-600' : 'text-stone-400'}`}>
            Creative insight
          </span>
        </div>
      </motion.div>

      {/* MAIA's whisper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: activityLevel > 0.3 ? 1 : 0 }}
        className={`mb-6 p-3 rounded-lg backdrop-blur-sm border transition-all duration-500
          ${isDay
            ? 'bg-orange-50/50 border-orange-200/40 text-orange-900'
            : 'bg-orange-900/20 border-orange-500/20 text-orange-200'
          }`}
      >
        <div className="flex items-start gap-2">
          <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: palette.aether.primary }} />
          <p className="text-xs font-serif italic">
            Notice what listens back...
          </p>
        </div>
      </motion.div>

      {/* The Matrix - Spiral beads with orbits */}
      <div className="relative h-[480px] w-full">
        <svg
          viewBox="0 0 440 440"
          className="w-full h-full"
          style={{ filter: `drop-shadow(0 0 20px ${colors.glow})` }}
        >
          {/* Ripple effect - insight spreading */}
          {rippleOrigin && (
            <motion.circle
              cx={rippleOrigin.x + 20}
              cy={rippleOrigin.y + 20}
              r="30"
              fill="none"
              stroke={colors.fire}
              strokeWidth="2"
              strokeOpacity="0.4"
              animate={rippleControls}
            />
          )}

          {/* Faint orbit rings - field structure */}
          {[120, 200, 280].map((radius, i) => (
            <motion.circle
              key={`orbit-${i}`}
              cx="220"
              cy="220"
              r={radius}
              fill="none"
              stroke={isDay ? '#d6d3d1' : '#44403c'}
              strokeWidth="1"
              strokeOpacity="0.2"
              strokeDasharray="4,8"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 60 + i * 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: '220px 220px' }}
            />
          ))}

          {/* Beads - each with individual pulse */}
          {defaultBeads.map((bead) => {
            const isHovered = hoveredBead === bead.id;
            const isActive = lastActivated === bead.id;
            const beadColor = getBeadColor(bead, isHovered);

            return (
              <g key={bead.id}>
                {/* Bead glow (pulses individually) */}
                <motion.circle
                  cx={bead.position.x + 20}
                  cy={bead.position.y + 20}
                  r={isHovered ? 28 : 20}
                  fill={beadColor}
                  fillOpacity="0.2"
                  animate={{
                    scale: isActive ? [1, 1.3, 1] : [0.9, 1, 0.9],
                    opacity: isActive ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 3 + activityLevel,
                    repeat: Infinity,
                    delay: bead.pulseDelay,
                    ease: 'easeInOut',
                  }}
                />

                {/* Bead core (thought-flick on interaction) */}
                <motion.circle
                  cx={bead.position.x + 20}
                  cy={bead.position.y + 20}
                  r={isHovered ? 12 : 8}
                  fill={beadColor}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredBead(bead.id)}
                  onMouseLeave={() => setHoveredBead(null)}
                  onClick={() => handleBeadClick(bead)}
                  whileHover={{
                    scale: 1.2,
                    transition: { duration: 0.8, ease: thoughtFlick as any },
                  }}
                  whileTap={{
                    scale: 0.9,
                    transition: { duration: 0.3 },
                  }}
                  style={{
                    filter: isHovered
                      ? `drop-shadow(0 0 8px ${colors.glow})`
                      : 'none',
                  }}
                />

                {/* Activation ring */}
                {isActive && (
                  <motion.circle
                    cx={bead.position.x + 20}
                    cy={bead.position.y + 20}
                    r="16"
                    fill="none"
                    stroke={beadColor}
                    strokeWidth="2"
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                )}

                {/* Bead label on hover */}
                {isHovered && (
                  <motion.text
                    x={bead.position.x + 20}
                    y={bead.position.y + 50}
                    textAnchor="middle"
                    fill={isDay ? '#57534e' : '#a8a29e'}
                    fontSize="10"
                    fontFamily="serif"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {bead.label}
                  </motion.text>
                )}
              </g>
            );
          })}

          {/* Central source point - where fire meets air */}
          <motion.circle
            cx="220"
            cy="220"
            r="6"
            fill={colors.transition}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              filter: `drop-shadow(0 0 12px ${colors.glow})`,
            }}
          />
        </svg>

        {/* Activity intensity indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-3 rounded-full transition-all duration-500"
                style={{
                  background: i < activityLevel * 5 ? colors.fire : colors.air,
                  opacity: i < activityLevel * 5 ? 0.8 : 0.2,
                }}
              />
            ))}
          </div>
          <span className={`text-xs ${isDay ? 'text-stone-500' : 'text-stone-500'}`}>
            field intensity
          </span>
        </div>
      </div>

      {/* Elemental transition guide */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center justify-center gap-4"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: colors.fire }}
          />
          <span className={`text-xs ${isDay ? 'text-stone-600' : 'text-stone-400'}`}>
            Fire · Creative spark
          </span>
        </div>
        <div className="text-stone-400">→</div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: colors.transition }}
          />
          <span className={`text-xs ${isDay ? 'text-stone-600' : 'text-stone-400'}`}>
            Insight crystallizing
          </span>
        </div>
        <div className="text-stone-400">→</div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: colors.air }}
          />
          <span className={`text-xs ${isDay ? 'text-stone-600' : 'text-stone-400'}`}>
            Air · Clear thought
          </span>
        </div>
      </motion.div>
    </div>
  );
}
