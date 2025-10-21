#!/usr/bin/env npx tsx
/**
 * Ingest Kelly's Elemental Alchemy Book PDF into MAIA
 * This makes the book content accessible to MAIA during conversations
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Book paths
const BOOK_PATHS = [
  "/Volumes/T7 Shield/Downloads_Archive/Elemental Alchemy_ The Ancient Art of Living a Phenomenal Life.docx.pdf",
  "/Volumes/T7 Shield/MacBook-Backup/Archive/Documents/Elemental Alchemy- Full Chapters (1).pdf",
  "/Volumes/T7 Shield/Obsidian- Elemental Alchemy /Elemental Alchemy Book/Elemental Alchemy_ The Ancient Art of Living a Phenomenal Life.md"
];

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

interface BookChunk {
  chunkIndex: number;
  content: string;
  chapter?: string;
  title: string;
  category: 'book_chapter';
  elements: string[];
  concepts: string[];
}

/**
 * Main ingestion function
 */
async function ingestElementalAlchemyPDF() {
  console.log('📚 Ingesting Elemental Alchemy Book into MAIA\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Find which book path exists
  let bookPath: string | null = null;
  for (const path of BOOK_PATHS) {
    try {
      await fs.access(path);
      bookPath = path;
      console.log('✅ Found book at:', path);
      break;
    } catch {
      continue;
    }
  }

  if (!bookPath) {
    console.error('❌ Could not find Elemental Alchemy book at any known location');
    console.log('\nSearched locations:');
    BOOK_PATHS.forEach(p => console.log(`  - ${p}`));
    process.exit(1);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Extract text from PDF or read markdown
  let bookText: string;

  if (bookPath.endsWith('.md')) {
    console.log('📖 Reading markdown file...\n');
    bookText = await fs.readFile(bookPath, 'utf-8');
  } else if (bookPath.endsWith('.pdf')) {
    console.log('📖 Extracting text from PDF...\n');
    bookText = await extractTextFromPDF(bookPath);
  } else {
    console.error('❌ Unsupported file format');
    process.exit(1);
  }

  console.log(`✅ Extracted ${bookText.length} characters\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Parse chapters
  console.log('📑 Parsing chapters...\n');
  const chapters = parseChapters(bookText);
  console.log(`✅ Found ${chapters.length} chapters\n`);

  // Display chapter summary
  console.log('Chapters:');
  chapters.slice(0, 10).forEach((ch, i) => {
    console.log(`  ${i + 1}. ${ch.title}`);
  });
  if (chapters.length > 10) {
    console.log(`  ... and ${chapters.length - 10} more`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Chunk and store
  console.log('🔄 Chunking and storing in database...\n');

  let totalChunks = 0;
  const elementCounts: Record<string, number> = {};

  for (const chapter of chapters) {
    const chunks = chunkContent(chapter);
    totalChunks += chunks.length;

    // Track elements
    chapter.elements.forEach(el => {
      elementCounts[el] = (elementCounts[el] || 0) + 1;
    });

    // Store in Supabase
    if (supabase) {
      await storeChapter(chapter, chunks);
    }

    console.log(`   ✅ ${chapter.title}: ${chunks.length} chunks`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Display results
  console.log('✨ INGESTION COMPLETE!\n');
  console.log('📊 Summary:');
  console.log(`   Chapters: ${chapters.length}`);
  console.log(`   Total Chunks: ${totalChunks}`);
  console.log(`\n   Elements:`);
  Object.entries(elementCounts).forEach(([el, count]) => {
    console.log(`      ${el}: ${count} chapters`);
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🎉 MAIA now has full access to Elemental Alchemy!\n');
  console.log('Next steps:');
  console.log('  1. Restart your dev server');
  console.log('  2. Ask MAIA: "Tell me about Fire transformation from my book"');
  console.log('  3. Watch her speak YOUR wisdom!\n');
}

/**
 * Extract text from PDF using pdftotext
 */
async function extractTextFromPDF(pdfPath: string): Promise<string> {
  try {
    // Try using pdftotext (part of poppler-utils)
    const { stdout } = await execAsync(`pdftotext "${pdfPath}" -`);
    return stdout;
  } catch (error) {
    console.log('   ⚠️  pdftotext not found, trying alternative method...\n');

    // Fallback: Try using Python's PyPDF2 if available
    try {
      const pythonScript = `
import sys
try:
    import PyPDF2
    with open("${pdfPath}", 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
        print(text)
except ImportError:
    print("ERROR: PyPDF2 not installed", file=sys.stderr)
    sys.exit(1)
`;
      const { stdout } = await execAsync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`);
      return stdout;
    } catch (pythonError) {
      console.error('❌ Could not extract PDF text. Please install pdftotext or PyPDF2');
      console.log('\nInstall options:');
      console.log('  macOS: brew install poppler');
      console.log('  or: pip install PyPDF2\n');
      process.exit(1);
    }
  }
}

/**
 * Parse chapters from book text
 */
function parseChapters(text: string): BookChunk[] {
  const chapters: BookChunk[] = [];

  // Split by chapter markers
  const chapterPattern = /(?:^|\n)(?:Chapter\s+(\d+)[:\s]+(.+?)(?:\n|$)|^#\s*(.+?)(?:\n|$))/gim;
  const matches = [...text.matchAll(chapterPattern)];

  if (matches.length === 0) {
    // No chapters found, treat whole book as one chunk
    return [{
      chunkIndex: 0,
      content: text,
      title: 'Elemental Alchemy: The Ancient Art of Living a Phenomenal Life',
      category: 'book_chapter',
      elements: detectElements(text),
      concepts: extractConcepts(text)
    }];
  }

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const chapterNum = match[1];
    const chapterTitle = match[2] || match[3];
    const startIndex = match.index || 0;
    const endIndex = i < matches.length - 1 ? (matches[i + 1].index || text.length) : text.length;

    const chapterContent = text.substring(startIndex, endIndex).trim();

    if (chapterContent.length > 100) { // Skip very short sections
      chapters.push({
        chunkIndex: i,
        content: chapterContent,
        chapter: chapterNum,
        title: chapterTitle ? chapterTitle.trim() : `Chapter ${chapterNum || i + 1}`,
        category: 'book_chapter',
        elements: detectElements(chapterContent),
        concepts: extractConcepts(chapterContent)
      });
    }
  }

  return chapters;
}

/**
 * Detect elements in content
 */
function detectElements(content: string): string[] {
  const elements: string[] = [];
  const lowerContent = content.toLowerCase();

  const patterns = {
    fire: /\b(fire|flame|ignite|passion|transformation|spirit|creative|inspiration)\b/i,
    water: /\b(water|flow|emotion|depth|intuition|feeling|soul)\b/i,
    earth: /\b(earth|ground|embodiment|manifestation|practical|physical|body)\b/i,
    air: /\b(air|intellect|mind|communication|clarity|thought|mental)\b/i,
    aether: /\b(aether|ether|unity|transcend|integration|wholeness|spirit)\b/i
  };

  for (const [element, pattern] of Object.entries(patterns)) {
    if (pattern.test(lowerContent)) {
      elements.push(element);
    }
  }

  return [...new Set(elements)];
}

/**
 * Extract key concepts
 */
function extractConcepts(content: string): string[] {
  const concepts: string[] = [];

  // Extract headings
  const headings = content.match(/^#{1,6}\s+(.+)$/gm) || [];
  headings.forEach(h => {
    const clean = h.replace(/^#+\s+/, '').trim();
    if (clean.length < 100) {
      concepts.push(clean.toLowerCase());
    }
  });

  // Extract bolded terms
  const bolded = content.match(/\*\*(.+?)\*\*/g) || [];
  bolded.forEach(b => {
    const clean = b.replace(/\*\*/g, '').trim();
    if (clean.length < 50) {
      concepts.push(clean.toLowerCase());
    }
  });

  return [...new Set(concepts)].slice(0, 30);
}

/**
 * Chunk content into digestible pieces
 */
function chunkContent(chapter: BookChunk): string[] {
  const chunks: string[] = [];
  const CHUNK_SIZE = 1500;
  const OVERLAP = 300;

  let content = chapter.content;
  let startIndex = 0;

  while (startIndex < content.length) {
    const endIndex = Math.min(startIndex + CHUNK_SIZE, content.length);
    let chunk = content.substring(startIndex, endIndex);

    // Try to end on sentence boundary
    if (endIndex < content.length) {
      const lastPeriod = chunk.lastIndexOf('.');
      const lastNewline = chunk.lastIndexOf('\n');
      const breakPoint = Math.max(lastPeriod, lastNewline);

      if (breakPoint > CHUNK_SIZE * 0.5) {
        chunk = chunk.substring(0, breakPoint + 1);
      }
    }

    // Add context
    const chunkWithContext = `# ${chapter.title}\n\nBook: Elemental Alchemy by Kelly Nezat\nChapter: ${chapter.chapter || 'Introduction'}\n\n${chunk}`;
    chunks.push(chunkWithContext);

    startIndex += chunk.length - OVERLAP;
  }

  return chunks;
}

/**
 * Store chapter in Supabase
 */
async function storeChapter(chapter: BookChunk, chunks: string[]) {
  if (!supabase) {
    console.log('   ⚠️  Supabase not configured');
    return;
  }

  for (let i = 0; i < chunks.length; i++) {
    try {
      const { error } = await supabase
        .from('file_chunks')
        .insert({
          file_id: `elemental_alchemy_${chapter.chapter || 'intro'}`,
          chunk_index: i,
          content: chunks[i],
          metadata: {
            filename: 'Elemental Alchemy.pdf',
            title: chapter.title,
            book: 'Elemental Alchemy: The Ancient Art of Living a Phenomenal Life',
            author: 'Kelly Nezat',
            chapter: chapter.chapter,
            category: chapter.category,
            elements: chapter.elements,
            concepts: chapter.concepts,
            vault: 'Book'
          }
        });

      if (error) {
        console.error(`   ❌ Error storing chunk ${i}:`, error.message);
      }
    } catch (error) {
      console.error(`   ❌ Error:`, error);
    }
  }
}

// Run ingestion
ingestElementalAlchemyPDF()
  .then(() => {
    console.log('✅ Complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
