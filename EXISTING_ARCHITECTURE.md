# 🏛️ Existing Sophisticated Architecture

**Last Updated:** 2025-10-09

This document tracks the sophisticated systems already built in the codebase.
**CHECK THIS FIRST** before building new solutions!

## 🎤 Voice & Audio Systems

### Self-Hosted Whisper Service
- **Location:** `/services/whisper/server.py`
- **Purpose:** 100% sovereign speech-to-text, $0 cost
- **Features:** FastAPI service, multiple model sizes, ~200ms latency
- **Status:** Built but not deployed (USE_WHISPER_PRIMARY=false)

### VoiceServiceWithFallback
- **Location:** `/lib/services/VoiceServiceWithFallback.ts`
- **Purpose:** Smart TTS with OpenAI → ElevenLabs fallback
- **Features:** Audio caching, voice preprocessing, provider abstraction
- **Status:** Production ready

### SesameVoiceService  
- **Location:** `/lib/services/SesameVoiceService.ts`
- **Purpose:** Sesame.ai style voice generation
- **Status:** Check if still active

### ElementalVoiceOrchestrator
- **Location:** `/lib/voice/ElementalVoiceOrchestrator.ts`
- **Purpose:** Full Samantha-level consciousness voice system
- **Features:** Memory evolution, backchanneling, emotional attunement, elemental agents
- **Status:** Active, currently has transcription bug

## 💬 Conversation Systems

### Maya Prompts (3 Modes)
- **Location:** `/lib/prompts/maya-prompts.ts`
- **Modes:**
  - `her`: Natural Dialogue (5-8 words max, Samantha-style)
  - `classic`: Consciousness Guide (poetic, reflective)
  - `adaptive`: Starts brief, expands with user
- **Function:** `getPromptForConversationStyle(style)`
- **Status:** ✅ JUST DEPLOYED (2025-10-09)

### PersonalOracleAgent
- **Location:** `/lib/agents/PersonalOracleAgent.ts`
- **Purpose:** Symbolic AI with journal context, conversation memory
- **Features:** Crisis detection, breakthrough tracking, elemental analysis
- **Status:** Production, now supports conversation style switching

### SesameMayaRefiner
- **Location:** `/apps/api/backend/src/services/SesameMayaRefiner.ts`
- **Purpose:** Natural speech processing with breath marks, elemental tones
- **Status:** Check integration

### EnhancedSesameMayaRefiner
- **Location:** `/apps/api/backend/src/services/EnhancedSesameMayaRefiner.ts`
- **Purpose:** CSM voice profiles with emotional state awareness
- **Status:** Check integration

## 🧠 Intelligence & Memory

### SemanticMemoryService
- **Location:** `/lib/memory/SemanticMemoryService.ts`
- **Purpose:** Long-term memory with semantic search
- **Status:** Check if integrated with PersonalOracleAgent

### Soulprint System
- **Location:** `/lib/memory/soulprint.ts`
- **Purpose:** Track dominant elements, spiral history, archetypal patterns
- **Status:** Active

### MAIASafetyPipeline
- **Location:** `/lib/safety-pipeline.ts`
- **Purpose:** Crisis detection and intervention
- **Status:** Active in PersonalOracleAgent

## 📝 Notes for Future Claude

1. **Always check this file first** before building new voice/conversation systems
2. **Self-hosted Whisper exists** - we don't need to rely only on OpenAI
3. **VoiceServiceWithFallback** has sophisticated caching and preprocessing
4. **Three conversation modes** already built and working
5. If something seems missing, search for it - it probably exists!

## 🔧 Current Issues (2025-10-09)

- OpenAI Whisper transcription failing in Edge runtime → trying direct fetch fix
- Self-hosted Whisper not deployed yet (could solve this!)
- Conversation style switching just deployed, needs testing

