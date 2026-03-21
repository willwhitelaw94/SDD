# Usage Examples

## Basic usage

Drop a video into the input folder and run the skill:

```bash
# 1. Place your video
cp ~/Downloads/bug-report.mov ~/video-to-code-skill-storage/

# 2. In Claude Code, run the skill
/video-to-code-skill

# 3. Optionally adjust keyframe detection threshold (0-100, default: 1)
#    Use -dt or -detection_threshold
/video-to-code-skill -dt 5

# 4. Optionally run the skill with action points
/video-to-code-skill and find instances when presenter was asking for feedback and describe what was shown in the video at that time
```

Claude will extract keyframes, transcribe audio, and summarize what's happening in the video.

## Use Cases (contribute to this section by adding your clever use cases in a PR)

### 1. Analyze a screen recording with voiceover

Record your screen while narrating a bug report, feature request, etc. then save the video file to `~/video-to-code-skill-storage/`. The skill will:

- Extract screenshots at each scene change
- Transcribe your narration with timestamps
- Match what you said to what was on screen
- Ask what you'd like help with

For screen recording use QuickTime Player on MacBook or Snipping Tool on Windows.

### 2. Generate Playwright E2E tests from a screen recording

Record yourself walking through a user flow in the browser (e.g., login, fill a form, navigate between pages), then ask Claude to turn it into Playwright automation code:

```bash
# 1. Record your screen while performing the flow
# 2. Save to input folder
cp ~/Downloads/user-flow-walkthrough.mov ~/video-to-code-skill-storage/

# 3. Run the skill with an instruction to generate Playwright code
/video-to-code-skill Based on this recording, create a Playwright E2E test that automates the exact sequence of actions shown and then refactor it to the Page Object Model
```

Claude will see every screen transition and hear your narration describing what you're clicking, then generate a Playwright test with the correct selectors, assertions, and page navigation matching the recorded flow.

### 3. Create a walkthrough with screenshots of the screen recording and voice over

```bash
# 1. Do the prerequisite steps...

# 2. Now run the skill
/video-to-code-skill and create walkthrough with description of presented steps with screenshots, then convert to single file html

# 3. Ready to be emailed
```


## Edge Cases

### 1. Re-use a previously analyzed video

If no new video is in `~/video-to-code-skill-storage/`, the skill automatically loads the most recent archived analysis:

```
/video-to-code-skill
```

> Using archived analysis from 2026-02-06_14-30-00...

This is useful when you want to continue working on a previously analyzed video without re-processing it.

### 2. Load a specific archived video by timestamp

If you know the timestamp of a previously archived analysis, pass it directly to skip video processing and load that archive:

```
/video-to-code-skill 2026-03-19_10-12-51
```

> Loading archived analysis from 2026-03-19_10-12-51...

This is useful when you have multiple archived videos and want to revisit a specific one without relying on the "most recent" fallback.

### 3. Multiple videos

When multiple videos exist in `~/video-to-code-skill-storage/`, the skill picks the **latest by modification time**. To analyze a specific video, remove or move the others first.


## Supported formats

| Format | Extension |
|--------|-----------|
| QuickTime | `.mov` |
| MPEG-4 | `.mp4` |
| WebM | `.webm` |
