/**
 * POST /api/cues/suggest
 *
 * Suggest cues from free-form text
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCueService } from '@/lib/memory/bardic/CueService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'text is required' },
        { status: 400 }
      );
    }

    const cueService = getCueService();
    const suggestions = await cueService.suggestCuesFromText(text);

    return NextResponse.json({
      suggestions,
      count: suggestions.length
    });
  } catch (error) {
    console.error('[API /cues/suggest] Error:', error);
    return NextResponse.json(
      { error: 'Failed to suggest cues' },
      { status: 500 }
    );
  }
}
