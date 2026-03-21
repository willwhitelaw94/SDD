---
title: "Business Specification: Lead Essential (LES)"
---

# Business Specification: Lead Essential (LES)

**Created**: 2026-02-21
**Spec Reference**: [spec.md](spec.md)

---

## Executive Summary

Lead Essential replaces Zoho CRM as the primary lead management workspace for Trilogy Care's sales team. It delivers a native Portal module with structured lead profiles, guided status/stage tracking, section-based editing, and a full audit timeline — eliminating fragmented tools and manual handoffs. Success is measured by pipeline visibility: every lead having an accurate Journey Stage and Lead Status at all times.

---

## Business Problem

**Current State**: Sales agents use a mix of Zoho CRM, manual forms, and spreadsheets to manage leads. Data is fragmented, duplicated, and often stale. No single view of the sales pipeline exists.

**Pain Points**:
- Leads split across Zoho and manual processes — no single source of truth
- Inconsistent data entry creates duplicates and quality issues
- No unified pipeline visibility — managers can't see funnel health
- Manual handoffs between systems cause delays and lost information
- No audit trail for status changes or agent interactions

**Opportunity**: Build the foundational lead management module that all future Consumer Lifecycle modules (LTH, LGI, LDS) depend on. Establishing Portal as the primary workspace enables Zoho deprecation.

---

## Business Objectives

**Primary Goals**:
1. **Pipeline visibility** — 100% of leads have accurate Journey Stage + Lead Status (no Unknown/stale records)
2. **Single source of truth** — Portal is the primary workspace for lead management, with bi-directional Zoho sync maintained during transition
3. **Data quality** — Guided wizards enforce mandatory fields at every status/stage transition

**Secondary Goals**:
- Reduce manual data entry time by 30% through section-based editing and quick create
- Enable sales team leader pipeline reporting directly from Portal
- Foundation for LTH conversion automation, LGI lead capture, LDS CRM enrichment

**Non-Goals**:
- Zoho CRM deprecation (separate initiative — LES maintains bi-directional sync)
- AI/predictive lead scoring (future roadmap)
- Marketing automation or lead nurturing workflows

---

## Success Metrics & KPIs

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Pipeline visibility score | ~40% (many leads Unknown/stale in Zoho) | 95%+ leads with valid stage + status | Weekly report: leads with non-null Journey Stage AND Lead Status ÷ total leads |
| Lead-to-conversion rate | Unknown (no tracking) | Baseline established in month 1 | Leads reaching "Converted" ÷ total leads created |
| Time-to-first-contact | Unknown | < 4 hours for new leads | Avg time from lead creation to first "Made Contact" or "Attempted Contact" |
| Data completeness | ~60% profile completion | 80%+ average profile completion | Weighted profile completion score across all active leads |
| Agent assignment coverage | Unknown | 100% of leads assigned within 24h | Leads with assigned_staff_id ÷ total leads (measured daily) |
| Portal adoption | 0% (Zoho primary) | 80%+ lead actions in Portal | Lead status/stage updates in Portal ÷ total updates (Portal + Zoho) |

**North Star Metric**: Pipeline visibility score — the percentage of leads with an accurate, non-stale Journey Stage AND Lead Status.

---

## Stakeholder Analysis

| Stakeholder | Role | Interest | RACI |
|-------------|------|----------|------|
| David Henry | Product Owner, BA | Defines requirements, validates acceptance criteria | **R** (Responsible) |
| Beth Poultney | Designer | UI/UX design, component selection, Figma frames | **R** (Responsible) |
| Khoa Duong | Lead Developer | Architecture, implementation, code quality | **R** (Responsible) |
| Nick Lunn | Head of Department | Budget approval, strategic alignment, go/no-go | **A** (Accountable) |
| Jacqueline Palmer | Sales Team Leader | Primary end user, acceptance testing, workflow validation | **C** (Consulted) |
| Sales Agents | End users | Day-to-day lead management | **I** (Informed) |

---

## Business Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Dual-system confusion (Portal + Zoho in parallel) | HIGH | MEDIUM | Bi-directional sync ensures data parity. Clear communication on Portal as primary. |
| User adoption resistance | MEDIUM | MEDIUM | Training sessions, gradual rollout, feedback loops. Quick create modal reduces friction. |
| Data migration gaps (Zoho → Portal) | HIGH | LOW | Existing sync already handles this. New fields default gracefully for existing leads. |
| Journey Stage model mismatch with business reporting | MEDIUM | LOW | Hybrid model (6 primary + substages) aligns with both simplified funnel view and granular tracking needs. |
| Scope creep into LDS/LGI territory | MEDIUM | MEDIUM | Clear out-of-scope table in spec. Feature flags gate new functionality. |

---

## ROI Analysis

**Investment**:
- Estimated 3–4 sprints (~$90k–$120k) per idea brief
- Primarily dev + design effort; no new infrastructure costs

**Expected Returns**:
- 30% reduction in manual data entry time (sales team of ~10 agents)
- Elimination of duplicate records from multi-system entry
- Foundation for LTH automation (reduces conversion processing from days to minutes)
- Enables future Zoho deprecation (significant license cost saving)

**Payback Period**: Immediate operational efficiency gains; strategic value compounds as LTH, LGI, LDS build on LES foundation.

---

## Market Context

**Target Users**:
- **Primary**: Sales agents (10+) managing 500+ active leads
- **Secondary**: Sales team leaders needing pipeline visibility
- **Tertiary**: Lead owners (consumers/representatives) managing their own profiles

**Competitive Context**: Zoho CRM is a general-purpose CRM. Portal's advantage is deep integration with the aged care domain model (Journey Stages, ACAT, HCP levels) and the conversion pipeline (LTH). No external CRM provides this domain-specific workflow.

**Timing**: LTH (Lead-to-HCA) conversion is already built and depends on enriched lead records. LES unblocks the full conversion pipeline.

---

## Delivery Approach

**Single release** — all 11 user stories shipped together behind a feature flag. No phased rollout. Stories are independent for development but deployed as a cohesive module.

**Auto-assignment**: New leads from public forms or Zoho sync are assigned via round-robin across active sales agents.

---

## Business Clarifications

### Session 2026-02-21
- Q: Journey Stage model — simplified 6 stages vs existing 10-stage enum? -> A: Hybrid — 6 primary stages in the progress bar with optional substages for granularity. Maps old stages during migration.
- Q: Phased delivery or single release? -> A: Single release — all stories shipped together, built now.
- Q: Zoho relationship post-LES launch? -> A: Keep bi-directional sync. Portal is primary, Zoho continues receiving updates for teams not yet migrated.
- Q: Auto-assignment for public/Zoho leads? -> A: Round-robin across active sales agents.
- Q: Primary success metric for stakeholder justification? -> A: Pipeline visibility score — % of leads with accurate Journey Stage + Lead Status.

---

## Approval

- [ ] Business objectives approved
- [ ] Success metrics defined
- [ ] Stakeholders aligned
