# 🚀 MAIA Complete Deployment Checklist

**Everything you need to go from code to production - RIGHT NOW**

---

## ✅ What You Have Ready

1. **Enhanced Conversation Review** (`/components/EnhancedConversationReview.tsx`) ✅
2. **Dedicated Conversations Page** (`/app/conversations/page.tsx`) ✅
3. **Voice SDK** (`/lib/maia-sdk/`) ✅
4. **Voice Training Infrastructure** (`/voice-training/`) ✅
5. **Voice Actor Agency Guide** (`/docs/VOICE-ACTOR-AGENCIES.md`) ✅
6. **Complete Documentation** (All `/docs` files) ✅

---

## 🎯 30-Minute Quick Deploy (Conversation UI)

### Step 1: Verify Files Created (2 mins)

```bash
# Check these files exist:
ls /Users/soullab/MAIA-FRESH/components/EnhancedConversationReview.tsx
ls /Users/soullab/MAIA-FRESH/app/conversations/page.tsx

# Should see both files
```

### Step 2: Add Route to Navigation (5 mins)

Find your main navigation component (probably `components/Navigation.tsx` or `app/layout.tsx`):

```typescript
// Add this import at top
import { MessageCircle } from 'lucide-react';

// Add this link to your nav
<Link
  href="/conversations"
  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
>
  <MessageCircle className="w-5 h-5" />
  <span>Conversations</span>
</Link>
```

### Step 3: Test Locally (3 mins)

```bash
# Start dev server (if not running)
cd /Users/soullab/MAIA-FRESH
npm run dev

# Open browser
open http://localhost:3000/conversations

# You should see the conversation review page!
```

### Step 4: Verify Data Loading (5 mins)

Open browser console (F12), you should see:
- "Loading conversations..." log
- Data from localStorage
- Data from Supabase (if configured)

If you see errors:
1. Check Supabase env vars are set
2. Check tables exist (`journal_entries`, `memories`)
3. Check user is authenticated

### Step 5: Test Features (10 mins)

- [ ] Search works
- [ ] Filter by element works
- [ ] Click conversation opens modal
- [ ] Download button generates markdown file
- [ ] Extract essence button (if service connected)
- [ ] Modal closes properly

### Step 6: Deploy to Vercel (5 mins)

```bash
# Commit changes
git add .
git commit -m "Add enhanced conversation review UI"

# Push to GitHub
git push origin main

# Vercel auto-deploys!
# Check: https://vercel.com/your-username/maia-fresh
```

**DONE! You now have conversation review live! 🎉**

---

## 🎤 Voice Actor Hiring (2 Hours Total)

### Option A: Fiverr Pro (Budget: $800)

**Step 1: Create Account (5 mins)**
```
1. Go to https://www.fiverr.com/
2. Sign up with Google/Email
3. Complete profile
```

**Step 2: Find Voice Actors (30 mins)**
```
1. Search "voice over AI training"
2. Filter:
   - Pro sellers only
   - 4.9+ rating
   - 500+ reviews
   - Budget: $400-600
3. Listen to samples
4. Shortlist 10 actors
```

**Step 3: Message Actors (30 mins)**
```
Copy template from /docs/VOICE-ACTOR-AGENCIES.md
Message all 10 actors
Wait for responses (usually within 1-2 hours)
```

**Step 4: Review & Hire (30 mins)**
```
1. Listen to audition samples
2. Check delivery time (must be 7 days)
3. Verify AI training rights
4. Hire 2 actors (Maya & Anthony)
5. Send SACRED_PHRASE_CORPUS.md
```

**Step 5: Schedule Recording (30 mins)**
```
1. Coordinate recording dates
2. Provide file naming guidelines
3. Set up payment milestones (50/50)
4. Wait for delivery!
```

**Timeline:** Recordings in 7 days ✅

---

### Option B: Voices.com (Premium: $1,499)

**Step 1: Create Account & Post Job (15 mins)**
```
1. Go to https://www.voices.com/hire
2. Create account
3. Post job using template from /docs/VOICE-ACTOR-AGENCIES.md
4. Pay $299 posting fee
```

