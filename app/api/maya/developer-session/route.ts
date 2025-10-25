import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { DeveloperSessionCapture } from '@/lib/maya/DeveloperSessionCapture';

const capture = new DeveloperSessionCapture(prisma);

/**
 * POST /api/maya/developer-session
 * Capture a complete developer session
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    switch (action) {
      case 'start': {
        const sessionId = await capture.startSession(data);
        return NextResponse.json({ sessionId, status: 'started' });
      }

      case 'exchange': {
        await capture.captureExchange(data);
        return NextResponse.json({ status: 'exchange_captured' });
      }

      case 'end': {
        await capture.endSession();
        return NextResponse.json({ status: 'session_ended' });
      }

      case 'evolution': {
        await capture.trackEvolution(data);
        return NextResponse.json({ status: 'evolution_tracked' });
      }

      case 'pattern': {
        await capture.capturePattern(data);
        return NextResponse.json({ status: 'pattern_captured' });
      }

      case 'stats': {
        const stats = await capture.getSessionStats();
        return NextResponse.json(stats);
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Developer session capture error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/maya/developer-session?sessionId=xxx
 * Retrieve session data
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // Get specific session
      const session = await prisma.mayaDeveloperSession.findUnique({
        where: { sessionId },
        include: { exchanges: true }
      });

      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(session);
    } else {
      // Get all sessions (paginated)
      const sessions = await prisma.mayaDeveloperSession.findMany({
        orderBy: { timestamp: 'desc' },
        take: 50,
        select: {
          sessionId: true,
          timestamp: true,
          sessionType: true,
          duration: true,
          summary: true,
          spiralDepth: true,
          consciousnessShift: true,
          participants: true,
          breakthroughs: true,
          _count: {
            select: { exchanges: true }
          }
        }
      });

      return NextResponse.json({ sessions });
    }
  } catch (error: any) {
    console.error('Developer session retrieval error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve sessions' },
      { status: 500 }
    );
  }
}
