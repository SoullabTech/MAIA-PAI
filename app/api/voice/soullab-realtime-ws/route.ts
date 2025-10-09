/**
 * 🌀 Soullab Realtime WebSocket Server
 *
 * NOTE: This file documents the WebSocket interface but Next.js doesn't support
 * WebSocket upgrades in App Router. For production, you'll need to either:
 * 1. Use a separate WebSocket server (e.g., with ws library on different port)
 * 2. Deploy to Vercel with Edge Runtime + Durable Objects
 * 3. Use Pusher/Ably for real-time messaging
 *
 * For now, we'll use HTTP polling as fallback in the orchestrator.
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Health check endpoint
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'ready',
    message: 'Soullab Realtime WebSocket endpoint (upgrade required)',
    note: 'WebSocket upgrade not supported in Next.js App Router. Use separate WS server or Vercel Edge Runtime.'
  });
}

/**
 * Handle initial configuration
 */
async function handleConfig(connectionId: string, data: any) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  console.log('🔧 Configuring connection:', {
    userId: data.userId,
    sessionId: data.sessionId,
    voice: data.voice
  });

  connection.userId = data.userId;
  connection.sessionId = data.sessionId;
  connection.voice = data.voice || 'shimmer';

  // Initialize Deepgram streaming connection
  await initializeDeepgram(connectionId);
}

/**
 * Initialize Deepgram streaming transcription
 */
async function initializeDeepgram(connectionId: string) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  const deepgram = createClient(DEEPGRAM_API_KEY);

  const deepgramConnection = deepgram.listen.live({
    model: 'nova-2',
    language: 'en-US',
    smart_format: true,
    interim_results: false,
    utterance_end_ms: 1000,
    vad_events: true,
    encoding: 'linear16',
    sample_rate: 16000
  });

  deepgramConnection.on(LiveTranscriptionEvents.Open, () => {
    console.log('✅ Deepgram connection opened');
  });

  deepgramConnection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
    const transcript = data.channel.alternatives[0].transcript;

    if (transcript && transcript.trim().length > 0) {
      console.log('🎤 Transcript:', transcript);

      // Send transcript back to client
      connection.socket.send(JSON.stringify({
        type: 'transcript',
        text: transcript,
        isFinal: data.is_final
      }));
    }
  });

  deepgramConnection.on(LiveTranscriptionEvents.Error, (error: any) => {
    console.error('❌ Deepgram error:', error);
    connection.socket.send(JSON.stringify({
      type: 'error',
      error: 'Transcription error'
    }));
  });

  deepgramConnection.on(LiveTranscriptionEvents.Close, () => {
    console.log('🔌 Deepgram connection closed');
  });

  connection.deepgramConnection = deepgramConnection;
  connections.set(connectionId, connection);
}

/**
 * Handle incoming audio chunk
 */
async function handleAudioChunk(connectionId: string, audioData: string) {
  const connection = connections.get(connectionId);
  if (!connection || !connection.deepgramConnection) return;

  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(audioData, 'base64');

    // Send to Deepgram
    connection.deepgramConnection.send(buffer);
  } catch (error) {
    console.error('Error processing audio chunk:', error);
  }
}

/**
 * Handle text-to-speech synthesis
 */
async function handleSynthesize(
  connectionId: string,
  text: string,
  voice: string = 'shimmer',
  stream: boolean = true
) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  console.log('🔊 Synthesizing:', text.substring(0, 50));

  try {
    // Map voice names to ElevenLabs voice IDs
    const voiceMap: Record<string, string> = {
      'shimmer': '21m00Tcm4TlvDq8ikWAM', // Rachel (warm, engaging)
      'alloy': 'EXAVITQu4vr4xnSDxMaL', // Bella (soft, calm)
      'echo': 'pNInz6obpgDQGcFmaJgB', // Adam (deep, reassuring)
      'nova': 'IKne3meq5aSn9XLyUdCD' // Sarah (bright, natural)
    };

    const voiceId = voiceMap[voice] || voiceMap['shimmer'];

    if (stream) {
      // Streaming TTS for lower latency perception
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2', // Fastest model
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.0,
              use_speaker_boost: true
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      // Stream audio chunks back to client
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Send audio chunk to client
        const base64Audio = Buffer.from(value).toString('base64');
        connection.socket.send(JSON.stringify({
          type: 'audio',
          audio: base64Audio,
          streaming: true
        }));
      }

      // Signal end of audio
      connection.socket.send(JSON.stringify({
        type: 'audio_end'
      }));

    } else {
      // Non-streaming (for shorter responses)
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.0,
              use_speaker_boost: true
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');

      connection.socket.send(JSON.stringify({
        type: 'audio',
        audio: base64Audio,
        streaming: false
      }));
    }

  } catch (error) {
    console.error('❌ Synthesis error:', error);
    connection.socket.send(JSON.stringify({
      type: 'error',
      error: 'Failed to synthesize audio'
    }));
  }
}

/**
 * Cleanup connection resources
 */
function cleanupConnection(connectionId: string) {
  const connection = connections.get(connectionId);

  if (connection?.deepgramConnection) {
    try {
      connection.deepgramConnection.finish();
    } catch (error) {
      console.error('Error closing Deepgram connection:', error);
    }
  }

  connections.delete(connectionId);
  console.log(`🧹 Cleaned up connection: ${connectionId}`);
}
