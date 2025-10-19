import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Beta invitation codes - sacred portals
const VALID_INVITE_CODES = [
  // Beta Tester Codes - All 40 testers
  'SOULLAB-ANDREAFAGAN',
  'SOULLAB-ANDREA',
  'SOULLAB-ANGELA',
  'SOULLAB-AUGUSTEN',
  'SOULLAB-CECE',
  'SOULLAB-CYNTHY',
  'SOULLAB-DOUG',
  'SOULLAB-JASON',
  'SOULLAB-JONDI',
  'SOULLAB-JULIE',
  'SOULLAB-JUSTIN',
  'SOULLAB-KIMBERLY',
  'SOULLAB-KRISTEN',
  'SOULLAB-LEONARD',
  'SOULLAB-LORALEE',
  'SOULLAB-MEAGAN',
  'SOULLAB-NATHAN',
  'SOULLAB-NINA',
  'SOULLAB-PATRICK',
  'SOULLAB-RICK',
  'SOULLAB-ROMEO',
  'SOULLAB-SOPHIE',
  'SOULLAB-STEPHEN',
  'SOULLAB-SUSAN',
  'SOULLAB-TAMARA',
  'SOULLAB-TRAVIS',
  'SOULLAB-WEEZIE',
  'SOULLAB-ZSUZSANNA',
  'SOULLAB-WHITEY',
  'SOULLAB-KOREY',
  'SOULLAB-KAREN',
  'SOULLAB-NATASHA',
  'SOULLAB-CATHERINE',
  'SOULLAB-THEA',
  'SOULLAB-VIRGINIA',
  'SOULLAB-JOSEPH',
  'SOULLAB-ANNA',
  'SOULLAB-YVONNE',
  'SOULLAB-DAVID',
  'SOULLAB-RISAKO',
  'SOULLAB-MARC',
  'SOULLAB-KELLY',
  'SOULLAB-JUDE',  // Jude Epstein - Beta Tester

  // Founder access
  'SOULLAB'
];

export async function POST(request: Request) {
  try {
    const { code, name } = await request.json();

    if (!code) {
      return NextResponse.json(
        { message: 'Please enter an invitation code' },
        { status: 400 }
      );
    }

    // Normalize the code (uppercase, trim whitespace)
    const normalizedCode = code.trim().toUpperCase();

    // Check if code is valid
    if (VALID_INVITE_CODES.includes(normalizedCode)) {
      const welcomeMessage = name
        ? `Welcome, ${name}.`
        : 'Welcome.';

      // IMMEDIATELY save user to database when code is validated
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const userId = randomUUID();
        const userName = name || normalizedCode.split('-')[1] || 'Explorer';

        // Save to explorers table immediately
        const { error: saveError } = await supabase
          .from('explorers')
          .upsert({
            explorer_id: userId,
            explorer_name: userName,
            invitation_code: normalizedCode,
            status: 'invited', // Will be updated to 'active' when they complete onboarding
            signup_date: new Date().toISOString(),
            beta_onboarded: false
          }, {
            onConflict: 'invitation_code'
          });

        if (saveError) {
          console.error('❌ Failed to save user on code validation:', saveError);
        } else {
          console.log(`✅ User saved to database: ${userName} (${normalizedCode})`);
        }

        return NextResponse.json({
          valid: true,
          message: welcomeMessage,
          code: normalizedCode,
          userId: userId
        });
      } catch (dbError) {
        console.error('❌ Database error during code validation:', dbError);
        // Still return success for the code validation even if DB fails
        return NextResponse.json({
          valid: true,
          message: welcomeMessage,
          code: normalizedCode
        });
      }
    }

    // Invalid code
    return NextResponse.json(
      {
        valid: false,
        message: 'This invitation code is not recognized.'
      },
      { status: 401 }
    );
    
  } catch (error) {
    console.error('Invite validation error:', error);
    return NextResponse.json(
      { message: 'Unable to validate invitation. Please try again.' },
      { status: 500 }
    );
  }
}
