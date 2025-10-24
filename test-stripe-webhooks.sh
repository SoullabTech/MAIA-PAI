#!/bin/bash

# ============================================================================
# Stripe Webhook Testing Script
# ============================================================================
# This script helps test Stripe webhook integration locally
#
# Prerequisites:
# 1. Install Stripe CLI: brew install stripe/stripe-cli/stripe
# 2. Login: stripe login
# 3. Run this script to forward webhooks to localhost
# ============================================================================

echo "🔗 MAIA Stripe Webhook Tester"
echo "=============================="
echo ""
echo "This will forward Stripe webhook events to your local server."
echo "Make sure your dev server is running on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop listening."
echo ""

# Forward webhooks to local endpoint
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Alternative: Test specific events manually
# stripe trigger customer.subscription.created
# stripe trigger customer.subscription.updated
# stripe trigger invoice.payment_succeeded
# stripe trigger invoice.payment_failed
