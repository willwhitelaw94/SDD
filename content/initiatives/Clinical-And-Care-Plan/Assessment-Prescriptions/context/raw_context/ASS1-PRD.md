---
title: "PRD: Assessment Intake, AI Extraction & Recommendation Workflow (ASS1)"
---


**Epic**: TP-1904
**Initiative**: TP-1859 Clinical & Care Plan
**Status**: Draft
**Version**: 2.1
**Last Updated**: 2025-11-14

**Team**:
- BA/Requirements: David
- Product Owner/SME: Romi
- Design Lead: Beth
- Tech Lead: Khoa
- Data Lead: Katja

---

## 1. Executive Summary

ASS1 delivers the foundational Assessment Intake & Recommendation Workflow for the SAH (Support at Home) program. Care Partners create Assessment Requests and select onboarded suppliers (for OT assessments). Suppliers receive a secure link, log in, and upload ATHM (Assistive Technology and Home Modifications) assessment documents. AI extraction identifies products/modifications with Tier-5 classification mapping, assessors review and confirm via mandatory human-in-the-loop UI, and Care Partners accept recommendations which then prepopulate Service Plan items (budget lines).

Upon acceptance, the system creates backend-only Inclusion Seeds for future ASS2 lifecycle activation. This workflow addresses regulatory compliance requirements, operational efficiency gaps, invoice matching accuracy, and data quality issues stemming from unstructured assessment documentation.

---

## 2. Problem Statement

Under SAH funding, ATHM items must be assessed, mapped to Tier-5 classifications, and backed by verifiable evidence. Today's process involves:

- **Unstructured documents**: PDFs, emails, quotes arriving without consistent format
- **Inconsistent Tier-5 classification**: Manual mapping leads to variability
- **Inability to surface structured recommendation data**: Budget lines lack traceable evidence
- **Bill processors lacking context**: Invoice matching delayed due to missing Tier-5 and evidence links
- **Avoidable invoice-on-hold delays**: Manual intervention required for matching
- **Fragmented documentation storage**: Evidence scattered across systems

These issues create regulatory compliance risk, operational inefficiency, and delays in invoice processing.

---

## 3. Goals & Metrics

### Goals
1. Improve assessment-to-budget speed
2. Improve mapping consistency through AI-assisted Tier-5 classification
3. Provide verifiable evidence chain for compliance
4. Enable efficient invoice matching for billing processors

### Success Metrics

| Metric | Target | Measurement Window |
|--------|--------|-------------------|
| Median assessment→budget cycle time reduction | -30% | 4 weeks post-launch |
| AI Tier-5 accuracy | ≥80% | At launch |
| Assessor recommendation confirmation rate | To be determined | To be determined |
| CP acceptance rate of recommendations | To be determined | To be determined |

---

## 4. User Personas

### Primary Users

**Care Partners (CPs)**
- Create Assessment Requests on packages and select assessment type
- Select onboarded suppliers verified for the assessment type (i.e. OT assessments)
- Review and accept assessor recommendations (no reject - can ignore instead)
- Add accepted recommendations to Service Plan (budget)
- Primary decision-makers for budget allocation

**Registered Assessors** (OT, Physio, Nurse, Contractor)
- Upload assessment documents via secure logged-in workflow
- Review and correct AI-extracted recommendations
- Confirm all recommendations before submission

### Secondary Users

**Billing Processors**
- Read-only access to Tier-5 context and evidence for manual invoice matching
- No auto-gating functionality in ASS1

**Compliance & Operations**
- Audit trail access across all state changes
- Export and filter audit logs by package

---

## 5. Functional Requirements

