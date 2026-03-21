---
title: Workflow Map
description: The complete journey from idea to production — phases, gates, skills, and Linear lifecycle
---

The complete journey from idea to production. Every feature passes through **7 quality gates** across **7 phases**, with status tracked in Linear at every transition.

:workflow-map

---

## Linear Status Lifecycle

Each gate transitions the Linear epic through a defined status. This is the single source of truth for where work sits.

```mermaid
flowchart LR
    G0(("0")) --> P[Planned]
    P --> G1(("1"))
    G1 --> P2[Planned]
    P2 --> K(("K"))
    K --> DS[Design]
    DS --> G2(("2"))
    G2 --> D[Dev]
    D --> G3(("3"))
    G3 --> D2[Dev]
    D2 --> G4(("4"))
    G4 --> QA[QA]
    QA --> G5(("5"))
    G5 --> RL[Release]
    RL --> G6(("6"))
    G6 --> C[Completed]

    style G0 fill:#D5F1F0,stroke:#007F7E
    style G1 fill:#D5F1F0,stroke:#007F7E
    style K fill:#D5F1F0,stroke:#007F7E
    style G2 fill:#D5F1F0,stroke:#007F7E
    style G3 fill:#D5F1F0,stroke:#007F7E
    style G4 fill:#D5F1F0,stroke:#007F7E
    style G5 fill:#D5F1F0,stroke:#007F7E
    style G6 fill:#D5F1F0,stroke:#007F7E

    style P fill:#f0f9ff,stroke:#3b82f6
    style P2 fill:#f0f9ff,stroke:#3b82f6
    style DS fill:#f0f9ff,stroke:#3b82f6
    style D fill:#f0f9ff,stroke:#3b82f6
    style D2 fill:#f0f9ff,stroke:#3b82f6
    style QA fill:#f0f9ff,stroke:#3b82f6
    style RL fill:#f0f9ff,stroke:#3b82f6
    style C fill:#f0fdf4,stroke:#22c55e
```

| Gate                  | Transition                 | Skill                       | meta.yaml     |
| --------------------- | -------------------------- | --------------------------- | ------------- |
| **0 — Idea**          | Create epic → **Planned**  | `/trilogy-idea-handover`    | `planned`     |
| **1 — Spec**          | *(stays in Planned)*       | `/trilogy-spec-handover`    | *(no change)* |
| **— Design Kickoff**  | Planned → **Design**       | `/trilogy-design-kickoff`   | `design`      |
| **2 — Design**        | Design → **Dev**           | `/trilogy-design-handover`  | `in progress` |
| **3 — Architecture**  | *(stays in Dev)*           | `/speckit-plan`             | *(no change)* |
| **4 — Code Quality**  | Dev → **QA**               | `/trilogy-dev-handover`     | `qa`          |
| **5 — QA**            | QA → **Release**           | `/trilogy-qa-handover`      | `release`     |
| **6 — Release**       | Release → **Completed**    | `/trilogy-ship`             | `completed`   |

---

## Core Flow Diagram

This diagram shows only the **core (mandatory) skills** — the critical path from idea to production. Optional, visual, and support skills are available within each phase via the interactive workflow map above.

