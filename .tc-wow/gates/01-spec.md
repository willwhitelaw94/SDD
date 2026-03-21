# Gate 1: Spec Gate

**Transition**: Spec validated (stays in Planned)
**Linear Transition**: *(stays in Planned)*
**meta.yaml**: `status: planned`

**Key Question**: "Is this spec ready for design?"

Validates the specification follows product best practices and is ready to hand off to design. Run via `/trilogy-spec-handover` after spec and clarification are complete.

---

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| `spec.md` | Yes | Epic folder |
| `IDEA-BRIEF.md` | Recommended | Epic folder |
| Stakeholder input | Recommended | Teams chat, meetings |

---

## Checks

### 1. Product Best Practices

| Check | Pass Criteria |
|-------|---------------|
| **Problem statement clear** | Specific pain point identified |
| **User personas defined** | Who are we building for? |
| **Jobs-to-be-done articulated** | What are users trying to accomplish? |
| **Success metrics defined** | How will we measure success? |
| **Constraints documented** | What limits our options? |
| **Assumptions explicit** | What are we taking for granted? |

### 2. Content Quality

| Check | Pass Criteria |
|-------|---------------|
| **No implementation details** | Stories focus on outcomes, not solutions |
| **Business language throughout** | Avoid technical jargon |
| **User value clearly stated** | Each story explains "why" |
| **Measurable success criteria** | Specific, testable targets |

### 3. Requirement Completeness

| Check | Pass Criteria |
|-------|---------------|
| **All requirements testable** | Given/When/Then format |
| **Edge cases documented** | What could go wrong? |
| **Dependencies listed** | What blocks us? |
| **Out of scope defined** | What are we NOT building? |
| **No [NEEDS CLARIFICATION] markers** | All questions resolved |

### 4. INVEST Criteria (per story)

| Criteria | Pass Criteria |
|----------|---------------|
| **Independent** | Can be delivered standalone |
| **Negotiable** | Details are flexible |
| **Valuable** | Clear user/business value |
| **Estimable** | Scope is well-defined |
| **Small** | Single user flow |
| **Testable** | Acceptance scenarios defined |

---

## Gate Actions

### On Pass
- Proceed to `/trilogy-design-kickoff` for design kickoff (Planned → Design)
- Log gate passage
- Notify design team spec is ready

### On Fail
- Refine the spec
- Add missing sections
- Clarify requirements
- Re-run gate

---

## Output

Gate check summary:

```markdown
## Spec Gate Check
**Date**: YYYY-MM-DD
**Status**: PASS / FAIL

### Product Best Practices
- [x] Problem statement clear
- [x] User personas defined
- [x] Jobs-to-be-done articulated
- [x] Success metrics defined
- [x] Constraints documented
- [x] Assumptions explicit

### Content Quality
- [x] No implementation details
- [x] Business language throughout
- [x] User value clearly stated
- [x] Measurable success criteria

### Requirement Completeness
- [x] All requirements testable
- [x] Edge cases documented
- [x] Dependencies listed
- [x] Out of scope defined
- [x] No clarification markers

### INVEST Summary
| Story | I | N | V | E | S | T |
|-------|---|---|---|---|---|---|
| US1   | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| US2   | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Ready for Design Kickoff**: YES / NO
```

---

## When to Skip

Spec Gate can be simplified for:
- Bug fixes (already committed to fix)
- Compliance/security requirements (must do)
- Direct stakeholder request with clear mandate

Always document if gate is skipped and why.

---

## Integration

Referenced by:
- `/speckit-specify` - Runs this gate after creating spec
- `/trilogy-design-kickoff` - Expects this gate to have passed
