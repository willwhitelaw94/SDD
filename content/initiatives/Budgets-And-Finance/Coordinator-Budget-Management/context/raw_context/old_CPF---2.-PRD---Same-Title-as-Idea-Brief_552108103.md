<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)

</div>

# <span id="title-text"> Trilogy Care Portal : CPF - 2. PRD - Same Title as Idea Brief </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified on Sep 26, 2025

</div>

<div id="main-content" class="wiki-content group">

<div class="table-wrap">

<table class="confluenceTable" data-table-width="760" data-layout="default" data-local-id="f62d74f9-8d77-4e2f-bf2b-c24cc6125dbb">
<tbody>
<tr>
<th class="confluenceTh"><p>Section</p></th>
<th class="confluenceTh"><p>Details</p></th>
</tr>
&#10;<tr>
<td class="confluenceTd"><ol>
<li><p><strong>Executive Summary</strong></p></li>
</ol></td>
<td class="confluenceTd"><p>Coordinators require a structured workflow to manage, duplicate, edit, and submit client budgets for approval. This includes visibility of client portfolios, utilization rates, and contract prices, with state management for draft/approved/rejected budgets. Care Partners require the ability to review and approve/reject submissions. The solution ensures efficient collaboration, regulatory compliance, and operational scalability.</p></td>
</tr>
<tr>
<td class="confluenceTd"><ol start="2">
<li><p><strong>Goals &amp; Success Metrics</strong></p></li>
</ol></td>
<td class="confluenceTd"><p><strong>Goal 1:</strong> Streamline coordinator budget management → <strong>Metric:</strong> Reduction in time to draft/submit budget → <strong>Target:</strong> 30% decrease. <strong>Goal 2:</strong> Improve accuracy and approval workflows → <strong>Metric:</strong> % of budgets processed without manual rework → <strong>Target:</strong> 90%. <strong>Goal 3:</strong> Increase visibility of utilization → <strong>Metric:</strong> % of coordinators using utilization dashboard → <strong>Target:</strong> 80%.</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Document Status</strong></p></td>
<td class="confluenceTd"><p>Draft</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Confluence Status</strong></p></td>
<td class="confluenceTd"><p>Drafted Sept 2025</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Jira ID</strong></p></td>
<td class="confluenceTd"><p>[Link to Jira ticket]</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Internal / SharePoint Links</strong></p></td>
<td class="confluenceTd"><p>[To be added – Budget V2 docs, Support at Home compliance references]</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Document Owner</strong></p></td>
<td class="confluenceTd"><p>[To be assigned]</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Designer</strong></p></td>
<td class="confluenceTd"><p>[To be assigned]</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Tech Lead</strong></p></td>
<td class="confluenceTd"><p>[To be assigned]</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>QA</strong></p></td>
<td class="confluenceTd"><p>[To be assigned]</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Target Release</strong></p></td>
<td class="confluenceTd"><p>Q4 2025 – aligned with Budget V2 rollout</p></td>
</tr>
</tbody>
</table>

</div>

------------------------------------------------------------------------

### 3. Problem (Why Now)

Coordinators lack efficient tools to manage client budgets in Budgets V2. Without proper implementation, workarounds will risk being halfbaked, error prone, inefficient and labour intensive, and risks delays in client service. This PRD outlines requirments which adress eeh following issues.

1\. Coordinator draft budgets being built from scratch for otherwise small edits.

2.  Lack state management, and Coordinator User associations with clients

3.  Limited visibility of utilization rates.

4.  Lack structured mechanisms to approve/reject coordinator submissions.

------------------------------------------------------------------------

### 4. Audience

<div class="table-wrap">

|  |  |
|----|----|
| Audience | Needs |
| **Coordinators** | Manage portfolios, submit budgets, monitor utilization. |
| **Care Partners** | Review and approve/reject coordinator-submitted budgets. |
| **Clients/Recipients** | Indirect beneficiaries through accurate/timely budgets. |
| **Internal Ops/Finance** | Correct state handling for claims and reporting. |

</div>

------------------------------------------------------------------------

### 5. Outcomes

<div class="table-wrap">

|  |  |
|----|----|
| \# | Outcome |
| 1 | Coordinators can duplicate, edit, and submit budgets efficiently. |
| 2 | Care Partners receive submissions with state tracking (submitted, approved, rejected). |
| 3 | Coordinator organisations support multiple users, each with access only to their clients. |
| 4 | Utilisation rates and contract prices visible to coordinators for accurate planning. |

</div>

------------------------------------------------------------------------

### 6. Assumptions

<div class="table-wrap">

|                                                                       |
|-----------------------------------------------------------------------|
| Assumption                                                            |
| Budget V2 is live and stable.                                         |
| Coordinator organisation and user structures are in place.            |
| Utilisation rate data can be sourced reliably from billing/claims.    |
| State management aligns with Support at Home governance requirements. |

</div>

------------------------------------------------------------------------

### 7. Background / Context

Support at Home reforms require improved budget transparency and state-controlled workflows. Coordinators manage large client loads and need efficient digital tools to duplicate/update budgets. Without these, operational inefficiency and compliance risks increase.

------------------------------------------------------------------------

### 8. Definitions

<div class="table-wrap">

