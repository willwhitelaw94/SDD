#!/usr/bin/env python3
"""
Video Analyzer - Combined Keyframes + Transcription

Extracts keyframes from video and syncs them with voice-over transcription.
Creates a comprehensive analysis document for AI agents to understand video content.

Usage:
    python video-input-code-skill-processor.py <video_file> [options]

Options:
    --output-dir, -o    Output directory (default: ./video_analysis)
    --threshold, -t     Change detection threshold 0-100 (default: 5)
    --model, -m         Whisper model: tiny, base, small, medium, large (default: base)
    --language, -l      Language code for transcription (default: auto-detect)
    --verbose, -v       Verbose output

Output:
    - Keyframe images with timestamps
    - Transcription JSON with word-level timestamps
    - Combined analysis.md - Markdown document with keyframes + transcript synced
    - analysis.json - Structured data for programmatic access

Requirements:
    pip install opencv-python numpy openai-whisper

"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from time import time
from typing import Optional, List

# Check dependencies
missing_deps = []
try:
    import cv2
    import numpy as np
except ImportError:
    missing_deps.append("opencv-python numpy")

# Try mlx_whisper first (Metal-accelerated for Apple Silicon), fall back to whisper
USE_MLX_WHISPER = False
try:
    import mlx_whisper
    USE_MLX_WHISPER = True
except ImportError:
    try:
        import whisper
    except ImportError:
        missing_deps.append("openai-whisper or mlx-whisper")

if missing_deps:
    print("Error: Missing required packages.")
    print(f"Run: pip install {' '.join(missing_deps)}")
    sys.exit(1)


class VideoAnalyzer:
    """Combined video keyframe extraction and transcription."""

    def __init__(
        self,
        keyframe_threshold: float = 5.0,
        min_interval: float = 0.5,
        whisper_model: str = "base",
        language: str | None = None,
        verbose: bool = False,
    ):
        self.keyframe_threshold = keyframe_threshold
        self.min_interval = min_interval
        self.whisper_model_name = whisper_model
        self.language = language
        self.verbose = verbose
        self.whisper_model = None

    def log(self, message: str) -> None:
        if self.verbose:
            print(f"[INFO] {message}")

    def analyze(self, video_path: str, output_dir: str) -> dict:
        """
        Perform complete video analysis.

        Returns combined keyframes and transcription data.
        """
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found: {video_path}")

        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        print("=" * 60)
        print("VIDEO ANALYZER")
        print("=" * 60)
        print(f"Input: {video_path}")
        print(f"Output: {output_dir}")
        print()

        # Step 1: Extract keyframes
        print("STEP 1: Extracting keyframes...")
        print("-" * 40)
        keyframes_start = time()
        keyframes = self._extract_keyframes(video_path, output_path / "keyframes")
        keyframes_duration = time() - keyframes_start

        # Step 2: Transcribe audio
        print("\nSTEP 2: Transcribing audio...")
        print("-" * 40)
        transcription_start = time()
        transcription = self._transcribe(video_path)
        transcription_duration = time() - transcription_start

        # Store timing info
        timing_info = {
            "keyframes_extraction": keyframes_duration,
            "transcription": transcription_duration,
            "total": keyframes_duration + transcription_duration,
        }

        # Step 3: Sync keyframes with transcript
        print("\nSTEP 3: Syncing keyframes with transcript...")
        print("-" * 40)
        synced_data = self._sync_keyframes_transcript(keyframes, transcription, timing_info)

        # Step 4: Generate outputs
        print("\nSTEP 4: Generating outputs...")
        print("-" * 40)

        # Save analysis JSON
        analysis_json_path = output_path / "analysis.json"
        with open(analysis_json_path, "w", encoding="utf-8") as f:
            json.dump(synced_data, f, indent=2, ensure_ascii=False)
        print(f"  JSON: {analysis_json_path}")

        # Save transcript only
        transcript_path = output_path / "transcript.json"
        with open(transcript_path, "w", encoding="utf-8") as f:
            json.dump(transcription, f, indent=2, ensure_ascii=False)
        print(f"  Transcript: {transcript_path}")

        # Generate Markdown document
        markdown_path = output_path / "analysis.md"
        self._generate_markdown(synced_data, markdown_path)
        print(f"  Markdown: {markdown_path}")

        # Summary
        print("\n" + "=" * 60)
        print("ANALYSIS COMPLETE")
        print("=" * 60)
        print(f"  Keyframes extracted: {len(keyframes)}")
        print(f"  Transcript segments: {len(transcription.get('segments', []))}")
        print(f"  Duration: {synced_data['video_info']['duration']:.1f}s")
        print(f"  Language: {transcription.get('language', 'unknown')}")
        print()
        print("  Processing time:")
        print(f"    Keyframes extraction: {synced_data['processing_time']['keyframes_extraction']}")
        print(f"    Transcription:        {synced_data['processing_time']['transcription']}")
        print(f"    Total:                {synced_data['processing_time']['total']}")

        return synced_data

    def _extract_keyframes(self, video_path: str, output_dir: Path) -> list[dict]:
        """Extract keyframes from video."""
        output_dir.mkdir(parents=True, exist_ok=True)

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Could not open video: {video_path}")

        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        duration = total_frames / fps if fps > 0 else 0

        print(f"  Resolution: {width}x{height}")
        print(f"  FPS: {fps:.2f}, Duration: {duration:.2f}s")

        video_name = Path(video_path).stem
        keyframes = []
        prev_gray = None
        last_keyframe_time = -self.min_interval
        frame_count = 0

        # First frame
        ret, first_frame = cap.read()
        if ret:
            timestamp = 0.0
            filename = f"keyframe_{len(keyframes):04d}_{self._format_ts_filename(timestamp)}.png"
            filepath = output_dir / filename
            cv2.imwrite(str(filepath), first_frame)
            prev_gray = cv2.cvtColor(first_frame, cv2.COLOR_BGR2GRAY)
            last_keyframe_time = timestamp

            keyframes.append({
                "index": len(keyframes),
                "timestamp": timestamp,
                "timestamp_formatted": self._format_ts(timestamp),
                "filename": filename,
                "filepath": str(filepath),
                "change_percentage": 100.0,
            })
            self.log(f"Keyframe 0: {self._format_ts(timestamp)} (first)")

        frame_count += 1

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            timestamp = frame_count / fps
            frame_count += 1

            if timestamp - last_keyframe_time < self.min_interval:
                prev_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                continue

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            diff = cv2.absdiff(prev_gray, gray)
            _, thresh = cv2.threshold(diff, 25, 255, cv2.THRESH_BINARY)
            change_pct = (np.count_nonzero(thresh) / thresh.size) * 100

            if change_pct >= self.keyframe_threshold:
                filename = f"keyframe_{len(keyframes):04d}_{self._format_ts_filename(timestamp)}.png"
                filepath = output_dir / filename
                cv2.imwrite(str(filepath), frame)
                last_keyframe_time = timestamp

                keyframes.append({
                    "index": len(keyframes),
                    "timestamp": round(timestamp, 3),
                    "timestamp_formatted": self._format_ts(timestamp),
                    "filename": filename,
                    "filepath": str(filepath),
                    "change_percentage": round(change_pct, 2),
                })
                self.log(f"Keyframe {len(keyframes)-1}: {self._format_ts(timestamp)} ({change_pct:.1f}%)")

            prev_gray = gray

        cap.release()
        print(f"  Extracted {len(keyframes)} keyframes")
        return keyframes

    def _transcribe(self, video_path: str) -> dict:
        """Transcribe video audio."""
        if USE_MLX_WHISPER:
            print(f"  Using MLX Whisper (Metal-accelerated): {self.whisper_model_name}")
            # mlx_whisper uses direct transcribe call without loading model
            # Map model names to HuggingFace repo paths
            mlx_model_map = {
                "tiny": "mlx-community/whisper-tiny-mlx",
                "base": "mlx-community/whisper-base-mlx",
                "small": "mlx-community/whisper-small-mlx",
                "medium": "mlx-community/whisper-medium-mlx",
                "large": "mlx-community/whisper-large-mlx",
                "large-v3": "mlx-community/whisper-large-v3-mlx",
                "large-v3-turbo": "mlx-community/whisper-large-v3-turbo",
            }
            mlx_model = mlx_model_map.get(self.whisper_model_name, f"mlx-community/whisper-{self.whisper_model_name}-mlx")
            options = {"word_timestamps": True, "verbose": False, "path_or_hf_repo": mlx_model}
            if self.language:
                options["language"] = self.language
            result = mlx_whisper.transcribe(video_path, **options)
        else:
            if self.whisper_model is None:
                print(f"  Loading Whisper model: {self.whisper_model_name}")
                self.whisper_model = whisper.load_model(self.whisper_model_name)

            options = {"word_timestamps": True, "verbose": False}
            if self.language:
                options["language"] = self.language

            result = self.whisper_model.transcribe(video_path, **options)

        segments = []
        for seg in result.get("segments", []):
            segment_data = {
                "id": seg["id"],
                "start": round(seg["start"], 3),
                "end": round(seg["end"], 3),
                "text": seg["text"].strip(),
            }
            if "words" in seg:
                segment_data["words"] = [
                    {
                        "word": w["word"].strip(),
                        "start": round(w["start"], 3),
                        "end": round(w["end"], 3),
                    }
                    for w in seg["words"]
                ]
            segments.append(segment_data)

        print(f"  Transcribed {len(segments)} segments")
        print(f"  Language: {result.get('language', 'unknown')}")

        return {
            "language": result.get("language", "unknown"),
            "full_text": result.get("text", "").strip(),
            "segments": segments,
        }

    def _sync_keyframes_transcript(self, keyframes: list, transcription: dict, timing_info: dict | None = None) -> dict:
        """Sync keyframes with transcript segments."""
        segments = transcription.get("segments", [])

        # For each keyframe, find overlapping transcript
        for kf in keyframes:
            kf_time = kf["timestamp"]
            kf["transcript_context"] = []

            # Find segments that overlap with this keyframe's timeframe
            # Consider a window around the keyframe
            window_start = max(0, kf_time - 2)
            window_end = kf_time + 5

            for seg in segments:
                if seg["start"] <= window_end and seg["end"] >= window_start:
                    kf["transcript_context"].append({
                        "text": seg["text"],
                        "start": seg["start"],
                        "end": seg["end"],
                    })

        # For each transcript segment, find nearest keyframe
        for seg in segments:
            seg_mid = (seg["start"] + seg["end"]) / 2
            nearest_kf = None
            min_dist = float("inf")

            for kf in keyframes:
                dist = abs(kf["timestamp"] - seg_mid)
                if dist < min_dist:
                    min_dist = dist
                    nearest_kf = kf

            if nearest_kf:
                seg["nearest_keyframe"] = {
                    "index": nearest_kf["index"],
                    "timestamp": nearest_kf["timestamp"],
                    "filename": nearest_kf["filename"],
                }

        result = {
            "source_video": str(Path(keyframes[0]["filepath"]).parent.parent) if keyframes else "",
            "analysis_time": datetime.now().isoformat(),
            "video_info": {
                "duration": keyframes[-1]["timestamp"] if keyframes else 0,
                "keyframe_count": len(keyframes),
                "segment_count": len(segments),
            },
            "keyframes": keyframes,
            "transcription": transcription,
        }

        if timing_info:
            result["processing_time"] = {
                "keyframes_extraction": self._format_duration(timing_info["keyframes_extraction"]),
                "transcription": self._format_duration(timing_info["transcription"]),
                "total": self._format_duration(timing_info["total"]),
                "keyframes_extraction_seconds": round(timing_info["keyframes_extraction"], 2),
                "transcription_seconds": round(timing_info["transcription"], 2),
                "total_seconds": round(timing_info["total"], 2),
            }

        return result

    def _generate_markdown(self, data: dict, output_path: Path) -> None:
        """Generate Markdown analysis document."""
        lines = [
            "# Video Analysis Report",
            "",
            f"**Generated:** {data['analysis_time']}",
            f"**Duration:** {data['video_info']['duration']:.1f}s",
            f"**Keyframes:** {data['video_info']['keyframe_count']}",
            f"**Transcript Segments:** {data['video_info']['segment_count']}",
            "",
            "---",
            "",
            "## Full Transcript",
            "",
            data["transcription"].get("full_text", ""),
            "",
            "---",
            "",
            "## Timeline (Keyframes + Transcript)",
            "",
        ]

        # Merge keyframes and transcript by timestamp
        events = []

        for kf in data["keyframes"]:
            events.append({
                "time": kf["timestamp"],
                "type": "keyframe",
                "data": kf,
            })

        for seg in data["transcription"].get("segments", []):
            events.append({
                "time": seg["start"],
                "type": "transcript",
                "data": seg,
            })

        events.sort(key=lambda x: x["time"])

        for event in events:
            time_str = self._format_ts(event["time"])

            if event["type"] == "keyframe":
                kf = event["data"]
                lines.append(f"### [{time_str}] Keyframe {kf['index']}")
                lines.append("")
                lines.append(f"![Keyframe {kf['index']}](keyframes/{kf['filename']})")
                lines.append("")
                if kf.get("transcript_context"):
                    lines.append("**Context:**")
                    for ctx in kf["transcript_context"]:
                        lines.append(f"> {ctx['text']}")
                    lines.append("")
            else:
                seg = event["data"]
                lines.append(f"**[{time_str}]** {seg['text']}")
                lines.append("")

        # Keyframe gallery
        lines.extend([
            "---",
            "",
            "## Keyframe Gallery",
            "",
        ])

        for kf in data["keyframes"]:
            lines.append(f"| ![{kf['index']}](keyframes/{kf['filename']}) |")
            lines.append(f"| {kf['timestamp_formatted']} |")
            lines.append("")

        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

    def _format_ts(self, seconds: float) -> str:
        """Format seconds to MM:SS.mmm"""
        minutes = int(seconds // 60)
        secs = int(seconds % 60)
        millis = int((seconds % 1) * 1000)
        return f"{minutes:02d}:{secs:02d}.{millis:03d}"

    def _format_ts_filename(self, seconds: float) -> str:
        """Format seconds to MM-SS-mmm (safe for filenames)"""
        minutes = int(seconds // 60)
        secs = int(seconds % 60)
        millis = int((seconds % 1) * 1000)
        return f"{minutes:02d}-{secs:02d}-{millis:03d}"

    def _format_duration(self, seconds: float) -> str:
        """Format seconds to HH:MM:SS"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"


