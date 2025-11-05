"""
MAIA Formant Analyzer
Analyzes OpenAI Alloy voice spectrograms to extract optimal formant parameters
"""

import numpy as np
import librosa
import json
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from scipy.signal import find_peaks
from scipy.interpolate import interp1d
import matplotlib.pyplot as plt


class FormantAnalyzer:
    """Extracts formant frequencies from voice samples"""

    def __init__(self, sample_rate: int = 22050):
        self.sample_rate = sample_rate

    def load_audio(self, filepath: Path) -> Tuple[np.ndarray, int]:
        """Load audio file"""
        audio, sr = librosa.load(filepath, sr=self.sample_rate)
        return audio, sr

    def extract_formants(
        self,
        audio: np.ndarray,
        sr: int,
        n_formants: int = 4,
        frame_length: int = 2048,
        hop_length: int = 512
    ) -> Dict[str, List[float]]:
        """
        Extract formant frequencies (F1-F4) from audio

        Args:
            audio: Audio signal
            sr: Sample rate
            n_formants: Number of formants to extract
            frame_length: FFT window size
            hop_length: Hop size between frames

        Returns:
            Dictionary with formant frequencies over time
        """
        # Compute spectrogram
        D = librosa.stft(audio, n_fft=frame_length, hop_length=hop_length)
        magnitude = np.abs(D)
        freqs = librosa.fft_frequencies(sr=sr, n_fft=frame_length)

        formants = {f"F{i+1}": [] for i in range(n_formants)}
        formants["times"] = []

        # Analyze each frame
        for i in range(magnitude.shape[1]):
            frame = magnitude[:, i]

            # Find spectral peaks (formant candidates)
            peaks, properties = find_peaks(
                frame,
                height=np.max(frame) * 0.1,  # At least 10% of max
                distance=10  # Min distance between peaks
            )

            # Convert peak indices to frequencies
            peak_freqs = freqs[peaks]
            peak_amps = properties["peak_heights"]

            # Sort by frequency
            sorted_indices = np.argsort(peak_freqs)
            peak_freqs = peak_freqs[sorted_indices]
            peak_amps = peak_amps[sorted_indices]

            # Extract formants (first n prominent peaks in expected ranges)
            formant_ranges = [
                (200, 1000),   # F1: typically 200-1000 Hz
                (800, 2500),   # F2: typically 800-2500 Hz
                (1500, 3500),  # F3: typically 1500-3500 Hz
                (2500, 4500),  # F4: typically 2500-4500 Hz
            ]

            detected_formants = []
            for f_min, f_max in formant_ranges[:n_formants]:
                # Find peaks in this range
                mask = (peak_freqs >= f_min) & (peak_freqs <= f_max)
                candidates = peak_freqs[mask]
                candidate_amps = peak_amps[mask]

                if len(candidates) > 0:
                    # Choose strongest peak in range
                    strongest_idx = np.argmax(candidate_amps)
                    detected_formants.append(candidates[strongest_idx])
                else:
                    # Use range midpoint as fallback
                    detected_formants.append((f_min + f_max) / 2)

            # Store formants for this frame
            time = librosa.frames_to_time(i, sr=sr, hop_length=hop_length)
            formants["times"].append(time)
            for j, freq in enumerate(detected_formants):
                formants[f"F{j+1}"].append(freq)

        return formants

    def get_average_formants(self, formants: Dict[str, List[float]]) -> Dict[str, float]:
        """Calculate average formant frequencies across time"""
        avg_formants = {}
        for key in formants:
            if key != "times":
                # Use median instead of mean (more robust to outliers)
                avg_formants[key] = float(np.median(formants[key]))
        return avg_formants

    def analyze_phoneme(
        self,
        audio: np.ndarray,
        sr: int,
        phoneme: str
    ) -> Dict:
        """
        Analyze formants for a specific phoneme/vowel

        Args:
            audio: Audio segment containing the phoneme
            sr: Sample rate
            phoneme: Phoneme label (e.g., 'a', 'e', 'i', 'o', 'u')

        Returns:
            Formant analysis for this phoneme
        """
        formants = self.extract_formants(audio, sr)
        avg_formants = self.get_average_formants(formants)

        return {
            "phoneme": phoneme,
            "formants": avg_formants,
            "formant_trajectory": formants,
            "duration": len(audio) / sr
        }

    def analyze_sample(self, filepath: Path) -> Dict:
        """Analyze a complete voice sample"""
        print(f"🔬 Analyzing: {filepath.name}")

        audio, sr = self.load_audio(filepath)

        # Extract formants
        formants = self.extract_formants(audio, sr)
        avg_formants = self.get_average_formants(formants)

        # Calculate additional acoustic features
        features = {
            "average_formants": avg_formants,
            "fundamental_frequency": self._estimate_f0(audio, sr),
            "spectral_centroid": float(np.mean(librosa.feature.spectral_centroid(y=audio, sr=sr))),
            "duration": len(audio) / sr,
            "energy": float(np.mean(librosa.feature.rms(y=audio))),
        }

        print(f"   F1={avg_formants['F1']:.0f}Hz F2={avg_formants['F2']:.0f}Hz")
        print(f"   F3={avg_formants['F3']:.0f}Hz F4={avg_formants['F4']:.0f}Hz")

        return features

    def _estimate_f0(self, audio: np.ndarray, sr: int) -> float:
        """Estimate fundamental frequency (pitch)"""
        f0 = librosa.yin(audio, fmin=80, fmax=400, sr=sr)
        # Filter out unvoiced frames (0 Hz)
        voiced = f0[f0 > 0]
        if len(voiced) > 0:
            return float(np.median(voiced))
        return 150.0  # Default fallback

    def plot_formants(
        self,
        formants: Dict[str, List[float]],
        output_path: Optional[Path] = None
    ):
        """Plot formant trajectories over time"""
        plt.figure(figsize=(12, 6))

        times = formants["times"]
        colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']

        for i, color in enumerate(colors, 1):
            formant_key = f"F{i}"
            if formant_key in formants:
                plt.plot(
                    times,
                    formants[formant_key],
                    label=formant_key,
                    color=color,
                    linewidth=2
                )

        plt.xlabel('Time (s)')
        plt.ylabel('Frequency (Hz)')
        plt.title('Formant Trajectories')
        plt.legend()
        plt.grid(True, alpha=0.3)

        if output_path:
            plt.savefig(output_path, dpi=150, bbox_inches='tight')
            print(f"📊 Saved plot: {output_path}")
        else:
            plt.show()

        plt.close()


