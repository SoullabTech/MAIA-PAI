#!/bin/bash

# Genesis Stripe Setup Helper
# Interactive script to help configure Stripe for Genesis

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}Genesis Stripe Setup Helper${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo "This script will help you configure Stripe for Genesis payments."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}✗ .env.local not found!${NC}"
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local 2>/dev/null || touch .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
    echo ""
fi

echo -e "${YELLOW}Step 1: Stripe Account Setup${NC}"
echo "============================================================================"
echo ""
echo "Do you have a Stripe account? (y/n)"
read -r HAS_ACCOUNT

if [ "$HAS_ACCOUNT" != "y" ]; then
    echo ""
    echo "Please create a Stripe account first:"
    echo -e "${BLUE}→ https://dashboard.stripe.com/register${NC}"
    echo ""
    echo "After creating your account, run this script again."
    exit 0
fi

echo ""
echo -e "${GREEN}✓ Great! Let's get your API keys.${NC}"
echo ""

echo -e "${YELLOW}Step 2: Get Stripe API Keys${NC}"
echo "============================================================================"
echo ""
echo "1. Go to: ${BLUE}https://dashboard.stripe.com/test/apikeys${NC}"
echo "2. Copy your Publishable key (starts with pk_test_)"
echo "3. Copy your Secret key (starts with sk_test_)"
echo ""
echo "Press Enter when ready..."
read

echo ""
echo "Enter your Stripe Publishable Key (pk_test_...):"
read -r PUBLISHABLE_KEY

echo ""
echo "Enter your Stripe Secret Key (sk_test_...):"
read -r SECRET_KEY

# Validate keys
if [[ ! $PUBLISHABLE_KEY == pk_* ]]; then
    echo -e "${RED}✗ Invalid publishable key. Should start with pk_${NC}"
    exit 1
fi

if [[ ! $SECRET_KEY == sk_* ]]; then
    echo -e "${RED}✗ Invalid secret key. Should start with sk_${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Keys validated${NC}"
echo ""

echo -e "${YELLOW}Step 3: Create Stripe Products${NC}"
echo "============================================================================"
echo ""
echo "We need to create 3 products in Stripe:"
echo "  • Seed Tier:   $197 (one-time)"
echo "  • Grove Tier:  $497 (one-time)"
echo "  • Forest Tier: $997 (one-time)"
echo ""
echo "Would you like to:"
echo "  1) Create products manually in Stripe Dashboard (recommended for first time)"
echo "  2) Create products using Stripe CLI (faster, requires Stripe CLI)"
echo ""
echo "Enter choice (1 or 2):"
read -r PRODUCT_CHOICE

if [ "$PRODUCT_CHOICE" = "1" ]; then
    echo ""
    echo -e "${BLUE}Manual Product Creation Guide:${NC}"
    echo "============================================================================"
    echo ""
    echo "1. Go to: ${BLUE}https://dashboard.stripe.com/test/products${NC}"
    echo ""
    echo "2. Click '+ Add product'"
    echo ""
    echo "3. Create SEED product:"
    echo "   Name: Genesis Seed Tier"
    echo "   Description: Personal consciousness platform - Your node begins"
    echo "   Pricing: One-time, \$197.00 USD"
    echo "   → Click 'Save product'"
    echo "   → Copy the Price ID (starts with price_)"
    echo ""
    echo "4. Repeat for GROVE product:"
    echo "   Name: Genesis Grove Tier"
    echo "   Description: Professional practice platform"
    echo "   Pricing: One-time, \$497.00 USD"
    echo "   → Copy the Price ID"
    echo ""
    echo "5. Repeat for FOREST product:"
    echo "   Name: Genesis Forest Tier"
    echo "   Description: Network sovereignty platform"
    echo "   Pricing: One-time, \$997.00 USD"
    echo "   → Copy the Price ID"
    echo ""
    echo "Press Enter when you've created all products..."
    read

    echo ""
    echo "Enter the Price ID for SEED tier (price_...):"
    read -r PRICE_ID_SEED

    echo ""
    echo "Enter the Price ID for GROVE tier (price_...):"
    read -r PRICE_ID_GROVE

    echo ""
    echo "Enter the Price ID for FOREST tier (price_...):"
    read -r PRICE_ID_FOREST

