---
title: "Workshop Run Sheet - Feb 4, 2026"
description: "Ways of Working overview and spec-driven development workflow"
---

## Run Sheet

| # | Topic | Notes |
|---|-------|-------|
| 1 | TC DOCS Tour | Walk through the knowledge hub |
| 2 | Spec-Driven Development | The workflow, gates, artifacts |
| 3 | Linear Structure | Initiatives → Projects → Issues |
| 4 | Ticket Status Workflow | New 9-stage pipeline |
| 5 | Epic Management | MVP splits, 8-week cycles |
| 6 | Communication | Sub-initiatives, Teams chat structure |
| 7 | AI Integration | Spec Kit demo |

---

## 1. TC DOCS Tour

| Section | What's There |
|---------|--------------|
| **Overview** | Mission, org structure, onboarding |
| **Ways of Working** | This stuff - Claude, specs, team practices |
| **Context** | Feature domains, integrations, personas |
| **Strategy** | Leadership priorities, competitors, BRP |
| **Initiatives** | Active epics and specs |
| **Release** | Release notes, comms plans |
| **Developer Docs** | Architecture, APIs, standards |

---

## 2. Spec-Driven Development

**Flow**: Specify → Clarify → Visualize → Plan → Implement

### 6 Quality Gates

| Gate | Question | Owner |
|------|----------|-------|
| Business | Worth building? | PM |
| Design | Look right? | Designer |
| Architecture | Structure hold? | Architect |
| Code Quality | Ready to inspect? | Dev |
| QA | Actually work? | QA |
| Release | Ready for prod? | PO |

---

## 3. Linear Structure

```
Initiative (e.g., Work Management)
└── Sub-initiative (e.g., Consumer Lifecycle Pod)
    └── Project/Epic (e.g., Consumer Portal MVP)
        └── Issue (User Story)
            └── Sub-issue (Task)
```

---

## 4. Ticket Status Workflow

**9 statuses** agreed:

| Status | Who Moves It |
|--------|--------------|
| Backlog | PM/BA |
| To Do | PM/BA |
| In Progress | Dev |
| Peer Review | Dev |
| QA | QA |
| Ready for Release | PM |
| Done | System |
| Closed (Canceled) | PM |
| Closed (Can't Reproduce) | QA |

**Key**: QA is its own stage, not lumped with peer review.

---

## 5. Epic Management

| Change | Why |
|--------|-----|
| Startable/finishable epics | No open-ended platforms |
| MVP first, then v2 epic | Ship value early |
| ~8-week release cycles | Reflects actual cadence |

---

## 6. Communication

### Sub-initiatives

Group Teams chats and projects by pod/function:

```
Initiative
└── Sub-initiative (Pod-specific)
    ├── Teams Chat: Requirements
    ├── Teams Chat: Updates
    └── Projects
```

### BA Role

- Filter chat noise for devs
- Funnel info into specs and tickets
- AI helps with search/summarization

---

## 7. AI Integration

### Spec Kit Workflow

1. `/trilogy-idea` → Problem
2. `/speckit-specify` → Solution spec
3. `/trilogy-clarify` → Fill gaps
4. `/speckit-plan` → Technical approach
5. `/speckit-tasks` → Generate Linear issues
6. `/speckit-implement` → AI builds it

---

## Topics from BRP Meeting

### What's Already in Docs

- Spec-driven workflow
- Quality gates (6 gates with owners)
- Linear structure (Initiatives → Projects → Issues)

### What Needs Adding

| Topic | Status |
|-------|--------|
| 9-stage ticket workflow | Discussed, not documented |
| Sub-initiatives construct | New concept |
| MVP epic splitting | New approach |
| BA filtering role | Implied, not explicit |

### Potential Conflicts

| Area | Notes |
|------|-------|
| Cycle length | Cycles = sprints (2 weeks), Epics = ~8 weeks. Not conflicting. |
| QA stage | Meeting emphasized QA as distinct. Docs already have QA gate. Aligned. |

---

## Action Items

**Will**
- Spec Kit workshop (today)
- Create sub-initiatives
- Update Linear statuses
- Jira migration

**Cassandra**
- Ticket status docs
- Design team custom statuses
- Testing workflow with Tim

**David**
- BA chat filtering
- Ticket workflow adoption
- Spec-driven dev feedback

---

## Quick Links

- [Spec-Driven Development](/ways-of-working/spec-driven-development)
- [Quality Gates](/ways-of-working/spec-driven-development/10-quality-gates)
- [Linear Structure](/ways-of-working/linear/02-structure)
