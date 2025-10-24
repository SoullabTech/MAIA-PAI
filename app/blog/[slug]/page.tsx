'use client';

/**
 * Individual Blog Post Page
 * Full article view with rich content and navigation
 */

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SOULLAB_COLORS } from '@/lib/soullab-theme';

interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  authorRole: string;
  authorBio: string;
  publishedDate: string;
  readTime: string;
  element: 'fire' | 'air' | 'water' | 'earth' | 'aether';
  category: string;
  tags: string[];
}

// Sample full blog posts
const BLOG_POSTS: Record<string, BlogPost> = {
  'fire-element-transformation': {
    id: 'fire-element-transformation',
    title: 'The Fire Element',
    subtitle: 'Igniting Your Creative Power',
    content: `
## The Spark of Transformation

Fire is the first element in our journey through elemental alchemy. It represents **vision, creation, and transformation** — the spark that ignites all change and fuels our journey of awakening.

### Understanding the Fire Element

In ancient wisdom traditions, Fire has always been associated with:

- **Vision and Inspiration**: The flash of insight that illuminates new possibilities
- **Creative Power**: The generative force that brings ideas into manifestation
- **Transformation**: The alchemical heat that burns away the old to make space for the new
- **Willpower**: The inner flame that drives us forward despite obstacles

### The Neuroscience of Fire

Modern neuroscience reveals fascinating correlations with these ancient teachings. When we experience moments of inspiration or creative breakthrough, specific neural networks activate:

The **Default Mode Network** quiets down, allowing the **Salience Network** to highlight novel patterns and connections. This creates the "aha!" moment — that spark of Fire that changes everything.

Studies using fMRI scans show that during creative states, increased activity occurs in:
- The prefrontal cortex (executive function and vision)
- The anterior cingulate cortex (integrating emotions with cognition)
- The hippocampus (making new neural connections)

### Embodying Fire: Practical Exercises

**1. Morning Fire Visualization (5 minutes)**

Sit comfortably and close your eyes. Imagine a small flame at your solar plexus. With each breath, see it grow brighter and warmer. Ask yourself: "What wants to be created through me today?"

**2. Creative Fire Writing (10 minutes)**

Set a timer and write continuously without editing. Let your hand move like flames dancing — wild, free, and uncontrolled. This practice awakens your creative Fire.

**3. Vision Board Activation**

Create a visual representation of what you're calling into being. Use warm colors — reds, oranges, golds. Place it where you'll see it daily.

### Working with Fire's Shadow

Like all elements, Fire has shadow aspects:

- **Burnout**: Too much Fire consumes itself
- **Destructive Rage**: Uncontrolled Fire destroys rather than transforms
- **Manic Energy**: Fire without grounding becomes scattered

The key is **contained intensity** — like a blacksmith's forge, focused and directed.

### Integration Practice

This week, notice:
- When do you feel most creatively alive?
- What ignites your passion?
- Where might you need more Fire? Where less?

Journal your observations. The Fire element rewards attention with increased vitality and vision.

## Next Steps

Fire is just the beginning. Next, we'll explore the **Air Element** — the power of clarity, communication, and breath.

*May your inner flame burn bright and true.*
    `,
    author: 'Dr. Sarah Chen',
    authorRole: 'Elemental Researcher',
    authorBio: 'Dr. Chen holds a PhD in Contemplative Neuroscience from Stanford and has spent 15 years studying the intersection of ancient wisdom and modern brain science.',
    publishedDate: '2025-01-15',
    readTime: '8 min read',
    element: 'fire',
    category: 'Elemental Wisdom',
    tags: ['fire element', 'transformation', 'neuroscience', 'practice']
  },
  'neuroscience-of-consciousness': {
    id: 'neuroscience-of-consciousness',
    title: 'The Neuroscience of Awakening',
    subtitle: 'How Your Brain Changes During Transformation',
    content: `
## The Brain That Changes Itself

Recent neuroscience research has revealed something extraordinary: **consciousness transformation physically rewires your brain**.

This isn't metaphorical. Contemplative practices literally change your neural architecture.

### Neuroplasticity and Awakening

The discovery of neuroplasticity revolutionized our understanding of the brain. We now know that:

- New neural pathways form throughout life
- Meditation increases cortical thickness in key areas
- Compassion practices strengthen emotional regulation circuits
- Mindfulness reduces activity in the Default Mode Network

### The Default Mode Network

The DMN is your brain's "autopilot" — the network active when you're lost in thought, planning, or ruminating. It's also the neural correlate of the "ego" or "separate self."

Studies show that experienced meditators have:
- Reduced DMN activity (less mind-wandering)
- Stronger connectivity between DMN and attention networks
- Enhanced ability to "decouple" from automatic thoughts

This is the neuroscience of "non-identification" — a core aspect of awakening.

### The Salience Network

While the DMN decreases, the Salience Network becomes more refined. This network:

- Detects what's important in the present moment
- Integrates internal and external awareness
- Facilitates "flow states"

Enhanced salience processing allows you to perceive reality more directly, less filtered through conceptual overlays.

### Gamma Waves and Unity Consciousness

High-amplitude gamma oscillations (25-100 Hz) have been observed in advanced meditators during states of:

- Non-dual awareness
- Compassion meditation
- Moments of "oneness"

These gamma waves represent **synchronization across brain regions** — literally, different parts of your brain working in harmony.

### The Anterior Cingulate Cortex

The ACC acts as a bridge between thinking and feeling. Contemplative practices strengthen this area, enhancing:

- Emotional regulation
- Conflict monitoring
- Integration of cognition and emotion
- Empathy and compassion

### Practical Applications

**Week 1: Attention Training**
Practice focused attention for 10 minutes daily. Watch the breath. When mind wanders, gently return. This strengthens attention circuits.

**Week 2: Open Awareness**
Shift to "choiceless awareness" — simply being present to whatever arises. This reduces DMN activity.

**Week 3: Loving-Kindness**
Practice metta meditation. Research shows this increases left prefrontal cortex activity (associated with positive emotions) and compassion circuits.

**Week 4: Integration**
Combine all three modes. Notice how your experience of reality shifts.

### The Integration Challenge

Peak experiences are powerful but temporary. The real transformation happens through:

1. **Consistent practice** (neuroplasticity requires repetition)
2. **Embodied integration** (bringing insights into daily life)
3. **Community support** (social connection enhances learning)

### Looking Forward

We're at the dawn of understanding consciousness scientifically. Future research will likely reveal:

- More precise maps of awakening stages
- Optimized practice protocols
- Integration of ancient wisdom and modern technology

The brain you have today is not the brain you'll have in six months — if you practice.

*Your consciousness is not fixed. It's a skill you can develop.*
    `,
    author: 'Marcus Webb',
    authorRole: 'Neuroscientist',
    authorBio: 'Marcus is a cognitive neuroscientist specializing in contemplative neuroscience. He bridges rigorous scientific research with practical wisdom from meditation traditions.',
    publishedDate: '2025-01-12',
    readTime: '12 min read',
    element: 'air',
    category: 'Science & Spirit',
    tags: ['neuroscience', 'brain', 'meditation', 'awakening', 'research']
  },
  'water-element-flow': {
    id: 'water-element-flow',
    title: 'Flow Like Water',
    subtitle: 'Embracing Emotional Intelligence',
    content: `
## The Wisdom of Water

Water is the element of **emotion, intuition, and adaptability**. It teaches us perhaps the most important lesson: how to flow with life rather than resist it.

### What Water Teaches Us

> "Be like water making its way through cracks. Do not be assertive, but adjust to the object, and you shall find a way around or through it." — Bruce Lee

Water shows us:

- **Adaptability**: Water takes the shape of its container while remaining itself
- **Power in Yielding**: The softest substance overcomes the hardest
- **Emotional Flow**: Feelings move like currents — to be felt, not resisted
- **Depth**: Still waters run deep; superficial flow misses the richness below

### Emotional Intelligence as Water Practice

In modern terms, Water element mastery is **emotional intelligence**:

1. **Self-Awareness**: Recognizing your emotional states
2. **Self-Regulation**: Allowing emotions to flow without being overwhelmed
3. **Empathy**: Sensing the emotional currents in others
4. **Social Skills**: Navigating relationships with grace

### The Shadow of Suppressed Water

When we dam our emotional waters:

- Depression (stagnant pools)
- Emotional flooding (burst dams)
- Numbness (frozen water)
- Turbulence (unprocessed emotions)

Water must flow. The question is: consciously or unconsciously?

### Practices for Embodying Water

**1. Emotional Weather Check (Morning)**

Sit quietly and ask: "What's the weather of my emotional body right now?"

Don't judge or change it. Just notice. Sunny? Stormy? Foggy? This builds emotional literacy.

**2. Somatic Releasing (Evening)**

Emotions live in the body. Practice gentle movement:
- Sway like seaweed in current
- Shake like water droplets
- Flow with spontaneous movement

Let the body express what words cannot.

**3. Crying Practice**

Yes, practice crying. Not forcing, but allowing. Tears are water's way of cleansing.

Put on music that moves you. Let yourself feel. Cry if tears come. This is not weakness — it's flow.

**4. Compassion Cultivation**

Water element includes compassion — the ability to feel with others.

Practice: Think of someone struggling. Place hand on heart. Feel whatever arises. Breathe with it.

### Water in Relationships

Relationships are where Water mastery shows itself:

- **Listening Deeply**: Like water, be still enough to reflect the other
- **Flexibility**: Adapt without losing your essence
- **Boundaries**: Water needs containers; learn when to flow and when to hold form
- **Forgiveness**: Resentment is frozen water; forgiveness lets it flow again

### Integration: Water Journaling

For one week, journal:

- What emotions arose today?
- Where did I resist flow? Where did I allow it?
- What does my intuition whisper?
- How can I honor my emotional depths?

### The Balance

Too much Water: Overwhelm, no boundaries, lost in emotion
Too little Water: Rigidity, disconnection, dryness

The goal: **Conscious flow** — feeling fully while maintaining presence.

## Next in the Series

We'll explore the **Earth Element** — grounding, structure, and manifestation.

*May you flow like water — powerful in your yielding, deep in your stillness.*
    `,
    author: 'Aria Thompson',
    authorRole: 'Embodiment Coach',
    authorBio: 'Aria specializes in somatic practices and emotional embodiment. She helps people reconnect with the wisdom of their bodies through movement and presence.',
    publishedDate: '2025-01-10',
    readTime: '6 min read',
    element: 'water',
    category: 'Elemental Wisdom',
    tags: ['water element', 'emotions', 'flow', 'emotional intelligence']
  }
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = BLOG_POSTS[slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4 text-white">Article Not Found</h1>
          <Link
            href="/blog"
            className="text-sm hover:underline"
            style={{ color: SOULLAB_COLORS.air }}
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const elementColor = SOULLAB_COLORS[post.element === 'aether' ? 'air' : post.element];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <header className="relative py-20 px-6 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(
              ellipse at top,
              ${elementColor}40 0%,
              transparent 60%
            )`
          }}
        />

        <div className="max-w-4xl mx-auto relative">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:underline"
            style={{ color: elementColor }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Category & Reading time */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-sm tracking-wider uppercase"
              style={{ color: elementColor }}
            >
              {post.category}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-sm text-gray-500">{post.readTime}</span>
            <span className="text-gray-600">•</span>
            <span className="text-sm text-gray-500">
              {new Date(post.publishedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-light mb-4 text-white">
            {post.title}
          </h1>

          {/* Subtitle */}
          <p className="text-2xl mb-8" style={{ color: elementColor }}>
            {post.subtitle}
          </p>

          {/* Author */}
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{ background: `${elementColor}20`, color: elementColor }}
            >
              {post.element === 'fire' || post.element === 'air' || post.element === 'aether' ? '△' : '▽'}
            </div>
            <div>
              <div className="text-white font-medium">{post.author}</div>
              <div className="text-sm text-gray-500">{post.authorRole}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Main content - rendered as markdown-style */}
          <div
            className="prose prose-invert prose-lg max-w-none"
            style={{
              '--tw-prose-headings': elementColor,
              '--tw-prose-links': elementColor,
              '--tw-prose-bold': 'white',
              '--tw-prose-quotes': elementColor
            } as any}
          >
            {post.content.split('\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2
                    key={i}
                    className="text-3xl font-light mt-12 mb-6"
                    style={{ color: elementColor }}
                  >
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3
                    key={i}
                    className="text-2xl font-light mt-8 mb-4"
                    style={{ color: elementColor }}
                  >
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote
                    key={i}
                    className="border-l-4 pl-6 italic my-8"
                    style={{ borderColor: elementColor, color: elementColor }}
                  >
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={i} className="text-gray-300 leading-relaxed ml-6">
                    {paragraph.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('<strong>').map((part, j) => {
                      if (j % 2 === 1) {
                        return <strong key={j} className="text-white">{part.replace('</strong>', '')}</strong>;
                      }
                      return part;
                    })}
                  </li>
                );
              }
              if (paragraph.startsWith('**')) {
                return (
                  <h4 key={i} className="text-xl font-medium mt-6 mb-3 text-white">
                    {paragraph.replace(/\*\*/g, '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                return (
                  <p
                    key={i}
                    className="text-center italic my-8"
                    style={{ color: elementColor }}
                  >
                    {paragraph.replace(/\*/g, '')}
                  </p>
                );
              }
              if (paragraph.trim()) {
                return (
                  <p key={i} className="text-gray-300 leading-relaxed mb-6">
                    {paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('<strong>').map((part, j) => {
                      if (j % 2 === 1) {
                        return <strong key={j} className="text-white">{part.replace('</strong>', '')}</strong>;
                      }
                      return part;
                    })}
                  </p>
                );
              }
              return null;
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-white/10">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full text-sm border"
                style={{
                  borderColor: `${elementColor}30`,
                  background: `${elementColor}08`,
                  color: elementColor
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Author Bio */}
      <section
        className="py-12 px-6"
        style={{ background: `${SOULLAB_COLORS.brown}40` }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="p-8 rounded-2xl border"
            style={{
              borderColor: `${elementColor}30`,
              background: `${elementColor}05`
            }}
          >
            <div className="flex items-start gap-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: `${elementColor}20`, color: elementColor }}
              >
                {post.element === 'fire' || post.element === 'air' || post.element === 'aether' ? '△' : '▽'}
              </div>
              <div>
                <h3 className="text-2xl font-light mb-2 text-white">About {post.author}</h3>
                <p className="text-sm mb-3" style={{ color: elementColor }}>
                  {post.authorRole}
                </p>
                <p className="text-gray-400 leading-relaxed">
                  {post.authorBio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related / More Articles CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h3
            className="text-3xl font-light mb-6"
            style={{ color: SOULLAB_COLORS.air }}
          >
            Continue Exploring
          </h3>
          <Link
            href="/blog"
            className="inline-block px-8 py-4 rounded-full border transition-all hover:scale-105"
            style={{
              borderColor: `${SOULLAB_COLORS.air}60`,
              background: `${SOULLAB_COLORS.air}10`,
              color: SOULLAB_COLORS.air
            }}
          >
            View All Articles
          </Link>
        </div>
      </section>
    </div>
  );
}
