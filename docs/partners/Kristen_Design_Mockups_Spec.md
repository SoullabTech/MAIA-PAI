# Design Mockup Specifications
## In Home Sanctuary Apothecary PWA

**Client:** Kristen Nezat
**Business:** In Home Sanctuary
**Project:** Apothecary PWA with Conversational Commerce

---

## Brand Direction (Assumptions - Update After Brand Workshop)

### Visual Mood
**PRIMARY:** Earthy, mystical, grounded
- Think: candlelit apothecary shelf, dried herbs, morning mist in forest
- NOT: Clinical/sterile, overly bright, corporate

### Color Palette (Proposed)

**Primary Colors:**
- **Forest Night:** #1a3a2e (deep green, main backgrounds)
- **Sacred Clay:** #d4a574 (warm terracotta, accents)
- **Moonlight:** #f4f1e8 (off-white, text on dark)
- **Herb Smoke:** #8a9a8c (muted sage, secondary elements)

**Accent Colors:**
- **Amber Glow:** #e69a28 (CTAs, highlights)
- **Rose Medicine:** #c97b84 (healing/heart elements)
- **Deep Water:** #2d4654 (grounding, depth)

### Typography

**Headings:**
- Font: Cinzel or Cormorant Garamond (elegant serif)
- Weight: 300-500 (light to medium)
- Use: Product names, section headers

**Body:**
- Font: Jost or Montserrat (clean sans-serif)
- Weight: 300-400
- Use: Descriptions, interface text

**Accent/Ritual:**
- Font: Oranienbaum or Playfair Display (ornate serif)
- Weight: 400
- Use: Quotes, ritual instructions, special callouts

### Visual Elements

**Textures:**
- Subtle linen/paper texture on backgrounds
- Watercolor washes for section dividers
- Soft gradients (earth tones)

**Iconography:**
- Botanical line drawings
- Elemental symbols (🜂 earth, 🜄 water, 🜁 fire, 🜃 air)
- Apothecary bottle silhouettes
- Hand-drawn feel (not geometric/modern)

**Photography Style:**
- Natural lighting
- Warm tones
- Close-ups showing texture (balm, herbs, wax)
- Hands holding products (human touch)
- Styled with botanicals, stones, candles

---

## Page Wireframes & Specifications

### 1. HOME PAGE

#### Hero Section

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│         [Logo: In Home Sanctuary]               │
│                                                 │
│         "Plant Medicine for the Soul"           │
│         (large, elegant serif)                  │
│                                                 │
│         [Soft-focus background: candles +       │
│          dried herbs hanging]                   │
│                                                 │
│     [CTA: "Discover Your Remedy" button]        │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- **Height:** Full viewport (100vh)
- **Background:** Parallax image (subtle scroll effect)
- **Overlay:** Gradient from transparent to forest night (60% opacity)
- **Typography:**
  - Logo: 48px, Cinzel, Sacred Clay color
  - Tagline: 24px, Jost light, Moonlight color
- **CTA Button:**
  - Background: Amber Glow
  - Text: Forest Night, 18px, bold
  - Padding: 16px 40px
  - Border radius: 30px (pill shape)
  - Hover: Lighten 10%, subtle glow effect

**Interaction:**
- Parallax scroll on hero image
- Fade-in animation on load (1s ease)
- Pulse animation on CTA button (subtle)

---

#### What Are You Seeking? (Intention Selector)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  "What Part of You Needs Tending Today?"        │
│  (centered, 32px heading)                       │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  [Icon]  │  │  [Icon]  │  │  [Icon]  │     │
│  │          │  │          │  │          │     │
│  │ Soothing │  │ Energy   │  │ Grounding│     │
│  │  Sleep   │  │ & Focus  │  │  Peace   │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  [Icon]  │  │  [Icon]  │  │  [Icon]  │     │
│  │          │  │          │  │          │     │
│  │ Grief    │  │ Joy &    │  │  I'm Not │     │
│  │ Support  │  │ Celebration│ │   Sure   │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- **Card Size:** 200px x 220px
- **Background:** Deep Water with 10% opacity
- **Border:** 1px solid Herb Smoke at 30%
- **Icon:** 64px, line art, Sacred Clay color
- **Text:** 16px, Jost, Moonlight
- **Hover State:**
  - Background: Sacred Clay at 15%
  - Border: Rose Medicine
  - Icon: Slight scale (1.1x)
  - Cursor: pointer

