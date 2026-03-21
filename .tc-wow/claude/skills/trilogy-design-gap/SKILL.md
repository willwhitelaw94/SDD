---
name: trilogy-design-gap
description: >-
  Cross-check a Figma design against spec.md, optionally incorporating a designer's
  Loom walkthrough transcript. Produces a structured gap analysis in design.md and
  updates user stories in spec.md. Backward-compatible alias: trilogy-figma-check.
  Triggers on: figma check, cross-check design, design vs spec, figma audit,
  design gap, gap assessment, loom review, design walkthrough.
metadata:
  version: 2.0.0
  type: agent
---

# Design Gap Assessment

Cross-check a Figma design board against the feature specification, optionally enriched with the designer's walkthrough transcript (Loom, pasted text, or Fireflies). Identifies gaps, conflicts, and alignment issues — then updates user stories in spec.md.

## Purpose

This skill:
1. **Fetches** Figma design context via MCP (screenshots + metadata)
2. **Reads** the initiative's spec.md
3. **Optionally loads** a designer walkthrough transcript (Loom, pasted, or file)
4. **Compares** step-by-step: fields, flows, states, and requirements
5. **Produces** a structured cross-check document appended to design.md
6. **Updates** user stories in spec.md with gap-identified stories

## When to Use

```bash
/design-gap-assessment <figma-url>                     # Same as old /trilogy-figma-check
/design-gap-assessment <figma-url> --quick             # Summary only (no field-level audit)
/design-gap-assessment <figma-url> --transcript        # Prompts to paste designer transcript
/design-gap-assessment <figma-url> --loom <loom-url>   # Fetches Loom transcript via WebFetch
```

Run this skill **after** spec.md exists and a Figma design has been created/updated.

**Backward-compatible:** Running `/trilogy-figma-check <figma-url>` still works — it invokes this same skill.

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| spec.md | Yes | Initiative folder |
| Figma URL | Yes | Provided as argument |
| Figma MCP | Yes | `mcp__figma__*` tools must be available |
| Transcript | No | Pasted text, Loom URL, or local file |

## Output

1. Appends a **Figma Cross-Check** section to the bottom of `design.md`
2. Appends a **Gap-Identified Stories** section to the bottom of `spec.md` (if gaps found)
3. Updates the Figma link in design.md's Design Resources table

---

## Execution Flow

### Step 1: Parse Input

```
Input: "/design-gap-assessment https://www.figma.com/design/{fileKey}/{fileName}?node-id={nodeId}"

Extract:
  - fileKey from URL
  - nodeId from URL (convert 1-2 format to 1:2)
  - --transcript flag (if present)
  - --loom <url> (if present)
```

If no URL is provided, ask the user for the Figma URL using `AskUserQuestion`.

### Step 2: Find the Initiative

Locate the spec.md for the current initiative:

```bash
# Check current branch name for clues
git branch --show-current

# Find spec files
find .tc-docs/content/initiatives -name "spec.md" -type f 2>/dev/null | sort
```

If multiple specs exist, ask the user which initiative to cross-check.

### Step 3: Load Spec

Read the spec.md and extract:
- **User stories** (step-by-step wizard or flow)
- **Functional requirements** (FR-XXX items)
- **Fields and data** mentioned per step
- **Edge cases** and error states
- **Success criteria**

### Step 4: Load Designer Walkthrough (if provided)

**This step only runs if `--transcript` or `--loom` was provided. Skip otherwise.**

#### Option A: `--transcript` flag
Prompt the user:
```
Please paste the designer's walkthrough transcript below.
This can be from a Loom recording, a meeting, or any design review.
```

Wait for user to paste text, then proceed to parsing.

#### Option B: `--loom <loom-url>`
```
1. Fetch the Loom page via WebFetch(loom-url, "Extract the full transcript text from this Loom video page")
2. If the transcript is accessible, extract it
3. If the transcript is not accessible (private video), fall back to asking the user to paste it
```

#### Transcript Parsing

