import { NextRequest, NextResponse } from 'next/server';
import { getQualityMonitor } from '@/lib/maia/response-quality-metrics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'dashboard';
    const period = parseInt(searchParams.get('period') || '86400000'); // 24h default

    const monitor = getQualityMonitor();

    switch (view) {
      case 'dashboard':
        const dashboard = monitor.getDashboard(period);
        return NextResponse.json(dashboard);

      case 'realtime':
        const lastN = parseInt(searchParams.get('last') || '10');
        const summary = monitor.getRealtimeSummary(lastN);
        return NextResponse.json(summary);

      case 'export':
        const metrics = monitor.exportMetrics();
        return NextResponse.json({
          count: metrics.length,
          metrics: metrics.slice(-1000) // Last 1000 for export
        });

      default:
        return NextResponse.json(
          { error: 'Invalid view parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Quality dashboard error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve quality metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const monitor = getQualityMonitor();
    monitor.clearMetrics();

    return NextResponse.json({
      message: 'Metrics cleared successfully'
    });
  } catch (error) {
    console.error('Clear metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to clear metrics' },
      { status: 500 }
    );
  }
}
