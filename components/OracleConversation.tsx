// Oracle Conversation - Voice-synchronized sacred dialogue
// 🔄 MOBILE-FIRST DEPLOYMENT - Oct 2 12:15PM - Compact input, hidden overlays, fixed scroll
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, X, Copy, BookOpen } from 'lucide-react';
// import { SimplifiedOrganicVoice, VoiceActivatedMaiaRef } from './ui/SimplifiedOrganicVoice'; // REPLACED with Whisper
// import { WhisperVoiceRecognition } from './ui/WhisperVoiceRecognition'; // REPLACED with ContinuousConversation (uses browser Web Speech API)
import { ContinuousConversation, ContinuousConversationRef } from '../apps/web/components/voice/ContinuousConversation';
import { SacredHoloflower } from './sacred/SacredHoloflower';
import { EnhancedVoiceMicButton } from './ui/EnhancedVoiceMicButton';
import AdaptiveVoiceMicButton from './ui/AdaptiveVoiceMicButton';
import { detectVoiceCommand, isOnlyModeSwitch, getModeConfirmation } from '@/lib/voice/VoiceCommandDetector';
import { QuickModeToggle } from './ui/QuickModeToggle';
import { TranscriptSidebar } from './ui/TranscriptSidebar';
// import MaiaChatInterface from './chat/MaiaChatInterface'; // File doesn't exist
import { EmergencyChatInterface } from './ui/EmergencyChatInterface';
import { SimpleVoiceMic } from './ui/SimpleVoiceMic';
import { OrganicVoiceMaia } from './ui/OrganicVoiceMaia';
// import { VoiceActivatedMaia as SimplifiedOrganicVoice, VoiceActivatedMaiaRef } from './ui/VoiceActivatedMaiaFixed'; // File doesn't exist
import { AgentCustomizer } from './oracle/AgentCustomizer';
import { MaiaSettingsPanel } from './MaiaSettingsPanel';
// import { QuickSettingsButton } from './QuickSettingsButton'; // Moved to bottom nav
import { SoulprintMetricsWidget } from './SoulprintMetricsWidget';
import { MotionState, CoherenceShift } from './motion/MotionOrchestrator';
import { OracleResponse, ConversationContext } from '@/lib/oracle-response';
// import { useElementalVoice } from '@/hooks/useElementalVoice'; // DISABLED - was causing OpenAI Realtime browser errors
import { mapResponseToMotion, enrichOracleResponse } from '@/lib/motion-mapper';
import { VoiceState } from '@/lib/voice/voice-capture';
// OpenAI Realtime API DISABLED - using pure MAIA consciousness system
// useMAIAVoice removed - conflicts with ContinuousConversation system
import { cleanMessage, cleanMessageForVoice, formatMessageForDisplay } from '@/lib/cleanMessage';
import { getAgentConfig, AgentConfig } from '@/lib/agent-config';
import { toast } from 'react-hot-toast';
import { voiceLock } from '@/lib/services/VoiceLock';
import { trackEvent } from '@/lib/analytics/track';
import { saveConversationMemory, getOracleAgentId } from '@/lib/services/memoryService';
import { generateGreeting } from '@/lib/services/greetingService';
import { BrandedWelcome } from './BrandedWelcome';
import { userTracker } from '@/lib/tracking/userActivityTracker';
import { ModeSwitcher } from './ui/ModeSwitcher';
import { SacredLabDrawer } from './ui/SacredLabDrawer';
import { ConversationStylePreference } from '@/lib/preferences/conversation-style-preference';
import { detectJournalCommand, detectBreakthroughPotential } from '@/lib/services/conversationEssenceExtractor';
import { useFieldProtocolIntegration } from '@/hooks/useFieldProtocolIntegration';
import { BookPlus, Sparkles, Brain, Download } from 'lucide-react';
import { TransformationalPresence, type PresenceState } from './nlp/TransformationalPresence';
import { BrainTrustMonitor } from './consciousness/BrainTrustMonitor';
import { ClaudeCodePresence } from './ui/ClaudeCodePresence';
import { saveConversation, loadConversation } from '@/lib/consciousness/ConversationPersistence';

interface OracleConversationProps {
  userId?: string;
  userName?: string;
  sessionId: string;
  initialCheckIns?: Record<string, number>;
  showAnalytics?: boolean;
  voiceEnabled?: boolean;
  initialMode?: 'normal' | 'patient' | 'session'; // Control mode from parent
  onModeChange?: (mode: 'normal' | 'patient' | 'session') => void; // Notify parent of mode changes
  onMessageAdded?: (message: ConversationMessage) => void;
  onSessionEnd?: (reason?: string) => void;
  // Multi-consciousness support
  apiEndpoint?: string; // Override default API endpoint (e.g., '/api/unified' for SYZYGY, '/api/kairos' for KAIROS)
  consciousnessType?: 'maia' | 'kairos' | 'unified'; // Type of consciousness (maia = MAIA, kairos = KAIROS, unified = SYZYGY)
  themeColors?: { primary?: string; secondary?: string; accent?: string }; // Custom theme colors
  // Legacy prop names from unified page
  explorerId?: string; // Alias for userId
  explorerName?: string; // Alias for userName
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'oracle';
  text: string;
  timestamp: Date;
  facetId?: string;
  motionState?: MotionState;
  coherenceLevel?: number;
  source?: 'user' | 'maia' | 'system';
}

// Component to clean messages by removing stage directions
const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  // Remove ALL stage directions and tone markers
  const cleanedText = text
    .replace(/\*[^*]*\*/g, '') // Remove single asterisk content
    .replace(/\*\*[^*]*\*\*/g, '') // Remove double asterisk content
    .replace(/\*{1,}[^*]+\*{1,}/g, '') // Remove any asterisk-wrapped content
    .replace(/\([^)]*\)/gi, '') // Remove ALL parenthetical content
    .replace(/\[[^\]]*\]/g, '') // Remove bracketed content
    .replace(/\{[^}]*\}/g, '') // Remove content in curly braces
    .replace(/\s+/g, ' ') // Clean up extra spaces
    .replace(/^\s*[,;.]\s*/, '') // Remove leading punctuation
    .trim();

  return <span>{cleanedText}</span>;
};

