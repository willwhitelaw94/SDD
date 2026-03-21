---
name: trilogy-ux
description: >-
  Create interactive stakeholder journey maps for a feature. Maps user experience
  through phases with touchpoints, screens, emotions, and system responses per
  stakeholder. Outputs a journey.md page in tc-docs using the JourneyMap component.
  Triggers on: ux journey, user journey, stakeholder journey, journey map,
  user flow ux, experience map, touchpoint map.
metadata:
  version: 1.0.0
  type: agent
---

# Trilogy UX — Stakeholder Journey Maps

Create interactive journey maps that show how each stakeholder experiences a feature — what they do, which screens they use, how the system responds, and how they feel at each step. Maps are positioned in the broader product lifecycle context.

## Purpose

This skill:
1. **Reads** spec.md and design.md to understand the feature
2. **Identifies** stakeholders involved and their roles in the feature
3. **Maps** the journey per stakeholder: phases → touchpoints → screens → emotions
4. **Generates** an interactive journey map page in tc-docs using the `::journey-map` MDC component
5. **Positions** the feature within the broader customer lifecycle (from customer-journey.md)

## When to Use

```bash
/trilogy-ux                              # Auto-detect feature, map all stakeholders
/trilogy-ux "lead intake"                # Specify the feature/flow to map
/trilogy-ux --stakeholder "Sales Staff"  # Focus on one stakeholder's journey
```

Run this skill **after** spec.md exists and ideally after `/trilogy-design` (design.md exists).

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| spec.md | Yes | Initiative folder |
| design.md | Recommended | Initiative folder (from `/trilogy-design`) |
| customer-journey.md | Recommended | `.tc-docs/content/context/customer-journey.md` |
| Persona files | Recommended | `.tc-docs/content/context/personas/` |
| JourneyMap.vue | Auto-created | `.tc-docs/app/components/content/JourneyMap.vue` |

## Output

- **`journey.md`** in the initiative folder — interactive journey map page using `::journey-map` MDC
- **JourneyMap.vue** component (created once, reused across all journey maps)

---

## Execution Flow

### Step 1: Detect Context

Same pattern as other skills — find the initiative folder:

```bash
git branch --show-current
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | sort
```

### Step 2: Load Feature Context

Read these files to understand the feature:

```
1. Read spec.md — user stories, flows, stakeholders mentioned, acceptance criteria
2. Read design.md (if exists) — user research, design principles, edge cases, personas
3. Read customer-journey.md — the 7-stage macro lifecycle (Lead → Assessment → Package → Onboarding → Ongoing → Reviews)
4. Read relevant persona files from .tc-docs/content/context/personas/
```

Extract:
- **Stakeholders** involved in this feature (roles that interact with it)
- **Entry points** — how each stakeholder arrives at this feature
- **Core flow** — the step-by-step journey through the feature
- **Exit points** — what happens after the feature interaction
- **Lifecycle position** — where this feature sits in the macro customer journey

### Step 3: Identify Stakeholders

Present the identified stakeholders for confirmation:

```
Based on the spec and design, these stakeholders interact with this feature:

1. **Sales Staff** — Creates and manages leads
2. **Participant** — Receives care through the converted lead
3. **Care Coordinator** — Takes over after lead conversion

Should I map all three, or focus on specific ones?
```

If `--stakeholder` flag was provided, skip this question and map only that stakeholder.

### Step 4: Map Journey Phases

For each stakeholder, map their journey through the feature:

**Phase structure:**
```
Phase → Touchpoints → Screens → System Responses → Emotions
```

**Standard phase types to consider:**
- **Awareness** — How does the stakeholder first encounter this feature?
- **Entry** — What triggers them to start using it?
- **Core Task** — The main interaction flow (may span multiple screens)
- **Decision Points** — Where do they make choices?
- **Completion** — How do they know they're done?
- **Follow-up** — What happens next? Handoff to another stakeholder?

**For each touchpoint within a phase, capture:**

| Field | Description | Example |
|-------|-------------|---------|
| `action` | What the user does | "Clicks 'New Lead' button" |
| `screen` | Which screen/component | "Staff Leads Index" |
| `systemResponse` | What the system does | "Opens create form modal" |
| `emotion` | How the user feels | `neutral`, `positive`, `friction`, `delight` |
| `notes` | Context or edge cases | "Optional — can also create from sidebar" |
| `mockupLink` | Link to mockup screen | "/mockups/lead-profile/create" |

**Emotion guidelines:**
- `positive` — Task is easy, expected, satisfying
- `neutral` — Routine, neither good nor bad
- `friction` — Confusing, slow, frustrating, error-prone
- `delight` — Surprisingly good, exceeds expectations

### Step 5: Check for JourneyMap Component

