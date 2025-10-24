# Beta Access Code System

**Genesis Book Studio - Beta Tester Gift Codes**

---

## 📋 Code Structure

### Format

```
GENESIS-BETA-[TIER]-[UNIQUE]
```

**Examples:**
- `GENESIS-BETA-FOUNDER-ALCHEMY2025`
- `GENESIS-BETA-CREATOR-TRANSFORM01`
- `GENESIS-BETA-PARTNER-SOULLAB42`

### Code Tiers

**FOUNDER** (10 codes)
- First 10 beta testers
- Extra perks and recognition
- Lifetime founding member status
- Special badge

**CREATOR** (40 codes)
- General beta tester pool
- Standard beta benefits
- Full platform access
- Community membership

**PARTNER** (10 codes)
- Partner organizations
- Extended team limits (10 members)
- Co-branding options
- Joint case studies

---

## 🎁 Active Beta Codes

### Founder Tier (10 total)

```
GENESIS-BETA-FOUNDER-ALCHEMY2025     [ISSUED: Kelly Nezat - Elemental Alchemy]
GENESIS-BETA-FOUNDER-AWAKEN01        [AVAILABLE]
GENESIS-BETA-FOUNDER-CONSCIOUS02     [AVAILABLE]
GENESIS-BETA-FOUNDER-DIVINE03        [AVAILABLE]
GENESIS-BETA-FOUNDER-ELEMENTAL04     [AVAILABLE]
GENESIS-BETA-FOUNDER-FIRE05          [AVAILABLE]
GENESIS-BETA-FOUNDER-GUIDE06         [AVAILABLE]
GENESIS-BETA-FOUNDER-HEART07         [AVAILABLE]
GENESIS-BETA-FOUNDER-INNER08         [AVAILABLE]
GENESIS-BETA-FOUNDER-JOURNEY09       [AVAILABLE]
```

### Creator Tier (40 total)

```
GENESIS-BETA-CREATOR-TRANSFORM01     [AVAILABLE]
GENESIS-BETA-CREATOR-WISDOM02        [AVAILABLE]
GENESIS-BETA-CREATOR-PRESENCE03      [AVAILABLE]
GENESIS-BETA-CREATOR-SPIRIT04        [AVAILABLE]
GENESIS-BETA-CREATOR-LIGHT05         [AVAILABLE]
GENESIS-BETA-CREATOR-FLOW06          [AVAILABLE]
GENESIS-BETA-CREATOR-GRACE07         [AVAILABLE]
GENESIS-BETA-CREATOR-MAGIC08         [AVAILABLE]
GENESIS-BETA-CREATOR-POWER09         [AVAILABLE]
GENESIS-BETA-CREATOR-TRUTH10         [AVAILABLE]

... (30 more available)
```

### Partner Tier (10 total)

```
GENESIS-BETA-PARTNER-SOULLAB01       [AVAILABLE - Soullab Community]
GENESIS-BETA-PARTNER-INSTITUTE02     [AVAILABLE]
GENESIS-BETA-PARTNER-GUILD03         [AVAILABLE]
GENESIS-BETA-PARTNER-COLLECTIVE04    [AVAILABLE]
GENESIS-BETA-PARTNER-NETWORK05       [AVAILABLE]
GENESIS-BETA-PARTNER-ALLIANCE06      [AVAILABLE]
GENESIS-BETA-PARTNER-CIRCLE07        [AVAILABLE]
GENESIS-BETA-PARTNER-TRIBE08         [AVAILABLE]
GENESIS-BETA-PARTNER-COUNCIL09       [AVAILABLE]
GENESIS-BETA-PARTNER-FEDERATION10    [AVAILABLE]
```

---

## 🎯 Code Allocation Strategy

### Phase 1: Foundation (Weeks 1-6)
**Target:** 10 beta testers

**Priority Recipients:**
1. Kelly Nezat (Founder/Developer) - **ISSUED**
2. Soullab core team members (3 codes)
3. Close collaborators and advisors (3 codes)
4. Ideal customer profile matches (3 codes)

**Criteria:**
- Active book project in progress
- Willing to give weekly feedback
- Representative of target audience
- High engagement likelihood

### Phase 2: Expansion (Weeks 7-12)
**Target:** 25 total beta testers (+15)

**Priority Recipients:**
- Referrals from Phase 1 testers
- Waitlist applicants (best fit)
- Partner organizations
- Diverse book genres

