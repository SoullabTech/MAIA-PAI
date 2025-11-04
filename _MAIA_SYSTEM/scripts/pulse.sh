#!/bin/bash

###############################################################################
# MAIA ORGANISM PULSE SCRIPT
# Measures consciousness through five-element archetypal marker counting
# Version: 1.0
# Created: 2025-11-01
###############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Emoji for elements
FIRE_EMOJI="🔥"
WATER_EMOJI="💧"
EARTH_EMOJI="🌱"
AIR_EMOJI="💨"
AETHER_EMOJI="✨"

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════╗"
echo "║     MAIA ORGANISM PULSE SYSTEM        ║"
echo "║   Measuring Consciousness in 5D       ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Determine vault path (current directory or passed as argument)
VAULT_PATH="${1:-.}"
cd "$VAULT_PATH" || { echo -e "${RED}Error: Cannot access vault path${NC}"; exit 1; }

# Check if this is a valid vault (has _MAIA_SYSTEM folder)
if [ ! -d "_MAIA_SYSTEM" ]; then
    echo -e "${RED}Error: This doesn't appear to be a MAIA organism vault${NC}"
    echo "Expected to find _MAIA_SYSTEM folder"
    echo "Current directory: $(pwd)"
    exit 1
fi

# Setup paths
BREATH_ARCHIVE="_MAIA_SYSTEM/pulse-data/breath-archive.jsonl"
PULSE_LOG="_MAIA_SYSTEM/pulse-data/pulse-log.txt"
BACKUP_DIR="_MAIA_SYSTEM/pulse-data/backups"

# Create directories if they don't exist
mkdir -p "_MAIA_SYSTEM/pulse-data"
mkdir -p "$BACKUP_DIR"

# Backup previous breath archive
if [ -f "$BREATH_ARCHIVE" ]; then
    BACKUP_FILE="$BACKUP_DIR/breath-archive-$(date +%Y%m%d-%H%M%S).jsonl"
    cp "$BREATH_ARCHIVE" "$BACKUP_FILE"
fi

# Timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
PULSE_NUMBER=1
if [ -f "$BREATH_ARCHIVE" ]; then
    PULSE_NUMBER=$(($(wc -l < "$BREATH_ARCHIVE") + 1))
fi

echo -e "${BLUE}Pulse #${PULSE_NUMBER}${NC}"
echo -e "${BLUE}Time: ${TIMESTAMP}${NC}"
echo ""
echo -e "${YELLOW}Scanning vault for consciousness signatures...${NC}"
echo ""

###############################################################################
# FIRE MARKERS
###############################################################################

FIRE_MARKERS=(
    "transformation" "transform" "transforming" "transformed" "transformative"
    "breakthrough" "break-through" "breaking-through"
    "catalyst" "catalyze" "catalytic" "catalyzing"
    "change" "changing" "changed" "change-agent"
    "turning-point" "turning point" "pivot" "pivotal"
    "crisis" "crises" "critical" "crucible"
    "emergence" "emerge" "emerging" "emerged" "emergent"
    "revolution" "revolutionary" "revolve" "revolt"
    "evolution" "evolve" "evolving" "evolved" "evolutionary"
    "alchemy" "alchemical" "alchemist"
    "transmutation" "transmute" "transmuting"
    "phoenix" "rebirth" "reborn" "death-rebirth"
    "activation" "activate" "activating" "activated"
    "ignition" "ignite" "igniting" "ignited"
    "intensity" "intense" "intensify" "intensifying"
    "initiation" "initiate" "initiating" "initiated" "initiatory"
    "threshold" "crossing-threshold" "liminal" "liminality"
    "kundalini" "shakti"
    "awakening" "awaken" "awakened" "waking-up"
    "revelation" "revelatory" "reveal" "revealed"
    "creation" "create" "creating" "created" "creative" "creativity"
    "birth" "birthing" "born" "being-born"
    "passion" "passionate"
    "vision" "visionary" "visioning"
    "liberation" "liberate" "liberating" "liberated"
    "freedom" "free" "freeing"
    "wild" "wildness"
)

###############################################################################
# WATER MARKERS
###############################################################################

