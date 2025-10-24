# Soullab Publishing - Distribution Partner Research

## Overview
This document outlines integration options for print-on-demand, ebook distribution, and multimedia fulfillment.

---

## Print-on-Demand (POD) Partners

### 1. IngramSpark ⭐ RECOMMENDED
**Best for**: Wide distribution + bookstore presence

**Pros:**
- Global distribution to 40,000+ retailers and libraries
- Professional quality printing
- Author retains 100% rights and sets own pricing
- Direct to retailer/library distribution
- Returns program for bookstores (optional)
- Hardcover, paperback, large print options
- Global distribution (US, UK, Europe, Australia)

**Cons:**
- Setup fees: $49 per format (one-time)
- Title changes: $25 per update
- More complex than some alternatives
- Requires professional-ready files

**Pricing:**
- Setup: $49/format (ISBN, interior, cover)
- Printing: ~$3-8 per book depending on page count
- Distribution: Free to major retailers
- Returns program: Optional

**API Available:** Yes (for automated ordering and fulfillment)

**Integration Complexity:** Medium
- REST API for ordering, inventory, pricing
- Webhook support for order status
- Requires ISBN per format

**Best Use:** Primary POD partner for wide distribution

---

### 2. Lulu
**Best for**: Simple setup, author-friendly

**Pros:**
- No setup fees
- Easy-to-use interface
- Good for personal/small runs
- Multiple binding options
- Global distribution available
- Author retains all rights

**Cons:**
- Less prestigious than IngramSpark
- Limited bookstore distribution
- Higher per-unit costs than IngramSpark
- Fewer format options

**Pricing:**
- Setup: Free
- Printing: ~$4-10 per book
- Distribution: Optional ($75 one-time for global distribution)

**API Available:** Yes (Lulu Direct API)

**Integration Complexity:** Low-Medium

**Best Use:** Backup POD partner, quick testing, personal copies

---

### 3. BookBaby
**Best for**: Full-service publishing support

**Pros:**
- Includes ebook conversion, distribution, ISBN
- Professional design services available
- Print + ebook bundles
- Good for first-time publishers
- Wide distribution network

**Cons:**
- Higher upfront costs ($299-2000 depending on package)
- Less control over individual components
- Higher per-book printing costs

**Pricing:**
- Packages: $299-2000 (includes multiple services)
- À la carte services available

**API Available:** Limited

**Integration Complexity:** High (less API-focused, more service-oriented)

**Best Use:** Optional premium service for members who want full support

---

## Ebook Distribution

### 1. Smashwords ⭐ RECOMMENDED
**Best for**: Multi-retailer ebook distribution

**Pros:**
- Free distribution to all major ebook retailers
- One upload reaches Apple Books, Kobo, Barnes & Noble, libraries
- No setup fees
- Author sets pricing and retains rights
- Good royalty rates (60-80% depending on channel)
- Simple EPUB upload

**Cons:**
- Formatting requirements can be picky
- Takes time to propagate to all retailers
- Not as fast as direct uploads

**Pricing:**
- Free to upload and distribute
- Royalties: 60% (retailers) to 85% (direct Smashwords sales)

**API Available:** Limited (more email-based workflow)

**Integration Complexity:** Low (email-based or web upload)

**Best Use:** Primary ebook distributor

---

### 2. Draft2Digital
**Best for**: Clean UI, fast distribution

**Pros:**
- Beautiful interface
- Fast ebook distribution to major retailers
- Free ISBN if needed
- Automated formatting from Word/EPUB
- Print book distribution via IngramSpark partnership

**Cons:**
- Takes 10% of author's royalty from retailers
- Less control than direct uploads

**Pricing:**
- Free to use
- Takes 10% of author earnings

**API Available:** Yes (Beta API available)

**Integration Complexity:** Medium

**Best Use:** Alternative to Smashwords, or use both for redundancy

---

### 3. Amazon KDP (Direct)
**Best for**: Amazon-only ebooks

**Pros:**
- Largest ebook market
- 70% royalties (if priced $2.99-$9.99)
- KDP Select gives higher royalties + promo tools
- Fast publishing (24-48 hours)

**Cons:**
- Amazon exclusivity if using KDP Select
- 35% royalty if outside price range
- Doesn't distribute to other retailers

**Pricing:**
- Free
- Royalties: 35% or 70% depending on price and exclusivity

**API Available:** Yes (KDP API)

**Integration Complexity:** Medium

**Best Use:** Direct upload for maximum Amazon control

---

## Audiobook Distribution

### 1. Findaway Voices ⭐ RECOMMENDED
**Best for**: Wide audiobook distribution

**Pros:**
- Distributes to 40+ platforms (Audible, Apple, Google, Spotify, libraries)
- Author retains rights and sets pricing
- Professional narration marketplace
- Direct distribution (no exclusivity)
- Good royalty rates (80% net after platform cuts)

**Cons:**
- Production costs if using narrators (typically $100-400/finished hour)
- Some platforms take 25-40% commission

**Pricing:**
- Free to distribute
- Narration: $100-400/finished hour (optional)
- Royalties: ~80% of net (after platform cuts)

**API Available:** Yes (Findaway API)

**Integration Complexity:** Medium-High

**Best Use:** Primary audiobook distribution

---

### 2. Author's Republic
**Best for**: Library and podcast distribution

**Pros:**
- Free distribution to libraries and podcast platforms
- No exclusivity required
- Good for reach beyond traditional audiobook stores

**Cons:**
- Lower royalties than Findaway (typically 70%)
- Slower distribution

**Pricing:**
- Free
- Royalties: ~70%

**API Available:** Limited

**Best Use:** Supplementary distribution for library reach

---

## Video Course Hosting

### 1. Vimeo OTT (now Vimeo Studio) ⭐ RECOMMENDED
**Best for**: Direct video sales and streaming

**Pros:**
- Full white-label video platform
- Can sell individual videos or subscriptions
- Great player experience
- No Vimeo branding (on paid plans)
- Analytics and engagement tracking

**Cons:**
- Monthly fees: $500-2500/month depending on plan
- Overkill for small-scale

**Pricing:**
- Starter: $500/month
- Standard: $1000/month
- Advanced: $2500/month

**API Available:** Yes (comprehensive API)

**Integration Complexity:** Medium

**Best Use:** If/when we have significant video course catalog

---

### 2. Bunny Stream (BunnyCDN)
**Best for**: Cost-effective video streaming

**Pros:**
- Very affordable ($0.01/GB streaming)
- Global CDN
- Good video player
- Security features (token authentication, DRM)
- API-first platform

**Cons:**
- Less features than Vimeo
- DIY approach (we build the interface)

**Pricing:**
- Storage: $0.02/GB/month
- Streaming: $0.01/GB
- No monthly minimums

**API Available:** Yes (full API control)

**Integration Complexity:** Medium (we handle UI/UX)

**Best Use:** Phase 1-2 video hosting (cost-effective)

---

### 3. Mux
**Best for**: Developer-friendly video infrastructure

**Pros:**
- Modern API-first video platform
- Automatic adaptive streaming
- Great analytics
- Low latency
- Professional-grade infrastructure

**Cons:**
- Pay-per-use can get expensive at scale
- Requires more technical integration

**Pricing:**
- Storage: $0.015/GB/month
- Streaming: $0.01/GB
- Encoding: $0.005/minute

**API Available:** Yes (excellent API)

**Integration Complexity:** High (very developer-focused)

**Best Use:** If we want professional video infrastructure

---

## Music & Audio Distribution

### 1. DistroKid ⭐ RECOMMENDED
**Best for**: Music album distribution

**Pros:**
- $22/year for unlimited releases
- Distributes to Spotify, Apple Music, Amazon, etc.
- Keep 100% of royalties
- Fast distribution (1-2 days)
- Automatic revenue splits for collaborators

**Cons:**
- Annual fee (but very affordable)
- Music-focused (not for audiobooks/courses)

**Pricing:**
- Musician: $22/year
- Musician Plus: $36/year
- Label: $80/year

**API Available:** Limited

**Integration Complexity:** Low (manual upload workflow)

**Best Use:** For sound healing albums, meditation music, etc.

---

### 2. TuneCore
**Best for**: More control, higher revenue share

**Pros:**
- 100% royalty retention
- Detailed analytics
- YouTube monetization
- Social media distribution

**Cons:**
- $30/year per album
- Higher costs than DistroKid

