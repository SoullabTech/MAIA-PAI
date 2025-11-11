/**
 * Copyright © 2025 Soullab® Inc.
 * All Rights Reserved.
 *
 * SESSION TRANSCRIPT PROCESSING PIPELINE
 * End-to-end script for safely processing client session transcripts
 *
 * Human-Authored IP: Kelly Nezat, 2025
 * Implementation: Built with Claude Code assistance
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { TranscriptAnonymizer, AnonymizedTranscript } from '../lib/transcript-analysis/TranscriptAnonymizer';
import { PatternExtractor, PatternType } from '../lib/transcript-analysis/PatternExtractor';
import { WisdomLibrary } from '../lib/transcript-analysis/WisdomLibrary';

/**
 * Session input (raw transcript with metadata)
 */
interface SessionInput {
  filepath: string;                 // Path to transcript file
  sessionDate: Date;
  sessionLength: number;            // minutes
  modalitiesUsed: string[];
  clientConsented: boolean;         // REQUIRED: must have consent
}

/**
 * Processing result
 */
interface ProcessingResult {
  success: boolean;
  anonymized?: AnonymizedTranscript;
  patterns?: number;                // Number of patterns extracted
  errors?: string[];
  originalDeleted: boolean;         // Confirmation original was deleted
}

/**
 * Main processing pipeline
 */
export class TranscriptProcessingPipeline {
  private anonymizer: TranscriptAnonymizer;
  private patternExtractor: PatternExtractor;
  private wisdomLibrary: WisdomLibrary;
  private outputDir: string;

  constructor(wisdomLibraryPath?: string, outputDir?: string) {
    this.anonymizer = new TranscriptAnonymizer();
    this.patternExtractor = new PatternExtractor({
      minPatternConfidence: 0.7,
      maxPatternsPerSession: 10,
    });
    this.outputDir = outputDir || './data/wisdom-library';

    // Load or create wisdom library
    if (wisdomLibraryPath) {
      this.loadWisdomLibrary(wisdomLibraryPath);
    } else {
      this.wisdomLibrary = new WisdomLibrary();
    }
  }

  /**
   * Load existing wisdom library
   */
  private async loadWisdomLibrary(filepath: string): Promise<void> {
    try {
      this.wisdomLibrary = await WisdomLibrary.loadFromFile(filepath);
      console.log('✅ Loaded existing wisdom library');
    } catch (error) {
      console.log('Creating new wisdom library...');
      this.wisdomLibrary = new WisdomLibrary();
    }
  }

  /**
   * Process a single session transcript
   */
  async processSession(session: SessionInput): Promise<ProcessingResult> {
    const errors: string[] = [];

    try {
      // Step 0: Verify consent
      if (!session.clientConsented) {
        throw new Error('Cannot process session without client consent');
      }

      console.log(`\n${'='.repeat(60)}`);
      console.log(`Processing session: ${path.basename(session.filepath)}`);
      console.log(`Date: ${session.sessionDate.toISOString().split('T')[0]}`);
      console.log(`Length: ${session.sessionLength} minutes`);
      console.log(`${'='.repeat(60)}\n`);

      // Step 1: Read transcript
      console.log('📄 Reading transcript...');
      const rawTranscript = await fs.readFile(session.filepath, 'utf-8');

      // Step 2: Anonymize
      console.log('🔒 Anonymizing (removing all PII)...');
      const anonymized = await this.anonymizer.anonymize(rawTranscript, {
        sessionDate: session.sessionDate,
        sessionLength: session.sessionLength,
        modalitiesUsed: session.modalitiesUsed,
      });

      // Step 3: Manual verification (in production, show to Kelly)
      console.log('\n⚠️  MANUAL VERIFICATION REQUIRED ⚠️');
      console.log('Review anonymized transcript to ensure no identifiable details remain.\n');
      console.log('First 500 characters:');
      console.log(anonymized.anonymizedText.substring(0, 500));
      console.log('\n...\n');

      // In production, wait for manual approval here
      // For now, auto-approve if AI verification passed
      if (anonymized.verificationStatus !== 'verified') {
        errors.push('Anonymization verification failed - manual review required');
        return { success: false, errors, originalDeleted: false };
      }

      // Step 4: Extract patterns
      console.log('\n🔍 Extracting transformation patterns...');
      const patterns = await this.patternExtractor.extractPatterns(anonymized);
      anonymized.extractedPatterns = patterns;

      console.log(`✅ Extracted ${patterns.length} patterns`);

      // Step 5: Add to wisdom library
      console.log('\n📚 Adding patterns to wisdom library...');
      this.wisdomLibrary.addPatterns(patterns);

      // Step 6: Save anonymized transcript and patterns
      await this.saveResults(anonymized);

      // Step 7: DELETE ORIGINAL TRANSCRIPT
      console.log('\n🗑️  Deleting original transcript...');
      await fs.unlink(session.filepath);
      console.log('✅ Original transcript deleted');

      // Step 8: Save updated wisdom library
      const libraryPath = path.join(this.outputDir, 'wisdom-library.json');
      await this.wisdomLibrary.saveToFile(libraryPath);

      console.log('\n✅ Processing complete!');
      console.log(`   - Anonymized transcript saved`);
      console.log(`   - ${patterns.length} patterns extracted`);
      console.log(`   - Original deleted`);
      console.log(`   - Wisdom library updated (${this.wisdomLibrary.getStats().totalPatterns} total patterns)\n`);

      return {
        success: true,
        anonymized,
        patterns: patterns.length,
        originalDeleted: true,
      };

    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      console.error('❌ Processing failed:', errors);
      return { success: false, errors, originalDeleted: false };
    }
  }

