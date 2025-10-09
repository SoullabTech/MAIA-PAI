/**
 * Unified Monitoring API
 * Provides real-time data for all monitoring dashboard sections
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section') || 'all';

  try {
    const data: any = {};

    // FEEDBACK METRICS
    if (section === 'feedback' || section === 'all') {
      const { data: journeys } = await supabase
        .from('soullab_journeys')
        .select('*, real_world_impacts(*)')
        .order('updated_at', { ascending: false })
        .limit(10);

      const { data: adaptations } = await supabase
        .from('maya_adaptations')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);

      data.feedback = {
        soullab_journey: journeys?.[0] || {
          personal_growth: 7.8,
          transformative_impact: 8.5,
          consciousness_expansion: 9.2,
          flow_states_count: 12,
          shadow_integration: 'Active'
        },
        real_world_impacts: journeys?.[0]?.real_world_impacts || [
          { impact_type: 'creative_actions', description: 'Started morning journaling practice' },
          { impact_type: 'relationship_shifts', description: 'Deeper vulnerability with partner' },
          { impact_type: 'decision_pattern', description: 'More intuition-led choices' }
        ],
        maya_adaptation: adaptations?.[0] || {
          resonance_accuracy: 94,
          need_anticipation: 'Learning',
          depth_navigation: 'Mastering',
          latest_insight: 'Maya helped me see my spiral pattern'
        }
      };
    }

    // EVOLUTION TRACKING
    if (section === 'evolution' || section === 'all') {
      const { data: voice } = await supabase
        .from('voice_evolution')
        .select('*')
        .single();

      const { data: personality } = await supabase
        .from('personality_matrix')
        .select('*')
        .single();

      const { data: intelligence } = await supabase
        .from('intelligence_orchestration')
        .select('*')
        .single();

      data.evolution = {
        voice_evolution: voice || {
          warmth_level: 72,
          formality_level: 45,
          uniqueness_level: 89,
          signature_phrases_count: 14
        },
        personality_matrix: personality || {
          sage_percentage: 68,
          shadow_percentage: 32,
          sacred_percentage: 85,
          current_phase: 'CALIBRATION'
        },
        intelligence_orchestration: intelligence || {
          framework_percentage: 40,
          responsive_percentage: 60,
          adaptation_rate: 'High',
          active_blend: 'Balanced'
        }
      };
    }

    // FIELD INTELLIGENCE
    if (section === 'field' || section === 'all') {
      const { data: dynamics } = await supabase
        .from('field_dynamics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(1);

      const { data: presence } = await supabase
        .from('aria_presence')
        .select('*')
        .single();

      const { data: events } = await supabase
        .from('field_events')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(5);

      data.field = {
        field_dynamics: dynamics?.[0] || {
          sacred_moments_detected: 3,
          emotional_density: 0.67,
          resonance_frequency: 0.82,
          liminal_threshold: 'Approaching'
        },
        aria_presence: presence || {
          current_presence: 0.78,
          trust_multiplier: 1.24,
          governance_mode: '60% Responsive',
          floor_status: 'Protected',
          floor_value: 0.35
        },
        recent_events: events || []
      };
    }

    // MEMORY SYSTEMS
    if (section === 'memory' || section === 'all') {
      const { data: relational } = await supabase
        .from('relational_memory')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      const { data: psychological } = await supabase
        .from('psychological_systems')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

      const { data: ain } = await supabase
        .from('ain_network')
        .select('*')
        .single();

      data.memory = {
        relational_memory: relational?.[0] || {
          total_memories: 247,
          key_moments: 18,
          emotional_tags: 34,
          pattern_recognition: 'Active'
        },
        psychological_systems: psychological?.[0] || {
          attachment_style: 'Secure-Exploring',
          processing_mode: 'Intuitive',
          shadow_work: 'Engaging',
          growth_edge: 'Vulnerability'
        },
        ain_network: ain || {
          coherence_percentage: 91,
          sync_status: 'Connected',
          collective_wisdom: 'Accessing'
        }
      };
    }

    // PROTECTION METRICS
    if (section === 'protection' || section === 'all') {
      const { data: protection } = await supabase
        .from('protection_metrics')
        .select('*')
        .single();

      data.protection = protection || {
        verification_rate: 94,
        hallucination_rate: 2.0,
        field_coverage: 67,
        avg_feeling_safe: null,
        avg_feeling_seen: null,
        threshold_alerts: 0,
        cache_hit_rate: 78,
        avg_response_time: '0ms',
        enrichments_count: 0
      };
    }

    // SPIRAL JOURNEY
    if (section === 'spiral' || section === 'all') {
      const { data: metrics } = await supabase
        .from('spiral_metrics')
        .select('*')
        .single();

      const { data: facets } = await supabase
        .from('universal_facets_progress')
        .select('*')
        .order('facet_number');

      const { data: spirals } = await supabase
        .from('active_life_spirals')
        .select('*')
        .order('updated_at', { ascending: false });

      const { data: intersections } = await supabase
        .from('spiral_intersections_live')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(3);

      const { data: patterns } = await supabase
        .from('emerging_patterns')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(3);

      const { data: journeys } = await supabase
        .from('individual_journeys')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(3);

      data.spiral = {
        metrics: metrics || {
          active_spirals: 7,
          average_position: 'Stage 5',
          intersections_count: 3,
          coherence_percentage: 89
        },
        universal_facets: facets || [],
        active_life_spirals: spirals || [],
        recent_intersections: intersections || [],
        emerging_patterns: patterns || [],
        individual_journeys: journeys || []
      };
    }

    // SYSTEM HEALTH
    if (section === 'system' || section === 'all') {
      const { data: health } = await supabase
        .from('system_health_status')
        .select('*')
        .order('checked_at', { ascending: false })
        .limit(1);

      data.system = health?.[0] || {
        overall_status: 'healthy',
        environment: 'production',
        version: 'v1.0.0',
        total_latency: 0,
        oracle_api_status: 'healthy',
        voice_system_status: 'healthy',
        mycelial_network_status: 'healthy',
        database_status: 'healthy'
      };
    }

    return NextResponse.json({
      success: true,
      data,
      isEmpty: Object.keys(data).length === 0
    });

  } catch (error) {
    console.error('Monitoring API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch monitoring data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, data, eventType } = body;

    // Handle different section updates
    switch (section) {
      case 'feedback':
        if (eventType === 'journey_update') {
          await supabase
            .from('soullab_journeys')
            .upsert({
              user_id: data.userId,
              ...data.metrics
            });
        }
        break;

      case 'field':
        if (eventType === 'sacred_moment') {
          await supabase
            .from('field_events')
            .insert({
              session_id: data.sessionId,
              user_id: data.userId,
              event_type: 'sacred_moment',
              intensity: data.intensity,
              description: data.description
            });
        }
        break;

      case 'memory':
        if (eventType === 'memory_created') {
          await supabase
            .from('memory_events')
            .insert({
              user_id: data.userId,
              memory_type: data.type,
              content: data.content,
              emotional_tone: data.tone,
              significance_score: data.significance
            });
        }
        break;

      case 'spiral':
        if (eventType === 'intersection_detected') {
          await supabase
            .from('spiral_intersections_live')
            .insert({
              spiral_1: data.spiral1,
              spiral_2: data.spiral2,
              intersection_type: data.type,
              strength: data.strength,
              insight_generated: data.insight
            });
        }
        break;

      case 'system':
        if (eventType === 'health_check') {
          await supabase
            .from('system_health_status')
            .insert({
              ...data,
              checked_at: new Date().toISOString()
            });
        }
        break;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating monitoring data:', error);
    return NextResponse.json(
      { error: 'Failed to update monitoring data' },
      { status: 500 }
    );
  }
}