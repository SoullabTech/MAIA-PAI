/**
 * Genesis API Endpoints - CONNECTED TO SUPABASE
 * Handles covenant signatures, onboarding, and node steward profiles
 *
 * DEPLOY THIS VERSION AFTER RUNNING SUPABASE MIGRATION
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role (has full access)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// POST /api/genesis/covenant/sign
// Handles covenant signature submissions
export async function POST_covenant(request: NextRequest) {
  try {
    const body = await request.json();
    const { nodeName, practice, signature, date, timestamp, covenantVersion } = body;

    // Validate required fields
    if (!nodeName || !signature || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: nodeName, signature, date' },
        { status: 400 }
      );
    }

    // Store in Supabase - covenant without node_id (standalone signature)
    const { data, error } = await supabase
      .from('genesis_covenants')
      .insert({
        node_name: nodeName,
        practice,
        signature,
        signed_date: date,
        covenant_version: covenantVersion || '1.0',
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('[GENESIS] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save covenant signature', details: error.message },
        { status: 500 }
      );
    }

    console.log('[GENESIS] Covenant signed:', {
      id: data.id,
      nodeName,
      practice,
      timestamp
    });

    return NextResponse.json({
      success: true,
      message: 'Covenant signed successfully',
      covenantId: data.id,
      nodeName,
      signedDate: date
    });

  } catch (error) {
    console.error('[GENESIS] Covenant signature failed:', error);
    return NextResponse.json(
      { error: 'Failed to record covenant signature' },
      { status: 500 }
    );
  }
}

// POST /api/genesis/onboard
// Handles full onboarding data submission
export async function POST_onboard(request: NextRequest) {
  try {
    const body = await request.json();
    const { covenant, profile, node, timestamp } = body;

    // Validate structure
    if (!covenant || !profile || !node) {
      return NextResponse.json(
        { error: 'Missing required sections: covenant, profile, node' },
        { status: 400 }
      );
    }

    // Validate covenant was affirmed
    if (!covenant.affirmed) {
      return NextResponse.json(
        { error: 'Covenant must be affirmed to continue' },
        { status: 400 }
      );
    }

    // Validate profile required fields
    if (!profile.name || !profile.practice || !profile.story) {
      return NextResponse.json(
        { error: 'Profile missing required fields: name, practice, story' },
        { status: 400 }
      );
    }

    // Validate node required fields
    if (!node.nodeName || !node.tradition) {
      return NextResponse.json(
        { error: 'Node configuration missing required fields: nodeName, tradition' },
        { status: 400 }
      );
    }

    // Check if node name is already taken
    const { data: existingNode } = await supabase
      .from('genesis_nodes')
      .select('id')
      .eq('node_name', node.nodeName)
      .single();

    if (existingNode) {
      return NextResponse.json(
        { error: `Node name "${node.nodeName}" is already taken. Please choose another.` },
        { status: 409 }
      );
    }

    // 1. Create genesis_nodes entry
    const { data: nodeData, error: nodeError } = await supabase
      .from('genesis_nodes')
      .insert({
        node_name: node.nodeName,
        tradition: node.tradition,
        theme: node.theme || 'cosmic',
        use_case: node.useCase,
        maia_voice: node.maiaVoice,
        tier: 'seed', // Default tier - can be upgraded
        status: 'pending_setup',
        created_at: timestamp
      })
      .select()
      .single();

    if (nodeError) {
      console.error('[GENESIS] Node creation failed:', nodeError);
      return NextResponse.json(
        { error: 'Failed to create node', details: nodeError.message },
        { status: 500 }
      );
    }

    // 2. Create genesis_profiles entry
    const { data: profileData, error: profileError } = await supabase
      .from('genesis_profiles')
      .insert({
        node_id: nodeData.id,
        name: profile.name,
        practice: profile.practice,
        location: profile.location || null,
        story: profile.story,
        exploration: profile.exploration || null,
        quote: profile.quote || null,
        is_public: true,
        show_in_directory: true
      })
      .select()
      .single();

    if (profileError) {
      console.error('[GENESIS] Profile creation failed:', profileError);
      // Rollback: delete the node
      await supabase.from('genesis_nodes').delete().eq('id', nodeData.id);
      return NextResponse.json(
        { error: 'Failed to create profile', details: profileError.message },
        { status: 500 }
      );
    }

    // 3. Create covenant record linked to node
    const { data: covenantData, error: covenantError } = await supabase
      .from('genesis_covenants')
      .insert({
        node_id: nodeData.id,
        node_name: profile.name,
        practice: profile.practice,
        signature: profile.name, // Using their name as signature
        signed_date: new Date(covenant.timestamp).toISOString().split('T')[0],
        covenant_version: '1.0',
        is_active: true
      })
      .select()
      .single();

    if (covenantError) {
      console.error('[GENESIS] Covenant creation failed:', covenantError);
      // Continue anyway - node and profile are created
    }

    // 4. Create onboarding record
    const { error: onboardingError } = await supabase
      .from('genesis_onboarding')
      .insert({
        node_id: nodeData.id,
        step_completed: 5,
        profile_data: profile,
        node_data: node,
        is_completed: true,
        started_at: timestamp,
        completed_at: new Date().toISOString()
      });

    if (onboardingError) {
      console.error('[GENESIS] Onboarding record failed:', onboardingError);
      // Continue anyway
    }

    // 5. Log event
    await supabase
      .from('genesis_events')
      .insert({
        node_id: nodeData.id,
        event_type: 'node_created',
        event_data: {
          tradition: node.tradition,
          theme: node.theme,
          covenant_affirmed: true
        }
      });

    // TODO: Send welcome email
    // await sendWelcomeEmail({
    //   to: profile.email,
    //   name: profile.name,
    //   nodeName: node.nodeName
    // });

    console.log('[GENESIS] Onboarding complete:', {
      nodeId: nodeData.id,
      name: profile.name,
      nodeName: node.nodeName,
      tradition: node.tradition
    });

    return NextResponse.json({
      success: true,
      message: 'Onboarding complete! Welcome to the network.',
      node: {
        id: nodeData.id,
        nodeName: node.nodeName,
        url: `https://${node.nodeName}.soullab.ai`,
        status: 'pending_setup'
      },
      nextSteps: {
        timeline: 'Node will be ready in 24-48 hours',
        email: 'Check your email for next steps'
      }
    });

  } catch (error) {
    console.error('[GENESIS] Onboarding failed:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}

// GET /api/genesis/profile/[nodeName]
// Fetches a node steward's public profile
export async function GET_profile(
  request: NextRequest,
  { params }: { params: { nodeName: string } }
) {
  try {
    const { nodeName } = params;

    if (!nodeName) {
      return NextResponse.json(
        { error: 'Node name required' },
        { status: 400 }
      );
    }

    // Use the helper function we created in migration
    const { data, error } = await supabase
      .rpc('get_genesis_node_profile', { node_name_param: nodeName });

    if (error) {
      console.error('[GENESIS] Profile fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const profileData = data[0];

    return NextResponse.json({
      success: true,
      profile: {
        name: profileData.profile_name,
        practice: profileData.practice,
        location: profileData.location,
        story: profileData.story,
        elementalBalance: profileData.elemental_balance,
        node: {
          nodeName: profileData.node_name,
          tradition: profileData.tradition,
          status: profileData.status,
          tier: profileData.tier,
          url: `https://${profileData.node_name}.soullab.ai`,
          createdAt: profileData.created_at
        },
        covenant: {
          signedDate: profileData.covenant_signed_date,
          version: profileData.covenant_version
        }
      }
    });

  } catch (error) {
    console.error('[GENESIS] Profile fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// GET /api/genesis/nodes
// Lists all active Genesis nodes (public directory)
export async function GET_nodes(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tradition = searchParams.get('tradition');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('genesis_nodes')
      .select(`
        id,
        node_name,
        tradition,
        theme,
        status,
        created_at,
        genesis_profiles (
          name,
          practice,
          location,
          is_public
        )
      `)
      .eq('status', 'active')
      .eq('genesis_profiles.is_public', true)
      .eq('genesis_profiles.show_in_directory', true)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (tradition) {
      query = query.eq('tradition', tradition);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GENESIS] Nodes list error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch nodes' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      nodes: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('[GENESIS] Nodes list failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nodes' },
      { status: 500 }
    );
  }
}

// Export route handlers
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname.endsWith('/covenant/sign')) {
    return POST_covenant(request);
  } else if (pathname.endsWith('/onboard')) {
    return POST_onboard(request);
  }

  return NextResponse.json(
    { error: 'Not found' },
    { status: 404 }
  );
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname.includes('/profile/')) {
    const nodeName = pathname.split('/profile/')[1];
    return GET_profile(request, { params: { nodeName } });
  } else if (pathname.endsWith('/nodes')) {
    return GET_nodes(request);
  }

  return NextResponse.json(
    { error: 'Not found' },
    { status: 404 }
  );
}
