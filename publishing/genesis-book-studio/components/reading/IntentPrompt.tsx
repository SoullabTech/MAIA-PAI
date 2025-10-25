'use client'

const chips = [
  { k: 'vision', label: 'Vision/Creative Call', element: 'Fire', icon: '🔥', description: 'Feeling called to create, seeking inspiration, creative urgency' },
  { k: 'emotion', label: 'Emotional Depth', element: 'Water', icon: '💧', description: 'Processing feelings, grief, longing, soul work' },
  { k: 'grounding', label: 'Need Grounding', element: 'Earth', icon: '🌍', description: 'Seeking embodiment, practical steps, stability' },
  { k: 'clarity', label: 'Mental Clarity', element: 'Air', icon: '💨', description: 'Understanding, articulation, perspective' },
  { k: 'integration', label: 'Integration', element: 'Aether', icon: '🌀', description: 'Weaving it all together, paradox, wholeness' },
  { k: 'intensity', label: 'Intense Emotion', element: 'Fire/Water', icon: '🔥💧', description: 'Anger, rage, grief, overwhelm - need alchemical support' },
]

interface IntentPromptProps {
  onPick: (intent: string) => void
}

export function IntentPrompt({ onPick }: IntentPromptProps) {
  return (
    <div className="rounded-2xl border-2 border-air/30 bg-gradient-to-br from-air/5 to-white p-6">
      <div className="mb-4 font-heading font-bold text-lg text-gray-900">
        What's present for you right now?
      </div>
      <p className="text-sm text-gray-600 mb-4">
        MAIA will create a personalized reading path based on your current state
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.k}
            onClick={() => onPick(c.k)}
            className="group flex items-center gap-2 rounded-full px-4 py-2 border-2 border-gray-300 hover:border-air hover:bg-air/10 transition font-semibold text-sm relative"
            title={c.description}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
            <span className="text-xs text-gray-500">({c.element})</span>
          </button>
        ))}
      </div>
    </div>
  )
}
