/**
 * RFS Monitoring Dashboard API
 * Real-time comparison of Traditional vs Resonance Field System
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHybridSystemToggle } from '@/lib/oracle/HybridSystemToggle';

export async function GET(request: NextRequest) {
  try {
    const system = getHybridSystemToggle();
    const config = system.getConfig();
    const metrics = system.getMetrics();
    const comparison = system.getComparisonReport();

    return NextResponse.json({
      status: 'active',
      timestamp: new Date().toISOString(),
      configuration: {
        currentMode: config.mode,
        rfsRolloutPercentage: config.rfsRolloutPercentage,
        monitoringEnabled: config.monitoringEnabled,
        enabledForNewUsers: config.enableForNewUsers,
        enabledForReturningUsers: config.enableForReturningUsers
      },
      metrics: {
        traditional: metrics.traditional,
        rfs: metrics.rfs
      },
      comparison,
      readyForProduction: true,
      deploymentStatus: config.mode === 'rfs' ? 'RFS_ACTIVE' : 'TRADITIONAL_ACTIVE'
    });

  } catch (error: any) {
    console.error('Dashboard error:', error);
    return NextResponse.json({
      error: 'Dashboard unavailable',
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config } = body;

    const system = getHybridSystemToggle();

    switch (action) {
      case 'switch_to_rfs':
        system.switchToRFS(config?.rolloutPercentage || 100);
        return NextResponse.json({
          success: true,
          message: `Switched to RFS with ${config?.rolloutPercentage || 100}% rollout`,
          newConfig: system.getConfig()
        });

      case 'rollback_to_traditional':
        system.rollbackToTraditional();
        return NextResponse.json({
          success: true,
          message: 'Rolled back to traditional system',
          newConfig: system.getConfig()
        });

      case 'update_config':
        system.updateConfig(config);
        return NextResponse.json({
          success: true,
          message: 'Configuration updated',
          newConfig: system.getConfig()
        });

      case 'reset_metrics':
        system.resetMetrics();
        return NextResponse.json({
          success: true,
          message: 'Metrics reset',
          metrics: system.getMetrics()
        });

      case 'get_comparison':
        const comparison = system.getComparisonReport();
        return NextResponse.json({
          success: true,
          comparison
        });

      default:
        return NextResponse.json({
          error: 'Unknown action',
          validActions: [
            'switch_to_rfs',
            'rollback_to_traditional',
            'update_config',
            'reset_metrics',
            'get_comparison'
          ]
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Dashboard action error:', error);
    return NextResponse.json({
      error: 'Action failed',
      message: error.message
    }, { status: 500 });
  }
}