Once transcript text is available, extract:
- **Design decisions** — explicit choices the designer made ("I chose tabs over accordion because...")
- **Rationale** — reasoning for layout, component, or flow choices
- **Callouts** — specific things the designer flagged ("Note that this field is optional in the design...")
- **Deviations from spec** — anything the designer intentionally changed ("The spec says X but I went with Y because...")
- **New ideas** — features or interactions the designer added that aren't in the spec
- **Open questions** — things the designer flagged as needing discussion

Store these as structured findings for use in Step 7.

### Step 5: Fetch Figma Overview

```
1. Get screenshot of the root node (overview of all frames)
2. Get metadata for the root node (XML structure with frame names + IDs)
3. Parse metadata to extract all screen/frame names and their node IDs
```

Filter frames to identify:
- Main screens (Desktop-level views, wizard steps)
- Component states (empty, filled, error, success)
- Modals and overlays

### Step 6: Fetch Per-Screen Screenshots

For each identified screen/frame:
```
1. Get screenshot via mcp__figma__get_screenshot(fileKey, nodeId)
2. Visually analyze: layout, fields, buttons, states
3. Record findings per screen
```

### Step 7: Cross-Check Analysis

For each wizard step / screen, compare:

| Dimension | What to Check |
|-----------|---------------|
| **Step alignment** | Does the Figma step match the spec step at the same position? |
| **Fields** | Every field in spec exists in Figma, and vice versa |
| **Field attributes** | Required/optional, read-only, pre-filled, dropdown vs text |
| **States** | Empty, filled, error, loading, success states all designed? |
| **Buttons & actions** | CTAs match spec flow (button labels, what happens on click) |
| **Validation** | Error states shown for required fields? |
| **Edge cases** | Spec edge cases have corresponding Figma states? |
| **Content** | Labels, descriptions, helper text match spec language |

**If transcript was loaded (Step 4)**, also check:
- **Intentional deviations** — was the gap flagged by the designer as a deliberate choice?
- **Designer rationale** — does the reasoning justify the deviation?
- **New additions** — did the designer add something not in the spec that should be?

Categorize findings as:
- **CRITICAL** — Fundamental flow or step mismatch
- **GAP (Spec → Figma)** — Spec requires something not in design
- **GAP (Figma → Spec)** — Design shows something not in spec
- **CONFLICT** — Both address it but differently
- **INTENTIONAL** — Designer deliberately deviated (transcript evidence) *(new category)*
- **MINOR** — Naming, labeling, or cosmetic differences

### Step 8: Append Cross-Check to design.md

Append a `## Figma Cross-Check: Spec vs Design` section to the bottom of the initiative's `design.md`. Also update the Figma link in the Design Resources table at the top. Structure:

```markdown
## Figma Cross-Check: Spec vs Design

**Figma**: [Link](url)
**Spec**: [spec.md](../spec.md)
**Date**: YYYY-MM-DD
**Status**: Initial cross-check
**Transcript**: Yes / No (source: Loom / pasted / none)

---

## Figma Screen Inventory

| Figma Frame | Node ID | Link | Description |
|-------------|---------|------|-------------|
| ... | ... | [Open in Figma](https://www.figma.com/design/{fileKey}?node-id={nodeId}) | ... |

---

## Stepper / Flow Comparison

| # | Figma Step | Spec Step | Match? |
|---|------------|-----------|--------|
| ... | ... | ... | ... |

---

## Detailed Differences

### CRITICAL — [Title]
[Description of fundamental mismatch]

### Step N — [Name]
| Field | Figma | Spec | Gap? | Designer Rationale |
|-------|-------|------|------|--------------------|
| ... | ... | ... | ... | ... |

---

## Designer Walkthrough Insights

*(Only included if transcript was provided)*

### Intentional Deviations
| Item | Spec Says | Design Does | Designer Rationale |
|------|-----------|-------------|-------------------|
| ... | ... | ... | ... |

### New Design Ideas (Not in Spec)
1. [Description] — Designer rationale: "..."

### Open Questions from Designer
1. [Question flagged in walkthrough]

---

## Summary of Gaps

### Spec has but Figma doesn't:
1. ...

### Figma has but spec doesn't:
1. ...

### Conflicting:
1. ...

### Intentionally different (designer choice):
1. ...

---

## Recommended Actions

1. ...
```

