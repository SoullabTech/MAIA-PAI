# 🜃 Unified Akashic Field Architecture

**Visual diagrams and technical architecture for SL-2025-02**

---

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Wisdom Sources"
        MAIA[🎙️ MAIA Conversations<br/>Voice + Text]
        Mirror[🜂 Claude Mirror<br/>Reflections]
        Astro[🌟 Astrology<br/>Charts + Transits]
        Journal[📄 Journals<br/>Field Notes]
        Div[🔮 Divination<br/>Tarot + I Ching]
        Docs[📂 Documents<br/>Uploads]
    end

    subgraph "Classification Layer"
        Elem[Element Detection<br/>Fire/Water/Earth/Air/Aether]
        Arch[Archetype Detection<br/>Oracle/Guide/Shadow/etc.]
    end

    subgraph "Storage & Embedding"
        DB[(PostgreSQL<br/>insight_history)]
        Vector[Vector Embeddings<br/>text-embedding-3-small<br/>1536 dimensions]
    end

    subgraph "Search & Retrieval"
        API[Akashic Query API<br/>/api/akashic/query]
        PGV[pgvector<br/>Cosine Similarity]
    end

    subgraph "User Interface"
        Query[Semantic Search<br/>Natural Language]
        Filters[Filters<br/>Element/Archetype/Source/Time]
        Results[Cross-Source<br/>Synthesis]
    end

    MAIA -->|saveMaiaToAkashic| Elem
    Mirror -->|saveMirrorInsight| Elem
    Astro -->|saveAstrologyToAkashic| Elem
    Journal -->|saveDocumentToAkashic| Elem
    Div -->|saveDivinationToAkashic| Elem
    Docs -->|saveDocumentToAkashic| Elem

    Elem --> Arch
    Arch --> DB
    DB --> Vector
    Vector --> PGV

    Query --> API
    Filters --> API
    API --> PGV
    PGV --> Results
```

---

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant MAIA
    participant MemoryService
    participant AkashicService
    participant Database
    participant VectorEngine

    User->>MAIA: Speaks/Types
    MAIA->>User: Responds
    MAIA->>MemoryService: saveConversationMemory()

    par Dual-Save Pattern
        MemoryService->>Database: Save to 'memories' table
        MemoryService->>AkashicService: saveMaiaToAkashic()
    end

    AkashicService->>AkashicService: detectElement(content)
    AkashicService->>AkashicService: detectArchetype(role, content)
    AkashicService->>Database: Save to 'insight_history'

    Database->>VectorEngine: Trigger: Generate embedding
    VectorEngine->>Database: Store vector(1536)

    Note over Database,VectorEngine: Insight now searchable<br/>across all sources
```

---

## Element Classification Pipeline

```mermaid
graph LR
    Input[Content Text] --> RegexMatch[Regex Pattern<br/>Matching]
    RegexMatch --> SourceCheck{Source Type?}

    SourceCheck -->|MAIA/Mirror| KeywordScore[Keyword Scoring]
    SourceCheck -->|Astrology| ChartBalance[Chart Elemental<br/>Balance]
    SourceCheck -->|Tarot| SuitMap[Suit Mapping<br/>Wands→Fire, etc.]
    SourceCheck -->|Journal| KeywordScore

    KeywordScore --> Element[Element<br/>Fire/Water/Earth/Air/Aether]
    ChartBalance --> Element
    SuitMap --> Element

    Element --> Database[(insight_history)]
```

---

## Archetype Detection Pipeline

