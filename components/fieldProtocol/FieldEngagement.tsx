'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  FieldRecord,
  Element
} from '@/types/fieldProtocol';
import {
  MessageCircle,
  HelpCircle,
  Heart,
  Sparkles,
  Zap,
  Eye,
  Users,
  Send,
  ThumbsUp,
  Share2,
  Lightbulb,
  Compass
} from 'lucide-react';

interface FieldEngagementProps {
  record: FieldRecord;
  currentMemberId?: string;
  currentMemberName?: string;
  onAddReflection?: (reflection: {
    content: string;
    elementalResonance?: Element[];
    insightAmplification?: string;
  }) => void;
  onAddQuestion?: (question: string) => void;
  onAnswerQuestion?: (questionIndex: number, response: string) => void;
  onAddResonance?: (type: 'resonance' | 'amplification' | 'clarification' | 'integration') => void;
}

export const FieldEngagement: React.FC<FieldEngagementProps> = ({
  record,
  currentMemberId = 'anonymous',
  currentMemberName,
  onAddReflection,
  onAddQuestion,
  onAnswerQuestion,
  onAddResonance
}) => {
  const [reflectionContent, setReflectionContent] = useState('');
  const [selectedElements, setSelectedElements] = useState<Element[]>([]);
  const [insightAmplification, setInsightAmplification] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [responseContent, setResponseContent] = useState('');
  const [respondingToQuestion, setRespondingToQuestion] = useState<number | null>(null);

  const isOwner = record.meta.practitionerId === currentMemberId;

  const handleSubmitReflection = () => {
    if (reflectionContent.trim() && onAddReflection) {
      onAddReflection({
        content: reflectionContent,
        elementalResonance: selectedElements.length > 0 ? selectedElements : undefined,
        insightAmplification: insightAmplification.trim() || undefined
      });
      setReflectionContent('');
      setSelectedElements([]);
      setInsightAmplification('');
    }
  };

  const handleSubmitQuestion = () => {
    if (questionContent.trim() && onAddQuestion) {
      onAddQuestion(questionContent);
      setQuestionContent('');
    }
  };

  const handleSubmitResponse = (questionIndex: number) => {
    if (responseContent.trim() && onAnswerQuestion) {
      onAnswerQuestion(questionIndex, responseContent);
      setResponseContent('');
      setRespondingToQuestion(null);
    }
  };

  const resonanceIcons = {
    resonance: <Heart className="w-4 h-4" />,
    amplification: <Zap className="w-4 h-4" />,
    clarification: <Eye className="w-4 h-4" />,
    integration: <Compass className="w-4 h-4" />
  };

  const resonanceColors = {
    resonance: 'text-pink-500',
    amplification: 'text-yellow-500',
    clarification: 'text-blue-500',
    integration: 'text-green-500'
  };

  // Calculate engagement statistics
  const engagementStats = {
    reflections: record.engagement?.reflections?.length || 0,
    questions: record.engagement?.questions?.length || 0,
    answeredQuestions: record.engagement?.questions?.filter(q => q.answered).length || 0,
    totalResonance: record.engagement?.resonanceMarkers?.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Engagement Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Community Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{engagementStats.reflections}</div>
              <div className="text-sm text-muted-foreground">Reflections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {engagementStats.answeredQuestions}/{engagementStats.questions}
              </div>
              <div className="text-sm text-muted-foreground">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{engagementStats.totalResonance}</div>
              <div className="text-sm text-muted-foreground">Resonance Markers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {record.engagement?.collectiveThreads?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Threads</div>
            </div>
          </div>

          {/* Quick Resonance Actions */}
          <div className="flex justify-center gap-2">
            {(['resonance', 'amplification', 'clarification', 'integration'] as const).map(type => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => onAddResonance?.(type)}
                className={`flex items-center gap-1 ${resonanceColors[type]}`}
              >
                {resonanceIcons[type]}
                <span className="capitalize">{type}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Reflection */}
      {!isOwner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="w-5 h-5" />
              Share Your Reflection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="How does this observation resonate with your experience? What patterns or insights does it evoke?"
              value={reflectionContent}
              onChange={(e) => setReflectionContent(e.target.value)}
              className="min-h-[100px]"
            />

            <div>
              <label className="text-sm font-medium mb-2 block">
                Elemental Resonance (optional)
              </label>
              <div className="flex gap-2">
                {(['Fire', 'Water', 'Air', 'Earth', 'Void'] as Element[]).map(element => (
                  <Button
                    key={element}
                    size="sm"
                    variant={selectedElements.includes(element) ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedElements(prev =>
                        prev.includes(element)
                          ? prev.filter(e => e !== element)
                          : [...prev, element]
                      );
                    }}
                  >
                    {element}
                  </Button>
                ))}
              </div>
            </div>

            <Input
              placeholder="Insight amplification (optional) - How does this expand the original insight?"
              value={insightAmplification}
              onChange={(e) => setInsightAmplification(e.target.value)}
            />

            <Button onClick={handleSubmitReflection} className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Share Reflection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Member Reflections */}
      {record.engagement?.reflections && record.engagement.reflections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5" />
              Member Reflections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {record.engagement.reflections.map((reflection, i) => (
              <div key={i} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {reflection.memberName?.charAt(0) || 'M'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm">
                      {reflection.memberName || `Member ${reflection.memberId.slice(0, 6)}`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(reflection.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{reflection.content}</p>
                  {reflection.elementalResonance && reflection.elementalResonance.length > 0 && (
                    <div className="flex gap-1">
                      {reflection.elementalResonance.map((element, j) => (
                        <Badge key={j} variant="outline" className="text-xs">
                          {element}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {reflection.insightAmplification && (
                    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded">
                      <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <p className="text-sm italic">{reflection.insightAmplification}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HelpCircle className="w-5 h-5" />
            Questions & Dialogue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Question Form */}
          {!isOwner && (
            <div className="space-y-2 pb-4 border-b">
              <Input
                placeholder="Ask a question about this observation..."
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuestion()}
              />
              <Button onClick={handleSubmitQuestion} size="sm" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
            </div>
          )}

          {/* Questions List */}
          {record.engagement?.questions && record.engagement.questions.length > 0 ? (
            <div className="space-y-3">
              {record.engagement.questions.map((question, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {question.memberName?.charAt(0) || 'Q'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">
                          {question.memberName || `Member ${question.memberId.slice(0, 6)}`}
                        </span>
                        <Badge variant={question.answered ? 'default' : 'outline'} className="text-xs">
                          {question.answered ? 'Answered' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mt-1">{question.question}</p>
                    </div>
                  </div>

                  {question.response && (
                    <div className="ml-11 p-3 bg-muted/50 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="text-xs font-medium">Response from practitioner</span>
                      </div>
                      <p className="text-sm">{question.response}</p>
                    </div>
                  )}

                  {isOwner && !question.answered && respondingToQuestion === i && (
                    <div className="ml-11 space-y-2">
                      <Textarea
                        placeholder="Type your response..."
                        value={responseContent}
                        onChange={(e) => setResponseContent(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSubmitResponse(i)}
                        >
                          Submit Response
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRespondingToQuestion(null);
                            setResponseContent('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {isOwner && !question.answered && respondingToQuestion !== i && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-11"
                      onClick={() => setRespondingToQuestion(i)}
                    >
                      Respond to Question
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No questions yet. Be the first to engage!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Collective Threads */}
      {record.engagement?.collectiveThreads && record.engagement.collectiveThreads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="w-5 h-5" />
              Collective Threads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {record.engagement.collectiveThreads.map((thread, i) => (
                <div key={i} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium text-sm">{thread.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {thread.participants.length} participants • Last active {new Date(thread.lastActivity).toLocaleDateString()}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
                    Join Thread
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FieldEngagement;