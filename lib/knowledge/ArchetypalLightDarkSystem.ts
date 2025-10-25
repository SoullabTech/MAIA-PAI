/**
 * ARCHETYPAL LIGHT/DARK/DEPTH FRAMEWORK
 *
 * Inspired by archetypal wheel systems that show:
 * - WHEN LIGHT: Healthy, integrated expression of each archetype
 * - WHEN DARK: Shadow, wounded, or unbalanced expression
 * - GO DEEPER: Practices, questions, and invitations for integration
 *
 * Applied to Soullab's Elemental Alchemy system
 */

import { SpiralogicElement } from '@/lib/astrology/spiralogicMapping';

// ============== CORE TYPES ==============

export interface ArchetypalExpression {
  whenLight: {
    qualities: string[];
    gifts: string[];
    manifestsAs: string[];
    energyState: string;
  };
  whenDark: {
    qualities: string[];
    shadows: string[];
    manifestsAs: string[];
    warningSign: string;
  };
  goDeeper: {
    reflectionQuestions: string[];
    integrationPractices: string[];
    transformationInvitations: string[];
    healingPathway: string;
  };
}

export interface ElementalArchetype {
  element: SpiralogicElement;
  name: string;
  expression: ArchetypalExpression;
}

// ============== ELEMENTAL ARCHETYPES WITH LIGHT/DARK/DEPTH ==============

