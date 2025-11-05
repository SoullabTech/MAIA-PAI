# Email Automation Setup Guide
## Soullab Inside Client Onboarding

Automate your client intake and follow-up process to scale Soullab Inside partnerships efficiently.

---

## OPTION 1: Simple Automation (Free - Google Forms + Gmail)

### What You Get:
- Auto-responses when form is submitted
- Email notifications to you
- Basic follow-up templates

### Setup Steps:

#### 1. Google Form Response Email
When you create your Google Form:
1. Click Settings (gear icon)
2. Go to "Presentation" tab
3. Enable "Show link to submit another response"
4. Add confirmation message (see below)

**Confirmation Message:**
```
Thank you for completing the discovery questionnaire! 🌿

Your responses have been sent to kelly@soullab.org.

What happens next:
• We'll review your responses (1-2 business days)
• Create a detailed proposal for your review
• Schedule a follow-up call within 3-5 days

Questions? Email kelly@soullab.org anytime.

— Kelly & The Soullab Team
```

#### 2. Email Notification to You
1. In Google Form, click "Responses" tab
2. Click three-dot menu → "Get email notifications for new responses"
3. You'll receive an email every time someone submits

#### 3. Manual Follow-Up Template (saved in Gmail)

**Subject:** Your Soullab Inside Proposal - [Client Name]

```
Hi [Client Name],

Thank you for taking the time to complete our discovery questionnaire! I've reviewed your responses and I'm excited about [specific thing from their submission].

I've prepared a detailed proposal that includes:
• Feature scope tailored to your needs
• Project timeline with milestones
• Budget breakdown and payment structure
• Initial design concepts

Attached: [Client_Name]_Proposal.pdf

When can we schedule 60 minutes to walk through this together? I'm available:
• [Date/Time Option 1]
• [Date/Time Option 2]
• [Date/Time Option 3]

Or feel free to book directly: [Calendly link]

Looking forward to bringing your vision to life!

Warmly,
Kelly
kelly@soullab.org
```

---

## OPTION 2: Smart Automation (Paid - Zapier + Gmail/Mailchimp)

### What You Get:
- Automatic personalized responses
- Drip campaigns for follow-up
- CRM integration
- Analytics on open rates

### Tools Needed:
- **Zapier** ($20-50/month): Connects Google Forms to email
- **Mailchimp** (Free for <500 contacts): Email marketing
- **Calendly** (Free): Scheduling
- **Google Sheets** (Free): Response tracking

### Setup Steps:

#### 1. Connect Google Form to Zapier

**Zap 1: Form Submission → Mailchimp + Gmail**

**Trigger:** New response in Google Form

**Actions:**
1. **Add to Mailchimp list:** "Soullab Inside Prospects"
   - Map form fields to Mailchimp fields
   - Tag: "Intake-Completed"

2. **Send Gmail (to client):**
   - From: kelly@soullab.org
   - Subject: "We've received your discovery questionnaire!"
   - Body: (see template below)

3. **Send Gmail (to you):**
   - To: kelly@soullab.org
   - Subject: "New Soullab Inside Lead: {{Client Name}}"
   - Body: "Review responses: [link to Google Sheet row]"

4. **Create Trello card** (optional):
   - Board: "Soullab Inside Pipeline"
   - List: "Discovery - Pending Review"
   - Card title: "{{Client Name}} - {{Business Name}}"
   - Description: Key details from form

