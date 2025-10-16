'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedFieldRecordForm } from './EnhancedFieldRecordForm';
import {
  FieldRecord,
  Element,
  ObservationStage,
  ValidationCriteria
} from '@/types/fieldProtocol';
import {
  Sparkles,
  Plus,
  Grid,
  List,
  Filter,
  Calendar,
  TrendingUp,
  Eye,
  Users,
  MessageCircle,
  Heart,
  Flame,
  Droplet,
  Wind,
  Mountain,
  Circle,
  Clock,
  ChevronRight,
  BookOpen,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const ElementIcon = ({ element }: { element: Element }) => {
  const icons = {
    Fire: <Flame className="w-4 h-4" />,
    Water: <Droplet className="w-4 h-4" />,
    Air: <Wind className="w-4 h-4" />,
    Earth: <Mountain className="w-4 h-4" />,
    Void: <Circle className="w-4 h-4" />
  };
  return icons[element] || null;
};

const StageIcon = ({ stage }: { stage: ObservationStage }) => {
  const icons = {
    Observation: <Eye className="w-4 h-4" />,
    Interpretation: <BookOpen className="w-4 h-4" />,
    Integration: <Activity className="w-4 h-4" />,
    Reflection: <Heart className="w-4 h-4" />,
    Transmission: <Users className="w-4 h-4" />
  };
  return icons[stage] || null;
};

interface FieldProtocolDashboardProps {
  userId?: string;
  userName?: string;
}

export const FieldProtocolDashboard: React.FC<FieldProtocolDashboardProps> = ({
  userId,
  userName = 'Explorer'
}) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'new' | 'record'>('dashboard');
  const [selectedRecord, setSelectedRecord] = useState<FieldRecord | null>(null);
  const [records, setRecords] = useState<FieldRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterElement, setFilterElement] = useState<Element | null>(null);
  const [filterStage, setFilterStage] = useState<ObservationStage | null>(null);

  // Fetch records
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/fieldProtocol/records?visibility=mine');
      const data = await response.json();
      if (data.data) {
        setRecords(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter records
  const filteredRecords = records.filter(record => {
    if (filterElement && !record.elementalContext?.dominant?.includes(filterElement)) {
      return false;
    }
    if (filterStage && record.currentStage !== filterStage) {
      return false;
    }
    return true;
  });

  // Calculate statistics
  const stats = {
    totalRecords: records.length,
    completedRecords: records.filter(r => r.currentStage === 'Transmission').length,
    activeRecords: records.filter(r => r.currentStage !== 'Transmission').length,
    elementalDistribution: ELEMENTS.reduce((acc, element) => {
      acc[element] = records.filter(r =>
        r.elementalContext?.dominant?.includes(element)
      ).length;
      return acc;
    }, {} as Record<Element, number>)
  };

  const ELEMENTS: Element[] = ['Fire', 'Water', 'Air', 'Earth', 'Void'];
  const STAGES: ObservationStage[] = [
    'Observation',
    'Interpretation',
    'Integration',
    'Reflection',
    'Transmission'
  ];

  const RecordCard = ({ record }: { record: FieldRecord }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={() => {
        setSelectedRecord(record);
        setActiveView('record');
      }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base line-clamp-1">
                {record.phenomenon?.description?.substring(0, 50) || 'Untitled Record'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              <StageIcon stage={record.currentStage} />
              <span className="ml-1">{record.currentStage}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Elements */}
            <div className="flex gap-1">
              {record.elementalContext?.dominant?.map(element => (
                <Badge key={element} variant="secondary" className="text-xs">
                  <ElementIcon element={element} />
                  <span className="ml-1">{element}</span>
                </Badge>
              ))}
            </div>

            {/* Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {Object.values(record.stageCompletions || {}).filter(s => s?.completed).length}/5
                </span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{
                    width: `${(Object.values(record.stageCompletions || {}).filter(s => s?.completed).length / 5) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Engagement Stats */}
            {record.meta?.visibility !== 'private' && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {record.engagement?.reflections?.length || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {record.engagement?.resonanceMarkers?.length || 0}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <AnimatePresence mode="wait">
        {activeView === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-purple-500" />
                  Field Protocol Observatory
                </h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back, {userName}. Continue your consciousness exploration.
                </p>
              </div>
              <Button
                onClick={() => setActiveView('new')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Record
              </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Records</p>
                      <p className="text-2xl font-bold">{stats.totalRecords}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-purple-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Transmitted</p>
                      <p className="text-2xl font-bold">{stats.completedRecords}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold">{stats.activeRecords}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Week</p>
                      <p className="text-2xl font-bold">
                        {records.filter(r => {
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return new Date(r.timestamp) > weekAgo;
                        }).length}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Elemental Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Elemental Resonance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {ELEMENTS.map(element => (
                    <div key={element} className="text-center">
                      <div className="relative mx-auto w-16 h-16 mb-2">
                        <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 transition-all"
                          style={{
                            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(-Math.PI / 2)}% ${50 + 50 * Math.sin(-Math.PI / 2)}%, ${50 + 50 * Math.cos(-Math.PI / 2 + (2 * Math.PI * stats.elementalDistribution[element] / Math.max(...Object.values(stats.elementalDistribution), 1)))}% ${50 + 50 * Math.sin(-Math.PI / 2 + (2 * Math.PI * stats.elementalDistribution[element] / Math.max(...Object.values(stats.elementalDistribution), 1)))}%)`
                          }}
                        />
                        <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                          <ElementIcon element={element} />
                        </div>
                      </div>
                      <p className="text-xs font-medium">{element}</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.elementalDistribution[element]} records
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Records */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Records</h2>
                <div className="flex items-center gap-2">
                  {/* Filters */}
                  <div className="flex gap-2">
                    <select
                      value={filterElement || ''}
                      onChange={(e) => setFilterElement(e.target.value as Element || null)}
                      className="text-sm border rounded-md px-3 py-1"
                    >
                      <option value="">All Elements</option>
                      {ELEMENTS.map(element => (
                        <option key={element} value={element}>{element}</option>
                      ))}
                    </select>

                    <select
                      value={filterStage || ''}
                      onChange={(e) => setFilterStage(e.target.value as ObservationStage || null)}
                      className="text-sm border rounded-md px-3 py-1"
                    >
                      <option value="">All Stages</option>
                      {STAGES.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Records Grid/List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
                    Loading records...
                  </div>
                </div>
              ) : filteredRecords.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                  {filteredRecords.map(record => (
                    <RecordCard key={record.id} record={record} />
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No records found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start documenting your consciousness exploration
                    </p>
                    <Button onClick={() => setActiveView('new')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Record
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {activeView === 'new' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setActiveView('dashboard')}
                className="mb-4"
              >
                ← Back to Dashboard
              </Button>
            </div>
            <EnhancedFieldRecordForm
              practitionerId={userId}
              onComplete={(record) => {
                fetchRecords();
                setActiveView('dashboard');
              }}
            />
          </motion.div>
        )}

        {activeView === 'record' && selectedRecord && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setActiveView('dashboard')}
                className="mb-4"
              >
                ← Back to Dashboard
              </Button>
            </div>
            {/* Record detail view would go here */}
            <Card>
              <CardHeader>
                <CardTitle>Record Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(selectedRecord, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FieldProtocolDashboard;