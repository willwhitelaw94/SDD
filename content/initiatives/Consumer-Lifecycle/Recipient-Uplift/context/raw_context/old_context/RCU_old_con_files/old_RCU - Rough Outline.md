---
title: "Trilogy Care Portal : RCU Page Outline (Rough notes)"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Consumer Journey](Consumer-Journey_436208084.html)
3.  [RCU - Recipient Uplift](RCU---Recipient-Uplift_436896328.html)

</div>

# <span id="title-text"> Trilogy Care Portal : RCU Page Outline (Rough notes) </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> Steven Boge</span>, last modified on Oct 01, 2025

</div>

<div id="main-content" class="wiki-content group">

## Page Outline (Rough)

<div class="table-wrap">

<table class="confluenceTable" data-table-width="914" data-layout="center" data-local-id="fb1769ca-d1a6-47c4-a198-1820327086d2">
<tbody>
<tr>
<th class="confluenceTh"><p><strong>Tab Name</strong></p></th>
<th class="confluenceTh"><p><strong>Pages / Subsections</strong></p></th>
<th class="confluenceTh"><p><strong>Feature Description</strong></p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>Dashboard</strong></p></td>
<td class="confluenceTd"><p>Overview (Home Dashboard)</p></td>
<td class="confluenceTd"><ul>
<li><p>Central overview of care and package status • Displays care level, budget balance, and package status • Action list showing pending tasks (e.g. new bills to review) • Quick navigation links to sub-pages • Designed to be the “home base” for recipients</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Care Circle</strong> (Contacts)</p></td>
<td class="confluenceTd"><p>Care Team Contacts (Coordinator, Supporters/Representatives, Providers)</p></td>
<td class="confluenceTd"><ul>
<li><p>Lists all members of the care circle with role labels (Coordinator, Provider, Representative, Supporter) • Shows phone/email contact details • Distinguishes <strong>Representative vs Supporter</strong> roles (important for compliance) • Allows initiating contact (e.g. email link) • Ensures correct contact hierarchy for agreements/notifications</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Care Plan</strong></p></td>
<td class="confluenceTd"><p>Goals &amp; Services; Needs &amp; Risks; Plan Documents</p></td>
<td class="confluenceTd"><ul>
<li><p>Displays client goals and planned services • Contains sections for <strong>Needs</strong> and <strong>Risks</strong> (aligned with Support at Home compliance) • Links risks and needs to care actions or goals • Provides access to the current Care Plan document • Supports tagging and highlighting high-risk items • Planned enhancement: <strong>AI-generated Care Plans</strong> (drafted from assessment data, reviewed by care partner before approval)</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Clinical</strong></p></td>
<td class="confluenceTd"><p>Health &amp; Assessments; Prescriptions</p></td>
<td class="confluenceTd"><ul>
<li><p>Shows client’s medical conditions and history • Records outcomes of clinical assessments • Tracks prescriptions for equipment/services requiring clinician approval • Holds/flags invoices until a prescription is on file • Manual workflow available if API integration is delayed • Ensures compliance with rules requiring professional sign-off for high-cost or clinical items</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Budget &amp; Funding</strong></p></td>
<td class="confluenceTd"><p>Budget Overview; Funding Breakdown; Utilisation</p></td>
<td class="confluenceTd"><ul>
<li><p>Displays client’s <strong>quarterly budget</strong> and overall funding • Breaks down spend by service categories/funding streams • Tracks <strong>utilisation rate</strong> in real-time (progress indicators) • Flags overspend/underspend • Supports <strong>Budget V2</strong> rules: service plan versioning, new subsidy and co-payment logic • Integrates with Services Australia API/CSV for claims</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Fees &amp; Contributions</strong></p></td>
<td class="confluenceTd"><p>Contribution Summary; Fee Details; Payment Status</p></td>
<td class="confluenceTd"><ul>
<li><p>Shows required <strong>participant co-contributions</strong> • Separates unpaid vs paid contributions • Lists contribution invoices/schedules • Explains fee breakdowns (daily fees, service % loadings) • Will include online payment/direct debit integration • Ensures participants understand obligations under new Support at Home fee rules</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Bills</strong></p></td>
<td class="confluenceTd"><p>Pending Approval Bills; Bill History; Submit Claim</p></td>
<td class="confluenceTd"><ul>
<li><p>Lists all incoming provider invoices • Client actions: approve, dispute, or query • <strong>Auto-approval</strong> after 48 hours unless disputed • Dispute workflow: enter comments, alerts staff for review • Supports client reimbursements (submit receipts for out-of-pocket expenses) • Displays funding stream used for each bill • Provides transparent status updates (pending, approved, paid)</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Statements</strong></p></td>
<td class="confluenceTd"><p>Monthly Statements (PDF &amp; Digital)</p></td>
<td class="confluenceTd"><ul>
<li><p>Provides <strong>monthly care statements</strong> (regulatory requirement) • Available in digital interactive form and downloadable PDF • Breaks down charges by funding stream and service • Shows subsidy vs client contribution amounts • Allows clients to raise queries if discrepancies found • Completes transparency requirements for Support at Home reporting</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Timeline</strong></p></td>
<td class="confluenceTd"><p>Activity Log (Care Timeline)</p></td>
<td class="confluenceTd"><ul>
<li><p>Chronological log of all client activities/events • Includes care plan updates, check-ins, service delivery notes, and financial events • Integrates AI-generated call/meeting summaries • May include <strong>service confirmation prompts</strong> (“Did this service occur?”) • Provides shared visibility across client, reps, and staff • Builds trust by keeping a live, auditable history</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Documents</strong></p></td>
<td class="confluenceTd"><p>Document Library (Uploads &amp; Downloads)</p></td>
<td class="confluenceTd"><ul>
<li><p>Stores key documents (HCA, Care Plan, assessments, statements) • Allows clients to <strong>upload documents</strong> (e.g. receipts, certificates) • Categorization (Care Plan, Clinical, Financial) for easy retrieval • Supports new <strong>agreement workflows</strong> (digital signing of Home Care Agreements)【25†L393-L4ures documents are always accessible and audit-ready • Improves experience by centralizing all files in one place</p></li>
</ul></td>
</tr>
</tbody>
</table>

</div>

</div>

<div class="pageSection group">

<div class="pageSectionHeader">

## Attachments:

</div>

<div class="greybox" align="left">

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [{D6A78D15-EAC6-40F8-92BE-BFB32A6732A5}-20250715-080709.png](attachments/565739606/565739619.png) (image/png)  

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
