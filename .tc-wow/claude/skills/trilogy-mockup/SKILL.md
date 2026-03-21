---
name: trilogy-mockup
description: Generate UI mockups — ASCII wireframes, HTML/Tailwind prototypes, or real in-codebase Vue pages. Use when visualizing UI, creating wireframes, or exploring design variations. Triggers on: mockup, wireframe, UI sketch, ASCII diagram, design variations, mockup challenge, vue mockup.
---

# Trilogy Mockup Skill

Generate UI mockups to explore design options before implementation. Three modes: Quick (ASCII/HTML), Challenge (multi-paradigm design competition), and Vue (real in-codebase pages with Storybook-informed components).

## Three Modes

| Mode | Command | Output |
|------|---------|--------|
| **Quick** | `/trilogy-mockup` | 5-10 variations, fast exploration |
| **Challenge** | `/trilogy-mockup --challenge` | Multiple "students" design from different paradigms |
| **Vue** | `/trilogy-mockup --vue` | Real Vue pages in the codebase, routable in the app |

## When to Use

Run after `/trilogy-design` to visualize the UI before planning:
```
/trilogy-design -> /trilogy-mockup -> /speckit-plan
```

## Initial Questions (Ask Before Starting)

### Format Preference
Before generating mockups, ask the user:
```
How would you like the mockups rendered?

1. **ASCII** (Recommended for speed) - Box-drawing characters, fast iteration
2. **HTML/Tailwind** - Visual mockups, more realistic preview
```

### Design System Choice
For HTML mockups, ask:
```
Which styling approach?

1. **Use TC Portal design system** - Leverage existing components (Badge, CommonSplitPanel, etc.)
2. **Don't limit me** - Pure Tailwind, explore freely without constraints
```

If using design system, check `resources/js/Components/Common/` for available components.

### Portal Shell (HTML mockups only)
Ask:
```
Wrap mockups in the TC Portal app shell?

1. **Yes — with portal shell** (Recommended) - Skeleton sidebar + page header for framing context.
   Shows the screen in its real layout position without distracting real nav items.
2. **No — standalone** - Content area only, no sidebar chrome. Faster to generate, easier to focus
   on the feature itself.
```

**If shell selected:** Every HTML mockup page gets a **skeleton sidebar** with animated pulse
placeholders and a "FRAMING ONLY" label. This provides realistic layout context without the
distraction of real nav items — the mockup's feature area is the focus, the sidebar is just framing.

**Skeleton sidebar rules:**
- Use `animate-pulse` placeholder divs (gray-200 backgrounds) for logo, search, nav items, user profile
- One nav item should be highlighted in teal (bg-teal-50 + teal-200 pulse) to indicate "you are here"
- Include a `"Framing only"` label in the logo area (`text-[9px] text-gray-300 uppercase tracking-widest`)
- The sidebar is static — no collapse toggle, no real links, no interactivity
- Body uses `class="bg-gray-50 flex"` with the sidebar as the first child
- Main content area uses `class="flex-1 flex flex-col min-h-screen"` next to the sidebar

**Skeleton sidebar HTML pattern** (copy this structure into every shell mockup):
```html
<!-- ===== SIDEBAR (skeleton — framing only) ===== -->
<aside class="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0 h-screen sticky top-0">
    <!-- Logo skeleton -->
    <div class="px-4 py-4 border-b border-gray-100">
        <div class="flex items-center gap-2.5">
            <div class="h-8 w-8 rounded-lg bg-gray-200 animate-pulse"></div>
            <div class="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <p class="mt-2 text-[9px] text-gray-300 uppercase tracking-widest text-center">Framing only</p>
    </div>
    <!-- Search skeleton -->
    <div class="px-3 py-3">
        <div class="h-8 rounded-lg bg-gray-100 animate-pulse"></div>
    </div>
    <!-- Nav skeletons -->
    <nav class="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        <div class="flex items-center gap-2.5 px-3 py-2">
            <div class="h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
            <div class="h-3.5 w-20 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2.5 px-3 py-2">
            <div class="h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
            <div class="h-3.5 w-24 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2.5 px-3 py-2">
            <div class="h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
            <div class="h-3.5 w-16 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <!-- Active item (teal highlight — "you are here") -->
        <div class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-teal-50">
            <div class="h-4 w-4 rounded bg-teal-200 animate-pulse"></div>
            <div class="h-3.5 w-18 rounded bg-teal-200 animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2.5 px-3 py-2">
            <div class="h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
            <div class="h-3.5 w-20 rounded bg-gray-200 animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2.5 px-3 py-2">
            <div class="h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
            <div class="h-3.5 w-14 rounded bg-gray-200 animate-pulse"></div>
        </div>
    </nav>
    <!-- User profile skeleton -->
    <div class="border-t border-gray-100 px-3 py-3">
        <div class="flex items-center gap-2.5">
            <div class="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            <div class="flex-1 space-y-1.5">
                <div class="h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
                <div class="h-2.5 w-20 rounded bg-gray-100 animate-pulse"></div>
            </div>
        </div>
    </div>
</aside>
```

**Page header pattern** (inside the main content area, above the feature content):
```html
<!-- Page header with breadcrumb -->
<header class="bg-white border-b border-gray-200 px-6 py-4">
    <nav class="text-xs text-gray-400 mb-1">
        <span>Module</span> <span class="mx-1">/</span>
        <span>Section</span> <span class="mx-1">/</span>
        <span class="text-gray-700 font-medium">Current Page</span>
    </nav>
    <h1 class="text-xl font-semibold text-gray-900">Page Title</h1>
</header>
```

**Why skeleton instead of real sidebar:**
- Keeps focus on the feature being designed, not the navigation
- Avoids maintaining fake nav items that may be outdated
- Stakeholders understand it's framing context, not part of the design
- Faster to generate and consistent across all mockups

---

# Quick Mode (Default)

## Epic Detection & Routing

```bash
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | sort
```