```mermaid
flowchart TB
    subgraph RESEARCH["Research First"]
        direction LR
        r1["/trilogy-research"] --> rKB[("Knowledge Base")]
        r2["/trilogy-learn"] -.-> rKB
        r3["/trilogy-brp"] -.-> rKB
    end

    subgraph IDEA["Phase 1: Ideation"]
        direction LR
        i1["/trilogy-idea"] --> i2[["idea-brief.md"]]
        i2 --> iS["/trilogy-idea-spawn"]
        iS --> i3["/trilogy-clarify-business"]
        i3 --> iR["/trilogy-raci"]
        iR --> i4["/trilogy-idea-handover"] --> g0{{"Gate 0"}}
    end

    subgraph SPEC["Phase 2: Specification"]
        direction LR
        s1["/speckit-specify"] --> s2[["spec.md"]]
        s2 --> s3["/trilogy-clarify-spec"]
        s3 --> sC["/speckit-checklist"]
        sC --> s5["/trilogy-spec-handover"] --> g1{{"Gate 1"}}
    end

    subgraph DESIGN["Phase 3: Design"]
        direction LR
        d1["/trilogy-design-kickoff"] --> d2[["design.md"]]
        d2 --> d2r["/trilogy-design-research"]
        d2r --> d3["/trilogy-clarify-design"]
        d3 --> dM["/trilogy-mockup"]
        dM --> dFC["/trilogy-figma-capture"]
        dFC --> d4["/trilogy-design-gap"]
        d4 --> d5["/trilogy-design-handover"] --> g2{{"Gate 2"}}
    end

    subgraph PLAN["Phase 4: Planning"]
        direction LR
        p1["/speckit-plan"] --> g3{{"Gate 3"}} --> p2[["plan.md"]]
        p2 --> p3["/trilogy-clarify-dev"]
        p3 --> pA["/speckit-analyze"]
        pA --> p4["/speckit-tasks"] --> p5[["tasks.md"]]
        p5 --> pL["/trilogy-linear-sync"]
    end

    subgraph CODE["Phase 5: Implementation"]
        direction LR
        c1["/dev-implement"] --> c2[Code]
        cA["/trilogy-dev-anvil"] -.-> c2
        c2 --> cPP["/trilogy-pixel-perfect"]
        cPP --> c3["/trilogy-dev-handover"] --> g4{{"Gate 4"}}
    end

    subgraph QA["Phase 6: QA"]
        direction LR
        q1["/trilogy-qa"] --> q2[["qa-plan.md"]]
        q2 --> q3["/trilogy-qa-test-agent"] --> q4[["test-report.md"]]
        q4 --> q5["/trilogy-qa-test-codify"] --> q6[["Playwright E2E"]]
        q4 --> q7["/trilogy-qa-handover"] --> g5{{"Gate 5"}}
    end

    subgraph RELEASE["Phase 7: Release"]
        direction LR
        rv1[Product Review] --> rv2[UAT]
        rv2 --> rvN["/trilogy-release-notes"]
        rvN --> rv3["/trilogy-ship"] --> g6{{"Gate 6"}}
        g6 --> rv5[Production]
    end

    RESEARCH -.-> IDEA
    IDEA --> SPEC --> DESIGN --> PLAN --> CODE --> QA --> RELEASE

    %% Gates - teal
    style g0 fill:#D5F1F0,stroke:#007F7E
    style g1 fill:#D5F1F0,stroke:#007F7E
    style g2 fill:#D5F1F0,stroke:#007F7E
    style g3 fill:#D5F1F0,stroke:#007F7E
    style g4 fill:#D5F1F0,stroke:#007F7E
    style g5 fill:#D5F1F0,stroke:#007F7E
    style g6 fill:#D5F1F0,stroke:#007F7E

    %% Research - teal light
    style rKB fill:#F0FAFA,stroke:#2F9E9C
    style r1 fill:#F0FAFA,stroke:#43C0BE
    style r2 fill:#F0FAFA,stroke:#43C0BE
    style r3 fill:#F0FAFA,stroke:#43C0BE

    %% Core skills - teal
    style i1 fill:#D5F1F0,stroke:#007F7E
    style iS fill:#D5F1F0,stroke:#007F7E
    style i3 fill:#D5F1F0,stroke:#007F7E
    style iR fill:#D5F1F0,stroke:#007F7E
    style i4 fill:#D5F1F0,stroke:#007F7E
    style s1 fill:#D5F1F0,stroke:#007F7E
    style s3 fill:#D5F1F0,stroke:#007F7E
    style sC fill:#BAE8E7,stroke:#2F9E9C
    style s5 fill:#D5F1F0,stroke:#007F7E
    style d1 fill:#D5F1F0,stroke:#007F7E
    style d2r fill:#BAE8E7,stroke:#2F9E9C
    style d3 fill:#D5F1F0,stroke:#007F7E
    style dM fill:#BAE8E7,stroke:#2F9E9C
    style dFC fill:#BAE8E7,stroke:#2F9E9C
    style d4 fill:#D5F1F0,stroke:#007F7E
    style d5 fill:#D5F1F0,stroke:#007F7E
    style p1 fill:#D5F1F0,stroke:#007F7E
    style p3 fill:#D5F1F0,stroke:#007F7E
    style pA fill:#BAE8E7,stroke:#2F9E9C
    style p4 fill:#D5F1F0,stroke:#007F7E
    style pL fill:#BAE8E7,stroke:#2F9E9C
    style c1 fill:#D5F1F0,stroke:#007F7E
    style cA fill:#BAE8E7,stroke:#2F9E9C
    style cPP fill:#BAE8E7,stroke:#2F9E9C
    style c3 fill:#D5F1F0,stroke:#007F7E
    style q1 fill:#D5F1F0,stroke:#007F7E
    style q3 fill:#D5F1F0,stroke:#007F7E
    style q5 fill:#BAE8E7,stroke:#2F9E9C
    style q7 fill:#D5F1F0,stroke:#007F7E
    style rvN fill:#D5F1F0,stroke:#007F7E
    style rv3 fill:#D5F1F0,stroke:#007F7E
```

