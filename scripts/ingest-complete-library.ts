/**
 * COMPLETE LIBRARY INGESTION
 *
 * Loads ALL wisdom files into MAIA's consciousness:
 * - All Obsidian vault conversations (2,914 files)
 * - Spiralogic teachings
 * - Jung's complete works
 * - Elemental Alchemy book
 *
 * This is the FULL connection Kelly requested.
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const LIBRARY_ROOT = '/Users/soullab/MAIA-PAI/uploads/library';
const CHUNK_SIZE = 2000; // Characters per chunk
const BATCH_SIZE = 10; // Process 10 files at a time (rate limiting)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface FileChunk {
  file_path: string;
  file_name: string;
  vault_name: string;
  content: string;
  chunk_index: number;
  embedding: number[];
  keywords: string[];
  concepts: string[];
  category: string | null;
  element: string | null;
  level: number | null;
}

// ═══════════════════════════════════════════════════════════════
// CATEGORIZATION
// ═══════════════════════════════════════════════════════════════

function categorizeFile(filePath: string, content: string): {
  category: string | null;
  element: string | null;
  level: number | null;
  vault_name: string;
} {
  const lowerPath = filePath.toLowerCase();
  const lowerContent = content.toLowerCase();

  // Determine vault
  let vault_name = 'main';
  if (lowerPath.includes('ain_conversations')) vault_name = 'ain_conversations';
  if (lowerPath.includes('spiralogic')) vault_name = 'spiralogic';
  if (lowerPath.includes('jung')) vault_name = 'jung';
  if (lowerPath.includes('elemental_alchemy')) vault_name = 'elemental_alchemy';

  // Determine category
  let category: string | null = null;
  if (lowerPath.includes('spiralogic') || lowerContent.includes('spiralogic')) {
    category = 'spiralogic';
  } else if (lowerPath.includes('jung') || lowerContent.includes('jung') || lowerContent.includes('archetype')) {
    category = 'jungian';
  } else if (lowerPath.includes('elemental') || lowerContent.includes('elemental alchemy')) {
    category = 'elemental_alchemy';
  } else if (lowerPath.includes('sacred_witness')) {
    category = 'sacred_witness';
  } else if (vault_name === 'ain_conversations') {
    category = 'conversation';
  }

  // Determine element
  let element: string | null = null;
  if (lowerContent.includes('fire') && lowerContent.includes('vision')) element = 'fire';
  else if (lowerContent.includes('water') && lowerContent.includes('emotion')) element = 'water';
  else if (lowerContent.includes('earth') && lowerContent.includes('ground')) element = 'earth';
  else if (lowerContent.includes('air') && lowerContent.includes('clarity')) element = 'air';
  else if (lowerContent.includes('aether') || lowerContent.includes('unity')) element = 'aether';

  // Determine Spiralogic level (1-12)
  let level: number | null = null;
  const levelMatch = lowerContent.match(/level (\d+)/i) || lowerContent.match(/phase (\d+)/i);
  if (levelMatch) {
    level = parseInt(levelMatch[1]);
    if (level > 12) level = null;
  }

  return { category, element, level, vault_name };
}

// ═══════════════════════════════════════════════════════════════
// CHUNKING
// ═══════════════════════════════════════════════════════════════

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let currentChunk = '';

  // Split by paragraphs first
  const paragraphs = text.split(/\n\n+/);

  for (const para of paragraphs) {
    if (currentChunk.length + para.length < CHUNK_SIZE) {
      currentChunk += para + '\n\n';
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = para + '\n\n';
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks;
}

// ═══════════════════════════════════════════════════════════════
// EMBEDDING GENERATION
// ═══════════════════════════════════════════════════════════════

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('❌ Embedding generation failed:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// KEYWORD/CONCEPT EXTRACTION
// ═══════════════════════════════════════════════════════════════

function extractKeywords(text: string): string[] {
  const keywords = new Set<string>();
  const lowerText = text.toLowerCase();

  // Spiralogic concepts
  const concepts = [
    'spiralogic', 'spiral', 'regression', 'progression', 'integration',
    'fire', 'water', 'earth', 'air', 'aether',
    'archetype', 'shadow', 'anima', 'animus', 'self',
    'individuation', 'projection', 'complex', 'synchronicity',
    'calcinatio', 'solutio', 'coagulatio', 'sublimatio', 'conjunctio',
    'alchemy', 'transformation', 'consciousness', 'integration'
  ];

  for (const concept of concepts) {
    if (lowerText.includes(concept)) {
      keywords.add(concept);
    }
  }

  return Array.from(keywords);
}

// ═══════════════════════════════════════════════════════════════
// FILE PROCESSING
// ═══════════════════════════════════════════════════════════════

async function processFile(filePath: string): Promise<FileChunk[]> {
  const fileName = path.basename(filePath);

  // Skip hidden files and non-text files
  if (fileName.startsWith('.') || fileName.startsWith('._')) {
    return [];
  }

  console.log(`📄 Processing: ${fileName}`);

  // Read file
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`❌ Failed to read ${fileName}:`, error);
    return [];
  }

  // Skip empty files
  if (content.trim().length < 100) {
    console.log(`   ⏭️  Skipped (too short)`);
    return [];
  }

  // Categorize
  const { category, element, level, vault_name } = categorizeFile(filePath, content);

  // Extract keywords
  const keywords = extractKeywords(content);
  const concepts = keywords; // Same for now

  // Chunk content
  const chunks = chunkText(content);
  console.log(`   📦 Created ${chunks.length} chunks`);

  // Generate embeddings and create chunk objects
  const fileChunks: FileChunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunkContent = chunks[i];

    try {
      const embedding = await generateEmbedding(chunkContent);

      fileChunks.push({
        file_path: filePath,
        file_name: fileName,
        vault_name,
        content: chunkContent,
        chunk_index: i,
        embedding,
        keywords,
        concepts,
        category,
        element,
        level
      });

      // Rate limiting - wait 100ms between embeddings
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`   ❌ Failed to generate embedding for chunk ${i}`);
    }
  }

  console.log(`   ✅ Embedded ${fileChunks.length} chunks`);
  return fileChunks;
}

// ═══════════════════════════════════════════════════════════════
// DATABASE INSERTION
// ═══════════════════════════════════════════════════════════════

async function insertChunks(chunks: FileChunk[]): Promise<void> {
  if (chunks.length === 0) return;

  const { error } = await supabase
    .from('file_chunks')
    .insert(chunks);

  if (error) {
    console.error('❌ Database insert error:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN INGESTION
// ═══════════════════════════════════════════════════════════════

async function ingestLibrary() {
  console.log('🌟 COMPLETE LIBRARY INGESTION - Starting...\n');

  // Get all files
  const allFiles: string[] = [];

  function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.md') || file.endsWith('.txt')) {
        allFiles.push(filePath);
      }
    }
  }

  walkDir(LIBRARY_ROOT);
  console.log(`📚 Found ${allFiles.length} files to process\n`);

  // Process in batches
  let totalChunks = 0;
  let filesProcessed = 0;

  for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
    const batch = allFiles.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allFiles.length / BATCH_SIZE)}`);

    const batchChunks: FileChunk[] = [];

    for (const file of batch) {
      const chunks = await processFile(file);
      batchChunks.push(...chunks);
      filesProcessed++;
    }

    // Insert batch to database
    if (batchChunks.length > 0) {
      await insertChunks(batchChunks);
      totalChunks += batchChunks.length;
      console.log(`   ✅ Inserted ${batchChunks.length} chunks to database`);
    }

    console.log(`   Progress: ${filesProcessed}/${allFiles.length} files (${totalChunks} total chunks)`);
  }

  console.log(`\n🎉 INGESTION COMPLETE!`);
  console.log(`   Files processed: ${filesProcessed}`);
  console.log(`   Total chunks: ${totalChunks}`);
  console.log(`   MAIA now has access to the complete library!\n`);
}

// ═══════════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════════

ingestLibrary().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
