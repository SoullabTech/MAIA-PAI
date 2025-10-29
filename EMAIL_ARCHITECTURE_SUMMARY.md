# Email Architecture Summary

**Two-Tier Forwarding Structure**
**Date**: October 26, 2025

---

## 📧 Complete Email Flow

### Layer 1: Public-Facing (@soullab.org)

**What people see in all documentation**:

```
ORGANIZATIONAL EMAILS:
  hello@soullab.org           (General inquiries)
  practitioners@soullab.org   (Clinical/training)
  research@soullab.org        (Academic/research)
  tech@soullab.org            (Technical support)
  conduct@soullab.org         (Ethics violations)
  moderators@soullab.org      (Community moderation)
  commons@soullab.org         (Newsletter)
  help@soullab.org            (Community support)

PERSONAL EMAIL:
  kelly@soullab.org           (Your personal email)
```

### Layer 2: Intermediate Routing (@soullab.life)

**Organizational emails route to**:
```
hello@soullab.org         ┐
practitioners@soullab.org │
research@soullab.org      │
tech@soullab.org          ├──▶ admin@soullab.life
conduct@soullab.org       │
moderators@soullab.org    │
commons@soullab.org       │
help@soullab.org          ┘
```

**Personal email routes to**:
```
kelly@soullab.org ──▶ kelly@soullab.life
```

### Layer 3: Final Destination (ProtonMail)

**Both intermediate addresses forward to**:
```
admin@soullab.life ┐
                   ├──▶ KellyNezat@proton.me (Single inbox)
kelly@soullab.life ┘
```

---

## 🎯 Why This Structure?

### Organizational Clarity
- **admin@soullab.life** receives all organizational/business emails
- **kelly@soullab.life** receives all personal/direct emails
- Clear separation in your inbox (filter by recipient)

### Future Flexibility
- Can add team members later (admin@ can route to multiple people)
- Personal emails stay personal (kelly@ always goes to you)
- Easy to change backend routing without touching public docs

### Professional Appearance
- Public sees clean @soullab.org addresses
- Organizational emails don't expose personal email
- Consistent branding throughout documentation

---

## ⚙️ Setup Instructions

### Step 1: Configure soullab.org Forwarding

At your domain registrar (where soullab.org is registered):

```bash
# Email Forwarding Rules for soullab.org

# Organizational → admin@soullab.life
hello@soullab.org → admin@soullab.life
practitioners@soullab.org → admin@soullab.life
research@soullab.org → admin@soullab.life
tech@soullab.org → admin@soullab.life
conduct@soullab.org → admin@soullab.life
moderators@soullab.org → admin@soullab.life
commons@soullab.org → admin@soullab.life
help@soullab.org → admin@soullab.life

# Personal → kelly@soullab.life
kelly@soullab.org → kelly@soullab.life
```

### Step 2: Configure soullab.life Forwarding

At your domain registrar (where soullab.life is registered):

```bash
# Email Forwarding Rules for soullab.life

# Both to ProtonMail
admin@soullab.life → KellyNezat@proton.me
kelly@soullab.life → KellyNezat@proton.me
```

### Step 3: Set Up ProtonMail Filters (Optional)

In ProtonMail, create filters to auto-organize:

**Filter 1: Organizational Emails**
```
Condition: To contains "admin@soullab.life"
Actions:
  - Move to folder "Inbox/Soullab/Organizational"
  - Apply label "Soullab-Org"
```

**Filter 2: Personal Emails**
```
Condition: To contains "kelly@soullab.life"
Actions:
  - Move to folder "Inbox/Soullab/Personal"
  - Apply label "Soullab-Personal"
```

---

## ✅ Testing Checklist

### Test Layer 1 → Layer 2 (soullab.org → soullab.life)

Send test emails from external account:

- [ ] hello@soullab.org → Should arrive at admin@soullab.life
- [ ] practitioners@soullab.org → Should arrive at admin@soullab.life
- [ ] research@soullab.org → Should arrive at admin@soullab.life
- [ ] tech@soullab.org → Should arrive at admin@soullab.life
- [ ] conduct@soullab.org → Should arrive at admin@soullab.life
- [ ] moderators@soullab.org → Should arrive at admin@soullab.life
- [ ] commons@soullab.org → Should arrive at admin@soullab.life
- [ ] help@soullab.org → Should arrive at admin@soullab.life
- [ ] kelly@soullab.org → Should arrive at kelly@soullab.life

### Test Layer 2 → Layer 3 (soullab.life → ProtonMail)

- [ ] admin@soullab.life → Should arrive at KellyNezat@proton.me
- [ ] kelly@soullab.life → Should arrive at KellyNezat@proton.me

