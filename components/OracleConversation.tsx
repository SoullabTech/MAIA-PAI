// Oracle Conversation - Voice-synchronized sacred dialogue
// 🔄 MOBILE-FIRST DEPLOYMENT - Oct 2 12:15PM - Compact input, hidden overlays, fixed scroll
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, X, Copy } from 'lucide-react';
import { SimplifiedOrganicVoice, VoiceActivatedMaiaRef } from './ui/SimplifiedOrganicVoice';
import { SacredHoloflower } from './sacred/SacredHoloflower';
import { EnhancedVoiceMicButton } from './ui/EnhancedVoiceMicButton';
import AdaptiveVoiceMicButton from './ui/AdaptiveVoiceMicButton';
import { detectVoiceCommand, isOnlyModeSwitch, getModeConfirmation } from '@/lib/voice/VoiceCommandDetector';
import { QuickModeToggle } from './ui/QuickModeToggle';
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
import { useMaiaVoice } from '@/hooks/useMaiaVoice';
import { cleanMessage, cleanMessageForVoice, formatMessageForDisplay } from '@/lib/cleanMessage';
import { getAgentConfig, AgentConfig } from '@/lib/agent-config';
import { toast } from 'react-hot-toast';
import { trackEvent } from '@/lib/analytics/track';
import { saveConversationMemory, getOracleAgentId } from '@/lib/services/memoryService';
import { generateGreeting } from '@/lib/services/greetingService';
import { BrandedWelcome } from './BrandedWelcome';
import { userTracker } from '@/lib/tracking/userActivityTracker';
import { ModeSwitcher } from './ui/ModeSwitcher';
import { ConversationStylePreference } from '@/lib/preferences/conversation-style-preference';

