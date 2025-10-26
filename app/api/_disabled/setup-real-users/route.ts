import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { testers } = await request.json();

    // Create real beta invitations for actual testers
    const realTesters = [
      {
        email: 'kelly@example.com',
        explorer_code: 'MAIA-ARCHITECT',
        real_name: 'Kelly',
        status: 'invited'
      },
      {
        email: 'alex@example.com',
        explorer_code: 'MAIA-APPRENTICE',
        real_name: 'Alex',
        status: 'invited'
      },
      {
        email: 'jordan@example.com',
        explorer_code: 'MAIA-ALCHEMIST',
        real_name: 'Jordan',
        status: 'invited'
      }
    ];

    // Add any additional testers provided
    if (testers && Array.isArray(testers)) {
      realTesters.push(...testers);
    }

    // Insert beta invitations
    const { data: invitations, error: inviteError } = await supabase
      .from('beta_invitations')
      .upsert(realTesters, { onConflict: 'email' })
      .select();

    if (inviteError) {
      console.error('Error creating beta invitations:', inviteError);
      return NextResponse.json({
        success: false,
        error: inviteError.message
      }, { status: 500 });
    }

    // Create sample spiral journey data for testing
    const sampleJourneys = [
      {
        user_id: null, // Will be filled when users register
        spiral_name: 'Family Dynamics',
        current_facet: 5,
        facet_name: 'Shadow Work',
        progress_percentage: 65,
        is_active: true,
        last_insight: 'Discovering how family patterns block creative expression'
      },
      {
        user_id: null,
        spiral_name: 'Career Evolution',
        current_facet: 7,
        facet_name: 'Rebirth',
        progress_percentage: 41,
        is_active: true,
        last_insight: 'Transitioning career to align with soul purpose'
      },
      {
        user_id: null,
        spiral_name: 'Spiritual Journey',
        current_facet: 8,
        facet_name: 'Integration',
        progress_percentage: 34,
        is_active: true,
        last_insight: 'Healing body through conscious relationship work'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        invitations: invitations?.length || 0,
        message: 'Beta tester setup complete. Users can now register with their explorer codes.',
        next_steps: [
          'Send invitation emails with explorer codes',
          'Users register at /beta-signin',
          'Real journey tracking begins on first session'
        ]
      }
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to setup beta users'
    }, { status: 500 });
  }
}

// Get current beta setup status
export async function GET() {
  try {
    const { data: invitations, error } = await supabase
      .from('beta_invitations')
      .select('*')
      .order('invitation_sent_at', { ascending: false });

    if (error) {
      throw error;
    }

    const statusCounts = {
      invited: invitations?.filter(i => i.status === 'invited').length || 0,
      registered: invitations?.filter(i => i.status === 'registered').length || 0,
      active: invitations?.filter(i => i.status === 'active').length || 0,
      total: invitations?.length || 0
    };

    return NextResponse.json({
      success: true,
      data: {
        invitations,
        status_counts: statusCounts,
        is_setup: statusCounts.total > 0
      }
    });

  } catch (error) {
    console.error('Get status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get beta status'
    }, { status: 500 });
  }
}