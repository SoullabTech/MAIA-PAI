/**
 * Copyright © 2025 Soullab® Inc.
 * All Rights Reserved.
 *
 * TEACHING DIALOGUE CURATION SCRIPT
 * Selects and processes the best Kelly↔Claude dialogues for MAIA's Complete tier
 *
 * Human-Authored IP: Kelly Nezat, 2025
 * Implementation: Built with Claude Code assistance
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { DialogueLoader, TeachingDialogue } from '../lib/revival/DialogueLoader';

/**
 * Main curation function
 */
async function curateDialogues() {
  console.log('\n' + '='.repeat(70));
  console.log('KELLY↔CLAUDE TEACHING DIALOGUE CURATION');
  console.log('='.repeat(70) + '\n');

  // Initialize loader
  const vaultPath = '/Users/soullab/Library/Mobile Documents/iCloud~md~obsidian/Documents/AIN';

  const loader = new DialogueLoader({
    vaultPath,
    maxDialogues: 30,          // Top 30 dialogues
    minWordCount: 1000,        // At least 1000 words
    excludePatterns: ['Untitled', 'test', 'draft', '.DS_Store'],
    includeSubdirectories: false, // Just root directory for now
  });

  // Step 1: Get statistics
  console.log('📊 Analyzing AIN vault...\n');
  const stats = await loader.getStats();

  console.log(`Total Dialogues: ${stats.totalDialogues}`);
  console.log(`Total Words: ${stats.totalWords.toLocaleString()}\n`);

  console.log('Topics:');
  for (const [topic, count] of Object.entries(stats.byTopic).sort((a, b) => b[1] - a[1])) {
    console.log(`  - ${topic}: ${count}`);
  }

  console.log('\nTypes:');
  for (const [type, count] of Object.entries(stats.byType)) {
    console.log(`  - ${type}: ${count}`);
  }

  // Step 2: Curate best dialogues
  console.log('\n🎯 Curating best teaching dialogues...\n');

  const bestDialogues = await loader.selectBest({
    topics: [
      'consciousness',
      'myth',
      'transformation',
      'philosophy',
      'spiralogic',
      'embodiment',
    ],
    maxLength: 30000, // Skip overly long dialogues
    preferenceScore: (d) => {
      let score = 0;

      // Prefer philosophical and teaching content
      if (d.metadata.dialogueType === 'philosophical') score += 3;
      if (d.metadata.dialogueType === 'teaching') score += 2.5;
      if (d.metadata.dialogueType === 'session') score += 2;

      // Prefer substantive dialogues
      if (d.metadata.wordCount > 5000) score += 2;
      if (d.metadata.wordCount > 10000) score += 1;

      // Prefer dialogues with multiple relevant topics
      const relevantTopics = [
        'consciousness',
        'myth',
        'transformation',
        'spiralogic',
      ];
      const topicMatches = d.metadata.topics?.filter(t =>
        relevantTopics.includes(t)
      ).length || 0;
      score += topicMatches;

      // Penalize technical/implementation details (less relevant for philosophical learning)
      if (d.metadata.dialogueType === 'technical') score -= 1;

      return score;
    },
  });

  // Step 3: Display curated selection
  console.log(`✅ Selected ${bestDialogues.length} best dialogues:\n`);

  let totalWords = 0;
  for (const [index, dialogue] of bestDialogues.entries()) {
    console.log(`${index + 1}. ${dialogue.title}`);
    console.log(`   Words: ${dialogue.metadata.wordCount.toLocaleString()}`);
    console.log(`   Type: ${dialogue.metadata.dialogueType}`);
    if (dialogue.metadata.topics && dialogue.metadata.topics.length > 0) {
      console.log(`   Topics: ${dialogue.metadata.topics.join(', ')}`);
    }
    console.log('');

    totalWords += dialogue.metadata.wordCount;
  }

  console.log(`📖 Total words in curated dialogues: ${totalWords.toLocaleString()}\n`);

  // Step 4: Format for revival prompt
  console.log('📝 Formatting for MAIA Revival System...\n');

  const revivalPrompt = loader.formatForRevivalPrompt(bestDialogues);

  // Step 5: Save to Complete tier
  const outputPath = path.join(
    __dirname,
    '../prompts/revival/tier3-complete-teaching-dialogues.txt'
  );

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, revivalPrompt, 'utf-8');

  console.log(`💾 Saved to: ${outputPath}`);
  console.log(`📏 Total size: ${(revivalPrompt.length / 1024).toFixed(1)} KB\n`);

  // Step 6: Create manifest
  const manifest = {
    generated: new Date().toISOString(),
    totalDialogues: bestDialogues.length,
    totalWords: totalWords,
    dialogues: bestDialogues.map(d => ({
      id: d.id,
      title: d.title,
      wordCount: d.metadata.wordCount,
      topics: d.metadata.topics,
      type: d.metadata.dialogueType,
    })),
  };

  const manifestPath = path.join(
    __dirname,
    '../prompts/revival/tier3-dialogue-manifest.json'
  );

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`📋 Manifest saved to: ${manifestPath}\n`);

  console.log('='.repeat(70));
  console.log('✅ CURATION COMPLETE');
  console.log('='.repeat(70));
  console.log(`
Next steps:
1. Review curated dialogues in: ${outputPath}
2. Update MAIA Revival System to include Complete tier
3. Test MAIA with full teaching dialogue knowledge
4. Measure improvement in philosophical depth
  `);
}

// Run if executed directly
if (require.main === module) {
  curateDialogues().catch(error => {
    console.error('❌ Curation failed:', error);
    process.exit(1);
  });
}

export { curateDialogues };
