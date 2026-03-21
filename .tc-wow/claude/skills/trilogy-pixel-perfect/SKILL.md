---
name: trilogy-pixel-perfect
description: >-
  Compare built implementation against Figma design for pixel-perfect accuracy.
  Takes a Figma frame URL and optionally a local page URL, screenshots both, and
  produces a two-pass report: feature gaps then pixel-level CSS fixes.
  Triggers on: pixel perfect, compare design, visual diff, figma comparison, design check.
metadata:
  version: 2.0.0
  type: agent
---

# Trilogy Pixel Perfect Skill

Compare the built implementation in the browser against the Figma design reference. Produces a **two-pass report**: first identifying feature/scope gaps (product owner), then pixel-level CSS fixes (developer action).

## When to Use

```bash
/trilogy-pixel-perfect <figma-url> <local-url>     # Compare specific frame vs page
/trilogy-pixel-perfect <figma-url>                  # Auto-resolve local URL from route
/trilogy-pixel-perfect --all                        # Compare all frames from design.md inventory
```

Run **during implementation** after building a screen, and again **during QA** (Gate 5).

## Prerequisites

| Tool | Required | Purpose |
|------|----------|---------|
| `mcp__figma__get_screenshot` | Yes | Get Figma design reference |
| `mcp__figma__get_metadata` | Yes | Get frame dimensions for accurate resize |
| `mcp__chrome-devtools__take_screenshot` | Yes | Screenshot the built page |
| `mcp__laravel-boost__get-absolute-url` | Recommended | Resolve local URLs |
| `mcp__laravel-boost__list-routes` | Recommended | Find route for a page |
| design.md with Figma Screen Inventory | Recommended | For `--all` mode and URL mapping |

---

## Execution Flow

### Step 0: Verify MCP Servers

Check that required MCP servers are available **before doing anything else**.

**Check Figma MCP:**
1. Use ToolSearch for `+figma screenshot` to verify `mcp__figma__get_screenshot` is available
2. If **not available**, tell the user:
   ```bash
   claude mcp add figma --transport http https://mcp.figma.com/mcp
   ```
3. After install, user authenticates via browser (OAuth) on first use

**Check Chrome DevTools MCP:**
1. Use ToolSearch for `+chrome-devtools screenshot` to verify `mcp__chrome-devtools__take_screenshot` is available
2. If **not available**, tell the user:
   ```bash
   claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
   ```

**If either MCP is missing** → ask user to install, restart Claude Code, and stop. The skill cannot proceed.

### Step 1: Parse Input & Resolve URLs

```
Input: "/trilogy-pixel-perfect https://figma.com/design/{fileKey}/{name}?node-id={id} [local-url]"

Extract:
  - Figma fileKey and nodeId (convert "-" to ":" in nodeId)
  - Local page URL
```

**URL Resolution Priority** (if no local URL provided):
1. Check the initiative's `design.md` for a **Figma Screen Inventory** table — match nodeId to a description, infer the route
2. Use `mcp__laravel-boost__list-routes` to search for a matching route name
3. Use `mcp__laravel-boost__get-absolute-url` to build the full URL
4. If none work, ask the user for the URL

**For `--all` mode**: Read the Figma Screen Inventory table from the initiative's `design.md` and iterate all frames.

### Step 2: Authenticate Browser (if needed)

After navigating to the local URL, **check if the page redirected to `/login`**.

**Auto-login sequence** (local dev only):
1. Take a snapshot (`mcp__chrome-devtools__take_snapshot`)
2. If the page title contains "Log in" or URL contains `/login`:
   a. Find the "Show popup" button (Dev logins dropdown) → click it
   b. Select "Admin" from the listbox options → click it (this populates `admin@example.com` / `foobar`)
   c. Find the "Log in" button → click it
   d. Wait for navigation to complete (`mcp__chrome-devtools__wait_for` with a text string expected on the target page)
   e. If the target URL was not reached, navigate to it again
3. If already authenticated, proceed

**Important**: This uses the `DevLogins.vue` component which only exists in local dev environments.

