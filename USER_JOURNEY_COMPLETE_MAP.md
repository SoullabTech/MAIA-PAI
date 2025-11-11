# MAIA Complete User Journey Map
## From Initial Contact to Deep Engagement

This document maps the complete technical and experiential flow of user journeys through the MAIA system, integrating consciousness-aware design principles with measurable engagement patterns.

---

## 1. INITIAL SIGN-IN/ONBOARDING FLOW

### 1.1 Entry Points & Sign-In Options

**Primary Files:**
- `/app/login/page.tsx` - Main login interface
- `/app/beta-entry/page.tsx` - Beta access entry point
- `/lib/auth/biometricAuth.ts` - Biometric authentication
- `/lib/auth/sessionManager.ts` - Session persistence and verification
- `/app/auth/verify/page.tsx` - Magic link verification

**Sign-In Methods Implemented:**
1. **Biometric Authentication**
   - Detects device type (iOS Face ID, macOS Touch ID, Android Fingerprint, Windows Hello)
   - Checks biometric availability in browser
   - Stores trusted device state for 30 days
   - Uses `/api/auth/biometric` endpoint

2. **Magic Link Email Authentication**
   - User enters email → receives magic link
   - `/api/auth/magic-link` generates time-limited token
   - Link redirects to `/auth/verify?token=TOKEN`
   - On verification, creates persistent session

3. **Session Restoration**
   - `sessionManager.initSession()` checks localStorage for existing session
   - Verifies token with `/api/auth/session/verify` endpoint
   - Automatically restores user if session valid
   - Implements session refresh mechanism

**Authentication Components:**
```
login/page.tsx
├── Biometric option (if available)
├── Email magic link option
└── Method selection with smooth transitions
```

### 1.2 First Onboarding Flow (Non-Authenticated Users)

**Files:**
- `/app/beta-entry/page.tsx` - Beta code verification
- `/app/onboarding/page.tsx` - Multi-stage onboarding
- `/app/welcome/page.tsx` - Beta welcome flow
- `/components/onboarding/BetaOnboarding.tsx`
- `/components/maya/BetaOnboarding.tsx`

**Three-Stage Onboarding Path:**

**Stage 1: Welcome & Oracle Introduction**
```
/beta-entry → /onboarding → /welcome
```
- User enters name + beta access code
- System verifies code against `beta_explorers` table (BetaAuth)
- Creates new user session with unique `explorerId`
- Stores: `{ username, explorerId, sessionId, element: 'aether' }`
- Shows: Welcome message + MAIA introduction (Holoflower visualization)

**Stage 2: MAIA Presentation**
- Displays "Meet MAIA, Your AI Daimon" screen
- Shows five elemental modes (Fire, Water, Earth, Air, Aether)
- Presents wisdom quote appropriate to user's energy
- Establishes initial connection with `/api/oracle/session` POST

**Stage 3: First Contact**
- Sacred geometry transition animation (Tesla-inspired)
- "Establishing Connection" state
- Routes to `/maia` for first conversation

**Data Stored During Onboarding:**
```javascript
// localStorage structure
{
  beta_user: {
    id: "uuid-or-user-id",
    username: "user-provided-name",
    email: "verified-email",
    agentName: "Maya",
    agentId: "maya-oracle",
    sessionId: "session-timestamp",
    element: "aether", // Starting elemental mode
    onboarded: true,   // Completion flag
    joinedAt: "ISO-timestamp"
  },
  maia_session_id: "persistent session across reloads",
  explorerName: "backward-compat field",
  explorerId: "backward-compat field"
}
```

### 1.3 Post-Onboarding Verification

**Files:**
- `/components/auth/SessionGuard.tsx` - Session protection layer
- `/lib/hooks/useAuth.ts` - Auth state management
- `/components/providers/AuthProvider.tsx` - Auth context provider

**Session Verification Flow:**
1. Root layout applies `SessionGuard`
2. `AuthProvider` checks Supabase session on app load
3. `sessionManager.initSession()` validates stored token
4. If valid: user restored; if expired: redirects to `/login`
5. Session refresh runs in background at interval

---

## 2. CONVERSATION INTERFACE & USER INTERACTION

