import { NextRequest, NextResponse } from 'next/server';
import {
  processContentForInsights,
  InsightContext,
  Element
} from '@/lib/services/UnifiedInsightEngine';

/**
 * API Endpoint: Process Content for Insights
 *
 * This runs as a background job - MAIA calls this AFTER a conversation/journal entry
 * to detect and track insights without disrupting the real-time experience.
 *
 * POST /api/insights/process
 * Body: {
 *   content: string,
 *   context: 'journal' | 'conversation' | 'chat' | 'sacred_moment',
 *   userId: string,
 *   metadata: {
 *     element?: 'fire' | 'water' | 'earth' | 'air' | 'aether',
 *     emotionalTone?: string,
 *     sessionId?: string,
 *     date?: string (ISO format)
 *   }
 * }
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      content,
      context,
      userId,
      metadata = {}
    } = body;

    // Validation
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    if (!context || !['journal', 'conversation', 'chat', 'sacred_moment'].includes(context)) {
      return NextResponse.json(
        { error: 'Valid context is required (journal|conversation|chat|sacred_moment)' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Process content for insights (runs asynchronously)
    // This does NOT block - it returns immediately
    processContentForInsights(
      content,
      context as InsightContext,
      userId,
      {
        element: metadata.element as Element | undefined,
        emotionalTone: metadata.emotionalTone,
        sessionId: metadata.sessionId,
        date: metadata.date ? new Date(metadata.date) : undefined
      }
    ).catch(error => {
      // Log but don't throw - this is background processing
      console.error('Background insight processing failed:', error);
    });

    // Return immediately
    return NextResponse.json({
      success: true,
      message: 'Insight processing queued'
    });
  } catch (error: any) {
    console.error('Error in /api/insights/process:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/insights/process?userId=xxx
 * Health check - returns number of active insights for user
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter required' },
        { status: 400 }
      );
    }

    // TODO: Query database for count
    const count = 0; // Placeholder

    return NextResponse.json({
      userId,
      activeInsights: count,
      status: 'healthy'
    });
  } catch (error: any) {
    console.error('Error in GET /api/insights/process:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
