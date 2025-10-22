#!/usr/bin/env python3
"""
🎙️ Voice Training Data Collector
Automated system for processing and preparing voice recordings for TTS training
"""

import os
import csv
import json
import wave
import numpy as np
from pathlib import Path
from typing import List, Dict, Tuple
import librosa
import soundfile as sf
from pydub import AudioSegment
from pydub.silence import detect_silence

class VoiceDataCollector:
    """Processes recorded voice data for TTS model training"""

    def __init__(self, base_dir: str = "./voice-recordings"):
        self.base_dir = Path(base_dir)
        self.processed_dir = self.base_dir / "processed"
        self.metadata_file = self.base_dir / "metadata.csv"

        # Create directories
        self.processed_dir.mkdir(parents=True, exist_ok=True)

        # Target audio specs for training
        self.target_sr = 22050  # Sample rate for TTS models
        self.target_channels = 1  # Mono
        self.target_bit_depth = 16

    def process_recordings(self, voice_name: str):
        """
        Process all recordings for a given voice (maya or anthony)

        Args:
            voice_name: "maya" or "anthony"
        """
        print(f"🎙️  Processing {voice_name} recordings...")

        voice_dir = self.base_dir / voice_name
        if not voice_dir.exists():
            print(f"❌ Directory not found: {voice_dir}")
            return

        metadata_rows = []
        processed_count = 0

        # Process each WAV file
        for audio_file in voice_dir.glob("*.wav"):
            try:
                processed_path = self.process_audio_file(
                    audio_file,
                    voice_name
                )

                # Extract metadata
                metadata = self.extract_metadata(audio_file, processed_path)
                metadata_rows.append(metadata)

                processed_count += 1
                print(f"✅ Processed: {audio_file.name}")

            except Exception as e:
                print(f"❌ Error processing {audio_file.name}: {e}")

        # Save metadata
        self.save_metadata(metadata_rows, voice_name)

        print(f"\n🎉 Processed {processed_count} files for {voice_name}")
        print(f"📊 Metadata saved to: {self.metadata_file}")

    def process_audio_file(
        self,
        input_path: Path,
        voice_name: str
    ) -> Path:
        """
        Process a single audio file:
        1. Convert to mono
        2. Resample to 22kHz
        3. Normalize volume
        4. Trim silence
        5. Save as 16-bit WAV

        Args:
            input_path: Path to input WAV file
            voice_name: Voice identifier

        Returns:
            Path to processed file
        """
        # Load audio
        audio, sr = librosa.load(input_path, sr=None, mono=False)

        # Convert to mono if stereo
        if audio.ndim > 1:
            audio = librosa.to_mono(audio)

        # Resample to target sample rate
        if sr != self.target_sr:
            audio = librosa.resample(
                audio,
                orig_sr=sr,
                target_sr=self.target_sr
            )

        # Normalize audio (peak normalization)
        audio = self.normalize_audio(audio)

        # Trim silence from start and end
        audio = self.trim_silence(audio, self.target_sr)

        # Save processed audio
        output_filename = f"{voice_name}_{input_path.stem}_processed.wav"
        output_path = self.processed_dir / output_filename

        sf.write(
            output_path,
            audio,
            self.target_sr,
            subtype='PCM_16'
        )

        return output_path

    def normalize_audio(self, audio: np.ndarray) -> np.ndarray:
        """Normalize audio to -3dB peak"""
        target_peak = 0.7  # -3dB in linear scale
        current_peak = np.abs(audio).max()

        if current_peak > 0:
            audio = audio * (target_peak / current_peak)

        return audio

    def trim_silence(
        self,
        audio: np.ndarray,
        sr: int,
        threshold_db: float = -40,
        min_silence_len: int = 200
    ) -> np.ndarray:
        """Trim silence from start and end of audio"""
        # Convert to AudioSegment for silence detection
        audio_int16 = (audio * 32767).astype(np.int16)
        audio_segment = AudioSegment(
            audio_int16.tobytes(),
            frame_rate=sr,
            sample_width=2,
            channels=1
        )

        # Detect non-silent parts
        non_silent_ranges = detect_silence(
            audio_segment,
            min_silence_len=min_silence_len,
            silence_thresh=threshold_db,
            seek_step=10
        )

        if not non_silent_ranges:
            return audio  # Return original if no silence detected

        # Get start and end of non-silent audio
        start_trim = non_silent_ranges[0][1]  # End of first silent part
        end_trim = non_silent_ranges[-1][0]   # Start of last silent part

        # Convert ms to samples
        start_sample = int(start_trim * sr / 1000)
        end_sample = int(end_trim * sr / 1000)

        return audio[start_sample:end_sample]

    def extract_metadata(
        self,
        original_path: Path,
        processed_path: Path
    ) -> Dict[str, str]:
        """
        Extract metadata from filename and audio

        Expected filename format:
        {voice}_{section}_{number}_take{n}.wav
        Example: maya_greeting_001_take1.wav
        """
        # Parse filename
        parts = original_path.stem.split('_')

        if len(parts) >= 4:
            voice = parts[0]
            section = parts[1]
            phrase_num = parts[2]
            take = parts[3]
        else:
            # Fallback for non-standard naming
            voice = "unknown"
            section = "unknown"
            phrase_num = "000"
            take = "take1"

        # Get audio duration
        audio, sr = librosa.load(processed_path, sr=None)
        duration = len(audio) / sr

        # Load phrase text from corpus (if available)
        phrase_text = self.get_phrase_text(voice, section, phrase_num)

        return {
            'audio_file': str(processed_path.relative_to(self.base_dir)),
            'voice': voice,
            'section': section,
            'phrase_number': phrase_num,
            'take': take,
            'text': phrase_text,
            'duration': f"{duration:.2f}",
            'sample_rate': str(sr),
            'original_file': str(original_path.name)
        }

    def get_phrase_text(
        self,
        voice: str,
        section: str,
        phrase_num: str
    ) -> str:
        """
        Look up phrase text from the corpus
        (You can implement this to read from SACRED_PHRASE_CORPUS.md)
        """
        # TODO: Parse SACRED_PHRASE_CORPUS.md to get actual phrase text
        # For now, return placeholder
        return f"Phrase {phrase_num} from {section} section"

    def save_metadata(self, metadata_rows: List[Dict], voice_name: str):
        """Save metadata to CSV file"""
        output_file = self.base_dir / f"metadata_{voice_name}.csv"

        if not metadata_rows:
            print("⚠️  No metadata to save")
            return

        # Write CSV
        with open(output_file, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=metadata_rows[0].keys())
            writer.writeheader()
            writer.writerows(metadata_rows)

        print(f"📝 Metadata saved: {output_file}")

    def create_train_val_split(
        self,
        voice_name: str,
        val_ratio: float = 0.1
    ):
        """
        Split processed data into training and validation sets

        Args:
            voice_name: Voice to split
            val_ratio: Fraction of data for validation (default 10%)
        """
        metadata_file = self.base_dir / f"metadata_{voice_name}.csv"

        if not metadata_file.exists():
            print(f"❌ Metadata file not found: {metadata_file}")
            return

        # Load metadata
        with open(metadata_file, 'r') as f:
            reader = csv.DictReader(f)
            all_rows = list(reader)

        # Shuffle and split
        np.random.seed(42)  # For reproducibility
        np.random.shuffle(all_rows)

        split_idx = int(len(all_rows) * (1 - val_ratio))
        train_rows = all_rows[:split_idx]
        val_rows = all_rows[split_idx:]

        # Save splits
        train_file = self.base_dir / f"train_{voice_name}.csv"
        val_file = self.base_dir / f"val_{voice_name}.csv"

        with open(train_file, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=train_rows[0].keys())
            writer.writeheader()
            writer.writerows(train_rows)

        with open(val_file, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=val_rows[0].keys())
            writer.writeheader()
            writer.writerows(val_rows)

        print(f"📊 Dataset split:")
        print(f"   Training: {len(train_rows)} samples → {train_file}")
        print(f"   Validation: {len(val_rows)} samples → {val_file}")

    def generate_voice_embedding(self, voice_name: str):
        """
        Generate a voice embedding for XTTS model
        Uses 6-10 seconds of audio from the best quality samples

        Args:
            voice_name: Voice to generate embedding for
        """
        print(f"🧬 Generating voice embedding for {voice_name}...")

        # Find best quality samples (longest duration, clearest audio)
        metadata_file = self.base_dir / f"metadata_{voice_name}.csv"

        if not metadata_file.exists():
            print(f"❌ Metadata file not found: {metadata_file}")
            return

        # Load metadata and sort by duration (longer = better quality usually)
        with open(metadata_file, 'r') as f:
            reader = csv.DictReader(f)
            samples = sorted(
                list(reader),
                key=lambda x: float(x['duration']),
                reverse=True
            )

        # Take top 5 samples and concatenate
        selected_audio = []
        total_duration = 0
        target_duration = 8  # 8 seconds is good for XTTS

        for sample in samples[:10]:  # Check up to 10 samples
            if total_duration >= target_duration:
                break

            audio_path = self.base_dir / sample['audio_file']
            audio, sr = librosa.load(audio_path, sr=self.target_sr)

            selected_audio.append(audio)
            total_duration += len(audio) / sr

        # Concatenate audio
        embedding_audio = np.concatenate(selected_audio)

        # Trim to target duration
        target_samples = int(target_duration * self.target_sr)
        embedding_audio = embedding_audio[:target_samples]

        # Save embedding audio
        embedding_file = self.base_dir / f"{voice_name}_embedding.wav"
        sf.write(
            embedding_file,
            embedding_audio,
            self.target_sr,
            subtype='PCM_16'
        )

        print(f"✅ Voice embedding saved: {embedding_file}")
        print(f"   Duration: {len(embedding_audio) / self.target_sr:.2f}s")
        print(f"   This file can be used for XTTS voice cloning!")

    def generate_quality_report(self, voice_name: str):
        """Generate a quality report for the recordings"""
        metadata_file = self.base_dir / f"metadata_{voice_name}.csv"

        if not metadata_file.exists():
            print(f"❌ Metadata file not found: {metadata_file}")
            return

        with open(metadata_file, 'r') as f:
            reader = csv.DictReader(f)
            samples = list(reader)

        # Calculate statistics
        durations = [float(s['duration']) for s in samples]

        report = {
            'voice_name': voice_name,
            'total_samples': len(samples),
            'total_duration_seconds': sum(durations),
            'total_duration_minutes': sum(durations) / 60,
            'avg_duration_per_sample': np.mean(durations),
            'min_duration': np.min(durations),
            'max_duration': np.max(durations),
            'sections': len(set(s['section'] for s in samples)),
            'takes_per_phrase': len(samples) / len(set(s['phrase_number'] for s in samples))
        }

        # Print report
        print(f"\n📊 Quality Report for {voice_name.upper()}")
        print("=" * 50)
        print(f"Total Samples: {report['total_samples']}")
        print(f"Total Duration: {report['total_duration_minutes']:.1f} minutes")
        print(f"Average Sample Length: {report['avg_duration_per_sample']:.2f} seconds")
        print(f"Duration Range: {report['min_duration']:.2f}s - {report['max_duration']:.2f}s")
        print(f"Sections Covered: {report['sections']}")
        print(f"Takes per Phrase: {report['takes_per_phrase']:.1f}")
        print("=" * 50)

        # Save report
        report_file = self.base_dir / f"quality_report_{voice_name}.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"📝 Report saved: {report_file}\n")


