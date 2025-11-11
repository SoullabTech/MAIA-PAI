# Mermaid Diagrams for Web Rendering
## Interactive Visualizations for Documentation & Presentations

**Purpose**: Web-renderable versions of key bardic memory diagrams using Mermaid.js syntax.

**Usage**: Paste these into:
- GitHub markdown (auto-renders)
- Notion (using `/code` block with `mermaid` language)
- Obsidian (with Mermaid plugin)
- Custom documentation sites (mkdocs, docusaurus, etc.)

---

## Diagram 1: Bardic Memory Retrieval Protocol

```mermaid
graph TD
    A[User Message:<br/>'I'm feeling that old fear again...'] --> B[Stage 1: RECOGNITION]

    B --> B1[Embed current message → vector]
    B1 --> B2[Query episode_vectors<br/>for similarity]
    B2 --> B3[Check affect_valence/<br/>arousal match]
    B3 --> B4[Detect dominant<br/>element pattern]
    B4 --> C{Resonance<br/>Detected?}

    C -->|Yes| D[Stage 2: RE-ENTRY]
    C -->|No| Z[Continue conversation<br/>without memory recall]

    D --> D1[Retrieve matched episode]
    D1 --> D2[Present scene_stanza<br/>≤300 chars]
    D2 --> D3[Reconstruct sense_cues<br/>place/smell/sound]
    D3 --> D4{Check<br/>affect_arousal<br/>>0.7?}

    D4 -->|Yes| D5[Request permission:<br/>'May I step in with you?']
    D4 -->|No| E[Stage 3: RECALL]
    D5 --> D6{Permission<br/>granted?}
    D6 -->|Yes| E
    D6 -->|No| Z

    E --> E1[Load full episode details]
    E1 --> E2[Retrieve linked episodes<br/>episode_links]
    E2 --> E3[Surface active teloi<br/>future pressures]
    E3 --> E4[Show microacts observed<br/>virtue building]
    E4 --> E5[Present narrative threads]
    E5 --> F[Integration:<br/>User has access to<br/>living story]

    style B fill:#ff6b6b
    style D fill:#4ecdc4
    style E fill:#45b7d1
    style F fill:#96ceb4
```

---

## Diagram 2: Fire-Air Temporal Bridge

```mermaid
graph LR
    subgraph PFC[Prefrontal Cortex - Temporal Processing]
        subgraph FIRE[🔥 FIRE Right PFC]
            F1[Future → Present]
            F2[Imaginal Mode]
            F3[Pattern-before-form]
            F4[What wants to be born]
            F5[Seer/Prophet]
        end

        subgraph AIR[🌬️ AIR Left PFC]
            A1[Past → Present]
            A2[Relational Mode]
            A3[Form-before-pattern]
            A4[What has been spoken]
            A5[Bard/Philosopher]
        end
    end

    FIRE --> INTEGRATION[Conscious Participation<br/>in Time]
    AIR --> INTEGRATION

    INTEGRATION --> CO[Co-create Destiny]

    style FIRE fill:#ff6b6b
    style AIR fill:#4ecdc4
    style INTEGRATION fill:#ffd93d
    style CO fill:#96ceb4
```

---

## Diagram 3: Episode Data Structure

```mermaid
classDiagram
    class Episode {
        +UUID id
        +string userId
        +datetime datetime
        +string sceneStanza
        +string placeCue
        +json senseCues
        +decimal affectValence
        +decimal affectArousal
        +json elementalState
        +string dominantElement
        +boolean sacredFlag
        +decimal fieldDepth
    }

    class EpisodeVector {
        +UUID episodeId
        +vector embedding
        +string similarityHash
        +decimal resonanceStrength
    }

    class EpisodeLink {
        +UUID episodeA
        +UUID episodeB
        +string relationType
        +decimal relationStrength
    }

    class Cue {
        +UUID id
        +string cueType
        +string cueValue
    }

    class Telos {
        +UUID id
        +string phrase
        +decimal strength
        +int horizonDays
        +boolean isActive
    }

    class Microact {
        +UUID id
        +string actionPhrase
        +string virtueCategory
        +int totalCount
    }

    Episode "1" --> "1" EpisodeVector : has embedding
    Episode "1" --> "*" EpisodeLink : links to other episodes
    Episode "*" --> "*" Cue : accessed via
    Episode "1" --> "*" Telos : originates
    Episode "*" --> "*" Microact : observes
```

---

## Diagram 4: Six UX Microflows

