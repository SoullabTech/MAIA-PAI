# 🚀 Quick Start Guide
## Publishing Elemental Alchemy in All Formats

This is your fast-track guide to publishing Elemental Alchemy as an ebook, print book, and audiobook.

---

## ⚡ 5-Minute Setup

### 1. Install Required Tools

```bash
# macOS (using Homebrew)
brew install pandoc
brew install --cask mactex  # or basictex for smaller install

# Verify installation
pandoc --version
xelatex --version
```

For other platforms, see [INSTALLATION.md](INSTALLATION.md)

### 2. Add Your Book Cover

```bash
# Copy your cover image to the assets folder
cp /path/to/your-cover.jpg assets/cover/elemental-alchemy-cover.jpg
```

Cover specs: 1600x2400px, JPEG, RGB for EPUB. See [COVER-INTEGRATION.md](COVER-INTEGRATION.md) for print specs.

### 3. Build All Formats

```bash
# Navigate to publishing directory
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/elemental-alchemy

# Run master build script
./build-all.sh 5
```

That's it! Your files will be in the `formats/` directory.

---

## 📦 What Gets Built

After running the build script, you'll have:

```
formats/
├── epub/
│   └── Elemental-Alchemy.epub
├── print-softcover/
│   ├── Elemental-Alchemy-Softcover-INTERIOR.pdf
│   └── PRINT-SPECS.txt
├── print-hardcover/
│   ├── Elemental-Alchemy-Hardcover-INTERIOR.pdf
│   └── PRINT-SPECS.txt
└── audiobook/
    ├── narrator-script.md
    ├── pronunciation-guide.md
    └── timing-estimate.txt
```

---

## 🎯 Individual Builds

Build only what you need:

```bash
# EPUB only
./build-epub.sh

# Print PDFs only
./build-print.sh

# Audiobook script only
./build-audiobook.sh
```

---

## 📤 Distribution Checklist

### EPUB (Ebook)

**Where to publish:**
- ✅ Genesis.soullab.life (primary - 95% royalty!)
- ✅ Amazon KDP
- ✅ Apple Books
- ✅ Google Play Books
- ✅ Kobo
- ✅ Draft2Digital (distributes to many retailers)

**Steps:**
1. ✓ Build EPUB: `./build-epub.sh`
2. Test on devices (iPad, Kindle app, Kobo app)
3. Obtain ISBN (or use free Amazon ASIN)
4. Upload to each platform
5. Set price and metadata
6. Publish!

**Genesis Platform** (recommended first):
- Upload EPUB at https://genesis.soullab.life/publish
- Set your price
- Keep 95% royalties
- Automatic distribution to Soullab community

### Print - Softcover

**Where to print:**
- ✅ IngramSpark (global distribution, bookstores)
- ✅ Amazon KDP Print
- ✅ Lulu (POD option)

**Steps:**
1. ✓ Build interior PDF: `./build-print.sh`
2. Design cover using printer's template (see `PRINT-SPECS.txt`)
3. Obtain ISBN (required for IngramSpark)
4. Upload interior + cover PDF
5. Order proof copy
6. Review proof, make corrections if needed
7. Approve for distribution

**Recommended:** Start with IngramSpark for widest distribution.

### Print - Hardcover

Same as softcover, but:
- Use hardcover PDF from `formats/print-hardcover/`
- Consider dust jacket vs. case laminate
- Higher print cost, higher retail price

### Audiobook

**Options:**

**Option 1: Professional Narration**
- Hire narrator via ACX, Findaway Voices, or direct
- Cost: $100-400 per finished hour
- Quality: Highest
- Time: 2-6 weeks

**Option 2: AI Narration (Soullab Recommended)**
- Use ElevenLabs to clone Kelly's voice
- Cost: ~$22/hour of audio
- Quality: Very high (modern AI)
- Time: 1-3 days
- Edit: Have human editor review for emotion/pacing

**Option 3: Self-Narrate**
- Record yourself using provided script
- Cost: Equipment only ($100-500 for decent setup)
- Quality: Variable
- Time: 2-4 weeks

**Distribution:**
1. Produce audio files (MP3 or FLAC, see timing-estimate.txt)
2. Submit to ACX for Audible distribution
3. Upload to Findaway Voices for wide distribution
4. Add to Genesis platform for direct sales

---

## 💰 Pricing Guide

### EPUB Pricing

**Market rates:**
- $0.99 - $2.99: Budget/promotional
- $3.99 - $6.99: Standard non-fiction
- $7.99 - $9.99: Premium non-fiction
- $9.99+: Specialized/professional

**Recommended:** $7.99 - $9.99 for Elemental Alchemy

**Platform royalties:**
- Genesis: 95% (You keep $7.59 of $7.99)
- Amazon: 70% at $2.99-9.99 (You keep $5.60 of $7.99)
- Others: ~60-70%

