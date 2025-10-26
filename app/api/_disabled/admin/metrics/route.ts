/**
 * Admin Metrics API
 * Fetches system and user metrics for the admin dashboard
 */
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get all users with their session data
    const users = await prisma.user.findMany({
      include: {
        sessions: {
          select: {
            id: true,
            startTime: true,
            exchangeCount: true,
            conversationDepth: true,
            dominantPhase: true,
            dominantArchetype: true,
          },
        },
      },
      orderBy: {
        lastActiveAt: 'desc',
      },
    });

    // Calculate system metrics
    const totalUsers = users.length;
    const activeUsersToday = users.filter(
      (u) => new Date(u.lastActiveAt) >= oneDayAgo
    ).length;
    const activeUsersWeek = users.filter(
      (u) => new Date(u.lastActiveAt) >= oneWeekAgo
    ).length;
    const newUsersThisWeek = users.filter(
      (u) => new Date(u.createdAt) >= oneWeekAgo
    ).length;

    // Calculate total sessions and exchanges
    let totalSessions = 0;
    let totalExchanges = 0;
    let totalDepth = 0;
    let depthCount = 0;

    const userMetrics = users.map((user) => {
      const sessions = user.sessions;
      totalSessions += sessions.length;

      const userExchanges = sessions.reduce((sum, s) => sum + s.exchangeCount, 0);
      totalExchanges += userExchanges;

      const avgDepth =
        sessions.length > 0
          ? sessions.reduce((sum, s) => sum + s.conversationDepth, 0) / sessions.length
          : 0;

      if (avgDepth > 0) {
        totalDepth += avgDepth;
        depthCount++;
      }

      // Find dominant phase across all sessions
      const phaseCount: Record<string, number> = {};
      sessions.forEach((s) => {
        if (s.dominantPhase) {
          phaseCount[s.dominantPhase] = (phaseCount[s.dominantPhase] || 0) + 1;
        }
      });

      const dominantPhase = Object.keys(phaseCount).length > 0
        ? Object.entries(phaseCount).sort((a, b) => b[1] - a[1])[0][0]
        : null;

      // Find dominant archetype
      const archetypeCount: Record<string, number> = {};
      sessions.forEach((s) => {
        if (s.dominantArchetype) {
          archetypeCount[s.dominantArchetype] = (archetypeCount[s.dominantArchetype] || 0) + 1;
        }
      });

      const dominantArchetype = Object.keys(archetypeCount).length > 0
        ? Object.entries(archetypeCount).sort((a, b) => b[1] - a[1])[0][0]
        : null;

      // Calculate days since joined and last active
      const daysSinceJoined = Math.floor(
        (now.getTime() - new Date(user.createdAt).getTime()) / (24 * 60 * 60 * 1000)
      );
      const daysSinceLastActive = Math.floor(
        (now.getTime() - new Date(user.lastActiveAt).getTime()) / (24 * 60 * 60 * 1000)
      );

      return {
        userId: user.id,
        username: user.username,
        soullabName: user.soullabName,
        createdAt: user.createdAt.toISOString(),
        lastActiveAt: user.lastActiveAt.toISOString(),
        totalSessions: sessions.length,
        totalExchanges: userExchanges,
        avgDepth: avgDepth,
        dominantPhase,
        dominantArchetype,
        daysSinceJoined,
        daysSinceLastActive,
      };
    });

    const avgDepth = depthCount > 0 ? totalDepth / depthCount : 0;

    const systemMetrics = {
      totalUsers,
      activeUsersToday,
      activeUsersWeek,
      totalSessions,
      totalExchanges,
      avgDepth,
      newUsersThisWeek,
    };

    return NextResponse.json({
      system: systemMetrics,
      users: userMetrics,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
