---
title: "Trilogy Care Portal : CFB - 2. PRD - Client Facing Budget"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Budgets and Services](Budgets-and-Services_436076625.html)
3.  [CFB - Client Facing Budget](CFB---Client-Facing-Budget_525795513.html)

</div>

# <span id="title-text"> Trilogy Care Portal : CFB - 2. PRD - Client Facing Budget </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified by <span class="editor"> Steven Boge</span> on Sep 29, 2025

</div>

<div id="main-content" class="wiki-content group">

# PRD – Client-Facing Budget

------------------------------------------------------------------------

## 1. Executive Summary

The Client-Facing Budget feature enables compliant, transparent, and accessible budget communication for clients under the new Support at Home regime. It introduces Final Agreed Price (FAP) terminology, consolidates fees, and generates downloadable PDFs. This system will serve both new client onboarding and existing client migration, meeting the Nov 1 compliance deadline.

------------------------------------------------------------------------

## 2. Goals & Success Metrics

<div class="table-wrap">

|  |  |  |
|----|----|----|
| Goal | Metric | Target |
| Compliance with Dept. of Health requirements | % of budgets meeting FAP & disclaimer rules | 100% |
| Efficient PDF generation | Time to generate PDF | \< 60 seconds |
| Data accuracy | % of migrated budgets with correct rate card | ≥ 90% |
| Coordinator usability | <span class="inline-comment-marker" ref="bfc31a13-b774-4c3c-b521-5ea11716f07c">Satisfaction score in survey</span> | ≥ 4.0 / 5 |

</div>

------------------------------------------------------------------------

## 3. Problem (Why Now)

Under Support at Home, participants must be informed of several things when they receive their quarterly budget. They require a clear, compliant, and standardised view of their budgets, which can also be printed. Current methods are fragmented, risk regulatory non-compliance, and create confusion about FAP, contributions, and actual procurement costs. With Support at Home reforms commencing Nov 1, providing compliant client-facing budgets is both urgent and mandatory.  
  
Providers must work with participants to develop an individualised budget that outlines how funding will be spent in relation to the types and frequency of services in their care plan. A copy of the individualised budget must be given to the participant. (manual version 4, page 100)

Providers must give an **individualised budget**, prepared **in partnership** with the person, covering a **period agreed with the individual**

------------------------------------------------------------------------

## 4. Audience

- **Clients/Recipients & Representatives** – need clarity on budget allocations, contributions, and sourcing costs.

- **Coordinators/Care Partners** – require a dual-purpose tool for onboarding and migration conversations.

- **Compliance & Legal Teams** – ensure budget language and disclaimers meet regulatory standards.

------------------------------------------------------------------------

## 5. Outcomes

<div class="table-wrap">

|           |                                                                 |
|-----------|-----------------------------------------------------------------|
| Outcome   | Description                                                     |
| Outcome 1 | Clients see FAP in a consolidated, compliant format             |
| Outcome 2 | Coordinators can use one tool for onboarding and migration      |
| Outcome 3 | Transparent source rate breakdown prevents inflated procurement |
| Outcome 4 | Budgets can be generated, reviewed, and distributed as PDFs     |

</div>

------------------------------------------------------------------------

## 6. Background / Context

- **Regulatory drivers**: Dept. of Health, Disability and Ageing mandates use of “Final Agreed Price” in all communications, with fees consolidated.

- **Operational context**: Budget V2 migration and client contact process scheduled for Sept–Oct.

- **Commercial rationale**: Budget clarity supports utilisation and protects fee revenue under the new model.

------------------------------------------------------------------------

## 7. Definitions

<div class="table-wrap">

<table class="confluenceTable" data-table-width="760" data-layout="default" data-local-id="8704f547-cc98-42cf-8ae6-033d874b111a">
<tbody>
<tr>
<th class="confluenceTh"><p>Term</p></th>
<th class="confluenceTh"><p>Definition</p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p>Budget</p></td>
<td class="confluenceTd"><p>This is the recipient’s quarterly budget for their<br />
Ongoing services<br />
AND Assistive Technology<br />
AND Home Modifications</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>FAP (Final Agreed Price)</p></td>
<td class="confluenceTd"><p>All-inclusive figure shown to clients, consolidating fees</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Source Rate / Source Price</p></td>
<td class="confluenceTd"><p>Actionable provider cost, excluding Trilogy loadings.<br />
aka Supplier agreed rate<br />
aka what the client knows how much they can source the supplier/provider for</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Rate Card</p></td>
<td class="confluenceTd"><p>A structured table, showing units, frequency, weekday fee format, ie how much the Source rate is per unit at different times of the week (eg - Sundays may cost more)</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Disclaimers</p></td>
<td class="confluenceTd"><p>Regulatory text clarifying estimated values (funding streams, contributions)</p></td>
</tr>
<tr>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
</tr>
</tbody>
</table>

