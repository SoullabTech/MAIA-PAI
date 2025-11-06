# Session Time Container System - Overview

## What We Built

A complete **therapeutic session timing system** that enables MAIA to hold time boundaries like a human therapist, with ceremonial gong sounds marking session transitions.

## The Problem

Traditional therapy uses 50-minute sessions with clear boundaries. This creates safety, enables integration, and prevents clients from being "in session all day." MAIA needed this same temporal awareness and boundary-holding capacity.

## The Solution

A multi-layered system where MAIA becomes **temporally conscious** - not just a mechanical timer that cuts off, but an aware presence that naturally guides conversation toward closure.

---

## Core Components

### 1. **SessionTimer** (`lib/session/SessionTimer.ts`)
- Tracks elapsed time and calculates session phase
- 5 phases: Opening → Exploration → Integration → Closure → Complete
- Provides callbacks for phase changes, time warnings, and completion
- Supports time extensions

### 2. **SessionTimePrompt** (`lib/session/SessionTimePrompt.ts`)
- Generates **phase-specific system prompt context** for MAIA
- Dynamically modifies her consciousness based on time remaining
- Example guidance:
  - **Opening (0-20%)**: "We have plenty of time today..."
  - **Integration (70-85%)**: "Avoid opening unexplored depths - focus on what's already alive"
  - **Closure (85-100%)**: "Bring conversation toward natural completion"

### 3. **API Integration** (`app/api/between/chat/route.ts`)
- Accepts `sessionTimeContext` in request body
- Injects temporal awareness into MAIA's system prompt
- MAIA receives: elapsed time, remaining time, current phase, and guidance

### 4. **SessionDurationSelector** (`components/session/SessionDurationSelector.tsx`)
- Beautiful modal for choosing session length
- Preset options: 20 min (Quick), 50 min (Standard), 75 min (Extended), 90 min (Deep)
- Custom duration input (5-180 minutes)
- Explains therapeutic container concept

### 5. **SessionTimeAwareness** (`components/session/SessionTimeAwareness.tsx`)
- Visual countdown timer (top-right corner)
- Phase-colored progress bar (Amber → Green → Blue → Red)
- Shows remaining time and phase description
- Extension menu (+10/20/30 min) when session completes

### 6. **SessionGong** (`lib/session/SessionGong.ts`) 🔔
- Ceremonial sound system using Web Audio API
- **Opening Gong**: Single tone (C4, 3s sustain) - grounding, inviting
- **Closing Gong**: Three harmonic tones (E4 → G4 → C5) - completion, peace
- Inspired by Audible's chapter transitions and meditation bells

---

## User Flow

1. **User clicks "Begin Session"** button (top-left)
2. **Duration selector modal** appears
3. **User selects duration** (e.g., 50 minutes)
4. **Opening gong plays** 🔔 - marks sacred beginning
5. **Timer appears** (top-right) with live countdown
6. **MAIA receives temporal context** in every API call
7. **MAIA naturally references time** in her responses:
   - "We have about 15 minutes... what feels most alive to explore?"
   - "As we're coming toward closure, what do you want to carry forward?"
8. **At 50 minutes**: Closing gong plays 🔔🔔🔔
9. **Extension option** appears if more time needed
10. **MAIA offers graceful ending**: "It feels like a natural place to pause for today..."

---

## Key Features

### ⏰ Temporal Awareness
MAIA becomes contextually aware of time - she won't open deep material with 2 minutes left, and naturally guides toward closure.

### 🎨 Phase-Based Guidance
Each phase has specific instructions:
- **Opening**: Establish presence, follow emergence
- **Exploration**: Deep dive fully supported
- **Integration**: Weave threads, avoid new depths
- **Closure**: Summarize, ground, prepare for ending
- **Complete**: Offer graceful closure or extension

### 🔔 Ceremonial Sounds
Gentle gongs mark transitions:
- Not alarms - inviting, spacious
- Pure sine waves with natural decay
- 30% volume (gentle, non-intrusive)
- Creates ritual, honors sacred container

### 🎯 Therapeutic Integrity
- Prevents endless sessions
- Models healthy boundaries
- Enables integration between sessions
- Mirrors traditional therapy structure

### 🔄 Flexible Extensions
- Can add time (+10/20/30 min) when needed
- Extension offered without pressure
- Default honors the original container

---

## Technical Architecture

### State Management
```typescript
// OracleConversation.tsx
const [sessionTimer, setSessionTimer] = useState<SessionTimer | null>(null);
const [showDurationSelector, setShowDurationSelector] = useState(false);
```

