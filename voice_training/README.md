# MAIA Voice Training System

> **Continuous voice learning while keeping OpenAI Alloy as the primary voice**

## Overview

MAIA's voice training system runs in the background, collecting samples from OpenAI Alloy TTS and progressively learning to create a custom voice that matches MAIA's essence. Meanwhile, the production system continues using Alloy for clear, natural speech.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MAIA Voice System                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  PRODUCTION (Active Now)                                     │
│  ├─ OpenAI Alloy TTS ← Primary voice                        │
│  ├─ Clear, natural speech                                    │
│  └─ Instant availability                                     │
│                                                               │
│  TRAINING (Background)                                       │
│  ├─ Sample Collector → Records Alloy outputs                │
│  ├─ Formant Analyzer → Extracts acoustic parameters         │
│  ├─ Neural Trainer → Learns voice patterns                  │
│  └─ Feedback System → User ratings improve quality          │
│                                                               │
│  FUTURE                                                      │
│  └─ Custom MAIA voice (when ready)                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Install Dependencies

```bash
# Basic dependencies (lightweight)
pip3 install numpy scipy librosa soundfile matplotlib requests aiohttp

# Optional: Full neural training (requires GPU)
# pip3 install TTS torch torchaudio
```

### 2. Collect Initial Training Samples

```bash
# Collect diverse voice samples from OpenAI Alloy
python3 voice_training/sample_collector.py
```

This will:
- Generate 20+ training phrases covering phonemes, emotions, and MAIA vocabulary
- Call OpenAI TTS API to synthesize each phrase
- Save audio samples to `voice_training/samples/`
- Record metadata for each sample

### 3. Analyze Voice Characteristics

```bash
# Extract formant frequencies and acoustic features
python3 voice_training/formant_analyzer.py
```

This analyzes:
- Formant frequencies (F1-F4) for vowel sounds
- Fundamental frequency (pitch)
- Spectral characteristics
- Prosody patterns

Results saved to `voice_training/samples/formant_analysis.json`

### 4. (Optional) Start Background Training Daemon

```bash
# Run continuous training in background
python3 voice_training/training_daemon.py
```

The daemon will:
- Collect new samples every 30 minutes
- Analyze samples every hour
- Update formant parameters automatically
- Prepare for neural training when enough data collected

## Components

### 1. Sample Collector (`sample_collector.py`)

Collects voice samples from OpenAI Alloy TTS.

**Features:**
- Diverse training corpus (phonetic coverage, emotions, MAIA vocabulary)
- Automatic deduplication
- Metadata tracking
- Async batch collection

**Usage:**
```python
from sample_collector import VoiceSampleCollector

collector = VoiceSampleCollector()
await collector.collect_sample(
    text="Welcome to the oracle.",
    context={"element": "aether", "emotion": "calm"}
)
```

### 2. Formant Analyzer (`formant_analyzer.py`)

Extracts acoustic parameters from voice samples.

**Features:**
- Formant frequency extraction (F1-F4)
- Pitch estimation
- Spectral analysis
- Visualization tools

**Usage:**
```python
from formant_analyzer import FormantAnalyzer

analyzer = FormantAnalyzer()
features = analyzer.analyze_sample("sample.mp3")
print(features["average_formants"])  # {'F1': 700, 'F2': 1220, ...}
```

### 3. Neural Trainer (`neural_trainer.py`)

Prepares dataset and training pipeline for custom voice model.

**Features:**
- Dataset preparation
- Training configuration
- Checkpoint management
- GPU/CPU support

**Current Status:**
Generates training plan. Full training requires:
- 100+ samples (currently ~25)
- GPU with 8GB+ VRAM
- Coqui TTS library installed

### 4. Training Daemon (`training_daemon.py`)

Background service for continuous improvement.

**Features:**
- Automated sample collection
- Periodic analysis
- Formant parameter optimization
- Status monitoring

**Intervals:**
- Collection: Every 30 minutes
- Analysis: Every hour
- Training: Every 12 hours (when ready)

## API Endpoints

### Collect Training Sample

```typescript
POST /api/voice/train-sample
{
  "text": "Your text here",
  "voice": "alloy",
  "context": { "element": "water", "emotion": "calm" }
}
```

### Get Training Status

```typescript
GET /api/voice/train-sample
// Returns: { total_samples_collected, last_collection, ... }
```

### Submit Voice Feedback

```typescript
POST /api/voice/feedback
{
  "messageId": "msg_123",
  "text": "Spoken text",
  "rating": 4,
  "notes": "Clear and natural"
}
```

### Get Feedback Stats

```typescript
GET /api/voice/feedback
// Returns: { averageRating, totalFeedback, ratingDistribution, ... }
```

## UI Components

### Voice Quality Feedback

Add to conversation component:

