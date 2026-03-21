---
title: "Trilogy Care Portal : DOC - 1. Idea - Brief"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Clinical and Care Plan](Clinical-and-Care-Plan_436371583.html)
3.  [DOC - Documents](DOC---Documents_436896968.html)

</div>

# <span id="title-text"> Trilogy Care Portal : DOC - 1. Idea - Brief </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> Mike Wise</span> on Aug 12, 2025

</div>

<div id="main-content" class="wiki-content group">

**Owner:**

<div class="table-wrap">

<table class="confluenceTable" data-table-width="760" data-layout="default" data-local-id="710b6545-425d-4269-b59f-372720dd6515">
<tbody>
<tr>
<th class="confluenceTh"><p>Section</p></th>
<th class="confluenceTh"><p>Guidance</p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>Idea</strong></p></td>
<td class="confluenceTd"><p>Create a <strong>centralised client document repository</strong> in the Trilogy Care portal, focused on the types of documents received and worked with in the ordinary course of aged care service delivery. The feature will allow authorised staff to upload, store, and securely link documents to client records, and will enable <strong>retrieval-augmented generation (RAG)</strong> search so information can be surfaced directly in workflows.</p>
<p>The system will support structured search (“filter by document type, date, or client”) and AI-assisted natural language queries (“show me the latest OT report for John Smith” / “what coordination fee was in Mary Jones’ last statement?”). This ensures faster decision-making, better compliance checks, and improved service responsiveness.</p>
<h3 id="DOC-1.Idea-Brief-DocumentTypesinScope"><strong>Document Types in Scope</strong></h3>
<ul>
<li><p><strong>OT / Clinical Assessment Reports</strong> – including prescriptions for assistive technology and home modifications</p></li>
<li><p><strong>Medical Health Summaries</strong> – GP and specialist letters, hospital discharge summaries</p></li>
<li><p><strong>Budgets</strong> – Budget V1/V2, previews, historic versions</p></li>
<li><p><strong>Statements</strong> – multi-page client statements showing funding streams, bookings, co-payments, and fees</p></li>
<li><p><strong>Service Confirmations &amp; Invoices</strong> – relevant to client care history or billing disputes</p></li>
<li><p><strong>Home Care Agreements &amp; Amendments</strong> – signed copies and addendums</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Key Functions</strong></p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Benefits</strong></p></td>
<td class="confluenceTd"><ol>
<li><p><strong>Rapid Retrieval:</strong> Eliminate delays in finding key documents during care planning, audits, or client inquiries.</p></li>
<li><p><strong>AI-Enhanced Search:</strong> Leverage RAG to pull relevant excerpts or data points without manual file review.</p></li>
<li><p><strong>Regulatory Compliance:</strong> Maintain auditable records with correct retention and metadata tagging.</p></li>
<li><p><strong>Improved Client Experience:</strong> Faster, more accurate responses to questions about budgets, statements, or care plans.</p></li>
<li><p><strong>Cross-Functional Access:</strong> Coordinators, finance, clinical staff, and compliance officers can work from the same set of documents.</p></li>
</ol></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Stakeholders</strong></p></td>
<td class="confluenceTd"><ol>
<li><p><strong>Primary Users:</strong> Care coordinators, finance staff, compliance officers, onboarding staff, clinical assessors.</p></li>
<li><p><strong>Technical:</strong> Portal engineering team, integrations team (API, AI search), data security &amp; infrastructure.</p></li>
<li><p><strong>External:</strong> Services Australia (assessment/claims documents), My Aged Care (assessment &amp; contact data)</p></li>
</ol></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Assumptions, Dependencies &amp; Risks</strong></p></td>
<td class="confluenceTd"><p><strong>Assumptions:</strong></p>
<ul>
<li><p>RAG pipeline and AI search capabilities are available or will be provisioned.</p></li>
<li><p>Portal storage can handle large volumes of PDF/Word/scan formats securely.</p></li>
<li><p>All client-related documents will be consistently linked to a client record in the portal.</p></li>
</ul>
<p><strong>Dependencies:</strong></p>
<ul>
<li><p><strong>Budget V2</strong> – for budget PDFs and previews</p></li>
<li><p><strong>Digital Statement</strong> – for statement generation and linking</p></li>
<li><p><strong>Service Confirmation</strong> – for matching care events with documents</p></li>
<li><p><strong>Client HCA &amp; Amendments</strong> – for agreement documents</p></li>
<li><p><strong>Clinical Assessment (Prescriptions)</strong> – for OT/medical reports integration</p></li>
</ul>
<p><strong>Risks:</strong></p>
<ul>
<li><p>Data security and privacy risks if access controls are not properly implemented.</p></li>
<li><p>Potential complexity in migrating existing documents from shared drives or email.</p></li>
<li><p>AI retrieval accuracy depends on document quality and metadata consistency.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Estimated Effort, Cost, Time and Benefits</strong></p></td>
<td class="confluenceTd"><p><strong>Effort:</strong> Medium to High – backend document storage, RAG pipeline setup, UI/UX for search and linking, security implementation.<br />
<strong>Timeframe:</strong> MVP in 2–3 sprints (core upload/storage/search), additional 1–2 sprints for RAG tuning and full integration with related modules.<br />
<strong>Cost:</strong> Primarily internal development; potential licensing for AI retrieval/search tools and secure storage services.<br />
<strong>Benefits:</strong> Reduced search/retrieval time from minutes to seconds; improved accuracy in care planning and compliance checks; measurable reduction in duplicated requests for documents between teams.</p></td>
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

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [{D6A78D15-EAC6-40F8-92BE-BFB32A6732A5}-20250715-080709.png](attachments/436896724/436897447.png) (image/png)  

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
