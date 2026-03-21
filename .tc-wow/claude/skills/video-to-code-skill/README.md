# video-to-code-skill v1.1

An Agent Skill following the open format: https://agentskills.io/what-are-skills

Inputs the "content" from a video into the Claude Code prompt / context window as a **bundle of voice transcription, time-synced with keyframes** - screenshots of key moments from the video (for example screen recording with voiceover), then archives it for future use.

There are **limitless usage scenarios** for this skill. Now you can show and tell your LLM Agent what needs to be done in a complete flow, illustrated by the pre-recorded video, instead of typing text and pasting screenshots in individual steps.

Refer to **examples**: [references/usage-examples.md](references/usage-examples.md)

Tested on: MacBook with Silicon CPU & Claude Code Opus 4.5 / 4.6

Note: Python script used to process video and audio content was **100% vibe coded**.

**Disclaimer**: Before using this or any agentic tool, make sure you understand its autonomy in your system. This skill is provided for experimental purposes and you, as a user, take full responsibility for its actions. See [MIT License](LICENSE)

**IMPORTANT**: I would like to advise you against extracting data from videos that haven't been done by you as unlikely, but potentially, they might be used for malicious prompt injection. There are some directives in the Skill to prevent this happening, but with LLMs nothing can be guaranteed. 

## What it does

1. Extracts **keyframes** at scene changes using OpenCV
2. Generates **audio transcription** using Whisper (MLX-accelerated on Mac)
3. Syncs transcript segments with keyframes
4. Produces a structured analysis with timestamps
5. Saves a detailed `summary.md` with overview, key moments table, and a long-form walkthrough
6. If the video contains narration/speech, saves `narration.md` with the full transcript in screenplay-ready format with timestamp ranges
7. Finally, it asks the user what needs to be done with the new context

## Prerequisites

| Requirement | Installation |
|---|---|
| Python 3 | Pre-installed on macOS |
| opencv-python | `pip install opencv-python numpy` |
| mlx-whisper | `pip install mlx-whisper` (Mac) |
| openai-whisper | `pip install openai-whisper` (fallback) |
| ffmpeg | `brew install ffmpeg` (for audio extraction) |

*Dependencies auto-install on first run.*

## Input

- Video file (`.mov`, `.mp4`, `.webm`) placed in `~/video-to-code-skill-storage/` folder
- If multiple videos exist, picks the **latest by modification time**
- If **no video file** is found in the storage folder, the skill automatically falls back to the **most recent archived video** from `~/video-to-code-skill-storage/archive/`
- If launched with a **timestamp parameter** (`YYYY-MM-DD_HH-MM-SS`), the skill loads the matching archived analysis directly, skipping video processing entirely

## Usage in Claude Code

```
/video-to-code-skill
```

### Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `-dt`, `-detection_threshold` | Keyframe detection threshold (0-100). Lower values capture more keyframes. | `1` |
| `YYYY-MM-DD_HH-MM-SS` | Timestamp of an archived video to load directly from the archive, skipping video processing. | — |

Setting custom detection threshold is useful to tune the Skill to different video sources. Time will tell which settings work best for different applications of this Skill.
More information will be added here.

Examples:

```
/video-to-code-skill -dt 5
/video-to-code-skill 2026-03-19_10-12-51
```

## Output

### Generated files

Video and analysis are archived to:

Located in `~/video-to-code-skill-storage/archive/YYYY-MM-DD_HH-MM-SS [summary]/analysis/`:

| File | Description |
|---|---|
| `analysis.json` | Full structured data |
| `transcript.json` | Audio transcription with timestamps |
| `analysis.md` | Human-readable summary |
| `keyframes/` | PNG images of key moments |

Located in `~/video-to-code-skill-storage/archive/YYYY-MM-DD_HH-MM-SS [summary]/`:

| File | Description |
|---|---|
| `summary.md` | Detailed video analysis: high-level overview, key moments table with timestamps, and a long-form detailed walkthrough |
| `narration.md` | *(only if video contains speech)* Full narration transcript in screenplay-ready format with timestamp ranges |

### Console output

- Video filename and duration
- Summary of what the user is demonstrating
- Key moments with timestamps
- User's apparent intent

## Installation

From your project root, clone this repo into your Claude Code skills directory:

```bash
git clone https://github.com/Trilogy-Care/video-to-code-skill.git .claude/skills/video-to-code-skill
```

This creates the `.claude/skills/video-to-code-skill/` folder and checks out the skill. The skill will be discovered by Claude Code on next session start — no further configuration needed.

When used for the first time, processing libraries will be installed by Claude automatically. Make sure the necessary file access permissions are set up for your agent.

### Updating

```bash
cd .claude/skills/video-to-code-skill && git pull
```

## Contribution

You are welcome to contribute:

1. Extending the tool's capabilities by opening a PR
2. Submitting bug fixes
3. Adding usage examples in [references/usage-examples.md](references/usage-examples.md)
4. Adding information on detection threshold settings recommended for specific applications in this file.

## License

[MIT License](LICENSE)

## Contact and Questions

Piotr Lason: Find me on [LinkedIn](https://linkedin.com/in/piotrlason)
