# PRD -- ASS2: Inclusion Lifecycle, Needs, Compliance & Action-Plan Engine

## 1. Executive Summary

ASS2 delivers the full downstream governance engine for Assistive
Technology & Home Modifications (ATHM) under Support at Home (SAH).\
Where ASS1 provides structured assessment intake, AI extraction,
Recommendations, and backend Inclusion seeds, ASS2 activates:

-   the complete Inclusion lifecycle\
-   Needs modelling and consolidation\
-   readiness and eligibility rules\
-   funding pathway logic\
-   automated invoice gating and matching\
-   Inclusion index & detail view\
-   structured Action Plans powered by a clinical criteria index

ASS2 ensures full compliance, traceability, auditability, and financial
correctness.

## 2. Problem Statement

Trilogy currently has no regulated downstream engine to validate,
govern, or enforce ATHM funding rules.

ASS1 introduced structured Recommendation and Inclusion seed creation,
but does not provide:

-   governed Inclusion lifecycle\
-   readiness rules\
-   eligibility/funding workflow\
-   Needs modelling\
-   automated invoice gating\
-   clinical criteria--driven action plans

ASS2 provides the rule-driven system required for SAH compliance, audit,
and operational efficiency.

## 3. Audience

-   Care Partners\
-   Billing Processors\
-   Compliance & Audit\
-   Supplier Relations\
-   Data & Operations\
-   Coordinators (action plans)

## 4. Goals & Success Metrics

  ------------------------------------------------------------------------
  **Goal**             **Metric**                **Target**
  -------------------- ------------------------- -------------------------
  Ensure all ATHM      \% invoices matched to a  ≥95%
  spend follows        Ready Inclusion           
  readiness &                                    
  eligibility rules                              

  Reduce manual        Invoice-on-hold volume    −40% in 6 weeks
  billing effort       reduction                 

  Establish unified    \% Inclusions linked to a 100%
  clinical planning    Need                      

  Improve traceability Completeness across Need  100%
                       → Inclusion → Assessment  
                       chain                     
  ------------------------------------------------------------------------

### Assumptions

-   ASS1 Recommendation quality is consistent\
-   Clinical criteria index available\
-   Funding rules are stable

## 5. Background / Context

Support at Home requires every ATHM item to be clinically justified,
traceable, and compliant with evidence, eligibility, and funding rules.

ASS2 covers:

-   Inclusion lifecycle\
-   Needs modelling\
-   Readiness checks\
-   Eligibility/funding rules\
-   Invoice gating\
-   Clinical criteria mapping\
-   Assessment consolidation

It enables consistent downstream decisioning and structured planning.

## 6. Requirements (User Stories)

Below is the unified ASS2 user story set.

------------------------------------------------------------------------

### **ASS2-1 --- Create Full Inclusion Objects**

**As a CP/System**, I want backend seeds from ASS1 to instantiate into
full Inclusion objects.\
**AC:**\
- Links to Assessment, Recommendation, Budget, Tier-5\
- Visible in Inclusion index & detail view

------------------------------------------------------------------------

### **ASS2-2 --- Inclusion Lifecycle States**

**As the System**, I want a full lifecycle (Draft → Ready → Active →
Closed).\
**AC:**\
- Moves to Ready when readiness checks pass\
- Actions requiring readiness cannot proceed if not Ready\
- Active/Closed transitions governed by defined rules

------------------------------------------------------------------------

### **ASS2-3 --- Readiness Checklist**

**As a CP**, I want readiness items visible so I know what is required
before progression.\
**AC:**\
- Checklist items: evidence, Tier-5, quotes, eligibility, staleness\
- Progression blocked when requirements are unmet\
- Auto-updates when evidence arrives

------------------------------------------------------------------------

### **ASS2-4 --- Funding Pathway Assignment**

**As the System**, I want to assign funding pathways so approvals are
consistent.\
**AC:**\
- Rules run automatically\
- Applies contribution and eligibility logic\
- Prevents ineligible items from reaching Ready state with clear reason
codes

------------------------------------------------------------------------

### **ASS2-5 --- Create Need Objects**

**As the System**, I want Needs created from Recommendations.\
**AC:**\
- Needs created and linked to Inclusions\
- Retro-creation for historical V1 data

------------------------------------------------------------------------

### **ASS2-6 --- Needs Consolidation**

**As the System**, I want to consolidate multiple assessments into
stable Needs.\
**AC:**\
- Consolidation rules define overrides and merges\
- Links maintained to history

------------------------------------------------------------------------

### **ASS2-7 --- Invoice Gating & Auto-Matching**

**As a Billing Processor/System**, I want invoices auto-matched and
gated based on Inclusion readiness.\
**AC:**\
- Auto-hold when no Ready Inclusion\
- Auto-release when criteria met\
- Displays strong match and confidence signals

------------------------------------------------------------------------

### **ASS2-8 --- Inclusion Index & Search**

**As a CP/Compliance**, I want to search and filter all Inclusions.\
**AC:**\
- Filters: Tier-5, Need, lifecycle state, supplier, funding stream\
- Detail view shows complete history & evidence

------------------------------------------------------------------------

### **ASS2-9 --- Action Plan Engine**

**As a Coordinator**, I want structured action plans generated
automatically.\
**AC:**\
- Based on Needs + Inclusion readiness gaps\
- Tasks update dynamically when state changes

------------------------------------------------------------------------

### **ASS2-10 --- Clinical Criteria Index**

**As the System Owner**, I want a canonical criteria index.\
**AC:**\
- Used for mapping Needs, Inclusions, and Requests\
- Versioned and centrally governed

------------------------------------------------------------------------

### **ASS2-11 --- Assessment Consolidation Engine**

**As the System**, I want to unify overlapping assessment data.\
**AC:**\
- Rules determine whether to merge or separate\
- Maintains full history & traceability

------------------------------------------------------------------------

## 7. Out of Scope

ASS2 excludes: - New extraction or mapping logic (ASS1)\
- Assessment upload workflow\
- Recommendation acceptance workflows\
- Budget prepopulation logic

## 8. User Interaction & Design Notes

### Inclusion Index

-   Table view with filters\
-   Lifecycle badges & state indicators

### Inclusion Detail Page

-   Linked Recommendations and Assessments\
-   Readiness checklist\
-   Evidence viewer\
-   Funding pathway & eligibility reasons

### Invoice Matching UI

-   Match strength indicators\
-   Auto-hold reason codes\
-   Release workflow

### Action Plans

-   Task grouping by criteria\
-   Real-time updates

## 9. Milestones

Design: In progress\
Development: Pending\
QA / UAT: Pending\
Release: Pending

## 10. Reference Materials

-   High-Level Architecture Summary\
-   Epic Split Master Map\
-   SAH Reform Requirements\
-   Internal BRP documentation\
-   Confluence PRD templates
