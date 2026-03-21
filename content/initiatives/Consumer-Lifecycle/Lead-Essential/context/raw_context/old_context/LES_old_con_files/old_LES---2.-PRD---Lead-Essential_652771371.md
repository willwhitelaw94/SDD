---
title: "Trilogy Care Portal : LES - 2. PRD - Lead Essential"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Consumer Journey](Consumer-Journey_436208084.html)
3.  [LES - Lead Essential](LES---Lead-Essential_652771347.html)

</div>

# <span id="title-text"> Trilogy Care Portal : LES - 2. PRD - Lead Essential </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified on Nov 03, 2025

</div>

<div id="main-content" class="wiki-content group">

------------------------------------------------------------------------

## **PRD – LES (Lead Essential)**

<div class="table-wrap">

|  |  |
|----|----|
| **Field** | **Description** |
| **Document Status** | Draft |
| **Confluence Status** | Drafted October 2025 |
| **Jira Epic ID** | *(To be assigned)* |
| **Internal / SharePoint Links** | Links to: `sales_full_requirements.md`, `LES_Lead_Essential_Renumbered.md` |
| **Document Owner** | *(blank)* |
| **Designer** | *(blank)* |
| **Tech Lead** | *(blank)* |
| **QA** | *(blank)* |
| **Target Release** | Q1 FY26 |
| **Teams Chat / Field Entry** | N/A |

</div>

------------------------------------------------------------------------

### **1. Problem Statement**

Sales agents currently operate across fragmented systems — Zoho CRM, spreadsheets, and manual processes — to manage and convert leads. This results in data inconsistency, reduced accountability, and lost visibility across the sales funnel.  
The Portal must introduce a **native Lead Essentials module** that standardises how leads are created, viewed, progressed, and prepared for onboarding — establishing the foundation for all subsequent lead and package workflows.

------------------------------------------------------------------------

### **2. Goals & Success Metrics**

<div class="table-wrap">

|  |  |  |
|----|----|----|
| **Goal** | **Metric** | **Target** |
| Centralise lead management within Portal | % of new leads created and managed in Portal | 100% post–release |
| Improve lead creation efficiency | Average time to create a new lead | ≤ 60 seconds |
| Increase data completeness | Leads with mandatory fields populated | ≥ 95% |
| Improve visibility and auditability | Leads with recorded Journey Stage and Status history | 100% |
| Reduce CRM reliance | Proportion of leads managed via Zoho | 0% within 3 months of release |

</div>

**Assumptions**

- Zoho Leads sync will act as an interim bridge during migration.

- Lead, Status, and Stage definitions remain aligned with business reporting needs.

- Agents work primarily on desktop; mobile use limited to viewing.

------------------------------------------------------------------------

### **3. Background / Context**

This module represents the first major step in migrating Trilogy’s sales workflows from Zoho CRM to the Portal.  
The **Lead Essential (LES)** scope includes:

1.  **Create Lead (internal & external)** — Minimal, mandatory fields and automatic assignment logic.

2.  **Leads List View** — Central workspace for all sales leads, supporting filters and navigation.

3.  **Lead Profile View** — Tabbed structure with persistent Journey Stage bar, Status card, and Notes.

4.  **Overview Tab** — Lead summary, contact hierarchy, and ownership details.

5.  **Onboarding Capture** — Basic onboarding and validation fields to prepare for conversion.

LES precedes and underpins all dependent initiatives:

- **LTH – Lead to HCA** (conversion flow),

- **LGI – Lead Generation Integrations**, and

- **LDS – Lead Desirable enhancements**.

------------------------------------------------------------------------

### **4. Definitions**

<div class="table-wrap">

|  |  |
|----|----|
| **Term** | **Definition** |
| **Lead** | A potential client or representative record created at first contact. |
| **Journey Stage** | Objective indicator of where the lead sits in the funnel (Pre-Care → Converted). |
| **Lead Status** | Engagement classification (Not Contacted → Made Contact → Lost → Converted). |
| **Wizard** | Guided modal ensuring required fields are completed before saving updates. |
| **Primary Contact** | The designated main contact for the lead (either the client or representative). |
| **Linked Lead** | A related lead record (e.g. family member) connected via two-way reference. |

</div>

------------------------------------------------------------------------

### **5. Requirements**

Perfect ✅

I’ll now regenerate the **entire Markdown inline** using the structure you just confirmed, with fully rebuilt numbering:

- Top-level H2 sections numbered **1–5**

