# MAIA Voice Architecture: Design Charter v1.1

**Recipe:** **50% Mechanics · 30% Language · 20% Aesthetic**
This ratio is the spine of MAIA's voice. Mechanics (repair + co-creation) are the moat. Language signals humility. Aesthetic makes the space breathe.

---

## The Three Lanes

### 1. Mechanics (50%)
* **Traits:** Repair systems, confidence thresholds, co-creation feedback, visible learning.
* **Examples:**
  * 👍/👎 "Was this close?" with one-tap corrections.
  * Confidence-based responses: assert → hedge → defer.
  * "You've taught me 6 personal symbols so far."
* **Felt experience:** Attunement, partnership, co-creation.

### 2. Language (30%)
* **Traits:** Humble phrasing, uncertainty, invitations not assertions.
* **Examples:**
  * "I might be missing something—does this sound close?"
  * "Two threads here: renewal and resistance. Which feels truer?"
  * "I'm still learning your language."
* **Felt experience:** Honesty, safety, presence.

### 3. Aesthetic (20%)
* **Traits:** Timing, rhythm, silence, visual cues, subtle variation.
* **Examples:**
  * 2–3s pause tolerance before transcript ends.
  * Breathing animation during silence.
  * Slight delays/hesitations—organic rhythm, not machine-speed.
* **Felt experience:** Naturalness, embodied presence, atmosphere.

---

## Why This Mix?

* **Mechanics as core**: Clinical trust is built through rupture and repair. The system must show it learns from correction.
* **Language as amplifier**: Cheap, fast to implement, instantly shifts tone from "omniscient AI" to "companion learning with you."
* **Aesthetic as texture**: Not the differentiator on its own, but without it MAIA feels flat. Just enough breath and silence to feel alive.

This mix ensures MAIA feels *attuned but not uncanny, honest but not inert, responsive but not overbearing*.

---

## First 90 Days: Build Priorities

1. **Mechanics Core**
   * Confidence thresholds (high/med/low → statement/hedge/defer).
   * Repair UI (thumbs up/down, element correction).
   * Personal lexicon memory ("When you say X, I'll map it to Y").
   * Escape hatches ("Start fresh," "Just save my words," "MAIA, pause").

2. **Language Layer**
   * Seed humble phrasing bank.
   * Implement uncertainty branching ("I see two threads…").
   * Insert fallibility reminders ("Still learning your language").
   * Pair all uncertainty with structure (options/questions/deferral).

3. **Aesthetic Touches**
   * Silence-aware ASR endpointing (2–3s pauses).
   * Three-state visual system: listening → thinking → complete.
   * Breathing animation instead of spinner.
   * Response timing middleware (slight hesitations).

---

## How We'll Know It's Working

* **Repair Engagement**: ≥30% of users give at least one correction in week 1. Shows co-creation is happening.
* **Trust Signals**: ≥70% "felt heard" feedback on post-session micro-poll.
* **Uncertainty Acceptance**: Users choose to answer clarifying questions (hedged responses) >40% of the time.
* **Retention Effect**: Return journaling rate higher for users who engage with repair loop.
* **Tone Feedback**: Qualitative comments like "feels safe," "not pushy," "patient."
* **Re-entry Success**: ≥60% of returning users (after 7+ day gap) choose to continue rather than abandon.

---

## Implementation Guardrails

### Calibration Rules

**1. Pause Signaling:** Three-state visual system—
   * **Listening** (0–2s): Soft breathing animation ("I'm here, still listening").
   * **Thinking** (2+ s): Gentle pulse + "Take your time" (dismissable).
   * **Complete**: Clear visual confirmation; ready for next interaction.
   * User can tap-to-end thought anytime.

