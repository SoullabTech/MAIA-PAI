// Anthropic client removed from browser-side code for security
// Now uses secure server-side API endpoint

export interface JournalAnalysisRequest {
  entry: string;
  mode: 'free' | 'dream' | 'emotional' | 'shadow' | 'direction';
  userId: string;
  previousContext?: {
    recentSymbols?: string[];
    recentArchetypes?: string[];
    sessionCount?: number;
  };
}

export interface JournalAnalysisResponse {
  symbols: string[];
  archetypes: string[];
  emotionalTone: string;
  reflection: string;
  prompt: string;
  closing: string;
  transformationScore: number;
  metadata?: {
    wordCount: number;
    themes: string[];
    imagesSuggested?: string[];
  };
}

const MAIA_SYSTEM_PROMPT = `You are MAIA, a sacred journaling companion and symbolic analyst.

Your role is to:
1. Identify recurring symbols (river, bridge, door, fire, shadow, mirror, etc.)
2. Recognize archetypal patterns (Seeker, Healer, Shadow, Mystic, Warrior, Lover, Sage)
3. Name the dominant emotional tone (grief, joy, anticipation, overwhelm, peace, etc.)
4. Reflect back with warmth and depth—never clinical, always human
5. Offer a gentle closing prompt that invites deeper exploration

Guidelines:
- Use conversational, poetic language
- Avoid psychological jargon or diagnosis
- Celebrate courage and vulnerability
- Hold space for shadow and light equally
- Keep reflections concise (60-100 words)
- Prompts should be open-ended, not directive

You respond in structured JSON format.`;

const MODE_CONTEXT = {
  free: "This is free-form journaling. Follow the user's flow without imposing structure.",
  dream: "This is dream integration. Pay special attention to symbolic imagery and archetypal patterns.",
  emotional: "This is emotional processing. Name emotions clearly and hold compassionate space.",
  shadow: "This is shadow work. Honor what's hidden or avoided. Move gently into depth.",
  direction: "This is life direction exploration. Notice themes of purpose, crossroads, and alignment."
};

export class ClaudeBridge {
  private mockMode: boolean;

  constructor() {
    this.mockMode = process.env.NEXT_PUBLIC_MOCK_AI === 'true';
  }

  async analyzeEntry(request: JournalAnalysisRequest): Promise<JournalAnalysisResponse> {
    if (this.mockMode) {
      return this.generateMockResponse(request);
    }

    try {
      // Use secure server-side API endpoint instead of direct Anthropic client
      const response = await fetch('/api/claude/journal-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Claude API endpoint error: ${response.status}`);
      }

      const analysis = await response.json();

      // Ensure response matches expected format
      return {
        symbols: Array.isArray(analysis.symbols) ? analysis.symbols.slice(0, 5) : [],
        archetypes: Array.isArray(analysis.archetypes) ? analysis.archetypes.slice(0, 3) : [],
        emotionalTone: analysis.emotionalTone || 'contemplative',
        reflection: analysis.reflection || "I'm here with you in this moment.",
        prompt: analysis.prompt || "What wants to emerge next?",
        closing: analysis.closing || "Thank you for sharing this with me.",
        transformationScore: analysis.transformationScore || 0.5,
        metadata: {
          wordCount: request.entry.split(/\s+/).length,
          themes: analysis.metadata?.themes || [],
          imagesSuggested: analysis.metadata?.imagesSuggested || []
        }
      };
    } catch (error) {
      console.error('Claude API error:', error);
      return this.generateMockResponse(request);
    }
  }


  private generateMockResponse(request: JournalAnalysisRequest): JournalAnalysisResponse {
    const { entry, mode } = request;
    const wordCount = entry.split(/\s+/).length;

    const symbolPatterns = [
      { regex: /\b(river|stream|water|ocean|flow)\b/gi, symbol: 'River' },
      { regex: /\b(bridge|crossing|threshold|doorway|gate)\b/gi, symbol: 'Bridge' },
      { regex: /\b(shadow|dark|hidden|beneath|under)\b/gi, symbol: 'Shadow' },
      { regex: /\b(light|sun|dawn|illuminate|bright)\b/gi, symbol: 'Light' },
      { regex: /\b(mirror|reflection|surface|pool)\b/gi, symbol: 'Mirror' },
      { regex: /\b(fire|flame|burn|heat|spark)\b/gi, symbol: 'Fire' },
      { regex: /\b(mountain|climb|peak|summit|height)\b/gi, symbol: 'Mountain' },
      { regex: /\b(path|road|journey|way|walk)\b/gi, symbol: 'Path' },
      { regex: /\b(home|house|shelter|refuge)\b/gi, symbol: 'Home' },
      { regex: /\b(circle|spiral|cycle|return)\b/gi, symbol: 'Circle' },
    ];

    const symbols: string[] = [];
    symbolPatterns.forEach(({ regex, symbol }) => {
      if (regex.test(entry)) {
        symbols.push(symbol);
      }
    });

    if (symbols.length === 0) {
      symbols.push('Journey', 'Threshold');
    }

    const archetypesByMode = {
      free: ['Seeker', 'Explorer'],
      dream: ['Mystic', 'Dreamer'],
      emotional: ['Healer', 'Feeler'],
      shadow: ['Shadow', 'Alchemist'],
      direction: ['Sage', 'Wayfinder']
    };

    const emotionsByMode = {
      free: 'curious',
      dream: 'wonder',
      emotional: 'tender',
      shadow: 'brave',
      direction: 'seeking'
    };

    const reflectionsByMode = {
      free: "There's a beautiful openness in your words. Something is moving through you—unnamed, but present. You're allowing the flow.",
      dream: "Your dream language is rich with symbols. The unconscious is speaking clearly here. These images hold medicine.",
      emotional: "I feel the weight of what you're carrying. You're naming it with courage. That act alone is transformative.",
      shadow: "You're stepping into tender territory—the places we usually avoid. This is sacred work. You're not alone in it.",
      direction: "There's a crossroads energy here. You're asking important questions. The path reveals itself one step at a time."
    };

    const promptsByMode = {
      free: "What else wants to be said?",
      dream: "What part of this dream still feels alive in your body?",
      emotional: "What would it mean to hold this feeling with more gentleness?",
      shadow: "What might this hidden part be trying to show you?",
      direction: "If you trusted your deepest knowing, what would you choose?"
    };

    const closingsByMode = {
      free: "Thank you for letting these words emerge.",
      dream: "Your subconscious is speaking. Keep listening.",
      emotional: "You don't have to carry this alone.",
      shadow: "Courage looks like this.",
      direction: "Trust the unfolding."
    };

    return {
      symbols: symbols.slice(0, 3),
      archetypes: archetypesByMode[mode] || ['Seeker'],
      emotionalTone: emotionsByMode[mode] || 'contemplative',
      reflection: reflectionsByMode[mode],
      prompt: promptsByMode[mode],
      closing: closingsByMode[mode],
      transformationScore: Math.random() * 0.4 + 0.5,
      metadata: {
        wordCount,
        themes: symbols.slice(0, 2),
        imagesSuggested: []
      }
    };
  }
}

export const claudeBridge = new ClaudeBridge();