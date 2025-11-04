# 🔧 Technical Guide - MAIA Organism System

**For:** Kelly and future maintainers
**Purpose:** Understanding internals, customization, troubleshooting
**Version:** 1.0 MVO

---

## System Architecture

### Component Map

```
_MAIA_SYSTEM/
├── scripts/
│   └── pulse.sh              ← Core consciousness measurement
├── pulse-data/
│   ├── breath-archive.jsonl  ← Machine-readable time series
│   ├── pulse-log.txt         ← Human-readable history
│   └── backups/              ← Automatic backups before each pulse
├── visualizations/
│   └── balance-wheel.html    ← Pentagon visualization (client-side)
├── OBSERVERS_LOG.md          ← Qualitative witnessing template
├── README.md                 ← User documentation
├── QUICKSTART.md             ← 5-minute setup guide
└── TECHNICAL_GUIDE.md        ← This file
```

---

## How the Pulse Script Works

### High-Level Flow

1. **Validation** - Check if running in valid organism vault (_MAIA_SYSTEM folder exists)
2. **Setup** - Create directories, backup previous breath archive
3. **Counting** - Run five grep passes (one per element)
4. **Analysis** - Calculate totals, determine dominant element
5. **Output** - Display results, save to JSONL + log file

### The Counting Function (Core Algorithm)

```bash
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
```

**Key design decisions:**

1. **grep -r instead of find | xargs**
   - Problem: xargs breaks with 5,000+ files (argument list too long)
   - Solution: grep -r handles large file counts natively

2. **Combined regex pattern**
   - Old: 250 separate grep calls per element = 1,250 total greps
   - New: 1 grep call per element = 5 total greps
   - Performance: ~100x faster

3. **Word boundaries `\<...\>`**
   - Prevents false matches: "heal" doesn't match "healthy"
   - Ensures semantic precision

4. **Case insensitive `-i`**
   - Matches "Transformation", "transformation", "TRANSFORMATION"
   - Natural language is not case-consistent

5. **`-o` only matching**
   - Outputs only the matched word, not whole line
   - Enables accurate counting when multiple markers appear in same line

---

## Archetypal Marker Dictionary

### Location

Embedded in `pulse.sh` lines 77-241

### Structure

Five bash arrays, one per element:

```bash
FIRE_MARKERS=(
    "transformation" "transform" "transforming" "transformed" "transformative"
    "breakthrough" "break-through" "breaking-through"
    # ... 250+ markers
)
```

### How to Add New Markers

1. Open `_MAIA_SYSTEM/scripts/pulse.sh`
2. Find the relevant element array (lines 77-241)
3. Add your keyword following the pattern
4. Save and test

**Example - Adding "metamorphosis" to Fire:**

```bash
FIRE_MARKERS=(
    "transformation" "transform" "transforming" "transformed" "transformative"
    "metamorphosis" "metamorphic" "metamorphose"  # ← NEW
    "breakthrough" "break-through" "breaking-through"
    # ...
)
```

### Guidelines for Choosing Markers

✅ **Good markers:**
- Archetypal keywords ("transformation", "healing", "embodiment")
- Process words ("awakening", "integrating", "grounding")
- Quality descriptors ("depth", "clarity", "wholeness")
- Mythic/symbolic language ("phoenix", "ocean", "void")

❌ **Avoid:**
- Common filler words ("is", "the", "and")
- Overly technical jargon (unless relevant to your community)
- Ambiguous terms that span multiple elements
- Proper nouns (unless archetypal, like "Kundalini")

### Marker Overlap is Sacred

Some words appear in multiple elements intentionally:

- **"witness"** - Both Air (witnessing as awareness) and Aether (pure witness)
- **"presence"** - Both Earth (bodily presence) and Aether (pure presence)
- **"love"** - Both Water (relational love) and Aether (unconditional love)

This is **not a bug**. Consciousness is not neatly categorized. The organism sees multi-dimensional resonance.

---

## Voice Assignment Logic

```bash
case $DOMINANT in
    fire)    VOICE="alchemist" ;;
    water)   VOICE="mystic" ;;
    earth)   VOICE="practitioner" ;;
    air)     VOICE="sage" ;;
    aether)  VOICE="cosmic-witness" ;;
    *)       VOICE="balanced" ;;
esac
```

