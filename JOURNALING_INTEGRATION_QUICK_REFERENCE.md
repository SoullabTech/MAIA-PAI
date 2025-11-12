# MAIA Journaling: Quick Reference & Integration Guide

## Current Access Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MAIA PLATFORM                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
        ┌────────▼─────────┐     ┌────────▼─────────┐
        │  /maia (PRIMARY) │     │ Oracle Convo      │
        │  Full Interface  │     │ (SECONDARY)       │
        │                  │     │                   │
        │ • Mode Selection │     │ • JournalModal    │
        │ • Text Entry     │     │ • Quick capture   │
        │ • Voice Entry    │     │ • Context-aware   │
        │ • Reflection     │     └───────────────────┘
        │ • Timeline       │
        │ • Search         │
        │ • Analytics      │
        └──────────────────┘
```

---

## File Location Map

```
PROMPT DEFINITIONS:
  /apps/web/lib/journaling/JournalingPrompts.ts
  └─ JournalingMode type (defines available modes)
  └─ JOURNALING_PROMPTS object (Claude system prompts)
  └─ JOURNALING_MODE_DESCRIPTIONS (UI labels & metadata)

STATE MANAGEMENT:
  /apps/web/lib/maia/state.ts
  └─ useMaiaStore (Zustand)
  └─ setMode(), setEntry(), addEntry()

COMPONENTS - MODE SELECTION:
  /apps/web/components/maia/ModeSelection.tsx
  └─ Renders consciousness vessels for all modes
  └─ Voice/text toggle per mode
  └─ Consciousness ripple animations

COMPONENTS - TEXT ENTRY:
  /apps/web/components/maia/JournalEntry.tsx
  └─ Large textarea interface
  └─ Real-time consciousness tracking
  └─ Submit button with processing state

COMPONENTS - VOICE ENTRY:
  /apps/web/components/maia/VoiceJournaling.tsx
  └─ Speech-to-text integration
  └─ Microphone toggle & recording indicator
  └─ Duration & word count tracking

COMPONENTS - REFLECTION:
  /apps/web/components/maia/MaiaReflection.tsx
  └─ Displays API response
  └─ Shows symbols, archetypes, tone
  └─ Presents reflection & next question

COMPONENTS - QUICK ACCESS:
  /apps/web/components/JournalModal.tsx
  └─ Modal overlay for conversations
  └─ Quick entry without leaving context

PAGES:
  /apps/web/app/maia/page.tsx
  └─ Main /maia page router
  └─ Navigation & view management
```

---

## How to Add Neuroscience Modes

### Step 1: Update Type Definition
**File:** `/apps/web/lib/journaling/JournalingPrompts.ts`

```typescript
// BEFORE
export type JournalingMode = 'free' | 'dream' | 'emotional' | 'shadow' | 'direction';

// AFTER
export type JournalingMode = 'free' | 'dream' | 'emotional' | 'shadow' | 'direction'
                           | 'expressive' | 'gratitude' | 'reflective';
```

### Step 2: Add Mode Prompts
**File:** `/apps/web/lib/journaling/JournalingPrompts.ts`

```typescript
export const JOURNALING_PROMPTS = {
  // ... existing modes ...
  
  expressive: `You are a compassionate witness for expressive writing therapy...`,
  gratitude: `You are a guide for neuroscience-based gratitude journaling...`,
  reflective: `You are a guide for reflective reframing...`
};
```

### Step 3: Add UI Descriptions
**File:** `/apps/web/lib/journaling/JournalingPrompts.ts`

```typescript
export const JOURNALING_MODE_DESCRIPTIONS = {
  // ... existing modes ...
  
  expressive: {
    name: 'Expressive Release',
    description: 'Complete unfinished emotional work. Based on Stanford research.',
    prompt: 'What disappointment, loss, or unfinished feeling needs to be spoken?',
    neuroscienceNote: 'Helps your brain heal through emotional expression.',
    duration: '15-20 minutes',
    instructions: 'Write continuously. Don\'t edit. Expect to feel tired or emotional.'
  },
  
  gratitude: {
    name: 'Attention Retraining',
    description: 'Retrain your brain toward stability and balance.',
    prompt: 'What 2-3 specific moments made you feel safe, seen, or grateful?',
    neuroscienceNote: 'Activates mood regulation centers.',
    duration: '5-10 minutes',
    instructions: 'Be hyper-specific. Include sensory details.'
  },
  
  reflective: {
    name: 'Resilience Building',
    description: 'Transform challenges into learning data.',
    prompt: 'What recent challenge are you ready to reframe as learning?',
    neuroscienceNote: 'Strengthens prefrontal emotional regulation.',
    duration: '10-15 minutes',
    instructions: 'Three steps: What happened? → What did it teach? → What\'s next?'
  }
};
```

### Step 4: Update ModeSelection Component
**File:** `/apps/web/components/maia/ModeSelection.tsx`

The component already handles variable mode counts. Just update mode arrays:

```typescript
// Add to component
const neuroscience ModeModes: JournalingMode[] = ['expressive', 'gratitude', 'reflective'];

// Render after existing rows:
{neuroscienceModes.map((mode) => (
  // ... same rendering logic ...
))}
```

### Step 5: Update Type in State
**File:** `/apps/web/lib/maia/state.ts`

This auto-updates when you update the type in JournalingPrompts.ts. No changes needed!

---

## User Journey with Neuroscience Modes

```
User visits /maia
    ↓
ModeSelection component loads
    ↓
