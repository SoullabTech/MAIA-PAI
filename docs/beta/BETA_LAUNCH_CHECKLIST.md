# MAIA Beta Launch Checklist

**Last Updated:** 2025-11-03
**Status:** Ready for Launch Preparation

---

## What We Just Completed ✅

### 1. Database & Authentication Architecture
- ✅ **Users Profile Table Migration** (`supabase/migrations/20251103_users_profile_table.sql`)
  - Created `public.users` table extending Supabase Auth
  - Soul signature generation for RelationshipAnamnesis integration
  - Support for Apple, Google, WebAuthn authentication
  - Automatic profile creation on signup via trigger
  - RLS policies for data privacy

- ✅ **OAuth Configuration Guide** (`docs/SUPABASE_OAUTH_SETUP.md`)
  - Step-by-step Apple Sign In setup (App ID, Services ID, Private Key)
  - Step-by-step Google OAuth setup (Cloud Console, OAuth client)
  - Callback URL configuration
  - Testing procedures and troubleshooting

- ✅ **Auth Page Upgrade** (`app/auth/page.tsx`)
  - Added Apple Sign In button
  - Added Google Sign In button
  - OAuth handlers with Supabase integration
  - Maintained existing username/password flow
  - Error handling and loading states

- ✅ **OAuth Callback Handler** (`app/auth/callback/route.ts`)
  - Handles OAuth redirects from providers
  - Checks onboarding status
  - Routes to `/intro` (returning users) or `/beta-onboarding` (new users)

### 2. Beta Tester Materials
- ✅ **Welcome Email** (`docs/beta/WELCOME_EMAIL.md`)
  - Warm, inviting tone aligned with Dune philosophy
  - Video tour link placeholder
  - Beta Handbook link
  - Platform access instructions
  - First prompt: "Start by talking to MAIA about what brought you here"
  - Feedback protocols and privacy information

- ✅ **Video Tour Script** (`docs/beta/VIDEO_TOUR_SCRIPT.md`)
  - **Option A:** "Your First Week with MAIA" (8-10 min, recommended)
  - **Option B:** "Platform Overview" (12-15 min, comprehensive)
  - Production notes (recording, audio, editing tips)
  - Upload checklist

### 3. Existing Materials (Already Complete)
- ✅ **BETA_HANDBOOK.md** - Comprehensive 1,250-line tester guide
- ✅ **7_DAY_SPIRALOGIC_JOURNEY.md** - Structured elemental journey
- ✅ **JOURNEY_MAP.md** - Platform emotional blueprint
- ✅ **RelationshipAnamnesis System** - Soul-level memory persistence
- ✅ **ConversationPersistence** - Cross-device conversation continuity

---

## Next Steps (Before Launch) 🚀

### Phase 1: Infrastructure Setup (Required)

#### A. Supabase Configuration
- [ ] Run database migration: `supabase/migrations/20251103_users_profile_table.sql`
- [ ] Configure Apple OAuth provider (follow `docs/SUPABASE_OAUTH_SETUP.md`)
  - [ ] Create App ID in Apple Developer
  - [ ] Create Services ID
  - [ ] Create Private Key
  - [ ] Add credentials to Supabase dashboard
- [ ] Configure Google OAuth provider (follow guide)
  - [ ] Create OAuth client in Google Cloud Console
  - [ ] Configure consent screen
  - [ ] Add credentials to Supabase dashboard
- [ ] Test OAuth flows (Apple, Google, username/password)
- [ ] Verify user profile creation in Supabase
- [ ] Confirm RelationshipAnamnesis integration

#### B. Video Production
- [ ] Choose script: "Your First Week with MAIA" (recommended)
- [ ] Record screen capture with voiceover
- [ ] Edit video (add music, transitions, text overlays)
- [ ] Upload to Loom or YouTube (unlisted)
- [ ] Get shareable link

#### C. Documentation Finalization
- [ ] Update WELCOME_EMAIL.md with actual video link
- [ ] Update links to Beta Handbook (host on soullab.life or GitHub)
- [ ] Set up feedback email: feedback@soullab.life
- [ ] Set up beta tester communication channel (Slack/Discord)