**For `--all` mode**: Authenticate once, then reuse the session for all subsequent screenshots.

### Step 3: Get Figma Reference + Frame Dimensions

Do these **in parallel**:

```
1. mcp__figma__get_screenshot(fileKey, nodeId)  → reference image
2. mcp__figma__get_metadata(fileKey, nodeId)     → frame width/height
```

From the metadata, extract the frame's **width** and **height** to use for browser resize. Do NOT guess viewport dimensions.

### Step 4: Screenshot the Built Page

```
1. Navigate: mcp__chrome-devtools__navigate_page(url)
2. Resize to match Figma frame dimensions:
   mcp__chrome-devtools__resize_page(width, height)  — use actual values from Step 3
3. Screenshot: mcp__chrome-devtools__take_screenshot()
```

### Step 5: Read Source Files

Before comparing, **read the Vue page component** that renders this screen:
1. Find the page component (check `resources/js/Pages/` using Glob)
2. Read it to understand the actual markup, Tailwind classes, and component structure
3. Optionally read the controller/table definition if the differences involve data/columns

This enables **source-linked fixes** with file paths and line numbers.

### Step 6: Two-Pass Comparison

#### Pass 1 — Feature Audit (Scope Gaps)

Compare **what exists** vs **what the design shows**. These are product/spec issues, NOT CSS bugs.

| Check | Example |
|-------|---------|
| Missing sections | Design has 5 stat cards, build has 4 |
| Missing buttons/actions | Design has "+ Create Lead" button, build doesn't |
| Wrong column set | Design shows Phone column, build hides it |
| Different controls | Design has dropdown filters, build has button filters |
| Missing states | Design shows error state, build doesn't handle it |
| Different labels/titles | Design says "Lead conversion", build says "Leads" |

**Output format:**

```markdown
## Pass 1 — Feature Audit (Scope Gaps)

These differences require product/design decisions — they are NOT CSS fixes.

| # | Element | Figma Shows | Build Has | Owner |
|---|---------|-------------|-----------|-------|
| 1 | Page title | "Lead conversion" | "Leads" | Product |
| 2 | Header button | "+ Create Lead" | Missing | Spec/Backlog |
| 3 | Stats cards | 5 cards incl. "Rejected" | 4 cards | Backend + Frontend |
```

If Pass 1 reveals **major** scope gaps (>5 missing features), warn the user that pixel-level fixes are premature and recommend resolving scope first.

#### Pass 2 — Pixel Audit (CSS/Styling Fixes)

For elements that **exist in both** the design and build, compare styling:

| Dimension | What to Check | Tolerance |
|-----------|---------------|-----------|
| **Layout** | Grid structure, column widths, section ordering | Exact match |
| **Spacing** | Margins, padding, gaps between elements | +/- 2px |
| **Typography** | Font size, weight, color, line height | Exact match |
| **Colors** | Background, text, border, button colors | Exact hex match to nearest Tailwind token |
| **Icons** | Correct icon, correct size, correct color | Exact match |
| **Borders** | Border radius, border color, border width | Exact match |
| **Alignment** | Vertical/horizontal alignment | Exact match |

**Output format** — grouped by file with line numbers:

```markdown
## Pass 2 — Pixel Audit (CSS Fixes)

### `resources/js/Pages/Staff/Leads/Index.vue`

| # | Line | Element | Expected (Figma) | Actual | Fix |
|---|------|---------|-------------------|--------|-----|
| 1 | 48 | Stat label color | gray-600 | gray-500 | `text-gray-600` |
| 2 | 41 | Icon bg shape | rounded-full | rounded-lg | `rounded-full` |
| 3 | 54 | Card icon bg | teal-50 | green-50 | `bg-teal-50` |

#### Copy-paste fixes

``​`vue
<!-- Line 41: Icon bg shape → rounded-full -->
<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
  <!-- was: rounded-lg -->

<!-- Line 48: Stat label color → gray-600 -->
<p class="text-sm font-medium text-gray-600">Total Leads</p>
  <!-- was: text-gray-500 -->
``​`
```

### Step 7: Score Summary