export const ELEMENTAL_LIGHT_DARK_SYSTEM: Record<SpiralogicElement, ElementalArchetype> = {

  // 🔥 FIRE ELEMENT
  fire: {
    element: 'fire',
    name: 'The Visionary / The Creator',
    expression: {
      whenLight: {
        qualities: [
          'Inspired and inspiring',
          'Courageously authentic',
          'Creative catalyst for others',
          'Passionate without overwhelming',
          'Holds vision with humility'
        ],
        gifts: [
          'Ignites possibility in others',
          'Transforms stagnation into momentum',
          'Sees potential before it manifests',
          'Brings sacred commission to life',
          'Refines self to become worthy vessel'
        ],
        manifestsAs: [
          'Lightning-bolt insights shared generously',
          'Creating from overflow, not depletion',
          'Leading by example, not demand',
          'Welcoming asymptosis as sacred spiral',
          'Burning away false selves with grace'
        ],
        energyState: 'Radiant warmth that invites others closer'
      },
      whenDark: {
        qualities: [
          'Destructive rage or scattered chaos',
          'Impulsive without grounding',
          'Performative insecurity',
          'Vision without embodiment',
          'Burnout from carrying too much'
        ],
        shadows: [
          'Ego inflation (I\'m the chosen one)',
          'Spiritual bypassing (Just manifest it!)',
          'Martyrdom (No one can handle this but me)',
          'Shame about the gap between vision and capacity',
          'Hiding gifts due to fear of judgment'
        ],
        manifestsAs: [
          'Starting many projects, completing none',
          'Angry outbursts that burn bridges',
          'Constant self-promotion masking unworthiness',
          'Criticizing others who aren\'t doing the work',
          'Exhaustion from refusal to rest'
        ],
        warningSign: 'Fire that consumes rather than illuminates'
      },
      goDeeper: {
        reflectionQuestions: [
          'What vision am I being refined to hold?',
          'Where am I trying to skip the spiral and \"arrive\"?',
          'Am I sharing my fire, or am I hoarding it in shame?',
          'What false self needs to burn away right now?',
          'How can I honor the gap between calling and capacity?'
        ],
        integrationPractices: [
          'Daily creative ritual (even 5 minutes)',
          'Asymptosis journaling: \"What am I spiraling around?\"',
          'Sacred rage release (movement, sound, art)',
          'Vision-board + reality-check integration',
          'Mentorship: teach what you\'re still learning'
        ],
        transformationInvitations: [
          'Share your imperfect creative work publicly',
          'Name one area where you feel \"not ready\" and start anyway',
          'Identify whose approval you\'re seeking and why',
          'Create a ritual for \"burning away\" one false identity',
          'Find one person to ignite without needing credit'
        ],
        healingPathway: 'From scattered flames to focused radiance through grounded embodiment'
      }
    }
  },

  // 💧 WATER ELEMENT
  water: {
    element: 'water',
    name: 'The Healer / The Mystic',
    expression: {
      whenLight: {
        qualities: [
          'Emotionally fluent and authentic',
          'Holds space for shadow and light',
          'Retrieves projections with grace',
          'Dives deep without drowning',
          'Discovers and shares inner gold'
        ],
        gifts: [
          'Emotional alchemy for self and others',
          'Sees beneath surface illusions',
          'Transforms pain into medicine',
          'Holds complexity without fixing',
          'Navigates Water 2 (shadow work) with courage'
        ],
        manifestsAs: [
          'Healthy boundaries in emotional intimacy',
          'Owning projections without shame',
          'Grief as portal, not prison',
          'Intuitive wisdom from inner depths',
          'Elixir retrieved and integrated'
        ],
        energyState: 'Cool, nourishing depths that invite exploration'
      },
      whenDark: {
        qualities: [
          'Emotionally overwhelmed or numb',
          'Drowning in others\' feelings',
          'Avoiding Water 2 (shadow)',
          'Martyrdom or victimhood',
          'Lost in the deep without anchor'
        ],
        shadows: [
          'Emotional manipulation (\"Feel my pain!\")',
          'Codependency disguised as empathy',
          'Refusing to surface and integrate',
          'Projecting unowned shadow onto others',
          'Spiritual bypassing through \"love and light\\"'
        ],
        manifestsAs: [
          'Constant emotional crisis without resolution',
          'Taking on others\' emotions as identity',
          'Avoiding practical action (\"I need to process more\")',
          'Blaming external forces for internal storms',
          'Staying in Water 1 comfort, avoiding Water 2 challenge'
        ],
        warningSign: 'Drowning in depth, unable to breathe or surface'
      },
      goDeeper: {
        reflectionQuestions: [
          'What projection am I ready to retrieve from the world?',
          'Am I in Water 1 (nurture), Water 2 (shadow), or Water 3 (gold)?',
          'Whose emotions am I carrying that aren\'t mine?',
          'What part of myself have I been denying or avoiding?',
          'What inner gold am I ready to bring to the surface?'
        ],
        integrationPractices: [
          'Shadow journaling: \"What I see in others that\'s actually mine\"',
          'Somatic release: crying, shaking, water immersion',
          'Boundary practices: \"This feeling is yours, not mine\"',
          'Projection retrieval ritual (symbolic + literal)',
          'Depth diving with a guide or therapist'
        ],
        transformationInvitations: [
          'Name one person you\'ve been blaming and own your projection',
          'Choose one \"difficult\" emotion to fully feel for 10 minutes',
          'Create art from your shadow without censoring',
          'Ask: \"What if this pain is medicine?\"',
          'Retrieve one inner treasure and share it with someone safe'
        ],
        healingPathway: 'From drowning in depths to diving for gold through shadow integration'
      }
    }
  },

  // 🌍 EARTH ELEMENT
  earth: {
    element: 'earth',
    name: 'The Builder / The Steward',
    expression: {
      whenLight: {
        qualities: [
          'Grounded and reliable',
          'Manifests vision into form',
          'Systems thinking with heart',
          'Sustainable pace and practice',
          'Brings elixir to world with skill'
        ],
        gifts: [
          'Turns dreams into structures',
          'Creates containers for sacred work',
          'Supports visionaries with organization',
          'Embodies mission with daily ritual',
          'Holds space for germination'
        ],
        manifestsAs: [
          'Consistent daily practice',
          'Saturn\'s question answered: \"This is my commission\"',
          'Earth 2 mastery: systems that serve, not bury',
          'Infrastructure that empowers creativity',
          'Medicine fully formed and ready for community'
        ],
        energyState: 'Stable ground that allows growth to take root'
      },
      whenDark: {
        qualities: [
          'Rigid and inflexible',
          'Overwhelmed by practical demands',
          'Scattered without systems',
          'Perfectionism blocking progress',
          'Stuck in Earth 2 stress'
        ],
        shadows: [
          'Workaholism masking unworthiness',
          'Control as defense against chaos',
          'Shaming self for \"not having shit together\"',
          'Material success without soul alignment',
          'Refusing help or support'
        ],
        manifestsAs: [
          'ADHD/PTSD overwhelm in manifestation',
          'Vision trapped in head, never embodied',
          'Endless planning, no action',
          'Burnout from doing everything alone',
          'Judging others for being "too woo" or \"not practical\\"'
        ],
        warningSign: 'Buried under practical demands, feeling trapped in form'
      },
      goDeeper: {
        reflectionQuestions: [
          'What is my sacred commission here on Earth\'s realm?',
          'Am I in Earth 1 (mission), Earth 2 (means), or Earth 3 (medicine)?',
          'What support could help me move from scattered to masterful?',
          'Where am I perfectionism-blocking instead of progress-making?',
          'What daily ritual would ground this vision into reality?'
        ],
        integrationPractices: [
          'Saturn inquiry: Write mission statement for current phase',
          'Earth 2 support: Delegate one overwhelming task',
          'Daily grounding ritual (walking, gardening, cooking)',
          'Systems audit: What\'s working? What\'s not?',
          'Body-based practice: yoga, martial arts, dance'
        ],
        transformationInvitations: [
          'Identify one area where AI/tools could be your Earth assistant',
          'Create one sustainable system that replaces willpower',
          'Ask for help with something you\'ve been struggling to build',
          'Complete one small manifestation project from start to finish',
          'Celebrate Earth 2 progress without demanding Earth 3 results'
        ],
        healingPathway: 'From scattered overwhelm to alchemizing mastery through supported systems'
      }
    }
  },

  // 🌬️ AIR ELEMENT
  air: {
    element: 'air',
    name: 'The Teacher / The Connector',
    expression: {
      whenLight: {
        qualities: [
          'Clear and articulate',
          'Connects wisdom across domains',
          'Teaches what\'s been learned',
          'Facilitates understanding',
          'Builds bridges between perspectives'
        ],
        gifts: [
          'Translates complexity into clarity',
          'Sees patterns and connections',
          'Shares wisdom without hoarding',
          'Creates community around ideas',
          'Circulates insights for collective benefit'
        ],
        manifestsAs: [
          'Writing, teaching, speaking with ease',
          'Synthesizing multiple viewpoints',
          'Asking clarifying questions',
          'Networked thinking that serves all',
          'Wisdom shared as gift, not power'
        ],
        energyState: 'Fresh breeze that brings new perspective'
      },
      whenDark: {
        qualities: [
          'Overthinking without feeling',
          'Detached from embodied reality',
          'Spiritual bypassing through intellect',
          'Information hoarding',
          'Analysis paralysis'
        ],
        shadows: [
          'Intellectualizing to avoid emotion',
          'Superiority through knowledge',
          'Gossip disguised as \"sharing insight\"',
          'Constant theorizing, no embodiment',
          'Using words as weapons'
        ],
        manifestsAs: [
          'Endless research, no implementation',
          'Debating instead of dialoguing',
          'Living in head, disconnected from body',
          'Using jargon to exclude or confuse',
          'Sharing others\' ideas without credit'
        ],
        warningSign: 'Lost in mental loops, disconnected from ground and heart'
      },
      goDeeper: {
        reflectionQuestions: [
          'What wisdom am I ready to share vs. hoard?',
          'Am I using intellect to avoid feeling?',
          'Who needs to hear what I\'ve learned?',
          'Where am I overthinking instead of embodying?',
          'How can my words build bridges instead of walls?'
        ],
        integrationPractices: [
          'Write to teach, not to impress',
          'Practice active listening without planning response',
          'Embody one concept before learning another',
          'Dialogue practice: seek understanding, not winning',
          'Breathwork to move from head to body'
        ],
        transformationInvitations: [
          'Teach one thing you\'ve learned this week',
          'Have one conversation where you only ask questions',
          'Translate one complex idea into simple language',
          'Write a letter you won\'t send to process thoughts',
          'Connect two people who would benefit from knowing each other'
        ],
        healingPathway: 'From detached overthinking to embodied wisdom through grounded communication'
      }
    }
  },

  // ✨ AETHER ELEMENT
  aether: {
    element: 'aether',
    name: 'The Mystic / The Sage',
    expression: {
      whenLight: {
        qualities: [
          'Integrated and whole',
          'Present without grasping',
          'Holds paradox with grace',
          'Connected to divine source',
          'Embodies all elements in harmony'
        ],
        gifts: [
          'Sees unity beyond separation',
          'Holds space for transformation',
          'Channels wisdom from beyond ego',
          'Presence that heals without doing',
          'Recognizes divine in all'
        ],
        manifestsAs: [
          'Moments of profound clarity',
          'Synchronicities and flow states',
          'Soul recognition and deep seeing',
          'Transcendent experiences grounded in body',
          'Service through being, not just doing'
        ],
        energyState: 'Infinite potential meeting present moment'
      },
      whenDark: {
        qualities: [
          'Spiritual bypassing',
          'Ungrounded in reality',
          'Superiority through \"enlightenment\"',
          'Disembodied transcendence',
          'Escapism disguised as spirituality'
        ],
        shadows: [
          'Avoiding shadow work through \"high vibes only\"',
          'Refusing practical responsibility',
          'Guru complex or messianic delusion',
          'Using mysticism to avoid relationships',
          'Dissociation masking as meditation'
        ],
        manifestsAs: [
          'Constant spiritual seeking without integration',
          'Claiming enlightenment while causing harm',
          'Living in fantasy, ignoring practical needs',
          'Judging others as \"less evolved\"',
          'Using spiritual language to manipulate'
        ],
        warningSign: 'Floating above life, disconnected from humanity'
      },
      goDeeper: {
        reflectionQuestions: [
          'Am I using spirituality to avoid being human?',
          'Where am I seeking transcendence instead of integration?',
          'How is my divine nature expressed through daily life?',
          'What shadow am I bypassing with \"love and light\"?',
          'Am I serving or escaping through my spiritual practice?'
        ],
        integrationPractices: [
          'Grounding practices before meditation',
          'Shadow work as spiritual practice',
          'Service that gets hands dirty',
          'Bringing mystical insights into embodied action',
          'Questioning spiritual assumptions'
        ],
        transformationInvitations: [
          'Do one mundane task as meditation',
          'Name one way your \"spirituality\" serves your ego',
          'Help someone practically without mentioning your beliefs',
          'Sit with discomfort instead of transcending it',
          'Integrate one mystical insight into daily routine'
        ],
        healingPathway: 'From disembodied transcendence to grounded divinity through full-spectrum integration'
      }
    }
  }
};