**If spec.md exists**: Load and proceed to mockups
**If no spec.md found**: Ask user to create spec first or proceed with description

## Execution Steps

### 1. Detect Context

Check for spec.md. Epic context takes precedence.

### 2. Ask What to Mock Up (CRITICAL)

**If $ARGUMENTS is empty or unclear:**
1. Read spec.md to identify UI components
2. Present list of mockable elements (Forms, Lists/Tables, Dashboards, Modals, Navigation)
3. Ask: "Which UI elements would you like me to mock up?"

**If $ARGUMENTS specifies what to mock:** Skip the question and proceed directly.

### 3. Generate 5-10 ASCII Variations

Use box-drawing characters:
- Borders: ┌─┐│└┘├┤┬┴┼
- Shading: █▓▒░ for progress bars
- Arrows: →←↑↓
- Checkboxes: ☐ ☑ ☒

**Example - Form Layout Variations:**
```
OPTION A: Single Column
┌─────────────────────────────────┐
│ Create New Package              │
├─────────────────────────────────┤
│ Name: [___________________]     │
│ Level: [▼ Select level    ]    │
│ Start Date: [📅 Pick date  ]   │
│ [Cancel]          [Create →]   │
└─────────────────────────────────┘

OPTION B: Two Column
┌─────────────────────────────────────────┐
│ Name: [_____________]  Level: [▼     ] │
│ Start: [📅        ]   End: [📅       ] │
│                   [Cancel] [Create →]   │
└─────────────────────────────────────────┘

OPTION C: Wizard Steps
┌─────────────────────────────────┐
│ Step 1 of 3 • Basic Info        │
│ ●───────○───────○               │
├─────────────────────────────────┤
│ Package Name                    │
│ [___________________________]   │
│ [← Back]            [Next →]    │
└─────────────────────────────────┘
```

### 4. Cover Key UI Elements

Generate variations for each selected element:
- **Forms** - Input layouts, validation states, submit flows
- **Lists/Tables** - Data display, sorting, filtering
- **Navigation** - Menu structures, breadcrumbs, tabs
- **Modals/Dialogs** - Confirmation, wizards, detail views
- **Status/Progress** - Loading, empty, error, success states
- **Actions** - Buttons, dropdowns, context menus

### 5. Save to Spec Directory

Save mockups in **same directory as spec.md**:

```
.tc-docs/content/initiatives/[II]-initiative/CCC-epic-TP-XXXX/
├── spec.md
├── mockups/
│   ├── viewer-toolbar.js          (shared toolbar — navigation + Figma copy)
│   ├── index.html                 (redirect to first page)
│   ├── 01-feature-name.html       (HTML mockup pages)
│   ├── 02-another-view.html
│   ├── form-variations.txt        (5-10 options, if ASCII)
│   ├── list-variations.txt        (5-10 options, if ASCII)
│   └── summary.md                 (pros/cons)
└── plan.md (created later)
```

### Viewer Toolbar (HTML Mockups)

When generating HTML mockups, always include `viewer-toolbar.js` in each page:
```html
<script src="viewer-toolbar.js" defer></script>
```

**Generate `viewer-toolbar.js` from the template** at `references/viewer-toolbar-template.js` in this skill's directory.

**How to use the template:**
1. Read `references/viewer-toolbar-template.js`
2. Replace `{{PROJECT_TITLE}}` with the epic/feature name (e.g. `Lead Essential (LES)`)
3. Replace `{{SCREENS}}` with the screens array entries for this mockup set
4. Write the populated JS to `mockups/viewer-toolbar.js`

**Example `{{SCREENS}}` replacement:**
```js
{ id: 1, short: 'Overview', file: '01-profile-overview.html' },
{ id: 2, short: 'Timeline', file: '02-profile-timeline.html' },
{ id: 3, short: 'Create',   file: '03-create-form.html' },
```

**The toolbar provides:**
- Screen navigation buttons with keyboard shortcuts (arrows, 1-9, Esc)
- **Copy Page** `F` — captures current page to clipboard for Figma paste
- **Copy All** — wizard that walks through all pages sequentially (capture → paste → next)
- **Select** `S` — opens Figma element selector for partial captures
- Hides toolbar during capture so it doesn't appear in the Figma paste

**NEVER include `capture.js` directly in HTML files** — it auto-generates its own toolbar causing duplicate bars.

Create `index.html` as a simple redirect to the first mockup page:
```html
<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=01-first-page.html"></head></html>
```

### 6. Summarize Options

Create `summary.md` with:
- Which variation is recommended and why
- Trade-offs for each option
- Questions for stakeholder feedback

## Output Format

```markdown
## [Component Name] - [N] Variations

### Option A: [Name]
[ASCII mockup]

**Pros:** [benefits]
**Cons:** [trade-offs]

### Option B: [Name]
[ASCII mockup]

**Pros:** [benefits]
**Cons:** [trade-offs]

### Recommendation
Option [X] because [reasoning]
```

## After Mockups

1. Present variations to user
2. Ask which options they prefer
3. Note preferences in `summary.md`
4. Suggest next steps: `/speckit.clarify`, `/speckit.plan`

**Remember**: Mockups are for exploration. Generate **5-10 variations minimum** to give real choices. ASCII is fast - don't overthink it!

---

# Challenge Mode (`--challenge`)

When invoked with `--challenge`, run a structured design exploration where multiple "students" each design from a **fundamentally different UI paradigm**. Default is 4 students, but user can request more or fewer. Students can be added/removed/swapped during the challenge.

## The Students — Dynamic Selection

**Students are NOT fixed.** Each challenge generates context-appropriate students based on what's being designed. The goal is **maximum variation** — each student should produce a design that looks and feels completely different from the others.

### How to Pick Students

1. **Analyse the feature** — what is being designed? (form, dashboard, list, wizard, etc.)
2. **Pick 4 paradigms from the pool below** that will produce the most diverse outputs for this specific feature
3. **Avoid picking paradigms that would produce similar UIs** — e.g., don't pick both "Minimal SaaS" and "Clean Dashboard" for the same challenge
4. **Present the chosen students to the user** for approval before starting

