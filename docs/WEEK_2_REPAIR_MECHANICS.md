# Week 2: Repair Mechanics

**Purpose:** Test if co-creation feels natural, not forced.

**The Single Question:** Can users correct MAIA without it feeling like training a dumb bot?

---

## Design Principle: Repair as Ritual, Not Correction

> "If it feels like debugging, the spell is broken."

**The goal:** Users should feel like they're teaching **a trusted tool** how to speak *their language*, not training a model.

**Psychological insight:** Repair is the highest form of trust in relational systems. Letting users teach without shame or friction builds *intimacy*, not just utility.

**What this means:**
- Corrections should feel like clarification in conversation
- Not debugging
- Not model training
- Not fixing something broken

---

## Why Week 2 Isn't About Classification

Users haven't established basic trust yet. They need to know MAIA can be corrected before they'll trust her with interpretation.

**Elements require:**
1. Learning a symbolic system
2. Trusting you with interpretation
3. Seeing patterns over time

**Week 2 requires:**
1. Proving MAIA can admit uncertainty
2. Proving feedback is welcomed not defensive
3. Proving corrections don't break the experience

---

## UX Micro-Patterns for Co-Creation

### The Correction Ritual

**Subtle prompt after reflection:**
> "Did this miss the mark?"
> Options: `Yes` / `Close` / `Rephrase it with me`

**MAIA's response when corrected:**
> "Got it. Want me to say it back in your words?"
> *(User edits or types suggestion)*
> "Noted. I'll remember how to speak your way."

**What happens behind the scenes:**
- Flagged prompts become future style calibration (invisible, trust-based)
- No visible model training, thresholds, or word clouds
- User never sees "training in progress" or "model updated"

### Anti-Patterns to Avoid

**❌ Don't:**
- Force rating systems (1-5 stars, "How helpful was this?")
- Show visible model training indicators
- Suggest "better" language unless user asks
- Apologize excessively ("I'm so sorry I got it wrong!")
- Make correction feel like a form to fill out

**✅ Do:**
- Make correction feel conversational
- Treat each correction as learning user's dialect
- Keep it brief (one exchange, then move on)
- Leave exit ramps at every step

---

## Week 2 Features (3 Max)

### 1. One Uncertainty Response

**When to Trigger:**
- Confidence score <60% on any interpretation
- Not trying to guess elements yet
- Just admitting limitation

**Example Responses:**
- "I might be missing something here..."
- "I'm not quite sure what this meant for you."
- "There's more to this than I'm catching."

**What NOT to do:**
- Don't guess ("Is this about [X]?") - too presumptuous
- Don't apologize excessively ("Sorry! So sorry!") - creates guilt
- Don't explain why you're uncertain - just admit it

---

### 2. Thumbs Up/Down

**When to Show:**
- Post-save only (never interrupt the writing flow)
- Small, subtle placement (not a modal)
- Optional - can be ignored completely

**UI Placement:**
- Below save confirmation
- Monochrome icons (not green/red - too strong)
- Single line text: "Did this feel right?"

**What It Does:**
- Stores signal (`user_feedback` table: entry_id, feedback_type, timestamp)
- No immediate action
- No notification
- No "thanks for feedback!" cheerleading

**Success Metric:**
- 30-40% engagement rate
- If <20%: too hidden
- If >60%: might be too prominent/guilt-inducing

---

### 3. One Correction Opportunity

**Trigger:**
- Only if thumbs down clicked
- Appears inline (not new screen)
- Simple text input

**Prompt:**
- "Want to tell me what I missed?"
- Not "What went wrong?" (too problem-focused)
- Not "Help me understand" (too needy)

**User Input:**
- Free text response
- No required fields
- No character limit
- Can skip entirely

**What Happens:**
- Text saved to `corrections` table
- No processing yet (Week 3-4)
- No confirmation beyond save
- Entry remains unchanged

