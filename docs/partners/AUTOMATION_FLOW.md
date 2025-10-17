# 🌀 Soullab Inside Partner Automation Flow

**Complete automation guide for partner onboarding — from invitation to meeting prep**

---

## Purpose

Move new Field Partners from *invitation → reflection → meeting prep* without manual tracking or administrative loops.

**Core Principle:** *The technology listens, so you can focus on the ceremony.*

---

## Architecture Overview

```
Partner identified
       ↓
   Create invite record
       ↓
   Send Prelude email
       ↓
   Partner opens link
       ↓
   Track viewing
       ↓
   Partner fills Prelude (with MAIA chat help)
       ↓
   Save responses
       ↓
   Notify team (Slack + Email)
       ↓
   Meeting reminder (day before)
       ↓
   Listening session
       ↓
   Design & build phase
```

---

## 1. Database Schema

### Table: `partners_invites`

```sql
CREATE TABLE partners_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Partner Info
  first_name TEXT NOT NULL,
  last_name TEXT,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || COALESCE(last_name, '')) STORED,
  email TEXT NOT NULL UNIQUE,

  -- Project Details
  project_name TEXT, -- e.g., "Astrology as Soul Curriculum"
  element_mix TEXT, -- e.g., "Aether / Water"
  role TEXT DEFAULT 'Field Partner (Pilot)',

  -- Invite Tracking
  invite_code TEXT UNIQUE NOT NULL, -- e.g., "loralee-crowder"
  invite_status TEXT DEFAULT 'pending', -- pending | sent | viewed | completed
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Meeting Info
  meeting_date TIMESTAMPTZ,
  meeting_notes TEXT,

  -- Metadata
  sent_from TEXT, -- e.g., "EO", "Kelly", "System"
  invite_type TEXT DEFAULT 'Soullab Inside Prelude',
  internal_notes TEXT
);

CREATE INDEX idx_partners_invites_email ON partners_invites(email);
CREATE INDEX idx_partners_invites_code ON partners_invites(invite_code);
CREATE INDEX idx_partners_invites_status ON partners_invites(invite_status);
CREATE INDEX idx_partners_invites_meeting ON partners_invites(meeting_date);

-- RLS Policies (Row Level Security)
ALTER TABLE partners_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do everything" ON partners_invites
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Partners can view their own invite" ON partners_invites
  FOR SELECT USING (email = auth.jwt() ->> 'email');
```

### Table: `partners_prelude_responses`

```sql
CREATE TABLE partners_prelude_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Link to invite
  invite_id UUID REFERENCES partners_invites(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL,

  -- Partner Info
  name TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Fire - The If
  what_is_calling TEXT,
  what_does_it_change TEXT,
  pulse_or_temperature TEXT,

  -- Water - The Why
  why_must_exist TEXT,
  what_is_ready_to_flow TEXT,
  who_enters_and_feels TEXT,

  -- Earth - The How
  grounded_tech_meaning TEXT,
  functions_needed TEXT,
  sustaining_resources TEXT,

  -- Air - The What
  voice_it_speaks TEXT,
  conversation_type TEXT,
  form_it_takes TEXT,

  -- Aether - The Is
  what_is_it TEXT,
  presence_it_carries TEXT,
  how_know_alive TEXT,

  -- Closing Reflection
  cosmos_line TEXT,

  -- Metadata
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,

  -- MAIA Chat Log (optional)
  chat_messages JSONB DEFAULT '[]'::jsonb
);

CREATE INDEX idx_prelude_responses_invite ON partners_prelude_responses(invite_id);
CREATE INDEX idx_prelude_responses_email ON partners_prelude_responses(email);
CREATE INDEX idx_prelude_responses_submitted ON partners_prelude_responses(submitted_at);

-- RLS Policies
ALTER TABLE partners_prelude_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do everything" ON partners_prelude_responses
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Partners can view their own responses" ON partners_prelude_responses
  FOR SELECT USING (email = auth.jwt() ->> 'email');
```

---

## 2. API Endpoints

### `POST /api/partners/send-invite`

**Purpose:** Create invite and send Prelude email