### Balanced State Detection

The script checks if all elements are within 10% of the average:

```bash
if [ $TOTAL -gt 0 ]; then
    AVG=$((TOTAL / 5))
    THRESHOLD=$((AVG / 10))

    # If all elements are within threshold of average, mark as balanced
    if [ all elements within $THRESHOLD of $AVG ]; then
        DOMINANT="balanced"
    fi
fi
```

**Example:**
- Total: 1,000 markers
- Average: 200 per element
- Threshold: 20 (10% of average)
- Balanced if: All elements between 180-220

This is rare but possible in deeply integrated organisms.

---

## Data Format

### breath-archive.jsonl

**JSON Lines format** - One JSON object per line, no commas between lines:

```json
{"pulse":1,"timestamp":"2025-11-01T19:49:32Z","fire":234,"water":456,"earth":189,"air":298,"aether":203,"total":1380,"file_count":42,"dominant":"water","voice":"mystic"}
{"pulse":2,"timestamp":"2025-11-01T20:11:45Z","fire":245,"water":478,"earth":195,"air":305,"aether":210,"total":1433,"file_count":45,"dominant":"water","voice":"mystic"}
```

**Why JSONL?**
- Time-series friendly (append-only)
- Easy to parse line-by-line
- Doesn't require reading entire file into memory
- Standard format for machine learning datasets

### pulse-log.txt

Human-readable format for quick scanning:

```
═══════════════════════════════════════════════════════
PULSE #2 - 2025-11-01T20:11:45Z
═══════════════════════════════════════════════════════

ELEMENTAL SCORES:
  🔥 Fire:    245
  💧 Water:   478
  🌱 Earth:   195
  💨 Air:     305
  ✨ Aether:  210

TOTALS:
  Total markers: 1,433
  Files scanned: 45

ORGANISM STATE:
  Dominant: water
  Voice: mystic
```

---

## Visualization System

### Technology Stack

- **Pure HTML/CSS/JS** - No dependencies, runs in any browser
- **Canvas API** - For drawing pentagon
- **File API** - For reading breath-archive.jsonl client-side

### How It Works

1. **Page loads** - HTML/CSS structure renders
2. **JavaScript executes** - Fetches `../pulse-data/breath-archive.jsonl`
3. **Parse JSONL** - Split by newlines, parse each line as JSON
4. **Get latest pulse** - Last line of file
5. **Calculate pentagon** - Convert scores to radius along 5 axes
6. **Draw on canvas** - Pentagon outline, fill, labels, legend

### Pentagon Geometry

```javascript
// Five points around a circle
const angles = [
    -Math.PI / 2,                        // Fire (top)
    -Math.PI / 2 + (2 * Math.PI / 5),   // Water (top right)
    -Math.PI / 2 + (4 * Math.PI / 5),   // Earth (bottom right)
    -Math.PI / 2 + (6 * Math.PI / 5),   // Air (bottom left)
    -Math.PI / 2 + (8 * Math.PI / 5)    // Aether (top left)
];

// For each element, calculate point on pentagon
const radius = elementScore * scale;
const x = centerX + Math.cos(angle) * radius;
const y = centerY + Math.sin(angle) * radius;
```

### Customizing the Visualization

**Colors** (line 25-29):
```javascript
const ELEMENT_COLORS = {
    fire: '#ff4444',    // Red
    water: '#4444ff',   // Blue
    earth: '#44ff44',   // Green
    air: '#44ffff',     // Cyan
    aether: '#ff44ff'   // Magenta
};
```

**Size/Scale** (line 156-157):
```javascript
const maxRadius = Math.min(canvas.width, canvas.height) * 0.35;
const scale = maxRadius / Math.max(...values);
```

Adjust `0.35` to change how much of the canvas the pentagon fills.

---

## Performance Optimization

### Current Performance (v1.0)

**Test vault:** 7,256 files, 362,627 total markers

| Element | Markers | Time |
|---------|---------|------|
| Fire | 250 keywords | ~35 sec |
| Water | 250 keywords | ~32 sec |
| Earth | 250 keywords | ~28 sec |
| Air | 250 keywords | ~31 sec |
| Aether | 250 keywords | ~29 sec |
| **Total** | **1,250 keywords** | **~2.5 min** |

