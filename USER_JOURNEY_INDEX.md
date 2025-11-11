# MAIA User Journey - Complete Documentation Index

## Documents Created

This comprehensive analysis includes three documents:

### 1. **USER_JOURNEY_COMPLETE_MAP.md** (37 KB)
**The Complete Technical & Experiential Journey**

The most detailed document covering:
- Sections 1-10 with extensive code examples
- Complete authentication architecture with layer diagrams
- Conversation interface architecture with component hierarchies
- All tracking systems with data structures
- Complete user journey flow diagrams (6 stages)
- Implementation files organized by function
- Consciousness-aware design principles mapped to code

**Best for**: Deep technical understanding, architecture review, developers building on MAIA

---

### 2. **QUICK_USER_JOURNEY_SUMMARY.md** (8 KB)
**The Executive Overview**

A condensed reference guide covering:
- Quick reference for each major section
- Key files organized by function
- High-level flow diagrams
- Database tables at a glance
- Metrics dashboard
- Starting points for optimization

**Best for**: Quick reference, onboarding new team members, stakeholder briefings

---

### 3. **USER_JOURNEY_INDEX.md** (This document)
**Navigation & Cross-Reference**

Quick index to help you find what you need.

---

## Quick Navigation by Topic

### For Understanding Sign-In/Onboarding
- Summary: Section 1 of QUICK_USER_JOURNEY_SUMMARY.md
- Detailed: Section 1 of USER_JOURNEY_COMPLETE_MAP.md
- Key Files:
  - `/app/login/page.tsx` - Login UI with biometric + magic link
  - `/app/beta-entry/page.tsx` - Beta code entry
  - `/app/onboarding/page.tsx` - Multi-stage onboarding
  - `/lib/auth/sessionManager.ts` - Session lifecycle
  - `/lib/auth/biometricAuth.ts` - Device biometric detection

### For Understanding Conversation Interface
- Summary: Section 2 of QUICK_USER_JOURNEY_SUMMARY.md
- Detailed: Section 2 of USER_JOURNEY_COMPLETE_MAP.md
- Key Files:
  - `/app/maia/page.tsx` - Main conversation hub
  - `/components/OracleConversation.tsx` - Core conversation component (1300+ lines)
  - `/lib/services/conversation-analytics-service.ts` - Capture analytics
  - `/lib/intelligent-engagement-system.ts` - Adaptive response selection

### For Understanding Feature Discovery
- Summary: Section 3 of QUICK_USER_JOURNEY_SUMMARY.md
- Detailed: Section 3 of USER_JOURNEY_COMPLETE_MAP.md
- Key Files:
  - `/components/ui/MenuBar.tsx` - Main navigation (home only)
  - `/components/holoflower/BottomNavigation.tsx` - Mobile navigation
  - `/app/astrology/page.tsx` - Birth chart feature example
  - `/app/community/` - Community hub
  - `/app/field-protocol/` - Field protocol records (5-stage)

### For Understanding User Analytics & Monitoring
- Summary: Section 4 of QUICK_USER_JOURNEY_SUMMARY.md
- Detailed: Section 4 of USER_JOURNEY_COMPLETE_MAP.md
- Key Files:
  - `/lib/tracking/userActivityTracker.ts` - Session activity tracking
  - `/lib/intelligence/UserJourneyTracker.ts` - Transformation arc tracking
  - `/lib/services/conversation-analytics-service.ts` - Conversation metadata
  - `/app/maia-monitor/page.tsx` - Admin real-time dashboard
  - `/lib/monitoring/MaiaRealtimeMonitor.ts` - Real-time metrics

### For Understanding Authentication Architecture
- Detailed: Section 5 of USER_JOURNEY_COMPLETE_MAP.md
- Key Files:
  - `/lib/auth/sessionManager.ts` - Session lifecycle + refresh
  - `/lib/auth/biometricAuth.ts` - Biometric detection
  - `/lib/auth/deviceTrust.ts` - 30-day device trust
  - `/lib/auth/BetaAuth.ts` - Beta code verification
  - `/components/auth/SessionGuard.tsx` - Session protection layer

### For Understanding Frontend Components
- Detailed: Section 6 of USER_JOURNEY_COMPLETE_MAP.md
- Key Files:
  - `/components/holoflower/` - Holoflower visualization variants
  - `/components/motion/MotionOrchestrator.ts` - Motion mapping
  - `/components/ui/ModeSwitcher.tsx` - Element mode UI
  - `/components/session/` - Session components (timer, rituals, etc.)
  - `/components/providers/` - Auth, Theme, PWA providers