- Subsections under each H2 numbered **.1, .2, etc.**

- Table items numbered **.a, .b, .c, etc.** under their subsection

- All original text, MoSCoW, Scenarios, Requirements, and Doc Refs remain *exactly* as-is — only numbering changes.

Please hold a moment while I apply the renumbering carefully and render the complete Markdown document.

Here is your **fully renumbered Markdown document**, rebuilt cleanly from top to bottom:

------------------------------------------------------------------------

## 1. Create a Lead

### 1.1 Internal Facing Create a Lead

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 1.1.a | MUST | Creating a new lead from the Leads List View | Given the sales agent is on the Leads List View When the agent selects “Create Lead” Then a Create Lead form should appear with a compact view of all lead record fields the agent can save. | 2.2 |
| 1.1.b | MUST | Enforcing mandatory fields on lead creation | Given the agent is creating a new lead When the form is displayed Then “Lead Name” and “Email” and' should be mandatory fields before the record can be saved. | 2.2 |
| 1.1.c | MUST | Sales Created Lead Assignment Rules | Given the sale agent is creating a new lead When they do so Then That sales agents user id will populate the 'lead owner' field by default | 2.2 |

</div>

### 1.2 External Facing Create a Lead

<div class="table-wrap">

|       |        |                  |                  |         |
|-------|--------|------------------|------------------|---------|
| US \# | MoSCoW | Scenario         | User Requirement | Doc Ref |
| 1.2.a | MUST   | Placeholder Text | Placeholder Text |         |
| 1.2.b | MUST   | Placeholder Text | Placeholder Text |         |

</div>

------------------------------------------------------------------------

## 2. Leads List View

### 2.1 Leads Display and Navigation

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 2.1.a | MUST | Viewing leads in a structured list | Given the sales agent is on the Leads List View When the page loads Then the agent should see all leads displayed in a structured table format. | 2.1 |
| 2.1.b | MUST | Displaying essential lead details | Given the sales agent is viewing the Leads List View Then each row should include Lead Name, Lead Contact Name, Email, Phone, Journey Stage, Lead Status, Assigned Agent, Created Date, Tasks Indicator, Task Due Date, and Interactions. | 2.1 |
| 2.1.c | MUST | Opening a lead profile from the list | Given the agent is viewing the Leads List View When the agent clicks on a Lead Name Then the system should open that lead’s detailed profile page. | 2.1 |
| 2.1.d | SHOULD | Filtering leads by column values | Given the agent is viewing the Leads List View When the agent applies filters for any available column Then the list should update to show only matching leads. | 2.1 |

</div>

### 2.2 Lead Creation and Validation

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 2.2.a | MUST | Creating a new lead from the Leads List View | Given the sales agent is on the Leads List View When the agent selects “Create Lead” Then a Create Lead form should appear with a minimal set of lead record fields. | 2.2 |
| 2.2.b | SHOULD | Enforcing mandatory fields on lead creation | Given the agent is creating a new lead When the form is displayed Then “Lead Name” and “Email” should be mandatory fields before the record can be saved. | 2.2 |

</div>

------------------------------------------------------------------------

## 3. Lead Profile View

### 3.1 Profile Navigation and Persistent UI

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 3.1.a | MUST | Navigating to the Lead Profile | Given the sales agent clicks on a Lead Name in the Leads List View When the system opens the Lead Profile Then the page should display multiple tabs separating key areas of information and workflow (Overview, Lead Timeline, Attribution, Options and Traits, Package, and Settings). | 3 |
| 3.1.b | MUST | Viewing persistent interface elements | Given the agent is on any tab within the Lead Profile Then the Journey Stage Progress Bar, Status Actions Card, and Notes should remain visible across all tabs. | 3 |

</div>

### 3.2 Journey Stage Visual

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 3.2.a | MUST | Displaying Journey Stage Progress | Given the agent is viewing the Lead Profile When the Journey Stage Bar is displayed Then it should show the lead’s position along the conversion path with milestone stages (Pre-Care, ACAT, Booked, Approved, Allocated, Active, Converted) grouped and color-coded by funnel level (Top, Middle, Bottom). | 3.1.1 |
| 3.2.b | MUST | Highlighting current Journey Stage | Given the lead has a current Journey Stage When the page loads Then that stage should be highlighted with a short description beneath it. | 3.1.1 |
| 3.2.c | SHOULD | Displaying interim stages dynamically | Given the lead is in an interim stage When the Journey Stage Bar loads Then interim stages should appear by name only for the active stage, keeping the layout compact. | 3.1.1 |
| 3.2.d | MUST | Updating the Journey Stage | Given the sales representative selects a stage from the progress bar or clicks the Update button When the Update Journey Stage Wizard opens Then the wizard should display mandatory and suggested fields that must be completed before confirming the change. | 3.1.2 |

