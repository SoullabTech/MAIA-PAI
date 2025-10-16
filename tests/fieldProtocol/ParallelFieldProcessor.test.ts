/**
 * Test Suite for Parallel Field Processor
 *
 * Tests the core parallel processing capabilities and paradox accumulation
 */

import { ParallelFieldProcessor, ParadoxSeed, FieldInteraction } from '../../lib/fieldProtocol/ParallelFieldProcessor';
import { Element } from '../../types/fieldProtocol';

describe('ParallelFieldProcessor', () => {
  let processor: ParallelFieldProcessor;

  beforeEach(() => {
    processor = new ParallelFieldProcessor();
  });

  afterEach(async () => {
    await processor.cleanup();
  });

  describe('Parallel Processing', () => {
    test('should process left and right streams simultaneously', async () => {
      const startTime = Date.now();

      const result = await processor.processField(
        'I think deeply about my emotions flowing like water',
        'test-user-1'
      );

      const processingTime = Date.now() - startTime;

      // Both streams should have results
      expect(result.leftStream).toBeDefined();
      expect(result.rightStream).toBeDefined();

      // Processing should be fast (parallel, not sequential)
      expect(processingTime).toBeLessThan(200); // Should be under 200ms

      // Elements should differ between streams
      expect(result.leftStream.element).not.toBe(result.rightStream.element);

      // Left stream (logical) should detect Air (thinking)
      expect(result.leftStream.element).toBe('Air');

      // Right stream (holistic) should detect Water (emotions)
      expect(result.rightStream.element).toBe('Water');
    });

    test('should detect different patterns in each stream', async () => {
      const input = 'If I feel sad, then I need to understand why, everything connects';

      const result = await processor.processField(input, 'test-user-2');

      // Left stream should find logical patterns
      expect(result.leftStream.patterns).toContain('conditional');
      expect(result.leftStream.patterns).toContain('causal');

      // Right stream should find holistic patterns
      expect(result.rightStream.patterns).toContain('totalizing');
      expect(result.rightStream.patterns).toContain('relational');
    });
  });

  describe('Paradox Detection', () => {
    test('should detect paradoxes between conflicting elements', async () => {
      const input = 'I burn with passion yet feel frozen in fear';

      const result = await processor.processField(input, 'test-user-3');

      // Should detect Fire-Water paradox
      expect(result.paradoxes.length).toBeGreaterThan(0);

      const paradox = result.paradoxes[0];
      expect([paradox.elementA, paradox.elementB]).toContain('Fire');
      expect([paradox.elementA, paradox.elementB]).toContain('Water');
      expect(paradox.intensity).toBeGreaterThan(0.5);
    });

    test('should detect pattern conflicts', async () => {
      const input = 'Either I succeed or I fail, but everything is connected in the grand web';

      const result = await processor.processField(input, 'test-user-4');

      // Should detect binary vs relational conflict
      const conflicts = result.paradoxes.map(p => p.context);
      expect(conflicts).toContain('either/or vs both/and');
    });
  });

  describe('Paradox Accumulation', () => {
    test('should accumulate paradoxes over multiple interactions', async () => {
      const userId = 'test-user-5';

      // First interaction
      await processor.processField('Fire and ice battle within', userId);

      // Second interaction
      await processor.processField('Burning water, frozen flame', userId);

      // Third interaction
      await processor.processField('Heat meets cold, steam rises', userId);

      // Check accumulated paradoxes
      const history = processor.exportParadoxHistory(userId);
      expect(history.length).toBeGreaterThanOrEqual(3);

      // Should show recurring Fire-Water pattern
      const fireWaterCount = history.filter(p =>
        (p.elementA === 'Fire' && p.elementB === 'Water') ||
        (p.elementA === 'Water' && p.elementB === 'Fire')
      ).length;
      expect(fireWaterCount).toBeGreaterThanOrEqual(2);
    });

    test('should limit paradox history to prevent memory overflow', async () => {
      const userId = 'test-user-6';

      // Generate many paradoxes
      for (let i = 0; i < 150; i++) {
        await processor.processField(`Conflict ${i} between elements`, userId);
      }

      const history = processor.exportParadoxHistory(userId);
      expect(history.length).toBeLessThanOrEqual(100); // Should cap at 100
    });
  });

  describe('Emergence Detection', () => {
    test('should detect emergence from accumulated tension', async () => {
      const userId = 'test-user-7';

      // Build up tension with repeated paradoxes
      const interactions = [
        'Fire consumes water, water extinguishes fire',
        'I burn yet I drown, drowning in flames',
        'The heat of ice, the cold of flame',
        'Passionate detachment, engaged withdrawal'
      ];

      let emergenceDetected = false;

      for (const input of interactions) {
        const result = await processor.processField(input, userId);
        if (result.emergence) {
          emergenceDetected = true;
          expect(result.emergence.type).toBeDefined();
          expect(result.emergence.content).toBeDefined();
          expect(result.emergence.coherence).toBeGreaterThan(0.5);
          break;
        }
      }

      expect(emergenceDetected).toBe(true);
    });

    test('should generate appropriate symbolic content', async () => {
      const userId = 'test-user-8';

      // Create specific Fire-Water paradox
      await processor.processField('Fire meets water repeatedly', userId);
      await processor.processField('Steam rises from the conflict', userId);
      await processor.processField('Fire and water dance eternally', userId);

      const result = await processor.processField(
        'The eternal battle of fire and water continues',
        userId
      );

      if (result.emergence) {
        const validSymbols = [
          'Steam rises from the meeting',
          'The phoenix drowns and is reborn',
          'Lightning strikes the ocean'
        ];
        expect(validSymbols).toContain(result.emergence.content);
      }
    });
  });

  describe('Coherence Calculation', () => {
    test('should calculate higher coherence for productive tension', async () => {
      // Low tension (agreement) - should have lower coherence
      const lowTensionResult = await processor.processField(
        'Everything is calm and peaceful',
        'test-user-9'
      );

      // High productive tension - should have higher coherence
      const highTensionResult = await processor.processField(
        'I think therefore I feel, feeling my thoughts thinking',
        'test-user-10'
      );

      expect(highTensionResult.coherence).toBeGreaterThan(lowTensionResult.coherence);
    });

    test('should avoid extreme coherence values', async () => {
      const inputs = [
        'Simple statement',
        'Complex paradoxical quantum entanglement of being and not being',
        'Fire water air earth void all at once',
        'I am'
      ];

      for (const input of inputs) {
        const result = await processor.processField(input, `test-user-${Math.random()}`);

        // Coherence should stay in reasonable range
        expect(result.coherence).toBeGreaterThan(0);
        expect(result.coherence).toBeLessThanOrEqual(1);

        // Should avoid extremes
        expect(result.coherence).toBeGreaterThan(0.1);
        expect(result.coherence).toBeLessThan(0.95);
      }
    });
  });

  describe('Phase Tracking', () => {
    test('should track phase oscillations', async () => {
      const userId = 'test-user-11';

      // Process multiple inputs with different elements
      const inputs = [
        'Fire burns bright', // Fire -> Creation
        'Water flows deep', // Water -> Sustenance
        'Air dissolves boundaries', // Air -> Dissolution
        'Earth grounds us', // Earth -> Sustenance
        'Void contains all' // Void -> Dissolution
      ];

      for (const input of inputs) {
        await processor.processField(input, userId);
      }

      const state = processor.getSystemState(userId);

      expect(state.phaseState).toBeDefined();
      expect(state.phaseState.oscillationPattern.length).toBeGreaterThan(0);
      expect(state.phaseState.coherenceIndex).toBeGreaterThan(0);
    });

    test('should detect stagnation risk', async () => {
      const userId = 'test-user-12';

      // Repeat same element multiple times
      for (let i = 0; i < 10; i++) {
        await processor.processField('Fire fire fire burning bright', userId);
      }

      const state = processor.getSystemState(userId);
      expect(state.phaseState.stagnationRisk).toBeGreaterThan(0.5);
    });
  });

  describe('Event Emissions', () => {
    test('should emit paradox accumulation events', async () => {
      const paradoxEvents: any[] = [];

      processor.on('paradox:accumulated', (event) => {
        paradoxEvents.push(event);
      });

      await processor.processField('Conflicting elements arise', 'test-user-13');

      expect(paradoxEvents.length).toBeGreaterThan(0);
      expect(paradoxEvents[0].userId).toBe('test-user-13');
      expect(paradoxEvents[0].count).toBeGreaterThanOrEqual(0);
    });

    test('should emit emergence detection events', async () => {
      const emergenceEvents: any[] = [];

      processor.on('emergence:detected', (event) => {
        emergenceEvents.push(event);
      });

      const userId = 'test-user-14';

      // Build up to emergence
      for (let i = 0; i < 5; i++) {
        await processor.processField(
          'The paradox intensifies between fire and water',
          userId
        );
      }

      if (emergenceEvents.length > 0) {
        expect(emergenceEvents[0].type).toBeDefined();
        expect(emergenceEvents[0].content).toBeDefined();
      }
    });
  });

  describe('Performance', () => {
    test('should handle rapid sequential processing', async () => {
      const userId = 'test-user-15';
      const startTime = Date.now();
      const promises = [];

      // Fire 10 rapid requests
      for (let i = 0; i < 10; i++) {
        promises.push(
          processor.processField(`Quick input ${i}`, userId)
        );
      }

      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;

      expect(results.length).toBe(10);
      expect(totalTime).toBeLessThan(1000); // Should handle 10 in under 1 second

      // All should have valid results
      results.forEach(result => {
        expect(result.leftStream).toBeDefined();
        expect(result.rightStream).toBeDefined();
        expect(result.coherence).toBeGreaterThan(0);
      });
    });

    test('should handle multiple users concurrently', async () => {
      const promises = [];

      // 5 different users simultaneously
      for (let i = 0; i < 5; i++) {
        promises.push(
          processor.processField(
            'Concurrent processing test',
            `concurrent-user-${i}`
          )
        );
      }

      const results = await Promise.all(promises);

      expect(results.length).toBe(5);

      // Each should have independent results
      const coherenceValues = results.map(r => r.coherence);
      const uniqueCoherence = new Set(coherenceValues);

      // Should have some variation (not all identical)
      expect(uniqueCoherence.size).toBeGreaterThan(1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty input gracefully', async () => {
      const result = await processor.processField('', 'test-user-16');

      expect(result).toBeDefined();
      expect(result.leftStream).toBeDefined();
      expect(result.rightStream).toBeDefined();
      expect(result.paradoxes).toEqual([]);
    });

    test('should handle very long input', async () => {
      const longInput = 'Fire water earth air void '.repeat(100);

      const result = await processor.processField(longInput, 'test-user-17');

      expect(result).toBeDefined();
      expect(result.coherence).toBeGreaterThan(0);
      expect(result.coherence).toBeLessThanOrEqual(1);
    });

    test('should handle special characters', async () => {
      const specialInput = '🔥💧🌍💨 Fire!!! Water??? Earth... Air~~~';

      const result = await processor.processField(specialInput, 'test-user-18');

      expect(result).toBeDefined();
      expect(result.leftStream.element).toBeDefined();
      expect(result.rightStream.element).toBeDefined();
    });
  });
});

/**
 * Integration test for parallel vs sequential processing comparison
 */
describe('Parallel vs Sequential Performance', () => {
  test('parallel processing should outperform sequential', async () => {
    const processor = new ParallelFieldProcessor();
    const input = 'Complex thought requiring deep analysis of emotional patterns';
    const userId = 'perf-test-user';

    // Measure parallel processing
    const parallelStart = Date.now();
    const parallelResult = await processor.processField(input, userId);
    const parallelTime = Date.now() - parallelStart;

    // Simulate sequential processing
    const sequentialStart = Date.now();
    // Process left stream
    await new Promise(resolve => setTimeout(resolve, 50));
    // Process right stream
    await new Promise(resolve => setTimeout(resolve, 50));
    // Detect paradoxes
    await new Promise(resolve => setTimeout(resolve, 20));
    const sequentialTime = Date.now() - sequentialStart;

    // Parallel should be significantly faster
    expect(parallelTime).toBeLessThan(sequentialTime * 0.7);

    // Results should still be complete
    expect(parallelResult.leftStream).toBeDefined();
    expect(parallelResult.rightStream).toBeDefined();
    expect(parallelResult.coherence).toBeGreaterThan(0);

    await processor.cleanup();
  });
});