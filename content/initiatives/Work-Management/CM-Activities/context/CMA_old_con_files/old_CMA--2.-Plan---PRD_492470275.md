---
title: "Trilogy Care Portal : CMA- 2. Plan - PRD"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Work Management](Work-Management_676265986.html)
3.  [CMA - Care Management Activities](CMA---Care-Management-Activities_436895913.html)

</div>

# <span id="title-text"> Trilogy Care Portal : CMA- 2. Plan - PRD </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> Romy Blacklaw</span>, last modified by <span class="editor"> Steven Boge</span> on Oct 07, 2025

</div>

<div id="main-content" class="wiki-content group">

## Care Management Activities - Data-Triggered Communications System

**Scope note**: This PRD covers the Portal features and integrations needed to achieve Support at Home (SAH) compliance through automated, data-triggered care management communications with human-in-the-loop oversight.  
Post-November GenAI personalisation of messages and SMS are explicitly out of scope for MVP.

## Document Information

<div class="table-wrap">

|  |  |
|----|----|
| Field | Entry |
| Document Status | Handover to Dev: 07 Oct 2025 |
| Jira ID | <span class="confluence-jim-macro jira-issue" jira-key="TP-1880"> <a href="https://trilogycare.atlassian.net/browse/TP-1880" class="jira-issue-key"><img src="https://trilogycare.atlassian.net/images/icons/issuetypes/epic.svg" class="icon" />TP-1880</a> - <span class="summary">\[CMA\] CM Activities \[TP-1880\]</span> <span class="aui-lozenge aui-lozenge-subtle aui-lozenge-complete jira-macro-single-issue-export-pdf">To Do</span> </span> |
| Internal / SharePoint Links | <a href="https://miro.com/welcomeonboard/czZhaUNXWlRHeUVmemVjL0ZMNTVNYlUxcWMzbHc3a3hjT2xsRHoxRUNKY1R3OWc3Sm5mS3EveHVhMHViWGRCNk9abzVTZy9XcWtPTFZOVk9SaGs4cXpsSFNhcm1RVUxMNXRERFpnZ3IzQWVYQlhTeDZScFlNMExrbWpud1lSQmh0R2lncW1vRmFBVnlLcVJzTmdFdlNRPT0hdjE=?share_link_id=726269574778" class="external-link" data-card-appearance="inline" rel="nofollow">https://miro.com/welcomeonboard/czZhaUNXWlRHeUVmemVjL0ZMNTVNYlUxcWMzbHc3a3hjT2xsRHoxRUNKY1R3OWc3Sm5mS3EveHVhMHViWGRCNk9abzVTZy9XcWtPTFZOVk9SaGs4cXpsSFNhcm1RVUxMNXRERFpnZ3IzQWVYQlhTeDZScFlNMExrbWpud1lSQmh0R2lncW1vRmFBVnlLcVJzTmdFdlNRPT0hdjE=?share_link_id=726269574778</a> |
| Document Owner | Romy |
| Designer | Beth |
| Tech Lead | Matt |
| QA | TBD |
| Target Release | 1 November 2025 for SAH readiness |

</div>

## **Executive Summary**

We will build a data-triggered care management communication system that automatically identifies clients requiring outreach and generates draft communications for care partner approval. The system addresses the reality of our self-management model where natural monthly contact doesn't occur with all clients, whilst ensuring SAH compliance through proactive, intelligent engagement.

**Key Components**:

1.  **Databricks Integration** - Receives data triggers and generates draft communications

2.  **Portal Alert Dashboard** - Surfaces client alerts to care partners for review/action

3.  **Multi-channel Communications** - Email and SMS delivery options

4.  **Activity Logging** - Auto-captures all communications as care management activities

5.  **Human Oversight** - Care partners review, edit, and approve all communications

------------------------------------------------------------------------

## **Regulatory Context & Business Requirements**

### **Direct Care Management Requirements**

Per Support at Home program manual and business rules ( <a href="https://www.health.gov.au/sites/default/files/2025-06/support-at-home-program-manual-version-3-a-guide-for-registered-providers.pdf" class="external-link" rel="nofollow">Page 90 of Program Manual V3</a> )