### Step 9: Update User Stories in spec.md

**This step always runs when gaps are found, regardless of whether a transcript was provided.**

Analyze the gaps from Step 7 and identify:
- **New stories needed** — gaps that represent missing functionality
- **Modified stories** — existing stories that need updating based on design decisions
- **Removed/deferred stories** — spec stories the design intentionally excludes (with rationale)

Append a `## Gap-Identified Stories` section to the bottom of spec.md:

```markdown
## Gap-Identified Stories

*Generated by `/design-gap-assessment` on YYYY-MM-DD*
*Figma: [Link](url)*

### New Stories

**[GAP-US-01]** As a [role], I want to [action from Figma gap], so that [value].
- **Source**: GAP (Figma → Spec) — design includes [feature] not in original spec
- **Designer rationale**: "[quote from transcript, if available]"
- **Acceptance criteria**:
  - [ ] ...

**[GAP-US-02]** ...

### Modified Stories

**[MOD-US-01]** Original: US-03 "As a care coordinator..."
- **Change**: [What changed based on design]
- **Source**: CONFLICT — spec says X, design does Y
- **Designer rationale**: "[quote, if available]"
- **Updated acceptance criteria**:
  - [ ] ...

### Deferred Stories

**[DEF-US-01]** Original: US-07 "As a participant..."
- **Reason**: Designer intentionally excluded — "[rationale from transcript]"
- **Recommendation**: Defer to Phase 2 / Remove from scope
```

### Step 10: Report Completion

```
## Design Gap Assessment Complete

**Initiative**: [Name]
**Screens Analyzed**: N
**Transcript**: Yes/No (source)

### Gap Summary
- **Critical Issues**: N
- **Gaps (Spec → Figma)**: N
- **Gaps (Figma → Spec)**: N
- **Conflicts**: N
- **Intentional Deviations**: N

### Story Updates
- **New stories added**: N
- **Stories modified**: N
- **Stories deferred**: N

**Documents Updated**:
- design.md (cross-check appended)
- spec.md (gap-identified stories appended)

**Recommended Next Steps**:
- Resolve critical mismatches with designer/PM
- Review gap-identified stories with product owner
- Update Figma or spec based on decisions
- Re-run /design-gap-assessment after updates
```

---

## Behavior Rules

- **Always fetch screenshots** — visual analysis is essential, don't rely on metadata alone
- **Be thorough on fields** — check every field mentioned in spec against every field visible in Figma
- **Flag direction of gaps** — "Spec has but Figma doesn't" vs "Figma has but spec doesn't"
- **Don't assume which is correct** — flag differences neutrally and recommend alignment actions
- **Always include Figma links** — every row in the Screen Inventory table must have a direct link in the format `https://www.figma.com/design/{fileKey}?node-id={nodeId}` — never leave node IDs as plain text
- **Save Figma node IDs** — so screens can be referenced later without re-fetching
- **Handle large metadata** — Figma metadata can be very large; search/filter rather than reading in full
- **Preserve transcript attribution** — when quoting designer rationale, include the source
- **Never discard spec stories silently** — if a spec story isn't reflected in design, flag it explicitly
- **Use [GAP-US-XX] prefixes** — makes gap-identified stories searchable and traceable

## Integration with Other Skills

| Before | After |
|--------|-------|
| `/trilogy-design` → design.md | `/trilogy-clarify design` |
| `/trilogy-mockup` → mockups | `/trilogy-design-handover` → Gate 2 |
| `/design-sync` → Figma design | Resolve gaps → update spec or Figma |
| Designer creates/improves Figma | |

## Workflow Position

```
/trilogy-design         → design.md
        ↓
/trilogy-mockup         → mockups (ASCII/HTML/Vue)
        ↓
/design-sync            → push mockups to Figma
        ↓
Designer improves in Figma + records Loom
        ↓
/design-gap-assessment  → gap analysis + story updates
        ↓
Resolve gaps → update spec or Figma
        ↓
/trilogy-design-handover → Gate 2
```
