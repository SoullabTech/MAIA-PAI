#!/bin/bash

# Elemental Alchemy Print PDF Builder
# Creates print-ready PDFs for softcover and hardcover editions

set -e  # Exit on error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SOURCE_FILE="$SCRIPT_DIR/source/manuscript.md"
METADATA_FILE="$SCRIPT_DIR/metadata.yaml"

# Output directories
SOFTCOVER_DIR="$SCRIPT_DIR/formats/print-softcover"
HARDCOVER_DIR="$SCRIPT_DIR/formats/print-hardcover"

echo "📖 Building Print PDFs for Elemental Alchemy..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check prerequisites
if ! command -v pandoc &> /dev/null; then
    echo "❌ Pandoc not found. Install with: brew install pandoc"
    exit 1
fi

# Create output directories
mkdir -p "$SOFTCOVER_DIR" "$HARDCOVER_DIR"

# ============================================
# SOFTCOVER BUILD (6" x 9" Trade Paperback)
# ============================================

echo "📘 Building Softcover Edition (6\" x 9\")..."

pandoc "$SOURCE_FILE" \
    --metadata-file="$METADATA_FILE" \
    --from=markdown+smart \
    --to=pdf \
    --output="$SOFTCOVER_DIR/Elemental-Alchemy-Softcover-INTERIOR.pdf" \
    --pdf-engine=xelatex \
    --toc \
    --toc-depth=2 \
    --number-sections \
    --variable=geometry:"paperwidth=6in,paperheight=9in,margin=0.75in,inner=1in,outer=0.625in,top=0.75in,bottom=0.875in" \
    --variable=fontsize:11pt \
    --variable=linestretch:1.3 \
    --variable=mainfont:"Crimson Text" \
    --variable=sansfont:"Lato" \
    --variable=monofont:"Courier New" \
    --variable=documentclass:book \
    --variable=classoption:twoside \
    --variable=classoption:openright \
    --include-in-header="$SCRIPT_DIR/assets/print-header.tex" \
    --standalone

echo "✅ Softcover interior PDF created"
echo ""

# ============================================
# HARDCOVER BUILD (Custom size: 6.5" x 9.5")
# ============================================

echo "📕 Building Hardcover Edition (6.5\" x 9.5\")..."

pandoc "$SOURCE_FILE" \
    --metadata-file="$METADATA_FILE" \
    --from=markdown+smart \
    --to=pdf \
    --output="$HARDCOVER_DIR/Elemental-Alchemy-Hardcover-INTERIOR.pdf" \
    --pdf-engine=xelatex \
    --toc \
    --toc-depth=2 \
    --number-sections \
    --variable=geometry:"paperwidth=6.5in,paperheight=9.5in,margin=0.875in,inner=1.125in,outer=0.75in,top=0.875in,bottom=1in" \
    --variable=fontsize:12pt \
    --variable=linestretch:1.4 \
    --variable=mainfont:"Crimson Text" \
    --variable=sansfont:"Lato" \
    --variable=monofont:"Courier New" \
    --variable=documentclass:book \
    --variable=classoption:twoside \
    --variable=classoption:openright \
    --include-in-header="$SCRIPT_DIR/assets/print-header.tex" \
    --standalone

echo "✅ Hardcover interior PDF created"
echo ""

# ============================================
# Generate Print Specifications
# ============================================

cat > "$SOFTCOVER_DIR/PRINT-SPECS.txt" << 'EOF'
ELEMENTAL ALCHEMY - SOFTCOVER PRINT SPECIFICATIONS
══════════════════════════════════════════════════════════

INTERIOR:
---------
• Trim Size: 6" x 9" (US Trade)
• Paper: Cream or White 60# offset
• Binding: Perfect Bound
• Page Count: [TO BE CALCULATED]
• Ink: Black & White (or Black + PMS for elemental symbols)
• Margins:
  - Inner (gutter): 1"
  - Outer: 0.625"
  - Top: 0.75"
  - Bottom: 0.875"