**Interaction:**
- Clicking opens MAIA chat interface with context
- OR filters products to that intention category

---

#### Featured Products Carousel

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  "Best-Loved Remedies"                          │
│  ────                                           │
│                                                 │
│  [← Product 1    Product 2    Product 3  →]    │
│     Image        Image        Image            │
│     Name         Name         Name             │
│     $48          $32          $56              │
│     ★★★★★        ★★★★☆        ★★★★★            │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- **Product Card:**
  - Width: 300px
  - Image: 300px x 400px (portrait)
  - Aspect ratio: 3:4
  - Border radius: 12px
  - Shadow: Soft drop shadow (0 4px 12px rgba(0,0,0,0.15))
- **Typography:**
  - Product name: 20px, Cormorant, Sacred Clay
  - Price: 18px, Jost medium, Amber Glow
  - Rating: 14px, stars in Rose Medicine
- **Carousel:**
  - Auto-scroll every 5 seconds
  - Smooth transition (0.5s ease)
  - Dots indicator below
  - Arrows on hover

---

### 2. CONVERSATIONAL SHOPPING (MAIA Interface)

#### Chat Interface

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ [X Close]                    In Home Sanctuary  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🌿 MAIA: Welcome! I'm here to help you │   │
│  │ find the right support. What's alive    │   │
│  │ in you today?                           │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│              ┌─────────────────────────────┐   │
│              │ I can't sleep. My mind      │   │
│              │ won't stop racing.          │   │
│              └─────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🌿 MAIA: Sounds like your Air element  │   │
│  │ is overstimulated. Let me recommend    │   │
│  │ grounding support...                    │   │
│  │                                         │   │
│  │ 🕯️ Deep Rest Candle - $32             │   │
│  │ 🛁 Earth Soak Bath Balm - $28          │   │
│  │                                         │   │
│  │ [Add Both to Cart] [Tell Me More]      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Type your message...          [Send →] │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications:**

**Container:**
- Full screen on mobile
- 600px x 80vh centered modal on desktop
- Background: Forest Night with linen texture
- Border radius: 20px (desktop only)
- Shadow: 0 20px 60px rgba(0,0,0,0.4)

**Messages:**
- **MAIA (left-aligned):**
  - Background: Deep Water at 30%
  - Border left: 3px solid Sacred Clay
  - Padding: 16px
  - Border radius: 16px (bottom-left square)
  - Text: Moonlight, 16px
  - Icon: 🌿 before each message

- **User (right-aligned):**
  - Background: Herb Smoke at 20%
  - Border right: 3px solid Amber Glow
  - Padding: 16px
  - Border radius: 16px (bottom-right square)
  - Text: Moonlight, 16px

**Product Cards in Chat:**
- Compact horizontal layout
- 80px x 80px image thumbnail
- Product name, price, quick "Add to Cart" button
- Background: Sacred Clay at 10%
- Hover: Highlight with Rose Medicine border

**Input Field:**
- Background: Deep Water at 20%
- Border: 1px solid Herb Smoke
- Padding: 12px 16px
- Border radius: 24px
- Placeholder: Herb Smoke at 60%
- Focus: Border becomes Amber Glow

**Send Button:**
- Background: Amber Glow
- Text: Forest Night
- Icon: → arrow
- Border radius: 50%
- Size: 48px
- Hover: Lighten, slight scale

---

### 3. PRODUCT LISTING PAGE

#### Header & Filters

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Bath Balms                                     │
│  "Immersive Medicine for Body and Soul"        │
│                                                 │
│  Filter by:                                     │
│  [Intention ▾] [Element ▾] [Scent ▾] [Price ▾] │
│                                                 │
│  Showing 12 products    [Grid] [List] [MAIA🌿] │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- **Title:** 40px, Cinzel, Sacred Clay
- **Subtitle:** 18px, Jost light, Herb Smoke, italic
- **Filters:**
  - Dropdown style
  - Background: Forest Night
  - Border: Herb Smoke
  - Text: Moonlight
  - Icons: Matching element symbols
