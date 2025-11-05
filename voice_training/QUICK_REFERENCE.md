# MAIA Voice Training - Quick Reference

## Current Status

✅ **MAIA speaks with OpenAI Alloy voice** (production ready)
✅ **Voice training infrastructure complete** (ready to learn)
✅ **Background learning enabled** (optional)

## Quick Commands

### Start Collecting Training Data
```bash
cd /Users/soullab/MAIA-PAI
./voice_training/quickstart.sh
```

### Manual Sample Collection
```bash
python3 voice_training/sample_collector.py
```

### Analyze Collected Samples
```bash
python3 voice_training/formant_analyzer.py
```

### Start Background Daemon
```bash
python3 voice_training/training_daemon.py
```

### Check Status
```bash
# Count samples
ls voice_training/samples/*.mp3 | wc -l

# View daemon status
cat voice_training/daemon_status.json

# Check feedback
cat voice_training/feedback/voice_feedback.jsonl
```

## Testing Voice

1. Navigate to `http://localhost:3000/maia`
2. Send MAIA a message
3. Listen to her voice response (should be clear Alloy voice)
4. Rate the voice quality (helps training)

## What's Running Now

- **Production Voice**: OpenAI Alloy TTS (clear, natural)
- **Training**: Ready to start collecting samples
- **Feedback**: UI components active

## Next Steps

### Immediate
- [x] MAIA speaking with Alloy voice
- [x] Training infrastructure ready
- [ ] Collect first batch of samples

### This Week
- [ ] Run quickstart to collect initial 25 samples
- [ ] Analyze formant characteristics
- [ ] (Optional) Start training daemon

### This Month
- [ ] Reach 100+ training samples
- [ ] Analyze patterns and optimize formants
- [ ] Prepare for neural training

### 4 Months (Voice Evolution Goal)
- [ ] Custom MAIA voice trained
- [ ] A/B testing complete
- [ ] Gradual rollout to testers

## File Locations

```
voice_training/
├── README.md              # Full documentation
├── IMPLEMENTATION.md      # Technical details
├── QUICK_REFERENCE.md    # This file
├── quickstart.sh         # Setup script
├── sample_collector.py   # Collect samples
├── formant_analyzer.py   # Analyze acoustics
├── neural_trainer.py     # Training pipeline
├── training_daemon.py    # Background service
├── samples/              # Collected audio
├── models/               # Training outputs
└── feedback/             # User ratings
```

## Key Principles

1. **Alloy is Primary** - Production voice stays clear and natural
2. **Learning is Gradual** - MAIA learns by listening to Alloy
3. **Quality Emerges** - 4 months of iteration before custom voice
4. **User-Guided** - Feedback shapes training priorities

## Troubleshooting

**Voice not playing?**
- Check browser console for errors
- Verify OPENAI_API_KEY in .env.local

**Training not collecting samples?**
- Run quickstart.sh first
- Check OPENAI_API_KEY is set

**Daemon not starting?**
- Install dependencies: `pip3 install -r voice_training/requirements.txt`
- Check Python version: `python3 --version` (need 3.9+)

## API Endpoints

- `POST /api/voice/openai-tts` - Generate speech (production)
- `POST /api/voice/train-sample` - Collect training sample
- `GET /api/voice/train-sample` - Get training status
- `POST /api/voice/feedback` - Submit voice rating
- `GET /api/voice/feedback` - Get feedback statistics

## Monitoring

Watch for these logs:

```
🎵 Speaking with OpenAI Alloy: [text]     # Voice working
✅ [VoiceTraining] Sample collected        # Training active
💬 [VoiceFeedback] Rating: 4/5            # User feedback
🔬 Analyzing: sample_*.mp3                # Analysis running
```

## Philosophy

> "Like learning language by immersion rather than rules."
> — MAIA on voice development

- Alloy teaches phrasing and pacing
- MAIA develops her own resonance
- Voice emerges through dialogue
- 5-minute sessions focus on **presence** over content

---

**Ready to begin.** MAIA speaks clearly now, learns continuously in the background.