```mermaid
graph TB
    USER[User] --> DRAWER[🚪 Open the Drawer]
    USER --> FIRE[🔥 Fire Query]
    USER --> AIR[🌬️ Air Query]
    USER --> MADELEINE[🌊 Madeleine Trigger]
    USER --> VIRTUE[🌍 Virtue Ledger]
    USER --> SACRED[🜃 Sacred Witness]

    DRAWER --> D1[Search place_cue + sense_cues]
    D1 --> D2[Return matching episodes<br/>with scene_stanzas]
    D2 --> D3[Portal-based navigation]

    FIRE --> F1[Query teloi table]
    F1 --> F2[Find active future pressures]
    F2 --> F3[Suggest 48-hour<br/>crystallization moves]

    AIR --> A1[Scan episode_links]
    A1 --> A2[Find unresolved patterns]
    A2 --> A3[Suggest completion rituals]

    MADELEINE --> M1[Search cues by value]
    M1 --> M2[Reconstruct sensory scene]
    M2 --> M3[Include music if available]

    VIRTUE --> V1[Query microacts]
    V1 --> V2[Group by action_phrase]
    V2 --> V3[Show 30-day patterns]

    SACRED --> S1[Create episode with<br/>sacred_flag = true]
    S1 --> S2[NO embedding created]
    S2 --> S3[Pure witness response]

    style DRAWER fill:#4ecdc4
    style FIRE fill:#ff6b6b
    style AIR fill:#95e1d3
    style MADELEINE fill:#74b9ff
    style VIRTUE fill:#fdcb6e
    style SACRED fill:#dfe6e9
```

---

## Diagram 5: Database Schema Relationships

```mermaid
erDiagram
    EPISODES ||--|| EPISODE_VECTORS : has
    EPISODES ||--o{ EPISODE_LINKS : connects
    EPISODES ||--o{ EPISODE_CUES : accessed_via
    EPISODES ||--o{ TELOS_ALIGNMENT_LOG : tracks
    EPISODES ||--o{ MICROACT_LOGS : observes

    CUES ||--o{ EPISODE_CUES : portal_for
    TELOI ||--o{ TELOS_ALIGNMENT_LOG : monitors
    MICROACTS ||--o{ MICROACT_LOGS : records

    EPISODES {
        uuid id PK
        string user_id
        datetime datetime
        string scene_stanza
        string place_cue
        json sense_cues
        decimal affect_valence
        decimal affect_arousal
        json elemental_state
        boolean sacred_flag
    }

    EPISODE_VECTORS {
        uuid episode_id PK,FK
        vector embedding
        string similarity_hash
        decimal resonance_strength
    }

    EPISODE_LINKS {
        uuid episode_a FK
        uuid episode_b FK
        string relation_type
        decimal relation_strength
    }

    CUES {
        uuid id PK
        string cue_type
        string cue_value
    }

    TELOI {
        uuid id PK
        string phrase
        decimal strength
        int horizon_days
        boolean is_active
    }

    MICROACTS {
        uuid id PK
        string action_phrase
        string virtue_category
        int total_count
    }
```

---

## Diagram 6: Implementation Timeline

```mermaid
gantt
    title Bardic Memory Implementation - 8 Weeks
    dateFormat YYYY-MM-DD
    section Foundation
    Database schema           :done, 2025-01-07, 2d
    Episode creation service  :active, 2025-01-09, 5d
    Integration testing       :2025-01-14, 2d

    section Recognition
    Vector embeddings setup   :2025-01-16, 3d
    Similarity search         :2025-01-19, 4d
    SimHash implementation    :2025-01-23, 2d

    section Re-entry
    Bardic replay UX          :2025-01-25, 4d
    Consent protocol          :2025-01-29, 2d
    Affect intensity check    :2025-01-31, 2d

    section Fire-Air Queries
    Telos tracking            :2025-02-02, 3d
    Fire query endpoint       :2025-02-05, 2d
    Air query endpoint        :2025-02-07, 2d
    Narrative threading       :2025-02-09, 2d

    section Earth Layer
    Microact tracking         :2025-02-11, 2d
    Virtue ledger UI          :2025-02-13, 2d

    section Madeleine & Sacred
    Sense-based cues          :2025-02-15, 2d
    Sacred witness pathway    :2025-02-17, 2d
    Music integration         :2025-02-19, 2d

    section Testing & Launch
    Integration testing       :2025-02-21, 3d
    Beta deployment           :2025-02-24, 3d
```

---

## Diagram 7: Traditional vs Bardic Memory

