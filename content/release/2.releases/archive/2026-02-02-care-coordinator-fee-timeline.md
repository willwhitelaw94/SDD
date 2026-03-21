---
title: "Care Coordinator Fee Timeline"
description: "Timeline view of care coordinator fee changes for packages"
date: 2026-02-02
version: "5.7"
ticket: TP-3965
category: feature
impact: medium
---

# Care Coordinator Fee Timeline

**Released:** 2 February 2026 | **Ticket:** [TP-3965](https://trilogycare.atlassian.net/browse/TP-3965) | **Impact:** Medium

---

## What's New

Packages now display a timeline of care coordinator fee changes, providing visibility into how coordination fees have evolved over time. This helps staff understand fee history and plan for upcoming changes.

### Fee History Timeline

The new timeline shows:
- **Historical fees** - Past fee amounts with effective dates
- **Current fee** - Active coordination fee highlighted
- **Future fees** - Scheduled fee changes (if any)

**How it works:**
1. Navigate to a package
2. View the Care Coordinator Fee section
3. See the complete fee timeline with dates and amounts
4. Hover over entries for additional details

**Who benefits:** Finance Team, Care Managers, Package Administrators

---

## Key Features

### Visual Timeline

A clear visual representation of fee changes:
- Chronological ordering from oldest to newest
- Current period highlighted
- Easy identification of when fees changed

### Audit Trail

Full visibility for compliance and reporting:
- Who made each change (when available)
- Effective dates for each fee period
- Historical record preserved

### Budget Impact

Helps with budget planning:
- See how fees affect overall package costs
- Identify trends in coordination expenses
- Plan for known future fee changes

---

## Technical Notes

<details>
<summary>For developers</summary>

- **Location:** Package detail page
- **Data Source:** Existing fee history tables
- **Component:** New Vue timeline component
- **API:** Uses existing package endpoints

</details>

---

## Related

- [Package Management](/features/domains/packages)
- [Budget Management](/features/domains/budgets)
