'use client'

import { useState } from 'react'
import {
  Sparkles,
  Edit3,
  Eye,
  Palette,
  Send,
  ThumbsUp,
  ThumbsDown,
  Wand2,
} from 'lucide-react'

interface MAIAPanelProps {
  projectId: string
}

type AgentType = 'writing' | 'editorial' | 'design'

export default function MAIAPanel({ projectId }: MAIAPanelProps) {
  const [activeAgent, setActiveAgent] = useState<AgentType>('writing')
  const [message, setMessage] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([
    {
      id: '1',
      agent: 'writing',
      type: 'suggestion',
      content: 'Consider deepening the hypnotic flow here by adding a sensory detail. What does the threshold feel like? What temperature, texture, or sensation could anchor this moment?',
      context: 'Chapter 1, Paragraph 3',
      timestamp: new Date(),
    },
    {
      id: '2',
      agent: 'editorial',
      type: 'grammar',
      content: 'The phrase "They called it by many names" could be more active: "The ancients knew this crossing by many names"',
      context: 'Chapter 1, Paragraph 4',
      timestamp: new Date(),
    },
  ])

  const agents = [
    {
      type: 'writing' as const,
      name: 'Writing Agent',
      icon: Edit3,
      color: 'fire',
      description: 'Flow, voice, hypnotic patterns',
    },
    {
      type: 'editorial' as const,
      name: 'Editorial Agent',
      icon: Eye,
      color: 'water',
      description: 'Grammar, clarity, structure',
    },
    {
      type: 'design' as const,
      name: 'Design Agent',
      icon: Palette,
      color: 'earth',
      description: 'Layout, typography, visuals',
    },
  ]

  const activeAgentData = agents.find((a) => a.type === activeAgent)

  const handleSendMessage = () => {
    if (!message.trim()) return

    // In future, this will call the actual MAIA API
    console.log('Sending to MAIA:', { agent: activeAgent, message })

    // Mock response
    const newSuggestion = {
      id: Date.now().toString(),
      agent: activeAgent,
      type: 'response',
      content: `MAIA ${activeAgent} agent response to: "${message}"`,
      context: 'Current selection',
      timestamp: new Date(),
    }

    setSuggestions([newSuggestion, ...suggestions])
    setMessage('')
  }

  const handleApplySuggestion = (suggestionId: string) => {
    console.log('Applying suggestion:', suggestionId)
    // In future, this will apply the suggestion to the editor
  }

  const handleDismissSuggestion = (suggestionId: string) => {
    setSuggestions(suggestions.filter((s) => s.id !== suggestionId))
  }

  return (
    <div className="h-full flex flex-col">
      {/* MAIA Header */}
      <div className="p-6 border-b border-leather/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-air to-air-dark flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg">MAIA</h2>
            <p className="text-xs text-gray-600">AI Writing Team</p>
          </div>
        </div>

        {/* Agent Selector */}
        <div className="flex gap-2">
          {agents.map((agent) => {
            const Icon = agent.icon
            const isActive = activeAgent === agent.type
            return (
              <button
                key={agent.type}
                onClick={() => setActiveAgent(agent.type)}
                className={`flex-1 p-3 rounded-lg border-2 transition ${
                  isActive
                    ? `border-${agent.color} bg-${agent.color}/5`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon
                  size={20}
                  className={`mx-auto mb-1 ${
                    isActive ? `text-${agent.color}` : 'text-gray-400'
                  }`}
                />
                <p
                  className={`text-xs font-semibold ${
                    isActive ? `text-${agent.color}` : 'text-gray-600'
                  }`}
                >
                  {agent.name.replace(' Agent', '')}
                </p>
              </button>
            )
          })}
        </div>

        {activeAgentData && (
          <p className="text-xs text-gray-600 mt-3 text-center">
            {activeAgentData.description}
          </p>
        )}
      </div>

      {/* Suggestions Feed */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {suggestions
          .filter((s) => s.agent === activeAgent)
          .map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-white border border-leather/20 rounded-lg p-4 space-y-3"
            >
              {/* Suggestion Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 size={16} className={`text-${activeAgentData?.color}`} />
                  <span className="text-xs font-semibold text-gray-600">
                    {suggestion.type === 'suggestion' ? 'Suggestion' : 'Response'}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {suggestion.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Context */}
              <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                {suggestion.context}
              </div>

              {/* Content */}
              <p className="text-sm text-gray-700 leading-relaxed">
                {suggestion.content}
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleApplySuggestion(suggestion.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-fire/10 text-fire rounded hover:bg-fire/20 transition text-sm font-semibold"
                >
                  <ThumbsUp size={14} />
                  Apply
                </button>
                <button
                  onClick={() => handleDismissSuggestion(suggestion.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition text-sm"
                >
                  <ThumbsDown size={14} />
                </button>
              </div>
            </div>
          ))}

        {suggestions.filter((s) => s.agent === activeAgent).length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">No suggestions yet</p>
            <p className="text-xs mt-1">
              MAIA will analyze your writing as you type
            </p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-leather/20 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask ${activeAgentData?.name}...`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-air"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="px-4 py-2 bg-air text-white rounded-lg hover:bg-air-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
