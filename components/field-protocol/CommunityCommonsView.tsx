/**
 * Community Commons View - Sacred Laboratory Collective Wisdom
 *
 * The place where individual experiences become collective wisdom.
 * A digital equivalent of the ancient wisdom circles.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { FieldRecord, ElementType, PhaseType, CommunityReflection } from '@/lib/field-protocol/types';
import {
  Users,
  Heart,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Clock,
  Filter,
  Share2,
  BookOpen,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Orbit
} from 'lucide-react';

interface CommunityCommonsViewProps {
  userId?: string;
}

const ElementIcon: Record<ElementType, React.ReactNode> = {
  fire: <Flame className="w-4 h-4" />,
  water: <Droplets className="w-4 h-4" />,
  air: <Wind className="w-4 h-4" />,
  earth: <Mountain className="w-4 h-4" />,
  ether: <Orbit className="w-4 h-4" />
};

const PhaseColors: Record<PhaseType, string> = {
  creation: 'text-green-600',
  preservation: 'text-blue-600',
  dissolution: 'text-red-600',
  void: 'text-purple-600',
  emergence: 'text-yellow-600'
};

export const CommunityCommonsView: React.FC<CommunityCommonsViewProps> = ({ userId }) => {
  const [commonsRecords, setCommonsRecords] = useState<FieldRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<FieldRecord | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'resonance' | 'completion'>('recent');
  const [elementFilter, setElementFilter] = useState<ElementType | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [resonanceType, setResonanceType] = useState<'somatic' | 'emotional' | 'intellectual' | 'spiritual'>('somatic');
  const [collectivePatterns, setCollectivePatterns] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch commons records
  useEffect(() => {
    fetchCommonsRecords();
    fetchCollectivePatterns();
  }, [sortBy, elementFilter]);

  const fetchCommonsRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy,
        limit: '20'
      });

      if (elementFilter) {
        params.append('elements', elementFilter);
      }

      const response = await fetch(`/api/field-protocol/community?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCommonsRecords(data);
      }
    } catch (error) {
      console.error('Error fetching commons records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectivePatterns = async () => {
    try {
      const response = await fetch('/api/field-protocol/community/patterns?timeframe=7d');
      if (response.ok) {
        const data = await response.json();
        setCollectivePatterns(data);
      }
    } catch (error) {
      console.error('Error fetching collective patterns:', error);
    }
  };

  const handleReflection = async (recordId: string) => {
    if (!reflectionText.trim()) return;

    try {
      const response = await fetch('/api/field-protocol/community/reflection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify({
          recordId,
          reflection: reflectionText,
          resonanceType,
          relatedExperience: ''
        })
      });

      if (response.ok) {
        setReflectionText('');
        // Refresh the record to show new reflection
        fetchCommonsRecords();
      }
    } catch (error) {
      console.error('Error adding reflection:', error);
    }
  };

  const handleResonance = async (recordId: string) => {
    try {
      const response = await fetch('/api/field-protocol/community/resonance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify({ recordId })
      });

      if (response.ok) {
        // Refresh to update resonance count
        fetchCommonsRecords();
      }
    } catch (error) {
      console.error('Error marking resonance:', error);
    }
  };

  const getCompletionStageLabel = (stage: number) => {
    const stages = ['Observation', 'Interpretation', 'Integration', 'Reflection', 'Transmission'];
    return stages[stage - 1] || 'Unknown';
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Community Commons
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Shared wisdom from the collective field of practitioners
          </p>
        </CardHeader>
        <CardContent>
          {/* Collective Patterns Overview */}
          {collectivePatterns && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Active Elements</span>
                </div>
                <div className="flex gap-2">
                  {Object.entries(collectivePatterns.elementDistribution || {})
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([element]) => (
                      <Badge key={element} variant="outline">
                        {ElementIcon[element as ElementType]}
                        <span className="ml-1">{element}</span>
                      </Badge>
                    ))}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium">Collective Phase</span>
                </div>
                <div>
                  {Object.entries(collectivePatterns.phaseDistribution || {})
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 1)
                    .map(([phase]) => (
                      <Badge key={phase} className={PhaseColors[phase as PhaseType]}>
                        {phase}
                      </Badge>
                    ))}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span className="font-medium">Field Resonance</span>
                </div>
                <div className="text-2xl font-bold">
                  {collectivePatterns.totalRecords || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  Active records this week
                </div>
              </div>
            </div>
          )}

          {/* Filters and Sorting */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('recent')}
              >
                <Clock className="w-4 h-4 mr-1" />
                Recent
              </Button>
              <Button
                variant={sortBy === 'resonance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('resonance')}
              >
                <Heart className="w-4 h-4 mr-1" />
                Resonance
              </Button>
              <Button
                variant={sortBy === 'completion' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('completion')}
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Complete
              </Button>
            </div>

            <div className="flex gap-1">
              {(['fire', 'water', 'air', 'earth', 'ether'] as ElementType[]).map(element => (
                <Button
                  key={element}
                  variant={elementFilter === element ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setElementFilter(elementFilter === element ? null : element)}
                >
                  {ElementIcon[element]}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commons Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {commonsRecords.map(record => (
          <Card
            key={record.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedRecord(record)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  {record.interpretation?.primaryElement && (
                    <Badge variant="outline">
                      {ElementIcon[record.interpretation.primaryElement]}
                      <span className="ml-1">{record.interpretation.primaryElement}</span>
                    </Badge>
                  )}
                  {record.interpretation?.currentPhase && (
                    <Badge className={PhaseColors[record.interpretation.currentPhase]}>
                      {record.interpretation.currentPhase}
                    </Badge>
                  )}
                </div>
                <Badge variant="secondary">
                  {getCompletionStageLabel(record.completionStage)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm mb-3 line-clamp-3">
                {record.observation.phenomena}
              </p>

              {record.reflection?.coreInsight && (
                <div className="bg-muted/50 rounded p-2 mb-3">
                  <p className="text-xs font-medium mb-1">Core Insight:</p>
                  <p className="text-xs italic line-clamp-2">
                    "{record.reflection.coreInsight}"
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">
                      {record.communityEngagement?.resonanceMarkers || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">
                      {record.communityEngagement?.reflections?.length || 0}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResonance(record.id);
                  }}
                >
                  <Heart className="w-3 h-3 mr-1" />
                  Resonate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed inset-4 md:inset-8 bg-background rounded-lg shadow-lg overflow-auto">
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Field Record Details</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRecord(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="record" className="w-full">
                  <TabsList>
                    <TabsTrigger value="record">Record</TabsTrigger>
                    <TabsTrigger value="reflections">Reflections</TabsTrigger>
                    <TabsTrigger value="engage">Engage</TabsTrigger>
                  </TabsList>

                  <TabsContent value="record" className="space-y-4">
                    {/* Display full record details */}
                    <div>
                      <h3 className="font-medium mb-2">Observation</h3>
                      <p className="text-sm">{selectedRecord.observation.phenomena}</p>
                    </div>

                    {selectedRecord.interpretation && (
                      <div>
                        <h3 className="font-medium mb-2">Interpretation</h3>
                        <p className="text-sm">{selectedRecord.interpretation.significance}</p>
                        {selectedRecord.interpretation.symbols && (
                          <div className="flex gap-2 mt-2">
                            {selectedRecord.interpretation.symbols.map((symbol, i) => (
                              <Badge key={i} variant="outline">{symbol}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedRecord.integration && (
                      <div>
                        <h3 className="font-medium mb-2">Integration</h3>
                        <p className="text-sm">{selectedRecord.integration.bodyResponse}</p>
                      </div>
                    )}

                    {selectedRecord.reflection && (
                      <div>
                        <h3 className="font-medium mb-2">Reflection</h3>
                        <p className="text-sm font-medium">
                          "{selectedRecord.reflection.coreInsight}"
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="reflections" className="space-y-4">
                    {selectedRecord.communityEngagement?.reflections?.map((reflection, i) => (
                      <Card key={i}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">
                              {reflection.userName || 'Anonymous Practitioner'}
                            </span>
                            <Badge variant="outline">
                              {reflection.resonanceType}
                            </Badge>
                          </div>
                          <p className="text-sm">{reflection.reflection}</p>
                        </CardContent>
                      </Card>
                    )) || (
                      <p className="text-center text-muted-foreground">
                        No reflections yet. Be the first to share your resonance.
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="engage" className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Add Your Reflection</h3>
                      <Textarea
                        placeholder="Share how this record resonates with your own experience..."
                        value={reflectionText}
                        onChange={(e) => setReflectionText(e.target.value)}
                        className="mb-2"
                      />
                      <div className="flex gap-2">
                        <select
                          className="px-3 py-1 rounded border"
                          value={resonanceType}
                          onChange={(e) => setResonanceType(e.target.value as any)}
                        >
                          <option value="somatic">Somatic</option>
                          <option value="emotional">Emotional</option>
                          <option value="intellectual">Intellectual</option>
                          <option value="spiritual">Spiritual</option>
                        </select>
                        <Button
                          onClick={() => handleReflection(selectedRecord.id)}
                          disabled={!reflectionText.trim()}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Reflection
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityCommonsView;