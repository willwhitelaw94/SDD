---
title: "Finance Permissions Report"
description: "Current permission matrix for finance and bill processing roles"
---

## Summary

This document captures the **current permission assignments** across the six finance-related roles in TC Portal. It serves as a baseline reference for the Roles & Permissions Refactor (RAP) epic, documenting what each finance role can and cannot do today.

**Key Findings:**
- **47 permissions** are assigned across 6 finance roles
- **Finance Receivable** roles are strictly view-only — they have no bill management, supplier creation, or bank detail editing access
- **Bill Processing** and **Finance Payable** share heavy overlap on bill workflows but diverge on financial oversight (MYOB adjustments, impersonation, account views)
- **Manager vs Team Member** differences are minimal — only `bill-gst-override` and `impersonate-user` are truly manager-exclusive
- **27 permissions** (57%) are shared universally across all 6 roles, indicating a large common baseline that could become a shared "Finance Base" permission bundle

---

## Key Themes

### 1. Role Segmentation by Function

The six roles split into three functional groups with clear boundaries:

| Group | Roles | Primary Function |
|-------|-------|-----------------|
| **Bill Processing** | Team Member, Manager | Process, import, and manage bills through the workflow |
| **Finance Payable** | Team Member, Manager | Oversee payables including MYOB adjustments and user impersonation |
| **Finance Receivable** | Team Member, Manager | View-only access to packages, budgets, and supplier records |

### 2. Manager-Only Escalation Permissions

Only two permissions require Manager-level access:

| Permission | Description | Who Gets It |
|------------|-------------|-------------|
| `bill-gst-override` | Override GST requirements on bills | Bill Processing Manager, Finance Payable Manager |
| `impersonate-user` | Temporarily log in as another user (all actions logged) | Finance Payable Team Member & Manager only |

### 3. Finance Receivable Gap

Finance Receivable roles have **no access** to any write operations on bills or suppliers. They cannot:
- Create, edit, or process bills
- Import in-review bills
- Create suppliers or edit bank details
- View deleted bills or MYOB adjustments
- Manage bill processing team member settings

This makes them a purely observational role — useful for reconciliation and reporting but unable to take action on discrepancies.

### 4. Unique Access Patterns

| Permission | Available To | Not Available To |
|------------|-------------|-----------------|
| `view-myob-adjustment` | Finance Payable only | Bill Processing, Finance Receivable |
| `view-care-coordinator-accounts-tab` | Finance Payable, Finance Receivable | Bill Processing |
| `view-package-profile` | Finance Payable, Finance Receivable | Bill Processing |
| `impersonate-user` | Finance Payable only | Bill Processing, Finance Receivable |
| `edit-bill-processing-team-member-meta` | Bill Processing, Finance Payable | Finance Receivable |

---

## RAP Refactor Considerations

Based on the permission matrix, the following patterns could inform the new permission model:

1. **Shared Baseline Bundle** — 27 permissions are universal across all 6 roles. These could form a "Finance Base" bundle applied to all finance team members.
2. **Bill Write Bundle** — Bill Processing and Finance Payable share bill management permissions that Finance Receivable lacks. This could be a separate "Bill Management" bundle.
3. **Financial Oversight Bundle** — MYOB adjustments, impersonation, and account tab access are Finance Payable-specific and could form an "Oversight" bundle.
4. **Manager Escalation** — Only 2 permissions differentiate managers from team members, suggesting the Manager/Team Member split may be overly granular for the new model.

---

## Full Permission Matrix

### Bill Management

| Permission | Description | BP TM | BP Mgr | FP TM | FP Mgr | FR TM | FR Mgr |
|------------|-------------|:-----:|:------:|:-----:|:------:|:-----:|:------:|
| `approve-bill-vc` | Approve bills requiring value confirmation review | Y | Y | Y | Y | | |
| `bill-gst-override` | Override GST requirements on bills for suppliers not registered for GST | | Y | | Y | | |
| `can-import-in-review-bills` | Import bills currently under review into the system for processing | Y | Y | | Y | | |
| `manage-bill` | Create, edit, and process bills through the bill workflow | Y | Y | Y | Y | | |
| `restore-bill` | Recover bills that were previously deleted | Y | Y | Y | Y | | |
| `view-bill` | View invoices and bills submitted for payment | Y | Y | Y | Y | | |
| `view-deleted-bill` | View deleted bills for investigation or recovery | Y | Y | Y | Y | | |

### Supplier Management

| Permission | Description | BP TM | BP Mgr | FP TM | FP Mgr | FR TM | FR Mgr |
|------------|-------------|:-----:|:------:|:-----:|:------:|:-----:|:------:|
| `create-supplier` | Create new supplier records to onboard service providers | Y | Y | Y | Y | | |
| `view-supplier` | View detailed supplier information | Y | Y | Y | Y | Y | Y |
| `view-supplier-bills-tab` | View bills submitted by a supplier | Y | Y | Y | Y | Y | Y |
| `view-supplier-list` | View the list of all suppliers | Y | Y | Y | Y | Y | Y |
| `view-supplier-overview-tab` | View a supplier's profile overview | Y | Y | Y | Y | Y | Y |
| `view-supplier-prices-tab` | View supplier pricing information | Y | Y | Y | Y | Y | Y |
| `view-supplier-services-tab` | View services offered by a supplier | Y | Y | Y | Y | Y | Y |
| `view-supplier-timeline-tab` | View activity history for a supplier | Y | Y | Y | Y | Y | Y |

