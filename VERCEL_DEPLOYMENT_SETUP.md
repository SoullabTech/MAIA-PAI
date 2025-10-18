# Vercel Deployment Control Setup

## The Problem

Every push to `main` automatically deploys to production, even if you haven't tested it yet. This means bugs can reach users before you catch them.

## The Solution: Three-Tier Deployment

```
feature/* → Preview URLs (test wild ideas)
    ↓
   main → Staging URL (verify it works)
    ↓
production → Live Site (only when ready)
```

---

## Step-by-Step Setup

### 1. Create Production Branch

```bash
# In your local repository
git checkout main
git pull origin main

# Create production branch from current main
git checkout -b production
git push -u origin production
```

### 2. Configure Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/[your-team]/[your-project]
   - Click "Settings" tab

2. **Change Production Branch**
   - In left sidebar, click "Git"
   - Find "Production Branch" setting
   - Change from `main` to `production`
   - Click "Save"

3. **Verify Deployment Settings**
   - Still in Settings → Git
   - Confirm:
     - ✅ Production Branch: `production`
     - ✅ Preview Deployments: Enabled for all other branches
     - ✅ Auto-deploy: Enabled (but only for production branch)

### 3. Update Your Local Git Config

```bash
# Set production as the deployment branch
git config branch.production.description "Live production - only merge after testing in main"
git config branch.main.description "Staging - test here before promoting to production"
```

---

## New Workflow

### Working on a Feature

```bash
# 1. Create feature branch
git checkout main
git pull origin main
git checkout -b feature/new-thing

# 2. Build your feature
# ... make changes ...
git add .
git commit -m "feat: describe what you built"
git push -u origin feature/new-thing

# 3. Test in preview deployment
# Vercel automatically creates:
# new-thing-git-feature-new-thing-yourproject.vercel.app

# 4. When ready, merge to main
git checkout main
git merge feature/new-thing
git push origin main
```

### Main Branch = Staging

After pushing to `main`:

```bash
# Vercel creates staging deployment:
# yourproject-git-main-yourproject.vercel.app

# Test thoroughly:
# - Click through all features
# - Check console for errors
# - Test on mobile
# - Verify nothing broke
```

### Promoting to Production

Only when you're confident:

```bash
# 1. Merge main into production
git checkout production
git pull origin production
git merge main

# 2. Push to production
git push origin production

# This triggers deployment to your live domain:
# yourproject.vercel.app
```

---

## Quick Reference

### Daily Development
```bash
# Start new feature
git checkout -b feature/name

# Push for preview
git push -u origin feature/name
# → Test at: name-git-feature-name-project.vercel.app

# Merge to staging
git checkout main
git merge feature/name
git push origin main
# → Test at: project-git-main-project.vercel.app

# Promote to production (only when ready!)
git checkout production
git merge main
git push origin production
# → Live at: project.vercel.app
```

### Emergency Rollback

If production breaks:

```bash
# Revert production to previous working state
git checkout production
git revert HEAD
git push origin production

# Or reset to specific commit
git reset --hard <last-good-commit>
git push --force origin production
```

---

## Understanding the URLs

### Production Domain
- **URL:** `maia-pai.vercel.app` (or your custom domain)
- **Branch:** `production` only
- **When updated:** Only when you merge main → production
- **Who sees it:** All users

### Staging (Main Branch)
- **URL:** `maia-pai-git-main-spiralogic-oracle.vercel.app`
- **Branch:** `main`
- **When updated:** Every push to main
- **Who sees it:** You (for testing)

### Feature Previews
- **URL:** `maia-pai-git-feature-name-spiralogic-oracle.vercel.app`
- **Branch:** Any feature branch
- **When updated:** Every push to that branch
- **Who sees it:** You (for experimenting)

---

## Vercel Dashboard Controls

### Viewing Deployments

1. Go to your project in Vercel
2. Click "Deployments" tab
3. You'll see:
   - 🟢 **Production** - Currently live
   - 🟡 **Preview** - All other branches
   - ⚠️ **Failed** - Build errors

### Manual Promotion

If you want to promote a specific deployment without merging:

1. Find the deployment in "Deployments" tab
2. Click the deployment
3. Click "⋮" menu → "Promote to Production"

**Use this sparingly** - prefer the git workflow above.

### Rollback in Dashboard

If you need to quickly rollback:

1. Go to "Deployments" tab
2. Find the last good deployment
3. Click "⋮" menu → "Promote to Production"

---

## Protection Settings (Optional)

For extra safety, you can require authentication:

1. **Settings → Deployment Protection**
2. Enable "Vercel Authentication"
3. Choose:
   - **All Deployments** - Require login even for previews
   - **Production Only** - Require login only for live site

**Recommendation:** Leave this OFF for beta testing, so users can access freely.

---

## Environment Variables

Make sure these are set correctly in Vercel:

1. **Settings → Environment Variables**
2. Check that sensitive variables are:
   - ✅ Set for "Production" environment
   - ✅ Set for "Preview" environment (if needed for testing)
   - ✅ Not visible in build logs

**Important:** Preview deployments use "Preview" environment variables, not "Production" ones.

---

## Testing Before Production

### Checklist Before Promoting to Production

```bash
# 1. Verify main staging deployment works
open https://[your-project]-git-main-[your-project].vercel.app

# 2. Run through user journeys
[ ] Can start conversation with MAIA
[ ] Can save to journal
[ ] Voice works (if enabled)
[ ] Settings save correctly
[ ] No console errors

# 3. Check Vercel logs
# In dashboard, look for:
[ ] No error logs
[ ] Build completed successfully
[ ] All routes responding

# 4. Only then promote
git checkout production
git merge main
git push origin production
```

---

## Troubleshooting

### "I pushed to production by accident!"

```bash
# Revert immediately
git checkout production
git revert HEAD
git push origin production

# Then fix in main, test, and re-promote when ready
```

### "Main isn't deploying to staging URL"

Check Vercel Settings → Git:
- Confirm "Preview Deployments" is enabled
- Confirm `main` is not set as "Production Branch"

### "Feature branch isn't creating preview"

Check that:
- Branch is pushed to GitHub
- Vercel is connected to your repository
- "Deploy Hooks" aren't restricting deployments

---

## Summary

**Before:**
- Push to main → Instant production (scary!)

**After:**
- Push to feature → Preview (safe!)
- Merge to main → Staging (verify!)
- Merge to production → Live (confident!)

This gives you **control** without slowing down development.

---

## Setting This Up Right Now

```bash
# 1. Create production branch
git checkout main
git checkout -b production
git push -u origin production

# 2. Go to Vercel Settings → Git
# 3. Change "Production Branch" to "production"

# Done! You now have staging + production control.
```

---

*Questions? Check the Vercel docs or ask CC to help troubleshoot.*
