/**
 * GET /api/genesis/nodes
 * Lists all active Genesis nodes (public directory)
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

export async function GET(request: NextRequest) {
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
        genesis_profiles!inner (
          name,
          practice,
          location,
          is_public
        )
      `)
      .eq('status', 'active')
      .eq('genesis_profiles.is_public', true)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (tradition) {
      query = query.eq('tradition', tradition);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GENESIS] Nodes list error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch nodes', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      nodes: data || [],
      count: data?.length || 0
    });

  } catch (error: any) {
    console.error('[GENESIS] Nodes list failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nodes', details: error?.message },
      { status: 500 }
    );
  }
}
