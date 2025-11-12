/**
 * Google OAuth Authorization Flow - Step 2 (Callback - JSON Response)
 *
 * Handles the callback from Google after user authorizes
 * Returns JSON with tokens for easier debugging
 */

import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json(
      { error: `Authorization failed: ${error}` },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code received' },
      { status: 400 }
    );
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CALENDAR_CLIENT_ID,
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
      'http://localhost:3000/api/auth/google/callback-json'
    );

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    return NextResponse.json({
      success: true,
      tokens: {
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token?.substring(0, 20) + '...',
        scope: tokens.scope,
        expiry_date: tokens.expiry_date,
      },
      instructions: [
        '1. Copy the refresh_token value below',
        '2. Add it to your .env.local file as GOOGLE_CALENDAR_REFRESH_TOKEN',
        '3. Restart your dev server',
      ]
    }, { status: 200 });

  } catch (error) {
    console.error('[GOOGLE AUTH] Error exchanging code for tokens:', error);
    return NextResponse.json(
      {
        error: 'Failed to exchange authorization code for tokens',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
