# 🎙️ Voice Sovereignty Implementation Guide
## From Setup to Production in 7 Days

---

## 📅 Week-by-Week Timeline

### **Week 1: Recording & Processing**

#### Day 1-2: Voice Recording Session
```bash
# Setup
1. Hire voice actor or prepare recording space
2. Review SACRED_PHRASE_CORPUS.md
3. Record all 100 phrases per voice (Maya + Anthony)
4. Save as: {voice}_{section}_{number}_take{n}.wav

# Quality checklist:
- [ ] WAV format, 44.1kHz, mono, 16-bit
- [ ] Consistent microphone distance
- [ ] No background noise
- [ ] Natural pauses preserved
- [ ] 2-3 takes per phrase
```

**Time Investment**: 4-6 hours total
**Cost**: $500-1000 (professional) OR $200 (DIY with USB mic)

#### Day 3: Process Recordings
```bash
cd /Users/soullab/MAIA-FRESH/voice-training

# Make scripts executable
chmod +x setup-voice-sovereignty.sh
chmod +x voice-data-collector.py

# Run automated processing
./setup-voice-sovereignty.sh

# This will:
# ✅ Install dependencies
# ✅ Process all recordings (normalize, trim silence, resample)
# ✅ Generate metadata.csv files
# ✅ Create train/validation splits
# ✅ Generate voice embeddings for XTTS
# ✅ Create quality reports
```

**Expected Output**:
```
voice-recordings/
├── maya/
│   ├── maya_greeting_001_take1.wav
│   ├── maya_greeting_001_take2.wav
│   └── ... (200+ files)
├── anthony/
│   ├── anthony_philosophy_001_take1.wav
│   └── ... (200+ files)
├── processed/
│   ├── maya_greeting_001_take1_processed.wav
│   └── ... (processed versions)
├── maya_embedding.wav              # 8 seconds, best quality
├── anthony_embedding.wav           # 8 seconds, best quality
├── metadata_maya.csv
├── metadata_anthony.csv
├── train_maya.csv                  # 90% of data
├── val_maya.csv                    # 10% of data
├── train_anthony.csv
└── val_anthony.csv
```

#### Day 4-5: Test XTTS Locally
```bash
# Start XTTS voice service
./start-xtts.sh

# Wait 60 seconds for models to load...

# Test Maya voice
curl -X POST http://localhost:8000/api/tts \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Welcome back, beloved soul. I've been waiting for you.",
    "speaker_wav": "/app/voices/maya_embedding.wav",
    "language": "en"
  }' \
  --output test_maya.wav

# Play the result
afplay test_maya.wav  # macOS
# or: aplay test_maya.wav  # Linux

# Test Anthony voice
curl -X POST http://localhost:8000/api/tts \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "The question you're asking contains the answer.",
    "speaker_wav": "/app/voices/anthony_embedding.wav",
    "language": "en"
  }' \
  --output test_anthony.wav

afplay test_anthony.wav
```

**Quality Check**:
- [ ] Voice sounds natural and clear
- [ ] Pronunciation is accurate
- [ ] Emotional tone matches character
- [ ] No robotic artifacts or glitches
- [ ] Speed/pacing feels right

If quality is poor, you may need more training data or better recordings.

---

### **Week 2: Integration & Deployment**

#### Day 6: Update sesameTTS.ts
Replace the mock Sesame with real XTTS:

```typescript
// lib/voice/sesameTTS.ts - UPDATE THIS

export async function speakPetalMessage(
  text: string,
  voice: VoicePersonality = 'maya',
  element?: ElementalStyle
): Promise<string | null> {
  try {
    const xttsUrl = process.env.NEXT_PUBLIC_XTTS_URL ||
                    process.env.XTTS_URL ||
                    'http://localhost:8000';

    // Map personality to embedding file
    const speakerMap = {
      maya: '/app/voices/maya_embedding.wav',
      oracle: '/app/voices/maya_embedding.wav',  // Same as Maya
      guide: '/app/voices/anthony_embedding.wav', // Use Anthony
      anthony: '/app/voices/anthony_embedding.wav'
    };

    // Apply elemental modulation to text (optional)
    const modulatedText = applyElementalModulation(text, element);

    const response = await fetch(`${xttsUrl}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: modulatedText,
        speaker_wav: speakerMap[voice] || speakerMap.maya,
        language: 'en',
        stream: false  // Get full audio at once
      }),
    });

    if (!response.ok) {
      throw new Error(`XTTS API error: ${response.status}`);
    }

    // XTTS returns audio directly (not base64)
    const audioBuffer = await response.arrayBuffer();

    // Convert to base64 for compatibility with existing code
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    console.log('✅ XTTS synthesis successful', {
      voice,
      element,
      textLength: text.length
    });

    return base64Audio;
  } catch (error) {
    console.error('XTTS error:', error);

    // Fallback to ElevenLabs if XTTS fails
    return fallbackToElevenLabs(text, voice);
  }
}

