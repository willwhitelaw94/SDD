---
title: "Idea Brief: AI Chatbot Sidebar (ACS)"
description: "Infrastructure > AI Chatbot Sidebar"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Created**: 2026-03-29
**Epic Code**: ACS
**Initiative**: Infrastructure

---

## Problem Statement (What)

- Care Partners spend significant time navigating between pages and searching for client information across the Portal
- Contextual questions ("When was the last home visit?", "Who's the emergency contact?") require multiple clicks to different tabs/pages
- No way to quickly summarise or cross-reference information across a client's record without manually reviewing each section
- New Care Partners have a steep learning curve navigating the Portal and understanding client histories

**Current State**: All information retrieval is manual — Care Partners click through tabs, scroll through records, and mentally piece together context. No AI assistance exists in the Portal.

---

## Possible Solution (How)

Build a **context-aware AI chatbot sidebar** that is accessible from every page in the Portal, powered by the Laravel AI SDK:

- **Persistent Sidebar** — Slide-out chat panel available on every page via a floating action button
- **Record-Aware Context** — Automatically knows which client/record the user is viewing (like Gemini in Gmail)
- **Auth-Scoped Tools** — AI can only access data the authenticated user is authorised to see (respects all policies, gates, scopes)
- **Streaming Responses** — Real-time token-by-token output via SSE for a responsive feel
- **Conversation Memory** — Persistent chat history per user so conversations can be continued across sessions
- **Domain Tools** — AI can look up clients, search touchpoints, check care plans, review appointments, summarise incidents via Eloquent-backed tools

```
// Before (Current)
1. Care Partner views client profile
2. Needs to check last touchpoint — navigates to Touchpoints tab
3. Needs emergency contact — navigates to Contacts tab
4. Needs recent incidents — navigates to Incidents section
5. Mentally pieces together the full picture

// After (With ACS)
1. Care Partner views client profile
2. Opens chat sidebar: "Summarise John Smith's recent activity"
3. AI responds with touchpoints, incidents, upcoming appointments — all in one answer
4. Follow-up: "Who's his emergency contact?" — instant answer
```

---

## Benefits (Why)

**User/Client Experience**:
- **Faster information retrieval**: 60-80% reduction in clicks/navigation for common queries
- **Contextual intelligence**: AI understands what record the user is on — no need to re-explain context

**Operational Efficiency**:
- **Onboarding acceleration**: New Care Partners can ask the AI instead of hunting through unfamiliar UI
- **Reduced cognitive load**: One conversation replaces multiple tab switches and mental aggregation

**Business Value**:
- **Platform differentiation**: AI-native care management sets TC Portal apart from competitors
- **Foundation for future AI features**: Agents, automated care plan summaries, risk detection all build on this infrastructure

**ROI**: Estimated 2-4 hours/week saved per Care Partner on information retrieval tasks

---

## Owner (Who)

William Whitelaw — Engineering Lead

---

## Other Stakeholders

**Accountable**: William Whitelaw
**Consulted**: Dev Team, Care Partner team leads (for user stories validation)
**Informed**: Product, Clinical team

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Laravel AI SDK (`laravel/ai`) is stable enough for production use (Laravel 13 first-party package)
- Anthropic (Claude) will be the primary text/agent provider
- Existing Eloquent models, policies, and scopes are sufficient for tool data access
- Users have reliable internet for streaming SSE responses

**Dependencies**:
- `laravel/ai` package installed and configured
- Anthropic API key provisioned
- SSE streaming endpoint (separate from Inertia request/response cycle)
- `agent_conversations` + `agent_conversation_messages` migrations run

**Risks**:
- **API costs** (MEDIUM) → Mitigation: Rate limiting per user, token budgets, monitoring via events
- **Hallucination / incorrect data** (HIGH) → Mitigation: Tools return real Eloquent data only, AI cannot fabricate records; disclaimer in UI
- **Latency on first response** (LOW) → Mitigation: Streaming makes perceived latency minimal
- **Data leakage across users** (HIGH) → Mitigation: Every tool enforces `Gate::authorize()` / policy checks; scoped to authenticated user

---

## Estimated Effort

**3 sprints / 6 weeks**, approximately 30-40 story points

- **Sprint 1**: Foundation — Package setup, agent class, core tools (LookupClient, SearchTouchpoints), SSE streaming endpoint, basic sidebar Vue component
- **Sprint 2**: Context & Memory — Page context injection, conversation persistence, additional tools (CarePlan, Appointments, Incidents), UI polish
- **Sprint 3**: Production readiness — Rate limiting, cost monitoring, error handling, feature flag (Pennant), Pest tests, Gate 4 checklist

---

## Proceed to PRD?

**YES** — Clear user need, well-understood technology (Laravel AI SDK), and this lays the foundation for all future AI features in the Portal.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information** - [What's needed?]
- [ ] **Declined** - [Reason]

**Approval Date**: [YYYY-MM-DD]

---

## Next Steps

**If Approved**:
1. [ ] Create spec.md (functional requirements, user stories)
2. [ ] Create design.md (design brief)
3. [ ] Create plan.md (technical architecture)
4. [ ] Create Linear project
5. [ ] Break down into implementation tasks

**If Declined**:
- Revisit when Laravel AI SDK has more production adoption / case studies

---

**Notes**: This epic uses the Laravel AI SDK (`laravel/ai`) announced in Laravel 13. The SDK provides a unified PHP API for AI providers with first-party support for agents, tools, streaming, conversation memory, structured output, and testing fakes. The chatbot sidebar would be the first AI feature in TC Portal and establishes the pattern for all future AI capabilities.
