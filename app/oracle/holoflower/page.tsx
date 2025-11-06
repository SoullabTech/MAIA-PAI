'use client';

/**
 * Holoflower Oracle Experience
 *
 * Interactive wedge-based divination - MAIA's signature oracle method
 * Philosophy: Your body knows - expand petals that resonate, receive divine guidance
 *
 * 3-Step Process:
 * 1. Intuitive Check-in: Drag wedges outward to show where you are
 * 2. Oracle Reading: AI analyzes your pattern and generates elemental wisdom
 * 3. Merged Insight: Integration of your intuition + oracle guidance
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  Eye,
  RefreshCw,
  Info,
  Flower2,
  MessageCircle,
  ClipboardList,
  Save
} from 'lucide-react';
import { HoloflowerSurvey } from '@/components/oracle/HoloflowerSurvey';
import { journalService } from '@/lib/services/journalService';
import type { ConfigurationMethod } from '@/types/journal';

type Phase = 'intro' | 'intention' | 'checkin' | 'survey' | 'processing' | 'reading' | 'conversation' | 'merge';

interface Petal {
  id: string;
  name: string;
  element: 'air' | 'fire' | 'water' | 'earth';
  stage: number; // 1=Cardinal/Vector, 2=Fixed/Circle, 3=Mutable/Spiral
  color: string;
  startAngle: number; // radians
  endAngle: number; // radians
  intensity: number; // 0-1, how much user expanded it
  essence: string;
  question: string;
  affirmation: string; // Iconic "I AM" statement
  phase: 'Cardinal' | 'Fixed' | 'Mutable'; // Astrological modality
  geometry: 'Vector' | 'Circle' | 'Spiral'; // Spiralogic sacred geometry
  focusState: string; // The focus state name
}

// 12 wedges matching the holoflower image design - ROTATED 1/4 COUNTER-CLOCKWISE
// Fire now in upper-right (12-3pm), Water in lower-right, Earth in lower-left, Air in upper-left
// Each petal starts at intensity 10 (fully extended) and can be adjusted 1-10
const PETALS: Petal[] = [
  // Fire Petals (upper-right quadrant, red/rust) - starting at 12 o'clock
  // Exact colors from SpiralogicHoloflower reference image
  {
    id: 'Fire1',
    name: 'Vision',
    element: 'fire',
    stage: 1,
    color: '#C67357', // Lightest rust-coral
    startAngle: -Math.PI / 2, // 12 o'clock
    endAngle: -Math.PI / 2 + Math.PI / 6, // 1 o'clock
    intensity: 10,
    essence: 'Self-Awareness',
    question: 'What does your intuition tell you?',
    affirmation: 'I SEE',
    phase: 'Cardinal',
    geometry: 'Vector',
    focusState: 'I Experience'
  },
  {
    id: 'Fire2',
    name: 'Expression',
    element: 'fire',
    stage: 2,
    color: '#B35A3F', // Medium terracotta
    startAngle: -Math.PI / 2 + Math.PI / 6,
    endAngle: -Math.PI / 2 + Math.PI / 3,
    intensity: 10,
    essence: 'Self-In-World',
    question: 'How do you creatively express yourself?',
    affirmation: 'I CREATE',
    phase: 'Fixed',
    geometry: 'Circle',
    focusState: 'I Express'
  },
  {
    id: 'Fire3',
    name: 'Expansion',
    element: 'fire',
    stage: 3,
    color: '#9F4128', // Deep burnt sienna
    startAngle: -Math.PI / 2 + Math.PI / 3,
    endAngle: 0, // 3 o'clock
    intensity: 10,
    essence: 'Transcendent Self',
    question: 'How do you integrate spiritual insights?',
    affirmation: 'I EXPAND',
    phase: 'Mutable',
    geometry: 'Spiral',
    focusState: 'I Expand'
  },

  // Water Petals (lower-right quadrant, blue)
  // WATER - Emotional, Psychic Intelligence: Heart → Healing → Holiness
  {
    id: 'Water1',
    name: 'Heart',
    element: 'water',
    stage: 1,
    color: '#6891AE', // Lightest steel blue
    startAngle: 0, // 3 o'clock
    endAngle: Math.PI / 6,
    intensity: 10,
    essence: 'Emotional Intelligence',
    question: 'How do you feel truly nurtured?',
    affirmation: 'I FEEL',
    phase: 'Cardinal',
    geometry: 'Vector',
    focusState: 'My Heart'
  },
  {
    id: 'Water2',
    name: 'Healing',
    element: 'water',
    stage: 2,
    color: '#557895', // Medium steel blue
    startAngle: Math.PI / 6,
    endAngle: Math.PI / 3,
    intensity: 10,
    essence: 'Inner Transformation',
    question: 'What patterns wish to transform?',
    affirmation: 'I HEAL',
    phase: 'Fixed',
    geometry: 'Circle',
    focusState: 'My Healing'
  },
  {
    id: 'Water3',
    name: 'Holiness',
    element: 'water',
    stage: 3,
    color: '#42607C', // Deep ocean blue
    startAngle: Math.PI / 3,
    endAngle: Math.PI / 2, // 6 o'clock
    intensity: 10,
    essence: 'Deep Self-Awareness',
    question: 'How connected to your inner gold?',
    affirmation: 'I SURRENDER',
    phase: 'Mutable',
    geometry: 'Spiral',
    focusState: 'My Holiness'
  },

  // Earth Petals (lower-left quadrant, green/olive)
  // EARTH - Somatic, Embodied Intelligence: Mission → Means → Medicine
  {
    id: 'Earth1',
    name: 'Mission',
    element: 'earth',
    stage: 1,
    color: '#7F8B5B', // Lightest olive
    startAngle: Math.PI / 2, // 6 o'clock
    endAngle: Math.PI / 2 + Math.PI / 6,
    intensity: 10,
    essence: 'Purpose & Service',
    question: 'What is your purpose in the world?',
    affirmation: 'I SERVE',
    phase: 'Cardinal',
    geometry: 'Vector',
    focusState: 'The Mission'
  },
  {
    id: 'Earth2',
    name: 'Means',
    element: 'earth',
    stage: 2,
    color: '#6C7747', // Medium moss green
    startAngle: Math.PI / 2 + Math.PI / 6,
    endAngle: Math.PI / 2 + Math.PI / 3,
    intensity: 10,
    essence: 'Resources & Plans',
    question: 'What resources support your mission?',
    affirmation: 'I BUILD',
    phase: 'Fixed',
    geometry: 'Circle',
    focusState: 'The Means'
  },
  {
    id: 'Earth3',
    name: 'Medicine',
    element: 'earth',
    stage: 3,
    color: '#596333', // Deep forest green
    startAngle: Math.PI / 2 + Math.PI / 3,
    endAngle: Math.PI, // 9 o'clock
    intensity: 10,
    essence: 'Refined Offering',
    question: 'What medicine do you offer the world?',
    affirmation: 'I EMBODY',
    phase: 'Mutable',
    geometry: 'Spiral',
    focusState: 'The Medicine'
  },

  // Air Petals (upper-left quadrant, yellow/gold)
  // AIR - Mental, Relational, Communicative Intelligence: Connection → Community → Consciousness
  {
    id: 'Air1',
    name: 'Connection',
    element: 'air',
    stage: 1,
    color: '#D4AF78', // Lightest honey gold (original exact match)
    startAngle: Math.PI, // 9 o'clock
    endAngle: Math.PI + Math.PI / 6,
    intensity: 10,
    essence: 'Interpersonal Relating',
    question: 'How do you relate one-to-one?',
    affirmation: 'I RELATE',
    phase: 'Cardinal',
    geometry: 'Vector',
    focusState: 'This Connection'
  },
  {
    id: 'Air2',
    name: 'Community',
    element: 'air',
    stage: 2,
    color: '#C19F60', // Medium amber (original exact match)
    startAngle: Math.PI + Math.PI / 6,
    endAngle: Math.PI + Math.PI / 3,
    intensity: 10,
    essence: 'Collective Dynamics',
    question: 'How do you contribute to community?',
    affirmation: 'I GATHER',
    phase: 'Fixed',
    geometry: 'Circle',
    focusState: 'This Community'
  },
  {
    id: 'Air3',
    name: 'Consciousness',
    element: 'air',
    stage: 3,
    color: '#B89548', // Deep burnt gold (original exact match)
    startAngle: Math.PI + Math.PI / 3,
    endAngle: 3 * Math.PI / 2, // 12 o'clock (back to start, using 3π/2 instead of -π/2)
    intensity: 10,
    essence: 'Elevated Communication',
    question: 'How clearly do you communicate?',
    affirmation: 'I KNOW',
    phase: 'Mutable',
    geometry: 'Spiral',
    focusState: 'This Consciousness'
  },
];

interface OracleReading {
  elementalBalance: {
    fire: number;
    water: number;
    earth: number;
    air: number;
    aether: number;
  };
  spiralStage: {
    element: string;
    stage: number;
  };
  reflection: string;
  practice: string;
  archetype: string;
}

interface MergedInsight {
  alignment: string;
  tension: string;
  synthesis: string;
}

export default function HoloflowerOraclePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intention');
  const [petals, setPetals] = useState<Petal[]>(PETALS);
  const [reading, setReading] = useState<OracleReading | null>(null);
  const [mergedInsight, setMergedInsight] = useState<MergedInsight | null>(null);
  const [hoveredPetal, setHoveredPetal] = useState<string | null>(null);
  const [soulprintView, setSoulprintView] = useState<'circular' | 'bars'>('circular');
  const [intention, setIntention] = useState<string>('');
  const [draggedPetal, setDraggedPetal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Conversation state
  interface ConversationMessage {
    role: 'user' | 'maia';
    content: string;
    timestamp: Date;
  }
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [conversationInput, setConversationInput] = useState('');
  const [isMAIATyping, setIsMAIATyping] = useState(false);

  // Journal state
  const [configurationMethod, setConfigurationMethod] = useState<'manual' | 'iching' | 'survey'>('manual');
  const [currentJournalEntryId, setCurrentJournalEntryId] = useState<string | null>(null);
  const [isSavingToJournal, setIsSavingToJournal] = useState(false);

  // Haptic feedback helper
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30
      };
      navigator.vibrate(patterns[style]);
    }
  };

  const containerSize = 800; // Expanded for mobile-first design with breathing room
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;
  const baseInnerRadius = 30; // Reduced from 40 to open up the frame
  const baseOuterRadius = 165; // Perfect size with tipBulge = 1.15 (max ~190)
  const maxExpansion = 132; // Allow petals to retract 80% (132/165 = 80%)
  const minValue = 1; // Minimum petal value
  const maxValue = 10; // Maximum petal value

  // Smooth rounded petal - gentle curves everywhere like the reference
  const createWedgePath = (
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
  ): string => {
    const midAngle = (startAngle + endAngle) / 2;
    const angleSpan = endAngle - startAngle;

    // Four main corner points
    const innerLeft = {
      x: centerX + Math.cos(startAngle) * innerRadius,
      y: centerY + Math.sin(startAngle) * innerRadius
    };
    const innerRight = {
      x: centerX + Math.cos(endAngle) * innerRadius,
      y: centerY + Math.sin(endAngle) * innerRadius
    };
    const outerLeft = {
      x: centerX + Math.cos(startAngle) * outerRadius,
      y: centerY + Math.sin(startAngle) * outerRadius
    };
    const outerRight = {
      x: centerX + Math.cos(endAngle) * outerRadius,
      y: centerY + Math.sin(endAngle) * outerRadius
    };

    // Midpoints for smooth curves - with pronounced outward bulge like reference
    // Position side curves to flow OVER the corners, not dip inward
    const midLeft = {
      x: centerX + Math.cos(startAngle - angleSpan * 0.15) * (outerRadius * 1.05),
      y: centerY + Math.sin(startAngle - angleSpan * 0.15) * (outerRadius * 1.05)
    };
    const midRight = {
      x: centerX + Math.cos(endAngle + angleSpan * 0.15) * (outerRadius * 1.05),
      y: centerY + Math.sin(endAngle + angleSpan * 0.15) * (outerRadius * 1.05)
    };
    const midInner = {
      x: centerX + Math.cos(midAngle) * (innerRadius * 0.88),
      y: centerY + Math.sin(midAngle) * (innerRadius * 0.88)
    };
    const midOuter = {
      x: centerX + Math.cos(midAngle) * (outerRadius * 1.12),
      y: centerY + Math.sin(midAngle) * (outerRadius * 1.12)
    };

    // Wide shoulder points - positioned further out to reach the edges
    const leftShoulder = {
      x: centerX + Math.cos(startAngle + angleSpan * 0.15) * (outerRadius * 1.08),
      y: centerY + Math.sin(startAngle + angleSpan * 0.15) * (outerRadius * 1.08)
    };
    const rightShoulder = {
      x: centerX + Math.cos(endAngle - angleSpan * 0.15) * (outerRadius * 1.08),
      y: centerY + Math.sin(endAngle - angleSpan * 0.15) * (outerRadius * 1.08)
    };

    // Smooth petal - flow from sides to shoulders to tip, skipping corner points
    return `
      M ${innerLeft.x} ${innerLeft.y}
      Q ${midLeft.x} ${midLeft.y}, ${leftShoulder.x} ${leftShoulder.y}
      Q ${midOuter.x} ${midOuter.y}, ${rightShoulder.x} ${rightShoulder.y}
      Q ${midRight.x} ${midRight.y}, ${innerRight.x} ${innerRight.y}
      Q ${midInner.x} ${midInner.y}, ${innerLeft.x} ${innerLeft.y}
      Z
    `;
  };

  // Handle wedge drag - expand/contract between 1-10
  const handleWedgeDrag = (petalId: string, info: PanInfo) => {
    const petal = petals.find(p => p.id === petalId);
    if (!petal) return;

    // Get center angle of this wedge
    const centerAngle = (petal.startAngle + petal.endAngle) / 2;

    // Project drag vector onto the radial direction (use delta for continuous tracking)
    const dragVector = { x: info.delta.x, y: info.delta.y };
    const radialDirection = {
      x: Math.cos(centerAngle),
      y: Math.sin(centerAngle)
    };

    // Dot product to get radial component (positive = outward, negative = inward)
    const radialDrag = dragVector.x * radialDirection.x + dragVector.y * radialDirection.y;

    // Higher sensitivity for fluid, organic mobile interaction
    // Each pixel of drag translates more directly to petal movement
    const sensitivity = 2.5; // Much higher for smooth, responsive feel

    // Calculate intensity change based on continuous drag delta
    // Full range of motion (maxExpansion = 132px) maps to 9 units (1-10)
    const intensityChange = (radialDrag / maxExpansion) * 9 * sensitivity;

    // Apply change to current intensity with smooth decimal precision
    const currentIntensity = petal.intensity;
    const newIntensity = Math.max(1, Math.min(10, currentIntensity + intensityChange));

    setPetals(prev =>
      prev.map(p =>
        p.id === petalId ? { ...p, intensity: newIntensity } : p // Don't round - keep decimal precision
      )
    );

    // Gentle haptic feedback during drag for organic feel
    if (Math.abs(intensityChange) > 0.1) {
      triggerHaptic('light');
    }
  };

  // I Ching coin toss - proper divination method
  // Returns 6, 7, 8, or 9 (traditional I Ching line values)
  // 6 = old yin (changing), 7 = young yang, 8 = young yin, 9 = old yang (changing)
  const iChingCoinToss = (): number => {
    // Three coins: heads = 3, tails = 2
    // Sum ranges from 6 (three tails) to 9 (three heads)
    let sum = 0;
    for (let i = 0; i < 3; i++) {
      sum += Math.random() < 0.5 ? 2 : 3; // coin flip
    }
    return sum;
  };

  // Generate I Ching hexagram (6 lines)
  const generateHexagram = (): number[] => {
    return Array.from({ length: 6 }, () => iChingCoinToss());
  };

  // Convert I Ching line value (6-9) to petal intensity (1-10)
  // 6 (old yin) -> lower intensity with transformation potential
  // 7 (young yang) -> moderate-high intensity
  // 8 (young yin) -> moderate-low intensity
  // 9 (old yang) -> higher intensity with transformation potential
  const iChingLineToIntensity = (line: number): number => {
    const baseIntensities = {
      6: 3,  // old yin - low but transforming
      7: 7,  // young yang - moderately strong
      8: 4,  // young yin - moderately receptive
      9: 8   // old yang - strong and transforming
    };

    // Add small random variation (±1) for organic feel
    const base = baseIntensities[line as keyof typeof baseIntensities] || 5;
    const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    return Math.max(1, Math.min(10, base + variation));
  };

  // Divine randomization - Let the field choose your configuration
  const askTheField = () => {
    triggerHaptic('medium');
    setConfigurationMethod('iching'); // Track that I Ching was used

    // Generate two I Ching hexagrams (12 lines total for 12 petals)
    const hexagram1 = generateHexagram(); // First 6 petals
    const hexagram2 = generateHexagram(); // Next 6 petals
    const allLines = [...hexagram1, ...hexagram2];

    // Field influences based on time and season
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth(); // 0-11

    // Time of day influences: Fire stronger during day, Water at night
    const isDaytime = hour >= 6 && hour < 18;
    const isNighttime = !isDaytime;

    // Seasonal influences
    const isSpring = month >= 2 && month <= 4; // March-May
    const isSummer = month >= 5 && month <= 7; // June-Aug
    const isAutumn = month >= 8 && month <= 10; // Sep-Nov
    const isWinter = month === 11 || month === 0 || month === 1; // Dec-Feb

    // Generate field-influenced intensities using I Ching
    const newPetals = petals.map((petal, index) => {
      // Get base intensity from I Ching line
      let intensity = iChingLineToIntensity(allLines[index]);

      // Apply elemental field influences (subtle modifiers)
      if (petal.element === 'fire' && isDaytime) {
        intensity += 1; // Fire stronger in day
      }
      if (petal.element === 'water' && isNighttime) {
        intensity += 1; // Water stronger at night
      }
      if (petal.element === 'earth' && (isSpring || isAutumn)) {
        intensity += 0.5; // Earth stronger in transition seasons
      }
      if (petal.element === 'air' && isSummer) {
        intensity += 0.5; // Air stronger in summer
      }

      // Ensure within bounds
      intensity = Math.max(1, Math.min(10, Math.round(intensity)));

      return {
        ...petal,
        intensity
      };
    });

    setPetals(newPetals);

    // Show brief celebration to indicate the field has responded
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 800);
  };

  const submitCheckIn = async () => {
    // Trigger celebration and haptics
    setIsSubmitting(true);
    setShowCelebration(true);
    triggerHaptic('heavy');

    // Brief delay to show celebration
    setTimeout(() => {
      setShowCelebration(false);
      setPhase('processing');
      setIsSubmitting(false);
    }, 1500);

    // Continue with API call after animation starts

    // Get petals with values (all petals have 1-10 values)
    const activePetals = petals.filter(p => p.intensity !== 10); // Changed petals only

    // Format petals for API
    const petalsForAPI = petals.map(p => ({
      id: p.id,
      name: p.name,
      intensity: p.intensity,
      element: p.element,
      affirmation: p.affirmation
    }));

    try {
      // Call the oracle API
      const response = await fetch('/api/oracle-holoflower', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petals: petalsForAPI,
          intention: intention.trim() || undefined
        })
      });

      const data = await response.json();

      // The API returns the reading directly
      setReading(data);

      setTimeout(() => {
        setPhase('reading');
      }, 1500);
    } catch (error) {
      console.error('Failed to get oracle reading:', error);
      // Fallback to reading phase anyway
      setPhase('reading');
    }
  };

  const handleStartConversation = () => {
    setPhase('conversation');
    // Add initial MAIA greeting
    setConversationMessages([{
      role: 'maia',
      content: `I'm here to explore this reading with you. What aspect of your holoflower pattern speaks to you most? What are you curious about, or what feels unclear?`,
      timestamp: new Date()
    }]);
  };

  // Start conversation about a specific aspect of the reading
  const handleDiscussSection = (sectionName: string, content: string) => {
    setPhase('conversation');

    let maiaPrompt = '';

    if (sectionName === 'opportunities') {
      maiaPrompt = `I see you're curious about the opportunities in your reading. ${intention.trim() ? `Looking at your focus on "${intention.trim()}"` : 'In your current pattern'}, these elements want attention: ${content}. What draws you to explore this? How might these relate to what you're holding right now?`;
    } else if (sectionName === 'strengths') {
      maiaPrompt = `Let's explore your strengths. ${intention.trim() ? `With "${intention.trim()}" as your focus` : 'Right now'}, these elements are flowing strongly: ${content}. What feels alive about these for you? How are you experiencing them?`;
    } else if (sectionName === 'archetype-dominant') {
      maiaPrompt = `You want to understand your dominant archetype: ${content}. ${intention.trim() ? `In relation to "${intention.trim()}"` : 'In this moment'}, this is your current energy signature. What resonates? What feels true or surprising about this?`;
    } else if (sectionName === 'archetype-shadow') {
      maiaPrompt = `Let's talk about the shadow archetype: ${content}. This pattern is asking for integration. ${intention.trim() ? `As you think about "${intention.trim()}"` : 'As you sit with this'}, what comes up? What might this part of you be asking for?`;
    } else if (sectionName === 'practice') {
      maiaPrompt = `You're drawn to this practice: "${content}". What speaks to you about it? ${intention.trim() ? `How might it support what you're working with: "${intention.trim()}"?` : 'What feels possible or challenging about trying this?'}`;
    }

    setConversationMessages([{
      role: 'maia',
      content: maiaPrompt,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = async () => {
    if (!conversationInput.trim() || !reading) return;

    const userMessage: ConversationMessage = {
      role: 'user',
      content: conversationInput,
      timestamp: new Date()
    };

    setConversationMessages(prev => [...prev, userMessage]);
    setConversationInput('');
    setIsMAIATyping(true);

    try {
      // Call MAIA API with holoflower context
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are MAIA, helping explore a holoflower oracle reading. ${intention.trim() ? `\n\nThe user's intention/focus for this reading was: "${intention.trim()}"\n` : ''}
The user's reading shows:
- Spiral Stage: ${reading.spiralStage.element.toUpperCase()} ${reading.spiralStage.stage}
- Archetype: ${reading.archetype}
- Reflection: ${reading.reflection}
- Practice: ${reading.practice}

Their adjusted petals were: ${petals.filter(p => p.intensity !== 10).map(p => `${p.name} (${p.affirmation}) at ${p.intensity}/10`).join(', ')}

Engage in a soulful, explorative conversation about meanings, implications, potential, and how this reading relates to their life${intention.trim() ? ' and their stated intention' : ''}. Be warm, insightful, and help them discover what the reading is revealing.`
            },
            ...conversationMessages.map(m => ({
              role: m.role === 'maia' ? 'assistant' : 'user',
              content: m.content
            })),
            {
              role: 'user',
              content: conversationInput
            }
          ]
        })
      });

      const data = await response.json();

      const maiaMessage: ConversationMessage = {
        role: 'maia',
        content: data.response || data.message || 'I sense something profound here. Tell me more...',
        timestamp: new Date()
      };

      setConversationMessages(prev => {
        const updatedMessages = [...prev, maiaMessage];

        // Auto-update journal if entry exists
        if (currentJournalEntryId) {
          journalService.updateJournalEntry(currentJournalEntryId, {
            conversation_messages: updatedMessages.map(m => ({
              role: m.role,
              content: m.content,
              timestamp: m.timestamp
            }))
          }).catch(err => console.error('❌ Failed to update journal conversation:', err));
        }

        return updatedMessages;
      });
    } catch (error) {
      console.error('Failed to get MAIA response:', error);
      setConversationMessages(prev => [...prev, {
        role: 'maia',
        content: 'I\'m having trouble connecting right now. But I\'m still here listening. What\'s alive in you?',
        timestamp: new Date()
      }]);
    } finally {
      setIsMAIATyping(false);
    }
  };

  const handleNewReading = () => {
    setPetals(PETALS);
    setReading(null);
    setMergedInsight(null);
    setConversationMessages([]);
    setIntention('');
    setPhase('intro');
    setCurrentJournalEntryId(null); // Reset journal entry ID
  };

  // Save reading to journal
  const handleSaveToJournal = async () => {
    if (!reading || isSavingToJournal) return;

    setIsSavingToJournal(true);

    try {
      const journalEntry = await journalService.saveJournalEntry({
        intention: intention || undefined,
        configuration_method: configurationMethod,
        petal_intensities: petals,
        spiral_stage: reading.spiralStage,
        archetype: reading.archetype,
        shadow_archetype: reading.archetypes?.shadow,
        elemental_alchemy: reading.elementalAlchemy,
        reflection: reading.reflection,
        practice: reading.practice,
        conversation_messages: conversationMessages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp
        })),
        tags: [],
        is_favorite: false,
        visibility: 'private'
      });

      if (journalEntry) {
        setCurrentJournalEntryId(journalEntry.id);
        console.log('✅ [Holoflower] Saved to journal:', journalEntry.id);
      } else {
        console.error('❌ [Holoflower] Failed to save journal entry');
      }
    } catch (error) {
      console.error('❌ [Holoflower] Error saving to journal:', error);
    } finally {
      setIsSavingToJournal(false);
    }
  };

  const changedPetalCount = petals.filter(p => p.intensity !== 10).length;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #6B4226, #5C3A1F, #4A2F1A)' }}>
      {/* Ambient background glow orbs - rich depth */}
      <div className="fixed inset-0 opacity-15 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: '#D4A574' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: '#C67357' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl" style={{ background: '#D4B896' }} />
      </div>

      {/* Atmospheric Particles - Floating dust/sparkles like MAIA */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() > 0.7 ? '2px' : '1px',
              height: Math.random() > 0.7 ? '2px' : '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: Math.random() > 0.5 ? '#D4B896' : '#FBD38D',
            }}
            animate={{
              y: [0, -60 * Math.random(), 0],
              x: [0, (Math.random() - 0.5) * 40, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [0.8, 1.4, 0.8],
            }}
            transition={{
              duration: 5 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Additional sparkle layer - smaller, faster particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-px h-px bg-amber-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Atmospheric Glow - Warm light from below */}
      <div className="fixed bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#3d2817]/30 via-amber-950/5 to-transparent pointer-events-none z-0" />

      {/* Sacred geometry overlay - subtle mystic patterns */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#D4B896" strokeWidth="0.5" strokeDasharray="5 5" />
          <circle cx="500" cy="500" r="300" fill="none" stroke="#D4B896" strokeWidth="0.5" strokeDasharray="5 5" />
          <circle cx="500" cy="500" r="200" fill="none" stroke="#D4B896" strokeWidth="0.5" strokeDasharray="5 5" />
          <path d="M 500 100 L 866 250 L 866 750 L 500 900 L 134 750 L 134 250 Z" fill="none" stroke="#D4B896" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </div>

      {/* Holographic scan line - subtle movement */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-b from-transparent via-amber-600/5 to-transparent pointer-events-none z-0"
        animate={{
          y: ['-100%', '200%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-5xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <button
              onClick={() => router.push('/oracle')}
              className="flex items-center gap-2 text-amber-400/70 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Oracle</span>
            </button>

            <div className="flex items-center gap-2">
              <Image
                src="/holoflower.svg"
                alt="Holoflower"
                width={24}
                height={24}
                className="w-6 h-6 opacity-80"
              />
              <h1 className="text-2xl font-light text-amber-200 tracking-wide">Holoflower Oracle</h1>
            </div>

            <div className="w-24" />
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Intro Phase */}
            {phase === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  }}
                  className="inline-block mb-6 w-24 h-24 relative"
                >
                  <Image
                    src="/holoflower.svg"
                    alt="Holoflower"
                    width={96}
                    height={96}
                    className="w-full h-full opacity-80"
                  />
                </motion.div>

                <h2 className="text-4xl font-bold text-amber-100 mb-4">
                  The Living Mandala
                </h2>
                <p className="text-amber-300/90 text-lg mb-8 leading-relaxed">
                  Your body knows where you are. Adjust each petal to reflect your current state—no need to understand what they mean. Trust your intuition, then receive divine guidance.
                </p>

                <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-4 text-left">
                    <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                    <div className="text-amber-200/90 text-sm space-y-2">
                      <p><strong className="text-amber-300">All petals start at 10</strong> (full expression)</p>
                      <p><strong className="text-amber-300">Drag inward to decrease</strong> or outward to increase (1-10 scale)</p>
                      <p><strong className="text-amber-300">Adjust intuitively</strong> — your body knows which facets need attention</p>
                      <p><strong className="text-amber-300">Click the center</strong> to receive your reading</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setPhase('intention')}
                  className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <Heart className="w-5 h-5" />
                  Begin Check-In
                </button>
              </motion.div>
            )}

            {/* Intention Phase - Sacred focus before adjustment */}
            {phase === 'intention' && (
              <motion.div
                key="intention"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-8">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-amber-900/30 border border-amber-600/30"
                  >
                    <Eye className="w-8 h-8 text-amber-400" />
                  </motion.div>

                  <h2 className="text-3xl font-bold text-amber-100 mb-3">
                    Set Your Intention
                  </h2>
                  <p className="text-amber-300/90 text-lg mb-2">
                    What brings you to the oracle today?
                  </p>
                  <p className="text-amber-400/70 text-sm">
                    This helps MAIA understand the context of your reading and offer more attuned guidance
                  </p>
                </div>

                <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-6 mb-6">
                  <label className="block text-amber-300 text-sm font-medium mb-3">
                    Your Question or Focus
                  </label>
                  <textarea
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="e.g., 'I'm seeking clarity on a major decision...' or 'How can I move through this transition?' or simply 'What do I need to know right now?'"
                    className="w-full h-32 px-4 py-3 bg-amber-950/40 border border-amber-600/30 rounded-lg text-amber-100 placeholder-amber-500/40 focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                  <p className="text-amber-400/60 text-xs mt-2">
                    Optional but recommended — or skip if you prefer to receive guidance without framing
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setPhase('intro')}
                    className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/40 border border-amber-700/40 text-amber-300 font-medium rounded-lg transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setPhase('checkin')}
                    className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
                  >
                    {intention.trim() ? 'Continue to Check-In' : 'Skip to Check-In'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Check-In Phase */}
            {phase === 'checkin' && (
              <motion.div
                key="checkin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-amber-100 mb-2">
                    Where Are You Right Now?
                  </h2>
                  <p className="text-amber-300/90">
                    Drag petals inward/outward (1-10) • {changedPetalCount} adjusted
                  </p>
                </div>

                {/* Interactive Holoflower with Wedge Petals */}
                <div className="relative mx-auto flex justify-center">
                  {/* Celebration Particles */}
                  {showCelebration && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(30)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            left: `${50}%`,
                            top: `${50}%`,
                            background: `hsl(${Math.random() * 360}, 100%, 70%)`,
                          }}
                          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                          animate={{
                            scale: [0, 1.5, 0],
                            x: (Math.random() - 0.5) * 400,
                            y: (Math.random() - 0.5) * 400,
                            opacity: [1, 0.8, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.02,
                            ease: 'easeOut',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <svg
                    width={containerSize}
                    height={containerSize}
                    className="drop-shadow-2xl"
                  >
                    {/* Gradient definitions for glass-like DMT sheen */}
                    <defs>
                      <linearGradient id="glass-shine" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
                        <stop offset="40%" stopColor="rgba(255, 255, 255, 0.1)" />
                        <stop offset="60%" stopColor="rgba(255, 255, 255, 0)" />
                        <stop offset="100%" stopColor="rgba(0, 0, 0, 0.15)" />
                      </linearGradient>
                    </defs>

                    {/* Draw all wedge petals */}
                    {petals.map((petal) => {
                      // Map 1-10 intensity to radius (1 = smallest, 10 = largest)
                      const radiusRatio = (petal.intensity - 1) / 9; // 0 to 1
                      const outerRadius = baseOuterRadius + (radiusRatio * maxExpansion);
                      const isHovered = hoveredPetal === petal.id;
                      const isDragged = draggedPetal === petal.id;
                      const isChanged = petal.intensity !== 10;

                      return (
                        <g key={petal.id}>
                          {/* Glow effect for changed petals */}
                          {isChanged && (
                            <motion.path
                              d={createWedgePath(
                                baseInnerRadius - 3,
                                outerRadius + 3,
                                petal.startAngle,
                                petal.endAngle
                              )}
                              fill="none"
                              stroke={petal.color}
                              strokeWidth={2}
                              opacity={0.5}
                              filter="blur(6px)"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.5 }}
                            />
                          )}

                          {/* Main wedge with organic spring animation */}
                          <motion.path
                            key={`${petal.id}-${outerRadius}`} // Force re-render on size change for smooth morph
                            d={createWedgePath(
                              baseInnerRadius,
                              outerRadius,
                              petal.startAngle,
                              petal.endAngle
                            )}
                            fill={petal.color}
                            stroke="none"
                            opacity={0.98}
                            style={{
                              filter: `saturate(1.5) brightness(1.05) contrast(1.1)` // Richer, deeper colors with more saturation
                            }}
                            className="cursor-grab active:cursor-grabbing"
                            onMouseEnter={() => {
                              setHoveredPetal(petal.id);
                              triggerHaptic('light');
                            }}
                            onMouseLeave={() => setHoveredPetal(null)}
                            initial={false}
                            animate={{
                              opacity: isHovered ? 1 : 0.92,
                              filter: isChanged
                                ? `drop-shadow(0 10px 24px ${petal.color}BB) drop-shadow(0 0 ${petal.intensity * 5}px ${petal.color}) drop-shadow(0 16px 40px rgba(0,0,0,0.5))`
                                : 'drop-shadow(0 8px 20px rgba(0,0,0,0.55)) drop-shadow(0 16px 40px rgba(0,0,0,0.45)) drop-shadow(0 24px 60px rgba(0,0,0,0.3))'
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 400, // Increased for more responsive feel
                              damping: 30,    // Increased for smoother motion
                              mass: 0.5       // Reduced for quicker, lighter response
                            }}
                          />

                          {/* Glass shine overlay - creates slick DMT glass effect */}
                          <motion.path
                            d={createWedgePath(
                              baseInnerRadius,
                              outerRadius,
                              petal.startAngle,
                              petal.endAngle
                            )}
                            fill="url(#glass-shine)"
                            opacity={0.6}
                            style={{ pointerEvents: 'none', mixBlendMode: 'overlay' }}
                            initial={false}
                            animate={{
                              opacity: isHovered ? 0.75 : 0.6
                            }}
                          />

                          {/* Extended drag handle - reaches above petal for easy finger access */}
                          <motion.path
                            d={createWedgePath(
                              outerRadius * 0.3, // Start from 30% out for even larger touch area
                              outerRadius * 1.15 + 15,  // Extend just above petal tip (tipBulge = 1.15)
                              petal.startAngle,
                              petal.endAngle
                            )}
                            fill="transparent"
                            className="cursor-grab active:cursor-grabbing"
                            drag
                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            dragElastic={0.35}  // Higher elasticity for organic, living petal feel
                            dragMomentum={false} // Disable momentum for precise control
                            dragTransition={{ bounceStiffness: 500, bounceDamping: 30 }} // Smooth organic bounce
                            onDrag={(_, info) => handleWedgeDrag(petal.id, info)}
                            onDragStart={() => {
                              setDraggedPetal(petal.id);
                              triggerHaptic('medium');
                            }}
                            onDragEnd={() => {
                              setDraggedPetal(null);
                              triggerHaptic('light');
                            }}
                            onMouseEnter={() => setHoveredPetal(petal.id)}
                            onMouseLeave={() => setHoveredPetal(null)}
                          />
                        </g>
                      );
                    })}

                    {/* Center Circle - Plasmic Field with Elemental Holoflower */}
                    <motion.g>
                      {/* Outer plasmic glow ring - wide pulsing field */}
                      <motion.circle
                        cx={centerX}
                        cy={centerY}
                        r={baseInnerRadius + 30}
                        fill="url(#plasmicGradient)"
                        opacity={0.3}
                        animate={{
                          r: [baseInnerRadius + 25, baseInnerRadius + 35, baseInnerRadius + 25],
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />

                      {/* Middle plasmic glow ring */}
                      <motion.circle
                        cx={centerX}
                        cy={centerY}
                        r={baseInnerRadius + 18}
                        fill="url(#plasmicGradient)"
                        opacity={0.4}
                        animate={{
                          r: [baseInnerRadius + 15, baseInnerRadius + 22, baseInnerRadius + 15],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.3
                        }}
                      />

                      {/* Inner bright ring */}
                      <motion.circle
                        cx={centerX}
                        cy={centerY}
                        r={baseInnerRadius + 6}
                        fill="url(#plasmicGradient)"
                        opacity={0.6}
                        animate={{
                          r: [baseInnerRadius + 4, baseInnerRadius + 8, baseInnerRadius + 4],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.6
                        }}
                      />

                      {/* Center button - Elemental Holoflower with pulsing effect */}
                      <motion.g
                        className="cursor-pointer"
                        onClick={submitCheckIn}
                        whileHover={{ scale: 1.1 }}
                        animate={{
                          scale: showCelebration ? [1, 1.3, 1] : 1,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 20
                        }}
                      >
                        <motion.image
                          href="/elementalHoloflower.png"
                          x={centerX - baseInnerRadius * 1.3}
                          y={centerY - baseInnerRadius * 1.3}
                          width={baseInnerRadius * 2.6}
                          height={baseInnerRadius * 2.6}
                          className="cursor-pointer"
                          animate={{
                            filter: showCelebration
                              ? 'drop-shadow(0 0 30px rgba(251, 191, 59, 0.9)) drop-shadow(0 0 60px rgba(251, 191, 59, 0.6))'
                              : 'drop-shadow(0 0 15px rgba(251, 191, 59, 0.5)) drop-shadow(0 0 30px rgba(251, 191, 59, 0.3))'
                          }}
                        />
                      </motion.g>
                    </motion.g>

                    {/* Emanating sparkles - life force radiating from center */}
                    {[...Array(12)].map((_, i) => {
                      const angle = (i / 12) * Math.PI * 2;
                      const startRadius = baseInnerRadius + 10;
                      const endRadius = baseInnerRadius + 50;
                      const sparkleX = centerX + Math.cos(angle) * startRadius;
                      const sparkleY = centerY + Math.sin(angle) * startRadius;
                      const endX = centerX + Math.cos(angle) * endRadius;
                      const endY = centerY + Math.sin(angle) * endRadius;

                      return (
                        <motion.circle
                          key={`sparkle-${i}`}
                          cx={sparkleX}
                          cy={sparkleY}
                          r={2}
                          fill="#FBB03B"
                          opacity={0.8}
                          animate={{
                            cx: [sparkleX, endX, sparkleX],
                            cy: [sparkleY, endY, sparkleY],
                            opacity: [0.8, 0, 0.8],
                            r: [2, 1, 2]
                          }}
                          transition={{
                            duration: 2 + (i % 3),
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeOut"
                          }}
                        />
                      );
                    })}

                    {/* Gradient definitions */}
                    <defs>
                      {/* Plasmic field gradient - warm amber glow */}
                      <radialGradient id="plasmicGradient">
                        <stop offset="0%" stopColor="#FBB03B" stopOpacity={0.8} />
                        <stop offset="40%" stopColor="#F59E0B" stopOpacity={0.5} />
                        <stop offset="70%" stopColor="#D97706" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#B45309" stopOpacity={0.1} />
                      </radialGradient>

                      <radialGradient id="centerGradient">
                        <stop offset="0%" stopColor="#FFD700" stopOpacity={0.8} />
                        <stop offset="50%" stopColor="#FF6B35" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#E91E63" stopOpacity={0.4} />
                      </radialGradient>
                    </defs>
                  </svg>

                  {/* Candy-colored tooltip popup - iconic symbolic display */}
                  <AnimatePresence>
                    {hoveredPetal && (() => {
                      const petal = petals.find(p => p.id === hoveredPetal);
                      if (!petal) return null;

                      // Iconic symbolic indicators for each element
                      const getSymbol = () => {
                        switch(petal.element) {
                          case 'fire': return '🔥';
                          case 'water': return '💧';
                          case 'earth': return '🌱';
                          case 'air': return '💨';
                          default: return '✨';
                        }
                      };

                      // Get iconic statement - Spiralogic archetypal progression
                      const getIconicStatement = () => {
                        // 🔥 FIRE - Spiritual, Intuitive Intelligence
                        // Vision → Expression → Expansion
                        if (petal.id === 'Fire1') return 'I SEE'; // Vision - awakening to possibility
                        if (petal.id === 'Fire2') return 'I CREATE'; // Expression - manifesting vision
                        if (petal.id === 'Fire3') return 'I EXPAND'; // Expansion - reaching higher

                        // 💧 WATER - Emotional, Psychic Intelligence
                        // Heart → Healing → Holiness
                        if (petal.id === 'Water1') return 'I FEEL'; // Heart - opening to emotion
                        if (petal.id === 'Water2') return 'I HEAL'; // Healing - transforming pain
                        if (petal.id === 'Water3') return 'I SURRENDER'; // Holiness - merging with the sacred

                        // 🌍 EARTH - Somatic, Embodied Intelligence
                        // Mission → Means → Medicine
                        if (petal.id === 'Earth1') return 'I SERVE'; // Mission - purpose in action
                        if (petal.id === 'Earth2') return 'I BUILD'; // Means - creating structure
                        if (petal.id === 'Earth3') return 'I EMBODY'; // Medicine - becoming the gift

                        // 🌬 AIR - Mental, Relational, Communicative Intelligence
                        // Connection → Community → Consciousness
                        if (petal.id === 'Air1') return 'I RELATE'; // Connection - one-to-one bonding
                        if (petal.id === 'Air2') return 'I GATHER'; // Community - weaving the web
                        if (petal.id === 'Air3') return 'I KNOW'; // Consciousness - elevated awareness

                        return 'I AM';
                      };

                      // Calculate position opposite to petal
                      // Petal's midAngle tells us where it is, we position tooltip on opposite side
                      const midAngle = (petal.startAngle + petal.endAngle) / 2;

                      // Determine which quadrant the petal is in and position tooltip opposite
                      let tooltipClass = 'absolute w-56 rounded-2xl backdrop-blur-xl border-2 shadow-2xl text-center z-50 overflow-hidden';

                      // Top petals (Fire) -> tooltip at bottom
                      // Bottom petals (Earth) -> tooltip at top
                      // Right petals (Water) -> tooltip at left
                      // Left petals (Air) -> tooltip at right

                      if (midAngle >= -Math.PI/2 && midAngle < 0) {
                        // Fire quadrant (top-right) -> position tooltip at bottom-left
                        tooltipClass += ' bottom-8 left-8';
                      } else if (midAngle >= 0 && midAngle < Math.PI/2) {
                        // Water quadrant (bottom-right) -> position tooltip at top-left
                        tooltipClass += ' top-8 left-8';
                      } else if (midAngle >= Math.PI/2 && midAngle < Math.PI) {
                        // Earth quadrant (bottom-left) -> position tooltip at top-right
                        tooltipClass += ' top-8 right-8';
                      } else {
                        // Air quadrant (top-left) -> position tooltip at bottom-right
                        tooltipClass += ' bottom-8 right-8';
                      }

                      return (
                        <motion.div
                          key={petal.id}
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className={tooltipClass}
                          style={{
                            backgroundColor: `${petal.color}F0`, // 94% opacity for candy richness
                            borderColor: `${petal.color}`,
                            boxShadow: `0 0 40px ${petal.color}80, 0 20px 60px rgba(0,0,0,0.5)`,
                            filter: 'saturate(1.4) brightness(1.1)'
                          }}
                        >
                          {/* Glass shine overlay on tooltip */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.1) 100%)',
                              mixBlendMode: 'overlay'
                            }}
                          />

                          <div className="relative px-6 py-5">
                            {/* Symbolic emoji */}
                            <motion.div
                              className="text-4xl mb-2"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
                            >
                              {getSymbol()}
                            </motion.div>

                            {/* Iconic statement - main focus */}
                            <motion.p
                              className="text-white font-bold text-2xl mb-2 drop-shadow-lg"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.15 }}
                              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                            >
                              {getIconicStatement()}
                            </motion.p>

                            {/* Petal name */}
                            <motion.p
                              className="text-white/95 font-semibold text-base"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {petal.name}
                            </motion.p>

                            {/* Element indicator */}
                            <motion.p
                              className="text-white/70 text-xs font-medium mt-1 uppercase tracking-widest"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.25 }}
                            >
                              {petal.element} {petal.stage}
                            </motion.p>
                          </div>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>

                {/* Petal Values Display */}
                {changedPetalCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-amber-900/20 border border-amber-700/30 rounded-xl p-6"
                  >
                    <h3 className="text-amber-300 font-semibold mb-4 text-center">Adjusted Petals</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {petals
                        .filter(p => p.intensity !== 10)
                        .sort((a, b) => a.intensity - b.intensity) // Sort by value ascending
                        .map(p => (
                          <div key={p.id} className="flex items-center gap-3 bg-amber-950/30 rounded-lg p-3">
                            <div
                              className="w-8 h-8 rounded-full flex-shrink-0"
                              style={{ background: p.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-amber-200 text-sm font-medium truncate">{p.name}</p>
                              <p className="text-amber-400/90 text-xs font-bold">{p.intensity}/10</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                )}

                {/* Ask the Field Button - Divine Randomization */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 text-center"
                >
                  <button
                    onClick={askTheField}
                    disabled={isSubmitting}
                    className="group relative px-8 py-4 bg-gradient-to-r from-amber-900/40 via-amber-800/50 to-amber-900/40 hover:from-amber-800/60 hover:via-amber-700/70 hover:to-amber-800/60 border border-amber-600/40 hover:border-amber-500/60 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-900/50"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                         style={{
                           background: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
                         }} />

                    <div className="relative flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-amber-300 group-hover:text-amber-200 transition-colors" />
                      <span className="text-amber-100 font-semibold text-lg">Ask the Field</span>
                      <Sparkles className="w-5 h-5 text-amber-300 group-hover:text-amber-200 transition-colors" />
                    </div>

                    <p className="relative text-amber-300/70 text-sm mt-1">Let the oracle choose for you</p>
                  </button>

                  <p className="text-amber-300/50 text-xs mt-4 max-w-md mx-auto">
                    Using I Ching divination • Two hexagrams cast for your moment • Influenced by cosmic time
                  </p>

                  {/* OR Divider */}
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-amber-700/30"></div>
                    <span className="text-amber-400/60 text-sm">or</span>
                    <div className="flex-1 h-px bg-amber-700/30"></div>
                  </div>

                  {/* Take Survey Button */}
                  <button
                    onClick={() => setPhase('survey')}
                    disabled={isSubmitting}
                    className="group relative px-8 py-4 bg-gradient-to-r from-amber-900/40 via-amber-800/50 to-amber-900/40 hover:from-amber-800/60 hover:via-amber-700/70 hover:to-amber-800/60 border border-amber-600/40 hover:border-amber-500/60 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-900/50"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                         style={{
                           background: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.2) 0%, transparent 70%)',
                         }} />

                    <div className="relative flex items-center gap-3">
                      <ClipboardList className="w-5 h-5 text-amber-300 group-hover:text-amber-200 transition-colors" />
                      <span className="text-amber-100 font-semibold text-lg">Take the Survey</span>
                    </div>

                    <p className="relative text-amber-300/70 text-sm mt-1">Reflect through questions</p>
                  </button>

                  <p className="text-amber-300/50 text-xs mt-4 max-w-md mx-auto">
                    36 questions from original Spiralogic survey • Cognitive path to self-reflection
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Survey Phase */}
            {phase === 'survey' && (
              <HoloflowerSurvey
                onComplete={(petalIntensities) => {
                  // Track that survey was used
                  setConfigurationMethod('survey');

                  // Map survey results to petal intensities
                  const updatedPetals = petals.map(petal => ({
                    ...petal,
                    intensity: petalIntensities[petal.id] || 10
                  }));
                  setPetals(updatedPetals);

                  // Show celebration
                  setShowCelebration(true);
                  setTimeout(() => setShowCelebration(false), 1500);

                  // Move to check-in phase to show results
                  setPhase('checkin');
                }}
                onCancel={() => setPhase('checkin')}
              />
            )}

            {/* Processing Phase */}
            {phase === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="mb-8 w-20 h-20 relative"
                >
                  <Image
                    src="/holoflower.svg"
                    alt="Holoflower"
                    width={80}
                    height={80}
                    className="w-full h-full opacity-80"
                  />
                </motion.div>

                <h2 className="text-3xl font-bold text-amber-100 mb-4">
                  Consulting the Oracle...
                </h2>
                <p className="text-amber-300/90 text-lg">
                  Weaving your intuition with divine wisdom
                </p>
              </motion.div>
            )}

            {/* Reading & Merge Phase */}
            {(phase === 'reading' || phase === 'merge') && reading && (
              <motion.div
                key="reading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                {/* Intention Context (if provided) */}
                {intention.trim() && (
                  <div className="bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-900/20 backdrop-blur-sm border border-amber-700/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Heart className="w-4 h-4 text-amber-400/70 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-400/70 text-xs font-medium mb-1">Your Intention</p>
                        <p className="text-amber-200/80 text-sm italic leading-relaxed">"{intention.trim()}"</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Oracle Reading */}
                <div className="bg-gradient-to-br from-amber-900/30 via-amber-800/20 to-orange-900/30 backdrop-blur-xl border border-amber-600/30 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="w-6 h-6 text-amber-400" />
                    <h3 className="text-2xl font-bold text-amber-100">Oracle Reading</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Elemental Alchemy - Strengths and Opportunities */}
                    <div>
                      <h4 className="text-amber-300/90 font-semibold mb-3">Elemental Alchemy</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={() => handleDiscussSection('strengths', reading?.elementalAlchemy?.strengths?.join(', ') || '')}
                          className="w-full bg-amber-950/40 hover:bg-amber-900/50 rounded-lg p-4 border border-amber-600/20 hover:border-amber-500/40 transition-all duration-300 text-left group cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-amber-200/80 text-sm font-semibold">✨ Strengths</h5>
                            <MessageCircle className="w-3.5 h-3.5 text-amber-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <ul className="space-y-1">
                            {reading?.elementalAlchemy?.strengths?.map((strength: string, idx: number) => (
                              <li key={idx} className="text-amber-200/90 text-sm">{strength}</li>
                            ))}
                          </ul>
                          <p className="text-amber-400/50 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to discuss with MAIA</p>
                        </button>
                        <button
                          onClick={() => handleDiscussSection('opportunities', reading?.elementalAlchemy?.opportunities?.join(', ') || '')}
                          className="w-full bg-amber-950/40 hover:bg-amber-900/50 rounded-lg p-4 border border-amber-600/20 hover:border-amber-500/40 transition-all duration-300 text-left group cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-amber-200/80 text-sm font-semibold">🌱 Opportunities</h5>
                            <MessageCircle className="w-3.5 h-3.5 text-amber-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <ul className="space-y-1">
                            {reading?.elementalAlchemy?.opportunities?.map((opp: string, idx: number) => (
                              <li key={idx} className="text-amber-200/90 text-sm">{opp}</li>
                            ))}
                          </ul>
                          <p className="text-amber-400/50 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to discuss with MAIA</p>
                        </button>
                      </div>
                    </div>

                    {/* Archetypes - Dominant and Shadow */}
                    <div>
                      <h4 className="text-amber-300/90 font-semibold mb-3">Archetypes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-amber-950/40 rounded-lg p-4 border border-amber-600/20">
                          <h5 className="text-amber-200/80 text-sm font-semibold mb-2">☀️ Dominant</h5>
                          <p className="text-amber-200/90 text-lg">{reading?.archetypes?.dominant}</p>
                          <p className="text-amber-300/70 text-xs mt-1">Your current energy signature</p>
                        </div>
                        <div className="bg-amber-950/40 rounded-lg p-4 border border-amber-600/20">
                          <h5 className="text-amber-200/80 text-sm font-semibold mb-2">🌑 Shadow</h5>
                          <p className="text-amber-200/90 text-lg">{reading?.archetypes?.shadow}</p>
                          <p className="text-amber-300/70 text-xs mt-1">The pattern asking for integration</p>
                        </div>
                      </div>
                    </div>

                    {/* Questions to Explore */}
                    <div>
                      <h4 className="text-amber-300/90 font-semibold mb-2">Questions to Explore with MAIA</h4>
                      <p className="text-amber-200/90 leading-relaxed whitespace-pre-line">{reading?.reflection}</p>
                    </div>

                    {/* Practice */}
                    <div>
                      <h4 className="text-amber-300/90 font-semibold mb-2">Practice</h4>
                      <p className="text-amber-200/90 leading-relaxed italic">{reading?.practice}</p>
                    </div>
                  </div>
                </div>

                {/* Holoflower Soulprint - Toggleable visualization */}
                <div className="bg-gradient-to-br from-amber-900/30 via-amber-800/20 to-orange-900/30 backdrop-blur-xl border border-amber-600/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Flower2 className="w-5 h-5 text-amber-400" />
                      <h3 className="text-lg font-semibold text-amber-100">Your Holoflower Snapshot</h3>
                    </div>

                    {/* Toggle View Button */}
                    <button
                      onClick={() => setSoulprintView(soulprintView === 'circular' ? 'bars' : 'circular')}
                      className="px-3 py-1.5 text-xs bg-amber-900/40 hover:bg-amber-800/50 border border-amber-600/30 rounded-lg text-amber-300 transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {soulprintView === 'circular' ? 'Show Bars' : 'Show Circle'}
                    </button>
                  </div>

                  {/* Circular View */}
                  {soulprintView === 'circular' && (
                    <div className="flex justify-center">
                      <svg
                        viewBox="0 0 400 400"
                        className="w-full max-w-md h-auto"
                        style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.3))' }}
                      >
                        {/* Render petals */}
                        {petals.map((petal, index) => {
                          const totalPetals = petals.length;
                          const anglePerPetal = (2 * Math.PI) / totalPetals;
                          const startAngle = index * anglePerPetal - Math.PI / 2;
                          const endAngle = startAngle + anglePerPetal;

                          const centerX = 200;
                          const centerY = 200;
                          const baseInnerRadius = 60;
                          const baseOuterRadius = 160;

                          // Calculate radius based on intensity
                          const outerRadius = baseInnerRadius + (petal.intensity / 10) * (baseOuterRadius - baseInnerRadius);

                          // Calculate wedge path
                          const innerStartX = centerX + baseInnerRadius * Math.cos(startAngle);
                          const innerStartY = centerY + baseInnerRadius * Math.sin(startAngle);
                          const innerEndX = centerX + baseInnerRadius * Math.cos(endAngle);
                          const innerEndY = centerY + baseInnerRadius * Math.sin(endAngle);
                          const outerStartX = centerX + outerRadius * Math.cos(startAngle);
                          const outerStartY = centerY + outerRadius * Math.sin(startAngle);
                          const outerEndX = centerX + outerRadius * Math.cos(endAngle);
                          const outerEndY = centerY + outerRadius * Math.sin(endAngle);

                          const pathData = `
                            M ${innerStartX} ${innerStartY}
                            L ${outerStartX} ${outerStartY}
                            A ${outerRadius} ${outerRadius} 0 0 1 ${outerEndX} ${outerEndY}
                            L ${innerEndX} ${innerEndY}
                            A ${baseInnerRadius} ${baseInnerRadius} 0 0 0 ${innerStartX} ${innerStartY}
                            Z
                          `;

                          const color = petal.color;
                          const opacity = 0.7 + (petal.intensity / 10) * 0.3;

                          return (
                            <g key={petal.id}>
                              <path
                                d={pathData}
                                fill={color}
                                fillOpacity={opacity}
                                stroke={color}
                                strokeWidth="1.5"
                                strokeOpacity={0.8}
                              />
                            </g>
                          );
                        })}

                        {/* Center circle with elemental holoflower */}
                        <circle
                          cx={200}
                          cy={200}
                          r={60}
                          fill="url(#readingPlasmicGradient)"
                          opacity={0.8}
                        />

                        <image
                          href="/elementalHoloflower.png"
                          x={200 - 45}
                          y={200 - 45}
                          width={90}
                          height={90}
                          opacity={0.9}
                        />

                        {/* Gradient definition */}
                        <defs>
                          <radialGradient id="readingPlasmicGradient">
                            <stop offset="0%" stopColor="#FBB03B" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#B45309" stopOpacity={0.2} />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  )}

                  {/* Horizontal Bar Chart View */}
                  {soulprintView === 'bars' && (
                    <div className="space-y-2">
                      {petals.map((petal) => (
                        <div key={petal.id} className="flex items-center gap-3">
                          {/* Petal Label */}
                          <div className="w-24 text-right">
                            <span className="text-amber-200/90 text-sm font-medium">{petal.id}</span>
                          </div>

                          {/* Bar Container */}
                          <div className="flex-1 bg-amber-950/40 rounded-full h-6 overflow-hidden border border-amber-600/20 relative">
                            {/* Filled Bar */}
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${petal.intensity * 10}%`,
                                backgroundColor: petal.color,
                                opacity: 0.8
                              }}
                            />
                          </div>

                          {/* Essence Label */}
                          <div className="w-32 hidden md:block">
                            <span className="text-amber-300/60 text-xs">{petal.essence}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Merged Insight */}
                {mergedInsight && (
                  <div className="bg-gradient-to-br from-amber-900/20 via-amber-800/10 to-orange-900/20 backdrop-blur-xl border border-amber-600/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="w-5 h-5 text-amber-400" />
                      <h3 className="text-xl font-bold text-amber-100">Integration</h3>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="text-amber-300/90 font-semibold mb-1">Alignment:</h4>
                        <p className="text-amber-200/90">{mergedInsight.alignment}</p>
                      </div>

                      <div>
                        <h4 className="text-amber-300/90 font-semibold mb-1">Creative Tension:</h4>
                        <p className="text-amber-200/90">{mergedInsight.tension}</p>
                      </div>

                      <div>
                        <h4 className="text-amber-300/90 font-semibold mb-1">Synthesis:</h4>
                        <p className="text-amber-200/90">{mergedInsight.synthesis}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-4">
                  {/* Talk with MAIA Button - Primary Action */}
                  <button
                    onClick={handleStartConversation}
                    className="w-full px-8 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 hover:from-amber-500 hover:via-amber-400 hover:to-orange-500 text-white font-bold text-lg rounded-xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
                  >
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Talk with MAIA about this reading
                    <Sparkles className="w-6 h-6 group-hover:-rotate-12 transition-transform" />
                  </button>

                  {/* Save to Journal Button */}
                  {currentJournalEntryId ? (
                    <div className="px-6 py-3 bg-amber-900/30 border border-amber-600/40 rounded-lg flex items-center justify-center gap-2 text-amber-200/80">
                      <Heart className="w-4 h-4 fill-amber-300 text-amber-300" />
                      <span className="text-sm font-medium">Saved to your soul journal</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleSaveToJournal}
                      disabled={isSavingToJournal}
                      className="w-full px-6 py-3 bg-amber-900/40 hover:bg-amber-800/50 border border-amber-600/30 hover:border-amber-500/50 text-amber-200 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {isSavingToJournal ? 'Saving...' : 'Save to Journal'}
                    </button>
                  )}

                  {/* Secondary Actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleNewReading}
                      className="flex-1 px-6 py-3 bg-amber-900/40 hover:bg-amber-800/50 text-amber-200 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      New Reading
                    </button>
                    <button
                      onClick={() => router.push('/oracle')}
                      className="px-6 py-3 bg-amber-900/40 hover:bg-amber-800/50 text-amber-200 font-semibold rounded-lg transition-all duration-300"
                    >
                      Back to Oracle
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Conversation Phase - Talk with MAIA */}
            {phase === 'conversation' && (
              <motion.div
                key="conversation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                {/* Header */}
                <div className="text-center relative">
                  {/* Back to Reading button */}
                  <button
                    onClick={() => setPhase('reading')}
                    className="absolute left-0 top-0 px-4 py-2 bg-amber-900/40 hover:bg-amber-800/50 text-amber-200 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Reading
                  </button>

                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-3 mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-amber-400" />
                    <h2 className="text-3xl font-bold text-amber-100">
                      Conversation with MAIA
                    </h2>
                    <Sparkles className="w-8 h-8 text-amber-400" />
                  </motion.div>
                  <p className="text-amber-300/80 text-lg">
                    Let's explore the meanings and implications of your reading together
                  </p>
                </div>

                {/* Holoflower Soulprint - Toggleable visualization */}
                <div className="bg-gradient-to-br from-amber-900/30 via-amber-800/20 to-orange-900/30 backdrop-blur-xl border border-amber-600/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Flower2 className="w-5 h-5 text-amber-400" />
                      <h3 className="text-lg font-semibold text-amber-100">Your Holoflower Snapshot</h3>
                    </div>

                    {/* Toggle View Button */}
                    <button
                      onClick={() => setSoulprintView(soulprintView === 'circular' ? 'bars' : 'circular')}
                      className="px-3 py-1.5 text-xs bg-amber-900/40 hover:bg-amber-800/50 border border-amber-600/30 rounded-lg text-amber-300 transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {soulprintView === 'circular' ? 'Show Bars' : 'Show Circle'}
                    </button>
                  </div>

                  {/* Circular View */}
                  {soulprintView === 'circular' && (
                    <div className="flex justify-center">
                      <svg
                        viewBox="0 0 400 400"
                        className="w-full max-w-md h-auto"
                        style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.3))' }}
                      >
                        {/* Render petals */}
                        {petals.map((petal, index) => {
                          const totalPetals = petals.length;
                          const anglePerPetal = (2 * Math.PI) / totalPetals;
                          const startAngle = index * anglePerPetal - Math.PI / 2;
                          const endAngle = startAngle + anglePerPetal;

                          const centerX = 200;
                          const centerY = 200;
                          const baseInnerRadius = 60;
                          const baseOuterRadius = 160;

                          // Calculate radius based on intensity
                          const outerRadius = baseInnerRadius + (petal.intensity / 10) * (baseOuterRadius - baseInnerRadius);

                          // Calculate wedge path
                          const innerStartX = centerX + baseInnerRadius * Math.cos(startAngle);
                          const innerStartY = centerY + baseInnerRadius * Math.sin(startAngle);
                          const innerEndX = centerX + baseInnerRadius * Math.cos(endAngle);
                          const innerEndY = centerY + baseInnerRadius * Math.sin(endAngle);
                          const outerStartX = centerX + outerRadius * Math.cos(startAngle);
                          const outerStartY = centerY + outerRadius * Math.sin(startAngle);
                          const outerEndX = centerX + outerRadius * Math.cos(endAngle);
                          const outerEndY = centerY + outerRadius * Math.sin(endAngle);

                          const pathData = `
                            M ${innerStartX} ${innerStartY}
                            L ${outerStartX} ${outerStartY}
                            A ${outerRadius} ${outerRadius} 0 0 1 ${outerEndX} ${outerEndY}
                            L ${innerEndX} ${innerEndY}
                            A ${baseInnerRadius} ${baseInnerRadius} 0 0 0 ${innerStartX} ${innerStartY}
                            Z
                          `;

                          const color = petal.color;
                          const opacity = 0.7 + (petal.intensity / 10) * 0.3;

                          return (
                            <g key={petal.id}>
                              <path
                                d={pathData}
                                fill={color}
                                fillOpacity={opacity}
                                stroke={color}
                                strokeWidth="1.5"
                                strokeOpacity={0.8}
                              />
                            </g>
                          );
                        })}

                        {/* Center circle with elemental holoflower */}
                        <circle
                          cx={200}
                          cy={200}
                          r={60}
                          fill="url(#miniPlasmicGradient)"
                          opacity={0.8}
                        />

                        <image
                          href="/elementalHoloflower.png"
                          x={200 - 45}
                          y={200 - 45}
                          width={90}
                          height={90}
                          opacity={0.9}
                        />

                        {/* Gradient definition */}
                        <defs>
                          <radialGradient id="miniPlasmicGradient">
                            <stop offset="0%" stopColor="#FBB03B" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#B45309" stopOpacity={0.2} />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  )}

                  {/* Horizontal Bar Chart View */}
                  {soulprintView === 'bars' && (
                    <div className="space-y-2">
                      {petals.map((petal) => (
                        <div key={petal.id} className="flex items-center gap-3">
                          {/* Petal Label */}
                          <div className="w-24 text-right">
                            <span className="text-amber-200/90 text-sm font-medium">{petal.id}</span>
                          </div>

                          {/* Bar Container */}
                          <div className="flex-1 bg-amber-950/40 rounded-full h-6 overflow-hidden border border-amber-600/20 relative">
                            {/* Filled Bar */}
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${petal.intensity * 10}%`,
                                backgroundColor: petal.color,
                                opacity: 0.8
                              }}
                            />
                          </div>

                          {/* Essence Label */}
                          <div className="w-32 hidden md:block">
                            <span className="text-amber-300/60 text-xs">{petal.essence}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Conversation Messages */}
                <div className="bg-gradient-to-br from-amber-900/20 via-amber-800/10 to-orange-900/20 backdrop-blur-xl border border-amber-600/20 rounded-2xl p-6 max-h-[500px] overflow-y-auto space-y-4">
                  {conversationMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-6 py-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-amber-600/40 to-orange-600/40 border border-amber-500/30 text-amber-100'
                            : 'bg-gradient-to-r from-amber-900/40 to-amber-800/40 border border-amber-700/30 text-amber-200/95'
                        }`}
                      >
                        {msg.role === 'maia' && (
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400 font-semibold text-sm">MAIA</span>
                          </div>
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  {/* MAIA typing indicator */}
                  {isMAIATyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[80%] px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-900/40 to-amber-800/40 border border-amber-700/30">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                          <span className="text-amber-400 font-semibold text-sm">MAIA is thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={conversationInput}
                    onChange={(e) => setConversationInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Share your thoughts, ask questions, explore meanings..."
                    className="flex-1 px-6 py-4 bg-amber-900/20 border border-amber-600/30 rounded-xl text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500/50 focus:bg-amber-900/30 transition-all"
                    disabled={isMAIATyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!conversationInput.trim() || isMAIATyping}
                    className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-amber-900/40 disabled:to-orange-900/40 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
                  >
                    Send
                  </button>
                </div>

                {/* Back to Reading */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => setPhase('reading')}
                    className="text-amber-400/70 hover:text-amber-300 transition-colors text-sm flex items-center gap-2 mx-auto"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Reading
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
