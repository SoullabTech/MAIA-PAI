/**
 * Manuscript Loader Utility
 * Converts Elemental Alchemy markdown manuscript to HTML for TipTap editor
 */

export interface ManuscriptData {
  html: string
  title: string
  author: string
  metadata: {
    wordCount: number
    characterCount: number
    imageCount: number
  }
}

/**
 * Convert markdown to HTML for TipTap
 * Basic conversion - in future, use a full markdown parser
 */
export function markdownToHTML(markdown: string): string {
  let html = markdown

  // Headers (## -> h2, ### -> h3, etc)
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>')
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>')
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>')

  // Bold and Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, '<blockquote><p>$1</p></blockquote>')

  // Image placeholders - convert ![][imageN] to placeholder
  html = html.replace(/!\[\]\[image(\d+)\]/g, (match, num) => {
    return `<p class="image-placeholder">[Image ${num} placeholder - Add illustration here]</p>`
  })

  // Links - basic [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')

  // Paragraphs - split by double newlines
  const paragraphs = html.split('\n\n').map(p => {
    const trimmed = p.trim()
    // Skip if already wrapped in tag
    if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') || trimmed.startsWith('<p')) {
      return trimmed
    }
    // Skip empty
    if (!trimmed) return ''
    // Wrap in paragraph
    return `<p>${trimmed}</p>`
  })

  html = paragraphs.join('\n')

  return html
}

/**
 * Get manuscript statistics
 */
export function getManuscriptStats(text: string) {
  const wordCount = text.split(/\s+/).filter(Boolean).length
  const characterCount = text.length
  const imageCount = (text.match(/!\[\]\[image\d+\]/g) || []).length

  return {
    wordCount,
    characterCount,
    imageCount,
  }
}

/**
 * Extract title and author from manuscript
 */
export function extractMetadata(markdown: string) {
  const lines = markdown.split('\n').filter(Boolean)

  // First ## heading is usually the title
  const titleMatch = markdown.match(/^## (.*?)$/m)
  const title = titleMatch ? titleMatch[1] : 'Untitled'

  // Author is typically after title
  const author = lines[2] || 'Unknown Author'

  return { title, author }
}
