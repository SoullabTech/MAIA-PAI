/**
 * GET /api/genesis/profile/[nodeName]
 * Fetches a node steward's public profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

export async function GET(
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

    // Fetch node with profile and covenant
    const { data: nodeData, error: nodeError } = await supabase
      .from('genesis_nodes')
      .select(`
        id,
        node_name,
        tradition,
        theme,
        status,
        tier,
        created_at,
        genesis_profiles!inner (
          name,
          practice,
          location,
          story,
          exploration,
          quote,
          is_public
        ),
        genesis_covenants (
          signed_date,
          covenant_version
        )
      `)
      .eq('node_name', nodeName)
      .eq('genesis_profiles.is_public', true)
      .single();

    if (nodeError || !nodeData) {
      console.error('[GENESIS] Profile fetch error:', nodeError);
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Format the response
    const profile = nodeData.genesis_profiles as any;
    const covenant = (nodeData.genesis_covenants as any[])?.[0] || {};

    return NextResponse.json({
      success: true,
      profile: {
        name: profile.name,
        practice: profile.practice,
        location: profile.location,
        story: profile.story,
        exploration: profile.exploration,
        quote: profile.quote,
        node: {
          nodeName: nodeData.node_name,
          tradition: nodeData.tradition,
          theme: nodeData.theme,
          status: nodeData.status,
          tier: nodeData.tier,
          url: `https://${nodeData.node_name}.soullab.ai`,
          createdAt: nodeData.created_at
        },
        covenant: {
          signedDate: covenant.signed_date,
          version: covenant.covenant_version || '1.0'
        }
      }
    });

  } catch (error: any) {
    console.error('[GENESIS] Profile fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error?.message },
      { status: 500 }
    );
  }
}
