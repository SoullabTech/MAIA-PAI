'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Home, Sparkles } from 'lucide-react'
import { IntentPrompt } from '@/components/reading/IntentPrompt'
import { GuidePanel } from '@/components/reading/GuidePanel'
import { PathToast } from '@/components/reading/PathToast'

interface PathStep {
  section_id: string
  title: string
  why: string
  loc: {
    page_start: number
    page_end: number
  }
  completed?: boolean
  order_index: number
}

interface ReadingPath {
  intent: string
  steps: PathStep[]
  path_id?: string
}

// Sample book content
const BOOK_SECTIONS: Record<string, { title: string; content: string }> = {
  'intro-torus': {
    title: 'The Torus of Change',
    content: `
      <p>There comes a moment when the old patterns dissolve. The comfortable certainties fall away. This isn't collapse - it's transformation.</p>

      <p>The Torus of Change maps this sacred journey through three phases:</p>

      <h3>Phase 1: Dissolution</h3>
      <p>Everything you thought you knew breaks down. This is disorienting by design. The old identity must dissolve before something new can emerge.</p>

      <h3>Phase 2: Reorganization</h3>
      <p>In the liminal space between old and new, unexpected connections form. Creativity emerges. New patterns crystallize.</p>

      <h3>Phase 3: Integration</h3>
      <p>The new patterns stabilize. You emerge transformed - not back to who you were, but into who you're becoming.</p>

      <blockquote>"The wound is the place where the Light enters you." — Rumi</blockquote>
    `,
  },
  'fire-anger': {
    title: 'Fire Element: Anger as Transformative Energy',
    content: `
      <p>Anger gets a bad reputation. We're taught to suppress it, deny it, make it wrong.</p>

      <p><strong>But anger is energy. Pure, creative, transformative energy.</strong></p>

      <p>Fire teaches us that anger isn't the enemy - <em>unconscious</em> anger is. When you learn to channel this energy consciously, it becomes fuel for creation, boundary-setting, and change.</p>

      <h3>The Alchemy of Anger</h3>

      <p>Unprocessed anger becomes:</p>
      <ul>
        <li>Resentment (anger turned inward)</li>
        <li>Passive aggression (anger sideways)</li>
        <li>Numbness (anger frozen)</li>
      </ul>

      <p>Alchemized anger becomes:</p>
      <ul>
        <li>Clear boundaries</li>
        <li>Creative power</li>
        <li>Authentic voice</li>
        <li>Transformative action</li>
      </ul>

      <p>The practice isn't to eliminate anger - it's to <em>work with it consciously</em>.</p>
    `,
  },
  'air-focus': {
    title: 'Air Element: Clarity & the Scattered Mind',
    content: `
      <p>In a world of infinite distraction, attention is the most precious resource.</p>

      <p>Air teaches us that clarity isn't about blocking out all noise - it's about <em>choosing what to amplify</em>.</p>

      <h3>The Default Mode Network</h3>

      <p>Your brain has two primary modes:</p>

      <p><strong>Task Mode:</strong> Focused, directed, goal-oriented</p>
      <p><strong>Default Mode:</strong> Wandering, connecting, integrating</p>

      <p>Most people think focus means staying in task mode constantly. But that's exhausting and unsustainable.</p>

      <p>The secret is learning to <em>move fluidly between modes</em> - focus when needed, wander when appropriate, and know which mode serves you in each moment.</p>
    `,
  },
  'water-shadow': {
    title: 'Water Element: Shadow Integration',
    content: `
      <p>Everything we deny, suppress, or judge becomes Shadow.</p>

      <p>Not because it's evil - but because consciousness requires wholeness.</p>

      <p>Water invites us into the depths, where rejected parts of ourselves wait to be welcomed home.</p>

      <h3>What Lives in Shadow</h3>

      <ul>
        <li>Emotions we were taught were "bad"</li>
        <li>Desires we learned to hide</li>
        <li>Parts of ourselves that weren't acceptable</li>
        <li>Gifts too bright to own</li>
      </ul>

      <p>Yes - even our <em>gifts</em> can be shadow. Sometimes we hide our light as much as our darkness.</p>

      <h3>The Integration Practice</h3>

      <p>Shadow work isn't about fixing yourself. You're not broken.</p>

      <p>It's about <em>retrieval</em> - bringing fragmented parts back into wholeness.</p>
    `,
  },
}

