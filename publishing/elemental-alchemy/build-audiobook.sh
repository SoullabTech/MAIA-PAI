#!/bin/bash

# Elemental Alchemy Audiobook Script Builder
# Generates narrator script with chapter markers, pronunciation guides, and timing notes

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SOURCE_FILE="$SCRIPT_DIR/source/manuscript.md"
OUTPUT_DIR="$SCRIPT_DIR/formats/audiobook"
SCRIPT_FILE="$OUTPUT_DIR/narrator-script.md"
TIMING_FILE="$OUTPUT_DIR/timing-estimate.txt"
PRONUNCIATION_FILE="$OUTPUT_DIR/pronunciation-guide.md"

echo "🎙️  Building Audiobook Script for Elemental Alchemy..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# ============================================
# Process manuscript for narration
# ============================================

echo "📝 Processing manuscript for narration..."

# Create narrator script with production notes
cat > "$SCRIPT_FILE" << 'HEADER'
# ELEMENTAL ALCHEMY
## Narrator Script with Production Notes

**Book**: Elemental Alchemy: The Ancient Art of Living a Phenomenal Life
**Author**: Kelly Nezat
**Narrator**: [TBD]
**Producer**: Soullab Media

---

## PRODUCTION NOTES FOR NARRATOR

### Tone and Style
- **Overall Tone**: Warm, contemplative, inviting
- **Pacing**: Measured and present. Allow space for reflection.
- **Energy**: Grounded wisdom with moments of inspiration
- **Voice**: Like a wise friend sharing sacred knowledge over tea

### Special Sections
1. **Quotes**: Slight pause before and after. Reverent tone.
2. **Chapter Openings**: Set the energy. Take your time.
3. **Practices/Exercises**: Instructional yet gentle. Guide, don't command.
4. **Elemental Descriptions**: Embody the element's quality:
   - Fire: Warm, animated, inspiring
   - Water: Flowing, emotional, deep
   - Earth: Grounded, solid, nurturing
   - Air: Light, clear, intellectual
   - Aether: Transcendent, spacious, unifying

### Breath and Pauses
- **[pause]** = 1 second pause
- **[long pause]** = 2-3 seconds (for chapter transitions, major insights)
- **[breath]** = Natural breath point, emphasize the silence

### Pronunciation Guide
See `pronunciation-guide.md` for special terms

---

HEADER

# Append processed manuscript
# Strip markdown syntax that isn't needed for audio
# Add production notes for special sections

cat "$SOURCE_FILE" | \
  sed 's/^# \(.*\)$/\n\n[CHAPTER MARKER] \1\n[long pause]\n\n\1\n/g' | \
  sed 's/^## \(.*\)$/\n[pause]\n\n\1\n/g' | \
  sed 's/^### \(.*\)$/\n\1\n/g' | \
  sed 's/\*\*\([^*]*\)\*\*/\1/g' | \
  sed 's/\*\([^*]*\)\*/\1/g' | \
  sed 's/^> \(.*\)$/\n[QUOTE - reverent tone]\n[pause]\n\1\n[pause]/g' \
  >> "$SCRIPT_FILE"

echo "✅ Narrator script created"

# ============================================
# Create Pronunciation Guide
# ============================================

cat > "$PRONUNCIATION_FILE" << 'EOF'
# PRONUNCIATION GUIDE
## Elemental Alchemy Audiobook

### Key Terms

**Alchemy**
- al-kuh-mee
- Emphasis on first syllable

**Aether** (also Ether)
- EE-ther
- Not "ay-ther"

**Spiralogic**
- spy-RAL-oh-jik
- Emphasis on second syllable

**Calcinatio**
- kal-sin-AH-tee-oh
- Latin alchemical term for "burning away"

**Solutio**
- soh-LOO-tee-oh
- Latin for "dissolution"

**Coagulatio**
- koh-ag-yoo-LAH-tee-oh
- Latin for "crystallization"

**Sublimatio**
- sub-lih-MAH-tee-oh
- Latin for "elevation"

**Coniunctio**
- kon-yunk-TEE-oh
- Latin for "union"

**Prima Materia**
- PREE-mah mah-TAIR-ee-ah
- Latin for "first matter"

**Alembic**
- ah-LEM-bik
- Alchemical distillation vessel

**Quintessence**
- kwin-TESS-ence
- "Fifth essence" = Aether

### Philosophical Names & Terms

**Iain McGilchrist**
- EE-an mik-GIL-krist
- Contemporary philosopher/psychiatrist

**Carl Jung**
- Carl YOONG (not "jung")
- Swiss psychologist

**Hermes Trismegistus**
- HUR-meez tris-muh-JIST-us
- Legendary author of Hermetic texts

**Paracelsus**
- pair-uh-SELL-sus
- Renaissance alchemist/physician

**Torus**
- TOR-us
- Donut-shaped geometric form

**Dodecahedron**
- doh-dek-uh-HEE-dron
- 12-sided Platonic solid

