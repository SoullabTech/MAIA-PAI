/**
 * Genesis API Endpoints
 * Handles covenant signatures, onboarding, and node steward profiles
 */

import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: Store in Supabase
    // const { data, error } = await supabase
    //   .from('genesis_covenants')
    //   .insert({
    //     node_name: nodeName,
    //     practice,
    //     signature,
    //     signed_date: date,
    //     timestamp,
    //     covenant_version: covenantVersion || '1.0',
    //     created_at: new Date().toISOString()
    //   });

    // TODO: Optional - Record on blockchain/Akashic Field
    // const txHash = await recordToAkashicField(body);

    console.log('[GENESIS] Covenant signed:', {
      nodeName,
      practice,
      timestamp
    });

    return NextResponse.json({
      success: true,
      message: 'Covenant signed successfully',
      nodeName,
      timestamp,
      // txHash // if blockchain recording
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

    // TODO: Store in Supabase
    // 1. Create genesis_nodes entry
    // const { data: nodeData, error: nodeError } = await supabase
    //   .from('genesis_nodes')
    //   .insert({
    //     node_name: node.nodeName,
    //     tradition: node.tradition,
    //     theme: node.theme,
    //     use_case: node.useCase,
    //     maia_voice: node.maiaVoice,
    //     status: 'pending_setup',
    //     created_at: timestamp
    //   })
    //   .select()
    //   .single();

    // 2. Create genesis_profiles entry
    // const { data: profileData, error: profileError } = await supabase
    //   .from('genesis_profiles')
    //   .insert({
    //     node_id: nodeData.id,
    //     name: profile.name,
    //     practice: profile.practice,
    //     location: profile.location,
    //     story: profile.story,
    //     exploration: profile.exploration,
    //     quote: profile.quote,
    //     created_at: timestamp
    //   });

    // 3. Create covenant record
    // const { data: covenantData, error: covenantError } = await supabase
    //   .from('genesis_covenants')
    //   .insert({
    //     node_id: nodeData.id,
    //     node_name: profile.name,
    //     practice: profile.practice,
    //     signature: profile.name,
    //     signed_date: covenant.timestamp,
    //     covenant_version: '1.0',
    //     created_at: timestamp
    //   });

    // TODO: Send welcome email
    // await sendWelcomeEmail({
    //   to: profile.email,
    //   name: profile.name,
    //   nodeName: node.nodeName
    // });

    // TODO: Create Discord invite
    // const discordInvite = await createDiscordInvite();

    // TODO: Schedule onboarding call
    // const calendlyLink = generateCalendlyLink(profile);

    console.log('[GENESIS] Onboarding complete:', {
      name: profile.name,
      nodeName: node.nodeName,
      tradition: node.tradition,
      timestamp
    });

    return NextResponse.json({
      success: true,
      message: 'Onboarding complete! Welcome to the network.',
      node: {
        nodeName: node.nodeName,
        url: `https://${node.nodeName}.soullab.ai`,
        status: 'pending_setup'
      },
      nextSteps: {
        // email: 'Sent to ' + profile.email,
        // discordInvite,
        // calendlyLink,
        timeline: 'Node will be ready in 24-48 hours'
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

    // TODO: Fetch from Supabase
    // const { data, error } = await supabase
    //   .from('genesis_profiles')
    //   .select(`
    //     *,
    //     genesis_nodes (
    //       node_name,
    //       tradition,
    //       theme,
    //       status,
    //       created_at
    //     ),
    //     genesis_covenants (
    //       signed_date,
    //       covenant_version
    //     )
    //   `)
    //   .eq('genesis_nodes.node_name', nodeName)
    //   .single();

    // if (error || !data) {
    //   return NextResponse.json(
    //     { error: 'Profile not found' },
    //     { status: 404 }
    //   );
    // }

    // Mock response for now
    const mockProfile = {
      name: nodeName,
      practice: 'Wisdom Keeper',
      location: 'San Francisco, CA',
      story: 'Lorem ipsum dolor sit amet...',
      exploration: 'Currently exploring...',
      quote: 'The path is made by walking.',
      node: {
        nodeName,
        tradition: 'Integral',
        theme: 'cosmic',
        status: 'active',
        url: `https://${nodeName}.soullab.ai`,
        createdAt: new Date().toISOString()
      },
      covenant: {
        signedDate: new Date().toISOString(),
        version: '1.0'
      }
    };

    return NextResponse.json({
      success: true,
      profile: mockProfile
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

    // TODO: Fetch from Supabase
    // let query = supabase
    //   .from('genesis_nodes')
    //   .select(`
    //     *,
    //     genesis_profiles (
    //       name,
    //       practice,
    //       location
    //     )
    //   `)
    //   .eq('status', 'active')
    //   .limit(limit);

    // if (tradition) {
    //   query = query.eq('tradition', tradition);
    // }

    // const { data, error } = await query;

    // Mock response
    const mockNodes = [
      {
        nodeName: 'example-node',
        tradition: 'integral',
        profile: {
          name: 'Example Steward',
          practice: 'Consciousness Guide',
          location: 'Earth'
        }
      }
    ];

    return NextResponse.json({
      success: true,
      nodes: mockNodes,
      count: mockNodes.length
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