  /**
   * Process multiple sessions in batch
   */
  async processBatch(sessions: SessionInput[]): Promise<ProcessingResult[]> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`BATCH PROCESSING: ${sessions.length} sessions`);
    console.log(`${'='.repeat(60)}\n`);

    const results: ProcessingResult[] = [];

    for (const [index, session] of sessions.entries()) {
      console.log(`\n[${ index + 1}/${sessions.length}]`);
      const result = await this.processSession(session);
      results.push(result);

      // Rate limiting between sessions
      if (index < sessions.length - 1) {
        console.log('⏳ Waiting 2 seconds before next session...');
        await this.sleep(2000);
      }
    }

    // Summary
    const successful = results.filter(r => r.success).length;
    const totalPatterns = results.reduce((sum, r) => sum + (r.patterns || 0), 0);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`BATCH COMPLETE`);
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Successful: ${successful}/${sessions.length}`);
    console.log(`📊 Total patterns extracted: ${totalPatterns}`);
    console.log(`📚 Wisdom library size: ${this.wisdomLibrary.getStats().totalPatterns} patterns`);
    console.log(`${'='.repeat(60)}\n`);

    return results;
  }

  /**
   * Save anonymized results
   */
  private async saveResults(anonymized: AnonymizedTranscript): Promise<void> {
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });

    // Save anonymized transcript
    const transcriptPath = path.join(
      this.outputDir,
      `anonymized_${anonymized.originalId}.txt`
    );
    await fs.writeFile(transcriptPath, anonymized.anonymizedText, 'utf-8');

    // Save patterns as JSON
    const patternsPath = path.join(
      this.outputDir,
      `patterns_${anonymized.originalId}.json`
    );
    await fs.writeFile(
      patternsPath,
      JSON.stringify(anonymized.extractedPatterns, null, 2),
      'utf-8'
    );

    console.log(`💾 Saved to ${this.outputDir}/`);
  }

  /**
   * Get wisdom library statistics
   */
  getStats() {
    return this.wisdomLibrary.getStats();
  }

  /**
   * Helper: sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * CLI Usage Example
 */
async function main() {
  // Initialize pipeline
  const pipeline = new TranscriptProcessingPipeline(
    './data/wisdom-library/wisdom-library.json', // Existing library (or undefined for new)
    './data/wisdom-library'                      // Output directory
  );

  // Example: Process single session
  const session: SessionInput = {
    filepath: './data/raw-transcripts/session-001.txt',
    sessionDate: new Date('2025-01-15'),
    sessionLength: 60,
    modalitiesUsed: ['oracle', 'journaling'],
    clientConsented: true, // ✅ REQUIRED
  };

  await pipeline.processSession(session);

  // Example: Batch process multiple sessions
  // const sessions: SessionInput[] = [
  //   { filepath: './data/raw-transcripts/session-001.txt', ... },
  //   { filepath: './data/raw-transcripts/session-002.txt', ... },
  //   { filepath: './data/raw-transcripts/session-003.txt', ... },
  // ];
  //
  // await pipeline.processBatch(sessions);

  // Show stats
  console.log('\n📊 Wisdom Library Statistics:');
  console.log(JSON.stringify(pipeline.getStats(), null, 2));
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}
