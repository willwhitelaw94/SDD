<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)

</div>

# <span id="title-text"> Trilogy Care Portal : SVF - 1. Idea Brief - Service Verification Features </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified by <span class="editor"> Steven Boge</span> on Oct 31, 2025

</div>

<div id="main-content" class="wiki-content group">

**Idea Brief – Supplier and Service-Level Compliance Management**

------------------------------------------------------------------------

### **Problem Statement (What)**

Under the Support at Home reforms, suppliers must meet compliance requirements not only at the **organisation level** but also for each **individual service type** they deliver.  
Currently, Trilogy Care’s portal tracks supplier verification only at the provider level. This gap causes several operational issues:

- Bills are submitted for unverified services, requiring manual holds and follow-up.

- Compliance obligations for each service type aren’t clearly communicated during onboarding.

- Suppliers lack visibility over what they’re verified for and what needs renewal.

- Compliance officers spend time chasing documents, identifying expired credentials, and manually emailing suppliers.

Without clear workflows and visibility, compliance gaps delay payments, increase workload for the compliance team, and risk regulatory breaches once Support at Home commences.

------------------------------------------------------------------------

### **Possible Solution (How)**

Introduce a unified compliance module in the portal that manages both **Supplier-level** and **Service-level** verification.

**Key functions:**

1.  **Service-Level Compliance:**

    - Each service a supplier provides will have its own compliance checklist derived from the central **Compliance Matrix** (defining document types, expiry requirements, etc.).

    - Compliance requirements are displayed to suppliers during onboarding or when applying for new services.

2.  **Supplier Self-Service:**

    - Verified suppliers can log in at any time to **add new services** or update existing ones.

    - They receive **reminders** before document expiry and can upload updated files directly.

3.  **Bill-Triggered Workflow:**

    - When a bill is placed **on hold for unverified services**, the system automatically sends an **Update Service Request email** prompting the supplier to complete missing compliance steps.

4.  **Compliance Oversight:**

    - Compliance officers can review documents, approve or reject submissions, and view an internal **dashboard of unverified suppliers and services**.

    - Officers receive alerts if a **planned service becomes unverified** due to expired or rejected compliance.

5.  **Billing Visibility:**

    - Billing staff can view supplier and service-level verification indicators on each invoice and apply a flag “On Hold – Compliance” when requirements aren’t met.

------------------------------------------------------------------------

### **Benefits (Why)**

<div class="table-wrap">

|  |  |  |
|----|----|----|
| Impact Area | Benefit | Measure |
| **Compliance Accuracy** | Ensures all services are properly verified before billing or delivery. | 100% of Tier-3 services have defined checklists. |
| **Operational Efficiency** | Reduces manual outreach and tracking by compliance staff. | 50% fewer manual compliance follow-ups. |
| **Supplier Transparency** | Gives suppliers clear visibility and proactive reminders. | 100% supplier access to compliance summary. |
| **Billing Reliability** | Prevents payments for unverified services and provides clear audit trail. | Reduction in billing delays linked to compliance holds. |

</div>

------------------------------------------------------------------------

### **Owner (Who)**

\[Will Whitelaw \]

------------------------------------------------------------------------

### **Other Stakeholders**

**Accountable:** <a href="https://trilogycare.atlassian.net/wiki/people/712020:7be29006-93b1-4896-a87d-f47958668f05?ref=confluence" class="confluence-userlink user-mention" data-account-id="712020:7be29006-93b1-4896-a87d-f47958668f05" target="_blank" data-linked-resource-id="437321752" data-linked-resource-version="1" data-linked-resource-type="userinfo" data-base-url="https://trilogycare.atlassian.net/wiki">Steven Boge</a>  
**Consulted:** <a href="https://trilogycare.atlassian.net/wiki/people/712020:317eed8c-f5dc-4946-8216-7e5ac3d761f8?ref=confluence" class="confluence-userlink user-mention" data-account-id="712020:317eed8c-f5dc-4946-8216-7e5ac3d761f8" target="_blank" data-linked-resource-id="263716877" data-linked-resource-version="1" data-linked-resource-type="userinfo" data-base-url="https://trilogycare.atlassian.net/wiki">Zoe Judd</a> <a href="https://trilogycare.atlassian.net/wiki/people/712020:704bb693-73de-44a6-9829-7b79486b2d91?ref=confluence" class="confluence-userlink user-mention" data-account-id="712020:704bb693-73de-44a6-9829-7b79486b2d91" target="_blank" data-linked-resource-id="720897" data-linked-resource-version="1" data-linked-resource-type="userinfo" data-base-url="https://trilogycare.atlassian.net/wiki">rudy chartier</a> <a href="https://trilogycare.atlassian.net/wiki/people/712020:19c9dfea-32f8-416f-9305-c22a55457ea4?ref=confluence" class="confluence-userlink user-mention" data-account-id="712020:19c9dfea-32f8-416f-9305-c22a55457ea4" target="_blank" data-linked-resource-id="469499912" data-linked-resource-version="1" data-linked-resource-type="userinfo" data-base-url="https://trilogycare.atlassian.net/wiki">edk</a>  
**Informed:** Supplier Relations, Finance

------------------------------------------------------------------------

### **Assumptions, Dependencies, Risks**

- Compliance Matrix remains the single source of truth for document requirements.

- Automated reminders and emails rely on active notification infrastructure.

- Supplier onboarding flow must integrate with compliance display logic.

- Risk: Delays in matrix updates or communication may cause misalignment of requirements.

------------------------------------------------------------------------

### **Estimated Effort**

**Design & Development:** ~2 sprints (approx. 4–6 weeks)  
Includes: service-level compliance setup, reminder notifications, billing flag integration, and supplier self-service entry.

------------------------------------------------------------------------

### **Proceed to PRD?**

**Yes** — forms a core dependency for Support at Home readiness and billing compliance.

</div>

<div class="pageSection group">

<div class="pageSectionHeader">

## Attachments:

</div>

<div class="greybox" align="left">

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [{D6A78D15-EAC6-40F8-92BE-BFB32A6732A5}-20250715-080709.png](attachments/656277531/656277542.png) (image/png)  

</div>

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