### Paradigm Pool (Pick 4 — mix and match)

Pick from these paradigms, or invent new ones that fit the feature better. The key rule is: **each student must approach the UI from a fundamentally different angle**.

| Paradigm | Motto | Focus | Best For |
|----------|-------|-------|----------|
| **Minimal Zen** | "Less, but better" | Whitespace, single-action focus, progressive disclosure | Forms, create flows, settings |
| **Data Table** | "Everything is a row" | Dense tables, inline editing, bulk actions, filters | Lists, admin panels, reporting |
| **Card Canvas** | "Spatial thinking" | Cards on a canvas, drag-drop, visual grouping, Trello/Miro style | Boards, planning, categorisation |
| **Conversational** | "Just ask" | Chat-like input, natural language, AI-assisted, command palette | Search, quick create, triage |
| **Timeline** | "Everything has a story" | Chronological feed, activity stream, history-first | Audit trails, client journeys |
| **Split Panel** | "Context + detail" | Master-detail, sidebar navigation, persistent context | Profiles, case management |
| **Wizard** | "One thing at a time" | Step-by-step, guided flow, validation per step | Onboarding, complex forms |
| **Dashboard** | "See it all" | KPI tiles, charts, summary cards, at-a-glance | Overviews, management views |
| **Mobile-First** | "Thumb-friendly" | Bottom sheets, swipe actions, large touch targets, stacked layout | Field worker tools, on-the-go |
| **Spreadsheet** | "Power users welcome" | Editable grid, formulas, keyboard shortcuts, bulk paste | Data entry, financial, scheduling |
| **Visual Hierarchy** | "The pyramid speaks" | Visual metaphors, infographics, colour-coded tiers, spatial layout | Categorised data, frameworks |
| **Inbox/Triage** | "Process and move on" | Action queue, done/skip/defer, batch processing | Task lists, approvals, reviews |
| **Contextual Sidebar** | "Never leave the page" | Slide-over panels, inline expansion, no page navigation | Detail editing, linked records |
| **Gamified** | "Make it satisfying" | Progress bars, streaks, completion %, micro-celebrations | Onboarding, compliance, checklists |
| **Clinical/EHR** | "Structured capture" | SOAP notes style, structured fields, medical conventions | Healthcare forms, assessments |
| **Kanban** | "Flow through stages" | Columns per status, drag between stages, WIP limits | Workflow, status tracking |

### Naming Students

Give each student a **fun alliterative name** that matches their paradigm:
- Card Canvas → "Canvas Clara"
- Timeline → "Timeline Tess"
- Mobile-First → "Mobile Mo"
- Clinical/EHR → "Clinical Chris"
- etc.

Each student gets a unique ASCII art character, icon colour, and motto — just like the examples below.

### Example: Aged Care Needs Feature

For a feature about capturing client needs with Maslow categories, good student picks might be:

```
    ┌─────────┐          ╭━━━━━╮          ╔═══════════╗          ⚡ ⚡ ⚡
    │  ◠ ◠   │          ┃ ⊙ ⊙ ┃  ☕       ║  👓      ║         ┌─────────┐
    │   ▽    │          ┃  △  ┃           ║  ◉   ◉   ║         │  ● ●   │
    │  ╰─╯   │          ┃ ╰─╯ ┃           ║    ◇     ║         │   ◇    │
    └─────────┘          ╰━━━━━╯           ║   ═══    ║         └─────────┘
       │││                /│ │\            ╚═══════════╝         ⚡⚡⚡

  VISUAL VERA       CLINICAL CHRIS     CANVAS CLARA       MINIMAL MAYA
 "The pyramid       "Structured        "Drag, drop,       "One field,
  speaks"            capture"           done"               done"
```

| Student | Paradigm | Focus |
|---------|----------|-------|
| 1 - Visual Vera | **Visual Hierarchy** | Maslow pyramid as the UI itself, colour-coded tiers, spatial layout |
| 2 - Clinical Chris | **Clinical/EHR** | SOAP-note style, structured fields, medical conventions, assessment feel |
| 3 - Canvas Clara | **Card Canvas** | Need cards on a board, grouped by tier, drag to reorder/link services |
| 4 - Minimal Maya | **Minimal Zen** | Single-field progressive form, one question at a time, speed-first |

Notice how these 4 would produce **wildly different UIs** for the same feature — that's the goal.

### Bad Picks (Too Similar)

Don't pick paradigms that converge on similar layouts:
- "Minimal Zen" + "Conversational" → both end up as sparse single-column forms
- "Data Table" + "Spreadsheet" → both end up as grids
- "Split Panel" + "Contextual Sidebar" → both end up as master-detail
- "Dashboard" + "Visual Hierarchy" → both end up as tile/card layouts

### Student Properties

Each generated student must have:

| Property | Example | Used In |
|----------|---------|---------|
| `name` | "Canvas Clara" | Viewer header, comparison tables |
| `paradigm` | "Card Canvas" | Research focus, brief |
| `motto` | "Drag, drop, done" | Viewer subtitle |
| `focus` | "Cards on a canvas, drag-drop, visual grouping" | Brief, comparison |
| `icon_letter` | "C" | Viewer icon badge |
| `icon_bg` | "bg-amber-600" | Viewer icon colour (each student distinct) |
| `folder` | "student-1-canvas" | File system, viewer config |
| `ascii_art` | (unique character) | brief.md, comparison.md |

## Challenge Workflow

### Phase 0: Ask Preferences

Before starting the challenge, ask:

1. **Format and design system preferences** (see Initial Questions above)

2. **Confirm the screen list** — read spec.md to identify the distinct screens, then present for approval:

```
Based on the spec, I've identified these screens for each student to design:

1. Profile Overview — lead details, status, key info at a glance
2. Timeline — activity history, touchpoints, notes
3. List View — filterable table of all leads
4. Quick Create — modal for fast lead entry
5. Guided Create — multi-step wizard for full lead setup

Does this look right? Add, remove, or rename any?
```

Each student designs **all** agreed screens from their paradigm. The viewer shows screen tabs to switch between them.

3. **How many students?** — since each student designs every screen, the total mockup count is students × screens. Let the user choose:

```
How many design students? (Each designs all N screens)

1. **2 students** (2N mockups) — faster, good for focused comparison
2. **3 students** (3N mockups) — balanced coverage
3. **4 students** (4N mockups, Default) — good paradigm spread
4. **5+ students** (5N+ mockups) — maximum variation, takes longer
```

If fewer than 4, ask which students to drop from the proposed set.

4. **Present proposed students** — show the selected paradigms, names, mottos, and explain why each was chosen for this specific feature. Ask for approval:

```
Here are the 4 design students I've picked for [Feature Name]:

| # | Student | Paradigm | Why This Approach |
|---|---------|----------|-------------------|
| 1 | [Name] | [Paradigm] | [1-sentence reason this paradigm fits] |
| 2 | [Name] | [Paradigm] | [1-sentence reason] |
| 3 | [Name] | [Paradigm] | [1-sentence reason] |
| 4 | [Name] | [Paradigm] | [1-sentence reason] |

These paradigms should produce very different designs. Want to swap any?
```

### Phase 0.5: Research (Optional)

If the user asks for research before mockups (e.g. "research first", "look at competitors"), or the feature domain is unfamiliar, run a research phase before generating HTML:

1. **For each student**, use WebSearch to find 3-5 UI patterns from their paradigm applied to similar features
2. Document findings in a shared `research.md` in the challenge root (NOT per-student)
3. Present a summary of discovered patterns before proceeding to mockups

This is **optional** — skip by default and go straight to mockups. The comparison.md written after mockups captures the pattern analysis. Research is only useful when the design space is genuinely unfamiliar and the students need real-world inspiration.

### Phase 1: Create Brief

Generate a `brief.md` in `mockups/challenge/`:

```markdown
# Design Challenge Brief: [Feature Name]

## Challenge Overview
[1-2 sentences about what to design]

## Feature Summary
[Key functionality from spec.md]

## User Stories to Address
[List relevant user stories]

## Key Interactions to Design
1. [Interaction 1]
2. [Interaction 2]
...

## Constraints
- [Technical or UX constraints]

## Evaluation Criteria
1. **Familiarity** - How recognizable are the patterns?
2. **Speed** - How fast can users complete tasks?
3. **Clarity** - Is the status/action obvious?
4. **Scalability** - Does it work for 5 items or 50?

## Students
[Table of students with themes]

## Deliverables Per Student
1. HTML mockup screens (one per agreed screen)
2. `comparison.md` (shared, in challenge root) - Pattern analysis + cherry-pick recommendations
```

### Phase 2: Run Each Student

For each student, create their folder and outputs:

**Single-screen challenge (A/B variations):**
```
mockups/challenge/
├── brief.md
├── index.html              # Interactive viewer
├── student-1-{paradigm}/
│   ├── viewer-toolbar.js   # Per-student toolbar (navigation + Figma copy)
│   ├── index.html          # Redirect to first variation
│   ├── mockup-variation-a.html
│   └── mockup-variation-b.html
├── student-2-{paradigm}/ ...
├── student-N-{paradigm}/ ...  # One folder per student (any number)
├── unified/
│   ├── viewer-toolbar.js   # Unified toolbar
│   ├── index.html          # Redirect to first screen
│   ├── 01-overview.html
│   ├── 02-timeline.html
│   └── ...
└── comparison.md
```

**For each student:**

1. **HTML Mockups** - Generate Tailwind HTML pages for each agreed screen
   - Apply the student's design paradigm faithfully
   - Use existing TC Portal components where applicable
   - Make it visually realistic and interactive-looking

2. **Viewer Toolbar (CRITICAL)** - Every student folder gets its own `viewer-toolbar.js` + `index.html`:
   - Generate `viewer-toolbar.js` from the template at `references/viewer-toolbar-template.js`
   - Replace `{{PROJECT_TITLE}}` with `"{Feature Name} — {Student Name}"` (e.g. `"Needs V2 — Visual Vera"`)
   - Replace `{{SCREENS}}` with that student's screen files
   - Write to `student-N-{name}/viewer-toolbar.js`
   - Create `student-N-{name}/index.html` as redirect to first screen
   - **Every HTML mockup page MUST include `<script src="viewer-toolbar.js" defer></script>` before `</body>`**
   - This enables standalone viewing of each student's mockups with screen navigation + Figma capture (`F` key)

   The same applies to the `unified/` folder — it gets its own `viewer-toolbar.js` and `index.html`.

   **Why per-folder toolbars:** The challenge `index.html` viewer loads mockups in iframes, which blocks
   `html2canvas` cross-origin capture. By embedding the toolbar directly in each page, Figma capture works
   whether viewing via the challenge viewer, standalone, or deployed to Vercel/similar hosting.

### Phase 3: Generate Interactive Viewer

**ALWAYS generate `index.html`** using the template at `references/challenge-viewer-template.html` as the foundation.

**How to use the template:**
1. Read `references/challenge-viewer-template.html` from this skill's directory
2. Replace all `{{PLACEHOLDER}}` values with actual student data
3. Generate vote cards from the cherry-pick recommendations in `comparison.md`
4. Write the populated HTML to `mockups/challenge/index.html`

**Template placeholders to replace:**

