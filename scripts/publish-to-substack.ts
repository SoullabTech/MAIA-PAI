#!/usr/bin/env tsx

/**
 * Publish to Substack
 *
 * Publishes the "When Technology Learns to Listen" post to Substack
 * using their API.
 *
 * Usage:
 *   npm run publish:substack
 *
 * Environment variables required:
 *   SUBSTACK_API_KEY - Your Substack API key
 *   SUBSTACK_PUBLICATION_ID - Your publication ID
 */

import fs from 'fs';
import path from 'path';

interface SubstackPost {
  title: string;
  subtitle?: string;
  body: string;
  publish_immediately?: boolean;
  is_draft?: boolean;
  canonical_url?: string;
  audience?: 'everyone' | 'only_paid' | 'founding';
  post_date?: string;
}

interface SubstackResponse {
  id: string;
  slug: string;
  post_url: string;
  web_url: string;
}

const SUBSTACK_API_KEY = process.env.SUBSTACK_API_KEY;
const SUBSTACK_PUBLICATION_ID = process.env.SUBSTACK_PUBLICATION_ID;
const SUBSTACK_API_BASE = 'https://api.substack.com/v1';

async function publishToSubstack(postData: SubstackPost): Promise<SubstackResponse> {
  if (!SUBSTACK_API_KEY) {
    throw new Error('SUBSTACK_API_KEY environment variable is required');
  }

  if (!SUBSTACK_PUBLICATION_ID) {
    throw new Error('SUBSTACK_PUBLICATION_ID environment variable is required');
  }

  const response = await fetch(
    `${SUBSTACK_API_BASE}/publications/${SUBSTACK_PUBLICATION_ID}/posts`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUBSTACK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Substack API error: ${response.status} ${error}`);
  }

  return await response.json();
}

function convertMdxToHtml(mdxContent: string): string {
  // Strip front-matter
  const contentWithoutFrontmatter = mdxContent.replace(/^---[\s\S]*?---\n/, '');

  // Convert markdown to HTML (basic conversion)
  let html = contentWithoutFrontmatter
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gim, '<hr />')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    // Tables (basic support)
    .replace(/^\|(.+)\|$/gim, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
    });

  // Wrap in paragraphs
  html = '<p>' + html + '</p>';

  // Clean up multiple paragraph tags
  html = html.replace(/<\/p><p>/g, '\n\n');

  return html;
}

async function main() {
  console.log('📝 Publishing to Substack...\n');

  // Read the blog post
  const blogPostPath = path.join(
    process.cwd(),
    'app/blog/when-technology-learns-to-listen/page.mdx'
  );

  if (!fs.existsSync(blogPostPath)) {
    throw new Error(`Blog post not found at: ${blogPostPath}`);
  }

  const mdxContent = fs.readFileSync(blogPostPath, 'utf-8');

  // Extract front-matter
  const frontmatterMatch = mdxContent.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter: Record<string, string> = {};

  if (frontmatterMatch) {
    const frontmatterLines = frontmatterMatch[1].split('\n');
    frontmatterLines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        frontmatter[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      }
    });
  }

  // Convert MDX to HTML
  const htmlBody = convertMdxToHtml(mdxContent);

  // Prepare post data
  const postData: SubstackPost = {
    title: frontmatter.title || 'When Technology Learns to Listen',
    subtitle: frontmatter.subtitle || 'A new way for wisdom to live on',
    body: htmlBody,
    publish_immediately: false, // Save as draft by default
    is_draft: true,
    canonical_url: frontmatter.canonicalUrl
      ? `https://soullab.life${frontmatter.canonicalUrl}`
      : 'https://soullab.life/partners',
    audience: 'everyone',
  };

  console.log('📄 Post details:');
  console.log(`   Title: ${postData.title}`);
  console.log(`   Subtitle: ${postData.subtitle}`);
  console.log(`   Status: Draft\n`);

  try {
    const result = await publishToSubstack(postData);

    console.log('✅ Successfully published to Substack!\n');
    console.log('📊 Post details:');
    console.log(`   Post ID: ${result.id}`);
    console.log(`   Slug: ${result.slug}`);
    console.log(`   URL: ${result.web_url}\n`);
    console.log('📝 Next steps:');
    console.log('   1. Review the draft in your Substack dashboard');
    console.log('   2. Add any custom formatting or images');
    console.log('   3. Publish when ready');
  } catch (error) {
    console.error('❌ Failed to publish to Substack:', error);
    process.exit(1);
  }
}

main();
