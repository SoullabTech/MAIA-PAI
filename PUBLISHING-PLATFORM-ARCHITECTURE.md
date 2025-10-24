# Soullab Publishing Platform - Technical Architecture

## System Overview

A creator-sovereign publishing platform built on the MAIA-PAI foundation, enabling multi-format content publishing with automatic royalty tracking and distribution.

---

## Architecture Layers

### 1. Database Layer (Supabase PostgreSQL)
**Tables:** (See `SOULLAB-PUBLISHING-SCHEMA.sql`)
- `soullab_creators` - Creator profiles and payment info
- `soullab_works` - Published works catalog
- `soullab_work_formats` - Multiple formats per work
- `soullab_sales` - Transaction tracking
- `soullab_royalty_payouts` - Creator payments
- `soullab_work_contributors` - Collaborative works
- `soullab_content_files` - Asset management
- `soullab_work_reviews` - Ratings and feedback

**Key Features:**
- Row Level Security (RLS) for creator data sovereignty
- Automatic royalty calculation triggers
- Real-time sales statistics updates
- Multi-creator royalty splitting

---

### 2. API Layer (Next.js API Routes)

#### Core Publishing APIs

**`/api/publishing/works`**
- GET: List published works (public, filtered, searchable)
- POST: Create new work (creator only)
- PATCH: Update work metadata
- DELETE: Archive work (soft delete)

**`/api/publishing/works/[workId]`**
- GET: Work details + available formats
- PUT: Update work
- GET `/formats`: List all formats for work
- GET `/sales`: Creator-only sales analytics

**`/api/publishing/upload`**
- POST: Upload manuscript files (DOCX, PDF, Markdown)
- POST `/cover`: Upload cover images
- POST `/audio`: Upload audio files
- POST `/video`: Upload video content
- Handles: S3 upload, virus scanning, metadata extraction

**`/api/publishing/convert`**
- POST `/epub`: Convert manuscript to EPUB
- POST `/mobi`: Convert to MOBI (Kindle)
- POST `/pdf`: Generate print-ready PDF
- POST `/audiobook`: Process audio chapters
- Uses: Pandoc, calibre, FFmpeg for conversions

**`/api/publishing/checkout`**
- POST: Create Stripe checkout for work purchase
- Params: work_id, format_id, email, name, member_status
- Returns: Stripe session URL
- Handles: Member discounts, pay-what-you-want pricing

**`/api/publishing/webhook`**
- POST: Stripe webhook handler for purchases
- Events: checkout.session.completed, payment_intent.succeeded
- Actions:
  - Record sale in database
  - Calculate and record royalty
  - Generate download link
  - Send purchase confirmation email
  - Grant access to digital content

**`/api/publishing/download/[saleId]`**
- GET: Secure time-limited download link
- Validates: Purchase, expiration, download limit
- Tracks: Download count, user agent
- Returns: Signed S3 URL or streaming URL

**`/api/publishing/creator/dashboard`**
- GET: Creator's published works, sales, earnings
- GET `/sales`: Detailed sales history
- GET `/royalties`: Royalty statements
- GET `/analytics`: Views, conversions, revenue trends

**`/api/publishing/creator/payout`**
- POST: Request royalty payout
- GET: Payout history and status
- Handles: Stripe Connect payouts

**`/api/publishing/pod/order`**
- POST: Submit print-on-demand order to IngramSpark
- Params: work_id, format_id, quantity, shipping
- Returns: Order ID, estimated delivery
- Handles: API communication with POD partner

**`/api/publishing/ebook/distribute`**
- POST: Distribute ebook to Smashwords/KDP
- Params: work_id, retailers[], pricing
- Returns: Distribution status per retailer

---

### 3. Storage Layer (AWS S3 + CloudFront CDN)

**Buckets:**

**`soullab-manuscripts` (Private)**
- Manuscript source files (.docx, .md, .pdf)
- Only accessible by creator and system
- Versioned for history

**`soullab-published-content` (Restricted)**
- Final ebooks (.epub, .mobi, .pdf)
- Audiobook files (.mp3, .m4b)
- Video courses (.mp4)
- Access via signed URLs only

**`soullab-public-assets` (Public via CDN)**
- Cover images
- Preview PDFs (first chapter)
- Sample audio clips
- Author photos
- Served via CloudFront for fast global delivery

**`soullab-print-ready` (Private)**
- Print-ready PDFs for POD
- High-resolution files
- Backup of submitted files

**File Naming Convention:**
```
{creator_id}/{work_id}/{version}/{file_type}/filename.ext

Examples:
abc123/work-789/v1.0/manuscript/elemental-alchemy.docx
abc123/work-789/v1.0/ebook/elemental-alchemy.epub
abc123/work-789/v1.2/print/elemental-alchemy-interior.pdf
abc123/work-789/v1.0/cover/cover-front-hires.jpg
```

---

### 4. Processing Pipeline

#### File Upload Flow

```
1. Creator uploads manuscript → API endpoint
2. Upload to S3 (soullab-manuscripts bucket)
3. Virus scan (ClamAV or AWS GuardDuty)
4. Extract metadata (page count, word count)
5. Create thumbnail/preview
6. Update database (soullab_content_files)
7. Trigger conversion jobs (if requested)
```

#### Format Conversion Flow

```
1. Manuscript uploaded to S3
2. Trigger Lambda/worker for conversion:
   - DOCX → EPUB (Pandoc)
   - EPUB → MOBI (Calibre)
   - DOCX → Print PDF (LaTeX/Prince)
3. Store converted files in soullab-published-content
4. Update soullab_work_formats with URLs
5. Mark format as "available"
6. Notify creator
```

#### Purchase & Delivery Flow

```
1. Customer clicks "Buy"
2. Create Stripe checkout session
3. Redirect to Stripe payment page
4. Customer completes payment
5. Stripe webhook → /api/publishing/webhook
6. Record sale in soullab_sales
7. Calculate royalty, update creator balance
8. Generate time-limited download URL (1 hour, 3 downloads)
9. Send email with download link
10. Customer downloads file
11. Track download in database
```

#### Print-on-Demand Flow

```
1. Customer orders print book
2. Payment processed via Stripe
3. API call to IngramSpark:
   - Submit order with shipping info
   - Include print-ready PDF URL
4. IngramSpark prints and ships
5. Tracking number returned via webhook
6. Update order status in database
7. Email customer with tracking
8. When delivered, mark as fulfilled
```

---

### 5. Frontend Components

#### Creator Dashboard (`/publishing/dashboard`)

**Pages:**
- `/publishing/dashboard` - Overview: sales, earnings, works
- `/publishing/works` - Manage published works
- `/publishing/works/new` - Create new work wizard
- `/publishing/works/[id]/edit` - Edit work metadata
- `/publishing/works/[id]/formats` - Manage formats
- `/publishing/upload` - File upload interface
- `/publishing/sales` - Sales history and analytics
- `/publishing/royalties` - Earnings and payouts
- `/publishing/settings` - Payment info, profile

**Key Components:**
```tsx
<WorkUploadWizard />        // Multi-step upload flow
<FormatConverter />          // Convert to different formats
<WorkEditor />               // Edit metadata, pricing
<SalesChart />               // Revenue and sales trends
<RoyaltyStatement />         // Earnings breakdown
<PublishingStatus />         // Track publication workflow
<DistributionSettings />     // Choose retailers
```

#### Public Storefront (`/publishing` or `/shop`)

**Pages:**
- `/publishing` - Browse all published works
- `/publishing/[workSlug]` - Work detail page
- `/publishing/checkout/[sessionId]` - Checkout flow
- `/publishing/success` - Purchase confirmation
- `/publishing/download/[saleId]` - Download page

