# Zapier Automation Recipes
## Soullab Inside Client Onboarding

**Pre-requisites:**
- Zapier account ($20-50/month tier)
- Google Forms created
- Gmail or Mailchimp account
- Calendly account (optional)

---

## Zap 1: New Form Submission → Email Workflow

**Trigger:** New Response in Google Forms
**Actions:** 4 steps

### Step 1: Trigger - New Form Response

**App:** Google Forms
**Event:** New Form Response
**Setup:**
1. Connect your Google account
2. Select your "Soullab Inside Client Intake" form
3. Test trigger (submit test form response)

---

### Step 2: Action - Add to Mailchimp List

**App:** Mailchimp
**Event:** Add/Update Subscriber
**Setup:**

**Fields to Map:**
- **Audience:** Create new list called "Soullab Inside Prospects"
- **Email:** Map to form field "Email Address"
- **First Name:** Map to form field "What is your business name?" (or create First Name field)
- **Status:** Subscribed
- **Tags:** `intake-completed, {{Business Name}}, {{Timeline}}`

**Merge Fields (Custom):**
- `BUSINESS`: Map to "Business Name" field
- `GOALS`: Map to "Top 3 Goals" field
- `BUDGET`: Map to "Budget Range" field
- `TIMELINE`: Map to "Launch Timeline" field

**Skip if subscriber already exists:** Yes

---

### Step 3: Action - Send Email to Client (Gmail)

**App:** Gmail
**Event:** Send Email
**Setup:**

**To:** {{Email Address from form}}
**From:** kelly@soullab.org
**Subject:** We've received your discovery questionnaire! 🌿
**Body Type:** HTML

**Email Template:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #374151; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .highlight-box { background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .cta-button { display: inline-block; background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Thank You! 🌿</h1>
    </div>

    <div class="content">
      <p>Hi {{First Name or Business Name}},</p>

      <p>Thank you for completing our discovery questionnaire! I'm particularly excited about <strong>{{Top Goal #1}}</strong>.</p>

      <div class="highlight-box">
        <h3 style="color: #3730a3; margin-top: 0;">What Happens Next</h3>
        <ol style="color: #4c1d95;">
          <li><strong>Review & Analysis</strong> (1-2 business days)<br>
          <small>We'll carefully review every detail you shared</small></li>

          <li><strong>Proposal Creation</strong> (2-3 business days)<br>
          <small>Custom feature scope, timeline, and budget</small></li>

          <li><strong>Presentation Call</strong> (within 5 business days)<br>
          <small>60-minute walkthrough where we refine together</small></li>
        </ol>
      </div>

      <h3>📅 Schedule Your Call Now</h3>
      <p>To streamline the process, go ahead and book your proposal review call:</p>
      <p style="text-align: center;">
        <a href="https://calendly.com/kelly-soullab/proposal-review" class="cta-button">Book Your Call</a>
      </p>

      <h3>❓ Questions in the Meantime?</h3>
      <p>Reply to this email anytime. I read every message personally.</p>

      <h3>🌟 Inspiration While You Wait</h3>
      <p>Check out our case study with Loralee Crowder, our first Soullab Inside partner:<br>
      <a href="[LINK TO CASE STUDY]">Read Loralee's Story →</a></p>

      <p style="margin-top: 40px;">Warmly,<br>
      <strong>Kelly</strong><br>
      <span style="color: #6b7280;">Soullab Inside</span></p>

      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p style="margin: 0; font-style: italic; color: #78350f;">
          P.S. Your vision for {{Magic Wand Answer (first 50 chars)}} is exactly the kind of innovation we love supporting. Can't wait to explore this together!
        </p>
      </div>
    </div>

    <div class="footer">
      <p>kelly@soullab.org</p>
    </div>
  </div>
</body>
</html>
```

---

### Step 4: Action - Notify Kelly (Gmail)

**App:** Gmail
**Event:** Send Email
**Setup:**

**To:** kelly@soullab.org
**From:** noreply@soullab.org (or your automation email)
**Subject:** 🔥 New Soullab Inside Lead: {{Business Name}}
**Body Type:** Plain Text

**Email Template:**
```
NEW SOULLAB INSIDE INQUIRY 🌿

Business Name: {{Business Name}}
Contact: {{Your Name}}
Email: {{Email Address}}
Website: {{Website URL}}

