'use client';

/**
 * Elemental Balance Display - Shows user's current astrological elemental signature
 * Integrates with MAIA's astrological intelligence system
 */

import { motion } from 'framer-motion';
import { Flame, Droplet, Sprout, Wind } from 'lucide-react';

interface ElementalBalance {
  fire: number;
  water: number;
  earth: number;
  air: number;
}

interface ElementalBalanceDisplayProps {
  balance: ElementalBalance;
  className?: string;
}

const elementConfig = {
  fire: {
    icon: Flame,
    color: '#E3B778',
    glowColor: 'rgba(227, 183, 120, 0.5)',
    label: 'Fire',
    quality: 'Inspiration & Action',
  },
  water: {
    icon: Droplet,
    color: '#B8A99A',
    glowColor: 'rgba(184, 169, 154, 0.4)',
    label: 'Water',
    quality: 'Emotion & Intuition',
  },
  earth: {
    icon: Sprout,
    color: '#8B7968',
    glowColor: 'rgba(139, 121, 104, 0.4)',
    label: 'Earth',
    quality: 'Grounding & Manifestation',
  },
  air: {
    icon: Wind,
    color: '#F0C98A',
    glowColor: 'rgba(240, 201, 138, 0.5)',
    label: 'Air',
    quality: 'Clarity & Communication',
  },
};

export function ElementalBalanceDisplay({ balance, className = '' }: ElementalBalanceDisplayProps) {
  // Find dominant element
  const dominant = Object.entries(balance).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0] as keyof ElementalBalance;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Title */}
      <div className="text-center relative">
        {/* Sacred radial pattern background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            style={{
              background: 'radial-gradient(circle at center, rgba(227, 183, 120, 0.3) 0%, transparent 70%)',
            }}
            className="absolute inset-0"
          />
        </div>
        <h3 className="text-amber-400 text-sm font-medium mb-1 relative" style={{ color: '#E3B778' }}>
          Your Elemental Signature
        </h3>
        <p className="text-stone-400 text-xs relative">
          Current astrological balance
        </p>
      </div>

      {/* Elemental bars */}
      <div className="space-y-4">
        {(Object.keys(elementConfig) as Array<keyof typeof elementConfig>).map((element) => {
          const config = elementConfig[element];
          const Icon = config.icon;
          const percentage = Math.round(balance[element] * 100);
          const isDominant = element === dominant;

          return (
            <div key={element} className="space-y-2">
              {/* Element label */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    className="w-4 h-4"
                    style={{ color: config.color }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: config.color }}
                  >
                    {config.label}
                  </span>
                  {isDominant && (
                    <span className="text-[10px] text-stone-500 italic">
                      dominant
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-400">
                  {percentage}%
                </span>
              </div>

              {/* Progress bar - Ceremonial temple stone */}
              <div className="relative h-2 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, rgba(44, 35, 31, 0.6), rgba(26, 21, 19, 0.4))',
                  border: '1px solid rgba(184, 134, 91, 0.2)',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${config.color}, ${config.glowColor})`,
                    boxShadow: isDominant
                      ? `0 0 12px ${config.glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                      : 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              {/* Quality description */}
              {isDominant && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-stone-500 italic pl-6"
                >
                  {config.quality}
                </motion.p>
              )}
            </div>
          );
        })}
      </div>

      {/* Dominant element wisdom - Temple stone card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-lg relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(61, 48, 38, 0.7) 0%, rgba(44, 35, 31, 0.8) 100%)',
          border: '1px solid rgba(184, 134, 91, 0.25)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(253, 251, 249, 0.05)',
        }}
      >
        {/* Radial sacred pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            style={{
              background: `radial-gradient(circle at 20% 50%, ${elementConfig[dominant].glowColor} 0%, transparent 50%)`,
            }}
          />
        </div>
        <p className="text-xs leading-relaxed relative" style={{ color: '#E8DCC8' }}>
          <span style={{ color: elementConfig[dominant].color }} className="font-medium">
            {elementConfig[dominant].label}
          </span>
          {' '}energy is strong now, inviting {getElementalPractice(dominant)}.
        </p>
      </motion.div>
    </div>
  );
}

function getElementalPractice(element: keyof ElementalBalance): string {
  const practices: Record<keyof ElementalBalance, string> = {
    fire: 'you to channel creative fire through inspired action',
    water: 'you to dive deep into emotional wisdom and intuitive knowing',
    earth: 'you to ground your visions in practical, embodied steps',
    air: 'you to clarify your mental landscape through communication',
  };
  return practices[element];
}
