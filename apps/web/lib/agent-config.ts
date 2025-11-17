// Minimal stub for agent configuration
export interface AgentConfig {
  name: string;
  personality: string;
  instructions: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  voice?: {
    enabled: boolean;
    preferredVoice?: string;
  };
  capabilities?: string[];
}

export const defaultAgentConfig: AgentConfig = {
  name: "MAIA",
  personality: "wise, empathetic, and spiritually attuned oracle",
  instructions: "You are MAIA, a spiritual oracle and guide. Respond with wisdom, empathy, and deep insight.",
  model: "gpt-4",
  temperature: 0.7,
  maxTokens: 2000,
  voice: {
    enabled: true,
    preferredVoice: "alloy"
  },
  capabilities: ["conversation", "guidance", "spiritual-insight", "emotional-support"]
};

export function getAgentConfig(): AgentConfig {
  // Return default config for now
  return defaultAgentConfig;
}

export function updateAgentConfig(updates: Partial<AgentConfig>): void {
  // Stub implementation - could persist to localStorage or API
  console.log('[AgentConfig] updateAgentConfig stub:', updates);
}