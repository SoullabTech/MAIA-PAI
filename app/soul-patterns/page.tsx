'use client';

/**
 * SOUL PATTERNS DASHBOARD
 *
 * Displays longitudinal patterns across multiple holoflower readings.
 * Shows user's elemental journey, archetypal evolution, and growth trajectory.
 */

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Eye, TrendingUp, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import type { SoulPattern } from '@/types/journal';

interface PatternDisplay {
  type: string;
  title: string;
  description: string;
  insight?: string;
  data: any;
  confidence: number;
  occurrenceCount: number;
  firstSeen: Date;
  lastSeen: Date;
}

export default function SoulPatternsPage() {
  const [patterns, setPatterns] = useState<PatternDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [encounterCount, setEncounterCount] = useState(0);

  useEffect(() => {
    loadSoulPatterns();
  }, []);

  const loadSoulPatterns = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch soul patterns
      const { data: rawPatterns, error } = await supabase
        .from('soul_patterns')
        .select('*')
        .eq('user_id', user.id)
        .order('last_observed', { ascending: false });

      if (error) {
        console.error('Error loading soul patterns:', error);
        setIsLoading(false);
        return;
      }

      // Fetch encounter count from relationship essence
      const { data: essenceData } = await supabase
        .from('relationship_essences')
        .select('encounter_count')
        .eq('user_id', user.id)
        .eq('agent_id', 'holoflower-oracle')
        .single();

      if (essenceData) {
        setEncounterCount(essenceData.encounter_count);
      }

      // Transform patterns for display
      const displayPatterns: PatternDisplay[] = (rawPatterns || []).map((p: any) => {
        return {
          type: p.pattern_type,
          title: formatPatternTitle(p.pattern_type),
          description: formatPatternDescription(p.pattern_type, p.pattern_data),
          insight: p.insight,
          data: p.pattern_data,
          confidence: p.confidence_score || 0,
          occurrenceCount: p.occurrence_count,
          firstSeen: new Date(p.first_observed),
          lastSeen: new Date(p.last_observed)
        };
      });

      setPatterns(displayPatterns);
      setIsLoading(false);

    } catch (error) {
      console.error('Error loading patterns:', error);
      setIsLoading(false);
    }
  };

  const formatPatternTitle = (type: string): string => {
    const titles: Record<string, string> = {
      'dominant_element': 'Your Elemental Signature',
      'growth_trajectory': 'Growth Trajectory',
      'recurring_archetypes': 'Recurring Archetypes',
      'shadow_integration': 'Shadow Integration Arc'
    };
    return titles[type] || type;
  };

  const formatPatternDescription = (type: string, data: any): string => {
    switch (type) {
      case 'dominant_element':
        const element = data.dominant_element;
        const percentage = data.percentage;
        const elementDescriptions: Record<string, string> = {
          fire: 'You consistently move through life with spiritual vision and creative power',
          water: 'Your journey is guided by emotional wisdom and deep feeling',
          earth: 'You ground your work in purpose and tangible manifestation',
          air: 'Mental clarity and authentic connection guide your path'
        };
        return `${elementDescriptions[element]} (${percentage}% of readings)`;

      case 'growth_trajectory':
        if (data.direction === 'ascending') {
          return `You're moving toward ${data.target_element} - ${data.description}`;
        } else if (data.direction === 'integrating') {
          return `You're integrating multiple elements: ${data.elements.join(', ')}`;
        }
        return data.description || 'Your journey is unfolding';

      case 'recurring_archetypes':
        const archetypes = data.archetypes || [];
        return `These energies appear repeatedly: ${archetypes.join(', ')}`;

      case 'shadow_integration':
        return data.description || 'You're working with shadow integration';

      default:
        return JSON.stringify(data);
    }
  };

  const getElementColor = (element: string): string => {
    const colors: Record<string, string> = {
      fire: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
      water: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      earth: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
      air: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
    };
    return colors[element] || 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-amber-400 text-lg">Loading your soul patterns...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold text-amber-100">Soul Patterns</h1>
          </div>
          <p className="text-amber-300/80 text-lg">
            MAIA&apos;s longitudinal understanding of your journey across {encounterCount} encounter{encounterCount !== 1 ? 's' : ''}
          </p>
        </div>

        {patterns.length === 0 ? (
          <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-600/20 rounded-2xl p-12 text-center">
            <Eye className="w-16 h-16 text-amber-400/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-amber-200 mb-2">
              No Patterns Detected Yet
            </h3>
            <p className="text-amber-300/70">
              Complete at least 3 holoflower readings for MAIA to begin recognizing your soul patterns.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {patterns.map((pattern, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${pattern.data.dominant_element ? getElementColor(pattern.data.dominant_element) : 'from-amber-900/20 to-orange-900/20'} backdrop-blur-xl border rounded-2xl p-8 shadow-2xl`}
              >
                {/* Pattern Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-amber-100 mb-2">
                      {pattern.title}
                    </h3>
                    <p className="text-amber-200/90 text-lg leading-relaxed">
                      {pattern.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 text-sm font-medium mb-1">
                      {pattern.confidence > 0 ? `${Math.round(pattern.confidence * 100)}% confidence` : ''}
                    </div>
                    <div className="text-amber-300/70 text-xs">
                      {pattern.occurrenceCount} occurrence{pattern.occurrenceCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Pattern Insight */}
                {pattern.insight && (
                  <div className="bg-amber-950/40 rounded-lg p-6 mb-6 border border-amber-600/10">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-200/95 leading-relaxed italic">
                        {pattern.insight}
                      </p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="flex items-center gap-4 text-sm text-amber-300/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>First seen: {pattern.firstSeen.toLocaleDateString()}</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                  <div>
                    <span>Last seen: {pattern.lastSeen.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {encounterCount < 3 && (
          <div className="mt-12 text-center">
            <a
              href="/oracle/holoflower"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Take Another Reading
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
