"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Sparkles, User, BookOpen, LogOut, Library, Settings, Database, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cleanMessage } from "@/lib/cleanMessage";
import { MicrophoneCapture, MicrophoneCaptureRef } from "@/components/voice/MicrophoneCapture";
// OLD: Web Speech API with restart loop bugs (REPLACED with WebRTC)
// import { ContinuousConversation, ContinuousConversationRef } from "@/components/voice/ContinuousConversation";
// NEW: WebRTC with full MAIA consciousness + server-side VAD (no restart loops)
import { MaiaWebRTCConversation, MaiaWebRTCConversationRef } from "@/components/voice/MaiaWebRTCConversation";
import { OracleVoicePlayer } from "@/components/voice/OracleVoicePlayer";
import TranscriptPreview from "@/app/components/TranscriptPreview";
import { unlockAudio, addAutoUnlockListeners } from "@/lib/audio/audioUnlock";
import { betaTracker } from "@/lib/analytics/betaTracker";
import { onboardingTracker } from "@/lib/analytics/onboardingTracker";
import { voiceFlowAnalytics } from "@/lib/analytics/voiceFlowAnalytics";
import { Analytics } from "@/lib/analytics/supabaseAnalytics";
import QuickFeedback from "@/components/beta/QuickFeedback";
import FileUploadTracker from "@/components/beta/FileUploadTracker";
import MicTorusIndicator from "@/components/voice/MicTorusIndicator";
import { ChatMessage } from "@/components/chat/ChatMessage";
import VoiceSettingsPanel from "@/components/settings/VoiceSettingsPanel";
import { VoiceSettingsProvider, useVoiceSettings } from "@/lib/contexts/VoiceSettingsContext";
import ObsidianVaultPanel from "@/components/panels/ObsidianVaultPanel";
import InlineFileUpload from "@/components/chat/InlineFileUpload";
import { useAttachedFiles } from "@/app/hooks/useAttachedFiles";

