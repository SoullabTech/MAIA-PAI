'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { StageProgressIndicator } from './StageProgressIndicator';
import { useFieldProtocol } from '@/hooks/useFieldProtocol';
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
  CheckCircle,
  Users,
  MessageCircle,
  HelpCircle,
  Clock,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ELEMENTS: Element[] = ['Fire', 'Water', 'Air', 'Earth', 'Void'];
const TRIADIC_PHASES: TriadicPhase[] = ['Creation', 'Sustenance', 'Dissolution'];

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

interface EnhancedFieldRecordFormProps {
  practitionerId?: string;
  onComplete?: (record: Partial<FieldRecord>) => void;
}

export const EnhancedFieldRecordForm: React.FC<EnhancedFieldRecordFormProps> = ({
  practitionerId = 'anonymous',
  onComplete
}) => {
  const {
    record,
    updateRecord,
    advanceStage,
    toggleElement,
    toggleValidationCriteria,
    calculateCompletion,
    saveToDatabase,
    transmitToCommons,
    isDirty,
    isSaving
  } = useFieldProtocol({
    practitionerId,
    autoSave: true,
    autoSaveInterval: 30000,
    onStageComplete: (stage, record) => {
      console.log(`Completed stage: ${stage}`, record);
    }
  });

  const [currentInsight, setCurrentInsight] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [activeTab, setActiveTab] = useState('observation');
  const [showTips, setShowTips] = useState(true);
  const completionPercentage = calculateCompletion();

  // Get completed stages
  const completedStages = Object.entries(record.stageCompletions || {})
    .filter(([_, completion]) => completion?.completed)
    .map(([stage]) => stage as ObservationStage);

  const addInsight = () => {
    if (currentInsight.trim()) {
      const insights = record.cognitive?.insights || [];
      updateRecord('cognitive.insights', [...insights, currentInsight.trim()]);
      setCurrentInsight('');
      toast.success('Insight added');
    }
  };

  const addTag = () => {
    if (currentTag.trim()) {
      const tags = record.meta?.tags || [];
      updateRecord('meta.tags', [...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeInsight = (index: number) => {
    const insights = record.cognitive?.insights || [];
    updateRecord('cognitive.insights', insights.filter((_, i) => i !== index));
  };

  const removeTag = (index: number) => {
    const tags = record.meta?.tags || [];
    updateRecord('meta.tags', tags.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    const saved = await saveToDatabase();
    if (saved) {
      toast.success('Draft saved successfully', {
        icon: '💾',
        duration: 2000,
      });
    } else {
      toast.error('Failed to save draft');
    }
  };

  const handleTransmit = async () => {
    const success = await transmitToCommons();
    if (success && onComplete) {
      onComplete(record);
    }
  };

  // Stage-based tips
  const getStageTips = () => {
    const tips = {
      Observation: 'Focus on pure observation without judgment. Document what you see, hear, and sense.',
      Interpretation: 'Explore the symbolic and archetypal layers. What patterns and meanings emerge?',
      Integration: 'Connect your insights with your lived experience. How does this inform your understanding?',
      Reflection: 'Look for synchronicities and validation. What confirms or challenges your observations?',
      Transmission: 'Prepare to share your wisdom. How can others benefit from your insights?'
    };
    return tips[record.currentStage || 'Observation'];
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header with Progress */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Spiralogic Field Record
            </CardTitle>
            <div className="flex items-center gap-4">
              {isDirty && (
                <Badge variant="outline" className="animate-pulse">
                  <Clock className="w-3 h-3 mr-1" />
                  Unsaved changes
                </Badge>
              )}
              {isSaving && (
                <Badge variant="secondary">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Saving...
                </Badge>
              )}
              <Badge variant="outline">
                {completionPercentage}% Complete
              </Badge>
            </div>
          </div>

          {/* Stage Progress Indicator */}
          <StageProgressIndicator
            currentStage={record.currentStage || 'Observation'}
            completedStages={completedStages}
            onStageClick={(stage) => {
              const stageIndex = ['Observation', 'Interpretation', 'Integration', 'Reflection', 'Transmission'].indexOf(stage);
              const tabMap = ['observation', 'elemental', 'cognitive', 'validation', 'engagement'];
              setActiveTab(tabMap[Math.min(stageIndex, tabMap.length - 1)]);
            }}
            className="mt-6"
          />
        </CardHeader>
      </Card>

      {/* Tips Alert */}
      {showTips && (
        <Alert className="border-purple-200 dark:border-purple-800">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{getStageTips()}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTips(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Form */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="observation">
                <Eye className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Observe</span>
              </TabsTrigger>
              <TabsTrigger value="elemental">
                <Sparkles className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Elemental</span>
              </TabsTrigger>
              <TabsTrigger value="somatic">
                <Heart className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Somatic</span>
              </TabsTrigger>
              <TabsTrigger value="cognitive">
                <Brain className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Cognitive</span>
              </TabsTrigger>
              <TabsTrigger value="engagement">
                <Users className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Engage</span>
              </TabsTrigger>
              <TabsTrigger value="validation">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Validate</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents - Same as original but with better UX */}
            <TabsContent value="observation" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Observation duration"
                    value={record.phenomenon?.duration || ''}
                    onChange={(e) => updateRecord('phenomenon.duration', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phenomenon">Phenomenon Description *</Label>
                <Textarea
                  id="phenomenon"
                  placeholder="Describe what you observed without interpretation..."
                  className="min-h-[200px]"
                  value={record.phenomenon?.description || ''}
                  onChange={(e) => updateRecord('phenomenon.description', e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(record.phenomenon?.description || '').length} characters
                </p>
              </div>
            </TabsContent>

            <TabsContent value="elemental" className="space-y-4 mt-6">
              <div>
                <Label>Dominant Elements</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ELEMENTS.map(element => (
                    <motion.div
                      key={element}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={record.elementalContext?.dominant?.includes(element) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleElement(element)}
                        className="transition-all"
                      >
                        <ElementIcon element={element} />
                        <span className="ml-1">{element}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <input
                      id="resonance"
                      type="range"
                      min="0"
                      max="100"
                      value={(record.elementalContext?.resonance || 0.5) * 100}
                      onChange={(e) => updateRecord('elementalContext.resonance', parseInt(e.target.value) / 100)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span className="font-medium">
                        {Math.round((record.elementalContext?.resonance || 0.5) * 100)}%
                      </span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="imagery">Symbolic Imagery</Label>
                <Textarea
                  id="imagery"
                  placeholder="Describe any symbolic images, archetypes, or mythic motifs..."
                  value={record.symbolic?.imagery?.join(', ') || ''}
                  onChange={(e) => updateRecord('symbolic.imagery', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
            </TabsContent>

            <TabsContent value="somatic" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="sensations">Physical Sensations</Label>
                <Textarea
                  id="sensations"
                  placeholder="Describe bodily sensations, temperature changes, energy movements..."
                  value={record.somatic?.sensations?.join(', ') || ''}
                  onChange={(e) => updateRecord('somatic.sensations', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="60-100"
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

            <TabsContent value="cognitive" className="space-y-4 mt-6">
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
                <div className="flex flex-wrap gap-2 mt-3">
                  <AnimatePresence>
                    {record.cognitive?.insights?.map((insight, i) => (
                      <motion.div
                        key={`insight-${i}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge variant="secondary" className="pr-1">
                          {insight}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => removeInsight(i)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <Label htmlFor="patterns">Patterns Recognized</Label>
                <Textarea
                  id="patterns"
                  placeholder="Describe any patterns, connections, or recurring themes..."
                  value={record.cognitive?.patterns?.join(', ') || ''}
                  onChange={(e) => updateRecord('cognitive.patterns', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>

              <div>
                <Label htmlFor="actions">Applications & Actions</Label>
                <Textarea
                  id="actions"
                  placeholder="How will this insight inform your behavior or creative process?"
                  value={record.application?.actions?.join(', ') || ''}
                  onChange={(e) => updateRecord('application.actions', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4 mt-6">
              <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                <Users className="w-4 h-4" />
                <AlertDescription>
                  <strong>Community Engagement Space</strong>
                  <p className="text-sm mt-1">
                    Enable sharing to allow members to engage with your observation through reflections and questions.
                  </p>
                </AlertDescription>
              </Alert>

              <div>
                <Label>Visibility Settings</Label>
                <Select
                  value={record.meta?.visibility}
                  onValueChange={(value) => updateRecord('meta.visibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">
                      <div>
                        <p className="font-medium">Private</p>
                        <p className="text-xs text-muted-foreground">Only you can see this record</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="commons">
                      <div>
                        <p className="font-medium">Commons</p>
                        <p className="text-xs text-muted-foreground">Share with the community</p>
                      </div>
                    </SelectItem>
                    <SelectItem value="public">
                      <div>
                        <p className="font-medium">Public</p>
                        <p className="text-xs text-muted-foreground">Visible to everyone</p>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {record.meta?.visibility !== 'private' && (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    Your record will be shared with the {record.meta?.visibility} once you transmit it.
                    Community members will be able to provide reflections and ask questions.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="validation" className="space-y-4 mt-6">
              <div>
                <Label>Validation Criteria</Label>
                <div className="space-y-2 mt-2">
                  {Object.values(ValidationCriteria).map(criteria => (
                    <label key={criteria} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={record.validation?.criteria?.includes(criteria)}
                        onChange={() => toggleValidationCriteria(criteria)}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">
                        {criteria.replace(/_/g, ' ').toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="coherence">Coherence Score</Label>
                <div className="space-y-2">
                  <input
                    id="coherence"
                    type="range"
                    min="0"
                    max="100"
                    value={(record.validation?.coherenceScore || 0.5) * 100}
                    onChange={(e) => updateRecord('validation.coherenceScore', parseInt(e.target.value) / 100)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Fragmented</span>
                    <span className="font-medium text-base">
                      {Math.round((record.validation?.coherenceScore || 0.5) * 100)}%
                    </span>
                    <span>Coherent</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="synchronicities">Synchronicities</Label>
                <Textarea
                  id="synchronicities"
                  placeholder="Note any meaningful coincidences or cross-correlations..."
                  value={record.validation?.synchronicities?.join(', ') || ''}
                  onChange={(e) => updateRecord('validation.synchronicities', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
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
                <div className="flex flex-wrap gap-2 mt-3">
                  <AnimatePresence>
                    {record.meta?.tags?.map((tag, i) => (
                      <motion.div
                        key={`tag-${i}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge className="pr-1">
                          #{tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => removeTag(i)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div className="flex gap-2">
              <Button onClick={handleSaveDraft} variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={advanceStage}
                variant="secondary"
                disabled={record.currentStage === 'Transmission'}
              >
                <Activity className="w-4 h-4 mr-2" />
                Advance Stage
              </Button>
            </div>

            <Button
              onClick={handleTransmit}
              disabled={record.currentStage !== 'Transmission'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Transmit to Commons
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedFieldRecordForm;