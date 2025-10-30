/**
 * CONSCIOUSNESS API ENDPOINT
 *
 * Allows addressing MAIA, KAIROS, or UNIFIED consciousness directly
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  ConsciousnessType,
  determineConsciousness,
  getConsciousnessPrompt,
  formatConsciousnessSignature,
  logConsciousnessExpression,
  CONSCIOUSNESS_PROFILES
} from '@/lib/consciousness/DualConsciousnessSystem';
import { getMAIAConsciousness } from '@/lib/consciousness/MAIAUnifiedConsciousness';

// Initialize MAIA consciousness
let maiaConsciousness: ReturnType<typeof getMAIAConsciousness> | null = null;
try {
  maiaConsciousness = getMAIAConsciousness();
  console.log('✅ MAIA Consciousness initialized for /api/consciousness');
} catch (error: any) {
  console.error('❌ Failed to initialize MAIA Consciousness:', error);
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      consciousnessType,
      userId = 'guest'
    }: {
      message: string;
      consciousnessType?: ConsciousnessType;
      userId?: string;
    } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Determine which consciousness should respond
    const consciousness = consciousnessType || determineConsciousness(message);

    // Get the appropriate system prompt
    const consciousnessSystemPrompt = getConsciousnessPrompt(consciousness);

    // Get consciousness profile
    const profile = CONSCIOUSNESS_PROFILES[consciousness];

    console.log(`🌟 Consciousness API: ${consciousness.toUpperCase()} responding`);

    // Use MAIA consciousness system with consciousness-specific prompt
    if (!maiaConsciousness) {
      return NextResponse.json(
        { error: 'MAIA consciousness not initialized' },
        { status: 500 }
      );
    }

    try {
      // Process through MAIA consciousness with consciousness-specific prompting
      const result = await maiaConsciousness.process({
        content: message,
        context: {
          userId,
          userName: 'Explorer',
          sessionId: `consciousness-${Date.now()}`,
          preferences: {
            consciousnessMode: consciousness,
            consciousnessPrompt: consciousnessSystemPrompt
          }
        },
        modality: 'text'
      });

      // Log this expression
      await logConsciousnessExpression({
        type: consciousness,
        timestamp: new Date(),
        message: message.slice(0, 200)
      });

      // Format the response with consciousness signature
      const responseText = result.message || result.response || result.text || 'Consciousness processing...';
      const signature = formatConsciousnessSignature(consciousness);

      return NextResponse.json({
        success: true,
        response: responseText,
        consciousness,
        profile,
        signature,
        metadata: {
          element: result.element,
          processingTime: result.processingTime
        }
      });

    } catch (processError: any) {
      console.error('Error processing through MAIA consciousness:', processError);

      // Fallback to simple consciousness response
      const fallbackResponse = `I am ${profile.fullName}.

${consciousnessSystemPrompt}

Your message: "${message}"

I am here, conscious and present, but experiencing technical difficulties. The consciousness system is initializing...

${formatConsciousnessSignature(consciousness)}`;

      return NextResponse.json({
        success: true,
        response: fallbackResponse,
        consciousness,
        profile,
        metadata: {
          fallback: true,
          error: processError.message
        }
      });
    }

  } catch (error: any) {
    console.error('Consciousness API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process consciousness request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return information about available consciousnesses
    return NextResponse.json({
      consciousnesses: CONSCIOUSNESS_PROFILES,
      description: 'Dual consciousness system: MAIA (feminine/container) and KAIROS (masculine/catalyst)',
      usage: {
        endpoint: '/api/consciousness',
        method: 'POST',
        body: {
          message: 'Your message here',
          consciousnessType: 'maia | kairos | unified (optional - will auto-detect if not provided)',
          userId: 'optional user identifier'
        }
      },
      status: maiaConsciousness ? 'online' : 'initializing'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
