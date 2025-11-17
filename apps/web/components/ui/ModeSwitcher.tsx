import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, MessageSquare, User, FileText, Clock } from 'lucide-react';

export interface ModeSwitcherProps {
  isVoiceMode?: boolean;
  onToggleVoiceMode?: () => void;
  selectedMode?: string;
  onModeChange?: (mode: string) => void;
  sessionActive?: boolean;
  onSessionControl?: () => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  isVoiceMode = false,
  onToggleVoiceMode,
  selectedMode = 'dialogue',
  onModeChange,
  sessionActive = false,
  onSessionControl,
}) => {
  const modeOptions = [
    { id: 'dialogue', label: 'Dialogue', icon: MessageSquare },
    { id: 'patient', label: 'Patient', icon: User },
    { id: 'scribe', label: 'Scribe', icon: FileText }
  ];

  return (
    <div className="flex items-center gap-4">
      {/* Voice/Text Toggle */}
      <motion.button
        onClick={onToggleVoiceMode}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors
          ${isVoiceMode
            ? 'bg-soul-surface text-soul-textPrimary border border-soul-accent'
            : 'bg-soul-surface/50 text-soul-textSecondary border border-soul-border hover:bg-soul-surface'
          }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isVoiceMode ? <Mic size={14} /> : <MicOff size={14} />}
        {isVoiceMode ? 'Voice' : 'Text'}
      </motion.button>

      {/* Mode Selection */}
      <div className="flex items-center gap-1 bg-soul-surface/30 rounded p-1">
        {modeOptions.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              onClick={() => onModeChange?.(mode.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors
                ${isSelected
                  ? 'bg-soul-accent/20 text-soul-textPrimary'
                  : 'text-soul-textSecondary hover:text-soul-textPrimary hover:bg-soul-surface/20'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={12} />
              {mode.label}
            </motion.button>
          );
        })}
      </div>

      {/* Session Control */}
      <motion.button
        onClick={onSessionControl}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors
          ${sessionActive
            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
            : 'bg-soul-surface text-soul-textPrimary border border-soul-border hover:bg-soul-surface/80'
          }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Clock size={14} />
        {sessionActive ? 'End Session' : 'Start Session'}
      </motion.button>
    </div>
  );
};