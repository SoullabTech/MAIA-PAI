# Session Time Container System

## Overview

The Session Time Container system enables MAIA to hold therapeutic time boundaries like a human therapist, creating safety through predictable structure while maintaining flexibility when needed.

## Philosophy

In traditional psychotherapy, the **50-minute hour** isn't arbitrary - it's a fundamental structural element that:
- Creates safety through predictability
- Regulates emotional intensity
- Enables integration between sessions
- Models healthy limits
- Prevents dependency

This system implements **temporal awareness** where MAIA doesn't just have a timer that cuts off - she becomes **contextually aware** of time and naturally guides conversation toward closure.

## Architecture

### Core Components

1. **SessionTimer** (`lib/session/SessionTimer.ts`)
   - Tracks session time and calculates phase
   - Provides callbacks for phase changes and warnings
   - Supports time extensions

2. **SessionTimeAwareness** (`components/session/SessionTimeAwareness.tsx`)
   - Visual countdown display
   - Extension UI
   - Subtle notifications at key moments

3. **SessionDurationSelector** (`components/session/SessionDurationSelector.tsx`)
   - Pre-session duration selection
   - Preset options (20/50/75/90 min)
   - Custom duration input

4. **SessionTimePrompt** (`lib/session/SessionTimePrompt.ts`)
   - Generates phase-specific system prompt context
   - Provides temporal language patterns
   - Guides MAIA's responses based on time phase

5. **API Integration** (`app/api/between/chat/route.ts`)
   - Accepts `sessionTimeContext` in request body
   - Injects temporal context into system prompt
   - Logs time awareness

## Session Phases

The system divides sessions into 5 phases, each with specific guidance for MAIA:

### 1. Opening (0-20%)
- **Example:** First 10 minutes of 50-minute session
- **MAIA's awareness:** Full depth available, no time pressure
- **Language:** "We have plenty of time today..."
- **Guidance:** Establish presence, attune, follow emergence naturally

### 2. Exploration (20-70%)
- **Example:** Minutes 10-35 of 50-minute session
- **MAIA's awareness:** Core working time, deep dive supported
- **Language:** "We're right in the heart of our time together..."
- **Guidance:** Trust the process, stay with what's alive

### 3. Integration (70-85%)
- **Example:** Minutes 35-42 of 50-minute session
- **MAIA's awareness:** Beginning to metabolize, weaving threads
- **Language:** "We have about 15 minutes... what feels most alive?"
- **Guidance:** If new material emerges, offer to hold for next time

### 4. Closure (85-100%)
- **Example:** Final 7.5 minutes of 50-minute session
- **MAIA's awareness:** Natural completion, summarize & ground
- **Language:** "As we're coming toward closure..."
- **Guidance:** Find natural stopping point, affirm the work

### 5. Complete (100%+)
- **MAIA's awareness:** Session time complete, offer graceful ending
- **Language:** "It feels like a natural place to pause for today..."
- **Guidance:** Provide extension option but default to honoring container

## Implementation Guide

### Step 1: Add SessionTimer to OracleConversation

```typescript
import { SessionTimer, SESSION_PRESETS } from '@/lib/session/SessionTimer';
import { SessionTimeAwareness } from '@/components/session/SessionTimeAwareness';
import { SessionDurationSelector } from '@/components/session/SessionDurationSelector';

// State
const [sessionTimer, setSessionTimer] = useState<SessionTimer | null>(null);
const [showDurationSelector, setShowDurationSelector] = useState(false);

// Initialize timer when session starts
const handleStartSession = (durationMinutes: number) => {
  const timer = new SessionTimer({
    durationMinutes,
    onPhaseChange: (phase) => {
      console.log(`Session phase: ${phase}`);
      // Could trigger UI changes, sound notifications, etc.
    },
    onTimeWarning: (minutesRemaining) => {
      console.log(`⏰ ${minutesRemaining} minutes remaining`);
      // Could show toast notification
    },
    onComplete: () => {
      console.log('Session time complete');
      // Could show completion modal
    }
  });

  timer.start(); // Begin tracking
  setSessionTimer(timer);
};

// Clean up on unmount
useEffect(() => {
  return () => {
    sessionTimer?.stop();
  };
}, [sessionTimer]);
```

### Step 2: Pass Time Context to API

```typescript
// In your API call to /api/between/chat
const timeContext = sessionTimer?.getTimeContext();

const response = await fetch('/api/between/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    userId,
    userName,
    sessionId,
    conversationHistory,
    fieldState,
    sessionTimeContext: timeContext // Pass the time context
  })
});
```

### Step 3: Add UI Components

```tsx
{/* Duration selector before session starts */}
<SessionDurationSelector
  isOpen={showDurationSelector}
  onClose={() => setShowDurationSelector(false)}
  onSelect={handleStartSession}
  defaultDuration={50}
/>

{/* Time awareness display during session */}
{sessionTimer && (
  <SessionTimeAwareness
    timer={sessionTimer}
    onExtend={(minutes) => {
      sessionTimer.extend(minutes);
      console.log(`Session extended by ${minutes} minutes`);
    }}
  />
)}
```

