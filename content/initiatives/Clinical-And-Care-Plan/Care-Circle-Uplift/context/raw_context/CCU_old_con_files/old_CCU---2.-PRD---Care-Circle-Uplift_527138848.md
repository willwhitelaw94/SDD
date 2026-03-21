---
title: "Trilogy Care Portal : CCU - 2. PRD - Care Circle Uplift"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Clinical and Care Plan](Clinical-and-Care-Plan_436371583.html)
3.  [CCU - Care Circle Uplift](CCU---Care-Circle-Uplift_527138817.html)

</div>

# <span id="title-text"> Trilogy Care Portal : CCU - 2. PRD - Care Circle Uplift </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified by <span class="editor"> Beth Poultney</span> on Nov 04, 2025

</div>

<div id="main-content" class="wiki-content group">

## 1. Executive Summary

The **Contact Module Uplift** (also referred to as *Care Circle Uplift*) ensures that **Care Partners, Coordinators, and Recipients** can comprehensively manage and view a recipient’s care circle in the Trilogy Care Portal.

**PROBLEM STATEMENT:**  
Today, the system caps visible contacts, relies on free-text roles, and fails to surface the full set of contacts from **My Aged Care (MAC)**. This leads to missing or inaccurate authority records, misdirected agreements, and compliance risks.

  
**THE IDEA:**  
The uplift will deliver:

- A scalable, accessible contacts grid.

- A fixed **role/authority model**.

- Systematic import & reconciliation from MAC.

- Governance of **Primary Decision-Maker** assignment.

- Support for both **main contacts** and **private partners** (e.g., GP, pharmacist, optometrist).

- Role-aware communications (email templates with TCID tagging).

- Auditability across all lifecycle changes.

It underpins critical downstream flows: **Home Care Agreements, direct care activities, communications, and compliance reporting**.

------------------------------------------------------------------------

## 2. Admin & Links

<div class="table-wrap">

|  |  |
|----|----|
| Field | Entry |
| Status | Draft |
| Jira ID | <span class="confluence-jim-macro jira-issue" jira-key="TP-1908"> <a href="https://trilogycare.atlassian.net/browse/TP-1908" class="jira-issue-key"><img src="https://trilogycare.atlassian.net/images/icons/issuetypes/epic.svg" class="icon" />TP-1908</a> - <span class="summary">\[CCU\] Care Circle Uplift \[TP-1908\]</span> <span class="aui-lozenge aui-lozenge-subtle aui-lozenge-success jira-macro-single-issue-export-pdf">Ready for QA</span> </span> |
| Initiative | SAH Readiness — Contact Module Uplift |
| Owner | Product Management – Will (Trilogy Care) |
| Designer | Beth (Design Lead) |
| Tech Lead | TBC |
| QA | TBC |
| Target Release | November 2025 (aligned with SAH reforms) |

</div>

------------------------------------------------------------------------

## 3. Problem (Why Now)

- **Low visibility**: current UI shows ~6 rows, forcing scrolling and clicks.

- **Unreliable role capture**: free-text roles → no authority consistency.

- **Partial imports**: only the *primary* Supporter Representative from MAC is surfaced; others are dropped.

- **Downstream blockages**: HCA routing, role-aware email templates, and compliance audits depend on accurate contacts.

- **User demand**: Big Room Planning feedback flagged *contact accuracy* as a top pain point for portal users.

------------------------------------------------------------------------

## 4. Audience

- **Care Partners** – manage recipient care and need accurate, role-based contacts.

- **Coordinators** – day-to-day management of recipient cases; require fast contact access.

- **Recipients** – must be able to view their care circle, see who their Primary Decision-Maker is, and confirm who is involved in their care.

- **Compliance team** – rely on accurate role/authority mapping for agreements and audits.

- **Internal staff** – support onboarding, governance, and back-office operations.

- **External stakeholders** – Supporter Representatives, Secondary Supporters, Private Partners (GPs, specialists, pharmacists, optometrists).

------------------------------------------------------------------------

## 5. Desired Outcomes

1.  All recipient stakeholders surfaced in one view.

2.  Roles consistently mapped to authority levels.

3.  **Exactly one Primary Contact (Decision-Maker)** per recipient at all times.

4.  Seamless import and reconciliation from MAC.

5.  Role-driven email template triggers (mailto with TCID).

6.  Full auditability of contact history.

7.  **Recipients can clearly see their care circle** and know who their Primary Decision-Maker is.

------------------------------------------------------------------------

## 6. Goals & Success Metrics

<div class="table-wrap">

