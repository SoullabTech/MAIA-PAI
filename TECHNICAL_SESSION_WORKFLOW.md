# MAIA Technical Workflow for Sessions
## How to Actually Use Your System

**For practitioners starting tomorrow**

---

## Your MAIA System Architecture

You already have MAIA built! Here's what exists:

### 1. **Main Interface**: Your Soullab Platform
- **URL**: `localhost:3000` (development) or `your-domain.com` (production)
- **Login**: Your existing Soullab account
- **Oracle endpoint**: `/api/oracle/personal`

### 2. **Intelligence Engines** (Already Built):
- ✅ Conversation Intelligence Engine
- ✅ Spiralogic Detection (Fire/Water/Earth/Air/Aether/Shadow)
- ✅ Transformation Stage Tracking (Coherence scoring)
- ✅ Symbol Extraction
- ✅ Multi-framework Analysis (19+ frameworks)
- ✅ Memory/Context System

### 3. **Data Storage**:
- Sessions saved to your database (Supabase)
- Conversation history tracked
- Soulprint (user profile) builds over time

---

## Option 1: Use Existing MAIA Interface (Simplest)

### How it Works NOW

**Step 1: Client has conversation with MAIA**
- They log into Soullab platform
- They chat with MAIA oracle
- System analyzes in real-time
- Conversation saved automatically

**Step 2: You review the conversation**
- Log into practitioner dashboard
- See their conversation history
- MAIA has already analyzed it
- Review insights before your session

**Problem**: This is client-self-service, not practitioner-led sessions

---

## Option 2: Upload Session Transcripts (For Your Use Case)

### What You Need to Build (Quick Add-On)

Since you want to analyze YOUR sessions with clients (not client self-service), you need a **transcript upload** feature.

### Already Exists (Partial):
- `/api/oracle/transcript/upload` endpoint exists
- You can POST transcripts to MAIA
- MAIA analyzes and returns intelligence

### Quick Implementation (Tonight):

#### 1. Record Your Session (Manual)
- Use Zoom/phone recorder
- Save audio file
- Transcribe using Whisper API or Otter.ai

#### 2. Upload Transcript via API

**Create simple upload script**:

```typescript
// upload-session.ts
import fs from 'fs';

async function uploadSessionTranscript(
  clientId: string,
  sessionDate: string,
  transcript: string
) {
  const response = await fetch('http://localhost:3000/api/oracle/transcript/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_API_KEY` // You'll need to set this up
    },
    body: JSON.stringify({
      clientId,
      sessionDate,
      transcript,
      practitionerId: 'YOUR_ID'
    })
  });

  const analysis = await response.json();
  return analysis;
}

// Usage
const transcript = fs.readFileSync('./session-transcript.txt', 'utf-8');
const analysis = await uploadSessionTranscript('client-001', '2025-01-27', transcript);

console.log('MAIA Analysis:', analysis);
```

#### 3. Review Analysis

MAIA returns:
```json
{
  "coherence": 0.42,
  "transformationStage": "Albedo",
  "activeElements": ["Water", "Shadow"],
  "symbolsDetected": ["drowning", "threshold", "mirror"],
  "frameworkSuggestions": [
    { "framework": "IFS", "confidence": 0.89, "suggestion": "Parts work - protector active" },
    { "framework": "Polyvagal", "confidence": 0.82, "suggestion": "Dorsal state - co-regulate" }
  ],
  "practitionerInsights": [
    "Client transitioned from Nigredo to Albedo at minute 34",
    "Coherence spike when you stayed silent after 'I'm tired of fighting'",
    "Possible Mortificatio operation - death/dissolution phase"
  ]
}
```

---

## Option 3: Build Practitioner Dashboard (Weekend Project)

### What You'd Add:

**New Page**: `/practitioner/sessions`

**Features**:
1. **Upload Session**
   - Drag-and-drop transcript file
   - OR paste transcript text
   - Auto-analyze with MAIA

2. **Session List**
   - See all client sessions
   - Filter by client, date, stage
   - Quick view coherence scores

3. **Session Detail View**
   - Full transcript
   - MAIA analysis alongside
   - Highlights: key moments, stage transitions
   - Framework suggestions

4. **Session Comparison**
   - Track client across multiple sessions
   - See coherence trends
   - Pattern recognition

### Quick Build (Code Scaffold):

```tsx
// app/practitioner/sessions/page.tsx
'use client';