export default function AdaptiveReadingExperience() {
  const [currentPath, setCurrentPath] = useState<ReadingPath | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [currentSection, setCurrentSection] = useState('intro-torus')
  const [isCreatingPath, setIsCreatingPath] = useState(false)

  const handleIntentSelected = async (intent: string) => {
    setIsCreatingPath(true)

    try {
      // Call the API to create a personalized reading path
      const response = await fetch('/api/reading-path/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: 'elemental-alchemy',
          intent,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create path')
      }

      const data = await response.json()

      setCurrentPath({
        intent: data.intent,
        steps: data.steps,
        path_id: data.path_id,
      })

      setShowToast(true)

      // Jump to first section
      if (data.steps.length > 0) {
        setCurrentSection(data.steps[0].section_id)
      }
    } catch (error) {
      console.error('Error creating path:', error)

      // Fallback to local path generation for demo
      const mockPath = generateMockPath(intent)
      setCurrentPath(mockPath)
      setShowToast(true)
      if (mockPath.steps.length > 0) {
        setCurrentSection(mockPath.steps[0].section_id)
      }
    } finally {
      setIsCreatingPath(false)
    }
  }

  const handleStepClick = (sectionId: string) => {
    setCurrentSection(sectionId)

    // Log the opened_section event
    fetch('/api/reader/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId: 'elemental-alchemy',
        sectionId,
        kind: 'opened_section',
      }),
    }).catch(console.error)
  }

  const section = BOOK_SECTIONS[currentSection]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-parchment/10 to-white">
      {/* Header */}
      <header className="border-b border-leather/20 bg-white/80 backdrop-blur px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded transition">
            <Home size={20} className="text-gray-600" />
          </Link>

          <div className="border-l border-gray-300 h-6"></div>

          <div className="flex items-center gap-2">
            <BookOpen className="text-fire" size={24} />
            <div>
              <h1 className="font-heading font-bold text-gray-900">
                Elemental Alchemy
              </h1>
              <p className="text-xs text-gray-500">
                Beta Readers Copy • Adaptive Reading with MAIA
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Book Content */}
        <div className="flex-1 overflow-auto px-12 py-12">
          <div className="max-w-3xl mx-auto">
            {section && (
              <>
                <div className="mb-8">
                  <span className="px-3 py-1 bg-air/10 text-air rounded-full text-xs font-semibold uppercase tracking-wide">
                    Chapter
                  </span>
                </div>

                <h1 className="text-4xl font-heading font-bold text-gray-900 mb-8 leading-tight">
                  {section.title}
                </h1>

                <div
                  className="prose prose-book max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />

                {currentPath && (
                  <div className="mt-12 p-6 bg-gradient-to-br from-air/5 to-water/5 border-2 border-air/20 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <Sparkles className="text-air flex-shrink-0 mt-1" size={20} />
                      <div>
                        <h3 className="font-heading font-bold text-air mb-2">
                          Your {currentPath.intent} Journey
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          This section is part of your personalized path. Notice how the themes
                          connect to what you're experiencing. When you're ready, continue to the
                          next step.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Guide Panel */}
        <div className="w-96 border-l border-leather/20 bg-white p-6 overflow-auto">
          {!currentPath ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-air to-water flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-gray-900">MAIA</h2>
                  <p className="text-xs text-gray-600">Adaptive Reading Guide</p>
                </div>
              </div>

              <IntentPrompt onPick={handleIntentSelected} />

              {isCreatingPath && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-air"></div>
                  <p className="mt-3 text-sm text-gray-600">Creating your personalized path...</p>
                </div>
              )}
            </div>
          ) : (
            <GuidePanel path={currentPath} onStepClick={handleStepClick} />
          )}
        </div>
      </div>

      {/* Path Created Toast */}
      {showToast && currentPath && (
        <PathToast
          intent={currentPath.intent}
          stepCount={currentPath.steps.length}
          onDismiss={() => setShowToast(false)}
        />
      )}
    </div>
  )
}

// Fallback mock path generation for when API isn't available
function generateMockPath(intent: string): ReadingPath {
  const intentToSections: Record<string, string[]> = {
    anger: ['fire-anger', 'intro-torus'],
    focus: ['air-focus', 'intro-torus'],
    transition: ['intro-torus', 'water-shadow'],
    grief: ['water-shadow', 'intro-torus'],
    evidence: ['air-focus', 'fire-anger'],
  }

  const sectionIds = intentToSections[intent] || ['intro-torus']

  const steps: PathStep[] = sectionIds.map((id, i) => ({
    section_id: id,
    title: BOOK_SECTIONS[id]?.title || id,
    why: `This section supports your ${intent} journey`,
    loc: { page_start: i * 20 + 21, page_end: i * 20 + 40 },
    order_index: i,
  }))

  return { intent, steps }
}