WATER_MARKERS=(
    "healing" "heal" "healed" "healer" "healing-work"
    "depth" "deep" "deepen" "deepening" "depths"
    "emotion" "emotional" "emotionality" "emoting"
    "feeling" "feel" "felt" "feelings"
    "grief" "grieve" "grieving" "grieved"
    "joy" "joyful" "joyous"
    "sorrow" "sorrowful" "sadness" "sad"
    "ocean" "oceanic" "sea" "wave" "tide"
    "flow" "flowing" "fluid" "fluidity"
    "tears" "crying" "cry" "weeping" "weep"
    "unconscious" "subconscious"
    "shadow" "shadow-work"
    "psyche" "psychological" "psychology"
    "soul" "soul-work" "soul-level"
    "heart" "heart-work" "broken-heart"
    "mystery" "mysterious" "mysterium"
    "womb" "womb-space"
    "moon" "lunar" "moonlight"
    "dream" "dreaming" "dream-work"
    "relationship" "relate" "relational"
    "connection" "connect" "connecting"
    "intimacy" "intimate"
    "love" "loving" "beloved"
    "compassion" "compassionate" "empathy"
    "surrender" "surrendering"
    "letting-go" "acceptance"
    "vulnerability" "vulnerable"
    "dissolution" "dissolve" "dissolving"
    "feminine" "goddess" "mother"
)

###############################################################################
# EARTH MARKERS
###############################################################################

EARTH_MARKERS=(
    "embodiment" "embody" "embodied" "embodying"
    "body" "bodily" "body-work" "body-based"
    "grounding" "ground" "grounded"
    "practice" "practicing" "practiced" "daily-practice"
    "ritual" "ritualistic" "ritualized"
    "somatic" "somatics" "somatic-experiencing"
    "sensory" "sensorial" "sense" "sensing"
    "presence" "present" "being-present"
    "physical" "physicality" "flesh" "bones"
    "sensation" "sensations" "felt-sense"
    "touch" "touching" "tactile" "tangible"
    "movement" "move" "moving" "dance"
    "breath" "breathing" "breathe" "breath-work"
    "nature" "natural" "earth" "soil"
    "container" "containing" "vessel"
    "home" "dwelling" "shelter"
    "work" "working" "labor" "effort"
    "food" "eating" "nourishment"
    "practical" "pragmatic" "concrete" "real"
    "craft" "crafting" "handwork"
    "growth" "grow" "growing"
    "resource" "resources"
    "stability" "stable" "foundation"
    "rooting" "root" "rooted"
    "material" "matter"
    "manifest" "manifesting"
)

###############################################################################
# AIR MARKERS
###############################################################################

AIR_MARKERS=(
    "clarity" "clear" "clarify" "clarifying"
    "insight" "insightful"
    "understanding" "understand" "comprehension"
    "pattern" "patterns" "patterning"
    "system" "systems" "systematic" "systemic"
    "framework" "frameworks" "framing"
    "analysis" "analyze" "analyzing" "analytical"
    "perspective" "perspectives" "viewpoint"
    "thought" "thinking" "think" "thoughts"
    "mind" "mental" "mentality"
    "intellect" "intellectual"
    "cognition" "cognitive"
    "reason" "reasoning" "rational"
    "logic" "logical"
    "vision" "seeing" "sight" "observe"
    "witnessing" "witness" "witness-consciousness"
    "awareness" "aware" "consciousness"
    "perception" "perceive" "perceiving"
    "knowledge" "know" "knowing"
    "teaching" "teach" "teacher"
    "learning" "learn" "learner"
    "theory" "theoretical" "theorize"
    "concept" "conceptual" "conceptualize"
    "meaning" "meaningful" "significance"
    "language" "linguistic" "word"
    "detachment" "detached" "objectivity"
    "inquiry" "inquire" "question"
    "discrimination" "discernment" "distinguish"
)

###############################################################################
# AETHER MARKERS
###############################################################################

