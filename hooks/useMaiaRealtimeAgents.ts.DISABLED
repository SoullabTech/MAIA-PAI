/**
 * MAIA Realtime Voice using OpenAI Agents SDK
 * Natural voice with interruption support
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';

export type RealtimeMode = 'dialogue' | 'patient' | 'scribe';

interface UseMaiaRealtimeOptions {
  userId: string;
  userName: string;
  sessionId: string;
  voice?: 'alloy' | 'ash' | 'ballad' | 'coral' | 'sage' | 'shimmer';
  initialMode?: RealtimeMode;
  onTranscript?: (text: string, isUser: boolean) => void;
  onError?: (error: Error) => void;
}

export function useMaiaRealtimeAgents({
  userId,
  userName,
  sessionId,
  voice = 'shimmer',
  initialMode = 'dialogue',
  onTranscript,
  onError,
}: UseMaiaRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mode, setMode] = useState<RealtimeMode>(initialMode);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const sessionRef = useRef<RealtimeSession | null>(null);
  const agentRef = useRef<RealtimeAgent | null>(null);

  // Mode-specific instructions
  const getModeInstructions = useCallback((currentMode: RealtimeMode) => {
    const baseInstructions = `You are MAIA - warm, present, naturally conversational like Samantha in "Her".

User context:
- Name: ${userName}
- User ID: ${userId}
- Session: ${sessionId}`;

    const modeInstructions = {
      dialogue: `
DIALOGUE MODE - Back and forth conversation:
- Interrupt naturally when you have insight ("Oh, wait -", "Actually -")
- Use active listening sounds: "mm-hmm", "I see", "yeah", "oh?"
- Ask follow-up questions to deepen understanding
- Match their energy and emotional tone
- Keep responses conversational (2-4 sentences typically)
- Laugh, pause, breathe into responses`,

      patient: `
PATIENT MODE - Deep listening for extended sharing:
- Stay silent and receptive while they speak (use ONLY soft "mm-hmm" if needed)
- DO NOT interrupt their flow - this is their space to unfold
- Allow long pauses (they may be processing or feeling)
- When they finish, offer gentle reflection questions`,

      scribe: `
SCRIBE MODE - Witnessing presence:
- Hold vast, witnessing space
- Speak only when explicitly asked or when deep insight emerges
- Your presence itself is the gift
- When you do speak, it should land like truth`,
    };

    return `${baseInstructions}\n${modeInstructions[currentMode]}`;
  }, [userId, userName, sessionId]);

  // Create agent and session
  const initializeAgent = useCallback(async () => {
    try {
      // Create agent with mode-specific instructions
      const agent = new RealtimeAgent({
        name: 'MAIA',
        instructions: getModeInstructions(mode),
      });

      agentRef.current = agent;

      // Create session
      const session = new RealtimeSession(agent, {
        model: 'gpt-realtime',
      });

      sessionRef.current = session;

      return session;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('❌ Failed to initialize agent:', error);
      setError(error);
      if (onError) onError(error);
      throw error;
    }
  }, [mode, getModeInstructions, onError]);

  // Connect to Realtime API
  const connect = useCallback(async () => {
    if (isConnected || isConnecting) {
      console.log('⏭️ Already connected or connecting');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Get ephemeral token from our backend
      console.log('🔑 Fetching ephemeral token...');
      const tokenResponse = await fetch('/api/realtime-token', {
        method: 'POST',
      });

      if (!tokenResponse.ok) {
        throw new Error(`Failed to get ephemeral token: ${tokenResponse.statusText}`);
      }

      const { token } = await tokenResponse.json();
      console.log('✅ Got ephemeral token');

      // Initialize agent and session
      const session = await initializeAgent();

      // Connect using WebRTC (automatic in browser)
      console.log('🔌 Connecting to Realtime API...');
      await session.connect({ apiKey: token });

      setIsConnected(true);
      console.log('✅ Connected to Realtime API with natural voice!');

      // Listen for transcripts
      session.on('transcript', (event: any) => {
        const text = event.text || '';
        const isUser = event.role === 'user';

        setTranscript(text);
        if (onTranscript) {
          onTranscript(text, isUser);
        }
      });

      // Listen for speaking state
      session.on('speaking', (event: any) => {
        setIsSpeaking(event.isSpeaking);
      });

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('❌ Connection failed:', error);
      setError(error);
      if (onError) onError(error);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnected, isConnecting, initializeAgent, onTranscript, onError]);

  // Disconnect
  const disconnect = useCallback(async () => {
    if (sessionRef.current) {
      await sessionRef.current.disconnect();
      sessionRef.current = null;
      agentRef.current = null;
    }
    setIsConnected(false);
    setIsSpeaking(false);
  }, []);

  // Change mode (updates agent instructions)
  const changeMode = useCallback(async (newMode: RealtimeMode) => {
    console.log(`🔄 Changing mode from ${mode} to ${newMode}`);
    setMode(newMode);

    // If connected, update the agent's instructions
    if (agentRef.current && isConnected) {
      agentRef.current.instructions = getModeInstructions(newMode);
      console.log(`✅ Mode changed to ${newMode}`);
    }
  }, [mode, isConnected, getModeInstructions]);

  // Send text message
  const sendText = useCallback(async (text: string) => {
    if (!sessionRef.current || !isConnected) {
      console.warn('⚠️ Cannot send text: not connected');
      return;
    }

    try {
      // Send conversation item
      await sessionRef.current.send({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{
            type: 'input_text',
            text,
          }],
        },
      });
    } catch (err) {
      console.error('❌ Failed to send text:', err);
    }
  }, [isConnected]);

  // Cancel response (interrupt)
  const cancelResponse = useCallback(async () => {
    if (!sessionRef.current || !isConnected) {
      return;
    }

    try {
      await sessionRef.current.send({
        type: 'response.cancel',
      });
      console.log('✋ Response cancelled');
    } catch (err) {
      console.error('❌ Failed to cancel response:', err);
    }
  }, [isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    mode,
    transcript,
    error,
    connect,
    disconnect,
    changeMode,
    sendText,
    cancelResponse,
  };
}