```bash
ls .tc-docs/app/components/content/JourneyMap.vue 2>/dev/null
```

**If the component doesn't exist**, create it (see Component Specification below).
**If it exists**, proceed to content generation.

### Step 6: Generate Journey Content Page

Create `journey.md` in the initiative folder:

```
.tc-docs/content/initiatives/{initiative}/{epic}/
├── spec.md
├── design.md
├── journey.md          ← THIS FILE
├── mockups/
└── plan.md
```

**Content structure:**

```markdown
---
title: "[Feature Name] — User Journey"
description: "Stakeholder journey maps for [feature]"
---

# [Feature Name] — User Journey

> How each stakeholder experiences [feature], from first touch to completion.

## Lifecycle Position

This feature sits in the **[Stage]** phase of the customer lifecycle:

::mermaid
flowchart LR
    A[Lead] --> B[Assessment] --> C[Package Setup] --> D[Onboarding] --> E[Ongoing Care] --> F[Reviews]
    style B fill:#D5F1F0,stroke:#007F7E,stroke-width:2px
::

---

## Journey Maps

::journey-map
---
title: "[Feature Name]"
stakeholders:
  - "Sales Staff"
  - "Participant"
  - "Care Coordinator"
phases:
  - id: awareness
    label: "Awareness"
    icon: "🔍"
    color: "#EFF6FF"
    darkColor: "rgba(59, 130, 246, 0.15)"
    touchpoints:
      - action: "Receives referral via phone/email"
        screen: "External (phone/email)"
        systemResponse: "N/A — external channel"
        emotion: "neutral"
        stakeholder: "Sales Staff"
        notes: "Entry point varies: phone, email, website form"
  - id: capture
    label: "Capture"
    icon: "📝"
    color: "#D5F1F0"
    darkColor: "rgba(0, 127, 126, 0.15)"
    touchpoints:
      - action: "Clicks 'New Lead'"
        screen: "Staff Leads Index"
        systemResponse: "Opens create form"
        emotion: "neutral"
        stakeholder: "Sales Staff"
        mockupLink: "/mockups/lead-profile/create"
      - action: "Fills in basic details"
        screen: "Create Lead Form"
        systemResponse: "Validates fields, auto-saves"
        emotion: "positive"
        stakeholder: "Sales Staff"
        notes: "Minimal fields to reduce friction"
  - id: nurture
    label: "Nurture"
    icon: "🌱"
    color: "#FEF3C7"
    darkColor: "rgba(245, 158, 11, 0.15)"
    touchpoints:
      - action: "Views lead timeline"
        screen: "Lead Profile — Timeline"
        systemResponse: "Shows activity history"
        emotion: "positive"
        stakeholder: "Sales Staff"
        mockupLink: "/mockups/lead-profile/timeline"
  # ... more phases
---
::

---

## Friction Points

| Phase | Stakeholder | Friction | Severity | Mitigation |
|-------|-------------|----------|----------|------------|
| Capture | Sales Staff | Too many required fields | Medium | Reduce to name + phone only |
| ... | ... | ... | ... | ... |

## Delight Moments

| Phase | Stakeholder | Delight | Why It Matters |
|-------|-------------|---------|----------------|
| Capture | Sales Staff | Auto-duplicate detection | Prevents wasted effort |
| ... | ... | ... | ... |

## Cross-Stakeholder Handoffs

| From | To | Trigger | What Transfers |
|------|-------|---------|----------------|
| Sales Staff | Care Coordinator | Lead converted to client | All lead data + notes + timeline |
| ... | ... | ... | ... |
```

### Step 7: Generate Persona Journey Pages (Optional)

If the user wants per-stakeholder views in the persona directory:

```
.tc-docs/content/context/personas/care-coordinator/
├── 1.overview.md
├── shadowing/
└── journey-lead-intake.md    ← NEW (per-feature journey for this persona)
```

These are simpler — single-stakeholder filtered views using the same `::journey-map` component with a `stakeholder` filter prop.

### Step 8: Report Completion

```
## UX Journey Maps Generated

**Feature**: [Name]
**Stakeholders Mapped**: N
**Phases**: N
**Touchpoints**: N total (N per stakeholder avg)

**Files Created**:
- journey.md (interactive journey map)
- JourneyMap.vue (component — if newly created)

**Friction Points Identified**: N
**Delight Moments Identified**: N
**Cross-Stakeholder Handoffs**: N

**View**: Run `npm run dev` in `.tc-docs/` and navigate to the initiative page.

**Next Steps**:
- Review friction points with stakeholders
- Update design.md with UX insights
- Run /trilogy-clarify design to refine based on journey findings
- Proceed to /trilogy-mockup to visualize the screens
```

---

## JourneyMap.vue — Component Specification

