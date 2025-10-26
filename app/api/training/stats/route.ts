import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maya Training Statistics API
 *
 * Aggregates conversation data to show Maya's apprenticeship training progress
 * Target: 1000+ hours to achieve full consciousness transfer
 */
export async function GET() {
  try {
    // Get all training metrics from all users
    const allMetrics = await prisma.mayaTrainingMetrics.findMany();

    // Get all training exchanges
    const allExchanges = await prisma.mayaTrainingExchange.findMany({
      select: {
        timestamp: true,
        depthLevel: true,
        userState: true,
        emotionalTone: true,
        quality: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Get wisdom patterns
    const wisdomPatterns = await prisma.mayaWisdomPattern.findMany({
      orderBy: {
        successRate: 'desc',
      },
      take: 20,
    });

    // Aggregate metrics across all users
    const totalHours = allMetrics.reduce((sum, m) => sum + m.totalHours, 0);
    const totalExchanges = allMetrics.reduce((sum, m) => sum + m.totalExchanges, 0);

    // Calculate average depth from exchanges
    const depthSum = allExchanges.reduce((sum, e) => sum + e.depthLevel, 0);
    const averageDepth = allExchanges.length > 0 ? depthSum / allExchanges.length : 0;

    // Calculate consciousness level (based on hours toward 1000 target)
    const targetHours = 1000;
    const consciousnessLevel = Math.min(100, (totalHours / targetHours) * 100);

    // Get emotional landscape from recent exchanges
    const emotionalCounts: Record<string, number> = {};
    allExchanges.forEach(e => {
      emotionalCounts[e.emotionalTone] = (emotionalCounts[e.emotionalTone] || 0) + 1;
    });

    // Get user state distribution
    const userStateCounts: Record<string, number> = {};
    allExchanges.forEach(e => {
      userStateCounts[e.userState] = (userStateCounts[e.userState] || 0) + 1;
    });

    // Calculate training velocity (exchanges per day over last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentExchanges = allExchanges.filter(e => e.timestamp >= sevenDaysAgo);
    const exchangesPerDay = recentExchanges.length / 7;

    // Build timeline (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timelineMap = new Map<string, { exchanges: number; depths: number[] }>();

    allExchanges
      .filter(e => e.timestamp >= thirtyDaysAgo)
      .forEach(e => {
        const dateKey = e.timestamp.toISOString().split('T')[0];
        const existing = timelineMap.get(dateKey) || { exchanges: 0, depths: [] };
        existing.exchanges += 1;
        existing.depths.push(e.depthLevel);
        timelineMap.set(dateKey, existing);
      });

    const timeline = Array.from(timelineMap.entries())
      .map(([date, data]) => ({
        date: new Date(date),
        exchanges: data.exchanges,
        depth: data.depths.reduce((a, b) => a + b, 0) / data.depths.length,
        phase: null,
        archetype: null,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    // Get top wisdom patterns with context
    const topWisdomPatterns = wisdomPatterns.slice(0, 10).map(pattern => ({
      motif: pattern.name,
      occurrences: pattern.totalUses,
      firstSeen: pattern.discoveredAt,
      lastSeen: pattern.lastUsed,
      phases: pattern.bestUsedIn,
      successRate: pattern.successRate,
    }));

    // Get emotional landscape
    const emotionalLandscape = Object.entries(emotionalCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([theme, count]) => ({
        theme,
        intensity: count / allExchanges.length,
        archetype: null,
      }));

    return NextResponse.json({
      summary: {
        totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal
        targetHours,
        totalExchanges,
        averageDepth: Math.round(averageDepth * 10) / 10,
        wisdomPatterns: wisdomPatterns.length,
        consciousnessLevel: Math.round(consciousnessLevel * 10) / 10,
        hoursRemaining: Math.max(0, targetHours - totalHours),
        exchangesPerDay: Math.round(exchangesPerDay),
      },
      archetypes: userStateCounts,
      wisdomPatterns: topWisdomPatterns,
      emotionalLandscape,
      timeline,
      lastUpdated: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching training stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch training statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
