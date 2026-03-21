---
title: "Idea Brief: Home Modifications"
---

# Idea Brief: Home Modifications

**Epic Code**: SR7
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft

---

## The Problem

Home modifications are one of the most complex service types in the Support at Home programme. A single modification project can involve multiple quotes, state-specific documentation requirements, staged payments tied to construction milestones, and photo evidence of progress and completion. Today, this entire process is managed outside the portal through emails, spreadsheets, and manual document tracking.

Specific pain points:

- **No structured project lifecycle** -- home modification projects have distinct stages (quoting, documentation, review, approval, construction, completion) but there is no system to track where a project is in this lifecycle. Care Partners and coordinators rely on email threads and spreadsheets to know what stage a modification is at
- **State-specific documentation is not enforced** -- each state and territory has different documentation requirements for home modifications (e.g., council approvals, OT reports, building certifications). Currently there is no systematic way to know which documents are required for a given state, and missing documents are only discovered at audit
- **Quote management is disconnected** -- suppliers submit quotes via email or ad-hoc uploads. There is no standard way to link a quote to a specific client, compare quotes from multiple suppliers, or track which quote was approved
- **Payment milestones are untracked** -- home modifications are typically paid in instalments (e.g., deposit, progress payment, completion payment) but the portal has no concept of staged payments. Each payment is processed as a standalone bill with no linkage to project progress
- **No photo evidence trail** -- progress photos and completion photos are critical for compliance and quality assurance but are stored in email attachments or external systems, not linked to the project record
- **Child-parent project relationships are unsupported** -- complex modifications may have sub-projects (e.g., bathroom modification as part of a whole-of-house project) but the current system has no way to represent hierarchical project structures

---

## The Solution

Build the **Home Modifications module** in the supplier portal that manages the full lifecycle of modification projects from quote to completion.

1. **Project Lifecycle Management** -- Each home modification is a project with defined stages: New -> Quoted -> Documents Received -> Under Review -> Escalated -> Approved -> Rejected -> Completed. Stage transitions are auditable and enforce prerequisites (e.g., cannot move to "Under Review" without required documents)
2. **Quote Submission and Management** -- Suppliers submit quotes through the portal, linked to a specific client/consumer. Multiple quotes can be submitted for the same project. Quotes are reviewed and one is approved, linking it to the project record
3. **State-Specific Documentation Matrix** -- A configurable matrix defines which documents are required for each state/territory (Boolean matrix: document type as columns, state/territory as rows). The system enforces that all required documents are uploaded before a project can proceed to review
4. **Payment Instalment Tracking** -- Projects support staged payments linked to milestones. Each instalment is linked to the project, the approved quote, and the client's budget. Progress and completion photos can be uploaded as evidence for each payment milestone
5. **Photo Evidence Management** -- Progress photos and completion photos are uploaded against specific project milestones, creating an auditable visual record of work completed
6. **Automated Linkage** -- Projects automatically link to client inclusions and budget line items, leveraging the assessment-budget-supplier chain established in SR6
7. **Child-Parent Projects** -- Complex modifications can be structured as parent projects with child sub-projects, each with their own lifecycle, quotes, and payment milestones

---

## Why Now

- **SR6 (Assessments & Products) establishes the assessment-to-supplier chain** -- home modifications build on this by adding project lifecycle, staged payments, and documentation management on top of the existing linkage model
- **State-based requirements are being documented** -- Sophie Pickett is actively compiling state-specific documentation requirements, making this the right time to systematise them
- **Home modifications are high-value, high-risk** -- individual projects can run into tens of thousands of dollars with significant compliance obligations. The manual process creates both financial and regulatory risk
- **Resource constraints delayed this work** -- the project was postponed in February due to resource constraints but the dependency chain (SR0 -> SR4 -> SR6) is now clearing

---

## RACI

| Role | Person | Responsibility |
|------|--------|----------------|
| Accountable | Will Whitelaw | Epic owner, spec approval |
| Responsible | David Henry (Lead), Dev team | Implementation, domain expertise |
| Consulted | Sophie Pickett | State-based documentation requirements |
| Consulted | Khoa Duong | Data model, billing integration |
| Informed | Care Partners | End users of the modification tracking |

---

## Success

- Suppliers can submit quotes and manage home modification projects entirely through the portal
- 100% of state-specific documentation requirements are enforced before project approval
- Payment instalments are linked to project milestones with photo evidence
- Care Partners can see the full lifecycle of a client's home modification from a single project view
- Zero home modification payments processed without linked project approval and documentation

---

## Estimated Effort

| Metric | Value |
|--------|-------|
| **Size** | L (Large) |
| **Confidence** | Low-Medium |

**Key Drivers**: Project lifecycle state machine, state-specific documentation matrix (needs Sophie's input), payment instalment tracking with photo uploads, child-parent project hierarchy, integration with SR6 assessment chain and SR4 billing pipeline. Confidence is lower than SR6 because state-based requirements are still being compiled.

**Assumptions**: SR0, SR4, and SR6 are in place. The state-specific documentation matrix will be provided by Sophie Pickett. Existing client inclusion and budget models can support linkage to home modification projects.

---

## Links

- [Spec](/initiatives/Supplier-REDONE/SR7-Home-Modifications/spec)
- [SR6 - Assessments & Products](/initiatives/Supplier-REDONE/SR6-Assessments-Products/spec)
- [SR4 - Billing & Invoicing](/initiatives/Supplier-REDONE/SR4-Billing-Invoicing)
- [SR0 - API Foundation](/initiatives/Supplier-REDONE/SR0-API-Foundation/spec)
- Parent: [Supplier REDONE](/initiatives/Supplier-REDONE)
- Miro: https://miro.com/app/board/uXjVJzwLzeE=/
- V0 Prototype: https://v0.app/chat/tpc-flow-implementation-rQGYEhPWQVd
- Jira: https://trilogycare.atlassian.net/browse/TP-3155
