import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, MessageSquare, User, FileText, Clock, Menu, Beaker } from 'lucide-react';
import Image from 'next/image';

export interface MAIAHeaderProps {
  isVoiceMode?: boolean;
  onToggleVoiceMode?: () => void;
  selectedMode?: string;
  onModeChange?: (mode: string) => void;
  sessionActive?: boolean;
  sessionTimeRemaining?: string;
  onSessionControl?: () => void;
  onLabToolsToggle?: () => void;
  showLabTools?: boolean;
}

export const MAIAHeader: React.FC<MAIAHeaderProps> = ({
  isVoiceMode = false,
  onToggleVoiceMode,
  selectedMode = 'dialogue',
  onModeChange,
  sessionActive = false,
  sessionTimeRemaining,
  onSessionControl,
  onLabToolsToggle,
  showLabTools = false
}) => {
  const modeOptions = [
    { id: 'dialogue', label: 'Dialogue', icon: MessageSquare },
    { id: 'patient', label: 'Patient', icon: User },
    { id: 'scribe', label: 'Scribe', icon: FileText }
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-amber-500/20"
    >
      <div className="flex items-center justify-between px-6 py-3 max-w-screen-2xl mx-auto">

        {/* Left: Logo & Branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image
                src="/holoflower-amber.png"
                alt="Soullab Holoflower"
                width={32}
                height={32}
                className="object-contain"
                onError={(e) => {
                  // Fallback to geometric circle if image fails
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Fallback geometric holoflower if image doesn't load */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-amber-400/60 bg-gradient-to-br from-amber-400/20 to-orange-500/20">
                  <div className="w-full h-full rounded-full border border-amber-300/30 animate-pulse"/>
                </div>
              </div>
            </div>
            <div className="text-amber-100">
              <div className="font-semibold text-sm">MAIA</div>
              <div className="text-xs text-amber-400/80">Soullab Oracle</div>
            </div>
          </div>

          {/* Lab Tools Toggle */}
          <motion.button
            onClick={onLabToolsToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${showLabTools
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-white/5 text-amber-400/60 border border-white/10 hover:bg-white/10'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Beaker size={14} />
            <span>Lab Tools</span>
          </motion.button>
        </div>

        {/* Center: Mode Selection & Voice Toggle */}
        <div className="flex items-center gap-4">

          {/* Voice/Text Toggle */}
          <motion.button
            onClick={onToggleVoiceMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${isVoiceMode
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-white/5 text-amber-400/80 border border-white/20 hover:bg-white/10'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isVoiceMode ? <Mic size={16} /> : <MicOff size={16} />}
            <span>{isVoiceMode ? 'Voice' : 'Text'}</span>
          </motion.button>

          {/* Mode Selection */}
          <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-1">
            {modeOptions.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;

              return (
                <motion.button
                  key={mode.id}
                  onClick={() => onModeChange?.(mode.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                    ${isSelected
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-amber-400/70 hover:text-amber-300 hover:bg-white/5'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={14} />
                  <span>{mode.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: Session Control */}
        <div className="flex items-center gap-3">
          {sessionActive && sessionTimeRemaining && (
            <div className="text-xs text-amber-400/70 font-mono">
              {sessionTimeRemaining}
            </div>
          )}

          <motion.button
            onClick={onSessionControl}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${sessionActive
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Clock size={16} />
            <span>{sessionActive ? 'End Session' : 'Start Session'}</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};