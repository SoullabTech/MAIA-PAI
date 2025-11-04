#!/usr/bin/env tsx
/**
 * Library of Alexandria - Wisdom Import Script
 *
 * Imports wisdom files (PDFs, markdown, text) into the knowledge base
 * with proper chunking, metadata, and semantic embeddings.
 *
 * Usage:
 *   npm run import:wisdom                              # Import all
 *   npm run import:wisdom -- --category=spiralogic     # Import category
 *   npm run import:wisdom -- --file=path/to/file.pdf   # Import single file
 *   npm run import:wisdom -- --dry-run                 # Test mode
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';
import OpenAI from 'openai';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const LIBRARY_PATH = process.env.LIBRARY_OF_ALEXANDRIA_PATH ||
  '/Users/soullab/Library-of-Alexandria';

const CHUNK_SIZE = 1000; // Target words per chunk
const CHUNK_OVERLAP = 100; // Words to overlap between chunks

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiKey = process.env.OPENAI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface WisdomMetadata {
  category?: string;
  author?: string;
  tradition?: string;
  topics?: string[];
  spiralogic_levels?: number[];
  elements?: string[];
  teaching_style?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface ProcessedChunk {
  file_path: string;
  file_name: string;
  vault_name: string;
  content: string;
  chunk_index: number;
  keywords: string[];
  concepts: string[];
  category?: string;
  level?: number;
  element?: string;
  embedding?: number[];
}

// ═══════════════════════════════════════════════════════════════
// FILE PROCESSING
// ═══════════════════════════════════════════════════════════════

/**
 * Read metadata.json from folder
 */
function loadMetadata(folderPath: string): WisdomMetadata {
  const metadataPath = join(folderPath, 'metadata.json');
  if (existsSync(metadataPath)) {
    const content = readFileSync(metadataPath, 'utf-8');
    return JSON.parse(content);
  }
  return {};
}

/**
 * Process markdown file
 */
function processMarkdown(filePath: string, metadata: WisdomMetadata): string {
  const content = readFileSync(filePath, 'utf-8');

  // Strip YAML frontmatter if present
  const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');

  // Convert WikiLinks to plain text for now
  const withoutWikiLinks = withoutFrontmatter.replace(/\[\[(.*?)\]\]/g, '$1');

  return withoutWikiLinks.trim();
}

/**
 * Process text file
 */
function processText(filePath: string, metadata: WisdomMetadata): string {
  return readFileSync(filePath, 'utf-8').trim();
}

/**
 * Process PDF file (placeholder - requires pdf-parse package)
 */
async function processPDF(filePath: string, metadata: WisdomMetadata): Promise<string> {
  // TODO: Implement PDF parsing with pdf-parse
  // For now, return placeholder
  console.log(`   ⚠️  PDF processing not yet implemented: ${basename(filePath)}`);
  console.log(`       Install: npm install pdf-parse`);
  console.log(`       Then uncomment PDF processing code`);
  return '';

  /* Uncomment when pdf-parse is installed:
  const pdfParse = require('pdf-parse');
  const dataBuffer = readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
  */
}

/**
 * Chunk text intelligently
 */
function chunkText(text: string, targetSize: number = CHUNK_SIZE, overlap: number = CHUNK_OVERLAP): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + targetSize).join(' ');
    chunks.push(chunk);
    i += (targetSize - overlap);
  }

  return chunks.filter(c => c.trim().length > 0);
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  // Simple keyword extraction - take capitalized words and frequent terms
  const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const frequency: { [key: string]: number } = {};

  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Get top 10 most frequent words
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

/**
 * Extract concepts (spiralogic terms, elements, etc.)
 */
function extractConcepts(text: string, metadata: WisdomMetadata): string[] {
  const concepts: string[] = [];
  const lowerText = text.toLowerCase();

  // Spiralogic concepts
  const spiralogicTerms = ['spiralogic', 'spiral', 'developmental', 'stage', 'level', 'evolution'];
  spiralogicTerms.forEach(term => {
    if (lowerText.includes(term)) concepts.push(term);
  });

  // Elements
  const elements = ['fire', 'water', 'earth', 'air', 'aether'];
  elements.forEach(element => {
    if (lowerText.includes(element)) concepts.push(element);
  });

  // Sacred Witness
  const witnessTerms = ['witness', 'witnessing', 'holding space', 'sacred witness'];
  witnessTerms.forEach(term => {
    if (lowerText.includes(term)) concepts.push(term.replace(/\s+/g, '_'));
  });

  // Shadow work
  const shadowTerms = ['shadow', 'projection', 'disowned', 'integration'];
  shadowTerms.forEach(term => {
    if (lowerText.includes(term)) concepts.push(term);
  });

  // Add metadata topics
  if (metadata.topics) {
    concepts.push(...metadata.topics);
  }

  return [...new Set(concepts)];
}

