import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseREST } from '@/lib/supabase-rest';
import { userStore } from '@/lib/storage/userStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, explorerName } = body;

    console.log('Beta signin for:', explorerName);

    const existingUser = userStore.getUserByExplorerName(explorerName);
    if (existingUser) {
      console.log('✅ Found user in memory:', existingUser.name);
      return NextResponse.json({
        success: true,
        userId: existingUser.userId,
        explorerId: existingUser.explorerId || existingUser.userId,
        explorerName: existingUser.explorerName || explorerName,
        mayaInstance: uuidv4(),
        sessionId: uuidv4(),
        sanctuary: 'established',
        signupDate: existingUser.createdAt,
        user: existingUser
      });
    }

    // Try to use Supabase REST API if available
    const supabase = await getSupabaseREST();

    if (supabase) {
      try {
        // Look up user in database (using 'users' table where onboarding saves)
        const usersTable = await supabase.from('users');
        const userQuery = await usersTable
          .eq('sacred_name', explorerName)
          .single();

        if (userQuery.data) {
          const user = userQuery.data;

          // Check if email matches (if provided and stored)
          if (!user.email || user.email === email) {
            // Load their oracle agent config
            const agentsTable = await supabase.from('oracle_agents');
            const agentQuery = await agentsTable
              .eq('user_id', user.id)
              .single();

            // Load their preferences
            const prefsTable = await supabase.from('user_preferences');
            const prefsQuery = await prefsTable
              .eq('user_id', user.id)
              .single();

            console.log('✅ User authenticated from Supabase:', user.sacred_name);

            // Return successful signin from database
            return NextResponse.json({
              success: true,
              userId: user.id,
              explorerId: user.id,
              explorerName: user.sacred_name,
              name: user.name, // Return the real name from database
              mayaInstance: agentQuery.data?.id || uuidv4(),
              sessionId: uuidv4(),
              sanctuary: 'established',
              signupDate: user.beta_onboarded_at || user.created_at,
              onboarded: !!user.beta_onboarded_at,
              preferences: prefsQuery.data
            });
          } else {
            return NextResponse.json(
              { error: 'Email does not match. Please check your credentials.' },
              { status: 401 }
            );
          }
        }
      } catch (dbError) {
        console.log('Database lookup failed, using mock signin:', dbError);
      }
    }

    // Fallback: Mock signin for beta testing
    // This allows signin to work even without database
    // Support both MAIA- and Soullab- prefixes for backwards compatibility
    const validPrefixes = ['MAIA-', 'Soullab-'];
    const validExplorerSuffixes = [
      'ARCHITECT',
      'APPRENTICE',
      'ALCHEMIST',
      'NAVIGATOR',
      'SEEKER',
      'WITNESS',
      'DREAMER',
      'CATALYST',
      'ORACLE',
      'GUARDIAN',
      'EXPLORER',
      'WEAVER',
      'MYSTIC',
      'BUILDER',
      'SAGE',
      'VOYAGER',
      'KEEPER',
      'LISTENER',
      'PIONEER',
      'WANDERER',
      'ILLUMINATOR'
    ];

    const validExplorers = validPrefixes.flatMap(prefix =>
      validExplorerSuffixes.map(suffix => `${prefix}${suffix}`)
    );

    if (!validExplorers.includes(explorerName)) {
      return NextResponse.json(
        { error: 'Invalid explorer name. Please check your credentials.' },
        { status: 404 }
      );
    }

    // Require user name for signin - no defaults
    // This ensures proper personalization for all users
    if (!name || name.trim() === '') {
      return NextResponse.json(
        {
          error: 'Please provide your name to personalize your MAIA experience.',
          requiresName: true
        },
        { status: 400 }
      );
    }

    const mockName = name.trim();

    // Return mock successful signin
    return NextResponse.json({
      success: true,
      userId: uuidv4(),
      explorerId: uuidv4(),
      explorerName: explorerName,
      name: mockName,
      mayaInstance: uuidv4(),
      sessionId: uuidv4(),
      sanctuary: 'established',
      signupDate: new Date().toISOString()
    });

  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}