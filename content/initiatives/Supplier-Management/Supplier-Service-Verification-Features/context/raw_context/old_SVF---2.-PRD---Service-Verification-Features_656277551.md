<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)

</div>

# <span id="title-text"> Trilogy Care Portal : SVF - 2. PRD - Service Verification Features </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified by <span class="editor"> Steven Boge</span> on Nov 06, 2025

</div>

<div id="main-content" class="wiki-content group">

**Product Requirements Document (PRD)**  
**Title:** Supplier and Service-Level Compliance Management

------------------------------------------------------------------------

### **1. Executive Summary**

**Document Status:** Draft  
**Jira Epic:** <span class="confluence-jim-macro jira-issue" jira-key="TP-2478"> <a href="https://trilogycare.atlassian.net/browse/TP-2478" class="jira-issue-key"><img src="https://trilogycare.atlassian.net/images/icons/issuetypes/epic.svg" class="icon" />TP-2478</a> - <span class="summary">\[SVF\] Supplier Service Verification Features \[TP-2478\]</span> <span class="aui-lozenge aui-lozenge-subtle aui-lozenge-complete jira-macro-single-issue-export-pdf">To Do</span> </span>  
**Target Release:**  
**Owner:** \[ \]  
**Designer:** \[ \]  
**Tech Lead:** \[ \]  
**QA:** \[ \]  
**Teams Chat:** \[ \]  
**Related Docs:**

- *Credentials and Compliance Matrix with Expiry.xlsx*

- *Supplier_Verified_vs_Service_Verified_v2.md*

- *Support at Home Program Manual v3*

**Problem Statement**  
Suppliers currently undergo verification at a provider level, but the new Support at Home framework introduces distinct **service-level compliance requirements** for each service type. The portal must manage both levels of verification — supplier and service — with clear workflows, visibility, and accountability. Non-compliance currently causes billing delays and manual intervention.

**Audience**

- Suppliers (self-managed and agency)

- Compliance Officers and Operations Staff

- Billing and Finance Processors

**Desired Outcomes**

1.  Ensure compliance requirements for every service type are visible and trackable.

2.  Enable suppliers to self-manage service updates and renewals.

3.  Reduce manual intervention in identifying unverified services.

4.  Improve transparency in billing and compliance workflows.

------------------------------------------------------------------------

### **2. Goals & Success Metrics**

<div class="table-wrap">

|  |  |  |
|----|----|----|
| Goal | Metric | Target |
| Establish service-level verification | % of services with compliance checklist applied | 100% of active Tier-3 services |
| Improve supplier visibility of compliance | % of suppliers with access to overall compliance summary | 100% |
| Reduce compliance-related billing holds | \# of compliance-related holds per month | ↓ 50% |
| Improve expiry responsiveness | Avg. days between document expiry and update | \< 7 days |

</div>

------------------------------------------------------------------------

### **3. Background / Context**

- Support at Home introduces **tiered service categories** with distinct compliance obligations.

- Compliance data is defined by the **Credentials and Compliance Matrix**, outlining required document types, expiry rules, and validation logic.

- Suppliers can provide multiple services under different Tier-3 categories (e.g., Direct and Indirect delivery modes).

- Billing is dependent on the verification of both supplier and service. If a service is not verified, payment cannot proceed.

- Currently, manual contact is needed when suppliers submit bills against unverified services. This PRD automates those triggers and clarifies responsibilities.

------------------------------------------------------------------------

### **4. Definitions**

<div class="table-wrap">

|  |  |
|----|----|
| Term | Definition |
| **Supplier Verified Stage** | Overall compliance status of a supplier organisation. |
| **Service Verified Stage** | Compliance status of a specific service type provided by a supplier. |
| **Compliance Matrix** | Source of truth defining required documents and expiry rules per service type. |
| **On Hold – Compliance** | Billing hold reason applied when service or supplier verification = false. |
| **Update Service Request Email** | System-generated message prompting supplier to update an unverified or expired service. |

</div>

------------------------------------------------------------------------

### **5. Requirements (User Stories)**

<div class="table-wrap">

