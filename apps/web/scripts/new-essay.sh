#!/bin/bash

# Create a new essay from markdown file
# Usage: ./scripts/new-essay.sh path/to/essay.md

set -e

ESSAY_FILE=$1

if [ -z "$ESSAY_FILE" ]; then
  echo "📝 Soullab Essay Publisher"
  echo ""
  echo "Usage: ./scripts/new-essay.sh path/to/essay.md"
  echo ""
  echo "Example:"
  echo "  ./scripts/new-essay.sh ~/Documents/my-essay.md"
  echo ""
  exit 1
fi

if [ ! -f "$ESSAY_FILE" ]; then
  echo "❌ File not found: $ESSAY_FILE"
  exit 1
fi

echo "📝 Publishing essay to Soullab..."
echo ""

# Extract filename
FILENAME=$(basename "$ESSAY_FILE" .md)
SLUG=$(echo "$FILENAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

# Copy to content directory
mkdir -p content/essays
cp "$ESSAY_FILE" "content/essays/${SLUG}.md"

echo "✓ Essay saved: content/essays/${SLUG}.md"

# Try to extract metadata from frontmatter
TITLE=$(grep -m 1 "^title:" "$ESSAY_FILE" | sed 's/title: *"\?\(.*\)"\?/\1/' | tr -d '"')
SUBTITLE=$(grep -m 1 "^subtitle:" "$ESSAY_FILE" | sed 's/subtitle: *"\?\(.*\)"\?/\1/' | tr -d '"')
DATE=$(grep -m 1 "^date:" "$ESSAY_FILE" | sed 's/date: *"\?\(.*\)"\?/\1/' | tr -d '"')
AUTHOR=$(grep -m 1 "^author:" "$ESSAY_FILE" | sed 's/author: *"\?\(.*\)"\?/\1/' | tr -d '"')
EXCERPT=$(grep -m 1 "^excerpt:" "$ESSAY_FILE" | sed 's/excerpt: *"\?\(.*\)"\?/\1/' | tr -d '"')
TAGS=$(grep -m 1 "^tags:" "$ESSAY_FILE" | sed 's/tags: *\[\(.*\)\]/\1/' | tr -d '"')

# Defaults
TITLE=${TITLE:-"Untitled Essay"}
DATE=${DATE:-$(date +%Y-%m-%d)}
AUTHOR=${AUTHOR:-"Soullab Collective"}
EXCERPT=${EXCERPT:-""}

echo "✓ Metadata extracted"
echo "  Title: $TITLE"
echo "  Date: $DATE"
echo "  Slug: $SLUG"
echo ""

# Add to index.json
INDEX_FILE="content/essays/index.json"

# Create temp entry
NEW_ENTRY=$(cat <<EOF
  {
    "slug": "$SLUG",
    "title": "$TITLE",
    "subtitle": "$SUBTITLE",
    "date": "$DATE",
    "author": "$AUTHOR",
    "excerpt": "$EXCERPT",
    "tags": [$TAGS],
    "featured": false
  }
EOF
)

# Read current index, add new entry
if [ -f "$INDEX_FILE" ]; then
  # Add to existing array (before closing bracket)
  sed -i '' '$d' "$INDEX_FILE"  # Remove last ]
  echo "," >> "$INDEX_FILE"
  echo "$NEW_ENTRY" >> "$INDEX_FILE"
  echo "]" >> "$INDEX_FILE"
  echo "✓ Added to essays index"
else
  # Create new index
  echo "[" > "$INDEX_FILE"
  echo "$NEW_ENTRY" >> "$INDEX_FILE"
  echo "]" >> "$INDEX_FILE"
  echo "✓ Created essays index"
fi

echo ""
echo "✅ Essay published!"
echo ""
echo "View at: http://localhost:3000/essays/$SLUG"
echo ""
echo "To deploy:"
echo "  git add ."
echo "  git commit -m \"Add essay: $TITLE\""
echo "  git push"
echo ""
