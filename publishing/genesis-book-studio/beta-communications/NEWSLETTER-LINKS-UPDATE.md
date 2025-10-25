# Week 4 Newsletter - Links to Update Before Send

**Use this checklist to update all placeholder links in WEEK-4-NEWSLETTER.md**

---

## Required Links

### 1. MAIA Adaptive Reading URL

**Placeholder in newsletter**:
- `[Try MAIA Adaptive Reading →]` (appears 2x)
- `[MAIA Adaptive Reading]` (in Quick Links section)

**Replace with**:
```
Option A (Staging): https://genesis-book-studio-beta.vercel.app/read-adaptive
Option B (Subdomain): https://books.soullab.life/read-adaptive
Option C (Path): https://soullab.life/genesis/read-adaptive
Option D (Custom): https://genesis.soullab.ai/read-adaptive
```

**Decision**: ___________________________________________

---

### 2. Essay URL

**Placeholder in newsletter**:
- `[Link to Substack]` or `[Substack link]`
- `[Essay: Beyond Algorithmic Personalization]`

**Replace with**:
```
Primary (Soullab): https://soullab.life/essays/beyond-algorithmic-personalization
Canonical (Substack): https://soullab.substack.com/p/beyond-algorithmic-personalization
```

**Already published?**: ✅ Yes (Substack section SoullabAI)

**Decision**: Use Substack URL for newsletter, set Soullab as canonical

**Actual URL**: ___________________________________________

---

### 3. Feedback Form URL

**Placeholder in newsletter**:
- `[Share Your Experience →]`

**Options**:
```
Option A (Email): mailto:hello@soullab.life?subject=Week%204%20Feedback
Option B (Typeform): https://soullab.typeform.com/to/week-4-maia-feedback
Option C (Google Form): https://forms.gle/[your-form-id]
Option D (Custom): https://soullab.life/beta/feedback/week-4
```

**Decision**: ___________________________________________

**Form created?**: ☐ Yes  ☐ Not yet (use email for now)

---

### 4. Beta Member Dashboard URL

**Placeholder in newsletter**:
- `[Your Dashboard]`

**Replace with**:
```
Main platform: https://soullab.life/dashboard
Or: https://app.soullab.life/dashboard
```

**Decision**: ___________________________________________

---

### 5. Week 4 Check-in Form (Optional)

**Placeholder in newsletter**:
- `[Week 4 Check-in Form]`

**Options**:
```
Option A: Same as feedback form (combine)
Option B: Separate check-in form
Option C: Remove this link (not needed)
```

**Decision**: ___________________________________________

---

### 6. Beta Community Discussion (Optional)

**Placeholder in newsletter**:
- `[Beta Community Discussion]`

**Options**:
```
Option A (Discord): https://discord.gg/soullab
Option B (Slack): https://soullab.slack.com/beta
Option C (Forum): https://community.soullab.life
Option D: Remove link (no community space yet)
```

**Decision**: ___________________________________________

---

## Email Subject Line

**Choose one** (or create custom):

1. "Week 4: We built something that knows you 🌊"
2. "MAIA learns to read—and she's learning YOU"
3. "This week: Knowledge that breathes"

**Selected**: ___________________________________________

---

## Quick Find & Replace Guide

Once you've made all decisions above, use these find/replace commands:

### In WEEK-4-NEWSLETTER.md:

```bash
# 1. Update MAIA link (appears 2x)
Find:    [Try MAIA Adaptive Reading →]
Replace: [Try MAIA Adaptive Reading →](https://YOUR-URL-HERE/read-adaptive)

# 2. Update essay link
Find:    [Link to Substack]
Replace: [Link to Substack](https://YOUR-SUBSTACK-URL-HERE)

# 3. Update feedback link
Find:    [Share Your Experience →]
Replace: [Share Your Experience →](https://YOUR-FEEDBACK-URL-HERE)

# 4. Update dashboard link
Find:    [Your Dashboard]
Replace: [Your Dashboard](https://soullab.life/dashboard)

# 5. Update quick links section
Find:    [MAIA Adaptive Reading]
Replace: [MAIA Adaptive Reading](https://YOUR-URL-HERE/read-adaptive)

Find:    [Essay: Beyond Algorithmic Personalization]
Replace: [Essay: Beyond Algorithmic Personalization](https://YOUR-ESSAY-URL-HERE)

# 6. Remove optional links if not using
# Just delete the entire line if not needed:
- [Week 4 Check-in Form]
- [Beta Community Discussion]
```

