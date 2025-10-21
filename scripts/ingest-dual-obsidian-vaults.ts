#!/usr/bin/env npx tsx
/**
 * Dual Obsidian Vault Integration for MAIA
 * Ingests content from BOTH vaults into MAIA's IP Engine
 *
 * Vaults:
 * 1. AIN Consciousness Intelligence System - Technical/system documentation
 * 2. Soullab Dev Team - Kelly's IP, teachings, and team knowledge
 */

import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';

// Vault paths from environment
const VAULT_AIN = process.env.OBSIDIAN_VAULT_PATH ||
  "/Volumes/T7 Shield/Soullab Dev Team Vault/AIN Consciousness Intelligence System";
const VAULT_SOULLAB = process.env.OBSIDIAN_VAULT_SOULLAB_PATH ||
  "/Volumes/T7 Shield/ObsidianVaults/SoullabDevTeam";

// Supabase client (assumes you have SUPABASE env vars configured)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

interface VaultStats {
  vaultName: string;
  totalFiles: number;
  processedFiles: number;
  totalChunks: number;
  categories: Record<string, number>;
  elements: Record<string, number>;
}

interface ProcessedNote {
  filename: string;
  title: string;
  content: string;
  frontmatter: any;
  category: string;
  elements: string[];
  concepts: string[];
  vault: 'AIN' | 'Soullab';
}

/**
 * Main ingestion function
 */
