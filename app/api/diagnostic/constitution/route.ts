/**
 * Constitutional Knowledge Diagnostic
 * Test endpoint to verify MAIA has Constitutional knowledge loaded
 */

import { NextResponse } from 'next/server';
import { getConstitutionalFoundation } from '@/lib/knowledge/ConstitutionalAIKnowledge';
import { WisdomIntegrationSystem } from '@/lib/knowledge/WisdomIntegrationSystem';

export async function GET() {
  try {
    // Test 1: Can we import and call getConstitutionalFoundation?
    const constitutionalKnowledge = getConstitutionalFoundation();

    // Test 2: Does WisdomIntegrationSystem include it?
    const foundationWisdom = WisdomIntegrationSystem.getFoundationWisdom();

    // Test 3: Full system prompt
    const fullSystemPrompt = WisdomIntegrationSystem.getSystemPrompt({
      depth: 'deep',
      userQuestion: 'What are your Constitutional principles?',
      phase: 'fire'
    });

    return NextResponse.json({
      status: 'success',
      tests: {
        constitutionalKnowledgeLoaded: constitutionalKnowledge.length > 0,
        constitutionalKnowledgeLength: constitutionalKnowledge.length,
        foundationWisdomIncludesConstitution: foundationWisdom.includes('CONSTITUTIONAL FOUNDATION'),
        foundationWisdomLength: foundationWisdom.length,
        fullPromptIncludesConstitution: fullSystemPrompt.includes('CONSTITUTIONAL FOUNDATION'),
        fullPromptLength: fullSystemPrompt.length
      },
      samples: {
        constitutionalStart: constitutionalKnowledge.substring(0, 500),
        foundationStart: foundationWisdom.substring(0, 800),
        fullPromptStart: fullSystemPrompt.substring(0, 1000)
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
