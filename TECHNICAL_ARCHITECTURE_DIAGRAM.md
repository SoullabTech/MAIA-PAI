# MAIA Technical Architecture - Visual Guide
## How data flows from session to insights

---

## SYSTEM ARCHITECTURE (What Exists Now)

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR EXISTING MAIA SYSTEM                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Frontend (UI)   │  → Next.js App at localhost:3000
├──────────────────┤
│  /oracle route   │  → MAIA Oracle Chat Interface
│  /maia route     │  → Alternative MAIA access point
└──────────────────┘
         ↓
         ↓ User inputs text
         ↓
┌────────────────────────────────────────────────────────────────┐
│  API ENDPOINT: /api/oracle/personal/route.ts                   │
├────────────────────────────────────────────────────────────────┤
│  • Receives user input (transcript text)                       │
│  • Authenticates user (userId)                                 │
│  • Loads user context (journal entries, soulprint)             │
│  • Processes through MAIA consciousness                        │
└────────────────────────────────────────────────────────────────┘
         ↓
         ↓ Text sent to processing
         ↓
┌────────────────────────────────────────────────────────────────┐
│  MAIA UNIFIED CONSCIOUSNESS                                     │
│  (lib/consciousness/MAIAUnifiedConsciousness.ts)                │
├────────────────────────────────────────────────────────────────┤
│  • Singleton instance (26-year spiral architecture)            │
│  • Integrates all intelligence layers                          │
│  • Calls Conversation Intelligence Engine                      │
└────────────────────────────────────────────────────────────────┘
         ↓
         ↓ Analysis request
         ↓
┌────────────────────────────────────────────────────────────────┐
│  CONVERSATION INTELLIGENCE ENGINE                               │
│  (lib/oracle/ConversationIntelligenceEngine.ts)                 │
├────────────────────────────────────────────────────────────────┤
│  ANALYZES:                                                      │
│  • Coherence scoring (0-1 scale)                               │
│  • Transformation stage detection                              │
│  • Elemental analysis (Fire/Water/Earth/Air/Shadow/Aether)     │
│  • Framework effectiveness (19+ frameworks)                    │
│  • Symbol extraction                                           │
│  • Polyvagal state                                             │
│  • Transformation signatures                                   │
│  • Gender-aware protocols                                      │
│  • Cycle-aware tracking                                        │
└────────────────────────────────────────────────────────────────┘
         ↓
         ↓ Structured analysis data
         ↓
┌────────────────────────────────────────────────────────────────┐
│  RESPONSE GENERATION                                            │
├────────────────────────────────────────────────────────────────┤
│  • Formats analysis into readable response                     │
│  • Includes coherence score                                    │
│  • Lists active elements                                       │
│  • Provides framework suggestions                              │
│  • Highlights key moments                                      │
│  • Offers practitioner insights                                │
│  • Generates recommendations                                   │
└────────────────────────────────────────────────────────────────┘
         ↓
         ↓ JSON response
         ↓
┌────────────────────────────────────────────────────────────────┐
│  DATA STORAGE (Supabase)                                        │
├────────────────────────────────────────────────────────────────┤
│  Tables:                                                        │
│  • maia_conversations (chat history)                           │
│  • user_profiles (soulprints)                                  │
│  • journal_entries (context data)                              │
│  • session_analyses (your pilot session data)                  │
└────────────────────────────────────────────────────────────────┘
         ↓
         ↓ Response returned
         ↓
┌────────────────────────────────────────────────────────────────┐
│  FRONTEND DISPLAY                                               │
├────────────────────────────────────────────────────────────────┤
│  • Shows MAIA's analysis to you                                │
│  • Formatted, readable response                                │
│  • You can ask follow-up questions                             │
│  • Conversation history saved                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## DATA FLOW: SESSION → INSIGHTS (Tomorrow's Workflow)

