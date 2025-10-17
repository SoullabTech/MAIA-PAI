# Soullab Inside Backend Setup Guide

Complete setup instructions for the Partner automation system.

---

## Prerequisites

- ✅ Supabase project (already configured)
- ✅ Resend API key (already in .env.local)
- ⏳ Slack webhook (needs setup)
- ⏳ Admin email configured

---

## Step 1: Run Database Migration

### Via Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: `jkbetmadzcpoinjogkli`
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy the contents of `supabase/migrations/20251017_create_partners_tables.sql`
6. Paste into SQL Editor
7. Click **Run** (or `Cmd+Enter`)

### Verify Tables Created

Run this query to check:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'partners_%';
```

You should see:
- `partners_invites`
- `partners_prelude_responses`

---

## Step 2: Configure Slack Webhook

### Create Webhook

1. Go to https://api.slack.com/apps
2. Click **Create New App** → **From scratch**
3. App Name: `Soullab Partners Bot`
4. Workspace: Your Soullab workspace
5. Click **Create App**

### Enable Incoming Webhooks

1. In sidebar, click **Incoming Webhooks**
2. Toggle **Activate Incoming Webhooks** to ON
3. Click **Add New Webhook to Workspace**
4. Select channel: `#partners-intake` (create if it doesn't exist)
5. Click **Allow**

### Copy Webhook URL

1. Copy the webhook URL (looks like `https://hooks.slack.com/services/T.../B.../xxx`)
2. Add to `.env.local`:
   ```bash
   SLACK_WEBHOOK_PARTNERS=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

### Test Webhook

```bash
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H "Content-Type: application/json" \
  -d '{
    "text": "🌀 Test: Soullab Partners Bot is connected",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Test Message*\nIf you see this, the webhook is working!"
        }
      }
    ]
  }'
```

You should see the message appear in #partners-intake.

---

## Step 3: Configure Admin Email

### Update Environment Variable

In `.env.local`, verify or add:
```bash
ADMIN_EMAIL=kelly@soullab.life
```

This email receives notifications when partners complete their Prelude.

---

## Step 4: Verify Resend Email Setup

### Check API Key

Your `.env.local` already has:
```bash
RESEND_API_KEY=re_BaKeypwd_4ZVYiMsitvEzXRWudUCNy7yS
```

### Verify Domain

1. Go to https://resend.com/domains
2. Check if `soullab.life` is verified
3. If not, add domain and verify DNS records:
   - SPF record
   - DKIM records
   - DMARC record

### Set Sending Email

Emails will be sent from:
```
Soullab Foundation <partnerships@soullab.life>
```

Make sure this email is configured in Resend:
1. Go to https://resend.com/emails
2. Add sender: `partnerships@soullab.life`
3. Verify if required

### Test Email Send

```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_BaKeypwd_4ZVYiMsitvEzXRWudUCNy7yS' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "Soullab Foundation <partnerships@soullab.life>",
    "to": ["kelly@soullab.life"],
    "subject": "Test: Soullab Partners Email",
    "html": "<p>If you receive this, email sending is working!</p>"
  }'
```

---

## Step 5: Test API Endpoints Locally

### Start Dev Server

```bash
npm run dev
```

### Test Send Invite

```bash
curl -X POST http://localhost:3000/api/partners/send-invite \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Partner",
    "email": "test@example.com",
    "project_name": "Test Project",
    "element_mix": "Fire / Water",
    "meeting_date": "2025-10-25T14:00:00Z",
    "sent_from": "Manual Test"
  }'
```

Expected response:
```json
{
  "success": true,
  "invite_id": "uuid",
  "invite_code": "test-partner",
  "prelude_url": "https://soullab.life/partners/onboarding/prelude?invite=test-partner",
  "message": "Invite sent successfully"
}
```

### Check Database

```sql
SELECT * FROM partners_invites ORDER BY created_at DESC LIMIT 1;
```

### Check Email Inbox

Check `test@example.com` inbox for Prelude invite.

### Check Slack

Check #partners-intake for notification.

---

## Step 6: Test Complete Flow

### 1. Send Real Invite to Yourself

```bash
curl -X POST http://localhost:3000/api/partners/send-invite \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kelly Nezat",
    "email": "kelly@soullab.life",
    "project_name": "Test Automation Flow",
    "element_mix": "Aether / Earth",
    "meeting_date": "2025-10-22T10:00:00-06:00",
    "sent_from": "System Test"
  }'