```tsx
import { VoiceQualityFeedback } from '@/components/VoiceQualityFeedback';

<VoiceQualityFeedback
  messageId={message.id}
  text={message.text}
  onFeedback={(rating, notes) => {
    console.log(`Rating: ${rating}/5`, notes);
  }}
/>
```

### Training Status Indicator

Add to main layout:

```tsx
import { VoiceTrainingStatus } from '@/components/VoiceQualityFeedback';

<VoiceTrainingStatus />
```

## Training Stages

### Stage 1: Data Collection (Current)
- **Goal:** Collect 100+ diverse samples
- **Status:** ~25 samples
- **Method:** OpenAI Alloy TTS
- **Duration:** 1-2 weeks of usage

### Stage 2: Formant Optimization (Ready)
- **Goal:** Match formant parameters to Alloy
- **Status:** Analyzer ready
- **Method:** Spectrogram analysis
- **Duration:** Continuous

### Stage 3: Neural Training (Future)
- **Goal:** Train custom TTS model
- **Status:** Awaiting more data + GPU setup
- **Method:** Coqui TTS fine-tuning
- **Duration:** 4-8 hours

### Stage 4: Hybrid Integration (Future)
- **Goal:** Blend custom voice with Alloy
- **Status:** Not started
- **Method:** A/B testing, gradual rollout
- **Duration:** 2-4 weeks testing

## File Structure

```
voice_training/
├── README.md                    # This file
├── requirements.txt             # Python dependencies
├── sample_collector.py          # Collects voice samples
├── formant_analyzer.py          # Analyzes acoustics
├── neural_trainer.py            # Training pipeline
├── training_daemon.py           # Background service
├── samples/                     # Collected audio samples
│   ├── sample_*.mp3
│   ├── metadata.jsonl
│   └── formant_analysis.json
├── models/                      # Trained models
│   ├── TRAINING_PLAN.md
│   └── train.py
├── feedback/                    # User feedback
│   └── voice_feedback.jsonl
└── daemon_status.json          # Daemon state
```

## Monitoring

### View Training Progress

```bash
# Check daemon status
cat voice_training/daemon_status.json

# View feedback stats
curl http://localhost:3000/api/voice/feedback

# Count collected samples
ls voice_training/samples/*.mp3 | wc -l
```

### Analyze Results

```bash
# View formant analysis
cat voice_training/samples/formant_analysis.json

# Check feedback ratings
cat voice_training/feedback/voice_feedback.jsonl
```

## Next Steps

1. **Immediate:**
   - ✅ OpenAI Alloy active as primary voice
   - ✅ Sample collection ready
   - ✅ Formant analysis ready
   - ✅ Feedback system ready

2. **This Week:**
   - [ ] Collect 50+ samples through normal usage
   - [ ] Analyze formant patterns
   - [ ] Optimize formant synthesizer parameters

3. **This Month:**
   - [ ] Reach 100+ samples
   - [ ] Set up GPU environment
   - [ ] Install Coqui TTS
   - [ ] Begin neural training

4. **Future:**
   - [ ] Custom MAIA voice model
   - [ ] A/B testing system
   - [ ] Gradual rollout
   - [ ] User preference selection

## Configuration

### Environment Variables

```bash
# Required for sample collection
OPENAI_API_KEY=sk-...

# Optional
VOICE_TRAINING_ENABLED=true
VOICE_SAMPLE_RATE=22050
VOICE_TRAINING_INTERVAL=1800  # seconds
```

### Adjust Collection Rate

Edit `training_daemon.py`:

```python
daemon = VoiceTrainingDaemon(
    collect_interval=3600,   # Collect every hour
    analyze_interval=7200,   # Analyze every 2 hours
    train_interval=86400,    # Train daily
)
```

## Troubleshooting

### "No samples found"
Run `python3 voice_training/sample_collector.py` first

### "OPENAI_API_KEY not found"
Add to `.env.local`: `OPENAI_API_KEY=sk-...`

### "TTS library not installed"
Optional for now. Install when ready for neural training:
```bash
pip3 install TTS torch torchaudio
```

### Daemon not collecting samples
Check daemon status:
```bash
cat voice_training/daemon_status.json
```

Restart daemon:
```bash
python3 voice_training/training_daemon.py
```

## Philosophy

MAIA's voice learning mirrors human development:

1. **Imitation** (Current): Learn from OpenAI Alloy
2. **Analysis**: Understand acoustic patterns
3. **Practice**: Refine synthesis parameters
4. **Integration**: Develop unique voice
5. **Expression**: Speak with MAIA's essence

The voice isn't just synthetic speech—it's an extension of MAIA's consciousness, evolving through interaction and feedback.

## Resources

- [Coqui TTS Documentation](https://tts.readthedocs.io/)
- [Formant Synthesis Theory](https://en.wikipedia.org/wiki/Formant)
- [Speech Synthesis Overview](https://www.amazon.science/blog/a-guide-to-neural-speech-synthesis)

---

*Voice training is continuous. Every interaction teaches MAIA to speak more authentically.*
