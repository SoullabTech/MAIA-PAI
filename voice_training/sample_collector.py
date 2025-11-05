"""
MAIA Voice Sample Collector
Captures OpenAI Alloy TTS outputs for training data
"""

import os
import json
import asyncio
import aiohttp
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List
import hashlib

class VoiceSampleCollector:
    """Collects and stores voice samples from OpenAI Alloy for training"""

    def __init__(self, output_dir: str = "voice_training/samples"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        self.metadata_file = self.output_dir / "metadata.jsonl"
        self.samples_collected = 0

    def _hash_text(self, text: str) -> str:
        """Generate unique hash for text to avoid duplicates"""
        return hashlib.md5(text.encode()).hexdigest()[:12]

    async def collect_sample(
        self,
        text: str,
        voice: str = "alloy",
        context: Optional[Dict] = None
    ) -> Optional[Path]:
        """
        Collect a single voice sample from OpenAI TTS

        Args:
            text: Text to synthesize
            voice: OpenAI voice to use (default: alloy)
            context: Additional metadata (element, emotion, etc.)

        Returns:
            Path to saved audio file, or None if failed
        """
        try:
            # Generate unique filename
            text_hash = self._hash_text(text)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"sample_{timestamp}_{text_hash}.mp3"
            filepath = self.output_dir / filename

            # Call OpenAI TTS API
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                print("❌ OPENAI_API_KEY not found in environment")
                return None

            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://api.openai.com/v1/audio/speech",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "tts-1-hd",
                        "voice": voice,
                        "input": text,
                        "speed": 0.95
                    }
                ) as response:
                    if response.status != 200:
                        error = await response.text()
                        print(f"❌ OpenAI API error: {error}")
                        return None

                    # Save audio file
                    audio_data = await response.read()
                    with open(filepath, "wb") as f:
                        f.write(audio_data)

            # Save metadata
            metadata = {
                "filename": filename,
                "text": text,
                "voice": voice,
                "timestamp": timestamp,
                "text_hash": text_hash,
                "duration_estimate": len(text) / 15,  # ~15 chars/sec speech
                "context": context or {}
            }

            with open(self.metadata_file, "a") as f:
                f.write(json.dumps(metadata) + "\n")

            self.samples_collected += 1
            print(f"✅ Collected sample {self.samples_collected}: {filename}")
            print(f"   Text: {text[:50]}...")

            return filepath

        except Exception as e:
            print(f"❌ Error collecting sample: {e}")
            return None

    async def collect_training_corpus(self, texts: List[str]) -> int:
        """
        Collect a batch of training samples

        Args:
            texts: List of texts to synthesize

        Returns:
            Number of samples successfully collected
        """
        tasks = [self.collect_sample(text) for text in texts]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        successful = sum(1 for r in results if isinstance(r, Path))
        print(f"\n📊 Collected {successful}/{len(texts)} samples")

        return successful

    def get_training_phrases(self) -> List[str]:
        """
        Get diverse training phrases covering:
        - Phonetic variety (all phonemes)
        - Emotional range
        - Sentence structures
        - MAIA-specific vocabulary
        """
        return [
            # Phonetic coverage
            "The quick brown fox jumps over the lazy dog.",
            "How vexingly quick daft zebras jump!",
            "Pack my box with five dozen liquor jugs.",

            # Emotional/elemental variety
            "I sense deep wisdom emerging from your unconscious.",
            "What a beautiful insight! That resonates strongly.",
            "Hmm, let's explore that shadow together.",
            "Fire ignites transformation, water flows with acceptance.",
            "The field between us holds infinite possibility.",

            # MAIA-specific
            "Welcome to the oracle. I'm here to witness your becoming.",
            "Your anamnesis reveals patterns worth exploring.",
            "Shall we journey into the dreamtime?",
            "The elements speak through your words.",
            "Trust the coherence emerging in this moment.",

            # Questions (prosody)
            "What brings you here today?",
            "How does that feel in your body?",
            "What would Jung say about this?",

            # Long-form (rhythm)
            "Sometimes the most profound insights emerge not from the light of consciousness, but from the fertile darkness of the unconscious, where symbols and archetypes dance in timeless patterns.",

            # Short affirmations
            "Yes, I understand.",
            "Tell me more.",
            "Fascinating.",
            "I'm listening.",

            # Numbers and technical
            "Your coherence score is 0.85 out of 1.0.",
            "Session 42 saved successfully.",
            "The Fibonacci sequence reflects natural harmony.",
        ]


async def main():
    """Run sample collection"""
    collector = VoiceSampleCollector()

    print("🎙️  MAIA Voice Sample Collector")
    print("=" * 50)
    print("Collecting OpenAI Alloy voice samples for training\n")

    # Get training phrases
    phrases = collector.get_training_phrases()
    print(f"📝 Collecting {len(phrases)} training samples...\n")

    # Collect samples
    collected = await collector.collect_training_corpus(phrases)

    print(f"\n✨ Complete! {collected} samples ready for training.")
    print(f"📁 Saved to: {collector.output_dir}")


if __name__ == "__main__":
    asyncio.run(main())