### Package & Budget

| Permission | Description | BP TM | BP Mgr | FP TM | FP Mgr | FR TM | FR Mgr |
|------------|-------------|:-----:|:------:|:-----:|:------:|:-----:|:------:|
| `view-budget` | View budget information for client packages | Y | Y | Y | Y | Y | Y |
| `view-budget-utilisation` | View how much of a client's budget has been used | Y | Y | Y | Y | Y | Y |
| `view-package` | View detailed client package information | Y | Y | Y | Y | Y | Y |
| `view-package-list` | View the list of all client packages | Y | Y | Y | Y | Y | Y |
| `view-package-needs-and-budget-tabs` | View client needs and budget allocations | Y | Y | Y | Y | Y | Y |
| `view-package-overview-tab` | View the overview of a client's package | Y | Y | Y | Y | Y | Y |
| `view-package-profile` | View the profile section of a client's package (personal details) | | | Y | Y | Y | Y |
| `view-package-statements-tab` | View financial statements for a client's package | Y | Y | Y | Y | Y | Y |

### Care Coordinator

| Permission | Description | BP TM | BP Mgr | FP TM | FP Mgr | FR TM | FR Mgr |
|------------|-------------|:-----:|:------:|:-----:|:------:|:-----:|:------:|
| `manage-care-coordinator-notes-tab` | Add, edit, and view notes on a care coordinator's record | Y | Y | Y | Y | Y | Y |
| `view-care-coordinator` | View detailed care coordinator information | Y | Y | Y | Y | Y | Y |
| `view-care-coordinator-accounts-tab` | View financial information for a care coordinator (fees, payment history) | | | Y | Y | Y | Y |
| `view-care-coordinator-list` | View the list of all care coordinators | Y | Y | Y | Y | Y | Y |
| `view-care-coordinator-overview-tab` | View the overview section of a care coordinator's profile | Y | Y | Y | Y | Y | Y |
| `view-care-coordinator-packages-tab` | View client packages managed by a care coordinator | Y | Y | Y | Y | Y | Y |
| `view-care-coordinator-team-tab` | View team members of a care coordinator organisation | Y | Y | Y | Y | Y | Y |

### Notes & Documents

| Permission | Description | BP TM | BP Mgr | FP TM | FP Mgr | FR TM | FR Mgr |
|------------|-------------|:-----:|:------:|:-----:|:------:|:-----:|:------:|
| `download-document` | Download documents from the system | Y | Y | Y | Y | Y | Y |
| `manage-notes` | Create, edit, and view notes throughout the system | Y | Y | Y | Y | Y | Y |
| `notes-can-tag` | Add tags/labels to notes for organisation and filtering | Y | Y | Y | Y | Y | Y |
| `notes-can-use-organisation-switch` | View notes from different organisation contexts | Y | Y | Y | Y | Y | Y |
| `store-document` | Upload new documents to the system | Y | Y | Y | Y | Y | Y |
| `view-document` | View uploaded documents | Y | Y | Y | Y | Y | Y |

### Finance-Specific

| Permission | Description | BP TM | BP Mgr | FP TM | FP Mgr | FR TM | FR Mgr |
|------------|-------------|:-----:|:------:|:-----:|:------:|:-----:|:------:|
| `edit-bank-details` | Change bank account information where payments are sent | Y | Y | Y | Y | | |
| `edit-bill-processing-team-member-meta` | Manage bill processing team member settings (priority suppliers, workload) | Y | Y | | Y | | |
| `view-myob-adjustment` | View MYOB accounting adjustments recorded in the system | | | Y | Y | | |

### System & Profile

| Permission | Description | BP TM | BP Mgr | FP TM | FP Mgr | FR TM | FR Mgr |
|------------|-------------|:-----:|:------:|:-----:|:------:|:-----:|:------:|
| `can-view-myob-button` | See the button linking to MYOB accounting records | Y | Y | Y | Y | Y | Y |
| `can-view-zoho-button` | See the button linking to Zoho CRM records | Y | Y | Y | Y | Y | Y |
| `global-search` | Search for information across the entire system | Y | Y | Y | Y | Y | Y |
| `impersonate-user` | Temporarily log in as another user to troubleshoot issues (all actions logged) | | | Y | Y | | |
| `update-password` | Change own login password | Y | Y | Y | Y | Y | Y |
| `update-phone` | Change own phone number | Y | Y | Y | Y | Y | Y |
| `update-profile-details` | Change own profile information | Y | Y | Y | Y | Y | Y |
| `view-dashboard` | Access the main dashboard page | Y | Y | Y | Y | Y | Y |

---

## Permission Count Summary

| Role | Total Permissions |
|------|:-----------------:|
| Bill Processing Team Member | 39 |
| Bill Processing Manager | 41 |
| Finance Payable Team Member | 40 |
| Finance Payable Manager | 42 |
| Finance Receivable Team Member | 27 |
| Finance Receivable Manager | 27 |

**Legend:** BP = Bill Processing, FP = Finance Payable, FR = Finance Receivable, TM = Team Member, Mgr = Manager
