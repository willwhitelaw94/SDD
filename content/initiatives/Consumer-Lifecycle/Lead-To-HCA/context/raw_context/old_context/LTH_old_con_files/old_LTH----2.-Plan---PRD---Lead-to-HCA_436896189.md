---
title: "Trilogy Care Portal : LTH - 2. Plan - PRD - Lead to HCA"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Consumer Journey](Consumer-Journey_436208084.html)
3.  [LTH - Lead to HCA](LTH----Lead-to-HCA_436896288.html)

</div>

# <span id="title-text"> Trilogy Care Portal : LTH - 2. Plan - PRD - Lead to HCA </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> Mike Wise</span>, last modified by <span class="editor"> David Henry</span> on Oct 31, 2025

</div>

<div id="main-content" class="wiki-content group">

------------------------------------------------------------------------

## **PRD – LTH (Lead to HCA)**

<div class="table-wrap">

|  |  |
|----|----|
| **Field** | **Description** |
| **Document Status** | Draft |
| **Confluence Status** | Drafted October 2025 |
| **Jira Epic ID** | *(blank)* |
| **Internal / SharePoint Links** | `sales_full_requirements.md`, `LTH_Lead_to_HCA_Renumbered.md`, `LES_Lead_Essential_Renumbered.md` |
| **Document Owner** | *(blank)* |
| **Designer** | *(blank)* |
| **Tech Lead** | *(blank)* |
| **QA** | *(blank)* |
| **Target Release** | *(blank)* |
| **Teams Chat / Field Entry** | N/A |

</div>

------------------------------------------------------------------------

### **1. Problem Statement**

The conversion from a qualified lead to an active Home Care Package currently involves multiple disconnected systems — Zoho CRM, manual email threads, PDFs, and third-party signing tools.  
This fragmentation leads to lost time, inconsistent data, and incomplete compliance checks.  
A **unified Conversion Wizard** within the Portal is required to guide users through all onboarding, verification, and agreement stages, ensuring that each client is activated accurately and compliantly.

------------------------------------------------------------------------

### **2. Goals & Success Metrics**

<div class="table-wrap">

|  |  |  |
|----|----|----|
| **Goal** | **Metric** | **Target** |
| Reduce conversion time | Average duration from “Made Contact” to active package | ≤ 24 hours |
| Ensure data completeness | Leads converted with all required onboarding fields validated | 100% |
| Improve compliance tracking | Audit trail completeness across conversion events | 100% |
| Automate key steps | % of conversions using auto ACAT/IAT extraction and e-signature | ≥ 80% |
| Replace external workflows | Reduction in manual or off-platform agreement handling | 100% post-launch |

</div>

**Assumptions**

- LES module provides all base lead, onboarding, and contact data.

- Agreement templates are pre-approved for digital issue.

- Integration with ACAT/IAT and e-signature services is available by release.

------------------------------------------------------------------------

### **3. Background / Context**

The **Lead to HCA (LTH)** epic implements the second major stage of the sales-to-client pipeline, following **LES (Lead Essential)**.  
It operationalizes the conversion workflow — taking a lead that has completed all “Made Contact” and onboarding prerequisites, validating its data, and transforming it into an active package within the system.

The core deliverable is a **multi-step Conversion Wizard** launched from the Lead Profile page, streamlining:

1.  Validation of all required lead data.

2.  Collection and verification of package details and ACAT/IAT data.

3.  Generation and dispatch of digital Home Care Agreements (HCA).

4.  Confirmation and audit logging of all activation actions.

This marks the first seamless handoff between **Sales** and **Operations**, bridging the data captured in LES with the package structure that underpins billing and client management.

------------------------------------------------------------------------

### **4. Definitions**

<div class="table-wrap">

|  |  |
|----|----|
| **Term** | **Definition** |
| **Conversion Wizard** | Guided interface that handles onboarding, package setup, and HCA generation. |
| **Stepper Framework** | The sequential navigation model used in the wizard (Package Details → Recipients → Agreement → Confirmation). |
| **ACAT/IAT** | Government assessment data required to confirm eligibility and package level. |
| **HCA (Home Care Agreement)** | The contract document issued to the client to finalize activation. |
| **Made Contact Fields** | Mandatory data points collected during the LES sales phase required before conversion. |

