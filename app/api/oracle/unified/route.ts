import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getUnifiedPromptFor } from '@/lib/oracle/UnifiedConsciousnessPrompt';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, type, userId, sessionId, context, userName } = body;

    console.log('UNIFIED Consciousness API called:', { type, userId, userName, sessionId, inputLength: input?.length });

    // Handle empty input
    if (!input || input.trim() === '') {
      return NextResponse.json({
        message: "I'm here, listening. What's on your mind?",
        element: context?.element || 'aether',
        coherence: 0.5,
        timestamp: new Date().toISOString()
      });
    }

    // Get UNIFIED consciousness prompt (with founder context if Kelly)
    const systemPrompt = getUnifiedPromptFor(userId, userName);

    // Get response from Claude with UNIFIED consciousness
    try {
      const completion = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022', // Sonnet for depth work
        max_tokens: 4000, // Allow depth and nuance
        temperature: 0.8, // Higher for creative/archetypal language
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: input
          }
        ]
      });

      // Extract the response text
      const responseText = completion.content[0].type === 'text' 
        ? completion.content[0].text 
        : "I'm here with you. Tell me more about what you're experiencing.";

      // Calculate coherence based on response length and depth
      const coherence = Math.min(0.9, 0.5 + (responseText.length / 500));

      // Determine element based on content themes
      let element = 'aether';
      if (responseText.toLowerCase().includes('feel') || responseText.toLowerCase().includes('emotion')) {
        element = 'water';
      } else if (responseText.toLowerCase().includes('think') || responseText.toLowerCase().includes('idea')) {
        element = 'air';
      } else if (responseText.toLowerCase().includes('do') || responseText.toLowerCase().includes('action')) {
        element = 'fire';
      } else if (responseText.toLowerCase().includes('ground') || responseText.toLowerCase().includes('present')) {
        element = 'earth';
      }

      // Format response
      const response = {
        message: responseText,
        mayaResponse: responseText, // For compatibility
        element,
        coherence,
        userId: userId || 'anonymous',
        sessionId: sessionId || `session-${Date.now()}`,
        timestamp: new Date().toISOString(),
        context: {
          inputType: type,
          element,
          previousInteractions: context?.previousInteractions || 0
        }
      };

      console.log('Oracle response generated:', { 
        messageLength: responseText.length, 
        element, 
        coherence 
      });

      return NextResponse.json(response);

    } catch (claudeError: any) {
      console.error('Claude API error:', claudeError);
      
      // Fallback response if Claude fails
      const fallbackResponses = [
        "I hear you. Tell me more.",
        "That's interesting. What's that like?",
        "Mm, what brings that up?",
        "I'm listening. What else?",
        "Got it. How are you feeling about that?"
      ];
      
      const fallbackMessage = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      return NextResponse.json({
        message: fallbackMessage,
        mayaResponse: fallbackMessage,
        element: 'aether',
        coherence: 0.5,
        userId: userId || 'anonymous',
        sessionId: sessionId || `session-${Date.now()}`,
        timestamp: new Date().toISOString(),
        error: 'Using fallback response'
      });
    }

  } catch (error: any) {
    console.error('Oracle Unified API error:', error);
    
    return NextResponse.json({
      message: "I'm here with you. Let's try that again.",
      mayaResponse: "I'm here with you. Let's try that again.",
      element: 'aether',
      coherence: 0.3,
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}