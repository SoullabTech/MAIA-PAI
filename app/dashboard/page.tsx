'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye, MessageSquare, Heart, Lightbulb, Share2,
  Plus, Clock, TrendingUp, Users
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import type { FieldRecord, PrivacyLevel } from '@/lib/field-protocol/types';

interface FieldRecordSummary {
  id: string;
  title: string;
  createdAt: Date;
  completionStage: 1 | 2 | 3 | 4 | 5;
  privacyLevel: PrivacyLevel;
  elementalSignatures?: string[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<FieldRecordSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecords: 0,
    completedRecords: 0,
    sharedRecords: 0,
    avgCompletionStage: 0
  });

  useEffect(() => {
    if (!user) {
      router.push('/field-protocol');
      return;
    }
    loadRecords();
  }, [user, router]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/field-protocol/records');
      if (response.ok) {
        const data = await response.json();
        const recordSummaries: FieldRecordSummary[] = data.records.map((r: FieldRecord) => ({
          id: r.id,
          title: r.observation?.title || 'Untitled Experience',
          createdAt: new Date(r.observation?.timestamp || Date.now()),
          completionStage: r.completionStage,
          privacyLevel: r.privacyLevel,
          elementalSignatures: r.interpretation?.elementalSignatures
        }));

        setRecords(recordSummaries);

        // Calculate stats
        const total = recordSummaries.length;
        const completed = recordSummaries.filter(r => r.completionStage === 5).length;
        const shared = recordSummaries.filter(r => r.privacyLevel === 'commons' || r.privacyLevel === 'public').length;
        const avgStage = total > 0
          ? recordSummaries.reduce((sum, r) => sum + r.completionStage, 0) / total
          : 0;

        setStats({
          totalRecords: total,
          completedRecords: completed,
          sharedRecords: shared,
          avgCompletionStage: avgStage
        });
      }
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setLoading(false);
    }
  };

  const stageIcons = [Eye, MessageSquare, Heart, Lightbulb, Share2];
  const stageColors = ['text-blue-500', 'text-purple-500', 'text-red-500', 'text-yellow-500', 'text-green-500'];
  const stageLabels = ['Observation', 'Interpretation', 'Integration', 'Reflection', 'Transmission'];

  const getStageIcon = (stage: number) => {
    const Icon = stageIcons[stage - 1];
    return Icon;
  };

  const getStageColor = (stage: number) => {
    return stageColors[stage - 1];
  };

  const getPrivacyBadgeVariant = (privacy: PrivacyLevel): "default" | "secondary" | "outline" => {
    switch (privacy) {
      case 'private': return 'default';
      case 'commons': return 'secondary';
      case 'public': return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center">Loading your consciousness records...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Field Protocol Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>
          <Button size="lg" onClick={() => router.push('/field-protocol/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Record
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRecords}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedRecords}</div>
            <p className="text-xs text-muted-foreground mt-1">All 5 stages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Shared</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.sharedRecords}</div>
            <p className="text-xs text-muted-foreground mt-1">To commons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgCompletionStage.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">Completion depth</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Guide (if no records) */}
      {records.length === 0 && (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Begin Your First Field Record</h2>
            <p className="text-muted-foreground mb-6">
              The Field Protocol is a 5-stage process for documenting consciousness experiences.
              Each stage builds on the previous, transforming raw observation into collective wisdom.
            </p>
            <div className="grid md:grid-cols-5 gap-3 mb-6">
              {stageLabels.map((label, idx) => {
                const Icon = stageIcons[idx];
                return (
                  <div key={label} className="text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${stageColors[idx]}`} />
                    <p className="text-xs font-medium">{label}</p>
                  </div>
                );
              })}
            </div>
            <Button size="lg" onClick={() => router.push('/field-protocol/new')}>
              Start Your First Record
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Records List */}
      {records.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Field Records</h2>
          <div className="space-y-4">
            {records.map((record) => {
              const StageIcon = getStageIcon(record.completionStage);
              const stageColor = getStageColor(record.completionStage);

              return (
                <Card
                  key={record.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/field-protocol/record/${record.id}`)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <StageIcon className={`w-5 h-5 ${stageColor}`} />
                          <h3 className="text-lg font-semibold">{record.title}</h3>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {record.createdAt.toLocaleDateString()}
                          </div>
                          <Badge variant={getPrivacyBadgeVariant(record.privacyLevel)}>
                            {record.privacyLevel}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Stage {record.completionStage}/5</span>
                          </div>
                        </div>

                        {record.elementalSignatures && record.elementalSignatures.length > 0 && (
                          <div className="flex gap-2">
                            {record.elementalSignatures.map((element) => (
                              <Badge key={element} variant="outline" className="text-xs">
                                {element}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Completion progress indicator */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((stage) => (
                          <div
                            key={stage}
                            className={`w-2 h-2 rounded-full ${
                              stage <= record.completionStage
                                ? 'bg-primary'
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/field-protocol/commons')}>
          <CardHeader>
            <Users className="w-8 h-8 mb-2" />
            <CardTitle>Explore Commons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Discover shared experiences and collective patterns
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/research')}>
          <CardHeader>
            <TrendingUp className="w-8 h-8 mb-2" />
            <CardTitle>View Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              See emerging patterns in your consciousness data
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/maia')}>
          <CardHeader>
            <MessageSquare className="w-8 h-8 mb-2" />
            <CardTitle>Talk with MAIA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Explore your experiences with AI guidance
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
