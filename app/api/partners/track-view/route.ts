import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/partners/track-view
 *
 * Tracks when a partner opens their Prelude page
 * Updates invite status from 'sent' to 'viewed'
 *
 * Request body:
 * {
 *   invite_code: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    if (!body.invite_code) {
      return NextResponse.json(
        { error: 'invite_code is required' },
        { status: 400 }
      );
    }

    // Update invite status to 'viewed' (only if currently 'sent')
    const { data, error } = await supabase
      .from('partners_invites')
      .update({
        invite_status: 'viewed',
        viewed_at: new Date().toISOString(),
      })
      .eq('invite_code', body.invite_code)
      .eq('invite_status', 'sent') // Only update if status is 'sent'
      .select()
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows updated (already viewed or completed)
      console.error('Track view error:', error);
      return NextResponse.json(
        { error: 'Failed to track view', details: error.message },
        { status: 500 }
      );
    }

    // If no rows were updated, the invite was either already viewed/completed, or doesn't exist
    if (!data) {
      // Check if invite exists
      const { data: existingInvite } = await supabase
        .from('partners_invites')
        .select('invite_status')
        .eq('invite_code', body.invite_code)
        .single();

      if (!existingInvite) {
        return NextResponse.json(
          { error: 'Invite not found' },
          { status: 404 }
        );
      }

      // Invite exists but was already viewed or completed
      return NextResponse.json({
        success: true,
        message: 'View already tracked',
        current_status: existingInvite.invite_status,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'View tracked successfully',
      invite_id: data.id,
      invite_code: body.invite_code,
    });

  } catch (error) {
    console.error('Track view error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