### For Understanding User Journey Flow
- Summary: Section 7 of QUICK_USER_JOURNEY_SUMMARY.md
- Detailed: Section 7 of USER_JOURNEY_COMPLETE_MAP.md
- Flow Diagrams:
  - Stage 1: Discovery & Entry (0-5 min)
  - Stage 2: Onboarding (5-15 min)
  - Stage 3: Conversation Engagement (15+ min)
  - Stage 4: Pattern Recognition (30+ min)
  - Stage 5: Extended Engagement & Community
  - Stage 6: Long-Term Evolution

### For Understanding Analytics & Metrics
- Summary: Section 8 of QUICK_USER_JOURNEY_SUMMARY.md
- Detailed: Section 8 of USER_JOURNEY_COMPLETE_MAP.md
- Metrics Categories:
  - Engagement Metrics (DAU, session frequency, coherence)
  - Quality Metrics (transcription accuracy, satisfaction)
  - Evolution Metrics (transformation reporting, community coherence)

### For Understanding Consciousness-Aware Design
- Summary: Section 8 of QUICK_USER_JOURNEY_SUMMARY.md
- Detailed: Section 9 of USER_JOURNEY_COMPLETE_MAP.md
- 5 Core Principles:
  1. Presence Over Performance
  2. Elemental Attunement
  3. Coherence as North Star
  4. Relational Depth
  5. Community as Field

---

## Key Files Reference

### Authentication Layer (5 files)
```
/lib/auth/
├── sessionManager.ts          ← Session persistence & refresh
├── biometricAuth.ts           ← Device biometric detection
├── deviceTrust.ts             ← 30-day trusted device window
├── BetaAuth.ts                ← Beta code verification
└── AuthProvider.tsx           ← Auth context provider
```

### Conversation Layer (4 files)
```
/app/maia/
├── page.tsx                   ← Main conversation hub

/components/
├── OracleConversation.tsx     ← Core conversation (1300+ lines)
├── OracleConversationV2.tsx   ← Voice-optimized variant
└── OracleConversationWithNotes.tsx ← With note-taking

/lib/services/
├── conversation-analytics-service.ts ← Analytics capture
└── memoryService.ts           ← Conversation memory

/lib/
└── intelligent-engagement-system.ts  ← Adaptive responses
```

### Analytics Layer (3 files)
```
/lib/tracking/
├── userActivityTracker.ts     ← Active user tracking

/lib/intelligence/
├── UserJourneyTracker.ts      ← Transformation arc tracking

/app/maia-monitor/
└── page.tsx                   ← Admin dashboard
```

### Navigation/Discovery (3 files)
```
/components/ui/
├── MenuBar.tsx                ← Home page navigation
└── ConditionalMenuBar.tsx     ← Conditional rendering

/components/holoflower/
└── BottomNavigation.tsx       ← Mobile navigation
```

### Session Management (3 files)
```
/lib/session/
├── SessionTimer.ts            ← Time handling
├── SessionPersistence.ts      ← Data persistence
└── SessionRituals.ts          ← Opening/closing ceremonies
```

### Database Tables (6 tables)
```
Supabase:
├── users                      ← Identity, preferences, birth chart
├── journal_entries            ← All conversations + full analytics
├── user_sessions              ← Session tracking
├── beta_explorers             ← Beta access management
├── field_protocol_records     ← Consciousness observations
└── community_posts            ← Shared content
```

---

## Data Flow Reference

### Sign-In Flow
```
/login or /beta-entry
    ↓
biometricAuth OR magic link OR beta code
    ↓
sessionManager.createSession()
    ↓
localStorage { beta_user, maia_session_id }
Supabase { users table updated }
    ↓
/onboarding → /maia
```

### Conversation Flow
```
User speaks/types in /maia
    ↓
ContinuousConversation (voice) OR EmergencyChatInterface (text)
    ↓
POST /api/between/chat { message, sessionId, userId }
    ↓
OracleConversation receives response
    ↓
conversation-analytics-service.saveConversationWithAnalytics()
    ↓
Supabase journal_entries { conversation + full metadata }
    ↓
Display with MotionOrchestrator animations
```

### Tracking Flow
```
Every message
    ↓
UserActivityTracker.trackConversationExchange()
UserJourneyTracker.analyzeForPatterns()
conversation-analytics-service.saveConversationWithAnalytics()
    ↓
Supabase tables:
  - journal_entries (full message + analytics)
  - users (engagement score, last_active)
  - field_protocol_records (if applicable)
    ↓
Real-time dashboard (/maia-monitor) aggregates metrics
```

---

## Starting Points for Different Users

