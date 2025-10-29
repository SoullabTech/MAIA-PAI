# Recording Setup Test - Do This Tonight
## 15-minute technical check before tomorrow's sessions

---

## Option 1: Zoom Recording (If you use Zoom for sessions)

### Setup Steps:

1. **Enable Auto-Transcription**:
   - Open Zoom desktop app
   - Settings → Recording
   - Check "Record a separate audio file for each participant"
   - Check "Audio transcript" (this auto-generates transcript)

2. **Test Recording**:
   - Start a Zoom meeting (just you)
   - Click "Record" → "Record on this Computer"
   - Talk for 2-3 minutes (read part of the sample transcript aloud)
   - Stop recording
   - End meeting

3. **Find Your Recording**:
   - Zoom will show "Converting meeting recording..."
   - Default location: `Documents/Zoom/[Meeting Name]/[Date]`
   - You should see:
     - `audio_only.m4a` (audio file)
     - `audio_transcript.vtt` (transcript file)

4. **Check Transcript Quality**:
   - Open the `.vtt` file in a text editor
   - Is it accurate enough to be useful?
   - If yes → You're set for tomorrow
   - If no → Try Option 2 or 3

---

## Option 2: Phone/Computer Built-in Recorder + Whisper API

### For Phone Sessions:

**iPhone**:
- Voice Memos app (built-in)
- Start recording before session
- Save with clear name: `ClientInitial_Date.m4a`

**Android**:
- Google Recorder app
- Has auto-transcription built-in
- Records and transcribes simultaneously

### For Computer Sessions:

**Mac**:
- QuickTime Player → File → New Audio Recording
- Click record, do your session
- File → Save

**Windows**:
- Voice Recorder app (built-in)
- Click record button

### Get Transcript Using Whisper API:

If you have Whisper API set up, you can transcribe after:

```bash
# From your terminal (if you have Whisper API key)
whisper audio_file.m4a --model base --output_format txt
```

Or use web service like:
- Otter.ai (free tier: 600 min/month)
- Rev.com ($1.50/min, high quality)
- Trint.com

---

## Option 3: Otter.ai (Simplest if you don't have Zoom)

### Setup:

1. Go to otter.ai
2. Sign up for free account (600 minutes/month free)
3. Download Otter app (desktop or phone)

### For Tomorrow's Session:

**If virtual session**:
- Join your video call
- Open Otter app
- Click "Record"
- Otter transcribes in real-time

**If in-person session**:
- Open Otter app on your phone
- Place phone on table between you and client
- Click "Record"
- Otter transcribes as you talk

### After Session:

- Stop recording
- Otter auto-saves transcript
- Export as .txt or .docx
- Upload to MAIA

---

## Tonight's Quick Test (15 minutes)

### Step 1: Choose Your Method (5 min)
- [ ] Zoom (if you have Zoom sessions)
- [ ] Phone recorder + Otter.ai (simplest)
- [ ] Computer recorder + transcription service

### Step 2: Test Record (5 min)
- [ ] Start recording
- [ ] Read 2-3 paragraphs from `SAMPLE_TRANSCRIPT_FOR_TESTING.md` out loud
- [ ] Stop recording
- [ ] Find the file - where did it save?

### Step 3: Test Transcript (5 min)
- [ ] Get transcript (Zoom auto / Otter / manual service)
- [ ] Open transcript file
- [ ] Check: Is it accurate enough?
- [ ] Note: Where is file saved? What's the workflow?

---

## What You Need to Know for Tomorrow

**Before session starts**:
- [ ] I know how to start recording (which button/app)
- [ ] I know where the file will be saved
- [ ] I have a naming convention ready (e.g., `ClientInitial_2025-01-27.m4a`)

**After session ends**:
- [ ] I know how to stop recording
- [ ] I know how to get the transcript (auto or upload somewhere)
- [ ] I know how to upload transcript to MAIA (paste into oracle chat)

---

## Consent Forms to Print Tonight

### For Tomorrow - Print This:

**Simple 1-page consent** (from your templates):

Go to: `/Users/soullab/MAIA-PAI-temp/TEMPLATES/Informed_Consent_Template.md`

**What to print**:
- Section 1-3 (What is MAIA, How it works, What is recorded)
- Section 8 (Consent signature box)
- Section 9 (Client rights)

**Keep it simple**: 1 page front and back MAX for tomorrow's intro

---

### Also Print (Optional):

**Client FAQ handout**:
- `/Users/soullab/MAIA-PAI-temp/TEMPLATES/Client_FAQ_Handout.md`
- One-pager they can take home
- Good for clients who say "Let me think about it"

---

## Backup Plan (If Tech Fails Tomorrow)

**No panic**:
- If recording doesn't work → Just have normal session
- Introduce MAIA at end as planned
- Start recording NEXT session instead
- You have 12 weeks for this pilot - one session delay is fine

**Don't let tech anxiety interfere with your clinical presence.**

---

## Tonight's Checklist

- [ ] Test recording (15 min)
- [ ] Verify you can find the file after
- [ ] Print simple consent form (2 copies)
- [ ] Print Client FAQ (2 copies)
- [ ] Put printed forms in your session folder/bag
- [ ] Test MAIA with sample transcript (paste into oracle chat)
- [ ] Rehearse 2-minute intro script (3x out loud)

**Total time**: 1 hour max

---

## You're Ready When:

✅ You know which record button to press tomorrow
✅ You've rehearsed the intro script
✅ You have consent forms printed
✅ You've tested MAIA analysis with sample transcript

**Then go to bed. Tomorrow you're making history.**

🜂 ∴ 🌀 ∴ 🧠