=== QUICK SUMMARY ===

Top Goals:
- {{Goal 1}}
- {{Goal 2}}
- {{Goal 3}}

Budget: {{Budget Range}}
Timeline: {{Launch Timeline}}

Products/Services:
{{Product Categories and Count}}

Magic Wand Vision:
"{{Magic Wand Answer}}"

=== NEXT STEPS ===

1. Review full responses in Google Sheets
2. Create custom proposal (use template)
3. Send proposal within 2-3 days
4. Wait for them to book call via Calendly

📊 View Full Response:
[Link to Google Sheets row]

🎯 Action Required: Create proposal
```

---

## Zap 2: Calendly Meeting Booked → Prep Workflow

**Trigger:** Event Scheduled in Calendly
**Actions:** 3 steps

### Step 1: Trigger - New Event Scheduled

**App:** Calendly
**Event:** Invitee Created
**Setup:**
1. Connect Calendly account
2. Select "Proposal Review Call" event type
3. Test trigger

---

### Step 2: Action - Add to Google Calendar

**App:** Google Calendar
**Event:** Create Detailed Event
**Setup:**

**Calendar:** Your main calendar
**Summary:** Proposal Review: {{Invitee Name}} - {{Business Name from form}}
**Description:**
```
SOULLAB INSIDE PROPOSAL REVIEW CALL

Client: {{Invitee Name}}
Business: {{Pull from Mailchimp or manual entry}}
Email: {{Invitee Email}}

== PREP CHECKLIST ==
☐ Review their form responses
☐ Finalize proposal
☐ Send proposal 24 hours before call
☐ Review their website/social before call
☐ Prepare 3 specific questions about their business

== CALL AGENDA ==
1. Introductions (5 min)
2. Walk through proposal (25 min)
3. Questions & discussion (20 min)
4. Next steps & decision timeline (10 min)

== LINKS ==
- Form Responses: [Google Sheet Link]
- Proposal: [Google Drive Link]
- Their Website: {{Website from form}}
```

**Start Time:** {{Event Start Time}}
**End Time:** {{Event End Time}}
**Send Updates:** All Attendees

---

### Step 3: Action - Send Call Reminder (Gmail)

**App:** Gmail
**Event:** Send Email
**Setup:**

**To:** {{Invitee Email}}
**CC:** kelly@soullab.org
**Subject:** Looking forward to our call on {{Event Date}}!
**Send:** Delay by 1 hour after trigger

**Email Template:**
```html
Hi {{Invitee Name}},

Great! I've got us scheduled for {{Event Date}} at {{Event Time}}.

I'll send your custom proposal 24 hours before our call so you have time to review. Our agenda:

• Walk through proposal in detail (features, timeline, pricing)
• Answer all your questions
• Discuss any adjustments needed
• Outline next steps if you want to move forward

If anything comes up and you need to reschedule, just use the link in your Calendly confirmation email.

See you soon!

Kelly
```

---

## Zap 3: Proposal Sent → Follow-Up Sequence

**Trigger:** Gmail - Email Sent with Label
**Actions:** Multi-step drip campaign

### Step 1: Trigger - Email Sent with Label "Proposal"

**App:** Gmail
**Event:** New Labeled Email
**Setup:**
1. Label to watch: "Soullab-Proposal-Sent"
2. Whenever you send a proposal, apply this label

---

### Step 2: Action - Add to Mailchimp Journey

**App:** Mailchimp
**Event:** Add Subscriber to Automation
**Setup:**

**Automation Name:** "Proposal Sent - Nurture"
**Subscriber Email:** {{To Email from Gmail}}
**Start Point:** Immediate

**Create This Automation in Mailchimp:**

**Day 0 (Immediately):**
- Subject: "Your {{Business Name}} proposal is attached 📋"
- Content: (Same as proposal email template from automation guide)

**Day 1:**
- Subject: "Quick question about the proposal"
- Content:
```
Hi {{First Name}},

Did you have a chance to review the proposal I sent yesterday?

I'm curious—was there anything that particularly excited you? Or anything that raised questions?

Reply to this email and let's talk through it.