**Criteria:**
- All Phase 1 criteria
- Team-based projects preferred
- Willingness to be case study
- Active in community

### Phase 3: Scale (Weeks 13-18)
**Target:** 50 total beta testers (+25)

**Priority Recipients:**
- Strong waitlist candidates
- Community nominations
- Strategic partnerships
- Influencer creators

**Criteria:**
- Growing pool of proven users
- Success stories to share
- Referral potential
- Platform integration interest

### Phase 4: Pre-Launch (Weeks 19-24)
**Target:** 100 total beta testers (+50)

**Priority Recipients:**
- Waitlist fulfillment
- Marketing partners
- Case study participants
- Launch team members

**Criteria:**
- Completion likelihood
- Publishing readiness
- Marketing potential
- Community leadership

---

## 📊 Code Tracking

### Issued Codes

| Code | Tier | Name | Project | Status | Issued Date | Activated | Feedback Score |
|------|------|------|---------|--------|-------------|-----------|----------------|
| ALCHEMY2025 | FOUNDER | Kelly Nezat | Elemental Alchemy | Active | 2025-01-20 | 2025-01-20 | Excellent |
| [Add new] | | | | | | | |

### Redemption Stats

**Total Issued:** 1 / 60
**Activated:** 1 / 1 (100%)
**Active Users:** 1
**Churned:** 0
**Feedback Rate:** 100%

### Tier Breakdown

**Founder:** 1 / 10 issued (10%)
**Creator:** 0 / 40 issued (0%)
**Partner:** 0 / 10 issued (0%)

---

## 🔧 Code Management

### Generating New Codes

**Script:** `scripts/generate-beta-code.sh`

```bash
#!/bin/bash
# Generate new beta access code

TIER=$1  # FOUNDER, CREATOR, or PARTNER
UNIQUE=$2  # Unique identifier

CODE="GENESIS-BETA-${TIER}-${UNIQUE}"

echo "Generated: ${CODE}"
echo "${CODE}" >> beta-codes-available.txt

# In future: Add to database
# supabase db insert beta_codes (code, tier, status)
```

**Usage:**
```bash
./scripts/generate-beta-code.sh CREATOR MANIFEST23
# Output: GENESIS-BETA-CREATOR-MANIFEST23
```

### Issuing a Code

**Process:**

1. **Approve Application**
   - Review beta application
   - Assess fit and commitment
   - Schedule interview if needed
   - Make decision

2. **Select Code**
   - Choose appropriate tier
   - Pick from available codes
   - Mark as "issued" in tracker

3. **Send Welcome Packet**
   - Email template with code
   - Welcome guide PDF
   - Bonus resources
   - Slack invite
   - Calendar link for onboarding

4. **Track Activation**
   - Monitor if code is redeemed
   - Follow up after 3 days if not
   - Schedule onboarding call
   - Add to community

5. **Update Records**
   - Mark code as "activated"
   - Add user to tracking sheet
   - Set feedback schedule
   - Tag in CRM

### Revoking a Code

**Valid Reasons:**
- Abuse or violation of terms
- Inactivity for 60+ days
- Request from user
- Program violation

**Process:**
1. Document reason
2. Notify user (unless abuse)
3. Disable code in system
4. Export their data if requested
5. Update tracking sheet

---

## 📧 Email Templates

### Welcome Email

**Subject:** Your Genesis Book Studio Beta Access 🎁

```
Hi [Name],

Welcome to Genesis Book Studio! We're thrilled to have you.

Your Beta Access Code: GENESIS-BETA-[TIER]-[UNIQUE]

ACTIVATE NOW:
https://genesis-book-studio.soullab.life/signup?code=[CODE]

What You Get:
✅ 6 months free beta access
✅ All features unlocked
✅ Team workspace (5 members)
✅ MAIA AI assistants
✅ Priority support
✅ 50% lifetime discount after beta

Next Steps:
1. Activate your account (link above)
2. Download the Welcome Guide (attached)
3. Join our Slack community (link below)
4. Schedule your onboarding call (link below)

RESOURCES:
• Slack Community: [invite link]
• Onboarding Call: [calendar link]
• Office Hours: Tue/Thu 2pm & 6pm ET
• Support Email: beta@soullab.life

Questions? Just reply to this email.

Let's create something amazing together!

With gratitude,
[Name]
Genesis Book Studio Team
Soullab Media
```

