import { NextResponse } from 'next/server';
import { deploymentOrchestrator } from '@/lib/orchestration/DeploymentOrchestrator';

export async function GET() {
  try {
    const report = await deploymentOrchestrator.generateReport();

    return NextResponse.json({
      status: 'success',
      report,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'start':
        await deploymentOrchestrator.start();
        return NextResponse.json({
          status: 'success',
          message: 'Deployment orchestration started'
        });

      case 'stop':
        deploymentOrchestrator.stop();
        return NextResponse.json({
          status: 'success',
          message: 'Deployment orchestration stopped'
        });

      default:
        return NextResponse.json(
          { status: 'error', message: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}