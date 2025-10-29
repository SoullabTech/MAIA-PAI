# Researcher API Documentation

**AIN Soph Consciousness Research API**
Version: 1.0
Last Updated: 2025-10-26

## Overview

The AIN Soph Researcher API provides privacy-preserving access to anonymized consciousness measurement data for scientific research. This API is designed specifically for consciousness researchers, with particular support for validating QRI's Symmetry Theory of Valence.

## Authentication

All requests require researcher authentication:

```
X-Researcher-ID: <your-researcher-id>
Authorization: Bearer <your-api-key>
```

To obtain researcher access, contact: research@soullab.com

## Base URL

```
https://api.ainsoph.com/api/research
```

---

## Endpoints

### 1. Dataset Management

#### List Datasets

Get all datasets accessible to your researcher account.

**Request:**
```http
GET /datasets?researcher_id=<researcher-id>
```

**Response:**
```json
{
  "datasets": [
    {
      "id": "DS_1698765432_abc123",
      "name": "Meditation Practitioners 2024",
      "description": "Qualia states from daily meditation practitioners",
      "total_participants": 150,
      "total_sessions": 3450,
      "anonymization_level": "standard",
      "avg_symmetry": 0.72,
      "avg_valence": 0.35,
      "created_at": "2024-10-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

#### Create Dataset

Create a new research dataset with filters and anonymization.

**Request:**
```http
POST /datasets
Content-Type: application/json

{
  "name": "Psychedelic Integration Study",
  "description": "6-month integration tracking post-psychedelic experience",
  "researcher_id": "researcher-123",
  "organization": "QRI",
  "filters": {
    "practiceTypes": ["psychedelic"],
    "dateRange": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    },
    "minSymmetry": 0.5
  },
  "anonymization_level": "enhanced",
  "require_consent": true,
  "minimum_cohort_size": 5
}
```

**Response:**
```json
{
  "success": true,
  "dataset_id": "DS_1698765432_xyz789",
  "metadata": {
    "id": "DS_1698765432_xyz789",
    "total_participants": 78,
    "total_sessions": 892,
    "k_anonymity": 8,
    "reidentification_risk": "low",
    "privacy_guarantees": [
      "No personally identifiable information (PII)",
      "Hashed participant IDs",
      "Temporal fuzzing (month-level precision)",
      "K-anonymity enforced",
      "Differential privacy noise added"
    ]
  },
  "preview": [
    {
      "participant_id": "P000001",
      "timestamp": "2024-06-01T00:00:00Z",
      "session_number": 5,
      "dimensions": {
        "clarity": 0.82,
        "energy": 0.75,
        "connection": 0.88,
        "expansion": 0.79,
        "presence": 0.85,
        "flow": 0.81
      },
      "valence": {
        "value": 0.45,
        "intensity": 0.82,
        "symmetry": 0.79
      },
      "symmetry": {
        "global": 0.79,
        "fractality": 0.73,
        "coherence": 0.81
      }
    }
  ]
}
```

**Anonymization Levels:**
- `minimal`: Remove direct identifiers only
- `standard`: + temporal fuzzing, aggregate small samples
- `enhanced`: + differential privacy, k-anonymity

---

### 2. Data Export

#### Export Dataset

Export dataset in specified format (JSON, CSV, NDJSON).

**Request:**
```http
GET /datasets/{dataset_id}/export?researcher_id=<id>&format=csv
```

**Formats:**
- `json` - JSON array (default)
- `csv` - CSV file (suitable for Excel, R, SPSS)
- `ndjson` - Newline-delimited JSON (streaming)
- `parquet` - Apache Parquet (Python/Pandas)

**Response Headers:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="dataset_DS_123.csv"
X-Dataset-ID: DS_1698765432_xyz789
X-Anonymization-Level: standard
X-Privacy-Risk: low
X-Total-Participants: 78
X-Total-Sessions: 892
```

**CSV Format:**
```csv
participant_id,timestamp,session_number,clarity,energy,connection,expansion,presence,flow,valence,valence_intensity,valence_symmetry,symmetry_global,symmetry_fractality,symmetry_coherence,practice,duration,setting
P000001,2024-06-01T00:00:00Z,5,0.82,0.75,0.88,0.79,0.85,0.81,0.45,0.82,0.79,0.79,0.73,0.81,psychedelic,7200,therapeutic
```

---

### 3. Aggregate Statistics

#### Get Statistics

Get aggregate statistics (privacy-safe, minimum 10 samples).

**Request:**
```http
GET /statistics?practice=meditation&start_date=2024-01-01&min_symmetry=0.5
```

