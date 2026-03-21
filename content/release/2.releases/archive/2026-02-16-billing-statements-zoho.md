---
title: "Billing, Statements & Zoho Webhook Improvements"
description: "Fee exemptions, bill escalation for on-hold, GST enforcement for non-registered suppliers, statement accuracy fixes, MYOB integration updates, and Zoho webhook hardening"
date: 2026-02-16
version: "2.0.36"
ticket: Multiple
category: release
impact: high
---

**Released:** 16 February 2026 | **GitHub Release**: [v2.0.36](https://github.com/Trilogy-Care/tc-portal/releases/tag/v2.0.36) | **Impact:** High

## Billing & Finance

### TC/CC Loading Fee Exemption

Admins can now waive Trilogy Care (TC) and/or Care Coordinator (CC) loading fees directly on the Bill page. A new dropdown next to the VC Approved toggle allows selecting which fees to exempt — TC only, CC only, or both. When an exemption is applied, the funding allocation engine zeroes out the corresponding fee percentages, and the change is recorded in the bill activity timeline.

Self-Managed (SM) packages only see the TC exemption option; Self-Managed Plus (SM+) packages see all three options.

**Permission:** `exempt-bill-loading-fees` — restricted to Admin role.

### Bill Escalation Changes

- The escalate action on the Bill page is no longer limited to Submitted bills — it now also works for On-Hold bills.
- Bills can now only be escalated to a set list of users rather than all processing users.

**Who benefits:** Bill Processing Team, Care Partners

### GST Enforcement for Non-Registered Suppliers

When a supplier's organisation is not registered for GST, bill line items now automatically default to "No GST" and the GST dropdown is locked with a tooltip explaining why. Switching to a non-GST-registered supplier recalculates all existing line items to No GST. Admins and Bill Processing Managers can override this restriction via the new `bill-gst-override` permission.

**Who benefits:** Finance Team, Bill Processing Team

### HOLD_PAYMENTS Supplier Status Now Approvable

Bills from suppliers whose main bank details are in `HOLD_PAYMENTS` status can now be reviewed and approved, alongside the existing `ACTIVE` and `ONE_TIME` statuses. This prevents bills from being blocked when a supplier's payments are intentionally held while still maintaining proper bank detail validation.

**Who benefits:** Finance Team, Bill Processing Team

### Service Date Column Now Sortable

The Service Date column on the Bills table is now sortable. It sorts by the earliest service date across all bill items, with null dates sorted last.

**Who benefits:** All bill processing staff

---

## Statement Preparation

### AT/HM Statement Bundle Generation

A new artisan command (`app:generate-athm-statement-bundle`) generates statement PDFs for multiple packages at once and bundles them into a downloadable ZIP file organised by TCID. The command runs in dry-run mode by default so no data is persisted (funding consumption `statement_month` values are not updated), with an additional database transaction rollback as a safety net.

### Statement Amount Consistency Across Quarters

Statement amounts now correctly reflect quarter-to-date totals rather than single-period values. Key fixes include:

- **Expenses page** now shows accurate monthly totals and quarter-to-date totals calculated from funding consumptions rather than hardcoded zeros
- **Funding page** now computes "spent this month" from actual funding consumption data per funding stream
- **Quarter Spend Summary** uses quarter-scoped contributions instead of single-period contributions
- **Prior period transactions** are properly detected and marked with an asterisk in the expenses list
- Funding consumption queries now pull all months from quarter start to statement month, fixing scenarios where regenerated or multi-month statements showed incomplete data

### Statement Matching Fix

The quarter spend summary no longer matches contribution categories by database ID, instead matching by name. This prevents incorrect colour/styling assignments when category IDs differ across environments.

---

## Permissions & Access

### MDH Care Coordinators — Same Access as HACS

My Designed Homecare (MDH) Care Coordinator users now receive the same additional permissions as HACS Care Coordinators, including access to manage risks, needs, and view package documents and budget tabs. The implementation was refactored from a single hardcoded ID to a configurable array of eligible Care Coordinator organisation IDs.

**Who benefits:** MDH Care Coordinators

---

## Suppliers

### JUST_ME Supplier Document Verification

Sole trader ("Just Me") suppliers now have adjusted document verification requirements. Police Check and Public Liability Insurance have been moved to Tier 2 (optional) for JUST_ME suppliers, meaning they can reach Verified portal stage without these documents. A one-time fix command (`supplier:fix-just-me-portal-stages`) was included to correct existing JUST_ME suppliers whose portal stages were incorrectly blocked.

**Who benefits:** Sole trader suppliers, Onboarding Team

---

## Integrations

### MYOB Sub-Account Padding

MYOB sub-account numbers are now zero-padded to 10 characters before appending segment keys, ensuring consistent formatting across all MYOB bill item sync actions (fee, GST, and with-fee assemblers).

### MYOB Adjustments Webhook

A new webhook endpoint (`/myob-adjustments/webhook`) has been added to receive MYOB adjustment data. Currently logs incoming data for monitoring; processing logic will be added as the integration matures.

### Zoho Webhook Hardening

The Zoho webhook system received a significant overhaul:

- **Null `zoho_id` protection** — All Zoho webhook endpoints now silently return `204 No Content` when receiving requests with empty/null `zoho_id` values, preventing downstream errors
- **Module name standardisation** — Webhook queue module names have been normalised (e.g., `Deals` → `Consumer`, `Providers` → `Supplier`, removed `_New` suffixes) for consistency
- **Removed dead code** — Unused Teams module handling and redundant `_New` provider cases have been cleaned up
- **Improved logging** — All Zoho sync log messages now use consistent `[ClassName]` prefix formatting

---

## Bug Fixes

- **Bill Edit linting** — Fixed ESLint issues in `Bills/Edit.vue`

---

## Technical Notes

<details>
<summary>For developers</summary>

- **Fee Exemption:** New `LoadingFeesExemptionEnum` (TC, CC, BOTH), `loading_fees_exemption` column on `bills`, `UpdateBillLoadingFeesExemption` action, `useBillLoadingFeesExemption` composable (TP-3239)
- **Escalation:** Hardcoded `ESCALATION_AUTHORIZED_USER_IDS` on BillController — TODO to replace with role-based filtering (TP-4342)
- **GST Enforcement:** Server-side validation in `UpdateBillRequest::validateGstForNonRegisteredSupplier()`, client-side lock via `isGstDropdownDisabledByRole` computed (TP-3825)
- **HOLD_PAYMENTS:** Updated `BillValidator::checkSupplierMainBankDetails()` to accept `HOLD_PAYMENTS` status (DUC-145)
- **Statement Refactors:** Renamed `packageContributions` → `quarterContributions` on context, added `isDryRun` flag through pipeline, `AssembleExpenses` now calculates monthly vs quarterly totals from consumptions (DUC-148, #6038, #6030, #6032)
- **MDH Access:** Refactored `CheckPermission` middleware from `HACS_CARE_COORDINATOR_ID` constant to `ELIGIBLE_CARE_COORDINATOR_IDS` array, renamed methods accordingly
- **JUST_ME Suppliers:** New `DeterminePortalStageFromDocumentsAction`, updated `DocumentTagEnum` with JUST_ME-specific tier labels, `FixJustMeSupplierPortalStages` command (TP-3833)
- **Zoho Controller:** Moved from `App\Http\Controllers\Webhooks` to `App\Http\Controllers`, now implements `HasMiddleware` with null `zoho_id` guard (DUC-148)
- **MYOB Padding:** `str_pad($myobSubAccount, 10)` in all three assembler actions (DUC-137)

</details>
