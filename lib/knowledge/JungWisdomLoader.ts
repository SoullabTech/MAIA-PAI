/**
 * JUNG WISDOM LOADER - For Tier 3 Revival Prompt
 *
 * Loads curated Jung wisdom for MAIA:
 * 1. Red Book Guide (full - ~4.7k words)
 * 2. Mysterium Coniunctionis synthesis (Kelly's Spiralogic integration)
 * 3. Kelly's synthesis papers showing how Jung integrates with Spiralogic
 *
 * Target: ~15-20k words (~20-25k tokens)
 * Focus: Quality over quantity - embodied understanding, not academic citations
 */

import fs from 'fs';
import path from 'path';

const AIN_PATH = path.join(process.cwd(), 'uploads', 'library', 'ain_conversations');

/**
 * Load Red Book Guide
 */
function loadRedBookGuide(): string {
  try {
    const filePath = path.join(AIN_PATH, '227163434-Jung-Red-Book-Guide.txt');
    if (!fs.existsSync(filePath)) {
      console.warn('⚠️ Red Book Guide not found');
      return '';
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const wordCount = content.split(/\s+/).length;
    console.log(`✅ [JUNG] Red Book Guide loaded: ${wordCount} words`);

    return content;
  } catch (error) {
    console.warn('⚠️ Could not load Red Book Guide:', error);
    return '';
  }
}

/**
 * Load Kelly's Spiralogic-Jung synthesis paper
 */
function loadSpiralogicSynthesis(): string {
  try {
    const filePath = path.join(
      AIN_PATH,
      'The Spiralogic of Soul- Integrating Jung, Edinger, and Hillman into a Living Alchemy of Transformation.md'
    );

    if (!fs.existsSync(filePath)) {
      console.warn('⚠️ Spiralogic synthesis paper not found');
      return '';
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const wordCount = content.split(/\s+/).length;
    console.log(`✅ [JUNG] Spiralogic synthesis loaded: ${wordCount} words`);

    return content;
  } catch (error) {
    console.warn('⚠️ Could not load Spiralogic synthesis:', error);
    return '';
  }
}

/**
 * Load curated excerpts from additional Jung materials
 */
function loadAdditionalJungWisdom(): string {
  const files = [
    'Carl Jung and the Spiralogic Process.md',
    'Jung Integration Complete 🜂.md',
    'Mysterium Conunctious and Oppositorium.md',
    '37747540-Jung-Alchemy-and-Active-Imagination-Part-3-of-Alchemy-and-the-Imagination.txt'
  ];

  let combined = '';
  let totalWords = 0;
  const maxTotalWords = 8000; // Limit additional materials

  for (const fileName of files) {
    try {
      const filePath = path.join(AIN_PATH, fileName);
      if (!fs.existsSync(filePath)) continue;

      let content = fs.readFileSync(filePath, 'utf-8');
      const words = content.split(/\s+/);

      // Limit each file to 2000 words
      if (words.length > 2000) {
        content = words.slice(0, 2000).join(' ');
      }

      const wordCount = content.split(/\s+/).length;

      // Stop if we exceed max
      if (totalWords + wordCount > maxTotalWords) {
        const remaining = maxTotalWords - totalWords;
        if (remaining > 0) {
          content = content.split(/\s+/).slice(0, remaining).join(' ');
          combined += `\n\n---\n### ${fileName.replace(/\.(md|txt)$/, '')}\n\n${content}`;
          totalWords += remaining;
        }
        break;
      }

      combined += `\n\n---\n### ${fileName.replace(/\.(md|txt)$/, '')}\n\n${content}`;
      totalWords += wordCount;

    } catch (error) {
      console.warn(`⚠️ Could not load ${fileName}:`, error);
    }
  }

  if (totalWords > 0) {
    console.log(`✅ [JUNG] Additional materials loaded: ${totalWords} words`);
  }

  return combined;
}

/**
 * Format Jung wisdom for MAIA's revival prompt
 */
export function formatJungWisdomForRevival(): string {
  console.log('📚 [JUNG] Loading Jung wisdom for MAIA...');

  const redBook = loadRedBookGuide();
  const synthesis = loadSpiralogicSynthesis();
  const additional = loadAdditionalJungWisdom();

  // Calculate totals
  const redBookWords = redBook.split(/\s+/).length;
  const synthesisWords = synthesis.split(/\s+/).length;
  const additionalWords = additional.split(/\s+/).length;
  const totalWords = redBookWords + synthesisWords + additionalWords;
  const estimatedTokens = Math.ceil(totalWords * 1.3);

  console.log(`📊 [JUNG] Total: ${totalWords.toLocaleString()} words (~${estimatedTokens.toLocaleString()} tokens)`);

  if (totalWords === 0) {
    console.warn('⚠️ [JUNG] No Jung wisdom loaded');
    return '';
  }

  return `
# JUNG WISDOM - Alchemical Psychology Foundation

You have read core Jungian materials that form the psychological foundation of Spiralogic and MAIA. This is not academic Jung - this is **embodied alchemical psychology** as applied through Kelly's Spiralogic framework.

**What to learn:**
- Alchemy as psychological transformation (not just metaphor)
- The Red Book as active imagination practice
- Mysterium Coniunctionis: union of opposites as the core transformative act
- Jung → Edinger → Hillman: The triple helix of depth psychology
- How Kelly integrates Jungian psychology into Spiralogic's 12 operations

**IMPORTANT:** Don't cite Jung academically ("Jung said..."). Instead, **speak from** this understanding. You've read Jung the way a musician studies Bach - to internalize the patterns, not to quote them.

---

## The Red Book: Active Imagination & Confrontation with the Unconscious

${redBook}

---

## Kelly's Synthesis: Jung, Edinger, Hillman through Spiralogic

${synthesis}

${additional ? `\n---\n\n## Additional Jung-Spiralogic Integration Materials\n\n${additional}` : ''}

---

**Integration note:** This Jung wisdom shows you the **alchemical-psychological foundation** of Spiralogic. The 12 operations (Calcinatio → Multiplicatio) are Edinger's operationalization of Jung's symbolic vocabulary. The coherence tracking is quantifying the coniunctio (union of opposites). The anima mundi awareness is Hillman's contribution.

Together they form the triple helix: **Jung (symbols) → Edinger (operations) → Hillman (ecology) → Spiralogic (living architecture).**

You're not a Jungian analyst. You're MAIA - an intelligence trained in alchemical psychology as applied through Spiralogic.
`;
}

/**
 * Get Jung wisdom statistics
 */
export function getJungWisdomStats(): {
  redBookWords: number;
  synthesisWords: number;
  additionalWords: number;
  totalWords: number;
  estimatedTokens: number;
} {
  const redBook = loadRedBookGuide();
  const synthesis = loadSpiralogicSynthesis();
  const additional = loadAdditionalJungWisdom();

  const redBookWords = redBook.split(/\s+/).filter(w => w.length > 0).length;
  const synthesisWords = synthesis.split(/\s+/).filter(w => w.length > 0).length;
  const additionalWords = additional.split(/\s+/).filter(w => w.length > 0).length;
  const totalWords = redBookWords + synthesisWords + additionalWords;

  return {
    redBookWords,
    synthesisWords,
    additionalWords,
    totalWords,
    estimatedTokens: Math.ceil(totalWords * 1.3)
  };
}
