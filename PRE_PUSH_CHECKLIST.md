# Pre-Push Checklist: Amber Consistency & UI Verification

## Overview
This checklist ensures amber theme consistency, icon visibility, and proper UI states before deploying changes.

---

## 1. Color Consistency Verification

### Bottom Navigation Components

**Files to check:**
- [`components/holoflower/BottomNavigation.tsx`](components/holoflower/BottomNavigation.tsx)
- [`components/holoflower/HoloflowerBottomNav.tsx`](components/holoflower/HoloflowerBottomNav.tsx)

**Verify:**
- [ ] Inactive icons use `#F59E0B` (amber-500)
- [ ] Inactive labels use `#F59E0B80` (50% opacity amber)
- [ ] Active icons use item-specific colors
- [ ] Inline `style` props are present (prevents Tailwind override)
- [ ] No stray `opacity-*` classes on icon containers

**Quick Test:**
```bash
# Search for potential color inconsistencies
grep -r "text-gray\|text-white" components/holoflower/BottomNavigation.tsx
grep -r "text-gray\|text-white" components/holoflower/HoloflowerBottomNav.tsx
```

Expected: **No matches** (all colors should be inline or amber variants)

---

## 2. Icon Visibility Check

### Global Icon Fix
**File:** [`app/icon-fix.css`](app/icon-fix.css)

**Verify:**
- [ ] All Lucide icons have `stroke: currentColor`
- [ ] Bottom navigation icons inherit proper colors
- [ ] No white-on-white or invisible icon issues

**Manual Test in Browser:**
```javascript
// Open DevTools Console, run:
document.querySelectorAll('svg[class*="lucide"]').forEach(svg => {
  const stroke = window.getComputedStyle(svg).stroke;
  console.log('Icon stroke:', stroke);
});
```

Expected: All icons should show proper stroke colors (not `none` or `transparent`)

---

## 3. Opacity Issues Audit

### Known Safe Opacity Usage
These are **intentional** and should remain:

**Glow Effects:**
- [`components/holoflower/HoloflowerCore.tsx:113-114`](components/holoflower/HoloflowerCore.tsx:113-114)
  - `opacity-50` and `opacity-30` for gradient glows

**Tooltips:**
- [`components/ui/MenuBar.tsx`](components/ui/MenuBar.tsx)
  - `opacity-0 group-hover:opacity-100` for hover tooltips

**Ghost Layers:**
- [`components/holoflower/IntegratedHoloflowerSystem.tsx:193`](components/holoflower/IntegratedHoloflowerSystem.tsx:193)
  - `opacity-30` for background agent holoflower

### Search for Problematic Opacity
```bash
# Find opacity classes that might mute colors
grep -rn "opacity-\(10\|20\|30\|40\|50\|60\)" components/ \
  --include="*.tsx" \
  | grep -v "group-hover\|animate\|blur\|bg-gradient\|ghost\|tooltip"
```

**Action:** Review each match to ensure it's not muting important UI elements

---

## 4. Theme Transition Testing

### Dark/Light Mode Check
**File:** [`components/theme/ThemeToggle.tsx`](components/theme/ThemeToggle.tsx)

**Manual Test Sequence:**
1. [ ] Open app in browser at `http://localhost:3000`
2. [ ] Toggle to Light mode
   - [ ] Bottom nav icons visible and amber-colored when inactive
   - [ ] Active icons show proper item colors
3. [ ] Toggle to Dark mode
   - [ ] All icons remain visible with good contrast
   - [ ] Amber theme consistent
4. [ ] Toggle to System mode
   - [ ] Follows OS theme preference correctly

**Check CSS Variables:**
```bash
# Verify dark mode variables in globals.css
grep -A 5 "dark:" app/globals.css
```

---

## 5. Bottom Navigation States

### Hover & Active States
**Test in browser:**

1. **Hover State:**
   - [ ] Hover over each bottom nav icon
   - [ ] Icon color changes smoothly
   - [ ] No delay or flicker
   - [ ] Background highlights appear

2. **Active State:**
   - [ ] Navigate to each route (/, /journal, /dream)
   - [ ] Active icon shows item-specific color
   - [ ] Active background indicator appears
   - [ ] Smooth transition between states

3. **Settings Special Indicator:**
   - [ ] Settings button has gradient top bar
   - [ ] Bar animates (pulse/breathing effect)
   - [ ] Remains visible in all themes

### Contrast Verification
Use browser DevTools to check contrast ratios:

```javascript
// Check inactive icon contrast
const inactiveIcon = document.querySelector('[style*="#F59E0B"]');
// Should have minimum 4.5:1 contrast against background
```

---

## 6. Build & Runtime Checks

