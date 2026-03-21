---
name: video-to-code-skill
description: Analyzes video feedback by extracting key frames and audio transcription. Use when the user mentions video feedback, screen recordings, user recordings, or wants to analyze a video file from ~/video-to-code-skill-storage folder.
license: MIT
compatibility: Requires Python 3, opencv-python, numpy, and mlx-whisper (or openai-whisper). macOS recommended for Metal acceleration.
disable-model-invocation: true
metadata:
  author: Piotr Lason & Claudia
  version: "1.1"
---

# Your video recording will be added as a multimodal data bundle to the context window and tokenised as a part of your prompt

Analyze video feedback from `~/video-to-code-skill-storage` folder by extracting key frames and generating audio transcription.

## When to Use

- User mentions "video feedback" or "screen recording"
- User wants to analyze a recorded demo or bug report
- User asks about feedback in `~/video-to-code-skill-storage`

## Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `-dt`, `-detection_threshold` | Keyframe detection threshold (0-100). Lower values capture more keyframes. | `1` |
| `YYYY-MM-DD_HH-MM-SS` | Timestamp of an archived video to load directly from the archive. | — |

Examples:
- `/video-to-code-skill -dt 5`
- `/video-to-code-skill 2026-03-19_10-12-51`

### Strict parameter parsing rules

**Arguments come ONLY from the `<command-message>` tag** in the conversation. The `<command-message>` tag contains the exact text the user typed after the slash command name. Parse parameters exclusively from that string.

- If `<command-message>` is just `video-to-code-skill` (no extra text), there are **zero** parameters.
- If `<command-message>` is `video-to-code-skill -dt 5`, the detection threshold is `5`.
- If `<command-message>` is `video-to-code-skill 2026-03-19_10-12-51`, the timestamp is `2026-03-19_10-12-51`.

**Everything else is NOT a parameter** — including IDE context, additional working directories, open file paths, environment metadata.

## Instructions

Important: You can only modify files in `~/video-to-code-skill-storage` folder. If other files are to be modified outside of this folder, always ask the user for permission.

**Display this ASCII art banner as the very first output when the skill is invoked:**

```
 ██╗   ██╗██╗██████╗ ███████╗ ██████╗
 ██║   ██║██║██╔══██╗██╔════╝██╔═══██╗
 ██║   ██║██║██║  ██║█████╗  ██║   ██║
 ╚██╗ ██╔╝██║██║  ██║██╔══╝  ██║   ██║
  ╚████╔╝ ██║██████╔╝███████╗╚██████╔╝
   ╚═══╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝
████████╗ ██████╗      ██████╗  ██████╗ ██████╗ ███████╗
╚══██╔══╝██╔═══██╗    ██╔════╝ ██╔═══██╗██╔══██╗██╔════╝
   ██║   ██║   ██║    ██║      ██║   ██║██║  ██║█████╗
   ██║   ██║   ██║    ██║      ██║   ██║██║  ██║██╔══╝
   ██║   ╚██████╔╝    ╚██████╗ ╚██████╔╝██████╔╝███████╗
   ╚═╝    ╚═════╝      ╚═════╝  ╚═════╝╚═════╝ ╚══════╝  
   SKILL v1.1
```

1. **Notify the user**: Tell them "Analyzing user feedback video from ~/video-to-code-skill-storage - extracting key frames and narration transcript..."

2. **Ensure storage folder exists**:
   ```bash
   mkdir -p ~/video-to-code-skill-storage
   ```

3. **Check and install dependencies** (first run only):
   - If available, always prefer `/usr/bin/python3` over any venv Python for running the processor script.
   - Check for `cv2`, `numpy`, and `mlx_whisper` using `/usr/bin/python3` first (these may be user-installed via `pip install --user`). Only install missing packages.
   ```bash
   /usr/bin/python3 -c "import cv2" 2>/dev/null || python3 -c "import cv2" 2>/dev/null || /usr/bin/python3 -m pip install --user opencv-python numpy || python3 -m pip install --user opencv-python numpy
   /usr/bin/python3 -c "import mlx_whisper" 2>/dev/null || python3 -c "import mlx_whisper" 2>/dev/null || /usr/bin/python3 -m pip install --user mlx-whisper || python3 -m pip install --user mlx-whisper
   ```

4. **If a timestamp argument is provided** (matches `YYYY-MM-DD_HH-MM-SS` and follows "Strict parameter parsing rules"), look for a matching archive folder:
   ```bash
   ls -d ~/video-to-code-skill-storage/archive/<timestamp>*/ 2>/dev/null | head -1
   ```
   - If no matching folder is found, tell the user: **"No archived video found for timestamp `<timestamp>`"** and skip to step 5.
   - Tell the user which archived video is being loaded (show the archive folder name).
   - If a matching folder exists, read its `analysis/*/analysis.json`, as well as `summary.md` and `narration.md` (if present) — skip to step 10.

5. **Find the latest video file** (by modification time):
   ```bash
   find ~/video-to-code-skill-storage -maxdepth 1 -type f \( -name "*.mov" -o -name "*.mp4" -o -name "*.webm" \) -exec ls -t {} + | head -1
   ```

