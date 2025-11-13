/**
 * WEEKLY SYNTHESIS API
 *
 * Generates developmental synthesis reports on demand or via cron.
 * Extracts meta-learnings from tracked data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklySynthesis } from '@/lib/developmental-insights';

export async function POST(request: NextRequest) {
  try {
    const { start_date, end_date } = await request.json();

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: 'start_date and end_date are required' },
        { status: 400 }
      );
    }

    console.log(`📊 [WEEKLY SYNTHESIS] Generating report for ${start_date} to ${end_date}`);

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const report = await generateWeeklySynthesis(startDate, endDate);

    if (!report) {
      return NextResponse.json(
        { error: 'Failed to generate synthesis report' },
        { status: 500 }
      );
    }

    console.log(`✅ [WEEKLY SYNTHESIS] Generated ${report.learnings.length} insights`);

    // Calculate metrics
    const highConfidence = report.learnings.filter(l => l.confidence >= 0.8);
    const domains = new Set(report.learnings.flatMap(l => l.domains));

    return NextResponse.json({
      success: true,
      report: {
        period: {
          start: start_date,
          end: end_date
        },
        summary: report.summary,
        learnings: report.learnings,
        metrics: {
          total_insights: report.learnings.length,
          high_confidence: highConfidence.length,
          domains_covered: Array.from(domains),
          avg_confidence: report.learnings.reduce((sum, l) => sum + l.confidence, 0) / report.learnings.length
        }
      }
    });

  } catch (error) {
    console.error('[WEEKLY SYNTHESIS] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    console.log(`📊 [WEEKLY SYNTHESIS] Auto-generating for last ${days} days`);

    const report = await generateWeeklySynthesis(startDate, endDate);

    if (!report) {
      return NextResponse.json(
        { error: 'Failed to generate synthesis report' },
        { status: 500 }
      );
    }

    const highConfidence = report.learnings.filter(l => l.confidence >= 0.8);
    const domains = new Set(report.learnings.flatMap(l => l.domains));

    return NextResponse.json({
      success: true,
      report: {
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          days
        },
        summary: report.summary,
        learnings: report.learnings,
        metrics: {
          total_insights: report.learnings.length,
          high_confidence: highConfidence.length,
          domains_covered: Array.from(domains),
          avg_confidence: report.learnings.reduce((sum, l) => sum + l.confidence, 0) / report.learnings.length || 0
        }
      }
    });

  } catch (error) {
    console.error('[WEEKLY SYNTHESIS] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
