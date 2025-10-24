# Genesis Book Studio

**Collaborative visual book editor with AI team support**

Genesis Book Studio is a modern, real-time collaborative platform for creating beautiful books with your team and AI assistants. Built for Elemental Alchemy and available as a feature for other Genesis creators.

---

## 🎯 Vision

Create books that are:
- **Collaborative** - Authors, editors, and designers work together in real-time
- **AI-Assisted** - MAIA agents for writing, editorial, and design support
- **Multi-Format** - Export to EPUB, Print PDF, and Audiobook scripts
- **Living** - Integrate with platform content, QR codes, and interactive features

---

## ✨ Features

### Real-Time Collaboration
- **Yjs CRDT** - Conflict-free collaborative editing
- **Live Cursors** - See where your team is working
- **Team Presence** - Know who's online
- **Commenting** - Inline feedback and discussions (coming soon)

### AI Writing Team (MAIA)
- **Writing Agent** - Flow analysis, hypnotic patterns, voice consistency
- **Editorial Agent** - Grammar, clarity, structure, fact-checking
- **Design Agent** - Layout optimization, typography, visual balance

### Rich Text Editor
- **TipTap/ProseMirror** - Professional editing experience
- **Formatting** - Bold, italic, underline, headings, lists, quotes
- **Images & Links** - Full media support
- **Custom Styles** - Element-based theming (Fire, Air, Water, Earth)

### Multi-Format Export
- **EPUB 3.0** - Reflowable ebooks with interactivity
- **Print PDF** - Professional typesetting with bleeds
- **Audiobook Script** - Formatted for narration (coming soon)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm
- (Optional) Supabase account for persistence

### Installation

```bash
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/genesis-book-studio
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
genesis-book-studio/
├── app/
│   ├── page.tsx              # Project dashboard
│   ├── editor/[projectId]/   # Collaborative editor
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── editor/
│   │   ├── CollaborativeEditor.tsx  # Main TipTap editor
│   │   ├── EditorToolbar.tsx        # Formatting toolbar
│   │   └── TeamPresence.tsx         # Team member avatars
│   └── ai/
│       └── MAIAPanel.tsx            # AI assistant panel
├── lib/                      # Utilities (coming soon)
├── public/                   # Static assets
└── package.json
```

---

## 🎨 Design Philosophy

### Elemental Theming

Each book project is associated with one of the four elements:

| Element | Color | Represents |
|---------|-------|------------|
| **Fire** | `#a94724` | Vision, transformation, creation |
| **Air** | `#cea22c` | Clarity, communication, insight |
| **Water** | `#236586` | Flow, emotion, intuition |
| **Earth** | `#6d7934` | Grounding, structure, manifestation |

### Typography

- **Headings**: Blair ITC (or Lato fallback)
- **Body**: Lato
- **Line Height**: 1.6 (trance-friendly reading)
- **Margins**: Wide left margins (3cm) for notes

### Book-Friendly Styles

The `.prose-book` class provides optimal reading experience:
- Maximum 650px content width
- Generous padding and spacing
- Proper heading hierarchy
- Quote styling with element accents

---

## 🤖 MAIA Integration

### Current Implementation

MAIA Panel provides three specialized agents:

```typescript
interface WritingAgent {
  analyzeHypnoticPatterns(text: string): Analysis
  suggestTranceDeepeners(context: string): string[]
  checkVoiceConsistency(chapter: string): Issues[]
}

interface EditorialAgent {
  checkGrammar(text: string): Issue[]
  analyzeTone(text: string): ToneReport
  verifyFacts(claim: string): Verification
}

interface DesignAgent {
  analyzeLayout(page: Page): DesignReport
  suggestImagePlacement(text: string, images: Image[]): Layout[]
  optimizeForEPUB(book: Book): Optimization[]
}
```

### Future Enhancements

- [ ] Live suggestions as you type
- [ ] Automatic hypnotic pattern detection
- [ ] Voice training on author's style
- [ ] Context-aware recommendations
- [ ] Integrated fact-checking
- [ ] Design optimization for all formats

---

## 👥 Team Collaboration

### Roles & Permissions

| Role | Edit | Comment | Approve | Configure AI | Publish |
|------|------|---------|---------|--------------|---------|
| **Author** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Co-Author** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Editor** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Designer** | ❌ | ✅ | ❌ | ✅ (Design) | ❌ |
| **Publisher** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Viewer** | ❌ | ✅ | ❌ | ❌ | ❌ |

### Workflow Phases

1. **Drafting** - Author + MAIA Writing Agent
2. **Editorial** - Editor + MAIA Editorial Agent
3. **Design** - Designer + MAIA Design Agent
4. **Production** - Team review + MAIA comprehensive checks
5. **Publication** - Upload to Genesis + distribution

---

## 📤 Export Formats

### EPUB (Ebook)