def analyze_training_samples(samples_dir: Path = Path("voice_training/samples")):
    """Analyze all collected training samples"""
    analyzer = FormantAnalyzer()

    print("🔬 MAIA Formant Analyzer")
    print("=" * 50)

    # Find all audio files
    audio_files = list(samples_dir.glob("*.mp3"))
    if not audio_files:
        print("❌ No samples found. Run sample_collector.py first.")
        return

    print(f"Found {len(audio_files)} samples to analyze\n")

    # Analyze each sample
    results = []
    for filepath in audio_files:
        try:
            features = analyzer.analyze_sample(filepath)
            features["filename"] = filepath.name
            results.append(features)
        except Exception as e:
            print(f"❌ Error analyzing {filepath.name}: {e}")

    # Aggregate statistics
    if results:
        print(f"\n📊 Aggregate Statistics ({len(results)} samples)")
        print("=" * 50)

        all_f1 = [r["average_formants"]["F1"] for r in results]
        all_f2 = [r["average_formants"]["F2"] for r in results]
        all_f3 = [r["average_formants"]["F3"] for r in results]
        all_f4 = [r["average_formants"]["F4"] for r in results]

        print(f"F1: {np.mean(all_f1):.0f} Hz (±{np.std(all_f1):.0f})")
        print(f"F2: {np.mean(all_f2):.0f} Hz (±{np.std(all_f2):.0f})")
        print(f"F3: {np.mean(all_f3):.0f} Hz (±{np.std(all_f3):.0f})")
        print(f"F4: {np.mean(all_f4):.0f} Hz (±{np.std(all_f4):.0f})")

        # Save results
        output_file = samples_dir / "formant_analysis.json"
        with open(output_file, "w") as f:
            json.dump(results, f, indent=2)

        print(f"\n✅ Analysis saved to: {output_file}")


if __name__ == "__main__":
    analyze_training_samples()