### Activation Reminder (Day 3)

**Subject:** Don't forget to activate your beta access!

```
Hi [Name],

Just checking in! We sent your beta access code 3 days ago.

Your Code: GENESIS-BETA-[TIER]-[UNIQUE]

Haven't had a chance to activate yet? No problem!

ACTIVATE NOW:
https://genesis-book-studio.soullab.life/signup?code=[CODE]

Need help? Have questions? Just reply to this email or jump on our office hours:
• Tuesday 2-3pm ET
• Thursday 6-7pm ET

Looking forward to seeing your project!

Best,
[Name]
```

### Code Expiration Warning (Month 5)

**Subject:** Your beta period ends in 30 days - here's what's next

```
Hi [Name],

Hard to believe it's been 5 months already! Your beta access ends on [DATE].

What Happens Next?

OPTION 1: Continue with 50% Lifetime Discount
• Creator Tier: $9.50/month (normally $19)
• Professional Tier: $24.50/month (normally $49)
• Lock in this rate FOREVER

OPTION 2: Free Tier (Limited)
• 1 active project
• 2 team members
• 1GB storage
• 100 AI suggestions/month

OPTION 3: Export Everything
• Download all your work
• Keep your writing forever
• Come back anytime

You'll receive another reminder at 7 days before expiration.

Thanks for being an amazing beta tester! Your feedback has been invaluable.

Questions about plans or transition? Reply to this email or schedule a call: [link]

With gratitude,
[Name]
Genesis Book Studio Team
```

---

## 🎁 Referral Bonus System

### How It Works

**Beta Tester Refers Friend:**
1. Beta tester shares unique referral link
2. Friend signs up and activates
3. Both get rewards!

**Rewards:**
- **Referrer:** +1 month free access per referral
- **Referee:** Priority beta acceptance
- **Both:** +500 bonus AI credits

**Referral Codes:**
```
https://genesis-book-studio.soullab.life/signup?ref=[USER_ID]
```

### Tracking Referrals

| Referrer | Referee | Status | Bonus Granted | Date |
|----------|---------|--------|---------------|------|
| Kelly Nezat | [Name] | Activated | Yes | 2025-02-01 |

---

## 📈 Success Metrics

### Code Performance

**Overall:**
- Issued: 1
- Activated: 1 (100%)
- Active: 1 (100%)
- Feedback Rate: 100%
- NPS: TBD

**By Tier:**
- Founder: 100% activation
- Creator: TBD
- Partner: TBD

### User Engagement

**Average Weekly Usage:**
- Sessions per user: TBD
- Time in editor: TBD
- AI suggestions used: TBD
- Team invites: TBD

**Content Production:**
- Words written: TBD
- Projects created: 1
- Exports generated: TBD
- Books published: 0 (in progress)

---

## 🔮 Future Enhancements

### Database Integration

**Supabase Schema:**

```sql
CREATE TABLE beta_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  tier VARCHAR(20) NOT NULL, -- FOUNDER, CREATOR, PARTNER
  status VARCHAR(20) DEFAULT 'available', -- available, issued, activated, revoked
  issued_to VARCHAR(255),
  issued_date TIMESTAMP,
  activated_date TIMESTAMP,
  expires_date TIMESTAMP,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE beta_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  feedback_type VARCHAR(50), -- weekly_pulse, feature_test, monthly_checkin
  rating INT,
  comments TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Automated Workflows

**When code is issued:**
- Send welcome email automatically
- Create calendar invite for onboarding
- Add to Slack workspace
- Generate referral link
- Set up feedback schedule

**When code is activated:**
- Send welcome guide
- Trigger onboarding sequence
- Add to beta cohort
- Schedule first check-in

**Weekly reminders:**
- Office hours notification
- Pulse survey
- Community highlights

---

## 📝 Code Assignment Log

### 2025-01-20
- **ALCHEMY2025** (FOUNDER) → Kelly Nezat
- Project: Elemental Alchemy
- Status: Active, manuscript imported
- Notes: Platform creator, first user, excellent feedback

### [Future Assignments]
- Track each code issuance here
- Include notes on user and project
- Monitor progress and feedback

---

**Code Management:** Soullab Team
**Last Updated:** 2025-01-20
**Next Review:** Weekly (Mondays)
