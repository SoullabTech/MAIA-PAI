/**
 * Scribe Mode Hook - Passive session recording with active consultation
 *
 * Enables practitioners to:
 * 1. Record client voice sessions passively (no MAIA response to voice)
 * 2. Chat with MAIA via text during the session for real-time consultation
 * 3. Generate Fathom-style elemental synopsis at the end
 * 4. Download session transcript with synopsis
 * 5. Review session with MAIA afterward for supervision
 */

import { useState, useCallback, useRef } from 'react';
import { ConversationMessage } from '@/types/conversation';

export interface ScribeSession {
  id: string;
  startTime: Date;
  voiceTranscripts: Array<{
    text: string;
    timestamp: Date;
    speaker: 'client' | 'practitioner';
  }>;
  consultationMessages: Array<{
    role: 'user' | 'oracle';
    text: string;
    timestamp: Date;
  }>;
  elementalSignatures: {
    fire: number;
    water: number;
    earth: number;
    air: number;
    aether: number;
  };
  insights: string[];
}

export interface ScribeSynopsis {
  duration: string;
  elementalAnalysis: {
    dominant: string[];
    balance: string;
    movement: string;
  };
  keyMoments: string[];
  practitionerInsights: string[];
  recommendations: string[];
}

export const useScribeMode = () => {
  const [isScribing, setIsScribing] = useState(false);
  const [currentSession, setCurrentSession] = useState<ScribeSession | null>(null);
  const sessionStartTimeRef = useRef<Date | null>(null);

  /**
   * Extract elemental signature from text
   */
  const analyzeElementalContent = useCallback((text: string) => {
    const lower = text.toLowerCase();
    const signatures = {
      fire: 0,
      water: 0,
      earth: 0,
      air: 0,
      aether: 0
    };

    // Fire: transformation, passion, energy, will
    const firePatterns = [
      'transform', 'change', 'passion', 'energy', 'power', 'will',
      'courage', 'breakthrough', 'ignite', 'burn', 'spark', 'light'
    ];
    firePatterns.forEach(p => {
      if (lower.includes(p)) signatures.fire++;
    });

    // Water: emotion, flow, healing, intuition
    const waterPatterns = [
      'feel', 'emotion', 'flow', 'heal', 'intuition', 'heart',
      'love', 'compassion', 'grief', 'tears', 'ocean', 'wave', 'dissolve'
    ];
    waterPatterns.forEach(p => {
      if (lower.includes(p)) signatures.water++;
    });

    // Earth: grounding, body, stability, manifestation
    const earthPatterns = [
      'ground', 'body', 'physical', 'stable', 'solid', 'manifest',
      'practical', 'tangible', 'root', 'foundation', 'secure'
    ];
    earthPatterns.forEach(p => {
      if (lower.includes(p)) signatures.earth++;
    });

    // Air: thought, clarity, communication, vision
    const airPatterns = [
      'think', 'thought', 'clarity', 'clear', 'understand', 'communicate',
      'speak', 'voice', 'vision', 'perspective', 'insight', 'mental'
    ];
    airPatterns.forEach(p => {
      if (lower.includes(p)) signatures.air++;
    });

    // Aether: integration, unity, transcendence, mystery
    const aetherPatterns = [
      'unity', 'whole', 'integrate', 'transcend', 'mystery', 'spirit',
      'divine', 'sacred', 'soul', 'essence', 'beyond', 'infinite'
    ];
    aetherPatterns.forEach(p => {
      if (lower.includes(p)) signatures.aether++;
    });

    return signatures;
  }, []);

  /**
   * Extract insights from MAIA's consultation responses
   */
  const extractInsights = useCallback((messages: ScribeSession['consultationMessages']) => {
    const insights: string[] = [];

    messages
      .filter(m => m.role === 'oracle')
      .forEach(msg => {
        // Look for insight patterns
        const patterns = [
          /This (?:suggests?|reveals?|shows?) (.+?)(?:\.|$)/gi,
          /The (.+?) (?:indicates?|points to|reflects) (.+?)(?:\.|$)/gi,
          /(?:Notice|Consider|Observe) (?:how |that )?(.+?)(?:\.|$)/gi,
        ];

        patterns.forEach(pattern => {
          const matches = [...msg.text.matchAll(pattern)];
          matches.forEach(match => {
            const insight = match[1] || match[2];
            if (insight && insight.length > 20 && insight.length < 200) {
              insights.push(insight.trim());
            }
          });
        });
      });

    return [...new Set(insights)].slice(0, 8); // Top 8 unique insights
  }, []);

  /**
   * Start a new Scribe session
   */
  const startScribing = useCallback(() => {
    const session: ScribeSession = {
      id: `scribe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date(),
      voiceTranscripts: [],
      consultationMessages: [],
      elementalSignatures: {
        fire: 0,
        water: 0,
        earth: 0,
        air: 0,
        aether: 0
      },
      insights: []
    };

    setCurrentSession(session);
    setIsScribing(true);
    sessionStartTimeRef.current = new Date();

    console.log('📝 Scribe Mode activated:', session.id);
  }, []);

  /**
   * Record a voice transcript (passive - no MAIA response)
   */
  const recordVoiceTranscript = useCallback((text: string, speaker: 'client' | 'practitioner' = 'client') => {
    if (!isScribing || !currentSession) return;

    const signatures = analyzeElementalContent(text);

    setCurrentSession(prev => {
      if (!prev) return null;

      return {
        ...prev,
        voiceTranscripts: [
          ...prev.voiceTranscripts,
          {
            text,
            timestamp: new Date(),
            speaker
          }
        ],
        elementalSignatures: {
          fire: prev.elementalSignatures.fire + signatures.fire,
          water: prev.elementalSignatures.water + signatures.water,
          earth: prev.elementalSignatures.earth + signatures.earth,
          air: prev.elementalSignatures.air + signatures.air,
          aether: prev.elementalSignatures.aether + signatures.aether
        }
      };
    });

    console.log('🎤 Voice recorded:', text.substring(0, 50) + '...');
  }, [isScribing, currentSession, analyzeElementalContent]);

  /**
   * Record a text consultation message (active - with MAIA response)
   */
  const recordConsultation = useCallback((role: 'user' | 'oracle', text: string) => {
    if (!isScribing || !currentSession) return;

    const signatures = analyzeElementalContent(text);

    setCurrentSession(prev => {
      if (!prev) return null;

      return {
        ...prev,
        consultationMessages: [
          ...prev.consultationMessages,
          {
            role,
            text,
            timestamp: new Date()
          }
        ],
        elementalSignatures: {
          fire: prev.elementalSignatures.fire + signatures.fire,
          water: prev.elementalSignatures.water + signatures.water,
          earth: prev.elementalSignatures.earth + signatures.earth,
          air: prev.elementalSignatures.air + signatures.air,
          aether: prev.elementalSignatures.aether + signatures.aether
        }
      };
    });

    console.log(`💬 Consultation ${role}:`, text.substring(0, 50) + '...');
  }, [isScribing, currentSession, analyzeElementalContent]);

  /**
   * Generate Fathom-style synopsis with elemental analysis
   */
  const generateSynopsis = useCallback((): ScribeSynopsis | null => {
    if (!currentSession) return null;

    const duration = sessionStartTimeRef.current
      ? Math.round((Date.now() - sessionStartTimeRef.current.getTime()) / 60000)
      : 0;

    // Find dominant elements (top 2)
    const signatures = currentSession.elementalSignatures;
    const elementArray = Object.entries(signatures)
      .sort(([, a], [, b]) => b - a)
      .map(([name]) => name);

    const dominant = elementArray.slice(0, 2);
    const weakest = elementArray[elementArray.length - 1];

    // Determine elemental balance
    const total = Object.values(signatures).reduce((sum, val) => sum + val, 0);
    const maxElement = Math.max(...Object.values(signatures));
    const balanceRatio = maxElement / (total || 1);

    let balance: string;
    if (balanceRatio > 0.5) {
      balance = `Strongly ${dominant[0]}-dominant (${Math.round(balanceRatio * 100)}%)`;
    } else if (balanceRatio > 0.35) {
      balance = `${dominant[0]} and ${dominant[1]} co-present`;
    } else {
      balance = 'Balanced across elements';
    }

    // Determine movement
    const movement = dominant[0] === 'water' || dominant[0] === 'air'
      ? 'Fluid and expansive'
      : dominant[0] === 'fire'
      ? 'Transformative and dynamic'
      : dominant[0] === 'earth'
      ? 'Grounding and integrative'
      : 'Transcendent and unifying';

    // Extract key moments from voice transcripts (longer statements)
    const keyMoments = currentSession.voiceTranscripts
      .filter(t => t.text.length > 80)
      .slice(0, 5)
      .map(t => `[${t.speaker === 'client' ? 'Client' : 'Practitioner'}] ${t.text.substring(0, 120)}...`);

    // Extract insights from MAIA consultations
    const practitionerInsights = extractInsights(currentSession.consultationMessages);

    // Generate recommendations based on elemental imbalance
    const recommendations: string[] = [];
    if (signatures[weakest] < 2) {
      const invitations = {
        fire: 'Invite more transformative energy and willingness to change',
        water: 'Create space for emotional processing and intuitive exploration',
        earth: 'Ground insights into practical embodiment and action',
        air: 'Clarify mental understanding and communication',
        aether: 'Connect to the transcendent wholeness underlying the experience'
      };
      recommendations.push(invitations[weakest as keyof typeof invitations]);
    }

    if (balanceRatio > 0.6) {
      recommendations.push(`Session strongly emphasized ${dominant[0]} - consider inviting other elements for integration`);
    }

    if (currentSession.voiceTranscripts.length > currentSession.consultationMessages.length * 2) {
      recommendations.push('High client voice activity - consider more reflection space');
    }

    return {
      duration: `${duration} minutes`,
      elementalAnalysis: {
        dominant,
        balance,
        movement
      },
      keyMoments,
      practitionerInsights,
      recommendations: recommendations.length > 0 ? recommendations : ['Session shows healthy elemental balance']
    };
  }, [currentSession, extractInsights]);

  /**
   * Stop scribing and finalize session
   */
  const stopScribing = useCallback(() => {
    if (!isScribing || !currentSession) return null;

    const synopsis = generateSynopsis();

    console.log('📝 Scribe session completed:', currentSession.id);
    console.log('📊 Synopsis:', synopsis);

    // Keep session in state for download/review
    setIsScribing(false);
    sessionStartTimeRef.current = null;

    return {
      session: currentSession,
      synopsis
    };
  }, [isScribing, currentSession, generateSynopsis]);

  /**
   * Generate downloadable markdown transcript
   */
  const generateTranscript = useCallback(() => {
    if (!currentSession) return null;

    const synopsis = generateSynopsis();
    if (!synopsis) return null;

    const header = `# Scribe Session Transcript\n`;
    const date = `**Date:** ${currentSession.startTime.toLocaleString()}\n`;
    const duration = `**Duration:** ${synopsis.duration}\n\n`;

    const synopsisSection = `## Elemental Synopsis\n\n`;
    const elementalAnalysis = `### Elemental Analysis\n` +
      `- **Dominant Elements:** ${synopsis.elementalAnalysis.dominant.join(', ')}\n` +
      `- **Balance:** ${synopsis.elementalAnalysis.balance}\n` +
      `- **Movement:** ${synopsis.elementalAnalysis.movement}\n\n`;

    const keyMomentsSection = synopsis.keyMoments.length > 0
      ? `### Key Moments\n\n${synopsis.keyMoments.map(m => `- ${m}`).join('\n')}\n\n`
      : '';

    const insightsSection = synopsis.practitionerInsights.length > 0
      ? `### Practitioner Insights (via MAIA)\n\n${synopsis.practitionerInsights.map(i => `- ${i}`).join('\n')}\n\n`
      : '';

    const recommendationsSection = `### Recommendations\n\n${synopsis.recommendations.map(r => `- ${r}`).join('\n')}\n\n`;

    const separator = `${'='.repeat(60)}\n\n`;

    // Voice transcripts
    const voiceSection = `## Voice Recording\n\n`;
    const voiceTranscripts = currentSession.voiceTranscripts.map(t =>
      `**[${t.speaker === 'client' ? 'Client' : 'Practitioner'}]** *${t.timestamp.toLocaleTimeString()}*\n\n${t.text}\n`
    ).join('\n---\n\n');

    // Consultation messages
    const consultationSection = currentSession.consultationMessages.length > 0
      ? `\n\n## Practitioner Consultation with MAIA\n\n` +
        currentSession.consultationMessages.map(m =>
          `**[${m.role === 'user' ? 'You' : 'MAIA'}]** *${m.timestamp.toLocaleTimeString()}*\n\n${m.text}\n`
        ).join('\n---\n\n')
      : '';

    return header + date + duration + separator +
           synopsisSection + elementalAnalysis + keyMomentsSection +
           insightsSection + recommendationsSection + separator +
           voiceSection + voiceTranscripts + consultationSection;
  }, [currentSession, generateSynopsis]);

  /**
   * Download transcript as markdown file
   */
  const downloadTranscript = useCallback(() => {
    const transcript = generateTranscript();
    if (!transcript) return;

    const blob = new Blob([transcript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scribe-session-${currentSession?.startTime.toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('💾 Transcript downloaded');
  }, [generateTranscript, currentSession]);

  /**
   * Get transcript for MAIA review
   */
  const getTranscriptForReview = useCallback(() => {
    return generateTranscript();
  }, [generateTranscript]);

  return {
    // State
    isScribing,
    currentSession,

    // Actions
    startScribing,
    stopScribing,
    recordVoiceTranscript,
    recordConsultation,

    // Output
    generateSynopsis,
    generateTranscript,
    downloadTranscript,
    getTranscriptForReview
  };
};

export default useScribeMode;