— Kelly
```

**Day 3:**
- Subject: "How Loralee built her practice with Soullab Inside"
- Content: [Case study email with Loralee's story]

**Day 7 (if no reply):**
- Subject: "Want to hop on a quick call?"
- Content:
```
Hi {{First Name}},

I haven't heard back and wanted to check in. Sometimes it's easier to talk through questions than write them out.

Would a quick 15-minute call be helpful?

Book here: [Calendly link]

Or if now's not the right time, just let me know—no pressure.

— Kelly
```

**Day 14 (if still no reply):**
- Subject: "Is timing the issue?"
- Content:
```
Hi {{First Name}},

I want to respectfully check in one last time.

Sometimes the vision is right but the timing isn't. Would it be helpful to:

• Revisit this in 3-6 months?
• Adjust scope or budget?
• Just hop on a call to discuss concerns?

Let me know what would serve you best. Either way, I'm rooting for {{Business Name}}.

— Kelly
```

---

## Zap 4: Contract Signed → Onboarding Workflow

**Trigger:** PandaDoc Document Completed
**Actions:** 5 steps

### Step 1: Trigger - Document Completed

**App:** PandaDoc (or DocuSign)
**Event:** Document Completed
**Setup:**
1. Connect PandaDoc account
2. Select "Soullab Inside Partnership Agreement" template
3. Test trigger

---

### Step 2: Action - Update Mailchimp Tag

**App:** Mailchimp
**Event:** Add/Update Subscriber
**Setup:**

**Email:** {{Recipient Email from PandaDoc}}
**Tags to Add:** `client-active, contract-signed`
**Tags to Remove:** `prospect, intake-completed`

---

### Step 3: Action - Create Stripe Invoice

**App:** Stripe
**Event:** Create Invoice
**Setup:**

**Customer Email:** {{Recipient Email}}
**Amount:** {{Contract Value from PandaDoc}} * 0.50 (50% deposit)
**Description:** "Soullab Inside Partnership - 50% Deposit"
**Due Date:** 7 days from now
**Auto-send:** Yes

---

### Step 4: Action - Create ClickUp Project

**App:** ClickUp (or Trello, Asana)
**Event:** Create Folder
**Setup:**

**Workspace:** Soullab Inside
**Folder Name:** {{Business Name}} - {{Client Name}}
**Lists to Create:**
- Discovery & Planning
- Design
- Development
- Testing
- Launch
- Post-Launch Support

**Create Tasks in Discovery & Planning:**
- [ ] Kickoff call scheduled
- [ ] Brand workshop completed
- [ ] Design concepts presented
- [ ] Technical architecture finalized

---

### Step 5: Action - Send Welcome Email

**App:** Gmail
**Event:** Send Email
**Setup:**

**To:** {{Client Email}}
**Subject:** Welcome to Soullab Inside! 🎉
**Attachment:** Welcome Kit PDF (stored in Google Drive)

**Email Template:**
```html
Hi {{Client Name}},

Welcome to Soullab Inside! I'm so excited to bring {{Business Name}} to life together.

=== YOUR NEXT STEPS ===

1. PAYMENT ✓
   Invoice sent to your email: ${{Deposit Amount}}
   Due by: {{Due Date}}
   Once paid, we officially begin!

2. KICKOFF CALL 📅
   Let's schedule our 2-hour kickoff:
   [Calendly Link]

   We'll cover:
   • Project roadmap
   • Timeline milestones
   • Team introductions
   • Brand exploration

3. WELCOME KIT 📦
   Attached is your welcome kit with:
   • Project timeline
   • Communication guidelines
   • Brand questionnaire (fill out before kickoff)
   • What to expect each week

=== OUR TEAM ===

You'll be working with:
• Kelly - Partnership Lead & Strategy
• [Designer Name] - Brand & Visual Design
• [Developer Name] - Technical Architecture
• MAIA - AI Integration

=== QUESTIONS? ===

Reply to this email anytime. I'm here.

Let's create something beautiful for {{Business Name}} and the people you serve.