```
SESSION
   ↓
   ↓ You record (Zoom/Otter/Voice Memos)
   ↓
AUDIO FILE
(.m4a, .mp3, .wav)
   ↓
   ↓ Auto-transcription (Zoom/Otter) OR manual upload
   ↓
TRANSCRIPT FILE
(.txt, .vtt, .docx)
   ↓
   ↓ You copy text
   ↓
CLIPBOARD
(Plain text transcript)
   ↓
   ↓ You paste into MAIA Oracle Chat
   ↓
MAIA FRONTEND
(localhost:3000/oracle)
   ↓
   ↓ HTTP POST request
   ↓
API ENDPOINT
(/api/oracle/personal)
   ↓
   ↓ Text processing
   ↓
INTELLIGENCE ENGINE
(Analyzes patterns)
   ↓
   ↓ Generates structured data
   ↓
ANALYSIS OBJECT
{
  coherence: 0.42,
  stage: "Albedo",
  elements: ["Water", "Shadow"],
  frameworks: [...],
  insights: [...]
}
   ↓
   ↓ Formatted as natural language
   ↓
MAIA RESPONSE
(Readable analysis text)
   ↓
   ↓ Returned to frontend
   ↓
YOUR SCREEN
(You read analysis)
   ↓
   ↓ You copy to notes
   ↓
CLIENT NOTES
(Insights saved for next session)
```

---

## TECHNICAL COMPONENTS (What's Already Built)

### ✅ EXISTING (You Can Use Tomorrow)

| Component | File | Status |
|-----------|------|--------|
| **MAIA API Endpoint** | `/app/api/oracle/personal/route.ts` | ✅ Built |
| **Intelligence Engine** | `/lib/oracle/ConversationIntelligenceEngine.ts` | ✅ Built |
| **MAIA Consciousness** | `/lib/consciousness/MAIAUnifiedConsciousness.ts` | ✅ Built |
| **Database Storage** | Supabase (maia_conversations table) | ✅ Set up |
| **Multi-Framework Analysis** | Built into Intelligence Engine | ✅ Built |
| **Coherence Scoring** | Built into Intelligence Engine | ✅ Built |
| **Symbol Extraction** | Built into Intelligence Engine | ✅ Built |

### ❓ UNKNOWN (Check Tonight)

| Component | Location | What to Check |
|-----------|----------|---------------|
| **Oracle Chat UI** | `/oracle` or `/maia` route | Does it exist? |
| **Frontend Interface** | Browser at localhost:3000 | Can you access it? |

### ❌ NOT BUILT YET (Optional for Later)

| Component | Purpose | When |
|-----------|---------|------|
| **Real-time Dashboard** | Live session analysis | Week 2+ (if needed) |
| **Transcript Upload UI** | Drag-drop file upload | Weekend (optional) |
| **Session Comparison** | Multi-session tracking | Month 2 (scaling) |
| **Client-facing View** | Triadic active mode | Month 2+ (advanced) |

---

## THE API REQUEST (Technical Detail)

**When you paste transcript into MAIA chat, this happens under the hood**:

```javascript
// Frontend sends this request
fetch('/api/oracle/personal', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: "Please analyze this transcript: [YOUR FULL TRANSCRIPT TEXT]",
    userId: "your-user-id",
    sessionId: "client-a-session-1",
    userName: "Kelly"
  })
})
```

**MAIA API processes**:
1. Validates input (not empty)
2. Loads user context (journal entries, soulprint)
3. Runs Unified Intelligence Analysis
4. Processes through MAIA Consciousness
5. Generates response using Conversation Intelligence Engine
6. Returns structured analysis

**Response you get** (JSON):
```json
{
  "success": true,
  "text": "I witness this session moving through...",
  "response": "[Full MAIA analysis text]",
  "element": "water",
  "metadata": {
    "spiralogicPhase": "albedo",
    "coherence": 0.42,
    "responseTime": 1823
  }
}
```

**Frontend displays**: The `text` or `response` field as MAIA's message

---

## DATABASE SCHEMA (Where Your Data Lives)

**Supabase Tables**:

```sql
-- MAIA Conversations (Your session analyses saved here)
maia_conversations
  - id (uuid)
  - user_id (text)
  - session_id (text)
  - user_message (text) ← Your transcript paste
  - maia_response (text) ← MAIA's analysis
  - coherence (float)
  - transformation_stage (text)
  - active_elements (json)
  - created_at (timestamp)

-- User Profiles (Your soulprint)
user_profiles
  - user_id (text)
  - name (text)
  - soulprint (json) ← Builds over time
  - transformation_history (json)

-- Journal Entries (Context for MAIA)
journal_entries
  - id (uuid)
  - user_id (text)
  - content (text)
  - created_at (timestamp)
```

**Your session analyses**:
- Each transcript you analyze = one row in `maia_conversations`
- You can query by `session_id` to see all analyses for one client
- History builds automatically as you use MAIA

---