**What to Avoid:**
- Acting on corrections immediately (shows you weren't listening the first time)
- Asking clarifying questions (creates work)
- Offering multiple choice options (restricts expression)

---

## Database Schema Additions

```sql
-- Week 2 additions to existing schema

-- Add to journal_entries table
ALTER TABLE journal_entries ADD COLUMN confidence_score DECIMAL(3,2);
ALTER TABLE journal_entries ADD COLUMN showed_uncertainty BOOLEAN DEFAULT false;

-- New feedback table
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY,
  entry_id UUID NOT NULL REFERENCES journal_entries(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  feedback_type VARCHAR(20) NOT NULL, -- 'thumbs_up' or 'thumbs_down'
  created_at TIMESTAMP DEFAULT NOW()
);

-- New corrections table
CREATE TABLE corrections (
  id UUID PRIMARY KEY,
  entry_id UUID NOT NULL REFERENCES journal_entries(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  correction_text TEXT NOT NULL,
  correction_type VARCHAR(50), -- will be used in Week 3+
  was_acknowledged BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for retrieval
CREATE INDEX idx_corrections_user ON corrections(user_id, created_at DESC);
CREATE INDEX idx_feedback_entry ON user_feedback(entry_id);
```

---

## Week 2 Flow Updates

### Modified Entry Flow

**After Save:**
1. "Saved. You can come back anytime."
2. [2 second pause]
3. Small icons appear: 👍 👎
4. Text: "Did this feel right?" (8pt gray text)
5. If ignored: fade out after 5 seconds
6. If thumbs up: icons disappear, done
7. If thumbs down: correction prompt appears

**Correction Flow:**
1. Thumbs down clicked
2. Text input appears inline
3. "Want to tell me what I missed?"
4. User types or skips
5. If typed: save to corrections table
6. No confirmation, just fade out
7. Return to journal home

**Uncertainty Flow:**
1. During save (if confidence <60%)
2. Save confirmation still shows first
3. Below it: "I might be missing something here..."
4. Thumbs already visible
5. Slightly higher engagement expected on uncertain entries

---

## The Hidden Tests in Week 2

Beyond the obvious 30% engagement metric, watch for:

**Correction specificity:**
- ✅ Good: "You missed the fear underneath the anger"
- ⚠️ Vague: "Wrong feeling"
- ❌ Meta: "You need better AI"

**Return rate after correction:**
- Do they trust MAIA more or less after correcting?
- Does correction increase intimacy or create distance?
- Track: sessions_after_first_correction vs baseline

**Correction fatigue onset:**
- When does the first user stop bothering to correct?
- Is it after 1 correction? 5? 20?
- Do they stop because it worked or because it felt futile?

**Emotional tone of corrections:**
- Collaborative: "I think you meant..."
- Frustrated: "No, that's not it at all"
- Teaching: "For me, X actually means Y"

**The core question:** Do corrections feel like bonding or babysitting?

---

## What We're Testing

### Quantitative Signals
- **Feedback rate:** 30-40% of entries get thumbs
- **Correction rate:** 10-20% of thumbs-down get text
- **Uncertainty correlation:** Do uncertain entries get more feedback?
- **Return rate after correction:** Does giving feedback reduce returns?

### Qualitative Signals
- **Correction specificity:** Are users saying useful things?
  - ✅ Good: "You missed the fear underneath"
  - ❌ Vague: "Wrong"
  - ❌ Meta: "You need better AI"
- **Tone of corrections:** Collaborative or frustrated?
- **Correction length:** <20 words = natural, >100 words = friction

### Red Flags
- **<20% feedback rate:** Buttons too hidden or users don't care
- **>5% correction text is angry:** Something's broken in expectation-setting
- **Drop in return rate after correcting:** Correction flow is punishing
- **Corrections are all "idk wrong":** Users don't know what to say

---

## Week 2 Success Criteria

**Quantitative:**
- 30% of entries receive feedback (thumbs)
- 15% of thumbs-down include correction text
- Return rate after correction ≥85% of baseline
- Uncertainty entries get 1.5x more feedback than certain

**Qualitative:**
- Corrections are specific and actionable
- Users use collaborative language ("missed" not "wrong")
- No interview feedback about "training a bot"

**Behavioral:**
- Users correct without leaving the journal
- Corrections don't disrupt flow (measured by time-to-next-entry)
- Some users skip thumbs entirely and still return (optional nature preserved)

---

## What We're NOT Building Yet

### Week 3-4 Territory:
- Acting on corrections
- Showing MAIA learned
- Elemental tagging (optional self-tagging might start here)
- Pattern recognition

### Week 5-6 Territory:
- MAIA suggesting elements
- Showing consistency over time
- Memory references ("Last time you said...")

### Week 8+ Territory:
- Entry clustering
- Search
- Pattern visualization
- Anything interpersonal

---

## Implementation Notes

### Confidence Scoring (MVP)

Since you don't have patterns yet, confidence is based on:

**Ambiguity indicators:**
- Multiple emotional words with different valences
- Contradictory statements ("I'm fine but...")
- Abstract language without concrete examples
- Questions posed in the entry

**Initial scoring formula:**
```javascript
function calculateConfidence(entry) {
  let confidence = 0.8; // start optimistic

  // Reduce confidence for ambiguity
  if (hasContradictions(entry)) confidence -= 0.3;
  if (hasMultipleEmotions(entry)) confidence -= 0.2;
  if (isAbstract(entry)) confidence -= 0.1;
  if (hasQuestions(entry)) confidence -= 0.1;

  return Math.max(0.2, confidence); // floor at 0.2
}
```

**This is crude on purpose.** You're testing if users engage with uncertainty, not perfecting classification.

### Feedback UI Component

```typescript
// FeedbackPrompt.tsx
interface FeedbackPromptProps {
  entryId: string;
  showUncertainty: boolean;
}

export function FeedbackPrompt({ entryId, showUncertainty }: FeedbackPromptProps) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [showCorrectionInput, setShowCorrectionInput] = useState(false);

  if (feedbackGiven && !showCorrectionInput) return null;

  return (
    <div className="feedback-container">
      {showUncertainty && (
        <p className="uncertainty-note">I might be missing something here...</p>
      )}

      {!feedbackGiven && (
        <>
          <p className="feedback-prompt">Did this feel right?</p>
          <div className="thumbs-container">
            <button onClick={() => handleThumbsUp(entryId)}>👍</button>
            <button onClick={() => handleThumbsDown(entryId)}>👎</button>
          </div>
        </>
      )}

      {showCorrectionInput && (
        <CorrectionInput
          entryId={entryId}
          onSubmit={() => setShowCorrectionInput(false)}
        />
      )}
    </div>
  );
}
```

### Correction Input Component

```typescript
// CorrectionInput.tsx
interface CorrectionInputProps {
  entryId: string;
  onSubmit: () => void;
}

export function CorrectionInput({ entryId, onSubmit }: CorrectionInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    if (text.trim()) {
      await saveCorrection(entryId, text);
    }
    onSubmit();
  };

  return (
    <div className="correction-input">
      <p>Want to tell me what I missed?</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Optional..."
        rows={3}
      />
      <div className="button-row">
        <button onClick={onSubmit}>Skip</button>
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
}
```

---

## The Core Test

**If Week 2 doesn't pass this test, Week 3+ won't matter:**

> A user gets thumbs down feedback prompt. They type a correction. The next time something hard happens, do they still think of MAIA?

If no → repair feels like work, not collaboration.

If yes → you've proven co-creation can be natural.

---

## Next: Week 3-4 Candidates

**Once Week 2 metrics hit targets:**
- Acknowledge corrections ("Still learning your language...")
- Optional self-tagging (user picks element, not MAIA)
- Show MAIA remembered previous corrections

**Do not proceed to Week 3 until:**
- Correction text is specific 70%+ of the time
- Return rate after correction ≥85%
- No "training a bot" feedback in interviews
