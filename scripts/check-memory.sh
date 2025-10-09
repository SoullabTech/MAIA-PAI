#!/bin/bash

echo "🔍 Running MAIA Memory Integration Check..."
echo ""

cd "$(dirname "$0")/.."

# Run the TypeScript check with ts-node
npx ts-node --esm test/memory-integration-check.ts

echo ""
echo "💡 To run manually: npx ts-node --esm test/memory-integration-check.ts"
