'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import {
  BookOpen,
  Users,
  Sparkles,
  Save,
  Download,
  MessageSquare,
  Settings,
  Home
} from 'lucide-react'
import Link from 'next/link'
import CollaborativeEditor from '@/components/editor/CollaborativeEditor'
import TeamPresence from '@/components/editor/TeamPresence'
import MAIAPanel from '@/components/ai/MAIAPanel'

export default function EditorPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const [showMAIA, setShowMAIA] = useState(true)
  const [showComments, setShowComments] = useState(false)

  // In future, this will fetch from Supabase
  const project = {
    id: projectId,
    title: 'Elemental Alchemy',
    subtitle: 'The Four Gates of Transformation',
    element: 'fire',
  }

  const teamMembers = [
    { id: '1', name: 'You', color: '#a94724', role: 'author' },
    { id: '2', name: 'Sarah Chen', color: '#236586', role: 'editor' },
    { id: '3', name: 'Marcus Webb', color: '#6d7934', role: 'designer' },
  ]

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Toolbar */}
      <header className="border-b border-leather/20 bg-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Back to Projects"
          >
            <Home size={20} className="text-gray-600" />
          </Link>

          <div className="border-l border-gray-300 h-6"></div>

          <div>
            <h1 className="font-heading font-bold text-lg text-gray-900">
              {project.title}
            </h1>
            <p className="text-xs text-gray-500">{project.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Team Presence */}
          <TeamPresence members={teamMembers} />

          <div className="border-l border-gray-300 h-6 mx-2"></div>

          {/* Action Buttons */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`p-2 rounded transition ${showComments ? 'bg-water/10 text-water' : 'hover:bg-gray-100 text-gray-600'}`}
            title="Comments"
          >
            <MessageSquare size={20} />
          </button>

          <button
            onClick={() => setShowMAIA(!showMAIA)}
            className={`p-2 rounded transition ${showMAIA ? 'bg-air/10 text-air' : 'hover:bg-gray-100 text-gray-600'}`}
            title="MAIA AI Assistant"
          >
            <Sparkles size={20} />
          </button>

          <div className="border-l border-gray-300 h-6 mx-2"></div>

          <button
            className="p-2 hover:bg-gray-100 rounded transition text-gray-600"
            title="Save"
          >
            <Save size={20} />
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded transition text-gray-600"
            title="Export"
          >
            <Download size={20} />
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded transition text-gray-600"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor */}
        <div className={`flex-1 overflow-auto transition-all ${showMAIA ? 'mr-96' : ''}`}>
          <CollaborativeEditor
            projectId={projectId}
            element={project.element as 'fire' | 'air' | 'water' | 'earth'}
          />
        </div>

        {/* MAIA Side Panel */}
        {showMAIA && (
          <div className="w-96 border-l border-leather/20 bg-gradient-to-br from-air/5 to-white overflow-auto">
            <MAIAPanel projectId={projectId} />
          </div>
        )}
      </div>
    </div>
  )
}