- **View Toggle:**
  - Icons for grid/list view
  - MAIA button: "Ask MAIA for help" opens chat

---

#### Product Grid

**Layout:**
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Image   │  │  Image   │  │  Image   │
│          │  │          │  │          │
│ Product  │  │ Product  │  │ Product  │
│ Name     │  │ Name     │  │ Name     │
│ $price   │  │ $price   │  │ $price   │
│ [Quick+] │  │ [Quick+] │  │ [Quick+] │
└──────────┘  └──────────┘  └──────────┘
```

**Specifications:**
- **Grid:** 3 columns desktop, 2 tablet, 1 mobile
- **Gap:** 24px
- **Card:**
  - Background: Deep Water at 5%
  - Border: 1px solid Herb Smoke at 20%
  - Border radius: 16px
  - Padding: 16px
  - Hover: Lift (translateY(-4px)), shadow increases

- **Image:**
  - Aspect ratio: 3:4
  - Object fit: cover
  - Border radius: 12px
  - Loading: Skeleton gradient animation

- **Product Name:**
  - 18px, Cormorant, Sacred Clay
  - Truncate at 2 lines with ellipsis

- **Price:**
  - 20px, Jost bold, Amber Glow

- **Quick Add Button:**
  - Icon: + in circle
  - Background: transparent
  - Border: 2px solid Amber Glow
  - Size: 40px circle
  - Position: Bottom right of card
  - Hover: Fill with Amber Glow, icon becomes checkmark
  - Click: Mini animation (scale pulse), adds to cart

**Interaction:**
- Lazy load images as user scrolls
- Fade-in animation on scroll into view
- Click anywhere on card (except button) → Product detail page

---

### 4. PRODUCT DETAIL PAGE

#### Hero Section

**Layout:**
```
┌─────────────────────────┬───────────────────────┐
│                         │                       │
│   [Product Images]      │  Sacred Sleep Balm    │
│   ─────────────────     │  (32px heading)       │
│   [Main Image]          │                       │
│   (600x800)             │  $48                  │
│                         │  (28px, amber)        │
│   [Thumb] [Thumb]       │                       │
│   [Thumb] [Thumb]       │  ★★★★★ (42 reviews)   │
│                         │                       │
│                         │  "Lavender, chamomile,│
│                         │  and vetiver in       │
│                         │  coconut oil..."      │
│                         │                       │
│                         │  [Qty: 1 ▾] [Add →]  │
│                         │                       │
└─────────────────────────┴───────────────────────┘
```

**Specifications:**

**Image Gallery:**
- Main image: 600px x 800px
- Zoom on hover (magnifying glass cursor)
- Click to open lightbox
- Thumbnails: 100px x 100px
- Active thumbnail: Border with Amber Glow

**Right Column:**
- **Product Name:**
  - 32px, Cinzel, Forest Night
  - Letter-spacing: 0.5px

- **Price:**
  - 28px, Jost bold, Amber Glow
  - If on sale: Show original price struck through

- **Rating:**
  - Stars: Rose Medicine filled, Herb Smoke outline
  - Review count: Link to reviews section
  - 16px, Jost

- **Description:**
  - 16px, Jost light, Forest Night
  - Line height: 1.8
  - Max 3 lines, "Read more" expands

- **Add to Cart:**
  - Size: Large (60px height, full width)
  - Background: Amber Glow
  - Text: Forest Night, 18px, bold
  - Icon: → arrow
  - Hover: Darken 10%, slight shadow
  - Click: Animate (scale down/up), show mini cart preview

---

#### Tabs Section

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Description] [Ingredients] [How to Use]       │
│  [Reviews]                                      │
│  ───                                            │
│                                                 │
│  [Content for selected tab]                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- **Tabs:**
  - Text: 18px, Jost
  - Inactive: Herb Smoke
  - Active: Sacred Clay
  - Active indicator: 3px underline, Amber Glow
  - Hover: Color shifts to Sacred Clay

- **Description Tab:**
  - Rich text with formatting
  - Pull quotes in Playfair, italic, larger
  - Ritual instructions in bordered callout box

- **Ingredients Tab:**
  - List format with botanical icons
  - Each ingredient links to glossary (future phase)
  - Allergen warnings highlighted in Rose Medicine

- **How to Use Tab:**
  - Numbered steps
  - Icons for each step (hand, bath, candle, etc.)
  - Video embed if available

- **Reviews Tab:**
  - 5-star filter
  - Sort by: Most recent, highest rated, most helpful
  - Review cards with avatar, name, date, rating, text
  - "Write a review" CTA

---

#### Ritual Guide Section

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  ✨ Create a Sacred Sleep Ritual                │
│                                                 │
│  "This balm is most potent when paired with    │
│  intention and presence. Try this 7-night      │
│  practice:"                                     │
│                                                 │
│  🌙 Evening (30 minutes before sleep)          │
│    1. Dim lights, light a candle               │
│    2. Warm balm between palms                  │
│    3. Apply to heart, throat, wrists           │
│    4. Breathe deeply 3 times                   │
│    5. Speak aloud: "I release the day"         │
│                                                 │
│  [Download Full Ritual Guide PDF] [Share 🔗]   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- **Container:**
  - Background: Soft gradient (Deep Water to Forest Night)
  - Border: 1px solid Sacred Clay at 30%
  - Padding: 40px
  - Border radius: 16px

- **Typography:**
  - Heading: 24px, Oranienbaum, Moonlight
  - Icon: ✨ Sparkles
  - Body: 16px, Jost light, Moonlight at 90%
  - Steps: Numbered list with icons

- **CTA Buttons:**
  - Outline style
  - Border: 2px solid Amber Glow
  - Text: Amber Glow
  - Background: Transparent
  - Hover: Fill with Amber Glow at 15%

---

#### Complete the Ritual (Bundle Recommendations)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  "Complete the Sacred Sleep Ritual"             │
│                                                 │
│  Customers who bought this also use:            │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Candle   │  │ Pillow   │  │ Dream    │     │
│  │ $32      │  │ Mist $24 │  │ Tea $18  │     │
│  │ [Add +]  │  │ [Add +]  │  │ [Add +]  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  [Add All Three - Save 15%] $63 (was $74)      │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- Similar to product grid cards but smaller (200px wide)
- Bundle CTA prominent: Background Amber Glow, larger font
- Savings highlighted in Rose Medicine

---

### 5. SHOPPING CART (Slide-Out Panel)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Your Sacred Cart  (3 items)          [X Close] │
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ [Img] Sacred Sleep Balm    [- 1 +]    $48  ││
│ │       4oz                  [Remove]         ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ [Img] Deep Rest Candle     [- 1 +]    $32  ││
│ │       8oz                  [Remove]         ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ ─────────────────────────────────────────────  │
│                                                 │
│ Subtotal:                              $80     │
│ Shipping:                              $12     │
│ ─────────────────────────────────────────────  │
│ Total:                                 $92     │
│                                                 │
│ 🎁 Add gift message                            │
│ 💚 Free shipping over $100! Add $8 more        │
│                                                 │
│ [Continue Shopping] [Checkout →]               │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- **Panel:**
  - Slides in from right
  - Width: 480px (desktop), full screen (mobile)
  - Background: Moonlight
  - Shadow: Large left shadow

- **Item Cards:**
  - Background: White
  - Border: 1px solid Herb Smoke at 20%
  - Padding: 16px
  - Border radius: 12px

- **Image:** 80px x 80px
- **Quantity Controls:**
  - Buttons: Circle, 32px
  - Border: Herb Smoke
  - Background: White
  - Hover: Background Herb Smoke at 10%

- **Pricing:**
  - Item price: 18px, Jost medium
  - Total: 24px, Jost bold, Amber Glow

- **Checkout Button:**
  - Full width
  - Height: 60px
  - Background: Amber Glow
  - Text: Forest Night, 18px, bold
  - Icon: → arrow
  - Hover: Darken, shadow grows

---

### 6. CHECKOUT PAGE

**Layout:**
```
┌──────────────────────┬──────────────────────────┐
│                      │                          │
│ Checkout             │  Order Summary           │
│                      │                          │
│ 1. Contact Info      │  2 items        $80      │
│ ┌──────────────────┐ │  Shipping       $12      │
│ │ Email            │ │  ──────────────────      │
│ └──────────────────┘ │  Total          $92      │
│                      │                          │
│ 2. Shipping Address  │  [Product thumbnails]    │
│ ┌──────────────────┐ │                          │
│ │ Full Name        │ │                          │
│ │ Address          │ │                          │
│ │ City, State, Zip │ │                          │
│ └──────────────────┘ │                          │
│                      │                          │
│ 3. Payment           │                          │
│ ┌──────────────────┐ │                          │
│ │ [Stripe Element] │ │                          │
│ └──────────────────┘ │                          │
│                      │                          │
│ [← Back to Cart]     │  [Complete Order →]      │
│                      │                          │
└──────────────────────┴──────────────────────────┘
```

**Specifications:**
- **Two-column layout** (stacks on mobile)
- **Left Column:** 60% width
  - Clean, minimal form fields
  - Autofill enabled
  - Real-time validation (green checkmarks)
  - Error messages in Rose Medicine

- **Right Column:** 40% width, sticky
  - Background: Deep Water at 5%
  - Order summary always visible
  - Trust badges: Secure checkout, SSL, etc.

- **Stripe Elements:**
  - Matches your brand colors
  - Custom styling for inputs
  - Error handling

- **Complete Order Button:**
  - Full width
  - Large (70px height)
  - Background: Amber Glow
  - Loading state: Spinner + "Processing..."
  - Success: Checkmark animation

---

### 7. SUBSCRIPTION SELECTION PAGE

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  "Monthly Ritual Medicine"                      │
│  ────────────────────────                       │
│                                                 │
│  Choose your path:                              │
│                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐
│  │   Elemental │  │   Seasonal  │  │  Custom  │
│  │   Journey   │  │   Wheel     │  │  Ritual  │
│  │             │  │             │  │          │
│  │  Curated    │  │  Quarterly  │  │ Build    │
│  │  monthly    │  │  boxes      │  │ your own │
│  │             │  │             │  │          │
│  │  $65/month  │  │  $180/qtr   │  │ Varies   │
│  │             │  │             │  │          │
│  │ [Subscribe] │  │ [Subscribe] │  │ [Build]  │
│  └─────────────┘  └─────────────┘  └──────────┘
│                                                 │
│  ✨ All subscriptions include:                 │
│     • Free shipping                             │
│     • Exclusive products                        │
│     • Monthly ritual guide                      │
│     • Skip or pause anytime                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- **Subscription Cards:**
  - Height: Equal (400px)
  - Border: 2px solid Herb Smoke
  - Border radius: 20px
  - Hover: Border becomes Amber Glow, slight lift
  - "Most Popular" badge on middle card (Sacred Clay background)

- **Pricing:**
  - Large: 32px, Jost bold, Amber Glow
  - Billing cycle: 14px, Herb Smoke

- **Subscribe Buttons:**
  - Outline initially
  - Hover: Fills with Amber Glow
  - Click: Modal with subscription details + confirmation

---

### 8. CUSTOMER ACCOUNT DASHBOARD

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Welcome back, Sarah 🌿                         │
│                                                 │
│  [Your Orders] [Subscriptions] [Favorites]      │
│  [Profile] [Ritual Journal]                     │
│  ──────                                         │
│                                                 │
│  Recent Orders:                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Order #1234 - March 15                  │   │
│  │ Sacred Sleep Balm, Deep Rest Candle     │   │
│  │ $80 - [Track] [Reorder] [Review]        │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Active Subscription:                           │
│  ┌─────────────────────────────────────────┐   │
│  │ Elemental Journey - Monthly             │   │
│  │ Next delivery: April 1                  │   │
│  │ [Manage] [Skip Next] [Pause]            │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Recommended for You:                           │
│  (Based on your journey with grief support)    │
│  [Product suggestions]                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- **Tabs:** Same style as product detail tabs
- **Order Cards:**
  - White background
  - Border: Herb Smoke at 20%
  - Hover: Shadow grows
  - Status indicator: Colored dot (green=delivered, amber=in transit)

- **Subscription Management:**
  - Prominent card
  - Background: Soft Amber Glow at 10%
  - Border: Sacred Clay
  - Clear next delivery date

- **Recommendations:**
  - Uses same product card style as listing page
  - Note explaining why: "Based on your purchase of..." (transparency)

---

## Mobile-Specific Considerations

### Bottom Navigation Bar

**Layout (Mobile Only):**
```
┌─────────────────────────────────────────────────┐
│ [Home] [Shop] [MAIA] [Cart] [Account]          │
│   🏠     🛍️     🌿      🛒      👤              │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- Fixed to bottom
- Height: 64px
- Background: Forest Night
- Icons: 24px, Moonlight
- Active state: Amber Glow
- Tap target: Minimum 48px x 48px

