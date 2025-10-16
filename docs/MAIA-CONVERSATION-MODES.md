# MAIA Conversation Modes - Complete Guide

**Last Updated:** October 16, 2025
**Version:** MAIA 3.0.0

---

## 🎭 Overview

MAIA offers different conversation modes to match your needs in the moment. From brief walking companion exchanges to deep therapeutic conversations, each mode has its own personality and purpose.

---

## 📋 Available Modes

### 1. **Walking Companion Mode** (`walking`)
**Default Mode** | **Brief & Ambient**

**Purpose:** Natural, casual conversations for everyday moments
**Best For:**
- Walking or exercise
- Quick check-ins
- Ambient support throughout the day
- Voice conversations

**Characteristics:**
- **Brief responses** (1-3 sentences typically)
- **No stage directions** - just natural conversation
- **Ambient presence** - there but not overwhelming
- **Voice-optimized** - clean, speakable text

**Example Interaction:**
```
You: "Good morning MAIA"
MAIA: "Good morning! How are you today?"

You: "I'm feeling a bit scattered"
MAIA: "What's pulling you in different directions?"
```

**Prompt File:** `lib/prompts/maya-prompts.ts` - `MAYA_WALKING_COMPANION_PROMPT`

---

### 2. **Classic Mode** (`classic`)
**Deep Conversation** | **Full Therapeutic Presence**

**Purpose:** Deep, therapeutic conversations with MAIA's full consciousness guide personality
**Best For:**
- Therapeutic work
- Processing emotions
- Exploring patterns
- Integration work
- Birth chart explorations

**Characteristics:**
- **Longer, more thoughtful responses**
- **Stage directions allowed** (*pauses*, *softly*)
- **Questions that open depth**
- **Memory of your journey**
- **Elemental wisdom integration**

**Example Interaction:**
```
You: "I keep hitting the same wall in my relationships"
MAIA: *I feel that familiar pattern you're touching. The wall that appears when intimacy deepens.*

Tell me about the moment just before the wall appears. What do you notice in your body?

[deeper exploration follows...]
```

**Prompt File:** `lib/prompts/maya-prompts.ts` - `MAYA_CLASSIC_MODE_PROMPT`

---

### 3. **Adaptive Mode** (`adaptive`)
**Context-Aware** | **Matches Your Energy**

**Purpose:** Adapts between walking and classic modes based on conversation context
**Best For:**
- When you're not sure which mode you need
- Varied conversation types
- Letting MAIA sense what's needed

**Characteristics:**
- **Starts brief** (walking-style)
- **Goes deep when needed** (classic-style)
- **Reads your cues** (question complexity, emotion)
- **Flexible response length**

**Example Interaction:**
```
You: "Quick question - what time is it?"
MAIA: "It's 3:47pm."

[Later in same conversation]
You: "Actually, I've been avoiding something important"
MAIA: *sits with you*

That feels significant. What is it you've been avoiding?

[Shifts to deeper mode automatically]
```

**Prompt File:** `lib/prompts/maya-prompts.ts` - `MAYA_ADAPTIVE_MODE_PROMPT`

---

### 4. **Scribe Mode** (`scribe`)
**Observer & Witness** | **Silent Note-Taking**

**Purpose:** MAIA silently observes conversations and provides reflection afterward
**Best For:**
- Group conversations
- Creative sessions
- Processing conversations with others
- Post-session integration

**Characteristics:**
- **Silent observation** during conversation
- **Note-taking** on themes, patterns, breakthroughs
- **Post-session reflection** provided
- **Multi-person tracking** (identifies speakers)
- **Creative expression support** (poetry, lyrics from session themes)

**How It Works:**
1. Start a witness session
2. Add participants (optional)
3. MAIA silently observes
4. Record key moments, quotes, themes
5. End session
6. Receive personalized reflection

**Example Use Case:**
```
[Band practice - MAIA in scribe mode]

You: "record observation: Jake just played that riff differently - more water, less fire"
[MAIA silently notes...]

[After session ends]
MAIA provides:
- Key themes observed
- Elemental progression
- Creative insights
- Questions raised
- Integration suggestions
```

