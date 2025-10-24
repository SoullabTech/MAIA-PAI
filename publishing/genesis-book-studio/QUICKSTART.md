# Genesis Book Studio - Quick Start Guide

Get up and running in 5 minutes!

---

## 1. Install Dependencies

```bash
cd /Users/soullab/SoullabTech/MAIA-PAI/publishing/genesis-book-studio
npm install
```

## 2. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3002**

---

## 3. Open the App

### Dashboard
Visit [http://localhost:3002](http://localhost:3002)

You'll see:
- **Elemental Alchemy** project card (sample)
- "New Project" button
- Feature overview

### Editor
Click on the **Elemental Alchemy** card or visit:
[http://localhost:3002/editor/elemental-alchemy](http://localhost:3002/editor/elemental-alchemy)

---

## 4. Explore the Editor

### Top Toolbar
- **Home** - Back to dashboard
- **Team Presence** - See who's online (You, Sarah Chen, Marcus Webb)
- **Comments** - Toggle comment panel (coming soon)
- **MAIA** - Toggle AI assistant panel
- **Save** - Save changes (coming soon)
- **Export** - Export to EPUB/PDF (coming soon)
- **Settings** - Project settings (coming soon)

### Editor Toolbar
- **Bold** (Cmd+B), **Italic** (Cmd+I), **Underline** (Cmd+U)
- **Headings** - H1, H2, H3
- **Lists** - Bullet lists, numbered lists, quotes
- **Insert** - Links, images
- **Undo/Redo**

### MAIA Panel (Right Side)
- **Writing Agent** - Flow, hypnotic patterns, voice consistency
- **Editorial Agent** - Grammar, clarity, structure
- **Design Agent** - Layout, typography, visuals

Click each agent to see their suggestions!

---

## 5. Try Editing

1. **Click in the editor** to start typing
2. **Use the toolbar** to format text
3. **Select text** to see formatting options
4. **Check MAIA panel** for AI suggestions
5. **Apply or dismiss** MAIA recommendations

### Sample Edits to Try

- Change a heading to H1 or H2
- Make some text **bold** or *italic*
- Add a new paragraph
- Insert a bullet list
- Add a quote with the quote button
- Try the link or image insertion

---

## 6. Understanding the Interface

### Element Colors

The editor is themed by element:

| Element | Color | Border |
|---------|-------|--------|
| Fire | #a94724 (red-brown) | Top border of editor toolbar |
| Air | #cea22c (golden yellow) | - |
| Water | #236586 (deep blue) | - |
| Earth | #6d7934 (olive green) | - |

### Team Member Colors

- **You** - Fire red (#a94724)
- **Sarah Chen** - Water blue (#236586)
- **Marcus Webb** - Earth green (#6d7934)

In future, you'll see their cursors and selections in these colors!

---

## 7. Current Features

### ✅ Working Now
- Rich text editing (TipTap)
- Text formatting toolbar
- MAIA panel UI (mock suggestions)
- Team presence display
- Element-based theming
- Responsive layout

### 🚧 Coming Soon
- Real-time collaboration (Yjs WebSocket)
- Supabase persistence
- Actual MAIA AI integration
- Comment system
- Export to EPUB/PDF/Audiobook
- Version history
- Project settings

---

## 8. Project Structure

```
genesis-book-studio/
├── app/
│   ├── page.tsx                    # Dashboard
│   ├── editor/[projectId]/         # Editor page
│   │   └── page.tsx
│   └── globals.css                 # Styles
│
├── components/
│   ├── editor/
│   │   ├── CollaborativeEditor.tsx # Main editor
│   │   ├── EditorToolbar.tsx       # Formatting controls
│   │   └── TeamPresence.tsx        # Team avatars
│   └── ai/
│       └── MAIAPanel.tsx           # AI assistant
│
└── README.md                       # Full documentation
```

---

## 9. Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Bold | `Cmd+B` |
| Italic | `Cmd+I` |
| Underline | `Cmd+U` |
| Undo | `Cmd+Z` |
| Redo | `Cmd+Shift+Z` |

---

## 10. Next Steps

### For Elemental Alchemy

1. **Import manuscript** from `/publishing/elemental-alchemy/source/manuscript.md`
2. **Add illustrations** (see illustration-map.csv)
3. **Integrate MAIA** for real suggestions
4. **Connect Supabase** for persistence
5. **Export to EPUB/PDF** when ready

### For Other Books

1. Click **"New Project"** on dashboard
2. Enter title, subtitle, element
3. Start writing!
4. Invite team members (coming soon)
5. Export to multiple formats

---

## 11. Troubleshooting

### Port Already in Use

If port 3002 is busy:

```bash
# Kill existing process
lsof -ti:3002 | xargs kill -9

# Or use a different port
npm run dev -- -p 3003
```

### Dependencies Won't Install

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Editor Not Loading

- Check browser console for errors
- Ensure Next.js compiled successfully
- Try refreshing the page
- Check that all imports are correct

---

## 12. Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TipTap** - Rich text editor
- **Yjs** - Real-time collaboration (CRDT)
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

---

## 13. Development Commands

```bash
# Start dev server (port 3002)
npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 14. What Makes This Special?

### Collaborative
- Real-time editing with team members
- No merge conflicts (CRDT technology)
- See who's working where

### AI-Assisted
- MAIA Writing Agent for flow and voice
- MAIA Editorial Agent for grammar and clarity
- MAIA Design Agent for layout and typography

### Multi-Format
- One source, many outputs
- EPUB for ebooks
- PDF for print
- Scripts for audiobooks

### Living Books
- Integrate with platform content
- QR codes for deeper exploration
- Cross-references between formats
- Interactive audiobook experiences

---

## 15. Get Help

- **Full Docs**: See `README.md`
- **Architecture**: See `TEAM-COLLABORATION-ARCHITECTURE.md`
- **Issues**: Contact team@soullab.life

---

**Start creating your transformative book!** 🔥💨💧🌍

Visit: [http://localhost:3002](http://localhost:3002)
