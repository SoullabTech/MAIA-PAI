import { NextRequest, NextResponse } from 'next/server';
import { sendBatchInvitesWithPasscodes, sendBetaInviteWithPasscode } from '@/lib/email/sendBetaInviteWithPasscode';
import betaUsers from '@/data/beta-users-complete.json';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode = 'all', email, template = 'beta-passcode' } = body;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not configured. Add to .env.local'
      }, { status: 500 });
    }

    // Send to specific user
    if (mode === 'single' && email) {
      const user = betaUsers.users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found in beta users list'
        }, { status: 404 });
      }

      const result = await sendBetaInviteWithPasscode(user, template);
      return NextResponse.json(result);
    }

    // Send to all users
    if (mode === 'all') {
      const result = await sendBatchInvitesWithPasscodes(
        betaUsers.users,
        template,
        2000 // 2 second delay between emails
      );

      return NextResponse.json({
        success: result.successful > 0,
        ...result
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid mode. Use "single" with email or "all"'
    }, { status: 400 });

  } catch (error: any) {
    console.error('Passcode API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}