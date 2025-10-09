import { NextRequest, NextResponse } from 'next/server';
import { getSoulprintForUser } from '@/lib/memory/soulprint';
import { patternDetector } from '@/lib/maia/pattern-detector';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || 'anonymous';

    const soulprint = await getSoulprintForUser(userId);

    if (!soulprint) {
      return NextResponse.json({
        success: false,
        error: 'No soulprint found for user',
        patterns: []
      }, { status: 404 });
    }

    const analysis = patternDetector.analyze(soulprint);

    return NextResponse.json({
      success: true,
      userId,
      analysis,
      soulprintSummary: {
        dominantElement: soulprint.dominantElement,
        sessionCount: soulprint.sessionCount,
        lastUpdated: soulprint.lastUpdated
      }
    });

  } catch (error: any) {
    console.error('Pattern detection error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to detect patterns',
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'anonymous' } = body;

    const soulprint = await getSoulprintForUser(userId);

    if (!soulprint) {
      return NextResponse.json({
        success: false,
        error: 'No soulprint found for user'
      }, { status: 404 });
    }

    const analysis = patternDetector.analyze(soulprint);

    return NextResponse.json({
      success: true,
      userId,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Pattern detection error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to detect patterns',
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}