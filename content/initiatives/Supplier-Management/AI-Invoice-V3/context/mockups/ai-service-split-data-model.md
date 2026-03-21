# AI Service Split — Data Model

Companion document for [ai-service-split.html](./ai-service-split.html).

Covers how split bill items relate to each other in the database when AI detects multiple SERTs in a single line item (User Story 5 / FR-020–024).

---

## Relationship Chain

1. **Original bill item** ("General house cleaning & personal care" — $500) gets split
2. **Split Child A** — scoped to SERT 1 (Domestic Assistance), inherits original context
3. **Split Child B** — scoped to SERT 2 (Personal Care), inherits original context

The original row is soft-hidden (status = `split`) but never deleted. "Undo split" deletes the children and restores the parent.

---

## `ai_extraction` JSON Structure

### On the Original Bill Item (hidden, status=split)

```json
{
  "split": {
    "is_split": true,
    "child_bill_item_ids": [42, 43],
    "split_source": "ai",
    "split_at": "2026-02-26T10:00:00Z"
  },
  "classification": {
    "serts_detected": 2,
    "serts": {
      "SERT_1": {
        "confidence": 0.95,
        "name": "Domestic Assistance",
        "services": {
          "SERV_1": { "name": "General house cleaning", "confidence": 0.92 },
          "SERV_2": { "name": "Laundry services", "confidence": 0.87 }
        }
      },
      "SERT_2": {
        "confidence": 0.88,
        "name": "Personal Care",
        "services": {
          "SERV_6": { "name": "Showering assistance", "confidence": 0.81 }
        }
      }
    }
  }
}
```

### On Split Child A (bill_item_id: 42)

```json
{
  "split": {
    "is_split_child": true,
    "parent_bill_item_id": 41,
    "split_leg": "A"
  },
  "classification": {
    "suggested_sert": "Domestic Assistance",
    "confidence": 0.95,
    "services": [
      { "id": "SERV_1", "name": "General house cleaning", "confidence": 0.92 },
      { "id": "SERV_2", "name": "Laundry services", "confidence": 0.87 }
    ]
  }
}
```

### On Split Child B (bill_item_id: 43)

```json
{
  "split": {
    "is_split_child": true,
    "parent_bill_item_id": 41,
    "split_leg": "B"
  },
  "classification": {
    "suggested_sert": "Personal Care",
    "confidence": 0.88,
    "services": [
      { "id": "SERV_6", "name": "Showering assistance", "confidence": 0.81 }
    ]
  }
}
```

---

## Design Decisions

| Question | Decision | Rationale |
|----------|----------|-----------|
| Are split children real `BillItem` rows? | **Yes** — real DB rows | Simpler downstream processing; each child flows through the normal service selection, GST, loading, and payment pipeline |
| How is the dollar amount split? | **AI suggests** based on SERT confidence ratio; **user can adjust** in the split panel before confirming | FR-022 requires AI-suggested categories per split; user retains control |
| Can user submit with partial service selection? | **No** — both split children must have a service linked before bill can proceed | Prevents orphan line items that would fail downstream validation |
| Does "Undo split" work after services are linked? | **Yes** — unlinks services, deletes children, restores parent | Must be reversible at any point before bill is submitted/approved |
| What `status` does the original item get? | `split` — hidden from table but preserved for audit | Maintains full audit trail; `undo` restores to previous status |

---

## Spec Coverage

This mockup addresses the following from spec.md:

| Spec Item | Covered | Notes |
|-----------|---------|-------|
| **US5** Multi-Service Detection | Yes | Two-scenario flow (sunny day vs split) |
| **FR-020** Detect multiple keywords | Yes | AI payload triggers split recommendation |
| **FR-021** Display warning | Yes | Amber "Split recommended" chip with pulse |
| **FR-022** Split with AI categories | Yes | Panel shows SERT cards with confidence |
| **FR-023** "Pay as-is, notify supplier" | **No** | Not yet in mockup — needs adding |
| **US1** AI-Assisted Classification | Partial | Confidence shown; reasoning panel not yet shown |
| **US2** Breadcrumb Hierarchy | **No** | Chip shows category name only, not full Tier 1 > Tier 2 > Tier 3 |
| **US3** Scoped Service Selection | Partial | Modal pre-filters to SERT; step-back navigation missing |
| **US4** Promote Unplanned Service | Partial | Unplanned badge shown; prominent CTA missing |
| **US6** Travel/Transport | **No** | Not addressed in mockup |
| **FR-012** Confidence colours | **No** | Uses violet for all; spec says green/yellow/orange |
| **FR-017** Contribution category warning | **No** | Not shown when user overrides |
| **FR-031** Top 3 alternatives | **No** | Only primary suggestion shown |