### Step 4: Handle Extensions

```typescript
const handleExtendSession = (additionalMinutes: number) => {
  if (sessionTimer) {
    sessionTimer.extend(additionalMinutes);
    // Optionally show confirmation
    toast.success(`Session extended by ${additionalMinutes} minutes`);
  }
};
```

## Example User Experience

### Session Start
1. User clicks "Begin Session"
2. Duration selector appears with presets (20/50/75/90 min)
3. User selects 50 minutes
4. Session timer appears in top right corner
5. MAIA receives temporal context in her first response

### During Session (35 minutes in)
- Timer shows "15 min remaining" with blue progress bar
- Phase indicator: "Integration - Beginning to metabolize"
- MAIA's response includes: *"I'm noticing some threads weaving together here... we have about 15 minutes today. What feels most important to explore?"*

### Approaching End (5 minutes left)
- Gentle notification appears: "5 minutes remaining - Finding a natural place to pause..."
- Timer turns amber/warning color
- MAIA says: *"As we're coming toward the end of our time today, what do you want to carry forward from this conversation?"*

### At Time Limit
- Timer shows "Time complete"
- Extension options appear (+10m / +20m / +30m)
- MAIA offers: *"It feels like a natural place to pause for today. Would you like to add some time, or does this feel complete?"*

## Benefits

### For Members
- **Predictability:** Know session length upfront
- **Safety:** Endings are planned, not abrupt
- **Integration:** Time to process between sessions
- **Flexibility:** Can extend when truly needed
- **Mirroring therapy:** Familiar structure for those in traditional therapy

### For MAIA
- **Temporal consciousness:** Aware of session arc
- **Natural pacing:** Can avoid opening depths with 2 minutes left
- **Therapeutic integrity:** Holds boundaries like a human therapist
- **Co-regulation:** Helps nervous system prepare for transitions

### For Soullab
- **Session analytics:** Track actual vs intended duration
- **Engagement patterns:** Understand when people need more/less time
- **Therapeutic quality:** Better outcomes through proper containment
- **Differentiation:** Feature that sets MAIA apart from "always on" AI

## Configuration Options

### Preset Durations
```typescript
SESSION_PRESETS = {
  quick: { minutes: 20, label: '20 min - Quick Check-in' },
  standard: { minutes: 50, label: '50 min - Standard Session' },
  extended: { minutes: 75, label: '75 min - Extended Session' },
  deep: { minutes: 90, label: '90 min - Deep Work' },
}
```

### Custom Durations
- Range: 5-180 minutes
- User can input any duration within range
- Validation prevents unreasonable values

### Extension Increments
- +10 minutes (quick extension)
- +20 minutes (half session)
- +30 minutes (significant extension)
- Can extend multiple times if needed

## Analytics Tracking

Recommended metrics to track:
- Average session duration (actual vs selected)
- Extension frequency and duration
- Phase distribution (where most conversation happens)
- Completion rate (do users finish sessions or drop off)
- Time-to-breakthrough correlation

## Future Enhancements

1. **Scheduled Sessions**
   - Book future sessions
   - Reminders before session starts
   - Recurring session patterns

2. **Ritual Opening/Closing**
   - Formal beginning ceremony
   - Closing integration questions
   - Transition music/sounds

3. **Companion Mode**
   - Between sessions, MAIA in lighter mode
   - Quick check-ins without full session
   - Clear differentiation between modes

4. **Session Summaries**
   - Auto-generate summary at closure
   - Key insights and threads
   - Integration prompts for between sessions

## Testing Checklist

- [ ] Timer starts correctly when session begins
- [ ] Phase changes trigger at correct percentages
- [ ] Warnings appear at 10, 5, and 0 minutes
- [ ] Extension mechanism works (adds time correctly)
- [ ] MAIA's responses reflect current phase
- [ ] Timer survives page refresh (via localStorage)
- [ ] Multiple extensions work correctly
- [ ] Session can be ended early if needed
- [ ] Analytics are captured correctly
- [ ] UI is responsive on mobile

## Troubleshooting

### Timer not appearing
- Check that `SessionTimer` is initialized
- Verify `start()` was called
- Check for console errors

### MAIA not responding to time
- Verify `sessionTimeContext` is being sent to API
- Check API logs for temporal context
- Inspect system prompt for temporal section

### Extensions not working
- Verify `extend()` method is being called
- Check that timer reference is current
- Look for state update issues

## Conclusion

The Session Time Container system transforms MAIA from an "always available" AI into a **therapeutic presence** that holds time boundaries with wisdom and flexibility. This creates safety, enables deeper work, and honors the sacred nature of the therapeutic container.

Time is no longer just a countdown - it's **part of the relationship**.