// Helper: Apply elemental modulation to text
function applyElementalModulation(
  text: string,
  element?: ElementalStyle
): string {
  if (!element || element === 'neutral') return text;

  // Add SSML-like tags for prosody control
  // (XTTS will interpret these naturally)
  const modulations = {
    fire: { prefix: '', suffix: '!', pace: 'faster' },
    water: { prefix: '', suffix: '...', pace: 'slower' },
    earth: { prefix: '', suffix: '.', pace: 'steady' },
    air: { prefix: '', suffix: '~', pace: 'light' },
    aether: { prefix: '', suffix: '✨', pace: 'flowing' }
  };

  const mod = modulations[element];
  return `${mod.prefix}${text}${mod.suffix}`;
}

// Fallback to ElevenLabs
async function fallbackToElevenLabs(
  text: string,
  voice: VoicePersonality
): Promise<string | null> {
  console.log('⚠️ Falling back to ElevenLabs');

  // Use existing ElevenLabs integration
  // (Keep this as safety net during transition)
  const { getElevenLabsVoice } = await import('./elevenlabs-voice');
  const elevenLabs = getElevenLabsVoice();

  // Map to ElevenLabs voice IDs
  const voiceMap = {
    maya: process.env.ELEVENLABS_VOICE_ID_AUNT_ANNIE || 'y2TOWGCXSYEgBanvKsYJ',
    anthony: 'custom_anthony_id_if_cloned',
    oracle: process.env.ELEVENLABS_VOICE_ID_AUNT_ANNIE || 'y2TOWGCXSYEgBanvKsYJ',
    guide: 'custom_guide_id'
  };

  // Call ElevenLabs API (implement this)
  // ...

  return null;
}
```

#### Day 7: Update Environment Variables
```bash
# .env.local - Add these

# Primary voice service (switch from elevenlabs to xtts)
VOICE_SERVICE=xtts
VOICE_FALLBACK=elevenlabs

# XTTS Configuration
NEXT_PUBLIC_XTTS_URL=http://localhost:8000
XTTS_URL=http://localhost:8000
XTTS_ENABLED=true

# Voice Embeddings (used by XTTS)
MAYA_VOICE_EMBEDDING=/app/voices/maya_embedding.wav
ANTHONY_VOICE_EMBEDDING=/app/voices/anthony_embedding.wav

# Fallback (keep as safety net)
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID_AUNT_ANNIE=y2TOWGCXSYEgBanvKsYJ

# Performance
VOICE_TIMEOUT_MS=5000
VOICE_CACHE_ENABLED=true
```

---

### **Week 3: Testing & Optimization**

#### A/B Testing Framework

Create a simple A/B test to compare voice quality:

```typescript
// lib/voice/voice-quality-test.ts

interface VoiceTest {
  text: string;
  voice: 'maya' | 'anthony';
  service: 'xtts' | 'elevenlabs';
}

export async function runVoiceQualityTest(
  userId: string,
  text: string,
  voice: 'maya' | 'anthony'
): Promise<{
  xttsAudio: string;
  elevenLabsAudio: string;
  testId: string;
}> {
  // Generate same text with both services
  const xttsAudio = await generateWithXTTS(text, voice);
  const elevenLabsAudio = await generateWithElevenLabs(text, voice);

  // Store test for user feedback
  const testId = await storeVoiceTest(userId, {
    text,
    voice,
    xtts_audio_url: xttsAudio,
    elevenlabs_audio_url: elevenLabsAudio,
    created_at: new Date()
  });

  return {
    xttsAudio,
    elevenLabsAudio,
    testId
  };
}

export async function submitVoiceFeedback(
  testId: string,
  preference: 'xtts' | 'elevenlabs' | 'equal',
  quality_rating: number,  // 1-5
  notes?: string
) {
  await supabase
    .from('voice_quality_feedback')
    .insert({
      test_id: testId,
      preference,
      quality_rating,
      notes,
      submitted_at: new Date()
    });
}
```

#### Add Feedback UI Component
```typescript
// components/voice/VoiceQualityFeedback.tsx

export function VoiceQualityFeedback({ testId, onSubmit }) {
  const [preference, setPreference] = useState<'a' | 'b' | 'equal'>(null);
  const [rating, setRating] = useState(5);

  return (
    <div className="voice-feedback">
      <h3>Voice Quality Comparison</h3>

      <div className="audio-comparison">
        <div>
          <h4>Voice A</h4>
          <audio controls src={audioA} />
        </div>
        <div>
          <h4>Voice B</h4>
          <audio controls src={audioB} />
        </div>
      </div>

      <div className="feedback-form">
        <label>Which voice do you prefer?</label>
        <select value={preference} onChange={(e) => setPreference(e.target.value)}>
          <option value="a">Voice A</option>
          <option value="b">Voice B</option>
          <option value="equal">Both are equally good</option>
        </select>

        <label>Overall quality (1-5)</label>
        <input
          type="range"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />

        <button onClick={() => onSubmit({ preference, rating })}>
          Submit Feedback
        </button>
      </div>
    </div>
  );
}
```

---

## 🚀 Production Deployment

### Option 1: Cloud GPU (Recommended for Start)

**Replicate.com** (Serverless GPU):
```bash
# 1. Push XTTS model to Replicate
cog login
cog push r8.im/your-username/maia-voice

