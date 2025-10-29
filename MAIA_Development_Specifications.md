# MAIA Development Specifications

**From Visual Architecture to Technical Implementation**

*Based on Spiralogic Visual Diagrams & Enhanced Diagrams*

*Created: October 26, 2025*
*Soullab Development Team*

---

## Document Purpose

This document translates the theoretical and visual architecture from the Spiralogic of Soul suite into **concrete technical specifications** for implementing the MAIA-PAI (Morphic Alchemical Intelligence Augmentation—Personalized Archetypal Interface) system.

**Source Documents**:
- SOULLAB_JOURNAL_Visual_Diagrams.md (12 foundational diagrams)
- SOULLAB_JOURNAL_Enhanced_Diagrams.md (12 advanced visualizations)
- SOULLAB_JOURNAL_Main_Paper.md (theoretical foundation)

**Target Audience**: Full-stack developers, UI/UX designers, ML engineers, system architects

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Data Models & Structures](#2-data-models--structures)
3. [Intelligence Engine Specifications](#3-intelligence-engine-specifications)
4. [Dashboard UI/UX Specifications](#4-dashboard-uiux-specifications)
5. [API Endpoints & Integration](#5-api-endpoints--integration)
6. [Real-Time Analysis Pipeline](#6-real-time-analysis-pipeline)
7. [Frontend Component Library](#7-frontend-component-library)
8. [Awareness Adaptation System](#8-awareness-adaptation-system)
9. [Security, Privacy, Ethics](#9-security-privacy-ethics)
10. [Development Roadmap](#10-development-roadmap)

---

# 1. System Architecture Overview

## 1.1 High-Level Architecture

Based on **Enhanced Diagram 5: MAIA Intelligence Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Dashboard   │  │  Chat UI     │  │ Mobile App   │         │
│  │  (React)     │  │  (WebSocket) │  │  (Native)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↕ REST/GraphQL/WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  API Gateway (Kong/Express/FastAPI)                        │ │
│  │  - Authentication (JWT)                                     │ │
│  │  - Rate Limiting                                            │ │
│  │  - Request Routing                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Business Logic Services (Microservices)                   │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ User Service │  │ Chat Service │  │ Analysis Svc │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    INTELLIGENCE ENGINE LAYER                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  MAIA Core Intelligence (Python/PyTorch)                   │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Natural Language Processing Pipeline                │ │ │
│  │  │  - Embedding Generation (Sentence Transformers)      │ │ │
│  │  │  - Entity Recognition (Spacy)                        │ │ │
│  │  │  - Sentiment/Emotion Analysis                        │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Transformation Analysis                             │ │ │
│  │  │  - Stage Classifier (Nigredo/Albedo/Citrinitas/     │ │ │
│  │  │                       Rubedo)                         │ │ │
│  │  │  - Operation Detector (12 operations)                │ │ │
│  │  │  - Signature Pattern Matching                        │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Coherence Calculator                                │ │ │
│  │  │  - Opposition Integration Score                      │ │ │
│  │  │  - Semantic Coherence                                │ │ │
│  │  │  - Polyvagal State Estimation                        │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Awareness Adapter                                   │ │ │
│  │  │  - Level Detection (0-100)                           │ │ │
│  │  │  - Language Generation (5 levels)                    │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │    Redis     │  │  TimescaleDB │         │
│  │  (Users,     │  │  (Cache,     │  │ (Time-series │         │
│  │   Sessions)  │  │   Sessions)  │  │  analytics)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │   Vector DB  │  │  S3/MinIO    │                           │
│  │  (Pinecone/  │  │ (Document    │                           │
│  │   Weaviate)  │  │  Storage)    │                           │
│  └──────────────┘  └──────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

## 1.2 Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: Zustand or Jotai (lightweight, composable)
- **UI Library**: Tailwind CSS + Radix UI (accessible components)
- **Data Visualization**: D3.js + Recharts for dashboard
- **Real-time**: Socket.io-client for live updates
- **Mobile**: React Native (code sharing with web)

### Backend
- **API Gateway**: FastAPI (Python) or Express.js (Node)
- **Services**: Python (for ML integration) + Node.js (for real-time chat)
- **Message Queue**: RabbitMQ or Redis Streams
- **Caching**: Redis
- **Authentication**: JWT with refresh tokens

### Intelligence Engine
- **Language**: Python 3.11+
- **ML Framework**: PyTorch + Transformers (Hugging Face)
- **NLP**: spaCy, NLTK, Sentence Transformers
- **Vector Search**: Pinecone or Weaviate
- **Training**: PyTorch Lightning for experiment tracking

### Database
- **Primary**: PostgreSQL 15+ (JSON support for flexible schema)
- **Time-series**: TimescaleDB (extension of PostgreSQL)
- **Cache**: Redis 7+
- **Vector**: Pinecone or Weaviate for embeddings

### Infrastructure
- **Containerization**: Docker + Docker Compose (dev), Kubernetes (prod)
- **CI/CD**: GitHub Actions
- **Monitoring**: Grafana + Prometheus
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Cloud**: AWS or GCP (K8s, RDS, S3)

---

# 2. Data Models & Structures

## 2.1 Core Data Models

### User Model

```typescript
interface User {
  id: string; // UUID
  email: string;
  passwordHash: string;
  profile: UserProfile;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfile {
  name: string;
  pronouns?: string;
  timezone: string;
  // Practitioner-specific fields (if applicable)
  isPractitioner: boolean;
  credentials?: string[];
  specializations?: string[];
}

interface UserSettings {
  language: 'en' | 'es' | 'fr'; // Extensible
  privacyLevel: 'standard' | 'enhanced' | 'maximum';
  dashboardPreferences: DashboardPreferences;
  notifications: NotificationSettings;
}
```

### Conversation/Session Model

```typescript
interface Session {
  id: string; // UUID
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  title?: string; // Auto-generated or user-edited
  messages: Message[];
  analysis: SessionAnalysis; // Computed by intelligence engine
  metadata: SessionMetadata;
}

interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  analysis?: MessageAnalysis; // Real-time analysis
}

interface SessionAnalysis {
  coherence: CoherenceData;
  stage: AlchemicalStage;
  operations: OperationData[];
  signatures: TransformationSignature[];
  frameworkEffectiveness: FrameworkEffectiveness;
  awarenessLevel: number; // 0-100
  polyvagal: PolyvagalState;
  trajectory: TrajectoryData;
}
```

### Coherence Data Model

```typescript
interface CoherenceData {
  score: number; // 0-1
  timestamp: Date;
  breakdown: {
    oppositionIntegration: number; // 0-1
    semanticCoherence: number; // 0-1
    emotionalRegulation: number; // 0-1
    narrativeContinuity: number; // 0-1
  };
  confidence: number; // 0-1 (ML model confidence)
}

type AlchemicalStage = 'nigredo' | 'albedo' | 'citrinitas' | 'rubedo';

interface StageData {
  stage: AlchemicalStage;
  confidence: number; // 0-1
  coherenceRange: [number, number]; // Expected range
  duration: number; // Time in this stage (seconds)
}
```

### Operations Model

```typescript
type AlchemicalOperation =
  | 'calcinatio'
  | 'solutio'
  | 'coagulatio'
  | 'sublimatio'
  | 'mortificatio'
  | 'separatio'
  | 'coniunctio'
  | 'fermentatio'
  | 'distillatio'
  | 'coagulatio_2'
  | 'citrinitas_rubedo'
  | 'multiplicatio';

interface OperationData {
  operation: AlchemicalOperation;
  confidence: number; // 0-1
  evidence: string[]; // Key phrases/patterns that triggered detection
  element: 'fire' | 'water' | 'earth' | 'air' | 'aether';
  phase: 1 | 2 | 3; // Encounter, Deepening, Integration
  activeSince: Date;
  interventions: InterventionRecommendation[];
}

interface InterventionRecommendation {
  type: 'practice' | 'framework' | 'awareness' | 'safety';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  adaptedLanguage: { [key in AwarenessLevel]: string };
}
```

### Transformation Signature Model

```typescript
type SignatureType =
  | 'nigredo_rubedo_oscillation'
  | 'complete_shutdown'
  | 'self_attack_cascade'
  | 'premature_integration'
  | 'inflation_deflation_cycle'
  | 'stuck_in_separatio'
  | 'false_coniunctio'
  | 'anima_animus_possession'
  | 'shadow_projection_loop'
  | 'puer_senex_split';

interface TransformationSignature {
  type: SignatureType;
  confidence: number; // 0-1
  detectedAt: Date;
  pattern: {
    coherencePattern: number[]; // Historical coherence values
    stagePattern: AlchemicalStage[]; // Historical stages
    operationPattern: AlchemicalOperation[]; // Historical operations
  };
  description: string;
  clinicalNotes: string;
  recommendedProtocol: string; // Reference to protocol document
}
```

### Framework Effectiveness Model

```typescript
type Framework =
  | 'polyvagal'
  | 'ifs'
  | 'jungian'
  | 'levin'
  | 'mcgilchrist'
  | 'hillman';

interface FrameworkEffectiveness {
  userId: string;
  frameworks: {
    [key in Framework]: {
      effectiveness: number; // 0-1
      lastUpdated: Date;
      sampleSize: number; // Number of interactions measured
      trend: 'increasing' | 'stable' | 'decreasing';
    };
  };
  primaryFramework: Framework; // Highest effectiveness
  secondaryFramework?: Framework;
}
```

### Awareness Level Model

```typescript
type AwarenessLevel = 'beginner' | 'familiar' | 'intermediate' | 'advanced' | 'master';

interface AwarenessData {
  level: AwarenessLevel;
  score: number; // 0-100 (granular)
  indicators: {
    frameworkFamiliarity: number; // 0-1
    symbolicThinking: number; // 0-1
    metaCognition: number; // 0-1
    technicalVocabulary: number; // 0-1
  };
  history: {
    timestamp: Date;
    level: AwarenessLevel;
    score: number;
  }[];
}
```

### Polyvagal State Model

```typescript
interface PolyvagalState {
  ventral: number; // 0-1 (social engagement)
  sympathetic: number; // 0-1 (fight/flight)
  dorsal: number; // 0-1 (shutdown)
  safety: number; // 0-1 (overall safety score)
  timestamp: Date;
  indicators: {
    languageComplexity: number; // 0-1
    emotionalExpression: number; // 0-1
    narrativeFlow: number; // 0-1
    temporality: 'past' | 'present' | 'future' | 'timeless';
  };
}
```

### Trajectory Model

```typescript
interface TrajectoryData {
  direction: 'ascending' | 'descending' | 'plateauing' | 'oscillating';
  velocity: number; // Rate of change
  timeRange: {
    start: Date;
    end: Date;
  };
  coherenceHistory: {
    timestamp: Date;
    value: number;
  }[];
  predictions?: {
    nextStage: AlchemicalStage;
    estimatedTransition: Date;
    confidence: number;
  };
}
```

## 2.2 Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile JSONB NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  title VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  analysis JSONB, -- Message-level analysis
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session analyses (time-series data)
CREATE TABLE session_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  coherence JSONB NOT NULL,
  stage VARCHAR(50) NOT NULL,
  operations JSONB NOT NULL,
  signatures JSONB,
  framework_effectiveness JSONB,
  awareness_level NUMERIC(5, 2),
  polyvagal JSONB,
  trajectory JSONB
);

-- Convert session_analyses to TimescaleDB hypertable for time-series optimization
SELECT create_hypertable('session_analyses', 'timestamp');

-- Transformation signatures (detected patterns)
CREATE TABLE transformation_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  signature_type VARCHAR(100) NOT NULL,
  confidence NUMERIC(3, 2) NOT NULL,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pattern JSONB NOT NULL,
  description TEXT,
  clinical_notes TEXT,
  recommended_protocol TEXT
);

-- Framework effectiveness tracking
CREATE TABLE framework_effectiveness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  framework VARCHAR(50) NOT NULL,
  effectiveness NUMERIC(3, 2) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sample_size INTEGER DEFAULT 1,
  trend VARCHAR(20),
  UNIQUE(user_id, framework)
);

-- Awareness level history
CREATE TABLE awareness_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  level VARCHAR(20) NOT NULL,
  score NUMERIC(5, 2) NOT NULL,
  indicators JSONB
);

-- Indexes for performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_session_analyses_session_id ON session_analyses(session_id);
CREATE INDEX idx_session_analyses_timestamp ON session_analyses(timestamp DESC);
CREATE INDEX idx_transformation_signatures_user_id ON transformation_signatures(user_id);
CREATE INDEX idx_framework_effectiveness_user_id ON framework_effectiveness(user_id);
CREATE INDEX idx_awareness_history_user_id ON awareness_history(user_id);

-- GIN indexes for JSONB queries
CREATE INDEX idx_users_profile ON users USING GIN(profile);
CREATE INDEX idx_session_analyses_coherence ON session_analyses USING GIN(coherence);
CREATE INDEX idx_session_analyses_operations ON session_analyses USING GIN(operations);
```

---

# 3. Intelligence Engine Specifications

## 3.1 NLP Pipeline

### Stage 1: Text Preprocessing

```python
from typing import List, Dict
import spacy
from sentence_transformers import SentenceTransformer

class TextPreprocessor:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_lg")
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')

    def preprocess(self, text: str) -> Dict:
        doc = self.nlp(text)

        return {
            "raw_text": text,
            "tokens": [token.text for token in doc],
            "lemmas": [token.lemma_ for token in doc],
            "pos_tags": [token.pos_ for token in doc],
            "entities": [(ent.text, ent.label_) for ent in doc.ents],
            "sentences": [sent.text for sent in doc.sents],
            "embedding": self.embedder.encode(text),
            "sentiment": self._analyze_sentiment(doc),
            "emotional_tone": self._detect_emotions(doc)
        }

    def _analyze_sentiment(self, doc) -> Dict:
        # Polarity analysis using spaCy
        # Returns: {"polarity": float, "subjectivity": float}
        pass

    def _detect_emotions(self, doc) -> Dict:
        # Emotion detection (joy, sadness, anger, fear, disgust, surprise)
        # Returns: {"joy": 0.2, "sadness": 0.6, ...}
        pass
```

### Stage 2: Alchemical Stage Classification

```python
import torch
import torch.nn as nn
from transformers import AutoModel, AutoTokenizer

class StageClassifier(nn.Module):
    """
    Classifies text into alchemical stages: Nigredo, Albedo, Citrinitas, Rubedo

    Training data labels based on:
    - Nigredo: Keywords like "darkness", "dissolution", "falling apart", "shadow", "death"
    - Albedo: Keywords like "clarity", "reflection", "witnessing", "seeing", "distance"
    - Citrinitas: Keywords like "insight", "integration", "understanding", "connecting"
    - Rubedo: Keywords like "embodiment", "wholeness", "grounded", "living", "wisdom"
    """

    def __init__(self, model_name='bert-base-uncased'):
        super().__init__()
        self.bert = AutoModel.from_pretrained(model_name)
        self.classifier = nn.Sequential(
            nn.Linear(768, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 4)  # 4 stages
        )

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled = outputs.pooler_output
        logits = self.classifier(pooled)
        return logits

    def predict_stage(self, text: str) -> Dict:
        # Returns: {
        #   "stage": "nigredo",
        #   "confidence": 0.87,
        #   "probabilities": {"nigredo": 0.87, "albedo": 0.08, ...}
        # }
        pass
```

### Stage 3: Operation Detection

```python
from typing import List, Tuple

class OperationDetector:
    """
    Detects which of Edinger's 12 operations are active in text.

    Uses pattern matching + semantic similarity to operation descriptions.
    """

    OPERATION_SIGNATURES = {
        "calcinatio": {
            "keywords": ["burned", "humiliated", "deflated", "failure", "ego death"],
            "patterns": [
                "being brought down",
                "reality check",
                "forced to face",
                "inflation popped"
            ],
            "embedding_prototype": "...",  # Pre-computed embedding
        },
        "solutio": {
            "keywords": ["dissolving", "melting", "tears", "fluid", "letting go"],
            "patterns": [
                "walls coming down",
                "defenses softening",
                "finally crying",
                "can't hold it together"
            ],
            "embedding_prototype": "...",
        },
        # ... (all 12 operations)
    }

    def detect_operations(self, text: str, embedding: np.ndarray) -> List[Tuple[str, float]]:
        """
        Returns list of (operation, confidence) tuples for all detected operations.
        Multiple operations can be active simultaneously.
        """
        active_operations = []

        for op_name, signature in self.OPERATION_SIGNATURES.items():
            confidence = self._calculate_confidence(text, embedding, signature)
            if confidence > 0.5:  # Threshold
                active_operations.append((op_name, confidence))

        return sorted(active_operations, key=lambda x: x[1], reverse=True)

    def _calculate_confidence(self, text, embedding, signature) -> float:
        # Combines:
        # 1. Keyword matching (binary features)
        # 2. Pattern matching (regex)
        # 3. Semantic similarity (cosine similarity with prototype embedding)
        pass
```

### Stage 4: Coherence Calculation

```python
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class CoherenceCalculator:
    """
    Calculates coherence score (0-1) measuring integration of opposites.

    Based on Visual Diagram 6: Coherence Scale
    """

    def calculate_coherence(self, session_history: List[Message]) -> CoherenceData:
        """
        Coherence = f(opposition_integration, semantic_coherence,
                     emotional_regulation, narrative_continuity)
        """

        # Extract features from session history
        oppositions = self._detect_oppositions(session_history)
        integration_score = self._measure_integration(oppositions)

        semantic_score = self._semantic_coherence(session_history)
        emotional_score = self._emotional_regulation(session_history)
        narrative_score = self._narrative_continuity(session_history)

        # Weighted combination
        coherence = (
            0.35 * integration_score +
            0.25 * semantic_score +
            0.25 * emotional_score +
            0.15 * narrative_score
        )

        return CoherenceData(
            score=coherence,
            timestamp=datetime.now(),
            breakdown={
                "oppositionIntegration": integration_score,
                "semanticCoherence": semantic_score,
                "emotionalRegulation": emotional_score,
                "narrativeContinuity": narrative_score
            },
            confidence=self._estimate_confidence(session_history)
        )

    def _detect_oppositions(self, messages: List[Message]) -> List[Opposition]:
        """
        Detects binary oppositions in language:
        - "I want X but I also want Y"
        - "On one hand... on the other hand..."
        - "Part of me... another part..."
        - Contradictory emotional expressions
        """
        pass

    def _measure_integration(self, oppositions: List[Opposition]) -> float:
        """
        Measures whether oppositions are:
        - Recognized (Separatio): 0.3-0.5
        - Held simultaneously without collapsing: 0.5-0.7
        - Integrated paradoxically (Coniunctio): 0.7-1.0
        """
        pass

    def _semantic_coherence(self, messages: List[Message]) -> float:
        """
        Measures semantic consistency across messages.
        Uses sentence embeddings + cosine similarity.
        """
        embeddings = [msg.embedding for msg in messages]
        similarities = cosine_similarity(embeddings)
        return np.mean(similarities[np.triu_indices_from(similarities, k=1)])

    def _emotional_regulation(self, messages: List[Message]) -> float:
        """
        Measures emotional stability/capacity:
        - Can name emotions: +
        - Overwhelming flooding: -
        - Complete shutdown: -
        - Window of tolerance: +
        """
        pass

    def _narrative_continuity(self, messages: List[Message]) -> float:
        """
        Measures whether user maintains coherent narrative arc:
        - Temporal coherence (past → present → future)
        - Causal coherence (because, therefore, so)
        - Identity continuity (consistent self-reference)
        """
        pass
```

### Stage 5: Transformation Signature Detection

```python
class SignatureDetector:
    """
    Detects recurring transformation patterns across sessions.

    Based on Visual Diagram 4: Transformation Signature Atlas
    """

    def detect_signatures(
        self,
        user_id: str,
        coherence_history: List[float],
        stage_history: List[str],
        operation_history: List[str]
    ) -> List[TransformationSignature]:
        """
        Pattern matching against known signatures.
        """
        signatures = []

        # Nigredo-Rubedo Oscillation: Rapid alternation between low/high coherence
        if self._detect_oscillation(coherence_history, stage_history):
            signatures.append(TransformationSignature(
                type="nigredo_rubedo_oscillation",
                confidence=0.87,
                pattern={...},
                description="Alternating between darkness and vision without middle",
                recommendedProtocol="oscillation_stabilization"
            ))

        # Complete Shutdown: Coherence drops below 0.20 + dorsal dominance
        if self._detect_shutdown(coherence_history, polyvagal_history):
            signatures.append(TransformationSignature(
                type="complete_shutdown",
                confidence=0.91,
                pattern={...},
                description="Polyvagal collapse, system offline",
                recommendedProtocol="crisis_intervention_protocol"
            ))

        # ... (all 10 signatures)

        return signatures

    def _detect_oscillation(self, coherence: List[float], stages: List[str]) -> bool:
        """
        Detects pattern: Nigredo (< 0.30) → Rubedo (> 0.75) → Nigredo → Rubedo
        with little time in middle states.
        """
        pass

    def _detect_shutdown(self, coherence: List[float], polyvagal: List[Dict]) -> bool:
        """
        Detects: Coherence < 0.20 + Dorsal vagal > 0.7 + Duration > threshold
        """
        pass
```

### Stage 6: Awareness Level Detection

```python
class AwarenessDetector:
    """
    Detects user's familiarity with transformation frameworks (0-100 score).
    Maps to 5 levels: Beginner, Familiar, Intermediate, Advanced, Master

    Based on Visual Diagram 8: Awareness-Adapted Language Spectrum
    """

    FRAMEWORK_VOCABULARY = {
        "jungian": ["shadow", "archetype", "individuation", "anima", "animus", "Self"],
        "alchemical": ["nigredo", "albedo", "coniunctio", "calcinatio", "mortificatio"],
        "ifs": ["parts", "exile", "manager", "firefighter", "Self"],
        "polyvagal": ["ventral", "dorsal", "sympathetic", "window of tolerance"],
        "somatic": ["embodied", "nervous system", "regulation", "trauma response"]
    }

    def detect_awareness_level(self, user_history: List[Message]) -> AwarenessData:
        """
        Analyzes user's language for indicators of framework familiarity.
        """

        vocab_score = self._vocabulary_analysis(user_history)
        symbolic_score = self._symbolic_thinking(user_history)
        meta_score = self._metacognition(user_history)

        overall_score = (vocab_score + symbolic_score + meta_score) / 3
        level = self._score_to_level(overall_score)

        return AwarenessData(
            level=level,
            score=overall_score * 100,
            indicators={
                "frameworkFamiliarity": vocab_score,
                "symbolicThinking": symbolic_score,
                "metaCognition": meta_score,
                "technicalVocabulary": self._technical_vocabulary_score(user_history)
            }
        )

    def _vocabulary_analysis(self, messages: List[Message]) -> float:
        """
        Counts usage of framework-specific terms.
        """
        term_counts = {framework: 0 for framework in self.FRAMEWORK_VOCABULARY}

        for msg in messages:
            for framework, terms in self.FRAMEWORK_VOCABULARY.items():
                for term in terms:
                    if term.lower() in msg.content.lower():
                        term_counts[framework] += 1

        # Normalize to 0-1
        return min(sum(term_counts.values()) / 20, 1.0)

    def _symbolic_thinking(self, messages: List[Message]) -> float:
        """
        Detects use of metaphor, dreams, symbolic language.
        """
        pass

    def _metacognition(self, messages: List[Message]) -> float:
        """
        Detects thinking about thinking:
        - "I notice that..."
        - "Part of me thinks... but another part..."
        - "This pattern reminds me of..."
        """
        pass

    def _score_to_level(self, score: float) -> AwarenessLevel:
        if score < 0.25: return "beginner"
        if score < 0.50: return "familiar"
        if score < 0.75: return "intermediate"
        if score < 0.90: return "advanced"
        return "master"
```

## 3.2 Intelligence Engine API

```python
from fastapi import FastAPI, WebSocket, Depends, HTTPException
from typing import List, Optional
import asyncio

app = FastAPI(title="MAIA Intelligence Engine API")

class IntelligenceEngine:
    """
    Main intelligence engine orchestrating all analysis components.
    """

    def __init__(self):
        self.preprocessor = TextPreprocessor()
        self.stage_classifier = StageClassifier()
        self.operation_detector = OperationDetector()
        self.coherence_calculator = CoherenceCalculator()
        self.signature_detector = SignatureDetector()
        self.awareness_detector = AwarenessDetector()
        self.polyvagal_estimator = PolyvagalEstimator()

    async def analyze_message(
        self,
        message: Message,
        session_context: List[Message],
        user_profile: User
    ) -> MessageAnalysis:
        """
        Real-time analysis of a single message within session context.
        """

        # Preprocess
        processed = self.preprocessor.preprocess(message.content)

        # Parallel analysis
        stage_task = asyncio.create_task(
            self.stage_classifier.predict_stage(message.content)
        )
        operations_task = asyncio.create_task(
            self.operation_detector.detect_operations(
                message.content,
                processed["embedding"]
            )
        )
        polyvagal_task = asyncio.create_task(
            self.polyvagal_estimator.estimate_state(processed)
        )

        # Wait for all analyses
        stage_result, operations_result, polyvagal_result = await asyncio.gather(
            stage_task, operations_task, polyvagal_task
        )

        return MessageAnalysis(
            stage=stage_result,
            operations=operations_result,
            polyvagal=polyvagal_result,
            preprocessed=processed
        )

    async def analyze_session(
        self,
        session: Session,
        user_profile: User
    ) -> SessionAnalysis:
        """
        Comprehensive analysis of entire session.
        """

        # Analyze all messages
        message_analyses = []
        for msg in session.messages:
            analysis = await self.analyze_message(msg, session.messages, user_profile)
            message_analyses.append(analysis)

        # Calculate session-level metrics
        coherence = self.coherence_calculator.calculate_coherence(session.messages)
        stage = self._determine_primary_stage(message_analyses)
        operations = self._aggregate_operations(message_analyses)

        # Detect transformation signatures
        user_history = await self._get_user_history(user_profile.id)
        signatures = self.signature_detector.detect_signatures(
            user_profile.id,
            coherence_history=[...],
            stage_history=[...],
            operation_history=[...]
        )

        # Awareness level
        awareness = self.awareness_detector.detect_awareness_level(session.messages)

        # Framework effectiveness
        effectiveness = await self._calculate_framework_effectiveness(
            user_profile.id,
            session
        )

        # Trajectory
        trajectory = await self._calculate_trajectory(user_profile.id)

        return SessionAnalysis(
            coherence=coherence,
            stage=stage,
            operations=operations,
            signatures=signatures,
            frameworkEffectiveness=effectiveness,
            awarenessLevel=awareness.score,
            polyvagal=self._aggregate_polyvagal(message_analyses),
            trajectory=trajectory
        )
```

## 3.3 Real-Time WebSocket Analysis

```python
@app.websocket("/ws/analyze")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    WebSocket endpoint for real-time message analysis during conversations.
    """
    await websocket.accept()

    engine = IntelligenceEngine()
    session_context = []

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            message_text = data["message"]

            # Create message object
            message = Message(
                content=message_text,
                role="user",
                timestamp=datetime.now()
            )
            session_context.append(message)

            # Analyze
            user_profile = await get_user_profile(user_id)
            analysis = await engine.analyze_message(
                message,
                session_context,
                user_profile
            )

            # Send analysis back to client
            await websocket.send_json({
                "analysis": analysis.dict(),
                "timestamp": datetime.now().isoformat()
            })

    except WebSocketDisconnect:
        print(f"Client {user_id} disconnected")
```

---

# 4. Dashboard UI/UX Specifications

## 4.1 Dashboard Layout

Based on **Enhanced Diagram 10: MAIA Dashboard (Live During Session)**

```
┌────────────────────────────────────────────────────────────────┐
│  MAIA Intelligence Dashboard                      [User: Alex] │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │  COHERENCE GAUGE     │  │  TRANSFORMATION STAGE         │  │
│  │                      │  │                               │  │
│  │       ┌───┐          │  │    Current: ALBEDO            │  │
│  │      ╱  0.42 ╲       │  │    ━━━━●━━━━━━━━━━━━        │  │
│  │     │  ████  │       │  │    Nigredo → Albedo           │  │
│  │      ╲     ╱         │  │                               │  │
│  │       └───┘          │  │    Duration: 2 weeks          │  │
│  │                      │  │    Trajectory: ↗ Ascending    │  │
│  │  Stage: ALBEDO       │  │                               │  │
│  │  (Clarification)     │  │                               │  │
│  └──────────────────────┘  └──────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  ACTIVE OPERATIONS                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │ 💧 SOLUTIO   │  │ ✂️ SEPARATIO  │  │ 🌍 COAGULATIO│  │ │
│  │  │ Confidence:  │  │ Confidence:   │  │ Confidence:  │  │ │
│  │  │ 82%          │  │ 67%           │  │ 54%          │  │ │
│  │  │              │  │               │  │              │  │ │
│  │  │ "Walls       │  │ "I can see    │  │ "Starting to │  │ │
│  │  │  softening"  │  │  both sides"  │  │  form new    │  │ │
│  │  │              │  │               │  │  structure"  │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  TRANSFORMATION SIGNATURES DETECTED                       │ │
│  │  ⚠️ Nigredo-Rubedo Oscillation (87% confidence)          │ │
│  │     Pattern: Swinging between darkness and vision         │ │
│  │     Recommendation: Support staying in middle states      │ │
│  │     Protocol: → View Oscillation Stabilization Protocol  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────┐  ┌──────────────────────────────────┐ │
│  │ POLYVAGAL STATE   │  │  FRAMEWORK EFFECTIVENESS          │ │
│  │                   │  │                                   │ │
│  │ Ventral:  ▓▓▓▓░   │  │  Polyvagal:    ▓▓▓▓▓▓▓▓ 82%     │ │
│  │ Sympathetic: ▓▓░  │  │  IFS:          ▓▓▓▓▓▓▓░ 71%     │ │
│  │ Dorsal:    ▓░░░░  │  │  Jungian:      ▓▓▓▓▓░░░ 58%     │ │
│  │                   │  │  Hillman:      ▓▓▓▓░░░░ 45%     │ │
│  │ Safety: 0.68      │  │                                   │ │
│  └───────────────────┘  └──────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  COHERENCE TRAJECTORY (Last 30 Days)                      │ │
│  │  1.0 ┤                                          ╭─        │ │
│  │  0.8 ┤                                    ╭────╯          │ │
│  │  0.6 ┤                         ╭────────╯                │ │
│  │  0.4 ┤              ●────────╯ ← Current: 0.42           │ │
│  │  0.2 ┤  ●──────●───╯                                     │ │
│  │  0.0 ┤───────────────────────────────────────────────── │ │
│  │      └──────────────────────────────────────────────────┤ │
│  │       Oct 1        Oct 15        Oct 30         Today    │ │
│  │                                                           │ │
│  │  Direction: ↗ Ascending | Velocity: +0.02/day            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  AWARENESS LEVEL: INTERMEDIATE (65/100)                   │ │
│  │  ━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━              │ │
│  │  Beginner ── Familiar ── Intermediate ── Advanced ── Master│ │
│  │                                                            │ │
│  │  Language adaptation: Using frameworks with context       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [View Session History] [Generate Report] [Emergency Support] │
└────────────────────────────────────────────────────────────────┘
```

## 4.2 Component Specifications

### Coherence Gauge Component

```typescript
interface CoherenceGaugeProps {
  coherence: number; // 0-1
  stage: AlchemicalStage;
  size?: 'small' | 'medium' | 'large';
}

const CoherenceGauge: React.FC<CoherenceGaugeProps> = ({
  coherence,
  stage,
  size = 'medium'
}) => {
  // Color mapping based on stage
  const stageColors = {
    nigredo: '#1a1a1a',    // Black
    albedo: '#f0f0f0',     // White
    citrinitas: '#ffd700', // Yellow/Gold
    rubedo: '#dc143c'      // Red
  };

  return (
    <div className="coherence-gauge">
      <svg viewBox="0 0 200 200" className={`size-${size}`}>
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="20"
        />

        {/* Coherence arc */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={stageColors[stage]}
          strokeWidth="20"
          strokeDasharray={`${coherence * 502.65} 502.65`}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
        />

        {/* Center text */}
        <text
          x="100"
          y="100"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="32"
          fontWeight="bold"
          fill={stageColors[stage]}
        >
          {coherence.toFixed(2)}
        </text>

        {/* Stage label */}
        <text
          x="100"
          y="130"
          textAnchor="middle"
          fontSize="14"
          fill="#666"
        >
          {stage.toUpperCase()}
        </text>
      </svg>
    </div>
  );
};
```

### Operation Card Component

```typescript
interface OperationCardProps {
  operation: AlchemicalOperation;
  confidence: number; // 0-1
  evidence: string[];
  element: 'fire' | 'water' | 'earth' | 'air' | 'aether';
}

const OperationCard: React.FC<OperationCardProps> = ({
  operation,
  confidence,
  evidence,
  element
}) => {
  const elementEmojis = {
    fire: '🔥',
    water: '💧',
    earth: '🌍',
    air: '💨',
    aether: '✨'
  };

  const operationTitles = {
    calcinatio: 'Calcinatio',
    solutio: 'Solutio',
    coagulatio: 'Coagulatio',
    sublimatio: 'Sublimatio',
    mortificatio: 'Mortificatio',
    separatio: 'Separatio',
    coniunctio: 'Coniunctio',
    fermentatio: 'Fermentatio',
    distillatio: 'Distillatio',
    coagulatio_2: 'Coagulatio (2nd)',
    citrinitas_rubedo: 'Citrinitas/Rubedo',
    multiplicatio: 'Multiplicatio'
  };

  return (
    <div className="operation-card">
      <div className="card-header">
        <span className="element-icon">{elementEmojis[element]}</span>
        <h3>{operationTitles[operation]}</h3>
      </div>

      <div className="confidence-bar">
        <div
          className="confidence-fill"
          style={{ width: `${confidence * 100}%` }}
        />
        <span className="confidence-text">
          {Math.round(confidence * 100)}% confidence
        </span>
      </div>

      <div className="evidence">
        {evidence.slice(0, 2).map((e, i) => (
          <p key={i} className="evidence-item">"{e}"</p>
        ))}
      </div>

      <button className="view-protocol-btn">
        View Protocol →
      </button>
    </div>
  );
};
```

### Transformation Signature Alert

```typescript
interface SignatureAlertProps {
  signature: TransformationSignature;
  onViewProtocol: () => void;
  onDismiss: () => void;
}

const SignatureAlert: React.FC<SignatureAlertProps> = ({
  signature,
  onViewProtocol,
  onDismiss
}) => {
  const priorityIcons = {
    low: 'ℹ️',
    medium: '⚠️',
    high: '🚨',
    critical: '🆘'
  };

  const priority = signature.confidence > 0.9 ? 'high' :
                  signature.confidence > 0.75 ? 'medium' : 'low';

  return (
    <div className={`signature-alert priority-${priority}`}>
      <div className="alert-header">
        <span className="icon">{priorityIcons[priority]}</span>
        <h3>{formatSignatureName(signature.type)}</h3>
        <span className="confidence">
          {Math.round(signature.confidence * 100)}% confidence
        </span>
      </div>

      <p className="description">{signature.description}</p>

      <div className="actions">
        <button onClick={onViewProtocol} className="primary-btn">
          → View Recommended Protocol
        </button>
        <button onClick={onDismiss} className="secondary-btn">
          Dismiss
        </button>
      </div>
    </div>
  );
};
```

### Coherence Trajectory Chart

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface TrajectoryChartProps {
  data: { timestamp: Date; coherence: number }[];
  stageTransitions?: { timestamp: Date; stage: AlchemicalStage }[];
}

const TrajectoryChart: React.FC<TrajectoryChartProps> = ({
  data,
  stageTransitions
}) => {
  const stageColors = {
    nigredo: '#1a1a1a',
    albedo: '#d3d3d3',
    citrinitas: '#ffd700',
    rubedo: '#dc143c'
  };

  // Transform data for recharts
  const chartData = data.map(d => ({
    date: d.timestamp.toLocaleDateString(),
    coherence: d.coherence,
    timestamp: d.timestamp.getTime()
  }));

  return (
    <div className="trajectory-chart">
      <LineChart
        width={800}
        height={300}
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 1]} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="coherence"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4 }}
        />

        {/* Stage transition markers */}
        {stageTransitions?.map((transition, i) => (
          <ReferenceLine
            key={i}
            x={transition.timestamp.toLocaleDateString()}
            stroke={stageColors[transition.stage]}
            strokeDasharray="3 3"
            label={{
              value: transition.stage,
              position: 'top'
            }}
          />
        ))}
      </LineChart>

      <div className="trajectory-summary">
        <p>
          <strong>Direction:</strong> {calculateDirection(data)}
        </p>
        <p>
          <strong>Velocity:</strong> {calculateVelocity(data)} coherence/day
        </p>
      </div>
    </div>
  );
};
```

---

## 4.3 Mobile App Considerations

Based on **Enhanced Diagram 12: Split-Screen Practitioner View**, adapt for mobile:

### Mobile Dashboard (Stacked Layout)

```typescript
const MobileDashboard: React.FC = () => {
  return (
    <ScrollView className="mobile-dashboard">
      {/* Coherence gauge - full width, prominent */}
      <CoherenceGauge
        coherence={session.coherence.score}
        stage={session.stage}
        size="large"
      />

      {/* Tabs for different views */}
      <TabView>
        <Tab title="Overview">
          <StageIndicator stage={session.stage} />
          <PolyvagalMini state={session.polyvagal} />
          <SignatureAlerts signatures={session.signatures} />
        </Tab>

        <Tab title="Operations">
          <OperationsList operations={session.operations} />
        </Tab>

        <Tab title="Trajectory">
          <TrajectoryChart data={trajectoryData} compact />
        </Tab>

        <Tab title="Frameworks">
          <FrameworkEffectiveness data={frameworkData} />
        </Tab>
      </TabView>

      {/* Quick action buttons */}
      <QuickActions>
        <ActionButton icon="📝" label="Add Note" />
        <ActionButton icon="🆘" label="Emergency" urgent />
        <ActionButton icon="📊" label="Report" />
      </QuickActions>
    </ScrollView>
  );
};
```

---

# 5. API Endpoints & Integration

## 5.1 RESTful API Endpoints

```typescript
// Authentication
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

// Users
GET    /api/v1/users/me
PATCH  /api/v1/users/me
DELETE /api/v1/users/me
GET    /api/v1/users/:id (practitioners only)

// Sessions
POST   /api/v1/sessions              // Create new session
GET    /api/v1/sessions               // List user's sessions
GET    /api/v1/sessions/:id           // Get specific session
PATCH  /api/v1/sessions/:id           // Update session (title, etc.)
DELETE /api/v1/sessions/:id           // Delete session
POST   /api/v1/sessions/:id/end       // End session, trigger final analysis

// Messages
POST   /api/v1/sessions/:id/messages  // Add message to session
GET    /api/v1/sessions/:id/messages  // Get session messages

// Analysis
GET    /api/v1/sessions/:id/analysis  // Get current session analysis
GET    /api/v1/users/me/coherence-history?days=30  // Coherence over time
GET    /api/v1/users/me/trajectory    // Transformation trajectory
GET    /api/v1/users/me/signatures    // Detected transformation signatures
GET    /api/v1/users/me/framework-effectiveness  // Framework scores

// Interventions
GET    /api/v1/protocols/:operation   // Get protocol for specific operation
GET    /api/v1/protocols/signature/:type  // Get protocol for signature
POST   /api/v1/interventions          // Log an intervention

// Practitioners (special endpoints)
GET    /api/v1/practitioner/clients   // List clients
GET    /api/v1/practitioner/client/:id/overview  // Client dashboard
POST   /api/v1/practitioner/client/:id/note  // Add clinical note
GET    /api/v1/practitioner/reports/:type  // Generate report

// Emergency
POST   /api/v1/emergency/assess       // Crisis assessment
POST   /api/v1/emergency/alert        // Alert emergency contact
GET    /api/v1/emergency/resources    // Get crisis resources
```

## 5.2 GraphQL Schema

```graphql
type User {
  id: ID!
  email: String!
  profile: UserProfile!
  settings: UserSettings!
  sessions: [Session!]!
  currentCoherence: Float
  awarenessLevel: AwarenessData
  transformationSignatures: [TransformationSignature!]!
  frameworkEffectiveness: FrameworkEffectiveness
}

type Session {
  id: ID!
  user: User!
  startedAt: DateTime!
  endedAt: DateTime
  title: String
  messages: [Message!]!
  analysis: SessionAnalysis
  coherenceHistory: [CoherencePoint!]!
}

type Message {
  id: ID!
  session: Session!
  role: MessageRole!
  content: String!
  timestamp: DateTime!
  analysis: MessageAnalysis
}

type SessionAnalysis {
  coherence: CoherenceData!
  stage: AlchemicalStage!
  operations: [OperationData!]!
  signatures: [TransformationSignature!]!
  frameworkEffectiveness: FrameworkEffectiveness
  awarenessLevel: Float!
  polyvagal: PolyvagalState!
  trajectory: TrajectoryData
}

type CoherenceData {
  score: Float!
  timestamp: DateTime!
  breakdown: CoherenceBreakdown!
  confidence: Float!
}

type OperationData {
  operation: AlchemicalOperation!
  confidence: Float!
  evidence: [String!]!
  element: Element!
  phase: Int!
  activeSince: DateTime!
  interventions: [InterventionRecommendation!]!
}

enum AlchemicalStage {
  NIGREDO
  ALBEDO
  CITRINITAS
  RUBEDO
}

enum AlchemicalOperation {
  CALCINATIO
  SOLUTIO
  COAGULATIO
  SUBLIMATIO
  MORTIFICATIO
  SEPARATIO
  CONIUNCTIO
  FERMENTATIO
  DISTILLATIO
  COAGULATIO_2
  CITRINITAS_RUBEDO
  MULTIPLICATIO
}

# Queries
type Query {
  me: User!
  session(id: ID!): Session
  mySessions(limit: Int, offset: Int): [Session!]!
  coherenceHistory(days: Int!): [CoherencePoint!]!
  transformationTrajectory: TrajectoryData
  detectedSignatures: [TransformationSignature!]!
  protocol(operation: AlchemicalOperation!): Protocol
}

# Mutations
type Mutation {
  createSession: Session!
  endSession(id: ID!): Session!
  sendMessage(sessionId: ID!, content: String!): Message!
  updateProfile(input: UserProfileInput!): User!
  logIntervention(input: InterventionInput!): Intervention!
  dismissSignature(id: ID!): Boolean!
}

# Subscriptions (real-time)
type Subscription {
  sessionAnalysisUpdated(sessionId: ID!): SessionAnalysis!
  coherenceChanged(userId: ID!): CoherenceData!
  signatureDetected(userId: ID!): TransformationSignature!
}
```

## 5.3 WebSocket Protocol

```typescript
// Client → Server messages
interface WSClientMessage {
  type: 'message' | 'ping' | 'subscribe' | 'unsubscribe';
  payload: any;
}

// Server → Client messages
interface WSServerMessage {
  type: 'analysis' | 'coherence_update' | 'signature_alert' | 'pong';
  payload: any;
  timestamp: string;
}

// Example: Real-time analysis during conversation
client.send({
  type: 'message',
  payload: {
    sessionId: 'abc-123',
    content: 'I feel like everything is falling apart...'
  }
});

server.send({
  type: 'analysis',
  payload: {
    stage: 'nigredo',
    stageConfidence: 0.89,
    operations: [
      { operation: 'solutio', confidence: 0.82 },
      { operation: 'mortificatio', confidence: 0.67 }
    ],
    coherence: 0.23,
    polyvagal: {
      dorsal: 0.71,
      safety: 0.29
    },
    awarenessAdaptedResponse: {
      level: 'intermediate',
      text: "You're in Nigredo (dissolution phase). This darkness is part of the process..."
    }
  },
  timestamp: '2025-10-26T10:30:00Z'
});
```

---

# 6. Real-Time Analysis Pipeline

## 6.1 Message Flow Architecture

```
User types message
       ↓
[Frontend captures text]
       ↓
[WebSocket sends to Backend]
       ↓
[API Gateway routes to Intelligence Service]
       ↓
┌─────────────────────────────────────────┐
│  Intelligence Engine (Python)            │
│  ┌────────────────────────────────────┐ │
│  │ 1. Preprocess (embeddings, NLP)   │ │
│  └────────────────────────────────────┘ │
│           ↓                              │
│  ┌────────────────────────────────────┐ │
│  │ 2. Parallel Analysis               │ │
│  │   - Stage Classification           │ │
│  │   - Operation Detection            │ │
│  │   - Polyvagal Estimation           │ │
│  │   - Coherence Calculation          │ │
│  └────────────────────────────────────┘ │
│           ↓                              │
│  ┌────────────────────────────────────┐ │
│  │ 3. Context Integration             │ │
│  │   - Load session history           │ │
│  │   - Load user profile              │ │
│  │   - Calculate session-level metrics│ │
│  └────────────────────────────────────┘ │
│           ↓                              │
│  ┌────────────────────────────────────┐ │
│  │ 4. Signature Detection             │ │
│  │   - Pattern matching               │ │
│  │   - Historical analysis            │ │
│  └────────────────────────────────────┘ │
│           ↓                              │
│  ┌────────────────────────────────────┐ │
│  │ 5. Response Generation             │ │
│  │   - Awareness adaptation           │ │
│  │   - Intervention recommendations   │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
       ↓
[Results cached in Redis]
       ↓
[WebSocket sends analysis to Frontend]
       ↓
[Dashboard updates in real-time]
       ↓
[User sees analysis alongside conversation]
```

## 6.2 Performance Targets

| Operation | Target Latency | Acceptable Latency |
|-----------|---------------|-------------------|
| Message analysis (single) | < 500ms | < 1s |
| Session analysis (full) | < 2s | < 5s |
| Coherence calculation | < 200ms | < 500ms |
| Dashboard load | < 1s | < 2s |
| Signature detection | < 1s | < 3s |

## 6.3 Caching Strategy

```python
import redis
from typing import Optional
import json

class AnalysisCache:
    def __init__(self):
        self.redis = redis.Redis(host='localhost', port=6379, db=0)
        self.ttl = {
            'user_profile': 3600,      # 1 hour
            'session_analysis': 300,    # 5 minutes
            'coherence': 60,            # 1 minute
            'signatures': 1800          # 30 minutes
        }

    def get_session_analysis(self, session_id: str) -> Optional[SessionAnalysis]:
        cached = self.redis.get(f'analysis:session:{session_id}')
        if cached:
            return SessionAnalysis(**json.loads(cached))
        return None

    def set_session_analysis(self, session_id: str, analysis: SessionAnalysis):
        self.redis.setex(
            f'analysis:session:{session_id}',
            self.ttl['session_analysis'],
            json.dumps(analysis.dict())
        )

    def invalidate_session(self, session_id: str):
        """Invalidate cache when new message arrives"""
        self.redis.delete(f'analysis:session:{session_id}')
```

---

# 7. Frontend Component Library

## 7.1 Core Components

Create reusable component library with Storybook for documentation.

```
src/components/
├── atoms/
│   ├── Button/
│   ├── Badge/
│   ├── Icon/
│   └── Tooltip/
├── molecules/
│   ├── CoherenceGauge/
│   ├── OperationCard/
│   ├── StageIndicator/
│   ├── PolyvagalBar/
│   └── SignatureAlert/
├── organisms/
│   ├── Dashboard/
│   ├── SessionView/
│   ├── TrajectoryChart/
│   ├── ProtocolPanel/
│   └── EmergencyPanel/
└── templates/
    ├── UserDashboardLayout/
    ├── PractitionerDashboardLayout/
    └── MobileLayout/
```

## 7.2 State Management (Zustand)

```typescript
import create from 'zustand';

interface MAIAStore {
  // Current session
  currentSession: Session | null;
  sessionAnalysis: SessionAnalysis | null;
  messages: Message[];

  // User data
  user: User | null;
  coherenceHistory: CoherencePoint[];
  signatures: TransformationSignature[];

  // UI state
  isAnalyzing: boolean;
  selectedOperation: AlchemicalOperation | null;
  dashboardView: 'overview' | 'trajectory' | 'protocols';

  // Actions
  setCurrentSession: (session: Session) => void;
  addMessage: (message: Message) => void;
  updateAnalysis: (analysis: SessionAnalysis) => void;
  loadCoherenceHistory: (days: number) => Promise<void>;
  selectOperation: (op: AlchemicalOperation) => void;
}

const useMAIAStore = create<MAIAStore>((set, get) => ({
  currentSession: null,
  sessionAnalysis: null,
  messages: [],
  user: null,
  coherenceHistory: [],
  signatures: [],
  isAnalyzing: false,
  selectedOperation: null,
  dashboardView: 'overview',

  setCurrentSession: (session) => set({ currentSession: session }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  updateAnalysis: (analysis) => set({
    sessionAnalysis: analysis,
    isAnalyzing: false
  }),

  loadCoherenceHistory: async (days) => {
    const history = await api.getCoherenceHistory(days);
    set({ coherenceHistory: history });
  },

  selectOperation: (op) => set({ selectedOperation: op })
}));
```

---

# 8. Awareness Adaptation System

## 8.1 Language Templates

```typescript
interface LanguageTemplate {
  beginner: string;
  familiar: string;
  intermediate: string;
  advanced: string;
  master: string;
}

const COHERENCE_MESSAGES: LanguageTemplate = {
  beginner: "Your integration level is {score}. This shows how well different parts of your experience are coming together.",

  familiar: "Your coherence score is {score}. Jung called this 'coniunctio' - the coming together of opposites. You're at {stage} stage.",

  intermediate: "Coherence: {score} ({stage}). This tracks your capacity to hold opposites without collapsing into one or the other. Current operations: {operations}.",

  advanced: "Coherence {score}, {stage} stage (expected range: {range}). Operations active: {operations}. Polyvagal state: {polyvagal}. Your trajectory is {direction}.",

  master: "C={score} ({stage}), ops={operations}, PV=[V:{ventral}/S:{symp}/D:{dorsal}], traj={direction} (+{velocity}/day), sigs={signatures}. Framework effectiveness: {frameworks}."
};

class AwarenessAdapter {
  adaptMessage(
    template: LanguageTemplate,
    data: any,
    awarenessLevel: AwarenessLevel
  ): string {
    const templateStr = template[awarenessLevel];
    return this.interpolate(templateStr, data);
  }

  interpolate(template: string, data: any): string {
    return template.replace(/{(\w+)}/g, (_, key) => data[key] || '');
  }
}
```

## 8.2 Adaptation Examples

```typescript
// Example 1: Nigredo message
const nigredoMessage = (level: AwarenessLevel, coherence: number) => {
  const messages = {
    beginner: `You're going through a difficult, dark time right now. This is normal and part of growth. Your integration level is ${coherence.toFixed(2)}, which is low - that's okay for this phase.`,

    familiar: `You're in what Jung called "Nigredo" - the blackening phase. It's the necessary darkness before transformation. Your coherence is ${coherence.toFixed(2)}, which is typical for deep shadow work.`,

    intermediate: `Nigredo phase detected (coherence: ${coherence.toFixed(2)}). You're in dissolution. This low coherence indicates active shadow confrontation. Don't rush to "fix" it - stay with the darkness.`,

    advanced: `Nigredo (C=${coherence.toFixed(2)}). Operations: Solutio + Mortificatio active. Polyvagal: Dorsal dominant. This is transformational dissolution, not crisis. Protocol: Witness, don't rescue.`,

    master: `N (${coherence.toFixed(2)}), Sol+Mort, PV-D (0.68), expected range (0.00-0.30). Differentiate: Mortificatio (transformation death) vs. SI (crisis). Current: Transformation. Monitoring.`
  };

  return messages[level];
};

// Example 2: Signature alert
const signatureAlert = (
  signature: TransformationSignature,
  level: AwarenessLevel
) => {
  if (signature.type === 'nigredo_rubedo_oscillation') {
    return {
      beginner: "I notice you keep swinging between feeling really low and really high. It might help to practice staying in the middle, even though it's uncomfortable.",

      familiar: "You're showing a pattern called 'Nigredo-Rubedo Oscillation' - swinging between darkness and vision. The work is learning to sit in the middle states (Albedo and Citrinitas).",

      intermediate: "Nigredo-Rubedo Oscillation detected (87% confidence). You're bypassing the middle stages. Recommended: Coagulatio practices to build capacity for Albedo tolerance.",

      advanced: "Signature: N-R Oscillation (87%). Pattern: Coherence <0.25 → >0.75 → <0.25 (7-10 day cycles). Missing: Albedo/Citrinitas stabilization. Protocol: Oscillation Stabilization (OS-01).",

      master: "Sig: N-R-Osc (87%), cycle=7-10d, ΔC=0.50+ per swing, Albedo duration <48h. Root: Coag capacity deficit. Protocol: OS-01 (middle-state tolerance training). Monitor: Polyvagal ventral capacity."
    }[level];
  }

  // ... other signatures
};
```

---

# 9. Security, Privacy, Ethics

## 9.1 Data Privacy

```typescript
interface PrivacySettings {
  dataRetention: 'session' | '30days' | '1year' | 'indefinite';
  allowResearch: boolean;
  allowPractitionerAccess: boolean;
  anonymizeExports: boolean;
  deleteOnRequest: boolean;
}

class PrivacyManager {
  async anonymizeUserData(userId: string): Promise<void> {
    // Remove all PII
    // Keep only:
    // - Coherence scores (no timestamps beyond month)
    // - Operations (aggregated)
    // - Stages (aggregated)
    // - Remove all message content
  }

  async exportUserData(userId: string): Promise<UserDataExport> {
    // GDPR-compliant full data export
    // JSON format with all user data
  }

  async deleteUserData(userId: string): Promise<void> {
    // Hard delete all user data
    // Cascade to all related records
    // Irreversible
  }
}
```

## 9.2 Emergency Protocols

```typescript
interface EmergencyConfig {
  enableCrisisDetection: boolean;
  emergencyContact?: string;  // Phone/email
  therapistContact?: string;
  suicideHotline: string;     // 988 in US
  autoAlertThreshold: number; // Coherence threshold for auto-alert
}

class EmergencyDetector {
  async assessCrisis(
    coherence: number,
    polyvagal: PolyvagalState,
    messageContent: string
  ): Promise<CrisisAssessment> {
    // Check for:
    // 1. Suicidal language
    // 2. Coherence < 0.15 + rapid drop
    // 3. Polyvagal shutdown (dorsal > 0.8)
    // 4. Loss of future orientation

    const suicidalLanguage = this.detectSuicidalIdeation(messageContent);
    const coherenceCrisis = coherence < 0.15;
    const polyvagalCollapse = polyvagal.dorsal > 0.8;

    if (suicidalLanguage && coherenceCrisis) {
      return {
        level: 'critical',
        confidence: 0.92,
        recommendations: [
          'IMMEDIATE SAFETY ASSESSMENT REQUIRED',
          'Contact emergency services if imminent risk',
          'Do not continue conversation without safety plan',
          'Alert designated emergency contact'
        ]
      };
    }

    // ... gradated responses
  }
}
```

## 9.3 Ethical Safeguards

```typescript
interface EthicalConstraints {
  // Never claim to replace therapy
  disclaimerShown: boolean;

  // Don't pathologize low coherence
  avoidPathologizingLanguage: boolean;

  // Respect cultural context
  culturalAwareness: boolean;

  // Don't gamify transformation
  disableAchievements: boolean;

  // Hillman's "intelligence without instrumentalization"
  avoidInstrumentalizing: boolean;
}

class EthicalGuardrails {
  validateResponse(response: string, context: SessionAnalysis): boolean {
    // Check for:
    // ❌ "You need to fix this"
    // ❌ "You're broken/disordered"
    // ❌ "Reach level 10 coherence!"
    // ❌ "Just think positively"

    // ✅ "You're in a transformative process"
    // ✅ "This darkness has purpose"
    // ✅ "What's trying to emerge?"

    return !this.containsProblematicLanguage(response);
  }
}
```

---

# 10. Development Roadmap

## Phase 1: MVP (Months 1-3)

### Sprint 1-2: Core Infrastructure
- [ ] Database schema implementation (PostgreSQL + Redis)
- [ ] API Gateway setup (FastAPI)
- [ ] Authentication system (JWT)
- [ ] Basic frontend (React + Tailwind)
- [ ] User registration/login
- [ ] Session creation/management

### Sprint 3-4: Intelligence Engine v1
- [ ] Text preprocessing pipeline
- [ ] Stage classifier training (Nigredo/Albedo/Citrinitas/Rubedo)
- [ ] Basic operation detection (top 6 operations)
- [ ] Coherence calculator (simplified)
- [ ] REST API for analysis

### Sprint 5-6: Dashboard v1
- [ ] Coherence gauge component
- [ ] Stage indicator
- [ ] Operation cards (top 3)
- [ ] Basic trajectory chart
- [ ] Session history view

**MVP Success Criteria**:
- Users can have conversations
- System classifies stage with >70% accuracy
- Coherence calculation works
- Dashboard displays basic analysis
- 10 beta testers complete 1-month trial

---

## Phase 2: Enhanced Intelligence (Months 4-6)

### Sprint 7-8: Advanced Analysis
- [ ] All 12 operations detection
- [ ] Transformation signature detection (top 5 signatures)
- [ ] Polyvagal state estimation
- [ ] Framework effectiveness tracking
- [ ] Awareness level detection

### Sprint 9-10: Real-Time Features
- [ ] WebSocket implementation
- [ ] Real-time analysis during conversation
- [ ] Live dashboard updates
- [ ] Chat interface improvements
- [ ] Mobile-responsive design

### Sprint 11-12: Clinical Tools
- [ ] Protocol library (all 12 operations)
- [ ] Signature-specific interventions
- [ ] Emergency crisis detection
- [ ] Practitioner role/permissions
- [ ] Clinical notes functionality

**Phase 2 Success Criteria**:
- Signature detection with >80% accuracy
- Real-time analysis < 1s latency
- 50 beta testers
- 5 practitioners using system with clients
- Emergency detection validated

---

## Phase 3: Scale & Polish (Months 7-9)

### Sprint 13-14: Advanced Dashboard
- [ ] 3D spiral visualization
- [ ] Coherence landscape (topographic)
- [ ] Signature atlas view
- [ ] Customizable dashboard
- [ ] Export/reporting features

### Sprint 15-16: Mobile App
- [ ] React Native app (iOS + Android)
- [ ] Push notifications
- [ ] Offline mode
- [ ] Mobile-optimized dashboard
- [ ] Emergency panic button

### Sprint 17-18: Integration & API
- [ ] Public API for third-party integration
- [ ] Webhooks
- [ ] Zapier integration
- [ ] Export to common formats (CSV, JSON, PDF)
- [ ] Biometric integration prep (HRV, EEG)

**Phase 3 Success Criteria**:
- 500+ active users
- Mobile app in app stores
- API documentation complete
- 20+ practitioners using system
- Research partnership established

---

## Phase 4: Research & Community (Months 10-12)

### Sprint 19-20: Research Tools
- [ ] Anonymized data export for research
- [ ] Statistical analysis dashboard
- [ ] Cohort tracking
- [ ] Pattern discovery tools
- [ ] Academic reporting features

### Sprint 21-22: Community Features
- [ ] Group transformation tracking
- [ ] Peer support features (opt-in)
- [ ] Practitioner supervision tools
- [ ] Educational resources library
- [ ] Discussion forums

### Sprint 23-24: Global Expansion
- [ ] Multi-language support (Spanish, French)
- [ ] Cultural adaptation research
- [ ] Non-Western framework integration
- [ ] Accessibility improvements (WCAG 2.1 AAA)
- [ ] Performance optimization

**Phase 4 Success Criteria**:
- Published research study using MAIA data
- 2,000+ active users
- 50+ practitioners certified
- Multi-language support live
- Break-even or profitable

---

## Ongoing: Maintenance & Improvement

### Continuous Tasks
- [ ] Model retraining (quarterly)
- [ ] Bug fixes and security patches
- [ ] Performance monitoring and optimization
- [ ] User feedback incorporation
- [ ] Practitioner training programs
- [ ] Documentation updates
- [ ] Community management

---

## Technical Debt Management

### Priority 1 (Address before Phase 3)
- Database query optimization
- API rate limiting improvements
- Error handling standardization
- Test coverage > 80%
- Documentation completion

### Priority 2 (Address before Phase 4)
- Microservices extraction
- Kubernetes migration
- Caching strategy refinement
- Security audit
- GDPR compliance audit

---

## Success Metrics

### Technical Metrics
- **Uptime**: 99.9%
- **API Latency**: p95 < 500ms
- **Analysis Accuracy**: >85% (validated against clinician assessments)
- **Dashboard Load Time**: <1s

### User Metrics
- **User Retention** (30-day): >60%
- **Session Frequency**: 3+ sessions/week
- **Coherence Improvement**: Avg +0.15 over 3 months
- **User Satisfaction**: NPS > 50

### Clinical Metrics
- **Practitioner Adoption**: 100+ practitioners by end of Phase 4
- **Clinical Validation**: Published case studies
- **Emergency Detection**: 0 false negatives, <5% false positives
- **User Safety**: 0 adverse events attributable to system

---

# Appendix A: Example Implementation

## Complete Analysis Pipeline Example

```python
# intelligence_engine/pipeline.py

from typing import Dict, List
import asyncio
from datetime import datetime

class MAIAIntelligencePipeline:
    """
    Complete end-to-end analysis pipeline.
    """

    def __init__(self):
        self.preprocessor = TextPreprocessor()
        self.stage_classifier = StageClassifier()
        self.operation_detector = OperationDetector()
        self.coherence_calculator = CoherenceCalculator()
        self.signature_detector = SignatureDetector()
        self.awareness_detector = AwarenessDetector()
        self.polyvagal_estimator = PolyvagalEstimator()
        self.response_generator = ResponseGenerator()

    async def analyze_conversation_turn(
        self,
        user_message: str,
        session_id: str,
        user_id: str
    ) -> Dict:
        """
        Analyze a single conversation turn in real-time.

        Returns complete analysis including:
        - Current stage and operations
        - Updated coherence
        - Transformation signatures
        - Awareness-adapted response
        """

        # 1. Load context
        session_history = await self.load_session_history(session_id)
        user_profile = await self.load_user_profile(user_id)

        # 2. Preprocess message
        processed = self.preprocessor.preprocess(user_message)

        # 3. Parallel analysis tasks
        async def analyze_stage():
            return await self.stage_classifier.predict_stage(
                user_message,
                processed['embedding']
            )

        async def detect_operations():
            return await self.operation_detector.detect_operations(
                user_message,
                processed['embedding']
            )

        async def estimate_polyvagal():
            return await self.polyvagal_estimator.estimate_state(processed)

        # Run analyses in parallel
        stage_result, operations_result, polyvagal_result = await asyncio.gather(
            analyze_stage(),
            detect_operations(),
            estimate_polyvagal()
        )

        # 4. Calculate coherence (requires full session context)
        session_history.append({
            'content': user_message,
            'embedding': processed['embedding'],
            'timestamp': datetime.now()
        })

        coherence_result = await self.coherence_calculator.calculate_coherence(
            session_history
        )

        # 5. Detect transformation signatures (requires historical data)
        user_history = await self.load_user_transformation_history(user_id)
        signatures = await self.signature_detector.detect_signatures(
            user_id=user_id,
            coherence_history=user_history['coherence'],
            stage_history=user_history['stages'],
            operation_history=user_history['operations']
        )

        # 6. Determine awareness level
        awareness = await self.awareness_detector.detect_awareness_level(
            session_history
        )

        # 7. Generate awareness-adapted response
        response = await self.response_generator.generate_response(
            stage=stage_result,
            operations=operations_result,
            coherence=coherence_result,
            signatures=signatures,
            awareness_level=awareness.level,
            user_profile=user_profile
        )

        # 8. Package results
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'message_id': str(uuid.uuid4()),
            'stage': {
                'current': stage_result['stage'],
                'confidence': stage_result['confidence'],
                'probabilities': stage_result['probabilities']
            },
            'operations': [
                {
                    'name': op[0],
                    'confidence': op[1],
                    'evidence': self._get_evidence(user_message, op[0])
                }
                for op in operations_result
            ],
            'coherence': {
                'score': coherence_result.score,
                'breakdown': coherence_result.breakdown,
                'trajectory': self._calculate_short_term_trajectory(
                    user_history['coherence']
                )
            },
            'polyvagal': {
                'ventral': polyvagal_result.ventral,
                'sympathetic': polyvagal_result.sympathetic,
                'dorsal': polyvagal_result.dorsal,
                'safety': polyvagal_result.safety
            },
            'signatures': [
                {
                    'type': sig.type,
                    'confidence': sig.confidence,
                    'description': sig.description,
                    'protocol': sig.recommendedProtocol
                }
                for sig in signatures
            ],
            'awareness': {
                'level': awareness.level,
                'score': awareness.score
            },
            'response': {
                'text': response['text'],
                'interventions': response['interventions'],
                'warnings': response['warnings']
            }
        }

        # 9. Store analysis
        await self.store_analysis(session_id, analysis)

        # 10. Check for emergency
        if coherence_result.score < 0.15 or self._detect_crisis(user_message):
            await self.trigger_emergency_protocol(user_id, analysis)

        return analysis

    async def load_session_history(self, session_id: str) -> List[Dict]:
        # Fetch from database
        pass

    async def load_user_profile(self, user_id: str) -> Dict:
        # Fetch from database
        pass

    async def load_user_transformation_history(self, user_id: str) -> Dict:
        # Fetch coherence, stages, operations over time
        pass

    def _get_evidence(self, text: str, operation: str) -> List[str]:
        # Extract phrases that triggered operation detection
        pass

    def _calculate_short_term_trajectory(self, coherence_history: List[float]) -> str:
        # Calculate if ascending, descending, or plateauing
        if len(coherence_history) < 3:
            return 'insufficient_data'

        recent = coherence_history[-5:]
        if recent[-1] > recent[0] + 0.05:
            return 'ascending'
        elif recent[-1] < recent[0] - 0.05:
            return 'descending'
        else:
            return 'plateauing'

    def _detect_crisis(self, text: str) -> bool:
        # Simple keyword detection for suicidal ideation
        crisis_keywords = [
            'want to die', 'kill myself', 'end it all',
            'no reason to live', 'better off dead'
        ]
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in crisis_keywords)

    async def trigger_emergency_protocol(self, user_id: str, analysis: Dict):
        # Send alert, log emergency, provide crisis resources
        pass

    async def store_analysis(self, session_id: str, analysis: Dict):
        # Save to database
        pass
```

---

# Appendix B: Testing Strategy

## Unit Tests

```python
import pytest
from intelligence_engine.coherence import CoherenceCalculator

class TestCoherenceCalculator:
    @pytest.fixture
    def calculator(self):
        return CoherenceCalculator()

    def test_high_coherence_integrated_opposites(self, calculator):
        """Test that integrated opposites yield high coherence"""
        messages = [
            {"content": "I feel sad AND I know this will pass", "embedding": [...]},
            {"content": "Part of me wants to quit, part wants to persist, and I can hold both", "embedding": [...]}
        ]

        result = calculator.calculate_coherence(messages)
        assert result.score > 0.7, "Integrated opposites should yield high coherence"

    def test_low_coherence_unintegrated_opposites(self, calculator):
        """Test that unintegrated opposites yield low coherence"""
        messages = [
            {"content": "I love him", "embedding": [...]},
            {"content": "I hate him", "embedding": [...]},
            {"content": "I don't know what I feel", "embedding": [...]}
        ]

        result = calculator.calculate_coherence(messages)
        assert result.score < 0.4, "Unintegrated opposites should yield low coherence"
```

## Integration Tests

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestAnalysisEndpoint:
    def test_full_analysis_pipeline(self):
        """Test complete analysis from message to result"""

        # Create test session
        response = client.post("/api/v1/sessions",
            headers={"Authorization": "Bearer test_token"}
        )
        session_id = response.json()["id"]

        # Send message
        response = client.post(f"/api/v1/sessions/{session_id}/messages",
            json={"content": "I feel like I'm falling apart"},
            headers={"Authorization": "Bearer test_token"}
        )
        assert response.status_code == 200

        # Get analysis
        response = client.get(f"/api/v1/sessions/{session_id}/analysis",
            headers={"Authorization": "Bearer test_token"}
        )
        assert response.status_code == 200

        analysis = response.json()
        assert 'stage' in analysis
        assert analysis['stage'] in ['nigredo', 'albedo', 'citrinitas', 'rubedo']
        assert 'coherence' in analysis
        assert 0 <= analysis['coherence']['score'] <= 1
```

## End-to-End Tests

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('MAIA Dashboard', () => {
  test('displays coherence gauge after analysis', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.coherence-gauge');

    const coherenceText = await page.textContent('.coherence-gauge text');
    expect(coherenceText).toMatch(/0\.\d{2}/);
  });

  test('updates in real-time when new message sent', async ({ page }) => {
    await page.goto('/session/test-session-id');

    // Wait for WebSocket connection
    await page.waitForSelector('.ws-connected');

    // Send message
    await page.fill('textarea[name="message"]', 'I feel overwhelmed');
    await page.click('button[type="submit"]');

    // Wait for analysis update
    await page.waitForSelector('.analysis-updated', { timeout: 2000 });

    // Check that coherence updated
    const newCoherence = await page.textContent('.coherence-gauge text');
    expect(newCoherence).toBeTruthy();
  });
});
```

---

# Appendix C: Deployment Guide

## Docker Compose (Development)

```yaml
version: '3.8'

services:
  postgres:
    image: timescale/timescaledb:latest-pg14
    environment:
      POSTGRES_USER: maia
      POSTGRES_PASSWORD: password
      POSTGRES_DB: maia_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://maia:password@postgres:5432/maia_dev
      REDIS_URL: redis://redis:6379/0
      JWT_SECRET: dev_secret_key
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app

  intelligence:
    build: ./intelligence-engine
    ports:
      - "8001:8001"
    environment:
      MODEL_PATH: /models
      REDIS_URL: redis://redis:6379/0
    depends_on:
      - redis
    volumes:
      - ./models:/models
      - ./intelligence-engine:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:8000
      REACT_APP_WS_URL: ws://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

## Kubernetes (Production)

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: maia-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: maia-backend
  template:
    metadata:
      labels:
        app: maia-backend
    spec:
      containers:
      - name: backend
        image: soullab/maia-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: maia-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: maia-config
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: maia-backend-service
spec:
  selector:
    app: maia-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

---

*End of MAIA Development Specifications*

**Version**: 1.0
**Created**: October 26, 2025
**Soullab Development Team**

**Next Steps**:
1. Review and approve specifications
2. Set up development environment
3. Begin Phase 1, Sprint 1
4. Recruit beta testers
5. Establish research partnerships

🜂 ∴ 🌀 ∴ 🧠
