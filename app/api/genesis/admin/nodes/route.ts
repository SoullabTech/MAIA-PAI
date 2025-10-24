/**
 * GET /api/genesis/admin/nodes
 * Fetches all nodes for admin dashboard (requires admin auth)
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

// Simple admin auth check (in production, use proper auth)
function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.GENESIS_ADMIN_PASSWORD || 'genesis2025';

  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  return token === adminPassword;
}

export async function GET(request: NextRequest) {
  try {
    // Check admin auth
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build query for all nodes with their profiles and covenants
    let query = supabase
      .from('genesis_nodes')
      .select(`
        id,
        node_name,
        tradition,
        theme,
        status,
        tier,
        use_case,
        maia_voice,
        created_at,
        genesis_profiles (
          name,
          email,
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
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: nodes, error } = await query;

    if (error) {
      console.error('[GENESIS ADMIN] Failed to fetch nodes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch nodes', details: error.message },
        { status: 500 }
      );
    }

    // Get statistics
    const { data: stats } = await supabase
      .rpc('get_genesis_stats')
      .single();

    // If stats function doesn't exist, calculate manually
    let statistics = stats || {
      total_nodes: nodes.length,
      pending_nodes: nodes.filter(n => n.status === 'pending_setup').length,
      active_nodes: nodes.filter(n => n.status === 'active').length,
      total_covenants: 0
    };

    // Get total covenants if stats function didn't return it
    if (!stats) {
      const { count: covenantCount } = await supabase
        .from('genesis_covenants')
        .select('*', { count: 'exact', head: true });

      statistics.total_covenants = covenantCount || 0;
    }

    return NextResponse.json({
      success: true,
      nodes: nodes || [],
      statistics
    });

  } catch (error: any) {
    console.error('[GENESIS ADMIN] Request failed:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error?.message },
      { status: 500 }
    );
  }
}
