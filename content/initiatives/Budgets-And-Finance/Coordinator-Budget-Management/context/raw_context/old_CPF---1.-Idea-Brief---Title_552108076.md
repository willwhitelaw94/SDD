<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)

</div>

# <span id="title-text"> Trilogy Care Portal : CPF - 1. Idea Brief - Title </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified on Sep 26, 2025

</div>

<div id="main-content" class="wiki-content group">

# Idea Brief – Coordinator Budget Management & State Workflow

<div class="table-wrap">

<table class="confluenceTable" data-table-width="760" data-layout="default" data-local-id="272da584-c4cc-4e05-9aa4-f274aa1c5a1b">
<tbody>
<tr>
<th class="confluenceTh"><p>Section</p></th>
<th class="confluenceTh"><p>Details</p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>Owner</strong></p></td>
<td class="confluenceTd"><p>[To be assigned – e.g., Product Owner / BA]</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Stakeholders – Primary</strong></p></td>
<td class="confluenceTd"><p>Coordinators (users within Coordinator Organisations)</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Stakeholders – Other</strong></p></td>
<td class="confluenceTd"><p>Care Partners, Clients/Recipients, Internal Operations, Finance/Claims Teams</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Problem Statement</strong></p></td>
<td class="confluenceTd"><p>Coordinators currently lack a streamlined way to manage client budgets. The existing system does not allow easy duplication, editing, and resubmission of budgets, nor does it provide clear state management for budget approvals. Coordinators also need visibility of their own client portfolios and utilization rates, while care partners need structured workflows to approve or reject coordinator-submitted budgets.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Solution</strong></p></td>
<td class="confluenceTd"><p>Build a coordinator-facing budget management module within the Portal. Features:</p>
<p>• Coordinators can view all clients in their organisation, segmented by <em>new, active, archived</em>.</p>
<p>• For each client, show the <em>current active</em> or <em>draft budget</em>.</p>
<p>• Allow creation of a new draft budget based on a duplicate of the current one (edit/update instead of building from scratch).</p>
<p>• Display contract prices and utilization rates per client and per service.</p>
<p>• Enable coordinators to submit drafts to care partners for approval with <strong>state management</strong> (submitted, approved, rejected).</p>
<p>• Care partners can see coordinator submissions and approve/reject them, with status updates flowing back to the coordinator.</p>
<p>• Coordinator organisations can have multiple users; each coordinator user should see <em>their own portfolio of clients</em>.</p>
<p>• Coordinator rates should be automatically applied to their clients.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Benefits</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Streamlines budget management, reducing coordinator effort/time.</p></li>
<li><p>Introduces proper approval workflow, ensuring accountability and clarity.</p></li>
<li><p>Enhances visibility of utilization rates, supporting financial control.</p></li>
<li><p>Strengthens role-based segmentation (org vs user level).</p></li>
<li><p>Improves collaboration and communication between coordinators and care partners.</p></li>
<li><p>Supports compliance with Support at Home budget rules.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Assumptions &amp; Dependencies</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Budget V2 must be live and stable before this workflow.<br />
• Coordinator organisation and user hierarchy already exist in Portal.<br />
• Utilisation rate calculations depend on accurate billing and claims data.<br />
• Requires integration with Care Partner approval workflows.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Area of Focus</strong></p></td>
<td class="confluenceTd"><p>Budgets and Services; Consumer Journey; Finance Initiatives</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Urgency</strong></p></td>
<td class="confluenceTd"><p>High – needed for Support at Home readiness and operational efficiency.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Estimated Impact</strong></p></td>
<td class="confluenceTd"><p>High – affects all coordinators and care partners; improves operational efficiency and client satisfaction.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Resource Requirement</strong></p></td>
<td class="confluenceTd"><p>Development squad (est. 1–2 sprints), Design resource for coordinator workflows, QA for state management logic.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Risks</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Managing multi-user coordinator organizations is complex.</p></li>
<li><p>Disputes may arise if coordinator and care partner budgets diverge.</p></li>
<li><p>Incorrect state handling can cause client confusion or billing errors.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Compliance</strong></p></td>
<td class="confluenceTd"><p>Yes – budgets must align with Support at Home funding rules, Service Australia claims, and contract governance.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Estimated Effort, Cost, Time</strong></p></td>
<td class="confluenceTd"><p>2–3 sprints (~$60,000–$90,000) for MVP.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Estimated Benefits</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Reduced coordinator workload (time savings ~30%). • Improved accuracy and timeliness of budget approvals. • Higher client satisfaction and better utilization of funds (commercial upside).</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Report / Research / Source</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Support at Home budget workflows • Coordinator fee models and invoices</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Next Steps</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Proceed to PRD. • Validate scope with coordinators and care partners. • Align with Budget V2 rollout timeline.</p></li>
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

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [{D6A78D15-EAC6-40F8-92BE-BFB32A6732A5}-20250715-080709.png](attachments/552108076/552108087.png) (image/png)  

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
