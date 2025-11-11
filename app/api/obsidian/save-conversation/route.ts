/**
 * Save Conversation to Obsidian Vault
 * Writes conversation transcripts as markdown files to your Obsidian vault
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const OBSIDIAN_VAULT_PATH = path.join(
  os.homedir(),
  'Library/Mobile Documents/iCloud~md~obsidian/Documents/AIN/MAIA Conversations'
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      transcript,
      agentName = 'MAIA',
      messageCount = 0
    } = body;

    // Validation
    if (!transcript) {
      return NextResponse.json(
        { error: 'Missing transcript' },
        { status: 400 }
      );
    }

    // Ensure directory exists
    await fs.mkdir(OBSIDIAN_VAULT_PATH, { recursive: true });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `${agentName} Conversation ${timestamp}.md`;
    const filepath = path.join(OBSIDIAN_VAULT_PATH, filename);

    // Add Obsidian-friendly frontmatter
    const frontmatter = `---
type: conversation
agent: ${agentName}
messageCount: ${messageCount}
created: ${new Date().toISOString()}
tags:
  - maia
  - conversation
  - transcript
---

`;

    const fullContent = frontmatter + transcript;

    // Write file to Obsidian vault
    await fs.writeFile(filepath, fullContent, 'utf-8');

    console.log(`✅ Saved conversation to Obsidian: ${filename}`);

    return NextResponse.json({
      success: true,
      filename,
      path: filepath
    });

  } catch (error: any) {
    console.error('❌ Error saving to Obsidian:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save to Obsidian' },
      { status: 500 }
    );
  }
}