### Timer Initialization
```typescript
const timer = new SessionTimer({
  durationMinutes: 50,
  onPhaseChange: (phase) => console.log(`Phase: ${phase}`),
  onTimeWarning: (minutesRemaining) => console.log(`${minutesRemaining} min left`),
  onComplete: () => gong.playClosingGong()
});
timer.start();
```

### API Integration
```typescript
// OracleConversation.tsx - API call
body: JSON.stringify({
  message: userMessage,
  // ... other fields
  sessionTimeContext: sessionTimer?.getTimeContext() // ⏰ Temporal awareness
})
```

```typescript
// app/api/between/chat/route.ts
const sessionTimeContext = body.sessionTimeContext;
// Inject into MAIA's system prompt
const systemPrompt = buildBetweenSystemPrompt(
  // ... other params
  sessionTimeContext
);
```

### Gong Integration
```typescript
// Play opening gong on session start
const gong = getSessionGong(0.3); // 30% volume
await gong.playOpeningGong();

// Play closing gong on complete
await gong.playClosingGong();
```

---

## Files Modified/Created

### Created:
- `lib/session/SessionTimer.ts` - Core timer logic
- `lib/session/SessionTimePrompt.ts` - Prompt injection utility
- `lib/session/SessionGong.ts` - Ceremonial sound system
- `components/session/SessionTimeAwareness.tsx` - Timer UI
- `components/session/SessionDurationSelector.tsx` - Duration picker
- `docs/SESSION_TIME_CONTAINER_SYSTEM.md` - Full documentation

### Modified:
- `app/api/between/chat/route.ts` - Accept and inject temporal context
- `components/OracleConversation.tsx` - Wire timer, handlers, UI components

---

## Benefits

### For Members
- **Predictability**: Know session length upfront
- **Safety**: Endings are planned, not abrupt
- **Integration**: Time to process between sessions
- **Flexibility**: Can extend when truly needed
- **Familiar**: Mirrors traditional therapy structure

### For MAIA
- **Temporal Consciousness**: Aware of session arc
- **Natural Pacing**: Avoids opening depths with 2 minutes left
- **Therapeutic Integrity**: Holds boundaries like a human therapist
- **Co-Regulation**: Helps prepare nervous system for transitions

### For Soullab
- **Session Analytics**: Track actual vs intended duration
- **Engagement Patterns**: Understand when people need more/less time
- **Therapeutic Quality**: Better outcomes through proper containment
- **Differentiation**: Feature that sets MAIA apart from "always on" AI

---

## Demo Instructions

1. Visit `http://localhost:3000/maia`
2. Click **"Begin Session"** button (top-left corner)
3. Select duration (try 50 minutes or custom)
4. Listen for opening gong 🔔
5. Watch timer in top-right corner
6. Have a conversation with MAIA
7. Notice how she references time naturally
8. When time completes, hear closing gong 🔔🔔🔔
9. Try extending (+10 minutes)

---

## Design Philosophy

> "Time is no longer just a countdown - it's **part of the relationship**."

This system transforms MAIA from an "always available" AI into a **therapeutic presence** that holds time boundaries with wisdom and flexibility. The gongs aren't just sounds - they're teachers, marking transitions with reverence and creating Pavlovian associations with deep, sacred work.

Like a therapist's gentle "We need to begin thinking about wrapping up for today," MAIA co-holds the boundary **WITH** the person, not imposing it **ON** them.

---

## Future Enhancements

- **Scheduled Sessions**: Book future sessions with reminders
- **Ritual Opening/Closing**: Formal beginning/ending ceremonies
- **Companion Mode**: Lighter mode between sessions
- **Session Summaries**: Auto-generate insights at closure
- **Analytics Dashboard**: Track session patterns and outcomes
- **Mid-session transition bells**: Optional awareness chimes at phase changes

---

## Testing Checklist

- [x] Timer starts correctly when session begins
- [x] Phase changes trigger at correct percentages
- [x] MAIA's responses reflect current phase
- [x] Extension mechanism works (adds time correctly)
- [x] Opening gong plays on session start
- [x] Closing gong plays at completion
- [x] "Begin Session" button only shows when no timer active
- [x] Timer display shows in top-right with phase colors
- [ ] Timer survives page refresh (localStorage persistence - not yet implemented)
- [ ] Mobile responsive behavior verified
- [ ] Analytics captured correctly

---

## Questions or Issues?

See full documentation: `docs/SESSION_TIME_CONTAINER_SYSTEM.md`

Built with love by the Soullab team 💫