### Swipe Gestures
- Swipe left on product card → Add to favorites
- Swipe right on product card → Quick add to cart
- Swipe down on cart → Close
- Pull to refresh on listing pages

### Mobile-Optimized Elements
- Larger touch targets (48px minimum)
- Sticky "Add to Cart" button on product page
- Collapsible filters (drawer from bottom)
- Image galleries use native swipe
- Forms use native input types (email, tel, etc.)

---

## Animations & Microinteractions

### Page Transitions
- Fade + slight upward slide (300ms ease-out)
- Maintain scroll position when navigating back

### Loading States
- Skeleton screens (not spinners) for content
- Shimmer effect in Sacred Clay color
- Progress bar for checkout process

### Add to Cart
1. Button scales down (0.95x) - 100ms
2. Button scales up (1.05x) then back to 1 - 200ms
3. Mini product image flies to cart icon - 400ms
4. Cart icon bounces + badge number updates - 200ms
5. Success toast appears top-right - fade in 300ms

### Hover Effects
- Product cards: Lift 4px, shadow grows
- Buttons: Darken 10%, slight scale (1.02x)
- Images: Subtle zoom (1.05x) over 300ms

### Scroll Animations
- Fade in + translate up as elements enter viewport
- Parallax on hero images (subtle, 0.3x scroll speed)

