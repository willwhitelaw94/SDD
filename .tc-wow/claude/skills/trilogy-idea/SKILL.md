---
name: trilogy-idea
description: Create idea briefs for new features or epics. Use when starting a new feature, capturing initial concept, or creating epic structure. Triggers on: new idea, new feature, create epic, idea brief, feature concept.
---

# Trilogy Idea Skill

Streamlined idea brief creation for TC Portal. Ask user to describe their idea, auto-match to existing initiatives, and generate publication-ready brief with minimal questions.

## Agent Available

For a full autonomous planning workflow (idea through to spec handover), consider running the **planning-agent** instead: it chains `/trilogy-idea` → `/trilogy-idea-handover` → `/speckit-specify` → `/trilogy-clarify` → `/trilogy-spec-handover` automatically.

## Context to Load First

Before starting, if you haven't run `/trilogy-learn` in this chat, ask the user if they want to build overall context about TC Portal domains.

## Philosophy

**Less asking, more doing:**
- Get idea description upfront in one prompt
- Auto-match to existing initiatives/epics
- Extract information from description rather than asking separately
- Only ask follow-up questions if critical info is missing
- Use placeholders (`—`) for optional fields
- User can always refine later with `/trilogy-clarify`

## Execution Steps

### Step 1: Gather Idea Description

Ask the user to describe their idea in a single prompt:

**"Describe your idea - what problem are you solving, who it's for, and what the solution might look like?"**

The user can provide as much or as little detail as they want. You'll use this to:
1. Auto-match to existing initiatives/epics (if relevant)
2. Generate the idea brief with available information
3. Fill in gaps conversationally if needed

### Step 2: Auto-Match to Existing Initiatives

Based on the user's description, automatically:

1. **Search existing initiatives** in `.tc-docs/content/initiatives/` for relevant matches
2. **If strong match found**: Suggest placement without asking multiple questions
   - "This sounds like it belongs to **[Initiative Name]**. I'll create it there unless you'd prefer elsewhere."
3. **If no clear match**: Offer to create as standalone or new initiative
   - "I don't see an existing initiative that matches. Should I create this as a **standalone epic** or start a **new initiative**?"

**No need to ask what type it is** - infer from context and existing structure.

### Step 3: Smart Information Gathering

Only ask follow-up questions if critical information is missing:
- Epic name (if not clear from description)
- Epic code (suggest based on name, validate uniqueness)
- RACI roles (only if not mentioned)

**Do NOT ask for**:
- Problem statement (extract from description)
- Solution overview (extract from description)
- Target users (extract from description or use "—")
- Benefits (extract from description or use "—")
- Assumptions/Dependencies (use "—" if not mentioned)
- Risks (use "—" if not mentioned)
- Effort estimate (use "To be determined" if not mentioned)

### Step 4: Validate Epic Code

Every epic MUST have a unique 3-letter code within its initiative.

**Process:**
1. Check existing codes in the target initiative folder
2. Suggest a code based on the epic name (e.g., "Waitlist Access" → "WAI")
3. Only ask for confirmation if your suggestion might be unclear
4. Block creation if code conflicts exist

**Format Requirements:**
- 3 letters only (no numbers)
- ALL CAPITALS (WAI, not wai or Wai)
- Phonetic/pronounceable
- Unique per initiative

**Default behavior**: Suggest code, validate uniqueness, proceed. Only ask if ambiguous.

### Step 5: Generate idea-brief.md

Use template at `.tc-wow/templates/idea.md`. Create lean, publication-ready idea brief.

**CRITICAL - Frontmatter Requirement**: All generated `.md` files MUST include YAML frontmatter. Extract the title from the first H1 heading:

```yaml
---
title: "Idea Brief: [Title]"
---
```

**Key Requirements:**
- **TARGET: 2 pages (120-150 lines max)** - STRICTLY enforced
- Use concise bullet points, not paragraphs
- Avoid examples unless critical
- Remove redundant explanations

**NO OVERLAP with PRD or User Stories:**
- Idea Brief = high-level problem, solution snapshot, benefits, effort, scope
- PRD = detailed requirements, specifications, technical details
- User Stories = granular implementation tasks

**Sections to Complete:**
1. Problem Statement (What) - user-facing pain points
2. Possible Solution (How) - high-level approach with before/after
3. Benefits (Why) - quantified metrics when possible
4. Owner & Stakeholders - RACI table (see format below)
5. Assumptions & Dependencies, Risks
6. Estimated Effort - T-shirt size with sprint breakdown
7. Proceed to PRD? - YES/NO with brief reason