**Email Template (to client):**
```
Subject: We've received your discovery questionnaire! 🌿

Hi {{First Name}},

Thank you for sharing your vision for {{Business Name}}! I'm particularly excited about {{Top Goal from Q6}}.

Your responses are being reviewed by our team. Here's what happens next:

📋 NEXT STEPS:
1. Review & Analysis (1-2 business days)
   We'll carefully review every detail you shared

2. Proposal Creation (2-3 business days)
   Custom feature scope, timeline, and budget

3. Presentation Call (within 5 business days)
   60-minute walkthrough where we refine together

📅 SCHEDULE YOUR CALL NOW:
To streamline the process, go ahead and book your proposal review call:
{{Calendly Link}}

❓ QUESTIONS IN THE MEANTIME?
Reply to this email anytime. I read every message personally.

🌟 INSPIRATION:
While you wait, check out our case study with Loralee Crowder, our first Soullab Inside partner:
[Link to Loralee case study]

Warmly,
Kelly
Soullab Inside
kelly@soullab.org

P.S. Your vision for {{specific thing they mentioned}} is exactly the kind of innovation we love supporting. Can't wait to explore this together!
```

#### 2. Drip Campaign Setup (Mailchimp)

**Day 0:** Form submitted (trigger email above)

**Day 2:** Check-in email
```
Subject: Quick question about {{Business Name}}

Hi {{First Name}},

I'm diving into your discovery questionnaire and had a quick clarifying question about {{something from their form}}.

[Specific question based on their response]

Also, have you had a chance to book your proposal review call? Here's the link again: {{Calendly}}

— Kelly
```

**Day 4:** Proposal sent
```
Subject: Your {{Business Name}} Proposal is Ready! 📋

Hi {{First Name}},

Attached is your custom proposal for {{Business Name}}.

🎯 WHAT'S INSIDE:
• Feature scope (MVP + Future phases)
• 12-week development timeline
• Budget breakdown
• Initial design mood boards

Our call is scheduled for {{Date/Time}}. I'll walk you through everything, answer questions, and refine based on your feedback.

📎 ATTACHMENT: {{Business_Name}}_Soullab_Inside_Proposal.pdf

See you soon!
Kelly
```

**Day 7** (if no response): Follow-up
```
Subject: Following up - {{Business Name}} proposal

Hi {{First Name}},

Just wanted to make sure my proposal email didn't get lost in your inbox!

I'm still excited about bringing your vision to life. When's a good time to connect?

— Kelly
```

**Day 14** (if still no response): Final check-in
```
Subject: Is now the right time?

Hi {{First Name}},

I haven't heard back and wanted to respectfully check in.

Sometimes timing isn't right, and that's totally okay. Would it be helpful to:
• Revisit this in 3-6 months?
• Adjust scope/budget?
• Hop on a quick 15-min call to discuss concerns?

Let me know what would serve you best.

— Kelly
```

---

## OPTION 3: Advanced Automation (Agency-Level)

### What You Get:
- Full CRM pipeline
- Automated proposal generation
- Contract e-signatures
- Payment processing
- Project management integration

### Tools Needed:
- **HubSpot** or **Pipedrive** ($50-200/month): CRM
- **PandaDoc** ($49/month): Proposal + contract automation
- **Stripe** (free + transaction fees): Payment processing
- **Zapier** ($50-100/month): Connects everything
- **Notion** or **ClickUp** (free-$12/month): Project tracking

### Workflow:

```
1. Google Form Submitted
   ↓
2. Zapier creates HubSpot contact
   ↓
3. HubSpot workflow triggered:
   - Sends welcome email
   - Assigns to Kelly
   - Creates deal in pipeline
   ↓
4. Kelly reviews in HubSpot (1-2 days)
   ↓
5. Kelly clicks "Generate Proposal"
   ↓
6. Zapier triggers PandaDoc template
   - Auto-fills client info from form
   - Customizes features based on responses
   - Generates PDF
   ↓
7. PandaDoc sends proposal email
   - Client can e-sign directly
   - Client can accept online
   ↓
8. If accepted:
   - Zapier creates invoice in Stripe
   - Creates project in ClickUp
   - Sends welcome kit email
   - Schedules kickoff call via Calendly
   ↓
9. Payment received:
   - Zapier updates HubSpot deal → "Won"
   - Sends client to onboarding flow
   - Creates Slack channel for project
   ↓
10. Kickoff call scheduled
    - Auto-adds to Google Calendar
    - Sends reminder emails (1 day, 1 hour before)
```

