#!/bin/bash
# Test memory overflow - send 15 messages to see if system handles it

echo "🧪 Testing Memory Overflow (15+ exchanges)"
echo "=========================================="
echo ""

USER_ID="overflow-test-user"
SESSION_ID="overflow-session"

for i in {1..15}; do
  echo "Sending message $i/15..."
  curl -s -X POST 'http://localhost:3000/api/oracle/personal' \
    -H 'Content-Type: application/json' \
    -d "{\"input\":\"Test message number $i - just checking in\",\"userId\":\"$USER_ID\",\"sessionId\":\"$SESSION_ID\"}" \
    > /dev/null
  sleep 1
done

echo ""
echo "✅ Sent 15 messages. Now testing if MAIA can recall early messages..."
echo ""

response=$(curl -s -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d "{\"input\":\"What was my very first message to you?\",\"userId\":\"$USER_ID\",\"sessionId\":\"$SESSION_ID\"}")

echo "MAIA's Response:"
echo "$response" | grep -o '"text":"[^"]*"' | sed 's/"text":"//;s/"$//'
echo ""
echo "✅ Test complete. Check if response mentions 'message number 1' or 'first message'"
