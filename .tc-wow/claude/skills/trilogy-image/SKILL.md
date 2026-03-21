---
name: trilogy-image
description: Generate visual assets for epics including hero images, storyboards, and AI prompts. Use when creating visual narratives, stakeholder presentations, or branded imagery. Triggers on: storyboard, visual story, cartoon, illustrate, user journey visual, hero image, epic image.
---

# Trilogy Image Skill

Generate visual assets for epics and user stories: hero images for idea briefs, storyboard narratives, and AI image prompts.

## Image Type Selection

When invoked, ask what type of image the user wants:

| Type | Description |
|------|-------------|
| **Hero Image** | Single branded hero image for an epic/idea brief (see Hero Image Generation) |
| **Storyboard** | Multi-panel visual narrative of user stories (see Output Options) |
| **Emoji Strip** | Quick compact emoji strip for sharing |
| **Custom Prompt** | Help craft a custom DALL-E/Midjourney prompt |

---

## Purpose

Storyboards make user stories tangible by showing:
- Real people in real situations
- Step-by-step visual narrative
- Emotional journey (how users feel)
- Before/after transformation

Use after `/speckit.clarify` when spec needs to be communicated to non-technical stakeholders.

## Epic Detection

```bash
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | sort
```

**If spec.md exists**: Load and proceed to storyboard generation
**If no spec.md found**: Ask user to create spec first

## Output Options

Ask user which output they want:

| Format | File | Best For |
|--------|------|----------|
| **Markdown** | `storyboards.md` | Documentation, handoff to designers |
| **AI Prompts** | `storyboards.md` + prompts | Generate actual images with DALL-E/Midjourney |
| **Emoji Strip** | Inline | Quick Slack/Teams sharing |

## Execution Flow

### 1. Load Spec & Stories

Read `spec.md` and extract user stories:
- Story title and ID
- Actor (who)
- Goal (what they want)
- Acceptance scenarios (what happens)

### 2. Create Character Personas

Define recurring characters for consistency:

```markdown
## Characters
- **Mary** (80s) - Elderly recipient, uses tablet, lives alone
- **John** (50s) - Mary's son, authorised representative, busy professional
- **Sarah** - Care coordinator, friendly, professional
- **Admin** - Back-office staff member
```

### 3. Generate Panel Storyboards

For each user story, create 3-5 panels:

| Panel | Elements |
|-------|----------|
| 1 | **Trigger** - What starts the journey |
| 2-3 | **Action** - Key steps user takes |
| 4 | **Decision** (if any) - Choice point |
| 5 | **Outcome** - Success state |

