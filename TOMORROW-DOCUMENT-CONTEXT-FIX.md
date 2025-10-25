# Document Context Integration - Tomorrow's Work

## The Split Brain Issue

**Problem:** Documents uploaded are accessible in text mode but NOT in voice mode.

**Why:**
- **Text mode**: Uses OracleConversation.tsx → has access to UI state, attachments, uploaded docs
- **Voice mode**: Uses MAIA Realtime (wrapper around OpenAI Realtime) → separate context, no document access
- **Result**: User uploads PDF → text MAIA can see it → voice MAIA says "I haven't received any files"

---

## Current Architecture

### MAIA Realtime System

**Frontend:** `lib/voice/MaiaRealtimeWebRTC.ts`
- WebRTC connection to OpenAI Realtime API
- Passes mode (dialogue/patient/scribe) to backend

**Backend:** `app/api/voice/webrtc-session/route.ts`
- Receives SDP + mode + userId
- Builds Akashic Field context (line 36-49)
- Creates session with mode-specific instructions
- Defines `process_spiralogic()` function for routing deep queries

**The Wrapper Adds:**
1. Akashic Field context retrieval (userId → recent insights)
2. Mode-specific VAD settings (dialogue/patient/scribe)
3. Function calling to route to Spiralogic backend
4. Custom system prompts per mode

### Document Upload System

**Upload:** `app/api/upload/route.ts`
- User uploads file → Supabase storage
- Triggers analysis endpoint

**Analysis:** `app/api/documents/analyze/route.ts`
- PDFs → Claude reads directly
- Audio/Video → Whisper transcription → Claude analysis
- Stores analysis in Supabase `documents` table

**Problem:** This analysis is stored but NEVER injected into voice session context!

---

## The Fix (Tomorrow)

### Step 1: Fetch User Documents on Session Start

In `app/api/voice/webrtc-session/route.ts`, after fetching Akashic Field context:

```typescript
// AFTER line 49 (Akashic Field context)
// ADD: Fetch analyzed documents

let documentContext = '';
if (userId) {
  try {
    const { data: documents } = await supabase
      .from('documents')
      .select('filename, analysis, transcription, analyzed_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('analyzed_at', { ascending: false })
      .limit(5); // Most recent 5 analyzed documents

    if (documents && documents.length > 0) {
      documentContext = '\n\nRECENT DOCUMENTS UPLOADED:\n';
      for (const doc of documents) {
        documentContext += `\n📄 ${doc.filename}:`;
        if (doc.analysis?.summary) {
          documentContext += `\n   Summary: ${doc.analysis.summary.substring(0, 200)}...`;
        }
        if (doc.analysis?.key_insights) {
          documentContext += `\n   Key insights: ${doc.analysis.key_insights.slice(0, 3).join(', ')}`;
        }
        if (doc.transcription) {
          documentContext += `\n   Duration: ${doc.transcription.duration}`;
        }
        documentContext += '\n';
      }
    }
  } catch (error) {
    console.warn('[webrtc-session] Failed to fetch documents:', error);
  }
}
```

### Step 2: Inject Document Context into Instructions

```typescript
// In mode configs (line 54-119), append documentContext:

dialogue: {
  instructions: `You are MAIA...

  ${contextualAwareness}
  ${documentContext}`, // ADD THIS
  turn_detection: { ... }
}
```

### Step 3: Update Function Call Schema

Add a parameter to `process_spiralogic` to include document references:

```typescript
tools: [
  {
    type: 'function',
    name: 'process_spiralogic',
    parameters: {
      type: 'object',
      properties: {
        user_message: { ... },
        emotional_quality: { ... },
        referenced_documents: {  // NEW
          type: 'array',
          items: { type: 'string' },
          description: 'Filenames of documents user is asking about'
        }
      }
    }
  }
]
```

---

## Expected Outcome

**Before:**
```
User (voice): "What did that PDF say about transformation?"
MAIA (voice): "I haven't received any files yet."
```

**After:**
```
User (voice): "What did that PDF say about transformation?"
MAIA (voice): "In the Transformation Architecture PDF, the key insight was about integrating elemental consciousness with digital systems. Let me pull up more details..."
[calls process_spiralogic() with referenced_documents: ["TRANSFORMATION ARCHITECTURE INTEGRATION — COMPLETE.pdf"]]
```

---

## Estimated Time: 30-45 minutes

1. Add document fetching (10 min)
2. Inject into session instructions (5 min)
3. Update function schema (5 min)
4. Test with uploaded PDF (10 min)
5. Test with uploaded audio (10 min)

---

## Testing Checklist

- [ ] Upload PDF in text mode
- [ ] Switch to voice mode
- [ ] Ask "What documents have I uploaded?"
- [ ] Ask "What did that PDF say about X?"
- [ ] Upload audio file (therapy session)
- [ ] Ask "What did I talk about in that recording?"

---

**Status:** Ready to implement tomorrow with fresh mind.

**Current State:** Beta testers have fully functional system. This is polish.

**I am because we are.** Rest well, friend. 🌙✨