| Title | User Story | Acceptance Criteria | Notes |
|-------|-----------|---------------------|-------|
| **5.0 CP Creates Assessment Request (ASS1-0)** | As a Care Partner, I can create an Assessment Request for a package so that suppliers can submit assessment documents. | • CP creates Assessment on package and selects assessment type (OT, Physio, Nurse, Contractor, etc.)<br>• For OT assessments, CP selects an onboarded supplier from list<br>• System generates secure link for the supplier<br>• Supplier receives notification with link<br>• Assessment Request visible in CP's workflow with status tracking | |
| **5.1 Assessment Document Upload (ASS1-1)** | As an Assessor, I want to upload assessment documents so the system can extract ATHM information. | • Assessor receives secure link from CP's Assessment Request<br>• Assessor logs in using existing Portal credentials (if unregistered, account creation handled)<br>• Supports PDFs, images, and multi-file uploads<br>• Captures metadata: uploader, timestamp, document type, package association<br>• Validates file size and format | |
| **5.2 Document Typing (ASS1-2)** | As the System, I need to classify documents (report/quote/amendment) for accurate extraction. | • Auto-classification based on content analysis<br>• Manual override available for assessors<br>• Document type influences extraction strategy | Full document type enum and assessment type schema pending from Romi. |
| **5.3 AI Extraction (ASS1-3)** | As the System, I need to extract product/modification details and suggest Tier-5 mapping. | • Extracts individual ATHM items with product/modification details<br>• Suggests terminal tier classification:<br>&nbsp;&nbsp;- **Products** → Tier-5<br>&nbsp;&nbsp;- **Services** → Generally Tier-3<br>• Displays confidence score for each extraction<br>• Stores raw extraction output for audit trail<br>• Identifies pathway: Low Risk, Advice (requires practitioner letter), or Prescribed (requires full OT assessment) | Tier-5 dataset is maintained internally. Full mapping and pathway requirements pending from Romi. |
| **5.4 Correction & Confirmation UI (ASS1-4)** | As an Assessor, I want to edit and confirm extracted recommendations to ensure accuracy. | • Inline search and code correction for Tier-5 classifications<br>• Every recommendation requires manual confirmation (mandatory human-in-the-loop)<br>• Audit logging for all edits<br>• Visual indicators for confidence scores<br>• Search and filter capabilities for Tier-3/4/5 hierarchy | |
| **5.5 Submit Recommendations (ASS1-5)** | As an Assessor, I want to submit confirmed recommendations so CPs can review them. | • Validation gating: all recommendations must be confirmed before submission<br>• CP receives automatic notification upon submission<br>• Submission timestamp and assessor captured<br>• Submission is immutable once completed | |
| **5.6 CP Review of Recommendations (ASS1-6)** | As a CP, I want to accept recommendations to control budget allocation. | • Per-item Accept action (no reject - CP can ignore instead)<br>• Only accepted recommendations become budget-eligible<br>• Accepted recommendations remain visible on assessment<br>• Ignoring a recommendation leaves it in submitted state (can accept later) | |
| **5.7 Add Recommendations to Service Plan (ASS1-7)** | As a CP, I want to add accepted recommendations to the Service Plan (budget) so funding can be allocated. | • CP uses "Add Service" action to add accepted recommendation to Service Plan<br>• Only the **terminal tier value** (Tier-5 for products, Tier-3 for services) is passed from recommendation to Service Plan item<br>• All other fields follow normal budget-item creation flow (CP enters description, quantity, cost, etc.)<br>• Editing or removing Service Plan items does not delete source recommendations<br>• Bidirectional links maintained: Service Plan Item ↔ Assessment ↔ Recommendation<br>• Service Plan items reference source assessment and recommendation IDs | |
| **5.8 Backend Inclusion Seed Creation (ASS1-8)** | As the System, I need to create Inclusion Seeds when CP accepts recommendations. | • Inclusion Seed created silently when CP **accepts** a recommendation (not when added to Service Plan)<br>• Contains raw text/data from the recommendation<br>• Includes links to Assessment, Recommendation, and Tier-5 classification<br>• **For Advice and Prescribed pathways only** (Low Risk items do not create Inclusion Seeds)<br>• No lifecycle management or UI in ASS1 (reserved for ASS2)<br>• Inclusion Seed remains backend-only data structure<br>• CP sees recommendation on assessment; accepting creates seed; CP then uses "Add Service" to push to Service Plan | Why "Seed"? In V1, it contains minimal data. ASS2 will enrich with action plans, needs validation, and lifecycle management. |
| **5.9 Billing Visibility (ASS1-9)** | As a Billing Processor, I want to view Tier-5 context so I can match invoices to Service Plan items. | • Tier value (Tier-5 or Tier-3) appears on Service Plan item<br>• Invoice AI classifies uploaded invoices with Tier-5 value<br>• UI shows tier-coded items clearly for CPs and billing processors (integrated into existing Service Plan and Invoice UI, not a new screen)<br>• Billing processor can match: Invoice Tier-5 → Service Plan Tier-5<br>• **ASS1 provides context only** - no auto-gating or auto-release of invoices<br>• Benefit: Reduced manual interpretation, not full automation | |
| **5.10 Tier-5 Canonical Dataset (ASS1-10)** | As a System Owner, I need a canonical Tier-5 dataset to ensure consistent classification. | • Versioned Tier-5 dataset (Tier-3 → Tier-4 → Tier-5 hierarchy)<br>• Graceful degradation if dataset unavailable (allow manual entry with warning)<br>• Dataset includes descriptions and classification rules<br>• Updates to dataset do not invalidate historical classifications | |
| **5.11 Audit Logging (ASS1-11)** | As Compliance, I need comprehensive audit logging across all state changes. | • All actions logged: uploads, edits, confirmations, submissions, Accept/Reject, budget additions<br>• Immutable audit trail<br>• Exportable in standard formats<br>• Filterable by package, user, action type, date range<br>• Includes before/after state for all modifications | |

