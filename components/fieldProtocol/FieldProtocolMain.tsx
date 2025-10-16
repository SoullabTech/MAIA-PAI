'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FieldRecordForm } from './FieldRecordForm';
import { FieldRecordViewer } from './FieldRecordViewer';
import { FieldCommons } from './FieldCommons';
import { FieldEngagement } from './FieldEngagement';
import { useFieldProtocolStorage } from '@/lib/fieldProtocol/storage';
import { useFieldProtocolIntegration } from '@/hooks/useFieldProtocolIntegration';
import {
  FieldRecord,
  Practitioner,
  CommonsEntry
} from '@/types/fieldProtocol';
import {
  Plus,
  BookOpen,
  Globe,
  User,
  Download,
  Upload,
  Sparkles,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FieldProtocolMainProps {
  practitionerId?: string;
  practitionerName?: string;
  oracleMessages?: any[]; // Messages from Oracle conversation if integrated
}

export const FieldProtocolMain: React.FC<FieldProtocolMainProps> = ({
  practitionerId = 'default-practitioner',
  practitionerName,
  oracleMessages = []
}) => {
  const [activeTab, setActiveTab] = useState('my-records');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FieldRecord | null>(null);
  const [myRecords, setMyRecords] = useState<FieldRecord[]>([]);
  const [allRecords, setAllRecords] = useState<FieldRecord[]>([]);
  const [commonsEntries, setCommonsEntries] = useState<CommonsEntry[]>([]);
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);

  const { storage, loading: storageLoading, error: storageError } = useFieldProtocolStorage();
  const {
    isRecording,
    startRecording,
    completeRecording,
    processMessage,
    generateFieldRecord,
    sessionRecords
  } = useFieldProtocolIntegration({ practitionerId });

  // Load data from storage
  const loadData = useCallback(async () => {
    if (!storage) return;

    try {
      // Load practitioner data
      let currentPractitioner = await storage.getPractitioner(practitionerId);
      if (!currentPractitioner) {
        // Create new practitioner
        currentPractitioner = {
          id: practitionerId,
          name: practitionerName,
          joinedDate: new Date(),
          experience: {
            totalRecords: 0,
            validatedRecords: 0,
            elementalAffinities: {}
          },
          ethics: {
            integrityScore: 1,
            transparencyScore: 1,
            coherenceScore: 1
          }
        };
        await storage.savePractitioner(currentPractitioner);
      }
      setPractitioner(currentPractitioner);

      // Load records
      const userRecords = await storage.getRecordsByPractitioner(practitionerId);
      setMyRecords(userRecords);

      const publicRecords = await storage.getPublicRecords();
      setAllRecords(publicRecords);

      const commons = await storage.getAllCommonsEntries();
      setCommonsEntries(commons);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load Field Protocol data');
    }
  }, [storage, practitionerId, practitionerName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save a new record
  const handleSaveRecord = async (record: Partial<FieldRecord>) => {
    if (!storage) return;

    try {
      const fullRecord: FieldRecord = {
        ...record,
        id: record.id || `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: record.timestamp || new Date(),
        meta: {
          ...record.meta!,
          practitionerId
        }
      } as FieldRecord;

      await storage.saveRecord(fullRecord);

      // Update practitioner stats
      if (practitioner) {
        practitioner.experience.totalRecords++;
        await storage.savePractitioner(practitioner);
      }

      // If shared to commons, create commons entry
      if (fullRecord.meta.visibility === 'commons' || fullRecord.meta.visibility === 'public') {
        const commonsEntry: CommonsEntry = {
          recordId: fullRecord.id,
          sharedDate: new Date(),
          practitionerId,
          engagement: {
            views: 0,
            validations: 0,
            crossReferences: 0,
            derivatives: []
          },
          resonance: {
            elementalAlignment: 0,
            archetypeMatch: 0,
            temporalCoherence: 0
          }
        };
        await storage.saveCommonsEntry(commonsEntry);
      }

      toast.success('Field Record saved successfully');
      loadData();
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to save record:', error);
      toast.error('Failed to save Field Record');
    }
  };

  // Handle engagement actions
  const handleAddReflection = async (recordId: string, reflection: any) => {
    const record = allRecords.find(r => r.id === recordId);
    if (!record || !storage) return;

    const newReflection = {
      ...reflection,
      memberId: practitionerId,
      memberName: practitionerName,
      timestamp: new Date()
    };

    if (!record.engagement) {
      record.engagement = {};
    }
    if (!record.engagement.reflections) {
      record.engagement.reflections = [];
    }
    record.engagement.reflections.push(newReflection);

    await storage.saveRecord(record);
    toast.success('Reflection added');
    loadData();
  };

  const handleAddQuestion = async (recordId: string, question: string) => {
    const record = allRecords.find(r => r.id === recordId);
    if (!record || !storage) return;

    const newQuestion = {
      memberId: practitionerId,
      memberName: practitionerName,
      question,
      timestamp: new Date(),
      answered: false
    };

    if (!record.engagement) {
      record.engagement = {};
    }
    if (!record.engagement.questions) {
      record.engagement.questions = [];
    }
    record.engagement.questions.push(newQuestion);

    await storage.saveRecord(record);
    toast.success('Question added');
    loadData();
  };

  const handleAddResonance = async (recordId: string, type: any) => {
    const record = allRecords.find(r => r.id === recordId);
    if (!record || !storage) return;

    const newMarker = {
      memberId: practitionerId,
      type,
      timestamp: new Date()
    };

    if (!record.engagement) {
      record.engagement = {};
    }
    if (!record.engagement.resonanceMarkers) {
      record.engagement.resonanceMarkers = [];
    }
    record.engagement.resonanceMarkers.push(newMarker);

    await storage.saveRecord(record);
    toast.success(`${type} marker added`);
    loadData();
  };

  // Generate record from Oracle messages
  const handleGenerateFromOracle = async () => {
    if (oracleMessages.length === 0) {
      toast.error('No Oracle conversation available');
      return;
    }

    const record = await generateFieldRecord(oracleMessages);
    if (record) {
      await handleSaveRecord(record);
      toast.success('Field Record generated from Oracle conversation');
    }
  };

  // Export/Import functionality
  const handleExport = async () => {
    if (!storage) return;

    try {
      const data = await storage.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `field-protocol-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!storage || !event.target.files?.[0]) return;

    try {
      const file = event.target.files[0];
      const text = await file.text();
      const data = JSON.parse(text);
      const result = await storage.importData(data);
      toast.success(`Imported ${result.recordsImported} records`);
      loadData();
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Failed to import data');
    }
  };

  if (storageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (storageError) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <p className="text-red-500">Failed to initialize Field Protocol storage</p>
          <p className="text-sm text-muted-foreground mt-2">{storageError.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-8 h-8" />
                Spiralogic Field Protocol
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Document consciousness explorations with scientific rigor and phenomenological depth
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <label>
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {practitioner && (
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{practitioner.name || 'Anonymous Practitioner'}</span>
              </div>
              <Badge variant="outline">
                {practitioner.experience.totalRecords} Records
              </Badge>
              <Badge variant="outline">
                {practitioner.experience.validatedRecords} Validated
              </Badge>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="my-records">
            <BookOpen className="w-4 h-4 mr-2" />
            My Records ({myRecords.length})
          </TabsTrigger>
          <TabsTrigger value="commons">
            <Globe className="w-4 h-4 mr-2" />
            Commons ({allRecords.length})
          </TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </TabsTrigger>
          <TabsTrigger value="oracle">
            <Activity className="w-4 h-4 mr-2" />
            Oracle Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-records" className="mt-6">
          {myRecords.length > 0 ? (
            <div className="space-y-4">
              {myRecords.map(record => (
                <FieldRecordViewer
                  key={record.id}
                  record={record}
                  onLink={(linkedId) => {
                    const linked = myRecords.find(r => r.id === linkedId);
                    if (linked) setSelectedRecord(linked);
                  }}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Records Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Begin documenting your consciousness explorations
                </p>
                <Button onClick={() => setActiveTab('create')}>
                  Create Your First Record
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="commons" className="mt-6">
          <FieldCommons
            records={allRecords}
            commonsEntries={commonsEntries}
            currentPractitionerId={practitionerId}
            onRecordSelect={setSelectedRecord}
            onValidate={async (recordId) => {
              const record = allRecords.find(r => r.id === recordId);
              if (!record || !storage) return;

              if (!record.validation.peerValidation) {
                record.validation.peerValidation = [];
              }
              record.validation.peerValidation.push({
                validatorId: practitionerId,
                notes: 'Validated by peer review',
                timestamp: new Date()
              });

              await storage.saveRecord(record);
              toast.success('Record validated');
              loadData();
            }}
          />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <FieldRecordForm
            practitionerId={practitionerId}
            onSubmit={handleSaveRecord}
            onSave={handleSaveRecord}
          />
        </TabsContent>

        <TabsContent value="oracle" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Oracle Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Automatic Field Recording</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  The Field Protocol can automatically generate records from your Oracle conversations,
                  extracting elemental patterns, insights, and transformational markers.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={startRecording}
                    disabled={isRecording}
                    variant={isRecording ? 'secondary' : 'default'}
                  >
                    {isRecording ? 'Recording...' : 'Start Recording'}
                  </Button>
                  {isRecording && (
                    <Button onClick={completeRecording} variant="outline">
                      Complete Recording
                    </Button>
                  )}
                </div>
              </div>

              {oracleMessages.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Generate from Current Session</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Found {oracleMessages.length} messages in current Oracle session
                  </p>
                  <Button onClick={handleGenerateFromOracle}>
                    Generate Field Record
                  </Button>
                </div>
              )}

              {sessionRecords.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Session Records</h4>
                  <div className="space-y-2">
                    {sessionRecords.map(record => (
                      <Card key={record.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">
                                {new Date(record.timestamp).toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {record.elementalContext.dominant.join(', ')} •
                                {record.cognitive.insights.length} insights
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedRecord(record)}
                            >
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Record Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="space-y-4">
              <FieldRecordViewer
                record={selectedRecord}
                onLink={(linkedId) => {
                  const linked = [...myRecords, ...allRecords].find(r => r.id === linkedId);
                  if (linked) setSelectedRecord(linked);
                }}
              />
              {selectedRecord.meta.visibility !== 'private' && (
                <FieldEngagement
                  record={selectedRecord}
                  currentMemberId={practitionerId}
                  currentMemberName={practitionerName}
                  onAddReflection={(reflection) => handleAddReflection(selectedRecord.id, reflection)}
                  onAddQuestion={(question) => handleAddQuestion(selectedRecord.id, question)}
                  onAddResonance={(type) => handleAddResonance(selectedRecord.id, type)}
                />
              )}
            </div>
            <div className="flex justify-end mt-4">
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

export default FieldProtocolMain;