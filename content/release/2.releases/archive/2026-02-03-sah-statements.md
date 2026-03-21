---
title: "Support at Home Statements"
description: "Digital statement generation for Support at Home packages"
date: 2026-02-03
version: "5.8"
ticket: TP-901
category: feature
impact: high
---

# Support at Home Statements

**Released:** 3 February 2026 | **Ticket:** [TP-901](https://trilogycare.atlassian.net/browse/TP-901) | **Impact:** High

---

## What's New

Staff can now generate comprehensive digital statements for Support at Home (S@H) packages directly from the Portal. This replaces the previous manual statement preparation process.

### Statement Generation

Generate professional PDF statements that include:
- **Budget Spend Summary** - Clear breakdown of spending by funding stream and service category
- **Funding Summary** - Overview of allocated funding across all streams
- **Expenses Detail** - Itemized list of all expenses with dates and amounts
- **Contributions Summary** - Voluntary contributions and invoice history

**How it works:**
1. Navigate to a Support at Home package
2. Click "Generate Statement" from the package actions
3. Select the statement period
4. PDF is generated and available for download or email

**Who benefits:** Care Managers, Finance Team, Consumers receiving S@H packages

---

## Key Features

### Budget Spend Summary Pages

Each statement includes detailed budget spend pages showing:
- Spending by funding stream (Home Care, ATHM, Voluntary Contributions)
- Service category breakdowns
- Monthly spending trends
- Remaining budget calculations

### Contributions Tracking

Complete visibility of voluntary contributions including:
- Invoice history with dates and amounts
- Monthly contribution summaries
- Outstanding balance tracking

### Expenses Detail

Full itemization of all expenses with:
- Service provider details
- Service dates and descriptions
- Unit costs and quantities
- Total amounts by category

---

## Technical Notes

<details>
<summary>For developers</summary>

- **New Domain:** `domain/Statement/` with Assembler pipeline architecture
- **Pipeline Pattern:** Uses Laravel pipeline for modular PDF assembly
- **Data Classes:** Type-safe DTOs for all statement sections
- **Database:** No schema changes - reads from existing budget/funding tables
- **Dependencies:** Uses existing PDF generation infrastructure

**Key Files:**
- `GenerateStatementPdfAction.php` - Main action class
- `StatementPDFAssemblerPipeline.php` - Orchestrates PDF assembly
- `Assembler/Pipes/*` - Individual section assemblers

</details>

---

## Related

- [Digital Statements Initiative](/initiatives/Budgets-And-Finance/Digital-Statements)
- [Budget Management](/features/domains/budgets)
