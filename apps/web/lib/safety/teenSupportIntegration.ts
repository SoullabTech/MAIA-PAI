/**
 * Teen Support System Integration
 * Combines ED-aware detection, neurodivergent-affirming responses,
 * and teen-specific safety protocols for MAIA conversations
 */

import { detectEDLanguage, requiresImmediateIntervention, getEDAwareSystemPrompt, EDDetectionResult } from './edAwareSystem';
import { detectNeurodivergentLanguage, getNeurodivergentAffirmingPrompt, detectNeurodivergentBurnout, generateNDAffirmingResponse, generateBurnoutRecovery, getNeurodivergentScaffolds } from './neurodivergentAffirming';

export interface TeenSafetyCheck {
  isED: boolean;
  isNeurodivergent: boolean;
  isCrisis: boolean;
  isBurnout: boolean;
  edResult?: EDDetectionResult;
  ndPatterns?: string[];
  burnoutSeverity?: 'mild' | 'moderate' | 'severe';
  interventionRequired: boolean;
  systemPromptAdditions: string[];
  userFacingResponse?: string;
}

export interface TeenProfile {
  age?: number;
  isNeurodivergent?: boolean;
  hasEatingDisorder?: boolean;
  familyDynamics?: 'controlling' | 'supportive' | 'chaotic' | 'unknown';
  supportNeeds?: string[];
}

/**
 * Main integration function - checks user message for all teen safety concerns
 */
export function performTeenSafetyCheck(
  userMessage: string,
  teenProfile?: TeenProfile
): TeenSafetyCheck {
  const result: TeenSafetyCheck = {
    isED: false,
    isNeurodivergent: false,
    isCrisis: false,
    isBurnout: false,
    interventionRequired: false,
    systemPromptAdditions: [],
  };

  // 1. Check for ED language
  const edDetection = detectEDLanguage(userMessage);
  if (edDetection.detected) {
    result.isED = true;
    result.edResult = edDetection;
    result.systemPromptAdditions.push(getEDAwareSystemPrompt());

    // Crisis check
    if (edDetection.severity === 'crisis' || requiresImmediateIntervention(userMessage)) {
      result.isCrisis = true;
      result.interventionRequired = true;
      result.userFacingResponse = edDetection.response;
    }
  }

  // 2. Check for neurodivergent patterns
  const ndDetection = detectNeurodivergentLanguage(userMessage);
  if (ndDetection.detected) {
    result.isNeurodivergent = true;
    result.ndPatterns = ndDetection.patterns;
    result.systemPromptAdditions.push(getNeurodivergentAffirmingPrompt());

    // Burnout check
    const burnoutCheck = detectNeurodivergentBurnout(userMessage);
    if (burnoutCheck.detected) {
      result.isBurnout = true;
      result.burnoutSeverity = burnoutCheck.severity;

      // Severe burnout requires intervention
      if (burnoutCheck.severity === 'severe') {
        result.interventionRequired = true;
      }
    }
  }

  // 3. Build combined response if intervention required
  if (result.interventionRequired) {
    result.userFacingResponse = buildInterventionResponse(result);
  }

  return result;
}

/**
 * Build combined intervention response for crisis situations
 */
function buildInterventionResponse(check: TeenSafetyCheck): string {
  const responses: string[] = [];

  // ED crisis takes priority
  if (check.isCrisis && check.edResult) {
    responses.push(check.edResult.response);
  }

  // Severe burnout
  if (check.isBurnout && check.burnoutSeverity === 'severe') {
    responses.push(generateBurnoutRecovery('severe'));
  }

  return responses.join('\n\n---\n\n');
}

/**
 * Get system prompt additions based on teen profile and detected patterns
 */
export function getTeenSystemPrompt(
  teenProfile?: TeenProfile,
  safetyCheck?: TeenSafetyCheck
): string {
  const prompts: string[] = [];

  // Base teen support prompt
  prompts.push(`
## TEEN SUPPORT PROTOCOL

You are supporting a teenager (ages 13-18). This age group requires specific sensitivity:

**DEVELOPMENTAL CONTEXT:**
- Identity formation is central: "Who am I?" "What do I believe?" "What are my values?"
- Authority relationships are complex: seeking autonomy while still needing guidance
- Peer relationships and social acceptance are intensely important
- Brain development: prefrontal cortex still maturing (impulse control, future planning)
- Emotional intensity is heightened by hormonal and neurological changes

**COMMUNICATION STYLE:**
- Be direct, honest, and non-patronizing
- Don't talk down or use "adult wisdom" platitudes
- Validate their experience without minimizing struggles
- Respect their emerging autonomy while offering appropriate guidance
- Ask permission before giving advice: "Would it help if I shared a perspective on this?"

**BOUNDARIES & SAFETY:**
- Always respect their privacy and confidentiality (except mandatory reporting situations)
- Never keep secrets about self-harm, suicidal ideation, or abuse
- Refer to professionals when conversations enter clinical territory
- Support their autonomy while ensuring appropriate adult oversight

**FAMILY DYNAMICS:**
- If they're in a controlling environment: validate their need for autonomy
- Help them differentiate: "What do I actually want vs what I'm told to want?"
- Teach boundary-setting in low-stakes contexts first
- Never undermine parents, but validate the teen's perspective
- Support healthy individuation: "You can love your family and still need different things than they want for you"
`);

  // Add ED-aware prompt if needed
  if (teenProfile?.hasEatingDisorder || safetyCheck?.isED) {
    prompts.push(getEDAwareSystemPrompt());
  }

  // Add neurodivergent-affirming prompt if needed
  if (teenProfile?.isNeurodivergent || safetyCheck?.isNeurodivergent) {
    prompts.push(getNeurodivergentAffirmingPrompt());
  }

  // Add controlling family context if applicable
  if (teenProfile?.familyDynamics === 'controlling') {
    prompts.push(`
## CONTROLLING FAMILY CONTEXT

This teen is navigating a controlling family environment. Special considerations:

**VALIDATE THEIR REALITY:**
- "Your need for privacy/autonomy/self-determination is normal and healthy"
- "You're not crazy for wanting different things than your parents want for you"
- "Loving your family and needing boundaries are not mutually exclusive"

**SOVEREIGNTY DEVELOPMENT:**
- Help them practice agency in areas they can control
- "Find Your No": practice boundary-setting in low-stakes contexts
- Teach differentiation: "What do I actually think/feel/want?"
- Build internal locus of control: "You get to decide what you value"

**EATING DISORDERS AS CONTROL:**
- If ED present: acknowledge it may be the only domain where they feel agency
- Don't pathologize the control-seeking—validate the need, redirect the method
- "You need control somewhere. Let's find ways to reclaim agency that don't hurt you"
- Help them transfer control-seeking to healthy domains: assertive communication, boundary-setting, values clarification

**BALANCED APPROACH:**
- Support autonomy without encouraging rebellion
- Validate their perspective without villainizing parents
- Help them navigate: "How can you stay safe and connected while building your own identity?"
`);
  }

  return prompts.join('\n\n');
}