async function ingestDualVaults() {
  console.log('🌀 MAIA Dual Obsidian Vault Integration\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const stats: Record<string, VaultStats> = {
    AIN: {
      vaultName: 'AIN Consciousness Intelligence System',
      totalFiles: 0,
      processedFiles: 0,
      totalChunks: 0,
      categories: {},
      elements: {}
    },
    Soullab: {
      vaultName: 'Soullab Dev Team',
      totalFiles: 0,
      processedFiles: 0,
      totalChunks: 0,
      categories: {},
      elements: {}
    }
  };

  // Check if vaults exist
  try {
    await fs.access(VAULT_AIN);
    console.log('✅ Found AIN vault:', VAULT_AIN);
  } catch {
    console.error('❌ AIN vault not found at:', VAULT_AIN);
    process.exit(1);
  }

  try {
    await fs.access(VAULT_SOULLAB);
    console.log('✅ Found Soullab vault:', VAULT_SOULLAB);
  } catch {
    console.error('❌ Soullab vault not found at:', VAULT_SOULLAB);
    process.exit(1);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Process AIN vault
  console.log('📖 Processing AIN Vault...\n');
  const ainNotes = await processVault(VAULT_AIN, 'AIN');
  stats.AIN.totalFiles = ainNotes.length;
  console.log(`   Found ${ainNotes.length} markdown files\n`);

  // Process Soullab vault
  console.log('📖 Processing Soullab Vault...\n');
  const soullabNotes = await processVault(VAULT_SOULLAB, 'Soullab');
  stats.Soullab.totalFiles = soullabNotes.length;
  console.log(`   Found ${soullabNotes.length} markdown files\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Chunk and store content
  console.log('🔄 Chunking and storing content...\n');

  for (const note of ainNotes) {
    const chunks = chunkContent(note);
    stats.AIN.totalChunks += chunks.length;
    stats.AIN.processedFiles++;

    // Track categories and elements
    stats.AIN.categories[note.category] = (stats.AIN.categories[note.category] || 0) + 1;
    note.elements.forEach(el => {
      stats.AIN.elements[el] = (stats.AIN.elements[el] || 0) + 1;
    });

    // Store in database if Supabase is configured
    if (supabase) {
      await storeChunks(note, chunks, 'AIN');
    }
  }

  for (const note of soullabNotes) {
    const chunks = chunkContent(note);
    stats.Soullab.totalChunks += chunks.length;
    stats.Soullab.processedFiles++;

    // Track categories and elements
    stats.Soullab.categories[note.category] = (stats.Soullab.categories[note.category] || 0) + 1;
    note.elements.forEach(el => {
      stats.Soullab.elements[el] = (stats.Soullab.elements[el] || 0) + 1;
    });

    // Store in database if Supabase is configured
    if (supabase) {
      await storeChunks(note, chunks, 'Soullab');
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Display results
  displayResults(stats);
}

/**
 * Process all markdown files in a vault
 */
async function processVault(vaultPath: string, vaultType: 'AIN' | 'Soullab'): Promise<ProcessedNote[]> {
  const notes: ProcessedNote[] = [];

  async function scanDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip hidden files and common Obsidian folders
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entry.name.endsWith('.md')) {
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          const { data: frontmatter, content: markdown } = matter(content);

          const note: ProcessedNote = {
            filename: entry.name,
            title: frontmatter.title || entry.name.replace('.md', ''),
            content: markdown,
            frontmatter,
            category: categorizeContent(markdown, frontmatter),
            elements: detectElements(markdown, frontmatter),
            concepts: extractConcepts(markdown, frontmatter),
            vault: vaultType
          };

          notes.push(note);
        } catch (error) {
          console.error(`   ⚠️  Error processing ${fullPath}:`, error);
        }
      }
    }
  }

  await scanDirectory(vaultPath);
  return notes;
}

/**
 * Categorize content based on keywords and frontmatter
 */
function categorizeContent(content: string, frontmatter: any): string {
  const lowerContent = content.toLowerCase();

  // Check frontmatter first
  if (frontmatter.type === 'book_chapter' || frontmatter.category === 'book_chapter') {
    return 'book_chapter';
  }
  if (frontmatter.type === 'practice' || frontmatter.category === 'sacred_practice') {
    return 'sacred_practice';
  }

  // Check content patterns
  if (lowerContent.includes('practice:') || lowerContent.includes('exercise:') || lowerContent.includes('ritual:')) {
    return 'sacred_practice';
  }
  if (lowerContent.includes('fire') || lowerContent.includes('water') ||
      lowerContent.includes('earth') || lowerContent.includes('air') ||
      lowerContent.includes('aether')) {
    return 'elemental_wisdom';
  }
  if (lowerContent.includes('consciousness') || lowerContent.includes('awareness')) {
    return 'consciousness_principle';
  }
  if (lowerContent.includes('chapter ') || frontmatter.chapter) {
    return 'book_chapter';
  }

  return 'core_teaching';
}

/**
 * Detect elements mentioned in content
 */
function detectElements(content: string, frontmatter: any): string[] {
  const elements: string[] = [];
  const lowerContent = content.toLowerCase();

  // Check frontmatter
  if (frontmatter.elements && Array.isArray(frontmatter.elements)) {
    return frontmatter.elements;
  }
  if (frontmatter.element) {
    elements.push(frontmatter.element);
  }

  // Detect from content
  const elementPatterns = {
    fire: /\b(fire|flame|ignite|passion|transformation|spirit)\b/i,
    water: /\b(water|flow|emotion|depth|intuition)\b/i,
    earth: /\b(earth|ground|embodiment|manifestation|practical)\b/i,
    air: /\b(air|intellect|mind|communication|clarity)\b/i,
    aether: /\b(aether|unity|transcend|integration|wholeness)\b/i
  };

  for (const [element, pattern] of Object.entries(elementPatterns)) {
    if (pattern.test(lowerContent)) {
      elements.push(element);
    }
  }

  return [...new Set(elements)];
}

/**
 * Extract key concepts from content
 */
function extractConcepts(content: string, frontmatter: any): string[] {
  const concepts: string[] = [];

  // From frontmatter
  if (frontmatter.concepts && Array.isArray(frontmatter.concepts)) {
    concepts.push(...frontmatter.concepts);
  }
  if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
    concepts.push(...frontmatter.tags);
  }

  // Extract from headings (## Heading)
  const headingMatches = content.matchAll(/^##\s+(.+)$/gm);
  for (const match of headingMatches) {
    concepts.push(match[1].toLowerCase());
  }

  // Extract bolded concepts
  const boldMatches = content.matchAll(/\*\*(.+?)\*\*/g);
  for (const match of boldMatches) {
    if (match[1].length < 50) { // Only short phrases
      concepts.push(match[1].toLowerCase());
    }
  }

  return [...new Set(concepts)].slice(0, 20); // Top 20 unique concepts
}

/**
 * Chunk content into digestible pieces
 */
function chunkContent(note: ProcessedNote): string[] {
  const chunks: string[] = [];
  const CHUNK_SIZE = 1000; // characters per chunk
  const OVERLAP = 200; // overlap between chunks

  let content = note.content;
  let startIndex = 0;

  while (startIndex < content.length) {
    const endIndex = Math.min(startIndex + CHUNK_SIZE, content.length);
    let chunk = content.substring(startIndex, endIndex);

    // Try to end on a sentence boundary
    if (endIndex < content.length) {
      const lastPeriod = chunk.lastIndexOf('.');
      const lastNewline = chunk.lastIndexOf('\n');
      const breakPoint = Math.max(lastPeriod, lastNewline);

      if (breakPoint > CHUNK_SIZE * 0.5) { // At least 50% of chunk
        chunk = chunk.substring(0, breakPoint + 1);
      }
    }

    // Add context header to chunk
    const chunkWithContext = `# ${note.title}\n\nVault: ${note.vault}\nCategory: ${note.category}\n\n${chunk}`;
    chunks.push(chunkWithContext);

    startIndex += chunk.length - OVERLAP;
  }

  return chunks;
}

/**
 * Store chunks in Supabase file_chunks table
 */
async function storeChunks(note: ProcessedNote, chunks: string[], vaultType: string) {
  if (!supabase) {
    console.log('   ⚠️  Supabase not configured, skipping database storage');
    return;
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    try {
      const { error } = await supabase
        .from('file_chunks')
        .insert({
          file_id: `${vaultType}_${note.filename}_${Date.now()}`,
          chunk_index: i,
          content: chunk,
          metadata: {
            filename: note.filename,
            title: note.title,
            vault: vaultType,
            category: note.category,
            elements: note.elements,
            concepts: note.concepts,
            frontmatter: note.frontmatter
          }
        });

      if (error) {
        console.error(`   ❌ Error storing chunk ${i} of ${note.filename}:`, error.message);
      }
    } catch (error) {
      console.error(`   ❌ Error storing chunk:`, error);
    }
  }
}

/**
 * Display ingestion results
 */
function displayResults(stats: Record<string, VaultStats>) {
  console.log('✨ INGESTION COMPLETE!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (const [key, stat] of Object.entries(stats)) {
    console.log(`📚 ${stat.vaultName}`);
    console.log(`   Files: ${stat.processedFiles}/${stat.totalFiles}`);
    console.log(`   Chunks: ${stat.totalChunks}`);
    console.log(`\n   Categories:`);
    for (const [category, count] of Object.entries(stat.categories)) {
      console.log(`      ${category}: ${count}`);
    }
    console.log(`\n   Elements:`);
    for (const [element, count] of Object.entries(stat.elements)) {
      console.log(`      ${element}: ${count}`);
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  const totalFiles = stats.AIN.processedFiles + stats.Soullab.processedFiles;
  const totalChunks = stats.AIN.totalChunks + stats.Soullab.totalChunks;

  console.log('🎯 TOTAL KNOWLEDGE INTEGRATED:');
  console.log(`   Files: ${totalFiles}`);
  console.log(`   Chunks: ${totalChunks}`);
  console.log('\n✅ MAIA now has access to both vaults!\n');
  console.log('Next steps:');
  console.log('  1. Restart your dev server to load new knowledge');
  console.log('  2. Test MAIA by asking about vault content');
  console.log('  3. Watch the IP Engine logs for knowledge retrieval\n');
}

// Run ingestion
ingestDualVaults()
  .then(() => {
    console.log('🌀 Dual vault ingestion complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Ingestion failed:', error);
    process.exit(1);
  });
