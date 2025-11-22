'use client';

import { motion } from 'framer-motion';

interface HoloflowerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  animate?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high';
  variant?: 'single' | 'spectrum';
  theme?: 'light' | 'dark';
  className?: string;
}

const sizeMap = {
  sm: { image: 'w-8 h-8' },
  md: { image: 'w-12 h-12' },
  lg: { image: 'w-16 h-16' },
  xl: { image: 'w-24 h-24' },
  xxl: { image: 'w-40 h-40' }
};

export function Holoflower({
  size = 'md',
  animate = true,
  variant = 'single',
  theme = 'light',
  className = ''
}: HoloflowerProps) {
  const sizes = sizeMap[size];
  const svgPath = variant === 'spectrum' ? '/elementalHoloflower.svg' : '/holoflower.svg';

  // Apply color filter for white theme
  const filterStyle = theme === 'light' ? {
    filter: 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(324deg) brightness(100%) contrast(100%)'
  } : {};

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {animate ? (
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 3, 0, -3, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img
            src={svgPath}
            alt="Soullab"
            className={`${sizes.image} object-contain`}
            style={{
              opacity: 1,
              ...filterStyle
            }}
          />
        </motion.div>
      ) : (
        <img
          src={svgPath}
          alt="Soullab"
          className={`${sizes.image} object-contain`}
          style={{
            opacity: 1,
            ...filterStyle
          }}
        />
      )}
    </div>
  );
}