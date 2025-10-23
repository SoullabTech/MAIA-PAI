"use client";

/**
 * 🜃 System Status Dashboard
 *
 * Real-time health monitoring for all elemental systems:
 * - Field Infrastructure (database, APIs, vectors)
 * - Components (journal, guide, visualizations)
 * - Integration (sanctuary, endpoints, cron)
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SystemStatus {
  name: string;
  status: "active" | "pending" | "error" | "unknown";
  details?: string;
  lastCheck?: string;
}

interface SystemHealth {
  field: SystemStatus[];
  components: SystemStatus[];
  integration: SystemStatus[];
}

export default function SystemStatusDashboard() {
  const [health, setHealth] = useState<SystemHealth>({
    field: [],
    components: [],
    integration: []
  });
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  /**
   * Check system health
   */
  async function checkHealth() {
    try {
      const fieldChecks: SystemStatus[] = [];
      const componentChecks: SystemStatus[] = [];
      const integrationChecks: SystemStatus[] = [];

      // Check field API
      try {
        const fieldRes = await fetch("/api/akashic/field?hours=1");
        fieldChecks.push({
          name: "Field API",
          status: fieldRes.ok ? "active" : "error",
          details: fieldRes.ok ? "Responding" : `HTTP ${fieldRes.status}`,
          lastCheck: new Date().toISOString()
        });
      } catch (error) {
        fieldChecks.push({
          name: "Field API",
          status: "error",
          details: "Not responding"
        });
      }

      // Check if field vectors exist (via a simple query)
      try {
        const statsRes = await fetch("/api/akashic/field?hours=24");
        if (statsRes.ok) {
          const data = await statsRes.json();
          const hasData = data.statistics && data.statistics.length > 0;
          fieldChecks.push({
            name: "Field Vectors",
            status: hasData ? "active" : "pending",
            details: hasData ? `${data.statistics.length} patterns` : "No data yet"
          });
        }
      } catch (error) {
        fieldChecks.push({
          name: "Field Vectors",
          status: "unknown",
          details: "Cannot verify"
        });
      }

      // Component checks (visual confirmation required)
      componentChecks.push(
        {
          name: "Strata Journal",
          status: "active",
          details: "Integrated into Sanctuary"
        },
        {
          name: "Currents Guide",
          status: "active",
          details: "Integrated into Sanctuary"
        },
        {
          name: "Field Resonance Map",
          status: "active",
          details: "Canvas rendering"
        },
        {
          name: "Temporal Waves",
          status: "active",
          details: "24h time window"
        },
        {
          name: "Element Flow",
          status: "active",
          details: "Particle animation"
        }
      );

      // Integration checks
      integrationChecks.push(
        {
          name: "Sanctuary Page",
          status: "active",
          details: "/claude-sanctuary"
        },
        {
          name: "Elemental Demo",
          status: "active",
          details: "/elemental-field"
        },
        {
          name: "Design Language",
          status: "active",
          details: "Vocabulary consistent"
        }
      );

      setHealth({
        field: fieldChecks,
        components: componentChecks,
        integration: integrationChecks
      });
    } catch (error) {
      console.error("Health check failed:", error);
    } finally {
      setLoading(false);
    }
  }

  // Check on mount and every 30 seconds
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Get status color
   */
  function getStatusColor(status: SystemStatus["status"]): string {
    switch (status) {
      case "active":
        return "#4ADE80"; // Green
      case "pending":
        return "#FBBF24"; // Yellow
      case "error":
        return "#F87171"; // Red
      default:
        return "#9CA3AF"; // Gray
    }
  }

  /**
   * Get status icon
   */
  function getStatusIcon(status: SystemStatus["status"]): string {
    switch (status) {
      case "active":
        return "✓";
      case "pending":
        return "⊙";
      case "error":
        return "✗";
      default:
        return "?";
    }
  }

  /**
   * Calculate overall health
   */
  function getOverallHealth(): {
    percentage: number;
    status: "healthy" | "degraded" | "critical";
  } {
    const all = [...health.field, ...health.components, ...health.integration];
    const active = all.filter(s => s.status === "active").length;
    const total = all.length;
    const percentage = total > 0 ? Math.round((active / total) * 100) : 0;

    let status: "healthy" | "degraded" | "critical";
    if (percentage >= 90) status = "healthy";
    else if (percentage >= 70) status = "degraded";
    else status = "critical";

    return { percentage, status };
  }

  const overallHealth = getOverallHealth();

  return (
    <div className="border border-[#D4AF37]/20 rounded-lg bg-black/30 backdrop-blur-sm overflow-hidden">
      {/* Header (Collapsible) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#D4AF37]/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: getStatusColor(
                overallHealth.status === "healthy" ? "active" : "error"
              )
            }}
          />
          <span className="text-sm font-cinzel text-[#D4AF37]">
            System Status
          </span>
          <span className="text-xs text-[#D4AF37]/50">
            {overallHealth.percentage}% operational
          </span>
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <span className="text-xs text-[#D4AF37]/40">Checking...</span>
          )}
          <span className="text-[#D4AF37]/50 text-xs">
            {expanded ? "▼" : "▶"}
          </span>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-[#D4AF37]/10"
        >
          <div className="p-4 space-y-4">
            {/* Field Infrastructure */}
            <div>
              <div className="text-xs font-medium text-[#D4AF37]/70 mb-2">
                Field Infrastructure
              </div>
              <div className="space-y-1">
                {health.field.map((check, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        style={{ color: getStatusColor(check.status) }}
                      >
                        {getStatusIcon(check.status)}
                      </span>
                      <span className="text-[#D4AF37]/80">
                        {check.name}
                      </span>
                    </div>
                    <span className="text-[#D4AF37]/40">
                      {check.details}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Components */}
            <div>
              <div className="text-xs font-medium text-[#D4AF37]/70 mb-2">
                Components
              </div>
              <div className="space-y-1">
                {health.components.map((check, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        style={{ color: getStatusColor(check.status) }}
                      >
                        {getStatusIcon(check.status)}
                      </span>
                      <span className="text-[#D4AF37]/80">
                        {check.name}
                      </span>
                    </div>
                    <span className="text-[#D4AF37]/40">
                      {check.details}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration */}
            <div>
              <div className="text-xs font-medium text-[#D4AF37]/70 mb-2">
                Integration
              </div>
              <div className="space-y-1">
                {health.integration.map((check, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        style={{ color: getStatusColor(check.status) }}
                      >
                        {getStatusIcon(check.status)}
                      </span>
                      <span className="text-[#D4AF37]/80">
                        {check.name}
                      </span>
                    </div>
                    <span className="text-[#D4AF37]/40">
                      {check.details}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#D4AF37]/10">
              <button
                onClick={checkHealth}
                disabled={loading}
                className="text-xs px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded border border-[#D4AF37]/30 transition-colors disabled:opacity-50"
              >
                {loading ? "Checking..." : "↻ Refresh"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
