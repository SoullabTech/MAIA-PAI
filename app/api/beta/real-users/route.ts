/**
 * Real Users API for Beta Monitor
 * Returns actual tracked user activity
 */

import { NextRequest, NextResponse } from 'next/server';
import { userTracker } from '@/lib/tracking/userActivityTracker';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Beta testers master list for reference
const BETA_TESTERS = [
  { name: 'Andrea Fagan', email: 'andreadfagan@gmail.com' },
  { name: 'Andrea Nezat', email: 'andreanezat@gmail.com' },
  { name: 'Angela Economakis', email: 'aceconomakis@gmail.com' },
  { name: 'Augusten Nezat', email: 'augustennezat@gmail.com' },
  { name: 'Cece Campbell', email: 'cececampbell1@gmail.com' },
  { name: 'Cynthy Ruder', email: 'Dancyn3@aol.com' },
  { name: 'Doug Foreman', email: 'dougaforeman@gmail.com' },
  { name: 'Jason Ruder', email: 'JHRuder@gmail.com' },
  { name: 'Jondi Whitis', email: 'jondi@eft4results.com' },
  { name: 'Julie Mountcastle', email: 'jmountcastle@slateschool.org' },
  { name: 'Justin Boucher', email: 'justin.boucher@gmail.com' },
  { name: 'Kimberly Daugherty', email: 'dakotamundi@gmail.com' },
  { name: 'Kristen Nezat', email: 'Inhomesanctuary@gmail.com' },
  { name: 'Leonard Ruder', email: 'Lruderlcsw@aol.com' },
  { name: 'Loralee Geil', email: 'loraleegeil@gmail.com' },
  { name: "Meagan d'Aquin", email: 'mdaquin@gmail.com' },
  { name: 'Nathan Kane', email: 'Nathan.Kane@thermofisher.com' },
  { name: 'Nina Ruder', email: 'Ninaruder11@gmail.com' },
  { name: 'Patrick Koehn', email: 'plkoehn@gmail.com' },
  { name: 'Rick Tessier', email: 'richardcteissier27@icloud.com' },
  { name: 'Romeo Ibanez', email: 'romeo@veydrisresearch.com' },
  { name: 'Sophie Nezat', email: 'snezat27@sacredhearthamden.org' },
  { name: 'Stephen Clayton', email: 'sparkles1724@gmail.com' },
  { name: 'Susan Bragg', email: 'phoenixrises123@gmail.com' },
  { name: 'Tamara Moore', email: 'tamaramoorecolorado@gmail.com' },
  { name: 'Travis Diamond', email: 'tcdiamond70@gmail.com' },
  { name: 'Weezie DeLavergne', email: 'weezie.delavergne@gmail.com' },
  { name: 'Zsuzsanna Ferenczi', email: 'zsuzsanna.ferenczi@icloud.com' },
];

export async function GET(request: NextRequest) {
  try {
    // Get real activity summary from tracker
    const activitySummary = userTracker.getActivitySummary();
    const activeUsers = userTracker.getActiveUsers();
    const allTrackedUsers = await userTracker.getAllUsers();

    // Merge with beta tester list to show both tracked and untracked
    const mergedUsers = BETA_TESTERS.map(tester => {
      const trackedUser = allTrackedUsers.find(
        u => u.name === tester.name || u.email === tester.email
      );

      if (trackedUser) {
        return {
          name: tester.name,
          email: tester.email,
          status: trackedUser.status || 'offline',
          registered: true,
          lastActive: trackedUser.last_active,
          messageCount: trackedUser.message_count || 0,
          engagement: trackedUser.engagement_score || 0,
          sessions: trackedUser.session_count || 1
        };
      }

      return {
        name: tester.name,
        email: tester.email,
        status: 'not_registered',
        registered: false,
        lastActive: null,
        messageCount: 0,
        engagement: 0,
        sessions: 0
      };
    });

    // Add any active users not in beta list (anonymous users)
    activeUsers.forEach(activeUser => {
      if (!mergedUsers.find(u => u.name === activeUser.name)) {
        mergedUsers.push({
          name: activeUser.name,
          email: activeUser.email || '',
          status: 'online',
          registered: true,
          lastActive: activeUser.lastActivity.toISOString(),
          messageCount: activeUser.messageCount,
          engagement: activeUser.engagement,
          sessions: 1
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        users: mergedUsers,
        activeUsers: activeUsers.map(u => ({
          name: u.name,
          userId: u.userId,
          sessionStart: u.sessionStart,
          lastActivity: u.lastActivity,
          messageCount: u.messageCount,
          mode: u.mode,
          engagement: u.engagement
        })),
        summary: {
          total: BETA_TESTERS.length,
          registered: activitySummary.registeredUsers,
          active: activitySummary.activeUsers,
          avgEngagement: activitySummary.avgEngagement
        },
        recentActivities: activitySummary.recentActivities,
        isRealData: true,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Failed to fetch real user data:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user data',
      data: {
        users: [],
        activeUsers: [],
        summary: {
          total: BETA_TESTERS.length,
          registered: 0,
          active: 0,
          avgEngagement: 0
        },
        recentActivities: [],
        isRealData: false
      }
    }, { status: 500 });
  }
}