COVER:
------
• Finish: Matte or Gloss Laminate
• Spine Width: [TO BE CALCULATED based on page count]
• Cover Template: Full wraparound with 0.125" bleed
• Spine Calculator: Use printer's spine calculator
• Barcode: ISBN-13 on back cover, lower right

RECOMMENDED PRINTERS:
---------------------
1. IngramSpark (Global Distribution)
   - POD with bookstore returns
   - Wholesale discount: 55%

2. Amazon KDP Print
   - POD for Amazon marketplace
   - Automatic linking with ebook

3. BookBaby (Premium quality)
   - Higher quality paper options
   - Short-run printing

FILE DELIVERY:
--------------
• Interior: PDF/X-1a:2001 or PDF/X-3:2002
• Cover: PDF/X-1a:2001 with bleeds
• Embedded fonts
• CMYK color mode (or Grayscale + spot color)
• 300 DPI minimum resolution

PROOFING:
---------
□ Request physical proof before full print run
□ Check page alignment, margins, gutter
□ Verify cover wrap and spine alignment
□ Confirm ISBN barcode scans correctly
□ Review for any text reflow issues

EOF

cat > "$HARDCOVER_DIR/PRINT-SPECS.txt" << 'EOF'
ELEMENTAL ALCHEMY - HARDCOVER PRINT SPECIFICATIONS
══════════════════════════════════════════════════════════

INTERIOR:
---------
• Trim Size: 6.5" x 9.5" (Premium)
• Paper: White 70# or 80# offset
• Binding: Smyth Sewn (lay-flat) or Case Bound
• Page Count: [TO BE CALCULATED]
• Ink: Black & White + Spot Color (optional)
• Margins:
  - Inner (gutter): 1.125"
  - Outer: 0.75"
  - Top: 0.875"
  - Bottom: 1"

COVER OPTIONS:
--------------

Option A: Dust Jacket
• Jacket: Full-color, gloss or matte finish
• Case: Cloth-covered boards (sandy gold or deep purple)
• Spine: Foil stamping (gold or emerald)

Option B: Case Laminate
• Full-color printed case wrap
• Matte or gloss laminate finish
• No dust jacket

ENDPAPERS:
----------
• Custom printed (optional): Sacred geometry pattern
• Standard: Colored (cream or deep purple)

RECOMMENDED PRINTERS:
---------------------
1. IngramSpark (Hardcover POD)
   - Global distribution
   - Case laminate or jacket options

2. Blurb (Premium short-run)
   - High-quality hardcovers
   - Various binding options

3. BookBaby (Deluxe edition)
   - Custom cloth colors
   - Foil stamping available
   - Ribbon bookmark option

SPECIAL FEATURES (Optional):
-----------------------------
□ Ribbon bookmark (matches sandy gold or emerald)
□ Foil stamping on cover/spine
□ Embossing (sacred geometry symbol)
□ Colored or gilded page edges
□ Head and tail bands (decorative)

FILE DELIVERY:
--------------
• Interior: Same as softcover
• Jacket: Full template with flaps (3-3.5" each)
• Case: If laminate, full wrap template
• All files: PDF/X-1a:2001, embedded fonts, 300 DPI

PROOFING:
---------
□ Request hardcover proof
□ Verify dust jacket fit and alignment
□ Check case stamping (if applicable)
□ Ensure endpapers properly adhered
□ Confirm overall book quality and finish

EOF

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Print PDFs build complete!"
echo ""
echo "📘 Softcover: $SOFTCOVER_DIR/Elemental-Alchemy-Softcover-INTERIOR.pdf"
echo "📕 Hardcover: $HARDCOVER_DIR/Elemental-Alchemy-Hardcover-INTERIOR.pdf"
echo ""
echo "📋 Print specifications saved in each format directory"
echo ""
echo "Next steps:"
echo "  1. Calculate exact page count"
echo "  2. Design cover using printer's template"
echo "  3. Create ISBN barcode"
echo "  4. Convert to PDF/X-1a format"
echo "  5. Order proof copies"
echo ""
