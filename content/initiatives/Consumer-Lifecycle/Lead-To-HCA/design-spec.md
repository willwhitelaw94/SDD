---
title: "Design Specification: Lead to HCA (LTH)"
---

# Design Specification: Lead to HCA (LTH)

**Created**: 2026-02-09
**Updated**: 2026-02-19
**Source**: Figma design walkthrough (Feb 19, 2026) + /trilogy-clarify design lens + Fast Lane Retrospective (Feb 10, 2026)
**Spec**: [spec.md](spec.md)
**Figma**: [LTH - Lead to HCA](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA)

---

## Layout Patterns

### Lead Record Page

**Pattern**: Synced Record View

```
┌─────────────────────────────────────────────────────────────┐
│  Lead: [Client Name]                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Name:              Joan Smith                               │
│  Phone:             0412 345 678                             │
│  Email:             joan.smith@email.com                     │
│  Preferred Mgmt:    Self-Managed                             │
│  Attribution:       Google Ads - Fast Lane Campaign          │
│                                                              │
│  Last Synced: 2 minutes ago from Zoho                        │
│                                                              │
│  [Convert Lead →]                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Behavior**:
- Stripped-back record page showing key fields synced from Zoho
- "Convert Lead" button launches the 6-step conversion wizard
- Data displayed here pre-fills the wizard
- Will be enriched by LES and LDS epics in future

---

### 6-Step Conversion Wizard

**Pattern**: Sequential Stepper (5 data steps + 1 agreement step)

```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────┐   │
│  │  From Zoho CRM — Converting Lead: [Client Name]  ↗  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Step 1    Step 2    Step 3    Step 4    Step 5    Step 6    │
│  [●]───────[○]───────[○]───────[○]───────[○]───────[○]      │
│  Confirm   HCA       ACAT/IAT  Screening Screening Agreement│
│  Lead      Package   Extraction Questions Results   Sending  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [Current step content]                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [Convert Lead →]                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Behavior**:
- Sequential step-by-step navigation (not accordion)
- "From Zoho CRM" banner at top with link back to Zoho record
- Each step must be completed before progressing to the next
- Fields pre-filled from Zoho lead record where available

---

### Step 1: Confirm Lead Details

**Pattern**: Pre-filled Form with Read-only Lead Name

```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────┐   │
│  │  From Zoho CRM — Converting Lead: Omar Singh     ↗  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Step 1: Confirm Lead Details                                │
│                                                              │
│  Lead Name:           Omar Singh                    🔒       │
│  Email:               omar.singh@email.com                   │
│  Contact Name:        [Editable]                             │
│  Phone Number:        0412 345 678                           │
│                                                              │
│  ─── Sales Information ───                                   │
│                                                              │
│  Sales Qualifications: [Dropdown ▼]                          │
│  Sales Rep:           [Dropdown ▼]                           │
│  Journey Stage:       [Dropdown ▼]                           │
│  Purchase Intent:     [Dropdown ▼]                           │
│  Lead Attribution:    [Dropdown ▼]                           │
│  Google Status:       [Dropdown ▼]                           │
│                                                              │
│  [Convert Lead →]                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Behavior**:
- All fields pre-filled from Zoho
- Lead name is read-only (locked icon)
- All other fields remain editable
- "Convert Lead" button progresses to Step 2
- Banner links back to the Zoho CRM record

---

### Step 2: HCA Package Details

**Pattern**: Multi-section Form with Dropdowns and Contact Management

```
┌─────────────────────────────────────────────────────────────┐
│  Step 2: HCA Package Details                                 │
│                                                              │
│  ─── Package Information ───                                 │
│                                                              │
│  Referral Code:       [Text field]                           │
│  Preferred Manage     [Self-Managed ▼] / [Self-Managed Plus ▼]│
│  Option:                                                     │
│  Financial Status:    [Full Pensioner ▼] / [Part Pensioner ▼]│
│                       / [Self-Funded ▼]                      │
│                                                              │
│  ─── Classification ───                                      │
│                                                              │
│  Primary:             [Level 1 ▼] / [Level 2 ▼] /           │
│                       [Support@Home ▼] / [Level 8 ▼]        │
│  Secondary:           [Optional — Level ▼] / [SAH ▼]        │
│  (can have 1-3 classifications total)                        │
│                                                              │
│  ─── Key Dates ───                                           │
│                                                              │
│  Commencement Date:   [Date picker]                          │
│  Cessation Date:      [Date picker]                          │
│                                                              │
│  ─── HCA Recipient ───                                       │
│                                                              │
│  Lead (Care Recipient): Omar Singh                           │
│  Email: omar.singh@email.com                                 │
│                                                              │
│  Contacts:                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Ben Singh (Son)         ben@email.com    [Remove]    │   │
│  └──────────────────────────────────────────────────────┘   │
│  [+ Add Contact]                                             │
│                                                              │
│  [Continue →]                                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Behavior**:
- Several dropdowns for package configuration
- Primary classification required, secondary classification optional
- Client can have up to 3 classifications in any combination
- HCA Recipient section shows the lead + contacts from Zoho
- "Add Contact" allows adding additional contacts (e.g., family members)
- All contacts are editable and removable
- "Continue" progresses to Step 3

