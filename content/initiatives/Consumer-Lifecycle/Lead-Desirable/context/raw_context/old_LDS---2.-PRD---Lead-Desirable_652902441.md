<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Consumer Journey](Consumer-Journey_436208084.html)
3.  [LDS - Lead Desirable](LDS---Lead-Desirable_652902417.html)

</div>

# <span id="title-text"> Trilogy Care Portal : LDS - 2. PRD - Lead Desirable </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified on Nov 04, 2025

</div>

<div id="main-content" class="wiki-content group">

------------------------------------------------------------------------

## **PRD – LDS (Lead Desirable)**

<div class="table-wrap">

|  |  |
|----|----|
| **Field** | **Description** |
| **Document Status** | Draft |
| **Confluence Status** | Drafted October 2025 |
| **Jira Epic ID** | *(blank)* |
| **Internal / SharePoint Links** | `sales_full_requirements.md`, `LDS_Lead_Desirable_Renumbered.md`, `LES_Lead_Essential_Renumbered.md`, `LGI_Lead_Gen_Integrations_Renumbered.md` |
| **Document Owner** | *(blank)* |
| **Designer** | *(blank)* |
| **Tech Lead** | *(blank)* |
| **QA** | *(blank)* |
| **Target Release** | *(blank)* |
| **Teams Chat / Field Entry** | N/A |

</div>

------------------------------------------------------------------------

### **1. Problem Statement**

The existing Lead Essentials and Lead to HCA modules provide core sales functionality but lack the deeper CRM-style views needed for sales performance, context, and client insight.  
Critical data such as lead history, linkage between clients (e.g., family members), detailed attribution, preferences, and traits are not yet visible in the Portal.

**Lead Desirable (LDS)** expands the lead experience beyond the essentials — introducing richer contextual tabs and data points that allow staff to understand and act on the full customer story in one place.

------------------------------------------------------------------------

### **2. Goals & Success Metrics**

<div class="table-wrap">

|  |  |  |
|----|----|----|
| **Goal** | **Metric** | **Target** |
| Provide enhanced context for leads | Tabs for Timeline, Attribution, Options & Traits, and Package available for all sales users | 100% of leads |
| Improve transparency and traceability | % of key events captured in Lead Timeline | ≥ 95% |
| Improve personalization and matching | % of leads with populated traits and service preferences | ≥ 80% |
| Enable accurate sales attribution | % of leads containing at least one attribution source | ≥ 95% |
| Link related clients | Leads with valid Linked Lead relationships | ≥ 90% where applicable |

</div>

**Assumptions**

- LES and LTH are fully deployed, providing base schema and onboarding logic.

- All leads in Portal already have standardized data (name, contact, journey stage, etc.).

- Marketing and referral attribution standards are finalized from LGI.

------------------------------------------------------------------------

### **3. Background / Context**

**LDS (Lead Desirable)** is the fourth and final phase of the initial sales module rollout.  
It enriches the lead experience by adding depth and contextual intelligence across the following components:

1.  **Linked Leads Management** — manage and navigate connections between related leads (e.g., spouses, carers).

2.  **Lead Timeline Tab** — a full activity log capturing every change, event, and interaction across the lead’s lifecycle.

3.  **Attribution Tab** — unified view combining *Sales-Defined Attribution* (self-reported source) and *Lead Generation Attribution* (UTM/partner data).

4.  **Options & Traits Tab** — a new interface for recording descriptive lead data such as traits, preferences, and service needs.

5.  **Package Tab** — detailed view of MAC progress, existing package information, contribution rates, and policy cut-off status.

This release closes the CRM-replacement gap by surfacing relationship data, audit history, attribution intelligence, and contextual service information inside the Portal.

------------------------------------------------------------------------

### **4. Definitions**

<div class="table-wrap">

|  |  |
|----|----|
| **Term** | **Definition** |
| **Linked Lead** | Two or more leads connected in a two-way relationship (e.g., spouses or family members). |
| **Lead Timeline** | Chronological history of all field edits, stage changes, and actions for a lead. |
| **Attribution Tab** | Consolidated display of sales-entered and system-captured lead origin data. |
| **Traits** | Descriptive characteristics of a potential client (language, mobility, dietary needs, interests, etc.). |
| **MAC** | My Aged Care; system providing assessment and approval milestones used in the Package tab. |

</div>

------------------------------------------------------------------------

### **5. Requirements**

## 1. Overview Tab

### 1.1 Linked Leads Management

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 1.1.a |  | Adding a linked or connected lead | Given the agent clicks “Add Linked Lead” in the Contact Information section When the wizard opens Then the agent should be able to quickly create and link another lead profile using essential details. | 4.1.6 |
| 1.1.b |  | Establishing two-way linkage between connected leads | Given a linked lead is created Then the system should establish a two-way relationship between both lead records and display them as Linked Leads with Name, Relationship, and Contact Type. | 4.1.6 |
| 1.1.c |  | Mirroring linked lead relationships | Given a linked lead relationship is created (e.g., Homer ↔ Marge) Then each record should automatically mirror the other’s linkage relationship and contact type. | 4.1.6 |
| 1.1.d |  | Navigating between linked lead profiles | Given linked leads exist Then the agent should be able to easily navigate between their profiles from the Linked Leads section. | 4.1.6 |

