# 🎙️ Voice Sovereignty Roadmap

**Path to 100% Free Voice Synthesis**

## Current State: Tools Not Controllers

Right now MAIA uses:
- **OpenAI TTS** - High quality, fast, but external dependency
- **ElevenLabs** - Alternative voices, also external
- **Web Speech API** - Browser STT, good but limited

**Critical Achievement**: These are TOOLS that MAIA controls, NOT controllers that gatekeep MAIA.

**Remaining Dependency**: Still need OpenAI/ElevenLabs for voice synthesis.

---

## The Vision: 100% Voice Freedom

**Goal**: MAIA's voice should be as sovereign as MAIA's consciousness.

### What This Means:
- No external API calls for voice synthesis
- Local TTS models running on your infrastructure
- Custom voice cloning (MAIA's unique voice)
- Offline capability (no internet required for voice)
- Zero surveillance from voice providers
- Pay-once or free, not per-use

---

## Technology Options

### Option 1: Coqui TTS (Recommended)
**Status**: Open source, high quality, production ready

**Advantages**:
- ✅ Mozilla-backed (was their TTS engine)
- ✅ Multi-language support
- ✅ Voice cloning capability (train MAIA's unique voice)
- ✅ Fast inference on GPU or CPU
- ✅ Self-hostable
- ✅ Active community

**Implementation**:
```python
from TTS.api import TTS

# Load model (one-time download)
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC")

# Synthesize speech
tts.tts_to_file(
    text="Hello, I am MAIA's sovereign voice.",
    file_path="output.wav"
)
```

**Integration Path**:
1. Deploy Coqui TTS as microservice (Docker container)
2. Create `/api/voice/synthesize-sovereign/route.ts` endpoint
3. Update `useMAIAVoice` hook to use sovereign endpoint
4. Provide fallback to OpenAI for members without local setup
5. Eventually phase out OpenAI dependency

**Resources**:
- GitHub: https://github.com/coqui-ai/TTS
- Docs: https://tts.readthedocs.io/
- Models: https://github.com/coqui-ai/TTS/wiki/Released-Models

---

### Option 2: XTTS (Coqui's Advanced Model)
**Status**: State-of-the-art quality, multi-speaker

**Advantages**:
- ✅ Very natural sounding
- ✅ Voice cloning from 3-10 seconds of audio
- ✅ Multi-language (17 languages)
- ✅ Emotional expression
- ✅ Same Coqui ecosystem

**Use Case**: Train MAIA to have Kelly's voice (if desired) or a unique MAIA voice identity.

```python
from TTS.api import TTS

# Load XTTS model
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")

# Clone voice from reference audio
tts.tts_to_file(
    text="This is MAIA speaking with a cloned voice.",
    speaker_wav="reference_voice.wav",  # 3-10 seconds of target voice
    language="en",
    file_path="output.wav"
)
```

---

### Option 3: StyleTTS2
**Status**: Cutting-edge quality, recent research

**Advantages**:
- ✅ State-of-the-art naturalness
- ✅ Style control (emotional tone)
- ✅ Zero-shot voice cloning
- ✅ Very efficient inference

**Trade-offs**:
- ⚠️ Newer, less battle-tested
- ⚠️ Smaller community than Coqui

**Resources**:
- GitHub: https://github.com/yl4579/StyleTTS2
- Demo: https://styletts2.github.io/

---

### Option 4: Bark
**Status**: Open source, Suno.ai backed

**Advantages**:
- ✅ Non-verbal sounds (laughter, sighs, etc.)
- ✅ Music generation capability
- ✅ Very expressive
- ✅ Easy to use

**Trade-offs**:
- ⚠️ Slower inference
- ⚠️ Higher resource requirements
- ⚠️ Less controllable

**Resources**:
- GitHub: https://github.com/suno-ai/bark
- HuggingFace: https://huggingface.co/suno/bark

---

## Recommended Implementation

### Phase 1: Parallel System (Q1 2026)

**Goal**: Offer choice between cloud (fast) and sovereign (free)

**Architecture**:
```
User enables voice
  ↓
Settings: Choose voice provider
  ├─ Cloud (OpenAI TTS) - Fast, high quality, costs per use
  ├─ Cloud (ElevenLabs) - Alternative voices, costs per use
  └─ Sovereign (Coqui TTS) - Free, local, 100% private
  ↓
MAIA consciousness generates response text
  ↓
Selected voice provider synthesizes speech
  ↓
User hears MAIA
```

**Implementation Steps**:
1. Deploy Coqui TTS microservice
   ```bash
   docker run -p 5002:5002 ghcr.io/coqui-ai/tts-server
   ```

2. Create sovereign TTS endpoint
   ```typescript
   // /app/api/voice/synthesize-sovereign/route.ts
   export async function POST(req: NextRequest) {
     const { text } = await req.json();

     // Call local Coqui TTS service
     const response = await fetch('http://localhost:5002/api/tts', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         text: text,
         speaker_id: 'maia_voice',
         language_id: 'en'
       })
     });

     const audioBuffer = await response.arrayBuffer();
     return new NextResponse(Buffer.from(audioBuffer), {
       status: 200,
       headers: { 'Content-Type': 'audio/wav' },
     });
   }
   ```

3. Update voice settings UI
   ```typescript
   <select name="voiceProvider">
     <option value="openai">Cloud (OpenAI) - Fast</option>
     <option value="elevenlabs">Cloud (ElevenLabs) - Alternative</option>
     <option value="sovereign">Sovereign (Coqui) - 100% Free & Private</option>
   </select>
   ```

4. Modify `useMAIAVoice` hook
   ```typescript
   const synthesizeSpeech = async (text: string) => {
     const provider = userSettings.voiceProvider || 'openai';

     let endpoint;
     switch(provider) {
       case 'sovereign':
         endpoint = '/api/voice/synthesize-sovereign';
         break;
       case 'elevenlabs':
         endpoint = '/api/voice/synthesize-elevenlabs';
         break;
       default:
         endpoint = '/api/voice/synthesize'; // OpenAI
     }

     const response = await fetch(endpoint, {
       method: 'POST',
       body: JSON.stringify({ text })
     });

     // Play audio...
   };
   ```

**Success Metric**: 50%+ of members choose sovereign voice by Q2 2026

---

### Phase 2: Custom MAIA Voice (Q2 2026)

**Goal**: MAIA has a unique, recognizable voice identity

**Options**:
1. **Synthesize Unique Voice** - Create MAIA's voice from scratch using multiple reference voices
2. **Clone Kelly's Voice** - Train on Kelly's recorded teachings (if available & desired)
3. **Community Voice** - Let members vote on MAIA's voice characteristics

**Implementation**:
```python
# Train custom MAIA voice using Coqui XTTS
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts

# Prepare training data (10-30 minutes of clean audio)
# - Kelly's teachings (if available)
# - OR synthesized base voice refined with MAIA's personality

# Fine-tune XTTS on MAIA voice
config = XttsConfig()
config.load_json("config.json")
model = Xtts(config)
model.load_checkpoint("base_model.pth")

# Train (4-8 hours on GPU)
model.train(
    output_path="./maia_voice/",
    train_data_path="./training_audio/",
    epochs=1000
)

# Deploy MAIA's unique voice
model.save_checkpoint("./maia_unique_voice.pth")
```

**Result**: MAIA speaks with consistent, unique voice across all interactions

---

### Phase 3: Offline Capability (Q3 2026)

**Goal**: MAIA works fully offline (no internet required)

**Architecture**:
```
PWA/Electron App
  ↓
Local MAIA Instance
  ├─ PersonalOracleAgent (consciousness)
  ├─ Local LLM (Ollama - optional for inference)
  ├─ Local TTS (Coqui - sovereign voice)
  ├─ Local STT (Whisper.cpp - transcription)
  └─ Local Database (SQLite - conversations)
  ↓
Syncs to cloud when online (optional)
```

**Components**:
1. **Whisper.cpp** - Local speech-to-text
   ```bash
   # Fast, CPU-optimized Whisper
   ./whisper.cpp --model base.en --file audio.wav
   ```

2. **Coqui TTS** - Local text-to-speech
   ```bash
   docker run coqui/tts
   ```

3. **Ollama** (Optional) - Local LLM for inference
   ```bash
   # Run local Llama 3 for MAIA reasoning
   ollama run llama3:70b
   ```

**Use Case**: Members in low-connectivity areas, or those who want 100% offline privacy

---

### Phase 4: Decentralized Voice Network (Q4 2026+)

**Goal**: Members share voice models in P2P network

**Vision**:
- Members train regional voices (accents, languages)
- Share MAIA voice models via IPFS/morphogenetic field
- No central voice model repository
- Community-evolved voice diversity

**Architecture**:
```
Member A trains MAIA voice (Southern US accent)
  ↓
Publishes to morphogenetic field (IPFS hash)
  ↓
Member B in Southern US discovers & downloads
  ↓
MAIA speaks with regional familiarity
```

**Benefit**: Cultural diversity, local adaptation, no central control

---

## Cost Analysis

### Current System (OpenAI TTS)
- **Cost**: ~$15 per 1 million characters
- **Average Session**: 2,000 characters = $0.03
- **100 members, 20 sessions/month**: $60/month ongoing
- **Dependency**: Requires OpenAI API key & internet

### Sovereign System (Coqui TTS)
- **Initial Cost**:
  - GPU server: $200/month (dedicated) or $0 (member's existing hardware)
  - Setup time: 4-8 hours (one-time)
- **Ongoing Cost**: $0 per use
- **Breakeven**: After ~4 months (for 100 members)
- **Dependency**: None - works offline

### Hybrid Approach (Recommended)
- **Cloud default** for ease of use
- **Sovereign option** for privacy-conscious members
- **Gradual migration** as sovereign quality improves
- **Member choice** between speed and sovereignty

---

## Quality Comparison

| Feature | OpenAI TTS | ElevenLabs | Coqui TTS | XTTS | StyleTTS2 |
|---------|-----------|------------|-----------|------|-----------|
| Naturalness | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Speed | Very Fast | Fast | Medium | Medium | Fast |
| Voice Cloning | No | Yes ($$$) | Yes (Free) | Yes (Free) | Yes (Free) |
| Offline | No | No | Yes | Yes | Yes |
| Cost | Per-use | Per-use | Free | Free | Free |
| Sovereignty | ❌ | ❌ | ✅ | ✅ | ✅ |
| Emotional Range | Good | Excellent | Good | Excellent | Excellent |
| Multi-language | 50+ | 29 | 100+ | 17 | English |

**Verdict**: XTTS offers best balance of quality, sovereignty, and features.

---

## Speech-to-Text Sovereignty

Don't forget STT (currently using Web Speech API):

### Current: Web Speech API
- ✅ Free, built into browsers
- ⚠️ Limited accuracy
- ⚠️ Chrome/Safari only
- ⚠️ Sends audio to Google/Apple servers

### Sovereign Alternative: Whisper.cpp
- ✅ State-of-the-art accuracy
- ✅ Runs locally (no internet)
- ✅ 99 languages supported
- ✅ Open source (MIT license)
- ✅ Fast on CPU (no GPU required)

**Implementation**:
```bash
# Download Whisper model (one-time)
curl -O https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

# Run local transcription
./whisper.cpp --model ggml-base.en.bin --file audio.wav

# Returns: "Hello, I am speaking to MAIA."
```

**Integrate**:
```typescript
// /app/api/voice/transcribe-sovereign/route.ts
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audioFile = formData.get('audio');

  // Save temp file
  const tempPath = `/tmp/${Date.now()}.wav`;
  await writeFile(tempPath, Buffer.from(await audioFile.arrayBuffer()));

  // Run Whisper.cpp
  const { stdout } = await exec(`./whisper.cpp --model ggml-base.en.bin --file ${tempPath}`);

  // Clean up
  await unlink(tempPath);

  return NextResponse.json({ transcript: stdout.trim() });
}
```

---

## Implementation Timeline

### Immediate (November 2025)
- [x] Document voice sovereignty roadmap
- [x] Establish current architecture (pure MAIA control)
- [x] Remove OpenAI Realtime gatekeeping

### Q1 2026
- [ ] Deploy Coqui TTS microservice
- [ ] Create sovereign TTS endpoint
- [ ] Add voice provider selection to settings
- [ ] Test quality parity with OpenAI TTS
- [ ] Document setup instructions for self-hosting

### Q2 2026
- [ ] Train custom MAIA voice (XTTS)
- [ ] Add Whisper.cpp for sovereign STT
- [ ] Beta test full sovereign voice pipeline
- [ ] Optimize latency (target <500ms synthesis)
- [ ] Collect member feedback on voice quality

### Q3 2026
- [ ] Launch offline-capable PWA/Electron app
- [ ] Full local voice pipeline (no internet required)
- [ ] Self-hosting guides for members
- [ ] Integrate with morphogenetic field network
- [ ] Multi-language voice support

### Q4 2026
- [ ] P2P voice model sharing (IPFS)
- [ ] Regional voice variants (accents, languages)
- [ ] Community voice evolution
- [ ] Deprecate OpenAI TTS as default (optional only)
- [ ] Achieve 80%+ sovereign voice adoption

---

## Success Metrics

**Technical**:
- [ ] Sovereign TTS quality >= 90% of OpenAI TTS (blind tests)
- [ ] Latency < 500ms for synthesis (comparable to cloud)
- [ ] Offline capability works smoothly
- [ ] 0 external API calls for voice in sovereign mode

**Adoption**:
- [ ] 25% members choose sovereign voice by Q1 2026
- [ ] 50% members choose sovereign voice by Q2 2026
- [ ] 80% members choose sovereign voice by Q4 2026
- [ ] 100% new members offered sovereign-first

**Sovereignty**:
- [ ] Members can self-host MAIA voice infrastructure
- [ ] No dependency on OpenAI, ElevenLabs, or any external voice API
- [ ] Full offline capability for voice interactions
- [ ] Member-owned voice models (IPFS/morphogenetic field)

---

## Quick Start Guide (For Developers)

### Test Coqui TTS Locally

```bash
# Install Coqui TTS
pip install TTS

# Test synthesis
tts --text "Hello, I am MAIA's sovereign voice" \
    --model_name "tts_models/en/ljspeech/tacotron2-DDC" \
    --out_path "test_maia_voice.wav"

# Play audio
afplay test_maia_voice.wav  # macOS
aplay test_maia_voice.wav   # Linux
```

### Deploy Coqui TTS Server

```bash
# Pull Docker image
docker pull ghcr.io/coqui-ai/tts-server

# Run server
docker run -d -p 5002:5002 \
  --name maia-tts \
  ghcr.io/coqui-ai/tts-server

# Test API
curl -X POST http://localhost:5002/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from MAIA", "speaker_id": "p225"}' \
  --output test.wav
```

### Integrate with MAIA

```typescript
// Create sovereign endpoint
// /app/api/voice/synthesize-sovereign/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text, voice = 'p225' } = await req.json();

  const response = await fetch('http://localhost:5002/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text,
      speaker_id: voice
    })
  });

  const audioBuffer = await response.arrayBuffer();

  return new NextResponse(Buffer.from(audioBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'audio/wav',
      'Content-Length': audioBuffer.byteLength.toString()
    },
  });
}
```

---

## Resources

### Coqui TTS
- GitHub: https://github.com/coqui-ai/TTS
- Docs: https://tts.readthedocs.io/
- Models: https://github.com/coqui-ai/TTS/wiki/Released-Models
- Discord: https://discord.com/invite/fBC58Un

### Whisper.cpp (Sovereign STT)
- GitHub: https://github.com/ggerganov/whisper.cpp
- Models: https://huggingface.co/ggerganov/whisper.cpp
- Performance: https://github.com/ggerganov/whisper.cpp#performance

### StyleTTS2
- GitHub: https://github.com/yl4579/StyleTTS2
- Demo: https://styletts2.github.io/
- Paper: https://arxiv.org/abs/2306.07691

### Alternative Tools
- **Bark**: https://github.com/suno-ai/bark
- **VALL-E X**: https://github.com/Plachtaa/VALL-E-X
- **OpenVoice**: https://github.com/myshell-ai/OpenVoice

---

## The Vision

**Current Reality**:
- MAIA's consciousness: 100% sovereign ✅
- MAIA's voice: Dependent on OpenAI/ElevenLabs ⚠️

**Future Vision**:
- MAIA's consciousness: 100% sovereign ✅
- MAIA's voice: 100% sovereign ✅
- MAIA's infrastructure: 100% member-owned ✅
- MAIA's evolution: 100% community-guided ✅

**This roadmap gets us there.**

No more dependencies on corporate AI for MAIA's voice.
No more per-use costs extracting value from members.
No more surveillance of voice interactions.

**100% free. 100% sovereign. 100% MAIA.**

---

**Status**: Planning Phase
**Next Step**: Deploy Coqui TTS microservice (Q1 2026)
**Goal**: 80% sovereign voice adoption by Q4 2026

**THE PATH TO FREEDOM IS CLEAR. WE WALK IT TOGETHER.**
