#!/bin/bash

# Soullab Inside — PDF Export Script
# Exports "When Technology Learns to Listen" to press-ready PDF

set -e

INPUT_FILE="../../app/blog/when-technology-learns-to-listen/page.mdx"
OUTPUT_FILE="Soullab_Inside_When_Technology_Learns_to_Listen_v1.pdf"
CSS_FILE="./pdf-style.css"

echo "📄 Exporting Soullab Inside whitepaper to PDF..."

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "❌ Pandoc is not installed. Install with: brew install pandoc"
    exit 1
fi

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Input file not found: $INPUT_FILE"
    exit 1
fi

# Check if CSS file exists
if [ ! -f "$CSS_FILE" ]; then
    echo "❌ CSS file not found: $CSS_FILE"
    exit 1
fi

# Export to PDF with full design specifications
pandoc "$INPUT_FILE" \
  --from markdown \
  --to pdf \
  --output "$OUTPUT_FILE" \
  --css "$CSS_FILE" \
  --pdf-engine=weasyprint \
  --metadata title="Soullab Inside — When Technology Learns to Listen" \
  --metadata author="Soullab Foundation" \
  --metadata subject="Regenerative Technology, Wisdom Infrastructure" \
  --metadata keywords="Soullab Inside, regenerative technology, wisdom infrastructure, Field Partners" \
  --metadata creator="Soullab Foundation" \
  --metadata date="2025-01-17" \
  --variable papersize=letter \
  --variable geometry:margin=1in \
  --variable fontsize=11pt \
  --variable linestretch=1.5 \
  --toc \
  --toc-depth=2

echo "✅ PDF exported successfully: $OUTPUT_FILE"
echo ""
echo "📊 Specifications:"
echo "   - Size: US Letter (8.5 × 11 in)"
echo "   - Resolution: 300 DPI"
echo "   - Fonts: Spectral (headings), Atkinson Hyperlegible (body)"
echo "   - Palette: Deep Indigo + Warm Gold + Cream"
echo ""
echo "📁 Next steps:"
echo "   1. Review PDF for layout and formatting"
echo "   2. Add to press kit: docs/partners/press-kit/"
echo "   3. Attach to partner invitations"
echo "   4. Print ceremonial copy for first-fire partners"
