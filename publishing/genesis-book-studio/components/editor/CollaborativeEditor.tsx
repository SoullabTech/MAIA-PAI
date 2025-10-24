'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import EditorToolbar from './EditorToolbar'

interface CollaborativeEditorProps {
  projectId: string
  element: 'fire' | 'air' | 'water' | 'earth'
}

export default function CollaborativeEditor({ projectId, element }: CollaborativeEditorProps) {
  const [ydoc] = useState(() => new Y.Doc())
  const [provider, setProvider] = useState<any>(null)
  const [isLoadingManuscript, setIsLoadingManuscript] = useState(false)
  const [manuscriptStats, setManuscriptStats] = useState<any>(null)

  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration warning
    extensions: [
      StarterKit.configure({
        history: false, // Yjs handles history
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      // CollaborationCursor will be added when WebSocket provider is set up
      // For now, we edit locally with Yjs document
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-water hover:text-water-dark underline cursor-pointer',
        },
      }),
      TextStyle,
      Color,
    ],
    content: `
      <h1>Elemental Alchemy</h1>
      <h2>The Four Gates of Transformation</h2>

      <p>Welcome to your book manuscript. This is a collaborative space where you can write, edit, and refine your work with your team and AI assistants.</p>

      <h3>Chapter 1: The Journey Begins</h3>

      <p>There comes a moment in every seeker's journey when the old maps no longer serve. The comfortable certainties dissolve. The well-worn paths lead nowhere.</p>

      <p>This is not a crisis. This is an invitation.</p>

      <p>You are standing at the threshold of transformation—a sacred crossing point the ancients knew well. They called it by many names: the hero's journey, the dark night of the soul, the alchemical dissolution. We call it <em>awakening</em>.</p>

      <blockquote>
        <p>"The wound is the place where the Light enters you." — Rumi</p>
      </blockquote>

      <p>In this book, you will learn to work with four fundamental forces—Fire, Water, Earth, and Air—not as mere metaphors, but as living intelligences that shape consciousness itself.</p>

      <h3>The Four Elements as Gates</h3>

      <p>Each element represents both a challenge and a gift:</p>

      <ul>
        <li><strong>Fire</strong> — Vision, transformation, the creative spark</li>
        <li><strong>Water</strong> — Flow, emotion, intuitive wisdom</li>
        <li><strong>Earth</strong> — Grounding, structure, manifestation</li>
        <li><strong>Air</strong> — Clarity, communication, mental freedom</li>
      </ul>

      <p>Together, they form a complete system of transformation. A map for navigating the territory of awakening.</p>

      <p><em>Start typing to continue your manuscript...</em></p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-book max-w-[650px] mx-auto px-8 py-12 focus:outline-none min-h-screen',
      },
    },
  })

  // Load manuscript if this is the elemental-alchemy project
  useEffect(() => {
    if (projectId === 'elemental-alchemy' && editor) {
      loadManuscript()
    }
  }, [projectId, editor])

  const loadManuscript = async () => {
    setIsLoadingManuscript(true)
    try {
      const response = await fetch('/api/manuscript')
      const result = await response.json()

      if (result.success) {
        editor?.commands.setContent(result.data.html)
        setManuscriptStats(result.data.metadata)
        console.log('📖 Manuscript loaded:', {
          words: result.data.metadata.wordCount.toLocaleString(),
          images: result.data.metadata.imageCount,
        })
      } else {
        console.error('Failed to load manuscript:', result.error)
      }
    } catch (error) {
      console.error('Error loading manuscript:', error)
    } finally {
      setIsLoadingManuscript(false)
    }
  }

  // In future, connect to WebSocket provider for real-time collaboration
  useEffect(() => {
    // This is where we would connect to y-websocket or similar
    // For now, it works locally with the Yjs document

    return () => {
      provider?.destroy()
      ydoc.destroy()
    }
  }, [projectId])

  const getElementColor = () => {
    const colors = {
      fire: 'border-fire',
      air: 'border-air',
      earth: 'border-earth',
      water: 'border-water',
    }
    return colors[element] || 'border-gray-300'
  }

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className={`border-b ${getElementColor()} bg-white sticky top-0 z-10`}>
        <EditorToolbar editor={editor} />

        {/* Manuscript Stats */}
        {isLoadingManuscript && (
          <div className="px-4 py-2 bg-air/10 text-air text-sm border-t border-air/20">
            Loading manuscript...
          </div>
        )}

        {manuscriptStats && (
          <div className="px-4 py-2 bg-fire/5 text-gray-600 text-xs border-t border-fire/10 flex gap-4">
            <span>
              📝 {manuscriptStats.wordCount.toLocaleString()} words
            </span>
            <span>
              🖼️ {manuscriptStats.imageCount} images
            </span>
            <span className="text-fire font-semibold">
              ✨ Elemental Alchemy manuscript loaded
            </span>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto bg-parchment/5">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
