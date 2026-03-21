---
title: "Trilogy Care Portal : RNC - 1. Idea Brief: Risk, Needs, Care Plan"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Clinical and Care Plan](Clinical-and-Care-Plan_436371583.html)
3.  [RNC - Risks, Needs, Care Plan](RNC---Risks%2C-Needs%2C-Care-Plan_436896235.html)

</div>

# <span id="title-text"> Trilogy Care Portal : RNC - 1. Idea Brief: Risk, Needs, Care Plan </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> Mike Wise</span>, last modified by <span class="editor"> Steven Boge</span> on Oct 21, 2025

</div>

<div id="main-content" class="wiki-content group">

**Owner:**

<div class="table-wrap">

<table class="confluenceTable" data-table-width="918" data-layout="center" data-local-id="710b6545-425d-4269-b59f-372720dd6515">
<tbody>
<tr>
<th class="confluenceTh"><p><strong>Section</strong></p></th>
<th class="confluenceTh"><p><strong>Guidance</strong></p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>Jira Ticket</strong></p></td>
<td class="confluenceTd"><p><span class="confluence-jim-macro jira-issue resolved" data-jira-key="TP-1905"> <a href="https://trilogycare.atlassian.net/browse/TP-1905" class="jira-issue-key"><img src="https://trilogycare.atlassian.net/images/icons/issuetypes/epic.svg" class="icon" />TP-1905</a> - <span class="summary">[RNC] Risks, Needs, Care Plan [TP-1905]</span> <span class="aui-lozenge aui-lozenge-subtle aui-lozenge-success jira-macro-single-issue-export-pdf">Done</span> </span></p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Problem Statement</strong></p></td>
<td class="confluenceTd"><p>Care partners and clinical teams at Trilogy Care face challenges in efficiently creating, updating, and managing client care plans. Current processes require significant manual effort to draft care plans (eg copying and pasting from word documents), assess client risks and needs, and ensure compliance with regulatory standards. This leads to inconsistencies, increased risk of errors or omissions, and time spent on administrative tasks rather than direct client engagement.</p>
<p>There is also a lack of standardisation in how risks, needs, and goals are documented and linked to care plans, making it difficult to monitor progress and ensure high-risk issues are addressed promptly. As a result, staff experience frustration, compliance teams face audit risks, and clients may not receive timely, personalised care.</p>
<ul>
<li><p>Also need to assure this is auditable.</p></li>
<li><p>And want a PDF version</p></li>
<li><p>In portal, not CRM</p></li>
</ul>
<p>Questionaire (zoho form) takes 20 minutes + the Comprehensive aged care assessment is asked several times.</p>
<p>we want to collect and collate all data, but do not need to have all data veiwable by all carers (eg cleaners can't see medication)</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Idea</strong></p></td>
<td class="confluenceTd"><p>Enhance the care planning, needs assessment, and risk management capabilities in the Trilogy Care portal by introducing an integrated workflow that:</p>
<ul>
<li><p>Automates the drafting of client care plans based on assessment data, medical summaries, and historical case notes.</p></li>
<li><p>Standardises the capture and tagging of client risks, needs, and goals, ensuring these are measurable, compliant, and consistently formatted.</p></li>
<li><p>Links risk and needs assessments directly to the care plan for ongoing monitoring and review.</p></li>
<li><p>Improves note-taking capabilities for care partners through templates, autosave, and structured note types to reduce errors and omissions.</p></li>
<li><p>Supports both automated recommendations (via AI) and human-in-the-loop review to ensure accuracy, compliance, and personalised care delivery.<br />
</p></li>
<li><p>Ingest IAT / ACAT information to decrease the reliance in a long questionnaire</p></li>
<li><p>once in portal, needs and risks will be on the Portal and a client facing care plan</p></li>
<li><p>ideally - add a need, select specific services, which would pre-populate the service plan</p></li>
<li><p>want needs and risks on the one page</p></li>
<li><p>V1 - what Elton’s built</p></li>
<li><p>Golden state - risks and goals identify needs → therefore care → add to service plan → PDF SP → budget →</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Key Functions</strong></p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Benefits</strong></p></td>
<td class="confluenceTd"><ul>
<li><p><strong>Operational efficiency</strong> – Less manual drafting of care plans, freeing care partners to focus on client engagement.</p></li>
<li><p><strong>Consistency &amp; compliance</strong> – Standardised formats and automated validation reduce regulatory breaches and incomplete records.</p></li>
<li><p><strong>Better decision-making</strong> – Automatic tagging and prioritisation of risks and needs ensures high-risk issues are escalated quickly.</p></li>
<li><p><strong>Improved staff experience</strong> – Structured note templates and autosave features cut down on rework and lost data.</p></li>
<li><p><strong>Enhanced client outcomes</strong> – More accurate, timely care plans informed by both data and human expertise.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Stakeholders</strong></p></td>
<td class="confluenceTd"><ul>
<li><p><strong>Care Partners / Coordinators</strong> – Create and maintain care plans, document risks, needs, and goals.</p></li>
<li><p><strong>Clinical Team / Allied Health Professionals</strong> – Provide assessments and prescriptions to be incorporated into the care plan.</p></li>
<li><p><strong>Compliance &amp; Quality Assurance Teams</strong> – Ensure plans meet regulatory standards and audit requirements.</p></li>
<li><p><strong>Clients &amp; Representatives</strong> – Beneficiaries of improved care planning, with clearer goals and risk management strategies.</p></li>
<li><p><strong>Product, Data &amp; Engineering Teams</strong> – Build and integrate AI-assisted workflows, data capture, and reporting.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Assumptions, Dependencies &amp; Risks</strong></p></td>
<td class="confluenceTd"><p><strong>Assumptions</strong></p>
<ul>
<li><p>AI models can be trained or configured to produce compliant draft care plans from existing client data.</p></li>
<li><p>The government will provide clear guidelines on required assessment types and prescription authority lists.</p></li>
</ul>
<p><strong>Dependencies</strong></p>
<ul>
<li><p>Access to structured assessment data and historical case notes in the portal.</p></li>
<li><p>Development of note-taking enhancements and new “note type” classifications.</p></li>
<li><p>Clinical assessment and prescription workflows (for equipment/services requiring professional authorisation).</p></li>
<li><p>Integration with risk and needs tagging automation.</p></li>
</ul>
<p><strong>Risks</strong></p>
<ul>
<li><p>AI-generated outputs may require significant human editing if data quality is poor.</p></li>
<li><p>Regulatory changes could alter required assessment and care plan formats after launch.</p></li>
<li><p>Staff adoption may be slow if workflows are too rigid or perceived as replacing professional judgement.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Estimated Effort, Cost, Time and Benefits</strong></p></td>
<td class="confluenceTd"><ol>
<li><p><strong>Effort:</strong> Medium–High (multi-squad build: AI integration, UI/UX, data tagging, compliance validation).</p></li>
<li><p><strong>Timeframe:</strong> Discovery and design within 1–2 sprints; phased build over 2–3 additional sprints.</p></li>
<li><p><strong>Cost:</strong> Significant due to AI integration, training data preparation, and compliance consultation.</p></li>
<li><p><strong>Benefits Realisation:</strong> Immediate operational efficiency gains post-launch; medium-term uplift in compliance scores and client satisfaction.</p></li>
</ol></td>
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

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [{D6A78D15-EAC6-40F8-92BE-BFB32A6732A5}-20250715-080709.png](attachments/436895866/436897381.png) (image/png)  

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
