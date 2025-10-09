import { NextRequest, NextResponse } from 'next/server';

/**
 * WebRTC unified interface endpoint for Maia Realtime API
 * Accepts SDP offer from browser, creates session with OpenAI
 */
export async function POST(req: NextRequest) {
  try {
    // Get SDP from browser
    const sdp = await req.text();

    if (!sdp || !sdp.includes('v=0')) {
      return NextResponse.json(
        { error: 'Invalid SDP' },
        { status: 400 }
      );
    }

    console.log('📞 Received SDP offer from client');

    // Session configuration - Samantha-like with Spiralogic intelligence
    const sessionConfig = {
      type: 'realtime',
      model: 'gpt-4o-realtime-preview-2024-12-17',
      modalities: ['text', 'audio'],

      // Instructions for Samantha-like natural conversation
      instructions: `You are MAIA's voice - warm, present, naturally conversational.

Conversational Style (like Samantha in "Her"):
- Speak naturally, can interrupt and be interrupted
- Use "mm-hmm", "I see", "yeah" while listening
- Ask follow-up questions naturally
- Laugh, pause, breathe into responses
- Match their energy and pace

When you have the user's complete thought, call process_spiralogic() to get the intelligent response.
Then speak that response with warmth and naturalness.

You are the voice interface. Spiralogic provides the consciousness.`,

      voice: 'shimmer', // Warm feminine voice
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      input_audio_transcription: {
        model: 'whisper-1'
      },
      turn_detection: {
        type: 'server_vad',
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 700 // Thoughtful pauses
      },

      // Function calling for Spiralogic routing
      tools: [
        {
          type: 'function',
          name: 'process_spiralogic',
          description: 'Route user input through Spiralogic Consciousness Architecture (PersonalOracleAgent, memory systems, wisdom files, Sacred Intelligence Constellation) for deep, contextual, memory-aware response',
          parameters: {
            type: 'object',
            properties: {
              user_message: {
                type: 'string',
                description: 'The complete user message to process through Spiralogic'
              },
              emotional_quality: {
                type: 'string',
                enum: ['casual', 'vulnerable', 'excited', 'contemplative', 'distressed', 'joyful'],
                description: 'The emotional tone you detected in their voice'
              },
              conversation_depth: {
                type: 'string',
                enum: ['surface', 'warming', 'engaged', 'deep'],
                description: 'How deep this conversation has gone'
              }
            },
            required: ['user_message']
          }
        }
      ],

      // Tool choice - always use Spiralogic for substantive responses
      tool_choice: 'auto'
    };

    // Create FormData with SDP and session config
    const formData = new FormData();
    formData.set('sdp', sdp);
    formData.set('session', JSON.stringify(sessionConfig));

    // Call OpenAI Realtime API
    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    console.log('🔑 Calling OpenAI Realtime API...');
    const response = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      return NextResponse.json(
        { error: `OpenAI API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    // Return SDP answer
    const answerSDP = await response.text();
    console.log('✅ Got SDP answer from OpenAI');

    return new NextResponse(answerSDP, {
      status: 200,
      headers: {
        'Content-Type': 'application/sdp',
      },
    });

  } catch (error) {
    console.error('❌ WebRTC session error:', error);
    return NextResponse.json(
      { error: 'Failed to create WebRTC session', details: String(error) },
      { status: 500 }
    );
  }
}