Warmly,
Kelly
```

---

## Zap 5: Payment Received → Kickoff Automation

**Trigger:** Stripe Payment Succeeded
**Actions:** 4 steps

### Step 1: Trigger - Payment Succeeded

**App:** Stripe
**Event:** New Payment
**Setup:**
1. Connect Stripe account
2. Filter: Only payments for "Soullab Inside" invoices
3. Test trigger

---

### Step 2: Action - Update Database

**App:** Webhooks by Zapier
**Event:** POST Request
**Setup:**

**URL:** https://your-app.vercel.app/api/soullab-inside/update-status
**Method:** POST
**Data:**
```json
{
  "email": "{{Customer Email}}",
  "status": "deposit_paid",
  "depositAmount": "{{Amount}}",
  "paidAt": "{{Created Date}}"
}
```

---

### Step 3: Action - Send to Slack

**App:** Slack
**Event:** Send Channel Message
**Setup:**

**Channel:** #soullab-inside-wins
**Message:**
```
🎉 DEPOSIT RECEIVED! 🎉

{{Customer Name}} just paid ${{Amount}} for {{Business Name}}!

💰 Total Contract Value: ${{Full Contract Value}}
📅 Kickoff Call: {{Kickoff Date or "Not scheduled yet"}}
🚀 Expected Launch: {{Launch Date}}

Next: Make sure kickoff is scheduled and welcome kit is sent!
```

---

### Step 4: Action - Add to Google Sheet (Deal Tracker)

**App:** Google Sheets
**Event:** Create Spreadsheet Row
**Setup:**

**Spreadsheet:** "Soullab Inside Pipeline"
**Worksheet:** "Active Clients"
**Columns:**
- Client Name: {{Customer Name}}
- Business Name: {{Business Name from Mailchimp or manual}}
- Email: {{Customer Email}}
- Contract Value: {{Full Contract Value}}
- Deposit Paid: {{Amount}}
- Deposit Date: {{Created Date}}
- Status: "Kickoff Pending"
- Launch Target: {{Calculate +12 weeks from today}}

---

## Zap 6: Kickoff Call Completed → Project Start

**Trigger:** Calendly Meeting Ended
**Actions:** 3 steps

### Step 1: Trigger - Event Ended

**App:** Calendly
**Event:** Invitee Canceled (actually use a webhook)

**Alternative Setup:** Create a manual trigger button in ClickUp after kickoff call

---

### Step 2: Action - Send Kickoff Summary Email

**App:** Gmail
**Event:** Send Email
**Setup:**

**To:** {{Client Email}}
**Subject:** Kickoff Summary & Your Roadmap 🗺️
**Attachments:**
- Project Roadmap PDF
- Brand Guidelines (if completed)

**Email Template:**
```
Hi {{Client Name}},

What a great kickoff call! I loved hearing more about {{specific thing from call}}.

=== WHAT WE COVERED ===

✓ Your vision for {{Business Name}}
✓ Target customers and their needs
✓ Feature priorities (MVP vs. Phase 2)
✓ Brand direction and visual mood
✓ Project timeline: {{Weeks}} weeks to launch

=== YOUR ROADMAP ===

Attached is your custom roadmap. Here's what happens next:

WEEK 1-2: Design
- We create 3 design concepts
- You review and choose direction
- We refine until it feels like YOU

WEEK 3-4: Design Finalization
- Complete all page layouts
- Mobile responsive designs
- You approve final designs

WEEK 5-8: Core Development
- Product catalog and checkout
- Customer accounts
- Admin dashboard
- Payment integration

WEEK 9-10: Advanced Features
- [List their specific features]
- Email automation
- Analytics setup

WEEK 11-12: Content & Launch
- Add all products
- Testing on all devices
- Training on admin dashboard
- GO LIVE! 🚀

=== WEEKLY CHECK-INS ===

Every Monday at {{Time}}, 30 minutes
I'll send Loom videos throughout the week showing progress.

=== WHAT I NEED FROM YOU ===

By end of this week:
☐ Complete brand questionnaire (attached)
☐ Send product photos (upload here: [Link])
☐ Send product descriptions or schedule copywriting interview

=== QUESTIONS? ===

Slack me anytime in our project channel: #{{business-name}}

Let's build something beautiful!

