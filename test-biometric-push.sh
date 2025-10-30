#!/bin/bash

# Auto-push test biometric data
# Usage: ./test-biometric-push.sh

echo "🔄 Sending test biometric data..."

curl -X POST http://localhost:3001/api/biometrics/stream \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"test_user_$(date +%s)\",
    \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
    \"hrv\": 65.3,
    \"heartRate\": 72,
    \"source\": \"cli-test\"
  }" | jq '.'

echo ""
echo "✅ Test complete! Check the biometrics page to see the update."
echo "📍 http://localhost:3001/settings/biometrics"