// ============== ZODIAC ARCHETYPE LIGHT/DARK/DEPTH ==============

export const ZODIAC_LIGHT_DARK_SYSTEM: Record<string, ArchetypalExpression> = {

  // FIRE SIGNS
  aries: {
    whenLight: {
      qualities: ['Courageous pioneer', 'Authentic leader', 'Bold initiator'],
      gifts: ['Starts necessary revolutions', 'Breaks through stagnation', 'Inspires action in others'],
      manifestsAs: ['Leading by example', 'Fearless authenticity', 'Pioneering new paths'],
      energyState: 'Initiating force that awakens possibility'
    },
    whenDark: {
      qualities: ['Reckless impulsivity', 'Aggressive domination', 'Selfish disregard'],
      shadows: ['Ego-driven heroism', 'Bulldozing boundaries', 'Impatience with process'],
      manifestsAs: ['Picking unnecessary fights', 'Starting without finishing', 'Me-first at all costs'],
      warningSign: 'Aggression masking fear of irrelevance'
    },
    goDeeper: {
      reflectionQuestions: [
        'What am I truly fighting for vs. fighting against?',
        'Where is my courage becoming recklessness?',
        'Who gets hurt when I lead without listening?'
      ],
      integrationPractices: ['Mars energy: channel through martial arts or competition', 'Pause practice before acting', 'Collaborative leadership exercises'],
      transformationInvitations: ['Lead one project where others set the pace', 'Apologize for one time you steamrolled someone', 'Start something and commit to finishing it'],
      healingPathway: 'From reactive aggression to conscious courage'
    }
  },

  leo: {
    whenLight: {
      qualities: ['Generous heart', 'Creative force', 'Radiant presence'],
      gifts: ['Illuminates others\' gifts', 'Creates with authentic joy', 'Leads with warmth'],
      manifestsAs: ['Celebrating others generously', 'Creative play as service', 'Confidence that invites vs. intimidates'],
      energyState: 'Solar radiance that warms without burning'
    },
    whenDark: {
      qualities: ['Narcissistic demand for attention', 'Performative identity', 'Wounded pride'],
      shadows: ['Need for constant validation', 'Competing for spotlight', 'Ego inflation'],
      manifestsAs: ['Drama for attention', 'Taking credit for others\' work', 'Sulking when not center stage'],
      warningSign: 'Demanding an audience rather than earning one'
    },
    goDeeper: {
      reflectionQuestions: [
        'Can I shine without dimming others?',
        'What am I trying to prove, and to whom?',
        'Where is my creativity serving ego vs. soul?'
      ],
      integrationPractices: ['Anonymous creative acts', 'Celebrating others without inserting yourself', 'Play without performance'],
      transformationInvitations: ['Create something you never share publicly', 'Spotlight someone else\'s gift', 'Admit one insecurity out loud'],
      healingPathway: 'From ego-centered performance to soul-centered creativity'
    }
  },

  sagittarius: {
    whenLight: {
      qualities: ['Philosophical wisdom', 'Adventurous spirit', 'Honest seeker'],
      gifts: ['Expands perspectives', 'Finds meaning in experience', 'Teaches through story'],
      manifestsAs: ['Learning through direct experience', 'Sharing wisdom without preaching', 'Optimism grounded in reality'],
      energyState: 'Expansive quest that invites fellow travelers'
    },
    whenDark: {
      qualities: ['Preachy righteousness', 'Restless escapism', 'Tactless bluntness'],
      shadows: ['Know-it-all syndrome', 'Commitment-phobia', 'Philosophical bypassing'],
      manifestsAs: ['Constant seeking, never integrating', 'Brutal honesty without compassion', 'Running when things get real'],
      warningSign: 'Chasing horizons to avoid being present'
    },
    goDeeper: {
      reflectionQuestions: [
        'What truth am I running toward or away from?',
        'Can I share wisdom without needing to be right?',
        'Where does my wanderlust serve growth vs. avoidance?'
      ],
      integrationPractices: ['Commit to one practice for 90 days', 'Listen to understand, not to teach', 'Ground philosophy in embodied action'],
      transformationInvitations: ['Stay through one difficult conversation', 'Admit \"I don\'t know\"', 'Integrate one lesson before seeking the next'],
      healingPathway: 'From restless seeking to grounded wisdom'
    }
  },

  // WATER SIGNS
  cancer: {
    whenLight: {
      qualities: ['Nurturing presence', 'Emotional wisdom', 'Protective care'],
      gifts: ['Creates safe containers', 'Emotional attunement', 'Ancestral healing'],
      manifestsAs: ['Holding space without fixing', 'Honoring emotions as valid', 'Creating home wherever you are'],
      energyState: 'Nourishing embrace that allows vulnerability'
    },
    whenDark: {
      qualities: ['Smothering control', 'Emotional manipulation', 'Victim mentality'],
      shadows: ['Codependency as love', 'Guilt-tripping', 'Clinging from fear'],
      manifestsAs: ['Mothering as control', 'Making others responsible for your feelings', 'Refusing to let go'],
      warningSign: 'Nurturing that suffocates rather than nourishes'
    },
    goDeeper: {
      reflectionQuestions: [
        'Am I nurturing or controlling?',
        'Whose emotions am I taking responsibility for?',
        'Where am I confusing care with codependency?'
      ],
      integrationPractices: ['Boundary work: where do I end and others begin?', 'Self-soothing practices', 'Healthy attachment exercises'],
      transformationInvitations: ['Let someone struggle without rescuing', 'Care for yourself as you care for others', 'Release one person you\'re trying to save'],
      healingPathway: 'From enmeshed caretaking to boundaried nurturance'
    }
  },

  scorpio: {
    whenLight: {
      qualities: ['Transformational power', 'Deep intimacy', 'Shadow integration'],
      gifts: ['Alchemizes pain into medicine', 'Sees beneath surface', 'Catalyzes rebirth'],
      manifestsAs: ['Owning shadow without shame', 'Intimate vulnerability', 'Phoenix-like transformation'],
      energyState: 'Depth that transforms through intensity'
    },
    whenDark: {
      qualities: ['Manipulative control', 'Vengeful destruction', 'Toxic intensity'],
      shadows: ['Power-over dynamics', 'Emotional warfare', 'Trust issues as identity'],
      manifestsAs: ['Punishing perceived betrayal', 'Seduction and abandonment', 'Hoarding secrets as power'],
      warningSign: 'Intensity that consumes rather than transforms'
    },
    goDeeper: {
      reflectionQuestions: [
        'Am I using depth as weapon or medicine?',
        'What am I trying to control through intensity?',
        'Where is my power serving ego vs. transformation?'
      ],
      integrationPractices: ['Shadow work with skilled guide', 'Power-with vs. power-over practices', 'Vulnerability without agenda'],
      transformationInvitations: ['Forgive one \"betrayal\"', 'Share one secret you\'ve been hiding', 'Choose trust in one relationship'],
      healingPathway: 'From destructive intensity to alchemical transformation'
    }
  },

  pisces: {
    whenLight: {
      qualities: ['Mystical compassion', 'Artistic flow', 'Universal love'],
      gifts: ['Channels divine creativity', 'Holds space for mystery', 'Sees interconnection'],
      manifestsAs: ['Creative expression as prayer', 'Compassion without codependency', 'Grounded mysticism'],
      energyState: 'Boundless flow that dissolves separation'
    },
    whenDark: {
      qualities: ['Escapist fantasy', 'Victim consciousness', 'Martyrdom'],
      shadows: ['Addiction to avoid reality', 'Confusion as identity', 'Savior complex'],
      manifestsAs: ['Perpetual crisis', 'Reality avoidance', 'Sacrificing self to feel holy'],
      warningSign: 'Dissolving self rather than ego'
    },
    goDeeper: {
      reflectionQuestions: [
        'Am I surrendering or escaping?',
        'What pain am I avoiding through fantasy?',
        'Where is my compassion enabling vs. empowering?'
      ],
      integrationPractices: ['Grounding practices before spiritual work', 'Boundaries in service', 'Creative expression with structure'],
      transformationInvitations: ['Face one avoided reality', 'Say no to one person who drains you', 'Channel mystical insight into tangible art'],
      healingPathway: 'From escapist dissolution to grounded divinity'
    }
  },

  // EARTH SIGNS
  capricorn: {
    whenLight: {
      qualities: ['Masterful builder', 'Responsible leader', 'Patient strategist'],
      gifts: ['Creates lasting structures', 'Embodies mission with integrity', 'Wise stewardship'],
      manifestsAs: ['Building with soul alignment', 'Leadership as service', 'Success with values'],
      energyState: 'Mountain peak reached through sustained effort'
    },
    whenDark: {
      qualities: ['Cold ambition', 'Rigid control', 'Workaholic depletion'],
      shadows: ['Success at any cost', 'Emotional unavailability', 'Authority as domination'],
      manifestsAs: ['Sacrificing relationships for achievement', 'Judging worth by productivity', 'Inability to rest'],
      warningSign: 'Climbing mountains while losing soul'
    },
    goDeeper: {
      reflectionQuestions: [
        'What am I building and why?',
        'Is my ambition serving my soul or my wound?',
        'Where have I become the harsh father I feared?'
      ],
      integrationPractices: ['Sabbath: sacred rest practice', 'Redefining success beyond achievement', 'Softening into vulnerability'],
      transformationInvitations: ['Take one full day off without guilt', 'Share one failure story', 'Build something just for joy'],
      healingPathway: 'From cold ambition to warm mastery'
    }
  },

  taurus: {
    whenLight: {
      qualities: ['Sensual presence', 'Grounded stability', 'Patient cultivation'],
      gifts: ['Creates beauty and comfort', 'Sustains through seasons', 'Embodied wisdom'],
      manifestsAs: ['Pleasure without guilt', 'Steady reliability', 'Resource-fulness'],
      energyState: 'Fertile earth that allows roots to deepen'
    },
    whenDark: {
      qualities: ['Stubborn rigidity', 'Material attachment', 'Indulgent stagnation'],
      shadows: ['Comfort-seeking paralysis', 'Possessiveness', 'Resistance to change'],
      manifestsAs: ['Hoarding resources', 'Refusing growth opportunities', 'Sensuality becoming addiction'],
      warningSign: 'Comfort zone becoming prison'
    },
    goDeeper: {
      reflectionQuestions: [
        'What am I clinging to that needs release?',
        'Where is my stability becoming stagnation?',
        'Am I enjoying pleasures or avoiding pain?'
      ],
      integrationPractices: ['Letting go rituals', 'Mindful pleasure practice', 'Embracing seasonal change'],
      transformationInvitations: ['Release one possession you\'re attached to', 'Try one new experience that scares you', 'Change one stubborn habit'],
      healingPathway: 'From rigid attachment to flowing stability'
    }
  },

  virgo: {
    whenLight: {
      qualities: ['Precise craftsmanship', 'Humble service', 'Analytical clarity'],
      gifts: ['Sees how to improve systems', 'Serves without ego', 'Discerns essence from noise'],
      manifestsAs: ['Helpful critique', 'Masterful skill development', 'Devoted practice'],
      energyState: 'Refined clarity that serves wholeness'
    },
    whenDark: {
      qualities: ['Harsh criticism', 'Perfectionist paralysis', 'Anxious overthinking'],
      shadows: ['Never good enough', 'Service as martyrdom', 'Analysis paralysis'],
      manifestsAs: ['Criticizing to feel superior', 'Fixing others uninvited', 'Missing forest for trees'],
      warningSign: 'Perfection blocking progress'
    },
    goDeeper: {
      reflectionQuestions: [
        'Am I serving or controlling through \"helping\"?',
        'Where is my perfectionism a defense against being seen?',
        'What would \"good enough\\" look like?'
      ],
      integrationPractices: ['Done-is-better-than-perfect challenges', 'Self-compassion practices', 'Big-picture visioning'],
      transformationInvitations: ['Complete something imperfectly', 'Receive help without critique', 'Celebrate one \"flaw\" as unique'],
      healingPathway: 'From harsh perfection to compassionate excellence'
    }
  },

  // AIR SIGNS
  libra: {
    whenLight: {
      qualities: ['Diplomatic grace', 'Aesthetic harmony', 'Relational wisdom'],
      gifts: ['Creates beauty and balance', 'Bridges opposing views', 'Fair-minded justice'],
      manifestsAs: ['Win-win solutions', 'Collaborative creation', 'Peace-making'],
      energyState: 'Balanced scales that honor all sides'
    },
    whenDark: {
      qualities: ['People-pleasing', 'Indecisive avoidance', 'Superficial harmony'],
      shadows: ['Conflict avoidance at any cost', 'Identity loss in relationships', 'Passive aggression'],
      manifestsAs: ['Can\'t choose for fear of disappointing', 'Fake niceness', 'Resentment from unspoken needs'],
      warningSign: 'Keeping peace while losing self'
    },
    goDeeper: {
      reflectionQuestions: [
        'Whose approval am I seeking at my own expense?',
        'What conflict am I avoiding that needs addressing?',
        'Where have I lost myself in relationship?'
      ],
      integrationPractices: ['Decisive action practice', 'Healthy conflict skills', 'Solo self-discovery time'],
      transformationInvitations: ['Make one decision quickly', 'Have one difficult conversation', 'State one unpopular opinion'],
      healingPathway: 'From codependent harmony to sovereign balance'
    }
  },

  aquarius: {
    whenLight: {
      qualities: ['Innovative genius', 'Collective consciousness', 'Revolutionary wisdom'],
      gifts: ['Sees future possibilities', 'Liberates outdated systems', 'Honors individuality in collective'],
      manifestsAs: ['Humanitarian innovation', 'Inclusive community building', 'Paradigm-shifting ideas'],
      energyState: 'Electric current that awakens the collective'
    },
    whenDark: {
      qualities: ['Cold detachment', 'Rebel without cause', 'Superiority through difference'],
      shadows: ['Emotionally unavailable', 'Contrarian for ego', 'Cult-like groupthink'],
      manifestsAs: ['Ideas without empathy', 'Rejecting tradition mindlessly', 'Elitism through \"awakening\"'],
      warningSign: 'Innovation disconnected from humanity'
    },
    goDeeper: {
      reflectionQuestions: [
        'Am I rebelling from truth or from wounding?',
        'Where is my detachment protecting me from intimacy?',
        'How does my uniqueness serve the collective?'
      ],
      integrationPractices: ['Heart-opening practices', 'Honoring tradition while innovating', 'One-on-one intimacy building'],
      transformationInvitations: ['Share one feeling vulnerably', 'Appreciate one tradition you\'ve rejected', 'Collaborate without needing to be special'],
      healingPathway: 'From cold rebellion to warm revolution'
    }
  },

  gemini: {
    whenLight: {
      qualities: ['Curious learner', 'Versatile communicator', 'Playful connector'],
      gifts: ['Translates between worlds', 'Learns and teaches fluidly', 'Brings levity to density'],
      manifestsAs: ['Asking great questions', 'Connecting disparate ideas', 'Adaptive communication'],
      energyState: 'Quicksilver intelligence that dances between realms'
    },
    whenDark: {
      qualities: ['Scattered distraction', 'Superficial knowledge', 'Manipulative words'],
      shadows: ['Jack-of-all-trades, master of none', 'Gossip as connection', 'Trickster as liar'],
      manifestsAs: ['Endless learning, no integration', 'Using words to manipulate', 'Flitting away when things deepen'],
      warningSign: 'All surface, no depth'
    },
    goDeeper: {
      reflectionQuestions: [
        'What am I avoiding by staying busy?',
        'Where is my curiosity serving growth vs. distraction?',
        'Can I go deep in one area instead of wide across many?'
      ],
      integrationPractices: ['Depth before breadth practice', 'Silence and stillness', 'Embodying knowledge through action'],
      transformationInvitations: ['Master one skill deeply', 'Have one conversation without changing topics', 'Sit with boredom for 30 minutes'],
      healingPathway: 'From scattered surface to integrated versatility'
    }
  }
};