interface OracleConversationProps {
  userId?: string;
  userName?: string;
  sessionId: string;
  initialCheckIns?: Record<string, number>;
  showAnalytics?: boolean;
  voiceEnabled?: boolean;
  onMessageAdded?: (message: ConversationMessage) => void;
  onSessionEnd?: (reason?: string) => void;
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
  userId,
  userName,
  sessionId,
  initialCheckIns = {},
  showAnalytics = false,
  voiceEnabled = true,
  onMessageAdded,
  onSessionEnd
}) => {
  // Maia Voice Integration - Initialize immediately for Voice mode
  const { speak: maiaSpeak, voiceState: maiaVoiceState, isReady: maiaReady } = useMaiaVoice();

  // 🌀 Soullab Realtime - DISABLED
  // This was trying to use OpenAI Realtime API in browser (not supported without dangerouslyAllowBrowser)
  // We're using SimplifiedOrganicVoice (browser speech recognition) + standard API calls instead
  // const realtime = useElementalVoice({
  //   userId: userId || 'anonymous',
  //   userName: userName || 'Explorer',
  //   sessionId,
  //   voice: 'shimmer',
  //   enableSmartCache: true,
  //   enableResponseStreaming: true,
  //   autoConnect: false,
  //   onTranscript: (text, isUser) => { ... },
  //   onError: (error) => { console.warn('⚠️ Voice system error:', error); }
  // });

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
        setHoloflowerSize(Math.min(width - 64, 350)); // Mobile
      } else if (width < 1024) {
        setHoloflowerSize(400); // Tablet
      } else {
        setHoloflowerSize(500); // Desktop
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Core state
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [checkIns, setCheckIns] = useState<Record<string, number>>(initialCheckIns);
  const [activeFacetId, setActiveFacetId] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Motion states
  const [currentMotionState, setCurrentMotionState] = useState<MotionState>('idle');
  const [voiceAudioLevel, setVoiceAudioLevel] = useState(0);
  const [coherenceLevel, setCoherenceLevel] = useState(0.5);
  const [coherenceShift, setCoherenceShift] = useState<CoherenceShift>('stable');
  const [shadowPetals, setShadowPetals] = useState<string[]>([]);
  const [showBreakthrough, setShowBreakthrough] = useState(false);
  
  // Voice states
  const [userVoiceState, setUserVoiceState] = useState<VoiceState | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIOSAudioEnabled, setIsIOSAudioEnabled] = useState(false);
  const [needsIOSAudioPermission, setNeedsIOSAudioPermission] = useState(false);
  const [streamingText, setStreamingText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMicrophonePaused, setIsMicrophonePaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted in voice mode for immediate use
  const voiceMicRef = useRef<VoiceActivatedMaiaRef>(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [maiaResponseText, setMaiaResponseText] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [echoSuppressUntil, setEchoSuppressUntil] = useState<number>(0);
  const lastMaiaResponseRef = useRef<string>('');
  const lastVoiceErrorRef = useRef<number>(0);

  // Oracle Agent ID for memory persistence
  const [oracleAgentId, setOracleAgentId] = useState<string | null>(null);

  // Welcome message state
  const [showWelcome, setShowWelcome] = useState(true);
  const [isReturningUser, setIsReturningUser] = useState(false);

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
      if (voiceEnabled && maiaSpeak) {
        setTimeout(() => {
          maiaSpeak(acknowledgment).catch(err =>
            console.error('Failed to speak acknowledgment:', err)
          );
        }, 500);
      }
    };

    window.addEventListener('maya-style-changed', handleStyleChange as EventListener);
    return () => {
      window.removeEventListener('maya-style-changed', handleStyleChange as EventListener);
    };
  }, [voiceEnabled, maiaSpeak, onMessageAdded]);

  // UI states
  const [showChatInterface, setShowChatInterface] = useState(true); // Default to chat interface for better UX
  const [showCaptions, setShowCaptions] = useState(true); // Show text by default in voice mode
  const [showVoiceText, setShowVoiceText] = useState(true); // Toggle for showing text in voice mode
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [enableVoiceInChat, setEnableVoiceInChat] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

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

  // Sync local audio state with Maia voice state to prevent conflicts
  useEffect(() => {
    if (maiaVoiceState?.isPlaying !== isAudioPlaying) {
      setIsAudioPlaying(maiaVoiceState?.isPlaying || false);
    }
    if (maiaVoiceState?.isPlaying !== isResponding) {
      setIsResponding(maiaVoiceState?.isPlaying || false);
    }
  }, [maiaVoiceState?.isPlaying]);

  // Update motion state based on voice activity
  useEffect(() => {
    if (userVoiceState?.isSpeaking) {
      setCurrentMotionState('listening');
      setIsListening(true);

      // Map voice amplitude to petal breathing
      const breathingIntensity = userVoiceState.amplitude;
      // This will be picked up by the Holoflower's motion orchestrator
    } else {
      setIsListening(false);
    }
  }, [userVoiceState]);

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

  // Handle text messages from chat interface - MUST be defined before handleVoiceTranscript
  const handleTextMessage = useCallback(async (text: string, attachments?: File[]) => {
    console.log('📝 Text message received:', { text, isProcessing, isAudioPlaying, isResponding });

    // IMMEDIATELY mute microphone to prevent Maia from hearing herself
    if (voiceMicRef.current && voiceMicRef.current.muteImmediately) {
      voiceMicRef.current.muteImmediately();
      console.log('🔇 PREEMPTIVE MUTE: Microphone disabled before processing');
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

      const response = await fetch('/api/oracle/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: cleanedText,
          userId: userId || 'anonymous',
          userName: userName,
          sessionId,
          agentName: agentConfig.name,
          agentVoice: agentConfig.voice,
          attachments: attachments ? attachments.map(f => ({
            name: f.name,
            type: f.type,
            size: f.size
          })) : undefined,
          preferences: {
            previousInteractions: messages.length,
            inputType: 'text',
            hasAttachments: attachments && attachments.length > 0,
            conversationStyle, // Pass user's preferred style (her/classic/adaptive)
            userPreferences: {
              voice: {
                enabled: false,
                autoSpeak: false,
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

      const responseData = await response.json();
      console.log('✅ API response data:', responseData);
      const apiTime = Date.now() - startTime;
      console.log(`⏱️ Text API response received in ${apiTime}ms`);
      trackEvent.apiCall('/api/oracle/personal', apiTime, true);

      const oracleResponse = responseData.data || responseData;
      let responseText = oracleResponse.message || oracleResponse.content || oracleResponse.text || oracleResponse.response || 'Tell me your truth.';
      responseText = cleanMessage(responseText);

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

      // In Chat mode, add message immediately
      // In Voice mode, delay text until after speaking
      const isInVoiceMode = !showChatInterface;

      if (!isInVoiceMode) {
        // Chat mode - show text immediately
        setMessages(prev => [...prev, oracleMessage]);
        onMessageAdded?.(oracleMessage);

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
        const cooldownMs = 3500; // 3.5 second cooldown (audio can linger in speakers)

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

          // In Voice mode, show text after speaking completes
          if (isInVoiceMode && showVoiceText) {
            setMessages(prev => [...prev, oracleMessage]);
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
          // Show text even if speech fails in Voice mode
          if (isInVoiceMode) {
            setMessages(prev => [...prev, oracleMessage]);
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
  }, [isProcessing, isAudioPlaying, isResponding, sessionId, userId, onMessageAdded, agentConfig, messages.length, showChatInterface, voiceEnabled, maiaReady, maiaSpeak]);

  // Handle voice transcript from mic button
  const handleVoiceTranscript = useCallback(async (transcript: string) => {
    console.log('🎤 handleVoiceTranscript called with:', transcript);
    const t = transcript?.trim();
    if (!t) {
      console.log('⚠️ Empty transcript, returning');
      return;
    }

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

    // ECHO SUPPRESSION: Check if we're in cooldown period
    const now = Date.now();
    if (now < echoSuppressUntil) {
      const remainingMs = echoSuppressUntil - now;
      console.warn(`[Echo Suppressed] Ignoring input during ${remainingMs}ms cooldown`);
      return;
    }

    // ECHO SUPPRESSION: Check if transcript matches MAIA's last response
    if (lastMaiaResponseRef.current && transcript.includes(lastMaiaResponseRef.current.substring(0, 50))) {
      console.warn('[Echo Suppressed] Transcript matches MAIA\'s recent response');
      return;
    }

    // Prevent duplicate processing if already handling a message
    if (isProcessing || isResponding) {
      console.log('⚠️ Already processing, ignoring duplicate transcript');
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
  }, [handleTextMessage, isProcessing, isResponding, isAudioPlaying, messages, echoSuppressUntil, maiaReady, maiaSpeak, isMuted]);

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
      const speaker = msg.role === 'user' ? '**You**' : `**${agentConfig.name}**`;
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

      audio.onended = () => {
        setCurrentlySpeakingId(undefined);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setCurrentlySpeakingId(undefined);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
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

    // Stop MAIA's voice
    if (maiaVoiceState) {
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {
        console.error('Error stopping speech:', e);
      }
    }

    // Stop any audio playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
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
  }, [maiaVoiceState]);

  // DIAGNOSTIC LOGGING - Removed to reduce console noise and improve performance

  return (
    <div className="oracle-conversation min-h-screen bg-[#1a1f2e] overflow-hidden">
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

      {/* Agent Customizer - Only show when settings clicked */}
      {showCustomizer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCustomizer(false)} />
          <div className="relative z-10">
            <AgentCustomizer
              position="center"
              onConfigChange={(config) => {
                setAgentConfig(config);
                // Save voice preference to localStorage
                if (typeof window !== 'undefined') {
                  localStorage.setItem('selected_voice', config.name);
                  // Cancel any playing audio when voice changes
                  if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                }
                // Refresh conversation with new agent
                console.log('Agent changed to:', config.name);
                setShowCustomizer(false); // Close after selection
              }}
            />
          </div>
        </div>
      )}

      {/* Beautiful Sacred Holoflower - Responsive sizing - Always show */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        {/* Adjusted container to shift light up and left */}
        <div className="flex items-center justify-center"
             style={{
               width: holoflowerSize,
               height: holoflowerSize,
               transform: 'translate(-20px, -30px)',
               pointerEvents: 'none',
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
            dimmed={conversationMode === 'chat'}
          />

          {/* Central Holoflower Logo with Glow and Sparkles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Radiant glow behind the holoflower - ENHANCED - Dimmed in chat mode */}
            <motion.div
              className={`absolute flex items-center justify-center pointer-events-none ${
                showChatInterface ? 'opacity-20 md:opacity-60' : 'opacity-40 md:opacity-100'
              }`}
              animate={{
                scale: [1, 1.4, 1],
                opacity: showChatInterface ? [0.3, 0.5, 0.3] : [0.6, 0.9, 0.6]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div
                className="w-48 h-48 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(212, 184, 150, 1) 0%, rgba(212, 184, 150, 0.7) 30%, rgba(212, 184, 150, 0.3) 60%, transparent 100%)',
                  filter: 'blur(30px)',
                  transform: 'translate(0, 0)' /* Center the main glow */
                }}
              />
            </motion.div>

            {/* Secondary outer glow layer for extra radiance - Dimmed in chat mode */}
            <motion.div
              className={`absolute flex items-center justify-center pointer-events-none ${
                showChatInterface ? 'opacity-15 md:opacity-40' : 'opacity-30 md:opacity-100'
              }`}
              animate={{
                scale: [1.2, 1.6, 1.2],
                opacity: showChatInterface ? [0.2, 0.3, 0.2] : [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <div
                className="w-64 h-64 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(212, 184, 150, 0.6) 0%, rgba(212, 184, 150, 0.2) 50%, transparent 100%)',
                  filter: 'blur(40px)',
                  transform: 'translate(0, 0)' /* Center the secondary glow */
                }}
              />
            </motion.div>

            {/* Holoflower Image - Dimmed in chat mode - NON-INTERACTIVE */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <img
                src="/holoflower.svg"
                alt="Holoflower"
                className={`w-32 h-32 object-contain ${
                  showChatInterface ? 'opacity-30 md:opacity-60' : 'opacity-60 md:opacity-100'
                }`}
                style={{
                  filter: showChatInterface
                    ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))'
                    : 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
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

            {/* Voice Visualizer - User's voice (clean blue rings for now) */}
            {isMounted && !showChatInterface && voiceEnabled && voiceMicRef.current?.isListening && (
              <motion.div
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Elemental colored pulsing rings */}
                {[...Array(2)].map((_, i) => (
                  <motion.div
                    key={`voice-ring-${i}`}
                    className="absolute rounded-full border-2"
                    style={{
                      width: `${200 + i * 100}px`,
                      height: `${200 + i * 100}px`,
                      borderColor: '#6B9BD1', // Clean blue - temporarily disabled elemental colors
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 0.4, 0.8],
                    }}
                    transition={{
                      duration: 2 + i * 0.5, // Standard timing - temporarily disabled elemental timing
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  />
                ))}

                {/* Audio level responsive inner ring */}
                {voiceAudioLevel > 0.05 && (
                  <motion.div
                    className="absolute rounded-full border-2 border-[#6B9BD1]"
                    style={{
                      width: '180px',
                      height: '180px',
                    }}
                    animate={{
                      scale: 1 + voiceAudioLevel * 0.3,
                      opacity: 0.5 + voiceAudioLevel * 0.5,
                    }}
                    transition={{
                      duration: 0.1,
                      ease: "linear"
                    }}
                  />
                )}
              </motion.div>
            )}

            {/* Voice Visualizer - MAIA's voice (clean golden rings) */}
            {(isResponding || isAudioPlaying || maiaVoiceState?.isPlaying) && (
              <motion.div
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Clean golden pulsing rings for MAIA */}
                {[...Array(2)].map((_, i) => (
                  <motion.div
                    key={`maya-ring-${i}`}
                    className="absolute rounded-full border-2"
                    style={{
                      width: `${250 + i * 100}px`,
                      height: `${250 + i * 100}px`,
                      borderColor: '#D4B896', // Golden for MAIA
                    }}
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.7, 0.3, 0.7],
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
                    background: 'radial-gradient(circle, rgba(212, 184, 150, 0.2) 0%, transparent 60%)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
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
              <div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 text-center">
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
                {/* Status messages */}
                <AnimatePresence mode="wait">
                  {voiceMicRef.current?.isListening && !isResponding && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-[#6B9BD1] text-sm font-medium"
                    >
                      Listening...
                    </motion.div>
                  )}
                  {(isResponding || isAudioPlaying) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-[#D4B896] text-sm font-medium"
                    >
                      Speaking...
                    </motion.div>
                  )}
                  {!voiceMicRef.current?.isListening && !isResponding && !isAudioPlaying && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-neutral-mystic text-sm"
                    >
                      Click to activate
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* OLD BUTTON REMOVED - Now using separate overlay button outside pointer-events-none hierarchy */}
          </div>
        </div>
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

      {/* INTERACTIVE HOLOFLOWER BUTTON - Separate overlay with pointer-events enabled */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <motion.button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🌸 Holoflower clicked!', {
              showChatInterface,
              voiceEnabled,
              isMuted,
              isProcessing,
              isResponding,
              contemplationMode: voiceMicRef.current?.isContemplationMode
            });
            // Always enable audio first
            await enableAudio();

            // In voice mode, handle contemplation and listening modes
            if (!showChatInterface && voiceEnabled) {
              // If in contemplation mode, exit it and resume normal conversation
              if (voiceMicRef.current?.isContemplationMode) {
                voiceMicRef.current.toggleContemplationMode();
                console.log('🔙 Exited contemplation mode - ready for conversation');
                return;
              }

              if (!isMuted) {
                // Currently listening, so stop
                setIsMuted(true);
                if (voiceMicRef.current?.stopListening) {
                  voiceMicRef.current.stopListening();
                  console.log('🔇 Voice stopped via holoflower click');
                }
              } else {
                // Currently muted, so start listening
                setIsMuted(false);
                // Small delay to ensure component is ready
                setTimeout(async () => {
                  if (voiceMicRef.current?.startListening && !isProcessing && !isResponding) {
                    await voiceMicRef.current.startListening();
                    console.log('🎤 Voice started via holoflower click');
                  }
                }, 100);
              }
            } else if (showChatInterface) {
              // In chat mode, switch to voice mode and activate
              setShowChatInterface(false);
              setIsMuted(false);
              setTimeout(async () => {
                if (voiceMicRef.current?.startListening && !isProcessing && !isResponding) {
                  await voiceMicRef.current.startListening();
                  console.log('🎤 Voice started via mode switch from holoflower');
                }
              }, 200);
            }
          }}
          className="relative cursor-pointer bg-transparent border-none p-8 hover:bg-white/5 rounded-full touch-manipulation"
          style={{
            width: '200px',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            pointerEvents: 'auto',
            transform: 'translate(-20px, -30px)' // Match holoflower position
          }}
          onContextMenu={(e) => {
            e.preventDefault(); // Prevent default context menu
            if (!showChatInterface && voiceEnabled && voiceMicRef.current?.toggleContemplationMode) {
              voiceMicRef.current.toggleContemplationMode();
              console.log('🧘 Contemplation mode toggled via right-click');
            }
          }}
          onTouchStart={(e) => {
            const touchStartTime = Date.now();
            let longPressTimer: NodeJS.Timeout;

            // Set up long press detection
            longPressTimer = setTimeout(() => {
              if (!showChatInterface && voiceEnabled && voiceMicRef.current?.toggleContemplationMode) {
                e.preventDefault();
                voiceMicRef.current.toggleContemplationMode();
                console.log('🧘 Contemplation mode toggled via long press');
              }
            }, 800);

            // Clear timer on touch end or if touch moves
            const clearTimer = () => {
              clearTimeout(longPressTimer);
              e.currentTarget.removeEventListener('touchend', clearTimer);
              e.currentTarget.removeEventListener('touchmove', clearTimer);
            };

            e.currentTarget.addEventListener('touchend', clearTimer);
            e.currentTarget.addEventListener('touchmove', clearTimer);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          {/* Visual feedback circle */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/0"
            animate={{
              borderColor: !showChatInterface && voiceEnabled && !isMuted
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(255, 255, 255, 0)'
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>

      {/* Message flow - Show in both Chat mode and optionally in Voice mode */}
      {(showChatInterface || (!showChatInterface && showVoiceText)) && messages.length > 0 && (
        <div className={`fixed top-20 sm:top-16 z-30 transition-all duration-500 ${
          showChatInterface
            ? 'inset-x-4 sm:right-8 sm:left-auto sm:w-96 opacity-100'
            : 'inset-x-4 sm:right-8 sm:left-auto sm:w-80 opacity-60'
        }`}
             style={{
               height: showChatInterface
                 ? 'calc(100vh - 220px)'
                 : 'calc(100vh - 240px)',
               maxHeight: showChatInterface
                 ? 'calc(100vh - 220px)'
                 : 'calc(100vh - 240px)',
               bottom: showChatInterface ? '200px' : '120px',
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
                      className="bg-black/60 md:bg-black/40 backdrop-blur-sm rounded-2xl p-4 text-white
                               border border-gold-divine/30 shadow-lg max-w-full
                               cursor-pointer hover:bg-black/70 md:hover:bg-black/50 transition-colors group"
                      onClick={handleCopyMessage}
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs text-gold-divine/60">
                          {message.role === 'user' ? 'You' : agentConfig.name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gold-divine/40
                                      opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                                      touch-manipulation transition-opacity">
                          <Copy className="w-3 h-3" />
                          <span className="hidden sm:inline">Click to copy</span>
                          <span className="sm:hidden">Tap to copy</span>
                        </div>
                      </div>
                      <div className="text-sm sm:text-base leading-relaxed break-words">
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

              {/* Compact text input area - mobile-first, fixed at bottom */}
              {showChatInterface && (
              <div className="fixed inset-x-0 bottom-20 z-[60]">
                {/* Text input area - Ultra compact mobile design - Raised above bottom menu bar */}
                <div className="bg-black/40 backdrop-blur-md px-2 py-2 border-t border-gold-divine/20">
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
                    <div className="flex items-end gap-2">
                      <textarea
                        name="message"
                        placeholder="Share your thoughts with MAIA..."
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
                        className="flex-1 min-h-[42px] max-h-[100px] px-3 py-2
                                 bg-black/60 backdrop-blur-sm
                                 border border-gold-divine/30 rounded-2xl
                                 text-gold-divine placeholder-gold-divine/50
                                 text-sm leading-relaxed
                                 focus:outline-none focus:border-gold-divine/50 focus:ring-1 focus:ring-gold-divine/20
                                 disabled:opacity-50 resize-none
                                 touch-manipulation"
                        autoComplete="off"
                        autoFocus={false}
                      />

                      {/* File upload button */}
                      <input
                        type="file"
                        id="chatFileUpload"
                        className="hidden"
                        multiple
                        accept="image/*,application/pdf,.txt,.doc,.docx"
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
                        className="flex-shrink-0 w-10 h-10 bg-gold-divine/10 border border-gold-divine/30
                                 rounded-full text-gold-divine flex items-center justify-center
                                 hover:bg-gold-divine/20 active:scale-95 transition-all cursor-pointer"
                        title="Upload files"
                      >
                        <Paperclip className="w-5 h-5" />
                      </label>

                      {/* Compact send button */}
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="flex-shrink-0 w-10 h-10 bg-gold-divine/20 border border-gold-divine/30
                                 rounded-full text-gold-divine flex items-center justify-center
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

          {/* Mic Hint Message */}
          {!showChatInterface && isMuted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                <p className="text-white/80 text-sm">Click the holoflower to activate voice</p>
              </div>
            </motion.div>
          )}
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

      {/* Redesigned Bottom Icon Bar - Sacred Style - Always visible */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 pb-safe mb-2">
        <div className="flex justify-center items-center gap-8 py-4 px-8 bg-black/60 backdrop-blur-lg rounded-full border border-[#D4B896]/20">
          {/* Voice Toggle - Activate mic when switching to voice mode */}
          <button
            onClick={async () => {
              setShowChatInterface(false);
              setIsMuted(false); // Unmute FIRST
              await enableAudio();
              // Start listening when switching to voice mode
              setTimeout(async () => {
                if (voiceMicRef.current?.startListening && !isProcessing && !isResponding) {
                  await voiceMicRef.current.startListening();
                  console.log('🎤 Voice started via mode switch');
                }
              }, 300); // Slightly longer delay to ensure state updates
            }}
            className={`p-3 rounded-full transition-all duration-300 ${
              !showChatInterface
                ? 'bg-[#D4B896]/20 text-[#D4B896]'
                : 'text-[#D4B896]/40 hover:text-[#D4B896]/60'
            }`}
            title="Voice Mode"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Microphone Mute Toggle - Only visible in Voice mode */}
          {!showChatInterface && (
            <button
              onClick={async () => {
                if (!isMuted) {
                  // Mute the microphone
                  setIsMuted(true);
                  if (voiceMicRef.current?.stopListening) {
                    voiceMicRef.current.stopListening();
                    console.log('🔇 Microphone muted');
                  }
                } else {
                  // Unmute and start listening
                  setIsMuted(false);
                  await enableAudio();
                  setTimeout(async () => {
                    if (voiceMicRef.current?.startListening && !isProcessing && !isResponding) {
                      await voiceMicRef.current.startListening();
                      console.log('🎤 Microphone unmuted');
                    }
                  }, 100);
                }
              }}
              className={`p-3 rounded-full transition-all duration-300 ${
                isMuted
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-[#D4B896]/20 text-[#D4B896] hover:bg-[#D4B896]/30'
              }`}
              title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
            >
              {isMuted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          )}

          {/* EMERGENCY STOP - Shows when MAIA is speaking */}
          {(isResponding || isAudioPlaying || maiaVoiceState?.isPlaying) && (
            <button
              onClick={handleEmergencyStop}
              className="p-3 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-all duration-300 pulse-red"
              title="Stop MAIA"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </button>
          )}

          {/* Heart/Favorites */}
          <button
            className="p-3 rounded-full text-[#D4B896]/40 hover:text-[#D4B896]/60 transition-all duration-300"
            title="Favorites"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Profile/User */}
          <button
            onClick={() => window.location.href = '/profile'}
            className="p-3 rounded-full text-[#D4B896]/40 hover:text-[#D4B896]/60 transition-all duration-300"
            title="Your Profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {/* Lab Notes */}
          <button
            onClick={() => window.location.href = '/lab-notes'}
            className="p-3 rounded-full text-[#D4B896]/40 hover:text-[#D4B896]/60 transition-all duration-300"
            title="Lab Notes"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>

          {/* Journal/Book Icon - Open Book Style */}
          <button
            onClick={() => window.location.href = '/journal'}
            className="p-3 rounded-full text-[#D4B896]/40 hover:text-[#D4B896]/60 transition-all duration-300 group"
            title="Sacred Journal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              {/* Left page */}
              <path
                d="M 4,8 Q 4,6 6,6 L 14,6 L 14,24 Q 14,25 13,25 L 6,25 Q 4,25 4,23 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:animate-pulse"
              />
              {/* Right page */}
              <path
                d="M 28,8 Q 28,6 26,6 L 18,6 L 18,24 Q 18,25 19,25 L 26,25 Q 28,25 28,23 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:animate-pulse"
              />
              {/* Book spine */}
              <path
                d="M 14,6 L 14,25 L 18,25 L 18,6 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Text lines */}
              <path d="M 7,10 L 11,10" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
              <path d="M 7,13 L 11,13" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
              <path d="M 20,10 L 24,10" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
              <path d="M 20,13 L 24,13" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
            </svg>
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setShowChatInterface(true)}
            className={`p-3 rounded-full transition-all duration-300 ${
              showChatInterface
                ? 'bg-[#D4B896]/20 text-[#D4B896]'
                : 'text-[#D4B896]/40 hover:text-[#D4B896]/60'
            }`}
            title="Chat Mode"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>

          {/* Text Display Toggle - Only visible in Voice mode */}
          {!showChatInterface && (
            <button
              onClick={() => setShowVoiceText(!showVoiceText)}
              className="p-3 rounded-full text-[#D4B896]/40 hover:text-[#D4B896]/60 transition-all duration-300"
              title={showVoiceText ? "Hide Text" : "Show Text"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d={showVoiceText
                        ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      } />
              </svg>
            </button>
          )}

          {/* File Upload for Maia */}
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
          <label
            htmlFor="maiaFileUpload"
            className="p-3 rounded-full text-[#D4B896]/40 hover:text-[#D4B896]/80 hover:bg-[#D4B896]/10 transition-all duration-300 cursor-pointer"
            title="Upload files for Maia to explore"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </label>

          {/* Quick Mode Toggle - Easy mode switching */}
          <QuickModeToggle />

          {/* Quick Settings - Opens comprehensive MAIA settings - GOLD HIGHLIGHT */}
          <button
            onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            className="p-3 rounded-full text-amber-400/70 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-300 group relative"
            title="MAIA Settings - Voice, Memory, Personality"
            style={{ filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.3))' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full group-hover:opacity-100 transition-opacity animate-pulse"></span>
          </button>

          {/* Download/Share */}
          <button
            onClick={downloadTranscript}
            disabled={messages.length === 0}
            className="p-3 rounded-full text-[#D4B896]/40 hover:text-[#D4B896]/60 transition-all duration-300 disabled:opacity-30"
            title="Download Transcript"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Floating Quick Settings Button */}
      {/* QuickSettingsButton removed - now in bottom nav bar */}

      {/* Voice/Chat Mode Switcher - REMOVED: Always use Realtime voice mode */}

      {/* Soulprint Metrics Widget - DISABLED: Causing 400 errors when userId not authenticated */}
      {/* {userId && <SoulprintMetricsWidget userId={userId} />} */}

      {/* Hidden Voice Capture Component - Provides voiceMicRef for voice detection & visualizer */}
      {voiceEnabled && !showChatInterface && (
        <div className="hidden">
          <SimplifiedOrganicVoice
            ref={voiceMicRef}
            onTranscript={handleVoiceTranscript}
            enabled={!isMuted}
            isMayaSpeaking={isResponding || isAudioPlaying}
            onAudioLevelChange={setVoiceAudioLevel}
          />
        </div>
      )}
    </div>
  );
};

export default OracleConversation;
