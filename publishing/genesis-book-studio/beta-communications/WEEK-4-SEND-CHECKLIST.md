# Week 4 Newsletter Send Checklist

**Send Date**: Monday, [Date]
**To**: All Beta Members
**Subject**: [Choose from options in newsletter]

---

## Pre-Send Checklist

### 📍 Links to Update

Before sending, replace these placeholders with actual URLs:

- [ ] `[Try MAIA Adaptive Reading →]`
  - Production URL: `https://[your-domain]/genesis/read-adaptive`
  - Or staging: `https://books.soullab.life/read-adaptive`

- [ ] `[Link to Substack]` or `[Substack link]`
  - Your essay: https://soullab.substack.com/p/[slug]

- [ ] `[Share Your Experience →]`
  - Feedback form or email: hello@soullab.life
  - Or Typeform: [create feedback form]

- [ ] `[Your Dashboard]`
  - Beta member dashboard URL

- [ ] `[Week 4 Check-in Form]`
  - Create check-in form (optional)

- [ ] `[Beta Community Discussion]`
  - Discord/Slack/Forum link (if applicable)

---

## Setup Tasks

### 1. Deploy MAIA Adaptive Reading

**Option A: Integrate into main platform**
```bash
# Move to /apps/web/app/genesis/read-adaptive
# Share auth/database with main app
```

**Option B: Deploy as subdomain**
```bash
# Deploy genesis-book-studio separately
# Point books.soullab.life or genesis.soullab.life
```

**Option C: Keep on localhost for private beta**
```bash
# Give beta members VPN/access to localhost:3002
# Or deploy to private staging URL
```

**Decision needed**: Which deployment strategy?

---

### 2. Beta Member Access

- [ ] Ensure all beta members have accounts in Supabase
- [ ] Verify RLS policies allow beta members to create paths
- [ ] Test with non-admin account to confirm access
- [ ] Create reader_profiles for existing beta members (if needed)

**Quick script to create profiles**:
```sql
INSERT INTO reader_profiles (user_id, learning_style, element_bias)
SELECT id, 'conceptual', '{}'::jsonb
FROM auth.users
WHERE email IN (SELECT email FROM beta_members);
```

---

### 3. Feedback Collection

**Create feedback form with questions**:

1. Did you try MAIA Adaptive Reading? (Yes/No)

2. What intent did you select? (Anger/Focus/Transition/Grief/Evidence)

3. Did the path MAIA created resonate with your actual need? (Scale 1-5)

4. What did MAIA get right?

5. What did she miss or get wrong?

6. How did this feel different from normal recommendations (like Netflix, Amazon, etc.)?

7. Would you use this again? Why or why not?

8. Any bugs or technical issues?

9. Other thoughts?

**Tools**:
- Typeform (beautiful, easy)
- Google Forms (simple, free)
- Custom form in dashboard (integrated)

---

### 4. Essay Publication

- [x] Published on Substack ✅
- [ ] Add canonical link from soullab.life/essays
- [ ] Cross-post to Medium (optional)
- [ ] Share on social media

---

## Newsletter Platforms

### Option 1: Via Substack
- Use your existing Substack
- Send to beta subscribers list
- Paste markdown into editor

### Option 2: Via Email Service
- Mailchimp
- ConvertKit
- Custom email via SendGrid

### Option 3: Direct from Platform
- Send via Soullab dashboard notifications
- In-app + email combo

---

## Suggested Send Schedule

**Monday Morning** (ideal):
- 9am local time
- Gives them all week to try it
- Sets tone for the week

**Alternative: Sunday Evening**
- 6pm Sunday
- They wake up Monday to it
- Reflective weekend energy

---

## Post-Send Tasks

### Day 1 (Monday)
- [ ] Monitor email open rates
- [ ] Watch for replies/feedback
- [ ] Check if anyone tries adaptive reading (track via database)
- [ ] Respond to any questions promptly

### Day 3 (Wednesday)
- [ ] Send follow-up to those who haven't tried it yet
- [ ] Share early feedback/testimonials with group
- [ ] Address any bugs discovered

### Day 7 (Next Monday)
- [ ] Compile insights from week
- [ ] Update MAIA based on learnings
- [ ] Prepare Week 5 newsletter with findings

---

## Backup Plan

**If MAIA isn't fully deployed by Monday**:

Alternative newsletter angle:
- "We built something amazing—here's a sneak peek"
- Share the essay + screenshots
- "Coming to your dashboard next week"
- Build anticipation

Or:
- Invite 5-10 early testers first
- Get their feedback
- Full rollout in Week 5

---

## Email Metrics to Track

- Open rate (aim for >40% for engaged beta)
- Click-through on "Try MAIA" link
- Essay reads
- Feedback form completions
- Actual usage in database (reading_paths created)

---

## Decision Points Before Send

1. **Where is MAIA deployed?**
   - [ ] Production URL: ___________
   - [ ] Staging URL: ___________
   - [ ] Not deployed yet (delay send)

2. **How do beta members access it?**
   - [ ] Via dashboard
   - [ ] Direct link
   - [ ] Invitation-only

3. **Is feedback form ready?**
   - [ ] Yes, URL: ___________
   - [ ] No, will collect via email

4. **Database ready?**
   - [ ] Tables created ✅
   - [ ] Beta members have access
   - [ ] Tested with non-admin account

---

## Quick Test Protocol

**Before sending to all beta members, test with 1-2 people**:

1. Send them the newsletter
2. Have them click "Try MAIA"
3. Watch them use it (screen share if possible)
4. Note any confusion/bugs
5. Fix critical issues
6. Then send to full list

---

## Contact Plan

**If issues arise after send**:
- Acknowledge quickly (within 1 hour)
- "We're seeing [issue], working on it"
- Update when fixed
- Thank them for patience

**Beta members expect some roughness—be transparent, fix fast, communicate well.**

---

## Ready to Send?

- [ ] All links updated
- [ ] MAIA deployed and tested
- [ ] Feedback form created
- [ ] Beta members have access
- [ ] Newsletter reviewed and polished
- [ ] Send time scheduled
- [ ] Post-send monitoring plan in place

**When all boxes checked → Hit send! 🚀**

---

**Created**: October 25, 2025
**For**: Week 4 Beta Newsletter
**Status**: Ready for review
