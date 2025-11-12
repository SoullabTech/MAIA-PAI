// lib/utils/modelService.ts
// AI model service wrapper
//
// SECURITY FIX: Removed direct OpenAI client instantiation from browser code
// Now uses secure server-side API endpoints instead

"use strict";

export interface ModelResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ModelOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

class ModelService {
  constructor() {
    // No direct API key handling in browser-side code
    // All API calls go through secure server endpoints
  }

  /**
   * Generate AI response
   */
  async generate(
    prompt: string,
    options: ModelOptions = {}
  ): Promise<ModelResponse> {
    try {
      const messages: any[] = [];

      if (options.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt
        });
      }

      messages.push({
        role: 'user',
        content: prompt
      });

      // Use secure server-side Claude API instead of direct OpenAI client
      const response = await fetch('/api/claude/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options.model || 'claude-3-5-sonnet-20241022',
          max_tokens: options.maxTokens || 500,
          system: options.systemPrompt,
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature ?? 0.7,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text || '';

      return {
        content,
        usage: data.usage ? {
          promptTokens: data.usage.input_tokens || 0,
          completionTokens: data.usage.output_tokens || 0,
          totalTokens: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0),
        } : undefined,
      };
    } catch (error) {
      console.error('Model service error:', error);
      throw new Error('Failed to generate response');
    }
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return this.openai !== null;
  }
}

// Export singleton instance
export default new ModelService();