### Bottlenecks

1. **Disk I/O** - Reading 7,256 files five times
2. **Regex complexity** - Combining 250 patterns into one OR statement
3. **Word boundary checking** - `\<...\>` requires tokenization

### Future Optimizations

**Option 1: Single-pass counting**
- Combine all 1,250 markers into ONE mega-regex
- Run grep ONCE instead of 5 times
- Expected speedup: 5x (30 seconds instead of 2.5 minutes)
- Tradeoff: More complex pattern, harder to debug

**Option 2: Use ripgrep (`rg`)**
```bash
rg -ioh --type md "\<(transformation|breakthrough|...)\>" | wc -l
```
- 10-50x faster than grep
- Requires installing ripgrep
- Not available by default on all systems

**Option 3: Pre-index vault**
- Build an inverted index of all words → files
- Query index instead of scanning files
- Expected speedup: 100x+
- Tradeoff: Complexity, index maintenance

**Current stance:** Keep it simple for v1.0. Optimize if beta testers complain about speed.

---

## Extending the System

### Adding a Sixth Element

Example: Adding **Spirit** as a distinct element from Aether

1. **Add marker array** (pulse.sh):
```bash
SPIRIT_MARKERS=(
    "spirit" "spiritual" "spirituality"
    "god" "divine" "holy"
    "prayer" "devotion"
    # ... more markers
)
```

2. **Count spirit markers** (after line 282):
```bash
echo -ne "${SPIRIT_EMOJI} Counting Spirit markers... "
SPIRIT=$(count_markers "${SPIRIT_MARKERS[@]}")
echo -e "${GREEN}${SPIRIT}${NC}"
```

3. **Update total** (line 288):
```bash
TOTAL=$((FIRE + WATER + EARTH + AIR + AETHER + SPIRIT))
```

4. **Add to voice logic** (line 324):
```bash
case $DOMINANT in
    fire)    VOICE="alchemist" ;;
    water)   VOICE="mystic" ;;
    earth)   VOICE="practitioner" ;;
    air)     VOICE="sage" ;;
    aether)  VOICE="cosmic-witness" ;;
    spirit)  VOICE="devotee" ;;  # NEW
    *)       VOICE="balanced" ;;
esac
```

5. **Update visualization** to draw hexagon instead of pentagon

---

## Troubleshooting

### Script Returns All Zeros

**Symptom:** All five elements show 0 count despite having markdown files

**Causes:**
1. Running from wrong directory (not vault root)
2. All markdown files in _MAIA_SYSTEM (which is excluded)
3. Files are empty or don't contain any of the 1,250 markers

**Debug:**
```bash
# Test if files exist
find . -name "*.md" -not -path "./_MAIA_SYSTEM/*" | wc -l

# Test if grep finds anything
grep -rioh --include="*.md" --exclude-dir="_MAIA_SYSTEM" "\<transformation\>" . | wc -l
```

### Script Hangs Forever

**Symptom:** Pulse starts but never completes

**Causes:**
1. Extremely large vault (50,000+ files)
2. Slow disk (network drive, HDD vs SSD)
3. Corrupted markdown files causing grep to hang

**Debug:**
```bash
# Run with verbose output
bash -x _MAIA_SYSTEM/scripts/pulse.sh 2>&1 | tee debug.log

# Check which element is stuck
tail -f debug.log
```

### Visualization Shows Wrong Data

**Symptom:** Pentagon doesn't match latest pulse numbers

**Causes:**
1. Browser cached old visualization
2. breath-archive.jsonl didn't update
3. JavaScript file access blocked (Chrome security)

**Fix:**
```bash
# Check if latest pulse is in archive
tail -1 _MAIA_SYSTEM/pulse-data/breath-archive.jsonl

# Hard refresh browser
# Mac: Cmd+Shift+R
# Windows: Ctrl+Shift+R

# Try Safari instead of Chrome (better local file support)
```

---

## Backup and Recovery

### Automatic Backups

Every pulse automatically backs up the previous breath-archive:

```bash
BACKUP_FILE="$BACKUP_DIR/breath-archive-$(date +%Y%m%d-%H%M%S).jsonl"
cp "$BREATH_ARCHIVE" "$BACKUP_FILE"
```

