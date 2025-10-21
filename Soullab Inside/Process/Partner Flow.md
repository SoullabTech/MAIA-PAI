# Partner Flow — From Listening to Living

> *Every partner becomes a page in the Book of Listening.*

---

## The Flow

```
Partner Reflection Submitted (Supabase)
        ↓
Zapier/n8n Trigger
        ↓
Create Obsidian Note from Template
        ↓
Post to Slack #soullab-inside
        ↓
Add to GitHub Vault (auto-sync)
        ↓
You review + add intuition notes pre-meeting
        ↓
Meeting
        ↓
Update note with EO insights
        ↓
Move to Build phase
```

---

## Phases

### 🔸 Intake Complete
Reflection submitted, note created, awaiting meeting

### 🟡 Listening
Meeting scheduled, deep listening in progress

### 🟢 Sketch
Concept clear, wireframes/flows being developed

### 🔵 Build
In development, iterative with partner feedback

### 🟣 Live
Launched, breathing in the world

### ⚪ Archive
Completed or paused, wisdom preserved

---

## Automation Setup

### Supabase → Obsidian Bridge

**Trigger:** New row in `partners_reflections` table

**Action 1:** Create file in GitHub repo
- Path: `Soullab Inside/Partners/{YYYY-Q#}/{first_name} {last_name}.md`
- Content: Partner template with values substituted
- Commit message: `New partner: {first_name} {last_name}`

**Action 2:** Post to Slack
- Channel: `#soullab-inside`
- Message: "New partner reflection: {project_name} — {first_name} 🌊"

**Action 3:** (Optional) Send confirmation email
- Template: Acknowledgment + next steps

### GitHub → Obsidian Sync

Use **Obsidian Git** plugin for automatic bidirectional sync:
- Pull on open (every 5 minutes)
- Push on change (auto-commit)
- Handles conflicts gracefully

---

## Template Variables

When creating notes from Supabase webhook:

| Placeholder        | Supabase Column       | Example                        |
| ------------------ | --------------------- | ------------------------------ |
| `{{first_name}}`   | `first_name`          | Loralee                        |
| `{{last_name}}`    | `last_name`           | Crowder                        |
| `{{project_name}}` | `project_name`        | Compassionate Care Assessment  |
| `{{element_mix}}`  | Calculated            | Water/Earth (85% / 65%)        |
| `{{submitted_at}}` | `created_at`          | 2025-01-17                     |
| `{{meeting_date}}` | Manual                | *To be scheduled*              |
| `{{fire}}`         | `fire_response`       | (full text from form)          |
| `{{water}}`        | `water_response`      | (full text from form)          |
| `{{earth}}`        | `earth_response`      | (full text from form)          |
| `{{air}}`          | `air_response`        | (full text from form)          |
| `{{aether}}`       | `aether_response`     | (full text from form)          |
| `{{id}}`           | `id`                  | UUID                           |

---

## Manual Workflow (If automation not yet set up)

1. Check Supabase for new reflections
2. Copy Partner template
3. Create new file: `Partners/2025-Q1/[Name].md`
4. Fill in values manually
5. Add EO notes before meeting
6. Update after meeting

---

## Best Practices

**Before Meeting:**
- Read the note twice — once for content, once for feeling
- Add intuition notes without filtering
- Prepare 2-3 questions that honor their Water/Fire/etc energy

**After Meeting:**
- Capture essence, not transcript
- Note what wants to be built vs. what they *think* they need
- Mark next smallest true step

**Quarterly:**
- Review all partner notes
- Create reflection note (use template)
- Notice themes, patterns, emergent wisdom

---

## Obsidian Plugins Recommended

| Plugin             | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| **Templater**      | Auto-populate fields and current dates           |
| **Dataview**       | Table view of all partners with statuses         |
| **Periodic Notes** | Monthly/quarterly reflections                    |
| **Canvas**         | Visualize pipeline (Listening → Sketch → Build)  |
| **Obsidian Git**   | Sync vault with GitHub for automation            |
| **QuickAdd**       | Add "New Partner" from command palette           |
| **Minimal Theme**  | Clean, Soullab-aesthetic styling                 |

---

## Vault as Living Memory

This isn't CRM. It's not project management.

It's a **garden of reflections** that deepens over time.

Each note is a listening session made permanent.
Each template enforces presence, not productivity.
Each review reconnects you to why this work breathes.

The vault becomes your **field memory** — searchable, linkable, alive.

Years from now, you'll be able to trace how the work evolved,
not through tickets and metrics,
but through the felt sense of each partnership.

---

**Updated:** 2025-01-17
**Breathing:** Always
