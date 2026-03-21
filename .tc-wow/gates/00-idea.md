# Gate 0: Idea Gate

**Transition**: Idea → Spec (Discovery)
**Linear Transition**: Create epic → **Planned**
**meta.yaml**: `status: planned`

**Key Question**: "Is this idea clear enough to invest in specification?"

Validates the idea brief is complete, the problem statement is simple and clear, RACI is populated with HOD as Accountable, and the brief is concise (1-2 pages). Run via `/trilogy-idea-handover` after creating the idea brief.

---

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| `idea-brief.md` | Yes | Epic folder |
| Epic folder structure | Yes | `context/{raw_context,rich_context,epic_channels}` |

---

## Checks

### 1. Problem Statement Clarity

| Check | Pass Criteria |
|-------|---------------|
| **Problem statement exists** | `## Problem Statement` section is present |
| **Simple language** | A non-technical stakeholder can understand it in one read |
| **User-facing pain points** | Describes what users experience, not system limitations |
| **Current state described** | How things work today, with metrics if available |
| **No implementation details** | No mention of API, database, migration, framework |

### 2. Brief Completeness

| Check | Pass Criteria |
|-------|---------------|
| **Solution outlined** | `## Possible Solution` with before/after example |
| **Benefits quantified** | At least one metric (time saved, % improvement, $ value) |
| **Risks identified** | At least one risk with severity and mitigation |
| **Effort estimated** | T-shirt size or sprint count provided |
| **Proceed to PRD answered** | YES/NO with brief reason |
| **Decision section present** | Approval checkboxes exist |

### 3. Brief Quality

| Check | Pass Criteria |
|-------|---------------|
| **Brevity** | 120-150 lines max (1-2 pages) |
| **Active voice** | "Coordinators can..." not "It is possible to..." |
| **TC terminology** | Uses Package, Recipient, Coordinator, Supplier, Service, Budget, Contribution |
| **No technical jargon** | No API, database, component, migration mentions |
| **Bullet points over paragraphs** | Concise, scannable format |

### 4. RACI & HOD Acknowledgement

| Check | Pass Criteria |
|-------|---------------|
| **Owner (R) identified** | Name and role present |
| **HOD as Accountable (A)** | Head of Department or executive sponsor named — not blank, not "TBD" |
| **Consulted (C) populated** | At least one subject matter expert named |
| **Informed (I) populated** | At least one downstream stakeholder, or `—` with explanation |
| **HOD acknowledged** | The Accountable person has been informed this idea is being formalised |

**CRITICAL**: The **A** (Accountable) must be the HOD or equivalent executive. This person is ultimately answerable for the decision to proceed. If missing, Gate 0 fails.

---

## Gate Actions

### On Pass

1. **Create Linear epic** in Planned state
2. **Push idea brief** as a Linear document on the epic
3. **Post gate summary** as a Linear comment
4. **Update meta.yaml** with `status: planned`, `linear_project_id`, `linear_url`
5. **Advise user** to organise discovery/alignment meeting with Consulted stakeholders
6. Log gate passage

### On Fail

- List failed checks with specific issues
- Offer to fix inline (rewrite problem statement, trim brief, fill RACI)
- Suggest remediation (re-run `/trilogy-idea` with clearer input)
- Support `--force` to proceed with documented gaps

---

## Output

Gate check summary:

```markdown
## Idea Gate Check
**Date**: YYYY-MM-DD
**Status**: PASS / FAIL

### Problem Statement Clarity
- [x] Problem statement exists
- [x] Simple language
- [x] User-facing pain points
- [x] Current state described
- [x] No implementation details

### Brief Completeness
- [x] Solution outlined
- [x] Benefits quantified
- [x] Risks identified
- [x] Effort estimated
- [x] Proceed to PRD answered
- [x] Decision section present

### Brief Quality
- [x] Brevity (120-150 lines)
- [x] Active voice
- [x] TC terminology
- [x] No technical jargon
- [x] Bullet points over paragraphs

### RACI & HOD
- [x] Owner (R): [Name] ([Role])
- [x] Accountable (A) / HOD: [Name]
- [x] Consulted (C): [Names]
- [x] Informed (I): [Names]
- [x] HOD acknowledged

### Linear
- Epic created in Planned: [URL]
- Idea brief pushed as document

**Ready for Specification**: YES / NO
```

---

## Next Steps (on pass)

Based on the RACI, the **Owner** should:

1. **Organise a discovery/alignment meeting** with Consulted stakeholders
   - Purpose: Validate the problem, refine scope, agree on approach
   - The HOD (Accountable) should attend for sign-off
2. After alignment, begin specification:
   - `/speckit-specify` — Create feature specification
   - `/trilogy-clarify spec` — Refine requirements
   - `/trilogy-clarify business` — Align on business objectives
   - `/trilogy-spec-handover` — Gate 1 (stays in Planned)

---

## When to Skip

Idea Gate can be simplified for:
- Bug fixes (no idea brief needed — go straight to spec or code)
- Compliance/security requirements with clear mandate
- Direct executive request with pre-approved scope

Always document if gate is skipped and why.

---

## Integration

Referenced by:
- `/trilogy-idea` - Produces idea-brief.md
- `/trilogy-idea-handover` - Runs this gate, creates Linear epic

After this gate:
- `/speckit-specify` - Creates feature specification
- `/trilogy-spec-handover` - Gate 1 (stays in Planned)