|  |  |  |
|----|----|----|
| Goal | Metric | Target |
| Increase visibility | Contacts visible without scroll (desktop) | ≥15 rows |
| Reduce add/classify time | Time to add + role select | ≤30s |
| Accuracy of imports | MAC contacts reconciled | 100% (no re-keying for 30 days) |
| Authority fidelity | Incorrect authority escalations | 0 in month 1 |
| Governance | Primary decision-maker enforced | 100% of recipients |
| Audit | Lifecycle + comms logged | 100% |
| Recipient clarity | Recipients can see their Primary and grouped contacts | 100% |

</div>

------------------------------------------------------------------------

## 7. Assumptions

- **MAC** provides a contacts export for scheduled imports (monthly + manual refresh). No deletes propagate. Stale records flagged for review.

- **Multiple roles per contact** allowed.

- **Primary stakeholder** flag editable only by internal staff, Care Partners, or Primary Decision-Makers.

- **Email flows**: initial MVP is mailto with TCID tagging; future integration (Graph sendMail) may come later.

- Calls/emails may be linked to contacts later (last login / last communication surfaced).

------------------------------------------------------------------------

## 8. Background / Context

The broader **Care Management Activities (CMA)** PRD sets audit/comms standards: no AI-generated content, deterministic triggers, template governance, evidence completeness.

Contact Module Uplift provides the **role and authority substrate** that CMA depends on for compliant communications.

------------------------------------------------------------------------

## 9. Definitions

Refer to: <a href="https://trilogycare.atlassian.net/wiki/spaces/TC/pages/439222279/Definitions+and+personas" data-linked-resource-id="439222279" data-linked-resource-version="32" data-linked-resource-type="page">Definitions and personas</a>

<div class="table-wrap">

|  |  |
|----|----|
| Term | Definition |
| **My Aged Care (MAC)** | Government system exposing recipient supporters and representatives. |
| **Supporter Representative (<span class="inline-comment-marker" ref="4fb45ab1-df53-4806-85a0-3460350bf99e">SR</span>)** | Official decision-making contact from MAC. Maps to **Decision-Maker** authority. |
| **Authority Levels** | Enum: Decision-Maker, Advisor, View-Only. |
| **Primary Stakeholder** | Exactly one Primary Decision-Maker flagged per recipient; enforced by rule. |
| **Private Partner** | External professionals linked to care (GP, geriatrician, specialist, pharmacist, optometrist). |
| **Tags** | Role indicators (e.g., Registered Supporter, PoA, Guardian, Emergency, Lives Close By). |
| **TCID** | Trilogy Care identifier used in comms for audit and traceability. |

</div>

------------------------------------------------------------------------

## 10. Scope Requirements

### User Stories & Acceptance Criteria

<div class="table-wrap">

