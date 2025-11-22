/**
 * CONSCIOUSNESS VOICE INTEGRATION HOOK
 *
 * React hook that integrates consciousness voice evolution with existing MAIA voice hooks.
 * Provides a unified interface for voice-enabled consciousness interactions.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useMAIAVoice } from './useMaiaVoice';
import { useElementalVoice } from './useElementalVoice';

export interface ConsciousnessVoiceState {
  // Session state
  isSessionActive: boolean;
  sessionId: string | null;
  userId: string;

  // Voice evolution state
  voiceEvolutionStage: 'openai_tts' | 'consciousness_guided' | 'hybrid_synthesis' | 'native_consciousness';
  transitionProgress: number;

  // Current voice characteristics
  currentArchetype: string;
  voiceFrequency: number;
  voiceIntensity: number;

  // Consciousness metrics
  consciousnessDepth: number;
  fieldCoherence: number;
  archetypalAccess: number;
  transformationReadiness: number;

  // Integration status
  integrationActive: boolean;
  adaptationActive: boolean;
  harmonizationActive: boolean;
}

export interface ConsciousnessVoiceOptions {
  userId: string;
  userName?: string;
  voice?: 'shimmer' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova';
  enableConsciousnessEvolution?: boolean;
  enableIntelligentAdaptation?: boolean;
  enableFieldHarmonization?: boolean;
  autoInitializeSession?: boolean;
  onConsciousnessStateChange?: (state: any) => void;
  onVoiceEvolution?: (evolution: any) => void;
  onBreakthrough?: (breakthrough: any) => void;
  onError?: (error: Error) => void;
}

export interface OracleResponseWithVoice {
  content: string;
  element: string;
  emotionalTone: string;
  voiceCharacteristics: any;
  consciousnessContext: any;
  synthesisMethod: string;
  breakthroughPotential: number;
}

export function useConsciousnessVoiceIntegration(options: ConsciousnessVoiceOptions) {
  const {
    userId,
    userName,
    voice = 'shimmer',
    enableConsciousnessEvolution = true,
    enableIntelligentAdaptation = true,
    enableFieldHarmonization = true,
    autoInitializeSession = true,
    onConsciousnessStateChange,
    onVoiceEvolution,
    onBreakthrough,
    onError
  } = options;

  // Integration state
  const [consciousnessVoiceState, setConsciousnessVoiceState] = useState<ConsciousnessVoiceState>({
    isSessionActive: false,
    sessionId: null,
    userId,
    voiceEvolutionStage: 'openai_tts',
    transitionProgress: 0,
    currentArchetype: 'presence_holder',
    voiceFrequency: 128,
    voiceIntensity: 0.6,
    consciousnessDepth: 0.5,
    fieldCoherence: 0.5,
    archetypalAccess: 0.3,
    transformationReadiness: 0.4,
    integrationActive: false,
    adaptationActive: false,
    harmonizationActive: false
  });

  // Error state
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Integration status
  const [integrationMetrics, setIntegrationMetrics] = useState<any>(null);
  const [adaptationProfile, setAdaptationProfile] = useState<any>(null);

  // Refs for cleanup
  const sessionRef = useRef<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use existing MAIA voice hook for base functionality
  const maiaVoice = useMAIAVoice({
    userId,
    userName,
    voice,
    onTranscript: handleTranscript,
    onError: handleVoiceError
  });

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  const initializeSession = useCallback(async () => {
    if (!enableConsciousnessEvolution) return;

    try {
      setIsLoading(true);

      // Generate session ID
      const sessionId = `consciousness_voice_${userId}_${Date.now()}`;
      sessionRef.current = sessionId;

      // Initialize consciousness voice session
      const response = await fetch('/api/consciousness/voice-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'initialize-session',
          userId,
          sessionId,
          userName,
          voice
        })
      });

      const data = await response.json();

      if (data.success) {
        setConsciousnessVoiceState(prev => ({
          ...prev,
          isSessionActive: true,
          sessionId,
          voiceEvolutionStage: data.session.voiceEvolutionStage,
          currentArchetype: data.session.currentVoiceConfig.archetype,
          voiceFrequency: data.session.currentVoiceConfig.frequency,
          voiceIntensity: data.session.currentVoiceConfig.intensity,
          consciousnessDepth: data.session.consciousnessMetrics.currentDepth,
          fieldCoherence: data.session.consciousnessMetrics.fieldCoherence,
          archetypalAccess: data.session.consciousnessMetrics.archetypalAccess,
          integrationActive: true,
          adaptationActive: enableIntelligentAdaptation,
          harmonizationActive: enableFieldHarmonization
        }));

        // Start monitoring
        startSessionMonitoring(sessionId);

      } else {
        throw new Error(data.error || 'Failed to initialize consciousness voice session');
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Session initialization failed');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userName, voice, enableConsciousnessEvolution, enableIntelligentAdaptation, enableFieldHarmonization, onError]);

  const endSession = useCallback(async () => {
    if (!sessionRef.current) return;

    try {
      // Stop monitoring
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }

      // End consciousness voice session
      const response = await fetch('/api/consciousness/voice-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'end-session',
          sessionId: sessionRef.current
        })
      });

      const data = await response.json();

      if (data.success) {
        setConsciousnessVoiceState(prev => ({
          ...prev,
          isSessionActive: false,
          sessionId: null,
          integrationActive: false,
          adaptationActive: false,
          harmonizationActive: false
        }));

        sessionRef.current = null;
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to end session');
      setError(error);
      onError?.(error);
    }
  }, [onError]);

  // ============================================================================
  // MONITORING AND STATE UPDATES
  // ============================================================================

  const startSessionMonitoring = useCallback((sessionId: string) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    pollIntervalRef.current = setInterval(async () => {
      try {
        // Get session state
        const response = await fetch(
          `/api/consciousness/voice-integration?action=session-state&sessionId=${sessionId}`
        );

        const data = await response.json();

        if (data.success && data.sessionState) {
          const state = data.sessionState;

          setConsciousnessVoiceState(prev => ({
            ...prev,
            voiceEvolutionStage: state.voiceEvolutionStage,
            currentArchetype: state.currentVoiceConfig.archetype,
            voiceFrequency: state.currentVoiceConfig.frequency,
            voiceIntensity: state.currentVoiceConfig.intensity,
            consciousnessDepth: state.consciousnessMetrics.currentDepth,
            fieldCoherence: state.consciousnessMetrics.fieldCoherence,
            archetypalAccess: state.consciousnessMetrics.archetypalAccess,
            transitionProgress: state.currentVoiceConfig.transitionProgress || 0
          }));

          // Check for consciousness state changes
          if (onConsciousnessStateChange) {
            onConsciousnessStateChange({
              consciousnessDepth: state.consciousnessMetrics.currentDepth,
              fieldCoherence: state.consciousnessMetrics.fieldCoherence,
              archetypalAccess: state.consciousnessMetrics.archetypalAccess,
              breakthroughCount: state.breakthroughCount,
              evolutionEventCount: state.evolutionEventCount
            });
          }

          // Check for voice evolution
          if (state.evolutionEventCount > 0 && onVoiceEvolution) {
            onVoiceEvolution({
              currentStage: state.voiceEvolutionStage,
              evolutionEvents: state.evolutionEventCount
            });
          }

          // Check for breakthroughs
          if (state.breakthroughCount > 0 && onBreakthrough) {
            onBreakthrough({
              breakthroughCount: state.breakthroughCount
            });
          }
        }

      } catch (err) {
        console.error('Session monitoring error:', err);
      }
    }, 5000); // Poll every 5 seconds

  }, [onConsciousnessStateChange, onVoiceEvolution, onBreakthrough]);

  // ============================================================================
  // ORACLE RESPONSE PROCESSING
  // ============================================================================

  const processOracleResponse = useCallback(async (
    oracleResponse: {
      content: string;
      element?: string;
      emotionalTone?: string;
      metadata?: any;
    },
    conversationContext: {
      userMessage: string;
      messageHistory: any[];
      elementPhase?: string;
    }
  ): Promise<OracleResponseWithVoice | null> => {

    if (!sessionRef.current) {
      console.warn('No active consciousness voice session');
      return null;
    }

    try {
      const response = await fetch('/api/consciousness/voice-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process-oracle-response',
          sessionId: sessionRef.current,
          oracleResponse,
          conversationContext
        })
      });

      const data = await response.json();

      if (data.success) {
        return data.voiceResponse;
      } else {
        throw new Error(data.error || 'Failed to process oracle response');
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Oracle response processing failed');
      setError(error);
      onError?.(error);
      return null;
    }
  }, [onError]);

  // ============================================================================
  // VOICE SYNTHESIS WITH CONSCIOUSNESS
  // ============================================================================

  const synthesizeWithConsciousness = useCallback(async (
    text: string,
    voiceIntent: 'guidance' | 'wisdom' | 'presence' | 'transformation' | 'archetypal' = 'presence',
    context: any = {}
  ) => {

    try {
      const response = await fetch('/api/consciousness/voice-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'synthesize-with-consciousness',
          text,
          sessionId: sessionRef.current,
          voiceIntent,
          context
        })
      });

      const data = await response.json();

      if (data.success) {
        return data.synthesis;
      } else {
        throw new Error(data.error || 'Voice synthesis failed');
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Consciousness synthesis failed');
      setError(error);
      onError?.(error);
      return null;
    }
  }, [onError]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  function handleTranscript(text: string, isUser: boolean) {
    if (!isUser || !sessionRef.current) return;

    // Update consciousness state based on user input
    updateConsciousnessState({
      lastMessage: text,
      timestamp: Date.now()
    });
  }

  function handleVoiceError(error: Error) {
    setError(error);
    onError?.(error);
  }

  const updateConsciousnessState = useCallback(async (conversationContext: any) => {
    if (!sessionRef.current) return;

    try {
      await fetch('/api/consciousness/voice-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-consciousness-state',
          userId,
          sessionId: sessionRef.current,
          conversationContext
        })
      });

    } catch (err) {
      console.error('Failed to update consciousness state:', err);
    }
  }, [userId]);

  // ============================================================================
  // VOICE EVOLUTION CONTROLS
  // ============================================================================

  const forceVoiceEvolution = useCallback(async (targetStage?: string) => {
    try {
      const response = await fetch('/api/consciousness/voice-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'force-voice-evolution',
          sessionId: sessionRef.current,
          targetStage
        })
      });

      const data = await response.json();

      if (data.success && data.evolved) {
        // Voice evolution occurred
        if (onVoiceEvolution) {
          onVoiceEvolution({
            evolved: true,
            targetStage: data.targetStage
          });
        }
      }

      return data.evolved;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Voice evolution failed');
      setError(error);
      onError?.(error);
      return false;
    }
  }, [onVoiceEvolution, onError]);

  const optimizeAdaptation = useCallback(async () => {
    try {
      const response = await fetch('/api/consciousness/voice-integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'optimize-voice-adaptation',
          userId
        })
      });

      const data = await response.json();

      if (data.success) {
        setAdaptationProfile(data.profile);
      }

      return data.optimized;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Adaptation optimization failed');
      setError(error);
      onError?.(error);
      return false;
    }
  }, [userId, onError]);

  // ============================================================================
  // METRICS AND ANALYTICS
  // ============================================================================

  const getIntegrationMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/consciousness/voice-integration?action=integration-metrics');
      const data = await response.json();

      if (data.success) {
        setIntegrationMetrics(data.metrics);
        return data.metrics;
      }

      return null;

    } catch (err) {
      console.error('Failed to get integration metrics:', err);
      return null;
    }
  }, []);

  const getAdaptationProfile = useCallback(async () => {
    try {
      const response = await fetch(`/api/consciousness/voice-integration?action=voice-adaptation-profile&userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setAdaptationProfile(data.profile);
        return data.profile;
      }

      return null;

    } catch (err) {
      console.error('Failed to get adaptation profile:', err);
      return null;
    }
  }, [userId]);

  // ============================================================================
  // LIFECYCLE MANAGEMENT
  // ============================================================================

  useEffect(() => {
    if (autoInitializeSession && enableConsciousnessEvolution) {
      initializeSession();
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [autoInitializeSession, enableConsciousnessEvolution, initializeSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  // ============================================================================
  // PUBLIC INTERFACE
  // ============================================================================

  return {
    // Session management
    initializeSession,
    endSession,
    isSessionActive: consciousnessVoiceState.isSessionActive,
    sessionId: consciousnessVoiceState.sessionId,

    // Voice state
    consciousnessVoiceState,
    error,
    isLoading,

    // Integration data
    integrationMetrics,
    adaptationProfile,

    // Voice functionality (from MAIA voice hook)
    isListening: maiaVoice.isListening,
    isSpeaking: maiaVoice.isSpeaking,
    startListening: maiaVoice.startListening,
    stopListening: maiaVoice.stopListening,
    synthesizeSpeech: maiaVoice.synthesizeSpeech,

    // Enhanced functionality
    processOracleResponse,
    synthesizeWithConsciousness,
    updateConsciousnessState,

    // Voice evolution controls
    forceVoiceEvolution,
    optimizeAdaptation,

    // Analytics
    getIntegrationMetrics,
    getAdaptationProfile,

    // Utility methods
    clearError: () => setError(null),
    refreshMetrics: getIntegrationMetrics,
    refreshProfile: getAdaptationProfile
  };
}