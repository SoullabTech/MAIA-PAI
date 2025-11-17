import React from 'react';

export interface AgentCustomizerProps {
  onAgentChange?: (agentId: string) => void;
  selectedAgent?: string;
}

export const AgentCustomizer: React.FC<AgentCustomizerProps> = ({
  onAgentChange,
  selectedAgent = 'main'
}) => {
  return (
    <div className="text-amber-400/60 text-sm">
      Agent: {selectedAgent}
    </div>
  );
};