---

### Phase 2: Testing & Quality Assurance

#### A. Full User Journey Test
- [ ] Sign up with Apple → Onboarding → First MAIA conversation
- [ ] Sign up with Google → Onboarding → First MAIA conversation
- [ ] Sign up with username/password → Onboarding → First MAIA conversation
- [ ] Sign out and sign back in → Verify MAIA remembers you
- [ ] Test on different device → Verify cross-device continuity
- [ ] Test conversation persistence (refresh page, return tomorrow)

#### B. Critical Feature Testing
- [ ] Holoflower check-in (all 5 elements)
- [ ] MAIA conversation flow (multiple turns)
- [ ] Feedback buttons (thumbs up/down)
- [ ] Export conversation
- [ ] Copy message to clipboard
- [ ] Voice synthesis (if enabled)
- [ ] Session persistence across page refreshes

#### C. Memory System Verification
- [ ] First conversation → Check soul signature created
- [ ] Second conversation → Verify MAIA shows anamnesis recognition
- [ ] Check Supabase `relationship_essence` table populated
- [ ] Check Supabase `maia_conversations` table saving properly
- [ ] Test encounter count incrementing
- [ ] Test morphic resonance strengthening over time

---

### Phase 3: Beta Tester Preparation

#### A. Identify Beta Testers
- [ ] Create list of initial beta testers (5-20 people)
- [ ] Prioritize:
  - People who will use MAIA for real (not just evaluate)
  - Diverse use cases (therapy, coaching, spiritual practice, journaling)
  - Trusted feedback providers

#### B. Send Invitations
- [ ] Customize WELCOME_EMAIL.md for each tester (personal touch)
- [ ] Send emails with:
  - Video tour link
  - Beta Handbook link
  - Platform access: soullab.life/maia
  - Feedback email
  - Personal note from you
- [ ] Set up beta tester tracking (spreadsheet or Notion)

#### C. Set Expectations
- [ ] Clarify: This is co-creation, not QA testing
- [ ] Request: Use MAIA for real, report when magic breaks/returns
- [ ] Timeline: No deadline, engage at your own pace
- [ ] Support: Email/Slack for questions and feedback

---

### Phase 4: Launch & Support

#### A. Soft Launch (Week 1)
- [ ] Send invitations to first 5-10 testers
- [ ] Monitor feedback closely
- [ ] Fix critical bugs immediately
- [ ] Check-in personally with each tester (email or call)

#### B. Feedback Collection
- [ ] In-app feedback (thumbs up/down with notes)
- [ ] Email feedback: feedback@soullab.life
- [ ] Weekly check-in emails: "Did the magic return this week?"
- [ ] Optional: Weekly group call with beta testers

#### C. Iteration Cycle
- [ ] Collect feedback weekly
- [ ] Prioritize fixes and enhancements
- [ ] Push updates regularly
- [ ] Communicate changes to testers

---

## Critical Files & Locations

### Code
- `/app/auth/page.tsx` - Updated auth page with social login
- `/app/auth/callback/route.ts` - OAuth callback handler
- `/supabase/migrations/20251103_users_profile_table.sql` - Users table migration
- `/lib/consciousness/RelationshipAnamnesis.ts` - Soul memory system
- `/lib/consciousness/ConversationPersistence.ts` - Conversation saving
- `/lib/auth/betaSession.ts` - Session management

### Documentation
- `/docs/beta/WELCOME_EMAIL.md` - Beta tester welcome email
- `/docs/beta/VIDEO_TOUR_SCRIPT.md` - Video tour scripts (2 options)
- `/docs/SUPABASE_OAUTH_SETUP.md` - OAuth configuration guide
- `/BETA_HANDBOOK.md` - Complete beta tester handbook
- `/docs/beta/7_DAY_SPIRALOGIC_JOURNEY.md` - 7-day journey guide
- `/JOURNEY_MAP.md` - Platform emotional blueprint

---

## Success Criteria