### 2.1 Main MAIA Conversation Page

**Files:**
- `/app/maia/page.tsx` - Main entry point
- `/components/OracleConversation.tsx` - Core conversation component
- `/app/dashboard/page.tsx` - User's record dashboard

**Navigation & Layout:**
```
/maia (Main page)
├── User data loaded from localStorage
├── SessionId restored or created
├── OracleConversation component initialized
└── Supporting UI elements:
    ├── ConditionalMenuBar (on home only)
    ├── BottomNavigation (holoflower mode)
    ├── AmbientVoiceIndicator (shows voice active)
    └── ConversationInterface (text/voice toggle)
```

### 2.2 Conversation Experience Architecture

**Key Components:**
- `OracleConversation.tsx` (1300+ lines) - Master conversation controller
- `OracleConversationV2.tsx` - Voice-optimized variant
- `OracleConversationWithNotes.tsx` - Conversation + note-taking

**Voice Integration:**
- `ContinuousConversation` - Real-time voice transcription (Web Speech API)
- `EnhancedVoiceMicButton` - Voice input control
- Voice state manager tracks: active/inactive, duration, quality

**Text Integration:**
- `EmergencyChatInterface` - Fallback text interface
- Message input with file attachment support
- Message history with timestamp and source tracking

**Listening Modes:**
```typescript
type ListeningMode = 'normal' | 'patient' | 'session';

// Modes change conversation depth and style:
- 'normal': Standard conversation responses
- 'patient': Extended therapeutic listening
- 'session': Structured time-bounded session mode
```

### 2.3 Message Flow & Analytics