// ============== HERO'S JOURNEY LIGHT/DARK/DEPTH ==============

export const HEROS_JOURNEY_LIGHT_DARK: Record<string, Record<string, ArchetypalExpression>> = {
  fire: {
    stage1: {
      whenLight: {
        qualities: ['Courageous acceptance of call', 'Excitement for adventure', 'Faith in process'],
        gifts: ['Willingness to leave comfort', 'Trusts inner guidance', 'Embraces unknown'],
        manifestsAs: ['Leaving familiar behind with gratitude', 'Open to what\'s next', 'Starting journey with hope'],
        energyState: 'Threshold courage'
      },
      whenDark: {
        qualities: ['Refusing the call', 'Fear-based stagnation', 'Resentful obligation'],
        shadows: ['Waiting for perfect timing', 'Blaming circumstances', 'Martyrdom about sacrifice required'],
        manifestsAs: ['Staying in dying situations', 'Half-hearted starts', 'Bitterness about change'],
        warningSign: 'Resisting adventure out of fear'
      },
      goDeeper: {
        reflectionQuestions: ['What call am I refusing?', 'What am I leaving behind?', 'What excites and terrifies me about this threshold?'],
        integrationPractices: ['Threshold ritual', 'Fear inventory', 'Gratitude for what was'],
        transformationInvitations: ['Take one small step toward the call', 'Name the fear', 'Say goodbye to one old identity'],
        healingPathway: 'From refusal to courageous acceptance'
      }
    }
  },
  water: {
    stage2: {
      whenLight: {
        qualities: ['Facing shadow with courage', 'Owning projections', 'Retrieving inner gold'],
        gifts: ['Alchemizes demons into allies', 'Integrates disowned parts', 'Discovers true power'],
        manifestsAs: ['Shadow work without bypassing', 'Emotional mastery', 'Wisdom from wounds'],
        energyState: 'Descent into healing depths'
      },
      whenDark: {
        qualities: ['Drowning in shadow', 'Identifying as wound', 'Refusing to surface'],
        shadows: ['Victim identity', 'Endless processing without integration', 'Spiritual bypassing'],
        manifestsAs: ['Therapy as identity', 'Blaming past forever', 'Staying broken to feel special'],
        warningSign: 'Lost in underworld'
      },
      goDeeper: {
        reflectionQuestions: ['What demon is actually my ally?', 'What projection needs retrieval?', 'What gold have I discovered in my depths?'],
        integrationPractices: ['Shadow integration work', 'Somatic trauma release', 'Mentor guidance'],
        transformationInvitations: ['Name one demon and dialogue with it', 'Own one projection', 'Share one piece of inner gold'],
        healingPathway: 'From drowning in shadow to retrieving gold'
      }
    }
  },
  earth: {
    stage2: {
      whenLight: {
        qualities: ['Gathering resources wisely', 'Building alliances', 'Patient germination'],
        gifts: ['Strategic preparation', 'Community support', 'Systems that serve mission'],
        manifestsAs: ['Learning skills needed', 'Finding mentors and allies', 'Building sustainable foundation'],
        energyState: 'Germination beneath surface'
      },
      whenDark: {
        qualities: ['Hoarding resources', 'Refusing help', 'Endless preparation'],
        shadows: ['Never ready enough', 'Isolation as strength', 'Analysis paralysis'],
        manifestsAs: ['Preparing forever, never launching', 'Rejecting allies', 'Control through scarcity'],
        warningSign: 'Seed planted but refusing to sprout'
      },
      goDeeper: {
        reflectionQuestions: ['What resources do I truly need vs. hoard?', 'Who are my allies?', 'Am I germinating or avoiding?'],
        integrationPractices: ['Resource inventory', 'Alliance building', 'Launch timeline'],
        transformationInvitations: ['Ask for one resource you need', 'Accept help from one ally', 'Set one launch date'],
        healingPathway: 'From hoarding preparation to resourced action'
      }
    }
  },
  air: {
    stage3: {
      whenLight: {
        qualities: ['Sharing wisdom earned', 'Healing community', 'Transforming world'],
        gifts: ['Teaches from experience', 'Serves collective', 'Integrates journey into life'],
        manifestsAs: ['Elder wisdom shared', 'Community healing', 'Living integration'],
        energyState: 'Return as gift'
      },
      whenDark: {
        qualities: ['Preaching without practicing', 'Guru complex', 'Unintegrated teaching'],
        shadows: ['Expert identity without depth', 'Teaching to avoid learning', 'Savior complex'],
        manifestsAs: ['Do as I say, not as I do', 'Spiritual materialism', 'Fame-seeking through wisdom'],
        warningSign: 'Teaching unearned wisdom'
      },
      goDeeper: {
        reflectionQuestions: ['Have I lived what I teach?', 'Am I serving or performing?', 'What still needs integration?'],
        integrationPractices: ['Walk your talk audit', 'Anonymous service', 'Continued learning'],
        transformationInvitations: ['Embody one lesson before teaching it', 'Serve without being seen', 'Admit one area still unmastered'],
        healingPathway: 'From unearned teaching to lived wisdom'
      }
    }
  }
};