**Key Components:**
```tsx
<WorkCard />                 // Work thumbnail + info
<WorkDetail />               // Full work page
<FormatSelector />           // Choose format (ebook/print/audio)
<PricingDisplay />           // Show pricing + member discount
<PreviewReader />            // Read first chapter
<ReviewsList />              // Show ratings and reviews
<AddToCart />                // Shopping cart
<CheckoutButton />           // Stripe checkout
```

#### Member Integration

**Enhanced Member Dashboard:**
- Show purchased works in "My Library"
- Member-only pricing on all publications
- Access to member-only content
- Ability to upgrade to Creator tier

**Creator Upgrade Flow:**
```
Member → "Become a Creator" → Fill out creator profile →
Link payment method → Agree to terms → Creator dashboard unlocked
```

---

### 6. Payment & Royalty System

#### Stripe Integration

**Products:**
- Dynamic products created per published work
- Multiple price points per product (ebook vs print vs audio)
- Member pricing with coupon codes

**Payment Flow:**
```typescript
// Create checkout session
const session = await stripe.checkout.sessions.create({
  line_items: [{
    price_data: {
      currency: 'usd',
      unit_amount: work.price_cents,
      product_data: {
        name: work.title,
        description: work.description,
        images: [work.cover_image_url],
      },
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `${BASE_URL}/publishing/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${BASE_URL}/publishing/${work.slug}`,
  metadata: {
    work_id: work.id,
    format_id: format.id,
    creator_id: work.creator_id,
  },
});
```

**Webhook Handling:**
```typescript
// On successful payment
case 'checkout.session.completed':
  const session = event.data.object;

  // Calculate royalty split
  const salePrice = session.amount_total;
  const platformFee = Math.round(salePrice * 0.05); // 5%
  const productionCost = format.production_cost_cents;
  const creatorRoyalty = salePrice - platformFee - productionCost;

  // Record sale
  await db.soullab_sales.insert({
    work_id: session.metadata.work_id,
    format_id: session.metadata.format_id,
    sale_price_cents: salePrice,
    platform_fee_cents: platformFee,
    production_cost_cents: productionCost,
    creator_royalty_cents: creatorRoyalty,
    // ... other fields
  });

  // Update creator balance
  await db.soullab_creators.update({
    where: { id: session.metadata.creator_id },
    data: {
      total_royalties_earned_cents: { increment: creatorRoyalty },
    },
  });

  // Generate download link
  const downloadUrl = await generateSecureDownloadUrl(saleId);

  // Email customer
  await sendPurchaseEmail(customer.email, downloadUrl);
```

#### Royalty Payout System

**Monthly Automatic Payouts:**
```typescript
// Cron job runs monthly
async function processMonthlyPayouts() {
  const creators = await getCreatorsWithUnpaidRoyalties();

  for (const creator of creators) {
    // Calculate period earnings
    const periodSales = await getSalesForPeriod(
      creator.id,
      startDate,
      endDate
    );

    const totalRoyalty = periodSales.reduce(
      (sum, sale) => sum + sale.creator_royalty_cents,
      0
    );

    // Minimum payout threshold: $25
    if (totalRoyalty < 2500) continue;

    // Create Stripe payout
    const payout = await stripe.payouts.create({
      amount: totalRoyalty,
      currency: 'usd',
      destination: creator.stripe_connected_account_id,
    });

    // Record in database
    await db.soullab_royalty_payouts.insert({
      creator_id: creator.id,
      period_start_date: startDate,
      period_end_date: endDate,
      total_royalty_cents: totalRoyalty,
      payout_amount_cents: totalRoyalty,
      stripe_payout_id: payout.id,
      payout_status: 'processing',
    });

    // Email creator
    await sendRoyaltyPayoutEmail(creator, totalRoyalty);
  }
}
```

---

### 7. Content Conversion Services

#### Document Conversion (Pandoc-based)

**Dockerfile for conversion service:**
```dockerfile
FROM pandoc/latex:latest

RUN apk add --no-cache \
    python3 \
    py3-pip \
    calibre

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY convert.py /app/
WORKDIR /app

CMD ["python3", "convert.py"]
```

