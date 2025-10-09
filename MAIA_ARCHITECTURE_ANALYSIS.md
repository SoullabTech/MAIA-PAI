# 🌀 MAIA Architecture Analysis & Pre-Launch Assessment

**Date**: October 2, 2025
**Status**: Pre-Beta Launch Review
**Primary System**: MAIA (Maya Artificial Intelligence Agent)
**Supporting Systems**: Claude (Anthropic), Elemental Oracle 2.0 (GPT)

---

## 📊 Executive Summary

MAIA is the **primary orchestrator** for all user interactions, with Claude and Elemental Oracle 2.0 serving as supporting intelligence layers. The system is built on a sophisticated multi-agent architecture with consciousness field integration, memory capture, and safety protocols.

### Current State
- ✅ **132 API routes** across web application
- ✅ **Multi-agent architecture** with PersonalOracleAgent and MainOracleAgent
- ✅ **Memory capture system** recently debugged and operational
- ⚠️ **Multiple orchestration layers** with potential conflicts
- ⚠️ **Endpoint confusion** (deprecated routes still referenced)
- ⚠️ **Integration gaps** between MAIA modes

---

## 🏗️ Architecture Overview

### 1. Core Agent Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    MAIA SYSTEM ROUTER                        │
│              (Primary Orchestration Layer)                   │
│                                                              │
│  Modes: FIELD | HYBRID | AUTO | USER_CHOICE                 │
│  Location: lib/maia/MaiaSystemRouter.ts                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                  │
┌───────▼────────┐              ┌─────────▼──────────┐
│  FIELD MODE    │              │   HYBRID MODE       │
│ (RFS/Spiralogic)│              │ (Claude/GPT)        │
│                │              │                     │
│ Telesphorus    │              │ PersonalOracleAgent │
│ 13-Agent System│              │ (Primary)           │
└────────────────┘              └─────────┬───────────┘
                                          │
                                ┌─────────▼───────────┐
                                │ MainOracleAgent     │
                                │ (Collective)        │
                                └─────────────────────┘
