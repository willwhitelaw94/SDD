---
title: "Idea Brief: Supplier Organisation Identity"
---

# Idea Brief: Supplier Organisation Identity

**Epic Code**: SOI
**Created**: 2026-03-09
**Status**: Draft
**Owner**: Will Whitelaw

---

## The Problem

Suppliers in TC Portal register as individuals, not as organisations. The first person from a provider business to register becomes the sole "owner" of that supplier account. There is no supported way for a second employee to join the same account — so they register again, creating a duplicate Supplier record under the same ABN.

This causes:
- **Duplicate supplier records** — same ABN, two Supplier entries, split invoice history and compliance documents
- **Manual merging** — ops teams spend time identifying and collapsing duplicates
- **No team management** — the registered owner has no way to invite colleagues, see who has access, or remove a former employee
- **Hidden legal identity** — the ABN and legal trading name (the true identity) are buried; the portal shows a "business name" that may not match the legal entity

The root cause is architectural: **supplier registration works at the individual level, not at the organisation level**.

---

## The Solution

Refactor the supplier registration and access model so that:

1. **The ABN/Organisation is the canonical identity** — registering with an existing ABN joins that organisation rather than creating a new one
2. **Teams work** — Supplier Administrators can invite colleagues, manage roles, and remove access
3. **Legal identity is visible** — the portal clearly shows the ABR-verified legal name and ABN as the source of truth
4. **No more duplicates** — duplicate detection at registration eliminates the root cause

---

## Why Now

- The Supplier Bill Submission (SBS) feature is landing, meaning more suppliers are actively using the portal
- Duplicate records are already occurring and growing in frequency as onboarding volume increases
- The Business layer (Organisation → Business → Supplier) is a known architectural debt — now is the right time to address it before more features are built on top of it

---

## RACI

| Role | Person | Responsibility |
|------|--------|----------------|
| Accountable | Will Whitelaw | Epic owner, spec approval |
| Responsible | Dev team | Implementation |
| Consulted | Operations | Duplicate resolution process, Zoho ABN matching |
| Informed | Supplier-facing team | Change to registration flow |

---

## Success

- Zero new duplicate Supplier records for existing ABNs
- Supplier Administrators can manage their team without contacting TC Care
- Support tickets for "duplicate accounts" and "can't add a colleague" drop to zero

---

## Estimated Effort

| Metric | Value |
|--------|-------|
| **Size** | L (Large) |
| **Days** | 50–65 |
| **Cost Range** | ~$150k–$195k |
| **Confidence** | Medium |

**Key Drivers**: Cross-cutting registration flow change (highest-risk path in the portal), new team/invite data model, 3 distinct user types (Supplier Staff, Supplier Admin, TC Admin), ABR integration dependency, unified nav refactor

**Assumptions**: ABR API already integrated, `OrganisationWorker` model exists, email infrastructure in place, two fixed roles only (no custom permissions)

---

## Links

- [Spec](/initiatives/Supplier-Management/Supplier-Org-Identity/spec)
- Related: [Supplier Onboarding 2](/initiatives/Supplier-Management/Supplier-Onboarding-2/)
- Related: [Supplier Bill Submission](/initiatives/Supplier-Management/Supplier-Bill-Submission/)
