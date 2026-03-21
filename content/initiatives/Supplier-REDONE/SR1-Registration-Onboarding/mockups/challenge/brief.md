---
title: "Design Challenge Brief: SR1 Registration & Onboarding"
---

# Design Challenge Brief: SR1 Registration & Onboarding

## The Problem

Of ~13,000 supplier profiles, only ~5,000 have completed onboarding. ~4,000 are partially complete and ~4,000 have not started. The current registration flow creates a flat Organisation + Supplier in one shot with no way to add multiple supplier entities under the same ABN. The onboarding wizard lacks progress visibility, has mobile usability issues (iPhone failures), and verification is a black box.

## What We're Designing

A complete supplier registration and onboarding experience covering:

1. **Registration** — ABN lookup, organisation creation, duplicate detection
2. **5-Step Onboarding Wizard** — Business Details, Locations, Pricing, Documents, Agreements
3. **Verification Dashboard** — PENDING_VERIFICATION read-only preview with EFTSure indicators
4. **Tier 2 Entity Management** — Org Admins adding additional supplier entities

## Screens

| # | Screen | Key Requirements |
|---|--------|-----------------|
| 1 | Registration | ABN lookup (XX XXX XXX XXX format), ABR business name dropdown, duplicate ABN warning, account creation |
| 2 | Onboarding Wizard (Step 1) | 5-step progress indicator, Business Details form |
| 3 | Locations Step | Add/edit/remove locations, address with Google Places, service radius |
| 4 | Documents Step | Org-level vs supplier-level grouping, upload checklist, rejected document handling |
| 5 | Verification Dashboard | PENDING_VERIFICATION status, EFTSure green/yellow/red indicators, read-only preview |
| 6 | Add Supplier Entity | Org Admin view, existing entities with status cards, add new entity form |

## Design Constraints

- **Mobile-first**: Suppliers register on phones. Touch targets 48px minimum.
- **TC Brand**: Navy #2C4C79, Teal #007F7E, Green #4DC375, Orange #FF8F51, Red #E04B51
- **Sequential flow**: Steps are sequential for first completion, freely editable after
- **Informed consent**: Agreement must be scrolled to bottom before signing

## The 4 Students

| # | Student | Paradigm | Focus |
|---|---------|----------|-------|
| 1 | Wizard Wayne | Wizard | Classic step-by-step, vertical progress sidebar on desktop, horizontal stepper on mobile |
| 2 | Gamified Gina | Gamified | Progress bars, completion %, micro-celebrations, achievement unlocks |
| 3 | Mobile Mo | Mobile-First | Thumb-friendly, bottom navigation, card-based steps, 48px touch targets |
| 4 | Split-Panel Sam | Split Panel | Persistent progress/context on left, form content on right |
