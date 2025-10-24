# Genesis Stripe Payment Setup Guide

Complete guide to configure Stripe payments for Genesis node purchases.

---

## Overview

Genesis uses Stripe for secure one-time payments. The system supports three tiers:
- **Seed**: $197 (Personal consciousness platform)
- **Grove**: $497 (Professional practice platform)
- **Forest**: $997 (Network sovereignty)

---

## 1. Stripe Account Setup

### Create Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Complete account setup
3. Verify your business details

### Get API Keys
1. Navigate to **Developers → API keys**
2. Copy your keys:
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)

---

## 2. Create Products and Prices

### Option A: Stripe Dashboard (Recommended for first-time setup)

1. Navigate to **Products** in Stripe Dashboard
2. Click **+ Add product**

#### Seed Tier Product
- **Name**: Genesis Seed Tier
- **Description**: Personal consciousness platform - Your node begins
- **Pricing**:
  - Type: One time
  - Price: $197.00 USD
- **Payment type**: One-time
- Copy the **Price ID** (starts with `price_`)

#### Grove Tier Product
- **Name**: Genesis Grove Tier
- **Description**: Professional practice platform - For practitioners and guides
- **Pricing**:
  - Type: One time
  - Price: $497.00 USD
- **Payment type**: One-time
- Copy the **Price ID**

#### Forest Tier Product
- **Name**: Genesis Forest Tier
- **Description**: Network sovereignty - Build your conscious community
- **Pricing**:
  - Type: One time
  - Price: $997.00 USD
- **Payment type**: One-time
- Copy the **Price ID**

### Option B: Stripe CLI (Automated)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Create products and prices
stripe products create \
  --name "Genesis Seed Tier" \
  --description "Personal consciousness platform" \
  --default-price-data.currency=usd \
  --default-price-data.unit-amount=19700

stripe products create \
  --name "Genesis Grove Tier" \
  --description "Professional practice platform" \
  --default-price-data.currency=usd \
  --default-price-data.unit-amount=49700

stripe products create \
  --name "Genesis Forest Tier" \
  --description "Network sovereignty platform" \
  --default-price-data.currency=usd \
  --default-price-data.unit-amount=99700
```

---

## 3. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your publishable key
STRIPE_SECRET_KEY=sk_test_...                    # Your secret key

# Stripe Product IDs (optional, for reference)
STRIPE_PRODUCT_ID_SEED=prod_...
STRIPE_PRODUCT_ID_GROVE=prod_...
STRIPE_PRODUCT_ID_FOREST=prod_...

# Stripe Price IDs (REQUIRED)
STRIPE_PRICE_ID_SEED=price_...      # Seed tier price ID
STRIPE_PRICE_ID_GROVE=price_...     # Grove tier price ID
STRIPE_PRICE_ID_FOREST=price_...    # Forest tier price ID

# Webhook Secret (get from step 4)
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 4. Configure Webhook Endpoint

Webhooks notify your app when payments succeed.

### Production Setup

1. Go to **Developers → Webhooks** in Stripe Dashboard
2. Click **+ Add endpoint**
3. Enter your webhook URL: `https://www.soullab.life/api/genesis/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### Local Development Testing

```bash
# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/genesis/webhook

# Copy the webhook signing secret it outputs
# Add to .env.local as STRIPE_WEBHOOK_SECRET
```

---

## 5. Database Migration

Run the payment tracking migration in Supabase:

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20251024_genesis_payments.sql`
3. Execute the SQL
4. Verify tables created:
   - `genesis_payments`
   - `genesis_subscriptions`

---

## 6. Test the Payment Flow

### Test Mode (Recommended First)
Use Stripe test mode with test cards:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Failed Payment:**
- Card: `4000 0000 0000 0002`

### Test Checkout Flow

1. Visit `https://genesis.soullab.life/checkout.html`
2. Select a tier (Seed, Grove, or Forest)
3. Enter test information:
   - Name: Test User
   - Email: test@example.com
4. Click "Proceed to Payment"
5. Use test card details above
6. Verify redirect to success page
7. Check Supabase `genesis_payments` table for new record

