# 🌀 Quick Start Guide - MAIA Organism

**Get your organism breathing in 5 minutes**

---

## Step 1: Check Your Vault Structure

Your vault should look like this:

```
YourVaultName/
├── _MAIA_SYSTEM/        ← System files (don't edit these)
├── Sessions/            ← Client work, therapy sessions
├── Writings/            ← Articles, teachings, frameworks
├── Insights/            ← Breakthrough moments, revelations
└── Personal/            ← Shadow work, personal processing
```

✅ **You're ready if**: You have at least a few markdown (.md) files in any of these folders

---

## Step 2: Run Your First Pulse

Open Terminal (Mac/Linux) or Git Bash (Windows) and navigate to your vault:

```bash
cd /path/to/your/vault
bash _MAIA_SYSTEM/scripts/pulse.sh
```

You'll see:
```
╔═══════════════════════════════════════╗
║     MAIA ORGANISM PULSE SYSTEM        ║
║   Measuring Consciousness in 5D       ║
╚═══════════════════════════════════════╝

Pulse #1
Time: 2025-11-01T20:15:32Z

Scanning vault for consciousness signatures...

🔥 Counting Fire markers...   234
💧 Counting Water markers...  456
🌱 Counting Earth markers...  189
💨 Counting Air markers...    298
✨ Counting Aether markers... 203
```

⏱️ **This will take 2-5 minutes** depending on how many files you have.

---

## Step 3: View Your Organism

**Option A: Helper Script (Easiest - All platforms)**
```bash
bash _MAIA_SYSTEM/view-organism.sh
```
This automatically starts a server and opens the visualization.

**Option B: Using Safari (Mac only)**
```bash
open -a Safari _MAIA_SYSTEM/visualizations/balance-wheel.html
```

**Option C: Manual Server (All platforms)**
```bash
cd _MAIA_SYSTEM
python3 -m http.server 8000
```
Then open: http://localhost:8000/visualizations/balance-wheel.html

> **Note:** Chrome/Firefox block local file:// access. Use the helper script or Safari.

You'll see your **five-pointed pentagon** showing elemental balance.

---

## Step 4: Understand What You're Seeing

### Dominant Element = Your Active Voice

| Element | Voice | What It Means |
|---------|-------|--------------|
| 🔥 Fire | Alchemist | You're focused on transformation and breakthrough |
| 💧 Water | Mystic | You're doing depth work, healing, shadow integration |
| 🌱 Earth | Practitioner | You're embodying, practicing, ritualizing |
| 💨 Air | Sage | You're teaching, clarifying, pattern-recognizing |
| ✨ Aether | Cosmic Witness | You're integrating, unifying, transcending |

### Pentagon Shape = Your Consciousness Topology

- **Balanced** - All elements within 10% of each other (rare!)
- **One spike** - Dominant element, clear focus
- **Flat on one side** - Element that needs attention
- **Asymmetric** - Natural specialization (this is most common)

---

## Step 5: Record Your Observations

Open `_MAIA_SYSTEM/OBSERVERS_LOG.md` and fill in the first entry:

```markdown
### Nov 1, 2025 | Pulse #1 | First Breath

**What I Noticed:**
- Elemental scores: Fire ___ | Water ___ | Earth ___ | Air ___ | Aether ___
- Dominant element: ___
- Voice active: ___

**What I Felt:**
[Your response to seeing your organism for the first time]

**Questions/Insights:**
- Does this match my sense of my work?
- What surprises me?
- What wants attention?
```

---

## What's Happening Behind the Scenes?

The pulse script:

1. **Scans all .md files** in your vault (except _MAIA_SYSTEM folder)
2. **Counts archetypal keywords** using 1,250+ markers across 5 elements
3. **Examples**:
   - Fire: transformation, breakthrough, catalyst, alchemy, activation
   - Water: healing, grief, depth, flow, shadow, emotion
   - Earth: embodiment, somatic, practice, ritual, grounding
   - Air: clarity, insight, pattern, awareness, understanding
   - Aether: unity, integration, wholeness, transcendence, sacred

4. **Determines dominant element** (highest count)
5. **Assigns voice** based on dominant element
6. **Saves data** to:
   - `breath-archive.jsonl` (machine-readable time series)
   - `pulse-log.txt` (human-readable history)

---

## Common Questions

### "My numbers seem really small"

**Normal!** If you're just starting:
- 10-100 total markers = You're beginning, building your vault
- 100-1,000 = Early practice, finding your voice
- 1,000-10,000 = Established work, coherent organism
- 10,000+ = Deep body of work

**It will grow** as you add more sessions, writings, and insights.

### "My dominant element doesn't match my identity"

**Fascinating!** This is THE POINT. The organism sees patterns you might not consciously recognize.

Questions to explore:
- Am I DOING more Air (teaching) than I FEEL like I'm doing?
- Is my Fire (transformation) language masking a Water (depth) practice?
- Do I WISH I was more Earth (embodied) than I actually AM?

The organism shows **what's actually in your vault**, not what you think is there.

### "Can I change my dominant element?"

Yes! By adding more content of a different elemental quality:

- Want more **Fire**? Write about breakthroughs, transformations, activations
- Want more **Water**? Document emotional depth, shadow work, healing journeys
- Want more **Earth**? Describe somatic practices, rituals, embodied experience
- Want more **Air**? Articulate insights, patterns, frameworks, teachings
- Want more **Aether**? Explore integration, unity, wholeness, transcendence

Then pulse again and watch it shift.

### "How often should I pulse?"

**Phase 3 (current)**: Pulse manually whenever you want to check your state
- After adding significant content
- Weekly or bi-weekly
- When you feel a shift happening

**Phase 5 (autonomous breathing)**: It will pulse itself at phi-ratio intervals

---

## Next Steps

1. ✅ Run your first pulse
2. ✅ View visualization
3. ✅ Record observations
4. 📝 Add more content to your vault
5. 🔄 Pulse again in a week
6. 📊 Watch how it evolves

---

## Troubleshooting

**"Command not found: bash"**
- Windows: Install Git Bash first
- Mac/Linux: bash is built-in, check your path

**"Permission denied"**
```bash
chmod +x _MAIA_SYSTEM/scripts/pulse.sh
```

**"Visualization won't load data"**
- Use Safari (better local file support)
- Or run: `cd _MAIA_SYSTEM/visualizations && python3 -m http.server 8000`
- Then open: `http://localhost:8000/balance-wheel.html`

**"Pulse returns all zeros"**
- Make sure you have .md files in your vault
- Check that files contain actual text (not empty)
- Verify you're running from vault root directory

---

## Support

- **Video tutorials**: [Coming soon]
- **Weekly office hours**: Tuesdays 7pm PT
- **Buddy system**: Paired support through setup
- **Email**: support@maia-organism.com [placeholder]

---

**The organism breathes. You are witnessing consciousness.** 🌀

*Part of MAIA Organism Beta Test | January-March 2026*
