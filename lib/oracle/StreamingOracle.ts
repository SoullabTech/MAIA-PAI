// backend
// lib/oracle/StreamingOracle.ts
import OpenAI from "openai";

export type StreamChunk = { text: string; done?: boolean };

export async function* streamOracleText(
  prompt: string,
  opts?: { model?: string }
): AsyncGenerator<StreamChunk> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const res = await client.chat.completions.create({
    model: opts?.model ?? (process.env.OPENAI_MODEL ?? "gpt-4o-mini"),
    stream: true,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  for await (const delta of res) {
    const piece = delta.choices?.[0]?.delta?.content ?? "";
    if (piece) yield { text: piece };
  }
  return { text: "", done: true };
}
