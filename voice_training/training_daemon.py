"""
MAIA Voice Training Daemon
Runs in background collecting samples and training voice model
"""

import asyncio
import time
import json
from pathlib import Path
from datetime import datetime
from typing import Optional
import sys

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent))

from sample_collector import VoiceSampleCollector
from formant_analyzer import FormantAnalyzer


class VoiceTrainingDaemon:
    """Background service for continuous voice improvement"""

    def __init__(
        self,
        collect_interval: int = 3600,  # Collect samples every hour
        analyze_interval: int = 7200,  # Analyze every 2 hours
        train_interval: int = 86400,   # Retrain daily
    ):
        self.collect_interval = collect_interval
        self.analyze_interval = analyze_interval
        self.train_interval = train_interval

        self.collector = VoiceSampleCollector()
        self.analyzer = FormantAnalyzer()

        self.status_file = Path("voice_training/daemon_status.json")
        self.is_running = False

        self.stats = {
            "started_at": None,
            "total_samples_collected": 0,
            "total_analyses_run": 0,
            "total_training_runs": 0,
            "last_collection": None,
            "last_analysis": None,
            "last_training": None,
        }

    def load_status(self):
        """Load daemon status from disk"""
        if self.status_file.exists():
            with open(self.status_file, "r") as f:
                self.stats = json.load(f)

    def save_status(self):
        """Save daemon status to disk"""
        with open(self.status_file, "w") as f:
            json.dump(self.stats, f, indent=2)

    async def collect_samples_task(self):
        """Periodically collect new voice samples"""
        while self.is_running:
            try:
                print(f"\n🎙️  [{datetime.now()}] Collecting voice samples...")

                # Get diverse training phrases
                phrases = self.collector.get_training_phrases()

                # Collect a subset (don't overwhelm API)
                import random
                sample_phrases = random.sample(phrases, min(5, len(phrases)))

                collected = await self.collector.collect_training_corpus(sample_phrases)

                self.stats["total_samples_collected"] += collected
                self.stats["last_collection"] = datetime.now().isoformat()
                self.save_status()

                print(f"✅ Collected {collected} samples")

            except Exception as e:
                print(f"❌ Error in collection task: {e}")

            # Wait for next collection
            await asyncio.sleep(self.collect_interval)

    async def analyze_samples_task(self):
        """Periodically analyze collected samples"""
        while self.is_running:
            try:
                print(f"\n🔬 [{datetime.now()}] Analyzing voice samples...")

                samples_dir = Path("voice_training/samples")
                audio_files = list(samples_dir.glob("*.mp3"))

                if not audio_files:
                    print("⏭️  No samples to analyze yet")
                else:
                    results = []
                    for filepath in audio_files[-10:]:  # Analyze last 10
                        try:
                            features = self.analyzer.analyze_sample(filepath)
                            results.append(features)
                        except Exception as e:
                            print(f"⚠️  Error analyzing {filepath.name}: {e}")

                    if results:
                        # Update optimal formant parameters
                        self._update_formant_config(results)

                        self.stats["total_analyses_run"] += 1
                        self.stats["last_analysis"] = datetime.now().isoformat()
                        self.save_status()

                        print(f"✅ Analyzed {len(results)} samples")

            except Exception as e:
                print(f"❌ Error in analysis task: {e}")

            # Wait for next analysis
            await asyncio.sleep(self.analyze_interval)

    def _update_formant_config(self, analysis_results: list):
        """Update formant synthesizer parameters based on analysis"""
        import numpy as np

        # Calculate average formants
        all_f1 = [r["average_formants"]["F1"] for r in analysis_results]
        all_f2 = [r["average_formants"]["F2"] for r in analysis_results]
        all_f3 = [r["average_formants"]["F3"] for r in analysis_results]
        all_f4 = [r["average_formants"]["F4"] for r in analysis_results]

        optimal_formants = {
            "F1": float(np.median(all_f1)),
            "F2": float(np.median(all_f2)),
            "F3": float(np.median(all_f3)),
            "F4": float(np.median(all_f4)),
            "updated_at": datetime.now().isoformat(),
            "sample_count": len(analysis_results)
        }

        # Save optimal parameters
        config_file = Path("voice_training/optimal_formants.json")
        with open(config_file, "w") as f:
            json.dump(optimal_formants, f, indent=2)

        print(f"💾 Updated formant config: {config_file}")
        print(f"   F1={optimal_formants['F1']:.0f}Hz")
        print(f"   F2={optimal_formants['F2']:.0f}Hz")
        print(f"   F3={optimal_formants['F3']:.0f}Hz")
        print(f"   F4={optimal_formants['F4']:.0f}Hz")

    async def train_model_task(self):
        """Periodically retrain neural model"""
        while self.is_running:
            try:
                print(f"\n🧠 [{datetime.now()}] Checking if training needed...")

                samples_dir = Path("voice_training/samples")
                sample_count = len(list(samples_dir.glob("*.mp3")))

                if sample_count >= 50:
                    print(f"🎯 Training with {sample_count} samples...")

                    # In production, this would trigger actual training
                    # For now, just update stats
                    print("⏳ Full training requires GPU setup")
                    print("   See voice_training/TRAINING_PLAN.md")

                    self.stats["total_training_runs"] += 1
                    self.stats["last_training"] = datetime.now().isoformat()
                    self.save_status()
                else:
                    print(f"⏭️  Need {50 - sample_count} more samples for training")

            except Exception as e:
                print(f"❌ Error in training task: {e}")

            # Wait for next training
            await asyncio.sleep(self.train_interval)

    async def status_monitor_task(self):
        """Monitor and report daemon status"""
        while self.is_running:
            await asyncio.sleep(300)  # Every 5 minutes

            print(f"\n📊 Daemon Status:")
            print(f"   Samples collected: {self.stats['total_samples_collected']}")
            print(f"   Analyses run: {self.stats['total_analyses_run']}")
            print(f"   Training runs: {self.stats['total_training_runs']}")

            samples_dir = Path("voice_training/samples")
            if samples_dir.exists():
                total_samples = len(list(samples_dir.glob("*.mp3")))
                print(f"   Total samples on disk: {total_samples}")

    async def run(self):
        """Start the daemon"""
        print("🚀 MAIA Voice Training Daemon")
        print("=" * 50)
        print(f"Collection interval: {self.collect_interval}s")
        print(f"Analysis interval: {self.analyze_interval}s")
        print(f"Training interval: {self.train_interval}s")
        print()

        self.load_status()
        self.is_running = True
        self.stats["started_at"] = datetime.now().isoformat()

        # Start all background tasks
        tasks = [
            asyncio.create_task(self.collect_samples_task()),
            asyncio.create_task(self.analyze_samples_task()),
            asyncio.create_task(self.train_model_task()),
            asyncio.create_task(self.status_monitor_task()),
        ]

        try:
            # Run until interrupted
            await asyncio.gather(*tasks)
        except KeyboardInterrupt:
            print("\n🛑 Daemon stopped by user")
            self.is_running = False
            self.save_status()

    def stop(self):
        """Stop the daemon"""
        self.is_running = False
        self.save_status()


async def main():
    """Run the voice training daemon"""
    # For testing: use shorter intervals
    daemon = VoiceTrainingDaemon(
        collect_interval=1800,   # 30 minutes
        analyze_interval=3600,   # 1 hour
        train_interval=43200,    # 12 hours
    )

    await daemon.run()


if __name__ == "__main__":
    print("🎙️  Starting MAIA Voice Training Daemon...")
    print("   Press Ctrl+C to stop\n")

    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n✅ Daemon stopped gracefully")
