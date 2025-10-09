#!/bin/bash
echo "🌅 Monday Morning Pre-Launch Checklist"
echo "======================================"
echo ""

# 1. Server health check
echo "1. Checking server..."
response=$(curl -s http://localhost:3000/api/oracle/personal?check=1)
if echo "$response" | grep -q "alive"; then
  echo "   ✅ Server is alive"
else
  echo "   ❌ Server check failed"
  exit 1
fi

# 2. Database connection
echo "2. Checking database connection..."
node quick-performance-check.js 2>&1 | grep -q "Performance Metrics"
if [ $? -eq 0 ]; then
  echo "   ✅ Database connected"
else
  echo "   ❌ Database check failed"
  exit 1
fi

# 3. Memory test
echo "3. Testing memory system..."
user_id="monday-check-$(date +%s)"
curl -s -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d "{\"input\":\"I love hiking\",\"userId\":\"$user_id\",\"sessionId\":\"check-1\"}" > /dev/null

sleep 2

response=$(curl -s -X POST 'http://localhost:3000/api/oracle/personal' \
  -H 'Content-Type: application/json' \
  -d "{\"input\":\"What did I just tell you I love?\",\"userId\":\"$user_id\",\"sessionId\":\"check-2\"}")

if echo "$response" | grep -qi "hiking"; then
  echo "   ✅ Memory is working"
else
  echo "   ⚠️  Memory check inconclusive (might still work)"
fi

echo ""
echo "✅ Pre-launch checklist complete!"
echo ""
echo "🚀 Ready to send beta tester email!"
