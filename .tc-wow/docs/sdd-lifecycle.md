---
title: "SDD Lifecycle: Skills & Gates Reference"
description: "Complete Specification-Driven Development lifecycle showing all skills, gates, artifacts, and workflow ordering"
---

# SDD Lifecycle: Skills & Gates Reference

The Trilogy SDD (Specification-Driven Development) flow has **6 stages** and **7 quality gates**. Each stage produces artifacts that feed the next. Gates are non-negotiable quality checkpoints.

---

## Stage 0: Idea

| Step | Skill | What It Does |
|------|-------|-------------|
| 1 | `/trilogy-learn` | Load business context from codebase, docs, meetings |
| 2 | `/trilogy-idea` | Create idea brief — problem statement, proposed solution |
| 3 | `/trilogy-idea-handover` | **Gate 0**: Validate idea, create Linear epic as **Planned** |

**Artifacts**: `idea-brief.md`, `meta.yaml`
**Linear Transition**: Create → **Planned**

---

## Stage 1: Specification

| Step | Skill | What It Does |
|------|-------|-------------|
| 4 | `/speckit-specify` | Generate full spec — user stories, FRs, acceptance scenarios |
| 5 | `/trilogy-clarify spec` | Refine spec through requirements analyst lens (10 ambiguity categories) |
| 6 | `/trilogy-clarify business` | Refine business outcomes, success metrics, ROI |
| 7 | `/trilogy-spec-handover` | **Gate 1**: Validate spec quality, stays in **Planned** |

**Artifacts**: `spec.md`, `business-spec.md`
**Linear Transition**: Stays in **Planned**

---

## Stage 2: Design

| Step | Skill | What It Does |
|------|-------|-------------|
| 8 | `/trilogy-design-kickoff` | Create design brief — user context, principles, constraints, scope |
| 9 | `/trilogy-design-research` | (Optional) Competitive analysis, user research, audits |
| 10 | `/trilogy-clarify design` | Refine UX/UI decisions through designer lens |
| 11 | `/trilogy-mockup` | Generate mockups — ASCII, HTML/Tailwind, or Vue pages |
| 12 | `/trilogy-design-handover` | **Gate 2**: Validate design completeness |

**Artifacts**: `design.md`, `mockups/`
**Linear Transition**: Design → **Dev**

---

## Stage 3: Architecture & Planning

| Step | Skill | What It Does |
|------|-------|-------------|
| 13 | `/trilogy-clarify dev` | Refine technical strategy, architecture approach |
| 14 | `/speckit-plan` | Create implementation plan — file structure, data model, API contracts, phases |
| 15 | `/speckit-tasks` | Generate task list (AI or Human mode) + ticket subfolders with `task.md` per story |

**Gate 3** (Architecture): Validated within `plan.md` — stays in **Dev**

**Artifacts**: `plan.md`, `data-model.md`, `tasks.md`, ticket subfolders with `task.md`
**Linear Transition**: Stays in **Dev**

---

## Stage 4: Implementation & Dev Handover

| Step | Skill | What It Does |
|------|-------|-------------|
| 16 | `/trilogy-linear-sync push stories` | Push user stories to Linear, create ticket subfolders with Linear IDs |
| 17 | `/speckit-implement` | Execute tasks — Standard or Ralph (autonomous) mode, per-ticket |
| 18 | `/trilogy-dev-handover` | **Gate 4** (per ticket): Tests, linting, coverage, AC verification, create PR |

**Artifacts**: Code, PR, ticket `meta.yaml` updated with `gates.dev`
**Linear Transition**: Dev → **QA** (per ticket)

---

## Stage 5: QA

| Step | Skill | What It Does |
|------|-------|-------------|
| 19 | `/trilogy-qa` | Generate QA test plan from spec ACs (per ticket) |
| 20 | `/trilogy-qa-test-agent` | Autonomous browser testing — execute plan, fix failures, report |
| 21 | `/trilogy-qa-test-codify` | Convert passing tests → Playwright E2E specs |
| 22 | `/trilogy-qa-handover` | **Gate 5** (per ticket): Validate QA checklist |

**Artifacts**: ticket `qa-plan.md`, `test-report.md`, `e2e/tests/`, ticket `meta.yaml` updated with `gates.qa`
**Linear Transition**: QA → **Release** (per ticket)

---

## Stage 6: Release

| Step | Skill | What It Does |
|------|-------|-------------|
| 23 | `/trilogy-ship` | Orchestrate release — changelog, tags, deploy |
| 24 | Release Agent | **Gate 6**: Final validation |

