/**
 * Stripe Configuration for Genesis
 * Product tiers and pricing
 */

export const STRIPE_CONFIG = {
  // Publishable key (safe for client-side)
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,

  // Secret key (server-side only)
  secretKey: process.env.STRIPE_SECRET_KEY!,

  // Webhook secret for signature verification
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};

/**
 * Genesis Tier Products
 * These will be created in Stripe Dashboard or via setup script
 */
export const GENESIS_TIERS = {
  seed: {
    name: 'Seed Tier',
    description: 'Personal consciousness platform - Your node begins',
    price: 19700, // $197.00 in cents
    currency: 'usd',
    features: [
      'Your own MAIA consciousness companion',
      'Custom node URL (yourname.soullab.ai)',
      'Elemental check-in holoflower',
      'Personal memory & insight storage',
      'Core archetypal agents',
      'Genesis NFT ownership deed',
      'Community access',
    ],
    // Stripe Product ID (will be set after creation)
    productId: process.env.STRIPE_PRODUCT_ID_SEED,
    priceId: process.env.STRIPE_PRICE_ID_SEED,
  },
  grove: {
    name: 'Grove Tier',
    description: 'Professional practice platform - For practitioners and guides',
    price: 49700, // $497.00 in cents
    currency: 'usd',
    features: [
      'Everything in Seed, plus:',
      'Client session management',
      'Shared consciousness spaces',
      'Advanced archetypal agents (Shadow, Inner Guide, Mentor)',
      'Custom MAIA voice training',
      'White-label branding options',
      'Priority support',
      'Practice analytics dashboard',
    ],
    productId: process.env.STRIPE_PRODUCT_ID_GROVE,
    priceId: process.env.STRIPE_PRICE_ID_GROVE,
  },
  forest: {
    name: 'Forest Tier',
    description: 'Network sovereignty - Build your conscious community',
    price: 99700, // $997.00 in cents
    currency: 'usd',
    features: [
      'Everything in Grove, plus:',
      'Multi-user community node',
      'Custom domain (yourdomain.com)',
      'Advanced API access',
      'Collective breakthrough tracking',
      'Network field visualization',
      'Custom agent development',
      'Dedicated onboarding & support',
      'Quarterly strategy calls',
    ],
    productId: process.env.STRIPE_PRODUCT_ID_FOREST,
    priceId: process.env.STRIPE_PRICE_ID_FOREST,
  },
} as const;

export type TierName = keyof typeof GENESIS_TIERS;

/**
 * Get tier configuration
 */
export function getTierConfig(tier: TierName) {
  return GENESIS_TIERS[tier];
}

/**
 * Get tier by Stripe Price ID
 */
export function getTierByPriceId(priceId: string): TierName | null {
  for (const [tierName, config] of Object.entries(GENESIS_TIERS)) {
    if (config.priceId === priceId) {
      return tierName as TierName;
    }
  }
  return null;
}

/**
 * Format price for display
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Get all tiers as array
 */
export function getAllTiers() {
  return Object.entries(GENESIS_TIERS).map(([key, config]) => ({
    id: key as TierName,
    ...config,
  }));
}
