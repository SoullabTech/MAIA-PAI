# MAIA Routes Map

**Last Updated:** November 17, 2025
**Golden Tag:** `maia-golden-2025-11-17`

## 🎯 Canonical MAIA (Oracle Interface)

- **File:** `app/maia/page.tsx`
- **Route:** `/maia`
- **Status:** **GOLDEN** – All production changes go here
- **Features:** Amber/brown sacred aesthetic, Oracle conversation, voice interactions, holoflower visualization
- **Production URL:** `soullab.life/maia`

> ⚠️ **IMPORTANT:** This is the ONLY production MAIA. All Oracle interface work happens here.

---

## 🧪 Experimental Interfaces

### MAIA Journaling Prototype
- **File:** `apps/web/app/journal-maia/page.tsx`
- **Route:** `/journal-maia` (apps/web app only)
- **Status:** Experimental – jade/green UI, journaling features
- **Note:** Originally at `/maia` in apps/web, moved to prevent confusion

### MAIA Lab Tools
- **File:** `apps/web/app/maia/lab/page.tsx`
- **Route:** `/maia/lab` (apps/web app only)
- **Status:** Development tools and baseline interface

### Archived/Backup Files
- `apps/web/app/maia/page-journaling-backup.tsx` – Original jade journaling interface
- `archive/maia-legacy/` – Legacy Maya interfaces

---

## 🏗️ Development Rules

### When editing MAIA core features:
1. ✅ **Always work in:** `app/maia/page.tsx`
2. ✅ **Test on route:** `/maia`
3. ✅ **Deploy from:** Main `app/` directory structure

### When creating MAIA experiments:
1. ✅ **Use apps/web with unique routes:** `/maia-journal`, `/maia-lab`, etc.
2. ✅ **Never use:** `/maia` route in apps/web
3. ✅ **Document clearly** as experimental

### Before making changes:
1. Check you're in the right directory: `app/maia/` not `apps/web/app/maia/`
2. Verify route will be `/maia` for production changes
3. Test that production MAIA still works at `soullab.life/maia`

---

## 🔒 Architecture Insights

The confusion happened because:
- **Production MAIA** lives in the main `app/` directory (Next.js App Router)
- **Experimental apps** live in `apps/web/app/` (workspace sub-app)
- Both could serve `/maia` route, causing hijacking

**Solution:** Quarantined all experimental MAIA routes to unique paths, preserving only the canonical `/maia`.

---

## 📞 Contact

If you or an AI assistant get confused about MAIA paths:
1. Check this document first
2. Verify the golden tag: `git checkout maia-golden-2025-11-17`
3. Remember: **Real MAIA = `app/maia/page.tsx`**

> "Trust your heretic sense of direction" - Kelly, November 2025