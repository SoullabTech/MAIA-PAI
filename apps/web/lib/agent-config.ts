// frontend

export type AgentConfig = {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  avatarEmoji?: string;
  tone?: 'oracle' | 'coach' | 'therapist' | 'mentor';
};

export const DEFAULT_AGENTS: AgentConfig[] = [
  {
    id: 'maia-oracle',
    name: 'MAIA Oracle',
    description: 'Primary Spiralogic Oracle presence.',
    isDefault: true,
    avatarEmoji: '🌀',
    tone: 'oracle',
  },
];

/**
 * Placeholder persistence – logs only for now.
 * Later we can wire this into Supabase/settings.
 */
export async function saveAgentConfig(config: AgentConfig | AgentConfig[]): Promise<void> {
  const list = Array.isArray(config) ? config : [config];
  console.log('⚙️ [agent-config] saveAgentConfig called with:', list);
}