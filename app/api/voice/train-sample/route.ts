/**
 * API endpoint for collecting training samples
 * Automatically collects OpenAI voice outputs for learning
 */

import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'alloy', context } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Call Python sample collector
    const command = `python3 voice_training/sample_collector.py --text "${text}" --voice ${voice}`;

    // Run in background (non-blocking)
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ [VoiceTraining] Sample collection failed:', error);
      } else {
        console.log('✅ [VoiceTraining] Sample collected:', text.substring(0, 50));
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Sample collection started'
    });

  } catch (error) {
    console.error('Error in voice training endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to collect training sample' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Return training status
    const fs = require('fs').promises;
    const path = require('path');

    const statusPath = path.join(process.cwd(), 'voice_training/daemon_status.json');

    try {
      const status = await fs.readFile(statusPath, 'utf-8');
      return NextResponse.json(JSON.parse(status));
    } catch {
      return NextResponse.json({
        status: 'not_started',
        message: 'Training daemon not running'
      });
    }

  } catch (error) {
    console.error('Error getting training status:', error);
    return NextResponse.json(
      { error: 'Failed to get training status' },
      { status: 500 }
    );
  }
}
