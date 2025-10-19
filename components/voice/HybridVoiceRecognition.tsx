/**
 * Hybrid Voice Recognition
 *
 * Automatically selects the best voice recognition method based on browser capabilities:
 * - WhisperVoiceRecognition (MediaRecorder + OpenAI Whisper) for iOS and unsupported browsers
 * - ContinuousConversation (Web Speech API) for desktop browsers with good support
 *
 * This ensures voice works reliably on ALL devices while optimizing for speed and cost.
 */

'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import { shouldUseWhisper } from '@/lib/utils/browserDetection';
import { WhisperVoiceRecognition, VoiceActivatedMaiaRef } from '../ui/WhisperVoiceRecognition';
import { ContinuousConversation, ContinuousConversationRef } from '../../apps/web/components/voice/ContinuousConversation';

interface HybridVoiceProps {
  // WhisperVoiceRecognition props
  enabled?: boolean;
  isMuted?: boolean;
  isMayaSpeaking?: boolean;
  onTranscript: (text: string) => void;
  onAudioLevelChange?: (level: number) => void;
  conversationDepth?: 'quick' | 'normal' | 'deep';
  onManualStop?: () => void;

  // ContinuousConversation props
  onInterimTranscript?: (text: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  isProcessing?: boolean;
  isSpeaking?: boolean;
  autoStart?: boolean;
  silenceThreshold?: number;
  vadSensitivity?: number;
}

// Unified ref interface (compatible with both)
export type HybridVoiceRef = VoiceActivatedMaiaRef | ContinuousConversationRef;

export const HybridVoiceRecognition = forwardRef<HybridVoiceRef, HybridVoiceProps>((props, ref) => {
  const [useWhisper, setUseWhisper] = useState(true); // Default to Whisper for safety
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    // Detect on client side only
    if (typeof window !== 'undefined') {
      const shouldUse = shouldUseWhisper();
      setUseWhisper(shouldUse);
      setIsDetecting(false);

      console.log('🎤 [HybridVoice] Browser detection complete:', {
        useWhisper: shouldUse,
        method: shouldUse ? 'Whisper (MediaRecorder + OpenAI)' : 'Web Speech API',
        userAgent: navigator.userAgent
      });
    }
  }, []);

  // Don't render until detection is complete to avoid hydration mismatch
  if (isDetecting) {
    return null;
  }

  if (useWhisper) {
    // Use WhisperVoiceRecognition for iOS and unsupported browsers
    return (
      <WhisperVoiceRecognition
        ref={ref as React.Ref<VoiceActivatedMaiaRef>}
        enabled={props.enabled ?? true}
        isMuted={props.isMuted ?? false}
        isMayaSpeaking={props.isMayaSpeaking || props.isSpeaking || false}
        onTranscript={props.onTranscript}
        onAudioLevelChange={props.onAudioLevelChange}
        conversationDepth={props.conversationDepth}
        onManualStop={props.onManualStop}
      />
    );
  } else {
    // Use ContinuousConversation for desktop browsers with Web Speech API
    return (
      <ContinuousConversation
        ref={ref as React.Ref<ContinuousConversationRef>}
        onTranscript={props.onTranscript}
        onInterimTranscript={props.onInterimTranscript}
        onRecordingStateChange={props.onRecordingStateChange}
        isProcessing={props.isProcessing}
        isSpeaking={props.isSpeaking || props.isMayaSpeaking}
        autoStart={props.autoStart ?? props.enabled ?? true}
        silenceThreshold={props.silenceThreshold}
        vadSensitivity={props.vadSensitivity}
      />
    );
  }
});

HybridVoiceRecognition.displayName = 'HybridVoiceRecognition';