**Conversion API:**
```python
# convert.py
from pandoc import write, read
import subprocess

def convert_docx_to_epub(input_path, output_path, metadata):
    # Read DOCX
    doc = read(input_path)

    # Add metadata
    doc.metadata.update({
        'title': metadata['title'],
        'author': metadata['author'],
        'lang': 'en-US',
    })

    # Convert to EPUB
    write(doc, output_path, format='epub3',
          options=['--toc', '--toc-depth=2'])

    return output_path

def convert_epub_to_mobi(epub_path, mobi_path):
    # Use Calibre's ebook-convert
    subprocess.run([
        'ebook-convert',
        epub_path,
        mobi_path,
        '--output-profile', 'kindle',
    ])

    return mobi_path
```

#### Audio Processing (FFmpeg)

```python
def process_audiobook_chapters(chapters, output_path):
    """Combine chapters, normalize audio, add metadata"""

    # Normalize audio levels
    normalized = []
    for chapter in chapters:
        normalized_path = normalize_audio(chapter['path'])
        normalized.append(normalized_path)

    # Concatenate
    concat_list = '\n'.join([f"file '{p}'" for p in normalized])
    subprocess.run([
        'ffmpeg',
        '-f', 'concat',
        '-safe', '0',
        '-i', concat_list,
        '-c', 'copy',
        output_path
    ])

    # Add metadata
    add_audiobook_metadata(output_path, metadata)

    return output_path
```

---

### 8. Security & Access Control

#### File Access Security

**Signed URLs for Digital Content:**
```typescript
async function generateSecureDownloadUrl(saleId: string) {
  const sale = await db.soullab_sales.findUnique({
    where: { id: saleId },
    include: { work: true, format: true },
  });

  if (!sale) throw new Error('Sale not found');

  // Generate signed S3 URL (expires in 1 hour)
  const params = {
    Bucket: 'soullab-published-content',
    Key: sale.format.file_url,
    Expires: 3600, // 1 hour
    ResponseContentDisposition: `attachment; filename="${sale.work.title}.${sale.format.file_format}"`,
  };

  const signedUrl = await s3.getSignedUrlPromise('getObject', params);

  // Record download token
  await db.download_tokens.create({
    data: {
      sale_id: saleId,
      token: generateToken(),
      expires_at: new Date(Date.now() + 3600 * 1000),
      max_downloads: 3,
      downloads_used: 0,
    },
  });

  return signedUrl;
}
```

#### Creator Data Privacy

**Row Level Security Policies:**
```sql
-- Creators can only see their own works
CREATE POLICY "Creators see own works"
  ON soullab_works FOR SELECT
  USING (creator_id IN (
    SELECT id FROM soullab_creators WHERE user_id = auth.uid()
  ));

-- Creators can only see their own sales
CREATE POLICY "Creators see own sales"
  ON soullab_sales FOR SELECT
  USING (work_id IN (
    SELECT id FROM soullab_works WHERE creator_id IN (
      SELECT id FROM soullab_creators WHERE user_id = auth.uid()
    )
  ));
```

---

### 9. Analytics & Reporting

#### Creator Analytics Dashboard

**Metrics Tracked:**
- Total sales (count, revenue)
- Sales by format (ebook vs print vs audio)
- Sales by channel (Soullab vs Amazon vs retailers)
- Geographic distribution
- Member vs non-member purchases
- Conversion rates (views → purchases)
- Average order value
- Revenue trends (daily, weekly, monthly)

**SQL Query Example:**
```sql
-- Monthly sales summary for creator
SELECT
  DATE_TRUNC('month', purchased_at) as month,
  COUNT(*) as sales_count,
  SUM(sale_price_cents) as total_revenue_cents,
  SUM(creator_royalty_cents) as total_royalty_cents,
  AVG(sale_price_cents) as avg_order_value_cents
FROM soullab_sales s
JOIN soullab_works w ON s.work_id = w.id
WHERE w.creator_id = $1
  AND purchased_at >= $2
GROUP BY DATE_TRUNC('month', purchased_at)
ORDER BY month DESC;
```

