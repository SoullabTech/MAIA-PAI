'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MaiaArchetypeControl } from './MaiaArchetypeControl';

interface MaiaPresenceToggleProps {
  inline?: boolean;
}

const QUICK_ARCHETYPES = [
  { id: 'TRUSTED_FRIEND', icon: '☕', title: 'Friend Mode' },
  { id: 'GUIDE', icon: '🧭', title: 'Guide Mode' },
  { id: 'MENTOR', icon: '📖', title: 'Mentor Mode' },
  { id: 'ALCHEMIST', icon: '⚗️', title: 'Alchemist Mode' }
];

export function MaiaPresenceToggle({ inline = false }: MaiaPresenceToggleProps) {
  const [currentArchetype, setCurrentArchetype] = useState<string>('AUTO');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maia_archetype');
      if (saved) {
        setCurrentArchetype(saved);
      }
    }

    const handleArchetypeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCurrentArchetype(customEvent.detail.archetype);
    };

    window.addEventListener('maia-archetype-changed', handleArchetypeChange);

    return () => {
      window.removeEventListener('maia-archetype-changed', handleArchetypeChange);
    };
  }, []);

  const switchTo = (archetypeId: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }

    setCurrentArchetype(archetypeId);

    if (typeof window !== 'undefined') {
      localStorage.setItem('maia_archetype', archetypeId);
      window.dispatchEvent(new CustomEvent('maia-archetype-changed', {
        detail: { archetype: archetypeId }
      }));
    }
  };

  if (inline) {
    return (
      <div className="inline-toggle flex gap-2 items-center">
        {QUICK_ARCHETYPES.map((archetype) => (
          <motion.button
            key={archetype.id}
            title={archetype.title}
            onClick={() => switchTo(archetype.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
              transition-all ${
              currentArchetype === archetype.id
                ? 'bg-amber-500/30 border border-amber-500/50 opacity-100'
                : 'bg-white/5 border border-white/10 opacity-60 hover:opacity-100'
            }`}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            {archetype.icon}
          </motion.button>
        ))}
        <motion.button
          title="Auto-Detect"
          onClick={() => switchTo('AUTO')}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
            transition-all ${
            currentArchetype === 'AUTO'
              ? 'bg-purple-500/30 border border-purple-500/50 opacity-100'
              : 'bg-white/5 border border-white/10 opacity-60 hover:opacity-100'
          }`}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          ✨
        </motion.button>
      </div>
    );
  }

  return <MaiaArchetypeControl />;
}

export function MaiaPresenceIndicator() {
  const [currentArchetype, setCurrentArchetype] = useState<string>('AUTO');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maia_archetype');
      if (saved) {
        setCurrentArchetype(saved);
      }
    }

    const handleArchetypeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCurrentArchetype(customEvent.detail.archetype);
    };

    window.addEventListener('maia-archetype-changed', handleArchetypeChange);

    return () => {
      window.removeEventListener('maia-archetype-changed', handleArchetypeChange);
    };
  }, []);

  const getArchetypeIcon = (id: string): string => {
    const archetypes: Record<string, string> = {
      LAB_PARTNER: '🔬',
      TRUSTED_FRIEND: '☕',
      GUIDE: '🧭',
      ALCHEMIST: '⚗️',
      MENTOR: '📖',
      WITNESS: '👁',
      CHALLENGER: '⚔️',
      AUTO: '✨'
    };
    return archetypes[id] || '✨';
  };

  const getArchetypeName = (id: string): string => {
    const names: Record<string, string> = {
      LAB_PARTNER: 'Lab Partner',
      TRUSTED_FRIEND: 'Friend',
      GUIDE: 'Guide',
      ALCHEMIST: 'Alchemist',
      MENTOR: 'Mentor',
      WITNESS: 'Witness',
      CHALLENGER: 'Challenger',
      AUTO: 'Auto'
    };
    return names[id] || 'Auto';
  };

  const getModeClass = (id: string): string => {
    const classes: Record<string, string> = {
      TRUSTED_FRIEND: 'mode-friend',
      GUIDE: 'mode-guide',
      MENTOR: 'mode-mentor',
      ALCHEMIST: 'mode-alchemist',
      LAB_PARTNER: 'mode-lab',
      WITNESS: 'mode-witness',
      CHALLENGER: 'mode-challenger',
      AUTO: 'mode-auto'
    };
    return classes[id] || 'mode-auto';
  };

  return (
    <motion.div
      className={`maia-mode-indicator ${getModeClass(currentArchetype)}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="mode-icon">{getArchetypeIcon(currentArchetype)}</span>
      <span className="mode-name">{getArchetypeName(currentArchetype)}</span>
    </motion.div>
  );
}