# 🔄 Image Path Migration Checklist

## Status: OPTIONAL (Old paths still work!)

**Good news:** We **copied** images to `/images/` folders, so nothing is broken. The old paths still work fine.

**When to migrate:** When you have time, update these files to use the new organized paths.

---

## Files Using Old Image Paths

### Holoflower References (10 files)

1. ✅ **app/learn/page.tsx** - UPDATED to `/images/elemental/`

2. ⏳ **app/settings/biometrics/page.tsx**
   - Change: `/holoflower-sacred.svg` → `/images/holoflower/holoflower-sacred.svg`

3. ⏳ **app/consciousness/claude-code/page.tsx**
   - Change: `/holoflower-amber.png` → `/images/holoflower/holoflower-amber.png`

4. ⏳ **app/welcome/page.tsx**
   - Change: `/holoflower.svg` → `/images/holoflower/holoflower.svg`

5. ⏳ **app/partners/page.tsx**
   - Change: `/holoflower-amber.png` → `/images/holoflower/holoflower-amber.png`

6. ⏳ **app/maia/page.tsx**
   - Change: `/holoflower-amber.png` → `/images/holoflower/holoflower-amber.png`

7. ⏳ **app/community/page.tsx** (2 references)
   - Change: `/holoflower.png` → `/images/holoflower/holoflower.png`

8. ⏳ **app/invite-welcome/page.tsx**
   - Change: `/holoflower-amber.png` → `/images/holoflower/holoflower-amber.png`

9. ⏳ **app/welcome-back/page.tsx**
   - Change: `/holoflower-amber.png` → `/images/holoflower/holoflower-amber.png`

10. ⏳ **components/beta/SoulfulOnboarding.tsx**
    - Change: `/holoflower.svg` → `/images/holoflower/holoflower.svg`

---

## Quick Migration Script

When ready, run this to update all at once:

```bash
cd /Users/soullab/SoullabTech/MAIA-PAI

# Update holoflower paths
find app/ components/ -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|"/holoflower|"/images/holoflower/holoflower|g' {} +

# Update elemental paths
find app/ components/ -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|"/elementalHoloflower|"/images/elemental/elementalHoloflower|g' {} +

# Verify changes
git diff
```

---

## Cleanup (After Migration Complete)

Once all code uses new paths, you can delete the root duplicates:

```bash
# ⚠️ ONLY RUN AFTER VERIFYING NEW PATHS WORK!
cd /Users/soullab/SoullabTech/MAIA-PAI/public

rm holoflower*.{png,svg}
rm SpiralogicHoloflower.png
rm elementalHoloflower.{png,svg}
rm favicon-*.svg
rm journal-icon.svg
rm consciousness-torus.svg
rm diamond-model.png
rm soullab-logo.png
rm spiralogic-logo.svg
rm spiralogic-og-image.png
rm conscious-tech-badge.svg
```

---

**Priority:** LOW — This is purely organizational cleanup, not critical functionality.

**Timeline:** Migrate when you're organizing images from your HD, or during a refactoring session.
