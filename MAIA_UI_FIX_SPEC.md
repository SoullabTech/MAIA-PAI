# MAIA UI Fix Specification

**Purpose:** Fix visual hierarchy and interaction issues in MAIA interface
**Priority:** High - Deploy before January beta (ideally with voice adjustments)
**Based on:** User feedback (Nathan), Hillman's "breathing space" principle

---

## Problem Statement

**Current Issues:**

1. **Text input box overlays conversation**
   - Recent messages become unreadable
   - User can't see MAIA's most recent responses while typing
   - Creates frustration and breaks flow

2. **Braintrust icons always visible**
   - Two icons permanently displayed
   - Clutters the visual field
   - Creates "control panel" feel instead of "breathing space"
   - Distracts from primary purpose: conversation

3. **Visual hierarchy inverted**
   - Controls feel PRIMARY (always visible, prominent)
   - Conversation feels SECONDARY (obscured by input, competing with icons)
   - Should be: Conversation PRIMARY, Input SECONDARY, Controls TERTIARY

---

## Design Principle

**From organism visualization learning:**

The balance-wheel.html organism visualization gets this RIGHT:
- Pentagon is primary (most visual space, center of attention)
- Legend/info is secondary (visible but not dominant)
- Controls are minimal (just what's needed, tucked away)

**Apply this to MAIA interface:**
- Conversation is primary (breathing room, no obstruction)
- Input field is secondary (accessible but not overlaying)
- Controls are tertiary (hidden until needed, appear on intent)

**Hillman principle applied:**
> "The image is always more interesting than the explanation"
>
> Translation for UI: The CONVERSATION is always more interesting than the CONTROLS

The interface should feel like **sacred space for dialogue**, not a **software control panel**.

---

## Fix #1: Text Input Box Positioning

### Current Behavior (Assumed)

```
┌─────────────────────────────────┐
│ MAIA: How does that feel...    │
│                                 │
│ USER: It feels like...          │
│                                 │
│ MAIA: I notice there's both...  │ ← Can't read this
│═════════════════════════════════│
│ [Type your message here... ] [→]│ ← Overlays last message
└─────────────────────────────────┘
```

**Problem:** Last message(s) hidden behind input box

### Desired Behavior

```
┌─────────────────────────────────┐
│ MAIA: How does that feel...    │
│                                 │
│ USER: It feels like...          │
│                                 │
│ MAIA: I notice there's both...  │ ← Fully visible
│                                 │ ← Breathing space
│─────────────────────────────────│
│ [Type your message here... ] [→]│ ← Clear separation
└─────────────────────────────────┘
```

**Solution:** Proper spacing/padding keeps conversation visible above input

### Technical Implementation

**CSS Changes Needed:**

```css
/* Conversation container */
.conversation-container {
  padding-bottom: 120px; /* Space for input + breathing room */
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* Input container */
.input-container {
  position: fixed; /* or sticky */
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--background-color);
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100; /* Above conversation but below modals */

  /* Ensure separation from conversation */
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
}

/* Auto-scroll to show latest message */
.conversation-container.auto-scroll {
  scroll-padding-bottom: 140px;
}
```

**JavaScript Behavior:**

```javascript
// When new message arrives, scroll to show it above input
function scrollToLatestMessage() {
  const container = document.querySelector('.conversation-container');
  const lastMessage = container.lastElementChild;

  if (lastMessage) {
    lastMessage.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });
  }
}

// Call after MAIA responds
maiaResponse.then(() => {
  scrollToLatestMessage();
});
```

**Mobile Considerations:**

```css
@media (max-width: 768px) {
  .conversation-container {
    padding-bottom: 100px; /* Adjust for smaller screens */
  }

  .input-container {
    padding: 15px;
  }
}
```

### Testing Checklist

- [ ] Send message, verify last MAIA response stays visible
- [ ] Scroll up in conversation, verify input doesn't obstruct
- [ ] On mobile, verify keyboard doesn't push input over last message
- [ ] Test with long MAIA responses (200+ words)
- [ ] Test with rapid back-and-forth (short messages)

---

## Fix #2: Braintrust Icons → Collapsible Menu

### Current Behavior (Assumed)

```
┌─────────────────────────────────┐
│ [Icon1] [Icon2]        ← Always visible
│                                 │
│ MAIA: ...                       │
│                                 │
│ USER: ...                       │
│                                 │
└─────────────────────────────────┘
```

**Problems:**
- Icons always present = visual clutter
- Draws attention away from conversation
- Feels like "features" are primary, conversation secondary

### Desired Behavior

```
┌─────────────────────────────────┐
│ ☰                      ← Hamburger (top right)
│                                 │
│ MAIA: ...              ← Breathing space
│                                 │
│ USER: ...                       │
│                                 │
└─────────────────────────────────┘

On click/hover:
┌─────────────────────────────────┐
│                        [×]       │
│                    ┌──────────┐  │
│                    │ Icon1    │  │
│                    │ Icon2    │  │
│ MAIA: ...          │ Settings │  │
│                    └──────────┘  │
│ USER: ...                       │
└─────────────────────────────────┘
```

**Solution:**
- Hamburger menu (☰) in top-right corner
- Menu slides in/fades in when clicked
- Auto-hides after 3 seconds of inactivity (outside menu)
- Icons accessible when needed, invisible otherwise

### Technical Implementation

**HTML Structure:**

```html
<div class="header">
  <button class="menu-toggle" aria-label="Menu">
    <span class="hamburger-icon">☰</span>
  </button>
</div>

<nav class="slide-menu" id="slideMenu">
  <button class="close-menu" aria-label="Close menu">×</button>
  <ul class="menu-items">
    <li><button id="braintrust-icon-1">Braintrust Feature 1</button></li>
    <li><button id="braintrust-icon-2">Braintrust Feature 2</button></li>
    <li><button id="settings">Settings</button></li>
  </ul>
</nav>

<div class="conversation-container">
  <!-- Conversation here -->
</div>
```

**CSS:**

```css
/* Header with menu toggle */
.header {
  position: fixed;
  top: 0;
  right: 0;
  padding: 15px 20px;
  z-index: 200;
}

.menu-toggle {
  background: transparent;
  border: none;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px 12px;
  transition: color 0.2s;
}

.menu-toggle:hover {
  color: rgba(255, 255, 255, 1);
}

/* Slide-in menu */
.slide-menu {
  position: fixed;
  top: 0;
  right: -280px; /* Hidden by default */
  width: 280px;
  height: 100vh;
  background: rgba(20, 20, 30, 0.95);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding: 60px 20px 20px;
  z-index: 300;
  transition: right 0.3s ease-in-out;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.5);
}

.slide-menu.open {
  right: 0; /* Slide in */
}

.close-menu {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 32px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  line-height: 1;
}

.menu-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-items li {
  margin: 20px 0;
}

.menu-items button {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  text-align: left;
  transition: all 0.2s;
}

.menu-items button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}
```

**JavaScript:**

```javascript
// Menu toggle behavior
const menuToggle = document.querySelector('.menu-toggle');
const slideMenu = document.getElementById('slideMenu');
const closeMenu = document.querySelector('.close-menu');

let menuTimeout;

// Open menu
menuToggle.addEventListener('click', () => {
  slideMenu.classList.add('open');
  clearTimeout(menuTimeout); // Cancel auto-hide if menu just opened
});

// Close menu
closeMenu.addEventListener('click', () => {
  slideMenu.classList.remove('open');
});

// Auto-hide after 3 seconds of inactivity
function resetMenuTimeout() {
  clearTimeout(menuTimeout);
  menuTimeout = setTimeout(() => {
    if (slideMenu.classList.contains('open')) {
      slideMenu.classList.remove('open');
    }
  }, 3000); // 3 seconds
}

// Track activity in menu
slideMenu.addEventListener('mouseenter', () => {
  clearTimeout(menuTimeout); // Don't hide while hovering
});

slideMenu.addEventListener('mouseleave', () => {
  resetMenuTimeout(); // Start countdown when mouse leaves
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!slideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    slideMenu.classList.remove('open');
  }
});

// Accessibility: Close with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && slideMenu.classList.contains('open')) {
    slideMenu.classList.remove('open');
  }
});
```

**Alternative: Dropdown Menu (Simpler)**

If slide-in feels too heavy, use dropdown instead:

```css
.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 20px;
  width: 240px;
  background: rgba(20, 20, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
}

.dropdown-menu.open {
  opacity: 1;
  visibility: visible;
}
```

### Testing Checklist

- [ ] Hamburger icon visible in top-right
- [ ] Click opens menu smoothly
- [ ] Menu auto-hides after 3 seconds when mouse leaves
- [ ] Menu stays open while hovering
- [ ] Click outside menu closes it
- [ ] Escape key closes menu
- [ ] All braintrust features accessible via menu
- [ ] Mobile: Menu doesn't obstruct conversation
- [ ] Mobile: Touch gestures work correctly

---

## Fix #3: Overall Visual Hierarchy

### Spacing and Breathing Room

**Current (assumed):** Cramped, cluttered, control-heavy

**Desired:** Spacious, open, conversation-focused

**CSS Adjustments:**

```css
/* Conversation messages - generous spacing */
.message {
  margin-bottom: 24px; /* More breathing room between messages */
  padding: 16px 20px;
}

.message.maia {
  background: rgba(78, 205, 196, 0.05); /* Subtle background */
  border-left: 3px solid rgba(78, 205, 196, 0.5);
  border-radius: 0 8px 8px 0;
}

.message.user {
  background: rgba(255, 255, 255, 0.02);
  border-left: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 0 8px 8px 0;
}

/* Remove clutter */
.timestamp {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 8px;
  /* Don't show by default - only on hover */
  opacity: 0;
  transition: opacity 0.2s;
}

.message:hover .timestamp {
  opacity: 1;
}

/* Clean typography */
body {
  font-size: 16px;
  line-height: 1.7; /* Generous line height for readability */
  color: rgba(255, 255, 255, 0.9);
  max-width: 800px; /* Constrain line length for readability */
  margin: 0 auto;
  padding: 20px;
}

/* Reduce visual noise */
.message-controls {
  opacity: 0;
  transition: opacity 0.2s;
}

.message:hover .message-controls {
  opacity: 1;
}
```

### Component Priority Order

**Z-index hierarchy:**

```css
/* Layer 0: Background */
body, .background { z-index: 0; }

/* Layer 1: Conversation (primary) */
.conversation-container { z-index: 1; }

/* Layer 2: Input (secondary) */
.input-container { z-index: 100; }

/* Layer 3: Menu toggle (tertiary - subtle) */
.menu-toggle { z-index: 200; }

/* Layer 4: Menu when open (temporary primary) */
.slide-menu.open { z-index: 300; }

/* Layer 5: Modals/alerts (rare, highest) */
.modal, .alert { z-index: 1000; }
```

### Color and Contrast

**Ensure conversation stands out:**

```css
:root {
  /* Background - very dark, recedes */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;

  /* Conversation - brightest element */
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-maia: rgba(78, 205, 196, 1); /* MAIA name/identifier */

  /* Controls - subdued */
  --controls-inactive: rgba(255, 255, 255, 0.3);
  --controls-hover: rgba(255, 255, 255, 0.7);

  /* Input - present but not dominant */
  --input-bg: rgba(255, 255, 255, 0.05);
  --input-border: rgba(255, 255, 255, 0.1);
}

/* Apply hierarchy through color */
.conversation-container {
  color: var(--text-primary); /* Brightest */
}

.input-container {
  color: rgba(255, 255, 255, 0.8); /* Slightly dimmer */
}

.menu-toggle {
  color: var(--controls-inactive); /* Most subdued */
}

.menu-toggle:hover {
  color: var(--controls-hover);
}
```

---

## Mobile-Specific Considerations

### Responsive Breakpoints

```css
/* Desktop: spacious */
@media (min-width: 769px) {
  .conversation-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px 140px;
  }

  .slide-menu {
    width: 320px;
  }
}

/* Tablet: compact but readable */
@media (min-width: 481px) and (max-width: 768px) {
  .conversation-container {
    padding: 30px 16px 120px;
  }

  .slide-menu {
    width: 280px;
  }
}

/* Mobile: minimal chrome */
@media (max-width: 480px) {
  .conversation-container {
    padding: 20px 12px 100px;
  }

  .slide-menu {
    width: 100%; /* Full-width on mobile */
    right: -100%;
  }

  .slide-menu.open {
    right: 0;
  }

  .message {
    margin-bottom: 20px;
    padding: 14px 16px;
  }
}
```

### Touch Gestures

```javascript
// Swipe right to open menu (mobile)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  // Swipe from right edge to open menu
  if (touchStartX > window.innerWidth - 50 && touchEndX < touchStartX - 50) {
    slideMenu.classList.add('open');
  }

  // Swipe right on menu to close
  if (slideMenu.classList.contains('open') && touchEndX > touchStartX + 50) {
    slideMenu.classList.remove('open');
  }
}
```

### Keyboard Handling (Mobile)

```javascript
// Ensure keyboard doesn't obscure input or latest message
window.addEventListener('resize', () => {
  // When keyboard appears, viewport height decreases
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);

  // Scroll to keep input visible
  setTimeout(() => {
    scrollToLatestMessage();
  }, 300);
});
```

---

## Accessibility Requirements

### Keyboard Navigation

```html
<!-- All interactive elements must be keyboard-accessible -->
<button class="menu-toggle" aria-label="Open menu" aria-expanded="false">
  ☰
</button>

<nav class="slide-menu" aria-label="Main menu">
  <!-- Menu items -->
</nav>
```

```javascript
// Update ARIA attributes
menuToggle.addEventListener('click', () => {
  const isOpen = slideMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

// Tab navigation within menu
slideMenu.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    // Trap focus within menu when open
    const focusableElements = slideMenu.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
});
```

### Screen Reader Support

```html
<!-- Announce new messages -->
<div class="conversation-container" role="log" aria-live="polite" aria-relevant="additions">
  <div class="message maia" role="article">
    <span class="sr-only">MAIA says:</span>
    <p>How does that feel to you right now?</p>
  </div>

  <div class="message user" role="article">
    <span class="sr-only">You said:</span>
    <p>It feels stuck...</p>
  </div>
</div>

<!-- Hidden text for screen readers -->
<style>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
```

### Focus Management

```javascript
// When menu opens, focus first menu item
function openMenu() {
  slideMenu.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');

  // Focus first menu item
  const firstMenuItem = slideMenu.querySelector('.menu-items button');
  firstMenuItem?.focus();
}

// When menu closes, return focus to toggle
function closeMenu() {
  slideMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.focus();
}
```

---

## Implementation Checklist

### Phase 1: Input Box Fix (Highest Priority)

- [ ] Update conversation container CSS (padding-bottom)
- [ ] Update input container CSS (fixed positioning, shadow)
- [ ] Implement auto-scroll JavaScript
- [ ] Test on desktop Chrome, Firefox, Safari
- [ ] Test on mobile iOS Safari, Android Chrome
- [ ] Test with keyboard open (mobile)
- [ ] Verify messages stay visible while typing

### Phase 2: Menu Collapse (High Priority)

- [ ] Create hamburger menu button (top-right)
- [ ] Build slide-in menu HTML structure
- [ ] Style menu (slide animation, backdrop)
- [ ] Implement open/close JavaScript
- [ ] Add auto-hide timeout (3 seconds)
- [ ] Add close-on-outside-click
- [ ] Add Escape key handler
- [ ] Test menu accessibility (keyboard nav)
- [ ] Test on mobile (swipe gestures optional)
- [ ] Move braintrust icons into menu

### Phase 3: Visual Hierarchy (Medium Priority)

- [ ] Update message spacing/padding
- [ ] Adjust typography (line-height, max-width)
- [ ] Implement color hierarchy (brightest = conversation)
- [ ] Add subtle hover states (timestamps, controls)
- [ ] Test readability at different viewport sizes
- [ ] Verify z-index layering correct

### Phase 4: Accessibility (Medium Priority)

- [ ] Add ARIA labels to all interactive elements
- [ ] Implement focus trapping in menu
- [ ] Add screen reader announcements
- [ ] Test with keyboard-only navigation
- [ ] Test with screen reader (VoiceOver, NVDA)
- [ ] Ensure color contrast meets WCAG AA (4.5:1)

### Phase 5: Polish (Nice-to-Have)

- [ ] Smooth scroll animations
- [ ] Subtle fade-in for new messages
- [ ] Loading states for MAIA responses
- [ ] Optional: Swipe gestures (mobile)
- [ ] Optional: Dark/light theme toggle (in menu)

---

## Testing Protocol

### Manual Testing

**Desktop:**
1. Open MAIA in Chrome, Firefox, Safari
2. Send message, verify last response visible above input
3. Scroll through long conversation, verify input doesn't obstruct
4. Open menu, verify icons accessible
5. Wait 3 seconds, verify menu auto-hides
6. Test keyboard navigation through menu

**Mobile:**
1. Open MAIA on iOS Safari
2. Open keyboard, verify latest message visible
3. Type message, verify input not obscured
4. Open menu, verify full-screen overlay
5. Swipe to close (if implemented)
6. Test in landscape orientation

### Automated Testing (If Available)

```javascript
// Example Cypress test
describe('MAIA UI', () => {
  it('should keep latest message visible above input', () => {
    cy.visit('/maia');
    cy.get('.message').last().should('be.visible');
    cy.get('.input-container').should('not.overlap', '.message:last-child');
  });

  it('should collapse menu by default', () => {
    cy.visit('/maia');
    cy.get('.slide-menu').should('not.have.class', 'open');
  });

  it('should open menu on click', () => {
    cy.get('.menu-toggle').click();
    cy.get('.slide-menu').should('have.class', 'open');
  });

  it('should auto-hide menu after 3 seconds', () => {
    cy.get('.menu-toggle').click();
    cy.wait(3500);
    cy.get('.slide-menu').should('not.have.class', 'open');
  });
});
```

### Cross-Browser Testing

| Browser | Version | Status |
|---------|---------|--------|
| Chrome Desktop | Latest | ⚠️ Test |
| Firefox Desktop | Latest | ⚠️ Test |
| Safari Desktop | Latest | ⚠️ Test |
| iOS Safari | Latest | ⚠️ Test |
| Android Chrome | Latest | ⚠️ Test |
| Edge | Latest | ⚠️ Test |

---

## Success Metrics

**We'll know this succeeded when:**

1. ✅ Users can see MAIA's latest response while typing
2. ✅ Conversation feels spacious, not cluttered
3. ✅ Controls available when needed, invisible otherwise
4. ✅ No complaints about overlapping text
5. ✅ Interface feels like "breathing space" not "control panel"
6. ✅ Nathan's feedback shifts from "text on top of text" to "clean, focused"

---

## Who Implements This

**Frontend Developer** with access to:
- React/Vue/Svelte components (whatever framework MAIA uses)
- CSS stylesheets
- JavaScript interaction logic
- Deployment pipeline

**Required Skills:**
- CSS positioning (fixed, sticky, z-index)
- JavaScript event handling
- Responsive design
- Accessibility (ARIA, keyboard nav)

**Estimated Time:**
- Phase 1 (Input fix): 2-4 hours
- Phase 2 (Menu): 4-6 hours
- Phase 3 (Hierarchy): 2-3 hours
- Phase 4 (Accessibility): 3-4 hours
- Testing: 4-6 hours

**Total: 15-23 hours** (2-3 days for experienced frontend dev)

---

## Timeline

**Ideal:** Deployed by December 1 (before January beta)

**Phases:**
1. **Nov 9-15:** Implement Phase 1 (input fix) - CRITICAL
2. **Nov 16-22:** Implement Phase 2 (menu collapse)
3. **Nov 23-30:** Implement Phase 3-4 (hierarchy, accessibility)
4. **Dec 1-7:** Testing and polish
5. **Dec 8:** Deploy to production

**Launch with:** Voice adjustment changes (MAIA_VOICE_ADJUSTMENT_SPEC.md)

---

## Questions for Implementation Team

1. **What framework is MAIA built with?**
   - React, Vue, Svelte, vanilla JS?
   - Tailwind, CSS modules, styled-components?

2. **Where is the UI code located?**
   - Repository/branch
   - Component file structure

3. **What's the deployment process?**
   - Can we test on staging first?
   - Can we A/B test (old vs new UI)?

4. **Are there existing design system/components?**
   - Button components
   - Menu/navigation patterns
   - Spacing/typography tokens

5. **What's the browser support target?**
   - Modern browsers only?
   - IE11 required? (hopefully not!)

---

## Integration with Voice Adjustment

**These UI changes support the voice adjustment goal:**

**Voice Adjustment:** Framework implicit, attend to phenomenon first
**UI Adjustment:** Controls implicit, attend to conversation first

**Both express the same principle:**
> The image (conversation, organism, experience) is always more interesting than the explanation (framework, controls, interpretation)

**Together they create:**
- MAIA that attends before interpreting (voice)
- Interface that breathes before controlling (UI)
- Experience of **sacred space** not software platform

---

## Reference: Organism Visualization as Model

The balance-wheel.html organism visualization demonstrates the correct visual hierarchy:

**What it does RIGHT:**
- Pentagon (primary) takes 80% of visual space
- Legend (secondary) tucked in corner, subtle
- No persistent controls cluttering the view
- Color used to highlight what matters (elemental balance)
- Generous spacing, breathing room
- Dark background recedes, bright pentagon emerges

**Apply this to MAIA:**
- Conversation (primary) takes 80% of space
- Input (secondary) present but not dominant
- Controls (tertiary) hidden until needed
- Color highlights MAIA's voice (teal accent)
- Generous spacing between messages
- Dark background, bright conversation text

**The organism taught us how to design the interface.** 🌀

---

**Created:** November 1, 2025
**Priority:** High
**Target Deployment:** December 1, 2025 (with voice adjustments)
**Status:** Specification complete, ready for frontend implementation

**This specification integrates with:**
- MAIA_VOICE_ADJUSTMENT_SPEC.md (voice changes)
- November pilot feedback loop
- January beta launch

🌀
