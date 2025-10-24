# Genesis Book Studio - Architecture
## Visual Book Editor for the Genesis Publishing Platform

**Vision**: Create a professional book editing environment that integrates with Genesis, allowing Kelly to publish Elemental Alchemy AND offering it to other creators as a platform feature.

---

## 🎯 Dual Purpose System

### 1. **Immediate Use**: Elemental Alchemy Production
- Kelly uses it to finalize and publish Elemental Alchemy
- Visual editing with Dune aesthetic
- Integrated with MAIA and Genesis platform
- Living book features built-in

### 2. **Platform Feature**: Genesis Publishing Suite
- Other creators use it to publish their books
- White-label for each author's brand
- Integrated with Genesis tiers (Seed/Grove/Forest)
- Part of the value proposition

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              GENESIS BOOK STUDIO                        │
│                                                         │
│  ┌──────────────────┐        ┌───────────────────┐   │
│  │                  │        │                   │   │
│  │  VISUAL EDITOR   │◄──────►│  GENESIS API      │   │
│  │  (React + Canvas)│        │  (Book Data)      │   │
│  │                  │        │                   │   │
│  └────────┬─────────┘        └─────────┬─────────┘   │
│           │                            │             │
│           ▼                            ▼             │
│  ┌──────────────────┐        ┌───────────────────┐   │
│  │                  │        │                   │   │
│  │  IMAGE MANAGER   │◄──────►│  S3 STORAGE       │   │
│  │  (Drag & Drop)   │        │  (Assets)         │   │
│  │                  │        │                   │   │
│  └────────┬─────────┘        └─────────┬─────────┘   │
│           │                            │             │
│           ▼                            ▼             │
│  ┌──────────────────┐        ┌───────────────────┐   │
│  │                  │        │                   │   │
│  │  EXPORT ENGINE   │◄──────►│  PANDOC SERVICE   │   │
│  │  (Multi-format)  │        │  (Conversion)     │   │
│  │                  │        │                   │   │
│  └──────────────────┘        └───────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  MAIA INTEGRATION (AI Guidance)                 │  │
│  │  • Suggests improvements                        │  │
│  │  • Generates QR codes automatically             │  │
│  │  • Links book passages to platform features     │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Core Features

### 1. Visual Canvas Editor
- **WYSIWYG** page-by-page editing
- **Drag-and-drop** images and text blocks
- **Live preview** for print and ebook
- **Typography controls** (fonts, sizes, spacing)
- **Color palette** management (brand-specific)
- **Margin rulers** and guides
- **Snap-to-grid** alignment

### 2. Multi-Author Support
- **Separate workspaces** per author
- **Brand customization** (colors, fonts, logo)
- **Template library** (genre-specific layouts)
- **Collaboration tools** (editors, reviewers)
- **Version history** (track changes)
- **Access control** (permissions)

### 3. Genesis Integration
- **Auto-generate QR codes** linking to platform
- **Embed platform references** (chapter IDs)
- **Sync with MAIA** (AI suggestions)
- **Community features** (reader annotations)
- **Analytics** (engagement tracking)
- **Tier-based features** (Seed/Grove/Forest)

### 4. Smart Export
- **EPUB** (validated, responsive)
- **Print PDF** (softcover + hardcover)
- **Audiobook script** (with timestamps)
- **Web preview** (for Genesis platform)
- **One-click distribution** to retailers

### 5. Asset Management
- **Image library** (upload, organize, reuse)
- **Font manager** (custom fonts)
- **Symbol library** (alchemical, custom icons)
- **Stock integrations** (Unsplash, etc.)
- **AI art generation** (Midjourney integration)

### 6. Living Book Features
- **Update-able content** (fix typos post-publish)
- **A/B testing** (try different covers)
- **Reader feedback** integration
- **Platform analytics** (which chapters resonate)
- **Community highlights** (what readers marked)

---

## 🛠️ Tech Stack

