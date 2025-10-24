#!/bin/bash

# Genesis Book Studio - Beta Code Generator
# Usage: ./generate-beta-code.sh [TIER] [UNIQUE]
# Example: ./generate-beta-code.sh CREATOR MANIFEST23

TIER=$1
UNIQUE=$2

# Validate inputs
if [ -z "$TIER" ] || [ -z "$UNIQUE" ]; then
  echo "❌ Error: Missing arguments"
  echo ""
  echo "Usage: ./generate-beta-code.sh [TIER] [UNIQUE]"
  echo ""
  echo "Tiers:"
  echo "  FOUNDER  - First 10 beta testers (extra perks)"
  echo "  CREATOR  - General beta testers (40 codes)"
  echo "  PARTNER  - Partner organizations (10 codes)"
  echo ""
  echo "Example:"
  echo "  ./generate-beta-code.sh CREATOR MANIFEST23"
  echo "  Output: GENESIS-BETA-CREATOR-MANIFEST23"
  exit 1
fi

# Validate tier
if [[ ! "$TIER" =~ ^(FOUNDER|CREATOR|PARTNER)$ ]]; then
  echo "❌ Error: Invalid tier '$TIER'"
  echo ""
  echo "Valid tiers: FOUNDER, CREATOR, PARTNER"
  exit 1
fi

# Generate code
CODE="GENESIS-BETA-${TIER}-${UNIQUE}"

# Display
echo ""
echo "✨ Beta Code Generated!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Code: $CODE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Tier: $TIER"
echo ""

# Show tier benefits
case $TIER in
  FOUNDER)
    echo "Benefits:"
    echo "  • Founding member status"
    echo "  • Special badge"
    echo "  • Extra recognition"
    echo "  • All standard beta benefits"
    ;;
  CREATOR)
    echo "Benefits:"
    echo "  • 6 months free access"
    echo "  • 50% lifetime discount"
    echo "  • Priority support"
    echo "  • Community membership"
    ;;
  PARTNER)
    echo "Benefits:"
    echo "  • All CREATOR benefits"
    echo "  • 10 team members (vs 5)"
    echo "  • Co-branding options"
    echo "  • Joint case studies"
    ;;
esac

echo ""
echo "Next Steps:"
echo "  1. Copy code: $CODE"
echo "  2. Update BETA-ACCESS-CODES.md"
echo "  3. Send welcome email to recipient"
echo "  4. Track activation"
echo ""

# Offer to copy to clipboard (macOS)
if command -v pbcopy &> /dev/null; then
  echo -n "$CODE" | pbcopy
  echo "✅ Code copied to clipboard!"
  echo ""
fi

exit 0