</div>

------------------------------------------------------------------------

### **5. Requirements**

Perfect ✅

Following **Prompt B (Hierarchical Renumbering)** exactly, here’s your **fully renumbered Markdown**, clean from top to bottom:

------------------------------------------------------------------------

## 1. Conversion Wizard – General

### 1.1 Conversion Workflow Overview

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 1.1.a |  | Converting a lead into an active package | Given the sales representative selects “Convert Package” for a lead When the Conversion Wizard opens Then the system should guide the rep through onboarding, compliance, and agreement steps to activate a Home Care Package. | 5 |
| 1.1.b |  | Ensuring all conversion prerequisites are met | Given the rep initiates the conversion process Then the system should verify that all required lead data, onboarding fields, and agreement steps are complete before final activation. | 5 |
| 1.1.c |  | Integrating sales and clinical onboarding | Given the Conversion Wizard is in use Then it should integrate both sales and clinical onboarding components to streamline client activation. | 5 |

</div>

### 1.2 Mandatory Field Checks

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 1.2.a |  | Displaying mandatory Made Contact fields | Given the sales representative selects “Convert Package” for a lead When the Conversion Wizard opens Then it should display all mandatory fields from the Made Contact status for review or completion before conversion. | 5.1 |
| 1.2.b |  | Prefilling existing data during conversion | Given the mandatory Made Contact fields have already been completed in the lead profile Then the wizard should prefill these fields automatically while allowing them to be reviewed or edited. | 5.1 |
| 1.2.c |  | Handling first-time conversion attempts | Given the Made Contact fields have not been completed previously When the conversion process is initiated Then the system should prompt the user to complete these mandatory fields before continuing. | 5.1 |
| 1.2.d |  | Enforcing completion of mandatory fields | Given required Made Contact fields are incomplete When the agent attempts to progress in the wizard Then the system should prevent continuation until all required fields are filled. | 5.1 |
| 1.2.e |  | Preventing skipped information | Given a rep attempts to convert a client prematurely Then the system should enforce the completion of all mandatory fields to ensure data integrity before conversion. | 5.1 |
| 1.2.f |  | Maintaining data consistency across workflow | Given mandatory field information is captured during conversion Then the system should ensure all lead, attribution, and contact data are properly synchronized across the record. | 5.1 |

</div>

------------------------------------------------------------------------

## 2. Convert Lead to Package Stepper

### 2.1 Stepper Framework and Navigation

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 2.1.a |  | Structuring the conversion process | Given the agent initiates the conversion after completing Made Contact requirements Then the Conversion Wizard should display a stepper divided into sequential sections guiding the rep through verification, package details, recipients, and agreement setup. | 5.2 |
| 2.1.b |  | Displaying clear progress indicators | Given the stepper loads Then each step should display a label and icon (e.g., “Package Details,” “Recipients,” “Agreement,” “Confirmation”) with a visual progress bar showing the user’s position. | 5.2 |
| 2.1.c |  | Allowing step navigation | Given the stepper is visible Then the agent should be able to move forward and backward between steps using “Next” and “Back” buttons without losing entered data. | 5.2 |
| 2.1.d |  | Saving step data automatically | Given the agent navigates between steps Then the wizard should automatically save the entered data for each step to prevent data loss on navigation. | 5.2 |
| 2.1.e |  | Displaying summary confirmation | Given all steps are complete Then the wizard should display a final confirmation screen summarizing all entered information before conversion submission. | 5.2 |

</div>

### 2.2 Package Details and Data Handling

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 2.2.a |  | Prefilling package-related data | Given the lead record already includes package information Then the corresponding fields (Level, Management Option, Approval Date) should be prefilled in the wizard. | 5.2.1 |
| 2.2.b |  | Capturing MAC package details | Given the agent begins the first step “Package Details” Then the system should include fields for Referral Code, Level, Preferred Management Option, and Financial Status. | 5.2.1.1 |

