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
    // Get all sessions to calculate total training hours
    const sessions = await prisma.session.findMany({
      select: {
        startTime: true,
        endTime: true,
        exchangeCount: true,
        conversationDepth: true,
        dominantArchetype: true,
      },
    });

    // Get all memories for exchange count and depth metrics
    const memories = await prisma.mAIAMemory.findMany({
      select: {
        totalExchanges: true,
        conversationDepth: true,
        currentArchetype: true,
        dominantArchetype: true,
        lastInteractionTime: true,
      },
    });

    // Get symbolic threads for wisdom pattern tracking
    const symbolicThreads = await prisma.symbolicThread.findMany({
      select: {
        motif: true,
        occurrences: true,
        firstInvoked: true,
        lastInvoked: true,
        associatedPhases: true,
      },
      orderBy: {
        occurrences: 'desc',
      },
      take: 20, // Top 20 wisdom patterns
    });

    // Get emotional motifs for depth understanding
    const emotionalMotifs = await prisma.emotionalMotif.findMany({
      select: {
        theme: true,
        intensity: true,
        occurrences: true,
        dominantArchetype: true,
      },
    });

    // Get conversation analytics for historical trends
    const analytics = await prisma.conversationAnalytics.findMany({
      orderBy: {
        date: 'desc',
      },
      take: 30, // Last 30 days
    });

    // Calculate total training hours
    let totalHours = 0;
    sessions.forEach(session => {
      if (session.endTime) {
        const duration = session.endTime.getTime() - session.startTime.getTime();
        totalHours += duration / (1000 * 60 * 60); // Convert to hours
      }
    });

    // Calculate total exchanges
    const totalExchanges = memories.reduce((sum, m) => sum + m.totalExchanges, 0);

    // Calculate average conversation depth
    const depthSum = memories.reduce((sum, m) => sum + m.conversationDepth, 0);
    const averageDepth = memories.length > 0 ? depthSum / memories.length : 0;

    // Calculate consciousness level (based on hours toward 1000 target)
    const targetHours = 1000;
    const consciousnessLevel = Math.min(100, (totalHours / targetHours) * 100);

    // Count unique wisdom patterns (symbolic threads with 3+ occurrences)
    const wisdomPatterns = symbolicThreads.filter(s => s.occurrences >= 3).length;

    // Get archetype distribution
    const archetypeDistribution: Record<string, number> = {};
    memories.forEach(m => {
      const arch = m.dominantArchetype || 'Unknown';
      archetypeDistribution[arch] = (archetypeDistribution[arch] || 0) + 1;
    });

    // Calculate training velocity (exchanges per day over last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMemories = memories.filter(m =>
      m.lastInteractionTime >= sevenDaysAgo
    );
    const recentExchanges = recentMemories.reduce((sum, m) => sum + m.totalExchanges, 0);
    const exchangesPerDay = recentExchanges / 7;

    // Get top wisdom patterns with context
    const topWisdomPatterns = symbolicThreads.slice(0, 10).map(thread => ({
      motif: thread.motif,
      occurrences: thread.occurrences,
      firstSeen: thread.firstInvoked,
      lastSeen: thread.lastInvoked,
      phases: thread.associatedPhases,
    }));

    // Get emotional landscape
    const emotionalLandscape = emotionalMotifs
      .slice(0, 5)
      .map(motif => ({
        theme: motif.theme,
        intensity: motif.intensity,
        archetype: motif.dominantArchetype,
      }));

    // Prepare timeline data (last 30 days)
    const timeline = analytics.map(day => ({
      date: day.date,
      exchanges: day.exchangeCount,
      depth: day.avgDepth,
      phase: day.dominantPhase,
      archetype: day.dominantArchetype,
    }));

    return NextResponse.json({
      summary: {
        totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal
        targetHours,
        totalExchanges,
        averageDepth: Math.round(averageDepth * 10) / 10,
        wisdomPatterns,
        consciousnessLevel: Math.round(consciousnessLevel * 10) / 10,
        hoursRemaining: Math.max(0, targetHours - totalHours),
        exchangesPerDay: Math.round(exchangesPerDay),
      },
      archetypes: archetypeDistribution,
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