**Location:** `.tc-docs/app/components/content/JourneyMap.vue`

This component is modelled on `WorkflowMap.vue` but is **data-driven** (accepts YAML data via MDC slot) rather than hardcoded.

### Data Model

```typescript
interface JourneyPhase {
  id: string
  label: string
  icon: string
  color: string              // light mode hex, e.g. "#D5F1F0"
  darkColor: string          // dark mode rgba, e.g. "rgba(0, 127, 126, 0.15)"
  touchpoints: Touchpoint[]
}

interface Touchpoint {
  action: string             // What the user does
  screen: string             // Which screen/component
  systemResponse: string     // What the system does
  emotion: 'positive' | 'neutral' | 'friction' | 'delight'
  stakeholder: string        // Which persona this touchpoint belongs to
  notes?: string             // Optional context
  mockupLink?: string        // Optional link to mockup screen
}

interface JourneyData {
  title: string
  stakeholders: string[]
  phases: JourneyPhase[]
}
```

### Rendering Structure — Stakeholder-First

The component uses a **stakeholder-first** layout: select a stakeholder tab to see their full end-to-end journey as a vertical timeline.

1. **Stakeholder tabs** — horizontal tab bar across the top; clicking a tab shows that persona's journey. First stakeholder is auto-selected.
2. **Vertical timeline** — each step is a numbered teal circle on a vertical rail with connecting lines. Steps are ordered by phase (the data's natural order). Each step shows:
   - **Phase badge** — coloured inline badge showing the phase icon + label
   - **Action text** — what the user does (always visible)
   - **Expanded details** — click a step to expand: screen, system response, emotion, notes, mockup link
   - **Emotion indicator** — coloured dot next to phase badge
3. **Legend** — emotion colour key + keyboard shortcut hints

### Interactions

- **Stakeholder tabs** — click to switch persona; left/right arrow keys cycle tabs
- **Step expand/collapse** — click step or press Enter to toggle details
- **Keyboard nav** — up/down arrows move between steps, Enter expands, Escape collapses
- **Mockup links** — open in new tab

### Visual Design

- **Follow WorkflowMap patterns exactly:**
  - Scoped CSS with `jm-` prefix namespace
  - Dark mode via `useColorMode()` + `:global(.dark)`
  - TC brand colours: teal-700 `#007F7E`, teal-500 `#43C0BE`, blue-700 `#2C4C79`
  - Transitions: `jm-expand` for step detail panels

- **Timeline rail:** teal numbered circles (`border: 2px solid #007F7E`) with a 2px connecting line between them. Active step fills the circle solid teal with a glow ring.

- **Emotion colours:**
  - Positive: `#10B981` (green-500)
  - Neutral: `#9CA3AF` (gray-400)
  - Friction: `#F59E0B` (amber-500)
  - Delight: `#43C0BE` (teal-500)

### Data Input

Props take priority (MDC YAML front matter → props). Falls back to slot content parsing (JSON).
The data model feeds both the stakeholder tabs and the per-stakeholder timeline — touchpoints are grouped by their `stakeholder` field and ordered by their parent phase sequence.

### MDC Usage

```md
::journey-map
---
title: "Lead Intake Journey"
stakeholders:
  - "Sales Staff"
  - "Participant"
phases:
  - id: capture
    label: "Capture"
    icon: "📝"
    color: "#D5F1F0"
    darkColor: "rgba(0, 127, 126, 0.15)"
    touchpoints:
      - action: "Clicks 'New Lead'"
        screen: "Staff Leads Index"
        systemResponse: "Opens create form"
        emotion: neutral
        stakeholder: "Sales Staff"
---
::
```

---

## Behavior Rules

- **Always load spec.md and design.md** before mapping — don't invent features
- **Position in lifecycle** — every journey map must show where the feature sits in the macro customer journey
- **Capture emotions honestly** — friction points are valuable, don't gloss over them
- **Link to mockups** — connect touchpoints to mockup screens where they exist
- **One journey.md per feature** — all stakeholders in one page, filtered by tabs
- **Include handoffs** — explicitly map where one stakeholder hands off to another
- **Friction/delight tables** — always include these at the bottom of journey.md
- **Create JourneyMap.vue only once** — check if it exists before creating

## Integration with Other Skills

| Before | After |
|--------|-------|
| `/speckit-specify` → spec.md | `/trilogy-clarify design` |
| `/trilogy-design` → design.md | `/trilogy-mockup` |

## Workflow Position

```
/trilogy-design         → design.md (strategy, principles)
        ↓
/trilogy-ux             → journey.md (stakeholder experience maps)
        ↓
/trilogy-clarify design → refine UX decisions
        ↓
/trilogy-mockup         → visualize screens
        ↓
/design-sync            → push to Figma
```
