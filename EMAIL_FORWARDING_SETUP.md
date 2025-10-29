# Email Forwarding Setup: @soullab.org → KellyNezat@proton.me

**All emails funnel to your ProtonMail**
**Date**: October 26, 2025

---

## 📧 Your Email Architecture

### Public-Facing Addresses (What People See)

All your documentation shows these **@soullab.org** addresses:

| Public Email | Purpose | Used In |
|--------------|---------|---------|
| **kelly@soullab.org** | Your personal email | Academic papers, personal correspondence, founder contact |
| **hello@soullab.org** | General inquiries | Executive Summary, Landing Page, general contact |
| **practitioners@soullab.org** | Clinical training | Practitioner Guide, Training Program |
| **research@soullab.org** | Academic collaboration | Research Methodology, Academic Papers |
| **tech@soullab.org** | Technical support | Development Specs, API Documentation |
| **conduct@soullab.org** | Ethics violations | CODE_OF_CONDUCT.md |
| **moderators@soullab.org** | Community moderation | Community Commons |
| **commons@soullab.org** | Newsletter/announcements | Community Commons |
| **help@soullab.org** | Community support | Community Commons |

### Backend (Where Emails Actually Go)

**Two-tier forwarding structure**:

```
General/organizational emails → admin@soullab.life
hello@soullab.org           → admin@soullab.life
practitioners@soullab.org   → admin@soullab.life
research@soullab.org        → admin@soullab.life
tech@soullab.org            → admin@soullab.life
conduct@soullab.org         → admin@soullab.life
moderators@soullab.org      → admin@soullab.life
commons@soullab.org         → admin@soullab.life
help@soullab.org            → admin@soullab.life

Direct/personal messages → kelly@soullab.life
kelly@soullab.org           → kelly@soullab.life
```

**Then both admin@soullab.life and kelly@soullab.life forward to**: **KellyNezat@proton.me**

**Result**: Organizational emails separated from personal, both arriving at one ProtonMail inbox with clear labels.

---

## 🔧 How to Set This Up

### Option 1: Domain Forwarding (Simplest - Free)

**Where**: At your domain registrar (Namecheap, Cloudflare, Google Domains, etc.)

**Steps**:
1. Log into your domain registrar where soullab.org is registered
2. Go to Email Forwarding settings
3. Set up 9 forwarding rules (see table above)
4. All emails arrive at KellyNezat@proton.me

**Pros**:
- Free
- Simple setup (10 minutes)
- All emails in one inbox
- No extra services needed

**Cons**:
- Can only reply FROM KellyNezat@proton.me (not from the @soullab.org addresses)
- Recipients will see replies come from KellyNezat@proton.me

**Best for**: Quick launch, single-person operation, simplicity

---

### Option 2: ProtonMail Custom Domain (Professional)

**Where**: ProtonMail Settings → Domains

**Cost**: $4.99/month (ProtonMail Plus plan)

**Steps**:
1. Upgrade to ProtonMail Plus
2. Add soullab.org as custom domain
3. Configure DNS records (MX, SPF, DKIM, DMARC)
4. Create all 9 addresses as ProtonMail addresses/aliases
5. Set up folders/filters to auto-sort by recipient