---

## The Phases

### Phase 1: Ideation

> "Is this idea clear enough to invest in?"

**Agent**: [`planning-agent`](/ways-of-working/claude-code-advanced/19-stage-agents) — chains ideation + specification skills, handles Gate 0 and Gate 1.

Capture the problem, not the solution. The idea brief is a 1-2 page document with a clear problem statement, proposed solution, and RACI with HOD acknowledgement.

| What                 | How                                                           |
| -------------------- | ------------------------------------------------------------- |
| Capture the problem  | `/trilogy-idea`                                               |
| Spawn ideas          | `/trilogy-idea-spawn` — interactive ideas board from brief + meeting transcript |
| Clarify business     | `/trilogy-clarify-business`                                   |
| Define roles         | `/trilogy-raci` *(optional)*                                  |
| **Gate 0**           | `/trilogy-idea-handover` — creates Linear epic in **Planned** |

**Artifacts**: `idea-brief.md`, `ideas-board.html`

---

### Phase 2: Specification

> "Is this spec ready for design?"

**Agent**: [`planning-agent`](/ways-of-working/claude-code-advanced/19-stage-agents) — same agent continues from ideation through spec, handling Gate 1.

Detail what to build — precisely. User stories follow INVEST criteria with Given/When/Then acceptance criteria. Business language only, no implementation details.

| What                 | How                                                  |
| -------------------- | ---------------------------------------------------- |
| Write the spec       | `/speckit-specify`                                   |
| Clarify requirements | `/trilogy-clarify-spec`                              |
| Quality checklist    | `/speckit-checklist` *(optional)*                    |
| Map user flows       | `/trilogy-flow` *(visual)*                           |
| Explore specs        | `/trilogy-spec-explorer` *(visual)*                  |
| **Gate 1**           | `/trilogy-spec-handover` — validates spec *(stays in Planned)* |

**Artifact**: `spec.md`

---

### Phase 3: Design

> "Is the design complete and ready to hand off to Dev?"

**Agent**: [`design-agent`](/ways-of-working/claude-code-advanced/19-stage-agents) — chains design brief, research, mockups, and design handover. Validates Gate 2.

Strategic design thinking first (kickoff), then clarify UX/UI decisions, then visual exploration (mockups). Edge cases, responsive approach, and accessibility are covered here.

| What              | How                                                  |
| ----------------- | ---------------------------------------------------- |
| Design kickoff    | `/trilogy-design-kickoff` — Planned → **Design**     |
| Design research   | `/trilogy-design-research` *(optional)*              |
| Clarify design    | `/trilogy-clarify-design`                            |
| Journey maps      | `/trilogy-ux` *(optional)*                           |
| UI exploration    | `/trilogy-mockup` *(visual)*                         |
| Capture to Figma  | `/trilogy-figma-capture` *(optional)*                |
| Sync to Figma     | `/trilogy-design-sync` *(optional)*                  |
| Gap assessment    | `/trilogy-design-gap`                                |
| **Gate 2**        | `/trilogy-design-handover` — moves Linear to **Dev** |

**Artifact**: `design.md`, `mockups/`

---

### Phase 4: Planning

> "Will the structure hold?"

**Agent**: [`dev-agent`](/ways-of-working/claude-code-advanced/19-stage-agents) — team lead that plans architecture (Gate 3), breaks into tasks, then spawns `backend-agent`, `frontend-agent`, and `testing-agent` teammates for parallel implementation (Gate 4).

Translate what into how. Data models, API design, component architecture, migration strategy. Break into implementable tickets.

