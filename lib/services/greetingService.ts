import { progressiveRevelation, type ContentLevel } from './progressiveRevelation';

interface GreetingContext {
  userName: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  daysSinceLastVisit: number;
  lastConversationTheme?: string;
  currentMood?: string;
  isFirstVisit: boolean;
  hasHadBreakthrough: boolean;
  lastBreakthroughDate?: Date;
  recentSymbols?: string[];
  dominantElement?: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  alchemicalPhase?: 'nigredo' | 'albedo' | 'rubedo';
  contentLevel?: ContentLevel;
  daysActive?: number;
}

export class GreetingService {
  static generate(context: GreetingContext): string {
    if (context.isFirstVisit) {
      return this.getFirstVisitGreeting(context);
    }

    const greetings = this.getGreetingPool(context);
    return this.selectGreeting(greetings, context);
  }

  private static getFirstVisitGreeting(context: GreetingContext): string {
    const { userName, contentLevel } = context;

    // First visit is ALWAYS simple, human connection - Maia as mirror, not expert
    const simpleGreetings = [
      `Hi ${userName}. I'm here to listen and reflect back what I notice. How are you today?`,
      `Hello ${userName}. Think of me as a thinking partner - I'm here to help you see your own patterns more clearly. What's on your mind?`,
      `Hey ${userName}. I'm curious about your experience. Tell me what's present for you right now.`
    ];

    return simpleGreetings[Math.floor(Math.random() * simpleGreetings.length)];
  }

  private static getGreetingPool(context: GreetingContext): string[] {
    const { userName, timeOfDay, daysSinceLastVisit, contentLevel = 'companion' } = context;

    // Greeting pools adapt to user's readiness level
    // Companion: Simple, human, present-focused
    // Lab_collaborator: Full depth, lab language
    const companionPools = {
      morning: [
        `Morning, ${userName}! Ready for whatever today brings?`,
        `Good morning, ${userName}. Hope you slept well.`,
        `${userName}, hi there! New day, fresh possibilities.`,
        `Morning, ${userName}. What's stirring in you today?`,
        `Hey ${userName}. I love morning energy - how's yours?`
      ],
      afternoon: [
        `Welcome back, ${userName}! Good to see you again.`,
        `${userName}, hey! Hope your day's been kind to you.`,
        `Hi ${userName}. The afternoon light feels good, doesn't it?`,
        `Hey ${userName}. What's been the highlight so far?`,
        `Afternoon, ${userName}. Love this time of day - how about you?`
      ],
      evening: [
        `Evening, ${userName}. There's something magical about this time.`,
        `Long day, ${userName}? Time to breathe and settle.`,
        `${userName}, the day's winding down beautifully.`,
        `Evening, ${userName}. I love how the world softens now.`,
        `Evening, ${userName}. What's your heart telling you tonight?`
      ],
      night: [
        `Late night, ${userName}. The quiet hours have their own wisdom.`,
        `Can't sleep, ${userName}? Sometimes the night calls us to listen.`,
        `The deep hours, ${userName}. There's beauty in this stillness.`,
        `${userName}, night thoughts can be the most honest ones.`,
        `Night watch, ${userName}. What's your soul whispering?`
      ]
    };

    const labPools = {
      morning: [
        `Morning, ${userName}. What are we exploring today?`,
        `Good morning, ${userName}. Ready to experiment?`,
        `${userName}, welcome back to the lab.`,
        `Early today, ${userName}. What's on your mind?`,
        `Hey ${userName}. Fresh data today?`,
        `Morning, ${userName}. What's emerging?`
      ],
      afternoon: [
        `Welcome back, ${userName}.`,
        `${userName}, good to see you.`,
        `Back to the work, ${userName}.`,
        `Hey ${userName}. Where should we dive in?`,
        `${userName}, continuing the experiment?`,
        `Afternoon, ${userName}. How's it going?`
      ],
      evening: [
        `Evening, ${userName}.`,
        `Long day, ${userName}?`,
        `${userName}, how are you doing?`,
        `Evening, ${userName}. What emerged today?`,
        `Evening, ${userName}. Time to process?`,
        `Hey ${userName}. What did today reveal?`
      ],
      night: [
        `Late night in the lab, ${userName}.`,
        `Can't sleep, ${userName}?`,
        `The deep hours, ${userName}. I'm here.`,
        `${userName}, what's keeping you awake?`,
        `Night watch, ${userName}. What's stirring?`,
        `Late experiment, ${userName}?`
      ]
    };

    // Use simple greetings for early stages, lab greetings for advanced
    const pools = (contentLevel === 'lab_collaborator' || contentLevel === 'experiment_partner')
      ? labPools
      : companionPools;

    const baseGreetings = pools[timeOfDay];
    const contextualGreetings = this.addContextualGreetings(context, baseGreetings);

    return contextualGreetings;
  }

