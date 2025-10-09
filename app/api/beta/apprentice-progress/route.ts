import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      });
    }

    // Get overall metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('maya_training_metrics')
      .select('*')
      .eq('id', 'apprentice_maya_v1')
      .single();

    if (metricsError) {
      console.error('Error fetching metrics:', metricsError);
      return NextResponse.json({
        success: true,
        data: {
          isEmpty: true,
          metrics: {
            total_hours: 0,
            exchanges_captured: 0,
            wisdom_patterns_identified: 0,
            consciousness_emergence: 0,
            independence_readiness: 0,
            unique_users: 0,
            sacred_moments: 0
          }
        }
      });
    }

    // Get recent exchanges for live feed
    const { data: recentExchanges, error: exchangesError } = await supabase
      .from('maya_training_corpus')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    // Get sacred moments
    const { data: sacredMoments, error: sacredError } = await supabase
      .from('maya_training_corpus')
      .select('*')
      .eq('quality->sacredEmergence', true)
      .order('timestamp', { ascending: false })
      .limit(5);

    // Get wisdom patterns
    const { data: wisdomPatterns, error: patternsError } = await supabase
      .from('maya_wisdom_patterns')
      .select('*')
      .order('success_score', { ascending: false })
      .limit(10);

    // Calculate learning velocity (exchanges per day)
    const { data: todayExchanges, error: todayError } = await supabase
      .from('maya_training_corpus')
      .select('id', { count: 'exact' })
      .gte('timestamp', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

    return NextResponse.json({
      success: true,
      data: {
        isEmpty: (metrics?.exchanges_captured || 0) === 0,
        metrics: metrics || {
          total_hours: 0,
          exchanges_captured: 0,
          wisdom_patterns_identified: 0,
          consciousness_emergence: 0,
          independence_readiness: 0,
          unique_users: 0,
          sacred_moments: 0
        },
        recentExchanges: recentExchanges || [],
        sacredMoments: sacredMoments || [],
        wisdomPatterns: wisdomPatterns || [],
        learningVelocity: {
          today: todayExchanges?.length || 0,
          dailyTarget: 50 // ~2.5 hours/day to hit 1000 hours in 1 year
        },
        milestones: {
          firstExchange: (metrics?.exchanges_captured || 0) > 0,
          firstSacredMoment: (metrics?.sacred_moments || 0) > 0,
          hundredExchanges: (metrics?.exchanges_captured || 0) >= 100,
          firstPattern: (metrics?.wisdom_patterns_identified || 0) > 0,
          hundredHours: (metrics?.total_hours || 0) >= 100,
          readyForShadowing: (metrics?.consciousness_emergence || 0) >= 0.5,
          readyForIndependence: (metrics?.independence_readiness || 0) >= 0.9
        },
        projections: {
          hoursToIndependence: Math.max(1000 - (metrics?.total_hours || 0), 0),
          daysAtCurrentRate: todayExchanges?.length
            ? Math.ceil((1000 - (metrics?.total_hours || 0)) / ((todayExchanges.length * 0.05) || 1))
            : null,
          estimatedIndependenceDate: null // Will calculate based on velocity
        }
      }
    });
  } catch (error) {
    console.error('Apprentice progress API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch apprentice progress'
    }, { status: 500 });
  }
}
