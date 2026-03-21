<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Consumer Journey](Consumer-Journey_436208084.html)
3.  [LGI - Lead Gen Integrations](LGI---Lead-Gen-Integrations_652673031.html)

</div>

# <span id="title-text"> Trilogy Care Portal : LGI - 1. Idea Brief - Title </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified on Oct 31, 2025

</div>

<div id="main-content" class="wiki-content group">

------------------------------------------------------------------------

### **Idea Brief – LGI (Lead Gen Integrations)**

<div class="table-wrap">

<table class="confluenceTable" data-table-width="760" data-layout="default" data-local-id="662ba47a-6e85-4b21-a43e-f8e8f9c3ac22">
<tbody>
<tr>
<th class="confluenceTh"><p><strong>Section</strong></p></th>
<th class="confluenceTh"><p><strong>Details</strong></p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>Problem Statement (What)</strong></p></td>
<td class="confluenceTd"><p>Trilogy’s lead generation sources are fragmented across multiple systems — marketing forms, ad platforms (Google, Meta), partnership referrals (BED, Coordinated, Priority One), and organic channels (website and client portal). Each operates with its own tracking and storage methods, causing inconsistent attribution data, missed leads, and limited visibility of campaign performance within the Portal.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Possible Solution (How)</strong></p></td>
<td class="confluenceTd"><p>Develop a <strong>unified lead ingestion and attribution framework</strong> within the Portal that captures and standardizes all incoming leads from every pipeline. • Route <strong>marketing-generated leads</strong> (Google, Meta, and form submissions) directly into the Portal, preserving UTM metadata (Source, Medium, Campaign).• Integrate <strong>partnership and referral leads</strong> from BED, Coordinated, and Priority One partners with associated referral IDs and source context.• Capture <strong>organic inbound leads</strong> (website forms, direct client portal entries) as lead objects using the same structure as internally created leads.• Implement a <strong>central attribution layer</strong> so all sources feed into the <strong>Attribution Tab</strong> in the Lead Profile for unified reporting and analytics.• Establish a standardized mapping and data validation model ensuring every generated lead object includes complete, traceable origin data.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Benefits (Why)</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Creates a <strong>single, reliable source of truth</strong> for all inbound leads.• Enables accurate <strong>source-based reporting</strong> for Marketing, Sales, and Partnerships.• Improves <strong>data hygiene and deduplication</strong> by routing all sources through one object model.• Allows <strong>campaign ROI tracking</strong> and optimization using UTM consistency.• Forms the <strong>data backbone for lead scoring, attribution analysis, and automation</strong> across future CRM and marketing workflows.</p></li>
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
<td class="confluenceTd"><p><strong>Dependencies:</strong>• LES must exist to provide the lead schema and data model.• Engineering support required for API ingestion from ad and form platforms.• BED and Coordinated pipelines must expose structured data endpoints for integration.<strong>Assumptions:</strong>• All lead sources have identifiable IDs or tracking parameters (UTM, referral ID, form ID).• Attribution data can be stored and queried consistently across leads.<strong>Risks:</strong>• Misalignment between marketing and engineering on source naming conventions.• Legacy lead pipelines (manual imports) may bypass attribution capture until fully migrated.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Estimated Effort</strong></p></td>
<td class="confluenceTd"><p><strong>Design:</strong> ~0.5 sprint (data model mapping and attribution structure).<strong>Development:</strong> ~1–2 sprints (API routing, validation, ingestion logic).<strong>Testing:</strong> ~0.5 sprint (QA and attribution accuracy).</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Proceed to PRD?</strong></p></td>
<td class="confluenceTd"><p><strong>Yes.</strong> LGI is foundational for ensuring all marketing, partnership, and organic leads are standardized in the Portal and is a critical dependency for accurate analytics and lifecycle tracking.</p></td>
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

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [{D6A78D15-EAC6-40F8-92BE-BFB32A6732A5}-20250715-080709.png](attachments/652673035/652673046.png) (image/png)  

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