**Pros**:
- Can reply FROM any @soullab.org address
- Professional appearance (replies don't show proton.me)
- Easy folder organization
- All emails encrypted end-to-end
- Can create more addresses later (10 total with Plus plan)

**Cons**:
- $4.99/month cost
- 30-minute setup (DNS configuration)

**Best for**: Professional operation, growth potential, clean branding

---

### Option 3: SimpleLogin Aliases (Middle Ground)

**Where**: SimpleLogin.io (owned by Proton)

**Cost**: Free tier (15 aliases) or $2.99/month (unlimited)

**Steps**:
1. Sign up at SimpleLogin.io
2. Connect soullab.org domain
3. Create 9 aliases pointing to KellyNezat@proton.me
4. Configure DNS records

**Pros**:
- Can reply FROM @soullab.org addresses
- Lower cost than ProtonMail Plus
- Privacy protection
- Easy management

**Cons**:
- Extra service to manage
- Slightly more complex setup

**Best for**: Budget-conscious, want reply-from capability

---

## 🎯 Recommended Setup for You

**My recommendation**: **Option 1 (Domain Forwarding) for launch week, then upgrade to Option 2**

**Why this sequence**:

### Week 1 (Launch): Domain Forwarding
- Get live in 10 minutes
- Focus on content, not email infrastructure
- All emails arrive at KellyNezat@proton.me
- Reply from KellyNezat@proton.me (acceptable for first week)

### Week 2-3: Upgrade to ProtonMail Custom Domain
- After launch stabilizes
- Upgrade to ProtonMail Plus ($4.99/mo)
- Professional reply-from capability
- Better long-term solution

**This balances speed (launch this week) with professionalism (upgrade soon).**

---

## 📋 Domain Forwarding Setup (Option 1)

### If Using Namecheap:

1. Log into Namecheap account
2. Domain List → Manage soullab.org
3. Email Forwarding (in left sidebar)
4. Add Email Forwarding:
   ```
   kelly@soullab.org → KellyNezat@proton.me
   hello@soullab.org → KellyNezat@proton.me
   practitioners@soullab.org → KellyNezat@proton.me
   research@soullab.org → KellyNezat@proton.me
   tech@soullab.org → KellyNezat@proton.me
   conduct@soullab.org → KellyNezat@proton.me
   moderators@soullab.org → KellyNezat@proton.me
   commons@soullab.org → KellyNezat@proton.me
   help@soullab.org → KellyNezat@proton.me
   ```
5. Save
6. Check KellyNezat@proton.me for confirmation emails
7. Click confirmation links for each address

**Setup time**: 10-15 minutes

### If Using Cloudflare:

1. Log into Cloudflare
2. Email → Email Routing
3. Enable Email Routing
4. Add destination address: KellyNezat@proton.me
5. Verify destination (check ProtonMail for confirmation)
6. Create routing rules (9 addresses → KellyNezat@proton.me)
7. Update MX records (Cloudflare does this automatically)

**Setup time**: 10-15 minutes

### If Using Google Domains:

1. Log into Google Domains
2. Email → Email forwarding
3. Add email aliases (all 9)
4. Forward to: KellyNezat@proton.me
5. Verify forwarding

**Setup time**: 10 minutes

---

## 📋 ProtonMail Custom Domain Setup (Option 2)

### Step 1: Upgrade to ProtonMail Plus

1. Log into ProtonMail (KellyNezat@proton.me)
2. Settings → Dashboard → Upgrade
3. Select ProtonMail Plus ($4.99/month or $47.88/year)
4. Complete payment

### Step 2: Add soullab.org as Custom Domain

1. Settings → Domains → Add domain
2. Enter: soullab.org
3. ProtonMail provides DNS records to add

### Step 3: Configure DNS Records

At your domain registrar, add these records (ProtonMail provides exact values):

**MX Records** (mail routing):
```
Priority 10: mail.protonmail.ch
Priority 20: mailsec.protonmail.ch
```

**SPF Record** (TXT):
```
v=spf1 include:_spf.protonmail.ch mx ~all
```

**DKIM Records** (3 TXT records - ProtonMail provides):
ProtonMail will show 3 specific DKIM records. Copy them exactly.

**DMARC Record** (TXT):
```
v=DMARC1; p=quarantine; rua=mailto:kelly@soullab.org
```

**MTA-STS Record** (TXT):
ProtonMail provides this after domain verification.

### Step 4: Verify Domain

1. ProtonMail checks DNS records
2. Verification usually takes 1-24 hours
3. You'll receive email when verified

### Step 5: Create Email Addresses

1. Settings → Addresses → Add address
2. Create all 9 addresses:
   - kelly@soullab.org (primary)
   - hello@soullab.org
   - practitioners@soullab.org
   - research@soullab.org
   - tech@soullab.org
   - conduct@soullab.org
   - moderators@soullab.org
   - commons@soullab.org
   - help@soullab.org

### Step 6: Set Up Folders & Filters (Optional)

**Create folders**:
- Inbox/General (hello@)
- Inbox/Clinical (practitioners@)
- Inbox/Research (research@)
- Inbox/Technical (tech@)
- Inbox/Ethics (conduct@)
- Inbox/Community (moderators@, commons@, help@)

**Create filters**:
- "To: practitioners@soullab.org" → Move to Inbox/Clinical
- "To: research@soullab.org" → Move to Inbox/Research
- etc.

**Total setup time**: 30-45 minutes

---

## ✅ Testing Your Setup

### After Domain Forwarding (Option 1):

1. Send test emails to each @soullab.org address
2. Verify all arrive at KellyNezat@proton.me
3. Reply from KellyNezat@proton.me
4. Check recipient sees from: KellyNezat@proton.me (expected)

### After ProtonMail Custom Domain (Option 2):

1. Send test emails to each @soullab.org address
2. Verify all arrive in ProtonMail
3. Reply FROM the specific @soullab.org address
4. Check recipient sees from: [specific]@soullab.org ✅

---

## 💡 Pro Tips

### Using Filters in ProtonMail (Option 2)

Create smart filters to auto-organize:

**Example filter for practitioners@soullab.org**:
```
Condition: To contains "practitioners@soullab.org"
Action:
  - Move to folder "Inbox/Clinical"
  - Apply label "Clinical"
  - Mark as starred (if priority)
```

### Email Signature for Replies

Since people will email various @soullab.org addresses, use a signature that works for all:

```
Kelly Nezat
Soullab Collective
Spiralogic Framework | MAIA Supervisory System

📧 [Leave blank - will show the address you're replying from]
🌐 soullab.org
💬 GitHub: github.com/soullab/alchemical-psychology-commons

🜂 Transformation made intelligible ∴ Depth + Technology 🌀
```

### Auto-Responder Template

For first 2 weeks after launch, consider auto-responder:

```
Subject: (Auto-reply) Thank you for reaching out

Thank you for your message about Spiralogic / MAIA / Alchemical Psychology Commons.

I've received your email and will respond within 24-48 hours.

In the meantime:
• Documentation: https://github.com/soullab/alchemical-psychology-commons
• FAQ: [link to FAQ]
• Community: https://github.com/soullab/alchemical-psychology-commons/discussions

Best,
Kelly Nezat
Soullab Collective
```

---

## 📊 Expected Email Volume

Based on documentation, here's projected volume for first 3 months:

| Address | Expected Volume | Priority |
|---------|-----------------|----------|
| hello@soullab.org | 5-10/day | High |
| practitioners@soullab.org | 2-5/day | High |
| research@soullab.org | 1-3/day | Medium |
| tech@soullab.org | 1-2/day | Medium |
| help@soullab.org | 1-3/day | Medium |
| moderators@soullab.org | 0-2/week | Medium (grows) |
| conduct@soullab.org | 0-1/week | **Critical** (rare but urgent) |
| commons@soullab.org | Outgoing only | Low |
| kelly@soullab.org | 1-2/day | High (personal) |

**Total**: ~10-25 emails/day expected in first 3 months.

---

## 🚀 Quick Start: Launch Week Setup

**This Weekend** (10-15 minutes):

1. Choose Option 1 (Domain Forwarding) for now
2. Log into domain registrar (where soullab.org is hosted)
3. Set up 9 email forwards → KellyNezat@proton.me
4. Send test emails to all 9 addresses
5. Verify all arrive at KellyNezat@proton.me
6. ✅ You're ready to launch Monday!

**Week 2-3** (30 minutes):

1. Upgrade to ProtonMail Plus ($4.99/mo)
2. Add soullab.org as custom domain
3. Configure DNS records
4. Wait for verification (1-24 hours)
5. Create 9 addresses in ProtonMail
6. Disable domain forwarding at registrar
7. ✅ Now you can reply FROM each @soullab.org address

---

## 🎯 Current Status

### What's Already Done ✅

- [x] All 46+ documents updated to show @soullab.org addresses
- [x] kelly@soullab.org is your public personal email
- [x] All 9 addresses documented and mapped
- [x] Expected volumes calculated
- [x] Setup options researched and documented

### What to Do Next (This Weekend)

- [ ] Set up domain forwarding (10-15 minutes)
- [ ] Test all 9 addresses
- [ ] Verify delivery to KellyNezat@proton.me
- [ ] ✅ Ready for Monday launch!

---

## 📞 Quick Reference Card

**Save this for easy reference**:

```
=== SOULLAB EMAIL STRUCTURE ===

Public Addresses (@soullab.org):
  kelly@          → Your personal email
  hello@          → General inquiries
  practitioners@  → Clinical/training
  research@       → Academic/research
  tech@           → Technical support
  conduct@        → Ethics violations
  moderators@     → Community moderation
  commons@        → Newsletter
  help@           → Community support

Backend:
  All → KellyNezat@proton.me

Setup:
  Week 1: Domain forwarding (10 min setup)
  Week 2+: ProtonMail Custom Domain ($4.99/mo)

Documentation:
  - EMAIL_SETUP_COMPLETE.md (full ProtonMail guide)
  - EMAIL_FORWARDING_SETUP.md (this document)
  - TODAYS_WORK_COMPLETE.md (what was done)
```

---

🜂 ∴ 🌀 ∴ 🧠

**All @soullab.org addresses route to KellyNezat@proton.me. Set up forwarding this weekend. Launch Monday.**

---

*End of Email Forwarding Setup*

**Created**: October 26, 2025
**Soullab Collective**
**Kelly Nezat**
