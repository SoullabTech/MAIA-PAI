import { NextResponse } from 'next/server';
import { simpleMemoryCapture } from '@/lib/services/simple-memory-capture';

export async function POST() {
  try {
    console.log('[TEST] Starting direct memory capture test...');

    const testUserId = 'test-direct-123';
    const testSessionId = 'session-test-123';

    // Directly call the capture function
    await simpleMemoryCapture.capture({
      userId: testUserId,
      sessionId: testSessionId,
      userInput: 'I feel anxious and worried about everything.',
      mayaResponse: 'I hear your concern.',
      emotionalTone: 'water',
      isKeyMoment: true,
      isTransformative: false
    });

    console.log('[TEST] Capture function completed');

    // Get metrics for the same user
    const metrics = await simpleMemoryCapture.getMetrics(testUserId);

    return NextResponse.json({
      success: true,
      message: 'Direct memory capture test completed',
      metrics
    });

  } catch (error: any) {
    console.error('[TEST] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