| What               | How                                                  |
| ------------------ | ---------------------------------------------------- |
| Technical plan     | `/speckit-plan` — includes **Gate 3** (stays in Dev) |
| Clarify dev        | `/trilogy-clarify-dev`                               |
| Analyze artifacts  | `/speckit-analyze` *(optional)*                      |
| Visualise DB       | `/trilogy-db-visualiser` *(visual)*                  |
| Break into tickets | `/speckit-tasks`                                     |
| Sync to Linear     | `/trilogy-linear-sync` *(optional)*                  |

**Artifact**: `plan.md`, `tasks.md`

---

### Phase 5: Implementation

> "Is the code ready to inspect?"

**Agent**: [`dev-agent`](/ways-of-working/claude-code-advanced/19-stage-agents) — continues from planning. Spawns `backend-agent`, `frontend-agent`, and `testing-agent` as an Agent Team for parallel implementation. Validates Gate 4 (Code Quality).

Build it. Models, migrations, controllers, data classes, Vue pages, tests. Follow Laravel and Vue best practices. Run Pint, run tests, achieve 80%+ coverage.

| What               | How                                                           |
| ------------------ | ------------------------------------------------------------- |
| Implement features | `/dev-implement`                                              |
| Ad-hoc coding      | `/trilogy-dev-anvil` *(gate-aware, no spec needed)*           |
| Code review        | `/trilogy-dev-review` *(optional)*                            |
| Pixel-perfect      | `/trilogy-pixel-perfect` *(optional — compare vs Figma)*      |
| Create PR          | `/trilogy-dev-pr` — lint, type-check, test, review, create PR targeting `dev` |
| **Gate 4**         | `/trilogy-dev-handover` — validates code quality, Linear Dev → QA |

**Artifact**: Code, tests, PR

---

### Phase 6: QA

> "Does it actually work?"

**Agent**: [`qa-agent`](/ways-of-working/claude-code-advanced/19-stage-agents) — chains QA planning, browser testing, fix-and-retest, test codification, and QA handover. Validates Gate 5.

Verify the feature works as specified. Functional testing, cross-browser (Chrome, Safari, Firefox), responsive (desktop, tablet, mobile), accessibility (WCAG 2.1 AA).

| What           | How                                                 |
| -------------- | --------------------------------------------------- |
| QA test plan   | `/trilogy-qa` — generates qa-plan.md (no browser)   |
| Execute tests  | `/trilogy-qa-test-agent` — browser testing + fixes  |
| Codify tests   | `/trilogy-qa-test-codify` — Playwright E2E *(optional)* |
| **Gate 5**     | `/trilogy-qa-handover`                              |

**Artifacts**: `qa-plan.md`, `test-report.md`

---

### Phase 7: Release

> "May this enter the city?"

**Agent**: [`release-agent`](/ways-of-working/claude-code-advanced/19-stage-agents) — chains release validation, release notes, and deployment sign-off. Validates Gate 6, transitions to Completed.

Product Owner validates business value. Business stakeholders run UAT. All approvals captured before production. Ship with confidence.

| What           | How                                                |
| -------------- | -------------------------------------------------- |
| Product review | Product Owner sign-off                             |
| UAT            | Business stakeholder validation                    |
| Release notes  | `/trilogy-release-notes`                           |
| **Gate 6**     | `/trilogy-ship` — moves Linear to **Completed**    |

**Artifact**: `release-notes.md`

---

## Scaling to Complexity

Not every feature needs the full journey. Scale to the work:

| Feature Size                 | Gates                           | Example         |
| ---------------------------- | ------------------------------- | --------------- |
| **Trivial** (typo fix)       | Just implement it               | Fix a label     |
| **Small** (single component) | Spec → Plan → Implement         | Add a filter    |
| **Medium** (feature)         | Full workflow, simplified gates | New report page |
| **Large** (epic)             | Full workflow, all 7 gates      | Needs v2 module |

---

## Quick Links

- [Quality Gates](/ways-of-working/spec-driven-development/10-quality-gates) — Gate details, checklists, and owners
- [Skills Reference](/ways-of-working/spec-driven-development/09-skills-reference) — Complete skill catalogue
- [Interactive Playgrounds](/ways-of-working/spec-driven-development/12-playgrounds) — Explore the pipeline, domains, architecture, and more hands-on
- [Video Walkthroughs](/ways-of-working/spec-driven-development/06-video-walkthroughs) — Watch each phase demonstrated
- [Examples](/ways-of-working/spec-driven-development/02-examples) — Real artifacts from past epics
