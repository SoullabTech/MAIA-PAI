'use client'

import { CheckCircle, Circle } from 'lucide-react'

interface PathStep {
  section_id: string
  title: string
  why: string
  loc: {
    page_start: number
    page_end: number
  }
  completed?: boolean
}

interface GuidePanelProps {
  path: {
    intent: string
    steps: PathStep[]
  } | null
  onStepClick?: (stepId: string) => void
}

export function GuidePanel({ path, onStepClick }: GuidePanelProps) {
  if (!path) {
    return (
      <div className="sticky top-6 rounded-2xl border-2 border-leather/20 bg-gradient-to-br from-parchment/20 to-white p-6">
        <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
          Your Reading Path
        </h3>
        <p className="text-sm text-gray-600">
          Tell MAIA what you're facing and I'll create a personalized path through the book
        </p>
      </div>
    )
  }

  const completedCount = path.steps.filter((s) => s.completed).length
  const totalSteps = path.steps.length
  const progress = (completedCount / totalSteps) * 100

  return (
    <aside className="sticky top-6 space-y-4">
      <div className="rounded-2xl border-2 border-air/30 bg-gradient-to-br from-air/5 to-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-lg text-gray-900">
            Your Path: {path.intent}
          </h3>
          <span className="text-xs font-semibold text-air">
            {completedCount}/{totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-air to-water transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <ol className="space-y-3">
          {path.steps.map((step, i) => (
            <li key={step.section_id}>
              <button
                onClick={() => onStepClick?.(step.section_id)}
                className="w-full text-left rounded-xl border-2 border-gray-200 hover:border-air hover:shadow-md transition p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {step.completed ? (
                      <CheckCircle className="text-air" size={20} />
                    ) : (
                      <Circle className="text-gray-400" size={20} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-500">
                        Step {i + 1}
                      </span>
                      <span className="text-xs text-gray-400">
                        p. {step.loc.page_start}–{step.loc.page_end}
                      </span>
                    </div>

                    <div className="font-semibold text-sm text-gray-900 mb-1">
                      {step.title}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {step.why}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  )
}
