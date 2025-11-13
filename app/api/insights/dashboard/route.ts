/**
 * 🌀 Unified Insights Dashboard API
 * Real-time monitoring of pattern emergence across all users
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // Optional filter

    // ═══════════════════════════════════════════════════════════
    // OVERVIEW STATS
    // ═══════════════════════════════════════════════════════════

    const { data: overviewStats } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT
          (SELECT COUNT(*) FROM unified_insights WHERE is_active = TRUE) as total_active_insights,
          (SELECT COUNT(*) FROM unified_insights) as total_insights,
          (SELECT COUNT(DISTINCT user_id) FROM unified_insights) as total_users,
          (SELECT COUNT(*) FROM insight_recurrences WHERE date >= NOW() - INTERVAL '24 hours') as recurrences_24h,
          (SELECT COUNT(*) FROM insight_recurrences WHERE date >= NOW() - INTERVAL '7 days') as recurrences_7d,
          (SELECT AVG(convergence_score) FROM spiral_movements WHERE convergence_score > 0) as avg_convergence,
          (SELECT COUNT(*) FROM spiral_movements WHERE convergence_score >= 70) as breakthrough_ready
      `
    }).catch(() => null);

    // Fallback: Direct queries if RPC doesn't work
    const [
      { count: totalActiveInsights },
      { count: totalInsights },
      { data: uniqueUsers },
      { count: recurrences24h },
      { count: recurrences7d },
      { data: spiralStats },
      { count: breakthroughReady }
    ] = await Promise.all([
      supabase.from('unified_insights').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('unified_insights').select('*', { count: 'exact', head: true }),
      supabase.from('unified_insights').select('user_id'),
      supabase.from('insight_recurrences').select('*', { count: 'exact', head: true }).gte('date', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('insight_recurrences').select('*', { count: 'exact', head: true }).gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('spiral_movements').select('convergence_score').gt('convergence_score', 0),
      supabase.from('spiral_movements').select('*', { count: 'exact', head: true }).gte('convergence_score', 70)
    ]);

    const avgConvergence = spiralStats && spiralStats.length > 0
      ? spiralStats.reduce((sum, s) => sum + s.convergence_score, 0) / spiralStats.length
      : 0;

    // ═══════════════════════════════════════════════════════════
    // RECENT INSIGHTS
    // ═══════════════════════════════════════════════════════════

    let insightsQuery = supabase
      .from('unified_insights')
      .select(`
        *,
        spiral_movements(direction, convergence_score, current_depth),
        archetypal_threads(archetype, phase)
      `)
      .eq('is_active', true)
      .order('last_seen', { ascending: false })
      .limit(50);

    if (userId) {
      insightsQuery = insightsQuery.eq('user_id', userId);
    }

    const { data: recentInsights } = await insightsQuery;

    // ═══════════════════════════════════════════════════════════
    // HIGH CONVERGENCE (Breakthrough Ready)
    // ═══════════════════════════════════════════════════════════

    const { data: breakthroughInsights } = await supabase
      .from('high_convergence_insights')
      .select('*')
      .order('convergence_score', { ascending: false })
      .limit(20);

    // ═══════════════════════════════════════════════════════════
    // ELEMENTAL DISTRIBUTION
    // ═══════════════════════════════════════════════════════════

    const { data: elementalDist } = await supabase
      .from('unified_insights')
      .select('current_element')
      .eq('is_active', true);

    const elementCounts = elementalDist?.reduce((acc, { current_element }) => {
      acc[current_element] = (acc[current_element] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // ═══════════════════════════════════════════════════════════
    // SPIRAL DIRECTION DISTRIBUTION
    // ═══════════════════════════════════════════════════════════

    const { data: spiralDist } = await supabase
      .from('spiral_movements')
      .select('direction');

    const spiralCounts = spiralDist?.reduce((acc, { direction }) => {
      acc[direction] = (acc[direction] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // ═══════════════════════════════════════════════════════════
    // RECENT ACTIVITY (Last 10 recurrences)
    // ═══════════════════════════════════════════════════════════

    const { data: recentActivity } = await supabase
      .from('recent_pattern_activity')
      .select('*')
      .limit(10);

    // ═══════════════════════════════════════════════════════════
    // RESPONSE
    // ═══════════════════════════════════════════════════════════

    return NextResponse.json({
      overview: {
        totalActiveInsights: totalActiveInsights || 0,
        totalInsights: totalInsights || 0,
        totalUsers: uniqueUsers?.length ? new Set(uniqueUsers.map(u => u.user_id)).size : 0,
        recurrences24h: recurrences24h || 0,
        recurrences7d: recurrences7d || 0,
        avgConvergence: Math.round(avgConvergence * 10) / 10,
        breakthroughReady: breakthroughReady || 0
      },
      recentInsights: recentInsights || [],
      breakthroughInsights: breakthroughInsights || [],
      distributions: {
        elements: elementCounts,
        spiralDirections: spiralCounts
      },
      recentActivity: recentActivity || [],
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Insights dashboard error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch insights dashboard',
        details: error.message
      },
      { status: 500 }
    );
  }
}