### HubSpot Email Sequences:

**Sequence 1: Discovery Complete**
- Day 0: "We received your questionnaire"
- Day 2: "Reviewing your responses..."
- Day 4: "Your proposal is ready"
- Day 7: Follow-up (if no reply)
- Day 14: Final check-in

**Sequence 2: Proposal Sent - Nurture**
- Day 0: Proposal delivered
- Day 1: "Questions about the proposal?"
- Day 3: Case study email
- Day 7: "Want to hop on a call?"
- Day 14: "Is timing the issue?"

**Sequence 3: Proposal Accepted - Onboarding**
- Day 0: "Welcome to Soullab Inside!"
- Day 0: Payment link + getting started docs
- Day 1: "Meet your development team"
- Day 3: Kickoff call confirmation
- Day 7 (after kickoff): "Here's your roadmap"

---

## OPTION 4: AI-Powered Automation (Future)

### What You Could Build:
Using your MAIA architecture, you could create an AI intake agent:

**MAIA as Intake Specialist:**
1. Conversational form (chat interface vs. long form)
2. MAIA asks questions based on previous answers
3. MAIA generates proposal draft automatically
4. Kelly reviews and sends

**Example Flow:**
```
MAIA: "Hi! I'm MAIA, Soullab's intake specialist. I'll help Kelly
      understand your vision. This usually takes 30-45 minutes.
      Ready to begin?"

CLIENT: "Yes!"

MAIA: "Beautiful. Let's start with your business. What's your
      business name and what do you create?"

CLIENT: "I'm Kristen, and I run an apothecary called In Home
        Sanctuary. I make bath balms, candles, healing balms,
        and aromatherapy products."

MAIA: "An apothecary! 🌿 So you're working with plants, scent,
      and ritual to support healing. Tell me - who are your
      people? Who seeks out your medicines?"

CLIENT: "Mostly women in their 30s-50s dealing with stress,
        anxiety, grief. They're looking for natural alternatives
        to wellness."

MAIA: "And right now, how do they find and purchase from you?"

[Conversation continues... MAIA adapts questions based on responses]

[At the end...]

MAIA: "Thank you for sharing all of this, Kristen. I can feel
      the care you put into your work. Based on our conversation,
      I'm seeing a few key themes:

      1. Your customers need guidance - not just products
      2. You want shopping to feel like a healing ritual
      3. Subscriptions could create consistent support

      I'm going to share all of this with Kelly. She'll create
      a proposal specifically for In Home Sanctuary and reach
      out within 2-3 days.

      In the meantime, I'm curious - what would it feel like
      if your app could have conversations like this with your
      customers? Where they describe what they're going through
      and I recommend the right remedies?"

CLIENT: "Oh wow... that would be amazing!"

MAIA: "Let's explore that in your proposal. I think there's
      something really special here. Talk soon! 🌙"

[MAIA sends structured summary to Kelly with all responses + conversational insights]
```

**Technical Implementation:**
- Use your existing MAIA conversation system
- Create "Intake Agent" persona (professional, warm, curious)
- Use Mem0 to track and structure responses
- Generate JSON output formatted for proposal template
- Auto-populate PandaDoc or Notion proposal template

---

## RECOMMENDATION FOR NOW

**Start with Option 1 (Free) or Option 2 (Zapier):**

### Week 1-2: Manual Process
- Send Google Form link manually
- Review responses in Google Sheets
- Create proposals manually
- Follow up manually

**Why:** Learn what questions work, what proposals convert, what objections arise

### Week 3-4: Add Basic Automation
- Set up Zapier to send welcome email
- Create Calendly for scheduling
- Build email templates in Gmail

**Why:** Automate repetitive tasks while keeping human touch

### Month 2-3: Scale with Mailchimp Sequences
- Build drip campaigns
- Add analytics tracking
- A/B test email subject lines

**Why:** Now you have data on what works

### Month 4+: Consider Advanced Tools
- Only if you're getting 5+ inquiries/month
- ROI justifies cost of tools
- You have team members to manage