---

### 10. Integration Points

#### Genesis Platform Integration

**Creator Tier as Genesis Node Enhancement:**
- Genesis members can upgrade to Creator tier
- Creators get enhanced analytics via MAIA AI
- Personal Oracle can help with writing/publishing decisions
- Akashic Field integration for creative inspiration

**Database Links:**
```sql
-- Link creator to Genesis profile
ALTER TABLE soullab_creators
  ADD COLUMN genesis_profile_id UUID
  REFERENCES genesis_profiles(id);

-- Track which Genesis tier has creator access
UPDATE genesis_nodes
SET features = features || '{"creator_publishing": true}'::jsonb
WHERE tier IN ('grove', 'forest');
```

---

## Deployment Architecture

### Development Environment
- Local: Next.js dev server
- Database: Supabase (cloud)
- Storage: AWS S3 (dev bucket)
- Stripe: Test mode

### Production Environment
- Platform: Vercel (Next.js)
- Database: Supabase (production)
- Storage: AWS S3 (multi-region)
- CDN: CloudFront
- Stripe: Live mode
- Email: Resend
- Monitoring: Sentry + Vercel Analytics

### Infrastructure as Code
```yaml
# vercel.json
{
  "env": {
    "NEXT_PUBLIC_PUBLISHING_ENABLED": "true",
    "AWS_S3_BUCKET_MANUSCRIPTS": "@manuscripts-bucket",
    "AWS_S3_BUCKET_PUBLISHED": "@published-bucket",
    "STRIPE_PUBLISHING_WEBHOOK_SECRET": "@stripe-publishing-webhook"
  },
  "build": {
    "env": {
      "ENABLE_PUBLISHING": "1"
    }
  }
}
```

---

## Phase 1 Implementation Checklist

### Week 1-2: Foundation
- [ ] Run database schema in Supabase
- [ ] Set up AWS S3 buckets
- [ ] Create Stripe Connect for creator payouts
- [ ] Build creator profile creation flow
- [ ] Build work creation API

### Week 3-4: Upload & Storage
- [ ] Build file upload UI
- [ ] Implement S3 upload with progress
- [ ] Add virus scanning
- [ ] Extract file metadata
- [ ] Create file version control

### Week 5-6: Conversion Pipeline
- [ ] Set up Pandoc conversion service
- [ ] DOCX → EPUB conversion
- [ ] EPUB → MOBI conversion
- [ ] PDF generation for print
- [ ] Cover image processing

### Week 7-8: Commerce
- [ ] Build checkout flow
- [ ] Implement Stripe integration
- [ ] Create webhook handler
- [ ] Generate secure download links
- [ ] Build purchase confirmation emails

### Week 9-10: Creator Dashboard
- [ ] Sales analytics dashboard
- [ ] Royalty statements
- [ ] Work management UI
- [ ] Upload wizard
- [ ] Format management

### Week 11-12: Print-on-Demand
- [ ] IngramSpark account setup
- [ ] API integration for POD orders
- [ ] Print file preparation workflow
- [ ] Shipping tracking integration

---

## Success Metrics

**Phase 1 (Elemental Alchemy Launch):**
- Book published across 3+ formats
- First sale completed successfully
- Automated royalty calculation working
- Download delivery < 2 min after purchase

**Phase 2 (Member Publishing):**
- 10+ creators published
- 100+ works in catalog
- $10k+ in creator royalties distributed
- 95%+ creator satisfaction

**Phase 3 (Full Platform):**
- 100+ active creators
- 1000+ published works
- $100k+ annual creator royalties
- Multi-format support for all media types

---

Ready to start building! Which component should we tackle first?

1. Database setup (run schema in Supabase)
2. File upload system (S3 + API)
3. Checkout flow (Stripe integration)
4. Creator dashboard UI

Your choice! 🚀