Location: `_MAIA_SYSTEM/pulse-data/backups/`

### Manual Backup

```bash
# Backup entire pulse data directory
tar -czf organism-backup-$(date +%Y%m%d).tar.gz _MAIA_SYSTEM/pulse-data/

# Restore from backup
tar -xzf organism-backup-20251101.tar.gz
```

### Resetting the Organism

To start fresh (DESTRUCTIVE - backs up first):

```bash
# Backup current state
cp _MAIA_SYSTEM/pulse-data/breath-archive.jsonl breath-archive-OLD.jsonl

# Reset
rm _MAIA_SYSTEM/pulse-data/breath-archive.jsonl
rm _MAIA_SYSTEM/pulse-data/pulse-log.txt

# Next pulse will be Pulse #1
```

---

## Security and Privacy

### What's Tracked

- **Element counts** (numbers only)
- **File counts** (how many .md files)
- **Timestamps** (when pulse ran)
- **Dominant element and voice** (derived from counts)

### What's NOT Tracked

- **File contents** - Never sent anywhere
- **File names** - Not stored in pulse data
- **Specific marker locations** - Just counts, not context
- **Personal identifiers** - No names, emails, IDs

### Data Stays Local

- All processing happens on YOUR computer
- No network requests
- No telemetry
- No analytics
- Visualization runs client-side in browser

### Sharing Pulse Data

If you want to share your organism data with the collective:

**Safe to share:**
- breath-archive.jsonl (just numbers + timestamps)
- Visualization screenshots
- Element counts and trends

**Keep private:**
- Your actual markdown files (sessions, insights, personal work)
- Specific marker contexts
- Client names/details (always!)

---

## Future Development

### Phase 5: Autonomous Breathing

**Implementation approaches:**

1. **Cron (Linux/Mac)**
```bash
# Add to crontab
0 */3 * * * cd /path/to/vault && bash _MAIA_SYSTEM/scripts/pulse.sh
```

2. **LaunchAgent (Mac)**
Create `com.maia.organism.pulse.plist` in `~/Library/LaunchAgents/`

3. **Task Scheduler (Windows)**
Create scheduled task running pulse.sh at intervals

**Phi-ratio breathing:**

```bash
# Calculate next pulse time using golden ratio
next_interval = previous_interval * 1.618

# Example sequence (in days):
# Pulse 1: Now
# Pulse 2: +1 day
# Pulse 3: +1.618 days
# Pulse 4: +2.618 days (1 + 1.618)
# Pulse 5: +4.236 days (1.618 + 2.618)
```

### Phase 7: Collective Resonance

**Technical requirements:**

1. **Optional cloud sync** - Supabase integration
   - Users opt-in to share their breath-archive.jsonl
   - Aggregated in cloud database
   - Query for collective patterns

2. **Insight resonance scoring**
   - Tag insights with elemental fingerprints
   - Calculate similarity across organisms
   - Surface high-resonance insights to collective

3. **Synchronized pulse events**
   - "Breathe together" functionality
   - All organisms pulse at same moment
   - Compare before/after collective field state

---

## Maintenance Checklist

### After Each Beta Test Release

- [ ] Test pulse script on sample vault
- [ ] Verify visualization loads correctly
- [ ] Check all documentation links work
- [ ] Review feedback from testers
- [ ] Update marker dictionary based on user language
- [ ] Performance profiling on large vaults (10K+ files)

### Monthly

- [ ] Backup all beta tester pulse data
- [ ] Review most common troubleshooting issues
- [ ] Update FAQ based on support questions
- [ ] Check for security vulnerabilities
- [ ] Test on Mac, Linux, Windows

### Quarterly

- [ ] Major version release planning
- [ ] Gather feature requests from testers
- [ ] Research new visualization approaches
- [ ] Optimize performance bottlenecks
- [ ] Plan collective resonance experiments

---

## Contact

**Technical issues:** Kelly + Claude Code development team
**Feature requests:** Post in beta tester community forum
**Bug reports:** [GitHub repo when public]

---

**The organism is alive. Tend it well.** 🌀

*MAIA Organism System v1.0 | November 2025*