</div>

## 2. Lead Timeline Tab

### 2.1 Lead Timeline Logging and History

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 2.1.a |  | Recording changes in Lead Timeline | Given any key data is updated in a lead profile When the change is saved Then the system should log the previous and new value, timestamp, and author in the Lead Timeline. | 4.2 |
| 2.1.b |  | Supporting event-based or manual save logging | Given updates occur in the Lead Profile Then the system should support either event-based saving (auto-log) or manual Save actions that bundle updates into one timeline entry. | 4.2 |
| 2.1.c |  | Capturing key events and context | Given a sales agent updates a lead’s status or journey stage When the update is completed Then the system should automatically record the associated event type, relevant fields changed, and contextual information in the timeline. | 4.2 |
| 2.1.d |  | Maintaining unified activity history | Given multiple changes are made to a lead’s data When the user views the timeline Then all lead-related updates across fields and modules should appear in a single chronological activity feed. | 4.2 |

</div>

## 3. Attribution Tab

### 3.1 Attribution Structure and Layout

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 3.1.a |  | Displaying consolidated attribution data | Given the agent opens the Attribution Tab Then the tab should consolidate both Sales Defined Attribution and Lead Generation Attribution data into a unified view. | 4.3 |
| 3.1.b |  | Structuring attribution into clear sections | Given the agent views the Attribution Tab Then the system should separate information into two sections: Sales Defined Attribution and Lead Generation Attribution. | 4.3 |

</div>

### 3.2 Sales Defined Attribution

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 3.2.a |  | Capturing manually gathered sales attribution | Given the agent records attribution details during client interaction When the lead status is updated to Made Contact Then the system should allow entry of manually gathered source information such as “How did you hear about Trilogy Care?”. | 4.3.1 |
| 3.2.b |  | Recording self-reported awareness sources | Given the client provides a self-reported source of awareness Then the system should capture that value in Sales Defined Attribution for tracking and analysis. | 4.3.1 |

</div>

### 3.3 Supplementary Attribution Information

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 3.3.a |  | Displaying supplementary key fields | Given the agent views the Attribution Tab Then the system should also display Client Name, Email, Contact Name, Summary of Traits (if applicable), and the First Journey Stage. | 4.3.3 |
| 3.3.b |  | Tracking first journey stage | Given a lead’s journey stage is updated from “unknown” to a defined stage Then the system should automatically record that first journey stage value as a system-generated field in the Attribution Tab. | 4.3.3 |

</div>

## 4. Options and Traits Tab

### 4.1 Capturing and Managing Client Traits

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 4.1.a |  | Capturing lead traits | Given the agent is in the Options and Traits Tab Then they should be able to add descriptive client information under categories like Language, Culture, Living Situation, Dietary Requirements, Mobility, Medical Conditions, Interests, and Other. | 4.4.1 |
| 4.1.b |  | Adding custom trait values | Given no predefined option applies Then the agent should be able to enter a custom trait value. | 4.4.1 |
| 4.1.c |  | Summarizing selected traits | Given the agent adds traits Then the system should display them in a Summary Section for quick review and allow snapshot saving as a single Lead Timeline event. | 4.4.1 |

</div>

### 4.2 Address and Location Details

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 4.2.a |  | Displaying address in Options & Traits Tab | Given the agent opens the Address & Location subsection Then the address should mirror the Overview Tab values and remain editable if location details change during onboarding or scoping. | 4.4.2 |

</div>

### 4.3 Required Services Capture

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 4.3.a |  | Recording required services | Given the Required Services card is blank When the agent selects a service Then the card should expand to show multi-select buttons for common services like personal care, domestic assistance, nursing, or allied health. | 4.4.2 |
| 4.3.b |  | Capturing and saving multiple required services | Given multiple services are selected Then the system should allow the agent to save all selected services simultaneously. | 4.4.2 |

</div>

### 4.4 Management Option and Coordination

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 4.4.a |  | Recording management option | Given the agent opens the Management Option subsection Then they should be able to record the client’s preferred management model (Self-Management or Self-Management Plus). | 4.4.3 |
| 4.4.b |  | Checking SM+ coordination availability | Given the client selects Self-Management Plus When the agent clicks “Check Availability” Then the system should query internal coordination systems for worker availability using postcode, package level, and selected services. | 4.4.3 |
| 4.4.c |  | Displaying availability results and notifications | Given an availability response is received Then the system should notify the sales rep and display the result directly in the interface. | 4.4.3 |

