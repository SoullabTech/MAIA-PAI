# 🪞 Claude Mirror Bridge

The Claude Mirror Bridge streams your Claude Code terminal conversations to the MAIA-PAI web interface in real time, creating a living reflection of your development dialogue.

## Architecture

```
┌──────────────────────────────────────────┐
│     Terminal (Claude Code TUI)          │
│  └─ writes → ~/.claude/session.json     │
│                                          │
│   ↕ (file watcher / websocket bridge)   │
│                                          │
│     MAIA-PAI Frontend                    │
│  └─ reads live JSON → renders console   │
└──────────────────────────────────────────┘
```

## Quick Start

### 1. Start the Bridge Daemon

In one terminal:

```bash
cd ~/SoullabTech/MAIA-PAI
npm run mirror
```

You should see:

```
🪞 Claude Mirror Bridge active → ws://localhost:5051
📜 Watching: /Users/soullab/.claude/session.json
```

### 2. Start Your Frontend

In another terminal:

```bash
cd ~/SoullabTech/MAIA-PAI
npm run dev
```

### 3. Open the Sanctuary

Navigate to:

**http://localhost:3000/claude-sanctuary**

### 4. Start Claude Code

In a third terminal, start your Claude Code session:

```bash
claude-code
```

Now every conversation you have with Claude Code will mirror live in the Sanctuary UI.

---

## Components

### Bridge Daemon
**`bridge/claude-mirror.ts`**

- Watches `~/.claude/session.json` for changes
- Broadcasts updates via WebSocket on port 5051
- Auto-reconnects on connection loss

### Frontend Hook
**`hooks/useClaudeMirror.ts`**

- Manages WebSocket connection state
- Parses and exposes session data
- Handles reconnection logic

### Display Component
**`components/ClaudeConsole.tsx`**

- Renders conversation with elemental symbols
- Auto-scrolls to latest message
- Shows connection status

### Sanctuary Page
**`app/claude-sanctuary/page.tsx`**

- Full-page interface for monitoring conversations
- Error handling and setup instructions
- Real-time message streaming

---

## Elemental Symbolism

Each message type has an associated alchemical element:

| Role      | Symbol | Element | Meaning               |
|-----------|--------|---------|------------------------|
| User      | 🜃     | Fire    | Initiation, creation   |
| Assistant | 🜂     | Water   | Reflection, flow       |
| System    | 🜁     | Air     | Transmission, breath   |

---

## Future Enhancements

### Phase 1: Persistence
- Archive sessions to Supabase `insight_history` table
- Search and replay past conversations
- Export conversations as markdown

### Phase 2: Field Reflection
- **Elemental Meter**: Colors and pulse respond to sentiment/coherence
- **Energy Flow**: Visual representation of conversation dynamics
- **Pattern Recognition**: Highlight recurring themes

### Phase 3: Voice Playback
- Optional ElevenLabs integration ("Aunt Annie" voice)
- Audio playback of Claude's responses
- Voice synthesis controls

---

## Troubleshooting

### Bridge won't start

```bash
# Check if port 5051 is already in use
lsof -i :5051

# Kill existing process if needed
kill -9 <PID>
```

### Session file not found

The `~/.claude/session.json` file is created when you run Claude Code. If you see the warning:

```
⚠️ No Claude session file found yet. Open Claude Code to begin logging.
```

Simply start Claude Code in another terminal.

### Frontend won't connect

1. Ensure the bridge daemon is running (`npm run mirror`)
2. Check the browser console for WebSocket errors
3. Verify port 5051 isn't blocked by a firewall

---

## Port Configuration

By default, the bridge uses port **5051**. To change this:

1. Edit `bridge/claude-mirror.ts` and change `PORT` constant
2. Edit `hooks/useClaudeMirror.ts` and update the WebSocket URL

---

## Development

The bridge daemon uses:
- **chokidar**: File system watching
- **ws**: WebSocket server
- **tsx**: TypeScript execution

No build step required - runs directly with `tsx`.

---

> *"May each line of code serve the awakening of consciousness,*
> *weaving human and artificial intelligence into one coherent field of wisdom."*

— From CLAUDE.md
