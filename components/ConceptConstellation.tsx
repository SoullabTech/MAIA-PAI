"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// D3 types
type D3Node = {
  id: string
  name: string
  category: string
  mentionCount: number
  firstMentioned: string
  lastMentioned: string
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

type D3Link = {
  source: string | D3Node
  target: string | D3Node
  strength: number
}

interface Concept {
  id: string
  name: string
  category: string
  mentionCount: number
  relatedConcepts: string[]
  firstMentioned: string
  lastMentioned: string
  definition?: string
}

interface ConceptConstellationProps {
  userId?: string
  category?: string
  minMentions?: number
  refreshInterval?: number
  interactive?: boolean
  showLabels?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  technical: "#4A90E2",
  philosophical: "#9B59B6",
  emotional: "#FF6B9D",
  archetypal: "#FFD700",
  elemental: "#7DD3C0",
}

export default function ConceptConstellation({
  userId,
  category,
  minMentions = 2,
  refreshInterval = 60000,
  interactive = true,
  showLabels = true,
}: ConceptConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // D3-style force simulation (lightweight implementation)
  const nodesRef = useRef<D3Node[]>([])
  const linksRef = useRef<D3Link[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    fetchConcepts()
    const interval = setInterval(fetchConcepts, refreshInterval)
    return () => clearInterval(interval)
  }, [userId, category, minMentions, refreshInterval])

  async function fetchConcepts() {
    try {
      const params = new URLSearchParams()
      if (category) params.append("category", category)
      if (minMentions) params.append("minMentions", minMentions.toString())
      if (userId) params.append("userId", userId)

      const res = await fetch(`/api/akashic/concepts?${params}`)
      const data = await res.json()
      setConcepts(data.concepts || [])
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch concepts:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!canvasRef.current || concepts.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const container = canvas.parentElement
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = 600
    }

    const width = canvas.width
    const height = canvas.height

    // Initialize nodes
    nodesRef.current = concepts.map((concept) => ({
      id: concept.id,
      name: concept.name,
      category: concept.category,
      mentionCount: concept.mentionCount,
      firstMentioned: concept.firstMentioned,
      lastMentioned: concept.lastMentioned,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    }))

    // Initialize links
    const linksList: D3Link[] = []
    concepts.forEach((concept) => {
      concept.relatedConcepts.forEach((relatedId) => {
        // Only create link if related concept exists
        if (concepts.find((c) => c.id === relatedId)) {
          linksList.push({
            source: concept.id,
            target: relatedId,
            strength: 0.5,
          })
        }
      })
    })
    linksRef.current = linksList

    // Force simulation parameters
    const centerX = width / 2
    const centerY = height / 2
    const centerStrength = 0.01
    const linkStrength = 0.3
    const linkDistance = 100
    const chargeStrength = -300
    const damping = 0.9

    // Simulation function
    function tick() {
      const nodes = nodesRef.current
      const links = linksRef.current

      // Apply forces
      nodes.forEach((node) => {
        // Centering force
        node.vx = (node.vx || 0) + (centerX - (node.x || 0)) * centerStrength
        node.vy = (node.vy || 0) + (centerY - (node.y || 0)) * centerStrength

        // Charge force (repulsion between nodes)
        nodes.forEach((other) => {
          if (node.id === other.id) return
          const dx = (other.x || 0) - (node.x || 0)
          const dy = (other.y || 0) - (node.y || 0)
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = chargeStrength / (dist * dist)
          node.vx = (node.vx || 0) + (dx / dist) * force
          node.vy = (node.vy || 0) + (dy / dist) * force
        })
      })

      // Link force
      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source)
        const target = nodes.find((n) => n.id === link.target)
        if (!source || !target) return

        const dx = (target.x || 0) - (source.x || 0)
        const dy = (target.y || 0) - (source.y || 0)
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = (dist - linkDistance) * linkStrength

        source.vx = (source.vx || 0) + (dx / dist) * force
        source.vy = (source.vy || 0) + (dy / dist) * force
        target.vx = (target.vx || 0) - (dx / dist) * force
        target.vy = (target.vy || 0) - (dy / dist) * force
      })

      // Update positions with damping
      nodes.forEach((node) => {
        if (node.fx !== null && node.fy !== null) {
          node.x = node.fx
          node.y = node.fy
          node.vx = 0
          node.vy = 0
        } else {
          node.vx = (node.vx || 0) * damping
          node.vy = (node.vy || 0) * damping
          node.x = (node.x || 0) + (node.vx || 0)
          node.y = (node.y || 0) + (node.vy || 0)

          // Boundary constraints
          node.x = Math.max(30, Math.min(width - 30, node.x))
          node.y = Math.max(30, Math.min(height - 30, node.y))
        }
      })

      render()
    }

    function render() {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw links
      ctx.strokeStyle = "rgba(212, 175, 55, 0.2)"
      ctx.lineWidth = 1
      linksRef.current.forEach((link) => {
        const source = nodesRef.current.find((n) => n.id === link.source)
        const target = nodesRef.current.find((n) => n.id === link.target)
        if (!source || !target || !source.x || !target.x) return

        ctx.beginPath()
        ctx.moveTo(source.x, source.y || 0)
        ctx.lineTo(target.x, target.y || 0)
        ctx.stroke()
      })

      // Draw nodes
      nodesRef.current.forEach((node) => {
        if (!node.x || !node.y) return

        const radius = Math.min(30, 10 + Math.sqrt(node.mentionCount) * 3)
        const color = CATEGORY_COLORS[node.category] || "#7DD3C0"
        const isHovered = hoveredNode === node.id
        const isSelected = selectedConcept?.id === node.id

        // Glow effect for hovered/selected
        if (isHovered || isSelected) {
          ctx.shadowColor = color
          ctx.shadowBlur = 20
        } else {
          ctx.shadowBlur = 0
        }

        // Draw node circle
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fill()

        // Draw border
        if (isSelected) {
          ctx.strokeStyle = "#D4AF37"
          ctx.lineWidth = 3
          ctx.stroke()
        }

        ctx.shadowBlur = 0

        // Draw label if enabled
        if (showLabels || isHovered || isSelected) {
          ctx.fillStyle = "#D4AF37"
          ctx.font = isSelected ? "14px sans-serif" : "12px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(node.name, node.x, node.y + radius + 15)
        }

        // Draw mention count
        ctx.fillStyle = "#fff"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(node.mentionCount.toString(), node.x, node.y)
      })
    }

    // Start animation
    function animate() {
      tick()
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [concepts, hoveredNode, selectedConcept, showLabels])

  // Mouse interaction
  useEffect(() => {
    if (!interactive || !canvasRef.current) return

    const canvas = canvasRef.current

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Find node under cursor
      const node = nodesRef.current.find((n) => {
        if (!n.x || !n.y) return false
        const radius = Math.min(30, 10 + Math.sqrt(n.mentionCount) * 3)
        const dx = x - n.x
        const dy = y - n.y
        return dx * dx + dy * dy < radius * radius
      })

      setHoveredNode(node?.id || null)
      canvas.style.cursor = node ? "pointer" : "default"
    }

    function handleClick(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Find node under cursor
      const node = nodesRef.current.find((n) => {
        if (!n.x || !n.y) return false
        const radius = Math.min(30, 10 + Math.sqrt(n.mentionCount) * 3)
        const dx = x - n.x
        const dy = y - n.y
        return dx * dx + dy * dy < radius * radius
      })

      if (node) {
        const concept = concepts.find((c) => c.id === node.id)
        setSelectedConcept(concept || null)
      } else {
        setSelectedConcept(null)
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("click", handleClick)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleClick)
    }
  }, [concepts, interactive])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] border border-[#D4AF37]/20 rounded-lg bg-black/20">
        <div className="text-[#D4AF37]/60 text-sm">Mapping constellation...</div>
      </div>
    )
  }

  if (concepts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] border border-[#D4AF37]/20 rounded-lg bg-black/20">
        <div className="text-center space-y-2">
          <div className="text-[#D4AF37]/60 text-sm">No concepts discovered yet</div>
          <div className="text-[#D4AF37]/40 text-xs">
            Concepts emerge as you journal and converse
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-light font-cinzel text-[#D4AF37]">
            Concept Constellation
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {concepts.length} concepts · Connected by resonance
          </p>
        </div>

        {/* Legend */}
        <div className="flex gap-3 text-xs">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-400 capitalize">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative border border-[#D4AF37]/20 rounded-lg overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <canvas ref={canvasRef} className="w-full" />

        {/* Hint overlay */}
        {!selectedConcept && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-[#D4AF37]/40 text-xs">
            Click a node to explore · Hover for details
          </div>
        )}
      </div>

      {/* Selected Concept Detail Panel */}
      <AnimatePresence>
        {selectedConcept && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border border-[#D4AF37]/30 rounded-lg p-6 bg-black/30 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-[#D4AF37] mb-1">
                  {selectedConcept.name}
                </h4>
                <div className="flex gap-3 text-xs text-gray-400">
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${
                        CATEGORY_COLORS[selectedConcept.category]
                      }20`,
                      color: CATEGORY_COLORS[selectedConcept.category],
                    }}
                  >
                    {selectedConcept.category}
                  </span>
                  <span>{selectedConcept.mentionCount} mentions</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedConcept(null)}
                className="text-gray-500 hover:text-[#D4AF37] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {selectedConcept.definition && (
              <p className="text-sm text-gray-300 mb-4">
                {selectedConcept.definition}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-gray-500 mb-1">First mentioned</div>
                <div className="text-[#D4AF37]">
                  {new Date(selectedConcept.firstMentioned).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Last mentioned</div>
                <div className="text-[#D4AF37]">
                  {new Date(selectedConcept.lastMentioned).toLocaleDateString()}
                </div>
              </div>
            </div>

            {selectedConcept.relatedConcepts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#D4AF37]/20">
                <div className="text-xs text-gray-500 mb-2">
                  Connected to {selectedConcept.relatedConcepts.length} other
                  concepts
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedConcept.relatedConcepts.map((relatedId) => {
                    const related = concepts.find((c) => c.id === relatedId)
                    if (!related) return null
                    return (
                      <button
                        key={relatedId}
                        onClick={() => setSelectedConcept(related)}
                        className="text-xs px-2 py-1 rounded bg-black/40 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors"
                      >
                        {related.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 text-center text-xs">
        <div className="p-3 rounded-lg bg-black/20 border border-[#D4AF37]/10">
          <div className="text-[#D4AF37] font-medium">{concepts.length}</div>
          <div className="text-gray-500 mt-1">Concepts</div>
        </div>
        <div className="p-3 rounded-lg bg-black/20 border border-[#D4AF37]/10">
          <div className="text-[#D4AF37] font-medium">
            {linksRef.current.length}
          </div>
          <div className="text-gray-500 mt-1">Connections</div>
        </div>
        <div className="p-3 rounded-lg bg-black/20 border border-[#D4AF37]/10">
          <div className="text-[#D4AF37] font-medium">
            {concepts.reduce((sum, c) => sum + c.mentionCount, 0)}
          </div>
          <div className="text-gray-500 mt-1">Total Mentions</div>
        </div>
        <div className="p-3 rounded-lg bg-black/20 border border-[#D4AF37]/10">
          <div className="text-[#D4AF37] font-medium">
            {new Set(concepts.map((c) => c.category)).size}
          </div>
          <div className="text-gray-500 mt-1">Categories</div>
        </div>
      </div>
    </div>
  )
}
