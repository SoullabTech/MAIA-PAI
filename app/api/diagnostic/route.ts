/**
 * Diagnostic endpoint to test PersonalOracleAgent directly
 * Visit: /api/diagnostic to see detailed error information
 */

import { NextResponse } from 'next/server';
import { PersonalOracleAgent } from '@/lib/agents/PersonalOracleAgent';

// Force dynamic rendering - this is a diagnostic endpoint
export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nodeEnv: process.env.NODE_ENV
    },
    tests: []
  };

  // Test 1: Can we instantiate PersonalOracleAgent?
  try {
    const agent = new PersonalOracleAgent('test_user_123', {});
    diagnostics.tests.push({
      name: 'PersonalOracleAgent instantiation',
      status: 'PASS',
      message: 'Agent created successfully'
    });

    // Test 2: Can we call processInteraction?
    try {
      const response = await agent.processInteraction('Hello', {
        conversationHistory: []
      });

      diagnostics.tests.push({
        name: 'processInteraction call',
        status: 'PASS',
        response: response.response.substring(0, 100),
        element: response.element,
        hasError: !!response.metadata?.error
      });

      if (response.metadata?.error) {
        diagnostics.tests.push({
          name: 'Error details from metadata',
          status: 'ERROR_CAPTURED',
          error: response.metadata.error,
          errorType: response.metadata.errorType,
          errorStack: response.metadata.errorStack
        });
      }

    } catch (processError: any) {
      diagnostics.tests.push({
        name: 'processInteraction call',
        status: 'FAIL',
        error: {
          message: processError.message,
          name: processError.name,
          stack: processError.stack,
          cause: processError.cause
        }
      });
    }

  } catch (instantiationError: any) {
    diagnostics.tests.push({
      name: 'PersonalOracleAgent instantiation',
      status: 'FAIL',
      error: {
        message: instantiationError.message,
        name: instantiationError.name,
        stack: instantiationError.stack
      }
    });
  }

  return NextResponse.json(diagnostics, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
