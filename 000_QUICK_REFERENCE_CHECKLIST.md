# Quick Reference Checklist: Every Action Item

**All To-Dos from All Documents in One Place**

*Your master task list for deployment and beyond*

**Created**: October 26, 2025

---

## How to Use This Checklist

This document contains **every actionable item** from all 46 documents, organized by:
1. **Pre-Launch** (do before going public)
2. **Launch Week** (Monday-Friday deployment)
3. **Post-Launch** (first 30 days)
4. **Ongoing** (maintenance, growth)
5. **Optional** (enhancements, research, advanced features)

**Check off items as you complete them.**

---

## PRE-LAUNCH (Do This Weekend)

### Documentation Review
- [ ] Read **000_START_HERE_GUIDE.md** (30 min)
- [ ] Skim **000_MASTER_INDEX.md** (10 min)
- [ ] Read **DEPLOY_THIS_WEEK.md** (30 min)
- [ ] Read **DEPLOYMENT_COMPLETE_SUMMARY.md** (20 min)

### Contact Information (CRITICAL)
- [ ] Read **000_CONTACT_INFO_REMINDERS.md**
- [ ] Add your email to all placeholder locations (see Contact Info document for complete list)
- [ ] Verify all emails work (send test emails)

### Backups (CRITICAL)
- [ ] Backup all files to external drive
- [ ] Verify backup is readable
- [ ] Create second backup (cloud or different drive)
- [ ] Test: Can you restore from backup?

