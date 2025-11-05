"""
MAIA Neural Voice Trainer
Fine-tunes TTS model on OpenAI Alloy voice samples
"""

import os
import json
import torch
from pathlib import Path
from typing import Optional, Dict, List
from dataclasses import dataclass
import numpy as np


@dataclass
class TrainingConfig:
    """Configuration for voice training"""
    model_name: str = "tts_models/en/ljspeech/tacotron2-DDC"
    batch_size: int = 4
    learning_rate: float = 0.0001
    epochs: int = 100
    checkpoint_interval: int = 10
    samples_dir: Path = Path("voice_training/samples")
    output_dir: Path = Path("voice_training/models")
    use_gpu: bool = torch.cuda.is_available()


class NeuralVoiceTrainer:
    """Trains neural TTS model on collected voice samples"""

    def __init__(self, config: Optional[TrainingConfig] = None):
        self.config = config or TrainingConfig()
        self.config.output_dir.mkdir(parents=True, exist_ok=True)

        print(f"🧠 MAIA Neural Voice Trainer")
        print(f"   Device: {'GPU' if self.config.use_gpu else 'CPU'}")
        print(f"   Model: {self.config.model_name}")

    def prepare_dataset(self) -> Dict:
        """
        Prepare training dataset from collected samples

        Returns:
            Dataset metadata
        """
        print("\n📚 Preparing training dataset...")

        # Load metadata
        metadata_file = self.config.samples_dir / "metadata.jsonl"
        if not metadata_file.exists():
            raise FileNotFoundError(
                f"No metadata found. Run sample_collector.py first."
            )

        samples = []
        with open(metadata_file, "r") as f:
            for line in f:
                samples.append(json.loads(line))

        print(f"   Found {len(samples)} samples")

        # Validate audio files exist
        valid_samples = []
        for sample in samples:
            audio_path = self.config.samples_dir / sample["filename"]
            if audio_path.exists():
                valid_samples.append({
                    "text": sample["text"],
                    "audio_path": str(audio_path),
                    "context": sample.get("context", {})
                })

        print(f"   Valid samples: {len(valid_samples)}")

        # Save processed dataset
        dataset_file = self.config.output_dir / "dataset.json"
        with open(dataset_file, "w") as f:
            json.dump(valid_samples, f, indent=2)

        print(f"   ✅ Dataset saved: {dataset_file}")

        return {
            "total_samples": len(valid_samples),
            "dataset_file": str(dataset_file)
        }

    def train_model(self) -> str:
        """
        Train the TTS model

        Returns:
            Path to trained model checkpoint
        """
        print("\n🎯 Starting training...")
        print("=" * 50)

        try:
            from TTS.utils.manage import ModelManager
            from TTS.config import load_config
            from TTS.tts.models import setup_model
            from TTS.tts.datasets import load_tts_samples

            # For now, create a training plan without full Coqui TTS
            # (Full training requires significant setup and compute)
            print("⚠️  Full neural training requires:")
            print("   - Coqui TTS library (pip install TTS)")
            print("   - GPU with 8GB+ VRAM")
            print("   - 4-8 hours training time")
            print("   - 100+ diverse voice samples")
            print("\n📋 Training plan generated. To execute:")
            print("   1. Collect more samples (100+ recommended)")
            print("   2. Install TTS: pip install TTS")
            print("   3. Run training script with GPU")

            # Save training script for later execution
            training_script = self._generate_training_script()
            script_path = self.config.output_dir / "train.py"
            with open(script_path, "w") as f:
                f.write(training_script)

            print(f"\n✅ Training script saved: {script_path}")
            print("   Run with: python {script_path}")

            return str(script_path)

        except ImportError:
            print("⚠️  TTS library not installed. Generating training plan...")
            return self._generate_training_plan()

    def _generate_training_script(self) -> str:
        """Generate executable training script"""
        return '''#!/usr/bin/env python3
"""
MAIA Voice Training - Full Training Script
Run this with GPU for production training
"""

from TTS.tts.configs.tacotron2_config import Tacotron2Config
from TTS.tts.models.tacotron2 import Tacotron2
from TTS.trainer import Trainer, TrainerArgs
from TTS.utils.audio import AudioProcessor
import torch

# Training configuration
config = Tacotron2Config(
    batch_size=32,
    eval_batch_size=16,
    num_loader_workers=4,
    num_eval_loader_workers=4,
    run_eval=True,
    test_delay_epochs=-1,
    epochs=1000,
    text_cleaner="english_cleaners",
    use_phonemes=True,
    phoneme_language="en-us",
    phoneme_cache_path="phoneme_cache",
    print_step=25,
    print_eval=True,
    mixed_precision=True,
    output_path="voice_training/models/",
    datasets=[{
        "name": "maia_voice",
        "path": "voice_training/samples/",
        "meta_file_train": "metadata.jsonl"
    }]
)

# Initialize model
model = Tacotron2(config)

# Setup trainer
trainer_args = TrainerArgs(
    restore_path=None,  # Set to checkpoint path to resume
    skip_train_epoch=False
)

trainer = Trainer(
    trainer_args,
    config,
    output_path="voice_training/models/",
    model=model,
    train_samples=None,  # Will be loaded from dataset
    eval_samples=None
)

# Train
trainer.fit()

print("✅ Training complete!")
'''

    def _generate_training_plan(self) -> str:
        """Generate training plan when TTS not available"""
        plan_file = self.config.output_dir / "TRAINING_PLAN.md"

        plan = """# MAIA Voice Training Plan

## Overview
Train a custom neural TTS model based on OpenAI Alloy voice characteristics.

## Prerequisites
- [ ] 100+ diverse voice samples collected
- [ ] Python 3.9+
- [ ] PyTorch with CUDA support
- [ ] 8GB+ GPU VRAM (16GB recommended)
- [ ] Coqui TTS library installed

## Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install TTS torch torchaudio

# Verify GPU
python -c "import torch; print(torch.cuda.is_available())"
```

## Training Steps

### 1. Data Collection (Current Status)
Collect diverse voice samples covering:
- All phonemes
- Various emotions and tones
- Different sentence structures
- MAIA-specific vocabulary

Target: 100-500 samples (currently have ~25)

### 2. Data Preparation
```bash
python voice_training/sample_collector.py
python voice_training/formant_analyzer.py
```

### 3. Model Selection
Options:
- **Tacotron2**: Stable, well-tested
- **FastSpeech2**: Faster inference
- **VITS**: State-of-the-art quality

Recommended: Start with Tacotron2

### 4. Training
```bash
python voice_training/models/train.py
```

Training time: 4-8 hours on GPU
Checkpoints saved every 10 epochs

### 5. Evaluation
Test synthesized voice quality:
- Intelligibility
- Naturalness
- Emotional expressiveness
- MAIA personality fit

### 6. Integration
Once trained, integrate via API endpoint:
- `/api/voice/maia-custom`
- Fallback to OpenAI if quality insufficient

## Hybrid Approach (Recommended)

While training, use:
1. **OpenAI Alloy** for production (current)
2. **Formant synthesis** as backup
3. **Custom model** when ready

## Next Steps
1. Collect more samples (target: 100+)
2. Set up GPU environment
3. Install TTS library
4. Run training
5. Evaluate and iterate

## Resources
- Coqui TTS: https://github.com/coqui-ai/TTS
- Training guide: https://tts.readthedocs.io/
"""

        with open(plan_file, "w") as f:
            f.write(plan)

        print(f"✅ Training plan saved: {plan_file}")
        return str(plan_file)


def main():
    """Run neural training setup"""
    trainer = NeuralVoiceTrainer()

    # Prepare dataset
    dataset_info = trainer.prepare_dataset()

    print(f"\n📊 Dataset Summary:")
    print(f"   Samples: {dataset_info['total_samples']}")

    # Generate training plan
    if dataset_info['total_samples'] < 50:
        print(f"\n⚠️  Need more samples for quality training")
        print(f"   Current: {dataset_info['total_samples']}")
        print(f"   Recommended: 100+")
        print(f"\n💡 Run sample_collector.py to collect more")

    trainer.train_model()


if __name__ == "__main__":
    main()
