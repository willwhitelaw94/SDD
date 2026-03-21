# Gates

Quality checkpoints at each phase of the development workflow. Gates run **after** each phase validates its output before progressing to the next phase.

## The Seven Gates

| # | Gate | File | Runs After | Key Question | Skill | Linear Transition |
|---|------|------|------------|--------------|-------|-------------------|
| 0 | **Idea** | `00-idea.md` | Idea Brief | "Is this idea clear enough to invest in?" | `/trilogy-idea-handover` | Create → **Planned** |
| 1 | **Spec** | `01-spec.md` | Spec | "Is this spec ready for design?" | `/trilogy-spec-handover` | *(stays in Planned)* |
| — | **Design Kickoff** | — | Spec Handover | "Ready to start design?" | `/trilogy-design-kickoff` | Planned → **Design** |
| 2 | **Design** | `02-design.md` | Design (Kickoff + Mockups) | "Is it ready to hand off to Dev?" | `/trilogy-design-handover` | Design → **Dev** |
| 3 | **Architecture** | `03-architecture.md` | Plan | "Will the structure hold?" | `/speckit-plan` | *(stays in Dev)* |
| 4 | **Code Quality** | `04-code-quality.md` | Code | "Is it ready to inspect?" | `/trilogy-dev-handover` | Dev → **QA** |
| 5 | **QA** | `05-qa.md` | QA Testing | "Does it actually work?" | `/trilogy-qa-handover` | QA → **Release** |
| 6 | **Release** | `06-release.md` | Release | "May this enter the city?" | *Release Agent* | Release → **Completed** |

## Workflow

```
Idea → [Gate 0] → Spec → [Gate 1] → Design Kickoff → Design → [Gate 2] → Plan → [Gate 3] → Code → [Gate 4] → QA → [Gate 5] → Release → [Gate 6] → Production
```

## Linear Status Lifecycle

Each gate transitions the Linear epic through a defined status:

```
           Gate 0          Gate 1       Kickoff        Gate 2                  Gate 4       Gate 5        Gate 6
Create ──→ Planned ──────→ Planned ──→ Design ─────→ Dev ──────────────────→ QA ────────→ Release ────→ Completed
            │                │           │              │                      │            │
            │                │           │              ├── Gate 3 (stays)     │            │
            │                │           │              │                      │            │
         idea-brief       spec.md    design.md       plan.md              PR created    QA passed     Released
         created          validated  + mockups       + tasks              tests pass    staging OK    production
```

**Linear state names** (workspace-specific): `Backlog`, `Planned`, `Design`, `Dev`, `QA`, `Release`, `Blocked`, `Completed`, `Canceled`
**meta.yaml status** (canonical lowercase): `planned`, `design`, `in progress`, `qa`, `release`, `blocked`, `completed`, `canceled`

## Phase Breakdowns

**Idea Phase:**
```
/trilogy-idea              → idea-brief.md (problem, solution, RACI)
/trilogy-idea-handover     → Gate 0 (Create epic → Planned)
```

**Spec Phase:**
```
/speckit-specify           → spec.md (feature specification)
/trilogy-clarify spec      → refine requirements
/trilogy-clarify business  → align on business objectives
/trilogy-spec-handover     → Gate 1 (stays in Planned)
```

**Design Phase:**
```
/trilogy-design-kickoff    → Planned → Design + design.md (design brief)
/trilogy-design-research   → enrich design.md (competitive, audits — optional)
/trilogy-clarify design    → refine design decisions
/trilogy-mockup            → mockups/ (UI specifications, wireframes)
/trilogy-design-handover   → Gate 2 (Design → Dev)
```

**Dev Phase:**
```
/speckit-plan              → plan.md (technical plan) → Gate 3 (Architecture)
/trilogy-clarify dev       → refine plan
/speckit-tasks             → tasks.md (implementation tasks)
→ Implementation
/trilogy-dev-handover      → Gate 4 (Dev → QA)
```

**QA & Release:**
```
/trilogy-qa-handover       → Gate 5 (QA → Release)
Release Agent              → Gate 6 (Release → Completed)
```

## Gate Responsibilities

| # | Gate | Who | What They Check | Linear Action |
|---|------|-----|-----------------|---------------|
| 0 | Idea | Product Owner | Problem clarity, RACI, HOD sign-off, brevity | Create epic in Planned |
| 1 | Spec | PM/Product | Spec quality, INVEST criteria, business alignment | *(stays in Planned)* |
| — | Design Kickoff | Designer/Product | Ready to start design? | Planned → Design |
| 2 | Design | Designer/Product + Dev | UI mockups, edge cases, technical feasibility | Design → Dev |
| 3 | Architecture | Architect/Developer | Architecture, data model, Laravel best practices | *(stays in Dev)* |
| 4 | Code Quality | Developer | Tests pass, code quality, AC implemented, PR ready | Dev → QA |
| 5 | QA | QA Tester | Functional testing, cross-browser, accessibility | QA → Release |
| 6 | Release | Product Owner + Stakeholders | Final approvals, UAT, release readiness | Release → Completed |

## Usage

Gates are invoked through skills after completing each phase:

```bash
/trilogy-idea-handover     # After idea brief, runs Gate 0: creates Linear epic in Planned
/trilogy-spec-handover     # After spec + clarify, runs Gate 1: stays in Planned
/trilogy-design-kickoff    # Kicks off design phase: Planned → Design
/trilogy-design-handover   # After design (kickoff + mockups), runs Gate 2: Design → Dev
/speckit-plan              # After plan, runs Gate 3: Architecture (stays in Dev)
/trilogy-dev-handover      # After code, runs Gate 4: Dev → QA
/trilogy-qa-handover       # After QA testing, runs Gate 5: QA → Release
# Gate 6 is handled by the Release Agent
```

## Gate Structure

Each gate file contains:
1. **Transition** - Phase transition and Linear status change
2. **Prerequisites** - What must exist before this gate
3. **Checks** - What the gate verifies
4. **Pass Criteria** - When the gate passes
5. **Gate Actions** - What happens on pass (including Linear update)
6. **Fail Actions** - What to do if checks fail
7. **Output** - What the gate produces/updates

## When to Skip Gates

Some gates can be simplified for certain scenarios:

| Scenario | Gates to Simplify |
|----------|-------------------|
| Bug fixes | Idea, Spec (already committed), Design (if no UI changes) |
| Minor UI tweaks | Architecture (uses existing patterns) |
| Backend-only features | Design (no UI changes) |
| Compliance/security | Spec (must do) |
| Direct executive mandate | Idea (pre-approved scope) |

Always document if a gate is skipped and why.