Kelly
```

---

### Step 3: Action - Start Project Timer

**App:** ClickUp
**Event:** Update Task
**Setup:**

**List:** {{Business Name}} - Development
**Task:** "Project Timer"
**Status:** In Progress
**Start Date:** {{Today}}
**Due Date:** {{Today + 12 weeks}}

---

## Advanced: Zap 7 - MAIA Intake → Google Sheets

**Trigger:** New Row in Database (via Webhook)
**Actions:** 2 steps

This Zap captures MAIA conversational intakes and adds them to your tracking sheet.

### Step 1: Trigger - Webhook Catch Hook

**App:** Webhooks by Zapier
**Event:** Catch Hook
**Setup:**

1. Copy webhook URL
2. Add to your MAIA intake API:

```typescript
// In /api/soullab-inside/intake/route.ts
await fetch('https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_URL/', {
  method: 'POST',
  body: JSON.stringify({
    sessionId,
    businessName: data.businessName,
    clientName: data.clientName,
    email: data.email,
    topGoals: data.topGoals,
    budget: data.budget,
    timeline: data.timeline,
    magicWand: data.magicWand,
  }),
});
```

---

### Step 2: Action - Add to Google Sheets

**App:** Google Sheets
**Event:** Create Spreadsheet Row
**Setup:**

**Spreadsheet:** "Soullab Inside Leads"
**Worksheet:** "MAIA Intakes"
**Columns:**
- Timestamp: {{Timestamp}}
- Session ID: {{Session ID}}
- Client Name: {{Client Name}}
- Business Name: {{Business Name}}
- Email: {{Email}}
- Top Goals: {{Top Goals (comma separated)}}
- Budget: {{Budget}}
- Timeline: {{Timeline}}
- Magic Wand: {{Magic Wand}}
- Status: "New - Needs Review"
- View Full Data: `=HYPERLINK("https://your-app.com/admin/intakes/{{Session ID}}", "View")`

---

## Cost Breakdown

**Tools Required:**
- **Zapier:** $29.99/month (Starter plan - 750 tasks/month)
- **Mailchimp:** Free (under 500 contacts) or $13/month
- **Calendly:** Free or $10/month (Pro)
- **Google Workspace:** Free or $6/month/user
- **Stripe:** Free + 2.9% + $0.30 per transaction
- **Resend (for MAIA emails):** Free (up to 3,000/month)

**Total Monthly:** ~$50-70/month

---

## Setup Checklist

- [ ] Create Google Form
- [ ] Sign up for Zapier ($29.99/month)
- [ ] Connect Google Forms to Zapier
- [ ] Create Mailchimp account and "Prospects" list
- [ ] Set up Calendly event type
- [ ] Create all 7 Zaps listed above
- [ ] Test each Zap with dummy data
- [ ] Create Gmail templates as drafts
- [ ] Set up Google Sheets trackers
- [ ] Create Slack channel for notifications
- [ ] Test entire workflow end-to-end

---

## Testing Your Zaps

1. **Submit test form response** with fake data
2. **Check:**
   - Email received by test client email?
   - Email received by kelly@soullab.org?
   - Row added to Google Sheets?
   - Contact added to Mailchimp with correct tags?
3. **Book test Calendly appointment**
4. **Check:**
   - Added to Google Calendar?
   - Reminder email sent?
5. **Send test proposal email** with label
6. **Check:**
   - Drip sequence started in Mailchimp?

---

## Troubleshooting

**Zap isn't triggering:**
- Check that trigger app is properly connected
- Verify filter conditions aren't too restrictive
- Look at Zap History for errors

**Wrong data being mapped:**
- Re-test trigger to pull fresh sample data
- Update field mappings
- Check for typos in field names

**Emails going to spam:**
- Warm up your domain (send gradual increasing emails)
- Use authenticated domain for sending
- Avoid spam trigger words in subject lines

**Task limit exceeded:**
- Upgrade Zapier plan or
- Consolidate Zaps to use fewer tasks
- Use Zapier filters to prevent unnecessary runs

---

## Next Level: Zapier + MAIA Integration

Once your MAIA intake agent is live, you can create a hybrid approach:

1. **Short Google Form** (10 questions) → Triggers Zap
2. **Zap sends link** to MAIA intake conversation
3. **MAIA completes** deep discovery (90 questions conversationally)
4. **MAIA webhooks** results back to Zapier
5. **Zapier creates** Google Sheet row + sends to Kelly

**Best of both worlds:**
- Low friction entry (short form)
- Deep discovery (MAIA conversation)
- Structured data (Zapier + Sheets)

---

Want help setting any of these up? Let me know which Zap you want to start with!
