#!/bin/bash

# DEVELOPMENTAL INSIGHTS VERIFICATION SCRIPT
# Quick check that everything is integrated and working

echo "🧬 MAIA DEVELOPMENTAL INSIGHTS - VERIFICATION"
echo "=============================================="
echo ""

# Load environment
source .env.local 2>/dev/null

# Check 1: Database Tables
echo "✓ Checking database tables..."
TABLES=("shift_events" "dissociation_incidents" "attending_observations" "developmental_learning" "observer_reflections")
ALL_GOOD=true

for table in "${TABLES[@]}"; do
  STATUS=$(curl -s -w "%{http_code}" -o /dev/null \
    -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/$table?limit=0")

  if [ "$STATUS" = "200" ]; then
    echo "  ✅ $table"
  else
    echo "  ❌ $table (HTTP $STATUS)"
    ALL_GOOD=false
  fi
done

echo ""

# Check 2: Service Files
echo "✓ Checking service files..."
SERVICES=(
  "lib/services/ShiftPatternService.ts"
  "lib/services/DissociationDetector.ts"
  "lib/services/AttendingQualityTracker.ts"
  "lib/services/MetaLearningService.ts"
  "lib/developmental-insights.ts"
  "components/providers/DevelopmentalInsightsProvider.tsx"
)

for service in "${SERVICES[@]}"; do
  if [ -f "$service" ]; then
    echo "  ✅ $service"
  else
    echo "  ❌ $service (missing)"
    ALL_GOOD=false
  fi
done

echo ""

# Check 3: Integration in Layout
echo "✓ Checking app layout integration..."
if grep -q "DevelopmentalInsightsProvider" app/layout.tsx; then
  echo "  ✅ DevelopmentalInsightsProvider in app/layout.tsx"
else
  echo "  ❌ DevelopmentalInsightsProvider not found in app/layout.tsx"
  ALL_GOOD=false
fi

echo ""

# Check 4: MaiaOrchestrator Integration
echo "✓ Checking MaiaOrchestrator integration..."
if grep -q "processInteractionInsights" lib/services/MaiaOrchestrator.ts; then
  echo "  ✅ processInteractionInsights in MaiaOrchestrator"
else
  echo "  ❌ processInteractionInsights not found in MaiaOrchestrator"
  ALL_GOOD=false
fi

echo ""

# Check 5: Recent Data
echo "✓ Checking for recorded data..."

ATTENDING_COUNT=$(curl -s \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/attending_observations?select=count" | \
  python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data))" 2>/dev/null || echo "0")

DISSOCIATION_COUNT=$(curl -s \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/dissociation_incidents?select=count" | \
  python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data))" 2>/dev/null || echo "0")

SHIFT_COUNT=$(curl -s \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/shift_events?select=count" | \
  python3 -c "import sys, json; data = json.load(sys.stdin); print(len(data))" 2>/dev/null || echo "0")

echo "  📊 Attending observations: $ATTENDING_COUNT"
echo "  ⚠️  Dissociation incidents: $DISSOCIATION_COUNT"
echo "  🌊 Shift events: $SHIFT_COUNT"

echo ""
echo "=============================================="

if [ "$ALL_GOOD" = true ]; then
  echo "✅ ALL CHECKS PASSED"
  echo ""
  echo "🧬 Developmental insights system is OPERATIONAL"
  echo ""
  echo "Next steps:"
  echo "1. Start dev server: npm run dev"
  echo "2. Make interactions via /api/maya-v2"
  echo "3. Watch data accumulate in Supabase"
  echo "4. View data: https://supabase.com/dashboard/project/jkbetmadzcpoinjogkli/editor"
else
  echo "⚠️  SOME CHECKS FAILED"
  echo ""
  echo "Review errors above and fix issues."
fi

echo ""