<table class="confluenceTable" data-table-width="1074" data-layout="center" data-local-id="398aa0e9-9450-4d42-9d00-1e707506d629">
<tbody>
<tr>
<th class="confluenceTh"><p>Epic</p></th>
<th class="confluenceTh"><p>User Story</p></th>
<th class="confluenceTh"><p>Acceptance Criteria</p></th>
<th class="confluenceTh"><p>MoSCoW</p></th>
<th class="confluenceTh"><p><strong>Des</strong></p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><p><strong>E1: Scalable Grid</strong></p></td>
<td class="confluenceTd"><p>As a Care Partner/Coordinator, I see ≥15 contacts at once.</p></td>
<td class="confluenceTd"><p>Grid shows ≥15 rows desktop; sticky header + pager.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd" data-highlight-colour="#fffae6"><p>Depends on screen size</p></td>
</tr>
<tr>
<td class="confluenceTd"></td>
<td class="confluenceTd"><p>As a <strong>Recipient</strong>, I can view all of my contacts grouped by role.</p></td>
<td class="confluenceTd"><p>When I log into the Portal, I see my Main Contacts and Private Partners clearly grouped.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd" data-highlight-colour="#e3fcef"></td>
</tr>
<tr>
<td class="confluenceTd"></td>
<td class="confluenceTd"><p>As a <strong>Care Partner / Recipient</strong>, I can see relationship roles and responsibilities of a contact</p></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
<td class="confluenceTd" data-highlight-colour="#e3fcef"></td>
</tr>
<tr>
<td class="confluenceTd"></td>
<td class="confluenceTd"><p>As a <strong>Care Partner / Recipient</strong>, I can view/edit client contact details as well as Main and Private Partner contacts</p></td>
<td class="confluenceTd"><ul>
<li><p><strong><span style="background-color: rgb(253,208,236);">Sept 24th meeting</span></strong></p></li>
</ul></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd" data-highlight-colour="#e3fcef"></td>
</tr>
<tr>
<td class="confluenceTd"></td>
<td class="confluenceTd"><p>As a <strong>Care Partne</strong>r I can see a contact’s (with granted access to portal) last activity in portal, and date added</p></td>
<td class="confluenceTd"><ul>
<li><p><strong><span style="background-color: rgb(253,208,236);">Sept 24th meeting</span></strong></p></li>
</ul></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd" data-highlight-colour="#e3fcef"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>E2: Add/Edit/Archive</strong></p></td>
<td class="confluenceTd"><p>As a Care Partner/Coordinator, I can add/edit/archive contacts with roles[].</p></td>
<td class="confluenceTd"><p>Role required; authority auto-sets; soft delete keeps history.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd" data-highlight-colour="#e3fcef"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>E3: Primary Governance</strong></p></td>
<td class="confluenceTd"><p>As a Care Partner/Coordinator, I can enforce exactly <strong>one Primary</strong> per recipient.</p></td>
<td class="confluenceTd"><p>Validation blocks multiple primaries; only authorized users may edit.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd" data-highlight-colour="#e3fcef"></td>
</tr>
<tr>
<td class="confluenceTd"></td>
<td class="confluenceTd"><p>As a <strong>Recipient</strong>, I can see who is set as my Primary Decision-Maker.</p></td>
<td class="confluenceTd"><p>Primary is clearly flagged in the contact list.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd" data-highlight-colour="#e3fcef"></td>
</tr>
<tr>
<td class="confluenceTd"></td>
<td class="confluenceTd"><p>As a <strong>Care Partner</strong>, my package context menu will display the client and/or their Primary contact</p></td>
<td class="confluenceTd"><ul>
<li><p><strong><span style="background-color: rgb(253,208,236);">Sept 24th meeting</span></strong></p></li>
</ul></td>
<td class="confluenceTd"></td>
<td class="confluenceTd" data-highlight-colour="#ffffff"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>E4: MAC Import</strong></p></td>
<td class="confluenceTd"><p>As a user, I can import new MAC contacts.</p></td>
<td class="confluenceTd"><p>Monthly + manual refresh; conflicts shown in diff modal; accept/skip/map.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd" data-highlight-colour="#f4f5f7"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>E5: Role/Authority Mapping</strong></p></td>
<td class="confluenceTd"><p><span class="inline-comment-marker" data-ref="b8b8a0db-f75e-4090-a4bb-7dcff70d0c62">As a user, when I set SR, authority auto-sets to Decision-Maker.</span></p></td>
<td class="confluenceTd"><p>Locked, not editable.</p></td>
<td class="confluenceTd"><p>Must</p></td>
<td class="confluenceTd" data-highlight-colour="#e3fcef"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong><span class="inline-comment-marker" data-ref="3e5ed87a-1f10-44d0-8e3f-a0f038e2d1f2">E6: Email Hooks</span></strong></p></td>
<td class="confluenceTd"><p>As a user, emailing a GP uses the GP template with TCID.</p></td>
<td class="confluenceTd"><p>Template preselected; TCID in subject.</p></td>
<td class="confluenceTd"><p>Should</p></td>
<td class="confluenceTd" data-highlight-colour="#f4f5f7"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>E7: Private Partners</strong></p></td>
<td class="confluenceTd"><p>As a user, I can add a GP/pharmacist/etc.</p></td>
<td class="confluenceTd"><p>Dropdown with predefined partner types; saves to partner section.</p></td>
<td class="confluenceTd"><p>Should</p></td>
<td class="confluenceTd" data-highlight-colour="#e3fcef"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>E8: Compliance Export</strong></p></td>
<td class="confluenceTd"><p>As Compliance, I can export contact role history.</p></td>
<td class="confluenceTd"><p>CSV includes timestamps, actor, before/after, authority, primary flag.</p></td>
<td class="confluenceTd"><p>Should</p></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Emails</strong></p></td>
<td class="confluenceTd"><p>I can send administrative or finance emails from Portal</p></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Emails</strong></p></td>
<td class="confluenceTd"><p>I can send Marketing emails from Klaviyo</p></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Emails</strong></p></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
</tr>
<tr>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
<td class="confluenceTd"></td>
</tr>
</tbody>
</table>

</div>

------------------------------------------------------------------------

## 11. Out of Scope

- SMS or push communications.

- Bulk role editing.

- Two-way sync back to MAC.

- In-portal email delivery (covered by CMA).

------------------------------------------------------------------------

## 12. Open Questions

1.  Should roles expand beyond the initial seven (add Guardian, Plan Manager, Pharmacist as first-class)?

2.  Conflict handling: do we require **reason codes** when rejecting imports?

3.  Mobile parity: is view-only enough, or should mobile also support add/edit/import?

4.  Rollout: do we prefer feature-flag + shadow UI or a single release?

------------------------------------------------------------------------

## 13. User Interaction & Design Notes

- **Create Contact (empty state)** → add Main Contact or Private Partner.

- **Main Contact form**: personal details, roles (multi-select), authority auto-mapping, flags for SR/Guardian/PoA requiring documentation. Missing docs trigger warnings.

- **Private Partner form**: structured partner-type list (GP, pharmacist, etc.).

- **View Contacts**: grid with grouped sections (main vs partners), role chips, authority tags, last login/last communication data.

- **Resync button** for imports.  
  *(Confirmed in Care Circle Uplift Figma, pages 1–2.)*

------------------------------------------------------------------------

## 14. Milestones

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| Phase | Owner | Start | End | Notes |
| Schema finalisation | Eng/Product | Aug | Sep | Role/authority list locked |
| Grid uplift & UI scaffolding | Eng | Sep | Sep | ≥15 rows, sticky header |
| Add/Edit/Archive + primary governance | Eng | Sep | Oct | Authority auto-mapping |
| MAC import & diff modal | Eng/Data | Sep | Oct | Monthly cadence + refresh |
| Partner-type support | Eng | Oct | Oct | Predefined dropdown |
| Email template hooks | Eng | Oct | Oct | Mailto w/ TCID |
| Audit & compliance export | Eng | Oct | Oct | CSV export |
| UAT & migration (backfill roles) | Ops/QA | Oct | Nov | Script + training |
| Release | All | Nov | Nov | Aligned to SAH go-live |

</div>

------------------------------------------------------------------------

## 15. Acceptance Criteria (System-Level)

- One **Primary Decision-Maker** enforced per recipient.

- Required fields validated (name, role, authority).

- SR role always = Decision-Maker.

- PoA/Guardian must upload documents.

- Audit logs capture add/edit/archive, authority changes, primary flag, comms sent.

- Imports reconcile with diff modal; no auto-deletes.

- Grid loads 100 contacts in \<1s; search/filter in \<200ms.

- WCAG 2.1 AA compliance.

- **Recipients can view their care circle and see their Primary Decision-Maker clearly flagged.**

------------------------------------------------------------------------

## 16. Risks & Mitigations

<div class="table-wrap">

|  |  |  |
|----|----|----|
| Risk | Impact | Mitigation |
| MAC schema or process changes | Import failures | Contract testing; fallback manual add |
| Authority mis-mapping | Wrong person signs HCA | Dual confirmation on role change; audit alerts |
| Mobile UX degradation | Field teams blocked | Virtual scroll; define MVP parity |
| Mailto limits | No telemetry | Log “intent”; Graph sendMail later (CMA) |

</div>

------------------------------------------------------------------------

## 17. Reference Materials

- **Contact Module Uplift.docx** (authoritative requirements)

- **Care Circle Uplift Figma PDF** (UI/UX reference).

- **CMA – PRD (draft)** (context: email, audit, compliance standards)

- **Big Room Planning August 2025 deck** (context: SAH reforms, portal roadmap)

- Meeting on Sept 24th - <a href="https://app.fireflies.ai/live/01K5AK3CQRB1RZME87DD12WHAT?ref=copied" class="external-link" data-card-appearance="inline" rel="nofollow">https://app.fireflies.ai/live/01K5AK3CQRB1RZME87DD12WHAT?ref=copied</a>

- From the Department: <a href="https://www.health.gov.au/our-work/aged-care-act/about/registered-supporters-in-aged-care" class="external-link" data-card-appearance="inline" rel="nofollow">https://www.health.gov.au/our-work/aged-care-act/about/registered-supporters-in-aged-care</a>

- Registered Supporters Glossary:  
  <a href="https://www.health.gov.au/sites/default/files/2025-09/registered-supporters-glossary.pdf" class="external-link" rel="nofollow">https://www.health.gov.au/sites/default/files/2025-09/registered-supporters-glossary.pdf</a>

- 

</div>

<div class="pageSection group">

<div class="pageSectionHeader">

## Attachments:

</div>

<div class="greybox" align="left">

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [image-20250804-232753.png](attachments/527138848/551780357.png) (image/png)  

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
