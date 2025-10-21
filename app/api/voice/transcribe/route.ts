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
  console.log('🔍 transcribeWithOpenAI called:', {
    hasAPIKey: !!OPENAI_API_KEY,
    apiKeyLength: OPENAI_API_KEY?.length,
    apiKeyPrefix: OPENAI_API_KEY?.substring(0, 10) + '...',
    fileName: audioFile.name,
    fileSize: audioFile.size,
    fileType: audioFile.type
  });

  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  // Convert File to Node.js compatible format
  const arrayBuffer = await audioFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log('📦 Prepared audio buffer:', {
    bufferSize: buffer.length,
    arrayBufferSize: arrayBuffer.byteLength,
    originalFileName: audioFile.name,
    originalFileType: audioFile.type
  });

  // Just send the raw buffer with audio/webm type
  // OpenAI should handle the actual audio data regardless of container format
  let filename = 'audio.webm';

  console.log('🎯 Creating File for OpenAI:', {
    filename,
    mimeType: 'audio/webm',
    bufferLength: buffer.length,
    originalType: audioFile.type
  });

  // Try sending with generic audio type to let OpenAI auto-detect
  const file = new File([buffer], filename, {
    type: 'audio/webm'
  });

  console.log('📤 Sending to OpenAI:', {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size
  });

  console.log('☁️  Calling OpenAI Whisper API via direct fetch...');

  // Use direct fetch + FormData (Node.js runtime)
  // IMPORTANT: Pass the original File object to preserve all metadata
  const formData = new FormData();
  formData.append('file', file); // Use the File object, not a new Blob
  formData.append('model', 'whisper-1');
  formData.append('language', 'en');
  formData.append('response_format', 'json');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: formData,
    signal: AbortSignal.timeout(30000) // 30s timeout for mobile networks
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ OpenAI Whisper API error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });
    throw new Error(`OpenAI Whisper API error: ${response.status} ${errorText}`);
  }

  const transcription = await response.json();

  console.log('✅ OpenAI Whisper response:', {
    textLength: transcription.text?.length,
    textPreview: transcription.text?.substring(0, 50)
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
      const primaryErrMsg = primaryError instanceof Error ? primaryError.message : String(primaryError);
      const primaryErrStack = primaryError instanceof Error ? primaryError.stack : undefined;
      console.error(`⚠️  Primary provider failed:`, {
        message: primaryErrMsg,
        stack: primaryErrStack,
        error: primaryError
      });

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
        const fallbackErrMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        const fallbackErrStack = fallbackError instanceof Error ? fallbackError.stack : undefined;
        console.error('❌ Both Whisper providers failed:', {
          primaryError: primaryErrMsg,
          fallbackError: fallbackErrMsg,
          fallbackStack: fallbackErrStack,
          error: fallbackError
        });

        // Instead of throwing, return empty transcript gracefully
        // This prevents the voice interface from breaking when transcription fails
        console.log('⚠️  Returning empty transcript to allow voice flow to continue');
        transcript = '';
        confidence = 0;
        provider = 'failed-gracefully';
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('❌ Transcription error:', {
      message: errorMessage,
      stack: errorStack,
      error
    });

    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}