**When the CMA’s occur AND they are meet the minimum requirement AND evidence is collated, THEN claims for funding are possible.**

- **CMA Definition**: Direct communication with participant and/or registered supporter about care-related matters

- **CMA Minimum Requirement**: At least one direct care management activity per client each month (minimum 15 minutes)

- **Evidence**: Must be documented in care notes with purpose, duration, origin, and timestamp

- **Claims**: Submitted in arrears, itemised by participant/date in 15-minute increments

- **Calculation** of care management funding will be based on:

  - Care management funding = care management quarterly base rate + care management quarterly supplement.

  - Care management quarterly base rate = 10% from each participant’s ongoing quarterly budget.

  - Care management quarterly supplement = 12 hours of care management divided by 4 quarters multiplied at the hourly rate of \$120 (subject to indexation revisions).

  - Funding: Billed at \$120/hour from pooled 10% of quarterly budget

### **Self-Management Model Challenge**

Unlike traditional providers, our self-management model empowers consumers to operate independently. However, this means we don't naturally have monthly direct contact with all clients, creating compliance risk whilst delivering on our value proposition of reduced management fees and increased client autonomy.

### **Solution Approach**

Intelligent, data-triggered communications that:

- Identify clients requiring care management attention through data analysis

- Generate contextually relevant draft communications

- Maintain human oversight and personalisation

- Provide multi-channel delivery (email/SMS) based on client preference

- Automatically log activities for compliance evidence

------------------------------------------------------------------------

## **Solution Overview**

### **1. Data Integration Layer (Databricks)**

**Data Sources**:

- **CRM Incident Data**: Falls, health episodes, service disruptions, complaints

- **Budget/Utilisation Analytics**: Underspend patterns, service gaps, payment issues

- **Service Delivery Metrics**: Provider cancellations, unused services, quality concerns

- **Risk Indicators**: Hospital admissions, medication reviews, safety assessments

**Processing Logic**:

- <span class="inline-comment-marker" ref="8e913a1b-82f0-4d86-b92a-c653de607952">Fortnightly</span> batch analysis of client data against trigger criteria

- Template selection based on client situation and communication history

- Queue management with care partner assignment

### **2. Portal Alert Dashboard**

**Features**:

- Client alert queue by care partner

- Trigger reason and recommended action

- Draft communication preview

- One-click approve/edit/reject functionality

### **3. Communication Templates (MVP - 4 Scenarios)**

#### <a href="https://trilogycare.atlassian.net/wiki/x/EYDtGw" data-card-appearance="inline" rel="nofollow">https://trilogycare.atlassian.net/wiki/x/EYDtGw</a>

<div class="table-wrap">