6. **If no video file found**, fall back to the most recent archived video:
   ```bash
   ls -dt ~/video-to-code-skill-storage/archive/*/ 2>/dev/null | head -1
   ```
   - If an archived folder exists, read its `analysis/*/analysis.json` and keyframe images, as well as `summary.md` and `narration.md` (if present) — skip to step 10.
   - Tell the user which archived video is being loaded (show the archive folder name).
   - If no archived analysis exists either, tell the user: **"No current or archived videos to input into the context"** and stop.

7. **Locate the skill directory**: Find where this skill is installed by looking for `video-to-code-skill-processor.py`:
   ```bash
   SKILL_DIR=$(dirname "$(find ~/.claude/skills /Users -maxdepth 6 -path "*/video-to-code-skill/scripts/video-to-code-skill-processor.py" -print -quit 2>/dev/null)")
   SKILL_DIR=$(dirname "$SKILL_DIR")
   ```

8. **Run the analysis script** (use the `-dt` or `-detection_threshold` parameter value if provided, otherwise default to `1`). Prefer `/usr/bin/python3` if available:
   ```bash
   /usr/bin/python3 "$SKILL_DIR/scripts/video-to-code-skill-processor.py" <video_path> -o ~/video-to-code-skill-storage/analysis/<video_name> -t <detection_threshold>
   ```

9. **Read the results**:
   - Read `~/video-to-code-skill-storage/analysis/<video_name>/analysis.json`
   - Read each keyframe image listed in the analysis

10. **Summarize** what the user is demonstrating or reporting — write a detailed content summary describing what is shown and said in the video with as much detail as possible. Present this summary to the user.

11. **Archive** the analyzed video (skip if using archived analysis from step 4 or 6):
   - Create timestamp folder: `~/video-to-code-skill-storage/archive/YYYY-MM-DD_HH-MM-SS_<title>/` where `<title>` is a max 35-character description derived from the video summary; separate the timestamp and title with a space where the OS allows (e.g. `2026-03-18_12-45-00 login flow dropdown bug/`), falling back to an underscore otherwise
   - Move video file and analysis folder to archive
   - Save the detailed video analysis summary as `summary.md` in the archive folder, using this structure:
     - Start with a short, high-level overview (up to 10 paragraphs) of what the video covers, grouped by chapters and topics using bullet lists when needed and short paragraphs.
     - Add a **"Key Moments"** section that contains a Markdown table with at least these columns: `Timestamp`, `What's happening`. Each important event from the video should have its own row.
     - Add **Questions, Requests and Issues** mentioned in the recording
     - Include the **total analysis processing time** (sum of keyframe extraction and transcription) in a clearly labeled line, formatted as `HH:MM:SS` (hours:minutes:seconds), e.g. `Total analysis time: 00:07:35`.
     - End with a final section (for example **"Detailed Walkthrough"**) that is a long-form essay addressed to a detailed oriented and technically savvy reader. This last chapter should contain the majority of the information from the video, walking through the flow, context, and reasoning in detail rather than just listing bullets.
   - If the video contains human narration/speech, save it as `narration.md` in the archive folder in screenplay-ready format with matching timestamp ranges, e.g.:
     ```
     # Narration Transcript

     **[00:00 – 00:12]**
     So here I'm opening the settings panel and you can see the bug right away...

     **[00:12 – 00:25]**
     When I click on the dropdown it doesn't close properly, it just stays open...
     ```

12. **Ask the user** what they would like help with based on the feedback

## Output Format

After analyzing, provide:

- **Video**: filename and duration
- **Analysis time**: Total processing time (keyframe extraction + transcription) formatted as `HH:MM:SS`
- **Summary**: Detailed content summary — describe what is shown, demonstrated, and said in as much detail as possible
- **Key moments**: Important timestamps with what's happening
- **User's intent**: What they seem to want help with
- **Questions and requests in the recording**: List all questions and requests from the presenter in the recording. Try to answer the questions.

### Archived artifacts
Saved alongside the video and analysis in the archive folder:
- `summary.md` — the detailed video analysis summary
- `narration.md` — (if human speech is present) full narration in screenplay-ready format with timestamp ranges

Then ask: "What would you like me to help you with based on this feedback?"

## Script Reference

The `$SKILL_DIR/scripts/video-to-code-skill-processor.py` script accepts these arguments:

| Argument | Description | Default |
|----------|-------------|---------|
| `<video_path>` | Path to video file | Required |
| `-o, --output-dir` | Output directory | `./video_analysis` |
| `-t, --threshold` | Keyframe detection threshold (0-100) | `1` |
| `-m, --model` | Whisper model (tiny, base, small, medium, large) | `base` or `large-v3-turbo` |

## Dependencies

| Package | Purpose |
|---------|---------|
| `opencv-python` | Frame extraction and scene change detection |
| `numpy` | Array operations |
| `mlx-whisper` | Audio transcription (Metal-accelerated, macOS) |
| `openai-whisper` | Audio transcription (fallback) |
