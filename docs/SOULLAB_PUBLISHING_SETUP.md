# Soullab Publishing Platform - Setup Guide

## Overview
Complete publishing platform for Elemental Alchemy and future Soullab titles with official brand colors.

## What's Been Built

### ✅ Brand System
- **`lib/soullab-theme.ts`** - Official color palette from design brief
  - Fire (Red): #a94724
  - Air (Yellow): #cea22c
  - Earth (Green): #6d7934
  - Water (Blue): #236586
  - All purple tones removed as requested

### ✅ Main Pages

1. **Publishing Landing Page** (`/publishing`)
   - Cinematic backgrounds with official Soullab colors
   - Interactive mouse-reactive gradients
   - Soullab spiral logo component
   - Email signup (integrated with backend)
   - Four elements showcase
   - Video trailer modal (placeholder ready for video URL)
   - Complete footer

2. **Book Preview** (`/publishing/preview`)
   - Interactive page-flip animation
   - 6 sample pages with element-specific colors
   - Navigation arrows and page indicators
   - CTA to purchase page

3. **Purchase Page** (`/publishing/purchase`)
   - Full product display with book cover
   - Format selection (Digital, Hardcover, Bundle)
   - Quantity selector
   - Stripe checkout integration
   - Pre-order benefits section
   - Testimonials
   - FAQ section
   - Total: $29.99-$69.99 depending on format

4. **Success Page** (`/publishing/success`)
   - Order confirmation
   - Next steps timeline
   - Pre-order benefit reminder
   - Social sharing
   - Community links

5. **Book Catalog** (`/publishing/catalog`)
   - Multi-book showcase with 4 titles
   - Filterable by element or status
   - Interactive hover effects
   - Newsletter signup

### ✅ Components

- **BookPreview.tsx** - Interactive book interior with flip animation
- **BookCatalog.tsx** - Multi-book grid with filters
- **ElementalAlchemyBook.tsx** - 3D book cover (updated with official colors)

### ✅ Backend APIs

1. **Stripe Checkout** (`/api/publishing/create-checkout`)
   - Creates Stripe checkout sessions
   - Handles format selection and quantity
   - Collects shipping for physical books
   - Pre-order mode enabled

2. **Newsletter Signup** (`/api/publishing/newsletter`)
   - Saves emails to Supabase
   - Sends welcome email via Resend
   - Prevents duplicates

3. **Checkout Session** (`/api/publishing/checkout-session`)
   - Retrieves session details after purchase
   - Returns customer email for confirmation

### ✅ Database

- **newsletter_subscribers table** (migration file ready)
  - Stores email signups
  - Tracks source and status
  - Metadata field for preferences

## Setup Instructions

### 1. Database Setup
Run the newsletter migration in Supabase:
```sql
-- Copy and paste contents of:
supabase/migrations/newsletter-subscribers.sql
```

### 2. Environment Variables
Add to `.env.local`:
```bash
# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (for emails)
RESEND_API_KEY=re_...

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Stripe Setup

1. Create product in Stripe Dashboard:
   - Name: "Elemental Alchemy"
   - Prices: $29.99 (digital), $49.99 (hardcover), $69.99 (bundle)
   - Mode: Payment (not subscription)

2. Test with Stripe test card:
   - Card: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits

### 4. Email Setup (Optional)

If you have Resend configured:
- Welcome emails automatically send on newsletter signup
- Customize email template in `/api/publishing/newsletter/route.ts`

If not configured:
- Newsletter signups still work (saved to database)
- No welcome email sent

### 5. Video Integration (When Ready)

To add the actual trailer video:

**Option A: YouTube**
```tsx
// In app/publishing/page.tsx, line 509, replace placeholder with:
<iframe
  src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
  className="absolute inset-0 w-full h-full"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>
```

**Option B: Vimeo**
```tsx
<iframe
  src="https://player.vimeo.com/video/YOUR_VIDEO_ID"
  className="absolute inset-0 w-full h-full"
  frameBorder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowFullScreen
/>
```

## Page Routes

| Route | Description |
|-------|-------------|
| `/publishing` | Main landing page |
| `/publishing/preview` | Book interior preview with page flip |
| `/publishing/purchase` | Purchase/pre-order page |
| `/publishing/success` | Post-purchase confirmation |
| `/publishing/catalog` | All books catalog |
| `/elemental-alchemy/book` | 3D book cover showcase |

## Testing Checklist

- [ ] Visit `/publishing` - landing page loads
- [ ] Click email signup - see success message
- [ ] Check Supabase - email saved in newsletter_subscribers
- [ ] Click "Preview Book" - page flip animation works
- [ ] Click "Pre-Order" - Stripe checkout opens
- [ ] Complete test purchase - redirects to success page
- [ ] Click video play button - modal opens
- [ ] Visit `/publishing/catalog` - all books display
- [ ] Test filters - books filter by element/status

## Color Usage

All components now use the official Soullab palette:
- **Fire** (#a94724) - CTAs, urgent actions, creation
- **Air** (#cea22c) - Headings, highlights, communication
- **Earth** (#6d7934) - Grounding elements, structure
- **Water** (#236586) - Flow, depth, emotion
- **Gray** (#777777) - Neutral UI elements
- **Brown** (#33251d) - Dark backgrounds, depth

No purple tones remain in the codebase.

## Next Steps

1. **Add Real Content**
   - Replace sample book pages in `BookPreview.tsx`
   - Add actual testimonials
   - Upload real book cover images

2. **Video Production**
   - Create 2:30 trailer
   - Upload to YouTube/Vimeo
   - Add embed code to video modal

3. **Launch Preparation**
   - Test full purchase flow in Stripe live mode
   - Configure DNS for custom domain
   - Set up Resend sending domain
   - Write welcome email copy

4. **Marketing**
   - Share `/publishing` landing page
   - Collect newsletter signups
   - Announce pre-order availability

## Support

For questions about the publishing platform:
- Email: publishing@soullab.life
- All code is fully commented and documented
- Official brand colors defined in `lib/soullab-theme.ts`

---

**Built with:** Next.js 14, TypeScript, Tailwind CSS, Stripe, Supabase, Resend
**Brand Colors:** Official Soullab palette (no purple)
**Status:** Complete and ready for content integration