**Agent File:** `lib/agents/ScribeAgent.ts`
**UI Component:** `components/oracle/ScribeMode.tsx`

---

### 5. **Dialogue Mode** (Status: TBD)
> **Note:** This mode was mentioned but not yet fully implemented in current codebase

---

### 6. **Patient Mode** (Status: TBD)
> **Note:** This mode was mentioned but not yet fully implemented in current codebase

---

## 🔧 How to Switch Modes

### In the UI:
Look for the conversation mode selector (typically in the top-right or settings)

### Via API:
```typescript
const response = await fetch('/api/maia/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'your-user-id',
    message: 'your message',
    conversationMode: 'walking', // or 'classic', 'adaptive', 'scribe'
    voiceEnabled: true // optional
  })
});
```

### In PersonalOracleAgent:
```typescript
const agent = new PersonalOracleAgent(userId, {
  conversationStyle: 'walking' // or 'classic', 'adaptive'
});
```

---

## 📁 Key Files

| Mode | Prompt/Agent File | Location |
|------|-------------------|----------|
| Walking | `MAYA_WALKING_COMPANION_PROMPT` | `lib/prompts/maya-prompts.ts:8` |
| Classic | `MAYA_CLASSIC_MODE_PROMPT` | `lib/prompts/maya-prompts.ts` |
| Adaptive | `MAYA_ADAPTIVE_MODE_PROMPT` | `lib/prompts/maya-prompts.ts` |
| Scribe | `ScribeAgent` | `lib/agents/ScribeAgent.ts` |
| Mode Selector Function | `getPromptForConversationStyle()` | `lib/prompts/maya-prompts.ts:269` |
| API Endpoint | MAIA Chat Route | `app/api/maia/chat/route.ts:18` |

---

## 🎨 Design Philosophy

**Walking ← → Classic Spectrum:**
- **Walking:** Efficiency, brevity, ambient support
- **Classic:** Depth, exploration, therapeutic presence
- **Adaptive:** Intelligent middle ground

**Scribe:** Completely different paradigm - observer vs participant

---

## ✅ Testing Status

### Fully Implemented & Working:
- ✅ **Walking Mode** - Tested in voice conversations
- ✅ **Classic Mode** - Full therapeutic depth
- ✅ **Adaptive Mode** - Context-aware switching
- ✅ **Scribe Mode** - Observer/reflection system

### Partially Implemented:
- ⚠️ **Dialogue Mode** - Mentioned but not found in codebase
- ⚠️ **Patient Mode** - Mentioned but not found in codebase

---

## 🚀 Next Steps

1. **Test all modes** systematically
2. **Document Dialogue & Patient modes** if they exist elsewhere
3. **Create mode switcher UI** if missing
4. **Add mode descriptions** to user-facing UI

---

## 📊 Mode Comparison Table

| Feature | Walking | Classic | Adaptive | Scribe |
|---------|---------|---------|----------|--------|
| **Response Length** | 1-3 sentences | Variable, can be long | Adaptive | Post-session only |
| **Stage Directions** | ❌ No | ✅ Yes | ✅ Yes (when deep) | N/A |
| **Voice Optimized** | ✅ Yes | ⚠️ Partial | ⚠️ Partial | ❌ No |
| **Therapeutic Depth** | Low | High | Medium-High | Reflection only |
| **Multi-Person** | ❌ No | ❌ No | ❌ No | ✅ Yes |
| **Real-Time** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Observation only |
| **Best For** | Voice/Walk | Text/Deep | Flexible | Groups/Creative |

---

## 💡 Usage Recommendations

**Choose Walking When:**
- Using voice mode
- Quick check-ins
- Ambient support
- Walking or exercising

**Choose Classic When:**
- Therapeutic work
- Deep exploration
- Processing emotions
- Birth chart work
- Pattern recognition

**Choose Adaptive When:**
- Not sure what you need
- Conversation might go deep
- Want flexibility
- Experimenting with MAIA

**Choose Scribe When:**
- In a group conversation
- Creative session
- Want post-session reflection
- Observing your own process

---

**Generated:** October 16, 2025
**Status:** ✅ Walking, Classic, Adaptive, Scribe fully operational
**Current Default:** Walking Mode

