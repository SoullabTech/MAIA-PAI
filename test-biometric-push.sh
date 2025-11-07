#!/bin/bash
# Test pushing biometric data to live stream

curl -X POST http://localhost:3001/api/biometrics/stream \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "kelly",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "hrv": 25.5,
    "heartRate": 85,
    "respiratoryRate": 14,
    "source": "manual"
  }'

echo "\n\n✅ Biometric data pushed!"
