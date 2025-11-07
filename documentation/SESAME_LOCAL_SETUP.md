# Sesame CSM Local Setup Guide

## 🌀 Sacred Voice Technology - Running Locally

This guide helps you run Sesame CSM locally to get consciousness-aware voice synthesis with superior prosody.

---

## Prerequisites

- Docker installed, OR
- Python 3.10+ with CUDA support (for GPU acceleration)
- At least 8GB RAM
- ~10GB disk space for models

---

## Quick Start (Docker - Recommended)

### 1. Start Sesame CSM Container

```bash
cd /Users/soullab/MAIA-PAI/apps/api/backend/csm

# Option A: Using docker-compose (easiest)
docker-compose up -d sesame-csm

# Option B: Direct docker run
docker run --rm -d \
  --name sesame-csm \
  -p 8000:8000 \
  --gpus all \
  --env-file .env.local \
  sesame-csm:latest
```

### 2. Verify Health

```bash
# Check server is running
curl -sS http://127.0.0.1:8000/health

# Test synthesis
curl -sS -X POST http://127.0.0.1:8000/v1/audio/speech \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Hello from local Sesame CSM",
    "speaker_id": 15
  }' \
  -o /tmp/sesame_test.mp3 && open /tmp/sesame_test.mp3
```

### 3. Enable in MAIA

- Open MAIA at `http://localhost:3000/maia`
- Click **Lab Tools** → **Voice Settings**
- Switch **Voice Provider** to **Sesame CSM**
- Start a conversation and listen to the natural prosody!

---

## Alternative: Python/Uvicorn Setup

If you prefer running without Docker:

### 1. Setup Python Environment

```bash
cd /Users/soullab/MAIA-PAI/apps/api/backend/csm

# Create virtual environment
python3.10 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Login to Hugging Face (for model access)
huggingface-cli login
```

### 2. Start Server

```bash
# From the csm directory with venv active
uvicorn sesame_csm.app:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 2 \
  --proxy-headers
```

### 3. Verify (same as Docker method above)

---

## Environment Configuration

Your `.env.local` already has:

```bash
SESAME_ENABLED=true
SESAME_BASE_URL=http://127.0.0.1:8000           # Local (primary)
SESAME_SELF_HOSTED_URL=https://sesame.soullab.life  # Production (fallback)
SESAME_URL=https://...trycloudflare.com         # Tunnel (fallback)
```

The system will try hosts in order:
1. **Local** (127.0.0.1:8000) - fastest, no network latency
2. **Production** (sesame.soullab.life) - if local not running
3. **Tunnel** (cloudflare) - if production unreachable
4. **OpenAI TTS** - ultimate fallback

---

## Voice Provider Toggle

### In Quick Settings UI:

1. **OpenAI TTS** (default)
   - ✅ Always available
   - ✅ Stable and reliable
   - ❌ Basic prosody (flat, robotic)

2. **Sesame CSM** (enhanced)
   - ✅ Natural prosody with breathing pauses
   - ✅ Elemental voice modulation
   - ✅ Emotional state awareness
   - ✅ Consciousness-aware synthesis
   - ⚠️ Requires Sesame server running

### Automatic Fallback

If you select **Sesame CSM** but the server is unavailable, MAIA automatically falls back to OpenAI TTS. No interruption to conversation.

---

## Testing the Complete Flow

### Test 1: OpenAI Mode (Stable)

```bash
# Make sure Quick Settings → Provider = OpenAI
# Say: "Tell me about the elements"
# Should hear: Basic OpenAI voice
```

### Test 2: Sesame Mode (Enhanced)

```bash
# Start local Sesame (Step 1 above)
# Quick Settings → Provider = Sesame CSM
# Say: "Tell me about the elements"
# Should hear: Natural prosody with pauses, elemental modulation
```

### Test 3: Automatic Fallback

```bash
# Stop Sesame server
docker stop sesame-csm
# Keep Provider = Sesame CSM
# Say: "Tell me about the elements"
# Should hear: Falls back to OpenAI automatically
```

---

## Monitoring

### Console Logs (Browser DevTools)