/**
 * Generate embedding for text
 */
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.slice(0, 8000), // Limit to ~8K chars for embedding
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('   ❌ Failed to generate embedding:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN IMPORT LOGIC
// ═══════════════════════════════════════════════════════════════

/**
 * Process single file
 */
async function processFile(
  filePath: string,
  vaultName: string,
  metadata: WisdomMetadata,
  dryRun: boolean = false
): Promise<ProcessedChunk[]> {

  const fileName = basename(filePath);
  const ext = extname(filePath).toLowerCase();

  console.log(`\n📄 Processing: ${fileName}`);

  let text = '';

  // Process based on file type
  if (ext === '.md') {
    text = processMarkdown(filePath, metadata);
  } else if (ext === '.txt') {
    text = processText(filePath, metadata);
  } else if (ext === '.pdf') {
    text = await processPDF(filePath, metadata);
  } else {
    console.log(`   ⚠️  Unsupported file type: ${ext}`);
    return [];
  }

  if (!text) {
    console.log(`   ⚠️  No text extracted`);
    return [];
  }

  // Chunk the text
  const chunks = chunkText(text);
  console.log(`   ✂️  Created ${chunks.length} chunks`);

  // Process each chunk
  const processedChunks: ProcessedChunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const content = chunks[i];
    const keywords = extractKeywords(content);
    const concepts = extractConcepts(content, metadata);

    // Generate embedding (expensive - skip in dry run)
    let embedding: number[] | undefined;
    if (!dryRun) {
      embedding = await generateEmbedding(content);
      console.log(`   🧠 Generated embedding for chunk ${i + 1}/${chunks.length}`);
    }

    processedChunks.push({
      file_path: filePath,
      file_name: fileName,
      vault_name: vaultName,
      content,
      chunk_index: i,
      keywords,
      concepts,
      category: metadata.category,
      level: metadata.spiralogic_levels?.[0],
      element: metadata.elements?.[0],
      embedding
    });
  }

  console.log(`   ✅ Processed ${processedChunks.length} chunks`);

  return processedChunks;
}

/**
 * Import chunks to Supabase
 */
async function importChunks(chunks: ProcessedChunk[], dryRun: boolean = false): Promise<number> {
  if (dryRun) {
    console.log(`\n🔍 [DRY RUN] Would import ${chunks.length} chunks`);
    return chunks.length;
  }

  console.log(`\n💾 Importing ${chunks.length} chunks to Supabase...`);

  // Batch insert - use small batches due to large embedding vectors (1536 dimensions each)
  const batchSize = 10;
  let imported = 0;
  let failed = 0;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);

    try {
      const { error } = await supabase
        .from('file_chunks')
        .insert(batch);

      if (error) {
        console.error(`   ❌ Batch ${i}-${i + batch.length} failed:`, error.message);
        failed += batch.length;
      } else {
        imported += batch.length;
        if (imported % 100 === 0 || i + batchSize >= chunks.length) {
          console.log(`   ✅ Imported ${imported}/${chunks.length} chunks (${failed} failed)`);
        }
      }
    } catch (err) {
      console.error(`   ❌ Batch ${i}-${i + batch.length} exception:`, err instanceof Error ? err.message : String(err));
      failed += batch.length;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  return imported;
}

/**
 * Walk directory tree and process all files
 */
async function walkDirectory(
  dirPath: string,
  vaultName: string,
  category?: string,
  dryRun: boolean = false
): Promise<ProcessedChunk[]> {

  const allChunks: ProcessedChunk[] = [];

  // Load metadata for this directory
  const metadata = loadMetadata(dirPath);

  // Get all files in directory
  const entries = readdirSync(dirPath);

  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Recurse into subdirectory
      const subChunks = await walkDirectory(fullPath, vaultName, category, dryRun);
      allChunks.push(...subChunks);
    } else if (stat.isFile()) {
      // Skip metadata.json
      if (entry === 'metadata.json') continue;

      // Filter by category if specified
      if (category && metadata.category !== category) continue;

      // Process file
      const chunks = await processFile(fullPath, vaultName, metadata, dryRun);
      allChunks.push(...chunks);
    }
  }

  return allChunks;
}

// ═══════════════════════════════════════════════════════════════
// CLI INTERFACE
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║  📚 LIBRARY OF ALEXANDRIA - WISDOM IMPORT                          ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  // Parse CLI arguments
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const categoryArg = args.find(arg => arg.startsWith('--category='));
  const fileArg = args.find(arg => arg.startsWith('--file='));

  const category = categoryArg?.split('=')[1];
  const singleFile = fileArg?.split('=')[1];

  console.log(`📁 Library Path: ${LIBRARY_PATH}`);
  if (category) console.log(`🏷️  Category Filter: ${category}`);
  if (singleFile) console.log(`📄 Single File: ${singleFile}`);
  if (dryRun) console.log(`🔍 Mode: DRY RUN (no database writes)\n`);
  else console.log(`💾 Mode: LIVE IMPORT\n`);

  // Check if library exists
  if (!existsSync(LIBRARY_PATH)) {
    console.error(`❌ Library not found at: ${LIBRARY_PATH}`);
    console.error(`\nCreate the folder structure first!`);
    console.error(`See: docs/WISDOM_IMPORT_GUIDE.md\n`);
    process.exit(1);
  }

  let allChunks: ProcessedChunk[] = [];

  // Import single file or walk directory
  if (singleFile) {
    const metadata = loadMetadata(LIBRARY_PATH);
    const chunks = await processFile(singleFile, 'custom', metadata, dryRun);
    allChunks = chunks;
  } else {
    allChunks = await walkDirectory(LIBRARY_PATH, 'alexandria', category, dryRun);
  }

  // Import to database
  const imported = await importChunks(allChunks, dryRun);

  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ IMPORT COMPLETE                                                ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');
  console.log(`   📊 Total chunks: ${allChunks.length}`);
  console.log(`   💾 Imported: ${imported}`);
  console.log(`   🧠 Embeddings: ${dryRun ? 'Skipped (dry run)' : 'Generated'}\n`);

  if (dryRun) {
    console.log('🔍 This was a dry run. Run without --dry-run to actually import.\n');
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { processFile, importChunks, walkDirectory };