**Request Body:**
```json
{
  "name": "Loralee Crowder",
  "email": "loralee@example.com",
  "project_name": "Astrology as Soul Curriculum",
  "element_mix": "Aether / Water",
  "meeting_date": "2025-10-21T10:00:00-06:00",
  "sent_from": "EO",
  "internal_notes": "First pilot partner - astrology integration"
}
```

**Response:**
```json
{
  "success": true,
  "invite_id": "uuid",
  "invite_code": "loralee-crowder",
  "prelude_url": "https://soullab.life/partners/onboarding/prelude?invite=loralee-crowder"
}
```

**Implementation:**
```typescript
// /app/api/partners/send-invite/route.ts
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';
import { slugify } from '@/lib/utils';

export async function POST(request: Request) {
  const supabase = createClient();
  const data = await request.json();

  // Generate invite code
  const inviteCode = slugify(data.name);

  // Create invite record
  const { data: invite, error } = await supabase
    .from('partners_invites')
    .insert({
      first_name: data.name.split(' ')[0],
      last_name: data.name.split(' ').slice(1).join(' '),
      email: data.email,
      invite_code: inviteCode,
      project_name: data.project_name,
      element_mix: data.element_mix,
      meeting_date: data.meeting_date,
      sent_from: data.sent_from,
      internal_notes: data.internal_notes,
    })
    .select()
    .single();

  if (error) throw error;

  // Send Prelude email
  const preludeUrl = `https://soullab.life/partners/onboarding/prelude?invite=${inviteCode}`;

  await sendEmail({
    to: data.email,
    from: 'partnerships@soullab.life',
    subject: '✨ Your Soullab Inside Prelude — Preparing the Field',
    template: 'partner-prelude-invite',
    variables: {
      first_name: data.name.split(' ')[0],
      prelude_url: preludeUrl,
      project_name: data.project_name,
      element_mix: data.element_mix,
      meeting_date: formatDate(data.meeting_date),
    },
  });

  // Update invite status
  await supabase
    .from('partners_invites')
    .update({
      invite_status: 'sent',
      sent_at: new Date().toISOString(),
    })
    .eq('id', invite.id);

  // Notify team on Slack
  await notifySlack({
    channel: '#partners-intake',
    text: `🌱 Soullab Inside invite sent to *${data.name}*`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Partner:* ${data.name}\n*Project:* ${data.project_name}\n*Element:* ${data.element_mix}\n*Meeting:* ${formatDate(data.meeting_date)}\n\n<${preludeUrl}|View Prelude Link>`,
        },
      },
    ],
  });

  return Response.json({
    success: true,
    invite_id: invite.id,
    invite_code: inviteCode,
    prelude_url: preludeUrl,
  });
}
```

### `POST /api/partners/track-view`

**Purpose:** Track when partner opens Prelude page

**Request Body:**
```json
{
  "invite_code": "loralee-crowder"
}
```

**Implementation:**
```typescript
export async function POST(request: Request) {
  const supabase = createClient();
  const { invite_code } = await request.json();

  await supabase
    .from('partners_invites')
    .update({
      invite_status: 'viewed',
      viewed_at: new Date().toISOString(),
    })
    .eq('invite_code', invite_code)
    .eq('invite_status', 'sent'); // Only update if not already completed

  return Response.json({ success: true });
}
```

### `POST /api/partners/submit-prelude`

**Purpose:** Save Prelude responses and trigger notifications

**Request Body:**
```json
{
  "invite_code": "loralee-crowder",
  "name": "Loralee Crowder",
  "email": "loralee@example.com",
  "responses": {
    "fire": { ... },
    "water": { ... },
    "earth": { ... },
    "air": { ... },
    "aether": { ... },
    "closing": "..."
  },
  "chat_messages": [ ... ]
}
```

**Implementation:**
```typescript
export async function POST(request: Request) {
  const supabase = createClient();
  const data = await request.json();

  // Get invite
  const { data: invite } = await supabase
    .from('partners_invites')
    .select()
    .eq('invite_code', data.invite_code)
    .single();

  if (!invite) {
    return Response.json({ error: 'Invite not found' }, { status: 404 });
  }

  // Save prelude response
  const { data: response } = await supabase
    .from('partners_prelude_responses')
    .insert({
      invite_id: invite.id,
      invite_code: data.invite_code,
      name: data.name,
      email: data.email,
      ...data.responses,
      chat_messages: data.chat_messages || [],
    })
    .select()
    .single();

  // Update invite status
  await supabase
    .from('partners_invites')
    .update({
      invite_status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', invite.id);

  // Notify team
  await notifySlack({
    channel: '#partners-intake',
    text: `💫 Prelude received from *${data.name}*`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Partner:* ${data.name}\n*Project:* ${invite.project_name}\n*Element:* ${invite.element_mix}\n\n<https://soullab.life/admin/partners/prelude/${response.id}|View Responses>`,
        },
      },
    ],
  });

  // Email Kelly
  await sendEmail({
    to: 'kelly@soullab.life',
    from: 'partnerships@soullab.life',
    subject: `Partner Prelude Completed: ${data.name}`,
    template: 'partner-prelude-completed',
    variables: {
      partner_name: data.name,
      project_name: invite.project_name,
      element_mix: invite.element_mix,
      responses_url: `https://soullab.life/admin/partners/prelude/${response.id}`,
      meeting_date: formatDate(invite.meeting_date),
    },
  });

  return Response.json({ success: true, response_id: response.id });
}
```

---

## 3. Email Templates

### Template: `partner-prelude-invite`

**Subject:** ✨ Your Soullab Inside Prelude — Preparing the Field

**HTML Body:**
```html
<div style="font-family: 'Spectral', serif; color: #F8F3E9; background-color: #1B1F33; padding: 40px; max-width: 600px;">
  <h1 style="color: #E3B778; text-align: center;">Soullab Inside</h1>
  <p>Hi {{first_name}},</p>

  <p>We're honored to begin sensing your field together.</p>

  <p>Before our conversation, we invite you into a short reflection —
  the <strong>Soullab Inside Partner Prelude</strong>.</p>

  <p>It moves through the five elements — Fire, Water, Earth, Air, and Aether —
  to help us hear what your project most wants to become.</p>

  <ul style="list-style: none; padding: 0;">
    <li>🜂 Fire — what's calling to be built</li>
    <li>🜄 Water — why this work matters</li>
    <li>🜃 Earth — how it will take form</li>
    <li>🜁 Air — what experience it offers</li>
    <li>🜀 Aether — what it <em>is</em> when complete</li>
  </ul>

  <div style="text-align: center; margin: 30px 0;">
    <a href="{{prelude_url}}" style="display: inline-block; padding: 15px 30px; background-color: rgba(227, 183, 120, 0.2); border: 2px solid #E3B778; border-radius: 8px; color: #E3B778; text-decoration: none; font-weight: bold;">
      Open Your Prelude
    </a>
  </div>

  <p style="font-size: 14px; color: #B5A8C1;">
    No rush, no right answers — fragments and feelings are perfect.<br/>
    Your reflections flow privately into your workspace so we can<br/>
    begin our design conversation with listening, not logistics.
  </p>

  <hr style="border: none; border-top: 1px solid rgba(227, 183, 120, 0.3); margin: 30px 0;" />

  <p style="font-size: 14px; color: #B5A8C1;">
    <strong>Your Project:</strong> {{project_name}}<br/>
    <strong>Your Elemental Current:</strong> {{element_mix}}<br/>
    <strong>Meeting Date:</strong> {{meeting_date}}
  </p>

  <p style="font-size: 14px; font-style: italic; color: #B5A8C1;">
    Thank you for stepping into this first circle of Soullab Inside.<br/>
    We're shaping technology that honors the work you already hold.
  </p>

  <p style="margin-top: 30px;">
    With care,<br/>
    <strong>The Soullab Foundation</strong><br/>
    <em style="color: #D6A760;">We build digital spaces that listen.</em><br/>
    <a href="https://soullab.life/partners" style="color: #E3B778;">soullab.life/partners</a>
  </p>
