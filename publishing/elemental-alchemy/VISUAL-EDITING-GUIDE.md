# Visual Book Editing Environment
## Atticus Integration + Custom Editor for Elemental Alchemy

**Goal**: Create a WYSIWYG environment where you can visually design the book, place images, adjust layouts, and see exactly how it will look in print and ebook formats.

---

## 🎨 Option 1: Atticus (Recommended for Speed)

### What is Atticus?

**Atticus** (https://www.atticus.io) is a professional book formatting tool that:
- ✅ Visual drag-and-drop editor
- ✅ Creates EPUB, Print PDF, and mobi from one source
- ✅ Handles images, formatting, typography
- ✅ Professional templates
- ✅ Live preview of print and ebook
- ✅ One-time purchase (~$147) or subscription ($10/month)

**Perfect for**: Getting Elemental Alchemy publication-ready quickly with professional visual control.

---

## 📥 Atticus Workflow

### Step 1: Prepare Manuscript for Atticus

I'll create an Atticus-ready version of your manuscript:

```bash
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/elemental-alchemy
./prepare-for-atticus.sh
```

**This script will**:
1. Convert your Markdown to Atticus-compatible format
2. Organize images into proper structure
3. Create import file with proper chapter breaks
4. Add image placeholders where you want them

### Step 2: Import into Atticus

1. **Open Atticus** → Create New Book
2. **Import** → Choose Docx or Markdown file
3. **Select Book Size**:
   - Print: 6" x 9" (trade paperback)
   - Or: 6.5" x 9.5" (hardcover)
4. **Choose Style Template**:
   - Start with "Minimalist" or "Classic"
   - We'll customize with Dune colors

### Step 3: Visual Customization

**Typography**:
- Body font: Crimson Text (or Georgia if not available)
- Heading font: Lato (or Helvetica)
- Font size: 11-12pt
- Line spacing: 1.5-1.6

**Colors** (Dune Palette):
- Chapter titles: #d4b896 (sandy gold)
- Section headers: #10B981 (emerald)
- Accents: #0f0c29 (deep purple)

**Layout**:
- Left margin: 3cm (for notes)
- Running headers: Minimal
- Page numbers: Bottom outside corner
- Chapter starts: New right-hand page

### Step 4: Place Images

**In Atticus Editor**:
1. Click where image should go
2. Insert → Image
3. Upload from assets/images/
4. Adjust size and alignment
5. Add caption if needed

**Chapter Openers**:
- Large elemental symbol (2-3 inches)
- Centered above chapter title

**Diagrams**:
- Full page width
- On separate page from text

**Margin Symbols**:
- Small (0.5-1 inch)
- Placed in left margin using absolute positioning

### Step 5: Generate Files

**Export from Atticus**:
1. EPUB for ebook distribution
2. Print PDF for softcover (6x9)
3. Print PDF for hardcover (6.5x9.5)
4. Kindle MOBI (if needed)

**Automatically**:
- Proper margins and gutters
- Bleeds for print
- Hyperlinked table of contents
- Professional formatting

---

## 🛠️ Option 2: Custom Web-Based Editor

If you want something more integrated with your existing system, I can build a custom visual editor.

### Features

**Visual Canvas**:
- Drag-and-drop page layout
- Live preview of print and ebook
- WYSIWYG formatting
- Image placement and sizing

**Integrated with Genesis**:
- Saves directly to your publishing system
- Auto-generates QR codes
- Links to platform content
- Syncs with MAIA

**Markdown + Visual**:
- Edit in Markdown (for version control)
- OR edit visually (for design work)
- Changes sync both ways

### Tech Stack

```
Frontend: React + Fabric.js (canvas editing)
Backend: Next.js API routes
Storage: Your existing file system
Export: Pandoc (reusing your scripts)
```

### UI Mockup

```
┌────────────────────────────────────────────────────────┐
│ ELEMENTAL ALCHEMY BOOK EDITOR                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│ [📄 Pages] [🎨 Styles] [🖼️ Images] [⚙️ Export]        │
│                                                        │
├──────────────┬─────────────────────────────────────────┤
│              │                                         │
│ 📖 Structure │  ┌───────────────────────────────┐    │
│              │  │  [CHAPTER 5 - FIRE]           │    │
│ ▼ Chapter 5  │  │                               │    │
│   • Intro    │  │       [△ Fire Symbol]         │    │
│   • States   │  │                               │    │
│   • Practices│  │  The fire speaks to those     │    │
│              │  │  who are willing to listen... │    │
│ ▼ Chapter 6  │  │                               │    │
│   • Intro    │  │  When flames dance in the     │    │
│   • Shadow   │  │  darkness, they reveal...     │    │
│              │  │                               │    │
│ [+ Add]      │  │  [Click to add image here]    │    │
│              │  │                               │    │
│              │  └───────────────────────────────┘    │
│              │                                        │
│              │  [Preview: Print] [EPUB] [Platform]   │
│              │                                        │
└──────────────┴─────────────────────────────────────────┘
```

---

## 📋 Comparison: Atticus vs. Custom Editor

| Feature | Atticus | Custom Editor |
|---------|---------|---------------|
| **Speed to Launch** | Immediate | 2-4 weeks build |
| **Visual Editing** | ✅ Excellent | ✅ Full control |
| **Cost** | $147 one-time or $10/mo | Free (DIY) |
| **Learning Curve** | Easy | Easy (for you) |
| **Genesis Integration** | Manual export/import | ✅ Native |
| **Version Control** | No (exports only) | ✅ Git-based |
| **Platform Links** | Manual QR codes | ✅ Auto-generated |
| **Templates** | Professional built-in | Custom from scratch |
| **Print Quality** | ✅ Industry standard | ✅ Via Pandoc |
| **EPUB Quality** | ✅ Excellent | ✅ Via Pandoc |
| **Collaboration** | No | ✅ Multi-user |
| **Best For** | Fast professional results | Full ecosystem integration |

---

## 🚀 Recommended Approach

### Phase 1: Use Atticus NOW (Fastest to Market)

**Week 1**:
1. Buy Atticus ($147 or $10/mo trial)
2. Import prepared manuscript
3. Add your 10 essential images
4. Customize typography and colors
5. Export EPUB and Print PDFs

**Week 2**:
6. Order proof copies
7. Review and adjust
8. Finalize and publish

**Result**: Professional book in 2 weeks.

### Phase 2: Build Custom Editor (Long-term)

**While using Atticus for v1.0**, develop custom editor for:
- v2.0 with enhanced platform integration
- Living updates to book content
- Community annotations
- MAIA-guided reading experience

**Best of both worlds**:
- Ship fast with Atticus
- Build ideal long-term system
- Migrate when custom is ready

---

## 📦 Atticus Setup Scripts

Let me create the scripts to prepare your manuscript for Atticus:

### prepare-for-atticus.sh

```bash
#!/bin/bash
# Prepares Elemental Alchemy manuscript for Atticus import

MANUSCRIPT="source/manuscript.md"
OUTPUT_DIR="atticus-import"
OUTPUT_FILE="$OUTPUT_DIR/elemental-alchemy-atticus.docx"

mkdir -p "$OUTPUT_DIR/images"

echo "📚 Preparing manuscript for Atticus..."

# Convert to Atticus-friendly Docx
pandoc "$MANUSCRIPT" \
  --from=markdown \
  --to=docx \
  --output="$OUTPUT_FILE" \
  --reference-doc=assets/atticus-template.docx \
  --toc \
  --toc-depth=2

# Copy images to import folder
cp -r assets/images/* "$OUTPUT_DIR/images/"

echo "✅ Ready for Atticus import!"
echo ""
echo "Next steps:"
echo "1. Open Atticus"
echo "2. Create New Book → Import"
echo "3. Select: $OUTPUT_FILE"
echo "4. Images folder: $OUTPUT_DIR/images/"
echo ""
```

### atticus-template.docx

I'll create a Word template with:
- Proper heading styles (H1=Chapter, H2=Section, etc.)
- Dune color scheme applied
- Font settings (Crimson Text, Lato)
- Page layout preferences

---

## 🎨 Custom Editor Architecture

If you want me to build the custom editor, here's the plan:

### Component Structure

```
book-editor/
├── components/
│   ├── Canvas.tsx          # Main editing canvas
│   ├── PageViewer.tsx      # Live preview
│   ├── ImageManager.tsx    # Drag-drop images
│   ├── StylePanel.tsx      # Typography controls
│   ├── ChapterTree.tsx     # Navigation sidebar
│   └── ExportPanel.tsx     # Generate files
├── lib/
│   ├── book-state.ts       # Book data management
│   ├── layout-engine.ts    # Page layout logic
│   ├── export-engine.ts    # Generate EPUB/PDF
│   └── genesis-sync.ts     # Platform integration
└── pages/
    └── editor.tsx          # Main editor page
```

### Key Features

**1. Visual Canvas** (Fabric.js)
- Text boxes with rich formatting
- Image placement and sizing
- Margin guides and rulers
- Snap-to-grid alignment

**2. Live Preview**
- Switch between Print and EPUB view
- Exact page layout preview
- Mobile/tablet responsive preview
- Dark/light mode toggle

**3. Smart Imports**
- Import from existing Markdown
- Preserve formatting and structure
- Auto-place images from asset folder
- Maintain chapter hierarchy

**4. Genesis Integration**
- Auto-generate QR codes for chapters
- Embed platform links
- Sync with content database
- Track which passages users engage with

**5. Collaboration**
- Multiple users can edit
- Comment on specific pages
- Track changes
- Version history

**6. One-Click Export**
- EPUB (validated)
- Print PDF (softcover + hardcover)
- Web preview (for Genesis)
- Audiobook script (with timestamps)

---

## 💻 Building the Custom Editor

### Tech Setup

```bash
# Create book editor app
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/elemental-alchemy
npx create-next-app@latest book-editor --typescript --tailwind
cd book-editor

# Install dependencies
npm install \
  fabric \
  @react-pdf/renderer \
  html-to-docx \
  mammoth \
  react-markdown \
  remark-gfm \
  @dnd-kit/core \
  zustand
```

### Core Files

**Canvas Component** (Canvas.tsx):
```typescript
import { fabric } from 'fabric';
import { useEffect, useRef } from 'react';

export function BookCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
        width: 600,  // 6 inches at 100 DPI preview
        height: 900, // 9 inches at 100 DPI preview
        backgroundColor: '#f5f5dc', // Cream paper
      });

      // Add page margins (visual guides)
      addMarginGuides(fabricCanvas.current);

      // Load book content
      loadPage(fabricCanvas.current, currentPage);
    }

    return () => {
      fabricCanvas.current?.dispose();
    };
  }, []);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
```

**Image Manager** (ImageManager.tsx):
```typescript
export function ImageManager() {
  const [images, setImages] = useState<Image[]>([]);

  const handleDrop = (e: DragEvent) => {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    }
  };

  return (
    <div className="image-manager">
      <h3>Images</h3>
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        Drag images here
      </div>
      <div className="image-grid">
        {images.map(img => (
          <ImageThumb
            key={img.id}
            image={img}
            onSelect={() => placeImageOnPage(img)}
          />
        ))}
      </div>
    </div>
  );
}
```

**Export Engine** (export-engine.ts):
```typescript
export async function exportBook(format: 'epub' | 'pdf-print' | 'pdf-ebook') {
  const bookData = getBookState();

  switch (format) {
    case 'epub':
      return await generateEPUB(bookData);
    case 'pdf-print':
      return await generatePrintPDF(bookData);
    case 'pdf-ebook':
      return await generateEbookPDF(bookData);
  }
}

async function generateEPUB(bookData: BookData) {
  // Convert to Pandoc-compatible format
  const markdown = bookDataToMarkdown(bookData);

  // Call existing build script
  await exec(`./build-epub.sh`);

  return 'formats/epub/Elemental-Alchemy.epub';
}
```

---

## ⚡ Quick Decision Matrix

**Choose Atticus if you want to**:
- ✅ Publish in 2 weeks
- ✅ Professional quality immediately
- ✅ Minimal technical setup
- ✅ Standard book formats only
- ✅ Simple workflow

**Choose Custom Editor if you want to**:
- ✅ Deep Genesis integration
- ✅ Living, updateable book
- ✅ Community annotations
- ✅ MAIA-guided reading
- ✅ Full control and customization

**My Recommendation**:
**Start with Atticus, build custom in parallel.**

---

## 🎯 Immediate Action Plan

### Option A: Atticus (This Week)

1. **Today**: Buy Atticus + Create account
2. **Day 1**: Run `./prepare-for-atticus.sh`
3. **Day 2**: Import manuscript, add images
4. **Day 3**: Customize design (Dune colors)
5. **Day 4**: Export EPUB and Print PDFs
6. **Day 5**: Order proof copy
7. **Week 2**: Review, adjust, publish

### Option B: Custom Editor (4 Weeks)

1. **Week 1**: Set up Next.js app, basic canvas
2. **Week 2**: Import system, image management
3. **Week 3**: Export engine, Genesis integration
4. **Week 4**: Polish UI, testing, deployment

### Option C: Both (Best)

1. **Now**: Use Atticus for v1.0 (ship fast)
2. **Parallel**: Build custom editor for v2.0
3. **Month 2**: Migrate to custom when ready
4. **Ongoing**: Living book with platform integration

---

## 📁 File Structure Ready

I'll create everything you need:

```bash
# For Atticus workflow
./prepare-for-atticus.sh
./atticus-template.docx
./atticus-import/

# For custom editor (if building)
./book-editor/
├── README.md
├── package.json
├── components/
├── lib/
└── pages/
```

---

Would you like me to:

1. **Create the Atticus preparation scripts** right now?
2. **Build the custom web editor** (4-week project)?
3. **Both** - Quick Atticus setup + custom editor in parallel?
4. **Show you Atticus alternatives** (Vellum, Scrivener, Reedsy)?

Let me know and I'll get you set up! 🎨📖✨