---

### Step 3: ACAT/IAT Extraction

**Pattern**: Manual Extraction with Upload Fallback

```
┌─────────────────────────────────────────────────────────────┐
│  Step 3: ACAT/IAT Extraction                                 │
│                                                              │
│  ─── Manual Extraction ───                                   │
│                                                              │
│  [Extract Data]                                              │
│                                                              │
│  ─── Or Upload Documents ───                                 │
│                                                              │
│  [Upload ACAT/IAT Documents]                                 │
│                                                              │
│  ─── Assessment Details ───                                  │
│  (auto-populated from extraction, or fill manually)          │
│                                                              │
│  [Field 1]:          [Value / empty]                         │
│  [Field 2]:          [Value / empty]                         │
│  [Field 3]:          [Value / empty]                         │
│  ...                                                         │
│                                                              │
│  [Continue →]                                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Behavior**:
- "Extract Data" button attempts automated extraction
- If extraction succeeds, fields auto-populate
- If extraction fails, user can upload documents and fill fields manually
- All assessment detail fields must be populated before continuing
- "Continue" progresses to Step 4

> **Note**: The initial proposal was automatic extraction on page load. This was confirmed as not feasible — the design uses a manual trigger button instead.

---

### Step 4: Screening Questions

**Pattern**: Yes/No Questions with Conditional Fields

```
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Screening Questions                                 │
│                                                              │
│  Previously brokered by Trilogy?                             │
│  [Yes] [No]                                                  │
│                                                              │
│  Switching from a self-managed provider?                     │
│  [Yes] [No]                                                  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Who is that provider?                                │   │
│  │  [Provider name text field]                           │   │
│  │  (greyed out when "No" is selected)                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Can use online banking?                                     │
│  [Yes] [No]                                                  │
│                                                              │
│  Number of previous providers:                               │
│  [1] [2] [3] [4] [5+] [N/A]                                 │
│                                                              │
│  [Continue →]                                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Behavior**:
- Yes/No toggle switches or checkboxes for each question
- "Switching from a self-managed provider?" = Yes reveals conditional text field
- "Switching from a self-managed provider?" = No greys out the provider field
- Number of previous providers uses a selectable list (1-5+ or N/A)
- All questions must be answered before "Continue" is enabled
- "Continue" progresses to Step 5

> **Note**: The "Who is that provider?" conditional field was a request from Romi's team.

---

### Step 5: Screening Results — Approved

**Pattern**: Status Display with Metrics

```
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Screening Results                                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ✓  APPROVED                                          │   │
│  │                                                       │   │
│  │  Confidence:      87%                                 │   │
│  │  Risk Score:      Very Low Risk                       │   │
│  │  Assessment Date: 2026-02-15                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [Continue →]                                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Step 5: Screening Results — Rejected

```
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Screening Results                                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ✗  REJECTED                                          │   │
│  │                                                       │   │
│  │  Assessment Reasoning:                                │   │
│  │  [Explanation of why the client was not approved]      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [Send to Clinical Team]                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Step 5: Screening Results — Self-Managed Plus Only

```
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Screening Results                                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ⚠  APPROVED — SELF-MANAGED PLUS ONLY                │   │
│  │                                                       │   │
│  │  Assessment Reasoning:                                │   │
│  │  [Explanation of the restriction]                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [Send to Clinical Team]                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Behavior**:
- Three possible statuses: Approved, Rejected, Approved — SM+ Only
- Approved: shows confidence %, risk score, assessment date → "Continue" to Step 6
- Rejected: shows assessment reasoning → "Send to Clinical Team" button
- SM+ Only: shows assessment reasoning → "Send to Clinical Team" button
- Clinical team routing is a hand-off — the clinical team assesses eligibility outside the wizard

---

### Step 6: Agreement Sending

**Pattern**: Magic Link Send with Confirmation Modal

```
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Agreement Sending                                   │
│                                                              │
│  Send the Home Care Agreement to the recipient.              │
│                                                              │
│  Recipient:  Omar Singh                                      │
│  Email:      omar.singh@email.com                            │
│                                                              │
│  [Send Agreement]                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**After sending — Confirmation Modal:**

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                    ✓ Agreement Sent                          │
│                                                              │
│    The Home Care Agreement has been sent to                  │
│    omar.singh@email.com via magic link.                      │
│                                                              │
│    [Close]                    [Convert New Lead →]           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Behavior**:
- Agreement sent as a magic link to the HCA recipient's email
- After sending, a confirmation modal appears
- "Close" returns to the portal (packages index or dashboard)
- "Convert New Lead" starts a fresh conversion wizard for a different lead
- Package record created in Portal, Deal created in Zoho

