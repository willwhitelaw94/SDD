---
title: "Design"
---

**Status:** Draft
**Feature Spec:** [spec.md](spec.md)
**Created:** 2026-01-26
**Last Updated:** 2026-02-02

---

## Design Resources

### LOOM Videos

| Title | Link | Description |
|-------|------|-------------|
| LTH Figma Walkthrough | [Loom](https://www.loom.com/share/37074a23285c49faa1a14ec275be16be) | Designer walkthrough of conversion wizard Figma (Feb 19, 2026) |

### Figma

| File | Link | Description |
|------|------|-------------|
| LTH - Lead to HCA | [Figma](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=0-1) | Conversion wizard — 5-step stepper + agreement send |

### Miro

| Board | Link | Description |
|-------|------|-------------|
| | | |

---

## Overview

Multi-step wizard to convert a Lead into a Home Care Agreement (HCA) Package. The wizard guides users through MAC details entry, ACAT/IAT data extraction, screening questions, and final result confirmation.

---

## User Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Primary User** | Sales / Onboarding Team | Converting leads to clients |
| **Device Priority** | Desktop | Complex form with multiple fields |
| **Usage Pattern** | Task-focused | Complete conversion in single session |
| **Information Density** | Medium | Balanced form layout |

---

## Convert Lead to Package Wizard

### Wizard Flow Overview

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────────┐    ┌────────┐
│     1       │    │        2         │    │         3           │    │   4    │
│ MAC Details │───▶│ ACAT/IAT         │───▶│ Screening           │───▶│ Result │
│             │    │ Extraction       │    │ Questions           │    │        │
└─────────────┘    └──────────────────┘    └─────────────────────┘    └────────┘
```

---

## Step 1: MAC Details

### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 1: MAC DETAILS                                                        │
├─────────────────────────────────┬───────────────────────────────────────────┤
│                                 │                                           │
│  PACKAGE DETAILS                │  DATE INFORMATION                         │
│  ─────────────────              │  ────────────────                         │
│                                 │                                           │
│  Referral Code *                │  Commencement Date *                      │
│  ┌─────────────────────────┐    │  ┌─────────────────────────┐              │
│  │ 2-123456789101       ✓  │    │  │ 02/02/2026          📅  │              │
│  └─────────────────────────┘    │  └─────────────────────────┘              │
│  Format: X-XXXXXXXXXXXX         │                                           │
│  (1 digit, hyphen, 12 digits)   │  Cessation Date *                         │
│                                 │  ┌─────────────────────────┐              │
│  Level *                        │  │ dd/mm/yyyy          📅  │              │
│  ┌─────────────────────────┐    │  └─────────────────────────┘              │
│  │ Level 2              ▼  │    │                                           │
│  └─────────────────────────┘    │  ┌─────────────────────────────────────┐  │
│                                 │  │ ℹ️ Note: The cessation date must be │  │
│  Preferred Management Option *  │  │ after the commencement date and     │  │
│  ┌─────────────────────────┐    │  │ represents when the package is      │  │
│  │ Self Management      ▼  │    │  │ expected to end.                    │  │
│  └─────────────────────────┘    │  └─────────────────────────────────────┘  │
│                                 │                                           │
│  Financial Status *             │                                           │
│  ┌─────────────────────────┐    │                                           │
│  │ Full Paying          ▼  │    │                                           │
│  └─────────────────────────┘    │                                           │
│                                 │                                           │
├─────────────────────────────────┴───────────────────────────────────────────┤
│                                                                             │
│  👥 HOME CARE AGREEMENT RECIPIENTS                                          │
│  ─────────────────────────────────                                          │
│  Select contacts to receive the Home Care Agreement *                       │
│                                                                             │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐   │
│  │ ☐ Sarah Johnson                 │  │ ☐ Michael Johnson               │   │
│  │   [Lead] [Primary]              │  │   No Relationship               │   │
│  │   Self                          │  │   michael.johnson@email.com     │   │
│  │   sarah.johnson@email.com       │  │                                 │   │
│  └─────────────────────────────────┘  └─────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                          ┌──────────┐  ┌──────────────┐     │
│                                          │  Cancel  │  │    Next >    │     │
│                                          └──────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 1 Fields

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| Referral Code | Text | Yes | Format: X-XXXXXXXXXXXX (1 digit, hyphen, 12 digits) | Auto-validates with checkmark |
| Level | Select | Yes | Level 1-4 | Package level from MAC |
| Preferred Management Option | Select | Yes | Self Management, Plan Managed, Fully Coordinated | |
| Financial Status | Select | Yes | Full Paying, Part Pensioner, etc. | |
| Commencement Date | Date | Yes | Must be valid date | Package start date |
| Cessation Date | Date | Yes | Must be after commencement date | Package expected end date |
| HCA Recipients | Checkbox list | Yes | At least one selected | Contacts to receive agreement |

---

## Step 2: ACAT/IAT Extraction

### Purpose

Extract Aged Care Assessment Team (ACAT) and Initial Assessment Tool (IAT) data from My Aged Care system using the referral code to auto-populate screening questions.

### Flow States

#### State 2a: Extracting (Loading)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 2: ACAT/IAT EXTRACTION                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  We're extracting the Aged Care Assessment Team (ACAT) and Initial          │
│  Assessment Tool (IAT) data using your referral code to automatically       │
│  populate screening questions.                                              │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Referral Code Extraction                                             │  │
│  │                                                                       │  │
│  │  2-123456789101    ◌ Extracting ACAT/IAT data...   [Generate Error]   │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ◌ Extracting ACAT/IAT Data                                           │  │
│  │                                                                       │  │
│  │  Please wait while we extract the Aged Care Assessment Team (ACAT)    │  │
│  │  and Initial Assessment Tool (IAT) data from the My Aged Care system  │  │
│  │  using your referral code.                                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐                            ┌──────────┐  ┌──────────────┐     │
│  │ < Back   │                            │  Cancel  │  │    Next >    │     │
│  └──────────┘                            └──────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### State 2b: Extraction Failed + Manual Upload

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 2: ACAT/IAT EXTRACTION                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  We're extracting the Aged Care Assessment Team (ACAT) and Initial          │
│  Assessment Tool (IAT) data using your referral code to automatically       │
│  populate screening questions.                                              │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Referral Code Extraction                                             │  │
│  │                                                                       │  │
│  │  2-123456789101    ⚠ Failed to extract    [Generate Error]            │  │
│  │                      ACAT/IAT data                                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ⚠ Extraction Failed                                                  │  │
│  │                                                                       │  │
│  │  Unable to automatically extract ACAT/IAT data. Please manually       │  │
│  │  upload the ACAT/IAT document to continue.                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  📄 Manual ACAT/IAT Upload                                            │  │
│  │                                                                       │  │
│  │         ┌─────────────────────────────────────────────────┐           │  │
│  │         │                      ↑                          │           │  │
│  │         │                                                 │           │  │
│  │         │  Drop your ACAT/IAT document here, or           │           │  │
│  │         │  [browse files]                                 │           │  │
│  │         │                                                 │           │  │
│  │         │  Supported formats: PDF, DOC, DOCX              │           │  │
│  │         └─────────────────────────────────────────────────┘           │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  📋 Classification Types *                                            │  │
│  │                                                                       │  │
│  │  Since automatic extraction failed, please manually select the        │  │
│  │  classification types from the ACAT/IAT document.                     │  │
│  │                                                                       │  │
│  │  Primary Classification *                                             │  │
│  │  ┌─────────────────────────────────────────────────────────────┐      │  │
│  │  │ Select classification...                                 ▼  │      │  │
│  │  └─────────────────────────────────────────────────────────────┘      │  │
│  │                                                                       │  │
│  │  Secondary Classification                                             │  │
│  │  ┌─────────────────────────────────────────────────────────────┐      │  │
│  │  │ Select classification (optional)...                      ▼  │      │  │
│  │  └─────────────────────────────────────────────────────────────┘      │  │
│  │                                                                       │  │
│  │  Support Needs Level *                                                │  │
│  │  ┌─────────────────────────────────────────────────────────────┐      │  │
│  │  │ Select support level...                                  ▼  │      │  │
│  │  └─────────────────────────────────────────────────────────────┘      │  │
│  │                                                                       │  │
│  │  Assessment Date *                                                    │  │
│  │  ┌─────────────────────────────────────────────────────────────┐      │  │
│  │  │ dd/mm/yyyy                                               📅  │      │  │
│  │  └─────────────────────────────────────────────────────────────┘      │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐                            ┌──────────┐  ┌──────────────┐     │
│  │ < Back   │                            │  Cancel  │  │    Next >    │     │
│  └──────────┘                            └──────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### State 2c: Extraction Successful

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 2: ACAT/IAT EXTRACTION                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ✓ Extraction Successful                                              │  │
│  │                                                                       │  │
│  │  ACAT/IAT data has been successfully extracted and will be used       │  │
│  │  to pre-populate the screening questions.                             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  📋 Extracted Classification Data                                     │  │
│  │                                                                       │  │
│  │  Primary Classification:     Dementia Care                            │  │
│  │  Secondary Classification:   Mobility Support                         │  │
│  │  Support Needs Level:        High                                     │  │
│  │  Assessment Date:            15/01/2026                               │  │
│  │                                                                       │  │
│  │  [Edit Classifications]                                               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  📄 Optional: Upload ACAT/IAT Document                                │  │
│  │                                                                       │  │
│  │  You can optionally upload a copy of the IAT document for records.    │  │
│  │                                                                       │  │
│  │         ┌─────────────────────────────────────────────────┐           │  │
│  │         │  Drop your ACAT/IAT document here, or           │           │  │
│  │         │  [browse files]                                 │           │  │
│  │         │  Supported formats: PDF, DOC, DOCX              │           │  │
│  │         └─────────────────────────────────────────────────┘           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐                            ┌──────────┐  ┌──────────────┐     │
│  │ < Back   │                            │  Cancel  │  │    Next >    │     │
│  └──────────┘                            └──────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 2 Fields

| Field | Type | Required | Condition | Notes |
|-------|------|----------|-----------|-------|
| ACAT/IAT Document | File Upload | Required if extraction fails | Failed extraction | PDF, DOC, DOCX |
| Primary Classification | Select | Yes | Always | From ACAT/IAT or manual |
| Secondary Classification | Select | No | Always | Optional additional classification |
| Support Needs Level | Select | Yes | Always | Low, Medium, High |
| Assessment Date | Date | Yes | Always | Date of ACAT/IAT assessment |

### Classification Types (Options)

| Classification | Description |
|----------------|-------------|
| Dementia Care | Support for clients with dementia |
| Mobility Support | Physical mobility assistance |
| Personal Care | Daily living activities support |
| Nursing Care | Medical/nursing interventions |
| Social Support | Community and social engagement |
| Respite Care | Carer respite services |
| Palliative Care | End of life support |

---

## Step 3: Screening Questions

### Purpose

Collect mandatory screening information to assess client eligibility and determine appropriate care pathway. Questions may be pre-populated from ACAT/IAT extraction.

### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 3: SCREENING QUESTIONS                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ❓ Screening Questions                                                     │
│                                                                             │
│  Please answer all screening questions below. All questions are mandatory   │
│  and will help us better understand the client's needs and background.      │
│                                                                             │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐   │
│  │ Previously Offboarded By        │  │ Switching From a Self-Managed   │   │
│  │ Trilogy? *                      │  │ Provider? *                     │   │
│  │                                 │  │                                 │   │
│  │ ○ Yes    ● No                   │  │ ● Yes    ○ No                   │   │
│  └─────────────────────────────────┘  └─────────────────────────────────┘   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ⓘ Reason For Switching *                                             │  │
│  │                                                                       │  │
│  │ ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │ │ Select reason for switching                                  ▼  │   │  │
│  │ └─────────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐   │
│  │ Number Of Previous Providers? * │  │ Can Use Online Banking? *       │   │
│  │                                 │  │                                 │   │
│  │ ┌───────────────────────────┐   │  │ ● Yes    ○ No                   │   │
│  │ │ 1                      ▼  │   │  │                                 │   │
│  │ └───────────────────────────┘   │  │                                 │   │
│  └─────────────────────────────────┘  └─────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────┐                                        │
│  │ Has Support For Technology? *   │                                        │
│  │                                 │                                        │
│  │ ○ Yes    ● No                   │                                        │
│  └─────────────────────────────────┘                                        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Progress                                              5 of 6 completed │  │
│  │  ████████████████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ✓ Answer Summary                                                     │  │
│  │  [Expandable section showing answered questions]                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐                            ┌──────────┐  ┌──────────────┐     │
│  │ < Back   │                            │  Cancel  │  │    Next >    │     │
│  └──────────┘                            └──────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 3 Fields

| Field | Type | Required | Conditional | Notes |
|-------|------|----------|-------------|-------|
| Previously Offboarded By Trilogy? | Radio (Yes/No) | Yes | - | Risk assessment flag |
| Switching From a Self-Managed Provider? | Radio (Yes/No) | Yes | - | Triggers reason field |
| Reason For Switching | Select | Yes | Only if switching = Yes | Dropdown with reasons |
| Number Of Previous Providers | Select | Yes | - | 0, 1, 2, 3+ options |
| Can Use Online Banking? | Radio (Yes/No) | Yes | - | Technology capability |
| Has Support For Technology? | Radio (Yes/No) | Yes | - | Informal support assessment |

### Conditional Logic

- **Reason For Switching**: Only displayed when "Switching From a Self-Managed Provider?" = Yes
- Progress bar updates as questions are answered
- Answer Summary section shows completed responses (collapsible)

---

## Step 4: Conversion Result

### Purpose

Display the assessment outcome based on screening questions and ACAT/IAT data. Shows approval status, recommended pathway, risk factors, and compatibility warnings.

### Result States

#### State 4a: APPROVED

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 4: CONVERSION RESULT                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ✓ Conversion Result                                                        │
│                                                                             │
│  Based on the screening questions and ACAT/IAT data, here is the            │
│  conversion assessment result:                                              │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  ✓ APPROVED                                    Confidence Score       │  │
│  │                                                      80%              │  │
│  │                                                                       │  │
│  │  ─────────────────────────────────────────────────────────────────    │  │
│  │                                                                       │  │
│  │  Pathway: Coordinator Model                                           │  │
│  │  Client requires additional support coordination due to elevated      │  │
│  │  risk factors or complex care needs.                                  │  │
│  │                                                                       │  │
│  │  Assessment Reasoning                                                 │  │
│  │  Elevated risk due to high care needs without informal or respite     │  │
│  │  support. Weighted risk score is 1.00. Coordinator Model is           │  │
│  │  required by risk factors.                                            │  │
│  │                                                                       │  │
│  │  Risk Flags                                                           │  │
│  │  ┌─────────────────┐  ┌─────────────────┐                             │  │
│  │  │ High Care Need  │  │  Low Support    │                             │  │
│  │  └─────────────────┘  └─────────────────┘                             │  │
│  │                                                                       │  │
│  │  Risk Score              Assessment Date                              │  │
│  │  1.00                    02/02/2026                                   │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  ⚠ Management Option Compatibility                                   │  │
│  │                                                                       │  │
│  │  Selected Management Option:                     Self Management      │  │
│  │                                                                       │  │
│  │  [Warning if selected option doesn't match recommended pathway]       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐                      ┌──────────┐  ┌────────────────────┐     │
│  │ < Back   │                      │  Cancel  │  │ Complete Conversion│     │
│  └──────────┘                      └──────────┘  └────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### State 4b: REJECTED

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 4: CONVERSION RESULT                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ✓ Conversion Result                                                        │
│                                                                             │
│  Based on the screening questions and ACAT/IAT data, here is the            │
│  conversion assessment result:                                              │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  ✗ REJECTED                                    Confidence Score       │  │
│  │                                                      100%             │  │
│  │                                                                       │  │
│  │  ─────────────────────────────────────────────────────────────────    │  │
│  │                                                                       │  │
│  │  Pathway: Not Eligible                                                │  │
│  │  Client does not meet eligibility criteria for Trilogy Care           │  │
│  │  services at this time.                                               │  │
│  │                                                                       │  │
│  │  Assessment Reasoning                                                 │  │
│  │  Client exhibits high-severity aggressive behaviour.                  │  │
│  │                                                                       │  │
│  │  Risk Flags                                                           │  │
│  │  ┌─────────────────┐  ┌─────────────────┐                             │  │
│  │  │    Critical     │  │  Safety Risk    │                             │  │
│  │  └─────────────────┘  └─────────────────┘                             │  │
│  │                                                                       │  │
│  │  Risk Score              Assessment Date                              │  │
│  │  0.00                    02/02/2026                                   │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Development Testing                                                  │  │
│  │  [Debug/override options - dev only]                                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐                                       ┌──────────┐            │
│  │ < Back   │                                       │  Cancel  │            │
│  └──────────┘                                       └──────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Result Card Fields

| Field | Description | Styling |
|-------|-------------|---------|
| Status | APPROVED / REJECTED | Green checkmark / Red X |
| Confidence Score | Percentage (0-100%) | Large text, right aligned |
| Pathway | Coordinator Model / Self-Managed / Not Eligible | Bold heading |
| Pathway Description | Explanation of pathway | Normal text |
| Assessment Reasoning | AI/rule-based explanation | Paragraph |
| Risk Flags | Tags for risk factors | Colored chips (amber/red) |
| Risk Score | Numeric score | Highlighted number |
| Assessment Date | Date of assessment | Standard date format |

### Risk Flag Types

| Flag | Color | Description |
|------|-------|-------------|
| High Care Need | Amber | Complex care requirements |
| Low Support | Amber | Limited informal support network |
| Critical | Red | Critical risk factor present |
| Safety Risk | Red | Safety concerns identified |
| Previously Offboarded | Amber | Was previously a Trilogy client |

### Management Option Compatibility

Shows warning when selected management option (from Step 1) doesn't align with recommended pathway:

| Selected Option | Pathway | Compatibility |
|-----------------|---------|---------------|
| Self Management | Coordinator Model | ⚠ Warning - May need coordinator support |
| Self Management | Self-Managed | ✓ Compatible |
| Fully Coordinated | Coordinator Model | ✓ Compatible |

### Actions

| Status | Primary Action | Secondary Actions |
|--------|----------------|-------------------|
| APPROVED | Complete Conversion | Back, Cancel |
| REJECTED | - | Back, Cancel |

---

## Component Inventory

### Existing Components (from Storybook)

| Component | Usage | Variant/Props |
|-----------|-------|---------------|
| Modal/Dialog | Wizard container | Large size |
| Stepper | Progress indicator | 4 steps |
| TextInput | Referral code, dates | With validation |
| Select | Dropdowns | Standard |
| Checkbox | HCA recipients | Card style |
| FileUpload | ACAT/IAT document | Drag & drop |
| Alert | Info/Warning/Success | Multiple variants |
| Button | Navigation | Primary/Secondary |

### New Components Needed

- [ ] Referral Code Input (with format validation + checkmark)
- [ ] Contact Selection Card (with tags: Lead, Primary, etc.)
- [ ] Extraction Status Indicator (loading, success, failed)

---

## States

### Loading States

| Context | Treatment |
|---------|-----------|
| ACAT/IAT Extraction | Spinner with "Extracting..." message |
| File Upload | Progress bar |

### Empty States

| Context | Message | CTA |
|---------|---------|-----|
| No contacts | No contacts available | Add Contact |
| Extraction failed | Unable to extract data | Manual upload |

### Error States

| Context | Message | Recovery |
|---------|---------|----------|
| Invalid referral code | Format must be X-XXXXXXXXXXXX | Correct format |
| Extraction timeout | Service unavailable | Retry or manual upload |
| File upload failed | Upload failed | Retry upload |

---

## Open Questions

- [ ] What are all the classification type options?
- [ ] Should we allow editing extracted data before proceeding?
- [ ] What happens if the uploaded document can't be parsed?
- [ ] Maximum file size for ACAT/IAT upload?

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | [ ] Approved |
| Developer | | | [ ] Approved |

---

## Figma Cross-Check: Spec vs Design

**Cross-check date**: 2026-02-19
**Figma**: [LTH - Lead to HCA](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=4-5)
**Spec**: [spec.md](spec.md)

### Figma Screen Inventory

| Figma Frame | Node ID | Figma Link | Description |
|-------------|---------|------------|-------------|
| Lead Dashboard | `2026:8458` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2026-8458) | Lead conversion index with stats cards + table |
| Step 1 — Lead Details | `7:13907` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=7-13907) | Confirm lead details form (Zoho banner, lead fields, sales qualification) |
| Step 2 — MAC Details (empty) | `2017:6444` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2017-6444) | Package details form (empty state) |
| Step 2 — MAC Details (filled) | `2031:2595` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2031-2595) | Package details form (filled with classifications, dates, HCA recipients) |
| Step 3 — ACAT/IAT (loading) | `2025:3606` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2025-3606) | Automatic extraction in progress |
| Step 3 — ACAT/IAT (success) | `2030:2076` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2030-2076) | Extraction successful + classification data displayed |
| Step 3 — ACAT/IAT (failed) | `2029:2173` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2029-2173) | Extraction failed + manual upload fallback |
| Step 3 — Manual Filled | `2029:2526` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2029-2526) | Manual extraction fields filled |
| Step 4 — Screening Questions | `2032:2774` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2032-2774) | Yes/No screening questions (6 questions) |
| Step 5 — Approved | `2032:8623` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2032-8623) | Screening result: Approved (confidence 91%, risk 7%) |
| Step 5 — Rejected | `2032:6673` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2032-6673) | Screening result: Rejected (confidence 100%, risk 92%) |
| Step 5 — SM+ Only | `2052:8296` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2052-8296) | Screening result: Self Managed PLUS only (coordinator required) |
| Step 6 — Send Agreement | `2026:2420` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2026-2420) | HCA recipient list + agreement body preview + Send button |
| Save & Exit Modal | `2082:5236` | [View](https://www.figma.com/design/K6vAYVuoJAUTZauqbeQcM9/-LTH----Lead-to-HCA?node-id=2082-5236) | Incomplete lead saved confirmation (3-day follow-up) |

### Stepper Comparison

| # | Figma Stepper | Spec Step | Match? |
|---|---------------|-----------|--------|
| 1 | Lead details | Confirm Lead Details (US2) | PARTIAL |
| 2 | MAC details | HCA Package Details (US3) | PARTIAL |
| 3 | ACAT/IAT extraction | ACAT/IAT Extraction (US4) | PARTIAL |
| 4 | Screening questions | Coordinator Confirmation (US5) | **MISMATCH** |
| 5 | Screening result | Agreement (US6) | **MISMATCH** |
| — | (unlisted) Step 6: Send Agreement | (part of US6) | PARTIAL |

**Summary**: Steps 1-3 roughly align. Steps 4-5 are fundamentally different. Figma has an unlisted Step 6.

### CRITICAL Differences

#### 1. Steps 4-5 Are Completely Different Flows

**Figma Steps 4+5 = Automated Risk Screening**:
- Step 4: Screening questions (yes/no: previously offboarded?, switching provider?, online banking?, tech support?)
- Step 5: Automated result with confidence %, risk score %. Three outcomes: Approved, Rejected, "Self Managed PLUS only"

**Spec Steps 4+5 = Coordinator Confirmation + Agreement**:
- Step 4 (US5): Confirm management option, select coordinator (BD pipeline, TC Internal, searchable override, Monash Model check)
- Step 5 (US6): Agreement display (signable vs not-signable), cooling off period, send agreement

#### 2. Risk Assessment Approach

| Aspect | Figma | Spec |
|--------|-------|------|
| Method | In-wizard automated scoring | External Assessment Tool + manual outcome entry |
| Outcomes | Approved / Rejected / SM+ Only | Suitable for Everything / Needs Clinical Attention / Not Suited |
| Outcome entry | System-generated | Sales manually selects dropdown |
| IAT upload | **Optional** | **Required** (FR-018a) |

#### 3. Coordinator Confirmation Missing from Figma

The spec has an entire step (US5) for coordinator confirmation:
- Monash Model remoteness check
- BD pipeline pre-population (locked)
- TC Internal default (20% flat fee)
- Searchable coordinator dropdown
- "I don't know" → not signable

**None of this exists in the Figma.**

### Step-Level Field Gaps

#### Step 1 — Lead Details

| Field | Figma | Spec | Gap? |
|-------|-------|------|------|
| Lead name | Editable | **Read-only** (US2.2) | YES |
| Sales rep | Not visible | Mentioned in US2.3 | MISSING from Figma |
| Email, Contact, Phone | Yes | Yes | OK |
| Journey Stage, Attribution, Intent, Google Status | Yes | Yes | OK |
| Zoho CRM banner | Yes | Yes | OK |

#### Step 2 — Package Details

| Field | Figma | Spec | Gap? |
|-------|-------|------|------|
| Referral code | Yes | Yes | OK |
| Management Option | Yes | Yes | OK |
| Financial Status | Yes | Yes | OK |
| Primary Classification | SaH levels (Level 3) | Named categories (Support@Home, AT, etc.) | **DIFFERENT model** |
| Secondary/Tertiary Classification | Dropdown + Low/Med/High checkboxes | Up to 2 additional from same list | **DIFFERENT model** |
| Dates | Yes | Yes | OK |
| HCA Recipients | Yes | Yes | OK |
| Client details (Gender, DOB, Language, etc.) | Not visible | FR-012 requires | **MISSING from Figma** |
| Contribution Rates, Payment Method | Not visible | FR-013 requires | **MISSING from Figma** |

#### Step 6 / Agreement

| Aspect | Figma | Spec | Gap? |
|--------|-------|------|------|
| Cooling off period info | Not visible | **Required** (FR-030, FR-046) | MISSING from Figma |
| Not-signable path | Not visible | US6 scenarios 4-6 | MISSING from Figma |
| Coordination fee | Not visible | FR-029 | MISSING from Figma |

### Summary of Gaps

**Spec has, Figma doesn't:**
1. Coordinator Confirmation step (entire US5)
2. Cooling off period info in agreement
3. Not-signable path in agreement
4. Client details fields (Gender, DOB, Language, Interpreter)
5. Contribution rates and payment method
6. Lead name as read-only
7. Sales rep field
8. IAT upload as required

**Figma has, spec doesn't:**
1. Automated screening questions (Step 4)
2. Automated scoring result (confidence %, risk score %)
3. Save & Exit flow with INCOMPLETE tagging
4. Lead Dashboard with stats cards
5. Create Lead button
6. Classification levels (Low/Medium/High)
7. "Self Managed PLUS only" outcome

**Conflicting:**
1. Risk assessment: Automated (Figma) vs External + manual (Spec)
2. IAT upload: Optional (Figma) vs Required (Spec)
3. Classification model: SaH levels (Figma) vs Named categories (Spec)

### Recommended Actions

1. **Align on risk assessment approach** — automated in-wizard vs external tool
2. **Confirm coordinator confirmation** — does this step exist?
3. **Resolve IAT upload** — optional or required?
4. **Confirm classification model** — SaH levels or named categories?
5. **Confirm client details** — captured here or elsewhere?
6. **Add save & exit to spec** if Figma flow is desired
7. **Add cooling off + not-signable** to Figma if spec is correct