---

## EMAIL TEMPLATES LIBRARY

Save these as Gmail templates for quick access:

### 1. Form Submission Acknowledgment
```
Subject: Thanks for your discovery questionnaire!

Hi {{First Name}},

Your responses have been received! I'll review everything and have a proposal ready within 3-5 business days.

In the meantime, here's our case study with Loralee Crowder: [link]

— Kelly
```

### 2. Proposal Delivery
```
Subject: Your {{Business Name}} Proposal 📋

Hi {{First Name}},

Attached is your custom Soullab Inside proposal!

I'm excited about {{specific detail from their form}}.

Let's schedule 60 minutes to walk through it together: [Calendly link]

— Kelly
```

### 3. Follow-Up (No Response)
```
Subject: Following up - your proposal

Hi {{First Name}},

Just checking if you had a chance to review the proposal I sent on {{date}}.

Happy to answer any questions or adjust the scope if needed.

— Kelly
```

### 4. Budget Concern Response
```
Subject: Re: Budget questions

Hi {{First Name}},

Thanks for being upfront about budget. Let's explore options:

Option A: Phased approach (MVP now, features later)
Option B: Adjusted scope (focus on core features)
Option C: Timeline shift (spread cost over longer period)

Which approach resonates? We'll make this work.

— Kelly
```

### 5. Closed-Won (They Said Yes!)
```
Subject: Welcome to Soullab Inside! 🎉

Hi {{First Name}},

So excited to build {{Business Name}} together!

NEXT STEPS:
1. Sign contract (link below)
2. First payment (50% deposit)
3. Kickoff call (schedule below)

Contract: [PandaDoc link]
Schedule kickoff: [Calendly link]
Payment: [Stripe invoice link]

Once payment clears, we begin! Our typical timeline is 12 weeks from kickoff to launch.

Questions? I'm here.

— Kelly
```

### 6. Closed-Lost (They Said No)
```
Subject: Thanks for considering Soullab Inside

Hi {{First Name}},

Thank you for taking the time to explore working together. I completely understand that [reason they declined].

If circumstances change, we'd love to work with you in the future. In the meantime, here are some resources that might help:

[Relevant free resources, articles, tools]

Wishing you all the best with {{Business Name}}!

— Kelly

P.S. Feel free to reach out anytime if questions come up.
```

---

## METRICS TO TRACK

### Form Performance:
- Submissions per week
- Completion rate (started vs. finished)
- Average time to complete
- Drop-off points (which questions lose people)

### Email Performance:
- Open rates (aim for 40%+)
- Click rates (aim for 10%+)
- Response rates (aim for 50%+)
- Time to first response

### Conversion Funnel:
- Form submitted → Proposal sent (should be 100%)
- Proposal sent → Call scheduled (aim for 60%+)
- Call scheduled → Call completed (aim for 80%+)
- Call completed → Contract signed (aim for 40%+)
- Contract signed → Payment received (aim for 90%+)

### Time Tracking:
- Average days from form → proposal
- Average days from proposal → decision
- Average days from yes → payment
- Total sales cycle length

---

## TOOLS COMPARISON

| Tool | Cost | Best For | Complexity |
|------|------|----------|------------|
| Google Forms + Gmail | Free | Starting out | Low |
| Zapier + Mailchimp | $20-50/mo | 5-20 leads/month | Medium |
| HubSpot + PandaDoc | $100-250/mo | 20+ leads/month | High |
| Custom MAIA Agent | Dev time | Unique experience | Very High |

---

## NEXT STEPS

1. **This Week:** Create Google Form using the guide
2. **Next Week:** Set up basic Zapier automation
3. **Month 2:** Build Mailchimp drip sequences
4. **Month 3:** Evaluate if advanced tools are worth it

Want me to set up any of these automations for you? I can:
- Write the Zapier flows
- Create the Mailchimp sequences
- Build a MAIA intake agent prototype

Let me know!