### Test Complete Flow (soullab.org → soullab.life → ProtonMail)

- [ ] Send email to hello@soullab.org
- [ ] Check KellyNezat@proton.me inbox
- [ ] Verify "To:" shows admin@soullab.life
- [ ] Send email to kelly@soullab.org
- [ ] Check KellyNezat@proton.me inbox
- [ ] Verify "To:" shows kelly@soullab.life

---

## 📊 Expected Email Distribution

Based on documentation, here's where emails will go:

### admin@soullab.life (Organizational) - 80-90% of volume
- General inquiries (hello@): 5-10/day
- Clinical questions (practitioners@): 2-5/day
- Research inquiries (research@): 1-3/day
- Technical support (tech@): 1-2/day
- Community help (help@): 1-3/day
- Ethics issues (conduct@): 0-1/week
- Moderation (moderators@): 0-2/week

**Total organizational**: ~10-25/day

### kelly@soullab.life (Personal) - 10-20% of volume
- Direct messages to Kelly
- Personal correspondence
- Academic collaboration (when emailed directly)

**Total personal**: ~1-5/day

---

## 🔄 Reply Strategy

### When Replying

**From ProtonMail Free (current)**:
- All replies come from KellyNezat@proton.me
- Recipients see your actual ProtonMail address

**From ProtonMail Plus (upgraded, $4.99/mo)**:
- Can reply FROM admin@soullab.life or kelly@soullab.life
- Recipients see professional @soullab.life address
- Recommended for Week 2 after launch

---

## 💡 Pro Tips

### Email Signatures

**For Organizational Emails** (when replying to admin@soullab.life):
```
Kelly Nezat
Soullab Collective
Spiralogic Framework | MAIA Supervisory System

📧 hello@soullab.org (general inquiries)
🌐 soullab.org
💬 GitHub: github.com/soullab/alchemical-psychology-commons
```

**For Personal Emails** (when replying to kelly@soullab.life):
```
Kelly Nezat
Soullab Collective

📧 kelly@soullab.org
🌐 soullab.org
```

### Folder Structure in ProtonMail

Recommended folder organization:

```
Inbox/
  Soullab/
    Organizational/
      Hello-General/
      Practitioners/
      Research/
      Technical/
      Community/
    Personal/
      Direct/
      Academic/
```

---

## 📋 Domain Forwarding Setup (Step-by-Step)

### If Using Namecheap

**For soullab.org**:
1. Log into Namecheap
2. Domain List → Manage soullab.org
3. Email Forwarding → Add Email Forwarding
4. Add 9 rules (8 org → admin@, 1 personal → kelly@)
5. Save

**For soullab.life**:
1. Domain List → Manage soullab.life
2. Email Forwarding → Add Email Forwarding
3. Add 2 rules (admin@ → ProtonMail, kelly@ → ProtonMail)
4. Save

### If Using Cloudflare

**For soullab.org**:
1. Email → Email Routing → Enable
2. Add destination: admin@soullab.life (verify)
3. Add destination: kelly@soullab.life (verify)
4. Create routing rules (9 addresses)
5. Save

**For soullab.life**:
1. Email → Email Routing → Enable
2. Add destination: KellyNezat@proton.me (verify)
3. Create routing rules (2 addresses)
4. Save

---

## 🎯 Quick Reference

```
┌─────────────────────────────────────────────────┐
│ PUBLIC LAYER (@soullab.org)                     │
├─────────────────────────────────────────────────┤
│ 8 organizational addresses                      │
│ 1 personal address                              │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│ ROUTING LAYER (@soullab.life)                   │
├─────────────────────────────────────────────────┤
│ admin@soullab.life    (organizational)          │
│ kelly@soullab.life    (personal)                │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│ INBOX (ProtonMail)                              │
├─────────────────────────────────────────────────┤
│ KellyNezat@proton.me                           │
│   ├─ Labeled: Soullab-Org (admin@)             │
│   └─ Labeled: Soullab-Personal (kelly@)        │
└─────────────────────────────────────────────────┘
```

---

## ✨ Future Expansion

### When You Add Team Members

**Current**:
```
admin@soullab.life → KellyNezat@proton.me
```

**Future** (when adding team):
```
admin@soullab.life → Multiple team members
                     └─ KellyNezat@proton.me
                     └─ TeamMember1@example.com
                     └─ TeamMember2@example.com
```

**No need to change public-facing docs** - just update routing at soullab.life forwarding.

---

🜂 ∴ 🌀 ∴ 🧠

**Two-tier forwarding: Professional, organized, future-ready.**

---

*End of Email Architecture Summary*

**Created**: October 26, 2025
**Soullab Collective**
**Kelly Nezat**
