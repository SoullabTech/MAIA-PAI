# Soullab Essays

**Field notes from the edge of consciousness design**

---

## Publishing Essays via CLI

### Quick Start

```bash
# From apps/web directory
./scripts/new-essay.sh /path/to/your-essay.md
```

That's it! Your essay is now published.

---

## Essay Format

Essays should be markdown files with frontmatter:

```markdown
---
title: "Your Essay Title"
subtitle: "Optional Subtitle"
date: "2025-10-25"
author: "Soullab Collective"
tags: ["AI", "Consciousness", "Design"]
excerpt: "A brief excerpt for the listing page"
featured: false
---

Your essay content here in markdown...

## Headings work

Paragraphs, **bold**, *italic*, etc.

> Blockquotes too

```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Essay title |
| `subtitle` | No | Subtitle or tagline |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `author` | No | Defaults to "Soullab Collective" |
| `tags` | No | Array of tags |
| `excerpt` | No | Short description for listings |
| `featured` | No | Set to `true` to feature on essays page |

---

## Publishing Workflow

### 1. Write Your Essay

Create a markdown file with frontmatter:

```bash
# Example: ~/Documents/relational-ai.md
---
title: "Relational AI and the Future of Learning"
subtitle: "Why connection matters more than computation"
date: "2025-10-25"
author: "Soullab Collective"
tags: ["AI", "Education", "Relationship"]
excerpt: "The next generation of AI will know how to relate, not just predict."
featured: true
---

Your content here...
```

### 2. Publish via CLI

```bash
cd /Users/soullab/SoullabTech/MAIA-PAI/apps/web
./scripts/new-essay.sh ~/Documents/relational-ai.md
```

The script will:
- Copy essay to `content/essays/`
- Extract metadata from frontmatter
- Add entry to `content/essays/index.json`
- Give you the local URL

### 3. View Locally

```bash
# Start dev server (if not running)
npm run dev

# Visit
open http://localhost:3000/essays
```

### 4. Deploy

```bash
git add .
git commit -m "Add essay: Relational AI"
git push
```

Your essay is now live!

---

## File Structure

```
apps/web/
├── content/essays/
│   ├── index.json                          # Essays registry
│   ├── beyond-algorithmic-personalization.md
│   └── your-new-essay.md
│
├── app/essays/
│   ├── page.tsx                            # Essays listing
│   └── [slug]/page.tsx                     # Individual essay
│
└── scripts/
    └── new-essay.sh                        # Publishing CLI
```

---

## Managing Essays

### View All Essays

```bash
cat content/essays/index.json | jq .
```

### Feature an Essay

Edit `content/essays/index.json`:

```json
{
  "slug": "your-essay",
  "featured": true  // <-- Set to true
}
```

### Remove an Essay

1. Delete from `content/essays/your-essay.md`
2. Remove entry from `content/essays/index.json`

---

## Styling

Essays use Tailwind typography (`prose` classes) with custom styling:

- Headings: Bold, slate-900
- Body: Slate-700, relaxed leading
- Links: Blue-600, hover underline
- Blockquotes: Blue-400 left border
- Code: Slate-100 background

To customize, edit `/app/essays/[slug]/page.tsx`.

---

## Advanced: Adding Images

```markdown
![Alt text](/images/essays/my-image.png)
```

Store images in:
```
apps/web/public/images/essays/
```

---

## Cross-Publishing

### To Substack

1. Copy essay markdown content
2. Paste into Substack editor
3. Format and publish

### To Medium

1. Use Medium's import tool
2. Paste Soullab URL: `https://soullab.life/essays/your-slug`
3. Medium will import and format

### Canonical Links

Set Soullab as canonical URL to maintain SEO:
- Medium: Settings → Advanced → Canonical link
- Substack: Add canonical meta tag

---

## Examples

See `/content/essays/beyond-algorithmic-personalization.md` for reference.

---

## Future Enhancements

Planned features:
- [ ] Auto-deploy on commit
- [ ] RSS feed generation
- [ ] Social media card generation
- [ ] Reading time calculation
- [ ] Related essays suggestions
- [ ] Comments via Supabase
- [ ] Draft/published states

---

## Support

Questions? Issues?
- GitHub: [Create issue]
- Email: hello@soullab.life
- Community: [Soullab Discord]

---

**Built with**: Next.js 14, Tailwind CSS, TypeScript
**License**: MIT (code) / CC BY-NC-SA 4.0 (content)
