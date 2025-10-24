#!/bin/bash

# Elemental Alchemy EPUB Builder
# Converts Markdown manuscript to professional EPUB format

set -e  # Exit on error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SOURCE_FILE="$SCRIPT_DIR/source/manuscript.md"
OUTPUT_DIR="$SCRIPT_DIR/formats/epub"
METADATA_FILE="$SCRIPT_DIR/metadata.yaml"
OUTPUT_FILE="$OUTPUT_DIR/Elemental-Alchemy.epub"

echo "📚 Building EPUB for Elemental Alchemy..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check prerequisites
if ! command -v pandoc &> /dev/null; then
    echo "❌ Pandoc not found. Install with: brew install pandoc"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Build EPUB
echo "🔄 Converting Markdown → EPUB..."
pandoc "$SOURCE_FILE" \
    --metadata-file="$METADATA_FILE" \
    --from=markdown+smart \
    --to=epub3 \
    --output="$OUTPUT_FILE" \
    --toc \
    --toc-depth=2 \
    --epub-chapter-level=2 \
    --css="$SCRIPT_DIR/assets/epub-styles.css" \
    --standalone \
    --self-contained

echo "✅ EPUB created: $OUTPUT_FILE"
echo ""

# Validate EPUB (if epubcheck is available)
if command -v epubcheck &> /dev/null; then
    echo "🔍 Validating EPUB..."
    epubcheck "$OUTPUT_FILE"
else
    echo "⚠️  epubcheck not found. Skipping validation."
    echo "   Install with: brew install epubcheck"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ EPUB build complete!"
echo ""
echo "📖 Output: $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "  1. Test on multiple devices (iPad, Kindle, Kobo)"
echo "  2. Verify formatting and images"
echo "  3. Add cover image if not already included"
echo "  4. Upload to distribution platforms"
echo ""