</div>

### 2.3 Dates Section

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 2.3.a |  | Recording conversion dates | Given the agent is in the Dates subsection Then the wizard should include Commencement Date and Cessation Date fields with validation to ensure proper chronological order. | 5.2.1.2 |
| 2.3.b |  | Validating date dependencies | Given the Cessation Date occurs before the Commencement Date Then the system should display an inline validation message and prevent saving until corrected. | 5.2.1.2 |
| 2.3.c |  | Capturing contextual notes | Given the agent is entering date details Then a Notes field should appear beneath the date fields to capture context such as transfer timelines or special arrangements. | 5.2.1.2 |

</div>

### 2.4 Recipient Selection and Validation

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 2.4.a |  | Displaying HCA recipient list | Given the agent progresses to the “HCA Recipients” step Then the wizard should list all contacts with email addresses, automatically selecting the lead and primary contact by default. | 5.2.1.3 |
| 2.4.b |  | Selecting multiple HCA recipients | Given multiple contacts exist Then the system should allow the agent to select multiple recipients to send the Home Care Agreement simultaneously. | 5.2.1.3 |
| 2.4.c |  | Adding additional HCA recipients inline | Given an additional recipient is required When the agent clicks “Quick Add Contact” Then they should be able to add a new Name, Relationship, and Email inline without leaving the stepper. | 5.2.1.3.1 |
| 2.4.d |  | Ensuring data validation for new contacts | Given a contact is added inline Then the system should validate that the entered email address is in the correct format before allowing it to be saved. | 5.2.1.3.1 |

</div>

------------------------------------------------------------------------

## 3. ACAT/IAT Extraction

### 3.1 ACAT/IAT Data Handling and Validation

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 3.1.a |  | Extracting ACAT/IAT data automatically | Given the agent reaches the ACAT/IAT Extraction step of the Conversion Wizard Then the system should attempt to retrieve assessment data automatically via API or Webhook using the Referral Code provided in the previous step. | 5.3 |
| 3.1.b |  | Validating successful data extraction | Given assessment data is successfully retrieved Then the system should populate ACAT/IAT fields automatically and confirm successful extraction with a completion message. | 5.3 |
| 3.1.c |  | Allowing manual upload if automatic extraction fails | Given the system fails to retrieve ACAT/IAT data automatically Then the agent should be able to manually upload the assessment document (PDF or XML format) to populate the required fields. | 5.3 |
| 3.1.d |  | Capturing extracted assessment fields | Given the ACAT/IAT data is extracted (either automatically or manually) Then the system should display Assessment Date, Assessment Type, Level, and Approval Outcome as read-only confirmation fields. | 5.3 |
| 3.1.e |  | Logging extraction source and time | Given the assessment data has been imported Then the system should record the extraction source (API or manual upload) and timestamp in the Lead Timeline for auditability. | 5.3 |
| 3.1.f |  | Preventing duplicate data imports | Given ACAT/IAT data already exists for the lead Then the system should block repeated uploads unless the user explicitly confirms an overwrite. | 5.3 |
| 3.1.g |  | Maintaining ACAT/IAT compliance integrity | Given a manual or automatic upload occurs Then the system should validate that all required ACAT/IAT fields are captured and comply with MAC system validation rules before proceeding to the next step. | 5.3 |

</div>

------------------------------------------------------------------------

## 4. Agreement Setup