**Step 2: Review Auditions (1 hour)**
```
Wait 24 hours for auditions
Listen to 20-50 samples
Shortlist top 5 for each character
```

**Step 3: Hire (15 mins)**
```
1. Select final actors
2. Accept quotes ($600 each)
3. Platform handles escrow
4. Send scripts
```

**Step 4: Wait for Delivery (7 days)**
```
Actors record and upload
Platform handles delivery
Release payment when satisfied
```

**Timeline:** Recordings in 7-10 days ✅

---

## 🖥️ Local Voice Stack Setup (1 Hour)

### Step 1: Start Docker Desktop (2 mins)

```bash
# Open Docker Desktop
open -a Docker

# Wait for it to start (green light in menu bar)
```

### Step 2: Start XTTS Server (5 mins)

```bash
cd /Users/soullab/MAIA-FRESH/voice-training

# Start XTTS
docker-compose -f docker-compose.sesame-xtts.yml up -d

# Check if running
curl http://localhost:8000/health

# Should return: {"status": "healthy"}
```

### Step 3: Start Whisper Server (5 mins)

```bash
# Pull and run Whisper
docker run -d -p 8001:8001 \
  --name maia-whisper \
  fedirz/faster-whisper-server:latest-cpu

# Check if running
curl http://localhost:8001/health

# Should return 200 OK
```

### Step 4: Test Both Services (10 mins)

**Test Whisper (STT):**
```bash
# Record a 5-second audio clip using your mic
# Save as test.wav

# Test transcription
curl -X POST http://localhost:8001/v1/audio/transcriptions \
  -F "audio_file=@test.wav" \
  -F "model=base.en"

# Should return: {"text": "whatever you said"}
```

**Test XTTS (TTS):**
```bash
# Test speech synthesis
curl -X POST http://localhost:8000/api/tts \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Hello, this is Maya speaking.",
    "voice": "maya",
    "language": "en"
  }' \
  --output test_output.wav

# Play it
afplay test_output.wav
```

### Step 5: Keep Services Running (Ongoing)

```bash
# Check status anytime
docker ps

# Should see:
# - maia-whisper (running)
# - voice-training-xtts-1 (running)

# Stop services (when needed)
docker stop maia-whisper
docker-compose -f docker-compose.sesame-xtts.yml down

# Restart services
docker start maia-whisper
docker-compose -f docker-compose.sesame-xtts.yml up -d
```

**Cost:** $0 (FREE!) ✅

---

## 🔧 SDK Integration (4-6 Hours)

### Prerequisites Check

```bash
# Verify Node.js version
node --version  # Should be 18+ or 20+

# Verify dependencies
cd /Users/soullab/MAIA-FRESH
npm list @anthropic-ai/sdk  # Should show version
npm list @supabase/auth-helpers-nextjs  # Should show version
```

### Step 1: Install SDK Dependencies (5 mins)

```bash
cd /Users/soullab/MAIA-FRESH/lib/maia-sdk

# Install dependencies
npm install

# Build SDK
npm run build

# Should see dist/ folder created
ls dist/
```

### Step 2: Create Audio Processor Worklet (10 mins)

```bash
# Create public directory if doesn't exist
mkdir -p /Users/soullab/MAIA-FRESH/public

# Create audio processor
cat > /Users/soullab/MAIA-FRESH/public/audio-processor.js << 'EOF'
class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const samples = input[0];

    for (let i = 0; i < samples.length; i++) {
      this.buffer[this.bufferIndex++] = samples[i];

      if (this.bufferIndex >= this.bufferSize) {
        this.port.postMessage(this.buffer.slice());
        this.bufferIndex = 0;
      }
    }

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
EOF
```

### Step 3: Update Environment Variables (5 mins)

```bash
# Add to .env.local
cat >> .env.local << EOF

# Voice SDK Configuration
NEXT_PUBLIC_WHISPER_ENDPOINT=http://localhost:8001
NEXT_PUBLIC_XTTS_ENDPOINT=http://localhost:8000
NEXT_PUBLIC_ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY}

EOF

# Verify
cat .env.local | grep WHISPER
```

