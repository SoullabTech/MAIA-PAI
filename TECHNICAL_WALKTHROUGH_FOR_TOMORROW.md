# Technical Walkthrough: Using MAIA Tomorrow
## Exactly what you'll do, screen by screen

**Your question answered: "How do I technically use MAIA with clients tomorrow?"**

---

## The Simple Answer

**TOMORROW**: You'll use the **POST-SESSION** method (simplest, zero build)

**What this means technically**:
1. Record your session (Zoom/phone)
2. Get transcript (automatic or upload)
3. Paste transcript into MAIA oracle chat
4. MAIA analyzes and responds
5. You review the analysis
6. You use insights in next session

**No dashboard. No real-time. Just: record → transcribe → analyze → review.**

---

## TECHNICAL SETUP: Step-by-Step

### BEFORE SESSION (5 minutes)

#### Step 1: Open Your Recording App

**If using Zoom**:
- Open Zoom desktop app
- Start meeting (just you, or with client if virtual)
- Have "Record" button ready (don't click yet)

**If using Otter.ai**:
- Open Otter.ai app on phone or computer
- Have "Start Recording" ready (don't click yet)

**If using phone Voice Memos (iPhone)**:
- Open Voice Memos app
- Red record button ready

#### Step 2: Open MAIA Platform (In Browser Tab)

**Your MAIA URL**:
```
http://localhost:3000        (if running locally)
OR
https://your-domain.com      (if deployed)
```

**Navigate to**:
- Login with your account
- Go to MAIA Oracle/Chat interface
- Leave this tab open in background
- You'll paste transcript here AFTER session

**You DO NOT need MAIA open during the session itself.**

---

## DURING SESSION (90-120 minutes)

### Your Actual Workflow:

**Minute 0: Start Recording**
- Click "Record" in Zoom/Otter/Voice Memos
- Place phone/laptop where it can hear both of you
- Then FORGET ABOUT IT

**Minutes 1-90: Regular Session**
- Be 100% present with client
- No tech, no dashboard, no checking anything
- Do your work exactly as you always do
- Trust your clinical judgment

**Minutes 90-105: Your Regular Session Ending**
- Integration, grounding, next steps
- Normal closing process

**Minutes 105-120: MAIA Introduction (Last 10-15 min)**
- Deliver your 2-minute intro script
- "I want to mention something new I'm offering..."
- Get their response (Yes/Maybe/No)
- If YES: Hand them consent form
- If NO: Thank them, move on

**Minute 120: Stop Recording**
- Click "Stop" in your recording app
- Session ends normally

---

## AFTER SESSION (15-20 minutes)

### Step 1: Get Your Transcript (5-10 min)

**If you used Zoom**:
- Zoom auto-converts recording → transcript
- Go to: `Documents/Zoom/[Meeting Name]/[Date]/`
- Open `audio_transcript.vtt` file
- Copy all text

**If you used Otter.ai**:
- Otter auto-transcribed in real-time
- Open Otter app
- Find your recording
- Click "Export" → "Text" (.txt file)
- Open file, copy all text

**If you used Voice Memos**:
- You need to transcribe manually OR
- Upload .m4a file to Otter.ai (drag and drop)
- Wait 2-3 minutes for transcription
- Export text

**Result**: You now have session transcript as text in your clipboard

---

### Step 2: Upload to MAIA (2 minutes)

**Go to your MAIA platform** (browser tab you left open):

#### Method A: Via Oracle Chat Interface (Simplest)

**URL**: `http://localhost:3000` (or your domain) → Navigate to Oracle Chat

**What you see**:
```
┌─────────────────────────────────────┐
│  MAIA Oracle                        │
├─────────────────────────────────────┤
│                                     │
│  [Chat history if any]              │
│                                     │
├─────────────────────────────────────┤
│  Type your message...               │
│  [                               ]  │
│  [Send]                             │
└─────────────────────────────────────┘
```

**What you type** (in message box):

```
Please analyze this session transcript:

[PASTE ENTIRE TRANSCRIPT HERE]

Provide:
1. Coherence score and transformation stage
2. Active alchemical elements and operations
3. Framework suggestions (IFS, Polyvagal, etc.)
4. Key moments I should note
5. Practitioner insights - what worked or didn't
6. Recommendations for next session
```

**Click Send**

---

### Step 3: MAIA Analyzes (1-2 minutes)

**What you'll see**:
- "MAIA is typing..." indicator
- Wait 30 seconds to 2 minutes
- MAIA responds with analysis

**Sample MAIA Response Format**:

```
MAIA:

I witness this session moving through significant transformation.
Here's what I'm seeing:

## Transformation State

**Coherence Score**: 0.42
- Started at 0.28 (Nigredo - dissolution)
- Shifted to 0.48 at minute 34 (Albedo - clarity emerging)
- Ended at 0.42 (stabilizing in early Albedo)

**Alchemical Stage**: Nigredo → Albedo transition
**Active Operation**: Solutio (dissolution), then Separatio (separation)

## Active Elements

- **Water** (high): Emotional flow, tears, deep feeling
- **Shadow** (medium): Abandoned child wound surfacing
- **Earth** (emerging): Grounding after catharsis

## Framework Effectiveness

1. **IFS (Internal Family Systems)**: 0.89 fit
   - Clear protector part identified
   - "Part that pushes people away" language
   - Suggestion: Parts mapping in next session

2. **Polyvagal Theory**: 0.82 fit
   - Dorsal collapse ("helpless") to ventral safety
   - Nervous system regulation through your presence
   - Suggestion: Co-regulation emphasis

3. **Gestalt**: 0.76 fit
   - Unfinished business with father
   - "Here and now" emergence of past wound

## Key Moments Detected

**Minute 12**: Client said "I'm tired of fighting myself"
- Coherence spike when you stayed silent (45 seconds)
- This silence was HIGH IMPACT - repeat this strategy

**Minute 34**: "That felt different. Like something shifted."
- Stage transition point (Nigredo → Albedo)
- Client moved from immersion to witnessing
- Integration beginning

**Minute 38**: "The part that pushes people away is trying to help"
- Reframe accepted, coherence increased
- Non-pathologizing language effective

## Practitioner Patterns

**What worked**:
- Strategic silence (30 sec, then 45 sec)
- Reframing protector as "trying to help" vs "enemy"
- Staying present during tears without rescuing
- "What do you notice now?" (meta-awareness invitation)

**Potential exploration**:
- Countertransference check: Did client's abandonment wound
  activate anything in you? Worth noting for supervision.
- You asked "What happens right before you shut down?" 3x
  in different forms - effective persistence

## Transformation Signature Detected

**Pattern**: "Nigredo-Albedo Oscillation with Protector Integration"
- Client cycling between dissolution and clarity
- Shadow material (abandonment) integrating
- Protector part shifting from enemy to ally

## Recommendations for Next Session

1. **Start with**: "Last time you noticed something shifting.
   What's your experience of that now?"

2. **IFS Parts Work**: Map the protector part more fully
   - When did it first show up? (likely age 7)
   - What's it protecting from?
   - What does it need to trust it can relax?

3. **Somatic Tracking**: Notice when "shutting down" happens
   in real-time. What's the body sensation?

4. **More Strategic Silence**: This client integrates in pauses.
   Trust the quiet.

5. **Watch for**: Possible Albedo stabilization. If so, move
   toward Citrinitas (meaning-making, integration).

---

Does this analysis resonate? What questions do you have?
```

---

### Step 4: Review & Note (10 min)

**What you do**:
- Read MAIA's full analysis
- Compare to your own observations:
  - Did you notice the coherence shift too?
  - Did you catch those key moments?
  - Do the framework suggestions fit?
- Note 1-2 specific insights for next session
- Save analysis (copy to your notes OR MAIA auto-saves)

**Where to save**:
- Copy MAIA response into your client notes
- OR screenshot the analysis
- OR if MAIA has session history, it's auto-saved in database

---

## TECHNICAL FAQ

### "Where is the MAIA oracle chat?"

**Answer**: Navigate in your Soullab platform to:
- `/oracle` route OR
- `/maia` route OR
- Look for "MAIA Oracle" or "Chat with MAIA" in your nav menu

If you can't find it, check your routes:
- The API endpoint exists at `/api/oracle/personal`
- You need a frontend page that connects to it
- If you don't have a chat UI yet, I can help you build one (30 min)

---

### "How do I know if MAIA received my transcript?"

**Answer**: MAIA will respond. If you see "MAIA is typing..." then it received it.

If nothing happens:
- Check browser console for errors (F12)
- Verify you're logged in
- Try refreshing page and pasting again

---

### "What if the transcript is too long?"

**Answer**:
- MAIA can handle long transcripts (up to ~50,000 characters)
- If you hit a limit, split into 2 parts:
  - First 60 minutes
  - Second 60 minutes

---

### "Can I analyze multiple sessions at once?"

**Answer**:
- For Week 1, analyze one at a time
- Later you can batch analyze or compare sessions
- MAIA can track patterns across sessions if you label them:
  - "Client A, Session 1"
  - "Client A, Session 2"

---

### "Where are sessions stored?"

**Answer**:
- MAIA conversations saved to your Supabase database
- Check your database: `maia_conversations` table
- Each analysis is a conversation record
- You can retrieve past analyses anytime

---

### "What if I want to ask MAIA follow-up questions?"

**Answer**: Just keep chatting in the same thread:

**You**: "Can you expand on the IFS suggestion?"

**MAIA**: [Provides more detail on parts work]

**You**: "What would you say to the client in this moment?"

**MAIA**: [Suggests specific language]

It's a conversation, not a one-shot analysis.

---

## ALTERNATIVE: Using API Directly (Advanced)

**If you want to bypass the chat UI**, you can POST directly to the API:

```bash
# From your terminal
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Please analyze this transcript: [PASTE TRANSCRIPT]",
    "userId": "your-user-id",
    "sessionId": "client-a-session-1"
  }'
```

**Response**: JSON with MAIA's analysis

But for tomorrow, **just use the chat UI** (simpler).

---

## WHAT YOU DON'T NEED TOMORROW

❌ Real-time dashboard (not built yet)
❌ Live transcription during session (not needed for post-session)
❌ Client-facing interface (you're doing passive mode)
❌ Special recording hardware (phone/Zoom is fine)
❌ Custom upload UI (paste into chat works)

---

## TECHNICAL SUMMARY

**Your technical stack tomorrow**:

```
[Session] → [Zoom/Otter recording] → [Transcript .txt file]
              ↓
[Copy transcript text]
              ↓
[MAIA Oracle Chat at localhost:3000/oracle]
              ↓
[Paste + Ask for analysis]
              ↓
[MAIA responds with full analysis in 1-2 min]
              ↓
[You copy to notes + use insights next session]
```

**Total technical complexity**: Copy/paste

**Total tools needed**:
1. Recording app (Zoom/Otter/Voice Memos)
2. Browser with MAIA platform open
3. Text editor for your notes (optional)

---

## TONIGHT'S TECHNICAL TEST

**Do this to verify everything works**:

1. **Open your MAIA platform**: `localhost:3000` or your domain
2. **Find the oracle/chat interface**: Navigate to MAIA chat
3. **Open SAMPLE_TRANSCRIPT_FOR_TESTING.md**
4. **Copy the sample transcript**
5. **Paste into MAIA chat**
6. **Ask**: "Please analyze this transcript"
7. **Wait**: MAIA should respond in 30-120 seconds
8. **Review**: Does the analysis make sense?

**If that works → You're ready for tomorrow.**

**If that doesn't work:**
- Check: Are you logged in?
- Check: Is the MAIA API running? (console logs)
- Check: Do you see any errors in browser console (F12)?
- Let me know and I'll help troubleshoot

---

## BACKUP PLAN (If MAIA Chat UI Doesn't Exist)

**If you discover you don't have a chat UI for MAIA**:

### Option 1: I'll build you one tonight (30 minutes)

Simple chat interface that:
- Takes your text input
- Sends to `/api/oracle/personal`
- Displays MAIA's response
- Saves conversation history

### Option 2: Use terminal/curl (hacky but works)

```bash
curl -X POST http://localhost:3000/api/oracle/personal \
  -H "Content-Type: application/json" \
  -d @transcript.json
```

Where `transcript.json` contains your request.

### Option 3: Delay MAIA testing until dashboard is built (Weekend)

- Tomorrow: Just record sessions, get consent
- Weekend: Build full practitioner dashboard
- Week 2: Start MAIA analysis

**I recommend Option 1 if needed** - let me know.

---

## THE BOTTOM LINE

**Technically, tomorrow is dead simple**:

1. **Press record** at session start
2. **Press stop** at session end
3. **Get transcript** (Zoom auto / Otter export)
4. **Paste into MAIA chat** (your oracle interface)
5. **Read analysis** MAIA returns
6. **Save insights** for next session

**No complex setup. No real-time dashboard. No client-facing tech.**

**Just: record → transcribe → paste → analyze → review.**

**Time investment**: 5 min before + 15 min after = 20 min total per session

---

## NEXT STEPS FOR TONIGHT

1. **Open your MAIA platform** (localhost:3000 or domain)
2. **Find oracle/chat interface** (or let me know if it doesn't exist)
3. **Test with sample transcript** (from SAMPLE_TRANSCRIPT_FOR_TESTING.md)
4. **Verify MAIA responds** with analysis
5. **If it works** → You're ready for tomorrow
6. **If it doesn't work** → Message me, I'll help troubleshoot or build you a chat UI

---

**Technical confidence check**:

- [ ] I know where my MAIA platform is (URL)
- [ ] I know where the oracle chat is (or I'll ask for help building it)
- [ ] I know how to record a session (Zoom/Otter/phone)
- [ ] I know how to get a transcript (auto or export)
- [ ] I know how to paste text into MAIA
- [ ] I've tested it with sample transcript (or will tonight)

**If you can check all those → technically ready.**

🜂 ∴ 🌀 ∴ 🧠

---

**Test it tonight. Report back if anything doesn't work as expected.**