**Response:**
```json
{
  "success": true,
  "statistics": {
    "sample_size": 1523,
    "participant_count": 87,
    "dimensions": {
      "mean": {
        "clarity": 0.72,
        "energy": 0.68,
        "connection": 0.75,
        "expansion": 0.70,
        "presence": 0.78,
        "flow": 0.71
      },
      "stdDev": {
        "clarity": 0.15,
        "energy": 0.18,
        "connection": 0.14,
        "expansion": 0.16,
        "presence": 0.13,
        "flow": 0.17
      }
    },
    "symmetry": {
      "mean": 0.73,
      "stdDev": 0.12,
      "distribution": {
        "min": 0.23,
        "q25": 0.65,
        "median": 0.74,
        "q75": 0.83,
        "max": 0.97
      }
    },
    "valence": {
      "mean": 0.38,
      "stdDev": 0.25,
      "distribution": {
        "min": -0.82,
        "q25": 0.18,
        "median": 0.42,
        "q75": 0.61,
        "max": 0.95
      }
    },
    "correlations": {
      "symmetryValence": 0.67
    }
  },
  "privacy_compliant": true
}
```

---

### 4. Symmetry Theory of Valence Validation

#### Validate STV

Validate QRI's Symmetry Theory of Valence hypothesis at scale.

**Request:**
```http
POST /statistics/stv-validation
Content-Type: application/json

{
  "filters": {
    "practiceTypes": ["meditation", "breathwork"],
    "dateRange": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    }
  },
  "confidence_level": 0.95,
  "include_distributions": true
}
```

**Response:**
```json
{
  "success": true,
  "validation": {
    "correlation": 0.72,
    "pValue": 0.0001,
    "sampleSize": 2847,
    "confidenceInterval": [0.68, 0.76],
    "conclusion": "Strong positive correlation (R² = 0.720) between symmetry and valence. STV hypothesis strongly supported.",
    "distributions": {
      "symmetry": {
        "min": 0.12,
        "q25": 0.65,
        "median": 0.75,
        "q75": 0.85,
        "max": 0.98
      },
      "valence": {
        "min": -0.95,
        "q25": 0.15,
        "median": 0.45,
        "q75": 0.68,
        "max": 0.97
      }
    }
  },
  "hypothesis": "Symmetry Theory of Valence: Hedonic tone is determined by symmetry of consciousness states",
  "interpretation": {
    "support": "strong",
    "explanation": "Strong positive correlation (R² = 0.720) between symmetry and valence. STV hypothesis strongly supported.",
    "implications": [
      "Hedonic tone appears to be strongly determined by consciousness symmetry",
      "Results align with QRI's Symmetry Theory of Valence",
      "Measurement tools successfully capture STV predictions",
      "Sample size (n=2847) provides robust evidence"
    ]
  }
}
```

**Interpretation Levels:**
- `strong`: R² > 0.5, p < 0.05
- `moderate`: R² > 0.3, p < 0.05
- `weak`: R² > 0.1, p < 0.05
- `none`: p >= 0.05

---

### 5. Consent Management

#### Check Consent Status

**Request:**
```http
GET /consent?user_id=<user-id>
```

**Response:**
```json
{
  "has_consent": true,
  "is_active": true,
  "consent": {
    "consented_at": "2024-01-15T10:30:00Z",
    "expires_at": null,
    "withdrawn_at": null,
    "consent_level": "anonymizedIndividual",
    "exclude_practices": [],
    "can_withdraw": true,
    "consent_version": "1.0"
  }
}
```

#### Register Consent

**Request:**
```http
POST /consent
Content-Type: application/json

{
  "user_id": "user-123",
  "consent_level": "anonymizedIndividual",
  "exclude_practices": ["psychedelic"],
  "expires_in_days": null,
  "consent_version": "1.0"
}
```

**Consent Levels:**
- `aggregateOnly`: Only aggregate statistics (no individual records)
- `anonymizedIndividual`: Anonymized individual records
- `fullDataset`: Full research access (rare, for specific studies)

#### Withdraw Consent

**Request:**
```http
DELETE /consent?user_id=<user-id>
```

**Response:**
```json
{
  "success": true,
  "message": "Research consent withdrawn successfully. Your data will no longer be included in future research datasets.",
  "note": "Data already exported in existing datasets cannot be retroactively removed, but no new exports will include your data."
}
```

---

## Data Schema

### QualiaState (Anonymized)

