'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Circle, BookOpen, Sparkles } from 'lucide-react'
import { academyCurriculum, getLessonById, getModuleById } from '@/lib/academy-curriculum'
import { useState } from 'react'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.moduleId as string
  const lessonId = params.lessonId as string

  const module = getModuleById(moduleId)
  const lesson = getLessonById(moduleId, lessonId)

  const [reflectionResponses, setReflectionResponses] = useState<string[]>([])
  const [isCompleted, setIsCompleted] = useState(false)

  if (!module || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-800 via-teal-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold text-teal-100 mb-4">Lesson Not Found</h1>
          <Link href="/academy" className="text-teal-400 hover:text-teal-300">
            Return to Academy
          </Link>
        </div>
      </div>
    )
  }

  // Find current lesson index and get prev/next
  const lessonIndex = module.lessons.findIndex(l => l.id === lessonId)
  const prevLesson = lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1] : null

  // Find next module for "next" button at end of module
  const moduleIndex = academyCurriculum.findIndex(m => m.id === moduleId)
  const nextModule = moduleIndex < academyCurriculum.length - 1 ? academyCurriculum[moduleIndex + 1] : null

  const handleMarkComplete = () => {
    setIsCompleted(!isCompleted)
    // TODO: Save to user progress DB
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-teal-900 to-slate-900">
      {/* Header with breadcrumbs */}
      <div className="bg-gradient-to-b from-teal-950/40 to-transparent border-b border-teal-800/30">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-light">Back to Academy</span>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-teal-400/60 mb-2 font-light tracking-wide uppercase">
                {module.title}
              </div>
              <h1 className="text-5xl font-heading font-bold text-teal-100 mb-4 tracking-wide">
                {lesson.title}
              </h1>
              <p className="text-xl text-teal-300/80 font-light leading-relaxed max-w-3xl">
                {lesson.description}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-sm text-teal-400/60">{lesson.duration}</span>
                <button
                  onClick={handleMarkComplete}
                  className="flex items-center gap-2 text-sm text-teal-300 hover:text-teal-200 transition-colors"
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle size={18} className="text-teal-400" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle size={18} />
                      <span>Mark as complete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Video Player */}
        <div className="mb-16">
          {lesson.videoUrl ? (
            <div className="aspect-video bg-gradient-to-br from-teal-950/60 to-slate-900/80 backdrop-blur-sm rounded-none border-l-4 border-teal-600/50 overflow-hidden">
              {/* TODO: Embed video player (Vimeo/YouTube) */}
              <iframe
                src={lesson.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-teal-950/60 to-slate-900/80 backdrop-blur-sm rounded-none border-l-4 border-teal-600/50 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="text-teal-400/60 mx-auto mb-4" size={48} />
                <p className="text-teal-300/70 text-lg font-light">
                  Video lesson coming soon
                </p>
                <p className="text-teal-400/50 text-sm mt-2 font-light">
                  This lesson will be recorded and uploaded shortly
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Transcript (if available) */}
        {lesson.transcript && (
          <div className="mb-16 bg-gradient-to-br from-teal-950/40 to-slate-900/60 backdrop-blur-sm rounded-none p-10 border-l-4 border-teal-700/50">
            <h2 className="text-2xl font-heading font-bold text-teal-100 mb-6 tracking-wide">
              Transcript
            </h2>
            <div className="text-teal-300/70 font-light leading-relaxed whitespace-pre-wrap">
              {lesson.transcript}
            </div>
          </div>
        )}

        {/* Reflection Prompts */}
        {lesson.reflectionPrompts && lesson.reflectionPrompts.length > 0 && (
          <div className="mb-16 bg-gradient-to-br from-teal-950/40 to-slate-900/60 backdrop-blur-sm rounded-none p-10 border-l-4 border-teal-700/50">
            <h2 className="text-2xl font-heading font-bold text-teal-100 mb-6 tracking-wide flex items-center gap-3">
              <Sparkles className="text-teal-400" size={24} />
              Reflection Prompts
            </h2>
            <p className="text-teal-300/70 mb-6 font-light leading-relaxed">
              Take time to journal or contemplate these questions. There are no right answers -
              only your authentic experience.
            </p>
            <div className="space-y-6">
              {lesson.reflectionPrompts.map((prompt, index) => (
                <div key={index} className="bg-teal-950/30 backdrop-blur-sm rounded-none p-6 border-l-2 border-teal-700/30">
                  <p className="text-teal-200 font-light text-lg mb-4 leading-relaxed">
                    {prompt}
                  </p>
                  <textarea
                    placeholder="Your reflections..."
                    value={reflectionResponses[index] || ''}
                    onChange={(e) => {
                      const newResponses = [...reflectionResponses]
                      newResponses[index] = e.target.value
                      setReflectionResponses(newResponses)
                    }}
                    className="w-full bg-slate-900/50 border border-teal-700/30 rounded-none p-4 text-teal-100 font-light placeholder-teal-500/40 focus:outline-none focus:border-teal-600/60 transition-colors min-h-[120px]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practices */}
        {lesson.practices && lesson.practices.length > 0 && (
          <div className="mb-16 bg-gradient-to-br from-teal-950/40 to-slate-900/60 backdrop-blur-sm rounded-none p-10 border-l-4 border-teal-700/50">
            <h2 className="text-2xl font-heading font-bold text-teal-100 mb-6 tracking-wide">
              Practices
            </h2>
            <ul className="space-y-3">
              {lesson.practices.map((practice, index) => (
                <li key={index} className="flex items-start gap-3 text-teal-300/70 font-light leading-relaxed">
                  <CheckCircle className="text-teal-400 mt-1 flex-shrink-0" size={20} />
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Resources */}
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="mb-16 bg-gradient-to-br from-teal-950/40 to-slate-900/60 backdrop-blur-sm rounded-none p-10 border-l-4 border-teal-700/50">
            <h2 className="text-2xl font-heading font-bold text-teal-100 mb-6 tracking-wide flex items-center gap-3">
              <BookOpen className="text-teal-400" size={24} />
              Resources
            </h2>
            <div className="space-y-4">
              {lesson.resources.map((resource, index) => (
                <Link
                  key={index}
                  href={resource.url}
                  className="block bg-teal-950/30 backdrop-blur-sm rounded-none p-6 border-l-2 border-teal-700/30 hover:border-teal-600/60 hover:bg-teal-950/40 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-teal-100 font-semibold mb-1 group-hover:text-teal-50 transition-colors">
                        {resource.title}
                      </h3>
                      <span className="text-xs text-teal-400/50 uppercase tracking-wider">
                        {resource.type}
                      </span>
                    </div>
                    <ArrowRight className="text-teal-400/60 group-hover:text-teal-400 transition-colors" size={20} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-teal-700/30">
          {prevLesson ? (
            <Link
              href={`/academy/${moduleId}/${prevLesson.id}`}
              className="flex items-center gap-2 text-teal-300 hover:text-teal-200 transition-colors group"
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
              <div className="text-left">
                <div className="text-xs text-teal-400/60 uppercase tracking-wider">Previous</div>
                <div className="font-light">{prevLesson.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={`/academy/${moduleId}/${nextLesson.id}`}
              className="flex items-center gap-2 text-teal-300 hover:text-teal-200 transition-colors group"
            >
              <div className="text-right">
                <div className="text-xs text-teal-400/60 uppercase tracking-wider">Next</div>
                <div className="font-light">{nextLesson.title}</div>
              </div>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          ) : nextModule ? (
            <Link
              href={`/academy`}
              className="flex items-center gap-2 text-teal-300 hover:text-teal-200 transition-colors group"
            >
              <div className="text-right">
                <div className="text-xs text-teal-400/60 uppercase tracking-wider">Next Module</div>
                <div className="font-light">{nextModule.title}</div>
              </div>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          ) : (
            <Link
              href="/academy"
              className="flex items-center gap-2 text-teal-300 hover:text-teal-200 transition-colors"
            >
              <span className="font-light">Back to Academy</span>
              <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
