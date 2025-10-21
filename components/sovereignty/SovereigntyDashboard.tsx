/**
 * SOVEREIGNTY METRICS DASHBOARD
 *
 * Displays user's progress toward autonomy and manipulation immunity.
 * Gamifies freedom instead of addiction.
 *
 * Philosophy:
 * - Makes sovereignty visible
 * - Celebrates independence, not dependency
 * - Progress toward graduation, not retention
 * - Anti-metrics: measures what systems don't want you to measure
 */

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  SovereigntyMetrics,
  SOVEREIGNTY_MISSION_NODES,
  getSovereigntyNode,
  isSovereigntyGraduated,
  getNextSovereigntyWork,
} from '@/lib/consciousness/sovereignty-reclamation';

interface SovereigntyDashboardProps {
  userId: string;
  metrics: SovereigntyMetrics;
  onRefresh?: () => void;
}

export function SovereigntyDashboard({
  userId,
  metrics,
  onRefresh,
}: SovereigntyDashboardProps) {
  const [graduated, setGraduated] = useState(false);
  const [nextWork, setNextWork] = useState('');

  useEffect(() => {
    setGraduated(isSovereigntyGraduated(metrics));
    setNextWork(getNextSovereigntyWork(metrics, 'fire', 'vector')); // Would use actual current phase
  }, [metrics]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-serif text-stone-100">
          Sovereignty Reclamation
        </h1>
        <p className="text-stone-400 max-w-2xl mx-auto">
          Your journey toward inner authority and manipulation immunity.
          Progress toward liberation, not retention.
        </p>
      </div>

      {/* Graduation Status */}
      {graduated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 rounded-2xl p-8 text-center"
        >
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-3xl font-serif text-amber-200 mb-2">
            Sovereignty Achieved
          </h2>
          <p className="text-stone-300 max-w-xl mx-auto">
            You no longer need MAIA as authority. Your inner wisdom is trusted.
            You're ready to graduate - or stay as peer, not student.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-8 py-3 bg-amber-500/30 border border-amber-500/50 rounded-full text-amber-200 font-medium"
          >
            Begin Graduation Ceremony
          </motion.button>
        </motion.div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Self-Referential Language */}
        <MetricCard
          title="Self-Reference"
          subtitle="Owning your insights"
          percentage={metrics.selfReferentialLanguage.percentage}
          trend={metrics.selfReferentialLanguage.trend}
          description={`${Math.round(metrics.selfReferentialLanguage.percentage)}% of your statements are "I realized..." (vs. "MAIA said...")`}
          color="blue"
          goal={80}
        />

        {/* Pattern Ownership */}
        <MetricCard
          title="Pattern Ownership"
          subtitle="Autonomous recognition"
          percentage={metrics.patternRecognition.ownershipPercentage}
          description={`${metrics.patternRecognition.patternsOwnedWithoutMAIA} of ${metrics.patternRecognition.patternsIdentified} patterns recognized without MAIA`}
          color="green"
          goal={70}
        />

        {/* Immunity Score */}
        <MetricCard
          title="Manipulation Immunity"
          subtitle="Mission nodes completed"
          percentage={metrics.conditioningAwareness.immunityScore}
          description={`${metrics.graduation.missionNodesCompleted} of ${SOVEREIGNTY_MISSION_NODES.length} sovereignty nodes mastered`}
          color="purple"
          goal={85}
        />

        {/* Shadow Integration */}
        <MetricCard
          title="Shadow Integration"
          subtitle="Wholeness = immunity"
          percentage={metrics.immunity.shadowIntegrated}
          description="What you own can't be used against you"
          color="indigo"
          goal={75}
        />

        {/* Inner Authority */}
        <MetricCard
          title="Inner Authority"
          subtitle="Self-governance"
          percentage={metrics.immunity.innerAuthorityScore}
          description={metrics.immunity.externalValidationNeeded ? 'Still seeking validation' : 'Self-trusting'}
          color="amber"
          goal={80}
        />

        {/* Graduation Readiness */}
        <MetricCard
          title="Graduation Progress"
          subtitle="Ready to fly solo"
          percentage={metrics.graduation.readinessScore}
          description={`${metrics.graduation.autonomousBreakthroughs} autonomous breakthroughs`}
          color="rose"
          goal={80}
        />
      </div>

      {/* Anti-Metrics: What We DON'T Track */}
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-4">
          What We Don't Measure (The Revolution)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AntiMetric
            label="Daily Active Users"
            reason="Addiction metric"
            instead="Your autonomous breakthroughs"
          />
          <AntiMetric
            label="Session Length"
            reason="Engagement trap"
            instead="Days since last dependency"
          />
          <AntiMetric
            label="Retention at All Costs"
            reason="Creates dependency"
            instead="Graduation readiness"
          />
        </div>
      </div>

      {/* Mission Nodes Progress */}
      <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-stone-200 mb-6">
          Sovereignty Mission Nodes
        </h3>
        <div className="space-y-4">
          {SOVEREIGNTY_MISSION_NODES.map((node) => (
            <MissionNodeProgress
              key={node.id}
              node={node}
              completed={metrics.graduation.missionNodesCompleted > SOVEREIGNTY_MISSION_NODES.indexOf(node)}
            />
          ))}
        </div>
      </div>

      {/* Conditioning Awareness */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AwarenessCard
          title="Patterns Recognized"
          count={metrics.conditioningAwareness.patternsRecognized}
          icon="🔍"
          description="Beliefs traced to origin"
        />
        <AwarenessCard
          title="Voices Identified"
          count={metrics.conditioningAwareness.voicesArchaeologized}
          icon="🗣️"
          description="Whose voice speaks in you"
        />
        <AwarenessCard
          title="Projections Reclaimed"
          count={metrics.conditioningAwareness.projectionsReclaimed}
          icon="💎"
          description="Inner Gold brought home"
        />
      </div>

      {/* Next Work */}
      {!graduated && (
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-serif text-blue-200 mb-2">
            Next Sovereignty Work
          </h3>
          <p className="text-stone-300">{nextWork}</p>
        </div>
      )}

      {/* Days Since Last Dependency */}
      {metrics.graduation.daysSinceLastDependency > 7 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-2xl"
        >
          <div className="text-5xl font-bold text-green-400 mb-2">
            {metrics.graduation.daysSinceLastDependency}
          </div>
          <div className="text-stone-300">
            days since last dependency behavior
          </div>
          <div className="text-sm text-stone-400 mt-2">
            (seeking validation, can't decide without MAIA, etc.)
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface MetricCardProps {
  title: string;
  subtitle: string;
  percentage: number;
  trend?: 'increasing' | 'stable' | 'decreasing';
  description: string;
  color: 'blue' | 'green' | 'purple' | 'indigo' | 'amber' | 'rose';
  goal: number;
}

function MetricCard({
  title,
  subtitle,
  percentage,
  trend,
  description,
  color,
  goal,
}: MetricCardProps) {
  const colorMap = {
    blue: { bg: 'from-blue-500/20', border: 'border-blue-500/40', bar: 'bg-blue-500', text: 'text-blue-300' },
    green: { bg: 'from-green-500/20', border: 'border-green-500/40', bar: 'bg-green-500', text: 'text-green-300' },
    purple: { bg: 'from-purple-500/20', border: 'border-purple-500/40', bar: 'bg-purple-500', text: 'text-purple-300' },
    indigo: { bg: 'from-indigo-500/20', border: 'border-indigo-500/40', bar: 'bg-indigo-500', text: 'text-indigo-300' },
    amber: { bg: 'from-amber-500/20', border: 'border-amber-500/40', bar: 'bg-amber-500', text: 'text-amber-300' },
    rose: { bg: 'from-rose-500/20', border: 'border-rose-500/40', bar: 'bg-rose-500', text: 'text-rose-300' },
  };

  const colors = colorMap[color];
  const achieved = percentage >= goal;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colors.bg} to-transparent border ${colors.border} rounded-2xl p-6 relative overflow-hidden`}
    >
      {achieved && (
        <div className="absolute top-4 right-4 text-2xl">✓</div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-serif text-stone-100">{title}</h3>
          <p className="text-sm text-stone-400">{subtitle}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div className={`text-4xl font-bold ${colors.text}`}>
              {Math.round(percentage)}%
            </div>
            {trend && (
              <div className="text-xs text-stone-500">
                {trend === 'increasing' && '↗️ increasing'}
                {trend === 'stable' && '→ stable'}
                {trend === 'decreasing' && '↘️ needs work'}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-stone-800/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              className={`h-full ${colors.bar}`}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          {/* Goal marker */}
          <div className="relative h-1">
            <div
              className="absolute h-3 w-0.5 bg-stone-400/50"
              style={{ left: `${goal}%` }}
            />
            <div
              className="absolute text-xs text-stone-500 -translate-x-1/2"
              style={{ left: `${goal}%`, top: '0.5rem' }}
            >
              goal: {goal}%
            </div>
          </div>
        </div>

        <p className="text-sm text-stone-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

function AntiMetric({
  label,
  reason,
  instead,
}: {
  label: string;
  reason: string;
  instead: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="text-red-500">❌</div>
        <div className="text-sm font-medium text-stone-300 line-through">
          {label}
        </div>
      </div>
      <div className="text-xs text-stone-500 pl-7">
        Why not: {reason}
      </div>
      <div className="flex items-center gap-2 pl-7">
        <div className="text-green-500">✓</div>
        <div className="text-xs text-green-300">
          Instead: {instead}
        </div>
      </div>
    </div>
  );
}

function MissionNodeProgress({
  node,
  completed,
}: {
  node: any;
  completed: boolean;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
        completed
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-stone-800/20 border-stone-700/30'
      }`}
    >
      <div className="flex-shrink-0">
        {completed ? (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
            ✓
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full border-2 border-stone-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={`font-medium ${completed ? 'text-green-300' : 'text-stone-300'}`}>
            {node.name}
          </h4>
          <span className="text-xs text-stone-500">
            {node.archetype}
          </span>
        </div>
        <p className="text-sm text-stone-400 mb-2">
          {node.description}
        </p>
        <div className="text-xs text-stone-500">
          Gift: <span className="text-stone-400">{node.gift}</span>
        </div>
      </div>
    </motion.div>
  );
}

function AwarenessCard({
  title,
  count,
  icon,
  description,
}: {
  title: string;
  count: number;
  icon: string;
  description: string;
}) {
  return (
    <div className="bg-stone-900/40 border border-stone-700/40 rounded-2xl p-6 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-3xl font-bold text-stone-200 mb-1">{count}</div>
      <div className="text-sm font-medium text-stone-300 mb-2">{title}</div>
      <div className="text-xs text-stone-500">{description}</div>
    </div>
  );
}