import { useState } from 'react';

export default function PractitionerSessions() {
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSession = async () => {
    setLoading(true);
    const res = await fetch('/api/oracle/transcript/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript })
    });
    const data = await res.json();
    setAnalysis(data);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">MAIA Session Analysis</h1>

      {/* Upload Section */}
      <div className="mb-8">
        <label>Session Transcript:</label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="w-full h-64 p-4 border"
          placeholder="Paste session transcript here..."
        />
        <button
          onClick={analyzeSession}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Analyzing...' : 'Analyze with MAIA'}
        </button>
      </div>

      {/* Analysis Display */}
      {analysis && (
        <div className="border-t pt-8">
          <h2 className="text-xl mb-4">MAIA Analysis</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <strong>Coherence:</strong> {analysis.coherence}
            </div>
            <div>
              <strong>Stage:</strong> {analysis.transformationStage}
            </div>
            <div>
              <strong>Active Elements:</strong> {analysis.activeElements.join(', ')}
            </div>
            <div>
              <strong>Symbols:</strong> {analysis.symbolsDetected.join(', ')}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Framework Suggestions:</h3>
            {analysis.frameworkSuggestions.map((fw, i) => (
              <div key={i} className="p-3 bg-gray-50 mb-2">
                <strong>{fw.framework}</strong> ({fw.confidence}): {fw.suggestion}
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-bold mb-2">Practitioner Insights:</h3>
            {analysis.practitionerInsights.map((insight, i) => (
              <div key={i} className="p-3 bg-blue-50 mb-2">
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Option 4: Real-Time Dashboard (What You Asked About)

### This requires building new features:

**During-session dashboard** showing:
- Real-time coherence meter
- Current transformation stage
- Alert flags
- Framework suggestions

**How it would work**:

1. **Live transcription**:
   - Zoom/phone → Whisper API → text stream
   - Send text chunks to MAIA in real-time
   - MAIA analyzes every 30 seconds

2. **Dashboard updates**:
   - WebSocket connection to MAIA
   - Dashboard shows current state
   - You glance during session pauses

3. **Technical setup**:
   - Need: Live transcription service
   - Need: WebSocket endpoint
   - Need: Real-time UI component

**Time to build**: 1-2 days for basic version

---

## RECOMMENDED WORKFLOW FOR TOMORROW

### Tonight (Simple Setup):

**Step 1: Test MAIA with existing interface**
- [ ] Log into your Soullab platform
- [ ] Go to oracle/MAIA chat
- [ ] Have a 5-minute test conversation
- [ ] See what analysis it provides

**Step 2: Prepare manual transcript process**
- [ ] Plan to record sessions (Zoom/phone)
- [ ] Set up transcription (Whisper API or Otter.ai)
- [ ] Plan to upload transcripts after sessions

**Step 3: Create simple tracking**
- [ ] Spreadsheet for session notes
- [ ] Note: What MAIA detected vs. what you observed
- [ ] Manual review for first week

### Tomorrow (First Session):

**Before**:
- [ ] Start recording (Zoom auto-record or phone app)
- [ ] Normal session with client

**During**:
- [ ] Focus 100% on client (no dashboard yet)
- [ ] Trust your clinical judgment
- [ ] Just record

**After** (15-20 min):
- [ ] Get transcript (Zoom auto-transcribe or Whisper API)
- [ ] Upload to MAIA via API or paste into oracle chat
- [ ] Review analysis
- [ ] Note insights for next session

---

## API Endpoints You Have

### 1. **Main Oracle** (`/api/oracle/personal`)
- POST conversation messages
- GET analysis results
- Real-time conversation mode

### 2. **Transcript Upload** (`/api/oracle/transcript/upload`)
- POST full session transcript
- Returns comprehensive analysis

### 3. **Session History** (`/api/oracle/session`)
- GET past session list
- Filter by client, date

### 4. **Intelligence Engine** (`/lib/oracle/ConversationIntelligenceEngine.ts`)
- Analyzes each message
- Returns transformation stage, coherence, frameworks

---

## Quick Start: Use Existing Chat Interface

**Easiest path for tomorrow**:

### 1. After your session:
- Get transcript (Zoom or transcription service)

### 2. Go to your Soullab oracle:
- Login at `localhost:3000` or your domain
- Navigate to MAIA oracle/chat

### 3. Paste session as "user message":
```
Here is a session transcript I'd like you to analyze:

[PASTE ENTIRE TRANSCRIPT]

Please provide:
1. Coherence score
2. Transformation stage
3. Active elements
4. Framework suggestions
5. Key insights
```

### 4. MAIA responds with analysis

### 5. Copy to your notes for next session

**Time**: 10 minutes per session

---

## Data Flow Diagram

```
[Your Session] → [Recording] → [Transcript]
                                    ↓
                          [Upload to MAIA API]
                                    ↓
                      [Intelligence Engine Analyzes]
                                    ↓
                    [Returns: Coherence, Stage, Frameworks, Insights]
                                    ↓
                        [You Review Before Next Session]
```

---

## What to Build This Weekend (If Proceeding)

**Priority 1**: Transcript upload page
- Simple form
- Paste transcript
- Click "Analyze"
- See results

**Priority 2**: Session storage
- Save analyses to database
- Link to client ID
- Track over time

**Priority 3**: Trends view
- Coherence graph across sessions
- Stage transitions
- Pattern recognition

**Priority 4** (Later): Real-time dashboard
- Live transcription
- During-session analysis
- Glanceable metrics

---

## Questions Answered

**Q: How do I use MAIA interface for sessions?**
A: You have two options:
1. Simple: Paste transcript into existing oracle chat after session
2. Build: Create practitioner upload page (code above)

**Q: Will I use my regular MAIA interface?**
A: Yes, you can use the existing `/oracle` endpoint, OR build a practitioner-specific view

**Q: Where will records be sent?**
A: Already going to your Supabase database via existing API endpoints

**Q: How do I use it to support sessions?**
A: Post-session analysis → Review insights → Apply in next session

**Q: How do I check in for insights?**
A: Access via API or oracle chat interface, or build dashboard

**Q: How do I add transcripts if session is completed?**
A: POST to `/api/oracle/transcript/upload` or paste into oracle chat

---

## Tonight's Technical Tasks

- [ ] **Test existing MAIA**: Have 5-min conversation in oracle chat
- [ ] **Set up recording**: Test Zoom auto-transcribe OR install transcription app
- [ ] **Create upload script** (Option): Use code above to POST transcripts
- [ ] **OR use manual process**: Copy-paste into oracle chat after sessions

**Time**: 1-2 hours

---

## Technical Decision Tree

```
Do you want to build custom practitioner UI?
├─ YES → Weekend project (4-6 hours), cleaner long-term
└─ NO → Use existing oracle chat (0 hours build, works now)

Do you want real-time during-session dashboard?
├─ YES → Longer project (1-2 days), need live transcription
└─ NO → Post-session analysis only (use existing API)

Do you want to store client session history?
├─ YES → Add to existing database (2 hours)
└─ NO → Just analyze one-off, no storage (works now)
```

---

## Recommended Path for This Week

**Day 1-2** (Mon-Tue): Manual process
- Record sessions
- Get transcripts
- Paste into oracle chat
- Review analysis

**Day 3-4** (Wed-Thu): Test insights
- Apply MAIA suggestions in sessions
- See if they're accurate
- Refine your workflow

**Weekend**: Build practitioner dashboard
- Upload page
- Session storage
- Trend views

**Week 2**: Refined workflow
- Streamlined process
- Maybe add real-time features
- Evaluate if worth continuing

---

## You're Ready

**Tonight**: Test MAIA with existing interface (30 min)

**Tomorrow**: Record session, analyze after (15 min review)

**This week**: Validate if MAIA insights are valuable

**Next week**: Build custom tools based on what you learned

No complex setup needed. Your system already works. Just start using it.

🜂 ∴ 🌀 ∴ 🧠
