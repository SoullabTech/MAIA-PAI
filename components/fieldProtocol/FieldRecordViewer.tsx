'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FieldRecord,
  Element,
  ValidationCriteria
} from '@/types/fieldProtocol';
import {
  Calendar,
  MapPin,
  Flame,
  Droplet,
  Wind,
  Mountain,
  Circle,
  Eye,
  Brain,
  Heart,
  Sparkles,
  CheckCircle,
  Clock,
  User,
  Share2,
  Link
} from 'lucide-react';

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

interface FieldRecordViewerProps {
  record: FieldRecord;
  showValidation?: boolean;
  showMeta?: boolean;
  onLink?: (recordId: string) => void;
}

export const FieldRecordViewer: React.FC<FieldRecordViewerProps> = ({
  record,
  showValidation = true,
  showMeta = true,
  onLink
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStageProgress = () => {
    const stages = ['Observation', 'Interpretation', 'Integration', 'Reflection', 'Transmission'];
    const completed = stages.filter(
      stage => record.stageCompletions[stage as keyof typeof record.stageCompletions]?.completed
    ).length;
    return (completed / stages.length) * 100;
  };

  const getValidationBadgeColor = (criteria: ValidationCriteria) => {
    const result = record.validation?.criteria?.includes(criteria);
    return result ? 'default' : 'outline';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Field Record #{record.id.slice(0, 8)}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(record.timestamp)}
              </div>
              {record.location.physical && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {record.location.physical}
                </div>
              )}
              {record.phenomenon.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {record.phenomenon.duration} min
                </div>
              )}
            </div>
          </div>

          {showMeta && (
            <div className="flex flex-col items-end gap-2">
              <Badge variant={record.meta.visibility === 'public' ? 'default' : 'outline'}>
                {record.meta.visibility}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Stage: {record.currentStage}
              </div>
            </div>
          )}
        </div>

        <Progress value={getStageProgress()} className="mt-4" />
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="phenomenon" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="phenomenon">
              <Eye className="w-4 h-4 mr-1" />
              Phenomenon
            </TabsTrigger>
            <TabsTrigger value="elemental">
              <Sparkles className="w-4 h-4 mr-1" />
              Elemental
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Brain className="w-4 h-4 mr-1" />
              Insights
            </TabsTrigger>
            {showValidation && (
              <TabsTrigger value="validation">
                <CheckCircle className="w-4 h-4 mr-1" />
                Validation
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="phenomenon" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm leading-relaxed">{record.phenomenon.description}</p>
            </div>

            {record.phenomenon.objectiveMarkers && record.phenomenon.objectiveMarkers.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Objective Markers</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {record.phenomenon.objectiveMarkers.map((marker, i) => (
                    <li key={i}>{marker}</li>
                  ))}
                </ul>
              </div>
            )}

            {record.somatic.emotionalTone && (
              <div>
                <h4 className="font-semibold mb-2">Emotional Tone</h4>
                <Badge variant="secondary">
                  <Heart className="w-3 h-3 mr-1" />
                  {record.somatic.emotionalTone}
                </Badge>
              </div>
            )}

            {record.somatic.sensations && record.somatic.sensations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Physical Sensations</h4>
                <div className="flex flex-wrap gap-2">
                  {record.somatic.sensations.map((sensation, i) => (
                    <Badge key={i} variant="outline">{sensation}</Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="elemental" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Dominant Elements</h4>
              <div className="flex gap-2">
                {record.elementalContext.dominant.map(element => (
                  <Badge key={element} className="flex items-center gap-1">
                    <ElementIcon element={element} />
                    {element}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Triadic Phase</h4>
              <Badge variant="secondary">{record.elementalContext.triadicPhase}</Badge>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Elemental Resonance</h4>
              <div className="flex items-center gap-2">
                <Progress value={record.elementalContext.resonance * 100} className="flex-1" />
                <span className="text-sm">{Math.round(record.elementalContext.resonance * 100)}%</span>
              </div>
            </div>

            {record.symbolic.imagery && record.symbolic.imagery.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Symbolic Imagery</h4>
                <div className="flex flex-wrap gap-2">
                  {record.symbolic.imagery.map((image, i) => (
                    <Badge key={i} variant="outline">{image}</Badge>
                  ))}
                </div>
              </div>
            )}

            {record.symbolic.archetypes && record.symbolic.archetypes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Archetypes</h4>
                <div className="flex flex-wrap gap-2">
                  {record.symbolic.archetypes.map((archetype, i) => (
                    <Badge key={i} variant="secondary">{archetype}</Badge>
                  ))}
                </div>
              </div>
            )}

            {record.symbolic.mythicMotifs && record.symbolic.mythicMotifs.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Mythic Motifs</h4>
                <div className="flex flex-wrap gap-2">
                  {record.symbolic.mythicMotifs.map((motif, i) => (
                    <Badge key={i} variant="outline">{motif}</Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            {record.cognitive.insights.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Key Insights</h4>
                <ul className="space-y-2">
                  {record.cognitive.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <span className="text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {record.cognitive.patterns && record.cognitive.patterns.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Patterns Recognized</h4>
                <div className="flex flex-wrap gap-2">
                  {record.cognitive.patterns.map((pattern, i) => (
                    <Badge key={i} variant="secondary">{pattern}</Badge>
                  ))}
                </div>
              </div>
            )}

            {record.application.actions && record.application.actions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Applications</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {record.application.actions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {record.application.perceptualShifts && record.application.perceptualShifts.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Perceptual Shifts</h4>
                <div className="flex flex-wrap gap-2">
                  {record.application.perceptualShifts.map((shift, i) => (
                    <Badge key={i} variant="outline">{shift}</Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {showValidation && (
            <TabsContent value="validation" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Validation Criteria</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(ValidationCriteria).map(criteria => (
                    <div key={criteria} className="flex items-center gap-2">
                      <Badge variant={getValidationBadgeColor(criteria)}>
                        {record.validation.criteria.includes(criteria) ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : null}
                        {criteria.replace(/_/g, ' ').toLowerCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {record.validation.coherenceScore !== undefined && (
                <div>
                  <h4 className="font-semibold mb-2">Coherence Score</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={record.validation.coherenceScore * 100} className="flex-1" />
                    <span className="text-sm font-medium">
                      {Math.round(record.validation.coherenceScore * 100)}%
                    </span>
                  </div>
                </div>
              )}

              {record.validation.synchronicities && record.validation.synchronicities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Synchronicities</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {record.validation.synchronicities.map((sync, i) => (
                      <li key={i}>{sync}</li>
                    ))}
                  </ul>
                </div>
              )}

              {record.validation.peerValidation && record.validation.peerValidation.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Peer Validations</h4>
                  <div className="space-y-2">
                    {record.validation.peerValidation.map((validation, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <User className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            Validator: {validation.validatorId?.slice(0, 8)}
                          </div>
                          {validation.notes && (
                            <div className="text-muted-foreground">{validation.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {record.meta.linkedRecords && record.meta.linkedRecords.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Linked Records</h4>
                  <div className="flex flex-wrap gap-2">
                    {record.meta.linkedRecords.map((linkedId, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => onLink?.(linkedId)}
                      >
                        <Link className="w-3 h-3 mr-1" />
                        {linkedId.slice(0, 8)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>

        {record.meta.tags && record.meta.tags.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {record.meta.tags.map((tag, i) => (
                <Badge key={i} variant="secondary">#{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FieldRecordViewer;