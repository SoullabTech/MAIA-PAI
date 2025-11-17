// frontend

export type ConversationStyle = 'gentle' | 'direct' | 'playful' | 'clinical';

export type ConversationStylePreference = {
  style: ConversationStyle;
  allowInterruptions?: boolean;
  maxTurnsPerReply?: number;
};

// Value export so the bundler can import it at runtime
export const ConversationStylePreference: ConversationStylePreference = {
  style: 'gentle',
  allowInterruptions: false,
  maxTurnsPerReply: 4,
};

export const DEFAULT_CONVERSATION_STYLE: ConversationStylePreference = {
  style: 'gentle',
  allowInterruptions: false,
  maxTurnsPerReply: 4,
};

export function getDefaultConversationStyle(): ConversationStylePreference {
  return DEFAULT_CONVERSATION_STYLE;
}