```typescript
interface AnonymizedQualiaState {
  participant_id: string;        // Hashed ID (e.g., "P000123")
  timestamp: Date;                // Fuzzed to month level
  session_number: number;         // 1, 2, 3, ... (per participant)

  // 6-Dimensional Consciousness Mapping
  dimensions: {
    clarity: number;              // 0-1: Confused → Crystal clear
    energy: number;               // 0-1: Depleted → Energized
    connection: number;           // 0-1: Isolated → Unified
    expansion: number;            // 0-1: Contracted → Expansive
    presence: number;             // 0-1: Dissociated → Embodied
    flow: number;                 // 0-1: Stuck → Flowing
  };

  // Valence (Hedonic Tone)
  valence: {
    value: number;                // -1 to +1: Pain → Pleasure
    intensity: number;            // 0-1: Mild → Intense
    symmetry: number;             // 0-1: QRI STV metric
  };

  // Symmetry Metrics (QRI)
  symmetry: {
    global: number;               // 0-1: Overall symmetry
    local: number[];              // Regional symmetries
    harmonics: number[];          // Harmonic relationships
    fractality: number;           // 0-1: Self-similarity
    coherence: number;            // 0-1: Internal consistency
  };

  // Session Context
  context: {
    practice: string;             // meditation, breathwork, psychedelic, etc.
    duration: number;             // Seconds
    setting: string;              // solo, group, guided, retreat, etc.
  };

  // Phenomenology (summary)
  hasDescription: boolean;
  insightCount: number;
  symbolCount: number;
  texturePresent: {
    sensory: boolean;
    emotional: boolean;
    cognitive: boolean;
    somatic: boolean;
  };

  // AIN Soph Mapping
  ainSophMapping: {
    elements: {
      earth: number;              // 0-1: Grounding
      water: number;              // 0-1: Emotion/flow
      air: number;                // 0-1: Clarity/communication
      fire: number;               // 0-1: Transformation/energy
    };
    phase: string;                // nigredo, albedo, citrinitas, rubedo
    sefiraAlignment: string[];    // Activated Tree of Life nodes
  };
}
```

---

## Privacy & Ethics

### Privacy Guarantees

All datasets include:
1. **No PII**: No names, emails, location data
2. **Hashed IDs**: Irreversible participant identifiers
3. **Temporal Fuzzing**: Month-level precision only
4. **K-Anonymity**: Minimum 5 records per participant (configurable)
5. **Differential Privacy**: Noise added for enhanced protection
6. **User Consent**: All data requires explicit opt-in

### Re-identification Risk

Datasets are audited for re-identification risk:
- **Low**: Enhanced anonymization, k ≥ 5, n ≥ 20
- **Medium**: Standard anonymization, k ≥ 3, n ≥ 10
- **High**: Minimal anonymization (not recommended for publication)

### Ethical Guidelines

Researchers must:
1. Use data only for approved research purposes
2. Not attempt to re-identify participants
3. Cite AIN Soph platform in publications
4. Share findings with community when appropriate
5. Respect user privacy and consent preferences

---

## Rate Limits

- **Free tier**: 100 requests/hour
- **Institutional**: 1000 requests/hour
- **QRI partnership**: Unlimited (contact us)

---

## Error Codes

- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (insufficient access)
- `404` - Not Found (dataset doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## SDKs & Tools

### Python

```python
from ainsoph_research import ResearchClient

client = ResearchClient(
    researcher_id="your-id",
    api_key="your-key"
)

# Create dataset
dataset = client.create_dataset(
    name="Meditation Study 2024",
    filters={"practiceTypes": ["meditation"]},
    anonymization_level="standard"
)

# Export as DataFrame
df = client.export_dataframe(dataset.id)

# Validate STV
validation = client.validate_stv(
    filters={"practiceTypes": ["meditation", "psychedelic"]},
    confidence_level=0.95
)

print(f"R² = {validation.correlation:.3f}, p = {validation.p_value:.4f}")
```

### R

```r
library(ainsoph)

client <- AinSophClient(
  researcher_id = "your-id",
  api_key = "your-key"
)

# Get statistics
stats <- get_statistics(
  client,
  practice = "meditation",
  start_date = "2024-01-01"
)

# Export dataset
dataset <- export_dataset(
  client,
  dataset_id = "DS_123",
  format = "csv"
)

# Analyze STV
cor.test(dataset$symmetry_global, dataset$valence_value)
```

---

## Example Research Questions

### 1. Validate Symmetry Theory of Valence
```http
POST /statistics/stv-validation
{
  "filters": {
    "minSymmetry": 0.3,
    "practiceTypes": ["meditation", "breathwork", "psychedelic"]
  },
  "confidence_level": 0.95
}
```

### 2. Compare Practices
```http
GET /statistics?practice=meditation
GET /statistics?practice=psychedelic
```

### 3. Longitudinal Trajectories
```http
POST /datasets
{
  "filters": {
    "minSessionCount": 20,
    "dateRange": {"start": "2024-01-01", "end": "2024-12-31"}
  }
}
```

### 4. Symmetry Distribution
```http
GET /statistics?min_symmetry=0.8&include_distributions=true
```

---

## Support

**Documentation**: https://docs.ainsoph.com/research
**Email**: research@soullab.com
**QRI Partnership**: qri@soullab.com

**Office Hours**: Tuesdays 2-4pm PT (for QRI and institutional partners)

---

## Citation

If you use this platform in your research, please cite:

```
Nezat, K. (2024). AIN Soph: A Platform for Consciousness Measurement and Research.
Soullab. https://ainsoph.com
```

---

## Changelog

**v1.0** (2025-10-26)
- Initial release
- QRI Symmetry Theory of Valence support
- Privacy-preserving anonymization
- Multi-format export (JSON, CSV, NDJSON)
- Researcher API with consent management

---

**Built for consciousness researchers. Powered by science and wisdom.** ✨