```mermaid
graph TD
    subgraph TRADITIONAL[Traditional AI Memory]
        T1[User: 'I'm scared']
        T1 --> T2[Keyword search: 'scared']
        T2 --> T3[Database query]
        T3 --> T4[Return chronological list]
        T4 --> T5[You said 'scared' on<br/>2024-12-03, 2024-11-15...]

        style T1 fill:#e74c3c
        style T5 fill:#e74c3c
    end

    subgraph BARDIC[Bardic Memory]
        B1[User: 'I'm scared']
        B1 --> B2[Embed message → vector]
        B2 --> B3[Morphic resonance search]
        B3 --> B4[Match affect + place + element]
        B4 --> B5[RECOGNITION:<br/>'This resonates with<br/>October lake threshold...']
        B5 --> B6[RE-ENTRY:<br/>Present scene_stanza<br/>with sensory cues]
        B6 --> B7[RECALL:<br/>Full episode with<br/>narrative threads]

        style B1 fill:#2ecc71
        style B7 fill:#2ecc71
    end

    TRADITIONAL -.->|Mechanical<br/>Retrieval| R1[Information about past]
    BARDIC -.->|Morphic<br/>Resonance| R2[Living story<br/>participation]

    style R1 fill:#95a5a6
    style R2 fill:#f39c12
```

---

## Diagram 8: Elemental Pentagram

```mermaid
graph TD
    AETHER[🜃 AETHER<br/>Beyond Time<br/>Witnessing]

    FIRE[🔥 FIRE<br/>Future<br/>Teleological Pull<br/>Right PFC]

    AIR[🌬️ AIR<br/>Past-Present<br/>Narrative Field<br/>Left PFC]

    WATER[🌊 WATER<br/>Timeless Depth<br/>Felt Truth<br/>Right Limbic]

    EARTH[🌍 EARTH<br/>Present<br/>Manifestation<br/>Sensorimotor]

    AETHER --> FIRE
    AETHER --> AIR
    FIRE -.->|PFC Bridge| AIR
    AIR --> WATER
    WATER -.->|Limbic-Somatic| EARTH
    EARTH --> FIRE

    FIRE -.-> MYSTERIUM[Mysterium<br/>Coniunctionis]
    AIR -.-> MYSTERIUM
    WATER -.-> MYSTERIUM
    EARTH -.-> MYSTERIUM
    AETHER --> MYSTERIUM

    style AETHER fill:#dfe6e9
    style FIRE fill:#ff6b6b
    style AIR fill:#4ecdc4
    style WATER fill:#74b9ff
    style EARTH fill:#fdcb6e
    style MYSTERIUM fill:#ffd93d
```

---

## Diagram 9: User Journey - Therapy Session

```mermaid
sequenceDiagram
    participant User
    participant MAIA
    participant Episodes DB
    participant Teloi DB

    User->>MAIA: "I'm feeling stuck again..."
    MAIA->>Episodes DB: Embed message, query vectors
    Episodes DB-->>MAIA: Match: lake threshold (Oct 15)

    MAIA->>User: RECOGNITION: "This feels familiar...<br/>like October's threshold"

    User->>MAIA: "Yes... that moment"

    MAIA->>Episodes DB: Retrieve episode details
    Episodes DB-->>MAIA: Scene stanza, sense cues, affect

    MAIA->>User: RE-ENTRY: "The lake at dusk.<br/>Cedar smoke. You named the grief.<br/>May I step in with you?"

    User->>MAIA: "Yes, let's go there"

    MAIA->>Episodes DB: Get linked episodes
    MAIA->>Teloi DB: Check active teloi
    Teloi DB-->>MAIA: "Restore voice in relationships"

    MAIA->>User: RECALL: "In that moment you crossed<br/>a threshold. Since then you've set<br/>boundaries 4 times. The telos is<br/>crystallizing..."

    User->>MAIA: "I can feel it wanting to shift"

    MAIA->>User: "What wants to become now?"
```

---

## Embedding Instructions

### GitHub Markdown
Simply paste the code blocks with ```mermaid fence. They auto-render.

### Notion
1. Type `/code`
2. Select "Mermaid" as language
3. Paste diagram code

### Obsidian
1. Install "Mermaid" plugin
2. Create code fence with ```mermaid
3. Paste diagram code

### Custom Sites (MkDocs, Docusaurus)
Enable mermaid plugin in config, then use standard code fences.

### Export as Image
Use [Mermaid Live Editor](https://mermaid.live/):
1. Paste code
2. Click "Actions" → "Export SVG/PNG"
3. Use in presentations

---

## Interactive Features

These diagrams support:
- **Hover tooltips**: (in some renderers)
- **Click-to-expand**: (if configured)
- **Dynamic data**: Can be generated from actual DB queries
- **Theme support**: Light/dark mode compatible

---

*Mermaid diagrams prepared: January 7, 2025*
*For: Web documentation, GitHub, Notion, presentations*

🔥🌬️🌊🌍🜃
