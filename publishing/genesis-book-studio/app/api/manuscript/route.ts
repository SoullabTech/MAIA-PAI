import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'
import { markdownToHTML, getManuscriptStats, extractMetadata } from '@/lib/manuscript-loader'

/**
 * GET /api/manuscript
 * Load the Elemental Alchemy manuscript
 */
export async function GET(request: NextRequest) {
  try {
    // Path to Elemental Alchemy manuscript
    const manuscriptPath = path.join(
      process.cwd(),
      '../elemental-alchemy/source/manuscript.md'
    )

    // Read the file
    const markdown = readFileSync(manuscriptPath, 'utf-8')

    // Extract metadata
    const { title, author } = extractMetadata(markdown)
    const stats = getManuscriptStats(markdown)

    // Convert to HTML
    const html = markdownToHTML(markdown)

    return NextResponse.json({
      success: true,
      data: {
        html,
        title,
        author,
        metadata: stats,
      },
    })
  } catch (error) {
    console.error('Error loading manuscript:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load manuscript',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