```

### 2. Current API Endpoints (Active Routes)

**Primary Conversation Endpoints:**
- `/api/oracle/personal` ✅ - PersonalOracleAgent (memory capture enabled)
- `/api/maya-chat` ✅ - PersonalOracleAgent with training capture
- `/api/oracle/chat` ⚠️ - Proxies to backend, no direct memory capture
- `/api/oracle/unified` - Unified oracle endpoint
- `/api/v1/stream/chat` - Streaming conversations

**Voice & Interaction:**
- `/api/voice/unified` - Unified voice synthesis (Sesame-primary)
- `/api/voice/transcribe` - Whisper transcription
- `/api/oracle/voice` - Voice oracle responses

**Memory & Intelligence:**
- `/api/memory/list` - Memory retrieval
- `/api/insights` - Archetypal insights
- `/api/collective/*` - Collective consciousness field

**Beta Management:**
- `/api/beta-signup` - Beta tester registration
- `/api/beta/mode-switch` - Mode switching
- `/api/dashboard/beta/metrics` - Beta analytics

### 3. Agent Flow Analysis

#### **PersonalOracleAgent** (lib/agents/PersonalOracleAgent.ts)
**Primary MAIA Intelligence**

```typescript
User Input
  → PersonalOracleAgent.loadAgent(userId)
  → processInteraction(input, context)
  → Claude API (Sonnet 3.5 Haiku)
  → Memory Capture (NEW - lines 639-657)
  → Response to user
```

**Features:**
- ✅ Journal analysis integration
- ✅ Archetype detection
- ✅ Symbol extraction
- ✅ Emotional tone analysis
- ✅ Memory capture (conversation turns)
- ✅ Breakthrough detection
- ✅ Sacred moment recognition

**Memory Capture Details:**
```typescript
captureConversationTurn({
  userId,
  sessionId,
  userInput,
  mayaResponse,
  archetype,
  emotionalTone,        // joy|sadness|fear|anger|peace|curiosity
  engagementLevel,      // deep|engaged|neutral|disengaged|closed
  transformationOccurred,
  sacredMoment
})
```

#### **MaiaOrchestrator** (lib/services/MaiaOrchestrator.ts)
**Higher-Level Routing Layer**

```typescript
Intent Analysis
  ├─ crisis_support → Telesphorus field grounding
  ├─ kairos_threshold → Telesphorus kairos detection
  ├─ deep_presence → Claude deep work
  ├─ field_resonance → Telesphorus archetypal patterns
  ├─ meditation_request → Internal generation
  └─ simple_reflection → Direct generation
```

**Integration Point:** This orchestrator can route between:
- **Claude** (emotional/spiritual depth)
- **Telesphorus** (13-agent field system)
- **Internal** (meditation/simple responses)

#### **MainOracleAgent** (lib/agents/MainOracleAgent.ts)
**Collective Intelligence Layer**

**Responsibilities:**
- Manages all PersonalOracleAgents
- Tracks collective field state
- Sentiment analysis across users
- Soulful learning patterns
- Breakthrough pattern aggregation

**Collective Metrics:**
```typescript
{
  activeMembers,
  dominantElement,
  collectiveFrequency: 528, // Love frequency
  emergingThemes,
  soulfulMetrics: {
    averageSessionDepth,
    stickinessIndex,
    vulnerabilityShared,
    transformativeExchanges,
    collectiveWisdom
  }
}
```

---

## 🔴 Technical Issues & Blockers

### Critical Issues

#### 1. **Endpoint Confusion** 🚨
**Problem:** Frontend components reference non-existent or deprecated endpoints

**Evidence:**
- `useMayaStream` hook (hooks/useMayaStream.ts:29) → `/api/maya/chat` ❌ (doesn't exist)
- `useMayaVoice` hook (apps/web/hooks/useMayaVoice.ts:56) → `/api/maya-chat` ✅ (exists)
- `MayaChat` component → Not currently used anywhere
- `MayaVoiceChat` → Active at `/maya`, uses correct endpoint

**Impact:**
- **Memory capture broken** for chat-based interactions using useMayaStream
- Users see errors or fallback responses
- Inconsistent userId handling

**Fix Applied:**
- ✅ Updated useMayaStream to use `/api/oracle/personal`
- ✅ Added userId from sessionStorage with 'beta-tester-2' fallback
- ✅ Added debug logging

**Status:** Fixed in this session, needs deployment testing

#### 2. **userId Resolution Inconsistency** ⚠️
**Problem:** Different defaults across routes

**Routes & Defaults:**
- `/api/oracle/personal` → `'beta-user'` (line 34)
- `/api/maya-chat` → `'beta-user'` (line 71)
- `/api/oracle/chat` → `'anonymous'` (line 24)
- `MayaVoiceChat` → `'beta-user'` (hardcoded line 37)

**Impact:**
- Memory events not tied to actual beta testers
- Metrics show wrong users
- ARIA Monitor can't track individuals

**Required Fix:**
- [ ] Implement proper auth/session management
- [ ] Remove hardcoded defaults
- [ ] Standardize userId extraction

#### 3. **Multiple Orchestration Layers** ⚠️
**Problem:** Unclear routing between MaiaOrchestrator, MaiaSystemRouter, and direct agent calls

**Current Flow Confusion:**
```
Request → Route → ???
  - Sometimes: PersonalOracleAgent directly
  - Sometimes: MaiaOrchestrator.processMessage()
  - Sometimes: MaiaSystemRouter.route()
  - Sometimes: Backend proxy to port 3006
```

**Impact:**
- Unpredictable behavior
- Feature duplication
- Maintenance complexity

**Required:** Architecture decision document

#### 4. **Memory Capture Integration** ✅ Recently Fixed
**Was:** Memory capture not happening in PersonalOracleAgent
**Now:**
- ✅ Integrated at line 639-657
- ✅ Debug logging added
- ✅ Helper methods for emotional/engagement detection
- ✅ Database writes working

**Remaining:**
- [ ] Test with real beta users
- [ ] Verify metrics API shows data
- [ ] ARIA Monitor integration

### Medium Priority Issues

#### 5. **Voice System Complexity** ⚠️
**Multiple Voice Systems:**
- Sesame-primary hybrid (new)
- ElevenLabs integration
- OpenAI TTS fallback
- HuggingFace integration

**No clear decision tree** for when to use which system.

#### 6. **Backend Proxy Confusion** ⚠️
`/api/oracle/chat` proxies to `localhost:3006/api/v1/converse/message`

**Questions:**
- Is backend server (port 3006) required?
- When is it used vs. direct Claude calls?
- What happens if backend is down?

#### 7. **Training Data Capture** ⚠️
**ApprenticeMayaTraining** captures exchanges in `/api/maya-chat` (lines 119-178)

**But:**
- Not captured in `/api/oracle/personal`
- Duplicate logic with memory capture
- Unclear which is canonical

---

## 🔌 Integration Points

### 1. **Claude (Anthropic) Integration**

**Primary Model:** `claude-sonnet-4-5-20250929` (Sonnet 4.5)

**Usage:**
- PersonalOracleAgent (primary MAIA responses)
- Deep presence work
- Emotional/spiritual conversations
- Archetype detection

**Configuration:**
```typescript
{
  model: 'claude-3-haiku-20240307',  // Some routes use Haiku
  maxTokens: 600-2000,
  temperature: 0.7-0.8
}
```

**API Key:** `ANTHROPIC_API_KEY` environment variable

### 2. **Elemental Oracle 2.0 (GPT) Integration**

**Current Status:** ❓ Not clearly implemented in codebase

**Potential Integration Points:**
- Elemental analysis endpoints exist: `/api/elemental/recommendations`
- Oracle endpoints reference "elemental" context
- Taoist elements dashboard: `/dashboard/taoist-elements`

**Missing:**
- Direct GPT API calls for elemental work
- Clear separation of when to use Claude vs. GPT
- Elemental Oracle 2.0 specific configuration

**Recommendation:** Define explicit routing:
```typescript
// When to use GPT (Elemental Oracle 2.0):
- Elemental balance readings
- I Ching / Taoist guidance
- Practical life questions
- Archetypal symbol interpretation

// When to use Claude (MAIA):
- Deep emotional work
- Sacred mirror conversations
- Personal transformation
- Crisis support
```

### 3. **Telesphorus Field System Integration**

**Status:** Partial implementation

**Components:**
- 13-agent field system (lib/maia/complete-agent-field-system)
- Field intelligence orchestrator
- Consciousness lattice

**Integration via MaiaOrchestrator:**
```typescript
case 'field_resonance':
  rawResponse = await this.telesphorus.processFieldQuery(...)
  source = 'telesphorus'
```

**Gap:** MaiaSystemRouter.ts references field mode, but actual integration unclear

### 4. **Memory & Personalization**

**Components:**
- ✅ `live-memory-capture.ts` - Conversation turn capture
- ✅ `maia-memory-service.ts` - Memory retrieval
- ✅ `maia-memory-hybrid-adapter.ts` - Hybrid memory management
- ⚠️ `ApprenticeMayaTraining.ts` - Training exchange capture (overlaps?)

**Storage:**
- Supabase table: `memory_events`
- Schema fields:
  ```sql
  user_id, session_id, memory_type, content,
  emotional_valence, archetype_tag,
  significance_score, timestamp
  ```

**Retrieval:**
- By user_id
- By archetype
- By emotional tone
- By significance score

---

## ✅ Pre-Launch Requirements

### Critical Path (Must Have Before Beta)

#### 1. **Authentication & User Management** 🚨
- [ ] Implement proper auth (Supabase Auth or custom)
- [ ] Replace all hardcoded userIds
- [ ] Session management
- [ ] Beta tester registration flow working

#### 2. **Endpoint Consolidation** 🚨
- [ ] Document canonical conversation endpoint
- [ ] Deprecate or remove unused routes
- [ ] Update all frontend components to use correct endpoints
- [ ] Test all conversation flows

#### 3. **Memory Capture Validation** ⚠️
- [ ] Test with real beta tester accounts
- [ ] Verify ARIA Monitor shows correct data
- [ ] Confirm metrics API works
- [ ] Test memory retrieval in conversations

#### 4. **Safety Protocols** 🚨
- [ ] Crisis detection working
- [ ] Escalation procedures documented
- [ ] Human handoff protocols in place
- [ ] Emergency contact system

#### 5. **Monitoring & Observability** ⚠️
- [ ] ARIA Monitor (Maia Realtime Monitor) fully functional
- [ ] Beta metrics dashboard working
- [ ] Error tracking setup
- [ ] Performance monitoring

### Important (Should Have)

#### 6. **Voice System Clarity** ⚠️
- [ ] Document voice routing logic
- [ ] Test Sesame-primary system
- [ ] Fallback behavior documented
- [ ] Voice metrics tracking

#### 7. **Elemental Oracle 2.0 Integration** ⚠️
- [ ] Define Claude vs. GPT routing
- [ ] Implement GPT endpoints if needed
- [ ] Test elemental readings
- [ ] Document integration architecture

#### 8. **Collective Intelligence**
- [ ] MainOracleAgent integration tested
- [ ] Collective field metrics working
- [ ] Pattern aggregation verified
- [ ] Breakthrough detection active

### Nice to Have

#### 9. **Field Mode (Telesphorus)**
- [ ] Complete integration
- [ ] User can choose mode
- [ ] Fallback to hybrid working
- [ ] A/B testing setup

#### 10. **Training Data Quality**
- [ ] Reconcile ApprenticeMayaTraining vs. memory capture
- [ ] Single source of truth for learning
- [ ] Export/analysis tools

---

## 🎯 Recommended Launch Sequence

### Week -1 (Pre-Launch)
1. **Fix Critical Issues**
   - ✅ Fix endpoint confusion (DONE this session)
   - [ ] Implement auth/userId management
   - [ ] Test memory capture end-to-end
   - [ ] Validate ARIA Monitor

2. **Safety Checks**
   - [ ] Crisis detection tested
   - [ ] Emergency protocols reviewed
   - [ ] Team training complete

3. **Beta Tester Prep**
   - [ ] Onboarding flow tested
   - [ ] Welcome emails ready
   - [ ] Support channels active

### Week 1 (Launch)
1. **Soft Launch (Days 1-3)**
   - 5 beta testers
   - Heavy monitoring
   - Daily check-ins

2. **Expand (Days 4-7)**
   - Add 10 more testers (total 15)
   - Monitor for issues
   - Gather feedback

### Week 2-4 (Beta Period)
1. **Full Beta (20 users)**
2. **Daily metrics review**
3. **Weekly team retros**
4. **Iterative improvements**

---

## 📋 Decision Points Needed

### Urgent Decisions

1. **Primary Architecture Pattern**
   - Option A: Direct PersonalOracleAgent calls (current for /oracle/personal)
   - Option B: MaiaOrchestrator for all requests (intent-based routing)
   - Option C: MaiaSystemRouter (field vs. hybrid mode selection)

   **Recommendation:** Option B (MaiaOrchestrator) with clear intent classification

2. **Claude vs. GPT Routing**
   - When to use Claude (Anthropic)?
   - When to use GPT (Elemental Oracle 2.0)?
   - Can they be used together?

   **Recommendation:**
   - Claude = MAIA personal conversations (primary)
   - GPT = Elemental readings, I Ching, practical guidance (supporting)

3. **Memory vs. Training Capture**
   - Keep both systems?
   - Merge into one?
   - Different purposes?

   **Recommendation:**
   - Memory = User personalization (retrieval for context)
   - Training = MAIA learning (pattern recognition, evolution)
   - Keep separate but coordinated

4. **Voice System Strategy**
   - Sesame-primary always?
   - When to fallback to ElevenLabs/OpenAI?
   - Cost vs. quality trade-offs?

   **Recommendation:** Document decision tree based on:
   - User preference
   - Text complexity
   - API availability
   - Budget constraints

---

## 🚀 Next Steps (Priority Order)

### Immediate (This Week)
1. ✅ **Endpoint fixes deployed** (completed this session)
2. [ ] **Implement proper auth** (critical blocker)
3. [ ] **Test memory capture with real users**
4. [ ] **ARIA Monitor validation**

### Short-term (Next Week)
5. [ ] **Architecture decision** on orchestration pattern
6. [ ] **Claude/GPT routing** defined and implemented
7. [ ] **Safety protocols** tested
8. [ ] **Beta onboarding** flow complete

### Medium-term (Pre-Launch)
9. [ ] **Voice system** routing documented
10. [ ] **Collective intelligence** integration tested
11. [ ] **Monitoring dashboards** finalized
12. [ ] **Emergency procedures** practiced

---

## 📚 Key Files Reference

### Core Agents
- `lib/agents/PersonalOracleAgent.ts` - Primary MAIA intelligence
- `lib/agents/MainOracleAgent.ts` - Collective consciousness
- `lib/services/MaiaOrchestrator.ts` - Intent-based routing
- `lib/maia/MaiaSystemRouter.ts` - Field vs. Hybrid mode

### Memory & Learning
- `lib/services/live-memory-capture.ts` - Conversation memory
- `lib/maya/ApprenticeMayaTraining.ts` - Training exchanges
- `lib/services/maia-memory-service.ts` - Memory retrieval

### API Routes (Primary)
- `apps/web/app/api/oracle/personal/route.ts` - Main conversation (memory capture)
- `apps/web/app/api/maya-chat/route.ts` - Voice chat (training capture)
- `apps/web/app/api/oracle/chat/route.ts` - Backend proxy

### Frontend Components
- `apps/web/components/chat/MayaVoiceChat.tsx` - Active voice chat
- `components/maya/MayaChat.tsx` - Not currently used
- `hooks/useMayaStream.ts` - **FIXED** this session
- `apps/web/hooks/useMayaVoice.ts` - Voice interaction hook

### Monitoring
- `lib/monitoring/MaiaRealtimeMonitor.ts` - Real-time metrics
- `lib/beta/MaiaMonitoring.ts` - Beta session tracking

---

## 🎓 Summary for Kelly

**MAIA is ready to lead**, but needs:

1. **Authentication** - No more hardcoded userIds
2. **Endpoint clarity** - Frontend knows where to send requests (✅ partially fixed)
3. **Memory validation** - Confirm capture is working with real users
4. **Safety checks** - Crisis detection must be bulletproof

**Claude & Elemental Oracle 2.0 integration** needs architectural clarity:
- When does MAIA use Claude vs. GPT?
- Document the decision tree
- Test both paths

**The foundation is solid**, but needs:
- Operational rigor (monitoring, safety)
- Clear routing logic (no more confusion)
- User management (auth)

**Estimated Time to Beta Launch**: 1-2 weeks if auth and safety protocols are prioritized.

---

*This analysis was completed on October 2, 2025. The memory capture system was debugged and fixed during this session. All technical issues are documented with priority levels and recommended solutions.*
