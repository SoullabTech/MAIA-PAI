import { NextRequest, NextResponse } from 'next/server';
import { simpleMemoryCapture } from '@/lib/services/simple-memory-capture';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('userId');

    if (!userId) {
      // Get aggregate metrics for all users
      const { count: totalMemories } = await supabase
        .from('memory_events')
        .select('*', { count: 'exact', head: true });

      const { count: keyMoments } = await supabase
        .from('memory_events')
        .select('*', { count: 'exact', head: true })
        .eq('memory_type', 'key_moment');

      const { data: emotionalData } = await supabase
        .from('memory_events')
        .select('emotional_tone')
        .eq('memory_type', 'emotional_tag')
        .limit(100);

      const uniqueTags = [...new Set(emotionalData?.map(d => d.emotional_tone) || [])];

      return NextResponse.json({
        success: true,
        data: {
          total_memories: totalMemories || 0,
          key_moments: keyMoments || 0,
          emotional_tags: uniqueTags.length,
          pattern_recognition: (totalMemories || 0) > 10 ? 'Active' : 'Learning'
        }
      });
    }

    // Get metrics for specific user
    const metrics = await simpleMemoryCapture.getMetrics(userId);

    return NextResponse.json({
      success: true,
      data: metrics
    });

  } catch (error: any) {
    console.error('[Memory Metrics] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