**Pricing:**
- Singles: $10/year
- Albums: $30/year

**API Available:** No

**Best Use:** Alternative to DistroKid for premium releases

---

## Digital Download Fulfillment

### 1. SendOwl ⭐ RECOMMENDED
**Best for**: Secure digital product delivery

**Pros:**
- Instant download delivery after purchase
- Time-limited or download-limited links
- Integrates with Stripe, PayPal
- PDF stamping (anti-piracy watermarks)
- Affiliate system built-in
- Discount codes and promotions

**Cons:**
- Monthly fee: $15-99/month

**Pricing:**
- Standard: $15/month
- Premium: $39/month
- Business: $99/month

**API Available:** Yes (Webhooks + API)

**Integration Complexity:** Low

**Best Use:** Primary digital fulfillment for PDFs, ebooks, downloads

---

### 2. Gumroad
**Best for**: Simple, creator-friendly

**Pros:**
- Super easy setup
- Built-in audience/following features
- Pay-what-you-want pricing
- Instant payouts
- Free plan available

**Cons:**
- Takes 10% of sales (free plan)
- Less control over branding
- Not as professional-looking

**Pricing:**
- Free: 10% fee
- Pro: $10/month + 3.5% fee

**API Available:** Yes

**Integration Complexity:** Low

**Best Use:** Quick testing, simple products

---

### 3. Stripe + AWS S3 (DIY)
**Best for**: Full control, lowest cost at scale

**Pros:**
- Complete control
- Lowest cost (only storage + bandwidth)
- Can build exactly what we want
- Integrates with existing Stripe setup

**Cons:**
- We build everything
- More development time

**Pricing:**
- S3 Storage: $0.023/GB/month
- S3 Transfer: $0.09/GB
- Stripe: 2.9% + $0.30 per transaction

**API Available:** We build it

**Integration Complexity:** High (but we control everything)

**Best Use:** Long-term solution for Soullab platform

---

## Recommended Tech Stack for Phase 1

### Immediate (Elemental Alchemy Launch)

**Print Books:**
- Primary: IngramSpark (wide distribution)
- Backup: Lulu (quick fulfillment, personal copies)

**Ebooks:**
- Smashwords (multi-retailer distribution)
- Amazon KDP Direct (maximum control on Amazon)

**Audiobook:**
- Findaway Voices (if producing audiobook)
- OR: Self-host on Bunny Stream (if you narrate yourself)

**Video Course/Companion Content:**
- Bunny Stream (cost-effective, API-friendly)

**Digital Downloads:**
- Stripe + AWS S3 (we build it, full control)
- Backup: SendOwl (if we need faster launch)

**Music/Sound Healing:**
- DistroKid (if releasing meditation music)

---

## Integration Priority

1. **Week 1-2:** Stripe payments + AWS S3 digital fulfillment
2. **Week 3-4:** IngramSpark print-on-demand setup
3. **Week 5-6:** Ebook distribution via Smashwords + KDP
4. **Week 7-8:** Video hosting on Bunny Stream
5. **Later:** Audiobook via Findaway Voices (once narration complete)

---

## Cost Summary for Elemental Alchemy

**One-Time Setup:**
- IngramSpark: $49 (paperback) + $49 (hardcover) = $98
- ISBN: $125 for 10 ISBNs from Bowker (or free from IngramSpark)
- Total Setup: ~$100-250

**Monthly Ongoing:**
- Bunny Stream: ~$5-20/month (depending on video traffic)
- AWS S3: ~$10-30/month (ebook/PDF hosting)
- Total Monthly: ~$15-50

**Per-Sale Costs:**
- Print book: $3-8 printing + shipping
- Ebook: $0 (just storage)
- Video course: $0.01/GB streamed
- Stripe: 2.9% + $0.30

**Revenue to You (Example: $27 ebook):**
- Gross: $27.00
- Stripe fee: $1.08
- Platform fee (5%): $1.35
- Net to creator: $24.57 (91%)

---

## Next Steps

1. Set up Stripe Connect for creator payouts
2. Create IngramSpark publisher account
3. Build AWS S3 + Stripe integration for digital fulfillment
4. Design upload workflow for manuscripts and media
5. Create API integrations for print-on-demand ordering

Would you like me to start building the Stripe integration and digital fulfillment system?