</div>

### 3.3 Lead Status Visual

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 3.3.a | MUST | Displaying Lead Status options | Given the agent is updating Lead Status When the Lead Status Wizard opens Then the system should display statuses including Not Contacted, Made Contact, Attempted Contact, Lost, and Converted, each with required conditions before selection. | 3.2.1 |
| 3.3.b | MUST | Completing required fields when updating Lead Status | Given the agent is updating a lead’s status When the Lead Status Wizard appears Then the wizard should display mandatory fields to complete before saving the status change and optional fields for additional context. | 3.2.2 |
| 3.3.c |  | Prefilling existing data during status update | Given a lead already has some relevant fields completed When the Lead Status Wizard loads Then existing field values should appear prefilled but remain editable. | 3.2.2 |

</div>

### 3.4 Lead Status Update Wizards

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 3.4.a | MUST | Updating Lead Status to “Made Contact” | Given the agent updates a lead’s status to Made Contact When the Made Contact Wizard appears Then the system should prompt for mandatory fields: Journey Stage, Lead Attribution, Purchase Intent, and Contact Status; and optional fields for method, outcome, follow-up date, and notes. | 3.2.2.1 |
| 3.4.b | MUST | Updating Lead Status to “Attempted Contact” | Given the agent updates a lead’s status to Attempted Contact When the Attempted Contact Wizard appears Then the system should prompt for mandatory fields: Contact Method and Contact Outcome (No Answer, Left Voicemail, Line Busy, Wrong Number, Email Bounced, Other), and optional notes. | 3.2.2.2 |
| 3.4.c | MUST | Updating Lead Status to “Lost” | Given the agent updates a lead’s status to Lost When the Lost Wizard appears Then the system should require a Lost Type (Lost Lead, Junk, or Uncontactable) and corresponding Reason options that dynamically adjust based on the Lost Type. | 3.2.2.3 |
| 3.4.d | MUST | Updating Lead Status to “Converted” | Given the agent updates a lead’s status to Converted When the Converted Wizard appears Then the system should verify completion of all Made Contact mandatory fields before allowing progression to the Conversion and Onboarding flow. | 3.2.2.4 |
| 3.4.e | MUST | Recording notes across interactions | Given the agent adds a note or completes a wizard When the interaction is saved Then the note should automatically populate the persistent Notes section with date, time, and author details visible across all tabs. | 3.3 |

</div>

------------------------------------------------------------------------

## 4. Overview Tab

### 4.1 Overview Summary and Context

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 4.1.a | MUST | Displaying persistent elements across tabs | Given the agent navigates to any tab within the Lead Profile Then the Journey Stage Progress Bar, Status Actions Card, and Notes should remain visible across all tabs. | 4.1 |
| 4.1.b | MUST | Viewing high-level lead summary in Overview Tab | Given the agent opens the Overview Tab Then the system should display a concise summary of key lead details, enabling quick review without leaving the page. | 4.1 |

</div>

### 4.2 Lead and Identity Information

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 4.2.a |  | Displaying core lead information | Given the Overview Tab is open Then the system should display Lead Name, Journey Stage, Lead Status, Record Created Date, and Last Contact Date. | 4.1.1 |
| 4.2.b |  | Validating correct client identity | Given the system detects differences between submitter and intended client details Then it should flag or discourage misclassification to ensure each lead represents one potential consumer. | 4.1.1 |
| 4.2.c |  | Displaying user-submitted description | Given a lead form includes a written message or inquiry Then the system should display that message in the User Description section of the lead profile. | 4.1.2 |

</div>

### 4.3 Ownership and Assignment

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 4.3.a |  | Assigning a responsible agent automatically | Given a lead is created manually by a sales rep Then that lead should be automatically assigned to the creating rep. | 4.1.3 |
| 4.3.b |  | Allowing manual reassignment by team leaders | Given a lead originates from another pipeline or pre-existing data source Then the Sales Team Leader or Head of Sales should be able to manually assign ownership. | 4.1.3 |

</div>