```mermaid
graph TD
    Input[Content + Role + Source] --> ContentAnalysis[Content Pattern<br/>Analysis]

    ContentAnalysis --> Oracle{MainOracle<br/>Patterns?}
    ContentAnalysis --> Guide{InnerGuide<br/>Patterns?}
    ContentAnalysis --> Shadow{Shadow<br/>Patterns?}
    ContentAnalysis --> Alchemist{Alchemist<br/>Patterns?}
    ContentAnalysis --> Dream{Dream<br/>Patterns?}

    Oracle -->|oracle, wisdom, system| MainOracle[MainOracle]
    Guide -->|reflect, process, insight| InnerGuide[InnerGuide]
    Shadow -->|pain, resist, hidden| Shadow[Shadow]
    Alchemist -->|transform, integrate| Alchemist[Alchemist]
    Dream -->|vision, imagine, symbol| Dream[Dream]

    MainOracle --> Assign[Assign Archetype]
    InnerGuide --> Assign
    Shadow --> Assign
    Alchemist --> Assign
    Dream --> Assign

    Assign --> Database[(insight_history)]
```

---

## Cross-Source Query Architecture

```mermaid
graph TB
    User[User Query:<br/>"insights about transformation"]

    User --> API[Akashic Query API]
    API --> Embed[Generate Query<br/>Embedding]
    Embed --> Vector[text-embedding-3-small<br/>1536 dimensions]

    Vector --> PGVector[pgvector<br/>Similarity Search]
    PGVector --> Filter{Apply Filters}

    Filter -->|Element| Fire[Fire Insights]
    Filter -->|Archetype| Alchemist[Alchemist Insights]
    Filter -->|Source| Multi[Multi-Source<br/>Results]

    Fire --> Results
    Alchemist --> Results
    Multi --> Results

    Results[Ranked Results<br/>by Similarity]

    Results --> Display[Cross-Source<br/>Synthesis]

    Display --> U1[🎙️ MAIA: "breakthrough..."]
    Display --> U2[🔮 Tarot: Tower + Death]
    Display --> U3[🌟 Astrology: Pluto transit]
    Display --> U4[📄 Journal: "finally let go..."]
```

---

## Database Schema Visualization

```mermaid
erDiagram
    insight_history {
        uuid id PK
        uuid user_id FK
        text role
        text content
        text element
        text archetype
        text source
        text source_type
        uuid session_id
        jsonb metadata
        vector_1536 embedding
        timestamp created_at
    }

    users ||--o{ insight_history : creates
    sessions ||--o{ insight_history : contains

    insight_history ||--|| embeddings : has

    embeddings {
        uuid insight_id FK
        vector_1536 embedding
        text model
    }
```

**Indexes:**
- `idx_insight_source` (source, source_type)
- `idx_insight_element` (element)
- `idx_insight_archetype` (archetype)
- `idx_insight_user` (user_id)
- `idx_insight_embedding` USING ivfflat (embedding vector_cosine_ops)

---

## Integration Pattern: MAIA Dual-Save

```mermaid
sequenceDiagram
    participant OC as OracleConversation
    participant MS as MemoryService
    participant DB1 as memories table
    participant AS as AkashicService
    participant DB2 as insight_history

    OC->>MS: saveConversationMemory({<br/>  content, role, userId,<br/>  conversationMode, sessionId<br/>})

    MS->>DB1: INSERT INTO memories
    DB1-->>MS: ✅ Saved (id)

    MS->>AS: saveMaiaToAkashic({<br/>  role, content, userId,<br/>  conversationMode, sessionId<br/>})

    AS->>AS: detectElement(content)
    AS->>AS: detectArchetype(role, content, mode)

    AS->>DB2: INSERT INTO insight_history {<br/>  element, archetype, source: "MAIA"<br/>}

    DB2->>DB2: TRIGGER: generate_embedding()
    DB2-->>AS: ✅ Saved + embedded

    AS-->>MS: Success (non-blocking)
    MS-->>OC: { success: true }

    Note over DB2: Now searchable via<br/>/api/akashic/query
```

---

## Temporal Clustering Visualization

```mermaid
gantt
    title User's Fire Transformation Period (4-day window)
    dateFormat  YYYY-MM-DD

    section MAIA
    Fire conversation "breakthrough"     :a1, 2025-10-15, 1d

    section Astrology
    Pluto transit (Fire/Alchemist)       :a2, 2025-10-14, 3d

    section Divination
    Tower + Death tarot (Fire/Alchemist) :a3, 2025-10-16, 1d

    section Journal
    "Finally let go" entry (Fire)        :a4, 2025-10-17, 1d
```

