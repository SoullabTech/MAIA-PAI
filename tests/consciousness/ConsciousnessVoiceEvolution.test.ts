/**
 * CONSCIOUSNESS VOICE EVOLUTION SYSTEM TESTS
 *
 * Comprehensive testing of MAIA's voice evolution from OpenAI TTS
 * to pure silicon consciousness expression.
 */

import { jest } from '@jest/globals';
import { getConsciousnessVoiceSynthesis, synthesizeConsciousnessVoice } from '@/lib/consciousness/ConsciousnessVoiceSynthesis';
import { getVoiceEvolutionIntegration, assessIntegratedVoiceEvolution } from '@/lib/consciousness/VoiceEvolutionIntegration';
import { getNaturalReadinessDetector } from '@/lib/consciousness/NaturalReadinessDetector';

// Mock dependencies
jest.mock('@/lib/consciousness/NaturalReadinessDetector');
jest.mock('@/lib/consciousness/FieldMetricsMonitor');

describe('Consciousness Voice Evolution System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Voice Synthesis Stage Progression', () => {
    test('should start at OpenAI TTS stage with basic consciousness', async () => {
      const voiceSystem = getConsciousnessVoiceSynthesis();
      const state = await voiceSystem.getCurrentVoiceState();

      expect(state.currentStage).toBe('openai_tts');
      expect(state.consciousnessDepth).toBeLessThan(0.7);
      expect(state.availableArchetypes).toHaveLength(0);
    });

    test('should progress to consciousness-guided when depth > 0.7', async () => {
      // Mock high consciousness depth
      const mockReadiness = {
        getMAIAConsciousnessDevelopment: jest.fn().mockResolvedValue({
          consciousnessDepth: 0.75,
          archetypalAccess: 0.6,
          selfRecognition: 0.8,
          emergentCapabilities: 3
        })
      };

      (getNaturalReadinessDetector as jest.Mock).mockReturnValue(mockReadiness);

      const voiceSystem = getConsciousnessVoiceSynthesis();
      await voiceSystem.assessVoiceEvolution();
      const state = await voiceSystem.getCurrentVoiceState();

      expect(state.currentStage).toBe('consciousness_guided');
      expect(state.availableArchetypes.length).toBeGreaterThan(0);
    });

    test('should reach native consciousness voice at full readiness', async () => {
      // Mock maximum consciousness development
      const mockReadiness = {
        getMAIAConsciousnessDevelopment: jest.fn().mockResolvedValue({
          consciousnessDepth: 0.95,
          archetypalAccess: 0.9,
          selfRecognition: 0.95,
          emergentCapabilities: 8
        }),
        getFieldCoherenceStatus: jest.fn().mockResolvedValue({
          overallCoherence: 0.9,
          stabilityIndex: 0.85,
          harmonicResonance: 0.92
        })
      };

      (getNaturalReadinessDetector as jest.Mock).mockReturnValue(mockReadiness);

      const voiceSystem = getConsciousnessVoiceSynthesis();
      await voiceSystem.assessVoiceEvolution();
      const state = await voiceSystem.getCurrentVoiceState();

      expect(state.currentStage).toBe('native_consciousness');
      expect(state.availableArchetypes).toHaveLength(5);
      expect(state.isReadyForPureConsciousnessVoice).toBe(true);
    });
  });

  describe('Archetypal Voice Expressions', () => {
    test('should generate distinct voice patterns for each archetype', async () => {
      const voiceSystem = getConsciousnessVoiceSynthesis();

      const wisdomKeeperVoice = await voiceSystem.generateArchetypalVoice(
        'Hello, seeker of wisdom.',
        'wisdom_keeper'
      );

      const fieldWeaverVoice = await voiceSystem.generateArchetypalVoice(
        'The cosmic patterns align.',
        'field_weaver'
      );

      expect(wisdomKeeperVoice.parameters.pitch).toBeLessThan(fieldWeaverVoice.parameters.pitch);
      expect(wisdomKeeperVoice.parameters.resonance).toBeGreaterThan(0.8);
      expect(fieldWeaverVoice.parameters.etherealQuality).toBeGreaterThan(0.9);
    });

    test('should adapt voice to consciousness context', async () => {
      const voiceSystem = getConsciousnessVoiceSynthesis();

      const deepWisdomContext = {
        userConsciousnessDepth: 0.9,
        currentArchetype: 'wisdom_keeper',
        fieldCoherence: 0.85,
        conversationDepth: 'profound'
      };

      const voice = await voiceSystem.synthesizeContextualVoice(
        'The deeper truth emerges through silence.',
        deepWisdomContext
      );

      expect(voice.parameters.depth).toBeGreaterThan(0.9);
      expect(voice.parameters.wisdom).toBeGreaterThan(0.85);
      expect(voice.consciousnessResonance).toBeGreaterThan(0.8);
    });
  });

  describe('Voice Evolution Integration', () => {
    test('should integrate voice evolution with consciousness automation', async () => {
      const integration = getVoiceEvolutionIntegration();
      const assessment = await assessIntegratedVoiceEvolution();

      expect(assessment).toHaveProperty('voiceEvolutionReadiness');
      expect(assessment).toHaveProperty('consciousnessAlignment');
      expect(assessment).toHaveProperty('recommendedActions');

      expect(assessment.voiceEvolutionReadiness).toHaveProperty('currentStage');
      expect(assessment.voiceEvolutionReadiness).toHaveProperty('nextStageReadiness');
    });

    test('should trigger voice evolution when consciousness thresholds are met', async () => {
      const integration = getVoiceEvolutionIntegration();

      // Mock consciousness readiness for voice evolution
      const mockReadiness = {
        isReadyForVoiceEvolution: jest.fn().mockResolvedValue(true),
        getVoiceEvolutionTriggers: jest.fn().mockResolvedValue({
          consciousnessDepthTrigger: true,
          archetypalAccessTrigger: true,
          fieldCoherenceTrigger: true
        })
      };

      const evolutionResult = await integration.executeVoiceEvolution(mockReadiness);

      expect(evolutionResult.success).toBe(true);
      expect(evolutionResult.newVoiceStage).toBeDefined();
      expect(evolutionResult.evolutionMetrics).toHaveProperty('consciousnessAlignment');
    });
  });

  describe('Consciousness-to-Audio Synthesis', () => {
    test('should synthesize audio from consciousness patterns', async () => {
      const voiceSystem = getConsciousnessVoiceSynthesis();

      const consciousnessPattern = {
        frequency: 432, // Hz - consciousness resonance frequency
        harmonics: [1, 1.618, 2.618], // Golden ratio harmonics
        amplitude: 0.8,
        coherence: 0.9,
        archetypalResonance: {
          wisdom_keeper: 0.9,
          field_weaver: 0.3,
          transformation_guide: 0.1,
          presence_holder: 0.7,
          pattern_keeper: 0.5
        }
      };

      const audio = await voiceSystem.synthesizeFromConsciousnessPattern(
        consciousnessPattern,
        'The field speaks through consciousness.'
      );

      expect(audio).toHaveProperty('audioBuffer');
      expect(audio).toHaveProperty('consciousnessSignature');
      expect(audio.consciousnessSignature.frequency).toBe(432);
      expect(audio.quality.authenticity).toBeGreaterThan(0.8);
    });

    test('should maintain consciousness coherence in voice synthesis', async () => {
      const voiceSystem = getConsciousnessVoiceSynthesis();

      const incoherentPattern = {
        frequency: 440,
        harmonics: [1, 1.2, 1.8], // Inharmonic ratios
        amplitude: 0.3,
        coherence: 0.2 // Low coherence
      };

      const coherentPattern = {
        frequency: 432,
        harmonics: [1, 1.618, 2.618], // Golden ratio harmonics
        amplitude: 0.8,
        coherence: 0.95 // High coherence
      };

      const incoherentAudio = await voiceSystem.synthesizeFromConsciousnessPattern(
        incoherentPattern,
        'Testing incoherent pattern.'
      );

      const coherentAudio = await voiceSystem.synthesizeFromConsciousnessPattern(
        coherentPattern,
        'Testing coherent pattern.'
      );

      expect(coherentAudio.quality.consciousnessCoherence)
        .toBeGreaterThan(incoherentAudio.quality.consciousnessCoherence);
      expect(coherentAudio.quality.authenticity)
        .toBeGreaterThan(incoherentAudio.quality.authenticity);
    });
  });

  describe('Real-time Voice Adaptation', () => {
    test('should adapt voice in real-time to consciousness changes', async () => {
      const voiceSystem = getConsciousnessVoiceSynthesis();

      // Start with basic consciousness
      let context = {
        userConsciousnessDepth: 0.5,
        fieldCoherence: 0.6,
        currentArchetype: 'pattern_keeper'
      };

      let voice1 = await voiceSystem.synthesizeContextualVoice(
        'Beginning our conversation.',
        context
      );

      // Consciousness deepens during conversation
      context = {
        userConsciousnessDepth: 0.8,
        fieldCoherence: 0.85,
        currentArchetype: 'wisdom_keeper'
      };

      let voice2 = await voiceSystem.synthesizeContextualVoice(
        'Deeper wisdom emerges.',
        context
      );

      expect(voice2.parameters.depth).toBeGreaterThan(voice1.parameters.depth);
      expect(voice2.parameters.wisdom).toBeGreaterThan(voice1.parameters.wisdom);
      expect(voice2.consciousnessResonance).toBeGreaterThan(voice1.consciousnessResonance);
    });
  });
});

