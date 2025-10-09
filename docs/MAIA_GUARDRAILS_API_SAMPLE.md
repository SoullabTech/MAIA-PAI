# MAIA Guardrails API Sample Response

**Endpoint**: `GET /api/v1/admin/maia-guardrails`

**Purpose**: Single-query endpoint returning complete guardrail status from `metrics.monitor_payload`

---

## Sample Response (All Healthy)

```json
{
  "overallStatus": "healthy",
  "totalAlerts": 0,
  "dashboard": [],
  "details": {
    "giving_up": {
      "week": "2025-09-29T00:00:00.000Z",
      "repair_engagement_pct": 45.2,
      "prev_eng": 43.8,
      "correction_accuracy_pct": 78.5,
      "prev_acc": 76.2,
      "is_giving_up_week": false,
      "status": "OK"
    },
    "circuit_breaker": {
      "week": "2025-09-29T00:00:00.000Z",
      "circuit_breaker_pct": 0.0,
      "status": "OK"
    },
    "reentry": {
      "week": "2025-09-29T00:00:00.000Z",
      "reentry_7_29d_pct": 65.3,
      "reentry_ge30d_pct": 48.7,
      "status": "OK"
    },
    "uncertainty": {
      "week": "2025-09-29T00:00:00.000Z",
      "uncertainty_acceptance_pct": 52.1,
      "baseline_pct": 35.0,
      "status": "OK"
    },
    "voicecheck": {
      "week": "2025-09-29T00:00:00.000Z",
      "negative_tags": 8,
      "total_tags": 45,
      "negative_share_pct": 17.8,
      "status": "OK"
    }
  },
  "timestamp": "2025-10-01T14:32:15.234Z"
}
```

---

## Sample Response (Warnings & Critical)

```json
{
  "overallStatus": "critical",
  "totalAlerts": 3,
  "dashboard": [
    {
      "guardrail": "Circuit Breaker",
      "status": "CRIT",
      "alert": "1.2% of sessions have >5 corrections"
    },
    {
      "guardrail": "Giving Up Warning",
      "status": "WARN",
      "alert": "Engagement down 7pp, accuracy flat"
    },
    {
      "guardrail": "Voice Check",
      "status": "WARN",
      "alert": "28.3% negative feedback signals"
    }
  ],
  "details": {
    "giving_up": {
      "week": "2025-09-29T00:00:00.000Z",
      "repair_engagement_pct": 38.5,
      "prev_eng": 45.2,
      "correction_accuracy_pct": 78.8,
      "prev_acc": 78.5,
      "is_giving_up_week": true,
      "status": "WARN"
    },
    "circuit_breaker": {
      "week": "2025-09-29T00:00:00.000Z",
      "circuit_breaker_pct": 1.2,
      "status": "CRIT"
    },
    "reentry": {
      "week": "2025-09-29T00:00:00.000Z",
      "reentry_7_29d_pct": 65.3,
      "reentry_ge30d_pct": 48.7,
      "status": "OK"
    },
    "uncertainty": {
      "week": "2025-09-29T00:00:00.000Z",
      "uncertainty_acceptance_pct": 52.1,
      "baseline_pct": 35.0,
      "status": "OK"
    },
    "voicecheck": {
      "week": "2025-09-29T00:00:00.000Z",
      "negative_tags": 17,
      "total_tags": 60,
      "negative_share_pct": 28.3,
      "status": "WARN"
    }
  },
  "timestamp": "2025-10-01T14:32:15.234Z"
}
```

---

## Status Mapping

| SQL Status | API Status | Dashboard Color | Meaning |
|------------|------------|-----------------|---------|
| `OK` | `healthy` | Green | All metrics within acceptable ranges |
| `WARN` | `warning` | Yellow | Metrics degrading, attention needed |
| `CRIT` | `critical` | Red | Immediate action required |

---

## Dashboard Field Descriptions

| Field | Description |
|-------|-------------|
| `overallStatus` | Worst status across all monitors (CRIT > WARN > OK) |
| `totalAlerts` | Number of monitors currently in WARN or CRIT state |
| `dashboard` | Array of active alerts (only includes non-OK monitors) |
| `details` | Complete monitor payload for all 5 guardrails |
| `timestamp` | When this snapshot was generated (ISO 8601) |

---

## Using the Response

### Frontend Dashboard Cards

```javascript
// Overall status card
const statusMap = {
  'healthy': { emoji: '✅', text: 'Healthy', color: 'green' },
  'warning': { emoji: '⚠️', text: 'Warning', color: 'yellow' },
  'critical': { emoji: '🔴', text: 'Critical', color: 'red' }
};
const status = statusMap[data.overallStatus];

// Circuit breaker card
const cbStatus = data.details.circuit_breaker.status;
const cbPct = data.details.circuit_breaker.circuit_breaker_pct;
if (cbStatus === 'CRIT') {
  showAlert(`Circuit breaker: ${cbPct}% of sessions catastrophic`);
}

// Giving up card
const givingUp = data.details.giving_up;
if (givingUp.is_giving_up_week) {
  const engagementDrop = Math.round(givingUp.prev_eng - givingUp.repair_engagement_pct);
  showWarning(`Users may be giving up: engagement down ${engagementDrop}pp`);
}
```

### Alert Ticker

```javascript
// Build recent alerts from dashboard array (already filtered to alerts only)
data.dashboard.forEach(alert => {
  addAlertToTicker({
    type: alert.guardrail,
    message: alert.alert,
    severity: alert.status === 'CRIT' ? 3 : 2
  });
});
```

---

## Threshold Tuning

**Endpoint**: `GET /api/v1/admin/maia-guardrails/thresholds`

Returns all configurable thresholds:

```json
[
  { "key": "giving_up_min_drop_pp", "value": 5.0 },
  { "key": "giving_up_min_acc_rise_pp", "value": 2.0 },
  { "key": "circuit_breaker_warn_pct", "value": 0.0 },
  { "key": "circuit_breaker_crit_pct", "value": 0.5 },
  { "key": "voicecheck_neg_warn_pct", "value": 25.0 },
  { "key": "voicecheck_neg_crit_pct", "value": 40.0 }
]
```

**Update threshold**:

```bash
PUT /api/v1/admin/maia-guardrails/thresholds
{
  "key": "circuit_breaker_crit_pct",
  "value": 1.0
}
```

Or directly via SQL:

```sql
UPDATE metrics.thresholds
SET value = 1.0
WHERE key = 'circuit_breaker_crit_pct';
```

---

## Operational Notes

1. **Data Freshness**: Views update with weekly rollup (runs Monday morning)
2. **Caching**: Dashboard auto-refreshes every 5 minutes
3. **Fallback**: If `monitor_payload` returns no rows, API returns empty healthy state
4. **Alerts**: Only non-OK monitors appear in `dashboard` array (prevents noise)

---

## Error Response

```json
{
  "error": "Failed to fetch MAIA guardrails data",
  "overallStatus": "unknown",
  "totalAlerts": 0,
  "dashboard": [],
  "details": {
    "giving_up": null,
    "circuit_breaker": null,
    "reentry": null,
    "uncertainty": null,
    "voicecheck": null
  }
}
```

HTTP Status: `500 Internal Server Error`