def main():
    parser = argparse.ArgumentParser(
        description="Analyze video: extract keyframes and transcribe audio.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    # Basic analysis
    python video-analyzer.py recording.mp4

    # Custom output and settings
    python video-analyzer.py recording.mp4 -o ./analysis -t 10 -m small

    # Specify language for transcription
    python video-analyzer.py recording.mp4 -l en
        """,
    )

    parser.add_argument("video", help="Path to video file")
    parser.add_argument("-o", "--output-dir", default="./video_analysis",
                        help="Output directory (default: ./video_analysis)")
    parser.add_argument("-t", "--threshold", type=float, default=5.0,
                        help="Keyframe detection threshold 0-100 (default: 5)")
    parser.add_argument("-m", "--model", default="large-v3-turbo" if USE_MLX_WHISPER else "base",
                        choices=["tiny", "base", "small", "medium", "large", "large-v3", "large-v3-turbo"],
                        help="Whisper model (default: large-v3-turbo with MLX, base otherwise)")
    parser.add_argument("-l", "--language", help="Language code (default: auto)")
    parser.add_argument("-v", "--verbose", action="store_true", help="Verbose output")

    args = parser.parse_args()

    analyzer = VideoAnalyzer(
        keyframe_threshold=args.threshold,
        whisper_model=args.model,
        language=args.language,
        verbose=args.verbose,
    )

    try:
        analyzer.analyze(args.video, args.output_dir)
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
