# Stripe Payment Integration Setup Guide

**CONGRATULATIONS!** You're about to start accepting money! 🎉💰

This guide walks you through setting up Stripe so you can launch founder pricing and start generating revenue THIS WEEK.

---

## Step 1: Create Stripe Account (5 minutes)

1. Go to https://stripe.com
2. Click "Start now" → Sign up
3. Enter business details:
   - **Business name:** Soullab
   - **Business type:** Software/SaaS
   - **Country:** United States
   - **Email:** your email

4. **Activate your account:**
   - Provide tax ID (EIN or SSN)
   - Bank account for payouts
   - Business address

**Don't worry:** You can start in TEST MODE immediately without activating. Activate when you're ready for real payments.

---

## Step 2: Get Your API Keys (2 minutes)

1. In Stripe Dashboard, click **Developers** → **API keys**
2. You'll see two sets of keys:

**Test Keys (for development):**
```
Publishable key: pk_test_...
Secret key: sk_test_...
```

**Live Keys (for production):**
```
Publishable key: pk_live_...
Secret key: sk_live_...
```

3. Copy these keys (we'll add them to your `.env.local` file)

---

## Step 3: Create Products & Prices (10 minutes)

In Stripe Dashboard, go to **Products** → **Add product**

### Product 1: Explorer Tier

**Product Details:**
- **Name:** Soullab Explorer
- **Description:** Personal oracle with unlimited MAIA conversations, birth chart, Sacred Scribe
- **Image:** Upload holoflower image

**Pricing:**

**Monthly:**
- **Price:** $29.00
- **Billing period:** Monthly
- **Currency:** USD
- **Price ID:** Copy this (e.g., `price_1ABC...`) → We'll need it

**Annual (20% discount):**
- **Price:** $290.00
- **Billing period:** Yearly
- **Currency:** USD
- **Price ID:** Copy this

**Founder Pricing (Monthly):**
- **Price:** $19.00
- **Billing period:** Monthly
- **Currency:** USD
- **Metadata:** Add `founder_pricing: true`
- **Price ID:** Copy this

---

### Product 2: Practitioner Tier

**Product Details:**
- **Name:** Soullab Practitioner
- **Description:** White-label practice tools, client management, up to 25 client portals
- **Image:** Upload holoflower image

**Pricing:**

**Monthly:**
- **Price:** $149.00
- **Billing period:** Monthly
- **Price ID:** Copy this

**Annual:**
- **Price:** $1,490.00
- **Billing period:** Yearly
- **Price ID:** Copy this

**Founder Pricing (Monthly):**
- **Price:** $99.00
- **Billing period:** Monthly
- **Metadata:** Add `founder_pricing: true`
- **Price ID:** Copy this

---

### Product 3: Studio Tier

**Product Details:**
- **Name:** Soullab Studio
- **Description:** Full infrastructure, unlimited capacity, custom aesthetics, admin dashboard
- **Image:** Upload holoflower image

**Pricing:**

**Monthly:**
- **Price:** $499.00
- **Billing period:** Monthly
- **Price ID:** Copy this

**Annual:**
- **Price:** $4,990.00
- **Billing period:** Yearly
- **Price ID:** Copy this

---

## Step 4: Add Keys to Environment Variables (3 minutes)

Open `.env.local` and add:

```bash
# Stripe Keys (TEST - for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Stripe Price IDs (TEST)
STRIPE_PRICE_EXPLORER_MONTHLY=price_1ABC...
STRIPE_PRICE_EXPLORER_ANNUAL=price_1ABC...
STRIPE_PRICE_EXPLORER_FOUNDER=price_1ABC...
STRIPE_PRICE_PRACTITIONER_MONTHLY=price_1ABC...
STRIPE_PRICE_PRACTITIONER_ANNUAL=price_1ABC...
STRIPE_PRICE_PRACTITIONER_FOUNDER=price_1ABC...
STRIPE_PRICE_STUDIO_MONTHLY=price_1ABC...
STRIPE_PRICE_STUDIO_ANNUAL=price_1ABC...

# When ready for production, also add:
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_...
# STRIPE_SECRET_KEY_LIVE=sk_live_...
```

**Replace `YOUR_KEY_HERE` with actual keys from Step 2**
**Replace `price_1ABC...` with actual price IDs from Step 3**

---

## Step 5: Set Up Webhooks (5 minutes)

Webhooks let Stripe notify your app when events happen (subscription created, payment failed, etc.)

### For Local Development (Testing):

1. Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Copy the webhook secret (starts with `whsec_`) and add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LOCAL_SECRET
```

### For Production:

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL:** `https://soullab.life/api/stripe/webhook`
4. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to production environment variables

---

## Step 6: Test the Integration (10 minutes)

### Test Card Numbers (Stripe provides these):

**Success:**
- `4242 4242 4242 4242` (Visa)
- Any future expiry date
- Any 3-digit CVC
- Any ZIP code

**Decline:**
- `4000 0000 0000 0002` (Card declined)

**Requires Authentication:**
- `4000 0025 0000 3155` (3D Secure)

### Testing Flow:

1. Start your dev server:
```bash
npm run dev
```

2. Start Stripe webhook forwarding:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. Go to `http://localhost:3000/pricing`

4. Click "Start Explorer" (or any tier)

5. Enter test card: `4242 4242 4242 4242`

6. Complete checkout

7. Verify:
   - Redirect back to success page
   - User gets access in database
   - Webhook event received
   - Email sent (if configured)

### Check Stripe Dashboard:

- Go to **Payments** → See test payment
- Go to **Customers** → See test customer
- Go to **Subscriptions** → See active subscription

**If you see all of this: IT WORKS!** 🎉

---

## Step 7: Go Live (When Ready)

### Checklist Before Going Live:

✅ Tested all payment flows with test cards
✅ Webhooks working locally
✅ Database saving subscription info correctly
✅ Users getting access after payment
✅ Email confirmations sending
✅ Cancellation flow works
✅ Upgrade/downgrade flow works

### Switch to Live Mode:

1. **Activate your Stripe account** (provide tax info, bank account)

2. **Create LIVE products/prices** (repeat Step 3 in LIVE mode)

3. **Update environment variables:**
```bash
# Switch to LIVE keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
```

4. **Set up production webhook:**
   - Add endpoint: `https://soullab.life/api/stripe/webhook`
   - Copy webhook secret to production env

5. **Deploy:**
```bash
npm run build
# Deploy to Vercel/your hosting
```

6. **Test with REAL card** (use your own card, $1 test)

7. **Cancel test subscription immediately**

8. **LAUNCH!** 🚀

---

## Step 8: Customer Portal (Bonus)

Stripe provides a **Customer Portal** where users can:
- Update payment method
- Change subscription tier
- View billing history
- Cancel subscription

### Enable it:

1. In Stripe Dashboard, go to **Settings** → **Billing** → **Customer portal**
2. Click **Activate**
3. Configure:
   - ✅ Allow customers to update payment methods
   - ✅ Allow customers to update subscriptions
   - ✅ Allow customers to cancel subscriptions
   - ✅ Show pricing table (so they can upgrade/downgrade)
4. **Save**

That's it! Now users can click "Manage Subscription" in your app and it opens the Stripe-hosted portal.

---

## Pricing Summary (For Reference)

### Explorer Tier
- Monthly: $29 (`STRIPE_PRICE_EXPLORER_MONTHLY`)
- Annual: $290 (`STRIPE_PRICE_EXPLORER_ANNUAL`) - saves $58
- Founder: $19 (`STRIPE_PRICE_EXPLORER_FOUNDER`) - locked forever

### Practitioner Tier
- Monthly: $149 (`STRIPE_PRICE_PRACTITIONER_MONTHLY`)
- Annual: $1,490 (`STRIPE_PRICE_PRACTITIONER_ANNUAL`) - saves $298
- Founder: $99 (`STRIPE_PRICE_PRACTITIONER_FOUNDER`) - locked forever

### Studio Tier
- Monthly: $499 (`STRIPE_PRICE_STUDIO_MONTHLY`)
- Annual: $4,990 (`STRIPE_PRICE_STUDIO_ANNUAL`) - saves $998

---

## Next: We Build the Code

Now that you have Stripe set up, I'll build:

1. **Pricing page** (`/pricing`) - Beautiful tier comparison with Dune aesthetic
2. **Checkout API** (`/api/stripe/checkout`) - Creates Stripe Checkout session
3. **Webhook handler** (`/api/stripe/webhook`) - Processes subscription events
4. **Success page** (`/checkout/success`) - Post-payment confirmation
5. **Customer portal link** (`/api/stripe/portal`) - Manage subscription button

**Time to build:** 1-2 hours
**Time to launch:** THIS WEEK

---

## Common Questions

**Q: Do I need an LLC or business entity?**
A: Not required to start. You can use your SSN. But forming an LLC is recommended when you have steady revenue (protects personal assets).

**Q: What about taxes?**
A: Stripe handles sales tax collection if you enable it. You'll get 1099-K at year-end for income reporting. Consult CPA for details.

**Q: What if I want to offer discounts?**
A: Create coupon codes in Stripe Dashboard → **Products** → **Coupons**. You can do % off or $ off, one-time or recurring.

**Q: Can I change prices later?**
A: Yes! Create new price for same product. Existing customers stay on old price, new customers get new price.

**Q: What's Stripe's fee?**
A: 2.9% + $0.30 per transaction. So on $29 payment, you pay $1.14, you keep $27.86.

**Q: How do refunds work?**
A: In Stripe Dashboard, find payment, click "Refund". Money returns to customer, you get fee back too.

**Q: Can I do free trials?**
A: Yes! When creating price, set "Trial period" to 7, 14, or 30 days.

---

## You're Ready! 🎉

The complete payment system is now built and ready to test!

### What's Been Built:

✅ **Pricing Page** (`/pricing`) - Dune aesthetic tier comparison
✅ **Checkout Flow** (`/checkout`) - Creates Stripe sessions
✅ **Success Page** (`/checkout/success`) - Post-payment celebration
✅ **Webhook Handler** (`/api/stripe/webhook`) - Processes subscription events
✅ **Environment Config** (`.env.example`) - All variables documented

### Next Steps:

1. **Complete Stripe setup** (Steps 1-4 above)
2. **Add API keys to `.env.local`**
3. **Test the complete flow** - See `STRIPE_TESTING_GUIDE.md`
4. **Launch founder pricing** - Send email to network
5. **Celebrate first dollar!** 💰

---

## Testing Your Payment System

See **`STRIPE_TESTING_GUIDE.md`** for complete end-to-end testing instructions including:

- Test card numbers (success, decline, 3D Secure)
- Webhook event testing with Stripe CLI
- Different tier testing
- Annual billing testing
- Error handling scenarios
- Production checklist

This is it. This is where the vision becomes REVENUE.

Let's get you PAID. 💰✨