Include:
- Scene description (setting, action)
- Visual elements (what's on screen)
- Emotion (how user feels)

### 4. Write AI Image Prompts

For each panel, create a DALL-E/Midjourney prompt:

**Style Guide:**
```
Simple, warm illustration style. Soft colors (blue, green, cream).
Rounded shapes. Diverse characters. Modern devices (tablets, phones).
Healthcare/home care setting. Accessibility-friendly design.
No text in images. Clean backgrounds. Friendly, approachable.
```

**Prompt Template:**
```
[Style]. [Setting]. [Character description] [doing action].
[Key visual element]. [Mood/atmosphere]. [Technical: aspect ratio, style]
```

**Example:**
```
Warm, friendly illustration. Kitchen setting with morning light.
Elderly woman with silver hair sitting at table, looking at laptop
with pleased expression. Email notification icon floating above screen.
Soft, approachable style. --ar 16:9 --style raw
```

### 5. Add Emotion Arc

For each story, define the emotional journey:

```
Uncertain → Guided → Accomplished
Confused → Informed → Confident
Worried → Supported → Relieved
```

### 6. Create Output File

Save as `storyboards.md` in epic folder with:
- Character definitions
- Panel-by-panel storyboards per story
- AI prompts for each panel
- Emotion arcs
- Tool recommendations

### 7. Update Spec

Add to spec.md:
```markdown
## Visual Storyboards
See [`storyboards.md`](./storyboards.md) for visual narratives of user journeys.
```

## Emoji Strip Format

For quick sharing, create compact emoji strips:

```
US01: 📧→🔗→📋→✍️→✅
      Email > Click > View > Sign > Done!
```

## AI Image Generation Tips

### DALL-E 3
- Be specific about style and mood
- Describe composition (foreground, background)
- Avoid text requests (it handles text poorly)
- Use "illustration" or "cartoon" for friendly style

### Midjourney
- Add `--ar 16:9` for widescreen
- Add `--style raw` for less stylized
- Add `--no text` to avoid text attempts
- Use `--v 6` for latest version

### Consistency
- Use same character descriptions across panels
- Define a color palette upfront
- Keep setting details consistent

## Hero Image Generation (Idea Briefs)

Generate a single hero image for an epic's idea brief to visually represent the feature.

### Trilogy Brand Style

```
TRILOGY CARE BRAND GUIDELINES

Mission: Empowering older Australians to live independently in the home they love for longer.

Primary Colors:
- Navy: #2C4C79 (headers, text, professional elements)
- Sky Blue: #64BCEA (main brand color, highlights)
- Sun Yellow: #FEBD33 (warmth, optimism, accents)
- Orange: #E0763C (energy, calls to action)

Secondary Colors:
- Teal: #43C0BE (success, positive states)
- Dark Teal: #007F7E (secondary success)
- Light Blue: #D6E8FA (backgrounds, soft elements)
- Light Teal: #E3F6F5 (backgrounds, soft elements)

Alert Colors (use sparingly):
- Red: #E04B51 (warnings, errors)
- Dark Red: #962E32 (critical alerts)

Visual Style:
- Warm, friendly illustration style matching brand icons
- Simple, flat shapes with minimal detail
- Rounded edges, organic forms
- Hand-drawn feel but clean execution
- Navy outlines on key elements
- No text in generated images

Brand Icon Style (reference for illustrations):
- Heart shapes for care/hero themes
- Overlapping organic shapes
- Sun yellow for warmth/optimism
- Teal checkmarks for compliance/success
- Simple house shapes for home care
- Community shown as connected figures

Character "Captain Care":
- Friendly older Australian man, 60s-70s
- White/silver hair, white beard
- Warm genuine smile
- Cream or light colored polo shirt
- Represents the typical Trilogy Care client

Documents in Images:
- Sky blue (#64BCEA) header on documents
- Navy (#2C4C79) text elements
- Teal (#43C0BE) checkmarks for success
- Light blue (#D6E8FA) backgrounds
```

### Hero Image Script

Use the automated script for bulk generation:

```bash
cd .tc-wow/scripts
OPENAI_API_KEY=sk-xxx node generate-idea-brief-images.cjs           # All epics
OPENAI_API_KEY=sk-xxx node generate-idea-brief-images.cjs Epic-Name # Single epic
```

The script:
1. Finds all IDEA-BRIEF.md files
2. Extracts themes from problem statement
3. Generates DALL-E 3 prompts with Trilogy branding
4. Saves `hero.png` in each epic folder

### Manual Hero Image Prompt

For a single epic, create a prompt:

```
[TRILOGY BRAND STYLE]

Scene: Modern Australian aged care environment depicting "[Epic Title]".
Visual elements: [key themes from problem statement].
Composition: Wide landscape showing technology empowering elderly care.
Include: Friendly elderly person, modern devices, care environment.
Mood: Optimistic, professional, warm, supportive.
Style: Flat illustration with subtle gradients, clean lines, contemporary healthcare aesthetic.
```

### Using Hero Image in Docs

Add to `IDEA-BRIEF.md` or epic `index.md`:

```markdown
![Epic Hero Image](./hero.png)
```

Or use Nuxt Content image component:

```markdown
::hero-image
---
src: ./hero.png
alt: [Epic Name] visual concept
---
::
```

## Related Skills

- `/trilogy-illustrate` — For undraw.co SVG illustrations (empty states, onboarding, UI visuals). Use this for in-app illustrations, not AI-generated imagery.

## Behavior Rules

- Keep panels to 3-5 per story (digestible)
- Focus on key moments, not every step
- Show real people, not abstract UI
- Include emotional context
- Make prompts specific enough for consistent results
- Hero images should be landscape (1792x1024) for consistency
