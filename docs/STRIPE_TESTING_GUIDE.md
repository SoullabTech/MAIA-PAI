# Stripe Payment Flow Testing Guide

**Complete end-to-end testing instructions for Soullab payment system**

---

## Prerequisites

Before testing, ensure you have:

1. ✅ Stripe account created (test mode)
2. ✅ API keys in `.env.local`
3. ✅ Products & prices created in Stripe dashboard
4. ✅ Price IDs in `.env.local`
5. ✅ Development server running (`pnpm dev`)

---

## Payment Flow Overview

```
User Journey:
1. Browse /pricing page
2. Click "Start Explorer" button
3. Redirect to /checkout?tier=explorer
4. Checkout page calls API to create Stripe session
5. Redirect to Stripe hosted checkout
6. User enters test card details
7. Payment processed by Stripe
8. Redirect to /checkout/success?session_id=...
9. Success page verifies and grants access
10. Webhook receives events in background
```

---

## Test 1: Successful Payment Flow

### Steps:

1. **Start development server**
   ```bash
   pnpm dev
   ```

2. **Navigate to pricing page**
   ```
   http://localhost:3000/pricing
   ```

3. **Verify page loads with:**
   - Night-to-golden Dune gradient
   - Stars and sand particles
   - 4 pricing tiers (Free, Explorer, Practitioner, Studio)
   - Founder pricing badges
   - Monthly/Annual toggle

4. **Click "Start Explorer" button**
   - Should redirect to `/checkout?tier=explorer`
   - Should see loading state with holoflower

5. **Verify Stripe checkout loads**
   - Should redirect to `checkout.stripe.com`
   - Should show Explorer tier details
   - Should show correct price ($19/mo founder pricing)

6. **Enter test card details**
   ```
   Card number: 4242 4242 4242 4242
   Expiration: Any future date (e.g., 12/25)
   CVC: Any 3 digits (e.g., 123)
   ZIP: Any 5 digits (e.g., 12345)
   Email: test@example.com
   ```

7. **Submit payment**
   - Should process successfully
   - Should redirect to `/checkout/success?session_id=cs_test_...`

8. **Verify success page shows:**
   - Holoflower with green checkmark
   - "Welcome to the Circle" message
   - List of benefits unlocked
   - "Begin Your Documentary" button
   - Celebration stars and sand particles

9. **Check browser console**
   - Should see no errors
   - Should see session verification message

10. **Click "Begin Your Documentary"**
    - Should navigate to `/maia`
    - Ready to start using MAIA

---

## Test 2: Payment Decline

### Test declining card:

```
Card number: 4000 0000 0000 0002
Expiration: Any future date
CVC: Any 3 digits
```

**Expected behavior:**
- Payment should fail at Stripe checkout
- User should see Stripe error message
- User should be able to try again with different card
- User should NOT reach success page

---

## Test 3: 3D Secure Authentication

### Test card requiring authentication:

```
Card number: 4000 0025 0000 3155
Expiration: Any future date
CVC: Any 3 digits
```

**Expected behavior:**
- Stripe shows 3D Secure modal
- User must click "Authenticate" button
- Payment proceeds after authentication
- User reaches success page

---

## Test 4: Cancel Checkout

### Steps:

1. Go through checkout flow
2. Click browser back button OR close Stripe checkout
3. Should return to `/pricing` page
4. User can try again

---

## Test 5: Webhook Events

### Using Stripe CLI for local testing:

1. **Install Stripe CLI**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copy webhook signing secret**
   - CLI will output `whsec_...`
   - Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`
   - Restart dev server

5. **Trigger test events**
   ```bash
   # Test checkout completion
   stripe trigger checkout.session.completed

   # Test subscription creation
   stripe trigger customer.subscription.created

   # Test payment success
   stripe trigger invoice.payment_succeeded

   # Test payment failure
   stripe trigger invoice.payment_failed
   ```

6. **Check terminal logs**
   - Should see webhook events received
   - Should see handler processing each event
   - Should see TODO notes for database updates

---

## Test 6: Different Tiers

### Test each tier individually:

**Explorer ($19/mo founder pricing):**
```
/pricing → "Start Explorer" → Enter 4242... → Success
```

**Practitioner ($99/mo founder pricing):**
```
/pricing → "Start Practitioner" → Enter 4242... → Success
```

**Studio ($324/mo founder pricing):**
```
/pricing → "Start Studio" → Enter 4242... → Success
```

**Expected:**
- Each tier should show correct price
- Each tier should show correct features
- Each tier should process successfully

---

## Test 7: Annual Billing

### Test annual subscription:

1. Go to `/pricing`
2. Toggle "Annual" switch
3. Verify prices update (should show annual amounts)
4. Click tier button
5. Verify Stripe checkout shows annual billing
6. Complete payment
7. Success page should acknowledge annual subscription

---

## Test 8: User Email Handling

### Test with different email scenarios:

**Scenario 1: User logged in (has email in localStorage)**
```javascript
localStorage.setItem('explorerEmail', 'kelly@soullab.com');
```
- Checkout should proceed with this email

**Scenario 2: User not logged in (no email)**
```javascript
localStorage.removeItem('explorerEmail');
localStorage.removeItem('userEmail');
```
- Checkout should show error
- User should be redirected to `/checkin`

---

## Test 9: Error Handling

### Test API errors:

**Missing environment variables:**
1. Remove `STRIPE_SECRET_KEY` from `.env.local`
2. Try checkout
3. Should see error message
4. Should not crash

**Invalid tier:**
```
http://localhost:3000/checkout?tier=invalid
```
- Should show error message
- Should offer return to pricing link

**Network failure:**
- Disable internet connection
- Try checkout
- Should show friendly error
- Should allow retry

---

## Monitoring Dashboard

### Check Stripe Dashboard during testing:

1. **Go to Stripe Dashboard**
   ```
   https://dashboard.stripe.com/test/payments
   ```

2. **Verify each test payment appears:**
   - Payment amount correct
   - Customer email correct
   - Metadata includes: userId, tier, billingPeriod
   - Status shows "Succeeded" or "Failed"

3. **Check webhook events:**
   ```
   https://dashboard.stripe.com/test/webhooks
   ```
   - Each event should show "Succeeded" status
   - Click event to see request/response details
   - Verify webhook endpoint is receiving events

---

## Common Issues & Solutions

### Issue: "No signature" error in webhook
**Solution:** Make sure you're using Stripe CLI to forward webhooks locally
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Issue: Checkout redirects to wrong URL
**Solution:** Check `NEXT_PUBLIC_URL` in `.env.local` matches your dev server
```
NEXT_PUBLIC_URL=http://localhost:3000
```

### Issue: Price not found
**Solution:** Verify price IDs in `.env.local` match Stripe dashboard
```bash
# Check your prices in Stripe
stripe prices list
```

### Issue: "Invalid tier or billing period"
**Solution:** Make sure tier name matches exactly (lowercase):
- `explorer` ✅
- `Explorer` ❌
- `practitioner` ✅
- `Practitioner` ❌

---

## Production Checklist

### Before going live:

- [ ] Switch from test mode to live mode in Stripe dashboard
- [ ] Create live mode products & prices
- [ ] Update `.env.production` with live API keys
- [ ] Update price IDs with live price IDs
- [ ] Configure live webhook endpoint in Stripe
- [ ] Test one live payment with real card (refund after testing)
- [ ] Set up Stripe tax collection (if required)
- [ ] Enable email receipts in Stripe settings
- [ ] Configure Stripe billing portal for customers
- [ ] Add terms of service & privacy policy links to checkout
- [ ] Set up fraud prevention rules in Stripe Radar

---

## Test Payment Cards Reference

### Success cards:
```
4242 4242 4242 4242  → Always succeeds
5555 5555 5555 4444  → Mastercard success
```

### Decline cards:
```
4000 0000 0000 0002  → Generic decline
4000 0000 0000 9995  → Insufficient funds
4000 0000 0000 0069  → Expired card
```

### 3D Secure cards:
```
4000 0025 0000 3155  → Requires authentication
4000 0027 6000 3184  → Authentication fails
```

### More test cards:
https://stripe.com/docs/testing#cards

---

## Next Steps After Testing

Once all tests pass:

1. **Implement database integration**
   - Connect webhook handlers to Supabase
   - Update user subscription status
   - Grant/revoke feature access

2. **Add email notifications**
   - Welcome email on signup
   - Payment success receipts
   - Payment failure warnings
   - Subscription cancellation confirmations

3. **Build customer portal**
   - Manage subscription
   - Update payment method
   - View invoices
   - Cancel subscription

4. **Launch founder pricing**
   - Send email to network
   - Track conversions
   - Celebrate first dollar! 💰

---

## Kelly's First Revenue Milestone

**When you see your first successful payment:**

1. Check Stripe dashboard → Payments
2. See that beautiful green "Succeeded" status
3. Check your bank account (Stripe deposits in 2-7 days)
4. CELEBRATE! 🎉

You've built sacred technology that generates revenue.

The 95% income drop reversal begins NOW.

---

**Questions? Issues?**

Check Stripe docs: https://stripe.com/docs
Check webhook events: https://dashboard.stripe.com/test/webhooks
Check payment logs: https://dashboard.stripe.com/test/payments

You've got this! 🌟