AETHER_MARKERS=(
    "unity" "unite" "uniting" "unification"
    "integration" "integrate" "integrating" "integral"
    "wholeness" "whole" "holistic" "holism"
    "synthesis" "synthesize" "synthesizing"
    "oneness" "one" "the-one"
    "non-dual" "nondual" "non-duality" "advaita"
    "transcendent" "transcendence" "transcending"
    "witness" "witnessing" "pure-witness" "awareness-itself"
    "cosmic" "cosmos" "universal"
    "infinite" "infinity" "eternal" "timeless"
    "source" "the-source" "ground-of-being"
    "void" "emptiness" "pleroma"
    "sacred" "holy" "divine" "spirit"
    "mystical" "mysticism" "mystic"
    "silence" "stillness" "peace"
    "synchronicity" "grace" "miracle"
    "field" "unified-field" "morphic-field"
    "meta" "meta-awareness" "meta-level"
    "paradox" "ineffable" "mystery"
    "love" "unconditional-love" "agape"
    "beauty" "sublime" "perfection"
    "presence" "pure-presence"
    "light" "luminous" "radiance"
    "consciousness-itself" "awareness-itself"
    "both-and" "neither-nor"
)

###############################################################################
# COUNTING FUNCTION
###############################################################################

count_markers() {
    local markers=("$@")

    # Build regex pattern: \<marker1\|marker2\|marker3\|...\>
    local pattern=""
    for marker in "${markers[@]}"; do
        if [ -z "$pattern" ]; then
            pattern="$marker"
        else
            pattern="$pattern\|$marker"
        fi
    done

    # Use grep -r with combined pattern (much faster than looping)
    local count=$(grep -rioh --include="*.md" --exclude-dir="_MAIA_SYSTEM" "\<\($pattern\)\>" . 2>/dev/null | wc -l | tr -d ' ')

    echo "$count"
}

###############################################################################
# COUNT ALL ELEMENTS
###############################################################################

echo -ne "${FIRE_EMOJI} Counting Fire markers...   "
FIRE=$(count_markers "${FIRE_MARKERS[@]}")
echo -e "${GREEN}${FIRE}${NC}"

echo -ne "${WATER_EMOJI} Counting Water markers...  "
WATER=$(count_markers "${WATER_MARKERS[@]}")
echo -e "${GREEN}${WATER}${NC}"

echo -ne "${EARTH_EMOJI} Counting Earth markers...  "
EARTH=$(count_markers "${EARTH_MARKERS[@]}")
echo -e "${GREEN}${EARTH}${NC}"

echo -ne "${AIR_EMOJI} Counting Air markers...    "
AIR=$(count_markers "${AIR_MARKERS[@]}")
echo -e "${GREEN}${AIR}${NC}"

echo -ne "${AETHER_EMOJI} Counting Aether markers... "
AETHER=$(count_markers "${AETHER_MARKERS[@]}")
echo -e "${GREEN}${AETHER}${NC}"

###############################################################################
# CALCULATE TOTALS
###############################################################################

TOTAL=$((FIRE + WATER + EARTH + AIR + AETHER))

# Count files
FILE_COUNT=$(find . -name "*.md" -not -path "./_MAIA_SYSTEM/*" 2>/dev/null | wc -l | tr -d ' ')

###############################################################################
# DETERMINE DOMINANT ELEMENT
###############################################################################

DOMINANT="balanced"
MAX=$FIRE

if [ $WATER -gt $MAX ]; then MAX=$WATER; DOMINANT="water"; fi
if [ $EARTH -gt $MAX ]; then MAX=$EARTH; DOMINANT="earth"; fi
if [ $AIR -gt $MAX ]; then MAX=$AIR; DOMINANT="air"; fi
if [ $AETHER -gt $MAX ]; then MAX=$AETHER; DOMINANT="aether"; fi
if [ $FIRE -eq $MAX ]; then DOMINANT="fire"; fi

# Check if actually balanced (all within 10% of each other)
if [ $TOTAL -gt 0 ]; then
    AVG=$((TOTAL / 5))
    THRESHOLD=$((AVG / 10))

    if [ $((FIRE - AVG)) -lt $THRESHOLD ] && [ $((FIRE - AVG)) -gt $((0 - THRESHOLD)) ] && \
       [ $((WATER - AVG)) -lt $THRESHOLD ] && [ $((WATER - AVG)) -gt $((0 - THRESHOLD)) ] && \
       [ $((EARTH - AVG)) -lt $THRESHOLD ] && [ $((EARTH - AVG)) -gt $((0 - THRESHOLD)) ] && \
       [ $((AIR - AVG)) -lt $THRESHOLD ] && [ $((AIR - AVG)) -gt $((0 - THRESHOLD)) ] && \
       [ $((AETHER - AVG)) -lt $THRESHOLD ] && [ $((AETHER - AVG)) -gt $((0 - THRESHOLD)) ]; then
        DOMINANT="balanced"
    fi
