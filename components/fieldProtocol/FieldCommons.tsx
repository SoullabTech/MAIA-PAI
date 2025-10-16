'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  FieldRecord,
  Element,
  RecordFilter,
  RecordSort,
  CommonsEntry
} from '@/types/fieldProtocol';
import { FieldRecordViewer } from './FieldRecordViewer';
import {
  Search,
  Filter,
  TrendingUp,
  Users,
  Sparkles,
  Calendar,
  BarChart3,
  Network,
  Globe,
  Shield,
  Award
} from 'lucide-react';

interface FieldCommonsProps {
  records: FieldRecord[];
  commonsEntries: CommonsEntry[];
  currentPractitionerId?: string;
  onRecordSelect?: (record: FieldRecord) => void;
  onValidate?: (recordId: string) => void;
}

export const FieldCommons: React.FC<FieldCommonsProps> = ({
  records,
  commonsEntries,
  currentPractitionerId,
  onRecordSelect,
  onValidate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<RecordFilter>({});
  const [sort, setSort] = useState<RecordSort>({
    field: 'timestamp',
    direction: 'desc'
  });
  const [selectedTab, setSelectedTab] = useState('explore');
  const [selectedRecord, setSelectedRecord] = useState<FieldRecord | null>(null);

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    let filtered = records.filter(record => {
      // Only show public or commons records
      if (record.meta.visibility === 'private' &&
          record.meta.practitionerId !== currentPractitionerId) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesDescription = record.phenomenon.description.toLowerCase().includes(query);
        const matchesInsights = record.cognitive.insights.some(
          i => i.toLowerCase().includes(query)
        );
        const matchesTags = record.meta.tags?.some(
          t => t.toLowerCase().includes(query)
        );
        if (!matchesDescription && !matchesInsights && !matchesTags) {
          return false;
        }
      }

      // Element filter
      if (filter.elements?.length > 0) {
        const hasElement = filter.elements.some(
          e => record.elementalContext.dominant.includes(e)
        );
        if (!hasElement) return false;
      }

      // Date range filter
      if (filter.dateRange) {
        const recordDate = new Date(record.timestamp);
        if (filter.dateRange.start && recordDate < filter.dateRange.start) return false;
        if (filter.dateRange.end && recordDate > filter.dateRange.end) return false;
      }

      // Validation status filter
      if (filter.validationStatus) {
        if (filter.validationStatus === 'validated' &&
            !record.validation.selfValidation &&
            (!record.validation.peerValidation || record.validation.peerValidation.length === 0)) {
          return false;
        }
      }

      // Tags filter
      if (filter.tags?.length > 0) {
        const hasTag = filter.tags.some(
          tag => record.meta.tags?.includes(tag)
        );
        if (!hasTag) return false;
      }

      return true;
    });

    // Sort records
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'timestamp':
          comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          break;
        case 'coherenceScore':
          comparison = (b.validation.coherenceScore || 0) - (a.validation.coherenceScore || 0);
          break;
        case 'validations':
          const bValidations = (b.validation.peerValidation?.length || 0) +
                              (b.validation.selfValidation ? 1 : 0);
          const aValidations = (a.validation.peerValidation?.length || 0) +
                              (a.validation.selfValidation ? 1 : 0);
          comparison = bValidations - aValidations;
          break;
      }

      return sort.direction === 'asc' ? -comparison : comparison;
    });

    return filtered;
  }, [records, searchQuery, filter, sort, currentPractitionerId]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRecords = records.length;
    const validatedRecords = records.filter(
      r => r.validation.selfValidation || r.validation.peerValidation?.length > 0
    ).length;

    const elementCounts = new Map<Element, number>();
    records.forEach(record => {
      record.elementalContext.dominant.forEach(element => {
        elementCounts.set(element, (elementCounts.get(element) || 0) + 1);
      });
    });

    const practitioners = new Set(records.map(r => r.meta.practitionerId)).size;

    const avgCoherence = records.reduce(
      (sum, r) => sum + (r.validation.coherenceScore || 0), 0
    ) / totalRecords;

    return {
      totalRecords,
      validatedRecords,
      practitioners,
      avgCoherence,
      elementCounts: Array.from(elementCounts.entries())
        .sort((a, b) => b[1] - a[1])
    };
  }, [records]);

  // Get trending records
  const trendingRecords = useMemo(() => {
    return [...filteredRecords]
      .filter(r => {
        const entry = commonsEntries.find(e => e.recordId === r.id);
        return entry && entry.engagement.views > 0;
      })
      .sort((a, b) => {
        const aEntry = commonsEntries.find(e => e.recordId === a.id);
        const bEntry = commonsEntries.find(e => e.recordId === b.id);
        return (bEntry?.engagement.views || 0) - (aEntry?.engagement.views || 0);
      })
      .slice(0, 5);
  }, [filteredRecords, commonsEntries]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Spiralogic Field Commons
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Explore collective observations and validated insights from the field
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalRecords}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.validatedRecords}</div>
              <div className="text-sm text-muted-foreground">Validated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.practitioners}</div>
              <div className="text-sm text-muted-foreground">Practitioners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(stats.avgCoherence * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Coherence</div>
            </div>
          </div>

          <div className="mt-4">
            <Label>Elemental Distribution</Label>
            <div className="flex gap-2 mt-2">
              {stats.elementCounts.map(([element, count]) => (
                <Badge key={element} variant="outline">
                  {element}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="explore">
                <Search className="w-4 h-4 mr-1" />
                Explore
              </TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="w-4 h-4 mr-1" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="network">
                <Network className="w-4 h-4 mr-1" />
                Network
              </TabsTrigger>
              <TabsTrigger value="contribute">
                <Sparkles className="w-4 h-4 mr-1" />
                Contribute
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explore" className="space-y-4">
              {/* Search and Filter Controls */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    value={`${sort.field}-${sort.direction}`}
                    onValueChange={(value) => {
                      const [field, direction] = value.split('-');
                      setSort({
                        field: field as any,
                        direction: direction as any
                      });
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="timestamp-desc">Newest First</SelectItem>
                      <SelectItem value="timestamp-asc">Oldest First</SelectItem>
                      <SelectItem value="coherenceScore-desc">Highest Coherence</SelectItem>
                      <SelectItem value="validations-desc">Most Validated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Element Filter */}
                <div>
                  <Label>Filter by Element</Label>
                  <div className="flex gap-2 mt-2">
                    {(['Fire', 'Water', 'Air', 'Earth', 'Void'] as Element[]).map(element => (
                      <Button
                        key={element}
                        size="sm"
                        variant={filter.elements?.includes(element) ? 'default' : 'outline'}
                        onClick={() => {
                          const current = filter.elements || [];
                          setFilter({
                            ...filter,
                            elements: current.includes(element)
                              ? current.filter(e => e !== element)
                              : [...current, element]
                          });
                        }}
                      >
                        {element}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Records List */}
              <div className="space-y-4">
                {filteredRecords.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">No records found matching your criteria</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredRecords.slice(0, 10).map(record => (
                    <Card
                      key={record.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setSelectedRecord(record);
                        onRecordSelect?.(record);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">
                                {new Date(record.timestamp).toLocaleDateString()}
                              </Badge>
                              {record.elementalContext.dominant.map(element => (
                                <Badge key={element} variant="secondary">
                                  {element}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-sm line-clamp-2">
                              {record.phenomenon.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Stage: {record.currentStage}</span>
                              {record.validation.coherenceScore && (
                                <span>
                                  Coherence: {Math.round(record.validation.coherenceScore * 100)}%
                                </span>
                              )}
                              {record.validation.peerValidation && (
                                <span>
                                  {record.validation.peerValidation.length} validations
                                </span>
                              )}
                            </div>
                          </div>
                          {currentPractitionerId && record.meta.practitionerId !== currentPractitionerId && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onValidate?.(record.id);
                              }}
                            >
                              Validate
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Most viewed and validated records in the Commons
              </div>
              {trendingRecords.map(record => {
                const entry = commonsEntries.find(e => e.recordId === record.id);
                return (
                  <Card key={record.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="font-medium">
                              {entry?.engagement.views || 0} views
                            </span>
                            <span className="text-sm text-muted-foreground">
                              • {entry?.engagement.validations || 0} validations
                            </span>
                          </div>
                          <p className="text-sm mb-2">{record.phenomenon.description.slice(0, 100)}...</p>
                          <div className="flex gap-2">
                            {record.elementalContext.dominant.map(element => (
                              <Badge key={element} variant="outline" className="text-xs">
                                {element}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="network" className="space-y-4">
              <div className="text-center py-12">
                <Network className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Field Network Visualization</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive network graph showing connections between records,
                  practitioners, and elemental patterns
                </p>
                <Badge className="mt-4">Coming Soon</Badge>
              </div>
            </TabsContent>

            <TabsContent value="contribute" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Ethical Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Integrity</div>
                      <div className="text-sm text-muted-foreground">
                        Record what is directly experienced, not what is expected
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Transparency</div>
                      <div className="text-sm text-muted-foreground">
                        Note uncertainty, bias, and interpretation boundaries
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Coherence over Conviction</div>
                      <div className="text-sm text-muted-foreground">
                        Prioritize clarity and integration over belief or persuasion
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="text-center py-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Share Your Observations</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contribute to the collective field of consciousness exploration
                  </p>
                  <Button>
                    Create New Field Record
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Selected Record Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <FieldRecordViewer
              record={selectedRecord}
              onLink={(linkedId) => {
                const linked = records.find(r => r.id === linkedId);
                if (linked) setSelectedRecord(linked);
              }}
            />
            <div className="flex justify-end gap-2 mt-4">
              {currentPractitionerId && selectedRecord.meta.practitionerId !== currentPractitionerId && (
                <Button
                  variant="outline"
                  onClick={() => onValidate?.(selectedRecord.id)}
                >
                  Validate Record
                </Button>
              )}
              <Button onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldCommons;