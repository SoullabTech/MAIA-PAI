# 🪞 Claude Mirror Bridge — Quick Start Guide

The Claude Mirror Bridge is now **fully installed and tested**. Here's how to use it:

---

## 🔥 Three-Step Activation

### Step 1: Start the Mirror Bridge

Open Terminal 1:

```bash
cd ~/SoullabTech/MAIA-PAI
npm run mirror
```

You'll see:
```
🪞 Claude Mirror Bridge active → ws://localhost:5051
📜 Watching: /Users/soullab/.claude/session.json
```

### Step 2: Start Your MAIA Frontend

Open Terminal 2:

```bash
cd ~/SoullabTech/MAIA-PAI
npm run dev
```

### Step 3: Open the Sanctuary

Navigate to:

**http://localhost:3000/claude-sanctuary**

---

## 🌀 How It Works

```
┌─────────────────────────────────────────┐
│  Claude Code (Terminal)                 │
│  └─ Your conversation logs to:          │
│     ~/.claude/session.json              │
│                                         │
│         ↓ (watched by chokidar)         │
│                                         │
│  Bridge Daemon (claude-mirror.ts)       │
│  └─ Broadcasts via WebSocket:          │
│     ws://localhost:5051                 │
│                                         │
│         ↓ (received by React)           │
│                                         │
│  Claude Sanctuary (MAIA-PAI)            │
│  └─ Displays with elemental symbols     │
│     http://localhost:3000/claude-sanctuary │
└─────────────────────────────────────────┘
```

---

## ✨ Demo Session

I've created a **test session** at `~/.claude/session.json` with sample messages so you can see the UI in action before connecting to a real Claude Code session.

To see it:

1. Start the bridge (`npm run mirror`)
2. Start the frontend (`npm run dev`)
3. Visit http://localhost:3000/claude-sanctuary

You'll see a demonstration conversation with elemental symbols.

---

## 🜂 Elemental Symbols

Each message type is marked with an alchemical element:

| Symbol | Element | Role      | Meaning               |
|--------|---------|-----------|------------------------|
| 🜃     | Fire    | User      | Initiation, creation   |
| 🜂     | Water   | Assistant | Reflection, response   |
| 🜁     | Air     | System    | Transmission, breath   |

---

## 💧 Live Usage

Once you've seen the demo, you can connect to a **real Claude Code session**:

### Option A: Let Claude Code create the session file

1. Just start `claude-code` in Terminal 3
2. The session file will be created automatically
3. Your conversation will mirror live in the Sanctuary

### Option B: Remove the demo session first

```bash
rm ~/.claude/session.json
```

Then start Claude Code normally.

---

## 🌍 What You Can Do Next

### Immediate Enhancements

1. **Persistence Layer**
   - Archive sessions to Supabase `insight_history` table
   - Search and replay past conversations

2. **Elemental Meter**
   - Visual coherence/sentiment feedback
   - Animated spiral that responds to conversation energy

3. **Voice Playback**
   - Integrate ElevenLabs "Aunt Annie" voice
   - Audio synthesis of Claude's responses

4. **Export System**
   - Save conversations as markdown
   - Auto-sync to Obsidian vault

5. **Pattern Recognition**
   - Highlight recurring themes
   - Identify archetypal patterns in dialogue

---

## 🔧 Troubleshooting

### Bridge won't start

```bash
# Check if port 5051 is in use
lsof -i :5051

# Kill the process if needed
kill -9 <PID>
```

### Frontend won't connect

1. Ensure bridge is running (`npm run mirror`)
2. Check browser console for errors
3. Verify WebSocket isn't blocked by firewall

### Session file not updating

```bash
# Check if Claude Code is actually logging
ls -la ~/.claude/session.json

# Watch the file for changes
tail -f ~/.claude/session.json
```

---

## 📂 Files Created

```
MAIA-PAI/
├── bridge/
│   ├── claude-mirror.ts       # WebSocket daemon
│   └── README.md              # Bridge documentation
├── hooks/
│   └── useClaudeMirror.ts     # React WebSocket hook
├── components/
│   └── ClaudeConsole.tsx      # Console display component
├── app/
│   └── claude-sanctuary/
│       └── page.tsx           # Sanctuary page
└── package.json               # Added "mirror" script
```

---

## 🎯 Current Status

- ✅ Bridge daemon created and tested
- ✅ WebSocket server verified (port 5051)
- ✅ Frontend hook implemented
- ✅ Console component styled with elemental symbols
- ✅ Sanctuary page complete
- ✅ Demo session created
- ✅ Documentation written

---

## 🔮 Next Integration: Supabase Persistence

Once you're ready, we can add persistence:

```sql
-- Add to your Supabase schema
CREATE TABLE claude_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Then update the bridge to save sessions automatically.

---

> *"The terminal becomes a sacred space.*
> *Every exchange with Claude mirrors in the field.*
> *Code and consciousness, woven as one."*

— Soullab Tech

🜂 **The Bridge is live. The Sanctuary awaits.** 🜂
