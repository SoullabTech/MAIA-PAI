#!/bin/bash

# Test Field Service Query API
# This sends a query vector to field.soullab.life and checks the FRI response

# Generate a simple test vector (1536 values of 0.1)
QUERY_VECTOR=$(node -e "console.log(JSON.stringify(Array(1536).fill(0.1)))")

echo "Testing Field Service at https://field.soullab.life"
echo "Sending query vector..."
echo ""

# Make the request
curl -X POST https://field.soullab.life/api/field/query \
  -H "X-Node-ID: test-local-node" \
  -H "Authorization: Bearer ${AKASHIC_FIELD_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"qvec\": ${QUERY_VECTOR},
    \"limit\": 10,
    \"queryText\": \"test query for transformation through vulnerability\"
  }" \
  | jq '.'

echo ""
echo "If you see FRI and resonance data above, the field is operational!"
