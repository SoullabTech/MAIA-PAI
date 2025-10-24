# Cover Integration Guide
## Adding Book Cover to All Formats

This guide explains how to integrate the Elemental Alchemy book cover into EPUB, Print PDF, and promotional materials.

---

## 📁 File Preparation

### Cover File Requirements

**For EPUB:**
- Format: JPEG or PNG
- Dimensions: 1600 x 2400 pixels (2:3 ratio) recommended
- Resolution: 72-96 DPI (screen resolution)
- File size: < 2 MB
- Color mode: RGB
- Filename: `elemental-alchemy-cover.jpg`

**For Print (Softcover 6" x 9"):**
- Format: High-res PDF or TIFF
- Dimensions: Full wraparound template
  - Front cover: 6" x 9"
  - Spine: Width varies by page count (use calculator)
  - Back cover: 6" x 9"
  - Bleed: Add 0.125" on all exterior edges
- Resolution: 300 DPI minimum
- Color mode: CMYK (for print)
- File format: PDF/X-1a:2001

**For Print (Hardcover 6.5" x 9.5"):**
- Same requirements as softcover
- Adjust dimensions for 6.5" x 9.5"
- Optional: Separate dust jacket design

---

## 📥 Adding Cover Files

### 1. Place Cover Image

```bash
# Navigate to publishing directory
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/elemental-alchemy

# Copy your cover file
cp /path/to/your/book-cover.jpg assets/cover/elemental-alchemy-cover.jpg

# For print versions (high-res)
cp /path/to/your/print-cover.pdf assets/cover/print-cover-softcover.pdf
cp /path/to/your/print-cover-hardcover.pdf assets/cover/print-cover-hardcover.pdf
```

### 2. Verify Image Specifications

```bash
# Check image dimensions and DPI
file assets/cover/elemental-alchemy-cover.jpg
identify assets/cover/elemental-alchemy-cover.jpg  # Requires ImageMagick

# Should show:
# - JPEG format
# - 1600x2400 or similar 2:3 ratio
# - RGB color
```

---

## 📱 EPUB Cover Integration

The cover is automatically included when building EPUB if the file exists at:
```
assets/cover/elemental-alchemy-cover.jpg
```

The `metadata.yaml` file references this path:
```yaml
cover-image: assets/cover/elemental-alchemy-cover.jpg
```

To manually verify:

1. Build EPUB:
   ```bash
   ./build-epub.sh
   ```

2. Check cover in ebook reader (Calibre, Apple Books, etc.)

3. Validate EPUB:
   ```bash
   epubcheck formats/epub/Elemental-Alchemy.epub
   ```

---

## 📖 Print Cover Integration

### Understanding Print Cover Templates

Print covers are more complex because they wrap around the book:

```
┌─────────────┬────┬─────────────┐
│             │    │             │
│  BACK       │ S  │   FRONT     │
│  COVER      │ P  │   COVER     │
│             │ I  │             │
│             │ N  │             │
│             │ E  │             │
└─────────────┴────┴─────────────┘
   6" x 9"    var    6" x 9"
```

With 0.125" bleed on outer edges.

### Calculate Spine Width

Spine width depends on:
- Page count (interior pages)
- Paper thickness
- Binding type

**Use printer's spine calculator:**
- IngramSpark: https://www.ingramspark.com/plan-your-book/book-setup-calculator
- KDP: https://kdp.amazon.com/en_US/cover-calculator

Example calculation:
```
Pages: 300
Paper: Cream 60# offset
Binding: Perfect bound
Spine width: ~0.65"
```

### Create Print Cover

You can design in:
1. **Adobe InDesign** (professional)
2. **Canva** (user-friendly, has book cover templates)
3. **Affinity Publisher** (affordable alternative)

#### Template Dimensions (6" x 9" Softcover)