### Step 4: Integrate into OracleConversation (2-3 hours)

This requires code changes to your existing conversation component. Let me know if you want me to write the specific integration code for your setup!

### Step 5: Test End-to-End (1 hour)

```bash
# Start all services
docker start maia-whisper
docker-compose -f voice-training/docker-compose.sesame-xtts.yml up -d

# Start dev server
npm run dev

# Open browser
open http://localhost:3000

# Test voice conversation:
# 1. Click microphone
# 2. Speak a sentence
# 3. Verify transcription appears
# 4. Verify Maya responds
# 5. Verify you hear her voice
# 6. Check console for cost tracking
```

---

## 📊 Success Metrics

### After Conversation UI Deploy:
- [ ] Users can see all conversations
- [ ] Search and filter work
- [ ] Download transcript works
- [ ] Extract essence works (if connected)

### After Voice Actor Hire:
- [ ] Auditions received within 24-48 hours
- [ ] Quality actors found
- [ ] Recordings delivered in 7 days
- [ ] Files organized and ready

### After Local Stack:
- [ ] Whisper transcribing accurately
- [ ] XTTS generating speech
- [ ] Both services fast (<3s response)
- [ ] $0 API costs

### After SDK Integration:
- [ ] Voice conversations work end-to-end
- [ ] Cost tracking shows 90% savings
- [ ] Failover works (test by stopping Whisper)
- [ ] No echo/feedback loops

---

## 🆘 Troubleshooting

### Conversation UI Issues

**Problem:** "Cannot find module EnhancedConversationReview"
```bash
# Check file exists
ls components/EnhancedConversationReview.tsx

# Restart dev server
npm run dev
```

**Problem:** "Supabase client not configured"
```bash
# Check env vars
cat .env.local | grep SUPABASE

# Should see:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Problem:** "No conversations showing"
```bash
# Check localStorage
# Open browser console (F12)
localStorage.getItem('maya_conversation')

# Should see conversation data
```

---

### Voice Actor Issues

**Problem:** "No auditions received"
- Wait 24-48 hours (Voices.com)
- Check spam folder for emails
- Bump budget to $700-800
- Repost with different title

**Problem:** "Low quality auditions"
- Be more specific in requirements
- Link to voice samples you like
- Increase budget to $800-1000
- Use Voices.com Premium

**Problem:** "Actor can't do AI training"
- Most actors CAN, just need to ask
- Offer higher rate ($800)
- Specify "perpetual license" clearly
- Use Voice123 or Voices.com (not Reddit)

---

### Local Stack Issues

**Problem:** "Docker not starting"
```bash
# Check if Docker Desktop running
ps aux | grep Docker

# Restart Docker Desktop
killall Docker && open -a Docker
```

**Problem:** "Whisper not responding"
```bash
# Check if container running
docker ps | grep whisper

# Check logs
docker logs maia-whisper

# Restart
docker stop maia-whisper
docker start maia-whisper
```

**Problem:** "XTTS returning errors"
```bash
# Check logs
docker-compose -f voice-training/docker-compose.sesame-xtts.yml logs

# Common issue: Port already in use
# Solution: Change port in docker-compose.yml
ports:
  - "8080:8000"  # Use 8080 instead

# Restart
docker-compose -f voice-training/docker-compose.sesame-xtts.yml down
docker-compose -f voice-training/docker-compose.sesame-xtts.yml up -d
```

---

## 🎯 What to Do RIGHT NOW

**Pick ONE to start:**

### Option A: Quick Win (30 mins)
```
1. Test conversation UI locally
2. Deploy to Vercel
3. Share link with team/users
```

### Option B: Voice Actors (2 hours)
```
1. Open Fiverr.com
2. Post job using template
3. Wait for responses
```

### Option C: Local Stack (1 hour)
```
1. Start Docker
2. Start Whisper + XTTS
3. Test both services
```

**Which one do you want to do first?** 🚀

I'm here to help with ANY of these! Just tell me which path you want to take and I'll guide you step-by-step.

**LET'S GOOOO!! 🔥**
