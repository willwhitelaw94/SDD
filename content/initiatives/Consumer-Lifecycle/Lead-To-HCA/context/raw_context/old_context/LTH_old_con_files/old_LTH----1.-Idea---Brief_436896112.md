---
title: "Trilogy Care Portal : LTH - 1. Idea - Brief"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Consumer Journey](Consumer-Journey_436208084.html)
3.  [LTH - Lead to HCA](LTH----Lead-to-HCA_436896288.html)

</div>

# <span id="title-text"> Trilogy Care Portal : LTH - 1. Idea - Brief </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> Mike Wise</span>, last modified by <span class="editor"> David Henry</span> on Oct 31, 2025

</div>

<div id="main-content" class="wiki-content group">

------------------------------------------------------------------------

### **Idea Brief – LTH (Lead to HCA)**

<div class="table-wrap">

<table class="confluenceTable" data-table-width="760" data-layout="default" data-local-id="d2a82ed9-fc8e-47b9-a652-ea3caa102766">
<tbody>
<tr>
<th class="confluenceTh"><p><strong>Section</strong></p></th>
<th class="confluenceTh"><p><strong>Details</strong></p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>Problem Statement (What)</strong></p></td>
<td class="confluenceTd"><p>Once a lead is qualified and ready to convert, sales staff must currently manage onboarding, assessments, and agreements across disconnected tools — spreadsheets, Zoho, DocuSign, and manual follow-ups. This fragmented process leads to data duplication, compliance risks, and delayed activations. A unified conversion workflow is needed to move a verified lead into an active Home Care Package efficiently and with full regulatory traceability.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Possible Solution (How)</strong></p></td>
<td class="confluenceTd"><p>Introduce a <strong>Conversion Wizard</strong> within the Portal that transforms a qualified lead into a client through a single guided flow. The wizard integrates: • <strong>Prerequisite validation</strong> — ensures all mandatory Lead data (Made Contact, onboarding, compliance) is complete. • <strong>Stepper navigation</strong> — sequential steps for Package Details, Dates, Recipients, ACAT/IAT extraction, and Agreement setup. • <strong>Data automation</strong> — prefills known information and enforces chronological and completeness checks. • <strong>ACAT/IAT integration</strong> — automatically retrieves or allows upload of assessment data via API. • <strong>Digital Home Care Agreement</strong> — generates, sends, and tracks agreement status through integrated e-signature and logs all actions to the Lead Timeline.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Benefits (Why)</strong></p></td>
<td class="confluenceTd"><ul>
<li><p><strong>Streamlines conversion</strong> — cuts activation time by guiding staff through every required step in one flow.• <strong>Ensures compliance</strong> — validation prevents incomplete or out-of-sequence conversions.• <strong>Improves accuracy</strong> — prefilling data from LES eliminates re-entry and mismatched details.• <strong>Enables automation</strong> — provides a consistent structure for future auto-onboarding and direct API submissions.• <strong>Enhances visibility</strong> — all agreement, assessment, and activation actions are logged in the lead record for audit and reporting.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Owner (Who)</strong></p></td>
<td class="confluenceTd"><p><em>(blank)</em></p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Other Stakeholders</strong></p></td>
<td class="confluenceTd"><p><em>(blank – Accountable / Consulted / Informed to be assigned)</em></p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Assumptions, Dependencies, Risks</strong></p></td>
<td class="confluenceTd"><p><strong>Dependencies:</strong>• Relies on <strong>LES (Lead Essential)</strong> for data model, onboarding fields, and lead lifecycle management.• Requires integration readiness for ACAT/IAT APIs and e-signature service.<strong>Assumptions:</strong>• All sales leads have been captured and validated through the LES framework.• Agreement templates and compliance texts are finalized prior to go-live.<strong>Risks:</strong>• API unavailability may delay ACAT/IAT automation (manual upload fallback).• E-signature or compliance misconfiguration could delay onboarding.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Estimated Effort</strong></p></td>
<td class="confluenceTd"><p><strong>Design:</strong> ~1 sprint (wizard flow, stepper UX, validation UI).<strong>Development:</strong> ~2–3 sprints (wizard logic, data sync, API integration).<strong>Testing &amp; QA:</strong> ~1 sprint (validation, signature, data mapping).</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Proceed to PRD?</strong></p></td>
<td class="confluenceTd"><p><strong>Yes.</strong> LTH is the natural successor to LES and operationalizes the lead conversion lifecycle — a prerequisite for downstream Billing, Client Portal, and Agreement management modules.</p></td>
</tr>
</tbody>
</table>

</div>

------------------------------------------------------------------------

</div>

<div class="pageSection group">

<div class="pageSectionHeader">

## Attachments:

</div>

<div class="greybox" align="left">

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [{D6A78D15-EAC6-40F8-92BE-BFB32A6732A5}-20250715-080709.png](attachments/436896112/436897528.png) (image/png)  
<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [image-20251008-071633.png](attachments/436896112/581926993.png) (image/png)  
<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [image-20251008-071711.png](attachments/436896112/582418507.png) (image/png)  
<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [image-20251008-071814.png](attachments/436896112/581763128.png) (image/png)  

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
