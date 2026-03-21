---
name: speckit-tasks
description: Generate implementation tasks from a plan. Use when breaking down work, creating task lists, or preparing for implementation. Triggers on: create tasks, generate tasks, task breakdown, work items.
---

# SpecKit Tasks Skill

Generate implementation tasks from a plan in either AI-executable or human-readable format.

## Modes

| Mode | Flag | Audience | Output style |
|------|------|----------|-------------|
| **AI mode** (default) | _(none)_ | Claude agent | Hyper-specific: exact file paths, method names, data shapes. Sized for a single agent turn. |
| **Human mode** | `--human` | Developers + Linear | Ticket-style: acceptance criteria, t-shirt sizing, Figma links. Designed for sprint planning. |

**Ask the user which mode they want** (using AskUserQuestion) before generating if no flag is provided:

```
"Who are these tasks for?"

Options:
1. AI agent (default) — Hyper-specific tasks Claude can execute directly. No ambiguity.
2. Human developers — Sprint-ready tickets with acceptance criteria, sized for estimation and Linear sync.
```

---

## Epic Detection & Routing (NEW CHAT)

In a new chat, **identify the epic context FIRST**:

```bash
find .tc-docs/content/initiatives -name "plan.md" -type f 2>/dev/null | sort
```

**If plan.md exists**: Load and proceed to task generation
**If no plan.md found**: Ask user to create plan first using `/speckit-plan`

---

## Execution Steps

### 1. Detect Context

```bash
find .tc-docs/content/initiatives -name "plan.md" -type f 2>/dev/null | head -5
```

### 2. Load Design Documents

Read from feature directory:
- **Required**: `plan.md` (tech stack, architecture, phases), `spec.md` (user stories with priorities)
- **Also read if present**: `db-spec.md` (migrations, models, JSON schemas), `design.md` (component decisions, UX constraints), `data-model.md`, `research.md`

### 3. Determine Mode

If mode not specified by flag, use AskUserQuestion to ask before generating.

### 4. Generate tasks.md

Save in the **same directory as spec.md and plan.md**.

**CRITICAL - Frontmatter Requirement**:
```yaml
---
title: "Implementation Tasks: [Feature Name]"
---
```

---

## AI Mode (default)

Tasks must be specific enough for an LLM to execute without additional context. No ambiguity — the agent shouldn't need to make judgement calls.

**Task Format**:
```text
- [ ] [TaskID] [P?] [Story?] Description with exact file path, method name, and data shape
```

**Format Components**:
1. **Checkbox**: ALWAYS `- [ ]`
2. **Task ID**: Sequential (T001, T002, T003...)
3. **[P] marker**: Include ONLY if parallelizable (no dependency on previous task)
4. **[Story] label**: [US1], [US2], etc.
5. **Description**: Exact action — file path, class name, method signature, key fields

**Phase Structure**:
- **Phase 1**: Foundation — migrations, enums, models (blocking for all stories)
- **Phase 2**: Core Actions — business logic, DTOs (blocking for controllers)
- **Phase 3+**: User Stories in priority order (P1 first, then P2, P3)
- **Final Phase**: Cross-cutting concerns, polish, pint, tests

**AI task examples**:
```
- [ ] T006 [P] Enum: `LeadStatusEnum` — cases: NOT_CONTACTED, ATTEMPTED_CONTACT, MADE_CONTACT, LOST, CONVERTED. File: domain/Lead/Enums/LeadStatusEnum.php
- [ ] T008 [P] Update `Lead` model — add `lead_status` cast (LeadStatusEnum), `last_contact_at` cast (datetime), `assigned_user_id` to $fillable; add `assignedUser()` BelongsTo, scopes `scopeByLeadStatus()`, `scopeByAssignedUser()`. File: domain/Lead/Models/Lead.php
- [ ] T020 Action: `UpdateLeadStatusAction` — validates no direct set of 'converted', writes lead_status_histories, updates lead.lead_status + lead.last_contact_at on made_contact/attempted_contact, calls CreateLeadTimelineEntryAction. File: domain/Lead/Actions/UpdateLeadStatusAction.php
```

---

## Human Mode (`--human`)

Tasks are ticket-style — readable by a developer picking up work in a sprint. Each task maps to a Linear issue.

**Task Format**:
```markdown
### T001 — [Short title] [US1] [S/M/L]

**Story**: US1 — Staff Leads List View
**Size**: S (< 2h) | M (half day) | L (full day+)

**What to build**:
[2-3 sentence description of the feature/change]

**Acceptance criteria**:
- [ ] [Testable condition 1]
- [ ] [Testable condition 2]

**Files likely touched**: `path/to/file.php`, `path/to/Component.vue`
**Figma**: [link if applicable]
**Depends on**: T005, T008
```

**Phase Structure** (same as AI mode but with sprint grouping):
- **Sprint 1**: Foundation tasks (migrations, models, enums)
- **Sprint 2**: P1 user stories
- **Sprint 3**: P2 user stories
- **Sprint 4**: P3 + polish

**Human task examples**:
```markdown
### T020 — Lead Status Update Action [US5] [M]

**Story**: US5 — Lead Status Tracking
**Size**: M (half day)

**What to build**:
An action class that handles all Lead Status transitions. Validates that 'converted' cannot be set directly. Writes a history record, updates the lead's cached last_contact_at column, and fires a timeline entry.

**Acceptance criteria**:
- [ ] Status transitions write a record to lead_status_histories
- [ ] last_contact_at updates on made_contact and attempted_contact
- [ ] Setting 'converted' directly throws a validation error
- [ ] A timeline entry is created for every transition

**Files likely touched**: `domain/Lead/Actions/UpdateLeadStatusAction.php`, `domain/Lead/Data/UpdateLeadStatusData.php`
**Depends on**: T003 (lead_status_histories table), T006 (LeadStatusEnum)
```

### Human Mode: Linear Sync

After generating human-mode tasks, ask the user:

```
"Would you like to sync these tasks to Linear as issues?"

Options:
1. Yes, sync now — Create Linear issues for all tasks
2. No, I'll sync later — Use /trilogy-linear-sync push tasks later
```

---

## Document Reading Priority

When generating tasks, read documents in this order and incorporate all relevant detail:

1. `plan.md` — phases, architecture decisions, constraints, component list
2. `spec.md` — user stories, FRs, acceptance scenarios (maps to task acceptance criteria in human mode)
3. `db-spec.md` — migration column definitions, JSON schemas, model additions (informs exact field names in AI mode)
4. `design.md` — component choices, UX patterns, layout decisions (informs Vue component tasks)

---

## Report Completion

Report with:
- `tasks.md` path
- Mode used (AI / Human)
- Summary: total tasks, per-story count, parallel opportunities, MVP scope (P1 tasks only)
- Next steps:
  - **AI mode**: "Ready to implement. Run `/speckit-implement` to start, or say 'keep going' to begin."
  - **Human mode**: Offer `/trilogy-linear-sync push tasks` to sync to Linear, then "Use `/speckit-implement` to start AI-assisted implementation."
  - After implementation: `/trilogy-dev-handover` (Gate 4: Code Quality)

---

## Key Rules

- Save `tasks.md` in the **same directory** as `spec.md` and `plan.md`
- **AI mode**: tasks must be unambiguous — no "figure out the best approach", all file paths explicit
- **Human mode**: tasks must be estimable — a developer should be able to size them without reading the plan
- Map all tasks to user stories from `spec.md`
- `[P]` marker (AI mode) / `Depends on: none` (human mode) = safe to parallelise
