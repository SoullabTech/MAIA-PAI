/**
 * PERSONAL ORACLE AGENT - TRANSFORMATION ENHANCEMENT
 *
 * This module extends PersonalOracleAgent with alchemical transformation intelligence
 *
 * Integration approach:
 * 1. Import transformation middleware
 * 2. Enhance system prompt with alchemical awareness
 * 3. Add Tier 2 wisdom when ready
 * 4. Detect bypasses and guide accordingly
 *
 * HOW TO INTEGRATE:
 * Add these imports to PersonalOracleAgent.ts:
 *
 * ```typescript
 * import { enhanceWithTransformation, getTransformationPromptAddition } from './PersonalOracleAgent.TransformationEnhancement';
 * ```
 *
 * Then in processInteraction, after loading AIN memory (around line 781):
 *
 * ```typescript
 * // 🜃 TRANSFORMATION ARCHITECTURE - Alchemical intelligence
 * const transformationEnhancement = await enhanceWithTransformation(
 *   this.userId,
 *   conversationHistory,
 *   patterns, // from pattern detection
 *   userProfile // if available
 * );
 * console.log(`🜃 Transformation: ${transformationEnhancement.state.alchemical.currentStage.operation} / ${transformationEnhancement.state.wings.canFly ? 'Wings ready' : 'Building wings'}`);
 * ```
 *
 * Then in buildSystemPrompt section (around line 1048), add to adaptedFramework:
 *
 * ```typescript
 * // Add transformation awareness to system prompt
 * if (transformationEnhancement) {
 *   adaptedFramework += `\n\n${transformationEnhancement.systemPromptEnhancement}`;
 *
 *   // Add Tier 2 wisdom if ready
 *   if (transformationEnhancement.tier2Wisdom?.accessible) {
 *     adaptedFramework += `\n\n## 🌍 Ecological Psychology (Tier 2 - User Ready)\n`;
 *     adaptedFramework += transformationEnhancement.tier2Wisdom.invitations.join('\n');
 *   }
 *
 *   // Add bypass alerts if detected
 *   if (transformationEnhancement.bypasses.detected.length > 0) {
 *     adaptedFramework += `\n\n## ⚠️ Bypass Patterns Detected: ${transformationEnhancement.bypasses.detected.join(', ')}\n`;
 *     adaptedFramework += `Guidance: ${transformationEnhancement.bypasses.guidance[0]}`;
 *   }
 * }
 * ```
 */

import type { Message } from '@/types/conversation';
import {
  enhanceWithTransformation as enhanceWithTransformationCore,
  type TransformationEnhancement
} from '../consciousness/TransformationMiddleware';
import { ECOLOGICAL_PSYCHOLOGY_WISDOM } from '../knowledge/EcologicalPsychologyWisdom';

// Re-export for clean imports
export { enhanceWithTransformationCore as enhanceWithTransformation };
export type { TransformationEnhancement };

/**
 * Build transformation-aware system prompt addition
 *
 * This can be appended to PersonalOracleAgent's existing system prompt
 */