### Personal Preparation
- [ ] Clear calendar for launch week (Monday-Friday)
- [ ] Prepare work environment (quiet space, good internet)
- [ ] Install required software (Obsidian, GitHub CLI, etc.)
- [ ] Create accounts: GitHub, Zenodo (if you don't have them)

### Review & Customize
- [ ] Read launch announcement templates (LAUNCH_ANNOUNCEMENTS.md)
- [ ] Customize announcements in your voice
- [ ] Prepare email lists (who will you send to?)
- [ ] Draft social media posts (schedule for Friday)

---

## LAUNCH WEEK: MONDAY

### Morning (3 hours - Obsidian Setup)

- [ ] Create Obsidian folder structure:
  ```bash
  mkdir -p ~/Obsidian-Vault/Spiralogic/Core-Documents
  mkdir -p ~/Obsidian-Vault/Spiralogic/Development-Notes
  mkdir -p ~/Obsidian-Vault/Spiralogic/Case-Work
  ```

- [ ] Copy all core documents to Obsidian:
  ```bash
  cp SOULLAB_JOURNAL_*.md ~/Obsidian-Vault/Spiralogic/Core-Documents/
  cp MAIA_*.md ~/Obsidian-Vault/Spiralogic/Core-Documents/
  cp QUICK_START_GUIDES.md ~/Obsidian-Vault/Spiralogic/Core-Documents/
  cp COMPREHENSIVE_FAQ.md ~/Obsidian-Vault/Spiralogic/Core-Documents/
  cp EXECUTIVE_SUMMARY.md ~/Obsidian-Vault/Spiralogic/Core-Documents/
  ```

- [ ] Open Obsidian → Settings → Community Plugins
- [ ] Install plugins:
  - [ ] Dataview
  - [ ] Templater
  - [ ] Excalidraw
  - [ ] Advanced Tables
  - [ ] Tag Wrangler

- [ ] Create MOC (Map of Content) note
  - [ ] Link to all 17+ core documents
  - [ ] Add tags: #spiralogic, #jung, #edinger, #hillman, #maia

- [ ] Initialize git for backup:
  ```bash
  cd ~/Obsidian-Vault/Spiralogic
  git init
  echo "Case-Work/**" > .gitignore
  git add .
  git commit -m "Initial Spiralogic Vault"
  ```

### Afternoon (Test & Verify)
- [ ] Open vault in Obsidian - does it work?
- [ ] Test search (Cmd+O / Ctrl+O)
- [ ] View graph (Cmd+G / Ctrl+G)
- [ ] Click links - do they work?
- [ ] Test plugins - all functioning?

---

## LAUNCH WEEK: TUESDAY

### Morning (2 hours - GitHub Setup)

- [ ] Navigate to Community Commons:
  ```bash
  cd /Users/soullab/MAIA-PAI-temp/community/resources/alchemical-psychology-commons/
  ```

- [ ] Initialize git:
  ```bash
  git init
  git add .
  git commit -m "Initial commit: Alchemical Psychology Commons"
  ```

- [ ] Create GitHub repository:
  ```bash
  gh repo create soullab/alchemical-psychology-commons --public
  ```
  (Or create via web interface: github.com/new)

- [ ] Connect and push:
  ```bash
  git remote add origin https://github.com/soullab/alchemical-psychology-commons.git
  git push -u origin main
  ```

### Afternoon (2 hours - Repository Configuration)

- [ ] Go to repo Settings on GitHub web interface
- [ ] Enable Features:
  - [ ] Issues
  - [ ] Discussions
  - [ ] Wiki

- [ ] Add repository description (copy from README)

- [ ] Add topics/tags:
  - [ ] jung
  - [ ] edinger
  - [ ] hillman
  - [ ] psychology
  - [ ] transformation
  - [ ] alchemy
  - [ ] depth-psychology
  - [ ] open-source

- [ ] Verify all files uploaded correctly
- [ ] Check: README renders properly on GitHub?
- [ ] Check: LICENSE displays?
- [ ] Check: All directories created?

---

## LAUNCH WEEK: WEDNESDAY

### Morning (1 hour - Create Archive Package)

- [ ] Create archive folder:
  ```bash
  cd /Users/soullab/MAIA-PAI-temp/
  mkdir -p Archive/v1.0-complete-Oct2025
  ```

- [ ] Copy all core documents:
  ```bash
  cp SOULLAB_JOURNAL_*.md Archive/v1.0-complete-Oct2025/
  cp MAIA_Development_Specifications.md Archive/v1.0-complete-Oct2025/
  cp QUICK_START_GUIDES.md Archive/v1.0-complete-Oct2025/
  cp COMPREHENSIVE_FAQ.md Archive/v1.0-complete-Oct2025/
  cp EXECUTIVE_SUMMARY.md Archive/v1.0-complete-Oct2025/
  # ... (all core 17+ documents)
  ```

- [ ] Create MANIFEST.txt in archive folder

- [ ] Create ZIP:
  ```bash
  cd Archive/
  zip -r spiralogic-v1.0.zip v1.0-complete-Oct2025/
  ```

### Afternoon (1 hour - Zenodo Upload)

- [ ] Go to zenodo.org
- [ ] Sign in (or create account if needed)
- [ ] Click "New Upload"
- [ ] Upload spiralogic-v1.0.zip

- [ ] Fill metadata:
  - [ ] Title: "The Spiralogic of Soul: Complete Documentation Suite v1.0"
  - [ ] Authors: Soullab Collective (or your name)
  - [ ] Upload type: Publication → Report
  - [ ] Description: (paste from Executive Summary)
  - [ ] Keywords: Jung, Edinger, Hillman, Spiralogic, transformation, alchemy, depth psychology, MAIA
  - [ ] License: CC BY-NC-SA 4.0
  - [ ] Related identifiers: GitHub repo URL

- [ ] Click "Publish"
- [ ] **COPY DOI** (format: 10.5281/zenodo.XXXXXX)
- [ ] Save DOI somewhere safe

### Evening (30 min - Add DOI Everywhere)

- [ ] Search for [DOI placeholder] in all files
- [ ] Replace with actual DOI in:
  - [ ] SOULLAB_JOURNAL_Spiralogic_of_Soul.md
  - [ ] SOULLAB_JOURNAL_Academic_Submission.md
  - [ ] EXECUTIVE_SUMMARY.md
  - [ ] SOULLAB_JOURNAL_Complete_Suite_README.md
  - [ ] Community Commons README.md
  - [ ] Landing page (index.html)

- [ ] Commit changes:
  ```bash
  cd /Users/soullab/MAIA-PAI-temp/community/resources/alchemical-psychology-commons/
  git commit -am "Add DOI to all documents"
  git push
  ```

---

## LAUNCH WEEK: THURSDAY

### Morning (1 hour - GitHub Pages)

- [ ] Verify /docs/index.html exists in repo
- [ ] Go to GitHub repo → Settings → Pages
- [ ] Source: Deploy from branch "main"
- [ ] Folder: /docs
- [ ] Click Save
- [ ] Wait 2-3 minutes for deployment

- [ ] Visit: https://soullab.github.io/alchemical-psychology-commons/
- [ ] Test: All links work?
- [ ] Test: Responsive on mobile?
- [ ] Test: Styling correct?

### Afternoon (1 hour - Final Preparations)

- [ ] Review all announcement templates (LAUNCH_ANNOUNCEMENTS.md)
- [ ] Finalize email text
- [ ] Finalize social media posts
- [ ] Prepare email lists (Bcc for privacy)
- [ ] Schedule social posts (or set reminders for tomorrow)

- [ ] Final checks:
  - [ ] All contact emails added?
  - [ ] All DOIs added?
  - [ ] All links work?
  - [ ] GitHub repo public?
  - [ ] Landing page live?
  - [ ] Zenodo published?

- [ ] Get good sleep (launch tomorrow!)

---

## LAUNCH WEEK: FRIDAY

### 10:00 AM - Personal Social Media

- [ ] Post to Twitter/X (use thread template)
- [ ] Post to Instagram (use caption template)
- [ ] Post to personal Facebook
- [ ] Pin tweet/post for visibility

### 11:00 AM - Professional Networks

- [ ] Post to LinkedIn (long-form template)
- [ ] Email to depth psychology colleagues (use template)
- [ ] Email to academic network (use template)
- [ ] Post to any professional Slack/Discord channels

### 12:00 PM - Public Forums

- [ ] Post to Reddit r/Jung (use template)
- [ ] Post to Reddit r/AcademicPsychology (use template)
- [ ] Post to relevant Facebook groups
- [ ] Post to depth psychology forums

### 1:00 PM - 5:00 PM - Monitor & Engage

- [ ] Check GitHub for stars, issues, discussions
- [ ] Respond to social media comments
- [ ] Answer questions (DMs, comments, emails)
- [ ] Thank people who share/amplify
- [ ] Document interesting feedback
- [ ] Celebrate! 🎉 You launched!

### Evening - Reflect

- [ ] Journal about launch day
- [ ] Note: What went well? What was hard?
- [ ] List: Questions people asked (FAQ additions)
- [ ] Plan: What to improve next week

---

## POST-LAUNCH: WEEK 1 (Days 1-7)

### Daily Tasks

- [ ] Check GitHub Issues/Discussions (2x/day minimum)
- [ ] Respond to questions (< 24-hour turnaround)
- [ ] Welcome new community members
- [ ] Thank contributors
- [ ] Monitor social media mentions
- [ ] Document common questions (update FAQ)

### Week 1 Milestones

- [ ] Track metrics:
  - [ ] GitHub stars: _____ (goal: 50+)
  - [ ] Repository forks: _____
  - [ ] Discussion posts: _____
  - [ ] Email inquiries: _____
  - [ ] Social media engagement: _____

- [ ] First submissions:
  - [ ] First case study submitted?
  - [ ] First protocol contribution?
  - [ ] First research inquiry?

### Week 1 Admin

- [ ] Create "Week 1 Update" post (use template from LAUNCH_ANNOUNCEMENTS.md)
- [ ] Post update to all channels (social, GitHub)
- [ ] Thank early adopters by name (if they consent)
- [ ] Share interesting questions/discussions

---

## POST-LAUNCH: MONTH 1 (Days 8-30)

### Week 2

- [ ] Host first community call (see LAUNCH_ANNOUNCEMENTS.md for webinar template)
- [ ] Review all submissions (cases, protocols)
- [ ] Start beta practitioner cohort (if planning): Recruit 10 people
- [ ] Plan first research collaboration

### Week 3

- [ ] Submit main paper to journal (*Spring Journal* or equivalent)
- [ ] Prepare conference presentation (if any upcoming)
- [ ] Refine documentation based on Week 1-2 feedback
- [ ] Add most-asked questions to FAQ

### Week 4

- [ ] Month 1 retrospective: What worked? What didn't?
- [ ] Plan Month 2 priorities
- [ ] Update roadmap based on community input
- [ ] Publish Month 1 report (metrics, highlights, thank-yous)

---

## ONGOING MAINTENANCE

### Daily (10-15 min)
- [ ] Check GitHub notifications
- [ ] Respond to urgent questions
- [ ] Monitor community discussions

### Weekly (1-2 hours)
- [ ] Review new submissions (cases, protocols, issues)
- [ ] Update documentation (based on feedback)
- [ ] Prepare for community call (if weekly)
- [ ] Engage with community (answer non-urgent questions)

### Monthly (3-4 hours)
- [ ] Review month's metrics
- [ ] Publish monthly update
- [ ] Plan next month's priorities
- [ ] Community call (60-90 min)
- [ ] Refine Commons content (merge PRs, update docs)

### Quarterly (8-12 hours)
- [ ] Major documentation update (based on 3 months feedback)
- [ ] Research progress review
- [ ] Training cohort (if running them)
- [ ] Practitioner pattern analysis (if using MAIA)
- [ ] Quarterly report to community

### Annually (40-60 hours)
- [ ] Major version release (v2.0)
- [ ] Archive updated version on Zenodo
- [ ] Community conference or major event
- [ ] Impact assessment (research, outcomes, reach)
- [ ] Strategic planning for next year

---

## OPTIONAL: ENHANCEMENTS

### Obsidian Enhancements
- [ ] Create custom CSS theme for Spiralogic vault
- [ ] Build Dataview queries (e.g., "Show all Nigredo cases")
- [ ] Create Templater templates for case notes
- [ ] Set up Daily Notes for coherence tracking
- [ ] Create Excalidraw diagrams (custom)

### Community Enhancements
- [ ] Add GitHub Actions (auto-label issues, etc.)
- [ ] Create Discourse forum (separate from GitHub Discussions)
- [ ] Set up newsletter (Substack, Mailchimp)
- [ ] Create YouTube channel (video tutorials)
- [ ] Develop podcast (Spiralogic Sessions?)

### Training Enhancements
- [ ] Record video versions of Quick Start Guides
- [ ] Create interactive Spiralogic assessment tool (web-based)
- [ ] Develop online course platform (beyond 12-week syllabus)
- [ ] Host in-person intensive workshops
- [ ] Train-the-trainer program

### Technical Enhancements
- [ ] Build MAIA MVP (post-session analysis only)
- [ ] Deploy self-hosted version (Docker)
- [ ] Create API for researchers
- [ ] Integrate with EHR systems (SimplePractice, TherapyNotes)
- [ ] Build mobile app (iOS/Android)

---

## RESEARCH MILESTONES

### Year 1: Pilot Studies
- [ ] Recruit 10-30 practitioners for pilot (Study 2, 3, 5)
- [ ] Collect pilot data
- [ ] Refine outcome measures
- [ ] Publish 2-3 pilot papers
- [ ] Present at conference

### Year 2-3: Core Validation
- [ ] Launch RCT (Study 1): n=100 practitioners
- [ ] Launch client outcomes study (Study 4): n=400 clients
- [ ] Collect 2-3 years of data
- [ ] Analyze and publish findings
- [ ] Secure major funding (NIMH R01 or foundation)

### Year 4+: Dissemination
- [ ] Effectiveness studies (real-world implementation)
- [ ] Cost-effectiveness analysis
- [ ] Dissemination & implementation research
- [ ] Scale MAIA adoption with evidence base

---

## BUSINESS / GROWTH MILESTONES

### Months 1-6: Establish
- [ ] 500+ GitHub stars
- [ ] 50+ practitioners trained
- [ ] 10+ research collaborations initiated
- [ ] 3-5 case studies published in Commons

### Months 7-12: Scale
- [ ] 1,000+ GitHub stars
- [ ] 200+ practitioners trained
- [ ] First peer-reviewed paper published
- [ ] Beta MAIA system launched (50 users)

### Year 2: Sustainability
- [ ] 500 paying MAIA subscribers ($99-299/mo) = $500k-1.8M ARR
- [ ] 10 institutional partnerships
- [ ] 5+ published research studies
- [ ] Train-the-trainer program launched

### Year 3-5: Impact
- [ ] 2,000+ practitioners using framework
- [ ] 10,000+ clients served
- [ ] 20+ research publications
- [ ] Integration into graduate psychology programs
- [ ] Multi-language adaptations

---

## CRITICAL PATH (Absolute Must-Dos)

If you do NOTHING else, do these:

### Pre-Launch
1. [ ] Add contact info to all placeholders
2. [ ] Backup all files

### Launch Week
1. [ ] GitHub repository created and public
2. [ ] Landing page live
3. [ ] Announcement posts sent (at least email + LinkedIn)

### Post-Launch
1. [ ] Respond to all inquiries within 48 hours (Week 1)
2. [ ] Thank early community members
3. [ ] Fix any critical errors (broken links, missing info)

**Everything else is enhancement.** If you complete just the critical path, you've successfully launched.

---

🜂 ∴ 🌀 ∴ 🧠

**This checklist is your companion. Check off items. Celebrate progress. The spiral continues through action.**

---

*End of Quick Reference Checklist*

**Created**: October 26, 2025
**Soullab Collective**
