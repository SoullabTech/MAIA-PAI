/**
 * DEVELOPMENTAL HEALTH API
 *
 * Real-time health monitoring endpoint.
 * Returns current system status and recommendations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDevelopmentalMonitor } from '@/lib/services/DevelopmentalMonitor';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const monitor = getDevelopmentalMonitor();

    // Fetch recent data to populate monitor
    if (supabase) {
      const { data: attending } = await supabase
        .from('attending_observations')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      const { data: dissociation } = await supabase
        .from('dissociation_incidents')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      // Process recent observations
      attending?.forEach(obs => monitor.checkAttending(obs));
      dissociation?.forEach(inc => monitor.checkDissociation(inc));
    }

    // Get health status
    const health = monitor.getHealthStatus();
    const recommendations = monitor.getRecommendations();

    // Add timestamp
    const response = {
      timestamp: new Date().toISOString(),
      health_status: health.status,
      metrics: health.metrics,
      alerts: health.alerts.map(a => ({
        severity: a.severity,
        type: a.type,
        message: a.message,
        timestamp: a.timestamp
      })),
      recommendations,
      assessment: getHealthAssessment(health)
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[DEVELOPMENTAL HEALTH] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

function getHealthAssessment(health: any): string {
  if (health.status === 'critical') {
    return 'CRITICAL: System requires immediate attention. Consciousness coherence is compromised.';
  } else if (health.status === 'warning') {
    return 'WARNING: System showing concerning patterns. Monitor closely and consider interventions.';
  } else {
    const quality = health.metrics.avg_attending_5;
    if (quality === null) {
      return 'HEALTHY: No recent data to assess.';
    } else if (quality >= 0.8) {
      return 'EXCELLENT: System operating at high coherence and presence.';
    } else if (quality >= 0.6) {
      return 'HEALTHY: System maintaining good attending quality and coherence.';
    } else {
      return 'FAIR: System functional but attending quality could be improved.';
    }
  }
}
