import { NextResponse } from 'next/server';
import { getToneMetrics } from '@/lib/metrics/toneMetrics';

export async function GET() {
  return NextResponse.json(getToneMetrics());
}