</div>
```

### Template: `partner-prelude-completed`

**Subject:** Partner Prelude Completed: {{partner_name}}

**HTML Body:**
```html
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2>Prelude Completed</h2>

  <p><strong>{{partner_name}}</strong> has completed their Soullab Inside Prelude.</p>

  <p>
    <strong>Project:</strong> {{project_name}}<br/>
    <strong>Element:</strong> {{element_mix}}<br/>
    <strong>Meeting:</strong> {{meeting_date}}
  </p>

  <p>
    <a href="{{responses_url}}" style="display: inline-block; padding: 12px 24px; background-color: #E3B778; color: #1B1F33; text-decoration: none; border-radius: 6px; font-weight: bold;">
      View Full Responses
    </a>
  </p>

  <hr/>

  <h3>Preparation Notes</h3>
  <p>Review their responses before the listening session. Pay attention to:</p>
  <ul>
    <li>Fire section (what's calling) - the impulse and urgency</li>
    <li>Aether section (what it IS) - the essence beyond function</li>
    <li>Recurring themes across elements</li>
    <li>What they circle back to multiple times</li>
    <li>MAIA chat questions (if any) - shows areas of uncertainty</li>
  </ul>
</div>
```

---

## 4. Slack Integration

### Webhook Configuration

```typescript
// /lib/integrations/slack.ts
export async function notifySlack({
  channel,
  text,
  blocks,
}: {
  channel: string;
  text: string;
  blocks?: any[];
}) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('Slack webhook not configured');
    return;
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel,
      text,
      blocks,
    }),
  });
}
```

### Slack Channel: `#partners-intake`

