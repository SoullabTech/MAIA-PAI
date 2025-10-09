/**
 * 🎤 Elemental Voice Transcription Endpoint
 *
 * Uses OpenAI Whisper API (cloud, fast, reliable)
 * Optional: Can use self-hosted Whisper for sovereignty
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const WHISPER_API_URL = process.env.WHISPER_API_URL || 'http://localhost:8001';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const USE_WHISPER_SELF_HOSTED = process.env.USE_WHISPER_PRIMARY === 'true';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function transcribeWithSelfHostedWhisper(audioFile: File): Promise<any> {
  const formData = new FormData();
  formData.append('audio', audioFile);

  const response = await fetch(`${WHISPER_API_URL}/transcribe`, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(10000) // 10s timeout
  });

  if (!response.ok) {
    throw new Error(`Self-hosted Whisper API error: ${response.status}`);
  }

  return response.json();
}

async function transcribeWithOpenAI(audioFile: File): Promise<any> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  // Convert File to Node.js compatible format
  const arrayBuffer = await audioFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Create a File-like object that OpenAI SDK accepts
  const file = new File([buffer], audioFile.name || 'audio.webm', {
    type: audioFile.type || 'audio/webm'
  });

  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
    language: 'en',
    response_format: 'json'
  });

  return {
    transcript: transcription.text,
    confidence: 1.0 // OpenAI doesn't provide confidence scores
  };
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({
        success: false,
        error: 'No audio file provided'
      }, { status: 400 });
    }

    console.log('🎤 Transcribing audio:', {
      size: audioFile.size,
      type: audioFile.type,
      primary: USE_WHISPER_SELF_HOSTED ? 'Whisper (self-hosted, $0)' : 'OpenAI Whisper (cloud)'
    });

    let transcript = '';
    let confidence = 0;
    let provider = '';

    // Try primary provider
    try {
      if (USE_WHISPER_SELF_HOSTED) {
        // Try self-hosted Whisper first ($0 cost, sovereignty)
        console.log('🔥 Trying self-hosted Whisper...');
        const result = await transcribeWithSelfHostedWhisper(audioFile);
        transcript = result.transcript;
        confidence = result.confidence;
        provider = 'whisper-self-hosted';
        console.log(`✅ Self-hosted Whisper success: ${result.processingTime}ms`);
      } else {
        // Use OpenAI Whisper API (cloud, reliable)
        console.log('☁️  Using OpenAI Whisper API...');
        const result = await transcribeWithOpenAI(audioFile);
        transcript = result.transcript;
        confidence = result.confidence;
        provider = 'openai-whisper';
      }
    } catch (primaryError) {
      console.log(`⚠️  Primary provider failed: ${primaryError}`);

      // Fallback to secondary provider
      try {
        if (USE_WHISPER_SELF_HOSTED) {
          console.log('☁️  Falling back to OpenAI Whisper...');
          const result = await transcribeWithOpenAI(audioFile);
          transcript = result.transcript;
          confidence = result.confidence;
          provider = 'openai-whisper-fallback';
        } else {
          console.log('🔥 Falling back to self-hosted Whisper...');
          const result = await transcribeWithSelfHostedWhisper(audioFile);
          transcript = result.transcript;
          confidence = result.confidence;
          provider = 'whisper-self-hosted-fallback';
        }
      } catch (fallbackError) {
        console.error('❌ Both Whisper providers failed:', fallbackError);
        throw new Error('All Whisper transcription providers failed');
      }
    }

    const processingTime = Date.now() - startTime;
    console.log(`⚡ Transcription complete: ${processingTime}ms (${provider})`, {
      transcript: transcript.substring(0, 50),
      confidence
    });

    return NextResponse.json({
      success: true,
      transcript,
      confidence,
      processingTime,
      provider
    });

  } catch (error) {
    console.error('❌ Transcription error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to transcribe audio'
    }, { status: 500 });
  }
}
