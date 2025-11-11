#!/usr/bin/env node
/**
 * PHASE 1A: SOVEREIGNTY - WISDOM LIBRARY INGESTION
 *
 * Ingests MAIA's 50-book reference library into local vector database
 *
 * What this does:
 * 1. Loads tier3-complete-reference-library.txt (50 books, 229k words)
 * 2. Splits into searchable chunks
 * 3. Generates embeddings (OpenAI text-embedding-3-small)
 * 4. Stores in Qdrant vector database
 *
 * Result:
 * - Semantic search over all wisdom texts
 * - Retrieve only relevant 20k tokens per session (vs 332k full prompt)
 * - 70% cost reduction
 *
 * Usage:
 *   npm run sovereignty:ingest
 */

import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { LocalVectorDB } from '../../lib/sovereignty/LocalVectorDB';

// ================================================================
// CONFIGURATION
// ================================================================

const LIBRARY_PATH = path.join(__dirname, '../../prompts/revival/tier3-complete-reference-library.txt');
const MANIFEST_PATH = path.join(__dirname, '../../prompts/revival/tier3-reference-library-manifest.json');

// ================================================================
// PARSE LIBRARY FILE
// ================================================================

interface BookSection {
  id: string;
  title: string;
  author?: string;
  category: string;
  content: string;
  metadata: {
    wordCount: number;
    topics: string[];
    relevanceScore: number;
  };
}

/**
 * Parse the formatted library file into book sections
 */
async function parseLibraryFile(): Promise<BookSection[]> {
  console.log('📖 [INGEST] Parsing library file...');

  // Load manifest
  const manifestContent = await fs.readFile(MANIFEST_PATH, 'utf-8');
  const manifest = JSON.parse(manifestContent);

  console.log(`   Found ${manifest.totalBooks} books in manifest`);

  // Load library content
  const libraryContent = await fs.readFile(LIBRARY_PATH, 'utf-8');

  // Split by book boundaries (look for patterns like "## Book N: Title")
  const bookMatches = libraryContent.matchAll(/## (?:Book \d+: )?(.+?)(?:\n(?:by|By) (.+?))?\n\n/g);
  const books: BookSection[] = [];

  let lastIndex = 0;
  let currentBook = 0;

  for (const match of bookMatches) {
    // Save previous book content
    if (currentBook > 0 && lastIndex > 0) {
      const content = libraryContent.substring(lastIndex, match.index).trim();
      if (books[currentBook - 1]) {
        books[currentBook - 1].content = content;
      }
    }

    // Extract book metadata
    const title = match[1].trim();
    const author = match[2]?.trim();

    // Find matching book in manifest
    const manifestBook = manifest.books.find((b: any) =>
      b.title.toLowerCase().includes(title.toLowerCase()) ||
      title.toLowerCase().includes(b.title.toLowerCase())
    );

    books.push({
      id: manifestBook?.id || `book_${currentBook + 1}`,
      title: manifestBook?.title || title,
      author: manifestBook?.author || author,
      category: manifestBook?.category || 'general',
      content: '', // Will be filled in next iteration
      metadata: {
        wordCount: manifestBook?.wordCount || 0,
        topics: manifestBook?.topics || [],
        relevanceScore: manifestBook?.relevanceScore || 0.5,
      },
    });

    lastIndex = match.index! + match[0].length;
    currentBook++;
  }

  // Add content for last book
  if (books.length > 0) {
    books[books.length - 1].content = libraryContent.substring(lastIndex).trim();
  }

  console.log(`✅ [INGEST] Parsed ${books.length} books`);

  return books.filter(b => b.content.length > 100); // Filter out empty sections
}

// ================================================================
// MAIN INGESTION
// ================================================================

async function ingestWisdomLibrary() {
  console.log('🚀 [SOVEREIGNTY] Starting wisdom library ingestion\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Step 1: Parse library file
    const books = await parseLibraryFile();

    if (books.length === 0) {
      throw new Error('No books found in library file');
    }

    // Step 2: Initialize vector database
    console.log('\n🔧 [INGEST] Initializing vector database...');
    const vectorDB = new LocalVectorDB();
    await vectorDB.initialize();

    // Step 3: Ingest books
    console.log('\n📚 [INGEST] Ingesting books into vector database...\n');

    const sources = books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      content: book.content,
      metadata: book.metadata,
    }));

    await vectorDB.ingestWisdom(sources);

    // Step 4: Verify ingestion
    console.log('\n📊 [INGEST] Verifying ingestion...');
    const stats = await vectorDB.getStats();

    console.log(`   Total chunks: ${stats.totalChunks.toLocaleString()}`);
    console.log(`   Estimated size: ${Math.round(stats.totalChunks * 1.5)} KB`);

    // Step 5: Test retrieval
    console.log('\n🧪 [INGEST] Testing retrieval...');
    const testResult = await vectorDB.retrieve({
      query: 'shadow work and individuation',
      maxTokens: 5000,
    });

    console.log(`   Retrieved: ${testResult.tokenCount.toLocaleString()} tokens`);
    console.log(`   Sources: ${testResult.sources.slice(0, 5).map(s => s.title).join(', ')}...`);

    // Success!
    console.log('\n═══════════════════════════════════════════════════════════\n');
    console.log('✨ [SOVEREIGNTY] Wisdom library ingestion complete!\n');
    console.log('Next steps:');
    console.log('1. Run: npm run sovereignty:test');
    console.log('2. Compare retrieval quality vs full prompt');
    console.log('3. Integrate into MaiaRevivalSystem.ts');
    console.log('\n═══════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ [INGEST] Ingestion failed:', error);
    process.exit(1);
  }
}

// ================================================================
// RUN
// ================================================================

ingestWisdomLibrary();
