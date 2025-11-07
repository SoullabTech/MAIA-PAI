#!/bin/bash
# Git hook to prompt codex updates on significant changes
# Install: ln -s ../../scripts/update-codex-hook.sh .git/hooks/pre-commit

# Check if significant files changed
CHANGED_FILES=$(git diff --cached --name-only)

SIGNIFICANT_PATTERNS=(
  "migrations/"
  "lib/consciousness/"
  "app/api/"
  "scripts/ingest"
  "supabase/"
)

NEEDS_UPDATE=false
for pattern in "${SIGNIFICANT_PATTERNS[@]}"; do
  if echo "$CHANGED_FILES" | grep -q "$pattern"; then
    NEEDS_UPDATE=true
    break
  fi
done

if [ "$NEEDS_UPDATE" = true ]; then
  echo ""
  echo "🌙 Significant changes detected in:"
  echo "$CHANGED_FILES" | grep -E "migrations/|lib/consciousness/|app/api/|scripts/|supabase/"
  echo ""
  echo "Consider updating CC-REVIVAL-CODEX.md to document:"
  echo "  - What was built/wired"
  echo "  - What patterns were learned"
  echo "  - What needs to happen next"
  echo ""
  echo "Update codex now? (y/n/skip-all)"
  read -r response

  if [[ "$response" =~ ^[Yy]$ ]]; then
    ${EDITOR:-code} CC-REVIVAL-CODEX.md
    git add CC-REVIVAL-CODEX.md
    echo "✅ Codex updated and staged"
  elif [[ "$response" =~ ^[Ss]kip ]]; then
    git config codex.skip-reminders true
    echo "⏭️  Codex reminders disabled (re-enable: git config --unset codex.skip-reminders)"
  fi
fi

exit 0
