---
title: "Design Challenge Brief: Needs V2 — Aged Care Maslow Hierarchy"
---

# Design Challenge Brief: Needs V2

## Challenge Overview
Design a simplified needs capture module for aged care, organized by a Maslow-inspired hierarchy adapted for aged care contexts. Care Partners need to quickly record client needs, link services, and see the full picture at a glance.

## Feature Summary
- Needs categorised by a 5-tier aged care Maslow hierarchy (Essential Care → Growth & Wellbeing)
- 15 specific categories across the 5 tiers
- Quick create flow: pick category → describe need → link services → done
- List view grouped by Maslow tier on the package page
- Linked services (existing package services/budget items) attached to each need
- Status lifecycle: Draft → Active → Archived

## Aged Care Maslow Hierarchy

| Tier | Name | Categories |
|------|------|------------|
| 1 | Essential Care (Physiological) | Nutrition & Hydration, Personal Hygiene & Continence, Mobility & Transfers, Pain & Symptom Management, Sleep & Rest |
| 2 | Safety & Health | Falls Prevention & Home Safety, Medication Management, Wound Care & Skin Integrity, Emergency Response & Monitoring |
| 3 | Connection & Belonging | Social Connection & Community, Family & Carer Support, Cultural & Spiritual Needs |
| 4 | Dignity & Independence | Daily Living & Independence, Cognitive Stimulation & Mental Health |
| 5 | Growth & Wellbeing | Goals & Life Enrichment |

## User Stories to Address
1. Create a need with Maslow category, description, and funding source
2. Link existing package services to a need
3. View all needs grouped by Maslow tier
4. Expand a need to see linked services and full details
5. Edit, archive, and manage needs

## Key Interactions to Design
1. **Needs list view** — how needs are displayed and organized on the package tab
2. **Create/add need** — the flow for capturing a new need quickly
3. **Need detail** — expanded view showing linked services and actions

## Constraints
- Must replace the current needs tab on the package page
- Must coexist with v1 data (feature flag rollout)
- Care Partners are the primary users (field workers, not admin)
- Speed is critical — current form takes 20+ minutes, target is under 2 minutes
- Must work on laptop screens (no mobile requirement for v1)

## Evaluation Criteria
1. **Speed** — How fast can a Care Partner capture a need?
2. **Clarity** — Is the Maslow organization intuitive and helpful?
3. **Scalability** — Does it work for 2 needs or 20?
4. **Service Linking** — How naturally does linking services fit the flow?

## Students

| # | Student | Paradigm | Focus |
|---|---------|----------|-------|
| 1 | Pyramid Petra | **Visual Hierarchy** | Maslow pyramid as the literal UI, colour-coded tiers, spatial layout |
| 2 | Clinical Chris | **Clinical/EHR** | SOAP-note style, structured fields, assessment-like, dense professional layout |
| 3 | Canvas Clara | **Card Canvas** | Trello-style board with swim lanes per tier, draggable need cards |
| 4 | Minimal Maya | **Minimal Zen** | Ultra-clean, typography-driven, progressive disclosure, speed-first |

## Deliverables Per Student
1. 3 HTML mockup screens (list view, create flow, detail view)
2. `rationale.md` — Why these patterns work for TC Portal
