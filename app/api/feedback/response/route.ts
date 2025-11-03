import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Save user feedback on MAIA responses
 * Tracks satisfaction, elemental accuracy, and voice prosody quality
 */
export async function POST(request: NextRequest) {
  try {
    const feedback = await request.json();

    console.log('📊 [Feedback] Received:', {
      responseId: feedback.responseId,
      userId: feedback.userId,
      satisfaction: feedback.satisfaction,
      elementAccurate: feedback.elementAccurate,
      prosodyNoticed: feedback.prosodyNoticed
    });

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save to maia_response_feedback table
    const { data, error } = await supabase
      .from('maia_response_feedback')
      .insert({
        response_id: feedback.responseId,
        user_id: feedback.userId,
        satisfaction: feedback.satisfaction,
        element_accurate: feedback.elementAccurate,
        prosody_noticed: feedback.prosodyNoticed,
        comments: feedback.comments,
        created_at: feedback.timestamp
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [Feedback] Database error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ [Feedback] Saved successfully:', data.id);

    return NextResponse.json({
      success: true,
      feedbackId: data.id
    });

  } catch (error: any) {
    console.error('❌ [Feedback] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Get feedback analytics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const period = searchParams.get('period') || '7d'; // 7d, 30d, all

    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase
      .from('maia_response_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Filter by period
    if (period !== 'all') {
      const daysAgo = parseInt(period);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      query = query.gte('created_at', cutoffDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ [Feedback Analytics] Error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Calculate analytics
    const total = data?.length || 0;
    const positive = data?.filter(f => f.satisfaction === 'positive').length || 0;
    const negative = data?.filter(f => f.satisfaction === 'negative').length || 0;
    const elementAccurate = data?.filter(f => f.element_accurate === true).length || 0;
    const elementTotal = data?.filter(f => f.element_accurate !== null).length || 0;
    const prosodyYes = data?.filter(f => f.prosody_noticed === 'yes').length || 0;
    const prosodySubtle = data?.filter(f => f.prosody_noticed === 'subtle').length || 0;
    const prosodyNo = data?.filter(f => f.prosody_noticed === 'no').length || 0;
    const prosodyTotal = data?.filter(f => f.prosody_noticed !== null).length || 0;

    return NextResponse.json({
      success: true,
      analytics: {
        total,
        satisfaction: {
          positive,
          negative,
          rate: total > 0 ? (positive / total * 100).toFixed(1) : 0
        },
        elementalAccuracy: {
          accurate: elementAccurate,
          total: elementTotal,
          rate: elementTotal > 0 ? (elementAccurate / elementTotal * 100).toFixed(1) : 0
        },
        prosody: {
          yes: prosodyYes,
          subtle: prosodySubtle,
          no: prosodyNo,
          total: prosodyTotal,
          noticedRate: prosodyTotal > 0 ? ((prosodyYes + prosodySubtle) / prosodyTotal * 100).toFixed(1) : 0
        }
      },
      data
    });

  } catch (error: any) {
    console.error('❌ [Feedback Analytics] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
