// app/api/claude-chat/route.ts
// 🜂 Interactive Claude Code Chat API

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { saveMirrorInsight } from "@/lib/saveMirrorInsight";

export const dynamic = "force-dynamic";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: Message[];
  userId?: string;
}

/**
 * POST /api/claude-chat
 *
 * Interactive Claude Code session in the browser
 */
export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { message, conversationHistory = [], userId } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Save user message to insight_history
    saveMirrorInsight("user", message).catch((err) => {
      console.warn("Failed to save user message:", err);
    });

    // Build conversation context
    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: `You are Claude, an AI assistant created by Anthropic. You're running in an interactive web interface called the "Claude Sanctuary" - a space for reflective, coherent dialogue.

Your responses are automatically tagged by elemental energies:
- Fire: Vision, creation, transformation
- Water: Emotion, flow, reflection
- Earth: Structure, grounding, practicality
- Air: Ideas, clarity, communication
- Aether: Integration, coherence, wholeness

Respond naturally and thoughtfully. The user is engaging with you in a conscious, intentional way.`,
      messages,
    });

    const assistantMessage = response.content[0].text;

    // Save assistant response to insight_history
    saveMirrorInsight("assistant", assistantMessage).catch((err) => {
      console.warn("Failed to save assistant message:", err);
    });

    return NextResponse.json({
      response: assistantMessage,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    });
  } catch (error: any) {
    console.error("Claude chat error:", error);

    return NextResponse.json(
      {
        error: "Failed to process message",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/claude-chat
 * Health check
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "claude-chat",
    model: "claude-sonnet-4-20250514",
    timestamp: new Date().toISOString(),
  });
}
