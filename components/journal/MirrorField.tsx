'use client';

/**
 * The Mirror Field - Journal as Living Reflection
 *
 * Water → Earth: Emotion grounding into insight
 *
 * Philosophy:
 * - Palette drifts indigo to moss (depth settling)
 * - Typing cursor glows faintly (pulse of attention)
 * - Ripple animation beneath entries (reflection creates movement)
 * - MAIA whispers echoes from previous reflections
 *
 * Choreography:
 * - Typing feels weighted, present
 * - Saves feel like settling, not clicking
 * - Entry list breathes like water surface
 */

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Droplet, Sprout, Sparkles } from 'lucide-react';
import { getCircadianPalette, isDayMode } from '@/lib/utils/circadianRhythm';

interface JournalEntry {
  id: string;
  content: string;
  timestamp: Date;
  element?: 'fire' | 'water' | 'earth' | 'air' | 'aether';
}

interface MirrorFieldProps {
  entries?: JournalEntry[];
  onSave?: (content: string) => void;
  className?: string;
}

export function MirrorField({ entries = [], onSave, className = '' }: MirrorFieldProps) {
  const [currentEntry, setCurrentEntry] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [maiaWhisper, setMaiaWhisper] = useState('');
  const [showRipple, setShowRipple] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rippleControls = useAnimation();
  const palette = getCircadianPalette();
  const isDay = isDayMode();

  // Detect pause in typing (2 seconds of stillness)
  useEffect(() => {
    if (currentEntry.length < 20) return; // Need some substance first

    const timeout = setTimeout(() => {
      setIsPaused(true);
      // MAIA whispers an echo from past reflections
      if (entries.length > 0) {
        const randomEntry = entries[Math.floor(Math.random() * entries.length)];
        const snippet = randomEntry.content.split('.')[0] + '...';
        setMaiaWhisper(`See how the river carries its own echo: "${snippet}"`);

        // Fade whisper after 5 seconds
        setTimeout(() => setMaiaWhisper(''), 5000);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [currentEntry, entries]);

  // Ripple animation on entry save
  const triggerRipple = () => {
    setShowRipple(true);
    rippleControls.start({
      scale: [1, 2, 3],
      opacity: [0.3, 0.1, 0],
      transition: { duration: 2, ease: 'easeOut' },
    });

    setTimeout(() => setShowRipple(false), 2000);
  };

  // Handle save - feels like settling
  const handleSave = () => {
    if (!currentEntry.trim()) return;

    triggerRipple();

    setTimeout(() => {
      onSave?.(currentEntry);
      setCurrentEntry('');
      setIsPaused(false);
      setMaiaWhisper('');
    }, 600); // Delay to feel the ripple settle
  };

  // Water-to-Earth gradient (vertical depth settling)
  const gradientStyle = {
    background: isDay
      ? 'linear-gradient(to bottom, #6B9BD1 0%, #8BADD6 30%, #7A9A65 70%, #A8C69F 100%)'
      : 'linear-gradient(to bottom, #3D5A80 0%, #8BADD6 30%, #5F7A4F 70%, #A8C69F 100%)',
    opacity: 0.05,
  };

  return (
    <div className={`relative ${className}`}>
      {/* Water-to-Earth gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={gradientStyle}
      />

      {/* Ripple layer - subtle movement beneath surface */}
      {showRipple && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={rippleControls}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, ${palette.water.glow}, transparent)`,
              filter: 'blur(20px)',
            }}
          />
        </motion.div>
      )}

      {/* Writing field */}
      <div className="relative z-10">
        {/* Header - Water element */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div
            className="p-2 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${palette.water.primary}, ${palette.water.accent})`,
              boxShadow: `0 0 20px ${palette.water.glow}`,
            }}
          >
            <Droplet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-serif ${isDay ? 'text-stone-800' : 'text-stone-200'}`}>
              The Mirror Field
            </h2>
            <p className={`text-xs ${isDay ? 'text-stone-600' : 'text-stone-400'} font-serif italic`}>
              Let reflection settle into insight
            </p>
          </div>
        </motion.div>

        {/* Text input - glowing cursor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-6"
        >
          <textarea
            ref={textareaRef}
            value={currentEntry}
            onChange={(e) => {
              setCurrentEntry(e.target.value);
              setIsPaused(false);
            }}
            placeholder="What moves beneath the surface?..."
            className={`w-full min-h-[200px] p-6 rounded-xl font-serif leading-relaxed
              resize-none focus:outline-none transition-all duration-500
              ${isDay
                ? 'bg-white/50 text-stone-800 placeholder-stone-400 border border-stone-200/50'
                : 'bg-black/30 text-stone-200 placeholder-stone-500 border border-stone-700/30'
              }`}
            style={{
              caretColor: palette.water.primary,
              boxShadow: `0 4px 16px ${palette.water.glow}`,
            }}
          />

          {/* Glowing cursor pulse */}
          <div
            className="absolute top-6 right-6 w-2 h-2 rounded-full animate-pulse pointer-events-none"
            style={{
              background: palette.water.primary,
              boxShadow: `0 0 8px ${palette.water.glow}`,
              opacity: isPaused ? 0 : 0.6,
            }}
          />
        </motion.div>

        {/* MAIA's whisper - echoes from the deep */}
        {maiaWhisper && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-lg backdrop-blur-sm border
              ${isDay
                ? 'bg-indigo-50/50 border-indigo-200/40 text-indigo-900'
                : 'bg-indigo-900/20 border-indigo-500/20 text-indigo-200'
              }`}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: palette.aether.primary }} />
              <p className="text-sm font-serif italic leading-relaxed">{maiaWhisper}</p>
            </div>
          </motion.div>
        )}

        {/* Save button - feels like settling */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!currentEntry.trim()}
          className={`w-full py-3 rounded-full font-serif text-sm tracking-wide
            transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed
            ${isDay
              ? 'bg-gradient-to-r from-indigo-100 to-green-100 text-stone-800 hover:from-indigo-200 hover:to-green-200 border border-indigo-200/40'
              : 'bg-gradient-to-r from-indigo-900/40 to-green-900/40 text-stone-200 hover:from-indigo-800/50 hover:to-green-800/50 border border-indigo-500/20'
            }`}
          style={{
            boxShadow: currentEntry.trim()
              ? `0 4px 20px ${palette.earth.glow}`
              : 'none',
          }}
        >
          Let it settle
        </motion.button>

        {/* Entry list - breathing like water surface */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 space-y-4"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sprout className="w-4 h-4" style={{ color: palette.earth.primary }} />
              <h3 className={`text-sm font-serif ${isDay ? 'text-stone-700' : 'text-stone-300'}`}>
                Seeds planted
              </h3>
            </div>

            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-lg backdrop-blur-sm border cursor-pointer
                  transition-all duration-300
                  ${isDay
                    ? 'bg-white/40 border-stone-200/40 hover:bg-white/60'
                    : 'bg-black/20 border-stone-700/20 hover:bg-black/30'
                  }`}
                style={{
                  boxShadow: `0 2px 8px ${palette.earth.glow}`,
                }}
              >
                <p className={`text-sm font-serif leading-relaxed line-clamp-3
                  ${isDay ? 'text-stone-700' : 'text-stone-300'}`}>
                  {entry.content}
                </p>
                <p className={`text-xs mt-2 ${isDay ? 'text-stone-500' : 'text-stone-500'}`}>
                  {entry.timestamp.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
