import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SoulPioneerBadgeProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  userName?: string;
  userNumber?: number;
  compact?: boolean;
}

export const SoulPioneerBadge: React.FC<SoulPioneerBadgeProps> = ({
  position = 'bottom-left',
  userName,
  userNumber,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-28 left-4',
    'bottom-right': 'bottom-28 right-4'
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-30`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Compact badge */}
        {compact ? (
          <motion.div
            className="bg-black/60 backdrop-blur-md border border-gold-divine/30
                     rounded-full px-3 py-1.5 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-gold-divine text-lg">🌟</span>
            <span className="text-gold-divine/80 text-xs font-light">Soul Pioneer</span>
          </motion.div>
        ) : (
          /* Full badge */
          <motion.div
            className="bg-black/60 backdrop-blur-md border border-gold-divine/30
                     rounded-2xl p-3 min-w-[160px]"
            whileHover={{ borderColor: 'rgba(212, 184, 150, 0.5)' }}
          >
            <div className="flex flex-col items-center text-center">
              <motion.div
                className="text-2xl mb-1"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              >
                🌟
              </motion.div>
              <h3 className="text-gold-divine text-sm font-medium mb-0.5">
                Soul Pioneer
              </h3>
              <p className="text-gold-divine/60 text-xs font-light">
                #{userNumber || '∞'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Expanded tooltip */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full mb-2 left-0 w-64
                       bg-black/90 backdrop-blur-xl border border-gold-divine/30
                       rounded-xl p-4 pointer-events-none"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-gold-divine/10 to-amber-500/10
                              blur-xl rounded-xl" />

                <div className="relative">
                  <h4 className="text-gold-divine font-medium text-sm mb-2">
                    {userName ? `${userName}, you are` : 'You are'} a Soul Pioneer
                  </h4>

                  <p className="text-gold-divine/80 text-xs leading-relaxed mb-3">
                    One of 31 consciousness pioneers helping to{' '}
                    <span className="text-gold-divine font-medium">Changing Our World To Soul</span>
                  </p>

                  <div className="flex flex-col gap-1 text-xs text-gold-divine/60">
                    <div className="flex items-center gap-2">
                      <span>✨</span>
                      <span>Soul Beta Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🌍</span>
                      <span>16 Languages Supported</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🤝</span>
                      <span>Building Tomorrow Together</span>
                    </div>
                  </div>

                  {/* Mission statement */}
                  <div className="mt-3 pt-3 border-t border-gold-divine/20">
                    <p className="text-[10px] text-gold-divine/50 italic text-center">
                      "Changing Our World To Soul"
                    </p>
                  </div>
                </div>
              </div>

              {/* Arrow pointing down */}
              <div className="absolute -bottom-2 left-4 w-0 h-0
                          border-l-[6px] border-l-transparent
                          border-r-[6px] border-r-transparent
                          border-t-[6px] border-t-black/90" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default SoulPioneerBadge;