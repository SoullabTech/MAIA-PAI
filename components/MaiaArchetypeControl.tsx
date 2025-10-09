'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ArchetypeToggleProps {
  icon: string;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  special?: boolean;
}

function ArchetypeToggle({ icon, label, description, selected, onSelect, special }: ArchetypeToggleProps) {
  return (
    <motion.button
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all text-left ${
        selected
          ? special
            ? 'border-purple-500/50 bg-purple-500/15 text-purple-300'
            : 'border-amber-500/50 bg-amber-500/15 text-amber-300'
          : 'border-white/10 bg-black/20 text-white/60 hover:border-white/20'
      }`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <motion.div
        className="text-2xl mb-2"
        animate={selected ? {
          scale: [1, 1.15, 1],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <div className="text-sm font-medium mb-1">{label}</div>
      <div className="text-xs opacity-70 leading-snug">{description}</div>
    </motion.button>
  );
}

const ARCHETYPES = [
  {
    id: 'LAB_PARTNER',
    icon: '🔬',
    label: 'Lab Partner',
    description: 'Exploring together as equals'
  },
  {
    id: 'TRUSTED_FRIEND',
    icon: '☕',
    label: 'Trusted Friend',
    description: 'Warm, personal, supportive'
  },
  {
    id: 'GUIDE',
    icon: '🧭',
    label: 'Guide',
    description: 'Showing the way forward'
  },
  {
    id: 'ALCHEMIST',
    icon: '⚗️',
    label: 'Wise Alchemist',
    description: 'Deep transformation work'
  },
  {
    id: 'MENTOR',
    icon: '📖',
    label: 'Mentor',
    description: 'Teaching from experience'
  },
  {
    id: 'WITNESS',
    icon: '👁',
    label: 'Witness',
    description: 'Pure presence, deep listening'
  },
  {
    id: 'CHALLENGER',
    icon: '⚔️',
    label: 'Challenger',
    description: 'Loving confrontation of patterns'
  },
  {
    id: 'AUTO',
    icon: '✨',
    label: 'Auto-Detect',
    description: 'Let Maia sense what\'s needed',
    special: true
  }
];

function getArchetypeDescription(archetypeId: string): string {
  const archetype = ARCHETYPES.find(a => a.id === archetypeId);
  return archetype ? `${archetype.icon} ${archetype.label}` : 'Auto-Detect';
}

export function MaiaArchetypeControl() {
  const [selectedArchetype, setSelectedArchetype] = useState('AUTO');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maia_archetype');
      if (saved) {
        setSelectedArchetype(saved);
      }
    }
  }, []);

  const handleSelect = (archetypeId: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }

    setSelectedArchetype(archetypeId);

    if (typeof window !== 'undefined') {
      localStorage.setItem('maia_archetype', archetypeId);
      window.dispatchEvent(new CustomEvent('maia-archetype-changed', {
        detail: { archetype: archetypeId }
      }));
    }
  };

  return (
    <div className="archetype-control-panel">
      <h3 className="text-xs uppercase opacity-60 mb-3 tracking-wide">
        How would you like Maia to show up?
      </h3>

      <div className="archetype-toggles grid grid-cols-2 gap-3">
        {ARCHETYPES.map((archetype) => (
          <ArchetypeToggle
            key={archetype.id}
            icon={archetype.icon}
            label={archetype.label}
            description={archetype.description}
            selected={selectedArchetype === archetype.id}
            onSelect={() => handleSelect(archetype.id)}
            special={archetype.special}
          />
        ))}
      </div>

      <motion.div
        className="current-mode mt-4 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-xs opacity-70">Currently: </span>
        <span className="text-sm font-medium text-amber-200">
          {getArchetypeDescription(selectedArchetype)}
        </span>
      </motion.div>
    </div>
  );
}