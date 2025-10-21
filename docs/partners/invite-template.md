# Soullab Inside — Partner Prelude Invite Template

For use with `/send-invites` system

---

## Email Template

**Subject:** ✨ Your Soullab Inside Prelude — Preparing the Field

**Body:**

```
Hi {{first_name}},

We're honored to begin sensing your field together.

Before our conversation, we invite you into a short reflection —
the **Soullab Inside Partner Prelude**.
It moves through the five elements — Fire, Water, Earth, Air, and Aether —
to help us hear what your project most wants to become.

🜂 Fire — what's calling to be built
🜄 Water — why this work matters
🜃 Earth — how it will take form
🜁 Air — what experience it offers
🜀 Aether — what it *is* when complete

You can open your personal link here:
👉 {{prelude_url}}

No rush, no right answers — fragments and feelings are perfect.
Your reflections flow privately into your workspace so we can
begin our design conversation with listening, not logistics.

---

**Your Project:** {{project_name}}
**Your Elemental Current:** {{element_mix}}
**Meeting Date:** {{meeting_date}}

Thank you for stepping into this first circle of Soullab Inside.
We're shaping technology that honors the work you already hold.

With care,
The Soullab Foundation
*We build digital spaces that listen.*
https://soullab.life/partners
```

---

## Template Variables

**Available for substitution:**

| Variable | Example | Source |
|----------|---------|--------|
| `{{first_name}}` | "Loralee" | partners_invites.name (split first name) |
| `{{invite_slug}}` | "loralee-crowder" | partners_invites.invite_code |
| `{{prelude_url}}` | "https://soullab.life/partners/onboarding/prelude?invite=loralee-crowder" | Generated from invite_code |
| `{{project_name}}` | "Astrology as Soul Curriculum" | partners_invites.project |
| `{{element_mix}}` | "Aether / Water" | partners_invites.element |
| `{{meeting_date}}` | "Monday, Oct 21 2025 @ 10 AM MT" | partners_invites.meeting_date |

---

## Database Schema

### Table: `partners_invites`

```sql
CREATE TABLE partners_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Partner Info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL, -- e.g., "loralee-crowder"

  -- Project Details
  project TEXT, -- e.g., "Astrology as Soul Curriculum"
  element TEXT, -- e.g., "Aether / Water"
  role TEXT DEFAULT 'Field Partner (Pilot)',

  -- Meeting Info
  meeting_date TIMESTAMPTZ,
  meeting_notes TEXT,

  -- Status Tracking
  invite_status TEXT DEFAULT 'pending', -- pending | sent | viewed | completed
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Metadata
  sent_from TEXT, -- e.g., "EO", "Kelly", "System"
  invite_type TEXT DEFAULT 'Soullab Inside Prelude'
);

CREATE INDEX idx_partners_invites_email ON partners_invites(email);
CREATE INDEX idx_partners_invites_code ON partners_invites(invite_code);
CREATE INDEX idx_partners_invites_status ON partners_invites(invite_status);
```

### Table: `partners_prelude_responses`

```sql
CREATE TABLE partners_prelude_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Link to invite
  invite_id UUID REFERENCES partners_invites(id),
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

  -- Closing
  cosmos_line TEXT,

  -- Metadata
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_prelude_responses_invite ON partners_prelude_responses(invite_id);
CREATE INDEX idx_prelude_responses_email ON partners_prelude_responses(email);
```

---

## Automation Flow

### Step 1: Create Invite

```javascript
// In your admin panel or API
const invite = await supabase
  .from('partners_invites')
  .insert({
    name: 'Loralee Crowder',
    email: 'loralee@example.com',
    invite_code: 'loralee-crowder',
    project: 'Astrology as Soul Curriculum',
    element: 'Aether / Water',
    role: 'Field Partner (Pilot)',
    meeting_date: '2025-10-21T10:00:00-06:00',
    sent_from: 'EO',
    invite_type: 'Soullab Inside Prelude'
  })
  .select()
  .single();
```

### Step 2: Send Email

```javascript
// Via SendGrid, Resend, or Supabase Edge Function
const emailData = {
  to: invite.email,
  from: 'partnerships@soullab.life',
  subject: '✨ Your Soullab Inside Prelude — Preparing the Field',
  html: renderTemplate('partner-prelude-invite', {
    first_name: invite.name.split(' ')[0],
    invite_slug: invite.invite_code,
    prelude_url: `https://soullab.life/partners/onboarding/prelude?invite=${invite.invite_code}`,
    project_name: invite.project,
    element_mix: invite.element,
    meeting_date: formatDate(invite.meeting_date)
  })
};

await sendEmail(emailData);

// Update invite status
await supabase
  .from('partners_invites')
  .update({
    invite_status: 'sent',
    sent_at: new Date().toISOString()
  })
  .eq('id', invite.id);