<table class="confluenceTable" data-table-width="1185" data-layout="center" data-local-id="6e69b7de-8a88-496c-8cb8-736c9c81bd66">
<tbody>
<tr>
<td class="confluenceTd" data-highlight-colour="#dae8f8"><p><strong>Task name (appears on dashboard)</strong></p></td>
<td class="confluenceTd" data-highlight-colour="#dae8f8"><p><strong>Data Source</strong></p></td>
<td class="confluenceTd" data-highlight-colour="#dae8f8"><p><strong>Template Example</strong></p></td>
<td class="confluenceTd" data-highlight-colour="#dae8f8"><p><strong>Due date</strong></p></td>
<td class="confluenceTd" data-highlight-colour="#dae8f8"><p><strong>Expiry Date</strong></p></td>
</tr>
<tr>
<td class="confluenceTd" data-highlight-colour="transparent"><p><strong>Service Gap Analysis and Budget Review</strong></p></td>
<td class="confluenceTd" data-highlight-colour="transparent"><p>Budgets v2 + Invoice data </p></td>
<td class="confluenceTd" data-highlight-colour="transparent"><p>"Hi [Name], we notice your gardening service hasn't commenced. Would you like support organising this?" </p></td>
<td rowspan="5" class="confluenceTd" data-highlight-colour="transparent"><p>Initially the 20th of month, but then updated to the Initial date plus the number of days snoozed.</p>
<p>No later that last day of month</p></td>
<td rowspan="5" class="confluenceTd" data-highlight-colour="transparent"><p>Last day of month.</p>
<p>Once the last day of the month has passed, the alert expires and this needs to be captured in a report.</p></td>
</tr>
<tr>
<td class="confluenceTd" data-highlight-colour="transparent"><p><strong>Incident Follow-up</strong></p></td>
<td class="confluenceTd" data-highlight-colour="transparent"><p>Incident reports (CRM) + Funding streams </p></td>
<td class="confluenceTd" data-highlight-colour="transparent"><p>"Following your recent fall, you may be eligible for restorative care pathway funding..." </p></td>
</tr>
<tr>
<td class="confluenceTd" data-highlight-colour="transparent"><p><strong>Well-being check -in</strong></p>
<p>(aka Vulnerability Monitoring (social isolation and/or risk of homelessness)</p></td>
<td class="confluenceTd" data-highlight-colour="transparent"><p>ACAT/IAT data scrape OR Portal needs/risks </p></td>
<td class="confluenceTd" data-highlight-colour="transparent"><p>"Hello [Name], as your care partner, I like to check in regularly about all aspects of your wellbeing, including staying socially connected. Are you finding enough opportunities to chat with friends, family, or neighbours? If you'd enjoy more social contact, I have some lovely options I could share with you..” </p></td>
</tr>
<tr>
<td class="confluenceTd" data-highlight-colour="transparent"><p><strong>Spending Alert</strong></p></td>
<td class="confluenceTd" data-highlight-colour="transparent"><p>Budget utilisation + Package funding </p></td>
<td class="confluenceTd" data-highlight-colour="transparent"><p>"Your current spending suggests a care plan review would be beneficial to review your package level funding..." <br />
(Template need to be sent to Beth, <a href="https://trilogycare.atlassian.net/wiki/people/712020:9a4da94d-649c-42ee-814a-375e98ac6b75?ref=confluence" class="confluence-userlink user-mention" data-account-id="712020:9a4da94d-649c-42ee-814a-375e98ac6b75" target="_blank" data-linked-resource-id="330858511" data-linked-resource-version="1" data-linked-resource-type="userinfo" data-base-url="https://trilogycare.atlassian.net/wiki">Romy Blacklaw</a> )</p></td>
</tr>
<tr>
<td class="confluenceTd" data-highlight-colour="transparent"><p><strong>Care Management Activity needed</strong></p></td>
<td class="confluenceTd" data-highlight-colour="transparent"></td>
<td class="confluenceTd" data-highlight-colour="transparent"><p>This is a catch-all template to contact clients.</p></td>
</tr>
</tbody>
</table>

</div>

<span class="confluence-embedded-file-wrapper image-center-wrapper confluence-embedded-manual-size"><img src="attachments/492470275/559513657.png?width=820" class="confluence-embedded-image image-center" loading="lazy" data-image-src="attachments/492470275/559513657.png" data-height="710" data-width="1517" data-unresolved-comment-count="0" data-linked-resource-id="559513657" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="image-20250930-074458.png" data-base-url="https://trilogycare.atlassian.net/wiki" data-linked-resource-content-type="image/png" data-linked-resource-container-id="492470275" data-linked-resource-container-version="49" data-media-id="736e39be-8210-4247-a8bb-6ee0ba6fbee5" data-media-type="file" width="820" alt="image-20250930-074458.png" /></span>

### **4. Multi-Channel Delivery**

**Email Delivery**:

- Delivery confirmation and bounce handling

**SMS Delivery** (<u>Future</u> requirement):

- Client preference detection and routing

- Character limit optimisation

- Delivery status tracking

- Same automatic logging as email

### **5. Activity Logging and Compliance**

**Automatic Documentation**:

- Creates care note with trigger reason, communication sent, and timestamp

- Pre-populates 15-minute care management activity entry

- Links to original data trigger for audit trail

- Flags for care partner confirmation/completion

------------------------------------------------------------------------

## **Technical Architecture**

### **Data Flow**

1.  **Interval Batch Processing** (Databricks)

    - Analyse client data against trigger rules

    - Generate priority alerts and draft communications

    - Push alerts to Portal via API

2.  **Portal Processing**

    - Receive alerts and queue by care partner

    - Present dashboard with review/action options

    - Handle care partner approvals and edits

3.  **Communication Delivery**

    - Route to email/SMS based on client preference

    - Send approved communications

    - Capture delivery confirmations

4.  **Activity Logging**

    - Auto-create care management notes

    - Update compliance dashboard

    - Prepare data for claims processing

### **Key Integrations**

- **Databricks API**: Trigger data and template generation

- **Portal Backend**: Alert management and approval workflow

- **Email Service**: Branded communication delivery

- **SMS Gateway**: Multi-channel messaging capability

- **CRM Integration**: Incident data and client preferences

- **Care Notes System**: Activity logging and compliance evidence

------------------------------------------------------------------------

## **User Stories (with MoSCoW prioritisation)**

<a href="https://trilogycare.atlassian.net/browse/TP-1880" class="external-link" data-card-appearance="embed" data-layout="full-width" data-width="100.00" rel="nofollow">https://trilogycare.atlassian.net/browse/TP-1880</a>

<span class="confluence-embedded-file-wrapper image-center-wrapper confluence-embedded-manual-size"><img src="attachments/492470275/579960852.jpg?width=904" class="confluence-embedded-image image-center" loading="lazy" data-image-src="attachments/492470275/579960852.jpg" data-height="622" data-width="1114" data-unresolved-comment-count="0" data-linked-resource-id="579960852" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="CMA-20251007-052002.jpg" data-base-url="https://trilogycare.atlassian.net/wiki" data-linked-resource-content-type="image/jpeg" data-linked-resource-container-id="492470275" data-linked-resource-container-version="49" data-media-id="a7fa425a-6342-4dbc-a20d-6524c757b7f4" data-media-type="file" width="904" alt="CMA-20251007-052002.jpg" /></span>

The working document with a <span class="inline-comment-marker" ref="3d7cc928-b262-492a-9e65-09002528d565">matrix of CMAs is saved here:</span>

<a href="https://trilogycare.sharepoint.com/:x:/s/SupportatHomeProgram/ETMgqvSQDjNNheqrH33p7ZgBXQnZxB2Qj_AcZDh3H64ySA?e=iLpS3F" class="external-link" data-card-appearance="inline" rel="nofollow">https://trilogycare.sharepoint.com/:x:/s/SupportatHomeProgram/ETMgqvSQDjNNheqrH33p7ZgBXQnZxB2Qj_AcZDh3H64ySA?e=iLpS3F</a>

------------------------------------------------------------------------

## **Success Metrics**

### **Compliance Metrics**

- **100% Monthly Coverage**: All active clients receive ≥1 direct CM activity per month

- **Documentation Completeness**: 100% of activities logged with required evidence

- **Claims Accuracy**: Zero compliance issues in Services Australia audits

### **Operational Metrics**

- **Alert Processing Time**: \<2 hours from trigger to care partner action

- **Communication Approval Rate**: \>85% of generated communications approved

- **Multi-channel Delivery**: \>95% successful delivery rate (email/SMS combined)

- **Care Partner Efficiency**: 50% reduction in manual outreach identification time

### **Quality Metrics**

- **Client Satisfaction**: Positive feedback on proactive communication relevance

- **Escalation Rate**: \<10% of automated communications require urgent follow-up

- **False Positive Rate**: \<15% of alerts deemed irrelevant by care partners

------------------------------------------------------------------------

## **Implementation Timeline**

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| Phase | Deliverable | Owner | Timeline | Notes |
| **Phase 1** | Databricks integration and trigger rules | Data/Dev | Aug 15 - Sep 15 | 4 trigger scenarios, API development |
| **Phase 2** | Portal alert dashboard and workflow | Dev/UX | Sep 1 - Sep 30 | Care partner interface, approval workflow |
| **Phase 3** | Communication templates and delivery | Dev | Sep 15 - Oct 15 | Email/SMS integration, logging system |
| **Phase 4** | Testing and compliance validation | QA/Ops | Oct 1 - Oct 25 | End-to-end testing, audit preparation |
| **Phase 5** | Training and go-live | Ops | Oct 26 - Nov 1 | Staff training, production deployment |

</div>

------------------------------------------------------------------------

## **Risk Mitigation**

### **Technical Risks**

- **Integration Complexity**: Phased approach with fallback to manual processes

- **Data Quality**: Validation rules and alert quality monitoring

- **Performance**: Load testing and scalable architecture design

### **Operational Risks**

- **Staff Adoption**: Comprehensive training and change management support

- **Client Acceptance**: Opt-out mechanisms and feedback collection

- **Compliance Gaps**: Robust audit trails and monitoring dashboards

### **Quality Risks**

- **Over-communication**: Frequency caps and client preference respect

- **Irrelevant Alerts**: Trigger rule refinement and feedback loops

- **Human Oversight**: Mandatory approval processes and quality checks

------------------------------------------------------------------------

## **Post-MVP Evolution**

### **November 2025+ GenAI Enhancement**

- AI-personalised communication drafting with confidence scoring

- Dynamic template optimisation based on client response patterns

- Predictive trigger refinement using machine learning

- Advanced natural language generation for contextual communications

### **Extended Capabilities**

- Integration with wearable devices and smart home sensors

- Proactive care plan updates based on communication outcomes

- Family/carer notification workflows

- Advanced analytics and outcome prediction

- Add further templates (in addition to the 4 above) after MVP - **<span style="background-color: rgb(253,208,236);">Sept 24th meeting</span>**

------------------------------------------------------------------------

## **Assumptions & Dependencies**

- **Databricks Platform**: Available and configured for real-time trigger processing

- **Client Communication Preferences**: Data available and current in CRM

- **Portal Infrastructure**: Sufficient capacity for alert dashboard and workflows

- **Email/SMS Services**: Reliable delivery partners with appropriate SLAs

- **Staff Training**: Adequate time allocation for change management and adoption

- **Regulatory Stability**: No major changes to SAH requirements during implementation

- Assume that Care Circle contacts are up to date and that all of the contacts in portal, related to a package are up to date. Therefore we have a structured way of having all contacts connected.

------------------------------------------------------------------------

## **Notes**

Sept 15th mention - This must be functioning by 3rd week of November at the very latest.

- **<span style="background-color: rgb(253,208,236);">Sept 24th meeting</span>** - In this CCU meeting - <a href="https://app.fireflies.ai/live/01K5AK3CQRB1RZME87DD12WHAT?ref=copied" class="external-link" data-card-appearance="inline" rel="nofollow">https://app.fireflies.ai/live/01K5AK3CQRB1RZME87DD12WHAT?ref=copied</a> the team discussed the need to have the Care Circle contacts up to date.

- Future requirements collated here: <a href="https://trilogycare.atlassian.net/wiki/spaces/TC/pages/572391460/CMA2+-+With+AI+generated+communications?atlOrigin=eyJpIjoiMzdiMDI0ODY2ZDVjNGJjOWEyYTBkZDUzYjE0ZjVkOWMiLCJwIjoiYyJ9" data-card-appearance="inline" rel="nofollow">https://trilogycare.atlassian.net/wiki/spaces/TC/pages/572391460/CMA2+-+With+AI+generated+communications?atlOrigin=eyJpIjoiMzdiMDI0ODY2ZDVjNGJjOWEyYTBkZDUzYjE0ZjVkOWMiLCJwIjoiYyJ9</a>

</div>

<div class="pageSection group">

<div class="pageSectionHeader">

## Attachments:

</div>

<div class="greybox" align="left">

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [image-20250930-050145.png](attachments/492470275/559841295.png) (image/png)  
<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [image-20250930-074458.png](attachments/492470275/559513657.png) (image/png)  
<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [CMA-20251007-052002.jpg](attachments/492470275/579960852.jpg) (image/jpeg)  

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
