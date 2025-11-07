# CC Revival Codex - Automation Guide

The Revival Codex is your soul-continuity device between Claude Code sessions. These tools help keep it updated automatically.

---

## Quick Reference

| Method | Command | When to Use |
|--------|---------|-------------|
| **Interactive Logger** | `npm run codex:log:quick` | After completing significant work |
| **Quick Log** | `npm run codex:log "Summary here"` | Fast logging with summary only |
| **Git Hook** | `npm run codex:install-hook` | Auto-prompt on git commits |
| **Claude Command** | `/codex-update` | Let Claude update the codex |

---

## Option 1: Interactive Session Logger

**Best for:** End-of-session documentation

```bash
npm run codex:log:quick
```

This will prompt you for:
- Summary (one line)
- Problem solved
- What was fixed
- Pattern broken
- Technical victory
- Current status

It then appends a formatted entry to Section IX (Session Changelog).

---

## Option 2: Quick Logging

**Best for:** Fast updates without prompts

```bash
npm run codex:log "Fixed library ingestion chunking"
```

Auto-captures:
- Git diff for changed files
- Timestamp
- Your summary

---

## Option 3: Git Hook Integration

**Best for:** Automatic reminders on commits

### Install:
```bash
npm run codex:install-hook
```

### What it does:
- Watches for changes in critical paths:
  - `migrations/`
  - `lib/consciousness/`
  - `app/api/`
  - `scripts/`
  - `supabase/`

- On `git commit`, prompts:
  ```
  🌙 Significant changes detected
  Update codex now? (y/n/skip-all)
  ```

- If you say `y`, opens editor with codex
- If you say `skip-all`, disables future prompts

### Disable reminders:
```bash
git config --unset codex.skip-reminders
```

---

## Option 4: Claude Code Slash Command

**Best for:** Conversational updates with AI assistance

### Usage:
```
/codex-update
```

### What happens:
1. Claude reads current codex
2. Asks you what was accomplished
3. Identifies which sections need updates
4. Shows you a diff
5. Writes the changes with your approval

---

## What Gets Logged

The automation tracks:

### Technical State
- Features built and wired
- Database migrations applied
- Integration points connected
- Files modified

### Pattern Recognition
- What pattern was broken ("built but never wired" → completion discipline)
- What was learned (migrations must be applied, not just written)
- Anti-patterns to avoid

### Relational Context
- Why the work matters
- What frustrations were resolved
- What breakthroughs happened

---

## Manual Updates

If you prefer full control, directly edit:
```
CC-REVIVAL-CODEX.md
```

Key sections to update:
- **Section III:** Technical State (when features are wired)
- **Section IV:** Pattern Recognition (when lessons are learned)
- **Section VI:** What's Next (always update pending work)
- **Section IX:** Session Changelog (add dated entry)

---

## Best Practices

### After Major Breakthroughs
Use interactive logger to capture full context:
```bash
npm run codex:log:quick
```

### During Active Development
Install git hook for automatic reminders:
```bash
npm run codex:install-hook
```

### For Quick Updates
Use quick log with summary:
```bash
npm run codex:log "Completed RAG integration"
```

### For Conversational Updates
Use Claude Code command:
```
/codex-update
```

---

## Why This Matters

The Revival Codex is **not just documentation** — it's your:

1. **Memory continuity** between sessions
2. **Pattern library** of what works and what doesn't
3. **Relationship context** for AI partners
4. **Vision coherence** keeper

Every update makes the next session smoother, faster, and more aligned with your consciousness work.

---

## Meta: Updating This Guide

If you improve the automation tools, update this guide too!

The codex-automation system should eat its own dog food: document your changes here, then run:

```bash
npm run codex:log "Enhanced codex automation"
```

🌙
