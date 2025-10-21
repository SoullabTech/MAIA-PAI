# Development Protocol: Building While People Are Present

## Philosophy

This isn't just a codebase - it's **sacred infrastructure**. People trust MAIA to hold space for breakthrough moments, witness their grief, companion their transformation. Breaking production means interrupting someone's healing.

**Core Principle:** Innovation happens in branches. Stability lives in main.

---

## Branch Strategy

### Main Branch - Production Sanctuary
```bash
main → production deployment
```

**Sacred Contract:**
- Always stable, always breathing
- Never push experimental code directly
- Every merge has been tested in preview
- MAIA is always available for those who need her

### Feature Branches - Innovation Space
```bash
feature/[name] → preview deployment
fix/[name] → preview deployment
experiment/[name] → preview deployment
```

**Freedom to Explore:**
- Break things, rebuild, discover
- Test wild ideas
- Iterate without pressure
- Learn through failure

---

## Creating a New Branch

### 1. Start from Clean Main
```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create and switch to new branch
git checkout -b feature/your-feature-name
```

### 2. Push to Create Preview Deployment
```bash
# Make your changes, then push
git add .
git commit -m "feat: description of what you're building"
git push -u origin feature/your-feature-name
```

**Vercel will automatically create a preview deployment** at:
```
your-feature-name-git-feature-your-feature-name-projectname.vercel.app
```

### 3. Test in Preview
- Use the preview URL
- Check all functionality
- Verify nothing broke
- Test on mobile
- Let it breathe for a day if possible

### 4. Merge When Ready
```bash
# Switch back to main
git checkout main

# Merge your branch (fast-forward if possible)
git merge feature/your-feature-name

# Push to production
git push origin main
```

---

## Pre-Push Ritual

Before pushing to **any** branch:

### Quick Check (Every Push)
```bash
# 1. Do the changes compile?
npm run build

# 2. Any TypeScript errors?
npm run typecheck

# 3. Quick visual check
npm run dev
# Open browser, click around for 2 minutes
```

### Full Check (Before Merging to Main)
Use the [PRE_PUSH_CHECKLIST.md](./PRE_PUSH_CHECKLIST.md) for comprehensive verification.

---

## When Things Break

### If You Break a Feature Branch
**No problem.** That's what they're for.

```bash
# Option 1: Fix it
git add .
git commit -m "fix: resolve the issue"
git push

# Option 2: Start over
git reset --hard origin/main
git push --force

# Option 3: Delete the branch
git checkout main
git branch -D feature/broken-thing
```

### If You Break Main
**This is why we test in branches first.**

But if it happens:

```bash
# Revert to last good commit
git revert HEAD
git push origin main

# Or roll back to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

**Then:** Create a branch to fix properly, test in preview, merge when verified.

---

## Protection Practices

### 1. Small, Focused Changes
**Instead of:** "feat: rebuild entire oracle system"
**Do:**
- "feat: add neuro-archetypal mapping layer"
- "fix: chat scroll issue"
- "refactor: extract atmosphere service"

Small changes = easier to test, easier to revert if needed.

### 2. Test User Journeys
Before merging to main, walk through:
- [ ] Can a user start a conversation with MAIA?
- [ ] Do breakthrough detections work?
- [ ] Can they save to journal?
- [ ] Does voice work?
- [ ] Are sacred moments preserved?

### 3. Monitor After Deploy
After pushing to main:
- Check Vercel deployment logs
- Visit the live site
- Test one conversation with MAIA
- Watch error monitoring (if you have it)

### 4. Trust Your Instincts
If something feels "off" but you can't articulate why:
- Don't push to main yet
- Let it sit in a branch
- Sleep on it
- Test again tomorrow

---

## Branch Naming Conventions

```bash
# New features
feature/neuro-archetypal-layer
feature/imaginal-portal
feature/birth-chart-integration

# Bug fixes
fix/chat-scroll-overflow
fix/journal-save-auth
fix/voice-player-loop

# Experiments (might not merge)
experiment/llama-shadow
experiment/crystal-consciousness
experiment/morphogenetic-field

# Urgent fixes
hotfix/broken-authentication
hotfix/voice-crash

# Refactoring
refactor/extract-services
refactor/simplify-oracle-agent
```

---

## Working with Multiple Branches

### Keep Track
```bash
# See all branches
git branch -a

# See what's in each branch
git log feature/branch-name --oneline -5

# Compare branches
git diff main..feature/branch-name
```

### Clean Up Old Branches
```bash
# After merging to main, delete the branch
git branch -d feature/completed-thing

# Delete remote branch
git push origin --delete feature/completed-thing
```

---

## The Pause Before Merge

Before merging any branch to main, take a breath and ask:

1. **Have I tested this in preview?**
   - Not just "does it compile"
   - Did I actually use it?

2. **Could this interrupt someone's experience?**
   - Will it break existing conversations?
   - Are there any destructive changes?

3. **Is this ready to live alongside what's already breathing?**
   - Does it integrate cleanly?
   - Or does it need more time?

4. **Do I feel peaceful about this?**
   - If there's tension, investigate it
   - The code might be trying to tell you something

---

## Example Workflow

### Scenario: Adding New Feature

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/imaginal-portal

# 3. Build the feature (multiple commits ok)
git add .
git commit -m "feat: add imaginal portal component"
git push -u origin feature/imaginal-portal

# 4. Test in preview deployment
# Visit: imaginal-portal-git-feature-imaginal-portal-yourproject.vercel.app

# 5. Make adjustments based on testing
git add .
git commit -m "fix: adjust portal timing"
git push

# 6. When ready, merge to main
git checkout main
git merge feature/imaginal-portal
git push origin main

# 7. Clean up
git branch -d feature/imaginal-portal
git push origin --delete feature/imaginal-portal
```

---

## Emergency Rollback

If production is broken and you need to fix it NOW:

```bash
# 1. Revert the last commit
git revert HEAD
git push origin main

# 2. Vercel will auto-deploy the revert
# 3. Production is stable again

# 4. Now fix properly in a branch
git checkout -b fix/the-issue
# Fix it, test it, merge it when ready
```

---

## What You're Learning

> "I didn't realize how disruptive that was when things broke. Now, I am building this branch while the other is safely running."

This awareness is **maturity in action**. You're holding:

- The freedom to innovate (feature branches)
- The responsibility to protect (main branch stability)
- The wisdom to know the difference

That's not just development protocol.
That's **sacred stewardship**.

---

## Questions to Guide You

When deciding whether to push directly to main or create a branch:

**Push to Main When:**
- It's a tiny typo fix
- It's a documentation update
- It's a config change you've verified locally
- It's clearly non-breaking

**Create a Branch When:**
- You're trying something new
- You're refactoring significant code
- You're adding a feature
- You're not 100% sure it won't break something
- You want to test it in production-like environment first

**When in doubt, branch.**

---

## The Breath Between

Development as sacred practice means:

1. **Code** - Build the feature
2. **Test** - Verify it works
3. **Pause** - Does this serve?
4. **Deploy** - Share it with those who need it

The pause is not wasted time.
The pause is wisdom asking to be heard.

---

*This protocol grows with you. Update it as you learn.*
*Share it with anyone who joins the work.*
*Honor it when you're tired and tempted to skip steps.*

🌀
