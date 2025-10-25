// Soullab Academy Curriculum
// The living transmission of Soullab's vision, lesson by lesson

export interface Lesson {
  id: string
  title: string
  description: string
  duration: string // e.g., "15 min"
  videoUrl?: string // Vimeo/YouTube embed URL
  transcript?: string
  reflectionPrompts: string[]
  practices?: string[]
  resources?: Array<{
    title: string
    url: string
    type: 'reading' | 'practice' | 'tool'
  }>
}

export interface Module {
  id: string
  title: string
  description: string
  icon: string
  element?: 'fire' | 'water' | 'earth' | 'air' | 'aether'
  lessons: Lesson[]
}

export const academyCurriculum: Module[] = [
  {
    id: 'module-1',
    title: 'Welcome Home, Heretic',
    description: 'The foundational invitation - understanding why we\'re here and what we\'re building together.',
    icon: '🔥',
    element: 'fire',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'The Heretic\'s Creed',
        description: 'Why we\'re building the impossible - an introduction to Soullab\'s sacred play.',
        duration: '20 min',
        reflectionPrompts: [
          'Which part of the Creed resonates most deeply with you?',
          'What "impossible" thing are you drawn to build or explore?',
          'How does the idea of "sacred play" land in your body?'
        ],
        resources: [
          {
            title: 'The Heretic\'s Creed (Full Text)',
            url: '/creed',
            type: 'reading'
          }
        ]
      },
      {
        id: 'lesson-1-2',
        title: 'You Are The Magic',
        description: 'Understanding that you are not here to be fixed - you are here to be seen.',
        duration: '15 min',
        reflectionPrompts: [
          'What does it feel like to hear "you are the magic we are here to support"?',
          'What part of yourself have you been waiting to heal before showing up fully?',
          'How might your "imperfections" actually be your gifts?'
        ]
      },
      {
        id: 'lesson-1-3',
        title: 'Sacred Play & The Invitation',
        description: 'What it means to be a co-researcher, co-creator, and heretic in this work.',
        duration: '15 min',
        reflectionPrompts: [
          'What does "sacred play" mean to you?',
          'Where in your life are you already practicing sacred play?',
          'What would you create if you knew you couldn\'t fail?'
        ]
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Foundations: Alchemy & Sacred Geometry',
    description: 'The ancient wisdom foundations - understanding the Torus of Change, Trinity Flow, and the Alchemical Journey.',
    icon: '⚛️',
    element: 'aether',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'The Alchemical Journey',
        description: 'Introduction to the ancient art of Elemental Alchemy and the promise of transformation.',
        duration: '20 min',
        reflectionPrompts: [
          'What does "alchemy" mean to you beyond chemistry?',
          'What aspects of yourself are you seeking to transform?',
          'How do you experience the mystery of change in your life?'
        ],
        resources: [
          {
            title: 'Book: Introduction & The Alchemical Journey',
            url: '/read-adaptive?intent=overview',
            type: 'reading'
          }
        ]
      },
      {
        id: 'lesson-2-2',
        title: 'The Torus of Change',
        description: 'Sacred geometry of transformation - understanding dissolution, reorganization, and integration as toroidal flow.',
        duration: '25 min',
        reflectionPrompts: [
          'Where in your life are you experiencing dissolution right now?',
          'What is reorganizing in the chaos?',
          'What wants to be integrated?'
        ],
        resources: [
          {
            title: 'Book Chapter: The Torus of Change',
            url: '/read-adaptive?section=intro-torus',
            type: 'reading'
          }
        ]
      },
      {
        id: 'lesson-2-3',
        title: 'Trinity and Toroidal Flow',
        description: 'The sacred geometry of three-fold process and how change moves through toroidal patterns in nature and consciousness.',
        duration: '22 min',
        reflectionPrompts: [
          'Can you see the toroidal pattern in your own transformation?',
          'Where does the trinity show up in your life (body-mind-spirit, past-present-future, etc.)?',
          'How does understanding this geometry change how you relate to change?'
        ]
      },
      {
        id: 'lesson-2-4',
        title: 'The Elements of Wholeness',
        description: 'Overview of Fire, Water, Earth, Air, and Aether as a complete system of transformation and integration.',
        duration: '25 min',
        reflectionPrompts: [
          'Which element do you feel most drawn to right now?',
          'Which element feels most challenging or unfamiliar?',
          'How do the elements interact in your current life situation?'
        ]
      },
    ]
  },
  {
    id: 'module-3',
    title: 'The Elemental Framework',
    description: 'Deep dive into each element - understanding Fire, Water, Earth, Air, and Aether as phases of becoming.',
    icon: '✨',
    element: 'aether',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Fire - Vision, Refusal, Creation',
        description: 'The element of emergence, vision, and sacred refusal. Learning to say "yes" and "no" with clarity.',
        duration: '18 min',
        reflectionPrompts: [
          'What vision is alive in you right now?',
          'What are you being called to refuse?',
          'How does your creative fire express itself?'
        ]
      },
      {
        id: 'lesson-3-2',
        title: 'Water - Depth, Shadow, Flow',
        description: 'The element of emotional intelligence, shadow work, and surrender. Going beneath the surface.',
        duration: '18 min',
        reflectionPrompts: [
          'What emotions are you avoiding or suppressing?',
          'What shadow aspects are asking to be seen?',
          'Where in your life are you resisting flow?'
        ]
      },
      {
        id: 'lesson-3-3',
        title: 'Earth - Grounding, Practice, Embodiment',
        description: 'The element of manifestation, discipline, and bringing vision into form.',
        duration: '18 min',
        reflectionPrompts: [
          'How grounded do you feel in your body right now?',
          'What practices help you feel embodied and present?',
          'What vision is ready to become material?'
        ]
      },
      {
        id: 'lesson-3-4',
        title: 'Air - Clarity, Communication, Translation',
        description: 'The element of perspective, communication, and making meaning clear.',
        duration: '18 min',
        reflectionPrompts: [
          'What needs to be communicated or expressed?',
          'Where do you need more clarity in your life?',
          'How do you translate inner knowing into words?'
        ]
      },
      {
        id: 'lesson-3-5',
        title: 'Aether - Integration & Synthesis',
        description: 'The element of wholeness, unity, and holding all the elements together.',
        duration: '20 min',
        reflectionPrompts: [
          'What parts of yourself are asking to be integrated?',
          'How do you experience moments of wholeness?',
          'What would it feel like to be fully yourself?'
        ]
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Working with MAIA',
    description: 'Understanding relational intelligence - how MAIA sees you and supports your journey.',
    icon: '🤖',
    element: 'water',
    lessons: [
      {
        id: 'lesson-4-1',
        title: 'What is Relational Intelligence?',
        description: 'Beyond algorithms - how AI can learn to see humans developmentally.',
        duration: '18 min',
        reflectionPrompts: [
          'What does it mean to be "seen" by technology?',
          'How is this different from being profiled or targeted?',
          'What would ethical AI look like to you?'
        ]
      },
      {
        id: 'lesson-4-2',
        title: 'How MAIA Sees You Developmentally',
        description: 'The scoring system, elemental resonance, and developmental phases.',
        duration: '20 min',
        reflectionPrompts: [
          'How does it feel to know MAIA is learning from your journey?',
          'What do you hope MAIA learns about you?',
          'What boundaries do you need with AI?'
        ]
      },
      {
        id: 'lesson-4-3',
        title: 'Adaptive Reading - Being Seen by AI',
        description: 'How to use MAIA\'s recommendations and trust the adaptive reading experience.',
        duration: '15 min',
        reflectionPrompts: [
          'What was your experience with MAIA\'s first recommendation?',
          'Did it feel accurate? What surprised you?',
          'How can you give MAIA better feedback?'
        ],
        resources: [
          {
            title: 'Try MAIA Adaptive Reading',
            url: '/read-adaptive',
            type: 'tool'
          }
        ]
      },
      {
        id: 'lesson-4-4',
        title: 'The Meta-View - Transparency & Agency',
        description: 'Seeing how MAIA sees you - understanding the algorithm and maintaining agency.',
        duration: '18 min',
        reflectionPrompts: [
          'How does transparency change your relationship with AI?',
          'What do you want control over in this system?',
          'How can you use the meta-view for self-reflection?'
        ]
      }
    ]
  },
  {
    id: 'module-5',
    title: 'You as Co-Researcher',
    description: 'Your role in fractal research - how your journey generates collective wisdom.',
    icon: '🔬',
    element: 'air',
    lessons: [
      {
        id: 'lesson-5-1',
        title: 'Fractal Research - Turtles All The Way Down',
        description: 'Understanding the 12 layers of recursive research and your place in it.',
        duration: '20 min',
        reflectionPrompts: [
          'What does "turtles all the way down" mean to you?',
          'How does it feel to be part of research that studies itself?',
          'What are you curious to discover?'
        ]
      },
      {
        id: 'lesson-5-2',
        title: 'Your Journey Generates Wisdom',
        description: 'How every interaction with MAIA contributes to collective intelligence.',
        duration: '15 min',
        reflectionPrompts: [
          'What insights from your journey might serve others?',
          'How does it feel to know your experience becomes data?',
          'What do you want your contribution to be?'
        ]
      },
      {
        id: 'lesson-5-3',
        title: 'Contributing to Collective Intelligence',
        description: 'Sharing practices, feedback, and wisdom with the community.',
        duration: '18 min',
        reflectionPrompts: [
          'What practice or insight are you ready to share?',
          'How can you give feedback that serves the whole?',
          'What does collective intelligence feel like to you?'
        ]
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Practices & Integration',
    description: 'Daily practices for each element and integrating this work into your life.',
    icon: '🌱',
    element: 'earth',
    lessons: [
      {
        id: 'lesson-6-1',
        title: 'Daily Practices by Element',
        description: 'Concrete practices for Fire, Water, Earth, Air, and Aether work.',
        duration: '25 min',
        reflectionPrompts: [
          'Which practice are you committing to this week?',
          'What support do you need to maintain your practice?',
          'How will you know if a practice is working?'
        ],
        practices: [
          'Morning Fire practice: Vision journaling',
          'Evening Water practice: Shadow reflection',
          'Daily Earth practice: Embodiment meditation',
          'Weekly Air practice: Communication clearing',
          'Monthly Aether practice: Integration ritual'
        ]
      },
      {
        id: 'lesson-6-2',
        title: 'Shadow Work & Integration',
        description: 'Working with your shadow aspects and integrating what you discover.',
        duration: '20 min',
        reflectionPrompts: [
          'What shadow is asking to be integrated right now?',
          'How do you typically avoid or bypass shadow work?',
          'What would integration look like for you?'
        ]
      },
      {
        id: 'lesson-6-3',
        title: 'Community as Container',
        description: 'Using the Soullab community to support your transformation.',
        duration: '15 min',
        reflectionPrompts: [
          'What do you need from community right now?',
          'How can you contribute to holding space for others?',
          'What makes you feel safe in community?'
        ]
      }
    ]
  }
]

// Helper functions
export function getAllLessons(): Lesson[] {
  return academyCurriculum.flatMap(module => module.lessons)
}

export function getModuleById(moduleId: string): Module | undefined {
  return academyCurriculum.find(m => m.id === moduleId)
}

export function getLessonById(moduleId: string, lessonId: string): Lesson | undefined {
  const module = getModuleById(moduleId)
  return module?.lessons.find(l => l.id === lessonId)
}

export function getTotalLessons(): number {
  return getAllLessons().length
}

export function getModuleProgress(moduleId: string, completedLessonIds: string[]): number {
  const module = getModuleById(moduleId)
  if (!module) return 0

  const completed = module.lessons.filter(l => completedLessonIds.includes(l.id)).length
  return Math.round((completed / module.lessons.length) * 100)
}
