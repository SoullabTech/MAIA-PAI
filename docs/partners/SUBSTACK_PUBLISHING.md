# Substack Publishing Guide

Complete guide for publishing Soullab Inside content to Substack.

---

## Setup

### 1. Get Your Substack API Credentials

Substack uses API keys for authentication. To get your credentials:

1. **Go to your Substack settings:**
   - Navigate to `https://[your-publication].substack.com/publish/settings`
   - Click on "Advanced" tab

2. **Generate API key:**
   - Look for "API access" section
   - Click "Generate new API key"
   - Copy the key and save it securely

3. **Get your Publication ID:**
   - Your publication ID is visible in your Substack dashboard URL
   - Format: `https://[your-publication].substack.com/publish/home`
   - Or find it via API: `GET https://api.substack.com/v1/publications`

### 2. Add Environment Variables

Add these to your `.env.local` file:

```bash
# Substack Publishing
SUBSTACK_API_KEY=your_api_key_here
SUBSTACK_PUBLICATION_ID=your_publication_id_here
```

**Security Note:** Never commit your API key to git. It's already in `.gitignore`.

---

## Publishing the Blog Post

### Option 1: Publish as Draft (Recommended)

This creates a draft in your Substack dashboard for review before publishing:

```bash
npm run publish:substack
```

The script will:
1. ✅ Read the blog post from `app/blog/when-technology-learns-to-listen/page.mdx`
2. ✅ Extract front-matter (title, subtitle, canonical URL)
3. ✅ Convert MDX to HTML
4. ✅ Create a draft post in Substack
5. ✅ Return the post URL for review

**Next steps:**
1. Open your Substack dashboard
2. Find the draft post
3. Add any custom formatting, images, or embeds
4. Preview and publish when ready

### Option 2: Publish Immediately

To publish immediately without draft review, modify the script:

```typescript
// In scripts/publish-to-substack.ts, change:
publish_immediately: false,  // Change to true
is_draft: true,              // Change to false
```

---

## What Gets Published

The script automatically converts your MDX blog post to Substack format:

### Front-Matter Mapping

| MDX Front-matter | Substack Field | Example |
|------------------|----------------|---------|
| `title` | Post title | "When Technology Learns to Listen" |
| `subtitle` | Post subtitle | "A new way for wisdom to live on" |
| `canonicalUrl` | Canonical URL | https://soullab.life/partners |
| `publishedAt` | Post date | 2025-01-17 |

### Content Conversion

The script converts markdown to HTML:

- **Headers** → `<h1>`, `<h2>`, `<h3>`
- **Bold** → `<strong>`
- **Italic** → `<em>`
- **Links** → `<a href>`
- **Blockquotes** → `<blockquote>`
- **Tables** → `<table>` with `<tr>` and `<td>`

### Design Preservation

While Substack uses its own styling system, the semantic HTML structure ensures:

- Proper heading hierarchy
- Emphasis and quotes preserved
- Tables and lists formatted correctly
- Links functional

You can add custom Substack styling after import.

---

## Substack API Reference

### Create Post

```bash
POST https://api.substack.com/v1/publications/{publication_id}/posts
```

**Headers:**
```
Authorization: Bearer {api_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Post Title",
  "subtitle": "Post Subtitle",
  "body": "<p>HTML content here</p>",
  "publish_immediately": false,
  "is_draft": true,
  "canonical_url": "https://example.com/original",
  "audience": "everyone",
  "post_date": "2025-01-17"
}
```

**Response:**
```json
{
  "id": "post_abc123",
  "slug": "when-technology-learns-to-listen",
  "post_url": "https://api.substack.com/v1/posts/abc123",
  "web_url": "https://yourpub.substack.com/p/when-technology-learns-to-listen"
}
```

---

## Advanced Usage

### Publishing Multiple Posts

To publish multiple posts, create a batch script:

```typescript
// scripts/publish-batch.ts
const posts = [
  'when-technology-learns-to-listen',
  'next-post-slug',
];

for (const slug of posts) {
  await publishToSubstack(slug);
  await delay(2000); // Rate limiting
}
```

### Scheduling Posts

Substack supports scheduled publishing:

```typescript
const postData = {
  // ... other fields
  publish_immediately: false,
  is_draft: false,
  post_date: '2025-02-01T10:00:00Z', // ISO 8601 format
};
```

### Email Delivery

Control who receives email notifications:

```typescript
audience: 'everyone',      // All subscribers
// OR
audience: 'only_paid',     // Paid subscribers only
// OR
audience: 'founding',      // Founding members only
```

---

## Troubleshooting

### Error: "API key is invalid"

- ✅ Check that `SUBSTACK_API_KEY` is set correctly in `.env.local`
- ✅ Regenerate API key in Substack settings
- ✅ Ensure no extra spaces or quotes around the key

### Error: "Publication not found"

- ✅ Verify `SUBSTACK_PUBLICATION_ID` matches your publication
- ✅ Check that your API key has access to this publication

### Error: "Rate limit exceeded"

- ✅ Wait 60 seconds between requests
- ✅ Add delay between batch publishes
- ✅ Contact Substack support for higher limits

### Images Not Showing

Substack doesn't automatically import images from MDX. You'll need to:

1. Upload images via Substack dashboard
2. Or use publicly accessible image URLs
3. Or manually add images after draft creation

### Tables Not Formatting Well

Substack has limited table support. Consider:

1. Converting tables to bullet lists
2. Using images of tables
3. Linking to full table on your website

---

## Best Practices

### 1. Review Before Publishing

Always publish as draft first to:
- Check formatting
- Add images and embeds
- Verify links
- Preview email rendering

### 2. Set Canonical URLs

Always include canonical URLs to:
- Avoid duplicate content penalties
- Drive traffic to your main site
- Maintain SEO authority

### 3. Maintain Consistency

Keep your Substack and website content in sync:
- Update both when making changes
- Use same titles and subtitles
- Keep canonical URLs accurate

### 4. Backup Your Content

Substack doesn't version control. Keep:
- Original MDX files in git
- Exported HTML backups
- Draft copies before major edits

---

## Integration with Soullab Workflow

### Publishing Flow

1. **Write in MDX** → `app/blog/when-technology-learns-to-listen/page.mdx`
2. **Build locally** → `npm run build` (verify rendering)
3. **Deploy to Vercel** → Git push triggers deployment
4. **Publish to Substack** → `npm run publish:substack`
5. **Review draft** → Add images, finalize formatting
6. **Publish on Substack** → Click "Publish" in dashboard
7. **Cross-promote** → Link from Substack to soullab.life

### SEO Strategy

- **Primary:** soullab.life/blog (canonical)
- **Secondary:** Substack (with canonical tag)
- **Benefit:** Reach Substack audience + maintain SEO authority

---

## Next Steps

1. ✅ Set up API credentials
2. ✅ Test with draft publish
3. ✅ Review draft in Substack
4. ✅ Add images and custom formatting
5. ✅ Publish when ready

For questions or issues, see [Substack API Documentation](https://substack.com/api/docs).
