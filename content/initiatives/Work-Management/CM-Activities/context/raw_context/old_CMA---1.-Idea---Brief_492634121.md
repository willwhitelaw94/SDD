<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Work Management](Work-Management_676265986.html)
3.  [CMA - Care Management Activities](CMA---Care-Management-Activities_436895913.html)

</div>

# <span id="title-text"> Trilogy Care Portal : CMA - 1. Idea - Brief </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified by <span class="editor"> Steven Boge</span> on Oct 09, 2025

</div>

<div id="main-content" class="wiki-content group">

<div class="table-wrap">

<table class="confluenceTable" data-table-width="1024" data-layout="center" data-local-id="c3a68e71-aa63-4e3c-a618-6f9e66a5da55">
<tbody>
<tr>
<td class="confluenceTd" data-highlight-colour="#b3d4ff"><p><strong>Section</strong></p></td>
<td class="confluenceTd" data-highlight-colour="#b3d4ff"><p><strong>Details</strong></p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Problem Statement</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Support at Home (SAH) requires ≥1 direct Care Management activity (CMA) per client per month (≥15 mins).</p></li>
<li><p>In Trilogy’s self-management model, clients operate independently, meaning natural monthly contact doesn’t occur with all clients.</p></li>
<li><p>This creates compliance risk and lost CM revenue while undermining proactive client engagement.</p></li>
<li><p>Current processes (manual notes, calls, emails) are fragmented and reactive.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Possible Solution</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Build a data-triggered communications system that ensures compliance and proactive engagement.</p></li>
<li><p>Data Integration Layer (Databricks): analyse CRM, budget, incident, and utilisation data against trigger rules.</p></li>
<li><p>Portal Alert Dashboard: queue of client alerts by care partner; shows trigger reason + draft comms; one-click approve/edit/reject.</p></li>
<li><p>Communication Templates (MVP – 4 scenarios): service gap, fall incident, vulnerability (isolation/homelessness), budget overspend.</p></li>
<li><p>Multi-channel delivery: email + SMS, routed to client preference, with delivery tracking.</p></li>
<li><p>Activity logging: auto-create CM note with 15-min entry, linked to trigger, for audit/claims.</p></li>
<li><p>Human oversight: all communications require care partner approval/edit before send (no AI personalisation in MVP).</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Benefits</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Compliance: 100% monthly CM coverage.</p></li>
<li><p>Revenue: Capture full 10% CM pool + vulnerable cohort allowances.</p></li>
<li><p>Efficiency: Automated detection + drafting reduces manual gap checks.</p></li>
<li><p>Client experience: Proactive, relevant outreach via preferred channel.</p></li>
<li><p>Data quality: Triggered comms linked to evidence and audit trail.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Owner</strong></p></td>
<td class="confluenceTd"><p>To be assigned – Product Owner / Care Operations lead</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Other Stakeholders</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Primary: Care Partners / Coordinators</p></li>
<li><p>Other: Recipients &amp; their representatives/supporters; Service Providers; Internal Finance, Compliance, and Operations teams</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Assumptions &amp; Dependencies</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Databricks integration available for data processing.</p></li>
<li><p>Reliable SMS + email delivery services in place.</p></li>
<li><p>Portal infrastructure ready for alert dashboard + workflows.</p></li>
<li><p>Client contact data accurate (representatives, preferences).</p></li>
<li><p>Services Australia system stable; SAH requirements unchanged.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Risks</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Data quality issues → false/irrelevant alerts.</p></li>
<li><p>Over-communication → client dissatisfaction.</p></li>
<li><p>Integration complexity with Databricks, CRM, SMS.</p></li>
<li><p>Staff adoption risk if alerts overwhelm or drafts need heavy editing.</p></li>
<li><p>Compliance gaps if audit trail isn’t watertight.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Estimated Effort</strong></p></td>
<td class="confluenceTd"><p>Effort: ~4–5 sprints (Databricks + Portal + comms + logging)<br />
Cost: $90k–$150k (engineering squad, integrations, delivery infra)<br />
Time: Phased delivery Aug–Oct, go-live 1 Nov 2025</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Proceed to PRD?</strong></p></td>
<td class="confluenceTd"><p>Yes – directly tied to SAH requirements for monthly direct care management activity</p></td>
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

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [{D6A78D15-EAC6-40F8-92BE-BFB32A6732A5}-20250715-080709.png](attachments/492634121/492634132.png) (image/png)  

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
