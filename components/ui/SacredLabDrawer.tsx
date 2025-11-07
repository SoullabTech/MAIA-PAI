/**
 * Sacred Lab Drawer - Contextual navigation for SOULLAB
 *
 * Philosophy: Interface recedes to let presence deepen
 * Tools are "on the shelf" until needed - like a real lab
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  FileText,
  Radio,
  User,
  Sparkles,
  Upload,
  Eye,
  EyeOff,
  Heart,
  Download,
  Home,
  Mic,
  MicOff,
  Square,
  MessageSquare,
  Volume2,
  Sliders,
  Clock,
  Brain,
  Zap
} from 'lucide-react';

interface SacredLabDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onAction?: (action: string) => void;
  showVoiceText?: boolean;
  isFieldRecording?: boolean;
  isScribing?: boolean;
  isMuted?: boolean;
  isResponding?: boolean;
  isAudioPlaying?: boolean;
  showChatInterface?: boolean;
  voice?: string;
  listeningMode?: 'normal' | 'patient' | 'session';
}

export const SacredLabDrawer: React.FC<SacredLabDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onAction,
  showVoiceText,
  isFieldRecording,
  isScribing,
  isMuted,
  isResponding,
  isAudioPlaying,
  showChatInterface,
  voice,
  listeningMode,
}) => {
  const menuSections = [
    {
      title: 'INTERFACE CONTROLS',
      icon: '🎛️',
      items: [
        {
          icon: Home,
          label: 'Home',
          action: () => onNavigate('/maya'),
          description: 'Return to main interface'
        },
        {
          icon: isMuted ? MicOff : Mic,
          label: isMuted ? 'Turn Microphone ON' : 'Turn Microphone OFF',
          action: () => onAction?.('toggle-microphone'),
          description: isMuted ? 'Enable voice input' : 'Disable voice input',
          isActive: !isMuted,
        },
        ...(isResponding || isAudioPlaying ? [{
          icon: Square,
          label: 'Stop MAIA',
          action: () => onAction?.('emergency-stop'),
          description: 'Interrupt current response',
          isActive: true,
        }] : []),
        {
          icon: MessageSquare,
          label: showChatInterface ? 'Voice Mode' : 'Chat Mode',
          action: () => onAction?.('toggle-chat'),
          description: showChatInterface ? 'Switch to voice input' : 'Switch to text chat',
          isActive: showChatInterface,
        },
        {
          icon: Volume2,
          label: 'Change Voice',
          action: () => onAction?.('open-voice-menu'),
          description: `Current: ${voice || 'alloy'}`
        },
        {
          icon: Sliders,
          label: 'Voice Settings',
          action: () => onAction?.('open-audio-settings'),
          description: 'Speed, warmth, prosody'
        },
      ],
    },
    {
      title: 'DOCUMENTATION',
      icon: '📊',
      items: [
        {
          icon: BookOpen,
          label: 'Sacred Journal',
          action: () => onNavigate('/journal'),
          description: 'Capture your transformative moments'
        },
        {
          icon: FileText,
          label: 'Lab Notes',
          action: () => onNavigate('/lab-notes'),
          description: 'Research and discoveries'
        },
        {
          icon: Radio,
          label: isFieldRecording ? 'Stop Field Recording' : 'Field Protocol',
          action: () => onAction?.('field-protocol'),
          description: 'Document consciousness explorations',
          isActive: isFieldRecording,
        },
        {
          icon: Mic,
          label: isScribing ? 'Stop Scribe & Download' : 'Start Scribe Mode',
          action: () => onAction?.('scribe-mode'),
          description: isScribing
            ? 'End session & get elemental synopsis'
            : 'Passive voice recording + active consultation',
          isActive: isScribing,
        },
        ...(isScribing ? [{
          icon: Brain,
          label: 'Review Session with MAIA',
          action: () => onAction?.('review-with-maia'),
          description: 'Discuss session for supervision & insights'
        }] : []),
      ],
    },
    {
      title: 'YOUR MATRIX',
      icon: '🧬',
      items: [
        {
          icon: User,
          label: 'Profile',
          action: () => onNavigate('/profile'),
          description: 'Your soul signature'
        },
        {
          icon: Sparkles,
          label: 'Cosmic Blueprint',
          action: () => onNavigate('/birth-chart'),
          description: 'Your birth chart & astrology'
        },
        {
          icon: Heart,
          label: 'Favorites',
          action: () => onNavigate('/favorites'),
          description: 'Cherished moments & insights'
        },
      ],
    },
    {
      title: 'TOOLS',
      icon: '🔧',
      items: [
        {
          icon: Upload,
          label: 'Upload Files',
          action: () => onAction?.('upload'),
          description: 'Share files with MAIA'
        },
        {
          icon: Download,
          label: 'Download Transcript',
          action: () => onAction?.('download-transcript'),
          description: 'Save conversation as markdown file'
        },
        {
          icon: showVoiceText ? Eye : EyeOff,
          label: showVoiceText ? 'Hide Transcript' : 'Show Transcript',
          action: () => onAction?.('toggle-text'),
          description: 'Toggle voice transcript display'
        },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            className="fixed bottom-0 left-0 right-0 z-[100] max-h-[85vh] overflow-y-auto"
            style={{
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            <div className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-t-3xl shadow-2xl border-t border-[#D4B896]/20">
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-[#D4B896]/30 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4B896]/10">
                <div>
                  <h2 className="text-xl font-light text-[#D4B896] tracking-wide">
                    Lab Tools
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: '#E8C99B', opacity: 0.8 }}>
                    Your sacred workspace
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5 text-[#D4B896]/60" />
                </button>
              </div>

              {/* Menu Sections */}
              <div className="px-6 py-6 space-y-8">
                {menuSections.map((section, sectionIdx) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIdx * 0.1 }}
                  >
                    {/* Section Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{section.icon}</span>
                      <h3 className="text-sm font-medium text-[#D4B896]/70 tracking-widest">
                        {section.title}
                      </h3>
                    </div>

                    {/* Section Items */}
                    <div className="space-y-2">
                      {section.items.map((item, itemIdx) => {
                        const Icon = item.icon;
                        return (
                          <motion.button
                            key={item.label}
                            onClick={() => {
                              item.action();
                              if (!item.label.includes('Toggle') && !item.label.includes('Upload')) {
                                onClose();
                              }
                            }}
                            className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all group ${
                              item.isActive
                                ? 'bg-red-500/20 border border-red-400/30'
                                : 'bg-white/5 hover:bg-[#D4B896]/10 border border-transparent hover:border-[#D4B896]/20'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                              item.isActive
                                ? 'bg-red-500/20'
                                : 'bg-[#D4B896]/10 group-hover:bg-[#D4B896]/20'
                            } transition-all`}>
                              <Icon className={`w-5 h-5 ${
                                item.isActive ? 'text-red-400' : 'text-[#D4B896]'
                              }`} />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium" style={{
                                color: item.isActive ? 'rgb(252 165 165)' : '#E8C99B'
                              }}>
                                {item.label}
                              </div>
                              <div className="text-xs mt-0.5" style={{ color: '#E8C99B', opacity: 0.7 }}>
                                {item.description}
                              </div>
                            </div>
                            <div className={`flex-shrink-0 text-[#D4B896]/40 group-hover:text-[#D4B896]/80 transition-all ${
                              item.isActive ? 'animate-pulse' : ''
                            }`}>
                              →
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}

                {/* Spacer for safe area */}
                <div className="h-8" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
