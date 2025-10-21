'use client';

import { ExtensionPanelProps } from '@/types/extensions';
import { motion } from 'framer-motion';

/**
 * Archetypal Voices
 * Planetary principles speaking
 * Lives in LEFT PANEL (← Imaginal/Poetic)
 */
export function ArchetypalVoices({ userId }: ExtensionPanelProps) {
  const voices = [
    {
      planet: 'Saturn',
      voice: 'What needs refinement? Where does form call for deeper integrity? I am the pressure that reveals what endures.',
      color: 'text-stone-400'
    },
    {
      planet: 'Neptune',
      voice: 'Let the boundaries dissolve. What you seek to grasp already flows through you. I am the mist that reveals oceanic depths.',
      color: 'text-cyan-400'
    },
    {
      planet: 'Uranus',
      voice: 'The pattern you defend is the cage. Lightning strikes to liberate. What security must shatter for freedom to emerge?',
      color: 'text-violet-400'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs text-white/50">Active planetary voices</div>

      {voices.map((v, i) => (
        <motion.div
          key={v.planet}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="p-4 bg-black/30 rounded-lg border border-white/10"
        >
          <div className={`text-sm font-semibold mb-2 ${v.color}`}>{v.planet}</div>
          <p className="text-sm text-white/70 italic leading-relaxed font-serif">
            "{v.voice}"
          </p>
        </motion.div>
      ))}

      <div className="pt-2 text-xs text-white/40">
        These voices speak from the active transits in your chart.
      </div>
    </div>
  );
}
