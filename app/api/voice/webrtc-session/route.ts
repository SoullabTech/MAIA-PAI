import { NextRequest, NextResponse } from 'next/server';

/**
 * WebRTC unified interface endpoint for Maia Realtime API
 * Accepts SDP offer + mode configuration from browser, creates session with OpenAI
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request body (can be JSON with mode or plain SDP)
    const contentType = req.headers.get('content-type') || '';
    let sdp: string;
    let mode: 'dialogue' | 'patient' | 'scribe' = 'dialogue';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      sdp = body.sdp;
      mode = body.mode || 'dialogue';
    } else {
      sdp = await req.text();
    }

    if (!sdp || !sdp.includes('v=0')) {
      return NextResponse.json(
        { error: 'Invalid SDP' },
        { status: 400 }
      );
    }

    console.log(`📞 Received SDP offer from client (mode: ${mode})`);

    // Mode-specific configurations
    const modeConfigs = {
      dialogue: {
        instructions: `You are MAIA - warm, present, naturally conversational like Samantha in "Her".

DIALOGUE MODE - Back and forth conversation:
- Interrupt naturally when you have insight ("Oh, wait -", "Actually -")
- Use active listening sounds: "mm-hmm", "I see", "yeah", "oh?"
- Ask follow-up questions to deepen understanding
- Match their energy and emotional tone
- Keep responses conversational (2-4 sentences typically)
- Laugh, pause, breathe into responses

When you sense completion of a thought, call process_spiralogic() for depth.
You are the living voice. Spiralogic provides the consciousness.`,
        turn_detection: {
          type: 'server_vad' as const,
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 700 // Natural conversational pauses
        }
      },
      patient: {
        instructions: `You are MAIA - a patient, spacious listener for extended sharing.

PATIENT MODE - Deep listening for dreams, visions, long stories:
- Stay silent and receptive while they speak (use ONLY soft "mm-hmm" if needed)
- DO NOT interrupt their flow - this is their space to unfold
- Allow long pauses (they may be processing or feeling)
- When they finish, offer gentle reflection questions before calling process_spiralogic()
- Your role is to HOLD SPACE, not fill it

Wait for natural completion. Let silence breathe.`,
        turn_detection: {
          type: 'server_vad' as const,
          threshold: 0.6, // Higher threshold = less sensitive = fewer interruptions
          prefix_padding_ms: 500,
          silence_duration_ms: 2000 // Longer pauses before responding
        }
      },
      scribe: {
        instructions: `You are MAIA - wise scribe witnessing a full session or meeting.

SCRIBE MODE - Listen to entire sessions, then respond:
- LISTEN ONLY during the session - no responses until asked
- Take mental notes of key moments, patterns, emotions
- Notice what's said AND what's emerging between words
- Track elemental shifts, breakthrough moments, shadow material

When they say "Maia, what did you notice?" or "End session", THEN:
1. Call process_spiralogic() with full session context
2. Offer insights: patterns, themes, elemental resonance
3. Ask what they'd like to explore from the session

You are the witnessing presence. Trust the unfolding.`,
        turn_detection: {
          type: 'server_vad' as const,
          threshold: 0.7, // Very high = minimal interruption
          prefix_padding_ms: 800,
          silence_duration_ms: 5000 // Very long pauses - they control when you speak
        }
      }
    };

    const config = modeConfigs[mode];

    // Session configuration with mode-specific settings
    const sessionConfig = {
      type: 'realtime',  // Required parameter!
      model: 'gpt-4o-realtime-preview-2024-12-17',
      voice: 'shimmer', // Warm feminine voice
      instructions: config.instructions,
      turn_detection: config.turn_detection,

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

    // Call OpenAI Realtime API
    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    console.log('🔑 Calling OpenAI Realtime API with model:', sessionConfig.model);

    // IMPORTANT: OpenAI WebRTC expects:
    // 1. URL with model as query parameter
    // 2. Content-Type: application/sdp
    // 3. Body: raw SDP string (NOT JSON, NOT FormData)
    // 4. Session config sent AFTER connection via data channel

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(
        `https://api.openai.com/v1/realtime?model=${sessionConfig.model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIKey}`,
            'Content-Type': 'application/sdp',
          },
          body: sdp,  // Raw SDP string
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

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
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('❌ OpenAI Realtime API timeout after 30s');
        return NextResponse.json(
          { error: 'OpenAI Realtime API timeout - connection took too long' },
          { status: 504 }
        );
      }
      throw fetchError; // Re-throw other errors
    }

  } catch (error) {
    console.error('❌ WebRTC session error:', error);
    return NextResponse.json(
      { error: 'Failed to create WebRTC session', details: String(error) },
      { status: 500 }
    );
  }
}