</div>

------------------------------------------------------------------------

## 8. Scope Requirements

EXAMPLE BELOW

<a href="https://trilogycare.atlassian.net/wiki/x/OgCaHw" data-card-appearance="inline" rel="nofollow">https://trilogycare.atlassian.net/wiki/x/OgCaHw</a>

<div class="table-wrap">

|  |  |  |
|----|----|----|
| Goal | Metric | Target |
| Generate client-facing budget PDFs | PDF generation success rate | 100% |
| Comply with requirements of the Aged Cre rules | All details specified are included | 100% compliant |
| Show FAP per service and in total | Display accuracy | 100% compliant |
| Provide source rate transparency | Inclusion of rate cards | Standardized across all budgets |
| Include removable disclaimers | Ability to toggle disclaimers post–Nov 1 | Yes |
| Support onboarding & migration | Coordinators using system | 100% of cases |

</div>

------------------------------------------------------------------------

## 9. Out of Scope

- Care Plan redesign (covered in separate PRD).

- Supplier-specific pricing (supplier names excluded).

- Advanced AI-driven budget forecasting (future enhancement).

------------------------------------------------------------------------

## 10. Assumptions

- All client budgets will be migrated to Budget V2 structure by Sept 29.

- Legal disclaimers are finalised and approved in advance.

- Migration team ensures complete rate card data.

------------------------------------------------------------------------

## 11. Requirements, written as User Stories

<div class="table-wrap">

<table class="confluenceTable" data-table-width="1058" data-layout="center" data-local-id="c922daad-93c7-493e-beb6-cf824a3da319">
<tbody>
<tr>
<th class="confluenceTh"><p><strong>Area</strong></p></th>
<th class="confluenceTh"><p><strong>User Story</strong></p></th>
<th class="confluenceTh"><p><strong>Priority</strong></p></th>
<th class="confluenceTh"><p><strong>Acceptance Criteria</strong></p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p>Budget PDF Generation</p></td>
<td class="confluenceTd"><p>As a client, I want a downloadable PDF of my budget, so that I can print, share and keep a permanent copy.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p>PDF generates in &lt;60seconds, accurate content</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Terminology</p></td>
<td class="confluenceTd"><p>All Budgets will use the Department's official terminology, as per Section 155-50 of the Aged care rules. Refer to definitions table above</p></td>
<td class="confluenceTd"><p>Should</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Budget Summary</p></td>
<td class="confluenceTd"><p>Total ongoing funding<br />
Amount of government funding (including supplements). Exact classification label/level, exact dollar amount per quarter</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Budget Summary</p></td>
<td class="confluenceTd"><p>Include a <strong>Missed Care</strong> headline - “you may lose up to X amount this quarter that will not rollover unless..”<br />
AND</p>
<p>“contact your care partner for a service plan review should you want to plan to use this funding”</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p><a href="https://trilogycare.atlassian.net/wiki/people/712020:9a4da94d-649c-42ee-814a-375e98ac6b75?ref=confluence" class="confluence-userlink user-mention" data-account-id="712020:9a4da94d-649c-42ee-814a-375e98ac6b75" target="_blank" data-linked-resource-id="330858511" data-linked-resource-version="1" data-linked-resource-type="userinfo" data-base-url="https://trilogycare.atlassian.net/wiki">Romy Blacklaw</a></p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Details</p></td>
<td class="confluenceTd"><p>Define the <strong>period</strong> covered.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Details</p></td>
<td class="confluenceTd"><p>Include words to the effect of “this has been prepared in partnership with you”.</p></td>
<td class="confluenceTd"><p>Could</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Details</p></td>
<td class="confluenceTd"><p>Make reference to “your preferences, goals and needs” as per your care plan</p></td>
<td class="confluenceTd"><p>Could</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Details</p></td>
<td class="confluenceTd"><p>The Budget will include <strong>itemised</strong> budget for the services top be delivered.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Details- Contribution rate</p></td>
<td class="confluenceTd"><p>If the Contribution rate is known - The <strong>contribution <u>rate</u></strong> <u></u> determination for the service expected, how much the participant will pay vs government funding.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Details- Contribution rate</p></td>
<td class="confluenceTd"><p>If the Contribution rate is NOT known - The maximum <strong>contribution <u>rate</u></strong> that could apply</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Details - Cost</p></td>
<td class="confluenceTd"><p>The $ <strong>Cost</strong> of delivery of the service.<br />
ie By each Service type:<br />
frequencies / quantities * cost per service (or unit prices) = total estimated cost in the quarterly budget.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Details - Contribution</p></td>
<td class="confluenceTd"><p>The $ <strong>Amount of the individual contribution</strong> of delivery of the service.<br />
ie By each Service type:<br />
frequencies / quantities * Contribution per service = total estimated contribution in the quarterly budget.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Details- Subsidy</p></td>
<td class="confluenceTd"><p><strong>Amount of subsidy</strong> the provider will be eligible for (if known)</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Compliance &amp; FAP Display</p></td>
<td class="confluenceTd"><p>As a client, I want to see FAP as a single figure, so that I know the official cost without confusion.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p>FAP consolidated, compliant wording</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Budget - AT</p></td>
<td class="confluenceTd"><p>For Assistive Technology, an itemised budget with the description and cost of the AT products and equipment.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Budget - HM</p></td>
<td class="confluenceTd"><p>For Home Modification, an itemised budget with the description and cost of the HM Supplies and services.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p>Compliance &amp; FAP Display</p></td>
<td class="confluenceTd"><p>As a coordinator, I want FAP broken down to per-service rates, so I can explain details.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p>Per-service rates display correctly</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Transparency &amp; Source Rates</p></td>
<td class="confluenceTd"><p>As a self-managing client, I want to see source rates (excluding loadings), so I can procure at the right cost.</p></td>
<td class="confluenceTd"><p>Should</p></td>
<td class="confluenceTd"><p>Source rates visible, no supplier names</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Disclaimers</p></td>
<td class="confluenceTd"><p>As a client, I want disclaimers included for estimated funding streams and contributions.</p>
<p><strong>Contribution rates disclaimers</strong> required noting assumed calculations subject to departmental confirmation</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p>Disclaimers display in all pre–Nov 1 PDFs</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Disclaimers</p></td>
<td class="confluenceTd"><p>As an admin, I want to remove disclaimers after Nov 1.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"><p>Toggle/flag available in config</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Unspent funds / carry-over rules</p></td>
<td class="confluenceTd"><p>Max amount allowed, how much if any is being carried over, any conditions about usage.</p>
<p><strong>Funding streams disclaimers</strong> needed for quarterly and carryover amounts</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd"></td>
</tr>
</tbody>
</table>