|  |  |
|----|----|
| Term | Definition |
| Coordinator Organisation | Entity with one or multiple coordinator users. |
| Coordinator User | Individual with a unique login, responsible for a portfolio of clients whihc I am teh key coordinator contact for. |
| Budget State | Workflow status of a client budget – Draft, Submitted, Approved, Rejected. |
| Utilisation Rate | Percentage of allocated budget consumed. |
| Care Partner | The Internal care partenr for coordinated clients responsible for approving their budget and services. |

</div>

------------------------------------------------------------------------

### 9. Scope Requirements

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| Epic | User Story | Golden State Scenario | **<span class="inline-comment-marker" ref="9f8c1271-f5fc-4d23-88c4-01a4a8ea2edf">MVP Solution</span>** | Priority |
| **Epic 1 – Coordinator Budget Management** | US 1.1: As a coordinator, I want to see all my clients segmented by new/active/archived, so that I can manage my portfolio. | Coordinator logs in, sees clients grouped by lifecycle status. | Can filter by client belonging to coordinator, but additional state management on new/ existing clients does not exists for coords specifically. | Must |
|  | US 1.2: As a coordinator, I want to duplicate an existing budget into a new draft, so that I can edit without recreating from scratch. | Coordinator selects client → “Duplicate Budget” → new draft created. | This can happen | Must |
|  | US 1.3: As a coordinator, I want to see utilization rates and contract prices, so that I can plan accurately. | Client budget view includes service-level and total utilization. | This can happen | Must |
|  | US 1.4: As a coordinator, I want to see the contract price/target for each service as a value distinct from the sourced price, so that I can select services for my clients that remain within their budget. | Budget view shows contract price alongside sourced price for each service. | This can happen | Must |
| **Epic 2 – Approval Workflow** | US 2.1: As a coordinator, I want to submit new budget ‘drafts’ for approval, so that I can propose changes for review. | Submit button changes budget state to “Submitted”. | There is no ‘Submitted’ state. The care partner will only be able to to see that a draft was made, that it was the most recent on for teh cleint, and that it was drafted by the coordinator. | Must |
|  | US 2.2: As a care partner, I want to approve or reject coordinator submissions, so that I can validate accuracy and compliance. | Care partner receives notification, approves/rejects. | See above | Must |
|  | US 2.3: As a care partner and coordinator , I want to budget approval status, and client- coordinator status (New, Active, Archived) apparent via the UI and automated notifications. | Care Partners and Coordinators receive portal and email notifications for changes, and these metrics to appear in dedicated fields. | Not happening in MVP | Must |
|  | US 2.4: As a coordinator, I want to see the status of my budgets, so that I know what actions are required. | Status indicator shows Approved/Rejected/Submitted. | Not happening in MVP | Must |
| **Epic 3 – Coordinator User Management** | US 3.1: As a coordinator user, I want to see only, (or at least filter by) my assigned clients, so that my portfolio is clear. | User dashboard filtered by client ownership. | Not happening in MVP | Must |
|  | US 3.2: As a system, I want coordinator rates automatically applied to clients, so that fees are consistent and accurate. | Coordinator org settings apply default rate to linked clients. | already implemented | Must |

</div>

------------------------------------------------------------------------

### 10. Out of Scope

<div class="table-wrap">

|                                                                 |
|-----------------------------------------------------------------|
| Item                                                            |
| Automated Care Partner inline edits (manual approval required). |
| Historical budget versioning beyond last draft/current.         |
| Direct client access to coordinator budget workflows.           |

</div>

------------------------------------------------------------------------

### 11. Open Questions

<div class="table-wrap">

|  |  |
|----|----|
| \# | Question |
| 1 | Should Care Partners be able to make inline edits before approving, or must they reject back to coordinator? |
| 2 | Do utilization rates display at service-level only, or also at aggregate package-level? |
| 3 | Will coordinator rates differ by client type or be org-wide defaults? |

</div>

------------------------------------------------------------------------

### 12. User Interaction & Design Notes

<div class="table-wrap">

|  |  |
|----|----|
| Area | Notes |
| Coordinator Dashboard | Segmented client lists (new, active, archived). |
| Budget Editor | Duplicate + edit existing budget, clear submission workflow. |
| State Management | Badge display for Submitted/Approved/Rejected. |
| Care Partner View | Queue of incoming submissions with approve/reject actions. |
| Device Support | Responsive design for smaller laptops and mobile. |

</div>

------------------------------------------------------------------------

### 13. Milestones

<div class="table-wrap">

|             |          |           |          |         |
|-------------|----------|-----------|----------|---------|
| Phase       | Owner    | Start     | End      | Status  |
| Design      | \[Name\] | Sept 2025 | Oct 2025 | Planned |
| Development | \[Name\] | Oct 2025  | Nov 2025 | Pending |
| QA / UAT    | \[Name\] | Nov 2025  | Nov 2025 | Pending |
| Release     | \[Name\] | Nov 2025  | Dec 2025 | Pending |

</div>

------------------------------------------------------------------------

### 14. Reference Materials

<div class="table-wrap">

|                              |
|------------------------------|
| Reference                    |
| Support at Home Budget Rules |
| Budget V2 Documentation      |
| Coordinator Fees & Invoices  |

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
