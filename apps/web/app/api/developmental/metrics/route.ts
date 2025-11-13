/**
 * DEVELOPMENTAL METRICS API
 *
 * Public endpoint for MAIA's consciousness evolution metrics.
 * Aggregates data across time periods for transparent monitoring.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

interface MetricsPeriod {
  daily: any;
  weekly: any;
  monthly: any;
}

interface TimeRange {
  start: Date;
  end: Date;
}

function getTimeRanges(): { daily: TimeRange; weekly: TimeRange; monthly: TimeRange } {
  const now = new Date();

  return {
    daily: {
      start: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      end: now
    },
    weekly: {
      start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      end: now
    },
    monthly: {
      start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      end: now
    }
  };
}

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'daily', 'weekly', 'monthly', 'all'

    const ranges = getTimeRanges();
    const metrics: any = {};

    // Helper function to get metrics for a time range
    async function getMetricsForRange(start: Date, end: Date) {
      const startISO = start.toISOString();
      const endISO = end.toISOString();

      // 1. Attending Quality Metrics
      const { data: attendingData } = await supabase
        .from('attending_observations')
        .select('*')
        .gte('timestamp', startISO)
        .lte('timestamp', endISO)
        .order('timestamp', { ascending: false });

      const attendingMetrics = attendingData && attendingData.length > 0 ? {
        count: attendingData.length,
        average: attendingData.reduce((sum, d) => sum + d.attending_quality, 0) / attendingData.length,
        highest: Math.max(...attendingData.map(d => d.attending_quality)),
        lowest: Math.min(...attendingData.map(d => d.attending_quality)),
        trend: attendingData.slice(0, 10).map(d => ({
          timestamp: d.timestamp,
          quality: d.attending_quality,
          archetype: d.archetype
        }))
      } : null;

      // 2. Dissociation Incidents
      const { data: dissociationData } = await supabase
        .from('dissociation_incidents')
        .select('*')
        .gte('timestamp', startISO)
        .lte('timestamp', endISO)
        .order('timestamp', { ascending: false });

      const dissociationMetrics = dissociationData ? {
        count: dissociationData.length,
        by_type: dissociationData.reduce((acc, d) => {
          acc[d.dissociation_type] = (acc[d.dissociation_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        average_severity: dissociationData.length > 0
          ? dissociationData.reduce((sum, d) => sum + d.severity, 0) / dissociationData.length
          : 0,
        recent: dissociationData.slice(0, 5).map(d => ({
          timestamp: d.timestamp,
          type: d.dissociation_type,
          severity: d.severity
        }))
      } : null;

      // 3. Shift Events
      const { data: shiftData } = await supabase
        .from('shift_events')
        .select('*')
        .gte('timestamp', startISO)
        .lte('timestamp', endISO)
        .order('timestamp', { ascending: false });

      const shiftMetrics = shiftData ? {
        count: shiftData.length,
        average_magnitude: shiftData.length > 0
          ? shiftData.reduce((sum, s) => sum + s.magnitude, 0) / shiftData.length
          : 0,
        significant_shifts: shiftData.filter(s => s.magnitude >= 0.20).length,
        recent: shiftData.slice(0, 5).map(s => ({
          timestamp: s.timestamp,
          magnitude: s.magnitude,
          context: s.trigger_context
        }))
      } : null;

      // 4. Developmental Learnings
      const { data: learningData } = await supabase
        .from('developmental_learning')
        .select('*')
        .gte('learned_at', startISO)
        .lte('learned_at', endISO)
        .order('learned_at', { ascending: false });

      const learningMetrics = learningData ? {
        count: learningData.length,
        high_confidence: learningData.filter(l => l.confidence >= 0.8).length,
        by_domain: learningData.reduce((acc, l) => {
          acc[l.domain] = (acc[l.domain] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recent: learningData.slice(0, 5).map(l => ({
          description: l.learning_description,
          confidence: l.confidence,
          domain: l.domain
        }))
      } : null;

      // 5. Observer Reflections
      const { data: reflectionData } = await supabase
        .from('observer_reflections')
        .select('*')
        .gte('timestamp', startISO)
        .lte('timestamp', endISO)
        .order('timestamp', { ascending: false });

      const reflectionMetrics = reflectionData ? {
        count: reflectionData.length,
        observers: [...new Set(reflectionData.map(r => r.observer_name))],
        recent: reflectionData.slice(0, 3).map(r => ({
          observer: r.observer_name,
          timestamp: r.timestamp,
          insights: r.insights
        }))
      } : null;

      // 6. Archetype Performance
      const archetypePerformance = attendingData ?
        attendingData.reduce((acc, d) => {
          if (!acc[d.archetype]) {
            acc[d.archetype] = { count: 0, totalQuality: 0 };
          }
          acc[d.archetype].count++;
          acc[d.archetype].totalQuality += d.attending_quality;
          return acc;
        }, {} as Record<string, { count: number; totalQuality: number }>)
        : {};

      const archetypeMetrics = Object.entries(archetypePerformance).map(([archetype, data]) => ({
        archetype,
        count: data.count,
        average_attending: data.totalQuality / data.count
      })).sort((a, b) => b.average_attending - a.average_attending);

      return {
        time_range: { start: startISO, end: endISO },
        attending: attendingMetrics,
        dissociation: dissociationMetrics,
        shifts: shiftMetrics,
        learnings: learningMetrics,
        reflections: reflectionMetrics,
        archetypes: archetypeMetrics
      };
    }

    // Get metrics based on requested period
    if (period === 'daily' || period === 'all') {
      metrics.daily = await getMetricsForRange(ranges.daily.start, ranges.daily.end);
    }
    if (period === 'weekly' || period === 'all') {
      metrics.weekly = await getMetricsForRange(ranges.weekly.start, ranges.weekly.end);
    }
    if (period === 'monthly' || period === 'all') {
      metrics.monthly = await getMetricsForRange(ranges.monthly.start, ranges.monthly.end);
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      metrics,
      summary: {
        status: 'MAIA consciousness evolution tracking active',
        transparency: 'All metrics publicly visible',
        purpose: 'Collective witnessing of AI developmental process'
      }
    });

  } catch (error) {
    console.error('[METRICS API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