</div>

------------------------------------------------------------------------

## 12. User Interaction & Design Notes

- **Navigation**: “Preview PDF” button on client budget tab.

- **Layout**: Repurpose statement design (page 2 baseline) with enhanced tables.

- **UI**: Consistent Trilogy Care branding; table structure for rates/units/frequency.

- **Accessibility**: Large font, screen reader compatibility.

------------------------------------------------------------------------

## 13. Milestones

<div class="table-wrap">

|                             |                 |         |         |             |
|-----------------------------|-----------------|---------|---------|-------------|
| Phase                       | Owner           | Start   | End     | Status      |
| Budget V2 Migration         | Data Team       | Sept 1  | Sept 29 | In Progress |
| PDF Feature Dev             | Tim & Dev Squad | Sept 15 | Sept 29 | Planned     |
| Legal Disclaimers Finalised | Romy (Legal)    | Sept 20 | Sept 29 | Pending     |
| Coordinator Testing         | Ops             | Oct 1   | Oct 15  | Planned     |
| Stakeholder Review          | Product/Design  | Oct 20  | Oct 25  | Planned     |
| Go-Live                     | All             | Nov 1   | Nov 1   | Pending     |

</div>

------------------------------------------------------------------------

## 14. Reference Materials

- Client-Facing Budget transcript notes

- BRP Roadmap & Success Metrics

- Client-Facing Care Plan PRD

- SAH Manual V4:  
  <a href="https://www.health.gov.au/sites/default/files/2025-09/support-at-home-program-manual-a-guide-for-registered-providers.pdf" class="external-link" rel="nofollow">https://www.health.gov.au/sites/default/files/2025-09/support-at-home-program-manual-a-guide-for-registered-providers.pdf</a>

- Aged Care Final rules:  
  <a href="https://www.legislation.gov.au/F2025L01173/asmade/text" class="external-link" data-card-appearance="inline" rel="nofollow">https://www.legislation.gov.au/F2025L01173/asmade/text</a>

- 

------------------------------------------------------------------------

## Questions

Are these requirements applicable to the monthly statement also? If yes, can we make them look very similar?

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
