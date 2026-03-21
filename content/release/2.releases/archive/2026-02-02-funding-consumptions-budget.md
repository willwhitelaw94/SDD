---
title: "Funding Consumptions in Budget Page"
description: "View funding consumptions directly on the budget page"
date: 2026-02-02
version: "5.7"
ticket: TP-3977
category: feature
impact: medium
---

# Funding Consumptions in Budget Page

**Released:** 2 February 2026 | **Ticket:** [TP-3977](https://trilogycare.atlassian.net/browse/TP-3977) | **Impact:** Medium

---

## What's New

The Budget Page now displays funding consumptions directly, giving staff a complete view of how funding is being used without navigating to separate screens.

### Consumptions List

View all funding consumptions for a budget including:
- **Consumption details** - What services are consuming the funding
- **Amounts** - How much of each funding stream is being used
- **Dates** - When consumptions occurred
- **References** - Links to related bills and services

**How it works:**
1. Navigate to a package's Budget page
2. Scroll to the Funding Consumptions section
3. View the complete list of consumptions
4. Click on any entry for more details

**Who benefits:** Finance Team, Care Managers, Budget Administrators

---

## Key Features

### Consolidated View

All funding information in one place:
- No need to navigate between multiple screens
- See consumptions alongside budget allocations
- Quick identification of funding usage patterns

### Filtering & Search

Find specific consumptions quickly:
- Filter by funding stream
- Search by reference number
- Sort by date or amount

### Export Ready

Data available for reporting:
- Consumptions data accessible via API
- Consistent format for external analysis
- Supports budget reconciliation workflows

---

## Technical Notes

<details>
<summary>For developers</summary>

- **Component:** Budget page Vue component
- **API:** `GET /api/v2/packages/{id}/budget-page-data`
- **Data:** Uses existing `funding_consumptions` table
- **Authorization:** Requires budget view permissions

</details>

---

## Related

- [Budget Management](/features/domains/budgets)
- [Collections Initiative](/initiatives/Budgets-And-Finance/Collections-V2)
