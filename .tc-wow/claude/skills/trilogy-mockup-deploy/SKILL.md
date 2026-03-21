---
name: trilogy-mockup-deploy
description: Deploy HTML mockups to a unique public Vercel URL. Each deployment gets its own project — never overwrites existing ones. Use after /trilogy-mockup to share mockup explorations with the team. Triggers on: deploy mockups, publish mockups, share mockups, mockup URL, mockup deploy, mockup showcase.
---

# Trilogy Mockup Deploy

Deploy HTML mockup pages to a unique public Vercel URL for team sharing, Figma capture, and stakeholder review. Each deployment creates a **new Vercel project** with a unique name — existing deployments are never overwritten.

## When to Use

Run after `/trilogy-mockup` has generated HTML mockup files:
```
/trilogy-design → /trilogy-mockup → /trilogy-mockup-deploy → Figma capture → /speckit-plan
```

## Usage

```
/trilogy-mockup-deploy              # Auto-detect mockups in current epic
/trilogy-mockup-deploy path/to/dir  # Deploy specific mockups directory
```

## Execution Steps

### Step 1: Find Mockups Directory

Locate the mockups to deploy:
1. If a path argument is provided, use that directory
2. Otherwise, search for a `mockups/` directory in the current epic context:
   - Check `.tc-docs/content/initiatives/` for directories containing `mockups/`
   - Look for HTML files with Tailwind CDN (`cdn.tailwindcss.com`)
3. If multiple mockup directories exist, ask the user which to deploy
4. Confirm the directory contains at least one `.html` file

### Step 2: Generate Unique Project Name

Create a unique Vercel project name to prevent overwriting existing deployments:

```
tc-mockup-{epic-kebab}-{timestamp}
```

**Name format:**
- Prefix: `tc-mockup-`
- Epic name in kebab-case (e.g., `needs-v2`, `lead-profile`, `risk-radar`)
- Short timestamp: `MMDD` (e.g., `0311` for March 11)

**Examples:**
- `tc-mockup-needs-v2-0311`
- `tc-mockup-lead-profile-0215`
- `tc-mockup-risk-radar-0428`

**If the user re-deploys the same mockups** (e.g., after adding/removing students), append a revision suffix: `-r2`, `-r3`, etc. Check for existing projects first:

```bash
vercel ls 2>&1 | grep "tc-mockup-{epic-kebab}"
```

### Step 3: Verify Viewer Toolbar

Ensure each HTML mockup file includes the shared `viewer-toolbar.js` script:
```html
<script src="viewer-toolbar.js" defer></script>
```

**Do NOT include Figma's `capture.js` directly** — it auto-generates its own toolbar and causes duplicate bars. The viewer toolbar handles Figma capture on demand.

### Step 4: Deploy to Vercel

```bash
cd <mockups-directory> && vercel --yes --prod 2>&1
```

**If `vercel` is not installed:**
```bash
npx vercel --yes --prod 2>&1
```

**If Vercel authentication is needed**, ask the user to run `vercel login` first.

### Step 5: Clean Up Artifacts

Remove Vercel's generated files from the mockups directory (they don't belong in git):

```bash
rm -rf <mockups-directory>/.vercel <mockups-directory>/.env.local
```

### Step 6: Report Results

Output the deployment summary:

```markdown
## Mockups Deployed

**URL:** <vercel-aliased-url>
**Project:** <project-name>

**Pages:**
- 01 — <page title>
- 02 — <page title>
- ...

Share this URL with your team for review.
Press `F` on any page to capture to Figma clipboard.
```

## Key Rules

1. **Never overwrite existing deployments** — always create a new Vercel project with a unique name
2. **Never include `capture.js` directly** in HTML files — it creates duplicate toolbars. The `viewer-toolbar.js` loads it on demand.
3. **Use `--yes` flag** to skip Vercel prompts for non-interactive deployment
4. **Report the aliased URL** (e.g., `tc-mockup-needs-v2-0311.vercel.app`), not the deployment-specific URL
5. **Don't modify source HTML** — only verify `viewer-toolbar.js` is included
6. **Always clean up** `.vercel/` and `.env.local` after deployment — these shouldn't be committed
7. **Track deployed URLs** — mention the URL in the epic's comparison.md or design.md for reference

## Redeploying After Changes

When the user modifies mockups (adds/removes students, updates designs):

1. Check if a deployment already exists for this epic: `vercel ls 2>&1 | grep "tc-mockup-{epic}"`
2. If yes, redeploy to the **same project** (updates the existing URL):
   ```bash
   cd <mockups-directory> && vercel --yes --prod 2>&1
   ```
3. If a fresh URL is needed, create a new project with `-r2` suffix
4. Clean up artifacts after deploy

## Figma Capture from Deployed URL

After deployment, mockups can be captured to Figma directly from the toolbar:

1. Open any deployed page
2. Click the **"Copy to Figma"** button in the toolbar (or press `F`)
3. The toolbar hides, the page is captured to clipboard, toolbar restores
4. Paste into Figma with `Cmd+V`

## Next Steps

After deploying:
- Share URL with stakeholders for feedback
- Capture selected designs to Figma for refinement
- Run `/trilogy-design-handover` when design is approved
- Run `/speckit-plan` to begin implementation planning