### Print Pricing

Calculate based on:
- Print cost (from printer calculator)
- Retail markup (40-55% for bookstores)
- Your profit margin

**Example:**
- Print cost: $5.50
- Retail price: $19.99
- Distribution (55%): -$11.00
- Platform fee: -$1.00
- Your profit: $2.49 per book

**Recommended:**
- Softcover: $18.99 - $24.99
- Hardcover: $27.99 - $34.99

### Audiobook Pricing

**Audible pricing:**
- Set by Audible based on length
- ~9-10 hour book = $20-25 price point
- You earn: 25-40% royalty

**Direct sales (Genesis):**
- Price competitively: $15.99 - $24.99
- You keep: 95%

---

## ⚙️ Pro Tips

### Before Publishing

- [ ] Proofread manuscript one final time
- [ ] Get beta readers for feedback
- [ ] Have professional editor review (if budget allows)
- [ ] Get ISBN numbers (buy in bulk to save money)
- [ ] Register copyright (optional but recommended)
- [ ] Set up author website/social media

### Marketing

- [ ] Build email list before launch
- [ ] Create launch team (ARC readers)
- [ ] Plan social media campaign
- [ ] Reach out to podcast hosts
- [ ] Write guest blog posts
- [ ] Use Genesis platform's built-in community
- [ ] Offer launch discount for first week

### Legal

- [ ] Copyright notice in front matter
- [ ] Disclaimer (if giving advice)
- [ ] ISBN properly displayed
- [ ] Author/publisher info correct
- [ ] Website/contact info included

---

## 🆘 Troubleshooting

### Build Failed?

1. Check you have all required tools: `./build-all.sh`
2. Read error messages carefully
3. See [INSTALLATION.md](INSTALLATION.md) for tool setup
4. Check [README.md](README.md) for detailed docs

### EPUB Not Displaying Correctly?

- Test in multiple readers (Apple Books, Calibre, Adobe Digital Editions)
- Run EPUBCheck: `epubcheck formats/epub/Elemental-Alchemy.epub`
- Check image sizes and formats
- Verify metadata.yaml is correct

### Print PDF Issues?

- Make sure LaTeX is fully installed
- Check fonts are installed system-wide
- Review build log for specific errors
- Try building again (sometimes temporary issues)

### Need Help?

- Check documentation in this directory
- Printer support (IngramSpark, KDP)
- Soullab support for Genesis members
- Pandoc documentation: https://pandoc.org/MANUAL.html

---

## 🎉 Launch Checklist

Ready to publish? Make sure you've:

- [ ] Built and tested all formats
- [ ] Designed and integrated cover
- [ ] Obtained ISBN(s)
- [ ] Written book description and author bio
- [ ] Set pricing for all formats
- [ ] Created author accounts on platforms
- [ ] Prepared marketing materials
- [ ] Set launch date
- [ ] Notified email list/social followers
- [ ] Uploaded to Genesis platform FIRST
- [ ] Submitted to other platforms

---

## 📈 Post-Launch

After publishing:

1. **Monitor sales** across platforms
2. **Gather reviews** (ask readers, send to reviewers)
3. **Track marketing** effectiveness
4. **Adjust pricing** if needed
5. **Create promotions** (discounts, bundles)
6. **Plan next book** (momentum is key!)

---

## 🌟 Genesis Platform Advantages

Why publish on Genesis first:

✅ **95% royalties** vs. 25-70% elsewhere
✅ **Built-in community** of conscious creators
✅ **Direct relationship** with readers
✅ **No platform fees** (just payment processing)
✅ **Bundling options** (book + courses + memberships)
✅ **Full control** over pricing and promotion
✅ **Analytics** on reader engagement
✅ **Integration** with MAIA oracle for personalized recommendations

**Launch strategy:**
1. Publish on Genesis.soullab.life first
2. Build momentum and reviews
3. Expand to Amazon, etc. 2-4 weeks later
4. Use Genesis as your primary platform long-term

---

## 📚 Additional Resources

- [README.md](README.md) - Complete publishing guide
- [INSTALLATION.md](INSTALLATION.md) - Tool setup instructions
- [COVER-INTEGRATION.md](COVER-INTEGRATION.md) - Cover design guide
- `PRINT-SPECS.txt` files - Printer specifications
- `timing-estimate.txt` - Audiobook production info

---

## 🔥 Ready to Launch?

```bash
# Final build
./build-all.sh 5

# Review output
ls -la formats/*/

# Upload to Genesis
open https://genesis.soullab.life/publish

# Let the wisdom flow! ✨
```

---

*The spice flows for those who can taste it. Now share your transmission with the world.* 🌀🜛✨
