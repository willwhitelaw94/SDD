---
title: "Trilogy Care Portal : SPO - 1. Idea - Brief"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)

</div>

# <span id="title-text"> Trilogy Care Portal : SPO - 1. Idea - Brief </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> Mike Wise</span>, last modified by <span class="editor"> Steven Boge</span> on Sep 23, 2025

</div>

<div id="main-content" class="wiki-content group">

**Owner:**

<div class="table-wrap">

<table class="confluenceTable" data-table-width="902" data-layout="center" data-local-id="710b6545-425d-4269-b59f-372720dd6515">
<tbody>
<tr>
<th class="confluenceTh"><p>Section</p></th>
<th class="confluenceTh"><p>Guidance</p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>Idea</strong></p></td>
<td class="confluenceTd"><p>Deliver an end-to-end <strong>Supplier Onboarding</strong> capability in the Portal to onboard ~15,000 suppliers before the 1 Nov 2025 SAH cutover, replacing fragmented manual processes with a streamlined, data-validated, compliance-ready workflow.</p>
<p>This initiative unifies the <em>Supplier Onboarding</em> and <em>Supplier Data</em> BRP tasks into a <strong>single scalable onboarding ecosystem</strong> that:</p>
<ul>
<li><p>Design and deliver a unified <strong>Supplier Onboarding &amp; Recontracting</strong> capability in the Portal to process:</p>
<ol>
<li><p><strong>New supplier onboarding</strong> (expected volume ~15,000), and</p></li>
<li><p><strong>Mass recontracting of existing suppliers</strong> to SAH-compliant agreements,</p></li>
</ol>
<p>… within the constrained <strong>Sept–Nov 2025</strong> timeframe leading to Support at Home (SAH) go-live.</p>
<p>This initiative consolidates multiple BRP tasks — <em>Supplier Onboarding</em>, <em>Supplier Data</em>, <em>Supplier Recontract</em>, <em>Supplier Recontracting</em> — into a single, scalable platform that supports supplier intake, agreement execution, compliance verification, and data standardisation. It replaces fragmented manual workflows and dispersed systems with an integrated process optimised for high throughput and accuracy.<br />
<br />
<strong>Key Functions</strong></p></li>
</ul>
<h4 id="SPO-1.Idea-Brief-Onboarding(NewSuppliers)"><strong>Onboarding (New Suppliers)</strong></h4>
<ul>
<li><p><strong>Self-registration</strong> via multi-step wizard with:</p>
<ul>
<li><p>ABN lookup and GST validation via ABR API.</p></li>
<li><p>Token-based ownership claim for existing records.</p></li>
<li><p>Save/resume capability for in-progress registrations.</p></li>
</ul></li>
<li><p><strong>Internal creation</strong> from invoice data for unregistered suppliers, initiating onboarding in the background.</p></li>
<li><p><strong>Mandatory data capture</strong> for SAH compliance:</p>
<ul>
<li><p>Legal name (as per ABR)</p></li>
<li><p>ABN and GST status</p></li>
<li><p>Services offered (mapped to SAH service list)</p></li>
<li><p>Pricing for five price types per service, per location.</p></li>
</ul></li>
<li><p><strong>Pricing matrix UI</strong> with multi-rate (weekday/Sat/Sun/public holiday) and multi-location support, plus “apply to all” function.</p></li>
<li><p>Bank details entry and real-time verification via EFTSure/EFT Shore.</p></li>
<li><p>Conditional compliance document requests (organisation vs sole trader, service type).</p></li>
<li><p>Targeted statutory declarations to reduce admin overhead.</p></li>
</ul>
<h4 id="SPO-1.Idea-Brief-Recontracting(ExistingSuppliers)"><strong>Recontracting (Existing Suppliers)</strong></h4>
<ul>
<li><p><strong>Bulk invitations</strong> triggered on 1 Sept 2025 for suppliers to sign new SAH-compliant agreements.</p></li>
<li><p><strong>Conditional pathways</strong>:</p>
<ul>
<li><p><em>No service/pricing change</em> → minimal recontracting steps.</p></li>
<li><p><em>Service/pricing change</em> → partial onboarding to capture new details.</p></li>
</ul></li>
<li><p>Automated compliance refresh (insurance, licences, statutory declarations requested only if expired or missing).</p></li>
<li><p><strong>Agreement version control</strong> — store pre-SAH and SAH agreements for audit and legal reference.</p></li>
<li><p>Automated reminder/escalation workflows for incomplete recontracting.</p></li>
</ul>
<h4 id="SPO-1.Idea-Brief-SharedCapabilities"><strong>Shared Capabilities</strong></h4>
<ul>
<li><p><strong>Supplier Data cleansing</strong> prior to launch to ensure accurate, complete records.</p></li>
<li><p><strong>Risk-based audit prioritisation</strong> replacing SLA-based reviews in Phase 2.</p></li>
<li><p>Interim <strong>Zoho CRM sync</strong> for audit workflows until Portal-native compliance tools are complete.</p></li>
<li><p>Automated triggers for incomplete onboarding/recontracting.</p></li>
<li><p>Document management and retrieval within Portal.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Benefits</strong></p></td>
<td class="confluenceTd"><p><strong>Operational Efficiency</strong></p>
<ul>
<li><p>Parallel onboarding and recontracting in the same platform using shared form logic, validation, and integrations.</p></li>
<li><p>Reduction in manual data entry and follow-ups via inline validation and automation.</p></li>
</ul>
<p><strong>Compliance &amp; Risk Management</strong></p>
<ul>
<li><p>All suppliers verified for SAH pricing, services, and documentation before activation.</p></li>
<li><p>Risk-weighted audit sampling reduces total review effort while maintaining quality assurance.</p></li>
</ul>
<p><strong>Data Quality</strong></p>
<ul>
<li><p>Standardised supplier names, services, pricing, and contact info improves billing, budgeting, reporting, and service matching.</p></li>
<li><p>Elimination of duplicate or incomplete supplier records.</p></li>
</ul>
<p><strong>Supplier &amp; Coordinator Experience</strong></p>
<ul>
<li><p>Reduced friction for suppliers with save/resume, ABN autofill, and bulk pricing tools.</p></li>
<li><p>Coordinators gain instant access to fully verified supplier profiles.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Stakeholders</strong></p></td>
<td class="confluenceTd"><ol>
<li><p><strong>Innovation Lead</strong> – workflow and compliance design.</p></li>
<li><p><strong>Portal QA</strong> – testing and validation of flows.</p></li>
<li><p><strong>Product &amp; Dev Teams</strong> – build, integrations, release management.</p></li>
<li><p><strong>Supplier Management / Compliance</strong> – define agreement terms, audit rules.</p></li>
<li><p><strong>Finance / AP</strong> – bank verification, MYOB integration.</p></li>
<li><p><strong>Suppliers</strong> – complete onboarding/recontracting.</p></li>
<li><p><strong>Coordinators</strong> – use supplier data for operational planning..</p></li>
</ol></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Assumptions, Dependencies &amp; Risks</strong></p></td>
<td class="confluenceTd"><p><strong>Assumptions</strong></p>
<ul>
<li><p>SAH compliance rules and document requirements are finalised by Sept 2025.</p></li>
<li><p>EFTSure/EFT Shore integration available for launch.</p></li>
<li><p>Supplier Data cleansing completed before triggering onboarding/recontracting.</p></li>
</ul>
<p><strong>Dependencies</strong></p>
<ul>
<li><p>Miro Supplier Auth Flow implemented in full (including conditional logic and pricing matrix).</p></li>
<li><p>Multi-rate/multi-location pricing logic operational before launch.</p></li>
<li><p>Accurate supplier contact data for bulk recontracting.</p></li>
</ul>
<p><strong>Risks</strong></p>
<ul>
<li><p>Dual high-volume processes (new + existing suppliers) within 8 weeks.</p></li>
<li><p>Risk of activation delays if compliance documents not updated in time.</p></li>
<li><p>Edge cases (multi-trading names, complex service/location/pricing combos).</p></li>
<li><p>EFT integration delays requiring manual verification fallback.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Estimated Effort, Cost, Time and Benefits</strong></p></td>
<td class="confluenceTd"><p><strong>Effort</strong></p>
<ul>
<li><p>~2 months development + data preparation.</p></li>
</ul>
<p><strong>Cost</strong></p>
<ul>
<li><p><del>2 sprints per dev squad (</del>$60,000), plus operational costs for supplier comms/training.</p></li>
</ul>
<p><strong>Timeframe</strong></p>
<ul>
<li><p>Build complete by <strong>1 Sept 2025</strong> for recontracting start.</p></li>
<li><p>All suppliers onboarded or recontracted by <strong>1 Nov 2025</strong>.</p></li>
</ul>
<p><strong>Projected Benefits</strong></p>
<ul>
<li><p>50% reduction in time to onboard/recontract a supplier.</p></li>
<li><p>95% of suppliers fully compliant before SAH go-live.</p></li>
<li><p>Up to 40% reduction in audit workload.</p></li>
</ul>
<hr />
<h3 id="SPO-1.Idea-Brief-AlignmentwithBRPGoals"><strong>Alignment with BRP Goals</strong></h3>
<ul>
<li><p>Delivers <strong>operational scalability</strong> for supplier management under SAH.</p></li>
<li><p>Strengthens <strong>data integrity</strong> for billing, claims, and reporting.</p></li>
<li><p>Guarantees <strong>compliance readiness</strong> ahead of Nov 1, avoiding service disruption.</p></li>
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

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [{D6A78D15-EAC6-40F8-92BE-BFB32A6732A5}-20250715-080709.png](attachments/436896427/436897221.png) (image/png)  

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