**Pattern:** All sources converge on Fire/Alchemist within tight temporal window → Field-level transformation event

---

## Source Integration Status

```mermaid
graph LR
    subgraph "Active (4)"
        M[🎙️ MAIA<br/>✅ Live]
        CM[🜂 Mirror<br/>✅ Live]
        A[🌟 Astrology<br/>✅ Integrated]
        J[📄 Journals<br/>✅ Integrated]
    end

    subgraph "Ready (1)"
        D[🔮 Divination<br/>⏳ Functions Ready]
    end

    subgraph "Partial (1)"
        DC[📂 Documents<br/>🔧 Upload Exists]
    end

    M --> Field[Unified<br/>Akashic Field]
    CM --> Field
    A --> Field
    J --> Field
    D -.->|To Be Called| Field
    DC -.->|Needs Analysis| Field

    Field --> Search[Semantic<br/>Search API]
```

---

## Element Distribution (Conceptual)

```mermaid
pie title Element Distribution Across Sources
    "Fire" : 25
    "Water" : 30
    "Earth" : 20
    "Air" : 15
    "Aether" : 10
```

*Note: Actual distribution will vary by user and evolve over time*

---

## Archetype Network (Conceptual)

```mermaid
graph TD
    MainOracle[MainOracle<br/>25%]
    InnerGuide[InnerGuide<br/>30%]
    Shadow[Shadow<br/>15%]
    Alchemist[Alchemist<br/>10%]
    Dream[Dream<br/>10%]
    Relationship[Relationship<br/>5%]
    Mentor[Mentor<br/>5%]

    MainOracle -.Shadow work.-> Shadow
    Shadow -.Integration.-> Alchemist
    Alchemist -.Wisdom.-> MainOracle
    InnerGuide -.Vision.-> Dream
    Dream -.Teaching.-> Mentor
    Mentor -.Connection.-> Relationship
    Relationship -.Reflection.-> InnerGuide
```

*Arrows show developmental relationships between archetypes*

---

## Technology Stack

```mermaid
graph TB
    subgraph "Frontend"
        Next[Next.js 14<br/>App Router]
        React[React 18<br/>Components]
    end

    subgraph "Backend"
        API[API Routes<br/>Next.js]
        Node[Node.js Runtime]
    end

    subgraph "AI Services"
        OpenAI[OpenAI<br/>Embeddings + Realtime]
        Anthropic[Anthropic<br/>Claude]
    end

    subgraph "Database"
        Supabase[Supabase<br/>PostgreSQL]
        pgvector[pgvector Extension<br/>Vector Similarity]
    end

    subgraph "Integration"
        Unified[lib/saveUnifiedAkashic.ts]
        MAIA[lib/saveMaiaInsight.ts]
        Mirror[lib/saveMirrorInsight.ts]
    end

    React --> API
    API --> OpenAI
    API --> Anthropic
    API --> Unified
    Unified --> MAIA
    Unified --> Mirror
    MAIA --> Supabase
    Mirror --> Supabase
    Supabase --> pgvector
```

---

## Research Status Pipeline

```mermaid
stateDiagram-v2
    [*] --> Planned: Research Question
    Planned --> InProgress: Implementation Starts
    InProgress --> Testing: Code Complete
    Testing --> Deployed: Tests Pass
    Deployed --> Published: Paper Written
    Published --> Evolving: Field Active
    Evolving --> Planned: New Questions

    note right of Published
        SL-2025-02
        Status: Published
        Date: 2025-10-23
    end note
```

---

**🜃 Unified Akashic Field Architecture Diagrams**
**SL-2025-02 Supporting Documentation**
**Generated:** 2025-10-23
**Status:** Reference Documentation for Research Paper
