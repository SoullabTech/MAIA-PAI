#!/bin/bash

# 🎤 Soullab Whisper STT Setup Script

echo "🎤 Setting up Soullab Whisper STT Service"
echo "========================================="
echo ""

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo "✅ Python version: $PYTHON_VERSION"
echo ""

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the service:"
echo "  1. Activate venv: source venv/bin/activate"
echo "  2. Run server: python server.py"
echo ""
echo "Service will run on: http://localhost:8001"
echo "Model: Whisper base (~200ms latency)"
echo ""
echo "🌀 100% Sovereignty Achieved!"
