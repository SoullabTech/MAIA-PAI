# GMAIL/GOOGLE CALENDAR QUICKSTART

**Get GANESHA scheduling to your actual calendar in ~10 minutes**

---

## WHAT YOU'LL GET

When you say: *"I can't get myself to start writing that blog post, please schedule it"*

GANESHA will **actually create events in your Google Calendar** that show up:
- ✅ In your Gmail calendar view
- ✅ On your phone (Google Calendar app)
- ✅ With popup reminders
- ✅ With supportive ADHD-friendly descriptions

Example events:
```
🐘 Step 1/4: Open writing app
Tomorrow 9:00 AM - 9:15 AM
Reminder: 5 minutes before

Description:
"GANESHA Micro-Step for: write blog post

This is step 1 of 4. Just do this one tiny thing.
That's the whole game.

🎯 Focus: Open writing app

✨ Celebrate when done - every micro-win is sacred!"
```

---

## SETUP (10 Minutes)

### Step 1: Create Google Cloud Project (3 min)

1. Go to: https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name it: `MAIA-GANESHA-Calendar`
4. Click "Create"

### Step 2: Enable Calendar API (1 min)

1. In your new project, click "Enable APIs and Services"
2. Search for: `Google Calendar API`
3. Click it → Click "Enable"

### Step 3: Create OAuth Credentials (3 min)

1. Go to: APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure consent screen:
   - User Type: **External**
   - App name: `GANESHA Calendar`
   - Your email address
   - Click "Save and Continue" through all steps
4. Back to Create OAuth client ID:
   - Application type: **Web application**
   - Name: `GANESHA Local Dev`
   - Authorized redirect URIs: Add this **exactly**:
     ```
     http://localhost:3000/api/auth/google/callback
     ```
   - Click "Create"
5. **Download the JSON** (click the download icon)
   - You'll see: `Client ID` and `Client secret`
   - Copy these somewhere safe

### Step 4: Get Your Refresh Token (3 min)

**Option A: Google OAuth Playground** (Easiest)

1. Go to: https://developers.google.com/oauthplayground/
2. Click the **gear icon** (top right) → Check ✅ "Use your own OAuth credentials"
3. Paste your:
   - OAuth Client ID: `(from Step 3)`
   - OAuth Client secret: `(from Step 3)`
4. In left panel, find: **Google Calendar API v3**
5. Select: `https://www.googleapis.com/auth/calendar`
6. Click "Authorize APIs"
7. Log in with your Gmail account
8. Click "Allow"
9. You'll see "Step 2" → Click "Exchange authorization code for tokens"
10. **Copy the `refresh_token`** (long string starting with `1//`)

### Step 5: Add to Environment Variables

Open `/Users/soullab/MAIA-PAI/.env.local` and add:

```env
# Google Calendar Integration (GANESHA)
GOOGLE_CALENDAR_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CALENDAR_CLIENT_SECRET=your-client-secret-here
GOOGLE_CALENDAR_REFRESH_TOKEN=1//your-refresh-token-here
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

Replace the values with your actual credentials from Steps 3 and 4.

### Step 6: Restart the Dev Server

```bash
# Kill current server
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

You should see:
```
[CALENDAR TOOL] ✅ Google Calendar configured
```

---

## TEST IT!

### Test 1: Direct API

```bash
curl -X POST http://localhost:3000/api/ganesha/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I cant start writing my blog post, can you schedule time for it?",
    "userId": "your_user_id",
    "userName": "Your Name"
  }'
```

Check your **Google Calendar** (gmail.com → Calendar) - you should see:
- 🐘 Events scheduled
- With GANESHA's supportive descriptions

### Test 2: In the GANESHA UI

1. Go to: http://localhost:3000/ganesha
2. Say: *"I'm stuck on this project, can you break it down and schedule it?"*
3. GANESHA will:
   - Detect the executive function block
   - Break into micro-steps
   - **Ask you what time works** (respects sovereignty!)
   - Create actual calendar events

---

## WHAT GANESHA CAN SCHEDULE

### 1. Micro-Steps from Task Breakdown
**You:** "I can't get myself to clean my office, schedule it"
**GANESHA:** Creates 4-5 micro-step events spread across the day

### 2. Focus Blocks for Hyperfocus
**You:** "I need 2 hours of uninterrupted focus time tomorrow"
**GANESHA:** Blocks calendar + sets halfway reminder for water/body check

### 3. Recurring Reminders
**You:** "Remind me to take my meds every day at 9am"
**GANESHA:** Creates daily recurring event

### 4. Custom Events
**You:** "Schedule a planning session Friday 2pm"
**GANESHA:** Creates single event with ADHD-friendly buffer time

---

## TROUBLESHOOTING

**"Error: invalid_grant"**
→ Refresh token expired. Get a new one via OAuth Playground (Step 4)

**Events not showing up in calendar**
→ Check which Google account you authorized in Step 4. Must match the calendar you're viewing.

**"Calendar tool not configured" warning**
→ Double-check `.env.local` has all 4 variables with correct values

**Wrong timezone**
→ Edit `lib/consciousness/ganesha/tools/CalendarTool.ts` line ~84:
```typescript
timeZone: 'America/Los_Angeles', // Change to your timezone
```

**Want to use a different calendar**
→ Change `calendarId: 'primary'` to your calendar ID in CalendarTool.ts

---

## SECURITY NOTES

✅ **Safe to use:**
- Only YOU authorized your calendar
- Refresh token stored locally in `.env.local` (not committed to git)
- GANESHA can only create/read events, not delete or modify existing ones

🛡️ **To revoke access anytime:**
1. Go to: https://myaccount.google.com/permissions
2. Find "GANESHA Calendar" → Remove access
3. Delete refresh token from `.env.local`

---

## NEXT: MULTI-USER MODE (Future)

Current setup: **Single calendar** (your personal Gmail calendar)

For production (multiple users):
1. Each user authorizes their own calendar
2. Refresh tokens stored in Supabase (per userId)
3. OAuth flow built into onboarding
4. Calendar preferences in user profile

But for **your personal use right now**, this setup is perfect! 🐘✨

---

**The elephant is ready to schedule. Let's remove some obstacles.** 🐘📅⚡
