#!/usr/bin/env node
/**
 * Copyright © 2025 Soullab® Inc.
 * All Rights Reserved.
 *
 * REFERENCE LIBRARY CURATION SCRIPT
 * Automatically extracts and curates wisdom from Kelly's PDF library for MAIA
 *
 * Human-Authored IP: Kelly Nezat
 * Implementation: Built with Claude Code assistance
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PDFKnowledgeLoader, ReferenceBook } from '../lib/knowledge/PDFKnowledgeLoader';

/**
 * Configuration
 */
const CONFIG = {
  libraryPath: '/Users/soullab/Documents/Books',
  outputDir: './prompts/revival',
  maxBooksToLoad: 50,              // Increased to accommodate all foundational texts
  maxWordsPerBook: 5000,
  minRelevanceScore: 0.5,          // Lowered from 0.7 to 0.5 for broader inclusion
  priorityCategories: [
    'jung',
    'hillman',
    'alchemy',
    'family_constellations',
    'astrology',                   // Added: Liz Greene, etc.
    'i_ching',                     // Added: I Ching philosophy
    'human_design',                // Added: Human Design system
  ] as const,
  forceIncludeFiles: [
    'Constellation-Workgroup',       // Family Constellations reference
    'MicroPsi',                      // Micro-phenomenology
    'nlp_techniques',                // NLP Big Book
    'Alchemy Of You Workshop',       // Kelly's workshop materials
    'Alchemy of Awakening',          // Kelly's elemental transformation guide
    'On-the-nature-of-change-in-the-four-elements', // Classical vs Jungian elements
    'Integrating astropsychology',   // Astrology + psychology integration framework
    'MAIA Archetypal Astrology',     // MAIA's astrology system design
    'Richard Tarnas',                // Tarnas archetypal astrology methodology
    'Archetypal-Cosmology',          // Tarnas foundational text
    'Personal-Mythology',            // Personal mythology work
    'Erich-Neumann',                 // Depth psychology and new ethic
    'holotropic-mind',               // Grof's holotropic work
    'Keiron-Le-Grice',               // Birth of archetypal cosmology discipline
    'Von-Franz-Alchemy',             // Marie-Louise von Franz on alchemy
    'Moon-s-Nodes',                  // Evolutionary astrology
    'Becoming-Whole',                // Jungian individuation guide
    'Psychedelics-and-Individuation', // Consciousness expansion
  ],
};

/**
 * Main curation function
 */
async function curateReferenceLibrary() {
  console.log('\n📚 REFERENCE LIBRARY CURATION\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Step 1: Initialize loader
  console.log('🔧 Initializing PDF Knowledge Loader...\n');

  const loader = new PDFKnowledgeLoader({
    libraryPath: CONFIG.libraryPath,
    maxBooksToLoad: CONFIG.maxBooksToLoad,
    maxWordsPerBook: CONFIG.maxWordsPerBook,
    minRelevanceScore: CONFIG.minRelevanceScore,
    priorityCategories: CONFIG.priorityCategories,
  });

  // Step 2: Load and curate books
  console.log('📖 Loading and analyzing PDF library...\n');

  const curatedBooks = await loader.selectBest();

  console.log('\n✅ Curation complete!\n');

  // Step 3: Get statistics
  console.log('📊 STATISTICS\n');
  console.log('───────────────────────────────────────────────────────────\n');

  const stats = await loader.getStats();

  console.log(`Total Books Curated: ${stats.totalBooks}`);
  console.log(`Total Words: ${stats.totalWords.toLocaleString()}`);
  console.log(`Average Words per Book: ${Math.round(stats.totalWords / stats.totalBooks).toLocaleString()}`);
  console.log(`Average Relevance Score: ${(stats.averageRelevance * 100).toFixed(1)}%`);

  console.log('\n📚 By Category:');
  for (const [category, count] of Object.entries(stats.byCategory)) {
    console.log(`   ${category}: ${count} books`);
  }

  console.log('\n🏷️  By Topic:');
  const topTopics = Object.entries(stats.byTopic)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  for (const [topic, count] of topTopics) {
    console.log(`   ${topic}: ${count} books`);
  }

  // Step 4: Format for MAIA Revival System
  console.log('\n📝 Formatting for MAIA Revival System...\n');

  const revivalPrompt = loader.formatForRevivalPrompt(curatedBooks);

  // Step 5: Save formatted prompt
  const outputPath = path.join(CONFIG.outputDir, 'tier3-complete-reference-library.txt');

  await fs.mkdir(CONFIG.outputDir, { recursive: true });
  await fs.writeFile(outputPath, revivalPrompt, 'utf-8');

  const fileSizeKB = Math.round(revivalPrompt.length / 1024);
  console.log(`✅ Saved to: ${outputPath}`);
  console.log(`   Size: ${fileSizeKB} KB`);

  // Step 6: Generate manifest
  console.log('\n📋 Generating manifest...\n');

  const manifest = {
    generated: new Date().toISOString(),
    totalBooks: stats.totalBooks,
    totalWords: stats.totalWords,
    averageRelevance: stats.averageRelevance,
    config: CONFIG,
    books: curatedBooks.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      wordCount: book.metadata.wordCount,
      topics: book.metadata.topics,
      relevanceScore: book.metadata.relevanceScore,
    })),
  };

  const manifestPath = path.join(CONFIG.outputDir, 'tier3-reference-library-manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`✅ Manifest saved to: ${manifestPath}`);

  // Step 7: Print curated book list
  console.log('\n📖 CURATED BOOKS\n');
  console.log('───────────────────────────────────────────────────────────\n');

  for (let i = 0; i < curatedBooks.length; i++) {
    const book = curatedBooks[i];
    console.log(`${i + 1}. "${book.title}"`);
    if (book.author) {
      console.log(`   Author: ${book.author}`);
    }
    console.log(`   Category: ${book.category}`);
    console.log(`   Words: ${book.metadata.wordCount.toLocaleString()}`);
    console.log(`   Relevance: ${(book.metadata.relevanceScore * 100).toFixed(1)}%`);
    console.log(`   Topics: ${book.metadata.topics.join(', ')}`);
    console.log('');
  }

  // Step 8: Summary
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('✨ CURATION COMPLETE\n');
  console.log(`📚 ${stats.totalBooks} books selected from Kelly's library`);
  console.log(`📝 ${stats.totalWords.toLocaleString()} words of wisdom extracted`);
  console.log(`💾 Ready for MAIA's Complete tier Revival System\n`);
  console.log('Next steps:');
  console.log('1. Review curated excerpts in tier3-complete-reference-library.txt');
  console.log('2. Integrate into MaiaRevivalSystem.ts (Complete tier)');
  console.log('3. Test MAIA with full knowledge loaded');
  console.log('\n═══════════════════════════════════════════════════════════\n');
}

/**
 * Run curation
 */
curateReferenceLibrary().catch(error => {
  console.error('\n❌ ERROR during curation:\n', error);
  process.exit(1);
});