### Verify Webhook Processing

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Check recent webhook events
4. Verify `checkout.session.completed` shows as "Succeeded"

---

## 7. Pricing Alignment

**Current Checkout Configuration:**
- Seed: $197
- Grove: $497
- Forest: $997

**Landing Page Pricing (needs update):**
- Seed: $997
- Grove: $1,997
- Forest: $3,500

**Action Required:** Update pricing on landing page OR update Stripe config to match landing page pricing.

To update Stripe prices:
1. Open `lib/stripe/config.ts`
2. Update the `price` values in `GENESIS_TIERS`
3. Create new Stripe products with updated prices
4. Update environment variables with new price IDs

---

## 8. Enable Production Mode

### Before Going Live:

1. **Complete Stripe account activation**
   - Submit business information
   - Add bank account for payouts
   - Complete identity verification

2. **Switch to live keys**
   - Get live API keys (starts with `pk_live_` and `sk_live_`)
   - Update `.env.local` with live keys
   - Create live webhook endpoint

3. **Create live products**
   - Repeat product creation in live mode
   - Update environment variables with live price IDs

4. **Test with real card** (small amount)
   - Use a personal card
   - Verify full payment flow
   - Check webhook delivery
   - Verify database records
   - Test refund process

---

## 9. Monitoring & Analytics

### Stripe Dashboard
- **Payments**: View all transactions
- **Customers**: Track customer records
- **Webhooks**: Monitor webhook success/failures
- **Logs**: Debug API calls

### Database Monitoring

Query recent payments:
```sql
SELECT
  node_id,
  tier,
  amount_cents / 100.0 as amount_usd,
  status,
  customer_email,
  paid_at
FROM genesis_payments
ORDER BY created_at DESC
LIMIT 50;
```

Check payment success rate:
```sql
SELECT
  status,
  COUNT(*) as count,
  SUM(amount_cents) / 100.0 as total_usd
FROM genesis_payments
GROUP BY status;
```

---

## 10. Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL is correct in Stripe Dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` is set
3. Check Stripe Dashboard → Webhooks for failed deliveries
4. For localhost: Ensure `stripe listen` is running

### Payment Not Recording in Database

1. Check Supabase logs for errors
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set
3. Check webhook logs in Stripe Dashboard
4. Look for errors in server logs

### Checkout Session Not Creating

1. Verify `STRIPE_SECRET_KEY` is valid
2. Check `STRIPE_PRICE_ID_*` environment variables are set
3. Look for errors in browser console
4. Check server logs for API errors

### Common Error Messages

**"Payment system not fully configured"**
→ Missing `STRIPE_PRICE_ID_*` environment variables

**"Invalid signature"**
→ Wrong `STRIPE_WEBHOOK_SECRET` or webhook not properly configured

**"Failed to create checkout session"**
→ Check Stripe API key permissions and price ID validity

---

## 11. Security Checklist

- ✅ Never commit `.env.local` to git
- ✅ Use environment variables for all keys
- ✅ Verify webhook signatures in webhook handler
- ✅ Use HTTPS in production
- ✅ Validate all payment amounts server-side
- ✅ Enable Stripe Radar for fraud detection
- ✅ Set up email notifications for failed payments
- ✅ Regularly review payment logs and analytics

---

## Support Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com
- **Genesis Support**: genesis@soullab.life
- **Webhook Testing**: https://stripe.com/docs/webhooks/test

---

## File Reference

### Core Files
- `lib/stripe/config.ts` - Tier configuration
- `app/api/genesis/checkout/route.ts` - Checkout session creation
- `app/api/genesis/webhook/route.ts` - Webhook event handler
- `supabase/migrations/20251024_genesis_payments.sql` - Database schema

### UI Files
- `public/genesis-soullab-life/checkout.html` - Checkout page
- `public/genesis-soullab-life/payment-success.html` - Success page
- `public/genesis-soullab-life/index.html` - Landing page (CTAs)

---

**System Status:** Ready for testing! Follow steps 1-6 to activate payments.