Assuming 300 pages (0.65" spine):

```
Total width:  6" + 0.65" + 6" + 0.25" bleed = 12.9"
Total height: 9" + 0.25" bleed = 9.25"
```

**Safe zones:**
- Keep text/important elements 0.25" from trim lines
- Barcode area on back cover (lower right): 2" x 1.5"

#### Exporting for Print

Export settings:
- Format: PDF
- Standard: PDF/X-1a:2001
- Color: CMYK
- Resolution: 300 DPI
- Fonts: Embedded
- Crop marks: Include
- Bleed: 0.125"

### Submit to Printer

1. Upload interior PDF
2. Upload cover PDF
3. Select paper type, finish
4. Request proof copy
5. Review proof before approving full run

---

## 🎨 Design Recommendations

### Elemental Alchemy Cover Elements

Based on the Dune desert aesthetic and book themes:

**Color Palette:**
- Sandy gold: #d4b896
- Emerald green: #10B981
- Deep purple: #0f0c29
- Light gold: #E3B778

**Visual Elements:**
- Sacred geometry (dodecahedron, spirals, torus)
- Elemental symbols (fire, water, earth, air, aether)
- Desert/cosmic atmosphere
- Author photo (optional, back cover)

**Typography:**
- Title: Large, bold, san-serif (Lato)
- Subtitle: Elegant serif (Crimson Text)
- Author name: Clear, legible
- Back cover text: Readable at small size

**Front Cover:**
```
┌─────────────────────┐
│                     │
│   ELEMENTAL         │
│     ALCHEMY         │
│                     │
│   [Sacred Geometry] │
│                     │
│  The Ancient Art of │
│  Living a           │
│  Phenomenal Life    │
│                     │
│   Kelly Nezat       │
│                     │
└─────────────────────┘
```

**Back Cover:**
- Book description (150-250 words)
- Author bio (50-100 words)
- Blurbs/testimonials (optional)
- Soullab Media logo
- ISBN barcode (bottom right)
- Price (if applicable)

**Spine:**
- Title (horizontal, readable when upright)
- Author name
- Publisher logo/name

---

## 🖼️ Promotional Graphics

Create additional sizes for marketing:

### Social Media
```bash
# Square (Instagram, Facebook)
1080 x 1080 px

# Story/Reel (Instagram, TikTok)
1080 x 1920 px (9:16)

# Twitter/X
1200 x 628 px

# Pinterest
1000 x 1500 px (2:3)
```

### Website/Genesis Platform
```bash
# Product page featured image
1200 x 1800 px (2:3)

# Thumbnail
400 x 600 px

# Hero banner
1920 x 1080 px (16:9)
```

Save these in: `assets/cover/promotional/`

---

## ✅ Cover Checklist

Before submitting for publishing:

**General:**
- [ ] Cover design approved by author
- [ ] All text is spell-checked
- [ ] ISBN is correct
- [ ] Price is correct (if shown)
- [ ] Author name spelled correctly
- [ ] Title matches official title exactly

**EPUB:**
- [ ] Cover image is 1600x2400 px minimum
- [ ] File size under 2 MB
- [ ] RGB color mode
- [ ] Appears correctly in ebook readers

**Print:**
- [ ] Spine width calculated correctly
- [ ] Cover template matches trim size
- [ ] 0.125" bleed on all exterior edges
- [ ] Important elements in safe zone
- [ ] CMYK color mode
- [ ] 300 DPI resolution
- [ ] Fonts embedded
- [ ] PDF/X-1a format
- [ ] Barcode scans correctly
- [ ] Proof copy ordered and approved

**Files Organized:**
- [ ] EPUB cover in `assets/cover/`
- [ ] Print covers in `assets/cover/`
- [ ] Promotional graphics in `assets/cover/promotional/`
- [ ] Source files backed up

---

## 🔄 Updating Cover

If you need to change the cover after initial upload:

```bash
# Replace cover file
cp new-cover.jpg assets/cover/elemental-alchemy-cover.jpg

# Rebuild affected formats
./build-epub.sh          # EPUB
./build-print.sh         # Print PDFs

# Resubmit to platforms
# Amazon KDP, IngramSpark, etc.
```

**Note:** Changing cover after publication may affect:
- ISBN assignment (new edition may need new ISBN)
- Catalog listings
- Customer confusion (announce the update)

---

## 🎯 Professional Services

If you need help with cover design:

### DIY Tools
- **Canva**: Book cover templates, easy to use
- **BookBrush**: Mockups and promotional graphics
- **Vellum**: Mac app for interior + cover

### Professional Designers
- **99designs**: Contest or direct hire
- **Reedsy**: Vetted book designers
- **Fiverr**: Budget-friendly options

### Soullab Services
For Genesis publishing members:
- **Seed tier**: Cover template assistance
- **Grove tier**: Custom cover design included
- **Forest tier**: Full design suite + variations

---

## 📞 Support

Questions about cover integration?

1. Check printer's cover template guidelines
2. Review this document
3. Contact Soullab support for Genesis members
4. Consult your chosen printer's help center

---

*The cover is the portal to your wisdom. Design it with intention.* ✨

---

## Appendix: Quick Reference

### File Naming Convention
```
elemental-alchemy-cover.jpg           # EPUB version
print-cover-softcover.pdf             # Softcover print
print-cover-hardcover.pdf             # Hardcover print
elemental-alchemy-3d-mockup.png       # Promotional
elemental-alchemy-social-square.jpg   # Social media
```

### Color Conversion (RGB → CMYK)

When converting for print:
```
RGB #d4b896 (Sandy Gold)    → CMYK: C:0 M:15 Y:30 K:17
RGB #10B981 (Emerald)       → CMYK: C:71 M:0 Y:62 K:0
RGB #0f0c29 (Deep Purple)   → CMYK: C:84 M:87 Y:35 K:40
```

*(Use professional color management for accurate conversion)*
