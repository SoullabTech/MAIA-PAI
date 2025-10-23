// components/ElementalSpiralChart.tsx
// 🌀 Radial visualization of elemental insight distribution

"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface ElementCount {
  element: string;
  count: number;
  percentage: number;
}

interface InsightSummary {
  totalInsights: number;
  elementalBreakdown: ElementCount[];
}

interface ElementalSpiralChartProps {
  userId?: string;
  source?: string;
  days?: number;
  refreshInterval?: number; // Auto-refresh in ms (default: 10000 = 10s)
}

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#f97316",     // orange-500
  Water: "#3b82f6",    // blue-500
  Earth: "#22c55e",    // green-500
  Air: "#a855f7",      // purple-500
  Aether: "#8b5cf6",   // violet-500
  Unknown: "#6b7280",  // gray-500
};

const ELEMENT_SYMBOLS: Record<string, string> = {
  Fire: "🜃",
  Water: "🜂",
  Earth: "🜄",
  Air: "🜁",
  Aether: "🜀",
  Unknown: "◇",
};

export const ElementalSpiralChart: React.FC<ElementalSpiralChartProps> = ({
  userId,
  source = "ClaudeMirror",
  days,
  refreshInterval = 10000,
}) => {
  const [data, setData] = useState<InsightSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (userId) params.set("userId", userId);
      if (source) params.set("source", source);
      if (days) params.set("days", days.toString());

      const res = await fetch(`/api/insight-summary?${params.toString()}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const summary: InsightSummary = await res.json();
      setData(summary);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch insight summary:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [userId, source, days]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, userId, source, days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading elemental insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400 text-sm">Error: {error}</div>
      </div>
    );
  }

  if (!data || data.totalInsights === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <span className="text-4xl mb-2">🜀</span>
        <p className="text-sm">No insights recorded yet</p>
        <p className="text-xs mt-1 text-gray-500">
          Start a conversation in Claude Code to see your elemental spiral emerge
        </p>
      </div>
    );
  }

  // Prepare data for recharts
  const chartData = data.elementalBreakdown.map((item) => ({
    name: item.element,
    value: item.count,
    percentage: item.percentage,
    symbol: ELEMENT_SYMBOLS[item.element] || "◇",
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-black/90 border border-purple-500/50 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{item.symbol}</span>
            <span className="text-white font-medium">{item.name}</span>
          </div>
          <div className="text-sm text-gray-300">
            {item.value} insights ({item.percentage.toFixed(1)}%)
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-300">{entry.payload.symbol}</span>
            <span className="text-xs text-gray-400">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-light text-purple-200">Elemental Distribution</h3>
          <p className="text-xs text-gray-500 mt-1">
            {data.totalInsights} total insights recorded
          </p>
        </div>
        {lastUpdated && (
          <div className="text-xs text-gray-500">
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentage }) => `${percentage.toFixed(0)}%`}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={ELEMENT_COLORS[entry.name] || ELEMENT_COLORS.Unknown}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Breakdown List */}
      <div className="space-y-2">
        {data.elementalBreakdown.map((item) => (
          <div
            key={item.element}
            className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{ELEMENT_SYMBOLS[item.element]}</span>
              <span className="text-sm text-gray-300">{item.element}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500">{item.count} insights</div>
              <div
                className="w-16 h-2 rounded-full overflow-hidden bg-gray-700"
                style={{
                  background: `linear-gradient(to right, ${ELEMENT_COLORS[item.element]} ${item.percentage}%, #374151 ${item.percentage}%)`,
                }}
              />
              <div className="text-sm font-mono text-gray-400 w-12 text-right">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
