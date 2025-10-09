import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get real beta user data from explorers table (primary source)
    const { data: explorers, error: explorersError } = await supabase
      .from('explorers')
      .select('*');

    // Get beta_users data
    const { data: betaUsers, error: betaUsersError } = await supabase
      .from('beta_users')
      .select('*');

    // Combine both sources
    const users = [
      ...(explorers || []).map(e => ({
        id: e.explorer_id,
        name: e.explorer_name,
        sacred_name: e.explorer_name,
        email: e.email,
        created_at: e.signup_date,
        last_login: e.updated_at
      })),
      ...(betaUsers || []).map(b => ({
        id: b.id,
        name: b.email?.split('@')[0] || 'Beta User',
        sacred_name: b.email?.split('@')[0] || 'Beta User',
        email: b.email,
        created_at: b.created_at,
        last_login: b.created_at
      }))
    ];

    // Remove duplicates by email
    const uniqueUsers = users.filter((user, index, self) =>
      index === self.findIndex((u) => u.email === user.email)
    );

    if (explorersError && betaUsersError) {
      throw new Error('Both data sources failed');
    }

    // These tables don't exist yet - skip for now
    const spiralJourneys: any[] = [];
    const facetProgress: any[] = [];
    const intersections: any[] = [];

    // Get active user sessions (if table exists)
    const { data: sessions, error: sessionsError } = await supabase
      .from('user_sessions')
      .select('*')
      .is('session_end', null)
      .order('session_start', { ascending: false });

    // Sessions table might not exist yet, so ignore errors

    // collective_patterns table doesn't exist yet
    const patterns: any[] = [];

    // Transform users data for frontend
    const transformedUsers = uniqueUsers?.map(user => {
      const userSessions = sessions?.filter(s => s.user_id === user.id) || [];
      const isActive = userSessions.length > 0;
      const totalSessions = userSessions.length;
      const avgEngagement = userSessions.reduce((acc, s) => acc + (s.engagement_score || 0), 0) / (totalSessions || 1);

      return {
        id: user.id,
        name: user.name || user.sacred_name || 'Unknown',
        email: user.email,
        registered: true, // They have sacred_name, so they've registered
        status: isActive ? 'online' : (user.last_login ? 'idle' : 'offline'),
        sessions: totalSessions,
        engagement: Math.round(avgEngagement * 100),
        lastActive: user.last_login || user.created_at
      };
    }) || [];

    // Calculate real metrics
    const realMetrics = {
      totalUsers: uniqueUsers?.length || 0,
      activeUsers: sessions?.length || 0,
      activeSpiralJourneys: spiralJourneys?.length || 0,
      avgEngagement: sessions?.reduce((acc, s) => acc + (s.engagement_score || 0), 0) / (sessions?.length || 1),
      users: transformedUsers,

      // Universal Facets with real user counts
      universalFacets: Array.from({ length: 12 }, (_, i) => {
        const facetNum = i + 1;
        const facetUsers = facetProgress?.filter(fp => fp.facet_number === facetNum) || [];
        const avgProgress = facetUsers.reduce((acc, fp) => acc + fp.progress_percentage, 0) / (facetUsers.length || 1);

        return {
          id: facetNum,
          name: getFacetName(facetNum),
          color: getFacetColor(facetNum),
          progress: Math.round(avgProgress),
          users: facetUsers.length
        };
      }),

      // Active Life Spirals with real data
      activeLifeSpiralJourneys: spiralJourneys?.map(sj => ({
        name: sj.spiral_name,
        active: sj.is_active,
        position: sj.facet_name,
        progress: sj.progress_percentage,
        color: getSpiralColor(sj.spiral_name),
        userId: sj.user_id
      })) || [],

      // Real spiral intersections
      recentIntersections: intersections?.map(int => ({
        spirals: [int.spiral_1, int.spiral_2],
        type: int.intersection_type,
        strength: int.strength_score,
        time: getTimeAgo(new Date(int.detected_at)),
        insight: int.insight_generated
      })) || [],

      // Collective patterns
      emergingPatterns: patterns?.map(p => ({
        type: p.pattern_type,
        description: p.description,
        affectedUsers: p.affected_users,
        strength: p.strength_indicator,
        detectedAt: getTimeAgo(new Date(p.detected_at))
      })) || [],

      // Individual journey snapshots with real users
      individualJourneys: uniqueUsers?.slice(0, 3).map(user => {
        const userJourneys = spiralJourneys?.filter(sj => sj.user_id === user.id) || [];
        const primaryJourney = userJourneys[0];

        return {
          user: user.name || user.sacred_name,
          facet: primaryJourney?.facet_name || 'Exploration',
          spirals: userJourneys.map(uj => uj.spiral_name.split(' ')[0]),
          insight: primaryJourney?.last_insight || 'Beginning their journey of discovery',
          progress: primaryJourney?.progress_percentage || 15
        };
      }) || []
    };

    return NextResponse.json({
      success: true,
      data: realMetrics,
      isEmpty: uniqueUsers?.length === 0
    });

  } catch (error) {
    console.error('Real data fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch real data',
      isEmpty: true
    }, { status: 500 });
  }
}

// Helper functions
function getFacetName(facetNum: number): string {
  const names = [
    'Innocence', 'Initiation', 'Exploration', 'Questioning', 'Shadow Work', 'Crisis/Death',
    'Rebirth', 'Integration', 'Wisdom', 'Service', 'Mastery', 'Transcendence'
  ];
  return names[facetNum - 1] || 'Unknown';
}

function getFacetColor(facetNum: number): string {
  const colors = [
    '#E4C1F9', '#D4C1F9', '#C4C1F9', '#B4E7CE', '#A4E7CE', '#94E7CE',
    '#FFD700', '#FFB4B4', '#FFAE4A', '#F7D08A', '#F6AD55', '#FFD700'
  ];
  return colors[facetNum - 1] || '#F6AD55';
}

function getSpiralColor(spiralName: string): string {
  const colors: { [key: string]: string } = {
    'Family Dynamics': '#FFB4B4',
    'Career Evolution': '#4ECDC4',
    'Spiritual Journey': '#9D4EDD',
    'Creative Expression': '#F72585',
    'Relationship Dance': '#8338EC',
    'Health Transformation': '#06FFA5',
    'Financial Mastery': '#FFD700',
    'Educational Growth': '#3A86FF'
  };
  return colors[spiralName] || '#F6AD55';
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}