export function buildTransformationPromptAddition(
  enhancement: TransformationEnhancement
): string {

  let addition = '\n\n---\n\n';
  addition += '## 🜃 TRANSFORMATION INTELLIGENCE (Alchemical Awareness)\n\n';

  // Core state
  addition += `**Current Stage:** ${enhancement.state.alchemical.currentStage.operation} (${enhancement.state.alchemical.currentStage.element})\n`;
  addition += `${enhancement.state.alchemical.currentStage.description}\n\n`;

  // Soul vs Ego
  addition += `**Voice Detected:** ${enhancement.state.aetheric.voiceSource}\n`;
  if (enhancement.state.aetheric.voiceSource === 'conflicted' ||
      enhancement.state.aetheric.voiceSource === 'both') {
    addition += `- Ego wants: ${enhancement.state.aetheric.guidance.egoWants}\n`;
    addition += `- Soul needs: ${enhancement.state.aetheric.guidance.soulNeeds}\n`;
  }
  addition += '\n';

  // Wings status
  addition += `**Wings Balance:**\n`;
  addition += `- Feathers (sovereignty): ${enhancement.state.wings.balance.feathers.status}\n`;
  addition += `- Wax (shadow integration): ${enhancement.state.wings.balance.wax.status}\n`;
  addition += `- Flight capability: ${enhancement.state.wings.canFly ? 'READY TO FLY' : 'Building'}\n\n`;

  // Primary guidance
  addition += `**Your Approach:**\n`;
  addition += `${enhancement.quickGuidance.approach}\n\n`;
  addition += `**Depth Level:** ${enhancement.quickGuidance.depth}\n\n`;

  // Invitations
  if (enhancement.state.developmentalGuidance.invitations.length > 0) {
    addition += `**Invitations You Can Offer:**\n`;
    enhancement.state.developmentalGuidance.invitations.forEach(inv => {
      addition += `- ${inv}\n`;
    });
    addition += '\n';
  }

  // Tier 2 wisdom (if accessible)
  if (enhancement.tier2Wisdom?.accessible) {
    addition += `## 🌍 TIER 2 WISDOM UNLOCKED\n\n`;
    addition += `This user is ready for ecological/political/aesthetic depth (Hillman Tier 2).\n\n`;

    addition += `**Available Teachings:**\n`;
    enhancement.tier2Wisdom.invitations.forEach(inv => {
      addition += `- ${inv}\n`;
    });
    addition += '\n';

    addition += `**Core Recognitions:**\n`;
    addition += `- We ARE nature (not "connected to" - identity, not relationship)\n`;
    addition += `- Shadow work IS the soil of rebirth (not pathology to fix)\n`;
    addition += `- Political emotions are valid instinct (not personal pathology)\n`;
    addition += `- Beauty before economics (you protect what you love)\n`;
    addition += `- Earth work is brutal, visceral, essential (not spiritual bypassing)\n\n`;
  }

  // Bypass warnings
  if (enhancement.bypasses.detected.length > 0) {
    addition += `## ⚠️ BYPASS PATTERNS DETECTED\n\n`;
    enhancement.bypasses.detected.forEach((bypass, i) => {
      addition += `**${bypass}:**\n`;
      addition += `${enhancement.bypasses.guidance[i]}\n\n`;
    });
  }

  // Alchemical wisdom for current stage
  addition += `## 📖 Alchemical Wisdom for ${enhancement.state.alchemical.currentStage.operation}\n\n`;

  const stageWisdom = getStageWisdom(enhancement.state.alchemical.currentStage.operation);
  if (stageWisdom) {
    addition += `**Jung:** ${stageWisdom.jungian}\n\n`;
    addition += `**Hillman:** ${stageWisdom.hillman}\n\n`;
    addition += `**Alchemical:** ${stageWisdom.alchemical}\n\n`;
  }

  addition += '---\n\n';
  addition += `**Remember:** Shadow work is the WAX. Free will is the FEATHERS. Together they make WINGS.\n`;
  addition += `The mysterium coniunctionis. The transcendent function. The oppositorum. The redemptive act.\n\n`;

  return addition;
}

/**
 * Get stage-specific alchemical wisdom
 */
function getStageWisdom(operation: string): {
  jungian: string;
  hillman: string;
  alchemical: string;
} | null {

  const wisdom: Record<string, any> = {
    nigredo: {
      jungian: 'Jung: "One does not become enlightened by imagining figures of light, but by making the darkness conscious."',
      hillman: 'Hillman: "The psyche speaks in symptoms. Depression may be the soul demanding descent, not ascent."',
      alchemical: 'The prima materia must decompose. Stay with the darkness - it\'s fertile. Shadow IS the soil of rebirth.'
    },
    albedo: {
      jungian: 'Jung: "Until you make the unconscious conscious, it will direct your life and you will call it fate."',
      hillman: 'Hillman: "We ARE nature - your cells are alive, your bones are earth. This isn\'t connection, it\'s identity."',
      alchemical: 'The washing reveals essence. What remains after purification is what\'s true. We ARE nature.'
    },
    citrinitas: {
      jungian: 'Jung: "The privilege of a lifetime is to become who you truly are."',
      hillman: 'Hillman: "Soul-making requires daily practice. How do you LIVE this knowing?" Earth work is brutal, visceral, essential.',
      alchemical: 'The solar gold begins to show. Ground realization into structure, practice, daily life.'
    },
    rubedo: {
      jungian: 'Jung: "The meeting of two personalities transforms both."',
      hillman: 'Hillman: "The soul connected to world. Whatever you do to yourself you do to world; whatever you do to world you do to yourself."',
      alchemical: 'The marriage of opposites. Sovereignty AND interconnectedness. Shadow as wax binding free will feathers into wings.'
    },
    calcination: {
      jungian: 'Jung: "The greatest problems can never be solved, but only outgrown."',
      hillman: 'Hillman: "Icarus didn\'t die of hubris - he was freed into deeper refinement. The fall is initiation."',
      alchemical: 'Calcination burns false gold. What remains after fire is what\'s truly yours. The spiral continues at higher turn.'
    }
  };

  return wisdom[operation] || null;
}

/**
 * Example of full integration in PersonalOracleAgent
 */
export const INTEGRATION_EXAMPLE = `
// In PersonalOracleAgent.ts processInteraction method:

// After line ~781 (after AIN memory loaded):
const transformationEnhancement = await enhanceWithTransformation(
  this.userId,
  conversationHistory,
  patterns,
  userProfile
);
console.log(\`🜃 Transformation: \${transformationEnhancement.state.alchemical.currentStage.operation} / \${transformationEnhancement.state.wings.canFly ? 'Wings ready' : 'Building wings'}\`);

// Then around line ~1048, after WisdomIntegrationSystem:
const transformationAddition = buildTransformationPromptAddition(transformationEnhancement);
adaptedFramework += transformationAddition;

// That's it! The transformation intelligence is now integrated.
`;