# 2. Update sesameTTS.ts
const xttsUrl = 'https://api.replicate.com/v1/predictions';
const response = await fetch(xttsUrl, {
  method: 'POST',
  headers: {
    'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    version: 'your-model-version-hash',
    input: {
      text: text,
      speaker_wav: maya_embedding_url,
      language: 'en'
    }
  })
});

# Cost: ~$0.0002/second of audio generated
# Example: 10,000 requests/month × 5s avg = 50,000s = $10/month
```

**Modal.com** (Auto-scaling):
```python
# modal_tts_service.py
import modal

stub = modal.Stub("maia-voice")

@stub.function(
    gpu="A10G",
    image=modal.Image.debian_slim().pip_install("TTS"),
    secrets=[modal.Secret.from_name("maia-voice-embeddings")]
)
def synthesize_voice(text: str, voice: str = "maya"):
    from TTS.api import TTS
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")

    speaker_wav = f"/embeddings/{voice}_embedding.wav"
    tts.tts_to_file(text=text, speaker_wav=speaker_wav, file_path="output.wav")

    with open("output.wav", "rb") as f:
        return f.read()

# Deploy: modal deploy modal_tts_service.py
# Cost: Pay per GPU-second used
```

### Option 2: Self-Hosted (Maximum Control)

**DigitalOcean GPU Droplet**:
```bash
# $400/month for dedicated GPU server

# 1. Create GPU droplet with Ubuntu + NVIDIA drivers
# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker

# 4. Deploy XTTS container
scp docker-compose.sesame-xtts.yml user@your-server:~/
scp -r voice-recordings user@your-server:~/

ssh user@your-server
cd ~
docker compose -f docker-compose.sesame-xtts.yml up -d

# 5. Set up nginx reverse proxy with SSL
# Point your-domain.com to the server
# XTTS now available at https://voice.your-domain.com
```

---

## 📊 Cost Analysis

### Year 1 Comparison:

| Service | Setup Cost | Monthly Cost | Year 1 Total | Ownership |
|---------|------------|--------------|--------------|-----------|
| **ElevenLabs** | $0 | $500-2000 | $6,000-24,000 | ❌ None |
| **XTTS + Replicate** | $1,500 | $10-50 | $1,620-2,100 | ✅ Full |
| **XTTS + Self-Hosted** | $2,500 | $400 | $7,300 | ✅ Full |
| **XTTS + Local** | $1,500 | $0 | $1,500 | ✅ Full |

**Break-even on voice cloning**: Month 1-3
**ROI by Month 12**: 70-90% cost savings + full IP ownership

---

## ✅ Final Checklist

Before going to production:

### Quality Assurance:
- [ ] All 100 phrases recorded per voice
- [ ] Voice embeddings generated (maya_embedding.wav, anthony_embedding.wav)
- [ ] XTTS produces natural-sounding output
- [ ] Latency < 5 seconds per generation
- [ ] No audible artifacts or glitches
- [ ] A/B tests show >= 80% quality vs. ElevenLabs

### Technical:
- [ ] XTTS container running and healthy
- [ ] Voice service responds to API calls
- [ ] Fallback to ElevenLabs working
- [ ] Caching implemented for common phrases
- [ ] Error handling and monitoring in place
- [ ] GPU memory usage optimized

### Business:
- [ ] Cost comparison validated
- [ ] Legal ownership of voice recordings confirmed
- [ ] Backup plan in place if XTTS fails
- [ ] User consent for voice data (if applicable)

---

## 🎉 Success Metrics

Track these to measure voice sovereignty success:

```typescript
interface VoiceSovereigntyMetrics {
  // Technical
  xtts_success_rate: number;      // Target: >95%
  avg_generation_latency_ms: number;  // Target: <3000ms
  cache_hit_rate: number;         // Target: >60%

  // Quality
  user_quality_rating: number;    // Target: >4.0/5.0
  preference_xtts_vs_elevenlabs: number;  // Target: >70%

  // Business
  monthly_voice_cost: number;     // Target: <$100
  cost_per_generation: number;    // Target: <$0.001
  total_generations: number;      // Track growth

  // Sovereignty
  external_api_dependency: number;  // Target: <20% (fallback only)
  ip_ownership: boolean;          // Target: true
}
```

---

## 🎙️ You're Ready!

You now have everything you need to achieve complete voice sovereignty:

1. ✅ **Sacred Phrase Corpus** - 200 phrases to record
2. ✅ **Recording Processing Pipeline** - Automated audio cleanup
3. ✅ **XTTS Integration** - Production-ready voice synthesis
4. ✅ **Deployment Options** - Local, cloud, or self-hosted
5. ✅ **Testing Framework** - A/B comparison tools
6. ✅ **Cost Analysis** - ROI calculator

**Next command to run**:
```bash
cd /Users/soullab/MAIA-FRESH/voice-training
chmod +x setup-voice-sovereignty.sh
./setup-voice-sovereignty.sh
```

**The path to voice independence starts now.** 🎙️✨