---

## Accessibility Specifications

### Color Contrast
- All text meets WCAG AA (4.5:1 minimum)
- Important CTAs meet AAA (7:1)

### Keyboard Navigation
- All interactive elements focusable
- Visible focus indicator: 2px Amber Glow outline
- Logical tab order
- Skip to main content link

### Screen Reader
- Semantic HTML (nav, main, article, etc.)
- ARIA labels on icons
- Alt text on all images (descriptive)
- Form labels properly associated

### Responsive Text
- Base font size: 16px (never smaller)
- Scales up to 200% without breaking layout
- Line height minimum 1.5 for body text

---

## Performance Specifications

### Image Optimization
- WebP format with JPEG fallback
- Lazy loading (native or Intersection Observer)
- Responsive images (srcset for different screen sizes)
- Blur-up placeholder effect

### Code Splitting
- Route-based code splitting
- Lazy load non-critical components
- Defer non-essential JavaScript

### Metrics Targets
- Lighthouse Performance: 90+
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Cumulative Layout Shift: <0.1

---

## Design Deliverables

### For Developer Handoff

**Figma Files:**
1. Design System (colors, typography, components)
2. High-fidelity mockups (all pages, all breakpoints)
3. Interactive prototype (click-through flows)
4. Annotations & specs

**Assets Export:**
- All images in multiple sizes (1x, 2x, 3x)
- Icons as SVG
- Logo variations (color, white, black)
- Favicon set (16x16 to 512x512)

**Documentation:**
- Component library (Storybook or similar)
- Animation spec sheet
- Responsive breakpoint guide
- Accessibility checklist

---

## Questions for Kristen (Brand Workshop)

Before finalizing these designs, ask:

1. **Color Palette:** Does "earthy mystical" resonate? Any specific colors you love/hate?
2. **Typography:** Elegant serif or clean sans-serif feel?
3. **Photography:** Do you have product photos? Style preference?
4. **Tone:** Mystical/poetic vs. approachable/casual?
5. **Competitors:** Any apothecary sites you admire?
6. **Conversational AI:** Excited about MAIA or prefer traditional shopping?
7. **Ritual Focus:** How prominent should ritual guides be?
8. **Community:** Want to showcase customer stories prominently?

---

This spec is ready to hand to a designer to create mockups, or to use as a guide when building directly in code. Would you like me to create more detailed specs for any specific page or component?
