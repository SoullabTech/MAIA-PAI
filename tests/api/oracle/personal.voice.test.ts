import { POST, GET } from '../../../apps/web/app/api/oracle/personal/route';
import { NextRequest } from 'next/server';
import { PersonalOracleAgent } from '../../../apps/web/lib/agents/PersonalOracleAgent';

jest.mock('../../../apps/web/lib/agents/PersonalOracleAgent');
jest.mock('../../../lib/storage/journal-storage', () => ({
  journalStorage: {
    getEntries: jest.fn(() => []),
  },
}));

const createMockRequest = (body: any, url: string = 'http://localhost:3000/api/oracle/personal') => {
  return {
    json: async () => body,
    nextUrl: new URL(url),
  } as NextRequest;
};

describe('🧪 MAIA Voice Integration Test Suite', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('✅ Test 1: API Returns Full MAIA Response', () => {
    it('should return complete symbolic response with voiceCharacteristics', async () => {
      const mockResponse = {
        response: "I hear the depth in what you're sharing.",
        element: 'water',
        metadata: {
          sessionId: 'session_123',
          phase: 'reflection',
          symbols: ['flow', 'depth'],
          archetypes: ['Healer'],
        },
        suggestions: ['Explore your emotional patterns'],
      };

      (PersonalOracleAgent.loadAgent as jest.Mock).mockResolvedValue({
        processInteraction: jest.fn().mockResolvedValue(mockResponse),
      });

      const request = createMockRequest({
        userId: 'test-user',
        userText: 'I feel overwhelmed by emotions today',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.text).toBe("I hear the depth in what you're sharing.");
      expect(data.element).toBe('water');
      expect(data.archetype).toBe('Healer');
      expect(data.voiceCharacteristics).toEqual({
        tone: 'gentle',
        pace: 'slow',
        energy: 'soft',
      });
      expect(data.metadata.spiralogicPhase).toBe('reflection');
      expect(data.version).toBe('v2.0.0');
      expect(data.source).toBe('personal-oracle-agent');
    });
  });

  describe('🎨 Test 2: Archetype → Voice Mapping', () => {
    const elementTests = [
      {
        element: 'fire',
        expected: { tone: 'uplifting', pace: 'fast', energy: 'expansive' },
        description: 'Fire element maps to uplifting/fast/expansive voice',
      },
      {
        element: 'water',
        expected: { tone: 'gentle', pace: 'slow', energy: 'soft' },
        description: 'Water element maps to gentle/slow/soft voice',
      },
      {
        element: 'earth',
        expected: { tone: 'grounding', pace: 'moderate', energy: 'focused' },
        description: 'Earth element maps to grounding/moderate/focused voice',
      },
      {
        element: 'air',
        expected: { tone: 'clear', pace: 'moderate', energy: 'light' },
        description: 'Air element maps to clear/moderate/light voice',
      },
      {
        element: 'aether',
        expected: { tone: 'warm', pace: 'moderate', energy: 'balanced' },
        description: 'Aether element maps to warm/moderate/balanced voice',
      },
    ];

    elementTests.forEach(({ element, expected, description }) => {
      it(description, async () => {
        (PersonalOracleAgent.loadAgent as jest.Mock).mockResolvedValue({
          processInteraction: jest.fn().mockResolvedValue({
            response: 'Test response',
            element,
            metadata: { phase: 'reflection', archetypes: ['Oracle'] },
          }),
        });

        const request = createMockRequest({
          userId: 'test-user',
          userText: 'Test input',
        });

        const response = await POST(request);
        const data = await response.json();

        expect(data.element).toBe(element);
        expect(data.voiceCharacteristics).toEqual(expected);
      });
    });
  });

  describe('🔁 Test 3: Fallback Chain Works', () => {
    it('should fallback to OpenAI when PersonalOracleAgent fails', async () => {
      (PersonalOracleAgent.loadAgent as jest.Mock).mockRejectedValue(
        new Error('Claude API unavailable')
      );

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'OpenAI fallback response' } }],
        }),
      }) as jest.Mock;

      process.env.OPENAI_API_KEY = 'test-key';

      const request = createMockRequest({
        userId: 'test-user',
        userText: 'Test input',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.text).toBe('OpenAI fallback response');
      expect(data.source).toBe('openai-fallback');
      expect(data.element).toBe('aether');
      expect(data.voiceCharacteristics).toEqual({
        tone: 'warm',
        pace: 'moderate',
        energy: 'balanced',
      });
    });

    it('should fallback to static responses when all AI services fail', async () => {
      (PersonalOracleAgent.loadAgent as jest.Mock).mockRejectedValue(
        new Error('Claude API unavailable')
      );

      global.fetch = jest.fn().mockRejectedValue(new Error('OpenAI unavailable'));

      const request = createMockRequest({
        userId: 'test-user',
        userText: 'Test input',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.text).toBeDefined();
      expect(data.source).toBe('ultimate-fallback');
      expect(data.fallback).toBe(true);
      expect(data.element).toBe('aether');
      expect(data.voiceCharacteristics).toEqual({
        tone: 'warm',
        pace: 'moderate',
        energy: 'balanced',
      });
      expect(data.metadata.spiralogicPhase).toBe('grounding');
    });
  });

  describe('🎤 Test 4: voiceCharacteristics → TTS Ready', () => {
    it('should return TTS-ready voiceCharacteristics structure', async () => {
      (PersonalOracleAgent.loadAgent as jest.Mock).mockResolvedValue({
        processInteraction: jest.fn().mockResolvedValue({
          response: 'Test response',
          element: 'fire',
          metadata: { phase: 'activation', archetypes: ['Catalyst'] },
        }),
      });

      const request = createMockRequest({
        userId: 'test-user',
        userText: 'I feel energized and ready for action',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.voiceCharacteristics).toBeDefined();
      expect(typeof data.voiceCharacteristics.tone).toBe('string');
      expect(typeof data.voiceCharacteristics.pace).toBe('string');
      expect(typeof data.voiceCharacteristics.energy).toBe('string');
      expect(['uplifting', 'gentle', 'grounding', 'clear', 'warm']).toContain(
        data.voiceCharacteristics.tone
      );
    });
  });

  describe('✅ Test 5: GET ?check=1 Health Check', () => {
    it('should return system health status', async () => {
      process.env.OPENAI_API_KEY = 'test-openai-key';
      process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';

      const request = createMockRequest(
        {},
        'http://localhost:3000/api/oracle/personal?check=1'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.text).toBe('🧪 MAIA API is healthy');
      expect(data.version).toBe('v2.0.0-personal-oracle-agent');
      expect(data.element).toBe('aether');
      expect(data.archetype).toBe('maia');
      expect(data.source).toBe('health-check');
      expect(data.hasOpenAIKey).toBe(true);
      expect(data.hasAnthropicKey).toBe(true);
      expect(data.buildDate).toBeDefined();
    });

    it('should detect missing API keys', async () => {
      delete process.env.OPENAI_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;

      const request = createMockRequest(
        {},
        'http://localhost:3000/api/oracle/personal?check=1'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(data.hasOpenAIKey).toBe(false);
      expect(data.hasAnthropicKey).toBe(false);
    });
  });

  describe('🧪 Test 6: Input Validation', () => {
    it('should handle empty input gracefully', async () => {
      const request = createMockRequest({
        userId: 'test-user',
        userText: '',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.text).toBe("I'm here with you. What's on your mind?");
      expect(data.element).toBe('aether');
      expect(data.archetype).toBe('maia');
      expect(data.source).toBe('validation-fallback');
      expect(data.voiceCharacteristics).toEqual({
        tone: 'warm',
        pace: 'moderate',
        energy: 'balanced',
      });
    });

    it('should handle missing userText field by checking alternative fields', async () => {
      (PersonalOracleAgent.loadAgent as jest.Mock).mockResolvedValue({
        processInteraction: jest.fn().mockResolvedValue({
          response: 'Test response',
          element: 'aether',
          metadata: { phase: 'reflection', archetypes: ['Oracle'] },
        }),
      });

      const request = createMockRequest({
        userId: 'test-user',
        message: 'Test via message field',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.source).toBe('personal-oracle-agent');
    });
  });

  describe('🧬 Test 7: Metadata Consistency', () => {
    it('should include complete metadata in response', async () => {
      (PersonalOracleAgent.loadAgent as jest.Mock).mockResolvedValue({
        processInteraction: jest.fn().mockResolvedValue({
          response: 'Deep reflection response',
          element: 'earth',
          metadata: {
            sessionId: 'session_456',
            phase: 'integration',
            symbols: ['roots', 'foundation', 'stability'],
            archetypes: ['Builder', 'Guardian'],
          },
          suggestions: ['Ground yourself in daily practice'],
        }),
      });

      const request = createMockRequest({
        userId: 'test-user',
        userText: 'I need to find solid ground',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.metadata).toBeDefined();
      expect(data.metadata.spiralogicPhase).toBe('integration');
      expect(data.metadata.symbols).toContain('roots');
      expect(data.metadata.archetypes).toContain('Builder');
      expect(data.metadata.responseTime).toBeDefined();
      expect(typeof data.metadata.responseTime).toBe('number');
    });
  });

  describe('⚡ Test 8: Response Time Tracking', () => {
    it('should track and return response time in metadata', async () => {
      (PersonalOracleAgent.loadAgent as jest.Mock).mockResolvedValue({
        processInteraction: jest.fn().mockImplementation(async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return {
            response: 'Test response',
            element: 'air',
            metadata: { phase: 'exploration', archetypes: ['Seeker'] },
          };
        }),
      });

      const request = createMockRequest({
        userId: 'test-user',
        userText: 'Quick test',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.metadata.responseTime).toBeDefined();
      expect(data.metadata.responseTime).toBeGreaterThan(50);
    });
  });
});