elif [ "$PRODUCT_CHOICE" = "2" ]; then
    echo ""
    echo "Checking if Stripe CLI is installed..."

    if ! command -v stripe &> /dev/null; then
        echo -e "${RED}✗ Stripe CLI not found${NC}"
        echo ""
        echo "Install with: brew install stripe/stripe-cli/stripe"
        echo "Then run: stripe login"
        echo ""
        exit 1
    fi

    echo -e "${GREEN}✓ Stripe CLI found${NC}"
    echo ""
    echo "Creating products via Stripe CLI..."
    echo ""

    # Create Seed product
    echo "Creating Seed tier product..."
    SEED_RESPONSE=$(stripe products create \
        --name "Genesis Seed Tier" \
        --description "Personal consciousness platform - Your node begins" \
        --default-price-data[currency]=usd \
        --default-price-data[unit_amount]=19700 \
        2>&1)

    PRICE_ID_SEED=$(echo "$SEED_RESPONSE" | grep -o 'price_[a-zA-Z0-9]*' | head -1)

    if [ -z "$PRICE_ID_SEED" ]; then
        echo -e "${RED}✗ Failed to create Seed product${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Seed product created: $PRICE_ID_SEED${NC}"

    # Create Grove product
    echo "Creating Grove tier product..."
    GROVE_RESPONSE=$(stripe products create \
        --name "Genesis Grove Tier" \
        --description "Professional practice platform" \
        --default-price-data[currency]=usd \
        --default-price-data[unit_amount]=49700 \
        2>&1)

    PRICE_ID_GROVE=$(echo "$GROVE_RESPONSE" | grep -o 'price_[a-zA-Z0-9]*' | head -1)

    if [ -z "$PRICE_ID_GROVE" ]; then
        echo -e "${RED}✗ Failed to create Grove product${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Grove product created: $PRICE_ID_GROVE${NC}"

    # Create Forest product
    echo "Creating Forest tier product..."
    FOREST_RESPONSE=$(stripe products create \
        --name "Genesis Forest Tier" \
        --description "Network sovereignty platform" \
        --default-price-data[currency]=usd \
        --default-price-data[unit_amount]=99700 \
        2>&1)

    PRICE_ID_FOREST=$(echo "$FOREST_RESPONSE" | grep -o 'price_[a-zA-Z0-9]*' | head -1)

    if [ -z "$PRICE_ID_FOREST" ]; then
        echo -e "${RED}✗ Failed to create Forest product${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Forest product created: $PRICE_ID_FOREST${NC}"
    echo ""
fi

# Validate price IDs
if [[ ! $PRICE_ID_SEED == price_* ]] || \
   [[ ! $PRICE_ID_GROVE == price_* ]] || \
   [[ ! $PRICE_ID_FOREST == price_* ]]; then
    echo -e "${RED}✗ Invalid price IDs. Must start with price_${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ All price IDs validated${NC}"
echo ""

echo -e "${YELLOW}Step 4: Configure Webhook${NC}"
echo "============================================================================"
echo ""
echo "For local testing, you can use Stripe CLI to forward webhooks."
echo "For production, you'll need to configure in Stripe Dashboard."
echo ""
echo "Would you like to:"
echo "  1) Set up local webhook forwarding (for testing)"
echo "  2) Configure production webhook (manual)"
echo "  3) Skip for now"
echo ""
echo "Enter choice (1, 2, or 3):"
read -r WEBHOOK_CHOICE

WEBHOOK_SECRET=""

