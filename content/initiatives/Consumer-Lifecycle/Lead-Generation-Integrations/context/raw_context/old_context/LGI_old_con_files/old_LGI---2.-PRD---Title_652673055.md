---
title: "Trilogy Care Portal : LGI - 2. PRD - Title"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Consumer Journey](Consumer-Journey_436208084.html)
3.  [LGI - Lead Gen Integrations](LGI---Lead-Gen-Integrations_652673031.html)

</div>

# <span id="title-text"> Trilogy Care Portal : LGI - 2. PRD - Title </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified on Oct 31, 2025

</div>

<div id="main-content" class="wiki-content group">

Perfect — here’s the **final PRD for LGI (Lead Gen Integrations)**, complete with the user stories table included inline and formatted cleanly according to your standard PRD structure.

------------------------------------------------------------------------

## **PRD – LGI (Lead Gen Integrations)**

<div class="table-wrap">

|  |  |
|----|----|
| **Field** | **Description** |
| **Document Status** | Draft |
| **Confluence Status** | Drafted October 2025 |
| **Jira Epic ID** | *(blank)* |
| **Internal / SharePoint Links** | `sales_full_requirements.md`, `LGI_Lead_Gen_Integrations_Renumbered.md`, `LES_Lead_Essential_Renumbered.md` |
| **Document Owner** | *(blank)* |
| **Designer** | *(blank)* |
| **Tech Lead** | *(blank)* |
| **QA** | *(blank)* |
| **Target Release** | *(blank)* |
| **Teams Chat / Field Entry** | N/A |

</div>

------------------------------------------------------------------------

### **1. Problem Statement**

Trilogy’s lead generation currently operates across disconnected systems — marketing forms, ad platforms (Google, Meta), partnership referral pipelines (BED, Coordinated, Priority One), and organic website submissions.  
Each follows a different routing and data capture process, resulting in incomplete or lost attribution data, inconsistent source tracking, and inaccurate reporting.

To achieve a unified lead management environment, all inbound lead sources must flow into the Portal’s lead schema via a standardized ingestion process that captures campaign and referral metadata, producing a single, traceable lead object.

------------------------------------------------------------------------

### **2. Goals & Success Metrics**

<div class="table-wrap">

|  |  |  |
|----|----|----|
| **Goal** | **Metric** | **Target** |
| Consolidate all inbound lead pipelines | % of leads created via unified ingestion | 100% |
| Improve attribution accuracy | Leads with valid Source, Medium, Campaign data | ≥ 95% |
| Enable full-funnel visibility | % of leads linked to marketing and partner sources | 100% |
| Reduce data loss | Missing or orphaned leads from connected systems | 0% |
| Improve data integrity | Duplicate leads across source systems | ≤ 2% |

</div>

**Assumptions**

- LES provides the foundational lead schema and fields for attribution.

- All digital and partner systems can send data through API, webhook, or form submissions.

- BED and marketing agree on consistent source ID and UTM standards.

------------------------------------------------------------------------

### **3. Background / Context**

This epic defines the **Lead Generation Integrations (LGI)** framework that centralizes all inbound lead creation routes through the Portal.  
The objective is to:

- Map all current marketing, referral, and organic pipelines.

- Optimize the routing architecture.

- Ensure every lead — regardless of source — is created as a standardized lead object containing full attribution data.

This provides the technical foundation for unified analytics, campaign performance tracking, and end-to-end visibility from marketing activity to client conversion.

------------------------------------------------------------------------

### **4. Definitions**

<div class="table-wrap">

|  |  |
|----|----|
| **Term** | **Definition** |
| **Attribution Tab** | Lead Profile section where Source, Medium, Campaign, and referral data are stored. |
| **UTM Parameters** | Marketing tags (Source, Medium, Campaign, Term, Content) that identify lead origins. |
| **Partner Referral ID** | Unique identifier for BED or Coordinated partner-sourced leads. |
| **Inbound Lead Source** | Any system (ads, forms, referrals, portals) that generates a lead record. |
| **Linked Lead** | Secondary lead created from an existing record that inherits attribution metadata. |

</div>

------------------------------------------------------------------------

### **5. Requirements (User Stories)**

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| **US \#** | **MoSCoW** | **Scenario** | **User Requirement** | **Doc Ref** |
| 0.0.a | — | — | Placeholder text | Placeholder text |
| 0.0.b | — | — | — | — |
| 0.0.c | SHOULD | Displaying automatically captured marketing data | Given a lead is created through a digital or automated channel, then the **Lead Generation Attribution section** should display *Source, Medium, Campaign*, and other metadata from forms, ads, or referral systems. | 4.3.2 |
| 0.0.d | SHOULD | Handling partner and referral data | Given a lead originates from a **business development or referral source**, then the **Attribution section** should include *Business Development ID* or equivalent referral metadata. | 4.3.2 |
| 0.0.e | MUST | Ensuring attribution data integration | Given data is captured through marketing forms, campaigns, or tracking systems, then **all attribution inputs** should feed into the **Attribution Tab** for unified reporting across marketing and sales datasets. | 4.3.2 |
| 0.0.f | COULD | Duplicating attribution for linked leads | Given a new linked lead is created from an existing record, then the system should **duplicate the attribution data** from the original lead unless the new record already contains attribution values. | 4.3.2 |

</div>

------------------------------------------------------------------------

### **6. Out of Scope**

- LES interface elements (list view, profile layout).

- Lead conversion and onboarding (LTH).

- Retrospective attribution updates for historical leads.

- Marketing automation workflows or remarketing logic.

------------------------------------------------------------------------

### **7. Open Questions**

1.  Should leads generated offline (via manual import or CRM entry) be given default attribution tags (e.g., “Offline / Manual”)?

2.  What is the conflict resolution order if multiple sources provide attribution data?

3.  Will external marketing forms be embedded directly in Portal or remain on external landing pages?

4.  Should BED and Coordinated leads pass through approval before automatic creation?

------------------------------------------------------------------------

### **8. User Interaction & Design Notes**

- **Entry Points:**

  - Web forms (Trilogy website, Portal).

  - Ad platforms (Google Ads, Meta Ads).

  - Partner sources (BED, Coordinated, Priority One).

- **Data Flow:**

  - Incoming payloads trigger creation of standardized lead objects in the Portal.

  - Attribution metadata is stored in a dedicated section under the Lead Profile.

- **Display:**

  - Attribution Tab shows fields for *Source*, *Medium*, *Campaign*, *Referral ID*, and *Partner Name*.

- **Automation:**

  - UTM or referral data is auto-detected and prefilled on creation.

  - Default attribution “Direct / None” applied if no parameters found.

- **Validation:**

  - Required fields: Source, Medium, Campaign (if applicable).

  - Data must match defined schema for analytics compatibility.

- **Integration:**

  - Links to Power BI dashboards for cross-channel lead performance reporting.

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

- `LGI_Lead_Gen_Integrations_Renumbered.md` – User Stories

- `sales_full_requirements.md` – Section 4.3.2 (Attribution)

- `LES_Lead_Essential_Renumbered.md` – Schema dependencies

- “Big Room Planning – August PGT” – Context on dependency sequencing

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
