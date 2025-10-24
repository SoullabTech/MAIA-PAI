'use client'

import { CheckCircle, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PathToastProps {
  intent: string
  stepCount: number
  onDismiss: () => void
}

export function PathToast({ intent, stepCount, onDismiss }: PathToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Fade in
    setTimeout(() => setVisible(true), 100)

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        max-w-md bg-white border-2 border-air shadow-2xl rounded-2xl p-6
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(onDismiss, 300)
        }}
        className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded transition"
      >
        <X size={16} className="text-gray-400" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-air to-water flex items-center justify-center flex-shrink-0">
          <Sparkles className="text-white" size={20} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-air" size={18} />
            <h3 className="font-heading font-bold text-gray-900">
              Path Created
            </h3>
          </div>

          <p className="text-sm text-gray-700 mb-3">
            I've created a personalized {stepCount}-step path for your{' '}
            <span className="font-semibold capitalize">{intent}</span> journey.
          </p>

          <p className="text-xs text-gray-600">
            Each section is chosen based on what will serve you most right now.
            As you complete practices, I'll learn what resonates with you.
          </p>
        </div>
      </div>
    </div>
  )
}
