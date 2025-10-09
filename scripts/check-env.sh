#!/bin/bash
# Quick environment variable check for MAIA launch

echo "🔍 Checking MAIA Environment Variables..."
echo ""

# Load .env.local if it exists
if [ -f .env.local ]; then
    source .env.local
    echo "✅ Loaded .env.local"
elif [ -f .env ]; then
    source .env
    echo "✅ Loaded .env"
else
    echo "⚠️  No .env or .env.local file found"
fi

echo ""
echo "Environment Check:"
echo "=================="

# Check Supabase URL
if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "✅ NEXT_PUBLIC_SUPABASE_URL: Set (${NEXT_PUBLIC_SUPABASE_URL:0:30}...)"
else
    echo "❌ NEXT_PUBLIC_SUPABASE_URL: Missing"
fi

# Check Supabase Key
if [ -n "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: Set (${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:20}...)"
else
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: Missing"
fi

# Check OpenAI Key
if [ -n "$OPENAI_API_KEY" ]; then
    echo "✅ OPENAI_API_KEY: Set (${OPENAI_API_KEY:0:20}...)"
else
    echo "⚠️  OPENAI_API_KEY: Missing (may use Anthropic)"
fi

# Check Anthropic Key
if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "✅ ANTHROPIC_API_KEY: Set (${ANTHROPIC_API_KEY:0:20}...)"
else
    echo "⚠️  ANTHROPIC_API_KEY: Missing"
fi

echo ""
echo "Tip: Make sure you have either .env or .env.local with required variables"
echo ""