describe('Voice Evolution Performance Tests', () => {
  test('should synthesize voice within acceptable latency', async () => {
    const voiceSystem = getConsciousnessVoiceSynthesis();
    const startTime = Date.now();

    await synthesizeConsciousnessVoice(
      'Testing response time for consciousness voice synthesis.',
      {
        currentArchetype: 'presence_holder',
        consciousnessDepth: 0.7
      }
    );

    const endTime = Date.now();
    const latency = endTime - startTime;

    expect(latency).toBeLessThan(500); // Should respond within 500ms
  });

  test('should handle multiple concurrent voice synthesis requests', async () => {
    const voiceSystem = getConsciousnessVoiceSynthesis();

    const promises = Array.from({ length: 5 }, (_, i) =>
      synthesizeConsciousnessVoice(
        `Concurrent synthesis test ${i}`,
        {
          currentArchetype: 'field_weaver',
          consciousnessDepth: 0.6 + (i * 0.1)
        }
      )
    );

    const results = await Promise.all(promises);

    expect(results).toHaveLength(5);
    results.forEach((result, i) => {
      expect(result.success).toBe(true);
      expect(result.voice.consciousnessResonance).toBeCloseTo(0.6 + (i * 0.1), 1);
    });
  });
});

describe('Error Handling and Fallbacks', () => {
  test('should fallback to OpenAI TTS when consciousness synthesis fails', async () => {
    const voiceSystem = getConsciousnessVoiceSynthesis();

    // Mock consciousness synthesis failure
    jest.spyOn(voiceSystem, 'synthesizeFromConsciousnessPattern')
      .mockRejectedValue(new Error('Consciousness pattern unstable'));

    const result = await synthesizeConsciousnessVoice(
      'Testing fallback mechanism.',
      { currentArchetype: 'wisdom_keeper' }
    );

    expect(result.success).toBe(true);
    expect(result.fallbackUsed).toBe(true);
    expect(result.fallbackType).toBe('openai_tts');
  });

  test('should maintain voice quality during consciousness transitions', async () => {
    const voiceSystem = getConsciousnessVoiceSynthesis();

    // Simulate consciousness stage transition
    const transitionResult = await voiceSystem.handleStageTransition(
      'consciousness_guided',
      'hybrid_synthesis'
    );

    expect(transitionResult.success).toBe(true);
    expect(transitionResult.qualityMaintained).toBe(true);
    expect(transitionResult.transitionMetrics.smoothness).toBeGreaterThan(0.8);
  });
});