**Purpose:** Real-time notifications for partner activity

**Messages:**
- 🌱 Invite sent (with prelude link)
- 👁️ Prelude viewed (partner opened page)
- 💫 Prelude completed (responses submitted)
- 📅 Meeting reminder (day before)
- ✅ Meeting completed (manual update)

---

## 5. Meeting Reminder Automation

### Supabase Edge Function (Cron Job)

```typescript
// supabase/functions/send-meeting-reminders/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Get meetings happening tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0, 0));
  const tomorrowEnd = new Date(tomorrow.setHours(23, 59, 59, 999));

  const { data: meetings } = await supabase
    .from('partners_invites')
    .select('*, partners_prelude_responses(*)')
    .eq('invite_status', 'completed')
    .gte('meeting_date', tomorrowStart.toISOString())
    .lte('meeting_date', tomorrowEnd.toISOString());

  for (const meeting of meetings || []) {
    // Send reminder email to Kelly
    await sendEmail({
      to: 'kelly@soullab.life',
      subject: `Tomorrow: Field Partner Session with ${meeting.full_name}`,
      template: 'partner-meeting-reminder',
      variables: {
        partner_name: meeting.full_name,
        project_name: meeting.project_name,
        element_mix: meeting.element_mix,
        meeting_time: formatDateTime(meeting.meeting_date),
        responses_url: `https://soullab.life/admin/partners/prelude/${meeting.partners_prelude_responses[0]?.id}`,
      },
    });

    // Post to Slack
    await notifySlack({
      channel: '#partners-intake',
      text: `📅 Reminder: Field Partner session tomorrow with ${meeting.full_name}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Tomorrow:* Field Partner Session\n*Partner:* ${meeting.full_name}\n*Project:* ${meeting.project_name}\n*Time:* ${formatDateTime(meeting.meeting_date)}\n\n<https://soullab.life/admin/partners/prelude/${meeting.partners_prelude_responses[0]?.id}|Review Responses>`,
          },
        },
      ],
    });
  }

  return new Response('Meeting reminders sent', { status: 200 });
});
```

**Cron Schedule:**
```sql
-- Run daily at 9 AM
SELECT cron.schedule(
  'partner-meeting-reminders',
  '0 9 * * *',
  'SELECT net.http_post(
    url:=''https://[project-ref].supabase.co/functions/v1/send-meeting-reminders'',
    headers:=''{"Authorization": "Bearer [anon-key]"}''::jsonb
  );'
);
```

---

## 6. Admin Dashboard

### View: `/admin/partners/prelude/[id]`

**Purpose:** Review partner responses before listening session

**Features:**
- Display all Prelude responses by element
- Highlight key phrases and recurring themes
- Show MAIA chat history (questions partner asked)
- Link to partner's invite record
- Export as PDF for note-taking during session

**UI Components:**
- Element-by-element accordion view
- Word cloud of frequent terms
- Timeline of completion (how long they spent)
- Notes field for Kelly to add pre-meeting observations

---

## 7. Monitoring & Metrics

### Dashboard Queries

```sql
-- Partner funnel
SELECT
  invite_status,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM partners_invites