### 4.4 Address and Contact Details

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 4.4.a |  | Displaying address details | Given the Overview Tab is open Then the Address Information section should show Street Address, Suburb, State, and Postcode. | 4.1.4 |
| 4.4.b |  | Prefilling contact details for potential clients | Given a lead is created Then the Contact Information section should prefill Name, Email, and Phone from the Lead Information fields. | 4.1.5 |
| 4.4.c |  | Ensuring contact completeness and designation | Given there are multiple contacts Then the system should require at least one contact with both Email and Phone and designate one as the Primary Contact. | 4.1.5 |
| 4.4.d |  | Restricting Primary Contact designation | Given multiple contacts exist Then only one contact may be designated as Primary at any time. | 4.1.5 |

</div>

------------------------------------------------------------------------

## 5. Onboarding and Activation

### 5.1 Onboarding Flow and Validation

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 5.1.a |  | Capturing onboarding information | Given the agent is preparing to onboard a client Then they should be able to enter the fields Cessation Date, Commencement Date, End Date, Referral Code, and Preferred Management Option. | 4.5.3 |
| 5.1.b |  | Validating date logic during onboarding | Given Commencement Date and End Date are entered Then the system should ensure that the Commencement Date occurs before the End Date, following MAC system allocation rules. | 4.5.3 |
| 5.1.c |  | Recording cessation for transfers | Given a client is transferring from another provider Then the Cessation Date should align with the start of Trilogy Care’s package management. | 4.5.3 |
| 5.1.d |  | Recording MAC referral information | Given the agent completes the onboarding form Then the Referral Code should follow a fixed pattern (e.g., alphanumeric with two dashes) for identification and compliance. | 4.5.3 |
| 5.1.e |  | Capturing management preference | Given onboarding information is being entered Then the agent should select the client’s Preferred Management Option (Self-Managed or Self-Management Plus). | 4.5.3 |
| 5.1.f |  | Ensuring completion before activation | Given the client’s onboarding form is submitted Then all MAC, Package, and Onboarding fields must be completed before activation within Trilogy Care’s systems. | 4.5.3 |

</div>

------------------------------------------------------------------------

### **6. Out of Scope**

- Full **conversion** process into Home Care Agreement (covered by LTH).

- Lead source integration from BD, marketing, or forms (covered by LGI).

- Extended CRM tab features — Timeline, Attribution, and Options & Traits (LDS scope).

- AI automation or predictive workflows (future roadmap).

------------------------------------------------------------------------

### **7. Open Questions**

1.  Should external (public) lead creation forms follow the same validation rules as internal leads?

2.  How should duplicate detection (email/phone) be enforced — soft warning or hard block?

3.  Is “Linked Lead” required in LES or deferred until LDS?

4.  Should Journey Stage and Status be editable by all sales users or restricted by role?

------------------------------------------------------------------------

### **8. User Interaction & Design Notes**

- **Navigation:** Leads accessible via Sales Dashboard → “Leads” tab.

- **Persistent UI:** Journey Stage bar and Notes fixed across all tabs.

- **List View:** Paginated, sortable, filterable by any column.

- **Wizards:** Step-based modals; required fields flagged with visual validation.

- **Accessibility:** Keyboard navigation and visual hierarchy compliant with WCAG 2.1 AA.

- **Design Basis:** Align with existing Portal components (cards, tabs, sticky footer).

------------------------------------------------------------------------

### **9. Milestones**

<div class="table-wrap">

|             |           |           |         |            |
|-------------|-----------|-----------|---------|------------|
| **Phase**   | **Owner** | **Start** | **End** | **Status** |
| Discovery   | *(blank)* |           |         |            |
| Design      | *(blank)* |           |         |            |
| Development | *(blank)* |           |         |            |
| QA / UAT    | *(blank)* |           |         |            |
| Release     | *(blank)* |           |         |            |

</div>

------------------------------------------------------------------------

### **10. Reference Materials**

- `sales_full_requirements.md` – Sections 2.1–4.5

- `LES_Lead_Essential_Renumbered.md` – User Story Mapping

- “Big Room Planning – August PGT” (context on delivery sequence)

- “TC-1. Idea Brief” and “TC-2. PRD Template” (Confluence standard)

- “BRP Meeting Transcript” (Sales dependencies and sprint planning)

------------------------------------------------------------------------

</div>

</div>

</div>

<div id="footer" role="contentinfo">

<div class="section footer-body">

Document generated by Confluence on Nov 07, 2025 09:52

<div id="footer-logo">

[Atlassian](http://www.atlassian.com/)

</div>

</div>

</div>

</div>