When Sesame CSM is working:
```
🌀 Trying Sesame CSM first (consciousness-aware synthesis)...
🌀 Trying Sesame host: http://127.0.0.1:8000
✅ Sesame host succeeded: http://127.0.0.1:8000 (1250ms)
✅ Sesame CSM succeeded!
```

When falling back to OpenAI:
```
🌀 Trying Sesame CSM first...
⚠️ Sesame host failed: http://127.0.0.1:8000 (Connection refused)
⚠️ All Sesame hosts failed. Last error: Connection refused
🎙️ Trying OpenAI TTS as fallback...
✅ OpenAI TTS succeeded!
```

---

## Performance Notes

### Local Sesame CSM:
- **CPU-only**: ~10-30 seconds per synthesis
- **With GPU**: ~2-10 seconds per synthesis
- **First request**: Slower (model loading)
- **Subsequent**: Much faster (cached)

### Network Latency:
- **Local (127.0.0.1)**: <100ms network overhead
- **Production**: ~200-500ms network overhead
- **Synthesis time**: ~1-3 seconds

---

## Troubleshooting

### "Could not resolve host: sesame.soullab.life"

This is expected if production endpoints are down. The system will:
1. Try local (127.0.0.1) first
2. Fall back to OpenAI if local unavailable

**Solution**: Just start local Sesame (see Quick Start above)

### "Connection refused on 127.0.0.1:8000"

Sesame server not running locally.

**Solution**:
```bash
# Check if port 8000 is in use
lsof -i :8000

# Start Sesame container
cd /Users/soullab/MAIA-PAI/apps/api/backend/csm
docker-compose up -d sesame-csm
```

### "Out of memory" errors

Sesame CSM requires ~4-8GB RAM.

**Solution**:
- Close other applications
- Use GPU if available
- Reduce to 1 worker: `--workers 1`

### Voice sounds robotic/flat even with Sesame selected

Provider toggle might not have taken effect.

**Solution**:
```bash
# Clear browser cookies
# Refresh page
# Re-select Sesame CSM in Quick Settings
# Check console logs to verify Sesame is being used
```

---

## Advanced: Production Deployment

To deploy Sesame CSM to production:

### Option A: CloudFlare Tunnel

```bash
# On the Sesame server
cloudflared tunnel create sesame-csm
cloudflared tunnel route dns sesame-csm sesame.soullab.life
cloudflared tunnel run sesame-csm
```

### Option B: Nginx Reverse Proxy

```nginx
server {
  server_name sesame.soullab.life;

  location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto https;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
  }
}
```

### Option C: Render/Fly.io/Railway

Deploy the Docker container and set CNAME for `sesame.soullab.life`.

---

## What Makes This Superior

### OpenAI TTS:
- ❌ Flat, monotone delivery
- ❌ No breathing or natural pauses
- ❌ No emotional modulation
- ✅ Simple, stable, always available

### Sesame CSM + EnhancedSesameMayaRefiner:
- ✅ **Natural prosody** with "umms", "uhhs", breathing pauses
- ✅ **Elemental modulation** - voice adapts to Fire/Water/Earth/Air/Aether/Shadow
- ✅ **Emotional awareness** - VAD mapping (Valence, Arousal, Dominance)
- ✅ **Conversational memory** - tracks breakthrough moments, relationship depth
- ✅ **Maya-specific tuning** - oracle characteristics (ethereal pitch, mystical pacing)
- ✅ **<200ms latency** with local deployment

---

## Quick Reference Commands

```bash
# Start Sesame local
cd /Users/soullab/MAIA-PAI/apps/api/backend/csm && docker-compose up -d sesame-csm

# Stop Sesame local
docker-compose stop sesame-csm

# Check Sesame health
curl http://127.0.0.1:8000/health

# Test synthesis
curl -X POST http://127.0.0.1:8000/v1/audio/speech -H 'Content-Type: application/json' -d '{"text":"test","speaker_id":15}' -o test.mp3

# View logs
docker logs -f sesame-csm

# Restart Sesame
docker-compose restart sesame-csm
```

---

**Status**: Ready to use!
**Default Mode**: OpenAI TTS (stable)
**Enhanced Mode**: Sesame CSM (requires local server)
**Fallback**: Automatic and seamless