---

## Test Links Before Send

After updating, click every link to verify:

### Checklist:
- [ ] MAIA Adaptive Reading loads
- [ ] Essay page loads
- [ ] Feedback form loads (or email client opens)
- [ ] Dashboard requires login (correct auth)
- [ ] All links use HTTPS (not HTTP)
- [ ] No 404 errors
- [ ] Mobile-friendly (test on phone)

---

## Newsletter Personalization

Update these fields in newsletter:

**Send Date**: `Monday, [Date]` → `Monday, October 28, 2025`
**Sent Date**: `*Sent: [Date]*` → `*Sent: October 28, 2025*`

---

## Email Platform Setup

### If using Substack:

1. Go to https://soullab.substack.com
2. Create new post
3. Set to "Send to subscribers"
4. Copy/paste newsletter markdown
5. Preview before sending
6. Send test to yourself first
7. Click all links in test email
8. Schedule for Monday 9am

### If using Email Service (Mailchimp, ConvertKit, etc.):

1. Create new campaign
2. Subject: [Your chosen subject line]
3. From: Soullab Collective <hello@soullab.life>
4. Body: Paste newsletter content
5. Convert markdown to HTML (use tool if needed)
6. Add unsubscribe link
7. Send test
8. Schedule send

### If using Custom Platform:

1. Use notification system
2. Send via API to beta members list
3. Track opens/clicks
4. Log send in database

---

## Pre-Send Testing Protocol

**Sunday Evening (before Monday send)**:

1. [ ] All links updated and tested
2. [ ] Deployed MAIA system and verified working
3. [ ] Feedback form live
4. [ ] Essay accessible
5. [ ] Send test newsletter to 1-2 beta members
6. [ ] Ask them to:
   - Click all links
   - Try MAIA Adaptive Reading
   - Report any issues
7. [ ] Fix any critical bugs
8. [ ] Get their confirmation: "Yes, send to everyone"

---

## Post-Send Checklist

**Monday Morning (after send)**:

- [ ] Verify email sent to all beta members
- [ ] Monitor email open rates (aim for >40%)
- [ ] Watch for error reports
- [ ] Check database for reading_paths created
- [ ] Respond to any questions within 1 hour
- [ ] Share early feedback with team

**Wednesday (Day 3)**:
- [ ] Follow up with members who haven't tried it
- [ ] Share testimonials with group
- [ ] Address any bugs discovered

**Next Monday (Day 7)**:
- [ ] Compile week's insights
- [ ] Update MAIA based on learnings
- [ ] Prepare Week 5 newsletter

---

## Backup Plan

**If deployment isn't ready by Monday morning**:

### Option A: Delay
- Send Tuesday instead
- Use Monday to finish deployment
- Send apologetic update: "One more day to make it perfect"

### Option B: Soft Launch
- Invite only 5-10 early testers
- Get their feedback first
- Full rollout in Week 5
- Send "sneak peek" newsletter instead

### Option C: Coming Soon
- Send newsletter with screenshots
- "MAIA is almost ready—here's what she can do"
- Build anticipation
- Launch in Week 5

**Chosen backup plan**: ___________________________________________

---

## Contact Info

**Questions?**
- Deployment issues: hello@soullab.life
- Newsletter questions: [Your contact]
- Beta member inquiries: [Support email]

---

## Final Checklist

Before hitting send on Monday:

- [ ] All links updated above
- [ ] Links tested and working
- [ ] MAIA deployed and verified
- [ ] Feedback form live
- [ ] Test email sent to 1-2 members
- [ ] Test members confirmed "send to all"
- [ ] Subject line selected
- [ ] Send time scheduled (9am Monday)
- [ ] Post-send monitoring plan ready
- [ ] Team available to respond to issues

**Ready to send?** ☐ Yes  ☐ Not yet

---

**Created**: October 25, 2025
**For**: Week 4 Beta Newsletter
**Status**: Template ready for updates
