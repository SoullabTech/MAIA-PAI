'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Eye, MessageSquare, Heart, Lightbulb, Share2,
  ChevronRight, ChevronLeft, Save, CheckCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import type {
  ObservationRecord,
  InterpretationRecord,
  IntegrationRecord,
  ReflectionRecord,
  TransmissionRecord,
  ElementType,
  PhaseType,
  PrivacyLevel
} from '@/lib/field-protocol/types';

type Stage = 1 | 2 | 3 | 4 | 5;

export default function NewFieldRecord() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState<Stage>(1);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Stage 1: Observation
  const [observation, setObservation] = useState<Partial<ObservationRecord>>({
    timestamp: new Date(),
    title: '',
    rawDescription: '',
    sensoryDetails: { visual: '', auditory: '', kinesthetic: '', emotional: '' },
    context: { location: '', timeOfDay: '', companionship: 'solo', precedingEvents: '' },
    immediateImpact: ''
  });

  // Stage 2: Interpretation
  const [interpretation, setInterpretation] = useState<Partial<InterpretationRecord>>({
    elementalSignatures: [],
    archetypalResonances: [],
    symbolicMeaning: '',
    phaseAssessment: undefined,
    personalContext: ''
  });

  // Stage 3: Integration
  const [integration, setIntegration] = useState<Partial<IntegrationRecord>>({
    embodimentNotes: '',
    actionsTaken: [],
    resistanceObserved: '',
    supportStructures: [],
    timelineCommitment: ''
  });

  // Stage 4: Reflection
  const [reflection, setReflection] = useState<Partial<ReflectionRecord>>({
    patternsNoticed: [],
    connectionsToHistory: '',
    wisdomExtracted: '',
    questionsArising: [],
    evolutionSensed: ''
  });

  // Stage 5: Transmission
  const [transmission, setTransmission] = useState<Partial<TransmissionRecord>>({
    publicInsight: '',
    practicalGuidance: '',
    poeticExpression: '',
    privacyLevel: 'private' as PrivacyLevel,
    tags: [],
    contributionToCommons: ''
  });

  const stages = [
    { num: 1, icon: Eye, label: 'Observation', color: 'text-blue-500' },
    { num: 2, icon: MessageSquare, label: 'Interpretation', color: 'text-purple-500' },
    { num: 3, icon: Heart, label: 'Integration', color: 'text-red-500' },
    { num: 4, icon: Lightbulb, label: 'Reflection', color: 'text-yellow-500' },
    { num: 5, icon: Share2, label: 'Transmission', color: 'text-green-500' }
  ];

  const elementOptions: ElementType[] = ['fire', 'water', 'air', 'earth', 'ether'];
  const phaseOptions: PhaseType[] = ['creation', 'preservation', 'dissolution', 'void', 'emergence'];

  const handleSave = async () => {
    if (!user) {
      setSaveMessage('Please sign in to save records');
      return;
    }

    setSaving(true);
    setSaveMessage('');

    try {
      const fieldRecord = {
        observation: observation as ObservationRecord,
        interpretation: currentStage >= 2 ? (interpretation as InterpretationRecord) : undefined,
        integration: currentStage >= 3 ? (integration as IntegrationRecord) : undefined,
        reflection: currentStage >= 4 ? (reflection as ReflectionRecord) : undefined,
        transmission: currentStage >= 5 ? (transmission as TransmissionRecord) : undefined,
        completionStage: currentStage,
        privacyLevel: transmission.privacyLevel || 'private'
      };

      const response = await fetch('/api/field-protocol/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldRecord)
      });

      if (response.ok) {
        setSaveMessage('Saved successfully!');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        const error = await response.json();
        setSaveMessage(`Error: ${error.message || 'Failed to save'}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage('Error saving record');
    } finally {
      setSaving(false);
    }
  };

  const toggleElement = (element: ElementType) => {
    setInterpretation(prev => ({
      ...prev,
      elementalSignatures: prev.elementalSignatures?.includes(element)
        ? prev.elementalSignatures.filter(e => e !== element)
        : [...(prev.elementalSignatures || []), element]
    }));
  };

  const addToArray = (field: 'actionsTaken' | 'supportStructures' | 'patternsNoticed' | 'questionsArising' | 'tags', value: string) => {
    if (!value.trim()) return;

    if (field === 'actionsTaken' || field === 'supportStructures') {
      setIntegration(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
    } else if (field === 'patternsNoticed' || field === 'questionsArising') {
      setReflection(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
    } else if (field === 'tags') {
      setTransmission(prev => ({
        ...prev,
        tags: [...(prev.tags || []), value.trim()]
      }));
    }
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Experience Title</Label>
              <Input
                id="title"
                placeholder="Give this experience a name..."
                value={observation.title}
                onChange={(e) => setObservation({ ...observation, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rawDescription">Raw Description</Label>
              <Textarea
                id="rawDescription"
                placeholder="What happened? Describe the experience without interpretation..."
                rows={6}
                value={observation.rawDescription}
                onChange={(e) => setObservation({ ...observation, rawDescription: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Just the facts. What you saw, felt, heard - without why or what it means.
              </p>
            </div>

            <div className="space-y-4">
              <Label>Sensory Details</Label>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visual" className="text-sm">Visual</Label>
                  <Textarea
                    id="visual"
                    placeholder="What you saw..."
                    rows={3}
                    value={observation.sensoryDetails?.visual}
                    onChange={(e) => setObservation({
                      ...observation,
                      sensoryDetails: { ...observation.sensoryDetails!, visual: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auditory" className="text-sm">Auditory</Label>
                  <Textarea
                    id="auditory"
                    placeholder="What you heard..."
                    rows={3}
                    value={observation.sensoryDetails?.auditory}
                    onChange={(e) => setObservation({
                      ...observation,
                      sensoryDetails: { ...observation.sensoryDetails!, auditory: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kinesthetic" className="text-sm">Kinesthetic</Label>
                  <Textarea
                    id="kinesthetic"
                    placeholder="Body sensations..."
                    rows={3}
                    value={observation.sensoryDetails?.kinesthetic}
                    onChange={(e) => setObservation({
                      ...observation,
                      sensoryDetails: { ...observation.sensoryDetails!, kinesthetic: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emotional" className="text-sm">Emotional</Label>
                  <Textarea
                    id="emotional"
                    placeholder="Emotional tones..."
                    rows={3}
                    value={observation.sensoryDetails?.emotional}
                    onChange={(e) => setObservation({
                      ...observation,
                      sensoryDetails: { ...observation.sensoryDetails!, emotional: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="immediateImpact">Immediate Impact</Label>
              <Textarea
                id="immediateImpact"
                placeholder="How did you feel immediately after?"
                rows={3}
                value={observation.immediateImpact}
                onChange={(e) => setObservation({ ...observation, immediateImpact: e.target.value })}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Elemental Signatures</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Which elements were present in this experience?
              </p>
              <div className="flex flex-wrap gap-2">
                {elementOptions.map((element) => (
                  <Badge
                    key={element}
                    variant={interpretation.elementalSignatures?.includes(element) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleElement(element)}
                  >
                    {element}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phaseAssessment">Phase Assessment</Label>
              <select
                id="phaseAssessment"
                className="w-full border rounded-md p-2"
                value={interpretation.phaseAssessment || ''}
                onChange={(e) => setInterpretation({
                  ...interpretation,
                  phaseAssessment: e.target.value as PhaseType
                })}
              >
                <option value="">Select a phase...</option>
                {phaseOptions.map((phase) => (
                  <option key={phase} value={phase}>{phase}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbolicMeaning">Symbolic Meaning</Label>
              <Textarea
                id="symbolicMeaning"
                placeholder="What symbols or archetypes appeared? What might they represent?"
                rows={4}
                value={interpretation.symbolicMeaning}
                onChange={(e) => setInterpretation({ ...interpretation, symbolicMeaning: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalContext">Personal Context</Label>
              <Textarea
                id="personalContext"
                placeholder="How does this relate to your life right now?"
                rows={4}
                value={interpretation.personalContext}
                onChange={(e) => setInterpretation({ ...interpretation, personalContext: e.target.value })}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="embodimentNotes">Embodiment Notes</Label>
              <Textarea
                id="embodimentNotes"
                placeholder="How are you living this insight? What's changing in your daily life?"
                rows={5}
                value={integration.embodimentNotes}
                onChange={(e) => setIntegration({ ...integration, embodimentNotes: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resistanceObserved">Resistance Observed</Label>
              <Textarea
                id="resistanceObserved"
                placeholder="What internal or external resistance are you noticing?"
                rows={4}
                value={integration.resistanceObserved}
                onChange={(e) => setIntegration({ ...integration, resistanceObserved: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timelineCommitment">Timeline Commitment</Label>
              <Textarea
                id="timelineCommitment"
                placeholder="What's your commitment for integrating this? What timeline feels right?"
                rows={3}
                value={integration.timelineCommitment}
                onChange={(e) => setIntegration({ ...integration, timelineCommitment: e.target.value })}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="wisdomExtracted">Wisdom Extracted</Label>
              <Textarea
                id="wisdomExtracted"
                placeholder="What have you learned? What insight has emerged?"
                rows={5}
                value={reflection.wisdomExtracted}
                onChange={(e) => setReflection({ ...reflection, wisdomExtracted: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="connectionsToHistory">Connections to History</Label>
              <Textarea
                id="connectionsToHistory"
                placeholder="How does this connect to past experiences? What patterns do you see?"
                rows={4}
                value={reflection.connectionsToHistory}
                onChange={(e) => setReflection({ ...reflection, connectionsToHistory: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evolutionSensed">Evolution Sensed</Label>
              <Textarea
                id="evolutionSensed"
                placeholder="How are you different now? What has shifted?"
                rows={4}
                value={reflection.evolutionSensed}
                onChange={(e) => setReflection({ ...reflection, evolutionSensed: e.target.value })}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="publicInsight">Public Insight</Label>
              <Textarea
                id="publicInsight"
                placeholder="What can you share with others? What universal truth did you touch?"
                rows={5}
                value={transmission.publicInsight}
                onChange={(e) => setTransmission({ ...transmission, publicInsight: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="practicalGuidance">Practical Guidance</Label>
              <Textarea
                id="practicalGuidance"
                placeholder="What advice would you give someone having a similar experience?"
                rows={4}
                value={transmission.practicalGuidance}
                onChange={(e) => setTransmission({ ...transmission, practicalGuidance: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poeticExpression">Poetic Expression (Optional)</Label>
              <Textarea
                id="poeticExpression"
                placeholder="Express this experience poetically, symbolically, or artistically..."
                rows={4}
                value={transmission.poeticExpression}
                onChange={(e) => setTransmission({ ...transmission, poeticExpression: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="privacyLevel">Privacy Level</Label>
              <select
                id="privacyLevel"
                className="w-full border rounded-md p-2"
                value={transmission.privacyLevel}
                onChange={(e) => setTransmission({
                  ...transmission,
                  privacyLevel: e.target.value as PrivacyLevel
                })}
              >
                <option value="private">Private - Only you can see this</option>
                <option value="commons">Commons - Shared anonymously with community</option>
                <option value="public">Public - Visible with your identity</option>
              </select>
            </div>
          </div>
        );
    }
  };

  const canProceed = () => {
    if (currentStage === 1) {
      return observation.title && observation.rawDescription;
    }
    return true;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = currentStage === stage.num;
            const isCompleted = currentStage > stage.num;

            return (
              <div key={stage.num} className="flex items-center flex-1">
                <div
                  className={`flex flex-col items-center cursor-pointer ${
                    isCompleted || isActive ? '' : 'opacity-50'
                  }`}
                  onClick={() => setCurrentStage(stage.num as Stage)}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-muted'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className={`text-xs text-center ${isActive ? 'font-bold' : ''}`}>
                    {stage.label}
                  </span>
                </div>
                {idx < stages.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Stage Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(stages[currentStage - 1].icon, {
              className: `w-6 h-6 ${stages[currentStage - 1].color}`
            })}
            Stage {currentStage}: {stages[currentStage - 1].label}
          </CardTitle>
          <CardDescription>
            {currentStage === 1 && "Capture the raw experience without interpretation"}
            {currentStage === 2 && "Apply elemental and archetypal frameworks"}
            {currentStage === 3 && "Document how you're embodying this wisdom"}
            {currentStage === 4 && "Extract patterns and deeper understanding"}
            {currentStage === 5 && "Share your insights with the community"}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderStage()}</CardContent>
      </Card>

      {/* Navigation & Save */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentStage(Math.max(1, currentStage - 1) as Stage)}
          disabled={currentStage === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {saveMessage}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={saving || !canProceed()}>
            <Save className="w-4 h-4 mr-2" />
            Save Progress
          </Button>

          {currentStage < 5 ? (
            <Button
              onClick={() => setCurrentStage(Math.min(5, currentStage + 1) as Stage)}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={saving || !canProceed()}>
              Complete & Save
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
