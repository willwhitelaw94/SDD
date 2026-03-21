<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Clinical and Care Plan](Clinical-and-Care-Plan_436371583.html)
3.  [CCU - Care Circle Uplift](CCU---Care-Circle-Uplift_527138817.html)

</div>

# <span id="title-text"> Trilogy Care Portal : CCU - 1. Idea Brief - Care Circle Uplift </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified by <span class="editor"> Steven Boge</span> on Sep 25, 2025

</div>

<div id="main-content" class="wiki-content group">

# Idea Brief — Contact Module Uplift

<div class="table-wrap">

|  |  |
|----|----|
| Section | Details |
| **Owner** | Product Management – Will (Trilogy Care) |
| **Stakeholders – Primary** | Care Partners, Coordinators |
| **Stakeholders – Other** | Compliance, Internal Ops staff, Recipients, Supporter Representatives, Private Partners (GPs, specialists, pharmacists, optometrists) |

</div>

------------------------------------------------------------------------

<div class="table-wrap">

|  |  |
|----|----|
| Section | Details |
| **Problem Statement** | The current Contacts module only displays ~6 rows at once, relies on free-text role entries, and surfaces only the *primary* Supporter Representative from My Aged Care. This results in missing contacts, inaccurate authority attribution, and downstream risks. Coordinators and Care Partners struggle to find and manage the right stakeholders efficiently. Critical flows like Home Care Agreement sign-off, care communications, and compliance audits depend on accurate contact-role mapping. |
| legal.. | we need to ensure compliance with the updated regulations while safeguarding care recipients' rights, privacy, and access to information |
| legal.. | We need clarity on the responsibilities and limitations of Authorised Representatives and Supporters, particularly where they are **also** a care recipient’s contractor |

</div>

------------------------------------------------------------------------

<div class="table-wrap">

<table class="confluenceTable" data-table-width="874" data-layout="center" data-local-id="b29c700e-d86f-44b2-b1ef-ba254cde0a93">
<tbody>
<tr>
<th class="confluenceTh"><p>Section</p></th>
<th class="confluenceTh"><p>Details</p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>Solution</strong></p></td>
<td class="confluenceTd"><p>Deliver a <strong>Contact Module Uplift</strong> that:</p>
<p>• Expands the contacts grid (≥15 visible rows on desktop; mobile accordion with lazy load).</p>
<p>• Introduces a fixed <strong>role taxonomy</strong> (Supporter Rep, Secondary Supporter, GP, Specialist, Informal Carer, Emergency Contact, Other).</p>
<p>• Maps roles to <strong>authority levels</strong> (Decision-Maker, Advisor, View-Only).</p>
<p>• Enforces exactly one <strong>Primary Decision-Maker</strong> per recipient; editable only by Trilogy internal staff, Care Partners, or existing Primary Decision-Makers.</p>
<p>• Provides add/edit/archive workflows with audit logging.</p>
<p>• Supports <strong>MAC contact import</strong> via monthly + manual refresh, with conflict resolution in a side-by-side modal.</p>
<p>• Enables adding <strong>Private Partners</strong> (e.g., GP, pharmacist) with predefined partner types.</p>
<p>• Hooks into email templates using mailto + TCID tagging.</p>
<p>• Surfaces “Last Login” and “Last Communication” to give visibility into contact activity. • Ensures WCAG 2.1 AA compliance and sub-second performance for lists of up to 100 contacts.</p></td>
</tr>
</tbody>
</table>

</div>

------------------------------------------------------------------------

<div class="table-wrap">

<table class="confluenceTable" data-table-width="760" data-layout="default" data-local-id="f7d3cfd3-c6fd-4ed3-b343-f2a0264b4b3a">
<tbody>
<tr>
<th class="confluenceTh"><p>Section</p></th>
<th class="confluenceTh"><p>Details</p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>Benefits</strong></p></td>
<td class="confluenceTd"><ul>
<li><p><strong>Accuracy &amp; Governance</strong>: Every recipient has one validated Primary Decision-Maker; roles and authority consistent.</p></li>
<li><p>• <strong>Efficiency</strong>: Contact add/classify completed in ≤30 seconds.</p></li>
<li><p>• <strong>Coverage</strong>: 100% of MAC contacts surfaced and reconciled (no manual re-keying).</p></li>
<li><p>• <strong>Readiness</strong>: Enables role-specific comms, HCA sign-off workflows, and care partner communications at scale.</p></li>
<li><p>• <strong>Compliance</strong>: Complete audit of all lifecycle changes; no mis-escalations.</p></li>
<li><p>• <strong>User Satisfaction</strong>: Faster navigation and clearer role visibility address a top pain point raised in product feedback.</p></li>
</ul></td>
</tr>
</tbody>
</table>

</div>

------------------------------------------------------------------------

<div class="table-wrap">

<table class="confluenceTable" data-table-width="760" data-layout="default" data-local-id="f8d6d168-850f-4611-a1eb-ef89232ae1b5">
<tbody>
<tr>
<th class="confluenceTh"><p>Section</p></th>
<th class="confluenceTh"><p>Details</p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>Assumptions &amp; Dependencies</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>MAC integration delivers contact exports but does not push deletes; stale contacts must be flagged manually.</p></li>
<li><p>Monthly sync cadence plus manual refresh is sufficient.</p></li>
<li><p>Multiple roles per contact allowed.</p></li>
<li><p>Audit logging and comms governance align with <strong>Care Management Activities (CMA) PRD</strong>.</p></li>
<li><p>Email MVP is mailto; in-portal sendMail may follow under CMA.</p></li>
</ul></td>
</tr>
</tbody>
</table>

</div>

------------------------------------------------------------------------

<div class="table-wrap">

|  |  |
|----|----|
| Section | Details |
| **Area of Focus** | Consumer Journey, Care Coordination, Compliance, Communication |
| **Urgency** | High — prerequisite for SAH go-live and HCA workflows |
| **Estimated Impact** | High — affects all recipients, Care Partners, Coordinators, and downstream processes. |
| **Resource Requirement** | Multi-squad effort: Product, Design, Engineering, Data Integration, Compliance |

</div>

------------------------------------------------------------------------

<div class="table-wrap">

<table class="confluenceTable" data-table-width="760" data-layout="default" data-local-id="32cce18b-8d8c-4cd4-a396-b7f84a0ce64f">
<tbody>
<tr>
<th class="confluenceTh"><p>Section</p></th>
<th class="confluenceTh"><p>Details</p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>Risks</strong></p></td>
<td class="confluenceTd"><ul>
<li><p><strong>Authority mis-mapping</strong>: risk of wrong person signing HCA → mitigated via role-to-authority locks and audit confirmation.</p></li>
<li><p><strong>MAC schema changes</strong>: import failures → mitigated by contract tests and schema versioning.</p></li>
<li><p><strong>Mobile UX degradation</strong>: large lists harder on small screens → mitigated by accordion and virtual scroll.</p></li>
<li><p><strong>Mailto limitations</strong>: lack of telemetry → intent logged; richer send handled by CMA.</p></li>
</ul></td>
</tr>
</tbody>
</table>

</div>

------------------------------------------------------------------------

<div class="table-wrap">

<table class="confluenceTable" data-table-width="760" data-layout="default" data-local-id="9a74cb40-a9ba-4c06-8cfc-e06457c736cc">
<tbody>
<tr>
<th class="confluenceTh"><p>Section</p></th>
<th class="confluenceTh"><p>Details</p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>Compliance</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Enforces SAH requirements for valid decision-maker attribution. • Ensures communications, agreements, and role changes are auditable.</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Estimated Effort / Cost / Time</strong></p></td>
<td class="confluenceTd"><p>~2–3 sprints (multi-squad; grid uplift, MAC import, role schema, email hooks, audit logging).</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Estimated Benefits</strong></p></td>
<td class="confluenceTd"><ul>
<li><p>Elimination of manual re-key events. • Compliance protection (avoid penalties from misattributed HCAs). • Faster workflows (≤30s add/classify). • Higher Care Partner &amp; Coordinator satisfaction.</p></li>
</ul></td>
</tr>
</tbody>
</table>

</div>

------------------------------------------------------------------------

<div class="table-wrap">

|  |  |
|----|----|
| Section | Details |
| **Next Steps** | Proceed to full PRD (this document has already been drafted). Confirm scope of role taxonomy, import conflict handling, and mobile parity. |

</div>

</div>

<div class="pageSection group">

<div class="pageSectionHeader">

## Attachments:

</div>

<div class="greybox" align="left">

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [{D6A78D15-EAC6-40F8-92BE-BFB32A6732A5}-20250715-080709.png](attachments/527138821/527138832.png) (image/png)  

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
