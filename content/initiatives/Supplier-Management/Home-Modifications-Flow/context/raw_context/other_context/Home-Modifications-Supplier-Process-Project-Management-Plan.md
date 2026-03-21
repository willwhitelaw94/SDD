---
title: "Home Modifications Supplier Process - Project Management Plan"
---


## Quick Links

- **Miro Board:** https://miro.com/app/board/uXjVJzwLzeE=/?share_link_id=774537749377
- **Vibe:** https://v0.app/chat/tpc-flow-implementation-rQGYEhPWQVd?ref=TL2ZRL
- **Loom:** https://www.loom.com/share/e55e4802d3bb4cda9683d989844d3e1f

| **Work Package** | **Home Modifications Supplier Process** |
|-----------------|----------------------------------------|
| **Project Sponsor** | Erin Headley |
| **Project Manager** | Kathryn Oliver |

## Purpose

To establish a streamlined, compliant, and fully digital workflow for onboarding and managing Home Modifications suppliers under the Support at Home model.

The process defines end-to-end actions — from supplier registration to project completion — ensuring all Home Modifications engagements are compliant, traceable, and system-managed through the Trilogy Care Portal.

## Scope

**In Scope**

- Portal development for Home Modifications supplier registration and project management.
- Workflow automation (status updates, document review notifications).
- Compliance review and linkage between supplier, client inclusion, and budget item.
- Dashboard enhancements for Compliance Team visibility.
- User acceptance testing (UAT) and live monitoring post-launch.

**Out of Scope**

- Non-Home Modifications suppliers (other service categories).
- Retrospective data entry for pre-existing projects.
- External contractor payment integrations.

## Functional Requirements

| **Requirement** | **Description** |
|----------------|-----------------|
| **R1** | Supplier's price list includes "Home Modifications" as Quote/Project item type. |
| **R2** | Selecting this service creates a dedicated Home Modifications tab in supplier profile. |
| **R3** | Each project entry includes metadata (details, attachments, workflow status). |
| **R4** | Portal links approved projects to client inclusions and budget items. |
| **R5** | Rejections trigger automatic notifications with reasons and corrective instructions. |
| **R6** | Compliance Dashboard widget displays pending linkages and reviews. |
| **R7** | Supplier Portal displays progress bar and status banner per project card. |

## Workflow Summary

1. **Care Partner Approval:** Inclusion requiring Home Modifications is approved.
2. **Supplier Registration:** Supplier registers via Portal (if not already verified).
3. **Service Selection:** Supplier selects "Home Modifications" under Quote/Project rate.
4. **Document Upload:** Supplier attaches quote and required compliance documentation.
5. **Compliance Review:** Submission reviewed; inclusion and budget item linked upon approval.
6. **Portal Status Update:** Automated status change and stakeholder notifications issued.

**Workflow Status Stages:**
New → Quoted → Documents Received → Under Review → Escalated → Approved / Rejected → Completed

## User Interface (UI) and Experience (UX) Recommendations

- Progress bar on supplier Portal showing real-time stage within the workflow.
- Clear status banners (colour-coded) for each project card.
- Document summary section listing all uploaded files and highlighting missing items.
- Compliance Dashboard widget displaying "Pending Linkages," "Under Review," and "Escalated" projects.
- Automated pop-up or banner when compliance actions are completed or rejected.

## Deliverables

| **ID** | **Deliverable** |
|--------|----------------|
| PD001 | Updated Supplier Portal with Home Modifications tab and workflow. |
| PD002 | Compliance Dashboard with new Home Modifications widget. |
| PD003 | UAT report confirming automated status changes and linkage accuracy. |
| PD004 | Supplier Quick Reference Guide (PDF). |
| PD005 | Post-launch audit report after 4 weeks of live use. |

## Success Criteria

| **ID** | **Goal** | **Measurement / Target** | **Responsible Team** | **Verification Method** |
|--------|----------|-------------------------|---------------------|------------------------|
| SC001 | End-to-end use of Portal for Home Modifications | 100% of suppliers complete onboarding and project submission within Portal | Compliance & DEV | Activity audit |
| SC002 | Correct linkage of project records | 100% of Home Modifications quotes linked to project | Compliance & DEV | Audit log verification |
| SC003 | Automated compliance updates | All project status changes occur automatically | Compliance & DEV | UAT and live monitor |
| SC004 | No manual tracking outside Portal | 0 manual spreadsheets used for supplier–project tracking | Compliance & DEV | Quarterly review |

## Risks & Mitigations

| **Risk** | **Impact** | **Likelihood** | **Mitigation Strategy** |
|----------|-----------|---------------|------------------------|
| Delayed supplier adoption | Medium | Medium | Include supplier training and guide with screenshots |
| Portal errors during early use | High | Medium | Conduct UAT and soft launch phase |
| Compliance bottleneck due to volume | Medium | Medium | Introduce auto-notifications and priority queue |
| Incorrect linkage or data mismatch | High | Low | Enable audit trail and manual override for QA |

## Communication Plan

| **Audience** | **Channel** | **Frequency** | **Purpose** |
|-------------|------------|--------------|-------------|
| DEV & Compliance Teams | Weekly stand-up | Weekly | Track build progress |
| Project Sponsor | Email summary | Fortnightly | Progress reporting |
| Care Partners | Training update | Pre-launch | Explain new workflow |
| Suppliers | Email + Portal Guide | Launch week | Instruction on using the new feature |

## Sign Off

| **Date** | 2025-11-13 |
|----------|-----------|
| **Project Manager** | Kathryn Oliver |
| **Project Lead** | Zoe Judd |
