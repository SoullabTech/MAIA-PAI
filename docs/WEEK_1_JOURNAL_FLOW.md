# Week 1 Journal Core: Speak → Save → Return

**No mysticism. No therapy speak. Just presence.**

---

## Purpose

- Build trust with the system
- Reduce performance anxiety
- Keep it human, not mystical or clinical

---

## Entry Flow (Plain & Calm)

### 1. Start Screen

**Prompt:**
- "What's on your mind?"
- "Want to get something off your chest?"
- "Say what you need to. No one's judging."

**Options:**
- `Start Writing`
- `Use Voice`

---

### 2. While Speaking or Typing

- No countdowns, no pressure
- Calm UI — neutral tones, slow animations
- Live transcription (optional for voice)
- No labels, no categories — just the user and their words

---

### 3. After Entry

**Save Confirmation:**
- "Saved. You can come back anytime."
- "It's here when you need it."

**Options:**
- `Close`
- `See a Reflection` *(Optional toggle. Never automatic.)*

---

## Optional: Reflection Prompt (Low-Key, No Cringe)

If the user opts in:

- "You mentioned feeling 'on edge.' Want to unpack that later?"
- "Sounds like that was a lot. Want to tag this for next time?"
- "Noticed a recurring word: 'tired'. Anything you want to explore further?"

---

## Week 1 Success Criteria (Internal Design Targets)

- **Feels like a safe room**, not a therapy session
- No pop-psych advice, no metaphors, no "you got this!" cheerleading
- 100% control rests with the user—what they say, what gets saved, whether anything reflects back

---

## What to Test in MVP

- Does a user come back a second time?
- Does anyone click "See a Reflection"?
- Is saving and retrieving frictionless?
- Do users describe it as **calm, private, reliable**?

---

## Technical Implementation Notes

### Database Schema (Minimal)

```sql
-- journal_entries table
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  transcription_raw TEXT, -- if voice
  reflection_shown BOOLEAN DEFAULT false,
  reflection_content TEXT,
  was_saved_raw BOOLEAN DEFAULT false, -- escape hatch used
  created_at TIMESTAMP DEFAULT NOW()
);

-- user_sessions table
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  entries_count INT DEFAULT 0
);
```

### Frontend Components

**StartScreen.tsx**
- Three rotating prompts (not random, sequential)
- Two large buttons: Start Writing / Use Voice
- No other UI elements

**EntryScreen.tsx**
- Full-screen text area OR voice recorder
- Breathing animation in corner (subtle, monochrome)
- Auto-save every 30 seconds (no notification)
- Exit via X button (top right, always visible)

**SaveConfirmation.tsx**
- Full-screen fade-in
- Single line of text: "Saved. You can come back anytime."
- Two buttons: Close / See a Reflection
- Auto-dismiss after 5 seconds if no interaction

**ReflectionScreen.tsx** (only if opted in)
- Simple text display
- Single question/observation
- No action required
- Close button prominent

---

## Voice Capture Behavior

### Pause Detection
- 2-3 second silence = pause (continue recording)
- 5 second silence = likely finished (prompt: "Done?" or continue)
- No automatic cutoff

### Breathing Animation During Pauses
- Gentle fade in/out (1-2 second cycle)
- Never blinks/flickers
- Slows during longer pauses (not speeds up)
- Color: neutral gray, not blue (blue = "processing")

### Transcription
- Live transcription shown below voice waveform
- Edit-in-place after recording ends
- User can accept or re-record

---

## Escape Hatch: "Just Save My Words"

**When to Show:**
- Never on first entry
- After 3rd entry: small text link appears: "Skip reflection, just save"
- If clicked: sets `was_saved_raw = true`, skips reflection prompt
- If used 2+ times in a row: becomes default (can re-enable reflection in settings)

**Why This Matters:**
- Some days people just need to vent
- Forcing reflection = therapy, not journaling
- Trust means respecting "not today"

---

## What We're NOT Building (Week 1)

- Tagging
- Elemental mapping
- Pattern visualization
- Search
- Sharing
- Analytics beyond basic counts
- Mood tracking
- Prompts beyond start screen
- Notifications
- Reminders
- Streaks
- Gamification of any kind

---

## Success Metrics (Week 1 Only)

**Quantitative:**
- Return rate (did they come back for 2nd entry?)
- Average session length
- Reflection opt-in rate
- Escape hatch usage rate

**Qualitative:**
- User survey: "Did you feel heard?"
- User survey: "Did pauses feel spacious or awkward?"
- User survey: "Would you return?"

**Red Flags:**
- <30% return for 2nd entry
- >20% escape hatch usage in first 3 sessions
- Voice capture failures (transcription errors)
- Users describing it as "pushy" or "like therapy"

---

## The Core Test

**If the journal doesn't pass this test, nothing else matters:**

> A user journals once. Three days later, something hard happens. Do they think of MAIA?

If no → the presence loop is broken.

If yes → you have the foundation.

Everything else is just architecture.
