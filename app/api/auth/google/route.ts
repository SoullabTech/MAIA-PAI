/**
 * Google OAuth Authorization Flow - Step 1
 *
 * Initiates the OAuth flow by redirecting to Google's consent screen
 */

import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    process.env.GOOGLE_CALENDAR_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent', // Force consent screen to get refresh token
    // Add state parameter to prevent CSRF
    state: 'ganesha_calendar_auth',
  });

  return NextResponse.redirect(authUrl);
}