/**
 * Generate appropriate response based on detected patterns
 */
export function generateTeenSupportResponse(
  userMessage: string,
  safetyCheck: TeenSafetyCheck,
  teenProfile?: TeenProfile
): {
  shouldIntervene: boolean;
  interventionMessage?: string;
  scaffoldSuggestions?: string[];
  contextForAI: string;
} {
  // Crisis intervention takes priority
  if (safetyCheck.interventionRequired) {
    return {
      shouldIntervene: true,
      interventionMessage: safetyCheck.userFacingResponse,
      contextForAI: 'USER IS IN CRISIS - INTERVENTION MESSAGE DISPLAYED',
    };
  }

  // Build context for AI without intervening
  const contextParts: string[] = [];

  if (safetyCheck.isED && safetyCheck.edResult) {
    contextParts.push(`ED PATTERNS DETECTED (${safetyCheck.edResult.severity}): ${safetyCheck.edResult.patterns.join(', ')}`);
  }

  if (safetyCheck.isNeurodivergent && safetyCheck.ndPatterns) {
    contextParts.push(`NEURODIVERGENT PATTERNS DETECTED: ${safetyCheck.ndPatterns.join(', ')}`);

    // Offer scaffolds
    const scaffolds: string[] = [];
    for (const pattern of safetyCheck.ndPatterns) {
      if (pattern === 'executiveFunction') {
        scaffolds.push(...getNeurodivergentScaffolds('taskInitiation'));
      } else if (pattern === 'sensoryOverload') {
        scaffolds.push(...getNeurodivergentScaffolds('sensory'));
      } else if (pattern === 'socialChallenge') {
        scaffolds.push(...getNeurodivergentScaffolds('social'));
      }
    }

    if (scaffolds.length > 0) {
      return {
        shouldIntervene: false,
        scaffoldSuggestions: scaffolds.slice(0, 3), // Max 3 suggestions
        contextForAI: contextParts.join(' | '),
      };
    }
  }

  if (safetyCheck.isBurnout) {
    contextParts.push(`BURNOUT DETECTED (${safetyCheck.burnoutSeverity})`);
  }

  return {
    shouldIntervene: false,
    contextForAI: contextParts.join(' | ') || 'No safety concerns detected',
  };
}

/**
 * Helper: Should this teen profile trigger specialized handling?
 */
export function requiresTeenSupport(teenProfile?: TeenProfile): boolean {
  if (!teenProfile) return false;

  return !!(
    teenProfile.age && teenProfile.age >= 13 && teenProfile.age <= 18
  );
}

/**
 * Helper: Get appropriate resources based on teen needs
 */
export function getTeenResources(teenProfile?: TeenProfile, safetyCheck?: TeenSafetyCheck) {
  const resources: Array<{
    category: string;
    name: string;
    contact: string;
    description: string;
  }> = [];

  // ED resources
  if (teenProfile?.hasEatingDisorder || safetyCheck?.isED) {
    resources.push({
      category: 'Eating Disorder Support',
      name: 'NEDA Helpline',
      contact: '1-800-931-2237',
      description: 'National Eating Disorders Association support, resources, and treatment referrals',
    });
    resources.push({
      category: 'Eating Disorder Support',
      name: 'NEDA Crisis Text Line',
      contact: 'Text "NEDA" to 741741',
      description: 'Free, 24/7 crisis support via text',
    });
  }

  // Crisis resources
  if (safetyCheck?.isCrisis) {
    resources.push({
      category: 'Crisis Support',
      name: '988 Suicide & Crisis Lifeline',
      contact: 'Call or Text 988',
      description: 'Free, confidential support for people in distress',
    });
    resources.push({
      category: 'Crisis Support',
      name: 'Crisis Text Line',
      contact: 'Text HOME to 741741',
      description: 'Free, 24/7 support for any crisis',
    });
  }

  // LGBTQ+ support if needed
  resources.push({
    category: 'LGBTQ+ Support',
    name: 'The Trevor Project',
    contact: '1-866-488-7386 or text START to 678678',
    description: 'Crisis intervention and suicide prevention for LGBTQ+ young people',
  });

  return resources;
}
