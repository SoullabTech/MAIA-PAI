# Elemental Alchemy Publishing Project

## Book Information
- **Title**: Elemental Alchemy: The Ancient Art of Living a Phenomenal Life
- **Author**: Kelly Nezat
- **Publisher**: Soullab Media
- **Final Manuscript**: November 21, 2024

## Publishing Formats

### 1. EPUB (Ebook)
- Digital distribution via Genesis publishing platform
- Amazon Kindle (KDP)
- Apple Books
- Other major ebook retailers

### 2. Print - Softcover
- Trade paperback (6" x 9" standard)
- Print-on-demand via IngramSpark or KDP Print
- Cream or white paper options
- Matte or glossy cover finish

### 3. Print - Hardcover
- Premium hardcover edition
- Dust jacket design
- Case laminate option
- Standard hardcover size

### 4. Audiobook
- Full narration script
- Chapter markers and timing
- Professional audio production
- Distribution via Audible, Apple Books, etc.

## Directory Structure

```
elemental-alchemy/
├── source/
│   └── manuscript.md          # Final edited manuscript (source of truth)
├── formats/
│   ├── epub/                  # EPUB build files
│   ├── print-softcover/       # Softcover print-ready PDF
│   ├── print-hardcover/       # Hardcover print-ready PDF
│   └── audiobook/             # Audiobook script and assets
└── assets/
    ├── cover/                 # Book cover designs
    ├── images/                # Interior images and graphics
    └── fonts/                 # Typography assets
```

## Build Process

### EPUB Creation
1. Process Markdown → EPUB using Pandoc
2. Add metadata (title, author, ISBN, etc.)
3. Integrate cover image
4. Validate EPUB format
5. Test on multiple devices

### Print PDF Creation
1. Convert Markdown → LaTeX → PDF using Pandoc
2. Apply print specifications:
   - Trim size (6" x 9" for softcover, custom for hardcover)
   - Margins (inside/outside gutters)
   - Bleed settings (0.125" standard)
   - Page numbers, headers, footers
3. Insert cover design
4. Generate ISBN barcode
5. Create print-ready PDF/X-1a format

### Audiobook Script
1. Extract and format chapter-by-chapter
2. Add pronunciation guides for special terms
3. Mark pauses and emphasis
4. Calculate estimated runtime
5. Prepare narrator notes

## Tools Required

- **Pandoc**: Universal document converter
- **LaTeX**: Professional typesetting system
- **Calibre**: EPUB editing and validation
- **Adobe Acrobat**: PDF/X conversion
- **EPUBCheck**: EPUB validation

## Timeline

1. **Week 1**: Format setup and EPUB creation
2. **Week 2**: Print PDF generation and proofing
3. **Week 3**: Cover integration and final review
4. **Week 4**: Audiobook script and production prep
5. **Week 5**: Distribution setup and launch

## Distribution Channels

### Ebook
- Genesis.soullab.life (primary)
- Amazon KDP
- Apple Books
- Google Play Books
- Kobo

### Print
- Soullab Direct
- Amazon (KDP Print)
- IngramSpark (bookstores, libraries)
- Direct wholesale

### Audiobook
- Soullab platform
- Audible/ACX
- Apple Books
- Audiobooks.com

## Royalty Structure

Following the Soullab publishing model:
- **Seed tier**: 91% royalties
- **Grove tier**: 93% royalties + marketing support
- **Forest tier**: 95% royalties + full production support

For Kelly (as founder): 100% revenue retention, reinvested into Soullab Media.

---

*This publishing project embodies the Elemental Alchemy principles: bringing wisdom from the aetheric realm of ideas (manuscript) through fire (creative vision), water (emotional depth), earth (practical structure), and air (communication) into manifest form (published book).*