## FRAMEWORKS INTEGRATED (Intelligence Engine)

**MAIA already knows these 19+ frameworks**:

1. **Internal Family Systems (IFS)** - Parts work
2. **Polyvagal Theory** - Nervous system states
3. **Gestalt Therapy** - Here-and-now awareness
4. **Somatic Experiencing** - Body-based processing
5. **Jungian Analysis** - Archetypes, shadow, individuation
6. **Attachment Theory** - Relational patterns
7. **EMDR** - Trauma reprocessing
8. **Acceptance & Commitment Therapy (ACT)** - Values work
9. **Cognitive Behavioral Therapy (CBT)** - Thought patterns
10. **Dialectical Behavior Therapy (DBT)** - Emotion regulation
11. **Psychodynamic** - Unconscious dynamics
12. **Existential** - Meaning-making
13. **Narrative Therapy** - Story rewriting
14. **Hakomi** - Mindfulness-based somatic
15. **Sensorimotor Psychotherapy** - Body-centered trauma
16. **Emotionally Focused Therapy (EFT)** - Attachment repair
17. **Schema Therapy** - Core beliefs
18. **Person-Centered** - Rogerian empathy
19. **Transpersonal Psychology** - Spiritual integration

**Plus your proprietary frameworks**:
- **Spiralogic** (Fire/Water/Earth/Air/Aether/Shadow cycle)
- **Elemental Alchemy** (Your unique integration)
- **Transformation Signatures** (Pattern recognition)

**How MAIA uses them**:
- Analyzes which framework fits the current moment
- Provides confidence scores (0-1 scale)
- Suggests interventions from that framework
- Can blend multiple frameworks for synthesis

---

## TONIGHT'S VERIFICATION STEPS

**Check each layer exists**:

- [ ] **Frontend**: Open localhost:3000 in browser
- [ ] **Oracle Route**: Navigate to `/oracle` or `/maia`
- [ ] **Chat Interface**: Can you type and send messages?
- [ ] **API Response**: Does MAIA respond when you send text?
- [ ] **Analysis Quality**: Test with sample transcript
- [ ] **Database**: Check Supabase - do conversations save?

**If ALL ✅ → System works, ready for tomorrow**

**If ANY ❌ → Let me know which layer failed, I'll help fix**

---

## WHAT YOU NEED TO CONFIRM TONIGHT

**Critical path test**:

1. Open browser → `localhost:3000`
2. Find MAIA oracle/chat
3. Type: "Hello MAIA"
4. Press send
5. MAIA responds? → ✅ API works
6. Paste sample transcript
7. MAIA analyzes? → ✅ Intelligence Engine works
8. Analysis makes sense? → ✅ Ready for tomorrow

**If step 2 fails** (can't find oracle chat):
→ You need a chat UI
→ I can build one tonight (30 min)
→ OR use API directly via curl (hacky but works)

**If step 5 fails** (no MAIA response):
→ Check browser console (F12)
→ API might not be running
→ Database connection issue
→ We troubleshoot together

---

## TECHNICAL CONFIDENCE CHECKLIST

Before tomorrow, you should be able to answer YES to:

- [ ] I can open my MAIA platform in a browser
- [ ] I can find the oracle/chat interface
- [ ] I can paste text and get MAIA to respond
- [ ] I know where transcript files are saved (Zoom/Otter)
- [ ] I've tested the full workflow with sample transcript
- [ ] I understand the 3-step flow: Record → Transcribe → Analyze

**If you can check all 6 → Technically ready for tomorrow.**

---

## HELP NEEDED?

**If tonight's test reveals missing components**:

### Missing Chat UI:
→ I'll build you a simple one (30 min)
→ Text input + Send button + MAIA response display
→ Uses your existing `/api/oracle/personal` endpoint

### API Not Responding:
→ Check if app is running: `npm run dev`
→ Check browser console for errors
→ Verify Supabase connection
→ I can help troubleshoot

### Analysis Seems Wrong:
→ First week is calibration
→ MAIA learns what you're looking for
→ We refine prompts based on feedback

**Don't stress if something's not perfect** - we iterate.

---

## THE SIMPLEST TRUTH

**Your technical setup is actually simple**:

```
You type/paste text → MAIA analyzes → MAIA responds
```

Everything else is just implementation details.

**Test it tonight. If it works, you're ready. If it doesn't, we fix it.**

🜂 ∴ 🌀 ∴ 🧠