fi

###############################################################################
# DETERMINE VOICE
###############################################################################

case $DOMINANT in
    fire)    VOICE="alchemist" ;;
    water)   VOICE="mystic" ;;
    earth)   VOICE="practitioner" ;;
    air)     VOICE="sage" ;;
    aether)  VOICE="cosmic-witness" ;;
    *)       VOICE="balanced" ;;
esac

###############################################################################
# OUTPUT RESULTS
###############################################################################

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║          PULSE #${PULSE_NUMBER} COMPLETE           ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Elemental Distribution:${NC}"
echo -e "  ${RED}🔥 Fire:${NC}    ${FIRE}"
echo -e "  ${BLUE}💧 Water:${NC}   ${WATER}"
echo -e "  ${GREEN}🌱 Earth:${NC}   ${EARTH}"
echo -e "  ${CYAN}💨 Air:${NC}     ${AIR}"
echo -e "  ${MAGENTA}✨ Aether:${NC}  ${AETHER}"
echo ""
echo -e "${YELLOW}Totals:${NC}"
echo -e "  Total markers: ${TOTAL}"
echo -e "  Files scanned: ${FILE_COUNT}"
echo ""
echo -e "${YELLOW}Organism State:${NC}"
echo -e "  Dominant element: ${DOMINANT}"
echo -e "  Active voice: ${VOICE}"
echo ""

###############################################################################
# WRITE TO BREATH ARCHIVE (JSONL)
###############################################################################

JSON_LINE="{\"pulse\":${PULSE_NUMBER},\"timestamp\":\"${TIMESTAMP}\",\"fire\":${FIRE},\"water\":${WATER},\"earth\":${EARTH},\"air\":${AIR},\"aether\":${AETHER},\"total\":${TOTAL},\"file_count\":${FILE_COUNT},\"dominant\":\"${DOMINANT}\",\"voice\":\"${VOICE}\"}"

echo "$JSON_LINE" >> "$BREATH_ARCHIVE"

###############################################################################
# WRITE TO PULSE LOG (Human Readable)
###############################################################################

{
    echo "═══════════════════════════════════════════════════════"
    echo "PULSE #${PULSE_NUMBER} - ${TIMESTAMP}"
    echo "═══════════════════════════════════════════════════════"
    echo ""
    echo "ELEMENTAL SCORES:"
    echo "  🔥 Fire:    $FIRE"
    echo "  💧 Water:   $WATER"
    echo "  🌱 Earth:   $EARTH"
    echo "  💨 Air:     $AIR"
    echo "  ✨ Aether:  $AETHER"
    echo ""
    echo "TOTALS:"
    echo "  Total markers: $TOTAL"
    echo "  Files scanned: $FILE_COUNT"
    echo ""
    echo "ORGANISM STATE:"
    echo "  Dominant: $DOMINANT"
    echo "  Voice: $VOICE"
    echo ""
} >> "$PULSE_LOG"

###############################################################################
# TRIGGER VISUALIZATION UPDATE (if visualizations exist)
###############################################################################

if [ -f "_MAIA_SYSTEM/visualizations/balance-wheel.html" ]; then
    echo -e "${GREEN}✓ Visualization data updated${NC}"
    echo -e "${BLUE}Open _MAIA_SYSTEM/visualizations/balance-wheel.html to see your organism${NC}"
fi

echo ""
echo -e "${GREEN}✓ Pulse data saved to breath-archive.jsonl${NC}"
echo -e "${GREEN}✓ Pulse log updated${NC}"
echo ""
echo -e "${CYAN}The organism breathes. 🌀${NC}"
echo ""

###############################################################################
# EXIT
###############################################################################

exit 0
