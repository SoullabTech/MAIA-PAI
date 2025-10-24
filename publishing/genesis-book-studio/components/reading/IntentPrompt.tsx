'use client'

const chips = [
  { k: 'anger', label: 'Anger', element: 'Fire', icon: '🔥' },
  { k: 'focus', label: 'Focus', element: 'Air', icon: '💨' },
  { k: 'transition', label: 'Transition', element: 'Aether', icon: '🌀' },
  { k: 'grief', label: 'Grief', element: 'Water', icon: '💧' },
  { k: 'evidence', label: 'Evidence', element: 'Air/Earth', icon: '🧠' },
]

interface IntentPromptProps {
  onPick: (intent: string) => void
}

export function IntentPrompt({ onPick }: IntentPromptProps) {
  return (
    <div className="rounded-2xl border-2 border-air/30 bg-gradient-to-br from-air/5 to-white p-6">
      <div className="mb-4 font-heading font-bold text-lg text-gray-900">
        What are you facing right now?
      </div>
      <p className="text-sm text-gray-600 mb-4">
        MAIA will create a personalized reading path based on your current need
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.k}
            onClick={() => onPick(c.k)}
            className="flex items-center gap-2 rounded-full px-4 py-2 border-2 border-gray-300 hover:border-air hover:bg-air/10 transition font-semibold text-sm"
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
