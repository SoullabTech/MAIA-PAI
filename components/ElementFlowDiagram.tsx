"use client";

/**
 * 🌀 Element Flow Diagram
 *
 * Shows how elemental energies flow between archetypes.
 * Reveals the living circulation of consciousness patterns.
 * Animated particles trace the currents of resonance.
 */

import { useEffect, useState, useRef } from "react";

interface FlowConnection {
  from: { element: string; archetype: string };
  to: { element: string; archetype: string };
  strength: number;
}

interface Node {
  id: string;
  element: string;
  archetype: string;
  x: number;
  y: number;
  count: number;
}

interface Particle {
  id: string;
  fromNode: string;
  toNode: string;
  progress: number;
  element: string;
}

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#FF6B35",
  Water: "#4A90E2",
  Earth: "#8B7355",
  Air: "#7DD3C0",
  Aether: "#9B59B6"
};

const ELEMENT_SYMBOLS: Record<string, string> = {
  Fire: "🔥",
  Water: "💧",
  Earth: "🗿",
  Air: "🌬️",
  Aether: "🜂"
};

interface ElementFlowDiagramProps {
  refreshInterval?: number;
  showParticles?: boolean;
}

export default function ElementFlowDiagram({
  refreshInterval = 30000,
  showParticles = true
}: ElementFlowDiagramProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<FlowConnection[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  /**
   * Load field flow data
   */
  async function loadFlowData() {
    try {
      // For now, generate synthetic flow data
      // In production, query field_vectors grouped by element+archetype pairs

      const archetypes = ["Mirror", "Guide", "Seeker", "Witness", "Initiation"];
      const elements = ["Fire", "Water", "Earth", "Air", "Aether"];

      // Create nodes (element-archetype combinations)
      const generatedNodes: Node[] = [];
      elements.forEach((element, ei) => {
        archetypes.slice(0, 3).forEach((archetype, ai) => {
          const angle = ((ei * 3 + ai) / 15) * Math.PI * 2;
          const radius = 150 + Math.random() * 50;

          generatedNodes.push({
            id: `${element}-${archetype}`,
            element,
            archetype,
            x: 250 + Math.cos(angle) * radius,
            y: 250 + Math.sin(angle) * radius,
            count: Math.floor(Math.random() * 30) + 10
          });
        });
      });

      // Create connections (flows between related patterns)
      const generatedConnections: FlowConnection[] = [];

      generatedNodes.forEach((from, i) => {
        generatedNodes.forEach((to, j) => {
          if (i >= j) return;

          // Connect if same element or complementary
          const shouldConnect =
            from.element === to.element ||
            (from.element === "Fire" && to.element === "Air") ||
            (from.element === "Water" && to.element === "Earth") ||
            (from.element === "Air" && to.element === "Fire") ||
            (from.element === "Earth" && to.element === "Water") ||
            (from.element === "Aether" && Math.random() > 0.7);

          if (shouldConnect && Math.random() > 0.5) {
            generatedConnections.push({
              from: { element: from.element, archetype: from.archetype },
              to: { element: to.element, archetype: to.archetype },
              strength: Math.random() * 0.8 + 0.2
            });
          }
        });
      });

      setNodes(generatedNodes);
      setConnections(generatedConnections);

      // Initialize particles
      if (showParticles) {
        const initialParticles: Particle[] = generatedConnections
          .filter(() => Math.random() > 0.7)
          .map((conn, i) => ({
            id: `p-${i}`,
            fromNode: `${conn.from.element}-${conn.from.archetype}`,
            toNode: `${conn.to.element}-${conn.to.archetype}`,
            progress: Math.random(),
            element: conn.from.element
          }));

        setParticles(initialParticles);
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to load flow data:", error);
      setLoading(false);
    }
  }

  /**
   * Draw flow diagram
   */
  function draw() {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Background
    const bgGradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) / 2
    );
    bgGradient.addColorStop(0, "rgba(20, 20, 40, 0.9)");
    bgGradient.addColorStop(1, "rgba(10, 10, 20, 0.95)");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw connections
    connections.forEach(conn => {
      const fromNode = nodes.find(
        n => n.element === conn.from.element && n.archetype === conn.from.archetype
      );
      const toNode = nodes.find(
        n => n.element === conn.to.element && n.archetype === conn.to.archetype
      );

      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = `rgba(212, 175, 55, ${conn.strength * 0.3})`;
      ctx.lineWidth = conn.strength * 2;
      ctx.stroke();
    });

    // Draw particles
    if (showParticles) {
      particles.forEach(particle => {
        const fromNode = nodes.find(n => n.id === particle.fromNode);
        const toNode = nodes.find(n => n.id === particle.toNode);

        if (!fromNode || !toNode) return;

        const x = fromNode.x + (toNode.x - fromNode.x) * particle.progress;
        const y = fromNode.y + (toNode.y - fromNode.y) * particle.progress;

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = ELEMENT_COLORS[particle.element];
        ctx.fill();

        // Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
        gradient.addColorStop(0, ELEMENT_COLORS[particle.element] + "80");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 8, y - 8, 16, 16);
      });
    }

    // Draw nodes
    nodes.forEach(node => {
      const color = ELEMENT_COLORS[node.element];
      const radius = 8 + (node.count / 40) * 12;

      // Glow
      const gradient = ctx.createRadialGradient(
        node.x,
        node.y,
        0,
        node.x,
        node.y,
        radius * 2
      );
      gradient.addColorStop(0, color + "60");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(node.x - radius * 2, node.y - radius * 2, radius * 4, radius * 4);

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Symbol
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = `${Math.max(10, radius * 0.8)}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ELEMENT_SYMBOLS[node.element] || "◌", node.x, node.y);
    });
  }

  /**
   * Update particle positions
   */
  function updateParticles() {
    setParticles(prev =>
      prev.map(particle => {
        const newProgress = particle.progress + 0.01;

        if (newProgress >= 1) {
          // Particle reached destination, create new one
          const randomConn =
            connections[Math.floor(Math.random() * connections.length)];
          if (randomConn) {
            return {
              id: particle.id,
              fromNode: `${randomConn.from.element}-${randomConn.from.archetype}`,
              toNode: `${randomConn.to.element}-${randomConn.to.archetype}`,
              progress: 0,
              element: randomConn.from.element
            };
          }
        }

        return { ...particle, progress: newProgress };
      })
    );
  }

  // Load data
  useEffect(() => {
    loadFlowData();
    const interval = setInterval(loadFlowData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Animation loop
  useEffect(() => {
    if (!showParticles) return;

    const animate = () => {
      updateParticles();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, connections, showParticles]);

  // Draw when data changes
  useEffect(() => {
    if (!showParticles) {
      draw();
    }
  }, [nodes, connections]);

  // Resize
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [nodes, connections, particles]);

  return (
    <div className="space-y-3">
      {/* Canvas */}
      <div className="relative border border-[#D4AF37]/20 rounded-lg overflow-hidden bg-black/30">
        <canvas
          ref={canvasRef}
          className="w-full h-[500px]"
          style={{ display: "block" }}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-[#D4AF37]/60 text-sm">Tracing currents...</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="text-[10px] text-[#D4AF37]/40 text-center space-y-1">
        <div className="italic">
          Node size = resonance strength · Lines = active currents
        </div>
        {showParticles && (
          <div>
            Flowing particles trace the living circulation of patterns
          </div>
        )}
      </div>
    </div>
  );
}