> **Note — Lead Conversion Tab**: The design also shows a lead conversion table for tracking all conversions. This is considered out of scope for LTH and belongs to the Lead Essential (LES) epic.

---

### Packages Index

**Pattern**: Filterable Table

```
┌─────────────────────────────────────────────────────────────┐
│  Packages                                     [Filter ▼] [?] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Filter: [All ▼]  [Sent] [Clinical Review] [Signed]          │
│                                                              │
│  ┌───────────────┬────────────┬───────────┬────────────┐    │
│  │ Client        │ Agreement  │ Converted │ Sales Rep  │    │
│  │───────────────┼────────────┼───────────┼────────────│    │
│  │ Joan Smith    │ ✓ Signed   │ Today     │ Sarah T.   │    │
│  │ Robert Chen   │ ✉ Sent     │ Today     │ Mike B.    │    │
│  │ Mary Williams │ ⚠ Clinical │ Yesterday │ Sarah T.   │    │
│  │ James Brown   │ ✉ Sent     │ 2 days    │ Erin K.    │    │
│  └───────────────┴────────────┴───────────┴────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Behavior**:
- Shows all converted packages with agreement status
- Filterable by agreement status
- Clinical review packages show routing reason
- Agreement status updates in real-time as Client HCA processes signing
- Accessible by Sales, Clinical Team, and Operations

---

## Navigation & Information Architecture

### Portal Navigation

**Navigation Path**:
```
Portal
├── Dashboard
├── Leads
│   ├── [Lead Record]        ← US1 (NEW)
│   └── [Convert Wizard]     ← US2-US7 (NEW — 6 steps)
├── Packages
│   └── [Packages Index]     ← US8 (NEW - filterable by agreement status)
├── Consumers
│   └── ...
└── ...
```

---

## Component Inventory

| Component | Usage | Existing? |
|-----------|-------|-----------|
| Lead record page | Display synced lead data | New — stripped-back MVP |
| Zoho CRM banner | "From Zoho CRM — Converting Lead" with link back | New |
| Step indicator | Sequential 6-step progress indicator | Check `CommonStepNavigation.vue` |
| Read-only field | Lead name locked display | Check existing patterns |
| Dropdown selectors | Management option, financial status, classification, etc. | Likely existing |
| Multi-classification selector | Primary + optional secondary classifications | New |
| Date pickers | Commencement date, cessation date | Check existing patterns |
| Contact manager | HCA recipients list with add/remove | Likely new |
| Extract data button | Manual ACAT/IAT extraction trigger | New |
| Document upload | ACAT/IAT document upload with fallback | Check existing upload patterns |
| Yes/No toggle | Screening questions binary answers | Check existing patterns |
| Conditional field | Provider name shown/hidden based on toggle | New pattern |
| Provider count selector | 1-5+ / N/A selection | New |
| Screening result card | Status + metrics (confidence, risk, date) or reasoning | New |
| Agreement send interface | Magic link send with recipient display | New |
| Confirmation modal | "Close" / "Convert New Lead" after send | Likely existing modal pattern |
| Packages index table | Filterable table with status badges | Extend existing table patterns |

---

## Responsive Considerations

| Breakpoint | Behavior |
|------------|----------|
| Desktop | Full wizard layout, side-by-side fields where appropriate |
| Tablet | Single column wizard, fields stack vertically |
| Mobile | Not primary use case (Sales use desktop), but should degrade gracefully |

---

## Empty & Error States

| State | Scenario | Treatment |
|-------|----------|-----------|
| No leads | Lead record page with no data | "No lead data available" — check Zoho sync |
| Extraction failed | "Extract Data" button fails | Show error, offer document upload + manual entry |
| Step incomplete | Required fields not filled | "Continue" disabled with validation messages |
| No packages | Packages index empty | "No converted packages yet" with explanation |
| Sync failure | Any step fails to sync to Zoho | Error message, retry option, data preserved in Portal |

---

## Figma Design Reference

| Screen | Figma Status | Notes |
|--------|-------------|-------|
| Step 1: Confirm Lead Details | Designed | Zoho banner, read-only name, editable fields |
| Step 2: HCA Package Details | Designed | Dropdowns, classification, dates, contacts |
| Step 3: ACAT/IAT Extraction | Designed | Extract button, upload fallback, manual fields |
| Step 4: Screening Questions | Designed | Yes/No toggles, conditional provider field |
| Step 5: Screening Results — Approved | Designed | Confidence %, risk score, assessment date |
| Step 5: Screening Results — Rejected | Designed | Assessment reasoning, "Send to Clinical Team" |
| Step 5: Screening Results — SM+ Only | Designed | Assessment reasoning, "Send to Clinical Team" |
| Step 6: Agreement Sending | Designed | Magic link send + confirmation modal |
| Lead Conversion Tab (out of scope) | Designed | Referenced for context, belongs to LES epic |