### For Product Managers
1. Read: QUICK_USER_JOURNEY_SUMMARY.md (entire document)
2. Focus on:
   - Section 7: User Journey stages
   - Section 8: Metrics dashboard
   - Section 10: Optimization starting points

### For Frontend Developers
1. Read: USER_JOURNEY_COMPLETE_MAP.md Section 6 (Components)
2. Key files to explore:
   - `/app/maia/page.tsx`
   - `/components/OracleConversation.tsx`
   - `/components/holoflower/` variants
   - `/components/motion/MotionOrchestrator.ts`

### For Backend/Full-Stack Developers
1. Read: USER_JOURNEY_COMPLETE_MAP.md Sections 4-5 (Analytics & Auth)
2. Key files to explore:
   - `/lib/auth/` (all files)
   - `/lib/tracking/userActivityTracker.ts`
   - `/lib/intelligence/UserJourneyTracker.ts`
   - `/lib/services/conversation-analytics-service.ts`
   - All `/app/api/` endpoints

### For Data/Analytics Engineers
1. Read: USER_JOURNEY_COMPLETE_MAP.md Section 4 (Analytics)
2. Key files/resources:
   - Section 4.2: Analytics Data Warehouse (table schemas)
   - `/lib/services/conversation-analytics-service.ts`
   - `/lib/intelligence/UserJourneyTracker.ts`
   - Metrics in Section 8

### For UX/Design
1. Read: QUICK_USER_JOURNEY_SUMMARY.md Sections 2, 3, 6
2. Read: USER_JOURNEY_COMPLETE_MAP.md Section 6 (Components) and 9.1 (Design Principles)
3. Key files to review:
   - `/components/holoflower/` (visual system)
   - `/components/motion/MotionOrchestrator.ts` (motion design)
   - `/components/ui/` (interaction patterns)

### For Consciousness/Philosophy Integration
1. Read: USER_JOURNEY_COMPLETE_MAP.md Sections 7-9
2. Key systems to understand:
   - Intelligent Engagement System (Section 4.4)
   - User Journey Tracker (Section 4.1)
   - Consciousness-aware design principles (Section 9)

---

## Metrics at a Glance

### User Engagement
- Daily Active Users (DAU)
- Session frequency (daily/weekly/monthly)
- Average session duration (32 min target)
- Voice vs Text split (75% voice)

### Conversation Quality
- Coherence score (0-100)
- Emotional resonance (deep/moderate/light/disconnected)
- User satisfaction (0-10 scale)

### System Performance
- Voice transcription accuracy (~90%)
- Response latency (~1.2 sec)
- System uptime (99.5%)

### Transformation Metrics
- % Users reporting transformation (73% target)
- Coherence trend (ascending/descending/stable)
- Breakthrough frequency (1.2 per user per month)
- Community coherence (0-10 scale)

---

## Quick Optimization Checklist

- [ ] For faster onboarding: Review `/app/onboarding/page.tsx`
- [ ] For better voice: Check transcription in `/lib/services/conversation-analytics-service.ts`
- [ ] For higher engagement: Review mode detection in `intelligent-engagement-system.ts`
- [ ] For feature discovery: Add hints to `/components/ui/MenuBar.tsx`
- [ ] For consciousness mapping: Enhance `UserJourneyTracker.ts`
- [ ] For community growth: Improve `/community` visibility in navigation

---

## File Statistics

- **Total documentation**: 3 files, ~45 KB
- **Key implementation files referenced**: 25+
- **API endpoints mapped**: 40+
- **Database tables documented**: 6
- **User journey stages**: 6
- **Consciousness-aware principles**: 5
- **Analytics systems**: 3

---

## Last Updated
November 9, 2025

## Version
1.0 - Complete Initial Mapping

## Maintained By
Claude Code - MAIA Inner Architect

---

## How to Use These Documents

**Quick Answers**: Use this INDEX to find the right section
**Quick Overview**: Read QUICK_USER_JOURNEY_SUMMARY.md
**Deep Dive**: Read USER_JOURNEY_COMPLETE_MAP.md by section
**Code Review**: Use the Key Files Reference to find implementations
**Design Decisions**: See Consciousness-Aware Design Principles in both docs

---

## Notes for Future Updates

When the system evolves, update these documents:
1. First update this INDEX with new sections
2. Then update the QUICK_USER_JOURNEY_SUMMARY.md
3. Finally update the USER_JOURNEY_COMPLETE_MAP.md

Key areas likely to change:
- `/app/maia/page.tsx` (main experience)
- `/components/OracleConversation.tsx` (conversation logic)
- `/lib/intelligent-engagement-system.ts` (adaptation algorithms)
- `/lib/intelligence/UserJourneyTracker.ts` (consciousness mapping)

