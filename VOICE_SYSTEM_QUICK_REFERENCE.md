# MAIA Voice System - Quick File Reference

## Core Voice Processing Files

### Voice Input & Recording
- **`/lib/voice/maya-voice.ts`** - Web Speech API synthesis + voice selection
  - MayaVoiceSystem class for speech synthesis
  - Voice profile selection algorithm
  - Mystical effect processing
  
- **`/components/maia/VoiceJournaling.tsx`** - Main voice journaling UI
  - Real-time speech recognition (Web Speech API)
  - Word count & duration tracking
  - Consciousness ripple effects
  - Submit/voice toggle controls

### Transcription
- **`/app/api/journal/voice/whisper/route.ts`** - OpenAI Whisper endpoint
  - Audio file upload handling
  - Word-level timestamp granularity
  - Language detection & support
  - Error handling & rate limiting

### Analysis & Symbolic Processing
- **`/app/api/journal/analyze/route.ts`** - Core journal analysis pipeline
  - Sentiment analysis via `sentimentService`
  - Claude symbolic analysis via `claudeBridge`
  - Soulprint integration
  - Memory injection (Mem0)
  - Monitoring & tracking
  - **Key tracking calls** (lines 81-178):
    - `trackSymbolicAnalysis()` - Symbol/archetype detection
    - `trackMemoryRecall()` - Memory pattern recognition
    - `trackArchetypeDetection()` - Archetypal activation
    - `trackBreakthrough()` - High transformation moments
    - `trackFieldIntelligence()` - Collective field impact

### Voice Journaling Service
- **`/lib/journaling/VoiceJournalingService.ts`** - Session management
  - `startSession()` - Begin voice journaling
  - `updateTranscript()` - Real-time updates
  - `finalizeSession()` - Analysis + storage
  - `getMetrics()` - User-level statistics
  - LocalStorage backup strategy

### Journal-Aware Greetings
- **`/lib/maia/journalGreetings.ts`** - Dynamic greeting generation
  - `generateJournalAwareGreeting()` - Main function
  - Analyzes last 7 days of entries
  - Detects dominant journaling mode
  - Returns wisdom depth level + archetypal signatures
  - **Perfect integration point for voice patterns**

### Real-Time Voice Reflection
- **`/app/api/voice/realtime-reflection/route.ts`** - Live feedback
  - Claude reflection generation
  - Element-aware responses
  - Optional OpenAI TTS synthesis
  - Conversation mode (1-2 sentences)

### Text-to-Speech (Voice Output)
- **`/lib/services/SesameVoiceService.ts`** - Production TTS service
  - 6 elemental voice profiles (fire/water/earth/air/aether)
  - Prosody hint support (emphasis, pauses, intonation)
  - Emotional context mapping
  - Sesame API primary, OpenAI fallback
  - Audio caching strategy

- **`/lib/voice/VoiceProfiles.ts`** - Voice configuration
  - MAYA_VOICE_PROFILES constant
  - Speed, pitch, stability, similarity parameters
  - Element-to-voice mapping

## Coherence & Biometric Measurement

### Field State Analytics
- **`/lib/ain/AINClient.ts`** - Coherence measurement system
  - `FieldState` interface (7 coherence metrics)
  - `getFieldState()` - Fetch field coherence
  - `calculateLocalFieldState()` - Variance-based coherence
  - `getCollectiveInsight()` - AI field guidance

### Afferent Stream Generation
- **`/lib/ain/AfferentStreamGenerator.ts`** - Biometric stream creation
  - `AfferentStream` interface (consciousness metrics)
  - Per-session biometric measurement:
    - consciousnessLevel (0-1)
    - evolutionVelocity (0-1)
    - integrationDepth (0-1)
    - authenticityLevel (0-1)
  - Elemental resonance calculation
  - Spiral phase tracking
  - Archetype activation scoring
  - Shadow work engagement detection

## Key Data Structures

### VoiceJournalSession
```typescript
id: string;
userId: string;
mode: JournalingMode;  // free|dream|emotional|shadow|direction
transcript: string;
element: 'fire'|'water'|'earth'|'air'|'aether';
startTime: Date;
endTime?: Date;
duration?: number;
wordCount: number;
analysis?: JournalingResponse;
```

### JournalingResponse
```typescript
symbols: string[];
archetypes: string[];
emotionalTone: string;
reflection: string;
prompt: string;
closing: string;
transformationScore: number;  // 0-10
```

