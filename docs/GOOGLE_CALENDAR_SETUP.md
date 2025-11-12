# GOOGLE CALENDAR OAUTH SETUP

**For GANESHA Calendar Automation (Phase 2)**

---

## OVERVIEW

GANESHA's calendar tools can operate in two modes:

1. **SIMULATION MODE** (default) - Logs what would be scheduled, no actual calendar access
2. **LIVE MODE** - Actually creates events in user's Google Calendar via OAuth

---

## CURRENT STATUS

✅ **SIMULATION MODE ACTIVE** - All calendar tools are functional and will log scheduled events.

The system will work WITHOUT Google Calendar credentials. When calendar tools are called, they will:
- Log the event details to console
- Return simulated event IDs
- Show what WOULD have been scheduled

This is perfect for:
- Development/testing
- Users who don't want calendar integration yet
- Demonstrating the automation flow

---

## ENABLING LIVE MODE (Optional)

To enable ACTUAL Google Calendar integration:

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "MAIA-GANESHA-Calendar"
3. Enable Google Calendar API:
   - APIs & Services → Enable APIs
   - Search "Google Calendar API"
   - Click Enable

### Step 2: Create OAuth Credentials

1. APIs & Services → Credentials
2. Create Credentials → OAuth client ID
3. Application type: **Web application**
4. Name: "GANESHA Calendar Integration"
5. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/google/callback
   https://yourdomain.com/api/auth/google/callback
   ```
6. Download credentials JSON

### Step 3: Get Refresh Token

You'll need to do a one-time OAuth flow to get a refresh token.

**Option A: Use Google OAuth Playground**

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click gear icon → Check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. In "Step 1 - Select & Authorize APIs":
   - Find "Google Calendar API v3"
   - Select `https://www.googleapis.com/auth/calendar`
5. Click "Authorize APIs"
6. Log in with Google account
7. In "Step 2 - Exchange authorization code for tokens":
   - Click "Exchange authorization code for tokens"
   - Copy the **refresh_token**

**Option B: Build Auth Flow** (For production)

Create `/app/api/auth/google/route.ts`:
```typescript
// Initiates OAuth flow
export async function GET() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    'http://localhost:3000/api/auth/google/callback'
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });

  return NextResponse.redirect(authUrl);
}
```

Create `/app/api/auth/google/callback/route.ts`:
```typescript
// Handles OAuth callback
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    'http://localhost:3000/api/auth/google/callback'
  );

  const { tokens } = await oauth2Client.getToken(code!);

  console.log('REFRESH TOKEN:', tokens.refresh_token);

  return NextResponse.json({
    message: 'Auth successful! Add this refresh_token to your .env.local',
    refresh_token: tokens.refresh_token
  });
}
```

Then visit: `http://localhost:3000/api/auth/google`

### Step 4: Add Environment Variables

Add to `.env.local`:

```env
# Google Calendar Integration
GOOGLE_CALENDAR_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CALENDAR_CLIENT_SECRET=your-client-secret
GOOGLE_CALENDAR_REFRESH_TOKEN=your-refresh-token
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### Step 5: Restart Server

```bash
npm run dev
```

You should see:
```
[CALENDAR TOOL] ✅ Google Calendar configured
```

---

## HOW IT WORKS

### Simulation Mode (No credentials)

```typescript
await createEvent(userId, {
  title: "🐘 Step 1: Open file",
  start: new Date(),
  end: new Date(Date.now() + 15 * 60000),
});

// Logs:
// [CALENDAR TOOL] 📅 SIMULATED EVENT CREATION:
//   Title: 🐘 Step 1: Open file
//   Start: 2025-11-08T10:00:00.000Z
//   End: 2025-11-08T10:15:00.000Z
//   Simulated Event ID: sim_1699459200000_abc123
```

### Live Mode (With credentials)

```typescript
// Actually creates Google Calendar event
// Returns real event ID from Google
// Shows up in user's calendar immediately
```

---

## TESTING

### Test Simulation Mode

```bash
curl -X POST http://localhost:3000/api/ganesha/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I can'"'"'t get myself to start writing and I need help scheduling it",
    "userId": "test_user_123",
    "userName": "Test User"
  }'
```

Expected behavior:
- GANESHA breaks down task
- Detects "scheduling" request
- Calls `schedule_micro_steps` tool
- Logs simulated calendar events to console
- Response includes: "✅ Obstacle removed! I've scheduled all 4 micro-steps..."

### Test Live Mode

Same test, but now:
- Events appear in your actual Google Calendar
- You'll receive Google Calendar notifications
- Event titles start with 🐘 emoji
- Descriptions include GANESHA's supportive language

---

## SECURITY NOTES

1. **Never commit credentials to git**
   - `.env.local` is in `.gitignore`
   - Use environment variables in production

2. **Refresh tokens are long-lived**
   - Store securely
   - Rotate periodically
   - Can be revoked at: https://myaccount.google.com/permissions

3. **Per-user OAuth** (Future enhancement)
   - Current setup: Single calendar (GANESHA's or admin's)
   - Production: Each user authorizes their own calendar
   - Requires storing refresh tokens per userId in database

---

## TROUBLESHOOTING

**"Google Calendar not configured" warning**

→ Expected! System is in SIMULATION mode. Add credentials to enable live mode.

**"Error creating event: invalid_grant"**

→ Refresh token expired. Get a new one via OAuth flow.

**Events not appearing in calendar**

→ Check timezone setting in CalendarTool.ts (currently hardcoded to America/Los_Angeles)

**"Calendar tool working but events scheduled at wrong time"**

→ Update default scheduling logic in GaneshaAgent.ts (currently defaults to "tomorrow 9am")

---

## NEXT STEPS

**Phase 2 Complete**: ✅ Calendar tools working in simulation mode

**Phase 3**: Proactive check-ins (cron jobs, hyperfocus monitoring)

**Phase 4**: Per-user OAuth (database-backed refresh tokens)

**Phase 5**: Calendar UI (show scheduled events in GANESHA page)

---

**The elephant doesn't just remember. The elephant SCHEDULES.** 🐘📅✨