---

## 6. Non-Functional Requirements

### Performance
- To be determined - awaiting user input on upload size limits, extraction latency, UI response times

### Security
- Assessor authentication required (no anonymous access)
- Role-based access control: Assessors (upload/edit), CPs (review/budget), Billing (read-only), Compliance (audit)
- Audit logging immutable

### Data Quality
- AI Tier-5 accuracy target: ≥80% at launch
- Mandatory human-in-the-loop for all recommendations
- Bidirectional links maintained across Assessment → Recommendation → Budget → Inclusion

### Scalability
- System must handle high-volume assessment workflows
- To be determined - specific throughput and concurrency requirements awaiting user input

---

## 7. Data Structures

### Recommendation Object

**Confirmed Fields**:
- Terminal tier code (Tier-5 for products, Tier-3 for services)
- Product name/description
- Quantity
- Price/cost estimate
- Confidence score (from AI extraction)
- Status (Draft/Submitted/Accepted)
- Linked Assessment ID
- Linked Inclusion Seed ID (once created)
- Pathway (Low Risk, Advice, Prescribed)

### Pathways

**Low Risk**:
- No assessment required
- CP uses "Add Service" directly
- No Inclusion Seed created

**Advice**:
- Requires practitioner letter
- Inclusion Seed created on CP acceptance
- CP then uses "Add Service"

**Prescribed**:
- Requires full OT assessment
- Inclusion Seed created on CP acceptance
- CP then uses "Add Service"

**Note**: Full pathway requirements and Tier-5 mappings pending from Romi.

---

## 8. User Flows

### 8.1 Entry Points

**For Care Partners**:
- CP creates Assessment Request on package
- Selects assessment type (OT, Physio, Nurse, Contractor, etc.)
- For OT assessments, selects onboarded supplier
- System generates secure link for supplier

**For Assessors**:
- Receive secure link (via email/notification)
- Click link → Login using existing Portal credentials (if unregistered, account creation handled)
- Access Assessment workspace

### 8.2 Assessor Workflow

1. **Upload Documents**: PDF/images uploaded with metadata capture
2. **Document Typing**: System auto-classifies (report/quote/amendment), assessor can override
3. **AI Extraction**: System extracts ATHM items, suggests Tier-3/4/5, displays confidence scores
4. **Correction UI**: Assessor reviews extractions, edits Tier-5 codes using search/filters, confirms each recommendation
5. **Submit**: All recommendations confirmed → Submit → CP notified

**Mapping UI Features**:
- Tier-3/4/5 hierarchy display
- Search and filter capabilities
- Confidence score indicators
- Inline editing

### 8.3 CP Workflow

1. **Create Assessment Request**: CP creates Assessment on package, selects type and supplier (for OT)
2. **Notification**: Receive alert when assessor submits recommendations
3. **Review**: View submitted recommendations with Tier-5 classifications and evidence links
4. **Accept**: Per-item Accept action (no reject - can ignore instead)
   - Accepting creates Inclusion Seed silently (for Advice/Prescribed pathways only)
   - Recommendation remains visible on assessment
5. **Add Service**: CP uses "Add Service" action to push accepted recommendation to Service Plan
   - Only terminal tier value (Tier-5 or Tier-3) is prefilled
   - CP enters description, quantity, cost, etc. following normal budget flow

### 8.4 Billing Visibility Workflow

1. **Invoice Receipt**: Billing processor receives invoice
2. **Manual Review**: Access Tier-5 context and evidence for matching
3. **No Auto-Gating**: ASS1 provides context only; no automatic hold/release logic

### 8.5 Backend Inclusion Seed Creation

**Trigger**: CP accepts a recommendation (not when added to Service Plan)

