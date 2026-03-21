# Gate 2: Design Handover Gate

**Transition**: Design → Dev (Planning/Architecture)
**Linear Transition**: **Design** → **Dev**
**meta.yaml**: `status: in progress`

**Key Question**: "Is the design complete and ready to hand off to Dev?"

Verifies the design phase is complete - kickoff done, mockups created, edge cases documented. Run via `/trilogy-design-handover` after both design kickoff and mockups are complete. Transitions work from Design to Dev.

---

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| spec.md | Yes | Initiative folder |
| design.md | Yes | Initiative folder (from `/trilogy-design`) |
| mockups/ | Yes | Initiative folder (from `/trilogy-mockup`) |

**Workflow to reach this gate:**
```
/speckit-specify         → spec.md
/trilogy-design          → design.md (kickoff brief)
/trilogy-mockup          → mockups/ (UI specifications)
/trilogy-design-handover → This gate (Design → Dev transition)
```

**After this gate passes:**
```
[DEV PHASE BEGINS]
/speckit-plan            → plan.md (technical plan)
/speckit-tasks           → tasks.md (implementation tasks)
```

---

## Checks

### 1. Design Completeness

| Check | Pass Criteria |
|-------|---------------|
| **UI mockups exist** | Visual representation of all key screens |
| **User flows documented** | Happy path and error states mapped |
| **Component decisions made** | Existing vs new components identified |
| **Responsive approach defined** | Mobile/tablet/desktop strategy clear |
| **Accessibility considered** | WCAG requirements noted |

### 2. Design-Spec Alignment

| Check | Pass Criteria |
|-------|---------------|
| **Mockups match spec** | All features in spec have visual representation |
| **Edge cases visualized** | Error states, empty states, loading states |
| **Data display defined** | What data shows where, format, truncation |
| **Interactions specified** | Hover, click, drag behaviors documented |

### 3. Technical Feasibility

| Check | Pass Criteria |
|-------|---------------|
| **Existing patterns used** | Leverages existing UI components where possible |
| **No impossible layouts** | Design is implementable with current tech |
| **Performance considered** | No obvious performance concerns |
| **Data availability confirmed** | Required data exists or is planned |

### 4. Stakeholder Alignment

| Check | Pass Criteria |
|-------|---------------|
| **Design approved** | Product/design stakeholders signed off |
| **No open design questions** | All design decisions resolved |
| **Scope matches spec** | Design doesn't exceed spec boundaries |

---

## Gate Actions

### On Pass
- Proceed to `/speckit-plan` to create technical implementation plan
- Design constraints are documented for dev planning
- Edge cases identified to inform implementation approach
- Handover summary generated for dev team

### On Fail
- Return to `/trilogy-design` to fill gaps in kickoff brief
- Complete missing sections (user research, edge cases, constraints)
- Get stakeholder alignment on design decisions
- Use `--force` to proceed with documented gaps (risk acknowledged)

---

## Output

Gate check summary:

```markdown
## Design Gate Check
**Date**: YYYY-MM-DD
**Status**: PASS / FAIL

### Design Completeness
- [x] UI mockups for all key screens
- [x] User flows documented
- [x] Component decisions made
- [x] Responsive approach defined
- [x] Accessibility considered

### Design-Spec Alignment
- [x] All spec features have mockups
- [x] Edge cases visualized
- [x] Data display defined
- [x] Interactions specified

### Technical Feasibility
- [x] Uses existing patterns where possible
- [x] Implementable with current tech
- [x] Performance considered

### Stakeholder Alignment
- [x] Design approved by [name]
- [x] No open design questions

**Ready for Planning**: YES / NO
```

---

## When to Skip

Design Gate can be simplified for:
- Backend-only features (no UI changes)
- Minor UI tweaks (use existing patterns)
- Bug fixes (design already exists)

Always document if gate is skipped and why.

---

## Integration

**Referenced by:**
- `/trilogy-design` - Produces design.md (kickoff brief)
- `/trilogy-mockup` - Produces mockups/
- `/trilogy-design-handover` - Runs this gate, transitions to Dev, posts Linear comment

**Triggers:**
- Updates Linear project status from "Design" to "In Progress" (Dev)
- Posts handover summary as comment in Linear project
- Moves work from Design team to Development team

**After this gate:**
- `/speckit-plan` - Creates technical implementation plan (Dev phase)