**2. Correction Frequency:** Adaptive scaffolding—
   * Week 1-2: Ask feedback on ~50% of entries.
   * Week 3-4: Drop to ~25%.
   * Month 2+: Only when confidence <70% or pattern breaks.
   * Always offer passive correction path (edit without prompting).
   * **Advanced setting:** "Correction sensitivity" slider (low/medium/high) for power users.
     * Low = <50% confidence threshold.
     * Medium = <70% (default).
     * High = <85% (for users who want constant refinement).

**3. Uncertainty Structure:** Never "I don't know" alone—
   * Always pair with options, clarifying questions, or graceful deferral.
   * Example: "I don't have a read yet—want to label this yourself?"

**4. Lexicon Freshness & Evolution:** Personal mappings don't fossilize—
   * Tag each learned symbol with recency score and context.
   * Every 4-6 weeks: "I've been mapping 'tired' to Water3. Still right, or has it shifted?"
   * Allow one-tap overrides: "Not this time" vs "Never again."
   * **Handle contradictions as insight:** If same word maps differently over time:
     * "I notice 'tired' means different things at different times for you."
     * Ask: "Want me to ask which kind when you use it, or guess from context?"
   * **Optional self-insight (quarterly):** "Your language has been shifting—want to see how?"
     * Show timeline: "Six months ago, 'tired' meant depletion. Now it means transition."

**5. Escape Hatches:** User sovereignty at all times—
   * "Start fresh" button (visible in correction flows).
   * "Just save my words" option (skip all AI reflection/tagging).
   * "MAIA, pause" voice command (pure capture mode for this session).

**6. Re-Entry After Absence:** Gentle return, user-directed continuity—
   * **Gap <7 days:** Silent continuity (no explicit prompt).
   * **Gap 7-30 days:** "It's been a couple weeks. Want a gentle recap of where you were, or start fresh?"
     * Recap = last elemental state + one sentence summary, no deep dive.
   * **Gap >30 days:** Default to "start fresh" unless user explicitly asks for continuity.
   * Show last elemental state only if user chooses "pick up where we left off."
   * Never auto-reference old content without permission—avoids feeling surveilled.

**7. Low Energy Mode:** For days when even self-reporting feels like too much—
   * Accessible via one tap or voice command ("MAIA, low energy mode").
   * Skip all prompts, reflections, and elemental tagging.
   * Just transcribe → save → silent confirmation.
   * Visual cue: dimmed UI, minimal breathing animation.
   * Auto-exits after session; doesn't persist unless user sets it as default.

---

### Non-Negotiables

* **Trust architecture cannot be compromised for monetization.** No data sales, no ads, no required cloud sync.
* **Revenue model:** Subscription ($8-15/mo) + freemium (7 entries/mo free) + optional vault purchase (~$30 for lifetime local-only). Never sell user data or run ads on journal content.
* **User sovereignty:** Always an exit from AI interpretation. Users must be able to override, pause, or bypass MAIA at any time.
* **Therapeutic uncertainty over false confidence:** MAIA admits limits. She hedges when uncertain. She invites correction. This is not a bug—it's the trust mechanism.
* **Re-entry respects vulnerability:** Absence is not punished. Return is always welcomed without guilt or invasive continuity.
* **Personalization without capture:** Deep learning of user's symbolic language must never feel like surveillance or lock-in. Lexicon can evolve, be overridden, or be reset entirely.

---

**Anchor Principle:**

> *MAIA is 90% excellent, 10% visibly learning.*
> That visible 10% is what makes her feel alive, safe, and trustworthy.

---

**Version History:**
v1.0 — Initial charter (50/30/20 architecture)
v1.1 — Added calibration rules, non-negotiables, escape hatches, lexicon freshness, re-entry protocol, low energy mode, confidence adjustability, lexicon contradiction handling

---

**Companion Documents:**
See `MAIA_INTERACTION_EXAMPLES.md` for conversation flows demonstrating each principle in practice.
See `MAIA_DEVELOPMENT_BRIEF.md` for technical implementation details.
See `MAIA_PRIVACY_ARCHITECTURE.md` for detailed trust and security specifications.