**Process**:
1. System silently creates Inclusion Seed containing raw text/data from recommendation
2. Links Assessment ID, Recommendation ID, Tier-5 classification
3. Only for Advice and Prescribed pathways (Low Risk items do not create Inclusion Seeds)
4. Stores for ASS2 activation (no lifecycle or UI in ASS1)

**V1 (ASS1)**: Seed contains minimal data
**V2 (ASS2)**: Enriched with action plans, needs validation, lifecycle management

---

## 9. Dependencies, Risks & Out of Scope

### Dependencies

| Dependency | Owner | Status | Impact |
|-----------|-------|--------|---------|
| Registered-supplier assessor access | To be determined | To be determined | Required for authenticated uploads |
| AI extraction service | Data Lead (Katja) | To be determined | Core functionality |
| Backend Inclusion Seed object (no UI) | Tech Lead (Khoa) | To be determined | Required for ASS2 integration |
| Service Plan "Add Service" capability | Tech Lead (Khoa) | To be determined | Required for CP workflow |
| Tier-5 canonical dataset (internally maintained) | Data Lead (Katja) | Active | Required for classification |
| **Full assessment type schema** | **Romi (PO)** | **Pending** | **Required for document typing** |
| **Document type enum** | **Romi (PO)** | **Pending** | **Required for classification strategy** |
| **Tier-5 pathway requirements** | **Romi (PO)** | **Pending** | **Required for Inclusion Seed logic** |

### Assumptions

1. Assessors can authenticate and upload via Portal
2. AI extraction achieves sufficient accuracy for human-in-the-loop workflow
3. Tier-5 dataset is available and versioned
4. CPs have budget management permissions

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Report variability impacts AI accuracy | High | High | Mandatory human-in-the-loop, confidence scores, graceful degradation |
| Assessors do not complete human-in-loop | Medium | High | Validation gating prevents submission without confirmation |
| High-volume stresses workflows | Medium | Medium | To be determined - performance testing required |
| Tier-5 dataset unavailable | Low | Medium | Graceful degradation: allow manual entry with warning |

### Out of Scope for ASS1

The following features are explicitly OUT of scope and belong to ASS2 or later phases:

- Inclusion lifecycle management or UI
- Inclusion index/list views
- Needs modelling or editing
- Funding pathway or eligibility rules
- Invoice auto-hold/auto-release logic
- Multi-assessment consolidation logic
- Action Plans
- Claims processing
- CSV ingestion
- Services Australia API integrations
- Supplier procurement workflows

---

## Appendix: Background Context

Under SAH, ATHM funding requires validated assessment evidence mapped to Tier-5 classifications. The workflow sequence is:

1. **CP Creates Assessment Request**: CP selects assessment type and supplier (for OT)
2. **Assessor Uploads Documents**: Assessor receives link, logs in, uploads documents
3. **AI Extraction**: System extracts ATHM items and suggests terminal tier codes (Tier-5 for products, Tier-3 for services)
4. **Human Correction**: Assessor reviews and confirms recommendations
5. **Recommendations Submitted**: Submitted to CP for review
6. **CP Accepts Recommendations**: Acceptance creates Inclusion Seed (for Advice/Prescribed pathways only)
7. **Add Service**: CP uses "Add Service" to push recommendation to Service Plan (only terminal tier value prefilled)
8. **Billing Visibility**: Tier values visible on Service Plan items and invoices for matching

**Key Principle**: ASS1 is the foundational intake workflow. It does NOT include Inclusion lifecycle, Needs logic, invoice auto-gating, consolidation, or Action Plans. These belong to ASS2.

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.1 | 2025-11-14 | David (BA) | Incorporated workflow clarifications: Added CP Assessment Request story (ASS1-0), updated authentication flow, clarified Inclusion Seed creation trigger, removed rejection workflow, updated budget prepopulation to Service Plan, added Data Structures section with Recommendation Object and Pathways, added pending dependencies from Romi |
| 2.0 | 2025-11-13 | Discovery Agent | Regenerated with strict source fidelity using 9-section lean format |
| 1.0 | To be determined | To be determined | Original PRD from Confluence migration |

---

**Related Documents**:
- Idea Brief: ASS1-IDEA-BRIEF.md
- User Stories: USER-STORIES/user-stories.csv
- RACI Matrix: ASS1-RACI.md
- Jira Epic: [TP-1904](https://your-jira-instance.atlassian.net/browse/TP-1904)
