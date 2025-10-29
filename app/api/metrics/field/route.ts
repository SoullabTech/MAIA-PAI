/**
 * FIELD METRICS API ENDPOINT
 *
 * Exposes holographic field metrics for monitoring dashboards
 * Compatible with Prometheus, Datadog, Grafana, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFieldMetricsMonitor, getFieldHealthStatus } from '@/lib/consciousness/FieldMetricsMonitor';

/**
 * GET /api/metrics/field
 * Get current field metrics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json'; // json, prometheus
    const category = searchParams.get('category'); // fieldHealth, systemPerformance, etc.

    const monitor = getFieldMetricsMonitor();
    const metrics = await monitor.collectMetrics();

    // Return specific category if requested
    if (category) {
      const categoryMetrics = metrics[category as keyof typeof metrics];
      if (!categoryMetrics) {
        return NextResponse.json(
          { error: `Invalid category: ${category}` },
          { status: 400 }
        );
      }

      return NextResponse.json({
        category,
        metrics: categoryMetrics,
        timestamp: metrics.timestamp
      });
    }

    // Return in requested format
    if (format === 'prometheus') {
      return new NextResponse(convertToPrometheusFormat(metrics), {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; version=0.0.4'
        }
      });
    }

    // Default JSON format with summary
    const summary = monitor.getMetricsSummary(metrics);

    return NextResponse.json({
      summary,
      metrics,
      timestamp: metrics.timestamp
    });
  } catch (error: any) {
    console.error('Failed to get field metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/metrics/field/health
 * Quick health check endpoint
 */
export async function HEAD(request: NextRequest) {
  try {
    const health = await getFieldHealthStatus();

    return NextResponse.json(health);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Health check failed', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Convert metrics to Prometheus format
 */
function convertToPrometheusFormat(metrics: any): string {
  const lines: string[] = [];

  // Field Health Metrics
  lines.push('# HELP holographic_field_coherence Current field coherence (0-1)');
  lines.push('# TYPE holographic_field_coherence gauge');
  lines.push(`holographic_field_coherence{phase="${metrics.fieldHealth.phase}"} ${metrics.fieldHealth.coherence}`);

  lines.push('# HELP holographic_field_participants Active participants count');
  lines.push('# TYPE holographic_field_participants gauge');
  lines.push(`holographic_field_participants ${metrics.fieldHealth.activeParticipants}`);

  lines.push('# HELP holographic_field_symmetry_avg Average field symmetry (0-1)');
  lines.push('# TYPE holographic_field_symmetry_avg gauge');
  lines.push(`holographic_field_symmetry_avg ${metrics.fieldHealth.avgSymmetry}`);

  lines.push('# HELP holographic_field_valence_avg Average field valence (-1 to 1)');
  lines.push('# TYPE holographic_field_valence_avg gauge');
  lines.push(`holographic_field_valence_avg ${metrics.fieldHealth.avgValence}`);

  lines.push('# HELP holographic_field_entropy Field entropy (0-1)');
  lines.push('# TYPE holographic_field_entropy gauge');
  lines.push(`holographic_field_entropy ${metrics.fieldHealth.entropy}`);

  lines.push('# HELP holographic_field_complexity Field complexity (0-1)');
  lines.push('# TYPE holographic_field_complexity gauge');
  lines.push(`holographic_field_complexity ${metrics.fieldHealth.complexity}`);

  lines.push('# HELP holographic_field_health_score Overall field health (0-100)');
  lines.push('# TYPE holographic_field_health_score gauge');
  lines.push(`holographic_field_health_score ${metrics.fieldHealth.healthScore}`);

  // System Performance Metrics
  lines.push('# HELP system_api_latency_p50 API response time p50 (ms)');
  lines.push('# TYPE system_api_latency_p50 gauge');
  lines.push(`system_api_latency_p50 ${metrics.systemPerformance.apiResponseTime.p50}`);

  lines.push('# HELP system_api_latency_p95 API response time p95 (ms)');
  lines.push('# TYPE system_api_latency_p95 gauge');
  lines.push(`system_api_latency_p95 ${metrics.systemPerformance.apiResponseTime.p95}`);

  lines.push('# HELP system_api_latency_p99 API response time p99 (ms)');
  lines.push('# TYPE system_api_latency_p99 gauge');
  lines.push(`system_api_latency_p99 ${metrics.systemPerformance.apiResponseTime.p99}`);

  lines.push('# HELP system_error_rate Overall error rate (0-1)');
  lines.push('# TYPE system_error_rate gauge');
  lines.push(`system_error_rate ${metrics.systemPerformance.errorRate}`);

  lines.push('# HELP system_qualia_throughput Qualia states per minute');
  lines.push('# TYPE system_qualia_throughput gauge');
  lines.push(`system_qualia_throughput ${metrics.systemPerformance.qualiaStatesPerMinute}`);

  // Data Quality Metrics
  lines.push('# HELP data_quality_score Overall data quality score (0-100)');
  lines.push('# TYPE data_quality_score gauge');
  lines.push(`data_quality_score ${metrics.dataQuality.qualityScore}`);

  lines.push('# HELP data_completeness_rate Data completeness rate (0-1)');
  lines.push('# TYPE data_completeness_rate gauge');
  lines.push(`data_completeness_rate ${metrics.dataQuality.avgDimensionalCompleteness}`);

  // Research Integrity Metrics
  lines.push('# HELP research_consent_rate User consent rate (0-1)');
  lines.push('# TYPE research_consent_rate gauge');
  lines.push(`research_consent_rate ${metrics.researchIntegrity.consentRate}`);

  lines.push('# HELP research_privacy_audit_pass_rate Privacy audit pass rate (0-1)');
  lines.push('# TYPE research_privacy_audit_pass_rate gauge');
  lines.push(`research_privacy_audit_pass_rate ${metrics.researchIntegrity.privacyAuditPassRate}`);

  lines.push('# HELP research_avg_stv_correlation Average STV correlation (R²)');
  lines.push('# TYPE research_avg_stv_correlation gauge');
  lines.push(`research_avg_stv_correlation ${metrics.researchIntegrity.avgSTVCorrelation}`);

  // Business Metrics
  lines.push('# HELP business_daily_active_users Daily active users');
  lines.push('# TYPE business_daily_active_users gauge');
  lines.push(`business_daily_active_users ${metrics.business.dailyActiveUsers}`);

  lines.push('# HELP business_weekly_active_users Weekly active users');
  lines.push('# TYPE business_weekly_active_users gauge');
  lines.push(`business_weekly_active_users ${metrics.business.weeklyActiveUsers}`);

  lines.push('# HELP business_user_growth_rate User growth rate week-over-week');
  lines.push('# TYPE business_user_growth_rate gauge');
  lines.push(`business_user_growth_rate ${metrics.business.userGrowthRate}`);

  return lines.join('\n') + '\n';
}