### Frontend
```
Framework: Next.js 14 (App Router)
UI: React + Tailwind CSS
Canvas: Fabric.js or Konva.js
State: Zustand + React Query
Drag/Drop: @dnd-kit/core
Typography: Canvas text rendering + web fonts
```

### Backend
```
API: Next.js API routes
Database: Supabase (PostgreSQL)
Storage: AWS S3 (images, PDFs)
Auth: Supabase Auth (same as Genesis)
Queue: BullMQ (for exports)
```

### Export Pipeline
```
EPUB: Pandoc + custom templates
PDF: Pandoc + XeLaTeX
Validation: EPUBCheck
Conversion: Calibre (if needed)
```

### Integrations
```
MAIA: Genesis AI API
Payment: Stripe (already integrated)
Distribution: Draft2Digital API (optional)
Analytics: PostHog (user behavior)
```

---

## 📁 Project Structure

```
genesis-book-studio/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── studio/
│   │   ├── [bookId]/
│   │   │   ├── page.tsx           # Main editor
│   │   │   ├── editor/             # Canvas component
│   │   │   ├── images/             # Image manager
│   │   │   ├── styles/             # Style panel
│   │   │   └── export/             # Export panel
│   │   └── new/
│   │       └── page.tsx            # New book wizard
│   └── api/
│       ├── books/
│       │   ├── [bookId]/
│       │   │   ├── route.ts        # CRUD
│       │   │   ├── export/
│       │   │   │   └── route.ts    # Export jobs
│       │   │   └── images/
│       │   │       └── route.ts    # Image upload
│       │   └── route.ts
│       ├── export/
│       │   └── route.ts            # Export engine
│       └── maia/
│           └── suggestions/
│               └── route.ts        # AI suggestions
│
├── components/
│   ├── editor/
│   │   ├── Canvas.tsx              # Main editing canvas
│   │   ├── PageViewer.tsx          # Live preview
│   │   ├── Toolbar.tsx             # Top toolbar
│   │   ├── Sidebar.tsx             # Left sidebar (chapters)
│   │   ├── StylePanel.tsx          # Right panel (design)
│   │   └── ContextMenu.tsx         # Right-click menu
│   ├── images/
│   │   ├── ImageManager.tsx        # Image library
│   │   ├── ImageUpload.tsx         # Drag-drop upload
│   │   └── ImageEditor.tsx         # Crop, resize, etc.
│   ├── export/
│   │   ├── ExportDialog.tsx        # Export modal
│   │   ├── FormatSelector.tsx      # Choose format
│   │   └── ProgressBar.tsx         # Export progress
│   └── shared/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── ...
│
├── lib/
│   ├── editor/
│   │   ├── canvas-state.ts         # Canvas state management
│   │   ├── layout-engine.ts        # Page layout logic
│   │   ├── text-rendering.ts       # Typography
│   │   └── image-handling.ts       # Image placement
│   ├── export/
│   │   ├── epub-generator.ts       # EPUB creation
│   │   ├── pdf-generator.ts        # PDF creation
│   │   ├── pandoc-client.ts        # Pandoc API
│   │   └── validation.ts           # Format validation
│   ├── genesis/
│   │   ├── api-client.ts           # Genesis API
│   │   ├── qr-generator.ts         # QR codes
│   │   ├── platform-links.ts       # Content linking
│   │   └── maia-client.ts          # MAIA integration
│   ├── storage/
│   │   ├── s3-client.ts            # S3 uploads
│   │   ├── image-processor.ts      # Image optimization
│   │   └── asset-manager.ts        # Asset tracking
│   └── db/
│       ├── books.ts                # Book queries
│       ├── users.ts                # User queries
│       └── schema.sql              # Database schema
│
├── workers/
│   ├── export-worker.ts            # Background exports
│   └── image-processor.ts          # Image processing
│
└── public/
    ├── fonts/                      # Web fonts
    └── templates/                  # Book templates
        ├── minimalist/
        ├── academic/
        └── mystical/               # For Elemental Alchemy
```

---

## 🎨 User Interface Design