// Inner component that uses voice settings
function OraclePageInner() {
  const { settings } = useVoiceSettings();
  const [messages, setMessages] = useState<Array<{
    role: string, 
    content: string, 
    timestamp: string, 
    audioUrl?: string,
    citations?: Array<{
      fileId: string;
      fileName: string;
      category?: string;
      pageNumber?: number;
      sectionTitle?: string;
      sectionLevel?: number;
      preview: string;
      relevance: number;
      chunkIndex: number;
    }>;
    metadata?: {
      element?: string;
      confidence?: number;
      sessionId?: string;
    };
  }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [useContinuousMode, setUseContinuousMode] = useState(true); // Toggle for continuous mode
  const [isSpeaking, setIsSpeaking] = useState(false); // Track when Maya is speaking
  const [user, setUser] = useState<any>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [currentAudioData, setCurrentAudioData] = useState<string | null>(null);
  const [currentAudioFormat, setCurrentAudioFormat] = useState<string>('wav');
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [interactionCount, setInteractionCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showObsidianVault, setShowObsidianVault] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const microphoneRef = useRef<MicrophoneCaptureRef>(null);
  const continuousRef = useRef<MaiaWebRTCConversationRef>(null);
  const router = useRouter();

  // File upload hook
  const {
    attachedFiles,
    updateFiles,
    clearFiles,
    getCompletedFileIds,
    hasUploadingFiles,
    getFileContext
  } = useAttachedFiles();

  useEffect(() => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem('beta_user');
    if (!storedUser) {
      router.push('/auth');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    // Start analytics session
    Analytics.startSession(userData.id);
    
    // Track page view
    Analytics.pageView('/oracle', {
      user_id: userData.id,
      username: userData.username,
      element: userData.element
    });
    
    // Initialize beta tracking
    betaTracker.initBetaTester(userData.id, {
      username: userData.username,
      preferredElement: userData.element,
      consentAnalytics: true
    });
    
    // Initialize onboarding tracking
    onboardingTracker.reset();
    
    // Add auto-unlock listeners for audio playback
    addAutoUnlockListeners();
    
    // Track Milestone 1: Torus Activated (when user loads Maya page)
    setTimeout(() => {
      onboardingTracker.trackTorusActivated(true, {
        torusVisible: true,
        context: 'oracle_page_loaded',
        userElement: userData.element
      });
    }, 1000); // Small delay to ensure torus is rendered
    
    // Welcome message from assigned agent
    setMessages([{
      role: 'assistant',
      content: `Hey ${userData.username}, good to see you again. What's going on?`,
      timestamp: new Date().toISOString(),
      citations: [],
      metadata: {
        element: userData.element,
        sessionId: `session-${userData.id}-${Date.now()}`
      }
    }]);

    // Cleanup function to end session when component unmounts
    return () => {
      Analytics.endSession({
        total_interactions: interactionCount,
        page: '/oracle'
      });
    };
  }, [router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading || hasUploadingFiles()) return;

    const sendStartTime = Date.now();
    const isVoiceInput = !!text;

    // Get attached file IDs and context
    const attachedFileIds = getCompletedFileIds();
    const contextInfo = getFileContext();

    // Track interaction start
    Analytics.startInteraction(isVoiceInput ? 'voice' : 'text', {
      input_length: messageText.length,
      user_id: user?.id,
      has_attachments: attachedFileIds.length > 0
    });

    // Prepare message with file context if files are attached
    let finalMessageText = messageText;
    if (contextInfo && attachedFileIds.length > 0) {
      finalMessageText = `${contextInfo.contextMessage}\n\n${messageText}`;
    }

    const userMessage = {
      role: 'user',
      content: finalMessageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!text) setInput(""); // Only clear input if not from voice
    clearFiles(); // Clear attached files after sending
    setIsLoading(true);
    
    // Track interaction
    const newCount = interactionCount + 1;
    setInteractionCount(newCount);
    
    // Update beta tracking session
    betaTracker.updateSession({
      interactionCount: newCount,
      voiceUsed: isVoiceInput,
      durationMinutes: Math.floor((Date.now() - Date.now()) / 60000) // Will be calculated properly in tracker
    });

    try {
      // First, get Maya&apos;s text response
      // First check for the backend port
      const backendPort = process.env.NEXT_PUBLIC_BACKEND_URL?.split(':').pop() || '3002';
      
      const response = await fetch('/api/oracle/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: finalMessageText,
          userId: user?.id,
          agentId: user?.agentId,
          element: user?.element || 'aether',
          oracle: user?.agentName || 'Maya',
          sessionId: `session-${user?.id}-${Date.now()}`,
          conversationHistory: messages,
          enableVoice: true,
          voiceEngine: 'auto',
          useCSM: true,
          fallbackEnabled: true,
          attachedFileIds: attachedFileIds.length > 0 ? attachedFileIds : undefined
        })
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      
      // Capture debug information
      if (process.env.NODE_ENV === 'development') {
        setDebugInfo({
          ...data.debug,
          ttsService: data.ttsService || data.voiceMetadata?.engine,
          processingTime: data.processingTime || data.voiceMetadata?.processingTimeMs,
          memoryLayersLoaded: data.memoryLayers,
          timestamp: new Date().toISOString()
        });
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: data.message || data.response?.text || data.response || "I am here to listen and reflect with you.",
        audioUrl: data.audioUrl || data.response?.audioUrl,
        audioData: data.audioData,
        audioFormat: data.audioFormat || 'wav',
        timestamp: new Date().toISOString(),
        citations: (data.citations || data.response?.citations || []).map((citation: any, index: number) => ({
          fileId: citation.fileId || `file-${index}`,
          fileName: citation.fileName || citation.file_name || 'Unknown File',
          category: citation.category || 'reference',
          pageNumber: citation.pageNumber || citation.page_number,
          sectionTitle: citation.sectionTitle || citation.section_title,
          sectionLevel: citation.sectionLevel || 1,
          preview: citation.snippet || citation.content || '',
          relevance: citation.confidence || citation.score || 0.8,
          chunkIndex: citation.chunkIndex || index
        })),
        metadata: {
          element: data.element || user?.element,
          confidence: data.confidence,
          sessionId: `session-${user?.id}-${Date.now()}`
        }
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Analytics: Track response completion
      const responseLatency = Date.now() - sendStartTime;
      
      // Track interaction completion
      Analytics.completeInteraction(isVoiceInput ? 'voice' : 'text', {
        input_length: messageText.length,
        response_length: assistantMessage.content.length,
        latency_ms: responseLatency,
        success: true,
        has_audio: !!(assistantMessage.audioUrl || assistantMessage.audioData)
      });
      
      if (!isVoiceInput) {
        // This is a text interaction
        voiceFlowAnalytics.trackTextInteraction(messageText, assistantMessage.content, responseLatency);
      } else {
        // This is part of voice flow - track response completion
        voiceFlowAnalytics.trackResponseComplete(assistantMessage.content, responseLatency);
      }
      
      // Now generate TTS audio if we have text but no audio
      if (!assistantMessage.audioUrl && !assistantMessage.audioData) {
        try {
          const voiceResponse = await fetch('/api/voice/unified', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: assistantMessage.content,
              voice: 'maya',
              engine: 'auto',
              fallback: true,
              testMode: false
            })
          });
          
          if (voiceResponse.ok) {
            const voiceData = await voiceResponse.json();
            
            if (voiceData.success) {
              // Update message with audio
              assistantMessage.audioUrl = voiceData.audioUrl;
              assistantMessage.audioData = voiceData.audioData;
              assistantMessage.audioFormat = voiceData.format || 'wav';
              
              // Determine TTS provider from engine or URL patterns
              const ttsProvider: 'Sesame' | 'ElevenLabs' = 
                voiceData.engine === 'sesame' || assistantMessage.audioUrl?.includes('sesame') ? 'Sesame' : 'ElevenLabs';
              
              // Analytics: Track TTS completion
              const ttsLatency = Date.now() - sendStartTime - responseLatency;
              voiceFlowAnalytics.trackTTSComplete(
                ttsProvider, 
                ttsLatency, 
                voiceData.audioSize,
                true
              );
              
              // Track TTS success
              betaTracker.trackVoiceEvent('tts', {
                success: true,
                metadata: { 
                  engine: voiceData.engine,
                  fallbackUsed: voiceData.fallbackUsed 
                }
              });
            } else {
              console.error('🎤 Voice generation failed:', voiceData.error);
            }
          }
        } catch (voiceError) {
          console.error('🎤 TTS generation error:', voiceError);
          // Continue without audio
        }
      }
      
      // Set current audio for playback
      if (assistantMessage.audioUrl || assistantMessage.audioData) {
        setCurrentAudioUrl(assistantMessage.audioUrl);
        setCurrentAudioData(assistantMessage.audioData);
        setCurrentAudioFormat(assistantMessage.audioFormat);
        
        // Track voice flow complete
        onboardingTracker.trackVoiceFlowComplete(true, {
          sttSuccess: true,
          ttsSuccess: true,
          transcriptLength: messageText?.length || 0,
          audioQuality: 4.5
        });
      
        // Check for memory references
        const mayaContent = assistantMessage.content.toLowerCase();
        const hasMemoryReference = mayaContent.includes(user?.username?.toLowerCase() || '') ||
                                  mayaContent.includes('remember') ||
                                  mayaContent.includes('you mentioned') ||
                                  mayaContent.includes('earlier') ||
                                  mayaContent.includes('before');
        
        if (hasMemoryReference && interactionCount > 1) {
          onboardingTracker.trackMemoryRecallSuccess(true, {
            memoryType: 'session',
            contextRecalled: true,
            personalityConsistent: true
          });
        }
        
        // Show file upload option after 3rd interaction
        if (interactionCount === 3 && !showFileUpload) {
          setTimeout(() => setShowFileUpload(true), 2000);
        }
        
        // Show feedback after successful voice interaction
        if (interactionCount % 5 === 0 && !showFeedback) {
          setTimeout(() => setShowFeedback(true), 3000);
        }
      }
      
    } catch (error) {
      console.error('Error:', error);
      const responseLatency = Date.now() - sendStartTime;
      
      // Track interaction failure
      Analytics.completeInteraction(isVoiceInput ? 'voice' : 'text', {
        input_length: messageText.length,
        response_length: 0,
        latency_ms: responseLatency,
        success: false,
        error_type: 'api_error',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Analytics: Track error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      voiceFlowAnalytics.trackError(
        'processing',
        'api_error',
        errorMessage,
        isVoiceInput ? 'voice' : 'text'
      );
      
      // Track API error
      betaTracker.trackMemoryEvent('load', 'session', {
        success: false,
        errorMessage
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, I&apos;m having trouble connecting. Please try again.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
      // Update session metrics after each interaction
      voiceFlowAnalytics.updateSessionMetrics();
    }
  };

  // Handle interim transcript (live preview)
  const handleInterimTranscript = (transcript: string) => {
    setInterimTranscript(transcript);
  };

  // Handle final transcript (complete)
  const handleVoiceTranscript = (transcript: string) => {
    setFinalTranscript(transcript);
    setInterimTranscript(""); // Clear interim
    
    // Track STT success
    const sttSuccess = transcript.trim().length > 0;
    betaTracker.trackVoiceEvent('stt', {
      success: sttSuccess,
      metadata: { transcriptLength: transcript.length }
    });
    
    // Analytics: Track voice interaction and transcription complete
    voiceFlowAnalytics.trackVoiceInteraction();
    voiceFlowAnalytics.trackTranscriptionComplete(transcript);
    
    // Track Milestone 2: Voice Flow Complete (STT part)
    if (sttSuccess) {
    }
    
    if (transcript.trim()) {
      setTimeout(() => {
        setFinalTranscript(""); // Clear final transcript after sending
        handleSend(transcript);
      }, 200); // Reduced delay for faster response
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('beta_user');
    router.push('/');
  };

  // Recording control functions
  const startRecording = async () => {
    // Unlock audio on first interaction
    await unlockAudio();
    // Analytics: Track voice flow start
    voiceFlowAnalytics.startVoiceFlow('voice');
    microphoneRef.current?.startRecording();
  };

  const stopRecording = () => {
    microphoneRef.current?.stopRecording();
  };

  const toggleRecording = () => {
    microphoneRef.current?.toggleRecording();
  };

  const handleTorusClick = async () => {
    console.log('🎯 Torus clicked - useContinuousMode:', useContinuousMode, 'isRecording:', isRecording);
    if (useContinuousMode) {
      await unlockAudio();
      console.log('🔊 Audio unlocked, toggling listening...');
      continuousRef.current?.toggleListening();
      console.log('🎤 Toggle listening called on ref:', continuousRef.current);
    } else {
      toggleRecording();
    }
  };

  // Keyboard handler for Return key shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();

      if (input.trim()) {
        // Send text message
        handleSend(input);
      } else {
        // Voice toggle when no text
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      }
    } else if (e.key === "Escape") {
      // Escape to cancel recording or clear input
      if (isRecording) {
        stopRecording();
      } else if (input.trim()) {
        setInput("");
      }
    }
  };


  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0D16] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gray-600 border-t-[#FFD700] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0D16] text-white flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-sm bg-[#0A0D16]/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Holoflower Icon */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 relative">
              <svg width="40" height="40" viewBox="0 0 200 200" className="absolute inset-0">
                <defs>
                  <radialGradient id="holoflower-header-gradient">
                    <stop offset="0%" stopColor="#E3B778" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#F0C98A" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#D4A574" stopOpacity="0.5" />
                  </radialGradient>
                </defs>
                {/* Center */}
                <circle cx="100" cy="100" r="12" fill="url(#holoflower-header-gradient)" opacity="0.9" />
                {/* Petals */}
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                  <ellipse
                    key={angle}
                    cx="100"
                    cy="65"
                    rx="15"
                    ry="35"
                    fill="url(#holoflower-header-gradient)"
                    opacity="0.6"
                    transform={`rotate(${angle} 100 100)`}
                  />
                ))}
              </svg>
            </div>
            <div className="min-w-0 flex flex-col">
              <h1 className="text-sm sm:text-base font-bold tracking-wider text-soul-accent truncate" style={{ letterSpacing: '0.1em' }}>SOULLAB</h1>
              <p className="text-[10px] sm:text-xs text-soul-textTertiary truncate">Beta Experience</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => router.push('/oracle/library')}
              className="p-3 hover:bg-soul-surface rounded-lg transition-colors"
              title="Maya's Library"
            >
              <Library className="w-5 h-5 transition-colors" style={{ color: '#FEF3C7' }} />
            </button>
            <button
              onClick={() => setShowObsidianVault(true)}
              className="p-3 hover:bg-soul-surface rounded-lg transition-colors"
              title="Obsidian Vault"
            >
              <Database className="w-5 h-5 transition-colors" style={{ color: '#FEF3C7' }} />
            </button>
            <button
              onClick={() => router.push('/journal')}
              className="p-3 hover:bg-soul-surface rounded-lg transition-colors"
              title="Journal"
            >
              <BookOpen className="w-5 h-5 transition-colors" style={{ color: '#FEF3C7' }} />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 hover:bg-soul-surface rounded-lg transition-colors"
              title="Voice Settings"
            >
              <Settings className="w-5 h-5 transition-colors" style={{ color: '#FEF3C7' }} />
            </button>
            <button
              onClick={() => setShowFeedback(true)}
              className="p-3 hover:bg-soul-surface rounded-lg transition-colors"
              title="Give Feedback"
            >
              <Sparkles className="w-5 h-5 transition-colors" style={{ color: '#F0C98A' }} />
            </button>
            <button
              onClick={handleSignOut}
              className="p-3 hover:bg-soul-surface rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 transition-colors" style={{ color: '#FEF3C7' }} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-3 hover:bg-soul-surface rounded-lg transition-colors flex-shrink-0"
            title="Menu"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5 transition-colors" style={{ color: '#FEF3C7' }} />
            ) : (
              <Menu className="w-5 h-5 transition-colors" style={{ color: '#FEF3C7' }} />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-soul-border bg-[#0A0D16]/95 backdrop-blur-sm">
            <div className="px-3 py-2 space-y-1">
              <button
                onClick={() => {
                  router.push('/oracle/library');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-soul-surface rounded-lg transition-colors text-left"
              >
                <Library className="w-5 h-5" style={{ color: '#FEF3C7' }} />
                <span className="text-soul-textPrimary">Maya's Library</span>
              </button>
              <button
                onClick={() => {
                  setShowObsidianVault(true);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-soul-surface rounded-lg transition-colors text-left"
              >
                <Database className="w-5 h-5" style={{ color: '#FEF3C7' }} />
                <span className="text-soul-textPrimary">Obsidian Vault</span>
              </button>
              <button
                onClick={() => {
                  router.push('/journal');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-soul-surface rounded-lg transition-colors text-left"
              >
                <BookOpen className="w-5 h-5" style={{ color: '#FEF3C7' }} />
                <span className="text-soul-textPrimary">Journal</span>
              </button>
              <button
                onClick={() => {
                  setShowSettings(true);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-soul-surface rounded-lg transition-colors text-left"
              >
                <Settings className="w-5 h-5" style={{ color: '#FEF3C7' }} />
                <span className="text-soul-textPrimary">Voice Settings</span>
              </button>
              <button
                onClick={() => {
                  setShowFeedback(true);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-soul-surface rounded-lg transition-colors text-left"
              >
                <Sparkles className="w-5 h-5" style={{ color: '#F0C98A' }} />
                <span className="text-soul-textPrimary">Give Feedback</span>
              </button>
              <button
                onClick={() => {
                  handleSignOut();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-soul-surface rounded-lg transition-colors text-left"
              >
                <LogOut className="w-5 h-5" style={{ color: '#FEF3C7' }} />
                <span className="text-soul-textPrimary">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto">
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={{
                role: message.role as 'user' | 'assistant',
                content: message.role === 'assistant' ? cleanMessage(message.content) : message.content,
                timestamp: message.timestamp,
                audioUrl: message.audioUrl,
                citations: message.citations || [],
                metadata: message.metadata
              }}
              isLatest={index === messages.length - 1}
              onPlayAudio={(audioUrl) => {
                setCurrentAudioUrl(audioUrl);
                setIsSpeaking(true);
              }}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-[#1A1F2E]/50 border border-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-[#FFD700] rounded-full animate-pulse" />
                  <span className="text-[#FFD700] text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Player */}
        {(currentAudioUrl || currentAudioData) && (
          <OracleVoicePlayer
            audioUrl={currentAudioUrl}
            audioData={currentAudioData}
            format={currentAudioFormat}
            onPlaybackComplete={() => {
              setCurrentAudioUrl(null);
              setCurrentAudioData(null);
              setIsSpeaking(false); // Maya finished speaking
            }}
            onPlaybackStart={() => {
              setIsSpeaking(true); // Maya started speaking
              // Update transcript preview to show speaking state
              const audioSource = currentAudioUrl || (currentAudioData ? 'base64 data' : 'unknown');
            }}
          />
        )}

        {/* Torus Indicator - Shows voice state */}
        <button
          onClick={handleTorusClick}
          disabled={isLoading}
          className={`
          absolute bottom-44 sm:bottom-40 left-1/2 transform -translate-x-1/2 z-20
          relative flex items-center justify-center transition-all duration-500
          cursor-pointer hover:scale-110 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-full
          hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]
          ${isRecording
            ? 'scale-90 sm:scale-110 brightness-125'
            : 'scale-75 sm:scale-100 brightness-100'
          }
        `}
          title={isRecording ? "Click to stop listening" : "Click to start listening"}
          aria-label={isRecording ? "Stop listening" : "Start listening"}
        >
          {/* Ripple waves - only show when recording */}
          {isRecording && (
            <>
              <span className="absolute w-24 h-24 rounded-full border border-[#FFD700] opacity-60 animate-[ping_2s_linear_infinite]" />
              <span className="absolute w-32 h-32 rounded-full border border-[#FFD700] opacity-30 animate-[ping_3s_linear_infinite]" />
            </>
          )}

          <MicTorusIndicator
            isRecording={isRecording}
            isProcessing={isLoading}
            isSpeaking={!!currentAudioUrl || !!currentAudioData}
          />
        </button>

        {/* Live Transcript Preview - Fixed positioning */}
        <div className="px-4 pb-2">
          <TranscriptPreview
            interimTranscript={interimTranscript}
            finalTranscript={finalTranscript}
            isRecording={isRecording}
            isSpeaking={!!currentAudioUrl}
            isProcessing={isLoading}
          />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 p-2 sm:p-4 bg-[#0A0D16]/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Continuous Conversation Mode - NOW USING WebRTC with MAIA consciousness! */}
            {useContinuousMode && (
              <div className="hidden">
                <MaiaWebRTCConversation
                  ref={continuousRef}
                  onTranscript={handleVoiceTranscript}
                  onInterimTranscript={setInterimTranscript}
                  onRecordingStateChange={setIsRecording}
                  isProcessing={isLoading}
                  isSpeaking={isSpeaking}
                  autoStart={false}
                  userId={user?.id || 'anonymous'}
                  element={user?.element || 'aether'}
                  conversationStyle="natural"
                  voice="shimmer"
                  silenceThreshold={settings.adaptiveMode
                    ? Math.min(settings.silenceTimeout, 2500)
                    : Math.min(settings.silenceTimeout, 3000)
                  }
                  vadSensitivity={0.3}
                />
              </div>
            )}

            {!useContinuousMode ? (
              <>
                {/* Traditional Mic Button - Tesla Style with proper click target */}
                <button
                  onClick={toggleRecording}
                  className="relative group flex-shrink-0"
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  {/* Tesla-style visualization container */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                    {/* Pulsing ring effect */}
                    {isRecording && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-sacred-gold/30 animate-ping" />
                        <div className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-sacred-gold/50 animate-pulse" />
                      </div>
                    )}

                    {/* Mic icon button */}
                    <div className={`
                      relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                      transition-all duration-300 border-2
                      ${isRecording
                        ? 'bg-sacred-gold/20 border-sacred-gold text-sacred-gold shadow-lg shadow-sacred-gold/30'
                        : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-sacred-gold/50 hover:text-sacred-gold/70'
                      }
                    `}>
                      {isRecording ? (
                        <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Hidden MicrophoneCapture for actual functionality */}
                <div className="hidden">
                  <MicrophoneCapture
                    ref={microphoneRef}
                    onTranscript={handleVoiceTranscript}
                    onInterimTranscript={setInterimTranscript}
                    isProcessing={isLoading}
                    onRecordingStateChange={setIsRecording}
                  />
                </div>
              </>
            ) : null}

            {/* File Upload Button */}
            <div className="flex-shrink-0">
              <InlineFileUpload
                onFilesChange={updateFiles}
                maxFiles={5}
                maxSizePerFile={10}
              />
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={attachedFiles.length > 0 ? "Ask about your files..." : "What's on your mind?"}
              className="flex-1 min-w-0 bg-[#1A1F2E] border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading || hasUploadingFiles()}
              className="flex-shrink-0 p-2 sm:p-3 bg-[#FFD700] text-black rounded-lg hover:bg-[#FFD700]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          {/* Dynamic Hint Text */}
          <div className="text-xs mt-2 px-2 sm:px-4 pb-2 flex justify-center">
            {hasUploadingFiles() ? (
              <span className="text-[#FFD700] animate-pulse font-medium">
                ⏳ Uploading files...
              </span>
            ) : isRecording ? (
              <span className="text-[#FFD700] animate-pulse font-medium">
                ✨ Press ⏎ to stop & send recording • Esc to cancel
              </span>
            ) : input.trim() ? (
              <span className="text-slate-400">
                Press ⏎ to send text • Shift+⏎ for newline
              </span>
            ) : (
              <span className="text-slate-400">
                Press ⏎ to start voice recording • Drop files or click 📎 to attach
              </span>
            )}
          </div>
        </div>

        {/* File Upload for Multimodal Milestone */}
        {showFileUpload && (
          <div className="p-4 border-t border-gray-800 bg-[#0A0D16]/60">
            <FileUploadTracker 
              onFileAnalyzed={(success, metadata) => {
                if (success) {
                  // Add a message showing the analysis
                  setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `I&apos;ve analyzed your ${metadata?.fileName || 'file'}. ${metadata?.analysisResults || 'Analysis complete.'}`,
                    timestamp: new Date().toISOString(),
                    citations: [],
                    metadata: {
                      element: user?.element,
                      sessionId: `session-${user?.id}-${Date.now()}`
                    }
                  }]);
                }
                // Hide upload after first successful analysis
                if (success) {
                  setTimeout(() => setShowFileUpload(false), 2000);
                }
              }}
            />
          </div>
        )}
        
        {/* Beta Feedback */}
        {showFeedback && (
          <QuickFeedback onClose={() => setShowFeedback(false)} />
        )}

        {/* Voice Settings */}
        <VoiceSettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        {/* Obsidian Vault Panel */}
        <ObsidianVaultPanel
          isOpen={showObsidianVault}
          onClose={() => setShowObsidianVault(false)}
        />

        {/* Debug Panel - Development Only */}
        {process.env.NODE_ENV === 'development' && debugInfo.timestamp && (
          <div className="border-t border-gray-800 bg-[#0A0D16]/90 p-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xs font-semibold text-[#FFD700] mb-2">🧪 Voice Pipeline Debug</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">TTS Service:</span>
                  <p className="text-white font-mono">{debugInfo.ttsService || 'unknown'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Processing Time:</span>
                  <p className="text-white font-mono">{debugInfo.processingTime || 0}ms</p>
                </div>
                <div>
                  <span className="text-gray-400">Memory Layers:</span>
                  <p className="text-white font-mono">
                    {debugInfo.memoryLayersLoaded 
                      ? Object.entries(debugInfo.memoryLayersLoaded)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ') 
                      : 'none'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Recording:</span>
                  <p className="text-white font-mono">{isRecording ? '🎙️ Active' : '⏹️ Idle'}</p>
                </div>
              </div>
              {debugInfo.error && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                  <span className="text-red-400 text-xs">Error: {debugInfo.error}</span>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
  );
}

// Simple auth check for beta
export default function OraclePage() {
  return (
    <VoiceSettingsProvider>
      <OraclePageInner />
    </VoiceSettingsProvider>
  );
}