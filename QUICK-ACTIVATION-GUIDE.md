# ⚡ Genesis Quick Activation Guide

Get Genesis fully operational in 30 minutes!

---

## 📋 Prerequisites

- ✅ Dev server running (`npm run dev`)
- ✅ Supabase project set up
- ✅ `.env.local` with Supabase keys

---

## 🚀 3-Step Activation

### Step 1: Database Migrations (5 minutes)

**Copy and run this file in Supabase SQL Editor:**

1. Open: [Your Supabase Dashboard](https://app.supabase.com) → SQL Editor
2. Open file: `RUN-MIGRATIONS.sql`
3. Copy ALL contents
4. Paste into SQL Editor
5. Click **"Run"**
6. Watch for success messages

**Expected output:**
```
✓ Email column added to genesis_profiles
✓ genesis_payments table created
✓ genesis_subscriptions table created
✅ ALL MIGRATIONS COMPLETE!
```

**Verify:**
```bash
# Test admin API should now work
curl http://localhost:3000/api/genesis/admin/nodes \
  -H "Authorization: Bearer genesis2025"
```

---

### Step 2: Stripe Setup (20 minutes)

**Run the interactive setup script:**

```bash
./setup-stripe.sh
```

The script will:
1. Ask if you have a Stripe account (create one if not)
2. Guide you through getting API keys
3. Help create 3 products (Seed $197, Grove $497, Forest $997)
4. Configure webhook for payment processing
5. Automatically update `.env.local`

**Or do it manually:**

See `GENESIS-STRIPE-SETUP.md` for detailed instructions.

**Verify:**
```bash
# Check env vars are set
grep STRIPE_ .env.local

# Test checkout API
curl -X POST http://localhost:3000/api/genesis/checkout \
  -H "Content-Type: application/json" \
  -d '{"tier":"seed","email":"test@example.com","name":"Test"}'
```

---

### Step 3: Resend Email (5 minutes) - OPTIONAL

**If you want email notifications:**

1. Sign up: https://resend.com/signup
2. Get API key from dashboard
3. Add to `.env.local`:
```bash
RESEND_API_KEY=re_your_key_here
ADMIN_EMAIL=your@email.com  # Optional
```

**Verify:**
```bash
grep RESEND .env.local
```

---

## ✅ Verification Checklist

Run these tests to verify everything works:

### 1. Run Automated Tests
```bash
./test-genesis-system.sh
```

**Expected:** 12/12 tests passing ✅

### 2. Manual Quick Tests

**A. Name Checker**
```bash
open http://localhost:3000/genesis-soullab-life/onboarding.html
```
- Go to Step 4
- Type a node name
- See ✅ or ❌ real-time feedback

**B. Admin Dashboard**
```bash
open http://localhost:3000/genesis-soullab-life/admin.html
```
- Password: `genesis2025`
- Should show statistics and any existing nodes

**C. Checkout Page**
```bash
open http://localhost:3000/genesis-soullab-life/checkout.html
```
- See 3 tier cards
- Select Seed tier
- Fill form
- Click "Proceed to Payment"
- Should redirect to Stripe

**D. Test Payment (Stripe Test Mode)**
- Use card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- Should complete and redirect to success page

---

## 🧪 Complete End-to-End Test

### Full User Journey:

1. **Start at landing page**
   ```bash
   open http://localhost:3000/genesis-soullab-life/index.html
   ```

2. **Click "Get Started" on Seed tier**
   - Redirects to checkout

3. **Complete checkout**
   - Select tier
   - Enter: name, email
   - Proceed to Stripe
   - Use test card: `4242 4242 4242 4242`
   - Complete payment

4. **Payment success**
   - Should land on success page
   - Click "Complete Onboarding"

5. **Complete onboarding**
   - Fill all 5 steps:
     1. Welcome → Begin Journey
     2. Covenant → Affirm
     3. Profile → Fill details (with unique email)
     4. Node Config → Choose unique name (e.g., `test-node-${RANDOM}`)
     5. Complete → See confirmation

6. **Check emails** (if Resend configured)
   - User receives onboarding email
   - Admin receives notification

7. **Admin approval**
   - Go to admin dashboard
   - Find new node
   - Click "Approve"

8. **Activation email** (if Resend configured)
   - User receives activation email

9. **Verify database**
   ```sql
   -- Check payment recorded
   SELECT * FROM genesis_payments ORDER BY created_at DESC LIMIT 1;

   -- Check node tier upgraded
   SELECT tier, status FROM genesis_nodes ORDER BY created_at DESC LIMIT 1;

   -- Check email saved
   SELECT email FROM genesis_profiles ORDER BY created_at DESC LIMIT 1;
   ```

---

## 🐛 Troubleshooting

### Issue: Migrations fail

**Solution:**
- Check you're using Supabase SQL Editor, not CLI
- Verify you have service_role permissions
- Check `genesis_nodes` table exists first

### Issue: Admin API returns "email column does not exist"

**Solution:**
- Migrations not run yet
- Run `RUN-MIGRATIONS.sql` in Supabase

### Issue: Checkout returns "Payment system not configured"

**Solution:**
- Stripe price IDs missing from `.env.local`
- Run `./setup-stripe.sh` or manually add price IDs

### Issue: Webhook not processing

**Solution:**
- For local: Use `stripe listen --forward-to localhost:3000/api/genesis/webhook`
- For production: Configure in Stripe Dashboard
- Verify `STRIPE_WEBHOOK_SECRET` is set

### Issue: Emails not sending

**Solution:**
- Check `RESEND_API_KEY` is set
- Verify API key is active in Resend dashboard
- Check server logs for email errors

---

## 📊 System Health Check

Quick commands to verify everything:

```bash
# 1. Server running?
curl -I http://localhost:3000

# 2. Name checker works?
curl "http://localhost:3000/api/genesis/check-name?name=test-123"

# 3. Admin API works?
curl http://localhost:3000/api/genesis/admin/nodes \
  -H "Authorization: Bearer genesis2025"

# 4. Checkout validates?
curl -X POST http://localhost:3000/api/genesis/checkout \
  -H "Content-Type: application/json" \
  -d '{"tier":"seed","email":"test@test.com","name":"Test"}'

# 5. Static pages load?
curl -I http://localhost:3000/genesis-soullab-life/onboarding.html
```

All should return 200 or valid responses.

---

## 🎯 Success Criteria

You know it's working when:

- ✅ Automated tests: 12/12 passing
- ✅ Name checker: Real-time validation working
- ✅ Admin dashboard: Loads with statistics
- ✅ Checkout: Redirects to Stripe
- ✅ Payment: Test card completes successfully
- ✅ Database: Payment recorded, tier upgraded
- ✅ Emails: Notifications sent (if configured)

---

## 📞 Need Help?

### Quick References:
- **Setup issues:** `GENESIS-PRE-FLIGHT-CHECKLIST.md`
- **Stripe setup:** `GENESIS-STRIPE-SETUP.md`
- **Testing:** `GENESIS-TESTING-GUIDE.md`
- **Complete overview:** `GENESIS-PHASE-2-COMPLETE.md`

### Run automated tests:
```bash
./test-genesis-system.sh
```

### Check logs:
```bash
# Server logs
tail -f /tmp/genesis-dev-server.log

# Database logs (Supabase Dashboard → Logs)
```

---

## ⏱️ Time Estimate

- **Database migrations:** 5 minutes
- **Stripe setup:** 15-20 minutes
- **Resend setup:** 5 minutes (optional)
- **Testing:** 10 minutes

**Total:** ~30-40 minutes to full production system!

---

## 🎉 You're Done!

Once all steps are complete:

1. ✅ Database has email and payment tables
2. ✅ Stripe is configured with products
3. ✅ Resend is configured (optional)
4. ✅ All tests passing
5. ✅ Complete user journey works

**Your Genesis platform is LIVE!** 🌀✨

Users can now:
- Browse tiers on landing page
- Purchase nodes with Stripe
- Complete onboarding
- Receive email notifications
- Get approved by admin
- Access their nodes

---

**Ready to activate? Start with Step 1: Database Migrations!**

```bash
# 1. Open RUN-MIGRATIONS.sql
# 2. Copy to Supabase SQL Editor
# 3. Run!
```