</div>

### 4.5 General Service Availability and Transparency

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 4.5.a |  | Checking general service availability | Given the agent is in the Check Service Availability subsection Then they should be able to view available providers or workers for each selected service and optionally send results to the client via marketing systems. | 4.4.4 |
| 4.5.b |  | Prefilling availability parameters | Given the lead profile contains postcode, service type, or management option data Then these values should prefill service availability searches automatically. | 4.4.4 |
| 4.5.c |  | Demonstrating service transparency | Given the agent checks service availability Then the system should display representative options per service (e.g., cleaners, gardeners, personal care workers) to support informed client discussions. | 4.4.4 |
| 4.5.d |  | Sharing service availability with clients | Given search results are generated in the portal Then the agent should be able to send a client-facing link (via integrated systems such as Klaviyo) showing those results using the same parameters. | 4.4.4 |

</div>

## 5. Package Tab

### 5.1 Package Overview and Structure

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 5.1.a |  | Displaying client’s Home Care Package details | Given the agent opens the Package Tab Then the system should display package-related fields grouped into three main sections: MAC Progress, Package Information, and Onboarding Information. | 4.5 |

</div>

### 5.2 MAC Progress and Milestones

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 5.2.a |  | Recording MAC progress milestones | Given the agent updates MAC-related details Then the fields AC Number, MAC First Contacted Date, Assessment Date, Approval Date, and Approved Before September 1 2024 should be available and linked to relevant journey stages. | 4.5.1 |
| 5.2.b |  | Linking MAC milestone updates to stages | Given a journey stage is updated When the stage corresponds to a MAC milestone (e.g., Assessment or Approval) Then the relevant date field should update automatically or allow manual entry. | 4.5.1 |
| 5.2.c |  | Flagging clients approved before policy cut-off | Given the agent records an Approval Date Then the system should allow manual entry of a Boolean field “Approved Before September 1 2024” to determine eligibility under the No Worse-Off Principle. | 4.5.1 |

</div>

### 5.3 Existing Recipients and Contributions

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| US \# | MoSCoW | Scenario | User Requirement | Doc Ref |
| 5.3.a |  | Capturing existing recipient information | Given the client indicates they are an existing Home Care Package recipient Then the system should reveal additional fields for Current Provider, Assessment Type (ACAT/IAT), Level, Pensioner Status, and Contribution Rates. | 4.5.2 |
| 5.3.b |  | Recording contribution rates | Given the client’s contribution details are known Then the agent should be able to enter Everyday Living and Independence contribution percentages. | 4.5.2 |
| 5.3.c |  | Applying contextual field behavior for contribution rates | Given a client was approved before September 1 2024 Then the Contribution Rate fields should appear greyed out and read-only; otherwise, they should remain editable. | 4.5.2 |

</div>

------------------------------------------------------------------------

### **6. Out of Scope**

- Structural changes to Journey Stage or Lead Status (handled in LES).

- Conversion or onboarding flow (handled in LTH).

- External data ingestion from marketing systems (handled in LGI).

- Reporting dashboards or Power BI visualizations (future data layer).

------------------------------------------------------------------------

### **7. Open Questions**

1.  Should Linked Leads display across all tabs or only within Contacts and Overview?

2.  Does the Lead Timeline include notes and wizard entries, or only field-level changes?

3.  Will Traits data be mapped into downstream care-planning systems?

4.  How often should MAC milestone data refresh (manual vs. automatic sync)?

5.  Should client-facing availability links generated in Options & Traits expire after a set period?

------------------------------------------------------------------------

### **8. User Interaction & Design Notes**

- **Navigation:** New tabs (Timeline, Attribution, Options & Traits, Package) accessible via horizontal tab bar on the Lead Profile.

- **Linked Leads:** Display in a collapsible card within the Overview and Contacts sections; click-through navigation to linked profiles.

- **Timeline Tab:** Chronological feed; supports filters (by event type, author, or module). Auto-logs all major actions with before/after values.

- **Attribution Tab:** Split-view design — *Sales-Defined Attribution* on the left (manual entries), *Lead Generation Attribution* on the right (auto-captured).

- **Options & Traits Tab:** Uses expandable cards for traits, address, and required services; supports custom inputs.

- **Package Tab:** Mirrors data from MAC systems and onboarding forms; editable where business rules permit.

- **Design Requirements:** All tabs align with Portal’s existing component framework (cards, filters, consistent table styling, sticky section headers).

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

- `LDS_Lead_Desirable_Renumbered.md` – User Stories

- `sales_full_requirements.md` – Sections 4.1.6–4.5.2

- `LES_Lead_Essential_Renumbered.md` – Foundational structure dependencies

- `LGI_Lead_Gen_Integrations_Renumbered.md` – Attribution integration dependencies

- “Big Room Planning – August PGT” – Product sequencing and dependencies

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
