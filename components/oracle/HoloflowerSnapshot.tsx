'use client';

/**
 * HoloflowerSnapshot - Reusable Visual Representation
 *
 * A compact, beautiful rendering of a holoflower configuration
 * Used in:
 * - Journal entries
 * - Conversation history
 * - Reading summaries
 * - Soul timeline
 *
 * Props:
 * - petals: Array of petal configurations with intensities
 * - size: 'small' | 'medium' | 'large'
 * - showLabels: Whether to show petal names
 * - interactive: Whether petals are clickable for details
 * - timestamp: Optional timestamp for the snapshot
 */

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Petal {
  id: string;
  name: string;
  intensity: number; // 1-10
  color: string;
  element: string;
  affirmation: string;
  startAngle: number;
  endAngle: number;
}

interface HoloflowerSnapshotProps {
  petals: Petal[];
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  interactive?: boolean;
  timestamp?: Date;
  intention?: string;
  onClick?: () => void;
}

export function HoloflowerSnapshot({
  petals,
  size = 'medium',
  showLabels = false,
  interactive = false,
  timestamp,
  intention,
  onClick
}: HoloflowerSnapshotProps) {
  const [hoveredPetal, setHoveredPetal] = useState<string | null>(null);

  // Size configurations
  const sizeConfig = {
    small: {
      containerSize: 120,
      baseInnerRadius: 15,
      baseOuterRadius: 20,
      maxExpansion: 35,
      centerRadius: 12,
      fontSize: '10px'
    },
    medium: {
      containerSize: 200,
      baseInnerRadius: 25,
      baseOuterRadius: 35,
      maxExpansion: 60,
      centerRadius: 20,
      fontSize: '12px'
    },
    large: {
      containerSize: 300,
      baseInnerRadius: 40,
      baseOuterRadius: 55,
      maxExpansion: 90,
      centerRadius: 30,
      fontSize: '14px'
    }
  };

  const config = sizeConfig[size];
  const centerX = config.containerSize / 2;
  const centerY = config.containerSize / 2;

  // Create wedge path (same logic as main holoflower)
  const createWedgePath = (
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
  ): string => {
    const tipBulge = 1.15;
    const bulgedOuterRadius = outerRadius * tipBulge;

    const startInnerX = centerX + innerRadius * Math.cos(startAngle);
    const startInnerY = centerY + innerRadius * Math.sin(startAngle);
    const endInnerX = centerX + innerRadius * Math.cos(endAngle);
    const endInnerY = centerY + innerRadius * Math.sin(endAngle);

    const midAngle = (startAngle + endAngle) / 2;
    const tipX = centerX + bulgedOuterRadius * Math.cos(midAngle);
    const tipY = centerY + bulgedOuterRadius * Math.sin(midAngle);

    const controlDist = outerRadius * 0.6;
    const controlStartX = centerX + controlDist * Math.cos(startAngle);
    const controlStartY = centerY + controlDist * Math.sin(startAngle);
    const controlEndX = centerX + controlDist * Math.cos(endAngle);
    const controlEndY = centerY + controlDist * Math.sin(endAngle);

    return `
      M ${startInnerX},${startInnerY}
      Q ${controlStartX},${controlStartY} ${tipX},${tipY}
      Q ${controlEndX},${controlEndY} ${endInnerX},${endInnerY}
      A ${innerRadius},${innerRadius} 0 0 0 ${startInnerX},${startInnerY}
      Z
    `;
  };

  return (
    <div
      className={`relative ${interactive ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Timestamp & Intention Header */}
      {(timestamp || intention) && (
        <div className="mb-3 text-center">
          {timestamp && (
            <p className="text-amber-300/60 text-xs mb-1">
              {timestamp.toLocaleDateString()} • {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
          {intention && (
            <p className="text-amber-200/80 text-sm italic">
              "{intention}"
            </p>
          )}
        </div>
      )}

      {/* Holoflower Visualization */}
      <div className="relative flex justify-center">
        <svg
          width={config.containerSize}
          height={config.containerSize}
          className={`${interactive ? 'hover:scale-105 transition-transform duration-300' : ''}`}
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id={`glass-shine-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.05)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0.1)" />
            </linearGradient>

            {/* Plasmic gradient for center */}
            <radialGradient id={`plasmicGradient-${size}`}>
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="80%" stopColor="#D97706" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Draw all wedge petals */}
          {petals.map((petal) => {
            const radiusRatio = (petal.intensity - 1) / 9;
            const outerRadius = config.baseOuterRadius + (radiusRatio * config.maxExpansion);
            const isHovered = interactive && hoveredPetal === petal.id;
            const isChanged = petal.intensity !== 10;

            return (
              <g key={petal.id}>
                {/* Main wedge */}
                <motion.path
                  d={createWedgePath(
                    config.baseInnerRadius,
                    outerRadius,
                    petal.startAngle,
                    petal.endAngle
                  )}
                  fill={petal.color}
                  stroke="none"
                  opacity={0.95}
                  style={{
                    filter: isChanged
                      ? `saturate(1.5) brightness(1.05) drop-shadow(0 2px 4px ${petal.color}80)`
                      : 'saturate(1.2) brightness(1.0)'
                  }}
                  onMouseEnter={() => interactive && setHoveredPetal(petal.id)}
                  onMouseLeave={() => interactive && setHoveredPetal(null)}
                  initial={false}
                  animate={{
                    opacity: isHovered ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.2 }}
                />

                {/* Glass shine overlay */}
                <path
                  d={createWedgePath(
                    config.baseInnerRadius,
                    outerRadius,
                    petal.startAngle,
                    petal.endAngle
                  )}
                  fill={`url(#glass-shine-${size})`}
                  opacity={0.4}
                  style={{ pointerEvents: 'none', mixBlendMode: 'overlay' }}
                />
              </g>
            );
          })}

          {/* Center Circle - Plasmic Field */}
          <circle
            cx={centerX}
            cy={centerY}
            r={config.centerRadius}
            fill={`url(#plasmicGradient-${size})`}
            opacity={0.9}
          />

          {/* Center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r={config.centerRadius * 0.3}
            fill="#FEF3C7"
            opacity={0.8}
          />
        </svg>

        {/* Hover Tooltip */}
        {interactive && hoveredPetal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-amber-900/95 backdrop-blur-sm border border-amber-700/50 rounded-lg px-3 py-2 shadow-xl pointer-events-none whitespace-nowrap z-10"
          >
            {(() => {
              const petal = petals.find(p => p.id === hoveredPetal);
              if (!petal) return null;

              return (
                <div className="text-center">
                  <p className="text-amber-100 font-semibold text-sm">{petal.name}</p>
                  <p className="text-amber-300/80 text-xs">{petal.affirmation}</p>
                  <p className="text-amber-400 text-xs mt-1">{petal.intensity}/10</p>
                </div>
              );
            })()}
          </motion.div>
        )}
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {petals
            .filter(p => p.intensity !== 10)
            .sort((a, b) => a.intensity - b.intensity)
            .slice(0, 4)
            .map(p => (
              <div key={p.id} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: p.color }}
                />
                <span className="text-amber-300/70 truncate" style={{ fontSize: config.fontSize }}>
                  {p.name}: {p.intensity}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Interactive hint */}
      {interactive && (
        <p className="text-center text-amber-400/50 text-xs mt-2">
          Click to view full reading
        </p>
      )}
    </div>
  );
}