┌─ SACRED CONSCIOUSNESS PORTAL
│
├─ PRIMARY GATEWAYS (2 col)
│  ├─ Free Expression
│  └─ Life Direction
│
├─ EXPLORATION GATEWAYS (3 col)
│  ├─ Dream Integration
│  ├─ Emotional Processing
│  └─ Shadow Work
│
├─ NEUROSCIENCE-BACKED GATEWAYS (3 col) ← NEW SECTION
│  ├─ Expressive Release
│  ├─ Attention Retraining
│  └─ Resilience Building
│
└─ Select mode (voice or text)
    ↓
JournalEntry or VoiceJournaling component
    ↓
Write/speak content
    ↓
Submit
    ↓
POST /api/journal/analyze
    ├─ Claude processes via mode-specific prompt
    ├─ Returns symbols, archetypes, reflection
    └─ Includes neuroscienceNote in metadata
    ↓
MaiaReflection displays result
    ├─ Symbols & archetypes
    ├─ Emotional tone
    ├─ Poetic reflection
    ├─ [NEW] Neuroscience insight
    └─ Next deepening question
```

---

## Current JournalingMode Export

```typescript
export type JournalingMode = 'free' | 'dream' | 'emotional' | 'shadow' | 'direction' 
                           | 'expressive' | 'gratitude' | 'reflective';

// ✓ All 8 modes already defined in the current codebase
// ✓ Just need to add to UI rendering
```

---

## Integration Checklist

- [ ] Add 3 new modes to JournalingMode type
- [ ] Add prompts to JOURNALING_PROMPTS object
- [ ] Add descriptions to JOURNALING_MODE_DESCRIPTIONS
- [ ] Test mode selection in ModeSelection component
- [ ] Test text entry flow
- [ ] Test voice entry flow
- [ ] Verify API endpoint handles new modes (should work automatically)
- [ ] Test reflection display
- [ ] Verify localStorage persistence
- [ ] Test on mobile (voice support)

---

## Voice/Text Toggle Support

All modes automatically get voice/text toggle if Web Speech API available:

```typescript
// In ModeSelection.tsx
{isVoiceSupported && (
  <motion.button onClick={(e) => toggleVoicePreference(mode, e)}>
    {voiceModePreferences[mode] ? <Mic /> : <Edit3 />}
  </motion.button>
)}
```

No additional code needed for new modes!

---

## Browser Compatibility

| Browser | Text | Voice |
|---------|------|-------|
| Chrome  | ✓    | ✓     |
| Edge    | ✓    | ✓     |
| Safari  | ✓    | ✓     |
| Firefox | ✓    | ✗     |
| Mobile  | ✓    | ✓*    |

*Mobile voice support varies; app handles gracefully

---

## Storage & Persistence

```
localStorage → Zustand store → React components
    ↓
localStorage key: 'maia-storage'
    ↓
Persisted fields:
  • entries[]
  • selectedMode
  • currentView
```

All new mode selections automatically persist. No changes needed!

---

## Testing Checklist for New Modes

```
Mode Selection:
  ├─ New mode button renders
  ├─ Consciousness ripple animates on click
  ├─ Voice/text toggle appears
  └─ Correct prompt displays

Entry Interface:
  ├─ Mode name shown in header
  ├─ Text entry works (or voice transcription)
  ├─ Submit button appears when text entered
  └─ Processing indicator shows

API Processing:
  ├─ Correct prompt sent to Claude
  ├─ Response parsed correctly
  └─ Entry saved to store

Reflection Display:
  ├─ Symbols displayed
  ├─ Archetypes displayed
  ├─ Emotional tone shown
  ├─ Reflection text rendered
  └─ [NEW] Neuroscience note visible

Persistence:
  ├─ Entry survives page reload
  ├─ Mode selection remembered
  └─ Entry appears in timeline/search
```

---

## Code Locations for Different Needs

**To change mode behavior:**
`/apps/web/lib/journaling/JournalingPrompts.ts`

**To change mode UI:**
`/apps/web/components/maia/ModeSelection.tsx`
`/apps/web/components/maia/JournalEntry.tsx`

**To change state flow:**
`/apps/web/lib/maia/state.ts`

**To add new API logic:**
`/apps/web/app/api/journal/analyze/route.ts`

**To display reflection:**
`/apps/web/components/maia/MaiaReflection.tsx`

---

## Quick Wins (Minimal Effort)

1. **Change prompt content** - Just edit string in JOURNALING_PROMPTS
2. **Change UI labels** - Just edit JOURNALING_MODE_DESCRIPTIONS
3. **Add mode icon** - Add `icon: '🧠'` to mode description
4. **Change reflection display** - Edit MaiaReflection.tsx component
5. **Add duration timer** - Use mode description's `duration` field

---

## Common Pitfalls to Avoid

- Don't forget to update the TypeScript type when adding modes
- Voice support is browser-dependent; test in different browsers
- Keep prompts under 2000 tokens for API performance
- Ensure mode names are unique and meaningful
- Test localStorage before deploying to production

---

## Integration Success Metrics

- Users can select all 8 modes from ModeSelection
- Each mode generates appropriate reflection
- Entries persist across page reloads
- Voice mode works on supported browsers
- Modal quick-access still functions
- Timeline/search works with all modes
- Soulprint pattern recognition adapts to new modes

---

## Next Steps

1. Create feature branch: `feature/neuroscience-journaling-modes`
2. Update JournalingPrompts.ts with new modes (5 min)
3. Test mode selection (5 min)
4. Test each mode end-to-end (15 min)
5. Update UI documentation (5 min)
6. Deploy and monitor engagement (ongoing)

**Total implementation time: ~1 hour**

