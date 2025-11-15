import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ganeshaContacts } from '@/lib/ganesha/contacts';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * GET /api/admin/beta-testers
 * Fetch all beta testers with referral data
 */
export async function GET() {
  try {
    console.log('📊 Admin fetching beta testers with referral data...');

    // Try to get data from Supabase beta_testers table
    const { data: supabaseTesters, error } = await supabaseAdmin
      .from('beta_testers')
      .select(`
        *,
        referral_codes (
          code,
          is_used,
          used_at,
          used_by_user_id
        )
      `)
      .order('created_at', { ascending: false });

    let testers = [];

    if (supabaseTesters && !error) {
      console.log(`✅ Found ${supabaseTesters.length} beta testers in Supabase`);
      testers = supabaseTesters.map(tester => ({
        id: tester.user_id,
        name: tester.full_name || tester.username,
        email: tester.email,
        status: tester.status || 'active',
        invitedAt: tester.created_at,
        totalReferrals: tester.total_referrals || 0,
        referralCodes: tester.referral_codes || [],
        onboardingCompleted: tester.onboarding_completed,
        notes: tester.profile_data?.notes || ''
      }));
    } else {
      console.warn('⚠️ No Supabase beta_testers data, falling back to Ganesha contacts');

      // Fallback to Ganesha contacts for initial data
      testers = ganeshaContacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        status: 'invited',
        invitedAt: contact.metadata?.invitedAt || new Date().toISOString(),
        totalReferrals: 0,
        referralCodes: [],
        onboardingCompleted: false,
        inviteCode: contact.metadata?.passcode,
        notes: contact.metadata?.notes || ''
      }));
    }

    console.log(`📋 Returning ${testers.length} beta testers to admin`);
    return NextResponse.json(testers);

  } catch (error) {
    console.error('❌ Failed to fetch beta testers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch beta testers' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/beta-testers
 * Add a new beta tester with automatic referral code generation
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, notes } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    console.log(`👤 Admin adding new beta tester: ${name} (${email})`);

    // Generate user ID
    const userId = `${name.toLowerCase().replace(/[^a-z]/g, '')}-${Date.now()}`;

    // Insert into beta_testers table
    const { data: tester, error } = await supabaseAdmin
      .from('beta_testers')
      .insert({
        user_id: userId,
        email: email,
        username: name,
        full_name: name,
        onboarding_completed: false,
        profile_data: { notes: notes || '' },
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating beta tester:', error);

      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create beta tester' },
        { status: 500 }
      );
    }

    console.log(`✅ Created beta tester: ${tester.user_id}`);

    // Generate referral codes
    const { generateReferralCodes } = await import('@/lib/auth/BetaAuth');
    const codes = await generateReferralCodes(userId, name, 10);

    console.log(`🎫 Generated ${codes.length} referral codes for ${name}`);

    return NextResponse.json({
      success: true,
      tester: {
        id: tester.user_id,
        name: tester.full_name,
        email: tester.email,
        status: tester.status,
        referralCodes: codes
      },
      message: `Added ${name} with ${codes.length} referral codes`
    });

  } catch (error: any) {
    console.error('❌ Failed to create beta tester:', error);
    return NextResponse.json(
      { error: 'Failed to create beta tester' },
      { status: 500 }
    );
  }
}
