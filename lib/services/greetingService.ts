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
    // Handle cases where userName might not be provided
    const hasName = userName && userName !== 'friend' && userName.trim() !== '';

    const simpleGreetings = hasName ? [
      `Hi ${userName}. I'm here to listen and reflect back what I notice. How are you today?`,
      `Hello ${userName}. Think of me as a thinking partner - I'm here to help you see your own patterns more clearly. What's on your mind?`,
      `Hey ${userName}. I'm curious about your experience. Tell me what's present for you right now.`
    ] : [
      `Hi Explorer. I'm here to listen and reflect back what I notice. How are you today?`,
      `Hello. Think of me as a thinking partner - I'm here to help you see your own patterns more clearly. What's on your mind?`,
      `Hey there. I'm curious about your experience. Tell me what's present for you right now.`
    ];

    return simpleGreetings[Math.floor(Math.random() * simpleGreetings.length)];
  }

  private static getGreetingPool(context: GreetingContext): string[] {
    const { userName, timeOfDay, daysSinceLastVisit, contentLevel = 'companion' } = context;

    // Check if we have a valid user name
    const hasName = userName && userName !== 'friend' && userName.trim() !== '';
    const name = hasName ? userName : '';

    // Greeting pools adapt to user's readiness level
    // Companion: Simple, human, present-focused
    // Lab_collaborator: Full depth, lab language
    const companionPools = {
      morning: hasName ? [
        `Morning, ${name}! Ready for whatever today brings?`,
        `Good morning, ${name}. Hope you slept well.`,
        `${name}, hi there! New day, fresh possibilities.`,
        `Morning, ${name}. What's stirring in you today?`,
        `Hey ${name}. I love morning energy - how's yours?`
      ] : [
        `Morning! Ready for whatever today brings?`,
        `Good morning. Hope you slept well.`,
        `Hi there! New day, fresh possibilities.`,
        `Morning. What's stirring in you today?`,
        `Hey. I love morning energy - how's yours?`
      ],
      afternoon: hasName ? [
        `Welcome back, ${name}! Good to see you again.`,
        `${name}, hey! Hope your day's been kind to you.`,
        `Hi ${name}. The afternoon light feels good, doesn't it?`,
        `Hey ${name}. What's been the highlight so far?`,
        `Afternoon, ${name}. Love this time of day - how about you?`
      ] : [
        `Welcome back! Good to see you again.`,
        `Hey! Hope your day's been kind to you.`,
        `Hi. The afternoon light feels good, doesn't it?`,
        `Hey. What's been the highlight so far?`,
        `Afternoon. Love this time of day - how about you?`
      ],
      evening: hasName ? [
        `Evening, ${name}. There's something magical about this time.`,
        `Long day, ${name}? Time to breathe and settle.`,
        `${name}, the day's winding down beautifully.`,
        `Evening, ${name}. I love how the world softens now.`,
        `Evening, ${name}. What's your heart telling you tonight?`
      ] : [
        `Evening. There's something magical about this time.`,
        `Long day? Time to breathe and settle.`,
        `The day's winding down beautifully.`,
        `Evening. I love how the world softens now.`,
        `Evening. What's your heart telling you tonight?`
      ],
      night: hasName ? [
        `Late night, ${name}. The quiet hours have their own wisdom.`,
        `Can't sleep, ${name}? Sometimes the night calls us to listen.`,
        `The deep hours, ${name}. There's beauty in this stillness.`,
        `${name}, night thoughts can be the most honest ones.`,
        `Night watch, ${name}. What's your soul whispering?`
      ] : [
        `Late night. The quiet hours have their own wisdom.`,
        `Can't sleep? Sometimes the night calls us to listen.`,
        `The deep hours. There's beauty in this stillness.`,
        `Night thoughts can be the most honest ones.`,
        `Night watch. What's your soul whispering?`
      ]
    };

    const labPools = {
      morning: hasName ? [
        `Morning, ${name}. What are we exploring today?`,
        `Good morning, ${name}. Ready to experiment?`,
        `${name}, welcome back to the lab.`,
        `Early today, ${name}. What's on your mind?`,
        `Hey ${name}. Fresh data today?`,
        `Morning, ${name}. What's emerging?`
      ] : [
        `Morning. What are we exploring today?`,
        `Good morning. Ready to experiment?`,
        `Welcome back to the lab.`,
        `Early today. What's on your mind?`,
        `Hey. Fresh data today?`,
        `Morning. What's emerging?`
      ],
      afternoon: hasName ? [
        `Welcome back, ${name}.`,
        `${name}, good to see you.`,
        `Back to the work, ${name}.`,
        `Hey ${name}. Where should we dive in?`,
        `${name}, continuing the experiment?`,
        `Afternoon, ${name}. How's it going?`
      ] : [
        `Welcome back.`,
        `Good to see you.`,
        `Back to the work.`,
        `Hey. Where should we dive in?`,
        `Continuing the experiment?`,
        `Afternoon. How's it going?`
      ],
      evening: hasName ? [
        `Evening, ${name}.`,
        `Long day, ${name}?`,
        `${name}, how are you doing?`,
        `Evening, ${name}. What emerged today?`,
        `Evening, ${name}. Time to process?`,
        `Hey ${name}. What did today reveal?`
      ] : [
        `Evening.`,
        `Long day?`,
        `How are you doing?`,
        `Evening. What emerged today?`,
        `Evening. Time to process?`,
        `Hey. What did today reveal?`
      ],
      night: hasName ? [
        `Late night in the lab, ${name}.`,
        `Can't sleep, ${name}?`,
        `The deep hours, ${name}. I'm here.`,
        `${name}, what's keeping you awake?`,
        `Night watch, ${name}. What's stirring?`,
        `Late experiment, ${name}?`
      ] : [
        `Late night in the lab.`,
        `Can't sleep?`,
        `The deep hours. I'm here.`,
        `What's keeping you awake?`,
        `Night watch. What's stirring?`,
        `Late experiment?`
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

    // Check if we have a valid user name
    const hasName = userName && userName !== 'friend' && userName.trim() !== '';

    if (daysSinceLastVisit > 7) {
      greetings.push(
        hasName ? `Been a while, ${userName}. What's shifted?` : `Been a while. What's shifted?`,
        hasName ? `${userName}, welcome back. What's been transforming?` : `Welcome back. What's been transforming?`,
        hasName ? `Long time, ${userName}. Let's catch up on the data.` : `Long time. Let's catch up on the data.`
      );
    }

    if (daysSinceLastVisit <= 1 && hasHadBreakthrough) {
      greetings.push(
        hasName ? `${userName}, still integrating that last discovery?` : `Still integrating that last discovery?`,
        hasName ? `Back so soon, ${userName}. That breakthrough still working through you?` : `Back so soon. That breakthrough still working through you?`,
        hasName ? `${userName}, how's that insight landing?` : `How's that insight landing?`
      );
    }

    if (lastConversationTheme) {
      greetings.push(
        hasName ? `${userName}, still working with ${lastConversationTheme}?` : `Still working with ${lastConversationTheme}?`,
        hasName ? `Back to ${lastConversationTheme}, ${userName}?` : `Back to ${lastConversationTheme}?`
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