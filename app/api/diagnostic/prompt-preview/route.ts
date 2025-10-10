import { NextRequest, NextResponse } from 'next/server';
import { PersonalOracleAgent } from '@/lib/agents/PersonalOracleAgent';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId') || 'test_user';

    // Create agent
    const agent = await PersonalOracleAgent.loadAgent(userId);

    // Get a test interaction to see what prompt looks like
    const testInput = "Hello MAIA";

    // Call processInteraction but intercept to see the prompt
    // This is a diagnostic - we'll create a modified version that returns the prompt

    return NextResponse.json({
      success: true,
      message: "Check server logs for prompt details",
      userId
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