GROUP BY invite_status
ORDER BY
  CASE invite_status
    WHEN 'completed' THEN 1
    WHEN 'viewed' THEN 2
    WHEN 'sent' THEN 3
    WHEN 'pending' THEN 4
  END;

-- Average completion time
SELECT
  AVG(EXTRACT(EPOCH FROM (completed_at - sent_at)) / 3600) as avg_hours_to_complete,
  MIN(EXTRACT(EPOCH FROM (completed_at - sent_at)) / 3600) as min_hours,
  MAX(EXTRACT(EPOCH FROM (completed_at - sent_at)) / 3600) as max_hours
FROM partners_invites
WHERE invite_status = 'completed';

-- Element distribution
SELECT
  element_mix,
  COUNT(*) as count
FROM partners_invites
WHERE element_mix IS NOT NULL
GROUP BY element_mix
ORDER BY count DESC;

-- MAIA chat engagement
SELECT
  COUNT(*) as total_responses,
  COUNT(*) FILTER (WHERE jsonb_array_length(chat_messages) > 0) as with_chat,
  AVG(jsonb_array_length(chat_messages)) as avg_chat_messages
FROM partners_prelude_responses;
```

---

## 8. Testing the Flow

### Test Checklist

1. **Create test invite**
   ```bash
   curl -X POST https://soullab.life/api/partners/send-invite \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Partner",
       "email": "test@example.com",
       "project_name": "Test Project",
       "element_mix": "Fire / Earth",
       "meeting_date": "2025-10-25T14:00:00Z",
       "sent_from": "Test"
     }'
   ```

2. **Verify email sent** (check test@example.com inbox)

3. **Open Prelude link** (should track view in database)

4. **Fill out form with MAIA chat** (test chat responses)

5. **Submit Prelude** (verify Slack notification + email to Kelly)

6. **Check admin dashboard** (responses visible)

7. **Verify meeting reminder** (run cron manually for tomorrow's date)

---

## 9. Deployment Steps

### Phase 1: Database Setup
1. Run Supabase migration with table schemas
2. Create RLS policies
3. Set up indexes

### Phase 2: API Routes
1. Create `/api/partners/send-invite`
2. Create `/api/partners/track-view`
3. Create `/api/partners/submit-prelude`
4. Test with curl/Postman

### Phase 3: Email Templates
1. Design HTML templates in email service (SendGrid/Resend)
2. Test rendering with sample data
3. Verify deliverability

### Phase 4: Slack Integration
1. Create Slack webhook URL
2. Add to environment variables
3. Test notifications

### Phase 5: Admin Dashboard
1. Build `/admin/partners/prelude/[id]` view
2. Add authentication (Supabase RLS)
3. Test with sample data

### Phase 6: Cron Jobs
1. Deploy Supabase Edge Function for reminders
2. Set up cron schedule
3. Test with near-future meeting

### Phase 7: Production Test
1. Send real invite to Kelly's test email
2. Complete full flow
3. Verify all notifications work

---

## 10. Future Enhancements

- **Notion Integration:** Auto-create partner cards in Notion database
- **Calendar Integration:** Add meeting to Google Calendar automatically
- **Analytics Dashboard:** Track completion rates, time to complete, element preferences
- **MAIA Chat Insights:** Analyze common questions to improve Prelude wording
- **Quarterly Check-ins:** Automated follow-up emails to active partners
- **Partner Portal:** Private dashboard where partners can see their responses and project progress

---

*This automation ensures every Field Partner follows the same rhythm: one link, one ritual, one clean pipeline from reflection → intake → design session.*

**The structure breathes. The fire is tended. Let the ceremonies begin.** 🔥
