#!/bin/bash

# Elemental Alchemy - Atticus Preparation Script
# Converts manuscript to Atticus-ready format

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MANUSCRIPT="$SCRIPT_DIR/source/manuscript.md"
OUTPUT_DIR="$SCRIPT_DIR/atticus-import"
OUTPUT_FILE="$OUTPUT_DIR/elemental-alchemy-atticus.docx"

echo "📚 Preparing Elemental Alchemy for Atticus..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if manuscript exists
if [ ! -f "$MANUSCRIPT" ]; then
    echo "❌ Manuscript not found at: $MANUSCRIPT"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR/images"

echo "📝 Converting manuscript to Docx..."

# Convert Markdown to Docx for Atticus
# Atticus prefers Docx import with proper heading styles
pandoc "$MANUSCRIPT" \
    --from=markdown+smart \
    --to=docx \
    --output="$OUTPUT_FILE" \
    --toc \
    --toc-depth=2 \
    --metadata title="Elemental Alchemy: The Ancient Art of Living a Phenomenal Life" \
    --metadata author="Kelly Nezat" \
    --standalone

echo "✅ Docx created: $OUTPUT_FILE"
echo ""

# Copy images if they exist
if [ -d "$SCRIPT_DIR/assets/images" ]; then
    echo "🖼️  Copying images..."
    cp -r "$SCRIPT_DIR/assets/images/"* "$OUTPUT_DIR/images/" 2>/dev/null || echo "No images found yet"
    echo ""
fi

# Create instruction file
cat > "$OUTPUT_DIR/IMPORT-INSTRUCTIONS.txt" << 'EOF'
ATTICUS IMPORT INSTRUCTIONS FOR ELEMENTAL ALCHEMY
═════════════════════════════════════════════════

📥 IMPORT STEPS:

1. Open Atticus (https://www.atticus.io)
   - If you don't have it: Sign up for 14-day free trial

2. Create New Book
   - Click "New Book" button
   - Choose "Import from file"

3. Select Format
   - Book Type: Novel or Nonfiction
   - Import File: elemental-alchemy-atticus.docx
   - Click "Import"

4. Configure Book Settings
   - Title: Elemental Alchemy: The Ancient Art of Living a Phenomenal Life
   - Author: Kelly Nezat
   - Publisher: Soullab Media

5. Choose Book Size
   For SOFTCOVER:
   - Size: 6" x 9" (US Trade)
   - Margins: Standard (or custom 1" inside, 0.75" outside)

   For HARDCOVER:
   - Size: 6.5" x 9.5" (Custom)
   - Margins: Wider (1.125" inside, 0.75" outside)

6. Select Style Template
   - Start with "Minimalist" or "Classic"
   - We'll customize colors next

7. Customize Design (DUNE AESTHETIC)

   TYPOGRAPHY:
   - Body Font: Crimson Text (or Georgia)
   - Heading Font: Lato (or Helvetica)
   - Font Size: 11-12pt
   - Line Spacing: 1.5-1.6
   - Paragraph Spacing: Medium

   COLORS (Custom):
   - Chapter Titles: #d4b896 (Sandy Gold)
   - Section Headers: #10B981 (Emerald)
   - Accent Colors: #0f0c29 (Deep Purple)

   To set custom colors:
   - Click "Design" tab
   - Choose "Custom Colors"
   - Enter hex codes above

   LAYOUT:
   - Chapter starts: Right-hand page
   - Running headers: Minimal (chapter name)
   - Page numbers: Bottom outside corner
   - First paragraph: No indent

8. Add Images

   CHAPTER OPENERS (Priority):
   - Fire chapter (Ch. 5): Fire triangle symbol △
   - Water chapter (Ch. 6): Water triangle ▽
   - Earth chapter (Ch. 7): Earth symbol ▽—
   - Air chapter (Ch. 8): Air symbol △—
   - Aether chapter (Ch. 9): Unity symbol ⊕

   To insert:
   - Navigate to chapter start
   - Click where image should go
   - Click "Insert" → "Image"
   - Browse to images/ folder
   - Select and insert
   - Resize: 2-3 inches tall
   - Alignment: Center

   DIAGRAMS:
   - Place on separate page
   - Full page width (5-5.5 inches)
   - Add caption below if needed

   MARGIN SYMBOLS:
   - Small elemental symbols (0.5-1 inch)
   - Use Atticus "Text Box" feature
   - Position in left margin
   - Link to image file

9. Set Margins for Note-taking

   For HYPNOTIC DESIGN:
   - Left margin: 1.25" (standard) + 0.5" extra = 1.75"
   - This gives readers room for annotations

   To adjust:
   - Design → Page Setup → Custom Margins
   - Inner: 1.75" (left on right-hand pages)
   - Outer: 0.75"

10. Preview Your Book

    - Click "Preview" button
    - Check PRINT preview: pagination, margins, images
    - Check EBOOK preview: flow, images, links
    - Navigate through all chapters

11. Export Files

    FOR EBOOK (EPUB):
    - Click "Export" → "Ebook"
    - Format: EPUB
    - Include: Table of Contents, Images
    - Export

    FOR PRINT (PDF):
    - Click "Export" → "Print"
    - Trim Size: 6" x 9" (softcover)
    - Add Bleed: Yes (0.125")
    - Format: PDF
    - Export

    FOR HARDCOVER:
    - Change trim size to 6.5" x 9.5"
    - Export again

12. Quality Check

    EPUB:
    □ Open in Apple Books or Calibre
    □ Check images display correctly
    □ Test table of contents links
    □ Verify formatting on different devices

    PRINT PDF:
    □ Open in Adobe Acrobat
    □ Check page count (for spine width calculation)
    □ Verify margins and gutters
    □ Confirm images are high-res (not pixelated)
    □ Check running headers and page numbers

13. Order Proof Copies

    - Upload PDFs to KDP Print or IngramSpark
    - Order author proof copies
    - Review physical book carefully
    - Make corrections in Atticus if needed
    - Re-export and upload

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CHECKLIST:

Pre-Import:
□ Manuscript finalized and proofread
□ Images prepared (300 DPI for print)
□ Decided on book trim size
□ Have Atticus account ready

Import & Setup:
□ Imported docx file successfully
□ Set book metadata (title, author)
□ Chose appropriate book size
□ Selected and customized style template

Design:
□ Applied Dune color palette
□ Set custom fonts (Crimson Text, Lato)
□ Adjusted line spacing (1.5-1.6)
□ Customized margins for notes

Images:
□ Inserted chapter opener symbols (5)
□ Added key diagrams (5)
□ Placed margin symbols (optional)
□ Verified all images high-quality

Review:
□ Previewed entire book in print view
□ Previewed in ebook view
□ Checked all chapters and sections
□ Verified table of contents

Export:
□ Exported EPUB for ebook
□ Exported Print PDF (softcover)
□ Exported Print PDF (hardcover)
□ Quality checked all files

Final:
□ Ordered proof copies
□ Made final adjustments
□ Ready to publish!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 PRO TIPS:

1. Save Frequently
   Atticus auto-saves, but manual save doesn't hurt!

2. Use Styles, Not Manual Formatting
   Let Atticus handle formatting via styles - more consistent

3. Test on Multiple Devices
   EPUB looks different on iPad vs Kindle - test both

4. Compare to Professionally Published Books
   Have a favorite book? Match its layout and style

5. Don't Overthink First Version
   Ship v1.0, then refine for v1.1 based on feedback

6. Keep Source Files
   Atticus file (.atticus) is your master
   Also keep original Markdown as backup

7. Image Resolution
   - PRINT: 300 DPI minimum
   - EBOOK: 72-150 DPI is fine (keeps file size down)

8. Bleed for Print
   If images go to edge of page, you need bleed (0.125")

9. Proof Before Approving
   ALWAYS order physical proof - screens lie about print

10. Update Easily
    Found a typo? Fix in Atticus, re-export, done!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 RESOURCES:

Atticus Help:
https://www.atticus.io/help

Atticus YouTube Tutorials:
https://www.youtube.com/@AtticusHQ

Soullab Publishing Docs:
See README.md in publishing/elemental-alchemy/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? Check the Atticus help docs or Soullab support.

Happy publishing! 📚✨

EOF

echo "📄 Instructions created: $OUTPUT_DIR/IMPORT-INSTRUCTIONS.txt"
echo ""

# Create a quick reference card
cat > "$OUTPUT_DIR/QUICK-REFERENCE.txt" << 'EOF'
═══════════════════════════════════════════════
   ELEMENTAL ALCHEMY - ATTICUS QUICK REF
═══════════════════════════════════════════════

BOOK SPECS:
  Title: Elemental Alchemy
  Author: Kelly Nezat
  Publisher: Soullab Media

PRINT SIZES:
  Softcover: 6" x 9"
  Hardcover: 6.5" x 9.5"

MARGINS:
  Inside: 1.75" (extra for notes)
  Outside: 0.75"
  Top: 0.75"
  Bottom: 0.875"

TYPOGRAPHY:
  Body: Crimson Text, 11-12pt
  Headers: Lato
  Line spacing: 1.5-1.6

COLORS (Dune Palette):
  Sandy Gold: #d4b896
  Emerald: #10B981
  Deep Purple: #0f0c29

IMAGES TO INSERT:
  1. Fire symbol (Ch. 5)
  2. Water symbol (Ch. 6)
  3. Earth symbol (Ch. 7)
  4. Air symbol (Ch. 8)
  5. Aether symbol (Ch. 9)
  6. Spiralogic diagram
  7. Torus diagram
  8. Trinity diagram
  9. Correspondences chart
  10. Integration map

EXPORT FORMATS:
  □ EPUB (ebook)
  □ PDF (6x9 softcover)
  □ PDF (6.5x9.5 hardcover)

═══════════════════════════════════════════════
EOF

echo "📋 Quick reference: $OUTPUT_DIR/QUICK-REFERENCE.txt"
echo ""

# Show file sizes
echo "📊 File Information:"
echo "  Manuscript: $(wc -w < "$MANUSCRIPT" | tr -d ' ') words"
echo "  Docx size: $(du -h "$OUTPUT_FILE" | cut -f1)"
if [ -d "$OUTPUT_DIR/images" ]; then
    IMAGE_COUNT=$(find "$OUTPUT_DIR/images" -type f 2>/dev/null | wc -l | tr -d ' ')
    echo "  Images: $IMAGE_COUNT files"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ READY FOR ATTICUS!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📂 Output folder: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "  1. Open Atticus (https://www.atticus.io)"
echo "  2. Create New Book → Import"
echo "  3. Select: $OUTPUT_FILE"
echo "  4. Follow instructions in: IMPORT-INSTRUCTIONS.txt"
echo ""
echo "🎨 Remember to apply Dune aesthetic:"
echo "  • Sandy gold (#d4b896) for chapter titles"
echo "  • Emerald (#10B981) for section headers"
echo "  • Crimson Text font for body"
echo "  • Wide left margins for reader notes"
echo ""
echo "Good luck! The transmission awaits. 🌀✨"
echo ""
