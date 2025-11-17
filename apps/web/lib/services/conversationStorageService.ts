// Conversation Storage Service - Minimal implementation for Golden MAIA
export interface Message {
  id: string;
  text: string;
  from: 'user' | 'maia';
  timestamp: Date;
  sessionId?: string;
}

export async function saveMessages(messages: Message[], sessionId: string) {
  console.log('💾 Saving messages for session:', sessionId, messages.length);
  // TODO: Implement Supabase storage
  return true;
}

export async function getMessagesBySession(sessionId: string): Promise<Message[]> {
  console.log('📖 Getting messages for session:', sessionId);
  // TODO: Implement Supabase retrieval
  return [];
}