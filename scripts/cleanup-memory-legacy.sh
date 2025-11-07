#!/usr/bin/env bash
set -euo pipefail

# Legacy services (adjust if you've renamed paths)
git rm -f \
  lib/services/oracle/MemoryPersistenceService.ts \
  lib/memory/SemanticMemoryService.ts || true

# "UnifiedMemoryInterface*" ghosts and old bridges
git ls-files "lib/**/UnifiedMemoryInterface*.ts" | xargs -I{} git rm -f {} || true
git ls-files "lib/**/unified-memory*.ts"        | xargs -I{} git rm -f {} || true

# Dormant memory stores / adapters (best-guess globs; keeps non-matching silent)
git ls-files "lib/memory/**/store*.ts"     | xargs -I{} git rm -f {} || true
git ls-files "lib/memory/**/bridge*.ts"    | xargs -I{} git rm -f {} || true
git ls-files "lib/memory/**/adapter*.ts"   | xargs -I{} git rm -f {} || true
git ls-files "lib/memory/**/manager*.ts"   | xargs -I{} git rm -f {} || true
git ls-files "lib/agents/modules/*Memory*.ts" | xargs -I{} git rm -f {} || true

echo "✅ Legacy memory files removed (nonexistent files ignored)."