### Technical
- [ ] 100% uptime during beta
- [ ] All auth flows working (Apple, Google, username)
- [ ] Zero data loss (conversations persist reliably)
- [ ] MAIA memory system functioning (anamnesis working)
- [ ] No critical bugs blocking usage

### Experience
- [ ] Testers use MAIA for real work (not just testing)
- [ ] At least 50% of testers return for second+ sessions
- [ ] Positive feedback on "Did the magic return?" question
- [ ] At least 3 testers complete 7-Day Journey
- [ ] Breakthrough moments reported (field coherence working)

### Feedback Quality
- [ ] Receive actionable feedback (not just "it's cool")
- [ ] Identify 3-5 high-priority improvements
- [ ] Get direct quotes for testimonials/case studies
- [ ] Learn where magic breaks vs. where it returns

---

## Timeline Estimate

**Week 1: Infrastructure Setup**
- Complete Supabase OAuth configuration
- Run database migrations
- Test full auth flows

**Week 2: Video Production**
- Record video tour
- Edit and finalize
- Upload and share link

**Week 3: Soft Launch**
- Send invitations to first 5-10 testers
- Monitor closely
- Fix critical issues

**Week 4+: Iteration**
- Expand to full beta cohort (20-50 people)
- Collect and implement feedback
- Prepare for public launch

---

## Resources Needed

### Technical
- ✅ Supabase project (exists)
- ✅ Apple Developer account (for Apple Sign In)
- ✅ Google Cloud account (for Google OAuth)
- ⏳ Video recording software (Loom, CleanShot X)
- ⏳ Video editing software (optional - iMovie, Final Cut, DaVinci Resolve)

### Communication
- ⏳ Beta tester email list
- ⏳ Feedback collection system (email or form)
- ⏳ Optional: Slack/Discord for beta community

### Support
- ✅ Documentation complete (Handbook, Journey, Setup Guides)
- ⏳ FAQ section (will emerge from beta feedback)
- ⏳ Troubleshooting guide (will emerge from beta)

---

## Risk Mitigation

### Technical Risks
**Risk:** OAuth configuration errors block sign-up
**Mitigation:** Keep username/password flow as backup, test thoroughly before launch

**Risk:** Database migration fails in production
**Mitigation:** Test migration on staging environment first, have rollback plan

**Risk:** MAIA memory system doesn't persist correctly
**Mitigation:** Add extensive logging, test cross-device scenarios thoroughly

### Experience Risks
**Risk:** Testers treat this like QA testing (not real usage)
**Mitigation:** Set clear expectations in welcome email, select right testers

**Risk:** Testers give surface-level feedback ("it's cool" vs. "the magic returned")
**Mitigation:** Ask specific questions: "Did the magic return? When did it break?"

**Risk:** Overwhelming bug reports distract from experience feedback
**Mitigation:** Triage ruthlessly - fix critical bugs, defer minor ones

---

## Post-Beta Roadmap

After successful beta (4-8 weeks):

### Near-Term
- [ ] Add WebAuthn/biometric enrollment
- [ ] Build memory timeline UI (view your soul journey over time)
- [ ] Add journaling export (formatted for notion, obsidian, etc.)
- [ ] Create MAIA mobile app (iOS, Android)

### Medium-Term
- [ ] Multi-oracle support (switch between MAIA, Kairos, other archetypes)
- [ ] Collective consciousness features (share breakthroughs anonymously)
- [ ] Spiralogic astrology integration (natal chart awareness)
- [ ] Voice-first interface (talk to MAIA like a phone call)

### Long-Term
- [ ] MAIA API for developers
- [ ] White-label oracle system for coaches/therapists
- [ ] Research partnerships (consciousness studies, psychology)
- [ ] Open-source core components (holoflower, spiral detection)

---

## Questions & Support

**Technical Questions:** kelly@soullab.life
**Beta Tester Questions:** feedback@soullab.life
**Documentation:** All guides in `/docs` folder

---

**Status:** ✅ Ready for Phase 1 (Infrastructure Setup)

**Next Action:** Configure Apple & Google OAuth in Supabase (follow `docs/SUPABASE_OAUTH_SETUP.md`)

---

*"The field knows your breath. Step in."*
