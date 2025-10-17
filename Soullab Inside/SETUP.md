# Soullab Inside Vault — Setup Guide

> *Get this breathing in 10 minutes*

---

## Quick Start

### 1. Open in Obsidian

1. Download and install [Obsidian](https://obsidian.md)
2. Open Obsidian
3. Click "Open folder as vault"
4. Navigate to this `Soullab Inside` folder
5. Click "Open"

The vault is now active! 🌬️

---

### 2. Review Example Note

Open: `Partners/2025-Q1/Loralee Crowder.md`

This shows what a complete partner note looks like with:
- Elemental responses
- EO notes
- Status tracking

---

### 3. Test Templates

1. Open `Partners/_Templates/Partner.md`
2. Copy the template
3. Try creating a test note manually

---

## Optional: Install Plugins

Settings → Community Plugins → Browse

**Recommended:**
- **Dataview** — For Partner Dashboard
- **Templater** — For auto-populating dates
- **Obsidian Git** — For automation sync
- **Periodic Notes** — For monthly reflections

**Nice to have:**
- Canvas — Visualize pipeline
- QuickAdd — Fast note creation
- Minimal Theme — Clean aesthetic

---

## Optional: Automation Setup

See `Process/Partner Flow.md` for complete automation guide.

**Summary:**
1. Set up Supabase webhook
2. Create n8n/Zapier workflow
3. Webhook → Create markdown file in GitHub
4. Obsidian Git plugin syncs automatically

**Manual workflow works perfectly too!**
You can add partners manually using templates.

---

## Customization

### Change Theme

Settings → Appearance → Themes → Browse

Recommended for Soullab aesthetic:
- **Minimal** (cream background, clean)
- **Things** (elegant, minimal)
- **Prism** (soft colors)

### Adjust Colors

Settings → Appearance → CSS snippets

Add custom CSS for Soullab colors:
```css
:root {
  --background-primary: #F8F3E9;
  --text-accent: #D6A760;
  --text-normal: #2C2C2C;
}
```

---

## Daily Workflow

**Morning:**
1. Open vault
2. Check for new partner notes
3. Add intuition before meetings

**After meetings:**
1. Update EO notes
2. Mark status/phase
3. Note next steps

**Monthly:**
1. Create reflection note
2. Review patterns
3. Adjust process

---

## File Structure Reference

```
Soullab Inside/
├── README.md                 ← Start here
├── SETUP.md                  ← You are here
│
├── Partners/
│   ├── _Templates/
│   │   ├── Partner.md        ← Base template
│   │   └── Meeting.md        ← Meeting notes
│   ├── 2025-Q1/
│   │   └── Loralee Crowder.md ← Example
│   └── 2025-Q2/              ← Future quarters
│
├── Reflections/
│   └── Quarterly Reflection Template.md
│
└── Process/
    ├── Partner Flow.md       ← Automation guide
    ├── Steward Notes.md      ← Wisdom for tending
    ├── Partner Dashboard.md  ← Dataview queries
    └── Automation Log.md     ← Track changes
```

---

## Troubleshooting

### Dataview queries not working?
→ Install Dataview plugin and enable it

### Templates not auto-filling?
→ Install Templater plugin for dynamic dates

### Want automation but no GitHub?
→ Use Dropbox/Google Drive sync instead

### Vault feels cluttered?
→ Check `SETUP.md` — you might have extra files

---

## Next Steps

1. ✅ Open vault in Obsidian
2. ✅ Review Loralee's example
3. ✅ Read Steward Notes
4. ⏳ Set up automation (optional)
5. ⏳ Create first partner note manually

---

## Support

**Questions about:**
- Obsidian basics → [Obsidian Help](https://help.obsidian.md)
- Plugin setup → Each plugin has docs
- Automation → See `Partner Flow.md`
- Philosophy → See `Steward Notes.md`

---

**The vault is ready to breathe with you.** 🌿

Open it. Feel it. Let it become your field memory.