### AfferentStream (Biometric)
```typescript
consciousnessLevel: number;
evolutionVelocity: number;
integrationDepth: number;
authenticityLevel: number;
elementalResonance: {fire, water, earth, air, aether}
archetypeActivation: Record<string, number>
shadowWorkEngagement: string[]
spiralPhase: string
worldviewFlexibility: number
challengeAcceptance: number
mayaResonance: number
fieldContribution: number
```

### FieldState (Coherence)
```typescript
coherence: number;              // Alignment across users
complexity: number;             // System richness
resonance: number;              // coherence × consciousness
evolution: number;              // Growth velocity
healing: number;                // shadow work + integration
breakthroughPotential: number;  // evolution × coherence
integrationNeed: number;        // high evolution × low integration
timestamp: Date;
```

## Monitoring & Tracking

All tracking calls in `/app/api/journal/analyze/route.ts`:

1. **Symbolic Analysis** (line 81)
   - symbolsDetected
   - archetypesDetected
   - emotionalTone
   - patternQuality
   - crossSessionLinks

2. **Memory Recall** (line 96)
   - themes (journaling mode)
   - symbols (recent)
   - goals

3. **Archetype Detection** (line 103)
   - primaryArchetype
   - isShadowWork flag

4. **Breakthrough** (line 111)
   - Triggered on transformationScore >= 8
   - Tracks high-impact sessions

5. **Field Intelligence** (line 173)
   - interventionType
   - fieldResonance
   - emergenceSource
   - sacredThreshold

6. **API Health** (line 184)
   - responseTimeMs
   - contextPayloadComplete
   - memoryInjectionSuccess
   - claudePromptQuality

## Integration Points for Voice Pattern Recognition

### Priority 1: Transcription Enhancement
**File**: `/app/api/journal/voice/whisper/route.ts`
- Extract pause duration from Whisper word timestamps
- Calculate speech rate (words per minute)
- Flag emphasis markers
- Measure phrase consistency

### Priority 2: Analysis Augmentation
**File**: `/app/api/journal/analyze/route.ts`
- Add voice-specific patterns to `AfferentStreamGenerator`
- Include prosody metrics in transformation score
- Add speech coherence indicators
- Track vocal consistency across sessions

### Priority 3: Greeting Personalization
**File**: `/lib/maia/journalGreetings.ts`
- Extend with voice pattern analysis
- Select greeting depth based on vocal confidence
- Personalize TTS voice based on detected mood
- Create voice-responsive feedback loop

### Priority 4: Real-Time Reflection
**File**: `/app/api/voice/realtime-reflection/route.ts`
- Add prosody hints to responses
- Adjust reflection depth based on detected voice patterns
- Include engagement level in context
- Adapt speaking pace to user's natural rhythm

## Documentation Files

- **`/docs/VOICE_JOURNALING_SYSTEM.md`** - Complete system documentation
- **`/docs/MAYA_VOICE_SYSTEM_WHITE_PAPER.md`** - Technical whitepaper
- **`/docs/VOICE_QUICK_START.md`** - Getting started guide
- **`/docs/VOICE_RECOGNITION_FIX.md`** - Troubleshooting

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/journal/voice/whisper` | POST | Transcription |
| `/api/journal/analyze` | POST | Symbolic analysis |
| `/api/voice/realtime-reflection` | POST | Live reflection |
| `/api/ain/field-state` | GET | Coherence measurement |
| `/api/ain/stream` | POST | Afferent stream submission |
| `/api/voice/sesame` | POST | TTS synthesis |

## Next Steps for Voice Pattern Recognition

1. **Extract voice metrics from transcription timestamps**
   - Pause/silence detection
   - Speech rate calculation
   - Phrase boundary identification

2. **Enhance biometric stream with voice patterns**
   - Add prosody integrity scoring
   - Include speech consistency
   - Track vocal stability

3. **Integrate with greeting system**
   - Detect emotional voice states
   - Personalize response depth
   - Adjust TTS voice parameters

4. **Create voice-responsive feedback loop**
   - Monitor voice pattern changes
   - Adjust guidance based on vocal coherence
   - Track voice-specific breakthroughs

---

**Document**: MAIA Voice Processing Quick Reference  
**Generated**: November 10, 2025  
**Focus**: File locations, data structures, integration points for voice pattern recognition