// ============== UTILITY FUNCTIONS ==============

/**
 * Get Light/Dark/Depth expression for an element
 */
export function getElementalExpression(element: SpiralogicElement): ElementalArchetype {
  return ELEMENTAL_LIGHT_DARK_SYSTEM[element];
}

/**
 * Get Light/Dark/Depth expression for a zodiac sign
 */
export function getZodiacExpression(sign: string): ArchetypalExpression | undefined {
  return ZODIAC_LIGHT_DARK_SYSTEM[sign.toLowerCase()];
}

/**
 * Get Light/Dark/Depth expression for Hero's Journey stage
 */
export function getHerosJourneyExpression(element: SpiralogicElement, stage: number): ArchetypalExpression | undefined {
  if (element === 'aether') return undefined;
  return HEROS_JOURNEY_LIGHT_DARK[element]?.[`stage${stage}`];
}

/**
 * Generate a prompt for user based on their current archetypal state
 */
export function generateArchetypalPrompt(
  element: SpiralogicElement,
  state: 'light' | 'dark' | 'transition'
): string {
  const expression = ELEMENTAL_LIGHT_DARK_SYSTEM[element].expression;

  if (state === 'light') {
    return `You're embodying ${element} energy in its light expression. ${expression.whenLight.energyState}. Continue to: ${expression.whenLight.gifts[0]}.`;
  }

  if (state === 'dark') {
    return `${expression.whenDark.warningSign}. You may be experiencing ${element}'s shadow. ${expression.goDeeper.reflectionQuestions[0]}`;
  }

  // transition
  return `You're moving through ${element}'s transformation. ${expression.goDeeper.healingPathway}. Consider: ${expression.goDeeper.transformationInvitations[0]}`;
}

/**
 * Get integration practices for current state
 */
export function getIntegrationPractices(element: SpiralogicElement): string[] {
  return ELEMENTAL_LIGHT_DARK_SYSTEM[element].expression.goDeeper.integrationPractices;
}

/**
 * Get reflection questions for current archetype
 */
export function getReflectionQuestions(element: SpiralogicElement): string[] {
  return ELEMENTAL_LIGHT_DARK_SYSTEM[element].expression.goDeeper.reflectionQuestions;
}
