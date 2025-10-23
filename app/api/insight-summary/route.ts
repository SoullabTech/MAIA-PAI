// app/api/insight-summary/route.ts
// 🜂 Elemental Analytics API for Claude Mirror Insights

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface ElementCount {
  element: string;
  count: number;
  percentage: number;
}

interface InsightSummary {
  userId?: string;
  totalInsights: number;
  elementalBreakdown: ElementCount[];
  roleDistribution: {
    user: number;
    assistant: number;
    system: number;
  };
  dateRange: {
    firstInsight: string | null;
    latestInsight: string | null;
  };
}

/**
 * GET /api/insight-summary?userId=xxx&source=ClaudeMirror&days=7
 *
 * Returns elemental analytics for Claude Mirror insights
 *
 * Query params:
 * - userId: Optional user filter
 * - source: Filter by source (default: "ClaudeMirror")
 * - days: Number of days to include (default: all)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const source = searchParams.get("source") || "ClaudeMirror";
    const days = searchParams.get("days");

    // Build query
    let query = supabase.from("insight_history").select("*").eq("source", source);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      query = query.gte("created_at", daysAgo.toISOString());
    }

    const { data: insights, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch insights", details: error.message },
        { status: 500 }
      );
    }

    // If no data, return empty summary
    if (!insights || insights.length === 0) {
      return NextResponse.json({
        userId,
        totalInsights: 0,
        elementalBreakdown: [],
        roleDistribution: { user: 0, assistant: 0, system: 0 },
        dateRange: { firstInsight: null, latestInsight: null },
      });
    }

    // Compute elemental breakdown
    const elementCounts = new Map<string, number>();
    const roleCounts = { user: 0, assistant: 0, system: 0 };
    let firstInsight = insights[0].created_at;
    let latestInsight = insights[0].created_at;

    for (const insight of insights) {
      // Count by element
      const element = insight.element || "Unknown";
      elementCounts.set(element, (elementCounts.get(element) || 0) + 1);

      // Count by role
      const role = insight.role as "user" | "assistant" | "system";
      if (role in roleCounts) {
        roleCounts[role]++;
      }

      // Track date range
      if (insight.created_at < firstInsight) firstInsight = insight.created_at;
      if (insight.created_at > latestInsight) latestInsight = insight.created_at;
    }

    // Build elemental breakdown with percentages
    const totalCount = insights.length;
    const elementalBreakdown: ElementCount[] = Array.from(elementCounts.entries())
      .map(([element, count]) => ({
        element,
        count,
        percentage: Math.round((count / totalCount) * 100 * 10) / 10, // 1 decimal
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending

    const summary: InsightSummary = {
      userId: userId || undefined,
      totalInsights: totalCount,
      elementalBreakdown,
      roleDistribution: roleCounts,
      dateRange: {
        firstInsight,
        latestInsight,
      },
    };

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error("Error in GET /api/insight-summary:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