```

### Step 3: Track Viewing

```javascript
// When partner opens prelude page
// In /app/partners/onboarding/prelude/page.tsx useEffect

useEffect(() => {
  if (inviteCode) {
    fetch('/api/partners/track-view', {
      method: 'POST',
      body: JSON.stringify({ invite_code: inviteCode })
    });
  }
}, [inviteCode]);
```

```javascript
// API route: /api/partners/track-view
export async function POST(request) {
  const { invite_code } = await request.json();

  await supabase
    .from('partners_invites')
    .update({
      invite_status: 'viewed',
      viewed_at: new Date().toISOString()
    })
    .eq('invite_code', invite_code)
    .eq('invite_status', 'sent'); // Only update if not already completed

  return new Response('OK');
}
```

### Step 4: Handle Submission

```javascript
// When partner submits prelude form
// In /app/partners/onboarding/prelude/page.tsx handleSubmit

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Save prelude response
    const { data: response } = await supabase
      .from('partners_prelude_responses')
      .insert({
        invite_code: formData.inviteCode,
        name: formData.name,
        email: formData.email,
        what_is_calling: formData.whatIsCalling,
        what_does_it_change: formData.whatDoesItChange,
        // ... all other fields
      })
      .select()
      .single();

    // Update invite status to completed
    await supabase
      .from('partners_invites')
      .update({
        invite_status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('invite_code', formData.inviteCode);

    // Trigger notifications
    await fetch('/api/partners/notify-submission', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        project: formData.inviteCode,
        response_id: response.id
      })
    });

    setSubmitted(true);
  } catch (error) {
    console.error('Submission error:', error);
    alert('Error submitting reflection. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### Step 5: Notify Team

```javascript
// API route: /api/partners/notify-submission
export async function POST(request) {
  const { name, email, project, response_id } = await request.json();

  // Slack notification
  await fetch(process.env.SLACK_WEBHOOK_PARTNERS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🌟 New Partner Prelude Completed`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${name}* completed their Soullab Inside Prelude\n\n*Project:* ${project}\n*Email:* ${email}\n\n<https://soullab.life/admin/partners/prelude/${response_id}|View Responses>`
          }
        }
      ]
    })
  });

  // Email notification to Kelly
  await sendEmail({
    to: 'kelly@soullab.life',
    from: 'partnerships@soullab.life',
    subject: `Partner Prelude Completed: ${name}`,
    html: `
      <p><strong>${name}</strong> has completed their Soullab Inside Prelude.</p>
      <p><strong>Project:</strong> ${project}</p>
      <p><a href="https://soullab.life/admin/partners/prelude/${response_id}">View Full Responses</a></p>
    `
  });

  return new Response('Notifications sent');
}
```

---

## Usage Example: Inviting Loralee

### Via Admin UI (Future)

```
1. Go to /admin/partners/invites
2. Click "New Invite"
3. Fill form:
   - Name: Loralee Crowder
   - Email: loralee@example.com
   - Project: Astrology as Soul Curriculum
   - Element: Aether / Water
   - Meeting Date: Oct 21, 2025 @ 10 AM MT
4. Click "Send Prelude Invite"
5. System handles rest automatically
```

### Via API (Now)

```bash
curl -X POST https://soullab.life/api/partners/send-invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SOULLAB_API_KEY}" \
  -d '{
    "name": "Loralee Crowder",
    "email": "loralee@example.com",
    "project": "Astrology as Soul Curriculum",
    "element": "Aether / Water",
    "meeting_date": "2025-10-21T10:00:00-06:00",
    "sent_from": "EO"
  }'
```

---

## Monitoring Dashboard

### Key Metrics to Track

- **Invites Sent:** Total count
- **View Rate:** % of invites that were opened
- **Completion Rate:** % of opened invites that were submitted
- **Avg Time to Complete:** From sent → completed
- **Element Distribution:** Which elements partners choose most

### Sample Query

```sql
-- Partner invite funnel
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
  AVG(EXTRACT(EPOCH FROM (completed_at - sent_at)) / 3600) as avg_hours_to_complete
FROM partners_invites
WHERE invite_status = 'completed';
```

---

## Next Steps

1. **Create Supabase tables** (run schema above)
2. **Build `/api/partners/send-invite` endpoint**
3. **Build `/api/partners/track-view` endpoint**
4. **Build `/api/partners/notify-submission` endpoint**
5. **Update prelude form to connect to Supabase**
6. **Test full flow with test email**
7. **Send real invite to Loralee**
8. **Build admin dashboard to view responses**

---

*This template ensures every Field Partner follows the same rhythm: one link, one ritual, one clean pipeline from reflection → intake → design session.*