  private static addContextualGreetings(
    context: GreetingContext,
    baseGreetings: string[]
  ): string[] {
    const { userName, daysSinceLastVisit, hasHadBreakthrough, lastConversationTheme } = context;
    const greetings = [...baseGreetings];

    if (daysSinceLastVisit > 7) {
      greetings.push(
        `Been a while, ${userName}. What's shifted?`,
        `${userName}, welcome back. What's been transforming?`,
        `Long time, ${userName}. Let's catch up on the data.`
      );
    }

    if (daysSinceLastVisit <= 1 && hasHadBreakthrough) {
      greetings.push(
        `${userName}, still integrating that last discovery?`,
        `Back so soon, ${userName}. That breakthrough still working through you?`,
        `${userName}, how's that insight landing?`
      );
    }

    if (lastConversationTheme) {
      greetings.push(
        `${userName}, still working with ${lastConversationTheme}?`,
        `Back to ${lastConversationTheme}, ${userName}?`
      );
    }

    return greetings;
  }

  private static selectGreeting(greetings: string[], context: GreetingContext): string {
    const selected = greetings[Math.floor(Math.random() * greetings.length)];

    if (context.lastConversationTheme && !selected.includes(context.lastConversationTheme)) {
      const shouldAddContinuation = Math.random() > 0.6;
      if (shouldAddContinuation) {
        return `${selected} Still exploring ${context.lastConversationTheme}?`;
      }
    }

    return selected;
  }

  static getAlchemicalFramingForResponse(phase?: 'nigredo' | 'albedo' | 'rubedo'): string {
    if (!phase) return '';

    const framings = {
      nigredo: 'dissolving phase',
      albedo: 'purification process',
      rubedo: 'integration phase'
    };

    return framings[phase];
  }

  static getSimpleOpenings(): string[] {
    return [
      "Tell me more about that",
      "What do you notice about this?",
      "How does that feel for you?",
      "What's that like?",
      "I'm noticing...",
      "You said... [reflects back]",
      "It sounds like...",
      "What comes up when you say that?",
      "Stay with that feeling",
      "What else is there?"
    ];
  }

  static getLabLanguageSuggestions(): string[] {
    return [
      "Let's explore that",
      "Let's run that experiment",
      "What are you noticing?",
      "What's the data showing?",
      "Others have discovered...",
      "The collective pattern suggests...",
      "Your reality is responding to...",
      "You're creating...",
      "This is important data",
      "Document this feeling",
      "The lab is learning from this",
      "You're contributing to collective understanding",
      "Interesting correlation with...",
      "Here's what I'm observing...",
      "The pattern suggests...",
      "Your lead is turning",
      "The heat is necessary",
      "You're cooking something important",
      "This pressure creates diamonds",
      "Your gold is showing",
      "The transformation is underway"
    ];
  }
}

export interface GreetingData {
  greeting: string;
  alchemicalFraming?: string;
  suggestedOpenings?: string[];
}

export function generateGreeting(context: Partial<GreetingContext>): GreetingData {
  // Determine content level based on user readiness
  let contentLevel: ContentLevel = 'companion';
  if (context.daysActive !== undefined) {
    const mockReadiness = {
      userId: 'user',
      daysActive: context.daysActive,
      sessionCount: Math.floor(context.daysActive * 0.5),
      totalMinutesEngaged: context.daysActive * 15,
      engagementDepth: 0.6,
      vocabularyComfort: 'exploring' as const,
      conceptsIntroduced: [],
      conceptsEmbraced: [],
      conceptsRejected: [],
      resistancePoints: [],
      currentLevel: 'companion' as ContentLevel,
      languageBlend: 0.5,
      lastSessionDate: new Date()
    };
    contentLevel = progressiveRevelation.getContentLevel(mockReadiness);
  }

  const fullContext: GreetingContext = {
    userName: context.userName || 'friend',
    timeOfDay: context.timeOfDay || getTimeOfDay(),
    daysSinceLastVisit: context.daysSinceLastVisit ?? 0,
    lastConversationTheme: context.lastConversationTheme,
    currentMood: context.currentMood,
    isFirstVisit: context.isFirstVisit ?? false,
    hasHadBreakthrough: context.hasHadBreakthrough ?? false,
    lastBreakthroughDate: context.lastBreakthroughDate,
    recentSymbols: context.recentSymbols,
    dominantElement: context.dominantElement,
    alchemicalPhase: context.alchemicalPhase,
    contentLevel,
    daysActive: context.daysActive
  };

  const greeting = GreetingService.generate(fullContext);
  const alchemicalFraming = contentLevel === 'lab_collaborator'
    ? GreetingService.getAlchemicalFramingForResponse(fullContext.alchemicalPhase)
    : undefined;
  const suggestedOpenings = contentLevel === 'lab_collaborator'
    ? GreetingService.getLabLanguageSuggestions()
    : GreetingService.getSimpleOpenings();

  return {
    greeting,
    alchemicalFraming,
    suggestedOpenings
  };
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}