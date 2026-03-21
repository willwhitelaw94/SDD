# Idea Brief – Lead Essential (LES)

**Epic**: TP-2315-LES-Lead-Essential
**Initiative**: TP-1858-Consumer-Journey
**Epic Code**: LES
**Status**: Draft

---

## Problem Statement (What)

Sales agents currently rely on fragmented tools (Zoho CRM and manual forms) to capture, manage, and convert leads. This creates inconsistent data, duplicated records, and poor visibility of the sales journey.

The Portal needs a **Leads module** to manage leads end-to-end — from creation and contact capture through to onboarding readiness. This epic (Lead Essentials) focuses on building the **essential/core features** of the Leads module, establishing the foundation for future enhancements and more robust capabilities in subsequent epics.

---

## Possible Solution (How)

Build the **essential core features** of the Leads module in the Portal. This epic establishes the foundational capabilities, with subsequent epics adding more robust features and advanced functionality.

### Core Features

- **Leads List View** as the central workspace displaying all leads in structured, filterable tables
- **Create Lead workflow** (internal and external) enforcing mandatory data (Lead Name, Email) and automatic assignment rules
- **Lead Profile View** with persistent UI elements — Journey Stage bar, Lead Status actions, and Notes — across all tabs
- **Journey Stage and Lead Status wizards** to standardize updates and ensure mandatory data completion
- **Overview Tab** summarizing lead identity, contact hierarchy, and assignment
- **Onboarding capture fields** (Cessation/Commencement Dates, Referral Codes, Management Type) to prepare for conversion to HCA

### Scope Note

This epic focuses on **essential/core functionality only**. Future epics will add:
- Advanced filtering and search capabilities
- Bulk operations and mass updates
- Advanced reporting and analytics
- Integration with additional external systems
- Custom workflows and automation rules

These core features form the foundation for later LTH ("Lead to HCA") automation and enable:
- Structured lead data capture with validation
- Clear journey stage progression tracking
- Automated assignment and routing capabilities
- Seamless conversion readiness workflow

---

## Benefits (Why)

### Single Source of Truth
Creates a centralized system for all lead interactions, reducing reliance on Zoho CRM and manual spreadsheets.
**Target**: 100% of leads managed in Portal (vs. current fragmentation)

### Data Accuracy & Compliance
Enforces mandatory fields and structured updates via guided wizards, eliminating data quality issues.
**Target**: 95%+ lead records with complete mandatory fields

### Real-Time Sales Visibility
Journey Stage and Status indicators provide instant funnel visibility and performance metrics.
**Target**: Real-time dashboard access for sales managers

### Conversion Workflow Foundation
Lays the technical groundwork for conversion workflows, integrations, and automation (LTH, CRM sync).

### Increased Sales Efficiency
Minimizes friction and manual entry, aligning with Trilogy's digital transformation and self-service roadmap.
**Target**: 30% reduction in manual data entry time

---

## Owner (Who)

**Owner**: Head of Product Design

---

## Other Stakeholders (Accountable / Consulted / Informed)

### Accountable
- Product
- Engineering
- Sales Operations

### Consulted
- Sales Team
- Marketing
- Customer Success

### Informed
- Finance
- Compliance
- Training

---

## Assumptions & Dependencies, Risks

### Assumptions & Dependencies

1. **Zoho Integration (Interim)**
   Zoho Leads module integration will provide interim data sync until Portal fully replaces CRM.

2. **Journey Stage & Status Alignment**
   The Journey Stage and Status models align with existing business reporting fields and sales process.

3. **Design Consistency**
   Design dependency for consistent UI across persistent tabs and wizards, following Portal IA conventions.

4. **LTH Module Dependency**
   Future dependency on LTH (Lead to HCA) module for onboarding automation.

### Risks

1. **Data Duplication**
   If CRM and Portal run in parallel beyond transition period.
   **Mitigation**: Clear migration timeline, deprecation of Zoho workflows

2. **Misclassification Risk**
   If submitter/client logic is not validated correctly during lead creation.
   **Mitigation**: Validation rules, data integrity checks, QA testing

3. **User Adoption**
   Sales team resistance to changing from familiar Zoho interface.
   **Mitigation**: Training, gradual rollout, feedback loops

---

## Estimated Effort

| Component | Estimate |
|-----------|----------|
| **Design & IA** | UI for list view, profile, wizards, and persistent tabs — ~1 sprint |
| **Backend** | Core CRUD, models, filtering, assignment logic, validation — ~1.5–2 sprints |
| **Frontend** | List views, profile tabs, wizards, onboarding forms — ~1–1.5 sprints |
| **Integration** | Zoho sync, data migration, validation — ~0.5–1 sprint |
| **QA/UAT & Hardening** | ~0.5–1 sprint |

**Total**: ~3–4 sprints (~$90k–$120k total dev cost)

*(Indicative; refine after technical discovery and dependency confirmation.)*

---

## Proceed to PRD?

**Yes** — LES is foundational to all subsequent Lead and Package modules. It must precede LTH, LGI, and LDS for proper data model alignment.

---

**Last Updated**: 2025-11-11
**Source Documents**:
- LES - 1. Idea Brief - Lead Essential (Confluence Export)