def main():
    """Main processing pipeline"""
    import argparse

    parser = argparse.ArgumentParser(
        description="Process voice recordings for TTS training"
    )
    parser.add_argument(
        'voice',
        choices=['maya', 'anthony', 'both'],
        help='Which voice to process'
    )
    parser.add_argument(
        '--base-dir',
        default='./voice-recordings',
        help='Base directory for recordings'
    )
    parser.add_argument(
        '--skip-processing',
        action='store_true',
        help='Skip audio processing (only generate metadata)'
    )

    args = parser.parse_args()

    # Initialize collector
    collector = VoiceDataCollector(args.base_dir)

    voices = ['maya', 'anthony'] if args.voice == 'both' else [args.voice]

    for voice in voices:
        print(f"\n{'=' * 60}")
        print(f"Processing {voice.upper()} voice")
        print(f"{'=' * 60}\n")

        if not args.skip_processing:
            # Process recordings
            collector.process_recordings(voice)

        # Create train/val split
        collector.create_train_val_split(voice)

        # Generate voice embedding
        collector.generate_voice_embedding(voice)

        # Generate quality report
        collector.generate_quality_report(voice)

    print(f"\n🎉 All processing complete!")
    print(f"\nNext steps:")
    print(f"1. Review quality reports")
    print(f"2. Use train_{voice}.csv for model training")
    print(f"3. Use {voice}_embedding.wav for XTTS voice cloning")


if __name__ == "__main__":
    main()
