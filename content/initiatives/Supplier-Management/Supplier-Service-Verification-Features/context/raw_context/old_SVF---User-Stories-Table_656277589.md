<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [SVF - FILES / RESEARCH](656277585.html)

</div>

# <span id="title-text"> Trilogy Care Portal : SVF - User Stories Table </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified by <span class="editor"> Steven Boge</span> on Nov 05, 2025

</div>

<div id="main-content" class="wiki-content group">

INCLUDED IN PRD - <a href="https://trilogycare.atlassian.net/wiki/x/LwAeJw" data-card-appearance="inline" rel="nofollow">https://trilogycare.atlassian.net/wiki/x/LwAeJw</a>

------------------------------------------------------------------------

### **Supplier-Facing**

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| Ref | User Story | Scenario (Given / When / Then) | Acceptance Criteria | MoSCoW |
| **US-01** | As a Supplier User, I want to add a new **service type** I provide, so Trilogy can determine what compliance is required for that service. | **Given** I’m onboarding or updating services, **when** I select a Tier-3 service type to offer, **then** I’m shown the specific compliance requirements for that service. | Compliance requirements communicated clearly per service during onboarding or update. | Must |
| **US-02** | As a Supplier User, I want to see the **compliance checklist** for each service I provide, so I know which documents I need to upload. | **Given** I open a service I provide, **when** I view its compliance section, **then** I can see required documents, expiry requirements, and current status. | Checklist reflects matrix data; each item shows expiry and status. | Must |
| **US-06 (rev)** | As a Supplier User, I want to receive an **update service request email** from Compliance if my bill is placed on hold due to an unverified service, so I know to review or apply for that service. | **Given** a bill is placed on hold for verification being false, **when** that flag is raised, **then** an email is sent to the supplier requesting an update of that service. | Hold → email trigger; supplier can click through to update or apply for that service. | Must |
| **US-07 (rev)** | As a Supplier User, I want to **initiate an update** to add or change a service type myself at any time, so I can apply for new services without waiting for Compliance to contact me. | **Given** I’m a verified supplier, **when** I choose to add a new service type, **then** I can begin the compliance process for that service on my own. | Self-triggered workflow available to apply for additional services. | Must |
| **US-10** | As a Supplier User, I want to receive **reminders before any compliance document expires**, so I can renew on time. | **Given** a document has an expiry date, **when** it’s approaching expiry (e.g. 30 days before), **then** I receive a reminder notification. | Reminder sent ahead of expiry; includes link to update document. | Should |
| **US-11** | As a Supplier User, I want to view my **overall compliance summary** showing both Supplier- and Service-level status. | **Given** I log into the portal, **when** I open my Compliance Summary, **then** I see supplier-level status and all service-level statuses. | Combined view; clear indicators and next actions. | Must |

</div>

------------------------------------------------------------------------

### **Compliance / Operations**

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| Ref | User Story | Scenario | Acceptance Criteria | MoSCoW |
| **US-03** | As a Compliance Officer, I want to review and approve or reject documents for each provided service, so that the service can move to Verified. | **Given** a document is uploaded, **when** I approve or reject it, **then** the compliance status updates accordingly. | Approval = Verified if all docs met; rejection keeps Pending. | Must |
| **US-04** | As a Compliance Officer, I want services with expired documents to automatically move to Expired status. | **Given** a document passes expiry, **when** the system checks expiries, **then** the service status changes to Expired and supplier notified. | Expiry job runs; service status updated; supplier alert sent. | Must |
| **US-08** | As a Compliance Officer, I want compliance requirements for each service to come from the **central matrix**, so they’re consistent across all suppliers. | **Given** a service type exists, **when** the matrix defines required documents, **then** those rules apply automatically. | Portal pulls from matrix; reflects any updates. | Must |
| **US-09** | As Operations Staff, I want each client’s **planned services** to reflect the verification status of the service types provided to them. | **Given** a supplier provides a service type to a client, **when** its verification status changes, **then** all linked planned services show the correct status. | Compliance status joined to planned services; visible verified / unverified. | Must |
| **US-12** | As a Compliance Officer, I want to be alerted when **a planned service becomes unverified** due to expired or rejected compliance. | **Given** a planned service’s related service type becomes unverified, **when** that occurs, **then** I receive an internal alert. | Alert triggered to Compliance team with affected supplier / service details. | Must |
| **US-13** | As a Compliance Officer, I want a **dashboard** showing all suppliers or services that are not verified. | **Given** I open the Compliance Dashboard, **when** it loads, **then** I see lists of unverified suppliers and services with filters. | Dashboard of Not Verified / Expired; filter by supplier, service type, or date. | Could |

</div>

------------------------------------------------------------------------

### **Billing**

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| Ref | User Story | Scenario | Acceptance Criteria | MoSCoW |
| **US-05 (rev)** | As Billing Staff, I want to see whether a supplier is **verified at both supplier and service level** on an invoice, so I can decide whether to proceed with payment. | **Given** I review an invoice, **when** a line relates to a service, **then** I can see if the supplier and that specific service are Verified or Not Verified. | Bill screen shows both levels; processors can flag “On Hold – Compliance.” | Must |

</div>

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
