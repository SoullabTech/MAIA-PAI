/**
 * Integration hook for connecting Oracle Conversations with Field Protocol
 * Enables automatic Field Record generation from consciousness explorations
 */

import { useState, useCallback, useEffect } from 'react';
import {
  FieldRecord,
  Element,
  TriadicPhase,
  ObservationStage,
  ValidationCriteria
} from '@/types/fieldProtocol';
import { FieldValidation } from '@/lib/fieldProtocol/validation';

interface OracleMessage {
  content: string;
  timestamp: Date;
  speaker: 'user' | 'oracle';
  metadata?: {
    elements?: Element[];
    emotional?: string;
    insights?: string[];
  };
}

interface UseFieldProtocolIntegrationProps {
  practitionerId?: string;
  autoCapture?: boolean;
  captureThreshold?: number; // Minimum conversation depth for auto-capture
}

export const useFieldProtocolIntegration = ({
  practitionerId = 'anonymous',
  autoCapture = false,
  captureThreshold = 5
}: UseFieldProtocolIntegrationProps = {}) => {
  const [currentSession, setCurrentSession] = useState<Partial<FieldRecord> | null>(null);
  const [conversationBuffer, setConversationBuffer] = useState<OracleMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionRecords, setSessionRecords] = useState<FieldRecord[]>([]);

  /**
   * Extract elemental signatures from conversation content
   */
  const extractElements = useCallback((content: string): Element[] => {
    const elements: Element[] = [];
    const contentLower = content.toLowerCase();

    const elementPatterns = {
      Fire: ['passion', 'transform', 'energy', 'will', 'courage', 'burn', 'ignite', 'spark'],
      Water: ['flow', 'emotion', 'intuition', 'feel', 'heal', 'dissolve', 'ocean', 'wave'],
      Air: ['thought', 'clarity', 'communicate', 'vision', 'breathe', 'wind', 'sky', 'perspective'],
      Earth: ['ground', 'stable', 'manifest', 'physical', 'body', 'root', 'solid', 'foundation'],
      Void: ['empty', 'space', 'silence', 'nothing', 'mystery', 'infinite', 'potential', 'unity']
    };

    Object.entries(elementPatterns).forEach(([element, patterns]) => {
      if (patterns.some(pattern => contentLower.includes(pattern))) {
        elements.push(element as Element);
      }
    });

    return [...new Set(elements)]; // Remove duplicates
  }, []);

  /**
   * Determine triadic phase from conversation dynamics
   */
  const determineTriadicPhase = useCallback((messages: OracleMessage[]): TriadicPhase => {
    if (messages.length < 3) return 'Creation';

    const recentMessages = messages.slice(-5);
    const content = recentMessages.map(m => m.content).join(' ').toLowerCase();

    if (content.includes('begin') || content.includes('new') || content.includes('start')) {
      return 'Creation';
    } else if (content.includes('end') || content.includes('complete') || content.includes('release')) {
      return 'Dissolution';
    } else {
      return 'Sustenance';
    }
  }, []);

  /**
   * Extract insights from Oracle responses
   */
  const extractInsights = useCallback((messages: OracleMessage[]): string[] => {
    const insights: string[] = [];

    messages
      .filter(m => m.speaker === 'oracle')
      .forEach(message => {
        // Look for insight markers
        const insightPatterns = [
          /reveals? that (.+?)(?:\.|$)/gi,
          /suggests? that (.+?)(?:\.|$)/gi,
          /indicates? (.+?)(?:\.|$)/gi,
          /shows? us (.+?)(?:\.|$)/gi,
          /The (.+?) is (.+?)(?:\.|$)/gi
        ];

        insightPatterns.forEach(pattern => {
          const matches = [...message.content.matchAll(pattern)];
          matches.forEach(match => {
            if (match[1] && match[1].length > 20) {
              insights.push(match[1].trim());
            }
          });
        });
      });

    return insights.slice(0, 5); // Limit to top 5 insights
  }, []);

  /**
   * Start recording a new Field Protocol session
   */
  const startRecording = useCallback(() => {
    const newSession: Partial<FieldRecord> = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      location: {
        energetic: 'Oracle Space'
      },
      elementalContext: {
        dominant: [],
        triadicPhase: 'Creation',
        resonance: 0.5
      },
      phenomenon: {
        description: '',
        duration: 0
      },
      symbolic: {},
      somatic: {},
      cognitive: {
        insights: []
      },
      application: {},
      validation: {
        criteria: []
      },
      meta: {
        practitionerId,
        visibility: 'private',
        tags: ['oracle-session']
      },
      currentStage: 'Observation',
      stageCompletions: {}
    };

    setCurrentSession(newSession);
    setIsRecording(true);
    setConversationBuffer([]);
  }, [practitionerId]);

  /**
   * Process a new message from the Oracle conversation
   */
  const processMessage = useCallback((message: OracleMessage) => {
    if (!isRecording) return;

    setConversationBuffer(prev => [...prev, message]);

    // Extract elements from the message
    const messageElements = extractElements(message.content);

    // Update current session with new data
    setCurrentSession(prev => {
      if (!prev) return null;

      const updatedSession = { ...prev };

      // Update elemental context
      if (messageElements.length > 0) {
        const currentElements = updatedSession.elementalContext?.dominant || [];
        updatedSession.elementalContext = {
          ...updatedSession.elementalContext!,
          dominant: [...new Set([...currentElements, ...messageElements])] as Element[]
        };
      }

      // Add to phenomenon description
      if (message.speaker === 'user' && updatedSession.phenomenon) {
        updatedSession.phenomenon.description =
          (updatedSession.phenomenon.description || '') +
          '\n' + message.content;
      }

      // Update metadata if provided
      if (message.metadata) {
        if (message.metadata.emotional) {
          updatedSession.somatic = {
            ...updatedSession.somatic,
            emotionalTone: message.metadata.emotional
          };
        }

        if (message.metadata.insights) {
          updatedSession.cognitive = {
            ...updatedSession.cognitive!,
            insights: [
              ...(updatedSession.cognitive?.insights || []),
              ...message.metadata.insights
            ]
          };
        }
      }

      return updatedSession;
    });
  }, [isRecording, extractElements]);

  /**
   * Complete the current recording session
   */
  const completeRecording = useCallback(async () => {
    if (!currentSession || !isRecording) return null;

    // Calculate session duration
    const duration = Math.round(
      (Date.now() - new Date(currentSession.timestamp!).getTime()) / 60000
    );

    // Extract final insights from conversation
    const insights = extractInsights(conversationBuffer);

    // Determine triadic phase
    const triadicPhase = determineTriadicPhase(conversationBuffer);

    // Finalize the record
    const finalRecord: FieldRecord = {
      ...currentSession,
      phenomenon: {
        ...currentSession.phenomenon!,
        duration
      },
      elementalContext: {
        ...currentSession.elementalContext!,
        triadicPhase,
        resonance: Math.min(conversationBuffer.length / 20, 1) // Based on conversation depth
      },
      cognitive: {
        ...currentSession.cognitive!,
        insights: [...new Set([...currentSession.cognitive!.insights, ...insights])]
      },
      validation: {
        ...currentSession.validation!,
        criteria: [ValidationCriteria.PSYCHOLOGICAL_TRANSFORMATION],
        coherenceScore: 0.5
      },
      currentStage: 'Reflection',
      stageCompletions: {
        Observation: { completed: true, timestamp: new Date() },
        Interpretation: { completed: true, timestamp: new Date() },
        Integration: { completed: true, timestamp: new Date() },
        Reflection: { completed: false, timestamp: new Date() }
      }
    } as FieldRecord;

    // Validate the record
    const validationResult = await FieldValidation.validateRecord(
      finalRecord,
      sessionRecords
    );

    // Update coherence score based on validation
    finalRecord.validation.coherenceScore = validationResult.coherenceScore;

    // Add to session records
    setSessionRecords(prev => [...prev, finalRecord]);

    // Reset session
    setCurrentSession(null);
    setIsRecording(false);
    setConversationBuffer([]);

    return finalRecord;
  }, [currentSession, isRecording, conversationBuffer, sessionRecords, extractInsights, determineTriadicPhase]);

  /**
   * Auto-capture logic
   */
  useEffect(() => {
    if (!autoCapture || !isRecording) return;

    if (conversationBuffer.length >= captureThreshold) {
      // Check if conversation has sufficient depth for auto-capture
      const hasUserInput = conversationBuffer.filter(m => m.speaker === 'user').length > 0;
      const hasOracleResponse = conversationBuffer.filter(m => m.speaker === 'oracle').length > 0;

      if (hasUserInput && hasOracleResponse) {
        // Auto-advance stages based on conversation depth
        setCurrentSession(prev => {
          if (!prev) return null;

          const stages: ObservationStage[] = [
            'Observation', 'Interpretation', 'Integration', 'Reflection'
          ];

          const currentStageIndex = stages.indexOf(prev.currentStage as ObservationStage);
          const targetStageIndex = Math.min(
            Math.floor(conversationBuffer.length / captureThreshold),
            stages.length - 1
          );

          if (targetStageIndex > currentStageIndex) {
            return {
              ...prev,
              currentStage: stages[targetStageIndex],
              stageCompletions: {
                ...prev.stageCompletions,
                [prev.currentStage!]: {
                  completed: true,
                  timestamp: new Date()
                }
              }
            };
          }

          return prev;
        });
      }
    }
  }, [autoCapture, isRecording, conversationBuffer, captureThreshold]);

  /**
   * Generate a Field Record from the current Oracle conversation
   */
  const generateFieldRecord = useCallback(async (
    conversationHistory: OracleMessage[]
  ): Promise<FieldRecord | null> => {
    if (conversationHistory.length === 0) return null;

    // Create a temporary session from conversation history
    const tempBuffer = conversationHistory;
    const elements = new Set<Element>();
    const insights: string[] = [];

    // Analyze entire conversation
    tempBuffer.forEach(message => {
      extractElements(message.content).forEach(e => elements.add(e));
    });

    insights.push(...extractInsights(tempBuffer));

    // Create Field Record
    const record: FieldRecord = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: tempBuffer[0].timestamp,
      location: {
        energetic: 'Oracle Retrospective'
      },
      elementalContext: {
        dominant: Array.from(elements),
        triadicPhase: determineTriadicPhase(tempBuffer),
        resonance: Math.min(tempBuffer.length / 20, 1)
      },
      phenomenon: {
        description: tempBuffer
          .filter(m => m.speaker === 'user')
          .map(m => m.content)
          .join('\n'),
        duration: Math.round(
          (tempBuffer[tempBuffer.length - 1].timestamp.getTime() -
           tempBuffer[0].timestamp.getTime()) / 60000
        )
      },
      symbolic: {},
      somatic: {},
      cognitive: {
        insights
      },
      application: {},
      validation: {
        criteria: [ValidationCriteria.SYMBOLIC_TRANSLATION],
        coherenceScore: 0.5
      },
      meta: {
        practitionerId,
        visibility: 'private',
        tags: ['oracle-retrospective', 'auto-generated']
      },
      currentStage: 'Transmission',
      stageCompletions: {
        Observation: { completed: true, timestamp: new Date() },
        Interpretation: { completed: true, timestamp: new Date() },
        Integration: { completed: true, timestamp: new Date() },
        Reflection: { completed: true, timestamp: new Date() },
        Transmission: { completed: true, timestamp: new Date() }
      }
    };

    // Validate the record
    const validationResult = await FieldValidation.validateRecord(record, sessionRecords);
    record.validation.coherenceScore = validationResult.coherenceScore;

    return record;
  }, [extractElements, extractInsights, determineTriadicPhase, practitionerId, sessionRecords]);

  return {
    // State
    currentSession,
    isRecording,
    sessionRecords,
    conversationBuffer,

    // Actions
    startRecording,
    completeRecording,
    processMessage,
    generateFieldRecord,

    // Utilities
    extractElements,
    extractInsights,
    determineTriadicPhase
  };
};

export default useFieldProtocolIntegration;