| Placeholder | Example Value |
|-------------|---------------|
| `{{FEATURE_NAME}}` | `Calls Uplift` |
| `{{STUDENT_N_NAME}}` | `Linear Lisa` |
| `{{STUDENT_N_MOTTO}}` | `"Less, but better"` |
| `{{STUDENT_N_FOCUS}}` | `Clean minimal UI, command palette, keyboard shortcuts` |
| `{{STUDENT_N_ICON}}` | `L` |
| `{{STUDENT_N_ICON_BG}}` | `bg-purple-600` |
| `{{STUDENT_N_FOLDER}}` | `student-1-linear` |
| `{{VAR_A_LABEL}}` / `{{VAR_B_LABEL}}` | `Triage View` / `Split View` |
| `{{VOTE_CARDS}}` | Generated from comparison.md cherry-pick recommendations |
| `{{STUDENT_BUTTONS}}` | One `<button>` per student in the top bar |

**Multi-screen mode variations config:**

For multi-screen challenges, replace the `variations` object with screen entries:
```js
variations: {
  overview:  { label: 'Overview',  file: 'student-1-{paradigm}/01-overview.html' },
  timeline:  { label: 'Timeline',  file: 'student-1-{paradigm}/02-timeline.html' },
  listview:  { label: 'List View', file: 'student-1-{paradigm}/03-list-view.html' },
  create:    { label: 'Create',    file: 'student-1-{paradigm}/04-create-form.html' }
}
```

The viewer auto-detects multi-screen mode (>2 variations or keys longer than 1 char) and:
- Shows full screen labels instead of A/B letters
- Changes the label from "Variation:" to "Screen:"
- Uses wider pill-style buttons for screen names

