// backend
// app/api/voice/stream/route.ts
import { NextRequest } from 'next/server';
import { streamOracleText } from '@/lib/oracle/StreamingOracle';
import { VoiceGenerationService } from '@/lib/services/oracle/VoiceGenerationService';

export const runtime = 'nodejs';

type Event = { type: 'text' | 'audio' | 'done'; payload?: any };

export async function POST(req: NextRequest) {
  const { prompt, voiceId } = (await req.json()) as { prompt: string; voiceId: string };

  const encoder = new TextEncoder();
  const voice = new VoiceGenerationService(voiceId);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (evt: Event) => controller.enqueue(encoder.encode(JSON.stringify(evt) + '\n'));
      try {
        for await (const { text, done } of streamOracleText(prompt)) {
          if (done) break;
          send({ type: 'text', payload: text });
          await voice.handleChunk(text, async (audio) => {
            // Send audio as base64 to keep transport simple
            send({ type: 'audio', payload: Buffer.from(audio).toString('base64') });
          });
        }
        await voice.flushRemainder(async (audio) => {
          send({ type: 'audio', payload: Buffer.from(audio).toString('base64') });
        });
        send({ type: 'done' });
        controller.close();
      } catch (err) {
        send({ type: 'done' });
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'Transfer-Encoding': 'chunked',
    },
  });
}
