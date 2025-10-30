# Git Workflow - MAIA Development

**CRITICAL: Protect production (soullab.life) from breaking changes**

---

## Branch Strategy

```
main (production)     → soullab.life (ONLY merge when 100% working)
  ↑
dev (development)     → dev-soullab.vercel.app (test here first)
  ↑
feature/* branches    → auto-preview deployments
```

---

## Daily Workflow

### 1. Start Work (Always from dev)

```bash
# Make sure you're on dev and it's up to date
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Work and Commit

```bash
# Make changes, test locally on localhost:3000
git add .
git commit -m "Clear description of what changed"

# Push to your feature branch (creates preview deployment)
git push -u origin feature/your-feature-name
```

Vercel will automatically create a preview deployment at:
`https://maia-pai-feature-your-feature-name.vercel.app`

### 3. Merge to Dev (For Testing)

```bash
# When feature is working locally
git checkout dev
git pull origin dev
git merge feature/your-feature-name
git push origin dev
```

This deploys to **dev preview URL** for testing.

### 4. Merge to Main (Production Release)

**ONLY when everything is tested and working on dev!**

```bash
git checkout main
git pull origin main
git merge dev
git push origin main
```

This deploys to **soullab.life** (production).

---

## Vercel Configuration

### In Vercel Dashboard:

1. Go to Project Settings → Git
2. Set **Production Branch**: `main`
3. Enable **Preview Deployments** for:
   - `dev` branch → Get custom URL like `dev-soullab.vercel.app`
   - All other branches → Auto-preview

---

## Rules

✅ **DO:**
- Always work on feature branches
- Test locally first (`npm run dev`)
- Merge to `dev` for testing on preview
- Only merge to `main` when 100% working

❌ **DON'T:**
- Never push directly to `main` (unless emergency hotfix)
- Never merge broken code to `dev`
- Never skip testing on dev preview before production

---

## Current Branch Setup

- `main` - Production (soullab.life)
- `dev` - Development (preview deployment)

To check your current branch:
```bash
git branch
```

To switch branches:
```bash
git checkout dev      # Switch to dev
git checkout main     # Switch to main
```

---

## Emergency Hotfix

If production is broken and you need immediate fix:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# Make minimal fix
git add .
git commit -m "HOTFIX: Brief description"
git push -u origin hotfix/critical-fix

# Merge directly to main
git checkout main
git merge hotfix/critical-fix
git push origin main

# Also merge back to dev
git checkout dev
git merge hotfix/critical-fix
git push origin dev
```

---

**Remember: Production is sacred. Test on dev first. Always.**
