#!/bin/bash

# Script to update all /maya redirects to /maia (dreamweaver-enhanced experience)
# Kelly's vision: MAIA should be THE main experience

echo "🔄 Updating all routes from /maya to /maia..."

# Update all router.push('/maya') to router.push('/maia')
FILES=(
  "app/maya/training/page.tsx"
  "app/intro/page.tsx"
  "app/auth/verify/page.tsx"
  "app/complete-signup/page.tsx"
  "app/debug-auth/page.tsx"
  "app/meeting/page.tsx"
  "app/lab-notes/[sessionId]/page.tsx"
  "app/lab-notes/page.tsx"
  "app/login/page.tsx"
  "app/onboarding/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    sed -i '' "s/router.push('\/maya')/router.push('\/maia')/g" "$file"
    sed -i '' "s/window.location.href = '\/maya'/window.location.href = '\/maia'/g" "$file"
  fi
done

echo "✅ All routes updated to use MAIA!"
echo ""
echo "Summary of changes:"
echo "- Onboarding → MAIA"
echo "- Login/Signup → MAIA"
echo "- Check-in → MAIA"
echo "- Intro → MAIA"
echo "- All auth flows → MAIA"
echo ""
echo "MAIA is now the primary dreamweaver-enhanced experience!"