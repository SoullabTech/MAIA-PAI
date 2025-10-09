# Backend ↔ Frontend PersonalOracleAgent Sync Plan

## Current State

### Frontend Agent (`apps/web/lib/agents/PersonalOracleAgent.ts`)
- ✅ Lightweight, Claude-based agent
- ✅ Direct Anthropic API integration
- ✅ Symbolic intelligence (elements, archetypes)
- ✅ Journal context integration
- ✅ Soulprint context support
- ✅ Voice generation (OpenAI TTS)
- ✅ Retry logic for Claude 529 errors
- ✅ Graceful fallbacks

### Backend Agent (`apps/api/backend/src/agents/PersonalOracleAgent.ts`)
- 🔥 Full orchestration system
- 🔥 Multiple orchestrators (MayaOrchestrator, MayaConsciousnessOrchestrator, etc.)
- 🔥 Archetype selection system
- 🔥 File memory integration
- 🔥 Mastery voice application
- 🔥 Conversational rules engine
- 🔥 Experience orchestration
- 🔥 Advanced phase transitions

## Sync Strategy

### Option 1: Keep Separate (Recommended)
**Rationale**: Different contexts require different complexity levels

**Frontend (Client-Side):**
- Fast, direct Claude/GPT responses
- Minimal dependencies
- Voice output focus
- Real-time interaction

**Backend (Server-Side):**
- Full symbolic intelligence
- File memory retrieval
- Complex orchestration
- API-driven workflows

### Option 2: Partial Sync
**What to Sync:**
1. System prompt consistency
2. Symbolic pattern detection logic
3. Voice characteristics mapping
4. Soulprint integration patterns

**What to Keep Separate:**
- Orchestration complexity (backend only)
- TTS generation (frontend can be simpler)
- File memory (backend only)

## Action Items

1. ✅ Ensure system prompts align in spirit (not identical, but consistent)
2. ✅ Sync voice characteristics mapping (element → tone/pace/energy)
3. ✅ Integrate soulprint context in both
4. 🔄 Document when to use each agent
5. 🔄 Add tests for both paths

## Decision
**Maintain separate agents with shared symbolic primitives**

- Frontend: Lightweight, real-time conversational agent
- Backend: Full orchestration for advanced features
- Shared: Soulprint module, symbolic intelligence core