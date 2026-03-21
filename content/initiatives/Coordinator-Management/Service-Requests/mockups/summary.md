---
title: "Mockup Summary — Service Requests"
---

# Mockup Summary — Service Requests

## Screens Generated

| # | Screen | File | Description |
|---|--------|------|-------------|
| 01 | Cab Charge Index | `01-cab-charge-index.html` | Recipient profile tab showing table of CC requests with stage badges, Zoho import indicators, and duplicate-active warning |
| 02 | Cab Charge Create | `02-cab-charge-create.html` | Right slide-over form with conditional delivery fields, declaration checkbox, replacement card linking |
| 03 | Cab Charge Show | `03-cab-charge-show.html` | Detail view with stage progression controls, inline transition fields, progress stepper, and vertical stage history timeline |
| 04 | Meals Index | `04-meals-index.html` | Recipient profile tab showing table of meal requests with provider, budget+occurrence, state columns |
| 05 | Meals Create | `05-meals-create.html` | Right slide-over form with provider dropdown, budget+occurrence pair, Yes/No radio groups |

## Key Design Decisions

### Navigation Pattern
- Both modules live as **tabs on recipient profile** — no standalone sidebar pages
- Tab bar: Overview | Care Plan | Needs | Risks | Budget | **Cab Charge** | **Meals** | Documents | Timeline
- Clicking between Cab Charge and Meals tabs is a simple tab switch

### Create Form Pattern
- **Right slide-over** (not modal, not full-page) — keeps recipient context visible behind the overlay
- Pre-filled care plan (read-only, auto-linked)
- Cab Charge: conditional fields toggle based on delivery option selection
- Meals: side-by-side budget + occurrence inputs

### Stage Progression (Cab Charge Show)
- Current stage shown as prominent badge with time-in-stage
- **Action buttons** for valid next stages (not a dropdown — intentional actions)
- Clicking "Sent to Recipient" reveals inline tracking number field
- Clicking "Cancel Request" reveals inline cancellation reason field (required)
- Horizontal stepper shows overall lifecycle progress
- No backward progression — stages only move forward or to cancellation

### Stage History Timeline
- Vertical timeline in right column of Show view
- Each event shows: stage name, date, who changed it, duration in stage
- Current stage has animated pulse indicator
- Future stages shown as greyed-out placeholders

### Zoho Import Indicators
- Small "Zoho" badge next to request ID in table rows
- Zoho rows have subtle grey background tint
- Legacy stages from Zoho shown as "Legacy: [stage name]" in amber badge
- Legend at bottom of table explains indicators

### Duplicate Active Warning
- Orange warning banner shown when recipient has multiple active Cab Charge requests
- Informational only — doesn't block creation (matches spec decision)

## Recommendations

1. **Slide-over for Create/Edit** — works well for single-entity forms, keeps context visible
2. **Show view as standalone page** (not slide-over) — the stage progression controls and timeline need more space
3. **Consider Edit as same slide-over** — pre-fill with existing data, disable stage fields (stage changes only through progression controls)
4. **Meals Show view** follows same pattern as Cab Charge Show — simpler lifecycle (4 stages vs 8) but same layout

## Next Steps

- [ ] `/trilogy-design-handover` — Gate 2 (Design → Dev)
- [ ] `/speckit-plan` — Technical implementation plan
- [ ] `/speckit-tasks` — Implementation task breakdown