### RACI Table Format

The Owner & Stakeholders section MUST use this exact table format:

```markdown
## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | [Name] (PO), [Name] (BA), [Name] (Des), [Name] (Dev) |
| **A** | [Name] |
| **C** | [Name], [Name] |
| **I** | [Name] |
```

**RACI Definitions:**

| Role | Definition | Typical Assignees |
|------|------------|-------------------|
| **R (Responsible)** | The people who will do the work. For epics, this includes the core delivery team. | PO (Product Owner), BA (Business Analyst), Des (Designer), Dev (Developer) |
| **A (Accountable)** | The executive who oversees the main area of concern. One person who is ultimately answerable. | Executive/leadership member |
| **C (Consulted)** | Subject matter experts who will be actively consulted and are expected to provide input. | SMEs, stakeholders with domain expertise |
| **I (Informed)** | People who need to be kept informed for the function of their role. | Affected teams, downstream stakeholders |

**Formatting Rules:**
- **Role tags**: Always include role abbreviation in brackets after each name in the R row: `(PO)`, `(BA)`, `(Des)`, `(Dev)`
- **Compound roles**: If one person has multiple roles, combine them: `Beth Poultney (PO, Des)`
- **Multiple people**: Separate with commas: `Tim Maier (Dev), Matthew Allan (Dev)`
- **Blank entries**: Use em-dash `—` for empty cells, never leave blank
- **PO note**: Product Owner is "who will largely be spearheading the work in practice" — not mutually exclusive with other roles

**Example:**
```markdown
| Role | Person |
|------|--------|
| **R** | Romy Blacklaw (PO), David Henry (BA), Beth Poultney (Des), Khoa Duong (Dev) |
| **A** | Patrick Hawker |
| **C** | Erin Headley |
| **I** | — |
```

**Gathering RACI from User:**
Only ask about RACI if not mentioned in the initial description. Keep it simple:
- "Who's working on this? (PO, BA, Designer, Dev, Executive)"

If user doesn't provide RACI info, use `—` as placeholder for all roles. This can be filled in later.

### Step 6: Create Epic Folder Structure

**CRITICAL - Every epic MUST have this folder structure:**

```
TP-XXXX-CCC-Epic-Name/
├── context/
│   ├── raw_context/          (Raw, unrefined context documents)
│   ├── rich_context/         (Cleaned, curated context)
│   └── epic_channels/        (Channel-specific context)
├── idea-brief.md
├── spec.md                   (Created later)
├── plan.md                   (Created later)
├── tasks.md                  (Created later)
└── meta.yaml
```

Create these folders using: `mkdir -p context/{raw_context,rich_context,epic_channels}`

### Step 7: Save Output

**For Initiative/Epic ideas:**
Save to: `.tc-docs/content/initiatives/[II]-initiative-name-TP-XXXX/[TP-YYYY or NNN]-CCC-Epic-Name/idea-brief.md`

**For Standalone ideas:**
Save to: `.tc-docs/content/initiatives/ADHOC/[descriptive-folder-name]/idea-brief.md`

**Naming Rules:**
- Filename is ALWAYS `idea-brief.md`
- **WITH Linear Sync**: Use Linear project identifier (e.g., TP-2315)
- **WITHOUT Linear Sync**: Use sequential ordering (e.g., 001, 002, 003)
- CCC = 3-letter epic code (CAPITALS) - not required for standalone

## After Creation

1. Confirm epic folder structure created with all three context subfolders
2. Confirm epic created in correct location
3. Show epic code format used
4. Present next steps:

**Immediate Next Step:**
- `/trilogy-idea-handover` — **Gate 0 (Idea Gate)**: Validates brief quality, HOD acknowledgement, RACI completeness, creates the epic in Linear as Backlog, and advises on organising the discovery meeting

**Other Refinement Steps (can run before or after Gate 0):**
- `/trilogy-clarify business` — Refine business outcomes, success metrics, ROI (updates idea brief)
- `/trilogy-research` — Gather context from Teams, Fireflies, Linear, and codebase

## Naming Rules Reference

**Initiatives**: `[II]-initiative-name-TP-XXXX` (2-letter code at START, Linear ID at END)

**Epics (under initiatives):**
- WITH Linear: `TP-YYYY-CCC-epic-name`
- WITHOUT Linear: `NNN-CCC-epic-name` (001, 002, 003...)
- 3-letter code MUST be unique per initiative
