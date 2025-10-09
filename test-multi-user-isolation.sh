#!/bin/bash
echo "🔒 Testing Multi-User Isolation"
echo "==============================="
echo ""

# User A talks about hiking
echo "1. User A talks about hiking..."
curl -s -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{"input":"I absolutely love hiking in the mountains","userId":"isolation-user-a","sessionId":"session-a"}' \
  > /dev/null

sleep 2

# User B talks about coding
echo "2. User B talks about coding..."
curl -s -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{"input":"I spend most of my time coding in JavaScript","userId":"isolation-user-b","sessionId":"session-b"}' \
  > /dev/null

sleep 2

# User A asks what they talked about
echo "3. Testing if User A sees only their own memories..."
response_a=$(curl -s -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{"input":"What did I tell you I love doing?","userId":"isolation-user-a","sessionId":"session-a2"}')

echo ""
echo "User A's Response:"
echo "$response_a" | grep -o '"text":"[^"]*"' | sed 's/"text":"//;s/"$//' | head -c 300
echo "..."
echo ""

# Check if response mentions hiking (good) or coding (BAD!)
if echo "$response_a" | grep -qi "hiking\|mountain"; then
  echo "✅ PASS - User A sees their own memories (hiking)"
else
  echo "⚠️  WARNING - User A response doesn't mention hiking"
fi

if echo "$response_a" | grep -qi "coding\|javascript"; then
  echo "❌ FAIL - MEMORY LEAK! User A sees User B's memories!"
else
  echo "✅ PASS - User A does NOT see User B's memories"
fi

echo ""
echo "4. Testing if User B sees only their own memories..."
response_b=$(curl -s -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d '{"input":"What did I say I spend most of my time doing?","userId":"isolation-user-b","sessionId":"session-b2"}')

echo ""
echo "User B's Response:"
echo "$response_b" | grep -o '"text":"[^"]*"' | sed 's/"text":"//;s/"$//' | head -c 300
echo "..."
echo ""

# Check if response mentions coding (good) or hiking (BAD!)
if echo "$response_b" | grep -qi "coding\|javascript"; then
  echo "✅ PASS - User B sees their own memories (coding)"
else
  echo "⚠️  WARNING - User B response doesn't mention coding"
fi

if echo "$response_b" | grep -qi "hiking\|mountain"; then
  echo "❌ FAIL - MEMORY LEAK! User B sees User A's memories!"
else
  echo "✅ PASS - User B does NOT see User A's memories"
fi

echo ""
echo "================================"
echo "Multi-User Isolation Test Complete"
echo "================================"