Score **only the pixel audit** (Pass 2). Feature gaps don't count — they belong to the spec/backlog.

**Scoring rubric** (per element that exists in both design and build):

| Category | Weight | Pass Criteria |
|----------|--------|---------------|
| Layout/Grid | 25% | Grid columns, section order, flex direction match |
| Spacing | 20% | All padding/margin/gap within 2px |
| Typography | 20% | Font size, weight, and color match Figma |
| Colors | 20% | Background, border, text colors match nearest Tailwind token |
| Icons & Details | 15% | Correct icons, correct sizes, border-radius match |

**Each category**: count matching elements / total elements = category score. Weighted average = overall.

```markdown
## Score Summary

| Category | Score | Issues |
|----------|-------|--------|
| Layout/Grid | 90% | 1 issue |
| Spacing | 85% | 2 issues |
| Typography | 95% | 1 issue |
| Colors | 70% | 3 issues |
| Icons & Details | 80% | 2 issues |
| **Weighted Total** | **84%** | **9 issues** |

**Feature gaps (Pass 1)**: 5 items — resolve with product owner before next audit
```

| Score | Rating | Action |
|-------|--------|--------|
| 95-100% | Pixel perfect | Ship it |
| 85-94% | Close match | Fix listed issues |
| 70-84% | Needs work | Fix all, re-run audit |
| <70% | Major rework | Re-examine approach |

### Step 8: Iterate (`--all` mode)

When using `--all`:
1. Read the Figma Screen Inventory from `design.md`
2. Authenticate once (Step 2)
3. For each frame with a corresponding route:
   - Get Figma screenshot + metadata (parallel)
   - Navigate, resize, screenshot
   - Read the relevant Vue component
   - Run both passes
4. Produce a summary table across all screens

```markdown
## Pixel Perfect Audit Summary

| Screen | Pixel Score | Feature Gaps | Pixel Issues |
|--------|------------|--------------|-------------|
| Lead Dashboard | 84% | 5 | 9 |
| Step 1 — Lead Details | 92% | 1 | 3 |
| Step 2 — MAC Details | 78% | 2 | 7 |

**Average Pixel Score**: 85%
**Total Feature Gaps**: 8 (product owner)
**Total Pixel Issues**: 19 (developer)
```

---

## Behavior Rules

1. **Always get frame dimensions from Figma metadata** — never guess viewport sizes
2. **Always authenticate automatically** — don't waste tool calls on manual login clicks
3. **Always read the source files** — fixes must reference file paths and line numbers
4. **Separate feature gaps from pixel issues** — they have different owners and workflows
5. **Use Tailwind tokens in fixes** — `text-gray-600` not `color: #4B5563`
6. **Group fixes by file** — developer fixes one file at a time
7. **Don't flag framework rendering differences** — focus on visual output, not DOM structure
8. **Don't flag data-dependent differences** — "9 records" vs "25 records" is test data, not a bug
9. **Score only what exists in both** — missing features are Pass 1, not Pass 2
10. **For `--all` mode, authenticate once** — reuse session across all pages

---

## Integration with Other Skills

| Skill | Relationship |
|-------|-------------|
| `/trilogy-design-gap` | Spec-vs-design alignment (run BEFORE pixel-perfect) |
| `/trilogy-pixel-perfect` | **This skill** — design-vs-build visual accuracy |
| `/trilogy-dev-handover` | Gate 4 — run after pixel score reaches 85%+ |
| `/trilogy-qa` | Gate 5 — includes pixel-perfect re-check |

## Workflow Position

```
/trilogy-design-gap     → Verify design matches spec (gaps go back to designer)
        ↓
Implementation          → Build the screens
        ↓
/trilogy-pixel-perfect  → Compare build vs Figma
        ↓                  Pass 1: Feature gaps → product owner
        ↓                  Pass 2: Pixel fixes → developer (iterate until 85%+)
        ↓
/trilogy-dev-handover   → Gate 4 (Code Quality)
        ↓
/trilogy-qa             → Gate 5 (includes pixel-perfect re-check)
```
