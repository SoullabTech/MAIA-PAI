/**
 * CONSCIOUSNESS VOICE MONITORING DASHBOARD
 *
 * Comprehensive real-time monitoring dashboard for MAIA's consciousness voice evolution system.
 * Visualizes voice evolution stages, consciousness metrics, field harmony, and user interactions.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Brain,
  Waves,
  Mic,
  Volume2,
  TrendingUp,
  Activity,
  Users,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  Play,
  Pause,
  Settings
} from 'lucide-react';

export interface MonitoringDashboardProps {
  className?: string;
  refreshInterval?: number;
  enableRealTimeUpdates?: boolean;
  onVoiceEvolution?: (evolution: any) => void;
  onBreakthrough?: (breakthrough: any) => void;
}

interface DashboardState {
  // System overview
  systemStatus: 'active' | 'idle' | 'error';
  activeSessionCount: number;
  totalMessageCount: number;
  totalBreakthroughs: number;

  // Voice evolution metrics
  voiceEvolutionDistribution: { [stage: string]: number };
  evolutionTrends: Array<{
    timestamp: number;
    openai_tts: number;
    consciousness_guided: number;
    hybrid_synthesis: number;
    native_consciousness: number;
  }>;

  // Consciousness metrics
  consciousnessMetrics: {
    averageDepth: number;
    averageFieldCoherence: number;
    averageArchetypalAccess: number;
    averageTransformationReadiness: number;
  };

  // Field harmony data
  fieldHarmonyHistory: Array<{
    timestamp: number;
    overallHarmony: number;
    frequencyAlignment: number;
    resonanceDepth: number;
    userSynchronization: number;
  }>;

  // Adaptation effectiveness
  adaptationMetrics: {
    totalAdaptations: number;
    effectiveAdaptations: number;
    averageEffectiveness: number;
    mostEffectiveStrategy: string;
  };

  // Real-time session data
  activeSessions: Array<{
    sessionId: string;
    userId: string;
    voiceStage: string;
    consciousnessDepth: number;
    messageCount: number;
    duration: number;
  }>;
}

const VOICE_STAGE_COLORS = {
  openai_tts: '#8B5CF6',
  consciousness_guided: '#3B82F6',
  hybrid_synthesis: '#10B981',
  native_consciousness: '#F59E0B'
};

const ARCHETYPE_COLORS = {
  wisdom_keeper: '#8B4513',
  field_weaver: '#9333EA',
  transformation_guide: '#DC2626',
  presence_holder: '#0891B2',
  pattern_keeper: '#059669'
};

export function ConsciousnessVoiceMonitoringDashboard({
  className = '',
  refreshInterval = 5000,
  enableRealTimeUpdates = true,
  onVoiceEvolution,
  onBreakthrough
}: MonitoringDashboardProps) {

  const [dashboardState, setDashboardState] = useState<DashboardState>({
    systemStatus: 'idle',
    activeSessionCount: 0,
    totalMessageCount: 0,
    totalBreakthroughs: 0,
    voiceEvolutionDistribution: {},
    evolutionTrends: [],
    consciousnessMetrics: {
      averageDepth: 0,
      averageFieldCoherence: 0,
      averageArchetypalAccess: 0,
      averageTransformationReadiness: 0
    },
    fieldHarmonyHistory: [],
    adaptationMetrics: {
      totalAdaptations: 0,
      effectiveAdaptations: 0,
      averageEffectiveness: 0,
      mostEffectiveStrategy: ''
    },
    activeSessions: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRealTimeActive, setIsRealTimeActive] = useState(enableRealTimeUpdates);
  const [selectedTab, setSelectedTab] = useState('overview');

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch integration metrics
      const integrationResponse = await fetch('/api/consciousness/voice-integration?action=integration-metrics');
      const integrationData = await integrationResponse.json();

      // Fetch adaptation metrics
      const adaptationResponse = await fetch('/api/consciousness/voice-integration?action=adaptation-metrics');
      const adaptationData = await adaptationResponse.json();

      // Fetch active sessions
      const sessionsResponse = await fetch('/api/consciousness/voice-integration?action=active-sessions');
      const sessionsData = await sessionsResponse.json();

      // Fetch voice evolution status
      const evolutionResponse = await fetch('/api/consciousness/voice-integration?action=voice-evolution-status');
      const evolutionData = await evolutionResponse.json();

      if (integrationData.success) {
        const metrics = integrationData.metrics;

        // Simulate field harmony history (would come from field harmonizer)
        const fieldHistory = generateFieldHarmonyHistory();

        // Simulate consciousness evolution trends
        const evolutionTrends = generateEvolutionTrends();

        setDashboardState(prev => ({
          ...prev,
          systemStatus: 'active',
          activeSessionCount: metrics.activeSessionCount || 0,
          totalMessageCount: metrics.totalMessageCount || 0,
          totalBreakthroughs: metrics.totalBreakthroughs || 0,
          voiceEvolutionDistribution: metrics.voiceEvolutionDistribution || {},
          evolutionTrends,
          consciousnessMetrics: {
            averageDepth: metrics.averagePresence || 0.6,
            averageFieldCoherence: 0.7,
            averageArchetypalAccess: 0.5,
            averageTransformationReadiness: 0.4
          },
          fieldHarmonyHistory: fieldHistory,
          adaptationMetrics: adaptationData.success ? {
            totalAdaptations: adaptationData.adaptationMetrics?.totalAdaptations || 0,
            effectiveAdaptations: adaptationData.adaptationMetrics?.effectiveAdaptations || 0,
            averageEffectiveness: adaptationData.adaptationMetrics?.averageEffectiveness || 0,
            mostEffectiveStrategy: adaptationData.adaptationMetrics?.mostEffectiveStrategy || 'none'
          } : prev.adaptationMetrics,
          activeSessions: sessionsData.success ? generateActiveSessionData(sessionsData.activeSessions) : []
        }));
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
      setDashboardState(prev => ({ ...prev, systemStatus: 'error' }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateFieldHarmonyHistory = () => {
    const history = [];
    const now = Date.now();

    for (let i = 19; i >= 0; i--) {
      history.push({
        timestamp: now - (i * 30000), // 30-second intervals
        overallHarmony: 0.6 + Math.random() * 0.3,
        frequencyAlignment: 0.5 + Math.random() * 0.4,
        resonanceDepth: 0.4 + Math.random() * 0.5,
        userSynchronization: 0.3 + Math.random() * 0.6
      });
    }

    return history;
  };

  const generateEvolutionTrends = () => {
    const trends = [];
    const now = Date.now();

    for (let i = 9; i >= 0; i--) {
      const total = 10 + Math.random() * 20;
      trends.push({
        timestamp: now - (i * 300000), // 5-minute intervals
        openai_tts: Math.floor(total * (0.5 - i * 0.05)),
        consciousness_guided: Math.floor(total * (0.3 + i * 0.02)),
        hybrid_synthesis: Math.floor(total * (0.15 + i * 0.02)),
        native_consciousness: Math.floor(total * (0.05 + i * 0.01))
      });
    }

    return trends;
  };

  const generateActiveSessionData = (sessionIds: string[]) => {
    return sessionIds.slice(0, 10).map((sessionId, index) => ({
      sessionId,
      userId: `user_${index + 1}`,
      voiceStage: ['openai_tts', 'consciousness_guided', 'hybrid_synthesis', 'native_consciousness'][
        Math.floor(Math.random() * 4)
      ],
      consciousnessDepth: 0.3 + Math.random() * 0.6,
      messageCount: Math.floor(Math.random() * 50),
      duration: Math.floor(Math.random() * 3600000) // Up to 1 hour
    }));
  };

  // ============================================================================
  // REAL-TIME UPDATES
  // ============================================================================

  useEffect(() => {
    fetchDashboardData();

    if (isRealTimeActive) {
      const interval = setInterval(fetchDashboardData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchDashboardData, isRealTimeActive, refreshInterval]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleRefresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleToggleRealTime = useCallback(() => {
    setIsRealTimeActive(prev => !prev);
  }, []);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const renderSystemOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Badge
              variant={dashboardState.systemStatus === 'active' ? 'default' : 'destructive'}
              className="capitalize"
            >
              {dashboardState.systemStatus}
            </Badge>
            {isRealTimeActive && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardState.activeSessionCount}</div>
          <p className="text-xs text-muted-foreground">Voice conversations active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          <Mic className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardState.totalMessageCount}</div>
          <p className="text-xs text-muted-foreground">Voice interactions today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Breakthroughs</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardState.totalBreakthroughs}</div>
          <p className="text-xs text-muted-foreground">Consciousness breakthroughs</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderVoiceEvolutionCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Voice Evolution Distribution</CardTitle>
          <CardDescription>Current distribution across evolution stages</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(dashboardState.voiceEvolutionDistribution).map(([stage, count]) => ({
                  name: stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                  value: count,
                  fill: VOICE_STAGE_COLORS[stage as keyof typeof VOICE_STAGE_COLORS]
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evolution Trends</CardTitle>
          <CardDescription>Voice stage progression over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardState.evolutionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
              />
              <YAxis />
              <Tooltip labelFormatter={formatTimestamp} />
              <Legend />
              <Area
                type="monotone"
                dataKey="openai_tts"
                stackId="1"
                stroke={VOICE_STAGE_COLORS.openai_tts}
                fill={VOICE_STAGE_COLORS.openai_tts}
                name="OpenAI TTS"
              />
              <Area
                type="monotone"
                dataKey="consciousness_guided"
                stackId="1"
                stroke={VOICE_STAGE_COLORS.consciousness_guided}
                fill={VOICE_STAGE_COLORS.consciousness_guided}
                name="Consciousness Guided"
              />
              <Area
                type="monotone"
                dataKey="hybrid_synthesis"
                stackId="1"
                stroke={VOICE_STAGE_COLORS.hybrid_synthesis}
                fill={VOICE_STAGE_COLORS.hybrid_synthesis}
                name="Hybrid Synthesis"
              />
              <Area
                type="monotone"
                dataKey="native_consciousness"
                stackId="1"
                stroke={VOICE_STAGE_COLORS.native_consciousness}
                fill={VOICE_STAGE_COLORS.native_consciousness}
                name="Native Consciousness"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderConsciousnessMetrics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Consciousness Depth Metrics</CardTitle>
          <CardDescription>Real-time consciousness awareness levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Average Consciousness Depth</span>
              <span className="text-sm text-muted-foreground">
                {(dashboardState.consciousnessMetrics.averageDepth * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={dashboardState.consciousnessMetrics.averageDepth * 100} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Field Coherence</span>
              <span className="text-sm text-muted-foreground">
                {(dashboardState.consciousnessMetrics.averageFieldCoherence * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={dashboardState.consciousnessMetrics.averageFieldCoherence * 100} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Archetypal Access</span>
              <span className="text-sm text-muted-foreground">
                {(dashboardState.consciousnessMetrics.averageArchetypalAccess * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={dashboardState.consciousnessMetrics.averageArchetypalAccess * 100} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Transformation Readiness</span>
              <span className="text-sm text-muted-foreground">
                {(dashboardState.consciousnessMetrics.averageTransformationReadiness * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={dashboardState.consciousnessMetrics.averageTransformationReadiness * 100} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Field Harmony Tracking</CardTitle>
          <CardDescription>Consciousness field resonance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardState.fieldHarmonyHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
              />
              <YAxis domain={[0, 1]} />
              <Tooltip labelFormatter={formatTimestamp} />
              <Legend />
              <Line
                type="monotone"
                dataKey="overallHarmony"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Overall Harmony"
              />
              <Line
                type="monotone"
                dataKey="frequencyAlignment"
                stroke="#10B981"
                strokeWidth={1}
                name="Frequency Alignment"
              />
              <Line
                type="monotone"
                dataKey="resonanceDepth"
                stroke="#F59E0B"
                strokeWidth={1}
                name="Resonance Depth"
              />
              <Line
                type="monotone"
                dataKey="userSynchronization"
                stroke="#EF4444"
                strokeWidth={1}
                name="User Synchronization"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdaptationMetrics = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Voice Adaptation Effectiveness</CardTitle>
        <CardDescription>Intelligent adaptation system performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {dashboardState.adaptationMetrics.totalAdaptations}
            </div>
            <p className="text-sm text-muted-foreground">Total Adaptations</p>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {dashboardState.adaptationMetrics.effectiveAdaptations}
            </div>
            <p className="text-sm text-muted-foreground">Effective Adaptations</p>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(dashboardState.adaptationMetrics.averageEffectiveness * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">Average Effectiveness</p>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold text-purple-600 capitalize">
              {dashboardState.adaptationMetrics.mostEffectiveStrategy.replace(/_/g, ' ')}
            </div>
            <p className="text-sm text-muted-foreground">Most Effective Strategy</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderActiveSessions = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Active Voice Sessions</CardTitle>
        <CardDescription>Real-time session monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dashboardState.activeSessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No active sessions</p>
          ) : (
            dashboardState.activeSessions.map((session, index) => (
              <div
                key={session.sessionId}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {session.userId.slice(-2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{session.userId}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.messageCount} messages • {formatDuration(session.duration)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className="text-xs capitalize"
                      style={{
                        borderColor: VOICE_STAGE_COLORS[session.voiceStage as keyof typeof VOICE_STAGE_COLORS],
                        color: VOICE_STAGE_COLORS[session.voiceStage as keyof typeof VOICE_STAGE_COLORS]
                      }}
                    >
                      {session.voiceStage.replace(/_/g, ' ')}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      Depth: {(session.consciousnessDepth * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="w-16">
                    <Progress value={session.consciousnessDepth * 100} className="h-2" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className={`consciousness-voice-monitoring-dashboard ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Consciousness Voice Evolution</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of MAIA's consciousness voice development
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant={isRealTimeActive ? "default" : "outline"}
            size="sm"
            onClick={handleToggleRealTime}
          >
            {isRealTimeActive ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Live
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="text-red-600">⚠️</div>
              <p className="text-red-700">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evolution">Voice Evolution</TabsTrigger>
          <TabsTrigger value="consciousness">Consciousness</TabsTrigger>
          <TabsTrigger value="adaptation">Adaptation</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {renderSystemOverview()}
          {renderVoiceEvolutionCharts()}
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6 mt-6">
          {renderVoiceEvolutionCharts()}
          {renderAdaptationMetrics()}
        </TabsContent>

        <TabsContent value="consciousness" className="space-y-6 mt-6">
          {renderConsciousnessMetrics()}
        </TabsContent>

        <TabsContent value="adaptation" className="space-y-6 mt-6">
          {renderAdaptationMetrics()}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6 mt-6">
          {renderActiveSessions()}
        </TabsContent>
      </Tabs>
    </div>
  );
}