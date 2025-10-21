/**
 * ConversationModeSwitcher - Three-mode toggle for MAIA conversations
 * Modes: Dialogue (Samantha), Patient (Deep Listening), Scribe (Session Witnessing)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Ear, BookOpen } from 'lucide-react';

type ConversationMode = 'normal' | 'patient' | 'session';

interface ConversationModeSwitcherProps {
  mode: ConversationMode;
  onModeChange: (mode: ConversationMode) => void;
  isConnected?: boolean;
}

const modeConfig = {
  normal: {
    icon: MessageCircle,
    label: 'Dialogue',
    description: 'Back & forth conversation',
    color: '#d4b896', // Sacred gold
    bgGradient: 'linear-gradient(135deg, rgba(212,184,150,0.3), rgba(212,184,150,0.2))',
  },
  patient: {
    icon: Ear,
    label: 'Patient',
    description: 'Deep listening mode',
    color: '#9370DB', // Medium purple - spacious, receptive
    bgGradient: 'linear-gradient(135deg, rgba(147,112,219,0.3), rgba(147,112,219,0.2))',
  },
  session: {
    icon: BookOpen,
    label: 'Scribe',
    description: 'Witness full session',
    color: '#4682B4', // Steel blue - wise, witnessing
    bgGradient: 'linear-gradient(135deg, rgba(70,130,180,0.3), rgba(70,130,180,0.2))',
  },
};

export const ConversationModeSwitcher: React.FC<ConversationModeSwitcherProps> = ({
  mode,
  onModeChange,
  isConnected = true,
}) => {
  return (
    <>
      {/* Desktop Version - Horizontal pills at top right */}
      <div className="hidden md:block fixed right-4 top-4 z-40">
        <div className="flex gap-2">
          {(Object.keys(modeConfig) as ConversationMode[]).map((modeKey) => {
            const config = modeConfig[modeKey];
            const Icon = config.icon;
            const isActive = mode === modeKey;

            return (
              <motion.button
                key={modeKey}
                onClick={() => onModeChange(modeKey)}
                disabled={!isConnected}
                className="relative px-3 py-2 rounded-lg transition-all backdrop-blur-sm disabled:opacity-50"
                style={{
                  background: isActive ? config.bgGradient : 'rgba(0,0,0,0.2)',
                  border: isActive
                    ? `1px solid ${config.color}40`
                    : '1px solid rgba(255,255,255,0.1)',
                }}
                whileHover={isConnected ? { scale: 1.05 } : {}}
                whileTap={isConnected ? { scale: 0.95 } : {}}
                title={config.description}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    size={14}
                    style={{ color: isActive ? config.color : `${config.color}99` }}
                  />
                  <span
                    className="text-xs font-light tracking-wide"
                    style={{ color: isActive ? config.color : `${config.color}99` }}
                  >
                    {config.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Mobile Version - Compact pills at top right */}
      <div
        className="md:hidden fixed right-4 z-40"
        style={{ top: 'calc(max(1rem, env(safe-area-inset-top)) + 0.75rem)' }}
      >
        <div className="flex flex-col gap-1.5 bg-black/40 backdrop-blur-md rounded-2xl p-1.5 border border-white/10">
          {(Object.keys(modeConfig) as ConversationMode[]).map((modeKey) => {
            const config = modeConfig[modeKey];
            const Icon = config.icon;
            const isActive = mode === modeKey;

            return (
              <motion.button
                key={modeKey}
                onClick={() => onModeChange(modeKey)}
                disabled={!isConnected}
                className="relative px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50"
                style={{
                  background: isActive ? config.bgGradient : 'transparent',
                }}
                whileTap={isConnected ? { scale: 0.95 } : {}}
                title={config.description}
              >
                <Icon
                  size={12}
                  style={{ color: isActive ? config.color : `${config.color}80` }}
                />
                <span
                  className="text-[10px] font-light"
                  style={{ color: isActive ? config.color : `${config.color}80` }}
                >
                  {config.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
};