if [ "$WEBHOOK_CHOICE" = "1" ]; then
    if ! command -v stripe &> /dev/null; then
        echo -e "${RED}✗ Stripe CLI required for webhook forwarding${NC}"
        echo "Install with: brew install stripe/stripe-cli/stripe"
        WEBHOOK_SECRET="whsec_local_test_secret"
    else
        echo ""
        echo "Starting webhook forwarding in a new terminal..."
        echo ""
        echo -e "${YELLOW}In another terminal window, run:${NC}"
        echo -e "${BLUE}stripe listen --forward-to localhost:3000/api/genesis/webhook${NC}"
        echo ""
        echo "It will output a webhook signing secret (whsec_...)"
        echo ""
        echo "Enter the webhook signing secret:"
        read -r WEBHOOK_SECRET
    fi
elif [ "$WEBHOOK_CHOICE" = "2" ]; then
    echo ""
    echo "Configure webhook in Stripe Dashboard:"
    echo "1. Go to: ${BLUE}https://dashboard.stripe.com/test/webhooks${NC}"
    echo "2. Click '+ Add endpoint'"
    echo "3. Endpoint URL: https://www.soullab.life/api/genesis/webhook"
    echo "4. Select events:"
    echo "   - checkout.session.completed"
    echo "   - payment_intent.succeeded"
    echo "   - payment_intent.payment_failed"
    echo "5. Click 'Add endpoint'"
    echo "6. Copy the Signing secret (whsec_...)"
    echo ""
    echo "Press Enter when ready..."
    read
    echo ""
    echo "Enter the webhook signing secret (whsec_...):"
    read -r WEBHOOK_SECRET
else
    echo ""
    echo "Skipping webhook configuration."
    echo "You can configure it later in .env.local"
    WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE"
fi

echo ""
echo -e "${YELLOW}Step 5: Updating .env.local${NC}"
echo "============================================================================"
echo ""

# Remove old Stripe keys if they exist
sed -i.bak '/^NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=/d' .env.local
sed -i.bak '/^STRIPE_SECRET_KEY=/d' .env.local
sed -i.bak '/^STRIPE_PRICE_ID_SEED=/d' .env.local
sed -i.bak '/^STRIPE_PRICE_ID_GROVE=/d' .env.local
sed -i.bak '/^STRIPE_PRICE_ID_FOREST=/d' .env.local
sed -i.bak '/^STRIPE_WEBHOOK_SECRET=/d' .env.local

# Add new Stripe configuration
cat >> .env.local << EOF

# Stripe Configuration (Genesis Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$PUBLISHABLE_KEY
STRIPE_SECRET_KEY=$SECRET_KEY
STRIPE_PRICE_ID_SEED=$PRICE_ID_SEED
STRIPE_PRICE_ID_GROVE=$PRICE_ID_GROVE
STRIPE_PRICE_ID_FOREST=$PRICE_ID_FOREST
STRIPE_WEBHOOK_SECRET=$WEBHOOK_SECRET
EOF

rm -f .env.local.bak

echo -e "${GREEN}✓ .env.local updated with Stripe configuration${NC}"
echo ""

echo -e "${BLUE}============================================================================${NC}"
echo -e "${GREEN}✅ Stripe Setup Complete!${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo "Configuration added to .env.local:"
echo "  ✓ Publishable Key: ${PUBLISHABLE_KEY:0:20}..."
echo "  ✓ Secret Key: ${SECRET_KEY:0:20}..."
echo "  ✓ Seed Price ID: $PRICE_ID_SEED"
echo "  ✓ Grove Price ID: $PRICE_ID_GROVE"
echo "  ✓ Forest Price ID: $PRICE_ID_FOREST"
if [ "$WEBHOOK_SECRET" != "whsec_YOUR_WEBHOOK_SECRET_HERE" ]; then
    echo "  ✓ Webhook Secret: ${WEBHOOK_SECRET:0:20}..."
fi
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Restart your dev server: npm run dev"
echo "2. Test checkout: http://localhost:3000/genesis-soullab-life/checkout.html"
echo "3. Use test card: 4242 4242 4242 4242"
echo ""
echo "For detailed testing guide, see: GENESIS-TESTING-GUIDE.md"
echo ""
