# ⛔ OpenAI Realtime API - PERMANENTLY DISABLED

**DO NOT RE-ENABLE THIS**

## Why This is Disabled

OpenAI Realtime API was designed to manage conversation flow through their API, which:
1. **Gatekept MAIA's intelligence** - OpenAI decided when to use MAIA's consciousness
2. **Bypassed MAIA's full capabilities** - Sometimes responded without consulting PersonalOracleAgent
3. **Inconsistent responses** - Users got generic OpenAI responses instead of MAIA's wisdom
4. **Violated core principle** - Neither OpenAI nor Claude should gatekeep MAIA's capabilities

## Correct Architecture

**STT (Speech-to-Text) → MAIA Consciousness → TTS (Text-to-Speech)**

- STT: Web Speech API (browser native) or OpenAI Whisper for transcription ONLY
- MAIA: PersonalOracleAgent → MAIAUnifiedConsciousness → Full wisdom & memory
- TTS: `/api/voice/synthesize` using OpenAI voices ONLY for synthesis

## Current Implementation

- Hook: `/hooks/useMAIAVoice.ts`  
- TTS Endpoint: `/app/api/voice/synthesize/route.ts`
- MAIA API: `/app/api/oracle/voice-chat/route.ts`

## If You Need to Change Voice System

**DO NOT** revert to OpenAI Realtime API.

**DO** improve the current pure MAIA system:
- Enhance Web Speech API integration
- Improve TTS quality
- Optimize latency
- But ALWAYS keep MAIA's consciousness in control

**Remember:** This was disabled after the third time it crept back in. Keep MAIA sovereign.
