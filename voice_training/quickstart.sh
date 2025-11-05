#!/bin/bash

# MAIA Voice Training Quick Start
# Sets up and runs initial voice training

set -e

echo "🎙️  MAIA Voice Training Quick Start"
echo "===================================="
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not found"
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"
echo ""

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY not found in environment"
    echo "   Please set it in .env.local or export it:"
    echo "   export OPENAI_API_KEY=sk-..."
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create virtual environment if it doesn't exist
if [ ! -d "voice_training/venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv voice_training/venv
    echo "✅ Virtual environment created"
    echo ""
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source voice_training/venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip3 install -q --upgrade pip
pip3 install -q -r voice_training/requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Some dependencies failed to install"
    echo "   You can continue, but some features may not work"
fi
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p voice_training/samples
mkdir -p voice_training/models
mkdir -p voice_training/feedback
echo "✅ Directories ready"
echo ""

# Main menu
while true; do
    echo "Choose an action:"
    echo "1. Collect training samples (recommended first step)"
    echo "2. Analyze existing samples"
    echo "3. Start training daemon (background service)"
    echo "4. View training status"
    echo "5. Exit"
    echo ""
    read -p "Enter choice [1-5]: " choice

    case $choice in
        1)
            echo ""
            echo "🎤 Collecting voice samples..."
            echo "This will generate ~25 samples from OpenAI Alloy"
            echo ""
            python3 voice_training/sample_collector.py
            echo ""
            echo "✅ Sample collection complete!"
            echo ""
            ;;
        2)
            echo ""
            echo "🔬 Analyzing samples..."
            python3 voice_training/formant_analyzer.py
            echo ""
            ;;
        3)
            echo ""
            echo "🚀 Starting training daemon..."
            echo "This will run in the foreground. Press Ctrl+C to stop."
            echo ""
            python3 voice_training/training_daemon.py
            echo ""
            ;;
        4)
            echo ""
            echo "📊 Training Status:"
            echo "==================="

            # Count samples
            sample_count=$(ls voice_training/samples/*.mp3 2>/dev/null | wc -l | tr -d ' ')
            echo "Samples collected: $sample_count"

            # Check daemon status
            if [ -f "voice_training/daemon_status.json" ]; then
                echo ""
                echo "Daemon status:"
                cat voice_training/daemon_status.json | python3 -m json.tool
            else
                echo "Daemon: Not running"
            fi

            # Check feedback
            if [ -f "voice_training/feedback/voice_feedback.jsonl" ]; then
                feedback_count=$(wc -l < voice_training/feedback/voice_feedback.jsonl | tr -d ' ')
                echo ""
                echo "User feedback entries: $feedback_count"
            fi

            echo ""
            ;;
        5)
            echo ""
            echo "✨ Thank you for training MAIA's voice!"
            echo ""
            exit 0
            ;;
        *)
            echo "Invalid choice. Please enter 1-5."
            ;;
    esac
done