<table class="confluenceTable" data-table-width="1447" data-layout="center" data-local-id="d14ef59b-9682-498d-acc4-dc3d35925832">
<tbody>
<tr>
<th class="confluenceTh"><p>Ref</p></th>
<th class="confluenceTh"><p>Description</p></th>
<th class="confluenceTh"><p>Acceptance Criteria</p></th>
<th class="confluenceTh"><p>MoSCoW</p></th>
<th class="confluenceTh"><p><strong>Jira</strong></p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>US-01</strong></p></td>
<td class="confluenceTd"><p><strong>Suppliers can add service types and view compliance requirements per service, and be informed to understand why it is needed.</strong></p></td>
<td class="confluenceTd"><p>During onboarding or service update, the supplier sees the list of compliance requirements for each selected service type (as defined in the matrix).</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p><a href="https://trilogycare.atlassian.net/browse/TP-2484" class="external-link" rel="nofollow"><strong>TP-2484</strong></a></p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>US-02</strong></p></td>
<td class="confluenceTd"><p><strong>Suppliers can view compliance checklist per service.</strong></p></td>
<td class="confluenceTd"><p>Each Service type record displays required documents, expiry requirements, and verification status.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p><a href="https://trilogycare.atlassian.net/browse/TP-2484" class="external-link" rel="nofollow"><strong>TP-2484</strong></a></p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>US-03</strong></p></td>
<td class="confluenceTd"><p><strong>Compliance Officers can review and approve or reject documents.</strong></p></td>
<td class="confluenceTd"><p>Approval sets service status to “Verified” once all requirements met.<br />
Rejections return service to Pending.<br />
We need wording for the email rejection</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p>TP-2484?</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>US-04</strong></p></td>
<td class="confluenceTd"><p><strong>Expired documents trigger automatic status change.</strong></p></td>
<td class="confluenceTd"><p>When a document passes expiry, the service status changes to “Expired,” and supplier receives notification that specifies WHICH document and WHICH service is affected... <span style="background-color: rgb(211,241,167);">(</span><strong><span style="background-color: rgb(211,241,167);">EXPAND </span></strong><a href="https://trilogycare.atlassian.net/wiki/people/712020:7be29006-93b1-4896-a87d-f47958668f05?ref=confluence" class="confluence-userlink user-mention" data-account-id="712020:7be29006-93b1-4896-a87d-f47958668f05" target="_blank" data-linked-resource-id="437321752" data-linked-resource-version="1" data-linked-resource-type="userinfo" data-base-url="https://trilogycare.atlassian.net/wiki">Steven Boge</a><span style="background-color: rgb(211,241,167);"> .. check with Zoe.. </span></p>
<p>Also - at a supplier level - police check “tier 2”.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p><a href="https://trilogycare.atlassian.net/browse/TP-2618" class="external-link" rel="nofollow">TP-2618</a></p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>US-05</strong></p></td>
<td class="confluenceTd"><p><strong>Billing visibility of verification.</strong></p></td>
<td class="confluenceTd"><p>Bills screen displays supplier-level and service-level verification.</p>
<p>If either is not verified, the processor can flag “On Hold – Compliance.”<br />
We need a design how to display the on hold reasons.</p>
<span class="confluence-embedded-file-wrapper image-center-wrapper confluence-embedded-manual-size"><img src="attachments/656277551/671481857.png?width=481" class="confluence-embedded-image image-center" loading="lazy" data-image-src="attachments/656277551/671481857.png" data-height="373" data-width="481" data-unresolved-comment-count="0" data-linked-resource-id="671481857" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image-20251104-030831.png" data-base-url="https://trilogycare.atlassian.net/wiki" data-linked-resource-content-type="image/png" data-linked-resource-container-id="656277551" data-linked-resource-container-version="12" data-media-id="0ef48d71-b62f-4458-a4a9-c733089cadb8" data-media-type="file" width="481" alt="image-20251104-030831.png" /></span></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>US-06</strong></p></td>
<td class="confluenceTd"><p><strong>Bill-triggered update service workflow.</strong></p></td>
<td class="confluenceTd"><p>If a bill is placed on hold for compliance, the system sends an “Update Service Request” email to the supplier to prompt action.</p>
<p><span class="confluence-jim-macro jira-issue resolved" data-jira-key="TP-1662"> <a href="https://trilogycare.atlassian.net/browse/TP-1662" class="jira-issue-key"><img src="https://trilogycare.atlassian.net/images/icons/issuetypes/epic.svg" class="icon" />TP-1662</a> - <span class="summary">On-Hold &amp; Rejection Bill Emails</span> <span class="aui-lozenge aui-lozenge-subtle aui-lozenge-success jira-macro-single-issue-export-pdf">Done</span> </span></p>
<p>DONE, but we need an email worked template for this 9 reminders (at 3, 7 and 10 days)</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p>TP-2</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>US-07</strong></p></td>
<td class="confluenceTd"><p><strong>Supplier self-triggered service application.</strong></p></td>
<td class="confluenceTd"><p>Verified suppliers can log in anytime to add<br />
- new locations<br />
- new services at those locations</p>
<p>AND - the or apply for new services and start the compliance process.</p>
<p>BUT - we need to show the ORG and SERVICE separately … <strong>STEVE</strong></p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>US-08</strong></p></td>
<td class="confluenceTd"><p><strong>Matrix-driven compliance requirements.</strong></p></td>
<td class="confluenceTd"><p>The portal references the Compliance Matrix for all service-level requirement sets. Any change in the matrix automatically updates displayed requirements.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p>exists</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>US-09</strong></p></td>
<td class="confluenceTd"><p><strong>Planned service alignment.</strong></p></td>
<td class="confluenceTd"><p>Client planned services display the corresponding verification status of the service type provided to them.<br />
this is on the UI - on<br />
- bills pages with line items (so bill processing team knows the supplier is compliant for this… and the bills processor can put bill on hold for THIS reason….)</p>
<ul>
<li><p>and this will affect eth current logic for approvals….</p></li>
</ul></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>US-10</strong></p></td>
<td class="confluenceTd"><p><strong>Expiry reminders.</strong></p></td>
<td class="confluenceTd"><p>Suppliers receive notifications before document expiry (default: 30 days). and the documents are specific.</p>
<p>Document is set to “expiring soon” at -30 days<br />
Reminder sent on -7 days</p>
<p>on day of expiry, you are no long compliant for SPECIFIC Service ( and thsiu may affect payments)</p></td>
<td class="confluenceTd"><p>Should</p></td>
<td class="confluenceTd"><p>Set up.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>US-11</strong></p></td>
<td class="confluenceTd"><p><strong>Supplier compliance summary view.</strong></p></td>
<td class="confluenceTd"><p>Compliance has a dashboard view Combined view shows supplier-level and service-level verification statuses, with clear next actions.</p>
<p>the fist time onboarding screen, as is</p>
<span class="confluence-embedded-file-wrapper image-center-wrapper confluence-embedded-manual-size"><img src="attachments/656277551/671678472.png?width=683" class="confluence-embedded-image image-center" loading="lazy" data-image-src="attachments/656277551/671678472.png" data-height="312" data-width="1401" data-unresolved-comment-count="0" data-linked-resource-id="671678472" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image-20251104-034238.png" data-base-url="https://trilogycare.atlassian.net/wiki" data-linked-resource-content-type="image/png" data-linked-resource-container-id="656277551" data-linked-resource-container-version="12" data-media-id="78fc31ed-dbc7-4fd3-86e5-a2cfe7161128" data-media-type="file" width="683" alt="image-20251104-034238.png" /></span>
<p>BUT we need one at the supplier verification level</p>
<p>and then specific services by supplier, level.</p>
<span class="confluence-embedded-file-wrapper image-center-wrapper confluence-embedded-manual-size"><img src="attachments/656277551/672268294.png?width=784" class="confluence-embedded-image image-center" loading="lazy" data-image-src="attachments/656277551/672268294.png" data-height="781" data-width="1271" data-unresolved-comment-count="0" data-linked-resource-id="672268294" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image-20251104-034557.png" data-base-url="https://trilogycare.atlassian.net/wiki" data-linked-resource-content-type="image/png" data-linked-resource-container-id="656277551" data-linked-resource-container-version="12" data-media-id="fe8c996e-fd87-464e-86d4-b6fde54bcc82" data-media-type="file" width="784" alt="image-20251104-034557.png" /></span></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p>exists , but not in prod</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>US-12</strong></p></td>
<td class="confluenceTd"><p><strong>Unverified planned service alerts.</strong></p></td>
<td class="confluenceTd"><p>Compliance officers receive an alert when a planned service becomes unverified (expired or rejected).</p>
<p>there is an email that is sent - “expiring soon”</p>
<p>and when it hits day1 - there</p>
<p>ZOE - THE EMAILS ARE CURRENTLY BEING SENT.</p>
<p>dashboard is better, yes - as per US-11..</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>US-13</strong></p></td>
<td class="confluenceTd"><p><strong>Compliance dashboard.</strong></p></td>
<td class="confluenceTd"><p>Dashboard lists unverified suppliers and services, with filter options.</p></td>
<td class="confluenceTd"><p>Could</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>14</p></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"><p>we need to crlearly see whicjh services are NOT complienat on eths esupplie rscren</p></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>15</p></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"><p>We want a tool tip to pop up when they are submitting documents. Stupid proofed…</p></td>
<td class="confluenceTd"><p>Could</p></td>
<td class="confluenceTd"></td>
</tr>
</tbody>
</table>

</div>

------------------------------------------------------------------------

### **6. Out of Scope**

- Automatic bill approval workflows (not yet implemented).

- Integration of matrix data editing within the supplier portal (maintained internally).

- Historical backfill of legacy compliance data (one-time migration to be handled separately).

------------------------------------------------------------------------

### **7. Open Questions**

1.  Should expiry reminder frequency (30/14/7 days) be configurable by Compliance Admin?

2.  Should suppliers be restricted from billing on unverified services or allowed with hold flag only?

3.  Will “Update Service Request” emails include direct upload links or route via portal login?

4.  Should compliance officers have override authority to manually set verification = true under certain conditions?

------------------------------------------------------------------------

### **8. User Interaction & Design Notes**

- **Supplier Onboarding / Update:** Display required documents for each selected service type (non-editable list sourced from matrix).

- **Supplier Dashboard:** Separate “Supplier-Level” and “Service-Level” sections, each with status badges (Verified / Pending / Expired).

- **Compliance Review Screen:** Table showing document name, uploaded date, expiry, and approve/reject buttons.

- **Billing Screen:** Add verification indicators beside each service line, and an “On Hold – Compliance” flag.

- **Notifications:**

  - Triggered when:

    - Document expires.

    - Bill placed on hold due to unverified service.

  - Recipients: Supplier (email), Compliance team (internal alert).

------------------------------------------------------------------------

### **9. Milestones**

<div class="table-wrap">

|             |       |       |       |         |
|-------------|-------|-------|-------|---------|
| Phase       | Owner | Start | End   | Status  |
| Design      | \[ \] | \[ \] | \[ \] | Pending |
| Development | \[ \] | \[ \] | \[ \] | Pending |
| QA / UAT    | \[ \] | \[ \] | \[ \] | Pending |
| Release     | \[ \] | \[ \] | \[ \] | Pending |

</div>

------------------------------------------------------------------------

### **10. Reference Materials**

- *Credentials and Compliance Matrix with Expiry.xlsx* – defines document requirements and expiries.

- *Supplier_Verified_vs_Service_Verified_v2.md* – outlines supplier vs service-level verification logic.

- *Support at Home Program Manual v3* – background on compliance obligations.

------------------------------------------------------------------------

This PRD stays strictly within the boundaries of business requirements already stated or directly implied by your direction — no speculative architecture or implementation details, but detailed enough to hand to design and compliance teams for scoping and UI drafting.

</div>

<div class="pageSection group">

<div class="pageSectionHeader">

## Attachments:

</div>

<div class="greybox" align="left">

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [image-20251104-030831.png](attachments/656277551/671481857.png) (image/png)  
<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [image-20251104-034238.png](attachments/656277551/671678472.png) (image/png)  
<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [image-20251104-034557.png](attachments/656277551/672268294.png) (image/png)  

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