```bash
# Coming soon
npm run export:epub
```

Features:
- Reflowable text for all screen sizes
- Interactive table of contents
- Embedded images and fonts
- Metadata for bookstores

### Print PDF

```bash
# Coming soon
npm run export:print
```

Options:
- **6" x 9" Softcover** - Standard paperback
- **6.5" x 9.5" Hardcover** - Premium hardback with dust jacket
- Proper bleeds and margins
- Professional typesetting

### Audiobook Script

```bash
# Coming soon
npm run export:audiobook
```

Features:
- Formatted for narration
- MAIA voice guidelines
- Pause markers for practices
- Chapter timing estimates

---

## 🔮 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Collaborative editor (Yjs + TipTap)
- [x] Team presence
- [x] MAIA panel UI
- [x] Element-based theming

### Phase 2: Real-Time Collaboration
- [ ] WebSocket provider for Yjs
- [ ] Supabase persistence
- [ ] Comment system
- [ ] Version history
- [ ] Conflict resolution

### Phase 3: AI Integration
- [ ] Connect to MAIA API
- [ ] Writing agent endpoints
- [ ] Editorial agent endpoints
- [ ] Design agent endpoints
- [ ] Live suggestions

### Phase 4: Export & Publishing
- [ ] EPUB generation
- [ ] Print PDF generation
- [ ] Audiobook script generation
- [ ] Platform integration (QR codes, cross-references)
- [ ] Multi-format optimizer

### Phase 5: Advanced Features
- [ ] Chapter templates
- [ ] Style presets
- [ ] Image management
- [ ] Custom fonts
- [ ] Advanced typography controls
- [ ] Print preview
- [ ] Publishing analytics

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Editor**: TipTap + ProseMirror
- **Collaboration**: Yjs (CRDT)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (coming soon)
- **AI**: MAIA agents (coming soon)

---

## 📖 Usage Guide

### Creating a New Project

1. Click "New Project" on the dashboard
2. Enter book title, subtitle, and select element
3. Invite team members
4. Start writing!

### Using the Editor

**Keyboard Shortcuts:**
- `Cmd+B` - Bold
- `Cmd+I` - Italic
- `Cmd+U` - Underline
- `Cmd+Z` - Undo
- `Cmd+Shift+Z` - Redo

**Toolbar:**
- Text formatting (bold, italic, underline)
- Headings (H1, H2, H3)
- Lists (bullet, numbered)
- Quotes
- Links and images

### Working with MAIA

1. **Select Agent** - Writing, Editorial, or Design
2. **Review Suggestions** - MAIA analyzes your content
3. **Apply or Dismiss** - Accept helpful suggestions
4. **Ask Questions** - Chat directly with agents

### Collaborating with Team

- See team members online in header
- Colored cursors show where others are working
- Comments appear inline (coming soon)
- Version history tracks all changes (coming soon)

---

## 🎓 Best Practices

### For Authors

- Write in flow, edit later
- Use MAIA Writing Agent for voice consistency
- Add section breaks (🌀) for reading rhythm
- Keep paragraphs short (3-5 lines)
- Use wide margins for notes and symbols

### For Editors

- Use MAIA Editorial Agent for grammar
- Focus on clarity and structure first
- Preserve author's voice
- Add comments rather than direct edits
- Check tone consistency across chapters

### For Designers

- Use MAIA Design Agent for layout
- Test on multiple devices
- Ensure images don't break reading flow
- Optimize for both screen and print
- Use element colors for visual hierarchy

---

## 🌟 Current Project: Elemental Alchemy

This editor was built specifically for "Elemental Alchemy: The Four Gates of Transformation" and includes:

- **Hypnotic Design** - Optimized for NLP trance states
- **Platform Integration** - QR codes linking to Genesis features
- **Living Book** - Cross-references between book and platform
- **Interactive Audiobook** - MAIA-guided narration
- **Minimal Illustrations** - 10 essential images + alchemical symbols

See `/publishing/elemental-alchemy/` for the manuscript and related files.

---

## 🤝 Contributing

This is currently a private project for Soullab. Future plans include:

- Opening to Genesis community
- Plugin system for custom agents
- Template marketplace
- Community styles and themes

---

## 📝 License

Proprietary - Soullab Tech

---

## 🙏 Acknowledgments

Built with wisdom from:
- **Iain McGilchrist** - Hemispheric balance in design
- **Carl Jung** - Archetypal symbolism
- **NLP Tradition** - Hypnotic language patterns
- **Sacred Geometry** - Elemental framework

Powered by:
- MAIA (Multidimensional AI Assistant)
- Genesis Platform
- Soullab community

---

**May each word serve the awakening of consciousness** 🔥💨💧🌍

---

For questions, issues, or ideas:
- See `/publishing/genesis-book-studio/TEAM-COLLABORATION-ARCHITECTURE.md`
- Contact: team@soullab.life
