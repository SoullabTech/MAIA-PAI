# MAIA Voice Quick-Start Guide 🎯

**Last Updated**: October 22, 2025

This guide gets you from "Maia not working" to "Full voice sovereignty" in the shortest path possible.

---

## 🚨 IMMEDIATE FIX (Do This First - 5 minutes)

### Step 1: Run Debug Script

1. Open MAIA in your browser: `http://localhost:3000`
2. Open DevTools Console: Press `F12` or `Cmd+Option+J`
3. Copy and paste the debug script:

```bash
# Copy the debug script
cat /Users/soullab/MAIA-FRESH/scripts/debug-maia-voice.js
```

4. Press `Enter` - wait for diagnostics to complete
5. Read the recommendations - it will tell you EXACTLY what's wrong

### Step 2: Most Common Fixes

#### Fix #1: Missing/Invalid OpenAI API Key (80% of issues)

```bash
# Check your .env.local file
cat .env.local | grep OPENAI_API_KEY

# Should show:
# OPENAI_API_KEY=sk-proj-...

# If missing or wrong:
echo "OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE" >> .env.local

# Restart Next.js
# (Stop with Ctrl+C, then run npm run dev again)
```

**Verify your key has Realtime API access:**
- Go to: https://platform.openai.com/api-keys
- Check if your key has "Realtime API" permission
- If not, create a new key with Realtime access

#### Fix #2: Not Running on HTTPS/Localhost

WebRTC requires secure context. Options:

```bash
# Option A: Use localhost (recommended for dev)
# Already should be working if on localhost:3000

# Option B: Use ngrok for HTTPS tunnel (if testing remote)
npx ngrok http 3000

# Option C: Deploy to Vercel (automatic HTTPS)
vercel deploy
```

#### Fix #3: Microphone Permissions

**macOS:**
```
System Settings → Privacy & Security → Microphone
→ Enable for your browser (Chrome/Safari/Firefox)
```

**Browser:**
```
Click the 🔒 icon in address bar
→ Site Settings → Microphone → Allow
→ Reload page
```

### Step 3: Hard Refresh

After fixes:
```
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
```

This clears cached scripts and reloads everything.

---

## 🎤 VOICE SOVEREIGNTY SETUP (30-60 minutes)

Once Maia is working again, let's make you independent of OpenAI.

### Phase 1: Download Transcript & Review Conversations

#### Make Download Button More Visible

Your download button exists but might be hidden. Let's make it prominent:

```bash
# Check current UI
open http://localhost:3000

# The download button is in OracleConversation.tsx
# Let's enhance it
```

I can help you:
1. Make download button bigger/more obvious
2. Add "View Past Conversations" section
3. Create auto-summary after each session
4. Build conversation review dashboard

**Want me to do this now?** (Takes 10 mins)

### Phase 2: Set Up Local Voice Stack

#### Option A: Docker (Easiest - Recommended)

```bash
cd /Users/soullab/MAIA-FRESH/voice-training

# Start XTTS voice server (already configured!)
docker-compose -f docker-compose.sesame-xtts.yml up -d

# Check if running
curl http://localhost:8000/health

# Should return: {"status": "healthy"}
```

#### Option B: Local Python (If Docker issues)

```bash
cd /Users/soullab/MAIA-FRESH/voice-training

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Start XTTS server
python -m TTS.server.server \
  --model_name tts_models/multilingual/multi-dataset/xtts_v2 \
  --port 8000

# In another terminal, start Whisper
pip install faster-whisper
python whisper-server.py  # We'll create this
```

### Phase 3: Voice Actor Recruitment

#### Post on Voices.com (Copy-paste ready)

```
═══════════════════════════════════════════════════════
VOICE ACTING JOB - AI SPIRITUAL COACHING APPLICATION
═══════════════════════════════════════════════════════

Project: AI Voice Training - Sacred Coaching Guides
Budget: $600 per voice (2 voices needed)
Timeline: 7 days from hire
Usage: Commercial AI training, perpetual license

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHARACTER 1: MAYA (The Oracle) - Female

Age: 45-60 years old
Voice Quality: Warm, maternal, wise, comforting
Think: Oprah meets your wisest aunt
Emotional Range: Empathetic, playful, serious, celebratory
Elemental Quality: Fire - passionate clarity

Sample Phrases:
• "Welcome back, beloved soul. What's stirring in your heart today?"
• "I hear you. Tell me more about what you're noticing."
• "That's a beautiful insight. How does it feel in your body?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHARACTER 2: ANTHONY (The Philosopher) - Male

Age: 40-55 years old
Voice Quality: Deep, grounded, contemplative
Think: Morgan Freeman meets Eckhart Tolle
Emotional Range: Reflective, encouraging, challenging, gentle
Elemental Quality: Earth - solid wisdom

Sample Phrases:
• "Let's pause here. What are you really asking yourself?"
• "I sense there's more beneath the surface. Shall we explore?"
• "Notice the pattern emerging. What does it reveal?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REQUIREMENTS:

Technical:
✓ Professional home studio setup
✓ WAV files, 48kHz, 16-bit, mono
✓ Clean recordings (no music, no background noise)
✓ Organized file naming: maya_greeting_001_take1.wav

Recording:
✓ 100 scripted phrases per character
✓ 2-3 takes per phrase for variety
✓ 30-45 minutes total recording time
✓ Conversational, authentic delivery
✓ Emotional variation as directed

Deliverables:
✓ All WAV files organized by phrase ID
✓ Delivered via Google Drive or WeTransfer
✓ Delivered within 7 days of hire
✓ Complete copyright transfer for AI training

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUDITION PROCESS:

Please submit:
1. Your demo reel
2. 3 sample phrases from character breakdown (see below)
3. Brief note on why you connect with this character
4. Your availability for recording session

Sample Audition Phrases (record all 3):

For MAYA:
1. "Welcome back, beloved soul. What's stirring in your heart today?"
2. "That's a beautiful insight. How does it feel in your body?"
3. "I celebrate you. This is sacred work you're doing."

For ANTHONY:
1. "Let's pause here. What are you really asking yourself?"
2. "I sense there's more beneath the surface. Shall we explore?"
3. "Notice the pattern emerging. What does it reveal?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ABOUT THE PROJECT:

We're building MAIA - a consciousness exploration platform
that helps people develop self-awareness through AI-guided
dialogue. This isn't therapy; it's spiritual coaching at scale.

Your voice will become the permanent voice of these guides,
helping thousands of people explore their inner landscape.

This is meaningful work with lasting impact.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPENSATION:

• $600 per voice (total $1,200 for both)
• Payment via PayPal, Venmo, or bank transfer
• 50% upfront, 50% on delivery
• Copyright transfer agreement signed
• Credited as "Voice of Maya/Anthony" in app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TO APPLY:

1. Submit audition via Voices.com platform
2. Include demo reel + 3 sample phrases
3. State your rate (budget is $600/voice)
4. Confirm 7-day availability

Looking forward to hearing your voice! ✨

═══════════════════════════════════════════════════════
```