```

### 2. Open Prelude Link

1. Check your email
2. Click "Open Your Prelude" button
3. Should track view in database:
   ```sql
   SELECT invite_status, viewed_at
   FROM partners_invites
   WHERE email = 'kelly@soullab.life';
   ```
   Status should change from `sent` → `viewed`

### 3. Fill Out Prelude Form

1. Fill in at least Fire and Aether sections
2. Click "Submit Reflection"
3. Should see success message: "Beautiful. Your reflections are now part of the field."

### 4. Verify Database

```sql
-- Check invite completed
SELECT invite_status, completed_at
FROM partners_invites
WHERE email = 'kelly@soullab.life';

-- Check responses saved
SELECT
  name,
  what_is_calling,
  what_is_it,
  submitted_at
FROM partners_prelude_responses
WHERE email = 'kelly@soullab.life'
ORDER BY submitted_at DESC
LIMIT 1;
```

### 5. Check Notifications

- ✅ Email to kelly@soullab.life with "Partner Prelude Completed"
- ✅ Slack message in #partners-intake with completion notice

---

## Step 7: Send Real Invite to Loralee

### Create Loralee's Invite

```bash
curl -X POST http://localhost:3000/api/partners/send-invite \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Loralee Crowder",
    "email": "loralee@example.com",
    "project_name": "Astrology as Soul Curriculum",
    "element_mix": "Aether / Water",
    "meeting_date": "2025-10-21T10:00:00-06:00",
    "sent_from": "Kelly",
    "internal_notes": "First pilot partner - astrology integration with Spiralogic Oracle"
  }'
```

### Verify Invite Sent

1. Check database:
   ```sql
   SELECT * FROM partners_invites WHERE email = 'loralee@example.com';
   ```

2. Check email inbox (loralee@example.com)

3. Check Slack #partners-intake

### Send to Loralee

1. Update `"email": "loralee@example.com"` to her real email
2. Run the curl command again
3. She'll receive the Prelude invitation

---

## Step 8: Build Admin Dashboard (Optional for Monday)

You can manually review responses in Supabase for now:

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select `partners_prelude_responses`
4. Filter by email or invite_code

Or run SQL queries:

```sql
-- View Loralee's responses
SELECT
  name,
  submitted_at,
  what_is_calling,
  what_does_it_change,
  pulse_or_temperature,
  what_is_it,
  presence_it_carries
FROM partners_prelude_responses
WHERE invite_code = 'loralee-crowder';
```

---

## Step 9: Meeting Reminder (Future - Not Critical for Monday)

Meeting reminders will be automated via Supabase Edge Function.

### Create Edge Function

```bash
# Not needed immediately - can set up after first session
```

For now, you can manually check upcoming meetings:

```sql
SELECT * FROM get_upcoming_partner_meetings(1);
```

---

## Troubleshooting

### Emails Not Sending

1. Check Resend dashboard: https://resend.com/emails
2. Verify API key is correct
3. Check sender email is verified
4. Look for error logs in terminal

### Slack Notifications Not Working

1. Verify webhook URL is correct
2. Test webhook with curl command above
3. Check #partners-intake channel exists
4. Check webhook permissions

### Database Errors

1. Verify migration ran successfully
2. Check RLS policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename LIKE 'partners_%';
   ```
3. Verify service role key is correct

### API Endpoints Failing

1. Check terminal for error logs
2. Verify environment variables are loaded (restart dev server)
3. Test with curl to see full error response
4. Check Supabase connection

---

## Environment Variables Checklist

Required for Partner system to work:

- [x] `NEXT_PUBLIC_SUPABASE_URL` ✅
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- [x] `SUPABASE_SERVICE_ROLE_KEY` ✅
- [x] `RESEND_API_KEY` ✅
- [ ] `SLACK_WEBHOOK_PARTNERS` ⏳ (needs setup)
- [x] `ADMIN_EMAIL` ✅
- [x] `NEXT_PUBLIC_SITE_URL` ✅

---

## Production Deployment

### Vercel Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all variables from `.env.local`:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `SLACK_WEBHOOK_PARTNERS`
   - `ADMIN_EMAIL`

### Deploy

```bash
git push origin main
```

Vercel will automatically deploy.

### Test Production

Use production URL in curl commands:
```bash
curl -X POST https://soullab.life/api/partners/send-invite \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## Quick Start (TL;DR)

1. ✅ Run database migration in Supabase SQL Editor
2. ⏳ Set up Slack webhook → add to `.env.local`
3. ✅ Verify Resend email sending works
4. ✅ Test locally with curl commands
5. ✅ Send test invite to yourself
6. ✅ Fill out Prelude form
7. ✅ Verify notifications (email + Slack)
8. ✅ Send real invite to Loralee
9. 🎉 Review her responses before Monday

---

**The automation is ready. The ceremony begins.** 🔥