**Fibonacci**
- fee-boh-NAH-chee
- Italian mathematician

### Names (if mentioned)

**Kelly Nezat**
- NEZZ-at (rhymes with "fez at")

### Reading Notes

- Take your time with Latin terms
- Let the geometry terms breathe
- When in doubt, emphasize meaning over perfect pronunciation
- The transmission is more important than technical precision

EOF

echo "✅ Pronunciation guide created"

# ============================================
# Estimate Timing
# ============================================

echo "⏱️  Calculating timing estimates..."

# Count words
WORD_COUNT=$(wc -w < "$SOURCE_FILE" | tr -d ' ')

# Average audiobook narration: 150-160 words per minute
# We'll use 155 as middle ground
WPM=155

# Calculate minutes
TOTAL_MINUTES=$((WORD_COUNT / WPM))
HOURS=$((TOTAL_MINUTES / 60))
MINUTES=$((TOTAL_MINUTES % 60))

# ACX audiobook requirements:
# - Minimum 15 minutes for listing
# - Opening credits: 10-30 seconds
# - Closing credits: 30 seconds - 5 minutes
# - Each audio file should be < 120 minutes

cat > "$TIMING_FILE" << EOF
ELEMENTAL ALCHEMY - AUDIOBOOK TIMING ESTIMATE
══════════════════════════════════════════════════════════

MANUSCRIPT STATISTICS:
----------------------
Total Words: $(printf "%'d" $WORD_COUNT)
Narration Speed: $WPM words per minute (professional average)

ESTIMATED RUNTIME:
------------------
Total Time: ${HOURS} hours, ${MINUTES} minutes
Plus Credits: ~1-2 minutes (opening + closing)

FINAL RUNTIME: ~${HOURS}:$(printf "%02d" $MINUTES):00

CHAPTER BREAKDOWN:
------------------
[TO BE CALCULATED after chapter splits]

Recommended structure:
- Opening Credits (30 seconds)
- Part 1: Introduction + Philosophy (Est. X hours)
- Part 2: Fire Element (Est. X hours)
- Part 3: Water Element (Est. X hours)
- Part 4: Earth Element (Est. X hours)
- Part 5: Air Element (Est. X hours)
- Part 6: Aether Element (Est. X hours)
- Part 7: Living the Process (Est. X hours)
- Closing Credits (1 minute)

PRODUCTION NOTES:
-----------------
✓ Professional narration at 155 WPM
✓ Allow natural pauses and breath
✓ Each file should be under 120 minutes
✓ Minimum quality: 192 kbps MP3 or FLAC

ACX/AUDIBLE REQUIREMENTS:
-------------------------
□ Audio Format: MP3 or FLAC
□ Bitrate: 192 kbps (minimum)
□ Sample Rate: 44.1 kHz
□ Channels: Mono or Stereo
□ Peak level: -3dB
□ RMS level: -18dB to -23dB
□ Noise floor: -60dB or lower
□ Room tone: Required at start/end

DISTRIBUTION PLATFORMS:
-----------------------
1. Audible (via ACX)
2. Apple Books Audiobooks
3. Google Play Audiobooks
4. Audiobooks.com
5. Soullab Direct (Genesis platform)

COST ESTIMATES:
---------------
Professional Studio Recording:
- \$200-400 per finished hour = ~\$${HOURS}00-\$${HOURS}00 total

Narrator Rates:
- Professional: \$100-400/hour
- Premium: \$400-1000/hour

Alternative: AI Narration
- ElevenLabs Premium: ~\$22/hour of audio
- Total cost: ~\$$(($HOURS * 22))

REVENUE SHARING (ACX):
----------------------
Option 1: Royalty Share (50/50 split, no upfront cost)
Option 2: Pay for Production (You keep 40% royalty)
Option 3: Pay Plus (Upfront + 20% royalty share)

SOULLAB RECOMMENDATION:
-----------------------
Produce in-house using premium AI + human editor
- Narrate with ElevenLabs (cloned voice of Kelly or professional narrator)
- Human editor for quality control and emotion
- Retain 95% royalty on Soullab platform
- Standard royalty on other platforms

EOF

echo "✅ Timing estimate created"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Audiobook script build complete!"
echo ""
echo "📝 Narrator Script: $SCRIPT_FILE"
echo "📚 Pronunciation Guide: $PRONUNCIATION_FILE"
echo "⏱️  Timing Estimate: $TIMING_FILE"
echo ""
echo "Estimated Runtime: ${HOURS} hours, ${MINUTES} minutes"
echo ""
echo "Next steps:"
echo "  1. Review narrator script for accuracy"
echo "  2. Select narrator (human or AI)"
echo "  3. Record sample chapter for testing"
echo "  4. Refine pacing and tone"
echo "  5. Record full audiobook"
echo "  6. Professional editing and mastering"
echo "  7. Submit to ACX/Audible for review"
echo ""
