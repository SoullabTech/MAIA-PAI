/**
 * Bridge between Field Protocol and UnifiedMemoryInterface
 * Enables Field Records to be stored in and retrieved from the unified memory system
 */

import { useCallback, useEffect, useState } from 'react';
import { UnifiedMemoryInterface } from '@/lib/memory/UnifiedMemoryInterface';
import { FieldRecord, Element } from '@/types/fieldProtocol';
import { MemoryCore } from '@/lib/memory/types/memory';

/**
 * Maps Field Protocol elements to memory patterns
 */
const mapElementsToPatterns = (elements: Element[]): string[] => {
  const elementPatternMap: Record<Element, string[]> = {
    Fire: ['transformation', 'passion', 'will', 'energy'],
    Water: ['emotion', 'flow', 'intuition', 'healing'],
    Air: ['thought', 'clarity', 'communication', 'vision'],
    Earth: ['grounding', 'stability', 'manifestation', 'physical'],
    Void: ['mystery', 'potential', 'unity', 'transcendence']
  };

  return elements.flatMap(element => elementPatternMap[element] || []);
};

/**
 * Hook for bridging Field Protocol with UnifiedMemoryInterface
 */
export const useFieldMemoryBridge = (userId?: string) => {
  const [memoryInterface, setMemoryInterface] = useState<UnifiedMemoryInterface | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize memory interface
  useEffect(() => {
    const initMemory = async () => {
      try {
        const memory = new UnifiedMemoryInterface();
        await memory.initialize(userId || 'field-protocol-user');
        setMemoryInterface(memory);
        setIsInitialized(true);
        console.log('✅ Field Memory Bridge initialized');
      } catch (error) {
        console.error('Failed to initialize Field Memory Bridge:', error);
      }
    };

    initMemory();
  }, [userId]);

  /**
   * Store a Field Record in unified memory
   */
  const storeFieldRecord = useCallback(async (record: FieldRecord): Promise<string | null> => {
    if (!memoryInterface) return null;

    try {
      // Create memory core from Field Record
      const memoryCore: MemoryCore = {
        id: record.id,
        type: 'experiential',
        content: record.phenomenon.description,
        context: {
          timestamp: record.timestamp.toISOString(),
          source: 'field-protocol',
          elementalContext: record.elementalContext,
          stage: record.currentStage,
          practitioner: record.meta.practitionerId
        },
        patterns: [
          ...mapElementsToPatterns(record.elementalContext.dominant),
          ...record.cognitive.insights.slice(0, 3) // Top 3 insights as patterns
        ],
        strength: record.validation.coherenceScore || 0.5,
        associations: record.meta.linkedRecords || [],
        emotionalValence: record.somatic.emotionalTone ? 0.7 : 0.5,
        metadata: {
          visibility: record.meta.visibility,
          tags: record.meta.tags || [],
          validations: record.validation.peerValidation?.length || 0,
          engagement: {
            reflections: record.engagement?.reflections?.length || 0,
            questions: record.engagement?.questions?.length || 0,
            resonance: record.engagement?.resonanceMarkers?.length || 0
          }
        }
      };

      // Store in memory
      await memoryInterface.storeMemory(memoryCore);

      // Process for pattern extraction
      if (record.cognitive.insights.length > 0) {
        await memoryInterface.processContext({
          content: record.cognitive.insights.join(' '),
          type: 'insight',
          importance: record.validation.coherenceScore || 0.5
        });
      }

      // Store symbolic associations
      if (record.symbolic.archetypes && record.symbolic.archetypes.length > 0) {
        for (const archetype of record.symbolic.archetypes) {
          await memoryInterface.storeAssociation(record.id, archetype, 0.8);
        }
      }

      console.log(`✅ Field Record ${record.id} stored in unified memory`);
      return record.id;
    } catch (error) {
      console.error('Failed to store Field Record in memory:', error);
      return null;
    }
  }, [memoryInterface]);

  /**
   * Retrieve Field Records from unified memory
   */
  const retrieveFieldRecords = useCallback(async (
    query?: string,
    elements?: Element[]
  ): Promise<FieldRecord[]> => {
    if (!memoryInterface) return [];

    try {
      // Build search patterns
      const patterns = elements ? mapElementsToPatterns(elements) : [];

      // Retrieve relevant memories
      const memories = await memoryInterface.retrieveRelevantMemories(
        query || patterns.join(' '),
        10
      );

      // Filter for Field Protocol memories and reconstruct records
      const fieldRecords: FieldRecord[] = [];

      for (const memory of memories) {
        if (memory.context?.source === 'field-protocol') {
          // Reconstruct partial Field Record from memory
          const record: Partial<FieldRecord> = {
            id: memory.id,
            timestamp: new Date(memory.context.timestamp),
            elementalContext: memory.context.elementalContext,
            phenomenon: {
              description: memory.content
            },
            cognitive: {
              insights: memory.patterns.filter(p => p.length > 20) // Longer patterns are likely insights
            },
            validation: {
              criteria: [],
              coherenceScore: memory.strength
            },
            meta: {
              practitionerId: memory.context.practitioner,
              visibility: memory.metadata?.visibility || 'private',
              tags: memory.metadata?.tags || []
            },
            currentStage: memory.context.stage
          };

          if (record.id && record.timestamp) {
            fieldRecords.push(record as FieldRecord);
          }
        }
      }

      return fieldRecords;
    } catch (error) {
      console.error('Failed to retrieve Field Records from memory:', error);
      return [];
    }
  }, [memoryInterface]);

  /**
   * Find patterns across Field Records
   */
  const findFieldPatterns = useCallback(async (): Promise<{
    dominantElements: Element[];
    recurringThemes: string[];
    temporalPatterns: Date[];
  }> => {
    if (!memoryInterface) {
      return {
        dominantElements: [],
        recurringThemes: [],
        temporalPatterns: []
      };
    }

    try {
      // Get all Field Protocol memories
      const memories = await memoryInterface.retrieveRelevantMemories(
        'field-protocol',
        50
      );

      // Analyze patterns
      const elementCounts = new Map<Element, number>();
      const themes = new Map<string, number>();
      const timestamps: Date[] = [];

      for (const memory of memories) {
        if (memory.context?.source === 'field-protocol') {
          // Count elements
          if (memory.context.elementalContext?.dominant) {
            for (const element of memory.context.elementalContext.dominant) {
              elementCounts.set(element, (elementCounts.get(element) || 0) + 1);
            }
          }

          // Extract themes from patterns
          for (const pattern of memory.patterns) {
            if (pattern.length > 10) {
              themes.set(pattern, (themes.get(pattern) || 0) + 1);
            }
          }

          // Collect timestamps
          if (memory.context.timestamp) {
            timestamps.push(new Date(memory.context.timestamp));
          }
        }
      }

      // Sort and extract top results
      const dominantElements = Array.from(elementCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([element]) => element);

      const recurringThemes = Array.from(themes.entries())
        .filter(([_, count]) => count > 1)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([theme]) => theme);

      // Find temporal clusters
      const temporalPatterns = timestamps
        .sort((a, b) => a.getTime() - b.getTime())
        .filter((date, i, arr) => {
          if (i === 0) return false;
          const diff = date.getTime() - arr[i - 1].getTime();
          return diff < 24 * 60 * 60 * 1000; // Within 24 hours
        });

      return {
        dominantElements,
        recurringThemes,
        temporalPatterns
      };
    } catch (error) {
      console.error('Failed to find Field patterns:', error);
      return {
        dominantElements: [],
        recurringThemes: [],
        temporalPatterns: []
      };
    }
  }, [memoryInterface]);

  /**
   * Link Field Record to conversation memory
   */
  const linkToConversation = useCallback(async (
    recordId: string,
    conversationId: string
  ): Promise<boolean> => {
    if (!memoryInterface) return false;

    try {
      await memoryInterface.storeAssociation(recordId, conversationId, 0.9);
      console.log(`✅ Linked Field Record ${recordId} to conversation ${conversationId}`);
      return true;
    } catch (error) {
      console.error('Failed to link Field Record to conversation:', error);
      return false;
    }
  }, [memoryInterface]);

  /**
   * Extract Field Protocol insights from recent memories
   */
  const extractFieldInsights = useCallback(async (): Promise<string[]> => {
    if (!memoryInterface) return [];

    try {
      const recentMemories = await memoryInterface.getRecentMemories(20);
      const insights: string[] = [];

      for (const memory of recentMemories) {
        if (memory.type === 'insight' || memory.type === 'experiential') {
          // Look for transformational markers
          const hasTransformation = memory.patterns.some(p =>
            ['transform', 'shift', 'evolve', 'integrate', 'realize'].some(marker =>
              p.toLowerCase().includes(marker)
            )
          );

          if (hasTransformation && memory.content.length > 50) {
            insights.push(memory.content);
          }
        }
      }

      return insights;
    } catch (error) {
      console.error('Failed to extract Field insights:', error);
      return [];
    }
  }, [memoryInterface]);

  return {
    isInitialized,
    storeFieldRecord,
    retrieveFieldRecords,
    findFieldPatterns,
    linkToConversation,
    extractFieldInsights,
    memoryInterface
  };
};

export default useFieldMemoryBridge;