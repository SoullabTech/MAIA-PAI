/**
 * VoiceCommandDetector - Detects voice commands for mode switching
 * Handles voice-based navigation between different conversation modes
 */

export interface VoiceCommandResult {
  detected: boolean;
  mode: string | null;
  confidence: number;
}

// Define available conversation modes
const CONVERSATION_MODES = {
  oracle: ['oracle', 'oracle mode', 'switch to oracle', 'oracle conversation'],
  reflection: ['reflection', 'reflection mode', 'reflect', 'reflective mode'],
  guidance: ['guidance', 'guidance mode', 'guide me', 'guidance conversation'],
  chat: ['chat', 'chat mode', 'casual chat', 'normal chat'],
  meditation: ['meditation', 'meditation mode', 'meditate', 'mindfulness'],
  journaling: ['journal', 'journaling', 'journal mode', 'write'],
} as const;

// Mode confirmation messages
const MODE_CONFIRMATIONS = {
  oracle: "Switching to Oracle mode. I'm here as your mystical guide, ready to explore the depths of your questions with sacred wisdom.",
  reflection: "Entering Reflection mode. Let's explore your inner landscape together with gentle curiosity.",
  guidance: "Guidance mode activated. I'm here to support you with practical wisdom and direction.",
  chat: "Chat mode ready. Let's have a natural conversation about whatever's on your mind.",
  meditation: "Meditation mode engaged. Let's find stillness and presence together.",
  journaling: "Journaling mode active. Ready to help you capture and explore your thoughts.",
} as const;

/**
 * Detects voice commands for mode switching in the given transcript
 */
export function detectVoiceCommand(transcript: string): VoiceCommandResult {
  if (!transcript || transcript.trim().length === 0) {
    return { detected: false, mode: null, confidence: 0 };
  }

  const normalizedText = transcript.toLowerCase().trim();

  // Check for mode switching patterns
  for (const [mode, patterns] of Object.entries(CONVERSATION_MODES)) {
    for (const pattern of patterns) {
      // Exact match
      if (normalizedText === pattern) {
        return { detected: true, mode, confidence: 1.0 };
      }

      // Contains pattern with word boundaries
      const regex = new RegExp(`\\b${pattern.replace(/\s+/g, '\\s+')}\\b`, 'i');
      if (regex.test(normalizedText)) {
        return { detected: true, mode, confidence: 0.8 };
      }

      // Partial match for shorter commands
      if (pattern.length > 3 && normalizedText.includes(pattern)) {
        return { detected: true, mode, confidence: 0.6 };
      }
    }
  }

  return { detected: false, mode: null, confidence: 0 };
}

/**
 * Checks if the transcript contains only a mode switch command (no other content)
 */
export function isOnlyModeSwitch(transcript: string): boolean {
  if (!transcript || transcript.trim().length === 0) {
    return false;
  }

  const commandResult = detectVoiceCommand(transcript);
  if (!commandResult.detected) {
    return false;
  }

  const normalizedText = transcript.toLowerCase().trim();

  // Check if the transcript is primarily just the mode command
  for (const patterns of Object.values(CONVERSATION_MODES)) {
    for (const pattern of patterns) {
      // Remove the command pattern and see what's left
      const withoutCommand = normalizedText.replace(new RegExp(pattern.replace(/\s+/g, '\\s+'), 'gi'), '').trim();

      // If very little remains (just filler words, punctuation, etc), it's likely just a mode switch
      const remainingWords = withoutCommand
        .replace(/[.,!?;]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 0 && !['please', 'now', 'let', 'me', 'go', 'to', 'the', 'a', 'an'].includes(word));

      if (remainingWords.length <= 1) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Gets a confirmation message for the specified mode
 */
export function getModeConfirmation(mode: string): string {
  const confirmations = MODE_CONFIRMATIONS as Record<string, string>;
  return confirmations[mode] || `Switching to ${mode} mode.`;
}

/**
 * Gets all available conversation modes
 */
export function getAvailableModes(): string[] {
  return Object.keys(CONVERSATION_MODES);
}

/**
 * Gets all command patterns for a specific mode
 */
export function getModePatterns(mode: string): string[] {
  const modes = CONVERSATION_MODES as Record<string, string[]>;
  return modes[mode] || [];
}

/**
 * Analyzes confidence level for voice command detection
 */
export function analyzeCommandConfidence(transcript: string): {
  transcript: string;
  normalizedText: string;
  possibleCommands: Array<{mode: string; pattern: string; confidence: number}>;
} {
  const normalizedText = transcript.toLowerCase().trim();
  const possibleCommands: Array<{mode: string; pattern: string; confidence: number}> = [];

  for (const [mode, patterns] of Object.entries(CONVERSATION_MODES)) {
    for (const pattern of patterns) {
      let confidence = 0;

      if (normalizedText === pattern) {
        confidence = 1.0;
      } else if (new RegExp(`\\b${pattern.replace(/\s+/g, '\\s+')}\\b`, 'i').test(normalizedText)) {
        confidence = 0.8;
      } else if (normalizedText.includes(pattern)) {
        confidence = 0.6;
      }

      if (confidence > 0) {
        possibleCommands.push({ mode, pattern, confidence });
      }
    }
  }

  // Sort by confidence
  possibleCommands.sort((a, b) => b.confidence - a.confidence);

  return {
    transcript,
    normalizedText,
    possibleCommands
  };
}