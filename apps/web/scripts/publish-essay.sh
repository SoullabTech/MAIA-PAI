#!/bin/bash

# Soullab Essay Publisher
# Usage: ./scripts/publish-essay.sh path/to/essay.md

set -e

ESSAY_FILE=$1

if [ -z "$ESSAY_FILE" ]; then
  echo "❌ Usage: ./scripts/publish-essay.sh path/to/essay.md"
  exit 1
fi

if [ ! -f "$ESSAY_FILE" ]; then
  echo "❌ File not found: $ESSAY_FILE"
  exit 1
fi

echo "📝 Publishing essay to Soullab..."

# Extract filename without extension
FILENAME=$(basename "$ESSAY_FILE" .md)

# Copy to content directory
cp "$ESSAY_FILE" "content/essays/${FILENAME}.md"

echo "✓ Essay copied to content/essays/${FILENAME}.md"

# Extract frontmatter metadata
TITLE=$(grep "^title:" "$ESSAY_FILE" | sed 's/title: *"\(.*\)"/\1/')
DATE=$(grep "^date:" "$ESSAY_FILE" | sed 's/date: *"\(.*\)"/\1/')

echo "✓ Title: $TITLE"
echo "✓ Date: $DATE"

# Update essays page data
echo "📋 Updating essays index..."

# Here you would update the essays array in app/essays/page.tsx
# For now, we'll just remind the user

cat << EOF

✅ Essay published!

Next steps:
1. Add entry to apps/web/app/essays/page.tsx:

{
  slug: '${FILENAME}',
  title: '${TITLE}',
  subtitle: 'Your Subtitle',
  date: '${DATE}',
  excerpt: 'Your excerpt',
  tags: ['Tag1', 'Tag2'],
  featured: false
}

2. View at: http://localhost:3000/essays/${FILENAME}

3. Deploy: git add, commit, push

EOF
