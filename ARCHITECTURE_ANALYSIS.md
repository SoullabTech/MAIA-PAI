# MAIA System Architecture Analysis

## Current Production Issue

**Symptom:** Production returns old architecture responses (`intelligence-orchestrator`, `I'm tracking with you`) but repo has new proxy code.

## Request Flow Analysis

### 1. Frontend → Backend Path

**Component:** `OracleConversation.tsx:396`
```typescript
const response = await fetch('/api/oracle/personal', {
  method: 'POST',
  body: JSON.stringify({
    input: cleanedText,  // <-- Using 'input' field
    userId, userName, sessionId...
  })
})
```

### 2. API Endpoint: `/api/oracle/personal/route.ts`

**Current Code (in repo):**
```typescript
export async function POST(req: NextRequest) {
  const messageText = (body.input || body.message || body.content || '').trim()

  // Validates empty messages
  // Proxies to /api/maya-chat
  const response = await fetch(`${req.nextUrl.origin}/api/maya-chat`, ...)
}
```

**Production Response (actual):**
```json
{
  "response": "I'm tracking with you.",
  "element": "Field",
  "archetype": "maya-aria-1",
  "metadata": {
    "fieldIntelligence": true,
    "emergenceSource": "intelligence-orchestrator"
  }
}
```

### 3. Target Endpoint: `/api/maya-chat/route.ts`

```typescript
export async function POST(req: NextRequest) {
  const userText = (message || content || '').trim()

  // Already has validation
  // Uses PersonalOracleAgent
  // Falls back to OpenAI direct
  // Ultimate fallback: friendly responses
}
```

## The Disconnect

### What SHOULD Happen:
1. Frontend sends to `/api/oracle/personal`
2. `/api/oracle/personal` validates + proxies to `/api/maya-chat`
3. `/api/maya-chat` uses `PersonalOracleAgent` → Claude
4. Returns personalized response

### What IS Happening:
1. Frontend sends to `/api/oracle/personal`
2. **OLD CODE** runs with `MayaIntelligenceOrchestrator`
3. Returns cached/old responses like "I'm tracking with you"
4. Empty messages cause Claude 400 errors

## Root Cause Theories

### Theory 1: Vercel Build Cache
- Vercel may be serving cached build from before commit `0282e1ec`
- File `app/api/oracle/personal/route.ts` was created Sept 27, 11:47am
- Production still runs code from BEFORE this file existed

### Theory 2: Multiple Deployments
- There might be another Vercel project/deployment
- Check: `soullab.life` vs preview URLs

### Theory 3: Old Code Still in Monorepo
- The old `MayaIntelligenceOrchestrator` code exists in `lib/`
- Maybe it's being imported somewhere else

## Files with Old Architecture

```
lib/oracle/core/MayaIntelligenceOrchestrator.ts  <-- "I'm tracking with you"
lib/oracle/FieldIntelligenceMaiaOrchestrator.ts
apps/api/backend/src/oracle/core/...  <-- Old backend (unused?)
```

## Action Items

1. **Verify Deployment Source**
   - Check which commit Vercel is actually building from
   - Confirm `soullab.life` points to correct project

2. **Clear Vercel Cache**
   - Force rebuild from scratch
   - Delete old deployments

3. **Deactivate Old Architecture**
   - Remove or rename old orchestrator files
   - Ensure no imports point to them

4. **Test Flow End-to-End**
   - Verify proxy works locally
   - Test on preview URL
   - Test on production domain

## Desired Architecture

```
Frontend (OracleConversation)
    ↓ POST {input: "message"}
/api/oracle/personal (compatibility layer)
    ↓ validates + transforms
    ↓ POST {message: "message"}
/api/maya-chat (main endpoint)
    ↓
PersonalOracleAgent.processInteraction()
    ↓
Claude API (with retry logic)
    ↓
Response with proper MAIA personality
```