**Vote cards:** For each pattern in the "Cherry-Pick Recommendations > Adopt" table, generate a vote card with:
- Source student badge(s) (colour-coded using each student's `icon_bg` colour)
- Pattern name as `<h3>`
- One-line description as `<p>`
- `onclick="toggleVote(this, 'pattern-id')"` for selection

**The viewer includes:**
- **Top bar** with TC logo, feature name, student selector buttons (1-N)
- **Student info bar** with icon, name, motto, focus description
- **Variation/Screen buttons** for switching between A/B variations or multi-screen pages
- **Copy to Figma** button (or press `F`) — opens current mockup directly for clean Figma capture
- **Collapsible panel** - Press Esc or click toggle to hide/show
- **Keyboard shortcuts** - 1-N students, screen buttons, F figma, Esc close
- **Comparison section** (below the fold) - loads and renders `comparison.md` in light theme
- **Voting section** - clickable pattern cards from cherry-pick recommendations
- **Feedback textarea** - free-text input for additional direction
- **Copy to clipboard** button - exports selections as markdown for pasting back into conversation

**TC Design System colours** are configured via Tailwind CDN override:
- Teal 700: `#007F7E` (primary)
- Teal 500: `#43C0BE` (accent)
- Primary Blue 700: `#2C4C79`
- Active buttons use `bg-teal-700` with teal glow ring

**Serving the viewer:**
```bash
cd mockups/challenge && npx serve .
```

### Phase 4: Synthesize & Compare

Create `comparison.md` with:

1. **Student ASCII Art Header** (the fun character drawings)
2. **Pattern Comparison Tables** - Side-by-side for each UI element
3. **Trade-off Matrix** - Star ratings across criteria
4. **Recommended Adoption** - Cherry-pick best patterns from each
5. **Implementation Priority** - Phase 1/2/3 breakdown

### Phase 5: Capture Preferences & Generate Unified Design

After generating all 4 student mockups, the **viewer itself handles feedback collection**. The comparison and voting sections are built into `index.html` below the fold.

**Present the viewer to the user:**

```markdown
## Design Challenge Complete!

All students have submitted their mockups. Browse them here:

```bash
cd mockups/challenge && npx serve .
```

The viewer includes:
- **Mockups per student** — switch students with number keys, screens with buttons
- **Comparison analysis** — scroll down below the mockups
- **Pattern voting** — click cards to select which patterns you want in the unified design
- **Feedback box** — add any comments or direction
- **Copy to clipboard** — paste your selections back here and I'll generate the unified mockup
```

**Wait for the user to paste their selections** before generating `unified/mockup.html`.

When the user pastes their clipboard export (formatted as "Design Challenge Selections" with adopted patterns and feedback), use it to:
1. Apply their selected patterns to a unified design
2. Incorporate their feedback text
3. Generate `unified/mockup.html` combining the winning patterns
4. Update `comparison.md` with a "Final Selection" section documenting what was chosen and why

## Example Comparison Table

```markdown
### Need Capture Pattern

| Student | Pattern | Pros | Cons |
|---------|---------|------|------|
| **Visual Vera** | Pyramid picker | Intuitive categorisation | Takes screen space |
| **Clinical Chris** | Structured form | Familiar to clinicians | Feels like paperwork |
| **Canvas Clara** | Drag-to-board | Spatial organisation | Learning curve |
| **Minimal Maya** | Progressive form | Fastest capture | Less context visible |

**Winner: [Student]** - [Reasoning]
```

## Challenge Tips

- **Use parallel agents** to generate all students simultaneously
- **Apply Jakob's Law** - Use familiar patterns users already know
- **Be opinionated** - Each student should have a strong point of view
- **Make it fun** - The student personas add personality to the process
- **Cherry-pick** - The goal is to find the best patterns, not pick one winner
- **HTML is default** - Visual mockups are more impactful than ASCII alone
- **Respect design system choice** - If user says "don't limit me", go wild with Tailwind

## Mid-Challenge Changes

Users can request changes during the challenge:
- **"Remove student X"** — delete the student folder, regenerate viewer + comparison without them
- **"Add a new student"** — pick a new paradigm, generate mockups, add to viewer + comparison
- **"Swap student X for Y"** — remove old, add new, update viewer + comparison
- Always redeploy (Vercel or re-serve) after changes so the URL stays current

## After Challenge

1. Serve `index.html` via `npx serve .` from the challenge folder (or deploy to Vercel)
2. User browses mockups (number keys for students, buttons for screens)
3. User scrolls down to comparison analysis and voting section
4. User clicks pattern cards to vote, adds feedback, copies selections to clipboard
5. User pastes selections back into conversation
6. Generate `unified/mockup.html` based on their picks
7. Proceed to `/speckit-plan` with clear UI direction

**Key principle:** The viewer is the decision-making tool. All comparison, voting, and feedback happens _inside_ the HTML — not as conversation questions. This lets stakeholders review asynchronously and share the viewer with others.

## Push to Figma (`--figma`)

After generating challenge mockups (or when the user asks to push mockups to Figma), automatically capture all HTML pages to a Figma file using Chrome DevTools MCP + Figma MCP.

### Prerequisites

- Chrome DevTools MCP server available
- Figma MCP server available (`mcp__figma__generate_figma_design`)
- HTML mockup files exist in the challenge directory

### Execution Steps

#### 1. Inject capture.js into all HTML files

Add the Figma capture script before `</body>` in every `.html` mockup file:

```bash
cd mockups/challenge
for f in student-*/0*.html unified/0*.html; do
  sed -i '' 's|</body>|<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>\n</body>|' "$f"
done
```

#### 2. Start a local static server

```bash
cd mockups/challenge && npx serve . -l 3848
```

Verify it serves correctly: `curl -sL http://localhost:3848/student-1-linear/01-... | grep -c "capture.js"`

#### 3. Ask Figma target

Ask the user:
```
Which Figma file should I push the mockups to?
1. **Same file** — Add to existing file (provide file key)
2. **New file** — Create a new Figma file
```

If existing file: extract `fileKey` from the Figma URL (e.g., `figma.com/design/{fileKey}/...`).

#### 4. Sequential capture loop

For each HTML file, execute this 4-step cycle:

1. **Generate capture ID**: Call `mcp__figma__generate_figma_design` with `outputMode: "existingFile"` + `fileKey`
2. **Navigate browser**: Call `mcp__chrome-devtools__navigate_page` to `http://localhost:3848/{path}#figmacapture={id}&figmaendpoint=...&figmadelay=3000`
3. **Wait**: `sleep 8` (3s figmadelay + 5s buffer for capture submission)
4. **Poll**: Call `mcp__figma__generate_figma_design` with `captureId` — confirm `completed`

**Capture order**: student-1 (01-N) → student-2 (01-N) → ... → student-N (01-N) → unified (01-N)

#### 5. Handle browser errors

If Chrome DevTools returns "page closed" or "browser already running":
```bash
rm -f "$HOME/.cache/chrome-devtools-mcp/chrome-profile/SingletonLock"
```
Then call `mcp__chrome-devtools__list_pages` to re-establish the session, and resume from the failed page.

#### 6. Report

After all pages are captured, report:
```
## Mockups Pushed to Figma

**File:** https://www.figma.com/design/{fileKey}

| Group | Screens | Figma Nodes |
|-------|---------|-------------|
| Student 1 — {Student 1 Name} | N | {first}-2 → {last}-2 |
| Student 2 — {Student 2 Name} | N | ... |
| Student 3 — {Student 3 Name} | N | ... |
| Student 4 — {Student 4 Name} | N | ... |
| Unified | N | ... |

Each capture creates a separate page in the file.
Rename/organize pages within Figma to group by student or screen.
```

### Key Rules

- **Always inject capture.js** before serving — without it, the Figma hash params do nothing
- **Sequential only** — one page at a time via Chrome DevTools single-tab automation
- **8-second wait** between navigate and poll — shorter waits cause pending/failed captures
- **figmadelay=3000** in the hash URL — gives complex pages time to render before capture
- **Track progress** with TodoWrite — one todo per student group
- **Don't parallelize** — Chrome DevTools MCP uses a single browser tab; parallel navigation causes "page closed" errors
- **Clean up server** when done — kill the `npx serve` process after all captures complete

---

# In-Codebase Vue Mode (`--vue`)

Generate real routable Vue pages using actual Common components, viewable in the running app behind developer-only access. Unlike Quick/Challenge modes that produce standalone HTML, this mode produces production-grade Vue pages with real component usage informed by Storybook.

## When to Use

- After design direction is established (post-Challenge or post-Quick approval)
- When you need to validate component composition in the real app shell
- When stakeholders need to see the design in the actual portal context
- When testing responsive behaviour with real Tailwind config tokens

## Advantages Over HTML Mockups

- Uses the real `tailwind.config.js` — custom tokens like `rounded-input`, `text-primary` work
- Real Common components with correct props, slots, and variants
- Real AppLayout sidebar, header, and navigation context
- Viewable at the actual app URL (e.g., `https://tc-portal.test/mockups/lead-profile`)
- Runs with `npm run dev` hot-reload — iterate fast on mockup changes

## Prerequisites

- App must be running (`composer run dev` or `npm run dev` for HMR)
- User must have `is_developer = true` on their account

## Initial Questions

Before generating, ask:

```
Which screens should I mock up? (I'll create one Vue page per screen)

Based on the spec, I've identified these:
1. Profile Overview
2. Timeline
3. List View
4. Create Form

Add, remove, or rename any?
```

## Execution Steps

### 1. Detect Context & Load References

Check for spec.md — same as Quick mode.

**Then load mandatory references (CRITICAL — do this BEFORE generating any code):**
- Read `references/component-map.md` — full HTML-to-component mapping
- Read `references/design-system-rules.md` — token definitions, spacing, typography

### 2. Component Research (Per Screen)

For each screen to be mocked up:

1. **Identify which Common components are needed** from the screen description
2. **Read each component's Storybook files** to understand the correct API:
   - `stories/Common/{ComponentName}.stories.js` — props, variants, args, template patterns
   - `stories/Common/{ComponentName}.mdx` — usage docs, slots, guidelines

   For example, if the screen needs badges, tabs, and a definition list:
   ```
   Read: stories/Common/CommonBadge.stories.js
   Read: stories/Common/CommonBadge.mdx
   Read: stories/Common/CommonTabs.stories.js
   Read: stories/Common/CommonTabs.mdx
   Read: stories/Common/CommonDefinitionList.stories.js
   Read: stories/Common/CommonDefinitionList.mdx
   ```

3. **Check sibling pages** in `resources/js/Pages/` for similar patterns:
   - For a table view → look at an existing `Index.vue`
   - For a detail view → look at an existing `Show.vue`
   - For a form → look at an existing `Create.vue`
   - Match their conventions exactly

### 3. Generate Route File

Create `routes/web/mockups.php` with:

```php
<?php

use App\Http\Middleware\EnsureDeveloperAccess;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Mockup Routes (Developer-only)
|--------------------------------------------------------------------------
|
| Routes for in-codebase Vue mockups (design exploration).
| Protected by EnsureDeveloperAccess middleware.
| Delete this file and its references when mockups are no longer needed.
|
*/

// MOCKUP: {FeatureName} — remove this block when done
Route::prefix('mockups/{feature-kebab}')
    ->middleware(['web.authenticated', EnsureDeveloperAccess::class])
    ->name('mockups.{feature-kebab}.')
    ->group(function () {
        Route::get('/', [MockupController::class, 'index'])->name('index');
        Route::get('/{screen}', [MockupController::class, 'screen'])->name('screen');
    });
```

Then add a `require` line at the bottom of `routes/web.php`:

```php
/**
 * Mockup Routes (Developer-only, temporary)
 * MOCKUP: Delete this require and routes/web/mockups.php when mockups are no longer needed.
 */
require __DIR__.'/web/mockups.php';
```

### 4. Generate Controller

Create `app/Http/Controllers/Mockup/Mockup{Feature}Controller.php`:

- One controller per feature mockup set
- Each method returns `Inertia::render()` with **inline fake data** — no real DB queries
- Use private helper methods to share common fake data across screens
- Keep fake data realistic (plausible names, dates, statuses)

```php
<?php

namespace App\Http\Controllers\Mockup;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

// MOCKUP: Delete this controller when mockups are no longer needed
class MockupLeadProfileController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Mockups/LeadProfile/Index', [
            'screens' => [
                ['name' => 'Profile Overview', 'route' => 'mockups.lead-profile.profile-overview'],
                ['name' => 'Timeline', 'route' => 'mockups.lead-profile.timeline'],
            ],
        ]);
    }

    public function profileOverview(): Response
    {
        return Inertia::render('Mockups/LeadProfile/ProfileOverview', [
            'lead' => $this->fakeLead(),
        ]);
    }

    private function fakeLead(): array
    {
        return [
            'id' => 1,
            'full_name' => 'Margaret Thompson',
            'preferred_name' => 'Maggie',
            'status' => 'active',
            'date_of_birth' => '1942-03-15',
            'phone' => '0412 345 678',
            'email' => 'margaret.t@example.com',
        ];
    }
}
```

### 5. Generate Vue Pages

Create pages in `resources/js/Pages/Mockups/{FeatureName}/`:

**Index.vue** — gallery page with links to all screens + warning alert:

```vue
<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import CommonContent from '@/Components/Common/CommonContent.vue';
import CommonHeader from '@/Components/Common/CommonHeader.vue';
import CommonCard from '@/Components/Common/CommonCard.vue';
import CommonButton from '@/Components/Common/CommonButton.vue';
import CommonAlert from '@/Components/Common/CommonAlert.vue';
import { route } from 'ziggy-js';

const title = 'Mockups: {FeatureName}';

defineOptions({
    layout: (h: any, page: any) => h(AppLayout, { title }, () => page),
});

interface Screen {
    name: string;
    route: string;
}

interface Props {
    screens: Screen[];
}

defineProps<Props>();
</script>

<template>
    <!-- MOCKUP: This page is a design mockup index. Delete when done. -->
    <CommonContent>
        <template #header>
            <CommonHeader :title="title" subtitle="Design exploration mockups" />
        </template>

        <CommonAlert type="warning" title="Mockup Pages">
            These pages are temporary design mockups using fake data.
            Developer access only.
        </CommonAlert>

        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CommonCard v-for="screen in screens" :key="screen.route">
                <h3 class="text-lg font-semibold text-gray-900">{{ screen.name }}</h3>
                <div class="mt-4">
                    <CommonButton
                        :label="'View ' + screen.name"
                        :href="route(screen.route)"
                        variant="outline"
                    />
                </div>
            </CommonCard>
        </div>
    </CommonContent>
</template>
```

**Screen pages** — follow the standard Inertia page pattern exactly:

- `<script setup lang="ts">` with explicit imports
- `defineOptions` with `AppLayout`
- Typed `Props` interface
- `CommonContent` + `CommonHeader` shell
- Real Common components with correct props (verified against Storybook)
- `<!-- MOCKUP: ... -->` comment at top of template
- `TODO` comments only where backend wiring would differ

### 6. Post-Generation Verification

For each generated Vue mockup page, verify:
- All imports resolve to real files in `resources/js/Components/Common/`
- Props match the component's actual API (verified against `.stories.js`)
- Slot names match the component's actual slots (verified against `.stories.js`/`.mdx`)
- Colour values use design system tokens, not arbitrary hex colours
- Spacing follows `design-system-rules.md` patterns
- `<script setup lang="ts">` with typed Props interface
- No `any` types (except the established `layout: (h: any, page: any)` pattern)

### 7. Report URLs & Cleanup Instructions

Use the `get-absolute-url` Boost tool to generate the correct app URL, then report:

```
## In-Codebase Vue Mockups Generated

**Index:** {app-url}/mockups/{feature-kebab}
**Screens:**
- Profile Overview: {app-url}/mockups/{feature-kebab}/profile-overview
- Timeline: {app-url}/mockups/{feature-kebab}/timeline

**Files created:**
- `routes/web/mockups.php`
- `app/Http/Controllers/Mockup/Mockup{Feature}Controller.php`
- `resources/js/Pages/Mockups/{Feature}/Index.vue`
- `resources/js/Pages/Mockups/{Feature}/{Screen}.vue` (per screen)

**Run:** `npm run dev` for hot-reload, then visit the URLs above.

**Cleanup:** When done, delete the files above + remove the `require` line
from `routes/web.php`. All mockup artifacts are marked with `// MOCKUP:` comments.
```

## Cleanup

All mockup artifacts are isolated and marked with `// MOCKUP:` for easy grep:

| Artifact | Location | Action |
|----------|----------|--------|
| Vue pages | `resources/js/Pages/Mockups/{Feature}/` | Delete directory |
| Controller | `app/Http/Controllers/Mockup/` | Delete file |
| Routes | `routes/web/mockups.php` | Delete file |
| Route require | `routes/web.php` | Remove require line |

The skill should offer to clean up when asked:

```
Want me to clean up the mockup files? I'll remove:
- resources/js/Pages/Mockups/{Feature}/ (N files)
- app/Http/Controllers/Mockup/Mockup{Feature}Controller.php
- routes/web/mockups.php
- The require line in routes/web.php
```

## Key Rules

- **Always read Storybook files** before generating — never guess component APIs
- **Always read component-map.md and design-system-rules.md** first
- **Always use real Common components** — never approximate with raw HTML/Tailwind
- **Fake data must be realistic** — plausible names, dates, statuses
- **Never query the database** — all data is inline in the controller
- **One controller per feature** — not one per screen
- **Index page always has a warning alert** — makes it obvious these are mockups
- **Comment all mockup artifacts** with `// MOCKUP:` prefix for grep cleanup
- **Mockup files should NOT be gitignored** — they may need team review on a branch
- **Remove before merge** — Gate 4 checklist should catch leftover mockup files

---

# Vue Stub Generation (Post-Approval)

After mockups are approved (either Quick or Challenge mode), generate Vue implementation stubs that use **real TC Portal Common components** instead of raw Tailwind HTML. This bridges the gap between design exploration and implementation.

> **Note:** If you used `--vue` mode, stubs are unnecessary. The mockup pages already use real Common components with correct props and can be moved directly to their final `Pages/` location. Just swap the fake controller data for real queries and update the route.

## When to Run

- User says "generate vue stubs", "convert to vue", "make vue files", or similar
- After picking a winner from Quick mode variations
- After generating `unified/mockup.html` in Challenge mode
- The skill can prompt: "Want me to generate Vue stubs using real Common components?"

## How It Works

1. **Read the component map** at `references/component-map.md` in this skill's directory
2. **Read the approved HTML mockup** (the one the user selected or the unified design)
3. **Translate HTML patterns to Common components** using the mapping reference:
   - `<div class="rounded-lg border bg-white shadow-sm">` → `<CommonCard>`
   - `<label>` + `<input>` → `<CommonFormField>` + `<CommonInput>`
   - `<select>` → `<CommonFormField>` + `<CommonSelectMenu>`
   - `<table>` with filters/sorting → `<CommonTable>`
   - Status chips → `<CommonBadge>`
   - Buttons → `<CommonButton>` with correct `variant`/`actionVariant`
   - Tabs → `<CommonTabs>`
   - Step wizards → `<CommonStepNavigation>`
   - And so on — the full mapping is in `component-map.md`
4. **Generate `.vue` stub files** with:
   - `<script setup lang="ts">` with correct imports
   - Typed `Props` interface with placeholder types
   - `defineOptions` layout wrapping (`AppLayout`)
   - `CommonContent` + `CommonHeader` page shell
   - Real Common components in the template with prop bindings
   - `useForm()` wiring for form pages
   - `TODO` comments where backend data/routes need to be connected

## Output Structure

Save stubs alongside the mockups:

```
mockups/
├── 01-profile-overview.html      ← existing HTML mockup
├── vue-stubs/
│   ├── README.md                 ← what each stub is, where to copy it
│   ├── ProfileOverview.vue       ← stub using real components
│   ├── ListView.vue              ← stub using real components
│   └── CreateForm.vue            ← stub using real components
```

## README.md Template

```markdown
# Vue Implementation Stubs

Generated from approved mockups. These are **starting points** — they use real
Common components with correct imports and prop shapes, but have placeholder
data and no backend wiring.

## How to Use

1. Copy stubs into `resources/js/Pages/[Feature]/`
2. Replace `TODO` comments with real route names and server props
3. Wire up `useForm()` with actual field names from your Data class
4. Connect to real controller routes

## Files

| Stub | Based On | Target Location |
|---|---|---|
| `ProfileOverview.vue` | `01-profile-overview.html` | `Pages/Staff/Leads/Show.vue` |
| `ListView.vue` | `09-list-view.html` | `Pages/Staff/Leads/Index.vue` |
```

## Example Transformation

**HTML mockup (raw Tailwind):**
```html
<div class="rounded-lg border border-gray-400/40 bg-white p-4">
  <h3 class="text-xl font-semibold">Personal Details</h3>
  <div class="mt-4 space-y-3">
    <label class="text-sm font-medium">First Name</label>
    <input type="text" class="rounded-input border px-3 py-2 w-full" value="Margaret">
  </div>
</div>
```

**Vue stub (real components):**
```vue
<CommonCard>
    <template #header>
        <CommonHeader title="Personal Details" variant="card" />
    </template>

    <CommonForm :form="form" @submit="submit">
        <CommonFormField name="first_name" label="First Name" required>
            <CommonInput v-model="form.first_name" />
        </CommonFormField>
    </CommonForm>
</CommonCard>
```

## Key Rules

- **Always check `component-map.md`** before translating — don't guess component APIs
- **Match existing page patterns** — look at sibling pages in `resources/js/Pages/` for conventions
- **Use Iconify names** for icons — `heroicons:user`, `heroicons:check-circle`, etc. via `CommonIcon`
- **Keep stubs simple** — placeholder data, `TODO` comments for backend wiring, no over-engineering
- **One stub per screen** — each HTML mockup page becomes one `.vue` stub
