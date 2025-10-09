/**
 * 🎤 Elemental Voice Transcription Endpoint
 *
 * Tries Whisper (self-hosted, $0 cost) first, falls back to Deepgram
 * Path to 100% sovereignty
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';

const WHISPER_API_URL = process.env.WHISPER_API_URL || 'http://localhost:8001';
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || '';
const USE_WHISPER_PRIMARY = process.env.USE_WHISPER_PRIMARY === 'true';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function transcribeWithWhisper(audioFile: File): Promise<any> {
  const formData = new FormData();
  formData.append('audio', audioFile);

  const response = await fetch(`${WHISPER_API_URL}/transcribe`, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(10000) // 10s timeout
  });

  if (!response.ok) {
    throw new Error(`Whisper API error: ${response.status}`);
  }

  return response.json();
}

async function transcribeWithDeepgram(audioFile: File): Promise<any> {
  const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
  const deepgram = createClient(DEEPGRAM_API_KEY);

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    audioBuffer,
    {
      model: 'nova-2',
      language: 'en-US',
      smart_format: true,
      punctuate: true,
      utterances: true
    }
  );

  if (error) {
    throw new Error(`Deepgram error: ${error}`);
  }

  const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
  const confidence = result?.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;

  return { transcript, confidence };
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
      primary: USE_WHISPER_PRIMARY ? 'Whisper (self-hosted)' : 'Deepgram (cloud)'
    });

    let transcript = '';
    let confidence = 0;
    let provider = '';

    // Try primary provider
    try {
      if (USE_WHISPER_PRIMARY) {
        // Try Whisper first (self-hosted, $0 cost)
        console.log('🔥 Trying Whisper (self-hosted)...');
        const result = await transcribeWithWhisper(audioFile);
        transcript = result.transcript;
        confidence = result.confidence;
        provider = 'whisper';
        console.log(`✅ Whisper success: ${result.processingTime}ms`);
      } else {
        // Try Deepgram first
        console.log('☁️  Trying Deepgram (cloud)...');
        const result = await transcribeWithDeepgram(audioFile);
        transcript = result.transcript;
        confidence = result.confidence;
        provider = 'deepgram';
      }
    } catch (primaryError) {
      console.log(`⚠️  Primary provider failed: ${primaryError}`);

      // Fallback to secondary provider
      try {
        if (USE_WHISPER_PRIMARY) {
          console.log('☁️  Falling back to Deepgram...');
          const result = await transcribeWithDeepgram(audioFile);
          transcript = result.transcript;
          confidence = result.confidence;
          provider = 'deepgram';
        } else {
          console.log('🔥 Falling back to Whisper...');
          const result = await transcribeWithWhisper(audioFile);
          transcript = result.transcript;
          confidence = result.confidence;
          provider = 'whisper';
        }
      } catch (fallbackError) {
        console.error('❌ Both providers failed:', fallbackError);
        throw new Error('All transcription providers failed');
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
