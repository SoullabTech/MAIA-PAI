'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompassState, NavigationHint } from '@/types/extensions';
import { DirectionalPanel, PANEL_METADATA } from '@/lib/extensions/registry';

interface SacredCompassProps {
  state: CompassState;
  onNavigate: (direction: DirectionalPanel | 'center') => void;
  hints?: NavigationHint[];
  className?: string;
}

/**
 * Sacred Compass - Phenomenological Navigation
 *
 * Visual mandala showing current position and available directions
 * Supports keyboard, mouse, and touch navigation
 */
export function SacredCompass({
  state,
  onNavigate,
  hints = [],
  className = '',
}: SacredCompassProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't interfere with typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          onNavigate('right');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onNavigate('left');
          break;
        case 'ArrowUp':
          e.preventDefault();
          onNavigate('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          onNavigate('down');
          break;
        case 'Escape':
          e.preventDefault();
          onNavigate('center');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNavigate]);

  const isActive = (direction: DirectionalPanel | 'center') => {
    return state.currentPanel === direction;
  };

  const isSuggested = (direction: DirectionalPanel) => {
    return state.suggestions.includes(direction);
  };

  const hasContent = (direction: DirectionalPanel) => {
    return state.available.includes(direction);
  };

  const getDirectionColor = (direction: DirectionalPanel): string => {
    switch (direction) {
      case 'right':
        return 'text-blue-400'; // Analytical - cool blue
      case 'left':
        return 'text-purple-400'; // Imaginal - mystical purple
      case 'up':
        return 'text-red-400'; // Depths - primal red
      case 'down':
        return 'text-amber-400'; // Transcendent - golden light
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 ${className}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <motion.div
        animate={{
          scale: isExpanded ? 1.2 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        {/* Compass Container */}
        <div className="relative w-20 h-20">
          {/* Center Circle - MAIA Presence */}
          <motion.button
            onClick={() => onNavigate('center')}
            className={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-8 h-8 rounded-full
              flex items-center justify-center
              transition-all duration-300
              ${
                isActive('center')
                  ? 'bg-white text-black scale-110 shadow-lg'
                  : 'bg-black border border-white/30 text-white/70 hover:border-white/60'
              }
            `}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Return to center - MAIA conversation"
          >
            <span className="text-xs font-serif">◉</span>
          </motion.button>

          {/* UP - Depths/Subconscious */}
          <DirectionButton
            direction="up"
            position="top-0 left-1/2 -translate-x-1/2"
            isActive={isActive('up')}
            isSuggested={isSuggested('up')}
            hasContent={hasContent('up')}
            onClick={() => onNavigate('up')}
            colorClass={getDirectionColor('up')}
            hints={hints.filter(h => h.direction === 'up')}
          />

          {/* DOWN - Transcendent/Higher Self */}
          <DirectionButton
            direction="down"
            position="bottom-0 left-1/2 -translate-x-1/2"
            isActive={isActive('down')}
            isSuggested={isSuggested('down')}
            hasContent={hasContent('down')}
            onClick={() => onNavigate('down')}
            colorClass={getDirectionColor('down')}
            hints={hints.filter(h => h.direction === 'down')}
          />

          {/* LEFT - Imaginal/Right Hemisphere */}
          <DirectionButton
            direction="left"
            position="left-0 top-1/2 -translate-y-1/2"
            isActive={isActive('left')}
            isSuggested={isSuggested('left')}
            hasContent={hasContent('left')}
            onClick={() => onNavigate('left')}
            colorClass={getDirectionColor('left')}
            hints={hints.filter(h => h.direction === 'left')}
          />

          {/* RIGHT - Analytical/Left Hemisphere */}
          <DirectionButton
            direction="right"
            position="right-0 top-1/2 -translate-y-1/2"
            isActive={isActive('right')}
            isSuggested={isSuggested('right')}
            hasContent={hasContent('right')}
            onClick={() => onNavigate('right')}
            colorClass={getDirectionColor('right')}
            hints={hints.filter(h => h.direction === 'right')}
          />
        </div>

        {/* Expanded Labels */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full
                         bg-black/90 border border-white/20 rounded-lg px-3 py-2
                         text-xs text-white/70 whitespace-nowrap pointer-events-none"
            >
              <div className="text-center font-serif">
                <div className="text-white/90">Sacred Compass</div>
                <div className="text-[10px] mt-1">Arrow keys to navigate</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

interface DirectionButtonProps {
  direction: DirectionalPanel;
  position: string;
  isActive: boolean;
  isSuggested: boolean;
  hasContent: boolean;
  onClick: () => void;
  colorClass: string;
  hints: NavigationHint[];
}

function DirectionButton({
  direction,
  position,
  isActive,
  isSuggested,
  hasContent,
  onClick,
  colorClass,
  hints,
}: DirectionButtonProps) {
  const metadata = PANEL_METADATA[direction];
  const [showTooltip, setShowTooltip] = useState(false);

  const getIcon = () => {
    switch (direction) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'left':
        return '←';
      case 'right':
        return '→';
    }
  };

  return (
    <div
      className={`absolute ${position}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.button
        onClick={onClick}
        disabled={!hasContent}
        className={`
          w-6 h-6 rounded-full
          flex items-center justify-center
          transition-all duration-300
          ${
            isActive
              ? `${colorClass} bg-current/20 scale-110 shadow-lg`
              : hasContent
              ? `${colorClass} bg-black border border-current/30 hover:border-current/60`
              : 'bg-black border border-white/10 text-white/20 cursor-not-allowed'
          }
        `}
        whileHover={hasContent ? { scale: 1.15 } : {}}
        whileTap={hasContent ? { scale: 0.95 } : {}}
        animate={
          isSuggested
            ? {
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1],
              }
            : {}
        }
        transition={
          isSuggested
            ? {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
        aria-label={`Navigate ${direction} to ${metadata.title}`}
      >
        <span className="text-sm font-serif">{getIcon()}</span>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && hasContent && (
          <motion.div
            initial={{ opacity: 0, y: direction === 'up' ? 5 : direction === 'down' ? -5 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`
              absolute z-50 pointer-events-none
              ${direction === 'up' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : ''}
              ${direction === 'down' ? 'top-full mt-2 left-1/2 -translate-x-1/2' : ''}
              ${direction === 'left' ? 'right-full mr-2 top-1/2 -translate-y-1/2' : ''}
              ${direction === 'right' ? 'left-full ml-2 top-1/2 -translate-y-1/2' : ''}
            `}
          >
            <div className="bg-black/95 border border-white/20 rounded-lg px-3 py-2 min-w-[180px]">
              <div className={`text-xs font-semibold ${colorClass}`}>{metadata.title}</div>
              <div className="text-[10px] text-white/60 mt-1">{metadata.subtitle}</div>
              {hints.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="text-[10px] text-white/50 mb-1">Suggested:</div>
                  {hints.slice(0, 2).map(hint => (
                    <div key={hint.id} className="text-[10px] text-white/70 truncate">
                      • {hint.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
