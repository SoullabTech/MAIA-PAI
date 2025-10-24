"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Breakthrough {
  id: string
  title: string
  description: string
  element: string
  archetype: string
  significanceScore: number
  integrationStatus: "emerged" | "integrating" | "integrated" | "teaching"
  buildsOn: string[]
  leadsTo: string[]
  createdAt: string
  updatedAt: string
}

interface BreakthroughJourneyProps {
  userId?: string
  element?: string
  archetype?: string
  minSignificance?: number
  refreshInterval?: number
  layout?: "tree" | "radial"
}

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#FF6B35",
  Water: "#4A90E2",
  Earth: "#8B7355",
  Air: "#7DD3C0",
  Aether: "#9B59B6",
}

const STATUS_COLORS: Record<string, string> = {
  emerged: "#7DD3C0",
  integrating: "#4A90E2",
  integrated: "#9B59B6",
  teaching: "#FFD700",
}

const STATUS_LABELS: Record<string, string> = {
  emerged: "Emerging",
  integrating: "Integrating",
  integrated: "Integrated",
  teaching: "Teaching",
}

interface TreeNode {
  breakthrough: Breakthrough
  x: number
  y: number
  depth: number
  children: TreeNode[]
}

export default function BreakthroughJourney({
  userId,
  element,
  archetype,
  minSignificance = 0.5,
  refreshInterval = 60000,
  layout = "tree",
}: BreakthroughJourneyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [breakthroughs, setBreakthroughs] = useState<Breakthrough[]>([])
  const [selectedBreakthrough, setSelectedBreakthrough] = useState<Breakthrough | null>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Tree structure
  const treeRef = useRef<TreeNode[]>([])

  useEffect(() => {
    fetchBreakthroughs()
    const interval = setInterval(fetchBreakthroughs, refreshInterval)
    return () => clearInterval(interval)
  }, [userId, element, archetype, minSignificance, refreshInterval])

  async function fetchBreakthroughs() {
    try {
      const params = new URLSearchParams()
      if (element) params.append("element", element)
      if (archetype) params.append("archetype", archetype)
      if (minSignificance) params.append("minSignificance", minSignificance.toString())
      if (userId) params.append("userId", userId)

      const res = await fetch(`/api/akashic/breakthroughs?${params}`)
      const data = await res.json()
      setBreakthroughs(data.breakthroughs || [])
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch breakthroughs:", error)
      setLoading(false)
    }
  }

  // Build tree structure
  useEffect(() => {
    if (breakthroughs.length === 0) return

    // Find root nodes (no builds_on)
    const roots = breakthroughs.filter((b) => b.buildsOn.length === 0)

    // Build tree recursively
    function buildTree(breakthrough: Breakthrough, depth: number): TreeNode {
      const children = breakthroughs
        .filter((b) => b.buildsOn.includes(breakthrough.id))
        .map((child) => buildTree(child, depth + 1))

      return {
        breakthrough,
        x: 0,
        y: 0,
        depth,
        children,
      }
    }

    treeRef.current = roots.map((root) => buildTree(root, 0))
  }, [breakthroughs])

  // Layout and render
  useEffect(() => {
    if (!canvasRef.current || treeRef.current.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const container = canvas.parentElement
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = 700
    }

    const width = canvas.width
    const height = canvas.height

    if (layout === "tree") {
      layoutTree(width, height)
    } else {
      layoutRadial(width, height)
    }

    render(ctx, width, height)
  }, [breakthroughs, hoveredId, selectedBreakthrough, layout])

  function layoutTree(width: number, height: number) {
    // Calculate layout parameters
    const maxDepth = Math.max(
      ...treeRef.current.map((node) => getMaxDepth(node))
    )
    const verticalSpacing = height / (maxDepth + 2)
    const padding = 60

    // Position nodes
    function positionNode(
      node: TreeNode,
      startX: number,
      endX: number,
      y: number
    ) {
      node.x = (startX + endX) / 2
      node.y = y

      const childWidth = (endX - startX) / Math.max(1, node.children.length)
      node.children.forEach((child, i) => {
        const childStartX = startX + i * childWidth
        const childEndX = startX + (i + 1) * childWidth
        positionNode(child, childStartX, childEndX, y + verticalSpacing)
      })
    }

    treeRef.current.forEach((root, i) => {
      const startX = padding + (i * (width - 2 * padding)) / treeRef.current.length
      const endX = padding + ((i + 1) * (width - 2 * padding)) / treeRef.current.length
      positionNode(root, startX, endX, padding)
    })
  }

  function layoutRadial(width: number, height: number) {
    const centerX = width / 2
    const centerY = height / 2
    const maxDepth = Math.max(...treeRef.current.map((node) => getMaxDepth(node)))
    const radiusStep = Math.min(width, height) / 2 / (maxDepth + 2)

    function positionNode(
      node: TreeNode,
      angle: number,
      angleSpan: number,
      depth: number
    ) {
      const radius = depth * radiusStep + 80
      node.x = centerX + Math.cos(angle) * radius
      node.y = centerY + Math.sin(angle) * radius

      const childAngleSpan = angleSpan / Math.max(1, node.children.length)
      node.children.forEach((child, i) => {
        const childAngle = angle - angleSpan / 2 + (i + 0.5) * childAngleSpan
        positionNode(child, childAngle, childAngleSpan, depth + 1)
      })
    }

    const rootAngleSpan = (Math.PI * 2) / treeRef.current.length
    treeRef.current.forEach((root, i) => {
      const angle = i * rootAngleSpan
      positionNode(root, angle, rootAngleSpan, 0)
    })
  }

  function getMaxDepth(node: TreeNode): number {
    if (node.children.length === 0) return node.depth
    return Math.max(...node.children.map(getMaxDepth))
  }

  function render(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw connections
    function drawConnections(node: TreeNode) {
      node.children.forEach((child) => {
        ctx.strokeStyle = "rgba(212, 175, 55, 0.3)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(node.x, node.y)
        ctx.lineTo(child.x, child.y)
        ctx.stroke()

        // Draw arrow
        const angle = Math.atan2(child.y - node.y, child.x - node.x)
        const arrowSize = 8
        ctx.fillStyle = "rgba(212, 175, 55, 0.5)"
        ctx.beginPath()
        ctx.moveTo(child.x, child.y)
        ctx.lineTo(
          child.x - arrowSize * Math.cos(angle - Math.PI / 6),
          child.y - arrowSize * Math.sin(angle - Math.PI / 6)
        )
        ctx.lineTo(
          child.x - arrowSize * Math.cos(angle + Math.PI / 6),
          child.y - arrowSize * Math.sin(angle + Math.PI / 6)
        )
        ctx.closePath()
        ctx.fill()

        drawConnections(child)
      })
    }

    treeRef.current.forEach(drawConnections)

    // Draw nodes
    function drawNode(node: TreeNode) {
      const b = node.breakthrough
      const isHovered = hoveredId === b.id
      const isSelected = selectedBreakthrough?.id === b.id
      const radius = 15 + b.significanceScore * 15

      // Glow effect
      if (isHovered || isSelected) {
        ctx.shadowColor = ELEMENT_COLORS[b.element] || "#7DD3C0"
        ctx.shadowBlur = 20
      } else {
        ctx.shadowBlur = 0
      }

      // Outer ring (status)
      ctx.strokeStyle = STATUS_COLORS[b.integrationStatus]
      ctx.lineWidth = isSelected ? 4 : 2
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2)
      ctx.stroke()

      // Node circle (element)
      ctx.fillStyle = ELEMENT_COLORS[b.element] || "#7DD3C0"
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowBlur = 0

      // Significance indicator (inner circle)
      ctx.fillStyle = `rgba(255, 255, 255, ${b.significanceScore})`
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius * 0.4, 0, Math.PI * 2)
      ctx.fill()

      // Label
      if (isHovered || isSelected) {
        ctx.fillStyle = "#D4AF37"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        const maxWidth = 120
        const words = b.title.split(" ")
        let line = ""
        let y = node.y + radius + 10

        words.forEach((word) => {
          const testLine = line + word + " "
          const metrics = ctx.measureText(testLine)
          if (metrics.width > maxWidth && line !== "") {
            ctx.fillText(line, node.x, y)
            line = word + " "
            y += 14
          } else {
            line = testLine
          }
        })
        ctx.fillText(line, node.x, y)
      }

      // Recurse
      node.children.forEach(drawNode)
    }

    treeRef.current.forEach(drawNode)
  }

  // Mouse interaction
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current

    function findNodeAt(x: number, y: number, node: TreeNode): TreeNode | null {
      const b = node.breakthrough
      const radius = 15 + b.significanceScore * 15
      const dx = x - node.x
      const dy = y - node.y
      if (dx * dx + dy * dy < radius * radius) {
        return node
      }

      for (const child of node.children) {
        const found = findNodeAt(x, y, child)
        if (found) return found
      }

      return null
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      let foundNode: TreeNode | null = null
      for (const root of treeRef.current) {
        foundNode = findNodeAt(x, y, root)
        if (foundNode) break
      }

      setHoveredId(foundNode?.breakthrough.id || null)
      canvas.style.cursor = foundNode ? "pointer" : "default"
    }

    function handleClick(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      let foundNode: TreeNode | null = null
      for (const root of treeRef.current) {
        foundNode = findNodeAt(x, y, root)
        if (foundNode) break
      }

      setSelectedBreakthrough(foundNode?.breakthrough || null)
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("click", handleClick)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleClick)
    }
  }, [breakthroughs])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[700px] border border-[#D4AF37]/20 rounded-lg bg-black/20">
        <div className="text-[#D4AF37]/60 text-sm">Tracing breakthrough journey...</div>
      </div>
    )
  }

  if (breakthroughs.length === 0) {
    return (
      <div className="flex items-center justify-center h-[700px] border border-[#D4AF37]/20 rounded-lg bg-black/20">
        <div className="text-center space-y-2">
          <div className="text-[#D4AF37]/60 text-sm">No breakthroughs marked yet</div>
          <div className="text-[#D4AF37]/40 text-xs">
            Mark significant moments to see how transformations build
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
            Breakthrough Journey
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {breakthroughs.length} breakthroughs · How transformations build
          </p>
        </div>

        {/* Legend */}
        <div className="flex gap-4">
          <div className="flex gap-2 text-xs">
            {Object.entries(STATUS_LABELS).map(([status, label]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[status] }}
                />
                <span className="text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative border border-[#D4AF37]/20 rounded-lg overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <canvas ref={canvasRef} className="w-full" />

        {/* Hint overlay */}
        {!selectedBreakthrough && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-[#D4AF37]/40 text-xs">
            Click a breakthrough to explore · Size = significance
          </div>
        )}
      </div>

      {/* Selected Breakthrough Detail */}
      <AnimatePresence>
        {selectedBreakthrough && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border border-[#D4AF37]/30 rounded-lg p-6 bg-black/30 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-medium text-[#D4AF37]">
                    {selectedBreakthrough.title}
                  </h4>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${STATUS_COLORS[selectedBreakthrough.integrationStatus]}30`,
                      color: STATUS_COLORS[selectedBreakthrough.integrationStatus],
                    }}
                  >
                    {STATUS_LABELS[selectedBreakthrough.integrationStatus]}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-gray-400">
                  <span
                    className="px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${ELEMENT_COLORS[selectedBreakthrough.element]}20`,
                      color: ELEMENT_COLORS[selectedBreakthrough.element],
                    }}
                  >
                    {selectedBreakthrough.element}
                  </span>
                  <span>{selectedBreakthrough.archetype}</span>
                  <span>
                    Significance: {Math.round(selectedBreakthrough.significanceScore * 100)}%
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBreakthrough(null)}
                className="text-gray-500 hover:text-[#D4AF37] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-300 mb-4">
              {selectedBreakthrough.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-gray-500 mb-1">Emerged</div>
                <div className="text-[#D4AF37]">
                  {new Date(selectedBreakthrough.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Last updated</div>
                <div className="text-[#D4AF37]">
                  {new Date(selectedBreakthrough.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Relationships */}
            {(selectedBreakthrough.buildsOn.length > 0 ||
              selectedBreakthrough.leadsTo.length > 0) && (
              <div className="mt-4 pt-4 border-t border-[#D4AF37]/20 space-y-3">
                {selectedBreakthrough.buildsOn.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Builds on:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedBreakthrough.buildsOn.map((id) => {
                        const previous = breakthroughs.find((b) => b.id === id)
                        if (!previous) return null
                        return (
                          <button
                            key={id}
                            onClick={() => setSelectedBreakthrough(previous)}
                            className="text-xs px-2 py-1 rounded bg-black/40 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors"
                          >
                            ← {previous.title}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {selectedBreakthrough.leadsTo.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Leads to:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedBreakthrough.leadsTo.map((id) => {
                        const next = breakthroughs.find((b) => b.id === id)
                        if (!next) return null
                        return (
                          <button
                            key={id}
                            onClick={() => setSelectedBreakthrough(next)}
                            className="text-xs px-2 py-1 rounded bg-black/40 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors"
                          >
                            {next.title} →
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 text-center text-xs">
        <div className="p-3 rounded-lg bg-black/20 border border-[#D4AF37]/10">
          <div className="text-[#D4AF37] font-medium">
            {breakthroughs.filter((b) => b.integrationStatus === "teaching").length}
          </div>
          <div className="text-gray-500 mt-1">Teaching</div>
        </div>
        <div className="p-3 rounded-lg bg-black/20 border border-[#D4AF37]/10">
          <div className="text-[#D4AF37] font-medium">
            {breakthroughs.filter((b) => b.integrationStatus === "integrated").length}
          </div>
          <div className="text-gray-500 mt-1">Integrated</div>
        </div>
        <div className="p-3 rounded-lg bg-black/20 border border-[#D4AF37]/10">
          <div className="text-[#D4AF37] font-medium">
            {breakthroughs.filter((b) => b.integrationStatus === "integrating").length}
          </div>
          <div className="text-gray-500 mt-1">Integrating</div>
        </div>
        <div className="p-3 rounded-lg bg-black/20 border border-[#D4AF37]/10">
          <div className="text-[#D4AF37] font-medium">
            {breakthroughs.filter((b) => b.integrationStatus === "emerged").length}
          </div>
          <div className="text-gray-500 mt-1">Emerging</div>
        </div>
      </div>
    </div>
  )
}