### Pre-Build
```bash
# Install dependencies if needed
pnpm install

# Type check
pnpm typecheck
```

**Expected:** No TypeScript errors

### Build Test
```bash
# Full production build
pnpm build
```

**Check for:**
- [ ] No build errors
- [ ] No warnings about missing styles
- [ ] CSS bundle includes icon-fix.css
- [ ] Tailwind compilation successful

### Dev Server Test
```bash
# Start dev server
pnpm dev
```

**Manual Browser Checklist:**
1. [ ] Open `http://localhost:3000` (or shown port)
2. [ ] Check console for errors
3. [ ] Verify bottom nav appears
4. [ ] Click through all nav items
5. [ ] Test on mobile viewport (DevTools)
6. [ ] Test both landscape and portrait

---

## 7. Mobile-Specific Tests

### Responsive Breakpoints
**Test at these widths:**
- [ ] 375px (iPhone SE)
- [ ] 390px (iPhone 12/13)
- [ ] 768px (iPad)
- [ ] 1024px (Desktop)

**Verify:**
- [ ] Icons properly sized at each breakpoint
- [ ] Labels remain readable
- [ ] Touch targets at least 44x44px
- [ ] No text truncation

### Touch Interactions
On physical device or DevTools mobile emulation:
- [ ] Tap each bottom nav button
- [ ] Haptic feedback works (if implemented)
- [ ] No double-tap required
- [ ] No accidental activations

---

## 8. Cross-Browser Testing

**Minimum browsers to test:**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)

**Verify in each:**
- [ ] Icons render correctly
- [ ] Amber colors match
- [ ] Transitions smooth
- [ ] No layout shifts

---

## 9. Performance Checks

### Animation Performance
```javascript
// In DevTools Performance tab, record while:
// 1. Switching theme
// 2. Navigating bottom nav
// 3. Hovering over icons

// Check for:
// - Frame drops below 60fps
// - Layout thrashing
// - Excessive repaints
```

**Goal:** Maintain 60fps during all transitions

---

## 10. Accessibility Audit

### ARIA & Keyboard Navigation
- [ ] Tab through bottom navigation
- [ ] Each item focusable
- [ ] Focus indicator visible
- [ ] Enter/Space activates items
- [ ] ARIA labels present

### Color Contrast (WCAG AA)
**Minimum contrast ratios:**
- [ ] Inactive icons: 4.5:1
- [ ] Active icons: 4.5:1
- [ ] Labels: 4.5:1
- [ ] Background elements: 3:1

Use DevTools Lighthouse or axe DevTools for automated check.

---

## Quick Pre-Push Command Sequence

```bash
# 1. Verify no console errors
pnpm dev &
# Wait for server to start, open browser, check console

# 2. Type check
pnpm typecheck

# 3. Build test
pnpm build

# 4. Search for potential issues
grep -r "text-white\|text-gray" components/holoflower/ --include="*.tsx"
grep -rn "opacity-[0-5]0" components/ --include="*.tsx" | grep -v "group-hover\|tooltip\|glow"

# 5. If all clear, commit
git add .
git commit -m "feat: verify amber consistency and UI states"
```

---

## Issue Resolution Guide

### If Icons Are Invisible:
1. Check [`app/icon-fix.css`](app/icon-fix.css) is imported in [`app/globals.css`](app/globals.css:9)
2. Verify `stroke: currentColor` in icon-fix.css
3. Check parent container doesn't have `opacity-0` or `hidden`

### If Colors Look Dull:
1. Search for parent `opacity-*` classes
2. Check for `text-opacity-*` utilities
3. Verify inline `style` colors aren't overridden
4. Check for `mix-blend-mode` or `filter` on ancestors

### If Hover States Don't Work:
1. Verify `group` class on parent
2. Check `group-hover:` pseudo-class spelling
3. Ensure no `pointer-events-none` on interactive elements

### If Theme Toggle Breaks:
1. Check localStorage isn't blocked
2. Verify `next-themes` provider wraps app
3. Check for conflicting dark mode utilities

---

## Sign-Off

**Before pushing, confirm:**
- [ ] All checklist items completed
- [ ] Manual testing in browser passed
- [ ] No console errors or warnings
- [ ] Build succeeds without errors
- [ ] Mobile viewport tested
- [ ] Documentation updated (if needed)

**Tested by:** _______________
**Date:** _______________
**Branch:** _______________

---

## Additional Resources

- **Tailwind Amber Palette:** `#F59E0B` = `amber-500`
- **Icon Library:** [Lucide React](https://lucide.dev/)
- **Animation Library:** [Framer Motion](https://www.framer.com/motion/)
- **Theme System:** [next-themes](https://github.com/pacocoursey/next-themes)

---

*Last updated: Generated by Claude Code*