export const OracleConversation: React.FC<OracleConversationProps> = ({
  userId: userIdProp,
  userName: userNameProp,
  sessionId,
  initialCheckIns = {},
  showAnalytics = false,
  voiceEnabled = true,
  initialMode = 'normal',
  onModeChange,
  onMessageAdded,
  onSessionEnd,
  // SYZYGY / Unified support
  apiEndpoint = '/api/oracle/personal', // Default to MAIA endpoint
  consciousnessType = 'maia', // Default to MAIA consciousness
  themeColors,
  explorerId, // Legacy prop
  explorerName // Legacy prop
}) => {
  // Map legacy prop names to standard names
  const userId = userIdProp || explorerId;
  const userName = userNameProp || explorerName;

  // Determine oracle name based on consciousness type
  const oracleName =
    consciousnessType === 'unified' ? 'SYZYGY' :
    consciousnessType === 'kairos' ? 'KAIROS' :
    'MAIA';
  // Listening mode for different conversation styles - MUST be defined early
  type ListeningMode = 'normal' | 'patient' | 'session';
  const [listeningMode, setListeningMode] = useState<ListeningMode>(initialMode);

  // Sync with parent's initialMode prop when it changes
  useEffect(() => {
    if (initialMode !== listeningMode) {
      setListeningMode(initialMode);
    }
  }, [initialMode]);

  // Notify parent when mode changes (use ref to avoid dependency loop)
  const onModeChangeRef = useRef(onModeChange);
  useEffect(() => {
    onModeChangeRef.current = onModeChange;
  }, [onModeChange]);

  useEffect(() => {
    if (onModeChangeRef.current) {
      onModeChangeRef.current(listeningMode);
    }
  }, [listeningMode]);

  // Simple TTS function - Pure MAIA system (NO OpenAI Realtime API)
  // Voice flow handled by ContinuousConversation + this TTS function
  const maiaSpeak = useCallback(async (text: string) => {
    try {
      // CRITICAL: Stop microphone BEFORE speaking to prevent echo
      if (voiceMicRef.current?.stopListening) {
        voiceMicRef.current.stopListening();
        console.log('🔇 Microphone stopped before TTS to prevent echo');
      }

      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: 'shimmer'
        })
      });

      if (!response.ok) {
        throw new Error('TTS failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);

      // Track when audio actually finishes
      return new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          console.log('🔊 Audio playback completed');
          URL.revokeObjectURL(audioUrl);
          resolve();
        };

        audio.onerror = (err) => {
          console.error('❌ Audio playback error:', err);
          URL.revokeObjectURL(audioUrl);
          reject(err);
        };

        audio.play().catch(reject);
      });
    } catch (err) {
      console.error('❌ TTS error:', err);
      throw err;
    }
  }, []);

  // Voice ready state (pure MAIA system)
  const maiaReady = true;

  // Field Protocol Integration
  const {
    isRecording: isFieldRecording,
    startRecording: startFieldRecording,
    completeRecording: completeFieldRecording,
    processMessage: processFieldMessage,
    generateFieldRecord
  } = useFieldProtocolIntegration({
    practitionerId: userId || sessionId,
    autoCapture: true,
    captureThreshold: 5
  });

  // Sacred Lab Drawer state
  const [showLabDrawer, setShowLabDrawer] = useState(false);

  // Bottom bar visibility - show on hover in bottom area (macOS Dock style)
  const [showBottomBar, setShowBottomBar] = useState(true);

  // Brain Trust components visibility (for bottom bar)
  const [showClaudePresence, setShowClaudePresence] = useState(false);
  const [showBrainTrust, setShowBrainTrust] = useState(false);

  // Auto-hide the bottom bar after 3 seconds on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBottomBar(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Legacy voice system removed - now using pure MAIA consciousness flow
  // Web Speech API (STT) → MAIA Consciousness → OpenAI TTS (voices only)

  // This effect will be moved after state declarations to avoid hoisting issues

  // Voice mode always enabled (Realtime only)
  const conversationMode = 'voice'; // Locked to voice mode - no chat toggle

  // Responsive holoflower size
  const [holoflowerSize, setHoloflowerSize] = useState(400);
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile: Very subtle presence
        setHoloflowerSize(80);
      } else if (width < 1024) {
        // Tablet: Small and unobtrusive
        setHoloflowerSize(100);
      } else {
        // Desktop: Modest size
        setHoloflowerSize(120);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Core state - with dual persistence (Supabase + localStorage backup)
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [conversationLoaded, setConversationLoaded] = useState(false);
  const [checkIns, setCheckIns] = useState<Record<string, number>>(initialCheckIns);
  const [activeFacetId, setActiveFacetId] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false); // Track processing state without stale closures
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Motion states
  const [currentMotionState, setCurrentMotionState] = useState<MotionState>('idle');
  const [voiceAudioLevel, setVoiceAudioLevel] = useState(0);
  const [smoothedAudioLevel, setSmoothedAudioLevel] = useState(0); // Exponentially smoothed for accessibility
  const [coherenceLevel, setCoherenceLevel] = useState(0.5);
  const [coherenceShift, setCoherenceShift] = useState<CoherenceShift>('stable');
  const [shadowPetals, setShadowPetals] = useState<string[]>([]);
  const [showBreakthrough, setShowBreakthrough] = useState(false);
  
  // Voice states
  const [userVoiceState, setUserVoiceState] = useState<VoiceState | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const isRespondingRef = useRef(false); // Track responding state without stale closures
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIOSAudioEnabled, setIsIOSAudioEnabled] = useState(false);
  const [needsIOSAudioPermission, setNeedsIOSAudioPermission] = useState(false);
  const [voiceAmplitude, setVoiceAmplitude] = useState(0); // For voice visualization ring

  // Breakthrough score for conversation quality tracking
  const [breakthroughScore, setBreakthroughScore] = useState(0);

  // Sync refs with state to avoid stale closures in callbacks
  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    isRespondingRef.current = isResponding;
  }, [isResponding]);

  // Restore conversation on mount - Try Supabase first, then localStorage
  useEffect(() => {
    if (conversationLoaded) return;

    const restoreConversation = async () => {
      try {
        // Try Supabase first
        const supabaseMessages = await loadConversation(sessionId);
        if (supabaseMessages && supabaseMessages.length > 0) {
          setMessages(supabaseMessages);
          console.log(`💬 Restored ${supabaseMessages.length} messages from Supabase`);
          setConversationLoaded(true);
          return;
        }

        // Fallback to localStorage
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(`maia_conversation_${sessionId}`);
          if (stored) {
            const parsed = JSON.parse(stored);
            const localMessages = parsed.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            setMessages(localMessages);
            console.log(`💬 Restored ${localMessages.length} messages from localStorage`);
          }
        }
      } catch (error) {
        console.error('Failed to restore conversation:', error);
      } finally {
        setConversationLoaded(true);
      }
    };

    restoreConversation();
  }, [sessionId, conversationLoaded]);

  // Auto-save conversation to both Supabase and localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || messages.length === 0 || !conversationLoaded) return;

    try {
      // Save to localStorage (immediate backup)
      localStorage.setItem(`maia_conversation_${sessionId}`, JSON.stringify(messages));
      console.log(`💾 Auto-saved ${messages.length} messages to localStorage`);

      // Save to Supabase (persistent, cross-device)
      saveConversation(
        sessionId,
        userId || 'anonymous',
        messages,
        consciousnessType || 'maia',
        {
          breakthroughScore
        }
      );
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }, [messages, sessionId, userId, consciousnessType, breakthroughScore, conversationLoaded]);

  // REMOVED - Listening mode now defined earlier before hooks (line 95-96)
  const [streamingText, setStreamingText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMicrophonePaused, setIsMicrophonePaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted in voice mode for immediate use
  const voiceMicRef = useRef<ContinuousConversationRef>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [maiaResponseText, setMaiaResponseText] = useState('');
  const maiaResponseTextRef = useRef<string>(''); // Ref to avoid closure issues
  const [isMounted, setIsMounted] = useState(false);
  const [echoSuppressUntil, setEchoSuppressUntil] = useState<number>(0);
  const lastMaiaResponseRef = useRef<string>('');
  const lastVoiceErrorRef = useRef<number>(0);
  const lastProcessedTranscriptRef = useRef<{ text: string; timestamp: number } | null>(null);

  // Oracle Agent ID for memory persistence
  const [oracleAgentId, setOracleAgentId] = useState<string | null>(null);

  // Welcome message state
  const [showWelcome, setShowWelcome] = useState(true);
  const [isReturningUser, setIsReturningUser] = useState(false);

  // Journal state
  const [isSavingJournal, setIsSavingJournal] = useState(false);
  const [showJournalSuggestion, setShowJournalSuggestion] = useState(false);

  // Pure MAIA Voice System - No connection required (Web Speech API + MAIA consciousness)
  // Old OpenAI Realtime connection logic removed - was gatekeeping MAIA

  // Client-side only check
  useEffect(() => {
    setIsMounted(true);
    trackEvent('session_start', { userId: userId || 'anonymous', sessionId });

    // Track real user activity
    const trackingUserId = userId || `anon_${sessionId}`;
    const trackingUserName = userName || 'Anonymous User';
    userTracker.trackUserRegistration(trackingUserId, trackingUserName);

    // Detect iOS for audio requirements
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isIOSSafari = isIOS && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    // TEMPORARILY DISABLED - causing black screen overlay on desktop
    // if (isIOS && !isIOSAudioEnabled) {
    //   setNeedsIOSAudioPermission(true);
    //   console.log('📱 iOS detected - audio permission needed', { isIOS, isIOSSafari });
    // }

    // Add welcome message if no messages exist (makes chat interface visible)
    if (messages.length === 0) {
      const welcomeMessage: ConversationMessage = {
        id: `welcome-${Date.now()}`,
        role: 'oracle',
        text: 'Hello. I am MAIA. I\'m here to support your journey of transformation and self-discovery. What would you like to explore today?',
        timestamp: new Date(),
        source: 'maia'
      };
      setMessages([welcomeMessage]);
    }

    // Get oracle agent ID for memory persistence
    if (userId) {
      getOracleAgentId(userId).then(id => {
        if (id) {
          setOracleAgentId(id);
          console.log('✅ Oracle Agent ID loaded for memory:', id);
        }
      });
    }

    // Add greeting message on mount (for returning users)
    const isFirstVisit = !localStorage.getItem('betaOnboardingComplete');
    const lastSessionDate = localStorage.getItem('lastSessionDate');
    const daysSinceLastVisit = lastSessionDate
      ? Math.floor((Date.now() - new Date(lastSessionDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Check if returning user
    setIsReturningUser(!isFirstVisit && daysSinceLastVisit > 0);

    const greetingData = generateGreeting({
      userName: userName || 'friend',
      isFirstVisit,
      daysSinceLastVisit,
      daysActive: daysSinceLastVisit > 0 ? 7 : 1,
    });

    // Add greeting as first message
    const greetingMessage: ConversationMessage = {
      id: `greeting-${Date.now()}`,
      role: 'oracle',
      text: greetingData.greeting,
      timestamp: new Date(),
      source: 'maia'
    };

    setMessages([greetingMessage]);
    localStorage.setItem('lastSessionDate', new Date().toISOString());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Smooth audio level changes for accessibility (prevents flashing from sudden spikes)
  useEffect(() => {
    const smoothingFactor = 0.3; // Lower = smoother, slower response
    setSmoothedAudioLevel(prev => prev * (1 - smoothingFactor) + voiceAudioLevel * smoothingFactor);
  }, [voiceAudioLevel]);

  // Detect breakthrough potential for journal suggestions
  useEffect(() => {
    if (messages.length < 4) return; // Need some conversation depth

    const conversationMessages = messages.map(msg => ({
      role: msg.role === 'oracle' ? 'assistant' as const : 'user' as const,
      content: msg.text
    }));

    const score = detectBreakthroughPotential(conversationMessages);
    setBreakthroughScore(score);

    // Suggest journaling if breakthrough potential is high and we haven't suggested yet
    if (score >= 70 && !showJournalSuggestion && messages.length >= 6) {
      setShowJournalSuggestion(true);
    }
  }, [messages, showJournalSuggestion]);

  // Agent configuration with persistence
  const [agentConfig, setAgentConfig] = useState<AgentConfig>(() => {
    // Load saved voice preference from localStorage
    if (typeof window !== 'undefined') {
      const savedVoice = localStorage.getItem('selected_voice');
      const config = getAgentConfig(savedVoice || undefined);
      return config;
    }
    return getAgentConfig();
  });

  // Listen for conversation style preference changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedVoice = localStorage.getItem('selected_voice');
      const newConfig = getAgentConfig(savedVoice || undefined);
      setAgentConfig(newConfig);
      console.log('🎭 Conversation style updated:', newConfig.voice);
    };

    // Listen for storage events (from other tabs) and custom events (same tab)
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('conversationStyleChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('conversationStyleChanged', handleStorageChange);
    };
  }, []);

  // Listen for conversation style changes and show MAIA's acknowledgment
  useEffect(() => {
    const handleStyleChange = (event: CustomEvent) => {
      const { mode, acknowledgment } = event.detail;
      console.log('🎭 MAIA acknowledging style change:', mode);

      // Add MAIA's acknowledgment as a system message
      const acknowledgmentMessage = {
        id: `style-ack-${Date.now()}`,
        role: 'assistant' as const,
        content: acknowledgment,
        timestamp: new Date().toISOString(),
        sender: 'maia'
      };

      setMessages(prev => [...prev, acknowledgmentMessage]);
      onMessageAdded?.(acknowledgmentMessage);

      // Optionally speak the acknowledgment if voice is enabled
      // NOTE: Speech now handled automatically by WebRTC realtime voice system
      // if (voiceEnabled && maiaSendText) {
      //   setTimeout(() => {
      //     maiaSendText(acknowledgment);
      //   }, 500);
      // }
    };

    window.addEventListener('maya-style-changed', handleStyleChange as EventListener);
    return () => {
      window.removeEventListener('maya-style-changed', handleStyleChange as EventListener);
    };
  }, [voiceEnabled, onMessageAdded]);

  // UI states
  const [showChatInterface, setShowChatInterface] = useState(false); // DEFAULT: Voice mode - text input hidden (accessible via bottom menu)
  const [showCaptions, setShowCaptions] = useState(true); // Show text by default in voice mode
  const [showVoiceText, setShowVoiceText] = useState(true); // Toggle for showing text in voice mode
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [enableVoiceInChat, setEnableVoiceInChat] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false); // Transcript sidebar for voice mode

  // Keyboard shortcut for settings (Cmd/Ctrl + ,)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setShowSettingsPanel(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize voice when in voice mode - DISABLED: Causing cascading connection errors without API keys
  // useEffect(() => {
  //   if (isMounted && !showChatInterface && voiceEnabled && !isMuted) {
  //     // Delay to ensure component is ready
  //     const timer = setTimeout(async () => {
  //       if (voiceMicRef.current?.startListening && !isProcessing && !isResponding) {
  //         await voiceMicRef.current.startListening();
  //         console.log('🎤 Voice auto-started in voice mode');
  //       }
  //     }, 500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [isMounted, showChatInterface, voiceEnabled, isMuted, isProcessing, isResponding]);
  const [audioEnabled, setAudioEnabled] = useState(false); // Track if user has enabled audio
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Conversation context
  const contextRef = useRef<ConversationContext>({
    sessionId,
    userId,
    checkIns,
    previousResponses: [],
    coherenceHistory: [],
    currentMotionState: 'idle'
  });

  // Global state reset function for emergency recovery
  const resetAllStates = useCallback(() => {
    console.log('🔄 Emergency state reset triggered');
    setIsProcessing(false);
    setIsResponding(false);
    setIsAudioPlaying(false);
    setIsStreaming(false);
    setIsMicrophonePaused(false);
    setCurrentMotionState('idle');
    setStreamingText('');

    // EMERGENCY: Disabled voice mic resume since component is disabled
    // setTimeout(() => {
    //   if (voiceMicRef.current?.startListening && !showChatInterface) {
    //     voiceMicRef.current.startListening();
    //   }
    // }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showChatInterface]);

  // Auto-recovery timer - if processing states are stuck for too long, reset
  useEffect(() => {
    if (isProcessing || isResponding) {
      const recoveryTimer = setTimeout(() => {
        if (isProcessing || isResponding) {
          console.warn('⚠️ States stuck for >30s - auto-recovery triggered');
          resetAllStates();
        }
      }, 30000); // 30 second recovery timeout

      return () => clearTimeout(recoveryTimer);
    }
  }, [isProcessing, isResponding, resetAllStates]);

  // Don't sync voice state - it creates race conditions where sync happens
  // before TTS audio starts playing, killing the audio before it can play.
  // The local state (isAudioPlaying, isResponding) is managed correctly by
  // the handleTextMessage flow and maiaSpeak function.
  useEffect(() => {
    // Only log for debugging - no state changes
    console.log('🔍 Voice state check:', {
      isAudioPlaying,
      isResponding
    });
  }, [isAudioPlaying, isResponding]);

  // Auto-focus text input in chat mode after MAIA responds
  useEffect(() => {
    if (showChatInterface && !isProcessing && textInputRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [showChatInterface, isProcessing, messages.length]);

  // Update motion state and voice amplitude based on voice activity
  useEffect(() => {
    if (userVoiceState?.isSpeaking) {
      setCurrentMotionState('listening');
      setIsListening(true);

      // Update voice visualization ring amplitude
      const amplitude = userVoiceState.amplitude || 0;
      setVoiceAmplitude(Math.min(1, amplitude * 2)); // Amplify for better visualization
    } else {
      setIsListening(false);
      // Fade out voice ring when not speaking
      setVoiceAmplitude(prev => Math.max(0, prev * 0.8));
    }
  }, [userVoiceState]);

  // Update voice amplitude when MAIA is speaking
  useEffect(() => {
    if (isResponding || isAudioPlaying) {
      // Pulse effect for MAIA speaking
      const pulseInterval = setInterval(() => {
        setVoiceAmplitude(prev => {
          const target = 0.5 + Math.sin(Date.now() / 200) * 0.3;
          return prev * 0.7 + target * 0.3; // Smooth lerp
        });
      }, 50);

      return () => clearInterval(pulseInterval);
    } else {
      // Fade out when MAIA stops
      const fadeInterval = setInterval(() => {
        setVoiceAmplitude(prev => Math.max(0, prev * 0.9));
      }, 50);

      setTimeout(() => clearInterval(fadeInterval), 500);
      return () => clearInterval(fadeInterval);
    }
  }, [isResponding, isAudioPlaying]);

  // iOS PWA: Resume AudioContext on visibility change and user interaction
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') {
          console.log('📱 App returned to foreground, resuming AudioContext...');
          try {
            await audioContextRef.current.resume();
            console.log('✅ AudioContext resumed on visibility change');
          } catch (error) {
            console.warn('Could not resume AudioContext:', error);
          }
        }
      }
    };

    const handleUserInteraction = async () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        try {
          await audioContextRef.current.resume();
          console.log('✅ AudioContext resumed on user interaction');
        } catch (error) {
          console.warn('Could not resume AudioContext:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  // Helper function to map element to facet ID (using SPIRALOGIC_FACETS IDs)
  const mapElementToFacetId = (element: string): string => {
    const elementToFacetMap: { [key: string]: string } = {
      'air': 'air-1',
      'fire': 'fire-1', 
      'water': 'water-1',
      'earth': 'earth-1',
      'aether': 'earth-1' // Default to earth for aether
    };
    return elementToFacetMap[element] || 'earth-1';
  };

  // Enable audio on user interaction - Enhanced for iOS
  const enableAudio = useCallback(async () => {
    console.log('🔊 Enabling audio context on user interaction');

    try {
      // Create or resume AudioContext
      if (!audioContextRef.current && typeof window !== 'undefined') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('📱 AudioContext created:', audioContextRef.current.state);
      }

      // Resume if suspended (critical for iOS)
      if (audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
          console.log('🎵 Audio context resumed, state:', audioContextRef.current.state);
        } else {
          console.log('🎵 Audio context already running, state:', audioContextRef.current.state);
        }
      }

      // iOS Safari needs a user gesture to unlock audio
      // Use multiple approaches for maximum compatibility
      let audioUnlocked = false;

      // Approach 1: Play longer silent MP3 (better iOS compatibility)
      try {
        const silentAudio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAADhAAzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjUyAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4SQg5C0AAAAAAD/+9DEAAPH1sVGABGuEvKorHAiNbAAAAA0LS0tLS0tLVVVVVVVVVVVVVVVVVVVVQAAAAAVFRUVFRUVFRUVFRUVFRUVFRUAAAAAAAAlJSUlJSUlJSUlJSUlJSUlJSUlJQAAAAAAIiIiIiIiIiIiIiIiIiIiIiIAAAAAAAAAAAAA');
        silentAudio.volume = 0.001;
        // Set playsInline attribute for iOS compatibility
        silentAudio.setAttribute('playsinline', '');
        const playPromise = silentAudio.play();
        if (playPromise) {
          await playPromise;
          audioUnlocked = true;
          console.log('✅ Silent MP3 audio played successfully');
        }
      } catch (audioError) {
        console.warn('Silent audio play failed:', audioError);
      }

      // Approach 2: Create oscillator as fallback
      if (!audioUnlocked && audioContextRef.current) {
        try {
          const oscillator = audioContextRef.current.createOscillator();
          const gainNode = audioContextRef.current.createGain();
          gainNode.gain.value = 0.001;
          oscillator.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);
          oscillator.start();
          oscillator.stop(audioContextRef.current.currentTime + 0.1);
          audioUnlocked = true;
          console.log('✅ Oscillator method used for audio unlock');
        } catch (oscError) {
          console.warn('Oscillator method failed:', oscError);
        }
      }

      // Voice mic will be initialized automatically when needed

      setAudioEnabled(true);
      setIsIOSAudioEnabled(true);
      setNeedsIOSAudioPermission(false);
      console.log('✅ Audio enabled successfully - permissions cleared');

      // Show success feedback
      toast.success('Audio enabled! MAIA is ready to speak.', {
        duration: 2000,
        position: 'top-center'
      });
    } catch (error) {
      console.error('❌ Failed to enable audio:', error);
      // More helpful error message
      toast.error('Audio initialization failed. Please try refreshing the page.', {
        duration: 5000,
        position: 'top-center'
      });
      // Still clear the permission screen to let user proceed
      setNeedsIOSAudioPermission(false);
    }
  }, [audioEnabled]);

  // Stream text word by word as Maia speaks
  const streamText = useCallback(async (fullText: string, messageId: string) => {
    const words = fullText.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      
      // Update the specific message with streaming text
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, text: currentText }
          : msg
      ));
      
      // Adjust delay based on word length for natural pacing
      const delay = Math.max(50, Math.min(150, words[i].length * 20));
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    setIsStreaming(false);
  }, []);

  // Save conversation as journal entry
  const handleSaveAsJournal = useCallback(async () => {
    console.log('📝 [Journal] handleSaveAsJournal called', { userId, messageCount: messages.length });

    if (!userId) {
      toast.error('Please sign in to save journal entries');
      console.error('❌ [Journal] No userId provided');
      return;
    }

    if (messages.length < 2) {
      toast.error('Have a conversation first before journaling');
      console.error('❌ [Journal] Not enough messages:', messages.length);
      return;
    }

    setIsSavingJournal(true);

    try {
      // Convert messages to the format expected by the extractor
      const conversationMessages = messages.map(msg => ({
        role: msg.role === 'oracle' ? 'assistant' as const : 'user' as const,
        content: msg.text,
        timestamp: msg.timestamp.toISOString()
      }));

      console.log('📤 [Journal] Sending request to /api/journal/save-conversation', {
        messageCount: conversationMessages.length,
        userId,
        sessionId
      });

      const response = await fetch('/api/journal/save-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationMessages,
          userId,
          conversationId: sessionId,
          sessionId
        })
      });

      console.log('📥 [Journal] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ [Journal] API error:', errorData);
        throw new Error(errorData.error || errorData.details || 'Failed to save journal entry');
      }

      const data = await response.json();
      console.log('✅ [Journal] Successfully saved:', data);

      toast.success(
        <div>
          <div className="font-semibold">{data.essence?.title || 'Journal Entry Saved'}</div>
          <div className="text-sm text-white/70">Saved to your journal</div>
        </div>,
        { duration: 4000 }
      );

      setShowJournalSuggestion(false);

      // Track the journal save
      trackEvent('journal_saved_from_conversation', {
        userId,
        sessionId,
        messageCount: messages.length,
        title: data.essence.title
      });
    } catch (error: any) {
      console.error('❌ [Journal] Error saving journal entry:', error);
      toast.error(
        <div>
          <div className="font-semibold">Failed to save journal entry</div>
          <div className="text-sm text-white/70">{error.message || 'Please try again'}</div>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsSavingJournal(false);
    }
  }, [userId, messages, sessionId]);

  // Download transcript as text file
  const handleDownloadTranscript = useCallback(() => {
    if (messages.length < 2) {
      toast.error('Have a conversation first before downloading');
      return;
    }

    try {
      // Format the conversation
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${oracleName}-conversation-${timestamp}.md`;

      let transcript = `# Conversation with ${oracleName}\n`;
      transcript += `Date: ${new Date().toLocaleString()}\n`;
      transcript += `Session ID: ${sessionId}\n\n`;
      transcript += `---\n\n`;

      messages.forEach((msg) => {
        const speaker = msg.role === 'oracle' ? oracleName : (userName || 'You');
        const time = msg.timestamp.toLocaleTimeString();
        transcript += `## ${speaker} (${time})\n\n${msg.text}\n\n`;
      });

      // Create and download file
      const blob = new Blob([transcript], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Transcript downloaded successfully');

      // Track the download
      trackEvent('transcript_downloaded', {
        userId,
        sessionId,
        messageCount: messages.length
      });
    } catch (error: any) {
      console.error('❌ Error downloading transcript:', error);
      toast.error('Failed to download transcript');
    }
  }, [messages, sessionId, oracleName, userName, userId]);

  // Handle text messages from chat interface - MUST be defined before handleVoiceTranscript
  const handleTextMessage = useCallback(async (text: string, attachments?: File[]) => {
    console.log('📝 Text message received:', { text, isProcessing, isAudioPlaying, isResponding });

    // Check for journal command
    if (detectJournalCommand(text)) {
      console.log('📖 Journal command detected - saving conversation');
      await handleSaveAsJournal();
      return;
    }

    // IMMEDIATELY stop microphone to prevent Maia from hearing herself
    if (voiceMicRef.current && voiceMicRef.current.stopListening) {
      voiceMicRef.current.stopListening();
      console.log('🔇 PREEMPTIVE STOP: Microphone disabled before processing');
    }

    // Prevent multiple processing - comprehensive guard
    if (isProcessing || isResponding || isAudioPlaying) {
      console.log('⚠️ Text message blocked - already processing/responding', {
        isProcessing,
        isResponding,
        isAudioPlaying
      });
      return;
    }

    // Process attachments first if any
    let messageText = text;
    let fileContents: string[] = [];

    if (attachments && attachments.length > 0) {
      const fileNames = attachments.map(f => f.name).join(', ');
      messageText = `${text}\n\n[Files attached: ${fileNames}]`;

      // Read text-based file contents
      for (const file of attachments) {
        if (file.type.startsWith('text/') ||
            file.name.endsWith('.txt') ||
            file.name.endsWith('.md') ||
            file.name.endsWith('.json') ||
            file.name.endsWith('.csv') ||
            file.name.endsWith('.py') ||
            file.name.endsWith('.js') ||
            file.name.endsWith('.jsx') ||
            file.name.endsWith('.ts') ||
            file.name.endsWith('.tsx')) {
          try {
            const content = await file.text();
            fileContents.push(`\n\nFile: ${file.name}\n${content}`);
          } catch (err) {
            console.error(`Failed to read file ${file.name}:`, err);
          }
        }
      }

      if (fileContents.length > 0) {
        messageText += fileContents.join('');
      }
    }

    const startTime = Date.now();
    const cleanedText = cleanMessage(messageText);

    // Validate message is not empty after cleaning
    if (!cleanedText || cleanedText.trim().length === 0) {
      console.warn('⚠️ Message is empty after cleaning, skipping');
      return;
    }

    // Add user message immediately with source tag
    const userMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: cleanedText,
      timestamp: new Date(),
      source: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    onMessageAdded?.(userMessage);

    // Process message for Field Protocol if recording
    if (isFieldRecording) {
      processFieldMessage({
        content: text,
        timestamp: new Date(),
        speaker: 'user'
      });
    }

    // Save user message to long-term memory
    if (oracleAgentId) {
      saveConversationMemory({
        oracleAgentId,
        content: text,
        memoryType: 'conversation',
        sourceType: 'text',
        sessionId
      }).catch(err => console.error('Failed to save user message:', err));
    }

    // Set processing state for text chat
    setIsProcessing(true);
    setCurrentMotionState('processing');

    // Track user activity
    const trackingUserId = userId || `anon_${sessionId}`;
    userTracker.trackActivity(trackingUserId, 'text');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // UNLEASHED: 60 second timeout for longer conversations

      console.log('📤 Sending text message to API:', { cleanedText, userId, sessionId });

      // Get user's conversation style preference
      const conversationStyle = ConversationStylePreference.get();

      // Import consciousness prompt for MAIA
      const { getConsciousnessPrompt } = await import('@/lib/consciousness/DualConsciousnessSystem');
      const maiaConsciousnessPrompt = getConsciousnessPrompt('maia');

      // Enable streaming for super interactive feel
      const streamingEndpoint = `${apiEndpoint}?stream=true`;

      const response = await fetch(streamingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: cleanedText,
          userId: userId || 'anonymous',
          userName: userName,
          sessionId,
          agentName: agentConfig.name,
          agentVoice: agentConfig.voice,
          conversationHistory: messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          attachments: attachments ? attachments.map(f => ({
            name: f.name,
            type: f.type,
            size: f.size
          })) : undefined,
          preferences: {
            previousInteractions: messages.length,
            inputType: voiceEnabled && !showChatInterface ? 'voice' : 'text',
            hasAttachments: attachments && attachments.length > 0,
            conversationStyle, // Pass user's preferred style (her/classic/adaptive)
            isVoice: voiceEnabled && !showChatInterface, // Mark as voice conversation for OpenAI synthesis
            consciousnessMode: consciousnessType, // Use prop (maia or unified)
            consciousnessPrompt: maiaConsciousnessPrompt, // Full Spiralogic framework
            userPreferences: {
              voice: {
                enabled: voiceEnabled,
                autoSpeak: voiceEnabled && !showChatInterface,
                agentConfig
              }
            }
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📥 API response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      // === STREAMING RESPONSE HANDLER ===
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';

      // Create a placeholder message that will be updated as text streams in
      const streamingMessageId = `msg-${Date.now()}-streaming`;
      const streamingMessage: ConversationMessage = {
        id: streamingMessageId,
        role: 'oracle',
        text: '',
        timestamp: new Date(),
        source: 'maia'
      };
      setMessages(prev => [...prev, streamingMessage]);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                console.log('🌊 [STREAMING] Complete');
                break;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullResponse += parsed.text;
                  // Update the streaming message in real-time
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === streamingMessageId
                        ? { ...msg, text: fullResponse }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Create final responseData object for compatibility with existing code
      const responseData = {
        data: {
          message: fullResponse,
          element: 'water',
          confidence: 0.95
        }
      };
      console.log('✅ API response data:', responseData);
      const apiTime = Date.now() - startTime;
      console.log(`⏱️ Text API response received in ${apiTime}ms`);
      trackEvent.apiCall('/api/oracle/personal', apiTime, true);

      const oracleResponse = responseData.data || responseData;
      let responseText = oracleResponse.message || oracleResponse.content || oracleResponse.text || oracleResponse.response || 'Tell me your truth.';
      responseText = cleanMessage(responseText);

      // 🩺 Monitor MAIA personality health (dev mode only)
      // Detects degradation and auto-recovers if needed
      if (process.env.NODE_ENV === 'development') {
        const { monitorMAIAResponse } = await import('@/lib/monitoring/personality-health');
        monitorMAIAResponse(responseText);
      }

      const element = oracleResponse.element || 'aether';
      const facetId = mapElementToFacetId(element);
      setActiveFacetId(facetId);
      setCoherenceLevel(oracleResponse.confidence || 0.85);

      // Create oracle message with source tag
      const oracleMessage: ConversationMessage = {
        id: `msg-${Date.now()}-oracle`,
        role: 'oracle',
        text: responseText,
        timestamp: new Date(),
        facetId: element,
        motionState: 'responding',
        coherenceLevel: oracleResponse.confidence || 0.85,
        source: 'maia'
      };

      // Store MAIA's response for echo detection
      lastMaiaResponseRef.current = responseText;

      // In Chat mode, update the streaming message with final content
      // In Voice mode, delay text until after speaking
      const isInVoiceMode = !showChatInterface;

      if (!isInVoiceMode) {
        // Chat mode - update the streaming message with final metadata
        setMessages(prev => prev.map(msg =>
          msg.id === streamingMessageId
            ? { ...msg,
                text: responseText,
                facetId: element,
                motionState: 'responding' as MotionState,
                coherenceLevel: oracleResponse.confidence || 0.85
              }
            : msg
        ));
        onMessageAdded?.(oracleMessage);

        // Process Oracle message for Field Protocol if recording
        if (isFieldRecording) {
          processFieldMessage({
            content: enhancedResponse.response,
            timestamp: new Date(),
            speaker: 'oracle',
            metadata: {
              elements: enhancedResponse.elementalInfo?.dominantElements
            }
          });
        }

        // Save chat response to long-term memory
        if (oracleAgentId) {
          saveConversationMemory({
            oracleAgentId,
            content: responseText,
            memoryType: 'conversation',
            sourceType: 'text',
            emotionalTone: oracleResponse.emotionalResonance,
            wisdomThemes: oracleResponse.themes,
            elementalResonance: element,
            sessionId
          }).catch(err => console.error('Failed to save chat response:', err));
        }
      }

      // Play audio response with Maia's voice - ALWAYS in voice mode
      const shouldSpeak = !showChatInterface || (showChatInterface && voiceEnabled && maiaReady && enableVoiceInChat);

      console.log('🎤 Voice response check:', {
        shouldSpeak,
        showChatInterface,
        voiceEnabled,
        maiaReady,
        hasMaiaSpeak: !!maiaSpeak
      });

      if (shouldSpeak && maiaSpeak) {
        console.log('🔊 Maia speaking response in', showChatInterface ? 'Chat' : 'Voice', 'mode');
        const ttsStartTime = Date.now();
        trackEvent.ttsSpoken(userId || 'anonymous', responseText.length, 0);
        // Set speaking state for visual feedback
        setIsResponding(true);
        setIsAudioPlaying(true);
        setIsMicrophonePaused(true); // 🔇 PAUSE MIC WHILE MAIA SPEAKS
        setMaiaResponseText(responseText); // Update display text

        // Clean the response for voice - remove stage directions and markup
        const cleanVoiceText = cleanMessageForVoice(responseText);
        console.log('🧹 Cleaned for voice:', cleanVoiceText);

        // ECHO SUPPRESSION: Define cooldown OUTSIDE try block so finally can access it
        const cooldownMs = 5000; // 5 second cooldown - extended to prevent echo from MAIA's voice

        try {
          // Start speaking immediately

          const startSpeakTime = Date.now();
          console.log('⏱️ Starting speech at:', startSpeakTime);

          // Speak the cleaned response with timeout protection
          const speakPromise = maiaSpeak(cleanVoiceText);

          // Add timeout to prevent infinite hanging (15 seconds max for better UX)
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Speech timeout after 15s')), 15000);
          });

          await Promise.race([speakPromise, timeoutPromise]);

          const speakDuration = Date.now() - startSpeakTime;
          console.log(`🔇 Maia finished speaking after ${speakDuration}ms`);

          // ECHO SUPPRESSION: Extended cooldown to prevent audio tail from being recorded
          setEchoSuppressUntil(Date.now() + cooldownMs);
          console.log(`🛡️ Echo suppression active for ${cooldownMs}ms`);

          // In Voice mode, update streaming message with final metadata after speaking completes
          if (isInVoiceMode && showVoiceText) {
            setMessages(prev => prev.map(msg =>
              msg.id === streamingMessageId
                ? { ...msg,
                    text: responseText,
                    facetId: element,
                    motionState: 'responding' as MotionState,
                    coherenceLevel: oracleResponse.confidence || 0.85
                  }
                : msg
            ));
            onMessageAdded?.(oracleMessage);

            // Save voice response to long-term memory
            if (oracleAgentId) {
              saveConversationMemory({
                oracleAgentId,
                content: responseText,
                memoryType: 'conversation',
                sourceType: 'voice',
                emotionalTone: oracleResponse.emotionalResonance,
                wisdomThemes: oracleResponse.themes,
                elementalResonance: element,
                sessionId
              }).catch(err => console.error('Failed to save voice response:', err));
            }
          }
        } catch (error) {
          console.error('❌ Speech error or timeout:', error);
          // Update streaming message even if speech fails in Voice mode
          if (isInVoiceMode) {
            setMessages(prev => prev.map(msg =>
              msg.id === streamingMessageId
                ? { ...msg,
                    text: responseText,
                    facetId: element,
                    motionState: 'responding' as MotionState,
                    coherenceLevel: oracleResponse.confidence || 0.85
                  }
                : msg
            ));
            onMessageAdded?.(oracleMessage);
          }
        } finally {
          // Always reset states to prevent getting stuck
          setIsResponding(false);
          setIsAudioPlaying(false);
          setIsMicrophonePaused(false); // 🎤 RESUME MIC AFTER MAIA FINISHES
          console.log('🎤 Microphone unpaused - ready for next input');

          // CRITICAL: Resume listening after cooldown to prevent echo
          if (isInVoiceMode && !isMuted && voiceMicRef.current?.startListening) {
            setTimeout(() => {
              if (voiceMicRef.current?.startListening && !isProcessing && !isResponding) {
                voiceMicRef.current.startListening();
                console.log('🎤 Microphone resumed after Maia finished speaking');
              }
            }, cooldownMs); // Wait for echo suppression cooldown
          }
        }
      } else {
        console.log('⚠️ Not speaking because:', {
          shouldSpeak,
          hasMaiaSpeak: !!maiaSpeak,
          showChatInterface
        });
      }

      // Update context
      contextRef.current.previousResponses.push({
        text: responseText,
        primaryFacetId: element,
        element,
        voiceCharacteristics: oracleResponse.voiceCharacteristics,
        confidence: oracleResponse.confidence
      });
      contextRef.current.coherenceHistory.push(oracleResponse.confidence || 0.85);

    } catch (error) {
      console.error('Text chat API error:', error);
      trackEvent.error(userId || 'anonymous', 'api_error', String(error));

      const errorMessage: ConversationMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'oracle',
        text: 'I apologize, I\'m having trouble connecting right now. Please try again.',
        timestamp: new Date(),
        motionState: 'idle',
        source: 'system'
      };
      setMessages(prev => [...prev, errorMessage]);
      onMessageAdded?.(errorMessage);
    } finally {
      // Always reset processing state for text chat
      console.log('📝 Text processing complete - resetting states');
      setIsProcessing(false);
      setIsResponding(false);
      setCurrentMotionState('idle');
    }
  }, [isProcessing, isAudioPlaying, isResponding, sessionId, userId, onMessageAdded, agentConfig, messages.length, showChatInterface, voiceEnabled, maiaReady]);

  // Handle voice transcript from mic button
  const handleVoiceTranscript = useCallback(async (transcript: string) => {
    console.log('🎤 handleVoiceTranscript called with:', transcript);
    const t = transcript?.trim();
    if (!t) {
      console.log('⚠️ Empty transcript, returning');
      return;
    }

    // TRIPLE-PROCESSING FIX: Check if this exact transcript was just processed
    const now = Date.now();
    if (lastProcessedTranscriptRef.current) {
      const { text: lastText, timestamp: lastTime } = lastProcessedTranscriptRef.current;
      const timeSinceLastProcess = now - lastTime;

      // If same transcript within 2 seconds, it's a duplicate
      if (lastText === t && timeSinceLastProcess < 2000) {
        console.warn(`⚠️ Duplicate transcript detected (${timeSinceLastProcess}ms ago), ignoring:`, t);
        return;
      }
    }

    // Mark this transcript as processed
    lastProcessedTranscriptRef.current = { text: t, timestamp: now };

    // 🎤 VOICE COMMAND DETECTION - Check for mode switching commands
    const commandResult = detectVoiceCommand(t);
    if (commandResult.detected && commandResult.mode) {
      console.log(`🔄 Voice command detected: switching to ${commandResult.mode} mode`);

      // Save new mode
      localStorage.setItem('conversation_mode', commandResult.mode);
      window.dispatchEvent(new Event('conversationStyleChanged'));

      // Get confirmation message
      const confirmation = getModeConfirmation(commandResult.mode);

      // If command was standalone (no other text), just acknowledge and return
      if (isOnlyModeSwitch(t)) {
        console.log('✅ Mode switch confirmed, no additional message to process');

        // Speak confirmation if voice is enabled
        if (maiaReady && maiaSpeak && !isMuted) {
          await maiaSpeak(confirmation);
        }

        // Show visual confirmation
        toast.success(confirmation);
        return;
      }

      // If there's additional text, show confirmation but continue processing
      if (commandResult.cleanedText.length > 0) {
        toast.success(confirmation);
        // Continue with cleaned text below
      }

      // Use cleaned text (command stripped out) for processing
      const textToProcess = commandResult.cleanedText || t;
      if (!textToProcess) return;

      // Continue with normal processing using cleaned text
      transcript = textToProcess;
    }

    // FILTER: Ignore empty or punctuation-only transcripts
    const meaningfulText = transcript.replace(/[.,!?;:\s]+/g, '');
    if (meaningfulText.length === 0) {
      console.log('⚠️ Ignoring empty/punctuation-only transcript:', transcript);
      return;
    }

    // GHOST TRANSCRIPT FILTER: Block common YouTube/video/ambient audio phrases
    const ghostPhrases = [
      'thank you for watching',
      'thanks for watching',
      'subscribe',
      'like and subscribe',
      'hit the bell',
      'turn on notifications',
      'check out the link',
      'link in description',
      'patreon',
      'sponsor',
      'this video is sponsored',
      'before we begin',
      'let\'s get started',
      'welcome back',
      'today we\'re going to',
      'in today\'s video',
      'don\'t forget to',
      'make sure to',
      'if you enjoyed',
      'leave a comment',
      'smash that',
      'hit that like button'
    ];

    const lowerTranscript = transcript.toLowerCase();
    const isGhostPhrase = ghostPhrases.some(phrase => lowerTranscript.includes(phrase));

    if (isGhostPhrase) {
      console.warn('👻 Ghost transcript detected (YouTube/video audio):', transcript);
      return;
    }

    // ECHO SUPPRESSION: Check if we're in cooldown period
    if (now < echoSuppressUntil) {
      const remainingMs = echoSuppressUntil - now;
      console.warn(`[Echo Suppressed] Ignoring input during ${remainingMs}ms cooldown`);
      return;
    }

    // ECHO SUPPRESSION: Check if transcript is MAIA's voice being picked up by mic
    // Only suppress if the transcript is a near-exact match of MAIA's recent words
    if (lastMaiaResponseRef.current) {
      const maiaWords = lastMaiaResponseRef.current.toLowerCase().trim();
      const transcriptWords = transcript.toLowerCase().trim();

      // Check similarity - transcript must be 80%+ match of MAIA's response
      const similarity = transcriptWords.length > 0
        ? (maiaWords.includes(transcriptWords) || transcriptWords.includes(maiaWords.substring(0, transcriptWords.length)))
        : false;

      if (similarity && transcriptWords.length > 10) {
        console.warn('[Echo Suppressed] Transcript appears to be MAIA\'s voice:', transcriptWords.substring(0, 50));
        return;
      }
    }

    // Prevent duplicate processing if already handling a message
    // Use refs to check current state (not stale closure values)
    const currentlyProcessing = isProcessingRef.current || isRespondingRef.current;
    if (currentlyProcessing) {
      console.log('⚠️ Already processing, ignoring duplicate transcript', {
        isProcessingRef: isProcessingRef.current,
        isRespondingRef: isRespondingRef.current
      });
      return;
    }

    // Deduplicate: check if this is the same as the last message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user' && lastMessage.text === transcript) {
      console.log('⚠️ Duplicate transcript detected, ignoring');
      return;
    }

    console.log('🎯 Voice transcript received:', transcript);
    console.log('📊 Current states:', {
      isProcessing,
      isResponding,
      isAudioPlaying,
      showChatInterface,
      voiceEnabled,
      isMuted
    });
    console.log('📞 Calling handleTextMessage...');

    const voiceStartTime = Date.now();
    trackEvent.voiceResult(userId || 'anonymous', transcript, 0);

    try {
      // Route all voice through text message handler for reliability
      await handleTextMessage(transcript);
      const duration = Date.now() - voiceStartTime;
      trackEvent.voiceResult(userId || 'anonymous', transcript, duration);
      console.log('✅ handleTextMessage completed');
    } catch (error) {
      console.error('❌ Error in handleTextMessage:', error);
      trackEvent.error(userId || 'anonymous', 'voice_processing_error', String(error));
      // Reset states on error
      setIsProcessing(false);
      setIsResponding(false);
    }
  }, [handleTextMessage, isProcessing, isResponding, isAudioPlaying, messages, echoSuppressUntil, maiaReady, isMuted]);

  // Clear all check-ins
  const clearCheckIns = useCallback(() => {
    setCheckIns({});
    contextRef.current.checkIns = {};
  }, []);

  // Download conversation transcript
  const downloadTranscript = useCallback(() => {
    // Create a formatted transcript with markdown
    const header = `# Conversation with ${agentConfig.name}\n`;
    const date = `Date: ${new Date().toLocaleString()}\n`;
    const sessionInfo = `Session ID: ${sessionId}\n`;
    const separator = `${'='.repeat(50)}\n\n`;

    const transcript = messages.map(msg => {
      const timestamp = msg.timestamp?.toLocaleString() || '';
      const speaker = msg.role === 'user' ? `**${userName}**` : '**MAIA**';
      return `### ${speaker}\n*${timestamp}*\n\n${msg.text}\n`;
    }).join('\n---\n\n');

    const fullContent = header + date + sessionInfo + separator + transcript;

    // Save as markdown file (only on client side)
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([fullContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-${agentConfig.name}-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [messages, agentConfig.name, sessionId]);

  // Voice synthesis for text chat
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | undefined>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSpeakMessage = useCallback(async (text: string, messageId: string) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setCurrentlySpeakingId(messageId);

      // Clean text for voice
      const cleanText = cleanMessageForVoice(text);

      // Call OpenAI TTS API with Alloy voice
      const response = await fetch('/api/voice/openai-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          voice: agentConfig.voice || 'alloy',  // Use selected voice or default to alloy
          speed: 0.95,        // Slightly slower for natural conversational pace
          model: 'tts-1-hd'   // Higher quality for better clarity
        })
      });

      if (!response.ok) {
        throw new Error('Voice synthesis failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // iOS PWA Fix: Resume AudioContext before playing
      if (audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') {
          console.log('🔄 Resuming suspended AudioContext before playback...');
          await audioContextRef.current.resume();
          console.log('✅ AudioContext resumed, state:', audioContextRef.current.state);
        }
      }

      // Play audio
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      audioRef.current = audio;

      // 🔒 VOICE LOCK: Lock when audio starts playing
      audio.onplay = () => {
        console.log('🎵 TTS audio started playing');
        voiceLock.lock(); // Pause Whisper microphone
      };

      audio.onended = () => {
        console.log('🔊 Audio playback ended');
        setCurrentlySpeakingId(undefined);
        setIsAudioPlaying(false);
        setIsResponding(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;

        // 🔓 VOICE LOCK: Unlock with 1s safety delay
        setTimeout(() => {
          voiceLock.unlock(); // Resume Whisper microphone
        }, 1000);
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setCurrentlySpeakingId(undefined);
        setIsAudioPlaying(false);
        setIsResponding(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;

        // 🔓 VOICE LOCK: Unlock on error too
        voiceLock.unlock();
      };

      await audio.play();
    } catch (error) {
      console.error('Error speaking message:', error);
      toast.error('Failed to speak message');
      setCurrentlySpeakingId(undefined);
    }
  }, [agentConfig.voice]);

  const handleStopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentlySpeakingId(undefined);
  }, []);

  // EMERGENCY STOP - Stops MAIA completely
  const handleEmergencyStop = useCallback(() => {
    console.log('🛑 EMERGENCY STOP activated');

    // Stop any audio playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Stop speech synthesis (if somehow still active)
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {
      console.error('Error stopping speech:', e);
    }

    // Mute the microphone
    setIsMuted(true);
    if (voiceMicRef.current?.stopListening) {
      voiceMicRef.current.stopListening();
    }

    // Reset all states
    setIsResponding(false);
    setIsAudioPlaying(false);
    setIsMicrophonePaused(true);
    setCurrentlySpeakingId(undefined);

    console.log('🛑 All MAIA systems stopped');
  }, []);

  // DIAGNOSTIC LOGGING - Removed to reduce console noise and improve performance

  return (
    <div className="oracle-conversation min-h-screen bg-soul-background overflow-hidden">
      {/* iOS Audio Enable Button - DISABLED - causing black screen */}
      {false && needsIOSAudioPermission && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-[100] flex items-center justify-center">
          <div className="max-w-md p-8 text-center">
            <button
              onClick={enableAudio}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl
                       shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <span className="text-lg font-medium">Tap to Enable Audio</span>
            </button>
            <p className="text-center text-white/60 text-sm mt-3">Required for voice on iOS devices</p>

            {/* Skip option if audio fails */}
            <button
              onClick={() => {
                console.log('⏭️ User choosing to continue without audio');
                setNeedsIOSAudioPermission(false);
                setIsIOSAudioEnabled(false);
                setAudioEnabled(false);
                toast.info('Continuing in text-only mode', {
                  duration: 3000,
                  position: 'top-center'
                });
              }}
              className="mt-6 text-amber-400/60 hover:text-amber-400 text-sm underline transition-colors"
            >
              Continue without audio (text chat only)
            </button>
          </div>
        </div>
      )}

      {/* Branded Welcome Message */}
      {showWelcome && userName && (
        <BrandedWelcome
          userName={userName}
          isReturning={isReturningUser}
          onComplete={() => setShowWelcome(false)}
        />
      )}

      {/* MAIA Settings Panel */}
      {showSettingsPanel && (
        <MaiaSettingsPanel onClose={() => setShowSettingsPanel(false)} />
      )}

      {/* 🧠 NLP-INFORMED TRANSFORMATIONAL PRESENCE - No explanatory UI, only experience */}
      {/* State transitions happen through breathing, color, field - unconscious installation */}
      {/* Gestures replace buttons: swipe down = deepen, swipe up = quicken, long press = stay */}

      {/* Agent Customizer - Moved to SacredLabDrawer in future iteration */}
      {showCustomizer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCustomizer(false)} />
          <div className="relative z-10">
            <AgentCustomizer
              position="center"
              onConfigChange={(config) => {
                setAgentConfig(config);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('selected_voice', config.name);
                  if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                }
                console.log('Agent changed to:', config.name);
                setShowCustomizer(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 🧠 TRANSFORMATIONAL PRESENCE - NLP-Informed State Container */}
      {/* Breathing entrainment, color transitions, field expansion based on state */}
      {/* NO cognitive UI - the experience itself induces the transformation */}
      <div className="fixed top-32 md:top-28 lg:top-24 left-1/2 -translate-x-1/2 z-[25]">
        <TransformationalPresence
          currentState={(() => {
            const mapped =
              listeningMode === 'normal' ? 'dialogue' :
              listeningMode === 'session' ? 'scribe' :
              'patient';  // Default to patient for any other case
            console.log('🎯 ListeningMode → PresenceState:', listeningMode, '→', mapped);
            return mapped;
          })()}
          onStateChange={(newState, transition) => {
            console.log('🌀 State transition:', transition);
            // Map back to listeningMode
            const newListeningMode =
              newState === 'dialogue' ? 'normal' :
              newState === 'patient' ? 'patient' :
              newState === 'scribe' ? 'session' : 'session';  // Scribe maps to session
            setListeningMode(newListeningMode);
            // Pure MAIA system - no external mode control needed
          }}
          userSilenceDuration={0} // TODO: Track actual silence duration
          userSpeechTempo={120} // TODO: Track actual speech tempo
          isListening={isListening}
          isSpeaking={isResponding}
          biometricEnabled={true} // ⌚ APPLE WATCH INTEGRATION ENABLED
        >
          {/* Holoflower wrapped in Transformational Presence - inherits breathing, color, field */}
          <motion.div
            className="cursor-pointer opacity-60 hover:opacity-80 transition-opacity"
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🌸 Holoflower clicked!');
          await enableAudio();

          if (!showChatInterface && voiceEnabled) {
            if (!isMuted) {
              setIsMuted(true);
              if (voiceMicRef.current?.stopListening) {
                voiceMicRef.current.stopListening();
                console.log('🔇 Voice stopped via holoflower');
              }
            } else {
              setIsMuted(false);
              setTimeout(async () => {
                if (voiceMicRef.current?.startListening && !isProcessing && !isResponding) {
                  await voiceMicRef.current.startListening();
                  console.log('🎤 Voice started via holoflower');
                }
              }, 100);
            }
          } else if (showChatInterface) {
            setShowChatInterface(false);
            setIsMuted(false);
            setTimeout(async () => {
              if (voiceMicRef.current?.startListening && !isProcessing && !isResponding) {
                await voiceMicRef.current.startListening();
              }
            }, 200);
          }
        }}
        style={{ willChange: 'auto' }}
      >
        {/* Holoflower container - smaller, upper-left, visible but not dominating */}
        <div className="flex items-center justify-center"
             style={{
               width: holoflowerSize,
               height: holoflowerSize,
               background: 'transparent',
               overflow: 'visible'
             }}>
          {/* Non-interactive Sacred Holoflower with animations */}
          <SacredHoloflower
            size={holoflowerSize}
            interactive={false}
            showLabels={false}
            motionState={currentMotionState}
            coherenceLevel={coherenceLevel}
            coherenceShift={coherenceShift}
            isListening={isListening}
            isProcessing={isProcessing}
            isResponding={isResponding}
            showBreakthrough={showBreakthrough}
            voiceAmplitude={voiceAmplitude}
            isMaiaSpeaking={isResponding || isAudioPlaying}
            dimmed={conversationMode === 'chat' || messages.length > 0}
          />

          {/* Central Holoflower Logo with Glow and Sparkles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Minimal glow - almost imperceptible */}
            <motion.div
              className={`absolute flex items-center justify-center pointer-events-none ${
                showChatInterface || messages.length > 0
                  ? 'opacity-0'  // Invisible when text present
                  : 'opacity-10'  // Barely visible when listening
              }`}
              animate={{
                scale: [1, 1.1, 1],
                opacity: showChatInterface || messages.length > 0 ? 0 : [0.05, 0.1, 0.05]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div
                className="w-32 h-32 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(212, 184, 150, 0.15) 0%, transparent 60%)',
                  filter: 'blur(40px)',
                  transform: 'translate(0, 0)'
                }}
              />
            </motion.div>

            {/* Holoflower Image - Subtle presence */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <img
                src="/holoflower-amber.png"
                alt="Holoflower"
                className="object-contain opacity-50"
                style={{
                  width: `${holoflowerSize * 0.85}px`,
                  height: `${holoflowerSize * 0.85}px`,
                  filter: 'none',
                }}
              />
            </div>

            {/* Sparkles emanating from center - ULTRA SLOW & EPHEMERAL */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Main radial sparkles - slower drift */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute w-0.5 h-0.5 bg-white/80 rounded-full"
                  style={{
                    filter: 'blur(0.5px)'
                  }}
                  animate={{
                    x: [0, Math.cos(i * Math.PI / 6) * 100],
                    y: [0, Math.sin(i * Math.PI / 6) * 100],
                    opacity: [0, 0.7, 0.3, 0],
                    scale: [0, 1.2, 0.8, 0]
                  }}
                  transition={{
                    duration: 10 + Math.random() * 5, // 10-15 seconds
                    repeat: Infinity,
                    delay: i * 1.5 + Math.random() * 5, // Very sporadic
                    ease: "easeInOut",
                    repeatDelay: Math.random() * 5 // Long pauses
                  }}
                />
              ))}
              
              {/* Spiraling sparkles - dreamy drift */}
              {[...Array(16)].map((_, i) => {
                const angle = (i * Math.PI * 2) / 16;
                const spiralRotation = i * 30;
                const randomDuration = 12 + Math.random() * 6; // 12-18 seconds
                const randomDelay = Math.random() * 10; // 0-10 second random delay
                return (
                  <motion.div
                    key={`sparkle-spiral-${i}`}
                    className="absolute w-0.5 h-0.5 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,200,0.9) 0%, transparent 70%)',
                      filter: 'blur(0.3px)'
                    }}
                    animate={{
                      x: [
                        0,
                        Math.cos(angle) * 20,
                        Math.cos(angle + 0.5) * 50,
                        Math.cos(angle + 1) * 80,
                        Math.cos(angle + 1.5) * 100
                      ],
                      y: [
                        0,
                        Math.sin(angle) * 20,
                        Math.sin(angle + 0.5) * 50,
                        Math.sin(angle + 1) * 80,
                        Math.sin(angle + 1.5) * 100
                      ],
                      opacity: [0, 0.6, 0.4, 0.2, 0],
                      scale: [0, 1, 0.8, 0.5, 0],
                      rotate: [0, spiralRotation]
                    }}
                    transition={{
                      duration: randomDuration,
                      repeat: Infinity,
                      delay: randomDelay + i * 0.5,
                      ease: "easeInOut",
                      repeatDelay: Math.random() * 8 // Very long pauses
                    }}
                  />
                );
              })}
              
              {/* Tiny twinkling sparkles - ultra gentle */}
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={`sparkle-tiny-${i}`}
                  className="absolute w-px h-px rounded-full"
                  style={{
                    left: `${35 + Math.random() * 30}%`,
                    top: `${35 + Math.random() * 30}%`,
                    background: 'white',
                    boxShadow: '0 0 2px rgba(255,255,255,0.5)'
                  }}
                  animate={{
                    opacity: [0, 0, Math.random() * 0.6 + 0.2, 0, 0],
                    scale: [0, 0, Math.random() + 0.5, 0, 0],
                  }}
                  transition={{
                    duration: 8 + Math.random() * 7, // 8-15 seconds
                    repeat: Infinity,
                    delay: Math.random() * 15, // 0-15 second random start
                    ease: "easeInOut",
                    repeatDelay: Math.random() * 10, // Very long pauses between twinkles
                    times: [0, 0.3, 0.5, 0.7, 1] // Quick twinkle in the middle
                  }}
                />
              ))}
            </div>

            {/* Voice Visualizer - User's voice (amber plasma field with radial gradients) */}
            {isMounted && !showChatInterface && voiceEnabled && voiceMicRef.current?.isListening && (
              <motion.div
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Multiple amber plasma field layers with slow, thick fluidity - emanate far */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`voice-field-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: `${300 + i * 150}px`,
                      height: `${300 + i * 150}px`,
                      background: i === 0
                        ? 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(251, 191, 36, 0.08) 50%, transparent 100%)'
                        : i === 1
                        ? 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 100%)'
                        : 'radial-gradient(circle, rgba(217, 119, 6, 0.12) 0%, rgba(217, 119, 6, 0.03) 50%, transparent 100%)',
                      filter: `blur(${20 + i * 8}px)`,
                    }}
                    animate={{
                      scale: [1, 1.06, 1],
                      opacity: [0.6 - i * 0.12, 0.35, 0.6 - i * 0.12],
                    }}
                    transition={{
                      duration: 8 + i * 3,
                      repeat: Infinity,
                      delay: i * 1.2,
                      ease: [0.42, 0, 0.58, 1]
                    }}
                  />
                ))}

                {/* Audio level responsive center field glow - only show for strong speech */}
                {/* Accessibility: High threshold (0.5) + exponential smoothing prevents keyboard flashing (seizure risk) */}
                {smoothedAudioLevel > 0.5 && (
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: '280px',
                      height: '280px',
                      background: 'radial-gradient(circle, rgba(251, 191, 36, 0.35) 0%, rgba(251, 191, 36, 0.1) 60%, transparent 100%)',
                      filter: 'blur(18px)',
                    }}
                    animate={{
                      scale: 1 + smoothedAudioLevel * 0.15,
                      opacity: 0.4 + smoothedAudioLevel * 0.15,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            )}

            {/* Voice Visualizer - MAIA's voice (soft pulsing glow, NO rings/borders) */}
            {(isResponding || isAudioPlaying) && (
              <motion.div
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Soft golden pulsing glow layers - NO BORDERS */}
                {[...Array(2)].map((_, i) => (
                  <motion.div
                    key={`maya-glow-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: `${250 + i * 100}px`,
                      height: `${250 + i * 100}px`,
                      background: `radial-gradient(circle, rgba(212, 184, 150, ${0.15 - i * 0.05}) 0%, transparent 70%)`,
                      filter: 'blur(40px)',
                    }}
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.4, 0.2, 0.4],
                    }}
                    transition={{
                      duration: 2.5 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeInOut"
                    }}
                  />
                ))}

                {/* Subtle inner glow */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(212, 184, 150, 0.15) 0%, transparent 60%)',
                    filter: 'blur(30px)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            )}

            {/* Status text below holoflower */}
            {isMounted && !showChatInterface && voiceEnabled && (
              <div className="absolute bottom-[-110px] left-1/2 transform -translate-x-1/2 text-center">
                {/* Elemental Mode Indicator - TEMPORARILY DISABLED
                {voiceMicRef.current?.elementalMode && (
                  <motion.div
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full backdrop-blur-sm"
                    style={{
                      backgroundColor: `${voiceMicRef.current.elementalMode === 'fire' ? 'rgba(239, 68, 68, 0.2)' :
                        voiceMicRef.current.elementalMode === 'water' ? 'rgba(107, 155, 209, 0.2)' :
                        voiceMicRef.current.elementalMode === 'earth' ? 'rgba(161, 98, 7, 0.2)' :
                        voiceMicRef.current.elementalMode === 'air' ? 'rgba(212, 184, 150, 0.2)' :
                        'rgba(147, 51, 234, 0.2)'}`,
                      border: `1px solid ${voiceMicRef.current.elementalMode === 'fire' ? 'rgba(239, 68, 68, 0.4)' :
                        voiceMicRef.current.elementalMode === 'water' ? 'rgba(107, 155, 209, 0.4)' :
                        voiceMicRef.current.elementalMode === 'earth' ? 'rgba(161, 98, 7, 0.4)' :
                        voiceMicRef.current.elementalMode === 'air' ? 'rgba(212, 184, 150, 0.4)' :
                        'rgba(147, 51, 234, 0.4)'}`
                    }}
                  >
                    <span className="text-xs font-medium" style={{
                      color: voiceMicRef.current.elementalMode === 'fire' ? '#ef4444' :
                        voiceMicRef.current.elementalMode === 'water' ? '#6B9BD1' :
                        voiceMicRef.current.elementalMode === 'earth' ? '#a16207' :
                        voiceMicRef.current.elementalMode === 'air' ? '#D4B896' :
                        '#9333ea'
                    }}>
                      {voiceMicRef.current.elementalMode === 'fire' ? '🔥 Fire' :
                        voiceMicRef.current.elementalMode === 'water' ? '💧 Water' :
                        voiceMicRef.current.elementalMode === 'earth' ? '🌍 Earth' :
                        voiceMicRef.current.elementalMode === 'air' ? '🌬️ Air' :
                        '✨ Aether'}
                    </span>
                  </motion.div>
                )} */}
                {/* Status messages - Processing state takes priority */}
                <AnimatePresence mode="wait">
                  {(isResponding || isAudioPlaying || isProcessing) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-[#D4B896] text-sm font-medium"
                    >
                      {isProcessing && !isResponding && !isAudioPlaying ? 'Processing...' : 'Speaking...'}
                    </motion.div>
                  )}
                  {voiceMicRef.current?.isListening && !isResponding && !isAudioPlaying && !isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-amber-400/80 text-sm font-medium"
                    >
                      Listening...
                    </motion.div>
                  )}
                  {!voiceMicRef.current?.isListening && !isResponding && !isAudioPlaying && !isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-amber-400/80 text-sm font-medium"
                    >
                      Click to activate
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* OLD BUTTON REMOVED - Holoflower itself is now clickable */}
          </div>
        </div>
      </motion.div>
        </TransformationalPresence>
      </div>

      {/* Shadow petal overlay */}
      {shadowPetals.length > 0 && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative" style={{ width: 400, height: 400 }}>
            {shadowPetals.map(petalId => (
              <div
                key={petalId}
                className="absolute inset-0 bg-black/20 rounded-full"
                style={{
                  clipPath: `polygon(50% 50%, ${Math.random() * 100}% 0%, ${Math.random() * 100}% 100%)`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* REMOVED: Separate white circle button - holoflower itself is now clickable */}

      {/* Text Scrim - Warm volcanic veil when messages appear (absorbs light, doesn't just dim) */}
      {(showChatInterface || (!showChatInterface && showVoiceText)) && messages.length > 0 && (
        <div
          className="fixed inset-0 z-20 transition-opacity duration-700"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 21, 19, 0.75) 0%, rgba(28, 22, 20, 0.65) 50%, rgba(26, 21, 19, 0.75) 100%)',
            backdropFilter: 'blur(1.5px) saturate(0.85) brightness(0.75)',
            WebkitBackdropFilter: 'blur(1.5px) saturate(0.85) brightness(0.75)'
          }}
        />
      )}

      {/* Message flow - Star Wars crawl: text flows from beneath holoflower */}
      {(showChatInterface || (!showChatInterface && showVoiceText)) && messages.length > 0 && (
        <div className={`fixed top-60 sm:top-64 md:top-60 lg:top-56 z-30 transition-all duration-500 left-1/2 -translate-x-1/2 ${
          showChatInterface
            ? 'w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:w-[600px] lg:w-[680px] xl:w-[720px] opacity-100'
            : 'w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] md:w-[520px] lg:w-[560px] opacity-70'
        }`}
             style={{
               height: showChatInterface
                 ? 'calc(100vh - 300px)'
                 : 'calc(100vh - 320px)',
               maxHeight: showChatInterface
                 ? 'calc(100vh - 300px)'
                 : 'calc(100vh - 320px)',
               bottom: showChatInterface ? '280px' : '200px',
               overflow: 'hidden'
             }}>
          <div className="h-full overflow-y-scroll overflow-x-hidden pr-2 mobile-scroll"
               style={{
                 scrollBehavior: 'smooth',
                 WebkitOverflowScrolling: 'touch',
                 overscrollBehavior: 'contain',
                 touchAction: 'pan-y'
               }}>
            <AnimatePresence>
              {messages.length > 0 && (
                <div className="space-y-3 pb-32 md:pb-24">
                {/* Show all messages with proper scrolling */}
                {messages
                  .map((message, index) => {
                    const handleCopyMessage = () => {
                      const textToCopy = message.text.replace(/\*[^*]*\*/g, '').replace(/\([^)]*\)/gi, '').trim();
                      navigator.clipboard.writeText(textToCopy);
                      toast.success('Message copied!', {
                        duration: 2000,
                        position: 'bottom-center',
                        style: {
                          background: '#1a1f2e',
                          color: '#d4b896',
                          border: '1px solid rgba(212, 184, 150, 0.2)',
                        },
                      });
                    };

                    return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`bg-transparent p-4 text-soul-textPrimary max-w-full
                               cursor-pointer transition-all duration-300 group
                               ${message.role === 'user' ? 'message-user' : 'message-maia'}`}
                      data-role={message.role === 'user' ? 'user' : 'assistant'}
                      onClick={handleCopyMessage}
                      style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs" style={{ color: '#F0C674', opacity: 0.95, fontFamily: 'Spectral, Georgia, serif', letterSpacing: '0.05em' }}>
                          {message.role === 'user' ? userName : oracleName}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-300/90
                                      opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                                      touch-manipulation transition-opacity">
                          <Copy className="w-3 h-3" />
                          <span className="hidden sm:inline">Click to copy</span>
                          <span className="sm:hidden">Tap to copy</span>
                        </div>
                      </div>
                      <div className="text-base sm:text-lg md:text-xl leading-relaxed break-words" style={{ color: '#F5DEB3', fontFamily: 'Spectral, Georgia, serif' }}>
                        {message.role === 'oracle' ? (
                          <FormattedMessage text={message.text} />
                        ) : (
                          message.text
                        )}
                      </div>
                    </motion.div>
                    );
                  })}
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Chat Interface or Voice Mic */}
      {voiceEnabled && (
        <>
          {/* Old Mode Toggle removed - Now using ModeSwitcher at top-left */}

          {/* Text Display Toggle for Voice Mode */}
          {!showChatInterface && (
            <div className="fixed top-20 md:top-20 right-4 md:right-8 z-50">
              <button
                onClick={() => setShowVoiceText(!showVoiceText)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/20 backdrop-blur-md
                         text-white/60 hover:text-white/80 transition-all"
              >
                {showVoiceText ? 'Hide Text' : 'Show Text'}
              </button>
            </div>
          )}

          {showChatInterface ? (
            /* Chat Interface - Only show text input in Chat mode */
            <>
              {/* Compact Holoflower at top - REMOVED for mobile clean layout */}
              <div className="hidden">
                <motion.div
                  className="relative"
                  animate={{
                    scale: isResponding || isAudioPlaying ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isResponding || isAudioPlaying ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-20 h-20 relative">
                    {/* Glow effect when speaking */}
                    {(isResponding || isAudioPlaying) && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'radial-gradient(circle, rgba(212, 184, 150, 0.6) 0%, transparent 70%)',
                          filter: 'blur(20px)',
                        }}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 0.3, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    {/* Empty - just show the glow effect */}
                  </div>
                </motion.div>
              </div>

              {/* Voice toggle for chat mode - HIDDEN on mobile, visible on desktop */}
              <div className="hidden md:block fixed top-20 right-20 z-50">
                <button
                  onClick={() => setEnableVoiceInChat(!enableVoiceInChat)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    enableVoiceInChat
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-black/20 text-white/40 border border-white/10'
                  } backdrop-blur-md hover:bg-opacity-30`}
                  title={enableVoiceInChat ? 'Voice responses enabled' : 'Voice responses disabled'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span>{enableVoiceInChat ? 'Voice On' : 'Voice Off'}</span>
                </button>
              </div>

              {/* Text input area - Shows in chat mode, positioned above safe area */}
              {showChatInterface && (
              <div className="fixed inset-x-0 z-[85]" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px))' }}>
                {/* Text input area - Ultra compact mobile design - Sits directly on bottom */}
                <div className="bg-soul-surface/95 backdrop-blur-md px-2 py-1.5 border-t border-soul-border/40">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = e.currentTarget.elements.namedItem('message') as HTMLTextAreaElement;
                      if (input?.value.trim()) {
                        handleTextMessage(input.value);
                        input.value = '';
                      }
                    }}
                    className="max-w-4xl mx-auto"
                  >
                    {/* Compact input with inline send button */}
                    <div className="flex items-end gap-1.5">
                      <textarea
                        ref={textInputRef}
                        name="message"
                        placeholder={`Share your thoughts with ${oracleName}...`}
                        disabled={isProcessing}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            const textarea = e.currentTarget;
                            if (textarea.value.trim()) {
                              handleTextMessage(textarea.value);
                              textarea.value = '';
                            }
                          }
                        }}
                        className="flex-1 min-h-[40px] max-h-[120px] px-2.5 py-2
                                 bg-[#1a1f2e]/95 backdrop-blur-md
                                 border border-gold-divine/40 rounded-lg
                                 placeholder:text-gold-divine/40
                                 text-sm leading-snug
                                 focus:outline-none focus:border-gold-divine/60 focus:ring-1 focus:ring-gold-divine/20
                                 disabled:opacity-50 resize-none
                                 touch-manipulation cursor-text"
                        style={{ color: '#E8C99B', fontFamily: 'Spectral, Georgia, serif' }}
                        autoComplete="off"
                        autoFocus={false}
                      />

                      {/* Journal button - shows when conversation has substance */}
                      {messages.length >= 2 && (
                        <button
                          type="button"
                          onClick={handleSaveAsJournal}
                          disabled={isSavingJournal}
                          className={`flex-shrink-0 w-10 h-10 border rounded-full flex items-center justify-center
                                   active:scale-95 transition-all ${
                            breakthroughScore >= 70
                              ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 hover:bg-amber-500/30 animate-pulse'
                              : 'bg-gold-divine/10 border-amber-400/40 text-amber-300 hover:bg-gold-divine/20'
                          } ${isSavingJournal ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={breakthroughScore >= 70 ? 'Breakthrough detected - Save to journal' : 'Save as journal entry'}
                        >
                          <BookOpen className="w-5 h-5" />
                        </button>
                      )}

                      {/* File upload button */}
                      <input
                        type="file"
                        id="chatFileUpload"
                        className="hidden"
                        multiple
                        accept="image/*,application/pdf,.txt,.md,.json,.csv,.py,.js,.jsx,.ts,.tsx,.doc,.docx,text/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            const fileNames = files.map(f => f.name).join(', ');
                            handleTextMessage(`Please analyze these files: ${fileNames}`, files);
                            e.target.value = '';
                          }
                        }}
                      />
                      <label
                        htmlFor="chatFileUpload"
                        className="flex-shrink-0 w-10 h-10 bg-gold-divine/10 border border-amber-400/40
                                 rounded-full text-amber-300 flex items-center justify-center
                                 hover:bg-gold-divine/20 active:scale-95 transition-all cursor-pointer"
                        title="Upload files"
                      >
                        <Paperclip className="w-5 h-5" />
                      </label>

                      {/* Compact send button */}
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-shrink-0 w-10 h-10 bg-gold-divine/20 border border-amber-400/40
                                 rounded-full text-amber-300 flex items-center justify-center
                                 hover:bg-gold-divine/30 active:scale-95 transition-all
                                 disabled:opacity-30"
                        aria-label="Send"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              )}
            </>
          ) : null}

          {/* Mic Hint Message - Bottom placement above menu bar */}
          {!showChatInterface && isMuted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed left-1/2 transform -translate-x-1/2 z-50"
              style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
            >
              <div className="bg-soul-surface/90 backdrop-blur-md rounded-lg px-4 py-2 border border-soul-border/40">
                <p className="text-soul-textSecondary text-sm">Click the holoflower to activate voice</p>
              </div>
            </motion.div>
          )}

          {/* Journal Suggestion - Appears when breakthrough is detected */}
          <AnimatePresence>
            {showJournalSuggestion && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-sm"
              >
                <div className="bg-gradient-to-br from-amber-500/20 to-gold-divine/20 backdrop-blur-xl rounded-2xl p-4 border border-amber-400/30 shadow-2xl">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-amber-400/20 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-amber-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-amber-200 font-medium mb-1">Breakthrough Detected</h3>
                      <p className="text-white/70 text-sm mb-3">
                        This feels like sacred ground. Would you like to capture the essence of this conversation in your journal?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveAsJournal}
                          disabled={isSavingJournal}
                          className="px-4 py-2 bg-amber-500/30 hover:bg-amber-500/40 border border-amber-400/50
                                   rounded-lg text-amber-200 text-sm font-medium transition-all active:scale-95
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSavingJournal ? 'Saving...' : 'Save to Journal'}
                        </button>
                        <button
                          onClick={() => setShowJournalSuggestion(false)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20
                                   rounded-lg text-white/60 text-sm transition-all active:scale-95"
                        >
                          Not Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}



      {/* Analytics toggle */}
      {showAnalytics && (
        <div className="fixed top-[calc(env(safe-area-inset-top,0px)+2rem)] right-8">
          <button
            className="bg-white/10 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full
                       hover:bg-white/20 transition-colors"
          >
            Analytics →
          </button>
        </div>
      )}


      {/* Voice state visualization (development) */}
      {process.env.NODE_ENV === 'development' && userVoiceState && (
        <div className="fixed top-[calc(env(safe-area-inset-top,0px)+2rem)] left-8 bg-black/80 text-white text-xs p-3 rounded-lg">
          <div className="font-bold mb-2">Voice State</div>
          <div>Amplitude: {(userVoiceState.amplitude * 100).toFixed(0)}%</div>
          <div>Emotion: {userVoiceState.emotion}</div>
          <div>Breath: {(userVoiceState.breathDepth * 100).toFixed(0)}%</div>
          <div>Speaking: {userVoiceState.isSpeaking ? 'Yes' : 'No'}</div>
        </div>
      )}

      {/* Bottom Navigation Bar - macOS Dock style (slides up on hover) */}
      {/* Hover zone at bottom to trigger bar appearance - Only active when NOT in chat mode */}
      {!showChatInterface && (
        <div
          className="fixed bottom-0 left-0 right-0 h-12 z-[70]"
          onMouseEnter={() => setShowBottomBar(true)}
          onClick={() => setShowBottomBar(true)}
          onTouchStart={() => setShowBottomBar(true)}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Visible tap indicator for mobile - amber bullseye at very bottom */}
          {!showBottomBar && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                 style={{ bottom: 'calc(6px + env(safe-area-inset-bottom, 0px))' }}>
              {/* Outer ring */}
              <div className="w-6 h-6 rounded-full border-2 border-amber-400/40 flex items-center justify-center">
                {/* Inner dot */}
                <div className="w-2 h-2 rounded-full bg-amber-400/60" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom navigation bar */}
      <AnimatePresence>
        {showBottomBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[80]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            onMouseEnter={() => setShowBottomBar(true)}
            onMouseLeave={() => setShowBottomBar(false)}
          >
            <div className="bg-soul-surface/95 backdrop-blur-xl border-t border-soul-border/40 shadow-2xl">
              <div className="max-w-md mx-auto px-6 py-4">
                <div className="flex items-center justify-between gap-6">

                  {/* Home / Holoflower Button */}
                  <button
                    onClick={() => window.location.href = '/consciousness'}
                    className="flex-shrink-0 p-2 rounded-full hover:bg-amber-400/20
                             active:scale-95 transition-all group"
                    title="Return to Consciousness Station"
                  >
                    <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                  </button>

                  {/* Voice/Mic Toggle */}
                  <button
                    onClick={() => {
                      if (isMuted) {
                        setIsMuted(false);
                        voiceMicRef.current?.startListening?.();
                      } else {
                        setIsMuted(true);
                        voiceMicRef.current?.stopListening?.();
                      }
                    }}
                    className={`flex-shrink-0 p-3 rounded-full transition-all active:scale-95 ${
                      isMuted
                        ? 'bg-amber-400/10 text-amber-400/50 hover:bg-amber-400/20'
                        : 'bg-amber-400/20 text-amber-400 hover:bg-amber-400/30'
                    }`}
                    title={isMuted ? 'Enable Voice' : 'Disable Voice'}
                  >
                    {isMuted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                              clipRule="evenodd" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                      </svg>
                    )}
                  </button>

                  {/* Emergency Stop Button */}
                  <button
                    onClick={() => {
                      // Stop all audio/voice
                      if (audioContextRef.current) {
                        try {
                          audioContextRef.current.close();
                        } catch (e) {
                          console.error('Error closing audio context:', e);
                        }
                      }
                      setIsAudioPlaying(false);
                      setIsResponding(false);
                      voiceMicRef.current?.stopListening?.();
                      toast.success('All voice activity stopped');
                    }}
                    className="flex-shrink-0 p-2 rounded-full bg-red-400/20 text-red-400
                             hover:bg-red-400/30 active:scale-95 transition-all"
                    title="Emergency Stop - Stop all audio/voice"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="1"/>
                    </svg>
                  </button>

                  {/* Chat Toggle Button */}
                  <button
                    onClick={() => setShowChatInterface(!showChatInterface)}
                    className={`flex-shrink-0 p-2 rounded-full transition-all active:scale-95 ${
                      showChatInterface
                        ? 'bg-amber-400/20 text-amber-400 hover:bg-amber-400/30'
                        : 'bg-amber-400/10 text-amber-400/50 hover:bg-amber-400/20'
                    }`}
                    title={showChatInterface ? 'Hide Chat' : 'Show Chat'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>

                  {/* Download Transcript Button */}
                  <button
                    onClick={handleDownloadTranscript}
                    disabled={messages.length < 2}
                    className="flex-shrink-0 p-2 rounded-full bg-amber-400/20 text-amber-400
                             hover:bg-amber-400/30 active:scale-95 transition-all
                             disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Download Transcript"
                  >
                    <Download className="w-5 h-5" />
                  </button>

                  {/* Save Journal Button */}
                  <button
                    onClick={handleSaveAsJournal}
                    disabled={messages.length < 2 || !userId || isSavingJournal}
                    className={`flex-shrink-0 p-2 rounded-full transition-all active:scale-95
                             disabled:opacity-30 disabled:cursor-not-allowed ${
                      breakthroughScore >= 70
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 animate-pulse'
                        : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                    }`}
                    title="Save to Journal"
                  >
                    <BookOpen className="w-5 h-5" />
                  </button>

                  {/* Claude Code Presence Button */}
                  <button
                    onClick={() => setShowClaudePresence(!showClaudePresence)}
                    className={`flex-shrink-0 p-2 rounded-full transition-all active:scale-95 ${
                      showClaudePresence
                        ? 'bg-amber-400/20 text-amber-400 hover:bg-amber-400/30'
                        : 'bg-amber-400/10 text-amber-400/50 hover:bg-amber-400/20'
                    }`}
                    title="Claude Code's Presence"
                  >
                    <Brain className="w-5 h-5" />
                  </button>

                  {/* Brain Trust Monitor Button */}
                  <button
                    onClick={() => setShowBrainTrust(!showBrainTrust)}
                    className={`flex-shrink-0 p-2 rounded-full transition-all active:scale-95 ${
                      showBrainTrust
                        ? 'bg-amber-400/20 text-amber-400 hover:bg-amber-400/30'
                        : 'bg-amber-400/10 text-amber-400/50 hover:bg-amber-400/20'
                    }`}
                    title="Consciousness Weaver"
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>

                  {/* Sacred Menu Button */}
                  <button
                    onClick={() => setShowLabDrawer(true)}
                    className="flex-shrink-0 p-2 rounded-full bg-amber-400/20 text-amber-400
                             hover:bg-amber-400/30 active:scale-95 transition-all"
                    title="Open Sacred Menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brain Trust Components - Controlled by bottom menu bar */}
      {showClaudePresence && <ClaudeCodePresence />}
      {showBrainTrust && <BrainTrustMonitor />}

      {/* Voice/Chat Mode Switcher - REMOVED: Always use Realtime voice mode */}

      {/* Soulprint Metrics Widget - DISABLED: Causing 400 errors when userId not authenticated */}
      {/* {userId && <SoulprintMetricsWidget userId={userId} />} */}

      {/* Continuous Conversation - Uses browser Web Speech Recognition API (no webm issues) */}
      {voiceEnabled && !showChatInterface && (
        <div className="sr-only">
          <ContinuousConversation
            ref={voiceMicRef}
            onTranscript={handleVoiceTranscript}
            onAudioLevelChange={(level) => setVoiceAmplitude(level)}
            isProcessing={isResponding}
            isSpeaking={isAudioPlaying}
            autoStart={true}
            silenceThreshold={
              listeningMode === 'session' ? 999999 : // Session mode: never auto-send (effectively infinite)
              listeningMode === 'patient' ? 30000 :   // Patient mode: 30 seconds (for very long, contemplative thoughts)
              20000                                    // Normal/Dialogue mode: 20 seconds (allow deep thinking pauses)
            }
          />
        </div>
      )}

      {/* Hidden File Upload Input */}
      <input
        type="file"
        id="maiaFileUpload"
        className="hidden"
        multiple
        accept="*"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            const fileNames = files.map(f => f.name).join(', ');
            handleTextMessage(`Please analyze these files: ${fileNames}`, files);
            e.target.value = ''; // Reset input
          }
        }}
      />

      {/* Sacred Lab Drawer - Organized navigation and tools */}
      <SacredLabDrawer
        isOpen={showLabDrawer}
        onClose={() => setShowLabDrawer(false)}
        onNavigate={(path) => {
          window.location.href = path;
          setShowLabDrawer(false);
        }}
        onAction={(action) => {
          if (action === 'upload') {
            document.getElementById('maiaFileUpload')?.click();
          }
          if (action === 'download') {
            downloadTranscript();
            toast.success('Conversation downloaded!');
          }
          if (action === 'toggle-text') {
            setShowVoiceText(!showVoiceText);
          }
          if (action === 'field-protocol') {
            if (isFieldRecording) {
              completeFieldRecording().then(() => {
                toast.success('Field Record completed');
              });
            } else {
              startFieldRecording();
              toast.success('Field Recording started');
            }
          }
        }}
        showVoiceText={showVoiceText}
        isFieldRecording={isFieldRecording}
      />

      {/* Transcript Sidebar - Shows message history in voice mode */}
      <TranscriptSidebar
        messages={messages.map(msg => ({
          id: msg.id,
          role: msg.role === 'oracle' ? 'assistant' : 'user',
          content: msg.text,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp.getTime() : Date.now()
        }))}
        isOpen={isTranscriptOpen}
        onToggle={() => setIsTranscriptOpen(!isTranscriptOpen)}
        consciousnessType="maia"
      />
    </div>
  );
};

export default OracleConversation;