**Artifacts**: Release notes, git tags
**Linear Transition**: Release → **Completed**

---

## Visual Flow

```
/trilogy-idea → /trilogy-idea-handover (Gate 0)
       ↓
/speckit-specify → /trilogy-clarify → /trilogy-spec-handover (Gate 1)
       ↓
/trilogy-design-kickoff → /trilogy-mockup → /trilogy-design-handover (Gate 2)
       ↓
/speckit-plan → /speckit-tasks (Gate 3)
       ↓
/speckit-implement → /trilogy-dev-handover (Gate 4, per ticket)
       ↓
/trilogy-qa → /trilogy-qa-test-agent → /trilogy-qa-handover (Gate 5, per ticket)
       ↓
/trilogy-ship (Gate 6)
```

---

## Gate Summary

| Gate | Name | Skill | Linear Transition | Scope |
|------|------|-------|-------------------|-------|
| Gate 0 | Idea | `/trilogy-idea-handover` | Create → **Planned** | Epic |
| Gate 1 | Spec | `/trilogy-spec-handover` | Stays in **Planned** | Epic |
| Gate 2 | Design | `/trilogy-design-handover` | Design → **Dev** | Epic |
| Gate 3 | Architecture | `/speckit-plan` | Stays in **Dev** | Epic |
| Gate 4 | Code Quality | `/trilogy-dev-handover` | Dev → **QA** | Per ticket |
| Gate 5 | QA | `/trilogy-qa-handover` | QA → **Release** | Per ticket |
| Gate 6 | Release | Release Agent | Release → **Completed** | Epic |

---

## Epic vs Ticket Scope

### Epic-Level (shared, Gates 0–3)

| File | Purpose |
|------|---------|
| `index.md` | Navigation entry for tc-docs site |
| `idea-brief.md` | Problem statement, proposed solution |
| `business-spec.md` | Business objectives, success metrics, ROI |
| `spec.md` | Full feature specification with all user stories |
| `design.md` | UX/UI decisions, component choices |
| `plan.md` | Technical implementation plan, architecture |
| `tasks.md` | Master task list across all stories |
| `meta.yaml` | Epic metadata: Linear project ID, gates 0–3 |

### Ticket-Level (per story, Gates 4–5)

Each ticket gets a subfolder named `<LINEAR-ID> <Title>/`:

| File | Purpose |
|------|---------|
| `meta.yaml` | Ticket metadata: Linear issue ID, status, gates 4–5 |
| `task.md` | Scoped extraction of spec, design, and tasks for this story |
| `qa-plan.md` | QA test plan scoped to this ticket's ACs |
| `test-report.md` | QA test results for this ticket |

Epic status is **derived** — the epic only transitions when **all** tickets reach the same stage.

---

## Supporting Skills (used as needed)

| Skill | When to Use |
|-------|------------|
| `/trilogy-learn` | Load business context before any stage |
| `/trilogy-research` | Deep research from meetings, Teams, Linear, web |
| `/trilogy-clarify` | Refine any artifact through a specific lens (spec, business, design, dev) |
| `/trilogy-estimate` | Generate effort estimates at any level |
| `/trilogy-flow` | Generate user flow diagrams |
| `/trilogy-ux` | Create stakeholder journey maps |
| `/trilogy-illustrate` | Select icons and illustrations |
| `/trilogy-pixel-perfect` | Compare implementation against Figma design |
| `/trilogy-figma-capture` | Capture live page and push to Figma |
| `/trilogy-linear-sync` | Sync epics, stories, tasks between local docs and Linear |
| `/trilogy-dev-review` | Review PR code quality against best practices |
| `/trilogy-dev-anvil` | Gate-aware coding for ad-hoc work |
| `/trilogy-release-notes` | Generate multi-audience release notes |
| `/speckit-analyze` | Workflow-aware analysis of spec artifacts across pipeline |
| `/speckit-checklist` | Generate requirements quality checklists |

---

## Agent Orchestrators

Pipeline agents coordinate multiple skills for autonomous execution:

| Agent | Stages Covered | What It Does |
|-------|---------------|-------------|
| `planning-agent` | Idea → Spec | Chains idea, specification, clarification skills |
| `design-agent` | Design | Chains design brief, research, mockup, handover |
| `dev-agent` | Implementation | Plans architecture, spawns frontend + backend + testing agents |
| `qa-agent` | QA | Chains QA planning, browser testing, fix-and-retest, codify |
| `release-agent` | Release | Final release validation and deployment sign-off |
