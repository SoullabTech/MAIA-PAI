import Link from 'next/link'
import { BookOpen, Plus, Users, Sparkles } from 'lucide-react'

export default function Home() {
  // In future, this will fetch from Supabase
  const projects = [
    {
      id: 'elemental-alchemy',
      title: 'Elemental Alchemy',
      subtitle: 'The Four Gates of Transformation',
      author: 'Soullab',
      element: 'fire',
      status: 'in_progress',
      lastEdited: '2025-01-20',
      teamMembers: 3,
      aiAgents: 3,
    }
  ]

  const getElementColor = (element: string) => {
    const colors = {
      fire: 'bg-fire text-white',
      air: 'bg-air text-white',
      earth: 'bg-earth text-white',
      water: 'bg-water text-white',
    }
    return colors[element as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment/20 to-white">
      {/* Header */}
      <header className="border-b border-leather/20 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900">
                Genesis Book Studio
              </h1>
              <p className="text-leather mt-1">
                Collaborative book creation with AI team support
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-fire text-white rounded-lg hover:bg-fire-dark transition">
              <Plus size={20} />
              New Project
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Projects Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold mb-6">Your Projects</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/editor/${project.id}`}
                className="group block"
              >
                <div className="bg-white border border-leather/20 rounded-lg p-6 hover:shadow-lg transition">
                  {/* Element Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getElementColor(project.element)}`}>
                      {project.element.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(project.lastEdited).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Book Info */}
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 group-hover:text-fire transition">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {project.subtitle}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    by {project.author}
                  </p>

                  {/* Team Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-leather/10">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{project.teamMembers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles size={16} />
                      <span>{project.aiAgents} AI</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} />
                      <span className="capitalize">{project.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Create New Project Card */}
            <button className="bg-white border-2 border-dashed border-leather/30 rounded-lg p-6 hover:border-fire hover:bg-fire/5 transition flex flex-col items-center justify-center min-h-[280px] group">
              <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-fire/10 flex items-center justify-center mb-4 transition">
                <Plus size={32} className="text-gray-400 group-hover:text-fire transition" />
              </div>
              <p className="text-gray-600 font-semibold group-hover:text-fire transition">
                Start New Book Project
              </p>
            </button>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-fire/10 flex items-center justify-center mx-auto mb-4">
              <Users className="text-fire" size={24} />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">Team Collaboration</h3>
            <p className="text-gray-600 text-sm">
              Work together in real-time with your author, editor, and design teams
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-air/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-air" size={24} />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">AI Team Support</h3>
            <p className="text-gray-600 text-sm">
              MAIA agents for writing, editorial, and design assistance
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-water/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-water" size={24} />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">Multi-Format Export</h3>
            <p className="text-gray-600 text-sm">
              Generate EPUB, Print PDF, and Audiobook scripts from one source
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