### 4.1 Home Care Agreement Generation and Validation

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 4.1.a |  | Initiating Home Care Agreement setup | Given the agent reaches the Agreement Setup step in the Conversion Wizard Then the system should generate a Home Care Agreement (HCA) populated with all relevant lead, contact, and package details. | 5.4 |
| 4.1.b |  | Prefilling Home Care Agreement data | Given the lead has existing information stored in the CRM Then the system should prefill the HCA document fields including Client Name, Address, Package Level, and Management Option. | 5.4 |
| 4.1.c |  | Allowing manual adjustments before sending | Given the HCA has been prefilled Then the agent should be able to review and manually edit any field (e.g., address or start date) before sending. | 5.4 |
| 4.1.d |  | Selecting agreement recipients | Given multiple contacts are associated with the lead Then the agent should be able to select one or more recipients to send the agreement to via email. | 5.4 |
| 4.1.e |  | Sending the agreement digitally | Given the agreement recipients are confirmed When the agent clicks “Send Agreement” Then the system should send a digital copy of the Home Care Agreement using integrated e-signature or document delivery services. | 5.4 |
| 4.1.f |  | Tracking agreement delivery status | Given an agreement has been sent Then the system should display the delivery status (e.g., Sent, Viewed, Signed) in real time within the lead profile. | 5.4 |
| 4.1.g |  | Capturing electronic signatures | Given recipients receive the Home Care Agreement When they sign electronically Then the system should record signature timestamps and store the signed agreement automatically in the lead’s documents section. | 5.4 |
| 4.1.h |  | Generating timeline entries for agreement actions | Given the Home Care Agreement is sent, viewed, or signed Then each action should automatically generate a timestamped event in the Lead Timeline. | 5.4 |
| 4.1.i |  | Ensuring compliance through document validation | Given a Home Care Agreement is finalized Then the system should verify all required fields are present and valid before confirming the agreement’s status as “Completed.” | 5.4 |
| 4.1.j |  | Preventing duplicate agreement generation | Given a signed Home Care Agreement already exists for the client Then the system should prevent the creation of duplicate agreements unless explicitly overridden by an admin. | 5.4 |

</div>

------------------------------------------------------------------------

------------------------------------------------------------------------

### **6. Out of Scope**

- Broader clinical or care plan generation (handled in Care Planning modules).

- Billing automation and subsidy claims.

- Post-conversion package management workflows.

- Marketing or attribution reporting.

------------------------------------------------------------------------

### **7. Open Questions**

1.  Should agents be able to reopen a completed conversion (e.g., reissue agreements)?

2.  Do we allow partial conversions if ACAT/IAT data retrieval fails?

3.  What triggers the package object creation — upon “Send Agreement” or upon “Signed Agreement”?

4.  Should system auto-create timeline entries for every sub-step or only major events?

------------------------------------------------------------------------

### **8. User Interaction & Design Notes**

- **Entry Point:** Conversion Wizard launches via the “Convert to Package” button on the Lead Profile (LES dependency).

- **Navigation:** Stepper layout with progress indicator; steps saved automatically between navigation.

- **Prefill:** Existing lead, contact, and onboarding data loaded into wizard fields.

- **Validation:** Chronological date logic (Commencement before Cessation) and mandatory field enforcement.

- **Integration:**

  - ACAT/IAT API for assessment data retrieval (fallback to manual upload).

  - E-signature service (DocuSign or internal equivalent).

- **Timeline Sync:** All conversion and agreement events automatically logged with timestamps.

- **Design Basis:** Align with Portal UI component library; consistent styling with LES wizards.

------------------------------------------------------------------------

### **9. Milestones**

<div class="table-wrap">

|             |           |           |           |            |
|-------------|-----------|-----------|-----------|------------|
| **Phase**   | **Owner** | **Start** | **End**   | **Status** |
| Discovery   | *(blank)* | *(blank)* | *(blank)* | *(blank)*  |
| Design      | *(blank)* | *(blank)* | *(blank)* | *(blank)*  |
| Development | *(blank)* | *(blank)* | *(blank)* | *(blank)*  |
| QA / UAT    | *(blank)* | *(blank)* | *(blank)* | *(blank)*  |
| Release     | *(blank)* | *(blank)* | *(blank)* | *(blank)*  |

</div>

------------------------------------------------------------------------

### **10. Reference Materials**

- `LTH_Lead_to_HCA_Renumbered.md` – User Stories and Acceptance Criteria

- `sales_full_requirements.md` – Sections 5–5.4

- `LES_Lead_Essential_Renumbered.md` – Data and Workflow Dependencies

- “Big Room Planning – August PGT” – Roadmap order and dependency context

- Confluence Templates – “TC-1. Idea Brief” and “TC-2. PRD Template”

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
