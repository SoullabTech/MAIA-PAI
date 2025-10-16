'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FieldRecord, Element, ObservationStage, ValidationCriteria } from '@/types/fieldProtocol';
import { debounce } from 'lodash';
import { toast } from 'react-hot-toast';

export interface UseFieldProtocolOptions {
  autoSave?: boolean;
  autoSaveInterval?: number;
  practitionerId?: string;
  onAutoSave?: (record: Partial<FieldRecord>) => void;
  onStageComplete?: (stage: ObservationStage, record: Partial<FieldRecord>) => void;
}

export function useFieldProtocol(options: UseFieldProtocolOptions = {}) {
  const {
    autoSave = true,
    autoSaveInterval = 30000, // 30 seconds
    practitionerId = 'anonymous',
    onAutoSave,
    onStageComplete
  } = options;

  const [record, setRecord] = useState<Partial<FieldRecord>>({
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

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedRef = useRef<string>('');
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Create debounced save function
  const debouncedSave = useCallback(
    debounce(async (recordToSave: Partial<FieldRecord>) => {
      if (!isDirty) return;

      setIsSaving(true);
      try {
        // Save to localStorage
        localStorage.setItem('fieldProtocol_draft', JSON.stringify(recordToSave));

        // Call external save handler if provided
        if (onAutoSave) {
          await onAutoSave(recordToSave);
        }

        lastSavedRef.current = JSON.stringify(recordToSave);
        setIsDirty(false);

        toast.success('Draft saved', {
          duration: 1000,
          position: 'bottom-right',
          style: {
            background: '#10b981',
            color: 'white',
          },
        });
      } catch (error) {
        console.error('Failed to save draft:', error);
        toast.error('Failed to save draft');
      } finally {
        setIsSaving(false);
      }
    }, 2000),
    [isDirty, onAutoSave]
  );

  // Update record helper
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

      // Mark as dirty
      if (JSON.stringify(newRecord) !== lastSavedRef.current) {
        setIsDirty(true);
      }

      return newRecord;
    });
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || !isDirty) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      debouncedSave(record);
    }, autoSaveInterval);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [record, isDirty, autoSave, autoSaveInterval, debouncedSave]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('fieldProtocol_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setRecord(parsed);
        lastSavedRef.current = savedDraft;
        toast.success('Draft restored', {
          duration: 2000,
          position: 'bottom-right',
        });
      } catch (error) {
        console.error('Failed to restore draft:', error);
      }
    }
  }, []);

  // Stage progression
  const advanceStage = useCallback(() => {
    const stages: ObservationStage[] = [
      'Observation',
      'Interpretation',
      'Integration',
      'Reflection',
      'Transmission'
    ];

    const currentIndex = stages.indexOf(record.currentStage || 'Observation');
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      const currentStage = record.currentStage || 'Observation';

      // Mark current stage as complete
      updateRecord(`stageCompletions.${currentStage}`, {
        completed: true,
        timestamp: new Date()
      });

      // Move to next stage
      updateRecord('currentStage', nextStage);

      // Trigger completion callback
      if (onStageComplete) {
        onStageComplete(currentStage, record);
      }

      toast.success(`Advanced to ${nextStage} stage`, {
        duration: 2000,
        position: 'bottom-center',
        icon: '🎯',
      });
    }
  }, [record, updateRecord, onStageComplete]);

  // Element management
  const toggleElement = useCallback((element: Element) => {
    const current = record.elementalContext?.dominant || [];
    const updated = current.includes(element)
      ? current.filter(e => e !== element)
      : [...current, element];
    updateRecord('elementalContext.dominant', updated);
  }, [record, updateRecord]);

  // Validation criteria management
  const toggleValidationCriteria = useCallback((criteria: ValidationCriteria) => {
    const current = record.validation?.criteria || [];
    const updated = current.includes(criteria)
      ? current.filter(c => c !== criteria)
      : [...current, criteria];
    updateRecord('validation.criteria', updated);
  }, [record, updateRecord]);

  // Calculate completion percentage
  const calculateCompletion = useCallback((): number => {
    let completedFields = 0;
    let totalFields = 0;

    // Check core fields
    const checkField = (value: any) => {
      totalFields++;
      if (value && (typeof value === 'string' ? value.trim() : true)) {
        completedFields++;
      }
    };

    checkField(record.location?.physical);
    checkField(record.phenomenon?.description);
    checkField(record.elementalContext?.dominant?.length);
    checkField(record.cognitive?.insights?.length);
    checkField(record.validation?.criteria?.length);

    return totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
  }, [record]);

  // Save to database
  const saveToDatabase = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/fieldProtocol/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      if (response.ok) {
        const { data } = await response.json();
        // Update record with server ID
        if (data.id) {
          updateRecord('id', data.id);
        }
        setIsDirty(false);
        lastSavedRef.current = JSON.stringify(record);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save to database:', error);
      return false;
    }
  }, [record, updateRecord]);

  // Submit for transmission
  const transmitToCommons = useCallback(async (): Promise<boolean> => {
    if (record.currentStage !== 'Transmission') {
      toast.error('Complete all stages before transmitting');
      return false;
    }

    // Update visibility to commons
    updateRecord('meta.visibility', 'commons');

    // Save to database
    const saved = await saveToDatabase();
    if (saved) {
      toast.success('Record transmitted to Commons! 🌟', {
        duration: 3000,
        position: 'top-center',
      });

      // Clear draft
      localStorage.removeItem('fieldProtocol_draft');

      // Reset form
      setRecord({
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

      return true;
    }
    return false;
  }, [record, updateRecord, saveToDatabase, practitionerId]);

  return {
    record,
    updateRecord,
    advanceStage,
    toggleElement,
    toggleValidationCriteria,
    calculateCompletion,
    saveToDatabase,
    transmitToCommons,
    isDirty,
    isSaving,
    debouncedSave,
  };
}