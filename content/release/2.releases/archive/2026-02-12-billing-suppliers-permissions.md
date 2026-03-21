---
title: "Billing Processing & Supplier Updates"
description: "Bill validation, supplier pricing improvements, expanded approval roles, and bug fixes"
date: 2026-02-12
version: "2.0.35"
ticket: Multiple
category: release
impact: medium
---

**Released:** 12 February 2026 | **GitHub Release**: [v2.0.35](https://github.com/Trilogy-Care/tc-portal/releases/tag/v2.0.35)  | **Impact:** Medium

## Billing & Finance

### Bill Item Validation for Hours/Quantity

Bill items now validate Hours/Qty values before submission, catching data entry errors earlier and reducing downstream corrections.

### Removed Tier 5 Service Items from Bill Page

Tier 5 service items are no longer displayed on the Bill page, simplifying the billing interface and preventing selection of unsupported tier levels.

### Expanded On-Hold Reason Clearance Roles

Senior Care Partners and Care Partners can now clear on-hold reasons across all supplier and payment hold categories. When they approve, the hold reason moves to "Hold Cleared" and the bill returns to the finance processing queue for final payment approval.

**Who benefits:** Senior Care Partners, Care Partners, Finance Team

### Accounts Payable Added to Missing Bank Details On-Hold Reason

The "Missing bank details" on-hold reason now includes the Accounts Payable role, ensuring the right team members are notified and can action these holds.

**Who benefits:** Accounts Payable Team, Finance Team

### Budget PDF — Removed "No Supplier" Label for Custom Rates

Budget PDFs no longer display a "No supplier" label when services use custom rates. The PDF now correctly omits supplier information when the rate source is not supplier-linked.

**Who benefits:** Clients receiving budget statements

---

## Suppliers

### Service External ID Visible in Supplier Portal

Suppliers can now see service reference numbers (e.g. `[SERV-1234]`) alongside service names in the pricing portal, making it easier to identify and match services accurately.

**Who benefits:** Suppliers managing their service pricing

### Hidden Business Verification for Non-Onboarded Suppliers

The business verification stage is no longer shown in the supplier sidebar when the supplier's portal stage is "Not Onboarded", reducing confusion during the initial setup process.

**Who benefits:** Suppliers, Onboarding Team

---

## Permissions & Access

### Business Manager Notes Access

Business Manager roles can now view notes on packages, providing better visibility into care coordination activity.

**Who benefits:** Business Managers

### Filtered Service Options

Certain service options have been filtered from selection lists to streamline the service selection experience and prevent incorrect selections.

**Who benefits:** All staff selecting services

---

## Bug Fixes

- **Mobile package sidebar** — Fixed an issue where the package sidebar would not open on mobile devices
- **Contact addresses (Mobile App)** — Fixed address data persistence for package contacts, resolving errors when creating or updating care circle contacts with addresses

---

## Technical Notes

<details>
<summary>For developers</summary>

- **Bill Validation:** Added Hrs/Qty validation on bill items (TP-4065)
- **Service Filtering:** Filtered service options from selection (TP-3947)
- **Tier 5 Removal:** Removed tier 5 from bill page display (TP-4032)
- **Supplier Sidebar:** Conditional rendering based on `portal_stage` (TP-3720)
- **Budget PDF:** New `hasSuplierInfo()` method on rate source enum (FUE-8)
- **Address Fix:** Explicit field mapping in `PackageContactProjector` instead of `toArray()`
- **Common Components:** TypeScript refactor of 23 common Vue components for type safety
- **Service Rates Seeder:** New `ServiceTypeDirectIndirectRatesSeeder` (TP-4323)
- **Impersonate Button:** Standardised across the application (TP-4328)

</details>
