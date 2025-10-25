'use client'

import Link from 'next/link'
import { BookOpen, PlayCircle, CheckCircle, Circle } from 'lucide-react'
import { academyCurriculum, getTotalLessons } from '@/lib/academy-curriculum'

export default function AcademyPage() {
  // TODO: Get from user progress DB
  const completedLessonIds: string[] = []

  const totalLessons = getTotalLessons()
  const completedCount = completedLessonIds.length
  const progressPercent = Math.round((completedCount / totalLessons) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-teal-900 to-slate-900">
      {/* Hero Section - Austere */}
      <div className="bg-gradient-to-b from-teal-950/40 to-transparent border-b border-teal-800/30">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-3 mb-6 opacity-60">
            <BookOpen className="text-teal-400" size={32} />
          </div>
          <h1 className="text-6xl font-heading font-bold text-teal-100 mb-6 tracking-wide">
            Soullab Academy
          </h1>
          <p className="text-2xl text-teal-300/80 italic font-light max-w-3xl mx-auto leading-relaxed">
            The living transmission of Soullab&apos;s vision, lesson by lesson
          </p>
          <p className="text-lg text-teal-400/60 mt-6 font-light max-w-2xl mx-auto">
            Deep-dive video lessons, reflective practices, and the full gestalt of working with
            MAIA, elemental alchemy, and relational intelligence.
          </p>

          {/* Progress Bar */}
          {completedCount > 0 && (
            <div className="mt-12 max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-teal-300/70 mb-2">
                <span>Your Progress</span>
                <span>{completedCount} / {totalLessons} lessons</span>
              </div>
              <div className="w-full bg-teal-950/50 rounded-none h-2 border-l-2 border-teal-700/30">
                <div
                  className="bg-gradient-to-r from-teal-500 to-teal-400 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Curriculum Modules */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="space-y-8">
          {academyCurriculum.map((module, index) => {
            const moduleCompleted = module.lessons.filter(l =>
              completedLessonIds.includes(l.id)
            ).length
            const moduleProgress = Math.round((moduleCompleted / module.lessons.length) * 100)
            const isStarted = moduleCompleted > 0
            const isComplete = moduleCompleted === module.lessons.length

            return (
              <div
                key={module.id}
                className="bg-gradient-to-br from-teal-950/40 to-slate-900/60 backdrop-blur-sm rounded-none p-8 border-l-4 border-teal-700/40 hover:border-teal-600/60 transition-all"
              >
                {/* Module Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl opacity-70">{module.icon}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-heading font-bold text-teal-100 tracking-wide">
                          {module.title}
                        </h2>
                        {isComplete && (
                          <CheckCircle className="text-teal-400" size={24} />
                        )}
                      </div>
                      <p className="text-teal-300/70 text-lg font-light leading-relaxed">
                        {module.description}
                      </p>
                    </div>
                  </div>

                  {/* Module Stats */}
                  <div className="text-right">
                    <div className="text-sm text-teal-400/60 mb-1">
                      {moduleCompleted} / {module.lessons.length}
                    </div>
                    {isStarted && (
                      <div className="text-xs text-teal-300/50">
                        {moduleProgress}% complete
                      </div>
                    )}
                  </div>
                </div>

                {/* Lessons List */}
                <div className="space-y-3 ml-12">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isLessonComplete = completedLessonIds.includes(lesson.id)
                    const lessonNumber = lessonIndex + 1

                    return (
                      <Link
                        key={lesson.id}
                        href={`/academy/${module.id}/${lesson.id}`}
                        className="block bg-teal-950/30 backdrop-blur-sm rounded-none p-5 border-l-2 border-teal-700/20 hover:border-teal-600/50 hover:bg-teal-950/40 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Completion Status */}
                            {isLessonComplete ? (
                              <CheckCircle className="text-teal-400 flex-shrink-0" size={20} />
                            ) : (
                              <Circle className="text-teal-700/40 flex-shrink-0" size={20} />
                            )}

                            {/* Lesson Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-teal-100 font-semibold text-lg tracking-wide group-hover:text-teal-50 transition-colors">
                                  {lessonNumber}. {lesson.title}
                                </h3>
                                <span className="text-xs text-teal-400/50 font-light">
                                  {lesson.duration}
                                </span>
                              </div>
                              <p className="text-teal-300/60 text-sm font-light leading-relaxed">
                                {lesson.description}
                              </p>
                            </div>

                            {/* Play Icon */}
                            <PlayCircle className="text-teal-400/60 group-hover:text-teal-400 transition-colors flex-shrink-0" size={24} />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-16 bg-gradient-to-br from-teal-950/50 to-slate-900/70 backdrop-blur-sm rounded-none p-10 border-l-4 border-teal-600/50 text-center">
          <p className="text-teal-200 text-xl font-light leading-relaxed mb-4">
            Take your time with each lesson. This is not a race.
          </p>
          <p className="text-teal-300/70 font-light">
            Let the teachings land. Practice the reflections. Return when you&apos;re ready.
          </p>
          <p className="text-teal-400/60 italic mt-6">
            The work is fractal - each layer reveals deeper patterns.
          </p>
        </div>
      </div>
    </div>
  )
}