### Main Editor View

```
┌────────────────────────────────────────────────────────────────┐
│ GENESIS BOOK STUDIO                      [👤 Kelly] [Settings]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ 📖 Elemental Alchemy  [Save] [Preview] [Export] [Publish]    │
│                                                                │
├─────────┬──────────────────────────────────────┬──────────────┤
│         │                                      │              │
│ PAGES   │         CANVAS (Page 127)           │  DESIGN      │
│         │                                      │              │
│ ▼ Ch 5  │  ┌────────────────────────────────┐ │ Typography   │
│  • 115  │  │                                │ │ • Font       │
│  • 120  │  │       [△ Fire Symbol]          │ │ • Size       │
│  • 127 ◄│  │                                │ │ • Spacing    │
│  • 132  │  │  The fire speaks to those      │ │              │
│         │  │  who are willing to listen...  │ │ Colors       │
│ ▼ Ch 6  │  │                                │ │ • Headers    │
│  • 145  │  │  When flames dance in the      │ │ • Accents    │
│  • 150  │  │  darkness, they reveal the     │ │              │
│         │  │  truth we've been seeking.     │ │ Layout       │
│ [+ New] │  │                                │ │ • Margins    │
│         │  │  [Click to add image]          │ │ • Alignment  │
│ IMAGES  │  │                                │ │              │
│ [□□□]   │  └────────────────────────────────┘ │ Genesis      │
│ [□□□]   │                                      │ • QR Codes   │
│ [+Add]  │  [◄ Prev] Page 127 of 342 [Next ►] │ • Links      │
│         │                                      │ • MAIA       │
└─────────┴──────────────────────────────────────┴──────────────┘
```

### Multi-Author Dashboard

