#!/bin/bash

# Elemental Alchemy - AI Art Prompt Generator
# Generates Midjourney/DALL-E prompts for all key illustrations

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
OUTPUT_DIR="$SCRIPT_DIR/ai-art-prompts"

mkdir -p "$OUTPUT_DIR"

echo "🎨 Generating AI Art Prompts for Elemental Alchemy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================
# SACRED GEOMETRY PROMPTS
# ============================================

cat > "$OUTPUT_DIR/sacred-geometry.txt" << 'EOF'
# SACRED GEOMETRY ILLUSTRATIONS
# For Midjourney v6 or DALL-E 3

## The Torus (Primary Sacred Geometry)

### Version 1: Full Detail
A luminous torus energy field showing the flow of consciousness, golden amber light descending through the upper funnel representing manifestation, deep blue-purple light ascending through the lower funnel representing spirit returning to source, radial perspective grid lines emanating from the center showing the field of awareness, ethereal desert atmosphere with sandy gold (#d4b896) and emerald (#10B981) color accents, sacred geometry art style, highly detailed with visible energy flow patterns, 4K resolution, cinematic mystical lighting, viewed from a slight angle to show depth and dimensionality --ar 2:3 --style raw --v 6

### Version 2: Simplified Diagram
Clean sacred geometry diagram of a torus field, golden light pathway descending (labeled), blue-purple light pathway ascending (labeled), consciousness field grid, minimal color palette of sandy gold and emerald on deep purple background, educational diagram style but mystical, vector-quality clarity, suitable for book illustration --ar 16:9 --style raw

### Version 3: Meditative
Softly glowing torus in meditation space, gentle golden and blue energies flowing, peaceful desert twilight atmosphere, figure in silhouette meditating at the center of the torus field, transcendent and calming, warm color palette, spiritual photography style --ar 4:5

## The Dragonfly (Metamorphosis Symbol)

### Version 1: Mystical Detailed
Sacred dragonfly with four luminous wings representing the four elements (fire-gold wing top left, water-blue wing bottom left, earth-green wing bottom right, air-silver wing top right), hovering in perfect stillness above desert sand, colored spheres of light pulsing outward from the dragonfly in concentric circles, each sphere containing sacred geometry patterns (triangle for fire, inverted triangle for water, etc.), iridescent wings catching golden hour desert light, background of distant purple mountains, mandala pattern subtle in the sky behind, mystical realism art style, extremely high detail, magical atmosphere --ar 2:3 --v 6

### Version 2: Icon/Symbol
Elegant dragonfly symbol in sacred geometry style, four wings clearly defined with elemental symbols integrated, suitable for chapter headers, clean vector design, sandy gold and emerald colors on deep purple, minimal but powerful --ar 1:1 --style raw

## The Dodecahedron (Fifth Element - Aether)

### Version 1: Cosmic Unity
Luminous dodecahedron floating in cosmic space, each of the 12 pentagonal faces glowing with different colored light representing unified spectrum, all four elemental energies (fire/gold, water/blue, earth/green, air/silver) flowing INTO the dodecahedron and merging into pure white-gold light at center, representing aether/quintessence, deep purple cosmic background with distant stars and galaxies, sacred geometry overlays showing how the dodecahedron contains all other Platonic solids, transcendent and infinite atmosphere, divine unity visualization, ethereal and mystical, 4K detail --ar 1:1 --v 6

### Version 2: Geometric Study
Clean technical illustration of a dodecahedron showing geometric perfection, golden ratio proportions visible, pentagonal symmetry highlighted, sacred geometry educational diagram, sandy gold wireframe on deep purple background --ar 4:3 --style raw

## Sacred Spirals

### Version 1: Golden Ratio Spiral
Fibonacci spiral in golden light emerging from desert sand, golden ratio proportions clearly visible (1.618), spiral expanding outward showing growth and evolution, subtle grid showing the mathematical perfection, sandy desert landscape with purple twilight sky, mystical mathematics visualization, beautiful and precise --ar 16:9 --style raw

### Version 2: Multiple Frequency Spirals
Three spirals interweaving - golden spiral (slow expansion), Fibonacci spiral (organic growth), and logarithmic spiral (consciousness evolution), each in different color (gold, emerald, silver), emanating from single point, showing how different timestreams of transformation breathe together, sacred geometry meets fractal art, mesmerizing and complex --ar 2:3 --v 6

## The Trinity Framework

### Version 1: Sacred Circles
Three equal circles arranged in triangle formation, overlapping to create vesica piscis shapes between them, top circle labeled "AGENT" (initiating force) glowing gold, bottom left circle labeled "AGENCY" (creative medium) glowing emerald, bottom right circle labeled "MANIFESTATION" (result) glowing silver, central overlap area where all three meet glowing brilliant white, flowing energy lines connecting all three, clean sacred geometry diagram with Dune aesthetic colors, mystical but clear and educational --ar 4:3 --style raw

### Version 2: Dynamic Energy
Same trinity structure but showing active energy flow, streams of light flowing from Agent through Agency to Manifestation and back in continuous cycle, more atmospheric and alive, representing the living process of creation --ar 4:3 --v 6

EOF

echo "✅ Sacred Geometry prompts created"

# ============================================
# ELEMENTAL CHAPTER PROMPTS
# ============================================

cat > "$OUTPUT_DIR/element-fire.txt" << 'EOF'
# FIRE ELEMENT ILLUSTRATIONS

## Chapter Opener: The Sacred Flame

### Version 1: Campfire Gathering
Desert night scene, ceremonial campfire burning in the center, flames rising and transforming into geometric patterns and sacred triangles, small group of people sitting in circle around fire in silhouette (representing community), warm golden and orange firelight illuminating the scene, star-filled deep purple sky above, sense of transformation and spiritual awakening, cinematic photography style, Dune aesthetic with sandy tones, mystical and inviting atmosphere, 4K detail --ar 16:9 --v 6

### Version 2: Transformative Flame
Single candle flame close-up transforming into sacred geometry, flame morphing into upward-pointing triangle (fire symbol), golden light radiating outward in geometric patterns, deep purple-black background, meditation and transformation energy, spiritual minimalism, highly detailed flame texture --ar 2:3 --style raw

## Fire States Diagram

### Three States of Fire (Single Comprehensive Image)
Vertical diagram showing three states of fire transformation: TOP THIRD shows "Activating/Self-Awareness" with small emerging flame and upward arrow, MIDDLE THIRD shows "Amplifying/Performance" with large blazing fire and expanding energy, BOTTOM THIRD shows "Actualizing/Transcendence" with flame becoming pure light and ascending, connecting arrows showing progression, clean educational diagram with mystical aesthetic, labels in elegant typography, sandy gold and orange on deep purple background --ar 2:3 --style raw

### Individual State 1: Activating
Small candle being lit, spark of awareness, beginning flame, "awakening" energy, morning light quality, potential and initiation --ar 4:3

### Individual State 2: Amplifying
Large campfire blazing, active transformation, performance and expression, noon sun quality, full engagement --ar 4:3

### Individual State 3: Actualizing
Flame becoming pure radiant light, transcendence and integration, sunset golden hour quality, completion and wisdom --ar 4:3

## Fire's Shadow Aspects

Dark flame with smoke representing burnout, impulsiveness, scattered energy, chaotic fire out of control, warning/cautionary tone but still artistic, showing the destructive potential when fire element is unbalanced --ar 16:9 --v 6

## Fire Practices

Person meditating with visualization of inner flame at solar plexus, warm golden light emanating from center, peaceful practice setting with candles, guidance for fire meditation, serene and instructional --ar 4:5

EOF

echo "✅ Fire element prompts created"

cat > "$OUTPUT_DIR/element-water.txt" << 'EOF'
# WATER ELEMENT ILLUSTRATIONS

## Chapter Opener: Emotional Depths

### Version 1: Ocean Depths
Underwater scene looking up toward light, shafts of blue-green light penetrating from surface above, inverted triangle sacred geometry (water symbol) glowing with emerald light in the mid-depths, flowing water currents forming gentle spiral patterns, sense of emotional depth and inner exploration, peaceful yet profound atmosphere, deep blues and turquoise with emerald accents, spiritual underwater photography, serene and contemplative --ar 2:3 --v 6

### Version 2: Flowing River
Desert stream flowing through canyon, water reflecting golden light, inverted triangle sacred geometry in the water's surface, flow and adaptability, life-giving water in desert, continuity and persistence --ar 16:9 --style raw

## Water States Diagram

### Three States of Water (Single Image)
Diagram showing: TOP "Being/Inner Awareness" with still calm water surface (mirror-like), MIDDLE "Balancing/Inner Coherence" with gentle waves and flow, BOTTOM "Becoming/Transcendent Being" with water transforming into mist rising toward sky, vertical progression, educational yet mystical, emerald and blue colors on deep purple background --ar 2:3 --style raw

## Water Healing Practices

Person at edge of water, hands touching surface, reflection showing inner self, healing and introspection, peaceful water setting, moonlight quality, emotional intelligence and shadow work visualization --ar 4:5

EOF

echo "✅ Water element prompts created"

cat > "$OUTPUT_DIR/element-earth.txt" << 'EOF'
# EARTH ELEMENT ILLUSTRATIONS

## Chapter Opener: Grounded Manifestation

### Version 1: Ancient Roots
Massive ancient tree with roots forming sacred geometry patterns deep in rich brown soil, roots creating natural downward triangle with line (earth symbol), crystalline structures and gemstones visible in the earth around roots, desert mountain landscape visible above ground, sense of stability, growth, and manifestation, brown and green earth tones with sandy gold highlights, mystical nature photography, grounding and nurturing energy --ar 2:3 --v 6

### Version 2: Mountain Formation
Majestic desert mountain at sunset, rock formations showing geometric patterns, sense of timeless stability and grounded presence, earth as foundation, solid and enduring --ar 16:9 --style raw

## Earth States Diagram

### Three States of Earth
TOP "Cultivating/Mission & Purpose" with seeds being planted in soil, MIDDLE "Crystallizing/Resources & Development" with seedling growing and root system forming, BOTTOM "Clarifying/Perfected Form" with mature plant ready to share medicine with world, growth cycle diagram, educational and beautiful, earth tones with sandy gold --ar 2:3 --style raw

## Earth Medicine Practices

Hands in garden soil, planting or harvesting, connection to earth's wisdom, practical grounding, morning light, earth-based spiritual practice, nurturing and productive --ar 4:5

EOF

echo "✅ Earth element prompts created"

cat > "$OUTPUT_DIR/element-air.txt" << 'EOF'
# AIR ELEMENT ILLUSTRATIONS

## Chapter Opener: Intellectual Clarity

### Version 1: Sky Patterns
Vast expansive sky with clouds forming geometric patterns, sacred triangles with horizontal line (air symbol) floating through atmosphere, light and airy quality, communication symbols and sacred language glyphs forming in cloud patterns, sense of perspective and clarity, pale blue and silver tones with sandy gold sun rays, ethereal and expansive, intellectual freedom and connection visualization --ar 2:3 --v 6

### Version 2: Wind Patterns
Desert wind creating sand patterns, movement of air made visible, sacred geometry in wind currents, communication and connection between distant points, clarity of thought --ar 16:9 --style raw

## Air States Diagram

### Three States of Air
TOP "Directing/Initiating Ideas" with single bright thought emerging, MIDDLE "Developing/Knowledge Expansion" with ideas multiplying and connecting in network, BOTTOM "Discerning/Integrated Wisdom" with all knowledge synthesized into unified understanding, thought progression, intellectual evolution, light and clear colors --ar 2:3 --style raw

## Air Practices

Two people in meaningful conversation, visible sacred geometry in the space between them representing deep communication and dialectic synthesis, intellectual and relational connection, collaborative wisdom --ar 4:5

EOF

echo "✅ Air element prompts created"

cat > "$OUTPUT_DIR/element-aether.txt" << 'EOF'
# AETHER ELEMENT ILLUSTRATIONS

## Chapter Opener: Infinite Unity

### Version 1: Cosmic Integration
Deep cosmic space with luminous dodecahedron at center, all four elemental energies (fire/gold flames, water/blue currents, earth/green crystals, air/silver wisps) flowing INTO the dodecahedron and merging, rainbow spectrum of light integrating into unified golden-white radiance, sacred geometry mandala encompassing the entire scene, stars and galaxies forming sacred patterns, transcendent and infinite atmosphere, deep purple space with emerald and golden light, divine unity and wholeness, mystical transcendence, consciousness itself visualized, 4K detail --ar 1:1 --v 6

### Version 2: The Unified Field
All five elements arranged in perfect harmony - fire (top/spirit), water (bottom/emotion), earth (bottom left/body), air (bottom right/mind), aether (center/unity), connected by flowing energy, quintessence visualization, integration and balance --ar 1:1 --style raw

## Aether Meditation

Person in deep meditation, transparent body showing all chakras aligned and glowing, aura expanding to cosmic proportions, individual consciousness merging with universal consciousness, transcendent unity experience, spiritual awakening peak, luminous and ethereal --ar 4:5 --v 6

EOF

echo "✅ Aether element prompts created"

# ============================================
# DIAGRAMS AND EDUCATIONAL VISUALS
# ============================================

cat > "$OUTPUT_DIR/diagrams.txt" << 'EOF'
# EDUCATIONAL DIAGRAMS & CHARTS

## Spiralogic Process Map (MAIN SYSTEM DIAGRAM)

Comprehensive sacred spiral diagram showing complete Spiralogic system, three interweaving spirals (cardinal/fixed/mutable phases) in golden, emerald, and silver colors, all four elements (fire, water, earth, air) positioned at key points around spirals with their symbols, arrows showing progression and flow between states, clear labels for each phase and transition, golden ratio mathematical proportions visible in spiral structure, consciousness evolution pathway from initiation to integration, sandy gold and emerald color scheme on deep purple background, professional infographic quality but mystical aesthetic, suitable for book centerpiece illustration, highly detailed but clean and educational --ar 16:9 --style raw

## Hemispheric Brain Functions

Split brain diagram showing left and right hemispheres with elemental correspondences: LEFT SIDE showing Air (prefrontal cortex/logic) and Earth (left hemisphere/practical organization), RIGHT SIDE showing Fire (right prefrontal/creativity) and Water (right hemisphere/emotions), connections and integration between all parts, clean medical illustration style but with sacred geometry overlays, educational and clear --ar 16:9 --style raw

## The Web of Life / Interconnection

Glowing network of nodes and connections forming web pattern, each node representing a being or consciousness point, connections between all points showing interdependence, fractal self-similarity (small webs within larger web), cosmic scale showing how all life is interconnected, emerald and gold light on deep purple space background, mystical network visualization --ar 16:9 --v 6

## Transformation Cycles

Circular diagram showing continuous cycle: Encountering Challenges → Gaining Insights → Integrating Wisdom → Refinement/Growth → (repeat), arrows showing clockwise flow, four seasons or phases marked, spiral overlay showing how each cycle elevates consciousness, educational but beautiful --ar 1:1 --style raw

## Elemental Correspondences Table

Visual table/chart showing correspondences between:
- Elements (Fire, Water, Earth, Air, Aether)
- Alchemical operations (Calcinatio, Solutio, Coagulatio, Sublimatio, Coniunctio)
- Zodiac signs (Aries/Leo/Sag, Cancer/Scorpio/Pisces, Cap/Taurus/Virgo, Libra/Aquarius/Gemini)
- Life domains (Spirit, Emotion, Body, Mind, Unity)
- States/Qualities

Clean infographic design, color-coded by element, easy to reference, professional book illustration quality --ar 16:9 --style raw

EOF

echo "✅ Diagram prompts created"

# ============================================
# DECORATIVE ELEMENTS
# ============================================

cat > "$OUTPUT_DIR/decorative.txt" << 'EOF'
# DECORATIVE ELEMENTS

## Section Break Ornament
Horizontal decorative element featuring sacred geometry pattern, elemental symbols arranged symmetrically, sandy gold and emerald on transparent/deep purple, suitable for breaks between major sections, elegant and mystical, vector quality --ar 16:1 --style raw

## Chapter Number Ornaments
Stylized numbers 1-10 integrated with their associated elemental symbols and sacred geometry, can be used for chapter numbers, artistic typography meets sacred art --ar 1:1 (create set)

## Border Elements
Repeating sacred geometry pattern suitable for page borders or frames, subtle but elegant, Dune color palette, can tile seamlessly --ar 4:1 --style raw

## Elemental Symbol Set
Clean vector-quality symbols for Fire (△), Water (▽), Earth (▽—), Air (△—), Aether (pentagram or dodecahedron), in sandy gold on transparent background, suitable for inline text or margin notes --ar 1:1 --style raw

EOF

echo "✅ Decorative element prompts created"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ AI Art Prompts Generated!"
echo ""
echo "📁 Output directory: $OUTPUT_DIR"
echo ""
echo "Files created:"
echo "  • sacred-geometry.txt    - Core sacred geometry (torus, dragonfly, etc.)"
echo "  • element-fire.txt       - All Fire chapter illustrations"
echo "  • element-water.txt      - All Water chapter illustrations"
echo "  • element-earth.txt      - All Earth chapter illustrations"
echo "  • element-air.txt        - All Air chapter illustrations"
echo "  • element-aether.txt     - All Aether chapter illustrations"
echo "  • diagrams.txt           - Educational diagrams and charts"
echo "  • decorative.txt         - Borders, ornaments, symbols"
echo ""
echo "🎨 How to use:"
echo "  1. Open Midjourney or DALL-E"
echo "  2. Copy prompts from these files"
echo "  3. Generate images"
echo "  4. Select best variations"
echo "  5. Upscale to 300 DPI for print"
echo "  6. Save to assets/images/"
echo ""
echo "💡 Pro tip: Generate 4-5 variations of each, then pick best!"
echo ""
