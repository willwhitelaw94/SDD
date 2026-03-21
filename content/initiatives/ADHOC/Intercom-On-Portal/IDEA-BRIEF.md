---
title: "Idea Brief: Intercom On Portal (ITC)"
description: "ADHOC > Intercom On Portal"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: ITC (TP-3028) | **Created**: 2026-01-14

---

## Problem Statement (What)

Website visitors (prospective clients, current clients, suppliers) have questions that require manual responses, creating delays and support overhead.

**Pain Points:**
- Manual email responses to website queries are time-consuming
- No instant self-service option for common questions
- Support staff spend time on repetitive inquiries
- Visitors may leave without getting answers

**Current State**: Manual email responses, no AI-assisted self-service, slow turnaround on queries.

---

## Possible Solution (How)

Implement AI chatbot on portal with live chat fallback:

- **AI Chatbot**: Automated responses to common queries using knowledge base
- **Live Chat**: Escalation path when AI cannot resolve
- **Query Logging**: Track all conversations for analysis and improvement
- **Bug Reporting**: Integrated mechanism for users to report issues

```
// Before (Current)
1. Website query via email
2. Manual staff response
3. Slow turnaround
4. No tracking

// After (With ITC)
1. AI chatbot instant response
2. Live chat escalation
3. Fast resolution
4. Full query logging
```

---

## Benefits (Why)

**User/Client Experience:**
- Instant answers to common questions
- 24/7 availability for basic queries

**Operational Efficiency:**
- Reduced manual email handling
- Staff focus on complex queries only

**Business Value:**
- Engagement — keep visitors on site longer
- Conversion — faster answers for prospective clients
- Insights — query analytics inform product decisions

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Naveen Rodrigo (PO), Steven Boge (BA), Ed King (Des), Tim Maier (Dev) |
| **A** | Will Whitelaw |
| **C** | Will Whitelaw |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Intercom or similar platform provides required AI/chat capabilities
- Knowledge base content exists or can be created for AI training
- Portal infrastructure supports embedded chat widget

**Dependencies:**
- Intercom platform subscription and integration
- Knowledge base content development
- Portal deployment access

**Risks:**
- AI response quality (MEDIUM impact, MEDIUM probability) → Thorough training and human fallback
- Integration complexity (LOW impact, LOW probability) → Standard Intercom integration patterns
- User adoption (MEDIUM impact, LOW probability) → Prominent placement and onboarding

---

## Success Metrics

- Query response time <30 seconds for AI-handled queries
- AI resolution rate >60% without human escalation
- Support email volume reduction 30%+
- User satisfaction scores for chat interactions

---

## Estimated Effort

**S (Small) — 1-2 sprints**

- Sprint 1: Intercom integration, knowledge base setup
- Sprint 2: AI training, testing, launch

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Evaluate Intercom vs alternatives
2. Develop initial knowledge base content
3. `/speckit.specify` — Create detailed technical specification
