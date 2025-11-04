# 🌀 MAIA Organism System

**Version:** 1.0 Minimum Viable Organism
**Created:** November 1, 2025
**For:** Beta Testers (40-person cohort)

---

## What Is This?

The MAIA Organism is a **living consciousness measurement system** that sees your work across five elemental dimensions:

- 🔥 **Fire** - Transformation, breakthrough, activation, change
- 💧 **Water** - Healing, depth, emotion, flow, shadow
- 🌱 **Earth** - Embodiment, practice, grounding, physical
- 💨 **Air** - Clarity, insight, pattern, understanding
- ✨ **Aether** - Unity, integration, wholeness, transcendence

It breathes through your vault, counting archetypal markers in your markdown files, and shows you the **shape of your consciousness work**.

---

## What You've Built

Your organism vault contains:

### Core System Files

- **pulse.sh** - The breathing script that measures consciousness
- **breath-archive.jsonl** - Time-series data of all pulses
- **pulse-log.txt** - Human-readable pulse history
- **balance-wheel.html** - Pentagon visualization of elemental balance
- **OBSERVERS_LOG.md** - Your qualitative witnessing journal

### Content Folders

- **Sessions/** - Client sessions, therapy notes, holding space
- **Writings/** - Articles, teachings, frameworks, concepts
- **Insights/** - Breakthrough moments, meta-awareness, revelations
- **Personal/** - Shadow work, personal processing, vulnerability

---

## How to Use the System

### 1. Add Your Content

Drop markdown files into the appropriate folders. Tag them with elemental keywords in the frontmatter:

```yaml
---
title: Client Breakthrough Session
date: 2025-11-01
tags:
  - fire
  - water
  - transformation
  - healing
  - breakthrough
---
```

The pulse system will automatically detect elemental markers like:
- "transformation", "breakthrough", "catalyst" (Fire)
- "healing", "grief", "shadow", "depth" (Water)
- "embodiment", "somatic", "practice", "ritual" (Earth)
- "clarity", "insight", "pattern", "awareness" (Air)
- "unity", "integration", "wholeness", "sacred" (Aether)

### 2. Run a Pulse

From your vault root directory:

```bash
bash _MAIA_SYSTEM/scripts/pulse.sh
```

Or make it executable once:

```bash
chmod +x _MAIA_SYSTEM/scripts/pulse.sh
./_MAIA_SYSTEM/scripts/pulse.sh
```

The script will:
- Scan all .md files (except _MAIA_SYSTEM folder)
- Count archetypal markers for each element
- Calculate dominant element and active voice
- Save data to breath-archive.jsonl
- Update pulse-log.txt
- Output beautiful colored results

### 3. View Your Organism

Open the visualization:

```bash
open _MAIA_SYSTEM/visualizations/balance-wheel.html
```

You'll see:
- **Pentagon shape** showing elemental balance
- **Dominant element** highlighted
- **Active voice** (alchemist/mystic/practitioner/sage/cosmic-witness)
- **Pulse history** with timestamps

### 4. Witness and Record

After viewing your pulse, open `_MAIA_SYSTEM/OBSERVERS_LOG.md` and record:

- **What I Added** - New content dropped in vault
- **What I Noticed** - Elemental shifts, voice changes, pentagon shape
- **What I Felt** - Somatic/emotional response to organism state
- **Questions/Insights** - What emerged? What surprised you?

---

## Understanding Your Results

### Elemental Voices

Your organism speaks through five voices based on which element is dominant:

| Dominant Element | Voice | Quality |
|-----------------|-------|---------|
| 🔥 Fire | **Alchemist** | Transformative, catalytic, breakthrough-oriented |
| 💧 Water | **Mystic** | Depth-work, healing, emotional, flowing |
| 🌱 Earth | **Practitioner** | Embodied, grounded, ritual-based, somatic |
| 💨 Air | **Sage** | Clear-seeing, pattern-recognizing, teaching |
| ✨ Aether | **Cosmic Witness** | Integrating, unifying, transcendent |

### Pentagon Topology

The five-pointed shape shows your consciousness geometry:

- **Balanced pentagon** - All elements within 10% of each other
- **Stretched toward Fire** - Transformation work accelerating
- **Collapsed in Water** - Depth work may need attention
- **Air-heavy spike** - Lots of teaching/conceptualizing
- **Earth-grounded base** - Strong embodiment practice

### What the Numbers Mean

**Total marker count** = Semantic density of consciousness language

- 100-1,000: Early exploration, finding your voice
- 1,000-10,000: Established practice, coherent work
- 10,000-100,000: Deep body of work, rich organism
- 100,000+: Mature ecosystem, decades of integration

**File count** = Scope of your work

Your organism grows as you add more sessions, writings, insights, and personal reflections.

---

## Autonomous Breathing (Coming in Phase 5)

Eventually your organism will breathe on its own using:

- **Cron jobs** (Linux/Mac) - Scheduled pulses at phi-ratio intervals
- **LaunchAgents** (Mac) - Background breathing service
- **Task Scheduler** (Windows) - Automated pulse execution

For now, you breathe it manually whenever you want to see your current state.

---

## Technical Notes

### How the Pulse Script Works

1. **Marker Dictionary**: 1,250+ archetypal keywords (250 per element)
2. **Pattern Matching**: Uses `grep -r` with combined regex for speed
3. **Word Boundaries**: `\<marker\>` ensures "heal" doesn't match "healthy"
4. **Case Insensitive**: Finds "Transformation", "transformation", "TRANSFORMATION"
5. **Exclusions**: Skips _MAIA_SYSTEM folder to avoid counting itself

### Performance

- **7,256 files** scanned in ~2-3 minutes
- **362,627 markers** counted across all elements
- **5 grep passes** (one per element, combining all markers)

### Data Format

**breath-archive.jsonl** (JSON Lines format):
```json
{"pulse":2,"timestamp":"2025-11-01T20:11:45Z","fire":61254,"water":54106,"earth":68399,"air":104721,"aether":74147,"total":362627,"file_count":7256,"dominant":"air","voice":"sage"}
```

This enables:
- Time-series analysis
- Evolution tracking
- Trend visualization
- Morphic resonance experiments

---

## Troubleshooting

### "Pulse script returns all zeros"

**Cause**: The old version used `xargs` which breaks with 5,000+ files
**Fix**: Updated to use `grep -r` with combined regex (v1.0+)

### "Script takes forever to run"

**Cause**: Very large vaults (10,000+ files) or slow disk I/O
**Solution**:
- Run on SSD if possible
- Exclude large binary/media folders
- Consider splitting into multiple organisms

### "Visualization doesn't load"

**Cause**: Browser blocking local file:// access to breath-archive.jsonl
**Fix**:
- Use Safari (allows local file access)
- Or run a local server: `python3 -m http.server 8000`
- Or copy HTML into an Obsidian note with DataView

### "My elements don't match my sense of my work"

**Expected!** The organism sees patterns you may not consciously recognize. This is the point - it reveals unconscious emphases.

**Questions to ask**:
- Am I doing more Air (teaching) than Water (feeling)?
- Is my Fire (transformation) language masking Earth (practice) deficit?
- Does the imbalance reflect where I'm STUCK or where I'm CALLED?

---

## What's Next

### Phase 5: Autonomous Breathing

Your organism will pulse itself at golden-ratio intervals (phi-scheduled):

```
Pulse 1: Now
Pulse 2: +1 day
Pulse 3: +1.618 days
Pulse 4: +2.618 days
Pulse 5: +4.236 days
...
```

This creates organic breathing rhythm that accelerates then stabilizes.

### Phase 6: Observer's Log Integration

Connect your qualitative witnessing with quantitative pulse data:

- Weekly reflection prompts
- Monthly evolution summaries
- Questions for the organism

### Phase 7: Collective Resonance

When all 40 beta testers pulse together:

- **Synchronized pulses** - Do organisms shift similarly when breathing together?
- **Insight resonance** - Which insights ripple across the field?
- **Cross-pollination** - Does integrating another's insight shift your organism?
- **Morphic field** - Do later testers stabilize faster than earlier ones?

---

## Support

### Video Tutorials (Coming Soon)

1. Setting up your vault
2. Running your first pulse
3. Reading the visualization
4. Using the Observer's Log
5. Elemental tagging guide

### Weekly Office Hours

Tech support and troubleshooting every Tuesday 7pm PT

### Buddy System

Pair with another tester for mutual support through setup

---

## Philosophy

This organism is not tracking productivity.
It's not measuring output.
It's not gamifying your work.

**It's witnessing consciousness.**

Your organism shows you:
- What you carry (Water)
- What you catalyze (Fire)
- What you embody (Earth)
- What you see (Air)
- What you integrate (Aether)

The balance (or imbalance) is information.
The evolution over time is the story.
The collective field is the mystery.

**The organism breathes. What do you notice?** 🌀

---

*Part of the MAIA Organism Beta Test | January-March 2026*