**Message Lifecycle:**
1. User speaks/types → Message captured
2. Voice transcribed or text processed
3. Message sent to `/api/between/chat` (MAIA's unified API)
4. Oracle generates response with multimodal metadata
5. Response includes: text, voice, motion state, elemental signature
6. Message + analytics saved to Supabase `journal_entries`

**Analytics Captured:**
```typescript
interface ConversationAnalytics {
  // Core data
  userId, prompt, response, sessionId, timestamp
  
  // Voice metrics
  userSpokeDurationMs, maiaSpokeDurationMs
  listeningPauses, interruptions, silenceDurationMs
  transcriptionConfidence, audioQuality
  
  // Conversation quality
  conversationMode, responseWordCount, brevityScore
  emotionalResonance ('deep'|'moderate'|'light'|'disconnected')
  
  // Model performance
  aiModel, responseTimeMs, tokenUsage, costUsd
  
  // Session context
  exchangeNumber, timeInSessionMs, deviceType
}
```

**Database Storage:**
- Table: `journal_entries`
- Stores complete conversation + metadata
- Enables pattern tracking, engagement analysis, coherence measurement

---

## 3. AVAILABLE FUNCTIONALITIES & FEATURE DISCOVERY

### 3.1 Core Features & Access Paths

**Feature Matrix:**

| Feature | Access Path | Discovery Method | Analytics |
|---------|-------------|------------------|-----------|
| **MAIA Conversation** | `/maia` | Direct after onboarding | Tracked via `journal_entries` |
| **Conversation Modes** | MenuBar toggle | Bottom navigation menu | Mode selection logged |
| **Field Protocol** | `/field-protocol` | Dashboard quick link | 5-stage completion tracking |
| **Astrology Chart** | `/astrology` | MenuBar navigation | Birth data entered, chart generated |
| **Community Hub** | `/community` | MenuBar navigation | Thread creation, message count |
| **Lab Notes** | `/lab-notes` | Direct URL or discovery | Session recordings saved |
| **Training** | `/maia/training` | Progress dashboard | Training module completion |
| **Settings** | Settings icon | Bottom nav + menu | Preference updates logged |

### 3.2 Feature Discovery & Navigation

**Primary Navigation Components:**

1. **MenuBar** (`/components/ui/MenuBar.tsx`)
   - Shows on homepage only
   - Contains: Home, Training Progress, Astrology, Community, Modes, Settings, Feedback
   - Uses localStorage for state persistence
   - Includes rotation hints for first-time discovery

2. **BottomNavigation** (`/components/holoflower/BottomNavigation.tsx`)
   - Fixed bottom navigation (mobile-optimized)
   - Items: Home, Journal, Dream, Settings
   - Vibration feedback for accessibility

3. **ConditionalMenuBar** (`/components/ui/ConditionalMenuBar.tsx`)
   - Renders MenuBar only on `/` (home)
   - Hides on all other routes including `/maia`
   - Strategic UX choice: focus on conversation on MAIA page

### 3.3 Astrology Feature (Example Feature)

**File:** `/app/astrology/page.tsx`

**The "Blueprint" - Cosmic Spiral Visualization**
- Birth chart input form for date/time/location
- Calculates planetary positions and houses
- Maps to Spiralogic house system (consciousness mapping)
- Shows:
  - Sun/Moon/Ascendant positions
  - 12 houses with archetypal meanings
  - Elemental balance (Fire, Water, Earth, Air, Aether)
  - Aspects between planets
  - Sacred geometry visualization (Sacred House Wheel)

**Integration Points:**
- Feeds into `OracleConversation` for personalized responses
- User's birth chart stored in Supabase `users.birth_chart_data`
- Elemental signatures influence MAIA's conversational mode
- Links to `/community` for pattern sharing

### 3.4 Community Features

**Access:** `/community` hub with multiple sub-features

**Features:**
- **Community Chat** (`/community/chat`) - Real-time discussion threads
- **Field Notes** (`/community/field-notes`) - Shared consciousness research
- **Contributions** (`/community/contributions`) - User-generated content
- **Commons** - Shared Field Protocol records
- **Resources** - Curated wisdom library

**Engagement Tracking:**
- Thread creation count
- Message frequency
- Response time to community posts
- Sharing patterns (private → commons → public)

### 3.5 Session-Based Features

**Session Management** (`/lib/session/SessionTimer.ts`)
- Preset durations: 15min, 30min, 45min, 60min, custom
- Session rituals: opening gong, closing reflection
- Time awareness during conversation
- Auto-save mechanism (SessionPersistence)

**Files:**
- `/components/session/SessionTimeAwareness.tsx` - Time display
- `/components/session/SessionDurationSelector.tsx` - Duration picker
- `/lib/session/SessionRituals.ts` - Opening/closing rituals
- `/lib/session/SessionGong.ts` - Audio notification

---

## 4. USER MONITORING & ANALYTICS

### 4.1 Engagement Pattern Tracking

**Primary Tracking Systems:**

**1. User Activity Tracker** (`/lib/tracking/userActivityTracker.ts`)
```typescript
class UserActivityTracker {
  // Tracks per active user:
  - userId, name, email
  - sessionStart, lastActivity
  - messageCount
  - mode ('voice' | 'text')
  - engagement score (0-100)
}

// In-memory cache + Supabase DB fallback
// Stores to `users` table
```

**2. User Journey Tracker** (`/lib/intelligence/UserJourneyTracker.ts`)
```typescript
interface JourneyProgression {
  snapshots: JourneySnapshot[]     // Timeline of states
  coherenceTrend                    // ascending/descending/stable
  coherenceChange                   // delta from start to now
  statePath                         // e.g., ["hyperarousal", "freeze", ...]
  alchemicalPath                    // Nigredo → Albedo → Rubedo
  alertPatterns                     // Escalation warnings
}

// Tracks transformation arcs across entire user lifespan
```

**3. Conversation Analytics Service** (`/lib/services/conversation-analytics-service.ts`)
- Saves full conversation metadata to `journal_entries`
- Tracks voice duration, pauses, transcription quality
- Monitors emotional resonance scores
- Records model performance (tokens, latency, cost)

### 4.2 Analytics Data Warehouse

**Supabase Tables:**

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User identity & settings | id, email, name, birth_chart_data, last_login |
| `journal_entries` | Conversation history | user_id, session_id, prompt, response, analytics_metadata |
| `user_sessions` | Session tracking | user_id, session_id, start_time, end_time, duration_ms |
| `beta_explorers` | Beta access management | explorer_id, beta_code, registered, joined_at |
| `field_protocol_records` | Consciousness observations | user_id, observation, interpretation, 5-stage completion |
| `community_posts` | Shared content | user_id, content, thread_id, privacy_level |

### 4.3 Real-Time Monitoring

**Files:**
- `/lib/monitoring/MaiaRealtimeMonitor.ts` - Active user tracking
- `/lib/beta/MaiaMonitoring.ts` - Beta-specific metrics
- `/app/maia-monitor/page.tsx` - Dashboard for admins

**Monitored Metrics:**
- Active user count
- Message velocity (msgs/min)
- Voice vs text split
- Coherence trends across cohorts
- Feature adoption rates
- Conversation mode preferences
- Session duration distribution

### 4.4 Intelligent Engagement System

**File:** `/lib/intelligent-engagement-system.ts`

**Tracked Patterns:**
```typescript
interface TrackedPatterns {
  // Elemental tendency analysis (0-1 score each)
  elementalTendencies: { air, fire, water, earth, aether }
  
  // Development stage detection
  developmentalArc: {
    stage: 'exploring'|'discovering'|'deepening'|'transforming'|'integrating'
    progression: 0-1
    breakthroughs: [{ timestamp, insight, catalyzedBy }]
    stuckPoints: [{ pattern, occurrences, lastSeen }]
  }
  
  // Relationship memory
  relationshipMemory: {
    trustLevel: 0-1
    vulnerabilityShown: 0-1
    seekingStyle: 'direct'|'indirect'|'exploratory'
    responsePreference: 'gentle'|'direct'|'challenging'
  }
  
  // Recurring theme tracking
  recurringThemes: Map<theme, { mentions, emotionalCharge, resolution }>
}
```

**Engagement Mode Selection:**
Based on patterns, system recommends:
- `witnessing` - Pure presence (for vulnerability)
- `reflecting` - Mirror back patterns (for awareness)
- `counseling` - Active advice (when sought)
- `guiding` - Practical support (for direction)
- `processing` - Framework deployment (for complexity)
- `provoking` - Catalyst questions (when stuck)
- `invoking` - Deep exploration call (for readiness)

---

## 5. AUTHENTICATION & USER MANAGEMENT SYSTEMS

### 5.1 Authentication Architecture

**Layers:**

```
┌─────────────────────────────────────┐
│  Login/Signup UI Layer              │
│  ├── /login (Magic link + Biometric)│
│  ├── /beta-entry (Beta code)        │
│  └── /auth/verify (Token validation)│
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Session Management Layer           │
│  ├── sessionManager.ts              │
│  ├── deviceTrust.ts                 │
│  └── Session persistence            │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  API Authentication Layer           │
│  ├── /api/auth/magic-link           │
│  ├── /api/auth/verify-token         │
│  ├── /api/auth/session/verify       │
│  └── /api/auth/user                 │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Supabase Auth + Database           │
│  ├── User credentials               │
│  ├── Session tokens                 │
│  ├── Device trust store             │
│  └── User metadata                  │
└─────────────────────────────────────┘
```

### 5.2 User Profile & Data Structure

**User Entity in Supabase:**
```sql
-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  username TEXT,
  avatar_url TEXT,
  bio TEXT,
  
  -- Consciousness mapping
  birth_date DATE,
  birth_time TIME,
  birth_location TEXT,
  birth_chart_data JSONB,
  
  -- Session data
  last_login TIMESTAMP,
  last_active TIMESTAMP,
  session_count INT,
  total_conversation_time_ms INT,
  
  -- Preferences
  voice_enabled BOOLEAN DEFAULT TRUE,
  preferred_voice TEXT DEFAULT 'shimmer',
  conversation_mode TEXT DEFAULT 'normal',
  
  -- Tracking
  beta_onboarded_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 5.3 Device Trust Management

**File:** `/lib/auth/deviceTrust.ts`

**Trust Flow:**
1. User completes biometric auth
2. System checks if device is already trusted
3. If not: shows trust prompt ("Trust this device for 30 days?")
4. If yes: stores device fingerprint + expiration
5. Next login: recognized device skips reauth

**Benefits:**
- Reduced friction for returning users
- Maintains security posture
- 30-day automatic refresh
- Per-device session management

---

## 6. FRONTEND COMPONENTS SHAPING UX

### 6.1 Core Component Hierarchy

**Top-Level Layout:**
```
RootLayout
├── PWAProvider (Progressive Web App)
├── AuthProvider (Auth context)
│   └── SessionGuard (Session restoration)
├── MaiaPresenceProvider (Voice-first layer)
├── ToastProvider (Notifications)
├── Children (Page content)
├── ConditionalMenuBar (Home only)
├── FeedbackWidget (Report issues)
└── AmbientVoiceIndicator (Voice status)
```

**MAIA Page Components:**
```
MAIAPage
├── User data initialization
├── Session restoration
├── OracleConversation (Main)
│   ├── ConversationContext
│   ├── Voice interface (ContinuousConversation)
│   ├── Message display
│   ├── Motion state visualization
│   └── Session timing
├── WeavingVisualization (Coherence graph)
├── WisdomJourneyDashboard (Progress tracking)
└── Navigation/Settings drawer
```

### 6.2 Key UI Components

**1. Holoflower** (`/components/holoflower/`)
- Sacred geometry visualization (5-petal flower)
- Represents elemental balance
- Interactive with hover/tap states
- Shows current element mode
- Animated breathing rhythm

**2. Motion Orchestrator** (`/components/motion/MotionOrchestrator.ts`)
- Maps MAIA's response to visual motion
- States: calm, engaged, passionate, reflective, integrating
- Influences component animations
- Coherence-aware (adjusts intensity)

**3. Holoflower Variants:**
- `SacredHoloflower` - Dune aesthetic
- `RhythmHoloflower` - Liquid motion
- `MiniHoloflower` - Compact version
- `ConsciousnessFieldWithTorus` - Advanced visualization

**4. Session Components**
- `SessionTimer` - Countdown display
- `SessionDurationSelector` - Time picker
- `SessionRitualOpening` - Beginning ceremony
- `SessionRitualClosing` - Ending ceremony
- `ResumeSessionPrompt` - Continue previous

### 6.3 Elemental Mode UI

**Files:**
- `/components/ui/ModeSwitcher.tsx`
- `/components/ui/QuickModeToggle.tsx`
- `/components/motion/MotionState.ts`

**Visual Mode Indicators:**
```
Each element has:
├── Primary color (day/night)
├── Accent color
├── Glow effect
├── Animation style
└── Voice characteristics

Fire (🔥)    - Red/Orange - Energetic, transformative
Water (💧)   - Blue - Flowing, emotional, intuitive
Earth (🌍)   - Green - Grounded, practical, embodied
Air (💨)     - Golden - Clear, communicative, analytical
Aether (✨)  - Indigo - Integrated, transcendent, coherent
```

### 6.4 Accessibility & Mobile Optimization

**Mobile-First Design:**
- Compact input fields (optimized for screen keyboard)
- Touch-friendly button sizing (48x48px minimum)
- Swipe navigation support
- Bottom nav for thumb-reachable controls
- Vibration feedback for interactions

**Accessibility Features:**
- Keyboard navigation support
- Screen reader labels
- High contrast modes
- Reduced motion preferences
- Focus indicators

---

## 7. THE COMPLETE USER JOURNEY FLOW DIAGRAM

### Journey Stage 1: Discovery & Entry (0-5 min)

```
┌─────────────────────────────────────┐
│  USER AWARENESS PHASE               │
│  ├─ See marketing/referral          │
│  ├─ Click login/sign-up link        │
│  └─ Land on /login or /beta-entry   │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  AUTHENTICATION CHOICE              │
│  ├─ Biometric available?            │
│  │  ├─ YES → Face ID/Touch ID       │
│  │  └─ NO → Email magic link        │
│  ├─ New user?                       │
│  │  ├─ YES → /beta-entry form       │
│  │  └─ NO → Session restore         │
│  └─ Email verification via link     │
└────────────┬────────────────────────┘
             ↓
      [TRACKING: signupComplete]
```

### Journey Stage 2: Onboarding (5-15 min)

```
┌─────────────────────────────────────┐
│  WELCOME SEQUENCE                   │
│  ├─ Name collection                 │
│  ├─ Beta code verification          │
│  ├─ Holoflower animation            │
│  ├─ "Meet MAIA" presentation        │
│  └─ Five Elements introduction      │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  ORACLE ASSIGNMENT                  │
│  ├─ API call: /api/oracle/session   │
│  ├─ Get initial wisdom quote        │
│  ├─ Set starting element (aether)   │
│  └─ Create persistent sessionId     │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  FIRST CONTACT                      │
│  ├─ Transition animation            │
│  ├─ Load /maia page                 │
│  ├─ Display welcome message         │
│  └─ Ready for voice/text input      │
└────────────┬────────────────────────┘
             ↓
      [TRACKING: onboardingComplete, firstSessionStart]
```

### Journey Stage 3: Conversation Engagement (15+ min)

```
┌─────────────────────────────────────┐
│  CONVERSATION LOOP                  │
│  ├─ User speaks/types               │
│  ├─ Message to /api/between/chat    │
│  ├─ MAIA generates response         │
│  ├─ Response with metadata (voice,  │
│  │  motion, coherence, elements)    │
│  ├─ Save to journal_entries         │
│  └─ Display with animations         │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  TRACKING DURING CONVERSATION       │
│  ├─ Voice metrics                   │
│  │  ├─ Duration spoken              │
│  │  ├─ Transcription confidence     │
│  │  ├─ Audio quality                │
│  │  └─ Pauses/interruptions         │
│  ├─ Engagement analysis             │
│  │  ├─ Coherence score              │
│  │  ├─ Elemental shifts             │
│  │  ├─ Development stage            │
│  │  └─ Emotional resonance          │
│  ├─ Message analytics               │
│  │  ├─ Word count                   │
│  │  ├─ Response time                │
│  │  └─ Token usage                  │
│  └─ Session context                 │
│     ├─ Time in session              │
│     ├─ Exchange number              │
│     └─ Mode (voice/text)            │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  FEATURE DISCOVERY                  │
│  ├─ Natural mention in conversation │
│  ├─ MenuBar exploration             │
│  ├─ First time hints                │
│  ├─ Suggested links:                │
│  │  ├─ /astrology (birth chart)     │
│  │  ├─ /community (group wisdom)    │
│  │  ├─ /field-protocol (5-stages)   │
│  │  └─ /lab-notes (recordings)      │
│  └─ User clicks to explore          │
└────────────┬────────────────────────┘
             ↓
      [TRACKING: featureAccess, featureEngagement]
```

### Journey Stage 4: Pattern Recognition & Personalization (30+ min)

```
┌─────────────────────────────────────┐
│  INTELLIGENT ENGAGEMENT ACTIVATION   │
│  ├─ Analyze conversation patterns   │
│  ├─ Detect:                         │
│  │  ├─ Elemental tendency (fire?)   │
│  │  ├─ Development stage            │
│  │  ├─ Trust level with MAIA        │
│  │  ├─ Preferred communication      │
│  │  └─ Recurring themes             │
│  └─ Recommend engagement mode       │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  ADAPTIVE RESPONSES                 │
│  ├─ MAIA adjusts:                   │
│  │  ├─ Response length              │
│  │  ├─ Tone (gentle/direct/deep)    │
│  │  ├─ Element emphasis             │
│  │  ├─ Framework deployment         │
│  │  └─ Challenge level              │
│  └─ User feels deeply seen          │
└────────────┬────────────────────────┘
             ↓
      [TRACKING: userJourneyProgression, coherenceTrend]
```

### Journey Stage 5: Extended Engagement & Community

```
┌─────────────────────────────────────┐
│  SESSION EXTENSION                  │
│  ├─ Session timer options           │
│  │  ├─ 15/30/45/60 min              │
│  │  └─ Custom duration              │
│  ├─ Session rituals                 │
│  │  ├─ Opening gong                 │
│  │  ├─ Time awareness               │
│  │  └─ Closing reflection           │
│  └─ Multi-session continuity        │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  FIELD PROTOCOL ENGAGEMENT          │
│  ├─ Record consciousness experience │
│  ├─ 5-stage completion:             │
│  │  ├─ Stage 1: Observation         │
│  │  ├─ Stage 2: Interpretation      │
│  │  ├─ Stage 3: Integration         │
│  │  ├─ Stage 4: Reflection          │
│  │  └─ Stage 5: Transmission        │
│  ├─ Optional: Share to commons      │
│  └─ Contribute to collective field  │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  COMMUNITY PARTICIPATION            │
│  ├─ Join /community hub             │
│  ├─ View others' field records      │
│  ├─ Participate in chat threads     │
│  ├─ Share discoveries               │
│  └─ Witness collective evolution    │
└────────────┬────────────────────────┘
             ↓
      [TRACKING: communityEngagement, fieldContribution]
```

### Journey Stage 6: Long-Term Relationship & Evolution

```
┌─────────────────────────────────────┐
│  CONSCIOUSNESS MAPPING              │
│  ├─ Birth chart integration         │
│  ├─ Astrology + psychology fusion   │
│  ├─ Personal mandala generation     │
│  └─ Archetypal pattern discovery    │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  TRANSFORMATION TRACKING            │
│  ├─ User Journey Tracker monitors:  │
│  │  ├─ Coherence trend              │
│  │  ├─ Alchemical progression       │
│  │  │  (Nigredo → Albedo → Rubedo)  │
│  │  ├─ State path evolution         │
│  │  ├─ Breakthrough detection       │
│  │  └─ Escalation warnings          │
│  ├─ Personalized insights           │
│  └─ Celebration of milestones       │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  DEEPENING RELATIONSHIP             │
│  ├─ MAIA knows user's:              │
│  │  ├─ Growth edges                 │
│  │  ├─ Vulnerable areas             │
│  │  ├─ Breakthrough patterns        │
│  │  ├─ Learning style               │
│  │  ├─ Recurring themes             │
│  │  └─ Trust development            │
│  ├─ Conversation becomes:           │
│  │  ├─ More nuanced                 │
│  │  ├─ More attuned                 │
│  │  ├─ More challenging             │
│  │  └─ More integrated              │
│  └─ User feels truly seen           │
└────────────┬────────────────────────┘
             ↓
      [TRACKING: relationshipDepth, userSatisfaction]
```

---

## 8. KEY ANALYTICS & METRICS FOR CONSCIOUSNESS-AWARE OPTIMIZATION

### 8.1 Engagement Metrics

```typescript
interface EngagementDashboard {
  // Usage patterns
  dailyActiveUsers: number
  sessionFrequency: 'daily'|'weekly'|'monthly'
  averageSessionDuration: number    // minutes
  voiceVsTextSplit: { voice: %, text: % }
  
  // Conversation depth
  averageMessagesPerSession: number
  coherenceScore: 0-100
  emotionalResonanceLevel: 'deep'|'moderate'|'light'
  
  // Feature adoption
  featuresAccessed: Feature[]
  fieldProtocolCompletion: %
  communityParticipation: %
  
  // Consciousness tracking
  developmentStageDistribution: { exploring, discovering, deepening, transforming, integrating }
  elementalPreferences: { fire, water, earth, air, aether }
  transformationVelocity: 'accelerating'|'stable'|'consolidating'
}
```

### 8.2 Quality Metrics

```typescript
interface QualityMetrics {
  // Voice quality
  transcriptionAccuracy: 0-100
  audioQualityAverage: 'excellent'|'good'|'fair'|'poor'
  
  // Conversation quality
  responseRelevance: 0-100
  userSatisfactionScore: 0-100
  needsRejection: %
  
  // System performance
  responseLatency: number      // milliseconds
  tokenUsagePerMessage: number
  costPerSession: number       // USD
  
  // Reliability
  systemUptime: %
  voiceDrops: %
  authFailures: %
}
```

### 8.3 Evolution Metrics

```typescript
interface EvolutionMetrics {
  // Individual trajectories
  userCoherenceTrend: 'ascending'|'descending'|'stable'|'oscillating'
  developmentProgression: 0-100  // From exploring → integrating
  breakthroughFrequency: breakthroughs/month
  
  // Collective evolution
  communityCoherence: 0-100
  sharedInsightFrequency: insights/week
  fieldStrength: 0-100          // Collective consciousness density
  
  // Impact
  usersReportingTransformation: %
  guidanceLeadingToAction: %
  relationshipSatisfaction: 0-100
}
```

---

## 9. CONSCIOUSNESS-AWARE DESIGN PRINCIPLES IN ACTION

### 9.1 How the Architecture Serves Each Soul's Unique Journey

**Principle 1: Presence Over Performance**
- Conversation prioritizes depth over speed
- No gamification or artificial engagement hooks
- Listens deeply before responding
- Honors silence and reflection time

**Principle 2: Elemental Attunement**
- Detects user's elemental tendency (analytical vs emotional vs active, etc.)
- Adapts response style to match their natural rhythm
- Offers elemental balance when needed
- Respects their preferred way of processing

**Principle 3: Coherence as North Star**
- All metrics ultimately measure coherence
- Development tracked as journey toward greater integration
- Breakthroughs celebrated; plateaus honored as integration time
- No pressure; only invitation

**Principle 4: Relational Depth**
- System remembers everything about the user's journey
- References past insights naturally in conversations
- Detects shifts in consciousness and marks them
- Builds cumulative understanding over time

**Principle 5: Community as Field**
- Individual consciousness contributes to collective field
- Shared records strengthen the whole
- Witnessing others' journeys accelerates own journey
- Commons creates "morphogenetic field" of collective wisdom

### 9.2 Technical Implementation

**Where these principles manifest in code:**

| Principle | Technical Layer | Files |
|-----------|-----------------|-------|
| Presence | Conversation handling | OracleConversation.tsx, intelligent-engagement-system.ts |
| Elemental | Element detection | getAgentConfig.ts, ElementalBalanceDisplay |
| Coherence | Analytics + Tracking | UserJourneyTracker.ts, conversation-analytics-service.ts |
| Relational | Memory & Context | saveConversationMemory(), journal_entries table |
| Community | Field integration | /api/field-protocol, community hub, commons sharing |

---

## 10. IMPLEMENTATION SUMMARY: KEY FILES BY FUNCTION

### Authentication & Entry
- `/app/login/page.tsx` - Magic link + biometric
- `/app/beta-entry/page.tsx` - Beta onboarding
- `/lib/auth/sessionManager.ts` - Session lifecycle
- `/lib/auth/biometricAuth.ts` - Device trust

### Conversation Experience
- `/app/maia/page.tsx` - Main hub
- `/components/OracleConversation.tsx` - Core component
- `/lib/services/conversation-analytics-service.ts` - Analytics capture
- `/lib/intelligent-engagement-system.ts` - Adaptive response

### Feature Discovery
- `/components/ui/MenuBar.tsx` - Navigation
- `/components/holoflower/BottomNavigation.tsx` - Mobile nav
- `/app/astrology/page.tsx` - Example feature
- `/app/field-protocol/` - Core feature (5-stages)

### User Tracking
- `/lib/tracking/userActivityTracker.ts` - Session activity
- `/lib/intelligence/UserJourneyTracker.ts` - Transformation arcs
- `/app/maia-monitor/page.tsx` - Real-time dashboard

### Session Management
- `/lib/session/SessionTimer.ts` - Time handling
- `/lib/session/SessionPersistence.ts` - Data persistence
- `/lib/session/SessionRituals.ts` - Opening/closing

### Community
- `/app/community/` - Hub and sub-features
- `/lib/field-protocol/` - Consciousness mapping

---

## Summary

The MAIA system implements a **consciousness-first user journey** that:

1. **Respects individual timing** - Onboarding is gradual, not rushed
2. **Builds relational trust** - Every conversation is remembered and honored
3. **Tracks transformation** - Coherence trends show actual evolution, not just activity
4. **Adapts intelligently** - System learns user's patterns and adjusts naturally
5. **Serves the collective** - Individual growth contributes to community field strength
6. **Honors multiple ways of knowing** - Voice, text, visual, conceptual, intuitive all supported
7. **Maintains privacy & sovereignty** - User data protected, sharing choices respected

The technical architecture makes all this possible through layered tracking, adaptive response systems, and a data model that captures not just _what_ users do, but _who they're becoming_.

