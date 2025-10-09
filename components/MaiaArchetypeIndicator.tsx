"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArchetypeKey } from '@/lib/services/archetypeService';

interface MaiaArchetypeIndicatorProps {
  currentArchetype: ArchetypeKey;
  previousArchetype?: ArchetypeKey;
  transitionMessage?: string;
  showTransition?: boolean;
}

export const MaiaArchetypeIndicator: React.FC<MaiaArchetypeIndicatorProps> = ({
  currentArchetype,
  previousArchetype,
  transitionMessage,
  showTransition = false
}) => {

  const archetypeConfig = {
    LAB_PARTNER: {
      color: 'bg-blue-500/20 border-blue-500/40 text-blue-200',
      glowColor: 'shadow-blue-500/20',
      icon: '🔬',
      label: 'Lab Partner'
    },
    LAB_GUIDE: {
      color: 'bg-purple-500/20 border-purple-500/40 text-purple-200',
      glowColor: 'shadow-purple-500/20',
      icon: '🧭',
      label: 'Lab Guide'
    },
    MENTOR: {
      color: 'bg-amber-500/20 border-amber-500/40 text-amber-200',
      glowColor: 'shadow-amber-500/20',
      icon: '📖',
      label: 'Sacred Mentor'
    },
    WITNESS: {
      color: 'bg-gray-400/20 border-gray-400/40 text-gray-200',
      glowColor: 'shadow-gray-400/20',
      icon: '👁',
      label: 'Sacred Witness'
    },
    CHALLENGER: {
      color: 'bg-red-500/20 border-red-500/40 text-red-200',
      glowColor: 'shadow-red-500/20',
      icon: '⚔️',
      label: 'Sacred Challenger'
    },
    ORACLE: {
      color: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200',
      glowColor: 'shadow-indigo-500/20',
      icon: '🔮',
      label: 'Pattern Oracle'
    },
    ALCHEMIST: {
      color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-200',
      glowColor: 'shadow-yellow-500/20',
      icon: '⚗️',
      label: 'Master Alchemist'
    }
  };

  const config = archetypeConfig[currentArchetype];

  return (
    <div className="flex flex-col gap-2">
      {/* Main Indicator */}
      <motion.div
        key={currentArchetype}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} ${config.glowColor} shadow-lg backdrop-blur-sm`}
      >
        <span className="text-base">{config.icon}</span>
        <span className="text-xs font-medium">Maia as {config.label}</span>
      </motion.div>

      {/* Transition Message */}
      <AnimatePresence>
        {showTransition && transitionMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs italic text-white/40 px-3"
          >
            {transitionMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Compact version for chat bubbles
export const CompactArchetypeIndicator: React.FC<{ archetype: ArchetypeKey }> = ({
  archetype
}) => {
  const icons = {
    LAB_PARTNER: '🔬',
    LAB_GUIDE: '🧭',
    MENTOR: '📖',
    WITNESS: '👁',
    CHALLENGER: '⚔️',
    ORACLE: '🔮',
    ALCHEMIST: '⚗️'
  };

  return (
    <span className="text-xs opacity-60" title={archetype.replace('_', ' ')}>
      {icons[archetype]}
    </span>
  );
};

// Archetype switcher (for user-initiated switches)
export const ArchetypeSwitcher: React.FC<{
  currentArchetype: ArchetypeKey;
  onSwitch: (archetype: ArchetypeKey) => void;
}> = ({ currentArchetype, onSwitch }) => {

  const archetypes: ArchetypeKey[] = [
    'LAB_PARTNER',
    'LAB_GUIDE',
    'MENTOR',
    'WITNESS',
    'CHALLENGER',
    'ORACLE',
    'ALCHEMIST'
  ];

  const config = {
    LAB_PARTNER: { icon: '🔬', label: 'Lab Partner' },
    LAB_GUIDE: { icon: '🧭', label: 'Lab Guide' },
    MENTOR: { icon: '📖', label: 'Mentor' },
    WITNESS: { icon: '👁', label: 'Witness' },
    CHALLENGER: { icon: '⚔️', label: 'Challenger' },
    ORACLE: { icon: '🔮', label: 'Oracle' },
    ALCHEMIST: { icon: '⚗️', label: 'Alchemist' }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {archetypes.map(archetype => (
        <motion.button
          key={archetype}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSwitch(archetype)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
            currentArchetype === archetype
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
          }`}
        >
          <span>{config[archetype].icon}</span>
          <span>{config[archetype].label}</span>
        </motion.button>
      ))}
    </div>
  );
};