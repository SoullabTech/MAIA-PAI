'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FieldRecord,
  Element,
  TriadicPhase,
  ObservationStage,
  ValidationCriteria
} from '@/types/fieldProtocol';
import {
  Flame,
  Droplet,
  Wind,
  Mountain,
  Circle,
  Plus,
  Save,
  Send,
  Eye,
  Brain,
  Heart,
  Activity,
  Sparkles,
  CheckCircle
} from 'lucide-react';

const ELEMENTS: Element[] = ['Fire', 'Water', 'Air', 'Earth', 'Void'];
const TRIADIC_PHASES: TriadicPhase[] = ['Creation', 'Sustenance', 'Dissolution'];
const OBSERVATION_STAGES: ObservationStage[] = [
  'Observation',
  'Interpretation',
  'Integration',
  'Reflection',
  'Transmission'
];

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

interface FieldRecordFormProps {
  onSubmit?: (record: Partial<FieldRecord>) => void;
  onSave?: (record: Partial<FieldRecord>) => void;
  initialRecord?: Partial<FieldRecord>;
  practitionerId?: string;
}

export const FieldRecordForm: React.FC<FieldRecordFormProps> = ({
  onSubmit,
  onSave,
  initialRecord,
  practitionerId = 'anonymous'
}) => {
  const [record, setRecord] = useState<Partial<FieldRecord>>(initialRecord || {
    timestamp: new Date(),
    location: {},
    elementalContext: {
      dominant: [],
      triadicPhase: 'Creation',
      resonance: 0.5
    },
    phenomenon: {
      description: ''
    },
    symbolic: {},
    somatic: {},
    cognitive: {
      insights: []
    },
    application: {},
    validation: {
      criteria: []
    },
    meta: {
      practitionerId,
      visibility: 'private',
      tags: []
    },
    currentStage: 'Observation',
    stageCompletions: {}
  });

  const [currentInsight, setCurrentInsight] = useState('');
  const [currentTag, setCurrentTag] = useState('');

  const updateRecord = useCallback((path: string, value: any) => {
    setRecord(prev => {
      const keys = path.split('.');
      const newRecord = { ...prev };
      let current: any = newRecord;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newRecord;
    });
  }, []);

  const toggleElement = (element: Element) => {
    const current = record.elementalContext?.dominant || [];
    const updated = current.includes(element)
      ? current.filter(e => e !== element)
      : [...current, element];
    updateRecord('elementalContext.dominant', updated);
  };

  const addInsight = () => {
    if (currentInsight.trim()) {
      const insights = record.cognitive?.insights || [];
      updateRecord('cognitive.insights', [...insights, currentInsight.trim()]);
      setCurrentInsight('');
    }
  };

  const addTag = () => {
    if (currentTag.trim()) {
      const tags = record.meta?.tags || [];
      updateRecord('meta.tags', [...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const toggleValidationCriteria = (criteria: ValidationCriteria) => {
    const current = record.validation?.criteria || [];
    const updated = current.includes(criteria)
      ? current.filter(c => c !== criteria)
      : [...current, criteria];
    updateRecord('validation.criteria', updated);
  };

  const advanceStage = () => {
    const stages = OBSERVATION_STAGES;
    const currentIndex = stages.indexOf(record.currentStage || 'Observation');
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      updateRecord('currentStage', nextStage);
      updateRecord(`stageCompletions.${record.currentStage}`, {
        completed: true,
        timestamp: new Date()
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Spiralogic Field Record
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{record.currentStage}</Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={advanceStage}
            disabled={record.currentStage === 'Transmission'}
          >
            Advance Stage →
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="observation" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="observation">
              <Eye className="w-4 h-4 mr-1" />
              Observe
            </TabsTrigger>
            <TabsTrigger value="elemental">
              <Sparkles className="w-4 h-4 mr-1" />
              Elemental
            </TabsTrigger>
            <TabsTrigger value="somatic">
              <Heart className="w-4 h-4 mr-1" />
              Somatic
            </TabsTrigger>
            <TabsTrigger value="cognitive">
              <Brain className="w-4 h-4 mr-1" />
              Cognitive
            </TabsTrigger>
            <TabsTrigger value="validation">
              <CheckCircle className="w-4 h-4 mr-1" />
              Validate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="observation" className="space-y-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Physical or energetic location"
                value={record.location?.physical || ''}
                onChange={(e) => updateRecord('location.physical', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phenomenon">Phenomenon Description</Label>
              <Textarea
                id="phenomenon"
                placeholder="Describe what you observed without interpretation..."
                className="min-h-[150px]"
                value={record.phenomenon?.description || ''}
                onChange={(e) => updateRecord('phenomenon.description', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="How long did the observation last?"
                value={record.phenomenon?.duration || ''}
                onChange={(e) => updateRecord('phenomenon.duration', parseInt(e.target.value))}
              />
            </div>
          </TabsContent>

          <TabsContent value="elemental" className="space-y-4">
            <div>
              <Label>Dominant Elements</Label>
              <div className="flex gap-2 mt-2">
                {ELEMENTS.map(element => (
                  <Button
                    key={element}
                    variant={record.elementalContext?.dominant?.includes(element) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleElement(element)}
                  >
                    <ElementIcon element={element} />
                    <span className="ml-1">{element}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="triadic">Triadic Phase</Label>
              <Select
                value={record.elementalContext?.triadicPhase}
                onValueChange={(value) => updateRecord('elementalContext.triadicPhase', value)}
              >
                <SelectTrigger id="triadic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRIADIC_PHASES.map(phase => (
                    <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="resonance">Elemental Resonance</Label>
              <input
                id="resonance"
                type="range"
                min="0"
                max="100"
                value={(record.elementalContext?.resonance || 0.5) * 100}
                onChange={(e) => updateRecord('elementalContext.resonance', parseInt(e.target.value) / 100)}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {Math.round((record.elementalContext?.resonance || 0.5) * 100)}% resonance
              </div>
            </div>

            <div>
              <Label htmlFor="imagery">Symbolic Imagery</Label>
              <Textarea
                id="imagery"
                placeholder="Describe any symbolic images, archetypes, or mythic motifs..."
                value={record.symbolic?.imagery?.join(', ') || ''}
                onChange={(e) => updateRecord('symbolic.imagery', e.target.value.split(',').map(s => s.trim()))}
              />
            </div>
          </TabsContent>

          <TabsContent value="somatic" className="space-y-4">
            <div>
              <Label htmlFor="sensations">Physical Sensations</Label>
              <Textarea
                id="sensations"
                placeholder="Describe bodily sensations, temperature changes, energy movements..."
                value={record.somatic?.sensations?.join(', ') || ''}
                onChange={(e) => updateRecord('somatic.sensations', e.target.value.split(',').map(s => s.trim()))}
              />
            </div>

            <div>
              <Label htmlFor="emotional">Emotional Tone</Label>
              <Input
                id="emotional"
                placeholder="Primary emotional quality or tone"
                value={record.somatic?.emotionalTone || ''}
                onChange={(e) => updateRecord('somatic.emotionalTone', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="heartRate">Heart Rate</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="BPM"
                  value={record.somatic?.autonomicMarkers?.heartRate || ''}
                  onChange={(e) => updateRecord('somatic.autonomicMarkers.heartRate', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="breathing">Breathing Pattern</Label>
                <Input
                  id="breathing"
                  placeholder="Deep, shallow, rapid..."
                  value={record.somatic?.autonomicMarkers?.breathingPattern || ''}
                  onChange={(e) => updateRecord('somatic.autonomicMarkers.breathingPattern', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  placeholder="Hot, cold, neutral..."
                  value={record.somatic?.autonomicMarkers?.temperature || ''}
                  onChange={(e) => updateRecord('somatic.autonomicMarkers.temperature', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cognitive" className="space-y-4">
            <div>
              <Label>Insights</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add an insight..."
                  value={currentInsight}
                  onChange={(e) => setCurrentInsight(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInsight()}
                />
                <Button onClick={addInsight} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {record.cognitive?.insights?.map((insight, i) => (
                  <Badge key={i} variant="secondary">{insight}</Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="patterns">Patterns Recognized</Label>
              <Textarea
                id="patterns"
                placeholder="Describe any patterns, connections, or recurring themes..."
                value={record.cognitive?.patterns?.join(', ') || ''}
                onChange={(e) => updateRecord('cognitive.patterns', e.target.value.split(',').map(s => s.trim()))}
              />
            </div>

            <div>
              <Label htmlFor="actions">Applications & Actions</Label>
              <Textarea
                id="actions"
                placeholder="How will this insight inform your behavior or creative process?"
                value={record.application?.actions?.join(', ') || ''}
                onChange={(e) => updateRecord('application.actions', e.target.value.split(',').map(s => s.trim()))}
              />
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <div>
              <Label>Validation Criteria</Label>
              <div className="space-y-2 mt-2">
                {Object.values(ValidationCriteria).map(criteria => (
                  <label key={criteria} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={record.validation?.criteria?.includes(criteria)}
                      onChange={() => toggleValidationCriteria(criteria)}
                    />
                    <span className="text-sm">{criteria.replace(/_/g, ' ').toLowerCase()}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="coherence">Coherence Score</Label>
              <input
                id="coherence"
                type="range"
                min="0"
                max="100"
                value={(record.validation?.coherenceScore || 0.5) * 100}
                onChange={(e) => updateRecord('validation.coherenceScore', parseInt(e.target.value) / 100)}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground mt-1">
                {Math.round((record.validation?.coherenceScore || 0.5) * 100)}% coherence
              </div>
            </div>

            <div>
              <Label htmlFor="synchronicities">Synchronicities</Label>
              <Textarea
                id="synchronicities"
                placeholder="Note any meaningful coincidences or cross-correlations..."
                value={record.validation?.synchronicities?.join(', ') || ''}
                onChange={(e) => updateRecord('validation.synchronicities', e.target.value.split(',').map(s => s.trim()))}
              />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {record.meta?.tags?.map((tag, i) => (
                  <Badge key={i}>{tag}</Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={record.meta?.visibility}
                onValueChange={(value) => updateRecord('meta.visibility', value)}
              >
                <SelectTrigger id="visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="commons">Commons</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button onClick={() => onSave?.(record)} variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={() => onSubmit?.(record)}
            disabled={record.currentStage !== 'Transmission'}
          >
            <Send className="w-4 h-4 mr-2" />
            Transmit to Commons
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldRecordForm;