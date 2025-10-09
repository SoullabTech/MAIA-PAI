/**
 * Beta Users API
 * Returns list of registered beta testers and their activity
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Beta testers master list
const BETA_TESTERS = [
  { name: 'Andrea Fagan', email: 'andreadfagan@gmail.com', passcode: 'SOULLAB-ANDREAFAGAN' },
  { name: 'Andrea Nezat', email: 'andreanezat@gmail.com', passcode: 'SOULLAB-ANDREA' },
  { name: 'Angela Economakis', email: 'aceconomakis@gmail.com', passcode: 'SOULLAB-ANGELA' },
  { name: 'Augusten Nezat', email: 'augustennezat@gmail.com', passcode: 'SOULLAB-AUGUSTEN' },
  { name: 'Cece Campbell', email: 'cececampbell1@gmail.com', passcode: 'SOULLAB-CECE' },
  { name: 'Cynthy Ruder', email: 'Dancyn3@aol.com', passcode: 'SOULLAB-CYNTHY' },
  { name: 'Doug Foreman', email: 'dougaforeman@gmail.com', passcode: 'SOULLAB-DOUG' },
  { name: 'Jason Ruder', email: 'JHRuder@gmail.com', passcode: 'SOULLAB-JASON' },
  { name: 'Jondi Whitis', email: 'jondi@eft4results.com', passcode: 'SOULLAB-JONDI' },
  { name: 'Julie Mountcastle', email: 'jmountcastle@slateschool.org', passcode: 'SOULLAB-JULIE' },
  { name: 'Justin Boucher', email: 'justin.boucher@gmail.com', passcode: 'SOULLAB-JUSTIN' },
  { name: 'Kimberly Daugherty', email: 'dakotamundi@gmail.com', passcode: 'SOULLAB-KIMBERLY' },
  { name: 'Kristen Nezat', email: 'Inhomesanctuary@gmail.com', passcode: 'SOULLAB-KRISTEN' },
  { name: 'Leonard Ruder', email: 'Lruderlcsw@aol.com', passcode: 'SOULLAB-LEONARD' },
  { name: 'Loralee Geil', email: 'loraleegeil@gmail.com', passcode: 'SOULLAB-LORALEE' },
  { name: "Meagan d'Aquin", email: 'mdaquin@gmail.com', passcode: 'SOULLAB-MEAGAN' },
  { name: 'Nathan Kane', email: 'Nathan.Kane@thermofisher.com', passcode: 'SOULLAB-NATHAN' },
  { name: 'Nina Ruder', email: 'Ninaruder11@gmail.com', passcode: 'SOULLAB-NINA' },
  { name: 'Patrick Koehn', email: 'plkoehn@gmail.com', passcode: 'SOULLAB-PATRICK' },
  { name: 'Rick Tessier', email: 'richardcteissier27@icloud.com', passcode: 'SOULLAB-RICK' },
  { name: 'Romeo Ibanez', email: 'romeo@veydrisresearch.com', passcode: 'SOULLAB-ROMEO' },
  { name: 'Sophie Nezat', email: 'snezat27@sacredhearthamden.org', passcode: 'SOULLAB-SOPHIE' },
  { name: 'Stephen Clayton', email: 'sparkles1724@gmail.com', passcode: 'SOULLAB-STEPHEN' },
  { name: 'Susan Bragg', email: 'phoenixrises123@gmail.com', passcode: 'SOULLAB-SUSAN' },
  { name: 'Tamara Moore', email: 'tamaramoorecolorado@gmail.com', passcode: 'SOULLAB-TAMARA' },
  { name: 'Travis Diamond', email: 'tcdiamond70@gmail.com', passcode: 'SOULLAB-TRAVIS' },
  { name: 'Weezie DeLavergne', email: 'weezie.delavergne@gmail.com', passcode: 'SOULLAB-WEEZIE' },
  { name: 'Zsuzsanna Ferenczi', email: 'zsuzsanna.ferenczi@icloud.com', passcode: 'SOULLAB-ZSUZSANNA' },
  { name: 'Whitey Whitehurst', email: 'Whiteysart.kathleen@icloud.com', passcode: 'SOULLAB-WHITEY' },
  { name: 'Korey', email: 'koreyrichey@gmail.com', passcode: 'SOULLAB-KOREY' },
  { name: 'Karen', email: 'karenmccullen@hotmail.com', passcode: 'SOULLAB-KAREN' },
  { name: 'Natasha', email: 'tashajam@gmail.com', passcode: 'SOULLAB-NATASHA' },
  { name: 'Catherine', email: 'catherine@atthefield.uk', passcode: 'SOULLAB-CATHERINE' },
  { name: 'Thea', email: 'thea@theapagel.com', passcode: 'SOULLAB-THEA' },
  { name: 'Virginia', email: 'vmiller@bmfcomms.com', passcode: 'SOULLAB-VIRGINIA' },
  { name: 'Joseph', email: 'crownhouseone@gmail.com', passcode: 'SOULLAB-JOSEPH' },
  { name: 'Anna', email: 'abcdunbar@gmail.com', passcode: 'SOULLAB-ANNA' },
  { name: 'Yvonne', email: 'Yvonneland@gmail.com', passcode: 'SOULLAB-YVONNE' },
  { name: 'David', email: 'Dstepetic@gmail.com', passcode: 'SOULLAB-DAVID' },
  { name: 'Risako', email: 'Risako.stepetic@gmail.com', passcode: 'SOULLAB-RISAKO' },
];

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Query actual registered users from database
    // 1. Explorers table (signup)
    const { data: explorers, error: explorerError } = await supabase
      .from('explorers')
      .select('*')
      .order('signup_date', { ascending: false });

    // 2. Users table (ANY user who has logged in or has activity)
    const { data: onboardedUsers, error: usersError } = await supabase
      .from('users')
      .select('*');

    // 3. Beta users table for backward compatibility
    const { data: betaUsers, error: betaError } = await supabase
      .from('beta_users')
      .select('*');

    if (explorerError && explorerError.code !== 'PGRST116') {
      console.error('Explorers query error:', explorerError);
    }
    if (usersError && usersError.code !== 'PGRST116') {
      console.error('Users query error:', usersError);
    }
    if (betaError && betaError.code !== 'PGRST116') {
      console.error('Beta users query error:', betaError);
    }

    // Combine all sources
    const registeredUsers = [...(explorers || []), ...(onboardedUsers || []), ...(betaUsers || [])];

    console.log('[Beta Users API] Found registered users:', {
      explorersCount: explorers?.length || 0,
      betaOnboardedCount: onboardedUsers?.length || 0,
      betaUsersCount: betaUsers?.length || 0,
      total: registeredUsers.length,
      explorerNames: explorers?.map(e => e.explorer_name) || [],
      onboardedUsers: onboardedUsers?.map(u => u.name) || []
    });

    // Get list of emails/names that have ANY activity in the system
    // This is a simplified approach: if they're in ANY table, they're "registered"
    const activeEmails = new Set<string>();
    registeredUsers.forEach(u => {
      if (u.email) activeEmails.add(u.email.toLowerCase());
      if (u.name) {
        // Match by first name too
        const firstName = u.name.split(' ')[0].toLowerCase();
        activeEmails.add(firstName);
      }
    });

    // Combine with beta testers list
    const users = BETA_TESTERS.map(tester => {
      // Try to find this tester in registered users
      const registered = registeredUsers?.find(u =>
        u.email?.toLowerCase() === tester.email.toLowerCase() ||
        u.passcode === tester.passcode ||
        u.explorer_name?.includes(tester.name.split(' ')[0]) ||
        u.name?.toLowerCase().includes(tester.name.split(' ')[0].toLowerCase())
      );

      // Also check if their email/name appears in the active set
      const hasActivity = registered ||
        activeEmails.has(tester.email.toLowerCase()) ||
        activeEmails.has(tester.name.split(' ')[0].toLowerCase());

      // Handle both explorers and beta_users table formats
      const lastActive = registered?.last_active || registered?.updated_at || registered?.signup_date;
      const createdAt = registered?.created_at || registered?.signup_date;

      return {
        id: registered?.id || registered?.explorer_id || `pending_${tester.passcode}`,
        name: registered?.explorer_name || registered?.name || tester.name,
        email: tester.email,
        passcode: tester.passcode,
        explorerName: registered?.explorer_name || registered?.name || null,
        status: hasActivity ? (lastActive &&
          new Date(lastActive) > new Date(Date.now() - 5 * 60 * 1000)
            ? 'online'
            : lastActive && new Date(lastActive) > new Date(Date.now() - 30 * 60 * 1000)
            ? 'idle'
            : 'offline'
        ) : 'not_registered',
        registered: hasActivity,
        sessions: registered?.session_count || 0,
        engagement: hasActivity ? Math.min(100, (registered?.session_count || 0) * 10) : 0,
        trustScore: registered?.trust_score || 0,
        lastActive: lastActive || null,
        createdAt: createdAt || null
      };
    });

    // Also add any registered explorers who aren't on the invited list (e.g., Kelly, the founder)
    const seenEmails = new Set<string>();
    users.forEach(u => {
      if (u.email) seenEmails.add(u.email.toLowerCase());
    });

    const additionalExplorers = registeredUsers.filter(regUser => {
      const email = regUser.email?.toLowerCase();
      if (!email || seenEmails.has(email)) return false;
      seenEmails.add(email);
      return true;
    }).map(explorer => ({
      id: explorer.explorer_id || explorer.id,
      name: explorer.explorer_name || explorer.name,
      email: explorer.email,
      passcode: null,
      explorerName: explorer.explorer_name,
      status: 'offline',
      registered: true,
      sessions: explorer.session_count || 0,
      engagement: Math.min(100, (explorer.session_count || 0) * 10),
      trustScore: 0,
      lastActive: explorer.signup_date || explorer.updated_at,
      createdAt: explorer.signup_date
    }));

    const allUsers = [...users, ...additionalExplorers];

    // Calculate summary stats
    const activeUsers = allUsers.filter(u => u.status === 'online').length;
    const registeredUsers_count = allUsers.filter(u => u.registered).length;
    const avgEngagement = allUsers.filter(u => u.registered).length > 0
      ? Math.round(allUsers.filter(u => u.registered).reduce((sum, u) => sum + u.engagement, 0) /
          allUsers.filter(u => u.registered).length * 100)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        users: allUsers,
        summary: {
          total: allUsers.length,
          registered: registeredUsers_count,
          active: activeUsers,
          avgEngagement
        }
      }
    });

  } catch (error) {
    console.error('Failed to fetch beta users:', error);

    // Fallback: Return beta testers list without activity data
    return NextResponse.json({
      success: true,
      data: {
        users: BETA_TESTERS.map((tester, idx) => ({
          id: `pending_${tester.passcode}`,
          name: tester.name,
          email: tester.email,
          passcode: tester.passcode,
          status: 'not_registered',
          registered: false,
          sessions: 0,
          engagement: 0,
          trustScore: 0,
          lastActive: null,
          createdAt: null
        })),
        summary: {
          total: BETA_TESTERS.length,
          registered: 0,
          active: 0,
          avgEngagement: 0
        },
        note: 'Showing beta testers list - no registrations yet'
      }
    });
  }
}