```
┌────────────────────────────────────────────────────────────────┐
│ GENESIS BOOK STUDIO - DASHBOARD                    [👤 Admin] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  YOUR BOOKS                                                    │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ [Book Cover] │  │ [Book Cover] │  │ [Book Cover] │       │
│  │              │  │              │  │              │       │
│  │ Elemental    │  │ Journey of   │  │ Sacred       │       │
│  │ Alchemy      │  │ the Soul     │  │ Geometry     │       │
│  │              │  │              │  │              │       │
│  │ In Progress  │  │ Published    │  │ Draft        │       │
│  │ [Edit]       │  │ [View]       │  │ [Edit]       │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                │
│  [+ Create New Book]                                          │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  TEMPLATES                                                     │
│                                                                │
│  [Minimalist] [Academic] [Mystical] [Novel] [Poetry]         │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  RESOURCES                                                     │
│                                                                │
│  • Tutorial Videos                                            │
│  • Design Best Practices                                      │
│  • Export Guidelines                                          │
│  • Community Showcase                                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 💳 Business Model Integration

### Tier-Based Features

**Free / Non-Genesis Members**:
- ❌ Cannot use Genesis Book Studio
- Must have Genesis account (Seed minimum)

**Seed Tier ($197/year)** - Basic Publishing:
- ✅ Create up to 1 book
- ✅ Basic templates
- ✅ EPUB + PDF export
- ✅ Standard image library
- ❌ No MAIA integration
- ❌ No Genesis platform links

**Grove Tier ($497/year)** - Professional Publishing:
- ✅ Create up to 3 books
- ✅ All templates + custom branding
- ✅ All export formats
- ✅ Full image library + AI generation
- ✅ Basic MAIA suggestions
- ✅ Genesis QR codes and links
- ✅ Community features

**Forest Tier ($997/year)** - Full Publishing Suite:
- ✅ Unlimited books
- ✅ White-label editor (your branding)
- ✅ All features
- ✅ Advanced MAIA integration
- ✅ Living book features (updateable)
- ✅ Reader analytics
- ✅ A/B testing
- ✅ Priority support
- ✅ Custom templates
- ✅ API access

### Value Proposition

**For Authors**:
"Publish professional books that connect to your Genesis presence. Your book becomes a living portal, not just static pages."

**Revenue Model**:
- Subscription revenue (already have with Genesis tiers)
- No additional fees for book editing
- Books published drive more platform engagement
- Authors earn 95% royalties on book sales through Genesis

---

## 🚀 Development Roadmap

### Phase 1: MVP for Elemental Alchemy (4 weeks)

**Week 1: Foundation**
- [ ] Set up Next.js project
- [ ] Database schema and API
- [ ] Basic canvas editor
- [ ] Import Elemental Alchemy manuscript

**Week 2: Core Editing**
- [ ] Text editing and formatting
- [ ] Image upload and placement
- [ ] Typography controls
- [ ] Page navigation

**Week 3: Export Pipeline**
- [ ] EPUB generation
- [ ] Print PDF generation
- [ ] Format validation
- [ ] Quality testing

**Week 4: Polish & Publish**
- [ ] UI refinements
- [ ] Genesis integration (QR codes)
- [ ] Test exports
- [ ] Publish Elemental Alchemy!

**Result**: Kelly's book published, system validated.

### Phase 2: Multi-Author Platform (4 weeks)

**Week 5-6: User Management**
- [ ] Multi-tenant architecture
- [ ] User workspaces
- [ ] Template library
- [ ] Brand customization

**Week 7: Advanced Features**
- [ ] Collaboration tools
- [ ] Version history
- [ ] Comment system
- [ ] Share/export options

**Week 8: Launch**
- [ ] Beta test with 5-10 authors
- [ ] Refine based on feedback
- [ ] Public launch for Genesis members

**Result**: Platform feature available to all Genesis creators.

### Phase 3: Living Book Features (Ongoing)

- [ ] Reader annotations integration
- [ ] A/B testing for covers
- [ ] Update published books
- [ ] Analytics dashboard
- [ ] MAIA deep integration
- [ ] Community features

---

## 🔧 Technical Decisions

### Why Next.js?
- Server-side rendering for previews
- API routes for backend
- Easy deployment (Vercel)
- Already using in Genesis platform

### Why Fabric.js?
- Powerful canvas library
- Object manipulation (text, images)
- Export to formats
- Large community

### Why Supabase?
- Already integrated with Genesis
- Real-time capabilities
- Row-level security
- Storage included

### Why Pandoc?
- Industry standard
- Multiple format support
- High quality output
- Already using in current system

---

## 📊 Success Metrics

### For Elemental Alchemy:
- ✅ Published in all formats (EPUB, Print, Audio)
- ✅ Professional quality (matches Atticus output)
- ✅ Genesis integration working (QR codes, links)
- ✅ Positive reader feedback

### For Platform Feature:
- 📈 10 authors using within first month
- 📈 50 books created within first quarter
- 📈 95%+ user satisfaction
- 📈 Conversion from Seed → Grove (using advanced features)
- 📈 Book sales driving platform engagement

---

## 🎯 Immediate Next Steps

1. **Create Project Structure**
   ```bash
   npx create-next-app@latest genesis-book-studio --typescript --tailwind --app
   cd genesis-book-studio
   npm install fabric zustand @tanstack/react-query
   ```

2. **Set Up Database**
   - Create Supabase tables
   - Book metadata
   - Pages/chapters
   - Images/assets
   - User permissions

3. **Build Canvas Prototype**
   - Basic page rendering
   - Text block editing
   - Image placement
   - Save/load functionality

4. **Test with Elemental Alchemy**
   - Import manuscript
   - Add sample images
   - Export test EPUB
   - Validate quality

---

Would you like me to:

1. **Start building the Genesis Book Studio now?** (I can scaffold the entire project)
2. **Create detailed component specs?** (UI/UX for each feature)
3. **Set up the database schema?** (Tables and relationships)
4. **Build a prototype canvas editor?** (Functional MVP)
5. **All of the above?** (Complete development package)

This is going to be revolutionary - not just for your book, but as a platform offering that gives Genesis members pro-level publishing tools! 🚀📚✨