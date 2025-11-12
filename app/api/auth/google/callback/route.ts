/**
 * Google OAuth Authorization Flow - Step 2 (Callback)
 *
 * Handles the callback from Google after user authorizes
 * Exchanges the authorization code for tokens and displays the refresh token
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
      process.env.GOOGLE_CALENDAR_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
    );

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Return HTML page showing the refresh token
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>GANESHA Calendar - Authorization Success!</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #4285f4;
      margin-bottom: 20px;
    }
    .success {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .token-box {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 15px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      word-break: break-all;
      margin: 10px 0;
    }
    .instructions {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    button {
      background: #4285f4;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    button:hover {
      background: #357ae8;
    }
    .code {
      background: #272822;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🐘 GANESHA Calendar - Authorization Successful!</h1>

    <div class="success">
      ✅ You've successfully authorized GANESHA to access your Google Calendar!
    </div>

    <h2>Your Refresh Token:</h2>
    <div class="token-box" id="refreshToken" style="white-space: nowrap; overflow-x: auto;">${tokens.refresh_token || 'Not received - try authorizing again'}</div>
    <button onclick="copyToken()">📋 Copy Refresh Token</button>

    <p><strong>Plain text (easier to copy):</strong></p>
    <textarea readonly style="width: 100%; height: 80px; font-family: monospace; font-size: 12px;">${tokens.refresh_token || 'Not received'}</textarea>

    <div class="instructions">
      <h3>Next Steps:</h3>
      <ol>
        <li>Copy the refresh token above</li>
        <li>Add it to your <code>.env.local</code> file:
          <div class="code">
GOOGLE_CALENDAR_REFRESH_TOKEN=${tokens.refresh_token || 'YOUR_REFRESH_TOKEN_HERE'}
          </div>
        </li>
        <li>Restart your dev server: <code>npm run dev</code></li>
        <li>GANESHA will now be able to create actual calendar events! 🎉</li>
      </ol>
    </div>

    <h3>Debug Info:</h3>
    <pre>${JSON.stringify({
      hasRefreshToken: !!tokens.refresh_token,
      hasAccessToken: !!tokens.access_token,
      scope: tokens.scope,
      expiresIn: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'N/A'
    }, null, 2)}</pre>
  </div>

  <script>
    function copyToken() {
      const token = document.getElementById('refreshToken').textContent;
      navigator.clipboard.writeText(token).then(() => {
        alert('✅ Refresh token copied to clipboard!');
      });
    }
  </script>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });

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