#### Post This Job Here:

1. **Voices.com** (Premium, $600/post)
   - https://www.voices.com/hire
   - Best quality, fastest results

2. **Fiverr Pro** (Cheaper alternative, $0 to post)
   - https://www.fiverr.com/
   - Search "voice actor AI training"
   - Look for Pro sellers with great reviews

3. **Upwork** (Mid-tier, ~$100/post)
   - https://www.upwork.com/
   - Post as "Voice Recording for AI Training"

4. **Reddit** (Free, slower)
   - r/VoiceActing
   - r/VoiceWork
   - Be clear about AI training usage

---

## 📊 COST COMPARISON

### Current Stack (Per Month, 1000 conversations):

| Service | Cost |
|---------|------|
| OpenAI Realtime API | $800/mo |
| ElevenLabs TTS | $1,000/mo |
| **Total** | **$1,800/mo** |

### After Sovereignty (Per Month, 1000 conversations):

| Service | Cost |
|---------|------|
| Local Whisper (STT) | $0 |
| Claude/GPT (LLM) | $100/mo |
| Local XTTS (TTS) | $50/mo GPU |
| **Total** | **$150/mo** |

### Savings:
- **Monthly**: $1,650/mo saved (92% reduction)
- **Yearly**: $19,800/yr saved
- **Break-even**: Month 1 (after $1,200 voice actor investment)

---

## ✅ SUCCESS CHECKLIST

### Immediate (Today):
- [ ] Run debug script
- [ ] Fix WebRTC connection
- [ ] Maia talking again
- [ ] Download conversation transcripts

### This Week:
- [ ] Post voice actor jobs
- [ ] Review auditions
- [ ] Hire actors
- [ ] Start local XTTS server

### Week 2:
- [ ] Record voice sessions
- [ ] Process recordings
- [ ] Train XTTS models
- [ ] A/B test quality

### Week 3-4:
- [ ] Deploy local stack
- [ ] Integrate with MAIA
- [ ] Monitor costs
- [ ] Celebrate sovereignty! 🎉

---

## 🆘 GET HELP

### If Debug Script Shows Issues:

1. **API Key Problems**
   - Check: https://platform.openai.com/api-keys
   - Verify Realtime API access
   - Create new key if needed
   - Update `.env.local`
   - Restart server

2. **Microphone Problems**
   - Grant permissions in System Settings
   - Check if other app using mic (Zoom, Discord)
   - Try different browser
   - Test mic in: https://www.onlinemictest.com/

3. **WebSocket Problems**
   - Check if running on localhost or HTTPS
   - Clear browser cache (Cmd+Shift+Delete)
   - Disable VPN if running
   - Try incognito mode

4. **Still Not Working?**
   - Check browser console for errors
   - Check Next.js terminal for errors
   - Run: `npm run dev` to see server logs
   - Share errors with me

### If Voice Training Has Issues:

1. **Docker not running**
   ```bash
   # Start Docker Desktop first
   open -a Docker

   # Then try again
   docker-compose up -d
   ```

2. **Python issues**
   ```bash
   # Make sure Python 3.9+ installed
   python3 --version

   # Create fresh venv
   rm -rf venv
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **GPU issues**
   ```bash
   # Check if CUDA available (NVIDIA only)
   python3 -c "import torch; print(torch.cuda.is_available())"

   # If False, use CPU mode (slower but works)
   # Edit docker-compose.sesame-xtts.yml
   # Remove: --gpus all
   ```

---

## 🚀 NEXT STEPS

**Right now, you should:**

1. **Fix immediate issue**: Run debug script
2. **Post voice jobs**: Copy job description above
3. **Start local server**: `docker-compose up -d`
4. **Tell me what you need help with next**

I'm here to help implement every step!

What do you want to tackle first? 🎯
